<template>
  <div class="flex flex-col items-center">
    <h1 class="font-bold text-2xl text-center mb-10">{{ device.name }}</h1>

    <div class="flex justify-between w-full border-b pb-4 mb-4">
      <label for="alarm_enabled">Einbruchschutz</label>
      <ToggleButton
        id="alarm_enabled"
        :disabled="!isOnline"
        :checked="isEnabled"
        @change="handleStateChange"
      />
    </div>

    <div class="flex justify-between w-full border-b pb-4 mb-4">
      <label for="alarm_notifications_enabled">Benachrichtigungen</label>
      <ToggleButton
        id="alarm_notifications_enabled"
        :checked="notificationsEnabled"
        @change="handleNotificationStatusChange"
      />
    </div>

    <div class="flex justify-between w-full border-b pb-4 mb-4">
      <label for="silent_mode">Stiller Alarm</label>
      <ToggleButton
        id="silent_mode"
        :disabled="!isOnline"
        :checked="device.data.silentMode"
        @change="handleSilentModeChange"
      />
    </div>

    <div class="flex justify-between w-full border-b pb-4 mb-4">
      <label for="show_password">Passwort zeigen</label>
      <button id="show_password" class="focus:outline-none" @click="showCode = !showCode">
        <span v-if="!isOnline" class="lowercase">Nicht verfügbar</span>
        <span v-else :class="{ blur: !showCode }">
          Taste 1
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import ToggleButton from '../../components/ToggleButton'
import { emit, serverState } from '../../utils'
import { ACTIONS } from '../../../shared/event-types'

export default {
  components: { ToggleButton },
  props: {
    device: { type: Object, required: true },
  },
  data: () => ({ notificationsEnabled: true, showCode: false }),
  computed: {
    /** @returns { boolean } */
    isEnabled() {
      return ['enabled', 'ringing'].includes(this.device.data.state)
    },
    /** @returns { boolean } */
    isOnline() {
      return serverState.controller.online
    },
  },
  methods: {
    handleSilentModeChange({ target }) {
      if (target.checked) emit(ACTIONS.ALARM_ENABLE_SILENT_MODE)
      else emit(ACTIONS.ALARM_DISABLE_SILENT_MODE)
    },
    handleStateChange({ target }) {
      if (target.checked) emit(ACTIONS.ALARM_ENABLE)
      else emit(ACTIONS.ALARM_DISABLE)
    },
    handleNotificationStatusChange() {},
  },
}
</script>

<style scoped>
.blur {
  filter: blur(4px);
}
</style>
