---
title: async і await
order: 10
level: middle
tags: [async, await, promise, abortcontroller, error-handling]
prerequisites:
  - "[[JavaScript - 08. Event Loop]]"
  - "[[JavaScript - 09. Promise]]"
estimatedMinutes: 45
id: jsd-ch-10
icon: "⏳"
---

# JavaScript - 10. async і await

> [!success] 🎯 Після цього розділу ти зможеш
> - Передбачити порядок виводу коду з `async`/`await`, `then` і таймерами.
> - Пояснити, що саме відбувається на `await`: пауза функції, звільнення стека й продовження як microtask.
> - Свідомо обирати між послідовними й паралельними `await` і правильно ловити помилки в обох випадках.
> - Знайти й виправити класичні баги: `forEach` + `async`, `return` без `await` у `try`, «рознесені» `await`.
> - Скасовувати асинхронні операції через `AbortController` і `AbortSignal.timeout`.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jsd-10-quiz-01
>
> ```js
> async function f() {
>   console.log(1);
>   await null;
>   console.log(2);
> }
> console.log(3);
> f();
> console.log(4);
> ```
>
> **Відповідь:** `3 1 4 2`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Тіло `async`-функції до першого `await` виконується **синхронно** (`1` одразу після `3`). На `await` функція ставиться на паузу й повертає керування, тож друкується `4`. Продовження (`2`) — microtask.

## 🧒 Простими словами

`await` — це закладка в книжці. Ти читаєш розділ (виконуєш функцію), доходиш до місця «чекаю, поки чайник закипить» — кладеш закладку й **відходиш від книжки**, щоб інші могли нею скористатися. Коли чайник закипів, ти не кидаєшся до книжки посеред чужої фрази: стаєш у коротку чергу «повернутися до читання» (microtasks) і продовжуєш рівно з тієї сторінки, де лишив закладку — з усіма своїми думками (локальними змінними) на місці.

## 🔬 Як це працює насправді

### `async`-функція завжди повертає проміс

Слово `async` змінює контракт функції:

- `return v` → повернений проміс fulfilled з `v` (якщо `v` — проміс, він «розпаковується»);
- `throw e` → проміс rejected з `e` — **навіть якщо помилка сталася до першого `await`**;
- кожен виклик створює **новий** проміс.

```js
async function f() { return 1; }
console.log(f() instanceof Promise); // → true
console.log(f() === f());            // → false

async function boom() { throw new Error('x'); }
const p = boom();                    // нічого не кидає синхронно!
console.log('after');
p.catch((e) => console.log('caught', e.message));
// → after
// → caught x
```

> [!quiz] Перевір себе: синхронний throw в async
> level: junior · id: jsd-10-quiz-02
>
> ```js
> async function load() { throw new Error('nope'); }
> try {
>   load();
>   console.log('ok');
> } catch {
>   console.log('caught');
> }
> ```
>
> - [ ] `caught`
> - [x] `ok`, а потім unhandled rejection
> - [ ] Нічого, помилка проковтнеться тихо
>
> **Пояснення:** `async`-функція ніколи не кидає синхронно — помилка йде в повернений проміс. Без `await load()` синхронний `try/catch` її не побачить.

### `await`: пауза + продовження як microtask

`await expr` робить три речі:

1. перетворює `expr` на проміс (`Promise.resolve(expr)` — значення, проміс, thenable);
2. **зберігає стан функції** (локальні змінні, позицію) і знімає її кадр зі стека — керування повертається тому, хто викликав;
3. коли проміс осяде, **продовження** функції ставиться в чергу microtasks; rejection перетворюється на `throw` у точці `await`.

Під капотом це та сама механіка, що й у генераторах ([[JavaScript - 11. Ітератори та генератори]]): функція вміє «заморозитися» на `yield` і відновитися ззовні. `async/await` = генератор + проміси + автоматичний «рушій».

> [!viz] event-loop
> scenario: async-await

```js
async function a() {
  console.log('a1');
  await b();
  console.log('a2');
}
async function b() { console.log('b'); }

console.log('start');
setTimeout(() => console.log('timeout'), 0);
a();
Promise.resolve().then(() => console.log('then'));
console.log('end');
// → start, a1, b, end, a2, then, timeout
```

`b()` виконується синхронно (`b`), повертає вже fulfilled проміс, тож продовження `a2` стає в чергу microtasks **раніше** за `then`, який зареєстрували пізніше. З ES2019 `await` нативного промісу коштує рівно один тік (раніше — три).

> [!figure] devtools-console
> scenario: promise-order
>
> У другій половині сцени: `A` друкується до `await`, `B` — решта скрипта, а `C` — продовження після `await`, яке прийшло мікрозадачею.

> [!quiz] Перевір себе: await у змаганні з then
> level: middle · type: output · id: jsd-10-quiz-03
>
> ```js
> async function run() {
>   console.log('A');
>   await undefined;
>   console.log('B');
>   await undefined;
>   console.log('C');
> }
> Promise.resolve()
>   .then(() => console.log('1'))
>   .then(() => console.log('2'));
> run();
> console.log('D');
> ```
>
> **Відповідь:** `A D 1 B 2 C`
>
> **Пояснення:** черга після синхронного коду: `then#1`, продовження `run`. `1` ставить `then#2`, `B` ставить наступне продовження — вони чергуються по одному тіку. Див. [V8: Faster async functions and promises](https://v8.dev/blog/fast-async).

### Послідовно чи паралельно

`await` у рядок = **послідовно**: наступна операція навіть не стартує, доки не завершилась попередня. Для незалежних операцій це даремна втрата часу (*waterfall*).

```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ❌ ~200 мс: друга пауза стартує лише після першої
await sleep(100);
await sleep(100);

// ✅ ~100 мс: обидві стартують одразу
await Promise.all([sleep(100), sleep(100)]);
```

Правило: **запускають** операцію виклик функції, а не `await`. `await` лише чекає. Тому залежні кроки (`user` → `orders(user.id)`) — послідовно, незалежні — через `Promise.all` / `allSettled`.

> [!quiz] Перевір себе: скільки часу?
> level: middle · id: jsd-10-quiz-04
>
> ```js
> const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
> const t = Date.now();
> const a = sleep(100);
> const b = sleep(100);
> await a;
> await b;
> console.log(Date.now() - t);
> ```
>
> - [ ] ≈ 200
> - [x] ≈ 100
> - [ ] ≈ 0
>
> **Пояснення:** обидва таймери стартували в момент виклику `sleep`, ще до будь-якого `await`. Але такий стиль небезпечний для помилок — див. «Пастки».

> [!quiz] Перевір себе: заповни пропуски, щоб два незалежні запити йшли паралельно
> level: middle · type: fill · id: jsd-10-quiz-09 · bank: race, then, async
>
> ```js fill
> async function loadUserPage(id) {
>   const [user, posts] = [[await]] Promise.[[all]]([
>     fetchUser(id),
>     fetchPosts(id),
>   ])
>   return { user, posts }
> }
> ```
>
> **Пояснення:** обидва запити **стартують** у момент виклику `fetchUser(id)` і `fetchPosts(id)`, ще до `await`. `Promise.all` чекає обох і повертає масив у порядку входу — його зручно одразу деструктуризувати. Якщо впаде будь-який, `await` кине цю помилку (fail-fast).

### Обробка помилок

Усередині `async`-функції rejection на `await` — це звичайний `throw`, тож працює `try/catch/finally`. Пастка в тому, що `try` ловить лише те, що **заавейчено всередині нього**:

```js
const fail = async () => { throw new Error('boom'); };

async function noAwait() {
  try { return fail(); } catch { return 'handled'; }   // ❌ проміс вилітає з try
}
async function withAwait() {
  try { return await fail(); } catch { return 'handled'; } // ✅
}
noAwait().catch((e) => console.log('noAwait rejected', e.message));
withAwait().then((v) => console.log('withAwait', v));
// → withAwait handled
// → noAwait rejected boom
```

Поза `try` `return await p` і `return p` еквівалентні за результатом; `return await` ще й дає кращі async stack traces у V8. Для паралельних операцій — `Promise.allSettled`, якщо треба знати долю кожної, або `Promise.all` у `try`, якщо достатньо першої помилки.

> [!quiz] Перевір себе: що поверне?
> level: middle · type: output · id: jsd-10-quiz-05
>
> ```js
> async function f() {
>   try {
>     await Promise.reject(new Error('E'));
>     return 'try';
>   } catch (e) {
>     return 'catch';
>   } finally {
>     console.log('finally');
>   }
> }
> f().then(console.log);
> ```
>
> **Відповідь:** `finally catch`
>
> **Пояснення:** rejection на `await` стає `throw` → `catch` повертає `'catch'`, але перед виходом виконується `finally` (друкує першим). Потім проміс fulfilled з `'catch'`.

### Top-level await і `for await`

**Top-level await** працює лише в ES-модулях (`<script type="module">`, `.mjs`, `"type": "module"`). Модуль з TLA стає «асинхронним вузлом» графа: модулі, що його імпортують, **не почнуть виконуватися**, доки він не завершиться. Зручно для конфігів і динамічних імпортів, але повільний `await fetch()` у спільному модулі гальмує весь застосунок.

```js
// config.mjs
export const config = await fetch('/config.json').then((r) => r.json());
```

**`for await…of`** ітерує async iterables (стріми, пагінація, async-генератори) і на кожному кроці робить `await`. Масив промісів він теж приймає — значення приходять **у порядку масиву**, а не за швидкістю.

```js
const sleep = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
for await (const v of [sleep(30, 'a'), 'b', sleep(10, 'c')]) console.log(v);
// → a, b, c
```

> [!quiz] Перевір себе: top-level await
> level: middle · type: multi · id: jsd-10-quiz-06
>
> - [x] Top-level await доступний у ES-модулях, але не в класичних `<script>`
> - [ ] Top-level await виконується паралельно з кодом модулів, що його імпортують
> - [x] `for await` можна застосувати до масиву промісів
> - [ ] `for await` повертає значення в порядку завершення промісів
>
> **Пояснення:** модуль з TLA блокує виконання своїх «батьків» у графі імпортів. `for await` чекає елементи по черзі, тож порядок — як у джерелі.

### Класична помилка: `forEach` + `async`

`forEach` викликає callback і **ігнорує** повернений проміс. Кожна ітерація стартує, доходить до першого `await` — і `forEach` йде далі. Код після циклу не чекає нічого.

```js
[1, 2, 3].forEach(async (id) => {
  await null;
  console.log(id);
});
console.log('done');
// → done, 1, 2, 3
```

Виправлення залежить від наміру:

```js
// послідовно
for (const id of ids) await process(id);

// паралельно, з очікуванням усіх
await Promise.all(ids.map((id) => process(id)));
```

Те саме з `filter`, `some`, `reduce` з async-callback-ом: `filter` отримає проміси (завжди truthy) замість булевих значень.

> [!quiz] Перевір себе: async у filter
> level: middle · type: output · id: jsd-10-quiz-07
>
> ```js
> const isEven = async (n) => n % 2 === 0;
> console.log([1, 2, 3, 4].filter(isEven).length);
> ```
>
> **Відповідь:** `4`
>
> **Пояснення:** `isEven` повертає проміс, а будь-який об'єкт truthy. Правильно: `const flags = await Promise.all(arr.map(isEven)); arr.filter((_, i) => flags[i])`.

> [!quiz] Перевір себе: склади послідовне завантаження, яке справді чекає кожен крок
> level: middle · type: order · id: jsd-10-quiz-10
>
> ```js order
> async function loadAll(urls) {
>   const results = []
>   for (const url of urls) {
>     const res = await fetch(url)
>     results.push(await res.json())
>   }
>   return results
> }
>   urls.forEach(async (url) => { // ✗
> ```
>
> **Пояснення:** `for…of` поважає `await`: наступна ітерація стартує лише після завершення попередньої, а `return` дочекається всіх. `forEach` ігнорує проміси з async-callback-а — `results` повернувся б порожнім.

### Скасування: `AbortController`

Проміс не можна скасувати — його можна лише перестати чекати. Справжнє скасування в JS — це **кооперативний сигнал**: `AbortController` створює `signal`, ти передаєш його в операцію, і вона сама вирішує, як зупинитися.

```js
const controller = new AbortController();
const res = fetch('/api/search?q=js', { signal: controller.signal });
controller.abort(); // fetch відхиляється з DOMException name === 'AbortError'

// таймаут без ручного setTimeout
await fetch(url, { signal: AbortSignal.timeout(5000) }); // name === 'TimeoutError'

// «або користувач скасував, або минув таймаут»
const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(5000)]);
```

Свої функції роблять скасовними так: перевіряють `signal.throwIfAborted()` між кроками і слухають `signal.addEventListener('abort', …, { once: true })` для операцій, що вже йдуть. Підтримують сигнали `fetch`, `addEventListener` (опція `signal` знімає listener), більшість Node API (`fs/promises`, `timers/promises`, `events.once`).

> [!quiz] Перевір себе: AbortSignal
> level: senior · type: multi · id: jsd-10-quiz-08
>
> - [x] `AbortSignal.timeout(ms)` при спрацюванні дає reason з `name === 'TimeoutError'`
> - [ ] `controller.abort()` автоматично зупиняє будь-яку async-функцію, яка отримала сигнал
> - [x] `addEventListener(type, fn, { signal })` знімає listener при abort
> - [x] `AbortSignal.any([...])` спрацьовує, коли спрацює будь-який із сигналів
>
> **Пояснення:** скасування кооперативне — функція мусить сама перевіряти сигнал або передати його далі (у `fetch` тощо). Магічно «вбити» async-функцію неможливо.

## ⚠️ Пастки

> [!pitfall] «Рознесені» await → unhandled rejection
> Запустити дві операції й чекати їх по черзі — паралельно за часом, але небезпечно: якщо `b` відхилиться, поки чекаємо `a`, до rejection `b` ще ніхто не підписався. Node 15+ **завалить процес**, і `try/catch` не допоможе.
>
> ```js
> try {
>   const a = sleep(100);
>   const b = Promise.reject(new Error('b failed'));
>   await a;   // тут b вже «unhandled»
>   await b;
> } catch (e) { /* не дійде в Node */ }
>
> // ✅
> const [ra, rb] = await Promise.all([sleep(100), loadB()]);
> ```

> [!pitfall] `return promise` у `try` без `await`
> Повернений без `await` проміс залишає функцію раніше, ніж осяде, — `catch` і `finally` спрацюють «не про те». Усередині `try` завжди `return await`.
>
> ```js
> async function get() {
>   try { return fetchJson(); }      // ❌ помилка повз catch
>   catch { return fallback; }
> }
> ```

> [!pitfall] Випадковий waterfall
> Незалежні запити один за одним — найчастіша причина «повільної сторінки» в код-рев'ю.
>
> ```js
> const user = await getUser();
> const settings = await getSettings(); // не залежить від user!
> const feed = await getFeed();         // теж
> // ✅ const [user, settings, feed] = await Promise.all([getUser(), getSettings(), getFeed()]);
> ```

> [!pitfall] `await` у циклі там, де потрібен паралелізм — і навпаки
> `for…of` + `await` — коректно для залежних кроків або коли API має rate limit. Але для 1000 незалежних запитів `Promise.all(map)` відкриє 1000 з'єднань одночасно. Золота середина — пул з обмеженням конкурентності (див. [[JavaScript - 14. Debounce, throttle та async-патерни]]).

## 🎤 На співбесіді

> [!interview] Як працює async/await під капотом?
> level: middle · frequency: дуже часто · id: jsd-10-int-01
>
> ---
>
> `async`-функція завжди повертає проміс: `return` його виконує, `throw` — відхиляє. До першого `await` тіло біжить синхронно. На `await` значення перетворюється на проміс, стан функції (змінні, позиція) зберігається, кадр знімається зі стека — керування повертається викликачу. Коли проміс осяде, продовження ставиться в чергу microtasks; rejection стає `throw` у точці `await`. Концептуально це генератор, який автоматично «прокручує» рушій на промісах.
>
> 📚 [[JavaScript - 10. async і await#await: пауза + продовження як microtask|Розділ: await під капотом]] · [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) · [V8: Faster async functions and promises](https://v8.dev/blog/fast-async)

> [!interview] Як виконати кілька запитів паралельно і обробити помилки?
> level: middle · frequency: дуже часто · id: jsd-10-int-02
>
> ---
>
> Запускаю всі виклики одразу і чекаю комбінатором: `await Promise.all([...])` у `try`, якщо будь-яка помилка фатальна; `Promise.allSettled`, якщо треба показати частковий результат. Не роблю «запустив, потім по черзі await» — rejection другого стане unhandled. Для великої кількості — пул з лімітом конкурентності. Для скасування решти після помилки — спільний `AbortController`, який абортую в `catch`.
>
> 📚 [[JavaScript - 10. async і await#Послідовно чи паралельно|Розділ: послідовно чи паралельно]] · [MDN: Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) · [MDN: Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

> [!interview] Як скасувати асинхронну операцію?
> level: senior · frequency: часто · id: jsd-10-int-03
>
> ---
>
> Проміс не скасовується — скасовується робота через `AbortController`: передаю `signal` у `fetch` чи власну функцію, викликаю `abort(reason)`. Операція відхиляється з `AbortError` (або reason). Свої функції роблю кооперативними: `signal.throwIfAborted()` між кроками, listener на `abort` для поточної операції з `{ once: true }` і прибиранням таймерів. Для таймаутів — `AbortSignal.timeout`, для комбінацій — `AbortSignal.any`. Типовий кейс — пошук: абортую попередній запит при новому вводі.
>
> 📚 [[JavaScript - 10. async і await#Скасування: AbortController|Розділ: скасування]] · [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) · [MDN: AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

## 🔗 Зв'язки

- [[JavaScript - 09. Promise]] — `async/await` — це синтаксис над промісами: ті самі стани, тіки й правила помилок.
- [[JavaScript - 08. Event Loop]] — продовження після `await` — microtask, тому воно обганяє таймери.
- [[JavaScript - 11. Ітератори та генератори]] — пауза функції на `await` — та сама ідея, що й `yield`; async-генератори поєднують обидва світи.
- [[JavaScript - 14. Debounce, throttle та async-патерни]] — retry, timeout, пул і гонки відповідей будуються на `await` + `AbortController`.

## ⚡ Фішки

> [!reel] ⚡ await став утричі дешевшим у 2019
> Раніше `await` нативного промісу коштував 3 microtasks. Після оптимізації V8 і правки специфікації (ES2019) — один тік. Відтоді код з `await` часто швидший за ручні ланцюжки `then`.

> [!reel] 🔁 forEach не чекає ваші async-callback-и
> `forEach` ігнорує повернені проміси. Код після циклу виконається раніше, ніж будь-яка ітерація дійде далі першого `await`.
>
> ```js
> [1, 2].forEach(async (x) => { await 0; log(x); });
> log('done'); // done, 1, 2
> ```

> [!reel] 🧪 async-фільтр пропускає все
> `arr.filter(async (x) => false)` поверне весь масив: callback повертає проміс, а будь-який проміс — truthy об'єкт.

> [!reel] ⏰ AbortSignal.timeout — таймаут в одному рядку
> `fetch(url, { signal: AbortSignal.timeout(3000) })` — і жодних `setTimeout`/`clearTimeout`. Помилка матиме `name === 'TimeoutError'`, тож її легко відрізнити від ручного скасування.

> [!reel] 🧱 Top-level await гальмує всіх, хто тебе імпортує
> Модуль з TLA — асинхронний вузол графа: батьківські модулі не почнуть виконуватися, доки він не завершиться. Повільний `await fetch()` у `config.mjs` = повільний старт усього застосунку.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що повертає `async`-функція?
> *дуже часто · теорія* · `jsd-10-001`
>
> Завжди новий проміс: fulfilled зі значенням `return` або rejected з тим, що кинуто `throw`. Синхронно `async`-функція не кидає ніколи.
>
> 📚 [[JavaScript - 10. async і await#async-функція завжди повертає проміс|Розділ: async-функції]] · [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) · [javascript.info: Async/await](https://javascript.info/async-await)

> [!question]- Чи виконується тіло `async`-функції синхронно?
> *часто · код* · `jsd-10-002`
>
> Так, до першого `await`. Решта — продовження в microtask.
>
> ```js
> async function f() { console.log('in'); await 0; console.log('after'); }
> f(); console.log('out');
> // → in, out, after
> ```
>
> 📚 [[JavaScript - 10. async і await#async-функція завжди повертає проміс|Розділ: async-функції]] · [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) · [Spec: Async Function Definitions](https://tc39.es/ecma262/#sec-async-function-definitions)

> [!question]- Як обробляти помилки з `await`?
> *часто · практика* · `jsd-10-003`
>
> `try/catch` навколо `await` (rejection перетворюється на `throw`) або `.catch` на результаті виклику. `try` ловить лише те, що заавейчено всередині нього.
>
> 📚 [[JavaScript - 10. async і await#Обробка помилок|Розділ: обробка помилок]] · [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) · [javascript.info: Async/await](https://javascript.info/async-await)

### 🟡 Middle

> [!question]- Чому `forEach` з `async`-callback-ом — помилка, і як переписати?
> *дуже часто · код* · `jsd-10-004`
>
> `forEach` не чекає повернених промісів: цикл завершується одразу, помилки стають unhandled. Послідовно — `for…of` з `await`; паралельно — `await Promise.all(arr.map(fn))`.
>
> 📚 [[JavaScript - 10. async і await#Класична помилка: forEach + async|Розділ: forEach + async]] · [MDN: Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) · [typescript-eslint: no-misused-promises](https://typescript-eslint.io/rules/no-misused-promises/)

> [!question]- Чим відрізняються послідовні й паралельні `await`?
> *дуже часто · порівняння* · `jsd-10-005`
>
> Операцію запускає виклик функції, `await` лише чекає. `await a(); await b();` — `b` стартує після завершення `a` (сума часів). `await Promise.all([a(), b()])` — стартують разом (максимум часів).
>
> 📚 [[JavaScript - 10. async і await#Послідовно чи паралельно|Розділ: послідовно чи паралельно]] · [MDN: Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) · [javascript.info: Async/await](https://javascript.info/async-await)

> [!question]- Коли `return await` відрізняється від `return`?
> *іноді · код* · `jsd-10-006`
>
> Усередині `try/catch/finally`: без `await` проміс залишає блок неосілим, і `catch` не зловить його rejection. Поза `try` результат той самий (а `return await` дає кращий stack trace).
>
> 📚 [[JavaScript - 10. async і await#Обробка помилок|Розділ: return await]] · [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) · [V8: Faster async functions and promises](https://v8.dev/blog/fast-async)

> [!question]- Чому «запустити два проміси, потім по черзі await» небезпечно?
> *іноді · теорія* · `jsd-10-007`
>
> Поки чекаємо перший, другий може відхилитися без жодного підписника — це unhandled rejection. У Node 15+ процес падає ще до того, як `await` дійде до другого промісу. Використовуй `Promise.all`/`allSettled`.
>
> 📚 [[JavaScript - 10. async і await#Послідовно чи паралельно|Розділ: послідовно чи паралельно]] · [MDN: Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) · [MDN: unhandledrejection event](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event)

### 🔴 Senior

> [!question]- Як `async/await` пов'язаний з генераторами?
> *іноді · теорія* · `jsd-10-008`
>
> Обидва — функції, які можна призупинити й відновити зі збереженим станом. `async/await` ≈ генератор, де `yield` — це `await`, плюс рушій, який на кожному промісі викликає `next(value)` або `throw(err)`. Так його і транспілювали в ES5 (regenerator).
>
> 📚 [[JavaScript - 10. async і await#await: пауза + продовження як microtask|Розділ: await під капотом]] · [MDN: Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) · [Spec: Await](https://tc39.es/ecma262/#await)

> [!question]- Чому `AbortController` не «вбиває» async-функцію?
> *часто · теорія* · `jsd-10-009`
>
> Скасування кооперативне: сигнал — лише прапорець + подія `abort`. Функція мусить сама перевіряти `signal.aborted`/`throwIfAborted()` або передати сигнал API, яке його підтримує (`fetch`). Інакше робота триває, просто результат нікому не потрібен.
>
> 📚 [[JavaScript - 10. async і await#Скасування: AbortController|Розділ: скасування]] · [MDN: AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) · [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

> [!question]- Як top-level await впливає на граф модулів?
> *рідко · теорія* · `jsd-10-010`
>
> Модуль з TLA виконується асинхронно, і всі модулі, що від нього залежать, чекають його завершення. Незалежні гілки графа можуть виконуватися далі. Повільний TLA у спільному модулі блокує старт застосунку.
>
> 📚 [[JavaScript - 10. async і await#Top-level await і for await|Розділ: top-level await]] · [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) · [V8: Top-level await](https://v8.dev/features/top-level-await)

## 🛠️ Практика

> [!task] Поясни своїми словами: що робить `await`
> level: junior · difficulty: easy · id: jsd-10-task-01 · tags: feynman, async
>
> Поясни, чому `await` **не блокує** потік, хоча функція «стоїть і чекає». Згадай call stack, чергу microtasks і те, що відбувається з локальними змінними. До 5 речень.
>
> > [!hint]- Підказка 1
> > Хто опиняється на стеку, коли функція на паузі?
>
> > [!hint]- Підказка 2
> > Де живуть локальні змінні призупиненої функції, якщо її кадру немає на стеку?
>
> > [!solution]- Еталонне пояснення
> > На `await` рушій зберігає стан функції — позицію й локальні змінні — в окремому об'єкті в heap і знімає її кадр зі стека. Керування повертається тому, хто її викликав, тож потік вільний для іншого коду, рендеру й подій. Коли очікуваний проміс осяде, продовження функції стає в чергу microtasks. Event loop бере його, щойно стек спорожніє, відновлює кадр зі збереженого стану — і функція йде далі, ніби нічого не сталося. «Чекає» лише сама функція, а не весь JavaScript.

> [!task] Виправ `forEach` + `async`
> level: middle · difficulty: medium · id: jsd-10-task-02 · tags: async, arrays
>
> Функція має зберегти всі файли і **після цього** надрукувати `saved N`. Зараз вона друкує `saved 0`. Напиши дві версії: послідовну і паралельну. У паралельній — якщо хоча б одне збереження впало, поверни список невдалих імен, не перериваючи інші.
>
> ```js
> async function saveAll(files) {
>   let count = 0;
>   files.forEach(async (f) => {
>     await save(f);
>     count++;
>   });
>   console.log('saved', count);
> }
> ```
>
> Щоб функції легко було перевірити, `save` приходить другим аргументом, а послідовна версія повертає кількість збережених.
>
> ```js starter
> async function saveAllSequential(files, save) {
>   // твій код: по одному, повертає count
> }
>
> async function saveAllParallel(files, save) {
>   // твій код: усі одразу, повертає масив невдалих імен
> }
> ```
>
> ```js tests
> function tracker(failOn = []) {
>   const t = { active: 0, maxActive: 0, order: [] }
>   t.save = async (f) => {
>     t.active++
>     t.maxActive = Math.max(t.maxActive, t.active)
>     await sleep(5)
>     t.active--
>     if (failOn.includes(f)) throw new Error('fail ' + f)
>     t.order.push(f)
>   }
>   return t
> }
>
> test('послідовна: зберігає по одному в порядку і чекає всіх', async () => {
>   const t = tracker()
>   const count = await saveAllSequential(['a', 'b', 'c'], t.save)
>   expect(count).toBe(3)
>   expect(t.order).toEqual(['a', 'b', 'c'])
>   expect(t.maxActive).toBe(1)
> })
>
> test('послідовна: зупиняється на першій помилці', async () => {
>   const t = tracker(['b'])
>   await expect(saveAllSequential(['a', 'b', 'c'], t.save)).rejects.toThrow('fail b')
>   expect(t.order).toEqual(['a'])
> })
>
> test('паралельна: стартує всі збереження одразу', async () => {
>   const t = tracker()
>   const failed = await saveAllParallel(['a', 'b', 'c'], t.save)
>   expect(failed).toEqual([])
>   expect(t.maxActive).toBe(3)
>   expect(t.order).toHaveLength(3)
> })
>
> test('паралельна: повертає невдалі імена, не перериваючи інші', async () => {
>   const t = tracker(['a', 'c'])
>   const failed = await saveAllParallel(['a', 'b', 'c', 'd'], t.save)
>   expect(failed).toEqual(['a', 'c'])
>   expect(t.order).toEqual(['b', 'd'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Послідовно — `for…of`. Паралельно — `map` повертає масив промісів.
>
> > [!hint]- Підказка 2
> > «Не перериваючи інші й зібрати невдалі» — це робота для `Promise.allSettled`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > async function saveAllSequential(files, save) {
> >   let count = 0;
> >   for (const f of files) {
> >     await save(f);
> >     count++;
> >   }
> >   console.log('saved', count);
> >   return count;
> > }
> >
> > async function saveAllParallel(files, save) {
> >   const results = await Promise.allSettled(files.map((f) => save(f)));
> >   const failed = files.filter((_, i) => results[i].status === 'rejected');
> >   console.log('saved', files.length - failed.length);
> >   return failed;
> > }
> > ```
> >
> > Послідовна версія зупиниться на першій помилці (і це може бути бажаним). Паралельна — завжди дочекається всіх, а `allSettled` гарантує відсутність unhandled rejections.

> [!task] Скасовний `sleep`
> level: senior · difficulty: hard · id: jsd-10-task-03 · tags: async, abortcontroller
>
> Реалізуй `abortableSleep(ms, { signal } = {})`:
> - резолвиться через `ms`;
> - якщо `signal` уже aborted — одразу rejected з `signal.reason`;
> - при abort під час очікування — rejected з `signal.reason` і **очищує таймер**;
> - після нормального завершення **знімає listener**, щоб не текла пам'ять при довгоживучому сигналі.
>
> ```js
> const ac = new AbortController();
> setTimeout(() => ac.abort(new Error('stop')), 50);
> abortableSleep(1000, { signal: ac.signal }).catch((e) => console.log(e.message)); // → stop (через ~50 мс)
> ```
>
> ```js starter
> function abortableSleep(ms, { signal } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> test('резолвиться рівно через ms', async () => {
>   vi.useFakeTimers()
>   let done = false
>   const p = abortableSleep(100).then(() => { done = true })
>   vi.advanceTimersByTime(99)
>   await Promise.resolve()
>   expect(done).toBe(false)
>   vi.advanceTimersByTime(1)
>   await p
>   expect(done).toBe(true)
> })
>
> test('уже скасований signal → одразу rejection з reason, без таймера', async () => {
>   vi.useFakeTimers()
>   const ac = new AbortController()
>   ac.abort(new Error('early'))
>   const p = abortableSleep(100, { signal: ac.signal })
>   expect(vi.getTimerCount()).toBe(0)
>   await expect(p).rejects.toThrow('early')
> })
>
> test('abort під час очікування → rejection з reason і очищений таймер', async () => {
>   vi.useFakeTimers()
>   const ac = new AbortController()
>   const p = abortableSleep(1000, { signal: ac.signal })
>   vi.advanceTimersByTime(50)
>   ac.abort(new Error('stop'))
>   expect(vi.getTimerCount()).toBe(0)
>   await expect(p).rejects.toThrow('stop')
> })
>
> test('після завершення знімає той самий listener', async () => {
>   vi.useFakeTimers()
>   const signal = { aborted: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
>   const p = abortableSleep(10, { signal })
>   vi.advanceTimersByTime(10)
>   await p
>   expect(signal.addEventListener).toHaveBeenCalledTimes(1)
>   const [type, handler] = signal.addEventListener.mock.calls[0]
>   expect(type).toBe('abort')
>   expect(signal.removeEventListener).toHaveBeenCalledWith('abort', handler)
> })
> ```
>
> > [!hint]- Підказка 1
> > Почни з `signal?.throwIfAborted()` — але зроби це так, щоб помилка стала rejection, а не синхронним винятком.
>
> > [!hint]- Підказка 2
> > `addEventListener('abort', onAbort, { once: true })` + `clearTimeout` в `onAbort`.
>
> > [!hint]- Підказка 3
> > У callback-у таймера виклич `signal.removeEventListener('abort', onAbort)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function abortableSleep(ms, { signal } = {}) {
> >   return new Promise((resolve, reject) => {
> >     if (signal?.aborted) return reject(signal.reason);
> >
> >     const onAbort = () => {
> >       clearTimeout(timer);
> >       reject(signal.reason);
> >     };
> >     const timer = setTimeout(() => {
> >       signal?.removeEventListener('abort', onAbort);
> >       resolve();
> >     }, ms);
> >
> >     signal?.addEventListener('abort', onAbort, { once: true });
> >   });
> > }
> > ```
> >
> > `reject(signal.reason)` зберігає причину, яку передав той, хто скасував (за замовчуванням це `DOMException` з `name: 'AbortError'`). У Node те саме вже є: `import { setTimeout as sleep } from 'node:timers/promises'` з опцією `{ signal }`.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Async/await](https://javascript.info/async-await) — основи `async`/`await` і обробка помилок.
- 🟡 [MDN — async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) — семантика async-функцій і порівняння з промісами.
- 🟡 [MDN — await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) — `await` з thenables, top-level await і stack traces.
- 🟡 [MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) — скасування `fetch` і власних операцій через сигнал.
- 🟡 [V8 — Faster async functions and promises](https://v8.dev/blog/fast-async) — скільки microtasks коштує `await` і як V8 це прискорив.
- 🟡 [V8 — Top-level await](https://v8.dev/features/top-level-await) — як top-level await змінює виконання графа модулів.
- 🔴 [ECMAScript — Await](https://tc39.es/ecma262/#await) — першоджерело: що саме робить `await`.
- 🛠️ [typescript-eslint — no-misused-promises](https://typescript-eslint.io/rules/no-misused-promises/) — ловить async-callback-и там, де проміс ігнорується.

> [!important] Підсумок
> - `async`-функція завжди повертає проміс; до першого `await` вона синхронна, помилки йдуть у проміс, а не в синхронний `try`.
> - `await` = зберегти стан, звільнити стек, продовжити як microtask; rejection стає `throw`.
> - Операцію запускає виклик, `await` лише чекає: незалежне — через `Promise.all`/`allSettled`, а не «запустив, потім по черзі».
> - `forEach`/`filter` з async-callback-ами не чекають промісів; у `try` — завжди `return await`.
> - Скасування кооперативне: `AbortController`, `AbortSignal.timeout`, `AbortSignal.any`.
