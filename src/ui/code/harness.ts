// Test harness for learner code. `runSuite` is serialized with Function#toString into a Blob worker,
// so it must stay fully self-contained: no imports, no module-level values, no references outside its body.

export type LogLevel = 'log' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  text: string
}

export interface TestResult {
  name: string
  ok: boolean
  error?: string
  expected?: string
  received?: string
  ms: number
}

export type RunEvent = { type: 'start'; name: string } | { type: 'test'; result: TestResult } | { type: 'log'; entry: LogEntry }

export interface RunReport {
  status: 'passed' | 'failed' | 'error' | 'timeout'
  tests: TestResult[]
  logs: LogEntry[]
  error: string | null
  ms: number
}

export interface HarnessHost {
  setTimeout: (fn: () => void, ms: number) => unknown
  clearTimeout: (id: unknown) => void
  setInterval: (fn: () => void, ms: number) => unknown
  clearInterval: (id: unknown) => void
  now: () => number
}

export async function runSuite(code: string, tests: string, emit: (event: RunEvent) => void, host: HarnessHost, testTimeoutMs = 1500): Promise<RunReport> {
  type Fn = (...args: unknown[]) => unknown
  type Mock = Fn & { mock: { calls: unknown[][]; results: unknown[] }; __mock: true }
  interface Timer {
    id: number
    at: number
    seq: number
    every: number | null
    fn: Fn
    args: unknown[]
  }
  // expected/received are values (formatted); *Text are ready-made descriptions
  interface Check {
    pass: boolean
    expected?: unknown
    received?: unknown
    expectedText?: string
    receivedText?: string
    hint?: string
  }
  type Failure = Error & { expected?: string; received?: string }

  const started = host.now()
  const logs: LogEntry[] = []
  const results: TestResult[] = []
  const MAX_LOGS = 200

  // ---------- formatting
  const fmt = (value: unknown, quote = true, depth = 0, seen: object[] = []): string => {
    if (typeof value === 'string') return quote ? JSON.stringify(value) : value
    if (typeof value === 'number') return Object.is(value, -0) ? '-0' : String(value)
    if (typeof value === 'bigint') return `${value}n`
    if (typeof value === 'symbol') return value.toString()
    if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`
    if (value === null || typeof value !== 'object') return String(value)
    if (seen.includes(value)) return '[Circular]'
    const next = [...seen, value]
    const inner = (v: unknown) => fmt(v, true, depth + 1, next)
    if (value instanceof Error) return `${value.name}: ${value.message}`
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString()
    if (value instanceof RegExp) return String(value)
    if (value instanceof Promise) return 'Promise {…}'
    if (depth > 3) return Array.isArray(value) ? '[Array]' : '[Object]'
    if (Array.isArray(value)) {
      const items = value.slice(0, 50).map(inner)
      if (value.length > 50) items.push(`…ще ${value.length - 50}`)
      return `[${items.join(', ')}]`
    }
    if (value instanceof Map) return `Map(${value.size}) {${[...value].slice(0, 30).map(([k, v]) => ` ${inner(k)} => ${inner(v)}`).join(',')} }`
    if (value instanceof Set) return `Set(${value.size}) {${[...value].slice(0, 30).map((v) => ` ${inner(v)}`).join(',')} }`
    const proto = Object.getPrototypeOf(value) as { constructor?: { name?: string } } | null
    const name = proto && proto !== Object.prototype ? proto.constructor?.name ?? '' : ''
    const keys = Object.keys(value)
    const body = keys.slice(0, 30).map((k) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${inner((value as Record<string, unknown>)[k])}`)
    if (keys.length > 30) body.push('…')
    return `${name ? `${name} ` : ''}{${body.length ? ` ${body.join(', ')} ` : ''}}`
  }

  const errorText = (e: unknown): string => {
    if (e instanceof Error) return e.name === 'AssertionError' || e.name === 'Error' ? e.message : `${e.name}: ${e.message}`
    return `Кинуто не Error: ${fmt(e)}`
  }

  // ---------- console
  const write =
    (level: LogLevel) =>
    (...args: unknown[]) => {
      if (logs.length > MAX_LOGS) return
      const entry: LogEntry = logs.length === MAX_LOGS ? { level: 'warn', text: '… вивід обрізано' } : { level, text: args.map((a) => fmt(a, false)).join(' ').slice(0, 2000) }
      logs.push(entry)
      emit({ type: 'log', entry })
    }
  const sandboxConsole = { log: write('log'), info: write('info'), debug: write('log'), table: write('log'), dir: write('log'), warn: write('warn'), error: write('error') }

  // ---------- timers: real ones are wrapped, fake ones live on a manual clock
  let uncaught: unknown = null
  const report = (e: unknown) => {
    if (uncaught === null) uncaught = e
    sandboxConsole.error(`Помилка в таймері: ${errorText(e)}`)
  }
  const realHandles = new Set<unknown>()
  const clock = { fake: false, now: 0, base: 0, seq: 0, nextId: 1_000_000_000, timers: new Map<number, Timer>() }
  const addTimer = (fn: unknown, ms: unknown, args: unknown[], repeat: boolean): number => {
    if (typeof fn !== 'function') throw new TypeError('Колбек таймера має бути функцією')
    const delay = Math.max(0, Number(ms) || 0)
    const id = clock.nextId++
    clock.timers.set(id, { id, at: clock.now + delay, seq: clock.seq++, every: repeat ? Math.max(1, delay) : null, fn: fn as Fn, args })
    return id
  }
  const earliest = (limit: number): Timer | null => {
    let best: Timer | null = null
    for (const t of clock.timers.values()) if (t.at <= limit && (!best || t.at < best.at || (t.at === best.at && t.seq < best.seq))) best = t
    return best
  }
  const fire = (t: Timer) => {
    clock.now = t.at
    if (t.every !== null) {
      t.at += t.every
      t.seq = clock.seq++
    } else clock.timers.delete(t.id)
    t.fn(...t.args)
  }
  const sandboxSetTimeout = (fn: unknown, ms?: unknown, ...args: unknown[]) => {
    if (clock.fake) return addTimer(fn, ms, args, false)
    if (typeof fn !== 'function') throw new TypeError('Колбек таймера має бути функцією')
    const handle = host.setTimeout(() => {
      realHandles.delete(handle)
      try {
        ;(fn as Fn)(...args)
      } catch (e) {
        report(e)
      }
    }, Number(ms) || 0)
    realHandles.add(handle)
    return handle
  }
  const sandboxSetInterval = (fn: unknown, ms?: unknown, ...args: unknown[]) => {
    if (clock.fake) return addTimer(fn, ms, args, true)
    if (typeof fn !== 'function') throw new TypeError('Колбек таймера має бути функцією')
    const handle = host.setInterval(() => {
      try {
        ;(fn as Fn)(...args)
      } catch (e) {
        report(e)
      }
    }, Math.max(1, Number(ms) || 0))
    realHandles.add(handle)
    return handle
  }
  const sandboxClear = (id: unknown) => {
    if (typeof id === 'number' && clock.timers.delete(id)) return
    if (realHandles.delete(id)) {
      host.clearTimeout(id)
      host.clearInterval(id)
    }
  }

  const RealDate = Date
  const currentTime = () => (clock.fake ? clock.now : RealDate.now())
  const SandboxDate = function (this: unknown, ...args: unknown[]) {
    if (!new.target) return new RealDate(currentTime()).toString()
    return args.length === 0 ? new RealDate(currentTime()) : Reflect.construct(RealDate, args)
  } as unknown as DateConstructor
  Object.defineProperty(SandboxDate, 'prototype', { value: RealDate.prototype })
  Object.assign(SandboxDate, { now: currentTime, parse: RealDate.parse, UTC: RealDate.UTC })
  const sandboxPerformance = { now: () => (clock.fake ? clock.now - clock.base : host.now() - started) }

  const resetClock = () => {
    clock.fake = false
    clock.timers.clear()
  }

  const vi = {
    useFakeTimers: () => {
      if (!clock.fake) {
        clock.fake = true
        clock.now = RealDate.now()
        clock.base = clock.now
        clock.timers.clear()
      }
      return vi
    },
    useRealTimers: () => {
      resetClock()
      return vi
    },
    advanceTimersByTime: (ms: number) => {
      if (!clock.fake) throw new Error('Спершу виклич vi.useFakeTimers()')
      const target = clock.now + Math.max(0, Number(ms) || 0)
      let guard = 0
      for (let t = earliest(target); t; t = earliest(target)) {
        if (++guard > 100_000) throw new Error('Забагато спрацювань таймерів — нескінченний setInterval?')
        fire(t)
      }
      clock.now = target
      return vi
    },
    runAllTimers: () => {
      if (!clock.fake) throw new Error('Спершу виклич vi.useFakeTimers()')
      let guard = 0
      for (let t = earliest(Infinity); t; t = earliest(Infinity)) {
        if (++guard > 10_000) throw new Error('runAllTimers: понад 10 000 спрацювань — нескінченний setInterval?')
        fire(t)
      }
      return vi
    },
    getTimerCount: () => clock.timers.size,
    setSystemTime: (time: number | Date) => {
      if (!clock.fake) throw new Error('Спершу виклич vi.useFakeTimers()')
      clock.now = typeof time === 'number' ? time : time.getTime()
      return vi
    },
    fn: (impl?: Fn): Mock => {
      let current = impl
      const mock = { calls: [] as unknown[][], results: [] as unknown[] }
      const f = function (this: unknown, ...args: unknown[]) {
        mock.calls.push(args)
        const value = current ? current.apply(this, args) : undefined
        mock.results.push(value)
        return value
      } as Mock
      Object.assign(f, {
        mock,
        __mock: true,
        mockImplementation: (next: Fn) => {
          current = next
          return f
        },
        mockReturnValue: (value: unknown) => {
          current = () => value
          return f
        },
      })
      return f
    },
  }

  const sleep = (ms: number) => new Promise<void>((resolve) => host.setTimeout(resolve, Math.max(0, Number(ms) || 0)))

  // ---------- expect
  const equals = (a: unknown, b: unknown, seen: unknown[][] = []): boolean => {
    if (Object.is(a, b)) return true
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
    if (seen.some(([x, y]) => x === a && y === b)) return true
    const pairs = [...seen, [a, b]]
    if (Array.isArray(a) !== Array.isArray(b)) return false
    if (a instanceof Date || b instanceof Date) return a instanceof Date && b instanceof Date && Object.is(a.getTime(), b.getTime())
    if (a instanceof RegExp || b instanceof RegExp) return String(a) === String(b)
    if (a instanceof Map || b instanceof Map) {
      if (!(a instanceof Map && b instanceof Map) || a.size !== b.size) return false
      for (const [k, v] of a) if (!b.has(k) || !equals(v, b.get(k), pairs)) return false
      return true
    }
    if (a instanceof Set || b instanceof Set) {
      if (!(a instanceof Set && b instanceof Set) || a.size !== b.size) return false
      for (const v of a) if (!b.has(v) && ![...b].some((w) => equals(v, w, pairs))) return false
      return true
    }
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => equals(v, b[i], pairs))
    const ra = a as Record<string, unknown>
    const rb = b as Record<string, unknown>
    // like vitest toEqual: keys with undefined values are ignored
    const ka = Object.keys(ra).filter((k) => ra[k] !== undefined)
    const kb = Object.keys(rb).filter((k) => rb[k] !== undefined)
    return ka.length === kb.length && ka.every((k) => Object.prototype.hasOwnProperty.call(rb, k) && equals(ra[k], rb[k], pairs))
  }

  const isMock = (v: unknown): v is Mock => typeof v === 'function' && (v as Partial<Mock>).__mock === true
  const needMock = (v: unknown): Mock => {
    if (!isMock(v)) throw new TypeError('Очікували функцію з vi.fn()')
    return v
  }
  const needNumber = (v: unknown, what: string): number => {
    if (typeof v !== 'number' && typeof v !== 'bigint') throw new TypeError(`${what}: очікували число, отримали ${fmt(v)}`)
    return Number(v)
  }
  const throwMatches = (err: unknown, expected: unknown): Check => {
    if (expected === undefined) return { pass: true, received: err }
    const message = err instanceof Error ? err.message : String(err)
    if (typeof expected === 'string') return { pass: message.includes(expected), expectedText: `помилка з текстом ${fmt(expected)}`, received: err }
    if (expected instanceof RegExp) return { pass: expected.test(message), expectedText: `помилка, що відповідає ${String(expected)}`, received: err }
    if (typeof expected === 'function') return { pass: err instanceof (expected as new () => unknown), expectedText: `помилка типу ${(expected as Fn).name}`, received: err }
    if (expected instanceof Error) return { pass: message === expected.message, expected, received: err }
    return { pass: false, hint: 'toThrow приймає рядок, RegExp, клас помилки або Error' }
  }

  const matchers: Record<string, (received: unknown, args: unknown[], rejected: boolean) => Check> = {
    toBe: (r, [e]) => ({ pass: Object.is(r, e), expected: e, received: r, hint: !Object.is(r, e) && equals(r, e) ? 'Значення рівні за вмістом, але це різні об’єкти — порівнюй через toEqual' : undefined }),
    toEqual: (r, [e]) => ({ pass: equals(r, e), expected: e, received: r }),
    toStrictEqual: (r, [e]) => ({ pass: equals(r, e) && fmt(r) === fmt(e), expected: e, received: r }),
    toBeTruthy: (r) => ({ pass: Boolean(r), expectedText: 'truthy-значення', received: r }),
    toBeFalsy: (r) => ({ pass: !r, expectedText: 'falsy-значення', received: r }),
    toBeNull: (r) => ({ pass: r === null, expected: null, received: r }),
    toBeUndefined: (r) => ({ pass: r === undefined, expected: undefined, received: r }),
    toBeDefined: (r) => ({ pass: r !== undefined, expectedText: 'будь-що, крім undefined', received: r }),
    toBeNaN: (r) => ({ pass: Number.isNaN(r), expected: NaN, received: r }),
    toBeGreaterThan: (r, [e]) => ({ pass: needNumber(r, 'toBeGreaterThan') > needNumber(e, 'toBeGreaterThan'), expectedText: `> ${fmt(e)}`, received: r }),
    toBeGreaterThanOrEqual: (r, [e]) => ({ pass: needNumber(r, 'toBeGreaterThanOrEqual') >= needNumber(e, 'toBeGreaterThanOrEqual'), expectedText: `>= ${fmt(e)}`, received: r }),
    toBeLessThan: (r, [e]) => ({ pass: needNumber(r, 'toBeLessThan') < needNumber(e, 'toBeLessThan'), expectedText: `< ${fmt(e)}`, received: r }),
    toBeLessThanOrEqual: (r, [e]) => ({ pass: needNumber(r, 'toBeLessThanOrEqual') <= needNumber(e, 'toBeLessThanOrEqual'), expectedText: `<= ${fmt(e)}`, received: r }),
    toBeCloseTo: (r, [e, digits]) => {
      const precision = typeof digits === 'number' ? digits : 2
      return { pass: Math.abs(needNumber(r, 'toBeCloseTo') - needNumber(e, 'toBeCloseTo')) < 10 ** -precision / 2, expectedText: `≈ ${fmt(e)} (точність ${precision})`, received: r }
    },
    toContain: (r, [e]) => {
      if (typeof r === 'string') return { pass: r.includes(String(e)), expectedText: `рядок, що містить ${fmt(e)}`, received: r }
      if (r && typeof (r as Iterable<unknown>)[Symbol.iterator] === 'function') return { pass: [...(r as Iterable<unknown>)].some((v) => Object.is(v, e)), expectedText: `колекція з ${fmt(e)}`, received: r }
      throw new TypeError(`toContain: очікували рядок або масив, отримали ${fmt(r)}`)
    },
    toHaveLength: (r, [n]) => {
      const length = r !== null && r !== undefined ? (r as { length?: unknown }).length : undefined
      return { pass: length === n, expectedText: `length ${fmt(n)}`, receivedText: typeof length === 'number' ? `length ${length}: ${fmt(r)}` : fmt(r) }
    },
    toMatch: (r, [e]) => {
      if (typeof r !== 'string') throw new TypeError(`toMatch: очікували рядок, отримали ${fmt(r)}`)
      return { pass: e instanceof RegExp ? e.test(r) : r.includes(String(e)), expected: e, received: r }
    },
    toBeInstanceOf: (r, [C]) => ({ pass: typeof C === 'function' && r instanceof (C as new () => unknown), expectedText: `екземпляр ${(C as Fn | undefined)?.name ?? '?'}`, received: r }),
    toThrow: (r, [e], rejected) => {
      if (rejected) return throwMatches(r, e)
      if (typeof r !== 'function') throw new TypeError('toThrow: передай функцію — expect(() => f()).toThrow()')
      try {
        ;(r as Fn)()
      } catch (err) {
        return throwMatches(err, e)
      }
      return { pass: false, expectedText: e === undefined ? 'кинуту помилку' : fmt(e), receivedText: 'функція нічого не кинула' }
    },
    toHaveBeenCalled: (r) => ({ pass: needMock(r).mock.calls.length > 0, expectedText: 'хоча б один виклик', receivedText: `викликів: ${needMock(r).mock.calls.length}` }),
    toHaveBeenCalledTimes: (r, [n]) => ({ pass: needMock(r).mock.calls.length === n, expectedText: `викликів: ${fmt(n)}`, receivedText: `викликів: ${needMock(r).mock.calls.length}` }),
    toHaveBeenCalledWith: (r, args) => ({ pass: needMock(r).mock.calls.some((c) => equals(c, args)), expected: args, received: needMock(r).mock.calls }),
  }
  matchers.toThrowError = matchers.toThrow!
  matchers.toBeCalled = matchers.toHaveBeenCalled!
  matchers.toBeCalledTimes = matchers.toHaveBeenCalledTimes!

  const verdict = (name: string, check: Check, negate: boolean, args: unknown[]) => {
    if (check.pass !== negate) return
    const shown = args.map((a) => fmt(a)).join(', ')
    const err = new Error(`expect(отримане).${negate ? 'not.' : ''}${name}(${shown.length > 60 ? '…' : shown})${check.hint && !negate ? ` — ${check.hint}` : ''}`) as Failure
    err.name = 'AssertionError'
    const expected = check.expectedText ?? ('expected' in check ? fmt(check.expected) : undefined)
    const received = check.receivedText ?? ('received' in check ? fmt(check.received) : undefined)
    if (expected !== undefined) err.expected = `${negate ? 'не ' : ''}${expected}`
    if (received !== undefined) err.received = received
    throw err
  }

  const build = (negate: boolean, apply: (name: string, args: unknown[], negate: boolean) => unknown): Record<string, unknown> => {
    const api: Record<string, unknown> = {}
    for (const name of Object.keys(matchers)) api[name] = (...args: unknown[]) => apply(name, args, negate)
    return api
  }

  const expect = (received: unknown) => {
    const sync = (name: string, args: unknown[], negate: boolean) => verdict(name, matchers[name]!(received, args, false), negate, args)
    const settle = (mode: 'resolves' | 'rejects') => (name: string, args: unknown[], negate: boolean) =>
      Promise.resolve(received).then(
        (value) => {
          if (mode === 'rejects') verdict(name, { pass: false, expectedText: 'відхилений проміс', receivedText: `resolve(${fmt(value)})` }, false, args)
          else verdict(name, matchers[name]!(value, args, false), negate, args)
        },
        (reason) => {
          if (mode === 'resolves') verdict(name, { pass: false, expectedText: 'виконаний проміс', receivedText: `reject(${errorText(reason)})` }, false, args)
          else verdict(name, matchers[name]!(reason, args, true), negate, args)
        },
      )
    const api = build(false, sync)
    api.not = build(true, sync)
    api.resolves = { ...build(false, settle('resolves')), not: build(true, settle('resolves')) }
    api.rejects = { ...build(false, settle('rejects')), not: build(true, settle('rejects')) }
    return api
  }

  // ---------- registration + compile
  const registered: { name: string; fn: Fn }[] = []
  const prefix: string[] = []
  const test = (name: unknown, fn: unknown) => {
    if (typeof fn !== 'function') throw new TypeError(`test(${fmt(name)}): другий аргумент має бути функцією`)
    registered.push({ name: [...prefix, String(name)].join(' › '), fn: fn as Fn })
  }
  const describe = (name: unknown, fn: unknown) => {
    prefix.push(String(name))
    try {
      if (typeof fn === 'function') (fn as Fn)()
    } finally {
      prefix.pop()
    }
  }

  const finish = (status: RunReport['status'], error: string | null): RunReport => {
    resetClock()
    for (const h of realHandles) {
      host.clearTimeout(h)
      host.clearInterval(h)
    }
    realHandles.clear()
    return { status, tests: results, logs, error, ms: host.now() - started }
  }

  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (...args: string[]) => Fn
  const SANDBOX = ['console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date', 'performance']
  const API = ['test', 'it', 'describe', 'expect', 'vi', 'sleep']
  // V8 reports an unclosed { as "Unexpected token ')'" (the Function wrapper) — say it plainly
  const braceHint = (src: string) => {
    const open = (src.match(/[{([]/g) ?? []).length
    const close = (src.match(/[})\]]/g) ?? []).length
    return open > close ? ' — схоже, не закрита дужка' : open < close ? ' — схоже, зайва закривна дужка' : ''
  }
  try {
    new AsyncFunction(...SANDBOX, `"use strict";\n${code}`)
  } catch (e) {
    return finish('error', `Синтаксична помилка у твоєму коді: ${errorText(e)}${braceHint(code)}`)
  }
  try {
    new AsyncFunction(...API, `"use strict";\n${tests}`)
  } catch (e) {
    return finish('error', `Синтаксична помилка в тестах: ${errorText(e)}${braceHint(tests)}`)
  }
  // Learner code runs first; tests live in an inner function so they see its declarations
  // but their own names (and the test API) shadow instead of clashing.
  let register: Fn
  try {
    const outer = new AsyncFunction(...SANDBOX, `"use strict";\n${code}\n;return async function (${API.join(', ')}) {\n${tests}\n}`)
    register = (await outer(sandboxConsole, sandboxSetTimeout, sandboxClear, sandboxSetInterval, sandboxClear, SandboxDate, sandboxPerformance)) as Fn
  } catch (e) {
    return finish('error', `Твій код впав під час запуску: ${errorText(e)}`)
  }
  try {
    await register(test, test, describe, expect, vi, sleep)
  } catch (e) {
    return finish('error', `Тести впали до запуску: ${errorText(e)}`)
  }
  if (registered.length === 0) return finish('error', 'У тестах немає жодного test(…)')

  for (const t of registered) {
    emit({ type: 'start', name: t.name })
    const t0 = host.now()
    uncaught = null
    let result: TestResult
    try {
      const value = t.fn()
      if (value && typeof (value as Promise<unknown>).then === 'function') {
        let timer: unknown
        try {
          await Promise.race([
            value,
            new Promise((_, reject) => {
              timer = host.setTimeout(() => reject(new Error(`Тест не завершився за ${testTimeoutMs} мс — забутий await, resolve чи vi.advanceTimersByTime?`)), testTimeoutMs)
            }),
          ])
        } finally {
          host.clearTimeout(timer)
        }
      }
      if (uncaught !== null) throw uncaught
      result = { name: t.name, ok: true, ms: host.now() - t0 }
    } catch (e) {
      const failure = e as Partial<Failure>
      result = { name: t.name, ok: false, error: errorText(e), ms: host.now() - t0 }
      if (typeof failure?.expected === 'string') result.expected = failure.expected
      if (typeof failure?.received === 'string') result.received = failure.received
    }
    // fake timers never leak into the next test
    resetClock()
    results.push(result)
    emit({ type: 'test', result })
  }
  return finish(results.every((r) => r.ok) ? 'passed' : 'failed', null)
}
