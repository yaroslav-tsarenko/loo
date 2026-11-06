// Illustrations for blog/uk/metody-masyviv-javascript-map-filter-reduce.md — `pnpm tsx scripts/blog-art/<slug>.ts`.
import { block, C, canvas, H, loo, pixels, save, sparkle, text, W } from './kit'

const SLUG = 'metody-masyviv-javascript-map-filter-reduce'

/** Right-pointing pixel arrow with a dashed tail from x1 to x2. */
function arrow(x1: number, x2: number, y: number, color = C.ink3): string {
  let out = ''
  for (let x = x1; x < x2 - 30; x += 28) out += `<rect x="${x}" y="${y - 6}" width="16" height="12" fill="${color}"/>`
  return out + pixels(['x..', 'xx.', 'xxx', 'xx.', 'x..'], x2 - 18, y - 15, 6, { x: color })
}

type Tone = readonly [fill: string, lip: string]
const VIOLET: Tone = [C.violet, C.violetDark]
const MINT: Tone = [C.mint, C.mintDark]
const YELLOW: Tone = [C.yellow, C.yellowDark]
const PINK: Tone = [C.pink, C.pinkDark]
const BLUE: Tone = [C.blue, C.blueDark]

/** A row of square element blocks (an array) starting at x. */
function items(x: number, y: number, tones: readonly Tone[], size = 70, gap = 16): string {
  return tones.map(([f, l], i) => block(x + i * (size + gap), y, size, size, f, l, 8)).join('')
}

/** Array brackets around a row of n blocks. */
function brackets(x: number, y: number, n: number, size = 70, gap = 16): string {
  const w = n * (size + gap) - gap
  const h = size + 30
  const b = (bx: number, dir: 1 | -1) =>
    `<rect x="${bx}" y="${y - 15}" width="10" height="${h}" fill="${C.ink2}"/>` +
    `<rect x="${dir === 1 ? bx : bx - 14}" y="${y - 15}" width="24" height="10" fill="${C.ink2}"/>` +
    `<rect x="${dir === 1 ? bx : bx - 14}" y="${y - 15 + h - 10}" width="24" height="10" fill="${C.ink2}"/>`
  return b(x - 30, 1) + b(x + w + 20, -1)
}

// Cover: a conveyor belt with three stations; blocks enter mixed and leave as one golden block.
const belt = `<rect x="80" y="690" width="${W - 160}" height="40" fill="${C.ink2}"/>` + [...Array(24)].map((_, i) => `<rect x="${100 + i * 56}" y="700" width="28" height="20" fill="${C.ink3}"/>`).join('')
function station(x: number, label: string, [f, l]: Tone): string {
  return block(x, 330, 250, 230, f, l, 14) + `<rect x="${x + 30}" y="560" width="20" height="130" fill="${l}"/><rect x="${x + 200}" y="560" width="20" height="130" fill="${l}"/>` + text(x + 125, 470, label, { size: 54, color: C.white, anchor: 'middle' })
}
const cover = canvas(
  belt +
    items(110, 620, [PINK, BLUE, YELLOW], 60, 12) +
    station(380, 'map', VIOLET) +
    items(650, 620, [MINT, MINT, MINT], 60, 12) +
    station(880, 'filter', BLUE) +
    items(1150, 620, [MINT, MINT], 60, 12) +
    block(1300, 520, 160, 160, C.yellow, C.yellowDark, 12) +
    text(1380, 470, 'reduce', { size: 44, color: C.yellowDark, anchor: 'middle' }) +
    loo(110, 420, 14, { eyes: 'happy' }) +
    sparkle(1470, 500) +
    sparkle(1280, 420, 5, C.violet) +
    sparkle(820, 260, 5, C.mint) +
    `<rect x="0" y="900" width="${W}" height="${H - 900}" fill="${C.violetSoft}"/><rect x="0" y="900" width="${W}" height="12" fill="${C.violet}"/>`,
)

// img-1: what each method returns — map keeps the length, filter keeps some, reduce gives one value.
function row(y: number, name: string, note: string, out: string): string {
  return (
    text(120, y + 50, name, { size: 52, color: C.violetDark }) +
    text(120, y + 95, note, { size: 28, weight: 600, color: C.ink2 }) +
    brackets(450, y, 4) +
    items(450, y, [PINK, BLUE, YELLOW, MINT]) +
    arrow(830, 960, y + 35) +
    out
  )
}
const methods = canvas(
  text(120, 130, 'Що повертає метод', { size: 64 }) +
    row(230, 'map', 'та сама довжина', brackets(1030, 230, 4) + items(1030, 230, [VIOLET, VIOLET, VIOLET, VIOLET])) +
    row(470, 'filter', 'лише підхожі', brackets(1030, 470, 2) + items(1030, 470, [YELLOW, MINT])) +
    row(710, 'reduce', 'одне значення', block(1030, 690, 120, 120, C.yellow, C.yellowDark, 12)) +
    loo(1300, 760, 8, { eyes: 'normal', bulb: false }) +
    sparkle(1180, 700) +
    sparkle(1430, 200, 5, C.mint),
)

// img-2: sort rearranges the same box; toSorted leaves it and builds a new one.
function bars(x: number, y: number, heights: readonly number[], [f, l]: Tone): string {
  return heights.map((h, i) => block(x + i * 70, y + 220 - h, 54, h, f, l, 6)).join('')
}
function box(x: number, y: number, w: number, color: string): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="270" fill="${C.white}" stroke="${color}" stroke-width="8"/>`
}
const UNSORTED = [140, 60, 200, 100]
const SORTED = [60, 100, 140, 200]
const mutation = canvas(
  text(120, 130, 'sort чи toSorted', { size: 64 }) +
    // sort: same box, rearranged
    text(120, 260, 'sort()', { size: 46, color: C.pinkDark }) +
    text(120, 305, 'змінює оригінал', { size: 28, weight: 600, color: C.ink2 }) +
    box(470, 200, 320, C.pink) +
    bars(495, 220, UNSORTED, PINK) +
    arrow(820, 960, 335, C.pink) +
    box(990, 200, 320, C.pink) +
    bars(1015, 220, SORTED, PINK) +
    text(1150, 520, 'той самий масив', { size: 30, weight: 700, color: C.pinkDark, anchor: 'middle' }) +
    // toSorted: original stays, new box appears
    text(120, 660, 'toSorted()', { size: 46, color: C.mintDark }) +
    text(120, 705, 'створює копію', { size: 28, weight: 600, color: C.ink2 }) +
    box(470, 600, 320, C.mint) +
    bars(495, 620, UNSORTED, MINT) +
    arrow(820, 960, 735, C.mint) +
    box(990, 600, 320, C.violet) +
    bars(1015, 620, SORTED, VIOLET) +
    text(1150, 920, 'новий масив', { size: 30, weight: 700, color: C.violetDark, anchor: 'middle' }) +
    loo(1360, 100, 8, { eyes: 'happy' }) +
    sparkle(1340, 640) +
    sparkle(940, 560, 5, C.violet),
)

for (const [name, svg] of [
  ['cover', cover],
  ['img-1', methods],
  ['img-2', mutation],
] as const) {
  console.log(await save(SLUG, name, svg))
}
