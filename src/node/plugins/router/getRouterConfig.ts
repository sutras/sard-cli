import { glob } from 'glob'
import fm from 'front-matter'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { kebabCase } from 'lodash-es'
import { sardConfig } from '../../getSardConfig.js'
import { FrontMatter } from '../../../common-type.js'
import { generateMenu, MenuItem } from './generateMenu.js'
import { normalizePath } from 'vite'

const { build: buildConfig } = sardConfig
const srcDir = path.resolve(process.cwd(), buildConfig.srcDir)

export const langs = ['zh-CN', 'en-US']
export const defaultLang = 'zh-CN'

async function getMarkdownFile(baseDir: string) {
  return await glob(`${baseDir}/**/*.md`.replace(/\\/g, '/'), {
    ignore: {
      ignored(p) {
        return p
          .relative()
          .split('/')
          .some((item) => /^(?:\.|_)/.test(item))
      },
    },
  })
}

export interface BaseRoute {
  frontMatter: FrontMatter
  segments: string[]
  routePath: string
  file: string
}

async function getBaseRoutes(files: string[]) {
  return await Promise.all(
    files.map(async (file) => {
      const { name, dir } = path.parse(file)

      const routePath =
        (
          dir.replace(new RegExp(`^${srcDir.replace(/\\/g, '\\\\')}`), '') +
          (/^(?:index|readme)$/i.test(name) ? '' : '/' + name)
        )
          .split(/[\\/]/)
          .map((item) => kebabCase(item))
          .join('/') || '/'

      const segments = routePath.split('/').filter(Boolean)

      const frontMatter = fm(await fsp.readFile(file, 'utf-8'))
        .attributes as Record<string, unknown>

      return {
        frontMatter,
        segments,
        routePath,
        file,
      }
    }),
  )
}

export async function getRouterConfig() {
  const files = await getMarkdownFile(srcDir)
  return await getBaseRoutes(files)
}

export function generateRoutes(routes: BaseRoute[]) {
  const menu = generateMenu(routes)

  function mapRoute(menu: MenuItem[]) {
    const convertedRoutes = menu.map(
      ({
        file,
        path,
        title,
        hidden,
        type,
        redirect,
        children,
        version,
      }): string => {
        return `{
          path: '${path}',
          component: () => import('${normalizePath(file!)}'),
          meta: ${JSON.stringify({
            title,
            hidden,
            version,
            type,
          })},
          redirect: ${redirect ? `'${redirect}'` : 'undefined'},
          children: ${children ? mapRoute(children) : 'null'}
        }`
      },
    )
    return `[${convertedRoutes.join(',')}]`
  }
  return mapRoute(menu)
}
