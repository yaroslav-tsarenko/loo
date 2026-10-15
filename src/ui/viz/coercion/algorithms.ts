// Step-by-step models of IsLooselyEqual (==) and the + operator, ECMA-262 §7.2.14
// and §13.15.3 (ApplyStringOrNumericBinaryOperator). BigInt and Symbol are out of
// scope here. Results are checked against the real engine in tests.

export interface CoercionOption {
  id: string
  label: string
  make: () => unknown
}

export const OPTIONS: readonly CoercionOption[] = [
  { id: 'null', label: 'null', make: () => null },
  { id: 'undefined', label: 'undefined', make: () => undefined },
  { id: 'n0', label: '0', make: () => 0 },
  { id: 'n1', label: '1', make: () => 1 },
  { id: 'nan', label: 'NaN', make: () => NaN },
  { id: 'empty', label: "''", make: () => '' },
  { id: 'space', label: "' '", make: () => ' ' },
  { id: 's0', label: "'0'", make: () => '0' },
  { id: 's1', label: "'1'", make: () => '1' },
  { id: 'abc', label: "'abc'", make: () => 'abc' },
  { id: 'true', label: 'true', make: () => true },
  { id: 'false', label: 'false', make: () => false },
  { id: 'arr', label: '[]', make: () => [] },
  { id: 'arr0', label: '[0]', make: () => [0] },
  { id: 'arr12', label: '[1, 2]', make: () => [1, 2] },
  { id: 'obj', label: '{}', make: () => ({}) },
]

export const EQ_PRESETS: ReadonlyArray<[string, string]> = [
  ['null', 'undefined'],
  ['null', 'n0'],
  ['s0', 'false'],
  ['arr', 'false'],
  ['empty', 'n0'],
  ['nan', 'nan'],
  ['arr12', 's1'],
  ['arr', 'arr'],
]

export const PLUS_PRESETS: ReadonlyArray<[string, string]> = [
  ['n1', 's1'],
  ['true', 'n1'],
  ['arr', 'obj'],
  ['arr', 'arr'],
  ['null', 'n1'],
  ['undefined', 'n1'],
  ['arr12', 'n1'],
]

type SpecType = 'Undefined' | 'Null' | 'Boolean' | 'Number' | 'String' | 'Object'

export interface Operand {
  value: unknown
  text: string
}

export interface Step {
  rule: string
  detail: string
  // the expression after this step
  expr: string
}

export interface Trace {
  steps: Step[]
  result: unknown
  resultText: string
}

function typeOf(v: unknown): SpecType {
  if (v === undefined) return 'Undefined'
  if (v === null) return 'Null'
  if (typeof v === 'boolean') return 'Boolean'
  if (typeof v === 'number') return 'Number'
  if (typeof v === 'string') return 'String'
  return 'Object'
}

const TYPE_UA: Record<SpecType, string> = { Undefined: 'Undefined', Null: 'Null', Boolean: 'Boolean', Number: 'Number', String: 'String', Object: 'Object' }

export function show(v: unknown): string {
  if (typeof v === 'string') return `'${v}'`
  if (typeof v === 'number') return Object.is(v, -0) ? '-0' : String(v)
  return String(v)
}

const operand = (value: unknown): Operand => ({ value, text: show(value) })

function toPrimitive(o: Operand): { result: Operand; detail: string } {
  const obj = o.value as { valueOf: () => unknown; toString: () => string }
  const viaValueOf = obj.valueOf()
  if (viaValueOf !== obj && typeOf(viaValueOf) !== 'Object') {
    return { result: operand(viaValueOf), detail: `${o.text}.valueOf() повертає примітив ${show(viaValueOf)}` }
  }
  const str = obj.toString()
  return { result: operand(str), detail: `${o.text}.valueOf() повертає сам об’єкт (не примітив), тож береться ${o.text}.toString() → ${show(str)}` }
}

function toNumberDetail(v: unknown): string {
  if (typeof v === 'boolean') return `ToNumber(${v}) = ${v ? 1 : 0}`
  if (typeof v === 'string') {
    const n = Number(v)
    if (v.trim() === '') return `ToNumber(${show(v)}) = 0 — порожній (або з пробілів) рядок стає нулем`
    return Number.isNaN(n) ? `ToNumber(${show(v)}) = NaN — рядок не схожий на число` : `ToNumber(${show(v)}) = ${show(n)}`
  }
  if (v === null) return 'ToNumber(null) = 0'
  if (v === undefined) return 'ToNumber(undefined) = NaN'
  return `ToNumber(${show(v)}) = ${show(Number(v))}`
}

export function looseEqual(xIn: Operand, yIn: Operand): Trace {
  let x = xIn
  let y = yIn
  const steps: Step[] = []
  const done = (result: boolean, rule: string, detail: string): Trace => {
    steps.push({ rule, detail, expr: String(result) })
    return { steps, result, resultText: String(result) }
  }
  for (let guard = 0; guard < 8; guard++) {
    const tx = typeOf(x.value)
    const ty = typeOf(y.value)
    if (tx === ty) {
      if (tx === 'Number') {
        const xn = x.value as number
        const yn = y.value as number
        if (Number.isNaN(xn) || Number.isNaN(yn)) return done(false, 'Типи однакові → IsStrictlyEqual', 'Обидва — Number, але NaN не дорівнює нічому, навіть собі.')
        return done(xn === yn, 'Типи однакові → IsStrictlyEqual', `Обидва — Number: порівнюємо значення ${x.text} і ${y.text}.`)
      }
      if (tx === 'Object') return done(x.value === y.value, 'Типи однакові → IsStrictlyEqual', 'Обидва — об’єкти: == порівнює посилання. Кожен літерал [] чи {} — новий об’єкт, тож це різні посилання.')
      return done(x.value === y.value, 'Типи однакові → IsStrictlyEqual', `Обидва мають тип ${TYPE_UA[tx]}: далі == працює як ===.`)
    }
    if ((tx === 'Null' && ty === 'Undefined') || (tx === 'Undefined' && ty === 'Null')) {
      return done(true, 'Крок 2–3: null і undefined', 'Спеціальне правило: null == undefined завжди true — і лише між собою.')
    }
    if (tx === 'Number' && ty === 'String') {
      const n = Number(y.value)
      steps.push({ rule: 'Крок 5: Number == String', detail: `Рядок перетворюємо на число: ${toNumberDetail(y.value)}.`, expr: `${x.text} == ${show(n)}` })
      y = operand(n)
      continue
    }
    if (tx === 'String' && ty === 'Number') {
      const n = Number(x.value)
      steps.push({ rule: 'Крок 6: String == Number', detail: `Рядок перетворюємо на число: ${toNumberDetail(x.value)}.`, expr: `${show(n)} == ${y.text}` })
      x = operand(n)
      continue
    }
    if (tx === 'Boolean') {
      const n = Number(x.value)
      steps.push({ rule: 'Крок 9: ліворуч Boolean', detail: `Boolean завжди спершу стає числом: ${toNumberDetail(x.value)}.`, expr: `${show(n)} == ${y.text}` })
      x = operand(n)
      continue
    }
    if (ty === 'Boolean') {
      const n = Number(y.value)
      steps.push({ rule: 'Крок 10: праворуч Boolean', detail: `Boolean завжди спершу стає числом: ${toNumberDetail(y.value)}.`, expr: `${x.text} == ${show(n)}` })
      y = operand(n)
      continue
    }
    if ((tx === 'String' || tx === 'Number') && ty === 'Object') {
      const { result, detail } = toPrimitive(y)
      steps.push({ rule: 'Крок 11: примітив == Object', detail: `Об’єкт зводимо до примітива (ToPrimitive): ${detail}.`, expr: `${x.text} == ${result.text}` })
      y = result
      continue
    }
    if (tx === 'Object' && (ty === 'String' || ty === 'Number')) {
      const { result, detail } = toPrimitive(x)
      steps.push({ rule: 'Крок 12: Object == примітив', detail: `Об’єкт зводимо до примітива (ToPrimitive): ${detail}.`, expr: `${result.text} == ${y.text}` })
      x = result
      continue
    }
    const why = tx === 'Null' || tx === 'Undefined' || ty === 'Null' || ty === 'Undefined' ? 'null і undefined нестрого рівні лише одне одному — ні 0, ні \'\', ні false їм не рівні.' : `Для пари ${TYPE_UA[tx]} і ${TYPE_UA[ty]} жодне правило не підходить.`
    return done(false, 'Крок 14: інакше false', why)
  }
  return done(false, 'Крок 14: інакше false', 'Жодне правило не підходить.')
}

export function plus(xIn: Operand, yIn: Operand): Trace {
  const steps: Step[] = []
  let x = xIn
  let y = yIn
  if (typeOf(x.value) === 'Object' || typeOf(y.value) === 'Object') {
    const parts: string[] = []
    if (typeOf(x.value) === 'Object') {
      const r = toPrimitive(x)
      parts.push(r.detail)
      x = r.result
    }
    if (typeOf(y.value) === 'Object') {
      const r = toPrimitive(y)
      parts.push(r.detail)
      y = r.result
    }
    steps.push({ rule: 'Крок 1: ToPrimitive обох операндів', detail: `${parts.join('; ')}.`, expr: `${x.text} + ${y.text}` })
  } else {
    steps.push({ rule: 'Крок 1: ToPrimitive обох операндів', detail: 'Обидва операнди вже примітиви — нічого не змінюється.', expr: `${x.text} + ${y.text}` })
  }
  if (typeof x.value === 'string' || typeof y.value === 'string') {
    const result = String(x.value) + String(y.value)
    steps.push({ rule: 'Крок 2: є рядок → конкатенація', detail: `Хоч один операнд — рядок, тож обидва стають рядками (ToString) і склеюються: ${show(String(x.value))} + ${show(String(y.value))}.`, expr: show(result) })
    return { steps, result, resultText: show(result) }
  }
  const a = Number(x.value)
  const b = Number(y.value)
  steps.push({ rule: 'Крок 3: інакше — числа', detail: `Рядків немає, тож обидва стають числами: ${toNumberDetail(x.value)}, ${toNumberDetail(y.value)}.`, expr: `${show(a)} + ${show(b)}` })
  const result = a + b
  steps.push({ rule: 'Додавання', detail: Number.isNaN(result) ? 'Якщо хоч один операнд NaN — результат NaN.' : `Звичайне додавання чисел.`, expr: show(result) })
  return { steps, result, resultText: show(result) }
}

export function optionById(id: string): CoercionOption {
  return OPTIONS.find((o) => o.id === id) ?? OPTIONS[0]!
}

export function trace(mode: 'eq' | 'plus', xId: string, yId: string): Trace {
  const xo = optionById(xId)
  const yo = optionById(yId)
  const x: Operand = { value: xo.make(), text: xo.label }
  const y: Operand = { value: yo.make(), text: yo.label }
  return mode === 'eq' ? looseEqual(x, y) : plus(x, y)
}
