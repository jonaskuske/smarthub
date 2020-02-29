<template>
  <label class="relative inline-block" style="width: 30px; height: 18px;">
    <input
      v-bind="$attrs"
      class="invisible"
      type="checkbox"
      :checked="value"
      @change="handleChange"
    />
    <span
      class="slider round absolute cursor-pointer inset-0 rounded-full duration-300 transition bg-gray-400"
    />
  </label>
</template>

<script>
export default {
  inheritAttrs: false,
  model: { event: 'change' },
  props: { value: Boolean },
  methods: {
    handleChange(evt) {
      this.$emit('change', evt.target.checked)
    },
  },
}
</script>

<style scoped>
.slider:before {
  position: absolute;
  content: '';
  height: 12px;
  width: 12px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: inherit;
  border-radius: 50%;
}
input:disabled + .slider {
  @apply opacity-50;
  @apply cursor-default;
}
input:checked + .slider {
  @apply bg-lightblue;
}
input:checked + .slider:before {
  transform: translateX(100%);
}
</style>
