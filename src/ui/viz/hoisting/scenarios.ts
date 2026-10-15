import type { Frame, StepScenario } from '../engine/types'

export type BindingKind = 'var' | 'let' | 'const' | 'function'

export interface Binding {
  name: string
  kind: BindingKind
  value: string
  // tdz: created but not initialized
  state: 'tdz' | 'ready'
  changed?: boolean
}

export interface ExecContext {
  id: string
  name: string
  phase: 'creation' | 'execution'
  bindings: Binding[]
}

export interface HoistFrame extends Frame {
  // bottom → top (like the call stack)
  contexts: ExecContext[]
  lookup?: { context: string; name: string }
  output: string[]
  error?: string
}

// ── var-let-function ─────────────────────────────────────────────
const basicsCode = `console.log(typeof greet)
console.log(score)
greet()

var score = 10
let level = 1

function greet() {
  console.log('👋 привіт')
}

console.log(score, level)`

const score = (value: string, changed = false): Binding => ({ name: 'score', kind: 'var', value, state: 'ready', changed })
const levelTdz: Binding = { name: 'level', kind: 'let', value: '‹TDZ›', state: 'tdz' }
const greet: Binding = { name: 'greet', kind: 'function', value: 'ƒ greet() {…}', state: 'ready' }
const gctx = (phase: ExecContext['phase'], bindings: Binding[]): ExecContext => ({ id: 'global', name: '🌐 Глобальний контекст', phase, bindings })

const varLetFunction: StepScenario<HoistFrame> = {
  code: basicsCode,
  frames: [
    { line: null, contexts: [gctx('creation', [])], output: [], note: 'Перш ніж виконати хоч один рядок, рушій створює контекст виконання. Фаза 1 — створення: він знаходить усі оголошення в коді.' },
    { line: 5, contexts: [gctx('creation', [score('undefined', true)])], output: [], note: 'var score: змінна створюється і одразу ініціалізується значенням undefined. Присвоєння = 10 лишається на своєму місці.' },
    { line: 6, contexts: [gctx('creation', [score('undefined'), { ...levelTdz, changed: true }])], output: [], note: 'let level: прив’язка теж створюється заздалегідь, але НЕ ініціалізується. До виконання рядка 6 вона в Temporal Dead Zone.' },
    { line: 8, contexts: [gctx('creation', [score('undefined'), levelTdz, { ...greet, changed: true }])], output: [], note: 'function greet створюється повністю, разом з тілом. Тому її можна викликати ще до рядка, де вона написана.' },
    { line: 1, contexts: [gctx('execution', [score('undefined'), levelTdz, greet])], lookup: { context: 'global', name: 'greet' }, output: ['function'], note: 'Фаза 2 — виконання, рядок за рядком. typeof greet → "function": функція вже існує.' },
    { line: 2, contexts: [gctx('execution', [score('undefined'), levelTdz, greet])], lookup: { context: 'global', name: 'score' }, output: ['function', 'undefined'], note: 'score існує, але присвоєння ще не відбулось — тому undefined, без помилки.' },
    { line: 3, contexts: [gctx('execution', [score('undefined'), levelTdz, greet])], lookup: { context: 'global', name: 'greet' }, output: ['function', 'undefined', '👋 привіт'], note: 'Виклик greet() до її оголошення працює саме завдяки фазі створення.' },
    { line: 5, contexts: [gctx('execution', [score('10', true), levelTdz, greet])], output: ['function', 'undefined', '👋 привіт'], note: 'Лише тепер score отримує 10. «Спливає» оголошення, а не присвоєння.' },
    { line: 6, contexts: [gctx('execution', [score('10'), { name: 'level', kind: 'let', value: '1', state: 'ready', changed: true }, greet])], output: ['function', 'undefined', '👋 привіт'], note: 'Рядок з let виконано — TDZ для level закінчилась. Будь-яке звернення до level вище цього рядка кинуло б ReferenceError.' },
    { line: 12, contexts: [gctx('execution', [score('10'), { name: 'level', kind: 'let', value: '1', state: 'ready' }, greet])], output: ['function', 'undefined', '👋 привіт', '10 1'], note: 'Обидві змінні ініціалізовані: 10 1. Правило: function — повністю, var — як undefined, let/const/class — у TDZ.' },
  ],
}

// ── tdz ──────────────────────────────────────────────────────────
const tdzCode = `let drink = '🍵 чай'

function order() {
  console.log(drink)
  let drink = '☕ кава'
  return drink
}

order()`

const order: Binding = { name: 'order', kind: 'function', value: 'ƒ order() {…}', state: 'ready' }
const outerDrink = (state: Binding['state'], changed = false): Binding =>
  state === 'tdz' ? { name: 'drink', kind: 'let', value: '‹TDZ›', state, changed } : { name: 'drink', kind: 'let', value: "'🍵 чай'", state, changed }
const orderCtx = (phase: ExecContext['phase']): ExecContext => ({ id: 'order', name: '⚙️ order()', phase, bindings: [{ name: 'drink', kind: 'let', value: '‹TDZ›', state: 'tdz', changed: phase === 'creation' }] })

const tdz: StepScenario<HoistFrame> = {
  code: tdzCode,
  frames: [
    { line: null, contexts: [gctx('creation', [outerDrink('tdz', true), { ...order, changed: true }])], output: [], note: 'Фаза створення глобального контексту: drink (let) — у TDZ, order — готова функція.' },
    { line: 1, contexts: [gctx('execution', [outerDrink('ready', true), order])], output: [], note: 'Виконання: зовнішня drink ініціалізована значенням «🍵 чай».' },
    { line: 9, contexts: [gctx('execution', [outerDrink('ready'), order]), orderCtx('creation')], output: [], note: 'Виклик order() створює новий контекст. У його фазі створення реєструється ВЛАСНА drink з рядка 5 — і вона в TDZ.' },
    { line: 4, contexts: [gctx('execution', [outerDrink('ready'), order]), orderCtx('execution')], lookup: { context: 'order', name: 'drink' }, output: [], error: "ReferenceError: Cannot access 'drink' before initialization", note: 'console.log(drink) знаходить найближчу drink — локальну, а вона ще в TDZ. Зовнішню «🍵 чай» затінено, тож рушій кидає ReferenceError.' },
    { line: null, contexts: [gctx('execution', [outerDrink('ready'), order])], output: [], error: "Uncaught ReferenceError: Cannot access 'drink' before initialization", note: 'Помилку ніхто не перехопив: контекст order знято, скрипт зупинено. З var тут тихо вивелось би undefined — TDZ робить таку помилку гучною.' },
  ],
}

export const hoistingScenarios: Record<string, StepScenario<HoistFrame>> = {
  'var-let-function': varLetFunction,
  tdz,
}
