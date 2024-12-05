import { resolve } from 'node:path'
import micromatch from 'micromatch'
import { Plugin } from 'vite'

export interface VitePluginRestartOptions {
  restart?: string[]
  onRestart?: () => void
}

export function VitePluginRestart(options: VitePluginRestartOptions): Plugin {
  let restartGlobs: string[] = []

  return {
    name: 'VitePluginRestart',
    enforce: 'pre',
    configResolved(config) {
      restartGlobs =
        options.restart?.map((i) => resolve(config.root || process.cwd(), i)) ||
        []
    },
    configureServer(server) {
      server.watcher.add([...restartGlobs])
      server.watcher.on('add', handleFileChange)
      server.watcher.on('change', handleFileChange)
      server.watcher.on('unlink', handleFileChange)

      function handleFileChange(path: string) {
        if (micromatch.isMatch(path, restartGlobs)) {
          options.onRestart?.()
        }
      }
    },
  }
}
