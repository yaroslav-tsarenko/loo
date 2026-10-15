---
title: Об'єкти, масиви та робота з даними
order: 4
tags: [arrays, objects, immutability, json, data]
estimatedMinutes: 60
---

# JS Interview Q&A — 04. Об'єкти, масиви та робота з даними

## 🟢 Junior

> [!question]- Яка різниця між `map`, `filter`, `reduce` і `forEach`?
> *дуже часто · порівняння* · `js-04-001`
>
> - `map` — новий масив тієї ж довжини з результатами callback.
> - `filter` — новий масив з елементами, для яких callback повернув truthy.
> - `reduce` — згортає масив в одне значення через акумулятор.
> - `forEach` — лише для побічних ефектів, повертає `undefined` і не зупиняється достроково (хіба що через `throw`).
>
> Жоден із них не мутує вихідний масив сам по собі.
>
> ```js
> const nums = [1, 2, 3, 4];
> nums.map((n) => n * 2);              // [2, 4, 6, 8]
> nums.filter((n) => n % 2 === 0);     // [2, 4]
> nums.reduce((sum, n) => sum + n, 0); // 10
> [].reduce((a, b) => a + b);          // TypeError: порожній масив без initialValue
> ```
>
> **На співбесіді:** `forEach` не чекає `async` callback-ів — для послідовних асинхронних операцій потрібен `for...of` з `await`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#map, filter, reduce: три кити|Розділ: map, filter, reduce]] · [MDN: Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) · [MDN: Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

> [!question]- Чим `find`, `findLast`, `some` і `every` відрізняються від `filter`?
> *часто · порівняння* · `js-04-002`
>
> Ці методи **short-circuit** — зупиняються, щойно відповідь відома, тоді як `filter` завжди проходить увесь масив і повертає масив.
>
> - `find` / `findLast` — перший / останній відповідний елемент або `undefined`.
> - `findIndex` / `findLastIndex` — його індекс або `-1`.
> - `some` — чи є хоча б один (для порожнього масиву `false`).
> - `every` — чи підходять усі (для порожнього масиву `true`).
>
> ```js
> const orders = [
>   { id: 1, paid: true },
>   { id: 2, paid: false },
>   { id: 3, paid: false },
> ];
> orders.find((o) => !o.paid)?.id;     // 2
> orders.findLast((o) => !o.paid)?.id; // 3
> orders.some((o) => o.paid);          // true
> orders.every((o) => o.paid);         // false
> [].every(() => false);               // true
> ```
>
> `find` не відрізняє «не знайдено» від знайденого `undefined` — тоді використовуй `findIndex`. Для примітивів замість `some` зручніше `includes`, який ще й знаходить `NaN`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Пошук і перевірки|Розділ: пошук і перевірки]] · [MDN: Array.prototype.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) · [MDN: Array.prototype.findLast()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast)

> [!question]- Які методи масиву мутують його, а які повертають новий масив?
> *дуже часто · порівняння* · `js-04-003`
>
> Мутують: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`. `sort` і `reverse` ще й повертають той самий масив, що маскує мутацію.
>
> Не мутують: `map`, `filter`, `slice`, `concat`, `flat`, `join` тощо. ES2023 додав **non-mutating копії**: `toSorted`, `toReversed`, `toSpliced`, `with(index, value)`.
>
> ```js
> const a = [3, 1, 2];
> a.toSorted();      // [1, 2, 3], a не змінено
> a.with(0, 9);      // [9, 1, 2]
> a.with(-1, 0);     // [3, 1, 0]
> a.toSpliced(1, 1); // [3, 2]
> a.with(5, 0);      // RangeError
> const c = a.sort(); // мутує: c === a
> ```
>
> Нові методи — природний інструмент для immutable-оновлень state у React, де мутація масиву означає, що компонент не перерендериться.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Іммутабельність: мутуючі методи і їхні безпечні двійники|Розділ: мутуючі методи]] · [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) · [MDN: Array.prototype.toSorted()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)

> [!question]- Як працює деструктуризація з дефолтними значеннями та перейменуванням?
> *дуже часто · код* · `js-04-004`
>
> Деструктуризація витягує значення за ключем (об'єкт) або позицією (масив). `{ key: newName }` — перейменування, `= value` — дефолт, який спрацьовує **лише для `undefined`**, не для `null`.
>
> ```js
> const user = { id: 7, profile: null, role: undefined };
> const { id: userId, role = 'guest', profile = {} } = user;
> // userId = 7, role = 'guest', profile = null
>
> const [first, , third = 0] = [10, 20];
> // first = 10, third = 0
>
> function connect({ host = 'localhost', port = 5432 } = {}) {
>   return `${host}:${port}`;
> }
> connect(); // 'localhost:5432'
> ```
>
> Вкладена деструктуризація `const { a: { b } } = obj` кидає `TypeError`, якщо `obj.a` — `undefined` або `null`. `= {}` у параметрах захищає від виклику без аргументу. Дефолт обчислюється ліниво — лише тоді, коли значення справді `undefined`, тож `= createDefault()` не викликається зайвий раз.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко|Розділ: обʼєкти глибоко]] · [MDN: Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring) · [javascript.info: Destructuring assignment](https://javascript.info/destructuring-assignment)

> [!question]- Чим spread відрізняється від rest?
> *часто · код* · `js-04-005`
>
> Синтаксис `...` той самий, зміст протилежний: **spread** розгортає ітерабельне значення чи об'єкт у місці використання (виклик, літерал), **rest** збирає «решту» в масив чи об'єкт (параметри, деструктуризація).
>
> ```js
> const base = { a: 1, b: 2 };
> const next = { ...base, b: 3 };     // { a: 1, b: 3 } — пізніший ключ перемагає
> const { a, ...others } = next;      // others = { b: 3 }
> Math.max(...[1, 5, 3]);             // 5
> function log(level, ...messages) { return messages.length; }
> log('info', 'x', 'y');              // 2
> ```
>
> Важливо:
> - spread робить shallow copy — вкладені об'єкти спільні;
> - object spread копіює лише own enumerable властивості (разом із Symbol-ключами), без прототипу;
> - array spread вимагає iterable, object spread — ні: `{ ...null }` дає `{}`, а `[...null]` кидає `TypeError`;
> - rest завжди останній.
>
> 📚 [[JavaScript - 15. Функції глибоко|Розділ: функції глибоко]] · [MDN: Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) · [javascript.info: Rest parameters and spread syntax](https://javascript.info/rest-parameters-spread)

> [!question]- Яка різниця між shallow copy і deep copy?
> *дуже часто · теорія* · `js-04-006`
>
> **Shallow copy** створює новий контейнер верхнього рівня, але вкладені об'єкти копіюються за посиланням — зміна вкладеного видна в обох. **Deep copy** рекурсивно копіює весь граф.
>
> Shallow: spread, `Object.assign`, `slice`, `Array.from`. Deep: `structuredClone`, бібліотечні функції, власна рекурсія.
>
> ```js
> const src = { user: { name: 'Ann' }, tags: ['a'] };
> const shallow = { ...src };
> shallow.user.name = 'Bob';
> src.user.name; // 'Bob' — спільний об'єкт
>
> const deep = structuredClone(src);
> deep.tags.push('b');
> src.tags;      // ['a']
> ```
>
> **На співбесіді:** deep copy потрібна рідше, ніж здається. Для immutable-оновлень копіюють лише шлях до зміненого вузла, а решту використовують повторно (structural sharing).
>
> 📚 [[JavaScript - 03. Значення та посилання#📋 Копіювання: shallow vs deep|Розділ: shallow vs deep]] · [MDN: Shallow copy](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy) · [MDN: Deep copy](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy)

> [!question]- Як працюють `Object.keys`, `values`, `entries` і `fromEntries`?
> *часто · код* · `js-04-007`
>
> `Object.keys/values/entries` повертають масиви власних enumerable **рядкових** ключів (Symbol-ключі пропускаються), їхніх значень або пар `[key, value]`. `Object.fromEntries` — зворотна операція: приймає будь-який iterable пар (масив, `Map`, `URLSearchParams`) і будує об'єкт.
>
> ```js
> const prices = { apple: 10, pear: 20 };
> const discounted = Object.fromEntries(
>   Object.entries(prices).map(([k, v]) => [k, v * 0.9]),
> );
> // { apple: 9, pear: 18 }
>
> Object.fromEntries(new Map([['x', 1]]));            // { x: 1 }
> Object.fromEntries(new URLSearchParams('a=1&b=2')); // { a: '1', b: '2' }
> ```
>
> Ланцюжок `entries` → `map`/`filter` → `fromEntries` — ідіоматичний спосіб трансформувати об'єкт. Успадковані ключі ці методи не бачать, на відміну від `for...in`. У `Map` є власні `.keys()`, `.values()`, `.entries()`, але вони повертають ітератори, а не масиви.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко|Розділ: обʼєкти глибоко]] · [MDN: Object.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) · [javascript.info: Object.keys, values, entries](https://javascript.info/keys-values-entries)

> [!question]- Чому `[10, 1, 5, 100].sort()` повертає `[1, 10, 100, 5]`?
> *дуже часто · код* · `js-04-008`
>
> Без comparator-а `sort` перетворює елементи на рядки й порівнює їх за UTF-16 code units, тобто **лексикографічно**: `'100' < '5'`, бо `'1' < '5'`. Для чисел завжди передавай comparator, що повертає від'ємне число, 0 або додатне.
>
> ```js
> [10, 1, 5, 100].sort();                // [1, 10, 100, 5]
> [10, 1, 5, 100].sort((a, b) => a - b); // [1, 5, 10, 100]
> [10, 1, 5, 100].sort((a, b) => b - a); // [100, 10, 5, 1]
> ['b', 'a', 'C'].sort();                // ['C', 'a', 'b'] — великі літери раніше
> ['b', 'a', 'C'].sort((x, y) => x.localeCompare(y)); // ['a', 'b', 'C']
> ```
>
> Також `sort` мутує масив і завжди відправляє `undefined` у кінець, не викликаючи для них comparator. Якщо оригінал потрібен незмінним, використовуй `toSorted` з тим самим comparator.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#sort і компаратор|Розділ: sort і компаратор]] · [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) · [Spec: Array.prototype.sort](https://tc39.es/ecma262/#sec-array.prototype.sort)

## 🟡 Middle

> [!question]- Як правильно писати comparator для `sort` і чи стабільне сортування в JS?
> *часто · код* · `js-04-009`
>
> Comparator повертає число: `< 0` — `a` раніше, `> 0` — `b` раніше, `0` — рівні. Він має бути **консистентним** (однакова відповідь для тієї самої пари, транзитивність), інакше порядок результату не визначений специфікацією.
>
> Типові помилки:
> - повертати boolean (`(a, b) => a > b`): `true` → 1, `false` → 0, від'ємного значення немає — «працює» лише випадково на конкретному рушії й розмірі масиву;
> - `a - b` для рядків чи значень з `NaN` — `NaN` трактується як 0, порядок ламається;
> - `() => Math.random() - 0.5` для перемішування — упереджений розподіл; правильно — Fisher–Yates.
>
> З ES2019 `Array.prototype.sort` **гарантовано stable**: рівні елементи зберігають відносний порядок. Тому сортування за кількома ключами можна робити в одному comparator через `||` або послідовними сортуваннями.
>
> ```js
> const users = [
>   { name: 'Bob', age: 30 },
>   { name: 'Ann', age: 25 },
>   { name: 'Cid', age: 30 },
> ];
> users.toSorted((a, b) => b.age - a.age || a.name.localeCompare(b.name));
> // Bob(30), Cid(30), Ann(25)
> ```
>
> Для великих масивів рядків `new Intl.Collator('uk').compare` швидший, ніж `localeCompare` на кожне порівняння.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#sort і компаратор|Розділ: sort і компаратор]] · [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) · [V8: Getting things sorted in V8](https://v8.dev/blog/array-sort)

> [!question]- Як працюють `flat` і `flatMap`?
> *іноді · код* · `js-04-010`
>
> `flat(depth = 1)` повертає новий масив, розплющуючи вкладені масиви на задану глибину; `flat(Infinity)` — повністю. `flatMap(fn)` — це `map(fn)` + `flat(1)` за один прохід: callback може повернути масив з 0, 1 або кількома елементами.
>
> ```js
> [1, [2, [3, [4]]]].flat();         // [1, 2, [3, [4]]]
> [1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]
> [1, , 3].flat();                   // [1, 3] — holes видаляються
>
> const orders = [{ items: ['a', 'b'] }, { items: [] }, { items: ['c'] }];
> orders.flatMap((o) => o.items);    // ['a', 'b', 'c']
> [1, -2, 3].flatMap((n) => (n > 0 ? [n * 10] : [])); // [10, 30] — filter + map
> ```
>
> Нюанси: `flatMap` розплющує лише на один рівень; розплющуються тільки справжні масиви (`Array.isArray`), а не array-like чи інші iterable — `Set` чи рядок лишаться одним елементом. Патерн «повернути `[]`, щоб викинути елемент» замінює пару `filter` + `map` одним проходом. Обидва методи повертають новий масив і не мутують вихідний.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#flat і flatMap|Розділ: flat і flatMap]] · [MDN: Array.prototype.flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) · [MDN: Array.prototype.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)

> [!question]- Чим `Array.from` відрізняється від spread `[...x]`?
> *іноді · порівняння* · `js-04-011`
>
> Обидва створюють новий масив, але з різних джерел:
>
> - `[...x]` працює лише з **iterable** (через `Symbol.iterator`); для array-like без ітератора — `TypeError`.
> - `Array.from(x, mapFn?)` приймає і iterable, і **array-like** (`{ length: n }`), а другим аргументом — map-функцію без проміжного масиву.
> - Holes обидва перетворюють на `undefined`.
>
> ```js
> const arrayLike = { 0: 'a', 1: 'b', length: 2 };
> Array.from(arrayLike);                      // ['a', 'b']
> [...arrayLike];                             // TypeError: arrayLike is not iterable
> Array.from({ length: 3 }, (_, i) => i * i); // [0, 1, 4]
> [...new Set([1, 1, 2])];                    // [1, 2]
> '𝒳a'.length;                                // 3 — UTF-16 code units
> [...'𝒳a'].length;                           // 2 — code points
> new Array(3).map((_, i) => i);              // [ <3 empty items> ]
> ```
>
> `Array.from({ length: n }, fn)` — стандартний спосіб згенерувати масив потрібної довжини, бо `new Array(n).map(...)` пропускає holes і нічого не робить. Для перетворення `NodeList`, `arguments` чи рядка обидва варіанти рівноцінні, бо вони iterable. Для async iterable є `Array.fromAsync`.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Протоколи ітерації|Розділ: протоколи ітерації]] · [MDN: Array.from()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) · [MDN: Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

> [!question]- Що таке holes (sparse arrays) і як із ними поводяться методи масиву?
> *іноді · теорія* · `js-04-012`
>
> Sparse array — масив, де деяких індексів **немає зовсім**: не `undefined`, а відсутня властивість. Виникають через `[1, , 3]`, `new Array(5)`, `arr[100] = x`, `delete arr[i]`. `length` при цьому більший за кількість елементів.
>
> Поведінка методів неоднорідна:
> - пропускають holes: `forEach`, `map` (зберігає дірку в результаті), `filter`, `reduce`, `some`, `every`, `indexOf`, `for...in`;
> - бачать `undefined`: `for...of`, spread, `Array.from`, `find`, `findIndex`, `includes`, `entries`/`values`, а також `toSorted`/`with` (ES2023);
> - `sort` переносить holes у кінець, `flat` видаляє, `join` трактує як порожній рядок.
>
> ```js
> const a = [1, , 3];
> 1 in a;                // false
> a.map((x) => x * 2);   // [2, <1 empty item>, 6]
> a.includes(undefined); // true
> a.indexOf(undefined);  // -1
> Array.from(a);         // [1, undefined, 3]
> ```
>
> У V8 holes переводять масив у HOLEY elements kind, і це не скасовується навіть після заповнення дірок. Висновок: не створюй sparse-масиви навмисно — `Array.from({ length: n })` або `new Array(n).fill(0)`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Діри та розріджені масиви|Розділ: діри в масивах]] · [MDN: Indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections) · [V8: Elements kinds](https://v8.dev/blog/elements-kinds)

> [!question]- Чим `structuredClone` відрізняється від `JSON.parse(JSON.stringify(x))` і які обмеження має кожен?
> *часто · порівняння* · `js-04-013`
>
> `JSON.parse(JSON.stringify(x))` — deep copy лише **JSON-сумісних** даних:
> - `undefined`, функції, Symbol зникають (у масивах стають `null`);
> - `Date` стає рядком, `Map`/`Set` — `{}`, `NaN`/`Infinity` — `null`;
> - `BigInt` і цикли кидають `TypeError`, спільні посилання дублюються.
>
> `structuredClone` використовує **structured clone algorithm** (той самий, що в `postMessage` і IndexedDB): зберігає цикли й спільні посилання, `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer` і typed arrays, `Error`, `BigInt`, `Blob`. Обмеження:
> - функції, DOM-вузли, Symbol — `DataCloneError`;
> - прототип втрачається: екземпляр класу стає plain object; getter-и копіюються як значення, `#`-поля та Symbol-ключі не копіюються.
>
> ```js
> const src = { at: new Date(0), tags: new Set(['a']) };
> src.self = src;
> const copy = structuredClone(src);
> copy.self === copy;           // true
> copy.at instanceof Date;      // true
> structuredClone({ fn() {} }); // DataCloneError
> ```
>
> Бонус: опція `transfer` передає `ArrayBuffer` без копіювання (оригінал стає detached).
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація|Розділ: JSON, structuredClone і серіалізація]] · [MDN: The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) · [MDN: JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

> [!question]- У якому порядку перебираються ключі об'єкта?
> *іноді · теорія* · `js-04-014`
>
> Порядок власних ключів визначений специфікацією і однаковий для `Object.keys`, `JSON.stringify`, spread, `Reflect.ownKeys`, а з ES2020 і для `for...in`:
>
> 1. integer-like ключі (array index, від 0 до 2³² − 2) — за зростанням;
> 2. решта рядкових ключів — у порядку додавання;
> 3. Symbol-ключі — у порядку додавання (лише в `Reflect.ownKeys` та `Object.getOwnPropertySymbols`).
>
> ```js
> const o = { b: 1, 10: 'x', a: 2, 2: 'y', '-1': 'z', '01': 'w' };
> Object.keys(o); // ['2', '10', 'b', 'a', '-1', '01']
> ```
>
> `'-1'` і `'01'` не є канонічними індексами, тому йдуть як звичайні рядки в порядку вставки. `for...in` після власних ключів обходить ще й успадковані enumerable.
>
> **На співбесіді:** об'єкт з числовими ID (`{ 1003: ..., 7: ... }`) не збереже порядок вставки — для впорядкованих даних використовуй масив або `Map`, який завжди зберігає порядок додавання.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко|Розділ: обʼєкти глибоко]] · [MDN: Object.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) · [Spec: OrdinaryOwnPropertyKeys](https://tc39.es/ecma262/#sec-ordinaryownpropertykeys)

> [!question]- Як працюють `Object.groupBy` і `Map.groupBy`?
> *іноді · код* · `js-04-015`
>
> `Object.groupBy(items, callback)` (ES2024) групує елементи будь-якого iterable: callback повертає ключ, результат — об'єкт з **null-прототипом**, де значення — масиви елементів. `Map.groupBy` робить те саме, але повертає `Map`, тож ключем може бути будь-яке значення, зокрема об'єкт, без приведення до рядка.
>
> ```js
> const txs = [
>   { id: 1, status: 'paid', amount: 30 },
>   { id: 2, status: 'failed', amount: 10 },
>   { id: 3, status: 'paid', amount: 5 },
> ];
> const byStatus = Object.groupBy(txs, (t) => t.status);
> byStatus.paid.length; // 2
> byStatus.refunded;    // undefined — є лише непорожні групи
>
> const big = { label: 'big' };
> const small = { label: 'small' };
> const bySize = Map.groupBy(txs, (t) => (t.amount > 20 ? big : small));
> bySize.get(small).length; // 2
> ```
>
> Нюанси:
> - це static-методи, а не `Array.prototype.group` — від методу на прототипі відмовилися через web compat;
> - через null-прототип у результату немає `hasOwnProperty` — використовуй `Object.hasOwn`;
> - ключі `Object.groupBy` приводяться до property key (рядок або Symbol);
> - доступні в Node 21+ і всіх сучасних браузерах.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко|Розділ: обʼєкти глибоко]] · [MDN: Object.groupBy()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy) · [MDN: Map.groupBy()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy)

> [!question]- Як `JSON.stringify` обробляє `undefined`, функції, `BigInt`, `toJSON` і `replacer`?
> *часто · код* · `js-04-016`
>
> - `undefined`, функції, Symbol як значення властивості — властивість пропускається; у масиві стають `null`; на верхньому рівні `JSON.stringify(undefined)` повертає `undefined`, а не рядок.
> - `NaN` і `±Infinity` → `null`; `BigInt` → `TypeError`.
> - Метод **`toJSON(key)`** викликається до серіалізації — так `Date` стає ISO-рядком.
> - **`replacer`**-функція `(key, value)` викликається після `toJSON`, з `this` = батьківський об'єкт (корінь — під ключем `''`); повернення `undefined` видаляє ключ. Масив замість функції — whitelist ключів.
> - Symbol-ключі й non-enumerable ігноруються, цикли кидають `TypeError`. Третій аргумент `space` форматує відступи.
>
> ```js
> const data = { id: 1n, secret: 'x', at: new Date(0), skip: undefined };
> JSON.stringify(data, (key, value) =>
>   key === 'secret' ? undefined
>     : typeof value === 'bigint' ? value.toString()
>     : value,
> );
> // '{"id":"1","at":"1970-01-01T00:00:00.000Z"}'
> ```
>
> Replacer встигає перетворити `BigInt` до перевірки типу, тому `TypeError` не виникає.
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація|Розділ: JSON, structuredClone і серіалізація]] · [MDN: JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) · [javascript.info: JSON methods, toJSON](https://javascript.info/json)

## 🔴 Senior

> [!question]- Як іммутабельно оновлювати вкладений state і які помилки при цьому трапляються в production?
> *часто · код* · `js-04-017`
>
> Immutable update — новий об'єкт на кожному рівні **шляху до зміни**, а все інше передається тими самими посиланнями (**structural sharing**). Тоді `===` на будь-якому рівні відповідає на питання «чи змінилось», і на цьому стоять `React.memo`, мемоізовані selectors, залежності `useEffect`.
>
> ```js
> function toggleTodo(state, listId, todoId) {
>   const list = state.lists[listId];
>   return {
>     ...state,
>     lists: {
>       ...state.lists,
>       [listId]: {
>         ...list,
>         todos: list.todos.map((t) => (t.id === todoId ? { ...t, done: !t.done } : t)),
>       },
>     },
>   };
> }
> ```
>
> Типові баги:
> - мутація всередині shallow copy: `const next = { ...state }; next.items.push(x)` — `items` спільний, UI оновлюється «через раз»;
> - `sort()`/`reverse()` на масиві зі state в selector-і чи render — мутують оригінал; потрібні `toSorted()`/`toReversed()`;
> - зайві нові посилання: selector, що щоразу повертає новий масив через `filter`, змушує компонент перерендерюватися навіть без змін;
> - `structuredClone` усього state «про всяк випадок» — дорого і ламає мемоізацію, бо всі посилання стають новими.
>
> Діагностика: `Object.freeze` у dev (або autoFreeze в Immer), щоб мутація падала з `TypeError` у strict mode. Три-чотири рівні spread-ів поспіль — сигнал нормалізувати state або взяти Immer.
>
> 📚 [[JavaScript - 03. Значення та посилання#📋 Копіювання: shallow vs deep|Розділ: shallow vs deep]] · [React: Updating Objects in State](https://react.dev/learn/updating-objects-in-state) · [Immer](https://immerjs.github.io/immer/)

> [!question]- Як порівнювати об'єкти і які trade-offs у reference, shallow і deep equality?
> *часто · порівняння* · `js-04-018`
>
> `===` і `Object.is` для об'єктів порівнюють посилання: `{ a: 1 } === { a: 1 }` — `false`. Варіанти:
>
> - **Reference equality** — O(1), але коректна лише для immutable-даних, де нове посилання означає зміну. Основа React і Redux.
> - **Shallow equal** — порівнює own ключі верхнього рівня через `Object.is`; O(кількість ключів). Використовується в `React.memo`, `shallowEqual` у react-redux.
> - **Deep equal** — рекурсивно; дорого, і треба обробити цикли, `NaN`, `-0`, `Date`, `Map`/`Set`, прототипи, sparse-масиви. Беруть готове: `util.isDeepStrictEqual` у Node, `dequal`, `fast-deep-equal`.
> - `JSON.stringify(a) === JSON.stringify(b)` — антипатерн: залежить від порядку ключів, губить `undefined`/`Map`, падає на циклах і `BigInt`.
>
> ```js
> function shallowEqual(a, b) {
>   if (Object.is(a, b)) return true;
>   if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
>   const keys = Object.keys(a);
>   if (keys.length !== Object.keys(b).length) return false;
>   return keys.every((k) => Object.hasOwn(b, k) && Object.is(a[k], b[k]));
> }
> ```
>
> Trade-off у production: deep equal у гарячому шляху (кожен render, кожне повідомлення з WebSocket) — часта причина CPU-спайків на великих даних. Краще зробити дані immutable і порівнювати посилання, або тримати `version`/hash, що оновлюється при зміні, і порівнювати його.
>
> 📚 [[JavaScript - 03. Значення та посилання#🟰 Порівняння об'єктів|Розділ: порівняння об'єктів]] · [MDN: Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness) · [MDN: Object.is()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

> [!question]- Як ефективно обробляти великі масиви даних (сотні тисяч і мільйони елементів)?
> *іноді · практика* · `js-04-019`
>
> Ланцюжок `filter().map().reduce()` читабельний, але кожен крок — окремий прохід і **проміжний масив**, тобто зайві алокації й навантаження на GC. На сотнях елементів це неважливо, на мільйонах — помітно.
>
> Підходи:
> - **Single pass**: один `for`-цикл, що фільтрує, трансформує й агрегує одночасно.
> - **Iterator helpers** (ES2025): `arr.values().filter(...).map(...).take(n)` — ліниво, без проміжних масивів; підтримуються в Node 22+ і сучасних браузерах.
> - **Typed arrays** (`Float64Array`, `Int32Array`) для числових даних: суцільна пам'ять фіксованого типу, у рази менше пам'яті, ніж масив об'єктів, і передача у Worker через transfer без копіювання.
> - Struct-of-arrays замість array-of-objects для колонкових обчислень.
> - Не блокувати main thread: обробка чанками з поверненням керування event loop або Web Worker.
> - Стабільні форми даних: не змішувати типи в одному масиві й не створювати holes — у V8 elements kind переходить до загальнішого (`PACKED_SMI` → `PACKED_DOUBLE` → `PACKED_ELEMENTS`) і назад не повертається.
>
> ```js
> let total = 0;
> for (const o of orders) {
>   if (o.status === 'paid') total += o.amount;
> }
>
> const amounts = new Float64Array(orders.length);
> for (let i = 0; i < orders.length; i++) amounts[i] = orders[i].amount;
> ```
>
> **На співбесіді:** починати з профайлера (Performance panel, `--cpu-prof`), а не з мікробенчмарків: часто вузьке місце — не цикл, а алокації чи рендер результату.
>
> 📚 [[JavaScript - 31. Продуктивність і V8|Розділ: продуктивність і V8]] · [V8: Elements kinds](https://v8.dev/blog/elements-kinds) · [MDN: JavaScript typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays)

> [!question]- Що втрачається при копіюванні об'єкта через spread або `Object.assign` і як зробити точну копію?
> *іноді · теорія* · `js-04-020`
>
> Обидва копіюють лише **own enumerable** властивості (рядкові й Symbol) і читають значення через `[[Get]]`: getter виконується, і в копію потрапляє його поточне значення, а не accessor. Втрачаються прототип (методи класу, `instanceof`), non-enumerable властивості, атрибути (`writable: false` стає `true`) і `#`-поля.
>
> Різниця — на стороні запису. `Object.assign` робить `[[Set]]` на target, тобто **викликає setter-и** target-а та його прототипів і може впасти на readonly-властивості. Spread створює властивості через define, setter-и не викликаються. Тому `Object.assign(instance, patch)` і `{ ...instance, ...patch }` — принципово різні операції.
>
> ```js
> class Temp {
>   #c = 0;
>   get f() { return this.#c * 1.8 + 32; }
> }
> const t = new Temp();
> ({ ...t });  // {} — getter на прототипі, #c не копіюється
>
> const src = Object.defineProperty({ a: 1 }, 'hidden', { value: 2 });
> const exact = Object.create(
>   Object.getPrototypeOf(src),
>   Object.getOwnPropertyDescriptors(src),
> );
> exact.hidden; // 2 — non-enumerable збережено
> ```
>
> `Object.create` + `getOwnPropertyDescriptors` дає точну shallow-копію: прототип, accessor-и, атрибути, non-enumerable, Symbol-ключі. Що не переноситься: `#`-поля та internal slots (так скопійований `Date` кине `TypeError` на `getTime()`), а також стан frozen/sealed/non-extensible.
>
> **На співбесіді:** для оновлення екземплярів класів у state це аргумент проти spread: `{ ...entity }` мовчки перетворює модель на plain object без методів, і помилка вилазить далеко від місця копіювання.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко|Розділ: обʼєкти глибоко]] · [MDN: Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) · [javascript.info: Property flags and descriptors](https://javascript.info/property-descriptors)

## 🟣 Tech Lead

> [!question]- Яку форму state обрати для даних застосунку і коли нормалізація себе виправдовує?
> *іноді · практика* · `js-04-021`
>
> Нормалізація: кожна сутність зберігається **один раз** у таблиці `byId`, зв'язки — через ID, порядок — окремим масивом `ids`. Фактично реляційна модель на клієнті.
>
> ```js
> const state = {
>   users: { byId: { u1: { id: 'u1', name: 'Ann' } }, ids: ['u1'] },
>   posts: {
>     byId: { p1: { id: 'p1', authorId: 'u1', commentIds: ['c1'] } },
>     ids: ['p1'],
>   },
>   comments: { byId: { c1: { id: 'c1', text: 'ok' } }, ids: ['c1'] },
> };
> ```
>
> Вигоди:
> - сутність оновлюється в одному місці — немає розсинхрону копій (автор у списку постів і в профілі);
> - O(1) доступ за ID і неглибокі immutable-оновлення;
> - перерендерюються лише компоненти, підписані на змінену сутність.
>
> Ціна:
> - денормалізація в selectors, яка без мемоізації (`createSelector`) щоразу повертає нові масиви і ламає `React.memo`;
> - код нормалізації відповідей API і каскадне прибирання посилань при видаленні;
> - `ids` обов'язковий, бо числові ключі в `byId` перевпорядковуються.
>
> Рішення лідера: не нормалізувати все підряд. Серверний стан краще віддати бібліотеці кешування (TanStack Query, RTK Query; Apollo нормалізує сам), а вручну нормалізувати клієнтські дані, де одна сутність показується в кількох місцях і редагується. У Redux Toolkit для цього є `createEntityAdapter`. `Map` зручний для колекцій, але не серіалізується в Redux DevTools і persist без додаткової обробки — у store зазвичай тримають plain objects.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [React: Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) · [Redux: Normalizing State Shape](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)

> [!question]- Як обрати підхід до immutable-оновлень для команди: ручний spread чи Immer?
> *часто · порівняння* · `js-04-022`
>
> **Ручний spread**: нуль залежностей, явні копії, повний контроль structural sharing. Але на 3+ рівнях вкладеності код стає шумним, а головний ризик — випадкова мутація (`push` у shallow copy), яку легко пропустити на review.
>
> **Immer**: пишеш «мутуючий» код над draft (Proxy), отримуєш новий immutable-стан зі structural sharing; незмінені гілки зберігають посилання, а autoFreeze ловить мутації результату. Вбудований у `createSlice` Redux Toolkit, є `useImmer` і middleware для Zustand.
>
> Trade-offs Immer:
> - продуктивність: накладні витрати Proxy; у гарячих циклах із тисячами оновлень і на великих масивах у draft ручний код помітно швидший;
> - ментальна модель: producer або мутує draft, або повертає новий об'єкт — не обидва; draft стає revoked після завершення producer-а, тож асинхронний код з ним ламається;
> - екземпляри класів потребують `[immerable]`; `console.log(draft)` показує Proxy — треба `current(draft)`.
>
> Рекомендація для команди:
> - пласкі чи нормалізовані стани — spread плюс ES2023-методи (`toSorted`, `with`, `toSpliced`) і `Readonly<T>`/`ReadonlyArray` у TypeScript, які ловлять мутації на етапі компіляції;
> - глибокі редаговані структури (форми, редактори документів) і Redux — Immer;
> - один підхід на шар, закріплений у lint: `no-param-reassign` з `props: true` і винятком `ignorePropertyModificationsFor: ['draft']`.
>
> Головне — не змішувати підходи в одному reducer: половина коду з мутаціями draft, половина зі spread, стає нечитабельною і провокує помилки.
>
> 📚 [[JavaScript - 03. Значення та посилання#📋 Копіювання: shallow vs deep|Розділ: shallow vs deep]] · [Immer](https://immerjs.github.io/immer/) · [React: Updating Objects in State](https://react.dev/learn/updating-objects-in-state)

## Тести

> [!quiz] Який із методів НЕ мутує вихідний масив?
> level: junior · id: js-04-quiz-01
> - [ ] `sort`
> - [ ] `reverse`
> - [x] `toSorted`
> - [ ] `splice`
>
> **Пояснення:** `toSorted` (ES2023) повертає новий відсортований масив. `sort`, `reverse` і `splice` змінюють масив на місці.

> [!quiz] Що поверне `Object.keys({ b: 1, 2: 'x', a: 2, 1: 'y' })`?
> level: middle · id: js-04-quiz-02
> - [ ] `['b', '2', 'a', '1']`
> - [x] `['1', '2', 'b', 'a']`
> - [ ] `['b', 'a', '1', '2']`
> - [ ] `['1', '2', 'a', 'b']`
>
> **Пояснення:** спершу йдуть integer-like ключі за зростанням, потім рядкові ключі в порядку додавання. Алфавітного сортування рядкових ключів немає.

> [!quiz] Оберіть усі правильні: на яких значеннях `structuredClone` кине `DataCloneError`?
> level: middle · type: multi · id: js-04-quiz-03
> - [x] `{ fn: () => 1 }`
> - [x] `Symbol('id')`
> - [ ] `new Map([[1, { a: 1 }]])`
> - [ ] об'єкт із циклічним посиланням на самого себе
>
> **Пояснення:** structured clone algorithm не вміє клонувати функції та Symbol. `Map` і циклічні посилання підтримуються — саме в цьому його перевага над `JSON`.

> [!quiz] Що виведе код?
> level: middle · type: output · id: js-04-quiz-04
>
> ```js
> console.log(JSON.stringify({
>   a: undefined,
>   b: () => 1,
>   c: [undefined, NaN],
>   d: new Date(0),
> }));
> ```
>
> - [x] `{"c":[null,null],"d":"1970-01-01T00:00:00.000Z"}`
> - [ ] `{"a":null,"b":null,"c":[null,null],"d":"1970-01-01T00:00:00.000Z"}`
> - [ ] `{"c":[null,"NaN"],"d":{}}`
> - [ ] `{"c":[],"d":"1970-01-01T00:00:00.000Z"}`
>
> **Пояснення:** властивості зі значенням `undefined` або функцією пропускаються, а в масиві такі значення і `NaN` стають `null`, щоб зберегти індекси. `Date` серіалізується через `toJSON` в ISO-рядок.

> [!quiz] Що виведе код?
> level: senior · type: output · id: js-04-quiz-05
>
> ```js
> let n = 0;
> [1, , 3].forEach(() => n++);
> const m = Array.from([1, , 3]).filter((x) => x === undefined).length;
> console.log(n, [1, , 3].indexOf(undefined), m);
> ```
>
> - [ ] `3 1 1`
> - [x] `2 -1 1`
> - [ ] `2 1 0`
> - [ ] `3 -1 0`
>
> **Пояснення:** `forEach` та `indexOf` пропускають holes, тому callback виконується двічі, а `undefined` не знаходиться. `Array.from` перетворює hole на справжній `undefined`, і `filter` його бачить.

## Задачі

> [!task] Реалізуй `flatten(arr, depth = 1)`
> level: middle · difficulty: easy · id: js-04-task-01 · tags: arrays, recursion
>
> Умова: напиши `flatten(arr, depth = 1)`, що поводиться як `Array.prototype.flat`, без використання `flat`/`flatMap`. Розплющуються лише справжні масиви (`Array.isArray`), holes видаляються, `depth = Infinity` розплющує повністю, вихідний масив не мутується. Приклад: `flatten([1, [2, [3, [4]]], , 5], 2)` повертає `[1, 2, 3, [4], 5]`.
>
> > [!hint]- Підказка 1
> > Рекурсивно обходь масив, передаючи залишок глибини; коли вона дійде до 0, елемент додається як є.
>
> > [!hint]- Підказка 2
> > Hole — це індекс, якого немає в масиві: перевіряй `i in list`, а не `list[i] === undefined`.
>
> > [!hint]- Підказка 3
> > Збирай результат в один зовнішній масив через `push`, а не через `concat` на кожному рівні — так немає зайвих алокацій. `Infinity - 1 === Infinity`, тому окремий випадок не потрібен.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function flatten(arr, depth = 1) {
> >   const result = [];
> >   const walk = (list, d) => {
> >     for (let i = 0; i < list.length; i++) {
> >       if (!(i in list)) continue;
> >       const item = list[i];
> >       if (Array.isArray(item) && d > 0) walk(item, d - 1);
> >       else result.push(item);
> >     }
> >   };
> >   walk(arr, depth);
> >   return result;
> > }
> >
> > flatten([1, [2, [3, [4]]], , 5], 2); // [1, 2, 3, [4], 5]
> > flatten([[1, [2]], [[[3]]]], Infinity); // [1, 2, 3]
> > ```
> >
> > Кожен елемент відвідується один раз, тож складність O(n) за загальною кількістю елементів на всіх рівнях. Рекурсія обмежена глибиною вкладеності: для даних із десятками тисяч рівнів можна отримати `RangeError: Maximum call stack size exceeded` — тоді переходять на ітеративний обхід з явним стеком.

> [!task] Реалізуй `deepClone` з підтримкою циклів
> level: senior · difficulty: hard · id: js-04-task-02 · tags: objects, recursion, weakmap
>
> Умова: напиши `deepClone(value)`, що глибоко копіює примітиви, plain objects, масиви (зі збереженням holes), `Date`, `RegExp`, `Map` і `Set`. Циклічні та спільні посилання мають зберігати свою структуру в копії, прототип об'єктів має зберігатися, копіюються власні enumerable рядкові й Symbol-ключі, а функції повертаються за посиланням. Приклад: для `const a = { list: [1, 2] }; a.self = a; a.alias = a.list;` результат `c` задовольняє `c.self === c`, `c.alias === c.list`, `c.list !== a.list`.
>
> > [!hint]- Підказка 1
> > Для циклів і спільних посилань тримай мапу «оригінал → копія» і перевіряй її перед копіюванням. Яка структура не заважатиме GC?
>
> > [!hint]- Підказка 2
> > Реєструй копію в мапі до рекурсивного обходу її дітей — інакше цикл потрапить у нескінченну рекурсію.
>
> > [!hint]- Підказка 3
> > Для об'єктів створюй копію через `Object.create(Object.getPrototypeOf(value))`, ключі бери з `Reflect.ownKeys` з фільтром `propertyIsEnumerable`. Записуй через `Object.defineProperty`, а не присвоєнням — власний ключ `'__proto__'` інакше змінить прототип копії.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function deepClone(value, seen = new WeakMap()) {
> >   if (value === null || typeof value !== 'object') return value;
> >   if (seen.has(value)) return seen.get(value);
> >
> >   if (value instanceof Date) return new Date(value.getTime());
> >   if (value instanceof RegExp) {
> >     const re = new RegExp(value.source, value.flags);
> >     re.lastIndex = value.lastIndex;
> >     return re;
> >   }
> >   if (value instanceof Map) {
> >     const out = new Map();
> >     seen.set(value, out);
> >     for (const [k, v] of value) out.set(deepClone(k, seen), deepClone(v, seen));
> >     return out;
> >   }
> >   if (value instanceof Set) {
> >     const out = new Set();
> >     seen.set(value, out);
> >     for (const v of value) out.add(deepClone(v, seen));
> >     return out;
> >   }
> >
> >   const out = Array.isArray(value)
> >     ? new Array(value.length)
> >     : Object.create(Object.getPrototypeOf(value));
> >   seen.set(value, out);
> >   for (const key of Reflect.ownKeys(value)) {
> >     if (!Object.prototype.propertyIsEnumerable.call(value, key)) continue;
> >     Object.defineProperty(out, key, {
> >       value: deepClone(value[key], seen),
> >       writable: true,
> >       enumerable: true,
> >       configurable: true,
> >     });
> >   }
> >   return out;
> > }
> >
> > const a = { list: [1, , 3], at: new Date(0), tags: new Set(['x']) };
> > a.self = a;
> > a.alias = a.list;
> > const c = deepClone(a);
> > c.self === c;           // true
> > c.alias === c.list;     // true
> > c.list !== a.list;      // true
> > 1 in c.list;            // false — hole збережено
> > ```
> >
> > `WeakMap` гарантує, що кожен вузол графа копіюється рівно один раз, тому цикли і спільні посилання відтворюються, а складність — O(вузли + ребра). `length` масиву non-enumerable і пропускається, а `new Array(length)` зберігає holes. Getter-и копіюються як значення, `#`-поля, internal slots інших вбудованих типів (typed arrays, `Error`) і non-enumerable властивості не переносяться; дуже глибокі структури впруться в ліміт стеку — як і з рекурсивним `flatten`.
