<template>
  <ul class="doc-topnav">
    <template v-for="route in secondLevelRoutes" :key="route.path">
      <li v-if="!route.meta!.hidden" class="doc-topnav-item">
        <router-link
          class="doc-topnav-link"
          :active-class="getActiveClass(route.path)"
          :to="route.path"
          @click="emit('link-click')"
        >
          {{ route.meta!.title }}
        </router-link>
      </li>
    </template>
    <li class="doc-topnav-divide"></li>
    <template v-for="item in git" :key="item.name">
      <li v-if="item.url" class="doc-topnav-item">
        <a
          class="doc-topnav-link"
          target="_blank"
          rel="noreferrer"
          :href="item.url"
        >
          <i class="hsi doc-topnav-icon" :class="`hsi-${item.icon}`"></i>
          <span class="doc-topnav-icon-text">{{ item.name }}</span>
        </a>
      </li>
    </template>
    <li class="doc-topnav-divide"></li>
    <li class="doc-topnav-item">
      <DocTheme class="doc-topnav-theme">
        <span class="doc-topnav-icon-text">切换主题</span>
      </DocTheme>
    </li>
  </ul>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router'
import DocTheme from './Theme.vue'
import { defineComponent, inject } from 'vue'
import type { MergedConfig } from '../../../node/config-type'

export default defineComponent({
  components: {
    DocTheme,
  },
  emits: ['link-click'],
  setup(_, { emit }) {
    const route = useRoute()
    const router = useRouter()

    const { git } = inject<MergedConfig>('sardConfig')!

    const secondLevelRoutes = router.options.routes[0].children

    const getActiveClass = (path: string) => {
      return path === '/' ? (route.path === '/' ? 'active' : '') : 'active'
    }

    return {
      emit,
      git,
      secondLevelRoutes,
      getActiveClass,
    }
  },
})
</script>

<style lang="scss" scoped>
.doc-topnav {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0;
  margin-left: auto;
  padding: 0;
  height: 100%;
  list-style: none;

  &-item {
    display: flex;
    height: 100%;
  }

  &-link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin: 0;
    padding: 0 10px;
    font-size: var(--doc-text-sm);
    color: inherit;
    text-decoration: none;
    &:hover {
      color: var(--doc-emphasis-color);
      text-decoration: none;
    }
    &.active {
      font-weight: bold;
      color: var(--doc-emphasis-color);
    }
  }

  &-divide {
    width: 1px;
    height: 40%;
    background: var(--doc-border-color);
    margin: 0 10px;
  }

  &-icon {
    font-size: var(--doc-text-base);
  }

  &-icon-text {
    display: none;
    margin-left: 10px;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    align-items: stretch;
    padding: 16px 24px;

    &-item {
      width: 50%;
    }

    &-link {
      width: 100%;
      justify-content: flex-start;
      padding: 8px 0;
      font-size: var(--doc-text-base);
    }

    &-divide {
      width: 100%;
      height: 1px;
      margin: 16px 0;
    }

    &-icon-text {
      display: flex;
    }

    .doc-topnav-theme {
      justify-content: flex-start;
      width: 100%;
      padding: 0;
    }
  }
}
</style>
