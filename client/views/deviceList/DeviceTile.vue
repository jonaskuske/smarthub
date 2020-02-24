<template>
  <component :is="Tile" :device="device" />
</template>

<script>
import AlarmTileVue from './AlarmTile.vue'
import ControllerTileVue from './ControllerTile.vue'
import KettleTileVue from './KettleTile.vue'
import { DEVICE_TYPES } from '../../utils/devices'

export default {
  props: {
    device: { type: Object, required: true },
  },
  computed: {
    Tile() {
      switch (this.device.type) {
        case DEVICE_TYPES.CONTROLLER:
          return ControllerTileVue
        case DEVICE_TYPES.ALARM:
          return AlarmTileVue
        case DEVICE_TYPES.KETTLE:
          return KettleTileVue
        default:
          return null
      }
    },
  },
}
</script>
