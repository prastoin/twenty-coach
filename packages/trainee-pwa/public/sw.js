// App-shell cache. The trainee opens the app in a gym with no signal, so the
// shell has to come from here; data lives in IndexedDB and is handled by the
// app itself. Requests outside the PWA's own scope (/graphql, /metadata,
// /oauth) are never touched.
const CACHE_NAME = 'coach-pwa-v2';

const scopeUrl = () => new URL(self.registration.scope);

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      // The shell is fetched up front so the very next start works offline,
      // even if the trainee never navigates again after installing.
      const cache = await caches.open(CACHE_NAME);
      await cache.add(new Request(scopeUrl().href, { cache: 'reload' }));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached ?? refresh;
};

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  const scope = scopeUrl();
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) {
    return;
  }

  // Any navigation inside the app resolves to the shell, so a cold start
  // offline renders the app instead of the browser's error page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const shell = await cache.match(scope.href);
        return shell ?? Response.error();
      }),
    );
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
