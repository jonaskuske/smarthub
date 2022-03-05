import { getInitialState } from '../shared/initial-state.mjs'
import { SMARTHUB_UPDATES } from '../shared/event-types.mjs'

export class State {
  /** @param {{ onUpdate: (event: string, data?: any) => void) }} */
  constructor({ onUpdate = () => {} }) {
    this.state = getInitialState()
    this.onUpdate = onUpdate
  }

  updateController(controllerData) {
    this.state.controller = { ...this.state.controller, ...controllerData }
    this.onUpdate(SMARTHUB_UPDATES.CONTROLLER, this.state.controller)
  }

  updateRoom(roomInfo) {
    this.state.room = { ...this.state.room, ...roomInfo }
    this.onUpdate(SMARTHUB_UPDATES.ROOM, this.state.room)
  }

  updateDevice(name, deviceData) {
    const device = this.state.devices[name]
    if (!device) throw Error(`Unknown device: ${name}`)

    this.state.devices[name].data = { ...device.data, ...deviceData }
    this.onUpdate(SMARTHUB_UPDATES.DEVICE, this.state.devices[name])
  }

  replaceState(newState) {
    this.state = newState
    this.onUpdate(SMARTHUB_UPDATES.ROOT, this.state)
  }

  reset() {
    this.replaceState(getInitialState())
  }
}
