<template>
  <button class="sc-theme" @click="onToggle">
    <i class="sc-theme-icon" :class="icon"></i>
    <!-- <slot></slot>
    <select v-model="selected">
      <option value="light">亮色模式</option>
      <option value="dark">暗色模式</option>
      <option value="auto">跟随系统</option>
    </select> -->
  </button>
</template>

<script lang="ts">
import { inject, computed, defineComponent } from 'vue'
import type { ThemeContext, ThemeType } from '../use/useTheme'

export default defineComponent({
  name: 'SCTheme',
  setup() {
    const { currentTheme, theme } = inject<ThemeContext>('theme')!

    const mapThemeIcon = {
      light: 'hsi hsi-sun-fill',
      dark: 'hsi hsi-moon-stars-fill',
      auto: 'hsi hsi-circle-half',
    }

    const icon = computed(() => {
      return [
        mapThemeIcon[currentTheme.value],
        {
          'is-dark': currentTheme.value === 'dark',
        },
      ]
    })

    const selected = computed({
      get() {
        return theme.value
      },
      set(value: ThemeType) {
        theme.value = value
      },
    })

    const onToggle = () => {
      theme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    }

    return {
      icon,
      selected,
      onToggle,
    }
  },
})
</script>

<style lang="scss" scoped>
.sc-theme {
  position: relative;
  border-radius: 11px;
  display: block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  padding: 0;
  border: 1px solid var(--sc-border-color);
  background-color: var(--sc-tertiary-bg);
  background-image: none;
  cursor: pointer;
  transition:
    border-color 0.25s,
    background-color 0.25s;

  &-icon {
    position: absolute;
    top: 1px;
    left: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    font-size: var(--sc-text-xs);
    color: var(--sc-body-color);
    background-color: var(--sc-body-bg);
    box-shadow: var(--sc-shadow-sm);
    transition:
      background-color 0.25s,
      transform 0.25s;

    &.is-dark {
      transform: translate(18px);
    }
  }
}
</style>
