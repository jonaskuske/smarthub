import Vue from 'vue'
import io from 'socket.io-client'

export const socketClient = io('http://smarthub.jonaskuske.de/smarthub')

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const formatTime = (time = new Date()) => dateTimeFormatter.format(time)

export const DEFAULT_NAME = 'Erdling'
const LSTORAGE_KEY = '__SMARTHUB__NAME'

const state = Vue.observable({ name: localStorage.getItem(LSTORAGE_KEY) || DEFAULT_NAME })

export const getName = () => state.name
export const updateName = name => {
  localStorage.setItem(LSTORAGE_KEY, name)
  state.name = name
}
