<template>
  <div class="px-6 pt-10 h-full flex flex-col">
    <h1 class="font-bold text-2xl mb-16">Einstellungen</h1>

    <div class="flex justify-between items-baseline border-b mb-8">
      <label for="notifications">
        Geräte-Benachrichtigungen
      </label>
      <ToggleButton id="notifications" />
    </div>

    <div class="flex justify-between items-baseline border-b mb-8">
      <label for="name">
        Name
      </label>
      <input v-model="name" class="text-right focus:outline-none" type="text" />
    </div>

    <footer class="flex justify-center mt-auto p-4">
      <BackButton />
    </footer>
  </div>
</template>

<script>
import BackButton from '../components/BackButton'
import ToggleButton from '../components/ToggleButton'
import { getName, updateName } from '../utils'

export default {
  components: { BackButton, ToggleButton },
  computed: {
    name: {
      get() {
        return getName()
      },
      set(nextName) {
        updateName(nextName)
      },
    },
  },
}
</script>

<style></style>
