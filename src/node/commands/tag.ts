import path from 'path'
import shell from 'shelljs'
import { CWD } from '../utils/constants.js'

export async function tag() {
  await new Promise<void>((resolve, reject) => {
    import(path.resolve(CWD, 'package.json'), {
      with: {
        type: 'json',
      },
    }).then(({ default: pkg }) => {
      shell.exec(
        `git tag v${pkg.version}`,
        {
          silent: true,
        },
        (...[code, , stderr]) => {
          if (code !== 0) {
            reject(stderr)
          } else {
            resolve()
          }
        },
      )
    })
  })
}
