import type { Element, ElementContent, Root as HastRoot } from 'hast'
import type { Code, Paragraph, PhrasingContent, Root } from 'mdast'
import { toHast, type Handlers, type State } from 'mdast-util-to-hast'
import { slug } from 'github-slugger'
import { calloutStyleFor, renderBlockFor } from '../blocks/registry'
import type { Callout, DiagramRef, FigureRef, Mark, Tag, UnitRef, VizRef, WikiLink } from '../parse/nodes'
import { canonicalLang, highlightCode, parseCodeMeta, type CodeInput } from './highlight'

export interface LinkTarget {
  kind: 'internal' | 'outside' | 'missing'
  href: string | null
  label: string
  title: string | null
}

export interface HastEnv {
  resolveLink: (link: WikiLink) => LinkTarget
}

const IMAGE = /\.(png|jpe?g|gif|svg|webp|avif)$/i
const CODE_LIKE = /[;{}()=<>]|=>|\b(const|let|var|function|return|import|export|class|fun|val|SELECT|INSERT|UPDATE|CREATE|async|await|def|public)\b/

function el(tagName: string, properties: Element['properties'], children: ElementContent[]): Element {
  return { type: 'element', tagName, properties, children }
}

function phrasing(state: State, children: PhrasingContent[]): ElementContent[] {
  const paragraph: Paragraph = { type: 'paragraph', children }
  return state.all(paragraph)
}

// unknown render block id: neutral callout, the author's text stays visible
function missingBlock(title: string, type: string, caption: ElementContent[]): Element {
  return el('aside', { className: ['callout'], dataTone: 'quiet', dataType: type }, [
    el('x-icon', { dataName: 'info' }, []),
    el('div', { className: ['callout-content'] }, [el('div', { className: ['callout-title'] }, [{ type: 'text', value: title }]), el('div', { className: ['callout-body'] }, caption)]),
  ])
}

export interface HastResult {
  tree: HastRoot
  codes: CodeInput[]
}

export function mdastToHast(root: Root, env: HastEnv): HastResult {
  const codes: CodeInput[] = []
  const handlers: Handlers = {
    callout(state, node: Callout, parent) {
      // render blocks nested where extract() does not walk (e.g. inside a card answer)
      const block = renderBlockFor(node.calloutType)
      if (block) return state.one(block.transform(node).node, parent)
      const style = calloutStyleFor(node.calloutType)
      const titleChildren = phrasing(state, node.title)
      const heading = el('div', { className: ['callout-title'] }, titleChildren.length > 0 ? titleChildren : [{ type: 'text', value: style.label }])
      const icon = el('x-icon', { dataName: style.icon }, [])
      const body = el('div', { className: ['callout-body'] }, state.all(node))
      const props: Element['properties'] = { className: ['callout'], dataTone: style.tone, dataType: style.type }
      if (node.fold) {
        if (node.fold === 'open') props.open = true
        return el('details', props, [el('summary', { className: ['callout-summary'] }, [el('span', { className: ['toggle-arrow'], ariaHidden: 'true' }, []), icon, heading]), body])
      }
      return el('aside', props, [icon, el('div', { className: ['callout-content'] }, [heading, body])])
    },
    unitRef(_state, node: UnitRef) {
      return el('x-unit', { dataUnit: node.unitId }, [])
    },
    diagramRef(state, node: DiagramRef) {
      const caption = state.all(node)
      if (node.spec) return el('x-diagram', { dataSpec: JSON.stringify(node.spec) }, caption.length > 0 ? [el('div', { className: ['dg-caption-body'] }, caption)] : [])
      return missingBlock(`Схема не намальована: ${node.error ?? 'помилка опису'}`, 'diagram', caption)
    },
    vizRef(state, node: VizRef) {
      const caption = state.all(node)
      if (node.known) {
        const props: Element['properties'] = { dataViz: node.vizId }
        if (node.scenario) props.dataScenario = node.scenario
        return el('x-viz', props, caption.length > 0 ? [el('div', { className: ['viz-caption-body'] }, caption)] : [])
      }
      return missingBlock(node.vizId ? `Візуалізацію «${node.vizId}» не знайдено` : 'Візуалізацію не вказано', 'viz', caption)
    },
    figureRef(state, node: FigureRef) {
      const caption = state.all(node)
      if (node.known) {
        const props: Element['properties'] = { dataScene: node.sceneId }
        if (node.scenario) props.dataScenario = node.scenario
        if (node.device) props.dataDevice = node.device
        return el('x-figure', props, caption.length > 0 ? [el('div', { className: ['figure-caption-body'] }, caption)] : [])
      }
      return missingBlock(node.sceneId ? `Сцену «${node.sceneId}» не знайдено` : 'Сцену не вказано', 'figure', caption)
    },
    idMarker() {
      return undefined
    },
    tag(_state, node: Tag) {
      return el('span', { className: ['tag'] }, [{ type: 'text', value: `#${node.value}` }])
    },
    mark(state, node: Mark) {
      return el('mark', {}, phrasing(state, node.children))
    },
    wikiLink(_state, node: WikiLink) {
      if (node.embed) {
        if (IMAGE.test(node.target)) {
          const props: Element['properties'] = { src: `/api/vault-asset?path=${encodeURIComponent(node.target)}`, alt: node.alias ?? node.target, loading: 'lazy' }
          if (node.width) props.width = node.width
          return el('img', props, [])
        }
        return el('x-embed', { dataTarget: node.target, dataHeading: node.heading ?? '' }, [])
      }
      const target = env.resolveLink(node)
      const text: ElementContent = { type: 'text', value: target.label }
      if (target.kind === 'missing') {
        return el('span', { className: ['wikilink-broken'], title: `Нотатку «${node.target}» не знайдено` }, [text])
      }
      const props: Element['properties'] = { href: target.href ?? '#', className: ['wikilink', ...(target.kind === 'outside' ? ['wikilink-outside'] : [])] }
      if (target.title) props.title = target.title
      return el('a', props, [text])
    },
    code(_state, node: Code) {
      codes.push({ code: node.value, lang: node.lang ?? null, meta: node.meta ?? null })
      return el('x-code', { dataIndex: codes.length - 1 }, [])
    },
  }
  const tree = toHast(root, { handlers, allowDangerousHtml: false }) as HastRoot
  return { tree, codes }
}

function dominantLang(codes: readonly CodeInput[]): string | null {
  const counts = new Map<string, number>()
  for (const c of codes) {
    const lang = canonicalLang(c.lang)
    if (lang) counts.set(lang, (counts.get(lang) ?? 0) + 1)
  }
  let best: string | null = null
  let max = 0
  for (const [lang, n] of counts) {
    if (n > max) {
      max = n
      best = lang
    }
  }
  return best
}

async function buildFigure(input: CodeInput, fallbackLang: string | null): Promise<Element> {
  const lang = input.lang ?? (fallbackLang && CODE_LIKE.test(input.code) ? fallbackLang : null)
  const pre = await highlightCode({ ...input, lang })
  const lines = input.code.replace(/\n+$/, '').split('\n').length
  const options = parseCodeMeta(input.meta, lines)
  const display = options.title ?? (input.lang ? input.lang.toLowerCase() : lang ?? 'text')
  const props: Element['properties'] = { className: ['code'], dataLang: lang ?? 'text' }
  if (options.showLineNumbers) props.dataLines = ''
  return el('figure', props, [
    el('figcaption', { className: ['code-head'] }, [
      el('span', { className: [options.title ? 'code-title' : 'code-lang'] }, [{ type: 'text', value: display }]),
      el('button', { type: 'button', className: ['code-copy'], dataCopy: '' }, [{ type: 'text', value: 'Копіювати' }]),
    ]),
    pre,
  ])
}

export async function highlightTree(result: HastResult, extraCodes: readonly CodeInput[] = []): Promise<HastRoot> {
  const fallback = dominantLang([...result.codes, ...extraCodes])
  const figures = await Promise.all(result.codes.map((c) => buildFigure(c, fallback)))
  const replace = (node: HastRoot | Element) => {
    node.children = node.children.map((child) => {
      if (child.type !== 'element') return child
      if (child.tagName === 'x-code') {
        const index = Number(child.properties.dataIndex)
        return figures[index] ?? child
      }
      replace(child)
      return child
    }) as typeof node.children
  }
  replace(result.tree)
  return result.tree
}

export function headingSlug(text: string): string {
  return slug(text)
}
