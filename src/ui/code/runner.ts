import { runSuite, type HarnessHost, type LogEntry, type RunEvent, type RunReport, type TestResult } from './harness'

export type { LogEntry, RunReport, TestResult }

export const RUN_TIMEOUT_MS = 3000
export const TIMEOUT_MESSAGE = '⏱️ Таймаут: нескінченний цикл?'

type Message = { token: string } & (RunEvent | { type: 'done'; report: RunReport })

// Runs inside the worker. Serialized with toString — keep it self-contained.
function bootstrap(run: typeof runSuite) {
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
  // No network, no nested workers, no way to forge results: strip these from the global and its prototypes
  const blocked = ['fetch', 'XMLHttpRequest', 'WebSocket', 'WebSocketStream', 'WebTransport', 'EventSource', 'importScripts', 'indexedDB', 'caches', 'BroadcastChannel', 'Worker', 'SharedWorker', 'postMessage', 'Request', 'navigator']
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

let blobUrl: string | null = null

function workerUrl(): string {
  if (!blobUrl) {
    const source = `"use strict";\n(${bootstrap.toString()})(${runSuite.toString()})`
    blobUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }))
  }
  return blobUrl
}

export interface RunHandle {
  done: Promise<RunReport>
  cancel: () => void
}

// Fresh worker per run: global state from the previous attempt can't leak, and terminate() kills infinite loops.
export function runInWorker(code: string, tests: string, onEvent?: (event: RunEvent) => void, timeoutMs = RUN_TIMEOUT_MS): RunHandle {
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36)
  const tests_: TestResult[] = []
  const logs: LogEntry[] = []
  const started = performance.now()
  let worker: Worker | null = null
  let timer = 0
  let settle: (report: RunReport) => void = () => {}
  const done = new Promise<RunReport>((resolve) => (settle = resolve))
  const stop = (report: RunReport) => {
    window.clearTimeout(timer)
    worker?.terminate()
    worker = null
    settle(report)
  }
  const partial = (status: RunReport['status'], error: string): RunReport => ({ status, tests: tests_, logs, error, ms: performance.now() - started })
  try {
    worker = new Worker(workerUrl(), { name: 'code-runner' })
  } catch (e) {
    stop(partial('error', `Не вдалося запустити пісочницю: ${e instanceof Error ? e.message : String(e)}`))
    return { done, cancel: () => {} }
  }
  worker.onmessage = (e: MessageEvent<Message>) => {
    const msg = e.data
    if (!msg || msg.token !== token) return
    if (msg.type === 'done') return stop(msg.report)
    if (msg.type === 'test') tests_.push(msg.result)
    if (msg.type === 'log') logs.push(msg.entry)
    onEvent?.(msg)
  }
  worker.onerror = (e) => {
    e.preventDefault()
    stop(partial('error', e.message || 'Пісочниця впала'))
  }
  timer = window.setTimeout(() => stop(partial('timeout', TIMEOUT_MESSAGE)), timeoutMs)
  worker.postMessage({ token, code, tests })
  return { done, cancel: () => stop(partial('error', 'Скасовано')) }
}
