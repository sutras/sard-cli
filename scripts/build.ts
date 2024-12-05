import child_process from 'node:child_process'
import { copyFiles, destDir } from './utils'
import { rimraf } from 'rimraf'

async function build() {
  await rimraf(destDir)
  await copyFiles()
  child_process.spawn(`npx`, ['tsc'], {
    stdio: 'inherit',
  })
}

build()
