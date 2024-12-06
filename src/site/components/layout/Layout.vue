<template>
  <div
    :class="[
      'doc-layout',
      {
        'doc-layout-with-sider': row,
      },
    ]"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    row: Boolean,
  },
})
</script>

<style lang="scss" scoped>
.doc-layout {
  display: flex;
  flex-direction: column;

  &-with-sider {
    flex-direction: row;
  }
}
</style>
