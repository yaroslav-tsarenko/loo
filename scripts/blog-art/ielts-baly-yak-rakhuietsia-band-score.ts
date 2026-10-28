// Illustrations for blog/uk/ielts-baly-yak-rakhuietsia-band-score.md — `pnpm tsx scripts/blog-art/<slug>.ts`.
import { block, C, canvas, H, loo, save, sparkle, text, W } from './kit'

const SLUG = 'ielts-baly-yak-rakhuietsia-band-score'

const parts = [
  { label: 'Listening', short: 'L', score: 6.5, fill: C.mint, lip: C.mintDark },
  { label: 'Reading', short: 'R', score: 6.5, fill: C.blue, lip: C.blueDark },
  { label: 'Writing', short: 'W', score: 5.0, fill: C.pink, lip: C.pinkDark },
  { label: 'Speaking', short: 'S', score: 7.0, fill: C.violet, lip: C.violetDark },
]

// Cover: four score bars on a 0–9 scale, the overall 6.5 badge above, Loo beside.
const BASE = 860
const unit = 62 // px per band
const cover = canvas(
  `<rect x="120" y="${BASE}" width="1000" height="8" fill="${C.ink3}"/>` +
    parts
      .map((p, i) => {
        const x = 170 + i * 230
        const h = p.score * unit
        return (
          block(x, BASE - h, 170, h + 8, p.fill, p.lip, 10) +
          text(x + 85, BASE - h - 26, p.score.toFixed(1), { size: 52, anchor: 'middle' }) +
          text(x + 85, BASE + 80, p.short, { size: 56, anchor: 'middle', color: C.ink2 })
        )
      })
      .join('') +
    // overall line at 6.5
    `<rect x="140" y="${BASE - 6.5 * unit - 4}" width="960" height="8" fill="${C.yellow}" opacity="0.9"/>` +
    block(1180, 160, 260, 200, C.yellow, C.yellowDark, 12) +
    text(1310, 280, '6.5', { size: 110, anchor: 'middle' }) +
    text(1310, 330, 'overall', { size: 34, weight: 700, color: C.ink2, anchor: 'middle' }) +
    loo(1220, 640, 13, { eyes: 'happy' }) +
    sparkle(1160, 140) +
    sparkle(1470, 420, 5, C.pink) +
    sparkle(1140, 560, 5, C.mint),
)

// img-1: sum → average → rounding.
const img1 = canvas(
  text(120, 140, 'Як рахується загальний бал', { size: 62 }) +
    text(120, 200, 'середнє чотирьох частин, округлене до .0 або .5', { size: 34, weight: 600, color: C.ink2 }) +
    parts
      .map((p, i) => {
        const x = 120 + i * 200
        return block(x, 300, 170, 170, p.fill, p.lip, 10) + text(x + 85, 405, p.score.toFixed(1), { size: 60, anchor: 'middle', color: p.fill === C.pink || p.fill === C.mint ? C.ink : C.white }) + text(x + 85, 530, p.label, { size: 30, weight: 700, color: C.ink2, anchor: 'middle' })
      })
      .join('') +
    text(940, 410, '=', { size: 90, anchor: 'middle', color: C.ink3 }) +
    block(1010, 300, 200, 170, C.white, C.dot, 10) +
    text(1110, 405, '6.25', { size: 60, anchor: 'middle' }) +
    text(1110, 530, 'середнє', { size: 30, weight: 700, color: C.ink2, anchor: 'middle' }) +
    text(1265, 410, '→', { size: 80, anchor: 'middle', color: C.ink3 }) +
    block(1310, 300, 170, 170, C.yellow, C.yellowDark, 10) +
    text(1395, 405, '6.5', { size: 64, anchor: 'middle' }) +
    text(1395, 530, 'overall', { size: 30, weight: 700, color: C.ink2, anchor: 'middle' }) +
    // rounding rules
    text(120, 690, '.25 → угору до .5', { size: 44 }) +
    text(120, 760, '.75 → угору до цілого', { size: 44 }) +
    text(120, 830, '.125 → униз до .0', { size: 44, color: C.ink2 }) +
    loo(1200, 700, 11, { eyes: 'squint' }) +
    sparkle(1170, 680) +
    text(W - 120, H - 40, 'Джерело: ielts.org, IELTS scoring in detail', { size: 24, weight: 600, color: C.ink3, anchor: 'end' }),
)

// img-2: IELTS 4–9 ladder next to CEFR bands.
const bands = [
  { cefr: 'C2', range: '8.5–9.0', from: 8.5, to: 9.0, fill: C.yellow, lip: C.yellowDark, ink: C.ink },
  { cefr: 'C1', range: '7.0–8.0', from: 7.0, to: 8.0, fill: C.violet, lip: C.violetDark, ink: C.white },
  { cefr: 'B2', range: '5.5–6.5', from: 5.5, to: 6.5, fill: C.blue, lip: C.blueDark, ink: C.white },
  { cefr: 'B1', range: '4.0–5.0', from: 4.0, to: 5.0, fill: C.mint, lip: C.mintDark, ink: C.ink },
]
const TOP = 250
const BOTTOM = 900
const y = (band: number) => BOTTOM - ((band - 3.75) / (9.25 - 3.75)) * (BOTTOM - TOP)
let ticks = ''
for (let b = 4; b <= 9; b += 0.5) ticks += text(260, y(b) + 14, b.toFixed(1), { size: 34, weight: b % 1 === 0 ? 800 : 600, color: b % 1 === 0 ? C.ink : C.ink2, anchor: 'end' }) + `<rect x="280" y="${y(b) - 2}" width="40" height="4" fill="${C.ink3}"/>`
const img2 = canvas(
  text(120, 130, 'IELTS і рівні CEFR', { size: 64 }) +
    text(120, 190, 'загальний бал, офіційна таблиця відповідності', { size: 34, weight: 600, color: C.ink2 }) +
    `<rect x="316" y="${TOP - 20}" width="8" height="${BOTTOM - TOP + 40}" fill="${C.ink3}"/>` +
    ticks +
    bands
      .map((b) => {
        const top = y(b.to) - 24
        const bottom = y(b.from) + 24
        return block(360, top, 560, bottom - top, b.fill, b.lip, 10) + text(420, (top + bottom) / 2 + 22, b.cefr, { size: 64, color: b.ink }) + text(880, (top + bottom) / 2 + 16, b.range, { size: 40, weight: 700, color: b.ink, anchor: 'end' })
      })
      .join('') +
    loo(1110, 560, 13, { eyes: 'happy' }) +
    sparkle(1080, 520) +
    sparkle(1380, 480, 5, C.pink) +
    text(W - 120, H - 40, 'Джерело: ielts.org, IELTS and the CEFR', { size: 24, weight: 600, color: C.ink3, anchor: 'end' }),
)

for (const [name, svg] of [
  ['cover', cover],
  ['img-1', img1],
  ['img-2', img2],
] as const) {
  console.log(await save(SLUG, name, svg))
}
