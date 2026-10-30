// Illustrations for blog/uk/promise-async-await-javascript.md — `pnpm tsx scripts/blog-art/<slug>.ts`.
import { block, C, canvas, H, loo, pixels, save, sparkle, text, W } from './kit'

const SLUG = 'promise-async-await-javascript'

/** Dashed arrow pointing left: the result comes back from x2 to x1. */
function arrowLeft(x1: number, y: number, x2: number, color = C.ink3): string {
  let out = pixels(['..x', '.xx', 'xxx', '.xx', '..x'], x1, y - 15, 6, { x: color })
  for (let x = x1 + 30; x < x2; x += 28) out += `<rect x="${x}" y="${y - 6}" width="16" height="12" fill="${color}"/>`
  return out
}

/** Diagonal dashed arrow made of pixel squares, ending in a small square head. */
function diagonal(x1: number, y1: number, x2: number, y2: number, color: string): string {
  const steps = Math.floor(Math.hypot(x2 - x1, y2 - y1) / 30)
  let out = ''
  for (let k = 0; k < steps; k++) {
    const t = k / steps
    out += `<rect x="${x1 + (x2 - x1) * t - 7}" y="${y1 + (y2 - y1) * t - 7}" width="14" height="14" fill="${color}"/>`
  }
  return out + `<rect x="${x2 - 12}" y="${y2 - 12}" width="24" height="24" fill="${color}"/>`
}

/** Pixel hourglass (9×11 cells) — pending. */
function hourglass(x: number, y: number, cell: number): string {
  return pixels(
    ['ddddddddd', '.d.....d.', '.dyyyyyd.', '..dyyyd..', '...dyd...', '....d....', '...d.d...', '..d...d..', '.d..y..d.', '.dyyyyyd.', 'ddddddddd'],
    x,
    y,
    cell,
    { d: C.ink2, y: C.yellow },
  )
}

/** Pixel check mark (7×6 cells) — fulfilled. */
function check(x: number, y: number, cell: number, color = C.white): string {
  return pixels(['......x', '.....xx', 'x...xx.', 'xx.xx..', '.xxx...', '..x....'], x, y, cell, { x: color })
}

/** Pixel cross (6×6 cells) — rejected. */
function cross(x: number, y: number, cell: number, color = C.white): string {
  return pixels(['xx..xx', '.xxxx.', '..xx..', '..xx..', '.xxxx.', 'xx..xx'], x, y, cell, { x: color })
}

/** Pixel parcel (10×9 cells) — the result travelling back. */
function parcel(x: number, y: number, cell: number): string {
  return pixels(
    ['bbbbybbbbb', 'bbbbybbbbb', 'dddddddddd', 'bbbbybbbbb', 'bbbbybbbbb', 'bbbbybbbbb', 'bbbbybbbbb', 'bbbbybbbbb', 'dddddddddd'],
    x,
    y,
    cell,
    { b: C.yellowSoft, d: C.yellowDark, y: C.yellow },
  )
}

/** Receipt ticket — the promise Loo holds while waiting. */
function ticket(x: number, y: number): string {
  return (
    block(x, y, 230, 290, C.white, C.dot, 10) +
    `<rect x="${x}" y="${y}" width="230" height="290" fill="none" stroke="${C.violet}" stroke-width="8"/>` +
    text(x + 115, y + 70, 'Promise', { size: 40, color: C.violetDark, anchor: 'middle' }) +
    `<rect x="${x + 30}" y="${y + 110}" width="170" height="14" fill="${C.dot}"/>` +
    `<rect x="${x + 30}" y="${y + 145}" width="130" height="14" fill="${C.dot}"/>` +
    hourglass(x + 88, y + 180, 6)
  )
}

// Cover: Loo holds a promise ticket; a server sends the result back as a parcel; three state lights above.
const cover = canvas(
  ticket(150, 330) +
    loo(400, 470, 18, { eyes: 'happy' }) +
    arrowLeft(730, 640, 1010, C.violet) +
    parcel(800, 470, 14) +
    // server
    block(1060, 300, 340, 520, C.violetSoft, C.violet, 16) +
    [0, 1, 2]
      .map((k) => block(1100, 350 + k * 150, 260, 110, C.white, C.dot, 8) + `<rect x="${1130}" y="${395 + k * 150}" width="20" height="20" fill="${k === 1 ? C.yellow : C.mint}"/>` + `<rect x="${1170}" y="${398 + k * 150}" width="150" height="14" fill="${C.dot}"/>`)
      .join('') +
    // state lights
    block(560, 140, 130, 110, C.yellow, C.yellowDark, 10) +
    hourglass(598, 158, 6) +
    block(720, 140, 130, 110, C.mint, C.mintDark, 10) +
    check(757, 170, 8) +
    block(880, 140, 130, 110, C.pink, C.pinkDark, 10) +
    cross(921, 171, 8) +
    sparkle(520, 120) +
    sparkle(1450, 260, 5, C.mint) +
    sparkle(1060, 220, 5, C.violet) +
    `<rect x="0" y="900" width="${W}" height="${H - 900}" fill="${C.mintSoft}"/><rect x="0" y="900" width="${W}" height="12" fill="${C.mint}"/>`,
)

// img-1: pending → fulfilled / rejected, the state changes only once.
const states = canvas(
  text(120, 140, 'Три стани промісу', { size: 64 }) +
    text(120, 200, 'стан змінюється лише один раз', { size: 34, weight: 600, color: C.ink2 }) +
    block(140, 400, 400, 300, C.yellowSoft, C.yellow, 14) +
    hourglass(286, 440, 12) +
    text(340, 650, 'pending', { size: 48, anchor: 'middle' }) +
    diagonal(580, 500, 900, 340, C.mint) +
    diagonal(580, 600, 900, 760, C.pink) +
    block(940, 250, 440, 220, C.mint, C.mintDark, 14) +
    check(980, 310, 14) +
    text(1250, 345, 'fulfilled', { size: 46, anchor: 'middle' }) +
    text(1250, 405, 'then', { size: 36, weight: 700, color: C.ink2, anchor: 'middle' }) +
    block(940, 650, 440, 220, C.pink, C.pinkDark, 14) +
    cross(985, 715, 14) +
    text(1250, 745, 'rejected', { size: 46, anchor: 'middle' }) +
    text(1250, 805, 'catch', { size: 36, weight: 700, color: C.white, anchor: 'middle' }) +
    loo(160, 760, 8, { eyes: 'normal', bulb: false }) +
    sparkle(1420, 240) +
    sparkle(900, 560, 5, C.violet),
)

// img-2: two 1-second requests, one after another vs. together with Promise.all.
const unit = 480 // px per second
function bar(x: number, y: number, w: number, label: string, fill: string, lip: string): string {
  return block(x, y, w, 100, fill, lip, 10) + text(x + w / 2, y + 64, label, { size: 38, color: C.white, anchor: 'middle' })
}
const timeline = canvas(
  text(120, 140, 'Послідовно чи паралельно', { size: 64 }) +
    text(120, 200, 'два запити по одній секунді', { size: 34, weight: 600, color: C.ink2 }) +
    // axis
    `<rect x="300" y="880" width="${2 * unit + 40}" height="8" fill="${C.ink3}"/>` +
    [0, 1, 2].map((s) => `<rect x="${300 + s * unit - 4}" y="864" width="8" height="40" fill="${C.ink3}"/>` + text(300 + s * unit, 950, `${s} с`, { size: 34, weight: 700, color: C.ink2, anchor: 'middle' })).join('') +
    // sequential
    text(120, 340, 'await', { size: 40, color: C.pinkDark }) +
    text(120, 385, 'await', { size: 40, color: C.pinkDark }) +
    bar(300, 290, unit - 10, 'getUser()', C.pink, C.pinkDark) +
    bar(300 + unit, 290, unit - 10, 'getOrders()', C.pink, C.pinkDark) +
    // parallel
    text(120, 610, 'Promise', { size: 36, color: C.mintDark }) +
    text(120, 655, '.all', { size: 36, color: C.mintDark }) +
    bar(300, 520, unit - 10, 'getUser()', C.mint, C.mintDark) +
    bar(300, 640, unit - 10, 'getOrders()', C.mint, C.mintDark) +
    block(1180, 520, 220, 220, C.yellow, C.yellowDark, 12) +
    text(1290, 640, '−1 с', { size: 64, anchor: 'middle' }) +
    text(1290, 700, 'швидше', { size: 30, weight: 700, color: C.ink2, anchor: 'middle' }) +
    loo(1300, 220, 8, { eyes: 'happy' }) +
    sparkle(1430, 500) +
    sparkle(1160, 780, 5, C.mint),
)

for (const [name, svg] of [
  ['cover', cover],
  ['img-1', states],
  ['img-2', timeline],
] as const) {
  console.log(await save(SLUG, name, svg))
}
