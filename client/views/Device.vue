<template>
  <div class="relative h-full lg:flex">
    <div
      class="absolute top-0 left-0 flex-1 hidden w-64 h-full px-3 pt-6 overflow-auto scrolling-touch lg:block scrollbar-transparent hover:scrollbar-gray-200"
    >
      <Breadcrumbs :items="crumbs" />
      <DeviceGrid :devices="devices" />
    </div>

    <div
      class="top-0 right-0 flex-1 h-full pt-6 pl-3 scrolling-touch lg:absolute lg:w-1/2 lg:overflow-auto lg:pr-3 scrollbar-transparent hover:scrollbar-gray-200"
    >
      <div class="flex flex-col h-full">
        <template v-if="device">
          <Breadcrumbs class="lg:invisible" :items="crumbs" />

          <div class="relative mb-8 overflow-hidden rounded-lg shadow-lg aspect-ratio-1/1">
            <DevicePanel :device="device" class="absolute w-full h-full p-5" />
          </div>
        </template>

        <p v-else class="mt-auto text-center">
          <span class="text-4xl font-bold text-warn">!</span><br />
          <span class="font-bold">"{{ deviceName }}"</span> wurde nicht gefunden.<br />
          Ist der Controller online?
        </p>

        <footer class="flex justify-center shrink-0 p-4 mt-auto lg:hidden">
          <PrimaryButton as="router-link" to="/"> Zurück zur Geräteliste </PrimaryButton>
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
