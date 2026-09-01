const CACHE_NAME = "envol-et-vous-v1";

const FILES_TO_CACHE = [
  "index.html",
  "a-propos.html",
  "destinations.html",
  "formules.html",
  "creer-mon-voyage.html",
  "destination-japon.html",
  "destination-tanzanie.html",
  "destination-polynesie.html",
  "destination-egypte.html",
  "destination-thailande.html",
  "destination-usa.html",
  "destination-grece.html",
  "destination-france.html",
  "destination-stemilion.html",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

// Installation : on met en cache les pages principales du site
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : on supprime les anciennes versions du cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Stratégie : on sert depuis le réseau en priorité, et on retombe sur le
// cache si l'utilisateur est hors-ligne (utile en déplacement / voyage).
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
