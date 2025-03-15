import gradio as gr
from transcript import transcribe_and_analyze_audio  # Import your function

def process_audio(file):
    if file is None:
        return "Please upload an audio file.", "", "", "", ""

    # Process the uploaded file
    output = transcribe_and_analyze_audio(file.name)  # Pass the file's name to the function

    # Extract the sentiment label from the analysis result
    sentiment_label = output["sentiment"]["label"]  # Get just the label (e.g., "POSITIVE")
    
    # Return all outputs
    return (
        output["full_transcript"],  # Full transcript
        output["translated_text"],  # Translated text (if necessary)
        sentiment_label,            # Just the sentiment label (not the full dictionary)
        output["summary"],         # Text summary
        output["entities"]         # Named entities
    )


# Create the Gradio interface
iface = gr.Interface(
    fn=process_audio,                           # Function to run when user interacts
    inputs=gr.File(label="Upload Audio"),        # File upload input
    outputs=[
        gr.Textbox(label="Full Transcription"),  # Full transcription output
        gr.Textbox(label="Translated Text"),     # Translated text output (if necessary)
        gr.Label(label="Sentiment Analysis"),    # Sentiment analysis label
        gr.Textbox(label="Summary"),             # Summary output
        gr.Textbox(label="Entities")             # Entities output
    ],
    live=True                                    # Live updates for processing
)

iface.launch(share=True)  # Start the Gradio interface
