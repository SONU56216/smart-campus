const CACHE_NAME = "campuspass-offline-v1";

// List key assets required to render offline card validations
const OFFLINE_URLS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Warm up offline bundle cache caches
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            // Sweep obsolete cache versions
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          // If request was successful, clone response and write cache for static styles/images
          const url = new URL(event.request.url);
          const isStaticAsset = 
            url.pathname.endsWith(".css") || 
            url.pathname.endsWith(".js") || 
            url.pathname.endsWith(".webp") || 
            url.pathname.endsWith(".png") || 
            url.pathname.endsWith(".jpg");

          if (response.status === 200 && isStaticAsset) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback mechanism when network dies
          const url = new URL(event.request.url);
          if (url.origin === self.location.origin && url.pathname === "/") {
            return caches.match("/");
          }
        });
    })
  );
});
