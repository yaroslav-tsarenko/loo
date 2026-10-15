---
title: Debounce, throttle та async-патерни
order: 14
level: middle
tags: [debounce, throttle, async, patterns, retry, concurrency, abortcontroller]
prerequisites:
  - "[[JavaScript - 05. Замикання]]"
  - "[[JavaScript - 08. Event Loop]]"
  - "[[JavaScript - 10. async і await]]"
estimatedMinutes: 55
id: jsd-ch-14
icon: "🎛️"
---

# JavaScript - 14. Debounce, throttle та async-патерни

> [!success] 🎯 Після цього розділу ти зможеш
> - Обрати між debounce і throttle для конкретної задачі та пояснити різницю leading/trailing.
> - Написати з нуля `debounce` (з `cancel`/`flush`) і `throttle`, що зберігають `this` і аргументи.
> - Реалізувати retry з експоненційним backoff і jitter, таймаут через `Promise.race` і пул з обмеженням конкурентності.
> - Прибрати race condition «застарілої відповіді» в UI через `AbortController` або ідентифікатор запиту.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-14-quiz-01
>
> ```js
> // debounce(fn, ms): викликає fn через ms після ОСТАННЬОГО виклику
> const log = debounce((x) => console.log(x), 100);
> log(1);
> log(2);
> setTimeout(() => log(3), 50);
> setTimeout(() => log(4), 200);
> ```
>
> **Відповідь:** `3 4`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Виклики 1, 2 і 3 йдуть з паузами < 100 мс — кожен скидає таймер, тож спрацьовує лише останній (`3`, на 150 мс). Виклик `4` на 200 мс починає нову «серію» і спрацьовує на 300 мс.

## 🧒 Простими словами

**Debounce** — це ліфт, який чекає, поки люди перестануть заходити: кожен новий пасажир скидає таймер закриття дверей, і ліфт їде лише після паузи. **Throttle** — це поїзд метро за розкладом: їде раз на N хвилин, скільки б людей не набігло на платформу, — хтось встигне, решта поїде наступним. А **retry з backoff** — це ввічливий дзвінок другові: не додзвонився — передзвони через хвилину, потім через дві, через чотири… і не всі одночасно рівно о 12:00 (це jitter).

## 🔬 Як це працює насправді

### Debounce vs throttle: коли що

Обидва патерни **обмежують частоту** викликів функції, але відповідають на різні питання:

| | Debounce | Throttle |
|---|---|---|
| Питання | «Коли користувач **закінчив**?» | «Як часто **максимум**?» |
| Під час безперервного потоку подій | не викликає жодного разу (trailing) | викликає рівномірно, раз на `ms` |
| Типові задачі | автодоповнення пошуку, валідація форми після вводу, автозбереження, `resize` → перерахунок layout | позиція скролу, drag, трекінг миші, нескінченний скрол, аналітика, обмеження кліків |

Режими:

- **trailing** (за замовчуванням) — виклик **наприкінці** серії/вікна з останніми аргументами;
- **leading** — виклик **на початку**, решта серії ігнорується (захист від подвійного кліку «Оплатити»);
- **leading + trailing** — обидва (як у lodash за замовчуванням для `throttle`).

> [!viz] debounce-throttle
> scenario: compare

> [!quiz] Перевір себе: що обрати?
> level: junior · type: multi · id: jsd-14-quiz-02
>
> Де доречний саме **debounce** (а не throttle)?
>
> - [x] Запит підказок, поки користувач друкує в пошуку
> - [ ] Оновлення індикатора прогресу читання під час скролу
> - [x] Автозбереження чернетки після того, як користувач перестав редагувати
> - [ ] Відправка координат курсора в спільний редактор не частіше 10 разів на секунду
>
> **Пояснення:** debounce чекає паузи — потрібен, коли важливий лише фінальний стан. Під час безперервного скролу чи руху миші він не спрацює взагалі, тож там потрібен throttle — регулярні оновлення з обмеженою частотою.

### Як влаштований debounce

Ядро — один таймер у **замиканні** ([[JavaScript - 05. Замикання]]), спільний для всіх викликів обгортки. Кожен виклик робить `clearTimeout(timer)` і ставить новий `setTimeout` — тож спрацьовує лише той, після якого настала тиша.

```text
виклики:   x x x    x                              x
час, мс:   0         100       200       300       400       500
trailing:                     ▲                              ▲
leading:   ▲                                       ▲
```

Деталі, які відрізняють продакшн-версію від співбесідної (реалізуєш у «Практиці»):

- зберегти `this` і **останні** аргументи — повертати звичайну `function`, не стрілку, і викликати `fn.apply(lastThis, lastArgs)`;
- `leading` — викликати одразу, якщо таймера ще немає (серія тільки почалась);
- після виклику скидати `lastArgs`, щоб `leading + trailing` не викликав функцію двічі для одиночного кліку;
- `cancel()` — скасувати очікуваний виклик (знищення компонента!), `flush()` — виконати його негайно (наприклад, перед `beforeunload`).

```js
const onInput = debounce((q) => loadSuggestions(q), 300);
input.addEventListener('input', (e) => onInput(e.target.value));
// при знищенні компонента: onInput.cancel()
```

> [!quiz] Перевір себе: leading debounce
> level: middle · type: output · id: jsd-14-quiz-03
>
> ```js
> const d = debounce((x) => console.log(x), 100, { leading: true, trailing: false });
> d(1);
> d(2);
> setTimeout(() => d(3), 50);
> setTimeout(() => d(4), 300);
> ```
>
> **Відповідь:** `1 4`
>
> **Пояснення:** `1` — leading-виклик. `2` і `3` лише продовжують «тишу» до 150 мс, а trailing вимкнено. На 300 мс таймера вже немає — `4` знову стає leading.

### Throttle і `requestAnimationFrame`

Throttle пам'ятає час останнього виклику `last`. На кожен виклик рахує `remaining = ms - (now - last)`:

1. `remaining <= 0` — вікно минуло: викликати **одразу** (leading) і оновити `last`;
2. інакше, якщо trailing-таймера ще немає, — запланувати **один** виклик через `remaining` мс;
3. в обох випадках запам'ятати `this` і **останні** аргументи — trailing-виклик має отримати найсвіжіші.

```text
виклики:   x x x x x x x x x x x x
час, мс:   0         100       200       300
throttle:  ▲         ▲         ▲         ▲
debounce:                                  ▲
```

Кожні 20 мс подія, `ms = 100`: throttle спрацьовує на 0 (leading), 100, 200 і trailing на 300 мс; debounce — лише через 100 мс тиші після останньої події (320 мс).

Для **візуальних** оновлень (позиція елемента при drag, паралакс, канвас) найкращий «таймер» — частота екрана. `requestAnimationFrame` виконує роботу раз на кадр, прямо перед рендером ([[JavaScript - 08. Event Loop]]), і автоматично ставиться на паузу у фонових вкладках:

```js
function rafThrottle(fn) {
  let frame = null;
  let lastArgs;
  return function (...args) {
    lastArgs = args;
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      fn.apply(this, lastArgs);
    });
  };
}

window.addEventListener('pointermove', rafThrottle((e) => {
  dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
}));
```

> [!quiz] Перевір себе: throttle з trailing
> level: middle · type: output · id: jsd-14-quiz-04
>
> ```js
> const t = throttle((x) => console.log(x), 100); // leading + trailing, як вище
> t(1);
> t(2);
> t(3);
> setTimeout(() => t(4), 150);
> ```
>
> **Відповідь:** `1 3 4`
>
> **Пояснення:** `1` — leading. `2` і `3` потрапляють в одне вікно: планується **один** trailing-виклик на 100 мс з останніми аргументами (`3`). Виклик на 150 мс — у вікні після `3`, тож trailing `4` спрацює на 200 мс.

### Retry з експоненційним backoff і jitter

Мережа нестабільна, тож тимчасові помилки (мережевий збій, 503, 429) варто повторювати. Але повторювати **миттєво** і **синхронно з усіма клієнтами** — означає добити сервер, що й так ледве живий (*thundering herd*). Рецепт:

- **exponential backoff**: затримка `base · 2^attempt`, обмежена `cap`;
- **jitter**: випадковість, щоб клієнти розсинхронізувались. *Full jitter* — `random(0, backoff)` — за аналізом AWS дає найменше навантаження;
- повторювати лише **ідемпотентні** операції й **тимчасові** помилки; поважати `Retry-After` для 429/503;
- мати межу спроб і підтримувати скасування.

```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function retry(fn, { retries = 3, base = 200, cap = 5000, shouldRetry = () => true } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      if (attempt >= retries || !shouldRetry(err)) throw err;
      const backoff = Math.min(cap, base * 2 ** attempt);
      await sleep(Math.random() * backoff); // full jitter
    }
  }
}

const data = await retry(() => fetchJson('/api/report'), {
  shouldRetry: (e) => e.status === undefined || e.status >= 500 || e.status === 429,
});
```

> [!quiz] Перевір себе: межі backoff
> level: middle · type: output · id: jsd-14-quiz-05
>
> `base = 100`, `cap = 500`. Які **максимальні** затримки (до jitter) будуть перед спробами після невдач `attempt = 0, 1, 2, 3`?
>
> ```js
> [0, 1, 2, 3].map((a) => Math.min(500, 100 * 2 ** a));
> ```
>
> **Відповідь:** `100 200 400 500`
>
> **Пояснення:** експонента подвоює затримку, `cap` обрізає її на 500 мс. Без `cap` четверта пауза була б 800 мс, а десята — понад 100 секунд.

> [!quiz] Перевір себе: склади `retry` з експоненційною паузою
> level: middle · type: order · id: jsd-14-quiz-09
>
> ```js order
> async function retry(fn, retries = 3, base = 100) {
>   for (let attempt = 0; ; attempt++) {
>     try {
>       return await fn()
>     } catch (err) {
>       if (attempt >= retries) throw err
>       await sleep(base * 2 ** attempt)
>     }
>   }
> }
>       return fn() // ✗
> ```
>
> **Пояснення:** `return await` усередині `try` важливий: без `await` функція поверне проміс одразу, і його rejection уже не потрапить у `catch` — повтору не буде. Межа `attempt >= retries` пробрасує останню помилку, а пауза подвоюється з кожною спробою.

### Таймаут через `Promise.race`

`Promise.race` з промісом-«будильником» — класичний таймаут. Дві деталі, які відрізняють акуратну реалізацію: **прибрати таймер** після завершення (інакше в Node процес чекатиме його, а в тестах — «open handles») і пам'ятати, що race **не скасовує** повільну операцію.

```js
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
```

Щоб реально **зупинити** роботу, таймаут має бути сигналом, який операція слухає: `fetch(url, { signal: AbortSignal.timeout(ms) })` ([[JavaScript - 10. async і await]]).

> [!quiz] Перевір себе: race не скасовує
> level: middle · type: output · id: jsd-14-quiz-06
>
> ```js
> const slow = new Promise((r) =>
>   setTimeout(() => { console.log('slow finished'); r('data'); }, 200),
> );
> withTimeout(slow, 100).then(console.log, (e) => console.log(e.message));
> ```
>
> **Відповідь:** `Timeout after 100ms` `slow finished`
>
> **Пояснення:** через 100 мс race відхиляється, але таймер усередині `slow` нікуди не дівся — через 200 мс операція завершується «в порожнечу». З реальним `fetch` це означає витрачений трафік і, можливо, побічні ефекти на сервері.

### Обмеження конкурентності: пул

`Promise.all(urls.map(fetch))` на 1000 URL — 1000 одночасних з'єднань: браузер усе одно поставить їх у чергу (≈ 6 на хост для HTTP/1.1), сервер може відповісти 429, а пам'ять заповниться відповідями. **Пул** тримає не більше `limit` операцій у польоті: щойно одна завершується, стартує наступна.

```js
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;           // синхронно «бронюємо» індекс — гонки немає
      results[i] = await fn(items[i], i);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;                 // порядок = порядок входу
}
```

`next++` безпечний без локів: JS однопотоковий, і між читанням і інкрементом не може втрутитися інший worker — перемикання стається лише на `await`.

> [!quiz] Перевір себе: порядок завершення в пулі
> level: middle · type: output · id: jsd-14-quiz-07
>
> ```js
> const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
> await mapLimit([['A', 300], ['B', 100], ['C', 100], ['D', 50]], 2, async ([name, ms]) => {
>   await sleep(ms);
>   console.log(name);
> });
> ```
>
> **Відповідь:** `B C D A`
>
> **Пояснення:** два workers: перший бере `A` (0–300 мс), другий — `B` (0–100), потім `C` (100–200), потім `D` (200–250). `A` завершиться останньою. Загальний час — 300 мс замість 550 послідовно.

### Скасування й гонки відповідей у UI

Класичний баг пошуку: користувач надрукував `a`, потім `ab`. Запит `a` повільніший і приходить **останнім** — на екрані результати для `a`, хоча в полі `ab`. Це race condition, і debounce її лише зменшує, а не прибирає.

```js
const fakeFetch = (q, ms) => new Promise((r) => setTimeout(() => r(q), ms));
let shown;
async function search(q, ms) { shown = await fakeFetch(q, ms); }
search('a', 300);
search('ab', 100);
setTimeout(() => console.log(shown), 500); // → a 😱
```

Два надійні рішення:

```js
// 1) last-request-wins через AbortController: старий запит реально скасовується
let controller;
async function searchAbortable(q) {
  controller?.abort();
  controller = new AbortController();
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
    render(await res.json());
  } catch (e) {
    if (e.name !== 'AbortError') throw e; // скасування — не помилка
  }
}

// 2) лічильник запитів: ігноруємо застарілі відповіді (коли API не підтримує signal)
let latestId = 0;
async function searchGuarded(q) {
  const id = ++latestId;
  const data = await api.search(q);
  if (id === latestId) render(data);
}
```

У React те саме робить cleanup ефекту: `return () => controller.abort()` або прапорець `ignore = true`.

> [!quiz] Перевір себе: захист від застарілих відповідей
> level: senior · type: multi · id: jsd-14-quiz-08
>
> Що **гарантовано** прибирає баг «показано результати старого запиту»?
>
> - [ ] Debounce на 300 мс для поля пошуку
> - [x] Скасувати попередній запит через `AbortController` перед новим
> - [x] Порівнювати id запиту з останнім і ігнорувати застарілі відповіді
> - [ ] `Promise.race` між старим і новим запитом
>
> **Пояснення:** debounce зменшує кількість запитів, але два запити все одно можуть «розминутися» в мережі. `race` взагалі віддасть найшвидшого, а не найновішого. Гарантію дає лише явна перевірка актуальності або скасування.

> [!quiz] Перевір себе: заповни пропуски — показуємо лише відповідь на останній запит
> level: senior · type: fill · id: jsd-14-quiz-10 · bank: cancel, latestId++, !==
>
> ```js fill
> let controller
> async function searchAbortable(q) {
>   controller?.[[abort]]()
>   controller = new AbortController()
>   const res = await fetch('/api/search?q=' + q, { [[signal]]: controller.signal })
>   render(await res.json())
> }
>
> let latestId = 0
> async function searchGuarded(q) {
>   const id = [[++latestId|latestId += 1]]
>   const data = await api.search(q)
>   if (id [[===]] latestId) render(data)
> }
> ```
>
> **Пояснення:** перший спосіб реально скасовує попередній запит перед новим. Другий — для API без `signal`: кожен запит бере свій номер, а відповідь рендериться, лише якщо номер досі останній. `latestId++` повернув би **старе** значення — і `id` ніколи не збігся б з `latestId`.

## ⚠️ Пастки

> [!pitfall] Debounce створюється на кожен рендер
> У React компонент-функція виконується щоразу заново — і разом з нею створюється **новий** debounced-екземпляр з новим таймером. Дебаунс просто не працює.
>
> ```js
> function Search() {
>   const onChange = debounce((e) => load(e.target.value), 300); // ❌ новий щоразу
>   // ✅ const onChange = useMemo(() => debounce(load, 300), []);
>   //    + useEffect(() => () => onChange.cancel(), [onChange]);
> }
> ```

> [!pitfall] Стрілка всередині втрачає `this` і аргументи
> `setTimeout(() => fn(), ms)` викликає `fn` без аргументів і з `this === undefined`. Метод об'єкта, загорнутий у такий debounce, зламається.
>
> ```js
> // ❌ timer = setTimeout(() => fn(), ms);
> // ✅ timer = setTimeout(() => fn.apply(lastThis, lastArgs), ms);
> ```

> [!pitfall] Retry неідемпотентної операції
> Повторити `POST /payments` після таймауту — ризик подвійного списання: запит міг дійти, а загубилась лише відповідь. Retry — лише для ідемпотентних операцій або з ключем ідемпотентності (`Idempotency-Key`), який сервер дедуплікує.

> [!pitfall] Забутий cleanup
> Debounce/throttle з очікуваним викликом після знищення компонента викличе `setState` на розмонтованому компоненті або запит «у нікуди». Викликай `cancel()` у cleanup, абортуй контролери, очищай таймери пулу й retry.

## 🎤 На співбесіді

> [!interview] Чим debounce відрізняється від throttle? Наведи приклади.
> level: middle · frequency: дуже часто · id: jsd-14-int-01
>
> ---
>
> Debounce відкладає виклик, доки події не стихнуть на `ms`: кожна нова подія скидає таймер, виконується лише останній виклик (trailing) або перший (leading). Приклади: автодоповнення, автозбереження, валідація після вводу. Throttle гарантує не більше одного виклику за `ms`, рівномірно під час безперервного потоку: скрол, drag, mousemove, аналітика. Для візуальних оновлень краще throttle через `requestAnimationFrame` — раз на кадр. Реалізую обидва через замикання з таймером, зберігаючи `this` і останні аргументи, плюс `cancel` для cleanup.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Debounce vs throttle: коли що|Розділ: debounce vs throttle]] · [MDN: Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce) · [CSS-Tricks: Debouncing and Throttling Explained](https://css-tricks.com/debouncing-throttling-explained-examples/)

> [!interview] Як обмежити кількість одночасних запитів?
> level: senior · frequency: часто · id: jsd-14-int-02
>
> ---
>
> Пул з лімітом: `limit` workers, кожен у циклі бере наступний індекс (`next++` — безпечно, бо JS однопотоковий і перемикання лише на `await`) і чекає свою задачу; результати пишемо за індексом, щоб зберегти порядок. Або черга з лічильником `active`: `run(task)` повертає проміс, а при завершенні задачі стартує наступна. Додатково: стратегія помилок (fail-fast vs allSettled), скасування решти через `AbortController`, retry з backoff для окремих задач. Готові рішення — `p-limit`, `p-queue`.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Обмеження конкурентності: пул|Розділ: пул конкурентності]] · [MDN: Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) · [MDN: Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

> [!interview] Як прибрати race condition при пошуку з автодоповненням?
> level: middle · frequency: часто · id: jsd-14-int-03
>
> ---
>
> Debounce зменшує кількість запитів, але не порядок відповідей. Гарантія — last-request-wins: перед новим запитом абортую попередній `AbortController` (і ігнорую `AbortError`), або зберігаю id останнього запиту й рендерю відповідь, лише якщо її id актуальний. У React — те саме в cleanup `useEffect`. Бібліотеки на кшталт TanStack Query роблять це за ключем запиту.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Скасування й гонки відповідей у UI|Розділ: гонки відповідей]] · [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) · [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

## 🔗 Зв'язки

- [[JavaScript - 05. Замикання]] — таймер, останні аргументи й лічильники всіх патернів живуть у замиканні.
- [[JavaScript - 08. Event Loop]] — таймери, clamping і rAF визначають, *коли* насправді спрацює debounce чи throttle.
- [[JavaScript - 09. Promise]] — `race`, `all`, `allSettled` — будівельні блоки таймаутів і пулів.
- [[JavaScript - 10. async і await]] — `AbortController` і `AbortSignal.timeout` — справжнє скасування замість «перестати чекати».
- [[JavaScript - 13. Пам'ять і збирач сміття]] — не скасовані таймери й listener-и — класичні витоки.

## ⚡ Фішки

> [!reel] 🛗 Debounce — ліфт, throttle — метро
> Ліфт чекає, поки люди перестануть заходити (debounce). Метро їде за розкладом, хоч би скільки людей набігло (throttle). Пошук — ліфт, скрол — метро.

> [!reel] 🎲 Jitter рятує сервери від натовпу
> Якщо 10 000 клієнтів повторюють запит рівно через 1, 2, 4 с — вони б'ють сервер синхронними хвилями. Випадкова затримка `random(0, backoff)` розмазує навантаження. Аналіз AWS показав: full jitter — найменше зайвої роботи.

> [!reel] 🏁 Promise.race не скасовує програвшого
> Таймаут через `race` лише перестає чекати. Повільний `fetch` продовжить качати дані. Для справжньої зупинки — `AbortSignal.timeout(ms)`.
>
> ```js
> fetch(url, { signal: AbortSignal.timeout(3000) });
> ```

> [!reel] 🖼️ Найкращий throttle для анімацій — rAF
> `requestAnimationFrame` викликає роботу рівно раз на кадр перед рендером і сам засинає у фоновій вкладці. Throttle на 16 мс через `setTimeout` збиватиметься з кадрами.

> [!reel] 🔐 next++ у пулі не потребує мютекса
> JS однопотоковий: між читанням `next` і інкрементом ніхто не втрутиться. Перемикання між «паралельними» workers стається лише на `await` — ось чому пул вміщується в 10 рядків.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке debounce і де його використовують?
> *дуже часто · теорія* · `jsd-14-001`
>
> Обгортка, яка відкладає виклик функції, доки виклики не припиняться на `ms`; кожен новий виклик скидає таймер. Пошук з підказками, автозбереження, валідація після вводу, перерахунок після `resize`.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Як влаштований debounce|Розділ: debounce]] · [MDN: Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce) · [CSS-Tricks: Debouncing and Throttling Explained](https://css-tricks.com/debouncing-throttling-explained-examples/)

> [!question]- Що таке throttle і де його використовують?
> *дуже часто · теорія* · `jsd-14-002`
>
> Обгортка, яка викликає функцію не частіше одного разу за `ms`, навіть якщо події йдуть безперервно. Скрол, drag, рух миші, аналітика, обмеження кліків.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Throttle і requestAnimationFrame|Розділ: throttle]] · [MDN: Throttle](https://developer.mozilla.org/en-US/docs/Glossary/Throttle) · [CSS-Tricks: Debouncing and Throttling Explained](https://css-tricks.com/debouncing-throttling-explained-examples/)

> [!question]- Чим leading відрізняється від trailing?
> *часто · порівняння* · `jsd-14-003`
>
> Leading — виклик на **початку** серії/вікна (миттєва реакція, решта ігнорується: захист від подвійного кліку). Trailing — виклик **наприкінці** з останніми аргументами (фінальний стан: текст пошуку). Можна вмикати обидва.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Debounce vs throttle: коли що|Розділ: leading і trailing]] · [MDN: Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce) · [CSS-Tricks: Debouncing and Throttling Explained](https://css-tricks.com/debouncing-throttling-explained-examples/)

### 🟡 Middle

> [!question]- Як зберегти `this` і аргументи в debounce?
> *часто · код* · `jsd-14-004`
>
> Повертати звичайну `function` (не стрілку), запам'ятовувати `lastThis = this` і `lastArgs = args` при кожному виклику, а в таймері викликати `fn.apply(lastThis, lastArgs)`.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Як влаштований debounce|Розділ: debounce]] · [MDN: Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) · [javascript.info: Decorators and forwarding, call/apply](https://javascript.info/call-apply-decorators)

> [!question]- Чому `Promise.race` для таймауту не скасовує операцію?
> *часто · теорія* · `jsd-14-005`
>
> Проміс — лише представлення результату, а не керування операцією. Race перестає чекати, але таймер, запит чи обчислення тривають. Для зупинки потрібен сигнал, який операція слухає: `AbortController`, `AbortSignal.timeout`.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Таймаут через Promise.race|Розділ: таймаут через race]] · [MDN: Promise.race()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) · [MDN: AbortSignal.timeout()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)

> [!question]- Що таке експоненційний backoff і навіщо jitter?
> *часто · теорія* · `jsd-14-006`
>
> Затримка між повторами росте як `base · 2^attempt` до межі `cap`, щоб дати сервісу відновитися. Jitter додає випадковість (`random(0, backoff)`), щоб тисячі клієнтів не повторювали синхронно й не створювали хвилі навантаження (thundering herd).
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Retry з експоненційним backoff і jitter|Розділ: retry і backoff]] · [AWS: Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

> [!question]- Чому debounce не прибирає race condition у пошуку?
> *іноді · теорія* · `jsd-14-007`
>
> Він лише зменшує кількість запитів. Два запити, розділені паузою, все одно можуть повернутися в зворотному порядку. Потрібне скасування попереднього (`AbortController`) або перевірка id актуального запиту.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Скасування й гонки відповідей у UI|Розділ: гонки відповідей]] · [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) · [MDN: Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce)

### 🔴 Senior

> [!question]- Як працює пул з обмеженням конкурентності і чому `next++` безпечний?
> *часто · практика* · `jsd-14-008`
>
> `limit` workers у циклі беруть наступний індекс і `await`-ять задачу; результат пишуть за індексом. `next++` безпечний, бо JS однопотоковий і перемикання між workers стається лише на `await`, а не між читанням і записом змінної.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Обмеження конкурентності: пул|Розділ: пул конкурентності]] · [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) · [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)

> [!question]- Які операції можна безпечно ретраїти?
> *іноді · теорія* · `jsd-14-009`
>
> Ідемпотентні (GET, PUT з тим самим тілом, DELETE) і лише на тимчасових помилках (мережа, 5xx, 429 з `Retry-After`). Неідемпотентні (POST платежу) — лише з ключем ідемпотентності, який сервер дедуплікує. 4xx (крім 408/429) ретраїти марно.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Retry з експоненційним backoff і jitter|Розділ: retry і backoff]] · [MDN: Idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent) · [AWS: Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

## 🛠️ Практика

> [!task] Реалізуй debounce і поясни своїми словами
> level: middle · difficulty: easy · id: jsd-14-task-01 · tags: debounce, closures, feynman
>
> 1. Напиши `debounce(fn, ms)` (trailing), що зберігає `this` і останні аргументи, і має метод `cancel()`.
> 2. Поясни своїми словами (до 4 речень), чому без замикання debounce неможливий і чим він відрізняється від throttle.
>
> ```js
> const save = debounce(function (text) { console.log(this.id, text); }, 200);
> const editor = { id: 'ed-1', save };
> editor.save('a'); editor.save('ab'); editor.save('abc');
> // через 200 мс → ed-1 abc
> ```
>
> ```js starter
> function debounce(fn, ms) {
>   // твій код: поверни обгортку з методом cancel()
> }
> ```
>
> ```js tests
> test('викликає fn один раз після паузи', () => {
>   vi.useFakeTimers()
>   const spy = vi.fn()
>   const run = debounce(spy, 200)
>   run(); run(); run()
>   expect(spy).not.toHaveBeenCalled()
>   vi.advanceTimersByTime(200)
>   expect(spy).toHaveBeenCalledTimes(1)
> })
>
> test('кожен виклик скидає таймер', () => {
>   vi.useFakeTimers()
>   const spy = vi.fn()
>   const run = debounce(spy, 200)
>   run()
>   vi.advanceTimersByTime(150)
>   run()
>   vi.advanceTimersByTime(150)
>   expect(spy).not.toHaveBeenCalled()
>   vi.advanceTimersByTime(50)
>   expect(spy).toHaveBeenCalledTimes(1)
> })
>
> test('передає останні аргументи і this', () => {
>   vi.useFakeTimers()
>   const calls = []
>   const editor = { id: 'ed-1', save: debounce(function (text) { calls.push(this.id + ' ' + text) }, 200) }
>   editor.save('a'); editor.save('ab'); editor.save('abc')
>   vi.advanceTimersByTime(200)
>   expect(calls).toEqual(['ed-1 abc'])
> })
>
> test('cancel скасовує запланований виклик', () => {
>   vi.useFakeTimers()
>   const spy = vi.fn()
>   const run = debounce(spy, 100)
>   run('x')
>   run.cancel()
>   vi.advanceTimersByTime(500)
>   expect(spy).not.toHaveBeenCalled()
>   run('y')
>   vi.advanceTimersByTime(100)
>   expect(spy).toHaveBeenCalledWith('y')
> })
> ```
>
> > [!hint]- Підказка 1
> > Де зберігати таймер, щоб він «пережив» виклик і був спільним для всіх наступних викликів?
>
> > [!hint]- Підказка 2
> > Кожен виклик: `clearTimeout(timer)` → новий `setTimeout`. `this` і `args` забирай із поточного виклику.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function debounce(fn, ms) {
> >   let timer = null;
> >   function debounced(...args) {
> >     clearTimeout(timer);
> >     timer = setTimeout(() => {
> >       timer = null;
> >       fn.apply(this, args); // стрілка бере this і args з debounced
> >     }, ms);
> >   }
> >   debounced.cancel = () => {
> >     clearTimeout(timer);
> >     timer = null;
> >   };
> >   return debounced;
> > }
> > ```
> >
> > **Бонус — `leading` і `flush`:**
> >
> > ```js
> > function debounceFull(fn, ms, { leading = false, trailing = true } = {}) {
> >   let timer = null, lastArgs, lastThis;
> >   const invoke = () => {
> >     const [args, ctx] = [lastArgs, lastThis];
> >     lastArgs = lastThis = undefined; // щоб leading+trailing не викликав двічі
> >     return fn.apply(ctx, args);
> >   };
> >   function debounced(...args) {
> >     [lastArgs, lastThis] = [args, this];
> >     const callNow = leading && timer === null;
> >     clearTimeout(timer);
> >     timer = setTimeout(() => {
> >       timer = null;
> >       if (trailing && lastArgs) invoke();
> >     }, ms);
> >     if (callNow) invoke();
> >   }
> >   debounced.cancel = () => { clearTimeout(timer); timer = null; lastArgs = lastThis = undefined; };
> >   debounced.flush = () => {
> >     if (timer === null) return;
> >     clearTimeout(timer);
> >     timer = null;
> >     if (lastArgs) invoke();
> >   };
> >   return debounced;
> > }
> > ```
> >
> > **Пояснення своїми словами:** debounce має пам'ятати таймер між викликами, а локальні змінні звичайної функції зникають після `return` — замикання дає «приватну шухляду», спільну для всіх викликів однієї обгортки. Кожен виклик відкриває шухляду, викидає старий таймер і кладе новий, тож спрацює лише останній — коли настане тиша. Throttle теж зберігає стан у замиканні, але не скидає таймер, а пропускає не частіше одного виклику за вікно — тому під час безперервних подій він спрацьовує регулярно, а debounce мовчить.

> [!task] Реалізуй throttle (leading + trailing)
> level: middle · difficulty: medium · id: jsd-14-task-02 · tags: throttle, timers
>
> Напиши `throttle(fn, ms)`: перший виклик — одразу; виклики всередині вікна — один trailing-виклик наприкінці вікна з **останніми** аргументами; `this` зберігається; є `cancel()`.
>
> ```js
> const t = throttle((x) => console.log(x), 100);
> t(1); t(2); t(3);                 // → 1 одразу, 3 на 100 мс
> setTimeout(() => t(4), 150);      // → 4 на 200 мс
> ```
>
> ```js starter
> function throttle(fn, ms) {
>   // твій код: поверни обгортку з методом cancel()
> }
> ```
>
> ```js tests
> test('перший виклик — одразу', () => {
>   vi.useFakeTimers()
>   const spy = vi.fn()
>   throttle(spy, 100)(1)
>   expect(spy).toHaveBeenCalledTimes(1)
>   expect(spy).toHaveBeenCalledWith(1)
> })
>
> test('виклики у вікні дають один trailing з останніми аргументами', () => {
>   vi.useFakeTimers()
>   const spy = vi.fn()
>   const t = throttle(spy, 100)
>   t(1); t(2); t(3)
>   vi.advanceTimersByTime(99)
>   expect(spy).toHaveBeenCalledTimes(1)
>   vi.advanceTimersByTime(1)
>   expect(spy).toHaveBeenCalledTimes(2)
>   expect(spy.mock.calls[1]).toEqual([3])
> })
>
> test('виклик після trailing чекає кінця нового вікна', () => {
>   vi.useFakeTimers()
>   const spy = vi.fn()
>   const t = throttle(spy, 100)
>   t(1); t(2)                  // 1 одразу, 2 на 100 мс
>   vi.advanceTimersByTime(150)
>   t(4)                        // вікно від 100 до 200
>   expect(spy).toHaveBeenCalledTimes(2)
>   vi.advanceTimersByTime(50)
>   expect(spy).toHaveBeenCalledTimes(3)
>   expect(spy.mock.calls[2]).toEqual([4])
> })
>
> test('зберігає this і для негайного, і для trailing-виклику', () => {
>   vi.useFakeTimers()
>   const seen = []
>   const holder = { n: 7, hit: throttle(function (x) { seen.push(this.n + ':' + x) }, 100) }
>   holder.hit('a')
>   holder.hit('b')
>   vi.advanceTimersByTime(100)
>   expect(seen).toEqual(['7:a', '7:b'])
> })
>
> test('cancel скасовує trailing і скидає вікно', () => {
>   vi.useFakeTimers()
>   const spy = vi.fn()
>   const t = throttle(spy, 100)
>   t(1); t(2)
>   t.cancel()
>   vi.advanceTimersByTime(500)
>   expect(spy).toHaveBeenCalledTimes(1)
>   t(3)
>   expect(spy).toHaveBeenCalledTimes(2)
> })
> ```
>
> > [!hint]- Підказка 1
> > Зберігай час останнього виклику `last` і обчислюй `remaining = ms - (now - last)`.
>
> > [!hint]- Підказка 2
> > Якщо `remaining <= 0` — викликай одразу. Інакше, якщо таймера ще немає, — заплануй один на `remaining`.
>
> > [!hint]- Підказка 3
> > Оновлюй `lastArgs` при **кожному** виклику, навіть якщо таймер уже є — так trailing отримає найсвіжіші аргументи.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function throttle(fn, ms) {
> >   let last = 0;
> >   let timer = null;
> >   let lastArgs;
> >   let lastThis;
> >
> >   function invoke() {
> >     last = Date.now();
> >     timer = null;
> >     const args = lastArgs;
> >     const ctx = lastThis;
> >     lastArgs = lastThis = undefined;
> >     fn.apply(ctx, args);
> >   }
> >
> >   function throttled(...args) {
> >     lastArgs = args;
> >     lastThis = this;
> >     const remaining = ms - (Date.now() - last);
> >     if (remaining <= 0) {
> >       clearTimeout(timer);
> >       invoke();
> >     } else if (timer === null) {
> >       timer = setTimeout(invoke, remaining);
> >     }
> >   }
> >
> >   throttled.cancel = () => {
> >     clearTimeout(timer);
> >     timer = null;
> >     last = 0;
> >     lastArgs = lastThis = undefined;
> >   };
> >   return throttled;
> > }
> > ```
> >
> > `clearTimeout` у гілці `remaining <= 0` потрібен на випадок, коли таймер «запізнився» (зайнятий потік): інакше після негайного виклику спрацював би ще й trailing. Для продакшну варто брати `performance.now()` — він монотонний і не стрибає при зміні системного годинника.

> [!task] Пул промісів з обмеженням конкурентності
> level: senior · difficulty: hard · id: jsd-14-task-03 · tags: promise, concurrency, async
>
> Реалізуй `createPool(limit)` з методом `run(task)`, де `task` — функція, що повертає проміс (або кидає синхронно). `run` повертає проміс з результатом саме цієї задачі. Одночасно виконується не більше `limit` задач; решта чекає в черзі FIFO. Додай геттери `active` і `pending`. Помилка однієї задачі не зупиняє пул.
>
> ```js
> const pool = createPool(2);
> const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
> const results = await Promise.allSettled([
>   pool.run(() => sleep(100).then(() => 'A')),
>   pool.run(() => sleep(50).then(() => { throw new Error('B failed'); })),
>   pool.run(() => sleep(50).then(() => 'C')),
>   pool.run(() => { throw new Error('sync'); }),
> ]);
> // → A, B failed, C, sync — і ніколи більше двох задач одночасно
> ```
>
> ```js starter
> function createPool(limit) {
>   // твій код
>   return {
>     run(task) {},
>     get active() { return 0 },
>     get pending() { return 0 },
>   }
> }
> ```
>
> ```js tests
> const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms))
>
> test('run повертає результат саме своєї задачі', async () => {
>   const pool = createPool(2)
>   const [a, b] = await Promise.all([
>     pool.run(() => wait(20, 'A')),
>     pool.run(() => wait(5, 'B')),
>   ])
>   expect([a, b]).toEqual(['A', 'B'])
> })
>
> test('одночасно не більше limit задач, решта — в черзі', async () => {
>   const pool = createPool(2)
>   let running = 0
>   let peak = 0
>   const task = () => {
>     running++
>     peak = Math.max(peak, running)
>     return wait(10).then(() => { running-- })
>   }
>   const all = Promise.all([1, 2, 3, 4, 5].map(() => pool.run(task)))
>   expect(pool.active).toBe(2)
>   expect(pool.pending).toBe(3)
>   await all
>   expect(peak).toBe(2)
>   expect(pool.active).toBe(0)
>   expect(pool.pending).toBe(0)
> })
>
> test('задачі стартують у порядку FIFO', async () => {
>   const pool = createPool(1)
>   const started = []
>   const make = (name) => () => { started.push(name); return wait(2) }
>   await Promise.all(['a', 'b', 'c'].map((n) => pool.run(make(n))))
>   expect(started).toEqual(['a', 'b', 'c'])
> })
>
> test('помилка (і синхронний throw) не зупиняє пул', async () => {
>   const pool = createPool(1)
>   const results = await Promise.allSettled([
>     pool.run(() => wait(5).then(() => { throw new Error('async fail') })),
>     pool.run(() => { throw new Error('sync fail') }),
>     pool.run(() => wait(5, 'ok')),
>   ])
>   expect(results.map((r) => r.status)).toEqual(['rejected', 'rejected', 'fulfilled'])
>   expect(results[1].reason.message).toBe('sync fail')
>   expect(results[2].value).toBe('ok')
> })
> ```
>
> > [!hint]- Підказка 1
> > `run` кладе в чергу `{ task, resolve, reject }` і викликає `next()`.
>
> > [!hint]- Підказка 2
> > `next()` стартує задачу, лише якщо `active < limit`; після завершення будь-якої задачі — `active--` і знову `next()`.
>
> > [!hint]- Підказка 3
> > Синхронний `throw` у `task` перетвориться на rejection, якщо запустити її як `Promise.resolve().then(task)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createPool(limit) {
> >   let active = 0;
> >   const queue = [];
> >
> >   function next() {
> >     if (active >= limit || queue.length === 0) return;
> >     const { task, resolve, reject } = queue.shift();
> >     active++;
> >     Promise.resolve()
> >       .then(task)                 // ловить і синхронні винятки
> >       .then(resolve, reject)
> >       .finally(() => {
> >         active--;
> >         next();
> >       });
> >   }
> >
> >   return {
> >     run(task) {
> >       return new Promise((resolve, reject) => {
> >         queue.push({ task, resolve, reject });
> >         next();
> >       });
> >     },
> >     get active() { return active; },
> >     get pending() { return queue.length; },
> >   };
> > }
> > ```
> >
> > Кожна задача отримує власний проміс, тож помилка однієї не впливає на інші. Розширення для продакшну: `queue.shift()` — O(n), для великих черг — кільцевий буфер; `AbortSignal` для скасування ще не стартованих задач; пріоритети; метод `onIdle()`. Саме так влаштовані `p-limit` і `p-queue`.

## 📚 Джерела та що почитати

- 🟢 [MDN — Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce) — визначення debounce з прикладами.
- 🟢 [MDN — Throttle](https://developer.mozilla.org/en-US/docs/Glossary/Throttle) — визначення throttle і де він потрібен.
- 🟢 [CSS-Tricks — Debouncing and Throttling Explained](https://css-tricks.com/debouncing-throttling-explained-examples/) — наочне порівняння debounce, throttle і rAF.
- 🟡 [MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) — скасування запитів і слухачів.
- 🟡 [MDN — AbortSignal.timeout()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) — вбудований таймаут для `fetch`.
- 🟡 [AWS — Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) — чому backoff без jitter спричиняє лавину повторів.
- 🟡 [MDN — Idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent) — які HTTP-методи безпечно повторювати.
- 🟡 [MDN — requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) — як синхронізувати роботу з кадрами браузера.

> [!important] Підсумок
> - Debounce — «після паузи» (пошук, автозбереження), throttle — «не частіше ніж» (скрол, drag); leading реагує одразу, trailing — фінальним станом.
> - Обидва тримають таймер, `this` і останні аргументи в замиканні; `cancel` у cleanup обов'язковий; для візуального — throttle через rAF.
> - Retry: експоненційний backoff + full jitter + `cap`, лише для ідемпотентних операцій і тимчасових помилок.
> - `Promise.race` для таймауту лише перестає чекати — справжнє скасування дає `AbortSignal`.
> - Пул обмежує конкурентність; застарілі відповіді в UI прибирає `AbortController` або перевірка id запиту, а не debounce.
