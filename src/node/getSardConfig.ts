import { getSardConfig } from './config.js'

// sard config
export const sardConfig = await getSardConfig()

// mobile
export const MOBILE_BUILD_PATH = `${sardConfig.base}mobile/`
