import child_process from 'node:child_process'
import { copyFiles } from './utils'

async function dev() {
  await copyFiles()
  child_process.spawn('npx', ['tsc', '--watch'], {
    stdio: 'inherit',
    shell: true,
  })
}

dev()
