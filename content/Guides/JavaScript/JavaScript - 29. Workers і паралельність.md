---
title: Workers і паралельність
order: 29
level: senior
tags: [workers, concurrency, parallelism, sharedarraybuffer, atomics, worker-threads, performance]
prerequisites:
  - "[[JavaScript - 08. Event Loop]]"
  - "[[JavaScript - 09. Promise]]"
  - "[[JavaScript - 23. JSON, structuredClone і серіалізація]]"
estimatedMinutes: 55
id: jsd-ch-29
icon: "👷"
---

# JavaScript - 29. Workers і паралельність

> [!success] 🎯 Після цього розділу ти зможеш
> - Чітко розрізнити конкурентність і паралельність і пояснити, чому `Promise.all` не прискорює важкі обчислення.
> - Винести CPU-задачу у Web Worker або `worker_threads`, з прогресом, помилками й скасуванням.
> - Оцінити вартість `postMessage`: що копіює structured clone, коли брати transferables і коли — `SharedArrayBuffer` + `Atomics`.
> - Пояснити, навіщо `SharedArrayBuffer` потрібна cross-origin isolation (COOP + COEP) і що змінилось після Spectre.
> - Написати мінімальний RPC у стилі Comlink і пул воркерів — і вирішити, чи воркер узагалі окупиться.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-29-quiz-01
>
> ```js
> // fib.js рахує fib(40) — це ~1 с роботи — і надсилає результат назад
> const worker = new Worker('fib.js');
> worker.onmessage = (e) => console.log('result');
> worker.postMessage(40);
> console.log('posted');
> setTimeout(() => console.log('timer'), 0);
> ```
>
> **Відповідь:** `posted timer result`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. `postMessage` не чекає на воркер: повідомлення ставиться в чергу іншого потоку, і головний потік одразу йде далі. Таймер спрацює за кілька мілісекунд, а результат прийде як окрема задача (message event) лише через секунду — і весь цей час сторінка жива.

## 🧒 Простими словами

Головний потік браузера — це **один кухар**, який ще й обслуговує зал: приймає замовлення (кліки), розносить страви (рендер). Event loop дозволяє йому вправно перемикатися між справами — це **конкурентність**. Але якщо він сяде чистити мішок картоплі (важке обчислення), зал чекатиме. **Воркер** — це помічник у підсобці: окремі руки, окремий стіл. Спілкуються вони лише записками через віконце (`postMessage`): записку треба написати й прочитати (копіювання), або можна просто передати миску з рук у руки (transfer). А `SharedArrayBuffer` — це спільна дошка, на якій пишуть обидва одночасно, тож без правил (`Atomics`) вони зітруть написане одне одного.

## 🔬 Як це працює насправді

### Конкурентність vs паралельність

- **Конкурентність** (concurrency) — кілька задач **у процесі** одночасно, але виконуються по черзі. Event loop, `async/await`, `Promise.all` — це конкурентність: один потік, перемикання на `await` ([[JavaScript - 08. Event Loop]]).
- **Паралельність** (parallelism) — кілька задач **виконуються в ту саму мить** на різних ядрах. У JS це дають лише окремі агенти: Web Workers, `worker_threads`, окремі процеси.

```text
Конкурентність (1 потік):   main  ██A██░░B░░██A██░░B░░██A██     ← перемикання
Паралельність (2 потоки):   main  ██A████████A████████A██
                            work  ░░B████████B████████B██     ← справді одночасно
```

Кожен воркер — окремий **агент** зі своїм heap, глобальним об'єктом і event loop. Спільних змінних немає: за замовчуванням дані лише **копіюються** між ними. Тому класичних гонок даних немає — доки ти сам не візьмеш `SharedArrayBuffer`.

Чому це важливо у браузері: головний потік рендерить кадри. При 60 Гц на кадр є ~16,7 мс, і будь-яка задача довша за 50 мс уже вважається *long task* — сторінка «підвисає», а INP псується ([[JavaScript - 31. Продуктивність і V8]]).

> [!quiz] Перевір себе: де паралельність?
> level: middle · type: multi · id: jsd-29-quiz-02
>
> Що з цього виконує **JS-код** одночасно на різних ядрах?
>
> - [ ] `await Promise.all([heavySyncA(), heavySyncB()])`, де обидві функції синхронно рахують 1 с
> - [x] Два Web Worker-и, кожен рахує свою половину масиву
> - [ ] `setTimeout(heavy, 0)` — «віддати в фон»
> - [x] Два `worker_threads` у Node.js
> - [ ] `async function` з кількома `await` усередині
>
> **Пояснення:** `Promise.all` лише чекає вже запущені операції; `heavySyncA()` і `heavySyncB()` виконаються послідовно ще до виклику `all`. `setTimeout` відкладає роботу на той самий потік. Справжню паралельність JS-коду дають лише окремі агенти.

### Dedicated Worker — окремий потік з власним event loop

```js
// ── main.js ──
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
worker.postMessage({ type: 'sum', numbers: [1, 2, 3] });
worker.addEventListener('message', (e) => console.log(e.data)); // → 6
worker.addEventListener('error', (e) => console.error('впав:', e.message));
worker.addEventListener('messageerror', () => console.error('не вдалося десеріалізувати'));
// worker.terminate() — вбити негайно ззовні

// ── worker.js ──
self.addEventListener('message', (e) => {
  if (e.data.type === 'sum') self.postMessage(e.data.numbers.reduce((a, b) => a + b, 0));
}); // self.close() — завершитися зсередини
```

Що є і чого немає у воркера:

| ✅ Є | ❌ Немає |
|---|---|
| `fetch`, `WebSocket`, `IndexedDB`, `Cache API` | DOM, `document`, `window` |
| таймери, `Promise`, `import` (module worker) | `localStorage` / `sessionStorage` |
| `OffscreenCanvas`, `crypto.subtle`, `WebAssembly` | `alert`, синхронний доступ до сторінки |

`{ type: 'module' }` вмикає ESM-імпорти у воркері ([[JavaScript - 21. Модулі — ESM, CommonJS і бандлери]]); бандлери (Vite, webpack 5) розпізнають саме патерн `new URL('./worker.js', import.meta.url)`.

> [!viz] worker-messaging
> scenario: postmessage

> [!quiz] Перевір себе: що доступно у воркері?
> level: junior · type: multi · id: jsd-29-quiz-03
>
> - [x] `fetch('/api/data')`
> - [ ] `document.querySelector('#app')`
> - [x] `indexedDB.open('db')`
> - [ ] `localStorage.getItem('token')`
> - [x] `setTimeout(fn, 100)`
>
> **Пояснення:** воркер не має доступу до DOM і синхронних сховищ сторінки — лише до асинхронних API, що безпечні для іншого потоку. Щоб змінити DOM, воркер надсилає результат, а головний потік рендерить.

### Structured clone — що копіюється і скільки це коштує

`postMessage(data)` не передає посилання: дані проходять **structured clone** — той самий алгоритм, що й у `structuredClone()` ([[JavaScript - 23. JSON, structuredClone і серіалізація]]). Він глибший за JSON, але має межі:

| Копіюється ✅ | Губиться ⚠️ | Помилка `DataCloneError` ❌ |
|---|---|---|
| примітиви (крім Symbol), `Date`, `RegExp`, `Map`, `Set` | прототип: екземпляр класу стає звичайним об'єктом | функції та методи |
| масиви, typed arrays, `ArrayBuffer`, `Blob`, `File` | геттери — копіюється лише поточне **значення** | `Symbol` як значення |
| `Error` (зі збереженням типу), циклічні посилання | ключі-символи, неперелічувані властивості | DOM-вузли |

```js
class User { constructor(name) { this.name = name; } hi() { return 'hi'; } }
const copy = structuredClone({ when: new Date(0), user: new User('Ann') });
console.log(copy.when instanceof Date);  // → true
console.log(copy.user instanceof User);  // → false — методів більше немає
structuredClone({ f() {} });             // ❌ DataCloneError
```

**Вартість.** Клонування — це серіалізація на потоці-відправнику **синхронно** плюс десеріалізація на отримувачі. Час росте лінійно з розміром і кількістю об'єктів. Десятки кілобайт — непомітно; мегабайтний граф об'єктів — помітні мілісекунди на **обох** потоках (спрощено: точні цифри залежать від рушія й форми даних, тому міряй).

> [!quiz] Перевір себе: structured clone
> level: middle · type: multi · id: jsd-29-quiz-04
>
> Ти надсилаєш у воркер `{ map: new Map([[1, 'a']]), user: new User('Ann'), onDone() {} }`. Що станеться?
>
> - [ ] `map` перетвориться на `{}`, як у `JSON.stringify`
> - [ ] `user` прийде екземпляром `User` з методом `hi`
> - [x] `postMessage` кине `DataCloneError` через метод `onDone`
> - [x] Без `onDone` `map` прийшла б справжньою `Map`, а `user` — звичайним об'єктом `{ name: 'Ann' }`
>
> **Пояснення:** функції не клонуються — і помилка виникає синхронно на виклику `postMessage`. `Map` клонується повноцінно, а прототип класу губиться: на тому боці немає «твого» класу.

### Transferables — передати, а не копіювати

Деякі об'єкти можна **передати** (transfer): власність переходить до отримувача за O(1), без копіювання байтів, а в оригінала лишається порожня оболонка — він стає *detached*.

```js
const pixels = new Uint8Array(1024 * 1024 * 4);           // 4 МБ
worker.postMessage({ pixels }, [pixels.buffer]);           // список transfer
console.log(pixels.buffer.byteLength, pixels.length);      // → 0 0
```

Що можна передавати: `ArrayBuffer`, `MessagePort`, `ImageBitmap`, `OffscreenCanvas`, потоки (`ReadableStream`, `WritableStream`, `TransformStream`), `VideoFrame`, `AudioData` та ін. Передається саме **буфер**, а не view (`Uint8Array`): view клонується як «обгортка» над переданим буфером.

```text
Копія (clone):      main [■■■■ 4 МБ] ──serialize──► worker [■■■■ 4 МБ]   час ∝ розміру
Передача (transfer): main [  0 Б  ]  ──власність──► worker [■■■■ 4 МБ]   O(1)
```

`OffscreenCanvas` — окремий вау-кейс: `canvas.transferControlToOffscreen()` віддає полотно воркеру, і той малює без участі головного потоку.

> [!viz] worker-messaging
> scenario: transfer

> [!quiz] Перевір себе: після передачі
> level: middle · type: output · id: jsd-29-quiz-05
>
> ```js
> const buf = new ArrayBuffer(8);
> const view = new Int32Array(buf);
> const moved = structuredClone(buf, { transfer: [buf] });
> console.log(buf.byteLength, view.length, moved.byteLength);
> ```
>
> **Відповідь:** `0 0 8`
>
> **Пояснення:** після transfer вихідний буфер detached: `byteLength` — 0, і всі view над ним теж «порожні». `structuredClone(value, { transfer })` — зручний спосіб перевірити це навіть без воркера (у браузері й Node).

> [!quiz] Заповни пропуски: передай 4 МБ без копіювання
> level: middle · type: fill · id: jsd-29-quiz-10 · bank: byteOffset, 4194304, clone
>
> ```js fill
> const pixels = new Uint8Array(1024 * 1024 * 4)
> worker.postMessage({ pixels }, [pixels.[[buffer]]])
> console.log(pixels.[[length]]) // → [[0]]
> ```
>
> **Пояснення:** у список transfer потрапляє `ArrayBuffer`, а не view. Після передачі буфер detached, тож і `byteLength`, і `length` view над ним дорівнюють `0`.

### SharedArrayBuffer і Atomics

`SharedArrayBuffer` (SAB) — пам'ять, яку бачать **кілька агентів одночасно**. Його не клонують і не передають: при `postMessage` обидві сторони отримують доступ до **тих самих** байтів. Разом зі спільною пам'яттю приходять гонки даних:

```js
// 4 воркери (Node, worker_threads) отримали той самий SAB і по 1 000 000 разів роблять:
const view = new Int32Array(workerData.sab);
view[0]++;                 // варіант A: разом → щось на кшталт 1 226 415 замість 4 000 000 😱
Atomics.add(view, 0, 1);   // варіант B: разом → рівно 4 000 000
```

`view[0]++` — це «прочитати → додати → записати»: два потоки читають те саме значення, і один інкремент губиться. `Atomics` дає неподільні операції й синхронізацію:

| Операція | Навіщо |
|---|---|
| `Atomics.add/sub/and/or/xor`, `exchange` | атомарна зміна з поверненням старого значення |
| `Atomics.compareExchange` | основа lock-free алгоритмів і м'ютексів |
| `Atomics.load/store` | читання/запис з гарантією видимості для інших потоків |
| `Atomics.wait` / `Atomics.notify` | заснути, доки значення не зміниться / розбудити |
| `Atomics.waitAsync` (ES2024) | неблокувальне очікування — повертає проміс |

`Atomics.wait` **блокує** потік, тому в головному потоці браузера заборонений (кидає `TypeError`) — там тільки `waitAsync`.

**Cross-origin isolation.** Після атак Spectre (2018) браузери вимкнули SAB: спільна пам'ять + воркер-лічильник = надточний таймер для читання чужої пам'яті через побічні канали. Повернули його лише для сторінок, ізольованих від чужих ресурсів двома заголовками відповіді: `Cross-Origin-Opener-Policy: same-origin` і `Cross-Origin-Embedder-Policy: require-corp` (або `credentialless`).

Перевірка в коді — `self.crossOriginIsolated === true`. Ціна: кожен крос-доменний ресурс (зображення, iframe, скрипт) має дозволити вбудовування через CORS або `Cross-Origin-Resource-Policy`, а popup-и інших сайтів (OAuth, платіжні вікна) втрачають `window.opener`.

> [!quiz] Перевір себе: умови для SharedArrayBuffer
> level: senior · type: multi · id: jsd-29-quiz-06
>
> Що потрібно, щоб `new SharedArrayBuffer(1024)` працював на сторінці в сучасному браузері?
>
> - [x] Заголовок `Cross-Origin-Opener-Policy: same-origin`
> - [x] Заголовок `Cross-Origin-Embedder-Policy: require-corp` або `credentialless`
> - [ ] `Access-Control-Allow-Origin: *` на головному документі
> - [ ] Атрибут `async` на тезі `<script>`
> - [x] Безпечний контекст (HTTPS або localhost)
>
> **Пояснення:** SAB доступний лише в cross-origin isolated контексті (`crossOriginIsolated === true`), а це вимагає COOP + COEP і secure context. CORS-заголовок самого документа тут ні до чого.

### Shared Worker, Service Worker і Worklets

| | Dedicated Worker | Shared Worker | Service Worker | Worklet |
|---|---|---|---|---|
| Хто власник | одна сторінка | усі вкладки одного origin | origin, живе без сторінок | рушій рендеру/аудіо |
| Комунікація | `postMessage` | `port.postMessage` через `connect` | `postMessage`, події `fetch`, `push` | обмежений API (`addModule`) |
| Типове застосування | важкі обчислення | спільне WebSocket-з'єднання для вкладок | офлайн, кеш, проксі мережі | `AudioWorklet`, CSS Paint API |

```js
// shared-worker.js — один екземпляр на всі вкладки origin: розсилає повідомлення всім
const ports = new Set();
self.onconnect = ({ ports: [port] }) => {
  ports.add(port);
  port.onmessage = (msg) => ports.forEach((p) => p.postMessage(msg.data));
};
// у кожній вкладці
const shared = new SharedWorker('/shared-worker.js');
shared.port.onmessage = (e) => console.log('від іншої вкладки:', e.data);
```

**Worklets** — легкі скрипти, які рушій запускає у своєму конвеєрі: `AudioWorklet` обробляє аудіо в аудіопотоці з жорстким дедлайном, `paintWorklet` (CSS Painting API, Chromium) малює фон елемента. Ти не керуєш їхнім життєвим циклом, а API мінімальний. **Service Worker** — мережевий проксі, а не інструмент для обчислень ([[JavaScript - 28. Сховища та Web APIs]]).

> [!quiz] Перевір себе: обери тип воркера
> level: middle · id: jsd-29-quiz-07
>
> Користувач відкриває застосунок у 5 вкладках, і ти хочеш **одне** WebSocket-з'єднання на всіх. Що взяти?
>
> - [ ] Dedicated Worker у кожній вкладці
> - [x] Shared Worker
> - [ ] AudioWorklet
> - [ ] `requestIdleCallback`
>
> **Пояснення:** Shared Worker — один екземпляр на origin, до якого підключаються всі вкладки через `MessagePort`. Dedicated Worker на вкладку дасть 5 з'єднань. Альтернатива без воркера — `BroadcastChannel` + вибір «лідера» серед вкладок.

### Node.js — worker_threads

У Node I/O вже не блокує головний потік: мережа — через неблокувальні сокети ОС, а `fs`, `crypto.pbkdf2`, `zlib` — через пул потоків libuv. `worker_threads` потрібні для **CPU-bound JS**: парсинг великих файлів, обробка зображень на JS, хешування в циклі.

```js title="fib.mjs"
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url), { workerData: { n: 35 } });
  console.log('A: main continues');
  worker.on('message', (msg) => { console.log('C: result', msg); worker.terminate(); });
  setTimeout(() => console.log('B: timer on main'), 0);
} else {
  const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
  parentPort.postMessage(fib(workerData.n));
}
// → A: main continues
// → B: timer on main
// → C: result 9227465
```

Альтернативи: `child_process` — окремий процес ОС (запуск інших програм, повна ізоляція), `cluster` — кілька процесів на одному порту (масштабування HTTP-сервера на ядра).

> [!quiz] Перевір себе: коли worker_threads у Node?
> level: middle · type: multi · id: jsd-29-quiz-08
>
> - [ ] Щоб паралельно читати 100 файлів через `fs.promises.readFile`
> - [x] Щоб стиснути зображення бібліотекою на чистому JS, не блокуючи HTTP-сервер
> - [x] Щоб розпарсити CSV на 2 ГБ, поки сервер відповідає на запити
> - [ ] Щоб зробити 1000 одночасних HTTP-запитів до API
>
> **Пояснення:** асинхронне I/O і так не блокує event loop — воркер лише додасть накладні витрати. Воркери потрібні, коли довго працює саме **JS-код** на CPU.

### Коли воркери окупаються і RPC у стилі Comlink

Воркер — не безкоштовний:

- 🐢 **старт** — новий isolate: десятки мілісекунд і кілька мегабайт пам'яті (спрощено, залежить від рушія);
- 📦 **обмін** — clone на обох кінцях; дрібні часті повідомлення можуть коштувати більше за саму роботу;
- 🧠 **складність** — асинхронний інтерфейс, помилки в іншому потоці, налагодження.

Окупається, коли задача **CPU-важка** (≫ 50 мс), дані **компактні** або передаються transfer-ом, а воркер **живе довго** (пул, а не воркер на кожен клік). Розмір пулу — `navigator.hardwareConcurrency - 1` (у Node — `os.availableParallelism() - 1`).

Сирі `postMessage` швидко перетворюються на «switch по type». Бібліотека **Comlink** ховає їх за проксі: виклик методу → повідомлення з id → проміс. Ядро такого RPC:

```js
function expose(api, port) {
  port.on('message', async ({ id, method, args }) => {
    try { port.postMessage({ id, ok: true, value: await api[method](...args) }); }
    catch (e) { port.postMessage({ id, ok: false, value: e }); }   // Error клонується
  });
}

function wrap(port) {
  let nextId = 0;
  const pending = new Map();                                      // id → { resolve, reject }
  port.on('message', ({ id, ok, value }) => {
    const p = pending.get(id);
    pending.delete(id);
    ok ? p.resolve(value) : p.reject(value);
  });
  return new Proxy({}, {
    get: (_, method) => {
      if (method === 'then') return undefined;                    // щоб proxy не вважався thenable
      return (...args) => {
        const id = nextId++;
        const { promise, resolve, reject } = Promise.withResolvers();
        pending.set(id, { resolve, reject });
        port.postMessage({ id, method, args });
        return promise;
      };
    },
  });
}

// main:   const api = wrap(worker);  console.log(await api.add(2, 3)); // → 5
// worker: expose({ add: (a, b) => a + b }, parentPort);
```

Код вище — для Node (`port.on`); у браузері те саме з `addEventListener('message', (e) => … e.data)`. Комбінація `Proxy` ([[JavaScript - 20. Symbol, Proxy і Reflect]]) і `Promise.withResolvers` — 25 рядків замість протоколу повідомлень.

> [!quiz] Перевір себе: чи окупиться воркер?
> level: senior · type: multi · id: jsd-29-quiz-09
>
> У яких випадках винесення у воркер **реально** допоможе?
>
> - [ ] Відфільтрувати масив зі 100 елементів при кожному натисканні клавіші, створюючи новий воркер на кожне натискання
> - [x] Декодувати й обробити 20-мегапіксельне фото, передавши `ArrayBuffer` transfer-ом
> - [x] Підсвітка синтаксису великого файлу в редакторі коду в довгоживучому воркері
> - [ ] Отримати JSON у воркері через `fetch`, розпарсити й надіслати мегабайтний об'єкт у головний потік, щоб «не блокувати парсингом»
>
> **Пояснення:** старт воркера на кожен клік дорожчий за саму фільтрацію. А мегабайтний об'єкт, надісланий назад, головний потік однаково десеріалізує — це порівнянно з `JSON.parse`, тож виграш зникає. Окупаються важкі задачі з компактним результатом або transfer-ом.

> [!quiz] Склади серверну частину RPC — `expose`
> level: senior · type: order · id: jsd-29-quiz-11
>
> ```js order
> function expose(api, port) {
>   port.on('message', async ({ id, method, args }) => {
>     try {
>       const value = await api[method](...args)
>       port.postMessage({ id, ok: true, value })
>     } catch (e) {
>       port.postMessage({ id, ok: false, value: e })
>     }
>   })
> }
>       const value = api[method](...args) // ✗
> ```
>
> **Пояснення:** кожна відповідь несе `id` запиту — так `wrap` на іншому боці знайде потрібний проміс. `await` обов'язковий: без нього відхилений проміс асинхронного методу не потрапить у `catch`, а `postMessage` спробує клонувати сам проміс і кине `DataCloneError`.

## ⚠️ Пастки

> [!pitfall] Використати буфер після transfer
> Після передачі оригінал detached — читання дає порожнечу, а не помилку, тож баг тихий.
>
> ```js
> const data = new Float32Array(1e6);
> worker.postMessage(data, [data.buffer]);
> data.fill(0);            // ❌ нічого не робить: data.length === 0
> ```
>
> Якщо дані ще потрібні — або не передавай (клонуй), або отримай їх назад від воркера наступним transfer-ом.

> [!pitfall] Новий воркер на кожну задачу
> `new Worker()` — це новий isolate, парсинг скрипта, ініціалізація. Створення воркера на кожен клік чи рядок таблиці з'їдає весь виграш і тече пам'яттю, якщо забути `terminate()`. Тримай довгоживучий воркер або пул.

> [!pitfall] Воркер «впав мовчки»
> Помилка всередині воркера не потрапляє в `try/catch` головного потоку. Без `error`-обробника проміс, що чекає відповіді, висітиме вічно.
>
> ```js
> worker.addEventListener('error', (e) => { e.preventDefault(); rejectAllPending(e); });
> worker.addEventListener('messageerror', (e) => rejectAllPending(new Error('clone failed')));
> ```

## 🎤 На співбесіді

> [!interview] Чим конкурентність відрізняється від паралельності в JavaScript?
> level: middle · frequency: часто · id: jsd-29-int-01
>
> ---
>
> Конкурентність — кілька задач у процесі, але один потік виконує їх по черзі: event loop, проміси, `async/await` перемикаються на `await`. Вона ідеальна для I/O, бо поки чекаємо мережу, потік вільний. Паралельність — одночасне виконання на різних ядрах; у JS її дають лише окремі агенти: Web Workers, `worker_threads`, процеси. Кожен має свій heap і event loop, обмін — через `postMessage` (structured clone або transfer) чи спільну пам'ять `SharedArrayBuffer` з `Atomics`. `Promise.all` над синхронними обчисленнями нічого не прискорює.
>
> 📚 [[JavaScript - 29. Workers і паралельність#Конкурентність vs паралельність|Розділ: конкурентність vs паралельність]] · [MDN: Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

> [!interview] Як передати великий масив даних у воркер без копіювання?
> level: senior · frequency: часто · id: jsd-29-int-02
>
> ---
>
> Transfer: `worker.postMessage(msg, [typedArray.buffer])` або `{ transfer: [...] }`. Власність `ArrayBuffer` переходить за O(1), оригінал стає detached (`byteLength === 0`). Передаються також `MessagePort`, `ImageBitmap`, `OffscreenCanvas`, потоки. Якщо обом сторонам потрібен постійний доступ — `SharedArrayBuffer`, але тоді потрібні `Atomics` проти гонок і cross-origin isolation (COOP `same-origin` + COEP `require-corp`/`credentialless`). Звичайний `postMessage` без transfer робить structured clone — лінійно за розміром і на обох потоках.
>
> 📚 [[JavaScript - 29. Workers і паралельність#Transferables — передати, а не копіювати|Розділ: transferables]] · [MDN: Transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects)

> [!interview] Навіщо SharedArrayBuffer потрібна cross-origin isolation?
> level: senior · frequency: іноді · id: jsd-29-int-03
>
> ---
>
> Після Spectre стало зрозуміло, що спільна пам'ять плюс воркер, який крутить лічильник, — це надточний таймер, придатний для атак через побічні канали: можна виміряти доступ до кешу й прочитати чужі дані в тому ж процесі. Браузери вимкнули SAB і повернули його лише для сторінок, які гарантують, що в їхній процес не потрапить чужий ресурс без згоди: `Cross-Origin-Opener-Policy: same-origin` відрізає чужі вікна, `Cross-Origin-Embedder-Policy: require-corp` (або `credentialless`) вимагає згоди від кожного вбудованого ресурсу. Перевірка — `crossOriginIsolated`. Ціна — налаштування CORP/CORS для всіх сторонніх ресурсів і зламані `window.opener` у popup-ах.
>
> 📚 [[JavaScript - 29. Workers і паралельність#SharedArrayBuffer і Atomics|Розділ: SharedArrayBuffer і Atomics]] · [web.dev: COOP і COEP](https://web.dev/articles/coop-coep)

## 🔗 Зв'язки

- [[JavaScript - 08. Event Loop]] — у кожного воркера свій event loop; повідомлення приходять як задачі (macrotasks).
- [[JavaScript - 23. JSON, structuredClone і серіалізація]] — `postMessage` використовує той самий structured clone.
- [[JavaScript - 20. Symbol, Proxy і Reflect]] — `Proxy` робить RPC до воркера схожим на звичайні виклики методів.
- [[JavaScript - 31. Продуктивність і V8]] — long tasks, INP і коли спершу оптимізувати, а не паралелити.
- [[JavaScript - 30. Безпека в JavaScript]] — Spectre, COOP/COEP і чому ізоляція — це питання безпеки.

## ⚡ Фішки

> [!reel] 🍳 Promise.all не додає ядер
> `Promise.all` — це «чекати кілька справ одночасно», а не «робити їх одночасно». Два синхронні обчислення по секунді всередині — все одно дві секунди на одному потоці.

> [!reel] 📦 Transfer — переїзд, а не ксерокс
> Передача `ArrayBuffer` у воркер займає O(1), бо байти не копіюються — змінюється власник. У відправника лишається буфер з `byteLength === 0`.
>
> ```js
> worker.postMessage(buf, [buf]);
> buf.byteLength // → 0
> ```

> [!reel] 👻 Spectre вимкнув SharedArrayBuffer
> На початку 2018 браузери вимкнули SAB: спільна пам'ять давала надточний таймер для атак. Сьогодні він доступний лише сторінкам з COOP + COEP — звідси прапорець `crossOriginIsolated`.

> [!reel] 🧬 Клас доїжджає у воркер без методів
> Structured clone копіює дані, але не прототип: екземпляр `User` у воркері — це звичайний `{ name: 'Ann' }`. Функції ж узагалі кидають `DataCloneError`.

> [!reel] 🎨 Canvas можна віддати воркеру
> `canvas.transferControlToOffscreen()` передає полотно у воркер — і анімація малюється, навіть коли головний потік зайнятий.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке Web Worker і навіщо він?
> *дуже часто · теорія* · `jsd-29-001`
>
> Скрипт, що виконується в окремому потоці зі своїм глобальним об'єктом і event loop. Потрібен, щоб важкі обчислення не блокували головний потік, який обробляє події й рендерить сторінку. DOM у воркері недоступний, спілкування — через `postMessage`.
>
> 📚 [[JavaScript - 29. Workers і паралельність#Dedicated Worker — окремий потік з власним event loop|Розділ: Dedicated Worker]] · [MDN: Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

> [!question]- Чому `Promise.all` не прискорює важкі синхронні обчислення?
> *часто · теорія* · `jsd-29-002`
>
> Проміси — це конкурентність на одному потоці: вони лише чекають уже запущені операції. Синхронні функції виконаються одна за одною ще до виклику `all`. Паралельне виконання JS дають тільки воркери.
>
> 📚 [[JavaScript - 29. Workers і паралельність#Конкурентність vs паралельність|Розділ: конкурентність vs паралельність]] · [MDN: Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

### 🟡 Middle

> [!question]- Що копіює structured clone у `postMessage`, а що ні?
> *часто · теорія* · `jsd-29-003`
>
> Копіює примітиви, `Date`, `RegExp`, `Map`, `Set`, масиви, typed arrays, `Blob`, `Error`, циклічні посилання. Губить прототипи (екземпляр класу стає звичайним об'єктом), геттери (лише значення), ключі-символи. Кидає `DataCloneError` на функціях, DOM-вузлах і символах.
>
> 📚 [[JavaScript - 29. Workers і паралельність#Structured clone — що копіюється і скільки це коштує|Розділ: structured clone]] · [MDN: Structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)

> [!question]- Що таке transferable objects і що стається з оригіналом?
> *часто · теорія* · `jsd-29-004`
>
> Об'єкти, власність на які можна передати іншому агенту без копіювання: `ArrayBuffer`, `MessagePort`, `ImageBitmap`, `OffscreenCanvas`, потоки. Передача — O(1); оригінал стає detached: `byteLength === 0`, view над ним мають довжину 0.
>
> 📚 [[JavaScript - 29. Workers і паралельність#Transferables — передати, а не копіювати|Розділ: transferables]] · [MDN: Transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects)

> [!question]- Чим Dedicated, Shared і Service Worker відрізняються за призначенням?
> *іноді · порівняння* · `jsd-29-005`
>
> Dedicated — належить одній сторінці, для обчислень. Shared — один на всі вкладки origin, спілкування через `MessagePort` (спільне з'єднання, стан). Service Worker — мережевий проксі origin: кеш, офлайн, push; живе без відкритих сторінок і не призначений для обчислень.
>
> 📚 [[JavaScript - 29. Workers і паралельність#Shared Worker, Service Worker і Worklets|Розділ: типи воркерів]] · [MDN: SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker)

### 🔴 Senior

> [!question]- Навіщо `Atomics`, якщо є `SharedArrayBuffer`?
> *часто · теорія* · `jsd-29-006`
>
> Звичайне `view[i]++` — це читання, додавання й запис; два потоки губитимуть інкременти. `Atomics` дає неподільні операції (`add`, `compareExchange`), гарантії видимості (`load`/`store`) і синхронізацію (`wait`/`notify`, `waitAsync`). У головному потоці браузера блокувальний `wait` заборонений.
>
> 📚 [[JavaScript - 29. Workers і паралельність#SharedArrayBuffer і Atomics|Розділ: SharedArrayBuffer і Atomics]] · [MDN: Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)

> [!question]- Коли варто брати `worker_threads` у Node.js, а коли ні?
> *іноді · практика* · `jsd-29-007`
>
> Варто — для CPU-bound JS: парсинг, стиснення чи обробка зображень на JS, криптографія в циклі. Не варто — для I/O: мережа й `fs` уже асинхронні (libuv), воркер лише додасть накладні витрати. Для масштабування сервера на ядра — `cluster` або кілька процесів.
>
> 📚 [[JavaScript - 29. Workers і паралельність#Node.js — worker_threads|Розділ: worker_threads]] · [Node.js: Worker threads](https://nodejs.org/api/worker_threads.html)

> [!question]- Як працює RPC у стилі Comlink поверх `postMessage`?
> *рідко · практика* · `jsd-29-008`
>
> Клієнт повертає `Proxy`: кожен виклик методу генерує id, кладе `{ resolve, reject }` у `Map` і надсилає `{ id, method, args }`. Воркер викликає метод, `await`-ить результат і відповідає `{ id, ok, value }`. Клієнт знаходить проміс за id і завершує його. Важливо: `then` у проксі має повертати `undefined`, інакше `await api` зависне.
>
> 📚 [[JavaScript - 29. Workers і паралельність#Коли воркери окупаються і RPC у стилі Comlink|Розділ: RPC у стилі Comlink]] · [GitHub: Comlink](https://github.com/GoogleChromeLabs/comlink)

## 🛠️ Практика

> [!task] Поясни своїми словами: кухар і помічник
> level: middle · difficulty: easy · id: jsd-29-task-01 · tags: feynman, workers, concurrency
>
> Поясни другові-джуну (до 6 речень): чим конкурентність відрізняється від паралельності, чому `async/await` не рятує від «замерзлої» сторінки під час важкого обчислення, і в якому випадку воркер **не** допоможе. Використай аналогію.
>
> > [!hint]- Підказка 1
> > Скільки «рук» у головного потоку і що він робить, коли рахує?
>
> > [!hint]- Підказка 2
> > Подумай про вартість старту воркера і передачі великих даних туди й назад.
>
> > [!solution]- Еталонне пояснення
> > Головний потік — один кухар, який і готує, і обслуговує зал. Конкурентність — він спритно перемикається: поставив воду кипіти (`await fetch`) і поки що приймає замовлення. Паралельність — коли з'являється помічник у підсобці (воркер), і дві пари рук працюють одночасно. `async/await` не допоможе з важким обчисленням, бо `await` звільняє кухаря лише тоді, коли він **чекає**, а тут він **працює** — зал однаково стоїть. Помічник не допоможе, якщо задача дрібна (пояснювати її довше, ніж зробити) або якщо результат — гора записок, яку кухарю все одно доведеться перечитати (великий об'єкт, що клонується назад). Він окупається на важкій роботі з компактним результатом.

> [!task] Порахуй прості числа у воркері з прогресом і скасуванням
> level: senior · difficulty: medium · id: jsd-29-task-02 · tags: worker-threads, abortsignal, node
>
> Напиши для Node `countPrimes(limit, { onProgress, signal })`, що повертає проміс з кількістю простих чисел ≤ `limit`. Обчислення — у `worker_threads`; воркер надсилає прогрес у відсотках (не частіше одного разу на відсоток); `signal` скасовує роботу (воркер має бути реально зупинений, проміс — відхилений з `signal.reason`).
>
> ```js
> console.log(await countPrimes(200_000, { onProgress: (p) => p % 50 === 0 && console.log(`${p}%`) }));
> // → 0%  50%  100%  17984
> await countPrimes(5_000_000, { signal: AbortSignal.timeout(50) }); // ❌ TimeoutError
> ```
>
> > [!hint]- Підказка 1
> > Один файл: гілка `isMainThread` створює `new Worker(new URL(import.meta.url), { workerData })`, інша гілка рахує.
>
> > [!hint]- Підказка 2
> > Розрізняй повідомлення полем `type`: `progress` і `done`.
>
> > [!hint]- Підказка 3
> > Скасування синхронного циклу зсередини неможливе (воркер не обробляє повідомлення, поки рахує) — тому `worker.terminate()` ззовні.
>
> > [!solution]- Еталонне рішення
> > ```js
> > import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
> >
> > export function countPrimes(limit, { onProgress, signal } = {}) {
> >   return new Promise((resolve, reject) => {
> >     signal?.throwIfAborted();
> >     const worker = new Worker(new URL(import.meta.url), { workerData: { limit } });
> >     const abort = () => { worker.terminate(); reject(signal.reason); };
> >     signal?.addEventListener('abort', abort, { once: true });
> >     worker.on('message', (msg) => {
> >       if (msg.type === 'progress') return onProgress?.(msg.value);
> >       signal?.removeEventListener('abort', abort);
> >       worker.terminate();
> >       resolve(msg.value);
> >     });
> >     worker.on('error', reject);
> >   });
> > }
> >
> > if (!isMainThread) {
> >   const { limit } = workerData;
> >   const isPrime = (n) => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return n > 1; };
> >   let count = 0, lastPct = -1;
> >   for (let n = 2; n <= limit; n++) {
> >     if (isPrime(n)) count++;
> >     const pct = Math.floor((n / limit) * 100);
> >     if (pct !== lastPct) parentPort.postMessage({ type: 'progress', value: (lastPct = pct) });
> >   }
> >   parentPort.postMessage({ type: 'done', value: count });
> > }
> > ```
> >
> > Прогрес обмежено одним повідомленням на відсоток: повідомлення на кожне число завалило б головний потік клонуванням. Якщо потрібне «м'яке» скасування без вбивства воркера — розбий цикл на шматки з `await` між ними або перевіряй прапорець у `SharedArrayBuffer` через `Atomics.load`.

> [!task] Пул воркерів з чергою
> level: senior · difficulty: hard · id: jsd-29-task-03 · tags: worker-threads, pool, concurrency
>
> Реалізуй `createWorkerPool(url, size, createWorker = (u) => new Worker(u))`: створює `size` довгоживучих воркерів; `run(data, transfer?)` повертає проміс з відповіддю воркера; якщо всі зайняті — задача чекає в черзі FIFO; `destroy()` завершує всі воркери. Воркер відповідає одним повідомленням на кожне вхідне. Третій параметр дозволяє підмінити воркер у тестах (там немає `worker_threads`) — використовуй лише `on`, `off`, `postMessage` і `terminate`.
>
> ```js
> const pool = createWorkerPool(new URL('./fib-worker.mjs', import.meta.url), 2);
> console.log(await Promise.all([30, 31, 32, 33].map((n) => pool.run(n))));
> // → [ 832040, 1346269, 2178309, 3524578 ]
> await pool.destroy();
> ```
>
> ```js starter
> function createWorkerPool(url, size, createWorker = (u) => new Worker(u)) {
>   const all = Array.from({ length: size }, () => createWorker(url))
>   const idle = [...all]
>   const queue = []
>   // твій код
>   return {
>     run: (data, transfer = []) => {},
>     destroy: () => {},
>   }
> }
> ```
>
> ```js tests
> // Фейковий воркер у стилі Node: on/off/postMessage/terminate. Відповідає data * 2 через data мс
> let busy = 0
> let maxBusy = 0
> const log = []
> class FakeWorker {
>   constructor(url) { this.url = url; this.handlers = { message: [], error: [] }; this.terminated = false; this.transfers = [] }
>   on(type, fn) { this.handlers[type].push(fn) }
>   off(type, fn) { this.handlers[type] = this.handlers[type].filter((h) => h !== fn) }
>   emit(type, value) { for (const h of [...this.handlers[type]]) h(value) }
>   postMessage(data, transfer) {
>     this.transfers.push(transfer)
>     log.push(data)
>     maxBusy = Math.max(maxBusy, ++busy)
>     setTimeout(() => {
>       busy--
>       if (data === 'boom') this.emit('error', new Error('boom'))
>       else this.emit('message', data * 2)
>     }, typeof data === 'number' ? data : 1)
>   }
>   terminate() { this.terminated = true; return Promise.resolve(0) }
> }
> const workers = []
> const factory = (url) => { const w = new FakeWorker(url); workers.push(w); return w }
> const reset = () => { busy = 0; maxBusy = 0; log.length = 0; workers.length = 0 }
> const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve() }
> async function drive(promise) {
>   let done = false
>   promise.then(() => { done = true }, () => { done = true })
>   for (let i = 0; i < 1000 && !done; i++) { vi.advanceTimersByTime(1); await flush() }
>   return promise
> }
>
> test('створює size воркерів і повертає результати в порядку викликів', async () => {
>   vi.useFakeTimers(); reset()
>   const pool = createWorkerPool('fib.mjs', 2, factory)
>   expect(workers.length).toBe(2)
>   expect(workers[0].url).toBe('fib.mjs')
>   const results = await drive(Promise.all([30, 10, 20, 5].map((n) => pool.run(n))))
>   expect(results).toEqual([60, 20, 40, 10])
> })
>
> test('одночасно працює не більше size задач', async () => {
>   vi.useFakeTimers(); reset()
>   const pool = createWorkerPool('w', 2, factory)
>   await drive(Promise.all([5, 5, 5, 5, 5].map((n) => pool.run(n))))
>   expect(maxBusy).toBe(2)
> })
>
> test('черга FIFO', async () => {
>   vi.useFakeTimers(); reset()
>   const pool = createWorkerPool('w', 1, factory)
>   await drive(Promise.all([3, 1, 2].map((n) => pool.run(n))))
>   expect(log).toEqual([3, 1, 2])
> })
>
> test('помилка відхиляє лише свою задачу, пул працює далі', async () => {
>   vi.useFakeTimers(); reset()
>   const pool = createWorkerPool('w', 1, factory)
>   const failed = pool.run('boom').catch((e) => e.message)
>   const ok = pool.run(4)
>   expect(await drive(Promise.all([failed, ok]))).toEqual(['boom', 8])
> })
>
> test('обробники знімаються, transfer передається, destroy завершує всіх', async () => {
>   vi.useFakeTimers(); reset()
>   const pool = createWorkerPool('w', 2, factory)
>   const buf = new ArrayBuffer(8)
>   await drive(Promise.all([pool.run(1, [buf]), pool.run(2), pool.run(3)]))
>   expect(workers.some((w) => w.transfers.some((t) => t?.[0] === buf))).toBe(true)
>   for (const w of workers) expect(w.handlers.message.length + w.handlers.error.length).toBe(0)
>   await pool.destroy()
>   expect(workers.every((w) => w.terminated)).toBe(true)
> })
> ```
>
> > [!hint]- Підказка 1
> > Тримай два списки: `idle` (вільні воркери) і `queue` (`{ data, transfer, resolve, reject }`).
>
> > [!hint]- Підказка 2
> > `next()`: якщо є і вільний воркер, і задача — повісь одноразові обробники `message`/`error`, надішли дані. По завершенні — зняти обробники, повернути воркер у `idle`, знову `next()`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > // У Node: import { Worker } from 'node:worker_threads';
> > // розумний size за замовчуванням — Math.max(1, availableParallelism() - 1) з 'node:os'
> > function createWorkerPool(url, size, createWorker = (u) => new Worker(u)) {
> >   const all = Array.from({ length: size }, () => createWorker(url));
> >   const idle = [...all];
> >   const queue = [];
> >
> >   function next() {
> >     if (queue.length === 0 || idle.length === 0) return;
> >     const worker = idle.pop();
> >     const { data, transfer, resolve, reject } = queue.shift();
> >     const onMessage = (result) => { cleanup(); resolve(result); };
> >     const onError = (err) => { cleanup(); reject(err); };
> >     function cleanup() {
> >       worker.off('message', onMessage);
> >       worker.off('error', onError);
> >       idle.push(worker);
> >       next();
> >     }
> >     worker.on('message', onMessage);
> >     worker.on('error', onError);
> >     worker.postMessage(data, transfer);
> >   }
> >
> >   return {
> >     run: (data, transfer = []) => new Promise((resolve, reject) => {
> >       queue.push({ data, transfer, resolve, reject });
> >       next();
> >     }),
> >     destroy: () => Promise.all(all.map((w) => w.terminate())),
> >   };
> > }
> > ```
> >
> > ```js title="fib-worker.mjs"
> > import { parentPort } from 'node:worker_threads';
> > const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
> > parentPort.on('message', (n) => parentPort.postMessage(fib(n)));
> > ```
> >
> > Для продакшну: після `error` воркер у Node завершується — його треба замінити новим, а не повертати в `idle`; таймаут на задачу з `terminate()` і заміною; `AbortSignal` для задач у черзі. Готові рішення — `piscina` (Node) і `workerpool`.

## 📚 Джерела та що почитати

- 🟢 [MDN — Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) — старт: створення, повідомлення, помилки, типи воркерів.
- 🟡 [MDN — Transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects) — повний список того, що можна передавати, і поведінка detached-буферів.
- 🟡 [Surma — Is postMessage slow?](https://surma.dev/things/is-postmessage-slow/) — заміри вартості clone для різних розмірів даних.
- 🟡 [web.dev — Making your website cross-origin isolated using COOP and COEP](https://web.dev/articles/coop-coep) — навіщо ізоляція і як її ввімкнути.
- 🟡 [Node.js — Worker threads](https://nodejs.org/api/worker_threads.html) — `workerData`, `MessageChannel`, `resourceLimits`.
- 🔴 [HTML Standard — Web workers](https://html.spec.whatwg.org/multipage/workers.html) — першоджерело: агенти, порти, життєвий цикл.
- 🛠️ [Comlink](https://github.com/GoogleChromeLabs/comlink) — RPC до воркерів через `Proxy` у 1,1 кБ.
- 🎥 [Surma — The main thread is overworked & underpaid](https://www.youtube.com/watch?v=7Rrv9qFMWNM) — чому off-main-thread архітектура важлива для мобільних.

> [!important] Підсумок
> - Конкурентність — один потік, що перемикається (event loop, проміси); паралельність — окремі агенти (Web Workers, `worker_threads`) зі своїм heap і event loop.
> - `postMessage` за замовчуванням робить structured clone: лінійно за розміром, без функцій і прототипів, на обох потоках.
> - Transfer передає `ArrayBuffer`, `MessagePort`, `OffscreenCanvas` за O(1), залишаючи оригінал detached.
> - `SharedArrayBuffer` — спільна пам'ять, що вимагає `Atomics` проти гонок і cross-origin isolation (COOP + COEP) через Spectre.
> - Воркер окупається на CPU-важких задачах з компактним результатом і довгим життям (пул); RPC у стилі Comlink ховає повідомлення за `Proxy` і промісами.
