import { itok, tok, type Frame, type StepScenario, type Token, type VizIcon } from '../engine/types'

export type PromiseState = 'pending' | 'fulfilled' | 'rejected'

export const STATE_ICON: Record<PromiseState, VizIcon> = { pending: 'px:hourglass', fulfilled: 'px:check', rejected: 'px:cross' }

export interface PromiseBox {
  id: string
  label: string
  state: PromiseState
  value?: string
}

export interface ChainFrame extends Frame {
  promises: PromiseBox[]
  stack: Token[]
  webApis: Token[]
  microtasks: Token[]
  output: string[]
}

const chainCode = `const p1 = new Promise((resolve) => {
  setTimeout(() => resolve(2), 1000)
})
const p2 = p1.then((x) => x * 10)
const p3 = p2.then((x) => {
  throw new Error('помилка ' + x)
})
const p4 = p3.then((x) => x + 1)
const p5 = p4.catch((e) => e.message)
p5.then((msg) => console.log(msg))`

const P = (n: number, state: PromiseState = 'pending', value?: string): PromiseBox => ({ id: `p${n}`, label: n === 6 ? '(p6)' : `p${n}`, state, ...(value !== undefined ? { value } : {}) })
const pending = (count: number) => Array.from({ length: count }, (_, i) => P(i + 1))
const SCRIPT = itok('px:scroll', 'script', 'script')
const timer = itok('px:clock', 'timer', 'таймер 1000 мс', '→ resolve(2)')
const ERR = "Error('помилка 20')"

const chain: StepScenario<ChainFrame> = {
  code: chainCode,
  frames: [
    { line: 2, promises: pending(1), stack: [SCRIPT, tok('exec', 'executor')], webApis: [timer], microtasks: [], output: [], note: 'new Promise одразу й синхронно викликає executor. Той лише запускає таймер, тож p1 лишається pending.' },
    { line: 4, promises: pending(2), stack: [SCRIPT], webApis: [timer], microtasks: [], output: [], note: 'p1.then(…) нічого не чекає: реєструє реакцію на p1 і одразу повертає НОВИЙ проміс p2.' },
    { line: 5, promises: pending(3), stack: [SCRIPT], webApis: [timer], microtasks: [], output: [], note: 'p2.then → p3. Ланцюжок — це низка різних промісів, кожен залежить від попереднього.' },
    { line: 8, promises: pending(4), stack: [SCRIPT], webApis: [timer], microtasks: [], output: [], note: 'p3.then → p4. Зверніть увагу: тут лише обробник успіху, обробника помилки немає.' },
    { line: 10, promises: pending(6), stack: [SCRIPT], webApis: [timer], microtasks: [], output: [], note: '.catch(f) — це просто .then(undefined, f), він повертає p5. Останній then теж повертає проміс (p6), просто його не зберегли. Усі шість — pending.' },
    { line: 2, promises: [P(1, 'fulfilled', '2'), ...pending(6).slice(1)], stack: [tok('timer', '() => resolve(2)')], webApis: [], microtasks: [itok('pi:PiSparkleFill', 'r2', 'x => x * 10', 'для p2')], output: [], note: 'Через секунду макрозадача таймера викликає resolve(2): p1 стає fulfilled, а реакція p2 стає мікрозадачею.' },
    { line: 4, promises: [P(1, 'fulfilled', '2'), P(2, 'fulfilled', '20'), ...pending(6).slice(2)], stack: [tok('r2', 'x => x * 10')], webApis: [], microtasks: [itok('pi:PiSparkleFill', 'r3', 'x => { throw … }', 'для p3')], output: [], note: 'Мікрозадача: 2 * 10 = 20. Повернене значення виконує p2, і в чергу стає наступна реакція.' },
    { line: 6, promises: [P(1, 'fulfilled', '2'), P(2, 'fulfilled', '20'), P(3, 'rejected', ERR), ...pending(6).slice(3)], stack: [tok('r3', 'x => { throw … }')], webApis: [], microtasks: [itok('pi:PiSparkleFill', 'r4', 'реакція p4', 'onRejected немає')], output: [], note: 'Обробник кидає помилку — p3 стає rejected. Виняток у then не ламає програму, а перетворюється на відхилений проміс.' },
    { line: 8, promises: [P(1, 'fulfilled', '2'), P(2, 'fulfilled', '20'), P(3, 'rejected', ERR), P(4, 'rejected', ERR), P(5), P(6)], stack: [tok('r4', 'реакція p4')], webApis: [], microtasks: [itok('pi:PiSparkleFill', 'r5', 'e => e.message', 'для p5')], output: [], note: 'x => x + 1 НЕ викликається: у цього then немає обробника помилки, тож p4 відхиляється тією самою помилкою. Помилка «пролітає» ланцюжком до найближчого catch.' },
    { line: 9, promises: [P(1, 'fulfilled', '2'), P(2, 'fulfilled', '20'), P(3, 'rejected', ERR), P(4, 'rejected', ERR), P(5, 'fulfilled', "'помилка 20'"), P(6)], stack: [tok('r5', 'e => e.message')], webApis: [], microtasks: [itok('pi:PiSparkleFill', 'r6', 'msg => log(msg)', 'для p6')], output: [], note: 'catch обробив помилку і ПОВЕРНУВ рядок — тому p5 fulfilled. Після catch ланцюжок знову «здоровий».' },
    { line: 10, promises: [P(1, 'fulfilled', '2'), P(2, 'fulfilled', '20'), P(3, 'rejected', ERR), P(4, 'rejected', ERR), P(5, 'fulfilled', "'помилка 20'"), P(6, 'fulfilled', 'undefined')], stack: [tok('r6', 'msg => log(msg)')], webApis: [], microtasks: [], output: ['помилка 20'], note: 'Останній обробник друкує «помилка 20». console.log повертає undefined, тож p6 fulfilled зі значенням undefined.' },
  ],
}

export const promiseScenarios: Record<string, StepScenario<ChainFrame>> = { chain }
