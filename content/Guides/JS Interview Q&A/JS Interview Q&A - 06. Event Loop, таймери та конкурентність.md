---
title: Event Loop, таймери та конкурентність
order: 6
tags: [event-loop, microtasks, timers, workers, performance]
estimatedMinutes: 75
---

# JS Interview Q&A — 06. Event Loop, таймери та конкурентність

## 🟢 Junior

> [!question]- Що таке event loop і навіщо він потрібен у JavaScript?
> *дуже часто · теорія* · `js-06-001`
>
> JavaScript-код виконується в одному потоці з одним call stack. **Event loop** — механізм середовища (браузера чи Node.js), який, коли стек порожній, бере наступну задачу з черги і запускає її. Таймери, мережа, файли працюють поза JS-потоком (Web APIs, libuv), а в чергу потрапляють лише їхні callback-и.
>
> Одна ітерація спрощено: виконати одну задачу до кінця → виконати всі microtasks → (у браузері) за потреби відрендерити кадр → повторити. Принцип **run-to-completion**: функцію не може перервати інший callback посередині.
>
> ```js
> console.log('start');
> setTimeout(() => console.log('timeout'), 0);
> console.log('end');
> // start, end, timeout
> ```
>
> **На співбесіді:** event loop не описаний в ECMAScript — там є лише jobs. Цикл визначає HTML spec для браузерів і libuv для Node, тому деталі в них різні.
>
> 📚 [[JavaScript - 08. Event Loop#Хост, Web APIs і черга задач|Розділ: хост і черга задач]] · [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) · [javascript.info: Event loop](https://javascript.info/event-loop)

> [!question]- Що таке call stack і коли виникає stack overflow?
> *часто · теорія* · `js-06-002`
>
> **Call stack** — стек контекстів виконання: кожен виклик функції додає frame, повернення — знімає його (LIFO). Поки стек не порожній, event loop не може запустити жодну іншу задачу.
>
> Stack overflow виникає, коли вкладених викликів забагато, найчастіше через рекурсію без базового випадку. Ліміт залежить від рушія й розміру frame (у V8 — порядку кількох тисяч або десятків тисяч викликів).
>
> ```js
> function depth(n) {
>   return depth(n + 1);
> }
>
> try {
>   depth(0);
> } catch (e) {
>   console.log(e instanceof RangeError); // true: Maximum call stack size exceeded
> }
> ```
>
> **На співбесіді:** tail call optimization є в стандарті ES2015, але реалізована лише в Safari (JavaScriptCore). У V8 і SpiderMonkey глибоку рекурсію треба переписувати на цикл або явний стек.
>
> 📚 [[JavaScript - 01. Як JS виконує код#🥞 Call stack|Розділ: call stack]] · [MDN: Call stack](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack) · [javascript.info: Recursion and stack](https://javascript.info/recursion)

> [!question]- Чим macrotask відрізняється від microtask?
> *дуже часто · порівняння* · `js-06-003`
>
> Це дві різні черги з різним пріоритетом. Після кожної **задачі** (macrotask) event loop повністю спорожнює чергу **microtasks** — включно з тими, що додалися під час цього спорожнення — і лише потім переходить до рендеру чи наступної задачі.
>
> - Macrotasks: `setTimeout`, `setInterval`, I/O, події користувача, `MessageChannel`, `setImmediate` (Node).
> - Microtasks: реакції промісів (`.then`, продовження після `await`), `queueMicrotask`, `MutationObserver`.
>
> ```js
> setTimeout(() => console.log('macro'), 0);
> queueMicrotask(() => console.log('micro'));
> // micro, macro
> ```
>
> **На співбесіді:** за специфікацією HTML немає "черги макрозадач" в однині — є кілька task queues за джерелами, і браузер може обирати між ними, наприклад, віддаючи пріоритет вводу користувача. Черга microtasks одна.
>
> 📚 [[JavaScript - 08. Event Loop#Microtasks: черга, яку спорожнюють до дна|Розділ: microtasks]] · [MDN: Using microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) · [Jake Archibald: Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

> [!question]- У якому порядку виконаються синхронний код, `Promise.then` і `setTimeout`?
> *дуже часто · код* · `js-06-004`
>
> Спершу весь синхронний код, потім усі microtasks, потім наступна macrotask.
>
> ```js
> console.log(1);
> setTimeout(() => console.log(2), 0);
> Promise.resolve().then(() => console.log(3));
> console.log(4);
> // 1, 4, 3, 2
> ```
>
> `1` і `4` — синхронні. `setTimeout` лише реєструє таймер, callback піде в чергу задач. `.then` на вже виконаному промісі одразу ставить callback у чергу microtasks. Коли скрипт завершився і стек порожній, спорожнюється черга microtasks (`3`), і лише потім event loop бере задачу з таймером (`2`).
>
> **На співбесіді:** executor `new Promise(fn)` виконується синхронно — `console.log` усередині нього буде серед синхронних рядків, а не серед microtasks.
>
> 📚 [[JavaScript - 08. Event Loop#Microtasks: черга, яку спорожнюють до дна|Розділ: microtasks]] · [javascript.info: Microtasks](https://javascript.info/microtask-queue) · [Jake Archibald: Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

> [!question]- Чому `setTimeout(fn, 0)` не виконується одразу?
> *часто · теорія* · `js-06-005`
>
> Затримка в `setTimeout` — мінімальна, а не гарантована. Після її закінчення callback лише потрапляє в чергу задач і чекає, доки:
> - завершиться поточний синхронний код;
> - спорожниться черга microtasks;
> - виконаються задачі, що вже стоять попереду, і, можливо, рендер.
>
> До того ж є мінімальні затримки: у Node `0` перетворюється на `1` мс, а браузери після 5 рівнів вкладених таймерів підвищують затримку до 4 мс.
>
> ```js
> const start = performance.now();
> setTimeout(() => {
>   console.log(Math.round(performance.now() - start)); // ≈ 100, а не 0
> }, 0);
> while (performance.now() - start < 100) {}
> ```
>
> **На співбесіді:** `setTimeout(fn, 0)` — спосіб "відкласти на наступну задачу", а не "виконати швидко".
>
> 📚 [[JavaScript - 08. Event Loop#setTimeout: мінімальна затримка, clamping і переповнення|Розділ: setTimeout]] · [MDN: setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) · [HTML Spec: Timers](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers)

> [!question]- Чим `setInterval` відрізняється від рекурсивного `setTimeout`?
> *часто · порівняння* · `js-06-006`
>
> `setInterval` планує запуски від часу старту, не зважаючи на тривалість callback-а. Якщо робота асинхронна (наприклад, `fetch`), наступний запуск може стартувати, поки попередній ще триває, і запити перекриваються. Рекурсивний `setTimeout` планує наступний запуск лише **після завершення** поточного, тож пауза між ними гарантована.
>
> ```js
> let timer;
>
> async function poll() {
>   try {
>     await refreshData();
>   } finally {
>     timer = setTimeout(poll, 5000);
>   }
> }
>
> poll();
> // зупинка: clearTimeout(timer)
> ```
>
> Бонуси рекурсивного варіанту: можна змінювати затримку на льоту (backoff при помилках), легко зупинитися за умовою.
>
> **На співбесіді:** обидва способи "дрейфують" відносно реального часу. Якщо потрібна точність (годинник, метроном), наступну затримку обчислюють від очікуваного моменту, а не від фактичного.
>
> 📚 [[JavaScript - 08. Event Loop#setTimeout: мінімальна затримка, clamping і переповнення|Розділ: таймери]] · [MDN: setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval) · [javascript.info: setTimeout and setInterval](https://javascript.info/settimeout-setinterval)

## 🟡 Middle

> [!question]- Що робить `queueMicrotask` і коли його варто використовувати?
> *іноді · код* · `js-06-007`
>
> `queueMicrotask(fn)` ставить callback у чергу microtasks напряму, без створення промісу. Він виконається після поточного синхронного коду, але до будь-якої наступної задачі й рендеру. Виняток у ньому репортиться як звичайний uncaught exception, а не як unhandled rejection.
>
> Типове застосування — **батчинг**: зібрати кілька синхронних змін і обробити їх один раз.
>
> ```js
> const changes = [];
> let scheduled = false;
>
> function notify(change) {
>   changes.push(change);
>   if (scheduled) return;
>   scheduled = true;
>   queueMicrotask(() => {
>     scheduled = false;
>     flush(changes.splice(0));
>   });
> }
> ```
>
> Checkpoint microtasks буває не лише після задачі, а щоразу, коли JS-стек спорожнів після callback-а. Тому при реальному кліку microtasks виконуються **між** двома click-listener-ами, а при `el.click()` із коду — лише після обох, бо стек не порожній.
>
> **На співбесіді:** microtasks блокують рендер. Рекурсивний `queueMicrotask` заморозить сторінку так само, як `while (true)`.
>
> 📚 [[JavaScript - 08. Event Loop#Microtasks: черга, яку спорожнюють до дна|Розділ: microtasks]] · [MDN: queueMicrotask()](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask) · [MDN: Using microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)

> [!question]- Де `requestAnimationFrame` знаходиться в event loop і чому він кращий за `setTimeout` для анімацій?
> *часто · теорія* · `js-06-008`
>
> Callback-и `requestAnimationFrame` виконуються на кроці **update the rendering** — після задачі й microtasks, безпосередньо перед обчисленням стилів, layout і paint. Браузер викликає їх раз на кадр, синхронно з частотою дисплея (60, 120 Гц), і призупиняє у фонових вкладках.
>
> `setTimeout(fn, 16)` не синхронізований із кадрами: частина кадрів отримує два оновлення, частина — жодного, що дає ривки. Крім того, таймер спрацьовує в прихованій вкладці і марно витрачає CPU.
>
> ```js
> function slide(el, duration) {
>   const start = performance.now();
>   function frame(now) {
>     const t = Math.min((now - start) / duration, 1);
>     el.style.transform = `translateX(${t * 300}px)`;
>     if (t < 1) requestAnimationFrame(frame);
>   }
>   requestAnimationFrame(frame);
> }
> ```
>
> Прогрес рахують від часу, а не кількості кадрів — інакше на 120 Гц анімація пройде вдвічі швидше.
>
> **На співбесіді:** rAF, запланований усередині rAF-callback-а, виконається вже в наступному кадрі. Порядок між `setTimeout(0)` і rAF не детермінований.
>
> 📚 [[JavaScript - 08. Event Loop#Рендер: rAF, style, layout, paint|Розділ: рендер і rAF]] · [MDN: requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) · [HTML Spec: Animation frames](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames)

> [!question]- Як кроки рендерингу в браузері пов'язані з event loop?
> *часто · теорія* · `js-06-009`
>
> Рендер — частина ітерації event loop, а не окремий паралельний процес. За HTML spec спрощено:
> 1. Взяти одну задачу з черги й виконати.
> 2. Microtask checkpoint.
> 3. Якщо є **rendering opportunity** (зазвичай раз на кадр): події `resize` і `scroll`, media queries, CSS-анімації, callback-и `requestAnimationFrame`, style і layout, `ResizeObserver`, `IntersectionObserver`, paint.
> 4. Якщо час лишився — `requestIdleCallback`.
>
> Наслідки:
> - зміни DOM протягом однієї задачі користувач не бачить до її завершення;
> - довга задача або нескінченні microtasks блокують кадри;
> - читання `offsetHeight` чи `getBoundingClientRect()` після запису стилів змушує зробити layout синхронно, всередині задачі (forced reflow, а в циклі — layout thrashing).
>
> ```js
> box.style.display = 'block';
> box.style.display = 'none';
> // блимання не буде: до рендеру дійде лише фінальний стан
> ```
>
> **На співбесіді:** браузер може пропускати rendering opportunity (прихована вкладка, немає змін), тому "кожна задача = кадр" — хибне уявлення.
>
> 📚 [[JavaScript - 08. Event Loop#Рендер: rAF, style, layout, paint|Розділ: рендер і rAF]] · [HTML Spec: Event loop processing model](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model) · [Jake Archibald: In The Loop (відео)](https://www.youtube.com/watch?v=cCOL7MC4Pl0)

> [!question]- Які фази має event loop у Node.js?
> *часто · теорія* · `js-06-010`
>
> Event loop у Node реалізований у **libuv** і проходить фази, кожна зі своєю чергою callback-ів:
> - **timers** — прострочені `setTimeout`/`setInterval`;
> - **pending callbacks** — відкладені системні I/O callback-и (наприклад, деякі помилки TCP);
> - **idle, prepare** — внутрішні;
> - **poll** — отримання нових I/O-подій і виконання їхніх callback-ів; тут цикл блокується в очікуванні, якщо більше нічого робити;
> - **check** — `setImmediate`;
> - **close callbacks** — події `close`, наприклад `socket.on('close')`.
>
> Між кожними двома callback-ами (з Node 11) спорожнюються черга `process.nextTick`, а потім microtasks промісів. Процес завершується, коли не лишилося активних handle-ів — таймерів, сокетів тощо (`unref()` дозволяє не тримати процес).
>
> ```js
> const timer = setInterval(collectMetrics, 10_000);
> timer.unref(); // не заважає процесу завершитися
> ```
>
> **На співбесіді:** з libuv 1.45 (Node 20) timers виконуються після фази poll, а не перед нею (один запуск лишився перед входом у цикл). Документація Node тепер показує timers в кінці списку — корисно знати, якщо питають про "класичну" схему.
>
> 📚 [[JavaScript - 08. Event Loop#Node.js: фази, process.nextTick і setImmediate|Розділ: event loop у Node.js]] · [Node.js: The Event Loop, Timers, and process.nextTick()](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick) · [libuv: Design overview](https://docs.libuv.org/en/v1.x/design.html)

> [!question]- Чим `process.nextTick` відрізняється від microtask промісу?
> *часто · порівняння* · `js-06-011`
>
> `process.nextTick` — окрема черга Node, яка обробляється **перед** чергою microtasks промісів щоразу, коли керування повертається з C++ у JS. Тому в CommonJS nextTick виконується першим:
>
> ```js
> // main.cjs
> Promise.resolve().then(() => console.log('promise'));
> process.nextTick(() => console.log('nextTick'));
> // nextTick, promise
> ```
>
> Але в ES-модулі (`.mjs`) той самий код виведе `promise`, `nextTick`: ESM-модуль виконується асинхронно, і черга microtasks спорожнюється раніше, ніж Node дійде до nextTick-черги.
>
> Ризики nextTick: рекурсивні виклики голодують I/O так само, як нескінченні microtasks. Документація Node рекомендує `queueMicrotask` для більшості випадків; `nextTick` доречний, щоб викликати callback асинхронно, але до будь-якого I/O — наприклад, згенерувати `'error'` після того, як користувач встиг підписатися.
>
> **На співбесіді:** назви історично переплутані — `nextTick` спрацьовує раніше, ніж `setImmediate`, хоча "immediate" звучить швидше.
>
> 📚 [[JavaScript - 08. Event Loop#Node.js: фази, process.nextTick і setImmediate|Розділ: event loop у Node.js]] · [Node.js: Understanding process.nextTick()](https://nodejs.org/learn/asynchronous-work/understanding-processnexttick) · [Node.js: The Event Loop, Timers, and process.nextTick()](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick)

> [!question]- Що спрацює першим у Node.js: `setImmediate` чи `setTimeout(fn, 0)`?
> *часто · порівняння* · `js-06-012`
>
> Залежить від контексту:
> - **з головного модуля** порядок не гарантований: `setTimeout(0)` — це 1 мс, і все залежить від того, чи минула ця мілісекунда до перевірки таймерів;
> - **з I/O callback-а** `setImmediate` завжди першим: після фази poll іде check, а таймери — вже пізніше.
>
> ```js
> const fs = require('node:fs');
>
> fs.readFile(__filename, () => {
>   setTimeout(() => console.log('timeout'), 0);
>   setImmediate(() => console.log('immediate'));
> });
> // immediate, timeout — завжди
> ```
>
> `setImmediate` — правильний спосіб "поступитися" event loop після I/O: він не має мінімальної затримки таймера і дає пройти іншим I/O-подіям. Рекурсивний `setImmediate`, на відміну від рекурсивного `nextTick`, не голодує I/O — нові immediate-и виконаються вже в наступній ітерації.
>
> **На співбесіді:** якщо тести залежать від порядку `setTimeout(0)` і `setImmediate` на верхньому рівні — це flaky test.
>
> 📚 [[JavaScript - 08. Event Loop#Node.js: фази, process.nextTick і setImmediate|Розділ: event loop у Node.js]] · [Node.js: Understanding setImmediate()](https://nodejs.org/learn/asynchronous-work/understanding-setimmediate) · [Node.js: The Event Loop, Timers, and process.nextTick()](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick)

> [!question]- Як `await` впливає на порядок виконання і що виведе цей код?
> *дуже часто · код* · `js-06-013`
>
> Код async-функції до першого `await` виконується синхронно. Решта функції після `await` стає microtask і виконується, коли очікуваний проміс settled.
>
> ```js
> async function a() {
>   console.log('a1');
>   await b();
>   console.log('a2');
> }
> async function b() {
>   console.log('b');
> }
>
> console.log('s');
> setTimeout(() => console.log('t'), 0);
> a();
> Promise.resolve().then(() => console.log('p1')).then(() => console.log('p2'));
> console.log('e');
> // s, a1, b, e, a2, p1, p2, t
> ```
>
> Синхронно: `s`, потім `a1` і `b` (тіло `b` синхронне), `e`. `b()` повертає вже виконаний нативний проміс, тож `await` коштує один тік — продовження `a2` стає в чергу раніше за `p1`. `p2` додається лише після виконання `p1`. Таймер — остання, бо це macrotask.
>
> **На співбесіді:** якби `b` повертала `Promise.resolve()` через `return`, `a2` зсунулося б на два тіки й виводилося б після `p2`. Такі деталі — аргумент не будувати логіку на порядку microtasks.
>
> 📚 [[JavaScript - 10. async і await#await: пауза + продовження як microtask|Розділ: await під капотом]] · [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) · [V8: Faster async functions and promises](https://v8.dev/blog/fast-async)

> [!question]- Які обмеження й пастки мають таймери: clamping, throttling, переповнення затримки?
> *іноді · теорія* · `js-06-014`
>
> - **Clamping:** за HTML spec після 5 рівнів вкладеності таймерів затримка менша за 4 мс підвищується до 4 мс. Тому `setTimeout(0)` у ланцюжку — повільний спосіб поступатися.
> - **Throttling у фоні:** у прихованих вкладках таймери спрацьовують не частіше ніж раз на секунду; Chrome після 5 хвилин у фоні для ланцюжків таймерів обмежує до разу на хвилину (intensive throttling).
> - **Переповнення:** затримка зберігається як 32-бітне знакове ціле. Понад `2 ** 31 - 1` мс (≈ 24,8 доби) у браузері таймер спрацює майже одразу, а Node встановить 1 мс і видасть `TimeoutOverflowWarning`.
> - **Тип значення:** у браузері `setTimeout` повертає число, у Node — об'єкт `Timeout` (у TS використовуйте `ReturnType<typeof setTimeout>`).
>
> ```js
> const DAY = 24 * 60 * 60 * 1000;
> setTimeout(sendReminder, 30 * DAY); // спрацює майже одразу, а не через 30 днів
> ```
>
> **На співбесіді:** довгі відкладені дії (нагадування, експірація) не мають жити в `setTimeout` — вони губляться при рестарті процесу. Для цього потрібні черга з відкладеними задачами або cron.
>
> 📚 [[JavaScript - 08. Event Loop#setTimeout: мінімальна затримка, clamping і переповнення|Розділ: setTimeout]] · [MDN: setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) · [HTML Spec: Timers](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers)

## 🔴 Senior

> [!question]- Що таке long task і як розбити важку роботу, щоб не блокувати main thread?
> *часто · практика* · `js-06-015`
>
> **Long task** — задача довша за 50 мс. Поки вона виконується, браузер не обробляє ввід і не рендерить, що прямо погіршує **INP** (Core Web Vital з 2024). Рішення — розбити роботу на шматки і між ними поступатися main thread.
>
> Способи поступитися:
> - `scheduler.yield()` (Chromium 129+) — продовження отримує пріоритет над іншими задачами, тож робота не "губиться" в кінці черги;
> - `setTimeout(0)` — працює всюди, але продовження стає в кінець черги, а після вкладеності діє clamp 4 мс;
> - `MessageChannel` — задача без clamp;
> - `requestIdleCallback` — для некритичної роботи (аналітика, префетч); у Safari потрібен fallback.
>
> ```js
> const yieldToMain = () =>
>   globalThis.scheduler?.yield
>     ? scheduler.yield()
>     : new Promise(resolve => setTimeout(resolve, 0));
>
> async function processAll(items, handle) {
>   let deadline = performance.now() + 10;
>   for (const item of items) {
>     handle(item);
>     if (performance.now() >= deadline) {
>       await yieldToMain();
>       deadline = performance.now() + 10;
>     }
>   }
> }
> ```
>
> Поступатися варто за бюджетом часу, а не після кожного елемента — інакше накладні витрати з'їдять виграш.
>
> **На співбесіді:** chunking збільшує загальний час роботи, але робить сторінку чуйною. Якщо сумарна робота секунди, а не сотні мілісекунд — це вже кандидат у Web Worker.
>
> 📚 [[JavaScript - 08. Event Loop#🎤 На співбесіді|Розділ: як не заморозити UI]] · [web.dev: Optimize long tasks](https://web.dev/articles/optimize-long-tasks) · [MDN: Scheduler.yield()](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield)

> [!question]- Як microtasks можуть "заголодити" event loop?
> *іноді · код* · `js-06-016`
>
> Черга microtasks спорожнюється повністю, включно з новими microtasks, доданими під час спорожнення. Якщо кожна microtask планує наступну, event loop ніколи не дійде до задач: таймери не спрацюють, ввід не обробиться, кадр не відрендериться. Це **starvation** — зависання без явного `while (true)`.
>
> ```js
> let running = true;
> setTimeout(() => { running = false; }, 100);
>
> async function spin() {
>   while (running) {
>     await null; // кожен await — лише microtask
>   }
> }
>
> spin(); // зависає назавжди: таймер ніколи не отримає шансу
> ```
>
> `await` не означає "поступитися event loop" — він поступається лише іншим microtasks. У Node те саме робить рекурсивний `process.nextTick`: він блокує навіть проміси.
>
> Виправлення — поступатися через macrotask: `setTimeout`, `setImmediate` у Node, `scheduler.yield()` у браузері. Та сама пастка трапляється непомітно: async-цикл обробки черги, де `await` чекає на кеш, що повертає вже виконаний проміс, або рекурсивна обробка подій через `.then`.
>
> **На співбесіді:** у профілювальнику така проблема виглядає як одна дуже довга задача з тисячами коротких викликів — підказка шукати рекурсивний async-цикл або кеш, що повертає вже виконані проміси.
>
> 📚 [[JavaScript - 08. Event Loop#Starvation: коли microtasks «з'їдають» сторінку|Розділ: starvation]] · [MDN: Using microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) · [HTML Spec: Event loop processing model](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)

> [!question]- Як працюють Web Workers і коли їх варто використовувати?
> *часто · практика* · `js-06-017`
>
> Web Worker — окремий потік зі своїм event loop і глобальним об'єктом, без доступу до DOM. Спілкування — лише через `postMessage`:
> - дані копіюються через **structured clone** (підтримує `Map`, `Set`, `Date`, `ArrayBuffer`, `Blob`, помилки; не підтримує функції, DOM-вузли, прототипи класів — вони губляться);
> - **transferable**-об'єкти (`ArrayBuffer`, `MessagePort`, `OffscreenCanvas`, `ImageBitmap`) передаються без копіювання — володіння переходить до іншого потоку.
>
> ```js
> // main.js
> const worker = new Worker(new URL('./sum.worker.js', import.meta.url), { type: 'module' });
> const buffer = new Float64Array(1_000_000).fill(1).buffer;
> worker.postMessage(buffer, [buffer]); // після transfer buffer.byteLength === 0
> worker.onmessage = (event) => console.log(event.data); // 1000000
>
> // sum.worker.js
> self.onmessage = (event) => {
>   const data = new Float64Array(event.data);
>   self.postMessage(data.reduce((acc, x) => acc + x, 0));
> };
> ```
>
> Варто: парсинг великих файлів, обробка зображень, пошукові індекси, криптографія, diff — усе, що займає сотні мілісекунд CPU. Не варто: дрібні часті задачі, бо старт воркера і серіалізація коштують більше, ніж економія. Structured clone великого об'єкта сам по собі виконується синхронно на main thread, тож "винести в воркер" гігантський JSON-граф іноді повільніше, ніж обробити його на місці.
>
> **На співбесіді:** згадайте Comlink для RPC-стилю поверх `postMessage` і те, що в Node аналогом є `worker_threads` з майже тим самим API.
>
> 📚 [[JavaScript - 29. Workers і паралельність|Розділ: workers і паралельність]] · [MDN: Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) · [HTML Spec: Web workers](https://html.spec.whatwg.org/multipage/workers.html#workers)

> [!question]- Навіщо потрібні `SharedArrayBuffer` і `Atomics`?
> *рідко · теорія* · `js-06-018`
>
> `SharedArrayBuffer` — пам'ять, спільна для кількох потоків: `postMessage` передає посилання, а не копію. Звичайні читання/записи в неї з різних потоків дають **data race**, тому існує `Atomics`: атомарні `load`, `store`, `add`, `compareExchange` із послідовно-узгодженим порядком, а також `wait`/`notify` для блокування потоку до зміни значення (аналог futex).
>
> ```js
> // main.js
> const shared = new Int32Array(new SharedArrayBuffer(4));
> worker.postMessage(shared);
>
> // worker.js
> self.onmessage = ({ data: shared }) => {
>   Atomics.add(shared, 0, 1);
>   Atomics.notify(shared, 0);
> };
>
> // інший worker чекає на зміну
> Atomics.wait(shared, 0, 0); // спить, поки значення дорівнює 0
> ```
>
> Обмеження:
> - у браузері SAB доступний лише в **cross-origin isolated** контексті: заголовки `Cross-Origin-Opener-Policy: same-origin` і `Cross-Origin-Embedder-Policy: require-corp` (або `credentialless`), перевірка — `crossOriginIsolated`. Причина — Spectre-атаки через точні таймери;
> - `Atomics.wait` на main thread у браузері кидає `TypeError`; там використовують `Atomics.waitAsync` (ES2024);
> - у Node обмежень на SAB немає.
>
> **На співбесіді:** основні користувачі — WASM з потоками, аудіо ring buffer-и, emscripten. У звичайному застосунку повідомлення простіші й безпечніші, а спільна пам'ять виправдана, коли копіювання стає вузьким місцем.
>
> 📚 [[JavaScript - 29. Workers і паралельність|Розділ: workers і паралельність]] · [MDN: SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) · [MDN: Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)

> [!question]- Що таке libuv thread pool і як він може стати вузьким місцем у Node.js?
> *іноді · теорія* · `js-06-019`
>
> Мережевий I/O у Node неблокуючий на рівні ОС (epoll, kqueue, IOCP) і не займає потоків. Але частина операцій не має асинхронного API в ОС або є CPU-важкою, і libuv виконує їх у **thread pool** — за замовчуванням 4 потоки:
> - `fs.*` (асинхронні версії);
> - `dns.lookup` — а отже, кожен `http.get` за іменем хоста без кешу;
> - `crypto.pbkdf2`, `scrypt`, `randomBytes` з callback, `generateKeyPair`;
> - асинхронний `zlib`.
>
> ```js
> const crypto = require('node:crypto');
> const start = Date.now();
>
> for (let i = 0; i < 8; i++) {
>   crypto.pbkdf2('secret', 'salt', 200_000, 64, 'sha512', () => {
>     console.log(i, Date.now() - start);
>   });
> }
> // на машині з 4+ ядрами: дві "хвилі" по 4 з приблизно однаковим часом
> ```
>
> Продакшн-симптом: масове хешування паролів чи стиснення — і раптом повільнішають читання файлів та DNS-резолв, хоча event loop не завантажений.
>
> Рішення: `UV_THREADPOOL_SIZE` (до 1024; задавати через змінну оточення до старту процесу), кешування DNS або `dns.resolve*` (c-ares, без пулу), винесення CPU-роботи у `worker_threads`.
>
> **На співбесіді:** event loop lag і насичення thread pool — різні проблеми з різними метриками; плутати їх — типова помилка при розслідуванні.
>
> 📚 [[JavaScript - 08. Event Loop#Node.js: фази, process.nextTick і setImmediate|Розділ: event loop у Node.js]] · [libuv: Design overview](https://docs.libuv.org/en/v1.x/design.html) · [Node.js: Don't Block the Event Loop](https://nodejs.org/learn/asynchronous-work/dont-block-the-event-loop)

> [!question]- Чому планувальники на кшталт React Scheduler використовують `MessageChannel`, а не `setTimeout` чи microtasks?
> *рідко · теорія* · `js-06-020`
>
> Планувальнику потрібно виконувати роботу шматками й між ними **віддавати керування браузеру** — для вводу й рендеру. Варіанти:
> - microtasks не підходять: браузер не рендерить і не обробляє події, поки черга не порожня;
> - `setTimeout(0)` поступається, але у вкладених викликах отримує clamp 4 мс — це сотні мілісекунд простою на довгому рендері;
> - `postMessage` через `MessageChannel` створює звичайну задачу **без мінімальної затримки**.
>
> ```js
> const queue = [];
> const channel = new MessageChannel();
> channel.port1.onmessage = () => {
>   const task = queue.shift();
>   task?.();
> };
>
> function postTask(fn) {
>   queue.push(fn);
>   channel.port2.postMessage(null);
> }
> ```
>
> React Scheduler використовує `setImmediate`, де він є (Node, jsdom), інакше `MessageChannel`, і як останній варіант — `setTimeout`. Шматок роботи обмежений бюджетом ~5 мс, після чого планувальник поступається.
>
> Сучасна альтернатива — Prioritized Task Scheduling API: `scheduler.postTask(fn, { priority: 'user-blocking' | 'user-visible' | 'background' })` і `scheduler.yield()`. Підтримка поки неповна, тож потрібна перевірка й fallback.
>
> **На співбесіді:** це пояснює, чому concurrent rendering у React не блокує ввід — не через потоки, а через кооперативну багатозадачність поверх event loop.
>
> 📚 [[JavaScript - 08. Event Loop#Рендер: rAF, style, layout, paint|Розділ: рендер і планування]] · [MDN: MessageChannel](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel) · [React: Scheduler (вихідний код)](https://github.com/react/react/blob/main/packages/scheduler/src/forks/Scheduler.js)

## 🟣 Tech Lead

> [!question]- Як діагностувати event loop lag у продакшені?
> *іноді · практика* · `js-06-021`
>
> Спершу — метрики, щоб підтвердити саме блокування event loop, потім — профіль, щоб знайти винуватця.
>
> **Node.js:**
> - `monitorEventLoopDelay()` з `node:perf_hooks` — гістограма затримок (p50/p99/max, у наносекундах);
> - `performance.eventLoopUtilization()` — частка часу, коли цикл зайнятий; ELU під 1 при низькому CPU інших ядер — ознака однопотокового вузького місця;
> - симптоми: росте p99 латентності всіх ендпоінтів одночасно, падають health check-и, одне ядро на 100%;
> - профілювання: `--cpu-prof`, `--inspect` + DevTools, flame graph (0x, clinic), continuous profiling у продакшені; для GC — `--trace-gc`.
>
> Типові винуватці: `JSON.parse`/`stringify` великих payload-ів, `*Sync`-виклики, catastrophic backtracking у regex (ReDoS), сортування великих масивів, GC-паузи через алокації.
>
> ```js
> import { monitorEventLoopDelay, performance } from 'node:perf_hooks';
>
> const histogram = monitorEventLoopDelay({ resolution: 20 });
> histogram.enable();
> let lastElu = performance.eventLoopUtilization();
>
> setInterval(() => {
>   const elu = performance.eventLoopUtilization(lastElu);
>   lastElu = performance.eventLoopUtilization();
>   metrics.gauge('event_loop.delay_p99_ms', histogram.percentile(99) / 1e6);
>   metrics.gauge('event_loop.utilization', elu.utilization);
>   histogram.reset();
> }, 10_000).unref();
> ```
>
> **Браузер:** RUM-метрика INP, Long Animation Frames API (`PerformanceObserver` з типом `long-animation-frame` дає атрибуцію до скриптів), Performance panel у DevTools.
>
> **На співбесіді:** додайте захист, а не лише моніторинг — load shedding (503, коли lag вище порогу, як `@fastify/under-pressure`) і алерти на p99 затримки, а не середнє.
>
> 📚 [[JavaScript - 31. Продуктивність і V8|Розділ: продуктивність і V8]] · [Node.js: Performance measurement APIs](https://nodejs.org/api/perf_hooks.html) · [web.dev: Optimize long tasks](https://web.dev/articles/optimize-long-tasks)

> [!question]- Які архітектурні варіанти ви розглянете для CPU-важкої роботи в Node.js або браузері?
> *іноді · практика* · `js-06-022`
>
> Спершу перевірити, чи роботу можна не робити: кращий алгоритм, кеш, попереднє обчислення, стримінг замість завантаження всього в пам'ять. Далі — варіанти з trade-off-ами:
> - **Chunking з yield** — без нової інфраструктури, але загальний час росте, а ядро одне. Для роботи до сотень мілісекунд.
> - **Worker threads / Web Workers з пулом** (Piscina у Node) — справжній паралелізм на одній машині; ціна — серіалізація даних, пам'ять на кожен воркер, складніший дебаг. Розмір пулу ≈ кількість ядер.
> - **Черга й окремий worker-сервіс** (BullMQ, SQS) — асинхронна задача з повторами, незалежне масштабування й ізоляція збоїв; ціна — API статусу задачі, eventual consistency, операційна складність.
> - **Нативний код або WASM** (sharp, Rust через napi-rs) — у рази швидше для обчислень, але складніша збірка й деплой.
> - **`cluster` або кілька інстансів** — масштабує кількість запитів, але не рятує конкретний запит, що блокує свій процес.
>
> Критерії вибору:
> - чи потрібна відповідь синхронно в межах запиту;
> - розмір даних (вартість передачі між потоками);
> - частота й піки навантаження;
> - наслідки падіння (OOM воркера не має класти API);
> - компетенції команди.
>
> ```js
> import Piscina from 'piscina';
>
> const pool = new Piscina({ filename: new URL('./resize.worker.js', import.meta.url).href });
>
> app.post('/thumbnail', async (req, res) => {
>   const image = await pool.run({ buffer: req.body, width: 320 });
>   res.type('image/webp').send(image);
> });
> ```
>
> **На співбесіді:** сильна відповідь спирається на вимірювання — p99 латентності й ELU до і після — і пояснює, чому обрано найпростіший варіант, що закриває вимоги, а не найцікавіший.
>
> 📚 [[JavaScript - 29. Workers і паралельність|Розділ: workers і паралельність]] · [Node.js: worker_threads](https://nodejs.org/api/worker_threads.html) · [MDN: Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

## Тести

> [!quiz] Який із цих callback-ів потрапляє в чергу microtasks?
> level: junior · id: js-06-quiz-01
> - [ ] Callback `setTimeout(fn, 0)`
> - [x] Callback `Promise.resolve().then(fn)`
> - [ ] Обробник події `click`
> - [ ] Callback `setInterval(fn, 10)`
>
> **Пояснення:** реакції промісів — microtasks і виконуються одразу після поточної задачі. Таймери й події користувача — задачі (macrotasks).

> [!quiz] Яку мінімальну затримку за HTML spec отримують глибоко вкладені (понад 5 рівнів) виклики `setTimeout(fn, 0)` у браузері?
> level: middle · id: js-06-quiz-02
> - [ ] 0 мс
> - [ ] 1 мс
> - [x] 4 мс
> - [ ] 16 мс
>
> **Пояснення:** після 5 рівнів вкладеності таймерів затримка менша за 4 мс підвищується до 4 мс. Тому для частого поступання main thread використовують `MessageChannel` або `scheduler.yield()`.

> [!quiz] Оберіть усі правильні твердження про event loop у Node.js.
> level: senior · type: multi · id: js-06-quiz-03
> - [x] У CommonJS-модулі черга `process.nextTick` обробляється раніше за microtasks промісів
> - [x] Callback-и `setImmediate` виконуються у фазі check
> - [x] Усередині I/O callback-а `setImmediate` завжди спрацьовує раніше за `setTimeout(fn, 0)`
> - [ ] На верхньому рівні головного модуля `setTimeout(fn, 0)` гарантовано спрацьовує раніше за `setImmediate`
>
> **Пояснення:** після фази poll іде check, тому з I/O callback-а `setImmediate` виграє завжди. На верхньому рівні порядок залежить від того, чи минула 1 мс до перевірки таймерів, і не гарантований.

> [!quiz] Що виведе код?
> level: middle · type: output · id: js-06-quiz-04
>
> ```js
> console.log('1');
> setTimeout(() => console.log('2'), 0);
> Promise.resolve()
>   .then(() => {
>     console.log('3');
>     setTimeout(() => console.log('4'), 0);
>   })
>   .then(() => console.log('5'));
> queueMicrotask(() => console.log('6'));
> console.log('7');
> ```
>
> - [ ] `1 7 3 5 6 2 4`
> - [x] `1 7 3 6 5 2 4`
> - [ ] `1 7 6 3 5 2 4`
> - [ ] `1 7 3 6 2 5 4`
>
> **Пояснення:** microtasks `3` і `6` стоять у черзі в порядку реєстрації. `5` додається лише після виконання `3`, тобто після `6`. Таймери йдуть потім у порядку створення: `2`, а `4` — пізніше, бо його зареєстрували вже в microtask.

> [!quiz] Що виведе код?
> level: senior · type: output · id: js-06-quiz-05
>
> ```js
> async function f() { return Promise.resolve(1); }
> async function g() { return 1; }
>
> f().then(() => console.log('f'));
> g().then(() => console.log('g'));
> Promise.resolve()
>   .then(() => console.log('p1'))
>   .then(() => console.log('p2'))
>   .then(() => console.log('p3'));
> ```
>
> - [ ] `f g p1 p2 p3`
> - [ ] `g f p1 p2 p3`
> - [ ] `g p1 f p2 p3`
> - [x] `g p1 p2 f p3`
>
> **Пояснення:** повернення промісу з async-функції розв'язує її результат thenable-значенням: один тік на `NewPromiseResolveThenableJob`, ще один — на `then` внутрішнього промісу, і лише третім тіком виконується callback `f`. `g` повертає звичайне значення, тож її callback — у першому тіку.

## Задачі

> [!task] Реалізуй `sleep` і `withTimeout`
> level: junior · difficulty: easy · id: js-06-task-01 · tags: timers, promises
>
> Умова: напиши `sleep(ms)`, що повертає проміс, який виконується через `ms` мілісекунд. Потім `withTimeout(promise, ms)`: повертає проміс із результатом `promise`, але якщо той не settled за `ms`, відхиляється з `Error` з `name === 'TimeoutError'`. Таймер обов'язково очищується, коли `promise` завершився раніше, інакше він тримає процес Node живим. Приклад: `await withTimeout(sleep(50), 10)` відхиляється з `TimeoutError`, а `await withTimeout(sleep(10), 50)` виконується.
>
> > [!hint]- Підказка 1
> > `sleep` — це `new Promise`, у якому `resolve` передається в `setTimeout`.
>
> > [!hint]- Підказка 2
> > Для `withTimeout` підходить `Promise.race` між вхідним промісом і промісом-таймаутом.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function sleep(ms) {
> >   return new Promise(resolve => setTimeout(resolve, ms));
> > }
> >
> > function withTimeout(promise, ms) {
> >   let timer;
> >   const timeout = new Promise((_, reject) => {
> >     timer = setTimeout(() => {
> >       const error = new Error(`Timed out after ${ms} ms`);
> >       error.name = 'TimeoutError';
> >       reject(error);
> >     }, ms);
> >   });
> >   return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
> > }
> > ```
> >
> > `Promise.race` віддає результат першого settled промісу, а `finally` прибирає таймер в обох випадках. Важливо: таймаут не скасовує саму операцію — вона продовжує виконуватися, просто її результат ігнорується. Для справжнього скасування операція має приймати `AbortSignal`, і тоді краще `AbortSignal.timeout(ms)`.

> [!task] Реалізуй інтервал без накопичення дрейфу
> level: middle · difficulty: medium · id: js-06-task-02 · tags: timers, event-loop
>
> Умова: напиши `every(ms, fn)`, що викликає `fn(tick)` з номером тіку 1, 2, 3… у моменти, максимально близькі до `start + tick * ms`, і повертає функцію `stop()`. На відміну від `setInterval` чи наївного рекурсивного `setTimeout`, похибка не має накопичуватися: якщо один виклик запізнився на 30 мс, наступний однаково планується на "правильний" момент. Якщо потік був заблокований довше за кілька інтервалів, пропущені тіки не наздоганяються пачкою, а пропускаються. Помилка в `fn` не зупиняє розклад, а `stop()`, викликаний навіть усередині `fn`, зупиняє все. Приклад: `const stop = every(1000, t => console.log(t)); setTimeout(stop, 5500);` виведе 1…5.
>
> > [!hint]- Підказка 1
> > Запам'ятай `start = performance.now()` і рахуй наступну затримку від ідеального моменту, а не від "зараз плюс `ms`".
>
> > [!hint]- Підказка 2
> > Номер наступного тіку — не менше `tick + 1` і не менше `Math.ceil((now - start) / ms)`; друга умова пропускає тіки, що вже минули.
>
> > [!hint]- Підказка 3
> > Плануй наступний таймер у `finally` після виклику `fn` і перевіряй прапорець `stopped` перед кожним кроком.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function every(ms, fn) {
> >   const start = performance.now();
> >   let tick = 0;
> >   let timer;
> >   let stopped = false;
> >
> >   const schedule = () => {
> >     const now = performance.now();
> >     tick = Math.max(tick + 1, Math.ceil((now - start) / ms));
> >     timer = setTimeout(run, start + tick * ms - now);
> >   };
> >
> >   const run = () => {
> >     if (stopped) return;
> >     try {
> >       fn(tick);
> >     } finally {
> >       if (!stopped) schedule();
> >     }
> >   };
> >
> >   schedule();
> >   return () => {
> >     stopped = true;
> >     clearTimeout(timer);
> >   };
> > }
> > ```
> >
> > Кожна затримка обчислюється від `start + tick * ms`, тому запізнення одного виклику компенсується скороченням наступної паузи, і похибка не накопичується. `Math.ceil` гарантує, що ціль не в минулому, тож після довгого блокування пропущені тіки пропускаються, а не виконуються пачкою з нульовою затримкою. Помилка з `fn` після `finally` все одно полетить як uncaught exception: у браузері розклад продовжиться, а в Node без обробника процес завершиться, тож там `fn` краще обгорнути в `try/catch`. `performance.now()` монотонний і не залежить від переведення системного годинника.
