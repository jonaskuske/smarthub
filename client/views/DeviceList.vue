<template>
  <div class="h-full flex flex-col pt-6">
    <h2 class="text-lightgray font-bold mb-5">Geräte</h2>

    <DeviceGrid :devices="devices" />
  </div>
</template>

<script>
import DeviceGrid from '../components/DeviceGrid'
import { serverState } from '../utils'

export default {
  components: { DeviceGrid },
  computed: {
    devices() {
      return Object.values(serverState.devices)
    },
  },
}
</script>
