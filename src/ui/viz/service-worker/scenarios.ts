import { itok, type Frame, type StepScenario, type Token } from '../engine/types'
import type { SwState } from './lifecycle'

export interface SwWorker {
  id: string
  label: string
  state: SwState
}

export interface SwTab {
  id: string
  label: string
  // id of the controlling worker, null = not controlled
  controller: string | null
}

export interface SwFrame extends Frame {
  workers: SwWorker[]
  tabs: SwTab[]
  // Cache Storage
  caches: Token[]
  event: 'install' | 'activate' | 'fetch' | null
  fetch: { url: string; from: 'cache' | 'network' } | null
  output: string[]
}

const v1 = (state: SwState): SwWorker => ({ id: 'v1', label: 'sw.js v1', state })
const v2 = (state: SwState): SwWorker => ({ id: 'v2', label: 'sw.js v2', state })
const tab = (id: string, controller: string | null): SwTab => ({ id, label: `Вкладка ${id}`, controller })
const C1 = itok('px:database', 'static-v1', 'static-v1', '/, /app.js')
const C2 = itok('px:database', 'static-v2', 'static-v2', '/, /app.js')

const code = `// page.js
navigator.serviceWorker.register('/sw.js')

// sw.js
const CACHE = 'static-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(['/', '/app.js'])),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
    )),
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((hit) => hit ?? fetch(event.request)),
  )
})

// v2: const CACHE = 'static-v2'
// self.skipWaiting()   — в install: не чекати
// self.clients.claim() — в activate: узяти відкриті сторінки`

const o = {
  inst1: 'install · v1',
  pre1: 'precache static-v1: /, /app.js',
  act1: 'activate · v1',
  f1: 'fetch /app.js → кеш',
  f2: 'fetch /api/user → мережа',
  inst2: 'install · v2',
  act2: 'activate · v2, видалено static-v1',
}
const log1 = [o.inst1, o.pre1, o.act1]
const log2 = [...log1, o.f1, o.f2, o.inst2]
const none = { event: null, fetch: null }

const lifecycle: StepScenario<SwFrame> = {
  code,
  frames: [
    { ...none, line: 2, workers: [v1('parsed')], tabs: [tab('A', null)], caches: [], output: [], note: 'register() завантажує /sw.js (лише HTTPS або localhost) і реєструє його для scope «/». Скрипт розібрано — стан parsed. Сама сторінка поки не контрольована.' },
    { ...none, line: 7, event: 'install', workers: [v1('installing')], tabs: [tab('A', null)], caches: [], output: [o.inst1], note: 'Новий воркер отримує подію install — стан installing. Це шанс заздалегідь закешувати оболонку застосунку (precache).' },
    { ...none, line: 9, event: 'install', workers: [v1('installing')], tabs: [tab('A', null)], caches: [C1], output: [o.inst1, o.pre1], note: 'waitUntil(проміс) продовжує install, доки cache.addAll не завантажить усі файли. Якщо хоч один запит упаде, встановлення провалиться і воркер стане redundant.' },
    { ...none, line: 11, workers: [v1('installed')], tabs: [tab('A', null)], caches: [C1], output: [o.inst1, o.pre1], note: 'Install успішний — стан installed. Активного воркера ще немає, тож чекати нікого: одразу переходимо до активації.' },
    { ...none, line: 16, event: 'activate', workers: [v1('activating')], tabs: [tab('A', null)], caches: [C1], output: log1, note: 'Подія activate — стан activating. Тут прибирають кеші старих версій; зараз є лише static-v1, тож видаляти нічого.' },
    { ...none, line: null, workers: [v1('activated')], tabs: [tab('A', null)], caches: [C1], output: log1, note: 'Стан activated: воркер готовий обробляти fetch. Але вкладка A завантажилась без нього, тож navigator.serviceWorker.controller === null — до перезавантаження або clients.claim().' },
    { line: 23, event: 'fetch', fetch: { url: '/app.js', from: 'cache' }, workers: [v1('activated')], tabs: [tab('A', 'v1')], caches: [C1], output: [...log1, o.f1], note: 'Після перезавантаження вкладку A контролює v1. Кожен її запит проходить через подію fetch, і /app.js віддається з Cache Storage без мережі.' },
    { line: 23, event: 'fetch', fetch: { url: '/api/user', from: 'network' }, workers: [v1('activated')], tabs: [tab('A', 'v1'), tab('B', 'v1')], caches: [C1], output: [...log1, o.f1, o.f2], note: 'Відкрили ще вкладку B. /api/user у кеші немає: caches.match дає undefined, і запит іде в мережу. Це стратегія cache-first.' },
    { ...none, line: 27, event: 'install', workers: [v1('activated'), v2('installing')], tabs: [tab('A', 'v1'), tab('B', 'v1')], caches: [C1, C2], output: log2, note: 'Деплой нової версії: під час навігації браузер перевіряє /sw.js і бачить зміну хоча б на байт. v2 встановлюється паралельно й кешує static-v2, а v1 далі обслуговує сторінки.' },
    { ...none, line: null, workers: [v1('activated'), v2('installed')], tabs: [tab('A', 'v1'), tab('B', 'v1')], caches: [C1, C2], output: log2, note: 'v2 — installed, тобто waiting: вкладки A і B досі контролює v1. Дві версії не керують сторінками одночасно. Навіть перезавантаження вкладки не допомагає.' },
    { ...none, line: 16, event: 'activate', workers: [v1('redundant'), v2('activating')], tabs: [], caches: [C2], output: [...log2, o.act2], note: 'Користувач закрив усі вкладки — v1 більше нікого не контролює і стає redundant. v2 активується, а обробник activate видаляє static-v1.' },
    { ...none, line: null, workers: [v1('redundant'), v2('activated')], tabs: [tab('C', 'v2')], caches: [C2], output: [...log2, o.act2], note: 'Нова вкладка C уже під контролем v2. Звідси правило: оновлений SW вмикається лише після того, як закрито всі старі вкладки.' },
    { ...none, line: 28, workers: [v1('redundant'), v2('activated')], tabs: [tab('C', 'v2')], caches: [C2], output: [...log2, o.act2], note: 'self.skipWaiting() в install пропускає очікування: v2 активується одразу й перебирає вже відкриті вкладки. Обережно — сторінки могли завантажити ресурси старої версії.' },
    { ...none, line: 29, workers: [v1('redundant'), v2('activated')], tabs: [tab('C', 'v2')], caches: [C2], output: [...log2, o.act2], note: 'clients.claim() в activate бере під контроль відкриті й ще не контрольовані сторінки scope — як-от першу вкладку, де викликали register(). Вони отримують подію controllerchange.' },
  ],
}

export const serviceWorkerScenarios: Record<string, StepScenario<SwFrame>> = {
  lifecycle,
}
