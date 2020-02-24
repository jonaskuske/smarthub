<template>
  <div class="bg-white shadow-lg p-8 rounded-b-xl">
    <div class="relative">
      <router-link
        to="/settings"
        class="absolute top-0 right-0 text-lightgray transform transition-transform duration-300 ease-in-out hover:rotate-90 focus:text-lightblue"
      >
        <span class="sr-only">Einstellungen</span>
        <Cog aria-hidden="true" />
      </router-link>

      <p class="mb-3">
        <time>{{ currentTime }}</time>
      </p>
      <p class="text-3xl mb-10">
        Willkommen <span class="font-bold">{{ name }}!</span>
      </p>

      <div class="font-bold flex text-xl">
        <div class="mr-8">
          <Sun class="inline" />
          26°C
        </div>
        <div>
          <Wind class="inline" />
          64.2%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime, getName } from '../utils'

export default {
  data: () => ({ currentTime: formatTime() }),
  computed: {
    name() {
      return getName()
    },
  },
}
</script>
