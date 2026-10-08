import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Progressive Web App Service Worker for offline support and installability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('EduTrack PWA Service Worker Registered:', reg.scope))
      .catch((err) => console.warn('PWA Service Worker registration note:', err));
  });
}

