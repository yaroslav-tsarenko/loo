---
title: Патерни проєктування
order: 32
level: middle
tags: [patterns, architecture, observer, strategy, command, decorator, middleware, state-machine, solid]
prerequisites:
  - "[[JavaScript - 05. Замикання]]"
  - "[[JavaScript - 07. Прототипи та класи]]"
  - "[[JavaScript - 21. Модулі — ESM, CommonJS і бандлери]]"
estimatedMinutes: 55
id: jsd-ch-32
icon: "🧭"
---

# JavaScript - 32. Патерни проєктування

> [!success] 🎯 Після цього розділу ти зможеш
> - Пояснити, чому більшість класичних GoF-патернів у JS зводяться до функцій, замикань і модулів.
> - Реалізувати ідіоматично: module, factory, observer/EventEmitter, strategy, command з undo/redo, decorator, adapter, facade, proxy.
> - Аргументувати, чому singleton часто антипатерн, і замінити його на dependency injection.
> - Написати middleware-ланцюжок у стилі Koa і скінченний автомат, що робить неможливі стани неможливими.
> - Застосувати SOLID до JS-коду без «Java у JavaScript».

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-32-quiz-01
>
> ```js
> // counter.js
> let count = 0;
> export const inc = () => ++count;
>
> // a.js
> import { inc } from './counter.js';
> inc();
>
> // main.js
> import './a.js';
> import { inc } from './counter.js';
> console.log(inc());
> ```
>
> **Відповідь:** `2`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. ES-модуль виконується **один раз** на весь застосунок, і всі імпортери отримують ті самі зв'язки. Модуль — це вже готовий singleton, без класів і `getInstance()` ([[JavaScript - 21. Модулі — ESM, CommonJS і бандлери]]).

## 🧒 Простими словами

Патерни — це **рецепти**, а не готові страви. Кухар не винаходить заново омлет: він знає «збити, посолити, на сковорідку» і пристосовує до своїх продуктів. У книжці 1994 року (GoF) рецепти писали для мов, де не було функцій-значень — тому там «стратегія» — це інтерфейс, два класи і фабрика. У JS функцію можна просто покласти в змінну, тож той самий рецепт — **одна стрічка**. Гарний JS-розробник знає назви рецептів (щоб говорити з командою), але готує з того, що є на кухні JS: функцій, замикань, модулів і об'єктів.

## 🔬 Як це працює насправді

### Навіщо патерни в JS і чому не як у Java

Патерн — це **іменоване рішення типової проблеми**. Його цінність — спільна мова («тут observer», «зроби адаптер») і перевірені компроміси. Але реалізація залежить від мови. У JS є функції першого класу, замикання, модулі, динамічні об'єкти, `Proxy` і протоколи ітерації — і половина GoF-патернів «розчиняється»:

| GoF-патерн | Java-стиль | JS-ідіома |
|---|---|---|
| Strategy | інтерфейс + класи-стратегії | функція або об'єкт-мапа функцій |
| Command | клас `Command` з `execute()` | замикання або `{ execute, undo }` |
| Factory | клас-фабрика | функція, що повертає об'єкт |
| Singleton | приватний конструктор + `getInstance()` | експорт з модуля |
| Iterator | клас з `hasNext()/next()` | `Symbol.iterator`, генератори ([[JavaScript - 11. Ітератори та генератори]]) |
| Observer | інтерфейси `Subject`/`Observer` | `EventTarget`, `EventEmitter`, callback-и |
| Decorator | клас-обгортка з тим самим інтерфейсом | функція вищого порядку |
| Proxy | клас-заступник | вбудований `Proxy` ([[JavaScript - 20. Symbol, Proxy і Reflect]]) |
| Template method | абстрактний клас + перевизначення | функція, що приймає callback-и |

Правило: **почни з функції**. Клас — коли потрібні багато екземплярів зі спільною поведінкою, `instanceof` чи успадкування від платформних класів.

> [!quiz] Перевір себе: JS-ідіоми
> level: junior · type: multi · id: jsd-32-quiz-02
>
> Що є ідіоматичною JS-реалізацією патерну **Strategy**?
>
> - [x] `const pricing = { regular: (p) => p, vip: (p) => p * 0.9 }; pricing[user.tier](price)`
> - [ ] Абстрактний клас `PricingStrategy` і по класу-нащадку на кожен тариф, створюваних через `PricingStrategyFactory`
> - [x] Передати функцію-компаратор у `arr.toSorted(compare)`
> - [ ] `switch (user.tier)` на 200 рядків у кожному місці, де потрібна ціна
>
> **Пояснення:** стратегія — «взаємозамінний алгоритм, обраний під час виконання». У JS це просто функція-значення. `toSorted(compare)` — стратегія порівняння, вбудована в мову. Ієрархія класів працює, але це церемонія без вигоди.

### Module, factory і singleton

**Module** — інкапсуляція: приватне всередині, публічне — через експорт. Історично — IIFE із замиканням, сьогодні — ESM-файл. **Factory** — функція, що створює й повертає об'єкт, ховаючи деталі (приватний стан у замиканні — [[JavaScript - 05. Замикання]]):

```js
function createCounter({ start = 0, step = 1 } = {}) {
  let value = start;                      // приватне — ззовні не дістати
  return {
    inc: () => (value += step),
    get value() { return value; },
  };
}
const c = createCounter({ step: 5 });
c.inc();
console.log(c.value); // → 5
```

> [!viz] scope-chain
> scenario: closure-counter

**Singleton** — «рівно один екземпляр на застосунок». У JS це просто модуль: `export const config = loadConfig()` виконається один раз. Але **глобальний** singleton часто стає антипатерном:

- 🕸️ **приховані залежності** — функція «таємно» лізе в `db` чи `store`, і з сигнатури цього не видно;
- 🧪 **тести заважають одне одному** — стан переживає тест, порядок запуску починає мати значення;
- 🔒 **неможливо мати два** — два tenant-и, два з'єднання, ізольований екземпляр для SSR-запиту;
- ⏱️ **порядок ініціалізації** — модуль створює з'єднання під час імпорту, ще до того, як завантажено конфіг.

Рішення — створити екземпляр **один раз у точці збирання** (composition root, `main.js`) і **передати** його тим, кому треба. Один екземпляр лишається, а прихована глобальна залежність — ні.

> [!quiz] Перевір себе: singleton
> level: middle · type: multi · id: jsd-32-quiz-03
>
> Які проблеми типові для модуля `export const db = new Database(process.env.DB_URL)`?
>
> - [x] З'єднання створюється під час імпорту — навіть у тестах, яким база не потрібна
> - [x] У тестах складно підмінити `db` без моків модульної системи
> - [ ] `new Database` виконається при кожному `import`
> - [x] Неможливо мати два різні з'єднання (наприклад, read-replica) без переписування
>
> **Пояснення:** модуль виконується один раз, тож екземпляр справді один — але це й проблема: побічний ефект при імпорті й жорстка прив'язка. Краще `export function createDb(url)` і створення в composition root.

### Observer, pub/sub і EventEmitter

**Observer**: об'єкт (subject) тримає список підписників і сповіщає їх про зміни. **Pub/sub** додає посередника — канал або брокер: видавець і підписник не знають один про одного. У платформі вже є `EventTarget` (DOM, а також Node) і `EventEmitter` у Node. Мінімальний емітер, що повертає функцію відписки:

```js
function createEmitter() {
  const listeners = new Map();                       // event → Set<fn>
  const off = (event, fn) => listeners.get(event)?.delete(fn);
  return {
    on(event, fn) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(fn);
      return () => off(event, fn);                   // зручна відписка
    },
    once(event, fn) {
      const unsubscribe = this.on(event, (...args) => { unsubscribe(); fn(...args); });
      return unsubscribe;
    },
    off,
    emit(event, ...args) {
      for (const fn of [...(listeners.get(event) ?? [])]) fn(...args); // копія: відписка під час emit безпечна
    },
  };
}
```

> [!diagram] Observer проти pub/sub
> ```yaml
> layout: compare
> columns: { obs: "Observer", pub: "Pub/sub" }
> nodes:
>   - { id: os, col: obs, label: Subject, text: "order", note: "сам тримає список підписників", tone: violet }
>   - { id: oo, col: obs, label: підписники, text: "Observer A · Observer B", tone: green }
>   - { id: pp, col: pub, label: Publisher, text: "оплата", note: "не знає, хто слухає", tone: blue }
>   - { id: pc, col: pub, label: канал, text: "\"order:paid\"", tone: violet, icon: "px:envelope" }
>   - { id: ps, col: pub, label: Subscribers, text: "пошта · склад · аналітика", note: "не знають, хто надіслав", tone: green }
> edges:
>   - { from: os, to: oo, label: notify }
>   - { from: pp, to: pc, label: publish }
>   - { from: pc, to: ps, label: deliver }
> steps:
>   - { focus: os, note: "Observer: subject сам зберігає список підписників і знає кожного з них." }
>   - { move: { from: os, to: oo, value: "notify(order)" }, note: "Змінився стан — subject напряму викликає кожного підписника." }
>   - { move: { from: pp, to: pc, value: "emit('order:paid')" }, note: "Pub/sub: видавець кидає подію в канал і не знає, хто її отримає. Саме так працює createEmitter вище." }
>   - { move: { from: pc, to: ps, value: "order" }, note: "Канал роздає подію всім, хто підписався через on('order:paid'). Видавець і підписники одне про одного не знають." }
>   - { focus: [os, pc], note: "Ціна слабкого зв'язку — неявний потік керування і витоки через забуті підписки. Тому on() повертає unsubscribe." }
> ```

Ціна слабкого зв'язку — **неявний потік керування** (важко відстежити, хто реагує на подію) і **витоки** через забуті підписки ([[JavaScript - 13. Пам'ять і збирач сміття]]). Повертай `unsubscribe` і викликай його в cleanup.

> [!quiz] Перевір себе: once і відписка
> level: middle · type: output · id: jsd-32-quiz-04
>
> ```js
> const bus = createEmitter();
> bus.on('msg', (m) => console.log('A', m));
> bus.once('msg', (m) => console.log('B', m));
> const stop = bus.on('msg', (m) => console.log('C', m));
> bus.emit('msg', 1);
> stop();
> bus.emit('msg', 2);
> ```
>
> **Відповідь:** `A 1` `B 1` `C 1` `A 2`
>
> **Пояснення:** при першому `emit` спрацьовують усі три (у порядку підписки), `once` відписується сам. Потім `stop()` знімає `C`, тож на другий `emit` реагує лише `A`.

### Strategy, command і undo

**Strategy** — взаємозамінні алгоритми за спільним контрактом. Об'єкт-мапа замість `switch` — легко додати новий варіант, не чіпаючи решту (Open/Closed):

```js
const validators = {
  required: (v) => v !== '' || 'Обов\'язкове поле',
  min: (n) => (v) => v.length >= n || `Мінімум ${n} символів`,
};
const rules = [validators.required, validators.min(8)];
const errors = rules.map((rule) => rule('abc')).filter((r) => r !== true);
console.log(errors); // → [ 'Мінімум 8 символів' ]
```

**Command** — дія як об'єкт: її можна зберегти, поставити в чергу, повторити, **скасувати**. Класичне застосування — undo/redo:

```js
function createEditor() {
  let text = '';
  const done = [];
  const undone = [];
  const run = (cmd) => { cmd.execute(); done.push(cmd); undone.length = 0; }; // нова дія чистить redo
  return {
    get text() { return text; },
    type(s) {
      run({ execute: () => { text += s; }, undo: () => { text = text.slice(0, -s.length); } });
    },
    undo() { const c = done.pop(); if (c) { c.undo(); undone.push(c); } },
    redo() { const c = undone.pop(); if (c) { c.execute(); done.push(c); } },
  };
}
```

> [!quiz] Перевір себе: undo/redo
> level: middle · type: output · id: jsd-32-quiz-05
>
> ```js
> const ed = createEditor();
> ed.type('Hello');
> ed.type(', world');
> ed.undo();
> ed.type('!');
> ed.redo();
> console.log(ed.text);
> ```
>
> **Відповідь:** `Hello!`
>
> **Пояснення:** `undo` скасовує `, world` і кладе його в стек redo. Нова дія `type('!')` очищує redo — тож `redo()` нічого не повертає. Саме так поводяться редактори: після нової правки «майбутнє» зникає.

### Decorator, adapter, facade, proxy

Чотири «обгортки», що відрізняються **метою**:

| Патерн | Мета | JS-ідіома |
|---|---|---|
| Decorator | **додати** поведінку, зберігши інтерфейс | функція вищого порядку |
| Adapter | **змінити** інтерфейс на очікуваний | функція/об'єкт-перекладач |
| Facade | **спростити** складну підсистему | модуль з кількома простими функціями |
| Proxy | **контролювати доступ** до об'єкта | `new Proxy(target, handler)` |

```js
// Decorator: логування + час виконання для будь-якої async-функції
const withTiming = (fn, label = fn.name) => async function (...args) {
  const t = performance.now();
  try { return await fn.apply(this, args); }
  finally { console.log(`${label}: ${(performance.now() - t).toFixed(1)} ms`); }
};
const loadUser = withTiming(async (id) => ({ id }), 'loadUser');

// Adapter: callback → проміс — util.promisify(fs.readFile); Proxy: new Proxy(obj, { set: validate })
```

`debounce`, `throttle`, `memoize`, `retry` з [[JavaScript - 14. Debounce, throttle та async-патерни]] — усе це декоратори функцій. Синтаксис `@decorator` для класів — окрема пропозиція TC39 (на жовтень 2026 — Stage 2.7, [[JavaScript - 34. Сучасний JS і TC39]]); TypeScript 5+ уже його підтримує.

> [!quiz] Перевір себе: яка обгортка?
> level: middle · id: jsd-32-quiz-06
>
> Ти загортаєш десяток REST-викликів, кешування, повтори й авторизацію в модуль з методами `getProfile()`, `updateAvatar(file)` для решти команди. Який це патерн?
>
> - [ ] Decorator
> - [ ] Adapter
> - [x] Facade
> - [ ] Proxy
>
> **Пояснення:** мета — **спростити** складну підсистему єдиною зручною точкою входу. Декоратор зберігав би той самий інтерфейс, адаптер — перекладав би один інтерфейс в інший, проксі — контролював би доступ до одного об'єкта.

### Dependency injection і middleware

**Dependency injection** — функція/клас **отримує** залежності ззовні замість того, щоб імпортувати й створювати їх сама. Контейнер не обов'язковий — достатньо параметрів:

```js
// ❌ import { db } from './db.js' усередині сервісу: як протестувати без реальної бази й пошти?

// ✅ залежності — параметри; створюються один раз у composition root
export function createUserService({ db, mailer, now = () => new Date() }) {
  return {
    async register(data) {
      const user = await db.insert('users', { ...data, createdAt: now() });
      await mailer.send(user.email, 'Ласкаво просимо!');
      return user;
    },
  };
}
// main.js:  const users = createUserService({ db: createDb(env.DB_URL), mailer: createMailer(env.SMTP) });
// test:     const users = createUserService({ db: fakeDb, mailer: { send: vi.fn() }, now: () => FIXED });
```

**Middleware** — ланцюжок обробників, кожен з яких може щось зробити **до** і **після** наступного (`next`). Так влаштовані Express, Koa, Redux middleware, перехоплювачі fetch-клієнтів. У Koa це «цибуля»:

> [!diagram] Middleware «цибуля»: до і після next()
> ```yaml
> layout: nest
> nodes:
>   - { id: logger, label: logger, code: "// до: запам'ятати час\nawait next()\n// після: записати тривалість", tone: blue }
>   - { id: auth, label: auth, code: "// до: перевірити токен\nawait next()\n// після: додати заголовки", parent: logger, tone: violet }
>   - { id: handler, label: "handler — ядро", text: "чекає запит", parent: auth, tone: green }
> steps:
>   - { line: "logger:1", note: "Запит заходить у зовнішній шар. logger робить свою частину «до» і викликає next()." }
>   - { line: ["logger:2", "auth:1"], move: { from: logger, to: auth, value: "next()" }, note: "next() передає керування в наступний шар — auth перевіряє токен." }
>   - { line: "auth:2", move: { from: auth, to: handler, value: "next()" }, set: { handler: "ctx.body = відповідь ✓" }, note: "auth пропускає далі — до ядра. handler формує відповідь." }
>   - { line: "auth:3", note: "Ядро завершилось — await next() в auth повертається, і виконується його код «після»." }
>   - { line: "logger:3", note: "Останнім виконується «після» зовнішнього шару: logger записує тривалість усього запиту. Порядок: до-до-ядро-після-після." }
> ```

```js
function compose(middlewares) {
  return (ctx) => {
    const dispatch = (i) => {
      const fn = middlewares[i];
      if (!fn) return Promise.resolve();
      return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
    };
    return dispatch(0);
  };
}
```

> [!quiz] Перевір себе: порядок «цибулі»
> level: middle · type: output · id: jsd-32-quiz-07
>
> ```js
> const log = [];
> const app = compose([
>   async (ctx, next) => { log.push('1>'); await next(); log.push('<1'); },
>   async (ctx, next) => { log.push('2>'); await next(); log.push('<2'); },
>   async (ctx) => { log.push('handler'); },
> ]);
> await app({});
> console.log(log.join(' '));
> ```
>
> **Відповідь:** `1> 2> handler <2 <1`
>
> **Пояснення:** кожен middleware «загортає» наступні: код до `await next()` іде вглиб, код після — на виході у зворотному порядку. Тому logger першим бачить запит і останнім — готову відповідь (зручно для заміру часу).

> [!quiz] Склади мінімальний `compose` у стилі Koa
> level: middle · type: order · id: jsd-32-quiz-10
>
> ```js order
> function compose(middlewares) {
>   return (ctx) => {
>     const dispatch = (i) => {
>       const fn = middlewares[i]
>       if (!fn) return Promise.resolve()
>       return Promise.resolve(fn(ctx, () => dispatch(i + 1)))
>     }
>     return dispatch(0)
>   }
> }
>       return Promise.resolve(fn(ctx, dispatch(i + 1))) // ✗
> ```
>
> **Пояснення:** `next` — це **функція** `() => dispatch(i + 1)`: middleware сам вирішує, коли (і чи) йти вглиб. Якщо передати `dispatch(i + 1)` без обгортки, наступний шар виконається одразу, ще до коду «до `next()`» — цибуля зламається.

### State machine — скінченний автомат

Прапорці `isLoading`, `isError`, `isSuccess` дають 8 комбінацій, з яких валідні 3–4. Баги на кшталт «спінер і помилка одночасно» — це **неможливі стани, які стали можливими**. Скінченний автомат явно перелічує стани й дозволені переходи:

```js
const machine = {
  idle:    { FETCH: 'loading' },
  loading: { RESOLVE: 'success', REJECT: 'failure', CANCEL: 'idle' },
  success: { FETCH: 'loading' },
  failure: { RETRY: 'loading' },
};
const transition = (state, event) => machine[state]?.[event] ?? state; // недозволена подія ігнорується
```

| Стан | FETCH | RESOLVE | REJECT | RETRY |
|---|---|---|---|---|
| `idle` | → loading | — | — | — |
| `loading` | — | → success | → failure | — |
| `success` | → loading | — | — | — |
| `failure` | — | — | — | → loading |

Переваги: подвійний клік «Завантажити» в стані `loading` нічого не зламає; таблицю можна показати дизайнеру; тести перевіряють переходи, а не UI. Для складних випадків (вкладені й паралельні стани, таймери) — статечарти й бібліотека XState.

> [!quiz] Перевір себе: автомат
> level: middle · type: output · id: jsd-32-quiz-08
>
> ```js
> let s = 'idle';
> for (const e of ['RESOLVE', 'FETCH', 'FETCH', 'REJECT', 'RESOLVE', 'RETRY']) s = transition(s, e);
> console.log(s);
> ```
>
> **Відповідь:** `loading`
>
> **Пояснення:** `RESOLVE` в `idle` ігнорується; `FETCH` → `loading`; другий `FETCH` у `loading` ігнорується; `REJECT` → `failure`; `RESOLVE` у `failure` ігнорується; `RETRY` → `loading`. Жодна «зайва» подія не перевела автомат у неможливий стан.

> [!quiz] Заповни пропуски: перехід скінченного автомата
> level: junior · type: fill · id: jsd-32-quiz-11 · bank: ||, event, RESOLVE
>
> ```js fill
> const machine = {
>   idle: { FETCH: 'loading' },
>   loading: { RESOLVE: 'success', REJECT: 'failure' },
>   failure: { RETRY: 'loading' },
> }
> function transition(state, event) {
>   const row = machine[state]
>   return row?.[event] [[??]] [[state]]
> }
> transition('idle', '[[FETCH]]') // → 'loading'
> ```
>
> **Пояснення:** дозволений перехід береться з таблиці, а недозволена подія повертає поточний стан — автомат її ігнорує. `?.` захищає від невідомого стану.

### SOLID по-JS-ному

| Принцип | Класичне формулювання | У JS це означає |
|---|---|---|
| **S** — Single Responsibility | у класу одна причина змінюватись | маленькі модулі й функції; парсинг, валідація і запис — окремо |
| **O** — Open/Closed | відкритий для розширення, закритий для змін | мапа стратегій, плагіни, middleware замість росту `switch` |
| **L** — Liskov Substitution | підтип замінює базовий тип | будь-який об'єкт з потрібною формою (duck typing) поводиться очікувано: не кидає там, де «база» не кидає |
| **I** — Interface Segregation | вузькі інтерфейси | функція просить `{ send }`, а не весь `mailer` з 20 методами — легко підмінити |
| **D** — Dependency Inversion | залежати від абстракцій | DI через параметри; модулі верхнього рівня не імпортують конкретну базу |

SOLID — не закони, а **евристики проти болю змін**. Переборщити теж можна: три абстракції для функції на 10 рядків — це не «чиста архітектура», а лабіринт. Правило трьох: абстрагуй, коли бачиш третій схожий випадок.

> [!quiz] Перевір себе: SOLID
> level: senior · type: multi · id: jsd-32-quiz-09
>
> - [x] Додати новий спосіб оплати як ще один запис у мапі стратегій, не змінюючи існуючі — це Open/Closed
> - [ ] Liskov Substitution у JS неможливий, бо немає інтерфейсів
> - [x] Функція `notify({ send })` замість `notify(mailer)` спрощує тести — це Interface Segregation
> - [x] Передавати `db` у `createUserService({ db })` замість `import { db }` — це Dependency Inversion
>
> **Пояснення:** у JS «інтерфейс» — це очікувана форма об'єкта (duck typing), тож LSP працює: замінник має поводитися так само, як оригінал, а не просто мати методи з тими ж іменами.

## ⚠️ Пастки

> [!pitfall] Java у JavaScript
> `AbstractUserRepositoryFactoryProvider` з трьома рівнями наслідування там, де вистачило б функції. Кожна абстракція має **ціну** — непрямий виклик, ще один файл, ще одне ім'я. Почни з найпростішого, рефактор — коли біль справжній.

> [!pitfall] Забута відписка
> Observer тримає посилання на підписника. Компонент знищено, а його обробник досі в `Set` емітера — витік пам'яті та «примарні» оновлення.
>
> ```js
> useEffect(() => bus.on('cart:update', setCart), []);        // ✅ on повертає unsubscribe → cleanup
> useEffect(() => { bus.on('cart:update', setCart); }, []);   // ❌ без cleanup
> ```

> [!pitfall] Подія як прихований виклик функції
> `bus.emit('save')`, на який підписаний рівно один обробник, що має повернути результат, — це виклик функції, загримований під подію: потік не видно, помилки губляться, типи не перевіряються. Pub/sub — для «повідомити всіх, кому цікаво», а не для «зроби мені й поверни».

## 🎤 На співбесіді

> [!interview] Чому singleton часто вважають антипатерном і що використати натомість?
> level: middle · frequency: часто · id: jsd-32-int-01
>
> ---
>
> Singleton — глобальний стан під іншим іменем: він ховає залежності (сигнатура функції не каже, що вона лізе в базу), заважає тестам (стан переживає тест, складно підмінити), не дає створити другий екземпляр (кілька tenant-ів, ізоляція SSR-запитів) і часто робить побічні ефекти під час імпорту. У JS модуль і так виконується один раз, тож «один екземпляр» отримати легко. Краще створити екземпляр у composition root і передати через параметри (dependency injection) — екземпляр один, але залежність явна й підмінна.
>
> 📚 [[JavaScript - 32. Патерни проєктування#Module, factory і singleton|Розділ: singleton]] · [patterns.dev: Singleton Pattern](https://www.patterns.dev/vanilla/singleton-pattern)

> [!interview] Чим observer відрізняється від pub/sub?
> level: middle · frequency: часто · id: jsd-32-int-02
>
> ---
>
> В observer суб'єкт сам тримає список спостерігачів і напряму їх сповіщає — вони пов'язані через нього. У pub/sub між видавцем і підписниками є посередник (канал, шина, брокер): видавець публікує в топік, не знаючи, хто слухає, і навпаки. Pub/sub слабше зв'язує і масштабується до міжпроцесної взаємодії (Redis, Kafka), але потік керування стає неявним. У браузері observer — це `EventTarget`/`addEventListener`, у Node — `EventEmitter`. В обох — обов'язково відписуватися, інакше витоки.
>
> 📚 [[JavaScript - 32. Патерни проєктування#Observer, pub/sub і EventEmitter|Розділ: observer і pub/sub]] · [patterns.dev: Observer Pattern](https://www.patterns.dev/vanilla/observer-pattern)

> [!interview] Як влаштовані middleware в Express/Koa?
> level: senior · frequency: іноді · id: jsd-32-int-03
>
> ---
>
> Це ланцюжок відповідальності: масив функцій `(ctx, next)`, де кожна може обробити запит, змінити контекст, перервати ланцюжок (не викликати `next`) або викликати наступну. У Koa `compose` рекурсивно викликає `dispatch(i + 1)` усередині `next`, і завдяки `await next()` кожен шар має код «до» і «після» — модель цибулі (логування часу, обробка помилок через `try/catch` навколо `next`). Express історично callback-орієнтований: `next()` без промісів, помилки — через `next(err)`. Захист від подвійного виклику `next` — лічильник індексу в `compose`.
>
> 📚 [[JavaScript - 32. Патерни проєктування#Dependency injection і middleware|Розділ: middleware]] · [Express: Using middleware](https://expressjs.com/en/guide/using-middleware.html)

## 🔗 Зв'язки

- [[JavaScript - 05. Замикання]] — приватний стан фабрик, команд і декораторів живе в замиканнях.
- [[JavaScript - 20. Symbol, Proxy і Reflect]] — патерн Proxy вбудований у мову.
- [[JavaScript - 14. Debounce, throttle та async-патерни]] — debounce, retry, memoize — декоратори функцій.
- [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери]] — модуль як природний singleton і межа інкапсуляції.
- [[JavaScript - 33. Тестування JavaScript]] — DI робить код тестованим без моків модулів.

## ⚡ Фішки

> [!reel] 🧱 Модуль — уже singleton
> ES-модуль виконується рівно один раз, а всі імпортери бачать ті самі зв'язки. `export const store = createStore()` — і жодного `getInstance()`.

> [!reel] 🎯 Strategy — це просто функція
> У GoF стратегія — інтерфейс і ієрархія класів. У JS — `arr.toSorted((a, b) => a - b)`. Ти щодня користуєшся патерном Strategy і навіть не помічаєш.

> [!reel] 🧅 Middleware — це цибуля
> У Koa код до `await next()` виконується на вході, після — на виході у зворотному порядку. Тому logger, підключений першим, бачить і запит, і готову відповідь.

> [!reel] 🚦 isLoading + isError = баг
> Три булеві прапорці дають 8 комбінацій, а валідних — 4. Скінченний автомат з одним полем `state` робить неможливі стани неможливими.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке фабрична функція і чим вона зручна?
> *часто · теорія* · `jsd-32-001`
>
> Функція, що створює й повертає об'єкт. Приватний стан тримається в замиканні, немає `new` і проблем з `this`, легко повертати різні реалізації за параметрами. Мінус — методи не діляться через прототип (для тисяч екземплярів клас економніший).
>
> 📚 [[JavaScript - 32. Патерни проєктування#Module, factory і singleton|Розділ: factory]] · [patterns.dev: Factory Pattern](https://www.patterns.dev/vanilla/factory-pattern)

> [!question]- Як реалізувати патерн Strategy в JS?
> *часто · практика* · `jsd-32-002`
>
> Функцією-значенням або об'єктом-мапою функцій за спільним контрактом: `const pricing = { regular, vip }; pricing[tier](price)`. Додати варіант — додати ключ, не змінюючи код, що викликає.
>
> 📚 [[JavaScript - 32. Патерни проєктування#Strategy, command і undo|Розділ: strategy]] · [Refactoring.Guru: Strategy](https://refactoring.guru/design-patterns/strategy)

### 🟡 Middle

> [!question]- Як реалізувати undo/redo?
> *часто · практика* · `jsd-32-003`
>
> Патерн Command: кожна дія — об'єкт `{ execute, undo }`. Виконані — у стек `done`; undo переносить команду в `undone`, викликаючи `undo()`; redo — навпаки. Нова дія очищує `undone`. Альтернатива для простого стану — зберігати знімки (immutable state).
>
> 📚 [[JavaScript - 32. Патерни проєктування#Strategy, command і undo|Розділ: command і undo]] · [Refactoring.Guru: Command](https://refactoring.guru/design-patterns/command)

> [!question]- Чим decorator відрізняється від adapter і facade?
> *часто · порівняння* · `jsd-32-004`
>
> Decorator додає поведінку, **зберігаючи** інтерфейс (`withRetry(fetch)`). Adapter **змінює** інтерфейс на очікуваний (callback → проміс). Facade **спрощує** складну підсистему однією точкою входу (`api.getProfile()`).
>
> 📚 [[JavaScript - 32. Патерни проєктування#Decorator, adapter, facade, proxy|Розділ: обгортки]] · [Refactoring.Guru: Decorator](https://refactoring.guru/design-patterns/decorator)

> [!question]- Що таке dependency injection і як його робити без контейнера?
> *часто · теорія* · `jsd-32-005`
>
> Залежності передаються ззовні (параметри функції чи конструктора), а не створюються й не імпортуються всередині. Екземпляри створюються один раз у composition root і передаються вниз. У тестах передаємо фейки — без моків модульної системи.
>
> 📚 [[JavaScript - 32. Патерни проєктування#Dependency injection і middleware|Розділ: DI]] · [patterns.dev](https://www.patterns.dev/)

### 🔴 Senior

> [!question]- Чому скінченний автомат кращий за набір булевих прапорців?
> *іноді · теорія* · `jsd-32-006`
>
> N прапорців дають 2^N комбінацій, більшість з яких безглузді (`isLoading && isError`). Автомат має одне поле стану й явну таблицю переходів: недозволені події ігноруються, неможливі стани непредставні, поведінку легко тестувати й візуалізувати.
>
> 📚 [[JavaScript - 32. Патерни проєктування#State machine — скінченний автомат|Розділ: state machine]] · [Stately: State machines and statecharts](https://stately.ai/docs/state-machines-and-statecharts)

> [!question]- Як працює `compose` у Koa і навіщо захист від подвійного `next()`?
> *рідко · практика* · `jsd-32-007`
>
> `dispatch(i)` викликає `middlewares[i](ctx, () => dispatch(i + 1))` і загортає результат у проміс; `await next()` дає код «до» і «після» — модель цибулі. Якщо middleware викличе `next()` двічі, внутрішні шари виконаються повторно (подвійна відповідь, подвійний запис у базу) — тому `compose` пам'ятає останній індекс і відхиляє повторний виклик.
>
> 📚 [[JavaScript - 32. Патерни проєктування#Dependency injection і middleware|Розділ: middleware]] · [Express: Using middleware](https://expressjs.com/en/guide/using-middleware.html)

> [!question]- Як SOLID виглядає в JavaScript без інтерфейсів?
> *іноді · теорія* · `jsd-32-008`
>
> S — малі модулі й функції з однією відповідальністю. O — розширення через мапи стратегій, плагіни, middleware. L — duck typing: замінник з тією самою формою поводиться так само. I — функції просять мінімальний об'єкт (`{ send }`). D — залежності передаються параметрами, а не імпортуються.
>
> 📚 [[JavaScript - 32. Патерни проєктування#SOLID по-JS-ному|Розділ: SOLID]] · [Addy Osmani: Learning JavaScript Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/)

## 🛠️ Практика

> [!task] Поясни своїми словами: singleton vs DI
> level: middle · difficulty: easy · id: jsd-32-task-01 · tags: feynman, singleton, di
>
> Поясни (до 5 речень) молодшому колезі, чому `import { db } from './db.js'` у кожному сервісі — проблема, хоча працює, і як dependency injection її вирішує, не створюючи другого з'єднання. Використай аналогію.
>
> > [!hint]- Підказка 1
> > Що бачить читач сигнатури `registerUser(data)` і що бачить тест?
>
> > [!hint]- Підказка 2
> > Аналогія: побутова техніка, вбудована в стіну, vs техніка з вилкою й розеткою.
>
> > [!solution]- Еталонне пояснення
> > Прямий імпорт — це плита, вбудована в стіну: працює, але замінити її (на тестову, на іншу базу, на репліку) можна лише розібравши стіну — тобто мокаючи модульну систему. До того ж сигнатура `registerUser(data)` бреше: функція насправді залежить від бази й пошти, а з виклику цього не видно. Dependency injection — це вилка й розетка: сервіс отримує `db` параметром, а створюємо `db` один раз у `main.js` і передаємо всім, тож з'єднання так само одне. Для тесту просто вмикаємо в розетку фейкову базу. Залежність стала явною і замінною, а «один екземпляр» лишився.

> [!task] EventEmitter з `once`, відпискою і захистом від помилок
> level: middle · difficulty: medium · id: jsd-32-task-02 · tags: observer, events, closures
>
> Реалізуй `createEmitter()` з методами `on(event, fn)` (повертає `unsubscribe`), `once(event, fn)`, `off(event, fn)`, `emit(event, ...args)` і `listenerCount(event)`. Вимоги: обробники викликаються в порядку підписки; відписка **під час** `emit` не ламає поточну розсилку; виняток в одному обробнику не зупиняє інші (помилки збираються в `AggregateError`, яку `emit` кидає після розсилки).
>
> ```js
> const bus = createEmitter();
> bus.on('x', () => { throw new Error('boom'); });
> bus.once('x', (v) => console.log('once', v));
> bus.on('x', (v) => console.log('always', v));
> try { bus.emit('x', 1); } catch (e) { console.log(e.errors.length); }
> // → once 1 · always 1 · 1
> console.log(bus.listenerCount('x')); // → 2
> ```
>
> ```js starter
> function createEmitter() {
>   const listeners = new Map() // event → Set<fn>
>   // твій код
>   return {
>     on(event, fn) {},
>     once(event, fn) {},
>     off(event, fn) {},
>     emit(event, ...args) {},
>     listenerCount(event) {},
>   }
> }
> ```
>
> ```js tests
> test('обробники викликаються в порядку підписки з аргументами', () => {
>   const bus = createEmitter()
>   const calls = []
>   bus.on('x', (a, b) => calls.push(['first', a, b]))
>   bus.on('x', (a, b) => calls.push(['second', a, b]))
>   bus.emit('x', 1, 2)
>   expect(calls).toEqual([['first', 1, 2], ['second', 1, 2]])
> })
>
> test('on повертає unsubscribe, off теж знімає', () => {
>   const bus = createEmitter()
>   const a = vi.fn()
>   const b = vi.fn()
>   const unsubscribe = bus.on('x', a)
>   bus.on('x', b)
>   unsubscribe()
>   bus.off('x', b)
>   bus.emit('x')
>   expect(a).not.toHaveBeenCalled()
>   expect(b).not.toHaveBeenCalled()
>   expect(bus.listenerCount('x')).toBe(0)
> })
>
> test('once спрацьовує рівно один раз', () => {
>   const bus = createEmitter()
>   const fn = vi.fn()
>   bus.once('x', fn)
>   bus.emit('x', 'a')
>   bus.emit('x', 'b')
>   expect(fn).toHaveBeenCalledTimes(1)
>   expect(fn).toHaveBeenCalledWith('a')
> })
>
> test('відписка під час emit не ламає поточну розсилку', () => {
>   const bus = createEmitter()
>   const later = vi.fn()
>   let off
>   bus.on('x', () => off())
>   off = bus.on('x', later)
>   bus.emit('x')
>   expect(later).toHaveBeenCalledTimes(1)
>   bus.emit('x')
>   expect(later).toHaveBeenCalledTimes(1)
> })
>
> test('помилка одного обробника не зупиняє інших — AggregateError після розсилки', () => {
>   const bus = createEmitter()
>   const seen = []
>   bus.on('x', () => { throw new Error('boom') })
>   bus.once('x', (v) => seen.push(`once ${v}`))
>   bus.on('x', (v) => seen.push(`always ${v}`))
>   let error
>   try { bus.emit('x', 1) } catch (e) { error = e }
>   expect(seen).toEqual(['once 1', 'always 1'])
>   expect(error).toBeInstanceOf(AggregateError)
>   expect(error.errors).toHaveLength(1)
>   expect(bus.listenerCount('x')).toBe(2)
> })
>
> test('emit без підписників і listenerCount невідомої події', () => {
>   const bus = createEmitter()
>   expect(() => bus.emit('nobody')).not.toThrow()
>   expect(bus.listenerCount('nobody')).toBe(0)
> })
> ```
>
> > [!hint]- Підказка 1
> > `Map<event, Set<fn>>` зберігає порядок вставки й не дає дублікатів.
>
> > [!hint]- Підказка 2
> > Ітеруй **копію** списку обробників — тоді відписка під час `emit` безпечна.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createEmitter() {
> >   const listeners = new Map();
> >   const off = (event, fn) => {
> >     const set = listeners.get(event);
> >     set?.delete(fn);
> >     if (set?.size === 0) listeners.delete(event);
> >   };
> >   return {
> >     on(event, fn) {
> >       if (!listeners.has(event)) listeners.set(event, new Set());
> >       listeners.get(event).add(fn);
> >       return () => off(event, fn);
> >     },
> >     once(event, fn) {
> >       const unsubscribe = this.on(event, (...args) => {
> >         unsubscribe();
> >         return fn(...args);
> >       });
> >       return unsubscribe;
> >     },
> >     off,
> >     emit(event, ...args) {
> >       const errors = [];
> >       for (const fn of [...(listeners.get(event) ?? [])]) {
> >         try { fn(...args); } catch (err) { errors.push(err); }
> >       }
> >       if (errors.length) throw new AggregateError(errors, `${errors.length} listener(s) failed for "${event}"`);
> >     },
> >     listenerCount: (event) => listeners.get(event)?.size ?? 0,
> >   };
> > }
> > ```
> >
> > Нюанс `once`: `off(event, fn)` з оригінальною `fn` не зніме обгортку. Node `EventEmitter` вирішує це, зберігаючи оригінал у властивості обгортки (`wrapper.listener = fn`), а `off` порівнює обидва.

> [!task] `compose` для middleware у стилі Koa
> level: senior · difficulty: hard · id: jsd-32-task-03 · tags: middleware, promises, patterns
>
> Напиши `compose(middlewares)` → `(ctx, next?) => Promise`. Кожен middleware — `async (ctx, next) => …`. Вимоги: модель цибулі; синхронний `throw` у middleware перетворюється на rejected-проміс; повторний виклик `next()` в одному middleware відхиляється з `Error('next() called multiple times')`; необов'язковий `next` зовнішнього `compose` викликається після останнього middleware (щоб композиції можна було вкладати).
>
> ```js
> const log = [];
> const app = compose([
>   async (ctx, next) => { log.push('1>'); await next(); log.push('<1'); },
>   async (ctx, next) => { log.push('2>'); await next(); log.push('<2'); },
>   async (ctx) => { ctx.body = 'ok'; log.push('handler'); },
> ]);
> const ctx = {};
> await app(ctx);
> console.log(log.join(' '), ctx.body); // → 1> 2> handler <2 <1 ok
> await compose([async (c, next) => { await next(); await next(); }])({}).catch((e) => console.log(e.message));
> // → next() called multiple times
> ```
>
> ```js starter
> function compose(middlewares) {
>   return function (ctx, next) {
>     // твій код
>   }
> }
> ```
>
> ```js tests
> test('модель цибулі', async () => {
>   const log = []
>   const app = compose([
>     async (ctx, next) => { log.push('1>'); await next(); log.push('<1') },
>     async (ctx, next) => { log.push('2>'); await next(); log.push('<2') },
>     async (ctx) => { ctx.body = 'ok'; log.push('handler') },
>   ])
>   const ctx = {}
>   await app(ctx)
>   expect(log.join(' ')).toBe('1> 2> handler <2 <1')
>   expect(ctx.body).toBe('ok')
> })
>
> test('синхронний throw стає rejected-промісом', async () => {
>   const app = compose([() => { throw new Error('sync') }])
>   let result
>   expect(() => { result = app({}) }).not.toThrow()
>   await expect(result).rejects.toThrow('sync')
> })
>
> test('повторний next() відхиляється', async () => {
>   const app = compose([async (c, next) => { await next(); await next() }])
>   await expect(app({})).rejects.toThrow('next() called multiple times')
> })
>
> test('зовнішній next викликається після останнього middleware — композиції вкладаються', async () => {
>   const log = []
>   const inner = compose([async (c, next) => { log.push('inner>'); await next(); log.push('<inner') }])
>   const outer = compose([
>     async (c, next) => { log.push('outer>'); await next(); log.push('<outer') },
>     inner,
>   ])
>   await outer({}, async () => { log.push('tail') })
>   expect(log).toEqual(['outer>', 'inner>', 'tail', '<inner', '<outer'])
> })
>
> test('помилку внутрішнього шару ловить зовнішній middleware', async () => {
>   const ctx = {}
>   const app = compose([
>     async (c, next) => { try { await next() } catch (e) { c.status = 500; c.error = e.message } },
>     async () => { throw new Error('db down') },
>   ])
>   await app(ctx)
>   expect(ctx).toEqual({ status: 500, error: 'db down' })
> })
>
> test('порожній список — просто резолвиться', async () => {
>   await expect(compose([])({})).resolves.toBeUndefined()
> })
> ```
>
> > [!hint]- Підказка 1
> > `dispatch(i)` викликає `middlewares[i](ctx, () => dispatch(i + 1))`.
>
> > [!hint]- Підказка 2
> > Зберігай `index` — останній викликаний номер. Якщо `i <= index`, це повторний `next()`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function compose(middlewares) {
> >   if (!Array.isArray(middlewares) || middlewares.some((fn) => typeof fn !== 'function')) {
> >     throw new TypeError('middlewares must be an array of functions');
> >   }
> >   return function (ctx, next) {
> >     let index = -1;
> >     function dispatch(i) {
> >       if (i <= index) return Promise.reject(new Error('next() called multiple times'));
> >       index = i;
> >       const fn = i === middlewares.length ? next : middlewares[i];
> >       if (!fn) return Promise.resolve();
> >       try {
> >         return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
> >       } catch (err) {
> >         return Promise.reject(err);
> >       }
> >     }
> >     return dispatch(0);
> >   };
> > }
> > ```
> >
> > Обробка помилок «безкоштовна»: middleware з `try { await next() } catch (e) { ctx.status = 500 }` на початку ланцюжка ловить помилки всіх внутрішніх шарів, бо rejection піднімається через усі `await next()`. Саме так влаштований `koa-compose`.

## 📚 Джерела та що почитати

- 🟢 [patterns.dev](https://www.patterns.dev/) — сучасні JS-патерни з анімаціями, включно з рендеринг-патернами.
- 🟢 [Refactoring.Guru — Design Patterns](https://refactoring.guru/design-patterns) — каталог GoF-патернів з діаграмами й прикладами.
- 🟡 [Addy Osmani — Learning JavaScript Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/) — класика саме про JS-ідіоми патернів.
- 🟡 [Node.js — Events](https://nodejs.org/api/events.html) — `EventEmitter`, `once`, обробка помилок і витоки слухачів.
- 🟡 [Express — Using middleware](https://expressjs.com/en/guide/using-middleware.html) — middleware-ланцюжок на практиці.
- 🟡 [Stately — State machines and statecharts](https://stately.ai/docs/state-machines-and-statecharts) — від скінченних автоматів до статечартів.
- 🔴 [MDN — Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) — повний перелік пасток для патерну Proxy.

> [!important] Підсумок
> - Патерн — іменоване рішення; у JS більшість GoF-патернів зводяться до функцій, замикань, модулів і `Proxy`.
> - Модуль — природний singleton, але глобальний стан шкодить: створюй один раз у composition root і передавай (DI).
> - Observer/pub-sub слабко зв'язують код, але вимагають відписки; strategy — мапа функцій; command — `{ execute, undo }` і два стеки.
> - Decorator додає поведінку, adapter змінює інтерфейс, facade спрощує, proxy контролює доступ; middleware — ланцюжок з `next` і моделлю цибулі.
> - Скінченний автомат робить неможливі стани неможливими; SOLID у JS — евристики через duck typing і DI, а не ієрархії класів.
