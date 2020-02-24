<template>
  <div class="px-6 pt-10 h-full flex flex-col">
    <h1 class="font-bold text-2xl mb-16">Einstellungen</h1>

    <div class="flex justify-between items-baseline border-b mb-8">
      <label for="notifications">
        Geräte-Benachrichtigungen
      </label>
      <input id="notifications" type="checkbox" />
    </div>

    <div class="flex justify-between items-baseline border-b mb-8">
      <label>
        Name
      </label>
      <span @click="changeName">{{ name }}</span>
    </div>

    <footer class="flex justify-center mt-auto p-4">
      <BackButton />
    </footer>
  </div>
</template>

<script>
import BackButton from '../components/BackButton'
import { getName, updateName } from '../utils'

export default {
  components: { BackButton },
  computed: {
    name() {
      return getName()
    },
  },
  methods: {
    changeName() {
      const next = prompt('Name?', this.name)
      if (next) updateName(next)
    },
  },
}
</script>

<style></style>
