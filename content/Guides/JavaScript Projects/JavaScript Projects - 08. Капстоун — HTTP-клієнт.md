---
title: "Капстоун: HTTP-клієнт"
order: 8
level: senior
tags: [http, retries, backoff, abortcontroller, middleware, concurrency, capstone]
prerequisites:
  - "[[JavaScript - 27. Мережа — fetch, CORS і HTTP]]"
  - "[[JavaScript - 22. Помилки та їх обробка]]"
  - "[[JavaScript - 14. Debounce, throttle та async-патерни]]"
estimatedMinutes: 150
id: jsp-ch-08
icon: "🛰️"
---

# JavaScript Projects - 08. Капстоун: HTTP-клієнт

> [!success] 🎯 Після цього розділу ти зможеш
> - Спроєктувати **ієрархію типізованих помилок** (`HttpError`, `NetworkError`, `TimeoutError`, `ParseError`) з `cause`.
> - Будувати запити: URL з `baseURL`, query-параметри, JSON-тіло, нормалізовані заголовки.
> - Обмежувати час запиту через `AbortController` і поєднувати таймаут зі скасуванням користувачем.
> - Робити **ретраї з експоненційним backoff і jitter** лише для безпечних запитів і поважати `Retry-After`.
> - Писати **middleware-інтерсептори** та **пул конкурентності** — і зібрати з усього клієнт рівня `ky`/`axios`, протестований без мережі.

## 🎯 Що збудуємо

Бібліотеку `createClient`, яка робить `api.get('users', { params: { page: 2 } })` надійним: таймаут на кожну спробу, повтори при збоях сервера, авторизація через інтерсептор, не більше N запитів одночасно, і помилки, які можна розрізнити `instanceof`. Мережа — **ін'єкований транспорт**: у тестах фейк, у браузері — адаптер над `fetch`.

> [!diagram] Шари createClient: що всередині чого
> ```yaml
> layout: nest
> nodes:
>   - { id: call, label: "api.get('users', { params: { page: 2 } })", tone: gray }
>   - { id: build, parent: call, label: "buildRequest(baseURL, options)", text: "{ method, url, headers, body }", tone: blue }
>   - { id: pool, parent: call, label: "pool.run(…) · concurrency = 6", text: "зайнято слотів: 0 / 6", tone: mint }
>   - { id: retry, parent: pool, label: "retry(…) · NetworkError | TimeoutError | 5xx | 429", text: "спроба —", tone: yellow, icon: "px:repeat" }
>   - { id: timeout, parent: retry, label: "withTimeout(signal => …, timeout)", text: "10000 мс на спробу", tone: orange, icon: "px:hourglass" }
>   - { id: mw, parent: timeout, label: "middleware: auth → logger → … → send", text: "—", tone: violet }
>   - { id: transport, parent: mw, label: "transport(request) — fetch | fake", text: "—", tone: gray }
>   - { id: result, parent: call, label: "toResult: JSON / текст, HttpError | ParseError", text: "?", tone: green }
> steps:
>   - { set: { build: "GET https://api.test/v1/users?page=2" }, note: "buildRequest складає URL з baseURL і params та нормалізує заголовки. Далі всі шари працюють з одним форматом запиту." }
>   - { set: { pool: "зайнято слотів: 1 / 6" }, note: "Пул пропускає не більше 6 запитів одночасно, решта чекає в черзі FIFO. Уся операція — разом із повторами — займає один слот." }
>   - { set: { retry: "спроба 1", mw: "headers.authorization додано", transport: "503 Service Unavailable" }, note: "Спроба 1: стартує власний таймер на 10 с, інтерсептор auth додає заголовок, send віддає запит транспорту. Сервер відповів 503." }
>   - { set: { retry: "спроба 2 · після backoff з jitter", transport: "…" }, note: "503 — це 5xx, а GET ідемпотентний, тож retry чекає паузу (Retry-After або backoff з jitter) і пробує ще раз. Нова спроба — новий таймер на 10 с." }
>   - { set: { transport: "{ status: 200, headers, body }" }, note: "Друга спроба вдалась: транспорт повертає статус, заголовки й тіло. Яким був транспорт — fetch чи фейк у тесті, — шарам вище байдуже." }
>   - { set: { result: "дані з JSON", pool: "зайнято слотів: 0 / 6" }, note: "toResult розбирає тіло як JSON (або кидає HttpError | ParseError, які легко розрізнити через instanceof). Слот у пулі звільняється." }
>   - { focus: [pool, retry, timeout], note: "Порядок і є дизайн: таймаут усередині ретраю — кожна спроба має свій ліміт; ретрай усередині пулу — одна логічна операція займає один слот." }
> ```

Кожен шар — окрема функція з власними тестами; `createClient` лише складає їх у правильному порядку. Порядок і є дизайн: таймаут **усередині** ретраю (кожна спроба має свій ліміт), ретрай **усередині** пулу (одна логічна операція займає один слот).

## 🧭 План кроків

1. Помилки + `parseBody` + `toResult`. Теорія: [[JavaScript - 22. Помилки та їх обробка]], [[JavaScript - 07. Прототипи та класи]].
2. `buildRequest` — URL, параметри, заголовки, JSON. Теорія: [[JavaScript - 27. Мережа — fetch, CORS і HTTP]].
3. `withTimeout` — таймаут і скасування через `AbortController`.
4. `backoffDelay` + `retry` — експонента, jitter, ін'єкція очікування. Теорія: [[JavaScript - 14. Debounce, throttle та async-патерни]].
5. `composeMiddleware` — інтерсептори «цибулею» (як у розділі 5).
6. `createPool` — обмеження конкурентності. Теорія: [[JavaScript - 09. Promise]].
7. `createClient` — збираємо все.

## 🧩 Розминка

> [!quiz] Заповни пропуски в backoff з full jitter
> level: senior · type: fill · id: jsp-08-quiz-01 · bank: Math.max, +
>
> ```js fill
> function backoffDelay(attempt, { base = 200, max = 10000, factor = 2, random = Math.random } = {}) {
>   const exp = Math.[[min]](max, base * factor [[**]] attempt)
>   return [[random]]() * exp
> }
> ```
>
> **Пояснення:** затримка росте експоненційно (200, 400, 800…), але не вище стелі. Множення на випадкове число з `[0, 1)` — **full jitter**: тисяча клієнтів, що впали одночасно, повторюватимуть запити в різний час, а не синхронною хвилею.

> [!quiz] Склади цикл повторів
> level: senior · type: order · id: jsp-08-quiz-02
>
> ```js order
> for (let attempt = 0; ; attempt++) {
>   try {
>     return await fn(attempt)
>   } catch (error) {
>     if (attempt >= retries || !shouldRetry(error, attempt)) throw error
>     await wait(delay(attempt, error))
>   }
> }
>     return fn(attempt) // ✗
> ```
>
> **Пояснення:** `return await` всередині `try` — обов'язково: без `await` відхилений проміс «вилетить» з функції повз `catch`, і повтору не буде. Перевірка «чи ще можна» йде **перед** очікуванням — інакше після останньої спроби ми б даремно чекали.

## 🛠️ Крок 1. Типізовані помилки і розбір відповіді

`fetch` кидає лише `TypeError` при збої мережі, а 404 і 500 — «успішні» відповіді з `ok: false`. Для коду вище цього мало: retry має відрізнити «сервер ліг» від «немає інтернету» від «таймаут», UI — показати різні повідомлення. Тому — ієрархія класів зі спільним предком, а `cause` зберігає першопричину.

Транспорт повертає просту відповідь: `{ status, headers, body }`, де `headers` — об'єкт з іменами в нижньому регістрі, `body` — рядок.

> [!task] Крок 1 · помилки, parseBody, toResult
> level: middle · difficulty: medium · id: jsp-08-task-01 · tags: errors, classes, json
>
> Напиши:
>
> - `class HttpClientError extends Error` — конструктор `(message, options)` передає обидва в `super`; `name` = ім'я **фактичного** класу (`new.target.name`);
> - `NetworkError`, `TimeoutError`, `ParseError` — порожні підкласи `HttpClientError`;
> - `class HttpError extends HttpClientError` — конструктор `(response, data, request)`: повідомлення `'HTTP <status> <method> <url>'`, поля `status`, `headers` (або `{}`), `data`, `request`;
> - `parseBody(response)` — якщо `content-type` містить `json`: порожнє тіло → `null`, інакше `JSON.parse`; битий JSON → `ParseError('Некоректний JSON у відповіді', { cause })`. Інакше — тіло як рядок (`''`, якщо немає);
> - `toResult(response, request)` — статус 2xx → `{ status, headers, data }`; інакше → `HttpError`. Для не-2xx битий JSON не є помилкою розбору: у `data` іде сирий текст.
>
> ```js starter
> class HttpClientError extends Error {
>   // твій код
> }
>
> class NetworkError extends HttpClientError {}
> class TimeoutError extends HttpClientError {}
> class ParseError extends HttpClientError {}
>
> class HttpError extends HttpClientError {
>   // твій код
> }
>
> function parseBody(response) {
>   // твій код
> }
>
> function toResult(response, request) {
>   // твій код
> }
> ```
>
> ```js tests
> const request = { method: 'GET', url: 'https://api.test/users' }
> const json = (status, body) => ({ status, headers: { 'content-type': 'application/json; charset=utf-8' }, body })
>
> test('ієрархія і name', () => {
>   const cause = new TypeError('Failed to fetch')
>   const error = new NetworkError('offline', { cause })
>   expect(error).toBeInstanceOf(HttpClientError)
>   expect(error).toBeInstanceOf(Error)
>   expect(error.name).toBe('NetworkError')
>   expect(error.cause).toBe(cause)
>   expect(new TimeoutError('t').name).toBe('TimeoutError')
> })
>
> test('JSON, порожнє тіло і текст', () => {
>   expect(toResult(json(200, '{"id":1}'), request)).toEqual({ status: 200, headers: { 'content-type': 'application/json; charset=utf-8' }, data: { id: 1 } })
>   expect(parseBody(json(204, ''))).toBeNull()
>   expect(parseBody({ status: 200, headers: { 'content-type': 'text/plain' }, body: 'pong' })).toBe('pong')
>   expect(parseBody({ status: 200, headers: {} })).toBe('')
> })
>
> test('битий JSON у 2xx — ParseError з cause', () => {
>   try {
>     toResult(json(200, '{oops'), request)
>     throw new Error('мало кинути')
>   } catch (error) {
>     expect(error).toBeInstanceOf(ParseError)
>     expect(error.message).toBe('Некоректний JSON у відповіді')
>     expect(error.cause).toBeInstanceOf(SyntaxError)
>   }
> })
>
> test('не 2xx — HttpError з даними', () => {
>   try {
>     toResult(json(404, '{"error":"not found"}'), request)
>     throw new Error('мало кинути')
>   } catch (error) {
>     expect(error).toBeInstanceOf(HttpError)
>     expect(error.name).toBe('HttpError')
>     expect(error.message).toBe('HTTP 404 GET https://api.test/users')
>     expect(error.status).toBe(404)
>     expect(error.data).toEqual({ error: 'not found' })
>     expect(error.request).toBe(request)
>   }
> })
>
> test('битий JSON у помилці — сирий текст', () => {
>   expect(() => toResult(json(502, '<html>Bad Gateway</html>'), request)).toThrow(HttpError)
>   try {
>     toResult(json(502, '<html>Bad Gateway</html>'), request)
>   } catch (error) {
>     expect(error.data).toBe('<html>Bad Gateway</html>')
>   }
> })
> ```
>
> > [!hint]- Підказка 1
> > `constructor(message, options) { super(message, options); this.name = new.target.name }` — `new.target` вказує на клас, який реально викликали через `new`, тож підкласам не треба перевизначати `name`.
>
> > [!hint]- Підказка 2
> > У `toResult`: `const ok = status >= 200 && status < 300`; розбір у `try/catch`, де помилку пробрасуємо лише якщо `ok`, інакше `data = response.body`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class HttpClientError extends Error {
> >   constructor(message, options) {
> >     super(message, options)
> >     this.name = new.target.name
> >   }
> > }
> >
> > class NetworkError extends HttpClientError {}
> > class TimeoutError extends HttpClientError {}
> > class ParseError extends HttpClientError {}
> >
> > class HttpError extends HttpClientError {
> >   constructor(response, data, request) {
> >     super(`HTTP ${response.status} ${request.method} ${request.url}`)
> >     this.status = response.status
> >     this.headers = response.headers ?? {}
> >     this.data = data
> >     this.request = request
> >   }
> > }
> >
> > function parseBody(response) {
> >   const type = response.headers?.['content-type'] ?? ''
> >   const body = response.body ?? ''
> >   if (!type.includes('json')) return body
> >   if (body === '') return null
> >   try {
> >     return JSON.parse(body)
> >   } catch (error) {
> >     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
> >   }
> > }
> >
> > function toResult(response, request) {
> >   const ok = response.status >= 200 && response.status < 300
> >   let data
> >   try {
> >     data = parseBody(response)
> >   } catch (error) {
> >     if (ok) throw error
> >     data = response.body
> >   }
> >   if (!ok) throw new HttpError(response, data, request)
> >   return { status: response.status, headers: response.headers ?? {}, data }
> > }
> > ```
> > **Чому так:** спільний предок `HttpClientError` дозволяє одним `instanceof` відрізнити «помилки клієнта» від багів у коді. `cause` (ES2022) зберігає оригінальну помилку — стектрейс `SyntaxError` не губиться при обгортанні. `new.target.name` — одне рядок для всієї ієрархії. 502 від проксі часто віддає HTML з `content-type: application/json` — тому для помилок ми не маскуємо справжню проблему (`HttpError`) другорядною (`ParseError`).

## 🛠️ Крок 2. Побудова запиту

`buildRequest` перетворює зручні опції на нормалізований запит, з яким далі працюють усі шари. Нормалізація — щоб інтерсептори не гадали, `Authorization` чи `authorization`. Увага на класичну пастку `new URL`: шлях з `/` на початку відкидає шлях бази.

> [!task] Крок 2 · buildRequest
> level: middle · difficulty: medium · id: jsp-08-task-02 · tags: url, headers, json
>
> Додай `buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {})` → `{ method, url, headers, body }`:
>
> - `url` — `new URL(url, baseURL)`; параметри додаються через `searchParams.append` (наявний query зберігається); масив → кілька однакових ключів; `null`/`undefined` — пропустити;
> - `method` — у верхньому регістрі;
> - заголовки — імена в нижньому регістрі, значення — рядки; `accept` за замовчуванням `'application/json'`;
> - `json` передано → `body = JSON.stringify(json)` і `content-type: application/json`, якщо його не задано явно.
>
> ```js starter
> class HttpClientError extends Error {
>   constructor(message, options) {
>     super(message, options)
>     this.name = new.target.name
>   }
> }
>
> class NetworkError extends HttpClientError {}
> class TimeoutError extends HttpClientError {}
> class ParseError extends HttpClientError {}
>
> class HttpError extends HttpClientError {
>   constructor(response, data, request) {
>     super(`HTTP ${response.status} ${request.method} ${request.url}`)
>     this.status = response.status
>     this.headers = response.headers ?? {}
>     this.data = data
>     this.request = request
>   }
> }
>
> function parseBody(response) {
>   const type = response.headers?.['content-type'] ?? ''
>   const body = response.body ?? ''
>   if (!type.includes('json')) return body
>   if (body === '') return null
>   try {
>     return JSON.parse(body)
>   } catch (error) {
>     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
>   }
> }
>
> function toResult(response, request) {
>   const ok = response.status >= 200 && response.status < 300
>   let data
>   try {
>     data = parseBody(response)
>   } catch (error) {
>     if (ok) throw error
>     data = response.body
>   }
>   if (!ok) throw new HttpError(response, data, request)
>   return { status: response.status, headers: response.headers ?? {}, data }
> }
>
> function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> const base = 'https://api.test/v1/'
>
> test('відносний шлях і пастка з /', () => {
>   expect(buildRequest(base, { url: 'users' }).url).toBe('https://api.test/v1/users')
>   expect(buildRequest(base, { url: '/users' }).url).toBe('https://api.test/users')
>   expect(buildRequest(base, { url: 'https://other.test/x' }).url).toBe('https://other.test/x')
> })
>
> test('query-параметри', () => {
>   const { url } = buildRequest(base, { url: 'search?sort=asc', params: { q: 'react native', tag: ['a', 'b'], page: 2, skip: null, none: undefined } })
>   expect(url).toBe('https://api.test/v1/search?sort=asc&q=react+native&tag=a&tag=b&page=2')
> })
>
> test('метод і заголовки', () => {
>   const request = buildRequest(base, { url: 'x', method: 'patch', headers: { 'X-Trace-Id': 42, Accept: 'text/csv' } })
>   expect(request.method).toBe('PATCH')
>   expect(request.headers).toEqual({ 'x-trace-id': '42', accept: 'text/csv' })
>   expect(request.body).toBeNull()
>   expect(buildRequest(base, { url: 'x' }).headers).toEqual({ accept: 'application/json' })
> })
>
> test('JSON-тіло', () => {
>   const request = buildRequest(base, { url: 'orders', method: 'POST', json: { item: 1, note: 'Привіт' } })
>   expect(request.body).toBe('{"item":1,"note":"Привіт"}')
>   expect(request.headers['content-type']).toBe('application/json')
>   const custom = buildRequest(base, { url: 'x', json: {}, headers: { 'Content-Type': 'application/vnd.api+json' } })
>   expect(custom.headers['content-type']).toBe('application/vnd.api+json')
> })
>
> test('без бази відносний URL — TypeError', () => {
>   expect(() => buildRequest(undefined, { url: 'users' })).toThrow(TypeError)
> })
> ```
>
> > [!hint]- Підказка 1
> > `for (const item of [].concat(value))` — однаково обробляє і одиночні значення, і масиви.
>
> > [!hint]- Підказка 2
> > Спершу нормалізуй заголовки (`key.toLowerCase()`, `String(value)`), а потім став значення за замовчуванням через `??=` — так явно передані не перезапишуться.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class HttpClientError extends Error {
> >   constructor(message, options) {
> >     super(message, options)
> >     this.name = new.target.name
> >   }
> > }
> >
> > class NetworkError extends HttpClientError {}
> > class TimeoutError extends HttpClientError {}
> > class ParseError extends HttpClientError {}
> >
> > class HttpError extends HttpClientError {
> >   constructor(response, data, request) {
> >     super(`HTTP ${response.status} ${request.method} ${request.url}`)
> >     this.status = response.status
> >     this.headers = response.headers ?? {}
> >     this.data = data
> >     this.request = request
> >   }
> > }
> >
> > function parseBody(response) {
> >   const type = response.headers?.['content-type'] ?? ''
> >   const body = response.body ?? ''
> >   if (!type.includes('json')) return body
> >   if (body === '') return null
> >   try {
> >     return JSON.parse(body)
> >   } catch (error) {
> >     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
> >   }
> > }
> >
> > function toResult(response, request) {
> >   const ok = response.status >= 200 && response.status < 300
> >   let data
> >   try {
> >     data = parseBody(response)
> >   } catch (error) {
> >     if (ok) throw error
> >     data = response.body
> >   }
> >   if (!ok) throw new HttpError(response, data, request)
> >   return { status: response.status, headers: response.headers ?? {}, data }
> > }
> >
> > function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
> >   const full = new URL(url, baseURL)
> >   for (const [key, value] of Object.entries(params)) {
> >     for (const item of [].concat(value)) {
> >       if (item !== null && item !== undefined) full.searchParams.append(key, String(item))
> >     }
> >   }
> >   const normalized = {}
> >   for (const [key, value] of Object.entries(headers)) normalized[key.toLowerCase()] = String(value)
> >   let payload = body
> >   if (json !== undefined) {
> >     payload = JSON.stringify(json)
> >     normalized['content-type'] ??= 'application/json'
> >   }
> >   normalized.accept ??= 'application/json'
> >   return { method: method.toUpperCase(), url: full.toString(), headers: normalized, body: payload }
> > }
> > ```
> > **Чому так:** `URL` і `URLSearchParams` екранують усе за стандартом (пробіл → `+`, `&` → `%26`) — ручна конкатенація рядків тут джерело багів і вразливостей. Нормалізований запит — **контракт** для всіх шарів: інтерсептор авторизації пише `headers.authorization`, не перевіряючи варіанти регістру (HTTP-заголовки регістронезалежні). Пастка `new URL('/users', base)` поводиться як посилання в HTML: абсолютний шлях відкидає `/v1/` бази — тому `baseURL` закінчуємо `/`, а шляхи пишемо без нього.

## 🛠️ Крок 3. Таймаут через AbortController

У `fetch` немає опції `timeout`. Обгортка `withTimeout` створює власний `AbortController`, передає його `signal` у задачу і через `ms` скасовує його з `TimeoutError`. Так таймаут не лише відхиляє проміс, а й **обриває** запит — браузер звільняє з'єднання. Додатково підтримуємо зовнішній `signal` користувача (кнопка «Скасувати»).

> [!task] Крок 3 · withTimeout
> level: senior · difficulty: hard · id: jsp-08-task-03 · tags: abortcontroller, timers, promises
>
> Додай `withTimeout(task, ms, { signal } = {})` → проміс:
>
> - зовнішній `signal` уже скасований → одразу відхилити з `signal.reason`, **не** викликаючи `task`;
> - створює `AbortController`, викликає `task(controller.signal)`;
> - якщо `ms` — скінченне число > 0: через `ms` мс — `controller.abort(new TimeoutError('Перевищено таймаут <ms> мс'))`;
> - скасування зовнішнього `signal` → `controller.abort(signal.reason)`;
> - проміс відхиляється з `controller.signal.reason`, щойно внутрішній сигнал скасовано; інакше — результат або помилка `task`;
> - після завершення (будь-якого) — прибрати таймер і слухача зовнішнього сигналу.
>
> ```js starter
> class HttpClientError extends Error {
>   constructor(message, options) {
>     super(message, options)
>     this.name = new.target.name
>   }
> }
>
> class NetworkError extends HttpClientError {}
> class TimeoutError extends HttpClientError {}
> class ParseError extends HttpClientError {}
>
> class HttpError extends HttpClientError {
>   constructor(response, data, request) {
>     super(`HTTP ${response.status} ${request.method} ${request.url}`)
>     this.status = response.status
>     this.headers = response.headers ?? {}
>     this.data = data
>     this.request = request
>   }
> }
>
> function parseBody(response) {
>   const type = response.headers?.['content-type'] ?? ''
>   const body = response.body ?? ''
>   if (!type.includes('json')) return body
>   if (body === '') return null
>   try {
>     return JSON.parse(body)
>   } catch (error) {
>     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
>   }
> }
>
> function toResult(response, request) {
>   const ok = response.status >= 200 && response.status < 300
>   let data
>   try {
>     data = parseBody(response)
>   } catch (error) {
>     if (ok) throw error
>     data = response.body
>   }
>   if (!ok) throw new HttpError(response, data, request)
>   return { status: response.status, headers: response.headers ?? {}, data }
> }
>
> function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
>   const full = new URL(url, baseURL)
>   for (const [key, value] of Object.entries(params)) {
>     for (const item of [].concat(value)) {
>       if (item !== null && item !== undefined) full.searchParams.append(key, String(item))
>     }
>   }
>   const normalized = {}
>   for (const [key, value] of Object.entries(headers)) normalized[key.toLowerCase()] = String(value)
>   let payload = body
>   if (json !== undefined) {
>     payload = JSON.stringify(json)
>     normalized['content-type'] ??= 'application/json'
>   }
>   normalized.accept ??= 'application/json'
>   return { method: method.toUpperCase(), url: full.toString(), headers: normalized, body: payload }
> }
>
> function withTimeout(task, ms, { signal } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> test('встигає — результат, таймер прибрано', async () => {
>   vi.useFakeTimers()
>   const promise = withTimeout(() => new Promise((resolve) => setTimeout(() => resolve('ok'), 50)), 100)
>   vi.advanceTimersByTime(50)
>   await expect(promise).resolves.toBe('ok')
>   expect(vi.getTimerCount()).toBe(0)
> })
>
> test('не встигає — TimeoutError, сигнал задачі скасовано', async () => {
>   vi.useFakeTimers()
>   let seen
>   const result = withTimeout((signal) => {
>     seen = signal
>     return new Promise(() => {})
>   }, 100).catch((e) => e)
>   vi.advanceTimersByTime(100)
>   const error = await result
>   expect(error).toBeInstanceOf(TimeoutError)
>   expect(error.message).toBe('Перевищено таймаут 100 мс')
>   expect(seen.aborted).toBe(true)
>   expect(seen.reason).toBe(error)
> })
>
> test('помилка задачі пробрасується', async () => {
>   await expect(withTimeout(async () => {
>     throw new Error('500')
>   }, 1000)).rejects.toThrow('500')
>   await expect(withTimeout(() => {
>     throw new Error('sync')
>   }, 1000)).rejects.toThrow('sync')
> })
>
> test('зовнішній signal скасовує задачу', async () => {
>   const outer = new AbortController()
>   let inner
>   const result = withTimeout((signal) => {
>     inner = signal
>     return new Promise(() => {})
>   }, 5000, { signal: outer.signal }).catch((e) => e)
>   outer.abort()
>   const error = await result
>   expect(error.name).toBe('AbortError')
>   expect(inner.aborted).toBe(true)
> })
>
> test('вже скасований signal і ms = 0', async () => {
>   vi.useFakeTimers()
>   const task = vi.fn(async () => 'x')
>   const outer = new AbortController()
>   outer.abort()
>   const error = await withTimeout(task, 100, { signal: outer.signal }).catch((e) => e)
>   expect(error.name).toBe('AbortError')
>   expect(task).toHaveBeenCalledTimes(0)
>   withTimeout(() => new Promise(() => {}), 0)
>   expect(vi.getTimerCount()).toBe(0)
> })
> ```
>
> > [!hint]- Підказка 1
> > Усередині `new Promise((resolve, reject) => …)`: поставь таймер, підпишись на `controller.signal` подією `'abort'` (`reject(controller.signal.reason)`), викличи задачу.
>
> > [!hint]- Підказка 2
> > Задача може кинути **синхронно** — загорни виклик: `let promise; try { promise = Promise.resolve(task(controller.signal)) } catch (e) { promise = Promise.reject(e) }`.
>
> > [!hint]- Підказка 3
> > Функція `cleanup()` — `clearTimeout(timer)` і `signal?.removeEventListener('abort', forwardAbort)`. Виклич її і в обробнику `abort`, і після завершення задачі.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class HttpClientError extends Error {
> >   constructor(message, options) {
> >     super(message, options)
> >     this.name = new.target.name
> >   }
> > }
> >
> > class NetworkError extends HttpClientError {}
> > class TimeoutError extends HttpClientError {}
> > class ParseError extends HttpClientError {}
> >
> > class HttpError extends HttpClientError {
> >   constructor(response, data, request) {
> >     super(`HTTP ${response.status} ${request.method} ${request.url}`)
> >     this.status = response.status
> >     this.headers = response.headers ?? {}
> >     this.data = data
> >     this.request = request
> >   }
> > }
> >
> > function parseBody(response) {
> >   const type = response.headers?.['content-type'] ?? ''
> >   const body = response.body ?? ''
> >   if (!type.includes('json')) return body
> >   if (body === '') return null
> >   try {
> >     return JSON.parse(body)
> >   } catch (error) {
> >     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
> >   }
> > }
> >
> > function toResult(response, request) {
> >   const ok = response.status >= 200 && response.status < 300
> >   let data
> >   try {
> >     data = parseBody(response)
> >   } catch (error) {
> >     if (ok) throw error
> >     data = response.body
> >   }
> >   if (!ok) throw new HttpError(response, data, request)
> >   return { status: response.status, headers: response.headers ?? {}, data }
> > }
> >
> > function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
> >   const full = new URL(url, baseURL)
> >   for (const [key, value] of Object.entries(params)) {
> >     for (const item of [].concat(value)) {
> >       if (item !== null && item !== undefined) full.searchParams.append(key, String(item))
> >     }
> >   }
> >   const normalized = {}
> >   for (const [key, value] of Object.entries(headers)) normalized[key.toLowerCase()] = String(value)
> >   let payload = body
> >   if (json !== undefined) {
> >     payload = JSON.stringify(json)
> >     normalized['content-type'] ??= 'application/json'
> >   }
> >   normalized.accept ??= 'application/json'
> >   return { method: method.toUpperCase(), url: full.toString(), headers: normalized, body: payload }
> > }
> >
> > function withTimeout(task, ms, { signal } = {}) {
> >   if (signal?.aborted) return Promise.reject(signal.reason)
> >   const controller = new AbortController()
> >   const forwardAbort = () => controller.abort(signal.reason)
> >   signal?.addEventListener('abort', forwardAbort, { once: true })
> >
> >   return new Promise((resolve, reject) => {
> >     let timer = null
> >     const cleanup = () => {
> >       clearTimeout(timer)
> >       signal?.removeEventListener('abort', forwardAbort)
> >     }
> >     if (Number.isFinite(ms) && ms > 0) {
> >       timer = setTimeout(() => controller.abort(new TimeoutError(`Перевищено таймаут ${ms} мс`)), ms)
> >     }
> >     controller.signal.addEventListener('abort', () => {
> >       cleanup()
> >       reject(controller.signal.reason)
> >     }, { once: true })
> >
> >     let promise
> >     try {
> >       promise = Promise.resolve(task(controller.signal))
> >     } catch (error) {
> >       promise = Promise.reject(error)
> >     }
> >     promise.then(
> >       (value) => {
> >         cleanup()
> >         resolve(value)
> >       },
> >       (error) => {
> >         cleanup()
> >         reject(error)
> >       },
> >     )
> >   })
> > }
> > ```
> > **Чому так:** один внутрішній контролер — **одна точка скасування** для двох причин (таймаут і користувач), а `abort(reason)` переносить причину, тож код вище відрізняє `TimeoutError` від `AbortError` без прапорців. Відхилення по події `abort`, а не лише через задачу, гарантує таймаут навіть для задачі, яка ігнорує сигнал. Прибирання слухача на зовнішньому сигналі важливе: довгоживучий сигнал (наприклад, сторінки) інакше накопичував би замикання кожного запиту. У сучасних браузерах є `AbortSignal.timeout(ms)` і `AbortSignal.any([...])` — по суті те саме.

## 🛠️ Крок 4. Backoff, jitter і retry

Тимчасові збої (перевантажений сервер, обрив Wi-Fi) часто минають за секунду — варто повторити. Але повторювати **одразу** — означає добивати сервер, що ледве дихає. Тому пауза росте експоненційно, а jitter розносить повтори тисяч клієнтів у часі. Очікування інжектуємо (`wait`) — тести не чекають справжні секунди.

> [!task] Крок 4 · backoffDelay і retry
> level: senior · difficulty: medium · id: jsp-08-task-04 · tags: retry, backoff, jitter, dependency-injection
>
> Додай:
>
> - `backoffDelay(attempt, { base = 200, max = 10000, factor = 2, jitter = 'full', random = Math.random } = {})`: `exp = min(max, base * factor ** attempt)`; `jitter: 'none'` → `exp`; `'equal'` → `exp / 2 + random() * exp / 2`; `'full'` → `random() * exp`;
> - `sleepFor(ms)` — проміс, що виконується через `setTimeout`;
> - `async retry(fn, { retries = 3, shouldRetry = () => true, delay = (attempt) => backoffDelay(attempt), wait = sleepFor, onRetry } = {})`:
>   - викликає `fn(attempt)` (attempt від 0); успіх → результат;
>   - помилка: якщо `attempt >= retries` або `!shouldRetry(error, attempt)` — кинути її; інакше `ms = delay(attempt, error)`, `onRetry?.(error, attempt, ms)`, `await wait(ms)` і наступна спроба.
>
> ```js starter
> class HttpClientError extends Error {
>   constructor(message, options) {
>     super(message, options)
>     this.name = new.target.name
>   }
> }
>
> class NetworkError extends HttpClientError {}
> class TimeoutError extends HttpClientError {}
> class ParseError extends HttpClientError {}
>
> class HttpError extends HttpClientError {
>   constructor(response, data, request) {
>     super(`HTTP ${response.status} ${request.method} ${request.url}`)
>     this.status = response.status
>     this.headers = response.headers ?? {}
>     this.data = data
>     this.request = request
>   }
> }
>
> function parseBody(response) {
>   const type = response.headers?.['content-type'] ?? ''
>   const body = response.body ?? ''
>   if (!type.includes('json')) return body
>   if (body === '') return null
>   try {
>     return JSON.parse(body)
>   } catch (error) {
>     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
>   }
> }
>
> function toResult(response, request) {
>   const ok = response.status >= 200 && response.status < 300
>   let data
>   try {
>     data = parseBody(response)
>   } catch (error) {
>     if (ok) throw error
>     data = response.body
>   }
>   if (!ok) throw new HttpError(response, data, request)
>   return { status: response.status, headers: response.headers ?? {}, data }
> }
>
> function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
>   const full = new URL(url, baseURL)
>   for (const [key, value] of Object.entries(params)) {
>     for (const item of [].concat(value)) {
>       if (item !== null && item !== undefined) full.searchParams.append(key, String(item))
>     }
>   }
>   const normalized = {}
>   for (const [key, value] of Object.entries(headers)) normalized[key.toLowerCase()] = String(value)
>   let payload = body
>   if (json !== undefined) {
>     payload = JSON.stringify(json)
>     normalized['content-type'] ??= 'application/json'
>   }
>   normalized.accept ??= 'application/json'
>   return { method: method.toUpperCase(), url: full.toString(), headers: normalized, body: payload }
> }
>
> function withTimeout(task, ms, { signal } = {}) {
>   if (signal?.aborted) return Promise.reject(signal.reason)
>   const controller = new AbortController()
>   const forwardAbort = () => controller.abort(signal.reason)
>   signal?.addEventListener('abort', forwardAbort, { once: true })
>
>   return new Promise((resolve, reject) => {
>     let timer = null
>     const cleanup = () => {
>       clearTimeout(timer)
>       signal?.removeEventListener('abort', forwardAbort)
>     }
>     if (Number.isFinite(ms) && ms > 0) {
>       timer = setTimeout(() => controller.abort(new TimeoutError(`Перевищено таймаут ${ms} мс`)), ms)
>     }
>     controller.signal.addEventListener('abort', () => {
>       cleanup()
>       reject(controller.signal.reason)
>     }, { once: true })
>
>     let promise
>     try {
>       promise = Promise.resolve(task(controller.signal))
>     } catch (error) {
>       promise = Promise.reject(error)
>     }
>     promise.then(
>       (value) => {
>         cleanup()
>         resolve(value)
>       },
>       (error) => {
>         cleanup()
>         reject(error)
>       },
>     )
>   })
> }
>
> function backoffDelay(attempt, { base = 200, max = 10000, factor = 2, jitter = 'full', random = Math.random } = {}) {
>   // твій код
> }
>
> function sleepFor(ms) {
>   // твій код
> }
>
> async function retry(fn, { retries = 3, shouldRetry = () => true, delay = (attempt) => backoffDelay(attempt), wait = sleepFor, onRetry } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> test('backoffDelay: експонента, стеля, jitter', () => {
>   expect([0, 1, 2, 3].map((a) => backoffDelay(a, { jitter: 'none' }))).toEqual([200, 400, 800, 1600])
>   expect(backoffDelay(20, { jitter: 'none', max: 5000 })).toBe(5000)
>   expect(backoffDelay(1, { random: () => 0.5 })).toBe(200)
>   expect(backoffDelay(1, { jitter: 'equal', random: () => 0 })).toBe(200)
>   expect(backoffDelay(1, { jitter: 'equal', random: () => 1 })).toBe(400)
> })
>
> test('успіх після кількох невдач', async () => {
>   const delays = []
>   let calls = 0
>   const result = await retry(async (attempt) => {
>     calls++
>     if (attempt < 2) throw new Error('fail')
>     return 'ok'
>   }, { delay: (attempt) => (attempt + 1) * 100, wait: async (ms) => { delays.push(ms) } })
>   expect(result).toBe('ok')
>   expect(calls).toBe(3)
>   expect(delays).toEqual([100, 200])
> })
>
> test('вичерпав спроби — остання помилка', async () => {
>   let calls = 0
>   const promise = retry(async () => {
>     calls++
>     throw new Error(`fail ${calls}`)
>   }, { retries: 2, wait: async () => {} })
>   await expect(promise).rejects.toThrow('fail 3')
> })
>
> test('shouldRetry і onRetry', async () => {
>   const onRetry = vi.fn()
>   const fatal = new Error('400')
>   const promise = retry(async () => {
>     throw fatal
>   }, { shouldRetry: (error) => error.message !== '400', onRetry, wait: async () => {} })
>   const error = await promise.catch((e) => e)
>   expect(error).toBe(fatal)
>   expect(onRetry).toHaveBeenCalledTimes(0)
>   let n = 0
>   await retry(async () => {
>     if (n++ === 0) throw new Error('503')
>     return 'ok'
>   }, { onRetry, delay: () => 7, wait: async () => {} })
>   expect(onRetry).toHaveBeenCalledTimes(1)
>   expect(onRetry.mock.calls[0].slice(1)).toEqual([0, 7])
> })
>
> test('за замовчуванням чекає справжній таймер (фейковий годинник)', async () => {
>   vi.useFakeTimers()
>   let calls = 0
>   const promise = retry(async () => {
>     calls++
>     if (calls < 2) throw new Error('fail')
>     return 'ok'
>   }, { delay: () => 1000 })
>   await sleep(0)
>   expect(calls).toBe(1)
>   vi.advanceTimersByTime(999)
>   await sleep(0)
>   expect(calls).toBe(1)
>   vi.advanceTimersByTime(1)
>   await expect(promise).resolves.toBe('ok')
>   expect(calls).toBe(2)
> })
> ```
>
> > [!hint]- Підказка 1
> > `retry` — нескінченний `for (let attempt = 0; ; attempt++)` з `try { return await fn(attempt) } catch (error) { … }`.
>
> > [!hint]- Підказка 2
> > `sleepFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms))` — і саме його фейкові таймери «перемотають» у тесті.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class HttpClientError extends Error {
> >   constructor(message, options) {
> >     super(message, options)
> >     this.name = new.target.name
> >   }
> > }
> >
> > class NetworkError extends HttpClientError {}
> > class TimeoutError extends HttpClientError {}
> > class ParseError extends HttpClientError {}
> >
> > class HttpError extends HttpClientError {
> >   constructor(response, data, request) {
> >     super(`HTTP ${response.status} ${request.method} ${request.url}`)
> >     this.status = response.status
> >     this.headers = response.headers ?? {}
> >     this.data = data
> >     this.request = request
> >   }
> > }
> >
> > function parseBody(response) {
> >   const type = response.headers?.['content-type'] ?? ''
> >   const body = response.body ?? ''
> >   if (!type.includes('json')) return body
> >   if (body === '') return null
> >   try {
> >     return JSON.parse(body)
> >   } catch (error) {
> >     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
> >   }
> > }
> >
> > function toResult(response, request) {
> >   const ok = response.status >= 200 && response.status < 300
> >   let data
> >   try {
> >     data = parseBody(response)
> >   } catch (error) {
> >     if (ok) throw error
> >     data = response.body
> >   }
> >   if (!ok) throw new HttpError(response, data, request)
> >   return { status: response.status, headers: response.headers ?? {}, data }
> > }
> >
> > function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
> >   const full = new URL(url, baseURL)
> >   for (const [key, value] of Object.entries(params)) {
> >     for (const item of [].concat(value)) {
> >       if (item !== null && item !== undefined) full.searchParams.append(key, String(item))
> >     }
> >   }
> >   const normalized = {}
> >   for (const [key, value] of Object.entries(headers)) normalized[key.toLowerCase()] = String(value)
> >   let payload = body
> >   if (json !== undefined) {
> >     payload = JSON.stringify(json)
> >     normalized['content-type'] ??= 'application/json'
> >   }
> >   normalized.accept ??= 'application/json'
> >   return { method: method.toUpperCase(), url: full.toString(), headers: normalized, body: payload }
> > }
> >
> > function withTimeout(task, ms, { signal } = {}) {
> >   if (signal?.aborted) return Promise.reject(signal.reason)
> >   const controller = new AbortController()
> >   const forwardAbort = () => controller.abort(signal.reason)
> >   signal?.addEventListener('abort', forwardAbort, { once: true })
> >
> >   return new Promise((resolve, reject) => {
> >     let timer = null
> >     const cleanup = () => {
> >       clearTimeout(timer)
> >       signal?.removeEventListener('abort', forwardAbort)
> >     }
> >     if (Number.isFinite(ms) && ms > 0) {
> >       timer = setTimeout(() => controller.abort(new TimeoutError(`Перевищено таймаут ${ms} мс`)), ms)
> >     }
> >     controller.signal.addEventListener('abort', () => {
> >       cleanup()
> >       reject(controller.signal.reason)
> >     }, { once: true })
> >
> >     let promise
> >     try {
> >       promise = Promise.resolve(task(controller.signal))
> >     } catch (error) {
> >       promise = Promise.reject(error)
> >     }
> >     promise.then(
> >       (value) => {
> >         cleanup()
> >         resolve(value)
> >       },
> >       (error) => {
> >         cleanup()
> >         reject(error)
> >       },
> >     )
> >   })
> > }
> >
> > function backoffDelay(attempt, { base = 200, max = 10000, factor = 2, jitter = 'full', random = Math.random } = {}) {
> >   const exp = Math.min(max, base * factor ** attempt)
> >   if (jitter === 'none') return exp
> >   if (jitter === 'equal') return exp / 2 + (random() * exp) / 2
> >   return random() * exp
> > }
> >
> > function sleepFor(ms) {
> >   return new Promise((resolve) => setTimeout(resolve, ms))
> > }
> >
> > async function retry(fn, { retries = 3, shouldRetry = () => true, delay = (attempt) => backoffDelay(attempt), wait = sleepFor, onRetry } = {}) {
> >   for (let attempt = 0; ; attempt++) {
> >     try {
> >       return await fn(attempt)
> >     } catch (error) {
> >       if (attempt >= retries || !shouldRetry(error, attempt)) throw error
> >       const ms = delay(attempt, error)
> >       onRetry?.(error, attempt, ms)
> >       await wait(ms)
> >     }
> >   }
> > }
> > ```
> > **Чому так:** без jitter збій сервера синхронізує всіх клієнтів: вони впали в ту саму мілісекунду і повторюють у ту саму — «thundering herd», що знову кладе сервер. Full jitter (аналіз AWS) дає найменше сумарне навантаження. `delay` отримує помилку — так клієнт поверх зможе використати `Retry-After` від сервера. Ін'єкція `wait` і `random` робить логіку детермінованою: тести перевіряють точні затримки за мікросекунди.

## 🛠️ Крок 5. Middleware-інтерсептори

Авторизація, логування, кешування, метрики, оновлення токена — наскрізні речі, які не повинні жити в кожному виклику `api.get`. Middleware `(request, next) => Promise<result>` бачить запит **до** і результат (або помилку) **після** — та сама «цибуля», що в розділі 5, але асинхронна.

> [!task] Крок 5 · composeMiddleware
> level: senior · difficulty: medium · id: jsp-08-task-05 · tags: middleware, composition, async
>
> Додай `composeMiddleware(middlewares, handler)` → `async (request) => result`:
>
> - кожен middleware викликається як `middleware(request, next)`, де `next(request)` — наступний шар; останній шар — `handler(request)`;
> - перший у масиві — зовнішній шар;
> - middleware може змінити запит, відповідь, перехопити помилку, не викликати `next` (кеш) або викликати його **кілька разів** (повтор після оновлення токена);
> - синхронна помилка в будь-якому шарі → відхилений проміс.
>
> ```js starter
> class HttpClientError extends Error {
>   constructor(message, options) {
>     super(message, options)
>     this.name = new.target.name
>   }
> }
>
> class NetworkError extends HttpClientError {}
> class TimeoutError extends HttpClientError {}
> class ParseError extends HttpClientError {}
>
> class HttpError extends HttpClientError {
>   constructor(response, data, request) {
>     super(`HTTP ${response.status} ${request.method} ${request.url}`)
>     this.status = response.status
>     this.headers = response.headers ?? {}
>     this.data = data
>     this.request = request
>   }
> }
>
> function parseBody(response) {
>   const type = response.headers?.['content-type'] ?? ''
>   const body = response.body ?? ''
>   if (!type.includes('json')) return body
>   if (body === '') return null
>   try {
>     return JSON.parse(body)
>   } catch (error) {
>     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
>   }
> }
>
> function toResult(response, request) {
>   const ok = response.status >= 200 && response.status < 300
>   let data
>   try {
>     data = parseBody(response)
>   } catch (error) {
>     if (ok) throw error
>     data = response.body
>   }
>   if (!ok) throw new HttpError(response, data, request)
>   return { status: response.status, headers: response.headers ?? {}, data }
> }
>
> function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
>   const full = new URL(url, baseURL)
>   for (const [key, value] of Object.entries(params)) {
>     for (const item of [].concat(value)) {
>       if (item !== null && item !== undefined) full.searchParams.append(key, String(item))
>     }
>   }
>   const normalized = {}
>   for (const [key, value] of Object.entries(headers)) normalized[key.toLowerCase()] = String(value)
>   let payload = body
>   if (json !== undefined) {
>     payload = JSON.stringify(json)
>     normalized['content-type'] ??= 'application/json'
>   }
>   normalized.accept ??= 'application/json'
>   return { method: method.toUpperCase(), url: full.toString(), headers: normalized, body: payload }
> }
>
> function withTimeout(task, ms, { signal } = {}) {
>   if (signal?.aborted) return Promise.reject(signal.reason)
>   const controller = new AbortController()
>   const forwardAbort = () => controller.abort(signal.reason)
>   signal?.addEventListener('abort', forwardAbort, { once: true })
>
>   return new Promise((resolve, reject) => {
>     let timer = null
>     const cleanup = () => {
>       clearTimeout(timer)
>       signal?.removeEventListener('abort', forwardAbort)
>     }
>     if (Number.isFinite(ms) && ms > 0) {
>       timer = setTimeout(() => controller.abort(new TimeoutError(`Перевищено таймаут ${ms} мс`)), ms)
>     }
>     controller.signal.addEventListener('abort', () => {
>       cleanup()
>       reject(controller.signal.reason)
>     }, { once: true })
>
>     let promise
>     try {
>       promise = Promise.resolve(task(controller.signal))
>     } catch (error) {
>       promise = Promise.reject(error)
>     }
>     promise.then(
>       (value) => {
>         cleanup()
>         resolve(value)
>       },
>       (error) => {
>         cleanup()
>         reject(error)
>       },
>     )
>   })
> }
>
> function backoffDelay(attempt, { base = 200, max = 10000, factor = 2, jitter = 'full', random = Math.random } = {}) {
>   const exp = Math.min(max, base * factor ** attempt)
>   if (jitter === 'none') return exp
>   if (jitter === 'equal') return exp / 2 + (random() * exp) / 2
>   return random() * exp
> }
>
> function sleepFor(ms) {
>   return new Promise((resolve) => setTimeout(resolve, ms))
> }
>
> async function retry(fn, { retries = 3, shouldRetry = () => true, delay = (attempt) => backoffDelay(attempt), wait = sleepFor, onRetry } = {}) {
>   for (let attempt = 0; ; attempt++) {
>     try {
>       return await fn(attempt)
>     } catch (error) {
>       if (attempt >= retries || !shouldRetry(error, attempt)) throw error
>       const ms = delay(attempt, error)
>       onRetry?.(error, attempt, ms)
>       await wait(ms)
>     }
>   }
> }
>
> function composeMiddleware(middlewares, handler) {
>   // твій код
> }
> ```
>
> ```js tests
> const req = { method: 'GET', url: 'https://api.test/me', headers: {} }
>
> test('порядок «цибулі»', async () => {
>   const log = []
>   const mw = (name) => async (request, next) => {
>     log.push(`${name}>`)
>     const result = await next(request)
>     log.push(`<${name}`)
>     return result
>   }
>   const send = composeMiddleware([mw('A'), mw('B')], async () => {
>     log.push('handler')
>     return 'ok'
>   })
>   expect(await send(req)).toBe('ok')
>   expect(log).toEqual(['A>', 'B>', 'handler', '<B', '<A'])
> })
>
> test('зміна запиту і відповіді без мутацій', async () => {
>   const auth = (request, next) => next({ ...request, headers: { ...request.headers, authorization: 'Bearer t' } })
>   const unwrap = async (request, next) => (await next(request)).data
>   const send = composeMiddleware([unwrap, auth], async (request) => ({ data: request.headers.authorization }))
>   expect(await send(req)).toBe('Bearer t')
>   expect(req.headers).toEqual({})
> })
>
> test('кеш без виклику handler', async () => {
>   const cache = new Map()
>   const cached = async (request, next) => {
>     if (!cache.has(request.url)) cache.set(request.url, await next(request))
>     return cache.get(request.url)
>   }
>   const handler = vi.fn(async () => 'дані')
>   const send = composeMiddleware([cached], handler)
>   await send(req)
>   await send(req)
>   expect(handler).toHaveBeenCalledTimes(1)
> })
>
> test('оновлення токена при 401 і повтор через next', async () => {
>   let token = 'old'
>   const refresh = async (request, next) => {
>     try {
>       return await next({ ...request, headers: { ...request.headers, authorization: token } })
>     } catch (error) {
>       if (!(error instanceof HttpError) || error.status !== 401) throw error
>       token = 'new'
>       return next({ ...request, headers: { ...request.headers, authorization: token } })
>     }
>   }
>   const handler = vi.fn(async (request) => {
>     if (request.headers.authorization !== 'new') throw new HttpError({ status: 401 }, null, request)
>     return 'вхід виконано'
>   })
>   expect(await composeMiddleware([refresh], handler)(req)).toBe('вхід виконано')
>   expect(handler).toHaveBeenCalledTimes(2)
> })
>
> test('без middleware і синхронні помилки', async () => {
>   expect(await composeMiddleware([], async (r) => r.url)(req)).toBe('https://api.test/me')
>   const broken = composeMiddleware([() => {
>     throw new Error('sync')
>   }], async () => 'ok')
>   await expect(broken(req)).rejects.toThrow('sync')
>   await expect(composeMiddleware([], () => {
>     throw new Error('handler')
>   })(req)).rejects.toThrow('handler')
> })
> ```
>
> > [!hint]- Підказка 1
> > `middlewares.reduceRight((next, middleware) => …, async (request) => handler(request))` — збирає ланцюжок з кінця, як `applyMiddleware` у розділі 5.
>
> > [!hint]- Підказка 2
> > Кожен шар — `async (request) => middleware(request, next)`: `async` перетворить синхронний `throw` на відхилений проміс.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class HttpClientError extends Error {
> >   constructor(message, options) {
> >     super(message, options)
> >     this.name = new.target.name
> >   }
> > }
> >
> > class NetworkError extends HttpClientError {}
> > class TimeoutError extends HttpClientError {}
> > class ParseError extends HttpClientError {}
> >
> > class HttpError extends HttpClientError {
> >   constructor(response, data, request) {
> >     super(`HTTP ${response.status} ${request.method} ${request.url}`)
> >     this.status = response.status
> >     this.headers = response.headers ?? {}
> >     this.data = data
> >     this.request = request
> >   }
> > }
> >
> > function parseBody(response) {
> >   const type = response.headers?.['content-type'] ?? ''
> >   const body = response.body ?? ''
> >   if (!type.includes('json')) return body
> >   if (body === '') return null
> >   try {
> >     return JSON.parse(body)
> >   } catch (error) {
> >     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
> >   }
> > }
> >
> > function toResult(response, request) {
> >   const ok = response.status >= 200 && response.status < 300
> >   let data
> >   try {
> >     data = parseBody(response)
> >   } catch (error) {
> >     if (ok) throw error
> >     data = response.body
> >   }
> >   if (!ok) throw new HttpError(response, data, request)
> >   return { status: response.status, headers: response.headers ?? {}, data }
> > }
> >
> > function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
> >   const full = new URL(url, baseURL)
> >   for (const [key, value] of Object.entries(params)) {
> >     for (const item of [].concat(value)) {
> >       if (item !== null && item !== undefined) full.searchParams.append(key, String(item))
> >     }
> >   }
> >   const normalized = {}
> >   for (const [key, value] of Object.entries(headers)) normalized[key.toLowerCase()] = String(value)
> >   let payload = body
> >   if (json !== undefined) {
> >     payload = JSON.stringify(json)
> >     normalized['content-type'] ??= 'application/json'
> >   }
> >   normalized.accept ??= 'application/json'
> >   return { method: method.toUpperCase(), url: full.toString(), headers: normalized, body: payload }
> > }
> >
> > function withTimeout(task, ms, { signal } = {}) {
> >   if (signal?.aborted) return Promise.reject(signal.reason)
> >   const controller = new AbortController()
> >   const forwardAbort = () => controller.abort(signal.reason)
> >   signal?.addEventListener('abort', forwardAbort, { once: true })
> >
> >   return new Promise((resolve, reject) => {
> >     let timer = null
> >     const cleanup = () => {
> >       clearTimeout(timer)
> >       signal?.removeEventListener('abort', forwardAbort)
> >     }
> >     if (Number.isFinite(ms) && ms > 0) {
> >       timer = setTimeout(() => controller.abort(new TimeoutError(`Перевищено таймаут ${ms} мс`)), ms)
> >     }
> >     controller.signal.addEventListener('abort', () => {
> >       cleanup()
> >       reject(controller.signal.reason)
> >     }, { once: true })
> >
> >     let promise
> >     try {
> >       promise = Promise.resolve(task(controller.signal))
> >     } catch (error) {
> >       promise = Promise.reject(error)
> >     }
> >     promise.then(
> >       (value) => {
> >         cleanup()
> >         resolve(value)
> >       },
> >       (error) => {
> >         cleanup()
> >         reject(error)
> >       },
> >     )
> >   })
> > }
> >
> > function backoffDelay(attempt, { base = 200, max = 10000, factor = 2, jitter = 'full', random = Math.random } = {}) {
> >   const exp = Math.min(max, base * factor ** attempt)
> >   if (jitter === 'none') return exp
> >   if (jitter === 'equal') return exp / 2 + (random() * exp) / 2
> >   return random() * exp
> > }
> >
> > function sleepFor(ms) {
> >   return new Promise((resolve) => setTimeout(resolve, ms))
> > }
> >
> > async function retry(fn, { retries = 3, shouldRetry = () => true, delay = (attempt) => backoffDelay(attempt), wait = sleepFor, onRetry } = {}) {
> >   for (let attempt = 0; ; attempt++) {
> >     try {
> >       return await fn(attempt)
> >     } catch (error) {
> >       if (attempt >= retries || !shouldRetry(error, attempt)) throw error
> >       const ms = delay(attempt, error)
> >       onRetry?.(error, attempt, ms)
> >       await wait(ms)
> >     }
> >   }
> > }
> >
> > function composeMiddleware(middlewares, handler) {
> >   return middlewares.reduceRight(
> >     (next, middleware) => async (request) => middleware(request, next),
> >     async (request) => handler(request),
> >   )
> > }
> > ```
> > **Чому так:** три рядки, бо вся складність — у **контракті**: `next` — звичайна асинхронна функція, тож middleware може викликати її 0 разів (кеш), 1 (типово) або більше (повтор після оновлення токена). На відміну від пари interceptors `request/response` в axios, «цибуля» бачить запит і відповідь в одному замиканні — легко поміряти тривалість чи зіставити помилку з запитом. `async`-обгортка кожного шару — гарантія «завжди проміс», навіть якщо хтось кинув синхронно.

## 🛠️ Крок 6. Пул конкурентності

Браузер і так обмежує з'єднання на хост, але 200 одночасних запитів усе одно перевантажать сервер, rate limit і пам'ять. Пул пропускає не більше `limit` задач одночасно, решта чекають у черзі **FIFO**. Помилка однієї задачі не повинна зупиняти чергу.

> [!task] Крок 6 · createPool
> level: senior · difficulty: medium · id: jsp-08-task-06 · tags: concurrency, promises, queue
>
> Додай `createPool(limit)`:
>
> - `limit` — не ціле число ≥ 1 → `RangeError('limit має бути цілим числом ≥ 1')`;
> - `run(task)` → проміс з результатом `task()`; якщо зайнято `limit` слотів — задача чекає в черзі; задачі стартують у порядку `run`;
> - синхронний `throw` чи відхилення задачі → відхилений проміс `run`, слот звільняється;
> - геттери `active` (виконуються) і `pending` (у черзі).
>
> ```js starter
> class HttpClientError extends Error {
>   constructor(message, options) {
>     super(message, options)
>     this.name = new.target.name
>   }
> }
>
> class NetworkError extends HttpClientError {}
> class TimeoutError extends HttpClientError {}
> class ParseError extends HttpClientError {}
>
> class HttpError extends HttpClientError {
>   constructor(response, data, request) {
>     super(`HTTP ${response.status} ${request.method} ${request.url}`)
>     this.status = response.status
>     this.headers = response.headers ?? {}
>     this.data = data
>     this.request = request
>   }
> }
>
> function parseBody(response) {
>   const type = response.headers?.['content-type'] ?? ''
>   const body = response.body ?? ''
>   if (!type.includes('json')) return body
>   if (body === '') return null
>   try {
>     return JSON.parse(body)
>   } catch (error) {
>     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
>   }
> }
>
> function toResult(response, request) {
>   const ok = response.status >= 200 && response.status < 300
>   let data
>   try {
>     data = parseBody(response)
>   } catch (error) {
>     if (ok) throw error
>     data = response.body
>   }
>   if (!ok) throw new HttpError(response, data, request)
>   return { status: response.status, headers: response.headers ?? {}, data }
> }
>
> function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
>   const full = new URL(url, baseURL)
>   for (const [key, value] of Object.entries(params)) {
>     for (const item of [].concat(value)) {
>       if (item !== null && item !== undefined) full.searchParams.append(key, String(item))
>     }
>   }
>   const normalized = {}
>   for (const [key, value] of Object.entries(headers)) normalized[key.toLowerCase()] = String(value)
>   let payload = body
>   if (json !== undefined) {
>     payload = JSON.stringify(json)
>     normalized['content-type'] ??= 'application/json'
>   }
>   normalized.accept ??= 'application/json'
>   return { method: method.toUpperCase(), url: full.toString(), headers: normalized, body: payload }
> }
>
> function withTimeout(task, ms, { signal } = {}) {
>   if (signal?.aborted) return Promise.reject(signal.reason)
>   const controller = new AbortController()
>   const forwardAbort = () => controller.abort(signal.reason)
>   signal?.addEventListener('abort', forwardAbort, { once: true })
>
>   return new Promise((resolve, reject) => {
>     let timer = null
>     const cleanup = () => {
>       clearTimeout(timer)
>       signal?.removeEventListener('abort', forwardAbort)
>     }
>     if (Number.isFinite(ms) && ms > 0) {
>       timer = setTimeout(() => controller.abort(new TimeoutError(`Перевищено таймаут ${ms} мс`)), ms)
>     }
>     controller.signal.addEventListener('abort', () => {
>       cleanup()
>       reject(controller.signal.reason)
>     }, { once: true })
>
>     let promise
>     try {
>       promise = Promise.resolve(task(controller.signal))
>     } catch (error) {
>       promise = Promise.reject(error)
>     }
>     promise.then(
>       (value) => {
>         cleanup()
>         resolve(value)
>       },
>       (error) => {
>         cleanup()
>         reject(error)
>       },
>     )
>   })
> }
>
> function backoffDelay(attempt, { base = 200, max = 10000, factor = 2, jitter = 'full', random = Math.random } = {}) {
>   const exp = Math.min(max, base * factor ** attempt)
>   if (jitter === 'none') return exp
>   if (jitter === 'equal') return exp / 2 + (random() * exp) / 2
>   return random() * exp
> }
>
> function sleepFor(ms) {
>   return new Promise((resolve) => setTimeout(resolve, ms))
> }
>
> async function retry(fn, { retries = 3, shouldRetry = () => true, delay = (attempt) => backoffDelay(attempt), wait = sleepFor, onRetry } = {}) {
>   for (let attempt = 0; ; attempt++) {
>     try {
>       return await fn(attempt)
>     } catch (error) {
>       if (attempt >= retries || !shouldRetry(error, attempt)) throw error
>       const ms = delay(attempt, error)
>       onRetry?.(error, attempt, ms)
>       await wait(ms)
>     }
>   }
> }
>
> function composeMiddleware(middlewares, handler) {
>   return middlewares.reduceRight(
>     (next, middleware) => async (request) => middleware(request, next),
>     async (request) => handler(request),
>   )
> }
>
> function createPool(limit) {
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
> test('не більше limit одночасно, FIFO', async () => {
>   const pool = createPool(2)
>   const jobs = [deferred(), deferred(), deferred(), deferred()]
>   const started = []
>   const results = jobs.map((job, i) => pool.run(() => {
>     started.push(i)
>     return job.promise
>   }))
>   expect(started).toEqual([0, 1])
>   expect([pool.active, pool.pending]).toEqual([2, 2])
>   jobs[1].resolve('b')
>   await sleep(0)
>   expect(started).toEqual([0, 1, 2])
>   jobs[0].resolve('a')
>   jobs[2].resolve('c')
>   jobs[3].resolve('d')
>   expect(await Promise.all(results)).toEqual(['a', 'b', 'c', 'd'])
>   await sleep(0)
>   expect([pool.active, pool.pending]).toEqual([0, 0])
> })
>
> test('помилка не блокує чергу', async () => {
>   const pool = createPool(1)
>   const failed = pool.run(async () => {
>     throw new Error('boom')
>   })
>   const next = pool.run(async () => 'далі')
>   await expect(failed).rejects.toThrow('boom')
>   await expect(next).resolves.toBe('далі')
> })
>
> test('синхронний throw — відхилений проміс', async () => {
>   const pool = createPool(1)
>   const broken = pool.run(() => {
>     throw new Error('sync')
>   })
>   await expect(broken).rejects.toThrow('sync')
>   await expect(pool.run(() => 42)).resolves.toBe(42)
> })
>
> test('максимальна паралельність під навантаженням', async () => {
>   const pool = createPool(3)
>   let running = 0
>   let peak = 0
>   const task = async () => {
>     running++
>     peak = Math.max(peak, running)
>     await sleep(1)
>     running--
>   }
>   await Promise.all(Array.from({ length: 10 }, () => pool.run(task)))
>   expect(peak).toBe(3)
> })
>
> test('некоректний limit', () => {
>   expect(() => createPool(0)).toThrow(RangeError)
>   expect(() => createPool(1.5)).toThrow('limit має бути цілим числом ≥ 1')
> })
> ```
>
> > [!hint]- Підказка 1
> > У замиканні: `active = 0` і `queue = []` з об'єктів `{ task, resolve, reject }`. `run` повертає `new Promise((resolve, reject) => { queue.push(...); next() })`.
>
> > [!hint]- Підказка 2
> > `next()`: якщо `active >= limit` або черга порожня — вихід. Інакше `active++`, забрати перший елемент, виконати задачу (синхронний `throw` — у `try`), а після завершення — `active--` і знову `next()`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class HttpClientError extends Error {
> >   constructor(message, options) {
> >     super(message, options)
> >     this.name = new.target.name
> >   }
> > }
> >
> > class NetworkError extends HttpClientError {}
> > class TimeoutError extends HttpClientError {}
> > class ParseError extends HttpClientError {}
> >
> > class HttpError extends HttpClientError {
> >   constructor(response, data, request) {
> >     super(`HTTP ${response.status} ${request.method} ${request.url}`)
> >     this.status = response.status
> >     this.headers = response.headers ?? {}
> >     this.data = data
> >     this.request = request
> >   }
> > }
> >
> > function parseBody(response) {
> >   const type = response.headers?.['content-type'] ?? ''
> >   const body = response.body ?? ''
> >   if (!type.includes('json')) return body
> >   if (body === '') return null
> >   try {
> >     return JSON.parse(body)
> >   } catch (error) {
> >     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
> >   }
> > }
> >
> > function toResult(response, request) {
> >   const ok = response.status >= 200 && response.status < 300
> >   let data
> >   try {
> >     data = parseBody(response)
> >   } catch (error) {
> >     if (ok) throw error
> >     data = response.body
> >   }
> >   if (!ok) throw new HttpError(response, data, request)
> >   return { status: response.status, headers: response.headers ?? {}, data }
> > }
> >
> > function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
> >   const full = new URL(url, baseURL)
> >   for (const [key, value] of Object.entries(params)) {
> >     for (const item of [].concat(value)) {
> >       if (item !== null && item !== undefined) full.searchParams.append(key, String(item))
> >     }
> >   }
> >   const normalized = {}
> >   for (const [key, value] of Object.entries(headers)) normalized[key.toLowerCase()] = String(value)
> >   let payload = body
> >   if (json !== undefined) {
> >     payload = JSON.stringify(json)
> >     normalized['content-type'] ??= 'application/json'
> >   }
> >   normalized.accept ??= 'application/json'
> >   return { method: method.toUpperCase(), url: full.toString(), headers: normalized, body: payload }
> > }
> >
> > function withTimeout(task, ms, { signal } = {}) {
> >   if (signal?.aborted) return Promise.reject(signal.reason)
> >   const controller = new AbortController()
> >   const forwardAbort = () => controller.abort(signal.reason)
> >   signal?.addEventListener('abort', forwardAbort, { once: true })
> >
> >   return new Promise((resolve, reject) => {
> >     let timer = null
> >     const cleanup = () => {
> >       clearTimeout(timer)
> >       signal?.removeEventListener('abort', forwardAbort)
> >     }
> >     if (Number.isFinite(ms) && ms > 0) {
> >       timer = setTimeout(() => controller.abort(new TimeoutError(`Перевищено таймаут ${ms} мс`)), ms)
> >     }
> >     controller.signal.addEventListener('abort', () => {
> >       cleanup()
> >       reject(controller.signal.reason)
> >     }, { once: true })
> >
> >     let promise
> >     try {
> >       promise = Promise.resolve(task(controller.signal))
> >     } catch (error) {
> >       promise = Promise.reject(error)
> >     }
> >     promise.then(
> >       (value) => {
> >         cleanup()
> >         resolve(value)
> >       },
> >       (error) => {
> >         cleanup()
> >         reject(error)
> >       },
> >     )
> >   })
> > }
> >
> > function backoffDelay(attempt, { base = 200, max = 10000, factor = 2, jitter = 'full', random = Math.random } = {}) {
> >   const exp = Math.min(max, base * factor ** attempt)
> >   if (jitter === 'none') return exp
> >   if (jitter === 'equal') return exp / 2 + (random() * exp) / 2
> >   return random() * exp
> > }
> >
> > function sleepFor(ms) {
> >   return new Promise((resolve) => setTimeout(resolve, ms))
> > }
> >
> > async function retry(fn, { retries = 3, shouldRetry = () => true, delay = (attempt) => backoffDelay(attempt), wait = sleepFor, onRetry } = {}) {
> >   for (let attempt = 0; ; attempt++) {
> >     try {
> >       return await fn(attempt)
> >     } catch (error) {
> >       if (attempt >= retries || !shouldRetry(error, attempt)) throw error
> >       const ms = delay(attempt, error)
> >       onRetry?.(error, attempt, ms)
> >       await wait(ms)
> >     }
> >   }
> > }
> >
> > function composeMiddleware(middlewares, handler) {
> >   return middlewares.reduceRight(
> >     (next, middleware) => async (request) => middleware(request, next),
> >     async (request) => handler(request),
> >   )
> > }
> >
> > function createPool(limit) {
> >   if (!Number.isInteger(limit) || limit < 1) throw new RangeError('limit має бути цілим числом ≥ 1')
> >   let active = 0
> >   const queue = []
> >
> >   function next() {
> >     if (active >= limit || queue.length === 0) return
> >     active++
> >     const { task, resolve, reject } = queue.shift()
> >     let promise
> >     try {
> >       promise = Promise.resolve(task())
> >     } catch (error) {
> >       promise = Promise.reject(error)
> >     }
> >     promise
> >       .then(resolve, reject)
> >       .finally(() => {
> >         active--
> >         next()
> >       })
> >   }
> >
> >   return {
> >     run(task) {
> >       return new Promise((resolve, reject) => {
> >         queue.push({ task, resolve, reject })
> >         next()
> >       })
> >     },
> >     get active() {
> >       return active
> >     },
> >     get pending() {
> >       return queue.length
> >     },
> >   }
> > }
> > ```
> > **Чому так:** пул повертає **проміс для кожної задачі**, тож викликач працює з ним як зі звичайним `await`, не знаючи про чергу. Звільнення слоту у `finally` — після успіху і після помилки — головна гарантія: інакше кілька помилок «з'їли» б усі слоти, і черга зависла б назавжди. FIFO через `shift()` — O(n), для тисяч задач краще кільцевий буфер; для запитів UI цього досить. Бібліотека `p-limit` — те саме в кількох десятках рядків.

## 🛠️ Крок 7. createClient

Збираємо клієнт. Порядок шарів — і є архітектура: **пул → retry → таймаут → middleware → транспорт**. Повторюємо лише ідемпотентні методи: повтор `POST /payments` після таймауту може списати гроші двічі. Транспорт — ін'єкція: функція `request → { status, headers, body }`; мережевий збій загортаємо в `NetworkError`.

> [!task] Крок 7 · createClient
> level: senior · difficulty: hard · id: jsp-08-task-07 · tags: integration, retries, http-client
>
> Додай:
>
> - `IDEMPOTENT_METHODS` — `Set` з `GET HEAD OPTIONS PUT DELETE`;
> - `retryAfterMs(error)` — `error.headers['retry-after']` у секундах → мілісекунди; немає / не число → `null`;
> - `isRetryable(error, request)` — лише ідемпотентний метод **і** (`NetworkError` | `TimeoutError` | `HttpError` зі статусом 429 або ≥ 500);
> - `createClient({ baseURL, transport, timeout = 10000, retries = 2, middleware = [], concurrency = 6, wait, random = Math.random } = {})` → `{ request, get, delete, post, put }`:
>   - `send(request)` (останній шар): `transport(request)`; збій транспорту → якщо `request.signal` скасовано — кинути `signal.reason`, інакше `NetworkError('Мережева помилка: <METHOD> <url>', { cause })`; далі `toResult`;
>   - `request(options)`: `buildRequest(baseURL, options)` → `pool.run(() => retry(() => withTimeout((signal) => chain({ ...req, signal }), options.timeout ?? timeout, { signal: options.signal }), { retries, shouldRetry: isRetryable, delay: Retry-After або backoffDelay(attempt, { random }), wait }))`;
>   - `get(url, options)`, `delete(url, options)`, `post(url, json, options)`, `put(url, json, options)`.
>
> ```js starter
> class HttpClientError extends Error {
>   constructor(message, options) {
>     super(message, options)
>     this.name = new.target.name
>   }
> }
>
> class NetworkError extends HttpClientError {}
> class TimeoutError extends HttpClientError {}
> class ParseError extends HttpClientError {}
>
> class HttpError extends HttpClientError {
>   constructor(response, data, request) {
>     super(`HTTP ${response.status} ${request.method} ${request.url}`)
>     this.status = response.status
>     this.headers = response.headers ?? {}
>     this.data = data
>     this.request = request
>   }
> }
>
> function parseBody(response) {
>   const type = response.headers?.['content-type'] ?? ''
>   const body = response.body ?? ''
>   if (!type.includes('json')) return body
>   if (body === '') return null
>   try {
>     return JSON.parse(body)
>   } catch (error) {
>     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
>   }
> }
>
> function toResult(response, request) {
>   const ok = response.status >= 200 && response.status < 300
>   let data
>   try {
>     data = parseBody(response)
>   } catch (error) {
>     if (ok) throw error
>     data = response.body
>   }
>   if (!ok) throw new HttpError(response, data, request)
>   return { status: response.status, headers: response.headers ?? {}, data }
> }
>
> function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
>   const full = new URL(url, baseURL)
>   for (const [key, value] of Object.entries(params)) {
>     for (const item of [].concat(value)) {
>       if (item !== null && item !== undefined) full.searchParams.append(key, String(item))
>     }
>   }
>   const normalized = {}
>   for (const [key, value] of Object.entries(headers)) normalized[key.toLowerCase()] = String(value)
>   let payload = body
>   if (json !== undefined) {
>     payload = JSON.stringify(json)
>     normalized['content-type'] ??= 'application/json'
>   }
>   normalized.accept ??= 'application/json'
>   return { method: method.toUpperCase(), url: full.toString(), headers: normalized, body: payload }
> }
>
> function withTimeout(task, ms, { signal } = {}) {
>   if (signal?.aborted) return Promise.reject(signal.reason)
>   const controller = new AbortController()
>   const forwardAbort = () => controller.abort(signal.reason)
>   signal?.addEventListener('abort', forwardAbort, { once: true })
>
>   return new Promise((resolve, reject) => {
>     let timer = null
>     const cleanup = () => {
>       clearTimeout(timer)
>       signal?.removeEventListener('abort', forwardAbort)
>     }
>     if (Number.isFinite(ms) && ms > 0) {
>       timer = setTimeout(() => controller.abort(new TimeoutError(`Перевищено таймаут ${ms} мс`)), ms)
>     }
>     controller.signal.addEventListener('abort', () => {
>       cleanup()
>       reject(controller.signal.reason)
>     }, { once: true })
>
>     let promise
>     try {
>       promise = Promise.resolve(task(controller.signal))
>     } catch (error) {
>       promise = Promise.reject(error)
>     }
>     promise.then(
>       (value) => {
>         cleanup()
>         resolve(value)
>       },
>       (error) => {
>         cleanup()
>         reject(error)
>       },
>     )
>   })
> }
>
> function backoffDelay(attempt, { base = 200, max = 10000, factor = 2, jitter = 'full', random = Math.random } = {}) {
>   const exp = Math.min(max, base * factor ** attempt)
>   if (jitter === 'none') return exp
>   if (jitter === 'equal') return exp / 2 + (random() * exp) / 2
>   return random() * exp
> }
>
> function sleepFor(ms) {
>   return new Promise((resolve) => setTimeout(resolve, ms))
> }
>
> async function retry(fn, { retries = 3, shouldRetry = () => true, delay = (attempt) => backoffDelay(attempt), wait = sleepFor, onRetry } = {}) {
>   for (let attempt = 0; ; attempt++) {
>     try {
>       return await fn(attempt)
>     } catch (error) {
>       if (attempt >= retries || !shouldRetry(error, attempt)) throw error
>       const ms = delay(attempt, error)
>       onRetry?.(error, attempt, ms)
>       await wait(ms)
>     }
>   }
> }
>
> function composeMiddleware(middlewares, handler) {
>   return middlewares.reduceRight(
>     (next, middleware) => async (request) => middleware(request, next),
>     async (request) => handler(request),
>   )
> }
>
> function createPool(limit) {
>   if (!Number.isInteger(limit) || limit < 1) throw new RangeError('limit має бути цілим числом ≥ 1')
>   let active = 0
>   const queue = []
>
>   function next() {
>     if (active >= limit || queue.length === 0) return
>     active++
>     const { task, resolve, reject } = queue.shift()
>     let promise
>     try {
>       promise = Promise.resolve(task())
>     } catch (error) {
>       promise = Promise.reject(error)
>     }
>     promise
>       .then(resolve, reject)
>       .finally(() => {
>         active--
>         next()
>       })
>   }
>
>   return {
>     run(task) {
>       return new Promise((resolve, reject) => {
>         queue.push({ task, resolve, reject })
>         next()
>       })
>     },
>     get active() {
>       return active
>     },
>     get pending() {
>       return queue.length
>     },
>   }
> }
>
> const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'])
>
> function retryAfterMs(error) {
>   // твій код
> }
>
> function isRetryable(error, request) {
>   // твій код
> }
>
> function createClient({ baseURL, transport, timeout = 10000, retries = 2, middleware = [], concurrency = 6, wait, random = Math.random } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> const json = (status, data, headers = {}) => ({ status, headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(data) })
> const instant = async () => {}
> const baseURL = 'https://api.test/v1/'
>
> test('GET: запит, signal і розібрана відповідь', async () => {
>   const transport = vi.fn(async () => json(200, [{ id: 1 }]))
>   const api = createClient({ baseURL, transport })
>   const result = await api.get('users', { params: { page: 2 } })
>   expect(result).toEqual({ status: 200, headers: { 'content-type': 'application/json' }, data: [{ id: 1 }] })
>   const request = transport.mock.calls[0][0]
>   expect(request.url).toBe('https://api.test/v1/users?page=2')
>   expect(request.method).toBe('GET')
>   expect(request.signal).toBeInstanceOf(AbortSignal)
> })
>
> test('повтори GET: backoff з jitter і Retry-After', async () => {
>   const responses = [json(503, {}), json(429, {}, { 'retry-after': '2' }), json(200, 'ok')]
>   const transport = vi.fn(async () => responses.shift())
>   const delays = []
>   const api = createClient({ baseURL, transport, random: () => 0.5, wait: async (ms) => { delays.push(ms) } })
>   expect((await api.get('x')).data).toBe('ok')
>   expect(transport).toHaveBeenCalledTimes(3)
>   expect(delays).toEqual([100, 2000])
> })
>
> test('POST не повторюється', async () => {
>   const transport = vi.fn(async () => json(500, { error: 'boom' }))
>   const api = createClient({ baseURL, transport, wait: instant })
>   const error = await api.post('orders', { item: 1 }).catch((e) => e)
>   expect(error).toBeInstanceOf(HttpError)
>   expect(error.data).toEqual({ error: 'boom' })
>   expect(transport).toHaveBeenCalledTimes(1)
>   expect(transport.mock.calls[0][0].body).toBe('{"item":1}')
> })
>
> test('збій мережі → NetworkError, повтор і успіх', async () => {
>   let calls = 0
>   const transport = vi.fn(async () => {
>     if (++calls === 1) throw new TypeError('Failed to fetch')
>     return json(200, 1)
>   })
>   const seen = []
>   const spy = async (request, next) => {
>     try {
>       return await next(request)
>     } catch (error) {
>       seen.push(error)
>       throw error
>     }
>   }
>   const api = createClient({ baseURL, transport, wait: instant, middleware: [spy] })
>   expect((await api.get('x')).data).toBe(1)
>   expect(seen[0]).toBeInstanceOf(NetworkError)
>   expect(seen[0].cause).toBeInstanceOf(TypeError)
>   expect(isRetryable(seen[0], { method: 'POST' })).toBe(false)
> })
>
> test('таймаут на кожну спробу', async () => {
>   vi.useFakeTimers()
>   const transport = vi.fn((request) => new Promise((_, reject) => {
>     request.signal.addEventListener('abort', () => reject(request.signal.reason))
>   }))
>   const api = createClient({ baseURL, transport, timeout: 1000, retries: 1, wait: instant })
>   const result = api.get('slow').catch((e) => e)
>   vi.advanceTimersByTime(1000)
>   await sleep(0)
>   vi.advanceTimersByTime(1000)
>   const error = await result
>   expect(error).toBeInstanceOf(TimeoutError)
>   expect(transport).toHaveBeenCalledTimes(2)
> })
>
> test('middleware авторизації і пул конкурентності', async () => {
>   const pending = []
>   const transport = vi.fn((request) => new Promise((resolve) => pending.push(() => resolve(json(200, request.headers.authorization)))))
>   const auth = (request, next) => next({ ...request, headers: { ...request.headers, authorization: 'Bearer t' } })
>   const api = createClient({ baseURL, transport, concurrency: 2, middleware: [auth] })
>   const all = Promise.all([api.get('a'), api.get('b'), api.get('c')])
>   await sleep(0)
>   expect(transport).toHaveBeenCalledTimes(2)
>   pending.shift()()
>   await sleep(0)
>   expect(transport).toHaveBeenCalledTimes(3)
>   while (pending.length > 0) pending.shift()()
>   expect((await all).map((r) => r.data)).toEqual(['Bearer t', 'Bearer t', 'Bearer t'])
> })
> ```
>
> > [!hint]- Підказка 1
> > `retryAfterMs`: `const value = error?.headers?.['retry-after']`; порожнє → `null`; `Number(value)` скінченне і ≥ 0 → `* 1000`.
>
> > [!hint]- Підказка 2
> > Створи `pool = createPool(concurrency)` і `chain = composeMiddleware(middleware, send)` **один раз** у `createClient`, а не на кожен запит.
>
> > [!hint]- Підказка 3
> > `delay: (attempt, error) => retryAfterMs(error) ?? backoffDelay(attempt, { random })`. `wait` передавай як є: якщо він `undefined`, спрацює значення за замовчуванням у `retry`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class HttpClientError extends Error {
> >   constructor(message, options) {
> >     super(message, options)
> >     this.name = new.target.name
> >   }
> > }
> >
> > class NetworkError extends HttpClientError {}
> > class TimeoutError extends HttpClientError {}
> > class ParseError extends HttpClientError {}
> >
> > class HttpError extends HttpClientError {
> >   constructor(response, data, request) {
> >     super(`HTTP ${response.status} ${request.method} ${request.url}`)
> >     this.status = response.status
> >     this.headers = response.headers ?? {}
> >     this.data = data
> >     this.request = request
> >   }
> > }
> >
> > function parseBody(response) {
> >   const type = response.headers?.['content-type'] ?? ''
> >   const body = response.body ?? ''
> >   if (!type.includes('json')) return body
> >   if (body === '') return null
> >   try {
> >     return JSON.parse(body)
> >   } catch (error) {
> >     throw new ParseError('Некоректний JSON у відповіді', { cause: error })
> >   }
> > }
> >
> > function toResult(response, request) {
> >   const ok = response.status >= 200 && response.status < 300
> >   let data
> >   try {
> >     data = parseBody(response)
> >   } catch (error) {
> >     if (ok) throw error
> >     data = response.body
> >   }
> >   if (!ok) throw new HttpError(response, data, request)
> >   return { status: response.status, headers: response.headers ?? {}, data }
> > }
> >
> > function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
> >   const full = new URL(url, baseURL)
> >   for (const [key, value] of Object.entries(params)) {
> >     for (const item of [].concat(value)) {
> >       if (item !== null && item !== undefined) full.searchParams.append(key, String(item))
> >     }
> >   }
> >   const normalized = {}
> >   for (const [key, value] of Object.entries(headers)) normalized[key.toLowerCase()] = String(value)
> >   let payload = body
> >   if (json !== undefined) {
> >     payload = JSON.stringify(json)
> >     normalized['content-type'] ??= 'application/json'
> >   }
> >   normalized.accept ??= 'application/json'
> >   return { method: method.toUpperCase(), url: full.toString(), headers: normalized, body: payload }
> > }
> >
> > function withTimeout(task, ms, { signal } = {}) {
> >   if (signal?.aborted) return Promise.reject(signal.reason)
> >   const controller = new AbortController()
> >   const forwardAbort = () => controller.abort(signal.reason)
> >   signal?.addEventListener('abort', forwardAbort, { once: true })
> >
> >   return new Promise((resolve, reject) => {
> >     let timer = null
> >     const cleanup = () => {
> >       clearTimeout(timer)
> >       signal?.removeEventListener('abort', forwardAbort)
> >     }
> >     if (Number.isFinite(ms) && ms > 0) {
> >       timer = setTimeout(() => controller.abort(new TimeoutError(`Перевищено таймаут ${ms} мс`)), ms)
> >     }
> >     controller.signal.addEventListener('abort', () => {
> >       cleanup()
> >       reject(controller.signal.reason)
> >     }, { once: true })
> >
> >     let promise
> >     try {
> >       promise = Promise.resolve(task(controller.signal))
> >     } catch (error) {
> >       promise = Promise.reject(error)
> >     }
> >     promise.then(
> >       (value) => {
> >         cleanup()
> >         resolve(value)
> >       },
> >       (error) => {
> >         cleanup()
> >         reject(error)
> >       },
> >     )
> >   })
> > }
> >
> > function backoffDelay(attempt, { base = 200, max = 10000, factor = 2, jitter = 'full', random = Math.random } = {}) {
> >   const exp = Math.min(max, base * factor ** attempt)
> >   if (jitter === 'none') return exp
> >   if (jitter === 'equal') return exp / 2 + (random() * exp) / 2
> >   return random() * exp
> > }
> >
> > function sleepFor(ms) {
> >   return new Promise((resolve) => setTimeout(resolve, ms))
> > }
> >
> > async function retry(fn, { retries = 3, shouldRetry = () => true, delay = (attempt) => backoffDelay(attempt), wait = sleepFor, onRetry } = {}) {
> >   for (let attempt = 0; ; attempt++) {
> >     try {
> >       return await fn(attempt)
> >     } catch (error) {
> >       if (attempt >= retries || !shouldRetry(error, attempt)) throw error
> >       const ms = delay(attempt, error)
> >       onRetry?.(error, attempt, ms)
> >       await wait(ms)
> >     }
> >   }
> > }
> >
> > function composeMiddleware(middlewares, handler) {
> >   return middlewares.reduceRight(
> >     (next, middleware) => async (request) => middleware(request, next),
> >     async (request) => handler(request),
> >   )
> > }
> >
> > function createPool(limit) {
> >   if (!Number.isInteger(limit) || limit < 1) throw new RangeError('limit має бути цілим числом ≥ 1')
> >   let active = 0
> >   const queue = []
> >
> >   function next() {
> >     if (active >= limit || queue.length === 0) return
> >     active++
> >     const { task, resolve, reject } = queue.shift()
> >     let promise
> >     try {
> >       promise = Promise.resolve(task())
> >     } catch (error) {
> >       promise = Promise.reject(error)
> >     }
> >     promise
> >       .then(resolve, reject)
> >       .finally(() => {
> >         active--
> >         next()
> >       })
> >   }
> >
> >   return {
> >     run(task) {
> >       return new Promise((resolve, reject) => {
> >         queue.push({ task, resolve, reject })
> >         next()
> >       })
> >     },
> >     get active() {
> >       return active
> >     },
> >     get pending() {
> >       return queue.length
> >     },
> >   }
> > }
> >
> > const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'])
> >
> > function retryAfterMs(error) {
> >   const value = error?.headers?.['retry-after']
> >   if (value === undefined || value === null || value === '') return null
> >   const seconds = Number(value)
> >   return Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : null
> > }
> >
> > function isRetryable(error, request) {
> >   if (!IDEMPOTENT_METHODS.has(request.method)) return false
> >   if (error instanceof NetworkError || error instanceof TimeoutError) return true
> >   return error instanceof HttpError && (error.status === 429 || error.status >= 500)
> > }
> >
> > function createClient({ baseURL, transport, timeout = 10000, retries = 2, middleware = [], concurrency = 6, wait, random = Math.random } = {}) {
> >   const pool = createPool(concurrency)
> >
> >   async function send(request) {
> >     let response
> >     try {
> >       response = await transport(request)
> >     } catch (error) {
> >       if (request.signal?.aborted) throw request.signal.reason
> >       throw new NetworkError(`Мережева помилка: ${request.method} ${request.url}`, { cause: error })
> >     }
> >     return toResult(response, request)
> >   }
> >
> >   const chain = composeMiddleware(middleware, send)
> >
> >   function request(options) {
> >     const prepared = buildRequest(baseURL, options)
> >     return pool.run(() =>
> >       retry(
> >         () => withTimeout((signal) => chain({ ...prepared, signal }), options.timeout ?? timeout, { signal: options.signal }),
> >         {
> >           retries: options.retries ?? retries,
> >           shouldRetry: (error) => isRetryable(error, prepared),
> >           delay: (attempt, error) => retryAfterMs(error) ?? backoffDelay(attempt, { random }),
> >           wait,
> >         },
> >       ),
> >     )
> >   }
> >
> >   return {
> >     request,
> >     get: (url, options = {}) => request({ ...options, url, method: 'GET' }),
> >     delete: (url, options = {}) => request({ ...options, url, method: 'DELETE' }),
> >     post: (url, json, options = {}) => request({ ...options, url, method: 'POST', json }),
> >     put: (url, json, options = {}) => request({ ...options, url, method: 'PUT', json }),
> >   }
> > }
> > ```
> > **Чому так:** порядок шарів — свідомі рішення. Таймаут **усередині** retry: кожна спроба отримує свіжий ліміт і свіжий `AbortController`. Middleware **усередині** таймауту: інтерсептор авторизації виконується на кожній спробі (оновлений токен потрапить у повтор). Retry **усередині** пулу: логічна операція займає один слот, але й тримає його під час пауз backoff — це компроміс; альтернатива — брати слот на кожну спробу окремо. Повтор лише ідемпотентних методів — захист від подвійних списань; для `POST` у продакшні додають `Idempotency-Key`. Скасування користувачем (`AbortError`) не є ні мережевою помилкою, ні приводом для повтору.

## 🎤 На співбесіді

> [!interview] Як би ти масштабував цей клієнт для великого застосунку з десятками мікросервісів?
> level: senior · frequency: часто · id: jsp-08-int-01
>
> ---
>
> **Circuit breaker**: якщо сервіс падає N разів поспіль, «розмикаємо коло» і миттєво відповідаємо помилкою (або кешем) на T секунд, а потім пропускаємо пробний запит — це захищає і сервіс, і наш UI від хвилі таймаутів. **Retry budget**: повтори не більше X% від усіх запитів, щоб ретраї не множили навантаження під час аварії. **Дедуплікація** однакових GET у польоті (один проміс на ключ) і **HTTP-кеш** (`ETag` / `If-None-Match`). **Ідемпотентні ключі** для POST (`Idempotency-Key`) — тоді й їх можна безпечно повторювати. **Пули на хост** і пріоритети (критичний запит оплати не стоїть у черзі за аналітикою). **Спостережуваність**: middleware додає `traceparent`, міряє тривалість і статус, логує з request id. **Дедлайни**: таймаут — не на спробу, а на всю операцію з урахуванням ретраїв, і передається далі (deadline propagation).
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] · [Martin Fowler: Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html) · [Stripe: Idempotent requests](https://docs.stripe.com/api/idempotent_requests)

> [!interview] Як ретраї можуть покласти сервіс і як цього уникнути?
> level: senior · frequency: часто · id: jsp-08-int-02
>
> ---
>
> Сервіс перевантажений → відповідає повільно → клієнти ловлять таймаути → **кожен** повторює 3 рази → навантаження зростає в 4 рази саме тоді, коли сервіс найслабший («retry storm»). Якщо повтори без jitter — вони ще й приходять синхронними хвилями («thundering herd»). Ретраї в кількох шарах множаться: 3 × 3 × 3 = 27 запитів на один клік. Захист: **експоненційний backoff + full jitter**; **ліміт спроб** і retry budget; повтор лише **тимчасових** помилок (5xx, 429, мережа) і лише ідемпотентних запитів; повага до `Retry-After`; ретраї **в одному шарі** (зазвичай найближчому до клієнта); circuit breaker, що зупиняє повтори при масовій аварії; на сервері — load shedding (швидка відмова з 503 замість повільної відповіді).
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни]] · [AWS: Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) · [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

## 🧠 Закріплення

> [!question]- Навіщо окремі класи `HttpError`, `NetworkError`, `TimeoutError`, `ParseError`?
> *дуже часто · дизайн* · `jsp-08-001`
>
> Кожна вимагає різної реакції: 5xx і мережу можна повторити, 4xx — ні (крім 429); таймаут — показати «сервер довго відповідає», мережу — «перевір з'єднання»; помилку розбору — логувати як баг контракту. `instanceof` по ієрархії зі спільним предком дає чисті перевірки без парсингу повідомлень, а `cause` зберігає першопричину.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка]] · [MDN: Error.prototype.cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)

> [!question]- Чому повторюють лише ідемпотентні запити?
> *дуже часто · теорія* · `jsp-08-002`
>
> Таймаут не означає, що сервер запит не виконав, — можливо, загубилась лише відповідь. Повтор `GET`, `PUT`, `DELETE` дає той самий результат, а повтор `POST /payments` може створити другий платіж. Для неідемпотентних операцій потрібен ключ ідемпотентності, за яким сервер розпізнає дубль.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] · [MDN: Idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)

> [!question]- Що дає jitter у backoff?
> *часто · теорія* · `jsp-08-003`
>
> Розсинхронізує клієнтів. Без нього тисячі клієнтів, що отримали помилку одночасно, повторюють через рівно 200, 400, 800 мс — синхронними хвилями, які знову кладуть сервер. Full jitter (`random() * exp`) рівномірно розмазує повтори по інтервалу і, за аналізом AWS, дає найменше сумарне навантаження.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни]] · [AWS: Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

> [!question]- Чому таймаут через `AbortController`, а не `Promise.race` з таймером?
> *часто · код* · `jsp-08-004`
>
> `Promise.race` лише перестає чекати — запит продовжує висіти, займаючи з'єднання і пам'ять, а відповідь потім обробиться «в нікуди». `abort()` справді обриває `fetch`, звільняє ресурси, а `reason` переносить тип причини (`TimeoutError` проти `AbortError` користувача).
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] · [MDN: AbortSignal.timeout()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)

> [!question]- Чим `new URL('/users', 'https://api.test/v1/')` відрізняється від `new URL('users', …)`?
> *іноді · пастка* · `jsp-08-005`
>
> Шлях з `/` — абсолютний: він замінює весь шлях бази, і виходить `https://api.test/users` (без `/v1/`). Відносний `users` додається до бази: `https://api.test/v1/users`. Тому `baseURL` закінчують `/`, а шляхи запитів пишуть без нього.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] · [MDN: URL() constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)

> [!question]- Навіщо клієнту ін'єкований транспорт замість прямого `fetch`?
> *часто · дизайн* · `jsp-08-006`
>
> Уся логіка (ретраї, таймаути, помилки, пул) тестується детерміновано з фейковим транспортом і фейковим часом — без мережі й моків глобалів. Транспорт замінюється на `XMLHttpRequest` (прогрес завантаження), Node `http`, тестовий сервер чи «хаос-обгортку» для перевірки стійкості. Це той самий Adapter, що й у сховищі з розділу 1.
>
> 📚 [[JavaScript - 33. Тестування JavaScript]] · [ky](https://github.com/sindresorhus/ky)

## ⚡ Фішки

> [!reel] 🧾 Error cause — ланцюжок причин
> З ES2022 помилку можна загорнути, не втрачаючи оригінал: DevTools покаже обидва стектрейси.
>
> ```js
> throw new NetworkError('API недоступне', { cause: err })
> ```

> [!reel] ⏱️ AbortSignal.any
> `AbortSignal.any([userSignal, AbortSignal.timeout(5000)])` — один сигнал, що скасовується з будь-якої причини. Наш `withTimeout` — саме це вручну.

> [!reel] 🐘 «Thundering herd»
> Після відновлення сервера всі клієнти, що чекали, приходять одночасно — і кладуть його знову. Jitter у backoff — найдешевші ліки.

## 🖥️ Зібрати в браузері

Збережи як `http-client.html`. Транспорт — адаптер над `fetch`, ціль — публічний тестовий API JSONPlaceholder. Перемикач «Ненадійна мережа» загортає транспорт у хаос-адаптер (випадкові 503, обриви і затримки) — і в лозі видно ретраї з backoff, таймаути й чергу пулу.

```html
<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>HTTP-клієнт</title>
  <style>
    body { font: 15px system-ui, sans-serif; max-width: 760px; margin: 32px auto; }
    #log { font: 12px ui-monospace, monospace; background: #f6f6f6; padding: 12px; border-radius: 8px; height: 280px; overflow: auto; white-space: pre-wrap; }
    .ok { color: #2e7d32; } .err { color: #c62828; } .retry { color: #ef6c00; }
    li { margin: 4px 0; }
  </style>
</head>
<body>
  <h1>🛰️ HTTP-клієнт</h1>
  <p>
    <button id="load">Завантажити 8 постів (паралельність 3)</button>
    <button id="create">POST новий пост</button>
    <button id="cancel">Скасувати</button>
    <label><input type="checkbox" id="chaos" /> Ненадійна мережа</label>
  </p>
  <ol id="posts"></ol>
  <div id="log"></div>
  <script>
class HttpClientError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = new.target.name
  }
}

class NetworkError extends HttpClientError {}
class TimeoutError extends HttpClientError {}
class ParseError extends HttpClientError {}

class HttpError extends HttpClientError {
  constructor(response, data, request) {
    super(`HTTP ${response.status} ${request.method} ${request.url}`)
    this.status = response.status
    this.headers = response.headers ?? {}
    this.data = data
    this.request = request
  }
}

function parseBody(response) {
  const type = response.headers?.['content-type'] ?? ''
  const body = response.body ?? ''
  if (!type.includes('json')) return body
  if (body === '') return null
  try {
    return JSON.parse(body)
  } catch (error) {
    throw new ParseError('Некоректний JSON у відповіді', { cause: error })
  }
}

function toResult(response, request) {
  const ok = response.status >= 200 && response.status < 300
  let data
  try {
    data = parseBody(response)
  } catch (error) {
    if (ok) throw error
    data = response.body
  }
  if (!ok) throw new HttpError(response, data, request)
  return { status: response.status, headers: response.headers ?? {}, data }
}

function buildRequest(baseURL, { url, method = 'GET', params = {}, headers = {}, json, body = null } = {}) {
  const full = new URL(url, baseURL)
  for (const [key, value] of Object.entries(params)) {
    for (const item of [].concat(value)) {
      if (item !== null && item !== undefined) full.searchParams.append(key, String(item))
    }
  }
  const normalized = {}
  for (const [key, value] of Object.entries(headers)) normalized[key.toLowerCase()] = String(value)
  let payload = body
  if (json !== undefined) {
    payload = JSON.stringify(json)
    normalized['content-type'] ??= 'application/json'
  }
  normalized.accept ??= 'application/json'
  return { method: method.toUpperCase(), url: full.toString(), headers: normalized, body: payload }
}

function withTimeout(task, ms, { signal } = {}) {
  if (signal?.aborted) return Promise.reject(signal.reason)
  const controller = new AbortController()
  const forwardAbort = () => controller.abort(signal.reason)
  signal?.addEventListener('abort', forwardAbort, { once: true })

  return new Promise((resolve, reject) => {
    let timer = null
    const cleanup = () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', forwardAbort)
    }
    if (Number.isFinite(ms) && ms > 0) {
      timer = setTimeout(() => controller.abort(new TimeoutError(`Перевищено таймаут ${ms} мс`)), ms)
    }
    controller.signal.addEventListener('abort', () => {
      cleanup()
      reject(controller.signal.reason)
    }, { once: true })

    let promise
    try {
      promise = Promise.resolve(task(controller.signal))
    } catch (error) {
      promise = Promise.reject(error)
    }
    promise.then(
      (value) => {
        cleanup()
        resolve(value)
      },
      (error) => {
        cleanup()
        reject(error)
      },
    )
  })
}

function backoffDelay(attempt, { base = 200, max = 10000, factor = 2, jitter = 'full', random = Math.random } = {}) {
  const exp = Math.min(max, base * factor ** attempt)
  if (jitter === 'none') return exp
  if (jitter === 'equal') return exp / 2 + (random() * exp) / 2
  return random() * exp
}

function sleepFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function retry(fn, { retries = 3, shouldRetry = () => true, delay = (attempt) => backoffDelay(attempt), wait = sleepFor, onRetry } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn(attempt)
    } catch (error) {
      if (attempt >= retries || !shouldRetry(error, attempt)) throw error
      const ms = delay(attempt, error)
      onRetry?.(error, attempt, ms)
      await wait(ms)
    }
  }
}

function composeMiddleware(middlewares, handler) {
  return middlewares.reduceRight(
    (next, middleware) => async (request) => middleware(request, next),
    async (request) => handler(request),
  )
}

function createPool(limit) {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError('limit має бути цілим числом ≥ 1')
  let active = 0
  const queue = []

  function next() {
    if (active >= limit || queue.length === 0) return
    active++
    const { task, resolve, reject } = queue.shift()
    let promise
    try {
      promise = Promise.resolve(task())
    } catch (error) {
      promise = Promise.reject(error)
    }
    promise
      .then(resolve, reject)
      .finally(() => {
        active--
        next()
      })
  }

  return {
    run(task) {
      return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject })
        next()
      })
    },
    get active() {
      return active
    },
    get pending() {
      return queue.length
    },
  }
}

const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'])

function retryAfterMs(error) {
  const value = error?.headers?.['retry-after']
  if (value === undefined || value === null || value === '') return null
  const seconds = Number(value)
  return Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : null
}

function isRetryable(error, request) {
  if (!IDEMPOTENT_METHODS.has(request.method)) return false
  if (error instanceof NetworkError || error instanceof TimeoutError) return true
  return error instanceof HttpError && (error.status === 429 || error.status >= 500)
}

function createClient({ baseURL, transport, timeout = 10000, retries = 2, middleware = [], concurrency = 6, wait, random = Math.random } = {}) {
  const pool = createPool(concurrency)

  async function send(request) {
    let response
    try {
      response = await transport(request)
    } catch (error) {
      if (request.signal?.aborted) throw request.signal.reason
      throw new NetworkError(`Мережева помилка: ${request.method} ${request.url}`, { cause: error })
    }
    return toResult(response, request)
  }

  const chain = composeMiddleware(middleware, send)

  function request(options) {
    const prepared = buildRequest(baseURL, options)
    return pool.run(() =>
      retry(
        () => withTimeout((signal) => chain({ ...prepared, signal }), options.timeout ?? timeout, { signal: options.signal }),
        {
          retries: options.retries ?? retries,
          shouldRetry: (error) => isRetryable(error, prepared),
          delay: (attempt, error) => retryAfterMs(error) ?? backoffDelay(attempt, { random }),
          wait,
        },
      ),
    )
  }

  return {
    request,
    get: (url, options = {}) => request({ ...options, url, method: 'GET' }),
    delete: (url, options = {}) => request({ ...options, url, method: 'DELETE' }),
    post: (url, json, options = {}) => request({ ...options, url, method: 'POST', json }),
    put: (url, json, options = {}) => request({ ...options, url, method: 'PUT', json }),
  }
}

    // ---------- журнал
    const logBox = document.getElementById('log')
    function log(text, className = '') {
      const line = Object.assign(document.createElement('div'), { textContent: `${new Date().toLocaleTimeString()} ${text}`, className })
      logBox.prepend(line)
    }

    // ---------- транспорт: адаптер над fetch
    async function fetchTransport({ method, url, headers, body, signal }) {
      const res = await fetch(url, { method, headers, body, signal })
      return { status: res.status, headers: Object.fromEntries(res.headers), body: await res.text() }
    }

    // ---------- хаос-адаптер: той самий інтерфейс, випадкові збої
    function chaos(transport) {
      return async (request) => {
        const roll = Math.random()
        if (roll < 0.2) throw new TypeError('Failed to fetch (хаос)')
        if (roll < 0.4) return { status: 503, headers: { 'content-type': 'application/json' }, body: '{"error":"overloaded"}' }
        if (roll < 0.5) await new Promise((r, reject) => {
          const t = setTimeout(r, 4000)
          request.signal?.addEventListener('abort', () => { clearTimeout(t); reject(request.signal.reason) })
        })
        return transport(request)
      }
    }

    const chaosBox = document.getElementById('chaos')
    const transport = (request) => (chaosBox.checked ? chaos(fetchTransport) : fetchTransport)(request)

    // ---------- middleware: логер з тривалістю
    const logger = async (request, next) => {
      const started = performance.now()
      log(`→ ${request.method} ${request.url}`)
      try {
        const result = await next(request)
        log(`← ${result.status} ${request.method} ${request.url} (${Math.round(performance.now() - started)} мс)`, 'ok')
        return result
      } catch (error) {
        log(`✕ ${error.name}: ${error.message}`, 'err')
        throw error
      }
    }

    const api = createClient({
      baseURL: 'https://jsonplaceholder.typicode.com/',
      transport,
      timeout: 2500,
      retries: 3,
      concurrency: 3,
      middleware: [logger],
      wait: (ms) => {
        log(`… повтор через ${Math.round(ms)} мс`, 'retry')
        return new Promise((resolve) => setTimeout(resolve, ms))
      },
    })

    // ---------- UI
    let controller = new AbortController()
    document.getElementById('cancel').addEventListener('click', () => {
      controller.abort()
      controller = new AbortController()
      log('Скасовано користувачем', 'err')
    })

    document.getElementById('load').addEventListener('click', async () => {
      const list = document.getElementById('posts')
      list.replaceChildren()
      const ids = [1, 2, 3, 4, 5, 6, 7, 8]
      const results = await Promise.allSettled(ids.map((id) => api.get(`posts/${id}`, { signal: controller.signal })))
      results.forEach((result, i) => {
        const li = document.createElement('li')
        if (result.status === 'fulfilled') li.textContent = result.value.data.title
        else {
          li.textContent = `#${ids[i]}: ${result.reason.name} — ${result.reason.message}`
          li.className = 'err'
        }
        list.append(li)
      })
    })

    document.getElementById('create').addEventListener('click', async () => {
      try {
        const { status, data } = await api.post('posts', { title: 'Привіт', body: 'з власного клієнта', userId: 1 }, { signal: controller.signal })
        log(`POST створив пост id=${data.id} (статус ${status}); POST не повторюється при збоях`, 'ok')
      } catch (error) {
        log(`POST не вдався: ${error.name} (без ретраїв — неідемпотентний)`, 'err')
      }
    })
  </script>
</body>
</html>
```

> [!tip] Експеримент
> Увімкни «Ненадійна мережа» і натисни «Завантажити». У лозі видно: 503 і `NetworkError` повторюються з різними паузами (jitter), довгі запити обриваються `TimeoutError` через 2,5 с, а одночасно в польоті — не більше трьох. Натисни «POST» кілька разів — при збоях він **не** повторюється.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Fetch](https://javascript.info/fetch) — основи `fetch`, `Response`, заголовки
- 🟢 [MDN — Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok) — чому 404 не відхиляє проміс
- 🟡 [MDN — AbortSignal.timeout()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) — вбудований таймаут-сигнал
- 🟡 [MDN — Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After) — як сервер підказує паузу
- 🟡 [AWS Architecture Blog — Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) — симуляції, чому full jitter
- 🟡 [axios — Interceptors](https://axios-http.com/docs/interceptors) — альтернативна модель інтерсепторів
- 🛠️ [ky](https://github.com/sindresorhus/ky) — крихітний клієнт над `fetch` з ретраями, таймаутами і хуками
- 🛠️ [p-limit](https://github.com/sindresorhus/p-limit) — пул конкурентності з нашого кроку 6

> [!important] Підсумок
> - Типізовані помилки зі спільним предком і `cause` — основа правильних рішень вище за стеком.
> - Таймаут — через `AbortController` (справжнє скасування), з причиною в `reason`.
> - Ретраї: лише ідемпотентні методи й тимчасові помилки; backoff + full jitter; поважати `Retry-After`.
> - Middleware «цибулею» — для наскрізних речей; пул — щоб не задушити сервер.
> - Порядок шарів (пул → retry → таймаут → middleware → транспорт) і є архітектура; транспорт — ін'єкція.
