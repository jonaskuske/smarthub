<template>
  <div @click="showNotification">
    <BaseTile :device="device" :status="isOnline ? 'Online' : 'Offline'">
      <div class="w-3 h-3 rounded-full" :class="isOnline ? 'bg-green-600' : 'bg-red-600'" />
    </BaseTile>
  </div>
</template>

<script>
import BaseTile from './_BaseTile'
import { state } from '../../utils/socket'
import appIcon from '../../assets/icons/android-chrome-512x512.png'
import doorImage from '../../assets/images/door-image.png'

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
  methods: {
    showNotification() {
      navigator.serviceWorker.getRegistration().then(reg => {
        reg.showNotification('Jemand betritt deine Wohnung!', {
          icon: appIcon,
          body: `Die Alarmanlage deines Smart Hubs wurde ausgelöst. Warst du das?`,
          image: doorImage,
          actions: [
            { title: 'Öffnen', action: 'open' },
            { title: 'Abschalten', action: 'turn_off' },
          ],
        })
      })
    },
  },
}
</script>
