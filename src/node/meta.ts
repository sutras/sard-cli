import path from 'node:path'
import { CWD } from './utils/constants.js'

export interface MetaData {
  version: string
}

const { default: pkg } = await import(path.resolve(CWD, 'package.json'), {
  with: {
    type: 'json',
  },
})

function getMetaData(): MetaData {
  return {
    version: pkg.version,
  }
}

export const metaData = getMetaData()
