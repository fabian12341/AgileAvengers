import subprocess
import os
from transcript import transcribe_audio
from voice_analysis import extract_speaker_audio, extract_audio_features, analyze_voice_emotion
from text_analysis import extract_speaker_transcripts, extract_text_sentiment
from speaker_identification import label_transcript 
from summarization import generate_summary
import librosa
import json
import warnings
warnings.filterwarnings("ignore")

#################################### Path to audio file ####################################
audio_path = "Python/audios/conversacion.mp3"
audio, sr = librosa.load(audio_path, sr=None)  # Load audio file


#################################### Constants ####################################
DURATION = librosa.get_duration(y=audio, sr=sr) 
CLIENT = "Checando"
AGENT = "XX"
LANGUAGE = "es" # "es" for Spanish, "en" for English, "any" for anything else
NUM_SPEAKERS = 2 # needs to be >=2
DATETIME = "2023-10-01 12:00:00" # Date and time of the call
MODEL_SIZE = "medium" # "tiny, "base", "small", "medium", "large"

print(f"Duration: {DURATION:.2f} seconds")


#################################### Converting to wav ####################################
print("************* Converting audio file to WAV forma ************* \n")
def convert_to_wav(input_audio, output_audio):
    try:
        subprocess.run(["ffmpeg", "-i", input_audio, output_audio, "-y"], check=True)
        return output_audio
    except subprocess.CalledProcessError as e:
        print("Error converting file:", e)
        return None

# Check if the file needs conversion
if not audio_path.endswith('.wav'):
    print("The file is not a WAV audio file. Converting...")
    # Ensure the output path has the correct `.wav` extension
    output_path = os.path.splitext(audio_path)[0] + '.wav'
    audio_path = convert_to_wav(audio_path, output_path)
else:
    print("The file is a WAV audio file.")
print("\n")  


#################################### Creating transcript ####################################
print("************************** Creating transcript ************************** \n")
segments, formatted_transcript, clean_transcript = transcribe_audio(LANGUAGE, NUM_SPEAKERS, audio_path, MODEL_SIZE)
print(formatted_transcript)
print("\n")


#################################### Labelling transcript (role identification) ####################################
print("************************** IDENTIFYING ROLES IN THE TRANSCRIPT ************************** \n")
formatted_transcript, role_map = label_transcript(formatted_transcript, LANGUAGE)
print("\n")
print(formatted_transcript)
print("\n")

# Update the speaker labels
for segment in segments:
    segment['speaker'] = role_map.get(segment['speaker'], segment['speaker'])
    
# Convert transcript into structured format
structured_transcript = [
    {"speaker": seg["speaker"], "text": seg["text"]}
    for seg in segments
]

#################################### Creating summary ####################################
print("************************** SUMMARIZING THE TRANSCRIPT ************************** \n")
summary = generate_summary(formatted_transcript, LANGUAGE)
print(f"Summary:\n{summary}\n")


#################################### Voice Analysis ####################################
print("************************** ANALYZING VOICE FEATURES AND EMOTION ************************** \n")
audio_paths = extract_speaker_audio(audio_path, segments) # dictionary with audio paths
features = extract_audio_features(audio_paths)
silence_percentage = features["original"]["Silence Percentage"]
features.pop("original")
emotion_results = analyze_voice_emotion(audio_paths)  # Analyze the original audio
print("\n")


#################################### Text Analysis ####################################
print("************************** Analyzing text sentiment ************************** \n")
text_sentiments = {}

# Analyze sentiment for the entire conversation
sentiment = extract_text_sentiment(clean_transcript, LANGUAGE)
text_sentiments["original"] = sentiment
print(f"Sentiment for the entire conversation:\n{sentiment}\n")

speaker_transcripts = extract_speaker_transcripts(segments)
for speaker, transcript in speaker_transcripts.items():
    result = extract_text_sentiment(transcript, LANGUAGE)
    text_sentiments[speaker] = result
    print(f"Sentiment for {speaker}:\n{result}\n")
print("\n")


#################################### Overall Emotion Score ####################################
print("************************** Calculating Overall Emotion Score ************************** \n")

# Text Sentiment Score
text_sentiment = sentiment["sentiment"]  # "positive", "neutral", or "negative"
text_score = sentiment["score"]  # Confidence score (0 to 1)

if text_sentiment == "positive":
    text_score = text_score  # Keep as is
elif text_sentiment == "neutral":
    text_score = text_score * 0.5  # Boost neutral
elif text_sentiment == "negative":
    text_score = -text_score  # Map to negative range

# Voice Emotion Score
emotion_weights = {
    "ang": -1,  # Anger → Negative
    "hap": 1,   # Happiness → Positive
    "neu": 0.5, # Neutral → Slightly Positive
    "sad": -1   # Sadness → Negative
}

voice_score = sum(emotion_weights[emotion] * confidence 
                  for emotion, confidence in emotion_results["original"].items())  # Dictionary with confidence values
voice_score = max(-1, min(1, voice_score))  # Ensure within range [-1, 1]

# Weighted Combination
overall_score = (0.7 * text_score) + (0.3 * voice_score)
overall_score = (overall_score + 1) * 50  # Shift to [0, 1] range and then scale to [0, 100]

print(f"Overall Emotion Score: {overall_score:.2f}% (Range: 0% to 100%)")


#################################### JSONIFY ####################################

data = {
    "agent": AGENT,
    "client": CLIENT,
    "call_duration": DURATION,
    "datetime": DATETIME,
    "silence_percentage": silence_percentage,
    "language": LANGUAGE,
    "num_speakers": NUM_SPEAKERS,
    "transcript": structured_transcript,
    "overall_emotion": overall_score,
    "voice_features": features, 
    "emotions": emotion_results,  # Contains voice emotion scores
    "text_emotion": text_sentiments,  # Contains text sentiment scores
}

# Save as a JSON file
file_name = "Python/call_analysis.json"
with open(file_name, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"JSON saved as {file_name}")