export const DEVICE_TYPES = {
  CONTROLLER: 'CONTROLLER',
  ALARM: 'ALARM',
  KETTLE: 'KETTLE',
}

const devices = [
  {
    name: 'Wasserkocher',
    type: DEVICE_TYPES.KETTLE,
    image: '/images/kettle.png',
    data: { active: false, temperature: null },
  },
  {
    name: 'Alarmanlage',
    type: DEVICE_TYPES.ALARM,
    image: '/images/alarm.png',
    data: { state: 'disabled', silentMode: false },
  },
  {
    name: 'ESP-12F (8266)',
    type: DEVICE_TYPES.CONTROLLER,
    image: '/images/esp8266.png',
  },
]

export const getInitialState = () => ({
  controller: { online: false },
  room: { temperature: null, humidity: null },
  devices: Object.fromEntries(devices.map(device => [device.name, device])),
})
