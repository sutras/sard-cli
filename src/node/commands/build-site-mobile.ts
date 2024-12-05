import child_process from 'child_process'
import { sardConfig, MOBILE_BUILD_PATH } from '../getSardConfig.js'

export function buildSiteMobile() {
  return child_process.exec(
    `npx uni build --outDir ${sardConfig.site.outDir}/mobile --base ${MOBILE_BUILD_PATH}`,
  )
}
