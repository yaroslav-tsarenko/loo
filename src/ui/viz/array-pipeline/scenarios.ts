import type { Frame, StepScenario } from '../engine/types'

export interface Item {
  id: string
  emoji: string
  price: number
}

export type Stage = 'source' | 'map' | 'filter' | 'reduce' | 'done'

export interface PipelineFrame extends Frame {
  stage: Stage
  source: Item[]
  mapped: Item[]
  filtered: Item[]
  rejected: string[]
  acc: number | null
  // item being processed by the current stage
  current: string | null
  output: string[]
}

const code = `const basket = [
  { fruit: '🍎', price: 30 },
  { fruit: '🍌', price: 15 },
  { fruit: '🍇', price: 60 },
  { fruit: '🍋', price: 25 },
]
const total = basket
  .map((x) => ({ ...x, price: x.price * 0.8 }))
  .filter((x) => x.price < 40)
  .reduce((sum, x) => sum + x.price, 0)

console.log(total)`

const SOURCE: Item[] = [
  { id: 'apple', emoji: '🍎', price: 30 },
  { id: 'banana', emoji: '🍌', price: 15 },
  { id: 'grapes', emoji: '🍇', price: 60 },
  { id: 'lemon', emoji: '🍋', price: 25 },
]
const MAPPED: Item[] = SOURCE.map((x) => ({ ...x, price: x.price * 0.8 }))
const KEEP = MAPPED.filter((x) => x.price < 40)

function build(): PipelineFrame[] {
  const frames: PipelineFrame[] = []
  const base = { source: SOURCE, mapped: [] as Item[], filtered: [] as Item[], rejected: [] as string[], acc: null as number | null, current: null as string | null, output: [] as string[] }
  frames.push({ ...base, line: 1, stage: 'source', note: 'Вихідний масив — чотири фрукти з цінами. Далі три методи, з’єднані в ланцюжок.' })
  MAPPED.forEach((m, i) => {
    const src = SOURCE[i]!
    frames.push({
      ...base,
      line: 8,
      stage: 'map',
      mapped: MAPPED.slice(0, i + 1),
      current: m.id,
      note: i === 0 ? `map викликає колбек для ${src.emoji}: ${src.price} × 0.8 = ${m.price}. Результат іде в НОВИЙ масив — basket не змінюється.` : `${src.emoji}: ${src.price} × 0.8 = ${m.price}.`,
    })
  })
  frames.push({ ...base, line: 8, stage: 'map', mapped: MAPPED, note: 'map обробив УВЕСЬ масив і повернув новий тієї ж довжини. Лише тепер стартує filter: методи масиву не ліниві, кожен робить повний прохід.' })
  const rejected: string[] = []
  const kept: Item[] = []
  for (const m of MAPPED) {
    const ok = m.price < 40
    if (ok) kept.push(m)
    else rejected.push(m.id)
    frames.push({
      ...base,
      line: 9,
      stage: 'filter',
      mapped: MAPPED,
      filtered: [...kept],
      rejected: [...rejected],
      current: m.id,
      note: ok ? `${m.emoji} ${m.price} < 40 → true: елемент потрапляє в новий масив.` : `${m.emoji} ${m.price} < 40 → false: filter його відкидає. Колбек має повертати boolean (або truthy/falsy).`,
    })
  }
  let acc = 0
  frames.push({ ...base, line: 10, stage: 'reduce', mapped: MAPPED, filtered: KEEP, rejected, acc, note: 'reduce стартує з початкового значення 0. Без нього акумулятором став би перший елемент, а на порожньому масиві — TypeError.' })
  for (const m of KEEP) {
    const before = acc
    acc += m.price
    frames.push({ ...base, line: 10, stage: 'reduce', mapped: MAPPED, filtered: KEEP, rejected, acc, current: m.id, note: `sum = ${before} + ${m.emoji} ${m.price} = ${acc}. Повернене значення стає sum для наступного кроку.` })
  }
  frames.push({ ...base, line: 12, stage: 'done', mapped: MAPPED, filtered: KEEP, rejected, acc, output: [String(acc)], note: `Результат — одне число: ${acc}. Дорогою створено два проміжні масиви — для величезних даних інколи краще один reduce або цикл.` })
  return frames
}

export const pipelineScenarios: Record<string, StepScenario<PipelineFrame>> = {
  'map-filter-reduce': { code, frames: build() },
}
