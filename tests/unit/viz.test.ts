import { describe, expect, it, vi } from 'vitest'
import type { Element, Root as HastRoot } from 'hast'
import type { Root } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { calloutStyleFor, renderBlockFor, unitCalloutTypes } from '@/content/blocks/registry'
import { VIZ_CATALOG } from '@/content/blocks/viz/catalog'
import type { FlashcardUnit } from '@/content/model'
import { extractFile } from '@/content/parse/extract'
import { parseMarkdown } from '@/content/parse/markdown'
import type { Callout, VizRef } from '@/content/parse/nodes'
import { mdastToHast } from '@/content/render/to-hast'
import { OPTIONS, trace } from '@/ui/viz/coercion/algorithms'
import { simulateDebounce, simulateThrottle } from '@/ui/viz/debounce-throttle/timing'
import { codeLines, type Token } from '@/ui/viz/engine/types'
import { combine, COMBINATORS, type CombinatorInput } from '@/ui/viz/promise-states/combinator-model'
import { GENERATED_SCENARIOS, STEP_SCENARIOS } from '@/ui/viz/scenarios'

function extract(md: string) {
  const { root, meta } = parseMarkdown(md)
  return extractFile({ root, meta, guideId: 'g', chapterId: 'g/ch', path: 'Guides/G/Test - 01. Файл.md', fileName: 'Test - 01. Файл' })
}

function find<T>(root: unknown, type: string): T[] {
  const out: T[] = []
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const n = node as { type?: string; tagName?: string; children?: unknown[] }
    if (n.type === type || n.tagName === type) out.push(node as T)
    n.children?.forEach(walk)
  }
  walk(root)
  return out
}

const hast = (root: Root): HastRoot => mdastToHast(root, { resolveLink: () => ({ kind: 'missing', href: null, label: '', title: null }) }).tree

describe('[!viz] block', () => {
  it('extracts id and scenario', () => {
    const r = extract('# T\n\n> [!viz] event-loop\n> scenario: promise-vs-timeout\n\nтекст')
    const [ref] = find<VizRef>(r.root, 'vizRef')
    expect(ref).toMatchObject({ vizId: 'event-loop', scenario: 'promise-vs-timeout', known: true })
    expect(ref!.children).toEqual([])
    expect(r.units).toEqual([])
    expect(r.issues).toEqual([])
    expect(find<Callout>(r.root, 'callout')).toEqual([])
  })

  it('uses the default scenario when none is given and keeps the caption', () => {
    const r = extract('> [!viz] Call-Stack\n> Підпис під схемою')
    const [ref] = find<VizRef>(r.root, 'vizRef')
    expect(ref).toMatchObject({ vizId: 'call-stack', scenario: null, known: true })
    expect(toString(ref!)).toBe('Підпис під схемою')
  })

  it('keeps the caption after the scenario line', () => {
    const r = extract('> [!viz] gc\n> scenario: leak-closure\n>\n> Слухач тримає замикання')
    const [ref] = find<VizRef>(r.root, 'vizRef')
    expect(ref!.scenario).toBe('leak-closure')
    expect(toString(ref!)).toBe('Слухач тримає замикання')
  })

  it('reads the scenario even when the caption follows without a blank line', () => {
    const r = extract('> [!viz] event-loop\n> scenario: async-await\n> Підпис одразу')
    const [ref] = find<VizRef>(r.root, 'vizRef')
    expect(ref!.scenario).toBe('async-await')
    expect(toString(ref!)).toBe('Підпис одразу')
  })

  it('renders as x-viz with data attributes', () => {
    const r = extract('> [!viz] event-loop\n> scenario: async-await')
    const [el] = find<Element>(hast(r.root), 'x-viz')
    expect(el!.properties).toMatchObject({ dataViz: 'event-loop', dataScenario: 'async-await' })
  })

  it('unknown id → neutral callout with the text kept and a content issue', () => {
    const r = extract('> [!viz] quantum-loop\n> Пояснення автора')
    const [ref] = find<VizRef>(r.root, 'vizRef')
    expect(ref!.known).toBe(false)
    expect(r.issues.map((i) => i.code)).toEqual(['unknown-block'])
    const tree = hast(r.root)
    expect(find<Element>(tree, 'x-viz')).toEqual([])
    const [aside] = find<Element>(tree, 'aside')
    expect(aside!.properties).toMatchObject({ dataTone: 'quiet' })
    const text = JSON.stringify(aside)
    expect(text).toContain('quantum-loop')
    expect(text).toContain('Пояснення автора')
  })

  it('unknown scenario falls back to default with a warning', () => {
    const r = extract('> [!viz] event-loop\n> scenario: nope')
    const [ref] = find<VizRef>(r.root, 'vizRef')
    expect(ref).toMatchObject({ known: true, scenario: null })
    expect(r.issues).toHaveLength(1)
  })

  it('renders inside a flashcard answer too', () => {
    const r = extract('> [!question]- Як працює event loop?\n> `g-01-001`\n>\n> > [!viz] event-loop')
    const card = r.units[0] as FlashcardUnit
    expect(card.kind).toBe('flashcard')
    expect(find<Element>(hast(card.answer), 'x-viz')).toHaveLength(1)
  })

  it('is a rendering block, not a learning unit', () => {
    expect(renderBlockFor('viz')).toBeDefined()
    expect(renderBlockFor('візуалізація')).toBeDefined()
    expect(unitCalloutTypes().has('viz')).toBe(false)
  })
})

describe('[!reel] style', () => {
  it('resolves aliases including Cyrillic', () => {
    for (const type of ['reel', 'fact', 'фішка']) {
      expect(calloutStyleFor(type)).toMatchObject({ type: 'reel', label: 'Фішка', tone: 'accent', icon: 'zap' })
    }
  })

  it('parses [!фішка] as a callout and keeps the emoji title', () => {
    const { root } = parseMarkdown('> [!фішка] 🧩 typeof null\n> Тіло')
    const [c] = find<Callout>(root, 'callout')
    expect(c!.calloutType).toBe('фішка')
    expect(toString({ type: 'paragraph', children: c!.title })).toBe('🧩 typeof null')
  })
})

describe('viz scenarios', () => {
  const all = [
    ...Object.entries(STEP_SCENARIOS).flatMap(([viz, map]) => Object.entries(map).map(([scenario, data]) => ({ name: `${viz}/${scenario}`, data }))),
    ...GENERATED_SCENARIOS.map((g) => ({ name: `${g.viz}/${g.scenario}:${g.variant}`, data: g.data })),
  ]

  it('every catalog scenario has data or an interactive implementation', () => {
    const generated = new Set(GENERATED_SCENARIOS.map((g) => `${g.viz}/${g.scenario}`))
    for (const viz of VIZ_CATALOG) {
      for (const s of viz.scenarios) {
        const key = `${viz.id}/${s.id}`
        if (s.mode === 'steps') expect(STEP_SCENARIOS[viz.id]?.[s.id], key).toBeDefined()
        else expect(STEP_SCENARIOS[viz.id]?.[s.id] === undefined || generated.has(key), key).toBe(true)
      }
      for (const id of Object.keys(STEP_SCENARIOS[viz.id] ?? {})) expect(viz.scenarios.some((s) => s.id === id), `${viz.id}/${id} in catalog`).toBe(true)
    }
  })

  it.each(all)('$name: frames are well-formed', ({ data }) => {
    const lines = codeLines(data.code).length
    expect(data.frames.length).toBeGreaterThan(1)
    for (const frame of data.frames) {
      expect(frame.note.trim().length).toBeGreaterThan(10)
      expect(frame.note.length).toBeLessThan(320)
      if (frame.line !== null) {
        expect(Number.isInteger(frame.line)).toBe(true)
        expect(frame.line).toBeGreaterThanOrEqual(1)
        expect(frame.line).toBeLessThanOrEqual(lines)
      }
      // token lists are keyed by id: no duplicates inside one list
      for (const value of Object.values(frame)) {
        if (Array.isArray(value) && value.every((v) => v && typeof v === 'object' && 'id' in v && 'label' in v)) {
          const ids = (value as Token[]).map((t) => t.id)
          expect(new Set(ids).size).toBe(ids.length)
        }
      }
    }
  })
})

describe('coercion algorithms match the engine', () => {
  const pairs = OPTIONS.flatMap((a) => OPTIONS.map((b) => [a, b] as const))

  it.each(pairs.map(([a, b]) => ({ x: a.label, y: b.label, a, b })))('$x == $y', ({ a, b }) => {
    const t = trace('eq', a.id, b.id)
    expect(t.result).toBe(a.make() == b.make())
    expect(t.steps.length).toBeGreaterThan(0)
  })

  it.each(pairs.map(([a, b]) => ({ x: a.label, y: b.label, a, b })))('$x + $y', ({ a, b }) => {
    const t = trace('plus', a.id, b.id)
    const native = (a.make() as never) + (b.make() as never)
    expect(Object.is(t.result, native)).toBe(true)
  })
})

describe('debounce / throttle timing', () => {
  it('debounce fires once after a burst goes quiet', () => {
    const events = [0, 100, 200, 300]
    expect(simulateDebounce(events, 250, 400)).toEqual({ fired: [], pendingAt: 550 })
    expect(simulateDebounce(events, 250, 600)).toEqual({ fired: [550], pendingAt: null })
    expect(simulateDebounce([0, 400], 250, 1000).fired).toEqual([250, 650])
  })

  it('throttle fires on the leading edge and once at the trailing edge', () => {
    const events = [0, 100, 200, 300]
    expect(simulateThrottle(events, 250, 1000).fired).toEqual([0, 250, 500])
    expect(simulateThrottle([0, 600], 250, 1000).fired).toEqual([0, 600])
    expect(simulateThrottle([0, 100], 250, 200)).toMatchObject({ fired: [0], pendingAt: 250 })
  })
})

describe('promise combinators model', () => {
  const NAMES = ['A', 'B', 'C']
  const cases: Array<Array<[number, boolean]>> = [
    [[30, true], [10, false], [20, true]],
    [[10, true], [30, true], [20, true]],
    [[20, false], [10, false], [30, false]],
    [[30, false], [20, true], [10, false]],
  ]

  // Real promises on fake timers: the timeouts fire in order at exact virtual times, so the check doesn't depend on how
  // busy the machine is (with real timers 10 ms apart, a loaded CI runner reordered them).
  const real = async (id: (typeof COMBINATORS)[number]['id'], inputs: CombinatorInput[]) => {
    vi.useFakeTimers()
    try {
      const start = Date.now()
      const promises = inputs.map((i) => new Promise<string>((resolve, reject) => setTimeout(() => (i.ok ? resolve(i.value) : reject(i.reason)), i.ms)))
      const run = Promise[id].bind(Promise) as (values: Promise<string>[]) => Promise<unknown>
      let settled: { ok: boolean; value: unknown; ms: number } | null = null
      run(promises).then(
        (value) => (settled = { ok: true, value, ms: Date.now() - start }),
        (error: unknown) => (settled = { ok: false, value: error, ms: Date.now() - start }),
      )
      // the rejections no combinator observed must not surface as unhandled
      for (const p of promises) p.catch(() => {})
      for (const ms of [...new Set(inputs.map((i) => i.ms))].sort((a, b) => a - b)) {
        await vi.advanceTimersByTimeAsync(ms - (Date.now() - start))
        if (settled) break
      }
      return settled ?? { ok: false, value: 'pending', ms: -1 }
    } finally {
      vi.useRealTimers()
    }
  }

  it.each(cases)('agrees with real promises: %j', async (...spec) => {
    const inputs: CombinatorInput[] = spec.map(([ms, ok], i) => ({ name: NAMES[i]!, ms, ok, value: `v${i}`, reason: `e${i}` }))
    for (const { id } of COMBINATORS) {
      const model = combine(id, inputs)
      const actual = await real(id, inputs)
      expect(model.ok, id).toBe(actual.ok)
      if (id === 'race' || (id === 'any' && actual.ok) || (id === 'all' && !actual.ok)) expect(model.value, id).toBe(String(actual.value))
      expect(actual.ms, id).toBe(model.at)
    }
  })
})
