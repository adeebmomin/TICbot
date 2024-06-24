// src/mockApi.js
  
// FILE TO TEST BOT MESSAGES

// Function to simulate an API call for the chatbot
export const mockApi = (message) => {
    // Return a new Promise
    return new Promise((resolve) => {
      // Simulate a network delay using setTimeout
      setTimeout(() => {
        // Create a mock reply based on the user message
        const botReply = `This is a mock reply to: "${message}"`;
        // Resolve the Promise with a mock response object
        resolve({ data: { reply: botReply } });
      }, 1000); // Simulate a network delay of 1 second
    });
  };
  
  