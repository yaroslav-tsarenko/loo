---
title: "Модулі: ESM, CommonJS і бандлери"
order: 21
level: middle
tags: [modules, esm, commonjs, node, bundlers, tree-shaking, import-maps]
prerequisites:
  - "[[JavaScript - 04. Scope, hoisting і TDZ]]"
  - "[[JavaScript - 10. async і await]]"
estimatedMinutes: 55
id: jsd-ch-21
icon: "🧩"
---

# Модулі: ESM, CommonJS і бандлери

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити, як модулі еволюціонували від IIFE через CommonJS і AMD до ES-модулів і чому ESM — статичні;
> - використовувати всі форми `import`/`export` і пояснити, що таке live binding;
> - передбачити порядок виконання модулів у графі, зокрема з циклічними залежностями й top-level await;
> - налаштувати `package.json` (`type`, `exports`) і передбачити, як CommonJS і ESM взаємодіють у Node;
> - пояснити, що роблять бандлери (Vite, esbuild, webpack, Rollup), як працює tree shaking і навіщо import maps.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-21-quiz-01
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
> **Відповідь:** `2`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. ES-модулі експортують не **значення**, а **зв'язки** (live bindings): `count` у `main.mjs` — це «вікно» на змінну всередині `counter.mjs`, тому видно оновлене значення. У CommonJS з деструктуризацією `const { count } = require(...)` вийшло б `0` — там копіюється значення.

## 🧒 Простими словами

Модуль — це **кімната з дверима**. Усе, що всередині, — приватне, а назовні видно лише те, що ти виставив у «вітрину» (`export`). ES-модулі — це вітрина з **живими екранами**: якщо всередині щось змінилося, на екрані одразу видно нове. CommonJS — це вітрина з **фотографіями**: сфотографували один раз, коли хтось попросив, і далі фото не оновлюється. А бандлер — це прибиральник перед переїздом: обходить усі кімнати, викидає речі, яких ніхто не використовує (tree shaking), і пакує решту в кілька коробок.

## 🔬 Як це працює насправді

### 📜 Коротка історія модулів

```text
  1995–2009   <script> + глобальні змінні → конфлікти імен, порядок тегів вирішує все
  ~2005       IIFE / module pattern       → (function () { … })() ховає змінні, експорт — через window
  2009        CommonJS (Node.js)          → require() / module.exports, синхронно, з диска
  2011        AMD (RequireJS)             → define([...deps], factory) — асинхронно для браузера
  ~2013       UMD                         → «працює і там, і там»: обгортка, що визначає середовище
  2015        ES Modules (ES2015)         → import / export — стандарт мови, статична структура
  2017–2020   ESM у браузерах і Node      → <script type="module">, .mjs, "type": "module"
```

Ключова відмінність ESM від усіх попередників — **статичність**: `import` і `export` можуть бути лише на верхньому рівні модуля, зі специфікатором-рядком. Тому граф залежностей відомий **до виконання** коду — на цьому тримаються tree shaking, раннє виявлення помилок імпорту і паралельне завантаження. `require()` — звичайна функція: її можна викликати в `if`, з обчисленим шляхом, посеред функції — і граф відомий лише під час виконання.

Додаткові властивості ESM: завжди **strict mode**, власний module scope (верхньорівневі `var` не потрапляють у `globalThis`), `this` на верхньому рівні — `undefined`, кожен модуль **виконується один раз** (singleton) незалежно від кількості імпортів.

> [!quiz] Перевір себе: що з цього можливо лише в CommonJS, але не в статичному `import`?
> level: middle · type: multi · id: jsd-21-quiz-02
> - [x] Підключити модуль усередині `if`
> - [x] Обчислити шлях модуля в рантаймі: `require(`./locales/${lang}`)`
> - [ ] Імпортувати модуль лише заради побічних ефектів
> - [ ] Перейменувати імпортоване ім'я
>
> **Пояснення:** статичний `import` — лише на верхньому рівні з рядковим літералом. Для умовного й обчисленого завантаження в ESM є динамічний `import()`, що повертає проміс.

### 📦 import і export — усі форми

```js
// ── export ───────────────────────────────────────────
export const PI = 3.14;                     // named, оголошення
export function area(r) { return PI * r * r; }
const secret = 1;
export { secret as publicName };            // named з перейменуванням
export default class Shape {}               // default — один на модуль

export * from './utils.js';                 // реекспорт усіх named (без default!)
export * as geometry from './geometry.js';  // реекспорт як простір імен
export { default as Circle } from './circle.js';

// ── import ───────────────────────────────────────────
import Shape from './shape.js';                     // default — ім'я обираєш сам
import { area, PI as pi } from './math.js';         // named, з перейменуванням
import * as math from './math.js';                  // namespace object
import Shape2, { area as a2 } from './shape.js';    // default + named разом
import './polyfills.js';                            // лише побічні ефекти
import config from './config.json' with { type: 'json' }; // import attributes (ES2025)
```

| | Named export | Default export |
|---|---|---|
| Кількість у модулі | скільки завгодно | один |
| Ім'я при імпорті | те саме (або `as`) | будь-яке |
| Рефакторинг, автоімпорт, tree shaking | ✅ зручніше | ⚠️ гірше: ім'я різне в кожному файлі |
| Насправді | зв'язок з ім'ям | зв'язок з ім'ям `default` |

Багато команд забороняють default export правилом лінтера саме через нестабільні імена. Імпорти **спливають** (hoisting): модуль-залежність виконається раніше за будь-який рядок імпортуючого модуля, де б `import` не стояв.

> [!quiz] Перевір себе: оберіть правдиві твердження
> level: middle · type: multi · id: jsd-21-quiz-03
> - [x] `export * from './x.js'` не реекспортує default
> - [ ] У модулі може бути кілька `export default`
> - [x] `import * as ns` дає об'єкт простору імен, у який не можна додати властивість
> - [x] Default export — це експорт під ім'ям `default`
> - [ ] Розташування `import` посеред файлу змінює момент виконання залежності
>
> **Пояснення:** default — звичайний named export з особливим ім'ям, тому `export *` його свідомо пропускає (конфлікт default-ів). Namespace object — екзотичний об'єкт, нерозширюваний, з read-only зв'язками.

### 🔗 Live bindings

Імпорт в ESM — не змінна-копія, а **зв'язок** (binding) на змінну модуля-експортера. Читання завжди повертає поточне значення, а записати в імпорт не можна — `TypeError: Assignment to constant variable`, навіть якщо в джерелі `let`.

```text
   counter.mjs                          main.mjs
   ┌────────────────────┐               ┌─────────────────────┐
   │ let count ─────────┼──── live ────►│ count  (read-only)  │
   │ function inc()     │               │ inc()  ── змінює ───┼──► count у counter.mjs
   └────────────────────┘               └─────────────────────┘

   CommonJS:  const { count } = require('./counter')  →  КОПІЯ значення в момент require
```

> [!viz] module-graph
> scenario: esm-live-binding

```js
// counter.mjs
export let count = 0;
export function inc() { count++; }
export default count;          // ⚠️ default ВИРАЗУ — значення на момент виконання, не live
export { count as liveDefault }; // так default теж був би live

// main.mjs
import frozenDefault, { count, inc } from './counter.mjs';
inc();
console.log(count, frozenDefault); // → 1 0
// count = 5; → TypeError: Assignment to constant variable.
```

Тонкий момент: `export default <вираз>` обчислює вираз один раз і експортує **значення** (прихована змінна `*default*`), тож зміни `count` не відобразяться. А `export default function f() {}` чи `export { x as default }` — справжні зв'язки.

> [!viz] module-graph
> scenario: cjs-vs-esm

> [!quiz] Перевір себе: що виведе код?
> level: senior · type: output · id: jsd-21-quiz-04
>
> ```js
> // store.mjs
> export let state = { n: 0 };
> export const reset = () => { state = { n: 0 }; };
>
> // app.mjs
> import { state, reset } from './store.mjs';
> const saved = state;
> state.n = 5;
> reset();
> console.log(saved.n, state.n, saved === state);
> ```
>
> **Відповідь:** `5 0 false`
>
> **Пояснення:** змінювати **вміст** імпортованого об'єкта можна (`state.n = 5`) — заборонено лише присвоювати сам імпорт. `reset` перепризначає змінну в `store.mjs`, і live binding `state` в `app.mjs` тепер показує новий об'єкт, а `saved` тримає старий.

> [!quiz] Заповни пропуски: лічильник з live binding
> level: junior · type: fill · id: jsd-21-quiz-10 · bank: const, require, 0
>
> ```js fill
> // counter.mjs
> export [[let]] count = 0
> export function inc() { count++ }
>
> // main.mjs
> import { count, inc } [[from]] './counter.mjs'
> inc()
> console.log(count) // → [[1]]
> ```
>
> **Пояснення:** `export let` дає імпортеру живий зв'язок зі змінною, тож після `inc()` він бачить `1`. `const` не дозволив би `count++` у самому модулі, а `require` — це CommonJS, де деструктуризація дала б копію `0`.

### 🕸️ Граф модулів і порядок виконання

Завантаження ESM — три фази, що працюють над усім графом одразу:

1. 🧱 **Construction** — знайти файл за специфікатором (resolution), завантажити, розпарсити, знайти його `import`-и, повторити рекурсивно. Код ще не виконується. У браузері файли тягнуться паралельно.
2. 🔗 **Linking (instantiation)** — для кожного модуля створити оточення і **з'єднати** імпорти з експортами (live bindings). Тут виявляються помилки на кшталт `does not provide an export named …` — до виконання будь-якого рядка. `function`-оголошення вже ініціалізовані, `let/const/class` — у TDZ.
3. ▶️ **Evaluation** — виконати код модулів у порядку **post-order DFS**: спершу залежності (зліва направо за порядком `import`), потім сам модуль. Кожен модуль — рівно один раз.

```text
        main.mjs                     порядок виконання:
        ├── import './a.mjs'           1️⃣ c.mjs   (листок, перший у DFS)
        │     └── import './c.mjs'     2️⃣ a.mjs
        └── import './b.mjs'           3️⃣ b.mjs   (c вже виконаний — не повторюється)
              └── import './c.mjs'     4️⃣ main.mjs
```

> [!quiz] Перевір себе: що виведе `node order1.mjs`?
> level: middle · type: output · id: jsd-21-quiz-05
>
> ```js
> // order1.mjs
> console.log('order1');
> import './order2.mjs';
> import './order3.mjs';
>
> // order2.mjs
> console.log('order2');
> import './order3.mjs';
>
> // order3.mjs
> console.log('order3');
> ```
>
> **Відповідь:** `order3 order2 order1`
>
> **Пояснення:** імпорти спливають, і залежності виконуються раніше за тіло модуля. DFS: `order1` → `order2` → `order3` (виконати), потім `order2`; другий імпорт `order3` уже виконаний; наприкінці тіло `order1`.

### 🔄 Циклічні залежності

Цикл `a → b → a` дозволений в обох системах, але поводиться по-різному.

**ESM.** Коли DFS приходить у `a` вдруге, він не заходить туди знову — `b` виконується першим, і зв'язки на `a` вже **існують, але `let/const` ще в TDZ**. Звернення під час виконання `b` → `ReferenceError`. Але `function`-оголошення з `a` вже ініціалізовані на етапі linking — їх можна викликати. А звернення **пізніше** (у функції, викликаній після завершення завантаження) працює, бо live binding побачить значення.

```js
// a.mjs
import { useA } from './b.mjs';
export function helper() { return 'helper з a'; }
export const value = 'A';
console.log('a:', useA());           // → a: A — на цей момент value вже ініціалізоване

// b.mjs
import { helper, value } from './a.mjs';
console.log('b:', helper());         // → b: helper з a — function-оголошення вже готове
try { value; } catch (e) { console.log('b:', e.constructor.name); } // → b: ReferenceError (TDZ)
export const useA = () => value;     // відкладене читання — безпечне
```

**CommonJS.** `require('./a')` усередині циклу повертає **частково заповнений** `module.exports` — те, що `a` встиг експортувати до виклику `require('./b')`. Жодної помилки, просто «недороблений» об'єкт і `undefined` у неочікуваних місцях.

```js
// a.js
exports.loaded = false;
const b = require('./b.js');
console.log('у a, b.loaded =', b.loaded); // → true
exports.loaded = true;

// b.js
const a = require('./a.js');
console.log('у b, a.loaded =', a.loaded); // → false — частковий exports
exports.loaded = true;
```

Ліки від циклів: винести спільне в третій модуль, відкласти звернення в функцію, інвертувати залежність (передати колбек чи використати подію). Цикли — запах архітектури, їх ловлять `madge` чи `eslint-plugin-import` (`import/no-cycle`).

> [!quiz] Перевір себе: чому в ESM-циклі можна викликати експортовану `function`, але не прочитати `const`?
> level: senior · id: jsd-21-quiz-06
> - [ ] Бо функції експортуються як копії
> - [x] Бо `function`-оголошення ініціалізуються ще на етапі linking, а `const` — лише коли виконується його рядок
> - [ ] Бо `const` взагалі не можна експортувати в циклі
> - [ ] Бо функції виконуються асинхронно
>
> **Пояснення:** це той самий hoisting з [[JavaScript - 04. Scope, hoisting і TDZ]], тільки на рівні модулів: оточення модуля створюється до виконання, функції в ньому вже готові, а `let/const/class` — у TDZ до свого рядка.

### ⚡ Динамічний import(), top-level await і import.meta

**`import(specifier)`** — вираз, який можна викликати будь-де (і в CommonJS теж) і який повертає **проміс namespace-об'єкта**. Основа code splitting і lazy loading:

```js
button.addEventListener('click', async () => {
  const { openEditor } = await import('./editor.js'); // окремий chunk, вантажиться на вимогу
  openEditor();
});
const locale = await import(`./locales/${lang}.js`); // обчислений шлях
```

Бандлер бачить шаблонний рядок і створює chunk для кожного файлу, що підходить під `./locales/*.js`; повністю довільний вираз він не проаналізує.

**Top-level await** (ES2022) — `await` на верхньому рівні **модуля** (не скрипта). Модуль з TLA стає асинхронним: модулі, що **від нього залежать**, чекають на його завершення, а незалежні гілки графа виконуються далі.

```js
// config.mjs
const res = await fetch('/config.json');  // залежні модулі чекають
export const config = await res.json();
```

Обережно: TLA у глибокій залежності гальмує старт усього, що її імпортує, а в Node `require()` такого модуля кидає `ERR_REQUIRE_ASYNC_MODULE`.

**`import.meta`** — метадані поточного модуля від хоста:

- `import.meta.url` — URL модуля (`file:///…` у Node, `https://…` у браузері); `new URL('./img.png', import.meta.url)` — шлях відносно модуля;
- `import.meta.resolve('./x.js')` — розв'язати специфікатор так, як це зробив би `import`;
- Node: `import.meta.dirname` і `import.meta.filename` — заміна `__dirname`/`__filename`, яких в ESM немає;
- Vite: `import.meta.env`, `import.meta.hot`, `import.meta.glob` — розширення бандлера, не стандарт.

> [!quiz] Перевір себе: оберіть правдиві твердження
> level: middle · type: multi · id: jsd-21-quiz-07
> - [x] `import()` працює і в CommonJS-файлі
> - [x] `import()` повертає проміс namespace-об'єкта
> - [ ] Top-level await можна використати в звичайному `<script>` без `type="module"`
> - [x] Модуль, що імпортує модуль з top-level await, не почне виконуватися, доки той не завершиться
> - [ ] `__dirname` доступний у ES-модулях Node
>
> **Пояснення:** TLA дозволений лише в модулях і робить залежних «очікувальниками». В ESM Node немає `__dirname` — є `import.meta.dirname`.

> [!quiz] Склади лінивий завантажувач локалі з fallback
> level: middle · type: order · id: jsd-21-quiz-11
>
> ```js order
> async function loadLocale(lang) {
>   try {
>     const mod = await import(`./locales/${lang}.js`)
>     return mod.default
>   } catch {
>     return (await import('./locales/en.js')).default
>   }
> }
>     const mod = require(`./locales/${lang}.js`) // ✗
> ```
>
> **Пояснення:** `import()` повертає проміс namespace-об'єкта, тож потрібен `await`, а default-експорт лежить у `mod.default`. Бандлер виділить кожну локаль в окремий чанк. `require` з шаблонним рядком — синхронний CommonJS і в ESM недоступний.

### 🤝 CommonJS і ESM у Node

**Як Node вирішує, що файл — ESM:**

| Файл | Модульна система |
|---|---|
| `.mjs` | завжди ESM |
| `.cjs` | завжди CommonJS |
| `.js` | за найближчим `package.json`: `"type": "module"` → ESM, інакше (або `"commonjs"`) → CommonJS |

CommonJS-модуль — це функція-обгортка, яку Node викликає з аргументами `(exports, require, module, __filename, __dirname)`; звідси «глобальні» `require` і `__dirname`. `require` синхронний і кешує результат у `require.cache`.

**Взаємодія:**

- ✅ **ESM імпортує CJS:** `import pkg from './lib.cjs'` — default = `module.exports`. Named-імпорти (`import { fn }`) працюють, якщо Node зміг статично знайти їх у коді (cjs-module-lexer), інакше — помилка.
- ✅ **CJS вантажить ESM:** `await import('./lib.mjs')` — завжди. Синхронний `require('./lib.mjs')` у сучасних версіях Node теж працює й повертає namespace-об'єкт, **якщо** в графі модуля немає top-level await.
- ⚠️ **Dual package hazard:** пакет, що постачає і CJS-, і ESM-збірку, може завантажитись **двічі** (через `require` і через `import`) — два різні екземпляри стану, `instanceof` між ними не працює.

**Поле `exports`** у `package.json` — офіційна «вітрина» пакета: імпортувати можна лише перелічені шляхи (інкапсуляція), а **conditional exports** обирають файл за умовою.

```json
{
  "name": "my-lib",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./utils": "./dist/utils.js"
  },
  "sideEffects": false
}
```

Нюанси ESM у Node: відносні імпорти потребують **розширення** (`./utils.js`, не `./utils`), немає `require`, `module`, `__dirname` (для `require` є `createRequire(import.meta.url)`), JSON — через `with { type: 'json' }`.

> [!quiz] Перевір себе: що виведе `node use.cjs`?
> level: middle · type: output · id: jsd-21-quiz-08
>
> ```js
> // counter.cjs
> let count = 0;
> module.exports = { count, inc() { count++; } };
>
> // use.cjs
> const { count, inc } = require('./counter.cjs');
> inc();
> console.log(count, require('./counter.cjs').count);
> ```
>
> **Відповідь:** `0 0`
>
> **Пояснення:** `module.exports = { count }` скопіював **значення** `0` у властивість об'єкта. `inc` змінює локальну змінну модуля, а не властивість. Повторний `require` повертає закешований той самий об'єкт — з тим самим `0`.

### 🌳 Бандлери, tree shaking і import maps

Браузер уміє ESM нативно, але для продакшну код усе одно **бандлять**: сотні дрібних файлів — це сотні запитів і водоспад залежностей (браузер дізнається про наступний імпорт, лише розпарсивши попередній), а ще потрібні TypeScript/JSX, мініфікація, хешовані імена файлів, оптимізація CSS і картинок.

```text
  src/*.ts, *.tsx, *.css ──► resolve ──► transform ──► граф ──► tree shaking ──► chunks ──► minify ──► dist/
                              (node_modules,  (TS→JS,          (прибрати      (code splitting
                               alias)          JSX)             невикористане)  за import())
```

| Інструмент | Сильна сторона | Де трапляється |
|---|---|---|
| webpack | найгнучкіший: loaders, plugins, Module Federation | великі легасі-проєкти, Next.js (поряд із Turbopack) |
| Rollup | ESM-first, якісний tree shaking, чистий вивід | бібліотеки; історично — продакшн-збірка Vite |
| esbuild | написаний на Go, у десятки разів швидший за JS-бандлери | трансформація TS/JSX, швидкі збірки, тулінг |
| Vite | dev-сервер на нативних ESM без бандлінгу + швидкий HMR | більшість нових SPA; з Vite 8 під капотом Rolldown (Rust) |

**Tree shaking** — видалення невикористаних експортів. Можливий завдяки статичності ESM: бандлер бачить, які імена реально імпортуються. Що йому заважає:

- 🧨 **побічні ефекти** на верхньому рівні модуля (зміна глобалів, поліфіли, реєстрація) — бандлер не наважиться видалити модуль; `"sideEffects": false` у `package.json` чи список файлів з ефектами дає дозвіл;
- 📦 **CommonJS** — `module.exports` динамічний, аналізувати важко;
- 🧱 **виклики на верхньому рівні**: `export const x = createThing()` — без анотації `/*#__PURE__*/` бандлер боїться, що виклик має ефекти;
- 🛢️ **barrel-файли** (`index.js` з `export * from …` на сотні модулів) — уповільнюють збірку і dev-сервер, іноді ламають shaking.

**Import maps** — нативний для браузера спосіб сказати, куди вести «голі» специфікатори (`import 'lodash'`) без бандлера:

```html
<script type="importmap">
  { "imports": { "lodash/": "https://cdn.example.com/lodash-es@4/", "app/": "/src/" } }
</script>
<script type="module">
  import debounce from 'lodash/debounce.js';
  import { start } from 'app/main.js';
</script>
```

> [!quiz] Перевір себе: що може завадити tree shaking?
> level: senior · type: multi · id: jsd-21-quiz-09
> - [x] Модуль змінює `window` на верхньому рівні, а `sideEffects` не вказано
> - [x] Бібліотека постачається лише в CommonJS
> - [ ] Використання named exports замість default
> - [x] `export const api = createApi()` без анотації `/*#__PURE__*/`
> - [ ] Використання `import()` для lazy loading
>
> **Пояснення:** бандлер видаляє код лише тоді, коли певен, що це безпечно. Побічні ефекти й динамічна природа CommonJS позбавляють його цієї впевненості. Named exports якраз допомагають, а `import()` — інструмент code splitting.

## ⚠️ Пастки

> [!pitfall] Забуте розширення в ESM у Node
> `import { x } from './utils'` у Node ESM → `ERR_MODULE_NOT_FOUND`: Node не дописує `.js` автоматично, як `require` чи бандлер. Пиши повний шлях `'./utils.js'` (навіть у TypeScript з `moduleResolution: "nodenext"`).

> [!pitfall] `export default` виразу — не live
> `export default count` фіксує значення в момент виконання. Код, що чекає оновлень, бачитиме старе значення. Експортуй іменовано або через `export { count as default }`.

> [!pitfall] Top-level await у бібліотеці
> TLA у модулі пакета змушує чекати всіх, хто його імпортує, і ламає `require(esm)` у CommonJS-споживачів (`ERR_REQUIRE_ASYNC_MODULE`). У бібліотеках віддавай async-функцію ініціалізації замість TLA.

> [!pitfall] Модулі в браузері з `file://`
> `<script type="module">` вантажиться з урахуванням CORS, тож відкрита з диска сторінка не завантажить модулі. Потрібен локальний сервер (`npx serve`, `vite`). А ще модульні скрипти за замовчуванням поводяться як `defer`.

## 🎤 На співбесіді

> [!interview] Чим ES-модулі відрізняються від CommonJS?
> level: middle · frequency: дуже часто · id: jsd-21-int-01
>
> ---
>
> ESM — стандарт мови зі **статичною** структурою: `import/export` лише на верхньому рівні, тож граф відомий до виконання (tree shaking, рання помилка відсутнього експорту). Імпорти — **live bindings**, read-only; модуль завжди в strict mode, `this` — `undefined`, завантаження може бути асинхронним, є top-level await і `import.meta`. CommonJS — runtime-система Node: `require` — синхронна функція, яку можна викликати будь-де; `module.exports` — звичайний об'єкт, імпорт копіює значення; є `__dirname`. У циклах ESM дає `ReferenceError` (TDZ), а CJS — частково заповнений `exports`. У Node взаємодія: ESM імпортує CJS як default, CJS вантажить ESM через `import()` або `require(esm)` без TLA.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери#🤝 CommonJS і ESM у Node|Розділ: CJS і ESM]] · [Node.js: ECMAScript modules](https://nodejs.org/api/esm.html) · [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

> [!interview] Що таке tree shaking і чому він працює лише з ESM?
> level: middle · frequency: часто · id: jsd-21-int-02
>
> ---
>
> Видалення з бандла коду, який ніхто не імпортує (dead code elimination на рівні модулів). Працює, бо ESM статичні: бандлер ще до виконання бачить, які імена куди імпортуються, і може позначити невикористані експорти. CommonJS динамічний — `require` з обчисленим шляхом і мутований `module.exports` не дають гарантій. Заважають побічні ефекти на верхньому рівні (вирішується `"sideEffects": false` і `/*#__PURE__*/`), barrel-файли та бібліотеки лише в CJS.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери#🌳 Бандлери, tree shaking і import maps|Розділ: tree shaking]] · [webpack: Tree Shaking](https://webpack.js.org/guides/tree-shaking/) · [MDN: Tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)

> [!interview] Як ESM завантажує граф модулів і що відбувається з циклічними залежностями?
> level: senior · frequency: іноді · id: jsd-21-int-03
>
> ---
>
> Три фази: construction (resolve, fetch, parse усіх модулів — без виконання), linking (створення оточень і з'єднання імпортів з експортами; тут ловляться неіснуючі імпорти, `function`-оголошення вже ініціалізовані) і evaluation — post-order DFS, кожен модуль рівно раз. У циклі модуль, до якого DFS повернувся, ще не виконаний: його `let/const/class` у TDZ, тож звернення до них під час виконання сусіда — `ReferenceError`, а виклик його функцій-оголошень чи відкладене читання — працюють. Модулі з TLA роблять evaluation асинхронним для залежних.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери#🕸️ Граф модулів і порядок виконання|Розділ: граф модулів]] · [Lin Clark: ES modules — a cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/) · [Spec: Cyclic Module Records](https://tc39.es/ecma262/#sec-cyclic-module-records)

## 🔗 Зв'язки

- [[JavaScript - 04. Scope, hoisting і TDZ]] — TDZ і hoisting функцій пояснюють поведінку циклічних імпортів.
- [[JavaScript - 05. Замикання]] — module pattern на IIFE як попередник ES-модулів.
- [[JavaScript - 10. async і await]] — top-level await і динамічний `import()` — це проміси.
- [[JavaScript - 15. Функції глибоко]] — IIFE і чому вона стала рідкістю в модульному коді.
- [[JavaScript - 31. Продуктивність і V8]] — code splitting, розмір бандла і швидкість старту.
- [[JavaScript - 34. Сучасний JS і TC39]] — import attributes, source phase imports та інші нові пропозиції для модулів.

## ⚡ Фішки

> [!reel] 🪟 Імпорт — це вікно, а не фото
> В ESM `import { count }` бачить живу змінну модуля — зміни всередині одразу видно. У CommonJS `const { count } = require()` — копія на момент виклику.

> [!reel] 🧭 Модулі виконуються знизу вгору
> Імпорти спливають, і залежності виконуються раніше за тіло модуля — post-order DFS. Тому `console.log` у кореневому модулі завжди останній, навіть якщо стоїть першим рядком.

> [!reel] 🎯 export default x — не живий
> `export default count` експортує значення на момент виконання. `export { count as default }` — живий зв'язок. Дрібниця, на якій валяться співбесіди рівня senior.

> [!reel] 🗺️ Import maps — npm-імена без бандлера
> `<script type="importmap">` каже браузеру, що `import 'lodash/...'` означає URL на CDN. Нативно, без збірки — для прототипів і простих сайтів.

> [!reel] ⚡ Vite не бандлить у dev-режимі
> Dev-сервер віддає браузеру нативні ES-модулі по одному й трансформує лише запитаний файл. Тому старт миттєвий незалежно від розміру проєкту, а бандлинг — тільки для продакшну.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чим named export відрізняється від default export?
> *дуже часто · порівняння* · `jsd-21-001`
>
> Named — скільки завгодно, імпортуються під своїм ім'ям у фігурних дужках (`import { a }`), можна перейменувати через `as`. Default — один на модуль, імпортується без дужок під будь-яким ім'ям. Насправді default — це named export з ім'ям `default`.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери#📦 import і export — усі форми|Розділ: import і export]] · [MDN: export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)

> [!question]- Скільки разів виконається модуль, який імпортують 10 інших модулів?
> *часто · теорія* · `jsd-21-002`
>
> Один. Модуль виконується при першому завантаженні, а далі всі імпортери отримують зв'язки на той самий екземпляр — модуль працює як singleton. Те саме в CommonJS завдяки `require.cache`.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери#🕸️ Граф модулів і порядок виконання|Розділ: граф модулів]] · [javascript.info: Modules, introduction](https://javascript.info/modules-intro)

> [!question]- Навіщо динамічний `import()`?
> *часто · практика* · `jsd-21-003`
>
> Для завантаження модуля на вимогу: lazy loading сторінок і важких компонентів, code splitting, умовне чи обчислене завантаження (локалі, плагіни), підключення ESM з CommonJS. Повертає проміс namespace-об'єкта.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери#⚡ Динамічний import(), top-level await і import.meta|Розділ: import()]] · [MDN: import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)

### 🟡 Middle

> [!question]- Що таке live binding?
> *часто · теорія* · `jsd-21-004`
>
> Імпорт в ESM — посилання на змінну модуля-експортера, а не копія. Читання завжди дає поточне значення, а присвоєння імпорту — `TypeError`. Змінювати значення може лише сам модуль-власник (наприклад, через експортовану функцію).
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери#🔗 Live bindings|Розділ: live bindings]] · [javascript.info: Export and Import](https://javascript.info/import-export)

> [!question]- Як Node визначає, чи `.js`-файл — ES-модуль?
> *часто · теорія* · `jsd-21-005`
>
> За полем `"type"` найближчого `package.json`: `"module"` → ESM, `"commonjs"` або відсутність поля → CommonJS. Розширення `.mjs` і `.cjs` перекривають це правило.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери#🤝 CommonJS і ESM у Node|Розділ: Node]] · [Node.js: Packages](https://nodejs.org/api/packages.html)

> [!question]- Що робить top-level await з графом модулів?
> *іноді · теорія* · `jsd-21-006`
>
> Робить модуль асинхронним: модулі, що його імпортують (прямо чи транзитивно), не почнуть виконання, доки проміс не осяде; незалежні гілки графа йдуть далі. Ризики — повільний старт і `ERR_REQUIRE_ASYNC_MODULE` при `require` з CommonJS.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери#⚡ Динамічний import(), top-level await і import.meta|Розділ: top-level await]] · [V8: Top-level await](https://v8.dev/features/top-level-await)

> [!question]- Навіщо поле `exports` у `package.json`?
> *іноді · практика* · `jsd-21-007`
>
> Задає публічну «вітрину» пакета: імпортувати можна лише перелічені шляхи (інкапсуляція внутрішніх файлів), а conditional exports обирають файл за умовою — `import`/`require`, `types`, `node`/`browser`, `development`/`production`. Має пріоритет над `main`.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери#🤝 CommonJS і ESM у Node|Розділ: exports]] · [Node.js: Conditional exports](https://nodejs.org/api/packages.html#conditional-exports)

### 🔴 Senior

> [!question]- Як поводиться циклічна залежність у CommonJS?
> *іноді · код* · `jsd-21-008`
>
> `require` модуля, що вже завантажується, повертає його поточний **частково заповнений** `module.exports` — без помилки. Тому в циклі можна отримати `undefined` для властивостей, які ще не встигли експортувати. В ESM натомість — `ReferenceError` (TDZ) для `let/const`.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери#🔄 Циклічні залежності|Розділ: цикли]] · [Node.js: Modules — cycles](https://nodejs.org/api/modules.html)

> [!question]- Що таке dual package hazard?
> *рідко · теорія* · `jsd-21-009`
>
> Пакет постачає окремі CJS- і ESM-збірки; якщо застосунок підключає його і через `require`, і через `import`, завантажуються **два** екземпляри: два окремі стани, синглтони, кеші, а `instanceof` між класами з різних копій хибить. Рішення: одна збірка (ESM + `require(esm)`), або CJS-обгортка над ESM, або стан в окремому спільному модулі.
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери#🤝 CommonJS і ESM у Node|Розділ: interop]] · [Node.js: Packages](https://nodejs.org/api/packages.html)

## 🛠️ Практика

> [!task] Переведи модуль з CommonJS на ESM
> level: junior · difficulty: easy · id: jsd-21-task-01 · tags: modules, esm, commonjs
>
> Перепиши модуль на ESM для Node з `"type": "module"`. Збережи поведінку: читання файлу поруч із модулем і публічний API.
>
> ```js
> // greet.js (CommonJS)
> const fs = require('node:fs');
> const path = require('node:path');
> const template = fs.readFileSync(path.join(__dirname, 'greet.txt'), 'utf8');
> function greet(name) { return template.replace('{name}', name); }
> module.exports = { greet };
> ```
>
> ```js starter
> // greet.js — перепиши на ESM
> const fs = require('node:fs');
> const path = require('node:path');
> const template = fs.readFileSync(path.join(__dirname, 'greet.txt'), 'utf8');
> function greet(name) { return template.replace('{name}', name); }
> module.exports = { greet };
> ```
>
> > [!hint]- Підказка 1
> > `require` → `import`, `module.exports` → `export`. А чим замінити `__dirname`?
>
> > [!hint]- Підказка 2
> > `import.meta.dirname` у сучасному Node, або універсально — `new URL('./greet.txt', import.meta.url)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > // greet.js (ESM)
> > import { readFileSync } from 'node:fs';
> > const template = readFileSync(new URL('./greet.txt', import.meta.url), 'utf8');
> > export function greet(name) {
> >   return template.replace('{name}', name);
> > }
> > ```
> >
> > `fs` приймає `URL` напряму, тож `path` не потрібен. Споживачі тепер пишуть `import { greet } from './greet.js'` — з розширенням. Якщо модуль досі потрібен CommonJS-коду, сучасний Node дозволить `require('./greet.js')` (у ньому немає top-level await).

> [!task] Поясни своїми словами: live binding проти копії
> level: middle · difficulty: medium · id: jsd-21-task-02 · tags: feynman, modules
>
> Поясни колезі, чому той самий лічильник в ESM-версії «оновлюється» в імпортері, а в CommonJS з деструктуризацією — ні. Обов'язково поясни, чому в ESM не можна присвоїти імпорт. До 6 речень.
>
> > [!hint]- Підказка 1
> > Що саме передає `export` — значення чи доступ до змінної?
>
> > [!hint]- Підказка 2
> > Хто «власник» змінної і хто має право її змінювати?
>
> > [!solution]- Еталонне пояснення
> > В ES-модулі `export let count` виставляє назовні не число, а **доступ до самої змінної** — імпортер отримує вікно, крізь яке видно її поточне значення. Коли модуль-власник робить `count++`, усі, хто дивиться у вікно, бачать нове значення — це live binding. Вікно лише для читання: змінювати змінну може тільки модуль, якому вона належить, інакше будь-який імпортер міг би непомітно зламати стан іншого модуля, тому `count = 5` в імпортері дає `TypeError`. У CommonJS `module.exports = { count }` кладе в об'єкт **копію поточного значення**, а деструктуризація `const { count } = require(...)` копіює його ще раз у локальну змінну. Тож подальші зміни всередині модуля туди не потрапляють — це фотографія, а не вікно.

> [!task] Мінімальний завантажувач модулів у стилі CommonJS
> level: senior · difficulty: hard · id: jsd-21-task-03 · tags: modules, commonjs, closures
>
> Напиши `createRequire(files)`, де `files` — об'єкт «шлях → вихідний код». Повернений `require(path)` має: обгортати код у функцію `(exports, require, module)`, виконувати модуль один раз і кешувати `module.exports`, а при циклічних залежностях повертати частково заповнений `exports`, як Node.
>
> ```js
> const req = createRequire({
>   'a': "exports.name = 'a'; const b = require('b'); exports.fromB = b.name;",
>   'b': "const a = require('a'); exports.name = 'b'; exports.sawA = a.name;",
> });
> console.log(req('a')); // → { name: 'a', fromB: 'b' }
> console.log(req('b')); // → { name: 'b', sawA: 'a' } — b бачив частковий exports модуля a
> ```
>
> ```js starter
> function createRequire(files) {
>   const cache = new Map()
>   function require(path) {
>     // твій код
>   }
>   return require
> }
> ```
>
> ```js tests
> test('приклад з циклічною залежністю', () => {
>   const req = createRequire({
>     a: "exports.name = 'a'; const b = require('b'); exports.fromB = b.name;",
>     b: "const a = require('a'); exports.name = 'b'; exports.sawA = a.name;",
>   })
>   expect(req('a')).toEqual({ name: 'a', fromB: 'b' })
>   expect(req('b')).toEqual({ name: 'b', sawA: 'a' })
> })
>
> test('модуль виконується один раз і кешується', () => {
>   const req = createRequire({ m: 'exports.obj = {}' })
>   expect(req('m')).toBe(req('m'))
>   expect(req('m').obj).toBe(req('m').obj)
> })
>
> test('module.exports можна замінити цілком', () => {
>   const req = createRequire({ f: 'module.exports = (x) => x * 2' })
>   expect(req('f')(21)).toBe(42)
> })
>
> test('this на верхньому рівні — module.exports', () => {
>   const req = createRequire({ t: 'this.viaThis = true' })
>   expect(req('t')).toEqual({ viaThis: true })
> })
>
> test('невідомий шлях — помилка Cannot find module', () => {
>   const req = createRequire({})
>   expect(() => req('nope')).toThrow("Cannot find module 'nope'")
> })
> ```
>
> > [!hint]- Підказка 1
> > `new Function('exports', 'require', 'module', code)` перетворює рядок на функцію з потрібними параметрами (для навчання; у продакшні — `vm`).
>
> > [!hint]- Підказка 2
> > Клади модуль у кеш **до** виконання його коду — саме це робить цикли можливими.
>
> > [!hint]- Підказка 3
> > Повертай `module.exports`, а не `exports`: модуль може замінити об'єкт цілком.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createRequire(files) {
> >   const cache = new Map();
> >   function require(path) {
> >     if (cache.has(path)) return cache.get(path).exports; // цикл або повторний виклик
> >     if (!(path in files)) throw new Error(`Cannot find module '${path}'`);
> >     const module = { exports: {} };
> >     cache.set(path, module); // ДО виконання — інакше цикл стане нескінченною рекурсією
> >     const wrapper = new Function('exports', 'require', 'module', files[path]);
> >     wrapper.call(module.exports, module.exports, require, module);
> >     return module.exports;
> >   }
> >   return require;
> > }
> > ```
> >
> > Саме так влаштований Node (спрощено): обгортка-функція дає модулю приватний scope і «глобальні» `exports`/`require`/`module`, кеш робить модуль синглтоном, а запис у кеш до виконання повертає частково заповнений `exports` у циклі. `this` на верхньому рівні CommonJS-модуля дорівнює `module.exports` — тому `wrapper.call(module.exports, …)`.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Modules, introduction](https://javascript.info/modules-intro) — що таке модуль, strict mode, singleton і модулі в браузері.
- 🟢 [MDN — JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — усі форми `import`/`export`, динамічний імпорт, import maps.
- 🟡 [Lin Clark — ES modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/) — найкраще пояснення трьох фаз завантаження і live bindings.
- 🟡 [Node.js — ECMAScript modules](https://nodejs.org/api/esm.html) — ESM у Node: `import.meta`, взаємодія з CommonJS, розширення.
- 🟡 [Node.js — Packages](https://nodejs.org/api/packages.html) — `type`, `exports`, conditional exports і dual package hazard.
- 🟡 [V8 — Top-level await](https://v8.dev/features/top-level-await) — як TLA впливає на порядок виконання графа.
- 🛠️ [webpack — Tree Shaking](https://webpack.js.org/guides/tree-shaking/) — `sideEffects`, `/*#__PURE__*/` і що заважає видаляти код.
- 🛠️ [Vite — Why Vite](https://vite.dev/guide/why.html) — навіщо нативні ESM у dev-режимі й бандлинг у продакшні.
- 🔴 [ECMAScript — Modules](https://tc39.es/ecma262/#sec-modules) — першоджерело: module records, linking, evaluation.

> [!important] Підсумок
> - ESM — статичні (`import/export` лише на верхньому рівні), завжди strict, виконуються один раз; CommonJS — runtime `require` з копіюванням значень.
> - Імпорти ESM — read-only live bindings; `export default <вираз>` — виняток, він експортує значення.
> - Граф проходить construction → linking → evaluation (post-order DFS); у циклах `let/const` у TDZ, а CommonJS повертає частковий `exports`.
> - `import()` — lazy loading і code splitting; top-level await блокує залежні модулі; `import.meta` дає URL і `dirname`.
> - У Node тип файлу визначають `.mjs/.cjs` і `"type"`, публічний API — поле `exports`; бандлери (Vite, esbuild, Rollup, webpack) збирають граф, роблять tree shaking (заважають побічні ефекти й CJS) і code splitting.
