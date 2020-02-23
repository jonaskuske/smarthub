<template>
  <div id="root">
    <div class="bg-white shadow-lg p-8">
      <div class="relative">
        <div class="absolute top-0 right-0 text-gray">
          <Cog />
        </div>
        <time>{{ currentTime }}</time>
        <p class="text-xl">
          Willkommen <span class="font-bold">{{ name }}</span>
        </p>
        <div class="font-bold">
          <div>
            <Sun class="inline" />
            26°C
          </div>
          <div>
            <Wind class="inline" />
            64.2%
          </div>
        </div>
      </div>
    </div>

    <main class="px-12 pt-12">
      <h2 class="text-gray text-lg">Geräte</h2>
      <div class="grid grid-cols-2 gap-12">
        <DeviceCard />
        <DeviceCard />
      </div>
    </main>
    <p>Kettle Status: {{ kettleStatus }}</p>
    <button type="button" @click="turnOn">Turn Kettle on</button>
    <button type="button" @click="turnOffAlarm">Turn Alarm off</button>
  </div>
</template>

<script>
import Sun from './components/icons/Sun'
import Cog from './components/icons/Cog'
import Wind from './components/icons/Wind'
import DeviceCard from './components/DeviceCard'
import * as EVENT_TYPES from '../shared/event-types'
import { socketClient, formatTime } from './utils'

export default {
  components: { Sun, Cog, Wind, DeviceCard },
  data: () => ({
    kettleStatus: 'off',
    currentTime: formatTime(),
    name: 'Erdling',
  }),
  created() {
    socketClient.on(EVENT_TYPES.TURN_KETTLE_ON_SUCCESS, this.handleSuccess)
    socketClient.on(EVENT_TYPES.SYS_STARTED, () => {
      this.currentTime = 'System gestartet'
    })
    socketClient.on(EVENT_TYPES.ALARM_TRIGGERED, () => {
      this.currentTime = 'ALAAAAAARM! EINBRUCH!'
    })
    socketClient.on(EVENT_TYPES.ALARM_DISABLED, () => {
      this.currentTime = 'Okay. Alarm ist wieder aus.'
    })
  },
  methods: {
    turnOn() {
      socketClient.emit(EVENT_TYPES.TURN_KETTLE_ON)
    },
    turnOffAlarm() {
      socketClient.emit(EVENT_TYPES.DISABLE_ALARM)
    },
    handleSuccess() {
      this.kettleStatus = 'on'
    },
  },
}
</script>

<style lang="postcss">
#root {
  display: block;
}
</style>
