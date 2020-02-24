<template>
  <router-link :to="`/devices/${device.name}`" class="cursor-default">
    <BaseTile :device="device" :status="statusMessage">
      <IconButton @click="turnOn"><PowerOff /></IconButton>
    </BaseTile>
  </router-link>
</template>

<script>
import IconButton from '../../components/IconButton'
import BaseTile from './_BaseTile'
import { socketClient, wait } from '../../utils'
import * as EVENTS from '../../../shared/event-types'

const DEFAULT_MESSAGE = 'Bereit'

export default {
  components: { BaseTile, IconButton },
  props: {
    device: { type: Object, required: true },
  },
  data: () => ({ statusMessage: DEFAULT_MESSAGE }),
  created() {
    socketClient.on(EVENTS.TURN_KETTLE_ON_SUCCESS, this.handleSuccess)
  },
  beforeDestroy() {
    socketClient.off(EVENTS.TURN_KETTLE_ON_SUCCESS, this.handleSuccess)
  },
  methods: {
    turnOn() {
      socketClient.emit(EVENTS.TURN_KETTLE_ON)
      this.statusMessage = 'Wird eingeschaltet'
    },
    handleSuccess() {
      this.statusMessage = 'Eingeschaltet'
      wait(2500).then(() => (this.statusMessage = DEFAULT_MESSAGE))
    },
  },
}
</script>
