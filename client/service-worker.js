import { CONTROLLER_ACTIONS } from '../shared/event-types'
import appIcon from './assets/icons/android-chrome-512x512.png'

self.addEventListener('install', evt => {
  if (self.skipWaiting) evt.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', evt => {
  if (self.clients) evt.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', evt => {
  return evt.respondWith(fetch(evt.request))
})

self.addEventListener('notificationclick', evt => {
  switch (evt.action) {
    case 'close':
      evt.notification.close()
      break
    case 'stop_alarm':
      evt.notification.close()
      evt.waitUntil(
        fetch('/emit', {
          method: 'POST',
          body: JSON.stringify({ EVENT: CONTROLLER_ACTIONS.ALARM_DISABLE }),
          headers: { 'Content-Type': 'application/json' },
        }).catch(_ => _),
      )
      break
    default:
      evt.notification.close()
      evt.waitUntil(
        clients.matchAll({ type: 'window' }).then(async allClients => {
          const device = evt.notification.data.device
          const url = device ? `/devices/${device}` : '/'
          for (const client of allClients) {
            if (client.focus && client.navigate) {
              await Promise.all([client.focus(), client.navigate(url)])
              return
            }
          }
          await clients.openWindow(url)
        }),
      )
  }
})

self.addEventListener('push', function(evt) {
  const { title = 'Neue Benachrichtigung!', ...serverOpts } = evt.data ? evt.data.json() : {}
  const options = {
    icon: appIcon,
    vibrate: [100, 50, 100],
    ...serverOpts,
    data: { ...serverOpts.data, dateOfArrival: Date.now() },
  }
  evt.waitUntil(self.registration.showNotification(title, options))
})
