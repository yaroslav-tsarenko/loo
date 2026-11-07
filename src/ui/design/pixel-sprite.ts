import { BASE_ICONS } from './pixel-icons/base'
import { CONTENT_ICONS } from './pixel-icons/content'
import { FLAG_ICONS } from './pixel-icons/flags'
import { GAME_ICONS } from './pixel-icons/game'
import { LEARN_ICONS } from './pixel-icons/learn'
import { PIXEL_PALETTE } from './pixel-icons/palette'
import { RANK_ICONS } from './pixel-icons/ranks'
import { VIZ_ICONS } from './pixel-icons/viz'

// The pixel icons drawn once, server-side, into one SVG sprite (/pixel-icons.svg — src/app/pixel-icons.svg/route.ts).
// Pages reference a symbol (<use>, src/ui/design/PixelIcon.tsx) instead of inlining ~1.3 KB of paths per icon: the
// course path shows ~300 of them (≈400 KB of HTML), and every client bundle that drew one carried the whole atlas.

export const PIXEL_ART = { ...BASE_ICONS, ...CONTENT_ICONS, ...FLAG_ICONS, ...GAME_ICONS, ...LEARN_ICONS, ...RANK_ICONS, ...VIZ_ICONS }

interface Layer {
  fill: string
  d: string
}

// Horizontal runs of one colour, all runs of a colour in ONE <path> (`M x y h w v1.02 h-w z` each).
export function pixelLayers(name: keyof typeof PIXEL_ART): Layer[] {
  const byFill = new Map<string, string>()
  PIXEL_ART[name].forEach((row: string, y: number) => {
    let x = 0
    while (x < row.length) {
      const c = row.charAt(x)
      let w = 1
      while (row.charAt(x + w) === c) w++
      const fill = PIXEL_PALETTE[c as keyof typeof PIXEL_PALETTE]
      if (fill) byFill.set(fill, `${byFill.get(fill) ?? ''}M${x} ${y}h${w}v1.02h-${w}z`)
      x += w
    }
  })
  return [...byFill].map(([fill, d]) => ({ fill, d }))
}

export function pixelSprite(): string {
  const symbols = (Object.keys(PIXEL_ART) as Array<keyof typeof PIXEL_ART>).map(
    (name) => `<symbol id="${name}" viewBox="0 0 16 16">${pixelLayers(name).map((l) => `<path fill="${l.fill}" d="${l.d}"/>`).join('')}</symbol>`,
  )
  return `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">${symbols.join('')}</svg>`
}
