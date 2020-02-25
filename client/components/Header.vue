<template>
  <div class="bg-white shadow-lg p-8 rounded-b-xl">
    <div class="relative">
      <router-link
        to="/settings"
        class="absolute top-0 right-0 text-lightgray transform transition-transform duration-300 ease-in-out hover:rotate-90 focus:text-lightblue"
      >
        <span class="sr-only">Einstellungen</span>
        <Cog aria-hidden="true" />
      </router-link>

      <p class="mb-3">
        <time>{{ currentTime }}</time>
      </p>
      <p class="text-3xl mb-10">
        Willkommen <span class="font-bold">{{ name }}!</span>
      </p>

      <div class="font-bold flex text-xl">
        <p v-if="!controller.online" class="text-lightblue w-full">
          <WifiOff class="inline align-text-top mr-1 w-6" /> Der Controller ist offline.
        </p>
        <p
          v-else-if="alarmDevice.data.state === 'ringing'"
          class="text-warn cursor-pointer w-full hover:underline"
        >
          <Warn class="inline align-text-top mr-1 w-6" /> Achtung! Alarm ausgelöst!
        </p>
        <template v-else>
          <div class="mr-8">
            <Home class="inline align-top" />
            <transition
              mode="out-in"
              enter-class="opacity-0"
              leave-to-class="opacity-0"
              enter-active-class="transition-opacity duration-150 ease-in"
              leave-active-class="transition-opacity duration-200 ease-out"
            >
              <span :key="room.temperature">{{ room.temperature || '--' }}°C</span>
            </transition>
          </div>
          <div>
            <Wind class="inline align-top" />
            <transition
              mode="out-in"
              enter-class="opacity-0"
              leave-to-class="opacity-0"
              enter-active-class="transition-opacity duration-150 ease-in"
              leave-active-class="transition-opacity duration-200 ease-out"
            >
              <span :key="room.humidity">{{ room.humidity || '--' }}%</span>
            </transition>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { state } from '../utils/socket'
import { formatTime, getName } from '../utils'
import { DEVICE_TYPES } from '../../shared/initial-state'

export default {
  data: () => ({ currentTime: formatTime(), timeIntervalId: null }),
  computed: {
    name() {
      return getName()
    },
    controller() {
      return state.controller
    },
    room() {
      return state.room
    },
    alarmDevice() {
      return Object.values(state.devices).find(device => device.type === DEVICE_TYPES.ALARM)
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
