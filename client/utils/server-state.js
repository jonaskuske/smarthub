import Vue from 'vue'
import io from 'socket.io-client'
import { CONTROLLER_ACTIONS, SMARTHUB_UPDATES, SERVER_ACTIONS } from '../../shared/event-types'
import { getInitialState } from '../../shared/initial-state'

const { SOCKET_URL = '' } = process.env

const socketClient = io(`${SOCKET_URL}/smarthub`)

export const serverState = Vue.observable(getInitialState())

export function emitToController(action, ...data) {
  if (!Object.values(CONTROLLER_ACTIONS).includes(action)) throw Error(`Unknown action: ${action}`)

  let markAsDone
  const donePromise = new Promise(resolve => (markAsDone = resolve))

  socketClient.emit(action, ...data, markAsDone)

  return donePromise
}

export function emitToServer(action, ...data) {
  if (!Object.values(SERVER_ACTIONS).includes(action)) throw Error(`Unknown action: ${action}`)

  let markAsDone
  const donePromise = new Promise(resolve => (markAsDone = resolve))

  socketClient.emit(action, ...data, markAsDone)

  return donePromise
}

socketClient.on(SMARTHUB_UPDATES.ROOT, nextState => {
  Object.assign(serverState, nextState)
})

socketClient.on(SMARTHUB_UPDATES.ROOM, roomData => {
  serverState.room = roomData
})

socketClient.on(SMARTHUB_UPDATES.DEVICE, deviceData => {
  serverState.devices[deviceData.name] = deviceData
})

socketClient.on(SMARTHUB_UPDATES.CONTROLLER, controllerData => {
  serverState.controller = controllerData
})
