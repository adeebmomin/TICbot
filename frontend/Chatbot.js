// src/Chatbot.js

// Import necessary dependencies from React and other libraries
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

import { mockApi } from './mockApi'; // Import the mock API FOR TESTING


// Define the Chatbot component
const Chatbot = () => {
  // State hooks for managing messages, user input, and loading status
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  // const [inputExpanded, setInputExpanded] = useState(false);
  const messagesEndRef = useRef(null); // Ref to keep track of the messages end div

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Effect hook to scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage = { sender: 'user', text: userInput, timestamp: new Date() };
    setMessages([...messages, userMessage]); // Add user message to state

    setUserInput('');
    setLoading(true);

    try {
      const response = await mockApi(userInput);

      const botMessage = { sender: 'bot', text: response.data.reply, timestamp: new Date() };
      setMessages((prevMessages) => [...prevMessages, botMessage]); // Add only the bot message to state
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };


  // Return the JSX for the Chatbot component
  return (
    <div className="chatbot-container">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}> {/* Unique key for each message, class name based on sender */}
            {msg.text}
            <div className="timestamp">
              {msg.timestamp.toLocaleTimeString()} {/* Display the timestamp of the message */}
            </div>
          </div>
        ))}
        {loading && <div className="loading">Bot is typing...</div>} {/* Show loading indicator when bot is typing */}
        <div ref={messagesEndRef} /> {/* Dummy div element to help with scrolling to the bottom of the messages */}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)} // Update userInput state on change
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} // Send message on Enter key press
          // onClick={handleInputClick()} // Placeholder for handling input click event
          placeholder="Chat with TIC..." // Placeholder text
        />
        <button onClick={handleSendMessage}>Send</button> {/* Button to send the user message */}
      </div>
    </div>
  );  
};



// Export the Chatbot component as default
export default Chatbot;
