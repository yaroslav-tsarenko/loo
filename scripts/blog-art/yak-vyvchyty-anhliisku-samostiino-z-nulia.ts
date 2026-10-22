// Illustrations for blog/uk/yak-vyvchyty-anhliisku-samostiino-z-nulia.md — `pnpm tsx scripts/blog-art/<slug>.ts`.
import { block, C, canvas, cloud, flag, H, loo, pixels, save, sparkle, text, W } from './kit'

const SLUG = 'yak-vyvchyty-anhliisku-samostiino-z-nulia'
const GROUND = 880

function ground(): string {
  return `<rect x="0" y="${GROUND}" width="${W}" height="${H - GROUND}" fill="${C.mintSoft}"/>` + `<rect x="0" y="${GROUND}" width="${W}" height="12" fill="${C.mint}"/>`
}

function sun(x: number, y: number): string {
  return pixels(['..xxxx..', '.xxxxxx.', 'xxxxxxxx', 'xxxxxxxx', 'xxxxxxxx', 'xxxxxxxx', '.xxxxxx.', '..xxxx..'], x, y, 14, { x: C.yellow })
}

// Cover: four steps A1 → B2, Loo on the first one looking up at the flag.
const steps = [
  { label: 'A1', x: 170, top: 740, fill: C.mint, lip: C.mintDark },
  { label: 'A2', x: 470, top: 620, fill: C.blue, lip: C.blueDark },
  { label: 'B1', x: 770, top: 500, fill: C.violet, lip: C.violetDark },
  { label: 'B2', x: 1070, top: 380, fill: C.yellow, lip: C.yellowDark },
]
const cover = canvas(
  sun(1300, 90) +
    cloud(110, 150) +
    cloud(760, 120, 10) +
    cloud(1110, 250, 9) +
    ground() +
    steps
      .map(
        (s) =>
          block(s.x, s.top, 280, GROUND - s.top + 8, s.fill, s.lip, 12) +
          text(s.x + 140, s.top + 96, s.label, { size: 76, color: s.label === 'B2' ? C.ink : C.white, anchor: 'middle' }),
      )
      .join('') +
    // dashed path between the steps
    [0, 1, 2]
      .map((i) => {
        const a = steps[i]!
        const b = steps[i + 1]!
        return [0.25, 0.5, 0.75].map((t) => `<rect x="${a.x + 280 + t * 20 - 6}" y="${a.top - 40 - t * (a.top - b.top) * 0.6}" width="12" height="12" fill="${C.ink3}"/>`).join('')
      })
      .join('') +
    flag(1250, 380 - 56, C.pink, 8) +
    loo(220, 740 - 140, 10, { eyes: 'happy' }) +
    sparkle(1220, 300) +
    sparkle(1380, 360, 5, C.pink) +
    sparkle(690, 470, 5, C.mint) +
    sparkle(400, 560, 5, C.violet),
)

// Hours to each level (Cambridge English guided learning hours, cumulative, lower bound of the range).
const levels = [
  { label: 'A1', hours: 100, note: '≈ 90–100', fill: C.mint, lip: C.mintDark },
  { label: 'A2', hours: 200, note: '≈ 180–200', fill: C.blue, lip: C.blueDark },
  { label: 'B1', hours: 400, note: '≈ 350–400', fill: C.violet, lip: C.violetDark },
  { label: 'B2', hours: 600, note: '≈ 500–600', fill: C.yellow, lip: C.yellowDark },
]
const BASE = 860
const hoursChart = canvas(
  text(120, 140, 'Скільки годин до рівня', { size: 64 }) +
    text(120, 200, 'накопичувально, від нуля', { size: 34, weight: 600, color: C.ink2 }) +
    `<rect x="120" y="${BASE}" width="${W - 240}" height="8" fill="${C.ink3}"/>` +
    levels
      .map((l, i) => {
        const x = 220 + i * 300
        const h = (l.hours / 600) * 520
        return (
          block(x, BASE - h, 200, h + 8, l.fill, l.lip, 10) +
          text(x + 100, BASE - h - 28, `${l.note} год`, { size: 36, anchor: 'middle' }) +
          text(x + 100, BASE + 80, l.label, { size: 56, anchor: 'middle' })
        )
      })
      .join('') +
    loo(1250, 150, 9, { eyes: 'squint' }) +
    sparkle(1230, 130) +
    text(W - 120, H - 40, 'Джерело: Cambridge English, guided learning hours', { size: 24, weight: 600, color: C.ink3, anchor: 'end' }),
)

// A 30-minute day: 30 one-minute cells.
const parts = [
  { label: 'Слова', min: 10, fill: C.violet },
  { label: 'Аудіювання', min: 10, fill: C.mint },
  { label: 'Граматика', min: 5, fill: C.yellow },
  { label: 'Говоріння', min: 5, fill: C.pink },
]
let cells = ''
let i = 0
for (const p of parts) for (let m = 0; m < p.min; m++, i++) cells += `<rect x="${118 + i * 44}" y="400" width="38" height="110" fill="${p.fill}"/>`
const routine = canvas(
  text(120, 160, '30 хвилин на день', { size: 72 }) +
    text(120, 225, 'кожна клітинка — одна хвилина', { size: 34, weight: 600, color: C.ink2 }) +
    cells +
    parts
      .map((p, k) => {
        const x = 120 + k * 330
        return `<rect x="${x}" y="600" width="44" height="44" fill="${p.fill}"/>` + text(x + 64, 637, p.label, { size: 38 }) + text(x + 64, 690, `${p.min} хв`, { size: 34, weight: 600, color: C.ink2 })
      })
      .join('') +
    loo(1250, 760, 9, { eyes: 'happy' }) +
    sparkle(1220, 740) +
    sparkle(1430, 800, 5, C.pink),
)

for (const [name, svg] of [
  ['cover', cover],
  ['img-1', hoursChart],
  ['img-2', routine],
] as const) {
  console.log(await save(SLUG, name, svg))
}
