import { type Plugin } from 'vite'
import { RESOLVED_VIRTUAL_THEME, VIRTUAL_THEME } from '../utils/constants.js'
import { existsSync } from 'node:fs'
import { sardConfig } from '../getSardConfig.js'
import path from 'node:path'

export function VitePluginTheme(): Plugin {
  const themeFile = path.resolve(
    sardConfig.build.srcDir,
    '.sard/theme/index.ts',
  )

  const existsThemeFile = existsSync(themeFile)

  return {
    name: 'VitePluginTheme',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_THEME) {
        if (existsThemeFile) {
          return themeFile
        }
        return RESOLVED_VIRTUAL_THEME
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_THEME) {
        return `export default {}`
      }
    },
  }
}
