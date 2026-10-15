import { describe, expect, it } from 'vitest'
import { corsCheck, headerRecord, isSafelistedHeader, needsPreflight, preflightAllows, unsafeHeaderNames } from '@/ui/viz/cors/http'
import { ORIGIN, PREFLIGHT_REQ, SIMPLE_REQ, corsScenarios, type CorsFrame } from '@/ui/viz/cors/scenarios'
import { codeLines, type StepScenario, type Token } from '@/ui/viz/engine/types'
import { dispatch, pathTo, type DomNode, type Listener } from '@/ui/viz/event-propagation/dispatch'
import { eventPropagationScenarios } from '@/ui/viz/event-propagation/scenarios'
import { ageOf, decide, revalidate, storable } from '@/ui/viz/http-cache/cache'
import { httpCacheScenarios } from '@/ui/viz/http-cache/scenarios'
import { FRAME_MS, budget, runOps, stagesFor, type Op } from '@/ui/viz/render-pipeline/pipeline'
import { renderPipelineScenarios } from '@/ui/viz/render-pipeline/scenarios'
import { nextState, stateIndex } from '@/ui/viz/service-worker/lifecycle'
import { serviceWorkerScenarios } from '@/ui/viz/service-worker/scenarios'

const SCENARIOS: Record<string, Record<string, StepScenario>> = {
  'event-propagation': eventPropagationScenarios,
  'render-pipeline': renderPipelineScenarios,
  cors: corsScenarios,
  'http-cache': httpCacheScenarios,
  'service-worker': serviceWorkerScenarios,
}

const all = Object.entries(SCENARIOS).flatMap(([viz, map]) => Object.entries(map).map(([scenario, data]) => ({ name: `${viz}/${scenario}`, data })))

describe('web vizs: frames', () => {
  it('has the agreed scenario ids', () => {
    expect(Object.keys(eventPropagationScenarios)).toEqual(['capture-bubble', 'delegation'])
    expect(Object.keys(renderPipelineScenarios)).toEqual(['frame', 'layout-thrashing'])
    expect(Object.keys(corsScenarios)).toEqual(['simple', 'preflight'])
    expect(Object.keys(httpCacheScenarios)).toEqual(['revalidation'])
    expect(Object.keys(serviceWorkerScenarios)).toEqual(['lifecycle'])
  })

  it.each(all)('$name: frames are well-formed', ({ data }) => {
    const lines = codeLines(data.code).length
    expect(data.frames.length).toBeGreaterThan(1)
    for (const frame of data.frames) {
      expect(frame.note.trim().length).toBeGreaterThan(10)
      expect(frame.note.length).toBeLessThan(320)
      expect(frame.note).toMatch(/[а-яіїєґ]/i)
      if (frame.line !== null) {
        expect(Number.isInteger(frame.line)).toBe(true)
        expect(frame.line).toBeGreaterThanOrEqual(1)
        expect(frame.line).toBeLessThanOrEqual(lines)
      }
      for (const value of Object.values(frame)) {
        if (Array.isArray(value) && value.every((v) => v && typeof v === 'object' && 'id' in v)) {
          const ids = (value as Token[]).map((t) => t.id)
          expect(new Set(ids).size).toBe(ids.length)
        }
      }
    }
  })
})

describe('event propagation', () => {
  const chain: DomNode = {
    id: 'window',
    tag: 'window',
    children: [{ id: 'document', tag: 'document', children: [{ id: 'ul', tag: '<ul>', children: [{ id: 'li', tag: '<li>', children: [{ id: 'btn', tag: '<button>' }] }] }] }],
  }
  const ls: Listener[] = [
    { id: 'btn-bubble', node: 'btn', capture: false, label: '' },
    { id: 'doc-bubble', node: 'document', capture: false, label: '' },
    { id: 'win-capture', node: 'window', capture: true, label: '' },
    { id: 'btn-capture', node: 'btn', capture: true, label: '' },
    { id: 'li-bubble', node: 'li', capture: false, label: '' },
    { id: 'ul-capture', node: 'ul', capture: true, label: '' },
  ]

  it('builds the path from window to the target', () => {
    expect(pathTo(chain, 'btn')).toEqual(['window', 'document', 'ul', 'li', 'btn'])
    expect(pathTo(chain, 'nope')).toEqual([])
  })

  it('capture top-down, target (capture first), then bubble bottom-up', () => {
    const order = dispatch(pathTo(chain, 'btn'), ls)
    expect(order.map((i) => `${i.listener}:${i.phase}`)).toEqual(['win-capture:1', 'ul-capture:1', 'btn-capture:2', 'btn-bubble:2', 'li-bubble:3', 'doc-bubble:3'])
  })

  it('stopPropagation lets the current node finish, then stops', () => {
    const stop: Listener = { id: 'li-stop', node: 'li', capture: false, label: '', stops: true }
    const after: Listener = { id: 'li-after', node: 'li', capture: false, label: '' }
    const order = dispatch(pathTo(chain, 'btn'), [...ls, stop, after]).map((i) => i.listener)
    expect(order.slice(-3)).toEqual(['li-bubble', 'li-stop', 'li-after'])
    expect(order).not.toContain('doc-bubble')
  })

  it('non-bubbling events still reach target listeners but skip the bubble phase', () => {
    const order = dispatch(pathTo(chain, 'btn'), ls, false).map((i) => i.listener)
    expect(order).toEqual(['win-capture', 'ul-capture', 'btn-capture', 'btn-bubble'])
  })

  it.each(Object.entries(eventPropagationScenarios))('%s: listeners shown in frames match the spec order', (_name, data) => {
    const runs = new Map<number, { frames: typeof data.frames[number][] }>()
    for (const f of data.frames) {
      if (f.run === 0) {
        expect(f.ran).toEqual([])
        continue
      }
      const r = runs.get(f.run) ?? { frames: [] }
      r.frames.push(f)
      runs.set(f.run, r)
    }
    expect(runs.size).toBeGreaterThan(0)
    for (const { frames } of runs.values()) {
      const first = frames[0]!
      const expected = dispatch(pathTo(first.tree, first.target!), first.listeners)
      expect(frames.flatMap((f) => f.ran)).toEqual(expected.map((i) => i.listener))
      for (const f of frames) {
        // the event dot sits on a node of the path
        if (f.at) expect(pathTo(f.tree, f.target!)).toContain(f.at)
        if (f.ran.length === 1) {
          const inv = expected.find((i) => i.listener === f.ran[0])!
          expect(f.phase).toBe(inv.phase)
          expect(f.at).toBe(inv.node)
        }
      }
    }
  })
})

describe('render pipeline', () => {
  it('maps CSS properties to the stages they trigger', () => {
    expect(stagesFor('width')).toEqual(['style', 'layout', 'paint', 'composite'])
    expect(stagesFor('color')).toEqual(['style', 'paint', 'composite'])
    expect(stagesFor('transform')).toEqual(['style', 'composite'])
    expect(stagesFor('opacity')).toEqual(['style', 'composite'])
  })

  it('frame scenario highlights exactly the triggered stages', () => {
    for (const f of renderPipelineScenarios.frame!.frames) {
      if (!f.prop) continue
      const hit = Object.entries(f.stages)
        .filter(([, s]) => s === 'hit')
        .map(([k]) => k)
      expect(hit).toEqual(stagesFor(f.prop))
    }
  })

  it('budget: 60 Hz frame is ≈16.7 ms', () => {
    expect(FRAME_MS).toBeCloseTo(16.67, 2)
    expect(budget([{ id: 'a', kind: 'js', ms: 10 }]).over).toBe(false)
    expect(budget([{ id: 'a', kind: 'js', ms: 10 }, { id: 'b', kind: 'layout', ms: 7 }]).over).toBe(true)
  })

  it('interleaved reads and writes force a layout on every read but the first', () => {
    const interleaved: Op[] = ['read', 'write', 'read', 'write', 'read', 'write', 'read', 'write']
    const batched: Op[] = ['read', 'read', 'read', 'read', 'write', 'write', 'write', 'write']
    expect(runOps(interleaved).forced).toBe(3)
    expect(runOps(batched)).toMatchObject({ forced: 0, dirty: true })
    expect(runOps(['write', 'read']).trace).toEqual([false, true])
  })

  it('layout-thrashing frames agree with the simulation and the budget', () => {
    const frames = renderPipelineScenarios['layout-thrashing']!.frames
    const forcedIn = (i: number) => frames[i]!.blocks.filter((b) => b.kind === 'forced').length
    const thrashEnd = frames.findIndex((f) => f.line === 7)
    const fixEnd = frames.findIndex((f) => f.line === 13)
    expect(forcedIn(thrashEnd)).toBe(runOps(['read', 'write', 'read', 'write', 'read', 'write', 'read', 'write']).forced)
    expect(budget(frames[thrashEnd]!.blocks).over).toBe(true)
    expect(forcedIn(fixEnd)).toBe(0)
    expect(frames[fixEnd]!.blocks.filter((b) => b.kind === 'layout')).toHaveLength(1)
    expect(budget(frames[fixEnd]!.blocks).over).toBe(false)
  })
})

describe('cors', () => {
  it('knows what a simple (no preflight) request is', () => {
    expect(needsPreflight(SIMPLE_REQ)).toBe(false)
    expect(needsPreflight({ method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' } })).toBe(false)
    expect(needsPreflight({ method: 'POST', headers: { 'Content-Type': 'application/json' } })).toBe(true)
    expect(needsPreflight({ method: 'GET', headers: { Authorization: 'Bearer x' } })).toBe(true)
    expect(needsPreflight({ method: 'DELETE', headers: {} })).toBe(true)
    expect(needsPreflight(PREFLIGHT_REQ)).toBe(true)
    expect(isSafelistedHeader('Range', 'bytes=0-99')).toBe(true)
    expect(unsafeHeaderNames(PREFLIGHT_REQ)).toEqual(['content-type', 'x-token'])
  })

  it('checks Allow-Origin and credentials', () => {
    expect(corsCheck({}, ORIGIN).ok).toBe(false)
    expect(corsCheck({ 'Access-Control-Allow-Origin': '*' }, ORIGIN).ok).toBe(true)
    expect(corsCheck({ 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true' }, ORIGIN, true).ok).toBe(false)
    expect(corsCheck({ 'Access-Control-Allow-Origin': ORIGIN }, ORIGIN, true).ok).toBe(false)
    expect(corsCheck({ 'Access-Control-Allow-Origin': ORIGIN, 'Access-Control-Allow-Credentials': 'true' }, ORIGIN, true).ok).toBe(true)
    expect(corsCheck({ 'Access-Control-Allow-Origin': 'https://evil.example' }, ORIGIN).ok).toBe(false)
  })

  it('preflight response must list the method and non-safelisted headers', () => {
    const base = { 'Access-Control-Allow-Origin': ORIGIN, 'Access-Control-Allow-Credentials': 'true' }
    expect(preflightAllows({ ...base, 'Access-Control-Allow-Methods': 'PUT', 'Access-Control-Allow-Headers': 'Content-Type, X-Token' }, PREFLIGHT_REQ, ORIGIN)).toBe(true)
    expect(preflightAllows({ ...base, 'Access-Control-Allow-Methods': 'PUT', 'Access-Control-Allow-Headers': 'Content-Type' }, PREFLIGHT_REQ, ORIGIN)).toBe(false)
    expect(preflightAllows({ ...base, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type, X-Token' }, PREFLIGHT_REQ, ORIGIN)).toBe(false)
    // wildcards do not count with credentials
    expect(preflightAllows({ ...base, 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*' }, PREFLIGHT_REQ, ORIGIN)).toBe(false)
  })

  it.each([
    ['simple', SIMPLE_REQ],
    ['preflight', PREFLIGHT_REQ],
  ] as const)('%s: verdicts in frames follow the CORS check', (name, req) => {
    const frames: readonly CorsFrame[] = corsScenarios[name]!.frames
    let checked = 0
    for (const f of frames) {
      if (!f.verdict) continue
      const res = f.msgs.findLast((m) => m.dir === 'res')!
      const ok = f.verdict.preflight ? preflightAllows(headerRecord(res), req, ORIGIN) : corsCheck(headerRecord(res), ORIGIN, req.credentials).ok
      expect(ok, f.note).toBe(f.verdict.ok)
      checked++
    }
    expect(checked).toBeGreaterThan(0)
  })

  it('preflight OPTIONS announces exactly the non-safelisted headers', () => {
    const opt = corsScenarios.preflight!.frames.flatMap((f) => f.msgs).find((m) => m.line.startsWith('OPTIONS'))!
    expect(headerRecord(opt)['Access-Control-Request-Headers']).toBe(unsafeHeaderNames(PREFLIGHT_REQ).join(','))
    expect(headerRecord(opt)['Access-Control-Request-Method']).toBe(PREFLIGHT_REQ.method)
    expect(headerRecord(opt).Cookie).toBeUndefined()
  })
})

describe('http cache', () => {
  const entry = { etag: '"v1"', storedAt: 0, maxAge: 60 }

  it('fresh while age < max-age, stale after', () => {
    expect(decide(null, 0)).toBe('miss')
    expect(decide(entry, 0)).toBe('fresh')
    expect(decide(entry, 59)).toBe('fresh')
    expect(decide(entry, 60)).toBe('stale')
    expect(decide(entry, 90)).toBe('stale')
    expect(decide({ ...entry, noCache: true }, 1)).toBe('stale')
    expect(ageOf(entry, 30)).toBe(30)
  })

  it('conditional requests and no-store', () => {
    expect(revalidate('"v1"', '"v1"')).toBe(304)
    expect(revalidate('"v1"', '"v2"')).toBe(200)
    expect(storable('max-age=60')).toBe(true)
    expect(storable('no-cache')).toBe(true)
    expect(storable('private, no-store')).toBe(false)
  })

  it('frames agree with the freshness model and the server', () => {
    const frames = httpCacheScenarios.revalidation!.frames
    for (const f of frames) if (f.decision) expect(decide(f.entry, f.t), f.note).toBe(f.decision)
    for (const f of frames) {
      if (f.hop !== 'server' || !f.msg || f.msg.dir !== 'res') continue
      const prev = frames[frames.indexOf(f) - 1]!
      const inm = prev.msg?.headers.find((h) => h.name === 'If-None-Match')?.value
      if (!inm) continue
      expect(f.msg.line.startsWith(String(revalidate(inm, f.server)))).toBe(true)
    }
    // time never goes backwards
    for (let i = 1; i < frames.length; i++) expect(frames[i]!.t).toBeGreaterThanOrEqual(frames[i - 1]!.t)
  })
})

describe('service worker', () => {
  const ctx = { installOk: true, hasActive: false, controlledClients: 0, skipWaiting: false }

  it('walks the lifecycle', () => {
    expect(nextState('parsed', ctx)).toBe('installing')
    expect(nextState('installing', ctx)).toBe('installed')
    expect(nextState('installing', { ...ctx, installOk: false })).toBe('redundant')
    expect(nextState('installed', ctx)).toBe('activating')
    expect(nextState('activating', ctx)).toBe('activated')
  })

  it('a new version waits while the old one controls pages, unless skipWaiting()', () => {
    const update = { ...ctx, hasActive: true, controlledClients: 2 }
    expect(nextState('installed', update)).toBe('installed')
    expect(nextState('installed', { ...update, controlledClients: 0 })).toBe('activating')
    expect(nextState('installed', { ...update, skipWaiting: true })).toBe('activating')
  })

  it('frames only move workers forward and match the waiting rule', () => {
    const frames = serviceWorkerScenarios.lifecycle!.frames
    const last = new Map<string, number>()
    for (const f of frames) {
      for (const w of f.workers) {
        const idx = stateIndex(w.state)
        expect(idx).toBeGreaterThanOrEqual(last.get(w.id) ?? 0)
        last.set(w.id, idx)
        // nobody is controlled by a worker that is not active
        if (w.state !== 'activated') expect(f.tabs.some((t) => t.controller === w.id)).toBe(false)
      }
      const waiting = f.workers.find((w) => w.state === 'installed')
      const active = f.workers.find((w) => w.state === 'activated')
      if (waiting && active) {
        const controlled = f.tabs.filter((t) => t.controller === active.id).length
        expect(nextState('installed', { ...ctx, hasActive: true, controlledClients: controlled })).toBe('installed')
      }
    }
  })
})
