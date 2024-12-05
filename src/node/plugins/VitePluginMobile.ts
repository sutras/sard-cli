import { Plugin } from 'vite'
import { VIRTUAL_MOBILE, RESOLVED_VIRTUAL_MOBILE } from '../utils/constants.js'
import { sard } from '../utils/runtime.js'
import { MOBILE_BUILD_PATH } from '../getSardConfig.js'

function load() {
  let url = sard.url
  if (process.env.NODE_ENV === 'production') {
    url = MOBILE_BUILD_PATH
  }

  return `export default '${url}'`
}

export function VitePluginMobile(): Plugin {
  return {
    name: 'VitePluginMobile',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_MOBILE) {
        return RESOLVED_VIRTUAL_MOBILE
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MOBILE) {
        return load()
      }
    },
  }
}
