<template>
  <div>
    <Header />

    <main class="px-6 pt-6">
      <h2 class="text-lightgray font-bold mb-5">Geräte</h2>
      <div class="grid gap-6 device-grid">
        <DeviceCard name="Wasserkocher" :status="kettleStatus" :image="kettleImage">
          <IconButton slot="action" @click="turnOn"><PowerOff /></IconButton>
        </DeviceCard>
        <DeviceCard name="Alarmanlage" status="Nicht eingerichtet" :image="alarmImage">
          <input slot="action" checked type="checkbox" />
        </DeviceCard>
        <DeviceCard name="ESP-12F (8266)" status="Online" :image="esp8266Image">
          <div slot="action" class="w-2 h-2 rounded-full bg-green-600"></div>
        </DeviceCard>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '../components/Header'
import DeviceCard from '../components/DeviceCard'
import IconButton from '../components/IconButton'
import { formatTime, socketClient } from '../utils'
import * as EVENT_TYPES from '../../shared/event-types'

import kettleImage from '../assets/images/kettle.png'
import alarmImage from '../assets/images/alarm.png'
import esp8266Image from '../assets/images/esp8266.png'

export default {
  components: { Header, IconButton, DeviceCard },
  data: () => ({
    currentTime: formatTime(),
    kettleStatus: 'Bereit',
    kettleImage,
    alarmImage,
    esp8266Image,
  }),
  created() {
    socketClient.on(EVENT_TYPES.TURN_KETTLE_ON_SUCCESS, this.handleSuccess)
  },
  methods: {
    turnOn() {
      this.kettleStatus = 'Wird eingeschaltet...'
      socketClient.emit(EVENT_TYPES.TURN_KETTLE_ON)
    },
    handleSuccess() {
      this.kettleStatus = 'Eingeschaltet.'
      setTimeout(() => {
        this.kettleStatus = 'Bereit'
      }, 2500)
    },
  },
}
</script>

<style scoped>
.device-grid {
  grid-template: auto / repeat(auto-fill, minmax(128px, 1fr));
}
@screen md {
  .device-grid {
    grid-template: auto / repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
