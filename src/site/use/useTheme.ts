import { ref, provide, Ref, onMounted, onUnmounted, watch } from 'vue'

const themeKey = 'sardTheme'

export type ThemeType = 'dark' | 'light' | 'auto'

export type CurrentThemeType = 'dark' | 'light'

const defaulTheme = (window.localStorage.getItem(themeKey) ||
  'auto') as ThemeType

document.documentElement.dataset.scTheme = defaulTheme

export interface ThemeContext {
  theme: Ref<ThemeType>
  currentTheme: Ref<CurrentThemeType>
}

export default function useTheme() {
  const theme = ref<ThemeType>(defaulTheme)
  const currentTheme = ref<CurrentThemeType>()

  const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

  const handleChange = (event: MediaQueryListEvent) => {
    if (theme.value === 'auto') {
      currentTheme.value = event.matches ? 'dark' : 'light'
    }
  }

  onMounted(() => {
    mediaQueryList.addEventListener('change', handleChange)
  })

  onUnmounted(() => {
    mediaQueryList.removeEventListener('change', handleChange)
  })

  watch(
    theme,
    () => {
      if (theme.value !== 'auto') {
        currentTheme.value = theme.value
      } else {
        currentTheme.value = mediaQueryList.matches ? 'dark' : 'light'
      }
      window.localStorage.setItem(themeKey, theme.value)
    },
    {
      immediate: true,
    },
  )

  watch(
    currentTheme,
    () => {
      document.documentElement.dataset.scTheme = currentTheme.value
    },
    {
      immediate: true,
    },
  )

  provide('theme', {
    theme,
    currentTheme,
  })
}
