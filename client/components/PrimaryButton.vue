<template>
  <component
    :is="as"
    v-bind="$attrs"
    class="text-lightblue border-lightblue border-2 px-4 py-2 rounded-lg font-bold"
    v-on="$listeners"
  >
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    as: { type: [String, Object], default: 'button' },
  },
}
</script>
