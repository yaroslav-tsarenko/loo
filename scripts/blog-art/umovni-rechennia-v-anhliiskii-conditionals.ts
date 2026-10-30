// Illustrations for blog/uk/umovni-rechennia-v-anhliiskii-conditionals.md — `pnpm tsx scripts/blog-art/<slug>.ts`.
import { block, C, canvas, H, loo, pixels, save, sparkle, text, W } from './kit'

const SLUG = 'umovni-rechennia-v-anhliiskii-conditionals'

const types = [
  { n: '0', label: 'Zero', fill: C.mint, lip: C.mintDark, ink: C.ink },
  { n: '1', label: 'First', fill: C.blue, lip: C.blueDark, ink: C.white },
  { n: '2', label: 'Second', fill: C.violet, lip: C.violetDark, ink: C.white },
  { n: '3', label: 'Third', fill: C.pink, lip: C.pinkDark, ink: C.ink },
]

// Cover: an «if» signpost; four pixel paths fan out to the four conditional types, Loo at the crossroads.
const SIGN_X = 220
const SIGN_Y = 420
let paths = ''
types.forEach((t, i) => {
  const ty = 150 + i * 200
  // stepped pixel path from the sign to each target block
  const steps = 7
  for (let s = 0; s <= steps; s++) {
    const x = SIGN_X + 330 + s * 70
    const y = SIGN_Y + 60 + ((ty + 70 - (SIGN_Y + 60)) * s) / steps
    paths += `<rect x="${x}" y="${Math.round(y / 8) * 8}" width="40" height="16" fill="${t.fill}" opacity="0.55"/>`
  }
})
const cover = canvas(
  paths +
    `<rect x="${SIGN_X + 130}" y="${SIGN_Y + 120}" width="24" height="380" fill="${C.ink2}"/>` +
    block(SIGN_X, SIGN_Y, 300, 150, C.yellow, C.yellowDark, 12) +
    text(SIGN_X + 150, SIGN_Y + 105, 'if', { size: 110, anchor: 'middle' }) +
    types
      .map((t, i) => {
        const y = 150 + i * 200
        return block(1080, y, 360, 140, t.fill, t.lip, 10) + text(1150, y + 92, t.n, { size: 76, color: t.ink, anchor: 'middle' }) + text(1210, y + 86, t.label, { size: 44, weight: 700, color: t.ink })
      })
      .join('') +
    loo(140, 760, 12, { eyes: 'happy' }) +
    sparkle(560, 300) +
    sparkle(1460, 120, 5, C.mint) +
    sparkle(1040, 930, 5, C.pink),
)

// img-1: the five types on a scale from real to imagined.
const rows = [
  { label: 'Zero', when: 'завжди', formula: 'if + Present  →  Present', fill: C.mint, lip: C.mintDark, ink: C.ink },
  { label: 'First', when: 'реальне майбутнє', formula: 'if + Present  →  will', fill: C.blue, lip: C.blueDark, ink: C.white },
  { label: 'Second', when: 'уявне зараз', formula: 'if + Past  →  would', fill: C.violet, lip: C.violetDark, ink: C.white },
  { label: 'Third', when: 'уявне минуле', formula: 'if + had V3  →  would have V3', fill: C.pink, lip: C.pinkDark, ink: C.ink },
  { label: 'Mixed', when: 'минуле → зараз', formula: 'if + had V3  →  would', fill: C.yellow, lip: C.yellowDark, ink: C.ink },
]
const img1 = canvas(
  text(120, 130, 'Умовні речення: від реального до уявного', { size: 58 }) +
    text(120, 190, 'тип залежить від того, чи це реально і до якого часу належить', { size: 32, weight: 600, color: C.ink2 }) +
    // scale arrow on the left
    `<rect x="132" y="260" width="12" height="640" fill="${C.ink3}"/>` +
    pixels(['x.....x', '.x...x.', '..x.x..', '...x...'], 114, 900, 8, { x: C.ink3 }) +
    text(170, 290, 'реально', { size: 28, weight: 700, color: C.mintDark }) +
    text(170, 900, 'уявно', { size: 28, weight: 700, color: C.pinkDark }) +
    rows
      .map((r, i) => {
        const y = 250 + i * 136
        return (
          block(340, y, 260, 108, r.fill, r.lip, 10) +
          text(470, y + 70, r.label, { size: 46, color: r.ink, anchor: 'middle' }) +
          text(640, y + 50, r.formula, { size: 38, weight: 800 }) +
          text(640, y + 92, r.when, { size: 28, weight: 600, color: C.ink2 })
        )
      })
      .join('') +
    loo(1250, 640, 11, { eyes: 'normal' }) +
    sparkle(1230, 620) +
    text(W - 120, H - 40, 'Джерело: British Council, LearnEnglish Grammar', { size: 24, weight: 600, color: C.ink3, anchor: 'end' }),
)

// img-2: mixed conditional on a timeline — a past condition leads to a present result.
const LINE_Y = 640
const img2 = canvas(
  text(120, 130, 'Mixed Conditional', { size: 64 }) +
    text(120, 190, 'уявна зміна в минулому — інший результат зараз', { size: 34, weight: 600, color: C.ink2 }) +
    `<rect x="120" y="${LINE_Y}" width="1300" height="10" fill="${C.ink3}"/>` +
    pixels(['x..', 'xx.', 'xxx', 'xx.', 'x..'], 1420, LINE_Y - 15, 8, { x: C.ink3 }) +
    // past marker
    `<rect x="380" y="${LINE_Y - 30}" width="16" height="70" fill="${C.pink}"/>` +
    text(388, LINE_Y + 100, 'тоді', { size: 36, weight: 700, color: C.ink2, anchor: 'middle' }) +
    block(160, 300, 460, 200, C.pink, C.pinkDark, 12) +
    text(390, 380, 'if I had taken', { size: 44, anchor: 'middle' }) +
    text(390, 440, 'that job', { size: 44, anchor: 'middle' }) +
    // now marker
    `<rect x="1100" y="${LINE_Y - 30}" width="16" height="70" fill="${C.violet}"/>` +
    text(1108, LINE_Y + 100, 'зараз', { size: 36, weight: 700, color: C.ink2, anchor: 'middle' }) +
    block(870, 300, 480, 200, C.violet, C.violetDark, 12) +
    text(1110, 380, 'I would live', { size: 44, color: C.white, anchor: 'middle' }) +
    text(1110, 440, 'in Kyiv now', { size: 44, color: C.white, anchor: 'middle' }) +
    // dotted pixel arrow between the boxes
    [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${650 + i * 32}" y="392" width="16" height="16" fill="${C.yellowDark}"/>`).join('') +
    pixels(['x..', 'xx.', 'xxx', 'xx.', 'x..'], 842, 380, 8, { x: C.yellowDark }) +
    loo(620, 760, 11, { eyes: 'squint' }) +
    sparkle(600, 740) +
    sparkle(1400, 280, 5, C.mint) +
    text(W - 120, H - 40, 'Джерело: British Council, Conditionals: third and mixed', { size: 24, weight: 600, color: C.ink3, anchor: 'end' }),
)

for (const [name, svg] of [
  ['cover', cover],
  ['img-1', img1],
  ['img-2', img2],
] as const) {
  console.log(await save(SLUG, name, svg))
}
