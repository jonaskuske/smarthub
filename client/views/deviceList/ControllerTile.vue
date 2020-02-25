<template>
  <BaseTile :device="device" :status="isOnline ? 'Online' : 'Offline'">
    <div class="w-3 h-3 rounded-full" :class="isOnline ? 'bg-green-600' : 'bg-red-600'" />
  </BaseTile>
</template>

<script>
import BaseTile from './_BaseTile'
import { state } from '../../utils/socket'

export default {
  components: { BaseTile },
  props: {
    device: { type: Object, required: true },
  },
  computed: {
    isOnline() {
      return state.controller.online
    },
  },
}
</script>
