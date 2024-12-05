import child_process from 'child_process'
import { MOBILE_BUILD_PATH } from '../getSardConfig.js'

export function devMobile() {
  return child_process.exec(`npx uni --base ${MOBILE_BUILD_PATH}`)
}
