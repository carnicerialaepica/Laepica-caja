// ══════════════════════════════════════
//  SERVICE WORKER — La Épica Caja v25
//  Cache-first para funcionamiento 100% offline
// ══════════════════════════════════════
const CACHE_NAME = 'laepica-v25';
const FILES = [
  './LaEpica_V25.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
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
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).catch(() => {
        if(e.request.destination === 'document')
          return caches.match('./LaEpica_V25.html');
      });
    })
  );
});
