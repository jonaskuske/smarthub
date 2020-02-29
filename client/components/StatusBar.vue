<template>
  <div class="font-bold flex text-xl">
    <Fade>
      <slot>
        <div class="flex">
          <div class="mr-8">
            <Home class="inline align-top" />
            <Fade>
              <span :key="temperature" class="nums">{{ temperature || '--' }}°C</span>
            </Fade>
          </div>
          <div>
            <Wind class="inline align-top" />
            <Fade>
              <span :key="humidity" class="nums">{{ humidity || '--' }}%</span>
            </Fade>
          </div>
        </div>
      </slot>
    </Fade>
  </div>
</template>

<script>
import Fade from './Fade'
import { serverState } from '../utils'

export default {
  components: { Fade },
  computed: {
    serverState() {
      return serverState
    },
    /** @returns {number} */
    temperature() {
      return this.serverState.room.temperature
    },
    /** @returns {number} */
    humidity() {
      return this.serverState.room.humidity
    },
  },
}
</script>

<style scoped>
.nums {
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
}
</style>
