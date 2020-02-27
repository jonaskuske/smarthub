self.addEventListener('fetch', event => {
  return event.respondWith(fetch(event.request))
})

self.addEventListener('notificationclick', evt => {
  console.log(evt)
})
