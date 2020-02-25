self.addEventListener('fetch', event => {
  return fetch(event.request)
})

self.addEventListener('notificationclick', evt => {
  console.log(evt)
})
