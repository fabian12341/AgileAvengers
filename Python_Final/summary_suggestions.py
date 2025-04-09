import openai
import re
from dotenv import load_dotenv
import os

# Environment variables
load_dotenv()
api_key = os.getenv('API_KEY')

# Set up OpenAI API key (replace with your own key)
openai.api_key = api_key

# Function to call the GPT model for conversation processing
def process_conversation(transcript):
    prompt = f"""
    The following is a customer service call transcript.
    First, detect the language of the transcript.
    If the transcript is in English, respond in English.
    If the transcript is in another language, translate and respond in that language.
    
    Please provide the output in the following format:
    1. Map of roles mapping agent and client to speaker labels only:
       - AGENT: SPEAKER X
       - CLIENT: SPEAKER Y 
    2. Summary:
    3. Three suggestions for the agent:
    
    Transcript:
    {transcript}
    """

    # Make the API call to process the conversation with GPT model (using 'chat.completions.create' method)
    response = openai.chat.completions.create(
        model="gpt-4o-mini",  # You can change this to "gpt-4o-mini" or similar if available
        messages=[{"role": "system", "content": prompt}],
        temperature=0.7
    )
    
    response = response.choices[0].message.content
    
    # Use regex to extract sections
    role_map_match = re.search(r"1\. Map of roles.*?:\s*(.*?)\s*2\.", response, re.DOTALL)
    summary_match = re.search(r"2\. Summary:\s*(.*?)\s*3\.", response, re.DOTALL)
    suggestions_match = re.search(r"3\. Three suggestions for the agent:\s*(.*)", response, re.DOTALL)

    role_map_text = role_map_match.group(1).strip() if role_map_match else None
    summary = summary_match.group(1).strip() if summary_match else None
    suggestions_text = suggestions_match.group(1).strip() if suggestions_match else None
    
    # Convert role map text into a dictionary
    role_map = {}
    if role_map_text:
        for line in role_map_text.split("\n"):
            match = re.match(r"-\s*(AGENT|CLIENT):\s*(SPEAKER \d+)", line.strip())
            if match:
                role_map[match.group(1)] = match.group(2)
                
    # Convert suggestions into a list
    suggestions = []
    if suggestions_text:
        suggestions = [s.strip("- ") for s in suggestions_text.split("\n") if s.strip()]

    return {
        "role_map": role_map,
        "summary": summary,
        "suggestions": suggestions
    }