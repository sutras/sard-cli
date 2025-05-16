<template>
  <div v-if="visible" class="sc-mobile">
    <iframe
      :src="url"
      ref="iframeRef"
      class="sc-mobile-iframe"
      frameborder="0"
    ></iframe>
    <div class="sc-mobile-toolbar">
      <div class="sc-mobile-open" @click="openWindown">在新窗口打开⤴</div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, inject, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useBuildChannel, channel } from '../utils/channel'
import baseUrl from 'virtual:mobile'
import type { ThemeContext } from '../use/useTheme'
import type { MergedConfig } from '../../node/config-type'

export default defineComponent({
  name: 'SCMobile',
  setup() {
    const context = inject<ThemeContext>('theme')!

    const { mobileVisible } = inject<MergedConfig>('sardConfig')!

    const url = ref(baseUrl)

    function getComponentPathName(path: string) {
      return path.replace(/^.*\//, '')
    }

    const route = useRoute()

    const visible = computed(() => {
      return route.matched.some((route) =>
        new RegExp(mobileVisible).test(route.path),
      )
    })

    const iframeRef = ref<HTMLIFrameElement>()

    useBuildChannel(iframeRef)

    const emitRoute = () => {
      channel.emit('route', route.path.replace(/^.*\//, ''))
    }

    channel.on('loaded', () => {
      emitRoute()
      channel.emit('theme', context.theme.value)
    })

    watch(
      () => route.path,
      () => {
        emitRoute()
      },
    )

    const openWindown = () => {
      window.open(
        `${baseUrl.replace(/\/$/, '')}/#/pages/components/${getComponentPathName(
          route.path,
        )}/index`,
      )
    }

    return {
      url,
      visible,
      openWindown,
      iframeRef,
    }
  },
})
</script>

<style lang="scss">
.sc-mobile {
  position: sticky;
  top: calc(var(--sc-navbar-height) + 16px);
  width: var(--sc-mobile-width);
  height: calc(var(--sc-mobile-height) + 32px);
  margin-right: 24px;
  border: 1px solid var(--sc-border-color);
  border-radius: var(--sc-rounded-xl);
  overflow: hidden;

  &-iframe {
    display: block;
    width: var(--sc-mobile-width);
    height: var(--sc-mobile-height);
    border: none;
  }

  &-toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 32px;
    padding: 0 16px;
    border-top: 1px solid var(--sc-border-color);
    background-color: var(--sc-emphasis-bg);
  }

  &-open {
    margin-left: auto;
    font-size: var(--sc-text-sm);
    cursor: pointer;
  }

  @media (max-width: 1200px) {
    display: none;
  }
}
</style>
