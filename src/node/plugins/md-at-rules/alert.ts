import { AtRule } from './index.js'

function alert(rule: AtRule) {
  const type = rule.tagName
  const title = rule.params[0] || ''
  const content = rule.content.replace(/(?:^\s|\s$)/g, '')

  return `<SCAlert type="${type}" title="${title}">

${content}

</SCAlert>`
}

export function success(rule: AtRule) {
  return alert(rule)
}
success.tagName = 'success'

export function danger(rule: AtRule) {
  return alert(rule)
}
danger.tagName = 'danger'

export function warning(rule: AtRule) {
  return alert(rule)
}
warning.tagName = 'warning'

export function info(rule: AtRule) {
  return alert(rule)
}
info.tagName = 'info'
