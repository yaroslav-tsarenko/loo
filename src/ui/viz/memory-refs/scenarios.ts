import type { Frame, StepScenario, VizIcon } from '../engine/types'

export type MemValue = { prim: string } | { ref: string }

export interface Slot {
  name: string
  value: MemValue
  changed?: boolean
}

export interface HeapObj {
  id: string
  label: string
  icon: VizIcon
  fields: Array<{ key: string; value: MemValue; changed?: boolean }>
  state?: 'reachable' | 'unreachable'
}

export interface MemFrame extends Frame {
  // variables / GC roots
  stack: Slot[]
  heap: HeapObj[]
  output: string[]
}

const p = (prim: string): MemValue => ({ prim })
const r = (ref: string): MemValue => ({ ref })

// ── copy-primitive-vs-object ─────────────────────────────────────
const copyCode = `let a = 5
let b = a
b = 7

const cat = { name: 'Мурка' }
const alias = cat
alias.name = 'Тигра'

console.log(a, b)
console.log(cat.name)
console.log(cat === alias)`

const catObj = (name: string, changed = false): HeapObj => ({ id: 'cat', label: '#1', icon: 'px:cat', fields: [{ key: 'name', value: p(name), changed }] })
const ab = [{ name: 'a', value: p('5') }, { name: 'b', value: p('7') }]
const full = [...ab, { name: 'cat', value: r('cat') }, { name: 'alias', value: r('cat') }]

const copyPrimitiveVsObject: StepScenario<MemFrame> = {
  code: copyCode,
  frames: [
    { line: 1, stack: [{ name: 'a', value: p('5'), changed: true }], heap: [], output: [], note: 'Примітив лежить просто в змінній. «Стек» і «купа» тут — ментальна модель: де саме зберігати, вирішує рушій, але семантика копіювання саме така.' },
    { line: 2, stack: [{ name: 'a', value: p('5') }, { name: 'b', value: p('5'), changed: true }], heap: [], output: [], note: 'b = a копіює ЗНАЧЕННЯ. Тепер є дві незалежні п’ятірки.' },
    { line: 3, stack: [{ name: 'a', value: p('5') }, { name: 'b', value: p('7'), changed: true }], heap: [], output: [], note: 'Змінюємо b — a не зачеплено. Примітиви незмінні й копіюються цілком.' },
    { line: 5, stack: [...ab, { name: 'cat', value: r('cat'), changed: true }], heap: [catObj("'Мурка'")], output: [], note: 'Літерал створює об’єкт у купі, а в cat кладеться ПОСИЛАННЯ на нього (умовна адреса #1).' },
    { line: 6, stack: [...ab, { name: 'cat', value: r('cat') }, { name: 'alias', value: r('cat'), changed: true }], heap: [catObj("'Мурка'")], output: [], note: 'alias = cat копіює посилання, а не об’єкт. Дві змінні — один об’єкт.' },
    { line: 7, stack: full, heap: [catObj("'Тигра'", true)], output: [], note: 'Змінюємо об’єкт через alias — і зміна видна через cat, бо це той самий об’єкт. const забороняє переприсвоїти змінну, а не змінювати об’єкт.' },
    { line: 9, stack: full, heap: [catObj("'Тигра'")], output: ['5 7'], note: 'a і b незалежні: 5 7.' },
    { line: 10, stack: full, heap: [catObj("'Тигра'")], output: ['5 7', 'Тигра'], note: 'cat.name читає той самий об’єкт #1, який змінили через alias.' },
    { line: 11, stack: full, heap: [catObj("'Тигра'")], output: ['5 7', 'Тигра', 'true'], note: '=== для об’єктів порівнює посилання: обидві змінні вказують на #1. Два однакові за вмістом, але різні об’єкти дали б false.' },
  ],
}

// ── shallow-vs-deep ──────────────────────────────────────────────
const cloneCode = `const user = {
  name: 'Аня',
  address: { city: 'Київ' },
}
const shallow = { ...user }
const deep = structuredClone(user)

shallow.name = 'Бо'
shallow.address.city = 'Львів'

console.log(user.name, user.address.city)
console.log(deep.address.city)`

const userObj: HeapObj = { id: 'u', label: '#1 user', icon: 'px:person', fields: [{ key: 'name', value: p("'Аня'") }, { key: 'address', value: r('addr') }] }
const addr = (city: string, changed = false): HeapObj => ({ id: 'addr', label: '#2', icon: 'px:house', fields: [{ key: 'city', value: p(city), changed }] })
const shallowObj = (name: string, changed = false): HeapObj => ({ id: 's', label: '#3 shallow', icon: 'px:mirror', fields: [{ key: 'name', value: p(name), changed }, { key: 'address', value: r('addr') }] })
const deepObj: HeapObj = { id: 'd', label: '#4 deep', icon: 'px:clipboard', fields: [{ key: 'name', value: p("'Аня'") }, { key: 'address', value: r('addr2') }] }
const addr2: HeapObj = { id: 'addr2', label: '#5', icon: 'px:house', fields: [{ key: 'city', value: p("'Київ'") }] }
const vars3 = [{ name: 'user', value: r('u') }, { name: 'shallow', value: r('s') }, { name: 'deep', value: r('d') }]
const kyiv = "'Київ'"
const lviv = "'Львів'"

const shallowVsDeep: StepScenario<MemFrame> = {
  code: cloneCode,
  frames: [
    { line: 1, stack: [{ name: 'user', value: r('u'), changed: true }], heap: [userObj, addr(kyiv)], output: [], note: 'user — об’єкт #1, а address — окремий вкладений об’єкт #2. У полі address лежить лише посилання на нього.' },
    { line: 5, stack: [{ name: 'user', value: r('u') }, { name: 'shallow', value: r('s'), changed: true }], heap: [userObj, addr(kyiv), shallowObj("'Аня'")], output: [], note: 'Spread створює НОВИЙ об’єкт #3 і копіює поля верхнього рівня. address скопійовано як посилання — на той самий #2!' },
    { line: 6, stack: [{ name: 'user', value: r('u') }, { name: 'shallow', value: r('s') }, { name: 'deep', value: r('d'), changed: true }], heap: [userObj, addr(kyiv), shallowObj("'Аня'"), deepObj, addr2], output: [], note: 'structuredClone рекурсивно копіює все: новий #4 і новий вкладений #5. Спільних об’єктів з user немає.' },
    { line: 8, stack: vars3, heap: [userObj, addr(kyiv), shallowObj("'Бо'", true), deepObj, addr2], output: [], note: 'Зміна поля верхнього рівня в копії не зачіпає user: name у #3 — власна копія рядка.' },
    { line: 9, stack: vars3, heap: [userObj, addr(lviv, true), shallowObj("'Бо'"), deepObj, addr2], output: [], note: 'А тут шлях shallow → address веде у СПІЛЬНИЙ #2. Змінюємо його — і user.address змінюється теж.' },
    { line: 11, stack: vars3, heap: [userObj, addr(lviv), shallowObj("'Бо'"), deepObj, addr2], output: ['Аня Львів'], note: 'user.name не змінився, а місто — змінилося. Класична пастка поверхневої копії.' },
    { line: 12, stack: vars3, heap: [userObj, addr(lviv), shallowObj("'Бо'"), deepObj, addr2], output: ['Аня Львів', 'Київ'], note: 'У deep власний #5 — його зміни не торкнулись. Але structuredClone не клонує функції (кидає DataCloneError) і не зберігає прототипи класів.' },
  ],
}

export const memoryScenarios: Record<string, StepScenario<MemFrame>> = {
  'copy-primitive-vs-object': copyPrimitiveVsObject,
  'shallow-vs-deep': shallowVsDeep,
}
