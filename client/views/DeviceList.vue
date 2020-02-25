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

import { state } from '../utils/socket'

export default {
  components: { Header, DeviceTile },
  computed: {
    devices() {
      return Object.values(state.devices)
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
