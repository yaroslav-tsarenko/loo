import { MARK_BOX, markRects } from '../mascot/pixels'

// src/app/favicon.ico: the logo mark at exactly 1, 2 and 3 device px per cell (16/32/48px), so browser tabs get
// crisp pixels instead of a downscaled 512px icon. No tile here: at 16px a tile would squeeze Loo below 1px per cell,
// and bare violet reads on both light and dark tab strips. Uncompressed 32-bit BMP entries keep the bytes deterministic —
// tests/unit/loo.test.ts checks the committed file against this; regenerate with `pnpm exec tsx scripts/favicon.ts`.

export const FAVICON_SIZES = [16, 32, 48] as const

function hexRgb(c: string): [number, number, number] {
  const n = Number.parseInt(c.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** RGBA pixels of the mark, top-down, `scale` px per cell. */
export function markBitmap(scale: number): Uint8Array {
  const [bx, by, bw] = MARK_BOX
  const size = bw * scale
  const out = new Uint8Array(size * size * 4)
  for (const p of markRects()) {
    const [r, g, b] = hexRgb(p.c)
    const a = Math.round((p.o ?? 1) * 255)
    for (let y = (p.y - by) * scale; y < (p.y - by + p.h) * scale; y++) {
      for (let x = (p.x - bx) * scale; x < (p.x - bx + p.w) * scale; x++) {
        if (x < 0 || y < 0 || x >= size || y >= size) continue
        out.set([r, g, b, a], (y * size + x) * 4)
      }
    }
  }
  return out
}

function bmpEntry(size: number, rgba: Uint8Array): Uint8Array {
  const maskRow = Math.ceil(size / 32) * 4
  const buf = new Uint8Array(40 + size * size * 4 + maskRow * size)
  const v = new DataView(buf.buffer)
  v.setUint32(0, 40, true)
  v.setInt32(4, size, true)
  v.setInt32(8, size * 2, true) // XOR bitmap + AND mask
  v.setUint16(12, 1, true)
  v.setUint16(14, 32, true)
  v.setUint32(20, buf.length - 40, true)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4
      const dst = 40 + ((size - 1 - y) * size + x) * 4 // bottom-up, BGRA
      buf.set([rgba[src + 2] ?? 0, rgba[src + 1] ?? 0, rgba[src] ?? 0, rgba[src + 3] ?? 0], dst)
    }
  }
  return buf // AND mask stays zero: the alpha channel decides transparency
}

export function faviconIco(): Uint8Array {
  const images = FAVICON_SIZES.map((s) => bmpEntry(s, markBitmap(s / MARK_BOX[2])))
  const head = 6 + 16 * images.length
  const out = new Uint8Array(head + images.reduce((n, img) => n + img.length, 0))
  const v = new DataView(out.buffer)
  v.setUint16(2, 1, true)
  v.setUint16(4, images.length, true)
  let offset = head
  images.forEach((img, i) => {
    const size = FAVICON_SIZES[i] ?? 0
    const e = 6 + 16 * i
    out[e] = size
    out[e + 1] = size
    v.setUint16(e + 4, 1, true)
    v.setUint16(e + 6, 32, true)
    v.setUint32(e + 8, img.length, true)
    v.setUint32(e + 12, offset, true)
    out.set(img, offset)
    offset += img.length
  })
  return out
}
