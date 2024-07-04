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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
var messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  // Customize notification here
  var notificationTitle = payload.notification.title;
  var notificationOptions = {
    body: payload.notification.body,
    data: {
      url: payload.data.link
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click Received.');
  console.log('Notification data:', event.notification.data);
  
  event.notification.close();

  const linkUrl = event.notification.data.link;

  if (!linkUrl) {
    console.log('No link found in notification data');
    return;
  }

  console.log('Attempting to open link:', linkUrl);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (let client of clientList) {
          if (client.url === linkUrl) {
            return client.focus();
          }
        }
        return clients.openWindow(linkUrl);
      })
      .then((windowClient) => {
        if (windowClient) {
          console.log('Successfully opened or focused window');
        } else {
          console.log('Failed to open window');
        }
      })
      .catch((error) => {
        console.error('Error opening window:', error);
      })
  );
});
