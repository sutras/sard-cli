<template>
  <div class="sc-layout-main">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SCMain',
})
</script>

<style lang="scss">
.sc-layout-main {
  min-height: 100vh;
}
</style>
