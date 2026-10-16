// Pure model of Promise combinators over inputs that settle after `ms`.
// Equal times settle in input order (timers registered in that order).

export interface CombinatorInput {
  name: string
  ms: number
  ok: boolean
  value: string
  reason: string
}

export interface Outcome {
  at: number
  ok: boolean
  value: string
}

export type CombinatorId = 'all' | 'allSettled' | 'race' | 'any'

export const COMBINATORS: ReadonlyArray<{ id: CombinatorId; rule: string }> = [
  { id: 'all', rule: 'чекає всіх; перша помилка — одразу reject' },
  { id: 'allSettled', rule: 'чекає всіх; ніколи не reject' },
  { id: 'race', rule: 'перший, хто завершився, — будь-як' },
  { id: 'any', rule: 'перший успіх; reject, лише якщо впали всі' },
]

function order(inputs: readonly CombinatorInput[]): CombinatorInput[] {
  return inputs.map((input, index) => ({ input, index })).sort((a, b) => a.input.ms - b.input.ms || a.index - b.index).map((x) => x.input)
}

export function combine(id: CombinatorId, inputs: readonly CombinatorInput[]): Outcome {
  const sorted = order(inputs)
  const last = Math.max(...inputs.map((i) => i.ms))
  switch (id) {
    case 'all': {
      const failed = sorted.find((i) => !i.ok)
      if (failed) return { at: failed.ms, ok: false, value: failed.reason }
      return { at: last, ok: true, value: `[${inputs.map((i) => i.value).join(', ')}]` }
    }
    case 'allSettled':
      return { at: last, ok: true, value: `[${inputs.map((i) => (i.ok ? `✓ ${i.value}` : `✗ ${i.reason}`)).join(', ')}]` }
    case 'race': {
      const first = sorted[0]!
      return { at: first.ms, ok: first.ok, value: first.ok ? first.value : first.reason }
    }
    case 'any': {
      const won = sorted.find((i) => i.ok)
      if (won) return { at: won.ms, ok: true, value: won.value }
      return { at: last, ok: false, value: 'AggregateError: All promises were rejected' }
    }
  }
}
