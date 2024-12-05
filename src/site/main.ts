import 'prism-themes/themes/prism-one-dark.css'
// import 'prism-themes/themes/prism-one-light.css'
import './assets/font/hsi.css'
import './index.scss'

// App
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

// # router
import router from 'virtual:router'
app.use(router)

// # nprogress
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
router.beforeEach(() => {
  NProgress.start()
})
router.afterEach((to) => {
  NProgress.done()

  if (to.hash) {
    setTimeout(() => {
      const el = document.querySelector(to.hash)
      if (el) {
        window.scrollBy({
          top: el.getBoundingClientRect().top - 60 - 10,
          behavior: 'instant',
        })
      }
    })
  } else {
    window.scrollTo(0, 0)
  }
})

// # sard-config
import sardConfig from 'virtual:sard-config'
app.provide('sardConfig', sardConfig)

// # mount
app.mount('#root')
