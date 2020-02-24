<template>
  <svg viewBox="0 0 36 36" style="transform: rotate(-108deg)" class="origin-center" fill="none">
    <path
      class="transition-all duration-500 ease-in-out stroke-current text-gray-300"
      stroke-dasharray="60, 100"
      stroke-linecap="round"
      stroke-width="2"
      d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
    />
    <path
      class="transition-all duration-500 ease-in-out stroke-current"
      :class="{ invisible: !value }"
      :stroke-dasharray="`${value * (60 / 100)}, 100`"
      stroke-linecap="round"
      stroke-width="2"
      d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
    />
  </svg>
</template>

<script>
export default {
  props: {
    value: { type: Number, required: true },
  },
}
</script>
