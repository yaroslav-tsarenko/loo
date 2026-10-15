import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { Element, Root as HastRoot } from 'hast'
import type { Root } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { renderBlockFor, unitCalloutTypes } from '@/content/blocks/registry'
import { FIGURE_CATALOG } from '@/content/blocks/figure/catalog'
import { extractFile } from '@/content/parse/extract'
import { parseMarkdown } from '@/content/parse/markdown'
import type { FigureRef } from '@/content/parse/nodes'
import { mdastToHast } from '@/content/render/to-hast'
import { captionsOf, foldStep, resolveEnd } from '@/ui/theater/define'
import { SCENE_LOADERS } from '@/ui/theater/scenes'
import type { AnyScene } from '@/ui/theater/types'

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

describe('[!figure] block', () => {
  it('reads id, scenario, device and caption', () => {
    const r = extract('> [!figure] devtools-console\n> scenario: promise-order · device: desktop\n>\n> Підпис **жирним**')
    const [ref] = find<FigureRef>(r.root, 'figureRef')
    expect(ref).toMatchObject({ sceneId: 'devtools-console', scenario: 'promise-order', device: 'desktop', known: true })
    expect(toString(ref!)).toBe('Підпис жирним')
    expect(r.issues).toEqual([])
    const [el] = find<Element>(hast(r.root), 'x-figure')
    expect(el!.properties).toMatchObject({ dataScene: 'devtools-console', dataScenario: 'promise-order', dataDevice: 'desktop' })
  })

  it('works with aliases and without meta', () => {
    for (const type of ['scene', 'сцена']) {
      const r = extract(`> [!${type}] event-bubbling`)
      const [ref] = find<FigureRef>(r.root, 'figureRef')
      expect(ref).toMatchObject({ sceneId: 'event-bubbling', scenario: null, device: null, known: true })
    }
  })

  it('unknown id → neutral callout with text kept and an issue', () => {
    const r = extract('> [!figure] devtools-quantum\n> Текст автора')
    expect(r.issues.map((i) => i.code)).toEqual(['unknown-block'])
    const tree = hast(r.root)
    expect(find<Element>(tree, 'x-figure')).toEqual([])
    const text = JSON.stringify(find<Element>(tree, 'aside')[0])
    expect(text).toContain('devtools-quantum')
    expect(text).toContain('Текст автора')
  })

  it('ignores an unknown device and falls back on unknown scenario', () => {
    const r = extract('> [!figure] devtools-network\n> scenario: nope · device: tv')
    const [ref] = find<FigureRef>(r.root, 'figureRef')
    expect(ref).toMatchObject({ scenario: null, device: null, known: true })
    expect(r.issues).toHaveLength(1)
  })

  it('is a render block, not a learning unit', () => {
    expect(renderBlockFor('figure')).toBeDefined()
    expect(unitCalloutTypes().has('figure')).toBe(false)
  })
})

describe('theater scenes', async () => {
  const loaded: Array<{ id: string; scenario: string; scene: AnyScene }> = []
  for (const info of FIGURE_CATALOG) {
    const load = SCENE_LOADERS[info.id]
    if (!load) continue
    const all = await load()
    for (const s of info.scenarios) if (all[s.id]) loaded.push({ id: info.id, scenario: s.id, scene: all[s.id]! })
  }

  it('every catalog scene and scenario has an implementation', () => {
    for (const info of FIGURE_CATALOG) {
      expect(SCENE_LOADERS[info.id], info.id).toBeDefined()
      for (const s of info.scenarios) expect(loaded.some((l) => l.id === info.id && l.scenario === s.id), `${info.id}/${s.id}`).toBe(true)
    }
  })

  it.each(loaded.map((l) => ({ name: `${l.id}/${l.scenario}`, scene: l.scene })))('$name: script targets exist when they are used', ({ scene }) => {
    const captions = captionsOf(scene)
    expect(captions.length).toBeGreaterThanOrEqual(2)
    for (const c of captions) expect(c.trim().length).toBeGreaterThan(5)
    let state = scene.initial
    for (const step of scene.steps) {
      if ('target' in step) {
        const html = renderToStaticMarkup(createElement(scene.View, { s: state, device: 'desktop', focus: null }))
        expect(html, `${step.kind} → ${step.target}`).toContain(`data-demo="${step.target}"`)
      }
      if (step.kind === 'highlight') expect(step.label.trim().length).toBeGreaterThan(5)
      state = foldStep(state, step)
    }
    // the reduced-motion still renders the final state
    expect(() => renderToStaticMarkup(createElement(scene.View, { s: resolveEnd(scene), device: 'phone', focus: null }))).not.toThrow()
  })
})
