// src/App.js
import React from 'react';
import Chatbot from './Chatbot';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <h1>Welcome to My Chatbot App</h1>
      </header> */}
      <main>
        <Chatbot />
      </main>
    </div>
  );
}

export default App;
