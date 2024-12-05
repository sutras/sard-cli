import { glob } from 'glob'
import fsp from 'node:fs/promises'
import path from 'node:path'

export const srcDir = path.resolve(process.cwd(), 'src')
export const destDir = path.resolve(process.cwd(), 'dist')

export async function copyFiles() {
  const files = await glob(
    path.resolve(srcDir, '**/*.{html,css,woff2,scss,vue}'),
  )

  for (const file of files) {
    const dest = path.resolve(destDir, file.slice(srcDir.length + 1))
    await fsp.cp(file, dest, {
      recursive: true,
    })
  }
}
