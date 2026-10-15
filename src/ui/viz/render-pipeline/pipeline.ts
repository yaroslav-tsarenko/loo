// Rendering pipeline model: stages, what a CSS change triggers, frame budget and
// a tiny layout-dirty simulation for read/write interleaving.

export type Stage = 'input' | 'js' | 'style' | 'layout' | 'paint' | 'composite'

export const STAGES: ReadonlyArray<{ id: Stage; label: string; emoji: string }> = [
  { id: 'input', label: 'Input', emoji: '👆' },
  { id: 'js', label: 'JS / rAF', emoji: '📜' },
  { id: 'style', label: 'Style', emoji: '🎨' },
  { id: 'layout', label: 'Layout', emoji: '📐' },
  { id: 'paint', label: 'Paint', emoji: '🖌️' },
  { id: 'composite', label: 'Composite', emoji: '🧩' },
]

// 60 Hz
export const FRAME_MS = 1000 / 60

export type CssProp = 'width' | 'color' | 'transform' | 'opacity'

// Stages a change of the property triggers (transform/opacity: element on its own layer).
export function stagesFor(prop: CssProp): Stage[] {
  switch (prop) {
    case 'width':
      return ['style', 'layout', 'paint', 'composite']
    case 'color':
      return ['style', 'paint', 'composite']
    case 'transform':
    case 'opacity':
      return ['style', 'composite']
  }
}

export type BlockKind = Stage | 'forced'

export interface Block {
  id: string
  kind: BlockKind
  ms: number
}

export function budget(blocks: readonly Block[]): { used: number; free: number; over: boolean } {
  const used = blocks.reduce((sum, b) => sum + b.ms, 0)
  return { used, free: Math.max(0, FRAME_MS - used), over: used > FRAME_MS }
}

export type Op = 'read' | 'write'

// A geometry read while layout is dirty forces a synchronous layout; a write dirties it again.
export function runOps(ops: readonly Op[], dirty = false): { forced: number; dirty: boolean; trace: boolean[] } {
  let forced = 0
  const trace: boolean[] = []
  for (const op of ops) {
    if (op === 'read') {
      trace.push(dirty)
      if (dirty) forced++
      dirty = false
    } else {
      trace.push(false)
      dirty = true
    }
  }
  return { forced, dirty, trace }
}
