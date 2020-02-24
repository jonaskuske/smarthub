<template>
  <label class="relative inline-block" style="width: 30px; height: 18px;">
    <input class="invisible" type="checkbox" v-bind="$attrs" v-on="$listeners" />
    <span
      class="slider round absolute cursor-pointer inset-0 rounded-full duration-300 transition bg-gray-400"
    />
  </label>
</template>

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

input:checked + .slider {
  @apply bg-lightblue;
}
input:checked + .slider:before {
  transform: translateX(100%);
}
</style>
