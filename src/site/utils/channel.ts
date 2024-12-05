import { type Ref, onMounted, onUnmounted, watch, inject } from 'vue'
import { createEvent } from '../../node/utils/event'
import type { ThemeContext } from '../use/useTheme'

const event = createEvent()

function createChannel() {
  return {
    on(type: string, handler: (data: any) => void) {
      event.on(type, handler)
    },
    off(type: string, handler?: (data: any) => void) {
      event.off(type, handler)
    },
    emit(type: string, data: any) {
      sendMessage({
        type,
        data,
      })
    },
  }
}

export const channel = createChannel()

let mWindow: Window

export function sendMessage(message: { type: string; data?: any }) {
  if (mWindow) {
    mWindow.postMessage(message, '*')
  }
}

export function useBuildChannel(iframe: Ref<HTMLIFrameElement | undefined>) {
  const handler = ({
    data: { type, data },
  }: MessageEvent<{
    type: string
    data: any
  }>) => {
    event.emit(type, data)
  }

  const context = inject<ThemeContext>('theme')!

  watch(
    context.theme,
    () => {
      if (context.theme.value) {
        channel.emit('theme', context.theme.value)
      }
    },
    {
      immediate: true,
    },
  )

  watch(
    iframe,
    () => {
      if (iframe.value) {
        mWindow = iframe.value.contentWindow!
      }
    },
    {
      immediate: true,
    },
  )

  onMounted(() => {
    window.addEventListener('message', handler)
  })

  onUnmounted(() => {
    window.removeEventListener('message', handler)
  })
}
