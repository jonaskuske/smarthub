<template>
  <router-link v-slot="{ navigate }" :to="`/devices/${device.name}`">
    <div @click="navigate">
      <BaseTile :device="device" :status="statusMessage">
        <IconButton :disabled="isActive || !isOnline" @click="turnOn">
          <span class="sr-only">Einschalten</span>
          <PowerOff />
        </IconButton>
      </BaseTile>
    </div>
  </router-link>
</template>

<script>
import IconButton from '../../components/IconButton'
import BaseTile from './_BaseTile'
import { emitToController, serverState } from '../../utils'
import { CONTROLLER_ACTIONS } from '../../../shared/event-types.mjs'

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
      emitToController(CONTROLLER_ACTIONS.KETTLE_TURN_ON)
    },
  },
}
</script>
