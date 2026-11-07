import { runSuite, type HarnessHost } from './harness'
import { HARNESS_UK, type HarnessText } from '@/i18n/harness-text'
import { TS_STRIP_SOURCE } from './ts-strip.bundle.generated'
import type { prepareTypeScript } from './ts-strip'

// Runs inside the worker. Serialized with toString — keep it self-contained.
// `prepareTs` is the bundled sucrase stripper (ts-strip.ts), used only for messages with `typescript: true`.
// `defaults`: the Ukrainian texts, inlined as JSON (a message without `text` — older callers — falls back to them).
export function bootstrap(run: typeof runSuite, prepareTs: typeof prepareTypeScript, defaults: HarnessText) {
  const scope = globalThis as unknown as {
    postMessage: (message: unknown) => void
    onmessage: ((e: { data: { token: string; code: string; tests: string; typescript?: boolean; text?: HarnessText } }) => void) | null
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
  let text: HarnessText | undefined
  scope.addEventListener('unhandledrejection', (e) => {
    e.preventDefault()
    const reason = e.reason instanceof Error ? `${e.reason.name}: ${e.reason.message}` : String(e.reason)
    const template = (text ?? defaults).unhandledRejection
    post({ token, type: 'log', entry: { level: 'error', text: template.replace('{reason}', reason) } })
  })
  scope.onmessage = (e) => {
    if (token) return
    token = e.data.token
    text = e.data.text ?? defaults
    const { code, tests, typescript } = e.data
    const prepared = typescript ? prepareTs(code, tests) : { ok: true as const, code, tests }
    if (!prepared.ok) return post({ token, type: 'done', report: { status: 'error', tests: [], logs: [], error: prepared.error, ms: 0 } })
    // the texts always travel with the message: the harness's own default can't be referenced from a worker
    run(prepared.code, prepared.tests, (event) => post({ token, ...event }), host, 1500, text ?? defaults)
      .then((report) => post({ token, type: 'done', report }))
      .catch((err: unknown) => post({ token, type: 'done', report: { status: 'error', tests: [], logs: [], error: String(err), ms: 0 } }))
  }
}

// Full worker script: bootstrap + harness serialized from their source, plus the pre-bundled TS stripper.
export function workerSource(): string {
  return `"use strict";\n(${bootstrap.toString()})(${runSuite.toString()}, ${TS_STRIP_SOURCE}, ${JSON.stringify(HARNESS_UK)})`
}
