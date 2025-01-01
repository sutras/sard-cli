import { type Plugin } from 'vite'
import {
  VIRTUAL_SARD_CONFIG,
  RESOLVED_VIRTUAL_SARD_CONFIG,
} from '../utils/constants.js'
import { sardConfig } from '../getSardConfig.js'

export function VitePluginSardConfig(): Plugin {
  return {
    name: 'VitePluginSardConfig',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_SARD_CONFIG) {
        return RESOLVED_VIRTUAL_SARD_CONFIG
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_SARD_CONFIG) {
        return `export default ${JSON.stringify(sardConfig)}`
      }
    },
  }
}
