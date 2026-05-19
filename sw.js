// ══════════════════════════════════════
//  SERVICE WORKER — La Épica Caja
//  Cache-first para funcionamiento offline
// ══════════════════════════════════════

const CACHE_NAME = 'laepica-v24';
const FILES_TO_CACHE = [
  './LaEpica_V24-1.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instalar: cachear archivos core
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activar: limpiar caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, luego red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // Si falla la red y no hay cache, devolver el HTML principal
        if (event.request.destination === 'document') {
          return caches.match('./LaEpica_V24-1.html');
        }
      });
    })
  );
});
