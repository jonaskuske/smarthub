<template>
  <div class="flex flex-col items-center">
    <h1 class="font-bold text-2xl text-center mb-2">{{ device.name }}</h1>

    <div class="w-10/12 relative">
      <CircleChart :value="temp" style="color: #FF7272" />
      <div class="absolute flex justify-between" style="top: 68%; left: 9%; right: 9%">
        <span class="absolute left-0 transform -translate-x-1/2">0°C</span>
        <span class="absolute right-0 transform translate-x-1/2">100°C</span>
      </div>
      <IconButton
        class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full scale-70"
        @click="turnOn"
      >
        <PowerOff class="transform scale-150" />
      </IconButton>
    </div>

    <transition
      mode="out-in"
      enter-active-class="transition-opacity duration-150 ease-in"
      leave-active-class="transition-opacity duration-200 ease-out"
      enter-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <p :key="statusMessage" class="absolute bottom-0 pb-4 text-center lowercase truncate">
        {{ statusMessage }}
      </p>
    </transition>
  </div>
</template>

<script>
import CircleChart from '../../components/CircleChart'
import IconButton from '../../components/IconButton'
import { socketClient, wait } from '../../utils'
import * as EVENTS from '../../../shared/event-types'

const DEFAULT_MESSAGE = 'Bereit'

export default {
  components: { CircleChart, IconButton },
  props: {
    device: { type: Object, required: true },
  },
  data: () => ({ temp: 0, statusMessage: DEFAULT_MESSAGE }),
  created() {
    socketClient.on(EVENTS.TEMPERATUR, this.updateTemp)
    socketClient.on(EVENTS.TURN_KETTLE_ON_SUCCESS, this.handleKettleSuccess)
  },
  beforeDestroy() {
    socketClient.off(EVENTS.TEMPERATUR, this.updateTemp)
    socketClient.off(EVENTS.TURN_KETTLE_ON_SUCCESS, this.handleKettleSuccess)
  },
  methods: {
    turnOn() {
      this.statusMessage = 'Wird eingeschaltet'
      socketClient.emit(EVENTS.TURN_KETTLE_ON)
    },
    updateTemp(data) {
      this.temp = data.temp
    },
    handleKettleSuccess() {
      this.statusMessage = 'Eingeschaltet'
      wait(2500).then(() => (this.statusMessage = DEFAULT_MESSAGE))
    },
  },
}
</script>
