<template>
  <div class="doc-layout-header">
    <div
      v-if="withSidebar"
      class="doc-sideslip-toggle doc-sidebar-toggle"
      @click="emit('sidebar-toggle')"
    >
      <i class="hsi hsi-list"></i>
    </div>
    <router-link class="doc-brand" to="/">
      <h1>
        <img :src="logo" alt="" />
        <span>{{ name }}</span>
      </h1>
    </router-link>
    <div
      class="doc-sideslip-toggle doc-topnav-toggle"
      @click="topbarVisible = true"
    >
      <i class="hsi hsi-three-dots"></i>
    </div>
    <DocSideslip title="导航" side="right" v-model:visible="topbarVisible">
      <DocTopnav @link-click="topbarVisible = false"></DocTopnav>
    </DocSideslip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import DocSideslip from './Sideslip.vue'
import DocTopnav from './Topnav.vue'
import type { MergedConfig } from '../../../node/config-type'

export default defineComponent({
  components: {
    DocSideslip,
    DocTopnav,
  },
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
.doc-layout-header {
  position: sticky;
  top: 0;
  z-index: 120;
  box-sizing: border-box;
  display: flex;
  height: var(--doc-navbar-height);
  padding: 0 24px;
  border-bottom: 1px solid var(--doc-border-color);
  background-color: var(--doc-emphasis-bg);

  @media (max-width: 768px) {
    padding: 0 16px;
  }
}

.doc-brand {
  display: flex;
  align-items: center;
  color: var(--doc-emphasis-color);
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
    font-size: var(--doc-text-base);
    font-weight: 600;
  }
}

.doc-sideslip-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  font-size: var(--doc-text-lg);
  cursor: pointer;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }

  @media (min-width: 769px) {
    display: none;
  }
}

.doc-sidebar-toggle {
  margin-right: auto;
}

.doc-topnav-toggle {
  margin-left: auto;
}
</style>
