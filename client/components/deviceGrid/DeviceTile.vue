<template>
  <component :is="Tile" :device="device" />
</template>

<script>
import AlarmTileVue from './AlarmTile.vue'
import ControllerTileVue from './ControllerTile.vue'
import KettleTileVue from './KettleTile.vue'
import * as DEVICE_TYPES from '../../../shared/device-types'

export default {
  props: {
    device: { type: Object, required: true },
  },
  computed: {
    Tile() {
      switch (this.device.type) {
        case DEVICE_TYPES.DEVICE_CONTROLLER:
          return ControllerTileVue
        case DEVICE_TYPES.DEVICE_ALARM:
          return AlarmTileVue
        case DEVICE_TYPES.DEVICE_KETTLE:
          return KettleTileVue
        default:
          return null
      }
    },
  },
}
</script>
