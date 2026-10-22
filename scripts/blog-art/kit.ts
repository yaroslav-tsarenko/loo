// Blog illustration kit (docs/BLOG.md → «Ілюстрації»): pixel-soft scenes in the Loo style, drawn as SVG and saved as
// webp (1536×1024) into public/blog/<slug>/. One look for every article: off-white canvas with a dot grid, violet / mint
// / yellow accents, pixel Loo, Onest-like sans text only for short labels.
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

export const W = 1536
export const H = 1024

export const C = {
  bg: '#fbf9f4',
  dot: '#e9e4f5',
  ink: '#2a2145',
  ink2: '#655a85',
  ink3: '#a398c2',
  violet: '#7c4dff',
  violetDark: '#5b2fd6',
  violetSoft: '#e9e0ff',
  mint: '#2dd4bf',
  mintDark: '#0f9f8f',
  mintSoft: '#d5f7f1',
  yellow: '#ffc800',
  yellowDark: '#d9a400',
  yellowSoft: '#fff3c4',
  pink: '#f472b6',
  pinkDark: '#d9468f',
  pinkSoft: '#fde0ef',
  blue: '#3b82f6',
  blueDark: '#1d5fd1',
  blueSoft: '#dbe8ff',
  white: '#ffffff',
}

const FONT = "Onest, 'Helvetica Neue', Helvetica, Arial, sans-serif"

export function canvas(body: string, { bg = C.bg, dots = true } = {}): string {
  const grid = dots
    ? `<defs><pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><rect x="15" y="15" width="3" height="3" fill="${C.dot}"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#dots)"/>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges"><rect width="${W}" height="${H}" fill="${bg}"/>${grid}${body}</svg>`
}

/** A grid of pixels from string rows; `.` is empty, other chars map through `colors`. */
export function pixels(rows: readonly string[], x: number, y: number, cell: number, colors: Record<string, string>): string {
  let out = ''
  rows.forEach((row, j) => {
    ;[...row].forEach((ch, i) => {
      const c = colors[ch]
      if (c) out += `<rect x="${x + i * cell}" y="${y + j * cell}" width="${cell}" height="${cell}" fill="${c}"/>`
    })
  })
  return out
}

const LOO_ROWS = [
  '.......oo.......',
  '.......oo.......',
  '........s.......',
  '.......s........',
  '........s.......',
  '...bbbbbbbbbb...',
  '..bbbbbbbbbbbb..',
  '..bbbbbbbbbbbb..',
  '..bbbbbbbbbbbb..',
  '..bbbbbbbbbbbb..',
  'bbbbbbbbbbbbbbbb',
  '..bpbbbbbbbbpb..',
  '..dddddddddddd..',
  '..ddd......ddd..',
]
const LOO_EYES = {
  normal: [[4, 8], [4, 9], [11, 8], [11, 9]],
  happy: [[4, 8], [3, 9], [5, 9], [11, 8], [10, 9], [12, 9]],
  squint: [[3, 8], [4, 9], [3, 9], [12, 8], [11, 9], [12, 9]],
} as const

/** Pixel Loo, 16×14 cells, top-left at (x, y). */
export function loo(x: number, y: number, cell: number, { eyes = 'happy', bulb = true }: { eyes?: keyof typeof LOO_EYES; bulb?: boolean } = {}): string {
  const rows = [...LOO_ROWS]
  const set = (i: number, j: number, ch: string) => {
    rows[j] = rows[j]!.slice(0, i) + ch + rows[j]!.slice(i + 1)
  }
  for (const [i, j] of LOO_EYES[eyes]) set(i, j, 'k')
  if (bulb) {
    rows[0] = rows[0]!.replace(/o/g, 'O')
    rows[1] = rows[1]!.replace(/o/g, 'O')
  }
  const glow = bulb ? `<rect x="${x + 5 * cell}" y="${y - 2 * cell}" width="${6 * cell}" height="${6 * cell}" fill="${C.yellow}" opacity="0.18"/>` : ''
  return glow + pixels(rows, x, y, cell, { b: '#8B5CF6', d: '#6D28D9', k: '#1E1033', s: '#4C1D95', o: '#DDD6FE', O: C.yellow, p: '#F9A8D4' })
}

/** A box with stepped (pixel) corners and a darker bottom lip, like the app's buttons. */
export function block(x: number, y: number, w: number, h: number, fill: string, lip: string, step = 8): string {
  const s = step
  const body = `<path d="M${x + s} ${y}h${w - 2 * s}v${s}h${s}v${h - 2 * s}h${-s}v${s}h${-(w - 2 * s)}v${-s}h${-s}v${-(h - 2 * s)}h${s}z" fill="${fill}"/>`
  const bottom = `<rect x="${x + s}" y="${y + h - s}" width="${w - 2 * s}" height="${s}" fill="${lip}"/>`
  return body + bottom
}

export function text(x: number, y: number, value: string, { size = 40, weight = 800, color = C.ink, anchor = 'start' }: { size?: number; weight?: number; color?: string; anchor?: 'start' | 'middle' | 'end' } = {}): string {
  const esc = value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}" shape-rendering="geometricPrecision">${esc}</text>`
}

/** Four-point pixel sparkle. */
export function sparkle(x: number, y: number, cell = 6, color = C.yellow): string {
  return pixels(['.x.', 'xxx', '.x.'], x - cell * 1.5, y - cell * 1.5, cell, { x: color })
}

export function cloud(x: number, y: number, cell = 12, color = C.white): string {
  return pixels(['...xxxx....', '.xxxxxxxx..', 'xxxxxxxxxxx', '.xxxxxxxxx.'], x, y, cell, { x: color })
}

export function flag(x: number, y: number, color: string, cell = 8): string {
  return pixels(['xfff.', 'xffff', 'xfff.', 'x....', 'x....', 'x....', 'x....'], x, y, cell, { x: C.ink2, f: color })
}

/** Renders SVG → webp at public/blog/<slug>/<name>.webp; returns the public path. */
export async function save(slug: string, name: string, svg: string): Promise<string> {
  const dir = path.join(process.cwd(), 'public', 'blog', slug)
  await mkdir(dir, { recursive: true })
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(path.join(dir, `${name}.webp`))
  return `/blog/${slug}/${name}.webp`
}
