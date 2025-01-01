import { throttle } from 'lodash-es'
import { onMounted, onUnmounted, Ref, ref, watch } from 'vue'

export function useScrollSpy(dom: Ref<string[]>) {
  const index = ref(0)

  const leadings = ref<Element[]>([])
  const offset = 60 + 20

  function scrollHandler() {
    const leadingsTop = leadings.value.map((leading) => {
      return leading.getBoundingClientRect().top
    })
    if (leadingsTop[0] >= offset) {
      index.value = 0
      return
    }
    if (leadingsTop[leadingsTop.length - 1] < offset) {
      index.value = leadingsTop.length - 1
      return
    }
    leadingsTop.some((top, i) => {
      const nextTop = leadingsTop[i + 1]
      if (top <= offset && nextTop > offset) {
        index.value = i
        return true
      }
    })
  }
  const throttleScrollHandler = throttle(scrollHandler, 150)

  watch(
    dom,
    () => {
      const mainEl = document.querySelector('.doc-layout-main')
      if (mainEl) {
        leadings.value = [...mainEl.querySelectorAll('h2, h3, h4')]
      }
    },
    {
      flush: 'post',
      immediate: true,
    },
  )

  onMounted(() => {
    window.addEventListener('scroll', throttleScrollHandler)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', throttleScrollHandler)
  })

  return index
}
