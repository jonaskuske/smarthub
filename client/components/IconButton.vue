<template>
  <button
    class="w-12 h-12 text-xl rounded-full shadow-md flex items-start justify-center focus:outline-none"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>
