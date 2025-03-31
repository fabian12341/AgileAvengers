import re
from transformers import pipeline

# Load the zero-shot classifier
def load_classifier(language):
    if language == 'es':
        return pipeline("zero-shot-classification", model="Recognai/bert-base-spanish-wwm-cased-xnli")
    elif language == 'en':
        return pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    else:
        return pipeline("zero-shot-classification", model="XLM-Roberta")

# Classifies the speaker as AGENT or CLIENT, with added context
def classify_speaker(text, speaker_role, classifier):
    context = f"This is a customer service dialogue. The speaker is a {speaker_role}. "
    result = classifier(context + text, candidate_labels=["AGENT", "CLIENT"])
    return result

# Groups text by speaker, assigns probabilities, and labels them consistently
def label_transcript(transcript, language='es'):
    classifier = load_classifier(language)
    lines = [line.strip() for line in transcript.split("\n") if line.strip()]
    speaker_texts = {}  # Stores full dialogue for each speaker
    speaker_lines = []  # Stores original lines with speaker info
    
    # Extract and group lines by speaker
    for line in lines:
        match = re.match(r'(SPEAKER \d+) (\d+:\d+:\d+) (.*)', line)
        if match:
            speaker, timestamp, text = match.groups()
            speaker_lines.append((speaker, timestamp, text))
            speaker_texts.setdefault(speaker, []).append(text)
    
    # Combine all text per speaker and classify
    speaker_probabilities = {}
    client_counter = 1
    for speaker, texts in speaker_texts.items():
        # Add context based on the role of the speaker
        if "SPEAKER 1" in speaker:
            speaker_role = "CLIENT 1"
        elif "SPEAKER 2" in speaker:
            speaker_role = "AGENT"
        else:
            speaker_role = f"CLIENT {client_counter}"
            client_counter += 1
        
        full_text = " ".join(texts)
        result = classify_speaker(full_text, speaker_role, classifier)
        
        # Store the probabilities
        probabilities = {label: score for label, score in zip(result["labels"], result["scores"])}
        speaker_probabilities[speaker] = probabilities
        
        # Print probability results for debugging
        print(f"\nSpeaker: {speaker}")
        print(f"AGENT: {probabilities['AGENT']:.4f}, CLIENT: {probabilities['CLIENT']:.4f}")
    
    # Determine the more likely AGENT and CLIENT
    speakers = list(speaker_probabilities.keys())
    if len(speakers) == 2:
        s1, s2 = speakers
        if speaker_probabilities[s1]["AGENT"] > speaker_probabilities[s2]["AGENT"]:
            role_map = {s1: "AGENT", s2: "CLIENT 1"}
        else:
            role_map = {s1: "CLIENT 1", s2: "AGENT"}
    else:
        # Assign roles to the remaining clients dynamically
        role_map = {}
        for i, speaker in enumerate(speakers):
            if "SPEAKER" in speaker:
                role_map[speaker] = f"CLIENT {i+1}" if i > 0 else "AGENT"
    
    # Format the output to print neatly with aligned columns
    formatted_lines = []
    for speaker, timestamp, text in speaker_lines:
        role = role_map.get(speaker, "UNKNOWN")
        # Using string formatting to align columns (fixed width)
        formatted_line = f"{role:<10} {timestamp:<8} {text}"
        formatted_lines.append(formatted_line)
    
    # Join the formatted lines with newlines
    labeled_transcript = "\n".join(formatted_lines)
    # print("\nLabeled Transcript:")
    # print(labeled_transcript)
    
    return labeled_transcript, role_map
    