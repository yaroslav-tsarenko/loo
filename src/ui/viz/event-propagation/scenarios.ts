import type { Frame, StepScenario } from '../engine/types'
import type { DomNode, EventPhase, Listener } from './dispatch'

export interface PropFrame extends Frame {
  tree: DomNode
  listeners: Listener[]
  // node the event is at right now (null = not dispatching)
  at: string | null
  phase: EventPhase
  // event.target (stays the same for the whole dispatch)
  target: string | null
  // listeners that ran in this step, in order
  ran: string[]
  // dispatch number (0 = setup / commentary); used to check the order in tests
  run: number
  // element found by closest()
  hit?: string | null
  // <li> marked .done
  done?: string[]
  stopped?: boolean
  output: string[]
}

const leaf = (id: string, tag: string, children: DomNode[] = [], text?: string): DomNode => ({ id, tag, ...(text ? { text } : {}), ...(children.length > 0 ? { children } : {}) })
const page = (ul: DomNode): DomNode => leaf('window', 'window', [leaf('document', 'document', [leaf('html', '<html>', [leaf('body', '<body>', [ul])])])])

// ── capture-bubble ───────────────────────────────────────────────
const chain = page(leaf('ul', '<ul>', [leaf('li', '<li>', [leaf('button', '<button>', [], 'Купити')])]))

const L = {
  winCap: { id: 'win-cap', node: 'window', capture: true, label: 'capture' },
  ulCap: { id: 'ul-cap', node: 'ul', capture: true, label: 'capture' },
  btn: { id: 'btn', node: 'button', capture: false, label: 'bubble' },
  btnCap: { id: 'btn-cap', node: 'button', capture: true, label: 'capture' },
  li: { id: 'li', node: 'li', capture: false, label: 'bubble' },
  doc: { id: 'doc', node: 'document', capture: false, label: 'bubble' },
  liStop: { id: 'li-stop', node: 'li', capture: false, label: 'stopPropagation()', stops: true },
} satisfies Record<string, Listener>

const all = [L.winCap, L.ulCap, L.btn, L.btnCap, L.li, L.doc]
const run1 = ['window ⬇ 1', 'ul ⬇ 1', 'btn ⬇ 2', 'btn 2', 'li ⬆ 3', 'document ⬆ 3']
const cb = { tree: chain, at: null, phase: 0 as EventPhase, target: null, ran: [], run: 0, output: [] }
const r1 = { ...cb, listeners: all, target: 'button', run: 1 }
const r2 = { ...cb, listeners: [...all, L.liStop], target: 'button', run: 2 }

const captureBubbleCode = `const log = (name) => (e) => console.log(name, e.eventPhase)

window.addEventListener('click', log('window ⬇'), { capture: true })
ul.addEventListener('click', log('ul ⬇'), { capture: true })
btn.addEventListener('click', log('btn'))
btn.addEventListener('click', log('btn ⬇'), { capture: true })
li.addEventListener('click', log('li ⬆'))
document.addEventListener('click', log('document ⬆'))

btn.click() // те саме, що клік користувача

// варіант: li зупиняє спливання
li.addEventListener('click', (e) => e.stopPropagation())
btn.click()`

const captureBubble: StepScenario<PropFrame> = {
  code: captureBubbleCode,
  frames: [
    { ...cb, line: 1, listeners: [], note: 'Допоміжна log(name) повертає обробник, що друкує ім’я та event.eventPhase: 1 — capture, 2 — на цілі, 3 — bubble.' },
    { ...cb, line: 4, listeners: [L.winCap, L.ulCap], note: '{ capture: true } вмикає фазу перехоплення: слухачі window і <ul> спрацюють на шляху згори вниз — ще до того, як подія дійде до кнопки.' },
    { ...cb, line: 6, listeners: [L.winCap, L.ulCap, L.btn, L.btnCap], note: 'На кнопці два слухачі: звичайний (рядок 5) і capture (рядок 6). Зареєстровано їх саме в такому порядку — подивимось, хто спрацює першим.' },
    { ...cb, line: 8, listeners: all, note: 'Без capture слухач реагує на спливання (bubble) — шлях знизу вгору. Так за замовчуванням працює більшість обробників.' },
    { ...r1, line: 10, note: 'Клік по кнопці. Браузер один раз будує шлях window → document → html → body → ul → li → button; event.target — кнопка на весь час доставки.' },
    { ...r1, line: 3, at: 'window', phase: 1, ran: ['win-cap'], output: run1.slice(0, 1), note: 'Фаза 1 (CAPTURING): подія йде згори вниз. На window спрацював capture-слухач: event.currentTarget = window, а target — усе ще кнопка.' },
    { ...r1, line: null, at: 'document', phase: 1, output: run1.slice(0, 1), note: 'На document є лише bubble-слухач, тож у фазі capture він мовчить — його черга настане на зворотному шляху.' },
    { ...r1, line: null, at: 'body', phase: 1, output: run1.slice(0, 1), note: '<html> і <body>: слухачів немає, подія просто проходить повз. Шлях не залежить від того, чи є на елементі обробники.' },
    { ...r1, line: 4, at: 'ul', phase: 1, ran: ['ul-cap'], output: run1.slice(0, 2), note: '<ul> перехоплює подію в capture: currentTarget = ul. Предок дізнається про клік раніше за саму кнопку.' },
    { ...r1, line: null, at: 'li', phase: 1, output: run1.slice(0, 2), note: 'На <li> лише bubble-слухач — у фазі capture його пропускаємо.' },
    { ...r1, line: 6, at: 'button', phase: 2, ran: ['btn-cap'], output: run1.slice(0, 3), note: 'Фаза 2 (AT_TARGET): target === currentTarget. За сучасною специфікацією DOM на цілі спершу йдуть capture-слухачі, хоч цей зареєстровано пізніше (старі браузери брали порядок реєстрації).' },
    { ...r1, line: 5, at: 'button', phase: 2, ran: ['btn'], output: run1.slice(0, 4), note: 'Потім — звичайні слухачі цілі, теж з eventPhase = 2. Тепер подія розвертається й починає спливати.' },
    { ...r1, line: 7, at: 'li', phase: 3, ran: ['li'], output: run1.slice(0, 5), note: 'Фаза 3 (BUBBLING): шлях у зворотному порядку. Bubble-слухач <li> отримує подію: currentTarget = li, target — та сама кнопка.' },
    { ...r1, line: null, at: 'ul', phase: 3, output: run1.slice(0, 5), note: 'Слухач <ul> зареєстровано з capture, тож на спливанні він не викликається: один слухач — одна фаза.' },
    { ...r1, line: 8, at: 'document', phase: 3, ran: ['doc'], output: run1, note: '<body> і <html> пройдено без слухачів, document отримує подію. Саме тут часто живуть делеговані обробники бібліотек.' },
    { ...r1, line: null, output: run1, note: 'На window лише capture-слухач, тож спливання закінчується тихо. Після доставки eventPhase знову 0, а currentTarget — null.' },
    { ...cb, line: 13, listeners: [...all, L.liStop], output: run1, note: 'Додаємо на <li> ще один bubble-слухач, який викликає e.stopPropagation().' },
    { ...r2, line: 14, at: 'button', phase: 2, ran: ['win-cap', 'ul-cap', 'btn-cap', 'btn'], output: [...run1, '— клік №2 —', ...run1.slice(0, 4)], note: 'Другий клік: capture і фаза цілі — як і раніше, stopPropagation ще ніхто не викликав.' },
    { ...r2, line: 13, at: 'li', phase: 3, ran: ['li', 'li-stop'], stopped: true, output: [...run1, '— клік №2 —', ...run1.slice(0, 5)], note: 'На <li> виконуються обидва слухачі: log, а потім stopPropagation(). Вона не скасовує решту слухачів поточного елемента — лише рух далі.' },
    { ...r2, line: null, at: 'li', phase: 3, stopped: true, output: [...run1, '— клік №2 —', ...run1.slice(0, 5)], note: 'document ⬆ уже не спрацює: подія далі не піде. stopImmediatePropagation() зупинила б ще й наступні слухачі на самому <li>.' },
    { ...cb, line: null, listeners: [...all, L.liStop], output: [...run1, '— клік №2 —', ...run1.slice(0, 5)], note: 'Не всі події спливають: у focus, blur, mouseenter event.bubbles === false — є лише capture і фаза цілі. Для делегування беруть focusin / focusout.' },
  ],
}

// ── delegation ───────────────────────────────────────────────────
const item = (n: number, text: string) => leaf(`li${n}`, '<li>', [leaf(`btn${n}`, '<button>', [], '✔')], text)
const list2 = page(leaf('ul', '<ul>', [item(1, '🍞 Хліб'), item(2, '🧀 Сир')]))
const list3 = page(leaf('ul', '<ul>', [item(1, '🍞 Хліб'), item(2, '🧀 Сир'), item(3, '🥛 Молоко')]))

const ulDel: Listener = { id: 'ul-del', node: 'ul', capture: false, label: 'bubble' }
const db = { tree: list2, listeners: [ulDel], at: null, phase: 0 as EventPhase, target: null, ran: [], run: 0, output: [] }
const log2 = '✔ 2 target: BUTTON'
const log3 = '✔ 3 target: BUTTON'

const delegationCode = `const list = document.querySelector('ul')

list.addEventListener('click', (event) => {
  const li = event.target.closest('li')
  if (!li || !list.contains(li)) return
  li.classList.toggle('done')
  console.log('✔', li.dataset.id, 'target:', event.target.tagName)
})

// пізніше: новий пункт без власного слухача
const item = document.createElement('li')
item.dataset.id = '3'
item.innerHTML = '🥛 Молоко <button>✔</button>'
list.append(item)`

const delegation: StepScenario<PropFrame> = {
  code: delegationCode,
  frames: [
    { ...db, line: 1, listeners: [], note: 'Список із двох пунктів, у кожному — кнопка ✔. Замість слухача на кожному <li> повісимо один, на спільному предку <ul>.' },
    { ...db, line: 3, note: 'Один bubble-слухач на <ul>. Завдяки спливанню він почує кліки з будь-якого нащадка — навіть з тих, яких ще немає.' },
    { ...db, line: null, run: 1, target: 'btn2', at: 'btn2', phase: 2, note: 'Клік по кнопці ✔ у другому пункті. event.target — найглибший елемент під курсором, тобто <button>, а не <li>.' },
    { ...db, line: null, run: 1, target: 'btn2', at: 'li2', phase: 3, note: 'Подія спливає: на <li> слухачів немає, тож вона йде далі вгору.' },
    { ...db, line: 4, run: 1, target: 'btn2', at: 'ul', phase: 3, ran: ['ul-del'], hit: 'li2', note: 'Спрацював слухач <ul>: currentTarget = ul, target = button. closest(\'li\') піднімається від target до предків і знаходить другий <li>.' },
    { ...db, line: 7, run: 1, target: 'btn2', at: 'ul', phase: 3, hit: 'li2', done: ['li2'], output: [log2], note: 'list.contains(li) відсікає <li>, що лежить вище за сам список (вкладені списки). Пункт позначено, а tagName показує, що клікнули саме кнопку.' },
    { ...db, line: 14, tree: list3, done: ['li2'], output: [log2], note: 'Новий <li> додано динамічно. Жодного addEventListener для нього — і він не потрібен.' },
    { ...db, line: null, tree: list3, run: 2, target: 'btn3', at: 'btn3', phase: 2, done: ['li2'], output: [log2], note: 'Клік по кнопці нового пункту. Подія народжується на <button> і проходить той самий шлях, що й для старих пунктів.' },
    { ...db, line: 4, tree: list3, run: 2, target: 'btn3', at: 'ul', phase: 3, ran: ['ul-del'], hit: 'li3', done: ['li2'], output: [log2], note: 'Подія спливла до <ul> — той самий слухач обробляє новий пункт. closest(\'li\') знаходить третій <li>.' },
    { ...db, line: 7, tree: list3, run: 2, target: 'btn3', at: 'ul', phase: 3, hit: 'li3', done: ['li2', 'li3'], output: [log2, log3], note: 'Делегування працює для елементів, доданих пізніше, і тримає одну підписку замість N.' },
    { ...db, line: 5, tree: list3, run: 3, target: 'ul', at: 'ul', phase: 2, ran: ['ul-del'], done: ['li2', 'li3'], output: [log2, log3], note: 'Клік у проміжок між пунктами: target — сам <ul>, тож слухач спрацьовує у фазі 2. closest(\'li\') повертає null, і ранній return ігнорує клік.' },
    { ...db, line: null, tree: list3, done: ['li2', 'li3'], output: [log2, log3], note: 'Обмеження: подія мусить спливати (для фокусу — focusin / focusout), а stopPropagation у дочірньому компоненті «зламає» делегування.' },
  ],
}

export const eventPropagationScenarios: Record<string, StepScenario<PropFrame>> = {
  'capture-bubble': captureBubble,
  delegation,
}
