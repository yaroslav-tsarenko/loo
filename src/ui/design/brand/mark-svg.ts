import { MARK_BOX, markRects, outlineRects, rectSvg } from '../mascot/pixels'

// Pixel Loo as a standalone SVG string — for next/og icons and anywhere React can't render.
// `outline` adds a 1-cell sticker ring so violet Loo pops off the green app tile.
export function logoMarkSvg(size = 160, { outline }: { outline?: string } = {}): string {
  const body = markRects()
  const ring = outline ? outlineRects(body, outline) : []
  const pad = ring.length ? 1 : 0
  const [x, y, w, h] = MARK_BOX
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${x - pad} ${y - pad} ${w + pad * 2} ${h + pad * 2}" shape-rendering="crispEdges">`,
    ...ring.map(rectSvg),
    ...body.map(rectSvg),
    '</svg>',
  ].join('')
}

export function logoMarkDataUri(size?: number, options?: { outline?: string }): string {
  return `data:image/svg+xml;base64,${btoa(logoMarkSvg(size, options))}`
}
