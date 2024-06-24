// src/Chatbot.js

import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
import './Chatbot.css';
import { mockApi } from './mockApi'; // Import the mock API FOR TESTING
import Sidebar from './Sidebar'; // Import the Sidebar component

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage = { sender: 'user', text: userInput, timestamp: new Date() };
    setMessages([...messages, userMessage]);

    setUserInput('');
    setLoading(true);

    try {
      const response = await mockApi(userInput);

      const botMessage = { sender: 'bot', text: response.data.reply, timestamp: new Date() };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Update the current conversation with the new message
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, userMessage, botMessage],
      };
      const updatedConversations = conversations.map((conv) =>
        conv === currentConversation ? updatedConversation : conv
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
