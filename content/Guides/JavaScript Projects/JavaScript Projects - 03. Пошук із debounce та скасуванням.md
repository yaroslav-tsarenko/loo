---
title: Пошук із debounce та скасуванням
order: 3
level: middle
tags: [async, debounce, abortcontroller, cache, race-conditions]
prerequisites:
  - "[[JavaScript - 14. Debounce, throttle та async-патерни]]"
  - "[[JavaScript - 10. async і await]]"
  - "[[JavaScript - 27. Мережа — fetch, CORS і HTTP]]"
estimatedMinutes: 110
id: jsp-ch-03
icon: "🔎"
---

# JavaScript Projects - 03. Пошук із debounce та скасуванням

> [!success] 🎯 Після цього розділу ти зможеш
> - Написати `debounce` з `cancel` і `flush` і тестувати його фейковими таймерами.
> - Скасовувати застарілі запити через `AbortController` і **гарантовано** не показувати відповідь, що запізнилась.
> - Зробити кеш з TTL і LRU-витісненням на `Map`.
> - Підсвічувати збіги **без** `innerHTML` — сегментами, безпечними від XSS.
> - Зібрати контролер пошуку, якому `fetch` передають ззовні, — і тестувати мережу без мережі.

## 🎯 Що збудуємо

Поле пошуку з автопідказками, яке поводиться як у хороших продуктах: не шле запит на кожну літеру, не блимає старими результатами, миттєво показує вже бачене і не ламається від повільної мережі.

```text
 користувач друкує: r → re → rea → react
        │
        ▼
 setQuery(q) ── коротший за minLength? ──▶ idle, скасувати все
        │
        ├── є в кеші (normalizeQuery)? ──▶ success одразу, без мережі
        │
        ▼
 debounce(300 мс) ── «тиша» ──▶ run(q)
                                  │
                                  ▼
                 takeLatest: abort() попереднього ──▶ AbortController
                                  │                       │ signal
                                  ▼                       ▼
                       searchApi(fetcher, q, { signal }) ──▶ fetcher (ін'єкція)
                                  │                         fetch | fake у тестах
                                  ▼
                 застаріла відповідь? ──▶ AbortError (ігноруємо)
                                  │
                                  ▼
                  cache.set ──▶ setState({ status: 'success', results })
                                  │
                                  ▼
                 subscribe ──▶ UI: highlight(text, query) → сегменти → textContent
```

Три різні механізми захищають від «гонок»: **debounce** зменшує кількість запитів, **abort** звільняє мережу від непотрібних, **перевірка застарілості** гарантує, що навіть відповідь, яку не вдалося скасувати, не перезапише свіжу.

## 🧭 План кроків

1. `debounce` з `cancel`, `flush`, `pending`. Теорія: [[JavaScript - 14. Debounce, throttle та async-патерни]].
2. `createCache` — TTL + LRU на `Map`. Теорія: [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]].
3. `searchApi` + `HttpError` — запит через ін'єкований `fetcher`. Теорія: [[JavaScript - 27. Мережа — fetch, CORS і HTTP]].
4. `takeLatest` — скасування і захист від застарілих відповідей. Теорія: [[JavaScript - 09. Promise]], [[JavaScript - 10. async і await]].
5. `highlight` — підсвітка збігів сегментами. Теорія: [[JavaScript - 30. Безпека в JavaScript]].
6. `createSearchController` — склеюємо все в машину станів `idle → loading → success | error`.

## 🧩 Розминка

> [!quiz] Збери debounce з cancel
> level: middle · type: order · id: jsp-03-quiz-01
>
> ```js order
> function debounce(fn, ms) {
>   let timer = null
>   function debounced(...args) {
>     clearTimeout(timer)
>     timer = setTimeout(() => fn.apply(this, args), ms)
>   }
>   debounced.cancel = () => clearTimeout(timer)
>   return debounced
> }
>   timer = setInterval(() => fn.apply(this, args), ms) // ✗
> ```
>
> **Пояснення:** кожен виклик скидає попередній таймер — функція спрацює лише після `ms` тиші. `setInterval` викликав би її знову й знову. `cancel` — це просто `clearTimeout`, але без нього не вийде прибрати відкладений виклик при розмонтуванні компонента.

> [!quiz] Заповни пропуски в takeLatest
> level: senior · type: fill · id: jsp-03-quiz-02 · bank: resolve, finally, then
>
> ```js fill
> function takeLatest(task) {
>   let controller = null
>   async function run(...args) {
>     controller?.[[abort]]()
>     const current = new [[AbortController]]()
>     controller = current
>     let value
>     try {
>       value = await task(current.[[signal]], ...args)
>     } catch (error) {
>       throw current.signal.aborted ? current.signal.reason : error
>     }
>     if (current.signal.[[aborted]]) throw current.signal.reason
>     return value
>   }
>   return run
> }
> ```
>
> **Пояснення:** друга перевірка `aborted` **після** `await` — серце захисту: задача могла проігнорувати сигнал і все одно повернути дані. Якщо за цей час стартував новіший запуск, ці дані застарілі — віддаємо `AbortError` замість них.

## 🛠️ Крок 1. Debounce з cancel і flush

Базовий `debounce` ти вже писав у [[JavaScript Katas - 03. Функції вищого порядку|катах]]. Для реального UI потрібні ще три речі: `cancel()` (прибрати відкладений виклик, коли запит став непотрібним), `flush()` (виконати негайно — наприклад, по Enter) і `pending()` (чи є відкладений виклик).

> [!task] Крок 1 · debounce з cancel, flush, pending
> level: middle · difficulty: medium · id: jsp-03-task-01 · tags: debounce, timers, closures
>
> Напиши `debounce(fn, ms)`:
>
> - викликає `fn` через `ms` мс після **останнього** виклику, з останніми аргументами і `this`;
> - `debounced.cancel()` — скасовує відкладений виклик;
> - `debounced.flush()` — якщо виклик відкладено, виконує його **зараз**; інакше нічого;
> - `debounced.pending()` — `true`, якщо виклик відкладено.
>
> ```js starter
> function debounce(fn, ms) {
>   // твій код
> }
> ```
>
> ```js tests
> test('один виклик після паузи з останніми аргументами', () => {
>   vi.useFakeTimers()
>   const spy = vi.fn()
>   const run = debounce(spy, 100)
>   run('a')
>   vi.advanceTimersByTime(50)
>   run('b')
>   vi.advanceTimersByTime(99)
>   expect(spy).toHaveBeenCalledTimes(0)
>   vi.advanceTimersByTime(1)
>   expect(spy).toHaveBeenCalledTimes(1)
>   expect(spy).toHaveBeenCalledWith('b')
> })
>
> test('cancel прибирає відкладений виклик', () => {
>   vi.useFakeTimers()
>   const spy = vi.fn()
>   const run = debounce(spy, 100)
>   run()
>   run.cancel()
>   vi.advanceTimersByTime(500)
>   expect(spy).toHaveBeenCalledTimes(0)
> })
>
> test('flush виконує негайно і лише раз', () => {
>   vi.useFakeTimers()
>   const spy = vi.fn()
>   const run = debounce(spy, 100)
>   run(1)
>   run.flush()
>   expect(spy).toHaveBeenCalledWith(1)
>   vi.advanceTimersByTime(500)
>   run.flush()
>   expect(spy).toHaveBeenCalledTimes(1)
> })
>
> test('pending показує стан таймера', () => {
>   vi.useFakeTimers()
>   const run = debounce(() => {}, 100)
>   expect(run.pending()).toBe(false)
>   run()
>   expect(run.pending()).toBe(true)
>   vi.advanceTimersByTime(100)
>   expect(run.pending()).toBe(false)
> })
>
> test('зберігає this', () => {
>   vi.useFakeTimers()
>   const box = { value: 42, seen: null, save: debounce(function () { this.seen = this.value }, 10) }
>   box.save()
>   vi.advanceTimersByTime(10)
>   expect(box.seen).toBe(42)
> })
> ```
>
> > [!hint]- Підказка 1
> > Тримай у замиканні `timer`, `lastArgs` і `lastThis`. Виклик лише запам'ятовує їх і перезапускає таймер.
>
> > [!hint]- Підказка 2
> > Винеси «виконати» в окрему функцію `invoke()`: вона обнуляє `timer` і викликає `fn.apply(lastThis, lastArgs)`. Тоді `flush` — це `clearTimeout(timer); invoke()`, якщо `timer !== null`.
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
> >     timer = null
> >     lastArgs = null
> >     lastThis = null
> >     fn.apply(context, args)
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
> >     timer = null
> >     lastArgs = null
> >     lastThis = null
> >   }
> >   debounced.flush = () => {
> >     if (timer === null) return
> >     clearTimeout(timer)
> >     invoke()
> >   }
> >   debounced.pending = () => timer !== null
> >
> >   return debounced
> > }
> > ```
> > **Чому так:** `timer === null` — єдине джерело правди «чи є відкладений виклик», тож `flush` і `pending` не можуть розійтися. Обнулення `lastArgs` / `lastThis` після виклику не тримає в пам'яті великі об'єкти (події, DOM-вузли). `function debounced` замість стрілки — щоб отримати `this` місця виклику.

## 🛠️ Крок 2. Кеш з TTL і LRU

Повертаєшся до запиту, який щойно бачив, — результат має з'явитися миттєво. Але кеш без обмежень — витік пам'яті, а без терміну життя — застарілі дані. `Map` пам'ятає порядок вставки, тож LRU робиться в три рядки: при читанні видали ключ і встав знову — він стане «наймолодшим»; витісняй перший ключ.

> [!task] Крок 2 · createCache
> level: middle · difficulty: medium · id: jsp-03-task-02 · tags: cache, map, lru, ttl
>
> Додай `createCache({ ttl = 60000, max = 50 } = {})`:
>
> - `set(key, value)` — зберігає з поточним часом (`Date.now()`); перезапис оновлює час і «свіжість»;
> - `get(key)` — значення або `undefined`; запис, старший за `ttl` мс (`Date.now() - time >= ttl`), видаляється і дає `undefined`; успішне читання робить запис «наймолодшим»;
> - якщо записів стало більше за `max` — видаляє **найдавніше використаний**;
> - `size` (геттер) і `clear()`.
>
> ```js starter
> function debounce(fn, ms) {
>   let timer = null
>   let lastArgs = null
>   let lastThis = null
>
>   function invoke() {
>     const args = lastArgs
>     const context = lastThis
>     timer = null
>     lastArgs = null
>     lastThis = null
>     fn.apply(context, args)
>   }
>
>   function debounced(...args) {
>     lastArgs = args
>     lastThis = this
>     clearTimeout(timer)
>     timer = setTimeout(invoke, ms)
>   }
>
>   debounced.cancel = () => {
>     clearTimeout(timer)
>     timer = null
>     lastArgs = null
>     lastThis = null
>   }
>   debounced.flush = () => {
>     if (timer === null) return
>     clearTimeout(timer)
>     invoke()
>   }
>   debounced.pending = () => timer !== null
>
>   return debounced
> }
>
> function createCache({ ttl = 60000, max = 50 } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> test('get повертає збережене', () => {
>   const cache = createCache()
>   cache.set('a', [1])
>   expect(cache.get('a')).toEqual([1])
>   expect(cache.get('missing')).toBeUndefined()
> })
>
> test('запис протухає через ttl і видаляється', () => {
>   vi.useFakeTimers()
>   const cache = createCache({ ttl: 1000 })
>   cache.set('a', 1)
>   vi.advanceTimersByTime(999)
>   expect(cache.get('a')).toBe(1)
>   vi.advanceTimersByTime(1)
>   expect(cache.get('a')).toBeUndefined()
>   expect(cache.size).toBe(0)
> })
>
> test('перезапис оновлює час', () => {
>   vi.useFakeTimers()
>   const cache = createCache({ ttl: 1000 })
>   cache.set('a', 1)
>   vi.advanceTimersByTime(800)
>   cache.set('a', 2)
>   vi.advanceTimersByTime(800)
>   expect(cache.get('a')).toBe(2)
> })
>
> test('LRU: витісняється найдавніше використаний', () => {
>   const cache = createCache({ max: 2 })
>   cache.set('a', 1)
>   cache.set('b', 2)
>   cache.get('a')
>   cache.set('c', 3)
>   expect(cache.get('b')).toBeUndefined()
>   expect(cache.get('a')).toBe(1)
>   expect(cache.get('c')).toBe(3)
>   expect(cache.size).toBe(2)
> })
>
> test('clear', () => {
>   const cache = createCache()
>   cache.set('a', 1)
>   cache.clear()
>   expect(cache.size).toBe(0)
> })
> ```
>
> > [!hint]- Підказка 1
> > Зберігай у `Map` об'єкти `{ value, time }`. «Освіжити» запис = `entries.delete(key); entries.set(key, entry)`.
>
> > [!hint]- Підказка 2
> > Найстаріший ключ `Map` — `entries.keys().next().value`.
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
> >     timer = null
> >     lastArgs = null
> >     lastThis = null
> >     fn.apply(context, args)
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
> >     timer = null
> >     lastArgs = null
> >     lastThis = null
> >   }
> >   debounced.flush = () => {
> >     if (timer === null) return
> >     clearTimeout(timer)
> >     invoke()
> >   }
> >   debounced.pending = () => timer !== null
> >
> >   return debounced
> > }
> >
> > function createCache({ ttl = 60000, max = 50 } = {}) {
> >   const entries = new Map()
> >   return {
> >     get(key) {
> >       const entry = entries.get(key)
> >       if (!entry) return undefined
> >       entries.delete(key)
> >       if (Date.now() - entry.time >= ttl) return undefined
> >       entries.set(key, entry)
> >       return entry.value
> >     },
> >     set(key, value) {
> >       entries.delete(key)
> >       entries.set(key, { value, time: Date.now() })
> >       if (entries.size > max) entries.delete(entries.keys().next().value)
> >     },
> >     get size() {
> >       return entries.size
> >     },
> >     clear() {
> >       entries.clear()
> >     },
> >   }
> > }
> > ```
> > **Чому так:** `Map` гарантує порядок вставки, тому перший ключ — завжди найдавніше використаний, і LRU працює за O(1) без власного двозв'язного списку. TTL перевіряється «ліниво» при читанні — не треба таймерів, які треба прибирати. `Date.now()` замість власного годинника робить кеш тестованим фейковими таймерами.

## 🛠️ Крок 3. Запит через ін'єкований fetcher

Функція пошуку не викликає глобальний `fetch` — вона отримує `fetcher` параметром. У браузері це `fetch`, у тестах — підробка з контрольованою затримкою. Нормалізація запиту (`'  React '` і `'react'` — те саме) потрібна і для URL, і для ключа кешу.

> [!task] Крок 3 · normalizeQuery, buildSearchUrl, searchApi
> level: middle · difficulty: medium · id: jsp-03-task-03 · tags: fetch, errors, dependency-injection
>
> Додай:
>
> - `normalizeQuery(query)` — `trim`, послідовні пробіли → один, нижній регістр;
> - `buildSearchUrl(query)` → `'/api/search?q=' + encodeURIComponent(normalizeQuery(query))`;
> - `class HttpError extends Error` з конструктором `(status, url)`: повідомлення `'HTTP <status> для <url>'`, `name = 'HttpError'`, поля `status` і `url`;
> - `async searchApi(fetcher, query, { signal } = {})` — викликає `fetcher(url, { signal })`; відповідь без `ok` → `HttpError`; повертає `items` з `await response.json()`; якщо `items` — не масив → `TypeError('Некоректна відповідь: немає items')`.
>
> ```js starter
> function debounce(fn, ms) {
>   let timer = null
>   let lastArgs = null
>   let lastThis = null
>
>   function invoke() {
>     const args = lastArgs
>     const context = lastThis
>     timer = null
>     lastArgs = null
>     lastThis = null
>     fn.apply(context, args)
>   }
>
>   function debounced(...args) {
>     lastArgs = args
>     lastThis = this
>     clearTimeout(timer)
>     timer = setTimeout(invoke, ms)
>   }
>
>   debounced.cancel = () => {
>     clearTimeout(timer)
>     timer = null
>     lastArgs = null
>     lastThis = null
>   }
>   debounced.flush = () => {
>     if (timer === null) return
>     clearTimeout(timer)
>     invoke()
>   }
>   debounced.pending = () => timer !== null
>
>   return debounced
> }
>
> function createCache({ ttl = 60000, max = 50 } = {}) {
>   const entries = new Map()
>   return {
>     get(key) {
>       const entry = entries.get(key)
>       if (!entry) return undefined
>       entries.delete(key)
>       if (Date.now() - entry.time >= ttl) return undefined
>       entries.set(key, entry)
>       return entry.value
>     },
>     set(key, value) {
>       entries.delete(key)
>       entries.set(key, { value, time: Date.now() })
>       if (entries.size > max) entries.delete(entries.keys().next().value)
>     },
>     get size() {
>       return entries.size
>     },
>     clear() {
>       entries.clear()
>     },
>   }
> }
>
> function normalizeQuery(query) {
>   // твій код
> }
>
> function buildSearchUrl(query) {
>   // твій код
> }
>
> class HttpError extends Error {
>   // твій код
> }
>
> async function searchApi(fetcher, query, { signal } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> const ok = (body) => ({ ok: true, status: 200, json: async () => body })
>
> test('нормалізація запиту', () => {
>   expect(normalizeQuery('   React   Native ')).toBe('react native')
> })
>
> test('URL з екрануванням', () => {
>   expect(buildSearchUrl(' C++ & JS ')).toBe('/api/search?q=c%2B%2B%20%26%20js')
> })
>
> test('передає URL і signal, повертає items', async () => {
>   const fetcher = vi.fn(async () => ok({ items: ['React'] }))
>   const signal = new AbortController().signal
>   await expect(searchApi(fetcher, 'React', { signal })).resolves.toEqual(['React'])
>   expect(fetcher).toHaveBeenCalledWith('/api/search?q=react', { signal })
> })
>
> test('HTTP-помилка — HttpError зі статусом', async () => {
>   const fetcher = async () => ({ ok: false, status: 503, json: async () => ({}) })
>   const error = await searchApi(fetcher, 'x').catch((e) => e)
>   expect(error).toBeInstanceOf(HttpError)
>   expect(error.status).toBe(503)
>   expect(error.message).toBe('HTTP 503 для /api/search?q=x')
> })
>
> test('некоректна відповідь — TypeError', async () => {
>   await expect(searchApi(async () => ok({ results: [] }), 'x')).rejects.toThrow('немає items')
> })
>
> test('помилка мережі пробрасується', async () => {
>   const fetcher = async () => {
>     throw new TypeError('Failed to fetch')
>   }
>   await expect(searchApi(fetcher, 'x')).rejects.toThrow('Failed to fetch')
> })
> ```
>
> > [!hint]- Підказка 1
> > `String(query).trim().replace(/\s+/g, ' ').toLowerCase()`.
>
> > [!hint]- Підказка 2
> > `fetch` не відхиляє проміс на 404/500 — лише на мережеві збої. Тому `if (!response.ok) throw new HttpError(response.status, url)` — обов'язково.
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
> >     timer = null
> >     lastArgs = null
> >     lastThis = null
> >     fn.apply(context, args)
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
> >     timer = null
> >     lastArgs = null
> >     lastThis = null
> >   }
> >   debounced.flush = () => {
> >     if (timer === null) return
> >     clearTimeout(timer)
> >     invoke()
> >   }
> >   debounced.pending = () => timer !== null
> >
> >   return debounced
> > }
> >
> > function createCache({ ttl = 60000, max = 50 } = {}) {
> >   const entries = new Map()
> >   return {
> >     get(key) {
> >       const entry = entries.get(key)
> >       if (!entry) return undefined
> >       entries.delete(key)
> >       if (Date.now() - entry.time >= ttl) return undefined
> >       entries.set(key, entry)
> >       return entry.value
> >     },
> >     set(key, value) {
> >       entries.delete(key)
> >       entries.set(key, { value, time: Date.now() })
> >       if (entries.size > max) entries.delete(entries.keys().next().value)
> >     },
> >     get size() {
> >       return entries.size
> >     },
> >     clear() {
> >       entries.clear()
> >     },
> >   }
> > }
> >
> > function normalizeQuery(query) {
> >   return String(query).trim().replace(/\s+/g, ' ').toLowerCase()
> > }
> >
> > function buildSearchUrl(query) {
> >   return `/api/search?q=${encodeURIComponent(normalizeQuery(query))}`
> > }
> >
> > class HttpError extends Error {
> >   constructor(status, url) {
> >     super(`HTTP ${status} для ${url}`)
> >     this.name = 'HttpError'
> >     this.status = status
> >     this.url = url
> >   }
> > }
> >
> > async function searchApi(fetcher, query, { signal } = {}) {
> >   const url = buildSearchUrl(query)
> >   const response = await fetcher(url, { signal })
> >   if (!response.ok) throw new HttpError(response.status, url)
> >   const data = await response.json()
> >   if (!Array.isArray(data?.items)) throw new TypeError('Некоректна відповідь: немає items')
> >   return data.items
> > }
> > ```
> > **Чому так:** ін'єкція `fetcher` — та сама ідея, що й storage-адаптер у розділі 1: логіка не знає про мережу, тому тестується без неї і переїжде на `axios`, GraphQL чи кешуючий сервіс-воркер. `encodeURIComponent` захищає від `&`, `#`, `+` у запиті (інакше `c++` стане `c  `). Перевірка форми відповіді — сервер теж «зовнішній вхід».

## 🛠️ Крок 4. Скасування і захист від застарілих відповідей

Класичний баг: користувач набрав `rea`, потім `react`. Запит `rea` повільніший і приходить **другим** — на екрані результати для `rea`. `AbortController` скасовує попередній запит, але задача може сигнал проігнорувати (старий API, кеш, синхронний код). Тому після `await` ще раз питаємо: «я досі актуальний?».

> [!task] Крок 4 · takeLatest і isAbortError
> level: senior · difficulty: hard · id: jsp-03-task-04 · tags: abortcontroller, race-conditions, promises
>
> Додай:
>
> - `isAbortError(error)` — `true`, якщо `error?.name === 'AbortError'`;
> - `takeLatest(task)` → `run(...args)`, що повертає проміс:
>   - кожен новий `run` викликає `abort()` у контролера попереднього запуску;
>   - `task` отримує `(signal, ...args)`;
>   - якщо на момент завершення `task` (успіх **або** помилка) сигнал цього запуску скасовано — проміс відхиляється з `signal.reason` (це `AbortError`);
>   - інакше — результат або помилка `task` як є;
> - `run.cancel()` — скасовує поточний запуск.
>
> ```js starter
> function debounce(fn, ms) {
>   let timer = null
>   let lastArgs = null
>   let lastThis = null
>
>   function invoke() {
>     const args = lastArgs
>     const context = lastThis
>     timer = null
>     lastArgs = null
>     lastThis = null
>     fn.apply(context, args)
>   }
>
>   function debounced(...args) {
>     lastArgs = args
>     lastThis = this
>     clearTimeout(timer)
>     timer = setTimeout(invoke, ms)
>   }
>
>   debounced.cancel = () => {
>     clearTimeout(timer)
>     timer = null
>     lastArgs = null
>     lastThis = null
>   }
>   debounced.flush = () => {
>     if (timer === null) return
>     clearTimeout(timer)
>     invoke()
>   }
>   debounced.pending = () => timer !== null
>
>   return debounced
> }
>
> function createCache({ ttl = 60000, max = 50 } = {}) {
>   const entries = new Map()
>   return {
>     get(key) {
>       const entry = entries.get(key)
>       if (!entry) return undefined
>       entries.delete(key)
>       if (Date.now() - entry.time >= ttl) return undefined
>       entries.set(key, entry)
>       return entry.value
>     },
>     set(key, value) {
>       entries.delete(key)
>       entries.set(key, { value, time: Date.now() })
>       if (entries.size > max) entries.delete(entries.keys().next().value)
>     },
>     get size() {
>       return entries.size
>     },
>     clear() {
>       entries.clear()
>     },
>   }
> }
>
> function normalizeQuery(query) {
>   return String(query).trim().replace(/\s+/g, ' ').toLowerCase()
> }
>
> function buildSearchUrl(query) {
>   return `/api/search?q=${encodeURIComponent(normalizeQuery(query))}`
> }
>
> class HttpError extends Error {
>   constructor(status, url) {
>     super(`HTTP ${status} для ${url}`)
>     this.name = 'HttpError'
>     this.status = status
>     this.url = url
>   }
> }
>
> async function searchApi(fetcher, query, { signal } = {}) {
>   const url = buildSearchUrl(query)
>   const response = await fetcher(url, { signal })
>   if (!response.ok) throw new HttpError(response.status, url)
>   const data = await response.json()
>   if (!Array.isArray(data?.items)) throw new TypeError('Некоректна відповідь: немає items')
>   return data.items
> }
>
> function isAbortError(error) {
>   // твій код
> }
>
> function takeLatest(task) {
>   // твій код
> }
> ```
>
> ```js tests
> function deferred() {
>   let resolve
>   let reject
>   const promise = new Promise((res, rej) => {
>     resolve = res
>     reject = rej
>   })
>   return { promise, resolve, reject }
> }
>
> test('передає signal і аргументи, повертає результат', async () => {
>   const run = takeLatest(async (signal, a, b) => {
>     expect(signal.aborted).toBe(false)
>     return a + b
>   })
>   await expect(run(2, 3)).resolves.toBe(5)
> })
>
> test('старий запуск відхиляється, навіть якщо проігнорував signal', async () => {
>   const first = deferred()
>   const second = deferred()
>   const queue = [first, second]
>   const signals = []
>   const run = takeLatest((signal) => {
>     signals.push(signal)
>     return queue.shift().promise
>   })
>   const p1 = run().catch((e) => e)
>   const p2 = run()
>   second.resolve('свіже')
>   first.resolve('застаріле')
>   await expect(p2).resolves.toBe('свіже')
>   const error = await p1
>   expect(isAbortError(error)).toBe(true)
>   expect(signals[0].aborted).toBe(true)
>   expect(signals[1].aborted).toBe(false)
> })
>
> test('помилка актуального запуску пробрасується', async () => {
>   const run = takeLatest(async () => {
>     throw new Error('500')
>   })
>   await expect(run()).rejects.toThrow('500')
> })
>
> test('cancel скасовує поточний запуск', async () => {
>   const d = deferred()
>   const run = takeLatest(() => d.promise)
>   const p = run().catch((e) => e)
>   run.cancel()
>   d.resolve('пізно')
>   const error = await p
>   expect(isAbortError(error)).toBe(true)
> })
>
> test('isAbortError', () => {
>   const controller = new AbortController()
>   controller.abort()
>   expect(isAbortError(controller.signal.reason)).toBe(true)
>   expect(isAbortError(new Error('x'))).toBe(false)
>   expect(isAbortError(null)).toBe(false)
> })
> ```
>
> > [!hint]- Підказка 1
> > У замиканні — `controller` останнього запуску. На початку `run`: `controller?.abort()`, потім створи **новий** і збережи в локальну `current`.
>
> > [!hint]- Підказка 2
> > Після `await task(current.signal, ...args)` перевір `current.signal.aborted` — саме `current`, а не `controller`: останній уже може вказувати на новіший запуск.
>
> > [!hint]- Підказка 3
> > `controller.abort()` без аргументу кладе в `signal.reason` `DOMException` з `name === 'AbortError'` — просто кидай його.
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
> >     timer = null
> >     lastArgs = null
> >     lastThis = null
> >     fn.apply(context, args)
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
> >     timer = null
> >     lastArgs = null
> >     lastThis = null
> >   }
> >   debounced.flush = () => {
> >     if (timer === null) return
> >     clearTimeout(timer)
> >     invoke()
> >   }
> >   debounced.pending = () => timer !== null
> >
> >   return debounced
> > }
> >
> > function createCache({ ttl = 60000, max = 50 } = {}) {
> >   const entries = new Map()
> >   return {
> >     get(key) {
> >       const entry = entries.get(key)
> >       if (!entry) return undefined
> >       entries.delete(key)
> >       if (Date.now() - entry.time >= ttl) return undefined
> >       entries.set(key, entry)
> >       return entry.value
> >     },
> >     set(key, value) {
> >       entries.delete(key)
> >       entries.set(key, { value, time: Date.now() })
> >       if (entries.size > max) entries.delete(entries.keys().next().value)
> >     },
> >     get size() {
> >       return entries.size
> >     },
> >     clear() {
> >       entries.clear()
> >     },
> >   }
> > }
> >
> > function normalizeQuery(query) {
> >   return String(query).trim().replace(/\s+/g, ' ').toLowerCase()
> > }
> >
> > function buildSearchUrl(query) {
> >   return `/api/search?q=${encodeURIComponent(normalizeQuery(query))}`
> > }
> >
> > class HttpError extends Error {
> >   constructor(status, url) {
> >     super(`HTTP ${status} для ${url}`)
> >     this.name = 'HttpError'
> >     this.status = status
> >     this.url = url
> >   }
> > }
> >
> > async function searchApi(fetcher, query, { signal } = {}) {
> >   const url = buildSearchUrl(query)
> >   const response = await fetcher(url, { signal })
> >   if (!response.ok) throw new HttpError(response.status, url)
> >   const data = await response.json()
> >   if (!Array.isArray(data?.items)) throw new TypeError('Некоректна відповідь: немає items')
> >   return data.items
> > }
> >
> > function isAbortError(error) {
> >   return error?.name === 'AbortError'
> > }
> >
> > function takeLatest(task) {
> >   let controller = null
> >
> >   async function run(...args) {
> >     controller?.abort()
> >     const current = new AbortController()
> >     controller = current
> >     let value
> >     try {
> >       value = await task(current.signal, ...args)
> >     } catch (error) {
> >       throw current.signal.aborted ? current.signal.reason : error
> >     }
> >     if (current.signal.aborted) throw current.signal.reason
> >     return value
> >   }
> >
> >   run.cancel = () => {
> >     controller?.abort()
> >     controller = null
> >   }
> >
> >   return run
> > }
> > ```
> > **Чому так:** `abort()` — це **прохання** звільнити ресурси, а не гарантія: задача може його проігнорувати. Гарантію дає перевірка після `await` — кожен запуск пам'ятає *свій* контролер у локальній змінній, тож перевіряє власну актуальність. Відхилення з `AbortError` (а не «вічний» pending-проміс) не тримає замикань у пам'яті й дає викликачу легко відрізнити скасування від справжньої помилки через `isAbortError`.

## 🛠️ Крок 5. Підсвітка збігів без innerHTML

Спокуса: `item.replace(query, '<mark>$&</mark>')` і `innerHTML`. Але якщо в назві товару чи запиті є `<img src=x onerror=…>` — це XSS. Безпечний шлях — повернути **сегменти** `{ text, match }`, а UI сам створить `<mark>` і заповнить `textContent`.

> [!task] Крок 5 · highlight
> level: middle · difficulty: medium · id: jsp-03-task-05 · tags: regexp, security, strings
>
> Додай:
>
> - `escapeRegExp(text)` — екранує спецсимволи регулярних виразів;
> - `highlight(text, query)` → масив сегментів `{ text, match }`, що разом дають вихідний `text`:
>   - пошук без урахування регістру, текст збігу — **як в оригіналі**;
>   - усі входження; спецсимволи в запиті — звичайні символи;
>   - запит з пробілів або порожній → `[{ text, match: false }]` (для порожнього `text` — `[]`).
>
> ```js starter
> function debounce(fn, ms) {
>   let timer = null
>   let lastArgs = null
>   let lastThis = null
>
>   function invoke() {
>     const args = lastArgs
>     const context = lastThis
>     timer = null
>     lastArgs = null
>     lastThis = null
>     fn.apply(context, args)
>   }
>
>   function debounced(...args) {
>     lastArgs = args
>     lastThis = this
>     clearTimeout(timer)
>     timer = setTimeout(invoke, ms)
>   }
>
>   debounced.cancel = () => {
>     clearTimeout(timer)
>     timer = null
>     lastArgs = null
>     lastThis = null
>   }
>   debounced.flush = () => {
>     if (timer === null) return
>     clearTimeout(timer)
>     invoke()
>   }
>   debounced.pending = () => timer !== null
>
>   return debounced
> }
>
> function createCache({ ttl = 60000, max = 50 } = {}) {
>   const entries = new Map()
>   return {
>     get(key) {
>       const entry = entries.get(key)
>       if (!entry) return undefined
>       entries.delete(key)
>       if (Date.now() - entry.time >= ttl) return undefined
>       entries.set(key, entry)
>       return entry.value
>     },
>     set(key, value) {
>       entries.delete(key)
>       entries.set(key, { value, time: Date.now() })
>       if (entries.size > max) entries.delete(entries.keys().next().value)
>     },
>     get size() {
>       return entries.size
>     },
>     clear() {
>       entries.clear()
>     },
>   }
> }
>
> function normalizeQuery(query) {
>   return String(query).trim().replace(/\s+/g, ' ').toLowerCase()
> }
>
> function buildSearchUrl(query) {
>   return `/api/search?q=${encodeURIComponent(normalizeQuery(query))}`
> }
>
> class HttpError extends Error {
>   constructor(status, url) {
>     super(`HTTP ${status} для ${url}`)
>     this.name = 'HttpError'
>     this.status = status
>     this.url = url
>   }
> }
>
> async function searchApi(fetcher, query, { signal } = {}) {
>   const url = buildSearchUrl(query)
>   const response = await fetcher(url, { signal })
>   if (!response.ok) throw new HttpError(response.status, url)
>   const data = await response.json()
>   if (!Array.isArray(data?.items)) throw new TypeError('Некоректна відповідь: немає items')
>   return data.items
> }
>
> function isAbortError(error) {
>   return error?.name === 'AbortError'
> }
>
> function takeLatest(task) {
>   let controller = null
>
>   async function run(...args) {
>     controller?.abort()
>     const current = new AbortController()
>     controller = current
>     let value
>     try {
>       value = await task(current.signal, ...args)
>     } catch (error) {
>       throw current.signal.aborted ? current.signal.reason : error
>     }
>     if (current.signal.aborted) throw current.signal.reason
>     return value
>   }
>
>   run.cancel = () => {
>     controller?.abort()
>     controller = null
>   }
>
>   return run
> }
>
> function escapeRegExp(text) {
>   // твій код
> }
>
> function highlight(text, query) {
>   // твій код
> }
> ```
>
> ```js tests
> test('підсвічує збіг, зберігаючи регістр оригіналу', () => {
>   expect(highlight('React Native', 'react')).toEqual([
>     { text: 'React', match: true },
>     { text: ' Native', match: false },
>   ])
> })
>
> test('усі входження', () => {
>   expect(highlight('banana', 'an')).toEqual([
>     { text: 'b', match: false },
>     { text: 'an', match: true },
>     { text: 'an', match: true },
>     { text: 'a', match: false },
>   ])
> })
>
> test('спецсимволи регулярок — звичайні символи', () => {
>   expect(highlight('C++ і C#', 'c++')).toEqual([
>     { text: 'C++', match: true },
>     { text: ' і C#', match: false },
>   ])
>   expect(highlight('a.b', '.').map((s) => s.match)).toEqual([false, true, false])
> })
>
> test('кирилиця без урахування регістру', () => {
>   expect(highlight('Київ', 'КИЇВ')).toEqual([{ text: 'Київ', match: true }])
> })
>
> test('порожній запит і порожній текст', () => {
>   expect(highlight('React', '   ')).toEqual([{ text: 'React', match: false }])
>   expect(highlight('', 'a')).toEqual([])
>   expect(highlight('', '')).toEqual([])
> })
> ```
>
> > [!hint]- Підказка 1
> > `text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` — класичне екранування з MDN.
>
> > [!hint]- Підказка 2
> > `new RegExp(escapeRegExp(q), 'giu')` і цикл `for (const m of text.matchAll(re))`: шматок між попереднім кінцем і `m.index` — не збіг, `m[0]` — збіг.
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
> >     timer = null
> >     lastArgs = null
> >     lastThis = null
> >     fn.apply(context, args)
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
> >     timer = null
> >     lastArgs = null
> >     lastThis = null
> >   }
> >   debounced.flush = () => {
> >     if (timer === null) return
> >     clearTimeout(timer)
> >     invoke()
> >   }
> >   debounced.pending = () => timer !== null
> >
> >   return debounced
> > }
> >
> > function createCache({ ttl = 60000, max = 50 } = {}) {
> >   const entries = new Map()
> >   return {
> >     get(key) {
> >       const entry = entries.get(key)
> >       if (!entry) return undefined
> >       entries.delete(key)
> >       if (Date.now() - entry.time >= ttl) return undefined
> >       entries.set(key, entry)
> >       return entry.value
> >     },
> >     set(key, value) {
> >       entries.delete(key)
> >       entries.set(key, { value, time: Date.now() })
> >       if (entries.size > max) entries.delete(entries.keys().next().value)
> >     },
> >     get size() {
> >       return entries.size
> >     },
> >     clear() {
> >       entries.clear()
> >     },
> >   }
> > }
> >
> > function normalizeQuery(query) {
> >   return String(query).trim().replace(/\s+/g, ' ').toLowerCase()
> > }
> >
> > function buildSearchUrl(query) {
> >   return `/api/search?q=${encodeURIComponent(normalizeQuery(query))}`
> > }
> >
> > class HttpError extends Error {
> >   constructor(status, url) {
> >     super(`HTTP ${status} для ${url}`)
> >     this.name = 'HttpError'
> >     this.status = status
> >     this.url = url
> >   }
> > }
> >
> > async function searchApi(fetcher, query, { signal } = {}) {
> >   const url = buildSearchUrl(query)
> >   const response = await fetcher(url, { signal })
> >   if (!response.ok) throw new HttpError(response.status, url)
> >   const data = await response.json()
> >   if (!Array.isArray(data?.items)) throw new TypeError('Некоректна відповідь: немає items')
> >   return data.items
> > }
> >
> > function isAbortError(error) {
> >   return error?.name === 'AbortError'
> > }
> >
> > function takeLatest(task) {
> >   let controller = null
> >
> >   async function run(...args) {
> >     controller?.abort()
> >     const current = new AbortController()
> >     controller = current
> >     let value
> >     try {
> >       value = await task(current.signal, ...args)
> >     } catch (error) {
> >       throw current.signal.aborted ? current.signal.reason : error
> >     }
> >     if (current.signal.aborted) throw current.signal.reason
> >     return value
> >   }
> >
> >   run.cancel = () => {
> >     controller?.abort()
> >     controller = null
> >   }
> >
> >   return run
> > }
> >
> > function escapeRegExp(text) {
> >   return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
> > }
> >
> > function highlight(text, query) {
> >   const q = String(query).trim()
> >   if (q === '') return text ? [{ text, match: false }] : []
> >   const re = new RegExp(escapeRegExp(q), 'giu')
> >   const segments = []
> >   let last = 0
> >   for (const m of text.matchAll(re)) {
> >     if (m.index > last) segments.push({ text: text.slice(last, m.index), match: false })
> >     segments.push({ text: m[0], match: true })
> >     last = m.index + m[0].length
> >   }
> >   if (last < text.length) segments.push({ text: text.slice(last), match: false })
> >   return segments
> > }
> > ```
> > **Чому так:** функція повертає **дані**, а не HTML, тому XSS неможливий за конструкцією: UI вставляє кожен сегмент через `textContent`. Екранування запиту обов'язкове — інакше `c++` кине `SyntaxError: Nothing to repeat`, а `.` підсвітить усе. Прапорець `u` коректно працює з емодзі та символами поза BMP.

## 🛠️ Крок 6. Контролер пошуку

Час склеїти: стан `{ query, status, results, error }`, підписники, кеш, debounce і `takeLatest`. Контролер не знає про DOM — UI лише викликає `setQuery` на кожне `input` і малює стан з `subscribe`.

> [!task] Крок 6 · createSearchController
> level: senior · difficulty: hard · id: jsp-03-task-06 · tags: state-machine, async, integration
>
> Додай `createSearchController({ fetcher, delay = 300, minLength = 2, cache = createCache() })`:
>
> - стан `{ query, status: 'idle' | 'loading' | 'success' | 'error', results, error }`, початково `{ query: '', status: 'idle', results: [], error: null }`; `getState()` і `subscribe(fn)` → відписка (кожна зміна стану — виклик `fn(state)`);
> - `setQuery(query)`:
>   - нормалізований запит коротший за `minLength` → скасувати відкладений і поточний пошук, стан `idle` з порожніми `results`;
>   - є в кеші (ключ — `normalizeQuery`) → скасувати відкладений і поточний пошук, одразу `success` з кешованими `results`, **без** запиту;
>   - інакше оновити `query` і запустити пошук через `debounce(…, delay)`;
> - пошук: `status: 'loading'` → `searchApi` через `takeLatest` → `success` (+ запис у кеш) або `error` (з порожніми `results`); `AbortError` **ігнорується**;
> - `flush()` — запустити відкладений пошук негайно (Enter); `dispose()` — скасувати все.
>
> ```js starter
> function debounce(fn, ms) {
>   let timer = null
>   let lastArgs = null
>   let lastThis = null
>
>   function invoke() {
>     const args = lastArgs
>     const context = lastThis
>     timer = null
>     lastArgs = null
>     lastThis = null
>     fn.apply(context, args)
>   }
>
>   function debounced(...args) {
>     lastArgs = args
>     lastThis = this
>     clearTimeout(timer)
>     timer = setTimeout(invoke, ms)
>   }
>
>   debounced.cancel = () => {
>     clearTimeout(timer)
>     timer = null
>     lastArgs = null
>     lastThis = null
>   }
>   debounced.flush = () => {
>     if (timer === null) return
>     clearTimeout(timer)
>     invoke()
>   }
>   debounced.pending = () => timer !== null
>
>   return debounced
> }
>
> function createCache({ ttl = 60000, max = 50 } = {}) {
>   const entries = new Map()
>   return {
>     get(key) {
>       const entry = entries.get(key)
>       if (!entry) return undefined
>       entries.delete(key)
>       if (Date.now() - entry.time >= ttl) return undefined
>       entries.set(key, entry)
>       return entry.value
>     },
>     set(key, value) {
>       entries.delete(key)
>       entries.set(key, { value, time: Date.now() })
>       if (entries.size > max) entries.delete(entries.keys().next().value)
>     },
>     get size() {
>       return entries.size
>     },
>     clear() {
>       entries.clear()
>     },
>   }
> }
>
> function normalizeQuery(query) {
>   return String(query).trim().replace(/\s+/g, ' ').toLowerCase()
> }
>
> function buildSearchUrl(query) {
>   return `/api/search?q=${encodeURIComponent(normalizeQuery(query))}`
> }
>
> class HttpError extends Error {
>   constructor(status, url) {
>     super(`HTTP ${status} для ${url}`)
>     this.name = 'HttpError'
>     this.status = status
>     this.url = url
>   }
> }
>
> async function searchApi(fetcher, query, { signal } = {}) {
>   const url = buildSearchUrl(query)
>   const response = await fetcher(url, { signal })
>   if (!response.ok) throw new HttpError(response.status, url)
>   const data = await response.json()
>   if (!Array.isArray(data?.items)) throw new TypeError('Некоректна відповідь: немає items')
>   return data.items
> }
>
> function isAbortError(error) {
>   return error?.name === 'AbortError'
> }
>
> function takeLatest(task) {
>   let controller = null
>
>   async function run(...args) {
>     controller?.abort()
>     const current = new AbortController()
>     controller = current
>     let value
>     try {
>       value = await task(current.signal, ...args)
>     } catch (error) {
>       throw current.signal.aborted ? current.signal.reason : error
>     }
>     if (current.signal.aborted) throw current.signal.reason
>     return value
>   }
>
>   run.cancel = () => {
>     controller?.abort()
>     controller = null
>   }
>
>   return run
> }
>
> function escapeRegExp(text) {
>   return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
> }
>
> function highlight(text, query) {
>   const q = String(query).trim()
>   if (q === '') return text ? [{ text, match: false }] : []
>   const re = new RegExp(escapeRegExp(q), 'giu')
>   const segments = []
>   let last = 0
>   for (const m of text.matchAll(re)) {
>     if (m.index > last) segments.push({ text: text.slice(last, m.index), match: false })
>     segments.push({ text: m[0], match: true })
>     last = m.index + m[0].length
>   }
>   if (last < text.length) segments.push({ text: text.slice(last), match: false })
>   return segments
> }
>
> function createSearchController({ fetcher, delay = 300, minLength = 2, cache = createCache() }) {
>   // твій код
> }
> ```
>
> ```js tests
> const flush = () => sleep(0)
>
> function fakeFetch(responses, { latency = 100, ignoreAbort = false } = {}) {
>   return vi.fn((url, { signal } = {}) => new Promise((resolve, reject) => {
>     const q = decodeURIComponent(url.split('q=')[1])
>     const ms = typeof latency === 'function' ? latency(q) : latency
>     const timer = setTimeout(() => {
>       if (Object.hasOwn(responses, q)) resolve({ ok: true, status: 200, json: async () => ({ items: responses[q] }) })
>       else resolve({ ok: false, status: 500, json: async () => ({}) })
>     }, ms)
>     if (!ignoreAbort) signal?.addEventListener('abort', () => {
>       clearTimeout(timer)
>       reject(signal.reason)
>     })
>   }))
> }
>
> test('debounce: один запит після паузи, loading → success', async () => {
>   vi.useFakeTimers()
>   const fetcher = fakeFetch({ react: ['React', 'React Native'] })
>   const search = createSearchController({ fetcher, delay: 300 })
>   search.setQuery('re')
>   vi.advanceTimersByTime(100)
>   search.setQuery('rea')
>   vi.advanceTimersByTime(100)
>   search.setQuery('react')
>   vi.advanceTimersByTime(299)
>   expect(fetcher).toHaveBeenCalledTimes(0)
>   vi.advanceTimersByTime(1)
>   expect(fetcher).toHaveBeenCalledTimes(1)
>   expect(search.getState().status).toBe('loading')
>   vi.advanceTimersByTime(100)
>   await flush()
>   expect(search.getState()).toEqual({ query: 'react', status: 'success', results: ['React', 'React Native'], error: null })
> })
>
> test('повільна застаріла відповідь не перезаписує свіжу', async () => {
>   vi.useFakeTimers()
>   const fetcher = fakeFetch({ slow: ['старе'], fast: ['нове'] }, { latency: (q) => (q === 'slow' ? 500 : 50), ignoreAbort: true })
>   const search = createSearchController({ fetcher, delay: 300 })
>   search.setQuery('slow')
>   vi.advanceTimersByTime(300)
>   search.setQuery('fast')
>   vi.advanceTimersByTime(300)
>   expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true)
>   vi.advanceTimersByTime(50)
>   await flush()
>   expect(search.getState().results).toEqual(['нове'])
>   vi.advanceTimersByTime(500)
>   await flush()
>   expect(search.getState().results).toEqual(['нове'])
>   expect(search.getState().status).toBe('success')
> })
>
> test('короткий запит — idle і скасування запиту в польоті', async () => {
>   vi.useFakeTimers()
>   const fetcher = fakeFetch({ react: ['React'] })
>   const search = createSearchController({ fetcher, delay: 300 })
>   search.setQuery('react')
>   vi.advanceTimersByTime(300)
>   search.setQuery('r')
>   expect(search.getState()).toEqual({ query: 'r', status: 'idle', results: [], error: null })
>   vi.advanceTimersByTime(1000)
>   await flush()
>   expect(search.getState().status).toBe('idle')
>   expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true)
> })
>
> test('кеш: повторний запит одразу і без мережі', async () => {
>   vi.useFakeTimers()
>   const fetcher = fakeFetch({ react: ['React'] })
>   const search = createSearchController({ fetcher, delay: 300 })
>   search.setQuery('react')
>   vi.advanceTimersByTime(400)
>   await flush()
>   search.setQuery('vue')
>   search.setQuery('  React ')
>   expect(search.getState()).toEqual({ query: '  React ', status: 'success', results: ['React'], error: null })
>   vi.advanceTimersByTime(1000)
>   await flush()
>   expect(fetcher).toHaveBeenCalledTimes(1)
> })
>
> test('помилка сервера — status error з HttpError', async () => {
>   vi.useFakeTimers()
>   const search = createSearchController({ fetcher: fakeFetch({}), delay: 300 })
>   search.setQuery('nothing')
>   vi.advanceTimersByTime(400)
>   await flush()
>   const state = search.getState()
>   expect(state.status).toBe('error')
>   expect(state.error).toBeInstanceOf(HttpError)
>   expect(state.results).toEqual([])
> })
>
> test('flush (Enter) шукає одразу, subscribe бачить зміни', async () => {
>   vi.useFakeTimers()
>   const fetcher = fakeFetch({ react: ['React'] })
>   const search = createSearchController({ fetcher, delay: 300 })
>   const statuses = []
>   const unsubscribe = search.subscribe((state) => statuses.push(state.status))
>   search.setQuery('react')
>   search.flush()
>   expect(fetcher).toHaveBeenCalledTimes(1)
>   vi.advanceTimersByTime(100)
>   await flush()
>   unsubscribe()
>   search.setQuery('x')
>   expect(statuses).toEqual(['idle', 'loading', 'success'])
> })
> ```
>
> > [!hint]- Підказка 1
> > `setState(patch)`: `state = { ...state, ...patch }` і сповістити копію слухачів. `search = takeLatest((signal, q) => searchApi(fetcher, q, { signal }))`, `debounced = debounce(run, delay)`.
>
> > [!hint]- Підказка 2
> > `run(query)` — `async`: `setState({ status: 'loading', error: null })`, `try { const results = await search(query); cache.set(...); setState(success) } catch (e) { if (isAbortError(e)) return; setState(error) }`.
>
> > [!hint]- Підказка 3
> > У `setQuery` перевірки йдуть у порядку: короткий запит → кеш → debounce. Перші дві гілки викликають `debounced.cancel()` і `search.cancel()`.
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
> >     timer = null
> >     lastArgs = null
> >     lastThis = null
> >     fn.apply(context, args)
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
> >     timer = null
> >     lastArgs = null
> >     lastThis = null
> >   }
> >   debounced.flush = () => {
> >     if (timer === null) return
> >     clearTimeout(timer)
> >     invoke()
> >   }
> >   debounced.pending = () => timer !== null
> >
> >   return debounced
> > }
> >
> > function createCache({ ttl = 60000, max = 50 } = {}) {
> >   const entries = new Map()
> >   return {
> >     get(key) {
> >       const entry = entries.get(key)
> >       if (!entry) return undefined
> >       entries.delete(key)
> >       if (Date.now() - entry.time >= ttl) return undefined
> >       entries.set(key, entry)
> >       return entry.value
> >     },
> >     set(key, value) {
> >       entries.delete(key)
> >       entries.set(key, { value, time: Date.now() })
> >       if (entries.size > max) entries.delete(entries.keys().next().value)
> >     },
> >     get size() {
> >       return entries.size
> >     },
> >     clear() {
> >       entries.clear()
> >     },
> >   }
> > }
> >
> > function normalizeQuery(query) {
> >   return String(query).trim().replace(/\s+/g, ' ').toLowerCase()
> > }
> >
> > function buildSearchUrl(query) {
> >   return `/api/search?q=${encodeURIComponent(normalizeQuery(query))}`
> > }
> >
> > class HttpError extends Error {
> >   constructor(status, url) {
> >     super(`HTTP ${status} для ${url}`)
> >     this.name = 'HttpError'
> >     this.status = status
> >     this.url = url
> >   }
> > }
> >
> > async function searchApi(fetcher, query, { signal } = {}) {
> >   const url = buildSearchUrl(query)
> >   const response = await fetcher(url, { signal })
> >   if (!response.ok) throw new HttpError(response.status, url)
> >   const data = await response.json()
> >   if (!Array.isArray(data?.items)) throw new TypeError('Некоректна відповідь: немає items')
> >   return data.items
> > }
> >
> > function isAbortError(error) {
> >   return error?.name === 'AbortError'
> > }
> >
> > function takeLatest(task) {
> >   let controller = null
> >
> >   async function run(...args) {
> >     controller?.abort()
> >     const current = new AbortController()
> >     controller = current
> >     let value
> >     try {
> >       value = await task(current.signal, ...args)
> >     } catch (error) {
> >       throw current.signal.aborted ? current.signal.reason : error
> >     }
> >     if (current.signal.aborted) throw current.signal.reason
> >     return value
> >   }
> >
> >   run.cancel = () => {
> >     controller?.abort()
> >     controller = null
> >   }
> >
> >   return run
> > }
> >
> > function escapeRegExp(text) {
> >   return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
> > }
> >
> > function highlight(text, query) {
> >   const q = String(query).trim()
> >   if (q === '') return text ? [{ text, match: false }] : []
> >   const re = new RegExp(escapeRegExp(q), 'giu')
> >   const segments = []
> >   let last = 0
> >   for (const m of text.matchAll(re)) {
> >     if (m.index > last) segments.push({ text: text.slice(last, m.index), match: false })
> >     segments.push({ text: m[0], match: true })
> >     last = m.index + m[0].length
> >   }
> >   if (last < text.length) segments.push({ text: text.slice(last), match: false })
> >   return segments
> > }
> >
> > function createSearchController({ fetcher, delay = 300, minLength = 2, cache = createCache() }) {
> >   let state = { query: '', status: 'idle', results: [], error: null }
> >   const listeners = new Set()
> >   const search = takeLatest((signal, query) => searchApi(fetcher, query, { signal }))
> >
> >   function setState(patch) {
> >     state = { ...state, ...patch }
> >     for (const listener of [...listeners]) listener(state)
> >   }
> >
> >   async function run(query) {
> >     setState({ status: 'loading', error: null })
> >     try {
> >       const results = await search(query)
> >       cache.set(normalizeQuery(query), results)
> >       setState({ status: 'success', results, error: null })
> >     } catch (error) {
> >       if (isAbortError(error)) return
> >       setState({ status: 'error', results: [], error })
> >     }
> >   }
> >
> >   const debouncedRun = debounce(run, delay)
> >
> >   function stop() {
> >     debouncedRun.cancel()
> >     search.cancel()
> >   }
> >
> >   return {
> >     getState: () => state,
> >     subscribe(listener) {
> >       listeners.add(listener)
> >       return () => listeners.delete(listener)
> >     },
> >     setQuery(query) {
> >       const key = normalizeQuery(query)
> >       if (key.length < minLength) {
> >         stop()
> >         setState({ query, status: 'idle', results: [], error: null })
> >         return
> >       }
> >       const cached = cache.get(key)
> >       if (cached !== undefined) {
> >         stop()
> >         setState({ query, status: 'success', results: cached, error: null })
> >         return
> >       }
> >       setState({ query })
> >       debouncedRun(query)
> >     },
> >     flush: () => debouncedRun.flush(),
> >     dispose() {
> >       stop()
> >       listeners.clear()
> >     },
> >   }
> > }
> > ```
> > **Чому так:** контролер — маленька **машина станів**, і кожна гілка `setQuery` явно каже, що відбувається з відкладеним і поточним запитом. Кеш перевіряється *до* debounce — повернення до бачених результатів миттєве. `AbortError` мовчки ігноруємо: скасування — це нормальний перебіг, а не помилка для користувача. Під час `loading` старі `results` лишаються на екрані — список не «блимає» порожнечею на кожну літеру.

## 🎤 На співбесіді

> [!interview] Як би ти масштабував цей пошук, якщо ним одночасно користуються 100 000 людей?
> level: senior · frequency: часто · id: jsp-03-int-01
>
> ---
>
> **Клієнт** уже зменшує навантаження: debounce (запит на паузу, а не на літеру), `minLength`, кеш і `abort` (сервер може перестати рахувати скасований запит). Далі — **HTTP-кеш**: нормалізований URL робить відповіді кешованими на CDN; популярні запити (`react`, `iphone`) віддаються з краю мережі з `Cache-Control: max-age=60, stale-while-revalidate`. **Сервер**: пошуковий індекс (Elasticsearch / OpenSearch / Typesense) замість `LIKE '%q%'`, префіксні індекси для автопідказок, коалесинг однакових запитів у польоті. **Захист**: rate limit по користувачу/IP з `429 + Retry-After`, а клієнт поважає `Retry-After`. **Деградація**: якщо пошук повільний — показуємо кешовані/популярні підказки, а не спінер. Метрики: p95 латентності від натискання до показу, частка скасованих запитів, hit rate кешу.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] · [MDN: 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429) · [TanStack Query: Query Cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation)

> [!interview] Як би ти перевикористав цей контролер у React-застосунку з десятком різних пошуків?
> level: senior · frequency: іноді · id: jsp-03-int-02
>
> ---
>
> Контролер не знає про DOM, тож у React він живе в кастомному хуку: створюємо в `useRef`/`useState(() => createSearchController(...))`, підписуємось через `useSyncExternalStore(search.subscribe, search.getState)` і в cleanup ефекту викликаємо `dispose()` — без цього відкладений таймер чи запит оновлять розмонтований компонент. `fetcher` і `cache` передаємо через контекст, щоб кеш був **спільний** для всіх пошуків і переживав навігацію. Для десятків різних ресурсів я б не писав власний велосипед, а взяв TanStack Query: ключ запиту = нормалізований query, дедуплікація, `signal` для скасування, `staleTime` = наш TTL, `keepPreviousData` = наша поведінка «не блимати». Але розуміння, як це влаштовано всередині, і є те, що перевіряють на співбесіді.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни]] · [TanStack Query: Query Cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation) · [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

## 🧠 Закріплення

> [!question]- Навіщо перевіряти «застарілість» після `await`, якщо вже є `AbortController`?
> *дуже часто · дизайн* · `jsp-03-001`
>
> `abort()` лише просить задачу зупинитись. Код може проігнорувати `signal` (старий API, кеш, синхронна частина, бібліотека без підтримки), і проміс все одно виконається з даними. Перевірка «чи мій контролер досі актуальний» після `await` гарантує, що застаріла відповідь не потрапить у стан, навіть якщо скасування не спрацювало.
>
> 📚 [[JavaScript - 10. async і await]] · [MDN: AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

> [!question]- Чому для пошуку debounce, а не throttle?
> *часто · порівняння* · `jsp-03-002`
>
> Нас цікавить запит, коли користувач **закінчив** друкувати, — це debounce (чекати тиші). Throttle слав би запити кожні N мс посеред набору: більше навантаження і результати для недописаних слів. Throttle доречний для скролу, resize, drag — потоків, де важливі проміжні значення.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни]] · [MDN: Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce)

> [!question]- Навіщо нормалізувати запит перед кешем і URL?
> *часто · дизайн* · `jsp-03-003`
>
> `'React'`, `' react '` і `'REACT'` — для користувача той самий пошук. Без нормалізації це три різні ключі кешу і три запити до сервера; з нею — один ключ, вищий hit rate, і CDN теж кешує однаковий URL. `encodeURIComponent` після нормалізації захищає від спецсимволів у URL.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] · [MDN: encodeURIComponent()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)

> [!question]- Як `Map` дає LRU-кеш без власного списку?
> *часто · код* · `jsp-03-004`
>
> `Map` ітерує ключі в порядку вставки. При читанні видаляємо і вставляємо запис знову — він переїжджає в кінець. Тоді перший ключ (`map.keys().next().value`) — найдавніше використаний, і витіснення — O(1). TTL перевіряємо ліниво при читанні, без таймерів.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] · [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

> [!question]- Чому `highlight` повертає сегменти, а не рядок з `<mark>`?
> *дуже часто · безпека* · `jsp-03-005`
>
> Рядок з HTML довелося б вставити через `innerHTML` — і назва товару чи запит з `<img onerror=…>` виконали б чужий код (XSS). Сегменти — це дані: UI створює `<mark>` і ставить текст через `textContent`, який ніколи не інтерпретується як HTML. Безпека за конструкцією, а не за пильністю.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript]] · [MDN: Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

> [!question]- Чому `fetch` передається в контролер параметром?
> *часто · дизайн* · `jsp-03-006`
>
> Dependency injection: у тестах — підробка з контрольованою затримкою і порядком відповідей (так ми відтворюємо гонку детерміновано), у продакшні — `fetch`, завтра — клієнт з ретраями з розділу 8. Логіка пошуку не прив'язана ні до мережі, ні до браузера.
>
> 📚 [[JavaScript - 33. Тестування JavaScript]] · [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

## ⚡ Фішки

> [!reel] 🚦 fetch не падає на 404 і 500
> Проміс `fetch` відхиляється лише при мережевому збої або `abort`. HTTP 500 — це «успішна» відповідь з `ok: false`. Перевіряй `response.ok` завжди.
>
> ```js
> const res = await fetch('/nope')
> res.ok     // → false
> res.status // → 404
> ```

> [!reel] ✂️ Один AbortController — багато запитів
> `signal` можна передати в кілька `fetch`, `addEventListener` і власних функцій. Один `abort()` — і все скасовано: зручно при розмонтуванні компонента.

> [!reel] ⏱️ AbortSignal.timeout(ms)
> Таймаут без власного таймера: сигнал сам скасується через `ms` мс з `TimeoutError`.
>
> ```js
> await fetch(url, { signal: AbortSignal.timeout(5000) })
> ```

## 🖥️ Зібрати в браузері

Збережи як `search.html`. Сервер імітує фейковий `fetcher` з **випадковою** затримкою 50–900 мс — саме такі умови ламають наївний пошук. Увімкни в DevTools → Console лог і подивись, як старі запити скасовуються. Наприкінці скрипта — закоментований адаптер до справжнього API GitHub.

```html
<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>Пошук</title>
  <style>
    body { font: 16px system-ui, sans-serif; max-width: 520px; margin: 40px auto; }
    input { width: 100%; font-size: 18px; padding: 8px; box-sizing: border-box; }
    mark { background: #ffe082; }
    #status { color: #666; min-height: 1.5em; }
    .error { color: #c62828; }
  </style>
</head>
<body>
  <h1>🔎 Пошук мов і бібліотек</h1>
  <input id="q" placeholder="react, vue, script…" autocomplete="off" autofocus role="combobox" aria-controls="results" aria-expanded="false" />
  <p id="status" aria-live="polite"></p>
  <ul id="results" role="listbox"></ul>
  <script>
function debounce(fn, ms) {
  let timer = null
  let lastArgs = null
  let lastThis = null

  function invoke() {
    const args = lastArgs
    const context = lastThis
    timer = null
    lastArgs = null
    lastThis = null
    fn.apply(context, args)
  }

  function debounced(...args) {
    lastArgs = args
    lastThis = this
    clearTimeout(timer)
    timer = setTimeout(invoke, ms)
  }

  debounced.cancel = () => {
    clearTimeout(timer)
    timer = null
    lastArgs = null
    lastThis = null
  }
  debounced.flush = () => {
    if (timer === null) return
    clearTimeout(timer)
    invoke()
  }
  debounced.pending = () => timer !== null

  return debounced
}

function createCache({ ttl = 60000, max = 50 } = {}) {
  const entries = new Map()
  return {
    get(key) {
      const entry = entries.get(key)
      if (!entry) return undefined
      entries.delete(key)
      if (Date.now() - entry.time >= ttl) return undefined
      entries.set(key, entry)
      return entry.value
    },
    set(key, value) {
      entries.delete(key)
      entries.set(key, { value, time: Date.now() })
      if (entries.size > max) entries.delete(entries.keys().next().value)
    },
    get size() {
      return entries.size
    },
    clear() {
      entries.clear()
    },
  }
}

function normalizeQuery(query) {
  return String(query).trim().replace(/\s+/g, ' ').toLowerCase()
}

function buildSearchUrl(query) {
  return `/api/search?q=${encodeURIComponent(normalizeQuery(query))}`
}

class HttpError extends Error {
  constructor(status, url) {
    super(`HTTP ${status} для ${url}`)
    this.name = 'HttpError'
    this.status = status
    this.url = url
  }
}

async function searchApi(fetcher, query, { signal } = {}) {
  const url = buildSearchUrl(query)
  const response = await fetcher(url, { signal })
  if (!response.ok) throw new HttpError(response.status, url)
  const data = await response.json()
  if (!Array.isArray(data?.items)) throw new TypeError('Некоректна відповідь: немає items')
  return data.items
}

function isAbortError(error) {
  return error?.name === 'AbortError'
}

function takeLatest(task) {
  let controller = null

  async function run(...args) {
    controller?.abort()
    const current = new AbortController()
    controller = current
    let value
    try {
      value = await task(current.signal, ...args)
    } catch (error) {
      throw current.signal.aborted ? current.signal.reason : error
    }
    if (current.signal.aborted) throw current.signal.reason
    return value
  }

  run.cancel = () => {
    controller?.abort()
    controller = null
  }

  return run
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlight(text, query) {
  const q = String(query).trim()
  if (q === '') return text ? [{ text, match: false }] : []
  const re = new RegExp(escapeRegExp(q), 'giu')
  const segments = []
  let last = 0
  for (const m of text.matchAll(re)) {
    if (m.index > last) segments.push({ text: text.slice(last, m.index), match: false })
    segments.push({ text: m[0], match: true })
    last = m.index + m[0].length
  }
  if (last < text.length) segments.push({ text: text.slice(last), match: false })
  return segments
}

function createSearchController({ fetcher, delay = 300, minLength = 2, cache = createCache() }) {
  let state = { query: '', status: 'idle', results: [], error: null }
  const listeners = new Set()
  const search = takeLatest((signal, query) => searchApi(fetcher, query, { signal }))

  function setState(patch) {
    state = { ...state, ...patch }
    for (const listener of [...listeners]) listener(state)
  }

  async function run(query) {
    setState({ status: 'loading', error: null })
    try {
      const results = await search(query)
      cache.set(normalizeQuery(query), results)
      setState({ status: 'success', results, error: null })
    } catch (error) {
      if (isAbortError(error)) return
      setState({ status: 'error', results: [], error })
    }
  }

  const debouncedRun = debounce(run, delay)

  function stop() {
    debouncedRun.cancel()
    search.cancel()
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setQuery(query) {
      const key = normalizeQuery(query)
      if (key.length < minLength) {
        stop()
        setState({ query, status: 'idle', results: [], error: null })
        return
      }
      const cached = cache.get(key)
      if (cached !== undefined) {
        stop()
        setState({ query, status: 'success', results: cached, error: null })
        return
      }
      setState({ query })
      debouncedRun(query)
    },
    flush: () => debouncedRun.flush(),
    dispose() {
      stop()
      listeners.clear()
    },
  }
}

    // ---------- фейковий сервер з випадковою затримкою
    const DATA = ['React', 'React Native', 'Preact', 'Vue', 'Vuex', 'Svelte', 'SolidJS', 'Angular', 'TypeScript', 'JavaScript', 'CoffeeScript', 'Node.js', 'Deno', 'Bun', 'Redux', 'Zustand', 'RxJS', 'Lodash', 'Express', 'Next.js', 'Nuxt', 'Remix', 'Astro', 'Vite', 'Webpack', 'esbuild']
    function fakeFetcher(url, { signal } = {}) {
      const q = new URL(url, location.href).searchParams.get('q')
      const latency = 50 + Math.random() * 850
      console.log(`→ запит "${q}" (${Math.round(latency)} мс)`)
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          console.log(`← відповідь "${q}"`)
          const items = DATA.filter((name) => name.toLowerCase().includes(q))
          resolve({ ok: true, status: 200, json: async () => ({ items }) })
        }, latency)
        signal?.addEventListener('abort', () => {
          console.log(`✕ скасовано "${q}"`)
          clearTimeout(timer)
          reject(signal.reason)
        })
      })
    }

    // ---------- DOM-шар
    const input = document.getElementById('q')
    const status = document.getElementById('status')
    const list = document.getElementById('results')
    const search = createSearchController({ fetcher: fakeFetcher, delay: 300 })

    function render(state) {
      status.className = state.status === 'error' ? 'error' : ''
      status.textContent = {
        idle: 'Введи щонайменше 2 символи',
        loading: 'Шукаю…',
        success: `Знайдено: ${state.results.length}`,
        error: `Помилка: ${state.error?.message}`,
      }[state.status]
      list.replaceChildren(...state.results.map((item) => {
        const li = document.createElement('li')
        li.setAttribute('role', 'option')
        for (const segment of highlight(item, state.query)) {
          // жодного innerHTML: <mark> + textContent
          li.append(segment.match ? Object.assign(document.createElement('mark'), { textContent: segment.text }) : segment.text)
        }
        return li
      }))
      input.setAttribute('aria-expanded', String(state.results.length > 0))
    }

    input.addEventListener('input', () => search.setQuery(input.value))
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') search.flush()
      if (event.key === 'Escape') {
        input.value = ''
        search.setQuery('')
      }
    })
    search.subscribe(render)
    render(search.getState())
    window.addEventListener('pagehide', () => search.dispose())

    // ---------- справжній API: заміни fakeFetcher на githubFetcher (ліміт ~10 запитів/хв без токена)
    // async function githubFetcher(url, { signal } = {}) {
    //   const q = new URL(url, location.href).searchParams.get('q')
    //   const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&per_page=10`, { signal })
    //   return { ok: res.ok, status: res.status, json: async () => ({ items: (await res.json()).items.map((r) => r.full_name) }) }
    // }
  </script>
</body>
</html>
```

> [!tip] Зламай наївну версію
> Тимчасово заміни в `takeLatest` рядок `if (current.signal.aborted) throw current.signal.reason` на коментар, а у `fakeFetcher` прибери обробник `abort`. Швидко надрукуй `vue`, зітри до `vu`, допиши `vuex` — і побачиш, як повільні старі відповіді «перестрибують» свіжі.

## 📚 Джерела та що почитати

- 🟢 [MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) — скасування `fetch` і будь-якого async-коду
- 🟢 [javascript.info — Fetch: Abort](https://javascript.info/fetch-abort) — практичні приклади скасування
- 🟢 [CSS-Tricks — Debouncing and Throttling Explained](https://css-tricks.com/debouncing-throttling-explained-examples/) — інтерактивні демо обох технік
- 🟡 [MDN — AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) — `reason`, `timeout()`, `any()`, подія `abort`
- 🟡 [MDN — Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions) — зокрема функція екранування спецсимволів
- 🟡 [TanStack Query — Query Cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation) — як це зроблено в промисловій бібліотеці
- 🛠️ [WAI-ARIA APG — Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) — доступне автодоповнення: ролі, клавіатура, `aria-live`

> [!important] Підсумок
> - Три рівні захисту від гонок: debounce (менше запитів), abort (звільнити мережу), перевірка застарілості після `await` (гарантія).
> - `AbortError` — нормальне скасування, не помилка для користувача.
> - Кеш на `Map`: LRU через перевставку, TTL ліниво при читанні; ключ — нормалізований запит.
> - Підсвітка — сегментами + `textContent`, ніколи не `innerHTML`.
> - `fetcher` ін'єктується: мережеві гонки тестуються детерміновано фейковими таймерами.
