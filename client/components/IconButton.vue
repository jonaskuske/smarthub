<template>
  <button
    class="flex items-center justify-center w-12 h-12 text-xl rounded-full shadow-md focus:outline-none disabled:opacity-50 disabled:grayscale disabled:cursor-default"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script>
export default {}
</script>
