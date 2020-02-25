<template>
  <router-link tag="div" :to="`/devices/${device.name}`" class="cursor-default">
    <BaseTile :device="device" :status="isActive ? 'In Betrieb' : 'Bereit'">
      <IconButton :disabled="isActive" @click="turnOn">
        <span class="sr-only">Einschalten</span>
        <PowerOff class="pointer-events-none" />
      </IconButton>
    </BaseTile>
  </router-link>
</template>

<script>
import IconButton from '../../components/IconButton'
import BaseTile from './_BaseTile'
import { emit } from '../../utils/socket'
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
  },
  methods: {
    turnOn() {
      emit(ACTIONS.KETTLE_TURN_ON)
    },
  },
}
</script>
