import { onMounted, onUnmounted } from 'vue'

export function useResize(callback?: () => void) {
  const handler = () => {
    callback?.()
  }

  onMounted(() => {
    window.addEventListener('resize', handler)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handler)
  })
}
