---
title: Event Loop
order: 8
level: middle
tags: [event-loop, async, microtasks, timers, rendering]
prerequisites:
  - "[[JavaScript - 01. Як JS виконує код]]"
  - "[[JavaScript - 05. Замикання]]"
estimatedMinutes: 45
id: jsd-ch-08
icon: "🔁"
---

# JavaScript - 08. Event Loop

> [!success] 🎯 Після цього розділу ти зможеш
> - Передбачити порядок виводу коду, що змішує синхронний код, `setTimeout`, `Promise.then` і `queueMicrotask`.
> - Пояснити, чим task (macrotask) відрізняється від microtask і чому microtasks можуть «заморозити» сторінку.
> - Назвати, де в циклі живуть `requestAnimationFrame`, style, layout і paint, і чому важкий синхронний код ламає анімації.
> - Пояснити, чому `setTimeout(fn, 0)` — це «не раніше ніж», а не «одразу», і де є мінімальні затримки.
> - Описати відмінності Node.js: фази libuv, `process.nextTick`, `setImmediate`.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jsd-08-quiz-01
>
> ```js
> console.log(1);
> setTimeout(() => console.log(2), 0);
> new Promise((resolve) => {
>   console.log(3);
>   resolve();
> }).then(() => console.log(4));
> console.log(5);
> ```
>
> **Відповідь:** `1 3 5 4 2`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Коротко: executor промісу виконується синхронно (`3` стоїть серед синхронних), `.then` — це microtask, яка біжить одразу після синхронного коду, а `setTimeout` — задача, що чекає наступного оберту циклу.

## 🧒 Простими словами

Уяви кухню ресторану з **одним** кухарем. Він готує одну страву від початку до кінця й ніколи не кидає її на півдорозі (це *run-to-completion*). Духовка, мікрохвильовка й кур'єр працюють самі — це **Web APIs**: кухар лише ставить таймер і повертається до справ. Коли духовка дзенькнула, на стійку лягає папірець «дістати пиріг» — це **черга задач**. Але є ще маленький стікер на дошці «додати соус до щойно готової страви» — це **microtasks**: кухар обробляє *всі* стікери, перш ніж узяти наступний папірець зі стійки. А раз на ~16 мс офіціант забирає тарілки в зал — це **рендер**. Якщо кухар 3 секунди ріже цибулю без перерви — зал 3 секунди бачить ту саму картинку.

## 🔬 Як це працює насправді

### Call stack і run-to-completion

JavaScript-рушій (V8, SpiderMonkey, JavaScriptCore) має **один call stack** на потік. Кожен виклик функції кладе на стек *execution context*, `return` — знімає його (LIFO). Поки на стеку є хоч один кадр, жоден інший callback не може почати виконуватися: функцію неможливо перервати посередині — лише дочекатися її кінця.

> [!viz] call-stack
> scenario: nested-calls

```js
function c() { console.log('c'); }
function b() { c(); console.log('b'); }
function a() { b(); console.log('a'); }
a();
// → c
// → b
// → a
```

Стек росте `a → b → c` і розкручується у зворотному порядку. Якщо вкладених викликів забагато (рекурсія без базового випадку), рушій кидає `RangeError: Maximum call stack size exceeded`.

> [!quiz] Перевір себе: таймер і зайнятий стек
> level: junior · id: jsd-08-quiz-02
>
> ```js
> setTimeout(() => console.log('timer'), 0);
> const end = Date.now() + 1000;
> while (Date.now() < end) {}
> console.log('loop done');
> ```
>
> - [ ] `timer` виведеться приблизно через 0–4 мс, а `loop done` — через секунду
> - [x] Спершу `loop done` через ~1 с, і лише потім `timer`
> - [ ] `timer` не виведеться ніколи — `while` його «з'їв»
>
> **Пояснення:** таймер справді «дозрів» майже одразу, але його callback може стартувати лише тоді, коли стек порожній. Цикл `while` тримає стек зайнятим секунду.

### Хост, Web APIs і черга задач

Важливий факт для співбесіди: **у специфікації ECMAScript немає event loop**. Там є лише *jobs* (наприклад, реакції промісів), а «коли і як їх запускати» вирішує **хост**: браузер за HTML Standard або Node.js через libuv. `setTimeout`, `fetch`, DOM-події — теж не частина мови, а API хоста.

Коли ти викликаєш `setTimeout(cb, 100)`, рушій лише передає `cb` хосту й одразу йде далі. Через 100 мс хост кладе **задачу** (task, у фольклорі — *macrotask*) у чергу. Event loop, спрощено:

```text
loop:
  1. взяти ОДНУ найстарішу задачу з task queue і виконати до кінця
  2. виконати ВСІ microtasks (включно з тими, що додались по ходу)
  3. якщо настав час кадру — оновити рендер (rAF → style → layout → paint)
  4. повторити
```

> [!viz] event-loop
> scenario: basic-timeout

Деталь, яку знають одиниці: за HTML spec черг задач **кілька** (за джерелами: таймери, ввід користувача, мережа…), і браузер сам обирає, з якої брати наступну — наприклад, віддає пріоритет кліку перед таймером. Порядок усередині *однієї* черги зберігається. Тому «одна черга макрозадач» — це спрощено.

```js
setTimeout(() => console.log('100ms'), 100);
setTimeout(() => console.log('0ms'), 0);
setTimeout(() => console.log('10ms'), 10);
// → 0ms
// → 10ms
// → 100ms
```

> [!quiz] Перевір себе: хто кому що належить
> level: junior · type: multi · id: jsd-08-quiz-03
>
> Що з цього надає **хост** (браузер чи Node), а не сам ECMAScript?
>
> - [x] `setTimeout`
> - [ ] `Promise`
> - [x] Event loop
> - [x] `fetch`
> - [ ] `Array.prototype.map`
>
> **Пояснення:** `Promise` і масиви описані в ECMAScript. Таймери, `fetch` і сам цикл — у HTML Standard (браузер) або в Node.js/libuv.

### Microtasks: черга, яку спорожнюють до дна

**Microtask** — дрібне «доробити одразу після поточного коду». Їх створюють:

- реакції промісів: callback-и `.then` / `.catch` / `.finally`, продовження після `await`;
- `queueMicrotask(fn)`;
- `MutationObserver`.

Ключове правило: microtask checkpoint настає щоразу, коли **стек JS спорожнів** (після задачі, після кожного callback-а події), і він виконує чергу **до повного спорожнення** — включно з microtasks, які додались під час цього процесу. Лише потім браузер може рендерити або взяти наступну задачу.

> [!viz] event-loop
> scenario: promise-vs-timeout

```js
setTimeout(() => {
  console.log('t1');
  Promise.resolve().then(() => console.log('p1'));
}, 0);
setTimeout(() => console.log('t2'), 0);
Promise.resolve().then(() => {
  console.log('p2');
  setTimeout(() => console.log('t3'), 0);
});
console.log('sync');
// → sync, p2, t1, p1, t2, t3
```

Розбір: після синхронного коду спорожнюються microtasks (`p2`, яка ставить `t3` у кінець черги таймерів). Далі задача `t1`; її microtask `p1` виконується **до** наступної задачі `t2`. Останнім іде `t3`.

> [!figure] devtools-console
> scenario: promise-order
>
> Порядок виводу в консолі — це порядок event loop: спершу весь синхронний код, далі мікрозадачі, і лише потім таймер.

> [!quiz] Перевір себе: microtask, що породжує microtask
> level: middle · type: output · id: jsd-08-quiz-04
>
> ```js
> Promise.resolve()
>   .then(() => {
>     console.log('a');
>     queueMicrotask(() => console.log('b'));
>   })
>   .then(() => console.log('c'));
> queueMicrotask(() => console.log('d'));
> ```
>
> **Відповідь:** `a d b c`
>
> **Пояснення:** у черзі спершу `then#1` і `d`. `then#1` друкує `a` і ставить `b`; коли він повертається, проміс другого `.then` резолвиться і в кінець черги стає `c`. Черга: `d → b → c`. Див. [Jake Archibald: Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/).

### Starvation: коли microtasks «з'їдають» сторінку

Оскільки чергу microtasks спорожнюють до дна, microtask, яка щоразу ставить нову microtask, **ніколи не відпустить цикл**: не буде ні рендеру, ні кліків, ні таймерів. Сторінка зависне так само, як від `while (true)`, тільки без жодного «довгого» виклику в профайлері — лише нескінченна низка коротких.

> [!viz] event-loop
> scenario: microtask-starvation

```js
// ❌ вкладка замерзне назавжди
function spin() { queueMicrotask(spin); }
spin();

// ✅ між ітераціями браузер встигає рендерити й обробляти ввід
function tick() { setTimeout(tick, 0); }
tick();
```

Рекурсивний `setTimeout` безпечний, бо кожен наступний крок — нова **задача**, а між задачами цикл встигає зробити все інше.

> [!quiz] Перевір себе: що заморозить вкладку?
> level: middle · type: multi · id: jsd-08-quiz-05
>
> - [x] `function f() { Promise.resolve().then(f) } f()`
> - [ ] `function f() { setTimeout(f, 0) } f()`
> - [x] `while (true) {}`
> - [ ] `function f() { requestAnimationFrame(f) } f()`
>
> **Пояснення:** нескінченний ланцюжок microtasks і нескінченний синхронний цикл не дають циклу дійти до рендеру. `setTimeout` і `requestAnimationFrame` щоразу повертають керування циклу.

> [!quiz] Перевір себе: впиши, куди ставити колбеки
> level: middle · type: fill · id: jsd-08-quiz-09 · bank: requestIdleCallback, Promise.resolve
>
> ```js fill
> setTimeout(() => console.log('timeout'), 0)
> [[queueMicrotask]](() => console.log('micro'))
> console.log('sync')
> // → sync, micro, timeout
>
> // віддати керування циклу, щоб браузер встиг намалювати кадр і обробити кліки:
> const yieldToLoop = () => new Promise((resolve) => [[setTimeout]](resolve, 0))
> ```
>
> **Пояснення:** `queueMicrotask` ставить колбек у чергу мікрозадач — вона спорожнюється одразу після синхронного коду, ще до будь-якого таймера. Але саме тому мікрозадачею **не можна** «віддати керування»: рендер настає лише між задачами, тож для `yieldToLoop` потрібна макрозадача — `setTimeout`.

### Рендер: rAF, style, layout, paint

Браузер не перемальовує екран після кожного рядка коду. Рендер — окремий крок циклу, який настає приблизно раз на кадр (60 Гц ≈ кожні 16,7 мс, на 120 Гц-екранах частіше) і **лише між задачами**. Спрощено, крок «update the rendering» за HTML spec:

```text
… scroll / resize events, media queries
→ requestAnimationFrame callbacks
→ style (перерахунок CSS)
→ layout (геометрія)
→ ResizeObserver, IntersectionObserver
→ paint (і composite)
```

Наслідки:

- **Зміни DOM в одній задачі батчаться.** Сто змін `style` в одному callback-у — один перерахунок і один paint у кінці (якщо ти сам не форсуєш layout читанням `offsetHeight` чи `getComputedStyle`).
- **`requestAnimationFrame(cb)`** запускає `cb` прямо перед наступним рендером — ідеальне місце для анімацій. rAF, викликаний усередині rAF, піде вже на **наступний** кадр.
- **Довга задача (> 50 мс) = пропущені кадри.** Поки стек зайнятий, кадр не намалюється.

```js
// показати спінер, а потім рахувати — НЕ працює:
spinner.hidden = false;
heavyCalc(); // 2 секунди
// браузер так і не встиг намалювати спінер до кінця задачі

// ✅ дати кадру відрендеритись, потім рахувати
spinner.hidden = false;
requestAnimationFrame(() => setTimeout(heavyCalc, 0));
```

> [!quiz] Перевір себе: коли виконується rAF?
> level: middle · id: jsd-08-quiz-06
>
> - [ ] Одразу після кожної задачі, перед microtasks
> - [ ] Рівно кожні 16 мс, перериваючи поточний код
> - [x] Перед style/layout/paint наступного кадру, між задачами
> - [ ] Після paint, щоб прочитати готову геометрію
>
> **Пояснення:** rAF-callbacks — частина кроку «update the rendering» і виконуються перед перерахунком стилів і малюванням. Нічого не переривається: рендер чекає, доки стек порожній.

> [!quiz] Перевір себе: склади один оберт event loop (спрощено)
> level: middle · type: order · id: jsd-08-quiz-10
>
> ```js order
> while (true) {
>   const task = taskQueue.shift()
>   run(task)
>   while (microtasks.length) run(microtasks.shift())
>   if (timeToRender()) {
>     runAnimationFrames()
>     styleLayoutPaint()
>   }
> }
>   if (microtasks.length) run(microtasks.shift()) // ✗
> ```
>
> **Пояснення:** одна задача → **уся** черга мікрозадач до дна (тому `while`, а не `if`) → за потреби рендер: спершу rAF-колбеки, потім style, layout, paint. Тоді наступна задача.

### `setTimeout`: мінімальна затримка, clamping і переповнення

Другий аргумент — це **мінімальний** час до постановки в чергу, а не гарантія. Плюс кілька правил хоста:

| Правило | Деталь |
|---|---|
| Вкладеність | за HTML spec, якщо рівень вкладеності таймерів > 5 і затримка < 4 мс — вона стає **4 мс** |
| Фонова вкладка | браузери обмежують таймери до ~1 разу на секунду; Chrome у «глибоко прихованих» вкладках — аж до 1 разу на хвилину для ланцюжків таймерів |
| Переповнення | затримка зберігається як 32-бітне знакове ціле: > 2³¹−1 мс (≈ 24,8 доби) → таймер спрацює майже одразу |
| Node.js | затримка `0` (і будь-яка < 1 або завелика) перетворюється на `1` мс |

```js
setTimeout(() => console.log('A'), 2 ** 31); // «через 24,8 доби»
setTimeout(() => console.log('B'), 10);
// → A
// → B
// Node ще й попередить: TimeoutOverflowWarning
```

> [!quiz] Перевір себе: точність таймерів
> level: middle · type: multi · id: jsd-08-quiz-07
>
> Які твердження правдиві?
>
> - [x] `setTimeout(fn, 0)` гарантує, що `fn` виконається після поточного синхронного коду і всіх microtasks
> - [ ] `setTimeout(fn, 100)` гарантує виклик рівно через 100 мс
> - [x] У фоновій вкладці інтервал може виконуватися значно рідше, ніж задано
> - [x] Глибоко вкладені `setTimeout(fn, 0)` у браузері отримують мінімум 4 мс
>
> **Пояснення:** затримка — нижня межа. Реальний момент залежить від зайнятості стека, черг, clamping-у і троттлінгу.

### Node.js: фази, `process.nextTick` і `setImmediate`

Node будує цикл на libuv, і в ньому є **фази** (спрощено):

> [!diagram] Оберт event loop у Node: фази по колу
> ```yaml
> layout: flow
> nodes:
>   - { id: timers, label: "timers", text: "setTimeout / setInterval", tone: yellow, icon: "px:alarm" }
>   - { id: pending, label: "pending callbacks", text: "відкладені системні", tone: gray }
>   - { id: poll, label: "poll", text: "I/O: файли, мережа", tone: blue, icon: "px:database" }
>   - { id: check, label: "check", text: "setImmediate", tone: mint }
>   - { id: close, label: "close callbacks", text: "socket.on('close')", tone: gray }
> edges:
>   - { from: timers, to: pending }
>   - { from: pending, to: poll }
>   - { from: poll, to: check }
>   - { from: check, to: close }
>   - { from: close, to: timers, label: "новий оберт" }
> steps:
>   - { focus: timers, note: "Цикл ходить фазами по колу. У timers виконуються колбеки таймерів, чий час уже минув." }
>   - { move: { from: pending, to: poll, value: "чекаємо I/O" }, note: "У poll Node чекає на I/O. Файл прочитано — виконується його callback." }
>   - { set: { poll: "callback: setTimeout(…, 0) + setImmediate(…)" }, note: "Усередині I/O-callback-а ставимо і таймер на 0 мс, і setImmediate." }
>   - { move: { from: poll, to: check, value: "immediate" }, set: { check: "→ immediate" }, note: "Після poll одразу йде check — тому всередині I/O setImmediate завжди спрацьовує першим." }
>   - { set: { timers: "→ timeout" }, focus: timers, note: "Таймер чекає до наступного оберту: close → timers, і лише тоді timeout." }
>   - { focus: [timers, pending, poll, check, close], note: "Після КОЖНОГО callback-а Node спорожнює дві черги: спершу process.nextTick, потім мікрозадачі промісів." }
> ```

Після **кожного** callback-а (з Node 11 — так само, як у браузері) Node спорожнює дві черги: спершу `process.nextTick`, потім microtasks промісів.

```js
// script.js (CommonJS)
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('sync');
// → sync, nextTick, promise, далі timeout/immediate — порядок НЕ гарантований
```

- Порядок `timeout` vs `immediate` у головному модулі залежить від того, чи встигла минути 1 мс до першої фази timers.
- Усередині I/O-callback-а `setImmediate` **завжди** раніше: після poll одразу йде check.
- У ES-модулі (`.mjs`) сам код модуля виконується з промісного job-а, тож `promise` може вивестись **раніше** за `nextTick`. Не будуй логіку на цьому порядку.

> [!quiz] Перевір себе: Node всередині I/O
> level: senior · id: jsd-08-quiz-08
>
> ```js
> const fs = require('fs');
> fs.readFile(__filename, () => {
>   setTimeout(() => console.log('timeout'), 0);
>   setImmediate(() => console.log('immediate'));
> });
> ```
>
> - [ ] `timeout`, `immediate`
> - [x] `immediate`, `timeout`
> - [ ] Порядок випадковий
>
> **Пояснення:** callback `readFile` виконується у фазі poll. Наступна фаза — check (`setImmediate`), а timers будуть лише на наступному оберті циклу.

## ⚠️ Пастки

> [!pitfall] Важкий синхронний код блокує все
> Обчислення на 2 секунди в обробнику кліку = 2 секунди без рендеру, без інших кліків і без таймерів. `async` тут не допоможе — синхронний код усередині `async`-функції так само блокує.
>
> ```js
> button.onclick = async () => {
>   const result = expensiveSort(hugeArray); // блокує, незважаючи на async
>   render(result);
> };
> ```
>
> Рішення: розбити роботу на шматки з `setTimeout`/`scheduler.yield()` між ними або винести у Web Worker.

> [!pitfall] Стилі батчаться — і transition «не спрацьовує»
> Браузер перераховує стилі лише раз на кадр, тож проміжні значення в межах однієї задачі для нього не існують.
>
> ```js
> box.style.transform = 'translateX(1000px)';
> box.style.transition = 'transform 1s';
> box.style.transform = 'translateX(500px)';
> // анімація йде з 0 до 500px, а не з 1000 до 500
> ```
>
> Фікс: між кроками форсувати перерахунок (`getComputedStyle(box).transform`) або перенести другий крок у подвійний `requestAnimationFrame`.

> [!pitfall] `el.click()` ≠ реальний клік
> При справжньому кліку кожен listener — окремий callback, і після кожного стек порожніє → microtasks виконуються **між** listener-ами. При `el.click()` з коду стек не порожній (на ньому твій скрипт), тож microtasks чекають кінця обох listener-ів.
>
> ```js
> btn.addEventListener('click', () => {
>   Promise.resolve().then(() => console.log('micro 1'));
>   console.log('listener 1');
> });
> btn.addEventListener('click', () => console.log('listener 2'));
> // реальний клік: listener 1, micro 1, listener 2
> // btn.click():   listener 1, listener 2, micro 1
> ```

> [!pitfall] Логіка, що залежить від `setTimeout` vs `setImmediate` у Node
> У головному модулі їхній порядок недетермінований і може відрізнятися між запусками й машинами. Якщо порядок важливий — вибудовуй його явно (проміси, колбеки), а не через «фазу, яка, здається, раніше».

## 🎤 На співбесіді

> [!interview] Поясни, як працює event loop
> level: middle · frequency: дуже часто · id: jsd-08-int-01
>
> ---
>
> JS виконується в одному потоці з одним call stack, функції працюють до кінця (run-to-completion). Асинхронні операції (таймери, мережа, події) обслуговує хост, а їхні callback-и потрапляють у черги задач. Event loop — механізм хоста (HTML spec / libuv), не ECMAScript: коли стек порожній, він бере одну задачу, виконує її, потім спорожнює чергу microtasks повністю (проміси, `queueMicrotask`, `MutationObserver`), за потреби рендерить кадр (rAF → style → layout → paint) і повторює. Звідси наслідки: `then` раніше за `setTimeout(0)`, довгий синхронний код блокує рендер, нескінченні microtasks заморожують сторінку.
>
> 📚 [[JavaScript - 08. Event Loop#Хост, Web APIs і черга задач|Розділ: хост і черга задач]] · [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) · [Jake Archibald: Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

> [!interview] Як виконати важке обчислення, не заморозивши UI?
> level: middle · frequency: часто · id: jsd-08-int-02
>
> ---
>
> Три рівні. 1) **Розбити на чанки** і між ними віддавати керування циклу: `setTimeout(next, 0)`, `scheduler.yield()` (Chromium) або `requestIdleCallback` для неважливої роботи; орієнтир — шматок до ~50 мс, щоб не було long task. 2) **Web Worker** — справжній паралелізм в окремому потоці, обмін через `postMessage` (дані копіюються structured clone або передаються як `Transferable`). 3) Прибрати зайву роботу: мемоізація, віртуалізація списків, debounce вводу. Microtasks для чанкінгу **не підходять** — вони не дають браузеру рендерити.
>
> 📚 [[JavaScript - 08. Event Loop#Starvation: коли microtasks «з'їдають» сторінку|Розділ: starvation]] · [MDN: Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) · [web.dev: Optimize long tasks](https://web.dev/articles/optimize-long-tasks)

> [!interview] Чим `process.nextTick` відрізняється від `setImmediate` і `Promise.then`?
> level: senior · frequency: іноді · id: jsd-08-int-03
>
> ---
>
> `process.nextTick` ставить callback у власну чергу Node, яку спорожнюють після поточної операції **раніше** за microtasks промісів (у CommonJS). `Promise.then` — стандартна microtask. `setImmediate` — це задача у фазі check, тобто наступний «повноцінний» оберт після I/O. Рекурсивний `nextTick` так само може «заголодити» цикл, як і рекурсивні microtasks; документація Node радить надавати перевагу `queueMicrotask`/`setImmediate`.
>
> 📚 [[JavaScript - 08. Event Loop#Node.js: фази, process.nextTick і setImmediate|Розділ: event loop у Node.js]] · [Node.js: The Event Loop, Timers, and process.nextTick()](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick) · [Node.js: Understanding process.nextTick()](https://nodejs.org/learn/asynchronous-work/understanding-processnexttick)

## 🔗 Зв'язки

- [[JavaScript - 01. Як JS виконує код]] — call stack і execution context, на яких тримається вся модель циклу.
- [[JavaScript - 05. Замикання]] — кожен callback у черзі «пам'ятає» змінні завдяки замиканню, тому `for (var i…)` + `setTimeout` дає сюрпризи.
- [[JavaScript - 09. Promise]] — реакції промісів і є головним джерелом microtasks.
- [[JavaScript - 10. async і await]] — `await` = пауза функції й продовження як microtask.
- [[JavaScript - 14. Debounce, throttle та async-патерни]] — практичні патерни, що керують тим, *коли* потрапляти в чергу.

## ⚡ Фішки

> [!reel] 🗓️ setTimeout на 25 днів спрацює одразу
> Затримка зберігається як 32-бітне знакове ціле. Усе, що більше за 2³¹−1 мс (≈ 24,8 доби), переповнюється — і таймер вистрілює майже миттєво.
>
> ```js
> setTimeout(() => alert('сюрприз'), 30 * 24 * 3600 * 1000);
> // спрацює одразу
> ```

> [!reel] 📜 Event loop немає в специфікації JavaScript
> ECMAScript описує лише jobs і черги промісних реакцій. Сам цикл — задачі, microtask checkpoint, рендер — визначає HTML Standard. У Node це libuv, і тому деталі там інші.

> [!reel] 🐌 Таймер у фоновій вкладці — не частіше раза на секунду
> Браузери троттлять таймери прихованих вкладок до ~1 с, а Chrome для довгих ланцюжків таймерів у вкладці, прихованій понад 5 хв, — до одного разу на хвилину. Годинник на `setInterval` у фоні збреше.

> [!reel] 🧊 Ланцюжок microtasks заморозить вкладку
> Чергу microtasks спорожнюють до дна перед рендером. Microtask, що ставить нову microtask, ніколи не відпустить цикл — гірше за `while(true)`, бо в профайлері не видно «довгої» функції.
>
> ```js
> const spin = () => queueMicrotask(spin);
> spin(); // 💀
> ```

> [!reel] 🖱️ Код-клік і реальний клік працюють по-різному
> При реальному кліку microtasks виконуються між listener-ами, а при `el.click()` — лише після всіх, бо стек не порожній. Тести з `click()` можуть не відтворити баг користувача.

> [!reel] ⏱️ Після 5 рівнів вкладеності setTimeout(0) = 4 мс
> HTML spec: якщо таймер вкладений глибше 5 рівнів і затримка менша за 4 мс, вона стає 4 мс. Захист від сайтів, які крутили CPU рекурсивними таймерами.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке event loop і хто його реалізує?
> *дуже часто · теорія* · `jsd-08-001`
>
> Механізм хоста, який, коли call stack порожній, бере наступну задачу з черги, виконує її, спорожнює microtasks і (у браузері) за потреби рендерить кадр. Реалізують браузер (HTML Standard) і Node (libuv), а не ECMAScript — там є лише jobs.
>
> 📚 [[JavaScript - 08. Event Loop#Хост, Web APIs і черга задач|Розділ: хост і черга задач]] · [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) · [HTML Spec: Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)

> [!question]- Чому `Promise.resolve().then(f)` виконується раніше за `setTimeout(f, 0)`?
> *дуже часто · код* · `jsd-08-002`
>
> `.then` ставить microtask, `setTimeout` — задачу. Після поточного коду цикл спершу спорожнює **всю** чергу microtasks і лише потім бере наступну задачу.
>
> ```js
> setTimeout(() => console.log('T'));
> Promise.resolve().then(() => console.log('P'));
> // → P, T
> ```
>
> 📚 [[JavaScript - 08. Event Loop#Microtasks: черга, яку спорожнюють до дна|Розділ: microtasks]] · [MDN: Using microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) · [Jake Archibald: Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

> [!question]- Чому `setTimeout(fn, 0)` не виконується одразу?
> *часто · теорія* · `jsd-08-003`
>
> Затримка — нижня межа. Після неї callback лише стає в чергу задач і чекає: кінця синхронного коду, усіх microtasks, задач попереду, можливо, рендеру. Плюс clamping (4 мс при вкладеності > 5, `1` мс у Node) і троттлінг фонових вкладок.
>
> 📚 [[JavaScript - 08. Event Loop#setTimeout: мінімальна затримка, clamping і переповнення|Розділ: setTimeout]] · [MDN: setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) · [HTML Spec: Timers](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers)

> [!question]- Що таке run-to-completion?
> *іноді · теорія* · `jsd-08-004`
>
> Гарантія, що функція, яка почала виконуватися, дійде до кінця (або до `await`/`yield`) без втручання інших callback-ів. Тому всередині синхронного блоку не треба боятися гонок даних між потоками, але довгий блок заморожує все інше.
>
> 📚 [[JavaScript - 08. Event Loop#Call stack і run-to-completion|Розділ: run-to-completion]] · [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) · [javascript.info: Event loop](https://javascript.info/event-loop)

### 🟡 Middle

> [!question]- Що належить до microtasks, а що — до задач (macrotasks)?
> *дуже часто · порівняння* · `jsd-08-005`
>
> Microtasks: реакції промісів (`then/catch/finally`, продовження `await`), `queueMicrotask`, `MutationObserver`. Задачі: `setTimeout`/`setInterval`, події вводу, мережеві й I/O callback-и, `MessageChannel`, `setImmediate` (Node). `requestAnimationFrame` — ні те, ні інше: це крок рендеру.
>
> 📚 [[JavaScript - 08. Event Loop#Microtasks: черга, яку спорожнюють до дна|Розділ: microtasks]] · [MDN: Using microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) · [javascript.info: Event loop](https://javascript.info/event-loop)

> [!question]- Чому нескінченні microtasks заморожують сторінку, а рекурсивний `setTimeout` — ні?
> *часто · теорія* · `jsd-08-006`
>
> Microtask checkpoint виконує чергу до повного спорожнення, включно з новими microtasks — до рендеру й наступної задачі справа не доходить. Кожен `setTimeout` — нова задача, а між задачами цикл встигає рендерити й обробляти ввід.
>
> 📚 [[JavaScript - 08. Event Loop#Starvation: коли microtasks «з'їдають» сторінку|Розділ: starvation]] · [MDN: Using microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) · [HTML Spec: Event loop processing model](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)

> [!question]- Де в циклі виконується `requestAnimationFrame` і навіщо він?
> *часто · теорія* · `jsd-08-007`
>
> У кроці «update the rendering», перед style, layout і paint наступного кадру. Ідеально для анімацій: зміни застосуються саме в той кадр, що буде намальований, і браузер сам ставить rAF на паузу у фонових вкладках.
>
> 📚 [[JavaScript - 08. Event Loop#Рендер: rAF, style, layout, paint|Розділ: рендер і rAF]] · [MDN: requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) · [HTML Spec: Animation frames](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames)

> [!question]- Чому кілька змін стилю в одному обробнику не дають проміжних кадрів?
> *іноді · теорія* · `jsd-08-008`
>
> Рендер відбувається лише між задачами. Поки обробник працює, браузер нічого не малює, а в кінці перераховує стилі один раз і бачить лише фінальний стан. Проміжні значення «зникають», якщо не форсувати layout читанням геометрії.
>
> 📚 [[JavaScript - 08. Event Loop#Рендер: rAF, style, layout, paint|Розділ: рендер і rAF]] · [Jake Archibald: In The Loop (відео)](https://www.youtube.com/watch?v=cCOL7MC4Pl0) · [HTML Spec: Event loop processing model](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)

### 🔴 Senior

> [!question]- Чому порядок microtasks при `el.click()` і реальному кліку різний?
> *іноді · код* · `jsd-08-009`
>
> Microtask checkpoint настає, коли JS-стек порожніє. При реальному кліку браузер викликає кожен listener окремо з порожнього стека → microtasks між listener-ами. `el.click()` синхронно викликає listener-и зсередини твого скрипта → стек не порожній, microtasks після всіх.
>
> 📚 [[JavaScript - 08. Event Loop#Microtasks: черга, яку спорожнюють до дна|Розділ: microtasks]] · [Jake Archibald: Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) · [MDN: Using microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)

> [!question]- Які фази має event loop у Node і де там `nextTick`?
> *часто · теорія* · `jsd-08-010`
>
> timers → pending callbacks → poll (I/O) → check (`setImmediate`) → close callbacks. `process.nextTick` не фаза: його черга спорожнюється після кожного callback-а, раніше за промісні microtasks (у CommonJS). Тому всередині I/O-callback-а `setImmediate` завжди раніше за `setTimeout(0)`.
>
> 📚 [[JavaScript - 08. Event Loop#Node.js: фази, process.nextTick і setImmediate|Розділ: event loop у Node.js]] · [Node.js: The Event Loop, Timers, and process.nextTick()](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick) · [libuv: Design overview](https://docs.libuv.org/en/v1.x/design.html)

> [!question]- Чому за HTML spec «черга макрозадач» — це спрощення?
> *рідко · теорія* · `jsd-08-011`
>
> Task queues кілька — за джерелами (таймери, ввід, мережа, postMessage…). Браузер на кожному оберті сам обирає, з якої черги брати задачу, і може пріоритизувати ввід користувача. FIFO гарантований лише всередині однієї черги. Черга microtasks — одна.
>
> 📚 [[JavaScript - 08. Event Loop#Хост, Web APIs і черга задач|Розділ: черги задач]] · [HTML Spec: Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops) · [Jake Archibald: In The Loop (відео)](https://www.youtube.com/watch?v=cCOL7MC4Pl0)

## 🛠️ Практика

> [!task] Поясни своїми словами: чому `then` обганяє `setTimeout(0)`
> level: junior · difficulty: easy · id: jsd-08-task-01 · tags: feynman, event-loop
>
> Поясни другові, який знає лише синхронний JS, чому цей код виводить `sync, then, timeout`. Використай не більше 5 речень і хоча б одну аналогію. Не вживай слова «магія».
>
> ```js
> setTimeout(() => console.log('timeout'), 0);
> Promise.resolve().then(() => console.log('then'));
> console.log('sync');
> ```
>
> > [!hint]- Підказка 1
> > Почни з того, хто «тримає» callback-и, поки виконується синхронний код.
>
> > [!hint]- Підказка 2
> > Дві черги — дві різні «стійки» з різним пріоритетом.
>
> > [!solution]- Еталонне пояснення
> > JS має одного виконавця, який завжди доробляє поточну справу до кінця — тому першим іде `sync`. Обидва callback-и в цей час лежать у чергах: `setTimeout` — у звичайній черзі задач, `then` — у черзі microtasks («доробити одразу»). Коли синхронний код скінчився, цикл спершу розбирає **всі** microtasks — так кухар додає соус до готової страви, перш ніж узяти нове замовлення. Лише потім він бере наступну задачу — таймер. Тож `then` обганяє `timeout`, навіть якщо затримка 0.

> [!task] Обробка великого масиву без фризів
> level: middle · difficulty: medium · id: jsd-08-task-02 · tags: event-loop, performance
>
> Напиши `processInChunks(items, fn, budgetMs = 10)`, яка викликає `fn` для кожного елемента, але не тримає стек довше за `budgetMs` поспіль: після вичерпання бюджету віддає керування циклу й продовжує в наступній задачі. Функція повертає `Promise`, що резолвиться після обробки всіх елементів.
>
> ```js starter
> async function processInChunks(items, fn, budgetMs = 10) {
>   // твій код
> }
> ```
>
> ```js tests
> test('обробляє всі елементи по порядку й передає індекс', async () => {
>   const seen = []
>   await processInChunks(['a', 'b', 'c'], (x, i) => seen.push(x + i))
>   expect(seen).toEqual(['a0', 'b1', 'c2'])
> })
>
> test('порожній масив — проміс резолвиться, fn не викликається', async () => {
>   const fn = vi.fn()
>   await processInChunks([], fn)
>   expect(fn).not.toHaveBeenCalled()
> })
>
> test('коли бюджет вичерпано, решта чекає наступної задачі, а не мікрозадачі', async () => {
>   vi.useFakeTimers()
>   const seen = []
>   const done = processInChunks([1, 2, 3, 4, 5], (x) => {
>     seen.push(x)
>     vi.setSystemTime(Date.now() + 6) // кожен елемент «працює» 6 мс
>   }, 10)
>   expect(seen).toEqual([1, 2])
>   await Promise.resolve()
>   await Promise.resolve()
>   expect(seen).toEqual([1, 2])
>   vi.advanceTimersByTime(0)
>   await sleep(0)
>   expect(seen).toEqual([1, 2, 3, 4])
>   vi.advanceTimersByTime(0)
>   await sleep(0)
>   await done
>   expect(seen).toEqual([1, 2, 3, 4, 5])
> })
>
> test('не віддає керування, поки бюджет не вичерпано', async () => {
>   vi.useFakeTimers()
>   const fn = vi.fn()
>   const done = processInChunks([1, 2, 3], fn, 10)
>   expect(fn).toHaveBeenCalledTimes(3)
>   expect(vi.getTimerCount()).toBe(0)
>   await done
> })
> ```
>
> > [!hint]- Підказка 1
> > Для «віддати керування» підійде `new Promise((r) => setTimeout(r, 0))`. Чому не `queueMicrotask`?
>
> > [!hint]- Підказка 2
> > Засікай `performance.now()` на початку кожного шматка й перевіряй бюджет після кожного елемента.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const yieldToLoop = () => new Promise((resolve) => setTimeout(resolve, 0));
> >
> > async function processInChunks(items, fn, budgetMs = 10) {
> >   let start = performance.now();
> >   for (let i = 0; i < items.length; i++) {
> >     fn(items[i], i);
> >     if (performance.now() - start > budgetMs) {
> >       await yieldToLoop(); // нова задача → між ними є рендер і ввід
> >       start = performance.now();
> >     }
> >   }
> > }
> >
> > // processInChunks(rows, renderRow).then(() => console.log('готово'));
> > ```
> >
> > `queueMicrotask` не підходить: microtasks виконуються до рендеру, тож браузер так і не отримав би шансу намалювати кадр. У Chromium замість `setTimeout` можна `scheduler.yield()` — він повертає керування, але продовження має вищий пріоритет за інші задачі.

> [!task] Батчер оновлень у стилі `nextTick`
> level: senior · difficulty: hard · id: jsd-08-task-03 · tags: event-loop, microtasks
>
> Реалізуй `createBatcher(flush)`. Метод `schedule(key)` можна викликати багато разів синхронно; `flush` має викликатися **один раз** у microtask з `Set` унікальних ключів. Метод `nextTick()` повертає проміс, який резолвиться **після** найближчого `flush`.
>
> ```js
> const b = createBatcher((keys) => console.log('flush', [...keys]));
> b.schedule('a'); b.schedule('b'); b.schedule('a');
> b.nextTick().then(() => console.log('after'));
> console.log('sync');
> // → sync
> // → flush [ 'a', 'b' ]
> // → after
> ```
>
> ```js starter
> function createBatcher(flush) {
>   // твій код
>   return {
>     schedule(key) {},
>     nextTick() {},
>   }
> }
> ```
>
> ```js tests
> test('flush не викликається синхронно', () => {
>   const flush = vi.fn()
>   const b = createBatcher(flush)
>   b.schedule('a')
>   expect(flush).not.toHaveBeenCalled()
> })
>
> test('один flush у мікрозадачі з унікальними ключами', async () => {
>   const flush = vi.fn()
>   const b = createBatcher(flush)
>   b.schedule('a'); b.schedule('b'); b.schedule('a')
>   await Promise.resolve()
>   expect(flush).toHaveBeenCalledTimes(1)
>   expect(flush).toHaveBeenCalledWith(new Set(['a', 'b']))
> })
>
> test('flush іде раніше за setTimeout(0)', async () => {
>   const log = []
>   const b = createBatcher(() => log.push('flush'))
>   setTimeout(() => log.push('timeout'), 0)
>   b.schedule('x')
>   await sleep(10)
>   expect(log).toEqual(['flush', 'timeout'])
> })
>
> test('nextTick резолвиться після flush', async () => {
>   const log = []
>   const b = createBatcher((keys) => log.push('flush:' + [...keys].join()))
>   b.schedule('a')
>   const p = b.nextTick().then(() => log.push('after'))
>   log.push('sync')
>   await p
>   expect(log).toEqual(['sync', 'flush:a', 'after'])
> })
>
> test('schedule всередині flush і після нього планує новий батч', async () => {
>   const batches = []
>   let b
>   b = createBatcher((keys) => {
>     batches.push([...keys])
>     if (keys.has('a')) b.schedule('from-flush')
>   })
>   b.schedule('a')
>   await b.nextTick()
>   await sleep(0)
>   b.schedule('c')
>   await b.nextTick()
>   expect(batches).toEqual([['a'], ['from-flush'], ['c']])
> })
> ```
>
> > [!hint]- Підказка 1
> > Прапорець «flush уже заплановано» + `queueMicrotask`.
>
> > [!hint]- Підказка 2
> > Зберігай один проміс на поточний батч і резолви його після виклику `flush`.
>
> > [!hint]- Підказка 3
> > Перед викликом `flush` скинь стан, щоб `schedule` всередині `flush` запланував новий батч, а не загубився.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createBatcher(flush) {
> >   let pending = new Set();
> >   let promise = null;
> >   let resolve = null;
> >
> >   function ensureScheduled() {
> >     if (promise) return promise;
> >     promise = new Promise((r) => (resolve = r));
> >     queueMicrotask(() => {
> >       const keys = pending;
> >       const done = resolve;
> >       pending = new Set();
> >       promise = resolve = null; // новий schedule → новий батч
> >       try {
> >         flush(keys);
> >       } finally {
> >         done();
> >       }
> >     });
> >     return promise;
> >   }
> >
> >   return {
> >     schedule(key) { pending.add(key); ensureScheduled(); },
> >     nextTick() { return ensureScheduled(); },
> >   };
> > }
> > ```
> >
> > `after` виводиться після `flush`, бо `then` підписується на проміс, який резолвиться всередині microtask батчу, — його реакція стає в чергу вже після `flush`. Так влаштовані `nextTick` у Vue і батчинг у багатьох реактивних бібліотеках.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Event loop](https://javascript.info/event-loop) — макро- і мікрозадачі з практичними прикладами.
- 🟡 [MDN — Using microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) — коли ставити microtask і чим `queueMicrotask` кращий за хаки.
- 🟡 [Jake Archibald — Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) — класична стаття з покроковою анімацією черг.
- 🟡 [Node.js — The Event Loop, Timers, and process.nextTick()](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick) — фази libuv, `setImmediate` і `process.nextTick`.
- 🔴 [HTML Standard — Event loop processing model](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model) — першоджерело: крок за кроком один оберт циклу.
- 🔴 [HTML Standard — Timers](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers) — clamping, вкладеність і точність таймерів.
- 🎥 [Jake Archibald — In The Loop (відео)](https://www.youtube.com/watch?v=cCOL7MC4Pl0) — доповідь про задачі, мікрозадачі і rAF у кадрі.
- 🎥 [Philip Roberts — What the heck is the event loop anyway? (відео)](https://www.youtube.com/watch?v=8aGhZQkoFbQ) — найпопулярніше відеопояснення event loop.
- 🛠️ [web.dev — Optimize long tasks](https://web.dev/articles/optimize-long-tasks) — як розбивати довгі задачі й віддавати керування браузеру.

> [!important] Підсумок
> - Один потік, один стек, run-to-completion: callback стартує лише на порожньому стеку.
> - Цикл: одна задача → **усі** microtasks → (можливо) рендер → далі. Звідси `then` раніше за `setTimeout(0)`.
> - Рендер (rAF → style → layout → paint) відбувається лише між задачами; довгий код = пропущені кадри, нескінченні microtasks = заморожена вкладка.
> - Затримка таймера — нижня межа: clamping 4 мс, троттлінг фону, переповнення після 2³¹−1 мс.
> - Node: фази libuv, `nextTick` раніше за проміси (CJS), `setImmediate` після I/O завжди раніше за `setTimeout(0)`.
