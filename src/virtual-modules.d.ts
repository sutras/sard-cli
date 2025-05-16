declare module 'virtual:router' {
  import { type Router } from 'vue-router'
  const router: Router
  export default router
}

declare module 'virtual:sard-config' {
  import { type MergedConfig } from './node/config.js'
  const config: MergedConfig
  export default config
}

declare module 'virtual:meta' {
  import { type MetaData } from './node/meta.js'
  const metaData: MetaData
  export default metaData
}

declare module 'virtual:mobile' {
  const url: string
  export default url
}

declare module 'virtual:theme' {
  import { type Theme } from './node/config-type.js'
  const theme: Theme
  export default theme
}
