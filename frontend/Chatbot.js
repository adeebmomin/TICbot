// src/Chatbot.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';
import Sidebar from './Sidebar'; // Import the Sidebar component
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique session IDs

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage = { sender: 'user', text: userInput, timestamp: new Date() };
    setMessages([...messages, userMessage]);

    setUserInput('');
    setLoading(true);

    try {
      console.log('Sending message to backend:', userInput);
      const response = await axios.post('http://127.0.0.1:5000/api/chat', {
        session_id: currentConversation ? currentConversation.id : uuidv4(), // Pass session ID
        message: userInput
      });

      console.log('Received response from backend:', response.data.reply);
      const botMessage = { sender: 'bot', text: response.data.reply, timestamp: new Date() };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Update the current conversation with the new message
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation ? currentConversation.messages : [], userMessage, botMessage],
      };
      const updatedConversations = conversations.map((conv) =>
        conv.id === currentConversation.id ? updatedConversation : conv
      );
      setConversations(updatedConversations);
      setCurrentConversation(updatedConversation);

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    const newConversation = {
      id: uuidv4(), // Unique ID for each conversation
      title: `Conversation ${conversations.length + 1}`,
      messages: [],
    };
    setConversations([...conversations, newConversation]);
    setCurrentConversation(newConversation);
    setMessages([]);
  };

  const handleSelectConversation = (index) => {
    setCurrentConversation(conversations[index]);
    setMessages(conversations[index].messages);
  };

  return (
    <div className="app-container">
      <Sidebar 
        conversations={conversations} 
        onSelectConversation={handleSelectConversation} 
        onNewConversation={handleNewConversation}
      />
      <div className="chatbot-container">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
              <div className="timestamp">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          {loading && <div className="loading">Bot is typing...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Chat with TIC..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

};

export default Chatbot;
