<template>
  <BaseTile :device="device" :status="isOnline ? 'Online' : 'Offline'">
    <div class="w-3 h-3 rounded-full" :class="isOnline ? 'bg-green-600' : 'bg-red-600'" />
  </BaseTile>
</template>

<script>
import BaseTile from './_BaseTile'
import { socketClient } from '../../utils'
import * as EVENTS from '../../../shared/event-types'

export default {
  components: { BaseTile },
  props: {
    device: { type: Object, required: true },
  },
  data: () => ({ isOnline: false }),
  created() {
    socketClient.on(EVENTS.CONTROLLER_CONNECTED, this.handleConnected)
    socketClient.on(EVENTS.CONTROLLER_DISCONNECTED, this.handleDisconnected)
  },
  beforeDestroy() {
    socketClient.off(EVENTS.CONTROLLER_CONNECTED, this.handleConnected)
    socketClient.off(EVENTS.CONTROLLER_DISCONNECTED, this.handleDisconnected)
  },
  methods: {
    handleConnected() {
      this.isOnline = true
    },
    handleDisconnected() {
      this.isOnline = false
    },
  },
}
</script>
