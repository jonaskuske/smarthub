<template>
  <div>
    <BaseTile :device="device" :status="isOnline ? 'Online' : 'Offline'">
      <div class="w-3 h-3 rounded-full" :class="isOnline ? 'bg-green-600' : 'bg-red-600'" />
    </BaseTile>
  </div>
</template>

<script>
import BaseTile from './_BaseTile'
import { serverState } from '../../utils'

export default {
  components: { BaseTile },
  props: {
    device: { type: Object, required: true },
  },
  computed: {
    isOnline() {
      return serverState.controller.online
    },
  },
}
</script>
