import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { after } from 'next/server'
import { setQueryHook } from '@/db/client'

// PERF_TRACE=1 (docs/PERFORMANCE.md): one log line per request with its database work —
//   [perf] GET /path 182ms · db 9 stmt / 2 tx (61ms in tx) · spans layout.shell=24ms
// Statements are counted at the drizzle layer (every query, including the RLS set_config); transactions and their
// wall time in withUser. Off by default: the hooks are not installed and every helper is a no-op.

export const perfEnabled = process.env.PERF_TRACE === '1'

interface Trace {
  start: number
  label: string | null
  statements: number
  tx: number
  txMs: number
  spans: Array<[string, number]>
}

function newTrace(): Trace {
  const trace: Trace = { start: performance.now(), label: null, statements: 0, tx: 0, txMs: 0, spans: [] }
  try {
    // proxy.ts tags the request (method, path, server action) when tracing
    headers()
      .then((h) => (trace.label ??= h.get('x-perf-label')))
      .catch(() => {})
  } catch {
    // no request headers here (prerender, cache scope)
  }
  try {
    after(() => {
      const spans = trace.spans.length > 0 ? ` · spans ${trace.spans.map(([k, ms]) => `${k}=${ms}ms`).join(' ')}` : ''
      console.info(`[perf] ${trace.label ?? 'request'} ${Math.round(performance.now() - trace.start)}ms · db ${trace.statements} stmt / ${trace.tx} tx (${Math.round(trace.txMs)}ms in tx)${spans}`)
    })
  } catch {
    // outside a request (build, scripts): nothing to report
  }
  return trace
}

// The request a statement belongs to: Next's per-request work store (renders, server actions and route handlers
// alike — React's cache() only spans a render). Internal API, so only touched when tracing and never fatal.
type WorkStorage = { getStore(): object | undefined }
let workStorage: WorkStorage | null | undefined
function workStore(): object | undefined {
  if (workStorage === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      workStorage = (require('next/dist/server/app-render/work-async-storage.external') as { workAsyncStorage: WorkStorage }).workAsyncStorage
    } catch {
      workStorage = null
    }
  }
  return workStorage?.getStore()
}

// Shared by every copy of this module (server actions and RSC are bundled into separate layers).
const tracesKey = Symbol.for('levelup.perf-traces')
const traces: WeakMap<object, Trace> = ((globalThis as { [tracesKey]?: WeakMap<object, Trace> })[tracesKey] ??= new WeakMap())
const renderTrace = cache(newTrace)

function trace(): Trace | null {
  if (!perfEnabled) return null
  try {
    const store = workStore()
    if (!store) return renderTrace()
    let t = traces.get(store)
    if (!t) traces.set(store, (t = newTrace()))
    return t
  } catch {
    return null
  }
}

if (perfEnabled) setQueryHook(() => {
  const t = trace()
  if (t) t.statements++
})

export function perfTx(ms: number): void {
  const t = trace()
  if (!t) return
  t.tx++
  t.txMs += ms
}

// Times an awaited block (only when tracing): `await perfSpan('layout.shell', () => shellData())`.
export async function perfSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const t = trace()
  if (!t) return fn()
  const started = performance.now()
  try {
    return await fn()
  } finally {
    t.spans.push([name, Math.round(performance.now() - started)])
  }
}
