<template>
  <router-link tag="div" :to="`/devices/${device.name}`">
    <BaseTile :device="device" :status="statusMessage">
      <IconButton :disabled="isActive || !isOnline" @click="turnOn">
        <span class="sr-only">Einschalten</span>
        <PowerOff />
      </IconButton>
    </BaseTile>
  </router-link>
</template>

<script>
import IconButton from '../../components/IconButton'
import BaseTile from './_BaseTile'
import { emit, serverState } from '../../utils'
import { ACTIONS } from '../../../shared/event-types'

export default {
  components: { BaseTile, IconButton },
  props: {
    device: { type: Object, required: true },
  },
  computed: {
    /** @returns { boolean } */
    isActive() {
      return this.device.data.active
    },
    /** @returns { boolean } */
    isOnline() {
      return serverState.controller.online
    },
    /** @returns {string} */
    statusMessage() {
      if (!this.isOnline) return 'Nicht erreichbar'
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
