<template>
  <router-link v-slot="{ navigate }" :to="`/devices/${device.name}`">
    <div @click="navigate">
      <BaseTile :device="device" :status="statusMessage">
        <ToggleButton :value="isEnabled" :disabled="!isOnline" @change="handleChange" />
      </BaseTile>
    </div>
  </router-link>
</template>

<script>
import BaseTile from './_BaseTile'
import ToggleButton from '../../components/ToggleButton.vue'
import { emitToController, serverState } from '../../utils'
import { CONTROLLER_ACTIONS } from '../../../shared/event-types.mjs'

export default {
  components: { BaseTile, ToggleButton },
  props: {
    device: { type: Object, required: true },
  },
  computed: {
    /** @returns { boolean } */
    isEnabled() {
      const state = this.device.data.state
      return ['enabled', 'ringing'].includes(state)
    },
    /** @returns { boolean } */
    isOnline() {
      return serverState.controller.online
    },
    /** @returns {string} */
    statusMessage() {
      if (!this.isOnline) return 'Nicht erreichbar'
      return this.isEnabled ? 'Aktiviert' : 'Deaktiviert'
    },
  },
  methods: {
    handleChange(enabled) {
      if (enabled) emitToController(CONTROLLER_ACTIONS.ALARM_ENABLE)
      else emitToController(CONTROLLER_ACTIONS.ALARM_DISABLE)
    },
  },
}
</script>
