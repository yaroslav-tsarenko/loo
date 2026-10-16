// Rendering pipeline model: stages, what a CSS change triggers, frame budget and
// a tiny layout-dirty simulation for read/write interleaving.

import type { VizIcon } from '../engine/types'

export type Stage = 'input' | 'js' | 'style' | 'layout' | 'paint' | 'composite'

export const STAGES: ReadonlyArray<{ id: Stage; label: string; icon: VizIcon }> = [
  { id: 'input', label: 'Input', icon: 'pi:PiHandPointingFill' },
  { id: 'js', label: 'JS / rAF', icon: 'pi:PiCodeBlockFill' },
  { id: 'style', label: 'Style', icon: 'pi:PiPaletteFill' },
  { id: 'layout', label: 'Layout', icon: 'pi:PiRulerFill' },
  { id: 'paint', label: 'Paint', icon: 'pi:PiPaintBrushFill' },
  { id: 'composite', label: 'Composite', icon: 'pi:PiStackFill' },
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
