import Vue from 'vue'
import io from 'socket.io-client'
import { ACTIONS, SMARTHUB_UPDATES } from '../../shared/event-types'
import { getInitialState } from '../../shared/initial-state'

const { SOCKET_URL = '' } = process.env

const socketClient = io(`${SOCKET_URL}/smarthub`)

export const serverState = Vue.observable(getInitialState())

export function emit(action) {
  if (!Object.values(ACTIONS).includes(action)) throw Error(`Unknown action: ${action}`)

  socketClient.emit(action)
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
