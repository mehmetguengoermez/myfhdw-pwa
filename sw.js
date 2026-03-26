const CACHE_NAME = 'myfhdw-pwa-v7';

const urlsToCache = [
  './',
  './index.html',
  './dashboard.html',
  './profile.html',
  './notenuebersicht.html',
  './pruefungstermine.html',
  './timetable.html',
  './dokumente.html',
  './abgaben.html',
  './kurzbewerbung.html',
  './manifest.json',
  './styles/custom.css',
  './img/homescreen192.png',
  './img/Community_Banner.jpg',
  './img/team.png',
  './img/gorilla.jpg',
  './favicon.ico',
  './files/handout.pdf',
  './files/praesentation.pptx'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      return fetch(event.request).then(function (response) {
        return response;
      }).catch(function () {
        // Offline fallback: wenn Navigation (Seitenaufruf), zurück zur Startseite
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return cached;
      });
    })
  );
});

// Push-Events 
self.addEventListener('push', function (event) {
  let data = { title: 'MyFHDW', body: 'Neue Nachricht!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'MyFHDW', body: event.data.text() };
    }
  }
  const options = {
    body: data.body,
    icon: './img/homescreen192.png',
    badge: './img/homescreen192.png',
    vibrate: [100, 50, 100]
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
});
