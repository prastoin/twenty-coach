import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './components/App';
import './styles.css';

// The service worker's scope is the directory it is served from, so a visit
// to /s/pwa (no trailing slash) would fall outside it and lose the offline
// shell entirely. Normalising first keeps every start controlled.
if (!window.location.pathname.endsWith('/')) {
  window.location.replace(`${window.location.pathname}/${window.location.search}`);
}

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
