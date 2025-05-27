import child_process from 'node:child_process'
import { copyFiles, destDir, srcDir } from './utils'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

async function dev() {
  await copyFiles()
  fs.watch(
    srcDir,
    {
      recursive: true,
    },
    (_, filename) => {
      if (filename) {
        if (path.extname(filename) !== '.ts') {
          fsp.cp(
            path.resolve(srcDir, filename),
            path.resolve(destDir, filename),
            {
              recursive: true,
            },
          )
        }
      }
    },
  )

  child_process.spawn('npx', ['tsc', '--watch'], {
    stdio: 'inherit',
    shell: true,
  })
}

dev()
