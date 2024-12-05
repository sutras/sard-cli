import MarkdownIt from 'markdown-it'
import fm from 'front-matter'
import { MD_PATH_R } from '../utils/constants.js'
import { compileAtRule } from './md-at-rules/index.js'
import { Plugin } from 'vite'
import tablePlugin from './md-plugins/tablePlugin.js'
import anchorPlugin, { resetIdMap } from './md-plugins/anchorPlugin.js'
import fencePlugin from './md-plugins/fencePlugin.js'
import { FrontMatter } from '../../common-type.js'

function escape(code: string) {
  const html = code
    // 转义模板字符串
    .replace(/([`\\])/g, '\\$1')

    // 转义大括号
    .replace(/([{}])/g, (m) => {
      return `&#${m.charCodeAt(0)};`
    })

  return html
}

function transform(code: string, id: string, md: MarkdownIt) {
  const fmResult = fm<FrontMatter>(code)

  const fmBody = compileAtRule(id, fmResult.body)
  const fmAttrs = fmResult.attributes

  resetIdMap()
  let html = md.render(fmBody)
  html = escape(html)

  const content = `<script setup lang="ts">
      import Markdown from "@@/components/markdown/index.vue"
      const html = \`${html}\`
      const fm = ${JSON.stringify(fmAttrs)}
    </script>

    <template>
      <Markdown :content="html" :fm="fm" />
    </template>
  `

  return content
}

export function VitePluginMarkdown(): Plugin {
  const md = new MarkdownIt({
    html: true,
    xhtmlOut: true,
  })

  md.use(tablePlugin)
  md.use(anchorPlugin)
  md.use(fencePlugin)

  return {
    name: 'VitePluginMarkdown',
    enforce: 'pre',
    transform(code, id) {
      if (!MD_PATH_R.test(id)) {
        return
      }
      return transform(code, id, md)
    },

    async handleHotUpdate(ctx) {
      if (!MD_PATH_R.test(ctx.file)) {
        return
      }
      const rawRead = ctx.read
      ctx.read = async () => {
        return transform(await rawRead(), ctx.file, md)
      }
    },
  }
}
