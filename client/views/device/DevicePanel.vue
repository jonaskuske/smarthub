<template>
  <component :is="Tile" :device="device" />
</template>

<script>
import AlarmPanel from './AlarmPanel'
import KettlePanel from './KettlePanel'
import { DEVICE_TYPES } from '../../../shared/initial-state'

export default {
  props: {
    device: { type: Object, required: true },
  },
  computed: {
    Tile() {
      switch (this.device.type) {
        case DEVICE_TYPES.ALARM:
          return AlarmPanel
        case DEVICE_TYPES.KETTLE:
          return KettlePanel
        default:
          return null
      }
    },
  },
}
</script>
