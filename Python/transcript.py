import whisper
import datetime
import subprocess
import torch
import wave
import contextlib
from sklearn.cluster import AgglomerativeClustering
import numpy as np
from pyannote.audio import Audio
from pyannote.core import Segment
from pyannote.audio.pipelines.speaker_verification import PretrainedSpeakerEmbedding

embedding_model = PretrainedSpeakerEmbedding(
    "speechbrain/spkrec-ecapa-voxceleb",
    device=torch.device("cpu"))

#################################### Transcribe audio ####################################

def transcribe_audio(language, num_speakers, audio_path, model_size):
    model_name = model_size
    if language == 'English' and model_size != 'large':
        model_name += '.en'
        language = 'en'

    # Convert audio to wav if not already in that format
    if audio_path[-3:] != 'wav':
        subprocess.call(['ffmpeg', '-i', audio_path, 'audio.wav', '-y'])
        audio_path = 'audio.wav'
    
    # Load the model
    model = whisper.load_model(model_size)
    
    # Transcribe the audio
    result = model.transcribe(audio_path)
    segments = result["segments"]

    # Get the duration of the audio
    with contextlib.closing(wave.open(audio_path, 'r')) as f:
        frames = f.getnframes()
        rate = f.getframerate()
        duration = frames / float(rate)
    
    audio = Audio()

    # Function to generate segment embeddings
    def segment_embedding(segment):
        start = segment["start"]
        end = min(duration, segment["end"])
        clip = Segment(start, end)
        waveform, sample_rate = audio.crop(audio_path, clip)
        return embedding_model(waveform[None])

    # Generate embeddings for each segment
    embeddings = np.zeros(shape=(len(segments), 192))
    for i, segment in enumerate(segments):
        embeddings[i] = segment_embedding(segment)

    embeddings = np.nan_to_num(embeddings)

    # Perform clustering to detect speakers
    clustering = AgglomerativeClustering(num_speakers).fit(embeddings)
    labels = clustering.labels_

    # Assign speaker labels to segments
    for i in range(len(segments)):
        segments[i]["speaker"] = 'SPEAKER ' + str(labels[i] + 1)

    # Function to format time in seconds into HH:MM:SS format
    def time(secs):
        return datetime.timedelta(seconds=round(secs))

    # Initialize empty strings for the formatted and clean transcripts
    formatted_transcript = ""
    clean_transcript = ""

    # Build the formatted and clean transcripts
    for (i, segment) in enumerate(segments):
        temp_segment_formatted = segment["speaker"] + ' ' + str(time(segment["start"])) + ' ' + segment["text"] + "\n"
        temp_segment_clean = segment["text"]
        formatted_transcript += temp_segment_formatted
        clean_transcript += temp_segment_clean

    # Return both formatted and clean transcripts
    return segments, formatted_transcript, clean_transcript