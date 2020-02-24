<template>
  <div class="relative aspect-ratio-1/1 shadow-lg overflow-hidden rounded-lg">
    <div class="absolute w-full h-full flex flex-col items-start p-4">
      <div class="flex justify-between items-start w-full">
        <div class="w-1/2">
          <div class="relative aspect-ratio-1/1">
            <div class="absolute w-full h-full">
              <img class="w-full h-full object-contain object-center" :src="device.image" />
            </div>
          </div>
        </div>
        <div @click.stop>
          <slot />
        </div>
      </div>

      <footer class="mt-auto mb-2 w-full">
        <h4 class="font-bold">{{ device.name }}</h4>
        <transition
          mode="out-in"
          enter-active-class="transition-opacity duration-150 ease-in"
          leave-active-class="transition-opacity duration-200 ease-out"
          enter-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p :key="status" class="text-sm lowercase truncate" v-html="status" />
        </transition>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    device: { type: Object, required: true },
    status: { type: String, default: '&nbsp;' },
  },
}
</script>
