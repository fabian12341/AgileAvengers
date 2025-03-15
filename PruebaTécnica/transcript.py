from openai import OpenAI
from transformers import pipeline, MarianMTModel, MarianTokenizer
from pydub import AudioSegment
import math
import textwrap
from tqdm import tqdm  # Loading bar
from langdetect import detect  # Language detection

# Initialize OpenAI client
client = OpenAI()

# Load NLP models (specifying the default English models for sentiment analysis and NER)
sentiment_pipeline = pipeline("sentiment-analysis")
summarization_pipeline = pipeline("summarization", model="facebook/bart-large-cnn")
ner_pipeline = pipeline("ner")

# Load MarianMT translation model (Spanish to English)
translation_model_name = "Helsinki-NLP/opus-mt-es-en"
translation_model = MarianMTModel.from_pretrained(translation_model_name)
translation_tokenizer = MarianTokenizer.from_pretrained(translation_model_name)

def translate_text(text, src_lang='es', tgt_lang='en'):
    """Translates text from source language to target language."""
    translated = translation_tokenizer.encode(text, return_tensors="pt", truncation=True)
    translated_text = translation_model.generate(translated)
    translated_text = translation_tokenizer.decode(translated_text[0], skip_special_tokens=True)
    return translated_text

def transcribe_audio_chunk(audio_file_path):
    """Transcribes a single audio chunk using OpenAI Whisper API."""
    with open(audio_file_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-1", 
            file=audio_file
        )
        return transcription.text.strip() if transcription.text else ""

def chunk_text(text, chunk_size=512):
    """Splits text into smaller chunks for processing (to avoid model token limit errors)."""
    return textwrap.wrap(text, width=chunk_size)

def analyze_text(text):
    """
    Perform sentiment analysis, summarization, and named entity recognition on the full transcribed text.
    Handles text chunking to avoid model token limit errors.
    """
    if not text:
        return {
            "sentiment": "No sentiment detected",
            "summary": "No summary available",
            "entities": []
        }

    # **Sentiment Analysis** (Break text into 512-token chunks)
    sentiment_scores = []
    text_chunks = chunk_text(text, chunk_size=512)
    
    for chunk in text_chunks:
        sentiment_scores.append(sentiment_pipeline(chunk)[0])  # Store label & score

    # Compute the probabilities for each label (positive, neutral, negative)
    probabilities = {"NEGATIVE": 0.0, "NEUTRAL": 0.0, "POSITIVE": 0.0}
    
    for sentiment in sentiment_scores:
        label = sentiment['label']
        score = sentiment['score']
        if label == "NEGATIVE":
            probabilities["NEGATIVE"] += score
        elif label == "POSITIVE":
            probabilities["POSITIVE"] += score
        elif label == "NEUTRAL":
            probabilities["NEUTRAL"] += score

    # Normalize probabilities
    total_score = sum(probabilities.values())
    if total_score > 0:
        probabilities = {k: v / total_score for k, v in probabilities.items()}

    final_sentiment = max(probabilities, key=probabilities.get)  # Find the sentiment with highest probability

    # **Summarization** (Only if text is long enough)
    if len(text.split()) > 100:
        summary_chunks = summarization_pipeline(text, max_length=150, min_length=50, do_sample=False)
        summary_text = " ".join([s["summary_text"] for s in summary_chunks])
    else:
        summary_text = "Text is too short for summarization"

    # **Named Entity Recognition (NER)** (Break text into 512-token chunks)
    entities = []
    for chunk in text_chunks:
        entities.extend(ner_pipeline(chunk))

    return {
        "sentiment": {"label": final_sentiment, "score": probabilities},
        "summary": summary_text,
        "entities": entities
    }

def transcribe_and_analyze_audio(file_path, chunk_length_ms=60000):
    """
    Transcribe an audio file in chunks, combine the full transcript, translate it to English if necessary,
    and analyze the final transcription.
    """
    audio = AudioSegment.from_file(file_path)
    duration_ms = len(audio)
    chunks = math.ceil(duration_ms / chunk_length_ms)

    full_transcript = ""

    # Initialize tqdm for loading bar
    with tqdm(total=chunks, desc="Processing Audio", unit="chunk") as pbar:
        for i in range(chunks):
            start_time = i * chunk_length_ms
            end_time = min((i + 1) * chunk_length_ms, duration_ms)
            chunk = audio[start_time:end_time]
            
            chunk_file_path = f"chunk_{i}.wav"
            chunk.export(chunk_file_path, format="wav")
            
            text = transcribe_audio_chunk(chunk_file_path)
            full_transcript += text + " "  # Append to the full transcript

            # Update progress bar
            pbar.update(1)

    # **Detect language of the transcription**
    detected_language = detect(full_transcript)  # Detect language (e.g., 'en' for English, 'es' for Spanish)

    # **Translate the full transcript from Spanish to English if needed**
    if detected_language != 'en':  # If the transcription is not in English, translate
        translated_text = translate_text(full_transcript, src_lang=detected_language, tgt_lang='en')
    else:
        translated_text = full_transcript  # No translation needed if it's already in English

    # **Analyze the final translated (or original) text**
    analysis = analyze_text(translated_text)

    return {
        "full_transcript": full_transcript.strip(),
        "translated_text": translated_text.strip(),
        "sentiment": analysis["sentiment"],
        "summary": analysis["summary"],
        "entities": analysis["entities"]
    }
