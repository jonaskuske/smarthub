<template>
  <div class="h-full flex flex-col">
    <Header />
    <main class="px-6 pt-6">
      <nav aria-label="breadcrumb" class="text-lightgray mb-5">
        <ol>
          <li class="inline font-light">
            <router-link to="/devices" class="hocus:underline">Geräte</router-link>
            &gt;
          </li>
          <li aria-current="page" class="inline font-bold">{{ device.name }}</li>
        </ol>
      </nav>

      <div class="relative aspect-ratio-1/1 shadow-lg overflow-hidden rounded-lg mb-8">
        <DevicePanel :device="device" class="absolute w-full h-full p-5" />
      </div>
    </main>

    <footer class="flex justify-center mt-auto p-4">
      <PrimaryButton as="router-link" to="/">
        Zurück zur Geräteliste
      </PrimaryButton>
    </footer>
  </div>
</template>

<script>
import PrimaryButton from '../components/PrimaryButton'
import DevicePanel from './device/DevicePanel'
import Header from '../components/Header'
import { DEVICE_TYPES } from '../../shared/initial-state'
import { state } from '../utils/socket'

export default {
  components: { Header, DevicePanel, PrimaryButton },
  props: {
    deviceName: { type: String, required: true },
  },
  data: () => ({ DEVICE_TYPES }),
  computed: {
    /** @returns {any} */
    device() {
      return state.devices[this.deviceName]
    },
  },
}
</script>
