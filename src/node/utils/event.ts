type Handler = (payload: unknown) => void

export function createEvent() {
  const queues: Record<string, Handler[]> = {}

  function on(type: string, handler: Handler) {
    let handlers = queues[type]
    if (!handlers) {
      handlers = queues[type] = []
    }
    handlers.push(handler)
  }

  function emit(type: string, payload?: unknown) {
    const handlers = queues[type]
    if (handlers) {
      handlers.forEach((handler) => {
        handler(payload)
      })
    }
  }

  function off(type: string, handler?: Handler) {
    if (!handler) {
      delete queues[type]
      return
    }
    let handlers = queues[type]
    if (handlers) {
      handlers = queues[type] = handlers.filter((item) => item !== handler)
      if (handlers.length === 0) {
        off(type)
      }
    }
  }

  return {
    on,
    emit,
    off,
  }
}
