<template>
  <main class="h-full flex flex-col">
    <div class="bg-white shadow-lg p-8 rounded-b-xl">
      <div class="relative">
        <router-link
          to="/settings"
          class="absolute top-0 right-0 text-lightgray transform transition-transform duration-300 ease-in-out hover:rotate-90 focus:text-lightblue"
        >
          <span class="sr-only">Einsatellungen</span>
          <Cog aria-hidden="true" />
        </router-link>

        <p class="mb-3">
          <time>{{ currentTime }}</time>
        </p>
        <p class="text-3xl mb-10">
          Willkommen <span class="font-bold">{{ persistedState.name }}!</span>
        </p>
        <StatusBar>
          <p v-if="!serverState.controller.online && 0" class="text-lightblue w-full">
            <WifiOff class="inline align-text-top mr-1 w-6" /> Der Controller ist offline.
          </p>
          <p v-else-if="ringingAlarmDevice" class="text-warn w-full cursor-pointer hover:underline">
            <router-link :to="`/devices/${ringingAlarmDevice.name}`">
              <Warn class="inline align-text-top mr-1 w-6" /> Achtung! Alarm ausgelöst!
            </router-link>
          </p>
        </StatusBar>
      </div>
    </div>

    <router-view />
  </main>
</template>

<script>
import StatusBar from '../components/StatusBar'
import { formatTime, persistedState, serverState } from '../utils'
import { DEVICE_ALARM } from '../../shared/device-types'

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
      const isAlarmDevice = device => device.type === DEVICE_ALARM
      const alarmDevices = Object.values(serverState.devices).filter(isAlarmDevice)

      return alarmDevices.find(device => device.data.state === 'ringing')
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