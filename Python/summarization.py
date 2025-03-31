from transformers import pipeline
from langdetect import detect

# Initialize the summarization and translation pipelines
summarization_pipeline = pipeline("summarization", model="facebook/bart-large-cnn")
translation_pipeline = pipeline("translation", model="Helsinki-NLP/opus-mt-es-en")

# Function to translate transcript to English to be able to summarize it
def translate_to_english(transcript):
    """Translates transcript to English if it's in another language."""
    try:
        detected_lang = detect(transcript)
        if detected_lang == "en":
            return transcript  # No need to translate
        else:
            translation = translation_pipeline(transcript, src_lang=detected_lang, tgt_lang="eng_Latn", max_length=1000)
            return translation[0]["translation_text"]
    except Exception as e:
        return f"Translation error: {e}"


# Function to generate summary of the transcript
def generate_summary(transcript, language="en"):
    if not transcript:
        return "No summary available"

    # If language is not English, translate first
    if language != "en":
        transcript = translate_to_english(transcript)

    # Summarization (only if transcript is long enough)
    if len(transcript.split()) > 100:
        
        # Prompt for summarization
        summary_prompt = (
            "Summarize this customer service conversation:\n\n"
        ) + transcript

        summary_chunks = summarization_pipeline(summary_prompt, max_length=150, min_length=50, do_sample=False)
        summary_transcript = " ".join([s["summary_text"] for s in summary_chunks])
    else:
        summary_transcript = "Transcript is too short for summarization"

    return summary_transcript