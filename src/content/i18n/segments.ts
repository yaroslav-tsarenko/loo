import { createHash } from 'node:crypto'
import type { Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'

// Translation segments of a topic (docs/COURSE_FORMAT.md «Переклад курсів (i18n)», docs/NEXTJS_SYLLABUS.md §8.1).
// Pure: works on an extracted document (src/content/parse/extract.ts → headings carry their slug, exercises are
// `unitRef` nodes) and, for hashes, the markdown source it came from.
//
// * a heading       → `<slug path>`            (slugs of the enclosing h2 › h3 › … joined by «/»)
// * an exercise     → its id                   (a `unitRef`: quiz, card, task…)
// * prose           → `<slug path>#p<n>`       (a paragraph, list, table, non-exercise callout, diagram…; n counts
//                                               inside the section). A code fence belongs to the prose segment
//                                               before it (or opens one).
// Editing one paragraph changes only that segment's hash; adding one renumbers the prose after it in the same
// section only. A translation is segmented with the SOURCE's heading slugs (by position), so ids match across
// languages.

export type SegmentKind = 'heading' | 'prose' | 'unit'

export interface Segment {
  id: string
  kind: SegmentKind
  // the heading path the segment sits in (a heading: its own path)
  section: string
  // indexes in root.children
  nodes: number[]
  // node types (+ callout type), to spot a translation whose blocks don't line up with the source
  signature: string
  // sha1 of the whitespace-normalised source text ('' without a source)
  hash: string
  // whitespace-normalised source text ('' without a source)
  text: string
}

export interface SegmentOptions {
  // the markdown the root was parsed from (for hashes and texts)
  source?: string
  // heading slugs by position (a translation uses its source's), instead of the headings' own
  headingSlugs?: readonly string[]
}

const SKIP = new Set(['thematicBreak', 'yaml', 'definition', 'idMarker', 'footnoteDefinition'])

export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

export function hashText(text: string): string {
  return createHash('sha1').update(normalizeText(text)).digest('hex')
}

export function headingSlugOf(node: RootContent): string | null {
  if (node.type !== 'heading') return null
  return (node.data?.hProperties as { id?: string } | undefined)?.id ?? null
}

// The top-level headings of an extracted document, in order (their slugs).
export function headingSlugs(root: Root): string[] {
  return root.children.flatMap((n) => {
    const slug = headingSlugOf(n)
    return slug === null ? [] : [slug]
  })
}

function nodeSignature(node: RootContent): string {
  if (node.type === 'callout') return `callout:${node.calloutType}`
  if (node.type === 'list') return node.ordered ? 'list:ol' : 'list:ul'
  if (node.type === 'heading') return `h${node.depth}`
  return node.type
}

function sliceOf(source: string, nodes: readonly RootContent[]): string {
  const first = nodes[0]?.position?.start.offset
  const last = nodes.at(-1)?.position?.end.offset
  if (first === undefined || last === undefined) return nodes.map((n) => toString(n)).join('\n')
  return source.slice(first, last)
}

export function segmentRoot(root: Root, options: SegmentOptions = {}): Segment[] {
  const out: Segment[] = []
  const path: string[] = []
  const counters = new Map<string, number>()
  let headingIndex = 0
  let open: Segment | null = null
  const sectionPath = () => path.filter(Boolean).join('/')
  const finish = () => {
    open = null
  }
  root.children.forEach((node, index) => {
    if (SKIP.has(node.type)) return
    if (node.type === 'html' && /^\s*<!--[\s\S]*-->\s*$/.test(node.value)) return
    if (node.type === 'heading') {
      const own = headingSlugOf(node) ?? `h${headingIndex + 1}`
      const slug = options.headingSlugs?.[headingIndex] ?? own
      headingIndex++
      path.length = Math.max(0, node.depth - 1)
      path[node.depth - 1] = slug
      finish()
      out.push({ id: sectionPath(), kind: 'heading', section: sectionPath(), nodes: [index], signature: nodeSignature(node), hash: '', text: '' })
      return
    }
    if (node.type === 'unitRef') {
      finish()
      out.push({ id: node.unitId, kind: 'unit', section: sectionPath(), nodes: [index], signature: 'unit', hash: '', text: '' })
      return
    }
    const current: Segment | null = open
    if (node.type === 'code' && current !== null) {
      current.nodes.push(index)
      current.signature += '+code'
      return
    }
    const section = sectionPath()
    const n = (counters.get(section) ?? 0) + 1
    counters.set(section, n)
    const segment: Segment = { id: `${section}#p${n}`, kind: 'prose', section, nodes: [index], signature: nodeSignature(node), hash: '', text: '' }
    out.push(segment)
    open = segment
  })
  if (options.source !== undefined) {
    for (const s of out) {
      s.text = normalizeText(sliceOf(options.source, s.nodes.map((i) => root.children[i]!)))
      s.hash = hashText(s.text)
    }
  }
  return out
}

export function segmentMap(segments: readonly Segment[]): Map<string, Segment> {
  return new Map(segments.map((s) => [s.id, s]))
}
