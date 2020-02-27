<template>
  <div class="h-full relative lg:flex">
    <div
      class="hidden lg:block flex-1 pt-6 pr-3 overflow-auto scrollbar-transparent hover:scrollbar-gray-200 scrolling-touch absolute left-0 top-0 h-full w-64"
    >
      <Breadcrumbs :items="crumbs" />
      <DeviceGrid :devices="devices" />
    </div>

    <div
      class="h-full flex-1 pl-3 pt-6 lg:absolute top-0 right-0 lg:w-1/2 lg:overflow-auto scrollbar-transparent hover:scrollbar-gray-200 scrolling-touch"
    >
      <div class="h-full flex flex-col">
        <template v-if="device">
          <Breadcrumbs class="lg:invisible" :items="crumbs" />

          <div class="relative aspect-ratio-1/1 shadow-lg overflow-hidden rounded-lg mb-8">
            <DevicePanel :device="device" class="absolute w-full h-full p-5" />
          </div>
        </template>

        <p v-else class="mt-auto text-center">
          <span class="font-bold text-4xl text-warn">!</span><br />
          <span class="font-bold">"{{ deviceName }}"</span> wurde nicht gefunden.<br />
          Ist der Controller online?
        </p>

        <footer class="flex justify-center mt-auto p-4 flex-shrink-0 lg:hidden">
          <PrimaryButton as="router-link" to="/">
            Zurück zur Geräteliste
          </PrimaryButton>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import DeviceGrid from '../components/DeviceGrid'
import Breadcrumbs from '../components/Breadcrumbs'
import DevicePanel from './device/DevicePanel'
import PrimaryButton from '../components/PrimaryButton'
import { serverState } from '../utils'

export default {
  components: { Breadcrumbs, DeviceGrid, DevicePanel, PrimaryButton },
  props: {
    deviceName: { type: String, required: true },
  },
  computed: {
    /** @returns {Array} */
    crumbs() {
      return [{ text: 'Geräte', to: '/devices' }, { text: this.deviceName }]
    },
    devices() {
      return Object.values(serverState.devices)
    },
    /** @returns {any} */
    device() {
      return serverState.devices[this.deviceName]
    },
  },
}
</script>
