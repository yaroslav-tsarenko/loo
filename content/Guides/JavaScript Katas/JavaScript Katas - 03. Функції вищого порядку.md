---
title: Функції вищого порядку
order: 3
level: middle
tags: [closures, higher-order-functions, debounce, throttle, curry, memoize]
prerequisites:
  - "[[JavaScript - 05. Замикання]]"
  - "[[JavaScript - 15. Функції глибоко]]"
  - "[[JavaScript - 14. Debounce, throttle та async-патерни]]"
estimatedMinutes: 110
id: jsk-ch-03
icon: "🎛️"
---

# JavaScript Katas - 03. Функції вищого порядку

> [!success] 🎯 Що тренуємо
> - Писати **обгортки**, які зберігають `this`, усі аргументи й повернене значення.
> - Тримати стан у **замиканні**: лічильники, кеші, таймери.
> - Тестувати час без чекання — фейкові таймери `vi.useFakeTimers()`.
> - Розуміти `fn.length` і його пастки (дефолтні й rest-параметри).

## 🧭 Стратегія

Кожна задача тут має одну й ту саму форму — **декоратор**: приймає функцію, повертає нову функцію з додатковою поведінкою. Шаблон, який варто вміти написати із заплющеними очима:

```js
function decorate(fn) {
  // стан декоратора живе тут, у замиканні: кеш, таймер, прапорець
  return function (...args) {          // саме function, не стрілка — щоб мати свій this
    // поведінка до
    const result = fn.apply(this, args) // передаємо this і ВСІ аргументи
    // поведінка після
    return result                       // не губимо результат
  }
}
```

**Три класичні помилки на співбесіді:**

1. Повертають **стрілку** — і `this` береться з місця створення декоратора, а не з місця виклику. Метод `obj.save = debounce(obj.save)` перестає бачити `obj`.
2. Викликають `fn(args[0])` або `fn(...args)` — губиться `this` або частина аргументів.
3. Забувають `return` — обгорнута функція раптом повертає `undefined`.

**Як тестувати час.** `vi.useFakeTimers()` підміняє `setTimeout`/`setInterval`/`Date.now` на керований годинник, а `vi.advanceTimersByTime(ms)` «перемотує» час синхронно. Тести debounce/throttle виконуються за мілісекунди і без флейків. Детально про самі патерни — у [[JavaScript - 14. Debounce, throttle та async-патерни]].

> [!tip] Замикання — це стан
> Усе, що декоратор «пам'ятає» між викликами (`timer`, `cache`, `called`), — змінні в замиканні. Кожен виклик `debounce(fn)` створює **окремий** стан. Механіка — у [[JavaScript - 05. Замикання]].

## 🧩 Збери з пам'яті

> [!quiz] Збери debounce з рядків
> level: middle · type: order · id: jsk-03-quiz-01
>
> ```js order
> function debounce(fn, ms) {
>   let timer = null
>   return function (...args) {
>     clearTimeout(timer)
>     timer = setTimeout(() => fn.apply(this, args), ms)
>   }
> }
> return (...args) => {   // ✗
> ```
>
> **Пояснення:** кожен виклик скидає попередній таймер і ставить новий. Повертаємо `function`, щоб отримати `this` місця виклику, а всередині — стрілку, щоб передати цей `this` далі в `apply`.

> [!quiz] Заповни пропуски в memoize
> level: middle · type: fill · id: jsk-03-quiz-02 · bank: WeakSet, add, bind
>
> ```js fill
> function memoize(fn) {
>   const cache = new [[Map]]()
>   return function (arg) {
>     if (cache.[[has]](arg)) return cache.get(arg)
>     const result = fn.[[call]](this, arg)
>     cache.[[set]](arg, result)
>     return result
>   }
> }
> ```
>
> **Пояснення:** перевіряємо `has`, а не `cache.get(arg) !== undefined` — інакше функція, що повертає `undefined`, ніколи не кешуватиметься.

> [!quiz] Заповни пропуски в curry
> level: middle · type: fill · id: jsk-03-quiz-03
>
> ```js fill
> function curry(fn) {
>   return function curried(...args) {
>     if (args.length >= fn.[[length]]) return fn.[[apply]](this, args)
>     return (...next) => curried.apply(this, [...args, ...[[next]]])
>   }
> }
> ```
>
> **Пояснення:** `fn.length` — кількість параметрів до першого дефолтного чи rest. Поки аргументів менше — повертаємо функцію, що докидає нові до вже зібраних.

## 🛠️ Задачі

> [!task] once
> level: junior · difficulty: easy · id: jsk-03-task-01 · tags: closures
>
> Напиши `once(fn)`: повертає функцію, яка викликає `fn` **лише перший раз** і запам'ятовує результат. Наступні виклики повертають той самий результат, не викликаючи `fn`. `this` і аргументи першого виклику передаються у `fn`.
>
> ```js starter
> function once(fn) {
>   // твій код
> }
> ```
>
> ```js tests
> test('викликає fn лише один раз', () => {
>   let calls = 0
>   const init = once(() => ++calls)
>   init()
>   init()
>   init()
>   expect(calls).toBe(1)
> })
>
> test('повертає результат першого виклику', () => {
>   const add = once((a, b) => a + b)
>   expect(add(1, 2)).toBe(3)
>   expect(add(10, 20)).toBe(3)
> })
>
> test('кешує навіть undefined', () => {
>   let calls = 0
>   const f = once(() => { calls++ })
>   expect(f()).toBe(undefined)
>   f()
>   expect(calls).toBe(1)
> })
>
> test('зберігає this', () => {
>   const counter = { base: 10, init: once(function (x) { return this.base + x }) }
>   expect(counter.init(5)).toBe(15)
> })
>
> test('кожен once — окремий стан', () => {
>   let calls = 0
>   const a = once(() => ++calls)
>   const b = once(() => ++calls)
>   a()
>   b()
>   expect(calls).toBe(2)
> })
> ```
>
> > [!hint]- Підказка 1
> > Потрібні дві змінні в замиканні: прапорець `called` і `result`.
>
> > [!hint]- Підказка 2
> > Прапорець, а не перевірка `result === undefined` — інакше функція, що повертає `undefined`, викликатиметься знову.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function once(fn) {
> >   let called = false
> >   let result
> >   return function (...args) {
> >     if (!called) {
> >       called = true
> >       result = fn.apply(this, args)
> >       fn = null
> >     }
> >     return result
> >   }
> > }
> > ```
> > **Складність:** O(1). **Чому так:** `called` ставимо **до** виклику — так рекурсивний чи повторний виклик зсередини `fn` не запустить її вдруге. `fn = null` звільняє посилання для GC. **Що спитають далі:** «а якщо `fn` кинула помилку — дозволити повтор?» — ставити `called = true` лише після успіху; «`onceAsync`?» — кешувати сам проміс.

> [!task] partial
> level: junior · difficulty: easy · id: jsk-03-task-02 · tags: closures, this
>
> Напиши `partial(fn, ...preset)`: повертає функцію, яка викликає `fn` з аргументами `preset`, а **потім** — з аргументами виклику. `this` місця виклику передається у `fn`.
>
> - `partial((a, b, c) => a + b + c, 1, 2)(3)` → `6`
>
> ```js starter
> function partial(fn, ...preset) {
>   // твій код
> }
> ```
>
> ```js tests
> test('підставляє аргументи на початок', () => {
>   const greet = (greeting, name) => `${greeting}, ${name}!`
>   expect(partial(greet, 'Привіт')('Олено')).toBe('Привіт, Олено!')
> })
>
> test('кілька preset і решта аргументів', () => {
>   const sum = (...nums) => nums.reduce((a, b) => a + b, 0)
>   expect(partial(sum, 1, 2)(3, 4)).toBe(10)
> })
>
> test('без preset — як звичайний виклик', () => {
>   expect(partial(Math.max)(1, 5, 3)).toBe(5)
> })
>
> test('зберігає this', () => {
>   const obj = { base: 100, add: partial(function (a, b) { return this.base + a + b }, 1) }
>   expect(obj.add(2)).toBe(103)
> })
>
> test('можна викликати багато разів незалежно', () => {
>   const tag = partial((t, v) => `<${t}>${v}</${t}>`, 'b')
>   expect(tag('x')).toBe('<b>x</b>')
>   expect(tag('y')).toBe('<b>y</b>')
> })
> ```
>
> > [!hint]- Підказка 1
> > Поверни `function (...later)`, а не стрілку — інакше `this` не буде місцем виклику.
>
> > [!hint]- Підказка 2
> > `fn.apply(this, [...preset, ...later])` або `fn.call(this, ...preset, ...later)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function partial(fn, ...preset) {
> >   return function (...later) {
> >     return fn.call(this, ...preset, ...later)
> >   }
> > }
> > ```
> > **Складність:** O(n) на виклик — копіювання аргументів. **Чому так:** `fn.bind(null, ...preset)` теж часткове застосування, але **жорстко** фіксує `this`; наша версія лишає його динамічним. **Що спитають далі:** «плейсхолдери, щоб пропустити аргумент?» — дивись задачу з `curry.placeholder` нижче.

> [!task] compose і pipe
> level: junior · difficulty: easy · id: jsk-03-task-03 · tags: functional
>
> Напиши дві функції:
>
> - `compose(...fns)` — справа наліво: `compose(f, g, h)(x) === f(g(h(x)))`;
> - `pipe(...fns)` — зліва направо: `pipe(f, g, h)(x) === h(g(f(x)))`.
>
> Без функцій — повертають identity (`x => x`). **Перша** функція ланцюжка (найправіша в `compose`, найлівіша в `pipe`) може приймати кілька аргументів.
>
> ```js starter
> function compose(...fns) {
>   // твій код
> }
>
> function pipe(...fns) {
>   // твій код
> }
> ```
>
> ```js tests
> const inc = (x) => x + 1
> const double = (x) => x * 2
>
> test('compose — справа наліво', () => {
>   expect(compose(inc, double)(5)).toBe(11)
> })
>
> test('pipe — зліва направо', () => {
>   expect(pipe(inc, double)(5)).toBe(12)
> })
>
> test('без функцій — identity', () => {
>   expect(compose()(7)).toBe(7)
>   expect(pipe()('x')).toBe('x')
> })
>
> test('одна функція', () => {
>   expect(pipe(double)(4)).toBe(8)
> })
>
> test('перша функція отримує всі аргументи', () => {
>   const sum = (a, b) => a + b
>   expect(pipe(sum, double)(1, 2)).toBe(6)
>   expect(compose(double, sum)(1, 2)).toBe(6)
> })
>
> test('порядок застосування для рядків', () => {
>   const exclaim = (s) => s + '!'
>   const upper = (s) => s.toUpperCase()
>   expect(compose(exclaim, upper)('hi')).toBe('HI!')
>   expect(pipe(exclaim, upper)('hi')).toBe('HI!')
>   expect(compose(upper, exclaim)('hi')).toBe('HI!')
> })
> ```
>
> > [!hint]- Підказка 1
> > `pipe` — це `reduce` по функціях: акумулятор — поточне значення.
>
> > [!hint]- Підказка 2
> > Щоб перша функція отримала всі аргументи, виклич її окремо: `const [first, ...rest] = fns`. А `compose` — це `pipe` з розвернутим масивом.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function pipe(...fns) {
> >   if (fns.length === 0) return (x) => x
> >   const [first, ...rest] = fns
> >   return function (...args) {
> >     return rest.reduce((value, fn) => fn.call(this, value), first.apply(this, args))
> >   }
> > }
> >
> > function compose(...fns) {
> >   return pipe(...fns.reverse())
> > }
> > ```
> > **Складність:** O(k) на виклик для k функцій. **Чому так:** `fns.reverse()` мутує, але `fns` — свіжий rest-масив, тож безпечно. **Що спитають далі:** «асинхронний pipe?» — `reduce` над промісами: `rest.reduce((p, fn) => p.then(fn), Promise.resolve(first(...args)))`.

> [!task] memoize з resolver
> level: middle · difficulty: medium · id: jsk-03-task-04 · tags: closures, cache, map
>
> Напиши `memoize(fn, resolver)` як у lodash:
>
> - ключ кешу — `resolver(...args)`, якщо `resolver` передано, інакше **перший** аргумент;
> - результат зберігається в `Map`, доступному як `memoized.cache` (його можна очистити `memoized.cache.clear()`);
> - кешуються і `undefined`-результати;
> - `this` передається і в `fn`, і в `resolver`.
>
> ```js starter
> function memoize(fn, resolver) {
>   // твій код
> }
> ```
>
> ```js tests
> test('кешує за першим аргументом', () => {
>   let calls = 0
>   const square = memoize((n) => { calls++; return n * n })
>   expect(square(4)).toBe(16)
>   expect(square(4)).toBe(16)
>   expect(square(5)).toBe(25)
>   expect(calls).toBe(2)
> })
>
> test('без resolver ключ — лише перший аргумент', () => {
>   const add = memoize((a, b) => a + b)
>   expect(add(1, 2)).toBe(3)
>   expect(add(1, 100)).toBe(3)
> })
>
> test('resolver визначає ключ', () => {
>   let calls = 0
>   const add = memoize((a, b) => { calls++; return a + b }, (a, b) => `${a}:${b}`)
>   expect(add(1, 2)).toBe(3)
>   expect(add(1, 100)).toBe(101)
>   expect(add(1, 2)).toBe(3)
>   expect(calls).toBe(2)
> })
>
> test('кешує undefined-результат', () => {
>   let calls = 0
>   const f = memoize(() => { calls++ })
>   f('x')
>   f('x')
>   expect(calls).toBe(1)
> })
>
> test('cache — це Map, який можна очистити', () => {
>   let calls = 0
>   const f = memoize((x) => { calls++; return x })
>   f(1)
>   expect(f.cache instanceof Map).toBe(true)
>   expect(f.cache.get(1)).toBe(1)
>   f.cache.clear()
>   f(1)
>   expect(calls).toBe(2)
> })
>
> test('об\'єкти як ключі — за посиланням', () => {
>   let calls = 0
>   const f = memoize((obj) => { calls++; return obj.v })
>   const a = { v: 1 }
>   f(a)
>   f(a)
>   f({ v: 1 })
>   expect(calls).toBe(2)
> })
>
> test('this передається у fn і resolver', () => {
>   const obj = {
>     factor: 3,
>     scale: memoize(function (x) { return x * this.factor }, function (x) { return `${this.factor}:${x}` }),
>   }
>   expect(obj.scale(2)).toBe(6)
>   expect(obj.scale.cache.has('3:2')).toBe(true)
> })
> ```
>
> > [!hint]- Підказка 1
> > Створи `memoized` як іменовану `function`, щоб потім додати їй властивість `memoized.cache = new Map()`.
>
> > [!hint]- Підказка 2
> > `cache.has(key)` — не `cache.get(key) !== undefined`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function memoize(fn, resolver) {
> >   function memoized(...args) {
> >     const key = resolver ? resolver.apply(this, args) : args[0]
> >     if (memoized.cache.has(key)) return memoized.cache.get(key)
> >     const result = fn.apply(this, args)
> >     memoized.cache.set(key, result)
> >     return result
> >   }
> >   memoized.cache = new Map()
> >   return memoized
> > }
> > ```
> > **Складність:** O(1) на влучання в кеш + вартість resolver. **Чому так:** `Map` приймає будь-які ключі (об'єкти, `NaN`) і порівнює за SameValueZero, на відміну від plain object, де все стає рядком. Кеш на властивості функції дає зовнішньому коду контроль (очистити, підмінити на LRU). **Що спитають далі:** «кеш росте безмежно — що робити?» — LRU (розділ 6), TTL, або `WeakMap` для об'єктних ключів; «чому `JSON.stringify(args)` — поганий ключ?» — повільний, ламається на циклах, функціях, `undefined`, і `{a,b}` ≠ `{b,a}`.

> [!task] curry
> level: middle · difficulty: medium · id: jsk-03-task-05 · tags: closures, functional
>
> Напиши `curry(fn)`: повертає функцію, яка збирає аргументи порціями будь-якого розміру і викликає `fn`, щойно аргументів стане **не менше** за `fn.length`. Кожне часткове застосування — незалежне (його можна перевикористати).
>
> - `curry((a, b, c) => a + b + c)(1)(2)(3)` → `6`
> - `curry((a, b, c) => a + b + c)(1, 2)(3)` → `6`
>
> ```js starter
> function curry(fn) {
>   // твій код
> }
> ```
>
> ```js tests
> const sum3 = (a, b, c) => a + b + c
>
> test('по одному аргументу', () => {
>   expect(curry(sum3)(1)(2)(3)).toBe(6)
> })
>
> test('порціями різного розміру', () => {
>   const c = curry(sum3)
>   expect(c(1, 2)(3)).toBe(6)
>   expect(c(1)(2, 3)).toBe(6)
>   expect(c(1, 2, 3)).toBe(6)
> })
>
> test('часткові застосування незалежні', () => {
>   const add1 = curry(sum3)(1)
>   const add1and2 = add1(2)
>   expect(add1(10)(10)).toBe(21)
>   expect(add1and2(3)).toBe(6)
>   expect(add1and2(4)).toBe(7)
> })
>
> test('порожній виклик не ламає накопичення', () => {
>   expect(curry(sum3)(1)()(2)()(3)).toBe(6)
> })
>
> test('зайві аргументи передаються далі', () => {
>   const all = curry(function (a, b) { return [...arguments] })
>   expect(all(1)(2, 3)).toEqual([1, 2, 3])
> })
>
> test('функція без параметрів викликається одразу', () => {
>   expect(curry(() => 42)()).toBe(42)
> })
> ```
>
> > [!hint]- Підказка 1
> > Внутрішня іменована функція `curried(...args)` перевіряє `args.length >= fn.length`.
>
> > [!hint]- Підказка 2
> > Якщо мало — поверни нову функцію, яка викликає `curried` з **новим** масивом `[...args, ...next]`. Мутувати спільний масив не можна — зламаються незалежні гілки.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function curry(fn) {
> >   return function curried(...args) {
> >     if (args.length >= fn.length) return fn.apply(this, args)
> >     return function (...next) {
> >       return curried.apply(this, [...args, ...next])
> >     }
> >   }
> > }
> > ```
> > **Складність:** O(n) на крок через копіювання аргументів. **Чому так:** кожен крок створює нове замикання зі своїм `args` — тому `add1` можна перевикористати. **Що спитають далі:** «а якщо в `fn` є дефолтні параметри?» — `fn.length` рахує лише параметри **до** першого дефолтного/rest: `((a, b = 1) => {}).length === 1`; рішення — передавати арність явно `curry(fn, arity)`; «нескінченний `sum(1)(2)(3)()`?» — каррі з викликом без аргументів як сигналом завершення.

> [!task] debounce з cancel і flush
> level: middle · difficulty: medium · id: jsk-03-task-06 · tags: timers, closures
>
> Напиши `debounce(fn, ms)`: повертає функцію, що відкладає виклик `fn`, доки виклики не припиняться на `ms` мілісекунд. Викликається з **останніми** аргументами і `this` останнього виклику. Додай методи:
>
> - `debounced.cancel()` — скасовує відкладений виклик;
> - `debounced.flush()` — якщо виклик очікує, виконує його **негайно** (і таймер більше не спрацює).
>
> ```js starter
> function debounce(fn, ms) {
>   // твій код
> }
> ```
>
> ```js tests
> test('викликає лише раз після паузи', () => {
>   vi.useFakeTimers()
>   let calls = 0
>   const d = debounce(() => calls++, 100)
>   d(); d(); d()
>   vi.advanceTimersByTime(99)
>   expect(calls).toBe(0)
>   vi.advanceTimersByTime(1)
>   expect(calls).toBe(1)
>   vi.useRealTimers()
> })
>
> test('кожен виклик скидає таймер', () => {
>   vi.useFakeTimers()
>   let calls = 0
>   const d = debounce(() => calls++, 100)
>   d()
>   vi.advanceTimersByTime(80)
>   d()
>   vi.advanceTimersByTime(80)
>   expect(calls).toBe(0)
>   vi.advanceTimersByTime(20)
>   expect(calls).toBe(1)
>   vi.useRealTimers()
> })
>
> test('використовує останні аргументи і this', () => {
>   vi.useFakeTimers()
>   const seen = []
>   const obj = { name: 'obj', log: debounce(function (v) { seen.push([this.name, v]) }, 50) }
>   obj.log(1)
>   obj.log(2)
>   obj.log(3)
>   vi.advanceTimersByTime(50)
>   expect(seen).toEqual([['obj', 3]])
>   vi.useRealTimers()
> })
>
> test('окремі серії — окремі виклики', () => {
>   vi.useFakeTimers()
>   let calls = 0
>   const d = debounce(() => calls++, 100)
>   d()
>   vi.advanceTimersByTime(100)
>   d()
>   vi.advanceTimersByTime(100)
>   expect(calls).toBe(2)
>   vi.useRealTimers()
> })
>
> test('cancel скасовує відкладений виклик', () => {
>   vi.useFakeTimers()
>   let calls = 0
>   const d = debounce(() => calls++, 100)
>   d()
>   d.cancel()
>   vi.advanceTimersByTime(200)
>   expect(calls).toBe(0)
>   vi.useRealTimers()
> })
>
> test('flush виконує негайно і лише раз', () => {
>   vi.useFakeTimers()
>   const seen = []
>   const d = debounce((v) => seen.push(v), 100)
>   d('a')
>   d('b')
>   d.flush()
>   expect(seen).toEqual(['b'])
>   vi.advanceTimersByTime(200)
>   expect(seen).toEqual(['b'])
>   d.flush()
>   expect(seen).toEqual(['b'])
>   vi.useRealTimers()
> })
> ```
>
> > [!hint]- Підказка 1
> > У замиканні: `timer`, а також `lastArgs` і `lastThis` — їх потребуватиме `flush`.
>
> > [!hint]- Підказка 2
> > Винеси виклик в окрему функцію `invoke()`, яка очищає стан і викликає `fn.apply(lastThis, lastArgs)`. Її використовують і таймер, і `flush`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function debounce(fn, ms) {
> >   let timer = null
> >   let lastArgs = null
> >   let lastThis = null
> >
> >   function invoke() {
> >     const args = lastArgs
> >     const context = lastThis
> >     timer = lastArgs = lastThis = null
> >     return fn.apply(context, args)
> >   }
> >
> >   function debounced(...args) {
> >     lastArgs = args
> >     lastThis = this
> >     clearTimeout(timer)
> >     timer = setTimeout(invoke, ms)
> >   }
> >
> >   debounced.cancel = () => {
> >     clearTimeout(timer)
> >     timer = lastArgs = lastThis = null
> >   }
> >
> >   debounced.flush = () => {
> >     if (timer === null) return undefined
> >     clearTimeout(timer)
> >     return invoke()
> >   }
> >
> >   return debounced
> > }
> > ```
> > **Складність:** O(1) на виклик. **Чому так:** `clearTimeout(null)` безпечний, тож перевірка перед ним не потрібна. Стан чиститься в `invoke`, щоб `flush` після виконання був no-op. **Що спитають далі:** «leading-режим?» — виклик на першій події серії, ігнор решти до паузи; «`maxWait`?» — гарантований виклик хоча б раз на N мс (так lodash будує throttle через debounce).

> [!task] throttle з leading і trailing
> level: senior · difficulty: hard · id: jsk-03-task-07 · tags: timers, closures
>
> Напиши `throttle(fn, ms, { leading = true, trailing = true } = {})`: `fn` викликається не частіше одного разу за `ms`.
>
> - **leading** — перший виклик у «тихому» стані виконується негайно; з `leading: false` він відкладається до кінця вікна.
> - **trailing** — якщо під час вікна були виклики, наприкінці вікна `fn` викликається з **останніми** аргументами і `this`, і відкривається нове вікно. З `trailing: false` такі виклики відкидаються.
> - Вікно закривається, коли минуло `ms` без відкладених викликів; наступний виклик знову «перший».
> - `throttled.cancel()` скидає все.
>
> ```js starter
> function throttle(fn, ms, { leading = true, trailing = true } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> test('leading + trailing: перший одразу, останній — у кінці вікна', () => {
>   vi.useFakeTimers()
>   const calls = []
>   const t = throttle((v) => calls.push(v), 100)
>   t(1)
>   expect(calls).toEqual([1])
>   vi.advanceTimersByTime(50)
>   t(2)
>   vi.advanceTimersByTime(30)
>   t(3)
>   expect(calls).toEqual([1])
>   vi.advanceTimersByTime(20)
>   expect(calls).toEqual([1, 3])
>   vi.useRealTimers()
> })
>
> test('після trailing-виклику починається нове вікно', () => {
>   vi.useFakeTimers()
>   const calls = []
>   const t = throttle((v) => calls.push(v), 100)
>   t(1)
>   vi.advanceTimersByTime(50)
>   t(2)
>   vi.advanceTimersByTime(50)
>   expect(calls).toEqual([1, 2])
>   vi.advanceTimersByTime(10)
>   t(3)
>   expect(calls).toEqual([1, 2])
>   vi.advanceTimersByTime(90)
>   expect(calls).toEqual([1, 2, 3])
>   vi.advanceTimersByTime(100)
>   t(4)
>   expect(calls).toEqual([1, 2, 3, 4])
>   vi.useRealTimers()
> })
>
> test('один виклик — без зайвого trailing', () => {
>   vi.useFakeTimers()
>   let calls = 0
>   const t = throttle(() => calls++, 100)
>   t()
>   vi.advanceTimersByTime(500)
>   expect(calls).toBe(1)
>   vi.useRealTimers()
> })
>
> test('leading: false — перший виклик відкладається', () => {
>   vi.useFakeTimers()
>   const calls = []
>   const t = throttle((v) => calls.push(v), 100, { leading: false })
>   t(1)
>   t(2)
>   expect(calls).toEqual([])
>   vi.advanceTimersByTime(100)
>   expect(calls).toEqual([2])
>   vi.useRealTimers()
> })
>
> test('trailing: false — виклики у вікні відкидаються', () => {
>   vi.useFakeTimers()
>   const calls = []
>   const t = throttle((v) => calls.push(v), 100, { trailing: false })
>   t(1)
>   t(2)
>   vi.advanceTimersByTime(100)
>   expect(calls).toEqual([1])
>   t(3)
>   expect(calls).toEqual([1, 3])
>   vi.useRealTimers()
> })
>
> test('зберігає this останнього виклику', () => {
>   vi.useFakeTimers()
>   const seen = []
>   const handler = throttle(function () { seen.push(this.id) }, 100)
>   const a = { id: 'a', handler }
>   const b = { id: 'b', handler }
>   a.handler()
>   b.handler()
>   vi.advanceTimersByTime(100)
>   expect(seen).toEqual(['a', 'b'])
>   vi.useRealTimers()
> })
>
> test('cancel скидає відкладений виклик і вікно', () => {
>   vi.useFakeTimers()
>   const calls = []
>   const t = throttle((v) => calls.push(v), 100)
>   t(1)
>   t(2)
>   t.cancel()
>   vi.advanceTimersByTime(100)
>   expect(calls).toEqual([1])
>   t(3)
>   expect(calls).toEqual([1, 3])
>   vi.useRealTimers()
> })
> ```
>
> > [!hint]- Підказка 1
> > Стан: `timer` (чи відкрите вікно), `pendingArgs`/`pendingThis` (чи є відкладений виклик).
>
> > [!hint]- Підказка 2
> > Функція `startWindow()` ставить таймер на `ms`. Коли він спрацьовує: якщо є відкладений виклик і `trailing` — виконати і **знову** `startWindow()`; інакше `timer = null`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function throttle(fn, ms, { leading = true, trailing = true } = {}) {
> >   let timer = null
> >   let pendingArgs = null
> >   let pendingThis = null
> >
> >   function startWindow() {
> >     timer = setTimeout(() => {
> >       if (trailing && pendingArgs) {
> >         const args = pendingArgs
> >         const context = pendingThis
> >         pendingArgs = pendingThis = null
> >         fn.apply(context, args)
> >         startWindow()
> >       } else {
> >         timer = null
> >         pendingArgs = pendingThis = null
> >       }
> >     }, ms)
> >   }
> >
> >   function throttled(...args) {
> >     if (timer === null) {
> >       if (leading) fn.apply(this, args)
> >       else {
> >         pendingArgs = args
> >         pendingThis = this
> >       }
> >       startWindow()
> >     } else {
> >       pendingArgs = args
> >       pendingThis = this
> >     }
> >   }
> >
> >   throttled.cancel = () => {
> >     clearTimeout(timer)
> >     timer = pendingArgs = pendingThis = null
> >   }
> >
> >   return throttled
> > }
> > ```
> > **Складність:** O(1) на виклик. **Чому так:** нове вікно після trailing-виклику гарантує інваріант «не частіше разу на `ms`» — інакше виклик одразу після trailing пройшов би миттєво, і два виклики стались би з інтервалом ~0. **Що спитають далі:** «throttle для анімацій?» — `requestAnimationFrame` замість `setTimeout`; «чим відрізняється від lodash?» — lodash рахує час від останнього **виклику** через `Date.now()` і будує throttle як debounce з `maxWait`.

> [!task] curry з плейсхолдерами
> level: senior · difficulty: hard · id: jsk-03-task-08 · tags: closures, functional
>
> Розшир `curry(fn)`: аргументи можуть містити `curry.placeholder` — він резервує позицію, яку заповнить **наступний** переданий аргумент. `fn` викликається, коли перші `fn.length` аргументів зібрані і серед них немає плейсхолдерів.
>
> ```js
> const _ = curry.placeholder
> const join = curry((a, b, c) => `${a}_${b}_${c}`)
> join(_, 2)(1, 3)     // → '1_2_3'
> join(_, _, 3)(1)(2)  // → '1_2_3'
> ```
>
> ```js starter
> function curry(fn) {
>   // твій код
> }
>
> curry.placeholder = Symbol('curry.placeholder')
> ```
>
> ```js tests
> const join = (a, b, c) => `${a}_${b}_${c}`
>
> test('без плейсхолдерів працює як звичайний curry', () => {
>   const c = curry(join)
>   expect(c(1, 2, 3)).toBe('1_2_3')
>   expect(c(1)(2)(3)).toBe('1_2_3')
>   expect(c(1, 2)(3)).toBe('1_2_3')
> })
>
> test('плейсхолдер на першій позиції', () => {
>   const _ = curry.placeholder
>   expect(curry(join)(_, 2)(1, 3)).toBe('1_2_3')
> })
>
> test('кілька плейсхолдерів заповнюються по черзі', () => {
>   const _ = curry.placeholder
>   expect(curry(join)(_, _, 3)(1)(2)).toBe('1_2_3')
>   expect(curry(join)(_, _, _)(1)(_, 3)(2)).toBe('1_2_3')
> })
>
> test('плейсхолдер у наступному виклику', () => {
>   const _ = curry.placeholder
>   expect(curry(join)(_, 2)(_, 3)(1)).toBe('1_2_3')
> })
>
> test('не викликає fn, поки є плейсхолдери', () => {
>   const _ = curry.placeholder
>   let calls = 0
>   const c = curry((a, b) => { calls++; return a + b })
>   const waiting = c(_, _)
>   expect(typeof waiting).toBe('function')
>   expect(calls).toBe(0)
>   expect(waiting(1)(2)).toBe(3)
>   expect(calls).toBe(1)
> })
>
> test('часткові застосування незалежні', () => {
>   const _ = curry.placeholder
>   const withB = curry(join)(_, 'B')
>   expect(withB('A', 'C')).toBe('A_B_C')
>   expect(withB('X')('Z')).toBe('X_B_Z')
> })
> ```
>
> > [!hint]- Підказка 1
> > Умова виклику: `args.length >= fn.length` **і** серед `args.slice(0, fn.length)` немає плейсхолдерів.
>
> > [!hint]- Підказка 2
> > При злитті пройди по старих `args`: кожен плейсхолдер замінюй на наступний із нових аргументів (якщо вони ще є), а залишок нових допиши в кінець.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function curry(fn) {
> >   return function curried(...args) {
> >     const ready = args.length >= fn.length && args.slice(0, fn.length).every((arg) => arg !== curry.placeholder)
> >     if (ready) return fn.apply(this, args)
> >     return function (...next) {
> >       const queue = [...next]
> >       const merged = args.map((arg) => (arg === curry.placeholder && queue.length > 0 ? queue.shift() : arg))
> >       return curried.apply(this, [...merged, ...queue])
> >     }
> >   }
> > }
> >
> > curry.placeholder = Symbol('curry.placeholder')
> > ```
> > **Складність:** O(n) на крок. **Чому так:** копія `queue` замість мутації `next` і новий `merged` на кожному кроці зберігають незалежність гілок. Плейсхолдер — `Symbol`, тож його не сплутати з жодним реальним значенням. **Що спитають далі:** «плейсхолдер у новому виклику, що заповнює старий плейсхолдер?» — він просто лишається плейсхолдером (тест «плейсхолдер у наступному виклику»); «чому lodash використовує `_` як плейсхолдер?» — `_.curry.placeholder === _`, зручно в коді.

## 🎤 На співбесіді

> [!interview] Як зберегти `this` і аргументи в декораторі на кшталт debounce?
> level: middle · frequency: дуже часто · id: jsk-03-int-01
>
> ---
>
> Обгортка має бути **звичайною функцією**, а не стрілкою: так вона отримує `this` місця виклику (`obj.method()` → `obj`). Усередині передаю його далі через `fn.apply(this, args)` з rest-параметром `...args` — і жодного аргументу не губиться. Якщо виклик відкладений (таймер), запам'ятовую `this` і аргументи в замиканні (`lastThis`, `lastArgs`) або використовую стрілку всередині `setTimeout`, яка захоплює `this` зовнішньої функції. І не забуваю повернути результат, якщо виклик синхронний.
>
> 📚 [[JavaScript - 06. this]] · [javascript.info: Decorators and forwarding, call/apply](https://javascript.info/call-apply-decorators)

> [!interview] Які проблеми з пам'яттю має memoize і як їх розв'язати?
> level: senior · frequency: часто · id: jsk-03-int-02
>
> ---
>
> Кеш росте безмежно — це витік пам'яті для функцій з великою кількістю різних аргументів. Рішення: LRU з обмеженням розміру (`Map` + видалення найстарішого), TTL для даних, що старіють, `WeakMap` для об'єктних ключів (запис зникне разом з ключем). Друга проблема — ключ: за замовчуванням лише перший аргумент; `JSON.stringify(args)` повільний і неточний. Третя — кешування помилок і промісів: для async-функцій кешують проміс (дедуплікація паралельних запитів), але видаляють його з кешу при reject.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття]] · [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) · [GreatFrontEnd: Memoize](https://www.greatfrontend.com/questions/javascript/memoize)

> [!interview] Коли `fn.length` бреше і як це ламає curry?
> level: middle · frequency: іноді · id: jsk-03-int-03
>
> ---
>
> `length` рахує параметри **до першого** дефолтного чи rest-параметра: `((a, b = 2) => {}).length === 1`, `((...args) => {}).length === 0`, деструктуризація рахується як один параметр. Тому `curry` для таких функцій викличе їх зарано. Рішення — явна арність `curry(fn, arity = fn.length)`. Аналогічно `bind` зменшує `length` на кількість зв'язаних аргументів, а обгортки-декоратори з `...args` мають `length === 0`, тож каррі поверх декоратора не працює без явної арності.
>
> 📚 [[JavaScript - 15. Функції глибоко]] · [MDN: Function: length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length)

## ⚡ Фішки

> [!reel] ⏱️ Тести debounce без чекання
> `vi.useFakeTimers()` підміняє годинник, а `vi.advanceTimersByTime(1000)` миттєво «перемотує» секунду. Тест з таймерами виконується за мілісекунди і ніколи не флейкає.

> [!reel] 📏 `length` функції — не те, що здається
> Дефолтний параметр обриває підрахунок.
>
> ```js
> ((a, b = 1, c) => {}).length // → 1
> ((...args) => {}).length     // → 0
> ```

> [!reel] 🧩 compose — це pipe задом наперед
> `compose(f, g)(x) === f(g(x))` читається як математика, `pipe(f, g)(x) === g(f(x))` — як конвеєр. Redux `compose` і RxJS `pipe` — саме ці дві ідеї.

## 🧠 Закріплення

> [!question]- Що таке функція вищого порядку?
> *часто · теорія* · `jsk-03-001`
>
> Функція, яка приймає функцію як аргумент і/або повертає функцію. `map`, `filter`, `debounce`, `memoize`, `curry` — усі такі. Можливо завдяки тому, що функції в JS — значення першого класу.
>
> 📚 [[JavaScript - 15. Функції глибоко]] · [MDN: First-class Function](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)

> [!question]- Чому декоратор повертає `function`, а не стрілку?
> *дуже часто · пастка* · `jsk-03-002`
>
> Стрілка не має власного `this` — бере його з місця створення (тобто з декоратора, де `this` — `undefined`). Звичайна функція отримує `this` з місця виклику, і його можна передати в `fn.apply(this, args)`.
>
> 📚 [[JavaScript - 06. this]] · [MDN: Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

> [!question]- Чим каррінг відрізняється від часткового застосування?
> *часто · порівняння* · `jsk-03-003`
>
> Каррінг перетворює `f(a, b, c)` на ланцюжок, що приймає аргументи порціями, доки їх не вистачить. Часткове застосування фіксує **деякі** аргументи один раз і повертає функцію від решти (`partial`, `bind`). Каррі-функцію можна частково застосовувати багато разів.
>
> 📚 [[JavaScript - 05. Замикання]] · [javascript.info: Currying](https://javascript.info/currying-partials)

> [!question]- Чим debounce відрізняється від throttle?
> *дуже часто · порівняння* · `jsk-03-004`
>
> Debounce чекає **тиші** `ms` і викликає один раз після серії (пошук, автозбереження). Throttle викликає **не частіше** разу на `ms` під час безперервного потоку (скрол, resize, drag). Debounce при безперервних подіях може не викликатися взагалі; throttle — гарантує рівномірні виклики.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни]] · [MDN: Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce) · [MDN: Throttle](https://developer.mozilla.org/en-US/docs/Glossary/Throttle)

> [!question]- Навіщо throttle відкриває нове вікно після trailing-виклику?
> *іноді · код* · `jsk-03-005`
>
> Щоб не порушити гарантію «не частіше разу на `ms`». Без нового вікна наступна подія одразу після trailing-виклику пройшла б як leading, і два виклики стались би майже одночасно.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни]] · [GreatFrontEnd: Throttle](https://www.greatfrontend.com/questions/javascript/throttle)

> [!question]- Чому `memoize` перевіряє `cache.has(key)`, а не `cache.get(key) !== undefined`?
> *часто · пастка* · `jsk-03-006`
>
> Функція може законно повертати `undefined`. Перевірка через `get` вважатиме такий результат «не закешованим» і щоразу викликатиме функцію знову. `has` відрізняє «немає запису» від «запис зі значенням `undefined`».
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] · [MDN: Map.prototype.has()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has)

> [!question]- Чому плейсхолдер у curry краще робити `Symbol`?
> *рідко · код* · `jsk-03-007`
>
> Символ унікальний: його неможливо випадково передати як реальне значення. Плейсхолдер-рядок `'_'` чи `null` зламав би виклики, де такі значення — легітимні аргументи.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect]] · [MDN: Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Closure](https://javascript.info/closure) — як працює стан у замиканні
- 🟢 [javascript.info — Decorators and forwarding, call/apply](https://javascript.info/call-apply-decorators) — саме ті обгортки, що в цьому розділі
- 🟢 [javascript.info — Currying](https://javascript.info/currying-partials) — каррінг з нуля
- 🟡 [MDN — Function: length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length) — правила підрахунку параметрів
- 🛠️ [GreatFrontEnd — Debounce](https://www.greatfrontend.com/questions/javascript/debounce) і [Throttle](https://www.greatfrontend.com/questions/javascript/throttle) — класичні формулювання задач
- 🛠️ [GreatFrontEnd — Curry](https://www.greatfrontend.com/questions/javascript/curry) і [Curry II](https://www.greatfrontend.com/questions/javascript/curry-ii) — прогресія складності каррінгу
- 🛠️ [BFE.dev — implement curry() with placeholder support](https://bigfrontend.dev/problem/implement-curry-with-placeholder) — та сама задача з плейсхолдерами
- 🛠️ [BFE.dev — what is Composition? create a pipe()](https://bigfrontend.dev/problem/what-is-composition-create-a-pipe) — композиція функцій

> [!important] Підсумок
> - Декоратор = `function (...args) { return fn.apply(this, args) }` + стан у замиканні.
> - Ніколи не повертай стрілку з декоратора, якщо `this` має значення.
> - `memoize` — `Map` + `has`; думай про ріст кешу і ключі.
> - debounce чекає тиші, throttle обмежує частоту; leading/trailing — коли саме відбувається виклик.
> - Час тестуй фейковими таймерами — швидко і детерміновано.
