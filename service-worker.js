self.addEventListener('push', function(event) {
  const payload = event.data ? event.data.text() : 'Pesan baru dari UPT Puskesmas Cibatu';
  event.waitUntil(self.registration.showNotification('UPT Puskesmas Cibatu', { body: payload }));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/announcement.html'));
});
