import { runSuite, type HarnessHost } from './harness'

// Runs inside the worker. Serialized with toString — keep it self-contained.
export function bootstrap(run: typeof runSuite) {
  const scope = globalThis as unknown as {
    postMessage: (message: unknown) => void
    onmessage: ((e: { data: { token: string; code: string; tests: string } }) => void) | null
    addEventListener: (type: string, fn: (e: { preventDefault: () => void; reason?: unknown }) => void) => void
  }
  const post = scope.postMessage.bind(scope)
  const host: HarnessHost = {
    setTimeout: setTimeout.bind(globalThis),
    clearTimeout: clearTimeout.bind(globalThis) as (id: unknown) => void,
    setInterval: setInterval.bind(globalThis),
    clearInterval: clearInterval.bind(globalThis) as (id: unknown) => void,
    now: Date.now,
  }
  // Defense in depth on top of the worker's CSP: strip network, storage and messaging APIs from the global and its prototypes
  const blocked = ['fetch', 'fetchLater', 'XMLHttpRequest', 'WebSocket', 'WebSocketStream', 'WebTransport', 'EventSource', 'importScripts', 'indexedDB', 'caches', 'BroadcastChannel', 'Worker', 'SharedWorker', 'postMessage', 'Request', 'navigator', 'FontFace', 'fonts', 'cookieStore']
  for (let obj: object | null = globalThis; obj; obj = Object.getPrototypeOf(obj)) {
    for (const key of blocked) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
      try {
        Object.defineProperty(obj, key, { value: undefined, writable: false, configurable: false })
      } catch {
        try {
          delete (obj as Record<string, unknown>)[key]
        } catch {}
      }
    }
  }
  let token = ''
  scope.addEventListener('unhandledrejection', (e) => {
    e.preventDefault()
    const reason = e.reason instanceof Error ? `${e.reason.name}: ${e.reason.message}` : String(e.reason)
    post({ token, type: 'log', entry: { level: 'error', text: `Необроблений reject: ${reason}` } })
  })
  scope.onmessage = (e) => {
    if (token) return
    token = e.data.token
    run(e.data.code, e.data.tests, (event) => post({ token, ...event }), host)
      .then((report) => post({ token, type: 'done', report }))
      .catch((err: unknown) => post({ token, type: 'done', report: { status: 'error', tests: [], logs: [], error: String(err), ms: 0 } }))
  }
}

// Full worker script: bootstrap + harness, both serialized from their source.
export function workerSource(): string {
  return `"use strict";\n(${bootstrap.toString()})(${runSuite.toString()})`
}
