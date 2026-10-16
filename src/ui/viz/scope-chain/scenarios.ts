import type { Frame, StepScenario } from '../engine/types'

export interface ScopeVar {
  name: string
  value: string
  // referenced by a closure that outlives the call
  captured?: boolean
  // binding exists but is not initialized yet
  tdz?: boolean
  changed?: boolean
  // value is a function object (id in `fns`)
  fn?: string
}

export interface ScopeEnv {
  id: string
  name: string
  outer: string | null
  vars: ScopeVar[]
  // nobody references it any more: GC will collect it
  dead?: boolean
  note?: string
}

export interface ScopeFn {
  id: string
  label: string
  // [[Environment]]
  env: string
}

export interface ScopeFrame extends Frame {
  envs: ScopeEnv[]
  fns: ScopeFn[]
  active: string | null
  lookup?: { name: string; path: string[]; found: string | null }
  output: string[]
}

// ── closure-counter ──────────────────────────────────────────────
const counterCode = `function makeCounter() {
  let count = 0
  return function increment() {
    count++
    return count
  }
}

const counter = makeCounter()
console.log(counter())
console.log(counter())`

const g = (vars: ScopeVar[]): ScopeEnv => ({ id: 'global', name: 'Global', outer: null, vars })
const mkFn: ScopeVar = { name: 'makeCounter', value: 'ƒ makeCounter' }
const mc = (count: ScopeVar, extra: Partial<ScopeEnv> = {}): ScopeEnv => ({ id: 'mc', name: 'makeCounter()', outer: 'global', vars: [count], ...extra })
const incFn: ScopeFn = { id: 'inc', label: 'ƒ increment', env: 'mc' }
const counterVar: ScopeVar = { name: 'counter', value: 'ƒ increment', fn: 'inc' }

const closureCounter: StepScenario<ScopeFrame> = {
  code: counterCode,
  frames: [
    { line: null, envs: [g([mkFn, { name: 'counter', value: '‹TDZ›', tdz: true }])], fns: [], active: 'global', output: [], note: 'Перед виконанням рушій створює глобальне оточення: makeCounter — уже готова функція, counter (const) — у TDZ до свого рядка.' },
    { line: 9, envs: [g([mkFn, { name: 'counter', value: '‹TDZ›', tdz: true }]), mc({ name: 'count', value: '‹TDZ›', tdz: true })], fns: [], active: 'mc', output: [], note: 'Виклик makeCounter() створює нове оточення. Його outer — оточення, де функцію ОГОЛОШЕНО (global), а не де її викликали.' },
    { line: 2, envs: [g([mkFn, { name: 'counter', value: '‹TDZ›', tdz: true }]), mc({ name: 'count', value: '0', changed: true })], fns: [], active: 'mc', output: [], note: 'let count = 0 ініціалізує змінну в оточенні саме цього виклику.' },
    { line: 3, envs: [g([mkFn, { name: 'counter', value: '‹TDZ›', tdz: true }]), mc({ name: 'count', value: '0', captured: true })], fns: [incFn], active: 'mc', output: [], note: 'Створюється функція increment. Вона зберігає посилання на поточне оточення у прихованому слоті [[Environment]] — це і є замикання.' },
    { line: 9, envs: [g([mkFn, { ...counterVar, changed: true }]), mc({ name: 'count', value: '0', captured: true }, { note: 'виклик завершено, але оточення живе' })], fns: [incFn], active: 'global', output: [], note: 'makeCounter повернула функцію, її контекст виконання знято зі стека. Але оточення з count живе: на нього посилається increment.[[Environment]], а на increment — counter.' },
    { line: 10, envs: [g([mkFn, counterVar]), mc({ name: 'count', value: '0', captured: true }), { id: 'inc1', name: 'increment()', outer: 'mc', vars: [] }], fns: [incFn], active: 'inc1', output: [], note: 'counter() створює оточення для виклику increment. Його outer — збережене [[Environment]], тобто оточення makeCounter.' },
    { line: 4, envs: [g([mkFn, counterVar]), mc({ name: 'count', value: '1', captured: true, changed: true }), { id: 'inc1', name: 'increment()', outer: 'mc', vars: [] }], fns: [incFn], active: 'inc1', lookup: { name: 'count', path: ['inc1', 'mc'], found: 'mc' }, output: [], note: 'count++: у власному оточенні count немає → ідемо по outer у makeCounter → знайшли і збільшили до 1.' },
    { line: 10, envs: [g([mkFn, counterVar]), mc({ name: 'count', value: '1', captured: true })], fns: [incFn], active: 'global', output: ['1'], note: 'increment повернула 1 — у консоль. Оточення цього виклику ніхто не тримає, тож його прибере збирач сміття.' },
    { line: 11, envs: [g([mkFn, counterVar]), mc({ name: 'count', value: '2', captured: true, changed: true }), { id: 'inc2', name: 'increment()', outer: 'mc', vars: [] }], fns: [incFn], active: 'inc2', lookup: { name: 'count', path: ['inc2', 'mc'], found: 'mc' }, output: ['1'], note: 'Другий виклик — нове оточення, але outer той самий: count стає 2. Стан живе між викликами саме в оточенні makeCounter.' },
    { line: null, envs: [g([mkFn, counterVar]), mc({ name: 'count', value: '2', captured: true })], fns: [incFn], active: null, output: ['1', '2'], note: 'Кожен новий виклик makeCounter() створив би окреме оточення з власним count — тому два лічильники ніколи не заважають один одному.' },
  ],
}

// ── loop-var-vs-let ──────────────────────────────────────────────
const loopCode = `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var', i))
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let', j))
}`

const gi = (value: string, extra: Partial<ScopeVar> = {}): ScopeEnv => g([{ name: 'i', value, ...extra }])
const v = (n: number): ScopeFn => ({ id: `v${n}`, label: `ƒ var-стрілка #${n}`, env: 'global' })
const l = (n: number): ScopeFn => ({ id: `l${n}`, label: `ƒ let-стрілка #${n}`, env: `it${n}` })
const it = (n: number, extra: Partial<ScopeEnv> = {}): ScopeEnv => ({ id: `it${n}`, name: `ітерація ${n}`, outer: 'global', vars: [{ name: 'j', value: String(n), captured: n < 3 }], ...extra })
const vars3 = [v(0), v(1), v(2)]

const loopVarVsLet: StepScenario<ScopeFrame> = {
  code: loopCode,
  frames: [
    { line: null, envs: [gi('undefined')], fns: [], active: 'global', output: [], note: 'var i спливає (hoisting) у глобальне оточення: одна змінна на весь скрипт. Поки що undefined.' },
    { line: 2, envs: [gi('0', { changed: true })], fns: [v(0)], active: 'global', output: [], note: 'Ітерація i = 0: стрілка запам’ятовує оточення, де народилась, — глобальне. Значення i вона НЕ копіює.' },
    { line: 2, envs: [gi('2', { changed: true, captured: true })], fns: vars3, active: 'global', output: [], note: 'Ще дві ітерації — ще дві функції. Усі три посилаються на одне оточення з однією-єдиною i.' },
    { line: 1, envs: [gi('3', { changed: true, captured: true })], fns: vars3, active: 'global', output: [], note: 'i++ дало 3, умова i < 3 хибна — цикл завершено. Колбеки ще не виконувались: вони чекають у черзі макрозадач.' },
    { line: 5, envs: [gi('3', { captured: true }), it(0, { vars: [{ name: 'j', value: '0', changed: true }] })], fns: vars3, active: 'it0', output: [], note: 'Для for з let специфікація створює НОВЕ оточення на кожну ітерацію (CreatePerIterationEnvironment). Перша копія: j = 0.' },
    { line: 6, envs: [gi('3', { captured: true }), it(0)], fns: [...vars3, l(0)], active: 'it0', output: [], note: 'Стрілка ітерації 0 запам’ятовує саме це оточення — з власною j = 0.' },
    { line: 6, envs: [gi('3', { captured: true }), it(0), it(1), it(2)], fns: [...vars3, l(0), l(1), l(2)], active: 'it2', output: [], note: 'Перед кожною наступною ітерацією j копіюється в нове оточення, і вже там виконується j++. Тож у кожної функції своя j: 0, 1, 2.' },
    { line: 5, envs: [gi('3', { captured: true }), it(0), it(1), it(2), it(3, { dead: true, note: 'умова j < 3 хибна' })], fns: [...vars3, l(0), l(1), l(2)], active: 'it3', output: [], note: 'Остання копія з j = 3 не проходить умову — тіло не виконується, і цю копію ніхто не захопив.' },
    { line: 2, envs: [gi('3', { captured: true }), it(0), it(1), it(2)], fns: [...vars3, l(0), l(1), l(2)], active: null, lookup: { name: 'i', path: ['global'], found: 'global' }, output: ['var 3', 'var 3', 'var 3'], note: 'Таймери спрацьовують. Кожна var-стрілка шукає i у глобальному оточенні — і всі бачать поточне значення 3.' },
    { line: 6, envs: [gi('3', { captured: true }), it(0), it(1), it(2)], fns: [...vars3, l(0), l(1), l(2)], active: null, lookup: { name: 'j', path: ['it0', 'it1', 'it2'], found: null }, output: ['var 3', 'var 3', 'var 3', 'let 0', 'let 1', 'let 2'], note: 'let-стрілки знаходять j кожна у своєму оточенні ітерації: 0, 1, 2. Різниця не в таймерах, а в тому, скільки оточень створено.' },
  ],
}

// ── shadowing ────────────────────────────────────────────────────
const shadowCode = `const planet = 'Земля'
const name = 'глобальна'

function outer() {
  const name = 'з outer'
  function inner() {
    console.log(name, planet)
  }
  inner()
}

outer()
console.log(name)`

const outerFn: ScopeVar = { name: 'outer', value: 'ƒ outer' }
const gTdz = g([{ name: 'planet', value: '‹TDZ›', tdz: true }, { name: 'name', value: '‹TDZ›', tdz: true }, outerFn])
const gReady = (changed = false) => g([{ name: 'planet', value: "'Земля'", changed }, { name: 'name', value: "'глобальна'", changed }, outerFn])
const innerFn: ScopeVar = { name: 'inner', value: 'ƒ inner' }
const outerEnv = (name: ScopeVar): ScopeEnv => ({ id: 'outer', name: 'outer()', outer: 'global', vars: [name, innerFn] })
const outerName: ScopeVar = { name: 'name', value: "'з outer'" }
const innerEnv: ScopeEnv = { id: 'inner', name: 'inner()', outer: 'outer', vars: [] }

const shadowing: StepScenario<ScopeFrame> = {
  code: shadowCode,
  frames: [
    { line: null, envs: [gTdz], fns: [], active: 'global', output: [], note: 'Глобальне оточення: outer — готова функція, planet і name (const) — у TDZ до своїх рядків.' },
    { line: 2, envs: [gReady(true)], fns: [], active: 'global', output: [], note: 'Обидві константи ініціалізовано.' },
    { line: 12, envs: [gReady(), outerEnv({ name: 'name', value: '‹TDZ›', tdz: true })], fns: [], active: 'outer', output: [], note: 'Виклик outer() — нове оточення з ВЛАСНОЮ name. Вона затінює (shadowing) глобальну name для всього коду всередині outer.' },
    { line: 5, envs: [gReady(), outerEnv({ ...outerName, changed: true })], fns: [], active: 'outer', output: [], note: 'Внутрішню name ініціалізовано. Глобальна name при цьому не змінилась — це дві різні змінні.' },
    { line: 9, envs: [gReady(), outerEnv(outerName), innerEnv], fns: [], active: 'inner', output: [], note: 'inner() отримує порожнє оточення. Його outer — оточення outer, бо саме там inner оголошено.' },
    { line: 7, envs: [gReady(), outerEnv(outerName), innerEnv], fns: [], active: 'inner', lookup: { name: 'name', path: ['inner', 'outer'], found: 'outer' }, output: [], note: 'Шукаємо name: в inner немає → в outer є! Пошук зупиняється на першому збігу, тож глобальна name навіть не перевіряється.' },
    { line: 7, envs: [gReady(), outerEnv(outerName), innerEnv], fns: [], active: 'inner', lookup: { name: 'planet', path: ['inner', 'outer', 'global'], found: 'global' }, output: ['з outer Земля'], note: 'Шукаємо planet: inner → outer → global — знайшли на самому верху ланцюжка. Друкується «з outer Земля».' },
    { line: 13, envs: [gReady()], fns: [], active: 'global', lookup: { name: 'name', path: ['global'], found: 'global' }, output: ['з outer Земля', 'глобальна'], note: 'Зовні затінення немає: глобальний код бачить лише своє оточення. Пошук імені йде тільки назовні, ніколи всередину.' },
  ],
}

export const scopeChainScenarios: Record<string, StepScenario<ScopeFrame>> = {
  'closure-counter': closureCounter,
  'loop-var-vs-let': loopVarVsLet,
  shadowing,
}
