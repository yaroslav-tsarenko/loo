---
title: Обʼєкти та порівняння
order: 2
level: middle
tags: [objects, recursion, deep-clone, deep-equal, security]
prerequisites:
  - "[[JavaScript - 03. Значення та посилання]]"
  - "[[JavaScript - 16. Обʼєкти глибоко]]"
  - "[[JavaScript - 23. JSON, structuredClone і серіалізація]]"
estimatedMinutes: 100
id: jsk-ch-02
icon: "🧬"
---

# JavaScript Katas - 02. Обʼєкти та порівняння

> [!success] 🎯 Що тренуємо
> - Рекурсивний обхід довільних структур: об'єкти, масиви, `Map`, `Set`, `Date`.
> - Розрізняти **власні** й **успадковані**, **перелічувані** й неперелічувані властивості.
> - Обробку циклічних посилань через `WeakMap` «вже бачених».
> - Захист від **prototype pollution** у `set` і `deepMerge` — улюблене follow-up питання security-орієнтованих команд.

## 🧭 Стратегія

Майже всі задачі цього розділу — один і той самий **рекурсивний обхід** з різною дією у вузлі. Шаблон:

```js
function walk(value) {
  if (value === null || typeof value !== 'object') return /* примітив — базовий випадок */
  if (value instanceof Date) return /* спецвипадок */
  if (Array.isArray(value)) return /* масив */
  for (const key of Object.keys(value)) walk(value[key])
}
```

**Чотири питання, які треба поставити собі (і інтерв'юеру):**

1. **Які типи підтримуємо?** Лише plain objects і масиви — чи ще `Date`, `RegExp`, `Map`, `Set`, екземпляри класів? Кожен тип — окрема гілка.
2. **Які ключі?** `Object.keys` — власні перелічувані рядкові. `Reflect.ownKeys` — ще й символи й неперелічувані. `for…in` — ще й успадковані (майже завжди не те, що треба).
3. **Цикли?** Якщо `obj.self = obj`, наївна рекурсія піде в нескінченність. Рятує `WeakMap` «оригінал → копія» (для clone) або пари «вже порівнюємо» (для equal).
4. **Безпека?** Ключі `__proto__`, `constructor`, `prototype` у даних з `JSON.parse` можуть змінити `Object.prototype` для всієї програми. Фільтруй їх у будь-якому коді, що пише за довільним шляхом.

> [!tip] Розрізни посилання і значення
> `===` на об'єктах порівнює **адреси**, а не вміст — тому і потрібен `deepEqual`. Детально в [[JavaScript - 03. Значення та посилання]].

## 🧩 Збери з пам'яті

> [!quiz] Заповни пропуски в deepClone з підтримкою циклів
> level: middle · type: fill · id: jsk-02-quiz-01 · bank: add, assign, from
>
> ```js fill
> function deepClone(value, seen = new [[WeakMap]]()) {
>   if (value === null || typeof value !== 'object') return value
>   if (seen.[[has]](value)) return seen.[[get]](value)
>   const copy = Array.isArray(value) ? [] : Object.[[create]](Object.getPrototypeOf(value))
>   seen.[[set]](value, copy)
>   for (const key of Object.keys(value)) copy[key] = deepClone(value[key], seen)
>   return copy
> }
> ```
>
> **Пояснення:** копію треба записати в `seen` **до** рекурсії по дітях — інакше цикл `obj.self = obj` не побачить, що вузол уже копіюється. `WeakMap` не тримає оригінали в пам'яті після завершення.

> [!quiz] Збери `get(obj, path, defaultValue)`
> level: middle · type: order · id: jsk-02-quiz-02
>
> ```js order
> const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.')
> let current = obj
> for (const key of keys) {
>   if (current == null) return defaultValue
>   current = current[key]
> }
> return current === undefined ? defaultValue : current
> return current || defaultValue   // ✗
> ```
>
> **Пояснення:** `current == null` ловить і `null`, і `undefined` на проміжних рівнях. `current || defaultValue` — пастка: поверне дефолт для `0`, `''` і `false`.

> [!quiz] Заповни пропуски в deepEqual для plain objects
> level: middle · type: fill · id: jsk-02-quiz-03
>
> ```js fill
> if (a === b) return true
> if (typeof a !== 'object' || typeof b !== 'object' || a === [[null]] || b === null) return false
> if (Object.[[getPrototypeOf]](a) !== Object.getPrototypeOf(b)) return false
> const keysA = Object.[[keys]](a)
> if (keysA.length !== Object.keys(b).[[length]]) return false
> return keysA.[[every]]((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]))
> ```
>
> **Пояснення:** однакова кількість ключів + кожен ключ `a` є власним у `b` з рівним значенням = однакові набори ключів. Порівняння прототипів відрізняє `[1]` від `{ 0: 1 }` і екземпляр класу від plain object.

## 🛠️ Задачі

> [!task] isEmpty
> level: junior · difficulty: easy · id: jsk-02-task-01 · tags: objects, types
>
> Напиши `isEmpty(value)` у стилі lodash:
>
> - `null` / `undefined` → `true`;
> - рядок і масив → порожні, якщо `length === 0`;
> - `Map` і `Set` → порожні, якщо `size === 0`;
> - інші об'єкти → порожні, якщо немає **власних перелічуваних рядкових** ключів;
> - числа, булеві, символи, функції → `true` (у них немає «вмісту»).
>
> ```js starter
> function isEmpty(value) {
>   // твій код
> }
> ```
>
> ```js tests
> test('null і undefined', () => {
>   expect(isEmpty(null)).toBe(true)
>   expect(isEmpty(undefined)).toBe(true)
> })
>
> test('рядки й масиви', () => {
>   expect(isEmpty('')).toBe(true)
>   expect(isEmpty(' ')).toBe(false)
>   expect(isEmpty([])).toBe(true)
>   expect(isEmpty([undefined])).toBe(false)
> })
>
> test('об\'єкти: ключ зі значенням undefined — не порожній', () => {
>   expect(isEmpty({})).toBe(true)
>   expect(isEmpty({ a: undefined })).toBe(false)
> })
>
> test('Map і Set', () => {
>   expect(isEmpty(new Map())).toBe(true)
>   expect(isEmpty(new Map([[1, 1]]))).toBe(false)
>   expect(isEmpty(new Set())).toBe(true)
>   expect(isEmpty(new Set([0]))).toBe(false)
> })
>
> test('успадковані й символьні ключі не рахуються', () => {
>   expect(isEmpty(Object.create({ inherited: 1 }))).toBe(true)
>   expect(isEmpty({ [Symbol('s')]: 1 })).toBe(true)
> })
>
> test('примітиви без вмісту', () => {
>   expect(isEmpty(0)).toBe(true)
>   expect(isEmpty(42)).toBe(true)
>   expect(isEmpty(true)).toBe(true)
> })
> ```
>
> > [!hint]- Підказка 1
> > `value == null` одним порівнянням ловить і `null`, і `undefined`.
>
> > [!hint]- Підказка 2
> > Порядок перевірок важливий: `Map` теж `typeof 'object'`, але `Object.keys(new Map([[1, 1]]))` — порожній масив.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function isEmpty(value) {
> >   if (value == null) return true
> >   if (typeof value === 'string' || Array.isArray(value)) return value.length === 0
> >   if (value instanceof Map || value instanceof Set) return value.size === 0
> >   if (typeof value === 'object') return Object.keys(value).length === 0
> >   return true
> > }
> > ```
> > **Складність:** O(k) для об'єктів (через `Object.keys`), O(1) для решти. **Чому так:** спершу спеціальні типи, потім загальний випадок — інакше `Map` впаде в гілку «об'єкт» і завжди буде «порожнім». **Що спитають далі:** «як зробити O(1) для великих об'єктів?» — `for (const k in obj) if (Object.hasOwn(obj, k)) return false` зупиняється на першому ключі.

> [!task] Інвертуй об'єкт
> level: junior · difficulty: easy · id: jsk-02-task-02 · tags: objects
>
> Напиши `invert(obj)`: поверни **новий** об'єкт, де ключі й значення помінялися місцями. Значення стають рядковими ключами; при дублікатах перемагає **останній** ключ. Лише власні перелічувані властивості.
>
> - `invert({ a: 'x', b: 'y' })` → `{ x: 'a', y: 'b' }`
> - `invert({ a: 1, b: 1 })` → `{ '1': 'b' }`
>
> ```js starter
> function invert(obj) {
>   // твій код
> }
> ```
>
> ```js tests
> test('базовий випадок', () => {
>   expect(invert({ a: 'x', b: 'y' })).toEqual({ x: 'a', y: 'b' })
> })
>
> test('дублікати значень — перемагає останній', () => {
>   expect(invert({ a: 1, b: 1, c: 2 })).toEqual({ 1: 'b', 2: 'c' })
> })
>
> test('значення приводяться до рядків', () => {
>   const result = invert({ yes: true, nothing: null })
>   expect(Object.keys(result).sort()).toEqual(['null', 'true'])
>   expect(result.true).toBe('yes')
> })
>
> test('порожній об\'єкт', () => {
>   expect(invert({})).toEqual({})
> })
>
> test('не мутує і не бере успадковане', () => {
>   const proto = { inherited: 'z' }
>   const obj = Object.create(proto)
>   obj.own = 'o'
>   expect(invert(obj)).toEqual({ o: 'own' })
>   expect(obj.own).toBe('o')
> })
> ```
>
> > [!hint]- Підказка 1
> > `Object.entries` дає лише власні перелічувані пари `[ключ, значення]`.
>
> > [!hint]- Підказка 2
> > Присвоєння `result[value] = key` саме приведе значення до рядка і перезапише дублікати.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function invert(obj) {
> >   const result = {}
> >   for (const [key, value] of Object.entries(obj)) {
> >     result[value] = key
> >   }
> >   return result
> > }
> > ```
> > **Складність:** O(n). **Чому так:** властивість об'єкта — завжди рядок або символ, тож `result[true]` стає `result['true']`. **Що спитають далі:** «зберегти всі ключі для дубліката?» — `invertBy`: значення стає масивом ключів; «а якщо значення — об'єкт?» — ключ `'[object Object]'`, краще `Map`.

> [!task] pick і omit
> level: junior · difficulty: easy · id: jsk-02-task-03 · tags: objects
>
> Напиши дві функції, що повертають **новий** об'єкт і не мутують вхідний:
>
> - `pick(obj, keys)` — лише перелічені **власні** ключі; відсутні ключі не додаються (навіть як `undefined`).
> - `omit(obj, keys)` — усі власні перелічувані ключі, крім перелічених.
>
> ```js starter
> function pick(obj, keys) {
>   // твій код
> }
>
> function omit(obj, keys) {
>   // твій код
> }
> ```
>
> ```js tests
> test('pick бере лише вказані ключі', () => {
>   expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
> })
>
> test('pick не додає відсутні ключі', () => {
>   const result = pick({ a: 1 }, ['a', 'zzz'])
>   expect(Object.keys(result)).toEqual(['a'])
> })
>
> test('pick зберігає власний ключ зі значенням undefined', () => {
>   expect(Object.keys(pick({ a: undefined, b: 1 }, ['a']))).toEqual(['a'])
> })
>
> test('pick не бере успадковані властивості', () => {
>   const obj = Object.create({ inherited: 1 })
>   expect(Object.keys(pick(obj, ['inherited', 'toString']))).toEqual([])
> })
>
> test('omit прибирає вказані ключі', () => {
>   expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 })
>   expect(omit({ a: 1 }, ['zzz'])).toEqual({ a: 1 })
> })
>
> test('обидві не мутують і повертають новий об\'єкт', () => {
>   const obj = { a: 1, b: 2 }
>   const picked = pick(obj, ['a', 'b'])
>   const omitted = omit(obj, [])
>   expect(picked === obj).toBe(false)
>   expect(omitted === obj).toBe(false)
>   expect(obj).toEqual({ a: 1, b: 2 })
> })
> ```
>
> > [!hint]- Підказка 1
> > Для `pick` перевіряй `Object.hasOwn(obj, key)` — оператор `in` побачить і успадковане (`toString`).
>
> > [!hint]- Підказка 2
> > Для `omit` зручно зробити `Set` із ключів, що треба прибрати, і відфільтрувати `Object.entries`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function pick(obj, keys) {
> >   const result = {}
> >   for (const key of keys) {
> >     if (Object.hasOwn(obj, key)) result[key] = obj[key]
> >   }
> >   return result
> > }
> >
> > function omit(obj, keys) {
> >   const skip = new Set(keys)
> >   return Object.fromEntries(Object.entries(obj).filter(([key]) => !skip.has(key)))
> > }
> > ```
> > **Складність:** pick — O(k), omit — O(n + k). **Чому так:** `Set` робить перевірку «пропустити?» O(1), а `keys.includes` у циклі — O(n · k). **Що спитають далі:** «вкладені шляхи `pick(obj, ['a.b'])`?» — поєднати з `get`/`set` з наступної задачі; «типізуй у TypeScript» — `Pick<T, K>` і `Omit<T, K>`.

> [!task] get і set за шляхом
> level: middle · difficulty: medium · id: jsk-02-task-04 · tags: objects, paths, security
>
> Напиши дві функції:
>
> - `get(obj, path, defaultValue)` — значення за шляхом `'a.b[0].c'` або масивом `['a', 'b', '0', 'c']`. Якщо шлях обривається або результат `undefined` — поверни `defaultValue`. `null` на кінці — це значення, а не «нема».
> - `set(obj, path, value)` — записує значення, створюючи відсутні контейнери: **масив**, якщо наступний ключ — невід'ємне ціле число, інакше об'єкт. Мутує й повертає `obj`. Шляхи з `__proto__`, `constructor` чи `prototype` **ігноруються** (захист від prototype pollution).
>
> ```js starter
> function get(obj, path, defaultValue) {
>   // твій код
> }
>
> function set(obj, path, value) {
>   // твій код
> }
> ```
>
> ```js tests
> test('get: крапки й квадратні дужки', () => {
>   const obj = { a: { b: [{ c: 42 }] } }
>   expect(get(obj, 'a.b[0].c')).toBe(42)
>   expect(get(obj, 'a.b.0.c')).toBe(42)
>   expect(get(obj, ['a', 'b', '0', 'c'])).toBe(42)
> })
>
> test('get: відсутній шлях і null посередині дають default', () => {
>   const obj = { a: null, b: {} }
>   expect(get(obj, 'a.x.y', 'def')).toBe('def')
>   expect(get(obj, 'b.c.d', 'def')).toBe('def')
>   expect(get(obj, 'zzz')).toBe(undefined)
> })
>
> test('get: falsy-значення — не привід для default', () => {
>   const obj = { zero: 0, empty: '', no: false, nil: null }
>   expect(get(obj, 'zero', 'def')).toBe(0)
>   expect(get(obj, 'empty', 'def')).toBe('')
>   expect(get(obj, 'no', 'def')).toBe(false)
>   expect(get(obj, 'nil', 'def')).toBe(null)
> })
>
> test('get: вкладені індекси', () => {
>   expect(get({ m: [[1, 2], [3, 4]] }, 'm[1][0]')).toBe(3)
> })
>
> test('set: створює вкладені об\'єкти й повертає той самий obj', () => {
>   const obj = {}
>   expect(set(obj, 'a.b.c', 1)).toBe(obj)
>   expect(obj).toEqual({ a: { b: { c: 1 } } })
> })
>
> test('set: створює масив для числового ключа', () => {
>   const obj = set({}, 'list[0].name', 'x')
>   expect(Array.isArray(obj.list)).toBe(true)
>   expect(obj).toEqual({ list: [{ name: 'x' }] })
> })
>
> test('set: не чіпає сусідні ключі й перезаписує значення', () => {
>   const obj = { a: { keep: true, v: 1 } }
>   set(obj, ['a', 'v'], 2)
>   expect(obj).toEqual({ a: { keep: true, v: 2 } })
> })
>
> test('set: захист від prototype pollution', () => {
>   try {
>     set({}, '__proto__.polluted', 'yes')
>     set({}, 'constructor.prototype.polluted', 'yes')
>     expect({}.polluted).toBe(undefined)
>   } finally {
>     delete Object.prototype.polluted
>   }
> })
> ```
>
> > [!hint]- Підказка 1
> > Спільний парсер шляху: `Array.isArray(path) ? path : path.replace(/\[([^\]]+)\]/g, '.$1').split('.').filter(Boolean)`.
>
> > [!hint]- Підказка 2
> > У `set` іди до передостаннього ключа. Якщо контейнера немає (або він не об'єкт) — створи `[]` чи `{}` залежно від **наступного** ключа: `/^\d+$/.test(next)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function toKeys(path) {
> >   if (Array.isArray(path)) return path.map(String)
> >   return String(path).replace(/\[([^\]]+)\]/g, '.$1').split('.').filter(Boolean)
> > }
> >
> > function get(obj, path, defaultValue) {
> >   let current = obj
> >   for (const key of toKeys(path)) {
> >     if (current == null) return defaultValue
> >     current = current[key]
> >   }
> >   return current === undefined ? defaultValue : current
> > }
> >
> > const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])
> >
> > function set(obj, path, value) {
> >   const keys = toKeys(path)
> >   if (keys.length === 0 || keys.some((key) => UNSAFE_KEYS.has(key))) return obj
> >   let current = obj
> >   for (let i = 0; i < keys.length - 1; i++) {
> >     const key = keys[i]
> >     if (current[key] === null || typeof current[key] !== 'object') {
> >       current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {}
> >     }
> >     current = current[key]
> >   }
> >   current[keys[keys.length - 1]] = value
> >   return obj
> > }
> > ```
> > **Складність:** O(довжини шляху). **Чому так:** `current == null` захищає від `TypeError` на `null.x`; `=== undefined` замість `||` не плутає `0`/`''`/`false` з відсутністю. Без фільтра `__proto__` виклик `set({}, '__proto__.isAdmin', true)` зробить **кожен** об'єкт програми «адміном». **Що спитають далі:** «ключі з крапками всередині (`'a["x.y"]'`)?» — повноцінний токенізатор шляху; «як іще захиститися?» — `Object.create(null)` для словників, `Map`, `Object.freeze(Object.prototype)`.

> [!task] deepEqual
> level: middle · difficulty: medium · id: jsk-02-task-05 · tags: recursion, equality
>
> Напиши `deepEqual(a, b)` — структурне порівняння:
>
> - примітиви — як `===`, але `NaN` дорівнює `NaN`;
> - масиви — однакова довжина і поелементна рівність; масив не дорівнює об'єкту `{ 0: …, length: … }`;
> - об'єкти — однакові прототипи і однакові набори **власних перелічуваних** ключів (порядок не важливий); `{ a: undefined }` ≠ `{}`;
> - `Date` — за часом; `Map` — однакові ключі з глибоко рівними значеннями; `Set` — однакові значення (за `has`).
>
> ```js starter
> function deepEqual(a, b) {
>   // твій код
> }
> ```
>
> ```js tests
> test('примітиви і NaN', () => {
>   expect(deepEqual(1, 1)).toBe(true)
>   expect(deepEqual('a', 'b')).toBe(false)
>   expect(deepEqual(NaN, NaN)).toBe(true)
>   expect(deepEqual(1, '1')).toBe(false)
>   expect(deepEqual(null, undefined)).toBe(false)
> })
>
> test('вкладені об\'єкти, порядок ключів не важливий', () => {
>   expect(deepEqual({ a: 1, b: { c: [1, 2] } }, { b: { c: [1, 2] }, a: 1 })).toBe(true)
>   expect(deepEqual({ a: 1, b: { c: [1, 2] } }, { a: 1, b: { c: [1, 3] } })).toBe(false)
> })
>
> test('різні набори ключів', () => {
>   expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
>   expect(deepEqual({ a: undefined }, {})).toBe(false)
>   expect(deepEqual({ a: undefined }, { b: undefined })).toBe(false)
> })
>
> test('масив ≠ схожий об\'єкт', () => {
>   expect(deepEqual([1], { 0: 1, length: 1 })).toBe(false)
>   expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
>   expect(deepEqual([], [])).toBe(true)
> })
>
> test('null проти об\'єкта', () => {
>   expect(deepEqual(null, {})).toBe(false)
>   expect(deepEqual({}, null)).toBe(false)
>   expect(deepEqual(null, null)).toBe(true)
> })
>
> test('Date', () => {
>   expect(deepEqual(new Date(0), new Date(0))).toBe(true)
>   expect(deepEqual(new Date(0), new Date(1))).toBe(false)
>   expect(deepEqual(new Date(0), {})).toBe(false)
> })
>
> test('Map і Set', () => {
>   expect(deepEqual(new Map([['a', { x: 1 }]]), new Map([['a', { x: 1 }]]))).toBe(true)
>   expect(deepEqual(new Map([['a', 1]]), new Map([['b', 1]]))).toBe(false)
>   expect(deepEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true)
>   expect(deepEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false)
> })
>
> test('різні прототипи', () => {
>   class Point {
>     constructor(x) { this.x = x }
>   }
>   expect(deepEqual(new Point(1), { x: 1 })).toBe(false)
>   expect(deepEqual(new Point(1), new Point(1))).toBe(true)
> })
> ```
>
> > [!hint]- Підказка 1
> > Базові випадки: `Object.is`-подібна рівність (з урахуванням `NaN`), потім «хоч один не об'єкт або `null`» → `false`.
>
> > [!hint]- Підказка 2
> > Порівняй прототипи — це одразу відсіює масив проти об'єкта і `Date` проти `{}`. Далі гілки за типом: `Date`, `Map`, `Set`, решта — за ключами.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function deepEqual(a, b) {
> >   if (a === b || (Number.isNaN(a) && Number.isNaN(b))) return true
> >   if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
> >   if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false
> >
> >   if (a instanceof Date) return a.getTime() === b.getTime()
> >   if (a instanceof Map) {
> >     if (a.size !== b.size) return false
> >     for (const [key, value] of a) {
> >       if (!b.has(key) || !deepEqual(value, b.get(key))) return false
> >     }
> >     return true
> >   }
> >   if (a instanceof Set) {
> >     if (a.size !== b.size) return false
> >     for (const value of a) if (!b.has(value)) return false
> >     return true
> >   }
> >
> >   const keysA = Object.keys(a)
> >   if (keysA.length !== Object.keys(b).length) return false
> >   return keysA.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]))
> > }
> > ```
> > **Складність:** O(N) — розмір меншої структури. **Чому так:** перевірка прототипів одним рядком відсікає цілий клас помилок; для масивів `Object.keys` повертає індекси, тож окрема гілка не потрібна (довжина вже врахована кількістю ключів). **Що спитають далі:** «циклічні посилання?» — передавати `Map` пар, які вже порівнюються, і вважати їх рівними при повторному візиті; «`Set` з об'єктами?» — O(n²) пошук пари через `deepEqual`.

> [!task] deepMerge без prototype pollution
> level: middle · difficulty: medium · id: jsk-02-task-06 · tags: objects, recursion, security
>
> Напиши `deepMerge(...objects)`: поверни **новий** об'єкт, злитий зліва направо.
>
> - plain objects зливаються рекурсивно;
> - масиви й інші значення (`Date`, `null`, примітиви) **замінюються** (масив — поверхневою копією);
> - `undefined` у джерелі **не** перезаписує значення;
> - вхідні об'єкти не мутуються, і результат не ділить з ними вкладених plain objects;
> - ключі `__proto__`, `constructor`, `prototype` ігноруються.
>
> - `deepMerge({ a: { x: 1 } }, { a: { y: 2 } })` → `{ a: { x: 1, y: 2 } }`
>
> ```js starter
> function deepMerge(...objects) {
>   // твій код
> }
> ```
>
> ```js tests
> test('рекурсивне злиття', () => {
>   expect(deepMerge({ a: { x: 1, deep: { k: 1 } } }, { a: { y: 2, deep: { m: 2 } } })).toEqual({ a: { x: 1, y: 2, deep: { k: 1, m: 2 } } })
> })
>
> test('масиви замінюються, а не зливаються', () => {
>   expect(deepMerge({ list: [1, 2, 3] }, { list: [9] })).toEqual({ list: [9] })
> })
>
> test('undefined не перезаписує, null — перезаписує', () => {
>   expect(deepMerge({ a: 1, b: 2 }, { a: undefined, b: null })).toEqual({ a: 1, b: null })
> })
>
> test('кілька джерел, правіше — сильніше', () => {
>   expect(deepMerge({ v: 1 }, { v: 2 }, { v: 3, w: 1 })).toEqual({ v: 3, w: 1 })
> })
>
> test('примітив замінюється об\'єктом і навпаки', () => {
>   expect(deepMerge({ a: 1 }, { a: { b: 1 } })).toEqual({ a: { b: 1 } })
>   expect(deepMerge({ a: { b: 1 } }, { a: 5 })).toEqual({ a: 5 })
> })
>
> test('не мутує входи і не ділить вкладені об\'єкти', () => {
>   const first = { a: { x: 1 } }
>   const second = { a: { y: 2 }, list: [1] }
>   const result = deepMerge(first, second)
>   expect(first).toEqual({ a: { x: 1 } })
>   expect(second).toEqual({ a: { y: 2 }, list: [1] })
>   expect(result.a === first.a || result.a === second.a).toBe(false)
>   expect(result.list === second.list).toBe(false)
> })
>
> test('Date копіюється як значення, а не зливається як об\'єкт', () => {
>   const date = new Date(0)
>   expect(deepMerge({ d: { x: 1 } }, { d: date }).d).toBe(date)
> })
>
> test('захист від prototype pollution', () => {
>   try {
>     const result = deepMerge({}, JSON.parse('{"__proto__": {"polluted": "yes"}, "ok": 1}'))
>     expect({}.polluted).toBe(undefined)
>     expect(result.ok).toBe(1)
>   } finally {
>     delete Object.prototype.polluted
>   }
> })
> ```
>
> > [!hint]- Підказка 1
> > Допоміжна `isPlainObject(v)`: не `null`, `typeof 'object'`, прототип — `Object.prototype` або `null`.
>
> > [!hint]- Підказка 2
> > Зливай у **свіжий** `{}` функцією `mergeInto(target, source)`: якщо значення — plain object, а в цілі не plain object — спершу створи `{}`, потім рекурсія.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])
> >
> > function isPlainObject(value) {
> >   if (value === null || typeof value !== 'object') return false
> >   const proto = Object.getPrototypeOf(value)
> >   return proto === Object.prototype || proto === null
> > }
> >
> > function mergeInto(target, source) {
> >   for (const key of Object.keys(source)) {
> >     if (UNSAFE_KEYS.has(key)) continue
> >     const value = source[key]
> >     if (value === undefined) continue
> >     if (isPlainObject(value)) {
> >       if (!Object.hasOwn(target, key) || !isPlainObject(target[key])) target[key] = {}
> >       mergeInto(target[key], value)
> >     } else if (Array.isArray(value)) {
> >       target[key] = [...value]
> >     } else {
> >       target[key] = value
> >     }
> >   }
> > }
> >
> > function deepMerge(...objects) {
> >   const result = {}
> >   for (const obj of objects) {
> >     if (isPlainObject(obj)) mergeInto(result, obj)
> >   }
> >   return result
> > }
> > ```
> > **Складність:** O(сумарного розміру входів). **Чому так:** зливаючи у свіжі `{}`, ми ніколи не пишемо у вхідні об'єкти. `JSON.parse` створює **власний** ключ `"__proto__"`; без фільтра `target['__proto__']` повертає `Object.prototype`, і рекурсія записує `polluted` туди — у прототип усіх об'єктів. **Що спитають далі:** «масиви зливати за індексом чи конкатенувати?» — стратегія як параметр (`customizer` у lodash `mergeWith`); «цикли в джерелі?» — `WeakMap` відвіданих.

> [!task] deepClone з циклами, Map, Set і прототипами
> level: senior · difficulty: hard · id: jsk-02-task-07 · tags: recursion, weakmap, deep-clone
>
> Напиши `deepClone(value)`:
>
> - примітиви й **функції** повертаються як є;
> - `Date` і `RegExp` — нові екземпляри з тим самим значенням;
> - `Map` і `Set` — нові колекції з клонованими **значеннями** (ключі `Map` лишаються тими самими);
> - масиви й об'єкти — глибока копія власних перелічуваних ключів, **включно із символами**; прототип зберігається (екземпляр класу лишається екземпляром);
> - **циклічні** і **спільні** посилання відтворюються у копії.
>
> `structuredClone` тут не підійде: він кидає помилку на функціях і губить прототипи.
>
> ```js starter
> function deepClone(value) {
>   // твій код
> }
> ```
>
> ```js tests
> test('примітиви й функції повертаються як є', () => {
>   const fn = () => 1
>   expect(deepClone(5)).toBe(5)
>   expect(deepClone('s')).toBe('s')
>   expect(deepClone(null)).toBe(null)
>   expect(deepClone(fn)).toBe(fn)
> })
>
> test('глибока незалежна копія', () => {
>   const original = { a: { b: [1, { c: 2 }] } }
>   const copy = deepClone(original)
>   expect(copy).toEqual(original)
>   expect(copy.a === original.a).toBe(false)
>   copy.a.b[1].c = 99
>   expect(original.a.b[1].c).toBe(2)
> })
>
> test('Date і RegExp', () => {
>   const original = { d: new Date(1000), r: /ab+c/gi }
>   const copy = deepClone(original)
>   expect(copy.d === original.d).toBe(false)
>   expect(copy.d.getTime()).toBe(1000)
>   expect(copy.r === original.r).toBe(false)
>   expect(copy.r.source).toBe('ab+c')
>   expect(copy.r.flags).toBe('gi')
> })
>
> test('Map і Set з об\'єктами всередині', () => {
>   const inner = { x: 1 }
>   const original = { m: new Map([['k', inner]]), s: new Set([inner]) }
>   const copy = deepClone(original)
>   expect(copy.m instanceof Map).toBe(true)
>   expect(copy.m.get('k')).toEqual({ x: 1 })
>   expect(copy.m.get('k') === inner).toBe(false)
>   expect([...copy.s][0] === inner).toBe(false)
> })
>
> test('циклічне посилання', () => {
>   const original = { name: 'loop' }
>   original.self = original
>   const copy = deepClone(original)
>   expect(copy.self).toBe(copy)
>   expect(copy === original).toBe(false)
> })
>
> test('спільні посилання лишаються спільними', () => {
>   const shared = { v: 1 }
>   const copy = deepClone({ a: shared, b: shared })
>   expect(copy.a).toBe(copy.b)
>   expect(copy.a === shared).toBe(false)
> })
>
> test('прототип і методи класу зберігаються', () => {
>   class Point {
>     constructor(x, y) { this.x = x; this.y = y }
>     sum() { return this.x + this.y }
>   }
>   const copy = deepClone({ p: new Point(1, 2) })
>   expect(copy.p instanceof Point).toBe(true)
>   expect(copy.p.sum()).toBe(3)
> })
>
> test('функції-властивості й символьні ключі копіюються', () => {
>   const key = Symbol('id')
>   const original = { [key]: { v: 1 }, greet() { return 'hi' } }
>   const copy = deepClone(original)
>   expect(copy.greet()).toBe('hi')
>   expect(copy[key]).toEqual({ v: 1 })
>   expect(copy[key] === original[key]).toBe(false)
> })
> ```
>
> > [!hint]- Підказка 1
> > Другий параметр `seen = new WeakMap()` — відповідність «оригінал → копія». Перевіряй його на вході й записуй копію **до** рекурсії по дітях.
>
> > [!hint]- Підказка 2
> > Об'єкт створюй через `Object.create(Object.getPrototypeOf(value))`, а ключі бери з `Reflect.ownKeys`, фільтруючи неперелічувані (у масиву це `length`).
>
> > [!solution]- Еталонне рішення
> > ```js
> > function deepClone(value, seen = new WeakMap()) {
> >   if (value === null || typeof value !== 'object') return value
> >   if (seen.has(value)) return seen.get(value)
> >
> >   if (value instanceof Date) return remember(new Date(value.getTime()))
> >   if (value instanceof RegExp) return remember(new RegExp(value.source, value.flags))
> >   if (value instanceof Map) {
> >     const copy = remember(new Map())
> >     for (const [key, item] of value) copy.set(key, deepClone(item, seen))
> >     return copy
> >   }
> >   if (value instanceof Set) {
> >     const copy = remember(new Set())
> >     for (const item of value) copy.add(deepClone(item, seen))
> >     return copy
> >   }
> >
> >   const copy = remember(Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value)))
> >   for (const key of Reflect.ownKeys(value)) {
> >     if (!Object.prototype.propertyIsEnumerable.call(value, key)) continue
> >     copy[key] = deepClone(value[key], seen)
> >   }
> >   return copy
> >
> >   function remember(copy) {
> >     seen.set(value, copy)
> >     return copy
> >   }
> > }
> > ```
> > **Складність:** O(N) часу й пам'яті, N — кількість вузлів (кожен клонується один раз завдяки `seen`). **Чому так:** `seen` одночасно розв'язує цикли й спільні посилання; `WeakMap` не заважає GC. `Object.create(proto)` зберігає методи класу без виклику конструктора (який міг би мати побічні ефекти). **Що спитають далі:** «геттери й неперелічувані властивості?» — копіювати дескриптори через `Object.getOwnPropertyDescriptors`; «приватні поля `#x`?» — скопіювати неможливо без участі класу; «дуже глибокі структури?» — ітеративний обхід зі стеком.

## 🎤 На співбесіді

> [!interview] Чим відрізняються `JSON.parse(JSON.stringify(x))`, `structuredClone(x)` і власний deepClone?
> level: middle · frequency: дуже часто · id: jsk-02-int-01
>
> ---
>
> JSON-трюк губить `undefined`, функції й символи, перетворює `Date` на рядок, `Map`/`Set` — на `{}`, `NaN`/`Infinity` — на `null`, і падає на циклах. `structuredClone` підтримує цикли, `Date`, `RegExp`, `Map`, `Set`, типізовані масиви, `Error`, але кидає `DataCloneError` на функціях і DOM-вузлах і **губить прототипи** — екземпляр класу стає plain object. Власний deepClone потрібен, коли треба зберегти прототипи чи функції або підтримати власні типи. У продакшні за замовчуванням — `structuredClone`.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація]] · [MDN: structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) · [MDN: The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)

> [!interview] Що таке prototype pollution і як від неї захиститися?
> level: senior · frequency: часто · id: jsk-02-int-02
>
> ---
>
> Атака, коли дані ззовні (JSON, query string) містять ключ `__proto__` або `constructor.prototype`, а наївний `merge`/`set` записує за ним — і змінює `Object.prototype` для **всіх** об'єктів процесу. Наслідки: обхід перевірок (`if (user.isAdmin)`), DoS, інколи RCE через гаджети в бібліотеках. Захист: фільтрувати небезпечні ключі, зливати лише власні ключі, використовувати `Object.create(null)` або `Map` для словників, валідувати схему вводу, у Node — `--disable-proto=delete`, за потреби `Object.freeze(Object.prototype)`.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript]] · [MDN: Prototype pollution](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution)

> [!interview] Як порівняти дві структури з циклічними посиланнями?
> level: senior · frequency: іноді · id: jsk-02-int-03
>
> ---
>
> Наївна рекурсія піде в нескінченність. Передаю в рекурсію `Map` (або масив пар) «a → b, які вже порівнюються». Якщо зустрічаю пару повторно — вважаю її рівною (коїндуктивне припущення: якщо десь глибше є відмінність, її знайде інша гілка). Важливо перевіряти саме **пару**, а не лише `a`: інакше `{ self: a }` порівняється рівним з будь-чим. Так роблять lodash `isEqual` і Node `assert.deepStrictEqual`.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко]] · [Node.js: assert.deepStrictEqual](https://nodejs.org/api/assert.html#assertdeepstrictequalactual-expected-message) · [GreatFrontEnd: Deep Equal](https://www.greatfrontend.com/questions/javascript/deep-equal)

## ⚡ Фішки

> [!reel] ☠️ `__proto__` з JSON — це власний ключ
> `JSON.parse('{"__proto__": {}}')` створює **звичайну** властивість з ім'ям `__proto__`. Небезпечно стає тоді, коли твій merge робить `target[key] = …` — ось там спрацьовує сетер прототипу.

> [!reel] 🧊 structuredClone губить класи
> Екземпляр класу після `structuredClone` — просто plain object: методів немає, `instanceof` — `false`.
>
> ```js
> class P { hi() {} }
> structuredClone(new P()) instanceof P // → false
> ```

> [!reel] 🎯 `get` з `||` — тихий баг
> `get(obj, 'count') || 10` поверне 10, якщо `count === 0`. Дефолт — тільки для `undefined`: `??` або явне `=== undefined`.

## 🧠 Закріплення

> [!question]- Чим `Object.keys`, `Reflect.ownKeys` і `for…in` відрізняються?
> *дуже часто · теорія* · `jsk-02-001`
>
> `Object.keys` — власні перелічувані рядкові ключі. `Reflect.ownKeys` — **усі** власні: рядкові й символьні, перелічувані й ні. `for…in` — перелічувані рядкові, **включно з успадкованими** по ланцюжку прототипів.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко]] · [MDN: Enumerability and ownership of properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Enumerability_and_ownership_of_properties)

> [!question]- Навіщо в deepClone `WeakMap`, а не `Map`?
> *часто · теорія* · `jsk-02-002`
>
> Обидва розв'язують цикли й спільні посилання. `WeakMap` тримає ключі слабко: якщо `seen` випадково переживе виклик (наприклад, кешуємо між викликами), оригінали все одно зможе зібрати GC. Для одноразового локального `seen` різниця мінімальна — але `WeakMap` показує, що ти про це думав.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] · [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)

> [!question]- Чому копію треба записати в `seen` до рекурсії по дітях?
> *часто · код* · `jsk-02-003`
>
> Бо діти можуть посилатися на батька (`obj.self = obj`). Якщо записати копію лише після обходу, рекурсія ще не знатиме, що вузол уже копіюється, і піде в нескінченність.
>
> 📚 [[JavaScript - 03. Значення та посилання]] · [javascript.info: Object references and copying](https://javascript.info/object-copy)

> [!question]- Як перевірити, що значення — plain object?
> *часто · код* · `jsk-02-004`
>
> `value !== null && typeof value === 'object'` і прототип — `Object.prototype` або `null` (`Object.create(null)`). `typeof` сам по собі не відрізняє масиви, `Date`, `Map` і екземпляри класів.
>
> 📚 [[JavaScript - 07. Прототипи та класи]] · [MDN: Object.getPrototypeOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)

> [!question]- Чому `pick` має використовувати `Object.hasOwn`, а не `in`?
> *іноді · пастка* · `jsk-02-005`
>
> `'toString' in {}` — `true`, бо `in` дивиться весь ланцюжок прототипів. `Object.hasOwn(obj, key)` — лише власні властивості, і на відміну від `obj.hasOwnProperty(key)` працює для `Object.create(null)`.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко]] · [MDN: Object.hasOwn()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)

> [!question]- Що поверне `deepEqual([1], { 0: 1, length: 1 })` і чому?
> *іноді · пастка* · `jsk-02-006`
>
> `false`: прототипи різні (`Array.prototype` проти `Object.prototype`). Без перевірки прототипу ключі `'0'` і `'length'`… теж не збіглися б (у масиву `length` неперелічуваний), але порівняння прототипів відсікає такі випадки одразу й дешево.
>
> 📚 [[JavaScript - 07. Прототипи та класи]] · [MDN: Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)

> [!question]- Чим `Object.is` відрізняється від `===`?
> *часто · теорія* · `jsk-02-007`
>
> Дві відмінності: `Object.is(NaN, NaN)` — `true` (а `NaN === NaN` — `false`), і `Object.is(0, -0)` — `false` (а `0 === -0` — `true`). Саме `Object.is` використовує `toBe` у тестах.
>
> 📚 [[JavaScript - 02. Типи та приведення типів]] · [MDN: Object.is()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Object references and copying](https://javascript.info/object-copy) — посилання, поверхнева й глибока копія
- 🟡 [MDN — structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) — що вміє вбудоване глибоке копіювання
- 🟡 [MDN — Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) — `==`, `===`, `Object.is`, SameValueZero
- 🟡 [MDN — Enumerability and ownership of properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Enumerability_and_ownership_of_properties) — таблиця, хто які ключі бачить
- 🔴 [MDN — Prototype pollution](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution) — механіка атаки і захист
- 🛠️ [GreatFrontEnd — Deep Clone](https://www.greatfrontend.com/questions/javascript/deep-clone) і [Deep Clone II](https://www.greatfrontend.com/questions/javascript/deep-clone-ii) — дві складності тієї ж задачі
- 🛠️ [GreatFrontEnd — Deep Merge](https://www.greatfrontend.com/questions/javascript/deep-merge) — злиття з іншими правилами для масивів
- 🛠️ [BFE.dev — implement _.get()](https://bigfrontend.dev/problem/implement-lodash-get) і [_.set()](https://bigfrontend.dev/problem/lodash-set) — шляхи з краєвими випадками
- 🛠️ [BFE.dev — implement deep equal _.isEqual()](https://bigfrontend.dev/problem/implement-deep-equal-isEqual) — з циклічними посиланнями

> [!important] Підсумок
> - Глибокі операції = рекурсивний обхід із гілками за типом: примітив → `Date`/`RegExp` → `Map`/`Set` → масив/об'єкт.
> - `WeakMap` «оригінал → копія» розв'язує і цикли, і спільні посилання; записуй копію до рекурсії.
> - Порівнюй прототипи: це відрізняє масив від об'єкта і клас від plain object.
> - Будь-який код, що пише за довільним ключем, фільтрує `__proto__`, `constructor`, `prototype`.
> - Дефолт — лише для `undefined`: не плутай відсутність із `0`, `''`, `false`.
