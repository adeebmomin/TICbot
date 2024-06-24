// src/Sidebar.js

import React from 'react';
import './Sidebar.css';

const Sidebar = ({ conversations, onSelectConversation, onNewConversation }) => {
  return (
    <div className="sidebar">
      <h2>Conversations</h2>
      <button className="new-conversation-button" onClick={onNewConversation}>
        New Conversation
      </button>
      <ul>
        {conversations.map((conv, index) => (
          <li key={index} onClick={() => onSelectConversation(index)}>
            {conv.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
