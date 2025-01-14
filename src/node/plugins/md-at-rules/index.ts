import { code } from './code.js'
import { success, danger, warning, info } from './alert.js'

export interface AtRule {
  tagName: 'success' | 'danger' | 'warning' | 'info'
  params: string[]
  content: string
  id: string
}

const rules = {
  code,
  success,
  danger,
  warning,
  info,
}

function precompile({
  tagName,
  paramsStr,
  content,
  id,
}: {
  tagName: AtRule['tagName']
  paramsStr: string
  content: string
  id: string
}): AtRule {
  let params: string[] = []
  if (paramsStr) {
    params = new Function(`return [${paramsStr.replace(/(^\(|\)$)/g, '')}]`)()
  }

  return {
    tagName,
    params,
    content: content || '',
    id,
  }
}

export function compileAtRule(id: string, code: string) {
  const tagNames = Object.keys(rules).join('|')

  const regExp = new RegExp(
    `^@(${tagNames})(\\(.*\\))? *$\r?\n(?:([\\s\\S]*?)(^@end\\1) *)?`,
    'mg',
  )

  const result = code
    .replace(/\f/g, '')
    .replace(
      regExp,
      (_m, tagName: AtRule['tagName'], paramsStr: string, content: string) => {
        const rule = rules[tagName as keyof typeof rules]
        return rule(
          precompile({
            tagName,
            paramsStr,
            content,
            id,
          }),
        )
      },
    )
  return result
}
