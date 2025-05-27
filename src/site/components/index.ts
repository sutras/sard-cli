import { type App } from 'vue'
import SCAlert from './SCAlert.vue'
import SCBackdrop from './SCBackdrop.vue'
import SCCatalog from './SCCatalog.vue'
import SCContent from './SCContent.vue'
import SCDropdown from './SCDropdown.vue'
import SCFooter from './SCFooter.vue'
import SCFrontMatterProvider from './SCFrontMatterProvider.vue'
import SCHeader from './SCHeader.vue'
import SCLayout from './SCLayout.vue'
import SCLoading from './SCLoading.vue'
import SCMain from './SCMain.vue'
import SCMarkdown from './SCMarkdown.vue'
import SCMobile from './SCMobile.vue'
import SCSider from './SCSider.vue'
import SCSideslip from './SCSideslip.vue'
import SCTheme from './SCTheme.vue'
import SCTopnav from './SCTopnav.vue'
import SCTrunking from './SCTrunking.vue'

const components = [
  SCAlert,
  SCBackdrop,
  SCCatalog,
  SCContent,
  SCDropdown,
  SCFooter,
  SCFrontMatterProvider,
  SCHeader,
  SCLayout,
  SCLoading,
  SCMain,
  SCMarkdown,
  SCMobile,
  SCSider,
  SCSideslip,
  SCTheme,
  SCTopnav,
  SCTrunking,
]

export function registerGlobalComponent(app: App) {
  components.forEach((component) => {
    app.component(component.name!, component)
  })
}
