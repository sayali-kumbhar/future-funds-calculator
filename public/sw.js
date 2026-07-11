const CACHE_NAME = 'futurefund-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml'
];

// Google Fonts caching config
const FONT_REGEX = /^https:\/\/fonts\.(gstatic|googleapis)\.com/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline essentials');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Strategy: Cache-first for Fonts
  if (FONT_REGEX.test(request.url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy: Stale-While-Revalidate for app assets (JS/CSS/images/icons)
  // For document pages, we want to fallback to index.html if offline to support SPA client-side routing.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        // Offline: serve index.html for SPA router
        return caches.match('/') || caches.match('/index.html');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {
        // Safe fallback if network fails
        return null;
      });
      
      return cachedResponse || fetchPromise;
    })
  );
});
