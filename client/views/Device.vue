<template>
  <div class="h-full flex flex-col px-6 pt-6">
    <template v-if="device">
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
    </template>

    <p v-else class="my-auto text-center">
      <span class="font-bold text-4xl text-warn">!</span><br />
      <span class="font-bold">"{{ deviceName }}"</span> wurde nicht gefunden.<br />
      Ist der Controller online?
    </p>

    <footer class="flex justify-center mt-auto p-4 flex-shrink-0">
      <PrimaryButton as="router-link" to="/">
        Zurück zur Geräteliste
      </PrimaryButton>
    </footer>
  </div>
</template>

<script>
import DevicePanel from './device/DevicePanel'
import PrimaryButton from '../components/PrimaryButton'
import { serverState } from '../utils'

export default {
  components: { DevicePanel, PrimaryButton },
  props: {
    deviceName: { type: String, required: true },
  },
  computed: {
    /** @returns {any} */
    device() {
      return serverState.devices[this.deviceName]
    },
  },
}
</script>
