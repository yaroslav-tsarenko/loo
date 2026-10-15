import type { Frame, StepScenario } from '../engine/types'
import { STAGES, type Block, type BlockKind, type CssProp, type Stage } from './pipeline'

// run = executing now, done = finished this frame, hit = triggered by the change, skip = not needed
export type StageState = 'run' | 'done' | 'hit' | 'skip'

export interface RenderFrame extends Frame {
  stages: Partial<Record<Stage, StageState>>
  // which property change is being analysed (frame scenario)
  prop?: CssProp
  thread?: 'main' | 'compositor'
  // work done in the current frame, in order
  blocks: Block[]
  // layout invalidated, a geometry read will force it
  dirty?: boolean
  warn?: string | null
}

const b = (id: string, kind: BlockKind, ms: number): Block => ({ id, kind, ms })

// stages before `active` are done, `active` runs
function upTo(active: Stage): Partial<Record<Stage, StageState>> {
  const out: Partial<Record<Stage, StageState>> = {}
  for (const s of STAGES) {
    if (s.id === active) {
      out[s.id] = 'run'
      break
    }
    out[s.id] = 'done'
  }
  return out
}

function triggers(hit: readonly Stage[]): Partial<Record<Stage, StageState>> {
  const out: Partial<Record<Stage, StageState>> = {}
  for (const s of STAGES) if (s.id !== 'input' && s.id !== 'js') out[s.id] = hit.includes(s.id) ? 'hit' : 'skip'
  return out
}

// ── frame ────────────────────────────────────────────────────────
const frameCode = `// 60 Гц → 1000 / 60 ≈ 16.7 мс на кадр
btn.addEventListener('click', () => {
  box.classList.add('open')
})

requestAnimationFrame(() => {
  box.style.width = '300px'
})

// яку роботу запускає кожна зміна:
box.style.width = '300px'          // Layout → Paint → Composite
box.style.color = 'tomato'         // Paint → Composite
box.style.transform = 'scale(1.2)' // лише Composite`

const fIn = b('input', 'input', 0.6)
const fJs = b('handler', 'js', 1.4)
const fRaf = b('raf', 'js', 1)
const fStyle = b('style', 'style', 1.2)
const fLayout = b('layout', 'layout', 2.4)
const fPaint = b('paint', 'paint', 2)
const fComp = b('composite', 'composite', 0.9)
const full = [fIn, fJs, fRaf, fStyle, fLayout, fPaint, fComp]

const frame: StepScenario<RenderFrame> = {
  code: frameCode,
  frames: [
    { line: 1, stages: {}, blocks: [], note: 'При 60 Гц браузер має ≈16.7 мс на кадр. За цей час треба виконати JS і пройти конвеєр рендерингу: Style → Layout → Paint → Composite.' },
    { line: 2, stages: upTo('input'), blocks: [fIn], thread: 'main', note: 'Кадр починається з введення: браузер отримує клік і ставить подію в чергу головного потоку.' },
    { line: 3, stages: upTo('js'), blocks: [fIn, fJs], thread: 'main', note: 'Обробник додає клас. Стилі ще не перераховано — браузер лише позначає їх «брудними» і відкладає роботу до рендерингу.' },
    { line: 7, stages: upTo('js'), blocks: [fIn, fJs, fRaf], thread: 'main', note: 'Перед рендерингом виконуються колбеки requestAnimationFrame — найкраще місце для візуальних змін: вони встигнуть у цей самий кадр.' },
    { line: null, stages: upTo('style'), blocks: full.slice(0, 4), thread: 'main', note: 'Style: браузер зіставляє селектори і обчислює фінальні стилі (computed style) змінених елементів.' },
    { line: null, stages: upTo('layout'), blocks: full.slice(0, 5), thread: 'main', note: 'Layout (reflow): обчислює геометрію — розміри й позиції боксів. Зміна ширини одного елемента може зсунути багато інших.' },
    { line: null, stages: upTo('paint'), blocks: full.slice(0, 6), thread: 'main', note: 'Paint: записує команди малювання (текст, фони, тіні) для шарів. Растеризацію в пікселі браузер виконує вже поза головним потоком.' },
    { line: null, stages: upTo('composite'), blocks: full, thread: 'compositor', note: 'Composite: потік композитора складає шари в кадр і через GPU виводить на екран. Ми вклались у бюджет — решту часу браузер простоює.' },
    { line: 11, prop: 'width', stages: triggers(['style', 'layout', 'paint', 'composite']), blocks: [b('js', 'js', 0.4), b('style', 'style', 1.2), b('layout', 'layout', 3.4), b('paint', 'paint', 2.2), b('composite', 'composite', 0.9)], thread: 'main', note: 'width змінює геометрію: потрібні Layout, Paint і Composite. Найдорожчий шлях — особливо коли зміна зачіпає багато елементів.' },
    { line: 12, prop: 'color', stages: triggers(['style', 'paint', 'composite']), blocks: [b('js', 'js', 0.4), b('style', 'style', 1), b('paint', 'paint', 2.2), b('composite', 'composite', 0.9)], thread: 'main', note: 'color не впливає на геометрію: Layout пропускається, але пікселі треба перемалювати — лишаються Paint і Composite.' },
    { line: 13, prop: 'transform', stages: triggers(['style', 'composite']), blocks: [b('js', 'js', 0.4), b('style', 'style', 0.6), b('composite', 'composite', 0.9)], thread: 'compositor', note: 'transform і opacity елемента на власному шарі не потребують ні Layout, ні Paint: композитор лише зсуває готовий шар. CSS-анімації цих властивостей ідуть на compositor-потоці, навіть коли головний зайнятий.' },
    { line: null, stages: upTo('composite'), blocks: [fIn, b('heavy', 'js', 13), fStyle, fLayout, fPaint, fComp], thread: 'main', warn: '⚠️ Кадр не вклався в 16.7 мс — jank', note: 'Якщо JS разом із рендерингом не вкладається в 16.7 мс, кадр пропускається — це jank. Тому анімують transform/opacity, а важку роботу дроблять.' },
  ],
}

// ── layout-thrashing ─────────────────────────────────────────────
const thrashCode = `const items = document.querySelectorAll('.item') // 4 шт.

// ❌ читання і запис упереміш
for (const el of items) {
  const h = el.offsetHeight         // читання геометрії
  el.style.height = h + 10 + 'px'   // запис → layout «брудний»
}

// ✅ спершу всі читання, потім усі записи
const heights = [...items].map((el) => el.offsetHeight)
items.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px'
})`

const FORCED = 3.5
const r = (n: number) => b(`r${n}`, 'js', 0.3)
const w = (n: number) => b(`w${n}`, 'js', 0.2)
const forced = (n: number) => b(`forced${n}`, 'forced', FORCED)
const render = [b('style', 'style', 1), b('layout', 'layout', FORCED), b('paint', 'paint', 2), b('composite', 'composite', 0.9)]
const WARN = '⚠️ Forced reflow'
const loop4 = [r(1), w(1), forced(2), r(2), w(2), forced(3), r(3), w(3), forced(4), r(4), w(4)]
const batched = [b('reads', 'js', 0.8), b('writes', 'js', 0.6)]

const layoutThrashing: StepScenario<RenderFrame> = {
  code: thrashCode,
  frames: [
    { line: 1, stages: {}, blocks: [], note: 'Чотири елементи .item. Для наочності вважаємо, що один Layout коштує ≈3.5 мс — на великих сторінках буває й більше.' },
    { line: 5, stages: { js: 'run' }, blocks: [r(1)], dirty: false, note: 'Ітерація 1, читання: offsetHeight потребує геометрії. Layout ще актуальний, тож значення повертається одразу.' },
    { line: 6, stages: { js: 'run' }, blocks: [r(1), w(1)], dirty: true, note: 'Запис style.height робить layout «брудним». Сам запис дешевий: браузер планує перерахунок на етап рендерингу кадру.' },
    { line: 5, stages: { js: 'done', layout: 'run' }, blocks: loop4.slice(0, 4), dirty: false, warn: WARN, note: 'Ітерація 2, читання: щоб віддати точний offsetHeight, браузер мусить виконати Layout просто зараз, синхронно. Це forced synchronous layout (forced reflow).' },
    { line: 6, stages: { js: 'run' }, blocks: loop4.slice(0, 5), dirty: true, warn: WARN, note: 'І знову запис інвалідує щойно пораховану геометрію. Робота попереднього Layout фактично викинута.' },
    { line: 5, stages: { js: 'run' }, blocks: loop4, dirty: true, warn: WARN, note: 'Ітерації 3 і 4 повторюють «читання → примусовий Layout → запис». Для N елементів — N−1 зайвих перерахунків.' },
    { line: 7, stages: upTo('composite'), blocks: [...loop4, ...render], dirty: false, warn: WARN, note: 'Після циклу — ще й звичайний рендеринг кадру. Разом бюджет 16.7 мс перевищено, кадр пропущено. У DevTools такі Layout позначені попередженням «Forced reflow».' },
    { line: 10, stages: { js: 'run' }, blocks: [batched[0]!], dirty: false, note: 'Виправлення: спершу всі читання. Layout актуальний, тож усі чотири offsetHeight беруться з тієї самої геометрії без перерахунку.' },
    { line: 12, stages: { js: 'run' }, blocks: batched, dirty: true, note: 'Потім усі записи. Кожен лише позначає layout «брудним» — жодне читання не змушує рахувати його негайно.' },
    { line: 13, stages: upTo('composite'), blocks: [...batched, ...render], dirty: false, note: 'Один Layout у звичайному рендерингу кадру — і ми в бюджеті. Альтернатива: читати зараз, а записи відкласти в requestAnimationFrame.' },
    { line: null, stages: {}, blocks: [...batched, ...render], dirty: false, note: 'Layout змушують: offsetTop/Width/Height, getBoundingClientRect(), getComputedStyle(el).width, scrollTop, innerText, focus(). Читай їх пакетом до записів.' },
  ],
}

export const renderPipelineScenarios: Record<string, StepScenario<RenderFrame>> = {
  frame,
  'layout-thrashing': layoutThrashing,
}
