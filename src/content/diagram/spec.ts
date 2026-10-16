import { parse as parseYaml } from 'yaml'
import { z } from 'zod'

// `[!diagram]` — hand-laid HTML figures instead of ASCII art in code blocks (CONTENT_SPEC.md §14). The callout holds a
// ```yaml block with this shape; the UI (src/ui/diagram) draws boxes, arrows and an optional step-by-step walkthrough.

export const DIAGRAM_LAYOUTS = ['flow', 'stack', 'tree', 'nest', 'compare', 'timeline'] as const
export type DiagramLayout = (typeof DIAGRAM_LAYOUTS)[number]

export const DIAGRAM_TONES = ['violet', 'mint', 'blue', 'green', 'yellow', 'orange', 'red', 'pink', 'gray'] as const
export type DiagramTone = (typeof DIAGRAM_TONES)[number]

const text = z.union([z.string(), z.number(), z.boolean()]).transform((v) => String(v))
const ids = z.union([z.string(), z.array(z.string())]).transform((v) => (Array.isArray(v) ? v : v.split(/[\s,]+/).filter(Boolean)))

const NodeSchema = z.object({
  id: text,
  /** small caption above the box («аргументи», «Call Stack») */
  label: text.optional(),
  /** main content, plain text */
  text: text.optional(),
  /** main content, monospace code */
  code: text.optional(),
  /** a second line under the content */
  note: text.optional(),
  tone: z.enum(DIAGRAM_TONES).optional(),
  /** icon ref: px:box, pi:PiTimerFill, si:SiReact */
  icon: text.optional(),
  /** tree / nest: id of the parent node */
  parent: text.optional(),
  /** compare: column key */
  col: text.optional(),
  /** timeline: label on the time axis («0 мс», «t+1») */
  at: text.optional(),
})

const EdgeSchema = z.object({ from: text, to: text, label: text.optional(), tone: z.enum(DIAGRAM_TONES).optional(), dashed: z.boolean().optional() })

const MoveSchema = z.object({ from: text, to: text, value: text })
const moves = z.union([MoveSchema, z.array(MoveSchema)]).transform((v) => (Array.isArray(v) ? v : [v]))
// `fn:2` or [`fn:2`, `fn:3`]: highlight line 2 (1-based) of node fn's code
const lineRefs = z.union([z.string(), z.array(z.string())]).transform((v) => (Array.isArray(v) ? v : [v]))

const StepSchema = z.object({
  /** nodes that appear on this step (they stay visible afterwards) */
  show: ids.optional(),
  /** nodes highlighted on this step (default: the ones just shown) */
  focus: ids.optional(),
  /** nodes that go away on this step (e.g. a frame popped off the stack) */
  hide: ids.optional(),
  /** a value travelling along the arrow from one node to another («5» goes into the function) */
  move: moves.optional(),
  /** code lines running now: `fn:2` */
  line: lineRefs.optional(),
  /** new text for nodes from this step on (a variable changes, a result appears) */
  set: z.record(z.string(), text).optional(),
  note: text.optional(),
})

const DiagramSchema = z.object({
  layout: z.enum(DIAGRAM_LAYOUTS).default('flow'),
  /** compare: column headers by key, in order */
  columns: z.record(z.string(), text).optional(),
  nodes: z.array(NodeSchema).min(1),
  edges: z.array(EdgeSchema).optional(),
  steps: z.array(StepSchema).optional(),
})

export type DiagramNode = z.infer<typeof NodeSchema>
export type DiagramEdge = z.infer<typeof EdgeSchema>
export type DiagramStep = z.infer<typeof StepSchema>
export interface DiagramSpec extends z.infer<typeof DiagramSchema> {
  title: string
}

export type DiagramParse = { ok: true; spec: DiagramSpec; warnings: string[] } | { ok: false; error: string }

export function parseDiagram(title: string, source: string): DiagramParse {
  let raw: unknown
  try {
    raw = parseYaml(source)
  } catch (e) {
    return { ok: false, error: `YAML: ${(e as Error).message.split('\n')[0]}` }
  }
  const parsed = DiagramSchema.safeParse(raw)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return { ok: false, error: `${issue?.path.join('.') || 'схема'}: ${issue?.message ?? 'невірний формат'}` }
  }
  const spec: DiagramSpec = { ...parsed.data, title }
  const warnings: string[] = []
  const known = new Set<string>()
  for (const n of spec.nodes) {
    if (known.has(n.id)) warnings.push(`вузол «${n.id}» повторюється`)
    known.add(n.id)
    if (!n.text && !n.code && !n.label) warnings.push(`вузол «${n.id}» порожній`)
  }
  const check = (where: string, list: readonly string[] | undefined) => {
    for (const id of list ?? []) if (!known.has(id)) warnings.push(`${where}: невідомий вузол «${id}»`)
  }
  for (const n of spec.nodes) if (n.parent) check(`parent у «${n.id}»`, [n.parent])
  spec.edges?.forEach((e, i) => check(`edges[${i}]`, [e.from, e.to]))
  spec.steps?.forEach((s, i) => {
    check(`steps[${i}].show`, s.show)
    check(`steps[${i}].focus`, s.focus)
    check(`steps[${i}].hide`, s.hide)
    check(`steps[${i}].move`, s.move?.flatMap((m) => [m.from, m.to]))
    check(`steps[${i}].set`, Object.keys(s.set ?? {}))
    for (const ref of s.line ?? []) {
      const [id = '', n = ''] = ref.split(':')
      const node = spec.nodes.find((x) => x.id === id)
      if (!node) warnings.push(`steps[${i}].line: невідомий вузол «${id}»`)
      else if (!node.code) warnings.push(`steps[${i}].line: у вузла «${id}» немає code`)
      else if (!(Number(n) >= 1 && Number(n) <= node.code.split('\n').length)) warnings.push(`steps[${i}].line: у «${id}» немає рядка ${n}`)
    }
  })
  if ((spec.layout === 'tree' || spec.layout === 'nest') && !spec.nodes.some((n) => !n.parent)) warnings.push('у дереві немає кореня (вузла без parent)')
  return { ok: true, spec, warnings }
}

export interface DiagramMove {
  from: string
  to: string
  value: string
}

export interface DiagramFrame {
  visible: ReadonlySet<string>
  focus: ReadonlySet<string>
  note: string | null
  moves: readonly DiagramMove[]
  /** node id → highlighted code lines (1-based) */
  lines: ReadonlyMap<string, readonly number[]>
  /** node id → text that replaces the node's own `text` */
  texts: ReadonlyMap<string, string>
}

// Frames of the walkthrough. Without steps there is one frame with everything visible. Nodes never mentioned in any
// `show` are visible from the start (the static scaffolding of the picture).
export function diagramFrames(spec: Pick<DiagramSpec, 'nodes' | 'steps'>): DiagramFrame[] {
  const steps = spec.steps ?? []
  const all = spec.nodes.map((n) => n.id)
  if (steps.length === 0) return [{ visible: new Set(all), focus: new Set(), note: null, moves: [], lines: new Map(), texts: new Map() }]
  const revealed = new Set(steps.flatMap((s) => s.show ?? []))
  const visible = new Set(all.filter((id) => !revealed.has(id)))
  const texts = new Map<string, string>()
  return steps.map((s) => {
    for (const id of s.show ?? []) visible.add(id)
    for (const id of s.hide ?? []) visible.delete(id)
    for (const [id, value] of Object.entries(s.set ?? {})) texts.set(id, value)
    const lines = new Map<string, number[]>()
    for (const ref of s.line ?? []) {
      const [id = '', n = ''] = ref.split(':')
      lines.set(id, [...(lines.get(id) ?? []), Number(n)])
    }
    const moves = s.move ?? []
    const focus = s.focus ?? [...(s.show ?? []), ...moves.map((m) => m.to), ...Object.keys(s.set ?? {}), ...lines.keys()]
    return { visible: new Set(visible), focus: new Set(focus), note: s.note ?? null, moves, lines, texts: new Map(texts) }
  })
}
