<template>
  <div class="flex flex-col items-center">
    <h1 class="font-bold text-2xl text-center mb-2">{{ device.name }}</h1>

    <div class="w-10/12 relative">
      <CircleChart :value="device.data.temperature || 0" style="color: #FF7272" />
      <div class="absolute flex justify-between" style="top: 68%; left: 9%; right: 9%">
        <span class="absolute left-0 transform -translate-x-1/2">0°C</span>
        <span class="absolute right-0 transform translate-x-1/2">100°C</span>
      </div>
      <IconButton
        class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full scale-70"
        :disabled="isActive"
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
import { emit } from '../../utils/socket'
import { ACTIONS } from '../../../shared/event-types'

export default {
  components: { CircleChart, IconButton },
  props: {
    device: { type: Object, required: true },
  },
  computed: {
    /** @returns { boolean } */
    isActive() {
      return this.device.data.active
    },
    /** @returns {string} */
    statusMessage() {
      return this.isActive ? 'In Betrieb' : 'Bereit'
    },
  },
  methods: {
    turnOn() {
      emit(ACTIONS.KETTLE_TURN_ON)
    },
  },
}
</script>
