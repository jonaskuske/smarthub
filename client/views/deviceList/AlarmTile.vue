<template>
  <router-link :to="`/devices/${device.name}`" class="cursor-default">
    <BaseTile :device="device" :status="isEnabled ? 'Aktiviert' : 'Deaktiviert'">
      <ToggleButton :checked="isEnabled" @change="handleChange" />
    </BaseTile>
  </router-link>
</template>

<script>
import BaseTile from './_BaseTile'
import ToggleButton from '../../components/ToggleButton.vue'
import { emit } from '../../utils/socket'
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
  },
  methods: {
    handleChange({ target }) {
      if (target.checked) emit(ACTIONS.ALARM_ENABLE)
      else emit(ACTIONS.ALARM_DISABLE)
    },
  },
}
</script>
