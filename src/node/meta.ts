import path from 'node:path'
import { CWD } from './utils/constants.js'
import { pathToFileURL } from 'node:url'

export interface MetaData {
  version: string
}

const { default: pkg } = await import(
  pathToFileURL(path.resolve(CWD, 'package.json')).href,
  {
    with: {
      type: 'json',
    },
  }
)

function getMetaData(): MetaData {
  return {
    version: pkg.version,
  }
}

export const metaData = getMetaData()
