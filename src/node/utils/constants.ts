import path from 'node:path'
import { fileURLToPath } from 'node:url'

// dir
export const ROOT_DIR = path.resolve(
  fileURLToPath(path.dirname(import.meta.url)),
  '../../../',
)

export const CWD = process.cwd()
export const tempDir = path.resolve(process.cwd(), 'node_modules/.sard-temp/')

// site
export const SITE_DIR = path.resolve(
  fileURLToPath(path.dirname(import.meta.url)),
  '../../site',
)

export const SERVER_DEV_PORT = 7761
export const SERVER_PREVIEW_PORT = 7760

export const DEFAULT_README_NAME = 'README.md'

export const MD_PATH_R = /\.md$/

// virtual module
export const VIRTUAL_ROUTER = 'virtual:router'
export const RESOLVED_VIRTUAL_ROUTER = '\0' + VIRTUAL_ROUTER

export const VIRTUAL_SARD_CONFIG = 'virtual:sard-config'
export const RESOLVED_VIRTUAL_SARD_CONFIG = '\0' + VIRTUAL_SARD_CONFIG

export const VIRTUAL_MOBILE = 'virtual:mobile'
export const RESOLVED_VIRTUAL_MOBILE = '\0' + VIRTUAL_MOBILE
