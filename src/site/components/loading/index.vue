<template>
  <div class="doc-loading">加载中...</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import NProgress from 'es-nprogress'
import 'es-nprogress/nprogress.css'

export default defineComponent({
  setup() {
    onMounted(() => {
      NProgress.start()
    })

    onUnmounted(() => {
      NProgress.done()
    })
  },
})
</script>

<style lang="scss">
@use './index.scss';
</style>
