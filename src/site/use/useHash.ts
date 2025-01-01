import { onMounted, onUnmounted } from 'vue'
import { useSetTimeout } from './useSetTimeout'

export default function useHash(
  selector: string,
  callback?: (id: string) => void,
) {
  let nextHash = ''
  const [setHashLater] = useSetTimeout(() => {
    location.hash = nextHash
  })

  const handler = (event: Event) => {
    const element = event.target as HTMLElement

    if (
      element.matches(selector) ||
      (element.nodeName === 'A' &&
        element.getAttribute('href')?.startsWith('#'))
    ) {
      const targetSelector =
        element.getAttribute('href') || element.dataset.href

      if (targetSelector) {
        event.preventDefault()

        const el = document.querySelector(targetSelector)
        if (el) {
          window.scrollBy({
            top: el.getBoundingClientRect().top - 60 - 10,
            behavior: 'smooth',
          })
          callback?.(targetSelector.replace(/^#/, ''))

          nextHash = targetSelector
          setHashLater(300)
        }
      }
    }
  }

  onMounted(() => {
    document.addEventListener('click', handler)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
}
