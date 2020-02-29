const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const formatTime = (time = new Date()) => dateTimeFormatter.format(time)
export const wait = time => new Promise(resolve => setTimeout(resolve, time))

export * from './server-state'
export * from './notifications'
export * from './persisted-state'
