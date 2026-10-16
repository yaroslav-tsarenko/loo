---
title: Функції глибоко
order: 15
level: middle
tags: [functions, arrow-functions, parameters, higher-order, recursion, currying, iife]
prerequisites:
  - "[[JavaScript - 05. Замикання]]"
  - "[[JavaScript - 06. this]]"
estimatedMinutes: 50
id: jsd-ch-15
icon: "🔧"
---

# Функції глибоко

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити різницю між function declaration, function expression і стрілковою функцією через hoisting, `this`, `arguments` і `new`;
> - передбачити, коли спрацює значення параметра за замовчуванням і що покаже `fn.length`;
> - розрізнити rest і spread, а також пояснити, чому `arguments` — застарілий інструмент;
> - написати функції вищого порядку, `curry`, `compose`/`pipe` і перевести глибоку рекурсію на trampoline або явний стек;
> - пояснити, навіщо досі існує IIFE і звідки функція бере своє `name`.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-15-quiz-01
>
> ```js
> console.log(typeof declared, typeof expressed);
> function declared(a, b = 1, ...rest) {}
> var expressed = () => {};
> console.log(declared.length, ['1', '2', '3'].map(parseInt));
> ```
>
> **Відповідь:** `function undefined 1 [1, NaN, NaN]`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Declaration «спливає» разом із тілом, а `var expressed` — лише як `undefined`. `length` рахує параметри до першого з default-значенням. А `map` передає в `parseInt` **три** аргументи — `(value, index, array)`, тож другий аргумент стає системою числення: `parseInt('2', 1)` і `parseInt('3', 2)` дають `NaN`.

## 🧒 Простими словами

Функція в JavaScript — це не «шматок коду з назвою», а **річ**, як ключ чи записник. Її можна покласти в кишеню (змінну), передати другові (аргумент), отримати назад від іншої функції (return) і навіть дописати на ній позначку (властивість). Різні способи оголошення — це різні моделі тієї самої речі: «звичайна» функція — універсальний ніж з усіма лезами (`this`, `arguments`, `new`), а стрілкова — компактний ніж з одним лезом, який позичає решту в того, хто поруч.

## 🔬 Як це працює насправді

### 🧬 Declaration, expression і arrow

Є три основні синтаксиси (плюс методи в класах і об'єктах та рідкісний `new Function`):

```js
function declaration(a) { return a * 2; }          // інструкція
const expression = function named(a) { return a; }; // вираз; ім'я named видно лише всередині
const arrow = (a) => a * 2;                          // вираз, коротке тіло = неявний return
const obj = { method() { return this; } };           // метод: свій this, але без prototype
```

Різниця — не в довжині запису, а в тому, **що отримує функція при створенні й виклику**:

| Властивість | declaration | expression | arrow | метод `m() {}` |
|---|---|---|---|---|
| Hoisting | ціла функція | лише змінна (`var` → `undefined`, `let/const` → TDZ) | як expression | разом з об'єктом |
| Власний `this` | ✅ (залежить від виклику) | ✅ | ❌ — лексичний | ✅ |
| `arguments` | ✅ | ✅ | ❌ — бере зовнішній | ✅ |
| `new` / `prototype` | ✅ | ✅ | ❌ `TypeError` | ❌ |
| Неявний `return` | ❌ | ❌ | ✅ для виразу | ❌ |

> [!viz] hoisting
> scenario: var-let-function

Named function expression має бонус: ім'я доступне **всередині** тіла — зручно для рекурсії й стек-трейсів, і воно не «протікає» назовні: у `const fact = function f(n) { … f(n - 1) … }` ззовні `typeof f === 'undefined'`.

Стрілкова функція — не «скорочений function». Вона не має власних `this`, `arguments`, `super`, `new.target` і бере їх з оточення, де створена (див. [[JavaScript - 06. this]]). Тому її ідеальне місце — callback-и, а не методи об'єктів.

> [!viz] this-binding
> scenario: arrow

> [!quiz] Перевір себе: що з цього кине помилку?
> level: middle · type: multi · id: jsd-15-quiz-02
> - [x] `new (() => {})()`
> - [ ] `new (function () {})()`
> - [x] Виклик `g()` у рядку **перед** `const g = function () {}`
> - [ ] Виклик `d()` у рядку **перед** `function d() {}`
> - [ ] `({ m() { return 1; } }).m()`
>
> **Пояснення:** стрілки не мають `[[Construct]]`, тож `new` дає `TypeError`. `const g` у TDZ до свого рядка → `ReferenceError`. Declaration ініціалізується ще до виконання коду, а метод — звичайна функція для виклику.

### 🧮 Параметри — default, rest і деструктуризація

**Default-значення** обчислюється **під час кожного виклику**, зліва направо, і лише коли аргумент — `undefined` (не `null`!). Пізніші параметри бачать попередні.

```js
function def(a, b = a * 2, c = b + 1) { return [a, b, c]; }
console.log(def(1));                  // → [1, 2, 3]
console.log(def(1, undefined, null)); // → [1, 2, null] — null не замінюється
console.log(def(1, null));            // → [1, null, 1] — null + 1 = 1

let calls = 0;
function counter(x = ++calls) { return x; }
counter(); counter(); counter(5);
console.log(calls); // → 2 — вираз default рахується лише тоді, коли він потрібен
```

На відміну від Python, `function add(item, list = [])` отримує **новий** масив на кожен виклик — бо вираз обчислюється щоразу.

**Rest-параметр** `...args` збирає «хвіст» аргументів у справжній масив. Він може бути лише останнім і лише одним.

**Деструктуризація параметрів** — стандарт для функцій з опціями. Зверни увагу на `= {}` наприкінці: без нього виклик без аргументу впаде.

```js
function connect({ host = 'localhost', port = 80 } = {}) {
  return `${host}:${port}`;
}
console.log(connect());               // → 'localhost:80'
console.log(connect({ port: 8080 })); // → 'localhost:8080'
```

> [!diagram] connect({ port: 8080 }): деструктуризація з default
> ```yaml
> layout: flow
> nodes:
>   - { id: arg, label: "аргумент", text: "{ port: 8080 }", tone: blue, icon: "px:box" }
>   - { id: param, label: "параметр", code: "function connect({\n  host = 'localhost',\n  port = 80\n} = {})", tone: violet }
>   - { id: vars, label: "змінні всередині", text: "host = ? · port = ?", tone: yellow }
>   - { id: out, label: "return", text: "?", tone: green }
> edges:
>   - { from: arg, to: param, label: "виклик" }
>   - { from: param, to: vars, label: "розпаковка" }
>   - { from: vars, to: out, label: "`${host}:${port}`" }
> steps:
>   - { focus: arg, note: "Викликаємо connect({ port: 8080 }) — передаємо обʼєкт лише з port." }
>   - { move: { from: arg, to: param, value: "{ port: 8080 }" }, line: "param:4", note: "Аргумент не undefined, тож запасне = {} не спрацьовує — розпаковуємо сам обʼєкт." }
>   - { set: { vars: "host = ? · port = 8080" }, line: "param:3", note: "port у обʼєкті є → 8080. Default 80 ігнорується." }
>   - { set: { vars: "host = 'localhost' · port = 8080" }, line: "param:2", note: "host немає (undefined) → береться default 'localhost'." }
>   - { move: { from: vars, to: out, value: "'localhost:8080'" }, set: { out: "'localhost:8080'" }, note: "Функція повертає 'localhost:8080'." }
>   - { set: { arg: "нічого (undefined)", vars: "host = 'localhost' · port = 80", out: "'localhost:80'" }, line: "param:4", note: "А connect() без аргументу: undefined → спрацьовує = {} → обидва default. Без = {} тут був би TypeError." }
> ```

`fn.length` — кількість параметрів **до першого** з default-значенням або rest. Деструктурований параметр без default рахується.

```js
console.log(((a, b) => {}).length);                  // → 2
console.log((function (a, b = 2, c) {}).length);     // → 1
console.log((function (...r) {}).length);            // → 0
console.log((function (a, { b }, c = 1, d) {}).length); // → 2
```

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-15-quiz-03
>
> ```js
> function greet(name = 'гість', greeting = `Привіт, ${name}`) {
>   return greeting;
> }
> console.log(greet(null), '|', greet(undefined, undefined));
> ```
>
> **Відповідь:** `Привіт, null | Привіт, гість`
>
> **Пояснення:** default спрацьовує лише для `undefined`. `null` — це явно передане значення, тому `name = null`, а `greeting` обчислюється з ним.

> [!quiz] Перевір себе: заповни пропуски в параметрах
> level: middle · type: fill · id: jsd-15-quiz-09 · bank: null, arguments
>
> ```js fill
> function connect({ host = 'localhost', port = 80 } [[= {}|={}]]) {
>   return host + ':' + port
> }
> connect()                        // → 'localhost:80' — без аргументу не падає
> connect({ port: [[undefined]] }) // → 'localhost:80' — default спрацював
>
> function log(level, [[...]]messages) {
>   return messages.map((m) => level + ': ' + m)
> }
> log('info', 'a', 'b')            // → ['info: a', 'info: b']
> ```
>
> **Пояснення:** `= {}` наприкінці — default для **всього** параметра: без нього `connect()` спробує деструктуризувати `undefined` і кине `TypeError`. Default-значення підставляється лише для `undefined` (з `null` вийшло б `'localhost:null'`). Rest-параметр `...messages` збирає хвіст аргументів у справжній масив — на відміну від `arguments`.

### 📦 arguments, rest і spread

`arguments` — псевдомасив (array-like) усіх переданих аргументів у звичайних функціях. У нього є `length` та індекси, але немає `map`/`filter`.

```js
function legacy() {
  return [arguments.length, Array.isArray(arguments), Array.from(arguments)];
}
console.log(legacy(1, 2, 3)); // → [3, false, [1, 2, 3]]
```

Історична дивина: у **sloppy mode** з «простими» параметрами `arguments` **зв'язаний** з параметрами (mapped arguments object). У strict mode або якщо є default/rest/деструктуризація — зв'язку немає.

```js
function sloppy(a) { arguments[0] = 99; return a; }
function strict(a) { 'use strict'; arguments[0] = 99; return a; }
function withDefault(a = 0) { arguments[0] = 99; return a; }
console.log(sloppy(1), strict(1), withDefault(1)); // → 99 1 1
```

Висновок: у новому коді `arguments` не потрібен — rest-параметр робить те саме, але чесно.

**Spread** — дзеркальна операція: «розсипає» ітерабельне значення в аргументи чи елементи масиву, а об'єкт — у властивості.

```text
  REST (збирає)                     SPREAD (розсипає)
  function f(a, ...rest)            f(...[1, 2, 3])
  f(1, 2, 3)                        [...'hi']        → ['h', 'i']
     a = 1, rest = [2, 3]           { ...{ x: 1 } }  → { x: 1 }
  стоїть у ПАРАМЕТРАХ / патернах    стоїть у ВИКЛИКАХ / літералах
```

```js
console.log(Math.max(...[1, 5, 3])); // → 5
console.log({ ...[10, 20] });        // → { '0': 10, '1': 20 }
console.log({ ...null });            // → {} — у літерал об'єкта null/undefined можна
```

> [!quiz] Перевір себе: оберіть правдиві твердження
> level: middle · type: multi · id: jsd-15-quiz-04
> - [x] Стрілкова функція не має власного `arguments`
> - [x] `...rest` завжди дає справжній масив
> - [ ] `arguments` у strict mode змінюється разом із параметрами
> - [ ] Spread у виклику `f(...obj)` працює з будь-яким звичайним об'єктом
>
> **Пояснення:** spread у виклику й у масиві вимагає **ітерабельного** значення, а звичайний об'єкт ним не є (`TypeError`). Об'єктний spread `{ ...obj }` — окремий механізм, що копіює власні enumerable-властивості.

### 🥇 Функції першого класу і вищого порядку

**First-class functions** — функції є звичайними значеннями: їх можна присвоїти, передати, повернути, покласти в масив чи `Map`. **Функція вищого порядку** (higher-order function, HOF) — та, що приймає функцію або повертає функцію: `map`, `filter`, `setTimeout`, `addEventListener`, `debounce`, будь-яка фабрика.

```js
const twice = (fn) => (x) => fn(fn(x)); // приймає і повертає функцію
console.log(twice((x) => x + 1)(5));    // → 7
const ops = { add: (a, b) => a + b, mul: (a, b) => a * b };
console.log(ops['mul'](3, 4));          // → 12 — таблиця функцій замість switch
```

**Callback** — функція, яку ти передаєш, щоб її викликав хтось інший. Callback-и бувають **синхронні** (`map`, `sort` — виконаються до повернення з HOF) і **асинхронні** (`setTimeout`, `fetch().then` — пізніше, з event loop, див. [[JavaScript - 08. Event Loop]]). Плутати їх небезпечно: «інколи синхронний» callback — джерело багів (Zalgo з [[JavaScript - 09. Promise]]).

> [!viz] array-pipeline
> scenario: map-filter-reduce

Головна пастка HOF — **неявні аргументи**. HOF вирішує, скільки аргументів передати, і це може зламати функцію, яка має необов'язкові параметри:

```js
console.log(['1', '2', '3'].map(parseInt));          // → [1, NaN, NaN]
console.log(['1', '2', '3'].map(Number));            // → [1, 2, 3]
console.log(['1', '2', '3'].map((s) => parseInt(s, 10))); // → [1, 2, 3]
```

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-15-quiz-05
>
> ```js
> const log = [];
> [3, 1, 2].forEach((x) => setTimeout(() => log.push(x), 0));
> [3, 1, 2].forEach((x) => log.push(x * 10));
> setTimeout(() => console.log(log.join(',')), 0);
> ```
>
> **Відповідь:** `30,10,20,3,1,2`
>
> **Пояснення:** callback `forEach` — синхронний, тому `30,10,20` потрапляють у масив одразу. Callback-и `setTimeout` — макрозадачі, вони виконуються пізніше, у порядку реєстрації; останній таймер з `console.log` зареєстровано останнім.

### 🔁 Рекурсія і trampolines

Рекурсивна функція викликає себе. Їй потрібні **base case** (коли зупинитися) і крок, що наближає до нього. Кожен виклик — новий кадр на call stack, тож глибина обмежена (у V8 — порядку 10 тисяч кадрів, залежить від розміру кадру).

```js
function sumTo(n) { return n === 0 ? 0 : n + sumTo(n - 1); }
console.log(sumTo(1000)); // → 500500
// sumTo(100000) → RangeError: Maximum call stack size exceeded
```

> [!viz] call-stack
> scenario: recursion

> [!viz] call-stack
> scenario: stack-overflow

**Tail call optimization (TCO).** Специфікація ES2015 вимагає *proper tail calls*: якщо рекурсивний виклик — останнє, що робить функція (`return f(...)`) у strict mode, кадр можна використати повторно. На практиці це реалізує лише Safari (JavaScriptCore); V8 і SpiderMonkey — ні. Тож у Node і Chrome на TCO не розраховуй.

**Trampoline** — прийом, що замінює вкладені виклики циклом: функція замість виклику себе **повертає thunk** (функцію без аргументів «зроби наступний крок»), а цикл-«батут» викликає їх по черзі. Стек не росте.

```js
const trampoline = (fn) => (...args) => {
  let result = fn(...args);
  while (typeof result === 'function') result = result(); // стрибаємо, доки є кроки
  return result;
};

const sumToSafe = trampoline(function step(n, acc = 0) {
  return n === 0 ? acc : () => step(n - 1, acc + n); // повертаємо thunk, а не виклик
});
console.log(sumToSafe(1_000_000)); // → 500000500000
```

> [!diagram] Рекурсія vs trampoline: що відбувається зі стеком
> ```yaml
> layout: compare
> columns: { rec: "звичайна рекурсія", tr: "trampoline" }
> nodes:
>   - { id: boom, col: rec, label: "ліміт стека", text: "RangeError: Maximum call stack size exceeded", tone: red }
>   - { id: r3, col: rec, label: "кадр", code: "sumTo(99_998) …", tone: orange }
>   - { id: r2, col: rec, label: "кадр", code: "sumTo(99_999)", tone: orange }
>   - { id: r1, col: rec, label: "кадр", code: "sumTo(100_000)", tone: orange }
>   - { id: step, col: tr, label: "кадр (зʼявляється й зникає)", text: "step(1_000_000, 0)", tone: mint }
>   - { id: loop, col: tr, label: "кадр (один на весь час)", text: "while (typeof result === 'function')", tone: blue }
> edges:
>   - { from: r3, to: r2 }
>   - { from: r2, to: r1 }
>   - { from: step, to: loop }
> steps:
>   - { show: [r1, loop], note: "Обидва варіанти стартують з одного кадру: sumTo(100_000) і цикл trampoline." }
>   - { show: [r2, step], note: "Рекурсія: sumTo викликає sumTo — новий кадр зверху. Trampoline: цикл викликає step(1_000_000, 0)." }
>   - { show: r3, hide: step, focus: [r3, loop], note: "Рекурсивні кадри чекають один на одного й накопичуються. А step не викликає себе — повертає thunk і завершується, його кадр знято." }
>   - { show: step, set: { step: "thunk() → step(999_999, 1_000_000)" }, note: "Цикл викликає thunk з того самого рівня — глибина знову 2 кадри, скільки б кроків не було." }
>   - { show: boom, note: "Рекурсія на сотні тисяч рівнів упирається в ліміт стека — RangeError." }
>   - { hide: step, set: { loop: "return 500000500000" }, focus: loop, note: "Trampoline пройшов мільйон кроків на двох кадрах і повернув 500000500000." }
> ```

Обмеження trampoline: результатом не може бути функція (інакше цикл її викличе), і він трохи повільніший. Часто простіше переписати рекурсію на цикл з **явним стеком** (масивом).

> [!quiz] Перевір себе: чому trampoline не переповнює стек?
> level: senior · id: jsd-15-quiz-06
> - [ ] Бо V8 оптимізує хвостові виклики
> - [x] Бо кожен крок повертає thunk, і його викликає цикл — кадр попереднього кроку вже знято
> - [ ] Бо thunk виконується як microtask
> - [ ] Бо `while` має окремий стек
>
> **Пояснення:** `step` не викликає себе — повертає функцію і завершується. Цикл викликає наступний крок з того самого рівня стека, тож глибина завжди 2–3 кадри.

> [!quiz] Перевір себе: склади `trampoline` з пам'яті
> level: senior · type: order · id: jsd-15-quiz-10
>
> ```js order
> const trampoline = (fn) => (...args) => {
>   let result = fn(...args)
>   while (typeof result === 'function') {
>     result = result()
>   }
>   return result
> }
>   if (typeof result === 'function') { // ✗
> ```
>
> **Пояснення:** цикл `while` «стрибає», доки крок повертає thunk, — кожен thunk викликається з того самого рівня стека. `if` виконав би лише один стрибок і повернув би функцію замість результату.

### 🧼 Чисті функції, каррінг і композиція

**Чиста функція** (pure function): (1) той самий вхід → той самий вихід, (2) без побічних ефектів — не змінює аргументи, глобальний стан, DOM, не робить I/O. Такі функції легко тестувати, кешувати (мемоізація з [[JavaScript - 05. Замикання]]) і комбінувати.

```js
const addTax = (price, rate) => price * (1 + rate);      // чиста
const stamp = (order) => ({ ...order, at: Date.now() }); // нечиста: залежить від часу
```

**Часткове застосування** (partial application) фіксує частину аргументів: `fn.bind(null, a)` або замикання. **Каррінг** перетворює `f(a, b, c)` на ланцюжок `f(a)(b)(c)`; базову реалізацію `curry` розібрано в [[JavaScript - 12. Масиви та функціональний стиль#Каррінг і часткове застосування]].

```js
const volume = (l, w, h) => l * w * h;
const baseTen = volume.bind(null, 10);      // partial: зафіксували l = 10
console.log(baseTen(2, 3));                 // → 60
console.log(baseTen.name, baseTen.length);  // → 'bound volume' 2
```

**Композиція** — збирання функцій у конвеєр. `compose` застосовує справа наліво (як у математиці `f(g(x))`), `pipe` — зліва направо (як читаємо).

```js
const compose = (...fns) => (x) => fns.reduceRight((v, fn) => fn(v), x);
const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x);

const inc = (x) => x + 1;
const double = (x) => x * 2;
console.log(compose(inc, double)(5)); // → 11 — inc(double(5))
console.log(pipe(inc, double)(5));    // → 12 — double(inc(5))
```

Каррінг і композиція дружать: функції в конвеєрі мають бути **унарними** (один аргумент), а каррінг робить з багатоаргументної функції унарну.

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-15-quiz-07
>
> ```js
> const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x);
> const f = pipe((x) => x * 3, (x) => x - 1, String, (s) => s.padStart(3, '0'));
> console.log(f(4));
> ```
>
> **Відповідь:** `011`
>
> **Пояснення:** `4 * 3 = 12` → `11` → `'11'` → `'011'`. `String` — звичайна функція, тож її можна передати в конвеєр як є.

### 🏷️ Функція як об'єкт — length, name і IIFE

Функція — це об'єкт з внутрішнім методом `[[Call]]`. У неї є власні властивості `length` і `name` (обидві non-writable, але configurable), у звичайних функцій — ще `prototype`. Можна додати й свої (`fn.calls = 0`), хоча стан краще тримати в замиканні.

**`name` виводиться з контексту** (name inference): з імені змінної, ключа об'єкта, getter-а, `bind`.

```js
const anon = () => {};
const o = { method() {}, get size() { return 1; } };
console.log(anon.name, o.method.name);                                   // → 'anon' 'method'
console.log(Object.getOwnPropertyDescriptor(o, 'size').get.name);         // → 'get size'
console.log((function () {}).name === '', new Function('a', 'return a').name); // → true 'anonymous'
```

Це не косметика: `name` потрапляє в стек-трейси, React DevTools і профайлер. Анонімні функції в трейсах — `<anonymous>`, і шукати їх важко.

**IIFE** (Immediately Invoked Function Expression) — функція, яку оголошують і одразу викликають. Дужки потрібні, щоб парсер побачив **вираз**, а не declaration.

```js
(function () { console.log('класична IIFE'); })();
const config = (() => {
  const secret = 'не видно ззовні'; // приватно для IIFE
  return { mode: 'prod' };
})();
```

Навіщо IIFE в епоху модулів і блоків: (1) ізолювати змінні в скриптах без модулів, (2) обчислити `const` складною логікою з `try/catch`, (3) запустити `async`-код там, де немає top-level await: `(async () => { await main(); })();`.

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-15-quiz-08
>
> ```js
> const sum = (a, b = 0, ...rest) => a + b;
> const bound = sum.bind(null, 1);
> console.log(sum.name, sum.length, bound.name, bound.length);
> ```
>
> **Відповідь:** `sum 1 bound sum 0`
>
> **Пояснення:** `sum.length` — параметри до першого з default, тобто 1. `bind` додає префікс `bound ` до імені й віднімає кількість зафіксованих аргументів від `length` (але не менше 0).

## ⚠️ Пастки

> [!pitfall] Стрілка повертає об'єкт — потрібні дужки
> Фігурна дужка після `=>` — це тіло функції, а не літерал. `a: 1` всередині стає **міткою** (label), а функція повертає `undefined`.
>
> ```js
> const bad = () => { a: 1 };
> const good = () => ({ a: 1 });
> console.log(bad(), good()); // → undefined { a: 1 }
> ```

> [!pitfall] Стрілка як метод об'єкта
> Стрілка не отримує `this` від виклику `obj.method()` — вона бере `this` з місця створення (на верхньому рівні модуля це `undefined`).
>
> ```js
> const counter = {
>   count: 0,
>   inc: () => this.count++,      // ❌ this — не counter
>   incOk() { return ++this.count; }, // ✅
> };
> ```

> [!pitfall] Деструктуризація параметра без `= {}`
> `function f({ a })` впаде на виклику `f()` з `TypeError: Cannot destructure property 'a' of 'undefined'`. Додавай default для всього об'єкта: `function f({ a } = {})`.

> [!pitfall] `fn.length` бреше для `curry`
> Generic `curry` визначає «скільки ще чекати» через `fn.length`. Для `(a, b = 1, c) => …` чи `(...args) => …` це 1 і 0 — функцію буде викликано зарано. Передавай арність явно: `curry(fn, 3)`.

## 🎤 На співбесіді

> [!interview] Чим стрілкова функція відрізняється від звичайної?
> level: junior · frequency: дуже часто · id: jsd-15-int-01
>
> ---
>
> Синтаксис — найменша різниця. Стрілка не має власних `this`, `arguments`, `super` і `new.target` — бере їх лексично з оточення створення. Її не можна викликати з `new` (немає `[[Construct]]` і `prototype`), а `call/apply/bind` не змінюють її `this`. Тому стрілки ідеальні для callback-ів усередині методів (не губиться `this`), але погані як методи об'єктів, обробники, яким потрібен `this` елемента, і конструктори. Як і function expression, стрілка не спливає разом із тілом.
>
> 📚 [[JavaScript - 15. Функції глибоко#🧬 Declaration, expression і arrow|Розділ: declaration, expression і arrow]] · [MDN: Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) · [Spec: Arrow Function Definitions](https://tc39.es/ecma262/#sec-arrow-function-definitions)

> [!interview] Що таке функції вищого порядку і каррінг? Напишіть `compose`.
> level: middle · frequency: часто · id: jsd-15-int-02
>
> ---
>
> HOF — функція, що приймає або повертає функцію (`map`, `debounce`, фабрики). Це можливо, бо функції в JS — значення першого класу. Каррінг — перетворення `f(a, b, c)` на `f(a)(b)(c)`, що дає унарні функції для конвеєрів; часткове застосування — фіксація частини аргументів (`bind`, замикання). `compose` застосовує функції справа наліво: `const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x)`; `pipe` — те саме через `reduce`, зліва направо. Нюанс: generic `curry` спирається на `fn.length`, який не враховує default і rest.
>
> 📚 [[JavaScript - 15. Функції глибоко#🧼 Чисті функції, каррінг і композиція|Розділ: каррінг і композиція]] · [javascript.info: Currying](https://javascript.info/currying-partials) · [Mostly Adequate Guide](https://mostly-adequate.gitbook.io/mostly-adequate-guide/)

> [!interview] Як обійти обмеження глибини рекурсії в JavaScript?
> level: senior · frequency: іноді · id: jsd-15-int-03
>
> ---
>
> Глибина стека обмежена (у V8 — порядку 10 тисяч кадрів), а proper tail calls зі специфікації ES2015 реалізовано лише в Safari, тож у Node/Chrome хвостова рекурсія все одно переповнює стек. Варіанти: (1) переписати на цикл з явним стеком/чергою — найнадійніше; (2) trampoline — функція повертає thunk, а цикл їх викликає, стек не росте; (3) для величезних структур — обробляти їх порціями між задачами event loop, щоб ще й не блокувати UI. Для дерев DOM чи JSON з довільною глибиною обираю ітеративний обхід.
>
> 📚 [[JavaScript - 15. Функції глибоко#🔁 Рекурсія і trampolines|Розділ: рекурсія і trampolines]] · [javascript.info: Recursion](https://javascript.info/recursion) · [Spec: Tail Position Calls](https://tc39.es/ecma262/#sec-tail-position-calls)

## 🔗 Зв'язки

- [[JavaScript - 04. Scope, hoisting і TDZ]] — чому declaration доступна до свого рядка, а `const fn = …` — ні.
- [[JavaScript - 05. Замикання]] — фабрики, partial application і мемоізація тримаються на замиканнях.
- [[JavaScript - 06. this]] — головна відмінність стрілок; `bind` як інструмент часткового застосування.
- [[JavaScript - 12. Масиви та функціональний стиль]] — `map`/`filter`/`reduce` — найуживаніші HOF, там же базовий `curry`.
- [[JavaScript - 01. Як JS виконує код]] — call stack, на якому живуть кадри рекурсії.
- [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери]] — як модулі замінили IIFE-ізоляцію.

## ⚡ Фішки

> [!reel] 🎯 map(parseInt) — класика співбесід
> `map` передає `(value, index, array)`, а `parseInt` сприймає другий аргумент як систему числення. `parseInt('2', 1)` — `NaN`.
>
> ```js
> ['1', '2', '3'].map(parseInt); // → [1, NaN, NaN]
> ```

> [!reel] 🐍 Default-параметри — не як у Python
> У Python `def f(x=[])` ділить один список між викликами. У JS default обчислюється **щоразу** — кожен виклик `f()` отримує новий масив.

> [!reel] 🏷️ Анонімні функції мають ім'я
> `const handler = () => {}` — і `handler.name === 'handler'`. Рушій виводить ім'я зі змінної, ключа об'єкта чи `bind` («bound f»). Звідси гарні стек-трейси.

> [!reel] 🪃 Proper tail calls є лише в Safari
> ES2015 вимагає оптимізації хвостових викликів у strict mode, але V8 її прибрав: ламались стек-трейси й дебаг. Тож у Chrome і Node глибока хвостова рекурсія все одно падає.

> [!reel] 🔢 fn.length зупиняється на default
> `length` рахує параметри лише до першого з default-значенням; rest не рахується взагалі.
>
> ```js
> ((a, b = 1, c) => {}).length; // → 1
> ((...args) => {}).length;     // → 0
> ```

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Яка різниця між function declaration і function expression?
> *дуже часто · теорія* · `jsd-15-001`
>
> Declaration — інструкція `function name() {}`; вона спливає разом із тілом, тож її можна викликати до рядка оголошення. Expression — функція як значення виразу (`const f = function () {}`); до присвоєння змінна або `undefined` (`var`), або в TDZ (`let/const`).
>
> 📚 [[JavaScript - 15. Функції глибоко#🧬 Declaration, expression і arrow|Розділ: три способи створити функцію]] · [MDN: Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions)

> [!question]- Коли спрацьовує значення параметра за замовчуванням?
> *часто · код* · `jsd-15-002`
>
> Лише коли аргумент не передано або передано `undefined`. `null`, `0`, `''` — це значення, і default не підставиться. Вираз default обчислюється під час кожного виклику, зліва направо.
>
> 📚 [[JavaScript - 15. Функції глибоко#🧮 Параметри — default, rest і деструктуризація|Розділ: параметри]] · [MDN: Default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)

> [!question]- Чим rest відрізняється від spread?
> *часто · порівняння* · `jsd-15-003`
>
> Синтаксис однаковий (`...`), напрямок протилежний. Rest **збирає** решту аргументів чи елементів у масив/об'єкт (у параметрах і деструктуризації). Spread **розсипає** ітерабельне значення в аргументи чи елементи (у викликах і літералах).
>
> 📚 [[JavaScript - 15. Функції глибоко#📦 arguments, rest і spread|Розділ: arguments, rest і spread]] · [javascript.info: Rest і spread](https://javascript.info/rest-parameters-spread)

> [!question]- Що таке IIFE і навіщо вона потрібна сьогодні?
> *іноді · теорія* · `jsd-15-004`
>
> Функціональний вираз, який викликається одразу: `(() => { … })()`. Створює приватний scope. Сьогодні — для ізоляції в скриптах без модулів, обчислення складного `const` і запуску `async`-коду без top-level await.
>
> 📚 [[JavaScript - 15. Функції глибоко#🏷️ Функція як об'єкт — length, name і IIFE|Розділ: IIFE]] · [MDN: IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)

### 🟡 Middle

> [!question]- Чому `['1', '2', '3'].map(parseInt)` дає `[1, NaN, NaN]`?
> *дуже часто · код* · `jsd-15-005`
>
> `map` передає callback-у `(value, index, array)`. `parseInt(string, radix)` отримує індекс як систему числення: `parseInt('1', 0)` — 1 (0 означає «за замовчуванням»), `parseInt('2', 1)` — `NaN` (основа 1 некоректна), `parseInt('3', 2)` — `NaN` (цифри 3 немає у двійковій). Лікування: `map(Number)` або `map((s) => parseInt(s, 10))`.
>
> 📚 [[JavaScript - 15. Функції глибоко#🥇 Функції першого класу і вищого порядку|Розділ: HOF]] · [MDN: parseInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)

> [!question]- Що таке `arguments` і чому краще rest-параметр?
> *часто · порівняння* · `jsd-15-006`
>
> `arguments` — псевдомасив усіх аргументів звичайної функції: немає методів масиву, немає у стрілок, а в sloppy mode з простими параметрами він ще й зв'язаний з ними (зміна `arguments[0]` змінює `a`). `...rest` — справжній масив, явний у сигнатурі, працює в стрілках.
>
> 📚 [[JavaScript - 15. Функції глибоко#📦 arguments, rest і spread|Розділ: arguments]] · [MDN: arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)

> [!question]- Яку функцію називають чистою і навіщо це?
> *часто · теорія* · `jsd-15-007`
>
> Детермінована (той самий вхід → той самий вихід) і без побічних ефектів (не змінює аргументи й зовнішній стан, не робить I/O). Такі функції легко тестувати, мемоізувати, паралелити й композувати; React очікує чисті render-функції.
>
> 📚 [[JavaScript - 15. Функції глибоко#🧼 Чисті функції, каррінг і композиція|Розділ: чисті функції]] · [Mostly Adequate Guide](https://mostly-adequate.gitbook.io/mostly-adequate-guide/)

> [!question]- Як `compose` відрізняється від `pipe`?
> *іноді · код* · `jsd-15-008`
>
> Обидва склеюють унарні функції. `compose(f, g)(x)` = `f(g(x))` — справа наліво, через `reduceRight`. `pipe(f, g)(x)` = `g(f(x))` — зліва направо, через `reduce`, читається як конвеєр.
>
> 📚 [[JavaScript - 15. Функції глибоко#🧼 Чисті функції, каррінг і композиція|Розділ: композиція]] · [javascript.info: Currying](https://javascript.info/currying-partials)

### 🔴 Senior

> [!question]- Що таке trampoline і які в нього обмеження?
> *рідко · практика* · `jsd-15-009`
>
> Обгортка, що замінює рекурсію циклом: функція повертає thunk «наступний крок», а `while (typeof r === 'function') r = r()` їх викликає. Стек не росте. Обмеження: результат не може бути функцією, накладні витрати на створення thunk-ів, менш очевидний код — часто краще явний стек.
>
> 📚 [[JavaScript - 15. Функції глибоко#🔁 Рекурсія і trampolines|Розділ: trampolines]] · [javascript.info: Recursion](https://javascript.info/recursion)

> [!question]- Як `bind` змінює `name` і `length` і що повертає?
> *рідко · теорія* · `jsd-15-010`
>
> `bind` повертає нову **bound function exotic object** з зафіксованими `this` і аргументами. `name` отримує префікс `bound `, `length` = `max(0, target.length − кількість зафіксованих аргументів)`. Bound-функцію можна викликати з `new` (тоді прив'язаний `this` ігнорується), але вона не має `prototype`.
>
> 📚 [[JavaScript - 15. Функції глибоко#🏷️ Функція як об'єкт — length, name і IIFE|Розділ: length і name]] · [MDN: Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) · [Spec: Function.prototype.bind](https://tc39.es/ecma262/#sec-function.prototype.bind)

> [!question]- Коли `arguments` пов'язаний з параметрами, а коли ні?
> *рідко · теорія* · `jsd-15-011`
>
> Mapped arguments object створюється лише в sloppy mode для функцій з «простим» списком параметрів (без default, rest, деструктуризації). Тоді `arguments[i]` і параметр — синоніми. У strict mode або з «непростими» параметрами — unmapped: незалежна копія. У стрілок `arguments` немає зовсім.
>
> 📚 [[JavaScript - 15. Функції глибоко#📦 arguments, rest і spread|Розділ: arguments]] · [Spec: Arguments Exotic Objects](https://tc39.es/ecma262/#sec-arguments-exotic-objects)

## 🛠️ Практика

> [!task] Напиши `pipe` з підтримкою async-кроків
> level: junior · difficulty: easy · id: jsd-15-task-01 · tags: functions, composition
>
> Спершу напиши звичайний `pipe(...fns)`. Потім — `pipeAsync(...fns)`, який повертає функцію, що повертає проміс і дозволяє будь-якому кроку бути `async`.
>
> ```js
> const slug = pipe((s) => s.trim(), (s) => s.toLowerCase(), (s) => s.replaceAll(' ', '-'));
> slug('  Hello World '); // → 'hello-world'
> await pipeAsync((x) => x + 1, async (x) => x * 2)(5); // → 12
> ```
>
> ```js starter
> const pipe = (...fns) => {
>   // твій код
> }
>
> const pipeAsync = (...fns) => {
>   // твій код
> }
> ```
>
> ```js tests
> test('pipe застосовує функції зліва направо', () => {
>   const slug = pipe((s) => s.trim(), (s) => s.toLowerCase(), (s) => s.replaceAll(' ', '-'))
>   expect(slug('  Hello World ')).toBe('hello-world')
>   expect(pipe((x) => x + 1, (x) => x * 2)(5)).toBe(12)
> })
>
> test('pipe без функцій повертає вхід', () => {
>   expect(pipe()(42)).toBe(42)
> })
>
> test('pipeAsync змішує синхронні й async-кроки та повертає проміс', async () => {
>   const run = pipeAsync((x) => x + 1, async (x) => x * 2, (x) => x - 2)
>   const p = run(5)
>   expect(p).toBeInstanceOf(Promise)
>   await expect(p).resolves.toBe(10)
> })
>
> test('pipeAsync: помилка кроку відхиляє результат і зупиняє ланцюжок', async () => {
>   const after = vi.fn()
>   const run = pipeAsync(async () => { throw new Error('крок впав') }, after)
>   await expect(run(1)).rejects.toThrow('крок впав')
>   expect(after).not.toHaveBeenCalled()
> })
> ```
>
> > [!hint]- Підказка 1
> > `pipe` — це `reduce` по масиву функцій з початковим значенням `x`.
>
> > [!hint]- Підказка 2
> > Для async-версії акумулятором `reduce` зроби проміс: `Promise.resolve(x)`, а кожен крок — `.then(fn)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x);
> > const pipeAsync = (...fns) => (x) =>
> >   fns.reduce((p, fn) => p.then(fn), Promise.resolve(x));
> > ```
> >
> > `then` сам «розпаковує» проміс, який повернув async-крок, тому синхронні й асинхронні функції можна змішувати. Помилка будь-якого кроку перетворить увесь результат на rejected проміс.

> [!task] Поясни своїми словами: чому стрілка — не просто коротший function
> level: middle · difficulty: medium · id: jsd-15-task-02 · tags: feynman, functions, this
>
> Поясни колезі, який щойно перейшов з Java, чим стрілкова функція відрізняється від звичайної. Відповідь має містити: що стрілка **не має** (мінімум 4 речі), один приклад, де стрілка рятує, і один, де вона ламає код. До 8 речень.
>
> > [!hint]- Підказка 1
> > Подумай, що функція отримує в момент **виклику**: `this`, `arguments`, `new.target`. А що стрілка бере з місця **створення**?
>
> > [!hint]- Підказка 2
> > Рятує — callback у `setTimeout` всередині методу. Ламає — метод об'єкта або конструктор.
>
> > [!solution]- Еталонне пояснення
> > Звичайна функція при кожному виклику отримує «пакет»: власний `this` (залежить від того, як її викликали), `arguments`, `new.target`, а ще її можна викликати з `new`. Стрілка цього пакета не має: `this`, `arguments`, `super` і `new.target` вона бере з оточення, де її створили, — так само, як звичайні змінні через замикання. Конструктором вона бути не може — немає `prototype`, `new` кидає `TypeError`. Рятує вона в callback-ах: `setTimeout(() => this.save(), 100)` усередині методу бачить `this` методу, а звичайна функція отримала б `undefined`. Ламає — коли потрібен динамічний `this`: `const obj = { n: 1, get: () => this.n }` поверне `undefined`, бо `this` узято з модуля, а не з `obj`. Правило: стрілка — для callback-ів, метод чи `function` — для всього, що має знати свого власника.

> [!task] `deepSum` без переповнення стека
> level: senior · difficulty: hard · id: jsd-15-task-03 · tags: recursion, trampoline, stack
>
> Напиши `deepSum(value)`, що сумує всі числа у вкладених масивах **будь-якої** глибини. Рекурсивна версія впаде на глибині 100 000 — твоя не повинна.
>
> ```js
> let deep = [1];
> for (let i = 0; i < 100_000; i++) deep = [deep, 1];
> deepSum([1, [2, [3, [4]]], 5]); // → 15
> deepSum(deep);                  // → 100001
> ```
>
> ```js starter
> function deepSum(value) {
>   // твій код
> }
> ```
>
> ```js tests
> test('сумує числа у вкладених масивах', () => {
>   expect(deepSum([1, [2, [3, [4]]], 5])).toBe(15)
> })
>
> test('порожні масиви дають 0, одиночне число — саме себе', () => {
>   expect(deepSum([])).toBe(0)
>   expect(deepSum([[], [[]]])).toBe(0)
>   expect(deepSum(7)).toBe(7)
> })
>
> test('ігнорує не-числа', () => {
>   expect(deepSum([1, '2', [null, 3, { n: 4 }], undefined])).toBe(4)
> })
>
> test('не падає на глибині 100 000', () => {
>   let deep = [1]
>   for (let i = 0; i < 100_000; i++) deep = [deep, 1]
>   expect(deepSum(deep)).toBe(100001)
> })
> ```
>
> > [!hint]- Підказка 1
> > Рекурсія використовує call stack як «список справ». Що, якщо вести цей список самому?
>
> > [!hint]- Підказка 2
> > Масив-стек: кладеш туди вкладені масиви, у циклі знімаєш по одному й обробляєш елементи.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function deepSum(value) {
> >   const stack = [value];
> >   let sum = 0;
> >   while (stack.length > 0) {
> >     const item = stack.pop();
> >     if (Array.isArray(item)) {
> >       for (const x of item) stack.push(x); // відкладаємо дітей
> >     } else if (typeof item === 'number') {
> >       sum += item;
> >     }
> >   }
> >   return sum;
> > }
> > ```
> >
> > Явний стек живе в heap, тож глибина обмежена пам'яттю, а не розміром call stack. Порядок обходу інший, ніж у рекурсії, але для суми це не важливо. Альтернатива — trampoline з акумулятором, проте для дерев (кілька дітей) явний стек простіший і швидший.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Function expressions](https://javascript.info/function-expressions) — declaration проти expression і hoisting простими словами.
- 🟢 [javascript.info — Rest parameters and spread syntax](https://javascript.info/rest-parameters-spread) — rest, spread і `arguments` з прикладами.
- 🟡 [MDN — Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions) — повний довідник: параметри, `arguments`, стрілки, getter-и.
- 🟡 [MDN — Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) — усе, чого стрілки не мають, і чому.
- 🟡 [javascript.info — Function object, NFE](https://javascript.info/function-object) — `name`, `length`, власні властивості і named function expression.
- 🟡 [javascript.info — Recursion and stack](https://javascript.info/recursion) — як рекурсія живе на стеку і як переписати її циклом.
- 🟡 [Mostly Adequate Guide to Functional Programming](https://mostly-adequate.gitbook.io/mostly-adequate-guide/) — чисті функції, каррінг і композиція в JS.
- 🔴 [ECMAScript — Function Definitions](https://tc39.es/ecma262/#sec-function-definitions) — першоджерело: як створюються функції й обчислюються параметри.
- 🔴 [ECMAScript — Arguments Exotic Objects](https://tc39.es/ecma262/#sec-arguments-exotic-objects) — mapped і unmapped `arguments`.

> [!important] Підсумок
> - Declaration спливає з тілом; expression і стрілка — лише як змінна. Стрілка не має власних `this`, `arguments`, `new` — бере їх ззовні.
> - Default-параметри обчислюються під час кожного виклику і лише для `undefined`; `fn.length` рахує параметри до першого default чи rest.
> - Rest збирає, spread розсипає; `arguments` — застарілий псевдомасив, у новому коді використовуй `...args`.
> - Функції — значення першого класу: HOF, callback-и, каррінг, `compose`/`pipe` будуються на цьому. Пам'ятай про неявні аргументи (`map(parseInt)`).
> - Глибина рекурсії обмежена, TCO є лише в Safari — для довільної глибини обирай явний стек або trampoline.
