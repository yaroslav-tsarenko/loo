---
title: Код-рев'ю
order: 9
level: middle
tags: [code-review, bugs, closures, async, immutability, race-conditions]
prerequisites:
  - "[[JavaScript - 04. Scope, hoisting і TDZ]]"
  - "[[JavaScript - 06. this]]"
  - "[[JavaScript - 10. async і await]]"
estimatedMinutes: 80
id: jsk-ch-09
icon: "🔍"
---

# JavaScript Katas - 09. Код-рев'ю

> [!success] 🎯 Що тренуємо
> - Читати чужий код і знаходити баг **до** запуску — за симптомом у тесті й знанням типових пасток.
> - Розпізнавати класичні JS-баги: `var` у циклі, втрачений `this`, `async` у `forEach`, `return` без `await`, мутація через поверхневу копію, гонка відповідей.
> - Виправляти мінімально і пояснювати **чому** — так, як це роблять у рев'ю.

## 🧭 Стратегія

Формат «ось код, він не працює — знайди баг» дедалі частіше замінює класичний лайвкодинг: він ближчий до реальної роботи. У кожній задачі нижче **заготовка вже містить баг** (інколи два), тести червоні. Твоє завдання — виправити код так, щоб усі тести стали зеленими, змінивши якомога менше.

**Як читати код на рев'ю — п'ять проходів:**

1. **Контракт.** Що функція обіцяє? Що повертає для порожнього вводу? Чи мутує аргументи?
2. **Межі.** Індекси (`<` чи `<=`), порожні колекції, `0`, `''`, `NaN`, `null`.
3. **Область видимості й `this`.** `var` у циклах і замиканнях; `function` всередині методу; методи, передані як колбеки.
4. **Асинхронність.** Чи кожен проміс або `await`-иться, або повертається? `async`-колбек у `forEach`/`map` без `Promise.all`? `try/catch` навколо `return promise`?
5. **Посилання.** Spread копіює лише верхній рівень; `sort`, `reverse`, `splice` мутують; спільні об'єкти між станами.

> [!tip] Читай симптом
> Тест каже не лише «впало», а **як**: `expected 9, received 2` при медіані — підказка про рядкове сортування; `received 3, 3, 3` — про спільну змінну циклу; `TypeError: Cannot read properties of undefined` у таймері — про `this`.

## 🧩 Збери з пам'яті

> [!quiz] Заповни пропуск, щоб кожен обробник пам'ятав свій індекс
> level: junior · type: fill · id: jsk-09-quiz-01 · bank: var, const
>
> ```js fill
> const handlers = []
> for ([[let]] i = 0; i < 3; i++) {
>   handlers.push(() => i)
> }
> handlers.map((h) => h()) // → [0, 1, 2]
> ```
>
> **Пояснення:** `let` у заголовку `for` створює **нову** прив'язку `i` на кожну ітерацію, і кожне замикання бачить свою. З `var` змінна одна на всю функцію — усі обробники повернуть `3`. `const` тут не підійде: `i++` змінює змінну.

> [!quiz] Збери правильну асинхронну суму
> level: middle · type: order · id: jsk-09-quiz-02
>
> ```js order
> async function sumAll(ids, fetchNumber) {
>   let total = 0
>   for (const id of ids) {
>     total += await fetchNumber(id)
>   }
>   return total
> }
> ids.forEach(async (id) => {   // ✗
> ```
>
> **Пояснення:** `forEach` ігнорує повернені проміси — функція повертає `total` до того, як хоч один запит завершився. `for…of` з `await` чекає кожен по черзі (а `Promise.all` — паралельно).

> [!quiz] Заповни пропуски в незмінному оновленні вкладеного стану
> level: middle · type: fill · id: jsk-09-quiz-03
>
> ```js fill
> const user = state.users[userId]
> return {
>   ...state,
>   users: {
>     ...state.[[users]],
>     [userId]: { ...user, address: { ...user.[[address]], city } },
>   },
> }
> ```
>
> **Пояснення:** копіюється **кожен рівень на шляху** до зміни, а сусідні гілки лишаються тими самими об'єктами (structural sharing) — тож `===`-порівняння в React/Redux бачать, що змінилось, а що ні.

## 🛠️ Задачі

> [!task] Усі обробники повертають одне число
> level: junior · difficulty: easy · id: jsk-09-task-01 · tags: closures, var, code-review
>
> `createHandlers(count)` має повернути масив функцій, де `i`-та функція повертає `i`. Зараз усі повертають `count`. Знайди і виправ баг.
>
> ```js starter
> function createHandlers(count) {
>   var handlers = []
>   for (var i = 0; i < count; i++) {
>     handlers.push(function () {
>       return i
>     })
>   }
>   return handlers
> }
> ```
>
> ```js tests
> test('кожен обробник повертає свій індекс', () => {
>   const handlers = createHandlers(3)
>   expect(handlers.map((h) => h())).toEqual([0, 1, 2])
> })
>
> test('довжина масиву', () => {
>   expect(createHandlers(5)).toHaveLength(5)
>   expect(createHandlers(0)).toEqual([])
> })
>
> test('обробники незалежні між викликами', () => {
>   const a = createHandlers(2)
>   const b = createHandlers(4)
>   expect(a[1]()).toBe(1)
>   expect(b[3]()).toBe(3)
> })
> ```
>
> > [!hint]- Підказка 1
> > Скільки змінних `i` існує за `var`? Що бачить кожне замикання в момент **виклику**, а не створення?
>
> > [!hint]- Підказка 2
> > Достатньо замінити одне слово в заголовку циклу.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createHandlers(count) {
> >   const handlers = []
> >   for (let i = 0; i < count; i++) {
> >     handlers.push(function () {
> >       return i
> >     })
> >   }
> >   return handlers
> > }
> > ```
> > **Складність:** O(n). **Чому так:** `var` має функціональну область видимості — одна `i` на всі ітерації, і на момент виклику вона вже `count`. `let` у `for` створює нову прив'язку на кожну ітерацію. До ES2015 це лікували IIFE: `(function (j) { … })(i)`. **Що спитають далі:** «що виведе `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))`?» — `3 3 3`; «яке правило ESLint ловить це?» — `no-loop-func`.

> [!task] map(parseInt) повертає NaN
> level: junior · difficulty: easy · id: jsk-09-task-02 · tags: parseInt, callbacks, code-review
>
> `toNumbers(strings)` має перетворити рядки на **цілі десяткові** числа, як `parseInt(s, 10)`: `'3.9'` → `3`, `' 7 '` → `7`, `'abc'` → `NaN`. Зараз для частини рядків виходить `NaN`. Виправ.
>
> ```js starter
> function toNumbers(strings) {
>   return strings.map(parseInt)
> }
> ```
>
> ```js tests
> test('прості числа', () => {
>   expect(toNumbers(['1', '2', '3'])).toEqual([1, 2, 3])
> })
>
> test('однакові рядки дають однакові числа', () => {
>   expect(toNumbers(['10', '10', '10', '10'])).toEqual([10, 10, 10, 10])
> })
>
> test('ведучі нулі, пробіли й дробові', () => {
>   expect(toNumbers(['08', ' 7 ', '3.9'])).toEqual([8, 7, 3])
> })
>
> test('некоректні рядки → NaN', () => {
>   expect(toNumbers(['abc', '12', ''])).toEqual([NaN, 12, NaN])
> })
>
> test('порожній масив', () => {
>   expect(toNumbers([])).toEqual([])
> })
> ```
>
> > [!hint]- Підказка 1
> > `map` викликає колбек з **трьома** аргументами: `(value, index, array)`. Що `parseInt` робить зі своїм другим аргументом?
>
> > [!hint]- Підказка 2
> > Другий аргумент `parseInt` — основа числення. `parseInt('10', 1)` → `NaN`, `parseInt('10', 2)` → `2`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function toNumbers(strings) {
> >   return strings.map((s) => parseInt(s, 10))
> > }
> > ```
> > **Складність:** O(n). **Чому так:** `map(parseInt)` передає індекс як `radix`: індекс 0 означає «визначити автоматично» (тому перший елемент працює), 1 — неприпустима основа (`NaN`), 2 — двійкова. Явна стрілка передає лише потрібне. **Що спитають далі:** «чим `Number('3.9')` відрізняється від `parseInt`?» — `Number` парсить увесь рядок (`3.9`, а `'12px'` → `NaN`), `parseInt` — префікс цілого; «яке правило лінтера вимагає radix?» — `radix`.

> [!task] Медіана, що ламає масив
> level: junior · difficulty: easy · id: jsk-09-task-03 · tags: sort, mutation, code-review
>
> `median(numbers)` має повертати медіану **і не змінювати** вхідний масив. Для парної кількості — середнє двох центральних; для порожнього масиву — `NaN`. Зараз результат інколи неправильний, а масив викликача змінюється. Виправ обидва баги.
>
> ```js starter
> function median(numbers) {
>   const sorted = numbers.sort()
>   const mid = Math.floor(sorted.length / 2)
>   return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
> }
> ```
>
> ```js tests
> test('непарна кількість', () => {
>   expect(median([3, 1, 2])).toBe(2)
> })
>
> test('числа різної розрядності', () => {
>   expect(median([10, 9, 2])).toBe(9)
>   expect(median([100, 25, 3, 7, 50])).toBe(25)
> })
>
> test('парна кількість', () => {
>   expect(median([1, 10, 2, 9])).toBe(5.5)
> })
>
> test('від\'ємні й дробові', () => {
>   expect(median([-5, -10, 0.5])).toBe(-5)
> })
>
> test('не мутує вхідний масив', () => {
>   const data = [3, 1, 2]
>   median(data)
>   expect(data).toEqual([3, 1, 2])
> })
>
> test('порожній масив → NaN', () => {
>   expect(median([])).toBeNaN()
> })
> ```
>
> > [!hint]- Підказка 1
> > Як `sort()` без аргументів порівнює `10` і `9`?
>
> > [!hint]- Підказка 2
> > `sort` сортує **на місці** й повертає той самий масив. Потрібна копія (`[...numbers]` або `toSorted`) і числовий компаратор.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function median(numbers) {
> >   const sorted = [...numbers].sort((a, b) => a - b)
> >   const mid = Math.floor(sorted.length / 2)
> >   return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
> > }
> > ```
> > **Складність:** O(n log n). **Чому так:** без компаратора елементи порівнюються як рядки (`'10' < '9'`); `sort` мутує, і викликач раптом отримує відсортовані дані. У сучасному JS — `numbers.toSorted((a, b) => a - b)`. **Що спитають далі:** «медіана за O(n)?» — quickselect; «медіана потоку?» — дві купи (max-heap і min-heap).

> [!task] Таймер втрачає this
> level: middle · difficulty: medium · id: jsk-09-task-04 · tags: this, timers, code-review
>
> Клас `Ticker` має збільшувати `ticks` кожні `intervalMs`. Повторний `start()` під час роботи нічого не робить, `stop()` зупиняє, а після `stop()` можна знову `start()`. Зараз таймер падає, а повторний старт подвоює швидкість. Виправ.
>
> ```js starter
> class Ticker {
>   constructor(intervalMs) {
>     this.intervalMs = intervalMs
>     this.ticks = 0
>     this.id = null
>   }
>
>   start() {
>     this.id = setInterval(function () {
>       this.ticks++
>     }, this.intervalMs)
>   }
>
>   stop() {
>     clearInterval(this.id)
>   }
> }
> ```
>
> ```js tests
> test('рахує тіки', () => {
>   vi.useFakeTimers()
>   const t = new Ticker(1000)
>   t.start()
>   vi.advanceTimersByTime(3500)
>   expect(t.ticks).toBe(3)
>   t.stop()
> })
>
> test('повторний start не запускає другий інтервал', () => {
>   vi.useFakeTimers()
>   const t = new Ticker(100)
>   t.start()
>   t.start()
>   vi.advanceTimersByTime(300)
>   expect(t.ticks).toBe(3)
>   t.stop()
> })
>
> test('stop зупиняє', () => {
>   vi.useFakeTimers()
>   const t = new Ticker(100)
>   t.start()
>   vi.advanceTimersByTime(250)
>   t.stop()
>   vi.advanceTimersByTime(1000)
>   expect(t.ticks).toBe(2)
>   expect(vi.getTimerCount()).toBe(0)
> })
>
> test('після stop можна запустити знову', () => {
>   vi.useFakeTimers()
>   const t = new Ticker(100)
>   t.start()
>   vi.advanceTimersByTime(100)
>   t.stop()
>   t.start()
>   vi.advanceTimersByTime(200)
>   expect(t.ticks).toBe(3)
>   t.stop()
> })
> ```
>
> > [!hint]- Підказка 1
> > Чому дорівнює `this` всередині `function`, яку викликає таймер (у strict mode)?
>
> > [!hint]- Підказка 2
> > Стрілка бере `this` з `start`. Для двох інших тестів: `start` має перевіряти, чи вже є `id`, а `stop` — скидати `id` у `null`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class Ticker {
> >   constructor(intervalMs) {
> >     this.intervalMs = intervalMs
> >     this.ticks = 0
> >     this.id = null
> >   }
> >
> >   start() {
> >     if (this.id !== null) return
> >     this.id = setInterval(() => {
> >       this.ticks++
> >     }, this.intervalMs)
> >   }
> >
> >   stop() {
> >     clearInterval(this.id)
> >     this.id = null
> >   }
> > }
> > ```
> > **Складність:** O(1). **Чому так:** таймер викликає колбек як звичайну функцію — `this` у strict mode `undefined` (у браузері без strict — `window`), тож `this.ticks++` падає або тихо псує глобальний об'єкт. Стрілка лексично бере `this` методу. Охоронна умова в `start` — ідемпотентність; без скидання `id` у `stop` повторний старт був би неможливий. **Що спитають далі:** «інші способи?» — `.bind(this)` або метод-стрілка в полі класу `tick = () => {…}`; «чому `setInterval` дрейфує?» — інтервал рахується від планування, а не від реального часу; точні таймери — `setTimeout` з корекцією за `Date.now()`.

> [!task] Асинхронна сума повертає 0
> level: middle · difficulty: medium · id: jsk-09-task-05 · tags: async, foreach, code-review
>
> `sumAll(ids, fetchNumber)` має завантажити число для кожного `id` (асинхронно) і повернути суму. Помилка будь-якого завантаження має відхилити результат. `fetchNumber` треба викликати **лише з `id`**. Зараз функція повертає `0`. Виправ.
>
> ```js starter
> async function sumAll(ids, fetchNumber) {
>   let total = 0
>   ids.forEach(async (id) => {
>     total += await fetchNumber(id)
>   })
>   return total
> }
> ```
>
> ```js tests
> const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
>
> test('сумує асинхронні значення', async () => {
>   const fetchNumber = async (id) => { await wait(5 * id); return id * 10 }
>   await expect(sumAll([1, 2, 3], fetchNumber)).resolves.toBe(60)
> })
>
> test('порожній список → 0', async () => {
>   await expect(sumAll([], async () => 1)).resolves.toBe(0)
> })
>
> test('помилка завантаження відхиляє результат', async () => {
>   const fetchNumber = async (id) => {
>     await wait(1)
>     if (id === 2) throw new Error('немає даних')
>     return id
>   }
>   await expect(sumAll([1, 2, 3], fetchNumber)).rejects.toThrow('немає даних')
> })
>
> test('fetchNumber отримує лише id', async () => {
>   const fetchNumber = vi.fn(async () => 1)
>   await sumAll([7, 8], fetchNumber)
>   expect(fetchNumber).toHaveBeenCalledWith(7)
>   expect(fetchNumber).toHaveBeenCalledWith(8)
>   expect(fetchNumber).toHaveBeenCalledTimes(2)
> })
> ```
>
> > [!hint]- Підказка 1
> > Що `forEach` робить із промісом, який повертає `async`-колбек?
>
> > [!hint]- Підказка 2
> > Паралельно: `await Promise.all(ids.map((id) => fetchNumber(id)))`. Не передавай `fetchNumber` напряму в `map` — він отримає ще й індекс і масив.
>
> > [!solution]- Еталонне рішення
> > ```js
> > async function sumAll(ids, fetchNumber) {
> >   const values = await Promise.all(ids.map((id) => fetchNumber(id)))
> >   return values.reduce((total, value) => total + value, 0)
> > }
> > ```
> > **Складність:** O(n) операцій, час ≈ найдовший запит (паралельно). **Чому так:** `forEach` не чекає промісів — `return total` спрацьовує до першого `await`, а помилки стають unhandled rejections. `Promise.all` і чекає, і пробрасує першу помилку. **Що спитають далі:** «а якщо запитів 10 000?» — пул з обмеженням конкурентності (розділ 5); «чому `total +=` з `await` — гонка?» — `total` читається до `await`, а записується після: паралельні виклики перезаписують одне одного (правило ESLint `require-atomic-updates`).

> [!task] try/catch, що нічого не ловить
> level: middle · difficulty: medium · id: jsk-09-task-06 · tags: async, error-handling, code-review
>
> `safeLoad(load, fallback)` має повернути результат `load()`, а при **будь-якій** помилці — `fallback`. Зараз асинхронні помилки пролітають повз `catch`. Виправ.
>
> ```js starter
> async function safeLoad(load, fallback) {
>   try {
>     return load()
>   } catch (error) {
>     return fallback
>   }
> }
> ```
>
> ```js tests
> test('успішне завантаження', async () => {
>   await expect(safeLoad(async () => 'дані', 'запасне')).resolves.toBe('дані')
> })
>
> test('відхилений проміс → fallback', async () => {
>   await expect(safeLoad(() => Promise.reject(new Error('мережа')), 'запасне')).resolves.toBe('запасне')
> })
>
> test('пізнє відхилення → fallback', async () => {
>   const load = () => new Promise((_, reject) => setTimeout(reject, 5, new Error('таймаут')))
>   await expect(safeLoad(load, [])).resolves.toEqual([])
> })
>
> test('синхронний throw → fallback', async () => {
>   await expect(safeLoad(() => { throw new Error('sync') }, 0)).resolves.toBe(0)
> })
>
> test('звичайне значення', async () => {
>   await expect(safeLoad(() => 42, 0)).resolves.toBe(42)
> })
> ```
>
> > [!hint]- Підказка 1
> > Коли саме відхиляється проміс, повернений з `load()`, — до чи після виходу з блоку `try`?
>
> > [!hint]- Підказка 2
> > Додай одне слово, щоб функція дочекалася результату **всередині** `try`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > async function safeLoad(load, fallback) {
> >   try {
> >     return await load()
> >   } catch (error) {
> >     return fallback
> >   }
> > }
> > ```
> > **Складність:** O(1). **Чому так:** `return promise` у `async`-функції виходить з `try` одразу, і проміс «приєднується» до результату вже поза блоком — його відхилення `catch` не бачить. `return await` чекає всередині `try`. Тому `return await` усередині `try/catch` — правильний (і рекомендований typescript-eslint `return-await`) патерн, а «зайвий await» — міф лише поза `try`. **Що спитають далі:** «логування помилки?» — `catch (error) { report(error); return fallback }`; «чи ковтати всі помилки?» — ні: `AbortError` зазвичай пробрасують далі.

> [!task] Незмінне оновлення, яке все змінює
> level: middle · difficulty: medium · id: jsk-09-task-07 · tags: immutability, spread, code-review
>
> `updateCity(state, userId, city)` має повернути **новий** стан, де в користувача `userId` змінено `address.city`. Початковий стан не можна змінювати; гілки, яких зміна не стосується, мають лишитися **тими самими об'єктами** (structural sharing). Зараз змінюється й оригінал. Виправ.
>
> ```js starter
> function updateCity(state, userId, city) {
>   const next = { ...state }
>   const user = next.users[userId]
>   user.address.city = city
>   return next
> }
> ```
>
> ```js tests
> const makeState = () => ({
>   settings: { theme: 'dark' },
>   users: {
>     u1: { name: 'Оля', address: { city: 'Київ', zip: '01001' } },
>     u2: { name: 'Іван', address: { city: 'Львів', zip: '79000' } },
>   },
> })
>
> test('нове значення в новому стані', () => {
>   const next = updateCity(makeState(), 'u1', 'Одеса')
>   expect(next.users.u1.address).toEqual({ city: 'Одеса', zip: '01001' })
>   expect(next.users.u1.name).toBe('Оля')
> })
>
> test('оригінал не змінюється', () => {
>   const state = makeState()
>   updateCity(state, 'u1', 'Одеса')
>   expect(state).toEqual(makeState())
> })
>
> test('на шляху зміни — нові об\'єкти', () => {
>   const state = makeState()
>   const next = updateCity(state, 'u1', 'Одеса')
>   expect(next === state).toBe(false)
>   expect(next.users === state.users).toBe(false)
>   expect(next.users.u1 === state.users.u1).toBe(false)
>   expect(next.users.u1.address === state.users.u1.address).toBe(false)
> })
>
> test('решта гілок — ті самі об\'єкти', () => {
>   const state = makeState()
>   const next = updateCity(state, 'u1', 'Одеса')
>   expect(next.settings).toBe(state.settings)
>   expect(next.users.u2).toBe(state.users.u2)
> })
> ```
>
> > [!hint]- Підказка 1
> > Що саме копіює `{ ...state }`? Чи є `next.users` новим об'єктом?
>
> > [!hint]- Підказка 2
> > Копіюй кожен рівень **на шляху** до `city`: `state` → `users` → `users[userId]` → `address`. Решту бери spread-ом без змін.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function updateCity(state, userId, city) {
> >   const user = state.users[userId]
> >   return {
> >     ...state,
> >     users: {
> >       ...state.users,
> >       [userId]: { ...user, address: { ...user.address, city } },
> >     },
> >   }
> > }
> > ```
> > **Складність:** O(k) — сума розмірів об'єктів на шляху, незалежно від розміру всього стану. **Чому так:** spread — поверхнева копія, тож `next.users` у заготовці — **той самий** об'єкт, що й `state.users`, і запис через нього змінює оригінал. Structural sharing робить незмінні оновлення дешевими, а порівняння `===` — точними. **Що спитають далі:** «чому не `structuredClone(state)`?» — ламає sharing (усі `memo` перерендеряться) і повільно; «як простіше?» — Immer (`produce(state, draft => { draft.users[id].address.city = city })`).

> [!task] Застарілі результати пошуку
> level: senior · difficulty: hard · id: jsk-09-task-08 · tags: async, race-conditions, code-review
>
> `createSearch(fetchResults, onResults)` повертає функцію `search(query)`. Користувач швидко друкує, і запити завершуються в довільному порядку. `onResults` має отримувати **лише** результати **останнього** виклику `search`; відповіді попередніх запитів, що прийшли пізніше, ігноруються. Зараз повільна стара відповідь перезаписує нову. Виправ.
>
> ```js starter
> function createSearch(fetchResults, onResults) {
>   return async function search(query) {
>     const results = await fetchResults(query)
>     onResults(results)
>   }
> }
> ```
>
> ```js tests
> const fakeFetch = (delays) => (query) => new Promise((resolve) => setTimeout(resolve, delays[query] ?? 1, `результати для «${query}»`))
>
> test('повільна стара відповідь не перезаписує нову', async () => {
>   const shown = []
>   const search = createSearch(fakeFetch({ a: 30, ab: 5 }), (r) => shown.push(r))
>   search('a')
>   await search('ab')
>   await sleep(40)
>   expect(shown).toEqual(['результати для «ab»'])
> })
>
> test('послідовні пошуки показуються всі', async () => {
>   const shown = []
>   const search = createSearch(fakeFetch({}), (r) => shown.push(r))
>   await search('x')
>   await search('y')
>   expect(shown).toEqual(['результати для «x»', 'результати для «y»'])
> })
>
> test('серія з трьох — показується лише остання', async () => {
>   const shown = []
>   const search = createSearch(fakeFetch({ r: 20, re: 10, rea: 15 }), (r) => shown.push(r))
>   search('r')
>   search('re')
>   search('rea')
>   await sleep(40)
>   expect(shown).toEqual(['результати для «rea»'])
> })
>
> test('кожен createSearch має власний лічильник', async () => {
>   const shownA = []
>   const shownB = []
>   const a = createSearch(fakeFetch({ q: 5 }), (r) => shownA.push(r))
>   const b = createSearch(fakeFetch({ q: 5 }), (r) => shownB.push(r))
>   await Promise.all([a('q'), b('q')])
>   expect(shownA).toHaveLength(1)
>   expect(shownB).toHaveLength(1)
> })
> ```
>
> > [!hint]- Підказка 1
> > Як `search` може дізнатися, що після неї вже стартував новіший запит?
>
> > [!hint]- Підказка 2
> > Лічильник у замиканні `createSearch`: кожен виклик бере свій номер; після `await` показуй результат, лише якщо номер досі останній.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createSearch(fetchResults, onResults) {
> >   let latestRequest = 0
> >   return async function search(query) {
> >     const requestId = ++latestRequest
> >     const results = await fetchResults(query)
> >     if (requestId === latestRequest) onResults(results)
> >   }
> > }
> > ```
> > **Складність:** O(1) на виклик. **Чому так:** порядок завершення мережевих запитів не гарантований; «last request wins» через номер запиту — найпростіший надійний захист. Debounce зменшує кількість запитів, але гонку **не** усуває. **Що спитають далі:** «не лише ігнорувати, а скасовувати?» — `AbortController`: перед новим запитом `controller.abort()` попереднього і ігнор `AbortError`; «у React?» — прапорець `ignore` або abort у cleanup `useEffect`; «бібліотеки?» — TanStack Query робить це за ключем запиту.

## 🎤 На співбесіді

> [!interview] Як ти проводиш рев'ю незнайомого коду на співбесіді?
> level: middle · frequency: часто · id: jsk-09-int-01
>
> ---
>
> Спершу з'ясовую контракт: що функція має робити, які входи, чи можна мутувати аргументи. Потім читаю «проходами» за категоріями ризиків: межі й порожні значення; область видимості і `this`; асинхронність (кожен проміс чекається чи повертається, помилки не губляться, немає гонок); мутації й поверхневі копії; продуктивність (O(n²) через `includes` у циклі). Кожну знахідку формулюю як «симптом → причина → мінімальне виправлення» і пропоную тест, що її ловить. Окремо відділяю баги від стилістичних побажань — у рев'ю це різні пріоритети.
>
> 📚 [[JavaScript - 33. Тестування JavaScript]] · [Google: How to do a code review](https://google.github.io/eng-practices/review/reviewer/)

> [!interview] Чому `async`-колбек у `forEach` — майже завжди баг?
> level: middle · frequency: дуже часто · id: jsk-09-int-02
>
> ---
>
> `forEach` викликає колбек і **ігнорує** його результат, тобто проміс. Код після `forEach` виконується одразу, не дочекавшись жодного `await`; помилки стають unhandled rejections; спільні змінні змінюються «колись потім». Правильні варіанти: послідовно — `for…of` з `await`; паралельно — `await Promise.all(items.map(async …))`; з обмеженням — пул. Те саме стосується `map` без `Promise.all`, `filter` з `async`-предикатом (проміс завжди truthy) і `reduce` без ланцюжка промісів.
>
> 📚 [[JavaScript - 10. async і await]] · [MDN: Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

> [!interview] Як захиститися від гонки відповідей у UI?
> level: senior · frequency: часто · id: jsk-09-int-03
>
> ---
>
> Гонка: два запити, відповіді приходять у зворотному порядку, і на екрані старі дані. Варіанти: номер запиту в замиканні і показ лише актуального («last request wins»); скасування попереднього через `AbortController` (економить і мережу); у React — прапорець `ignore` у cleanup `useEffect`; бібліотеки даних (TanStack Query, SWR) роблять це за ключем. Debounce зменшує частоту запитів, але не прибирає гонку — його використовують **разом** з одним із методів вище.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни]] · [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

## ⚡ Фішки

> [!reel] 🤯 ['10','10','10'].map(parseInt)
> Результат — `[10, NaN, 2]`: `map` передає індекс як основу числення. Основа 0 — «авто», 1 — неможлива, 2 — двійкова.

> [!reel] 🪞 Spread — це дзеркало лише першого рівня
> `{ ...state }` копіює посилання на вкладені об'єкти. Змінив `next.users.u1` — змінив і `state.users.u1`.

> [!reel] 🎣 return без await у try
> `try { return load() } catch {}` не ловить відхилений проміс: функція вже вийшла з `try`. Пиши `return await load()`.

## 🧠 Закріплення

> [!question]- Чому `var` у циклі з замиканнями дає однакові значення?
> *дуже часто · пастка* · `jsk-09-001`
>
> `var` має функціональну область видимості: на весь цикл одна змінна, і замикання бачать її **поточне** значення на момент виклику — кінцеве. `let` у заголовку `for` створює нову прив'язку на кожну ітерацію.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ]] · [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)

> [!question]- Чому `['1', '2', '3'].map(parseInt)` дає `[1, NaN, NaN]`?
> *часто · пастка* · `jsk-09-002`
>
> `map` передає `(value, index)`, а `parseInt` трактує другий аргумент як основу: `parseInt('2', 1)` — недопустима основа → `NaN`, `parseInt('3', 2)` — цифри 3 у двійковій немає → `NaN`. Лікується стрілкою `s => parseInt(s, 10)` або `Number`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль]] · [MDN: parseInt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)

> [!question]- Які методи масиву мутують його?
> *часто · теорія* · `jsk-09-003`
>
> `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`. Незмінні аналоги з ES2023: `toSorted`, `toReversed`, `toSpliced`, `with`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль]] · [MDN: Array.prototype.toSorted()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)

> [!question]- Чому `this` губиться в колбеку `setInterval` і як це виправити?
> *дуже часто · пастка* · `jsk-09-004`
>
> Таймер викликає функцію без об'єкта перед крапкою — `this` дорівнює `undefined` у strict mode (або глобальному об'єкту без нього). Виправлення: стрілка (лексичний `this`), `.bind(this)` або метод-стрілка в полі класу.
>
> 📚 [[JavaScript - 06. this]] · [javascript.info: Function binding](https://javascript.info/bind)

> [!question]- Коли `return await` потрібен?
> *часто · теорія* · `jsk-09-005`
>
> Усередині `try/catch` (щоб відхилення потрапило в `catch`) і `try/finally` (щоб `finally` виконався після завершення операції). Поза `try` різниця лише в одному тіку і в стек-трейсі.
>
> 📚 [[JavaScript - 10. async і await]] · [typescript-eslint: return-await](https://typescript-eslint.io/rules/return-await/)

> [!question]- Що таке structural sharing?
> *іноді · теорія* · `jsk-09-006`
>
> При незмінному оновленні копіюються лише об'єкти на шляху до зміни, а незмінені гілки переходять у новий стан за посиланням. Це дешево за пам'яттю й часом і дозволяє порівнювати піддерева через `===` (React `memo`, селектори Redux).
>
> 📚 [[JavaScript - 03. Значення та посилання]] · [Redux: Immutable Update Patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns)

> [!question]- Чому debounce не захищає від гонки відповідей?
> *іноді · пастка* · `jsk-09-007`
>
> Debounce лише зменшує кількість запитів. Два запити, що все ж пішли (пауза в наборі довша за затримку), можуть завершитися в будь-якому порядку. Потрібен номер запиту або `AbortController`.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни]] · [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

## 📚 Джерела та що почитати

- 🟢 [Google — How to do a code review](https://google.github.io/eng-practices/review/reviewer/) — на що дивитися в рев'ю і як формулювати коментарі
- 🟡 [MDN — Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) — чому `forEach` не чекає промісів
- 🟡 [MDN — async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) — повернення промісів і `await`
- 🟡 [Redux — Immutable Update Patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns) — копіювання вкладених рівнів
- 🛠️ [ESLint — no-loop-func](https://eslint.org/docs/latest/rules/no-loop-func), [radix](https://eslint.org/docs/latest/rules/radix), [require-atomic-updates](https://eslint.org/docs/latest/rules/require-atomic-updates) — правила, що ловлять баги цього розділу
- 🛠️ [typescript-eslint — return-await](https://typescript-eslint.io/rules/return-await/) — коли `await` у `return` обов'язковий

> [!important] Підсумок
> - Читай код проходами: контракт → межі → scope і `this` → асинхронність → посилання.
> - `var` у циклі, `map(parseInt)`, `sort()` без компаратора — три класичні «однорядкові» баги.
> - `async` у `forEach` і `return` без `await` у `try` гублять проміси й помилки.
> - Spread — поверхневий; незмінне оновлення копіює кожен рівень на шляху.
> - Гонки відповідей лікує номер запиту або `AbortController`, а не debounce.
