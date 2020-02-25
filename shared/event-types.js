export const REGISTER_CONTROLLER = 'REGISTER_CONTROLLER'

export const ACTIONS = {
  KETTLE_TURN_ON: 'ACTION_KETTLE_TURN_ON',
  ALARM_DISABLE: 'ACTION_ALARM_DISABLE',
  ALARM_ENABLE: 'ACTION_ALARM_ENABLE',
  ALARM_ENABLE_SILENT_MODE: 'ACTION_ALARM_ENABLE_SILENT_MODE',
  ALARM_DISABLE_SILENT_MODE: 'ACTION_ALARM_DISABLE_SILENT_MODE',
}

export const SERVER_UPDATES = {
  KETTLE_TEMP: 'UPDATE_KETTLE_TEMP',
  KETTLE_ACTIVE_STATE: 'UPDATE_KETTLE_ACTIVE_STATE',
  ALARM_STATE: 'UPDATE_ALARM_STATE',
  ALARM_SILENT_MODE_STATE: 'UPDATE_ALARM_SILENT_MODE_STATE',
  ROOM_TEMP: 'UPDATE_ROOM_TEMP',
  ROOM_HUMIDITY: 'UPDATE_ROOM_HUMIDITY',
}

export const SMARTHUB_UPDATES = {
  ROOT: 'UPDATE_ROOT',
  CONTROLLER: 'UPDATE_CONTROLLER',
  ROOM: 'UPDATE_ROOM',
  DEVICE: 'UPDATE_DEVICE',
}
