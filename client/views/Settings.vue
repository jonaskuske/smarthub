<template>
  <main class="container pt-10 h-full flex flex-col">
    <h1 class="font-bold text-2xl mb-16">Einstellungen</h1>

    <div class="flex justify-between items-baseline border-b pb-3 mb-4">
      <label for="notifs" :class="{ 'opacity-50': settingDisabled }">
        Geräte-Benachrichtigungen
        <span class="truncate">
          <template v-if="notSupported">(auf diesem Gerät nicht unterstützt)</template>
          <template v-else-if="notAllowed">(in Browser-Einstellungen blockiert)</template>
        </span>
      </label>
      <div class="flex-shrink-0 self-center">
        <ToggleButton
          id="notifs"
          v-model="toggleState"
          :disabled="forceDisable || settingDisabled"
          @change="handleNotificationChange"
        />
      </div>
    </div>

    <div class="flex justify-between items-baseline border-b pb-3 mb-4">
      <label for="name">
        Name ändern
      </label>
      <input v-model="name" class="text-right text-lightgray font-bold focus:outline-none" />
    </div>

    <footer class="flex justify-center mt-auto p-4 flex-shrink-0">
      <PrimaryButton as="router-link" to="/">
        Zurück zur Geräteliste
      </PrimaryButton>
    </footer>

    <PermissionModal
      v-if="showPermissionModal"
      @close="closePermissionModal"
      @granted="handlePermissionGranted"
    />
  </main>
</template>

<script>
import PrimaryButton from '../components/PrimaryButton'
import ToggleButton from '../components/ToggleButton'
import PermissionModal from '../components/PermissionModal'
import {
  persistedState,
  notificationState,
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from '../utils'

export default {
  components: { PrimaryButton, ToggleButton, PermissionModal },
  data: () => ({
    showPermissionModal: false,
    notSupported: !notificationState.supported,
    forceDisable: false,
  }),
  computed: {
    /** @returns {boolean} */
    settingDisabled() {
      return !notificationState.supported || this.notAllowed
    },
    /** @returns {boolean} */
    notAllowed() {
      return notificationState.permission === 'denied'
    },
    /** @type {() => string} */
    name: {
      get() {
        return persistedState.name
      },
      set(val) {
        persistedState.name = val
      },
    },
    /** @type {() => boolean} */
    toggleState: {
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
    closePermissionModal() {
      this.showPermissionModal = false
    },
    openPermissionModal() {
      this.showPermissionModal = true
    },
    async handleNotificationChange(enabled) {
      if (notificationState.permission !== 'granted') {
        // Open modal to ask for notification permissions
        this.openPermissionModal()
        return
      }

      if (enabled) this.enableNotifications()
      else this.disableNotifications()
    },
    async handlePermissionGranted() {
      this.closePermissionModal()
      this.enableNotifications()
    },
    async enableNotifications() {
      this.forceDisable = true
      await subscribeToNotifications()
      this.forceDisable = false
    },
    async disableNotifications() {
      this.forceDisable = true
      await unsubscribeFromNotifications()
      this.forceDisable = false
    },
  },
}
</script>
