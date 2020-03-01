import * as DEVICE_TYPES from './device-types'

const devices = [
  {
    name: 'Wasserkocher',
    type: DEVICE_TYPES.DEVICE_KETTLE,
    image: '/images/kettle.png',
    data: { active: false, temperature: null },
  },
  {
    name: 'Alarmanlage',
    type: DEVICE_TYPES.DEVICE_ALARM,
    image: '/images/alarm.png',
    data: { state: 'disabled', silentMode: false },
  },
  {
    name: 'ESP-12F (8266)',
    type: DEVICE_TYPES.DEVICE_CONTROLLER,
    image: '/images/esp8266.png',
  },
]

export const getInitialState = () => ({
  controller: { online: false, connectionId: null },
  room: { temperature: null, humidity: null },
  devices: Object.fromEntries(devices.map(device => [device.name, { ...device }])),
})
