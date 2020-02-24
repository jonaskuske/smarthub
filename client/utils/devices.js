import kettleImage from '../assets/images/kettle.png'
import alarmImage from '../assets/images/alarm.png'
import esp8266Image from '../assets/images/esp8266.png'

export const DEVICE_TYPES = {
  CONTROLLER: 'CONTROLLER',
  ALARM: 'ALARM',
  KETTLE: 'KETTLE',
}

export default [
  {
    type: DEVICE_TYPES.KETTLE,
    name: 'Wasserkocher',
    image: kettleImage,
  },
  {
    type: DEVICE_TYPES.ALARM,
    name: 'Alarmanlage',
    image: alarmImage,
  },
  {
    type: DEVICE_TYPES.CONTROLLER,
    name: 'ESP-12F (8266)',
    image: esp8266Image,
  },
]
