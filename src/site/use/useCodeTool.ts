/**
 * 生成示例代码的操作工具
 * ==========================
 */

import { onMounted } from 'vue'
import Clipboard from 'clipboard'

function generateTool(wrapper: Element) {
  const codeEl = wrapper.querySelector('code')
  if (!codeEl) {
    return
  }
  const button = document.createElement('button') as HTMLButtonElement & {
    timer: number
  }
  button.classList.add('sc-copy')
  wrapper.insertBefore(button, wrapper.firstChild)

  const clipboard = new Clipboard(button, {
    text: () => codeEl.textContent || '',
  })

  clipboard.on('success', () => {
    button.classList.add('sc-copied')
    clearTimeout(button.timer)
    button.timer = window.setTimeout(() => {
      button.classList.remove('sc-copied')
    }, 1000)
  })
}

function destroyTool(wrapper: Element) {
  const button = wrapper.querySelector('.sc-copy')
  if (button) {
    button.remove()
  }
}

export function useCodeTool() {
  onMounted(() => {
    const allWrapper = Array.from(document.querySelectorAll('.sc-code-wrapper'))

    allWrapper.forEach((wrapper) => generateTool(wrapper))

    return () => {
      allWrapper.forEach((wrapper) => destroyTool(wrapper))
    }
  })
}

export default useCodeTool
