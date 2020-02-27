export * from './persisted-state'
export * from './server-state'

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const formatTime = (time = new Date()) => dateTimeFormatter.format(time)
export const wait = time => new Promise(resolve => setTimeout(resolve, time))
