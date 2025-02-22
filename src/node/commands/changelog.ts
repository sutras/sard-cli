import conventionalChangelog from 'conventional-changelog'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { CWD } from '../utils/constants.js'

export async function changelog() {
  await new Promise<void>((resolve, reject) => {
    let data = ''

    conventionalChangelog({
      preset: 'angular',
      releaseCount: 0,
    })
      .setEncoding('utf8')
      .on('data', (chunk) => {
        data += chunk
      })
      .on('error', (err) => {
        reject(err)
      })
      .on('end', async () => {
        await fsp.writeFile(path.resolve(CWD, 'CHANGELOG.md'), data)
        resolve()
      })
  })
}
