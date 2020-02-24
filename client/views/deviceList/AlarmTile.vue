<template>
  <router-link :to="`/devices/${device.name}`" class="cursor-default">
    <BaseTile :device="device">
      <ToggleButton />
    </BaseTile>
  </router-link>
</template>

<script>
import BaseTile from './_BaseTile'
import ToggleButton from '../../components/ToggleButton.vue'

export default {
  components: { BaseTile, ToggleButton },
  props: {
    device: { type: Object, required: true },
  },
}
</script>
