export * from './socket'

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })

export const formatTime = (time = new Date()) => dateTimeFormatter.format(time)
