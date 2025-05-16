import type MarkdownIt from 'markdown-it'
import { Token } from 'markdown-it/index.js'

function getTokensText(tokens: Token[]) {
  return tokens
    .filter((t) => ['text', 'code_inline'].includes(t.type))
    .map((t) => t.content)
    .join('')
}

let idMap: Record<string, boolean> = {}

export function resetIdMap() {
  idMap = {}
}

function checkExist(id: string) {
  if (idMap[id]) {
    id += '_1'
    return checkExist(id)
  } else {
    idMap[id] = true
    return id
  }
}

function normalId(id: string) {
  return checkExist(id.replace(/[^\w\-\u4e00-\u9fa5]/g, ''))
}

function anchorPlugin(md: MarkdownIt) {
  md.core.ruler.push('anchor', ({ tokens, Token }) => {
    for (let idx = 0; idx < tokens.length; idx++) {
      const token = tokens[idx]

      if (token.type !== 'heading_open') {
        continue
      }

      if (![1, 2, 3, 4].includes(Number(token.tag.slice(1)))) {
        continue
      }

      // id
      const title = getTokensText(tokens[idx + 1].children || [])
      const id = normalId(title)
      token.attrSet('id', id)

      // link
      const linkTokens = [
        Object.assign(new Token('link_open', 'a', 1), {
          attrs: [
            ['class', 'sc-anchor'],
            ['href', `#${id}`],
          ],
        }),
        Object.assign(new Token('html_inline', '', 0), {
          content: '#',
        }),
        new Token('link_close', 'a', -1),
      ]

      tokens[idx + 1].children!.push(...linkTokens)
    }
  })
}

export default anchorPlugin
