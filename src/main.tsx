import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker for 100% Offline Caching
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('Sehat Sathi PWA Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('Service worker registration fallback:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);

