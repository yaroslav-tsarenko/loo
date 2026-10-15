import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { MessageChannel } from 'node:worker_threads'
import { afterAll, describe, expect, it } from 'vitest'
import { codeLines, type StepScenario, type Token } from '@/ui/viz/engine/types'
import { moduleGraphScenarios } from '@/ui/viz/module-graph/scenarios'
import { proxyTrapsScenarios } from '@/ui/viz/proxy-traps/scenarios'
import { MB, workerMessagingScenarios } from '@/ui/viz/worker-messaging/scenarios'
import { PAYLOAD, xssScenarios } from '@/ui/viz/xss/scenarios'

const ALL: Record<string, Record<string, StepScenario>> = {
  'proxy-traps': proxyTrapsScenarios,
  'module-graph': moduleGraphScenarios,
  'worker-messaging': workerMessagingScenarios,
  xss: xssScenarios,
}

const cases = Object.entries(ALL).flatMap(([viz, map]) => Object.entries(map).map(([scenario, data]) => ({ name: `${viz}/${scenario}`, data })))
const last = <T>(list: readonly T[]): T => list[list.length - 1]!

// scenario code holds several files separated by `// name.ext` header comments
function splitFiles(code: string): Record<string, string> {
  const files: Record<string, string> = {}
  let current: string | null = null
  for (const line of codeLines(code)) {
    const head = /^\/\/ ([\w.]+\.[cm]?js)\b/.exec(line)
    if (head) {
      current = head[1]!
      files[current] = ''
      continue
    }
    if (current) files[current] += `${line}\n`
  }
  return files
}

const tmp = mkdtempSync(join(tmpdir(), 'viz-modules-'))
afterAll(() => rmSync(tmp, { recursive: true, force: true }))

function runNode(dir: string, entry: string): { stdout: string[]; stderr: string } {
  try {
    const out = execFileSync(process.execPath, [entry], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    return { stdout: out.trim().split('\n'), stderr: '' }
  } catch (e) {
    const err = e as { stdout: string; stderr: string }
    return { stdout: err.stdout.trim().split('\n'), stderr: err.stderr }
  }
}

describe('module scenarios: well-formed frames', () => {
  it.each(cases)('$name', ({ data }) => {
    const lines = codeLines(data.code).length
    expect(data.frames.length).toBeGreaterThan(1)
    for (const frame of data.frames) {
      expect(frame.note.trim().length).toBeGreaterThan(10)
      expect(frame.note.length).toBeLessThan(320)
      // Ukrainian explanation
      expect(frame.note).toMatch(/[а-яіїєґ]/i)
      if (frame.line !== null) {
        expect(Number.isInteger(frame.line)).toBe(true)
        expect(frame.line).toBeGreaterThanOrEqual(1)
        expect(frame.line).toBeLessThanOrEqual(lines)
      }
      for (const value of Object.values(frame)) {
        if (Array.isArray(value) && value.every((v) => v && typeof v === 'object' && 'id' in v && 'label' in v)) {
          const ids = (value as Token[]).map((t) => t.id)
          expect(new Set(ids).size).toBe(ids.length)
        }
      }
    }
  })
})

describe('proxy-traps matches the engine', () => {
  const data = proxyTrapsScenarios['get-set']!

  it('running the scenario code logs the same lines and throws the same error', () => {
    const logs: string[] = []
    const fakeConsole = { log: (...args: unknown[]) => logs.push(args.map(String).join(' ')) }
    let error: unknown = null
    try {
      new Function('console', data.code)(fakeConsole)
    } catch (e) {
      error = e
    }
    const end = last(data.frames)
    expect(logs).toEqual(end.output)
    expect(error).toBeInstanceOf(TypeError)
    expect(`TypeError: ${(error as Error).message}`).toBe(end.error)
  })

  it('trap order: in → has only; set with receiver goes through descriptor + defineProperty', () => {
    const log: string[] = []
    const handler: ProxyHandler<Record<string, unknown>> = {}
    for (const name of ['get', 'set', 'has', 'getOwnPropertyDescriptor', 'defineProperty'] as const) {
      ;(handler as Record<string, unknown>)[name] = (...args: unknown[]) => {
        log.push(name)
        return (Reflect[name] as (...a: unknown[]) => unknown)(...args)
      }
    }
    const proxy = new Proxy<Record<string, unknown>>({ name: 'Ann', age: 25 }, handler)
    void proxy.name
    expect(log.splice(0)).toEqual(['get'])
    proxy.age = 30
    expect(log.splice(0)).toEqual(['set', 'getOwnPropertyDescriptor', 'defineProperty'])
    void ('age' in proxy)
    expect(log.splice(0)).toEqual(['has'])
  })

  it('a set trap returning false throws only in strict mode', () => {
    const proxy = new Proxy<Record<string, unknown>>({}, { set: () => false })
    expect(() => new Function('p', "'use strict'; p.x = 1")(proxy)).toThrow(TypeError)
    expect(() => new Function('p', 'p.x = 1')(proxy)).not.toThrow()
  })

  it('the forwarded frame really has no trap', () => {
    const forwarded = data.frames.filter((f) => f.trap && !f.trap.defined)
    expect(forwarded.map((f) => f.trap!.name)).toEqual(['has'])
  })
})

describe('module-graph matches node', () => {
  it('esm-live-binding: 0, 1, then TypeError on assignment to an import', () => {
    const data = moduleGraphScenarios['esm-live-binding']!
    const dir = join(tmp, 'esm')
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'package.json'), '{ "type": "module" }')
    for (const [name, src] of Object.entries(splitFiles(data.code))) writeFileSync(join(dir, name), src)
    const { stdout, stderr } = runNode(dir, 'main.js')
    const end = last(data.frames)
    expect(stdout).toEqual(end.output)
    expect(stderr).toContain(end.error!)
  })

  it('esm-live-binding: phases go construct → link → evaluate, dependency evaluated first', () => {
    const frames = moduleGraphScenarios['esm-live-binding']!.frames
    const order = ['construct', 'link', 'evaluate']
    const phases = frames.map((f) => order.indexOf(f.phase!))
    expect(phases).toEqual([...phases].sort((a, b) => a - b))
    const firstEval = frames.find((f) => f.phase === 'evaluate')!
    expect(firstEval.lanes[0]!.boxes.find((b) => b.id === 'counter')!.order).toBe(1)
  })

  it('cjs-vs-esm: CommonJS copy stays 0, require is cached, ESM binding sees 1', () => {
    const data = moduleGraphScenarios['cjs-vs-esm']!
    const dir = join(tmp, 'mixed')
    mkdirSync(dir, { recursive: true })
    for (const [name, src] of Object.entries(splitFiles(data.code))) writeFileSync(join(dir, name), src)
    const cjs = runNode(dir, 'main.cjs')
    const esm = runNode(dir, 'main.mjs')
    const end = last(data.frames).output
    expect(cjs.stdout).toEqual(end.filter((l) => l.startsWith('main.cjs: ')).map((l) => l.slice('main.cjs: '.length)))
    expect(esm.stdout).toEqual(end.filter((l) => l.startsWith('main.mjs: ')).map((l) => l.slice('main.mjs: '.length)))
  })
})

describe('worker-messaging matches structured clone', () => {
  it('postMessage sends a snapshot: later mutation is not seen by the receiver', async () => {
    const { port1, port2 } = new MessageChannel()
    const job = { nums: [1, 2, 3] }
    const received = new Promise<{ nums: number[] }>((resolve) => port2.once('message', resolve))
    port1.postMessage(job)
    job.nums.push(4)
    const copy = await received
    expect(copy.nums).toEqual([1, 2, 3])
    expect(copy.nums.reduce((a, b) => a + b, 0)).toBe(6)
    port1.close()
    port2.close()
  })

  it('functions are not cloneable → DataCloneError', () => {
    let error: unknown = null
    try {
      structuredClone({ cb() {} })
    } catch (e) {
      error = e
    }
    expect(error).toBeInstanceOf(DOMException)
    expect((error as DOMException).name).toBe('DataCloneError')
    const pmFrames = workerMessagingScenarios.postmessage!.frames
    expect(last(pmFrames).log.some((l) => l.error && l.text.startsWith('DataCloneError'))).toBe(true)
    expect(last(pmFrames).log.some((l) => l.text === 'сума: 6')).toBe(true)
  })

  it('clone keeps the original, transfer detaches it', () => {
    const buf = new ArrayBuffer(8 * MB)
    const copy = structuredClone(buf)
    expect(buf.byteLength).toBe(8388608)
    expect(copy.byteLength).toBe(8388608)
    const view = new Uint8Array(buf)
    const moved = structuredClone(buf, { transfer: [buf] })
    expect(buf.byteLength).toBe(0)
    expect(view.length).toBe(0)
    expect(buf.detached).toBe(true)
    expect(moved.byteLength).toBe(8388608)
    expect(() => new Uint8Array(buf)).toThrow(TypeError)

    const tr = workerMessagingScenarios.transfer!.frames
    const mainLogs = last(tr)
      .log.filter((l) => l.from === 'main' && !l.error)
      .map((l) => l.text)
    expect(mainLogs).toEqual([String(8 * MB), '0'])
    expect(last(tr).log.filter((l) => l.from === 'worker').map((l) => l.text)).toEqual([String(8 * MB), String(8 * MB)])
  })

  it('transfer over a real MessagePort detaches the sender buffer', async () => {
    const { port1, port2 } = new MessageChannel()
    const buf = new ArrayBuffer(1024)
    const received = new Promise<ArrayBuffer>((resolve) => port2.once('message', resolve))
    port1.postMessage(buf, [buf])
    expect(buf.byteLength).toBe(0)
    expect((await received).byteLength).toBe(1024)
    port1.close()
    port2.close()
  })
})

describe('xss scenario', () => {
  const frames = xssScenarios['dom-sink']!.frames

  it('the URL really decodes to the payload', () => {
    const url = new URL(`https://shop.example/search?q=${encodeURIComponent(PAYLOAD)}`)
    expect(url.search).toContain('%3Cimg')
    expect(new URLSearchParams(url.search).get('q')).toBe(PAYLOAD)
    expect(codeLines(xssScenarios['dom-sink']!.code)[0]).toContain(PAYLOAD)
  })

  it('innerHTML builds a live onerror; textContent keeps one text node; sanitizers drop onerror', () => {
    const attrs = (f: (typeof frames)[number]) => (f.tree ?? []).flatMap((n) => n.attrs ?? [])
    const bySink = (name: string) => frames.filter((f) => f.sink?.name === name && f.query === PAYLOAD)
    expect(bySink('innerHTML').every((f) => attrs(f).some((a) => a.name === 'onerror' && a.danger))).toBe(true)
    expect(frames.some((f) => f.alert)).toBe(true)
    for (const f of bySink('textContent')) {
      expect(f.tree).toHaveLength(1)
      expect(f.tree![0]!.tag).toBe('#text')
      expect(f.tree![0]!.text).toContain(PAYLOAD)
    }
    for (const name of ['DOMPurify', 'setHTML']) {
      for (const f of bySink(name)) expect(attrs(f).find((a) => a.name === 'onerror')?.removed).toBe(true)
    }
    // the string assignment under Trusted Types inserts nothing
    const blocked = frames.find((f) => f.sink?.tone === 'blocked')!
    expect(blocked.tree).toBeNull()
    expect(blocked.error).toMatch(/^TypeError/)
    // alert only ever happens through the innerHTML sink
    expect(frames.filter((f) => f.alert).every((f) => f.sink?.name === 'innerHTML')).toBe(true)
  })
})
