import consola from 'consola'

function addPrefix(msg: string) {
  return `[sard] ${msg}`
}

export function logSuccess(msg: string) {
  consola.success(addPrefix(msg))
}

export function logWarning(msg: string) {
  consola.warn(addPrefix(msg))
}

export function logError(msg: string) {
  consola.error(addPrefix(msg))
}

export function logFatalError(msg: string) {
  logError(msg)
  process.exit()
}
