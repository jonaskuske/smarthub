import { getInitialState } from '../shared/initial-state'
import { SMARTHUB_UPDATES } from '../shared/event-types'

export class State {
  /** @param {{ emitCallback: (event: string, data?: any) => void) }} */
  constructor({ emitCallback = () => {} }) {
    this.state = getInitialState()
    this.emitCallback = emitCallback
  }

  updateController(controllerData) {
    this.state.controller = { ...this.state.controller, ...controllerData }
    this.emitCallback(SMARTHUB_UPDATES.CONTROLLER, this.state.controller)
  }

  updateRoom(roomInfo) {
    this.state.room = { ...this.state.room, ...roomInfo }
    this.emitCallback(SMARTHUB_UPDATES.ROOM, this.state.room)
  }

  updateDevice(name, deviceData) {
    const device = this.state.devices[name]
    if (!device) throw Error(`Unknown device: ${name}`)

    this.state.devices[name].data = { ...device.data, ...deviceData }
    this.emitCallback(SMARTHUB_UPDATES.DEVICE, this.state.devices[name])
  }

  replaceState(newState) {
    this.state = newState
    this.emitCallback(SMARTHUB_UPDATES.ROOT, this.state)
  }

  reset() {
    this.replaceState(getInitialState())
  }
}
