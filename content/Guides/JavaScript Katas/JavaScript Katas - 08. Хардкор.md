---
title: Хардкор
order: 8
level: senior
tags: [promises, json, virtual-dom, scheduler, abortcontroller, signals, templates]
prerequisites:
  - "[[JavaScript Katas - 05. Асинхронність]]"
  - "[[JavaScript Katas - 06. Патерни та структури даних]]"
  - "[[JavaScript - 09. Promise]]"
estimatedMinutes: 150
id: jsk-ch-08
icon: "🏆"
---

# JavaScript Katas - 08. Хардкор

> [!success] 🎯 Що тренуємо
> - Писати «міні-бібліотеки» на 40–80 рядків з чітким контрактом: шаблонізатор, серіалізатор, diff, планувальник, черга, Promise, реактивність.
> - Тримати в голові **інваріанти** (стан промісу змінюється раз; потік закривається раз; підписки чистяться) і перевіряти їх тестами.
> - Розуміти, як влаштовані інструменти, якими ти користуєшся щодня: React reconciliation, Promises/A+, `scheduler.postTask`, signals у Preact/Solid/Angular.

## 🧭 Стратегія

Задачі цього розділу дають на senior-співбесідах і take-home. За 45 хвилин написати все ідеально неможливо — і цього не чекають. Оцінюють **декомпозицію** і **порядок роботи**:

1. **Спершу API і приклади.** Запиши, як бібліотекою користуватимуться: `render('Hi {{name}}', { name: 'Ann' })`. Узгодь формат результату (наприклад, формат патчів у diff) **до** реалізації.
2. **Скелет зі станом.** Які поля в замиканні чи класі? Для Promise: `state`, `value`, `handlers`. Для signals: `value`, `subscribers`, «поточний спостерігач».
3. **Щасливий шлях.** Найпростіший сценарій end-to-end, потім — краєві випадки по одному.
4. **Інваріанти вголос.** «Проміс міняє стан лише раз», «teardown викликається один раз», «нова підписка під час розсилки не викликається в цій же розсилці».
5. **Що б я додав у продакшн.** Скасування, пам'ять, продуктивність (купа замість лінійного пошуку), типи.

> [!tip] Знімок колекції під час розсилки
> Майже у всіх задачах тут є «розсилка» (обробники промісу, підписники сигналу, слухачі abort). Ітеруй **копію** — `[...subscribers]` — інакше обробник, що підписується знову, потрапить у той самий цикл і створить нескінченний цикл.

## 🧩 Збери з пам'яті

> [!quiz] Збери метод `then` власного Promise
> level: senior · type: order · id: jsk-08-quiz-01
>
> ```js order
> then(onFulfilled, onRejected) {
>   return new MyPromise((resolve, reject) => {
>     const handler = { onFulfilled, onRejected, resolve, reject }
>     if (this.state === 'pending') this.handlers.push(handler)
>     else queueMicrotask(() => this.run(handler))
>   })
> }
> else this.run(handler)   // ✗
> ```
>
> **Пояснення:** `then` завжди повертає **новий** проміс, а обробник завжди виконується асинхронно (мікрозадача) — навіть якщо проміс уже виконаний. Синхронний виклик для виконаних і асинхронний для pending — класичний антипатерн «Zalgo».

> [!quiz] Заповни пропуски в екрануванні HTML
> level: middle · type: fill · id: jsk-08-quiz-02 · bank: &lt;amp;, split, &#38;
>
> ```js fill
> const ESCAPES = { '&': '[[&amp;]]', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
> const escapeHtml = (value) => String(value).[[replace]](/[&<>"']/g, (ch) => ESCAPES[ch])
> ```
>
> **Пояснення:** одна регулярка з функцією-заміною обробляє всі символи за один прохід — тому `&` не буде заекрановано двічі (`&lt;` → `&amp;lt;`), як буває при ланцюжку `.replace(...).replace(...)` у неправильному порядку.

> [!quiz] Заповни пропуски у спрощеному сигналі
> level: senior · type: fill · id: jsk-08-quiz-03
>
> ```js fill
> function signal(initial) {
>   let value = initial
>   const subscribers = new Set()
>   return {
>     get value() {
>       if (currentEffect) subscribers.[[add]](currentEffect)
>       return value
>     },
>     set value(next) {
>       if (Object.[[is]](next, value)) return
>       value = next
>       for (const effect of [...[[subscribers]]]) effect.run()
>     },
>   }
> }
> ```
>
> **Пояснення:** читання всередині ефекту **автоматично** підписує ефект — так з'являється трекінг залежностей без явних масивів deps. Запис з тим самим значенням нічого не запускає.

## 🛠️ Задачі

> [!task] Міні-шаблонізатор
> level: middle · difficulty: medium · id: jsk-08-task-01 · tags: strings, regex, security
>
> Напиши `render(template, data)`:
>
> - `{{ path }}` — значення за шляхом через крапку (`user.name`, `items.0`), **HTML-екрановане** (`& < > " '`);
> - `{{{ path }}}` — те саме, але без екранування;
> - пробіли всередині дужок довільні;
> - відсутнє значення, `null` і `undefined` → порожній рядок; `0` і `false` виводяться як є;
> - підстановка за **один прохід**: якщо значення містить `{{…}}`, воно не обробляється повторно.
>
> ```js starter
> function render(template, data) {
>   // твій код
> }
> ```
>
> ```js tests
> test('проста підстановка', () => {
>   expect(render('Привіт, {{name}}!', { name: 'Оля' })).toBe('Привіт, Оля!')
> })
>
> test('вкладені шляхи й пробіли', () => {
>   const data = { user: { name: 'Ann', tags: ['a', 'b'] } }
>   expect(render('{{ user.name }} / {{user.tags.1}}', data)).toBe('Ann / b')
> })
>
> test('відсутні, null і undefined → порожньо', () => {
>   expect(render('[{{a}}][{{b}}][{{c.d.e}}]', { a: null, b: undefined })).toBe('[][][]')
> })
>
> test('0 і false виводяться', () => {
>   expect(render('{{n}} {{f}}', { n: 0, f: false })).toBe('0 false')
> })
>
> test('екранування HTML за замовчуванням', () => {
>   const data = { evil: '<img src=x onerror="alert(1)">', amp: 'Tom & Jerry\'s' }
>   expect(render('{{evil}}', data)).toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;')
>   expect(render('{{amp}}', data)).toBe('Tom &amp; Jerry&#39;s')
> })
>
> test('потрійні дужки — без екранування', () => {
>   expect(render('{{{ html }}}', { html: '<b>bold</b>' })).toBe('<b>bold</b>')
> })
>
> test('кілька входжень і текст без плейсхолдерів', () => {
>   expect(render('{{x}}+{{x}}={{y}}', { x: 1, y: 2 })).toBe('1+1=2')
>   expect(render('просто текст', {})).toBe('просто текст')
> })
>
> test('один прохід: значення не рендериться повторно', () => {
>   expect(render('{{a}}', { a: '{{b}}', b: 'зламано' })).toBe('{{b}}')
> })
> ```
>
> > [!hint]- Підказка 1
> > Одна регулярка з двома альтернативами: спершу `\{\{\{\s*([\w.$]+)\s*\}\}\}`, потім `\{\{\s*([\w.$]+)\s*\}\}`. `String.prototype.replace` з функцією-заміною — і є «один прохід».
>
> > [!hint]- Підказка 2
> > Шлях: `path.split('.').reduce((obj, key) => obj?.[key], data)`. Екранування — функція-заміна по `/[&<>"']/g`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
> >
> > function escapeHtml(value) {
> >   return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch])
> > }
> >
> > function lookup(data, path) {
> >   return path.split('.').reduce((obj, key) => (obj == null ? undefined : obj[key]), data)
> > }
> >
> > function render(template, data) {
> >   return template.replace(/\{\{\{\s*([\w.$]+)\s*\}\}\}|\{\{\s*([\w.$]+)\s*\}\}/g, (_, rawPath, path) => {
> >     const value = lookup(data, rawPath ?? path)
> >     if (value == null) return ''
> >     return rawPath ? String(value) : escapeHtml(value)
> >   })
> > }
> > ```
> > **Складність:** O(довжини шаблону + сумарної довжини підстановок). **Чому так:** альтернатива з потрійними дужками стоїть першою, інакше `{{` «відкусить» частину `{{{`. Екранування за замовчуванням — захист від XSS; сирий вивід — явний вибір автора шаблону. **Що спитають далі:** «секції й цикли `{{#items}}…{{/items}}`?» — токенізатор + рекурсивний рендер дерева; «компіляція шаблону у функцію для швидкості?»; «чому `innerHTML` з екранованим текстом — усе одно ризик в атрибутах без лапок і в `href="javascript:…"`?».

> [!task] JSON.stringify
> level: senior · difficulty: hard · id: jsk-08-task-02 · tags: recursion, json, serialization
>
> Напиши `stringify(value)` — підмножину `JSON.stringify` без `replacer` і відступів, що дає **ідентичний** результат:
>
> - `null`, булеві, скінченні числа; `NaN`/`±Infinity` → `null`; `-0` → `0`;
> - рядки в лапках з екрануванням `"`, `\`, `\b \f \n \r \t` і решти керівних символів `< 0x20` як `\u00xx`;
> - масиви: `undefined`, функції, символи **і дірки** → `null`;
> - об'єкти: власні перелічувані рядкові ключі в порядку `Object.keys`; властивості з `undefined`, функціями й символами пропускаються;
> - метод `toJSON(key)` (як у `Date`) підміняє значення; обгортки `new Number/String/Boolean` розгортаються;
> - на верхньому рівні `undefined`, функція чи символ → `undefined`;
> - цикл → `TypeError`; `BigInt` → `TypeError`.
>
> ```js starter
> function stringify(value) {
>   // твій код
> }
> ```
>
> ```js tests
> const cases = {
>   'примітиви': [null, true, false, 0, -0, 42, 3.14, -1e21, NaN, Infinity, -Infinity],
>   'рядки': ['hi', '', 'лапки " і слеш \\', 'рядок\nз\tтабом\r', '\u0001\u001f\b\f', 'юнікод 😀 /'],
>   'масиви': [[], [1, 'a', null], [undefined, () => 1, Symbol('s')], [1, , 3], [[[]]]],
>   'об\'єкти': [{}, { a: 1, b: 'x' }, { u: undefined, f() {}, s: Symbol('x'), n: null }, { nested: { deep: [1, { x: [] }] } }, { 2: 'b', 1: 'a', z: 0 }, { 'ключ "з лапками"': 1 }],
>   'toJSON і обгортки': [new Date(0), { d: new Date(0) }, { toJSON(key) { return { key } } }, { inner: { toJSON(key) { return key } } }, new Number(5), new String('s'), [new Boolean(false)]],
> }
>
> for (const [group, values] of Object.entries(cases)) {
>   test(`збігається з JSON.stringify: ${group}`, () => {
>     for (const value of values) expect(stringify(value)).toBe(JSON.stringify(value))
>   })
> }
>
> test('верхній рівень undefined, функція, символ → undefined', () => {
>   expect(stringify(undefined)).toBe(undefined)
>   expect(stringify(() => {})).toBe(undefined)
>   expect(stringify(Symbol('x'))).toBe(undefined)
> })
>
> test('Map і Set стають {}', () => {
>   expect(stringify({ m: new Map([[1, 2]]), s: new Set([1]) })).toBe('{"m":{},"s":{}}')
> })
>
> test('спільне посилання — не цикл', () => {
>   const shared = { v: 1 }
>   expect(stringify({ a: shared, b: [shared] })).toBe('{"a":{"v":1},"b":[{"v":1}]}')
> })
>
> test('цикл — TypeError', () => {
>   const obj = { name: 'loop' }
>   obj.self = obj
>   expect(() => stringify(obj)).toThrow(TypeError)
>   const arr = []
>   arr.push(arr)
>   expect(() => stringify(arr)).toThrow(TypeError)
> })
>
> test('BigInt — TypeError', () => {
>   expect(() => stringify({ big: 10n })).toThrow(TypeError)
> })
>
> test('не використовує вбудований JSON.stringify', () => {
>   const original = JSON.stringify
>   JSON.stringify = () => { throw new Error('JSON.stringify заборонено') }
>   try {
>     expect(stringify({ a: [1, 'x', null] })).toBe('{"a":[1,"x",null]}')
>   } finally {
>     JSON.stringify = original
>   }
> })
> ```
>
> > [!hint]- Підказка 1
> > Рекурсивна `serialize(value, key, ancestors)`, що повертає рядок або `undefined` («пропустити»). Спершу `toJSON` і розгортання обгорток, потім `switch (typeof value)`.
>
> > [!hint]- Підказка 2
> > Масив обходь через `Array.from(value, …)` — він відвідує дірки як `undefined`. Цикл = значення вже є серед **предків** на поточному шляху (стек), а не серед усіх відвіданих — інакше спільні посилання стануть «циклом».
>
> > [!solution]- Еталонне рішення
> > ```js
> > const ESCAPES = { '"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t' }
> >
> > function quote(str) {
> >   const body = str.replace(/["\\\u0000-\u001f]/g, (ch) => ESCAPES[ch] ?? `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`)
> >   return `"${body}"`
> > }
> >
> > function serialize(value, key, ancestors) {
> >   if (value !== null && typeof value === 'object' && typeof value.toJSON === 'function') value = value.toJSON(key)
> >   if (value instanceof Number || value instanceof String || value instanceof Boolean) value = value.valueOf()
> >   if (value === null) return 'null'
> >   switch (typeof value) {
> >     case 'boolean':
> >       return String(value)
> >     case 'number':
> >       return Number.isFinite(value) ? String(value) : 'null'
> >     case 'string':
> >       return quote(value)
> >     case 'bigint':
> >       throw new TypeError('Do not know how to serialize a BigInt')
> >     case 'undefined':
> >     case 'function':
> >     case 'symbol':
> >       return undefined
> >   }
> >   if (ancestors.includes(value)) throw new TypeError('Converting circular structure to JSON')
> >   ancestors.push(value)
> >   let result
> >   if (Array.isArray(value)) {
> >     result = `[${Array.from(value, (item, i) => serialize(item, String(i), ancestors) ?? 'null').join(',')}]`
> >   } else {
> >     const parts = []
> >     for (const k of Object.keys(value)) {
> >       const serialized = serialize(value[k], k, ancestors)
> >       if (serialized !== undefined) parts.push(`${quote(k)}:${serialized}`)
> >     }
> >     result = `{${parts.join(',')}}`
> >   }
> >   ancestors.pop()
> >   return result
> > }
> >
> > function stringify(value) {
> >   return serialize(value, '', [])
> > }
> > ```
> > **Складність:** O(N · d), де d — глибина (пошук у стеку предків); з `Set` предків — O(N). **Чому так:** повернення `undefined` як сигналу «пропустити» робить різну поведінку масивів (`null`) і об'єктів (пропуск ключа) однорядковою. `String(-0) === '0'`, як і в JSON. **Що спитають далі:** «відступи (`space`)?» — передавати поточний відступ і додавати переноси; «`replacer`-функція і масив дозволених ключів?»; «чому JSON не має `undefined`?» — формат даних, а не JS.

> [!task] Diff віртуального DOM
> level: senior · difficulty: hard · id: jsk-08-task-03 · tags: recursion, virtual-dom, trees
>
> Вузол — рядок (текст) або `{ type, props, children }`. Напиши `diff(oldNode, newNode)`, що повертає масив патчів. `path` — масив індексів дітей від кореня (`[]` — сам корінь).
>
> - старого немає → `{ type: 'CREATE', path, node }`; нового немає → `{ type: 'REMOVE', path }`;
> - обидва текст і різні → `{ type: 'TEXT', path, value }`;
> - текст ↔ елемент або різний `type` → `{ type: 'REPLACE', path, node }` (дітей далі не порівнюємо);
> - той самий `type` → якщо props змінились: `{ type: 'PROPS', path, set, remove }`, де `set` — нові й змінені (за `Object.is`), `remove` — зниклі ключі в порядку старих props; потім діти **за індексом** від 0 до max(довжин);
> - порядок патчів — pre-order: спершу вузол, потім діти зліва направо. Однакові дерева → `[]`.
>
> ```js starter
> function diff(oldNode, newNode) {
>   // твій код
> }
> ```
>
> ```js tests
> const h = (type, props = {}, ...children) => ({ type, props, children })
>
> test('однакові дерева — без патчів', () => {
>   expect(diff(h('div', { id: 'a' }, 'text', h('span')), h('div', { id: 'a' }, 'text', h('span')))).toEqual([])
> })
>
> test('зміна тексту', () => {
>   expect(diff('hello', 'world')).toEqual([{ type: 'TEXT', path: [], value: 'world' }])
>   expect(diff(h('p', {}, 'a'), h('p', {}, 'b'))).toEqual([{ type: 'TEXT', path: [0], value: 'b' }])
> })
>
> test('різний type або текст ↔ елемент — REPLACE без порівняння дітей', () => {
>   const next = h('section', {}, 'x')
>   expect(diff(h('div', {}, 'x'), next)).toEqual([{ type: 'REPLACE', path: [], node: next }])
>   expect(diff('text', h('b'))).toEqual([{ type: 'REPLACE', path: [], node: h('b') }])
>   expect(diff(h('b'), 'text')).toEqual([{ type: 'REPLACE', path: [], node: 'text' }])
> })
>
> test('props: додані, змінені, видалені', () => {
>   const patches = diff(h('input', { type: 'text', value: 'a', disabled: true }), h('input', { type: 'text', value: 'b', placeholder: 'p' }))
>   expect(patches).toEqual([{ type: 'PROPS', path: [], set: { value: 'b', placeholder: 'p' }, remove: ['disabled'] }])
> })
>
> test('додані й видалені діти', () => {
>   const extra = h('li', {}, '3')
>   expect(diff(h('ul', {}, h('li', {}, '1')), h('ul', {}, h('li', {}, '1'), extra))).toEqual([{ type: 'CREATE', path: [1], node: extra }])
>   expect(diff(h('ul', {}, 'a', 'b', 'c'), h('ul', {}, 'a'))).toEqual([{ type: 'REMOVE', path: [1] }, { type: 'REMOVE', path: [2] }])
> })
>
> test('глибока зміна має повний шлях', () => {
>   const before = h('div', {}, h('header'), h('main', {}, h('p', {}, 'old')))
>   const after = h('div', {}, h('header'), h('main', {}, h('p', {}, 'new')))
>   expect(diff(before, after)).toEqual([{ type: 'TEXT', path: [1, 0, 0], value: 'new' }])
> })
>
> test('порядок pre-order: вузол, потім діти', () => {
>   const before = h('div', { a: 1 }, h('span', { x: 1 }), 'tail')
>   const after = h('div', { a: 2 }, h('span', { x: 2 }), 'TAIL')
>   expect(diff(before, after)).toEqual([
>     { type: 'PROPS', path: [], set: { a: 2 }, remove: [] },
>     { type: 'PROPS', path: [0], set: { x: 2 }, remove: [] },
>     { type: 'TEXT', path: [1], value: 'TAIL' },
>   ])
> })
>
> test('корінь створюється і видаляється', () => {
>   expect(diff(undefined, 'x')).toEqual([{ type: 'CREATE', path: [], node: 'x' }])
>   expect(diff('x', undefined)).toEqual([{ type: 'REMOVE', path: [] }])
> })
> ```
>
> > [!hint]- Підказка 1
> > Рекурсивна `walk(a, b, path, patches)`: каскад перевірок — відсутність → текст → різний тип → props → діти.
>
> > [!hint]- Підказка 2
> > Props порівнюй двома проходами: по ключах нових (`set`, якщо `!Object.is(old[k], new[k])` або ключа не було) і по ключах старих (`remove`, якщо ключа немає в нових).
>
> > [!solution]- Еталонне рішення
> > ```js
> > function diff(oldNode, newNode) {
> >   const patches = []
> >   walk(oldNode, newNode, [], patches)
> >   return patches
> > }
> >
> > function walk(a, b, path, patches) {
> >   if (a === undefined && b === undefined) return
> >   if (a === undefined) return patches.push({ type: 'CREATE', path, node: b })
> >   if (b === undefined) return patches.push({ type: 'REMOVE', path })
> >   const aText = typeof a === 'string'
> >   const bText = typeof b === 'string'
> >   if (aText && bText) {
> >     if (a !== b) patches.push({ type: 'TEXT', path, value: b })
> >     return
> >   }
> >   if (aText || bText || a.type !== b.type) return patches.push({ type: 'REPLACE', path, node: b })
> >
> >   const oldProps = a.props ?? {}
> >   const newProps = b.props ?? {}
> >   const set = {}
> >   const remove = []
> >   for (const key of Object.keys(newProps)) {
> >     if (!Object.hasOwn(oldProps, key) || !Object.is(oldProps[key], newProps[key])) set[key] = newProps[key]
> >   }
> >   for (const key of Object.keys(oldProps)) {
> >     if (!Object.hasOwn(newProps, key)) remove.push(key)
> >   }
> >   if (Object.keys(set).length > 0 || remove.length > 0) patches.push({ type: 'PROPS', path, set, remove })
> >
> >   const oldChildren = a.children ?? []
> >   const newChildren = b.children ?? []
> >   const length = Math.max(oldChildren.length, newChildren.length)
> >   for (let i = 0; i < length; i++) walk(oldChildren[i], newChildren[i], [...path, i], patches)
> > }
> > ```
> > **Складність:** O(n) за кількістю вузлів — завдяки двом евристикам React: різний `type` → заміна піддерева, діти порівнюються за позицією. Загальний tree diff — O(n³). **Чому так:** REPLACE без заглиблення відсікає піддерева, які однаково доведеться перебудувати. **Що спитають далі:** «вставка на початок списку дає n патчів — як виправити?» — `key` для дітей і зіставлення за ключем (Map старих ключів + мінімальні переміщення); «як застосувати патчі до DOM?» — REMOVE з кінця, щоб індекси не зсувались.

> [!task] Планувальник з пріоритетами
> level: senior · difficulty: hard · id: jsk-08-task-04 · tags: async, scheduler, priority-queue
>
> Реалізуй клас `Scheduler(concurrency = 1)` з методом `schedule(task, priority = 0)`:
>
> - `task` — функція, що повертає значення або проміс; `schedule` повертає проміс з її результатом (або помилкою);
> - одночасно виконується не більше `concurrency` задач; вільний слот бере задачу з **найвищим** пріоритетом, серед рівних — ту, що додана раніше (FIFO);
> - виконання стартує **асинхронно** (у мікрозадачі): задачі, додані синхронно одна за одною, впорядковуються за пріоритетом;
> - помилка однієї задачі не зупиняє інші.
>
> ```js starter
> class Scheduler {
>   constructor(concurrency = 1) {
>     // твій код
>   }
>
>   schedule(task, priority = 0) {
>     // твій код
>   }
> }
> ```
>
> ```js tests
> const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
>
> test('повертає результат задачі', async () => {
>   const s = new Scheduler()
>   await expect(s.schedule(() => 42)).resolves.toBe(42)
>   await expect(s.schedule(async () => 'async')).resolves.toBe('async')
> })
>
> test('синхронно додані задачі — за пріоритетом', async () => {
>   const s = new Scheduler()
>   const log = []
>   await Promise.all([
>     s.schedule(() => log.push('low'), 1),
>     s.schedule(() => log.push('high'), 10),
>     s.schedule(() => log.push('mid'), 5),
>   ])
>   expect(log).toEqual(['high', 'mid', 'low'])
> })
>
> test('рівні пріоритети — FIFO, від\'ємні — в кінці', async () => {
>   const s = new Scheduler()
>   const log = []
>   await Promise.all(['a', 'b', 'c'].map((name) => s.schedule(() => log.push(name))).concat(s.schedule(() => log.push('neg'), -1)))
>   expect(log).toEqual(['a', 'b', 'c', 'neg'])
> })
>
> test('не стартує синхронно', () => {
>   const s = new Scheduler()
>   let started = false
>   s.schedule(() => { started = true })
>   expect(started).toBe(false)
> })
>
> test('ліміт конкурентності', async () => {
>   const s = new Scheduler(2)
>   let active = 0
>   let peak = 0
>   const task = async () => {
>     active++
>     peak = Math.max(peak, active)
>     await wait(5)
>     active--
>   }
>   await Promise.all(Array.from({ length: 6 }, () => s.schedule(task)))
>   expect(peak).toBe(2)
> })
>
> test('пізніше доданий важливіший обганяє тих, хто чекає', async () => {
>   const s = new Scheduler()
>   const log = []
>   const all = [
>     s.schedule(async () => { log.push('A'); await wait(10) }),
>     s.schedule(() => log.push('B')),
>     s.schedule(() => log.push('C')),
>   ]
>   await wait(2)
>   all.push(s.schedule(() => log.push('URGENT'), 100))
>   await Promise.all(all)
>   expect(log).toEqual(['A', 'URGENT', 'B', 'C'])
> })
>
> test('помилка не зупиняє чергу', async () => {
>   const s = new Scheduler()
>   const failed = s.schedule(() => { throw new Error('впала') })
>   const next = s.schedule(() => 'далі')
>   await expect(failed).rejects.toThrow('впала')
>   await expect(next).resolves.toBe('далі')
> })
> ```
>
> > [!hint]- Підказка 1
> > Черга записів `{ task, priority, seq, resolve, reject }`. Метод `#drain()` запускає задачі, доки є вільні слоти. Перший `schedule` у такті планує `#drain` через `queueMicrotask`.
>
> > [!hint]- Підказка 2
> > Вибір наступної: найбільший `priority`, при рівності — найменший `seq`. Після завершення задачі (`finally`) — `running--` і знову `#drain()`. `new Promise((r) => r(task()))` ловить синхронний `throw`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class Scheduler {
> >   #queue = []
> >   #running = 0
> >   #seq = 0
> >   #drainScheduled = false
> >
> >   constructor(concurrency = 1) {
> >     this.concurrency = concurrency
> >   }
> >
> >   schedule(task, priority = 0) {
> >     return new Promise((resolve, reject) => {
> >       this.#queue.push({ task, priority, seq: this.#seq++, resolve, reject })
> >       if (!this.#drainScheduled) {
> >         this.#drainScheduled = true
> >         queueMicrotask(() => {
> >           this.#drainScheduled = false
> >           this.#drain()
> >         })
> >       }
> >     })
> >   }
> >
> >   #takeNext() {
> >     let best = 0
> >     for (let i = 1; i < this.#queue.length; i++) {
> >       const job = this.#queue[i]
> >       const top = this.#queue[best]
> >       if (job.priority > top.priority || (job.priority === top.priority && job.seq < top.seq)) best = i
> >     }
> >     return this.#queue.splice(best, 1)[0]
> >   }
> >
> >   #drain() {
> >     while (this.#running < this.concurrency && this.#queue.length > 0) {
> >       const job = this.#takeNext()
> >       this.#running++
> >       new Promise((resolve) => resolve(job.task()))
> >         .then(job.resolve, job.reject)
> >         .finally(() => {
> >           this.#running--
> >           this.#drain()
> >         })
> >     }
> >   }
> > }
> > ```
> > **Складність:** вибір наступної — O(n) лінійним пошуком; з бінарною купою — O(log n) на `schedule` і на вибір. **Чому так:** мікрозадача перед стартом дає «вікно», в якому всі синхронні `schedule` встигають стати в чергу — інакше перша задача стартувала б до появи важливіших. `seq` робить порядок стабільним. **Що спитають далі:** «starvation низьких пріоритетів?» — aging: пріоритет росте з часом очікування; «як у браузері?» — `scheduler.postTask(fn, { priority: 'user-blocking' | 'user-visible' | 'background' })`; «скасування?» — `AbortSignal` (наступна задача).

> [!task] Асинхронна черга зі скасуванням через AbortSignal
> level: senior · difficulty: hard · id: jsk-08-task-05 · tags: async, abortcontroller, concurrency
>
> Напиши `createTaskQueue({ concurrency = 1 } = {})`, що повертає `{ add, onIdle, size, pending }`:
>
> - `add(task, { signal } = {})` → проміс з результатом `task(signal)`; задача стартує **одразу**, якщо є вільний слот, інакше чекає (FIFO);
> - якщо `signal` уже скасований — проміс одразу відхиляється `signal.reason`, задача не запускається;
> - скасування під час **очікування** — задача видаляється з черги й ніколи не стартує, проміс відхиляється `signal.reason`;
> - скасування під час **виконання** — проміс відхиляється `signal.reason` **одразу** (задача отримала `signal` і може зупинитися сама); слот звільняється, коли задача справді завершиться;
> - `size` — кількість тих, що чекають; `pending` — тих, що виконуються; `onIdle()` — проміс, що виконується, коли черга порожня й нічого не виконується.
>
> ```js starter
> function createTaskQueue({ concurrency = 1 } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
>
> test('виконує по черзі й повертає результати', async () => {
>   const queue = createTaskQueue()
>   const log = []
>   const a = queue.add(async () => { await wait(5); log.push('a'); return 1 })
>   const b = queue.add(async () => { log.push('b'); return 2 })
>   expect(queue.pending).toBe(1)
>   expect(queue.size).toBe(1)
>   await expect(a).resolves.toBe(1)
>   await expect(b).resolves.toBe(2)
>   expect(log).toEqual(['a', 'b'])
> })
>
> test('помилка задачі відхиляє її проміс', async () => {
>   const queue = createTaskQueue()
>   await expect(queue.add(() => { throw new Error('впала') })).rejects.toThrow('впала')
>   await expect(queue.add(() => 'ok')).resolves.toBe('ok')
> })
>
> test('уже скасований сигнал — задача не запускається', async () => {
>   const queue = createTaskQueue()
>   const task = vi.fn()
>   let error
>   await queue.add(task, { signal: AbortSignal.abort() }).catch((e) => { error = e })
>   expect(error.name).toBe('AbortError')
>   expect(task).toHaveBeenCalledTimes(0)
> })
>
> test('скасування в очікуванні — видаляється з черги', async () => {
>   const queue = createTaskQueue()
>   const controller = new AbortController()
>   const skipped = vi.fn()
>   const first = queue.add(() => wait(10))
>   const second = queue.add(skipped, { signal: controller.signal })
>   const third = queue.add(() => 'третя')
>   controller.abort(new Error('не треба'))
>   expect(queue.size).toBe(1)
>   await expect(second).rejects.toThrow('не треба')
>   await first
>   await expect(third).resolves.toBe('третя')
>   expect(skipped).toHaveBeenCalledTimes(0)
> })
>
> test('скасування під час виконання — відхилення одразу, задача бачить signal', async () => {
>   const queue = createTaskQueue()
>   const controller = new AbortController()
>   let sawAbort = false
>   let rejected = false
>   const running = queue.add(async (signal) => {
>     await wait(30)
>     sawAbort = signal.aborted
>   }, { signal: controller.signal })
>   running.catch(() => { rejected = true })
>   await wait(2)
>   controller.abort()
>   await sleep(0)
>   expect(rejected).toBe(true)
>   expect(queue.pending).toBe(1)
>   await queue.onIdle()
>   expect(sawAbort).toBe(true)
>   expect(queue.pending).toBe(0)
> })
>
> test('ліміт конкурентності', async () => {
>   const queue = createTaskQueue({ concurrency: 3 })
>   let active = 0
>   let peak = 0
>   for (let i = 0; i < 7; i++) {
>     queue.add(async () => {
>       active++
>       peak = Math.max(peak, active)
>       await wait(3)
>       active--
>     })
>   }
>   await queue.onIdle()
>   expect(peak).toBe(3)
> })
>
> test('onIdle для порожньої черги виконується одразу', async () => {
>   const queue = createTaskQueue()
>   await expect(queue.onIdle()).resolves.toBe(undefined)
> })
> ```
>
> > [!hint]- Підказка 1
> > Запис задачі: `{ task, signal, resolve, reject }`. Функція `next()` запускає задачі з голови черги, поки є слоти; після завершення будь-якої — `running--` і знову `next()`.
>
> > [!hint]- Підказка 2
> > На `signal` повісь `addEventListener('abort', onAbort, { once: true })`: якщо запис ще в черзі — вирізати його; у будь-якому разі `reject(signal.reason)` (повторний reject проміс проігнорує). Після завершення задачі зніми слухача, щоб не тримати замикання.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createTaskQueue({ concurrency = 1 } = {}) {
> >   const waiting = []
> >   let running = 0
> >   let idleWaiters = []
> >
> >   const isIdle = () => running === 0 && waiting.length === 0
> >   const notifyIdle = () => {
> >     if (!isIdle()) return
> >     for (const resolve of idleWaiters) resolve()
> >     idleWaiters = []
> >   }
> >
> >   const start = (job) => {
> >     running++
> >     new Promise((resolve) => resolve(job.task(job.signal)))
> >       .then(job.resolve, job.reject)
> >       .finally(() => {
> >         job.cleanup()
> >         running--
> >         next()
> >       })
> >   }
> >
> >   const next = () => {
> >     while (running < concurrency && waiting.length > 0) start(waiting.shift())
> >     notifyIdle()
> >   }
> >
> >   function add(task, { signal } = {}) {
> >     return new Promise((resolve, reject) => {
> >       if (signal?.aborted) return reject(signal.reason)
> >       const job = { task, signal, resolve, reject, cleanup: () => {} }
> >       if (signal) {
> >         const onAbort = () => {
> >           const index = waiting.indexOf(job)
> >           if (index !== -1) waiting.splice(index, 1)
> >           reject(signal.reason)
> >           notifyIdle()
> >         }
> >         signal.addEventListener('abort', onAbort, { once: true })
> >         job.cleanup = () => signal.removeEventListener('abort', onAbort)
> >       }
> >       waiting.push(job)
> >       next()
> >     })
> >   }
> >
> >   return {
> >     add,
> >     onIdle: () => (isIdle() ? Promise.resolve() : new Promise((resolve) => idleWaiters.push(resolve))),
> >     get size() {
> >       return waiting.length
> >     },
> >     get pending() {
> >       return running
> >     },
> >   }
> > }
> > ```
> > **Складність:** `add` — O(1), скасування в очікуванні — O(n) на пошук у масиві (з `Map`/зв'язним списком — O(1)). **Чому так:** проміс ігнорує повторні `resolve`/`reject`, тож гонка «задача завершилась» vs «скасували» розв'язується сама. Слот звільняється лише після реального завершення — інакше задача, що ігнорує `signal`, перевищила б ліміт. **Що спитають далі:** «таймаут на задачу?» — `AbortSignal.any([signal, AbortSignal.timeout(ms)])`; «пауза/відновлення черги?»; «пріоритети?» — поєднати з попередньою задачею.

> [!task] Власний Promise (підмножина Promises/A+)
> level: senior · difficulty: hard · id: jsk-08-task-06 · tags: promises, microtasks
>
> Реалізуй клас `MyPromise` без використання вбудованого `Promise`:
>
> - `new MyPromise(executor)` — executor викликається синхронно з `resolve`, `reject`; виняток у ньому → reject; стан змінюється **лише раз**;
> - `then(onFulfilled, onRejected)` → **новий** `MyPromise`; обробники викликаються **асинхронно** (`queueMicrotask`) у порядку реєстрації; не-функції пропускають значення/помилку далі; виняток в обробнику → reject;
> - resolve з **thenable** (будь-який об'єкт чи функція з методом `then`, включно з `MyPromise`) — «засвоює» його стан; resolve самим собою → `TypeError`;
> - `catch(onRejected)`, `finally(onFinally)` (пропускає значення/помилку; чекає проміс, який повернув `onFinally`; виняток у ньому перемагає);
> - `MyPromise.resolve(value)` (повертає той самий екземпляр, якщо це `MyPromise`), `MyPromise.reject(reason)`.
>
> ```js starter
> class MyPromise {
>   constructor(executor) {
>     // твій код
>   }
>
>   then(onFulfilled, onRejected) {
>     // твій код
>   }
>
>   catch(onRejected) {
>     // твій код
>   }
>
>   finally(onFinally) {
>     // твій код
>   }
>
>   static resolve(value) {
>     // твій код
>   }
>
>   static reject(reason) {
>     // твій код
>   }
> }
> ```
>
> ```js tests
> // Чекає MyPromise не довше 100 мс — щоб недописаний then не «вішав» тести
> const settled = (p) => new Promise((resolve, reject) => {
>   const timer = setTimeout(() => reject(new Error('MyPromise не завершився за 100 мс')), 100)
>   p.then((v) => { clearTimeout(timer); resolve(v) }, (e) => { clearTimeout(timer); reject(e) })
> })
>
> test('executor синхронний, then — асинхронний', async () => {
>   const log = []
>   const p = new MyPromise((resolve) => { log.push('executor'); resolve(1) })
>   p.then((v) => log.push(`then ${v}`))
>   log.push('sync')
>   expect(log).toEqual(['executor', 'sync'])
>   await sleep(0)
>   expect(log).toEqual(['executor', 'sync', 'then 1'])
> })
>
> test('стан змінюється лише раз', async () => {
>   const p = new MyPromise((resolve, reject) => {
>     resolve('first')
>     resolve('second')
>     reject(new Error('ignored'))
>   })
>   await expect(settled(p)).resolves.toBe('first')
> })
>
> test('виняток в executor — reject', async () => {
>   await expect(settled(new MyPromise(() => { throw new Error('boom') }))).rejects.toThrow('boom')
> })
>
> test('ланцюжок значень і порядок обробників', async () => {
>   const log = []
>   const p = MyPromise.resolve(1)
>   p.then(() => log.push('a'))
>   p.then(() => log.push('b'))
>   const result = await settled(p.then((v) => v + 1).then((v) => v * 10))
>   expect(result).toBe(20)
>   expect(log).toEqual(['a', 'b'])
> })
>
> test('засвоєння MyPromise і thenable', async () => {
>   const fromPromise = MyPromise.resolve(1).then(() => new MyPromise((resolve) => setTimeout(resolve, 5, 'later')))
>   await expect(settled(fromPromise)).resolves.toBe('later')
>   const thenable = { then(onFulfilled) { onFulfilled('thenable'); onFulfilled('twice') } }
>   await expect(settled(MyPromise.resolve(1).then(() => thenable))).resolves.toBe('thenable')
> })
>
> test('помилки пролітають до catch, catch відновлює ланцюжок', async () => {
>   const result = await settled(
>     MyPromise.reject(new Error('e'))
>       .then(() => 'пропущено')
>       .catch((err) => `спіймано ${err.message}`)
>       .then((v) => `${v}!`),
>   )
>   expect(result).toBe('спіймано e!')
> })
>
> test('виняток в обробнику then — reject', async () => {
>   await expect(settled(MyPromise.resolve(1).then(() => { throw new Error('в then') }))).rejects.toThrow('в then')
> })
>
> test('resolve самим собою — TypeError', async () => {
>   let self
>   self = MyPromise.resolve(1).then(() => self)
>   await expect(settled(self)).rejects.toThrow(TypeError)
> })
>
> test('finally пропускає значення та помилку і чекає свій проміс', async () => {
>   const log = []
>   await expect(settled(MyPromise.resolve('v').finally(() => new MyPromise((r) => setTimeout(() => { log.push('cleanup'); r('ignored') }, 5))))).resolves.toBe('v')
>   expect(log).toEqual(['cleanup'])
>   await expect(settled(MyPromise.reject(new Error('r')).finally(() => 'ignored'))).rejects.toThrow('r')
>   await expect(settled(MyPromise.resolve('v').finally(() => { throw new Error('з finally') }))).rejects.toThrow('з finally')
> })
>
> test('статичні методи і незалежність від Promise', async () => {
>   const p = MyPromise.resolve(5)
>   expect(MyPromise.resolve(p)).toBe(p)
>   expect(p instanceof Promise).toBe(false)
>   await expect(settled(MyPromise.reject('no'))).rejects.toBe('no')
> })
> ```
>
> > [!hint]- Підказка 1
> > Стан: `state` (`pending`/`fulfilled`/`rejected`), `value`, масив `handlers`. `then` повертає новий `MyPromise`, у executor-і якого ти реєструєш `{ onFulfilled, onRejected, resolve, reject }` — або одразу плануєш його, якщо стан уже відомий.
>
> > [!hint]- Підказка 2
> > Розділи «resolve» і «fulfill»: `resolve(x)` спершу перевіряє `x === this` і thenable (`typeof x.then === 'function'` — тоді `then.call(x, resolve, reject)` з власним одноразовим захистом), і лише потім виконує проміс значенням.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class MyPromise {
> >   #state = 'pending'
> >   #value = undefined
> >   #handlers = []
> >
> >   constructor(executor) {
> >     const { resolve, reject } = this.#createResolvers()
> >     try {
> >       executor(resolve, reject)
> >     } catch (error) {
> >       reject(error)
> >     }
> >   }
> >
> >   #createResolvers() {
> >     let done = false
> >     return {
> >       resolve: (value) => {
> >         if (done) return
> >         done = true
> >         this.#resolveWith(value)
> >       },
> >       reject: (reason) => {
> >         if (done) return
> >         done = true
> >         this.#settle('rejected', reason)
> >       },
> >     }
> >   }
> >
> >   #resolveWith(value) {
> >     if (value === this) return this.#settle('rejected', new TypeError('Chaining cycle detected for promise'))
> >     if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
> >       let then
> >       try {
> >         then = value.then
> >       } catch (error) {
> >         return this.#settle('rejected', error)
> >       }
> >       if (typeof then === 'function') {
> >         const { resolve, reject } = this.#createResolvers()
> >         try {
> >           then.call(value, resolve, reject)
> >         } catch (error) {
> >           reject(error)
> >         }
> >         return
> >       }
> >     }
> >     this.#settle('fulfilled', value)
> >   }
> >
> >   #settle(state, value) {
> >     if (this.#state !== 'pending') return
> >     this.#state = state
> >     this.#value = value
> >     for (const handler of this.#handlers) this.#schedule(handler)
> >     this.#handlers = []
> >   }
> >
> >   #schedule({ onFulfilled, onRejected, resolve, reject }) {
> >     queueMicrotask(() => {
> >       const fulfilled = this.#state === 'fulfilled'
> >       const callback = fulfilled ? onFulfilled : onRejected
> >       if (typeof callback !== 'function') return fulfilled ? resolve(this.#value) : reject(this.#value)
> >       try {
> >         resolve(callback(this.#value))
> >       } catch (error) {
> >         reject(error)
> >       }
> >     })
> >   }
> >
> >   then(onFulfilled, onRejected) {
> >     return new MyPromise((resolve, reject) => {
> >       const handler = { onFulfilled, onRejected, resolve, reject }
> >       if (this.#state === 'pending') this.#handlers.push(handler)
> >       else this.#schedule(handler)
> >     })
> >   }
> >
> >   catch(onRejected) {
> >     return this.then(undefined, onRejected)
> >   }
> >
> >   finally(onFinally) {
> >     if (typeof onFinally !== 'function') return this.then(onFinally, onFinally)
> >     return this.then(
> >       (value) => MyPromise.resolve(onFinally()).then(() => value),
> >       (reason) =>
> >         MyPromise.resolve(onFinally()).then(() => {
> >           throw reason
> >         }),
> >     )
> >   }
> >
> >   static resolve(value) {
> >     return value instanceof MyPromise ? value : new MyPromise((resolve) => resolve(value))
> >   }
> >
> >   static reject(reason) {
> >     return new MyPromise((_, reject) => reject(reason))
> >   }
> > }
> > ```
> > **Складність:** O(1) на `then`, O(k) на розсилку k обробникам. **Чому так:** одноразові resolvers (`done`) відповідають вимозі A+ 2.3.3.3.3: thenable може викликати колбеки кілька разів — рахується лише перший. `then` читається **один раз** (геттер `then` міг би повертати різне). **Що спитають далі:** «чим `queueMicrotask` відрізняється від `setTimeout` тут?» — з таймером `then` виконувався б після рендеру й таймерів, ламаючи порядок відносно нативних промісів; «unhandled rejection tracking?» — прапорець «є обробник» і перевірка в макрозадачі; «додай `MyPromise.all`» — каркас з розділу 5.

> [!task] Реактивні сигнали: signal, computed, effect
> level: senior · difficulty: hard · id: jsk-08-task-07 · tags: reactivity, closures, observer
>
> Реалізуй мінімальну fine-grained реактивність (як у Preact Signals / Solid / Angular):
>
> - `signal(initial)` → об'єкт з геттером/сетером `value`; запис того самого значення (`Object.is`) нічого не запускає;
> - `effect(fn)` — виконує `fn` одразу й **автоматично** перезапускає, коли змінюється будь-який сигнал чи computed, прочитаний під час **останнього** запуску (залежності динамічні); повертає функцію `dispose`;
> - `computed(fn)` → об'єкт з геттером `value`; **лінивий** (не обчислюється, доки не прочитали), **кешований** (повторні читання без змін не викликають `fn`), сам може бути залежністю ефектів і інших computed.
>
> Ефекти виконуються синхронно під час запису сигналу.
>
> ```js starter
> function signal(initial) {
>   // твій код
> }
>
> function computed(fn) {
>   // твій код
> }
>
> function effect(fn) {
>   // твій код
> }
> ```
>
> ```js tests
> test('signal читається і пишеться', () => {
>   const count = signal(1)
>   count.value = 2
>   expect(count.value).toBe(2)
> })
>
> test('effect виконується одразу і на кожну зміну', () => {
>   const count = signal(0)
>   const seen = []
>   effect(() => seen.push(count.value))
>   count.value = 1
>   count.value = 2
>   expect(seen).toEqual([0, 1, 2])
> })
>
> test('те саме значення не запускає effect', () => {
>   const name = signal('a')
>   const spy = vi.fn(() => name.value)
>   effect(spy)
>   name.value = 'a'
>   expect(spy).toHaveBeenCalledTimes(1)
> })
>
> test('computed лінивий і кешований', () => {
>   const base = signal(2)
>   const calc = vi.fn(() => base.value * 10)
>   const double = computed(calc)
>   expect(calc).toHaveBeenCalledTimes(0)
>   expect(double.value).toBe(20)
>   expect(double.value).toBe(20)
>   expect(calc).toHaveBeenCalledTimes(1)
>   base.value = 3
>   expect(calc).toHaveBeenCalledTimes(1)
>   expect(double.value).toBe(30)
>   expect(calc).toHaveBeenCalledTimes(2)
> })
>
> test('effect залежить від computed, computed — від computed', () => {
>   const price = signal(10)
>   const qty = signal(2)
>   const total = computed(() => price.value * qty.value)
>   const label = computed(() => `Разом: ${total.value}`)
>   const seen = []
>   effect(() => seen.push(label.value))
>   qty.value = 3
>   price.value = 5
>   expect(seen).toEqual(['Разом: 20', 'Разом: 30', 'Разом: 15'])
> })
>
> test('динамічні залежності', () => {
>   const useA = signal(true)
>   const a = signal('A')
>   const b = signal('B')
>   const spy = vi.fn(() => (useA.value ? a.value : b.value))
>   effect(spy)
>   b.value = 'B2'
>   expect(spy).toHaveBeenCalledTimes(1)
>   useA.value = false
>   expect(spy).toHaveBeenCalledTimes(2)
>   a.value = 'A2'
>   expect(spy).toHaveBeenCalledTimes(2)
>   b.value = 'B3'
>   expect(spy).toHaveBeenCalledTimes(3)
> })
>
> test('dispose зупиняє ефект', () => {
>   const count = signal(0)
>   const spy = vi.fn(() => count.value)
>   const dispose = effect(spy)
>   dispose()
>   count.value = 5
>   expect(spy).toHaveBeenCalledTimes(1)
> })
>
> test('ефект може писати в інший сигнал', () => {
>   const celsius = signal(0)
>   const fahrenheit = signal(0)
>   const seen = []
>   effect(() => { fahrenheit.value = celsius.value * 9 / 5 + 32 })
>   effect(() => seen.push(fahrenheit.value))
>   celsius.value = 100
>   expect(seen).toEqual([32, 212])
> })
> ```
>
> > [!hint]- Підказка 1
> > Глобальна змінна `currentObserver`: ефект/computed ставить себе туди на час виконання `fn`. Геттер сигналу додає `currentObserver` у свій `Set` підписників, а observer запам'ятовує цей `Set` у своїх `deps`.
>
> > [!hint]- Підказка 2
> > Перед кожним перезапуском observer відписується від усіх старих `deps` — так залежності стають динамічними. Сетер сповіщає **копію** підписників. Computed при сповіщенні не перераховується, а лише стає `dirty` і передає сигнал своїм підписникам далі.
>
> > [!solution]- Еталонне рішення
> > ```js
> > let currentObserver = null
> >
> > function track(subscribers) {
> >   if (!currentObserver) return
> >   subscribers.add(currentObserver)
> >   currentObserver.deps.add(subscribers)
> > }
> >
> > function cleanup(observer) {
> >   for (const subscribers of observer.deps) subscribers.delete(observer)
> >   observer.deps.clear()
> > }
> >
> > function runTracked(observer, fn) {
> >   cleanup(observer)
> >   const previous = currentObserver
> >   currentObserver = observer
> >   try {
> >     return fn()
> >   } finally {
> >     currentObserver = previous
> >   }
> > }
> >
> > function signal(initial) {
> >   let value = initial
> >   const subscribers = new Set()
> >   return {
> >     get value() {
> >       track(subscribers)
> >       return value
> >     },
> >     set value(next) {
> >       if (Object.is(next, value)) return
> >       value = next
> >       for (const observer of [...subscribers]) observer.notify()
> >     },
> >   }
> > }
> >
> > function computed(fn) {
> >   let value
> >   let dirty = true
> >   const subscribers = new Set()
> >   const node = {
> >     deps: new Set(),
> >     notify() {
> >       if (dirty) return
> >       dirty = true
> >       for (const observer of [...subscribers]) observer.notify()
> >     },
> >   }
> >   return {
> >     get value() {
> >       track(subscribers)
> >       if (dirty) {
> >         value = runTracked(node, fn)
> >         dirty = false
> >       }
> >       return value
> >     },
> >   }
> > }
> >
> > function effect(fn) {
> >   let disposed = false
> >   const node = {
> >     deps: new Set(),
> >     notify() {
> >       if (!disposed) runTracked(node, fn)
> >     },
> >   }
> >   runTracked(node, fn)
> >   return () => {
> >     disposed = true
> >     cleanup(node)
> >   }
> > }
> > ```
> > **Складність:** O(кількості підписників) на запис; читання — O(1). **Чому так:** автоматичний трекінг через `currentObserver` — суть fine-grained реактивності: оновлюється лише те, що реально прочитало сигнал. Копія `[...subscribers]` обов'язкова — ефект при перезапуску знову підписується, і ітерація живого `Set` пішла б у нескінченний цикл. **Що спитають далі:** «diamond problem: ефект читає `a` і `computed(a)` — він виконається двічі з проміжним станом?» — так; рішення — push-pull з фазами (позначити dirty, потім виконати ефекти в топологічному порядку) і `batch()`; «чим це краще за React state?» — без ререндеру всього компонента; «TC39 Signals proposal».

## 🎤 На співбесіді

> [!interview] Чому обробники `then` завжди виконуються асинхронно, навіть для вже виконаного промісу?
> level: senior · frequency: часто · id: jsk-08-int-01
>
> ---
>
> Щоб порядок виконання був **передбачуваним**: код після `.then(...)` завжди виконається раніше за обробник, незалежно від того, був проміс уже виконаний чи ні. API, що інколи викликає колбек синхронно, а інколи асинхронно («випустити Zalgo»), породжує баги, які проявляються лише за певних таймінгів. Promises/A+ вимагає виклику обробників, коли стек виконання містить лише платформний код; ECMAScript реалізує це через Job Queue — мікрозадачі, тож вони виконуються до таймерів і рендеру.
>
> 📚 [[JavaScript - 09. Promise]] · [Promises/A+](https://promisesaplus.com/) · [MDN: Using microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)

> [!interview] Чому React порівнює дітей за індексом і навіщо потрібні `key`?
> level: senior · frequency: дуже часто · id: jsk-08-int-02
>
> ---
>
> Загальний алгоритм мінімального diff дерев — O(n³), неприйнятно для UI. React використовує дві евристики: різний тип елемента → заміна всього піддерева; діти одного батька порівнюються за позицією, якщо немає `key`. Звідси проблема: вставка на початок списку зсуває всі індекси, і React «оновлює» кожен елемент замість однієї вставки — плюс губиться локальний стан (input, фокус). `key` дає стабільну ідентичність: React зіставляє старих і нових дітей за ключем і лише переміщує вузли. Ключ-індекс повертає ту саму проблему при перестановках.
>
> 📚 [[JavaScript - 25. DOM і події]] · [React (legacy): Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html) · [React: Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)

> [!interview] Чим fine-grained реактивність (signals) відрізняється від моделі React?
> level: senior · frequency: часто · id: jsk-08-int-03
>
> ---
>
> У React зміна стану перезапускає функцію компонента і diff-ить віртуальне дерево; оптимізації (`memo`, `useMemo`) — ручні. Signals відстежують залежності автоматично під час читання: зміна сигналу оновлює **лише** ті computed/ефекти (і DOM-вузли), що його прочитали — без ререндеру компонента. Плюси: точкові оновлення, немає масивів залежностей. Мінуси й тонкощі: diamond problem (потрібні фази dirty/run і `batch`), життєвий цикл ефектів, налагодження неявних залежностей. Signals є в Solid, Preact, Vue (ref), Angular, і є TC39-пропозиція.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [TC39: Signals proposal](https://github.com/tc39/proposal-signals) · [Preact: Signals](https://preactjs.com/guide/v10/signals/)

## ⚡ Фішки

> [!reel] 🧟 Zalgo — синхронно-асинхронний колбек
> API, що інколи викликає колбек одразу, а інколи пізніше, — «випущений Zalgo». Проміси захищають від нього: `then` завжди асинхронний.

> [!reel] 🕳️ JSON.stringify і дірки
> У масиві дірка, `undefined` і функція стають `null`, а в об'єкті такі властивості просто зникають.
>
> ```js
> JSON.stringify([1, , undefined]) // → "[1,null,null]"
> JSON.stringify({ a: undefined }) // → "{}"
> ```

> [!reel] 🚦 scheduler.postTask — пріоритети в браузері
> `scheduler.postTask(fn, { priority: 'background' })` — нативний планувальник з трьома пріоритетами і скасуванням через `TaskController`.

## 🧠 Закріплення

> [!question]- Чому шаблонізатор має екранувати HTML за замовчуванням?
> *часто · безпека* · `jsk-08-001`
>
> Дані користувача в розмітці без екранування — це XSS: `<img onerror=…>` виконає код. Безпечний дефолт (`{{ }}`) екранує `& < > " '`, а сирий вивід (`{{{ }}}`) — явне рішення автора для довіреного HTML.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript]] · [OWASP: Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/)

> [!question]- Як `JSON.stringify` відрізняє цикл від спільного посилання?
> *іноді · теорія* · `jsk-08-002`
>
> Перевіряє лише **стек предків** поточного шляху: якщо значення вже є серед батьків — цикл, `TypeError`. Той самий об'єкт у двох різних гілках — не цикл, він просто серіалізується двічі.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація]] · [MDN: JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

> [!question]- Що означає «засвоєння thenable» у промісах?
> *часто · теорія* · `jsk-08-003`
>
> Якщо проміс резолвиться об'єктом з методом `then`, він не стає значенням, а «підписується» на нього: викликає `then(resolve, reject)` і переймає стан. Так проміси різних бібліотек сумісні між собою, а `await` працює з будь-яким thenable.
>
> 📚 [[JavaScript - 09. Promise]] · [Promises/A+](https://promisesaplus.com/)

> [!question]- Яка складність diff віртуального DOM у React і завдяки чому?
> *часто · теорія* · `jsk-08-004`
>
> O(n) замість O(n³) завдяки евристикам: різний тип → заміна піддерева без порівняння; діти порівнюються за позицією або за `key`. Евристики іноді дають неоптимальні оновлення, але на практиці працюють.
>
> 📚 [[JavaScript - 25. DOM і події]] · [React (legacy): Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html)

> [!question]- Що робить `signal.reason` і що буде, якщо викликати `abort()` без аргументу?
> *іноді · теорія* · `jsk-08-005`
>
> `reason` — причина скасування, яку зручно використати як помилку для `reject`. Без аргументу це `DOMException` з `name === 'AbortError'`; `abort(new Error('…'))` задає власну причину. `AbortSignal.timeout(ms)` дає `TimeoutError`.
>
> 📚 [[JavaScript - 10. async і await]] · [MDN: AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

> [!question]- Навіщо планувальнику мікрозадача перед стартом першої задачі?
> *рідко · код* · `jsk-08-006`
>
> Щоб задачі, додані синхронно одна за одною, встигли потрапити в чергу до вибору першої. Інакше перша додана стартувала б одразу, навіть якщо наступним рядком додали важливішу.
>
> 📚 [[JavaScript - 08. Event Loop]] · [MDN: queueMicrotask()](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask)

> [!question]- Що таке diamond problem у реактивності?
> *іноді · теорія* · `jsk-08-007`
>
> Ефект залежить від `a` і від `computed(a)`. При зміні `a` наївна push-модель може запустити ефект двічі: спершу з новим `a` і старим computed (глітч), потім ще раз. Розв'язок — двофазне оновлення: спершу позначити все залежне як dirty, потім виконати ефекти один раз у топологічному порядку.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [TC39: Signals proposal](https://github.com/tc39/proposal-signals)

## 📚 Джерела та що почитати

- 🔴 [Promises/A+](https://promisesaplus.com/) — специфікація, яку перевіряє твій `MyPromise`
- 🟡 [MDN — JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) — усі правила серіалізації
- 🟡 [React (legacy) — Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html) — евристики diff і роль `key`
- 🟡 [MDN — Scheduler.postTask()](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/postTask) — нативні пріоритети задач
- 🟡 [MDN — AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) — `abort`, `timeout`, `any`, `reason`
- 🟡 [mustache(5)](https://mustache.github.io/mustache.5.html) — синтаксис `{{ }}` і `{{{ }}}`, з якого взято ідею шаблонізатора
- 🔴 [TC39 — Signals proposal](https://github.com/tc39/proposal-signals) — як сигнали можуть стати стандартом
- 🛠️ [GreatFrontEnd — JSON.stringify](https://www.greatfrontend.com/questions/javascript/json-stringify) і [Template Engine](https://www.greatfrontend.com/questions/javascript/textual-template)
- 🛠️ [BFE.dev — implement Promise.prototype.finally()](https://bigfrontend.dev/problem/implement-Promise-prototype-finally) і [implement JSON.stringify()](https://bigfrontend.dev/problem/implement-JSON-stringify)

> [!important] Підсумок
> - Хардкор-задача = чіткий API + стан + інваріанти; щасливий шлях спершу, краї — по одному.
> - Розсилки (обробники, підписники, слухачі) ітеруй по знімку.
> - Promise: стан змінюється раз, `then` завжди асинхронний, thenable засвоюється.
> - Скасування — `AbortSignal`: перевір на вході, вирізай з черги, відхиляй з `signal.reason`, чисти слухачів.
> - Реактивність: `currentObserver` + `Set` підписників + перепідписка на кожен запуск.
