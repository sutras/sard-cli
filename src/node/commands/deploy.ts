import * as ghpages from 'gh-pages'
import consola from 'consola'
import inquirer from 'inquirer'
import { sardConfig } from '../getSardConfig.js'

interface Remote {
  name: string
  branch: string
  docsRepo: string
  success?: () => void
}

const {
  git,
  site: { outDir },
} = sardConfig

const remotes = git.map((item) => {
  return {
    ...item,
    success: item.pages
      ? () => {
          consola.info(`需要到 ${item.name} 后台手动更新: ${item.pages}`)
        }
      : undefined,
  }
})

function getRemoteConfigs(remote: string) {
  if (remote === 'both') {
    return remotes
  } else {
    return [remotes.find((item) => item.name === remote)!]
  }
}

async function doDeploy(config: Remote) {
  return new Promise<void>((resolve, reject) => {
    consola.start(`[${config.name}] (${config.docsRepo}) 开始部署...`)
    ghpages.publish(
      outDir,
      {
        branch: config.branch,
        repo: config.docsRepo,
      },
      (err) => {
        if (err) {
          reject(err)
        } else {
          consola.success(`[${config.name}] (${config.docsRepo}) 部署成功`)
          resolve()
        }
      },
    )
  })
}

export async function deploy() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'remote',
      message: '选择部署到哪个远程仓库？',
      choices: [
        {
          name: 'both',
          value: 'both',
        },
        ...git.map((item) => {
          return {
            name: item.name,
            value: item.name,
          }
        }),
      ],
    },
  ])

  const configs = getRemoteConfigs(answers.remote)

  try {
    for (const config of configs) {
      await doDeploy(config)
      config.success?.()
    }
  } catch (err) {
    consola.error(err)
  }
}
