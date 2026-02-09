import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("Lumina: Starting Application...");

const init = () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error("Lumina: Root element not found.");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Lumina: Render call sent to React.");
  } catch (err) {
    console.error("Lumina: Startup Error", err);
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif; color: #374151;">
        <h2 style="color: #ef4444; margin-bottom: 8px;">Application Error</h2>
        <p style="font-size: 14px; opacity: 0.7;">${err instanceof Error ? err.message : String(err)}</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Reload Application</button>
      </div>
    `;
  }
};

// Ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
