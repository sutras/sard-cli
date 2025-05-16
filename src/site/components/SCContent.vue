<template>
  <div class="sc-layout-content">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SCContent',
  props: {
    row: Boolean,
  },
})
</script>

<style lang="scss">
.sc-layout-content {
  flex: auto;
  width: 0;
}
</style>
