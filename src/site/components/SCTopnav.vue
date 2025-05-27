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
    <template v-for="item in nav" :key="item.text">
      <li class="sc-topnav-item">
        <a
          v-if="'link' in item"
          class="sc-topnav-link"
          target="_blank"
          rel="noreferrer"
          :href="`${mainRepository.url}/blob/main/CHANGELOG.md`"
        >
          {{ item.text }}
        </a>
        <SCDropdown v-else :options="item.items">
          <template #default="{ toggle, open }">
            <span class="sc-topnav-link" :class="{ open }" @click="toggle">
              {{ item.text }}
              <span class="sc-topnav-arrow hsi hsi-chevron-down"></span>
            </span>
          </template>
        </SCDropdown>
      </li>
    </template>
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
      <div class="sc-topnav-theme">
        <span class="sc-topnav-theme-text">主题</span>
        <SCTheme />
      </div>
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

    const {
      git,
      site: { nav },
    } = inject<MergedConfig>('sardConfig')!

    const secondLevelRoutes = router.options.routes[0].children

    const getActiveClass = (path: string) => {
      return path === '/' ? (route.path === '/' ? 'active' : '') : 'active'
    }

    const mainRepository = git.find((item) => item.main) || git[0]

    return {
      emit,
      git,
      nav,
      secondLevelRoutes,
      getActiveClass,
      mainRepository,
    }
  },
})
</script>

<style lang="scss">
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
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;

    &:hover {
      .sc-dropdown {
        visibility: visible;
        opacity: 1;
      }
    }
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
    cursor: pointer;
    &:hover {
      color: var(--sc-emphasis-color);
      text-decoration: none;
    }
    &.active {
      font-weight: bold;
      color: var(--sc-emphasis-color);
    }
  }

  &-arrow {
    font-size: var(--sc-text-xs);
    margin-left: 4px;
    vertical-align: middle;
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

  &-theme-text {
    font-size: var(--sc-text-sm);
    display: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 16px 24px;

    &-item {
      flex-direction: column;
      &:not(:last-child) {
        border-bottom: 1px solid var(--sc-border-color);
      }
    }

    &-link {
      box-sizing: border-box;
      width: 100%;
      justify-content: space-between;
      padding: 12px 0;
      font-size: var(--sc-text-base);
      &:active {
        opacity: 0.6;
      }

      &.open {
        padding-bottom: 6px;
        .sc-topnav-arrow {
          transform: rotateX(180deg);
        }
      }
    }

    &-divide {
      display: none;
    }

    &-icon-text {
      display: flex;
      font-size: var(--sc-text-sm);
    }

    &-theme {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-top: 12px;
      border-radius: var(--sc-rounded);
      padding: 12px 14px 12px 16px;
      background-color: var(--sc-secondary-bg);
    }
    &-theme-text {
      display: block;
    }
  }
}
</style>
