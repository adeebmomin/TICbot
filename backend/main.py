import os
import google.generativeai as genai

# Configure the API key
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

# creating the model
model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

# Initialize the chat session with initial history
chat_history = [
  {
    "role": "user",
    "parts": [
      "hey, can you teach me something about industry control?",
    ],
  },
  {
    "role": "model",
    "parts": [
      "## Industry Control: A Complex and Ever-Evolving Landscape\n\n\"Industry control\" can be a broad term with many interpretations. To best understand it, we need to be specific about what aspects of industry control we're focusing on. Here are some common areas:\n\n**1. Government Regulation and Oversight:**\n\n* **Antitrust Laws:**  These laws prevent monopolies and ensure fair competition in the market. Think of the Sherman Antitrust Act, which prohibits businesses from colluding to fix prices or divide markets.\n* **Industry-Specific Regulations:**  Government bodies create rules for specific industries to ensure public safety, environmental protection, and consumer rights. Examples include safety regulations for food production, emissions standards for manufacturing, and licensing requirements for certain professions.\n* **Consumer Protection:** Laws and agencies protect consumers from unfair practices like false advertising, deceptive pricing, and unsafe products.\n* **International Trade Agreements:** These agreements regulate trade between countries, influencing the flow of goods and services, and sometimes impacting industries through tariffs and quotas.\n\n**2. Industry Self-Regulation:**\n\n* **Professional Associations:** Organizations representing specific industries set ethical standards, promote best practices, and sometimes enforce codes of conduct among their members.\n* **Industry Standards:** These voluntary guidelines define quality, safety, and ethical practices for products, services, and processes.\n* **Consumer Feedback and Ratings:** Consumers play a role in industry control through reviews, ratings, and boycotts, influencing industry practices by rewarding good behavior and punishing bad behavior.\n\n**3. Market Forces and Competition:**\n\n* **Market Demand and Supply:** The dynamic interaction of supply and demand in the marketplace influences industry behavior, driving innovation and shaping prices.\n* **Competition:** The presence of multiple companies vying for market share forces industries to improve efficiency, reduce costs, and offer better products and services.\n* **Technology and Innovation:** Advancements in technology can disrupt industries, creating new market leaders and challenging established players.\n\n**4. Corporate Social Responsibility (CSR):**\n\n* **Ethical Business Practices:**  Companies increasingly prioritize ethical practices beyond legal requirements, considering environmental impact, labor conditions, and social justice.\n* **Sustainability:** Companies are responding to concerns about climate change and resource depletion by adopting sustainable practices and reducing their environmental footprint.\n* **Community Engagement:** Businesses are becoming more involved in their local communities, sponsoring initiatives, and contributing to social causes.\n\n**Key Considerations:**\n\n* **Balance of Power:** Finding the right balance between government regulation, industry self-regulation, and market forces is crucial for effective industry control.\n* **Evolving Landscape:**  The dynamics of industry control are constantly evolving due to technological advancements, globalization, and societal shifts.\n* **Transparency and Accountability:** Transparency in industry practices and clear accountability mechanisms are essential for building trust and ensuring fair competition.\n\nTo delve deeper into specific aspects of industry control, it's crucial to define the scope of your interest:\n\n* **Which industry are you interested in?** (e.g., finance, healthcare, technology)\n* **What specific aspect of control are you curious about?** (e.g., antitrust regulations, ethical business practices, environmental sustainability)\n\nLet me know what specific area you'd like to explore, and I can provide you with more tailored information and examples. \n",
    ],
  },
]

chat_session = model.start_chat(history=chat_history)

while True:
    # Get user input
    user_input = input("Enter your prompt (or type 'exit' to terminate): ")
    
    # Check for termination command
    if user_input.lower() == 'exit':
        break
    
    # Send the user input to the model
    response = chat_session.send_message(user_input)
    
    # Print the model's response
    print(response.text)
    
    # Save the user input and model's response to history
    chat_session.history.append({
        "role": "user",
        "parts": [user_input],
    })
    chat_session.history.append({
        "role": "model",
        "parts": [response.text],
    })
