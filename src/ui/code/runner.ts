import type { LogEntry, RunEvent, RunReport, TestResult } from './harness'
import { HARNESS_UK, type HarnessText } from '@/i18n/harness-text'

export type { LogEntry, RunReport, TestResult }

export const RUN_TIMEOUT_MS = 3000
// the emoji stays out of the dictionaries (tests/unit/game.test.ts: no emoji in UI strings)
export const TIMEOUT_MESSAGE = `⏱️ ${HARNESS_UK.runTimeout}`

type Message = { token: string } & (RunEvent | { type: 'done'; report: RunReport })

// The worker is served by /runner/worker.js with its own CSP (no network, no imports; eval only),
// so learner code can't phone home even if it gets past the global scrubbing in worker-source.ts.
export const WORKER_URL = '/runner/worker.js'

export interface RunHandle {
  done: Promise<RunReport>
  cancel: () => void
}

// Fresh worker per run: global state from the previous attempt can't leak, and terminate() kills infinite loops.
// `typescript`: the worker strips types (sucrase, bundled into the worker only) before running; types aren't checked.
// `text`: the harness texts in the learner's UI locale (messages(locale).harness).
export function runInWorker(code: string, tests: string, onEvent?: (event: RunEvent) => void, timeoutMs = RUN_TIMEOUT_MS, typescript = false, text: HarnessText = HARNESS_UK): RunHandle {
  const say = (key: keyof HarnessText, vars: Record<string, string> = {}) => text[key].replace(/\{(\w+)\}/g, (m, name: string) => vars[name] ?? m)
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
    worker = new Worker(WORKER_URL, { name: 'code-runner' })
  } catch (e) {
    stop(partial('error', say('sandboxFailed', { error: e instanceof Error ? e.message : String(e) })))
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
    stop(partial('error', e.message || say('sandboxCrashed')))
  }
  timer = window.setTimeout(() => stop(partial('timeout', `⏱️ ${say('runTimeout')}`)), timeoutMs)
  worker.postMessage(typescript ? { token, code, tests, typescript, text } : { token, code, tests, text })
  return { done, cancel: () => stop(partial('error', say('cancelled'))) }
}
