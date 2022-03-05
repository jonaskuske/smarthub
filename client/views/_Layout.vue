<template>
  <main class="flex flex-col h-full">
    <div class="z-10 bg-white shadow-lg rounded-b-xl">
      <div class="container p-8">
        <div class="relative">
          <router-link
            id="app_settings"
            to="/settings"
            class="absolute top-0 right-0 transition-transform duration-300 ease-in-out text-lightgray hover:rotate-90 focus:rotate-90 focus:text-lightblue focus:outline-none"
          >
            <span class="sr-only">Einstellungen</span>
            <Cog aria-hidden="true" />
          </router-link>

          <p class="mb-3">
            <time>{{ currentTime }}</time>
          </p>
          <p class="mb-10 text-3xl">
            Willkommen <span class="font-bold">{{ persistedState.name }}!</span>
          </p>
          <StatusBar>
            <p v-if="!serverState.controller.online" class="w-full text-lightblue">
              <WifiOff class="inline w-6 mr-1 align-text-top" /> Der Controller ist offline.
            </p>
            <p
              v-else-if="ringingAlarmDevice"
              class="w-full cursor-pointer text-warn hover:underline"
            >
              <router-link :to="`/devices/${ringingAlarmDevice.name}`">
                <Warn class="inline w-6 mr-1 align-text-top" /> Achtung! Alarm ausgelöst!
              </router-link>
            </p>
          </StatusBar>
        </div>
      </div>
    </div>

    <div class="container h-full">
      <router-view />
    </div>
  </main>
</template>

<script>
import StatusBar from '../components/StatusBar'
import { formatTime, persistedState, serverState } from '../utils'
import { DEVICE_ALARM } from '../../shared/device-types.mjs'

export default {
  components: { StatusBar },
  data: () => ({ currentTime: formatTime(), timeIntervalId: null }),
  computed: {
    persistedState() {
      return persistedState
    },
    serverState() {
      return serverState
    },
    ringingAlarmDevice() {
      const isAlarmDevice = (device) => device.type === DEVICE_ALARM
      const alarmDevices = Object.values(serverState.devices).filter(isAlarmDevice)

      return alarmDevices.find((device) => device.data.state === 'ringing')
    },
  },
  created() {
    this.timeIntervalId = setInterval(() => (this.currentTime = formatTime()), 60000)
  },
  beforeDestroy() {
    clearInterval(this.timeIntervalId)
  },
}
</script>
