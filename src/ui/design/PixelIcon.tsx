import { cx } from './cx'
import type { PixelIconName } from './pixel-icons/names'

export { PIXEL_ICONS, type PixelIconName } from './pixel-icons/names'

// Levelup's own pixel icon set (16×16, same pixel language as Loo). Grids live in ./pixel-icons/*.ts (one file per
// area), colours in ./pixel-icons/palette.ts. They're drawn once into a sprite (./pixel-sprite.ts → /pixel-icons.svg);
// an icon is a <use> of its symbol: ~80 bytes of markup instead of ~1.3 KB, and no atlas in the client bundles.
// The version (a hash of the grids, next.config.ts) makes the sprite cacheable forever.
// Preview: /design → «Піксельні іконки».

export const PIXEL_SPRITE_URL = `/pixel-icons.svg?v=${process.env.NEXT_PUBLIC_PIXEL_SPRITE ?? 'dev'}`

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
      <use href={`${PIXEL_SPRITE_URL}#${name}`} />
    </svg>
  )
}
