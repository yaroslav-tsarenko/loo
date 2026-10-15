---
title: Promise
order: 9
level: middle
tags: [async, promise, microtasks, error-handling]
prerequisites:
  - "[[JavaScript - 08. Event Loop]]"
  - "[[JavaScript - 05. Замикання]]"
estimatedMinutes: 50
id: jsd-ch-09
icon: "🤝"
---

# JavaScript - 09. Promise

> [!success] 🎯 Після цього розділу ти зможеш
> - Пояснити, яку проблему проміси розв'язують краще за callback-и (і це не лише «драбинка» вкладеності).
> - Розрізнити стани (pending / fulfilled / rejected) і долі (resolved / unresolved) промісу.
> - Передбачити, яке значення або помилка «приїде» в кожен крок ланцюжка `then/catch/finally`.
> - Обрати правильний комбінатор: `all`, `allSettled`, `race` чи `any` — і пояснити, що кожен робить з помилками.
> - Написати власні `promisify` і `Promise.all`.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jsd-09-quiz-01
>
> ```js
> const p = new Promise((resolve, reject) => {
>   resolve('A');
>   reject('B');
>   resolve('C');
>   console.log('D');
> });
> p.then(console.log, console.log);
> console.log('E');
> ```
>
> **Відповідь:** `D E A`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Проміс осідає **один раз**: перший `resolve('A')` виграє, решта викликів ігноруються, але код executor-а виконується далі (і синхронно — тому `D` перший). Реакція `then` — microtask, тож `A` після синхронного `E`.

## 🧒 Простими словами

Проміс — це **номерок у гардеробі**. Ти здав куртку (запустив операцію) і отримав номерок одразу, навіть якщо куртку ще не повісили. З номерком можна йти далі, передати його другові або домовитися «коли видадуть — одразу йду до виходу» (`then`). Номерок має лише три стани: «чекаємо», «ось твоя куртка», «вибач, загубили». І головне — гардеробник **не може** віддати тобі куртку двічі або спершу віддати, а потім сказати «загубили»: що сталося, те й зафіксовано назавжди.

## 🔬 Як це працює насправді

### Навіщо: callback hell та inversion of control

Очевидна проблема callback-ів — «піраміда смерті» вкладеності. Але глибша — **inversion of control** (термін, який популяризував Kyle Simpson): передаючи свій callback у чужу бібліотеку, ти довіряєш їй, що вона викличе його:

- рівно **один** раз (не 0 і не 2);
- **завжди асинхронно** (а не інколи синхронно — привіт, Zalgo);
- з **або** результатом, **або** помилкою, і не проковтне виняток.

```js
// callback-стиль: усі гарантії — на совісті chargeCard
chargeCard(order, (err, receipt) => {
  if (err) return showError(err);
  sendEmail(receipt, (err) => {
    if (err) return log(err);
    redirect('/thanks');
  });
});

// проміси: ми отримуємо об'єкт і самі вирішуємо, що з ним робити
chargeCard(order)
  .then(sendEmail)
  .then(() => redirect('/thanks'))
  .catch(showError);
```

Проміс повертає керування тобі: це **значення**, яке можна передати, скомбінувати, на яке можна підписатися будь-скільки разів. І мова гарантує: settle один раз, реакції завжди асинхронні (microtask), виняток у `then` → rejection.

> [!quiz] Перевір себе: що гарантує Promise?
> level: junior · type: multi · id: jsd-09-quiz-02
>
> - [x] Проміс переходить у fulfilled або rejected не більше одного разу
> - [x] Callback `then` ніколи не викликається синхронно, навіть для вже виконаного промісу
> - [ ] Операція всередині промісу виконується в окремому потоці
> - [x] Виняток, кинутий усередині `then`-callback-а, перетворюється на rejection наступного промісу
>
> **Пояснення:** проміс — це контейнер для майбутнього результату з гарантіями порядку. Паралелізму він не додає: executor біжить синхронно в тому ж потоці.

### Стани та долі

Проміс має **стан** (state):

- `pending` — ще не осів;
- `fulfilled` — успіх зі значенням;
- `rejected` — невдача з причиною (reason).

`fulfilled` і `rejected` разом називають **settled**. А ще є **доля** (fate), про яку мало хто знає: проміс **resolved**, якщо його доля вже вирішена — він або осів, або «прив'язався» до іншого промісу чи thenable. Тому `resolve()` ≠ «виконати»:

```js
const never = new Promise(() => {});
const p = new Promise((resolve) => resolve(never));
// p — resolved (доля прив'язана до never), але назавжди pending
console.log(p); // → Promise { <pending> }
```

> [!viz] promise-states
> scenario: lifecycle

Executor `new Promise((resolve, reject) => …)` виконується **синхронно** під час конструювання. Якщо він кидає виняток — проміс стає rejected (якщо ще не був resolved).

> [!quiz] Перевір себе: resolve з промісом
> level: middle · id: jsd-09-quiz-03
>
> ```js
> const slow = new Promise((r) => setTimeout(() => r('ok'), 1000));
> const p = new Promise((resolve) => resolve(slow));
> ```
>
> У якому стані `p` через 10 мс?
>
> - [ ] fulfilled зі значенням `slow`
> - [x] pending, але вже resolved — він чекає на `slow`
> - [ ] fulfilled зі значенням `'ok'`
> - [ ] rejected, бо не можна резолвити промісом
>
> **Пояснення:** `resolve(промісом)` не загортає проміс у проміс, а «прив'язує» долю. Через секунду `p` стане fulfilled зі значенням `'ok'`. Див. [Spec: NewPromiseResolveThenableJob](https://tc39.es/ecma262/#sec-newpromiseresolvethenablejob).

### Ланцюжки: `then`, `catch`, `finally`

Кожен `then` **повертає новий проміс**. Його доля залежить від того, що зробив callback:

| Callback… | Наступний проміс… |
|---|---|
| повернув значення `v` | fulfilled з `v` |
| нічого не повернув | fulfilled з `undefined` |
| кинув виняток `e` | rejected з `e` |
| повернув проміс/thenable | «прив'язується» до нього |

`catch(f)` — це просто `then(undefined, f)`. `finally(f)` викликає `f` без аргументів і **пропускає далі** оригінальне значення чи помилку — хіба що сам `f` кине виняток або поверне rejected проміс.

> [!viz] promise-states
> scenario: chain

```js
Promise.resolve(1)
  .then((x) => x + 1)               // 2
  .then((x) => { console.log(x); }) // друкує 2, повертає undefined
  .then((x) => console.log(x))      // undefined
  .finally(() => 42)                // 42 ігнорується
  .then((x) => console.log(x));     // undefined
// → 2
// → undefined
// → undefined
```

> [!quiz] Перевір себе: що приїде у `then`?
> level: middle · type: output · id: jsd-09-quiz-04
>
> ```js
> Promise.resolve(10)
>   .finally(() => 20)
>   .then((x) => x * 2)
>   .then((x) => { x + 1; })
>   .then((x) => console.log(x));
> ```
>
> **Відповідь:** `undefined`
>
> **Пояснення:** `finally` пропускає `10`, далі `20`, але третій callback у фігурних дужках без `return` — він повертає `undefined`. Класична пастка стрілкових функцій.

> [!quiz] Перевір себе: склади ланцюжок, де помилка будь-якого кроку дає 0, а спінер ховається завжди
> level: middle · type: order · id: jsd-09-quiz-10
>
> ```js order
> fetchUser(id)
>   .then((user) => fetchPosts(user.id))
>   .then((posts) => posts.length)
>   .catch(() => 0)
>   .finally(() => hideSpinner())
>   .then((user) => { fetchPosts(user.id) }) // ✗
> ```
>
> **Пояснення:** кожен `then` повертає проміс, що «прив'язується» до повернутого `fetchPosts(...)`, тож наступний крок отримує вже пости. Один `catch` наприкінці ловить помилку будь-якого кроку, `finally` спрацьовує в обох випадках. Варіант у фігурних дужках без `return` загубив би проміс — далі приїхав би `undefined`.

### Помилки: як rejection тече ланцюжком

Rejection «пролітає» повз усі `then` без другого аргументу, доки не зустріне обробник. Обробник, що повернув значення, **відновлює** ланцюжок — далі знову успіх.

```js
Promise.reject(new Error('x'))
  .then(() => console.log('a'))                         // пропущено
  .catch((e) => { console.log('b', e.message); return 'c'; })
  .then((v) => console.log(v))
  .finally(() => { throw new Error('f'); })              // замінює результат!
  .catch((e) => console.log(e.message));
// → b x
// → c
// → f
```

Важлива різниця: `then(ok, fail)` **не** ловить помилку, кинуту в самому `ok`, — `fail` стосується лише попереднього промісу. `then(ok).catch(fail)` ловить обидві.

> [!quiz] Перевір себе: хто зловить?
> level: middle · type: output · id: jsd-09-quiz-05
>
> ```js
> Promise.resolve()
>   .then(
>     () => { throw new Error('boom'); },
>     () => console.log('A'),
>   )
>   .catch(() => console.log('B'))
>   .then(() => console.log('C'));
> ```
>
> **Відповідь:** `B C`
>
> **Пояснення:** другий аргумент `then` обробляє лише rejection попереднього промісу, а той був fulfilled. Помилку з першого callback-а ловить `catch`, який повертає `undefined` — і ланцюжок знову успішний, тому `C`.

### Thenables і ціна «повернути проміс»

Проміси взаємодіють з будь-яким **thenable** — об'єктом з методом `then`. Коли проміс резолвиться thenable-ом, специфікація ставить окрему job (*NewPromiseResolveThenableJob*), яка викликає його `then`. Так проміси різних бібліотек (jQuery Deferred, Bluebird) «асимілюються» нативними.

```js
const thenable = { then(resolve) { console.log('then called'); resolve(42); } };
Promise.resolve(thenable).then((v) => console.log('value', v));
console.log('sync');
// → sync
// → then called
// → value 42
```

Побічний ефект — **зайві тіки**: повернення промісу з `then` коштує ще дві microtasks (одна — щоб викликати `then`, друга — щоб передати значення).

```js
Promise.resolve()
  .then(() => { console.log(1); return Promise.resolve(2); })
  .then((v) => console.log(v));
Promise.resolve()
  .then(() => console.log(3))
  .then(() => console.log(4))
  .then(() => console.log(5))
  .then(() => console.log(6));
// → 1, 3, 4, 5, 2, 6
```

> [!quiz] Перевір себе: thenable-пастка
> level: senior · id: jsd-09-quiz-06
>
> Що станеться?
>
> ```js
> const user = { name: 'Ann', then(cb) { cb('gotcha'); } };
> Promise.resolve(user).then((u) => console.log(u));
> ```
>
> - [ ] Виведе об'єкт `{ name: 'Ann', then: [Function] }`
> - [x] Виведе `gotcha`
> - [ ] Кине `TypeError`
> - [ ] Нічого не виведе
>
> **Пояснення:** будь-який об'єкт з методом `then` проміси вважають thenable і «розпаковують». Тому ніколи не називай метод доменної моделі `then`.

### Комбінатори: `all`, `allSettled`, `race`, `any`

| Метод | Fulfilled, коли… | Rejected, коли… |
|---|---|---|
| `Promise.all` | **усі** успішні → масив значень у порядку входу | **перший** rejection (fail-fast) |
| `Promise.allSettled` | **усі** осіли → масив `{status, value / reason}` | ніколи |
| `Promise.race` | перший, хто осів, — успіх | перший, хто осів, — помилка |
| `Promise.any` | **перший** успіх | **усі** провалились → `AggregateError` |

> [!viz] promise-states
> scenario: combinators

```js
const wait = (ms, v, fail) =>
  new Promise((res, rej) => setTimeout(() => (fail ? rej(new Error(v)) : res(v)), ms));

Promise.race([wait(50, 'slow'), wait(10, 'boom', true)]).catch((e) => console.log('race:', e.message));
Promise.any([wait(50, 'slow'), wait(10, 'boom', true)]).then((v) => console.log('any:', v));
// → race: boom
// → any: slow
```

Краєві випадки: `Promise.all([])` одразу fulfilled з `[]`; `Promise.any([])` одразу rejected з `AggregateError`; `Promise.race([])` — **назавжди pending**. І жоден комбінатор не **скасовує** решту операцій — вони просто перестають цікавити результат.

> [!quiz] Перевір себе: який комбінатор?
> level: middle · id: jsd-09-quiz-07
>
> Є три дзеркала CDN. Треба взяти дані з того, хто **першим відповість успішно**; помилка — лише якщо впали всі.
>
> - [ ] `Promise.all`
> - [ ] `Promise.race`
> - [x] `Promise.any`
> - [ ] `Promise.allSettled`
>
> **Пояснення:** `race` повернув би першу **помилку**, якщо найшвидше впало дзеркало. `any` ігнорує провали, доки є шанс на успіх, і кидає `AggregateError`, лише коли впали всі.

> [!quiz] Перевір себе: заповни пропуски в `delay` і `withTimeout`
> level: middle · type: fill · id: jsd-09-quiz-11 · bank: all, any, then
>
> ```js fill
> function delay(ms, value) {
>   return [[new]] Promise(([[resolve]]) => setTimeout(() => resolve(value), ms))
> }
>
> function withTimeout(promise, ms) {
>   return Promise.[[race]]([
>     promise,
>     new Promise((_, [[reject]]) => setTimeout(() => reject(new Error('timeout')), ms)),
>   ])
> }
> ```
>
> **Пояснення:** executor отримує `resolve` і `reject` саме в такому порядку — тому для таймауту перший параметр пропускаємо як `_`. `race` осідає разом з першим, хто осів: встиг `promise` — його результат, ні — помилка таймауту. Сам запит при цьому не скасовується.

### Unhandled rejections

Rejected проміс без обробника — це «помилка в нікуди». Хост відстежує такі випадки:

- **Браузер** — подія `unhandledrejection` на `window` і `Uncaught (in promise)` у консолі; якщо обробник додали пізніше — подія `rejectionhandled`.
- **Node.js** (з v15) — за замовчуванням режим `--unhandled-rejections=throw`: необроблений rejection **завалює процес** з кодом 1, якщо немає слухача `process.on('unhandledRejection')`.

```js
window.addEventListener('unhandledrejection', (event) => {
  reportToSentry(event.reason);
  event.preventDefault(); // прибрати стандартний лог у консоль
});
```

Rejection вважається необробленим, якщо до кінця поточного microtask checkpoint-у ніхто не підписався. Тому «спершу створити, а `catch` додати після `await` іншого промісу» — рецепт фальшивих тривог.

> [!quiz] Перевір себе: необроблені rejections
> level: middle · type: multi · id: jsd-09-quiz-08
>
> - [x] У Node 15+ необроблений rejection за замовчуванням завершує процес
> - [ ] `try/catch` навколо `promise.then(...)` зловить rejection цього промісу
> - [x] У браузері можна глобально перехопити їх через `unhandledrejection`
> - [x] `Promise.all` з одним rejected промісом і `.catch` наприкінці не дасть unhandled rejection
>
> **Пояснення:** синхронний `try/catch` закінчується раніше, ніж проміс осяде, — він ловить лише синхронні винятки (або rejection під `await`).

### Promisify: міст від callback-ів

Старі API (Node-стиль `(err, result) => …`) загортають у проміс один раз — і далі живуть у світі `then`/`await`. У Node є готовий `util.promisify`, а більшість модулів мають `/promises`-версії (`fs/promises`, `timers/promises`).

```js
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, value) => (err ? reject(err) : resolve(value)));
    });
  };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
```

`new Promise` потрібен **лише** на межі з callback-API. Якщо всередині вже є проміс — просто поверни його або чейни (`return fetch(url).then(…)`), інакше отримаєш *explicit construction anti-pattern*.

> [!quiz] Перевір себе: антипатерн
> level: middle · id: jsd-09-quiz-09
>
> ```js
> function getUser(id) {
>   return new Promise((resolve) => {
>     fetch(`/users/${id}`).then((r) => r.json()).then(resolve);
>   });
> }
> ```
>
> Що з цим кодом не так?
>
> - [ ] Нічого, це ідіоматичний код
> - [x] Помилка мережі чи парсингу ніколи не дійде до того, хто викликав — проміс зависне в pending
> - [ ] `resolve` не можна передавати як callback
>
> **Пояснення:** зовнішній проміс не має `reject`, тож rejection усередині губиться (і ще й стає unhandled). Правильно: `return fetch(...).then((r) => r.json())`.

## ⚠️ Пастки

> [!pitfall] Забутий `return` розриває ланцюжок
> Без `return` наступний `then` не чекає внутрішню операцію і отримує `undefined`, а помилка внутрішнього промісу стає unhandled.
>
> ```js
> getUser()
>   .then((user) => { saveUser(user); })   // ❌ не чекає saveUser
>   .then(() => console.log('saved?'));     // друкує до збереження
>
> getUser()
>   .then((user) => saveUser(user))        // ✅
>   .then(() => console.log('saved'));
> ```

> [!pitfall] `async` executor і throw з колбека
> Executor ловить лише **синхронні** винятки. Виняток у таймері чи в колбеці всередині executor-а не стане rejection — він вилетить як uncaught.
>
> ```js
> new Promise(() => {
>   setTimeout(() => { throw new Error('lost'); }, 0);
> }).catch(() => console.log('never'));
> // → Uncaught Error: lost; проміс назавжди pending
> ```
>
> `new Promise(async (resolve) => …)` — ще гірше: rejection async-функції ніхто не слухає. Викликай `reject` явно.

> [!pitfall] `Promise.all` не скасовує решту
> Після першого rejection `all` одразу відхиляється, але інші запити **продовжують виконуватися** — вони просто «нікому не потрібні». Їхні rejection-и при цьому вважаються обробленими (тихо проковтнуться). Якщо треба реально зупинити роботу — передавай `AbortSignal` (див. [[JavaScript - 10. async і await]]).

> [!pitfall] Thenable-об'єкти «з'їдаються»
> Об'єкт з методом `then` при `resolve`/`await` буде розпакований. Модель `Query` з методом `then` (як у деяких ORM) — це свідомий хак; випадковий метод `then` у DTO — баг, який важко знайти.

## 🎤 На співбесіді

> [!interview] Що таке Promise і які в нього стани?
> level: junior · frequency: дуже часто · id: jsd-09-int-01
>
> ---
>
> Об'єкт-контейнер для результату асинхронної операції. Стани: `pending`, `fulfilled` (значення), `rejected` (причина); останні два — settled, перехід можливий лише раз. Реакції підписуються через `then/catch/finally`, завжди виконуються асинхронно як microtasks, а кожен `then` повертає новий проміс — тому їх можна чейнити. Бонус: розрізняю *resolved* (долю визначено, можливо, прив'язано до іншого промісу) і *fulfilled* (успішно осів).
>
> 📚 [[JavaScript - 09. Promise#Стани та долі|Розділ: стани та долі]] · [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) · [javascript.info: Promise](https://javascript.info/promise-basics)

> [!interview] Чим відрізняються `Promise.all`, `allSettled`, `race` і `any`?
> level: middle · frequency: дуже часто · id: jsd-09-int-02
>
> ---
>
> `all` — чекає всіх успіхів, падає на першій помилці (fail-fast), порядок результатів = порядок входу. `allSettled` — чекає всіх, ніколи не падає, повертає статуси (для «покажи, що вдалося»). `race` — перший осілий, хоч успіх, хоч помилка (класика — таймаут). `any` — перший **успіх**, `AggregateError`, якщо впали всі (дзеркала, fallback-и). Жоден не скасовує решту операцій; для цього — `AbortController`.
>
> 📚 [[JavaScript - 09. Promise#Комбінатори: all, allSettled, race, any|Розділ: комбінатори]] · [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) · [javascript.info: Promise API](https://javascript.info/promise-api)

> [!interview] Навіщо проміси, якщо є callback-и?
> level: middle · frequency: часто · id: jsd-09-int-03
>
> ---
>
> Не лише через вкладеність. Головне — **inversion of control**: callback віддає керування чужому коду й довіряє йому викликати нас рівно раз і асинхронно. Проміс повертає керування: це значення з гарантіями мови (settle один раз, реакції — microtasks, винятки → rejection). Плюс композиція (`all`, `any`), єдиний канал помилок через ланцюжок і основа для `async/await`.
>
> 📚 [[JavaScript - 09. Promise#Навіщо: callback hell та inversion of control|Розділ: навіщо проміси]] · [MDN: Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) · [javascript.info: Introduction: callbacks](https://javascript.info/callbacks)

## 🔗 Зв'язки

- [[JavaScript - 08. Event Loop]] — реакції промісів — це microtasks; без цієї моделі порядок виводу не передбачити.
- [[JavaScript - 10. async і await]] — синтаксичний цукор над промісами, з тими самими правилами помилок і тіків.
- [[JavaScript - 05. Замикання]] — `resolve`/`reject` «витікають» з executor-а саме через замикання (так працює `Promise.withResolvers`).
- [[JavaScript - 14. Debounce, throttle та async-патерни]] — retry, timeout і пул конкурентності будуються з комбінаторів промісів.

## ⚡ Фішки

> [!reel] 🎟️ resolve() ≠ «виконано»
> Проміс може бути resolved і водночас pending — якщо його зарезолвили іншим промісом, який ще не осів. «Resolved» означає «долю вирішено», а не «успіх».

> [!reel] 🕳️ Promise.race([]) не осяде ніколи
> `Promise.all([])` миттєво fulfilled, `Promise.any([])` миттєво rejected, а `Promise.race([])` назавжди pending — переможця немає, тож перегони не закінчуються.

> [!reel] 🦆 Будь-який об'єкт з then — уже майже проміс
> `await { then(r) { r(42) } }` поверне `42`. Проміси асимілюють thenables — так колись подружились jQuery, Bluebird і нативні проміси.
>
> ```js
> console.log(await { then: (r) => r(42) }); // 42
> ```

> [!reel] 🐢 return Promise у then — плюс два тіки
> Повернення промісу з `then` змушує специфікацію викликати його `then` в окремій job — це дві додаткові microtasks. Тому «паралельний» ланцюжок з простими значеннями обганяє.

> [!reel] 🧰 Promise.withResolvers прибрав старий хак
> ES2024: `const { promise, resolve, reject } = Promise.withResolvers()` — замість `let resolve; new Promise((r) => (resolve = r))`. А `Promise.try(fn)` (ES2025) ловить і синхронні винятки `fn`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Які стани має проміс і чи можна змінити стан після settle?
> *дуже часто · теорія* · `jsd-09-001`
>
> `pending`, `fulfilled`, `rejected`. Перехід з `pending` — лише один і назавжди: повторні `resolve`/`reject` ігноруються.
>
> 📚 [[JavaScript - 09. Promise#Стани та долі|Розділ: стани та долі]] · [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) · [Domenic Denicola: States and Fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md)

> [!question]- Коли виконується executor `new Promise(executor)`?
> *часто · код* · `jsd-09-002`
>
> Синхронно, одразу під час виклику конструктора. Асинхронні лише реакції `then/catch/finally`.
>
> ```js
> new Promise(() => console.log('A'));
> console.log('B');
> // → A, B
> ```
>
> 📚 [[JavaScript - 09. Promise#Стани та долі|Розділ: стани та долі]] · [MDN: Promise() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise) · [javascript.info: Promise](https://javascript.info/promise-basics)

> [!question]- Що отримає наступний `then`, якщо callback нічого не повернув?
> *часто · код* · `jsd-09-003`
>
> `undefined` — наступний проміс fulfilled з `undefined`. Типова причина — фігурні дужки стрілкової функції без `return`.
>
> 📚 [[JavaScript - 09. Promise#Ланцюжки: then, catch, finally|Розділ: ланцюжки]] · [MDN: Promise.prototype.then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) · [javascript.info: Promises chaining](https://javascript.info/promise-chaining)

### 🟡 Middle

> [!question]- Чим `then(ok, fail)` відрізняється від `then(ok).catch(fail)`?
> *часто · порівняння* · `jsd-09-004`
>
> У першому випадку `fail` обробляє лише rejection попереднього промісу; помилку, кинуту в `ok`, він не побачить. У другому `catch` стоїть після `then` і ловить обидва джерела.
>
> 📚 [[JavaScript - 09. Promise#Помилки: як rejection тече ланцюжком|Розділ: помилки в ланцюжку]] · [MDN: Promise.prototype.then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) · [javascript.info: Error handling with promises](https://javascript.info/promise-error-handling)

> [!question]- Що робить `finally` зі значенням і помилкою?
> *часто · теорія* · `jsd-09-005`
>
> Callback не отримує аргументів, а результат ланцюжка пропускає далі без змін. Виняток — якщо callback кинув помилку або повернув rejected проміс: тоді вона замінює результат.
>
> 📚 [[JavaScript - 09. Promise#Ланцюжки: then, catch, finally|Розділ: finally]] · [MDN: Promise.prototype.finally()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally) · [Spec: Promise.prototype.finally](https://tc39.es/ecma262/#sec-promise.prototype.finally)

> [!question]- Чому `Promise.race` — погана ідея для «першого успішного» запиту?
> *іноді · порівняння* · `jsd-09-006`
>
> `race` повертає першого, хто **осів**, — включно з помилкою. Якщо найшвидше відповіло зламане джерело, отримаєш rejection. Для першого успіху — `Promise.any`.
>
> 📚 [[JavaScript - 09. Promise#Комбінатори: all, allSettled, race, any|Розділ: комбінатори]] · [MDN: Promise.any()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any) · [MDN: Promise.race()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)

> [!question]- Що таке explicit construction anti-pattern?
> *іноді · практика* · `jsd-09-007`
>
> Загортання вже наявного промісу в `new Promise`. Легко загубити `reject` — і помилки зникають, проміс висить у pending. Правило: `new Promise` — лише на межі з callback-API, інакше повертай/чейни наявний проміс.
>
> 📚 [[JavaScript - 09. Promise#Promisify: міст від callback-ів|Розділ: promisify]] · [MDN: Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) · [MDN: Promise() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise)

> [!question]- Що станеться з необробленим rejection у Node.js і в браузері?
> *часто · теорія* · `jsd-09-008`
>
> Node 15+: за замовчуванням процес завершиться з помилкою (режим `throw`), якщо немає `process.on('unhandledRejection')`. Браузер: подія `unhandledrejection` і `Uncaught (in promise)` у консолі, сторінка працює далі.
>
> 📚 [[JavaScript - 09. Promise#Unhandled rejections|Розділ: unhandled rejections]] · [MDN: unhandledrejection event](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event) · [Node.js: unhandledRejection](https://nodejs.org/api/process.html#event-unhandledrejection)

### 🔴 Senior

> [!question]- Чим resolved відрізняється від fulfilled?
> *іноді · теорія* · `jsd-09-009`
>
> Fulfilled — стан (успішно осів). Resolved — доля: проміс уже не можна змінити ззовні, бо його осіли **або** прив'язали до іншого промісу/thenable. Resolved-проміс може бути pending, fulfilled чи навіть rejected (якщо прив'язаний до rejected).
>
> 📚 [[JavaScript - 09. Promise#Стани та долі|Розділ: стани та долі]] · [Domenic Denicola: States and Fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md) · [Spec: Promise Resolve Functions](https://tc39.es/ecma262/#sec-promise-resolve-functions)

> [!question]- Чому повернення промісу з `then` додає microtasks?
> *рідко · теорія* · `jsd-09-010`
>
> Резолв thenable-ом за специфікацією не синхронний: ставиться *NewPromiseResolveThenableJob* (1 тік), яка викликає `then` вкладеного промісу, а його реакція — ще один тік. Тому в гонках ланцюжків такий крок «запізнюється» на дві позиції.
>
> 📚 [[JavaScript - 09. Promise#Thenables і ціна «повернути проміс»|Розділ: thenables]] · [Spec: NewPromiseResolveThenableJob](https://tc39.es/ecma262/#sec-newpromiseresolvethenablejob) · [V8: Faster async functions and promises](https://v8.dev/blog/fast-async)

## 🛠️ Практика

> [!task] Поясни своїми словами: inversion of control
> level: junior · difficulty: easy · id: jsd-09-task-01 · tags: feynman, promise
>
> Поясни молодшому колезі, чому проміси — це не просто «красивіші callback-и». Обов'язково згадай: хто кличе твій код, які гарантії дає мова і що таке «Zalgo». До 6 речень.
>
> > [!hint]- Підказка 1
> > Уяви, що callback передаєш у платіжну бібліотеку стороннього вендора. Що може піти не так?
>
> > [!hint]- Підказка 2
> > Проміс — це **значення**, яке повертається тобі. Що ти можеш з ним робити?
>
> > [!solution]- Еталонне пояснення
> > Коли ти передаєш callback у чужу функцію, ти віддаєш їй керування: вона вирішує, викликати його раз, двічі чи жодного, синхронно чи асинхронно, і чи передати помилку. Ситуацію «інколи синхронно, інколи ні» називають Zalgo — вона породжує баги, що залежать від кешу чи таймінгу. Проміс перевертає модель: функція повертає **тобі** об'єкт-обіцянку, і ти сам вирішуєш, що з нею робити — підписатися, передати, скомбінувати. Мова гарантує, що проміс осяде один раз, реакції завжди асинхронні, а винятки перетворюються на rejection. Тож довіряти потрібно специфікації, а не кожній бібліотеці.

> [!task] Реалізуй `promisify`
> level: middle · difficulty: medium · id: jsd-09-task-02 · tags: promise, callbacks
>
> Напиши `promisify(fn)` для функцій у Node-стилі (`callback(err, value)` — останній аргумент). Збережи `this`. Перевір на прикладі:
>
> ```js
> const obj = {
>   base: 10,
>   add(x, cb) { setTimeout(() => (x < 0 ? cb(new Error('neg')) : cb(null, this.base + x)), 10); },
> };
> obj.addAsync = promisify(obj.add);
> obj.addAsync(5).then(console.log);                     // → 15
> obj.addAsync(-1).catch((e) => console.log(e.message)); // → neg
> ```
>
> ```js starter
> function promisify(fn) {
>   // твій код
> }
> ```
>
> ```js tests
> const nodeAdd = (a, b, cb) => setTimeout(() => cb(null, a + b), 5)
> const nodeFail = (cb) => setTimeout(() => cb(new Error('neg')), 5)
>
> test('повертає проміс, що резолвиться значенням з callback', async () => {
>   const add = promisify(nodeAdd)
>   const p = add(2, 3)
>   expect(p).toBeInstanceOf(Promise)
>   await expect(p).resolves.toBe(5)
> })
>
> test('err у callback → rejection', async () => {
>   await expect(promisify(nodeFail)()).rejects.toThrow('neg')
> })
>
> test('зберігає this виклику', async () => {
>   const obj = {
>     base: 10,
>     add(x, cb) { setTimeout(() => cb(null, this.base + x), 5) },
>   }
>   obj.addAsync = promisify(obj.add)
>   await expect(obj.addAsync(5)).resolves.toBe(15)
> })
>
> test('синхронний throw у fn теж стає rejection', async () => {
>   const broken = promisify(() => { throw new Error('sync') })
>   await expect(broken()).rejects.toThrow('sync')
> })
> ```
>
> > [!hint]- Підказка 1
> > Поверни звичайну `function` (не стрілку), щоб отримати `this` виклику.
>
> > [!hint]- Підказка 2
> > Додай власний callback останнім аргументом і в ньому виклич `resolve` або `reject`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function promisify(fn) {
> >   return function (...args) {
> >     return new Promise((resolve, reject) => {
> >       fn.call(this, ...args, (err, value) => {
> >         if (err) reject(err);
> >         else resolve(value);
> >       });
> >     });
> >   };
> > }
> > ```
> >
> > Якщо `fn` кине синхронно — executor перетворить це на rejection автоматично. Справжній `util.promisify` ще підтримує `fn[util.promisify.custom]` і колбеки з кількома значеннями (як у `dns.lookup`).

> [!task] Реалізуй `Promise.all`
> level: middle · difficulty: hard · id: jsd-09-task-03 · tags: promise, combinators
>
> Напиши `promiseAll(iterable)` з поведінкою нативного `Promise.all`: порядок результатів = порядок входу (не порядок завершення), не-проміси приймаються як значення, порожній вхід → `[]`, перший rejection відхиляє результат.
>
> ```js starter
> function promiseAll(iterable) {
>   // твій код
> }
> ```
>
> ```js tests
> const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms))
>
> test('порядок результатів — порядок входу, а не завершення', async () => {
>   await expect(promiseAll([wait(30, 'slow'), wait(5, 'fast')])).resolves.toEqual(['slow', 'fast'])
> })
>
> test('не-проміси приймаються як значення', async () => {
>   await expect(promiseAll([1, Promise.resolve(2), 'три'])).resolves.toEqual([1, 2, 'три'])
> })
>
> test('порожній вхід → []', async () => {
>   await expect(promiseAll([])).resolves.toEqual([])
> })
>
> test('перший rejection відхиляє результат, не чекаючи решти', async () => {
>   const never = new Promise(() => {})
>   const fail = Promise.reject(new Error('boom'))
>   await expect(promiseAll([never, fail])).rejects.toThrow('boom')
> })
>
> test('приймає будь-який iterable, наприклад Set', async () => {
>   await expect(promiseAll(new Set([wait(5, 'a'), 'b']))).resolves.toEqual(['a', 'b'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Обгорни кожен елемент у `Promise.resolve(item)` — так обробляються і значення, і thenables.
>
> > [!hint]- Підказка 2
> > Пиши результат за індексом `results[i] = v` і тримай лічильник завершених — `results.length` тут не допоможе.
>
> > [!hint]- Підказка 3
> > Не забудь випадок порожнього входу: лічильник ніколи не дійде до кінця сам.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function promiseAll(iterable) {
> >   return new Promise((resolve, reject) => {
> >     const items = Array.from(iterable);
> >     const results = new Array(items.length);
> >     let remaining = items.length;
> >     if (remaining === 0) return resolve(results);
> >
> >     items.forEach((item, i) => {
> >       Promise.resolve(item).then((value) => {
> >         results[i] = value;
> >         if (--remaining === 0) resolve(results);
> >       }, reject); // перший reject виграє, решта ігнорується
> >     });
> >   });
> > }
> >
> > promiseAll([1, Promise.resolve(2), new Promise((r) => setTimeout(() => r(3), 10))])
> >   .then(console.log); // → [1, 2, 3]
> > ```
> >
> > Повторні `reject`/`resolve` безпечні — проміс осідає один раз. Бонус: `allSettled` — те саме, але обидві гілки пишуть `{ status, value | reason }` і ніхто не відхиляє.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Promise](https://javascript.info/promise-basics) — executor, стани і споживачі промісу.
- 🟢 [javascript.info — Promises chaining](https://javascript.info/promise-chaining) — як `then` повертає новий проміс і будує ланцюжок.
- 🟡 [MDN — Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — ланцюжки, обробка помилок і композиція.
- 🟡 [javascript.info — Promise API](https://javascript.info/promise-api) — `all`, `allSettled`, `race`, `any` з прикладами.
- 🟡 [Domenic Denicola — States and Fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md) — різниця між resolved і fulfilled від автора специфікації промісів.
- 🔴 [ECMAScript — Promise Objects](https://tc39.es/ecma262/#sec-promise-objects) — першоджерело: стани, реакції і resolve functions.
- 🔴 [ECMAScript — NewPromiseResolveThenableJob](https://tc39.es/ecma262/#sec-newpromiseresolvethenablejob) — звідки зайві microtasks при поверненні промісу.
- 🔴 [HTML Standard — Unhandled promise rejections](https://html.spec.whatwg.org/multipage/webappapis.html#unhandled-promise-rejections) — як браузер відстежує необроблені rejections.
- 🛠️ [typescript-eslint — no-floating-promises](https://typescript-eslint.io/rules/no-floating-promises/) — лінтер, що ловить «загублені» проміси.

> [!important] Підсумок
> - Проміс — значення з гарантіями: settle один раз, реакції — microtasks, винятки → rejection. Це лікує inversion of control.
> - Стан (pending / fulfilled / rejected) ≠ доля (resolved): resolved-проміс може ще чекати на інший.
> - Кожен `then` повертає новий проміс; без `return` ланцюжок отримує `undefined`, `finally` пропускає значення наскрізь.
> - `all` — усі або перша помилка, `allSettled` — усі статуси, `race` — перший осілий, `any` — перший успіх; ніхто не скасовує решту.
> - Необроблений rejection у Node 15+ валить процес; `new Promise` потрібен лише на межі з callback-API.
