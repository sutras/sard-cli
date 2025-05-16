<template>
  <div class="sc-loading">加载中...</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import NProgress from 'es-nprogress'
import 'es-nprogress/nprogress.css'

export default defineComponent({
  name: 'SCLoading',
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
.sc-loading {
  margin: 100px auto 0;
  text-align: center;
}
</style>
