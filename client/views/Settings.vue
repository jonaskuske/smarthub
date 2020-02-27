<template>
  <main class="px-6 pt-10 h-full flex flex-col">
    <h1 class="font-bold text-2xl mb-16">Einstellungen</h1>

    <div class="flex justify-between items-baseline border-b mb-8">
      <label for="notifications">
        Geräte-Benachrichtigungen
      </label>
      <ToggleButton id="notifications" :checked="false" @change="handleNotificationChange" />
    </div>

    <div class="flex justify-between items-baseline border-b mb-8">
      <label for="name">
        Name
      </label>
      <input v-model="persistedState.name" class="text-right focus:outline-none" type="text" />
    </div>

    <footer class="flex justify-center mt-auto p-4 flex-shrink-0">
      <PrimaryButton as="router-link" to="/">
        Zurück zur Geräteliste
      </PrimaryButton>
    </footer>
    <NotificationModal v-if="showModal" @close="showModal = false" />
  </main>
</template>

<script>
import PrimaryButton from '../components/PrimaryButton'
import ToggleButton from '../components/ToggleButton'
import NotificationModal from '../components/NotificationModal'
import { persistedState } from '../utils'

export default {
  components: { PrimaryButton, ToggleButton, NotificationModal },
  data: () => ({ showModal: false }),
  computed: {
    /** @returns {Object} */
    persistedState() {
      return persistedState
    },
  },
  methods: {
    handleNotificationChange({ target }) {
      if (target.checked) this.showModal = true
    },
  },
}
</script>

<style></style>
