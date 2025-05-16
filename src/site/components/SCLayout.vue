<template>
  <div
    :class="[
      'sc-layout',
      {
        'sc-layout-with-sider': row,
      },
    ]"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SCLayout',
  props: {
    row: Boolean,
  },
})
</script>

<style lang="scss" scoped>
.sc-layout {
  display: flex;
  flex-direction: column;
  background-color: var(--sc-emphasis-bg);

  &-with-sider {
    flex-direction: row;
  }
}
</style>
