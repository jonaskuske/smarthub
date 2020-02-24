<template>
  <router-link :to="`/devices/${device.name}`" class="cursor-default">
    <BaseTile :device="device" :status="isStarted ? 'Aktiviert' : 'Deaktiviert'">
      <ToggleButton :checked="isStarted" @change="handleChange" />
    </BaseTile>
  </router-link>
</template>

<script>
import BaseTile from './_BaseTile'
import ToggleButton from '../../components/ToggleButton.vue'
import { socketClient } from '../../utils'
import * as EVENTS from '../../../shared/event-types'

export default {
  components: { BaseTile, ToggleButton },
  props: {
    device: { type: Object, required: true },
  },
  data: () => ({ isStarted: false }),
  created() {
    socketClient.on(EVENTS.SYS_STARTED, this.handleSystemStart)
    socketClient.on(EVENTS.ALARM_DISABLED, this.handleSystemStop)
  },
  beforeDestroy() {
    socketClient.off(EVENTS.SYS_STARTED, this.handleSystemStart)
    socketClient.off(EVENTS.ALARM_DISABLED, this.handleSystemStop)
  },
  methods: {
    handleChange(evt) {
      if (evt.target.checked) socketClient.emit(EVENTS.START_SYS)
      else socketClient.emit(EVENTS.DISABLE_ALARM)
    },
    handleSystemStart() {
      this.isStarted = true
    },
    handleSystemStop() {
      this.isStarted = false
    },
  },
}
</script>
