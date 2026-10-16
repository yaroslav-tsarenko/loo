import { itok, tok, type Frame, type StepScenario, type Token } from '../engine/types'

export interface CallStackFrame extends Frame {
  // bottom → top
  stack: Token[]
  output: string[]
  returning?: string
  // frames collapsed in the middle of the stack (overflow demo)
  hidden?: number
  error?: string
}

const G = itok('px:globe', 'global', 'global', 'глобальний код')

const nestedCode = `function greet(name) {
  return \`Привіт, \${name}!\`
}

function welcome(user) {
  const text = greet(user)
  console.log(text)
}

welcome('Аня')`

const welcome = tok('welcome', "welcome('Аня')", 'user = Аня')
const greet = tok('greet', "greet('Аня')", 'name = Аня')
const log = tok('log', 'console.log(text)')

const nestedCalls: StepScenario<CallStackFrame> = {
  code: nestedCode,
  frames: [
    { line: null, stack: [G], output: [], note: 'Перед першим рядком рушій створює глобальний контекст виконання і кладе його на дно стека. Оголошення функцій уже готові до виклику — це hoisting.' },
    { line: 10, stack: [G, welcome], output: [], note: "Виклик welcome('Аня') створює новий контекст виконання і кладе його (push) на вершину стека. Глобальний код чекає, доки welcome поверне керування." },
    { line: 6, stack: [G, welcome, { ...greet, hint: 'name = Аня' }], output: [], note: 'welcome викликає greet — ще один кадр зверху. Виконується лише верхній кадр, усі нижчі стоять на паузі.' },
    { line: 2, stack: [G, welcome, greet], output: [], returning: "'Привіт, Аня!'", note: 'greet обчислює рядок і робить return. Значення повернеться туди, звідки greet викликали.' },
    { line: 6, stack: [G, { ...welcome, hint: 'text = Привіт, Аня!' }], output: [], note: 'Кадр greet знято (pop). welcome продовжує рівно з того місця, де зупинилась, і записує результат у text.' },
    { line: 7, stack: [G, welcome, log], output: ['Привіт, Аня!'], note: 'console.log — теж функція: на мить свій кадр на вершині, рядок у консолі, і кадр знято.' },
    { line: 8, stack: [G], output: ['Привіт, Аня!'], returning: 'undefined', note: 'welcome дійшла до кінця тіла без return, тож повертає undefined. Її кадр знято — у стеку лишився глобальний контекст.' },
    { line: null, stack: [], output: ['Привіт, Аня!'], note: 'Скрипт завершився, глобальний контекст теж знято. Стек порожній — тепер event loop може взяти наступну задачу.' },
  ],
}

const recursionCode = `function factorial(n) {
  if (n === 1) return 1
  return n * factorial(n - 1)
}

console.log(factorial(3))`

const f = (n: number, hint: string) => tok(`f${n}`, `factorial(${n})`, hint)

const recursion: StepScenario<CallStackFrame> = {
  code: recursionCode,
  frames: [
    { line: null, stack: [G], output: [], note: 'Глобальний контекст на дні стека. Функція factorial оголошена й готова до виклику.' },
    { line: 6, stack: [G, f(3, 'n = 3')], output: [], note: 'Щоб викликати console.log, спершу треба обчислити аргумент. Виклик factorial(3) кладе кадр з власною змінною n = 3.' },
    { line: 3, stack: [G, f(3, 'n = 3 · чекає'), f(2, 'n = 2')], output: [], note: 'n ≠ 1, тож потрібен factorial(2). Кадр factorial(3) чекає на результат, а зверху з’являється новий кадр зі своїм n = 2.' },
    { line: 3, stack: [G, f(3, 'n = 3 · чекає'), f(2, 'n = 2 · чекає'), f(1, 'n = 1')], output: [], note: 'Те саме для n = 2. Кожен виклик має окрему змінну n — три різні n живуть одночасно у трьох кадрах.' },
    { line: 2, stack: [G, f(3, 'n = 3 · чекає'), f(2, 'n = 2 · чекає'), f(1, 'n = 1')], output: [], returning: '1', note: 'Base case: n === 1, повертаємо 1 без нового виклику. Саме base case зупиняє ріст стека.' },
    { line: 3, stack: [G, f(3, 'n = 3 · чекає'), f(2, 'n = 2')], output: [], returning: '2 * 1 = 2', note: 'Кадр factorial(1) знято. factorial(2) отримує 1, множить і повертає 2.' },
    { line: 3, stack: [G, f(3, 'n = 3')], output: [], returning: '3 * 2 = 6', note: 'factorial(3) отримує 2 і повертає 6. Стек згортається у зворотному порядку — LIFO: останній прийшов, перший пішов.' },
    { line: 6, stack: [G, tok('log', 'console.log(6)')], output: ['6'], note: 'Аргумент обчислено — console.log(6) друкує результат.' },
    { line: null, stack: [], output: ['6'], note: 'Глибина стека була n + 1 кадрів (разом з глобальним). Тому рекурсія на мільйон рівнів не влізе — про це наступний сценарій.' },
  ],
}

const overflowCode = `function countdown(n) {
  console.log(n)
  countdown(n - 1) // де стоп?
}

countdown(3)`

const c = (n: number) => tok(`c${n}`, `countdown(${n})`, `n = ${n}`)

const stackOverflow: StepScenario<CallStackFrame> = {
  code: overflowCode,
  frames: [
    { line: null, stack: [G], output: [], note: 'Глобальний контекст на дні стека. Зверніть увагу: у countdown немає умови виходу (base case).' },
    { line: 6, stack: [G, c(3)], output: [], note: 'countdown(3) кладе кадр з n = 3.' },
    { line: 2, stack: [G, c(3)], output: ['3'], note: 'Друкуємо 3 і без жодної перевірки викликаємо countdown(2).' },
    { line: 2, stack: [G, c(3), c(2)], output: ['3', '2'], note: 'Новий кадр поверх старого. Попередній не знімається: він ще не дійшов до кінця тіла і чекає на вкладений виклик.' },
    { line: 2, stack: [G, c(3), c(2), c(1), c(0), c(-1)], output: ['3', '2', '1', '0', '-1'], note: '1, 0, −1… Нічого не зупиняє рекурсію, а кожен виклик займає місце у стеку.' },
    { line: 3, stack: [G, c(3), c(2), c(1), tok('cN', 'countdown(-10 470)', 'n = −10 470')], hidden: 10470, output: ['3', '2', '1', '0', '-1', '…', '-10470'], note: 'Стек — обмежена ділянка пам’яті. У V8 її зазвичай вистачає на порядок 10 тисяч простих кадрів; точне число залежить від розміру кадру і рушія.' },
    { line: 3, stack: [G, c(3), c(2), c(1), tok('cN', 'countdown(-10 470)', 'n = −10 470')], hidden: 10470, output: ['3', '2', '1', '0', '-1', '…', '-10470'], error: 'RangeError: Maximum call stack size exceeded', note: 'Місця для нового кадру немає — рушій кидає RangeError: Maximum call stack size exceeded. Це звичайний виняток, а не «зависання».' },
    { line: null, stack: [], output: ['3', '2', '1', '0', '-1', '…', '-10470'], error: 'Uncaught RangeError: Maximum call stack size exceeded', note: 'Виняток ніхто не перехопив, тож він розкручує стек: усі кадри countdown знято, скрипт завершився з помилкою. Ліки — base case: if (n < 0) return.' },
  ],
}

export const callStackScenarios: Record<string, StepScenario<CallStackFrame>> = {
  'nested-calls': nestedCalls,
  recursion,
  'stack-overflow': stackOverflow,
}
