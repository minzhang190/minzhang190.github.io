importScripts('appcache-behavior-import.js');

self.addEventListener('fetch', (event) => {
    event.respondWith(goog.appCacheBehavior.fetch(event));
});
