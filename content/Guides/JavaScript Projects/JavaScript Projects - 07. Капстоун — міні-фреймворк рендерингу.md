---
title: "Капстоун: міні-фреймворк рендерингу"
order: 7
level: senior
tags: [virtual-dom, diff, reconciliation, keys, capstone]
prerequisites:
  - "[[JavaScript - 25. DOM і події]]"
  - "[[JavaScript - 26. Як браузер рендерить сторінку]]"
  - "[[JavaScript - 30. Безпека в JavaScript]]"
estimatedMinutes: 150
id: jsp-ch-07
icon: "🏗️"
---

# JavaScript Projects - 07. Капстоун: міні-фреймворк рендерингу

> [!success] 🎯 Після цього розділу ти зможеш
> - Описати UI **віртуальними вузлами** через `h()` (саме в це компілюється JSX).
> - Безпечно рендерити дерево в HTML-рядок з екрануванням — як SSR.
> - Написати **diff**, що порівнює два дерева і повертає **список операцій** — чисту функцію без DOM.
> - Реалізувати **keyed-реконсиляцію**: переставити елементи списку замість перестворення.
> - Зібрати застосунок в архітектурі Elm (`init` / `update` / `view`) і підключити його до справжнього DOM через тонкий «хост».

## 🎯 Що збудуємо

Мініатюрний React/Preact: компоненти-функції, віртуальний DOM, diff з ключами і рендер у будь-яке середовище. Головне архітектурне рішення — **diff не торкається DOM**. Він повертає масив операцій, а виконує їх «хост»: у тестах — звичайні об'єкти, у браузері — DOM, у React Native — нативні view.

```text
   state ──▶ view(state) ──▶ h('ul', null, items.map(i => h(Item, { key: i.id, ... })))
                                   │
                                   ▼ expand: компоненти-функції → елементи
                          нове віртуальне дерево
                                   │
     попереднє дерево ──▶  diff(old, new)  ── чиста функція, без DOM
                                   │
                                   ▼
          [ { op: 'text',  path: [0, 2, 0], value: '3' },
            { op: 'move',  path: [1], from: 3, to: 0 },
            { op: 'create', path: [1, 4], node: … } ]
                                   │
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼
   applyOps(toTree(…), ops)                  DOM-хост: insertBefore,
   (тести: звичайні об'єкти)                 removeChild, nodeValue…
               │
               ▼
   властивість: applyOps(toTree(old), diff(old, new)) ≡ toTree(new)
```

Остання рядок — **головний тест розділу**: застосувати операції до старого дерева = отримати нове. Якщо це тримається для будь-якої пари дерев, diff коректний.

## 🧭 План кроків

1. `h()` — віртуальні вузли, нормалізація дітей, `key`.
2. `renderToString` — SSR з екрануванням. Теорія: [[JavaScript - 30. Безпека в JavaScript]].
3. `diffProps` — зміни атрибутів.
4. `toTree` + `applyOps` — «хост» на звичайних об'єктах. Теорія: [[JavaScript - 25. DOM і події]].
5. `diff` — порівняння дерев за індексами.
6. Keyed-діти — переміщення замість перестворення. Теорія: [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]].
7. Компоненти + `createApp` у стилі Elm. Теорія: [[JavaScript - 26. Як браузер рендерить сторінку]], [[JavaScript - 32. Патерни проєктування]].

## 🧩 Розминка

> [!quiz] Заповни пропуски на початку diff
> level: senior · type: fill · id: jsp-07-quiz-01 · bank: create, children
>
> ```js fill
> function diff(oldNode, newNode, path = []) {
>   if (oldNode === newNode) return []
>   if (oldNode.type !== newNode.type || oldNode.key !== newNode.key) {
>     return [{ op: '[[replace]]', path, node: newNode }]
>   }
>   if (newNode.type === TEXT) {
>     return oldNode.text === newNode.text ? [] : [{ op: '[[text]]', path, value: newNode.text }]
>   }
>   const ops = []
>   const props = diffProps(oldNode.props, newNode.[[props]])
>   if (props) ops.push({ op: 'props', path, ...props })
>   ops.push(...diffChildren(oldNode.children, newNode.children, [[path]]))
>   return ops
> }
> ```
>
> **Пояснення:** різний тип (або ключ) — не намагаємось «латати» `<div>` у `<span>`, а замінюємо піддерево цілком. Це евристика React: вона робить diff лінійним замість кубічного.

> [!quiz] Склади diff дітей за індексами
> level: senior · type: order · id: jsp-07-quiz-02
>
> ```js order
> const common = Math.min(oldChildren.length, newChildren.length)
> for (let i = 0; i < common; i++) ops.push(...diff(oldChildren[i], newChildren[i], [...path, i]))
> for (let i = common; i < newChildren.length; i++) ops.push({ op: 'create', path: [...path, i], node: newChildren[i] })
> for (let i = oldChildren.length - 1; i >= common; i--) ops.push({ op: 'remove', path: [...path, i] })
> for (let i = common; i < oldChildren.length; i++) ops.push({ op: 'remove', path: [...path, i] }) // ✗
> ```
>
> **Пояснення:** зайві старі діти видаляємо **з кінця**: після видалення елемента з індексом 3 колишній 4-й стає 3-м, і операція «видали 4» влучила б не туди.

## 🛠️ Крок 1. h() — віртуальні вузли

JSX `<li key={id} className="done">{title}</li>` компілюється у `h('li', { key: id, className: 'done' }, title)`. Віртуальний вузол — простий об'єкт. Діти **нормалізуються** одразу: масиви (від `map`) розплющуються, `null`/`false`/`true` зникають (так працює `{cond && <X/>}`), рядки й числа стають текстовими вузлами. `key` — не атрибут, а підказка для diff, тож живе окремо.

> [!task] Крок 1 · h і текстові вузли
> level: middle · difficulty: medium · id: jsp-07-task-01 · tags: virtual-dom, normalization
>
> Напиши:
>
> - `const TEXT = '#text'`;
> - `text(value)` → `{ type: TEXT, key: null, text: String(value) }`;
> - `h(type, props, ...children)` → `{ type, key, props, children }`:
>   - `key` береться з `props.key` (або `null`) і **не** потрапляє в `props`; `props` може бути `null`; вхідний об'єкт `props` не мутується;
>   - `children`: розплющити вкладені масиви будь-якої глибини; `null`, `undefined`, `true`, `false` — прибрати; рядки й числа (включно з `0`) — `text(…)`; об'єкти-вузли — як є.
>
> ```js starter
> const TEXT = '#text'
>
> function text(value) {
>   // твій код
> }
>
> function h(type, props, ...children) {
>   // твій код
> }
> ```
>
> ```js tests
> test('елемент з текстом', () => {
>   expect(h('div', { id: 'app' }, 'Привіт')).toEqual({
>     type: 'div',
>     key: null,
>     props: { id: 'app' },
>     children: [{ type: '#text', key: null, text: 'Привіт' }],
>   })
> })
>
> test('props: null і key окремо від props', () => {
>   expect(h('br', null)).toEqual({ type: 'br', key: null, props: {}, children: [] })
>   const props = { key: 7, className: 'item' }
>   const node = h('li', props)
>   expect(node.key).toBe(7)
>   expect(node.props).toEqual({ className: 'item' })
>   expect(props).toEqual({ key: 7, className: 'item' })
> })
>
> test('масиви розплющуються, порожні значення зникають', () => {
>   const items = ['a', 'b']
>   const node = h('ul', null, items.map((x) => h('li', null, x)), null, false, [[true, undefined]])
>   expect(node.children.map((c) => c.type)).toEqual(['li', 'li'])
> })
>
> test('числа (і 0) стають текстом', () => {
>   const node = h('p', null, 0, ' / ', 42)
>   expect(node.children.map((c) => c.text)).toEqual(['0', ' / ', '42'])
> })
>
> test('вузли-діти зберігаються як є', () => {
>   const child = h('span', null, 'x')
>   expect(h('div', null, child).children[0]).toBe(child)
> })
> ```
>
> > [!hint]- Підказка 1
> > `const { key = null, ...rest } = props ?? {}` — деструктуризація з rest одразу дає копію без `key` і не мутує вхідний об'єкт.
>
> > [!hint]- Підказка 2
> > `children.flat(Infinity)`, далі цикл: пропусти `null`/`undefined`/`typeof === 'boolean'`, для `typeof child === 'object'` — як є, інакше `text(child)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const TEXT = '#text'
> >
> > function text(value) {
> >   return { type: TEXT, key: null, text: String(value) }
> > }
> >
> > function h(type, props, ...children) {
> >   const { key = null, ...rest } = props ?? {}
> >   const normalized = []
> >   for (const child of children.flat(Infinity)) {
> >     if (child === null || child === undefined || typeof child === 'boolean') continue
> >     normalized.push(typeof child === 'object' ? child : text(child))
> >   }
> >   return { type, key, props: rest, children: normalized }
> > }
> > ```
> > **Чому так:** нормалізація **на вході** робить усі наступні функції простішими: diff і рендер знають лише два види вузлів — елемент і текст, без перевірок на `null` і масиви. Відкидання булевих значень дає ідіому `{loggedIn && h(Menu)}`. `0` — валідний текст (класичний React-баг `{items.length && …}` показує саме «0»). `key` поза `props`, бо це метадані для реконсиляції, а не атрибут DOM.

## 🛠️ Крок 2. renderToString — SSR з екрануванням

Перше застосування дерева — HTML-рядок для сервера. Кожен текст і значення атрибута **екрануємо**: ім'я користувача `<img src=x onerror=…>` має з'явитися як текст, а не як тег. Обробники подій (`onClick`) у HTML не потрапляють — їх «підключає» клієнт.

> [!task] Крок 2 · escapeHtml і renderToString
> level: middle · difficulty: medium · id: jsp-07-task-02 · tags: ssr, security, recursion
>
> Додай:
>
> - `escapeHtml(value)` — замінює `& < > " '` на `&amp; &lt; &gt; &quot; &#39;`;
> - `VOID_TAGS` — `Set` з `br hr img input meta link`;
> - `renderToString(vnode)`:
>   - текст — екранований;
>   - атрибути в порядку `props`: `className` → `class`; `true` → атрибут без значення (` disabled`); `false`, `null`, `undefined` — пропустити; імена `on` + велика літера (`onClick`) — пропустити; решта — ` name="екрановане"`;
>   - void-теги — без закривного тегу і дітей.
>
> ```js starter
> const TEXT = '#text'
>
> function text(value) {
>   return { type: TEXT, key: null, text: String(value) }
> }
>
> function h(type, props, ...children) {
>   const { key = null, ...rest } = props ?? {}
>   const normalized = []
>   for (const child of children.flat(Infinity)) {
>     if (child === null || child === undefined || typeof child === 'boolean') continue
>     normalized.push(typeof child === 'object' ? child : text(child))
>   }
>   return { type, key, props: rest, children: normalized }
> }
>
> function escapeHtml(value) {
>   // твій код
> }
>
> const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])
>
> function renderToString(vnode) {
>   // твій код
> }
> ```
>
> ```js tests
> test('вкладені елементи', () => {
>   const tree = h('ul', { className: 'list' }, h('li', null, 'a'), h('li', null, 'b'))
>   expect(renderToString(tree)).toBe('<ul class="list"><li>a</li><li>b</li></ul>')
> })
>
> test('екранування тексту й атрибутів (XSS)', () => {
>   const evil = '<img src=x onerror="alert(1)">'
>   expect(renderToString(h('p', { title: evil }, evil))).toBe(
>     '<p title="&lt;img src=x onerror=&quot;alert(1)&quot;&gt;">&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</p>',
>   )
>   expect(escapeHtml(`Tom & Jerry's`)).toBe('Tom &amp; Jerry&#39;s')
> })
>
> test('булеві атрибути', () => {
>   expect(renderToString(h('button', { disabled: true, hidden: false, title: null }, 'OK'))).toBe('<button disabled>OK</button>')
> })
>
> test('void-теги', () => {
>   expect(renderToString(h('p', null, 'a', h('br', null), 'b'))).toBe('<p>a<br>b</p>')
>   expect(renderToString(h('input', { value: 'x', type: 'text' }))).toBe('<input value="x" type="text">')
> })
>
> test('обробники подій не потрапляють у HTML', () => {
>   expect(renderToString(h('button', { onClick: () => {}, type: 'button' }, 'Тисни'))).toBe('<button type="button">Тисни</button>')
> })
> ```
>
> > [!hint]- Підказка 1
> > `String(value).replace(/&/g, '&amp;')` — **першим**, інакше подвійне екранування: `&lt;` стане `&amp;lt;`.
>
> > [!hint]- Підказка 2
> > Атрибути збирай у рядок у циклі `for (const [name, value] of Object.entries(vnode.props))`; перевірка обробника — `/^on[A-Z]/.test(name)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const TEXT = '#text'
> >
> > function text(value) {
> >   return { type: TEXT, key: null, text: String(value) }
> > }
> >
> > function h(type, props, ...children) {
> >   const { key = null, ...rest } = props ?? {}
> >   const normalized = []
> >   for (const child of children.flat(Infinity)) {
> >     if (child === null || child === undefined || typeof child === 'boolean') continue
> >     normalized.push(typeof child === 'object' ? child : text(child))
> >   }
> >   return { type, key, props: rest, children: normalized }
> > }
> >
> > function escapeHtml(value) {
> >   return String(value)
> >     .replace(/&/g, '&amp;')
> >     .replace(/</g, '&lt;')
> >     .replace(/>/g, '&gt;')
> >     .replace(/"/g, '&quot;')
> >     .replace(/'/g, '&#39;')
> > }
> >
> > const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])
> >
> > function renderToString(vnode) {
> >   if (vnode.type === TEXT) return escapeHtml(vnode.text)
> >   let attrs = ''
> >   for (const [name, value] of Object.entries(vnode.props)) {
> >     if (/^on[A-Z]/.test(name) || value === false || value === null || value === undefined) continue
> >     const attr = name === 'className' ? 'class' : name
> >     attrs += value === true ? ` ${attr}` : ` ${attr}="${escapeHtml(value)}"`
> >   }
> >   if (VOID_TAGS.has(vnode.type)) return `<${vnode.type}${attrs}>`
> >   return `<${vnode.type}${attrs}>${vnode.children.map(renderToString).join('')}</${vnode.type}>`
> > }
> > ```
> > **Чому так:** екранування за замовчуванням — причина, чому React-застосунки рідко мають XSS: розробник мусить **явно** попросити небезпечне (`dangerouslySetInnerHTML`). `&` замінюється першим, щоб не зіпсувати вже вставлені сутності. Віртуальне дерево — незалежне від середовища представлення: той самий `h()` дає HTML на сервері й DOM у браузері (гідратація).

## 🛠️ Крок 3. diffProps

Найменший будівельний блок diff: що змінилось в атрибутах. Порівнюємо за `Object.is` — тому новий обробник `() => …` на кожному рендері є зміною (знайома проблема React, яку лікують `useCallback`).

> [!task] Крок 3 · diffProps
> level: middle · difficulty: easy · id: jsp-07-task-03 · tags: diff, objects
>
> Додай `diffProps(oldProps, newProps)`:
>
> - `set` — об'єкт нових або змінених (`!Object.is`) властивостей;
> - `remove` — масив імен, що були у старих, але немає (власного ключа) в нових;
> - нічого не змінилось → `null`, інакше `{ set, remove }`.
>
> ```js starter
> const TEXT = '#text'
>
> function text(value) {
>   return { type: TEXT, key: null, text: String(value) }
> }
>
> function h(type, props, ...children) {
>   const { key = null, ...rest } = props ?? {}
>   const normalized = []
>   for (const child of children.flat(Infinity)) {
>     if (child === null || child === undefined || typeof child === 'boolean') continue
>     normalized.push(typeof child === 'object' ? child : text(child))
>   }
>   return { type, key, props: rest, children: normalized }
> }
>
> function escapeHtml(value) {
>   return String(value)
>     .replace(/&/g, '&amp;')
>     .replace(/</g, '&lt;')
>     .replace(/>/g, '&gt;')
>     .replace(/"/g, '&quot;')
>     .replace(/'/g, '&#39;')
> }
>
> const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])
>
> function renderToString(vnode) {
>   if (vnode.type === TEXT) return escapeHtml(vnode.text)
>   let attrs = ''
>   for (const [name, value] of Object.entries(vnode.props)) {
>     if (/^on[A-Z]/.test(name) || value === false || value === null || value === undefined) continue
>     const attr = name === 'className' ? 'class' : name
>     attrs += value === true ? ` ${attr}` : ` ${attr}="${escapeHtml(value)}"`
>   }
>   if (VOID_TAGS.has(vnode.type)) return `<${vnode.type}${attrs}>`
>   return `<${vnode.type}${attrs}>${vnode.children.map(renderToString).join('')}</${vnode.type}>`
> }
>
> function diffProps(oldProps, newProps) {
>   // твій код
> }
> ```
>
> ```js tests
> test('додані, змінені й видалені', () => {
>   expect(diffProps({ id: 'a', title: 'x', hidden: true }, { id: 'a', title: 'y', className: 'c' })).toEqual({
>     set: { title: 'y', className: 'c' },
>     remove: ['hidden'],
>   })
> })
>
> test('без змін — null', () => {
>   expect(diffProps({ a: 1 }, { a: 1 })).toBeNull()
>   expect(diffProps({}, {})).toBeNull()
> })
>
> test('обробники порівнюються за посиланням', () => {
>   const handler = () => {}
>   expect(diffProps({ onClick: handler }, { onClick: handler })).toBeNull()
>   expect(diffProps({ onClick: handler }, { onClick: () => {} })).not.toBeNull()
> })
>
> test('NaN дорівнює NaN', () => {
>   expect(diffProps({ value: NaN }, { value: NaN })).toBeNull()
> })
>
> test('лише видалення', () => {
>   expect(diffProps({ a: 1, b: 2 }, {})).toEqual({ set: {}, remove: ['a', 'b'] })
> })
> ```
>
> > [!hint]- Підказка 1
> > Два проходи: по `Object.entries(newProps)` (що поставити) і по `Object.keys(oldProps)` (що прибрати, перевіряючи `Object.hasOwn(newProps, name)`).
>
> > [!solution]- Еталонне рішення
> > ```js
> > const TEXT = '#text'
> >
> > function text(value) {
> >   return { type: TEXT, key: null, text: String(value) }
> > }
> >
> > function h(type, props, ...children) {
> >   const { key = null, ...rest } = props ?? {}
> >   const normalized = []
> >   for (const child of children.flat(Infinity)) {
> >     if (child === null || child === undefined || typeof child === 'boolean') continue
> >     normalized.push(typeof child === 'object' ? child : text(child))
> >   }
> >   return { type, key, props: rest, children: normalized }
> > }
> >
> > function escapeHtml(value) {
> >   return String(value)
> >     .replace(/&/g, '&amp;')
> >     .replace(/</g, '&lt;')
> >     .replace(/>/g, '&gt;')
> >     .replace(/"/g, '&quot;')
> >     .replace(/'/g, '&#39;')
> > }
> >
> > const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])
> >
> > function renderToString(vnode) {
> >   if (vnode.type === TEXT) return escapeHtml(vnode.text)
> >   let attrs = ''
> >   for (const [name, value] of Object.entries(vnode.props)) {
> >     if (/^on[A-Z]/.test(name) || value === false || value === null || value === undefined) continue
> >     const attr = name === 'className' ? 'class' : name
> >     attrs += value === true ? ` ${attr}` : ` ${attr}="${escapeHtml(value)}"`
> >   }
> >   if (VOID_TAGS.has(vnode.type)) return `<${vnode.type}${attrs}>`
> >   return `<${vnode.type}${attrs}>${vnode.children.map(renderToString).join('')}</${vnode.type}>`
> > }
> >
> > function diffProps(oldProps, newProps) {
> >   const set = {}
> >   const remove = []
> >   for (const [name, value] of Object.entries(newProps)) {
> >     if (!Object.is(oldProps[name], value)) set[name] = value
> >   }
> >   for (const name of Object.keys(oldProps)) {
> >     if (!Object.hasOwn(newProps, name)) remove.push(name)
> >   }
> >   return Object.keys(set).length > 0 || remove.length > 0 ? { set, remove } : null
> > }
> > ```
> > **Чому так:** `null` для «нічого» дає змогу diff не створювати порожні операції — хост не робить зайвої роботи. `Object.is` — та сама рівність, що в сигналах і `useState`. Видалення — окремий список, бо «прибрати атрибут» і «поставити `undefined`» у DOM різні операції (`removeAttribute` проти `el.title = 'undefined'`).

## 🛠️ Крок 4. Хост на звичайних об'єктах

Перш ніж писати diff, визначимо, **що** він повертає. Операції адресують вузли шляхом — масивом індексів від кореня: `[1, 0]` — перша дитина другої дитини кореня. `toTree` перетворює віртуальне дерево на «хост-дерево» (у браузері це був би DOM), а `applyOps` виконує операції над ним **послідовно**: кожна операція бачить результат попередніх.

> [!task] Крок 4 · toTree і applyOps
> level: senior · difficulty: medium · id: jsp-07-task-04 · tags: tree, paths, host
>
> Додай:
>
> - `toTree(vnode)` — глибока копія без `key`: текст → `{ type: TEXT, text }`, елемент → `{ type, props: { ...props }, children: [...] }`;
> - `nodeAt(root, path)` — вузол за шляхом; немає вузла → `Error('Немає вузла за шляхом <path через крапку>')`;
> - `applyOps(root, ops)` — виконує по черзі й **повертає корінь** (дерево мутується на місці, як DOM). Операції:
>   - `{ op: 'create', path, node }` — вставити `toTree(node)` у батька `path.slice(0, -1)` на позицію `path.at(-1)`;
>   - `{ op: 'remove', path }` — видалити дитину за останнім індексом;
>   - `{ op: 'replace', path, node }` — замінити вузол; `path` порожній → новий корінь;
>   - `{ op: 'text', path, value }` — новий текст текстового вузла;
>   - `{ op: 'props', path, set, remove }` — видалити `remove`, потім присвоїти `set`;
>   - `{ op: 'move', path, from, to }` — у вузлі за `path` перемістити дитину з `from` на `to` (як `splice` вийняти і вставити);
>   - невідома → `Error('Невідома операція: <op>')`.
>
> ```js starter
> const TEXT = '#text'
>
> function text(value) {
>   return { type: TEXT, key: null, text: String(value) }
> }
>
> function h(type, props, ...children) {
>   const { key = null, ...rest } = props ?? {}
>   const normalized = []
>   for (const child of children.flat(Infinity)) {
>     if (child === null || child === undefined || typeof child === 'boolean') continue
>     normalized.push(typeof child === 'object' ? child : text(child))
>   }
>   return { type, key, props: rest, children: normalized }
> }
>
> function escapeHtml(value) {
>   return String(value)
>     .replace(/&/g, '&amp;')
>     .replace(/</g, '&lt;')
>     .replace(/>/g, '&gt;')
>     .replace(/"/g, '&quot;')
>     .replace(/'/g, '&#39;')
> }
>
> const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])
>
> function renderToString(vnode) {
>   if (vnode.type === TEXT) return escapeHtml(vnode.text)
>   let attrs = ''
>   for (const [name, value] of Object.entries(vnode.props)) {
>     if (/^on[A-Z]/.test(name) || value === false || value === null || value === undefined) continue
>     const attr = name === 'className' ? 'class' : name
>     attrs += value === true ? ` ${attr}` : ` ${attr}="${escapeHtml(value)}"`
>   }
>   if (VOID_TAGS.has(vnode.type)) return `<${vnode.type}${attrs}>`
>   return `<${vnode.type}${attrs}>${vnode.children.map(renderToString).join('')}</${vnode.type}>`
> }
>
> function diffProps(oldProps, newProps) {
>   const set = {}
>   const remove = []
>   for (const [name, value] of Object.entries(newProps)) {
>     if (!Object.is(oldProps[name], value)) set[name] = value
>   }
>   for (const name of Object.keys(oldProps)) {
>     if (!Object.hasOwn(newProps, name)) remove.push(name)
>   }
>   return Object.keys(set).length > 0 || remove.length > 0 ? { set, remove } : null
> }
>
> function toTree(vnode) {
>   // твій код
> }
>
> function nodeAt(root, path) {
>   // твій код
> }
>
> function applyOps(root, ops) {
>   // твій код
> }
> ```
>
> ```js tests
> const list = () => toTree(h('ul', { id: 'l' }, h('li', { key: 'a' }, 'A'), h('li', { key: 'b' }, 'B')))
>
> test('toTree — копія без key', () => {
>   expect(toTree(h('p', { key: 1, title: 't' }, 'x'))).toEqual({ type: 'p', props: { title: 't' }, children: [{ type: '#text', text: 'x' }] })
> })
>
> test('create, remove, text', () => {
>   const tree = list()
>   applyOps(tree, [
>     { op: 'create', path: [1], node: h('li', null, 'між') },
>     { op: 'remove', path: [0] },
>     { op: 'text', path: [1, 0], value: 'B!' },
>   ])
>   expect(tree.children.map((li) => li.children[0].text)).toEqual(['між', 'B!'])
> })
>
> test('props і move', () => {
>   const tree = list()
>   applyOps(tree, [
>     { op: 'props', path: [], set: { className: 'x' }, remove: ['id'] },
>     { op: 'move', path: [], from: 1, to: 0 },
>   ])
>   expect(tree.props).toEqual({ className: 'x' })
>   expect(tree.children.map((li) => li.children[0].text)).toEqual(['B', 'A'])
> })
>
> test('replace вузла і кореня', () => {
>   const tree = list()
>   applyOps(tree, [{ op: 'replace', path: [0], node: h('li', null, 'нове') }])
>   expect(tree.children[0].children[0].text).toBe('нове')
>   const root = applyOps(tree, [{ op: 'replace', path: [], node: h('p', null) }])
>   expect(root).toEqual({ type: 'p', props: {}, children: [] })
>   expect(applyOps(null, [{ op: 'replace', path: [], node: h('b', null) }]).type).toBe('b')
> })
>
> test('помилки', () => {
>   expect(() => applyOps(list(), [{ op: 'text', path: [5, 0], value: '?' }])).toThrow('Немає вузла за шляхом 5.0')
>   expect(() => applyOps(list(), [{ op: 'teleport', path: [] }])).toThrow('Невідома операція: teleport')
> })
> ```
>
> > [!hint]- Підказка 1
> > `nodeAt`: `let node = root; for (const i of path) { node = node?.children?.[i]; if (!node) throw … }`.
>
> > [!hint]- Підказка 2
> > У `applyOps` для кожної операції порахуй `parentPath = op.path.slice(0, -1)` і `index = op.path.at(-1)`, далі — `switch (op.op)`. Корінь тримай у змінній `root` і повертай наприкінці: `replace` з порожнім шляхом її перезаписує.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const TEXT = '#text'
> >
> > function text(value) {
> >   return { type: TEXT, key: null, text: String(value) }
> > }
> >
> > function h(type, props, ...children) {
> >   const { key = null, ...rest } = props ?? {}
> >   const normalized = []
> >   for (const child of children.flat(Infinity)) {
> >     if (child === null || child === undefined || typeof child === 'boolean') continue
> >     normalized.push(typeof child === 'object' ? child : text(child))
> >   }
> >   return { type, key, props: rest, children: normalized }
> > }
> >
> > function escapeHtml(value) {
> >   return String(value)
> >     .replace(/&/g, '&amp;')
> >     .replace(/</g, '&lt;')
> >     .replace(/>/g, '&gt;')
> >     .replace(/"/g, '&quot;')
> >     .replace(/'/g, '&#39;')
> > }
> >
> > const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])
> >
> > function renderToString(vnode) {
> >   if (vnode.type === TEXT) return escapeHtml(vnode.text)
> >   let attrs = ''
> >   for (const [name, value] of Object.entries(vnode.props)) {
> >     if (/^on[A-Z]/.test(name) || value === false || value === null || value === undefined) continue
> >     const attr = name === 'className' ? 'class' : name
> >     attrs += value === true ? ` ${attr}` : ` ${attr}="${escapeHtml(value)}"`
> >   }
> >   if (VOID_TAGS.has(vnode.type)) return `<${vnode.type}${attrs}>`
> >   return `<${vnode.type}${attrs}>${vnode.children.map(renderToString).join('')}</${vnode.type}>`
> > }
> >
> > function diffProps(oldProps, newProps) {
> >   const set = {}
> >   const remove = []
> >   for (const [name, value] of Object.entries(newProps)) {
> >     if (!Object.is(oldProps[name], value)) set[name] = value
> >   }
> >   for (const name of Object.keys(oldProps)) {
> >     if (!Object.hasOwn(newProps, name)) remove.push(name)
> >   }
> >   return Object.keys(set).length > 0 || remove.length > 0 ? { set, remove } : null
> > }
> >
> > function toTree(vnode) {
> >   if (vnode.type === TEXT) return { type: TEXT, text: vnode.text }
> >   return { type: vnode.type, props: { ...vnode.props }, children: vnode.children.map(toTree) }
> > }
> >
> > function nodeAt(root, path) {
> >   let node = root
> >   for (const i of path) {
> >     node = node?.children?.[i]
> >     if (!node) throw new Error(`Немає вузла за шляхом ${path.join('.')}`)
> >   }
> >   return node
> > }
> >
> > function applyOps(root, ops) {
> >   for (const op of ops) {
> >     const parentPath = op.path.slice(0, -1)
> >     const index = op.path.at(-1)
> >     switch (op.op) {
> >       case 'create':
> >         nodeAt(root, parentPath).children.splice(index, 0, toTree(op.node))
> >         break
> >       case 'remove':
> >         nodeAt(root, parentPath).children.splice(index, 1)
> >         break
> >       case 'replace':
> >         if (op.path.length === 0) root = toTree(op.node)
> >         else nodeAt(root, parentPath).children[index] = toTree(op.node)
> >         break
> >       case 'text':
> >         nodeAt(root, op.path).text = op.value
> >         break
> >       case 'props': {
> >         const node = nodeAt(root, op.path)
> >         for (const name of op.remove) delete node.props[name]
> >         Object.assign(node.props, op.set)
> >         break
> >       }
> >       case 'move': {
> >         const children = nodeAt(root, op.path).children
> >         const [moved] = children.splice(op.from, 1)
> >         children.splice(op.to, 0, moved)
> >         break
> >       }
> >       default:
> >         throw new Error(`Невідома операція: ${op.op}`)
> >     }
> >   }
> >   return root
> > }
> > ```
> > **Чому так:** операції — **контракт** між diff і середовищем. Хост на звичайних об'єктах — повноцінна реалізація цього контракту, тож коректність diff можна перевіряти без браузера. Кожна операція відповідає одному DOM-виклику (`insertBefore`, `removeChild`, `nodeValue`, `setAttribute`), а послідовна семантика (кожна бачить результат попередніх) збігається з тим, як працює справжній DOM. Так влаштовані кастомні рендерери React (`react-reconciler`): один алгоритм — багато хостів.

## 🛠️ Крок 5. diff за індексами

Повне порівняння двох дерев — задача O(n³). React робить її за O(n) завдяки двом евристикам: **різний тип = нове піддерево** і **діти порівнюються попарно** (або за ключами — наступний крок). Алгоритм рекурсивний: для кожного вузла — порівняти тип, текст, атрибути, потім дітей.

> [!task] Крок 5 · diff і diffChildren
> level: senior · difficulty: hard · id: jsp-07-task-05 · tags: diff, recursion, reconciliation
>
> Додай:
>
> - `diff(oldNode, newNode, path = [])` → масив операцій:
>   - той самий об'єкт → `[]`;
>   - різні `type` або `key` → `[{ op: 'replace', path, node: newNode }]`;
>   - текст: різний `text` → `[{ op: 'text', path, value }]`;
>   - елемент: `{ op: 'props', path, set, remove }` (якщо `diffProps` не `null`), потім операції дітей;
> - `diffChildren(oldChildren, newChildren, path)`: спільна частина — рекурсивний `diff` з шляхом `[...path, i]`; нові зайві — `create` по зростанню індексу; старі зайві — `remove` **з кінця**.
>
> Властивість: `applyOps(toTree(a), diff(a, b))` дорівнює `toTree(b)`.
>
> ```js starter
> const TEXT = '#text'
>
> function text(value) {
>   return { type: TEXT, key: null, text: String(value) }
> }
>
> function h(type, props, ...children) {
>   const { key = null, ...rest } = props ?? {}
>   const normalized = []
>   for (const child of children.flat(Infinity)) {
>     if (child === null || child === undefined || typeof child === 'boolean') continue
>     normalized.push(typeof child === 'object' ? child : text(child))
>   }
>   return { type, key, props: rest, children: normalized }
> }
>
> function escapeHtml(value) {
>   return String(value)
>     .replace(/&/g, '&amp;')
>     .replace(/</g, '&lt;')
>     .replace(/>/g, '&gt;')
>     .replace(/"/g, '&quot;')
>     .replace(/'/g, '&#39;')
> }
>
> const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])
>
> function renderToString(vnode) {
>   if (vnode.type === TEXT) return escapeHtml(vnode.text)
>   let attrs = ''
>   for (const [name, value] of Object.entries(vnode.props)) {
>     if (/^on[A-Z]/.test(name) || value === false || value === null || value === undefined) continue
>     const attr = name === 'className' ? 'class' : name
>     attrs += value === true ? ` ${attr}` : ` ${attr}="${escapeHtml(value)}"`
>   }
>   if (VOID_TAGS.has(vnode.type)) return `<${vnode.type}${attrs}>`
>   return `<${vnode.type}${attrs}>${vnode.children.map(renderToString).join('')}</${vnode.type}>`
> }
>
> function diffProps(oldProps, newProps) {
>   const set = {}
>   const remove = []
>   for (const [name, value] of Object.entries(newProps)) {
>     if (!Object.is(oldProps[name], value)) set[name] = value
>   }
>   for (const name of Object.keys(oldProps)) {
>     if (!Object.hasOwn(newProps, name)) remove.push(name)
>   }
>   return Object.keys(set).length > 0 || remove.length > 0 ? { set, remove } : null
> }
>
> function toTree(vnode) {
>   if (vnode.type === TEXT) return { type: TEXT, text: vnode.text }
>   return { type: vnode.type, props: { ...vnode.props }, children: vnode.children.map(toTree) }
> }
>
> function nodeAt(root, path) {
>   let node = root
>   for (const i of path) {
>     node = node?.children?.[i]
>     if (!node) throw new Error(`Немає вузла за шляхом ${path.join('.')}`)
>   }
>   return node
> }
>
> function applyOps(root, ops) {
>   for (const op of ops) {
>     const parentPath = op.path.slice(0, -1)
>     const index = op.path.at(-1)
>     switch (op.op) {
>       case 'create':
>         nodeAt(root, parentPath).children.splice(index, 0, toTree(op.node))
>         break
>       case 'remove':
>         nodeAt(root, parentPath).children.splice(index, 1)
>         break
>       case 'replace':
>         if (op.path.length === 0) root = toTree(op.node)
>         else nodeAt(root, parentPath).children[index] = toTree(op.node)
>         break
>       case 'text':
>         nodeAt(root, op.path).text = op.value
>         break
>       case 'props': {
>         const node = nodeAt(root, op.path)
>         for (const name of op.remove) delete node.props[name]
>         Object.assign(node.props, op.set)
>         break
>       }
>       case 'move': {
>         const children = nodeAt(root, op.path).children
>         const [moved] = children.splice(op.from, 1)
>         children.splice(op.to, 0, moved)
>         break
>       }
>       default:
>         throw new Error(`Невідома операція: ${op.op}`)
>     }
>   }
>   return root
> }
>
> function diff(oldNode, newNode, path = []) {
>   // твій код
> }
>
> function diffChildren(oldChildren, newChildren, path) {
>   // твій код
> }
> ```
>
> ```js tests
> const same = (a, b) => expect(applyOps(toTree(a), diff(a, b))).toEqual(toTree(b))
>
> test('однакові дерева — без операцій', () => {
>   const tree = h('div', { id: 'x' }, h('p', null, 'a'))
>   expect(diff(tree, tree)).toEqual([])
>   expect(diff(tree, h('div', { id: 'x' }, h('p', null, 'a')))).toEqual([])
> })
>
> test('зміна тексту і атрибутів — точкові операції', () => {
>   const a = h('div', { id: 'x' }, h('p', null, 'a'))
>   const b = h('div', { id: 'y' }, h('p', null, 'b'))
>   expect(diff(a, b)).toEqual([
>     { op: 'props', path: [], set: { id: 'y' }, remove: [] },
>     { op: 'text', path: [0, 0], value: 'b' },
>   ])
> })
>
> test('інший тип — replace піддерева', () => {
>   const ops = diff(h('div', null, h('p', null, 'a')), h('div', null, h('span', null, 'a')))
>   expect(ops).toEqual([{ op: 'replace', path: [0], node: h('span', null, 'a') }])
> })
>
> test('додавання і видалення дітей', () => {
>   const short = h('ul', null, h('li', null, '1'))
>   const long = h('ul', null, h('li', null, '1'), h('li', null, '2'), h('li', null, '3'))
>   expect(diff(short, long).map((op) => [op.op, op.path])).toEqual([['create', [1]], ['create', [2]]])
>   expect(diff(long, short).map((op) => [op.op, op.path])).toEqual([['remove', [2]], ['remove', [1]]])
> })
>
> test('властивість: застосування операцій дає нове дерево', () => {
>   same(h('div', null, 'a', h('b', null, 'x')), h('div', { title: 't' }, 'b'))
>   same(h('ul', null, h('li', null, '1'), h('li', null, '2')), h('ul', null, h('li', null, '0'), h('li', null, '1'), h('li', null, '2')))
>   same(h('section', null, h('h1', null, 'T'), h('p', null, 'x', 'y')), h('section', null, h('p', null, 'y'), h('h1', { className: 'big' }, 'T')))
>   same(h('a', null), h('b', null, 'зовсім інше'))
> })
> ```
>
> > [!hint]- Підказка 1
> > Порядок перевірок у `diff`: `===` → тип/ключ → текст → атрибути + діти. Для атрибутів: `const props = diffProps(...)` і `if (props) ops.push({ op: 'props', path, ...props })`.
>
> > [!hint]- Підказка 2
> > `diffChildren`: `common = Math.min(...)`, три цикли. Видалення: `for (let i = oldChildren.length - 1; i >= common; i--)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const TEXT = '#text'
> >
> > function text(value) {
> >   return { type: TEXT, key: null, text: String(value) }
> > }
> >
> > function h(type, props, ...children) {
> >   const { key = null, ...rest } = props ?? {}
> >   const normalized = []
> >   for (const child of children.flat(Infinity)) {
> >     if (child === null || child === undefined || typeof child === 'boolean') continue
> >     normalized.push(typeof child === 'object' ? child : text(child))
> >   }
> >   return { type, key, props: rest, children: normalized }
> > }
> >
> > function escapeHtml(value) {
> >   return String(value)
> >     .replace(/&/g, '&amp;')
> >     .replace(/</g, '&lt;')
> >     .replace(/>/g, '&gt;')
> >     .replace(/"/g, '&quot;')
> >     .replace(/'/g, '&#39;')
> > }
> >
> > const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])
> >
> > function renderToString(vnode) {
> >   if (vnode.type === TEXT) return escapeHtml(vnode.text)
> >   let attrs = ''
> >   for (const [name, value] of Object.entries(vnode.props)) {
> >     if (/^on[A-Z]/.test(name) || value === false || value === null || value === undefined) continue
> >     const attr = name === 'className' ? 'class' : name
> >     attrs += value === true ? ` ${attr}` : ` ${attr}="${escapeHtml(value)}"`
> >   }
> >   if (VOID_TAGS.has(vnode.type)) return `<${vnode.type}${attrs}>`
> >   return `<${vnode.type}${attrs}>${vnode.children.map(renderToString).join('')}</${vnode.type}>`
> > }
> >
> > function diffProps(oldProps, newProps) {
> >   const set = {}
> >   const remove = []
> >   for (const [name, value] of Object.entries(newProps)) {
> >     if (!Object.is(oldProps[name], value)) set[name] = value
> >   }
> >   for (const name of Object.keys(oldProps)) {
> >     if (!Object.hasOwn(newProps, name)) remove.push(name)
> >   }
> >   return Object.keys(set).length > 0 || remove.length > 0 ? { set, remove } : null
> > }
> >
> > function toTree(vnode) {
> >   if (vnode.type === TEXT) return { type: TEXT, text: vnode.text }
> >   return { type: vnode.type, props: { ...vnode.props }, children: vnode.children.map(toTree) }
> > }
> >
> > function nodeAt(root, path) {
> >   let node = root
> >   for (const i of path) {
> >     node = node?.children?.[i]
> >     if (!node) throw new Error(`Немає вузла за шляхом ${path.join('.')}`)
> >   }
> >   return node
> > }
> >
> > function applyOps(root, ops) {
> >   for (const op of ops) {
> >     const parentPath = op.path.slice(0, -1)
> >     const index = op.path.at(-1)
> >     switch (op.op) {
> >       case 'create':
> >         nodeAt(root, parentPath).children.splice(index, 0, toTree(op.node))
> >         break
> >       case 'remove':
> >         nodeAt(root, parentPath).children.splice(index, 1)
> >         break
> >       case 'replace':
> >         if (op.path.length === 0) root = toTree(op.node)
> >         else nodeAt(root, parentPath).children[index] = toTree(op.node)
> >         break
> >       case 'text':
> >         nodeAt(root, op.path).text = op.value
> >         break
> >       case 'props': {
> >         const node = nodeAt(root, op.path)
> >         for (const name of op.remove) delete node.props[name]
> >         Object.assign(node.props, op.set)
> >         break
> >       }
> >       case 'move': {
> >         const children = nodeAt(root, op.path).children
> >         const [moved] = children.splice(op.from, 1)
> >         children.splice(op.to, 0, moved)
> >         break
> >       }
> >       default:
> >         throw new Error(`Невідома операція: ${op.op}`)
> >     }
> >   }
> >   return root
> > }
> >
> > function diff(oldNode, newNode, path = []) {
> >   if (oldNode === newNode) return []
> >   if (oldNode.type !== newNode.type || oldNode.key !== newNode.key) return [{ op: 'replace', path, node: newNode }]
> >   if (newNode.type === TEXT) return oldNode.text === newNode.text ? [] : [{ op: 'text', path, value: newNode.text }]
> >   const ops = []
> >   const props = diffProps(oldNode.props, newNode.props)
> >   if (props) ops.push({ op: 'props', path, ...props })
> >   ops.push(...diffChildren(oldNode.children, newNode.children, path))
> >   return ops
> > }
> >
> > function diffChildren(oldChildren, newChildren, path) {
> >   const ops = []
> >   const common = Math.min(oldChildren.length, newChildren.length)
> >   for (let i = 0; i < common; i++) ops.push(...diff(oldChildren[i], newChildren[i], [...path, i]))
> >   for (let i = common; i < newChildren.length; i++) ops.push({ op: 'create', path: [...path, i], node: newChildren[i] })
> >   for (let i = oldChildren.length - 1; i >= common; i--) ops.push({ op: 'remove', path: [...path, i] })
> >   return ops
> > }
> > ```
> > **Чому так:** diff — **чиста функція**: два дерева на вході, масив даних на виході. Її можна тестувати властивістю, логувати, серіалізувати й навіть відправити в інший потік (worker рахує diff, головний потік лише застосовує). Ранній вихід `oldNode === newNode` — фундамент мемоізації: незмінене піддерево (той самий об'єкт) не обходиться взагалі. Слабке місце видно в тесті вставки на початок: індексний diff перепише текст **кожного** елемента і створить останній — це лікують ключі.

## 🛠️ Крок 6. Keyed-діти

Список `[A, B, C]` став `[Z, A, B, C]`. Індексний diff бачить: «0-й змінився з A на Z, 1-й з B на A, …, і створи 4-й» — n операцій, і (у DOM) стан полів вводу й фокус «переїжджають» на чужі рядки. З ключами diff розуміє: A, B, C — ті самі вузли, просто вставили Z. Алгоритм: спершу прибрати зниклі ключі, потім пройти новий список зліва направо — кожен ключ або вже на місці, або переміщується з правішої позиції, або створюється.

> [!task] Крок 6 · diffKeyed
> level: senior · difficulty: hard · id: jsp-07-task-06 · tags: keys, reconciliation, lists
>
> Зміни `diffChildren`: якщо обидва списки непорожні й **усі** діти (старі й нові) мають `key !== null` — викликай `diffKeyed`, інакше — індексний алгоритм кроку 5 (винеси його в `diffIndexed`).
>
> `diffKeyed(oldChildren, newChildren, path)`:
>
> - дублікати ключів у новому списку → `Error('Дублікат key: <key>')`;
> - спершу `remove` для старих дітей, чиїх ключів немає в новому списку (з кінця);
> - далі для кожної нової дитини на позиції `i`: якщо її ключ є серед поточних на позиції `j >= i` і `j !== i` — `{ op: 'move', path, from: j, to: i }`; потім рекурсивний `diff` старого і нового вузла за шляхом `[...path, i]`; якщо ключа немає — `create` на позиції `i`.
>
> Підтримуй робочу копію поточного порядку, щоб індекси операцій відповідали стану **після** попередніх операцій.
>
> ```js starter
> const TEXT = '#text'
>
> function text(value) {
>   return { type: TEXT, key: null, text: String(value) }
> }
>
> function h(type, props, ...children) {
>   const { key = null, ...rest } = props ?? {}
>   const normalized = []
>   for (const child of children.flat(Infinity)) {
>     if (child === null || child === undefined || typeof child === 'boolean') continue
>     normalized.push(typeof child === 'object' ? child : text(child))
>   }
>   return { type, key, props: rest, children: normalized }
> }
>
> function escapeHtml(value) {
>   return String(value)
>     .replace(/&/g, '&amp;')
>     .replace(/</g, '&lt;')
>     .replace(/>/g, '&gt;')
>     .replace(/"/g, '&quot;')
>     .replace(/'/g, '&#39;')
> }
>
> const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])
>
> function renderToString(vnode) {
>   if (vnode.type === TEXT) return escapeHtml(vnode.text)
>   let attrs = ''
>   for (const [name, value] of Object.entries(vnode.props)) {
>     if (/^on[A-Z]/.test(name) || value === false || value === null || value === undefined) continue
>     const attr = name === 'className' ? 'class' : name
>     attrs += value === true ? ` ${attr}` : ` ${attr}="${escapeHtml(value)}"`
>   }
>   if (VOID_TAGS.has(vnode.type)) return `<${vnode.type}${attrs}>`
>   return `<${vnode.type}${attrs}>${vnode.children.map(renderToString).join('')}</${vnode.type}>`
> }
>
> function diffProps(oldProps, newProps) {
>   const set = {}
>   const remove = []
>   for (const [name, value] of Object.entries(newProps)) {
>     if (!Object.is(oldProps[name], value)) set[name] = value
>   }
>   for (const name of Object.keys(oldProps)) {
>     if (!Object.hasOwn(newProps, name)) remove.push(name)
>   }
>   return Object.keys(set).length > 0 || remove.length > 0 ? { set, remove } : null
> }
>
> function toTree(vnode) {
>   if (vnode.type === TEXT) return { type: TEXT, text: vnode.text }
>   return { type: vnode.type, props: { ...vnode.props }, children: vnode.children.map(toTree) }
> }
>
> function nodeAt(root, path) {
>   let node = root
>   for (const i of path) {
>     node = node?.children?.[i]
>     if (!node) throw new Error(`Немає вузла за шляхом ${path.join('.')}`)
>   }
>   return node
> }
>
> function applyOps(root, ops) {
>   for (const op of ops) {
>     const parentPath = op.path.slice(0, -1)
>     const index = op.path.at(-1)
>     switch (op.op) {
>       case 'create':
>         nodeAt(root, parentPath).children.splice(index, 0, toTree(op.node))
>         break
>       case 'remove':
>         nodeAt(root, parentPath).children.splice(index, 1)
>         break
>       case 'replace':
>         if (op.path.length === 0) root = toTree(op.node)
>         else nodeAt(root, parentPath).children[index] = toTree(op.node)
>         break
>       case 'text':
>         nodeAt(root, op.path).text = op.value
>         break
>       case 'props': {
>         const node = nodeAt(root, op.path)
>         for (const name of op.remove) delete node.props[name]
>         Object.assign(node.props, op.set)
>         break
>       }
>       case 'move': {
>         const children = nodeAt(root, op.path).children
>         const [moved] = children.splice(op.from, 1)
>         children.splice(op.to, 0, moved)
>         break
>       }
>       default:
>         throw new Error(`Невідома операція: ${op.op}`)
>     }
>   }
>   return root
> }
>
> function diff(oldNode, newNode, path = []) {
>   if (oldNode === newNode) return []
>   if (oldNode.type !== newNode.type || oldNode.key !== newNode.key) return [{ op: 'replace', path, node: newNode }]
>   if (newNode.type === TEXT) return oldNode.text === newNode.text ? [] : [{ op: 'text', path, value: newNode.text }]
>   const ops = []
>   const props = diffProps(oldNode.props, newNode.props)
>   if (props) ops.push({ op: 'props', path, ...props })
>   ops.push(...diffChildren(oldNode.children, newNode.children, path))
>   return ops
> }
>
> function diffChildren(oldChildren, newChildren, path) {
>   const ops = []
>   const common = Math.min(oldChildren.length, newChildren.length)
>   for (let i = 0; i < common; i++) ops.push(...diff(oldChildren[i], newChildren[i], [...path, i]))
>   for (let i = common; i < newChildren.length; i++) ops.push({ op: 'create', path: [...path, i], node: newChildren[i] })
>   for (let i = oldChildren.length - 1; i >= common; i--) ops.push({ op: 'remove', path: [...path, i] })
>   return ops
> }
>
> // Крок 6: перейменуй diffChildren вище на diffIndexed
> // і напиши новий diffChildren, що обирає між diffIndexed і diffKeyed.
>
> function diffKeyed(oldChildren, newChildren, path) {
>   // твій код
> }
> ```
>
> ```js tests
> const item = (key, label = key) => h('li', { key }, label)
> const list = (...keys) => h('ul', null, keys.map((k) => item(k)))
> const same = (a, b) => expect(applyOps(toTree(a), diff(a, b))).toEqual(toTree(b))
>
> test('вставка на початок — один create', () => {
>   expect(diff(list('a', 'b', 'c'), list('z', 'a', 'b', 'c'))).toEqual([{ op: 'create', path: [0], node: item('z') }])
> })
>
> test('видалення з середини — один remove', () => {
>   expect(diff(list('a', 'b', 'c'), list('a', 'c'))).toEqual([{ op: 'remove', path: [1] }])
> })
>
> test('перестановка — лише move, вузли зберігають ідентичність', () => {
>   const ops = diff(list('a', 'b', 'c', 'd'), list('d', 'a', 'b', 'c'))
>   expect(ops).toEqual([{ op: 'move', path: [], from: 3, to: 0 }])
>   const tree = toTree(list('a', 'b', 'c', 'd'))
>   const nodeD = tree.children[3]
>   applyOps(tree, ops)
>   expect(tree.children[0]).toBe(nodeD)
> })
>
> test('переміщення разом зі зміною вмісту', () => {
>   const ops = diff(h('ul', null, item('a', 'A'), item('b', 'B')), h('ul', null, item('b', 'B!'), item('a', 'A')))
>   expect(ops).toEqual([
>     { op: 'move', path: [], from: 1, to: 0 },
>     { op: 'text', path: [0, 0], value: 'B!' },
>   ])
> })
>
> test('властивість для складних перестановок', () => {
>   same(list('a', 'b', 'c', 'd', 'e'), list('e', 'c', 'x', 'a'))
>   same(list('a', 'b', 'c'), list('c', 'b', 'a'))
>   same(list('a'), list('b', 'c'))
>   same(h('ul', null, item('a'), h('li', null, 'без ключа')), list('b', 'a'))
> })
>
> test('дублікати ключів — помилка', () => {
>   expect(() => diff(list('a'), list('a', 'a'))).toThrow('Дублікат key: a')
> })
> ```
>
> > [!hint]- Підказка 1
> > `diffChildren`: `const keyed = oldChildren.length > 0 && newChildren.length > 0 && [...oldChildren, ...newChildren].every((c) => c.key !== null)`.
>
> > [!hint]- Підказка 2
> > `const current = [...oldChildren]`. Перший прохід з кінця: якщо `!newKeys.has(current[i].key)` — `remove` і `current.splice(i, 1)`.
>
> > [!hint]- Підказка 3
> > Другий прохід: `const j = current.findIndex((c, idx) => idx >= i && c.key === child.key)`. `j === -1` → `create` і `current.splice(i, 0, child)`; `j !== i` → `move` і переставити в `current`; далі `diff(current[i], child, [...path, i])`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const TEXT = '#text'
> >
> > function text(value) {
> >   return { type: TEXT, key: null, text: String(value) }
> > }
> >
> > function h(type, props, ...children) {
> >   const { key = null, ...rest } = props ?? {}
> >   const normalized = []
> >   for (const child of children.flat(Infinity)) {
> >     if (child === null || child === undefined || typeof child === 'boolean') continue
> >     normalized.push(typeof child === 'object' ? child : text(child))
> >   }
> >   return { type, key, props: rest, children: normalized }
> > }
> >
> > function escapeHtml(value) {
> >   return String(value)
> >     .replace(/&/g, '&amp;')
> >     .replace(/</g, '&lt;')
> >     .replace(/>/g, '&gt;')
> >     .replace(/"/g, '&quot;')
> >     .replace(/'/g, '&#39;')
> > }
> >
> > const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])
> >
> > function renderToString(vnode) {
> >   if (vnode.type === TEXT) return escapeHtml(vnode.text)
> >   let attrs = ''
> >   for (const [name, value] of Object.entries(vnode.props)) {
> >     if (/^on[A-Z]/.test(name) || value === false || value === null || value === undefined) continue
> >     const attr = name === 'className' ? 'class' : name
> >     attrs += value === true ? ` ${attr}` : ` ${attr}="${escapeHtml(value)}"`
> >   }
> >   if (VOID_TAGS.has(vnode.type)) return `<${vnode.type}${attrs}>`
> >   return `<${vnode.type}${attrs}>${vnode.children.map(renderToString).join('')}</${vnode.type}>`
> > }
> >
> > function diffProps(oldProps, newProps) {
> >   const set = {}
> >   const remove = []
> >   for (const [name, value] of Object.entries(newProps)) {
> >     if (!Object.is(oldProps[name], value)) set[name] = value
> >   }
> >   for (const name of Object.keys(oldProps)) {
> >     if (!Object.hasOwn(newProps, name)) remove.push(name)
> >   }
> >   return Object.keys(set).length > 0 || remove.length > 0 ? { set, remove } : null
> > }
> >
> > function toTree(vnode) {
> >   if (vnode.type === TEXT) return { type: TEXT, text: vnode.text }
> >   return { type: vnode.type, props: { ...vnode.props }, children: vnode.children.map(toTree) }
> > }
> >
> > function nodeAt(root, path) {
> >   let node = root
> >   for (const i of path) {
> >     node = node?.children?.[i]
> >     if (!node) throw new Error(`Немає вузла за шляхом ${path.join('.')}`)
> >   }
> >   return node
> > }
> >
> > function applyOps(root, ops) {
> >   for (const op of ops) {
> >     const parentPath = op.path.slice(0, -1)
> >     const index = op.path.at(-1)
> >     switch (op.op) {
> >       case 'create':
> >         nodeAt(root, parentPath).children.splice(index, 0, toTree(op.node))
> >         break
> >       case 'remove':
> >         nodeAt(root, parentPath).children.splice(index, 1)
> >         break
> >       case 'replace':
> >         if (op.path.length === 0) root = toTree(op.node)
> >         else nodeAt(root, parentPath).children[index] = toTree(op.node)
> >         break
> >       case 'text':
> >         nodeAt(root, op.path).text = op.value
> >         break
> >       case 'props': {
> >         const node = nodeAt(root, op.path)
> >         for (const name of op.remove) delete node.props[name]
> >         Object.assign(node.props, op.set)
> >         break
> >       }
> >       case 'move': {
> >         const children = nodeAt(root, op.path).children
> >         const [moved] = children.splice(op.from, 1)
> >         children.splice(op.to, 0, moved)
> >         break
> >       }
> >       default:
> >         throw new Error(`Невідома операція: ${op.op}`)
> >     }
> >   }
> >   return root
> > }
> >
> > function diff(oldNode, newNode, path = []) {
> >   if (oldNode === newNode) return []
> >   if (oldNode.type !== newNode.type || oldNode.key !== newNode.key) return [{ op: 'replace', path, node: newNode }]
> >   if (newNode.type === TEXT) return oldNode.text === newNode.text ? [] : [{ op: 'text', path, value: newNode.text }]
> >   const ops = []
> >   const props = diffProps(oldNode.props, newNode.props)
> >   if (props) ops.push({ op: 'props', path, ...props })
> >   ops.push(...diffChildren(oldNode.children, newNode.children, path))
> >   return ops
> > }
> >
> > function diffChildren(oldChildren, newChildren, path) {
> >   const keyed = oldChildren.length > 0 && newChildren.length > 0 && [...oldChildren, ...newChildren].every((child) => child.key !== null)
> >   return keyed ? diffKeyed(oldChildren, newChildren, path) : diffIndexed(oldChildren, newChildren, path)
> > }
> >
> > function diffIndexed(oldChildren, newChildren, path) {
> >   const ops = []
> >   const common = Math.min(oldChildren.length, newChildren.length)
> >   for (let i = 0; i < common; i++) ops.push(...diff(oldChildren[i], newChildren[i], [...path, i]))
> >   for (let i = common; i < newChildren.length; i++) ops.push({ op: 'create', path: [...path, i], node: newChildren[i] })
> >   for (let i = oldChildren.length - 1; i >= common; i--) ops.push({ op: 'remove', path: [...path, i] })
> >   return ops
> > }
> >
> > function diffKeyed(oldChildren, newChildren, path) {
> >   const newKeys = new Set()
> >   for (const child of newChildren) {
> >     if (newKeys.has(child.key)) throw new Error(`Дублікат key: ${child.key}`)
> >     newKeys.add(child.key)
> >   }
> >   const ops = []
> >   const current = [...oldChildren]
> >   for (let i = current.length - 1; i >= 0; i--) {
> >     if (newKeys.has(current[i].key)) continue
> >     ops.push({ op: 'remove', path: [...path, i] })
> >     current.splice(i, 1)
> >   }
> >   newChildren.forEach((child, i) => {
> >     const j = current.findIndex((node, idx) => idx >= i && node.key === child.key)
> >     if (j === -1) {
> >       ops.push({ op: 'create', path: [...path, i], node: child })
> >       current.splice(i, 0, child)
> >       return
> >     }
> >     if (j !== i) {
> >       ops.push({ op: 'move', path, from: j, to: i })
> >       const [moved] = current.splice(j, 1)
> >       current.splice(i, 0, moved)
> >     }
> >     ops.push(...diff(current[i], child, [...path, i]))
> >   })
> >   return ops
> > }
> > ```
> > **Чому так:** ключ — це **ідентичність** вузла між рендерами. Видалення першим проходом гарантує, що в робочій копії лишились лише ті, хто «виживе», тож другий прохід лише переставляє і створює. Робоча копія `current` синхронізує індекси з тим, що вже зробив хост, — інакше `move` після `create` влучив би не туди. Алгоритм простий, але не мінімальний: перенесення першого елемента в кінець дає `n − 1` переміщень. Vue 3 та Inferno рахують **найдовшу зростаючу підпослідовність** (LIS), щоб переміщувати лише ті вузли, що справді вибились із порядку.

## 🛠️ Крок 7. Компоненти і createApp

Останній шар — те, з чим працює розробник. **Компонент** — функція `props → vnode`; `expand` розгортає їх до звичайних елементів перед diff. **Застосунок** — архітектура Elm: `init` (стан), `update(state, msg)` (чиста функція переходу), `view(state, dispatch)` (опис UI). Після кожного `dispatch` — новий view, diff зі старим деревом і **лише** операції — хосту.

> [!task] Крок 7 · expand і createApp
> level: senior · difficulty: hard · id: jsp-07-task-07 · tags: components, elm-architecture, integration
>
> Додай:
>
> - `expand(vnode)`: текст — як є; `type` — функція → виклич `type({ ...props, children })` і розгорни результат рекурсивно (рядок чи число з компонента → `text`; `key` компонента переходить на результат, якщо в результату ключа немає); елемент → копія з розгорнутими дітьми;
> - `createApp({ init, update, view, host })`:
>   - одразу рендерить `expand(view(state, dispatch))` і викликає `host.apply([{ op: 'replace', path: [], node: tree }])`;
>   - `dispatch(msg)`: `next = update(state, msg)`; якщо `Object.is(next, state)` — нічого; інакше новий view → `diff(старе дерево, нове)` → `host.apply(ops)`, лише якщо операцій більше нуля;
>   - повертає `{ dispatch, getState }`.
>
> ```js starter
> const TEXT = '#text'
>
> function text(value) {
>   return { type: TEXT, key: null, text: String(value) }
> }
>
> function h(type, props, ...children) {
>   const { key = null, ...rest } = props ?? {}
>   const normalized = []
>   for (const child of children.flat(Infinity)) {
>     if (child === null || child === undefined || typeof child === 'boolean') continue
>     normalized.push(typeof child === 'object' ? child : text(child))
>   }
>   return { type, key, props: rest, children: normalized }
> }
>
> function escapeHtml(value) {
>   return String(value)
>     .replace(/&/g, '&amp;')
>     .replace(/</g, '&lt;')
>     .replace(/>/g, '&gt;')
>     .replace(/"/g, '&quot;')
>     .replace(/'/g, '&#39;')
> }
>
> const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])
>
> function renderToString(vnode) {
>   if (vnode.type === TEXT) return escapeHtml(vnode.text)
>   let attrs = ''
>   for (const [name, value] of Object.entries(vnode.props)) {
>     if (/^on[A-Z]/.test(name) || value === false || value === null || value === undefined) continue
>     const attr = name === 'className' ? 'class' : name
>     attrs += value === true ? ` ${attr}` : ` ${attr}="${escapeHtml(value)}"`
>   }
>   if (VOID_TAGS.has(vnode.type)) return `<${vnode.type}${attrs}>`
>   return `<${vnode.type}${attrs}>${vnode.children.map(renderToString).join('')}</${vnode.type}>`
> }
>
> function diffProps(oldProps, newProps) {
>   const set = {}
>   const remove = []
>   for (const [name, value] of Object.entries(newProps)) {
>     if (!Object.is(oldProps[name], value)) set[name] = value
>   }
>   for (const name of Object.keys(oldProps)) {
>     if (!Object.hasOwn(newProps, name)) remove.push(name)
>   }
>   return Object.keys(set).length > 0 || remove.length > 0 ? { set, remove } : null
> }
>
> function toTree(vnode) {
>   if (vnode.type === TEXT) return { type: TEXT, text: vnode.text }
>   return { type: vnode.type, props: { ...vnode.props }, children: vnode.children.map(toTree) }
> }
>
> function nodeAt(root, path) {
>   let node = root
>   for (const i of path) {
>     node = node?.children?.[i]
>     if (!node) throw new Error(`Немає вузла за шляхом ${path.join('.')}`)
>   }
>   return node
> }
>
> function applyOps(root, ops) {
>   for (const op of ops) {
>     const parentPath = op.path.slice(0, -1)
>     const index = op.path.at(-1)
>     switch (op.op) {
>       case 'create':
>         nodeAt(root, parentPath).children.splice(index, 0, toTree(op.node))
>         break
>       case 'remove':
>         nodeAt(root, parentPath).children.splice(index, 1)
>         break
>       case 'replace':
>         if (op.path.length === 0) root = toTree(op.node)
>         else nodeAt(root, parentPath).children[index] = toTree(op.node)
>         break
>       case 'text':
>         nodeAt(root, op.path).text = op.value
>         break
>       case 'props': {
>         const node = nodeAt(root, op.path)
>         for (const name of op.remove) delete node.props[name]
>         Object.assign(node.props, op.set)
>         break
>       }
>       case 'move': {
>         const children = nodeAt(root, op.path).children
>         const [moved] = children.splice(op.from, 1)
>         children.splice(op.to, 0, moved)
>         break
>       }
>       default:
>         throw new Error(`Невідома операція: ${op.op}`)
>     }
>   }
>   return root
> }
>
> function diff(oldNode, newNode, path = []) {
>   if (oldNode === newNode) return []
>   if (oldNode.type !== newNode.type || oldNode.key !== newNode.key) return [{ op: 'replace', path, node: newNode }]
>   if (newNode.type === TEXT) return oldNode.text === newNode.text ? [] : [{ op: 'text', path, value: newNode.text }]
>   const ops = []
>   const props = diffProps(oldNode.props, newNode.props)
>   if (props) ops.push({ op: 'props', path, ...props })
>   ops.push(...diffChildren(oldNode.children, newNode.children, path))
>   return ops
> }
>
> function diffChildren(oldChildren, newChildren, path) {
>   const keyed = oldChildren.length > 0 && newChildren.length > 0 && [...oldChildren, ...newChildren].every((child) => child.key !== null)
>   return keyed ? diffKeyed(oldChildren, newChildren, path) : diffIndexed(oldChildren, newChildren, path)
> }
>
> function diffIndexed(oldChildren, newChildren, path) {
>   const ops = []
>   const common = Math.min(oldChildren.length, newChildren.length)
>   for (let i = 0; i < common; i++) ops.push(...diff(oldChildren[i], newChildren[i], [...path, i]))
>   for (let i = common; i < newChildren.length; i++) ops.push({ op: 'create', path: [...path, i], node: newChildren[i] })
>   for (let i = oldChildren.length - 1; i >= common; i--) ops.push({ op: 'remove', path: [...path, i] })
>   return ops
> }
>
> function diffKeyed(oldChildren, newChildren, path) {
>   const newKeys = new Set()
>   for (const child of newChildren) {
>     if (newKeys.has(child.key)) throw new Error(`Дублікат key: ${child.key}`)
>     newKeys.add(child.key)
>   }
>   const ops = []
>   const current = [...oldChildren]
>   for (let i = current.length - 1; i >= 0; i--) {
>     if (newKeys.has(current[i].key)) continue
>     ops.push({ op: 'remove', path: [...path, i] })
>     current.splice(i, 1)
>   }
>   newChildren.forEach((child, i) => {
>     const j = current.findIndex((node, idx) => idx >= i && node.key === child.key)
>     if (j === -1) {
>       ops.push({ op: 'create', path: [...path, i], node: child })
>       current.splice(i, 0, child)
>       return
>     }
>     if (j !== i) {
>       ops.push({ op: 'move', path, from: j, to: i })
>       const [moved] = current.splice(j, 1)
>       current.splice(i, 0, moved)
>     }
>     ops.push(...diff(current[i], child, [...path, i]))
>   })
>   return ops
> }
>
> function expand(vnode) {
>   // твій код
> }
>
> function createApp({ init, update, view, host }) {
>   // твій код
> }
> ```
>
> ```js tests
> function fakeHost() {
>   return {
>     root: null,
>     batches: [],
>     apply(ops) {
>       this.batches.push(ops)
>       this.root = applyOps(this.root, ops)
>     },
>   }
> }
>
> test('компоненти розгортаються, children передаються', () => {
>   const Card = ({ title, children }) => h('section', null, h('h2', null, title), children)
>   const Count = ({ n }) => n
>   const tree = expand(h(Card, { title: 'Привіт' }, h('p', null, 'тіло'), h(Count, { n: 3 })))
>   expect(renderToString(tree)).toBe('<section><h2>Привіт</h2><p>тіло</p>3</section>')
> })
>
> test('key компонента переходить на результат', () => {
>   const Row = ({ label }) => h('li', null, label)
>   expect(expand(h(Row, { key: 'r1', label: 'x' })).key).toBe('r1')
> })
>
> test('монтування: replace кореня', () => {
>   const host = fakeHost()
>   createApp({ init: 1, update: (s) => s, view: (s) => h('p', null, `n=${s}`), host })
>   expect(host.batches).toHaveLength(1)
>   expect(host.root).toEqual(toTree(h('p', null, 'n=1')))
> })
>
> test('dispatch — лише мінімальні операції', () => {
>   const host = fakeHost()
>   let app
>   const onInc = () => app.dispatch('inc')
>   app = createApp({
>     init: 0,
>     update: (state, msg) => (msg === 'inc' ? state + 1 : state),
>     view: (state) => h('div', null, h('button', { onClick: onInc }, '+'), h('output', null, state)),
>     host,
>   })
>   host.root.children[0].props.onClick()
>   expect(app.getState()).toBe(1)
>   expect(host.batches[1]).toEqual([{ op: 'text', path: [1, 0], value: '1' }])
> })
>
> test('той самий стан — без рендеру', () => {
>   const host = fakeHost()
>   const view = vi.fn((s) => h('p', null, s))
>   const app = createApp({ init: 'x', update: (s) => s, view, host })
>   app.dispatch('noop')
>   expect(view).toHaveBeenCalledTimes(1)
>   expect(host.batches).toHaveLength(1)
> })
>
> test('keyed-список у застосунку', () => {
>   const host = fakeHost()
>   const Item = ({ todo }) => h('li', null, todo.title)
>   const app = createApp({
>     init: [{ id: 1, title: 'a' }, { id: 2, title: 'b' }],
>     update: (todos, msg) => (msg.type === 'add' ? [msg.todo, ...todos] : todos),
>     view: (todos) => h('ul', null, todos.map((todo) => h(Item, { key: todo.id, todo }))),
>     host,
>   })
>   app.dispatch({ type: 'add', todo: { id: 3, title: 'нове' } })
>   expect(host.batches[1].map((op) => op.op)).toEqual(['create'])
>   expect(host.root.children.map((li) => li.children[0].text)).toEqual(['нове', 'a', 'b'])
> })
> ```
>
> > [!hint]- Підказка 1
> > `expand` для компонента: `let result = vnode.type({ ...vnode.props, children: vnode.children })`; якщо це не об'єкт — `result = text(result)`; `result = expand(result)`; якщо `vnode.key !== null && result.key === null` — `{ ...result, key: vnode.key }`.
>
> > [!hint]- Підказка 2
> > У `createApp` тримай `state` і `tree` у замиканні; `render = () => expand(view(state, dispatch))`. `dispatch` — оголошення функції (`function dispatch`), щоб `view` міг отримати її ще до першого рендеру.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const TEXT = '#text'
> >
> > function text(value) {
> >   return { type: TEXT, key: null, text: String(value) }
> > }
> >
> > function h(type, props, ...children) {
> >   const { key = null, ...rest } = props ?? {}
> >   const normalized = []
> >   for (const child of children.flat(Infinity)) {
> >     if (child === null || child === undefined || typeof child === 'boolean') continue
> >     normalized.push(typeof child === 'object' ? child : text(child))
> >   }
> >   return { type, key, props: rest, children: normalized }
> > }
> >
> > function escapeHtml(value) {
> >   return String(value)
> >     .replace(/&/g, '&amp;')
> >     .replace(/</g, '&lt;')
> >     .replace(/>/g, '&gt;')
> >     .replace(/"/g, '&quot;')
> >     .replace(/'/g, '&#39;')
> > }
> >
> > const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])
> >
> > function renderToString(vnode) {
> >   if (vnode.type === TEXT) return escapeHtml(vnode.text)
> >   let attrs = ''
> >   for (const [name, value] of Object.entries(vnode.props)) {
> >     if (/^on[A-Z]/.test(name) || value === false || value === null || value === undefined) continue
> >     const attr = name === 'className' ? 'class' : name
> >     attrs += value === true ? ` ${attr}` : ` ${attr}="${escapeHtml(value)}"`
> >   }
> >   if (VOID_TAGS.has(vnode.type)) return `<${vnode.type}${attrs}>`
> >   return `<${vnode.type}${attrs}>${vnode.children.map(renderToString).join('')}</${vnode.type}>`
> > }
> >
> > function diffProps(oldProps, newProps) {
> >   const set = {}
> >   const remove = []
> >   for (const [name, value] of Object.entries(newProps)) {
> >     if (!Object.is(oldProps[name], value)) set[name] = value
> >   }
> >   for (const name of Object.keys(oldProps)) {
> >     if (!Object.hasOwn(newProps, name)) remove.push(name)
> >   }
> >   return Object.keys(set).length > 0 || remove.length > 0 ? { set, remove } : null
> > }
> >
> > function toTree(vnode) {
> >   if (vnode.type === TEXT) return { type: TEXT, text: vnode.text }
> >   return { type: vnode.type, props: { ...vnode.props }, children: vnode.children.map(toTree) }
> > }
> >
> > function nodeAt(root, path) {
> >   let node = root
> >   for (const i of path) {
> >     node = node?.children?.[i]
> >     if (!node) throw new Error(`Немає вузла за шляхом ${path.join('.')}`)
> >   }
> >   return node
> > }
> >
> > function applyOps(root, ops) {
> >   for (const op of ops) {
> >     const parentPath = op.path.slice(0, -1)
> >     const index = op.path.at(-1)
> >     switch (op.op) {
> >       case 'create':
> >         nodeAt(root, parentPath).children.splice(index, 0, toTree(op.node))
> >         break
> >       case 'remove':
> >         nodeAt(root, parentPath).children.splice(index, 1)
> >         break
> >       case 'replace':
> >         if (op.path.length === 0) root = toTree(op.node)
> >         else nodeAt(root, parentPath).children[index] = toTree(op.node)
> >         break
> >       case 'text':
> >         nodeAt(root, op.path).text = op.value
> >         break
> >       case 'props': {
> >         const node = nodeAt(root, op.path)
> >         for (const name of op.remove) delete node.props[name]
> >         Object.assign(node.props, op.set)
> >         break
> >       }
> >       case 'move': {
> >         const children = nodeAt(root, op.path).children
> >         const [moved] = children.splice(op.from, 1)
> >         children.splice(op.to, 0, moved)
> >         break
> >       }
> >       default:
> >         throw new Error(`Невідома операція: ${op.op}`)
> >     }
> >   }
> >   return root
> > }
> >
> > function diff(oldNode, newNode, path = []) {
> >   if (oldNode === newNode) return []
> >   if (oldNode.type !== newNode.type || oldNode.key !== newNode.key) return [{ op: 'replace', path, node: newNode }]
> >   if (newNode.type === TEXT) return oldNode.text === newNode.text ? [] : [{ op: 'text', path, value: newNode.text }]
> >   const ops = []
> >   const props = diffProps(oldNode.props, newNode.props)
> >   if (props) ops.push({ op: 'props', path, ...props })
> >   ops.push(...diffChildren(oldNode.children, newNode.children, path))
> >   return ops
> > }
> >
> > function diffChildren(oldChildren, newChildren, path) {
> >   const keyed = oldChildren.length > 0 && newChildren.length > 0 && [...oldChildren, ...newChildren].every((child) => child.key !== null)
> >   return keyed ? diffKeyed(oldChildren, newChildren, path) : diffIndexed(oldChildren, newChildren, path)
> > }
> >
> > function diffIndexed(oldChildren, newChildren, path) {
> >   const ops = []
> >   const common = Math.min(oldChildren.length, newChildren.length)
> >   for (let i = 0; i < common; i++) ops.push(...diff(oldChildren[i], newChildren[i], [...path, i]))
> >   for (let i = common; i < newChildren.length; i++) ops.push({ op: 'create', path: [...path, i], node: newChildren[i] })
> >   for (let i = oldChildren.length - 1; i >= common; i--) ops.push({ op: 'remove', path: [...path, i] })
> >   return ops
> > }
> >
> > function diffKeyed(oldChildren, newChildren, path) {
> >   const newKeys = new Set()
> >   for (const child of newChildren) {
> >     if (newKeys.has(child.key)) throw new Error(`Дублікат key: ${child.key}`)
> >     newKeys.add(child.key)
> >   }
> >   const ops = []
> >   const current = [...oldChildren]
> >   for (let i = current.length - 1; i >= 0; i--) {
> >     if (newKeys.has(current[i].key)) continue
> >     ops.push({ op: 'remove', path: [...path, i] })
> >     current.splice(i, 1)
> >   }
> >   newChildren.forEach((child, i) => {
> >     const j = current.findIndex((node, idx) => idx >= i && node.key === child.key)
> >     if (j === -1) {
> >       ops.push({ op: 'create', path: [...path, i], node: child })
> >       current.splice(i, 0, child)
> >       return
> >     }
> >     if (j !== i) {
> >       ops.push({ op: 'move', path, from: j, to: i })
> >       const [moved] = current.splice(j, 1)
> >       current.splice(i, 0, moved)
> >     }
> >     ops.push(...diff(current[i], child, [...path, i]))
> >   })
> >   return ops
> > }
> >
> > function expand(vnode) {
> >   if (vnode.type === TEXT) return vnode
> >   if (typeof vnode.type === 'function') {
> >     let result = vnode.type({ ...vnode.props, children: vnode.children })
> >     if (result === null || typeof result !== 'object') result = text(result ?? '')
> >     result = expand(result)
> >     return vnode.key !== null && result.key === null ? { ...result, key: vnode.key } : result
> >   }
> >   return { ...vnode, children: vnode.children.map(expand) }
> > }
> >
> > function createApp({ init, update, view, host }) {
> >   let state = init
> >   let tree = null
> >
> >   const render = () => expand(view(state, dispatch))
> >
> >   function dispatch(msg) {
> >     const next = update(state, msg)
> >     if (Object.is(next, state)) return
> >     state = next
> >     const nextTree = render()
> >     const ops = diff(tree, nextTree)
> >     tree = nextTree
> >     if (ops.length > 0) host.apply(ops)
> >   }
> >
> >   tree = render()
> >   host.apply([{ op: 'replace', path: [], node: tree }])
> >   return { dispatch, getState: () => state }
> > }
> > ```
> > **Чому так:** компоненти розгортаються **до** diff, тож diff працює лише з елементами й текстом — простий і швидкий. Ключ компонента переноситься на результат, інакше `h(Item, { key })` втратив би ідентичність у списку. Архітектура Elm (`update` чистий, `view` — функція стану) робить кожен рендер детермінованим: той самий стан → те саме дерево → нуль операцій. Хост отримує вже готовий **мінімальний** пакет змін і нічого не знає про компоненти й стан — тому його легко замінити: DOM, Canvas, термінал.

## 🎤 На співбесіді

> [!interview] Як би ти масштабував цей рендерер для великих застосунків?
> level: senior · frequency: часто · id: jsp-07-int-01
>
> ---
>
> **Пропуск незмінних піддерев**: компоненти з мемоізацією (`memo` — якщо props поверхнево рівні, повертаємо **той самий** vnode, і наш `oldNode === newNode` пропускає піддерево). **Мінімальні переміщення**: LIS у keyed-diff замість наївного проходу. **Локальний стан компонентів** (хуки): дерево інстансів (fiber), яке зберігає стан між рендерами за позицією і ключем — а оновлення рендерить лише змінений компонент, а не весь `view`. **Планування**: батчинг `dispatch` у мікрозадачу/`requestAnimationFrame`, щоб 10 повідомлень підряд дали один рендер; **переривний рендер** (time slicing) — розбити diff на шматки й поступатися головним потоком, щоб введення не гальмувало (React Concurrent). **Великі списки** — віртуалізація. **Делегування подій** на корені замість слухача на кожному вузлі. І вимірювання: скільки операцій на оновлення, тривалість кадру в Performance.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку]] · [React: Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state) · [Wikipedia: Longest increasing subsequence](https://en.wikipedia.org/wiki/Longest_increasing_subsequence)

> [!interview] Навіщо React вимагає `key` у списках і чому індекс — поганий ключ?
> level: middle · frequency: дуже часто · id: jsp-07-int-02
>
> ---
>
> Без ключів реконсиляція зіставляє дітей **за позицією**: вставка на початок «зсуває» зміст кожного рядка — n оновлень замість однієї вставки, і стан (значення `<input>`, фокус, локальний стан компонента, анімації) лишається на старих позиціях, тобто опиняється в **чужому** рядку. Ключ — стабільна ідентичність між рендерами: diff розуміє, що елемент той самий, і переміщує його разом зі станом. Індекс як ключ дорівнює відсутності ключа при вставці, видаленні й сортуванні — з тими самими багами. Ключ має бути **стабільним і унікальним серед сусідів**: `id` з даних; не `Math.random()` (новий на кожен рендер → усе перестворюється). Корисний трюк: змінити `key` компонента навмисно, щоб скинути його стан.
>
> 📚 [[JavaScript - 25. DOM і події]] · [React: Rendering Lists](https://react.dev/learn/rendering-lists) · [React (legacy): Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html)

## 🧠 Закріплення

> [!question]- Чому diff повертає список операцій, а не змінює DOM сам?
> *часто · дизайн* · `jsp-07-001`
>
> Розділення «що змінити» (чиста функція) і «як змінити» (хост). Diff тестується без браузера властивістю `apply(old, diff) ≡ new`, працює з будь-яким середовищем (DOM, Canvas, нативні view, термінал) і може виконуватися в іншому потоці. Так влаштовані кастомні рендерери React.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Snabbdom](https://github.com/snabbdom/snabbdom)

> [!question]- Які дві евристики роблять diff React лінійним?
> *часто · теорія* · `jsp-07-002`
>
> 1) Елементи різних типів дають різні дерева — піддерево замінюється цілком, без спроби «латати». 2) Діти зіставляються за позицією або за `key`. Загальна задача мінімального редагування дерев — O(n³); евристики дають O(n) ціною неоптимальності в рідкісних випадках.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку]] · [React (legacy): Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html)

> [!question]- Чому зайвих дітей видаляють з кінця?
> *іноді · код* · `jsp-07-003`
>
> Операції виконуються послідовно. Після видалення дитини з індексом 2 колишня 3-тя стає 2-ю, і наступна операція «видали 3» влучила б не туди або впала. Видалення з кінця не зсуває індекси тих, що ще чекають на видалення.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль]] · [MDN: Node.insertBefore()](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore)

> [!question]- Що зберігає `key` між рендерами?
> *дуже часто · теорія* · `jsp-07-004`
>
> Ідентичність вузла: diff розуміє, що елемент з тим самим ключем — той самий, і переміщує його замість перестворення. Разом з ним переїжджає стан — значення полів, фокус, локальний стан компонента, DOM-вузол. Ключ має бути стабільним і унікальним серед сусідів.
>
> 📚 [[JavaScript - 25. DOM і події]] · [React: Rendering Lists](https://react.dev/learn/rendering-lists)

> [!question]- Чому `renderToString` екранує текст і атрибути за замовчуванням?
> *часто · безпека* · `jsp-07-005`
>
> Дані користувача, вставлені в HTML як є, можуть містити теги й обробники (`<img onerror=…>`) — це XSS. Екранування `& < > " '` перетворює їх на текст. Безпечний варіант має бути за замовчуванням, а небезпечний — явним (`dangerouslySetInnerHTML`).
>
> 📚 [[JavaScript - 30. Безпека в JavaScript]] · [MDN: Void element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element)

> [!question]- Навіщо в diff ранній вихід `oldNode === newNode`?
> *іноді · дизайн* · `jsp-07-006`
>
> Якщо піддерево — той самий об'єкт, воно гарантовано не змінилось, і його не треба обходити. На цьому стоїть мемоізація компонентів (`React.memo`): повернути попередній vnode = пропустити весь diff піддерева. Знову перемагає імутабельність: «те саме посилання ⇒ ті самі дані».
>
> 📚 [[JavaScript - 03. Значення та посилання]] · [Preact: API Reference](https://preactjs.com/guide/v10/api-reference/)

> [!question]- Що таке архітектура Elm і як вона спрощує рендер?
> *іноді · дизайн* · `jsp-07-007`
>
> Три частини: стан (`init`), чиста функція переходу `update(state, msg)` і чиста функція відображення `view(state)`. Побічних ефектів у них немає, тож той самий стан завжди дає те саме дерево, а повторний рендер без змін — нуль операцій. Звідси виросли Redux і односпрямований потік даних.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Elm Guide: The Elm Architecture](https://guide.elm-lang.org/architecture/)

## ⚡ Фішки

> [!reel] 🧬 JSX — це просто виклик функції
> Babel перетворює JSX на `h()`. Директива `/** @jsx h */` — і твій `h` з кроку 1 працює з JSX.
>
> ```js
> // <li className="x">{title}</li>
> h('li', { className: 'x' }, title)
> ```

> [!reel] 0️⃣ {count && <Badge/>} показує «0»
> `0 && x` повертає `0`, а числа — валідні діти, тож на екрані з'являється нуль. Пиши `count > 0 && …`.

> [!reel] 🔑 Зміни key — скинь стан
> `<Form key={userId} />`: новий ключ = новий компонент. Найпростіший спосіб очистити форму при перемиканні користувача.

## 🖥️ Зібрати в браузері

Збережи як `framework.html`. DOM-хост — ~60 рядків, що виконують ті самі операції, що й `applyOps`, але викликами `insertBefore`, `removeChild`, `nodeValue`. Застосунок — список покупок з keyed-рядками; панель праворуч показує, які операції реально пішли в DOM. Надрукуй щось у полі рядка, натисни «⬆» — текст переїде разом із рядком, бо вузол **перемістили**, а не перестворили.

```html
<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>Міні-фреймворк</title>
  <style>
    body { font: 15px system-ui, sans-serif; margin: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    li { margin: 4px 0; }
    li.done span { text-decoration: line-through; opacity: .6; }
    #log { font: 12px ui-monospace, monospace; background: #f6f6f6; padding: 12px; border-radius: 8px; max-height: 80vh; overflow: auto; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div id="app"></div>
  <pre id="log"></pre>
  <script>
const TEXT = '#text'

function text(value) {
  return { type: TEXT, key: null, text: String(value) }
}

function h(type, props, ...children) {
  const { key = null, ...rest } = props ?? {}
  const normalized = []
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || typeof child === 'boolean') continue
    normalized.push(typeof child === 'object' ? child : text(child))
  }
  return { type, key, props: rest, children: normalized }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link'])

function renderToString(vnode) {
  if (vnode.type === TEXT) return escapeHtml(vnode.text)
  let attrs = ''
  for (const [name, value] of Object.entries(vnode.props)) {
    if (/^on[A-Z]/.test(name) || value === false || value === null || value === undefined) continue
    const attr = name === 'className' ? 'class' : name
    attrs += value === true ? ` ${attr}` : ` ${attr}="${escapeHtml(value)}"`
  }
  if (VOID_TAGS.has(vnode.type)) return `<${vnode.type}${attrs}>`
  return `<${vnode.type}${attrs}>${vnode.children.map(renderToString).join('')}</${vnode.type}>`
}

function diffProps(oldProps, newProps) {
  const set = {}
  const remove = []
  for (const [name, value] of Object.entries(newProps)) {
    if (!Object.is(oldProps[name], value)) set[name] = value
  }
  for (const name of Object.keys(oldProps)) {
    if (!Object.hasOwn(newProps, name)) remove.push(name)
  }
  return Object.keys(set).length > 0 || remove.length > 0 ? { set, remove } : null
}

function toTree(vnode) {
  if (vnode.type === TEXT) return { type: TEXT, text: vnode.text }
  return { type: vnode.type, props: { ...vnode.props }, children: vnode.children.map(toTree) }
}

function nodeAt(root, path) {
  let node = root
  for (const i of path) {
    node = node?.children?.[i]
    if (!node) throw new Error(`Немає вузла за шляхом ${path.join('.')}`)
  }
  return node
}

function applyOps(root, ops) {
  for (const op of ops) {
    const parentPath = op.path.slice(0, -1)
    const index = op.path.at(-1)
    switch (op.op) {
      case 'create':
        nodeAt(root, parentPath).children.splice(index, 0, toTree(op.node))
        break
      case 'remove':
        nodeAt(root, parentPath).children.splice(index, 1)
        break
      case 'replace':
        if (op.path.length === 0) root = toTree(op.node)
        else nodeAt(root, parentPath).children[index] = toTree(op.node)
        break
      case 'text':
        nodeAt(root, op.path).text = op.value
        break
      case 'props': {
        const node = nodeAt(root, op.path)
        for (const name of op.remove) delete node.props[name]
        Object.assign(node.props, op.set)
        break
      }
      case 'move': {
        const children = nodeAt(root, op.path).children
        const [moved] = children.splice(op.from, 1)
        children.splice(op.to, 0, moved)
        break
      }
      default:
        throw new Error(`Невідома операція: ${op.op}`)
    }
  }
  return root
}

function diff(oldNode, newNode, path = []) {
  if (oldNode === newNode) return []
  if (oldNode.type !== newNode.type || oldNode.key !== newNode.key) return [{ op: 'replace', path, node: newNode }]
  if (newNode.type === TEXT) return oldNode.text === newNode.text ? [] : [{ op: 'text', path, value: newNode.text }]
  const ops = []
  const props = diffProps(oldNode.props, newNode.props)
  if (props) ops.push({ op: 'props', path, ...props })
  ops.push(...diffChildren(oldNode.children, newNode.children, path))
  return ops
}

function diffChildren(oldChildren, newChildren, path) {
  const keyed = oldChildren.length > 0 && newChildren.length > 0 && [...oldChildren, ...newChildren].every((child) => child.key !== null)
  return keyed ? diffKeyed(oldChildren, newChildren, path) : diffIndexed(oldChildren, newChildren, path)
}

function diffIndexed(oldChildren, newChildren, path) {
  const ops = []
  const common = Math.min(oldChildren.length, newChildren.length)
  for (let i = 0; i < common; i++) ops.push(...diff(oldChildren[i], newChildren[i], [...path, i]))
  for (let i = common; i < newChildren.length; i++) ops.push({ op: 'create', path: [...path, i], node: newChildren[i] })
  for (let i = oldChildren.length - 1; i >= common; i--) ops.push({ op: 'remove', path: [...path, i] })
  return ops
}

function diffKeyed(oldChildren, newChildren, path) {
  const newKeys = new Set()
  for (const child of newChildren) {
    if (newKeys.has(child.key)) throw new Error(`Дублікат key: ${child.key}`)
    newKeys.add(child.key)
  }
  const ops = []
  const current = [...oldChildren]
  for (let i = current.length - 1; i >= 0; i--) {
    if (newKeys.has(current[i].key)) continue
    ops.push({ op: 'remove', path: [...path, i] })
    current.splice(i, 1)
  }
  newChildren.forEach((child, i) => {
    const j = current.findIndex((node, idx) => idx >= i && node.key === child.key)
    if (j === -1) {
      ops.push({ op: 'create', path: [...path, i], node: child })
      current.splice(i, 0, child)
      return
    }
    if (j !== i) {
      ops.push({ op: 'move', path, from: j, to: i })
      const [moved] = current.splice(j, 1)
      current.splice(i, 0, moved)
    }
    ops.push(...diff(current[i], child, [...path, i]))
  })
  return ops
}

function expand(vnode) {
  if (vnode.type === TEXT) return vnode
  if (typeof vnode.type === 'function') {
    let result = vnode.type({ ...vnode.props, children: vnode.children })
    if (result === null || typeof result !== 'object') result = text(result ?? '')
    result = expand(result)
    return vnode.key !== null && result.key === null ? { ...result, key: vnode.key } : result
  }
  return { ...vnode, children: vnode.children.map(expand) }
}

function createApp({ init, update, view, host }) {
  let state = init
  let tree = null

  const render = () => expand(view(state, dispatch))

  function dispatch(msg) {
    const next = update(state, msg)
    if (Object.is(next, state)) return
    state = next
    const nextTree = render()
    const ops = diff(tree, nextTree)
    tree = nextTree
    if (ops.length > 0) host.apply(ops)
  }

  tree = render()
  host.apply([{ op: 'replace', path: [], node: tree }])
  return { dispatch, getState: () => state }
}

    // ---------- DOM-хост: ті самі операції, що applyOps, але на справжньому DOM
    function createDomHost(container, onOps = () => {}) {
      function setProp(el, name, value) {
        if (/^on[A-Z]/.test(name)) {
          const event = name.slice(2).toLowerCase()
          el.__handlers ??= {}
          if (!(event in el.__handlers)) el.addEventListener(event, (e) => el.__handlers[event]?.(e))
          el.__handlers[event] = value
        } else if (name === 'className') el.className = value ?? ''
        else if (name in el && typeof el[name] !== 'function') el[name] = value
        else if (value === false || value == null) el.removeAttribute(name)
        else el.setAttribute(name, value === true ? '' : value)
      }
      function removeProp(el, name) {
        if (/^on[A-Z]/.test(name)) el.__handlers[name.slice(2).toLowerCase()] = null
        else if (name === 'className') el.className = ''
        else if (typeof el[name] === 'boolean') el[name] = false
        else el.removeAttribute(name)
      }
      function createNode(vnode) {
        if (vnode.type === TEXT) return document.createTextNode(vnode.text)
        const el = document.createElement(vnode.type)
        for (const [name, value] of Object.entries(vnode.props)) setProp(el, name, value)
        for (const child of vnode.children) el.append(createNode(child))
        return el
      }
      function domAt(path) {
        let node = container.firstChild
        for (const i of path) node = node.childNodes[i]
        return node
      }
      return {
        apply(ops) {
          onOps(ops)
          for (const op of ops) {
            const parent = op.path.length ? domAt(op.path.slice(0, -1)) : container
            const index = op.path.at(-1)
            switch (op.op) {
              case 'create': parent.insertBefore(createNode(op.node), parent.childNodes[index] ?? null); break
              case 'remove': parent.removeChild(parent.childNodes[index]); break
              case 'replace':
                if (op.path.length === 0) container.replaceChildren(createNode(op.node))
                else parent.replaceChild(createNode(op.node), parent.childNodes[index])
                break
              case 'text': domAt(op.path).nodeValue = op.value; break
              case 'props': {
                const el = domAt(op.path)
                for (const name of op.remove) removeProp(el, name)
                for (const [name, value] of Object.entries(op.set)) setProp(el, name, value)
                break
              }
              case 'move': {
                const host = domAt(op.path)
                const node = host.childNodes[op.from]
                host.removeChild(node)
                host.insertBefore(node, host.childNodes[op.to] ?? null)
                break
              }
            }
          }
        },
      }
    }

    // ---------- застосунок
    let nextId = 4
    const init = { draft: '', items: [{ id: 1, title: 'Хліб', done: false }, { id: 2, title: 'Молоко', done: true }, { id: 3, title: 'Кава', done: false }] }

    function update(state, msg) {
      switch (msg.type) {
        case 'draft': return { ...state, draft: msg.value }
        case 'add': return state.draft.trim() ? { draft: '', items: [{ id: nextId++, title: state.draft.trim(), done: false }, ...state.items] } : state
        case 'toggle': return { ...state, items: state.items.map((i) => (i.id === msg.id ? { ...i, done: !i.done } : i)) }
        case 'remove': return { ...state, items: state.items.filter((i) => i.id !== msg.id) }
        case 'up': {
          const index = state.items.findIndex((i) => i.id === msg.id)
          if (index <= 0) return state
          const items = [...state.items]
          ;[items[index - 1], items[index]] = [items[index], items[index - 1]]
          return { ...state, items }
        }
        case 'shuffle': return { ...state, items: [...state.items].sort(() => Math.random() - 0.5) }
        default: return state
      }
    }

    const Item = ({ item, dispatch }) => h('li', { className: item.done ? 'done' : '' },
      h('input', { type: 'checkbox', checked: item.done, onChange: () => dispatch({ type: 'toggle', id: item.id }) }),
      ' ', h('span', null, item.title), ' ',
      h('input', { placeholder: 'нотатка…', size: 10 }),
      h('button', { onClick: () => dispatch({ type: 'up', id: item.id }) }, '⬆'),
      h('button', { onClick: () => dispatch({ type: 'remove', id: item.id }) }, '✕'),
    )

    function view(state, dispatch) {
      return h('main', null,
        h('h1', null, '🏗️ Покупки'),
        h('form', { onSubmit: (e) => { e.preventDefault(); dispatch({ type: 'add' }) } },
          h('input', { value: state.draft, placeholder: 'Що купити?', onInput: (e) => dispatch({ type: 'draft', value: e.target.value }) }),
          h('button', null, 'Додати'),
        ),
        h('ul', null, state.items.map((item) => h(Item, { key: item.id, item, dispatch }))),
        h('p', null, `Куплено ${state.items.filter((i) => i.done).length} з ${state.items.length}`),
        h('button', { onClick: () => dispatch({ type: 'shuffle' }) }, '🔀 Перемішати'),
      )
    }

    const log = document.getElementById('log')
    const host = createDomHost(document.getElementById('app'), (ops) => {
      const lines = ops.map((op) => `${op.op.padEnd(7)} [${op.path.join(',')}]${op.op === 'move' ? ` ${op.from}→${op.to}` : ''}${op.op === 'text' ? ` "${op.value}"` : ''}${op.op === 'props' ? ` ${Object.keys(op.set).join(',')}` : ''}`)
      log.textContent = `── ${ops.length} операцій ──\n${lines.join('\n')}\n\n${log.textContent}`.slice(0, 5000)
    })
    createApp({ init, update, view, host })
  </script>
</body>
</html>
```

> [!tip] Що помітити в лозі
> Кожен символ у полі «Що купити?» дає операції `props` (нове значення `value` і нові функції-обробники — бо стрілки створюються на кожен рендер). «⬆» — це один `move` плюс `props` обробників. Спробуй замінити `key: item.id` на `key: null` і перемішати: замість `move` побачиш десятки `text`, а нотатки «переїдуть» у чужі рядки.

## 📚 Джерела та що почитати

- 🟢 [React — Rendering Lists](https://react.dev/learn/rendering-lists) — навіщо ключі, з прикладами багів
- 🟢 [React — Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state) — як позиція й ключ визначають життя стану
- 🟡 [React (legacy) — Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html) — оригінальний опис евристик diff
- 🟡 [Elm Guide — The Elm Architecture](https://guide.elm-lang.org/architecture/) — `init / update / view` з першоджерела
- 🟡 [MDN — Node.insertBefore()](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore) — головна операція DOM-хоста (вона ж переміщує)
- 🛠️ [Snabbdom](https://github.com/snabbdom/snabbdom) — компактна бібліотека віртуального DOM, яку варто прочитати повністю
- 🛠️ [Hyperapp](https://github.com/jorgebucaran/hyperapp) — крихітний фреймворк в архітектурі Elm
- 🔴 [Wikipedia — Longest increasing subsequence](https://en.wikipedia.org/wiki/Longest_increasing_subsequence) — алгоритм для мінімальних переміщень у keyed-diff

> [!important] Підсумок
> - `h()` нормалізує дітей одразу; `key` — метадані реконсиляції, не атрибут.
> - Diff — чиста функція «два дерева → список операцій»; хост виконує їх у своєму середовищі.
> - Головний тест: `applyOps(toTree(old), diff(old, new)) ≡ toTree(new)`.
> - Різний тип — заміна піддерева; діти — за індексом або за ключами (move замість перестворення).
> - Компоненти розгортаються до diff; Elm-архітектура робить рендер детермінованим.
