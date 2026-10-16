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

interface Layer {
  fill: string
  d: string
}

// Horizontal runs of one colour, all runs of a colour in ONE <path> (`M x y h w v1.02 h-w z` each): ≈1 KB of markup per
// icon instead of ≈4 KB of <rect>s — a course path page shows hundreds of them (docs/PERFORMANCE.md).
const LAYERS = new Map<PixelIconName, Layer[]>()
function layers(name: PixelIconName): Layer[] {
  let out = LAYERS.get(name)
  if (out) return out
  const byFill = new Map<string, string>()
  ART[name].forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const c = row.charAt(x)
      let w = 1
      while (row.charAt(x + w) === c) w++
      const fill = PAL[c]
      if (fill) byFill.set(fill, `${byFill.get(fill) ?? ''}M${x} ${y}h${w}v1.02h-${w}z`)
      x += w
    }
  })
  out = [...byFill].map(([fill, d]) => ({ fill, d }))
  LAYERS.set(name, out)
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
      {layers(name).map((l) => (
        <path key={l.fill} d={l.d} fill={l.fill} />
      ))}
    </svg>
  )
}
