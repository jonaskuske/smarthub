<template>
  <div class="relative overflow-hidden rounded-lg shadow-lg aspect-ratio-1/1">
    <div class="absolute flex flex-col items-start w-full h-full p-4">
      <div class="flex items-start justify-between w-full">
        <div class="w-1/2">
          <div class="relative aspect-ratio-1/1">
            <div class="absolute w-full h-full">
              <img class="object-contain object-center w-full h-full" :src="device.image" />
            </div>
          </div>
        </div>

        <div @click.stop>
          <slot />
        </div>
      </div>

      <footer class="w-full mt-auto mb-2">
        <h4 class="font-bold">{{ device.name }}</h4>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <Fade><p :key="status" class="text-sm lowercase truncate" v-html="status" /></Fade>
      </footer>
    </div>
  </div>
</template>

<script>
import Fade from '../../components/Fade'

export default {
  components: { Fade },
  props: {
    device: { type: Object, required: true },
    status: { type: String, default: '&nbsp;' },
  },
}
</script>
