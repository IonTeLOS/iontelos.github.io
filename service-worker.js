self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  // You can cache assets here if needed
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
});

self.addEventListener('push', event => {
  console.log('Push event received:', event);

  const data = event.data ? event.data.json() : {};
  console.log('Push event data:', data);

  const options = {
    body: data.body || 'You have a new notification.',
    icon: data.icon || '/icon.png',
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'New Notification', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        const client = clientList[0];
        return client.navigate(event.notification.data.url).then(() => client.focus());
      }
      return clients.openWindow(event.notification.data.url);
    })
  );
});

