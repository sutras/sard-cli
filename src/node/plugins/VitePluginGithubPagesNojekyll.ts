import fs from 'node:fs'
import path from 'node:path'
import { type Plugin } from 'vite'

export function VitePluginGithubPagesNojekyll(): Plugin {
  return {
    name: 'VitePluginGithubPagesNojekyll',
    async writeBundle({ dir }) {
      if (dir) {
        const nojekyllFile = path.resolve(dir, '.nojekyll')
        fs.writeFileSync(nojekyllFile, '')
      }
    },
  }
}
