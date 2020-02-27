<template>
  <router-link tag="div" :to="`/devices/${device.name}`">
    <BaseTile :device="device" :status="statusMessage">
      <ToggleButton :checked="isEnabled" :disabled="!isOnline" @change="handleChange" />
    </BaseTile>
  </router-link>
</template>

<script>
import BaseTile from './_BaseTile'
import ToggleButton from '../../components/ToggleButton.vue'
import { emit, serverState } from '../../utils'
import { ACTIONS } from '../../../shared/event-types'

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
    handleChange({ target }) {
      if (target.checked) emit(ACTIONS.ALARM_ENABLE)
      else emit(ACTIONS.ALARM_DISABLE)
    },
  },
}
</script>
