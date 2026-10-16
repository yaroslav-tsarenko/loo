---
title: Помилки та їх обробка
order: 22
level: middle
tags: [errors, exceptions, try-catch, async, debugging, logging]
prerequisites:
  - "[[JavaScript - 07. Прототипи та класи]]"
  - "[[JavaScript - 09. Promise]]"
  - "[[JavaScript - 10. async і await]]"
estimatedMinutes: 50
id: jsd-ch-22
icon: "🚨"
---

# Помилки та їх обробка

> [!success] 🎯 Після цього розділу ти зможеш
> - назвати вбудовані типи помилок і пояснити, чому кидати треба `Error`, а не рядок;
> - точно передбачити результат `try/catch/finally`, включно з випадками, коли `finally` «перебиває» `return`;
> - написати власний клас помилки з `cause` і зібрати ланцюжок причин для логів;
> - пояснити, де ловляться помилки асинхронного коду і що таке unhandled rejection у браузері та Node;
> - обрати між fail-fast і defensive programming і розставити error boundaries у застосунку.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-22-quiz-01
>
> ```js
> function f() {
>   try {
>     throw new Error('boom');
>   } catch {
>     console.log('catch');
>     return 'from catch';
>   } finally {
>     console.log('finally');
>     return 'from finally';
>   }
> }
> console.log(f());
> ```
>
> **Відповідь:** `catch finally from finally`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. `catch` вже «вирішив» повернути `'from catch'`, але `finally` виконується завжди, і його власний `return` замінює попередній результат.

## 🧒 Простими словами

Уяви офісну будівлю з пожежною сигналізацією. Хтось на 5-му поверсі натиснув кнопку — це `throw`. Сигнал біжить **вгору по поверхах** (по стеку викликів), доки не знайдеться черговий із вогнегасником — це `catch`. Якщо чергового немає ніде, тривога доходить до охорони будівлі (глобальний обробник) і, можливо, всіх евакуюють (процес падає). Правило «вимкни плиту, коли йдеш» виконується за будь-якого розвитку подій — це `finally`. А протокол інциденту — хто, що, де, з якої причини — це об'єкт `Error` з `message`, `stack` і `cause`. Асинхронна помилка — це лист «адресата не знайдено», що повертається через тиждень: той, хто його відправив, уже пішов з офісу, тож хтось має бути **призначений** читати повернену пошту.

## 🔬 Як це працює насправді

### 🧱 Об'єкт Error і вбудовані типи

`Error` — звичайний об'єкт із прототипом `Error.prototype`. Важливі поля:

- `message` — опис (власна **неперелічувана** властивість);
- `name` — тип; береться з прототипу (`'TypeError'`), якщо не перевизначити;
- `stack` — рядок зі стеком викликів. Його **немає** в ECMAScript (лише пропозиція), але всі рушії його дають, і формат у кожного свій;
- `cause` — причина (ES2022), з'являється, лише якщо передати `{ cause }`.

| Тип | Коли кидає рушій | Приклад |
|---|---|---|
| `TypeError` | операція над значенням не того типу | `null.x`, `undefined()` |
| `ReferenceError` | звернення до неоголошеної змінної або TDZ | `undefinedVar` |
| `RangeError` | число поза допустимим діапазоном | `new Array(-1)`, `(1).toFixed(101)` |
| `SyntaxError` | синтаксис коду або JSON | `JSON.parse('{')` |
| `URIError` | зламаний URI | `decodeURIComponent('%')` |
| `EvalError` | лише для сумісності, рушій не кидає | — |
| `AggregateError` | кілька помилок разом | `Promise.any` |
| `SuppressedError` | помилка при `dispose` під час іншої помилки | `using` |

У браузері ще є `DOMException` — помилки Web API розрізняють за `name`: `'AbortError'`, `'NotFoundError'`, `'QuotaExceededError'`. Тексти `message` у рушіїв різні, тож **ніколи не розгалужуй логіку за текстом повідомлення** — лише за `name`, класом або власним `code`.

> [!quiz] Перевір себе: яка помилка?
> level: junior · type: multi · id: jsd-22-quiz-02
>
> Які з виразів кидають саме `RangeError`?
>
> - [x] `new Array(-1)`
> - [ ] `null.length`
> - [x] `(1).toFixed(101)`
> - [ ] `JSON.parse('{')`
> - [x] `'ab'.repeat(-1)`
>
> **Пояснення:** `RangeError` — коли число виходить за допустимі межі (довжина масиву, кількість знаків, кількість повторів). `null.length` — `TypeError`, зламаний JSON — `SyntaxError`.

### 🎯 throw кидає що завгодно, але кидай Error

`throw` приймає **будь-яке** значення: рядок, число, об'єкт, навіть `undefined`. Але лише `Error` (і його нащадки) несе `stack` — місце, де сталася біда.

```js
try { throw 'oops'; } catch (e) {
  console.log(typeof e, e.message, e.stack);
}
// → string undefined undefined
```

Наслідки «кидання рядків»: немає стеку, бібліотеки логування і Sentry-подібні сервіси не можуть згрупувати помилку, код `catch (e) { log(e.message) }` логує `undefined`. Тому правило ESLint `no-throw-literal` і TypeScript-налаштування `useUnknownInCatchVariables` (тип `e` — `unknown`) — твої друзі.

Оскільки в `catch` може прилетіти що завгодно, на межах системи нормалізуй: `Error.isError(e) ? e : new Error(String(e), { cause: e })`. `Error.isError` (ES2026) надійніше за `instanceof Error`: він перевіряє внутрішній слот `[[ErrorData]]`, тому працює для помилок з іншого realm (iframe, `vm`-контекст) і не обманюється об'єктом `Object.create(Error.prototype)`. Якщо змінна в `catch` не потрібна — пиши `catch { … }` без дужок (ES2019).

> [!quiz] Перевір себе: навіщо кидати Error
> level: junior · id: jsd-22-quiz-03
>
> Яка головна практична різниця між `throw 'fail'` і `throw new Error('fail')`?
>
> - [ ] Рядок не можна зловити `catch`
> - [x] Лише `Error` зберігає `stack` — де саме виникла проблема
> - [ ] `throw 'fail'` не зупиняє виконання функції
> - [ ] Різниці немає, це питання стилю
>
> **Пояснення:** ловиться все однаково, і виконання зупиняється однаково. Але без `stack` ти не знайдеш місце помилки в продакшн-логах.

### 🔁 try, catch і finally — точна семантика

Специфікація описує кожен оператор через **completion record**: «нормально», `return`, `throw`, `break` чи `continue`. Правила `try/catch/finally`:

> [!diagram] try → catch → finally: хто вирішує результат
> ```yaml
> layout: flow
> nodes:
>   - { id: try, label: "try", code: "try {\n  throw new Error('збій');\n}", tone: blue }
>   - { id: catch, label: "catch", code: "catch (e) {\n  return 'catch';\n}", tone: orange }
>   - { id: fin, label: "finally (завжди)", code: "finally {\n  console.log('cleanup');\n}", tone: violet }
>   - { id: out, label: "результат f()", text: "?", tone: green }
> edges:
>   - { from: try, to: catch, label: "throw" }
>   - { from: catch, to: fin, label: "результат catch" }
>   - { from: fin, to: out }
>   - { from: try, to: fin, label: "нормально — catch пропускається" }
> steps:
>   - { line: "try:2", note: "try кидає Error — completion record типу «throw». Без помилки ми пішли б одразу до finally." }
>   - { move: { from: try, to: catch, value: "Error('збій')" }, line: "catch:2", note: "Помилку ловить catch і вирішує результат: return 'catch'. Значення вже «запаковане»." }
>   - { move: { from: catch, to: fin, value: "return 'catch'" }, line: "fin:2", note: "Перш ніж функція справді вийде, виконується finally — завжди: після return, throw, break." }
>   - { move: { from: fin, to: out, value: "'catch'" }, set: { out: "'catch'" }, note: "finally завершився тихо (лише console.log) — лишається те, що вирішив catch." }
>   - { set: { out: "'finally' — перемагає" }, focus: [fin, out], note: "А якби у finally був return 'finally' (чи throw, break), він ПЕРЕБИВ би все — і результат catch, і навіть помилку з try." }
> ```

1. `finally` виконується **завжди**: після нормального виходу, `return`, `throw`, `break`, `continue`.
2. Якщо `finally` завершився «тихо», зберігається те, що вирішили `try`/`catch`.
3. Якщо у `finally` є `return`, `throw` або `break` — він **перебиває** все. Помилка з `try` при цьому губиться назавжди.
4. Значення для `return` обчислюється **до** `finally`: зміна змінної у `finally` вже не вплине на повернене значення.

```js
let x = 1;
function h() {
  try { return x; }      // значення 1 вже «запаковане»
  finally { x = 2; }     // змінює змінну, але не результат
}
console.log(h(), x); // → 1 2
```

> [!viz] call-stack
> scenario: nested-calls

Коли кинуто помилку, рушій **розкручує стек**: знімає кадри один за одним (виконуючи їхні `finally`), доки не знайде `try` з `catch`. Не знайшов — помилка стає «неперехопленою» і йде до хоста. Ще одна межа: `try` ловить лише те, що сталося **синхронно** всередині нього. Callback, який виконається пізніше (`setTimeout`, подія), живе в іншій задачі з іншим стеком — див. [[JavaScript - 08. Event Loop]].

> [!quiz] Перевір себе: помилка, що зникла
> level: middle · type: output · id: jsd-22-quiz-04
>
> ```js
> function g() {
>   try {
>     throw new Error('важлива помилка');
>   } finally {
>     return 'ok';
>   }
> }
> console.log(g());
> ```
>
> **Відповідь:** `ok`
>
> **Пояснення:** `return` у `finally` замінює completion `throw` на `return`. Помилка мовчки зникає — тому лінтери (`no-unsafe-finally`) забороняють `return`/`throw` у `finally`.

> [!quiz] Заповни пропуски: звільни замок за будь-якого результату
> level: middle · type: fill · id: jsd-22-quiz-09 · bank: catch, then, return
>
> ```js fill
> async function withLock(lock, fn) {
>   await lock.acquire()
>   [[try]] {
>     return [[await]] fn()
>   } [[finally]] {
>     lock.release()
>   }
> }
> ```
>
> **Пояснення:** `finally` виконується і після `return`, і після `throw`, тож замок звільниться завжди. `await` тут обов'язковий: без нього функція повернула б незавершений проміс, `finally` спрацював би одразу — і замок відпустили б, поки `fn` ще працює.

### 🔗 cause, власні класи й AggregateError

Помилка нижнього рівня («`fetch failed`») майже ніколи не каже, **що** намагався зробити застосунок. Правильний підхід — **загорнути** її з контекстом, не втративши оригінал:

```js
class HttpError extends Error {
  constructor(status, message, options) {
    super(message, options); // options = { cause }
    this.name = 'HttpError';
    this.status = status;
  }
}

const low = new TypeError('fetch failed');
const err = new HttpError(503, 'Service unavailable', { cause: low });
console.log(err instanceof HttpError, err instanceof Error); // → true true
console.log(String(err), err.cause === low); // → HttpError: Service unavailable true
```

Деталі, які питають:

- **`super(message, options)`** — `Error` сам встановить `message` і `cause`. Без `options` причина загубиться.
- **`this.name`** — без нього `String(err)` і стек показуватимуть `Error:`. Варіант для ієрархій: `this.name = new.target.name`.
- **`stack` захоплюється автоматично** в момент `new`. `Error.captureStackTrace(obj, fn)` (з V8, а нині є й у Firefox та Safari) потрібен, лише щоб додати `stack` до довільного об'єкта або **сховати** службові кадри вище за `fn` — наприклад, фабрику помилок.

Ланцюжок причин зручно розгортати для логів:

```js
function formatError(err, indent = '') {
  if (!(err instanceof Error)) return `${indent}${String(err)}`;
  let out = `${indent}${err.name}: ${err.message}`;
  if (err.cause !== undefined) {
    out += `\n${indent}  ↳ caused by: ` + formatError(err.cause, indent + '  ').trimStart();
  }
  return out;
}
const net = new TypeError('fetch failed');
const e = new Error('Не вдалося зберегти профіль', { cause: new Error('HTTP 503', { cause: net }) });
console.log(formatError(e));
// → Error: Не вдалося зберегти профіль
// →   ↳ caused by: Error: HTTP 503
// →     ↳ caused by: TypeError: fetch failed
```

Інколи провалилось **кілька** речей: усі дзеркала CDN, усі поля форми. Для цього є **`AggregateError`** з масивом `errors`:

```js
try {
  await Promise.any([
    Promise.reject(new Error('mirror A')),
    Promise.reject(new Error('mirror B')),
  ]);
} catch (e) {
  console.log(e.name, e.errors.map((x) => x.message));
}
// → AggregateError [ 'mirror A', 'mirror B' ]
```

Створити вручну: `new AggregateError(errors, message, { cause })` — зручно для валідації, щоб зібрати всі проблеми, а не зупинитися на першій. Родич — `SuppressedError` з explicit resource management (`using`): якщо тіло блоку кинуло помилку, а `[Symbol.dispose]()` теж, він зберігає обидві в `error` і `suppressed`.

> [!quiz] Перевір себе: що загубиться?
> level: middle · id: jsd-22-quiz-05
>
> ```js
> class DbError extends Error {
>   constructor(message, cause) {
>     super(message);
>     this.cause = cause;
>   }
> }
> console.log(String(new DbError('timeout')));
> ```
>
> - [ ] `DbError: timeout`
> - [x] `Error: timeout`
> - [ ] `timeout`
>
> **Пояснення:** `name` береться з `Error.prototype`, бо його не перевизначили. `cause` тут спрацює (просто як звичайна властивість), але канонічно передавати `super(message, { cause })`.

> [!quiz] Склади власний клас помилки, що зберігає причину
> level: middle · type: order · id: jsd-22-quiz-10
>
> ```js order
> class ValidationError extends Error {
>   constructor(message, options) {
>     super(message, options)
>     this.name = 'ValidationError'
>   }
> }
>     super(message) // ✗
> ```
>
> **Пояснення:** `options` (`{ cause }`) треба передати в `super` — тоді `Error` сам запише `cause`. `super(message)` без `options` мовчки загубить причину. `this.name` потрібен, щоб `String(err)` і стек показували `ValidationError`, а не `Error`; задати його можна лише після `super`.

### ⏳ Помилки в асинхронному коді

У промісах `throw` перетворюється на **rejection**, а `await` перетворює rejection назад на `throw`. Тому в `async`-функції звичайний `try/catch` працює — але лише для того, що ти **дочекався**.

> [!viz] promise-states
> scenario: chain

```js
async function f1() {
  try { return Promise.reject(new Error('x')); }       // без await
  catch { return 'caught'; }
}
async function f2() {
  try { return await Promise.reject(new Error('x')); } // з await
  catch { return 'caught'; }
}
f1().then(console.log, (e) => console.log('rejected', e.message)); // → rejected x
f2().then(console.log, (e) => console.log('rejected', e.message)); // → caught
```

`f1` повертає проміс «як є» і виходить із `try` раніше, ніж той відхилиться. Тому всередині `try` пиши `return await`.

Ще три правила:

- **Забутий `await`/`.catch`** → «плаваючий» проміс. Його rejection нікому не потрібен → *unhandled rejection*.
- **Синхронний `throw` у функції, що «має» повертати проміс**, вилітає синхронно. `Promise.try(fn)` (ES2025) уніфікує: і `throw`, і rejection стають відхиленим промісом.
- **Callback-и без промісів** (`setTimeout`, `EventEmitter`) — помилку треба ловити **всередині** callback-а.

> [!quiz] Перевір себе: що зловить catch?
> level: middle · type: multi · id: jsd-22-quiz-06
>
> ```js
> async function run() {
>   try {
>     setTimeout(() => { throw new Error('A'); }, 0); // A
>     await Promise.reject(new Error('B'));            // B
>     fetchData(); // C: повертає відхилений проміс, без await
>   } catch (e) { console.log('caught', e.message); }
> }
> ```
>
> Які помилки **могли б** потрапити в цей `catch` (якщо прибрати інші рядки)?
>
> - [ ] A
> - [x] B
> - [ ] C
>
> **Пояснення:** A кидається в іншій задачі з іншим стеком. C — проміс без `await`, функція вже вийшла з `try`, коли він відхилився. Лише B «повертається» в `try` через `await`.

### 🌍 Глобальні обробники в браузері та Node

Останній рубіж — обробники хоста. Вони не для «лікування», а для **звітування**: залогувати й, можливо, показати користувачу «щось пішло не так».

| Подія | Браузер | Node.js |
|---|---|---|
| Неперехоплений `throw` | `window` `error` (`ErrorEvent`: `message`, `filename`, `lineno`, `error`) | `process` `'uncaughtException'` |
| Відхилений проміс без обробника | `window` `unhandledrejection` (`reason`, `promise`) | `process` `'unhandledRejection'` |
| Обробник з'явився пізніше | `rejectionhandled` | `'rejectionHandled'` |
| Поведінка за замовчуванням | лог у консоль, сторінка живе | **процес падає** (з Node 15, `--unhandled-rejections=throw`) |

```js
window.addEventListener('error', (e) => report(e.error ?? e.message));
window.addEventListener('unhandledrejection', (e) => {
  report(e.reason);
  e.preventDefault(); // прибрати дефолтний лог у консоль
}); // ↑ браузер, ↓ Node
process.on('unhandledRejection', (reason) => { log(reason); process.exitCode = 1; });
process.on('uncaughtException', (err) => { log(err); process.exit(1); });
```

Нюанси:

- **Помилки завантаження ресурсів** (`<img>`, `<script src>`) не спливають; їх видно лише як `error` на самому елементі або через `addEventListener('error', fn, true)` на `window` у фазі capture.
- **Скрипти з іншого origin** у `error` показують лише `"Script error."` без деталей — потрібні атрибут `crossorigin` і CORS-заголовки ([[JavaScript - 27. Мережа — fetch, CORS і HTTP]]).
- **Після `uncaughtException` у Node** стан процесу невизначений: документація прямо каже — залогуй, звільни ресурси й заверши процес; перезапуск — справа менеджера процесів.

> [!quiz] Перевір себе: Node і забутий проміс
> level: middle · id: jsd-22-quiz-07
>
> Що станеться в Node 25 за замовчуванням із `Promise.reject(new Error('x'))` без жодного обробника?
>
> - [ ] Нічого, лише попередження в консолі
> - [x] Процес завершиться з помилкою (код виходу 1)
> - [ ] Помилка буде проігнорована, поки не викличуть `.catch`
>
> **Пояснення:** з Node 15 режим `--unhandled-rejections=throw` за замовчуванням: необроблений rejection піднімається як неперехоплений виняток. Підписка на `'unhandledRejection'` змінює цю поведінку.

### 🛡️ Error boundaries, fail-fast і логування

Не всі помилки однакові. Корисний поділ (з практики Node):

```text
🟢 Очікувані (operational)            🔴 Баги (programmer errors)
   мережа впала, 404, невалідна форма    undefined is not a function, зламаний інваріант
   → обробити: повтор, fallback,         → не «лікувати»: fail fast, звіт,
     повідомлення користувачу              перезапуск процесу / віджета
```

**Fail-fast**: виявив неможливий стан — кидай одразу й голосно, поки баг близько до причини. **Defensive programming**: перевіряй **на межах** (дані користувача, відповіді API, конфіг), а не в кожній внутрішній функції — інакше код тоне в `if (!x) return` і баги маскуються.

**Error boundary** — місце, де помилки з цілого піддерева ловлять і перетворюють на контрольований результат. У React це компонент класу з `getDerivedStateFromError`/`componentDidCatch`: він ловить помилки **рендеру** нащадків, але не обробників подій і не асинхронного коду. Та сама ідея на бекенді — middleware, що ловить усе з обробника запиту й віддає `500` з `requestId`; у черзі задач — обгортка кожної задачі.

Логування: **логуй один раз — на межі**, а не на кожному рівні (інакше одна помилка = 5 записів). Додавай контекст (`requestId`, дію користувача), повний ланцюжок `cause`, без паролів і токенів. Мініфікований стек розшифровують **source maps**. І пам'ятай: `JSON.stringify(err)` дає `{}`, бо `message` і `stack` неперелічувані — серіалізуй явно ([[JavaScript - 23. JSON, structuredClone і серіалізація]]).

> [!quiz] Перевір себе: стратегія
> level: senior · type: multi · id: jsd-22-quiz-08
>
> Які практики правильні?
>
> - [x] Перевіряти відповідь стороннього API на вході в систему
> - [ ] Обгортати кожну внутрішню функцію в `try/catch` з `console.log`
> - [x] Після `uncaughtException` у Node залогувати й завершити процес
> - [x] Загортати низькорівневу помилку в доменну з `{ cause }`
> - [ ] Розрізняти помилки за текстом `err.message`
>
> **Пояснення:** обробка — на межах, з контекстом і причиною. Порожні або «логуючі» `catch` всюди лише ховають баги, а текст повідомлень нестабільний.

## ⚠️ Пастки

> [!pitfall] Порожній catch ковтає баги
> `catch {}` «лікує» не лише очікувану помилку, а й `TypeError` від твоєї ж опечатки.
>
> ```js
> try {
>   const cfg = JSON.parse(raw);
>   applyConfg(cfg); // опечатка → ReferenceError, теж проковтнуто
> } catch {}
> ```
>
> Лови вузько: перевір тип (`if (!(e instanceof SyntaxError)) throw e;`) і загортай у `try` лише рядок, що справді може впасти.

> [!pitfall] `return promise` у try без await
> `try { return fetchJson(); } catch { … }` не зловить rejection: функція вийшла з `try` раніше. Пиши `return await fetchJson();` — це не «зайвий await», а коректна обробка помилок.

> [!pitfall] JSON.stringify(error) → "{}"
> `message`, `stack` і `cause` — неперелічувані власні властивості, тож `JSON.stringify(new Error('x'))` дає `'{}'`. Логер, що просто стрінгіфікує об'єкт, загубить усе важливе.

## 🎤 На співбесіді

> [!interview] Як працює finally і чи може він змінити результат функції?
> level: middle · frequency: часто · id: jsd-22-int-01
>
> ---
>
> `finally` виконується завжди — після нормального завершення, `return`, `throw`, `break`/`continue`. Якщо він завершився нормально, результат `try`/`catch` зберігається; значення для `return` при цьому обчислене **до** `finally`, тож зміна змінної в ньому не вплине. Якщо ж у `finally` є свій `return`, `throw` чи `break`, він перебиває попередній результат — навіть проковтує кинуту помилку. Тому `return` у `finally` вважають антипатерном (`no-unsafe-finally`). Типове використання — звільнення ресурсів: закрити файл, зняти спінер, відпустити lock.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#🔁 try, catch і finally — точна семантика|Розділ: семантика try/finally]] · [MDN: try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) · [Spec: The try Statement](https://tc39.es/ecma262/#sec-try-statement)

> [!interview] Як обробляти помилки в async/await і що таке unhandled rejection?
> level: middle · frequency: дуже часто · id: jsd-22-int-02
>
> ---
>
> `await` перетворює rejection на `throw`, тож працює звичайний `try/catch` — але лише для того, що дочекались. Часті баги: проміс без `await` (плаваючий), `return promise` без `await` всередині `try`, `throw` у callback-у `setTimeout`. Якщо відхилений проміс не має обробника до кінця поточного microtask checkpoint-у, хост вважає його unhandled: браузер шле `unhandledrejection` на `window` і логує в консоль, Node (з v15) за замовчуванням завершує процес. Для паралельних операцій — `Promise.allSettled`, якщо треба всі результати, або `Promise.all` в `try`, якщо достатньо першої помилки.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#⏳ Помилки в асинхронному коді|Розділ: async-помилки]] · [MDN: unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event) · [javascript.info: Error handling with promises](https://javascript.info/promise-error-handling)

> [!interview] Навіщо власні класи помилок і поле cause?
> level: middle · frequency: часто · id: jsd-22-int-03
>
> ---
>
> Власні класи (`class HttpError extends Error`) дозволяють розрізняти помилки за типом (`instanceof`, `name`) і нести структуровані дані (`status`, `code`, `field`), а не парсити текст. У конструкторі — `super(message, options)` і `this.name = …`. `cause` (ES2022) — стандартний спосіб загорнути низькорівневу помилку в доменну («не вдалося зберегти профіль» ← «HTTP 503» ← «fetch failed»), не втративши оригінальний стек. Логер розгортає ланцюжок причин, а код вище оперує доменною помилкою.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#🔗 cause, власні класи й AggregateError|Розділ: cause і класи]] · [MDN: Error.cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) · [javascript.info: Custom errors](https://javascript.info/custom-errors)

> [!interview] Яку стратегію обробки помилок ти б заклав у застосунок?
> level: senior · frequency: часто · id: jsd-22-int-04
>
> ---
>
> Розділяю очікувані помилки (мережа, валідація, 404) і баги. Очікувані обробляю явно: повтор з backoff, fallback, зрозуміле повідомлення. Баги — fail fast: кидаю якомога ближче до причини, не ковтаю. Валідую на межах (ввід, відповіді API, конфіг), а не всюди. Ставлю error boundaries: на рівні сторінки/віджета в UI, middleware для HTTP-запиту, обгортку задачі в черзі. Логую один раз на межі, з контекстом, `cause`-ланцюжком і без секретів; глобальні `error`/`unhandledrejection` (браузер) і `uncaughtException`/`unhandledRejection` (Node) лише звітують, а процес після `uncaughtException` перезапускається. Стек мініфікованого коду розшифровують source maps.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#🛡️ Error boundaries, fail-fast і логування|Розділ: стратегія]] · [Node.js: Errors](https://nodejs.org/api/errors.html) · [React: error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

## 🔗 Зв'язки

- [[JavaScript - 08. Event Loop]] — чому `try` не бачить помилку з `setTimeout`: інша задача, інший стек.
- [[JavaScript - 09. Promise]] — rejection, `.catch` і комбінатори `all`/`allSettled`/`any`.
- [[JavaScript - 10. async і await]] — `await` перетворює rejection на `throw`; `return await` у `try`.
- [[JavaScript - 07. Прототипи та класи]] — `extends Error`, `super`, `new.target` і ланцюжок прототипів помилок.
- [[JavaScript - 23. JSON, structuredClone і серіалізація]] — як серіалізувати помилки для логів і `postMessage`.
- [[JavaScript - 33. Тестування JavaScript]] — `expect(fn).toThrow()`, `rejects` і тестування гілок помилок.

## ⚡ Фішки

> [!reel] 🫥 finally може проковтнути помилку
> `return` у `finally` перебиває навіть `throw` з `try`. Помилка зникає без сліду — тому лінтер це забороняє.
>
> ```js
> function f() { try { throw new Error('!'); } finally { return 'ok'; } }
> f(); // → 'ok'
> ```

> [!reel] 🧾 stack немає в специфікації JavaScript
> Усі рушії дають `err.stack`, але ECMAScript його не описує — тому формат у Chrome, Firefox і Safari різний. Стандартизувати намагаються вже кілька років.

> [!reel] 🪞 instanceof Error бреше між iframe
> Помилка з іншого realm має інший `Error.prototype`. `Error.isError(e)` (ES2026) дивиться на внутрішній слот і не помиляється.

> [!reel] 💥 Node падає від забутого промісу
> З Node 15 необроблений rejection завершує процес з кодом 1. У браузері — лише червоний рядок у консолі.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чому кидати треба `Error`, а не рядок?
> *часто · теорія* · `jsd-22-001`
>
> Лише об'єкт `Error` має `stack` (де виникла проблема), стандартні `name`/`message` і `cause`. Рядок ловиться так само, але логи без стеку марні, а код, що читає `e.message`, отримає `undefined`.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#🎯 throw кидає що завгодно, але кидай Error|Розділ: throw]] · [MDN: throw](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)

> [!question]- Які вбудовані типи помилок є в JS?
> *часто · теорія* · `jsd-22-002`
>
> `Error` і нащадки: `TypeError` (не той тип), `ReferenceError` (неоголошена змінна, TDZ), `RangeError` (число поза межами), `SyntaxError` (код або JSON), `URIError`, `EvalError` (історичний), `AggregateError` (кілька помилок), `SuppressedError` (`using`). У браузері ще `DOMException` з різними `name`.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#🧱 Об'єкт Error і вбудовані типи|Розділ: типи помилок]] · [MDN: Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

> [!question]- Чи ловить `try/catch` помилку з callback-а `setTimeout`?
> *дуже часто · код* · `jsd-22-003`
>
> Ні. `try` охоплює лише синхронний код свого блоку. Callback виконується пізніше, в окремій задачі з новим стеком, коли `try` вже завершився. Ловити треба всередині callback-а або через проміси й `await`.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#⏳ Помилки в асинхронному коді|Розділ: async-помилки]] · [javascript.info: try...catch](https://javascript.info/try-catch)

### 🟡 Middle

> [!question]- Як правильно написати власний клас помилки?
> *часто · код* · `jsd-22-004`
>
> ```js
> class HttpError extends Error {
>   constructor(status, message, options) {
>     super(message, options); // передає cause
>     this.name = 'HttpError';
>     this.status = status;
>   }
> }
> ```
>
> `super(message, options)` встановлює `message` і `cause`, `name` — для гарного стеку й `String(err)`. Стек захоплюється автоматично.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#🔗 cause, власні класи й AggregateError|Розділ: власні класи]] · [javascript.info: Custom errors](https://javascript.info/custom-errors)

> [!question]- Що таке `AggregateError` і де він виникає?
> *іноді · теорія* · `jsd-22-005`
>
> Помилка-контейнер з масивом `errors`. Її кидає `Promise.any`, коли всі проміси відхилено; можна створити вручну (`new AggregateError(list, msg)`) — наприклад, щоб повернути всі помилки валідації разом.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#🔗 cause, власні класи й AggregateError|Розділ: AggregateError]] · [MDN: AggregateError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

### 🔴 Senior

> [!question]- Чим `Error.isError` кращий за `instanceof Error`?
> *рідко · порівняння* · `jsd-22-006`
>
> `instanceof` перевіряє ланцюжок прототипів, тому падає для помилок з іншого realm (iframe, `vm`) і обманюється `Object.create(Error.prototype)`. `Error.isError` (ES2026) перевіряє внутрішній слот `[[ErrorData]]`, який мають лише справжні помилки.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#🎯 throw кидає що завгодно, але кидай Error|Розділ: нормалізація]] · [MDN: Error.isError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/isError)

> [!question]- Що робити в `process.on('uncaughtException')`?
> *іноді · практика* · `jsd-22-007`
>
> Лише звітувати й завершувати: залогувати помилку синхронно, звільнити критичні ресурси, `process.exit(1)`. Стан процесу після неперехопленого винятку невизначений — продовжувати роботу небезпечно; перезапуск робить менеджер процесів (systemd, Kubernetes, pm2).
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#🌍 Глобальні обробники в браузері та Node|Розділ: глобальні обробники]] · [Node.js: process events](https://nodejs.org/api/process.html#event-uncaughtexception)

> [!question]- Що таке error boundary і що він НЕ ловить у React?
> *часто · теорія* · `jsd-22-008`
>
> Компонент-межа, що ловить помилки рендеру нащадків і показує fallback замість падіння всього дерева. Не ловить помилки в обробниках подій, асинхронному коді (`setTimeout`, проміси), SSR і в самому собі — їх обробляють `try/catch` і глобальні обробники.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#🛡️ Error boundaries, fail-fast і логування|Розділ: boundaries]] · [React: error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

> [!question]- Навіщо `Error.captureStackTrace`, якщо `extends Error` і так має стек?
> *рідко · теорія* · `jsd-22-009`
>
> Щоб додати `stack` довільному об'єкту або сховати службові кадри: `Error.captureStackTrace(obj, fn)` обрізає стек вище за `fn`, тож фабрика помилок чи assert-хелпер не засмічує трасу. Це V8-API, яке нині підтримують і Firefox та Safari.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка#🔗 cause, власні класи й AggregateError|Розділ: стек]] · [V8: Stack trace API](https://v8.dev/docs/stack-trace-api)

## 🛠️ Практика

> [!task] Поясни своїми словами: чому try не ловить помилку з setTimeout
> level: junior · difficulty: easy · id: jsd-22-task-01 · tags: feynman, errors, event-loop
>
> Поясни колезі-початківцю, чому `catch` тут ніколи не спрацює і як це виправити. До 5 речень, з однією аналогією.
>
> ```js
> try {
>   setTimeout(() => { throw new Error('later'); }, 100);
> } catch (e) {
>   console.log('caught', e);
> }
> ```
>
> > [!hint]- Підказка 1
> > Що відбувається зі стеком і з блоком `try` після виклику `setTimeout`?
>
> > [!hint]- Підказка 2
> > Сигнал тривоги біжить «вгору по поверхах» — а які поверхи є в стеку, коли callback стартує?
>
> > [!solution]- Еталонне пояснення
> > `setTimeout` лише просить браузер викликати функцію пізніше й одразу повертається — `try` завершується, не побачивши жодної помилки. Через 100 мс callback стартує в **новій** задачі з порожнім стеком, де вже немає нашого `try`. Помилка «біжить угору», не знаходить жодного `catch` і йде до глобального обробника. Це як залишити записку «якщо задзвонить телефон — відповім», а потім піти додому: дзвінок прийде, коли тебе вже нема. Виправлення — ловити всередині callback-а або загорнути таймер у проміс і `await`-ити його в `try`.

> [!task] retry з AggregateError
> level: middle · difficulty: medium · id: jsd-22-task-02 · tags: errors, async, promises
>
> Напиши `retry(fn, { retries = 3, delayMs = 100 })`: викликає асинхронну `fn` до `retries` разів із паузою між спробами. Повертає перший успішний результат. Якщо всі спроби провалились — кидає `AggregateError` з помилками всіх спроб і повідомленням `"Усі N спроб провалились"`. Синхронний `throw` усередині `fn` теж має вважатися провальною спробою.
>
> ```js starter
> async function retry(fn, { retries = 3, delayMs = 100 } = {}) {
>   const errors = []
>   // твій код
> }
> ```
>
> ```js tests
> const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve() }
>
> test('повертає перший успішний результат', async () => {
>   let n = 0
>   const fn = vi.fn(async () => { if (++n < 2) throw new Error(`fail ${n}`); return 'ok' })
>   await expect(retry(fn, { retries: 3, delayMs: 5 })).resolves.toBe('ok')
>   expect(fn).toHaveBeenCalledTimes(2)
> })
>
> test('усі спроби провалились — AggregateError з усіма помилками', async () => {
>   let n = 0
>   const fn = async () => { throw new Error(`fail ${++n}`) }
>   const err = await retry(fn, { retries: 3, delayMs: 5 }).catch((e) => e)
>   expect(err).toBeInstanceOf(AggregateError)
>   expect(err.message).toBe('Усі 3 спроб провалились')
>   expect(err.errors.map((e) => e.message)).toEqual(['fail 1', 'fail 2', 'fail 3'])
> })
>
> test('синхронний throw — теж провальна спроба', async () => {
>   const fn = vi.fn(() => { throw new TypeError('sync') })
>   await expect(retry(fn, { retries: 2, delayMs: 1 })).rejects.toThrow('Усі 2 спроб провалились')
>   expect(fn).toHaveBeenCalledTimes(2)
> })
>
> test('чекає delayMs між спробами, але не після останньої', async () => {
>   vi.useFakeTimers()
>   const fn = vi.fn(async () => { throw new Error('x') })
>   const p = retry(fn, { retries: 2, delayMs: 1000 }).catch((e) => e)
>   await flush()
>   expect(fn).toHaveBeenCalledTimes(1)
>   vi.advanceTimersByTime(999)
>   await flush()
>   expect(fn).toHaveBeenCalledTimes(1)
>   vi.advanceTimersByTime(1)
>   await flush()
>   expect(fn).toHaveBeenCalledTimes(2)
>   expect(await p).toBeInstanceOf(AggregateError)
>   expect(vi.getTimerCount()).toBe(0)
> })
> ```
>
> > [!hint]- Підказка 1
> > `Promise.try(fn)` або `await fn()` усередині `try` вирівнюють синхронні й асинхронні помилки.
>
> > [!hint]- Підказка 2
> > Збирай помилки в масив; пауза — `new Promise((r) => setTimeout(r, delayMs))`, але не після останньої спроби.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
> >
> > async function retry(fn, { retries = 3, delayMs = 100 } = {}) {
> >   const errors = [];
> >   for (let attempt = 1; attempt <= retries; attempt++) {
> >     try {
> >       return await fn(attempt); // await обов'язковий — інакше catch не спрацює
> >     } catch (err) {
> >       errors.push(err);
> >       if (attempt < retries) await sleep(delayMs);
> >     }
> >   }
> >   throw new AggregateError(errors, `Усі ${retries} спроб провалились`);
> > }
> > ```
> >
> > У продакшні додають експоненційний backoff з jitter (`delayMs * 2 ** attempt * Math.random()`) і `AbortSignal` для скасування.

> [!task] serializeError для логів
> level: senior · difficulty: hard · id: jsd-22-task-03 · tags: errors, serialization, logging
>
> Напиши `serializeError(value)`, що перетворює будь-яке кинуте значення на plain-об'єкт, придатний для `JSON.stringify`:
> - для `Error` — `name`, `message`, `stack`, усі власні перелічувані поля (`status`, `code`…);
> - рекурсивно `cause` і `errors` (для `AggregateError`);
> - не-помилки — `{ name: 'NonError', message: String(value) }`;
> - **цикли** (`a.cause = b; b.cause = a`) не повинні зациклювати функцію.
>
> ```js starter
> function serializeError(value, seen = new WeakSet()) {
>   // твій код
> }
> ```
>
> ```js tests
> test('копіює name, message, stack і власні поля', () => {
>   const err = new RangeError('bad')
>   err.status = 404
>   const out = serializeError(err)
>   expect(out.name).toBe('RangeError')
>   expect(out.message).toBe('bad')
>   expect(typeof out.stack).toBe('string')
>   expect(out.status).toBe(404)
> })
>
> test('рекурсивно серіалізує cause', () => {
>   const out = serializeError(new Error('top', { cause: new TypeError('low') }))
>   expect(out.cause.name).toBe('TypeError')
>   expect(out.cause.message).toBe('low')
> })
>
> test('AggregateError — масив errors', () => {
>   const out = serializeError(new AggregateError([new Error('a'), 'b'], 'all'))
>   expect(out.errors.map((e) => e.message)).toEqual(['a', 'b'])
>   expect(out.errors[1].name).toBe('NonError')
> })
>
> test('не-помилки стають NonError', () => {
>   expect(serializeError('oops')).toEqual({ name: 'NonError', message: 'oops' })
>   expect(serializeError(42)).toEqual({ name: 'NonError', message: '42' })
> })
>
> test('цикли не зациклюють функцію, результат придатний для JSON', () => {
>   const a = new Error('A')
>   const b = new Error('B', { cause: a })
>   a.cause = b
>   const out = serializeError(b)
>   expect(out.cause.cause).toBe('[Circular]')
>   expect(() => JSON.stringify(out)).not.toThrow()
> })
> ```
>
> > [!hint]- Підказка 1
> > `message`/`stack`/`cause` неперелічувані — копіюй їх явно, а потім `Object.entries(err)` для решти.
>
> > [!hint]- Підказка 2
> > Для циклів передавай `WeakSet` відвіданих помилок; повторну зустріч заміни на `'[Circular]'`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function serializeError(value, seen = new WeakSet()) {
> >   if (!Error.isError(value)) {
> >     return { name: 'NonError', message: String(value) };
> >   }
> >   if (seen.has(value)) return '[Circular]';
> >   seen.add(value);
> >
> >   const out = { name: value.name, message: value.message, stack: value.stack };
> >   for (const [key, v] of Object.entries(value)) {
> >     if (!(key in out)) out[key] = v;
> >   }
> >   if (value.cause !== undefined) {
> >     out.cause = Error.isError(value.cause) ? serializeError(value.cause, seen) : value.cause;
> >   }
> >   if (Array.isArray(value.errors)) {
> >     out.errors = value.errors.map((e) => serializeError(e, seen));
> >   }
> >   return out;
> > }
> >
> > const a = new Error('A');
> > const b = new Error('B', { cause: a });
> > a.cause = b; // цикл
> > console.log(JSON.stringify(serializeError(b), ['name', 'message', 'cause']));
> > // → {"name":"Error","message":"B","cause":{"name":"Error","message":"A","cause":"[Circular]"}}
> > ```

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Error handling, "try...catch"](https://javascript.info/try-catch) — базова механіка з прикладами й `finally`.
- 🟢 [javascript.info — Custom errors, extending Error](https://javascript.info/custom-errors) — ієрархії помилок і обгортання.
- 🟡 [MDN — Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) — усі типи, `cause`, `stack`, сумісність.
- 🟡 [MDN — Window: unhandledrejection event](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event) — глобальна обробка відхилених промісів у браузері.
- 🟡 [Node.js — Errors](https://nodejs.org/api/errors.html) — системні помилки, `code`, `Error.captureStackTrace`, `stackTraceLimit`.
- 🟡 [V8 — Stack trace API](https://v8.dev/docs/stack-trace-api) — як V8 збирає й форматує стек.
- 🔴 [ECMAScript — The try Statement](https://tc39.es/ecma262/#sec-try-statement) — completion records і правила `finally`.
- 🔴 [HTML Standard — Unhandled promise rejections](https://html.spec.whatwg.org/multipage/webappapis.html#unhandled-promise-rejections) — коли саме браузер вважає rejection необробленим.

> [!important] Підсумок
> - Кидай лише `Error` і нащадків: тільки вони мають `stack`; розрізняй помилки за класом, `name` чи `code`, а не за текстом.
> - `finally` виконується завжди; `return`/`throw` у ньому перебиває результат і може проковтнути помилку.
> - Загортай низькорівневі помилки в доменні через `{ cause }`; `AggregateError` — для кількох помилок разом.
> - `try` ловить лише синхронне й те, що ти `await`-нув: `return await` у `try`, жодних плаваючих промісів.
> - Глобальні обробники лише звітують; очікувані помилки обробляй явно, баги — fail fast, логуй один раз на межі.
