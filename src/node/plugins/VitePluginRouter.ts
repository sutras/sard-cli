import { Plugin } from 'vite'
import path from 'node:path'
import { VIRTUAL_ROUTER, RESOLVED_VIRTUAL_ROUTER } from '../utils/constants.js'
import { sardConfig } from '../getSardConfig.js'
import {
  BaseRoute,
  generateRoutes,
  getRouterConfig,
} from './router/getRouterConfig.js'

const { build: buildConfig } = sardConfig
const srcDir = path.resolve(process.cwd(), buildConfig.srcDir)

async function loadRouter(baseRoutes: BaseRoute[]) {
  const routesStr = generateRoutes(baseRoutes)

  const code = `import { createRouter, createWebHashHistory } from "vue-router"
import BasicLayout from '@@/components/layout/BasicLayout.vue'
import Trunking from '@@/components/layout/Trunking.vue'

const router = createRouter({
  history: createWebHashHistory('${sardConfig.base}'),
	routes: [
    {
      path: '/',
      component: BasicLayout,
      children: ${routesStr},
      redirect: '${sardConfig.site.homePath}',
    },{
      path: '/:pathMatch(.*)*',
      redirect: '/',
    }
  ]
})

export default router`

  return code
}

export function VitePluginRouter(): Plugin {
  let baseRoutes: BaseRoute[] = []

  return {
    name: 'VitePluginRouter',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_ROUTER) {
        return RESOLVED_VIRTUAL_ROUTER
      }
    },
    async buildStart() {
      baseRoutes = await getRouterConfig()
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_ROUTER) {
        return loadRouter(baseRoutes)
      }
    },
    async configureServer(server) {
      server.watcher.on('all', async (eventName, filePath) => {
        if (
          (eventName === 'add' ||
            eventName === 'unlink' ||
            eventName === 'change') &&
          new RegExp(`^${srcDir}.*\\.md$`).test(filePath)
        ) {
          baseRoutes = await getRouterConfig()
          ;[RESOLVED_VIRTUAL_ROUTER].forEach((item) => {
            const module = server.moduleGraph.getModuleById(item)
            if (module) {
              server.moduleGraph.invalidateModule(module)
              server.ws.send({
                type: 'update',
                updates: [
                  {
                    type: 'js-update',
                    path: filePath,
                    acceptedPath: filePath,
                    timestamp: performance.now(),
                  },
                ],
              })
            }
          })
        }
      })
    },
  }
}
