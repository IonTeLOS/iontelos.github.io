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

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://github.com/IonTeLOS/iontelos.github.io/blob/5d1ef458101e5cdd316e5bd0cf73fa7e8bbfed8c/icon.png', // Replace with your app's icon path
    data: payload.data, // This will contain the FCM data payload
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click Received.');

  event.notification.close();

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        const hadWindowToFocus = clientList.some((windowClient) => {
          if (windowClient.url === event.notification.data.FCM_MSG.webpush.fcm_options.link) {
            return windowClient.focus();
          }
          return false;
        });

        if (!hadWindowToFocus) {
          // If a window matching the URL wasn't found, open a new one
          clients.openWindow(event.notification.data.FCM_MSG.webpush.fcm_options.link);
        }
      })
  );
});
