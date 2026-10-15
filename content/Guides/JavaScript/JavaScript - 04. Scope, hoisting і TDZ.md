---
title: Scope, hoisting і TDZ
order: 4
level: junior
tags: [scope, hoisting, tdz, var, let, const]
prerequisites:
  - "[[JavaScript - 01. Як JS виконує код]]"
estimatedMinutes: 35
id: jsd-ch-04
icon: "🔭"
---

# Scope, hoisting і TDZ

> [!success] 🎯 Після цього розділу ти зможеш
> - визначити, яку змінну «побачить» будь-який рядок коду, пройшовши scope chain вручну;
> - пояснити різницю між global, module, function і block scope та де живуть `var`, `let`, `const`, `class` і функції;
> - передбачити поведінку hoisting для кожного виду оголошення (`undefined`, `ReferenceError` чи робоча функція);
> - пояснити, що таке TDZ і чому вона «часова», а не «просторова»;
> - обрати між function declaration і function expression, розуміючи наслідки.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jsd-04-quiz-01
>
> ```js
> var a = 1;
> function test() {
>   console.log(a);
>   var a = 2;
>   console.log(a);
> }
> test();
> ```
>
> **Відповідь:** `undefined 2`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Більшість відповідає `1 2`, але `var a` всередині функції створює **власну** змінну `a` ще до виконання першого рядка (hoisting). Вона затінює глобальну `a` і до присвоєння дорівнює `undefined`.

## 🧒 Простими словами

Уяви багатоповерховий будинок, де на кожному поверсі є таблиця з іменами мешканців. Шукаєш «Аню» — спершу дивишся таблицю свого поверху, потім спускаєшся поверхом нижче, і так до першого (глобального). Піднятися вище не можна. Це **scope chain**. А **hoisting** — це те, що коменданти заздалегідь вписують у таблицю всіх, хто *заселиться* на поверх, ще до їхнього приїзду. Різниця лише в тому, що відповідає комендант, коли питаєш про ще не приїжджого: про `var` — «є такий, але кімната поки порожня» (`undefined`), про `let`/`const` — «є такий, але до приїзду до нього не можна» (TDZ, `ReferenceError`).

## 🔬 Як це працює насправді

### 🗺️ Лексичний scope і scope chain

**Scope** (область видимості) — частина програми, де ім'я змінної прив'язане до певного значення. У JS scope **лексичний** (статичний): він визначається тим, **де функція написана** в коді, а не тим, звідки її викликали.

```js
const x = 'global';
function show() {
  console.log(x); // x шукається там, де show НАПИСАНА
}
function run() {
  const x = 'local';
  show();
}
run(); // → 'global'
```

Пошук імені — це **scope chain**: поточний scope → зовнішній → ще зовнішній → … → глобальний. Знайшли — зупинились. Не знайшли ніде — `ReferenceError`.

```js
function outer() {
  const msg = 'з outer';
  function middle() {
    function inner() {
      return msg; // inner → middle → outer: знайдено
    }
    return inner();
  }
  return middle();
}
outer(); // → 'з outer'
```

Технічно кожен scope — це **environment record** зі списком імен і посиланням на зовнішній (див. [[JavaScript - 01. Як JS виконує код]]). Саме це посилання на зовнішнє оточення робить можливими [[JavaScript - 05. Замикання]].

> [!quiz] Перевір себе: що виведе код?
> level: junior · type: output · id: jsd-04-quiz-02
>
> ```js
> const level = 'global';
> function log() { return level; }
> function wrapper() {
>   const level = 'wrapper';
>   return log();
> }
> console.log(wrapper());
> ```
>
> **Відповідь:** `global`
>
> **Пояснення:** `log` оголошена на верхньому рівні, тож її зовнішній scope — глобальний, незалежно від того, що викликають її зсередини `wrapper`. Це і є лексичний scope. (Якби scope був *динамічним*, як у bash, ми б отримали `'wrapper'`.)

### 🧱 Види scope

| Scope | Що створює | Що в ньому живе |
|---|---|---|
| **Global** | сам скрипт | `var` і function declarations верхнього рівня (як властивості `globalThis`) + `let`/`const`/`class` верхнього рівня (окремо від `globalThis`) |
| **Module** | кожен ES-модуль | усі оголошення модуля; назовні — лише те, що `export` |
| **Function** | кожен виклик функції | параметри, `var`, `let`, `const`, вкладені функції |
| **Block** | `{ }`, `if`, `for`, `while`, `switch`, `try/catch` | `let`, `const`, `class` (і функції в блоці в strict mode) |

Головна відмінність: **`var` не бачить блоків** — він прив'язується до найближчої функції (або глобального scope). `let`, `const` і `class` — до найближчого блоку.

```js
if (true) {
  var a = 1;
  let b = 2;
}
console.log(typeof a, typeof b); // → 'number' 'undefined'

for (var i = 0; i < 3; i++) {}
console.log(i); // → 3 — var «витік» з циклу
```

**Shadowing** (затінення) — оголошення з тим самим ім'ям у вкладеному scope. Внутрішнє ім'я ховає зовнішнє до кінця свого scope.

```js
let count = 1;
{
  let count = 2;
  {
    let count = 3;
    console.log(count); // → 3
  }
  console.log(count); // → 2
}
console.log(count); // → 1
```

> [!viz] scope-chain
> scenario: shadowing

Не будь-яке затінення дозволене. `var` всередині блоку «піднімається» до функції й конфліктує з `let` того самого рівня:

```js
let q = 1;
{
  var q = 2; // SyntaxError: Identifier 'q' has already been declared
}
```

Ще одна важлива різниця: присвоєння **неоголошеній** змінній у sloppy mode тихо створює глобальну змінну. У strict mode (і в модулях, і в класах — вони завжди strict) — `ReferenceError`.

```js
function sloppy() { leaked = 5; }
sloppy();
console.log(globalThis.leaked); // → 5 — випадкова глобальна змінна
```

> [!quiz] Перевір себе: оберіть правдиві твердження
> level: junior · type: multi · id: jsd-04-quiz-03
> - [x] `var`, оголошений всередині `if`, видно після `if` у тій самій функції
> - [ ] `let`, оголошений у `for (let i...)`, видно після циклу
> - [x] Кожен ES-модуль має власний scope верхнього рівня
> - [ ] Scope функції визначається місцем її виклику
> - [x] Внутрішня `const x` може затінити зовнішню `let x`
>
> **Пояснення:** `var` ігнорує блоки, `let` — ні. Scope визначається місцем **оголошення** (лексично). Затінення між різними scope дозволене для будь-яких видів оголошень, окрім випадку, коли `var` «спливає» в scope, де вже є `let`/`const` з тим самим ім'ям.

> [!quiz] Перевір себе: склади цикл, після якого кожна функція «пам'ятає» свій `i`
> level: junior · type: order · id: jsd-04-quiz-06
>
> ```js order
> const fns = []
> for (let i = 0; i < 3; i++) {
>   fns.push(() => i)
> }
> fns.map((f) => f()) // → [0, 1, 2]
> for (var i = 0; i < 3; i++) { // ✗
> ```
>
> **Пояснення:** `let` у заголовку `for` створює **нову** прив'язку `i` на кожній ітерації, тож кожна стрілка бачить свою. З `var` прив'язка одна на всю функцію, і всі три стрілки повернуть `3`.

### 🎈 Hoisting: що «спливає» і як

**Hoisting** — наслідок фази створення контексту: перед виконанням коду scope рушій реєструє **всі** оголошення цього scope. Код нікуди не переміщується — просто імена відомі з самого початку. Різниця — у тому, **чим вони ініціалізовані**:

| Оголошення | Scope | До рядка оголошення |
|---|---|---|
| `var x` | функція | `undefined` |
| `let x` / `const x` | блок | TDZ → `ReferenceError` |
| `class X` | блок | TDZ → `ReferenceError` |
| `function f() {}` | функція (блок у strict) | **повністю готова функція** |
| `var f = function () {}` | функція | `undefined` → виклик дає `TypeError` |
| `const f = () => {}` | блок | TDZ → `ReferenceError` |
| `import` | модуль | вже прив'язаний до експорту (і виконаний модуль) |

```js
console.log(typeof decl, typeof expr); // → 'function' 'undefined'
decl();   // ✅ працює
// expr(); // ❌ TypeError: expr is not a function

function decl() {}
var expr = function () {};
```

> [!viz] hoisting
> scenario: var-let-function

Якщо є і `var`, і function declaration з тим самим ім'ям, на фазі створення перемагає функція, а `var` лише не створює дубліката. Значення зміниться тільки коли виконання дійде до присвоєння.

```js
console.log(typeof thing); // → 'function'
var thing = 1;
function thing() {}
console.log(typeof thing); // → 'number'
```

**Function declaration vs function expression** — не лише про hoisting:

- **Declaration** (`function f() {}`) — оголошення-інструкція. Доступна з початку scope. Зручно для «спершу головне, допоміжні функції внизу».
- **Expression** (`const f = function () {}`, `const f = () => {}`) — значення у виразі. Доступна лише після присвоєння, можна передавати, повертати, створювати умовно.
- **Named function expression** (`const f = function inner() {}`) — ім'я `inner` видно **лише всередині** самої функції: корисно для рекурсії й читабельних stack trace.

```js
const fact = function inner(n) {
  return n <= 1 ? 1 : n * inner(n - 1);
};
fact(5);        // → 120
typeof inner;   // → 'undefined' — назовні імені немає
```

> [!quiz] Перевір себе: що виведе код?
> level: junior · type: output · id: jsd-04-quiz-04
>
> ```js
> console.log(typeof greet, typeof hello);
> var hello = () => 'hi';
> function greet() { return 'hey'; }
> ```
>
> **Відповідь:** `function undefined`
>
> **Пояснення:** `greet` — function declaration, створена повністю ще на фазі створення. `hello` — це `var`, ініціалізований `undefined`; стрілкова функція присвоїться лише коли виконання дійде до цього рядка.

> [!quiz] Перевір себе: впиши ключові слова, щоб коментарі стали правдою
> level: junior · type: fill · id: jsd-04-quiz-07 · bank: class, async
>
> ```js fill
> console.log(a)        // → undefined
> console.log(typeof f) // → 'function'
> [[var]] a = 1
> [[function]] f() {}
> {
>   [[let|const]] b = 2
> }
> console.log(typeof b) // → 'undefined' — b живе лише в блоці
> ```
>
> **Пояснення:** до свого рядка `var` уже існує зі значенням `undefined`, а function declaration — повністю готова функція. `let`/`const` прив'язані до блоку, тож поза `{}` імені `b` немає, і `typeof` чесно повертає `'undefined'`. З `var b` вийшло б `'number'`.

### ⏳ TDZ — Temporal Dead Zone

`let`, `const` і `class` теж «спливають»: їхні імена реєструються на початку блоку. Але вони лишаються **неініціалізованими** до моменту, коли виконання дійде до рядка оголошення. Проміжок між початком scope і цим рядком — **TDZ**. Будь-яке звернення в TDZ кидає `ReferenceError`.

```js
let x = 'outer';
{
  console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = 'inner';
}
```

Зверни увагу: тут **не** виводиться `'outer'`. Внутрішній `x` уже зареєстрований у блоці й затіняє зовнішній з першого рядка блоку — просто ще не ініціалізований. Це й доводить, що `let` теж «спливає».

> [!viz] hoisting
> scenario: tdz

Чому «temporal» (часова)? Бо важливий **момент виконання**, а не місце в тексті. Функція може посилатися на змінну, оголошену нижче, — якщо **викликана** після оголошення:

```js
function later() {
  return lateVar; // тут TDZ не діє — питання лише в тому, КОЛИ викличемо
}
let lateVar = 'ok';
later(); // → 'ok'
```

Інші місця, де ловиться TDZ:

```js
typeof notYet; let notYet = 1;   // ReferenceError — typeof не рятує!
let self = self;                  // ReferenceError — праву частину обчислюють до ініціалізації
function f(a = b, b = 1) {}       // f() → ReferenceError — параметри теж мають TDZ
new User(); class User {}         // ReferenceError
```

Навіщо взагалі TDZ? Щоб `const` мала **одне** значення за весь час життя (без проміжного `undefined`) і щоб помилки «використання до оголошення» ловились одразу, а не перетворювались на тихий `undefined`.

> [!quiz] Перевір себе: що станеться?
> level: middle · id: jsd-04-quiz-05
>
> ```js
> const theme = 'light';
> function getTheme() {
>   if (true) {
>     return theme;
>     const theme = 'dark';
>   }
> }
> getTheme();
> ```
>
> - [ ] Поверне `'light'`
> - [ ] Поверне `'dark'`
> - [ ] Поверне `undefined`
> - [x] `ReferenceError`
>
> **Пояснення:** `const theme` у блоці `if` зареєстрована з початку блоку й затіняє зовнішню. `return theme` виконується, коли вона ще в TDZ. Те, що рядок оголошення ніколи не виконається, не має значення — ім'я вже належить блоку.

## ⚠️ Пастки

> [!pitfall] `var` у циклі з асинхронним callback-ом
> Один `var i` на всю функцію — усі callback-и бачать фінальне значення. Детально — у [[JavaScript - 05. Замикання]].
>
> ```js
> for (var i = 0; i < 3; i++) {
>   setTimeout(() => console.log(i)); // → 3, 3, 3
> }
> for (let j = 0; j < 3; j++) {
>   setTimeout(() => console.log(j)); // → 0, 1, 2
> }
> ```

> [!pitfall] Виклик function expression до присвоєння
> Помилка залежить від ключового слова — і обидві вводять в оману, якщо не знаєш hoisting.
>
> ```js
> init(); // з var: TypeError: init is not a function
>         // з const: ReferenceError: Cannot access 'init' before initialization
> var init = function () {};
> ```

> [!pitfall] Функція в блоці в sloppy mode
> Поза strict mode function declaration всередині `if` поводиться за спеціальними правилами Annex B: вона і block-scoped, і частково «витікає» у функцію як `var`. Результат залежить від того, чи виконався блок. Рішення — модулі/strict mode або function expression.
>
> ```js
> // sloppy mode
> console.log(typeof f); // → 'undefined' (не 'function'!)
> if (true) { function f() {} }
> console.log(typeof f); // → 'function'
> ```

## 🎤 На співбесіді

> [!interview] Що таке hoisting? Чи «спливають» let і const?
> level: junior · frequency: дуже часто · id: jsd-04-int-01
>
> ---
>
> Hoisting — поведінка, коли оголошення відомі з самого початку свого scope, бо рушій реєструє їх на фазі створення контексту, до виконання коду. Відрізняється ініціалізація: `var` отримує `undefined`, function declaration — одразу готову функцію, а `let`, `const` і `class` реєструються, але лишаються неініціалізованими до свого рядка — це TDZ, звернення кидає `ReferenceError`. Тож так, `let`/`const` спливають, що видно з затінення: `let x = 1; { console.log(x); let x = 2; }` кидає помилку, а не виводить `1`.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🎈 Hoisting: що «спливає» і як|Розділ: hoisting]] · [MDN: Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting) · [Spec: Let and Const Declarations](https://tc39.es/ecma262/#sec-let-and-const-declarations)

> [!interview] Чим відрізняються var, let і const?
> level: junior · frequency: дуже часто · id: jsd-04-int-02
>
> ---
>
> **Scope:** `var` — функціональний, `let`/`const` — блочний. **Hoisting:** `var` ініціалізується `undefined`, `let`/`const` мають TDZ. **Повторне оголошення:** `var` дозволяє, `let`/`const` — `SyntaxError`. **Глобальний об'єкт:** `var` на верхньому рівні скрипта стає властивістю `window`, `let`/`const` — ні. **Перепризначення:** `const` забороняє (але не мутацію об'єкта). У циклах `let` створює нову змінну на кожну ітерацію. Практика: `const` за замовчуванням, `let` коли треба перепризначати, `var` — не використовувати.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🧱 Види scope|Розділ: види scope]] · [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) · [javascript.info: The old "var"](https://javascript.info/var)

> [!interview] Що таке лексичний scope?
> level: middle · frequency: часто · id: jsd-04-int-03
>
> ---
>
> Scope визначається місцем, де функція **написана** в коді, а не місцем виклику. Під час пошуку імені рушій іде від поточного scope назовні по ланцюжку, який зафіксований при створенні функції. Тому функція, оголошена на верхньому рівні, не бачить локальних змінних функції, яка її викликає. Протилежність — динамічний scope (bash, старі Lisp-и). Лексичний scope робить можливими замикання і дозволяє рушію та інструментам аналізувати змінні статично.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🗺️ Лексичний scope і scope chain|Розділ: лексичний scope]] · [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) · [Spec: Environment Records](https://tc39.es/ecma262/#sec-environment-records)

## 🔗 Зв'язки

- [[JavaScript - 01. Як JS виконує код]] — hoisting — це просто фаза створення execution context, побачена «ззовні».
- [[JavaScript - 05. Замикання]] — замикання = функція + лексичний scope, у якому вона народилась.
- [[JavaScript - 06. this]] — на відміну від змінних, `this` звичайних функцій **не** лексичний — він визначається викликом.
- [[JavaScript - 07. Прототипи та класи]] — класи мають TDZ і завжди виконуються в strict mode.

## ⚡ Фішки

> [!reel] 👻 let теж спливає — і ось доказ
> Якби `let` не спливав, код нижче вивів би `1`. Але внутрішній `x` вже «займає» весь блок і затіняє зовнішній ще до свого рядка.
>
> ```js
> let x = 1;
> { console.log(x); let x = 2; }
> // → ReferenceError
> ```

> [!reel] 🧨 typeof — не завжди безпечний
> `typeof` неоголошеної змінної дає `'undefined'` без помилки. Але для змінної в TDZ — `ReferenceError`. Тож «typeof ніколи не кидає» — міф з часів до ES2015.

> [!reel] 🥊 Функція перемагає var
> Коли `var` і function declaration мають однакове ім'я, на старті переможе функція. `var` лише перезапише її, коли виконання дійде до присвоєння.
>
> ```js
> console.log(typeof t); // → 'function'
> var t = 1;
> function t() {}
> ```

> [!reel] 🕳️ Одна забута let — і в тебе глобальна змінна
> У sloppy mode присвоєння неоголошеній змінній створює властивість `globalThis`. Модулі й класи — завжди strict, тож там це `ReferenceError`. Ще одна причина писати модулями.

> [!reel] 🪞 Ім'я named function expression видно лише зсередини
> У `const f = function inner() {}` ім'я `inner` існує тільки в тілі функції. Назовні — `undefined`. Ідеально для рекурсії, яка не зламається, якщо `f` перепризначать.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Яка різниця між function scope і block scope?
> *часто · порівняння* · `jsd-04-001`
>
> Function scope — змінна видна в усій функції (так поводиться `var`). Block scope — лише в межах `{ }`, де оголошена (`let`, `const`, `class`). Тому `var` у `for` чи `if` видно після блоку.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🧱 Види scope|Розділ: види scope]] · [MDN: Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope) · [MDN: Block statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block)

> [!question]- Що виведе `console.log(a); var a = 5;` і чому?
> *дуже часто · код* · `jsd-04-002`
>
> `undefined`. Оголошення `var a` реєструється на фазі створення й ініціалізується `undefined`; присвоєння `= 5` відбудеться лише на своєму рядку.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🎈 Hoisting: що «спливає» і як|Розділ: hoisting]] · [MDN: var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var) · [MDN: Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)

> [!question]- Що таке TDZ?
> *дуже часто · теорія* · `jsd-04-003`
>
> Temporal Dead Zone — проміжок від початку scope до рядка оголошення `let`/`const`/`class`. Ім'я вже зареєстроване, але не ініціалізоване, і будь-яке звернення (навіть `typeof`) кидає `ReferenceError`.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#⏳ TDZ — Temporal Dead Zone|Розділ: TDZ]] · [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) · [Spec: Let and Const Declarations](https://tc39.es/ecma262/#sec-let-and-const-declarations)

> [!question]- Що таке shadowing?
> *іноді · теорія* · `jsd-04-004`
>
> Оголошення у вкладеному scope змінної з тим самим ім'ям, що й у зовнішньому. Внутрішня змінна ховає зовнішню до кінця свого scope; зовнішня при цьому не змінюється.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🗺️ Лексичний scope і scope chain|Розділ: scope chain]] · [MDN: Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope) · [javascript.info: Variable scope, closure](https://javascript.info/closure)

### 🟡 Middle

> [!question]- Чому TDZ називається «часовою»?
> *іноді · теорія* · `jsd-04-005`
>
> Бо важливий момент виконання, а не позиція в тексті. Функція, яка звертається до `let`, оголошеної нижче, працює коректно, якщо її **викликали** після ініціалізації. А код, що виконується до рядка оголошення, отримає `ReferenceError`, навіть якщо текстово стоїть «нижче» іншого коду.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#⏳ TDZ — Temporal Dead Zone|Розділ: TDZ]] · [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) · [YDKJS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-closures)

> [!question]- Чим function declaration відрізняється від function expression?
> *часто · порівняння* · `jsd-04-006`
>
> Declaration — інструкція, повністю hoisted: функцію можна викликати до її рядка. Expression — значення у виразі: доступне лише після присвоєння (`var` → `TypeError`, `let`/`const` → `ReferenceError`). Expression можна передавати, створювати умовно, робити стрілковою. Named function expression дає ім'я, видиме тільки всередині функції.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🎈 Hoisting: що «спливає» і як|Розділ: hoisting функцій]] · [MDN: function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) · [javascript.info: Function expressions](https://javascript.info/function-expressions)

> [!question]- Чому `let x = 1; { var x = 2; }` — SyntaxError?
> *рідко · код* · `jsd-04-007`
>
> `var` ігнорує блок і належить зовнішньому scope (функції або глобальному), де вже є `let x`. Два оголошення одного імені в одному scope, одне з яких `let`, — заборонені. Помилка виявляється на етапі парсингу.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🧱 Види scope|Розділ: види scope]] · [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) · [MDN: var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)

> [!question]- Навіщо мові потрібна TDZ, якщо `var` жив без неї?
> *іноді · теорія* · `jsd-04-008`
>
> Щоб `const` мала рівно одне значення за все життя (без проміжного `undefined`) і щоб звернення до змінної до ініціалізації було гучною помилкою, а не тихим `undefined`, який вилізе далеко від причини. Також це дозволяє класам і `const` бути безпечними при циклічних імпортах модулів — ти отримуєш помилку, а не напівготовий об'єкт.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#⏳ TDZ — Temporal Dead Zone|Розділ: TDZ]] · [Spec: Let and Const Declarations](https://tc39.es/ecma262/#sec-let-and-const-declarations) · [YDKJS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-closures)

### 🔴 Senior

> [!question]- Як поводиться function declaration всередині блоку?
> *рідко · теорія* · `jsd-04-009`
>
> У strict mode — як `let`: видна лише в блоці (але hoisted у межах блоку). У sloppy mode діють правила Annex B: функція block-scoped, але ще й створюється `var`-змінна з тим самим ім'ям у функції, якій значення присвоюється, коли виконання проходить через оголошення. До цього — `undefined`. Через цю непередбачуваність функції в блоках варто оголошувати як expression.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🎈 Hoisting: що «спливає» і як|Розділ: функції в блоках]] · [MDN: function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) · [Spec: Block-Level Function Declarations (Annex B)](https://tc39.es/ecma262/#sec-block-level-function-declarations-web-legacy-compatibility-semantics)

> [!question]- Чи мають параметри функції власний scope?
> *рідко · код* · `jsd-04-010`
>
> Так, якщо є хоча б одне значення за замовчуванням: параметри живуть в окремому scope між зовнішнім і тілом функції, і мають TDZ зліва направо. Тому `function f(a = b, b) {}` при виклику без аргументів кидає `ReferenceError`, а `function f(a, b = a) {}` — працює. Default-значення не бачать змінних, оголошених у тілі функції.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🧱 Види scope|Розділ: scope параметрів]] · [MDN: Default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) · [Spec: FunctionDeclarationInstantiation](https://tc39.es/ecma262/#sec-functiondeclarationinstantiation)

## 🛠️ Практика

> [!task] Знайди, що побачить кожен рядок
> level: junior · difficulty: easy · id: jsd-04-task-01 · tags: scope, hoisting
>
> Для кожного `console.log` вкажи результат (значення або тип помилки). Помилка зупиняє виконання, тож уяви, що кожен рядок виконується окремо в цьому стані.
>
> ```js
> var a = 'A';
> let b = 'B';
> function check() {
>   console.log(a); // (1)
>   console.log(b); // (2)
>   console.log(c); // (3)
>   var a = 'a';
>   let b = 'b';
>   const c = 'c';
> }
> check();
> ```
>
> Запиши відповіді **рядками** в масив `results`: значення — так, як його надрукує консоль (`'A'`, `'undefined'`), помилку — її ім'ям (`'TypeError'`, `'ReferenceError'`).
>
> ```js starter
> const results = [
>   // твій код: відповіді для (1), (2), (3)
> ]
> ```
>
> ```js tests
> test('(1): локальна var a вже існує, але ще без значення', () => {
>   expect(results[0]).toBe('undefined')
> })
>
> test('(2): локальна let b затіняє зовнішню і ще в TDZ', () => {
>   expect(results[1]).toBe('ReferenceError')
> })
>
> test('(3): const c теж у TDZ до свого рядка', () => {
>   expect(results[2]).toBe('ReferenceError')
>   expect(results).toHaveLength(3)
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу випиши всі оголошення функції `check` — вони затіняють зовнішні з першого рядка тіла.
>
> > [!hint]- Підказка 2
> > Зовнішні `a` і `b` взагалі не будуть видні всередині `check`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const results = [
> >   'undefined',      // (1) локальна var a, ще без значення
> >   'ReferenceError', // (2) TDZ: локальна let b затіняє зовнішню
> >   'ReferenceError', // (3) TDZ: локальна const c
> > ]
> > ```
> >
> > Насправді код зупиниться на (2). Головна думка: локальні оголошення займають ім'я в усьому тілі функції/блоку ще до свого рядка — і зовнішні змінні з тим самим ім'ям стають недосяжними.

> [!task] Поясни своїми словами hoisting
> level: junior · difficulty: medium · id: jsd-04-task-02 · tags: feynman, hoisting
>
> Поясни другові, який вперше бачить JS, чому `console.log(x); var x = 1;` виводить `undefined`, а `console.log(y); let y = 1;` — помилку. Без слова «спливає» і без фрази «JS переносить код наверх».
>
> > [!hint]- Підказка 1
> > Що рушій робить з кодом **до** того, як виконати перший рядок?
>
> > [!hint]- Підказка 2
> > Аналогія: список гостей на вечірці складається заздалегідь, а самі гості приходять пізніше.
>
> > [!solution]- Еталонне пояснення
> > Перед тим як виконувати код, JS прочитує його й складає «список гостей» — усі змінні й функції, які будуть оголошені в цьому блоці. Код при цьому нікуди не переноситься: рядки виконуються у звичайному порядку, просто імена відомі заздалегідь.
> >
> > Різниця в тому, що написано біля імені у списку. Біля `var` — «прийде, поки що місце порожнє» (`undefined`). Тож коли ми питаємо про `x` до його рядка, отримуємо порожнє місце. Біля `let` і `const` — «прийде, але до його приходу не впускати». Ім'я вже в списку (тому зовнішня змінна з тим самим ім'ям теж не допоможе), але звернутись до нього до рядка оголошення не можна — охоронець кидає `ReferenceError`. Цей період очікування називається Temporal Dead Zone. Функції, оголошені через `function`, приходять одразу «з речами» — тому їх можна викликати навіть до рядка оголошення.

> [!task] Полагодь «модуль» без жодного let у глобальному scope
> level: middle · difficulty: hard · id: jsd-04-task-03 · tags: scope, iife, modules
>
> Цей код підключено через класичний `<script>` разом з іншими скриптами. Він засмічує глобальний scope (`count`, `step`, `helper`) і ламає чужий код, який теж має `helper`. Перепиши його так, щоб назовні був видимий **лише** `globalThis.counter` (у браузері це той самий `window.counter`) з методами `next()` і `reset()`, а поведінка не змінилась. ES-модулі використовувати не можна.
>
> ```js
> var count = 0;
> var step = 2;
> function helper() { return count += step; }
> var counter = {
>   next: function () { return helper(); },
>   reset: function () { count = 0; },
> };
> ```
>
> ```js starter
> // перепиши цей код
> var count = 0;
> var step = 2;
> function helper() { return count += step; }
> var counter = {
>   next: function () { return helper(); },
>   reset: function () { count = 0; },
> };
> ```
>
> ```js tests
> test('counter доступний через globalThis', () => {
>   expect(typeof globalThis.counter).toBe('object')
>   expect(typeof globalThis.counter.next).toBe('function')
> })
>
> test('next додає крок 2', () => {
>   globalThis.counter.reset()
>   expect(globalThis.counter.next()).toBe(2)
>   expect(globalThis.counter.next()).toBe(4)
> })
>
> test('reset повертає лічильник до нуля', () => {
>   globalThis.counter.next()
>   globalThis.counter.reset()
>   expect(globalThis.counter.next()).toBe(2)
> })
>
> test('count, step і helper не видно назовні', () => {
>   expect(typeof count).toBe('undefined')
>   expect(typeof step).toBe('undefined')
>   expect(typeof helper).toBe('undefined')
> })
> ```
>
> > [!hint]- Підказка 1
> > Яка конструкція створює новий function scope і виконується одразу?
>
> > [!hint]- Підказка 2
> > IIFE: `(function () { ... })()` або `(() => { ... })()`. Що вона має повернути?
>
> > [!solution]- Еталонне рішення
> > ```js
> > globalThis.counter = (() => {
> >   let count = 0;
> >   const step = 2;
> >   const helper = () => (count += step);
> >   return {
> >     next: () => helper(),
> >     reset: () => { count = 0; },
> >   };
> > })();
> >
> > counter.next(); // → 2
> > counter.next(); // → 4
> > counter.reset();
> > counter.next(); // → 2
> > ```
> >
> > IIFE створює окремий function scope: `count`, `step`, `helper` тепер локальні й недосяжні ззовні, а методи об'єкта досі бачать їх через scope chain (це замикання — див. наступний розділ). Це класичний **module pattern** з епохи до ES-модулів. Сьогодні той самий ефект дає `<script type="module">`, де кожен файл має свій scope.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Variable scope, closure](https://javascript.info/closure) — лексичне оточення, блоки й scope chain з малюнками.
- 🟢 [javascript.info — The old "var"](https://javascript.info/var) — чим `var` відрізняється від `let`/`const` і що таке IIFE.
- 🟡 [MDN — Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting) — коротко про чотири види hoisting.
- 🟡 [MDN — let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) — TDZ, redeclaration і блочний scope з прикладами.
- 🟡 [YDKJS — Scope & Closures](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-closures) — книга Кайла Сімпсона про scope і замикання.
- 🔴 [ECMAScript — Let and Const Declarations](https://tc39.es/ecma262/#sec-let-and-const-declarations) — чому binding існує до ініціалізації (TDZ).
- 🔴 [ECMAScript — FunctionDeclarationInstantiation](https://tc39.es/ecma262/#sec-functiondeclarationinstantiation) — як створюються bindings параметрів і тіла функції.
- 🔴 [ECMAScript — Block-Level Function Declarations (Annex B)](https://tc39.es/ecma262/#sec-block-level-function-declarations-web-legacy-compatibility-semantics) — Annex B: дивна поведінка function declaration у блоках.

> [!important] Підсумок
> - Scope лексичний: змінна шукається від місця, де код **написаний**, назовні по scope chain; не знайшли — `ReferenceError`.
> - `var` — function scope, `let`/`const`/`class` — block scope; модулі мають власний scope верхнього рівня.
> - Hoisting = реєстрація оголошень до виконання: `var` → `undefined`, function declaration → готова функція, `let`/`const`/`class` → TDZ.
> - TDZ — від початку scope до рядка оголошення; «часова», бо важить момент виконання, а не позиція в тексті.
> - Function declaration доступна до свого рядка, function expression — лише після присвоєння.
