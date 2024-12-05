import { relative, resolve } from 'node:path'
import createVuePlugin from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import { VitePluginIndexHtml } from '../plugins/VitePluginIndexHtml.js'
import { VitePluginSardConfig } from '../plugins/VitePluginSardConfig.js'
import { VitePluginRouter } from '../plugins/VitePluginRouter.js'
import { VitePluginMarkdown } from '../plugins/VitePluginMarkdown.js'
import { VitePluginMobile } from '../plugins/VitePluginMobile.js'
import {
  VitePluginRestart,
  VitePluginRestartOptions,
} from '../plugins/VitePluginRestart.js'
import {
  CWD,
  SERVER_DEV_PORT,
  SERVER_PREVIEW_PORT,
  SITE_DIR,
} from './constants.js'
import { deepMerge } from './deepMerge.js'
import { SARD_CONFIG_FILENAME } from '../config.js'
import { sardConfig } from '../getSardConfig.js'

export function mergeViteConfig(options: VitePluginRestartOptions) {
  return deepMerge({
    configFile: false,
    plugins: [
      VitePluginIndexHtml(),
      VitePluginSardConfig(),
      VitePluginRouter(),
      VitePluginMarkdown(),
      VitePluginMobile(),
      createVuePlugin({
        include: [/.vue$/, /.md$/],
      }),
      VitePluginRestart({
        restart: [resolve(CWD, SARD_CONFIG_FILENAME)],
        onRestart() {
          options.onRestart?.()
        },
      }),
    ],
    root: SITE_DIR,
    base: sardConfig.base,
    publicDir: resolve(CWD, sardConfig.publicDir),
    server: {
      port: SERVER_DEV_PORT,
      host: true,
    },
    build: {
      outDir: relative(SITE_DIR, resolve(CWD, sardConfig.site.outDir)),
      emptyOutDir: true,
    },
    preview: {
      port: SERVER_PREVIEW_PORT,
    },
    resolve: {
      alias: {
        '@@': SITE_DIR,
      },
    },
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
  })
}

export default mergeViteConfig
