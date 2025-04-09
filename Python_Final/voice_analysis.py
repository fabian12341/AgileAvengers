from collections import defaultdict
import os
import librosa
import numpy as np
from pydub import AudioSegment
import parselmouth
from transformers import pipeline
os.environ["TOKENIZERS_PARALLELISM"] = "false"

def extract_speaker_audio(audio_path, segments, output_dir="speaker_audios/"):

    # Load the original audio file
    audio_file = AudioSegment.from_file(audio_path)

    # Store timestamps for each speaker
    speaker_audio_segments = defaultdict(list)

    for segment in segments:
        speaker = segment["speaker"]
        start_ms = int(segment["start"] * 1000)  # Convert seconds to milliseconds
        end_ms = int(segment["end"] * 1000)  # Convert seconds to milliseconds
        speaker_audio_segments[speaker].append((start_ms, end_ms))

    # Create output directory if it doesn't exist
    output_dir = os.path.join(os.path.dirname(__file__), "temp_files/speaker_audios/")
    os.makedirs(output_dir, exist_ok=True)
    
    # Extract and save audio segments for each speaker
    for speaker, times in speaker_audio_segments.items():
        speaker_audio = AudioSegment.silent(duration=0)  # Empty audio file to append segments to

        for start, end in times:
            speaker_audio += audio_file[start:end]  # Concatenate speaker's parts

        # Save the speaker's audio file
        speaker_audio.export(f"{output_dir}/{speaker}.wav", format="wav")
        
    # Dictionary to store the audio file paths
    audio_paths = {}
    audio_paths['original'] = audio_path

    for speaker in speaker_audio_segments.keys():
        audio_paths[speaker] = f"{output_dir}/{speaker}.wav"
    
    print(audio_paths)
    return audio_paths


def extract_audio_features(audio_paths):   
    features = {}  # Dictionary to store features for each speaker
    
    for speaker, path in audio_paths.items():
        # Load audio file
        audio, sr = librosa.load(path, sr=16000)
        
        # Skip audio files with no data (if there are errors and audio is empty)
        if audio.size == 0:
            print(f"Error loading {path}")
            continue
        
        # Feature extraction only for individual speakers (not the original call)
        if speaker != 'original':
            # Pitch (Fundamental Frequency)
            f0, voiced_flag, _ = librosa.pyin(audio, fmin=50, fmax=300)
            pitch_mean = np.nanmean(f0)
            pitch_std = np.nanstd(f0)
            
            # Loudness (RMS Energy)
            rms = np.sqrt(np.mean(audio**2))

            # Zero-Crossing Rate (ZCR)
            zcr = librosa.feature.zero_crossing_rate(audio)
            mean_zcr = np.mean(zcr)

            # Harmonics-to-Noise Ratio (HNR)
            snd = parselmouth.Sound(audio)
            hnr = np.mean(snd.to_harmonicity().values) 
            
            # Calculate Tempo (beats per minute)
            onset_env = librosa.onset.onset_strength(y=audio, sr=sr)  
            tempo, _ = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr)
            tempo = tempo.item()  # Convert np.float64 to float
            
            features[speaker] = {
                "Pitch Mean": float(pitch_mean),
                "Pitch Std Dev": float(pitch_std),
                "Loudness (RMS Energy)": float(rms),
                "Zero-Crossing Rate": float(mean_zcr),
                "Harmonics-to-Noise Ratio": float(hnr),
                "Tempo (BPM)": float(tempo)
            }
        
        # Silence percentage only for the original call
        if speaker == 'original':
            silence_threshold = 0.005  # Threshold for silence (adjust as needed)
            silence_frames = np.sum(np.abs(audio) < silence_threshold)
            silence_percentage = (silence_frames / len(audio)) * 100
            features[speaker] = {"Silence Percentage": float(silence_percentage)}

    return features


def analyze_voice_emotion(audio_paths, chunk_duration_ms=30000):
    # Load the emotion detection pipeline with the 'superb/wav2vec2-base-superb-er' model
    emotion_model = pipeline("audio-classification", model="superb/wav2vec2-base-superb-er")
    
    emotion_results = {}
    
    for speaker, path in audio_paths.items():
        audio = AudioSegment.from_wav(path)
        
        if audio.duration_seconds == 0:
            print(f"Error: Audio duration is 0 seconds for {speaker}.")
            continue
        
        num_chunks = len(audio) // chunk_duration_ms
        emotions = []  # List to store emotions from each chunk
        
        # Split audio into chunks
        for i in range(num_chunks + 1):
            start_time = i * chunk_duration_ms
            end_time = min((i + 1) * chunk_duration_ms, len(audio))  # Ensure the last chunk isn't out of range
            
            chunk = audio[start_time:end_time]
            chunk.export("temp_files/temp_chunk.wav", format="wav")
            
            # Run emotion detection on the chunk
            result = emotion_model("temp_files/temp_chunk.wav")
            emotions.append(result)
        
        # Average the results from all chunks (based on the confidence scores)
        emotion_counts = defaultdict(list)
        for chunk_result in emotions:
            for emotion in chunk_result:
                emotion_counts[emotion['label']].append(emotion['score'])
        
        # Calculate the average confidence for each emotion
        averaged_results = {label: np.mean(scores) for label, scores in emotion_counts.items()}
        
        # Store results for the speaker
        emotion_results[speaker] = averaged_results
    
    return emotion_results

