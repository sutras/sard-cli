import type MarkdownIt from 'markdown-it'

function tablePlugin(md: MarkdownIt, currentId: { value: string }) {
  md.renderer.rules.table_open = () => {
    const isComponent = currentId.value.includes('/components/')
    return `<div class="sc-table-responsive${isComponent ? ' is-component-table' : ''}"><table>`
  }

  md.renderer.rules.table_close = () => {
    return '</table></div>'
  }
}

export default tablePlugin
