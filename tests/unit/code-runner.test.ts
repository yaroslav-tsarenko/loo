import { loadBindings, minify } from 'next/dist/build/swc/index.js'
import { describe, expect, it } from 'vitest'
import { runSuite, type HarnessHost, type RunEvent, type RunReport } from '@/ui/code/harness'
import { HARNESS_UK } from '@/ui/code/harness-text'

const host: HarnessHost = {
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (id) => clearTimeout(id as NodeJS.Timeout),
  setInterval: (fn, ms) => setInterval(fn, ms),
  clearInterval: (id) => clearInterval(id as NodeJS.Timeout),
  now: () => Date.now(),
}

function run(code: string, tests: string, events?: RunEvent[]) {
  return runSuite(code, tests, (e) => events?.push(e), host, 300)
}

const byName = (report: RunReport) => Object.fromEntries(report.tests.map((t) => [t.name, t]))

describe('runSuite: expect API', () => {
  it('passes and fails matchers with expected/received', async () => {
    const report = await run(
      'function sum(a, b) { return a + b }',
      `
      test('toBe', () => expect(sum(1, 2)).toBe(3))
      test('toBe fails', () => expect(sum(1, 2)).toBe(4))
      test('toEqual deep', () => expect({ a: [1, { b: new Map([[1, 2]]) }], u: undefined }).toEqual({ a: [1, { b: new Map([[1, 2]]) }] }))
      test('toBe on objects hints toEqual', () => expect({ a: 1 }).toBe({ a: 1 }))
      test('not', () => { expect(1).not.toBe(2); expect([1, 2]).not.toContain(3) })
      test('truthy/falsy', () => { expect(1).toBeTruthy(); expect('').toBeFalsy() })
      test('contain/length/close', () => { expect('hello').toContain('ell'); expect([1, 2, 3]).toHaveLength(3); expect(0.1 + 0.2).toBeCloseTo(0.3) })
      test('toThrow', () => { expect(() => { throw new TypeError('boom here') }).toThrow('boom'); expect(() => JSON.parse('{')).toThrow(SyntaxError); expect(() => 1).not.toThrow() })
      test('toThrow fails', () => expect(() => 1).toThrow())
      test('resolves/rejects', async () => { await expect(Promise.resolve(5)).resolves.toBe(5); await expect(Promise.reject(new Error('nope'))).rejects.toThrow('nope') })
      test('mocks', () => { const f = vi.fn((x) => x * 2); f(2); f(3); expect(f).toHaveBeenCalledTimes(2); expect(f).toHaveBeenCalledWith(3); expect(f.mock.results).toEqual([4, 6]) })
      describe('group', () => { test('nested', () => expect(true).toBe(true)) })
    `,
    )
    const t = byName(report)
    expect(report.status).toBe('failed')
    expect(t['toBe']!.ok).toBe(true)
    expect(t['toBe fails']).toMatchObject({ ok: false, expected: '4', received: '3' })
    expect(t['toEqual deep']!.ok).toBe(true)
    expect(t['toBe on objects hints toEqual']!.error).toContain('toEqual')
    for (const name of ['not', 'truthy/falsy', 'contain/length/close', 'toThrow', 'resolves/rejects', 'mocks', 'group › nested']) expect(t[name]?.ok, name).toBe(true)
    expect(t['toThrow fails']).toMatchObject({ ok: false, received: 'функція нічого не кинула' })
  })

  it('captures console output with formatting', async () => {
    const report = await run('console.log("top", { a: [1, "x"] })', 'test("t", () => { console.warn(new Map([[1, 2]])); console.error(new Error("e")) })')
    expect(report.logs).toEqual([
      { level: 'log', text: 'top { a: [1, "x"] }' },
      { level: 'warn', text: 'Map(1) { 1 => 2 }' },
      { level: 'error', text: 'Error: e' },
    ])
  })

  it('reports syntax and runtime errors separately', async () => {
    expect((await run('function (', 'test("a", () => {})')).error).toMatch(/у твоєму коді/)
    expect((await run('', 'test("a", () => {')).error).toMatch(/в тестах/)
    expect((await run('null.x', 'test("a", () => {})')).error).toMatch(/впав під час запуску.*TypeError/)
    expect((await run('', 'const x = 1')).error).toMatch(/жодного test/)
  })

  it('lets tests redeclare names and see learner declarations', async () => {
    const report = await run('const x = 1\nlet seen = []\nfunction add(v) { seen.push(v); return seen }', 'const x = 2\ntest("scope", () => { expect(add(x)).toEqual([2]) })')
    expect(report.status).toBe('passed')
  })

  it('fails a hanging async test without killing the run', async () => {
    const report = await run('', 'test("hang", () => new Promise(() => {}))\ntest("next", () => {})')
    expect(report.tests.map((t) => t.ok)).toEqual([false, true])
    expect(report.tests[0]!.error).toMatch(/не завершився/)
  })

  it('streams start/test events', async () => {
    const events: RunEvent[] = []
    await run('', 'test("a", () => {})', events)
    expect(events.map((e) => e.type)).toEqual(['start', 'test'])
  })
})

describe('runSuite: fake timers', () => {
  const debounce = `
    function debounce(fn, ms) {
      let t
      return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms) }
    }`

  it('advances setTimeout / setInterval / Date.now on a manual clock', async () => {
    const report = await run(
      debounce,
      `
      test('debounce', () => {
        vi.useFakeTimers()
        const f = vi.fn()
        const d = debounce(f, 100)
        d(1); vi.advanceTimersByTime(50); d(2); vi.advanceTimersByTime(99)
        expect(f).toHaveBeenCalledTimes(0)
        vi.advanceTimersByTime(1)
        expect(f).toHaveBeenCalledTimes(1)
        expect(f).toHaveBeenCalledWith(2)
      })
      test('interval + Date.now', () => {
        vi.useFakeTimers()
        const start = Date.now()
        const ticks = []
        const id = setInterval(() => ticks.push(Date.now() - start), 10)
        vi.advanceTimersByTime(35)
        clearInterval(id)
        vi.advanceTimersByTime(100)
        expect(ticks).toEqual([10, 20, 30])
        expect(Date.now() - start).toBe(135)
        expect(new Date().getTime()).toBe(Date.now())
        expect(new Date(0).getTime()).toBe(0)
        expect(new Date() instanceof Date).toBe(true)
      })
      test('order of equal timers + nested', () => {
        vi.useFakeTimers()
        const log = []
        setTimeout(() => { log.push('a'); setTimeout(() => log.push('c'), 0) }, 5)
        setTimeout(() => log.push('b'), 5)
        vi.runAllTimers()
        expect(log).toEqual(['a', 'b', 'c'])
        expect(vi.getTimerCount()).toBe(0)
      })
      test('runaway interval is caught', () => {
        vi.useFakeTimers()
        setInterval(() => {}, 1)
        expect(() => vi.runAllTimers()).toThrow('нескінченний')
      })
      test('fake timers reset between tests', () => {
        let fired = false
        setTimeout(() => { fired = true }, 0)
        return sleep(20).then(() => expect(fired).toBe(true))
      })
    `,
    )
    for (const t of report.tests) expect(t.ok, `${t.name}: ${t.error}`).toBe(true)
  })

  it('attributes errors thrown inside real timers to the running test', async () => {
    const report = await run('', 'test("boom", async () => { setTimeout(() => { throw new Error("late") }, 0); await sleep(10) })')
    expect(report.tests[0]).toMatchObject({ ok: false, error: 'late' })
  })
})

describe('worker source', () => {
  it('survives SWC minification (it is serialized with toString)', async () => {
    await loadBindings()
    const { code } = await minify(`globalThis.run = ${runSuite.toString()}`, { compress: true, mangle: true })
    const factory = new Function(`${code.replace('globalThis.run=', 'const run=')}; return run`) as () => typeof runSuite
    // the worker always passes the texts (the default would reference a module binding)
    const report = await factory()('const sq = (x) => x * x', 'test("sq", () => expect(sq(3)).toBe(9))', () => {}, host, 1500, HARNESS_UK)
    expect(report.status).toBe('passed')
  })
})
