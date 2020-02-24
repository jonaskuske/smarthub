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
        <div class="transition-opacity duration-500 ease-in mr-8" :class="{ 'opacity-0': !temp }">
          <Sun class="inline" />
          {{ temp }}°C
        </div>
        <div class="transition-opacity duration-500 ease-in" :class="{ 'opacity-0': !humidity }">
          <Wind class="inline" />
          {{ humidity }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime, getName, socketClient } from '../utils'
import * as EVENTS from '../../shared/event-types'

export default {
  data: () => ({ currentTime: formatTime(), temp: undefined, humidity: undefined }),
  computed: {
    name() {
      return getName()
    },
  },
  created() {
    socketClient.on(EVENTS.TEMPERATUR, this.updateTemp)
    socketClient.on(EVENTS.HUMIDITY, this.updateHumidity)
  },
  beforeDestroy() {
    socketClient.off(EVENTS.TEMPERATUR, this.updateTemp)
    socketClient.off(EVENTS.HUMIDITY, this.updateHumidity)
  },
  methods: {
    updateTemp(data) {
      this.temp = data.temp
    },
    updateHumidity(data) {
      this.humidity = data.hum
    },
  },
}
</script>
