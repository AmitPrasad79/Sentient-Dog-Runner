const CACHE_NAME = 'sentient-dog-runner-v1';
const toCache = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/manifest.json',
  '/assets/dog.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(toCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp => {
      return resp || fetch(evt.request).then(fetchResp => {
        // Put new requests in cache as well (optional)
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(evt.request, fetchResp.clone());
          return fetchResp;
        });
      }).catch(_ => caches.match('/index.html'));
    })
  );
});
