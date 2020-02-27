<template>
  <div class="h-full flex flex-col px-6 pt-6">
    <h2 class="text-lightgray font-bold mb-5">Geräte</h2>

    <div v-if="devices.length" class="grid gap-6 device-grid">
      <DeviceTile v-for="device in devices" :key="device.name" :device="device" />
    </div>

    <p v-else class="my-auto text-center">
      <span class="font-bold text-4xl text-warn">!</span><br />
      Keine Geräte vorhanden.<br />Registriere Controller, um Smart Hub zu nutzen.
    </p>
  </div>
</template>

<script>
import DeviceTile from './deviceList/DeviceTile'
import { serverState } from '../utils'

export default {
  components: { DeviceTile },
  computed: {
    devices() {
      return Object.values(serverState.devices)
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
