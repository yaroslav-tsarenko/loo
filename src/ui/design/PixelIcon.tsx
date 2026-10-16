import { cx } from './cx'
import { BASE_ICONS } from './pixel-icons/base'
import { CONTENT_ICONS } from './pixel-icons/content'
import { GAME_ICONS } from './pixel-icons/game'
import { LEARN_ICONS } from './pixel-icons/learn'
import { PIXEL_PALETTE } from './pixel-icons/palette'
import { VIZ_ICONS } from './pixel-icons/viz'

// Levelup's own pixel icon set (16×16, same pixel language as Loo). Grids live in ./pixel-icons/*.ts (one file per
// area), colours in ./pixel-icons/palette.ts.
// Preview: /design → «Піксельні іконки».

const ART = { ...BASE_ICONS, ...CONTENT_ICONS, ...GAME_ICONS, ...LEARN_ICONS, ...VIZ_ICONS }
const PAL = PIXEL_PALETTE

export type PixelIconName = keyof typeof ART
export const PIXEL_ICONS = Object.keys(ART) as PixelIconName[]

interface Run {
  x: number
  y: number
  w: number
  c: string
}

// Horizontal runs of one colour → one <rect> each (≈60 rects per icon instead of ≈200 cells).
const RUNS = new Map<PixelIconName, Run[]>()
function runs(name: PixelIconName): Run[] {
  let out = RUNS.get(name)
  if (out) return out
  out = []
  ART[name].forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const c = row.charAt(x)
      let w = 1
      while (row.charAt(x + w) === c) w++
      const fill = PAL[c]
      if (fill) out!.push({ x, y, w, c: fill })
      x += w
    }
  })
  RUNS.set(name, out)
  return out
}

export function PixelIcon({ name, size = 32, label, className }: { name: PixelIconName; size?: number; label?: string; className?: string }) {
  return (
    <svg
      className={cx('lu-pxicon', className)}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {runs(name).map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1.02} fill={r.c} />
      ))}
    </svg>
  )
}
