import { type Plugin } from 'vite'
import path from 'node:path'
import { VIRTUAL_ROUTER, RESOLVED_VIRTUAL_ROUTER } from '../utils/constants.js'
import { sardConfig } from '../getSardConfig.js'
import {
  BaseRoute,
  generateRoutes,
  getRouterConfig,
} from './router/getRouterConfig.js'
import chokidar from 'chokidar'

const { build: buildConfig, site } = sardConfig
const srcDir = path.resolve(process.cwd(), buildConfig.srcDir)

async function loadRouter(baseRoutes: BaseRoute[]) {
  const routesStr = generateRoutes(baseRoutes)

  const code = `import { createRouter, createWebHistory } from "vue-router"
import BasicLayout from '@@/components/BasicLayout.vue'

const router = createRouter({
  history: createWebHistory('${sardConfig.base}'),
	routes: [
    {
      path: '/',
      component: BasicLayout,
      children: ${routesStr},
      redirect: ${site.homePath !== '/' ? `'${site.homePath}'` : 'undefined'},
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: ${site.notFoundPath ? `'${site.notFoundPath}'` : 'undefined'},
    },
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
      const events = ['add', 'change', 'unlink']

      chokidar.watch(srcDir).on('all', (event, path) => {
        if (/\.md$/.test(path) && events.includes(event)) {
          handle()
        }
      })

      async function handle() {
        baseRoutes = await getRouterConfig()
        ;[RESOLVED_VIRTUAL_ROUTER].forEach((item) => {
          const module = server.moduleGraph.getModuleById(item)
          if (module) {
            server.moduleGraph.invalidateModule(module)
            server.ws.send({
              type: 'full-reload',
            })
          }
        })
      }
    },
  }
}
