<template>
  <div class="sc-theme">
    <i :class="icon"></i>
    <slot></slot>
    <select v-model="selected">
      <option value="light">亮色模式</option>
      <option value="dark">暗色模式</option>
      <option value="auto">跟随系统</option>
    </select>
  </div>
</template>

<script lang="ts">
import { inject, computed, defineComponent } from 'vue'
import type { ThemeContext, ThemeType } from '../use/useTheme'

export default defineComponent({
  name: 'SCTheme',
  setup() {
    const context = inject<ThemeContext>('theme')

    const mapThemeIcon = {
      light: 'hsi hsi-sun-fill',
      dark: 'hsi hsi-moon-stars-fill',
      auto: 'hsi hsi-circle-half',
    }

    const icon = computed(() => {
      return mapThemeIcon[context?.theme.value || 'auto']
    })

    const selected = computed({
      get() {
        return context?.theme.value
      },
      set(value: ThemeType) {
        if (context) {
          context.theme.value = value
        }
      },
    })

    return {
      icon,
      selected,
    }
  },
})
</script>

<style lang="scss" scoped>
.sc-theme {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  color: var(--sc-secondary-color);
  cursor: pointer;

  select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
