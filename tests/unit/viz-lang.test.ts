import { describe, expect, it } from 'vitest'
import { codeLines, type StepScenario, type Token } from '@/ui/viz/engine/types'
import { FLOAT_PRESETS, decompose, evaluate, exactDecimal, nextDown, nextUp, toBits, ulpDistance, ulpPower } from '@/ui/viz/float-precision/ieee754'
import { hiddenClassScenarios } from '@/ui/viz/hidden-classes/scenarios'
import { countSteps, parse, run } from '@/ui/viz/regex-engine/matcher'
import { REGEX_EXAMPLES, buildRegexScenario, explosionTable } from '@/ui/viz/regex-engine/scenarios'
import { tc39Scenarios } from '@/ui/viz/tc39-stages/scenarios'
import { UNICODE_PRESETS, analyze } from '@/ui/viz/unicode-string/analyze'

const scenarios: Array<{ name: string; data: StepScenario }> = [
  ...Object.entries(hiddenClassScenarios).map(([id, data]) => ({ name: `hidden-classes/${id}`, data })),
  ...Object.entries(tc39Scenarios).map(([id, data]) => ({ name: `tc39-stages/${id}`, data })),
  ...REGEX_EXAMPLES.map((e) => ({ name: `regex-engine/backtracking:${e.id}`, data: buildRegexScenario(e.id) })),
]

describe('lang viz scenarios', () => {
  it.each(scenarios)('$name: frames are well-formed', ({ data }) => {
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
        if (Array.isArray(value) && value.length > 0 && value.every((v) => v && typeof v === 'object' && 'id' in v && 'label' in v)) {
          const ids = (value as Token[]).map((t) => t.id)
          expect(new Set(ids).size).toBe(ids.length)
        }
      }
    }
  })

  it('regex traces are capped and end with the verdict', () => {
    for (const e of REGEX_EXAMPLES) {
      const s = buildRegexScenario(e.id)
      expect(s.frames.length).toBeLessThanOrEqual(61)
      const last = s.frames.at(-1)!
      expect(['success', 'no-match']).toContain(last.kind)
      // step counter never goes backwards
      for (let i = 1; i < s.frames.length; i++) expect(s.frames[i]!.step).toBeGreaterThan(s.frames[i - 1]!.step)
    }
    expect(buildRegexScenario('catastrophic').frames.some((f) => f.kind === 'skip')).toBe(true)
  })
})

describe('float-precision: IEEE 754 bits', () => {
  it('reads bits through DataView', () => {
    expect(decompose(0.1).hex).toBe('3FB999999999999A')
    expect(decompose(0.3).hex).toBe('3FD3333333333333')
    expect(decompose(0.1 + 0.2).hex).toBe('3FD3333333333334')
    expect(decompose(1).hex).toBe('3FF0000000000000')
    expect(decompose(-0).hex).toBe('8000000000000000')
    expect(decompose(Infinity).hex).toBe('7FF0000000000000')
    expect(decompose(Number.MIN_VALUE).hex).toBe('0000000000000001')
    expect(decompose(Number.MAX_SAFE_INTEGER).hex).toBe('433FFFFFFFFFFFFF')
    expect(toBits(2 ** 53)).toBe(0x4340000000000000n)
  })

  it('splits sign / exponent / fraction and classifies', () => {
    const p = decompose(-1.5)
    expect(p.sign).toBe(1)
    expect(p.exponent).toBe(1023)
    expect(p.fraction).toBe(1n << 51n)
    expect(p.binary).toHaveLength(64)
    expect(decompose(NaN).kind).toBe('nan')
    expect(decompose(-Infinity).kind).toBe('infinity')
    expect(decompose(-0).kind).toBe('zero')
    expect(decompose(Number.MIN_VALUE).kind).toBe('subnormal')
    expect(decompose(Number.EPSILON).kind).toBe('normal')
  })

  it('computes the exact decimal value of the stored double', () => {
    expect(exactDecimal(0.1)).toBe('0.1000000000000000055511151231257827021181583404541015625')
    expect(exactDecimal(0.3)).toBe('0.299999999999999988897769753748434595763683319091796875')
    expect(exactDecimal(0.1 + 0.2)).toBe('0.3000000000000000444089209850062616169452667236328125')
    expect(exactDecimal(0.5)).toBe('0.5')
    expect(exactDecimal(-0)).toBe('-0')
    expect(exactDecimal(2 ** 53)).toBe('9007199254740992')
    expect(exactDecimal(1e21)).toBe('1000000000000000000000')
    expect(exactDecimal(Number.EPSILON)).toBe('0.0000000000000002220446049250313080847263336181640625')
    // every exact expansion parses back to the same double
    for (const p of FLOAT_PRESETS) if (Number.isFinite(p.value)) expect(Object.is(Number(exactDecimal(p.value)), p.value)).toBe(true)
    // MIN_VALUE = 2^-1074 has exactly 1074 fractional digits
    expect(exactDecimal(Number.MIN_VALUE).split('.')[1]).toHaveLength(1074)
  })

  it('measures distances in ULPs', () => {
    expect(ulpDistance(0.1 + 0.2, 0.3)).toBe(1n)
    expect(ulpDistance(-0, 0)).toBe(0n)
    expect(ulpDistance(-Number.MIN_VALUE, Number.MIN_VALUE)).toBe(2n)
    expect(nextUp(1) - 1).toBe(Number.EPSILON)
    expect(nextUp(2 ** 53)).toBe(2 ** 53 + 2)
    expect(nextDown(0)).toBe(-Number.MIN_VALUE)
    expect(ulpPower(1)).toBe(-52)
    expect(ulpPower(2 ** 53)).toBe(1)
    expect(ulpPower(Number.MIN_VALUE)).toBe(-1074)
  })

  it('evaluates the free input like JS does, without eval', () => {
    expect(evaluate('0.1 + 0.2')).toBe(0.1 + 0.2)
    expect(evaluate('2 ** 53 + 1')).toBe(2 ** 53)
    expect(Object.is(evaluate('-0'), -0)).toBe(true)
    expect(evaluate('Number.EPSILON')).toBe(Number.EPSILON)
    expect(evaluate('(1 + 2) * 3')).toBe(9)
    expect(evaluate('1.1 * 3')).toBe(1.1 * 3)
    expect(evaluate('0x1F')).toBe(31)
    expect(evaluate('2 ** -1074')).toBe(Number.MIN_VALUE)
    expect(evaluate('NaN')).toBeNaN()
    for (const bad of ['', 'abc', '1 +', 'alert(1)', '(1', '1 2']) expect(evaluate(bad), bad).toBeNull()
  })
})

describe('regex-engine: backtracking matcher agrees with RegExp', () => {
  const table: Array<[string, string]> = [
    ['<.+>', '<a><b>'],
    ['<.+?>', '<a><b>'],
    ['(a+)+b', 'aaaac'],
    ['(a+)+b', 'aaab'],
    ['(cat|car)s', 'the cars'],
    ['^\\d{2,3}$', '123'],
    ['^\\d{2,3}$', '1234'],
    ['a*?b', 'aaab'],
    ['(a|ab)(c|bcd)(d*)', 'abcd'],
    ['[^a-c]+', 'abcdef'],
    ['x*', 'abc'],
    ['(a*)*b', 'aaab'],
    ['colou?r', 'my colour'],
    ['\\w+@\\w+\\.com', 'mail me: bob@site.com!'],
    ['(?:ab)+', 'xababab'],
    ['a{2}', 'aaa'],
    ['a{2,}?', 'aaaa'],
    ['$', 'abc'],
    ['^', 'abc'],
    ['(a|)+b', 'aab'],
    ['[\\d-]+', 'tel 12-34'],
    ['\\s\\S', 'ab cd'],
    ['.+', 'line1\nline2'],
    ['[a-z]+\\d?$', 'Abc1'],
    ['a|b|c', 'xyzc'],
    ['(a|b)*c', 'ababx'],
    ['\\.', 'a.b'],
    ['q', 'abc'],
  ]

  it.each(table)('/%s/ on %j', (pattern, input) => {
    const native = new RegExp(pattern).exec(input)
    const model = run(pattern, input).match
    if (!native) expect(model).toBeNull()
    else expect(model).toEqual({ index: native.index, text: native[0] })
  })

  it('rejects unsupported syntax', () => {
    expect(() => parse('(?=a)')).toThrow()
    expect(() => parse('a)')).toThrow()
    expect(() => parse('*a')).toThrow()
    expect(() => parse('[a')).toThrow()
  })

  it('step count explodes for (a+)+b but not for a+b', () => {
    const rows = explosionTable(4, 10)
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]!.nested).toBeGreaterThan(rows[i - 1]!.nested * 1.8)
      expect(rows[i]!.flat).toBeLessThan(rows[i - 1]!.flat * 1.5)
    }
    expect(rows.at(-1)!.nested).toBeGreaterThan(rows.at(-1)!.flat * 20)
    expect(countSteps('(a+)+b', 'aaaab')).toBeLessThan(50)
  })

  it('aborts runaway searches', () => {
    const r = run('(a+)+b', 'a'.repeat(30) + 'c', { record: 0, maxSteps: 10_000 })
    expect(r.aborted).toBe(true)
    expect(r.match).toBeNull()
  })
})

describe('unicode-string: counts come from the real APIs', () => {
  const samples = [...UNICODE_PRESETS.map((p) => p.text), '', 'a b', 'e\u0301\u{1F1FA}\u{1F1E6}\u{1F44D}\u{1F3FD}', 'Київ😀']

  it.each(samples.map((s) => ({ s })))('$s', ({ s }) => {
    const a = analyze(s)
    expect(a.counts.length).toBe(s.length)
    expect(a.counts.codePoints).toBe(Array.from(s).length)
    expect(a.counts.graphemes).toBe([...new Intl.Segmenter('uk', { granularity: 'grapheme' }).segment(s)].length)
    expect(a.counts.bytes).toBe(new TextEncoder().encode(s).byteLength)
    expect(a.graphemes.map((g) => g.text).join('')).toBe(s)
    const units = a.graphemes.flatMap((g) => g.codePoints.flatMap((c) => c.units.map((u) => u.value)))
    expect(units).toEqual(s.split('').map((c) => c.charCodeAt(0)))
    const bytes = a.graphemes.flatMap((g) => g.codePoints.flatMap((c) => c.bytes))
    expect(bytes).toEqual([...new TextEncoder().encode(s)])
    expect(a.split).toHaveLength(s.split('').length)
  })

  it('matches the chapter numbers', () => {
    const family = analyze('\u{1F468}\u200D\u{1F469}\u200D\u{1F467}')
    expect(family.counts).toEqual({ length: 8, codePoints: 5, graphemes: 1, bytes: 18 })
    expect(analyze('e\u0301\u{1F1FA}\u{1F1E6}\u{1F44D}\u{1F3FD}').counts).toMatchObject({ length: 10, codePoints: 6, graphemes: 3 })
    const grin = analyze('😀')
    expect(grin.graphemes[0]!.codePoints[0]!.units.map((u) => u.kind)).toEqual(['high', 'low'])
    expect(grin.split).toEqual(['\\uD83D', '\\uDE00'])
    expect(grin.sliceFirst).toBe('\\uD83D')
  })

  it('NFC vs NFD café', () => {
    const nfc = analyze(UNICODE_PRESETS.find((p) => p.id === 'cafe-nfc')!.text)
    const nfd = analyze(UNICODE_PRESETS.find((p) => p.id === 'cafe-nfd')!.text)
    expect(nfc.counts.length).toBe(4)
    expect(nfd.counts.length).toBe(5)
    expect(nfc.counts.graphemes).toBe(nfd.counts.graphemes)
    expect(nfd.nfc.text).toBe(nfc.text)
    expect(nfc.nfd.length).toBe(5)
  })
})
