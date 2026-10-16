import type { StepScenario } from '../engine/types'
import type { HeapObj, MemFrame, MemValue, Slot } from '../memory-refs/scenarios'

const p = (prim: string): MemValue => ({ prim })
const r = (ref: string): MemValue => ({ ref })

const leakCode = `const controller = new AbortController()

function mount() {
  const big = new Array(1e6).fill(0)
  window.addEventListener('resize', () => {
    console.log(big.length)
  }, { signal: controller.signal })
}

mount()
// компонент зник з екрана, а слухач — ні
controller.abort()`

type State = HeapObj['state']

const win = (listener: boolean, state?: State, changed = false): HeapObj => ({ id: 'win', label: 'window', icon: 'px:globe', fields: [{ key: 'resize-слухачі', value: listener ? r('fn') : p('[]'), changed }], ...(state ? { state } : {}) })
const ctrl: HeapObj = { id: 'ctrl', label: 'controller', icon: 'px:gear', fields: [{ key: 'signal.aborted', value: p('false') }] }
const ctrlAborted: HeapObj = { id: 'ctrl', label: 'controller', icon: 'px:gear', fields: [{ key: 'signal.aborted', value: p('true'), changed: true }] }
const env = (state?: State): HeapObj => ({ id: 'env', label: 'оточення mount()', icon: 'px:matryoshka', fields: [{ key: 'big', value: r('arr') }], ...(state ? { state } : {}) })
const arr = (state?: State): HeapObj => ({ id: 'arr', label: 'Array(1e6)', icon: 'px:box', fields: [{ key: 'length', value: p('1 000 000') }], ...(state ? { state } : {}) })
const fn = (state?: State): HeapObj => ({ id: 'fn', label: 'ƒ слухач', icon: 'pi:PiEarFill', fields: [{ key: '[[Environment]]', value: r('env') }], ...(state ? { state } : {}) })

const roots: Slot[] = [{ name: 'window', value: r('win') }, { name: 'controller', value: r('ctrl') }]

const leakClosure: StepScenario<MemFrame> = {
  code: leakCode,
  frames: [
    { line: 1, stack: roots, heap: [win(false), ctrl], output: [], note: 'Корені GC — глобальні об’єкти та все, що зараз у стеку. Живе лише те, до чого від коренів веде ланцюжок посилань.' },
    { line: 4, stack: [...roots, { name: 'mount()', value: r('env'), changed: true }], heap: [win(false), ctrl, env(), arr()], output: [], note: 'Виклик mount(): у його оточенні з’являється big — масив на мільйон елементів, кілька мегабайт.' },
    { line: 5, stack: [...roots, { name: 'mount()', value: r('env') }], heap: [win(true), ctrl, fn(), env(), arr()], output: [], note: 'Стрілка-слухач — замикання: через [[Environment]] вона тримає оточення mount, а з ним і big. addEventListener кладе її у список слухачів window.' },
    { line: 10, stack: roots, heap: [win(true, 'reachable'), ctrl, fn('reachable'), env('reachable'), arr('reachable')], output: [], note: 'mount() завершилась, її кадр зник зі стека. Але шлях window → слухач → оточення → big досі веде від кореня, тож GC не має права це прибрати.' },
    { line: 11, stack: roots, heap: [win(true, 'reachable'), ctrl, fn('reachable'), env('reachable'), arr('reachable')], output: [], note: 'Компонент зник з екрана, а слухач лишився. Кожен новий mount() додасть ще один слухач і ще один big — пам’ять росте. Це і є витік.' },
    { line: 12, stack: roots, heap: [win(false, undefined, true), ctrlAborted, fn('unreachable'), env('unreachable'), arr('unreachable')], output: [], note: 'controller.abort() знімає слухача з window. Тепер до стрілки, оточення і big не веде жоден шлях від коренів — вони недосяжні.' },
    { line: null, stack: roots, heap: [win(false), ctrlAborted], output: [], note: 'На наступній збірці GC позначає досяжне (mark) і звільняє решту (sweep) — мегабайти повернулись. Коли саме прийде GC, вирішує рушій.' },
  ],
}

export const gcScenarios: Record<string, StepScenario<MemFrame>> = {
  'leak-closure': leakClosure,
}
