---
title: "Асинхронність: Promise та async/await"
order: 5
tags: [async, promises, async-await, cancellation, error-handling]
estimatedMinutes: 75
---

# JS Interview Q&A — 05. Асинхронність: Promise та async/await

## 🟢 Junior

> [!question]- Що таке callback і чому виникає callback hell?
> *дуже часто · теорія* · `js-05-001`
>
> **Callback** — функція, яку передають іншій функції, щоб та викликала її пізніше, наприклад після завершення I/O. До Promise це був основний спосіб писати асинхронний код; у Node усталилася конвенція **error-first**: перший аргумент — помилка або `null`.
>
> Callback hell виникає, коли кожен крок залежить від попереднього: код росте вправо, обробку помилок треба дублювати на кожному рівні, а композиція (паралельно, з таймаутом, з повтором) пишеться вручну.
>
> ```js
> readConfig('app.json', (err, config) => {
>   if (err) return done(err);
>   connect(config.db, (err, db) => {
>     if (err) return done(err);
>     db.query('SELECT 1', (err, rows) => done(err, rows));
>   });
> });
> ```
>
> **На співбесіді:** головна проблема не у відступах, а в inversion of control — ви довіряєте чужій функції, що вона викличе ваш callback рівно один раз, асинхронно і з правильними аргументами. Promise цю довіру формалізує.
>
> 📚 [[JavaScript - 09. Promise#Навіщо: callback hell та inversion of control|Розділ: навіщо проміси]] · [MDN: Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) · [javascript.info: Introduction: callbacks](https://javascript.info/callbacks)

> [!question]- У яких станах може бути Promise?
> *дуже часто · теорія* · `js-05-002`
>
> Promise має три стани: `pending` (очікування), `fulfilled` (виконано зі значенням) і `rejected` (відхилено з причиною). Fulfilled і rejected разом називають **settled**. Перехід із pending відбувається рівно один раз, після цього стан і значення незмінні — наступні виклики `resolve`/`reject` ігноруються.
>
> Executor (функція в `new Promise(...)`) виконується синхронно, одразу під час створення.
>
> ```js
> const p = new Promise((resolve, reject) => {
>   console.log('executor');   // виводиться синхронно
>   resolve(1);
>   reject(new Error('nope')); // ігнорується
>   resolve(2);                // ігнорується
> });
> p.then(v => console.log(v)); // 1
> ```
>
> **На співбесіді:** "resolved" не дорівнює "fulfilled". Проміс, розв'язаний іншим промісом, лишається pending і "прив'язаний" до його долі — якщо той відхилиться, відхилиться і цей.
>
> 📚 [[JavaScript - 09. Promise#Стани та долі|Розділ: стани та долі]] · [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) · [Domenic Denicola: States and Fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md)

> [!question]- Що повертає `.then()` і як працює ланцюжок промісів?
> *дуже часто · код* · `js-05-003`
>
> `.then()` завжди повертає **новий** проміс, чия доля залежить від того, що зробив обробник:
> - повернув значення — новий проміс fulfilled з цим значенням;
> - повернув проміс або thenable — новий проміс чекає на нього і переймає його стан;
> - кинув помилку — новий проміс rejected;
> - нічого не повернув — fulfilled з `undefined`.
>
> Обробники завжди викликаються асинхронно (як microtask), навіть якщо проміс уже виконаний.
>
> ```js
> fetchUser()
>   .then(user => user.id)          // значення
>   .then(id => fetchOrders(id))    // проміс — ланцюжок його дочекається
>   .then(orders => console.log(orders.length))
>   .catch(err => console.error(err));
> ```
>
> **На співбесіді:** типова помилка — фігурні дужки без `return`: `.then(id => { fetchOrders(id); })`. Наступний `.then` отримає `undefined` і не чекатиме на запит, а його помилка стане unhandled rejection.
>
> 📚 [[JavaScript - 09. Promise#Ланцюжки: then, catch, finally|Розділ: ланцюжки]] · [MDN: Promise.prototype.then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) · [javascript.info: Promises chaining](https://javascript.info/promise-chaining)

> [!question]- Як працюють `.catch()` і `.finally()`?
> *дуже часто · код* · `js-05-004`
>
> `.catch(fn)` — це `.then(undefined, fn)`: ловить відхилення всього, що вище в ланцюжку, і повертає новий проміс. Якщо обробник повернув значення, ланцюжок **відновлюється** і йде далі як fulfilled.
>
> `.finally(fn)` викликається в обох випадках і не отримує аргументів. Він прозорий: пропускає далі початкове значення або причину відхилення, а те, що він повернув, ігнорується. Винятки: якщо `fn` кинув помилку або повернув відхилений проміс — ланцюжок відхиляється з цією помилкою. Якщо `fn` повернув проміс, `finally` на нього чекає.
>
> ```js
> Promise.reject(new Error('boom'))
>   .catch(() => 'fallback')
>   .finally(() => 'ignored')
>   .then(v => console.log(v)); // 'fallback'
> ```
>
> **На співбесіді:** `finally` — місце для cleanup (сховати спінер, закрити з'єднання), а не для зміни результату.
>
> 📚 [[JavaScript - 09. Promise#Ланцюжки: then, catch, finally|Розділ: catch і finally]] · [MDN: Promise.prototype.catch()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) · [MDN: Promise.prototype.finally()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)

> [!question]- Що таке async/await і що повертає async-функція?
> *дуже часто · теорія* · `js-05-005`
>
> `async`/`await` — синтаксис над промісами. Async-функція **завжди повертає Promise**: `return x` робить його fulfilled з `x`, `throw` — rejected. `await` призупиняє виконання лише цієї функції (не потоку і не event loop), доки проміс не стане settled; продовження запускається як microtask. `await` на не-промісі просто обгортає значення.
>
> ```js
> async function getUserName(id) {
>   const res = await fetch(`/api/users/${id}`);
>   if (!res.ok) throw new Error(`HTTP ${res.status}`);
>   const user = await res.json();
>   return user.name;
> }
>
> getUserName(1).then(console.log); // результат — завжди Promise
> ```
>
> **На співбесіді:** `fetch` не відхиляє проміс на 404 чи 500 — лише на мережеві помилки й abort, тому `res.ok` треба перевіряти вручну.
>
> 📚 [[JavaScript - 10. async і await#async-функція завжди повертає проміс|Розділ: async-функції]] · [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) · [javascript.info: Async/await](https://javascript.info/async-await)

> [!question]- Як обробляти помилки в async-коді: `try/catch` чи `.catch()`?
> *часто · порівняння* · `js-05-006`
>
> Обидва способи рівноцінні за можливостями, різниця — у тому, де ви обробляєте помилку. `try/catch` усередині async-функції ловить синхронні винятки й відхилення промісів, на які зроблено `await`. `.catch()` зручний для точкової обробки одного виклику або на місці виклику функції.
>
> ```js
> async function loadProfile(id) {
>   try {
>     return await fetchProfile(id); // без await відхилення проскочить повз catch
>   } catch (err) {
>     log(err);
>     return null;
>   }
> }
>
> async function loadSettings() {
>   const settings = await fetchSettings().catch(() => DEFAULT_SETTINGS);
>   return settings;
> }
> ```
>
> **На співбесіді:** `try/catch` не ловить помилки промісів, на які немає `await` — `return promise` без `await` у `try` чи виклик "fire-and-forget". Звідси правило лінтера `return-await: in-try-catch`.
>
> 📚 [[JavaScript - 10. async і await#Обробка помилок|Розділ: обробка помилок]] · [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) · [javascript.info: Error handling with promises](https://javascript.info/promise-error-handling)

> [!question]- Чому `forEach` не чекає на `await` і що використати замість нього?
> *часто · код* · `js-05-007`
>
> `forEach` ігнорує значення, яке повертає callback. Async-callback повертає проміс, тож `forEach` запускає всі ітерації майже одночасно і завершується одразу, нікого не чекаючи. Помилки з цих промісів ніхто не обробляє — вони стають unhandled rejections.
>
> ```js
> items.forEach(async item => { await save(item); });
> console.log('done'); // виведеться до збереження
>
> for (const item of items) {
>   await save(item);                                // послідовно
> }
> await Promise.all(items.map(item => save(item)));  // паралельно
> ```
>
> Вибір: `for...of` — коли порядок важливий або треба не перевантажити сервер; `Promise.all(map)` — коли операції незалежні.
>
> **На співбесіді:** та сама пастка з `filter`: async-предикат повертає проміс, а він завжди truthy, тож `arr.filter(async x => ...)` не відфільтрує нічого.
>
> 📚 [[JavaScript - 10. async і await#Класична помилка: forEach + async|Розділ: forEach + async]] · [MDN: Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) · [MDN: for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)

## 🟡 Middle

> [!question]- Чим відрізняються `Promise.all`, `allSettled`, `race` та `any`?
> *дуже часто · порівняння* · `js-05-008`
>
> Усі чотири приймають iterable і повертають один проміс, але по-різному "збирають" результат:
> - `Promise.all` — масив значень у порядку вхідних даних; відхиляється при **першому** ж відхиленні (fail-fast). Порожній вхід — `[]`.
> - `Promise.allSettled` — чекає на всі й ніколи не відхиляється; повертає `{ status, value }` або `{ status, reason }`.
> - `Promise.race` — стан першого settled (успіх чи помилка). Порожній вхід — pending назавжди.
> - `Promise.any` — перший fulfilled; якщо всі відхилені — `AggregateError` з полем `errors`. Порожній вхід — одразу `AggregateError`.
>
> ```js
> const results = await Promise.allSettled([loadA(), loadB(), loadC()]);
> const errors = results
>   .filter(r => r.status === 'rejected')
>   .map(r => r.reason);
> ```
>
> **На співбесіді:** жоден із них нічого не скасовує. Після fail-fast у `all` чи перемоги в `race` решта операцій продовжує виконуватися — для реального скасування потрібен `AbortSignal`.
>
> 📚 [[JavaScript - 09. Promise#Комбінатори: all, allSettled, race, any|Розділ: комбінатори]] · [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) · [javascript.info: Promise API](https://javascript.info/promise-api)

> [!question]- Як правильно робити незалежні `await` паралельно, а не послідовно?
> *дуже часто · код* · `js-05-009`
>
> `await` одразу за викликом робить операції послідовними: друга починається лише після першої — це **waterfall**, час сумується. Якщо операції незалежні, їх треба запустити разом і чекати на сукупний результат.
>
> ```js
> // послідовно: t(user) + t(posts)
> const user = await getUser(id);
> const posts = await getPosts(id);
>
> // паралельно: max(t(user), t(posts))
> const [user2, posts2] = await Promise.all([getUser(id), getPosts(id)]);
> ```
>
> Проміжний варіант `const a = getA(); const b = getB(); await a; await b;` теж паралельний, але небезпечний: якщо `b` відхилиться, поки ми чекаємо на `a`, у `b` ще немає обробника. У браузері це дасть `unhandledrejection`, а в Node за замовчуванням процес завершиться, ще до того як виконання дійде до `await b`.
>
> **На співбесіді:** варто згадати, що паралелізм не безкоштовний — сотні одночасних запитів вдаряться в rate limit. Тоді потрібне обмеження конкурентності, а не голий `Promise.all`.
>
> 📚 [[JavaScript - 10. async і await#Послідовно чи паралельно|Розділ: послідовно чи паралельно]] · [MDN: Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) · [javascript.info: Async/await](https://javascript.info/async-await)

> [!question]- Як поширюються помилки в ланцюжку промісів?
> *часто · код* · `js-05-010`
>
> Відхилення "пролітає" повз усі `onFulfilled`-обробники до найближчого `onRejected` (`.catch` або другий аргумент `.then`). Обробник або **відновлює** ланцюжок (повертає значення), або прокидає помилку далі (`throw`). Важливо: `then(onOk, onErr)` — `onErr` не ловить помилки, кинуті в `onOk` того самого `then`.
>
> ```js
> step1()
>   .then(step2)             // пропускається, якщо step1 відхилився
>   .then(step3, handleEarly) // handleEarly не зловить помилку з step3
>   .catch(err => {
>     if (!(err instanceof NetworkError)) throw err; // прокидаємо далі
>     return cachedValue;                            // відновлюємося
>   });
> ```
>
> Обгортаючи помилку, зберігайте першопричину: `throw new Error('Failed to load order', { cause: err })` (ES2022). Відхиляйте проміси лише екземплярами `Error` — рядок не має стеку.
>
> **На співбесіді:** `.catch` посередині ланцюжка, який лише логує й нічого не повертає, "ковтає" помилку: далі піде fulfilled з `undefined`, і код нижче впаде вже з незрозумілою помилкою.
>
> 📚 [[JavaScript - 09. Promise#Помилки: як rejection тече ланцюжком|Розділ: помилки в ланцюжку]] · [MDN: Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) · [javascript.info: Error handling with promises](https://javascript.info/promise-error-handling)

> [!question]- Що таке unhandled rejection і як на нього реагують браузер та Node.js?
> *часто · теорія* · `js-05-011`
>
> Unhandled rejection — відхилений проміс, до якого на момент перевірки (після спорожнення черги microtasks) не приєднано жодного обробника відхилення.
>
> - **Браузер:** подія `unhandledrejection` на `window`, помилка в консолі, сторінка продовжує працювати. Якщо обробник з'явиться пізніше — подія `rejectionhandled`.
> - **Node.js 15+:** режим за замовчуванням `--unhandled-rejections=throw`. Спершу генерується `process.on('unhandledRejection')`; якщо слухача немає, помилка стає uncaught exception і процес завершується з кодом 1.
>
> ```js
> // Node
> process.on('unhandledRejection', (reason) => {
>   logger.fatal({ reason }, 'unhandled rejection');
>   process.exitCode = 1;
> });
>
> // Браузер
> window.addEventListener('unhandledrejection', (event) => {
>   reportError(event.reason);
> });
> ```
>
> Типові причини: виклик async-функції без `await`/`.catch`, забутий `return` у `.then`, проміс створено заздалегідь, а `await` зроблено пізніше.
>
> **На співбесіді:** глобальний обробник — для логування й алертів, а не для "відновлення". Після невідомої помилки стан процесу непередбачуваний; краще впасти й перезапуститися через оркестратор.
>
> 📚 [[JavaScript - 09. Promise#Unhandled rejections|Розділ: unhandled rejections]] · [MDN: unhandledrejection event](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event) · [Node.js: unhandledRejection](https://nodejs.org/api/process.html#event-unhandledrejection)

> [!question]- Як скасувати `fetch` і задати таймаут через `AbortController`?
> *часто · практика* · `js-05-012`
>
> `AbortController` створює `signal`, який передають в операцію; `controller.abort(reason)` переводить сигнал у стан aborted і генерує подію `abort`, а `fetch` відхиляється з `signal.reason` (за замовчуванням `DOMException` з `name === 'AbortError'`).
>
> - `AbortSignal.timeout(ms)` — сигнал, що сам спрацює з `TimeoutError`.
> - `AbortSignal.any([...])` — об'єднує кілька сигналів: спрацьовує, коли спрацював будь-який (Node 20.3+, усі сучасні браузери).
>
> ```js
> async function loadReport(url, userSignal) {
>   const signal = AbortSignal.any([userSignal, AbortSignal.timeout(5000)]);
>   try {
>     const res = await fetch(url, { signal });
>     return await res.json();
>   } catch (err) {
>     if (err.name === 'TimeoutError') throw new Error('Report timed out', { cause: err });
>     throw err; // AbortError прокидаємо як є
>   }
> }
>
> const controller = new AbortController();
> loadReport('/api/report', controller.signal);
> controller.abort(); // наприклад, при закритті сторінки
> ```
>
> Сигнал одноразовий: для кожної нової операції — новий `AbortController`. Abort діє і під час читання тіла (`res.json()`).
>
> **На співбесіді:** скасування на клієнті не означає, що сервер не обробив запит. Для мутацій abort — лише "перестати чекати".
>
> 📚 [[JavaScript - 10. async і await#Скасування: AbortController|Розділ: скасування]] · [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) · [MDN: AbortSignal.timeout()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)

> [!question]- Що таке thenable і як `Promise` розгортає такі значення?
> *іноді · теорія* · `js-05-013`
>
> **Thenable** — будь-який об'єкт чи функція з методом `then`. Коли проміс розв'язують thenable-значенням (через `resolve(x)`, `return x` з `.then` чи async-функції, `await x`), спрацьовує Promise Resolution Procedure: рушій асинхронно (окремою microtask `NewPromiseResolveThenableJob`) викликає `x.then(resolve, reject)` і переймає результат. Саме так сумісні проміси різних бібліотек і нативні.
>
> ```js
> const thenable = {
>   then(resolve) {
>     setTimeout(() => resolve(42), 10);
>   },
> };
>
> Promise.resolve(thenable).then(v => console.log(v)); // 42
> ```
>
> Нюанси:
> - `Promise.resolve(nativePromise)` повертає той самий об'єкт, а thenable — обгортає в новий проміс.
> - Розв'язання промісу самим собою дає `TypeError`.
> - Випадковий thenable — пастка: query builder'и (Knex, Mongoose Query) є thenable, і `await` запускає запит; модуль, що експортує `then`, ламає `await import()`.
>
> **На співбесіді:** кожен рівень thenable додає зайві microtask-тіки, що впливає на порядок виконання в "що виведе код" задачах.
>
> 📚 [[JavaScript - 09. Promise#Thenables і ціна «повернути проміс»|Розділ: thenables]] · [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) · [Spec: NewPromiseResolveThenableJob](https://tc39.es/ecma262/#sec-newpromiseresolvethenablejob)

> [!question]- Що таке `Promise.withResolvers()` і коли він корисний?
> *іноді · код* · `js-05-014`
>
> `Promise.withResolvers()` (ES2024; Node 22, усі сучасні браузери) повертає `{ promise, resolve, reject }`. Це стандартна заміна патерну **deferred**, коли функції резолву витягали з executor у зовнішні змінні. Корисний, коли проміс завершується з іншого місця коду — з обробника події, з черги, з відповіді по WebSocket.
>
> ```js
> const pending = new Map();
>
> function rpc(ws, method, params) {
>   const id = crypto.randomUUID();
>   const { promise, resolve, reject } = Promise.withResolvers();
>   pending.set(id, { resolve, reject });
>   ws.send(JSON.stringify({ id, method, params }));
>   return promise;
> }
>
> ws.addEventListener('message', (event) => {
>   const { id, result, error } = JSON.parse(event.data);
>   const entry = pending.get(id);
>   if (!entry) return;
>   pending.delete(id);
>   error ? entry.reject(new Error(error)) : entry.resolve(result);
> });
> ```
>
> Раніше те саме писали вручну: `let resolve; const p = new Promise(r => { resolve = r; });`. Це працює, але змінні оголошені окремо від промісу, а TypeScript вимагає `!` чи зайвих типів.
>
> **На співбесіді:** такі проміси легко "загубити" — якщо відповідь не прийде, запис у `Map` і всі, хто чекає, висітимуть вічно. Потрібні таймаут і очищення при закритті з'єднання.
>
> 📚 [[JavaScript - 09. Promise#Стани та долі|Розділ: стани та долі]] · [MDN: Promise.withResolvers()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers) · [MDN: Promise() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise)

> [!question]- Як працює `for await...of` і що таке async iterator?
> *іноді · код* · `js-05-015`
>
> Async iterable — об'єкт із методом `[Symbol.asyncIterator]()`, чий `next()` повертає проміс `{ value, done }`. `for await...of` на кожному кроці чекає на цей проміс. Найпростіше джерело — **async generator** (`async function*`). Async iterable є Node streams і `ReadableStream` (у Node та більшості браузерів).
>
> ```js
> async function* paginate(url) {
>   while (url) {
>     const res = await fetch(url);
>     const page = await res.json();
>     yield* page.items;
>     url = page.next;
>   }
> }
>
> for await (const item of paginate('/api/items')) {
>   if (item.id === targetId) break; // генератор отримає return(), наступна сторінка не завантажиться
> }
> ```
>
> `for await` працює і зі звичайними iterable промісів, чекаючи на кожен по черзі. Але `for await (const x of arrayOfPromises)` — пастка: якщо пізніший проміс відхилиться раніше, ніж цикл до нього дійде, він буде unhandled.
>
> **На співбесіді:** це природний механізм backpressure — наступна порція не запитується, поки споживач не обробив поточну.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Async-ітератори та async-генератори|Розділ: async-ітератори]] · [MDN: for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) · [javascript.info: Async iteration and generators](https://javascript.info/async-iterators-generators)

## 🔴 Senior

> [!question]- На що "розгортається" `async/await` і скільки microtask-тіків коштує `await`?
> *іноді · теорія* · `js-05-016`
>
> Концептуально async-функція — це генератор плюс runner: кожен `await x` — це `yield`, а runner підписується на `Promise.resolve(x)` і продовжує генератор через `next(value)` або `throw(err)`. Саме так працювали Babel/TypeScript-трансформації (`__awaiter`, `co`).
>
> ```js
> function run(genFn, ...args) {
>   return new Promise((resolve, reject) => {
>     const gen = genFn(...args);
>     const step = (method, arg) => {
>       let r;
>       try { r = gen[method](arg); } catch (e) { return reject(e); }
>       if (r.done) return resolve(r.value);
>       Promise.resolve(r.value).then(v => step('next', v), e => step('throw', e));
>     };
>     step('next');
>   });
> }
> ```
>
> Вартість у тіках (сучасна специфікація, V8 7.2+):
> - `await nativePromise` — **1 тік** (раніше було 3; оптимізацію внесли в стандарт у 2019);
> - `await thenable` — +1 тік на `NewPromiseResolveThenableJob`;
> - `return promise` з async-функції — +2 тіки, тому `return await promise` насправді на тік швидший.
>
> Ці числа пояснюють "дивні" відповіді в задачах на порядок виводу, але будувати на них логіку не можна — вони залежать від форми коду й можуть змінитися разом зі специфікацією.
>
> **На співбесіді:** практично важливіше інше — V8 будує **async stack traces** (рядки `at async fn`) лише для ланцюжків `await`. У ланцюжку `.then()` стек після першої асинхронної межі губиться, тому для діагностики `await` кращий.
>
> 📚 [[JavaScript - 10. async і await#await: пауза + продовження як microtask|Розділ: await під капотом]] · [V8: Faster async functions and promises](https://v8.dev/blog/fast-async) · [Spec: Await](https://tc39.es/ecma262/#await)

> [!question]- Як реалізувати retry з exponential backoff і jitter і що саме можна повторювати?
> *часто · практика* · `js-05-017`
>
> Затримка росте експоненційно (`base * 2 ** attempt`), обмежена `cap`, і рандомізується. Без **jitter** тисячі клієнтів, що впали одночасно, повторюють запити синхронно й знову "кладуть" сервіс (thundering herd). "Full jitter" — `random(0, min(cap, base * 2 ** n))` — найкраще розмазує навантаження.
>
> ```js
> import { setTimeout as sleep } from 'node:timers/promises';
>
> async function withRetry(fn, { retries = 4, base = 200, cap = 10_000, signal } = {}) {
>   for (let attempt = 0; ; attempt++) {
>     try {
>       return await fn(attempt);
>     } catch (err) {
>       if (attempt >= retries || !isTransient(err)) throw err;
>       const delay = Math.random() * Math.min(cap, base * 2 ** attempt);
>       await sleep(delay, undefined, { signal });
>     }
>   }
> }
> ```
>
> Що повторювати:
> - лише тимчасові збої: мережеві помилки, таймаути, 408, 429, 502, 503, 504; не 400/401/403/404/422;
> - лише **ідемпотентні** операції, або POST з `Idempotency-Key`, інакше отримаєте подвійне списання;
> - поважати `Retry-After` для 429/503;
> - обмежувати не лише кількість спроб, а й загальний дедлайн операції, щоб користувач не чекав хвилину.
>
> **На співбесіді:** згадайте retry amplification — якщо три шари сервісів роблять по 3 спроби, одна помилка внизу дає до 27 запитів. Повтори робить один шар, плюс є retry budget або circuit breaker, щоб не добивати сервіс, який уже лежить.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Retry з експоненційним backoff і jitter|Розділ: retry і backoff]] · [MDN: Idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent) · [AWS: Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

> [!question]- Як обмежити кількість одночасних async-операцій і чому не варто робити `Promise.all` на 10 000 запитів?
> *часто · практика* · `js-05-018`
>
> `Promise.all(urls.map(fetch))` запускає все одразу: вичерпуються сокети й файлові дескриптори (`EMFILE`), API відповідає 429, росте пам'ять під тисячі відкритих відповідей, а латентність кожного запиту погіршується. Потрібен **concurrency limit**: не більше N операцій у польоті.
>
> Два підходи:
> - **limiter** (ідея `p-limit`) — обгортка з чергою, яка стартує задачу, коли звільнився слот; зручно, коли задачі приходять з різних місць;
> - **пул воркерів** — N async-циклів, що тягнуть елементи зі спільного ітератора; простіше і не створює 10 000 промісів наперед.
>
> ```js
> async function mapPool(items, limit, fn) {
>   const results = new Array(items.length);
>   const entries = items.entries();
>   const worker = async () => {
>     for (const [i, item] of entries) results[i] = await fn(item, i);
>   };
>   const size = Math.min(limit, items.length);
>   await Promise.all(Array.from({ length: size }, worker));
>   return results;
> }
> ```
>
> Спільний ітератор гарантує, що кожен елемент візьме рівно один воркер.
>
> **На співбесіді:** обговоріть поведінку при помилці. Тут `Promise.all` відхилиться одразу, але інші воркери продовжать брати елементи; для зупинки потрібен спільний `AbortController`. Ліміт варто тримати на рівні ресурсу (пул з'єднань до хоста), а не лише локально у функції.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Обмеження конкурентності: пул|Розділ: пул конкурентності]] · [MDN: Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) · [MDN: Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

> [!question]- Як top-level await впливає на граф модулів і коли він небезпечний?
> *іноді · теорія* · `js-05-019`
>
> Top-level await (ES2022) доступний лише в ES-модулях. Модуль із TLA стає асинхронним: його виконання, а також виконання всіх модулів, що його (транзитивно) імпортують, чекає на завершення `await`. Незалежні гілки графа виконуються далі.
>
> ```js
> // config.js
> const res = await fetch('/config.json');
> export const config = await res.json();
>
> // app.js — не почне виконуватися, доки config.js не завершиться
> import { config } from './config.js';
> ```
>
> Ризики:
> - повільний мережевий запит у TLA блокує старт застосунку, і це не видно з місця імпорту — прихований waterfall;
> - відхилення в TLA ламає імпорт модуля для всіх, хто від нього залежить;
> - `await import()` модуля, який сам транзитивно імпортує поточний, зависне назавжди (deadlock);
> - у Node 22+ `require()` ES-модуля, чий граф містить TLA, кидає `ERR_REQUIRE_ASYNC_MODULE`.
>
> Доречно: CLI-скрипти, ініціалізація WASM, умовний `await import()` з fallback, конфіг, без якого застосунок однаково не працює.
>
> **На співбесіді:** у бібліотеках TLA майже завжди погана ідея — ви змушуєте всіх споживачів чекати й ламаєте сумісність з CommonJS. Краще експортувати `init()` або lazy-getter.
>
> 📚 [[JavaScript - 10. async і await#Top-level await і for await|Розділ: top-level await]] · [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) · [V8: Top-level await](https://v8.dev/features/top-level-await)

> [!question]- Чому Promise не можна скасувати і як правильно будувати скасування та захист від stale-відповідей?
> *часто · практика* · `js-05-020`
>
> Promise — це значення майбутнього результату, а не сама операція; у нього немає доступу до того, що його виконує. Тому скасування в JS **кооперативне**: `AbortSignal` передається вниз через усі шари, і кожен шар сам вирішує, як зупинитися.
>
> Класичний баг — race condition у пошуку: відповіді приходять не в порядку запитів, і старий результат перезаписує новий. Рішення — скасовувати попередній запит.
>
> ```js
> let controller;
>
> async function search(query) {
>   controller?.abort();
>   controller = new AbortController();
>   const { signal } = controller;
>   try {
>     const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal });
>     const data = await res.json();
>     signal.throwIfAborted();
>     render(data);
>   } catch (err) {
>     if (err.name !== 'AbortError') throw err;
>   }
> }
> ```
>
> Власні async-функції мають поважати сигнал:
> - `signal.throwIfAborted()` між кроками;
> - `signal.addEventListener('abort', cleanup, { once: true })` для таймерів і ресурсів;
> - знімати слухачів після завершення, інакше довгоживучий сигнал тримає посилання — витік пам'яті.
>
> **На співбесіді:** якщо API не підтримує скасування, лишається ігнорувати результат (порівняння request id або прапорець у cleanup `useEffect`). Робота при цьому все одно виконується — це треба чесно проговорити.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Скасування й гонки відповідей у UI|Розділ: гонки відповідей]] · [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) · [MDN: AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

> [!question]- Які антипатерни з промісами ви найчастіше бачите в code review?
> *часто · практика* · `js-05-021`
>
> - **Explicit construction**: обгортання готового промісу в `new Promise` — зайвий код і ризик загубити відхилення.
> - **Async executor**: `new Promise(async (resolve) => ...)` — виняток усередині не відхиляє зовнішній проміс, той висить вічно.
> - **Floating promises**: виклик async-функції без `await`, `return` чи `.catch` — помилки стають unhandled, порядок не гарантований.
> - `await` у циклі для незалежних операцій — штучний waterfall.
> - Async-функція як callback там, де результат ігнорується: `forEach`, `EventEmitter`, `array.sort`.
> - Змішування callback- і promise-API, коли callback може бути викликано двічі.
> - `.then(ok, err)` там, де потрібен `.then(ok).catch(err)` — помилки з `ok` проходять повз обробник.
>
> ```js
> // погано: якщо loadUser() відхилиться — unhandled rejection, а p ніколи не завершиться
> const p = new Promise(async (resolve) => {
>   const user = await loadUser();
>   resolve(user.name);
> });
>
> // добре
> const name = loadUser().then(user => user.name);
> ```
>
> **На співбесіді:** більшість цього ловиться статично — `@typescript-eslint/no-floating-promises`, `no-misused-promises`, `no-async-promise-executor`. Сильна відповідь — не лише назвати патерни, а сказати, як ви закрили їх лінтером у команді.
>
> 📚 [[JavaScript - 09. Promise#⚠️ Пастки|Розділ: пастки промісів]] · [MDN: Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) · [typescript-eslint: no-floating-promises](https://typescript-eslint.io/rules/no-floating-promises/)

## 🟣 Tech Lead

> [!question]- Як би ви спроєктували шар роботи з мережею з таймаутами, повторами та скасуванням?
> *часто · практика* · `js-05-022`
>
> Ключова ідея — один **HTTP-клієнт** на застосунок, через який ідуть усі запити, з явними політиками замість розкиданих по коду `fetch`.
>
> - **Таймаути:** дефолтний на спробу плюс загальний дедлайн операції; сигнал викликача об'єднується з таймаутом через `AbortSignal.any`. `TimeoutError` і `AbortError` розрізняються — перше помилка, друге ні.
> - **Повтори:** лише для ідемпотентних методів або з `Idempotency-Key`, лише тимчасові помилки, full jitter, `Retry-After`, ліміт спроб у межах дедлайну.
> - **Скасування:** сигнал обов'язковий у публічному API клієнта; UI скасовує при зміні маршруту чи unmount.
> - **Нормалізація помилок:** `HttpError` зі `status` і тілом, `NetworkError`, `TimeoutError`; перевірка `res.ok` в одному місці.
> - **Дедуплікація й кеш:** однакові GET у польоті об'єднуються; на клієнті — TanStack Query чи SWR, а не власний кеш.
> - **Спостережуваність:** `x-request-id`, метрики латентності, кількості повторів і таймаутів.
>
> ```js
> export async function request(url, { signal, timeout = 8000, retries = 2, ...init } = {}) {
>   return withRetry(async () => {
>     const signals = [AbortSignal.timeout(timeout), ...(signal ? [signal] : [])];
>     const res = await fetch(url, { ...init, signal: AbortSignal.any(signals) });
>     if (!res.ok) throw new HttpError(res.status, await res.text());
>     return res.json();
>   }, { retries: isIdempotent(init.method) ? retries : 0, signal });
> }
> ```
>
> **На співбесіді:** обґрунтуйте build vs buy: готові клієнти (`ky`, `undici` interceptors, TanStack Query) вже вирішують більшість цього; власний шар — тонкий адаптер із політиками компанії, а не переписаний кеш.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP|Розділ: мережа: fetch, CORS і HTTP]] · [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) · [AWS: Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

> [!question]- Які конвенції обробки асинхронних помилок ви б закріпили в команді?
> *іноді · практика* · `js-05-023`
>
> Мета — щоб помилка не губилася, мала контекст і оброблялася там, де з нею можна щось зробити.
>
> - **Лише `Error`:** жодних `throw 'string'` чи `reject({})`; обгортання через `new Error(msg, { cause })`; доменні класи або поле `code` для розгалуження.
> - **Жодних floating promises:** `no-floating-promises`, `no-misused-promises`, `return-await: in-try-catch` у CI. Свідомий fire-and-forget — лише як `void task().catch(report)`.
> - **Ловити на межах:** HTTP middleware, обробник черги, error boundary в UI. Нижчі шари не ковтають помилки — або додають контекст і прокидають, або обробляють повністю.
> - **`AbortError` — не помилка:** фільтрується з логів і алертів, інакше шум ховає реальні проблеми.
> - **TypeScript:** `useUnknownInCatchVariables` (входить у `strict`) — `catch (err)` має тип `unknown` і звужується явно.
> - **Процес:** `unhandledRejection` у Node — лог + завершення; перезапуск робить оркестратор.
>
> ```js
> app.use(async (ctx, next) => {
>   try {
>     await next();
>   } catch (err) {
>     const status = err instanceof HttpError ? err.status : 500;
>     ctx.status = status;
>     ctx.body = { error: status === 500 ? 'Internal error' : err.message };
>     if (status === 500) logger.error({ err, requestId: ctx.state.requestId });
>   }
> });
> ```
>
> **На співбесіді:** обговоріть Result-типи (`neverthrow`) — вони роблять помилки явними в сигнатурах, але ускладнюють код і погано поєднуються з екосистемою. Для більшості команд лінтер плюс обробка на межах дає 90% користі.
>
> 📚 [[JavaScript - 10. async і await#Обробка помилок|Розділ: обробка помилок]] · [typescript-eslint: no-floating-promises](https://typescript-eslint.io/rules/no-floating-promises/) · [typescript-eslint: no-misused-promises](https://typescript-eslint.io/rules/no-misused-promises/)

## Тести

> [!quiz] Яким буде стан і значення промісу `Promise.resolve(1).then(() => {})`?
> level: junior · id: js-05-quiz-01
> - [ ] fulfilled зі значенням `1`
> - [x] fulfilled зі значенням `undefined`
> - [ ] rejected з `TypeError`
> - [ ] pending назавжди
>
> **Пояснення:** `.then` повертає новий проміс, який отримує значення, повернуте обробником. Функція з порожнім тілом повертає `undefined`, тож початкове `1` не "протікає" далі.

> [!quiz] Чим завершиться `Promise.any([Promise.reject(1), Promise.reject(2)])`?
> level: middle · id: js-05-quiz-02
> - [ ] Відхилиться з `1`
> - [ ] Відхилиться з `2`
> - [x] Відхилиться з `AggregateError`, у якого `errors` дорівнює `[1, 2]`
> - [ ] Виконається з `undefined`
>
> **Пояснення:** `Promise.any` чекає на перший fulfilled. Якщо відхилені всі, він відхиляється з `AggregateError`, де `errors` містить причини в порядку вхідних промісів.

> [!quiz] Оберіть усі правильні твердження про `Promise.prototype.finally`.
> level: middle · type: multi · id: js-05-quiz-03
> - [x] Callback не отримує жодних аргументів
> - [x] Значення, яке повернув callback, ігнорується, і далі йде початковий результат
> - [x] Якщо callback кине помилку, ланцюжок відхилиться з цією помилкою
> - [ ] Повернувши значення з callback, можна перетворити rejected на fulfilled
>
> **Пояснення:** `finally` прозорий для результату, але не для власних помилок: виняток чи відхилений проміс з callback замінюють результат. Відновити ланцюжок після помилки може лише `catch` або `then(_, onRejected)`.

> [!quiz] Що виведе код?
> level: junior · type: output · id: js-05-quiz-04
>
> ```js
> Promise.reject(new Error('A'))
>   .catch(e => e.message)
>   .then(v => console.log('then', v))
>   .catch(() => console.log('catch'))
>   .finally(() => console.log('finally'));
> ```
>
> - [ ] `catch`, `finally`
> - [x] `then A`, `finally`
> - [ ] `then undefined`, `finally`
> - [ ] `then A`, `catch`, `finally`
>
> **Пояснення:** перший `catch` повертає рядок `'A'` і відновлює ланцюжок, тому `then` отримує `'A'`. Другий `catch` пропускається, бо відхилень більше немає; `finally` виконується завжди.

> [!quiz] Що виведе код?
> level: senior · type: output · id: js-05-quiz-05
>
> ```js
> async function f() {
>   try {
>     return Promise.reject('x');
>   } catch {
>     return 'caught';
>   }
> }
>
> f().then(console.log, e => console.log('rejected', e));
> ```
>
> - [ ] `caught`
> - [x] `rejected x`
> - [ ] `x`
> - [ ] Нічого, буде unhandled rejection
>
> **Пояснення:** `return` без `await` миттєво виходить з `try`, а відхилений проміс стає результатом async-функції вже поза `try/catch`. З `return await` помилку було б спіймано і виведено `caught`.

## Задачі

> [!task] Реалізуй `retry` з exponential backoff, jitter і скасуванням
> level: middle · difficulty: medium · id: js-05-task-01 · tags: promises, timers, abort-controller
>
> Умова: напиши `retry(fn, { retries = 3, baseMs = 100, maxMs = 5000, shouldRetry = () => true, signal } = {})`, що повертає Promise. `fn(attempt)` викликається з номером спроби від 0 і повертає проміс. При відхиленні, якщо спроби лишилися й `shouldRetry(err, attempt)` повертає `true`, чекаємо випадкову затримку з діапазону `[0, min(maxMs, baseMs * 2 ** attempt))` і пробуємо знову; інакше відхиляємося з останньою помилкою. Якщо `signal` спрацював — негайно відхиляємося з `signal.reason`, навіть під час очікування. Приклад: `await retry(() => fetchJson('/api'), { retries: 2 })` зробить максимум 3 виклики.
>
> > [!hint]- Підказка 1
> > Цикл `for` з `try/catch` і `await` усередині читається простіше, ніж рекурсія на `.then`.
>
> > [!hint]- Підказка 2
> > Потрібен окремий `sleep(ms, signal)`, який відхиляється при abort і прибирає за собою і таймер, і слухача.
>
> > [!hint]- Підказка 3
> > Перед кожною спробою викликай `signal?.throwIfAborted()`; затримка — `Math.random() * Math.min(maxMs, baseMs * 2 ** attempt)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function sleep(ms, signal) {
> >   return new Promise((resolve, reject) => {
> >     if (signal?.aborted) return reject(signal.reason);
> >     const onAbort = () => {
> >       clearTimeout(timer);
> >       reject(signal.reason);
> >     };
> >     const timer = setTimeout(() => {
> >       signal?.removeEventListener('abort', onAbort);
> >       resolve();
> >     }, ms);
> >     signal?.addEventListener('abort', onAbort, { once: true });
> >   });
> > }
> >
> > async function retry(fn, { retries = 3, baseMs = 100, maxMs = 5000, shouldRetry = () => true, signal } = {}) {
> >   for (let attempt = 0; ; attempt++) {
> >     signal?.throwIfAborted();
> >     try {
> >       return await fn(attempt);
> >     } catch (err) {
> >       if (attempt >= retries || !shouldRetry(err, attempt)) throw err;
> >       const cap = Math.min(maxMs, baseMs * 2 ** attempt);
> >       await sleep(Math.random() * cap, signal);
> >     }
> >   }
> > }
> > ```
> >
> > `return await` усередині `try` потрібен, щоб відхилення `fn` потрапило в `catch`. Full jitter розмазує повтори різних клієнтів у часі, а `cap` обмежує затримку зверху. `sleep` знімає слухача після таймера, тож довгоживучий `signal` не накопичує замикання. Загалом буде не більше `retries + 1` викликів `fn`.

> [!task] Реалізуй limiter конкурентності в стилі `p-limit`
> level: senior · difficulty: hard · id: js-05-task-02 · tags: promises, concurrency, queues
>
> Умова: напиши `createLimiter(concurrency)`, що повертає функцію `limit(fn)`. `limit` повертає проміс результату `fn()`, але одночасно виконується не більше `concurrency` задач; решта чекають у FIFO-черзі. Синхронний `throw` у `fn` має перетворюватися на відхилення, а помилка однієї задачі не повинна зупиняти інші. Додай геттери `limit.activeCount` і `limit.pendingCount`. Приклад: `const limit = createLimiter(2); await Promise.all(urls.map(u => limit(() => fetch(u))));` — у будь-який момент активні не більше двох запитів.
>
> > [!hint]- Підказка 1
> > Стан — черга `{ fn, resolve, reject }` і лічильник активних задач. Функція `next()` стартує задачі, поки є вільні слоти.
>
> > [!hint]- Підказка 2
> > `Promise.resolve().then(fn)` одночасно ловить синхронні винятки і обробляє як проміс, так і звичайне значення.
>
> > [!hint]- Підказка 3
> > Звільняй слот у `.finally` і там же викликай `next()`. `queue.shift()` — O(n); для великих черг тримай індекс голови.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createLimiter(concurrency) {
> >   if (!Number.isInteger(concurrency) || concurrency < 1) {
> >     throw new RangeError('concurrency must be a positive integer');
> >   }
> >   let queue = [];
> >   let head = 0;
> >   let active = 0;
> >
> >   const next = () => {
> >     while (active < concurrency && head < queue.length) {
> >       const { fn, resolve, reject } = queue[head];
> >       queue[head++] = undefined;
> >       active++;
> >       Promise.resolve()
> >         .then(fn)
> >         .then(resolve, reject)
> >         .finally(() => {
> >           active--;
> >           next();
> >         });
> >     }
> >     if (head === queue.length) {
> >       queue = [];
> >       head = 0;
> >     }
> >   };
> >
> >   const limit = (fn) =>
> >     new Promise((resolve, reject) => {
> >       queue.push({ fn, resolve, reject });
> >       next();
> >     });
> >
> >   Object.defineProperties(limit, {
> >     activeCount: { get: () => active },
> >     pendingCount: { get: () => queue.length - head },
> >   });
> >   return limit;
> > }
> > ```
> >
> > Кожна задача займає слот від старту до settled і звільняє його в `finally`, після чого `next()` добирає наступну — так кількість активних ніколи не перевищує ліміт. Результат передається в проміс, який повернув `limit`, тож помилки ізольовані між задачами. Додавання й старт — амортизовано O(1) завдяки індексу голови; скасування задач у черзі можна додати через `AbortSignal`.
