import MarkdownIt from 'markdown-it'
import fm from 'front-matter'
import { MD_PATH_R } from '../utils/constants.js'
import { compileAtRule } from './md-at-rules/index.js'
import { type Plugin } from 'vite'
import tablePlugin from './md-plugins/tablePlugin.js'
import anchorPlugin, { resetIdMap } from './md-plugins/anchorPlugin.js'
import fencePlugin from './md-plugins/fencePlugin.js'
import { FrontMatter } from '../../common-type.js'

function extractScript(code: string) {
  const scripts: string[] = []
  const template = code.replace(
    /(?<!```html\n)^<script[\s\S]+?^<\/script>(?!\n```)/gm,
    (m) => {
      scripts.push(m)
      return ''
    },
  )
  return {
    template,
    scripts,
  }
}

function transform(code: string, id: string, md: MarkdownIt) {
  const { scripts, template } = extractScript(code)
  const fmResult = fm<FrontMatter>(template)

  const fmBody = compileAtRule(id, fmResult.body)
  const fmAttrs = fmResult.attributes

  resetIdMap()
  const html = md.render(fmBody)

  const tpl = fmAttrs.disableMarkdownLayout
    ? html
    : `<SCMarkdown>${html}</SCMarkdown>`

  const content = `<template>
  <SCFrontMatterProvider front-matter="${encodeURIComponent(JSON.stringify(fmAttrs))}">${tpl}</SCFrontMatterProvider>
  </template>\n${scripts.join('\n')}`

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
