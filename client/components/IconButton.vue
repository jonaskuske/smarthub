<template>
  <button
    class="w-12 h-12 text-xl rounded-full shadow-md flex items-center justify-center focus:outline-none disabled:opacity-50 disabled:grayscale disabled:cursor-default"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script>
export default {}
</script>
