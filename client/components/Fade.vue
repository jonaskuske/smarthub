<template>
  <transition
    mode="out-in"
    enter-active-class="transition-opacity duration-150 ease-in"
    leave-active-class="transition-opacity duration-200 ease-out"
    enter-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <slot />
  </transition>
</template>

<script>
export default {}
</script>
