<template>
  <nav aria-label="breadcrumb" class="text-lightgray mb-5">
    <ol>
      <template v-for="({ text, to }, index) in items">
        <li v-if="index !== items.length - 1" :key="to || text" class="inline font-light">
          <router-link :to="to" class="hocus:underline">
            {{ text }}
          </router-link>
          &gt;
        </li>

        <li v-else :key="to || text" aria-current="page" class="inline font-bold">
          {{ text }}
        </li>
      </template>
    </ol>
  </nav>
</template>

<script>
export default {
  props: {
    items: { type: Array, required: true },
  },
}
</script>
