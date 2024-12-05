import type MarkdownIt from 'markdown-it'
import { hlCallback } from '../../utils/highlight.js'

function fencePlugin(md: MarkdownIt) {
  md.set({
    highlight: hlCallback,
  })

  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const code = fence(...args)
    return `<div class="doc-code-wrapper">${code}</div>`
  }
}

export default fencePlugin
