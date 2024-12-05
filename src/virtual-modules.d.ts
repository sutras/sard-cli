declare module 'virtual:router' {
  import { type Router } from 'vue-router'
  const router: Router
  export default router
}

declare module 'virtual:sard-config' {
  import { MergedConfig } from './node/config.js'
  const config: MergedConfig
  export default config
}

declare module 'virtual:mobile' {
  const url: string
  export default url
}
