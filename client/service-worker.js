import { CONTROLLER_ACTIONS } from '../shared/event-types'
import appIcon from './assets/icons/android-chrome-512x512.png'

self.addEventListener('install', (evt) => {
  if (self.skipWaiting) evt.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (evt) => {
  if (self.clients) evt.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (evt) => {
  return evt.respondWith(fetch(evt.request))
})

/**
 * Handle clicks on the notification itself or on buttons within the notification.
 */
self.addEventListener('notificationclick', (evt) => {
  switch (evt.action) {
    // "Close" button:
    // Just close the notification. Duh.
    case 'close':
      evt.notification.close()
      break

    // "Stop Alarm" button:
    // Close the notification and send a request to disable the alarm.
    case 'stop_alarm':
      evt.notification.close()
      evt.waitUntil(
        fetch('/emit', {
          method: 'POST',
          body: JSON.stringify({ EVENT: CONTROLLER_ACTIONS.ALARM_DISABLE }),
          headers: { 'Content-Type': 'application/json' },
        }).catch((_) => _),
      )
      break

    // Click on the notification itself:
    // Close the notification and open the app. If we already have a window open we'll try to
    // re-use that one, otherwise we open a new window.  If the notification was bound
    // to a specific device (e.g. alarm), we'll navigate there instead of going to /.
    default:
      evt.notification.close()
      evt.waitUntil(
        clients.matchAll({ type: 'window' }).then(async (allClients) => {
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

/**
 * Display a notification when we receive a "push", letting the server send the options as JSON
 */
self.addEventListener('push', function (evt) {
  const { title = 'Neue Benachrichtigung!', ...serverOpts } = evt.data ? evt.data.json() : {}
  const options = {
    icon: appIcon,
    vibrate: [100, 50, 100],
    ...serverOpts,
    data: { ...serverOpts.data, dateOfArrival: Date.now() },
  }

  evt.waitUntil(self.registration.showNotification(title, options))
})
