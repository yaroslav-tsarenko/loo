---
title: Модулі, збірка та еволюція стандарту
order: 7
tags: [modules, esm, commonjs, bundlers, tc39]
estimatedMinutes: 75
---

# JS Interview Q&A — 07. Модулі, збірка та еволюція стандарту

## 🟢 Junior

> [!question]- Що таке модуль у JavaScript і яку проблему розв'язують ES modules?
> *часто · теорія* · `js-07-001`
>
> Модуль — це файл зі **власною областю видимості**, який явно оголошує, що віддає назовні (`export`), і що бере в інших (`import`). До модулів усі скрипти на сторінці ділили один глобальний scope: конфлікти імен, неявний порядок підключення `<script>`, залежності «через window».
>
> ES modules (ESM, стандарт з ES2015) дають:
> - ізоляцію: змінні верхнього рівня модуля не потрапляють у `globalThis`;
> - явний граф залежностей, який інструменти можуть аналізувати статично;
> - одноразове виконання: модуль виконується один раз, усі імпортери отримують той самий екземпляр.
>
> ```js
> // math.js
> export const PI = 3.14159;
> export function area(r) { return PI * r * r; }
>
> // app.js
> import { area } from './math.js';
> console.log(area(2));
> ```
>
> **На співбесіді:** згадай, що до ESM були IIFE-патерн, AMD і CommonJS — ESM їх уніфікував для браузера і Node.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) · [javascript.info: Modules, introduction](https://javascript.info/modules-intro)

> [!question]- Чим `import`/`export` відрізняються від `require`/`module.exports`?
> *дуже часто · порівняння* · `js-07-002`
>
> `import`/`export` — це **ES modules**, стандарт мови; `require` — **CommonJS**, система модулів Node, яка з'явилась раніше за стандарт.
>
> Ключові відмінності:
> - ESM статичний: `import` лише на верхньому рівні, специфікатор — рядковий літерал; граф відомий до виконання. `require` — звичайна функція, її можна викликати в `if` чи з обчисленим шляхом.
> - ESM завантажується асинхронно (фази parse → link → evaluate), CJS — синхронно.
> - ESM експортує **live bindings**, CJS повертає значення `module.exports` на момент виклику.
> - ESM завжди в strict mode, `this` на верхньому рівні — `undefined`; у CJS є `__dirname`, `require`, `module`.
>
> ```js
> const fs = require('node:fs');        // CJS
> import fs from 'node:fs';             // ESM
> import { readFile } from 'node:fs/promises';
> ```
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) · [Node.js: ECMAScript modules](https://nodejs.org/api/esm.html)

> [!question]- У чому різниця між named і default export і що краще обирати?
> *часто · порівняння* · `js-07-003`
>
> Named export експортує значення під конкретним ім'ям, яке імпортер мусить використати (або явно перейменувати через `as`). Default export — одне «головне» значення модуля, імпортер дає йому будь-яке ім'я.
>
> ```js
> export function formatDate(d) {}      // named
> export default class ApiClient {}     // default
>
> import ApiClient, { formatDate as fmt } from './api.js';
> ```
>
> Чому багато команд забороняють default export лінтером:
> - одна сутність у проєкті отримує різні імена в різних файлах — важче шукати і рефакторити;
> - автоімпорт в IDE і rename працюють надійніше з named;
> - при interop з CommonJS default часто перетворюється на `.default`.
>
> Default лишають там, де цього вимагає фреймворк (наприклад, сторінки в Next.js або `React.lazy`).
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [MDN: export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) · [javascript.info: Export and Import](https://javascript.info/import-export)

> [!question]- Що таке strict mode і що саме він змінює?
> *часто · теорія* · `js-07-004`
>
> Strict mode — це обмежений варіант семантики JS, який перетворює «тихі» помилки на винятки і прибирає небезпечні конструкції. Вмикається директивою `'use strict'` на початку файлу чи функції, а в **ES modules і тілі класів діє автоматично**.
>
> Що змінюється:
> - присвоєння в неоголошену змінну кидає `ReferenceError`, а не створює глобальну;
> - `this` у звичайному виклику функції — `undefined`, а не `globalThis`;
> - запис у read-only властивість чи в non-extensible об'єкт кидає `TypeError`;
> - заборонені `with`, однакові імена параметрів, вісімкові літерали `010`;
> - `arguments` не синхронізується з параметрами.
>
> ```js
> 'use strict';
> function f() { return this; }
> f(); // undefined
> total = 5; // ReferenceError
> ```
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39|Розділ: сучасний JS і TC39]] · [MDN: Strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) · [Spec: Strict Mode Code](https://tc39.es/ecma262/#sec-strict-mode-code)

> [!question]- Чим транспіляція відрізняється від поліфілу?
> *часто · порівняння* · `js-07-005`
>
> **Транспіляція** переписує синтаксис, який старе середовище не розуміє, на еквівалентний старий синтаксис (Babel, SWC, esbuild, TypeScript). **Поліфіл** — це код, що додає відсутні API під час виконання, не змінюючи ваш вихідний код.
>
> ```js
> // Синтаксис: тільки транспіляція
> const name = user?.profile?.name ?? 'Guest';
>
> // API: тільки поліфіл
> [3, 1, 2].toSorted();
> Object.hasOwn(obj, 'id');
> ```
>
> Оператор `?.` неможливо «додати» функцією — парсер старого браузера впаде на ньому ще до виконання. А `Array.prototype.toSorted` — звичайний метод, його можна дописати в прототип, якщо його там немає.
>
> Деякі фічі не піддаються ні тому, ні іншому повністю: `Proxy` чи `WeakRef` не емулюються коректно.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39|Розділ: сучасний JS і TC39]] · [MDN: Polyfill](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill) · [Babel: @babel/preset-env](https://babeljs.io/docs/babel-preset-env)

> [!question]- Чим `<script type="module">` відрізняється від звичайного `<script>`?
> *часто · теорія* · `js-07-006`
>
> Модульний скрипт поводиться як ES module, а не як класичний скрипт:
> - за замовчуванням **відкладений** як `defer`: не блокує парсинг HTML і виконується після нього, у порядку появи; з `async` — одразу після завантаження;
> - має власну область видимості: `const x` не стає глобальною змінною;
> - працює в strict mode, `this` на верхньому рівні — `undefined`;
> - виконується один раз, навіть якщо підключений двічі з тим самим URL;
> - завантажується через CORS: з `file://` чи чужого домену без заголовків не спрацює.
>
> ```html
> <script type="module" src="/app.js"></script>
> <script nomodule src="/legacy.js"></script>
> ```
>
> Атрибут `nomodule` історично використовували для окремого бандла під браузери без підтримки ESM.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [MDN: script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script) · [javascript.info: Scripts: async, defer](https://javascript.info/script-async-defer)

## 🟡 Middle

> [!question]- Що таке live bindings в ES modules і чим це відрізняється від CommonJS?
> *часто · код* · `js-07-007`
>
> Імпорт в ESM — це не копія значення, а **live binding**: посилання на змінну в модулі-експортері. Якщо експортер змінить змінну, імпортер побачить нове значення. При цьому з боку імпортера binding read-only: присвоєння кине `TypeError`.
>
> У CommonJS `require` повертає об'єкт `module.exports`; деструктуризація копіює примітиви в момент виклику.
>
> ```js
> // counter.mjs
> export let count = 0;
> export function inc() { count++; }
>
> // main.mjs
> import { count, inc } from './counter.mjs';
> inc();
> console.log(count); // 1
> count = 5;          // TypeError: Assignment to constant variable.
> ```
>
> ```js
> // counter.cjs
> let count = 0;
> module.exports = { count, inc() { count++; } };
>
> // main.cjs
> const { count, inc } = require('./counter.cjs');
> inc();
> console.log(count); // 0
> ```
>
> Live bindings — також причина, чому ESM коректніше розв'язує циклічні залежності: binding існує ще до того, як модуль виконався.
>
> **На співбесіді:** namespace-об'єкт `import * as ns` теж «живий» і заморожений — додати чи змінити властивість не можна.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [MDN: import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) · [Spec: Modules](https://tc39.es/ecma262/#sec-modules)

> [!question]- Як працює dynamic `import()` і як його використовують для code splitting?
> *часто · код* · `js-07-008`
>
> `import(specifier)` — вираз (не функція), який повертає **Promise із namespace-об'єктом модуля**. На відміну від статичного `import`, його можна викликати будь-де: в умові, в обробнику події, з обчисленим шляхом. Працює і в ESM, і в CommonJS-коді Node.
>
> Бандлери (Vite/Rollup, webpack, esbuild) бачать `import('./x.js')` і виносять `x.js` та його унікальні залежності в **окремий chunk**, який завантажується лише при виклику.
>
> ```js
> button.addEventListener('click', async () => {
>   const { renderChart } = await import('./chart.js');
>   renderChart(data);
> });
>
> const Settings = React.lazy(() => import('./Settings.jsx'));
> ```
>
> Нюанси:
> - повторний `import()` того ж модуля не завантажує його знову — модуль кешується;
> - шлях має бути аналізованим: `import(\`./locales/${lang}.js\`)` бандлер розгорне в набір chunk'ів за шаблоном, а повністю довільну змінну — ні;
> - default export доступний як `mod.default`.
>
> **На співбесіді:** згадай route-based splitting і prefetch/`modulepreload`, щоб не отримати затримку при першому кліку.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [MDN: import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) · [javascript.info: Dynamic imports](https://javascript.info/modules-dynamic-imports)

> [!question]- Як Node.js визначає, чи файл є ES module, чи CommonJS?
> *часто · теорія* · `js-07-009`
>
> Node дивиться на розширення і найближчий `package.json`:
> - `.mjs` — завжди ESM, `.cjs` — завжди CommonJS;
> - `.js` — за полем `"type"` найближчого `package.json`: `"module"` означає ESM, `"commonjs"` або відсутність поля — CJS;
> - `--input-type` керує кодом, переданим через `--eval` чи stdin.
>
> Починаючи з Node 22.7, для `.js` без поля `"type"` працює syntax detection: якщо файл не парситься як CJS через ESM-синтаксис, Node повторно завантажує його як ESM. Це повільніше і неочевидно, тому поле `"type"` краще задавати явно.
>
> ```json
> {
>   "name": "my-app",
>   "type": "module"
> }
> ```
>
> У ESM-файлах немає `require`, `__dirname`, `__filename`. Замість них — `import.meta.url`, `import.meta.dirname`, `import.meta.filename` (Node 20.11+) і `createRequire` з `node:module`.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [Node.js: Determining module system](https://nodejs.org/api/packages.html#determining-module-system) · [Node.js: ECMAScript modules](https://nodejs.org/api/esm.html)

> [!question]- Як працює tree shaking і що йому заважає?
> *часто · теорія* · `js-07-010`
>
> Tree shaking — видалення з бандла експортів, які ніде не імпортуються. Воно можливе завдяки **статичній структурі ESM**: бандлер знає всі imports/exports без виконання коду.
>
> Але видалити невикористаний модуль цілком можна тільки якщо його виконання не має побічних ефектів. Бандлер не завжди може це довести, тому є підказки:
> - `"sideEffects": false` у `package.json` — «будь-який файл пакета можна викинути, якщо з нього нічого не використано»; або масив файлів з ефектами, наприклад `["*.css", "./src/polyfills.js"]`;
> - анотація `/*#__PURE__*/` перед викликом — результат не використано, виклик можна прибрати.
>
> Що заважає:
> - CommonJS (`require`, `module.exports`) — динамічна структура;
> - доступ до namespace за обчисленим ключем `ns[name]`;
> - код верхнього рівня з ефектами (реєстрація плагінів, мутація глобалів);
> - великі barrel-файли без `sideEffects: false`.
>
> ```js
> export const Button = /*#__PURE__*/ styled('button')({});
> ```
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [MDN: Tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) · [webpack: Tree Shaking](https://webpack.js.org/guides/tree-shaking/)

> [!question]- Як налаштувати транспіляцію і поліфіли під цільові браузери (browserslist, core-js)?
> *іноді · практика* · `js-07-011`
>
> Цільові середовища описують **один раз** у browserslist (`.browserslistrc` або поле `browserslist` у `package.json`). Цю конфігурацію читають Babel `preset-env`, Autoprefixer, SWC, а також плагіни для Vite (`@vitejs/plugin-legacy`).
>
> ```json
> {
>   "browserslist": ["> 0.5%", "last 2 versions", "not dead"]
> }
> ```
>
> Поліфіли зазвичай беруть з **core-js**. У Babel режим `useBuiltIns: 'usage'` додає імпорти лише тих поліфілів, які реально використовуються в коді і відсутні в таргетах; `'entry'` замінює `import 'core-js'` на повний набір для таргетів.
>
> ```js
> // babel.config.js
> export default {
>   presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: '3.40' }]],
> };
> ```
>
> Пастки:
> - `node_modules` часто не транспілюються, тому сучасний синтаксис у залежностях ламає старі браузери;
> - занадто широкі таргети роздувають бандл;
> - esbuild лише транспілює синтаксис, поліфіли не підставляє.
>
> **На співбесіді:** рішення про таргети — продуктове, його варто підтверджувати аналітикою реальних браузерів користувачів.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39|Розділ: сучасний JS і TC39]] · [Browserslist](https://github.com/browserslist/browserslist) · [Babel: @babel/preset-env](https://babeljs.io/docs/babel-preset-env)

> [!question]- Що таке source maps, як вони працюють і чи варто віддавати їх у продакшн?
> *іноді · теорія* · `js-07-012`
>
> Source map — JSON-файл, що зіставляє позиції у згенерованому (мініфікованому, транспільованому) коді з позиціями в оригінальних файлах. DevTools, Node і сервіси моніторингу помилок використовують його, щоб показати стек у вихідному коді. Формат стандартизовано як ECMA-426.
>
> Як влаштовано:
> - поля `sources`, `names`, `sourcesContent` і `mappings`, де відповідності закодовані Base64 VLQ;
> - зв'язок через коментар `//# sourceMappingURL=app.js.map` або HTTP-заголовок `SourceMap`;
> - у Node увімкнути використання — `--enable-source-maps`.
>
> У продакшні типовий підхід — **hidden source maps**: `.map`-файли генеруються, завантажуються в Sentry чи аналог при деплої, але не публікуються і не мають коментаря в бандлі. Так стеки помилок читабельні, а вихідний код не віддається всім охочим.
>
> **На співбесіді:** згадай, що source maps треба версіонувати разом із релізом, інакше стек буде зіставлено з неправильною збіркою.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [MDN: Source map](https://developer.mozilla.org/en-US/docs/Glossary/Source_map) · [web.dev: What are source maps?](https://web.dev/articles/source-maps)

> [!question]- Як нова фіча потрапляє в JavaScript? Опиши стадії TC39.
> *іноді · теорія* · `js-07-013`
>
> Мову розвиває комітет **TC39** в Ecma International. Кожна пропозиція проходить стадії:
> - **0** — ідея, ще не прийнята до розгляду;
> - **1** — Proposal: є champion, описана проблема, комітет готовий її досліджувати;
> - **2** — Draft: обрано рішення, є чорновий текст специфікації;
> - **2.7** — текст специфікації завершено і схвалено, чекають на тести і прототипи (стадію додали 2024 року);
> - **3** — Candidate: є тести test262, браузери впроваджують, міняють лише через знайдені проблеми;
> - **4** — Finished: дві сумісні реалізації, що вже поставляються, фіча йде в наступну редакцію.
>
> Щороку (зазвичай у червні) виходить нова редакція ECMAScript, яка включає все, що досягло stage 4.
>
> Практичний висновок: stage 3 і нижче в продакшн-коді — ризик. Декоратори в TypeScript (`experimentalDecorators`) відрізняються від стандартних, бо реалізовані за старим драфтом.
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39|Розділ: сучасний JS і TC39]] · [TC39: The TC39 Process](https://tc39.es/process-document/) · [TC39: Proposals](https://github.com/tc39/proposals)

> [!question]- Які нововведення ES2022–ES2025 ти реально використовуєш?
> *часто · код* · `js-07-014`
>
> Сильна відповідь — кілька фіч з конкретною користю, а не перелік усього.
>
> - **ES2022:** `at()` для індексів з кінця, `Object.hasOwn` замість `hasOwnProperty.call`, top-level await, приватні поля `#x`, `Error` з `cause`.
> - **ES2023:** незмінні копії масивів — `toSorted`, `toReversed`, `toSpliced`, `with`; а також `findLast`.
> - **ES2024:** `Object.groupBy`, `Promise.withResolvers`, прапорець RegExp `v`.
> - **ES2025:** методи Set (`union`, `intersection`…), Iterator helpers, import attributes для JSON, `Promise.try`, `RegExp.escape`.
>
> ```js
> const items = [5, 1, 4];
> items.at(-1);                        // 4
> const sorted = items.toSorted();     // [1, 4, 5], items не змінився
> Object.groupBy(users, (u) => u.role);
>
> function* ids() { let i = 0; while (true) yield i++; }
> ids().filter((n) => n % 2).map((n) => n * 10).take(3).toArray(); // [10, 30, 50]
>
> /[\p{L}--[a-z]]/v.test('é');         // true: літера, але не латинська мала
> ```
>
> Iterator helpers ліниві: `take(3)` зупиняє нескінченний генератор. Прапорець `v` додає операції над множинами в класах символів (`--`, `&&`).
>
> 📚 [[JavaScript - 34. Сучасний JS і TC39|Розділ: сучасний JS і TC39]] · [TC39: Finished Proposals](https://github.com/tc39/proposals/blob/main/finished-proposals.md)

## 🔴 Senior

> [!question]- Що відбувається при циклічних залежностях у CommonJS і в ES modules?
> *іноді · код* · `js-07-015`
>
> Обидві системи дозволяють цикли, але проявляються вони по-різному.
>
> **CommonJS:** модуль кладеться в кеш до виконання. Коли `b` запитує `a`, який ще виконується, `require` повертає **частково заповнений** `module.exports` — без помилки, просто з `undefined` на місці того, що ще не встигло присвоїтись. Особливо підступно при `module.exports = {...}` в кінці файлу: `b` тримає посилання на старий порожній об'єкт.
>
> **ESM:** на етапі linking створюються bindings усіх модулів, тому імпорт існує. Але `let`/`const`/`class` ще в **TDZ**, доки модуль не виконався, і звернення кидає `ReferenceError`. Function declarations ініціалізуються ще під час linking, тож їх можна викликати з циклу.
>
> ```js
> // a.mjs
> import { b } from './b.mjs';
> export const a = 'A';
>
> // b.mjs
> import { a } from './a.mjs';
> export const b = 'B';
> console.log(a); // node a.mjs → ReferenceError: Cannot access 'a' before initialization
> ```
>
> Як лікувати:
> - винести спільне в третій модуль, від якого залежать обидва;
> - звертатися до імпорту лише всередині функцій, що викликаються пізніше;
> - інвертувати залежність (передати колбек чи реєстр замість прямого імпорту).
>
> **На співбесіді:** цикли в коді часто виявляються як «іноді `undefined` залежно від того, який файл імпортували першим» — порядок входу в граф визначає, хто побачить неповний модуль. Для CI є `madge --circular` і `import/no-cycle`.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [Node.js: Module cycles](https://nodejs.org/api/modules.html#cycles) · [Spec: Cyclic Module Records](https://tc39.es/ecma262/#sec-cyclic-module-records)

> [!question]- Як працює поле `exports` у `package.json` і conditional exports?
> *іноді · практика* · `js-07-016`
>
> Поле `exports` визначає **публічний API пакета**: які specifier'и можна імпортувати і в які файли вони резолвляться. Воно має пріоритет над `main`. Після його появи будь-який шлях, не перелічений у мапі, недоступний: `import 'pkg/dist/internal.js'` дасть `ERR_PACKAGE_PATH_NOT_EXPORTED`. Тому додавання `exports` в існуючий пакет — breaking change.
>
> Conditional exports обирають файл за середовищем. Резолвер іде по ключах **у порядку оголошення** і бере перший, що збігся, тому `default` завжди останній, а `types` для TypeScript — першим.
>
> ```json
> {
>   "name": "@acme/ui",
>   "type": "module",
>   "exports": {
>     ".": {
>       "types": "./dist/index.d.ts",
>       "import": "./dist/index.js",
>       "require": "./dist/index.cjs"
>     },
>     "./icons/*": "./dist/icons/*.js",
>     "./package.json": "./package.json"
>   },
>   "sideEffects": false
> }
> ```
>
> Subpath patterns (`"./icons/*"`) відкривають цілу папку одним правилом, а значення `null` явно закриває підшлях, наприклад `"./icons/internal/*": null`.
>
> Стандартні умови Node: `import`, `require`, `module-sync`, `node`, `default`; бандлери додають `browser`, `development`/`production`, також поширені кастомні через `--conditions`.
>
> **На співбесіді:** згадай, що TypeScript враховує `exports` лише з `moduleResolution: "node16"`/`"nodenext"`/`"bundler"`; зі старим `"node"` типи будуть братися не звідти.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [Node.js: Conditional exports](https://nodejs.org/api/packages.html#conditional-exports)

> [!question]- Що таке dual package hazard і як сьогодні правильно публікувати пакет для ESM і CJS?
> *іноді · порівняння* · `js-07-017`
>
> Dual package — пакет, що поставляє окремі збірки для `import` і `require`. **Hazard**: якщо в одному застосунку одна частина коду імпортує пакет через ESM, а інша через CJS, завантажаться **дві незалежні копії**. Наслідки: два singleton'и (два кеші, два реєстри), `instanceof` повертає `false` для об'єкта з «іншої» копії, подвійна ініціалізація.
>
> Підходи:
> - **ESM-обгортка над CJS:** реальна логіка лише в CJS, а ESM-вхід реекспортує її (`export const { a, b } = cjs`). Одна копія стану.
> - **Стан винесено** в окремий CJS-модуль, який спільно використовують обидві збірки.
> - **ESM-only:** з Node 22.12 (і 20.19) `require()` синхронного ESM-графа працює без прапорця, тож CJS-споживачі можуть завантажити ESM-пакет. Обмеження: граф не має містити top-level await, інакше `ERR_REQUIRE_ASYNC_MODULE`.
>
> Також існує умова `module-sync` в `exports`, яка дозволяє віддати один ESM-файл і для `import`, і для `require` у версіях Node, що підтримують `require(esm)`.
>
> **На співбесіді:** для нової бібліотеки у 2025+ розумний дефолт — ESM-only з мінімальною версією Node у `engines`; dual build має сенс, лише якщо реально є споживачі на старих рантаймах.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [Node.js: Dual CommonJS/ES module packages](https://nodejs.org/api/packages.html#dual-commonjses-module-packages) · [Node.js: Packages (exports, type)](https://nodejs.org/api/packages.html)

> [!question]- Як top-level await впливає на граф модулів і коли він шкодить?
> *іноді · теорія* · `js-07-018`
>
> Top-level await (ES2022) дозволяє `await` на верхньому рівні ES module. Модуль стає **асинхронним вузлом графа**: усі модулі, що від нього транзитивно залежать, не почнуть виконуватись, доки його проміс не виконається. Сусідні гілки графа, які від нього не залежать, можуть виконуватись паралельно.
>
> ```js
> // config.js
> const res = await fetch('/config.json');
> export const config = await res.json();
>
> // app.js — почне виконуватись лише після завантаження config
> import { config } from './config.js';
> ```
>
> Де корисний: одноразова ініціалізація (WASM, конфіг), fallback-імпорти `await import()` з `try/catch`, скрипти й CLI.
>
> Де шкодить:
> - **прихований waterfall**: мережевий запит у «невинному» модулі блокує весь застосунок, і це не видно з місця імпорту;
> - помилка в TLA ламає завантаження всіх залежних модулів;
> - у циклічних залежностях з TLA порядок виконання стає складним для розуміння;
> - такий модуль неможливо завантажити через `require(esm)` у Node;
> - бібліотека з TLA змушує всіх споживачів чекати.
>
> **На співбесіді:** у бібліотечному коді краще експортувати асинхронну фабрику `init()` або ліниво ініціалізований проміс, а TLA лишати для entry-point застосунку.
>
> 📚 [[JavaScript - 10. async і await#Top-level await і for await|Розділ: top-level await]] · [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) · [V8: Top-level await](https://v8.dev/features/top-level-await)

> [!question]- Чи потрібен бандлер, якщо браузери підтримують ES modules і import maps?
> *іноді · порівняння* · `js-07-019`
>
> Нативний ESM і **import maps** закривають частину задач бандлера. Import map дозволяє використовувати bare specifiers у браузері без збірки:
>
> ```html
> <script type="importmap">
> {
>   "imports": {
>     "lodash-es/": "/vendor/lodash-es/",
>     "preact": "https://esm.sh/preact@10"
>   }
> }
> </script>
> <script type="module">
>   import { h } from 'preact';
> </script>
> ```
>
> Але бандлер у продакшні досі дає важливе:
> - **менше запитів і без waterfall**: браузер дізнається про залежності модуля лише після його завантаження, тож глибокий граф — це послідовні round-trip'и навіть з HTTP/2; `modulepreload` допомагає частково;
> - tree shaking, мініфікація, scope hoisting;
> - трансформації: TypeScript, JSX, CSS-модулі, assets з хешами для довгого кешування;
> - code splitting зі спільними chunk'ами.
>
> Без збірки розумно жити на невеликих сайтах, внутрішніх тулзах, у прототипах, або де застосунок складається з кількох модулів. Також vendor-модулі через import map добре кешуються окремо від коду застосунку.
>
> **На співбесіді:** Vite в dev-режимі якраз віддає нативний ESM без бандлінгу (швидкий старт), а в prod — бандлить. Це і є практична відповідь на питання.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [MDN: Import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) · [Vite: Why Vite](https://vite.dev/guide/why)

## 🟣 Tech Lead

> [!question]- Як ти обираєш інструменти збірки (Vite, esbuild, tsc, Rollup, webpack) для проєкту?
> *іноді · практика* · `js-07-020`
>
> Обираю від типу артефакту і вимог, а не від моди.
>
> - **SPA/фронтенд-застосунок:** Vite як дефолт — швидкий dev-сервер на нативному ESM, продакшн-збірка через Rollup (Vite переходить на Rust-бандлер Rolldown). Next.js/Remix тощо приносять власний пайплайн — тоді обговорюємо фреймворк, а не бандлер.
> - **Бібліотека:** Rollup або обгортки над esbuild/Rolldown (tsup, tsdown) — потрібні ESM-вихід, `.d.ts`, правильні `exports`. Бандлити залежності в бібліотеку зазвичай не можна.
> - **Node-сервіс:** часто достатньо `tsc` або взагалі запуску `.ts` через type stripping у свіжих Node (23.6+, бекпорт у 22.18) з обмеженнями на enum/namespace. Бандл через esbuild — коли важливий холодний старт (serverless).
> - **Великий legacy на webpack:** міграція має бути обґрунтована метриками (час CI, HMR), бо конфіг і плагіни часто містять неявну бізнес-логіку.
>
> Незалежно від інструменту: **type-check окремо** (`tsc --noEmit` у CI), бо esbuild/SWC лише стирають типи; `isolatedModules: true`, щоб код компілювався пофайлово.
>
> Критерії, які фіксую в ADR: швидкість dev-циклу, розмір і стабільність бандла, підтримка SSR/workers, зрілість екосистеми плагінів, хто в команді це підтримуватиме. Роблю spike на реальному коді, а не на hello world.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [Vite: Why Vite](https://vite.dev/guide/why) · [esbuild](https://esbuild.github.io/)

> [!question]- Як забезпечити межі модулів у монорепозиторії?
> *рідко · практика* · `js-07-021`
>
> Межі мають бути **механічно перевірюваними**, а не домовленістю на рев'ю.
>
> Рівень пакетів:
> - кожен пакет має явне поле `exports` — deep imports у чужі `src/internal` неможливі на рівні резолвера;
> - залежності між пакетами оголошені в `package.json` (`"@acme/core": "workspace:*"` у pnpm), а не підтягуються через hoisting — pnpm з ізольованим `node_modules` це ловить;
> - TypeScript project references або спільний `tsconfig` з `paths`, що вказують лише на публічні входи.
>
> Рівень архітектури:
> - правила напрямку залежностей: `ui` → `domain` → `core`, але не навпаки. Інструменти: `@nx/enforce-module-boundaries` з тегами, `dependency-cruiser`, `eslint-plugin-boundaries`, `no-restricted-imports`;
> - заборона циклів (`import/no-cycle`, `madge`) у CI;
> - власник кожного пакета в `CODEOWNERS`.
>
> Про barrel-файли: один `index.ts` як публічний API пакета — добре; barrel у кожній папці всередині застосунку — погано для tree shaking, швидкості dev-сервера і дає приховані цикли.
>
> **На співбесіді:** додай, що граф залежностей монорепо також керує CI — affected-builds (Nx, Turborepo) перебудовують лише те, що залежить від змін, і це працює лише коли межі чесні.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [Nx: Enforce Module Boundaries](https://nx.dev/docs/features/enforce-module-boundaries) · [TypeScript: Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

> [!question]- Як версіонувати внутрішні пакети і керувати breaking changes?
> *рідко · практика* · `js-07-022`
>
> Спершу вирішую, чи потрібні версії взагалі. Якщо всі споживачі в тому самому монорепо і збираються разом, простіше **workspace-залежності без публікації**: зміна API і всі її споживачі оновлюються в одному PR, CI перевіряє все одразу.
>
> Якщо пакети публікуються в приватний реєстр або ними користуються інші репо — **semver** з автоматизацією (Changesets, semantic-release): кожен PR несе changeset з типом зміни, змінелог і версії генеруються.
>
> Що вважаю breaking change (major), бо команди часто цього не помічають:
> - видалення чи перейменування експорту, зміна сигнатури або типів;
> - зміна мапи `exports` (включно з першою появою поля);
> - перехід на ESM-only, підвищення мінімальної версії Node у `engines`;
> - зміна `peerDependencies`, поведінки за замовчуванням, формату подій чи помилок.
>
> Процес:
> - спершу `@deprecated` з JSDoc і runtime-warning, одна-дві мінорні версії з обома API;
> - codemod (jscodeshift, ts-morph) для масової міграції споживачів;
> - API report (API Extractor) у CI, щоб будь-яка зміна публічної поверхні була видна на рев'ю;
> - обмежена кількість підтримуваних мажорів.
>
> **На співбесіді:** головне — зробити вартість breaking change видимою до мерджу, а не після того, як впаде чужий деплой.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [Semantic Versioning](https://semver.org/) · [Changesets](https://github.com/changesets/changesets)

## Тести

> [!quiz] Як за замовчуванням виконується `<script type="module" src="app.js">` без додаткових атрибутів?
> level: junior · id: js-07-quiz-01
> - [ ] Синхронно, блокуючи парсинг HTML, як звичайний скрипт
> - [x] Як `defer`: завантажується паралельно, виконується після парсингу HTML
> - [ ] Як `async`: виконується одразу після завантаження, порядок не гарантовано
> - [ ] Лише після події `load` сторінки
>
> **Пояснення:** Модульні скрипти відкладені за замовчуванням і виконуються в порядку появи після парсингу документа. Атрибут `async` змінює це на виконання одразу після завантаження всього графа модуля.

> [!quiz] На якій стадії TC39 пропозиція вважається завершеною і включається в наступну редакцію ECMAScript?
> level: middle · id: js-07-quiz-02
> - [ ] Stage 2.7
> - [ ] Stage 3
> - [x] Stage 4
> - [ ] Stage 5
>
> **Пояснення:** Stage 4 вимагає тестів test262 і двох сумісних реалізацій, що вже поставляються. Stage 3 означає, що дизайн зафіксовано і йде впровадження, але фіча ще не в стандарті.

> [!quiz] Оберіть усі правильні: що заважає бандлеру виконати tree shaking?
> level: middle · type: multi · id: js-07-quiz-03
> - [x] Модуль експортує через `module.exports = { ... }`
> - [x] Код звертається до namespace за обчисленим ключем: `utils[name]()`
> - [ ] Модуль використовує `export const` і `export function`
> - [x] На верхньому рівні модуля є виклик з побічним ефектом, а пакет не позначено `sideEffects: false`
>
> **Пояснення:** Tree shaking спирається на статичну структуру ESM, тож CommonJS і динамічний доступ до namespace змушують залишити все. Побічні ефекти верхнього рівня не дають викинути модуль цілком, якщо бандлер не має підказки, що ефектів немає.

> [!quiz] Що виведе код?
> level: middle · type: output · id: js-07-quiz-04
>
> ```js
> // counter.mjs
> export let count = 0;
> export function inc() { count++; }
>
> // main.mjs
> import { count, inc } from './counter.mjs';
> inc();
> inc();
> console.log(count);
> ```
>
> - [ ] `0`
> - [x] `2`
> - [ ] `undefined`
> - [ ] `TypeError`
>
> **Пояснення:** ESM-імпорт — live binding на змінну експортера, а не копія. `inc` змінює `count` усередині `counter.mjs`, і `main.mjs` бачить актуальне значення.

> [!quiz] Що виведе `node a.js`?
> level: senior · type: output · id: js-07-quiz-05
>
> ```js
> // a.js
> exports.loaded = false;
> const b = require('./b.js');
> console.log('a: b.loaded =', b.loaded);
> exports.loaded = true;
>
> // b.js
> exports.loaded = false;
> const a = require('./a.js');
> console.log('b: a.loaded =', a.loaded);
> exports.loaded = true;
> ```
>
> - [x] `b: a.loaded = false`, потім `a: b.loaded = true`
> - [ ] `b: a.loaded = true`, потім `a: b.loaded = true`
> - [ ] `a: b.loaded = false`, потім `b: a.loaded = false`
> - [ ] `Error: Circular dependency detected`
>
> **Пояснення:** CommonJS кешує модуль до виконання. Коли `b.js` запитує `a.js`, що ще виконується, він отримує частково заповнений `exports` з `loaded = false`. Потім `b.js` завершується повністю, і `a.js` бачить `b.loaded = true`.

## Задачі

> [!task] Реалізуй мінімальний `require` з кешем і підтримкою циклів
> level: middle · difficulty: medium · id: js-07-task-01 · tags: modules, commonjs, caching
>
> Умова: є реєстр модулів `registry`, де ключ — id модуля, а значення — фабрика `(module, exports, require) => void`, як у CommonJS-обгортці. Напиши `createRequire(registry)`, що повертає функцію `require(id)`. Кожна фабрика виконується не більше одного разу, повторні виклики повертають закешований `module.exports`. Циклічні залежності мають працювати як у Node: модуль, що ще виконується, віддає свій частково заповнений `exports`. Невідомий id — помилка `Cannot find module '<id>'`.
>
> ```js
> const require = createRequire({
>   a: (module, exports, require) => { exports.x = 1; exports.fromB = require('b').y; },
>   b: (module, exports, require) => { exports.y = 2; exports.aX = require('a').x; },
> });
> require('a'); // { x: 1, fromB: 2 }, фабрики виконались по одному разу
> ```
>
> > [!hint]- Підказка 1
> > Тобі потрібна мапа `id → module`, що живе в замиканні `createRequire`.
>
> > [!hint]- Підказка 2
> > Коли саме класти модуль у кеш: до виклику фабрики чи після? Подумай, що побачить цикл.
>
> > [!hint]- Підказка 3
> > Не забудь, що фабрика може повністю замінити `module.exports`, тому повертати треба `module.exports` після виконання, а не початковий об'єкт `exports`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createRequire(registry) {
> >   const cache = new Map();
> >
> >   function require(id) {
> >     if (cache.has(id)) return cache.get(id).exports;
> >     const factory = registry[id];
> >     if (typeof factory !== 'function') {
> >       throw new Error(`Cannot find module '${id}'`);
> >     }
> >     const module = { id, exports: {}, loaded: false };
> >     cache.set(id, module);
> >     try {
> >       factory(module, module.exports, require);
> >     } catch (err) {
> >       cache.delete(id);
> >       throw err;
> >     }
> >     module.loaded = true;
> >     return module.exports;
> >   }
> >
> >   require.cache = cache;
> >   return require;
> > }
> > ```
> >
> > Модуль потрапляє в кеш до виконання фабрики, тому повторний вхід у цикл повертає частково заповнений `exports`, а не запускає фабрику знову й не йде в нескінченну рекурсію. При помилці модуль видаляється з кешу, як і в Node, щоб наступний `require` міг спробувати ще раз. Кожен модуль виконується O(1) разів; `registry[id]` варто замінити на `Object.hasOwn`-перевірку, якщо id може збігтися з `toString` чи іншими ключами прототипу.

> [!task] Обчисли порядок виконання ES-модулів і знайди цикли
> level: senior · difficulty: hard · id: js-07-task-02 · tags: modules, esm, graphs
>
> Умова: граф залежностей задано об'єктом `graph`, де `graph[id]` — масив імпортів модуля в порядку їх появи у файлі. Напиши `evaluationOrder(graph, entry)`, що повертає `{ order, cycles }`. `order` — порядок, у якому ES modules виконають модулі: DFS від `entry`, залежності в порядку імпорту, модуль виконується після всіх своїх залежностей, кожен лише раз; ребро на модуль, який зараз у стеку обходу, пропускається. `cycles` — масив таких «зворотних» ребер у вигляді шляху від модуля в стеку до нього самого.
>
> ```js
> const graph = { main: ['a', 'c'], a: ['b'], b: ['a', 'c'], c: [] };
> evaluationOrder(graph, 'main');
> // { order: ['c', 'b', 'a', 'main'], cycles: [['a', 'b', 'a']] }
> ```
>
> > [!hint]- Підказка 1
> > Це post-order обхід у глибину. Порядок дітей важливий: вони відповідають порядку `import` у файлі.
>
> > [!hint]- Підказка 2
> > Розрізняй три стани вузла: не відвіданий, у стеку (visiting), завершений (done). Цикл — це ребро у вузол зі станом visiting.
>
> > [!hint]- Підказка 3
> > Тримай явний масив поточного шляху. Коли знайшов ребро в visiting-вузол, відріж шлях від індексу цього вузла і додай сам вузол у кінець.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function evaluationOrder(graph, entry) {
> >   const state = new Map();
> >   const order = [];
> >   const cycles = [];
> >   const path = [];
> >
> >   function visit(id) {
> >     state.set(id, 'visiting');
> >     path.push(id);
> >     for (const dep of graph[id] ?? []) {
> >       const s = state.get(dep);
> >       if (s === 'done') continue;
> >       if (s === 'visiting') {
> >         cycles.push([...path.slice(path.indexOf(dep)), dep]);
> >         continue;
> >       }
> >       visit(dep);
> >     }
> >     path.pop();
> >     state.set(id, 'done');
> >     order.push(id);
> >   }
> >
> >   visit(entry);
> >   return { order, cycles };
> > }
> > ```
> >
> > Модуль додається в `order` лише після обходу всіх його залежностей — це і є post-order, яким специфікація виконує граф (спрощено, без top-level await). Ребро у вузол у стеку не обходиться повторно: саме тому в реальному ESM модуль у циклі може виконатися раніше за свою залежність і отримати TDZ-помилку. Складність O(V + E); для дуже глибоких графів рекурсію варто замінити явним стеком.
