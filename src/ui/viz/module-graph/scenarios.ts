import type { Frame, StepScenario } from '../engine/types'

export type ModPhase = 'construct' | 'link' | 'evaluate'

export interface ModBinding {
  name: string
  kind: 'let' | 'function' | 'import' | 'const' | 'prop' | 'entry'
  value: string
  // tdz = uninitialized, live = import binding, copy = value snapshot
  state?: 'tdz' | 'live' | 'copy' | 'error'
  // arrow target: 'boxId' or 'boxId.name'
  ref?: string
  changed?: boolean
}

export interface ModBox {
  id: string
  file: string
  emoji: string
  // module record status or a short label
  status?: string
  tone?: 'active' | 'done' | 'error' | 'idle'
  // evaluation order (post-order DFS)
  order?: number
  bindings: ModBinding[]
}

export interface ModLane {
  id: string
  title: string
  emoji: string
  hint?: string
  boxes: ModBox[]
}

export interface ModuleFrame extends Frame {
  phase: ModPhase | null
  lanes: ModLane[]
  // module → dependency (dashed arrow)
  deps?: Array<[string, string]>
  output: string[]
  error?: string
}

// ── esm-live-binding ─────────────────────────────────────────────
const esmCode = `// counter.js
export let count = 0
export function inc() {
  count++
}

// main.js
import { count, inc } from './counter.js'
console.log(count)
inc()
console.log(count)
count = 10`

const lane = (boxes: ModBox[]): ModLane[] => [{ id: 'esm', title: 'Граф модулів', emoji: '🕸️', boxes }]
const counterBox = (status: string, bindings: ModBinding[], tone?: ModBox['tone'], order?: number): ModBox => ({ id: 'counter', file: 'counter.js', emoji: '🔢', status, tone, order, bindings })
const mainBox = (status: string, bindings: ModBinding[], tone?: ModBox['tone'], order?: number): ModBox => ({ id: 'main', file: 'main.js', emoji: '🚪', status, tone, order, bindings })

const cTdz: ModBinding[] = [
  { name: 'count', kind: 'let', value: '<TDZ>', state: 'tdz' },
  { name: 'inc', kind: 'function', value: 'ƒ inc' },
]
const cVal = (v: string, changed = false): ModBinding[] => [
  { name: 'count', kind: 'let', value: v, changed },
  { name: 'inc', kind: 'function', value: 'ƒ inc' },
]
const mImports = (v: string, changed = false): ModBinding[] => [
  { name: 'count', kind: 'import', value: v, state: 'live', ref: 'counter.count', changed },
  { name: 'inc', kind: 'import', value: 'ƒ inc', state: 'live', ref: 'counter.inc' },
]
const deps: Array<[string, string]> = [['main', 'counter']]

const esmLiveBinding: StepScenario<ModuleFrame> = {
  code: esmCode,
  frames: [
    { line: 8, phase: 'construct', lanes: lane([mainBox('new', [])]), output: [], note: 'Фаза 1 — побудова: рушій завантажує main.js і лише парсить його. Статичний import видно ще до виконання, тож відомо, що потрібен ./counter.js.' },
    { line: 2, phase: 'construct', lanes: lane([mainBox('unlinked', []), counterBox('unlinked', [])]), deps, output: [], note: 'counter.js теж завантажено й розібрано; імпортів у ньому немає — граф повний. Жоден рядок коду ще не виконався, навіть верхнього рівня.' },
    { line: 3, phase: 'link', lanes: lane([mainBox('linking', []), counterBox('linked', cTdz, 'active')]), deps, output: [], note: 'Фаза 2 — зв’язування: для counter.js створюється оточення модуля. Функцію inc створено одразу (hoisting), а let count існує, але в TDZ — значення ще немає.' },
    { line: 8, phase: 'link', lanes: lane([mainBox('linked', mImports('<TDZ>'), 'active'), counterBox('linked', cTdz)]), deps, output: [], note: 'У main.js імпорти стають непрямими зв’язками (live bindings) на змінні counter.js — це не копії значень, а «вікна» в чуже оточення.' },
    { line: 2, phase: 'evaluate', lanes: lane([mainBox('evaluating', mImports('0', true)), counterBox('evaluated', cVal('0', true), 'done', 1)]), deps, output: [], note: 'Фаза 3 — виконання в пост-порядку: спершу залежності. counter.js виконується першим, count = 0 ініціалізує змінну, і TDZ закінчується.' },
    { line: 9, phase: 'evaluate', lanes: lane([mainBox('evaluating', mImports('0'), 'active', 2), counterBox('evaluated', cVal('0'), 'done', 1)]), deps, output: ['0'], note: 'Тепер виконується main.js. Читання count іде через зв’язок прямо до змінної в counter.js: 0.' },
    { line: 4, phase: 'evaluate', lanes: lane([mainBox('evaluating', mImports('1', true), 'active', 2), counterBox('evaluated', cVal('1', true), 'done', 1)]), deps, output: ['0'], note: 'inc() змінює count усередині counter.js. Імпорт у main.js — та сама змінна, тож він одразу бачить 1.' },
    { line: 11, phase: 'evaluate', lanes: lane([mainBox('evaluating', mImports('1'), 'active', 2), counterBox('evaluated', cVal('1'), 'done', 1)]), deps, output: ['0', '1'], note: 'Друкується 1: ESM експортує зв’язки, а не значення. Це живий зв’язок (live binding).' },
    {
      line: 12,
      phase: 'evaluate',
      lanes: lane([mainBox('evaluated ✕', [{ name: 'count', kind: 'import', value: '1', state: 'error', ref: 'counter.count' }, mImports('1')[1]!], 'error', 2), counterBox('evaluated', cVal('1'), 'done', 1)]),
      deps,
      output: ['0', '1'],
      error: 'TypeError: Assignment to constant variable.',
      note: 'Імпорт — незмінний зв’язок з боку імпортера, тож присвоєння кидає TypeError під час виконання. Змінити count може лише сам counter.js, наприклад через inc().',
    },
  ],
}

// ── cjs-vs-esm ───────────────────────────────────────────────────
const cjsCode = `// counter.cjs — CommonJS
let count = 0
function inc() { count++ }
module.exports = { count, inc }

// main.cjs
const counter = require('./counter.cjs')
counter.inc()
console.log(counter.count)
console.log(require('./counter.cjs') === counter)

// counter.mjs — ESM
export let count = 0
export function inc() { count++ }

// main.mjs
import { count, inc } from './counter.mjs'
inc()
console.log(count)`

const cjsLane = (boxes: ModBox[]): ModLane => ({ id: 'cjs', title: 'CommonJS', emoji: '📦', hint: 'копія значення', boxes })
const esmLane = (boxes: ModBox[]): ModLane => ({ id: 'esm', title: 'ESM', emoji: '🔗', hint: 'живий зв’язок', boxes })

const cjsMain = (bindings: ModBinding[], tone?: ModBox['tone'], status = 'виконується'): ModBox => ({ id: 'cmain', file: 'main.cjs', emoji: '🚪', status, tone, bindings })
const cjsCounter = (bindings: ModBinding[], tone?: ModBox['tone'], status = 'виконано'): ModBox => ({ id: 'ccounter', file: 'counter.cjs', emoji: '🔢', status, tone, bindings })
const cjsVars = cVal
const exportsBox = (count = '0'): ModBox => ({
  id: 'cexports',
  file: 'module.exports',
  emoji: '📤',
  status: 'об’єкт',
  bindings: [
    { name: 'count', kind: 'prop', value: count, state: 'copy' },
    { name: 'inc', kind: 'prop', value: 'ƒ inc' },
  ],
})
const cacheBox: ModBox = { id: 'ccache', file: 'require.cache', emoji: '🗄️', status: 'кеш', bindings: [{ name: '…/counter.cjs', kind: 'entry', value: 'module', ref: 'cexports' }] }
const counterRef = (): ModBinding => ({ name: 'counter', kind: 'const', value: '{…}', ref: 'cexports' })
const esmPending: ModLane = esmLane([])
const cjsDone = (count: string, changed = false) => cjsLane([cjsMain([counterRef()], undefined, 'виконано'), exportsBox(), cjsCounter(cjsVars(count, changed)), cacheBox])

const eMain = (v: string, changed = false, tone?: ModBox['tone']): ModBox => ({
  id: 'emain',
  file: 'main.mjs',
  emoji: '🚪',
  status: 'evaluating',
  tone,
  order: 2,
  bindings: [
    { name: 'count', kind: 'import', value: v, state: 'live', ref: 'ecounter.count', changed },
    { name: 'inc', kind: 'import', value: 'ƒ inc', state: 'live', ref: 'ecounter.inc' },
  ],
})
const eCounter = (v: string, changed = false): ModBox => ({ id: 'ecounter', file: 'counter.mjs', emoji: '🔢', status: 'evaluated', tone: 'done', order: 1, bindings: cjsVars(v, changed) })

const cjsVsEsm: StepScenario<ModuleFrame> = {
  code: cjsCode,
  frames: [
    { line: 7, phase: null, lanes: [cjsLane([cjsMain([{ name: 'counter', kind: 'const', value: '<TDZ>', state: 'tdz' }], 'active'), cjsCounter(cTdz, 'active', 'виконується')]), esmPending], output: [], note: 'require — звичайна синхронна функція. main.cjs стає на паузу, а Node читає counter.cjs з диска, загортає в функцію (exports, require, module…) і виконує просто зараз.' },
    { line: 2, phase: null, lanes: [cjsLane([cjsMain([{ name: 'counter', kind: 'const', value: '<TDZ>', state: 'tdz' }]), cjsCounter(cjsVars('0', true), 'active', 'виконується')]), esmPending], output: [], note: 'Код модуля виконується вперше: count = 0 і функція inc живуть у замиканні цієї функції-обгортки.' },
    { line: 4, phase: null, lanes: [cjsLane([cjsMain([{ name: 'counter', kind: 'const', value: '<TDZ>', state: 'tdz' }]), exportsBox(), cjsCounter(cjsVars('0'), 'active', 'виконується')]), esmPending], output: [], note: 'Літерал { count, inc } копіює ПОТОЧНЕ значення count (0) у властивість об’єкта. Далі властивість і змінна ніяк не пов’язані.' },
    { line: 7, phase: null, lanes: [cjsLane([cjsMain([{ ...counterRef(), changed: true }], 'active'), exportsBox(), cjsCounter(cjsVars('0')), cacheBox]), esmPending], output: [], note: 'require повертає module.exports і кладе модуль у require.cache за повним шляхом. Тепер counter — посилання на той самий об’єкт.' },
    { line: 3, phase: null, lanes: [cjsLane([cjsMain([counterRef()]), exportsBox(), { ...cjsCounter(cjsVars('1', true)), tone: 'active' }, cacheBox]), esmPending], output: [], note: 'counter.inc() збільшує змінну count у замиканні counter.cjs до 1. Властивість exports.count цього не помічає — у ній досі 0.' },
    { line: 9, phase: null, lanes: [cjsDone('1'), esmPending], output: ['main.cjs: 0'], note: 'Друкується 0: CommonJS віддає значення, і примітив скопіювався в момент присвоєння module.exports.' },
    { line: 10, phase: null, lanes: [cjsDone('1'), esmPending], output: ['main.cjs: 0', 'main.cjs: true'], note: 'Повторний require знаходить модуль у require.cache і повертає той самий об’єкт без повторного виконання — тому true.' },
    { line: 17, phase: 'evaluate', lanes: [cjsDone('1'), esmLane([eMain('0', true, 'active'), eCounter('0', true)])], output: ['main.cjs: 0', 'main.cjs: true'], note: 'ESM: імпорти статичні, тож ще до виконання рушій зв’язав count у main.mjs зі змінною в counter.mjs. counter.mjs виконано першим (залежності раніше), count = 0.' },
    { line: 14, phase: 'evaluate', lanes: [cjsDone('1'), esmLane([eMain('1', true, 'active'), eCounter('1', true)])], output: ['main.cjs: 0', 'main.cjs: true'], note: 'inc() збільшує count у counter.mjs. Імпорт у main.mjs — не копія, а зв’язок на ту саму змінну, тож теж показує 1.' },
    { line: 19, phase: 'evaluate', lanes: [cjsDone('1'), esmLane([eMain('1'), eCounter('1')])], output: ['main.cjs: 0', 'main.cjs: true', 'main.mjs: 1'], note: 'Підсумок: CommonJS експортує значення (0 застигло у властивості), ESM — живі зв’язки (1). Плюс require синхронний і динамічний, а import статичний і зв’язується до виконання.' },
  ],
}

export const moduleGraphScenarios: Record<string, StepScenario<ModuleFrame>> = {
  'esm-live-binding': esmLiveBinding,
  'cjs-vs-esm': cjsVsEsm,
}
