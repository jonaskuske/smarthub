<template>
  <div v-if="devices.length" class="grid gap-6 device-grid pb-6">
    <DeviceTile v-for="device in devices" :key="device.name" :device="device" />
  </div>

  <p v-else class="my-auto text-center">
    <span class="font-bold text-4xl text-warn">!</span><br />
    Keine Geräte vorhanden.<br />Registriere Controller, um Smart Hub zu nutzen.
  </p>
</template>

<script>
import DeviceTile from './deviceGrid/DeviceTile'

export default {
  components: { DeviceTile },
  props: {
    /** @type {Array<{}>} */
    devices: { type: Array, required: true },
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
