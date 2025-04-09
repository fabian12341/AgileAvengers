from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
import librosa
import tempfile
import warnings

from transcript import transcribe_audio
from voice_analysis import extract_speaker_audio, extract_audio_features, analyze_voice_emotion
from text_analysis import extract_speaker_transcripts, extract_text_sentiment
from summary_suggestions import process_conversation

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

@app.route("/analyze-call", methods=["POST"])
def analyze_call():
    # Get file from multipart form
    audio_file = request.files.get("audio")
    if not audio_file:
        return jsonify({"error": "No audio file uploaded"}), 400

    # Save audio file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        temp_audio.write(audio_file.read())
        audio_path = temp_audio.name

    # Extract metadata from form (or fallback to default)
    client = request.form.get("client", "Client Name")
    agent = request.form.get("agent", "Agent Name")
    language = request.form.get("language", "es")
    num_speakers = int(request.form.get("num_speakers", 2))
    datetime = request.form.get("datetime", "Unknown Date")

    # Load audio
    audio, sr = librosa.load(audio_path, sr=None)
    duration = librosa.get_duration(y=audio, sr=sr)
    
    # Size of the whisper model
    MODEL_SIZE = "medium"

    # Convert to WAV if not already
    if not audio_path.endswith('.wav'):
        wav_path = audio_path + ".wav"
        subprocess.run(["ffmpeg", "-i", audio_path, wav_path, "-y"], check=True)
        audio_path = wav_path

    # Transcript
    segments, formatted_transcript, clean_transcript = transcribe_audio(language, num_speakers, audio_path, MODEL_SIZE)

    # Role mapping
    output = process_conversation(formatted_transcript)
    role_map = {v: k for k, v in output["role_map"].items()}
    for segment in segments:
        segment['speaker'] = role_map.get(segment['speaker'], segment['speaker'])
    structured_transcript = [{"speaker": seg["speaker"], "text": seg["text"]} for seg in segments]

    # Summary & Suggestions
    summary = output["summary"]
    suggestions = [{i + 1: s} for i, s in enumerate(output["suggestions"])]

    # Voice Features
    audio_paths = extract_speaker_audio(audio_path, segments)
    features = extract_audio_features(audio_paths)
    silence_percentage = features["original"]["Silence Percentage"]
    features.pop("original")
    emotion_results = analyze_voice_emotion(audio_paths)

    # Text Sentiment
    text_sentiments = {}
    sentiment = extract_text_sentiment(clean_transcript, language)
    text_sentiments["original"] = sentiment

    speaker_transcripts = extract_speaker_transcripts(segments)
    for speaker, transcript in speaker_transcripts.items():
        text_sentiments[speaker] = extract_text_sentiment(transcript, language)

    # Overall Emotion Score
    text_score = sentiment["score"]
    if sentiment["sentiment"] == "neutral":
        text_score *= 0.5
    elif sentiment["sentiment"] == "negative":
        text_score = -text_score

    emotion_weights = {"ang": -1, "hap": 1, "neu": 0.5, "sad": -1}
    voice_score = sum(emotion_weights[emo] * conf for emo, conf in emotion_results["original"].items())
    voice_score = max(-1, min(1, voice_score))

    overall_score = (0.7 * text_score) + (0.3 * voice_score)
    overall_score = (overall_score + 1) * 50  # Scale to [0, 100]

    # Final response
    response_data = {
        "agent": agent,
        "client": client,
        "call_duration": duration,
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

    return jsonify(response_data), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)