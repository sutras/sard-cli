<template>
  <div class="sc-layout-header">
    <div
      v-if="withSidebar"
      class="sc-sideslip-toggle sc-sidebar-toggle"
      @click="emit('sidebar-toggle')"
    >
      <i class="hsi hsi-list"></i>
    </div>
    <router-link class="sc-brand" to="/">
      <h1>
        <img :src="logo" alt="" />
        <span>{{ name }}</span>
      </h1>
    </router-link>
    <div
      class="sc-sideslip-toggle sc-topnav-toggle"
      @click="topbarVisible = true"
    >
      <i class="hsi hsi-three-dots"></i>
    </div>
    <SCSideslip title="导航" side="right" v-model:visible="topbarVisible">
      <SCTopnav @link-click="topbarVisible = false"></SCTopnav>
    </SCSideslip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { MergedConfig } from '../../node/config-type'

export default defineComponent({
  name: 'SCHeader',
  emits: ['sidebar-toggle'],
  setup(_, { emit }) {
    const {
      site: { name, logo },
      base,
    } = inject<MergedConfig>('sardConfig')!

    const route = useRoute()

    const withSidebar = computed(() => {
      return route.matched[1]?.children?.length > 0
    })

    const topbarVisible = ref(false)

    return {
      name,
      logo: base + logo,
      withSidebar,
      topbarVisible,
      emit,
    }
  },
})
</script>

<style lang="scss" scoped>
.sc-layout-header {
  position: sticky;
  top: 0;
  z-index: 120;
  box-sizing: border-box;
  display: flex;
  height: var(--sc-navbar-height);
  padding: 0 24px;
  border-bottom: 1px solid var(--sc-border-color);
  background-color: var(--sc-emphasis-bg);

  @media (max-width: 768px) {
    padding: 0 16px;
  }
}

.sc-brand {
  display: flex;
  align-items: center;
  color: var(--sc-emphasis-color);
  text-decoration: none;

  h1 {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }

  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  span {
    font-size: var(--sc-text-base);
    font-weight: 600;
  }
}

.sc-sideslip-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  font-size: var(--sc-text-lg);
  cursor: pointer;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }

  @media (min-width: 769px) {
    display: none;
  }
}

.sc-sidebar-toggle {
  margin-right: auto;
}

.sc-topnav-toggle {
  margin-left: auto;
}
</style>
