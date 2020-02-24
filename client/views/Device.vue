<template>
  <div class="h-full flex flex-col">
    <Header />
    <main class="px-6 pt-6">
      <nav aria-label="breadcrumb" class="text-lightgray mb-5">
        <ol>
          <li class="inline font-light">
            <router-link to="/devices" class="hocus:underline">Geräte</router-link>
            &gt;
          </li>
          <li aria-current="page" class="inline font-bold">{{ deviceName }}</li>
        </ol>
      </nav>

      <div class="relative aspect-ratio-1/1 shadow-lg overflow-hidden rounded-lg mb-8">
        <div class="absolute w-full h-full p-5 flex flex-col items-center">
          <h1 class="font-bold text-2xl text-center mb-2">{{ deviceName }}</h1>

          <div class="w-10/12 relative">
            <CircleChart :value="50" style="color: #FF7272" />
            <IconButton
              class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full scale-75"
            >
              <PowerOff class="transform scale-150" />
            </IconButton>
          </div>

          <p class="absolute bottom-0 pb-3 text-center">Wassertemperatur: 46°C</p>
        </div>
      </div>
    </main>

    <footer class="flex justify-center mt-auto p-4">
      <BackButton />
    </footer>
  </div>
</template>

<script>
import BackButton from '../components/BackButton'
import CircleChart from '../components/CircleChart'
import IconButton from '../components/IconButton'
import Header from '../components/Header'

export default {
  components: { BackButton, Header, CircleChart, IconButton },
  props: {
    deviceName: { type: String, required: true },
  },
}
</script>
