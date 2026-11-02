// Illustrations for blog/uk/event-loop-javascript-prostymy-slovamy.md — `pnpm tsx scripts/blog-art/<slug>.ts`.
import { block, C, canvas, H, loo, pixels, save, sparkle, text, W } from './kit'

const SLUG = 'event-loop-javascript-prostymy-slovamy'

/** Pixel arrow head pointing right (4×7 cells). */
function headRight(x: number, y: number, color: string, cell = 6): string {
  return pixels(['x...', 'xx..', 'xxx.', 'xxxx', 'xxx.', 'xx..', 'x...'], x, y - 3.5 * cell, cell, { x: color })
}

/** Pixel arrow head pointing left (4×7 cells). */
function headLeft(x: number, y: number, color: string, cell = 6): string {
  return pixels(['...x', '..xx', '.xxx', 'xxxx', '.xxx', '..xx', '...x'], x, y - 3.5 * cell, cell, { x: color })
}

/** Dashed horizontal arrow from x1 to x2 (pointing right). */
function arrowRight(x1: number, y: number, x2: number, color = C.ink3): string {
  return `<rect x="${x1}" y="${y - 6}" width="${x2 - x1 - 32}" height="12" fill="${color}"/>` + headRight(x2 - 32, y, color, 8)
}

/** A ring of pixel squares — the loop itself. */
function ring(cx: number, cy: number, r: number, color: string, size = 18, gaps: readonly number[] = []): string {
  let out = ''
  const n = Math.round((2 * Math.PI * r) / 34)
  for (let k = 0; k < n; k++) {
    if (gaps.some((a) => Math.abs(k / n - a) < 0.025)) continue
    const a = (k / n) * 2 * Math.PI
    out += `<rect x="${Math.round(cx + r * Math.cos(a) - size / 2)}" y="${Math.round(cy + r * Math.sin(a) - size / 2)}" width="${size}" height="${size}" fill="${color}"/>`
  }
  return out
}

/** Call stack: a tower of frames, the top one highlighted. */
function stack(x: number, y: number, frames: readonly string[], w = 300, h = 84): string {
  let out = ''
  frames.forEach((label, k) => {
    const top = k === frames.length - 1
    const fy = y - (k + 1) * (h + 14)
    out += block(x, fy, w, h, top ? C.yellow : C.white, top ? C.yellowDark : C.dot, 8)
    out += text(x + w / 2, fy + 54, label, { size: 32, weight: 700, color: C.ink, anchor: 'middle' })
  })
  return out + `<rect x="${x - 20}" y="${y}" width="${w + 40}" height="14" fill="${C.ink2}"/>`
}

/** Small token in a queue. */
function token(x: number, y: number, fill: string, lip: string, label = '', w = 96, h = 96): string {
  return block(x, y, w, h, fill, lip, 8) + (label ? text(x + w / 2, y + h / 2 + 10, label, { size: 28, color: C.white, anchor: 'middle' }) : '')
}

// Cover: Loo stands in the middle of the loop; a call stack on the left, two queues feeding into the ring.
const cover = canvas(
  ring(768, 500, 300, C.violet, 20, [0.25, 0.75]) +
    headRight(752, 200, C.violet, 10) +
    headLeft(744, 800, C.violet, 10) +
    loo(624, 380, 18, { eyes: 'happy' }) +
    stack(110, 880, ['main()', 'render()', 'onClick()']) +
    // microtasks (mint) and tasks (pink) waiting on the right
    token(1130, 260, C.mint, C.mintDark) +
    token(1240, 260, C.mint, C.mintDark) +
    token(1350, 260, C.mint, C.mintDark) +
    token(1130, 620, C.pink, C.pinkDark) +
    token(1240, 620, C.pink, C.pinkDark) +
    sparkle(1430, 180) +
    sparkle(560, 160, 5, C.mint) +
    sparkle(1000, 860, 5, C.violet) +
    `<rect x="0" y="900" width="${W}" height="${H - 900}" fill="${C.violetSoft}"/><rect x="0" y="900" width="${W}" height="12" fill="${C.violet}"/>`,
)

// img-1: the three places — call stack, microtask queue, task queue — and the loop between them.
const parts = canvas(
  text(120, 140, 'Стек і дві черги', { size: 64 }) +
    text(120, 200, 'мікрозадачі завжди йдуть першими', { size: 34, weight: 600, color: C.ink2 }) +
    stack(140, 900, ['script', 'load()', 'square()'], 320) +
    text(300, 960, 'стек викликів', { size: 34, weight: 700, color: C.ink2, anchor: 'middle' }) +
    // microtask queue
    block(640, 300, 760, 200, C.mintSoft, C.mint, 14) +
    text(670, 280, 'мікрозадачі', { size: 38, color: C.mintDark }) +
    token(680, 352, C.mint, C.mintDark, 'then', 140) +
    token(840, 352, C.mint, C.mintDark, 'await', 140) +
    token(1000, 352, C.mint, C.mintDark, 'queue…', 140) +
    text(1300, 418, 'усі', { size: 40, color: C.mintDark, anchor: 'middle' }) +
    // task queue
    block(640, 640, 760, 200, C.pinkSoft, C.pink, 14) +
    text(670, 620, 'макрозадачі', { size: 38, color: C.pinkDark }) +
    token(680, 692, C.pink, C.pinkDark, 'timer', 140) +
    token(840, 692, C.pink, C.pinkDark, 'click', 140) +
    text(1300, 758, 'одна', { size: 40, color: C.pinkDark, anchor: 'middle' }) +
    // arrows to the stack
    `<rect x="530" y="394" width="90" height="12" fill="${C.mintDark}"/>` +
    headLeft(498, 400, C.mintDark, 8) +
    `<rect x="530" y="734" width="90" height="12" fill="${C.pinkDark}"/>` +
    headLeft(498, 740, C.pinkDark, 8) +
    loo(1260, 880, 7, { eyes: 'normal', bulb: false }) +
    sparkle(1430, 240) +
    sparkle(560, 560, 5, C.violet),
)

// img-2: one turn of the loop as a strip of four steps with a return arrow.
function step(x: number, label: string, sub: string, fill: string, lip: string, color: string = C.white): string {
  return block(x, 420, 260, 240, fill, lip, 12) + text(x + 130, 525, label, { size: 40, color, anchor: 'middle' }) + text(x + 130, 585, sub, { size: 28, weight: 700, color, anchor: 'middle' })
}
const turn = canvas(
  text(120, 140, 'Один оберт циклу', { size: 64 }) +
    text(120, 200, 'і так знову і знову', { size: 34, weight: 600, color: C.ink2 }) +
    step(110, 'код', 'синхронний', C.yellow, C.yellowDark, C.ink) +
    arrowRight(378, 540, 456) +
    step(462, 'усі', 'мікрозадачі', C.mint, C.mintDark) +
    arrowRight(730, 540, 808) +
    step(814, 'кадр', 'рендеринг', C.violetSoft, C.violet, C.violetDark) +
    arrowRight(1082, 540, 1160) +
    step(1166, 'одна', 'макрозадача', C.pink, C.pinkDark) +
    // return arrow from the last step back to microtasks
    `<rect x="1290" y="690" width="12" height="110" fill="${C.ink3}"/>` +
    `<rect x="586" y="788" width="716" height="12" fill="${C.ink3}"/>` +
    `<rect x="586" y="720" width="12" height="80" fill="${C.ink3}"/>` +
    pixels(['...x...', '..xxx..', '.xxxxx.', 'xxxxxxx'], 564, 688, 8, { x: C.ink3 }) +
    loo(140, 760, 8, { eyes: 'happy' }) +
    sparkle(1430, 300) +
    sparkle(820, 880, 5, C.mint),
)

for (const [name, svg] of [
  ['cover', cover],
  ['img-1', parts],
  ['img-2', turn],
] as const) {
  console.log(await save(SLUG, name, svg))
}
