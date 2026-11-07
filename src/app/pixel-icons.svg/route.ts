import { pixelSprite } from '@/ui/design/pixel-sprite'

// The pixel icon sprite (src/ui/design/pixel-sprite.ts), prerendered at build. Pages ask for
// /pixel-icons.svg?v=<hash of the grids> (next.config.ts → NEXT_PUBLIC_PIXEL_SPRITE), so browsers may keep it forever.
export const dynamic = 'force-static'

export function GET() {
  return new Response(pixelSprite(), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=31536000, immutable' },
  })
}
