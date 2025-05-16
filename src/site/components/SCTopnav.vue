<template>
  <ul class="sc-topnav">
    <template v-for="route in secondLevelRoutes" :key="route.path">
      <li v-if="!route.meta!.hidden" class="sc-topnav-item">
        <router-link
          class="sc-topnav-link"
          :active-class="getActiveClass(route.path)"
          :to="route.path"
          @click="emit('link-click')"
        >
          {{ route.meta!.title }}
        </router-link>
      </li>
    </template>
    <li class="sc-topnav-divide"></li>
    <li class="sc-topnav-item">
      <a
        class="sc-topnav-link"
        target="_blank"
        rel="noreferrer"
        :href="`${mainRepository.url}/blob/main/CHANGELOG.md`"
      >
        更新日志
      </a>
    </li>
    <li class="sc-topnav-divide"></li>
    <template v-for="item in git" :key="item.name">
      <li v-if="item.url" class="sc-topnav-item">
        <a
          class="sc-topnav-link"
          target="_blank"
          rel="noreferrer"
          :href="item.url"
        >
          <i class="hsi sc-topnav-icon" :class="`hsi-${item.icon}`"></i>
          <span class="sc-topnav-icon-text">{{ item.name }}</span>
        </a>
      </li>
    </template>
    <li class="sc-topnav-divide"></li>
    <li class="sc-topnav-item">
      <SCTheme class="sc-topnav-theme">
        <span class="sc-topnav-icon-text">切换主题</span>
      </SCTheme>
    </li>
  </ul>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { defineComponent, inject } from 'vue'
import type { MergedConfig } from '../../node/config-type'

export default defineComponent({
  name: 'SCTopnav',
  emits: ['link-click'],
  setup(_, { emit }) {
    const route = useRoute()
    const router = useRouter()

    const { git } = inject<MergedConfig>('sardConfig')!

    const secondLevelRoutes = router.options.routes[0].children

    const getActiveClass = (path: string) => {
      return path === '/' ? (route.path === '/' ? 'active' : '') : 'active'
    }

    const mainRepository = git.find((item) => item.main) || git[0]

    return {
      emit,
      git,
      secondLevelRoutes,
      getActiveClass,
      mainRepository,
    }
  },
})
</script>

<style lang="scss" scoped>
.sc-topnav {
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
    font-size: var(--sc-text-sm);
    color: inherit;
    text-decoration: none;
    &:hover {
      color: var(--sc-emphasis-color);
      text-decoration: none;
    }
    &.active {
      font-weight: bold;
      color: var(--sc-emphasis-color);
    }
  }

  &-divide {
    width: 1px;
    height: 40%;
    background: var(--sc-border-color);
    margin: 0 10px;
  }

  &-icon {
    font-size: var(--sc-text-base);
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
      font-size: var(--sc-text-base);
    }

    &-divide {
      width: 100%;
      height: 1px;
      margin: 16px 0;
    }

    &-icon-text {
      display: flex;
    }

    .sc-topnav-theme {
      justify-content: flex-start;
      width: 100%;
      padding: 0;
    }
  }
}
</style>
