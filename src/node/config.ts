import path from 'node:path'
import deepMerge from './utils/deepMerge.js'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { logFatalError } from './utils/logger.js'
import { build } from 'esbuild'
import { tempDir } from './utils/constants.js'
import type { MergedConfig, UserConfig } from './config-type.js'
import { pathToFileURL } from 'node:url'

export const DEFAULT_CONFIG_FILES = [
  'sard.config.ts',
  'sard.config.js',
  'sard.config.mjs',
  'sard.config.cjs',
  'sard.config.mts',
  'sard.config.cts',
]

export const SARD_CONFIG_FILENAME = 'sard.config.ts'

const defaultConfig: MergedConfig = {
  name: '',
  base: '/',
  publicDir: 'public',
  build: {
    srcDir: 'src/lib',
    outDir: 'dist',
    uniModulesDir: '',
    uniName: '',
  },
  codeAlias: {},
  mobile: false,
  mobileVisible: '\\/components\\/',
  git: [],
  site: {
    outDir: 'docs',
    name: '',
    logo: '',
    seo: {
      title: '',
      description: '',
    },
    tags: [],
    homePath: '/home',
    notFoundPath: '',
    copyright: '',
    nav: [],
  },
}

export function getSardConfigFilePath() {
  let resolvedPath: string | undefined

  for (const filename of DEFAULT_CONFIG_FILES) {
    const filePath = path.resolve(process.cwd(), filename)
    if (!fs.existsSync(filePath)) continue
    resolvedPath = filePath
    break
  }

  return resolvedPath
}

export async function loadConfigFromFile(): Promise<UserConfig> {
  const resolvedPath = getSardConfigFilePath()

  if (!resolvedPath) {
    logFatalError('no config file found.')
    return null as unknown as UserConfig
  }

  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [resolvedPath],
    target: 'esnext',
    write: false,
    platform: 'node',
    bundle: true,
    format: 'esm',
  })

  const { text } = result.outputFiles[0]

  await fsp.mkdir(path.resolve(tempDir), {
    recursive: true,
  })
  const tempFileName = path.resolve(tempDir, 'sard.config.mjs')
  await fsp.writeFile(tempFileName, text)

  return (await import(pathToFileURL(tempFileName).href)).default as UserConfig
}

export async function getSardConfig() {
  const userConfig = await loadConfigFromFile()

  const mergedConfig = deepMerge({}, defaultConfig, userConfig) as MergedConfig

  if (!/\/$/.test(mergedConfig.base)) {
    mergedConfig.base += '/'
  }

  return mergedConfig
}
