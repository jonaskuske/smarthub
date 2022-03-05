<template>
  <div class="flex flex-col items-center">
    <h1 class="font-bold text-2xl text-center mb-10">{{ device.name }}</h1>

    <div class="flex justify-between w-full border-b pb-4 mb-4">
      <label for="alarm_enabled">Einbruchschutz</label>
      <ToggleButton
        id="alarm_enabled"
        :disabled="!isOnline"
        :value="isEnabled"
        @change="handleStateChange"
      />
    </div>

    <div class="flex justify-between w-full border-b pb-4 mb-4" @click="focusSettingsIfNecessary">
      <label for="alarm_notifications_enabled" :class="{ 'opacity-50': notificationsNotAvailable }">
        Benachrichtigungen
        <span class="text-xs truncate">
          <template v-if="notificationsNotSupported">
            (auf diesem Gerät nicht unterstützt)
          </template>
          <template v-else-if="notificationsNotYetAllowed">
            (erst in App-Einstellungen erlauben)
          </template>
          <template v-else-if="notificationsNotAllowed">
            (in Browser-Einstellungen blockiert)
          </template>
        </span>
      </label>
      <div class="shrink">
        <ToggleButton
          id="alarm_notifications_enabled"
          v-model="notificationToggleState"
          :disabled="forceDisableNotification || notificationsNotAvailable"
          @change="handleNotificationStatusChange"
        />
      </div>
    </div>

    <div class="flex justify-between w-full border-b pb-4 mb-4">
      <label for="silent_mode">Stiller Alarm</label>
      <ToggleButton
        id="silent_mode"
        :disabled="!isOnline"
        :value="device.data.silentMode"
        @change="handleSilentModeChange"
      />
    </div>

    <div class="flex justify-between w-full border-b pb-4 mb-4">
      <button class="focus:outline-none" @click="toggleCode">Passwort zeigen</button>
      <span class="lowercase" :class="{ 'blur select-none': !showCode }" @click="toggleCode">
        <template v-if="!isOnline">Nicht verfügbar</template>
        <template v-else>Taste 1 </template>
      </span>
    </div>
  </div>
</template>

<script>
import ToggleButton from '../../components/ToggleButton'
import {
  emitToController,
  serverState,
  notificationState,
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from '../../utils'
import { CONTROLLER_ACTIONS } from '../../../shared/event-types.mjs'

export default {
  components: { ToggleButton },
  props: {
    device: { type: Object, required: true },
  },
  data: () => ({ forceDisableNotification: false, showCode: false }),
  computed: {
    /** @returns { boolean } */
    isEnabled() {
      return ['enabled', 'ringing'].includes(this.device.data.state)
    },
    /** @returns { boolean } */
    isOnline() {
      return serverState.controller.online
    },
    notificationsNotSupported() {
      return !notificationState.supported
    },
    notificationsNotYetAllowed() {
      return notificationState.permission === 'default'
    },
    notificationsNotAllowed() {
      return notificationState.permission !== 'granted'
    },
    /** @returns { boolean } */
    notificationsNotAvailable() {
      return !notificationState.supported || this.notificationsNotAllowed
    },
    notificationToggleState: {
      get() {
        return notificationState.enabled
      },
      set() {
        // Ignore changes from toggle, only way to change is via notificationState.enabled
        const current = notificationState.enabled
        notificationState.enabled = !current
        this.$nextTick(() => (notificationState.enabled = current))
      },
    },
  },
  methods: {
    handleSilentModeChange(enabled) {
      if (enabled) emitToController(CONTROLLER_ACTIONS.ALARM_ENABLE_SILENT_MODE)
      else emitToController(CONTROLLER_ACTIONS.ALARM_DISABLE_SILENT_MODE)
    },
    handleStateChange(enabled) {
      if (enabled) emitToController(CONTROLLER_ACTIONS.ALARM_ENABLE)
      else emitToController(CONTROLLER_ACTIONS.ALARM_DISABLE)
    },
    toggleCode() {
      if (!this.isOnline) return
      this.showCode = !this.showCode
    },
    handleNotificationStatusChange(enabled) {
      if (enabled) this.enableNotifications()
      else this.disableNotifications()
    },
    async enableNotifications() {
      this.forceDisableNotification = true
      await subscribeToNotifications()
      this.forceDisableNotification = false
    },
    async disableNotifications() {
      this.forceDisableNotification = true
      await unsubscribeFromNotifications()
      this.forceDisableNotification = false
    },
    focusSettingsIfNecessary() {
      if (this.notificationsNotYetAllowed) {
        const el = document.querySelector('#app_settings')
        if (el) el.focus()
      }
    },
  },
}
</script>

<style scoped>
@media (max-width: 325px) {
  h1 {
    @apply mb-5;
  }
}
.blur {
  filter: blur(3px);
}
</style>
