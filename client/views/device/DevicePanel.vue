<template>
  <component :is="Tile" :device="device" />
</template>

<script>
import AlarmPanel from './AlarmPanel'
import KettlePanel from './KettlePanel'
import * as DEVICE_TYPES from '../../../shared/device-types.mjs'

export default {
  props: {
    device: { type: Object, required: true },
  },
  computed: {
    Tile() {
      switch (this.device.type) {
        case DEVICE_TYPES.DEVICE_ALARM:
          return AlarmPanel
        case DEVICE_TYPES.DEVICE_KETTLE:
          return KettlePanel
        default:
          return null
      }
    },
  },
}
</script>
