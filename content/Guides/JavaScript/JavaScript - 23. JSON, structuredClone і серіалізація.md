---
title: JSON, structuredClone і серіалізація
order: 23
level: middle
tags: [json, serialization, structured-clone, deep-copy, security]
prerequisites:
  - "[[JavaScript - 02. Типи та приведення типів]]"
  - "[[JavaScript - 03. Значення та посилання]]"
  - "[[JavaScript - 22. Помилки та їх обробка]]"
estimatedMinutes: 45
id: jsd-ch-23
icon: "🧾"
---

# JSON, structuredClone і серіалізація

> [!success] 🎯 Після цього розділу ти зможеш
> - відрізнити граматику JSON від JS-літерала й передбачити, на чому впаде `JSON.parse`;
> - точно сказати, що `JSON.stringify` робить з `undefined`, функціями, `NaN`, `Date`, `BigInt`, `Map` і циклами;
> - використати `replacer`, `toJSON` і `reviver`, щоб зберегти дати, `Map` чи великі числа;
> - пояснити, що копіює `structuredClone`, а що — ні, і вибрати спосіб глибокої копії під задачу;
> - безпечно парсити ненадійні дані й не відкрити двері prototype pollution.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-23-quiz-01
>
> ```js
> const data = {
>   a: undefined,
>   b: () => 1,
>   c: NaN,
>   d: new Date(0),
>   e: [undefined, () => 1],
>   [Symbol('s')]: 1,
> };
> console.log(JSON.stringify(data));
> ```
>
> **Відповідь:** `{"c":null,"d":"1970-01-01T00:00:00.000Z","e":[null,null]}`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. У властивостях об'єкта `undefined`, функції й символи **зникають**, у масиві — стають `null` (щоб не зсунути індекси). `NaN` → `null`, `Date` серіалізується власним `toJSON()` в ISO-рядок.

## 🧒 Простими словами

JSON — це посилка міжнародною поштою з суворим митним списком: дозволені лише рядки, числа, `true/false`, `null`, коробки (об'єкти) і ряди (масиви). Функції, символи й `undefined` митник **мовчки викидає**, `NaN` і `Infinity` замінює на «нічого» (`null`), а `BigInt` бачить як заборонений товар і **розвертає всю посилку** (помилка). Дату він перепаковує в папірець-рядок — і назад вона приходить папірцем, а не датою. `structuredClone` — це вже приватний кур'єр: везе й дати, і `Map`, і навіть коробку, що лежить сама в собі, але функцію чи живу DOM-ноду не візьме. А глибока копія — це ксерокопія всієї папки, а не ще один ключ від тієї самої шафи.

## 🔬 Як це працює насправді

### 📜 JSON — не те саме, що JS-літерал

JSON (RFC 8259, ECMA-404) — **текстовий формат** з дуже вузькою граматикою. Схожий на JS-об'єкт, але суворіший:

| | JS-літерал | JSON |
|---|---|---|
| Ключі | `{ a: 1 }`, `{ 'a': 1 }` | лише `{ "a": 1 }` |
| Рядки | `'…'`, `"…"`, `` `…` `` | лише `"…"`, табуляція й переноси — тільки екрановані |
| Кома в кінці | `[1, 2,]` | ❌ |
| Коментарі | `// …` | ❌ |
| Значення | `undefined`, `NaN`, `Infinity`, `0x1F`, `.5`, `+1` | ❌ — лише `null`, `true`, `false`, числа на кшталт `-1.5e3` |
| `"__proto__"` | змінює прототип | звичайна власна властивість |

```js
JSON.parse('{"a":1,"a":2}');           // → { a: 2 } — дублікат: перемагає останній
JSON.parse("{'a':1}");                 // SyntaxError
JSON.parse('[1, 2,]');                 // SyntaxError
JSON.parse(null);                      // → null (бо String(null) === 'null')
JSON.parse(undefined);                 // SyntaxError — 'undefined' не JSON
```

Цікавий факт: до ES2019 JSON **не був** підмножиною JS — символи `U+2028`/`U+2029` були дозволені в JSON-рядках, але ламали JS-рядки. Пропозиція *JSON superset* це виправила.

> [!quiz] Перевір себе: валідний JSON?
> level: junior · type: multi · id: jsd-23-quiz-02
>
> Які рядки `JSON.parse` прийме без помилки?
>
> - [x] `'{"a": [1, 2.5e3, null]}'`
> - [ ] `'{a: 1}'`
> - [x] `'"just a string"'`
> - [ ] `'[1, 2, 3,]'`
> - [ ] `'{"n": NaN}'`
> - [x] `'  true  '`
>
> **Пояснення:** верхнім рівнем JSON може бути будь-яке значення (рядок, `true`), пробіли навколо дозволені. Ключі без лапок, кінцева кома й `NaN` — синтаксис JS, але не JSON.

### 📤 JSON.stringify — що потрапляє, а що зникає

Алгоритм для кожного значення: якщо є метод `toJSON` — викликати його; потім `replacer` (якщо передали); потім — за типом:

| Значення | У властивості об'єкта | У масиві | На верхньому рівні |
|---|---|---|---|
| `undefined`, функція, `Symbol` | ключ **зникає** | `null` | `undefined` (не рядок!) |
| `NaN`, `±Infinity` | `null` | `null` | `"null"` |
| `-0` | `0` | `0` | `"0"` |
| `Date` | ISO-рядок (через `toJSON`) | ISO-рядок | ISO-рядок |
| `Map`, `Set`, `Error`, `RegExp` | `{}` | `{}` | `"{}"` |
| `new Number(5)`, `new String('x')` | розпаковується: `5`, `"x"` | | |
| `BigInt` | **`TypeError`** | | |
| Цикл | **`TypeError: Converting circular structure to JSON`** | | |

Ще правила: беруться лише **власні перелічувані** рядкові ключі (символьні ключі, неперелічувані й успадковані — ігноруються), а порядок ключів — як у `Object.keys`: спершу цілочисельні за зростанням, потім решта в порядку додавання.

```js
console.log(JSON.stringify({ b: 1, 2: 'two', a: 2, 1: 'one' }));
// → {"1":"one","2":"two","b":1,"a":2}
console.log(JSON.stringify({ m: new Map([[1, 2]]), err: new Error('x'), n: -0 }));
// → {"m":{},"err":{},"n":0}
```

> [!quiz] Перевір себе: верхній рівень
> level: middle · id: jsd-23-quiz-03
>
> Що поверне `JSON.stringify(undefined)`?
>
> - [ ] `"undefined"`
> - [ ] `"null"`
> - [x] `undefined` — не рядок узагалі
> - [ ] `TypeError`
>
> **Пояснення:** для «несеріалізовних» значень на верхньому рівні результат — `undefined`. Тому `localStorage.setItem('k', JSON.stringify(undefined))` збереже рядок `"undefined"`, а `JSON.parse` потім на ньому впаде.

### 🎛️ replacer, space і toJSON

**`replacer`-функція** `(key, value)` викликається для кожної пари, починаючи з обгортки `{ "": value }` (ключ `''`); `this` — об'єкт-власник. Повернув `undefined` — ключ зникне. **`replacer`-масив** — білий список ключів (діє на всіх рівнях вкладеності).

```js
const out = JSON.stringify(
  { id: 10n, tags: new Set(['x']) },
  (key, value) =>
    typeof value === 'bigint' ? value.toString()
    : value instanceof Set ? [...value]
    : value,
);
console.log(out); // → {"id":"10","tags":["x"]}

console.log(JSON.stringify({ a: 1, b: { a: 2, c: 3 }, c: 4 }, ['a', 'b']));
// → {"a":1,"b":{"a":2}}
```

**`space`** — відступ: число (до 10 пробілів) або рядок (до 10 символів). `JSON.stringify(obj, null, 2)` — класика для логів і конфігів.

**`toJSON(key)`** — «я сам скажу, як мене серіалізувати». Його має `Date`; свій можна додати будь-якому класу:

```js
class Money {
  constructor(amount, currency) { this.amount = amount; this.currency = currency; }
  toJSON() { return `${this.amount} ${this.currency}`; }
}
console.log(JSON.stringify({ price: new Money(100, 'UAH') }));
// → {"price":"100 UAH"}
```

Підступ: `toJSON` викликається **до** `replacer`. Тому в `replacer` для дати `value` — уже рядок; оригінальний `Date` видно лише як `this[key]`.

> [!quiz] Перевір себе: що побачить replacer?
> level: senior · id: jsd-23-quiz-04
>
> ```js
> JSON.stringify({ at: new Date(0) }, (key, value) => {
>   if (key === 'at') console.log(typeof value);
>   return value;
> });
> ```
>
> - [ ] `object`
> - [x] `string`
> - [ ] `number`
>
> **Пояснення:** `Date.prototype.toJSON` спрацьовує до `replacer`, тож той отримує вже ISO-рядок. Оригінал — у `this.at`.

> [!quiz] Заповни пропуски: replacer для `BigInt` і `Set`
> level: middle · type: fill · id: jsd-23-quiz-09 · bank: number, Map, null
>
> ```js fill
> const out = JSON.stringify(data, (key, value) => {
>   if (typeof value === '[[bigint]]') return value.[[toString]]()
>   if (value instanceof [[Set]]) return [...value]
>   return [[value]]
> })
> ```
>
> **Пояснення:** `JSON.stringify` кидає `TypeError` на `BigInt`, а `Set` серіалізує як `{}` — replacer перетворює їх на рядок і масив. Усе інше треба повернути без змін: якщо повернути `undefined`, ключ зникне.

### 📥 JSON.parse і reviver

`reviver(key, value)` проходить дерево **знизу вгору**: спершу листки, потім батьки, наприкінці корінь із ключем `''`. Повернув `undefined` — властивість видаляється. Головне застосування — відновити типи, які JSON не вміє:

```js
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
const text = JSON.stringify({ at: new Date(0) });
const back = JSON.parse(text, (key, value) =>
  typeof value === 'string' && ISO.test(value) ? new Date(value) : value,
);
console.log(back.at instanceof Date); // → true
```

**Великі числа.** Число в JSON парситься в `Number` (double), тож усе, що більше за `2^53 − 1`, тихо втрачає точність. Тому API (X/Twitter, Discord) віддають id ще й рядком. ES2026 додав *JSON.parse source text access*: третій аргумент reviver-а `context.source` — оригінальний текст числа, а `JSON.rawJSON` дозволяє записати число «як є».

```js
console.log(JSON.parse('{"id": 9007199254740993}').id);
// → 9007199254740992 😬

const exact = JSON.parse('{"id": 9007199254740993}', (key, value, ctx) =>
  key === 'id' ? BigInt(ctx.source) : value,
);
console.log(exact.id); // → 9007199254740993n
console.log(JSON.stringify({ id: JSON.rawJSON('9007199254740993') }));
// → {"id":9007199254740993}
```

> [!quiz] Перевір себе: порядок обходу
> level: senior · type: output · id: jsd-23-quiz-05
>
> ```js
> JSON.parse('{"a":{"b":1},"c":2}', (key, value) => {
>   console.log(key || '(root)');
>   return value;
> });
> ```
>
> **Відповідь:** `b a c (root)`
>
> **Пояснення:** reviver обходить дерево в глибину й викликається **після** дітей: `b` всередині `a`, потім сам `a`, потім `c`, останнім — корінь з ключем `''`.

> [!quiz] Склади парсинг, що відновлює дати
> level: middle · type: order · id: jsd-23-quiz-10
>
> ```js order
> function parseWithDates(text) {
>   const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/
>   return JSON.parse(text, (key, value) => {
>     if (typeof value === 'string' && ISO.test(value)) {
>       return new Date(value)
>     }
>     return value
>   })
> }
>     return undefined // ✗
> ```
>
> **Пояснення:** reviver бачить кожне значення після його дітей і може підмінити його. Усе, що не схоже на ISO-дату, повертаємо як є: `undefined` з reviver-а **видаляє** властивість.

### 🧬 structuredClone і structured clone algorithm

`structuredClone(value, { transfer })` — глобальна функція (браузери, Node 17+, Deno) на основі того самого **structured clone algorithm**, яким користуються `postMessage`, IndexedDB, `history.pushState` і `BroadcastChannel`. Вона копіює **граф** об'єктів, а не дерево: спільні посилання й цикли зберігаються.

> [!viz] memory-refs
> scenario: shallow-vs-deep

```js
const shared = { x: 1 };
const src = { d: new Date(0), m: new Map([['k', shared]]), list: [shared, shared], big: 1n };
src.self = src;
const c = structuredClone(src);
console.log(c.d instanceof Date, c.list[0] === c.list[1], c.self === c, c.m.get('k') === c.list[0]);
// → true true true true
```

| ✅ Копіюється | ❌ Не копіюється / втрачається |
|---|---|
| примітиви (крім `Symbol`), `BigInt`, `NaN`, `undefined` | функції → `DataCloneError` |
| звичайні об'єкти й масиви, цикли | `Symbol`, `WeakMap`, `WeakSet`, `Promise`, `Proxy` → `DataCloneError` |
| `Date`, `RegExp` (без `lastIndex`), `Map`, `Set` | DOM-ноди → `DataCloneError` |
| `ArrayBuffer`, typed arrays, `DataView`, `Blob`, `File`, `ImageData` | прототип класу → стає звичайним `Object` |
| `Error` (`name`, `message`, `cause`, `stack`) | геттери — копіюється обчислене значення; дескриптори, `freeze` |
| обгортки `new Number(3)` | неперелічувані й символьні ключі |

```js
class Point { constructor(x) { this.x = x; } len() { return this.x; } }
const p = structuredClone(new Point(2));
console.log(p instanceof Point, typeof p.len); // → false undefined
```

**`transfer`** не копіює, а **переносить** буфер: оригінал стає «від'єднаним» (`byteLength === 0`). Так передають мегабайти у Worker без копіювання — див. [[JavaScript - 29. Workers і паралельність]].

```js
const buf = new ArrayBuffer(8);
const moved = structuredClone(buf, { transfer: [buf] });
console.log(buf.byteLength, moved.byteLength); // → 0 8
```

> [!quiz] Перевір себе: що кине DataCloneError?
> level: middle · type: multi · id: jsd-23-quiz-06
>
> - [x] `structuredClone({ onClick() {} })`
> - [ ] `structuredClone(new Map([[1, new Set([2])]]))`
> - [x] `structuredClone(Promise.resolve(1))`
> - [ ] `structuredClone({ a: 1n, b: undefined })`
> - [x] `structuredClone(Symbol('id'))`
>
> **Пояснення:** функції, проміси й символи не мають сенсу «за межами» поточного realm — їх не скопіювати. `Map`, `Set`, `BigInt` і `undefined` алгоритм підтримує.

### 🪞 Глибока копія — порівняння підходів

| Спосіб | Вкладені об'єкти | `Date` / `Map` / `Set` | Цикли | `undefined`, `NaN` | Прототип класу | Функції |
|---|---|---|---|---|---|---|
| `{ ...obj }`, `Object.assign` | ❌ поверхнева | посилання | — | ✅ | ❌ | посилання |
| `JSON.parse(JSON.stringify(x))` | ✅ | ❌ рядок / `{}` | 💥 `TypeError` | ❌ зникає / `null` | ❌ | ❌ зникають |
| `structuredClone(x)` | ✅ | ✅ | ✅ | ✅ | ❌ | 💥 `DataCloneError` |
| власна рекурсія / `lodash.cloneDeep` | ✅ | ✅ (якщо врахувати) | ✅ з `WeakMap` | ✅ | ✅ можна | посилання |

Правило вибору: **дані** (стан, відповідь API) → `structuredClone`. **Об'єкти з поведінкою** (екземпляри класів) → явний метод `clone()` або фабрика. **JSON round-trip** — лише коли тобі однаково потрібен JSON (наприклад, перевірити, що дані серіалізовні). Часто глибока копія взагалі не потрібна: незмінні оновлення (`{ ...state, user: { ...state.user, name } }`) копіюють лише змінений шлях — див. [[JavaScript - 03. Значення та посилання]].

> [!quiz] Перевір себе: обери спосіб
> level: middle · id: jsd-23-quiz-07
>
> Треба скопіювати стан редактора `{ doc: {...}, selection: new Set(), savedAt: new Date(), parent: <посилання на себе> }`, щоб зберегти «знімок» для undo. Що підходить найкраще?
>
> - [ ] `{ ...state }`
> - [ ] `JSON.parse(JSON.stringify(state))`
> - [x] `structuredClone(state)`
>
> **Пояснення:** spread копіює лише верхній рівень; JSON упаде на циклі, а `Set` і `Date` зіпсує. `structuredClone` зберігає цикли, `Set` і `Date`.

### 📮 Серіалізація на межах і безпечний парсинг

Кожна межа має свій формат:

```text
🧠 об'єкт у пам'яті
 ├─ fetch body / WebSocket / localStorage ──▶ рядок      → JSON.stringify / JSON.parse
 ├─ postMessage / Worker / IndexedDB      ──▶ structured clone (Date, Map, Blob — ок)
 └─ <script> в HTML                        ──▶ JSON + екранування `<` (інакше XSS)
```

**Ненадійний JSON** (тіло запиту, `localStorage`, `postMessage` з іншого вікна): `JSON.parse` у `try/catch` → **валідація схеми** (Zod, Valibot, JSON Schema) → лише потім використання. Ніколи `eval` чи `new Function` для «парсингу».

**Prototype pollution.** Сам `JSON.parse` безпечний: `"__proto__"` стає звичайною власною властивістю. Біда починається, коли такий об'єкт потрапляє в наївне глибоке злиття:

```js
const payload = JSON.parse('{"__proto__": {"isAdmin": true}}');
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] ??= {};
      merge(target[key], source[key]); // target['__proto__'] → Object.prototype!
    } else target[key] = source[key];
  }
  return target;
}
merge({}, payload);
console.log({}.isAdmin); // → true 💀 — тепер це має КОЖЕН об'єкт
```

Захист: пропускати ключі `__proto__`, `constructor`, `prototype`; збирати дані в `Object.create(null)` або `Map`; перевіряти `Object.hasOwn`; валідувати схемою. Більше — у [[JavaScript - 30. Безпека в JavaScript]].

> [!quiz] Перевір себе: де небезпека?
> level: senior · id: jsd-23-quiz-08
>
> Що з цього саме по собі може змінити `Object.prototype`?
>
> - [ ] `JSON.parse('{"__proto__": {"x": 1}}')`
> - [x] Рекурсивний `merge({}, parsed)`, що присвоює `target[key]` для кожного ключа
> - [ ] `structuredClone(parsed)`
>
> **Пояснення:** `JSON.parse` і `structuredClone` створюють `__proto__` як **власну** властивість даних. Небезпечне — присвоєння `target['__proto__'] = …` / рекурсія в нього, бо тоді спрацьовує сетер/геттер `Object.prototype.__proto__`.

## ⚠️ Пастки

> [!pitfall] Дата повертається рядком
> ```js
> const saved = JSON.parse(JSON.stringify({ at: new Date() }));
> saved.at.getTime(); // TypeError: saved.at.getTime is not a function
> ```
>
> Після round-trip `at` — ISO-рядок. Відновлюй `reviver`-ом або явно: `new Date(saved.at)`.

> [!pitfall] Великі id з бекенда
> `JSON.parse('{"id": 12345678901234567890}')` дає `12345678901234567000`. Проси бекенд віддавати id рядком або використовуй `context.source` у reviver-і.

> [!pitfall] structuredClone «вбиває» методи
> Екземпляр класу після `structuredClone` — звичайний об'єкт: `instanceof` → `false`, методи зникли. Для доменних об'єктів роби `clone()` або відновлюй через `Object.setPrototypeOf` / фабрику.

> [!pitfall] JSON-копія тихо псує дані
> `JSON.parse(JSON.stringify(x))` викидає `undefined`-поля, перетворює `NaN`/`Infinity` на `null`, `Map`/`Set` — на `{}`, а на циклі падає. Тести з «простими» даними цього не покажуть.

## 🎤 На співбесіді

> [!interview] Як зробити глибоку копію об'єкта? Порівняй способи.
> level: middle · frequency: дуже часто · id: jsd-23-int-01
>
> ---
>
> Spread і `Object.assign` — поверхневі: вкладені об'єкти спільні. `JSON.parse(JSON.stringify(x))` — глибока, але втрачає `undefined`, функції, символи, перетворює `Date` на рядок, `Map`/`Set` на `{}`, `NaN` на `null`, падає на циклах і `BigInt`. `structuredClone` — сучасний стандарт: підтримує `Date`, `RegExp`, `Map`, `Set`, typed arrays, `BigInt`, цикли й спільні посилання, але не функції, DOM-ноди, символи й не зберігає прототип класу. Для об'єктів з поведінкою — власний `clone()` або рекурсія з `WeakMap` для циклів. А часто копія не потрібна взагалі — достатньо незмінних оновлень змінених гілок.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#🪞 Глибока копія — порівняння підходів|Розділ: глибока копія]] · [MDN: structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) · [web.dev: Deep-copying with structuredClone](https://web.dev/articles/structured-clone)

> [!interview] Що JSON.stringify робить з undefined, функціями, NaN, Date, BigInt і циклами?
> level: middle · frequency: часто · id: jsd-23-int-02
>
> ---
>
> `undefined`, функції й символи: у властивостях об'єкта ключ зникає, в масиві стає `null`, на верхньому рівні результат — `undefined`. `NaN` і `±Infinity` → `null`, `-0` → `0`. `Date` має `toJSON` і стає ISO-рядком. `Map`, `Set`, `Error` → `{}`, бо в них немає власних перелічуваних полів. `BigInt` і цикли кидають `TypeError`. Керувати можна через `toJSON`, `replacer` (функція чи білий список ключів) і `space` для відступів.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#📤 JSON.stringify — що потрапляє, а що зникає|Розділ: stringify]] · [MDN: JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) · [Spec: SerializeJSONProperty](https://tc39.es/ecma262/#sec-serializejsonproperty)

> [!interview] Як безпечно прийняти JSON від клієнта?
> level: senior · frequency: часто · id: jsd-23-int-03
>
> ---
>
> Обмежити розмір тіла ще до парсингу; `JSON.parse` у `try/catch` з відповіддю `400` на `SyntaxError`; провалідувати структуру схемою (Zod, JSON Schema) і відкинути зайві поля; не зливати дані наївним deep merge (prototype pollution через `__proto__`/`constructor`), а копіювати лише відомі ключі або в `Object.create(null)`/`Map`; великі числа приймати рядками. Ніколи не використовувати `eval`. При вбудовуванні JSON у HTML — екранувати `<`, щоб `</script>` у даних не закрив тег.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#📮 Серіалізація на межах і безпечний парсинг|Розділ: безпечний парсинг]] · [MDN: Prototype pollution](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution) · [MDN: JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

## 🔗 Зв'язки

- [[JavaScript - 03. Значення та посилання]] — поверхнева vs глибока копія й чому присвоєння копіює посилання.
- [[JavaScript - 17. Числа, BigInt і математика]] — межа `Number.MAX_SAFE_INTEGER` і чому JSON-числа губить точність.
- [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] — колекції, які JSON не вміє, а structured clone — вміє.
- [[JavaScript - 22. Помилки та їх обробка]] — `SyntaxError` з `JSON.parse` і серіалізація помилок для логів.
- [[JavaScript - 28. Сховища та Web APIs]] — `localStorage` зберігає лише рядки, IndexedDB — structured clone.
- [[JavaScript - 30. Безпека в JavaScript]] — prototype pollution і JSON у HTML.

## ⚡ Фішки

> [!reel] 🕳️ JSON.stringify(undefined) — не рядок
> Він повертає `undefined`. А `localStorage.setItem('k', undefined)` збереже рядок `"undefined"`, на якому `JSON.parse` впаде.

> [!reel] 🧮 JSON губить цифри після 2⁵³
> ```js
> JSON.parse('9007199254740993'); // → 9007199254740992
> ```
> Тому великі id в API приходять рядками.

> [!reel] 🔁 structuredClone копіює цикли
> На відміну від JSON-трюку, він зберігає і цикли, і спільні посилання: якщо в оригіналі два поля вказували на один об'єкт — у копії теж.

> [!reel] 🧾 JSON до 2019 не був частиною JS
> Символи `U+2028`/`U+2029` були валідні в JSON-рядках, але ламали JS-рядки. ES2019 зробив JS надмножиною JSON.

> [!reel] 🎭 toJSON спрацьовує раніше за replacer
> Тому в `replacer` дата вже рядок. Оригінальний `Date` видно лише через `this[key]`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чим JSON відрізняється від JS-об'єкта?
> *часто · порівняння* · `jsd-23-001`
>
> JSON — текстовий формат: ключі й рядки лише в подвійних лапках, без коментарів і кінцевих ком, без `undefined`, `NaN`, `Infinity`, функцій. JS-об'єкт — значення в пам'яті з будь-якими типами. `JSON.parse`/`stringify` перетворюють одне на інше.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#📜 JSON — не те саме, що JS-літерал|Розділ: граматика JSON]] · [json.org](https://www.json.org/json-en.html)

> [!question]- Що стане з `undefined` і функціями в `JSON.stringify`?
> *дуже часто · код* · `jsd-23-002`
>
> У властивостях об'єкта — ключ зникає; у масиві — `null`; на верхньому рівні — результат `undefined`. Символи поводяться так само.
>
> ```js
> JSON.stringify({ a: undefined, f() {} }); // → '{}'
> JSON.stringify([undefined, () => 1]);     // → '[null,null]'
> ```
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#📤 JSON.stringify — що потрапляє, а що зникає|Розділ: stringify]] · [MDN: JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

> [!question]- Як красиво відформатувати JSON для логу?
> *іноді · практика* · `jsd-23-003`
>
> Третій аргумент `space`: `JSON.stringify(obj, null, 2)` — відступ 2 пробіли (максимум 10), або рядок, наприклад `'\t'`.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#🎛️ replacer, space і toJSON|Розділ: space]] · [javascript.info: JSON methods](https://javascript.info/json)

### 🟡 Middle

> [!question]- Як зберегти й відновити `Date` через JSON?
> *часто · код* · `jsd-23-004`
>
> `stringify` сам викличе `Date.prototype.toJSON` (ISO-рядок). При парсингу — `reviver`, що розпізнає ISO-рядок і повертає `new Date(value)`, або явне перетворення потрібних полів після парсингу (надійніше, ніж regex на всі рядки).
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#📥 JSON.parse і reviver|Розділ: reviver]] · [MDN: JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

> [!question]- Що підтримує `structuredClone`, а що ні?
> *часто · теорія* · `jsd-23-005`
>
> Так: примітиви крім `Symbol`, об'єкти, масиви, `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer` і typed arrays, `Blob`/`File`, `Error`, цикли та спільні посилання. Ні: функції, символи, `WeakMap`, `Promise`, DOM-ноди (`DataCloneError`); прототип класу, геттери (лише значення), дескриптори й неперелічувані поля губляться.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#🧬 structuredClone і structured clone algorithm|Розділ: structuredClone]] · [MDN: Structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)

> [!question]- Як серіалізувати `BigInt` і `Map` у JSON?
> *іноді · код* · `jsd-23-006`
>
> Через `replacer`: `BigInt` → рядок, `Map` → масив пар (`[...map]`) або тегований об'єкт `{ $type: 'Map', value: [...] }`, який `reviver` перетворить назад. Патчити `BigInt.prototype.toJSON` глобально — погана ідея для бібліотек.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#🎛️ replacer, space і toJSON|Розділ: replacer]] · [MDN: JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

> [!question]- Чому `JSON.parse` не вразливий до `__proto__`, а deep merge — так?
> *часто · теорія* · `jsd-23-007`
>
> `JSON.parse` створює `"__proto__"` як звичайну власну властивість. Але наївний merge робить `target['__proto__']`, а це вже аксесор `Object.prototype.__proto__` → рекурсія пише в `Object.prototype`, і поле з'являється в усіх об'єктах. Захист: пропускати `__proto__`/`constructor`/`prototype`, `Object.create(null)`, валідація схемою.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#📮 Серіалізація на межах і безпечний парсинг|Розділ: prototype pollution]] · [MDN: Prototype pollution](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution)

### 🔴 Senior

> [!question]- Як прочитати з JSON число більше за `2^53` без втрати точності?
> *рідко · код* · `jsd-23-008`
>
> ES2026 *JSON.parse source text access*: reviver отримує третій аргумент `context` з `source` — сирим текстом примітиву. `BigInt(context.source)` дає точне значення. Для зворотного напрямку — `JSON.rawJSON('…')`. Альтернатива — передавати id рядками.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#📥 JSON.parse і reviver|Розділ: великі числа]] · [MDN: JSON.rawJSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/rawJSON)

> [!question]- Що таке transfer у `structuredClone` і `postMessage`?
> *іноді · теорія* · `jsd-23-009`
>
> Список transferable-об'єктів (`ArrayBuffer`, `MessagePort`, `ImageBitmap`, streams), які **переносяться**, а не копіюються: отримувач бере володіння пам'яттю, а оригінал від'єднується (`byteLength === 0`). Це O(1) замість копіювання мегабайтів.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#🧬 structuredClone і structured clone algorithm|Розділ: transfer]] · [HTML Standard: Transferable objects](https://html.spec.whatwg.org/multipage/structured-data.html#transferable-objects)

> [!question]- Які поля `Error` переживають `structuredClone`?
> *рідко · теорія* · `jsd-23-010`
>
> `name` (лише зі стандартного списку — інакше стане `'Error'`), `message`, у сучасних рушіях `stack` і `cause`. Прототип відновлюється для вбудованих типів (`TypeError` лишиться `TypeError`), але підклас `MyError` стане `Error`, а власні поля на кшталт `code` зникнуть.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація#🧬 structuredClone і structured clone algorithm|Розділ: що копіюється]] · [HTML Standard: StructuredSerializeInternal](https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal)

## 🛠️ Практика

> [!task] Поясни своїми словами: чому JSON-копія ламає дату
> level: junior · difficulty: easy · id: jsd-23-task-01 · tags: feynman, json
>
> Колега написав `const copy = JSON.parse(JSON.stringify(state))`, і після цього `copy.createdAt.getFullYear()` падає. Поясни в 3–5 реченнях, що сталося і як це виправити двома різними способами.
>
> > [!hint]- Підказка 1
> > Подивись, що робить `Date.prototype.toJSON` і що вміє зберігати JSON як формат.
>
> > [!hint]- Підказка 2
> > Один спосіб — інший інструмент копіювання, другий — відновлення типу при парсингу.
>
> > [!solution]- Еталонне пояснення
> > JSON знає лише рядки, числа, `true/false`, `null`, об'єкти й масиви — типу «дата» в ньому немає. Тому `stringify` викликає `toJSON()` дати й записує ISO-рядок, а `parse` повертає саме рядок — без методів `Date`. Виходить, `copy.createdAt` — це `"2026-…Z"`, і `getFullYear` у рядка немає. Виправлення: 1) копіювати через `structuredClone(state)`, який зберігає `Date`; 2) якщо JSON потрібен (мережа, сховище) — відновлювати дату `reviver`-ом або `new Date(copy.createdAt)`.

> [!task] serialize/deserialize з тегованими типами
> level: middle · difficulty: medium · id: jsd-23-task-02 · tags: json, replacer, reviver
>
> Напиши `serialize(value)` і `deserialize(text)` поверх JSON, які зберігають `Date`, `Map`, `Set` і `BigInt` (на будь-якій глибині). Формат — тегований об'єкт `{ "$type": "Map", "value": … }`.
>
> ```js
> const original = { at: new Date(0), tags: new Set(['a']), byId: new Map([[1, { big: 2n ** 64n }]]) };
> const back = deserialize(serialize(original));
> back.at instanceof Date; // → true
> back.byId.get(1).big;    // → 18446744073709551616n
> ```
>
> ```js starter
> function serialize(value) {
>   // твій код: JSON.stringify з replacer
> }
>
> function deserialize(text) {
>   // твій код: JSON.parse з reviver
> }
> ```
>
> ```js tests
> test('Date повертається як Date', () => {
>   const back = deserialize(serialize({ at: new Date(0) }))
>   expect(back.at).toBeInstanceOf(Date)
>   expect(back.at.getTime()).toBe(0)
> })
>
> test('Map і Set відновлюються', () => {
>   const back = deserialize(serialize({ tags: new Set(['a', 'b']), byId: new Map([[1, 'x']]) }))
>   expect(back.tags).toEqual(new Set(['a', 'b']))
>   expect(back.byId.get(1)).toBe('x')
> })
>
> test('BigInt усередині Map усередині об\'єкта', () => {
>   const back = deserialize(serialize({ byId: new Map([[1, { big: 2n ** 64n }]]) }))
>   expect(back.byId.get(1).big).toBe(18446744073709551616n)
> })
>
> test('вкладені Map у Map і масиви дат', () => {
>   const back = deserialize(serialize([new Map([['inner', new Map([['d', new Date(5)]])]])]))
>   expect(back[0].get('inner').get('d').getTime()).toBe(5)
> })
>
> test('звичайні JSON-значення не змінюються', () => {
>   const plain = { a: 1, b: [true, null, 'x'], c: { d: 2 } }
>   expect(serialize(plain)).toBe(JSON.stringify(plain))
>   expect(deserialize(serialize(plain))).toEqual(plain)
> })
> ```
>
> > [!hint]- Підказка 1
> > У `replacer` дата вже рядок через `toJSON`. Як дістати оригінал? (`this[key]`.)
>
> > [!hint]- Підказка 2
> > `reviver` працює знизу вгору, тож вкладені `Map` усередині `Map` відновляться самі.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function replacer(key, value) {
> >   const raw = this[key]; // до toJSON
> >   if (raw instanceof Date) return { $type: 'Date', value: raw.toISOString() };
> >   if (value instanceof Map) return { $type: 'Map', value: [...value] };
> >   if (value instanceof Set) return { $type: 'Set', value: [...value] };
> >   if (typeof value === 'bigint') return { $type: 'BigInt', value: value.toString() };
> >   return value;
> > }
> >
> > function reviver(key, value) {
> >   if (value && typeof value === 'object' && typeof value.$type === 'string') {
> >     switch (value.$type) {
> >       case 'Date': return new Date(value.value);
> >       case 'Map': return new Map(value.value);
> >       case 'Set': return new Set(value.value);
> >       case 'BigInt': return BigInt(value.value);
> >     }
> >   }
> >   return value;
> > }
> >
> > const serialize = (v) => JSON.stringify(v, replacer);
> > const deserialize = (s) => JSON.parse(s, reviver);
> > ```
> >
> > Важливо: `replacer` — звичайна функція, не стрілка, бо потрібен `this`. Масив пар від `Map` сам проходить через `replacer`, тому `BigInt` усередині `Map` теж тегується.

> [!task] deepClone з циклами й прототипами
> level: senior · difficulty: hard · id: jsd-23-task-03 · tags: deep-copy, weakmap, recursion
>
> Реалізуй `deepClone(value)`, яка, на відміну від `structuredClone`, **зберігає прототип** і методи класів. Вимоги: примітиви повертаються як є; `Date`, `RegExp`, `Map`, `Set`, масиви копіюються; цикли й спільні посилання зберігаються; копіюються всі власні ключі, включно із символьними й неперелічуваними (з дескрипторами); функції — за посиланням.
>
> ```js starter
> function deepClone(value, seen = new WeakMap()) {
>   // твій код
> }
> ```
>
> ```js tests
> class Point {
>   constructor(x, y) { this.x = x; this.y = y }
>   len() { return Math.hypot(this.x, this.y) }
> }
>
> test('примітиви й функції повертаються як є', () => {
>   const fn = () => 1
>   expect(deepClone(5)).toBe(5)
>   expect(deepClone(null)).toBe(null)
>   expect(deepClone(fn)).toBe(fn)
> })
>
> test('зберігає прототип і методи класу', () => {
>   const p = new Point(3, 4)
>   const c = deepClone(p)
>   expect(c).not.toBe(p)
>   expect(c).toBeInstanceOf(Point)
>   expect(c.len()).toBe(5)
> })
>
> test('Date, RegExp, Map, Set копіюються глибоко', () => {
>   const src = { d: new Date(7), r: /a/gi, m: new Map([['k', new Set([1])]]) }
>   const c = deepClone(src)
>   expect(c.d).not.toBe(src.d)
>   expect(c.d.getTime()).toBe(7)
>   expect(c.r.flags).toBe('gi')
>   expect(c.m.get('k')).not.toBe(src.m.get('k'))
>   expect(c.m.get('k').has(1)).toBe(true)
> })
>
> test('цикли й спільні посилання зберігаються', () => {
>   const shared = { n: 1 }
>   const src = { a: shared, b: shared, list: [shared] }
>   src.self = src
>   const c = deepClone(src)
>   expect(c.self).toBe(c)
>   expect(c.a).toBe(c.b)
>   expect(c.list[0]).toBe(c.a)
>   expect(c.a).not.toBe(shared)
> })
>
> test('символьні й неперелічувані ключі з дескрипторами', () => {
>   const sym = Symbol('id')
>   const src = { [sym]: 1 }
>   Object.defineProperty(src, 'hidden', { value: 2, enumerable: false, writable: false })
>   const c = deepClone(src)
>   expect(c[sym]).toBe(1)
>   expect(c.hidden).toBe(2)
>   expect(Object.getOwnPropertyDescriptor(c, 'hidden').writable).toBe(false)
>   expect(Object.keys(c)).toEqual([])
> })
> ```
>
> > [!hint]- Підказка 1
> > `WeakMap` «оригінал → копія»: перевіряй на початку і **реєструй копію до** рекурсії в дітей.
>
> > [!hint]- Підказка 2
> > `Object.create(Object.getPrototypeOf(value))` + `Reflect.ownKeys` + `Object.getOwnPropertyDescriptor`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function deepClone(value, seen = new WeakMap()) {
> >   if (typeof value !== 'object' || value === null) return value; // примітиви й функції
> >   if (seen.has(value)) return seen.get(value);
> >
> >   if (value instanceof Date) return new Date(value.getTime());
> >   if (value instanceof RegExp) {
> >     const r = new RegExp(value.source, value.flags);
> >     r.lastIndex = value.lastIndex;
> >     return r;
> >   }
> >   if (value instanceof Map) {
> >     const m = new Map();
> >     seen.set(value, m);
> >     for (const [k, v] of value) m.set(deepClone(k, seen), deepClone(v, seen));
> >     return m;
> >   }
> >   if (value instanceof Set) {
> >     const s = new Set();
> >     seen.set(value, s);
> >     for (const v of value) s.add(deepClone(v, seen));
> >     return s;
> >   }
> >
> >   const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
> >   seen.set(value, copy); // до рекурсії — інакше цикл зациклиться
> >   for (const key of Reflect.ownKeys(value)) {
> >     const desc = Object.getOwnPropertyDescriptor(value, key);
> >     if ('value' in desc) desc.value = deepClone(desc.value, seen);
> >     Object.defineProperty(copy, key, desc); // аксесори копіюються як аксесори
> >   }
> >   return copy;
> > }
> >
> > class Point { constructor(x, y) { this.x = x; this.y = y; } len() { return Math.hypot(this.x, this.y); } }
> > const src = { p: new Point(3, 4), m: new Map([['k', new Set([1])]]) };
> > src.self = src;
> > const c = deepClone(src);
> > console.log(c.p.len(), c.p !== src.p, c.self === c); // → 5 true true
> > ```
> >
> > Обмеження: приватні поля `#x` і внутрішні слоти (наприклад, у `Map`-підкласів чи DOM) так не скопіювати — для них потрібен власний `clone()`.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — JSON methods, toJSON](https://javascript.info/json) — `stringify`/`parse`, `replacer`, `reviver` з прикладами.
- 🟢 [web.dev — Deep-copying in JavaScript using structuredClone](https://web.dev/articles/structured-clone) — чому `structuredClone` і його обмеження.
- 🟡 [MDN — JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) — повна таблиця поведінки для всіх типів.
- 🟡 [MDN — The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) — що підтримується, а що ні.
- 🟡 [MDN — Prototype pollution](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution) — як працює атака і як захищатися.
- 🟡 [V8 — Subsume JSON a.k.a. JSON ⊂ ECMAScript](https://v8.dev/features/subsume-json) — історія з `U+2028`.
- 🔴 [ECMAScript — The JSON Object](https://tc39.es/ecma262/#sec-json-object) — алгоритми `parse` і `stringify`.
- 🔴 [HTML Standard — Safe passing of structured data](https://html.spec.whatwg.org/multipage/structured-data.html#safe-passing-of-structured-data) — structured clone і transfer у специфікації.
- 🔴 [RFC 8259 — The JSON Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259) — граматика формату.

> [!important] Підсумок
> - JSON — вузький текстовий формат: лише подвійні лапки, без коментарів, кінцевих ком, `undefined`, `NaN`.
> - `stringify`: `undefined`/функції/символи зникають (у масиві → `null`), `NaN` → `null`, `Date` → ISO-рядок, `Map`/`Set` → `{}`, `BigInt` і цикли → `TypeError`.
> - `toJSON` → `replacer` → тип; `reviver` іде знизу вгору й відновлює типи; великі числа — через `context.source`.
> - `structuredClone` копіює граф із циклами, `Date`, `Map`, `Set`, буфери, але не функції, символи й прототипи класів.
> - Ненадійний JSON: `try/catch` → схема → копіювання лише відомих ключів; наївний deep merge = prototype pollution.
