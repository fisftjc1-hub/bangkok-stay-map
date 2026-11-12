// Offline support: keeps the guide pages readable without a connection.
// Map tiles, Google Maps and external links still need the network.
const VERSION = '20261112-guide4';
const CACHE = 'tripnote-' + VERSION;
const EXTRA = ['favicon.svg', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'roads/home-ratchada.json?v=20261012', 'terms.html', 'privacy.html'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch('index.html', {cache: 'reload'});
    const html = await response.clone().text();
    await cache.put('index.html', response);
    const assets = [...html.matchAll(/(?:src|href)="([^"#:]+\.(?:js|css|svg)(?:\?[^"]*)?)"/g)].map(match => match[1]);
    await Promise.all([...new Set([...assets, ...EXTRA])].map(url => cache.add(new Request(url, {cache: 'reload'})).catch(() => null)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('tripnote-') && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

function timeout(ms) { return new Promise((resolve, reject) => setTimeout(() => reject(new Error('timeout')), ms)); }

self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (request.mode === 'navigate') {
      // Page itself: prefer a fresh copy, fall back to the saved one when the network is slow or gone.
      const isIndex = /\/(index\.html)?$/.test(url.pathname);
      try {
        const fresh = await Promise.race([fetch(request), timeout(3500)]);
        if (fresh.ok) cache.put(isIndex ? 'index.html' : request, fresh.clone());
        return fresh;
      } catch (error) {
        return (await cache.match(isIndex ? 'index.html' : request, {ignoreSearch: true})) || Response.error();
      }
    }
    const hit = await cache.match(request);
    if (hit) return hit;
    try {
      const fresh = await fetch(request);
      if (fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    } catch (error) {
      return (await cache.match(request, {ignoreSearch: true})) || Response.error();
    }
  })());
});
