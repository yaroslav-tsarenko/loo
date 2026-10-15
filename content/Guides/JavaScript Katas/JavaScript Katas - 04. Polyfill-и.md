---
title: Polyfill-и
order: 4
level: middle
tags: [polyfills, prototypes, this, bind, new, instanceof]
prerequisites:
  - "[[JavaScript - 06. this]]"
  - "[[JavaScript - 07. Прототипи та класи]]"
  - "[[JavaScript - 12. Масиви та функціональний стиль]]"
estimatedMinutes: 100
id: jsk-ch-04
icon: "🧱"
---

# JavaScript Katas - 04. Polyfill-и

> [!success] 🎯 Що тренуємо
> - Відтворювати вбудовані методи **точно за специфікацією**: дірки в масивах, `thisArg`, `TypeError`, крайні випадки.
> - Розуміти чотири правила `this` настільки, щоб написати `call`, `apply` і `bind` самому.
> - Пройти ланцюжок прототипів руками: `Object.create`, `new`, `instanceof`.

## 🧭 Стратегія

Поліфіл-задача перевіряє не «чи вмієш ти написати цикл», а **чи знаєш ти контракт** вбудованого методу. Інтерв'юер майже завжди питає про крайні випадки, тож перш ніж писати — проговори їх уголос:

| Метод | Що легко забути |
|---|---|
| `map`, `filter`, `reduce` | дірки (`[1, , 3]`) пропускаються; колбек отримує `(value, index, array)`; `thisArg`; `TypeError`, якщо колбек не функція |
| `reduce` | «немає початкового значення» ≠ «початкове значення `undefined`» — дивись на **кількість** аргументів |
| `call`/`apply` | тимчасова властивість має бути `Symbol`, щоб не перезаписати чуже поле і не лишити слідів |
| `bind` | виклик через `new` ігнорує зв'язаний `this`; часткові аргументи; класи не можна викликати без `new` |
| `new` | якщо конструктор повертає **об'єкт** — результатом є він, примітив ігнорується |
| `instanceof` | іде ланцюжком `Object.getPrototypeOf`, а не по `constructor` |

**Як працює `this` у поліфілі прототипу.** У `Array.prototype.myMap = function () {…}` під час виклику `[1, 2].myMap(fn)` значення `this` — сам масив. Тому стрілка тут не підходить. Чотири правила `this` — у [[JavaScript - 06. this]].

**Дірки.** `i in arr` відрізняє «елемента немає» від «елемент `undefined`». `[1, , 3]` має дірку на індексі 1, а `[1, undefined, 3]` — ні.

> [!warning] Не роби цього в продакшні
> Ми додаємо методи з префіксом `my`, щоб не ламати вбудовані. Справжні поліфіли перевіряють `if (!Array.prototype.flat)` і додаються через `Object.defineProperty` як **неперелічувані** — інакше вони вилізуть у кожному `for…in` по масиву.

## 🧩 Збери з пам'яті

> [!quiz] Збери оператор `new` по кроках
> level: middle · type: order · id: jsk-04-quiz-01
>
> ```js order
> function myNew(Ctor, ...args) {
>   const obj = Object.create(Ctor.prototype)
>   const result = Ctor.apply(obj, args)
>   const isObject = result !== null && (typeof result === 'object' || typeof result === 'function')
>   return isObject ? result : obj
> }
> const obj = {}   // ✗
> ```
>
> **Пояснення:** новий об'єкт одразу отримує прототип `Ctor.prototype`, конструктор виконується з `this = obj`, і лише якщо він повернув об'єкт чи функцію — результат підміняється. `{}` не мав би правильного прототипу.

> [!quiz] Заповни пропуски в `myCall`
> level: middle · type: fill · id: jsk-04-quiz-02 · bank: window, String, arguments
>
> ```js fill
> Function.prototype.myCall = function (context, ...args) {
>   const ctx = context == null ? [[globalThis]] : Object(context)
>   const key = [[Symbol]]('fn')
>   ctx[key] = [[this]]
>   try {
>     return ctx[key](...args)
>   } finally {
>     [[delete]] ctx[key]
>   }
> }
> ```
>
> **Пояснення:** виклик `ctx[key]()` — це виклик методу, тож `this` усередині — `ctx`. Унікальний `Symbol` не конфліктує з полями об'єкта, а `finally` прибирає слід навіть якщо функція кинула помилку.

> [!quiz] Заповни пропуски в `instanceof`
> level: junior · type: fill · id: jsk-04-quiz-03
>
> ```js fill
> let proto = Object.[[getPrototypeOf]](obj)
> while (proto !== [[null]]) {
>   if (proto === Ctor.[[prototype]]) return true
>   proto = Object.getPrototypeOf(proto)
> }
> return [[false]]
> ```
>
> **Пояснення:** `instanceof` перевіряє, чи є `Ctor.prototype` **десь** у ланцюжку прототипів `obj`. Ланцюжок завжди закінчується `null`.

## 🛠️ Задачі

> [!task] map і filter
> level: junior · difficulty: easy · id: jsk-04-task-01 · tags: arrays, polyfills
>
> Реалізуй `Array.prototype.myMap(callback, thisArg)` і `Array.prototype.myFilter(callback, thisArg)` як вбудовані:
>
> - колбек отримує `(value, index, array)` і викликається з `this = thisArg`;
> - дірки (`[1, , 3]`) **пропускаються**: `myMap` зберігає дірку в результаті, `myFilter` — просто пропускає;
> - елементи, додані під час обходу, не відвідуються;
> - якщо `callback` не функція — `TypeError`.
>
> ```js starter
> Array.prototype.myMap = function (callback, thisArg) {
>   // твій код
> }
>
> Array.prototype.myFilter = function (callback, thisArg) {
>   // твій код
> }
> ```
>
> ```js tests
> test('myMap: значення, індекс і масив', () => {
>   const arr = [10, 20]
>   expect(arr.myMap((v, i, a) => [v, i, a === arr])).toEqual([[10, 0, true], [20, 1, true]])
> })
>
> test('myMap: повертає новий масив і не мутує', () => {
>   const arr = [1, 2, 3]
>   const result = arr.myMap((x) => x * 2)
>   expect(result).toEqual([2, 4, 6])
>   expect(result === arr).toBe(false)
>   expect(arr).toEqual([1, 2, 3])
> })
>
> test('myMap: thisArg', () => {
>   const ctx = { factor: 3 }
>   expect([1, 2].myMap(function (x) { return x * this.factor }, ctx)).toEqual([3, 6])
> })
>
> test('myMap: дірки пропускаються і зберігаються', () => {
>   let calls = 0
>   const result = [1, , 3].myMap((x) => { calls++; return x * 2 })
>   expect(calls).toBe(2)
>   expect(result.length).toBe(3)
>   expect(1 in result).toBe(false)
>   expect(result[2]).toBe(6)
> })
>
> test('myMap: додані під час обходу елементи не відвідуються', () => {
>   const arr = [1, 2]
>   const result = arr.myMap((x) => { arr.push(x); return x })
>   expect(result).toEqual([1, 2])
> })
>
> test('myFilter: базовий випадок і індекси', () => {
>   expect([5, 6, 7, 8].myFilter((v, i) => i % 2 === 0)).toEqual([5, 7])
> })
>
> test('myFilter: thisArg і дірки', () => {
>   const ctx = { min: 2 }
>   expect([1, , 3, undefined].myFilter(function (x) { return x === undefined || x > this.min }, ctx)).toEqual([3, undefined])
> })
>
> test('TypeError, якщо колбек не функція', () => {
>   expect(() => [1].myMap(null)).toThrow(TypeError)
>   expect(() => [1].myFilter('nope')).toThrow(TypeError)
> })
> ```
>
> > [!hint]- Підказка 1
> > Довжину запам'ятай **до** циклу: `const len = this.length`.
>
> > [!hint]- Підказка 2
> > Для `myMap` створи `new Array(len)` — він уже «дірявий», і пропущені індекси такими й лишаться. Наявність елемента — `i in this`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > Array.prototype.myMap = function (callback, thisArg) {
> >   if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)
> >   const len = this.length
> >   const result = new Array(len)
> >   for (let i = 0; i < len; i++) {
> >     if (i in this) result[i] = callback.call(thisArg, this[i], i, this)
> >   }
> >   return result
> > }
> >
> > Array.prototype.myFilter = function (callback, thisArg) {
> >   if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)
> >   const len = this.length
> >   const result = []
> >   for (let i = 0; i < len; i++) {
> >     if (i in this && callback.call(thisArg, this[i], i, this)) result.push(this[i])
> >   }
> >   return result
> > }
> > ```
> > **Складність:** O(n). **Чому так:** `callback.call(thisArg, …)` реалізує `thisArg`; `i in this` — дірки; фіксована `len` — стабільність при мутації під час обходу (так каже специфікація). **Що спитають далі:** «чому не `forEach` всередині?» — він теж пропускає дірки, але для `map` треба зберегти їх у результаті; «як додати метод неперелічуваним?» — `Object.defineProperty(Array.prototype, 'myMap', { value, writable: true, configurable: true })`.

> [!task] Object.create
> level: junior · difficulty: easy · id: jsk-04-task-02 · tags: prototypes, polyfills
>
> Реалізуй `myCreate(proto, properties)` **без** `Object.create`:
>
> - повертає новий об'єкт з прототипом `proto` (`null` теж дозволено);
> - якщо `proto` не об'єкт, не функція і не `null` — `TypeError`;
> - необов'язковий `properties` — дескриптори, як у `Object.defineProperties`.
>
> ```js starter
> function myCreate(proto, properties) {
>   // твій код
> }
> ```
>
> ```js tests
> test('прототип і успадковані методи', () => {
>   const animal = { speak() { return `${this.name} speaks` } }
>   const dog = myCreate(animal)
>   dog.name = 'Rex'
>   expect(Object.getPrototypeOf(dog)).toBe(animal)
>   expect(dog.speak()).toBe('Rex speaks')
>   expect(Object.keys(dog)).toEqual(['name'])
> })
>
> test('null-прототип — «голий» словник', () => {
>   const dict = myCreate(null)
>   expect(Object.getPrototypeOf(dict)).toBe(null)
>   expect('toString' in dict).toBe(false)
> })
>
> test('дескриптори властивостей', () => {
>   const obj = myCreate({}, { id: { value: 7, enumerable: false }, name: { value: 'n', enumerable: true, writable: true } })
>   expect(obj.id).toBe(7)
>   expect(Object.keys(obj)).toEqual(['name'])
>   expect(Object.getOwnPropertyDescriptor(obj, 'id').writable).toBe(false)
> })
>
> test('функція як прототип', () => {
>   function Base() {}
>   expect(Object.getPrototypeOf(myCreate(Base))).toBe(Base)
> })
>
> test('TypeError для примітивів і undefined', () => {
>   expect(() => myCreate(5)).toThrow(TypeError)
>   expect(() => myCreate(undefined)).toThrow(TypeError)
>   expect(() => myCreate('str')).toThrow(TypeError)
> })
>
> test('не використовує Object.create', () => {
>   const original = Object.create
>   Object.create = () => { throw new Error('Object.create заборонено') }
>   try {
>     const proto = { x: 1 }
>     expect(Object.getPrototypeOf(myCreate(proto))).toBe(proto)
>   } finally {
>     Object.create = original
>   }
> })
> ```
>
> > [!hint]- Підказка 1
> > Класичний трюк ES5: порожня функція `F`, `F.prototype = proto`, `new F()`.
>
> > [!hint]- Підказка 2
> > Трюк з `F` не працює для `null` (`new F()` отримає `Object.prototype`) — тут допоможе `Object.setPrototypeOf(obj, null)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function myCreate(proto, properties) {
> >   const isObject = proto !== null && (typeof proto === 'object' || typeof proto === 'function')
> >   if (!isObject && proto !== null) throw new TypeError('Object prototype may only be an Object or null')
> >   let obj
> >   if (proto === null) {
> >     obj = Object.setPrototypeOf({}, null)
> >   } else {
> >     function F() {}
> >     F.prototype = proto
> >     obj = new F()
> >   }
> >   if (properties !== undefined) Object.defineProperties(obj, properties)
> >   return obj
> > }
> > ```
> > **Складність:** O(1) + кількість дескрипторів. **Чому так:** `new F()` створює об'єкт з `[[Prototype]] = F.prototype` — це рівно те, що робить `Object.create`, без виклику корисного конструктора. **Що спитають далі:** «навіщо `Object.create(null)`?» — словник без успадкованих ключів (`'constructor' in dict === false`), захист від prototype pollution; «чому `setPrototypeOf` повільний?» — зміна прототипу існуючого об'єкта ламає оптимізації V8 (hidden classes, inline caches).

> [!task] instanceof
> level: junior · difficulty: easy · id: jsk-04-task-03 · tags: prototypes, polyfills
>
> Реалізуй `myInstanceOf(obj, Ctor)` як оператор `instanceof` (без `Symbol.hasInstance`):
>
> - `true`, якщо `Ctor.prototype` є в ланцюжку прототипів `obj`;
> - примітиви — завжди `false`;
> - якщо `Ctor` не функція — `TypeError`.
>
> ```js starter
> function myInstanceOf(obj, Ctor) {
>   // твій код
> }
> ```
>
> ```js tests
> test('класи й наслідування', () => {
>   class Animal {}
>   class Dog extends Animal {}
>   const rex = new Dog()
>   expect(myInstanceOf(rex, Dog)).toBe(true)
>   expect(myInstanceOf(rex, Animal)).toBe(true)
>   expect(myInstanceOf(rex, Object)).toBe(true)
>   expect(myInstanceOf(new Animal(), Dog)).toBe(false)
> })
>
> test('вбудовані типи', () => {
>   expect(myInstanceOf([], Array)).toBe(true)
>   expect(myInstanceOf([], Object)).toBe(true)
>   expect(myInstanceOf(() => {}, Function)).toBe(true)
>   expect(myInstanceOf(new Map(), Array)).toBe(false)
> })
>
> test('примітиви — false', () => {
>   expect(myInstanceOf('str', String)).toBe(false)
>   expect(myInstanceOf(5, Number)).toBe(false)
>   expect(myInstanceOf(null, Object)).toBe(false)
>   expect(myInstanceOf(undefined, Object)).toBe(false)
> })
>
> test('об\'єкт без прототипу', () => {
>   expect(myInstanceOf(Object.create(null), Object)).toBe(false)
> })
>
> test('враховує поточний прототип, а не constructor', () => {
>   function A() {}
>   function B() {}
>   const a = new A()
>   Object.setPrototypeOf(a, B.prototype)
>   expect(myInstanceOf(a, A)).toBe(false)
>   expect(myInstanceOf(a, B)).toBe(true)
> })
>
> test('TypeError, якщо праворуч не функція', () => {
>   expect(() => myInstanceOf({}, {})).toThrow(TypeError)
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу відсічи примітиви: `obj === null || (typeof obj !== 'object' && typeof obj !== 'function')`.
>
> > [!hint]- Підказка 2
> > Цикл `Object.getPrototypeOf` до `null`, порівнюючи кожну ланку з `Ctor.prototype`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function myInstanceOf(obj, Ctor) {
> >   if (typeof Ctor !== 'function') throw new TypeError("Right-hand side of 'instanceof' is not callable")
> >   if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) return false
> >   let proto = Object.getPrototypeOf(obj)
> >   while (proto !== null) {
> >     if (proto === Ctor.prototype) return true
> >     proto = Object.getPrototypeOf(proto)
> >   }
> >   return false
> > }
> > ```
> > **Складність:** O(глибини ланцюжка). **Чому так:** `instanceof` не дивиться на `obj.constructor` — лише на ланцюжок прототипів, тому зміна прототипу змінює результат. **Що спитають далі:** «`Symbol.hasInstance`?» — справжній `instanceof` спершу викликає `Ctor[Symbol.hasInstance]`; «чому `[] instanceof Array` може бути `false`?» — масив з іншого iframe/realm має свій `Array.prototype`; тому `Array.isArray`.

> [!task] reduce
> level: middle · difficulty: medium · id: jsk-04-task-04 · tags: arrays, polyfills
>
> Реалізуй `Array.prototype.myReduce(callback, initialValue)`:
>
> - колбек — `(accumulator, value, index, array)`;
> - якщо `initialValue` **не передано** — акумулятор стартує з першого **існуючого** елемента, і обхід іде з наступного;
> - явно передане `undefined` — це передане початкове значення;
> - порожній масив без початкового значення — `TypeError`;
> - дірки пропускаються.
>
> ```js starter
> Array.prototype.myReduce = function (callback, initialValue) {
>   // твій код
> }
> ```
>
> ```js tests
> test('сума з початковим значенням і без', () => {
>   expect([1, 2, 3].myReduce((a, b) => a + b, 10)).toBe(16)
>   expect([1, 2, 3].myReduce((a, b) => a + b)).toBe(6)
> })
>
> test('аргументи колбека', () => {
>   const arr = ['a', 'b']
>   const calls = []
>   arr.myReduce((acc, v, i, a) => { calls.push([acc, v, i, a === arr]); return acc + v }, '')
>   expect(calls).toEqual([['', 'a', 0, true], ['a', 'b', 1, true]])
> })
>
> test('без початкового значення стартує з індексу 1', () => {
>   const indexes = []
>   ;[5, 6, 7].myReduce((acc, v, i) => { indexes.push(i); return acc + v })
>   expect(indexes).toEqual([1, 2])
> })
>
> test('порожній масив без початкового значення — TypeError', () => {
>   expect(() => [].myReduce((a, b) => a + b)).toThrow(TypeError)
>   expect(() => [, ,].myReduce((a, b) => a + b)).toThrow(TypeError)
> })
>
> test('порожній масив з початковим значенням', () => {
>   expect([].myReduce((a, b) => a + b, 'init')).toBe('init')
> })
>
> test('один елемент без початкового значення — колбек не викликається', () => {
>   let calls = 0
>   expect([42].myReduce(() => { calls++ })).toBe(42)
>   expect(calls).toBe(0)
> })
>
> test('явне undefined — це початкове значення', () => {
>   expect([1, 2].myReduce((acc, v) => `${acc}${v}`, undefined)).toBe('undefined12')
> })
>
> test('дірки пропускаються', () => {
>   let calls = 0
>   expect([, 1, , 2].myReduce((a, b) => { calls++; return a + b })).toBe(3)
>   expect(calls).toBe(1)
> })
>
> test('TypeError, якщо колбек не функція', () => {
>   expect(() => [1].myReduce(42)).toThrow(TypeError)
> })
> ```
>
> > [!hint]- Підказка 1
> > Параметр `initialValue` не відрізнить «не передано» від `undefined`. Використай rest: `function (callback, ...rest)` і `rest.length > 0`.
>
> > [!hint]- Підказка 2
> > Без початкового значення спершу знайди перший індекс `i`, для якого `i in this`; якщо такого немає — `TypeError`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > Array.prototype.myReduce = function (callback, ...rest) {
> >   if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)
> >   const len = this.length
> >   let i = 0
> >   let acc
> >   if (rest.length > 0) {
> >     acc = rest[0]
> >   } else {
> >     while (i < len && !(i in this)) i++
> >     if (i >= len) throw new TypeError('Reduce of empty array with no initial value')
> >     acc = this[i++]
> >   }
> >   for (; i < len; i++) {
> >     if (i in this) acc = callback(acc, this[i], i, this)
> >   }
> >   return acc
> > }
> > ```
> > **Складність:** O(n). **Чому так:** специфікація розрізняє наявність аргументу, а не його значення; rest-параметр (або `arguments.length`) — єдиний спосіб це побачити. **Що спитають далі:** «`reduceRight`?» — те саме з кінця; «реалізуй `map` і `filter` через `reduce`» — і поясни, чому це O(n²), якщо щоразу робити `[...acc, x]`.

> [!task] Array.prototype.flat
> level: middle · difficulty: medium · id: jsk-04-task-05 · tags: arrays, recursion, polyfills
>
> Реалізуй `Array.prototype.myFlat(depth = 1)`:
>
> - розгортає вкладені масиви на `depth` рівнів (`Infinity` — повністю);
> - дірки **на всіх рівнях** прибираються;
> - `depth` ≤ 0 — поверхнева копія (без дірок); нечислове значення трактується як 0;
> - вбудований `flat` не використовуй.
>
> ```js starter
> Array.prototype.myFlat = function (depth = 1) {
>   // твій код
> }
> ```
>
> ```js tests
> test('за замовчуванням — один рівень', () => {
>   expect([1, [2, [3, [4]]]].myFlat()).toEqual([1, 2, [3, [4]]])
> })
>
> test('довільна глибина та Infinity', () => {
>   expect([1, [2, [3, [4]]]].myFlat(2)).toEqual([1, 2, 3, [4]])
>   expect([1, [2, [3, [4]]]].myFlat(Infinity)).toEqual([1, 2, 3, 4])
> })
>
> test('depth 0 і від\'ємний — копія', () => {
>   const arr = [1, [2]]
>   const copy = arr.myFlat(0)
>   expect(copy).toEqual([1, [2]])
>   expect(copy === arr).toBe(false)
>   expect(arr.myFlat(-1)).toEqual([1, [2]])
> })
>
> test('дірки прибираються на всіх рівнях', () => {
>   const result = [1, , [2, , 3]].myFlat()
>   expect(result).toEqual([1, 2, 3])
>   expect(result.length).toBe(3)
> })
>
> test('undefined — не дірка', () => {
>   expect([undefined, [undefined]].myFlat()).toEqual([undefined, undefined])
>   expect([undefined, [undefined]].myFlat().length).toBe(2)
> })
>
> test('не мутує вихідний масив', () => {
>   const arr = [1, [2, [3]]]
>   arr.myFlat(Infinity)
>   expect(arr).toEqual([1, [2, [3]]])
> })
>
> test('не використовує вбудований flat', () => {
>   const original = Array.prototype.flat
>   Array.prototype.flat = () => { throw new Error('flat заборонено') }
>   try {
>     expect([[1], [[2]]].myFlat(Infinity)).toEqual([1, 2])
>   } finally {
>     Array.prototype.flat = original
>   }
> })
> ```
>
> > [!hint]- Підказка 1
> > Внутрішня рекурсивна функція `visit(arr, depthLeft)` пише в спільний `result`.
>
> > [!hint]- Підказка 2
> > Цикл з індексом і `if (!(i in arr)) continue` — так ти пропустиш дірки. `for…of` дірки не пропускає: дає `undefined`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > Array.prototype.myFlat = function (depth = 1) {
> >   const result = []
> >   const visit = (arr, depthLeft) => {
> >     for (let i = 0; i < arr.length; i++) {
> >       if (!(i in arr)) continue
> >       const item = arr[i]
> >       if (Array.isArray(item) && depthLeft > 0) visit(item, depthLeft - 1)
> >       else result.push(item)
> >     }
> >   }
> >   visit(this, Number(depth) || 0)
> >   return result
> > }
> > ```
> > **Складність:** O(N) — сумарна кількість елементів на всіх розгорнутих рівнях. **Чому так:** один спільний `result` без проміжних масивів; стрілці `visit` власний `this` не потрібен — масив передаємо явно. **Що спитають далі:** «ітеративно?» — стек пар `[масив, індекс, глибина]`; «`flatMap`?» — `map` + `flat(1)` за один прохід.

> [!task] call і apply
> level: middle · difficulty: medium · id: jsk-04-task-06 · tags: this, polyfills
>
> Реалізуй `Function.prototype.myCall(context, ...args)` і `Function.prototype.myApply(context, argsArray)` **без** вбудованих `call`/`apply`/`bind`:
>
> - функція викликається з `this = context`; `null`/`undefined` → `globalThis` (як у нестрогому режимі), примітиви загортаються в об'єкт;
> - повертається результат функції;
> - на `context` **не лишається** жодних слідів, і його власні поля не перезаписуються;
> - `myApply` приймає масив аргументів (або `null`/`undefined` — без аргументів).
>
> ```js starter
> Function.prototype.myCall = function (context, ...args) {
>   // твій код
> }
>
> Function.prototype.myApply = function (context, argsArray) {
>   // твій код
> }
> ```
>
> ```js tests
> function introduce(greeting, punctuation) {
>   return `${greeting}, ${this.name}${punctuation}`
> }
>
> test('myCall передає this і аргументи', () => {
>   expect(introduce.myCall({ name: 'Ада' }, 'Привіт', '!')).toBe('Привіт, Ада!')
> })
>
> test('myApply приймає масив аргументів', () => {
>   expect(introduce.myApply({ name: 'Ада' }, ['Hi', '?'])).toBe('Hi, Ада?')
>   expect((function () { return arguments.length }).myApply({}, null)).toBe(0)
>   expect((function () { return arguments.length }).myApply({})).toBe(0)
> })
>
> test('не лишає слідів на контексті', () => {
>   const ctx = { name: 'x' }
>   introduce.myCall(ctx, 'a', 'b')
>   introduce.myApply(ctx, ['a', 'b'])
>   expect(Object.keys(ctx)).toEqual(['name'])
>   expect(Object.getOwnPropertySymbols(ctx)).toEqual([])
> })
>
> test('не перезаписує власне поле fn', () => {
>   const ctx = { fn: 'моє поле', name: 'y' }
>   expect(function () { return this.fn }.myCall(ctx)).toBe('моє поле')
>   expect(ctx.fn).toBe('моє поле')
> })
>
> test('null і undefined → globalThis', () => {
>   const getThis = function () { return this }
>   expect(getThis.myCall(null)).toBe(globalThis)
>   expect(getThis.myApply(undefined, [])).toBe(globalThis)
> })
>
> test('примітивний контекст загортається', () => {
>   expect(function () { return this.toFixed(1) }.myCall(5)).toBe('5.0')
> })
>
> test('позичання методів', () => {
>   const arrayLike = { 0: 'a', 1: 'b', length: 2 }
>   expect(Array.prototype.slice.myCall(arrayLike)).toEqual(['a', 'b'])
>   expect(Math.max.myApply(null, [1, 7, 3])).toBe(7)
> })
>
> test('слід прибирається навіть після помилки', () => {
>   const ctx = {}
>   expect(() => function () { throw new Error('boom') }.myCall(ctx)).toThrow('boom')
>   expect(Object.getOwnPropertySymbols(ctx)).toEqual([])
> })
> ```
>
> > [!hint]- Підказка 1
> > Виклик методу `obj.method()` робить `this = obj`. Тимчасово поклади функцію (`this` усередині `myCall`) у властивість контексту і виклич.
>
> > [!hint]- Підказка 2
> > Ключ властивості — новий `Symbol()`, а видалення — у `finally`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > Function.prototype.myCall = function (context, ...args) {
> >   if (typeof this !== 'function') throw new TypeError('myCall must be called on a function')
> >   const ctx = context == null ? globalThis : Object(context)
> >   const key = Symbol('fn')
> >   ctx[key] = this
> >   try {
> >     return ctx[key](...args)
> >   } finally {
> >     delete ctx[key]
> >   }
> > }
> >
> > Function.prototype.myApply = function (context, argsArray) {
> >   return this.myCall(context, ...(argsArray ?? []))
> > }
> > ```
> > **Складність:** O(n) за кількістю аргументів. **Чому так:** `Symbol` гарантує, що ми не зіткнемося з полем `fn` і ключ не з'явиться в `Object.keys`; `Object(5)` загортає примітив, щоб на ньому можна було тимчасово зберегти властивість. **Що спитають далі:** «а якщо контекст заморожений (`Object.freeze`)?» — записати властивість не вийде, такий поліфіл впаде, справжній `call` — ні; «чим відрізняється від нативного в strict mode?» — нативний не загортає примітиви і не підміняє `null` на `globalThis`.

> [!task] Оператор new
> level: middle · difficulty: medium · id: jsk-04-task-07 · tags: prototypes, constructors
>
> Реалізуй `myNew(Ctor, ...args)` — функцію, що робить те саме, що `new Ctor(...args)` для **функцій-конструкторів**:
>
> 1. створює об'єкт з прототипом `Ctor.prototype`;
> 2. викликає `Ctor` з `this` = цей об'єкт;
> 3. якщо `Ctor` повернув об'єкт чи функцію — повертає його, інакше — створений об'єкт.
>
> Якщо `Ctor` не функція — `TypeError`.
>
> ```js starter
> function myNew(Ctor, ...args) {
>   // твій код
> }
> ```
>
> ```js tests
> function Person(name, age) {
>   this.name = name
>   this.age = age
> }
> Person.prototype.greet = function () { return `Я ${this.name}` }
>
> test('створює екземпляр з полями', () => {
>   const p = myNew(Person, 'Іра', 30)
>   expect(p.name).toBe('Іра')
>   expect(p.age).toBe(30)
> })
>
> test('прототип і методи', () => {
>   const p = myNew(Person, 'Іра', 30)
>   expect(p instanceof Person).toBe(true)
>   expect(p.greet()).toBe('Я Іра')
>   expect(Object.getPrototypeOf(p)).toBe(Person.prototype)
> })
>
> test('повернений об\'єкт перемагає', () => {
>   function Factory() {
>     this.ignored = true
>     return { custom: 1 }
>   }
>   expect(myNew(Factory)).toEqual({ custom: 1 })
> })
>
> test('повернена функція теж перемагає', () => {
>   const fn = () => 'fn'
>   function ReturnsFn() { return fn }
>   expect(myNew(ReturnsFn)).toBe(fn)
> })
>
> test('повернений примітив і null ігноруються', () => {
>   function ReturnsNumber() { this.a = 1; return 42 }
>   function ReturnsNull() { this.b = 2; return null }
>   expect(myNew(ReturnsNumber)).toEqual({ a: 1 })
>   expect(myNew(ReturnsNull)).toEqual({ b: 2 })
> })
>
> test('TypeError для не-функції', () => {
>   expect(() => myNew({})).toThrow(TypeError)
> })
> ```
>
> > [!hint]- Підказка 1
> > Крок 1 — `Object.create(Ctor.prototype)`, крок 2 — `Ctor.apply(obj, args)`.
>
> > [!hint]- Підказка 2
> > «Об'єкт» для кроку 3 — це `result !== null && (typeof result === 'object' || typeof result === 'function')`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function myNew(Ctor, ...args) {
> >   if (typeof Ctor !== 'function') throw new TypeError('Ctor is not a constructor')
> >   const proto = Ctor.prototype !== null && typeof Ctor.prototype === 'object' ? Ctor.prototype : Object.prototype
> >   const obj = Object.create(proto)
> >   const result = Ctor.apply(obj, args)
> >   const isObject = result !== null && (typeof result === 'object' || typeof result === 'function')
> >   return isObject ? result : obj
> > }
> > ```
> > **Складність:** O(1) + робота конструктора. **Чому так:** якщо `Ctor.prototype` — не об'єкт, специфікація бере `Object.prototype`; правило «об'єкт перемагає» дозволяє конструкторам-фабрикам і singleton-ам. **Що спитають далі:** «чому з класами не спрацює?» — `class`-конструктор не можна викликати через `apply`, потрібен `Reflect.construct(Ctor, args)`; «що таке `new.target`?» — посилання на конструктор, викликаний через `new` (або `undefined`).

> [!task] Function.prototype.bind
> level: senior · difficulty: hard · id: jsk-04-task-08 · tags: this, prototypes, polyfills
>
> Реалізуй `Function.prototype.myBind(context, ...preset)` без вбудованого `bind`:
>
> - повертає функцію, що викликає оригінал з `this = context` і аргументами `preset` + аргументи виклику;
> - зв'язаний `this` не можна перевизначити через `call` чи повторний `myBind`;
> - виклик через `new` **ігнорує** `context`: створюється екземпляр оригіналу (`instanceof` працює), а `preset` передається в конструктор;
> - працює і з `class` (їх не можна викликати без `new`).
>
> ```js starter
> Function.prototype.myBind = function (context, ...preset) {
>   // твій код
> }
> ```
>
> ```js tests
> test('прив\'язує this', () => {
>   const user = { name: 'Оля' }
>   const getName = function () { return this.name }.myBind(user)
>   expect(getName()).toBe('Оля')
> })
>
> test('часткові аргументи', () => {
>   const sum = function (a, b, c) { return this.base + a + b + c }
>   const bound = sum.myBind({ base: 100 }, 1, 2)
>   expect(bound(3)).toBe(106)
> })
>
> test('this не перевизначається call і повторним bind', () => {
>   const getId = function () { return this.id }
>   const bound = getId.myBind({ id: 1 })
>   expect(bound.call({ id: 2 })).toBe(1)
>   expect(bound.myBind({ id: 3 })()).toBe(1)
> })
>
> test('не викликає функцію одразу', () => {
>   let calls = 0
>   const bound = function () { calls++ }.myBind(null)
>   expect(calls).toBe(0)
>   bound()
>   expect(calls).toBe(1)
> })
>
> test('new ігнорує зв\'язаний this і зберігає прототип', () => {
>   function Point(x, y) {
>     this.x = x
>     this.y = y
>   }
>   Point.prototype.sum = function () { return this.x + this.y }
>   const ctx = { shouldNotBeUsed: true }
>   const BoundPoint = Point.myBind(ctx, 10)
>   const p = new BoundPoint(5)
>   expect(p.x).toBe(10)
>   expect(p.y).toBe(5)
>   expect(p instanceof Point).toBe(true)
>   expect(p.sum()).toBe(15)
>   expect(ctx.x).toBe(undefined)
> })
>
> test('працює з class через new', () => {
>   class User {
>     constructor(role, name) {
>       this.role = role
>       this.name = name
>     }
>   }
>   const Admin = User.myBind(null, 'admin')
>   const u = new Admin('Ліна')
>   expect(u).toEqual({ role: 'admin', name: 'Ліна' })
>   expect(u instanceof User).toBe(true)
> })
> ```
>
> > [!hint]- Підказка 1
> > Усередині повернутої функції `new.target` не `undefined`, якщо її викликали через `new`.
>
> > [!hint]- Підказка 2
> > Для `new`-гілки: `Reflect.construct(target, args, new.target)` — створює екземпляр навіть для класів. Щоб `instanceof` працював, дай поверненій функції `prototype`, що успадковує `target.prototype`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > Function.prototype.myBind = function (context, ...preset) {
> >   if (typeof this !== 'function') throw new TypeError('myBind must be called on a function')
> >   const target = this
> >   function bound(...args) {
> >     if (new.target) return Reflect.construct(target, [...preset, ...args], new.target)
> >     return target.apply(context, [...preset, ...args])
> >   }
> >   if (target.prototype) bound.prototype = Object.create(target.prototype)
> >   return bound
> > }
> > ```
> > **Складність:** O(n) на виклик. **Чому так:** `Reflect.construct(target, args, newTarget)` — програмний `new`: створює об'єкт з прототипом `newTarget.prototype` (а він успадковує `target.prototype`) і коректно працює з класами. ES5-варіант `this instanceof bound ? target.apply(this, args) : …` падає на класах. **Що спитають далі:** «`name` і `length` зв'язаної функції?» — нативний `bind` дає `'bound name'` і `max(0, length - preset.length)`, їх можна виставити через `Object.defineProperty`; «чому `bound.prototype` у нативного `bind` — `undefined`?» — нативний `instanceof` для зв'язаних функцій дивиться на цільову функцію.

## 🎤 На співбесіді

> [!interview] Що робить оператор `new` — по кроках?
> level: middle · frequency: дуже часто · id: jsk-04-int-01
>
> ---
>
> 1) Створює новий порожній об'єкт з `[[Prototype]] = Ctor.prototype` (якщо `prototype` не об'єкт — `Object.prototype`). 2) Викликає конструктор з `this` = цей об'єкт і переданими аргументами; `new.target` усередині — сам конструктор. 3) Якщо конструктор повернув об'єкт або функцію — це результат `new`, інакше — створений об'єкт. Для класів похідних (`extends`) об'єкт створює **базовий** конструктор під час `super()`, тому до `super` не можна звертатися до `this`.
>
> 📚 [[JavaScript - 07. Прототипи та класи]] · [MDN: new](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) · [javascript.info: Constructor, operator "new"](https://javascript.info/constructor-new)

> [!interview] Чому поліфіл `bind` має окремо обробляти виклик через `new`?
> level: senior · frequency: часто · id: jsk-04-int-02
>
> ---
>
> За специфікацією зв'язана функція, викликана через `new`, **ігнорує** зв'язаний `this` і конструює екземпляр цільової функції (часткові аргументи при цьому зберігаються). Наївний поліфіл `return fn.apply(context, args)` при `new Bound()` запише поля в `context` і поверне `undefined` → `new` поверне порожній об'єкт без потрібного прототипу. Тому перевіряємо `new.target` і використовуємо `Reflect.construct(target, args, new.target)`, а `bound.prototype` наслідуємо від `target.prototype`, щоб працював `instanceof`.
>
> 📚 [[JavaScript - 06. this]] · [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) · [GreatFrontEnd: Function.prototype.bind](https://www.greatfrontend.com/questions/javascript/function-prototype-bind)

> [!interview] Чи нормально розширювати прототипи вбудованих об'єктів?
> level: middle · frequency: іноді · id: jsk-04-int-03
>
> ---
>
> У застосунку — ні (monkey patching): конфлікти з бібліотеками і з майбутнім стандартом. Історія SmooshGate: бібліотека MooTools додавала свій `Array.prototype.flatten`, і стандартний метод довелося перейменувати на `flat`, щоб не зламати сайти. Виняток — **поліфіли** стандартних методів: вони додаються лише якщо методу немає (`if (!Array.prototype.flat)`), через `Object.defineProperty` як неперелічувані, і поводяться точно за специфікацією. На практиці це роблять `core-js` і збирачі за browserslist.
>
> 📚 [[JavaScript - 07. Прототипи та класи]] · [Chrome for Developers: SmooshGate FAQ](https://developer.chrome.com/blog/smooshgate) · [javascript.info: Native prototypes](https://javascript.info/native-prototypes)

## ⚡ Фішки

> [!reel] 🕳️ Дірка ≠ undefined
> `[1, , 3]` має дірку: `1 in arr === false`. `map` її пропускає і зберігає, `for…of` повертає `undefined`, `flat` — прибирає.
>
> ```js
> [1, , 3].map((x) => 0) // → [0, <1 empty item>, 0]
> ```

> [!reel] 🎭 new повертає не завжди this
> Якщо конструктор повертає об'єкт, `new` віддасть саме його. Так роблять singleton-и й фабрики. Примітив у `return` просто ігнорується.

> [!reel] 🧪 Reflect.construct — програмний new
> `Reflect.construct(Ctor, args, NewTarget)` створює екземпляр навіть класу, з прототипом від `NewTarget`. Саме ним правильно реалізується `bind` для `new`.

## 🧠 Закріплення

> [!question]- Як перевірити, що в масиві є елемент з індексом i, а не дірка?
> *часто · код* · `jsk-04-001`
>
> `i in arr` (або `Object.hasOwn(arr, i)`). `arr[i] !== undefined` не відрізнить дірку від явного `undefined`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль]] · [MDN: Array — sparse arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections#sparse_arrays)

> [!question]- Як `reduce` відрізняє «немає початкового значення» від `undefined`?
> *часто · теорія* · `jsk-04-002`
>
> За **кількістю аргументів**, а не за значенням. У поліфілі — `arguments.length > 1` або rest-параметр `...rest` і `rest.length > 0`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль]] · [MDN: Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

> [!question]- Чим `call`, `apply` і `bind` відрізняються?
> *дуже часто · порівняння* · `jsk-04-003`
>
> `call(ctx, a, b)` і `apply(ctx, [a, b])` викликають функцію **одразу** з заданим `this` (різниця — у формі аргументів). `bind(ctx, a)` **повертає нову функцію** з назавжди прив'язаним `this` і частковими аргументами.
>
> 📚 [[JavaScript - 06. this]] · [MDN: Function.prototype.call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

> [!question]- Чому в поліфілі `call` ключ тимчасової властивості — `Symbol`?
> *часто · код* · `jsk-04-004`
>
> Рядковий ключ (`ctx.fn`) може перезаписати власне поле об'єкта і видний в `Object.keys` під час виклику. `Symbol` унікальний і не перелічується звичайними способами.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect]] · [MDN: Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

> [!question]- Що робить `Object.create(proto)` і чому трюк з `function F(){}` його повторює?
> *часто · теорія* · `jsk-04-005`
>
> Створює об'єкт з `[[Prototype]] = proto`. `new F()` створює об'єкт з прототипом `F.prototype`; якщо перед цим `F.prototype = proto` — отримуємо те саме, а порожній `F` нічого не робить. Для `null` трюк не працює.
>
> 📚 [[JavaScript - 07. Прототипи та класи]] · [MDN: Object.create()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

> [!question]- Як працює `instanceof`?
> *дуже часто · теорія* · `jsk-04-006`
>
> Якщо в правого операнда є `Symbol.hasInstance` — викликає його. Інакше йде ланцюжком прототипів лівого операнда і шукає `Ctor.prototype`. Примітиви — `false`. Через різні realm-и (iframe) `[] instanceof Array` може бути `false`.
>
> 📚 [[JavaScript - 07. Прототипи та класи]] · [MDN: instanceof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)

> [!question]- Що таке `new.target`?
> *іноді · теорія* · `jsk-04-007`
>
> Мета-властивість у функції: посилання на конструктор, до якого застосовано `new` (у класах-нащадках — на нащадка), або `undefined` при звичайному виклику. Дозволяє відрізнити `new F()` від `F()` і реалізувати абстрактні класи.
>
> 📚 [[JavaScript - 15. Функції глибоко]] · [MDN: new.target](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target)

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Native prototypes](https://javascript.info/native-prototypes) — як влаштовані прототипи вбудованих об'єктів і поліфіли
- 🟢 [javascript.info — Function binding](https://javascript.info/bind) — втрата `this` і `bind`
- 🟡 [MDN — Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) — поведінка з `new`, `name`, `length`
- 🟡 [MDN — Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) — алгоритм і крайні випадки
- 🟡 [MDN — Reflect.construct()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct) — програмний `new`
- 🔴 [ECMAScript — Array.prototype.map](https://tc39.es/ecma262/#sec-array.prototype.map) — покроковий алгоритм зі специфікації
- 🛠️ [GreatFrontEnd — Function.prototype.call](https://www.greatfrontend.com/questions/javascript/function-prototype-call) і [apply](https://www.greatfrontend.com/questions/javascript/function-prototype-apply) — ті самі задачі
- 🛠️ [BFE.dev — implement Array.prototype.flat()](https://bigfrontend.dev/problem/implement-Array-prototype.flat) і [create your own new operator](https://bigfrontend.dev/problem/create-your-own-new-operator)

> [!important] Підсумок
> - Поліфіл = точний контракт: дірки (`i in arr`), `thisArg`, `TypeError`, фіксована довжина.
> - `reduce` визначає початкове значення за кількістю аргументів.
> - `call`/`apply` = тимчасовий метод під `Symbol`-ключем + `finally`.
> - `bind` + `new` → `new.target` і `Reflect.construct`; `instanceof` — прохід ланцюжком прототипів.
> - Розширювати вбудовані прототипи в застосунку не можна; поліфіли — лише з перевіркою й `defineProperty`.
