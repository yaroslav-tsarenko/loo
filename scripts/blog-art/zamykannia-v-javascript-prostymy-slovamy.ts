// Illustrations for blog/uk/zamykannia-v-javascript-prostymy-slovamy.md — `pnpm tsx scripts/blog-art/<slug>.ts`.
import { block, C, canvas, H, loo, pixels, save, sparkle, text, W } from './kit'

const SLUG = 'zamykannia-v-javascript-prostymy-slovamy'

/** Pixel backpack (11×12 cells) — the "environment" a function carries. */
function backpack(x: number, y: number, cell: number): string {
  return pixels(
    [
      '...hhhhh...',
      '..h.....h..',
      '..h.....h..',
      '.bbbbbbbbb.',
      'bbbbbbbbbbb',
      'bbbbbbbbbbb',
      'bbdddddddbb',
      'bbdyyyyydbb',
      'bbdddddddbb',
      'bbbbbbbbbbb',
      'bbbbbbbbbbb',
      '.bbbbbbbbb.',
    ],
    x,
    y,
    cell,
    { h: C.mintDark, b: C.mint, d: C.mintDark, y: C.yellow },
  )
}

/** A variable chip: name = value. */
function chip(x: number, y: number, label: string, fill: string, lip: string, w = 300): string {
  return block(x, y, w, 96, fill, lip, 8) + text(x + w / 2, y + 62, label, { size: 40, color: fill === C.yellow ? C.ink : C.white, anchor: 'middle' })
}

function arrow(x1: number, y: number, x2: number, color = C.ink3): string {
  let out = ''
  for (let x = x1; x < x2 - 30; x += 28) out += `<rect x="${x}" y="${y - 6}" width="16" height="12" fill="${color}"/>`
  return out + pixels(['x..', 'xx.', 'xxx', 'xx.', 'x..'], x2 - 30, y - 15, 6, { x: color })
}

// Cover: an outer function "room" left behind, Loo walking away with a backpack of variables.
const cover = canvas(
  block(110, 230, 560, 600, C.violetSoft, C.violetSoft, 16) +
    `<rect x="110" y="230" width="560" height="600" fill="none" stroke="${C.violet}" stroke-width="10" stroke-dasharray="28 18"/>` +
    text(150, 300, 'function outer()', { size: 44, color: C.violetDark }) +
    chip(170, 380, 'name', C.violet, C.violetDark, 200) +
    chip(400, 380, 'count', C.blue, C.blueDark, 220) +
    chip(170, 520, 'greeting', C.pink, C.pinkDark, 280) +
    arrow(700, 560, 900) +
    backpack(975, 580, 16) +
    loo(1110, 520, 18, { eyes: 'happy' }) +
    chip(940, 300, 'name', C.violet, C.violetDark, 180) +
    chip(1140, 240, 'count', C.blue, C.blueDark, 200) +
    chip(1180, 360, 'greeting', C.pink, C.pinkDark, 260) +
    sparkle(930, 260) +
    sparkle(1420, 220, 5, C.mint) +
    sparkle(1460, 520, 5, C.violet) +
    `<rect x="0" y="900" width="${W}" height="${H - 900}" fill="${C.mintSoft}"/><rect x="0" y="900" width="${W}" height="12" fill="${C.mint}"/>`,
)

// img-1: makeGreeting finished, but the returned function still sees its variables.
const carry = canvas(
  text(120, 140, 'Функція забирає змінні з собою', { size: 60 }) +
    text(120, 200, 'зовнішня вже завершилася, а середовище живе', { size: 34, weight: 600, color: C.ink2 }) +
    block(120, 290, 560, 520, C.white, C.dot, 14) +
    `<rect x="120" y="290" width="560" height="520" fill="none" stroke="${C.ink3}" stroke-width="8" stroke-dasharray="24 16"/>` +
    text(160, 360, 'makeGreeting()', { size: 42, color: C.ink2 }) +
    text(160, 410, 'завершилася', { size: 32, weight: 600, color: C.ink3 }) +
    chip(170, 470, "name = 'Ольга'", C.violet, C.violetDark, 440) +
    chip(170, 610, "greeting = 'Привіт'", C.pink, C.pinkDark, 440) +
    arrow(720, 600, 900, C.violet) +
    block(930, 330, 480, 470, C.violetSoft, C.violet, 14) +
    text(1170, 410, 'greetOlha()', { size: 44, color: C.violetDark, anchor: 'middle' }) +
    backpack(1050, 470, 12) +
    loo(1220, 600, 9, { eyes: 'happy', bulb: false }) +
    text(1170, 760, 'Привіт, Ольга!', { size: 40, anchor: 'middle' }) +
    sparkle(1400, 330) +
    sparkle(900, 300, 5, C.mint),
)

// img-2: var — one shared variable; let — a new variable per iteration.
function callback(x: number, y: number, fill: string, lip: string): string {
  return block(x, y, 200, 80, fill, lip, 8) + text(x + 100, y + 54, '() => i', { size: 32, color: C.white, anchor: 'middle' })
}
const loop = canvas(
  text(120, 130, 'var чи let у циклі', { size: 64 }) +
    text(120, 190, 'на що дивляться колбеки setTimeout', { size: 34, weight: 600, color: C.ink2 }) +
    `<rect x="${W / 2 - 4}" y="250" width="8" height="680" fill="${C.dot}"/>` +
    // var side
    text(380, 300, 'var', { size: 56, color: C.pinkDark, anchor: 'middle' }) +
    [0, 1, 2].map((k) => callback(120, 380 + k * 150, C.pink, C.pinkDark)).join('') +
    [0, 1, 2].map((k) => arrow(340, 420 + k * 150, 460, C.pink)).join('') +
    block(470, 380, 220, 380, C.yellow, C.yellowDark, 10) +
    text(580, 588, 'i = 3', { size: 48, anchor: 'middle' }) +
    text(380, 880, 'одна змінна: 3, 3, 3', { size: 38, anchor: 'middle' }) +
    // let side
    text(1150, 300, 'let', { size: 56, color: C.mintDark, anchor: 'middle' }) +
    [0, 1, 2]
      .map(
        (k) =>
          callback(880, 380 + k * 150, C.mint, C.mintDark) +
          arrow(1100, 420 + k * 150, 1220, C.mint) +
          block(1230, 380 + k * 150, 190, 80, C.yellow, C.yellowDark, 8) +
          text(1325, 434 + k * 150, `i = ${k}`, { size: 38, anchor: 'middle' }),
      )
      .join('') +
    text(1150, 880, 'своя змінна: 0, 1, 2', { size: 38, anchor: 'middle' }) +
    loo(1360, 110, 7, { eyes: 'squint' }) +
    sparkle(1440, 330, 5, C.mint),
)

for (const [name, svg] of [
  ['cover', cover],
  ['img-1', carry],
  ['img-2', loop],
] as const) {
  console.log(await save(SLUG, name, svg))
}
