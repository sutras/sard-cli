import { createServer } from 'vite'
import mergeViteConfig from '../utils/mergeViteConfig.js'
import { devMobile } from './dev-mobile.js'
import chalk from 'chalk'
import { sard } from '../utils/runtime.js'
import { sardConfig } from '../getSardConfig.js'

const createViteDevServer = async () => {
  const server = await createServer(
    mergeViteConfig({
      async onRestart() {
        console.log('onRestart')
        await server.close()
        createViteDevServer()
      },
    }),
  )
  await server.listen()
  server.printUrls()
}

function logUrl(platform: string, url: string) {
  console.log(
    `  ${chalk.green('➜')}  ${chalk.bold(platform)}:   ${chalk.cyan(url)}`,
  )
}

export async function dev() {
  if (sardConfig.mobile) {
    const child = devMobile()

    let log = ''
    let timer: ReturnType<typeof setTimeout> | undefined = undefined
    let start = false

    child.stderr!.on('data', (data) => {
      console.log(data)
    })

    child.stdout!.on('data', (data) => {
      log += data

      if (/http:/.test(log) && !start) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          const urls = log.match(/http:\/\/.+/g)!
          logUrl('Local', urls[0])
          logUrl('Network', urls[1])

          // eslint-disable-next-line no-control-regex
          sard.url = urls[1].replace(/\x1b\[\d+m/g, '')

          if (!start) {
            start = true
            createViteDevServer()
          }
        }, 500)
      }
    })
  } else {
    createViteDevServer()
  }
}
