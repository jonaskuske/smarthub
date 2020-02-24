<template>
  <div>
    <Header />

    <main class="px-6 pt-6">
      <h2 class="text-lightgray font-bold mb-5">Geräte</h2>
      <div class="grid gap-6 device-grid">
        <DeviceTile v-for="device in devices" :key="device.name" :device="device" />
      </div>
    </main>
  </div>
</template>

<script>
import Header from '../components/Header'
import DeviceTile from './deviceList/DeviceTile'

import devices from '../utils/devices'
import { formatTime, socketClient, wait } from '../utils'
import * as EVENT_TYPES from '../../shared/event-types'

export default {
  components: { Header, DeviceTile },
  data: () => ({ devices, currentTime: formatTime() }),
  created() {
    socketClient.on(EVENT_TYPES.TURN_KETTLE_ON_SUCCESS, this.handleSuccess)
  },
  beforeDestroy() {
    socketClient.off(EVENT_TYPES.TURN_KETTLE_ON_SUCCESS, this.handleSuccess)
  },
  methods: {
    turnOn() {
      this.kettleStatus = 'Wird eingeschaltet'
      socketClient.emit(EVENT_TYPES.TURN_KETTLE_ON)
    },
    handleSuccess() {
      this.kettleStatus = 'Eingeschaltet'
      wait(2500).then(() => (this.kettleStatus = 'Bereit'))
    },
  },
}
</script>

<style scoped>
.device-grid {
  grid-template: auto / repeat(auto-fill, minmax(128px, 1fr));
}
@screen md {
  .device-grid {
    grid-template: auto / repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
