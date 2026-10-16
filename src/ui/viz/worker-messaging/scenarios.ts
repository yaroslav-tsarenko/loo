import { itok, type Frame, type StepScenario, type Token } from '../engine/types'

export const MB = 1024 * 1024

export interface MemBlock {
  id: string
  name: string
  detail: string
  // drawn as a size bar when set (relative to `maxBytes` of the frame)
  bytes?: number
  state?: 'new' | 'changed' | 'copy' | 'moved' | 'detached'
}

export interface ThreadLane {
  status: 'run' | 'idle' | 'load'
  // the task running right now (one at a time per event loop)
  task: Token | null
  memory: MemBlock[]
  // message queue, FIFO
  queue: Token[]
}

export interface Wire {
  dir: 'to-worker' | 'to-main'
  mode: 'clone' | 'transfer' | 'error'
  label: string
  detail: string
}

export interface LogLine {
  from: 'main' | 'worker'
  text: string
  error?: boolean
}

export interface WorkerFrame extends Frame {
  main: ThreadLane
  worker: ThreadLane
  wire: Wire | null
  log: LogLine[]
  // show the copy-vs-transfer summary
  compare?: boolean
}

const idle = (memory: MemBlock[], queue: Token[] = []): ThreadLane => ({ status: 'idle', task: null, memory, queue })
const run = (task: Token, memory: MemBlock[], queue: Token[] = []): ThreadLane => ({ status: 'run', task, memory, queue })

// ── postmessage ──────────────────────────────────────────────────
const pmCode = `// main.js
const worker = new Worker('worker.js')
worker.onmessage = (e) => console.log('сума:', e.data)

const job = { nums: [1, 2, 3] }
worker.postMessage(job)
job.nums.push(4)

worker.postMessage({ cb() {} })

// worker.js
self.onmessage = (e) => {
  const sum = e.data.nums.reduce((a, b) => a + b, 0)
  self.postMessage(sum)
}`

const mainScript = itok('px:scroll', 'main-script', 'main.js', 'перша задача')
const workerScript = itok('px:scroll', 'worker-script', 'worker.js', 'перша задача воркера')
const workerObj: MemBlock = { id: 'worker', name: 'worker', detail: 'Worker {…}' }
const mainHandler: MemBlock = { id: 'onmessage', name: 'onmessage', detail: 'ƒ (e) => log(…)' }
const workerHandler: MemBlock = { id: 'onmessage', name: 'self.onmessage', detail: 'ƒ (e) => { … }' }
const job = (nums: string, state?: MemBlock['state']): MemBlock => ({ id: 'job', name: 'job', detail: `{ nums: [${nums}] }`, state })
const msgJob = itok('px:envelope', 'm1', 'message', 'знімок { nums: [1, 2, 3] }')
const msgSum = itok('px:envelope', 'm2', 'message', 'знімок 6')
const mainMem = [workerObj, mainHandler, job('1, 2, 3, 4')]

const postmessage: StepScenario<WorkerFrame> = {
  code: pmCode,
  frames: [
    { line: 2, main: run(mainScript, [{ ...workerObj, state: 'new' }]), worker: { status: 'load', task: null, memory: [], queue: [] }, wire: null, log: [], note: 'new Worker запускає окремий потік зі своїм глобальним self, купою, event loop і чергою повідомлень. worker.js вантажиться паралельно — головний потік не чекає.' },
    { line: 12, main: run(mainScript, [workerObj]), worker: run(workerScript, [{ ...workerHandler, state: 'new' }]), wire: null, log: [], note: 'Тим часом воркер виконує worker.js і реєструє onmessage. Порядок відносно рядків main.js не гарантований — це справді інший потік.' },
    { line: 3, main: run(mainScript, [workerObj, { ...mainHandler, state: 'new' }]), worker: idle([workerHandler]), wire: null, log: [], note: 'Головний потік теж вішає обробник message. Воркер свій скрипт відпрацював і чекає на події: стек порожній, черга теж.' },
    { line: 5, main: run(mainScript, [workerObj, mainHandler, job('1, 2, 3', 'new')]), worker: idle([workerHandler]), wire: null, log: [], note: 'Звичайний об’єкт у купі головного потоку. Воркер не бачить цієї пам’яті: у кожного потоку власна купа.' },
    { line: 6, main: run(mainScript, [workerObj, mainHandler, job('1, 2, 3')]), worker: idle([workerHandler], [msgJob]), wire: { dir: 'to-worker', mode: 'clone', label: 'structured clone', detail: '{ nums: [1, 2, 3] } → копія' }, log: [], note: 'postMessage синхронно серіалізує job алгоритмом structured clone і ставить подію message у чергу воркера. Іде знімок даних, а не посилання.' },
    { line: 7, main: run(mainScript, [workerObj, mainHandler, job('1, 2, 3, 4', 'changed')]), worker: idle([workerHandler], [msgJob]), wire: null, log: [], note: 'push змінює лише оригінал у головному потоці. Знімок уже зроблено, тож воркер отримає [1, 2, 3].' },
    {
      line: 9,
      main: run(mainScript, mainMem),
      worker: idle([workerHandler], [msgJob]),
      wire: { dir: 'to-worker', mode: 'error', label: 'DataCloneError', detail: 'функцію не склонувати' },
      log: [{ from: 'main', text: 'DataCloneError: cb() {} could not be cloned.', error: true }],
      note: 'Функції, DOM-вузли й Symbol structured clone не копіює, тож postMessage одразу кидає DataCloneError і нічого не надсилає. Помилку не перехоплено — main.js на цьому завершується.',
    },
    {
      line: 13,
      main: idle(mainMem),
      worker: run(itok('px:envelope', 'm1', 'onmessage(e)', 'e.data — нова копія'), [workerHandler, { id: 'data', name: 'e.data', detail: '{ nums: [1, 2, 3] }', state: 'copy' }, { id: 'sum', name: 'sum', detail: '6', state: 'new' }]),
      wire: null,
      log: [{ from: 'main', text: 'DataCloneError: cb() {} could not be cloned.', error: true }],
      note: 'Event loop воркера бере подію з черги: дані десеріалізуються в НОВИЙ об’єкт у його купі. reduce рахує 1 + 2 + 3 = 6.',
    },
    {
      line: 14,
      main: idle(mainMem, [msgSum]),
      worker: run(itok('px:envelope', 'm1', 'onmessage(e)', 'e.data — нова копія'), [workerHandler, { id: 'data', name: 'e.data', detail: '{ nums: [1, 2, 3] }', state: 'copy' }, { id: 'sum', name: 'sum', detail: '6' }]),
      wire: { dir: 'to-main', mode: 'clone', label: 'structured clone', detail: '6 → копія' },
      log: [{ from: 'main', text: 'DataCloneError: cb() {} could not be cloned.', error: true }],
      note: 'Відповідь іде тим самим шляхом у зворотний бік: число клонується і стає подією message у черзі головного потоку.',
    },
    {
      line: 3,
      main: run(itok('px:envelope', 'm2', 'onmessage(e)', 'e.data = 6'), mainMem),
      worker: idle([workerHandler]),
      wire: null,
      log: [
        { from: 'main', text: 'DataCloneError: cb() {} could not be cloned.', error: true },
        { from: 'main', text: 'сума: 6' },
      ],
      note: 'Вільний головний потік обробляє подію: «сума: 6», а не 10 — воркер рахував свою копію без push(4). Обидва event loop знову чекають.',
    },
  ],
}

// ── transfer ─────────────────────────────────────────────────────
const trCode = `// main.js (worker уже створено)
const buf = new ArrayBuffer(8 * 1024 * 1024) // 8 МБ

worker.postMessage(buf)
console.log(buf.byteLength)

worker.postMessage(buf, [buf])
console.log(buf.byteLength)
new Uint8Array(buf)

// worker.js
self.onmessage = (e) => {
  console.log(e.data.byteLength)
}`

const SIZE = 8 * MB
const buf = (state?: MemBlock['state']): MemBlock => (state === 'detached' ? { id: 'buf', name: 'buf', detail: '0 Б · detached', bytes: 0, state } : { id: 'buf', name: 'buf', detail: 'ArrayBuffer · 8 МБ', bytes: SIZE, state })
const wHandler: MemBlock = { id: 'onmessage', name: 'self.onmessage', detail: 'ƒ (e) => { … }' }
const msgCopy = itok('px:envelope', 'c1', 'message', 'копія 8 МБ')
const msgMoved = itok('px:envelope', 't1', 'message', 'передано 8 МБ')
const copyBlock = (state?: MemBlock['state']): MemBlock => ({ id: 'copy', name: 'e.data (#1)', detail: 'копія · 8 МБ', bytes: SIZE, state })
const movedBlock = (state?: MemBlock['state']): MemBlock => ({ id: 'moved', name: 'e.data (#2)', detail: 'той самий блок · 8 МБ', bytes: SIZE, state })
const trScript = itok('px:scroll', 'main-script', 'main.js')
const logs = (...lines: LogLine[]): LogLine[] => lines
const L8 = { from: 'main' as const, text: '8388608' }
const L0 = { from: 'main' as const, text: '0' }
const LErr = { from: 'main' as const, text: 'TypeError: Cannot perform Construct on a detached ArrayBuffer', error: true }

const transfer: StepScenario<WorkerFrame> = {
  code: trCode,
  frames: [
    { line: 2, main: run(trScript, [buf('new')]), worker: idle([wHandler]), wire: null, log: [], note: 'Виділяємо ArrayBuffer на 8 МБ у пам’яті головного потоку. Воркер уже запущений, його onmessage чекає на події.' },
    { line: 4, main: run(trScript, [buf()]), worker: idle([wHandler], [msgCopy]), wire: { dir: 'to-worker', mode: 'clone', label: 'копія · час росте з розміром', detail: '8 МБ байтів скопійовано' }, log: [], note: 'Без списку transfer буфер клонується: усі 8 МБ копіюються синхронно на головному потоці. Що більші дані, то довше потік заблокований.' },
    { line: 5, main: run(trScript, [buf()]), worker: idle([wHandler], [msgCopy]), wire: null, log: logs(L8), note: 'Оригінал не зачеплено: byteLength — 8388608. Але тепер даних удвічі більше — 8 МБ тут і 8 МБ у повідомленні.' },
    { line: 7, main: run(trScript, [buf('detached')]), worker: idle([wHandler], [msgCopy, msgMoved]), wire: { dir: 'to-worker', mode: 'transfer', label: 'передача · O(1)', detail: '0 Б скопійовано, змінився власник' }, log: logs(L8), note: 'buf у списку transfer: блок пам’яті переходить до воркера без копіювання байтів — за O(1), хоч 8 МБ, хоч 800. Оригінал стає detached.' },
    { line: 8, main: run(trScript, [buf('detached')]), worker: idle([wHandler], [msgCopy, msgMoved]), wire: null, log: logs(L8, L0), note: 'Об’єкт buf лишився, але пам’яті в нього більше немає: byteLength — 0, buf.detached — true. Усі view над ним теж мають довжину 0.' },
    { line: 9, main: run(trScript, [buf('detached')]), worker: idle([wHandler], [msgCopy, msgMoved]), wire: null, log: logs(L8, L0, LErr), note: 'Від’єднаний буфер не використати: new Uint8Array(buf) кидає TypeError. Відправник віддав дані повністю — тому гонок за спільні байти немає.' },
    { line: 13, main: idle([buf('detached')]), worker: run(itok('px:envelope', 'c1', 'onmessage(e)', 'копія'), [wHandler, copyBlock('copy')], [msgMoved]), wire: null, log: logs(L8, L0, LErr, { from: 'worker', text: '8388608' }), note: 'Воркер обробляє перше повідомлення: e.data — окрема копія на 8 МБ, десеріалізована вже в його купі.' },
    { line: 13, main: idle([buf('detached')]), worker: run(itok('px:envelope', 't1', 'onmessage(e)', 'передано'), [wHandler, copyBlock(), movedBlock('moved')]), wire: null, log: logs(L8, L0, LErr, { from: 'worker', text: '8388608' }, { from: 'worker', text: '8388608' }), note: 'Друге повідомлення: той самий блок пам’яті, що був у main, тепер належить воркеру. Байти не копіювались — змінився лише власник.' },
    { line: null, main: idle([buf('detached')]), worker: idle([wHandler, copyBlock(), movedBlock()]), wire: null, compare: true, log: logs(L8, L0, LErr, { from: 'worker', text: '8388608' }, { from: 'worker', text: '8388608' }), note: 'Копія подвоює пам’ять, і час росте з розміром; передача — O(1), але відправник втрачає доступ. Передають ArrayBuffer (не view!), MessagePort, ImageBitmap, OffscreenCanvas, потоки.' },
  ],
}

export const workerMessagingScenarios: Record<string, StepScenario<WorkerFrame>> = {
  postmessage,
  transfer,
}
