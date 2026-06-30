const CACHE = "bettersleep-v1";

const ASSETS = [
  "index.html",
  "login.html",
  "registreer.html",
  "dashboard.html",
  "geschiedenis.html",
  "profiel.html",
  "slaap.html",
  "statistieken.html",
  "style.css",
  "script.js",
  "manifest.json",
  "icon/icon-192.png",
  "icon/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // HTML navigatie fallback
  if (event.request.mode === "navigate") {
    return event.respondWith(
      caches.match(event.request).then(res => {
        return res || caches.match("index.html");
      })
    );
  }

  // Cache first voor alle andere bestanden
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});
