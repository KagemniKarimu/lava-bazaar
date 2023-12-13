import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importing the App component

// Create a root.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
