from flask import Flask, request, jsonify
import subprocess
import os
from transcript import transcribe_audio
from voice_analysis import extract_speaker_audio, extract_audio_features, analyze_voice_emotion
from text_analysis import extract_speaker_transcripts, extract_text_sentiment
from summary_suggestions import process_conversation
import librosa
import warnings

warnings.filterwarnings("ignore")

app = Flask(__name__)

@app.route("/analyze-call", methods=["POST"])
def analyze_call():
    data = request.json  # Expecting JSON input with audio file path
    audio_path = data.get("audio_path")
    client = data.get("client", "Checando")
    agent = data.get("agent", "XX")
    language = data.get("language", "es")
    num_speakers = data.get("num_speakers", 2)
    datetime = data.get("datetime", "2023-10-01 12:00:00")

    if not audio_path or not os.path.exists(audio_path):
        return jsonify({"error": "Invalid audio file path"}), 400

    # Load audio
    audio, sr = librosa.load(audio_path, sr=None)

    # Constants
    DURATION = librosa.get_duration(y=audio, sr=sr)
    MODEL_SIZE = data.get("model_size", "medium")

    # Convert to WAV if necessary
    if not audio_path.endswith('.wav'):
        output_path = os.path.splitext(audio_path)[0] + '.wav'
        subprocess.run(["ffmpeg", "-i", audio_path, output_path, "-y"], check=True)
        audio_path = output_path

    # Generate transcript
    segments, formatted_transcript, clean_transcript = transcribe_audio(language, num_speakers, audio_path, MODEL_SIZE)

    # Identify roles
    output = process_conversation(formatted_transcript)
    role_map = output["role_map"]
    role_map = {v: k for k, v in role_map.items()}  # Reverse mapping

    for segment in segments:
        segment['speaker'] = role_map.get(segment['speaker'], segment['speaker'])

    structured_transcript = [{"speaker": seg["speaker"], "text": seg["text"]} for seg in segments]

    # Summary & Suggestions
    summary = output["summary"]
    suggestions = [{i + 1: suggestion} for i, suggestion in enumerate(output["suggestions"])]

    # Voice Analysis
    audio_paths = extract_speaker_audio(audio_path, segments)
    features = extract_audio_features(audio_paths)
    silence_percentage = features["original"]["Silence Percentage"]
    features.pop("original")
    emotion_results = analyze_voice_emotion(audio_paths)

    # Text Analysis
    text_sentiments = {}
    sentiment = extract_text_sentiment(clean_transcript, language)
    text_sentiments["original"] = sentiment

    speaker_transcripts = extract_speaker_transcripts(segments)
    for speaker, transcript in speaker_transcripts.items():
        result = extract_text_sentiment(transcript, language)
        text_sentiments[speaker] = result

    # Calculate Overall Emotion Score
    text_sentiment = sentiment["sentiment"]
    text_score = sentiment["score"]

    if text_sentiment == "positive":
        text_score = text_score
    elif text_sentiment == "neutral":
        text_score = text_score * 0.5
    elif text_sentiment == "negative":
        text_score = -text_score

    emotion_weights = {"ang": -1, "hap": 1, "neu": 0.5, "sad": -1}
    voice_score = sum(emotion_weights[emotion] * confidence for emotion, confidence in emotion_results["original"].items())
    voice_score = max(-1, min(1, voice_score))

    overall_score = (0.7 * text_score) + (0.3 * voice_score)
    overall_score = (overall_score + 1) * 50  # Scale to [0, 100]

    # Prepare response
    response_data = {
        "agent": agent,
        "client": client,
        "call_duration": DURATION,
        "datetime": datetime,
        "silence_percentage": silence_percentage,
        "language": language,
        "num_speakers": num_speakers,
        "transcript": structured_transcript,
        "summary": summary,
        "suggestions": suggestions,
        "overall_emotion": overall_score,
        "voice_features": features,
        "emotions": emotion_results,
        "text_emotion": text_sentiments,
    }
    
    # Clean up temporary files
    temp_dir = "temp_files"
    if os.path.exists(temp_dir):
        for file_name in os.listdir(temp_dir):
            file_path = os.path.join(temp_dir, file_name)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")
    
    temp_dir = "temp_files/speaker_audios"
    if os.path.exists(temp_dir):
        for file_name in os.listdir(temp_dir):
            file_path = os.path.join(temp_dir, file_name)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")

    return jsonify(response_data)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Render sets a dynamic PORT
    app.run(host="0.0.0.0", port=port)
    