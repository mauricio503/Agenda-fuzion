const CACHE_NAME = 'kakebo-pro-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Solo cachear requests del mismo origen, no Firebase ni APIs externas
  if (e.request.url.includes('firebaseapp.com') || 
      e.request.url.includes('googleapis.com') ||
      e.request.url.includes('anthropic.com') ||
      e.request.url.includes('gstatic.com')) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
