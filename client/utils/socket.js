import Vue from 'vue'
import io from 'socket.io-client'
import { ACTIONS, SMARTHUB_UPDATES } from '../../shared/event-types'
import { getInitialState } from '../../shared/initial-state'

const { SOCKET_URL = '' } = process.env

const socketClient = io(`${SOCKET_URL}/smarthub`)

export const state = Vue.observable(getInitialState())

export function emit(action) {
  if (!Object.values(ACTIONS).includes(action)) {
    throw Error(`Unknown action: ${action}`)
  }

  socketClient.emit(action)
}

socketClient.on(SMARTHUB_UPDATES.ROOT, rootState => {
  Object.assign(state, rootState)
})

socketClient.on(SMARTHUB_UPDATES.ROOM, roomData => {
  state.room = roomData
})

socketClient.on(SMARTHUB_UPDATES.DEVICE, deviceData => {
  state.devices[deviceData.name] = deviceData
})

socketClient.on(SMARTHUB_UPDATES.CONTROLLER, controllerData => {
  state.controller = controllerData
})
