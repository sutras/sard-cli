import 'prism-themes/themes/prism-one-dark.css'
// import 'prism-themes/themes/prism-one-light.css'
import './assets/font/hsi.css'
import './index.scss'

// App
import { createApp } from 'vue'
import App from './App.vue'

// # router
import router from 'virtual:router'

// # nprogress
import 'es-nprogress/nprogress.css'
import NProgress from 'es-nprogress'

// # sard-config
import sardConfig from 'virtual:sard-config'

// # meta
import meta from 'virtual:meta'
import { registerGlobalComponent } from './components'

// # theme
import themeConfig from 'virtual:theme'

async function bootstrap() {
  const app = createApp(App)

  app.use(router)

  router.beforeEach((to, from) => {
    if (to.path !== from.path) {
      NProgress.start()
    }
  })
  router.afterEach((to, from) => {
    if (to.path !== from.path) {
      NProgress.done()
    }
    if (!to.hash) {
      window.scrollTo(0, 0)
    }
  })

  app.provide('sardConfig', sardConfig)

  app.provide('meta', meta)

  // # global components
  registerGlobalComponent(app)

  await themeConfig.enhanceApp?.({ app })

  // # mount
  app.mount('#root')
}

bootstrap()
