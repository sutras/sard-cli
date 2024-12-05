import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { AtRule } from './index.js'
import { sardConfig } from '../../getSardConfig.js'
import consola from 'consola'

function makeTextToCode(text: string, lang: string) {
  return text
    .replace(/^\s*|\s*$/g, '')
    .replace(/^/, `\`\`\`${lang}\n`)
    .replace(/$/, '\n```')
}

function extractHashContent(text: string, hash: string) {
  const regexp = new RegExp(
    `(?<=^\\s*//\\s*#${hash}\\s*\n)[\\s\\S]*?(?=^\\s*//\\s*#end${hash}\\s*)`,
    'm',
  )
  return regexp.exec(text)?.[0] || ''
}

function replaceAliasPath(string: string) {
  return string
    .split(/(\$\{[^}]+\})/)
    .map((item, index) => {
      if (index % 2 === 0) {
        return item
      }
      const alias = item.slice(2, -1)
      return sardConfig.codeAlias[alias] ?? item
    })
    .join('')
}

function readSpecialFile(id: string, relativePath: string, hash: string) {
  relativePath = replaceAliasPath(relativePath)

  const file = path.resolve(path.dirname(id), relativePath)

  if (existsSync(file)) {
    let text = readFileSync(file, 'utf-8')
    if (hash) {
      text = extractHashContent(text, hash)
    }
    const extname = path.extname(file).replace(/^\./, '')
    return makeTextToCode(text, extname === 'vue' ? 'html' : extname)
  } else {
    consola.warn(`${file} 文件不存在`)
    return ''
  }
}

function replaceSpecialFile(id: string, url: string) {
  const [path, hash] = url.split('#')
  return readSpecialFile(id, path, hash)
}

export function code(rule: AtRule) {
  return replaceSpecialFile(rule.id, rule.params[0])
}

code.tagName = 'code'
