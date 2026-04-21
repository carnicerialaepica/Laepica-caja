// ══════════════════════════════════════
//  LA ÉPICA — Service Worker v8
//  Estrategia: Cache-First para CDN,
//              Network-First para la app
// ══════════════════════════════════════
const CACHE_NAME = 'laepica-v8';

const RECURSOS_EXTERNOS = [
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500;600;700&display=swap'
];

// ── INSTALAR ──────────────────────────
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Pre-cachear recursos externos (sin bloquear si fallan)
      return Promise.allSettled(
        RECURSOS_EXTERNOS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] No se pudo cachear:', url, err))
        )
      );
    })
  );
});

// ── ACTIVAR ───────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => {
            console.log('[SW] Limpiando cache viejo:', k);
            return caches.delete(k);
          })
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH ─────────────────────────────
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = request.url;

  // Solo interceptar GET
  if(request.method !== 'GET') return;

  // Navegación (la app HTML) → Network first, cache como fallback
  if(request.mode === 'navigate'){
    e.respondWith(
      fetch(request)
        .then(res => {
          if(res.ok){
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
          }
          return res;
        })
        .catch(() => {
          console.log('[SW] Sin red, sirviendo desde cache');
          return caches.match(request)
            || caches.match('./LaEpica_V8.html')
            || new Response('<h1>Sin conexión</h1><p>Abrí la app desde el ícono instalado.</p>', {
                headers: {'Content-Type': 'text/html; charset=utf-8'}
               });
        })
    );
    return;
  }

  // CDN (Chart.js, Fuentes) → Cache first, network como fallback
  if(url.includes('cdnjs.cloudflare.com') || url.includes('fonts.g')){
    e.respondWith(
      caches.match(request).then(cached => {
        if(cached) return cached;
        return fetch(request).then(res => {
          if(res.ok){
            caches.open(CACHE_NAME).then(c => c.put(request, res.clone()));
          }
          return res;
        }).catch(() => new Response('', {status: 503, statusText: 'Sin red'}));
      })
    );
    return;
  }
});

// ── MENSAJES ──────────────────────────
self.addEventListener('message', e => {
  if(e.data === 'SKIP_WAITING') self.skipWaiting();
  if(e.data === 'GET_VERSION'){
    e.ports[0]?.postMessage({ version: CACHE_NAME });
  }
});
