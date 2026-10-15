import type { Frame, StepScenario } from '../engine/types'

// ── shapes: transition tree ───────────────────────────────────────

export interface MapNode {
  id: string
  // property names in slot order
  props: string[]
  parent: string | null
  // property added on the transition from the parent
  via: string | null
}

export interface ObjCard {
  id: string
  name: string
  // null → dictionary (slow) mode
  map: string | null
  values: Array<{ key: string; value: string }>
}

export interface ShapeFrame extends Frame {
  maps: MapNode[]
  objects: ObjCard[]
  // map / transition just created or reused
  hot: string | null
  event: 'idle' | 'new' | 'reuse' | 'dict' | 'summary'
  activeObj: string | null
}

const M0: MapNode = { id: 'M0', props: [], parent: null, via: null }
const M1: MapNode = { id: 'M1', props: ['x'], parent: 'M0', via: 'x' }
const M2: MapNode = { id: 'M2', props: ['x', 'y'], parent: 'M1', via: 'y' }
const M3: MapNode = { id: 'M3', props: ['y'], parent: 'M0', via: 'y' }
const M4: MapNode = { id: 'M4', props: ['y', 'x'], parent: 'M3', via: 'x' }
const M5: MapNode = { id: 'M5', props: ['x', 'y', 'z'], parent: 'M2', via: 'z' }

const shapesCode = `const a = {}
a.x = 1
a.y = 2
const b = {}
b.x = 3
b.y = 4
const c = {}
c.y = 5
c.x = 6
b.z = 7
delete a.x`

const obj = (id: string, map: string | null, values: Array<[string, string]>): ObjCard => ({ id, name: id, map, values: values.map(([key, value]) => ({ key, value })) })

const shapes: StepScenario<ShapeFrame> = {
  code: shapesCode,
  frames: [
    { line: 1, maps: [M0], objects: [obj('a', 'M0', [])], hot: 'M0', event: 'new', activeObj: 'a', note: 'Порожній літерал {} отримує початкову форму M0 (у V8 — Map). Форма описує, які властивості є і в якому слоті кожна лежить; значення зберігаються окремо, в самому об’єкті.' },
    { line: 2, maps: [M0, M1], objects: [obj('a', 'M1', [['x', '1']])], hot: 'M1', event: 'new', activeObj: 'a', note: 'a.x = 1: переходу «+x» з M0 ще немає → V8 створює форму M1 {x → слот 0} і запам’ятовує перехід M0 → M1. Об’єкт a тепер посилається на M1.' },
    { line: 3, maps: [M0, M1, M2], objects: [obj('a', 'M2', [['x', '1'], ['y', '2']])], hot: 'M2', event: 'new', activeObj: 'a', note: 'a.y = 2: новий перехід M1 → M2 {x → 0, y → 1}. Форми не змінюються — додавання властивості переводить об’єкт на ІНШУ форму.' },
    { line: 4, maps: [M0, M1, M2], objects: [obj('a', 'M2', [['x', '1'], ['y', '2']]), obj('b', 'M0', [])], hot: 'M0', event: 'reuse', activeObj: 'b', note: 'Новий {} знову стартує з M0 — та сама початкова форма, що й у a.' },
    { line: 5, maps: [M0, M1, M2], objects: [obj('a', 'M2', [['x', '1'], ['y', '2']]), obj('b', 'M1', [['x', '3']])], hot: 'M1', event: 'reuse', activeObj: 'b', note: '♻️ b.x = 3: перехід «+x» з M0 уже існує → V8 просто йде ним до M1. Нової форми не створено.' },
    { line: 6, maps: [M0, M1, M2], objects: [obj('a', 'M2', [['x', '1'], ['y', '2']]), obj('b', 'M2', [['x', '3'], ['y', '4']])], hot: 'M2', event: 'reuse', activeObj: 'b', note: '♻️ a і b ділять форму M2: однаковий набір і ПОРЯДОК властивостей. Так само працює конструктор чи поля класу — кожен екземпляр проходить ті самі переходи.' },
    { line: 7, maps: [M0, M1, M2], objects: [obj('a', 'M2', [['x', '1'], ['y', '2']]), obj('b', 'M2', [['x', '3'], ['y', '4']]), obj('c', 'M0', [])], hot: 'M0', event: 'reuse', activeObj: 'c', note: 'Третій об’єкт c теж починає з M0.' },
    { line: 8, maps: [M0, M1, M2, M3], objects: [obj('a', 'M2', [['x', '1'], ['y', '2']]), obj('b', 'M2', [['x', '3'], ['y', '4']]), obj('c', 'M3', [['y', '5']])], hot: 'M3', event: 'new', activeObj: 'c', note: 'c.y = 5: з M0 є лише перехід «+x», а «+y» — немає → нова гілка дерева, форма M3 {y → слот 0}.' },
    { line: 9, maps: [M0, M1, M2, M3, M4], objects: [obj('a', 'M2', [['x', '1'], ['y', '2']]), obj('b', 'M2', [['x', '3'], ['y', '4']]), obj('c', 'M4', [['y', '5'], ['x', '6']])], hot: 'M4', event: 'new', activeObj: 'c', note: 'c має ті самі x і y, що й a, але в іншому порядку → інша форма M4. Тут x лежить у слоті 1, а не 0, тож кеш «x — у слоті 0» для c не підходить.' },
    { line: 10, maps: [M0, M1, M2, M3, M4, M5], objects: [obj('a', 'M2', [['x', '1'], ['y', '2']]), obj('b', 'M5', [['x', '3'], ['y', '4'], ['z', '7']]), obj('c', 'M4', [['y', '5'], ['x', '6']])], hot: 'M5', event: 'new', activeObj: 'b', note: 'b.z = 7 додано «потім» і лише одному об’єкту → b іде новим переходом до M5. a і b більше не ділять форму, і код, що бачить обидва, стане поліморфним.' },
    { line: 11, maps: [M0, M1, M2, M3, M4, M5], objects: [obj('a', null, [['y', '2']]), obj('b', 'M5', [['x', '3'], ['y', '4'], ['z', '7']]), obj('c', 'M4', [['y', '5'], ['x', '6']])], hot: null, event: 'dict', activeObj: 'a', note: '🐢 delete a.x: x — не остання додана властивість, тож V8 переводить a в dictionary mode: власна хеш-таблиця замість слотів. Доступ повільніший, inline cache тут майже не допомагає.' },
    { line: null, maps: [M0, M1, M2, M3, M4, M5], objects: [obj('a', null, [['y', '2']]), obj('b', 'M5', [['x', '3'], ['y', '4'], ['z', '7']]), obj('c', 'M4', [['y', '5'], ['x', '6']])], hot: null, event: 'summary', activeObj: null, note: 'Спрощено: V8 ще резервує in-object слоти і вміє відкотити перехід, якщо видалити ОСТАННЮ додану властивість. Правило: усі поля — одразу в одному порядку, без delete; для динамічних ключів — Map.' },
  ],
}

// ── inline-cache: feedback for o.x ────────────────────────────────

export type IcState = 'uninitialized' | 'monomorphic' | 'polymorphic' | 'megamorphic'

export interface IcShape {
  id: string
  // literal as written
  literal: string
  props: string[]
}

export interface IcFrame extends Frame {
  state: IcState
  // cached (map → slot of x) entries
  entries: Array<{ map: string; slot: number }>
  // shape of the argument in the current call, if any
  current: string | null
  hit: boolean | null
  // every shape seen so far
  seen: string[]
}

export const IC_SHAPES: readonly IcShape[] = [
  { id: 'A', literal: '{ x: 1 }', props: ['x'] },
  { id: 'B', literal: '{ x: 3, y: 1 }', props: ['x', 'y'] },
  { id: 'C', literal: '{ y: 1, x: 4 }', props: ['y', 'x'] },
  { id: 'D', literal: '{ x: 5, z: 1 }', props: ['x', 'z'] },
  { id: 'E', literal: '{ x: 6, w: 1 }', props: ['x', 'w'] },
]

const icCode = `function getX(o) {
  return o.x
}
getX({ x: 1 })
getX({ x: 2 })
getX({ x: 3, y: 1 })
getX({ y: 1, x: 4 })
getX({ x: 5, z: 1 })
getX({ x: 6, w: 1 })
getX({ x: 7 })`

const slot = (id: string) => IC_SHAPES.find((s) => s.id === id)!.props.indexOf('x')
const entries = (...ids: string[]) => ids.map((map) => ({ map, slot: slot(map) }))

const inlineCache: StepScenario<IcFrame> = {
  code: icCode,
  frames: [
    { line: 2, state: 'uninitialized', entries: [], current: null, hit: null, seen: [], note: 'Для кожного доступу на кшталт o.x у функції є слот у feedback vector — inline cache (IC). Поки виклику не було, IC порожній: uninitialized.' },
    { line: 4, state: 'monomorphic', entries: entries('A'), current: 'A', hit: false, seen: ['A'], note: 'Перший виклик: o має форму A. Промах кешу → повільний пошук x, після якого IC запам’ятовує «форма A → x у слоті 0». Тепер він monomorphic.' },
    { line: 5, state: 'monomorphic', entries: entries('A'), current: 'A', hit: true, seen: ['A'], note: '✅ {x: 2} — та сама форма A (значення не важливі, лише набір і порядок ключів). Кеш-хіт: одна перевірка форми й читання слота 0. Це найшвидший випадок.' },
    { line: 6, state: 'polymorphic', entries: entries('A', 'B'), current: 'B', hit: false, seen: ['A', 'B'], note: 'Нова форма B {x, y}. IC не викидає A, а додає другий запис → polymorphic: тепер при кожному читанні він перевіряє форми по черзі.' },
    { line: 7, state: 'polymorphic', entries: entries('A', 'B', 'C'), current: 'C', hit: false, seen: ['A', 'B', 'C'], note: 'Форма C {y, x}: ті самі ключі, що в B, але інший порядок → інша форма, і x тут у слоті 1. Третій запис у кеші.' },
    { line: 8, state: 'polymorphic', entries: entries('A', 'B', 'C', 'D'), current: 'D', hit: false, seen: ['A', 'B', 'C', 'D'], note: 'Четверта форма D. V8 тримає в поліморфному IC до 4 форм — це ще polymorphic, але кожен виклик уже робить кілька порівнянь.' },
    { line: 9, state: 'megamorphic', entries: [], current: 'E', hit: false, seen: ['A', 'B', 'C', 'D', 'E'], note: '💥 П’ята форма E — ліміт перевищено. IC стає megamorphic: власний список форм більше не ведеться, а читання йде через спільний глобальний кеш (форма, ім’я) → обробник.' },
    { line: 10, state: 'megamorphic', entries: [], current: 'A', hit: null, seen: ['A', 'B', 'C', 'D', 'E'], note: 'Навіть знайома форма A вже не повертає IC назад: стан змінюється лише в бік megamorphic. Для TurboFan це сигнал, що спеціалізувати o.x не вийде.' },
    { line: null, state: 'megamorphic', entries: [], current: null, hit: null, seen: ['A', 'B', 'C', 'D', 'E'], note: 'Спрощено: V8 виділяє feedback vector не одразу (lazy feedback allocation), а для мегаморфних читань є глобальний stub cache. Висновок: у гарячій функції тримай об’єкти однієї форми.' },
  ],
}

export const hiddenClassScenarios: Record<string, StepScenario<ShapeFrame> | StepScenario<IcFrame>> = {
  shapes,
  'inline-cache': inlineCache,
}

export const shapesScenario = shapes
export const inlineCacheScenario = inlineCache
