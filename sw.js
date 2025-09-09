const CACHE = 'rechazo-v1';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./sw.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Cache-first for same-origin assets. Fallback to cached index for navigations.
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).catch(() => {
        return (e.request.mode === 'navigate') ? caches.match('./index.html') : Promise.reject();
      }))
    );
  }
});
