importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyD96IBVqGKVEdmXIVCYL_7kvlBhJNSD1Ww",
  authDomain: "marko-be9a9.firebaseapp.com",
  databaseURL: "https://marko-be9a9-default-rtdb.firebaseio.com",
  projectId: "marko-be9a9",
  storageBucket: "marko-be9a9.appspot.com",
  messagingSenderId: "7036670175",
  appId: "1:7036670175:web:99992356716578ea13996a"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    self.clients.claim()
  );
});

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  // Check if it's a mobile device
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    // This is likely a mobile device, don't show the notification
    return;
  }

 const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    data: {
      url: payload.data.url // Ensure the correct URL is used
    }
  };

self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Iterate through all window clients to find a match
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // Check if the client's URL is within the same origin (domain)
        if (client.url.startsWith(self.location.origin)) {
          // Focus the client (bring it to the foreground)
          return client.focus().then(() => {
            // Navigate to the URL from notification data
            return client.navigate(event.notification.data.url);
          });
        }
      }
      // If no matching client found, open a new window/tab with the URL
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

