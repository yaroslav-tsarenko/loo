---
title: Типи, змінні та приведення типів
order: 1
tags: [types, coercion, variables, equality, numbers]
estimatedMinutes: 60
---

# JS Interview Q&A — 01. Типи, змінні та приведення типів

## 🟢 Junior

> [!question]- Які типи даних існують у JavaScript?
> *дуже часто · теорія* · `js-01-001`
>
> У JavaScript 8 типів: 7 **примітивів** — `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol` — і `object`. Масиви, функції, дати, `Map`, регулярні вирази — це різновиди `object`, а не окремі типи мови.
>
> Примітив — незмінне значення без власних властивостей. Коли пишете `'abc'.toUpperCase()`, рушій тимчасово обгортає рядок в об'єкт `String` (autoboxing), викликає метод і відкидає обгортку.
>
> ```js
> typeof 42n;        // "bigint"
> typeof Symbol();   // "symbol"
> typeof [];         // "object"
> typeof (() => {}); // "function", хоча функція теж object
> ```
>
> **На співбесіді:** назвіть саме 8 типів і уточніть, що функція — це callable object, а не окремий тип за специфікацією.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#🧱 Сім примітивів і об'єкт|Розділ: типи даних]] · [MDN: JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures) · [Spec: ECMAScript Language Types](https://tc39.es/ecma262/#sec-ecmascript-language-types)

> [!question]- Чим примітиви відрізняються від об'єктів при копіюванні та порівнянні?
> *дуже часто · порівняння* · `js-01-002`
>
> Примітиви копіюються і порівнюються **за значенням**, об'єкти — **за посиланням**. Змінна з об'єктом зберігає reference, тому присвоєння копіює лише посилання, і обидві змінні вказують на той самий об'єкт.
>
> Наслідки:
> - зміна через одну змінну видна через іншу;
> - `===` для об'єктів дає `true` лише для того самого об'єкта;
> - у функцію передається копія посилання (call by sharing): мутувати об'єкт можна, а переприсвоєння параметра назовні не впливає.
>
> ```js
> let a = 'hi';
> let b = a;
> b += '!';
> console.log(a); // 'hi'
>
> const o1 = { n: 1 };
> const o2 = o1;
> o2.n = 2;
> console.log(o1.n); // 2
> console.log({ n: 1 } === { n: 1 }); // false
> ```
>
> 📚 [[JavaScript - 03. Значення та посилання#🏷️ Змінна — це ярлик, а не коробка|Розділ: значення та посилання]] · [javascript.info: Object references and copying](https://javascript.info/object-copy) · [MDN: Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)

> [!question]- Які особливості має оператор `typeof`?
> *дуже часто · код* · `js-01-003`
>
> `typeof` повертає рядок з назвою типу, але має кілька історичних винятків:
> - `typeof null === 'object'` — баг першої реалізації, який залишили заради сумісності;
> - для функцій повертає `'function'`, хоча функція — об'єкт;
> - для неоголошеної змінної повертає `'undefined'` без помилки (але для `let`/`const` у TDZ кидає `ReferenceError`);
> - `typeof NaN === 'number'`.
>
> ```js
> typeof null;        // "object"
> typeof undeclared;  // "undefined"
> typeof NaN;         // "number"
>
> const isObject = (x) => x !== null && typeof x === 'object';
> Array.isArray([]);  // true — масиви перевіряють так
> ```
>
> **На співбесіді:** для `null` перевіряйте `x === null`, для масивів — `Array.isArray`, а не `typeof`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#🏷️ typeof і його дивацтва|Розділ: typeof]] · [MDN: typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) · [Spec: The typeof Operator](https://tc39.es/ecma262/#sec-typeof-operator)

> [!question]- Яка різниця між `null` і `undefined`?
> *дуже часто · порівняння* · `js-01-004`
>
> `undefined` означає «значення ще не присвоєно» — так рушій позначає неініціалізовану змінну, відсутню властивість, непереданий аргумент і результат функції без `return`. `null` — явне «значення відсутнє», яке ставить програміст.
>
> ```js
> let x;
> console.log(x);                        // undefined
> console.log({}.missing);               // undefined
> console.log(typeof null);              // "object"
> console.log(null == undefined);        // true
> console.log(null === undefined);       // false
> console.log(Number(null), Number(undefined)); // 0 NaN
> ```
>
> Практичні відмінності: `JSON.stringify` викидає властивості зі значенням `undefined`, але зберігає `null`; параметр за замовчуванням спрацьовує лише на `undefined`.
>
> **На співбесіді:** домовленість «`undefined` ставить рушій, `null` — ми» робить API передбачуваним.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#🧱 Сім примітивів і об'єкт|Розділ: null і undefined]] · [MDN: null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null) · [MDN: undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)

> [!question]- Яка різниця між `var`, `let` і `const`?
> *дуже часто · порівняння* · `js-01-005`
>
> - Scope: `var` — функціональний (або глобальний), `let`/`const` — **блочний**.
> - Hoisting: усі три піднімаються, але `var` одразу ініціалізується `undefined`, а `let`/`const` до рядка оголошення перебувають у **TDZ**.
> - Повторне оголошення: `var` дозволяє, `let`/`const` у тому самому scope — `SyntaxError`.
> - Глобальний об'єкт: `var` на верхньому рівні скрипта створює властивість `globalThis`, `let`/`const` — ні.
> - `const` вимагає ініціалізатор і забороняє переприсвоєння.
>
> ```js
> if (true) {
>   var a = 1;
>   let b = 2;
> }
> console.log(a);        // 1
> console.log(typeof b); // "undefined" — b не видно поза блоком
> ```
>
> **На співбесіді:** правило за замовчуванням — `const`, `let` лише коли потрібне переприсвоєння, `var` у новому коді не використовують.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🧱 Види scope|Розділ: var, let і const]] · [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) · [javascript.info: The old "var"](https://javascript.info/var)

> [!question]- Чи можна змінити об'єкт, оголошений через `const`?
> *дуже часто · код* · `js-01-006`
>
> Так. `const` забороняє **переприсвоєння binding**, а не мутацію значення. Змінна назавжди вказує на той самий об'єкт, але вміст об'єкта можна змінювати.
>
> ```js
> const user = { name: 'Ann' };
> user.name = 'Bob';  // працює
> // user = {};       // TypeError: Assignment to constant variable.
>
> const cfg = Object.freeze({ db: { host: 'a' } });
> cfg.db = null;       // ігнорується (у strict mode — TypeError)
> cfg.db.host = 'b';   // спрацює: freeze поверхневий
> ```
>
> Для справжньої незмінності потрібен рекурсивний `Object.freeze` (deep freeze) або підхід, де дані не мутують взагалі: оновлення через spread чи `toSorted` створюють нові об'єкти замість зміни старих.
>
> **На співбесіді:** часта пастка — вважати, що `const` робить об'єкт immutable. Правильне формулювання: `const` — про змінну, а не про значення.
>
> 📚 [[JavaScript - 03. Значення та посилання#🔒 Мутація, перепризначення і const|Розділ: мутація і const]] · [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) · [MDN: Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

> [!question]- Яка різниця між `==` і `===`?
> *дуже часто · порівняння* · `js-01-007`
>
> `===` порівнює без приведення типів: різні типи — одразу `false`, однакові — за значенням (об'єкти за посиланням). `==` спершу приводить операнди до спільного типу за алгоритмом IsLooselyEqual: рядок і число → число, boolean → число, об'єкт → примітив, а `null` дорівнює лише `undefined`.
>
> ```js
> 0 == '';           // true
> '1' == 1;          // true
> false == '0';      // true
> null == 0;         // false
> null == undefined; // true
> NaN == NaN;        // false, і NaN === NaN теж false
> ```
>
> Спільне для обох: `NaN` не дорівнює нічому, `+0` дорівнює `-0`.
>
> **На співбесіді:** за замовчуванням `===`; єдиний поширений виняток — `x == null`, що ловить одночасно `null` і `undefined`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚖️ == проти ===|Розділ: == проти ===]] · [MDN: Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness) · [MDN: Strict equality (===)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)

> [!question]- Які значення в JavaScript є falsy?
> *часто · теорія* · `js-01-008`
>
> Falsy-значень рівно вісім: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`. Плюс історичний виняток `document.all` у браузерах. Усе інше truthy — зокрема `'0'`, `'false'`, `' '`, `[]`, `{}` і `new Boolean(false)`.
>
> ```js
> Boolean('0');               // true
> Boolean([]);                // true
> Boolean(0n);                // false
> Boolean(new Boolean(false)); // true — це об'єкт
> ```
>
> Типовий баг: `if (count)` не спрацює, коли `count === 0`, а `if (name)` — коли рядок порожній. Якщо нуль або порожній рядок — валідні значення, перевіряйте явно: `count !== undefined` або `count ?? default`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚙️ Абстрактні операції: як JS «перекладає» значення|Розділ: ToBoolean і falsy]] · [MDN: Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) · [Spec: ToBoolean](https://tc39.es/ecma262/#sec-toboolean)

## 🟡 Middle

> [!question]- Що таке Temporal Dead Zone?
> *часто · код* · `js-01-009`
>
> **TDZ** — проміжок від початку scope до виконання оголошення `let`/`const`/`class`, коли binding уже існує (hoisted), але ще не ініціалізований. Будь-яке звернення до нього, навіть `typeof`, кидає `ReferenceError`.
>
> TDZ часова, а не просторова: важливо, коли код виконується, а не де він написаний.
>
> ```js
> function read() {
>   return value;
> }
> // read();   // ReferenceError: Cannot access 'value' before initialization
> let value = 42;
> read();      // 42 — функція вище в тексті, але виклик після ініціалізації
>
> let x = 1;
> {
>   // console.log(x); // ReferenceError, а не 1: внутрішній x затіняє зовнішній
>   let x = 2;
> }
> ```
>
> Навіщо: TDZ ловить використання до ініціалізації, яке з `var` тихо давало `undefined`, і робить `const` осмисленим — у нього не може бути «проміжного» значення.
>
> **На співбесіді:** згадайте затінення — саме воно дає найнеочевидніші TDZ-помилки при рефакторингу. Ще одна пастка: `let x = x + 1` у вкладеному scope кидає `ReferenceError`, бо права частина читає вже новий, неініціалізований `x`.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#⏳ TDZ — Temporal Dead Zone|Розділ: TDZ]] · [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) · [Spec: Let and Const Declarations](https://tc39.es/ecma262/#sec-let-and-const-declarations)

> [!question]- Як працює алгоритм нестрогого порівняння `==` крок за кроком?
> *часто · код* · `js-01-010`
>
> Алгоритм **IsLooselyEqual(x, y)**:
> 1. Однакові типи — порівняння як `===`.
> 2. `null` і `undefined` рівні лише одне одному.
> 3. Number і String — рядок приводиться до числа.
> 4. BigInt і String — рядок парситься як BigInt; не вийшло — `false`.
> 5. Boolean з будь-чим — boolean стає числом, порівняння повторюється.
> 6. Об'єкт і примітив — об'єкт проходить ToPrimitive, порівняння повторюється.
> 7. BigInt і Number — математичне порівняння.
> 8. Інакше — `false`.
>
> ```js
> [] == false;    // true: false → 0, [] → '' → 0
> [0] == false;   // true: [0] → '0' → 0
> [1, 2] == '1,2'; // true
> null == 0;      // false: у == null не стає числом
> null >= 0;      // true: реляційні оператори роблять ToNumber(null) = 0
> 1n == '1';      // true
> ```
>
> **На співбесіді:** пара `null == 0` / `null >= 0` показує, що `==` і `<`/`>=` — різні алгоритми.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚖️ == проти ===|Розділ: алгоритм ==]] · [MDN: Equality (==)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) · [Spec: IsLooselyEqual](https://tc39.es/ecma262/#sec-islooselyequal)

> [!question]- Що таке ToPrimitive і як `valueOf`, `toString` та `Symbol.toPrimitive` впливають на приведення?
> *часто · код* · `js-01-011`
>
> Коли об'єкт треба перетворити на примітив, рушій викликає **ToPrimitive(obj, hint)** з hint `'string'`, `'number'` або `'default'`:
> 1. Якщо є `obj[Symbol.toPrimitive]` — викликається з hint; має повернути примітив, інакше `TypeError`.
> 2. Інакше OrdinaryToPrimitive: для `'string'` — спершу `toString`, потім `valueOf`; для решти — навпаки. Перший примітивний результат перемагає; якщо обидва повернули об'єкти — `TypeError`.
>
> Hint `'string'`: `String(x)`, template literal, ключ властивості. Hint `'number'`: арифметика, унарний `+`, `<`/`>`. Hint `'default'`: бінарний `+` і `==`.
>
> ```js
> const money = {
>   [Symbol.toPrimitive](hint) {
>     return hint === 'string' ? '$42' : 42;
>   },
> };
> `${money}`;       // '$42'
> money * 2;        // 84
> money + 1;        // 43 (hint 'default')
>
> new Date(0) + 1;  // рядок: Date для 'default' обирає string
> new Date(0) - 1;  // -1
> ```
>
> У звичайного `{}` `valueOf` повертає сам об'єкт, тому результатом стає `toString()` — `'[object Object]'`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚙️ Абстрактні операції: як JS «перекладає» значення|Розділ: ToPrimitive]] · [MDN: Symbol.toPrimitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive) · [Spec: ToPrimitive](https://tc39.es/ecma262/#sec-toprimitive)

> [!question]- Як оператор `+` вирішує, чи додавати числа, чи склеювати рядки?
> *часто · код* · `js-01-012`
>
> Бінарний `+`:
> 1. Обидва операнди проходять ToPrimitive з hint `'default'`.
> 2. Якщо хоча б один результат — рядок, обидва перетворюються на рядки і склеюються.
> 3. Інакше обидва перетворюються на числа (або BigInt) і додаються; змішування BigInt і Number — `TypeError`.
>
> Усі інші арифметичні оператори (`-`, `*`, `/`, `%`, `**`) завжди приводять до числа. Вирази обчислюються зліва направо, тому порядок має значення.
>
> ```js
> 1 + '2';        // '12'
> '3' - 1;        // 2
> 1 + 2 + '3';    // '33'
> '1' + 2 + 3;    // '123'
> [] + [];        // ''
> [] + {};        // '[object Object]'
> true + 1;       // 2
> null + 1;       // 1
> undefined + 1;  // NaN
> +' 42 ';        // 42
> ```
>
> **На співбесіді:** якщо в консолі ввести `{} + []`, вийде `0` — `{}` на початку інструкції парситься як порожній блок, і лишається унарний `+[]`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#➕ Оператор + — найхитріший|Розділ: оператор +]] · [MDN: Addition (+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition) · [Spec: ApplyStringOrNumericBinaryOperator](https://tc39.es/ecma262/#sec-applystringornumericbinaryoperator)

> [!question]- Що таке `NaN` і чим `Number.isNaN` відрізняється від `isNaN`?
> *часто · код* · `js-01-013`
>
> `NaN` — значення типу `number`, результат невдалої числової операції: `Number('abc')`, `0 / 0`, `Math.sqrt(-1)`, `undefined + 1`. Це єдине значення, не рівне самому собі, і воно «заражає» всю подальшу арифметику.
>
> Глобальний **`isNaN(x)`** спершу робить ToNumber, тому відповідає на питання «чи стане це NaN після приведення». **`Number.isNaN(x)`** повертає `true` лише для справжнього `NaN`, без приведення.
>
> ```js
> isNaN('hello');        // true — рядок, а не NaN
> Number.isNaN('hello'); // false
> Number.isNaN(0 / 0);   // true
> Object.is(NaN, NaN);   // true
> [NaN].includes(NaN);   // true (SameValueZero)
> [NaN].indexOf(NaN);    // -1 (===)
> ```
>
> Додатково: `isNaN(1n)` кидає `TypeError`, бо BigInt не можна привести до Number; `Number.isNaN(1n)` просто повертає `false`.
>
> **На співбесіді:** старий трюк `x !== x` теж працює, але `Number.isNaN` читається краще.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика|Розділ: числа, BigInt і математика]] · [MDN: Number.isNaN()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN) · [MDN: NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)

> [!question]- Чим `??` відрізняється від `||` і як працює optional chaining `?.`?
> *дуже часто · порівняння* · `js-01-014`
>
> `||` повертає перший truthy-операнд, тому підміняє також `0`, `''`, `false` і `NaN`. `??` повертає правий операнд лише коли лівий — `null` або `undefined`.
>
> `?.` перевіряє лівий операнд на `null`/`undefined`: якщо так, увесь ланцюжок **short-circuit** повертає `undefined`, і решта виразу (включно з аргументами виклику) не обчислюється.
>
> ```js
> const cfg = { retries: 0, title: '' };
> cfg.retries || 3;   // 3 — баг
> cfg.retries ?? 3;   // 0
>
> const user = null;
> const api = {};
> const arr = null;
> user?.profile.email;   // undefined, .email не обчислюється
> api.track?.('event');  // виклик лише якщо метод існує
> arr?.[0];              // undefined
> ```
>
> Пастки:
> - `a ?? b || c` без дужок — `SyntaxError`;
> - `?.` не рятує від неоголошеної змінної — `ReferenceError`;
> - `a?.b = 1` — `SyntaxError`, optional chaining не може бути ціллю присвоєння;
> - `(a?.b).c` розриває short-circuit і впаде, якщо `a` — `null`.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко|Розділ: обʼєкти глибоко]] · [MDN: Nullish coalescing (??)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) · [MDN: Optional chaining (?.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

> [!question]- Як працюють логічні оператори присвоєння `||=`, `&&=` і `??=`?
> *іноді · код* · `js-01-015`
>
> Це ES2021-скорочення: `a ||= b`, `a &&= b`, `a ??= b`. Ключове — вони **short-circuit**: `a ||= b` еквівалентно `a || (a = b)`, а не `a = a || b`. Присвоєння (і обчислення `b`) відбувається лише коли потрібно.
>
> ```js
> const opts = { retries: 0, name: '' };
> opts.retries ??= 3;   // лишається 0
> opts.name ||= 'anon'; // 'anon'
> opts.user &&= opts.user.trim(); // user undefined — нічого не відбувається
>
> const counts = {};
> const word = 'js';
> counts[word] ??= 0;   // ледача ініціалізація
> counts[word]++;
> ```
>
> Різниця з `a = a || b` важлива там, де сам запис має ефект: setter, Proxy, frozen-об'єкт або властивість лише з getter. Зайвий запис викличе setter чи trap `set` у Proxy (логування, валідація, dirty-tracking) або кине помилку — з логічним присвоєнням цього запису просто немає.
>
> ```js
> 'use strict';
> const frozen = Object.freeze({ a: 1 });
> frozen.a ||= 2;              // ок: присвоєння не виконується
> // frozen.a = frozen.a || 2; // TypeError у strict mode
> ```
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко|Розділ: обʼєкти глибоко]] · [MDN: Nullish coalescing assignment (??=)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment) · [MDN: Logical OR assignment (||=)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment)

> [!question]- Чому `0.1 + 0.2 !== 0.3` і як правильно порівнювати дробові числа?
> *часто · код* · `js-01-016`
>
> Усі `number` — це 64-бітні **IEEE 754 double** з 53 бітами точності. `0.1` і `0.2` у двійковій системі — нескінченні дроби (як 1/3 у десятковій), тому зберігаються з округленням, і похибки при додаванні дають `0.30000000000000004`.
>
> Порівнюють із допуском. `Number.EPSILON` (≈2.2e-16) як абсолютний допуск коректний лише для значень близько 1, тому краще відносний допуск або допуск, заданий доменом.
>
> ```js
> 0.1 + 0.2 === 0.3; // false
>
> const nearlyEqual = (a, b, eps = 1e-9) =>
>   Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b));
> nearlyEqual(0.1 + 0.2, 0.3); // true
>
> (1.005).toFixed(2); // '1.00' — 1.005 насправді 1.00499999…
> ```
>
> Для грошей — цілі мінорні одиниці (копійки/центи), `BigInt` або decimal-бібліотека. `toFixed` — лише для відображення.
>
> **На співбесіді:** це не баг JavaScript, так само поводяться Python, Java і C.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика|Розділ: числа, BigInt і математика]] · [MDN: Number.EPSILON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON) · [The Floating-Point Guide](https://floating-point-gui.de/)

## 🔴 Senior

> [!question]- Які алгоритми порівняння є в JavaScript і де кожен з них використовується?
> *іноді · порівняння* · `js-01-017`
>
> Специфікація має чотири алгоритми: IsLooselyEqual (`==`), IsStrictlyEqual (`===`), **SameValue** (`Object.is`) і **SameValueZero**. Останні три відрізняються лише на `NaN` і `±0`:
>
> | Алгоритм | `NaN` vs `NaN` | `+0` vs `-0` |
> |---|---|---|
> | `===` | false | true |
> | SameValueZero | true | true |
> | SameValue | true | false |
>
> Де вони живуть:
> - `===` — `switch`, `indexOf`, `lastIndexOf`;
> - SameValueZero — `includes`, ключі `Map` і елементи `Set` (`-0` нормалізується до `+0`);
> - SameValue — `Object.is`, перевірка при перевизначенні non-writable властивості; React порівнює стан і deps через `Object.is`.
>
> ```js
> Math.round(-0.4);                    // -0
> Object.is(Math.round(-0.4), -0);     // true
> 1 / -0;                              // -Infinity
> String(-0);                          // '0' — знак губиться при виводі
> JSON.stringify(-0);                  // '0'
> new Map([[-0, 'a']]).get(0);         // 'a'
> ```
>
> **На співбесіді:** `-0` з'являється з `Math.round`, множення на `0` від'ємного числа і парсингу `'-0'`. Баги з ним рідкісні, але підступні: логи показують `0`, а `1 / x` дає `-Infinity` або напрямок анімації перевертається. Виявляйте через `Object.is(x, -0)`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚖️ == проти ===|Розділ: алгоритми порівняння]] · [MDN: Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness) · [Spec: SameValue](https://tc39.es/ecma262/#sec-samevalue)

> [!question]- Що таке `Number.MAX_SAFE_INTEGER` і як не втратити точність великих ID у продакшні?
> *часто · практика* · `js-01-018`
>
> `Number.MAX_SAFE_INTEGER` = 2^53 − 1 = 9007199254740991. До цієї межі кожне ціле число представлене точно і відрізняється від сусіднього. Далі з'являються «дірки»: `2 ** 53 + 1 === 2 ** 53`.
>
> Реальна проблема: бекенд (Postgres `bigint`, Java `long`, snowflake-ID) віддає 64-бітні числа в JSON, `JSON.parse` створює `number` і **тихо округлює**. Два різні ID стають однаковими, фронтенд запитує чужі сутності.
>
> ```js
> JSON.parse('{"id": 9007199254740993}').id; // 9007199254740992
> Number.isSafeInteger(2 ** 53);             // false
>
> const id = BigInt('9007199254740993');
> id + 1n;              // 9007199254740994n
> // id + 1;           // TypeError: Cannot mix BigInt and other types
> // JSON.stringify(id); // TypeError: Do not know how to serialize a BigInt
> ```
>
> Рішення за пріоритетом:
> - контракт API: ID як **рядки** (ID — ідентифікатор, а не число для арифметики);
> - `BigInt` лише там, де справді потрібна арифметика з великими цілими;
> - якщо контракт не змінити — парсинг з доступом до вихідного тексту (reviver з `context.source` у V8-середовищах) або бібліотека на кшталт `json-bigint`.
>
> Обмеження `BigInt`: не змішується з `Number`, не працює з `Math.*`, ділення відкидає дробову частину, повільніший за Smi-арифметику. Драйвер `pg` для Node за замовчуванням повертає `int8` як рядок саме з цієї причини.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика|Розділ: числа, BigInt і математика]] · [MDN: Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) · [MDN: BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

> [!question]- Як працюють tagged templates і де вони корисні в реальному коді?
> *іноді · код* · `js-01-019`
>
> Tag — звичайна функція, яка отримує `(strings, ...values)`: `strings` — заморожений масив статичних частин з властивістю `raw`, `values` — обчислені вирази. Повернути вона може що завгодно, не обов'язково рядок.
>
> Важливі деталі:
> - масив `strings` **кешується для місця виклику**: той самий шаблон щоразу передає той самий об'єкт, і бібліотеки (lit-html) використовують його як ключ кешу;
> - з ES2018 у tagged-шаблонах дозволені невалідні escape-послідовності: cooked-значення стає `undefined`, а `raw` зберігається;
> - значення ніколи не склеюються автоматично — тег сам вирішує, що з ними робити.
>
> ```js
> function sql(strings, ...values) {
>   const text = strings.reduce((acc, s, i) => acc + '$' + i + s);
>   return { text, values };
> }
> const id = 7;
> const role = 'admin';
> sql`SELECT * FROM users WHERE id = ${id} AND role = ${role}`;
> // { text: 'SELECT * FROM users WHERE id = $1 AND role = $2', values: [7, 'admin'] }
>
> String.raw`C:\new\table`; // бекслеші збережені як є
> ```
>
> Застосування: параметризований SQL без injection (postgres.js, Prisma `$queryRaw`), екранування HTML (lit-html), CSS-in-JS (styled-components), `gql` для GraphQL, `dedent`, i18n.
>
> **На співбесіді:** головна цінність — розділення коду й даних: тег бачить, що було літералом, а що прийшло ззовні. Звичайний template literal без тегу такої гарантії не дає — він одразу склеює все в рядок.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази|Розділ: рядки, Unicode і регулярні вирази]] · [MDN: Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) · [Spec: Tagged Templates](https://tc39.es/ecma262/#sec-tagged-templates)

> [!question]- Що означає незмінність рядків і які практичні наслідки це має?
> *іноді · теорія* · `js-01-020`
>
> Рядки — immutable примітиви: будь-яка «зміна» створює новий рядок. `replace`, `toUpperCase`, `slice` повертають нові значення, а запис за індексом ігнорується (у strict mode — `TypeError`).
>
> Практичні наслідки:
> - **Конкатенація в циклі** у V8 зазвичай не квадратична: `+=` створює rope (ConsString), який «сплющується» ліниво при доступі за індексом. Міф «завжди використовуйте `join`» застарів — міряйте профайлером.
> - **Утримання пам'яті:** достатньо довгий `slice` великого рядка у V8 може бути SlicedString, що посилається на оригінал. Маленький фрагмент 50 МБ відповіді тримає в пам'яті всю відповідь.
> - **UTF-16:** `length` рахує code units, а не символи. Emoji займають два code units, а графеми з ZWJ — ще більше.
>
> ```js
> const s = 'hello';
> // s[0] = 'H';   // strict mode: TypeError, sloppy: тихо ігнорується
> s.toUpperCase(); // 'HELLO', s не змінився
>
> const family = '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}'; // emoji «сім'я»: 3 emoji + 2 ZWJ
> family.length;                                   // 8 code units
> [...family].length;                              // 5 code points
> [...new Intl.Segmenter().segment(family)].length; // 1 графема
> ```
>
> **На співбесіді:** `str.split('').reverse().join('')` ламає emoji; обрізання рядка за `length` для UI — так само. Для «видимих символів» потрібен `Intl.Segmenter`.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази|Розділ: рядки, Unicode і регулярні вирази]] · [MDN: String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) · [javascript.info: Strings](https://javascript.info/string)

> [!question]- Як неявне приведення типів проявляється в реальних багах і як їх знаходити?
> *часто · практика* · `js-01-021`
>
> Більшість продакшн-багів з coercion виникає на межах системи: query params, `input.value`, `localStorage`, `process.env`, заголовки, CSV — усе це **завжди рядки**, незалежно від TS-типів.
>
> Типові симптоми:
> - `'10' < '9'` — `true`: два рядки порівнюються лексикографічно;
> - `[10, 9, 1].sort()` — `[1, 10, 9]`: сортування за замовчуванням порівнює рядки;
> - `input.value + 1` — `'51'`;
> - `process.env.DEBUG = 'false'` — truthy;
> - `Number('')` і `Number(' ')` — `0`: порожнє поле стає валідним нулем;
> - `parseInt`/`parseFloat` парсять префікс: `parseFloat('12px')` — `12`, `parseInt(0.0000005)` — `5` (бо рядок `'5e-7'`).
>
> ```js
> '10' < '9';                       // true
> [10, 9, 1].sort((a, b) => a - b); // [1, 9, 10]
> Number('');                       // 0
> parseInt(0.0000005);              // 5
> Boolean('false');                 // true
> ```
>
> Як шукати: логувати `typeof` і `JSON.stringify(value)` (лапки одразу видно), ставити breakpoint на межі, де дані входять у систему. Як запобігати: парсити один раз на вході через спільний helper або схему, використовувати `Number()` плюс `Number.isFinite`, завжди передавати radix у `parseInt`.
>
> **На співбесіді:** сильна відповідь — «типи TS на межі брешуть, тому я валідую, а не довіряю анотації».
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚠️ Пастки|Розділ: пастки приведення типів]] · [MDN: Type coercion](https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion) · [ESLint: eqeqeq](https://eslint.org/docs/latest/rules/eqeqeq)

## 🟣 Tech Lead

> [!question]- Як обрати рівень строгості TypeScript і де потрібна runtime-валідація?
> *іноді · практика* · `js-01-022`
>
> TypeScript-типи стираються при компіляції й гарантують лише те, що бачив компілятор. Усе, що перетинає межу — HTTP-відповіді, тіла запитів, env, `localStorage`, `postMessage`, сторонні SDK, JSON-колонки в БД, — має тип **`unknown`**, доки не провалідоване.
>
> Строгість:
> - новий проєкт — `"strict": true` плюс `noUncheckedIndexedAccess` і `noImplicitOverride`; `exactOptionalPropertyTypes` — за бажанням команди, бо додає тертя;
> - legacy — вмикати прапорці по одному, фіксувати кількість помилок і робити ratchet у CI (кількість не може зростати), або окремий строгий tsconfig для нових модулів;
> - `any` заборонити лінтером (`no-explicit-any`, `no-unsafe-*`), дозволити `unknown`.
>
> Runtime: схема як єдине джерело правди, тип виводиться зі схеми — тоді вони не розходяться. Принцип **parse, don't validate**: перевірили один раз на вході — всередині довіряємо типам.
>
> ```ts
> import { z } from 'zod';
>
> const User = z.object({
>   id: z.string(),
>   name: z.string().min(1),
>   age: z.number().int().nonnegative(),
> });
> type User = z.infer<typeof User>;
>
> async function fetchUser(id: string): Promise<User> {
>   const res = await fetch(`/api/users/${id}`);
>   return User.parse(await res.json());
> }
> ```
>
> Компроміси: розмір бандла (zod проти tree-shakable valibot), CPU на гарячих шляхах. І пастка: `z.coerce.number()` робить `Number(input)`, тому порожнє поле форми стає `0`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#🔬 Як це працює насправді|Розділ: типи та приведення]] · [TypeScript: strict](https://www.typescriptlang.org/tsconfig/#strict) · [Zod](https://zod.dev/)

> [!question]- Які командні правила щодо рівності та приведення типів варто закріпити в lint і code review?
> *рідко · практика* · `js-01-023`
>
> Мета — зробити приведення явним і перекласти контроль на інструменти, щоб review не витрачався на `==`.
>
> Базовий набір:
> - `eqeqeq` з `{ null: 'ignore' }` — дозволяє лише ідіому `x == null`;
> - `no-implicit-coercion` — замість `!!x`, `+x`, `'' + x` пишемо `Boolean(x)`, `Number(x)`, `String(x)`;
> - `use-isnan`, `radix`;
> - для TS (потрібен type-aware lint): `strict-boolean-expressions` (ловить `if (count)` для nullable-чисел і рядків), `prefer-nullish-coalescing`, `restrict-plus-operands`, `restrict-template-expressions`, `no-unnecessary-condition`, `switch-exhaustiveness-check`.
>
> ```js
> export default [
>   {
>     rules: {
>       eqeqeq: ['error', 'always', { null: 'ignore' }],
>       'no-implicit-coercion': 'error',
>       'use-isnan': 'error',
>       radix: 'error',
>     },
>   },
> ];
> ```
>
> Впровадження: спершу `warn`, заміряти кількість, фіксити по директоріях, потім `error` з ratchet. **Не автофіксити** `||` → `??` масово: це зміна семантики для `0` і `''`, кожне місце треба перевірити. `strict-boolean-expressions` на legacy вмикати через overrides для нових модулів — інакше гігантський diff, який ніхто не зможе відрев'юїти.
>
> Плюс конвенція: парсинг зовнішніх даних — лише через спільні helpers або схеми; type-aware lint дорожчий у CI, тому варто кешувати його.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚖️ == проти ===|Розділ: == проти ===]] · [ESLint: eqeqeq](https://eslint.org/docs/latest/rules/eqeqeq) · [typescript-eslint: strict-boolean-expressions](https://typescript-eslint.io/rules/strict-boolean-expressions/)

## Тести

> [!quiz] Що поверне `typeof NaN`?
> level: junior · id: js-01-quiz-01
> - [ ] `"NaN"`
> - [x] `"number"`
> - [ ] `"undefined"`
> - [ ] `"object"`
>
> **Пояснення:** `NaN` — спеціальне значення типу `number` за IEEE 754. Саме тому для його перевірки потрібен `Number.isNaN`, а не `typeof`.

> [!quiz] Яке значення отримає `port`, якщо `config.port === 0`: `const port = config.port ?? 3000`?
> level: junior · id: js-01-quiz-02
> - [x] `0`
> - [ ] `3000`
> - [ ] `undefined`
> - [ ] `null`
>
> **Пояснення:** `??` підставляє праве значення лише для `null` і `undefined`. З `||` результат був би `3000`, бо `0` — falsy.

> [!quiz] Оберіть усі правильні: які вирази дають `true`?
> level: middle · type: multi · id: js-01-quiz-03
> - [x] `null == undefined`
> - [ ] `null == 0`
> - [ ] `Object.is(0, -0)`
> - [x] `[] == false`
>
> **Пояснення:** `null` у `==` дорівнює лише `undefined`. `Object.is` розрізняє `+0` і `-0`. `[] == false` зводиться до `'' == 0`, тобто `0 == 0`.

> [!quiz] Що виведе код?
> level: middle · type: output · id: js-01-quiz-04
>
> ```js
> console.log(1 + '2' - 1, '3' * '4', true + 1);
> ```
>
> - [x] `11 12 2`
> - [ ] `111 12 2`
> - [ ] `11 34 2`
> - [ ] `11 12 true1`
>
> **Пояснення:** `1 + '2'` дає `'12'`, а `-` приводить до числа: `12 - 1 = 11`. `*` завжди числовий, а `true + 1` — це `1 + 1`.

> [!quiz] Що виведе код?
> level: senior · type: output · id: js-01-quiz-05
>
> ```js
> console.log(2 ** 53 === 2 ** 53 + 1);
> console.log(typeof 10n, 10n / 3n);
> ```
>
> - [ ] `false`, потім `number 3.3333333333333335`
> - [x] `true`, потім `bigint 3n`
> - [ ] `false`, потім `bigint 3n`
> - [ ] `true`, потім `TypeError`
>
> **Пояснення:** `2 ** 53 + 1` не представимо в double і округлюється до `2 ** 53`. Ділення BigInt відкидає дробову частину, результат теж BigInt.

## Задачі

> [!task] Реалізуй строгий `parseStrictNumber`
> level: junior · difficulty: easy · id: js-01-task-01 · tags: coercion, numbers, validation
>
> Умова: напиши `parseStrictNumber(value)`, що повертає скінченне число або `null`. Приймаються скінченні числа та рядки, які після `trim()` цілком є десятковим числом (знак, дробова частина, експонента дозволені). Відхиляються порожні й пробільні рядки, `'12px'`, `'0x10'`, `'Infinity'`, `NaN`, boolean, `null`, масиви та об'єкти. Приклад: `parseStrictNumber(' 42 ')` → `42`, `parseStrictNumber('1e3')` → `1000`, `parseStrictNumber('')` → `null`, `parseStrictNumber([5])` → `null`.
>
> > [!hint]- Підказка 1
> > Подивись, що повертають `Number('')`, `Number('0x10')`, `Number([5])` і `parseFloat('12px')`. Жоден вбудований спосіб сам по собі не підходить.
>
> > [!hint]- Підказка 2
> > Розділи перевірку типу і перевірку формату: спершу `typeof`, потім регулярний вираз для рядка.
>
> > [!hint]- Підказка 3
> > Після успішної перевірки формату перетвори через `Number()` і відсій результат через `Number.isFinite` — `'1e400'` стане `Infinity`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const DECIMAL = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;
> >
> > function parseStrictNumber(value) {
> >   if (typeof value === 'number') {
> >     return Number.isFinite(value) ? value : null;
> >   }
> >   if (typeof value !== 'string') return null;
> >   const s = value.trim();
> >   if (!DECIMAL.test(s)) return null;
> >   const n = Number(s);
> >   return Number.isFinite(n) ? n : null;
> > }
> > ```
> >
> > Регулярний вираз відсікає все, що `Number()` приймає «надто щедро»: порожній рядок, hex/binary-префікси, `Infinity`. Ранній `typeof` не дає масивам і boolean пройти через ToPrimitive. `Number.isFinite` ловить переповнення на кшталт `'1e400'`. Складність O(n) від довжини рядка.

> [!task] Реалізуй `isEqual` з семантикою `Object.is`
> level: middle · difficulty: medium · id: js-01-task-02 · tags: equality, objects, recursion
>
> Умова: напиши `isEqual(a, b)` для глибокого порівняння примітивів, масивів і plain-об'єктів. Примітиви порівнюються як `Object.is`: `NaN` дорівнює `NaN`, а `0` не дорівнює `-0`. Об'єкти рівні, якщо мають однаковий прототип, однаковий набір власних enumerable-ключів і рекурсивно рівні значення; масиви — ще й однакову довжину. Циклічні посилання обробляти не потрібно. Приклад: `isEqual({ a: [NaN] }, { a: [NaN] })` → `true`, `isEqual([0], [-0])` → `false`, `isEqual({ a: 1 }, { a: 1, b: undefined })` → `false`.
>
> > [!hint]- Підказка 1
> > Почни з `Object.is(a, b)` — він одразу закриває всі примітиви й однакові посилання.
>
> > [!hint]- Підказка 2
> > Якщо хоча б одне значення не є об'єктом (або це `null`), після `Object.is` відповідь — `false`. Перевір `Object.getPrototypeOf`, щоб масив не дорівнював об'єкту з ключами `'0'`, `'1'`.
>
> > [!hint]- Підказка 3
> > Порівнюй кількість ключів, потім для кожного ключа `a` перевір `Object.hasOwn(b, key)` і рекурсивний виклик — так `{ b: undefined }` не дорівнюватиме `{}`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function isEqual(a, b) {
> >   if (Object.is(a, b)) return true;
> >   if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
> >     return false;
> >   }
> >   if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
> >
> >   if (Array.isArray(a)) {
> >     if (a.length !== b.length) return false;
> >     for (let i = 0; i < a.length; i++) {
> >       if (!isEqual(a[i], b[i])) return false;
> >     }
> >     return true;
> >   }
> >
> >   const keysA = Object.keys(a);
> >   if (keysA.length !== Object.keys(b).length) return false;
> >   for (const key of keysA) {
> >     if (!Object.hasOwn(b, key) || !isEqual(a[key], b[key])) return false;
> >   }
> >   return true;
> > }
> > ```
> >
> > `Object.is` на вході дає потрібну семантику для `NaN` і `-0`, а перевірка прототипу відрізняє масив від array-like об'єкта. Складність O(n) від загальної кількості вузлів. Обмеження: `Object.keys` ігнорує symbol-ключі, «дірки» в масивах дорівнюють `undefined`, а два різні `Date` вважатимуться рівними (власних ключів немає) — для таких типів потрібні окремі гілки, а для циклів — `WeakMap` відвіданих пар.
