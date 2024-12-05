import { AtRule } from './index.js'

const mapTypeIconName = {
  success: 'hsi hsi-hand-thumbs-up',
  danger: 'hsi hsi-exclamation-triangle',
  warning: 'hsi hsi-exclamation-circle',
  info: 'hsi hsi-chat-right-text',
}

const mapTypeTitle = {
  success: '推荐',
  danger: '警告',
  warning: '注意',
  info: '提示',
}

function alert(rule: AtRule) {
  const type = rule.tagName
  const title = rule.params[0] || ''
  const content = rule.content.replace(/(?:^\s|\s$)/g, '')

  return `<div class="doc-alert ${`doc-alert-${type}`}">
  <div class="doc-alert-title">
    <i class="doc-alert-icon ${mapTypeIconName[type]}"></i>
    ${title || mapTypeTitle[type]}
  </div>
  <div class="doc-alert-content">

${content}

  </div>
</div>`
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
