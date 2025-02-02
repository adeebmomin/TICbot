from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import re

def parse_text(text):
    # Handle titles (h1)
    title_pattern = re.compile(r'\n\*\*(.*?)\*\*\n')
    parsed_text = title_pattern.sub(r'\n<h1>\1</h1>\n', text)

    # Replace **text** with bold text
    bold_pattern = re.compile(r'\*\*(.*?)\*\*')
    parsed_text = bold_pattern.sub(r'<b>\1</b>', parsed_text)

    # Replace * **text** with bullet points and bold text
    bullet_bold_pattern = re.compile(r'\*\s+\*\*(.*?)\*\*')
    parsed_text = bullet_bold_pattern.sub(r'• <b>\1</b>', parsed_text)

    # Replace * text with bullet points (for normal bullet points without bold)
    bullet_pattern = re.compile(r'\*\s+(.*?)(?=\n|$)')
    parsed_text = bullet_pattern.sub(r'• \1', parsed_text)

    return parsed_text


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Allow only the React frontend

# Configure the API key securely (consider using environment variables in a production setup)
priv_key = "AIzaSyBzr1KZzpw3e8Jx7uUtg2Be8BsChXZpaZI"
genai.configure(api_key=priv_key)

# Generation configuration for the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Creating the model
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# Store sessions (this is a simplistic approach; consider using a database for production)
sessions = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    session_id = data.get("session_id")
    user_input = data.get("message")

    if session_id not in sessions:
        print(f"Creating new session for ID: {session_id}")
        sessions[session_id] = model.start_chat(history=[])

    chat_session = sessions[session_id]
    print(f"Received message: {user_input}")
    response = chat_session.send_message(user_input)
    print(f"Model response: {response.text}")
    
    # Parse the response text
    parsed_response = parse_text(response.text)

    return jsonify({"reply": parsed_response})

if __name__ == '__main__':
    app.run(debug=True)
