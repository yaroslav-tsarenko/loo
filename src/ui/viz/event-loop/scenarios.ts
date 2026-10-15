import { tok, type Frame, type StepScenario, type Token } from '../engine/types'

export type LoopPhase = 'script' | 'micro' | 'macro' | 'idle'

export interface EventLoopFrame extends Frame {
  phase: LoopPhase
  // bottom → top
  stack: Token[]
  webApis: Token[]
  // FIFO: first item runs next
  microtasks: Token[]
  macrotasks: Token[]
  output: string[]
}

const SCRIPT = tok('script', '📜 script', 'макрозадача #1')
const empty = { webApis: [], microtasks: [], macrotasks: [] }

// ── basic-timeout ────────────────────────────────────────────────
const basicCode = `console.log('1 🍳 старт')

setTimeout(() => {
  console.log('3 ⏰ таймер')
}, 0)

console.log('2 🏁 кінець')`

const timerApi = tok('timer', '⏱️ таймер 0 мс', 'чекає на колбек')
const timerTask = tok('timer', '⏰ колбек таймера')
const timerRun = tok('timer', '() => { … }', 'колбек таймера')

const basicTimeout: StepScenario<EventLoopFrame> = {
  code: basicCode,
  frames: [
    { line: null, phase: 'script', stack: [SCRIPT], ...empty, output: [], note: 'Увесь скрипт — це перша макрозадача (task). Рушій кладе глобальний контекст у стек і виконує код рядок за рядком.' },
    { line: 1, phase: 'script', stack: [SCRIPT, tok('log1', "console.log('1…')")], ...empty, output: ['1 🍳 старт'], note: 'console.log виконується синхронно: кадр у стеку, рядок у консолі, кадр знято.' },
    { line: 3, phase: 'script', stack: [SCRIPT, tok('st', 'setTimeout(cb, 0)')], ...empty, webApis: [timerApi], output: ['1 🍳 старт'], note: 'setTimeout лише просить браузер (Web API) запустити таймер і одразу повертається. Сам колбек поки не виконується.' },
    { line: 7, phase: 'script', stack: [SCRIPT, tok('log2', "console.log('2…')")], ...empty, macrotasks: [timerTask], output: ['1 🍳 старт', '2 🏁 кінець'], note: 'Друкуємо «2». Тим часом таймер на 0 мс сплив, і браузер поставив колбек у чергу макрозадач — але стек зайнятий, тож колбек чекає.' },
    { line: null, phase: 'micro', stack: [], ...empty, macrotasks: [timerTask], output: ['1 🍳 старт', '2 🏁 кінець'], note: 'Скрипт закінчився, стек порожній. Перед наступною макрозадачею event loop виконує всі мікрозадачі — зараз їх немає.' },
    { line: 4, phase: 'macro', stack: [timerRun, tok('log3', "console.log('3…')")], ...empty, output: ['1 🍳 старт', '2 🏁 кінець', '3 ⏰ таймер'], note: 'Event loop бере найстаршу макрозадачу — колбек таймера — і виконує його. Тож «0 мс» означає «не раніше ніж», а не «негайно».' },
    { line: null, phase: 'idle', stack: [], ...empty, output: ['1 🍳 старт', '2 🏁 кінець', '3 ⏰ таймер'], note: 'Колбек завершився, черги порожні. Event loop чекає на нові події: кліки, таймери, відповіді мережі.' },
  ],
}

// ── promise-vs-timeout ───────────────────────────────────────────
const pvtCode = `console.log('A')

setTimeout(() => console.log('B'), 0)

Promise.resolve()
  .then(() => console.log('C'))

console.log('D')`

const tB = tok('tB', '⏱️ таймер 0 мс', 'колбек → B')
const tBq = tok('tB', '⏰ () => log(B)')
const mC = tok('mC', '✨ () => log(C)', 'реакція then')

const promiseVsTimeout: StepScenario<EventLoopFrame> = {
  code: pvtCode,
  frames: [
    { line: null, phase: 'script', stack: [SCRIPT], ...empty, output: [], note: 'Скрипт — перша макрозадача. Глобальний контекст у стеку, черги порожні.' },
    { line: 1, phase: 'script', stack: [SCRIPT, tok('logA', "console.log('A')")], ...empty, output: ['A'], note: 'Синхронний console.log — одразу в консоль: A.' },
    { line: 3, phase: 'script', stack: [SCRIPT, tok('st', 'setTimeout(cb, 0)')], ...empty, webApis: [tB], output: ['A'], note: 'setTimeout передає колбек таймеру браузера і повертається. B у кращому разі виконається в наступній макрозадачі.' },
    { line: 6, phase: 'script', stack: [SCRIPT, tok('then', '.then(cb)')], webApis: [tB], microtasks: [mC], macrotasks: [], output: ['A'], note: 'Promise.resolve() уже fulfilled, тож .then одразу ставить колбек у чергу мікрозадач. Але виконається він лише тоді, коли стек спорожніє.' },
    { line: 8, phase: 'script', stack: [SCRIPT, tok('logD', "console.log('D')")], webApis: [], microtasks: [mC], macrotasks: [tBq], output: ['A', 'D'], note: 'Друкуємо D — останній синхронний рядок. Таймер тим часом сплив, і його колбек чекає в черзі макрозадач.' },
    { line: null, phase: 'micro', stack: [], webApis: [], microtasks: [mC], macrotasks: [tBq], output: ['A', 'D'], note: 'Макрозадача «скрипт» завершилась. Тепер microtask checkpoint: event loop виконує ВСІ мікрозадачі, перш ніж узяти наступну макрозадачу.' },
    { line: 6, phase: 'micro', stack: [tok('mC', '() => log(C)')], webApis: [], microtasks: [], macrotasks: [tBq], output: ['A', 'D', 'C'], note: 'Колбек .then друкує C. Мікрозадачі завжди йдуть раніше за наступну макрозадачу, навіть якщо таймер став у чергу першим.' },
    { line: 3, phase: 'macro', stack: [tok('tB', '() => log(B)')], ...empty, output: ['A', 'D', 'C', 'B'], note: 'Черга мікрозадач порожня — event loop бере наступну макрозадачу: колбек таймера друкує B. Підсумок: A D C B.' },
    { line: null, phase: 'idle', stack: [], ...empty, output: ['A', 'D', 'C', 'B'], note: 'Ритм event loop: одна макрозадача → усі мікрозадачі → (можливо, рендер) → наступна макрозадача.' },
  ],
}

// ── async-await ──────────────────────────────────────────────────
const asyncCode = `async function brew() {
  console.log('2 ☕ варю')
  await null
  console.log('4 ✅ готово')
}

console.log('1 🚀 старт')
setTimeout(() => console.log('5 ⏰'), 0)
brew()
console.log('3 🏁 кінець')`

const t5 = tok('t5', '⏱️ таймер 0 мс', 'колбек → 5')
const t5q = tok('t5', '⏰ () => log(5)')
const brewFrame = tok('brew', 'brew()', 'виконується')
const brewCont = tok('brew', '✨ brew: після await', 'продовження')

const asyncAwait: StepScenario<EventLoopFrame> = {
  code: asyncCode,
  frames: [
    { line: null, phase: 'script', stack: [SCRIPT], ...empty, output: [], note: 'Скрипт — перша макрозадача. Функція brew оголошена, але ще не викликана.' },
    { line: 7, phase: 'script', stack: [SCRIPT, tok('l1', "console.log('1…')")], ...empty, output: ['1 🚀 старт'], note: 'Синхронний вивід «1».' },
    { line: 8, phase: 'script', stack: [SCRIPT, tok('st', 'setTimeout(cb, 0)')], ...empty, webApis: [t5], output: ['1 🚀 старт'], note: 'Таймер пішов у Web API; його колбек стане окремою макрозадачею.' },
    { line: 2, phase: 'script', stack: [SCRIPT, brewFrame], webApis: [], microtasks: [], macrotasks: [t5q], output: ['1 🚀 старт', '2 ☕ варю'], note: 'brew() виконується синхронно, як звичайна функція, аж до першого await — тому «2» друкується одразу. Таймер тим часом сплив і чекає в черзі макрозадач.' },
    { line: 3, phase: 'script', stack: [SCRIPT, brewFrame], webApis: [], microtasks: [brewCont], macrotasks: [t5q], output: ['1 🚀 старт', '2 ☕ варю'], note: 'await null загортає значення у вже виконаний проміс і підписує продовження функції на нього. Оскільки проміс fulfilled, продовження одразу стає мікрозадачею.' },
    { line: 9, phase: 'script', stack: [SCRIPT], webApis: [], microtasks: [brewCont], macrotasks: [t5q], output: ['1 🚀 старт', '2 ☕ варю'], note: 'brew призупинена і знята зі стека, а виклик brew() уже повернув pending-проміс. Скрипт іде далі, нічого не чекаючи.' },
    { line: 10, phase: 'script', stack: [SCRIPT, tok('l3', "console.log('3…')")], webApis: [], microtasks: [brewCont], macrotasks: [t5q], output: ['1 🚀 старт', '2 ☕ варю', '3 🏁 кінець'], note: 'Друкується «3». Рядок після await досі не виконувався — він у черзі мікрозадач.' },
    { line: null, phase: 'micro', stack: [], webApis: [], microtasks: [brewCont], macrotasks: [t5q], output: ['1 🚀 старт', '2 ☕ варю', '3 🏁 кінець'], note: 'Скрипт завершився, стек порожній. Microtask checkpoint: першим іде продовження brew.' },
    { line: 4, phase: 'micro', stack: [tok('brew', 'brew()', 'відновлена')], webApis: [], microtasks: [], macrotasks: [t5q], output: ['1 🚀 старт', '2 ☕ варю', '3 🏁 кінець', '4 ✅ готово'], note: 'brew відновлюється з того самого місця й з тими самими змінними та друкує «4». Дійшовши до кінця, вона виконує (fulfill) свій проміс значенням undefined.' },
    { line: 8, phase: 'macro', stack: [tok('t5', '() => log(5)')], ...empty, output: ['1 🚀 старт', '2 ☕ варю', '3 🏁 кінець', '4 ✅ готово', '5 ⏰'], note: 'Мікрозадач більше немає — event loop бере макрозадачу таймера: «5». Підсумок: 1 2 3 4 5.' },
  ],
}

// ── microtask-starvation ─────────────────────────────────────────
const starvationCode = `setTimeout(() => console.log('⏰ таймер'), 0)

function loop(n) {
  if (n === 0) return
  Promise.resolve().then(() => {
    console.log('🔁', n)
    loop(n - 1)
  })
}

loop(3)`

const tT = tok('tT', '⏱️ таймер 0 мс', 'колбек → ⏰')
const tTq = tok('tT', '⏰ () => log(таймер)')
const m = (n: number) => tok(`m${n}`, `✨ then: n = ${n}`)
const run = (n: number) => tok(`m${n}`, `() => { … } n = ${n}`, 'мікрозадача')

const microtaskStarvation: StepScenario<EventLoopFrame> = {
  code: starvationCode,
  frames: [
    { line: null, phase: 'script', stack: [SCRIPT], ...empty, output: [], note: 'Скрипт — перша макрозадача. Спершу запускаємо таймер, потім ланцюжок мікрозадач.' },
    { line: 1, phase: 'script', stack: [SCRIPT, tok('st', 'setTimeout(cb, 0)')], ...empty, webApis: [tT], output: [], note: 'Таймер на 0 мс пішов у Web API.' },
    { line: 5, phase: 'script', stack: [SCRIPT, tok('loop3', 'loop(3)')], webApis: [], microtasks: [m(3)], macrotasks: [tTq], output: [], note: 'loop(3) ставить колбек у чергу мікрозадач і повертається. Таймер тим часом сплив — його колбек у черзі макрозадач.' },
    { line: null, phase: 'micro', stack: [], webApis: [], microtasks: [m(3)], macrotasks: [tTq], output: [], note: 'Скрипт завершився. Таймер стоїть у черзі першим, але спершу — microtask checkpoint.' },
    { line: 6, phase: 'micro', stack: [run(3)], webApis: [], microtasks: [], macrotasks: [tTq], output: ['🔁 3'], note: 'Виконується мікрозадача n = 3 і друкує «🔁 3».' },
    { line: 7, phase: 'micro', stack: [run(3), tok('loop2', 'loop(2)')], webApis: [], microtasks: [m(2)], macrotasks: [tTq], output: ['🔁 3'], note: 'Вона викликає loop(2), і та додає НОВУ мікрозадачу — у ту саму чергу, яку event loop зараз розбирає.' },
    { line: 7, phase: 'micro', stack: [run(2), tok('loop1', 'loop(1)')], webApis: [], microtasks: [m(1)], macrotasks: [tTq], output: ['🔁 3', '🔁 2'], note: 'Черга не порожня, тож до таймера справа не доходить: n = 2 друкує і знову додає мікрозадачу n = 1.' },
    { line: 4, phase: 'micro', stack: [run(1), tok('loop0', 'loop(0)')], webApis: [], microtasks: [], macrotasks: [tTq], output: ['🔁 3', '🔁 2', '🔁 1'], note: 'n = 1 друкує і викликає loop(0) — base case, нових мікрозадач немає. Черга нарешті спорожніла.' },
    { line: 1, phase: 'macro', stack: [tok('tT', '() => log(таймер)')], ...empty, output: ['🔁 3', '🔁 2', '🔁 1', '⏰ таймер'], note: 'Лише тепер event loop бере макрозадачу таймера. Він просив 0 мс, а чекав, доки не скінчились усі мікрозадачі — навіть ті, що з’явились пізніше за нього.' },
    { line: null, phase: 'idle', stack: [], ...empty, output: ['🔁 3', '🔁 2', '🔁 1', '⏰ таймер'], note: 'Без base case мікрозадачі додавали б одна одну вічно: таймери, кліки і навіть рендер сторінки не отримали б черги — вкладка «зависла» б.' },
  ],
}

export const eventLoopScenarios: Record<string, StepScenario<EventLoopFrame>> = {
  'basic-timeout': basicTimeout,
  'promise-vs-timeout': promiseVsTimeout,
  'async-await': asyncAwait,
  'microtask-starvation': microtaskStarvation,
}
