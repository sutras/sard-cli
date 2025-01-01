import fs from 'node:fs'
import path from 'node:path'
import { type Plugin } from 'vite'

export function VitePluginGithubPages404(): Plugin {
  return {
    name: 'VitePluginGithubPages404',
    async writeBundle({ dir }) {
      if (dir) {
        const indexFile = path.resolve(dir, 'index.html')
        const notFoundFile = path.resolve(path.dirname(indexFile), '404.html')

        if (fs.existsSync(indexFile)) {
          fs.copyFileSync(indexFile, notFoundFile)
        }
      }
    },
  }
}
