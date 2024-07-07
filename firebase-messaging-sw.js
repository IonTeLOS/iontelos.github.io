importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js');

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

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    data: {
      path: payload.data.uuid
    }
  };

//store a value for the redirect to the Marko link to happen when page is opened or focused  
localforage.setItem('newNot', payload.data.path).then(function() {
  console.log('Value stored successfully in Service Worker.');
}).catch(function(err) {
  console.error('Error storing value in Service Worker:', err);
});

      // Check if it's a mobile device
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    // This is likely a mobile device, don't show the notification but store a value for effective redirect
    return;
  }
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});



self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const newUrl = event.notification.data.path;

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      if (clientList.length > 0) {
        // Focus on the first client that is already open
        return clientList[0].focus().then(client => {
          client.postMessage({
            action: 'open_url',
            url: `https://teloslinux.org/marko/newfile?uiid=${newUrl}`
          });
        });
      } else {
        // If no clients are open, open a new window
        return clients.openWindow(`https://teloslinux.org/marko/newfile?uiid=${newUrl}`);
      }
    })
  );
});
