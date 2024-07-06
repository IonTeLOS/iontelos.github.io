importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');

const firebaseConfig = {
  // Your Firebase project configuration
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
      path: payload.data.uuid,
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const path = event.notification.data.path;

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
            url: `https://teloslinux.org/marko/newfile?uuid=${path}`
          });
        });
      } else {
        // If no clients are open, open a new window
        return clients.openWindow(`https://teloslinux.org/marko/newfile?uuid=${path}`);
      }
    })
  );
});
