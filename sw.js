const CACHE = 'rechazo-v4';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./sw.js'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).catch(() => {
        return e.request.mode === 'navigate' ? caches.match('./index.html') : Promise.reject();
      }))
    );
  }
});
