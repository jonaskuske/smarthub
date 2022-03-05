<template>
  <div class="flex flex-col items-center">
    <h1 class="mb-2 text-2xl font-bold text-center">{{ device.name }}</h1>

    <div class="relative w-10/12">
      <CircleChart :value="isOnline ? timerPercent : 0" style="color: #ff7272" />
      <div class="absolute flex justify-between" style="top: 68%; left: 9%; right: 9%">
        <span class="absolute left-0 -translate-x-1/2">{{ startTemp.toFixed() }}°C</span>
        <span class="absolute right-0 translate-x-1/2">100°C</span>
      </div>
      <IconButton
        class="absolute top-0 left-1/2 -translate-x-1/2 !w-full !h-full scale-70"
        :disabled="isActive || !isOnline"
        @click="turnOn"
      >
        <PowerOff class="transform scale-150" />
      </IconButton>
    </div>

    <Fade>
      <p :key="statusMessage" class="absolute bottom-0 pb-4 text-center lowercase truncate">
        {{ statusMessage }}
      </p>
    </Fade>
  </div>
</template>

<script>
import CircleChart from '../../components/CircleChart'
import Fade from '../../components/Fade'
import IconButton from '../../components/IconButton'
import { emitToController, serverState } from '../../utils'
import { CONTROLLER_ACTIONS } from '../../../shared/event-types.mjs'

const startTemp = serverState.room.temperature || 20

export default {
  components: { CircleChart, Fade, IconButton },
  props: {
    device: { type: Object, required: true },
  },
  data: () => ({ timerPercent: 0, timerIntervalId: null, startTemp }),
  computed: {
    /** @returns { boolean } */
    isActive() {
      return this.device.data.active
    },
    /** @returns { boolean } */
    isOnline() {
      return serverState.controller.online
    },
    /** @returns { string } */
    statusMessage() {
      if (!this.isOnline) return 'Nicht erreichbar'
      return this.isActive ? 'In Betrieb' : 'Bereit'
    },
  },
  watch: {
    isActive(next, prev) {
      if (next && !prev) this.startTimer()
    },
    timerPercent(val) {
      if (val >= 100) {
        clearInterval(this.timerIntervalId)
        setTimeout(() => (this.timerPercent = 0), 5000)
      }
    },
  },
  methods: {
    turnOn() {
      emitToController(CONTROLLER_ACTIONS.KETTLE_TURN_ON)
    },
    startTimer() {
      this.timerIntervalId = setInterval(() => this.timerPercent++, 105000 / 100)
    },
  },
}
</script>
