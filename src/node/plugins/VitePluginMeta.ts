import { type Plugin } from 'vite'
import { VIRTUAL_META, RESOLVED_VIRTUAL_META } from '../utils/constants.js'
import { metaData } from '../meta.js'

export function VitePluginMeta(): Plugin {
  return {
    name: 'VitePluginMeta',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_META) {
        return RESOLVED_VIRTUAL_META
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_META) {
        return `export default ${JSON.stringify(metaData)}`
      }
    },
  }
}
