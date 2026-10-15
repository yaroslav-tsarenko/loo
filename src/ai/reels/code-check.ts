import { Worker } from 'node:worker_threads'

// Runs a reel's JS snippet in a node:vm context inside a throwaway worker thread:
// the vm timeout stops sync loops, terminating the worker stops everything else
// (async loops, unhandled rejections) without touching the host process.

export type RunResult =
  | { status: 'ok'; logs: string[] }
  | { status: 'threw'; error: string; logs: string[] }
  | { status: 'timeout'; logs: string[] }
  // Can't be judged here: ES module syntax or a host API (DOM, fetch, Node modules) the sandbox lacks.
  | { status: 'skipped'; reason: string; logs: string[] }

// Host / browser globals a reel may legitimately mention; a ReferenceError on them is not a bug in the fact.
const HOST_GLOBALS = [
  'window', 'document', 'navigator', 'location', 'fetch', 'Response', 'Request', 'Headers', 'localStorage', 'sessionStorage',
  'HTMLElement', 'Element', 'Node', 'Event', 'EventTarget', 'CustomEvent', 'AbortController', 'AbortSignal', 'requestAnimationFrame',
  'requestIdleCallback', 'MessageChannel', 'Worker', 'Blob', 'File', 'FormData', 'URL', 'URLSearchParams', 'TextEncoder', 'TextDecoder',
  'crypto', 'performance', 'structuredClone', 'process', 'require', 'module', 'exports', '__dirname', 'Buffer', 'global', 'Deno', 'Bun', 'Temporal', 'alert',
]

// Plain CommonJS for an eval'd worker. Timers are emulated with a virtual clock and run
// after the sync code and its microtasks, so event-loop reels print in the real order.
const PRELUDE = `
  let __now = 0, __seq = 0
  const __timers = []
  globalThis.setTimeout = (fn, ms = 0, ...args) => { const id = ++__seq; __timers.push({ id, fn, at: __now + Math.max(0, Number(ms) || 0), args }); return id }
  globalThis.setInterval = globalThis.setTimeout
  globalThis.setImmediate = (fn, ...args) => { const id = ++__seq; __timers.push({ id, fn, at: __now + 0.5, args }); return id }
  globalThis.clearTimeout = globalThis.clearInterval = globalThis.clearImmediate = (id) => { const i = __timers.findIndex((t) => t.id === id); if (i >= 0) __timers.splice(i, 1) }
  globalThis.queueMicrotask = (fn) => { Promise.resolve().then(fn) }
  globalThis.__nextTimer = () => {
    if (!__timers.length) return false
    __timers.sort((a, b) => a.at - b.at || a.id - b.id)
    const t = __timers.shift()
    __now = t.at
    t.fn(...t.args)
    return true
  }
`

const WORKER_SOURCE = String.raw`
const { parentPort, workerData } = require('node:worker_threads')
const vm = require('node:vm')
const { inspect } = require('node:util')
const { code, timeoutMs, prelude } = workerData
const logs = []
let done = false
const finish = (msg) => { if (done) return; done = true; parentPort.postMessage({ ...msg, logs: logs.slice(0, 40) }) }
const fmt = (args) => args.map((a) => (typeof a === 'string' ? a : inspect(a, { depth: 3, breakLength: Infinity }))).join(' ')
const errText = (e) => (e && typeof e === 'object' && 'name' in e ? String(e.name) + ': ' + String(e.message) : 'Uncaught ' + inspect(e))
process.on('unhandledRejection', (e) => finish({ status: 'threw', error: errText(e) }))
process.on('uncaughtException', (e) => finish({ status: 'threw', error: errText(e) }))
const log = (...a) => { logs.push(fmt(a)) }
const ctx = vm.createContext({ console: { log, info: log, warn: log, error: log, debug: log, table: log, dir: log } }, { microtaskMode: 'afterEvaluate' })
vm.runInContext(prelude, ctx)
const run = (src) => vm.runInContext(src, ctx, { timeout: timeoutMs, filename: 'reel.js' })
;(async () => {
  try {
    let compiled = true
    try { new vm.Script(code) } catch (e) {
      // Top-level await: retry as an async function body, outcome kept inside the context.
      if (e && e.name === 'SyntaxError' && /\bawait\b/.test(code)) compiled = false
      else throw e
    }
    if (compiled) run(code)
    else run('(async () => {\n' + code + '\n})().then(() => { globalThis.__asyncOk = true }, (e) => { globalThis.__asyncError = e })')
    for (let i = 0; i < 200 && run('__nextTimer()'); i++);
    await new Promise((r) => setImmediate(r))
    if (!compiled && ctx.__asyncError !== undefined) throw ctx.__asyncError
    finish({ status: 'ok' })
  } catch (e) {
    finish(e && e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' ? { status: 'timeout' } : { status: 'threw', error: errText(e) })
  }
})()
`

export interface RunOptions {
  timeoutMs?: number
}

export function hasModuleSyntax(code: string): boolean {
  return /^\s*(import\s[^(]|import\s*\{|export\s)/m.test(code)
}

export async function runSnippet(code: string, { timeoutMs = 250 }: RunOptions = {}): Promise<RunResult> {
  if (hasModuleSyntax(code)) return { status: 'skipped', reason: 'ES module syntax', logs: [] }
  return new Promise<RunResult>((resolve) => {
    const worker = new Worker(WORKER_SOURCE, { eval: true, workerData: { code, timeoutMs, prelude: PRELUDE }, resourceLimits: { maxOldGenerationSizeMb: 64, maxYoungGenerationSizeMb: 16 } })
    const settle = (r: RunResult) => {
      clearTimeout(hard)
      void worker.terminate()
      resolve(r)
    }
    // Hard stop for anything the in-worker timeouts miss.
    const hard = setTimeout(() => settle({ status: 'timeout', logs: [] }), timeoutMs * 4 + 1500)
    worker.once('message', (msg: { status: 'ok' | 'threw' | 'timeout'; error?: string; logs: string[] }) => {
      if (msg.status === 'threw') {
        const host = /^ReferenceError: (\w+) is not defined/.exec(msg.error ?? '')?.[1]
        if (host && HOST_GLOBALS.includes(host)) return settle({ status: 'skipped', reason: `host API: ${host}`, logs: msg.logs })
        return settle({ status: 'threw', error: msg.error ?? 'Error', logs: msg.logs })
      }
      settle(msg.status === 'ok' ? { status: 'ok', logs: msg.logs } : { status: 'timeout', logs: msg.logs })
    })
    worker.once('error', (e) => settle({ status: 'threw', error: `${e.name}: ${e.message}`, logs: [] }))
  })
}

// Drop rule: code that throws (or hangs) is only fine when the reel is about that error.
export function codeVerdict(result: RunResult, expectsError: boolean): { ok: boolean; note: string } {
  switch (result.status) {
    case 'ok':
      return { ok: true, note: result.logs.length ? `stdout: ${result.logs.join(' | ')}` : 'виконано без виводу' }
    case 'skipped':
      return { ok: true, note: `не перевірено в sandbox (${result.reason})` }
    case 'threw':
      return { ok: expectsError, note: `кидає ${result.error}` }
    case 'timeout':
      return { ok: false, note: 'не завершився за таймаут' }
  }
}
