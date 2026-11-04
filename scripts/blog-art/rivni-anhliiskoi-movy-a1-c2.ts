// Illustrations for blog/uk/rivni-anhliiskoi-movy-a1-c2.md — `pnpm tsx scripts/blog-art/<slug>.ts`.
import { block, C, canvas, cloud, flag, H, loo, save, sparkle, text, W } from './kit'

const SLUG = 'rivni-anhliiskoi-movy-a1-c2'

const levels = [
  { id: 'A1', fill: C.mint, lip: C.mintDark, ink: C.ink },
  { id: 'A2', fill: C.mint, lip: C.mintDark, ink: C.ink },
  { id: 'B1', fill: C.blue, lip: C.blueDark, ink: C.white },
  { id: 'B2', fill: C.blue, lip: C.blueDark, ink: C.white },
  { id: 'C1', fill: C.violet, lip: C.violetDark, ink: C.white },
  { id: 'C2', fill: C.violet, lip: C.violetDark, ink: C.white },
]

// Six stair steps rising left to right; returns the svg and the top-left of each step.
function stairs(x0: number, base: number, stepW: number, stepH: number, gap = 8): { svg: string; tops: { x: number; y: number }[] } {
  let svg = ''
  const tops: { x: number; y: number }[] = []
  levels.forEach((l, i) => {
    const x = x0 + i * (stepW + gap)
    const h = stepH * (i + 1)
    const y = base - h
    svg += block(x, y, stepW, h, l.fill, l.lip, 10)
    svg += text(x + stepW / 2, y + 68, l.id, { size: 52, color: l.ink, anchor: 'middle' })
    tops.push({ x, y })
  })
  return { svg, tops }
}

// Cover: the staircase A1→C2 with Loo standing on B2 and a flag on C2.
const cs = stairs(150, 900, 200, 110)
const b2 = cs.tops[3]!
const c2 = cs.tops[5]!
const cover = canvas(
  cloud(180, 150, 12) +
    cloud(620, 90, 10) +
    cs.svg +
    loo(b2.x + 4, b2.y - 14 * 12, 12, { eyes: 'happy' }) +
    flag(c2.x + 80, c2.y - 56, C.yellow, 8) +
    sparkle(c2.x + 170, c2.y - 70) +
    sparkle(b2.x - 30, b2.y - 120, 5, C.mint) +
    sparkle(1400, 180, 6, C.pink),
)

// img-1: the staircase labelled with the three CEFR groups.
const is = stairs(140, 930, 190, 95)
const groups = [
  { from: 0, label: 'базовий користувач', color: C.mintDark },
  { from: 2, label: 'незалежний', color: C.blueDark },
  { from: 4, label: 'досвідчений', color: C.violetDark },
]
const img1 = canvas(
  text(120, 120, 'Рівні англійської за шкалою CEFR', { size: 58 }) +
    text(120, 180, 'шість рівнів у трьох групах: A, B і C', { size: 32, weight: 600, color: C.ink2 }) +
    is.svg +
    groups
      .map((g) => {
        const a = is.tops[g.from]!
        const b = is.tops[g.from + 1]!
        const x1 = a.x
        const x2 = b.x + 190
        const y = b.y - 70
        return `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="8" fill="${g.color}"/>` + `<rect x="${x1}" y="${y}" width="8" height="28" fill="${g.color}"/><rect x="${x2 - 8}" y="${y}" width="8" height="28" fill="${g.color}"/>` + text((x1 + x2) / 2, y - 18, g.label, { size: 30, weight: 700, color: g.color, anchor: 'middle' })
      })
      .join('') +
    loo(150, 330, 11, { eyes: 'normal' }) +
    sparkle(360, 330) +
    text(W - 120, H - 40, 'Джерело: Рада Європи, CEFR — The CEFR Levels', { size: 24, weight: 600, color: C.ink3, anchor: 'end' }),
)

// img-2: cumulative guided learning hours from zero (Cambridge English, upper bound of each range as bar length).
const hours = [
  { id: 'A1', range: '90–100', max: 100 },
  { id: 'A2', range: '180–200', max: 200 },
  { id: 'B1', range: '350–400', max: 400 },
  { id: 'B2', range: '500–600', max: 600 },
  { id: 'C1', range: '700–800', max: 800 },
  { id: 'C2', range: '1000–1200', max: 1200 },
]
const BAR_X = 300
const BAR_MAX = 760
const img2 = canvas(
  text(120, 120, 'Скільки годин від нуля до рівня', { size: 58 }) +
    text(120, 180, 'сукупні години навчання з викладачем, орієнтир Cambridge English', { size: 32, weight: 600, color: C.ink2 }) +
    hours
      .map((h, i) => {
        const l = levels[i]!
        const y = 250 + i * 118
        const w = Math.max(60, Math.round((h.max / 1200) * BAR_MAX / 8) * 8)
        return (
          text(BAR_X - 40, y + 64, h.id, { size: 48, anchor: 'end' }) +
          block(BAR_X, y, w, 88, l.fill, l.lip, 8) +
          text(BAR_X + w + 24, y + 60, h.range, { size: 36, weight: 700, color: C.ink2 })
        )
      })
      .join('') +
    loo(1280, 420, 11, { eyes: 'squint' }) +
    sparkle(1260, 400) +
    text(W - 120, H - 40, 'Джерело: Cambridge English, Guided learning hours', { size: 24, weight: 600, color: C.ink3, anchor: 'end' }),
)

for (const [name, svg] of [
  ['cover', cover],
  ['img-1', img1],
  ['img-2', img2],
] as const) {
  console.log(await save(SLUG, name, svg))
}
