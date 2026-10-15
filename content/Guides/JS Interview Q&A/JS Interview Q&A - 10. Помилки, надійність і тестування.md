---
title: Помилки, надійність і тестування
order: 10
tags: [errors, testing, debugging, observability, reliability]
estimatedMinutes: 75
---

# JS Interview Q&A — 10. Помилки, надійність і тестування

## 🟢 Junior

> [!question]- Які вбудовані типи помилок є в JavaScript?
> *часто · теорія* · `js-10-001`
>
> Базовий клас — `Error`; від нього наслідуються спеціалізовані типи, які кидає сам рушій:
> - `TypeError` — операція над значенням невідповідного типу: `null.x`, виклик не-функції;
> - `ReferenceError` — звернення до неоголошеної змінної або до `let`/`const` у TDZ;
> - `SyntaxError` — невалідний код або `JSON.parse('{')`;
> - `RangeError` — значення поза діапазоном: `new Array(-1)`, переповнення стеку;
> - `URIError` — `decodeURIComponent('%')`;
> - `EvalError` — історичний, рушій його вже не кидає;
> - `AggregateError` — кілька помилок разом (`Promise.any`).
>
> Середовища додають свої: `DOMException` у браузері й Node (наприклад, `AbortError` від `AbortController`), у Node — помилки з полем `code` (`'ENOENT'`, `'ERR_INVALID_ARG_TYPE'`).
>
> ```js
> try {
>   null.length;
> } catch (e) {
>   e instanceof TypeError; // true
>   e.name;                 // 'TypeError'
> }
> ```
>
> **На співбесіді:** розрізняй помилки за `instanceof`, `name` або `code`, а не за текстом `message` — він різний у різних рушіях.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [MDN: Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) · [Spec: Error Objects](https://tc39.es/ecma262/#sec-error-objects)

> [!question]- Чому краще кидати `Error`, а не рядок чи довільний об'єкт?
> *часто · порівняння* · `js-10-002`
>
> `throw` приймає будь-яке значення, але лише об'єкт `Error` має **stack trace** — місце, де виникла помилка. Рядок чи `{ code: 42 }` приходять у `catch` без стеку, і в логах чи Sentry ти бачиш лише «Non-Error exception captured» без контексту.
>
> Інші причини:
> - код і бібліотеки перевіряють `err instanceof Error`, читають `err.message` і `err.name`;
> - `Error` підтримує `cause` для ланцюжка причин;
> - `Promise.reject('fail')` має ту саму проблему — відхиляти теж треба з `Error`.
>
> ```js
> try {
>   throw 'Not found';
> } catch (e) {
>   e.message; // undefined
>   e.stack;   // undefined
> }
>
> throw new Error('Not found', { cause: { userId: 7 } }); // є stack і контекст
> ```
>
> **На співбесіді:** у `catch` усе одно треба бути готовим до не-`Error` значень від чужого коду — у TypeScript зі `strict` змінна `catch` має тип `unknown`, і її варто нормалізувати.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [MDN: Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) · [javascript.info: Custom errors, extending Error](https://javascript.info/custom-errors)

> [!question]- Як працює `try/catch/finally` і коли виконується `finally`?
> *дуже часто · код* · `js-10-003`
>
> `try` виконує код; якщо в ньому синхронно виникла помилка, керування переходить у `catch`. `finally` виконується **завжди** — після успішного `try`, після `catch`, і навіть якщо в `try`/`catch` є `return`, `break` чи повторний `throw`. Тому там закривають ресурси, ховають лоадери, звільняють lock-и.
>
> ```js
> function load(input) {
>   showSpinner();
>   try {
>     return JSON.parse(input);
>   } catch (err) {
>     report(err);
>     return null;
>   } finally {
>     hideSpinner(); // виконається в обох гілках
>   }
> }
> ```
>
> Можна писати `try/finally` без `catch` — помилка полетить далі, але cleanup відбудеться. З ES2019 параметр можна пропустити: `catch { ... }`.
>
> **На співбесіді:** `finally` не виконається, лише якщо процес завершено (`process.exit()`), вкладку закрито або код завис у нескінченному циклі.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [MDN: try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) · [javascript.info: Error handling, "try...catch"](https://javascript.info/try-catch)

> [!question]- Чому `try/catch` не ловить помилку всередині `setTimeout` або в Promise без `await`?
> *дуже часто · код* · `js-10-004`
>
> `try/catch` ловить лише помилки, кинуті **синхронно** в поточному стеку викликів. Колбек `setTimeout` виконується пізніше, коли `try` вже завершився, — у новому стеку. Відхилений Promise без `await` теж нічого не кидає в поточному стеку: rejection обробляється асинхронно.
>
> ```js
> try {
>   setTimeout(() => { throw new Error('late'); }, 0);
> } catch (e) {
>   // сюди не потрапимо — uncaught error
> }
>
> async function save() {
>   try {
>     api.post('/save');       // без await: rejection повз catch
>     await api.post('/save'); // з await: ловиться
>   } catch (e) {
>     console.error(e);
>   }
> }
> ```
>
> Правило: помилку ловить той код, що чекає на результат — `await` усередині `try`, `.catch()` на ланцюжку або `try/catch` у самому колбеку.
>
> **На співбесіді:** `return promise` у `try` без `await` теж проскакує повз `catch` цієї функції; `return await promise` — ловиться.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [MDN: try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) · [javascript.info: Error handling with promises](https://javascript.info/promise-error-handling)

> [!question]- Чим відрізняються unit, integration та e2e тести?
> *дуже часто · порівняння* · `js-10-005`
>
> Різниця в тому, скільки реальної системи задіяно в тесті.
> - **Unit** — одна функція, клас чи компонент в ізоляції, залежності підмінені. Швидкі, точно вказують місце бага, але не гарантують, що частини працюють разом.
> - **Integration** — кілька модулів разом: сервіс + справжня БД у контейнері, компонент + store + замоканий API. Повільніші, ловлять помилки на стиках.
> - **E2E** — вся система очима користувача: браузер через Playwright або Cypress, справжній бекенд. Найвища впевненість, але найповільніші й найкрихкіші.
>
> ```js
> test('applyDiscount subtracts percentage', () => {
>   expect(applyDiscount(100, 0.2)).toBe(80);
> });
> ```
>
> **На співбесіді:** межі між рівнями команди визначають по-різному; важливо пояснити, що саме в тесті справжнє, а що підмінене.
>
> 📚 [[JavaScript - 33. Тестування JavaScript|Розділ: тестування JavaScript]] · [Martin Fowler: The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) · [Kent C. Dodds: The Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

> [!question]- Які техніки дебагу JavaScript ти використовуєш, крім `console.log`?
> *часто · практика* · `js-10-006`
>
> Основний інструмент — debugger у DevTools (або VS Code для Node): зупинити виконання й подивитися стан.
> - **Breakpoint** — клік по номеру рядка в Sources або `debugger;` у коді.
> - **Conditional breakpoint** — зупинка, лише коли умова істинна: `order.id === 42`. Незамінний у циклах.
> - **Logpoint** — логування виразу без зміни коду і перезбірки.
> - **Pause on exceptions** — зупинка в момент кидання помилки, навіть перехопленої.
> - DOM-, XHR/fetch- та event listener breakpoints — коли невідомо, хто змінює DOM чи шле запит.
>
> На паузі дивляться Call Stack, Scope, Watch і крокують через Step over / into / out. Для Node: `node --inspect-brk app.js` і `chrome://inspect`.
>
> **На співбесіді:** conditional breakpoint + Call Stack зазвичай швидші за десяток `console.log`.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [Chrome DevTools: Debug JavaScript](https://developer.chrome.com/docs/devtools/javascript) · [Node.js: Debugging](https://nodejs.org/learn/getting-started/debugging)

## 🟡 Middle

> [!question]- Як створити власний клас помилки і навіщо `cause`?
> *часто · код* · `js-10-007`
>
> Наслідуй `Error` і задай `name`, щоб тип було видно в логах, а обробник міг розрізняти помилки через `instanceof`. Додаткові поля (`status`, `code`) несуть дані для обробки. **`cause`** (ES2022) зберігає початкову помилку, коли низькорівневу помилку загортають у доменну, — без втрати оригінального стеку.
>
> ```js
> class AppError extends Error {
>   constructor(message, options) {
>     super(message, options); // options.cause потрапляє в err.cause
>     this.name = new.target.name;
>   }
> }
>
> class HttpError extends AppError {
>   constructor(status, message, options) {
>     super(message, options);
>     this.status = status;
>   }
> }
>
> async function getUser(id) {
>   try {
>     const res = await fetch(`/api/users/${id}`);
>     if (!res.ok) throw new HttpError(res.status, `GET user ${id} failed`);
>     return await res.json();
>   } catch (err) {
>     if (err instanceof HttpError) throw err;
>     throw new AppError('User service unavailable', { cause: err });
>   }
> }
> // у викликача: err instanceof AppError → true для обох типів,
> // err.cause → оригінальний TypeError від fetch
> ```
>
> `new.target.name` автоматично дає правильне ім'я підкласу. Спільний базовий клас дозволяє одним `instanceof AppError` відрізнити «наші» очікувані помилки від багів.
>
> **На співбесіді:** при транспіляції в ES5 `instanceof` для підкласів `Error` ламався (лікували `Object.setPrototypeOf(this, new.target.prototype)`); з нативними класами проблеми немає. Node у `util.inspect` і Sentry показують ланцюжок `cause`.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [MDN: Error: cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) · [javascript.info: Custom errors, extending Error](https://javascript.info/custom-errors)

> [!question]- Що повернеться, якщо `return` є і в `try`, і у `finally`?
> *часто · код* · `js-10-008`
>
> Переможе `return` із `finally`: він перезаписує і результат `try`, і навіть кинуту помилку — вона просто зникне. Це наслідок семантики completion records: `finally` виконується останнім, і його дострокове завершення (`return`, `throw`, `break`) замінює попереднє.
>
> ```js
> function a() {
>   try { return 'try'; } finally { return 'finally'; }
> }
> a(); // 'finally'
>
> function b() {
>   try { throw new Error('lost'); } finally { return 'ok'; }
> }
> b(); // 'ok' — помилку проковтнуто
>
> function c() {
>   let x = 1;
>   try { return x; } finally { x = 2; }
> }
> c(); // 1 — значення для return обчислено до finally
> ```
>
> Якщо `finally` завершується звичайно (без `return`/`throw`), зберігається результат `try` або `catch`. Зміна змінної у `finally` не впливає на вже обчислене значення, але мутація об'єкта — вплине, бо повертається посилання.
>
> **На співбесіді:** правило ESLint `no-unsafe-finally` забороняє `return`/`throw`/`break` у `finally` саме через проковтування помилок. Такий баг особливо підступний: функція «успішно» повертає значення, а в логах немає жодного сліду помилки.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [MDN: try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) · [Spec: The try Statement](https://tc39.es/ecma262/#sec-try-statement)

> [!question]- Що таке `AggregateError` і де він з'являється?
> *іноді · теорія* · `js-10-009`
>
> `AggregateError` (ES2021) — помилка, що містить кілька інших у полі `errors`. Конструктор: `new AggregateError(errors, message, options)`.
>
> Де зустрічається:
> - `Promise.any` відхиляється з `AggregateError`, коли відхилені всі проміси (і для порожнього масиву теж);
> - у власному коді — пакетна валідація або batch-операції, де треба повідомити про всі збої, а не лише про перший.
>
> ```js
> try {
>   await Promise.any([
>     fetch('https://mirror-a.example/file'),
>     fetch('https://mirror-b.example/file'),
>   ]);
> } catch (e) {
>   if (e instanceof AggregateError) {
>     e.errors.forEach((err) => console.error(err.message));
>   }
> }
>
> function validate(form) {
>   const errors = [];
>   if (!form.email.includes('@')) errors.push(new Error('email: invalid'));
>   if (form.password.length < 8) errors.push(new Error('password: too short'));
>   if (errors.length) throw new AggregateError(errors, 'Validation failed');
> }
> ```
>
> Порівняй із `Promise.allSettled`: він не відхиляється зовсім, а повертає статус кожного промісу — краще, коли часткові збої очікувані.
>
> **На співбесіді:** `fetch` відхиляється лише на мережевих збоях, а не на 404 чи 500 — тож «дзеркало», що відповіло 500, для `Promise.any` виграє гонку, якщо не перевірити `res.ok` і не кинути помилку вручну.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [MDN: AggregateError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) · [MDN: Promise.any()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

> [!question]- Як працюють глобальні обробники помилок у браузері та Node.js?
> *часто · порівняння* · `js-10-010`
>
> Глобальні обробники — остання лінія: вони не «лікують» помилку, а дають її залогувати й відправити в моніторинг.
>
> Браузер:
> - `window.onerror = (message, source, line, col, error) => {}` або `addEventListener('error', ...)` — неперехоплені помилки. Помилки завантаження `<img>`/`<script>` не спливають, їх ловлять у capture-фазі: `addEventListener('error', fn, true)`.
> - `unhandledrejection` — відхилений Promise без обробника; `event.reason` містить помилку, `event.preventDefault()` прибирає вивід у консоль.
> - Для скриптів з іншого origin без `crossorigin` і CORS-заголовків отримаєш лише `"Script error."` без деталей.
>
> Node.js:
> - `process.on('uncaughtException')` — після неї стан процесу ненадійний: залогувати й завершитись.
> - `process.on('unhandledRejection')` — без цього обробника з Node 15 необроблений rejection **валить процес** (режим `--unhandled-rejections=throw` за замовчуванням).
>
> ```js
> // браузер
> window.addEventListener('unhandledrejection', (event) => {
>   sendToMonitoring(event.reason);
> });
>
> // Node
> process.on('uncaughtException', (err) => {
>   logger.fatal({ err }, 'uncaught exception');
>   process.exit(1); // перезапуск — справа supervisor-а (systemd, k8s, pm2)
> });
> ```
>
> **На співбесіді:** глобальний обробник не замінює локальної обробки; «продовжити роботу після `uncaughtException`» — антипатерн.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [MDN: Window: error event](https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event) · [Node.js: uncaughtException](https://nodejs.org/api/process.html#event-uncaughtexception)

> [!question]- Чим відрізняються mock, stub, spy і fake?
> *часто · порівняння* · `js-10-011`
>
> Це різновиди **test doubles** — підмін залежностей у тестах (класифікація Джерарда Месароша):
> - **Stub** — повертає заготовлені відповіді й нічого не перевіряє: `getUser` завжди віддає `{ id: 1 }`.
> - **Spy** — записує виклики (аргументи, кількість), інколи пропускаючи їх до справжньої реалізації; перевірки — після дії.
> - **Mock** — об'єкт із заздалегідь заданими очікуваннями щодо взаємодії; тест падає, якщо виклики не відповідають.
> - **Fake** — робоча спрощена реалізація: in-memory репозиторій замість БД, фейковий SMTP.
> - **Dummy** — заглушка, яку лише передають, але не використовують.
>
> ```js
> import { vi, test, expect } from 'vitest';
>
> test('sends welcome email', async () => {
>   const mailer = { send: vi.fn().mockResolvedValue({ ok: true }) }; // stub + spy
>   const repo = new InMemoryUserRepo();                              // fake
>   await registerUser({ email: 'a@b.c' }, { mailer, repo });
>   expect(mailer.send).toHaveBeenCalledWith(expect.objectContaining({ to: 'a@b.c' }));
>   expect(await repo.findByEmail('a@b.c')).toBeDefined();
> });
> ```
>
> У Jest/Vitest `vi.fn()` називають «mock function», хоча фактично це spy зі stub-поведінкою; `vi.spyOn(obj, 'method')` за замовчуванням викликає оригінал.
>
> **На співбесіді:** надмірні моки тестують реалізацію, а не поведінку, і ламаються при рефакторингу; fakes і справжні залежності дають стійкіші тести.
>
> 📚 [[JavaScript - 33. Тестування JavaScript|Розділ: тестування JavaScript]] · [Martin Fowler: Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) · [Vitest: Mocking](https://vitest.dev/guide/mocking)

> [!question]- Як тестувати асинхронний код і таймери?
> *часто · код* · `js-10-012`
>
> Тест має **дочекатися** асинхронного результату: `async`-тест з `await` або повернений Promise. Інакше тест завершиться раніше, ніж спрацює assertion, і хибно пройде.
>
> ```js
> import { test, expect, vi, afterEach } from 'vitest';
>
> afterEach(() => {
>   vi.useRealTimers();
> });
>
> test('rejects with NotFoundError', async () => {
>   await expect(loadUser(404)).rejects.toThrow(NotFoundError);
> });
>
> test('retries once after 1s', async () => {
>   vi.useFakeTimers();
>   const fn = vi.fn()
>     .mockRejectedValueOnce(new Error('network'))
>     .mockResolvedValueOnce('ok');
>
>   const promise = retry(fn, { delayMs: 1000 });
>   await vi.advanceTimersByTimeAsync(1000);
>
>   await expect(promise).resolves.toBe('ok');
>   expect(fn).toHaveBeenCalledTimes(2);
> });
> ```
>
> Fake timers підміняють `setTimeout`, `setInterval` і `Date`, і час рухається лише за командою. Нюанси:
> - проміси — мікротаски, fake timers їх не підміняють; `advanceTimersByTimeAsync` (Vitest, Jest 29.5+) дає мікротаскам виконатися між таймерами, синхронний `advanceTimersByTime` — ні;
> - якщо проміс має відхилитися під час прокрутки часу, спершу причепи `expect(promise).rejects`, потім крути таймери — інакше отримаєш unhandled rejection;
> - повертай реальні таймери в `afterEach`.
>
> **На співбесіді:** fake timers роблять тест `retry` з 30-секундним backoff миттєвим і детермінованим.
>
> 📚 [[JavaScript - 33. Тестування JavaScript|Розділ: тестування JavaScript]] · [Vitest: Mocking Timers](https://vitest.dev/guide/mocking/timers) · [Jest: Timer Mocks](https://jestjs.io/docs/timer-mocks)

> [!question]- Що таке defensive programming і де валідувати вхідні дані?
> *іноді · практика* · `js-10-013`
>
> Defensive programming — писати код, який не довіряє вхідним даним і явно перевіряє припущення, замість того щоб падати глибоко всередині з незрозумілою помилкою. Але перевіряти все всюди — шум; валідують на **межах довіри**:
> - HTTP-запити, повідомлення з черг, webhooks;
> - відповіді зовнішніх API, дані з `localStorage` і URL;
> - публічний API бібліотеки чи модуля.
>
> Усередині системи, де дані вже провалідовані й типізовані, покладаються на типи і контракти.
>
> ```js
> import { z } from 'zod';
>
> const CreateOrder = z.object({
>   productId: z.string().min(1),
>   quantity: z.number().int().positive().max(100),
> });
>
> app.post('/orders', async (req, res) => {
>   const parsed = CreateOrder.safeParse(req.body);
>   if (!parsed.success) {
>     return res.status(400).json({ errors: parsed.error.issues });
>   }
>   const order = await createOrder(parsed.data); // далі — лише типізовані дані
>   res.status(201).json(order);
> });
> ```
>
> Принцип **fail fast**: чим ближче помилка до причини, тим дешевший дебаг. Для внутрішніх інваріантів — assertions (`node:assert` або власна `invariant()`).
>
> **На співбесіді:** TypeScript перевіряє лише під час компіляції — дані з мережі в рантаймі треба валідувати схемою («parse, don't validate»).
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [OWASP: Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) · [Zod](https://zod.dev/)

> [!question]- Як правильно логувати помилки з контекстом?
> *іноді · практика* · `js-10-014`
>
> Лог помилки має відповідати: що сталося, де, з якими даними і для якого запиту чи користувача. Для цього — **structured logging**: JSON-записи з полями замість склеєних рядків, які можна фільтрувати й агрегувати.
>
> Що класти в запис:
> - рівень (`error`, `warn`, `info`), повідомлення, серіалізовану помилку зі `stack` і `cause`;
> - correlation/request id — щоб зібрати логи одного запиту з різних сервісів;
> - доменний контекст: `orderId`, `userId`, операція, номер спроби;
> - версію релізу.
>
> ```js
> import pino from 'pino';
> const logger = pino();
>
> try {
>   await chargeCard(order);
> } catch (err) {
>   logger.error({ err, orderId: order.id, requestId }, 'payment failed');
>   throw err;
> }
>
> JSON.stringify(new Error('boom')); // '{}' — message і stack не enumerable
> ```
>
> Пастки:
> - `JSON.stringify(err)` губить `message` і `stack` — потрібні serializers (у pino є вбудований для ключа `err`);
> - логувати й перекидати на кожному рівні — одна помилка дає п'ять записів; логує той, хто остаточно обробляє;
> - PII, токени, номери карток не мають потрапляти в логи.
>
> **На співбесіді:** у Node `AsyncLocalStorage` дозволяє додавати request id у кожен лог без передачі через усі функції.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [MDN: Error: cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) · [Pino](https://getpino.io/)

## 🔴 Senior

> [!question]- Чим operational errors відрізняються від programmer errors і як це впливає на обробку?
> *часто · теорія* · `js-10-015`
>
> **Operational errors** — очікувані збої середовища в коректній програмі: таймаут мережі, 404 від API, невалідний ввід, переповнений диск, відмова платіжного провайдера. **Programmer errors** — баги: `undefined is not a function`, неправильні аргументи, порушений інваріант. Розподіл популяризував гайд Joyent щодо обробки помилок у Node.js.
>
> Стратегії різні:
> - operational — обробляти явно: retry з backoff, fallback, зрозуміле повідомлення користувачу, 4xx/5xx з кодом. Це частина бізнес-логіки, її варто моделювати типами (класи помилок, коди, Result);
> - programmer — не намагатися «відновитися»: стан уже може бути некоректним. Fail fast, звіт у моніторинг; у Node — завершити процес і дати supervisor-у перезапустити; у браузері — error boundary з fallback UI і звітом.
>
> ```js
> app.use((err, req, res, next) => {
>   if (err instanceof AppError && err.expose) {
>     return res.status(err.status).json({ code: err.code, message: err.message });
>   }
>   logger.error({ err, requestId: req.id }, 'unexpected error');
>   res.status(500).json({ code: 'INTERNAL' });
> });
> ```
>
> Типова помилка — порожній `catch` або catch-all, що однаково «обробляє» обидва типи: баг ховається під 500 без стеку або, гірше, програма продовжує роботу з пошкодженим станом.
>
> **На співбесіді:** та сама помилка може належати до різних класів залежно від шару: `ENOENT` для конфігу під час старту — фатальна, для файлу, який вибрав користувач, — operational.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [Node.js: Errors](https://nodejs.org/api/errors.html) · [MDN: Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

> [!question]- Result/Either чи exceptions: що обрати і які trade-offs?
> *іноді · порівняння* · `js-10-016`
>
> Exceptions — стандартний механізм JS: помилка автоматично спливає стеком, щасливий шлях читається чисто. Але в TypeScript сигнатура функції не каже, що вона може кинути, і обробку легко забути. **Result** робить помилку частиною значення, що повертається, і змушує викликача її обробити.
>
> ```ts
> type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
>
> type ParseError = { kind: 'empty' } | { kind: 'too_long'; max: number };
>
> function parseUsername(input: string): Result<string, ParseError> {
>   const v = input.trim();
>   if (!v) return { ok: false, error: { kind: 'empty' } };
>   if (v.length > 32) return { ok: false, error: { kind: 'too_long', max: 32 } };
>   return { ok: true, value: v };
> }
>
> const r = parseUsername(rawInput);
> if (!r.ok) {
>   showError(r.error); // TS звужує тип і дає вичерпно обробити kind
> } else {
>   save(r.value);
> }
> ```
>
> Trade-offs:
> - Result: явні, типізовані, вичерпні помилки; але багатослівно без оператора `?` як у Rust, потрібна дисципліна, а сторонні бібліотеки однаково кидають exceptions — межу треба обгортати;
> - exceptions: менше коду, stack trace, природна інтеграція з `async/await` і моніторингом; але неявний потік керування і `catch (e: unknown)`.
>
> Прагматичний підхід: Result — для **очікуваних доменних** збоїв (валідація, бізнес-правила, «не знайдено»), exceptions — для непередбачуваних збоїв і багів. Бібліотеки `neverthrow` чи Effect змінюють стиль усього коду, тож це командне рішення.
>
> **На співбесіді:** найгірше — змішування без правил, коли частина функцій кидає, частина повертає Result, і викликач мусить обробляти обидва. Межу проводять явно, наприклад на рівні доменного шару.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [MDN: Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) · [neverthrow (Result для TS)](https://github.com/supermacro/neverthrow)

> [!question]- Як отримати читабельні stack traces у продакшені з мініфікованим кодом?
> *часто · практика* · `js-10-017`
>
> Мініфікований стек (`a.js:1:48213`) марний без **source maps** — файлів, що зіставляють позиції зібраного коду з вихідними. Задача — мати їх для розбору помилок, але не віддавати вихідний код усім.
>
> Типова схема:
> 1. Збирати hidden source maps: `build.sourcemap: 'hidden'` у Vite, `devtool: 'hidden-source-map'` у webpack — `.map` генеруються без коментаря `//# sourceMappingURL`.
> 2. У CI завантажувати їх у Sentry або аналог із прив'язкою до release (або debug ID) і не публікувати на CDN.
> 3. Позначати кожну помилку версією релізу, щоб підібрати правильні maps.
>
> Для Node: `node --enable-source-maps` — стек одразу в координатах TypeScript.
>
> Нюанси стеків:
> - формат `err.stack` не стандартизований і різниться у V8, SpiderMonkey, JavaScriptCore;
> - V8 обрізає стек до `Error.stackTraceLimit` кадрів (за замовчуванням 10);
> - async stack traces у V8 відновлюють ланцюжок через `await`, але не через `.then()`-колбеки чи `setTimeout` — ще одна причина писати `async/await`;
> - стек фіксується в момент створення `Error`, а не кидання.
>
> ```js
> Error.stackTraceLimit = 50;
>
> async function handle(id) {
>   try {
>     await processOrder(id);
>   } catch (err) {
>     throw new Error(`processOrder ${id} failed`, { cause: err });
>   }
> }
> ```
>
> **На співбесіді:** `cause` зберігає обидва стеки — місця обгортання і першопричини, а моніторинг показує їх ланцюжком.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [web.dev: What are source maps?](https://web.dev/articles/source-maps) · [Sentry: Source Maps](https://docs.sentry.io/platforms/javascript/sourcemaps/)

> [!question]- Чому тести стають flaky і як із цим працювати в команді?
> *часто · практика* · `js-10-018`
>
> Flaky тест то проходить, то падає без змін у коді. Причина майже завжди — **недетермінізм**, який тест не контролює:
> - спільний стан і залежність від порядку: глобальні моки, незачищена БД, singleton-кеш;
> - реальний час: `Date.now()`, таймзони, `setTimeout` як «почекати, поки завантажиться»;
> - асинхронність без очікування: забутий `await`, перевірка до завершення ефекту;
> - мережа і сторонні сервіси; паралельні воркери, що ділять одну БД чи порт;
> - випадкові дані без фіксованого seed;
> - e2e: анімації, неявні очікування, селектори, прив'язані до верстки.
>
> Як лікувати:
> - відтворити: прогнати багато разів і в іншому порядку (`--repeat-each` у Playwright, `--sequence.shuffle` у Vitest, `--randomize` у Jest) у CI-подібному середовищі;
> - прибрати недетермінізм: fake timers, фіксований `TZ`, seed, окрема БД на воркер, web-first assertions (`await expect(locator).toBeVisible()`) замість `waitForTimeout`;
> - процес: карантин із власником і дедлайном, дашборд flake rate; автоматичні retries — лише тимчасово і з метрикою, бо вони ховають і справжні race conditions.
>
> ```js
> test('shows toast after save', async ({ page }) => {
>   await page.getByRole('button', { name: 'Save' }).click();
>   await expect(page.getByRole('status')).toHaveText('Saved'); // чекає автоматично
> });
> ```
>
> **На співбесіді:** flaky тест іноді сигналізує не про проблему тесту, а про реальний race condition у продукті, який користувачі теж ловлять.
>
> 📚 [[JavaScript - 33. Тестування JavaScript|Розділ: тестування JavaScript]] · [Google Testing Blog: Flaky Tests at Google](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html) · [Playwright: Best Practices](https://playwright.dev/docs/best-practices)

> [!question]- Що таке property-based testing і коли воно корисне?
> *рідко · код* · `js-10-019`
>
> Замість кількох прикладів, підібраних вручну, ти описуєш **властивість**, що має бути істинною для будь-якого вводу, а бібліотека (у JS — `fast-check`) генерує сотні випадкових вхідних даних. Коли знаходить контрприклад, виконує **shrinking** — зменшує його до мінімального, який усе ще ламає тест.
>
> Типові властивості:
> - round-trip: `decode(encode(x))` дорівнює `x` (серіалізація, парсери);
> - інваріанти: результат сортування впорядкований, має ту саму довжину, повторне сортування нічого не змінює;
> - порівняння з еталоном: оптимізована функція дає те саме, що проста.
>
> ```js
> import fc from 'fast-check';
> import { test, expect } from 'vitest';
>
> test('sortNumbers returns an ordered array of the same length', () => {
>   fc.assert(
>     fc.property(fc.array(fc.integer()), (arr) => {
>       const sorted = sortNumbers(arr);
>       expect(sorted).toHaveLength(arr.length);
>       for (let i = 1; i < sorted.length; i++) {
>         expect(sorted[i - 1]).toBeLessThanOrEqual(sorted[i]);
>       }
>     }),
>   );
> });
> ```
>
> Якщо `sortNumbers` реалізовано як `arr.sort()` без компаратора, тест знайде контрприклад на кшталт `[10, 9]` або `[-1, -2]` — сортування за замовчуванням лексикографічне.
>
> Коли корисно: парсери, серіалізація, фінансові розрахунки, алгоритми, state machines (model-based testing через `fc.commands`). Коли ні: UI і код із великою кількістю побічних ефектів — властивості важко сформулювати.
>
> **На співбесіді:** фіксуй seed невдалого прогону (fast-check виводить його), щоб відтворити падіння, — інакше тест поводиться як flaky.
>
> 📚 [[JavaScript - 33. Тестування JavaScript|Розділ: тестування JavaScript]] · [fast-check](https://fast-check.dev/)

## 🟣 Tech Lead

> [!question]- Як ти визначаєш стратегію обробки помилок і стандарти observability для команди?
> *іноді · практика* · `js-10-020`
>
> Мета — щоб будь-яку помилку в проді можна було за хвилини знайти, зрозуміти й прив'язати до релізу, а користувач бачив зрозуміле повідомлення, а не білий екран.
>
> Стандарти, які я фіксую в документі й підкріплюю інструментами:
> 1. **Таксономія**: базовий `AppError` з `code`, `status`, `expose`; operational vs programmer errors; каталог кодів для клієнтів.
> 2. **Де ловити**: на межах — HTTP middleware, UI error boundaries, job runner, обробник черги. Усередині — або обробити по суті, або загорнути з `cause` і прокинути далі. Порожній `catch` заборонений лінтером.
> 3. **Логи**: structured JSON, обов'язкові поля (`requestId`, `release`, ідентифікатор користувача без PII), рівні з чітким значенням.
> 4. **Traces і метрики**: OpenTelemetry для трасування між сервісами; RED-метрики (rate, errors, duration) на кожен endpoint.
> 5. **Exception tracking**: Sentry із source maps, release tracking, осмислене групування і власник для кожної групи помилок.
> 6. **Алерти**: на симптоми, які бачить користувач (error rate, latency, SLO burn rate), а не на кожен виняток — інакше alert fatigue.
> 7. **Runbooks** для частих алертів.
>
> Впроваджую через шаблони сервісів, спільні пакети (logger, error classes, middleware) і рев'ю, а не лише через документ, який ніхто не читає.
>
> **На співбесіді:** метрики успіху — MTTD, MTTR і частка інцидентів, які першими помітили алерти, а не користувачі.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [OpenTelemetry: JavaScript](https://opentelemetry.io/docs/languages/js/) · [Pino](https://getpino.io/)

> [!question]- Піраміда чи testing trophy: як обрати стратегію тестування для команди?
> *іноді · порівняння* · `js-10-021`
>
> **Піраміда тестів** (Майк Кон): багато unit, менше integration, мінімум e2e — бо нижчі рівні швидші й дешевші. **Testing trophy** (Кент Доддс): основа — статичний аналіз (TypeScript, ESLint), далі трохи unit, **найбільше integration**, трохи e2e. Аргумент trophy: integration-тести дають найкраще співвідношення впевненості до вартості, особливо у фронтенді, де unit-тест компонента з моками майже нічого не гарантує.
>
> Як обираю:
> - бібліотеки, алгоритми, доменна логіка з розрахунками → ближче до піраміди: багато unit і property-based;
> - продуктові фронтенди і CRUD-бекенди → trophy: Testing Library, справжній store, мережа замокана на рівні HTTP (MSW), API-тести з реальною БД у контейнері;
> - мікросервіси → contract tests (Pact) замість важкого e2e на всю систему;
> - e2e — лише критичні user journeys: логін, оплата, онбординг.
>
> Командні правила важливіші за форму: тест перевіряє поведінку, а не реалізацію; CI має бюджет часу (наприклад, пайплайн PR до 10 хвилин); flake rate відстежується; coverage — сигнал для пошуку прогалин, а не KPI.
>
> **На співбесіді:** форма — наслідок, а не мета. Питай «яка найдешевша перевірка впіймає цей клас багів», і розподіл складеться сам.
>
> 📚 [[JavaScript - 33. Тестування JavaScript|Розділ: тестування JavaScript]] · [Martin Fowler: The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) · [Kent C. Dodds: The Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

> [!question]- Як організувати postmortem після інциденту?
> *іноді · практика* · `js-10-022`
>
> Postmortem — документ і зустріч після інциденту, мета яких — не допустити повторення цього класу проблем. Ключовий принцип — **blameless**: шукаємо, які умови системи дозволили людині помилитися, а не хто винен. Інакше люди приховуватимуть деталі, і наступний інцидент буде гіршим.
>
> Структура документа:
> - короткий summary і **impact**: скільки користувачів, як довго, гроші чи SLA;
> - timeline з часовими мітками: початок, виявлення, ескалація, мітигація, повне відновлення;
> - як виявили (алерт чи скарга користувача) і скільки часу це зайняло — MTTD/MTTR;
> - contributing factors — зазвичай їх кілька (зміна коду + відсутній алерт + ручний крок у деплої), а не одна «root cause»;
> - що спрацювало добре;
> - action items: конкретні, з власником, дедлайном і пріоритетом, заведені в трекер.
>
> Звички, які я підтримую в команді:
> - писати документ, поки пам'ять свіжа, — протягом кількох днів;
> - «людська помилка» не може бути висновком, лише початком питання «чому система це дозволила»;
> - регулярно переглядати відкриті action items: незакриті пункти — головна причина повторних інцидентів;
> - ділитися postmortem-ами ширше за команду й періодично шукати повторювані патерни.
>
> **На співбесіді:** наведи власний приклад інциденту і що конкретно змінилося після нього — це цінують більше, ніж знання шаблону.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка|Розділ: помилки та їх обробка]] · [Google SRE Book: Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)

## Тести

> [!quiz] Яку помилку кине вираз `null.foo`?
> level: junior · id: js-10-quiz-01
> - [ ] `ReferenceError`
> - [x] `TypeError`
> - [ ] `SyntaxError`
> - [ ] `RangeError`
>
> **Пояснення:** змінна існує, але читати властивість у `null` не можна — це операція над значенням невідповідного типу, тобто `TypeError`. `ReferenceError` виникає, коли не існує самого ідентифікатора.

> [!quiz] Що поверне `JSON.stringify(new Error('boom'))`?
> level: middle · id: js-10-quiz-02
> - [ ] `'{"message":"boom"}'`
> - [x] `'{}'`
> - [ ] `'"Error: boom"'`
> - [ ] Кине `TypeError`
>
> **Пояснення:** `message` і `stack` — власні, але non-enumerable властивості, а `JSON.stringify` серіалізує лише enumerable. Тому для логування помилок потрібні serializers, які явно беруть `name`, `message`, `stack` і `cause`.

> [!quiz] Оберіть усі правильні: у яких випадках `try/catch` усередині `async`-функції перехопить помилку?
> level: middle · type: multi · id: js-10-quiz-03
> - [x] `await Promise.reject(new Error('x'))` у `try`
> - [x] `JSON.parse('{')` у `try`
> - [ ] `setTimeout(() => { throw new Error('x'); })` у `try`
> - [ ] `return fetchData()` без `await` у `try`, де `fetchData` відхиляється
>
> **Пояснення:** `catch` ловить синхронні помилки і rejection-и, на які функція чекає через `await`. Колбек таймера виконується пізніше в іншому стеку, а `return promise` без `await` передає відхилений проміс назовні, минаючи `catch`.

> [!quiz] Що виведе код?
> level: junior · type: output · id: js-10-quiz-04
>
> ```js
> function f() {
>   try {
>     throw new Error('boom');
>   } catch (e) {
>     return 'catch';
>   } finally {
>     console.log('finally');
>   }
> }
> console.log(f());
> ```
>
> - [ ] `catch`, потім `finally`
> - [x] `finally`, потім `catch`
> - [ ] лише `finally`
> - [ ] `Error: boom`
>
> **Пояснення:** `return 'catch'` обчислює значення, але перед виходом з функції виконується `finally`, який логує `finally`. Лише після цього `f()` повертає `'catch'`, і зовнішній `console.log` його виводить.

> [!quiz] Що виведе код?
> level: senior · type: output · id: js-10-quiz-05
>
> ```js
> Promise.any([
>   Promise.reject(new Error('a')),
>   Promise.reject(new Error('b')),
> ]).catch((e) => console.log(e.constructor.name, e.errors.map((x) => x.message)));
> ```
>
> - [x] `AggregateError [ 'a', 'b' ]`
> - [ ] `Error [ 'a' ]`
> - [ ] `AggregateError [ 'b' ]`
> - [ ] `Error a`
>
> **Пояснення:** `Promise.any` відхиляється, лише коли відхилені всі проміси, і тоді повертає `AggregateError`, у якого `errors` містить причини в порядку вхідного масиву, а не в порядку відхилення.

## Задачі

> [!task] Реалізуй `tryCatch`, що повертає `[err, data]`
> level: junior · difficulty: easy · id: js-10-task-01 · tags: errors, async
>
> Напиши `tryCatch(input)`, де `input` — функція (синхронна або async) чи Promise. Функція завжди повертає Promise кортежу: `[null, data]` при успіху або `[error, null]` при помилці — і ніколи не відхиляється. Якщо кинуто не `Error` (рядок, об'єкт), його треба нормалізувати до `Error`, зберігши оригінал у `cause`. Приклад: `const [err, user] = await tryCatch(() => fetchUser(1)); if (err) return showError(err.message);`.
>
> > [!hint]- Підказка 1
> > Виклик `input()` має відбуватися всередині `try`, інакше синхронний `throw` вилетить назовні.
>
> > [!hint]- Підказка 2
> > `await` працює і з Promise, і зі звичайним значенням, тому результат виклику функції можна просто чекати.
>
> > [!hint]- Підказка 3
> > Для нормалізації не використовуй `String(value)`: для об'єкта без прототипу він сам кидає `TypeError`. Краще фіксоване повідомлення і `{ cause: value }`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function toError(value) {
> >   if (value instanceof Error) return value;
> >   return new Error('Non-Error value thrown', { cause: value });
> > }
> >
> > async function tryCatch(input) {
> >   try {
> >     const data = await (typeof input === 'function' ? input() : input);
> >     return [null, data];
> >   } catch (err) {
> >     return [toError(err), null];
> >   }
> > }
> >
> > const [err, data] = await tryCatch(() => JSON.parse('{'));
> > err instanceof SyntaxError; // true
> > data;                       // null
> > ```
> >
> > `await` усередині `try` перехоплює і синхронні помилки з `input()`, і rejection-и. Помилка йде першою в кортежі, щоб її важко було проігнорувати, а перевіряти треба саме `err`, бо `data` може легітимно бути `null`. Обмеження: `instanceof Error` не спрацює для помилок з іншого realm (iframe, `vm`) — там вони будуть загорнуті.

> [!task] Реалізуй `retry` з типізованими помилками та експоненційним backoff
> level: senior · difficulty: hard · id: js-10-task-02 · tags: errors, retry, async, abort
>
> Побудуй ієрархію: `AppError` (база), `HttpError` зі `status` (повторюваний для 429 і 5xx), `NetworkError` (завжди повторюваний), `ValidationError` (ніколи), `RetryError` з полем `attempts`. Напиши `retry(fn, { retries = 3, baseMs = 200, maxMs = 5000, signal } = {})`, що викликає `fn(attempt)` і повторює лише повторювані помилки з експоненційним backoff і full jitter. Неповторювані помилки й помилки чужих типів прокидаються одразу без змін; після вичерпання спроб кидається `RetryError` з останньою помилкою в `cause`. `AbortSignal` має переривати і спробу, і очікування між спробами. Приклад: при `retries: 3` функція виконується максимум 4 рази.
>
> > [!hint]- Підказка 1
> > Нехай кожен клас сам каже, чи він повторюваний, — наприклад, getter `retryable`. Тоді `retry` не знає про конкретні типи і перевіряє `err instanceof AppError && err.retryable`.
>
> > [!hint]- Підказка 2
> > Затримка: `cap = min(maxMs, baseMs * 2 ** (attempt - 1))`, спати `Math.random() * cap` (full jitter), щоб клієнти не повторювали синхронно.
>
> > [!hint]- Підказка 3
> > `sleep(ms, signal)` має слухати `abort` і відхилятися з `signal.reason`, прибираючи таймер і слухача. Перед кожною спробою викликай `signal?.throwIfAborted()`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class AppError extends Error {
> >   constructor(message, options) {
> >     super(message, options);
> >     this.name = new.target.name;
> >   }
> >   get retryable() {
> >     return false;
> >   }
> > }
> >
> > class HttpError extends AppError {
> >   constructor(status, message, options) {
> >     super(message, options);
> >     this.status = status;
> >   }
> >   get retryable() {
> >     return this.status === 429 || this.status >= 500;
> >   }
> > }
> >
> > class NetworkError extends AppError {
> >   get retryable() {
> >     return true;
> >   }
> > }
> >
> > class ValidationError extends AppError {}
> >
> > class RetryError extends AppError {
> >   constructor(attempts, options) {
> >     super(`Failed after ${attempts} attempts`, options);
> >     this.attempts = attempts;
> >   }
> > }
> >
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
> > async function retry(fn, { retries = 3, baseMs = 200, maxMs = 5000, signal } = {}) {
> >   for (let attempt = 1; ; attempt++) {
> >     signal?.throwIfAborted();
> >     try {
> >       return await fn(attempt);
> >     } catch (err) {
> >       if (!(err instanceof AppError) || !err.retryable) throw err;
> >       if (attempt > retries) throw new RetryError(attempt, { cause: err });
> >       const cap = Math.min(maxMs, baseMs * 2 ** (attempt - 1));
> >       await sleep(Math.random() * cap, signal);
> >     }
> >   }
> > }
> >
> > const controller = new AbortController();
> > const user = await retry(async () => {
> >   let res;
> >   try {
> >     res = await fetch('/api/user', { signal: controller.signal });
> >   } catch (err) {
> >     if (err.name === 'AbortError') throw err;
> >     throw new NetworkError('fetch failed', { cause: err });
> >   }
> >   if (res.status === 422) throw new ValidationError('Invalid request');
> >   if (!res.ok) throw new HttpError(res.status, `GET /api/user → ${res.status}`);
> >   return res.json();
> > }, { retries: 3, signal: controller.signal });
> > ```
> >
> > Рішення про повтор інкапсульоване в класах, тож нові типи помилок не вимагають змін у `retry`. Помилки чужих типів (баги, `AbortError`) не повторюються — ретраї маскували б programmer errors. Full jitter розмазує повтори в часі й не дає тисячам клієнтів одночасно «добити» сервіс, що відновлюється. Для 429 у продакшені варто враховувати заголовок `Retry-After`, а повторювати безпечно лише ідемпотентні операції або запити з idempotency key.
