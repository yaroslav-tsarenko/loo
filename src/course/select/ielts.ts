import { ladderOf, type Level } from '../schema'

// Approximate IELTS band for a CEFR level — the Cambridge / British Council CEFR ↔ IELTS alignment:
// B1 ≈ 4.0–5.0, B2 ≈ 5.5–6.5, C1 ≈ 7.0–8.0, C2 ≈ 8.5–9.0; A1 and A2 are below the IELTS scale we report («нижче 4.0»).
// Only an orientation: IELTS also scores writing and speaking, which the placement test doesn't measure.

export interface IeltsBand {
  // null: below 4.0
  min: number | null
  max: number | null
  // «5.5–6.5» or «нижче 4.0»
  label: string
}

const BANDS: Partial<Record<Level, [number, number]>> = { B1: [4, 5], B2: [5.5, 6.5], C1: [7, 8], C2: [8.5, 9] }

const band = (n: number): string => n.toFixed(1)

// null for levels outside the CEFR ladder (programming courses have no IELTS equivalent)
export function ieltsBand(level: Level): IeltsBand | null {
  if (ladderOf(level) !== 'cefr') return null
  const range = BANDS[level]
  if (!range) return { min: null, max: null, label: 'нижче 4.0' }
  return { min: range[0], max: range[1], label: `${band(range[0])}–${band(range[1])}` }
}
