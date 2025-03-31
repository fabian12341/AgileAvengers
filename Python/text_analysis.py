from transformers import pipeline

# Function to extract speaker transcripts using segments
def extract_speaker_transcripts(segments):
    
    # Dictionary to store transcripts for each speaker
    speaker_transcripts = {}

    for segment in segments:
        speaker = segment["speaker"]
        temp_segment = segment["text"]
        
        # Add the segment to the corresponding speaker's transcript
        if speaker not in speaker_transcripts:
            speaker_transcripts[speaker] = ""  # Initialize if speaker not in dictionary
        speaker_transcripts[speaker] += temp_segment
    
    return speaker_transcripts

# Function to standardize sentiment labels
def standardize_sentiment(label, score, model_name):
    if model_name == "pysentimiento/robertuito-sentiment-analysis":
        label_map = {"POS": "positive", "NEU": "neutral", "NEG": "negative"}
    
    elif model_name == "distilbert-base-uncased-finetuned-sst-2-english":
        if score > 0.6:  # High confidence
            label_map = {"POSITIVE": "positive", "NEGATIVE": "negative"}
            standardized_label = label_map[label]
        else:  # Low confidence → Assume Neutral
            standardized_label = "neutral"
        return {"sentiment": standardized_label, "score": score}

    elif model_name == "cardiffnlp/twitter-xlm-roberta-base-sentiment":
        label_map = {"LABEL_0": "negative", "LABEL_1": "neutral", "LABEL_2": "positive"}

    standardized_label = label_map.get(label, "unknown")
        
    return {"sentiment": standardized_label, "score": score}


# Function to chunk text into smaller segments
def chunk_text_by_size(text, chunk_size):
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    return chunks


# Function analyze text sentiment
def extract_text_sentiment(transcript, language, chunk_size=512):
    # Initialize the sentiment analysis model based on the language
    if language == 'es':
        # Spanish sentiment analysis model
        print("Using Spanish sentiment analysis model")
        sentiment_model = pipeline("sentiment-analysis", model="pysentimiento/robertuito-sentiment-analysis")  
        
    elif language == 'en':
        # English sentiment analysis model
        print("Using English sentiment analysis model")
        sentiment_model = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
        
    else:
        # Multilingual sentiment analysis model
        print("Using multilingual sentiment analysis model")
        sentiment_model = pipeline("sentiment-analysis", model="cardiffnlp/twitter-xlm-roberta-base-sentiment")
        
    # Split the transcript into chunks based on the chunk size and analyze each chunk
    chunks = chunk_text_by_size(transcript, chunk_size)  # Split into chunks
    sentiments = []

    for chunk in chunks:
        sentiment = sentiment_model(chunk)[0]  # Analyze each chunk
        sentiments.append(sentiment)  # Store sentiment result for each chunk

    # Calculate the average sentiment score for all chunks
    avg_score = sum(sent["score"] for sent in sentiments) / len(sentiments)
    # Determine the most common sentiment label from the chunks
    sentiment_labels = [sent["label"] for sent in sentiments]
    most_common_label = max(set(sentiment_labels), key=sentiment_labels.count)

    return standardize_sentiment(most_common_label, avg_score, sentiment_model.model.config._name_or_path)
