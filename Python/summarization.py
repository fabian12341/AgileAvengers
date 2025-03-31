from transformers import pipeline
from langdetect import detect

# Initialize the summarization and translation pipelines
summarization_pipeline = pipeline("summarization", model="facebook/bart-large-cnn")
translation_pipeline = pipeline("translation", model="Helsinki-NLP/opus-mt-es-en")

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

# Example usage with a Spanish transcript
transcript = """
SPEAKER 1 0:00:00 Gracias por llamar al soporte de QuickBank. Mi nombre es Alex. ¿En qué puedo ayudarte hoy?
SPEAKER 2 0:00:05 Hola, Alex. Estoy intentando ingresar a mi banca en línea, pero sigo recibiendo un mensaje de error.
SPEAKER 1 0:00:10 Entiendo. Lamento eso. ¿Qué dice el mensaje de error?
SPEAKER 2 0:00:14 Dice "Nombre de usuario o contraseña incorrectos", pero estoy seguro de que ingresé los datos correctos.
SPEAKER 1 0:00:19 Entiendo. Para verificar, ¿has intentado restablecer tu contraseña?
SPEAKER 2 0:00:23 No, aún no. Esperaba evitarlo si es posible.
SPEAKER 1 0:00:27 Entiendo. Vamos a verificar algunas cosas primero. ¿Estás utilizando el correo electrónico o nombre de usuario correcto?
SPEAKER 2 0:00:32 Sí, estoy usando el mismo que siempre he usado.
SPEAKER 1 0:00:36 Ok. A veces, borrar la caché del navegador o intentar con otro navegador puede ayudar. ¿Puedes intentarlo?
SPEAKER 2 0:00:41 Claro, lo haré ahora.
SPEAKER 1 0:00:45 Tómate tu tiempo. Avísame si el problema persiste.
SPEAKER 2 0:00:50 Acabo de probar en otro navegador, pero sigue sin funcionar.
SPEAKER 1 0:00:55 Gracias por verificar. En ese caso, te recomiendo restablecer tu contraseña. Puedo enviarte un enlace para hacerlo ahora.
SPEAKER 2 0:01:00 Está bien, por favor envíamelo.
"""

language = detect(transcript)  # Automatically detect language
summary = generate_summary(transcript, language)
print("Summary:", summary)