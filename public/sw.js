// Service worker — offline support (Bible 003 §14, 012 §17).
// Strategy: network-first for navigations (SPA shell fallback), stale-while-revalidate
// for static assets / map data / fonts. Never caches the API.
const VERSION = "via-v1";
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL).then((cache) => cache.addAll(["/", "/manifest.webmanifest", "/favicon.svg"])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function staleWhileRevalidate(request) {
  return caches.open(RUNTIME).then((cache) =>
    cache.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Never intercept the API.
  if (url.pathname.startsWith("/api/")) return;

  // Navigations: network-first, fall back to cached shell when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/", { ignoreSearch: true }).then((r) => r || caches.match("/"))),
    );
    return;
  }

  // Static assets, map data (same-origin) + cross-origin fonts.
  const isAsset =
    url.origin === location.origin &&
    (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/geo/") || url.pathname === "/favicon.svg");
  const isFont = url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com");

  if (isAsset || isFont) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
