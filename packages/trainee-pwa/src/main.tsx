import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './styles.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Dev is served by Vite with its own module graph — an app-shell cache on
// top of it serves stale module URLs (e.g. two React copies after a
// dependency reshuffle). The service worker is a production concern.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  void navigator.serviceWorker
    .register('./sw.js')
    .catch((error) => console.warn('Service worker registration failed', error));
}
