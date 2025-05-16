import type MarkdownIt from 'markdown-it'

function tablePlugin(md: MarkdownIt) {
  md.renderer.rules.table_open = () => {
    return '<div class="sc-table-responsive"><table>'
  }

  md.renderer.rules.table_close = () => {
    return '</table></div>'
  }
}

export default tablePlugin
