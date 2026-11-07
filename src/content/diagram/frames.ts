import type { DiagramSpec } from './spec'

// The walkthrough of a parsed diagram. Pure and type-only on spec.ts: the diagram UI runs in the browser and must not
// pull in the yaml parser and schemas (tests/unit/client-bundle.test.ts).

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
