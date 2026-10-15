---
title: Функції, scope, замикання та hoisting
order: 2
tags: [functions, scope, closures, hoisting, functional-programming]
estimatedMinutes: 60
---

# JS Interview Q&A — 02. Функції, scope, замикання та hoisting

## 🟢 Junior

> [!question]- Чим відрізняються function declaration, function expression і arrow function?
> *дуже часто · порівняння* · `js-02-001`
>
> - **Function declaration** `function f() {}` — піднімається повністю разом з тілом, має власні `this` і `arguments`, може бути конструктором.
> - **Function expression** `const f = function () {}` — створюється, коли виконується рядок присвоєння. Ім'я named expression (`function inner() {}`) видно лише всередині неї — корисно для рекурсії та stack traces.
> - **Arrow function** `const f = () => {}` — не має власних `this`, `arguments`, `super`, `new.target` і `prototype`, не може викликатися з `new`. Коротке тіло без фігурних дужок неявно повертає значення.
>
> ```js
> hello();                   // працює: declaration піднята
> function hello() {}
>
> // bye();                  // ReferenceError: const у TDZ
> const bye = function () {};
>
> const square = (x) => x * x;
> const makeObj = () => ({ a: 1 }); // об'єкт — у дужках
> // new square(2);          // TypeError: square is not a constructor
> ```
>
> **На співбесіді:** arrow — для колбеків і коротких функцій, declaration — для іменованих функцій верхнього рівня.
>
> 📚 [[JavaScript - 15. Функції глибоко|Розділ: функції глибоко]] · [MDN: Functions (guide)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) · [MDN: Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

> [!question]- Що таке hoisting і як він працює для функцій і змінних?
> *дуже часто · теорія* · `js-02-002`
>
> **Hoisting** — наслідок того, що рушій обробляє scope у дві фази: спершу створює bindings для всіх оголошень, потім виконує код. Фізично код нікуди не переміщується. Відрізняється лише ініціалізація:
> - function declaration — ініціалізується одразу функцією, тому її можна викликати до рядка оголошення;
> - `var` — ініціалізується `undefined`;
> - `let`, `const`, `class` — binding створено, але до рядка оголошення він у TDZ;
> - function expression і arrow поводяться як змінна, якій їх присвоєно.
>
> ```js
> console.log(typeof greet); // "function"
> console.log(typeof later); // "undefined": var є, але функції ще немає
> // later();                // TypeError: later is not a function
>
> var later = function () {};
> function greet() {}
> ```
>
> **На співбесіді:** розрізняйте `TypeError` (змінна `var` є, але це ще `undefined`) і `ReferenceError` (TDZ або змінна не оголошена).
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🎈 Hoisting: що «спливає» і як|Розділ: hoisting]] · [MDN: Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting) · [Spec: FunctionDeclarationInstantiation](https://tc39.es/ecma262/#sec-functiondeclarationinstantiation)

> [!question]- Що таке scope і які його види є в JavaScript?
> *дуже часто · теорія* · `js-02-003`
>
> Scope — область коду, де видно певне ім'я (binding). JavaScript має **лексичний scope**: видимість визначається місцем оголошення в тексті програми.
>
> Види:
> - global — верхній рівень скрипта; `var` і function declaration стають властивостями `globalThis`, а `let`/`const` — ні;
> - module — кожен ES-модуль має власний верхній scope;
> - function — кожен виклик функції створює новий scope;
> - block — `{}`, `if`, `for`, `try/catch` для `let`, `const`, `class`.
>
> ```js
> const a = 'global';
> function outer() {
>   const b = 'function';
>   if (true) {
>     const c = 'block';
>     console.log(a, b, c); // усе видно
>   }
>   // console.log(c);      // ReferenceError
> }
> outer();
> ```
>
> Внутрішній scope бачить зовнішні, зовнішній внутрішні — ні.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🧱 Види scope|Розділ: види scope]] · [MDN: Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope) · [javascript.info: Variable scope, closure](https://javascript.info/closure)

> [!question]- Що таке замикання (closure)?
> *дуже часто · теорія* · `js-02-004`
>
> **Замикання** — функція разом із лексичним оточенням, у якому її створено. Функція зберігає посилання на змінні зовнішнього scope і може читати й змінювати їх навіть після того, як зовнішня функція завершилась.
>
> Ключове: замикання захоплює саму змінну (binding), а не копію значення, тому завжди бачить поточне значення.
>
> ```js
> function makeCounter() {
>   let count = 0;
>   return () => ++count;
> }
>
> const next = makeCounter();
> next(); // 1
> next(); // 2
>
> const other = makeCounter();
> other(); // 1 — кожен виклик makeCounter має власне оточення
> ```
>
> **На співбесіді:** формально кожна функція в JS — замикання; цікаво стає, коли функція переживає scope, у якому створена.
>
> 📚 [[JavaScript - 05. Замикання#🔬 Як це працює насправді|Розділ: замикання]] · [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) · [javascript.info: Variable scope, closure](https://javascript.info/closure)

> [!question]- Що таке IIFE і навіщо його використовують?
> *часто · код* · `js-02-005`
>
> **IIFE** (Immediately Invoked Function Expression) — function expression, яку викликають одразу після створення. До ES2015 це був єдиний спосіб створити приватний scope: не засмічувати глобальний простір і ховати стан (module pattern). Дужки навколо функції потрібні, щоб парсер сприйняв її як вираз, а не declaration.
>
> ```js
> (function () {
>   var secret = 42; // не потрапляє в globalThis
> })();
>
> const counter = (() => {
>   let n = 0;
>   return { inc: () => ++n };
> })();
> counter.inc(); // 1
>
> (async () => {
>   const res = await fetch('https://example.com');
>   console.log(res.status);
> })();
> ```
>
> Сьогодні блоки та ES-модулі закрили більшість сценаріїв, але async IIFE досі використовують там, де немає top-level `await` (CommonJS, класичні скрипти).
>
> **На співбесіді:** рядок перед IIFE без `;` перетвориться на виклик попереднього виразу.
>
> 📚 [[JavaScript - 15. Функції глибоко|Розділ: функції глибоко]] · [MDN: IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) · [patterns.dev: Module Pattern](https://www.patterns.dev/vanilla/module-pattern)

> [!question]- Чим rest-параметри відрізняються від spread-синтаксису?
> *часто · порівняння* · `js-02-006`
>
> Синтаксис однаковий — `...`, але дія протилежна:
> - **rest** збирає залишок у масив — у параметрах функції та в деструктуризації;
> - **spread** розгортає iterable в аргументи чи елементи масиву, а власні enumerable-властивості — в object literal.
>
> ```js
> function sum(...nums) {
>   return nums.reduce((a, b) => a + b, 0);
> }
> const arr = [1, 2, 3];
> sum(...arr);                // 6
> Math.max(...arr);           // 3
> const [first, ...tail] = arr; // tail = [2, 3]
>
> const base = { a: 1 };
> const copy = { ...base, b: 2 }; // { a: 1, b: 2 }
> ```
>
> Правила: rest — лише один і лише останній; spread робить поверхневу копію. Spread величезного масиву в аргументи може впасти з `RangeError` через ліміт кількості аргументів.
>
> 📚 [[JavaScript - 15. Функції глибоко|Розділ: функції глибоко]] · [MDN: Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) · [MDN: Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

> [!question]- Як працюють параметри за замовчуванням?
> *часто · код* · `js-02-007`
>
> Значення за замовчуванням підставляється, лише коли аргумент дорівнює **`undefined`** — не переданий або переданий явно. `null` вважається справжнім значенням. Вираз обчислюється при кожному виклику (на відміну від Python) і може посилатися на попередні параметри.
>
> ```js
> function greet(name = 'guest', text = `Hi, ${name}`) {
>   return text;
> }
> greet();          // 'Hi, guest'
> greet(undefined); // 'Hi, guest'
> greet(null);      // 'Hi, null'
>
> function push(item, list = []) {
>   list.push(item);
>   return list;
> }
> push(1); // [1]
> push(2); // [2] — щоразу новий масив
> ```
>
> Параметри з defaults не входять у `fn.length`: для `function f(a, b = 1) {}` `length` дорівнює `1`.
>
> 📚 [[JavaScript - 15. Функції глибоко|Розділ: функції глибоко]] · [MDN: Default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) · [javascript.info: Functions](https://javascript.info/function-basics)

> [!question]- Що таке функції вищого порядку (higher-order functions)?
> *часто · теорія* · `js-02-008`
>
> **Функція вищого порядку** приймає функцію як аргумент або повертає функцію. Це можливо, бо функції в JS — first-class values: їх можна зберігати в змінних, передавати й повертати. Приклади: `map`, `filter`, `reduce`, `addEventListener`, `setTimeout`, `debounce`, middleware.
>
> ```js
> const withLogging = (fn) => (...args) => {
>   console.log('call', fn.name, args);
>   return fn(...args);
> };
> const add = (a, b) => a + b;
> const loggedAdd = withLogging(add);
> loggedAdd(2, 3); // лог, потім 5
>
> [1, 2, 3].map(parseInt); // [1, NaN, NaN]
> ```
>
> Остання пастка класична: `map` передає `(value, index, array)`, тому `parseInt` отримує індекс як radix. Правильно — `map((s) => parseInt(s, 10))` або `map(Number)`.
>
> 📚 [[JavaScript - 15. Функції глибоко|Розділ: функції глибоко]] · [MDN: First-class function](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function) · [MDN: Functions (guide)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

## 🟡 Middle

> [!question]- Що виведе класичний цикл з `var` і `setTimeout` і як це виправити?
> *дуже часто · код* · `js-02-009`
>
> Виведе `3 3 3`. `var` створює **одну** змінну на всю функцію, а колбеки виконуються після завершення циклу, коли `i` вже `3`. Затримка не має значення — навіть `0` мс виконується пізніше за синхронний цикл.
>
> ```js
> for (var i = 0; i < 3; i++) {
>   setTimeout(() => console.log(i), 0);
> } // 3 3 3
>
> for (let j = 0; j < 3; j++) {
>   setTimeout(() => console.log(j), 0);
> } // 0 1 2
>
> for (var k = 0; k < 3; k++) {
>   ((n) => setTimeout(() => console.log(n), 0))(k);
> } // 0 1 2
> ```
>
> Способи виправити:
> - `let` — специфікація створює **новий binding на кожну ітерацію** і копіює в нього значення з попередньої;
> - IIFE або окрема функція, що отримує значення параметром;
> - третій аргумент `setTimeout(console.log, 0, i)` або `bind`.
>
> **На співбесіді:** поясніть саме per-iteration binding у `for (let …)` — це особливість циклу, а не «магія» `let`.
>
> 📚 [[JavaScript - 05. Замикання#🔁 Цикли: var проти let|Розділ: цикли і замикання]] · [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) · [Spec: CreatePerIterationEnvironment](https://tc39.es/ecma262/#sec-createperiterationenvironment)

> [!question]- Як працює scope chain і чим лексичний scope відрізняється від динамічного?
> *часто · теорія* · `js-02-010`
>
> Кожне лексичне оточення має посилання на зовнішнє. Пошук імені йде ланцюжком: поточне оточення → зовнішнє → … → глобальне. Не знайдено — `ReferenceError`. Ланцюжок фіксується **там, де функцію створено**, а не там, де її викликано: це лексичний scope. У динамічному (bash, старий Lisp) пошук ішов би через стек викликів.
>
> ```js
> const x = 'global';
> function show() {
>   console.log(x);
> }
> function run() {
>   const x = 'local';
>   show(); // 'global' — важливе місце оголошення show
> }
> run();
> ```
>
> **Shadowing** — внутрішнє оголошення з тим самим ім'ям ховає зовнішнє в цьому scope.
>
> Пастка sloppy mode: присвоєння неоголошеній змінній (`y = 1` у функції) створює глобальну змінну. У strict mode і ES-модулях це `ReferenceError`.
>
> **На співбесіді:** єдине, що в JS нагадує динамічне зв'язування, — це `this`, але це не scope.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🗺️ Лексичний scope і scope chain|Розділ: лексичний scope]] · [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) · [Spec: Environment Records](https://tc39.es/ecma262/#sec-environment-records)

> [!question]- Для чого на практиці використовують замикання?
> *дуже часто · практика* · `js-02-011`
>
> Основні сценарії:
> - **приватний стан** — інкапсуляція без класів;
> - **фабрики** — функції, налаштовані параметрами (`makeValidator(min)`);
> - **кеші й мемоізація** — кеш живе в замиканні;
> - стан утиліт: таймер у `debounce`, прапорець в `once`;
> - часткове застосування й обробники подій з прив'язаними даними.
>
> ```js
> function createWallet(initial) {
>   let balance = initial;
>   return {
>     deposit(amount) {
>       balance += amount;
>       return balance;
>     },
>     getBalance: () => balance,
>   };
> }
> const w = createWallet(100);
> w.deposit(50); // 150
> w.balance;     // undefined — ззовні доступу немає
>
> function memoize(fn) {
>   const cache = new Map();
>   return (n) => {
>     if (!cache.has(n)) cache.set(n, fn(n));
>     return cache.get(n);
>   };
> }
> ```
>
> Компроміс проти класу з `#private`: кожен об'єкт отримує власні копії методів (більше пам'яті), а стан не видно як властивості в DevTools — лише в секції Closure. Для тисяч екземплярів клас з методами на прототипі економніший; для одного сервісу чи утиліти замикання простіше й надійніше приховує стан.
>
> 📚 [[JavaScript - 05. Замикання#🧠 Практичні патерни: once, фабрики, мемоізація|Розділ: патерни із замиканнями]] · [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) · [javascript.info: Variable scope, closure](https://javascript.info/closure)

> [!question]- Що таке об'єкт `arguments` і чому rest-параметри кращі?
> *часто · порівняння* · `js-02-012`
>
> `arguments` — array-like об'єкт з усіма переданими аргументами, доступний у звичайних (не arrow) функціях. Недоліки:
> - це не масив: немає `map`/`filter`, потрібен `Array.from`;
> - arrow-функції не мають власного `arguments` і бачать зовнішній;
> - у sloppy mode з простими параметрами він **mapped**: зміна `arguments[0]` змінює параметр і навпаки. У strict mode, а також за наявності defaults, rest чи деструктуризації — ні;
> - сигнатура функції не показує, що вона приймає змінну кількість аргументів.
>
> ```js
> function sloppy(a) {
>   arguments[0] = 99;
>   return a;
> }
> function strict(a) {
>   'use strict';
>   arguments[0] = 99;
>   return a;
> }
> sloppy(1); // 99
> strict(1); // 1
>
> function sum(...nums) {
>   return nums.reduce((s, n) => s + n, 0);
> }
> ```
>
> Rest-параметр — справжній масив, містить лише «залишок» і явно видимий у сигнатурі.
>
> 📚 [[JavaScript - 15. Функції глибоко|Розділ: функції глибоко]] · [MDN: The arguments object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments) · [MDN: Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)

> [!question]- Що таке чисті функції і побічні ефекти?
> *часто · теорія* · `js-02-013`
>
> **Чиста функція** має дві властивості: для однакових аргументів завжди повертає однаковий результат і не має спостережуваних побічних ефектів.
>
> Побічні ефекти: мутація аргументів або зовнішнього стану, мережа, DOM, `console`, storage, а також залежність від `Date.now()` чи `Math.random()` (порушує детермінованість).
>
> Переваги чистих функцій: прості тести без моків, безпечна мемоізація, можна переставляти й паралелити обчислення. React вимагає чистоти від render — саме тому в StrictMode він навмисно викликає render двічі в dev-режимі, щоб підсвітити приховані ефекти.
>
> ```js
> const addTax = (price, rate) => price * (1 + rate); // чиста
>
> let total = 0;
> function addToTotal(x) {
>   total += x; // побічний ефект
> }
>
> const sortByAge = (users) => users.sort((a, b) => a.age - b.age); // мутує аргумент!
> const sortByAgeSafe = (users) => users.toSorted((a, b) => a.age - b.age);
> ```
>
> **На співбесіді:** мета не прибрати ефекти, а ізолювати їх — «functional core, imperative shell»: логіка чиста, I/O на краях.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Чисті функції та композиція|Розділ: чисті функції]] · [Mostly Adequate Guide: Pure Happiness with Pure Functions](https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch03)

> [!question]- Чим каррінг відрізняється від часткового застосування?
> *часто · порівняння* · `js-02-014`
>
> **Каррінг** перетворює `f(a, b, c)` на ланцюжок унарних функцій `f(a)(b)(c)`. **Часткове застосування** фіксує частину аргументів і повертає функцію від решти — через `bind` або замикання. Каррінг дає змогу частково застосовувати аргументи на будь-якому кроці, але це різні поняття.
>
> ```js
> const add = (a, b, c) => a + b + c;
> const curried = (a) => (b) => (c) => a + b + c;
> curried(1)(2)(3); // 6
>
> const add10 = add.bind(null, 10); // часткове застосування
> add10(1, 2);      // 13
>
> const withBase = (base) => (path) => `${base}${path}`;
> const apiUrl = withBase('https://api.example.com');
> apiUrl('/users'); // 'https://api.example.com/users'
> ```
>
> Практика: фабрики «спершу конфіг, потім дані», обробники на кшталт `onClick={select(id)}`, point-free-пайплайни. Звідси й конвенція data-last у Ramda: дані, що змінюються найчастіше, йдуть останнім аргументом, а конфігурацію фіксують заздалегідь. `bind` на додачу фіксує `this`, тому для методів класу він не рівнозначний замиканню.
>
> **На співбесіді:** універсальний `curry` спирається на `fn.length`, а defaults і rest-параметри його ламають.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Каррінг і часткове застосування|Розділ: каррінг]] · [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) · [javascript.info: Currying](https://javascript.info/currying-partials)

> [!question]- Як реалізувати композицію функцій `compose` і `pipe`?
> *іноді · код* · `js-02-015`
>
> `compose(f, g, h)(x)` = `f(g(h(x)))` — справа наліво, як у математиці. `pipe` — зліва направо, у порядку виконання, тому зазвичай читається легше. Обидві реалізуються через `reduce`/`reduceRight` і працюють з унарними функціями.
>
> ```js
> const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);
> const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);
>
> const slugify = pipe(
>   (s) => s.trim(),
>   (s) => s.toLowerCase(),
>   (s) => s.replace(/\s+/g, '-'),
> );
> slugify('  Hello World '); // 'hello-world'
>
> const pipeAsync = (...fns) => (x) =>
>   fns.reduce((p, fn) => p.then(fn), Promise.resolve(x));
> ```
>
> Pipeline operator `|>` досі лише пропозиція (Stage 2), тому в коді використовують такі helpers або бібліотеки. Для TypeScript простий variadic `pipe` погано виводить типи проміжних кроків, тому бібліотеки (fp-ts, Effect, Remeda) описують його перевантаженнями для кожної кількості аргументів.
>
> **На співбесіді:** поясніть, чому для асинхронних кроків потрібен окремий варіант — звичайний `pipe` передасть Promise як аргумент наступній функції.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Чисті функції та композиція|Розділ: композиція]] · [MDN: Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) · [Mostly Adequate Guide: Coding by Composing](https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch05)

> [!question]- Які edge-кейси hoisting трапляються з `class`, функціями в блоках і параметрами за замовчуванням?
> *іноді · код* · `js-02-016`
>
> - **`class`** піднімається, як `let`: до рядка оголошення — TDZ.
> - **Функція в блоці**: у strict mode і модулях вона блочна. У sloppy mode діє Annex B — додатково створюється `var` у функції, який отримує значення, коли виконується блок.
> - **Параметри за замовчуванням** ініціалізуються зліва направо у власному scope: параметр не може посилатися на наступний, а замикання в default-виразі не бачать `var` з тіла функції.
>
> ```js
> // new Car();   // ReferenceError: class у TDZ
> class Car {}
>
> function sloppyDemo() {
>   const before = typeof f;
>   if (true) {
>     function f() {}
>   }
>   return [before, typeof f];
> }
> sloppyDemo(); // sloppy: ['undefined', 'function'], strict: ['undefined', 'undefined']
>
> function g(a = b, b = 1) {}
> // g();       // ReferenceError: b ще в TDZ
> ```
>
> **На співбесіді:** ES-модулі завжди strict, тому Annex B проявляється лише в legacy-скриптах — але саме там і трапляються такі баги.
>
> 📚 [[JavaScript - 04. Scope, hoisting і TDZ#🎈 Hoisting: що «спливає» і як|Розділ: hoisting]] · [MDN: Default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) · [Spec: Block-Level Function Declarations (Annex B)](https://tc39.es/ecma262/#sec-block-level-function-declarations-web-legacy-compatibility-semantics)

## 🔴 Senior

> [!question]- Як замикання утримують пам'ять і як знайти такий витік?
> *часто · практика* · `js-02-017`
>
> Поки живе замикання, живе й оточення, на яке воно посилається. Нюанс V8: усі змінні scope, захоплені **будь-яким** внутрішнім замиканням, лежать в одному спільному об'єкті **Context**. Якщо одна функція захопила великий об'єкт, а інша, довгоживуча (наприклад, event listener), створена в тому самому scope, — великий об'єкт утримується, навіть якщо listener його не використовує.
>
> ```js
> function attach(el) {
>   const huge = new Array(1e6).fill('*');
>   const report = () => huge.length;            // huge потрапляє в Context
>   el.addEventListener('click', () => console.log('clicked')); // той самий Context
>   return report;
> }
> ```
>
> Типові джерела витоків у продакшні:
> - listeners і підписки без відписки;
> - `setInterval`, який ніхто не зупиняє;
> - кеші в module scope без ліміту;
> - замикання, збережені в глобальних Map або singleton;
> - Promise, які ніколи не завершуються, разом з їхніми колбеками.
>
> Діагностика: DevTools → Memory → три heap snapshots (до, після N повторів дії, після очищення) і порівняння. У Retainers шукайте `context` / `system / Context` — це і є замикання, що тримає об'єкт. У Node — `--inspect` або `--heapsnapshot-signal`.
>
> Виправлення: `AbortController` для listeners, явне обнулення великих посилань, винесення великих даних з scope довгоживучих функцій, `WeakMap` для кешів за об'єктом.
>
> 📚 [[JavaScript - 05. Замикання#🗑️ Замикання і пам'ять|Розділ: замикання і пам'ять]] · [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [Chrome DevTools: Heap snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

> [!question]- Що таке stale closure і як вона проявляється в реальному коді?
> *часто · практика* · `js-02-018`
>
> **Stale closure** — замикання, що захопило змінні зі «старого» виклику і продовжує бачити їх, хоча актуальні значення вже інші. Найчастіше — у React: кожен render — новий виклик функції компонента з новими `const`, а ефект чи колбек, створений на render N, бачить стан саме render N.
>
> ```js
> function Timer() {
>   const [count, setCount] = useState(0);
>   useEffect(() => {
>     const id = setInterval(() => {
>       setCount(count + 1); // count завжди 0 з першого render
>     }, 1000);
>     return () => clearInterval(id);
>   }, []);
>   return count;
> }
> ```
>
> Лічильник застрягає на `1`. Виправлення:
> - functional updater `setCount((c) => c + 1)` — не потрібне значення з замикання;
> - чесні deps (правило `react-hooks/exhaustive-deps`);
> - `useRef` для «останнього значення» або `useEffectEvent` (стабільний з React 19.2).
>
> Поза React та сама проблема: обробник, зареєстрований один раз із конфігом на момент реєстрації; `debounce`, створений при першому render і тому з першими props; WebSocket-підписка, що пам'ятає токен до його оновлення.
>
> Діагностика: breakpoint у колбеці й секція **Closure** у панелі Scope DevTools — там видно, яке саме значення захоплено.
>
> 📚 [[JavaScript - 05. Замикання#⚠️ Пастки|Розділ: stale closure]] · [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) · [React: Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies)

> [!question]- Чому глибока рекурсія ламається в JavaScript і чи можна покладатися на tail call optimization?
> *іноді · практика* · `js-02-019`
>
> Кожен виклик додає frame у call stack, розмір якого обмежений (у V8 — порядку 10 тисяч frames залежно від їхнього розміру; у Node налаштовується через `--stack-size`). Переповнення — `RangeError: Maximum call stack size exceeded`.
>
> ES2015 описав **proper tail calls** у strict mode, але реалізував їх лише Safari (JavaScriptCore). V8 реалізував і прибрав (проблеми з налагодженням і stack traces), Firefox не реалізовував. Тож на TCO покладатися не можна.
>
> ```js
> const sumTo = (n) => (n === 0 ? 0 : n + sumTo(n - 1));
> // sumTo(1e5); // RangeError у V8
>
> function walk(root, visit) {
>   const stack = [root];
>   while (stack.length) {
>     const node = stack.pop();
>     visit(node);
>     if (node.children) stack.push(...node.children);
>   }
> }
>
> const trampoline = (fn) => (...args) => {
>   let result = fn(...args);
>   while (typeof result === 'function') result = result();
>   return result;
> };
> const sumT = trampoline(function go(n, acc = 0) {
>   return n === 0 ? acc : () => go(n - 1, acc + n);
> });
> sumT(1e6); // 500000500000
> ```
>
> Рішення:
> - ітерація з явним стеком — найкращий варіант: пам'ять у heap, а не в call stack, і глибину легко обмежити;
> - trampoline — зберігає рекурсивну форму, але створює thunk на кожен крок;
> - асинхронне дроблення роботи — скидає стек, але повільніше і змінює API на асинхронний.
>
> Продакшн-аспект: рекурсивна обробка даних від користувача (deep clone, валідація, серіалізація вкладеного JSON) — це DoS-вектор, тому потрібен ліміт глибини.
>
> 📚 [[JavaScript - 15. Функції глибоко|Розділ: функції глибоко]] · [javascript.info: Recursion and stack](https://javascript.info/recursion) · [Spec: Tail Position Calls](https://tc39.es/ecma262/#sec-tail-position-calls)

> [!question]- Які проблеми виникають з мемоізацією в продакшн-коді?
> *часто · практика* · `js-02-020`
>
> Мемоізація — це кеш, тому в неї всі проблеми кешів:
> - Ключ: `JSON.stringify(args)` повільний, залежить від порядку ключів, губить `undefined` і функції. Для одного примітиву — `Map`, для об'єкта за identity — `WeakMap`.
> - Ріст пам'яті: необмежений `Map` у module scope — **витік**. Потрібні LRU-ліміт або TTL.
> - Коректність: мемоізувати можна лише чисті функції; залежність від часу, конфігу чи `this` дає застарілі результати.
> - Async: кешуйте **Promise**, а не значення — це дедуплікує паралельні запити. Але rejected Promise треба прибирати, інакше збій закешується назавжди.
>
> ```js
> function memoizeAsync(fn, { max = 500 } = {}) {
>   const cache = new Map();
>   return (key) => {
>     if (cache.has(key)) {
>       const hit = cache.get(key);
>       cache.delete(key);
>       cache.set(key, hit); // LRU: переносимо в кінець
>       return hit;
>     }
>     const p = fn(key).catch((err) => {
>       if (cache.get(key) === p) cache.delete(key);
>       throw err;
>     });
>     cache.set(key, p);
>     if (cache.size > max) cache.delete(cache.keys().next().value);
>     return p;
>   };
> }
> ```
>
> `Map` зберігає порядок вставки, тому найстаріший ключ — перший. Перевірка `cache.get(key) === p` не дає видалити новіший запис, що з'явився після витіснення.
>
> **На співбесіді:** мемоізація дешевих функцій часто повільніша за обчислення — міряйте hit rate і вартість побудови ключа.
>
> 📚 [[JavaScript - 05. Замикання#🧠 Практичні патерни: once, фабрики, мемоізація|Розділ: мемоізація]] · [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) · [React: useMemo](https://react.dev/reference/react/useMemo)

> [!question]- Як `eval` і `new Function` взаємодіють зі scope і чому їх уникають?
> *рідко · порівняння* · `js-02-021`
>
> - **Direct eval** `eval(code)` виконує код у поточному лексичному scope: бачить локальні змінні, а в sloppy mode може ще й оголосити в ньому `var`.
> - **Indirect eval** `(0, eval)(code)` виконується в глобальному scope.
> - `new Function(args, body)` створює функцію, чий scope — лише глобальний, незалежно від місця створення.
>
> ```js
> globalThis.x = 'global';
> function test() {
>   const x = 'local';
>   console.log(eval('x'));                  // 'local'
>   console.log((0, eval)('x'));             // 'global'
>   console.log(new Function('return x')()); // 'global'
> }
> test();
> ```
>
> Чому уникають:
> - безпека — ін'єкція коду; CSP без `'unsafe-eval'` блокує обидва механізми;
> - продуктивність — direct eval змушує рушій тримати всі змінні scope доступними за ім'ям, ламаючи оптимізації, а мініфікатор не може перейменувати змінні в такому scope;
> - налагодження та статичний аналіз стають неможливими.
>
> Легітимні випадки: генерація коду під капотом бібліотек (ajv компілює валідатори через `new Function`, тому має standalone-режим для CSP), шаблонізатори, REPL. Для виконання недовіреного коду ні `eval`, ні `new Function` не є sandbox — потрібні Worker, sandboxed iframe або окремий isolate у Node.
>
> 📚 [[JavaScript - 15. Функції глибоко|Розділ: функції глибоко]] · [MDN: eval()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) · [javascript.info: The "new Function" syntax](https://javascript.info/new-function)

## 🟣 Tech Lead

> [!question]- Які правила читабельності функціонального стилю варто закріпити в команді?
> *іноді · практика* · `js-02-022`
>
> FP у команді — інструмент передбачуваності (чисті функції, відсутність мутацій), а не змагання в лаконічності. Правила, які я б записав:
> - **Чистота за замовчуванням:** не мутувати аргументи; `toSorted`, `toSpliced`, spread замість мутуючих методів; ефекти — на краях модуля.
> - **Іменовані кроки** замість довгих point-free-ланцюжків: point-free лише для тривіальних унарних функцій (`map(Number)`), пайплайн — до 3–5 кроків, кожен крок має назву.
> - `reduce` лише для справжньої згортки. Якщо акумулятор — об'єкт зі складною логікою, `for…of` читається краще. Spread в акумуляторі — O(n²).
> - Без тотального каррінгу: каррінг лише там, де часткове застосування реально використовується.
> - Одна FP-бібліотека максимум і лише за згодою команди: fp-ts чи Effect мають високий поріг входу й вартість онбордингу.
> - Іменовані функції для stack traces: ланцюжок анонімних arrow у профайлері нечитабельний.
>
> ```js
> const users = [{ id: 1 }, { id: 2 }];
>
> const slow = users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {}); // O(n²)
> const byId = Object.fromEntries(users.map((u) => [u.id, u]));      // O(n)
> ```
>
> Закріплення: lint (`no-param-reassign` з `props: true`, `prefer-const`, заборона мутуючих методів через `no-restricted-syntax`), короткий style guide з прикладами «так / не так» і питання в review: «чи зрозуміє новий розробник цей ланцюжок без запуску дебагера?».
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Чисті функції та композиція|Розділ: чисті функції та композиція]] · [Mostly Adequate Guide: Coding by Composing](https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch05) · [Google: Engineering Practices — Code Review](https://google.github.io/eng-practices/review/)

> [!question]- Коли абстракція через функції вищого порядку шкодить кодовій базі?
> *рідко · практика* · `js-02-023`
>
> HOF шкодять, коли ховають поведінку, а не прибирають дублювання. Сигнали:
> - **Нашарування обгорток** `withAuth(withLogging(withRetry(withCache(handler))))`: порядок неявно важливий, stack trace — шари анонімних функцій, у дебагері доводиться проходити кожну обгортку, generic-типи губляться.
> - **Прихований control flow:** ретраї, кешування чи ковтання помилок не видно в місці виклику.
> - Передчасна абстракція: утиліта для двох використань обростає параметрами-прапорцями і конфіг-об'єктом.
> - **Втрата метаданих:** обгортка без форвардингу `this` чи з іншим `length` ламає фреймворки, що інтроспектують функції.
>
> ```js
> const wrap = (fn) => (...args) => fn(...args);
> const onError = (err, req, res, next) => res.status(500).end();
>
> onError.length;       // 4 — Express розпізнає error middleware
> wrap(onError).length; // 0 — Express вважатиме його звичайним middleware
> ```
>
> Коли HOF доречні: наскрізна логіка, застосована однаково на одному шарі (явний масив middleware замість вкладення), добре відомі утиліти (`debounce`, `once`) з повною типізацією.
>
> Правило для команди: спершу inline, абстракція — після третього повторення (rule of three); композиція — явно і в одному місці. Тест у review: чи може новачок з'ясувати, що відбувається при виклику, не відкриваючи чотири файли?
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Чисті функції та композиція|Розділ: чисті функції та композиція]] · [MDN: First-class function](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function) · [Mostly Adequate Guide: Coding by Composing](https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch05)

## Тести

> [!quiz] Яку з цих функцій можна викликати до рядка, де вона оголошена?
> level: junior · id: js-02-quiz-01
> - [x] `function a() {}`
> - [ ] `const b = function () {};`
> - [ ] `let c = () => {};`
> - [ ] `var d = function () {};`
>
> **Пояснення:** лише function declaration ініціалізується разом з тілом на етапі створення scope. `var d` до присвоєння дорівнює `undefined` (виклик — `TypeError`), а `const`/`let` перебувають у TDZ (`ReferenceError`).

> [!quiz] Чому дорівнює `f.length` для `function f(a, b = 2, ...rest) {}`?
> level: middle · id: js-02-quiz-02
> - [x] `1`
> - [ ] `2`
> - [ ] `3`
> - [ ] `0`
>
> **Пояснення:** `length` рахує параметри до першого параметра з default-значенням або rest. Тут це лише `a`.

> [!quiz] Оберіть усі правильні твердження про замикання.
> level: middle · type: multi · id: js-02-quiz-03
> - [ ] Замикання зберігає копію значень змінних на момент створення функції
> - [x] Функції, створені в одному виклику, бачать спільні змінні цього виклику
> - [x] Замикання утворюється і тоді, коли функцію не повертають назовні, а, наприклад, передають як колбек
> - [ ] Замикання можливі лише для arrow-функцій
>
> **Пояснення:** замикання тримає посилання на binding, а не знімок значення, тому бачить подальші зміни. Будь-яка функція (не лише arrow), що переживає свій scope — повернута, передана чи збережена, — зберігає доступ до нього.

> [!quiz] Що виведе код?
> level: junior · type: output · id: js-02-quiz-04
>
> ```js
> function makeCounter() {
>   let count = 0;
>   return { inc: () => ++count, get: () => count };
> }
> const a = makeCounter();
> const b = makeCounter();
> a.inc();
> a.inc();
> b.inc();
> console.log(a.get(), b.get());
> ```
>
> - [x] `2 1`
> - [ ] `3 3`
> - [ ] `2 2`
> - [ ] `1 1`
>
> **Пояснення:** кожен виклик `makeCounter` створює окреме лексичне оточення з власним `count`. Методи `inc` і `get` одного лічильника ділять спільний `count`.

> [!quiz] Що виведе код?
> level: senior · type: output · id: js-02-quiz-05
>
> ```js
> var x = 1;
> function f(a = () => x) {
>   var x = 2;
>   return a();
> }
> console.log(f());
> ```
>
> - [x] `1`
> - [ ] `2`
> - [ ] `undefined`
> - [ ] `ReferenceError`
>
> **Пояснення:** коли параметри мають вирази за замовчуванням, `var` у тілі живуть в окремому оточенні, якого не бачать замикання з параметрів. Arrow у `a` шукає `x` у scope параметрів, не знаходить і бере глобальний `x = 1`.

## Задачі

> [!task] Реалізуй `once`
> level: junior · difficulty: easy · id: js-02-task-01 · tags: closures, higher-order-functions
>
> Умова: напиши `once(fn)`, що повертає функцію, яка викликає `fn` лише під час першого виклику і повертає його результат; усі наступні виклики повертають той самий результат без повторного виклику `fn`. `this` та аргументи першого виклику мають передаватися в `fn`. Приклад: `const init = once(() => { console.log('init'); return 42; });` — `init()` виводить `init` і повертає `42`, повторний `init()` нічого не виводить і знову повертає `42`.
>
> > [!hint]- Підказка 1
> > Стан «чи вже викликали» і збережений результат мають жити між викликами — у замиканні.
>
> > [!hint]- Підказка 2
> > Щоб передати `this`, повертай звичайну `function`, а не arrow, і викликай `fn.apply(this, args)`.
>
> > [!hint]- Підказка 3
> > Після першого виклику посилання на `fn` більше не потрібне — його можна обнулити, щоб GC зміг звільнити функцію та все, що вона захопила.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function once(fn) {
> >   let called = false;
> >   let result;
> >   return function (...args) {
> >     if (!called) {
> >       called = true;
> >       result = fn.apply(this, args);
> >       fn = null;
> >     }
> >     return result;
> >   };
> > }
> > ```
> >
> > Прапорець і результат живуть у замиканні, тому зберігаються між викликами. `called = true` стоїть до виклику `fn`, тож рекурсивний виклик зсередини `fn` не запустить її вдруге, а якщо `fn` кине помилку, повторної спроби не буде і наступні виклики повернуть `undefined` (так поводиться й lodash). O(1) на виклик.

> [!task] Реалізуй `curry`
> level: middle · difficulty: medium · id: js-02-task-02 · tags: closures, currying, functional-programming
>
> Умова: напиши `curry(fn)`, що повертає каррінговану версію `fn`. Аргументи можна передавати по одному або групами; щойно накопичено `fn.length` аргументів, викликається `fn` з ними і повертається результат. Кожна проміжна функція незалежна: її можна викликати кілька разів з різними аргументами. Приклад: `const add3 = curry((a, b, c) => a + b + c);` — `add3(1)(2)(3)`, `add3(1, 2)(3)`, `add3(1)(2, 3)` і `add3(1, 2, 3)` повертають `6`.
>
> > [!hint]- Підказка 1
> > Кількість очікуваних аргументів дає `fn.length`. Потрібна внутрішня функція, що приймає вже накопичені аргументи.
>
> > [!hint]- Підказка 2
> > Якщо аргументів достатньо — виклич `fn`. Якщо ні — поверни нову функцію, яка додасть нові аргументи до вже зібраних і знову перевірить умову.
>
> > [!hint]- Підказка 3
> > Не мутуй спільний масив аргументів: створюй новий `[...args, ...more]`, інакше `const add1 = add3(1)` зламається після першого використання.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function curry(fn) {
> >   return function curried(...args) {
> >     if (args.length >= fn.length) {
> >       return fn.apply(this, args);
> >     }
> >     return (...more) => curried.apply(this, [...args, ...more]);
> >   };
> > }
> > ```
> >
> > Кожна проміжна функція замикає власний незмінний масив `args`, тому гілки на кшталт `add1(2)(3)` і `add1(5)(5)` не впливають одна на одну. Arrow зберігає `this` першого виклику. Обмеження: для функцій з defaults або rest `fn.length` менший за реальну кількість параметрів (для `(...xs) => …` він `0`, і `fn` викличеться одразу) — у такому разі приймають явний параметр `arity`.
