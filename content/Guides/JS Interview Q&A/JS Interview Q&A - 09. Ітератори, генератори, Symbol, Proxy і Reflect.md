---
title: Ітератори, генератори, Symbol, Proxy/Reflect
order: 9
tags: [iterators, generators, symbol, proxy, metaprogramming]
estimatedMinutes: 75
---

# JS Interview Q&A — 09. Ітератори, генератори, Symbol, Proxy/Reflect

## 🟢 Junior

> [!question]- Що таке протокол ітерації та iterable в JavaScript?
> *дуже часто · теорія* · `js-09-001`
>
> **Iterable** — об'єкт, у якого є метод `[Symbol.iterator]()`, що повертає **iterator**. Iterator — об'єкт із методом `next()`, який щоразу повертає `{ value, done }`. Коли `done: true`, послідовність закінчилась.
>
> Цей протокол використовують `for..of`, spread `[...x]`, деструктуризація масивом, `Array.from`, `new Map(iterable)`, `Promise.all`. Вбудовані iterable: `Array`, `String`, `Map`, `Set`, typed arrays, `arguments`, `NodeList`.
>
> ```js
> const arr = [10, 20];
> const it = arr[Symbol.iterator]();
> it.next(); // { value: 10, done: false }
> it.next(); // { value: 20, done: false }
> it.next(); // { value: undefined, done: true }
> ```
>
> **На співбесіді:** розділяй два протоколи: iterable (має `Symbol.iterator`) та iterator (має `next`). Звичайний об'єкт `{}` не iterable — `for..of` по ньому кидає `TypeError`.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Протоколи ітерації|Розділ: протоколи ітерації]] · [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) · [javascript.info: Iterables](https://javascript.info/iterable)

> [!question]- Яка різниця між `for..of` і `for..in`?
> *дуже часто · порівняння* · `js-09-002`
>
> `for..in` перебирає **ключі** — enumerable string-властивості об'єкта, включно з успадкованими через prototype chain. `for..of` перебирає **значення**, які віддає iterator із `Symbol.iterator`.
>
> - `for..in` працює на будь-якому об'єкті, але по масиву дає індекси рядками (`'0'`, `'1'`) і може зачепити сторонні властивості.
> - `for..of` працює лише з iterable; на звичайному об'єкті — `TypeError`.
> - Symbol-ключі `for..in` пропускає.
>
> ```js
> const arr = ['a', 'b'];
> arr.extra = 'x';
> for (const k in arr) console.log(k); // '0', '1', 'extra'
> for (const v of arr) console.log(v); // 'a', 'b'
>
> const obj = { a: 1, b: 2 };
> for (const [k, v] of Object.entries(obj)) console.log(k, v);
> ```
>
> **На співбесіді:** для об'єктів — `Object.keys`/`Object.entries` + `for..of`; `for..in` по масивах не використовують.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Протоколи ітерації|Розділ: протоколи ітерації]] · [MDN: for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) · [MDN: for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)

> [!question]- Чим iterable відрізняється від array-like об'єкта?
> *часто · порівняння* · `js-09-003`
>
> **Array-like** — об'єкт із числовими індексами та `length` (`arguments`, `{ 0: 'a', length: 1 }`). **Iterable** — об'єкт із `Symbol.iterator`. Це незалежні властивості: рядок і `NodeList` є обома, `Set` — лише iterable, `{ length: 2 }` — лише array-like.
>
> Практична різниця: spread і `for..of` вимагають iterable, а `Array.from` вміє обидва (спершу шукає `Symbol.iterator`, інакше читає `length`).
>
> ```js
> const arrayLike = { 0: 'a', 1: 'b', length: 2 };
> Array.from(arrayLike);                      // ['a', 'b']
> [...arrayLike];                             // TypeError: arrayLike is not iterable
> Array.from(new Set([1, 2]));                // [1, 2]
> Array.from({ length: 3 }, (_, i) => i * 2); // [0, 2, 4]
> ```
>
> **На співбесіді:** ні array-like, ні більшість iterable не мають `map`/`filter` — спершу перетворюють через `Array.from`.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Протоколи ітерації|Розділ: протоколи ітерації]] · [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) · [MDN: Array.from()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)

> [!question]- Що таке генератор і як працює `yield`?
> *дуже часто · код* · `js-09-004`
>
> Генератор — функція `function*`, виклик якої не виконує тіло, а повертає **generator object** — одночасно iterator та iterable. Кожен `next()` запускає тіло до наступного `yield`, віддає `{ value, done: false }` і ставить виконання на паузу, зберігаючи локальні змінні. `return` або кінець функції дає `done: true`.
>
> ```js
> function* counter() {
>   console.log('start');
>   yield 1;
>   yield 2;
>   return 'end';
> }
>
> const g = counter(); // тіло ще не виконувалось
> g.next();            // лог 'start' → { value: 1, done: false }
> g.next();            // { value: 2, done: false }
> g.next();            // { value: 'end', done: true }
> [...counter()];      // [1, 2] — значення з return ігнорується
> ```
>
> **На співбесіді:** генератор — спосіб написати iterator без ручного `next()` і state-машини; значення з `return` не потрапляє у `for..of` і spread.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Генератори: функції, що вміють ставати на паузу|Розділ: генератори]] · [MDN: Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) · [javascript.info: Generators](https://javascript.info/generators)

> [!question]- Що таке `Symbol` і навіщо він потрібен?
> *часто · теорія* · `js-09-005`
>
> `Symbol` — примітивний тип, кожне значення якого унікальне: `Symbol('id') !== Symbol('id')`. Опис потрібен лише для дебагу. Основне призначення — ключі властивостей, які гарантовано не конфліктують з іншими.
>
> - Symbol-ключі не видно у `for..in`, `Object.keys`, `JSON.stringify`.
> - Їх видно через `Object.getOwnPropertySymbols` і `Reflect.ownKeys` — тож це не приватність.
> - Через well-known symbols (`Symbol.iterator` тощо) мова дає хуки для кастомізації поведінки.
>
> ```js
> const id = Symbol('id');
> const user = { name: 'Ann', [id]: 42 };
> Object.keys(user);    // ['name']
> JSON.stringify(user); // '{"name":"Ann"}'
> user[id];             // 42
> typeof id;            // 'symbol'
> `${id}`;              // TypeError: Cannot convert a Symbol value to a string
> ```
>
> **На співбесіді:** `new Symbol()` кидає `TypeError`; для рядка — `String(sym)` або `sym.description`.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect|Розділ: Symbol, Proxy і Reflect]] · [MDN: Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) · [javascript.info: Symbol type](https://javascript.info/symbol)

## 🟡 Middle

> [!question]- Як зробити власний клас iterable?
> *часто · код* · `js-09-006`
>
> Потрібно реалізувати метод `[Symbol.iterator]()`, що повертає iterator. Найкоротше — оголосити його генератором: тоді `next`, `done` і закриття ітератора реалізує рушій.
>
> ```js
> class Range {
>   constructor(from, to, step = 1) {
>     this.from = from;
>     this.to = to;
>     this.step = step;
>   }
>
>   *[Symbol.iterator]() {
>     for (let v = this.from; v <= this.to; v += this.step) yield v;
>   }
> }
>
> const r = new Range(1, 5, 2);
> [...r];         // [1, 3, 5]
> [...r];         // [1, 3, 5] — можна обходити повторно
> Math.max(...r); // 5
> ```
>
> Кожен виклик `[Symbol.iterator]()` створює новий генератор, тож об'єкт можна обходити багато разів і навіть паралельно. Якщо ж метод повертає `this` (як роблять самі iterator-и), об'єкт одноразовий: після першого проходу він вичерпаний.
>
> Ручна реалізація — повернути `{ next() { ... } }` із замиканням на поточний стан; варто додати й `return()`, якщо при `break` треба звільняти ресурси.
>
> **На співбесіді:** розрізняй re-iterable колекцію (`Array`, `Set`, `Range`) і одноразовий iterator (generator object, `arr.values()`).
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Протоколи ітерації|Розділ: протоколи ітерації]] · [MDN: Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) · [javascript.info: Iterables](https://javascript.info/iterable)

> [!question]- Що відбувається з генератором при `break` у `for..of`, і як працюють `return()` та `throw()`?
> *часто · код* · `js-09-007`
>
> При достроковому виході з `for..of` (`break`, `return`, виняток) рушій викликає `iterator.return()`. У генераторі це працює як `return` у точці паузи: виконуються блоки `finally`, генератор завершується. Так закривають ресурси — файли, з'єднання, підписки.
>
> - `gen.return(v)` — завершує генератор і повертає `{ value: v, done: true }` після виконання `finally`.
> - `gen.throw(err)` — кидає помилку в точці `yield`. Якщо генератор її перехопить, він продовжить роботу до наступного `yield`; інакше помилка вилетить назовні, а генератор завершиться.
>
> ```js
> function* reader() {
>   try {
>     yield 'line 1';
>     yield 'line 2';
>   } finally {
>     console.log('close file');
>   }
> }
>
> for (const line of reader()) {
>   console.log(line);
>   break;
> }
> // 'line 1', 'close file'
>
> const g = reader();
> g.next();
> g.throw(new Error('boom')); // 'close file', потім Error: boom
> ```
>
> **На співбесіді:** деструктуризація `const [first] = gen()` теж викликає `return()`, а spread — ні, бо вичерпує ітератор до кінця. Ручні ітератори без методу `return` жодного cleanup не отримають.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Хто споживає ітерабли і коли викликається return()|Розділ: споживачі ітераблів]] · [MDN: Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) · [Spec: IteratorClose](https://tc39.es/ecma262/#sec-iteratorclose)

> [!question]- Що робить `yield*` і як передати значення в генератор через `next(arg)`?
> *іноді · код* · `js-09-008`
>
> `yield*` делегує ітерацію іншому iterable: генератор по черзі віддає всі його значення і прокидає туди `next`, `throw` і `return`. Результат виразу `yield* inner()` — значення, яке `inner` повернув через `return`.
>
> `next(arg)` передає значення всередину: воно стає результатом того `yield`, на якому генератор стояв на паузі. Аргумент першого `next()` ігнорується, бо паузи ще не було.
>
> ```js
> function* inner() {
>   yield 'a';
>   return 'inner done';
> }
>
> function* outer() {
>   const res = yield* inner();
>   yield res;
>   yield* [1, 2];
> }
> [...outer()]; // ['a', 'inner done', 1, 2]
>
> function* dialog() {
>   const name = yield 'Як тебе звати?';
>   yield `Привіт, ${name}`;
> }
> const d = dialog();
> d.next().value;      // 'Як тебе звати?'
> d.next('Ann').value; // 'Привіт, Ann'
> ```
>
> **На співбесіді:** двосторонній обмін через `next(arg)` — основа корутин. Саме так бібліотеки (`co`, redux-saga) емулювали `async/await`: генератор віддає Promise, раннер чекає на нього і повертає результат через `next`.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Двосторонній зв'язок: next(value), return(), throw()|Розділ: двосторонній зв'язок]] · [MDN: yield\*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*) · [MDN: Generator.prototype.next()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/next)

> [!question]- Що таке lazy sequences та нескінченні генератори, і коли вони кращі за масиви?
> *часто · практика* · `js-09-009`
>
> Генератор обчислює наступне значення лише тоді, коли його запросять через `next()`. Це дозволяє описати послідовність без матеріалізації в пам'яті — навіть нескінченну — і зупинитися, щойно отримано потрібне.
>
> ```js
> function* naturals() {
>   let n = 1;
>   while (true) yield n++;
> }
>
> function* map(iter, fn) {
>   for (const x of iter) yield fn(x);
> }
>
> function* filter(iter, pred) {
>   for (const x of iter) if (pred(x)) yield x;
> }
>
> function first(iter, n) {
>   const out = [];
>   if (n <= 0) return out;
>   for (const x of iter) {
>     out.push(x);
>     if (out.length === n) break;
>   }
>   return out;
> }
>
> first(filter(map(naturals(), (x) => x * x), (x) => x % 2), 3); // [1, 9, 25]
> ```
>
> Коли вигідно:
> - великі або потокові дані (рядки логів, сторінки API), які не треба тримати цілком;
> - ранній вихід: пошук першого збігу не обчислює решту;
> - конвеєр трансформацій без проміжних масивів, які створює `arr.map().filter()`.
>
> Коли ні: малі масиви, довільний доступ за індексом, сортування, повторний прохід — ітератор одноразовий, а виклик генератора на кожен елемент дорожчий за простий цикл.
>
> **На співбесіді:** `[...naturals()]` зависне назавжди — нескінченну послідовність завжди обмежують через `take` або `break`.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Ліниві й нескінченні послідовності|Розділ: ліниві послідовності]] · [MDN: Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators) · [javascript.info: Generators](https://javascript.info/generators)

> [!question]- Які well-known symbols ти знаєш і що вони змінюють?
> *часто · теорія* · `js-09-010`
>
> Well-known symbols — вбудовані символи-хуки, через які можна перевизначити поведінку мови для конкретного об'єкта. Вони живуть як статичні властивості `Symbol`, і рушій сам звертається до них під час відповідних операцій.
>
> - `Symbol.iterator` / `Symbol.asyncIterator` — як ітерувати в `for..of` / `for await..of`.
> - `Symbol.toPrimitive` — приведення до примітиву; отримує hint `'number'`, `'string'` або `'default'`.
> - `Symbol.toStringTag` — що покаже `Object.prototype.toString`.
> - `Symbol.hasInstance` — кастомна логіка `instanceof`.
> - Рідше: `Symbol.species`, `Symbol.isConcatSpreadable`, `Symbol.match`/`replace`/`split`, `Symbol.unscopables`.
>
> ```js
> class Money {
>   constructor(amount, currency) {
>     this.amount = amount;
>     this.currency = currency;
>   }
>   [Symbol.toPrimitive](hint) {
>     return hint === 'number' ? this.amount : `${this.amount} ${this.currency}`;
>   }
>   get [Symbol.toStringTag]() {
>     return 'Money';
>   }
>   static [Symbol.hasInstance](x) {
>     return typeof x?.amount === 'number' && typeof x?.currency === 'string';
>   }
> }
>
> const m = new Money(10, 'EUR');
> +m;                                                // 10
> `${m}`;                                            // '10 EUR'
> m + 1;                                             // '10 EUR1' — hint 'default'
> Object.prototype.toString.call(m);                 // '[object Money]'
> ({ amount: 1, currency: 'USD' }) instanceof Money; // true
> ```
>
> **На співбесіді:** `Symbol.hasInstance` і `Symbol.species` ламають очікування читача коду; у продакшені зазвичай трапляються лише `iterator`, `asyncIterator`, `toPrimitive` і `toStringTag`.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect|Розділ: Symbol, Proxy і Reflect]] · [MDN: Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) · [Spec: Well-Known Symbols](https://tc39.es/ecma262/#sec-well-known-symbols)

> [!question]- Чим `Symbol()` відрізняється від `Symbol.for()`?
> *іноді · порівняння* · `js-09-011`
>
> `Symbol('key')` щоразу створює новий унікальний символ. `Symbol.for('key')` звертається до **глобального реєстру символів**: повертає вже зареєстрований символ із цим ключем або створює й реєструє новий. Тож два виклики `Symbol.for('app.id')` повертають той самий символ — у різних модулях, копіях пакета і навіть в iframe (реєстр спільний для всіх realm-ів).
>
> ```js
> Symbol('a') === Symbol('a');         // false
> Symbol.for('a') === Symbol.for('a'); // true
> Symbol.keyFor(Symbol.for('a'));      // 'a'
> Symbol.keyFor(Symbol('a'));          // undefined
> ```
>
> Коли що брати:
> - `Symbol()` — приватний для модуля ключ, який ніхто ззовні випадково не відтворить.
> - `Symbol.for()` — протокол між незалежними копіями коду. React маркує елементи через `$$typeof: Symbol.for('react.transitional.element')` (до React 19 — `'react.element'`): маркер розпізнається між realm-ами, а JSON із сервера не може його підробити, що захищає від XSS.
>
> **На співбесіді:** зареєстровані символи не можна використовувати як ключі `WeakMap`/`WeakRef` (з ES2023 дозволені лише незареєстровані символи) — вони живуть вічно і ніколи не будуть зібрані GC.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect|Розділ: Symbol, Proxy і Reflect]] · [MDN: Symbol.for()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) · [javascript.info: Symbol type](https://javascript.info/symbol)

> [!question]- Що таке `Proxy` і які traps використовують найчастіше?
> *часто · теорія* · `js-09-012`
>
> `Proxy` обгортає об'єкт (target) і перехоплює фундаментальні операції над ним через функції-**traps** у handler. Якщо trap не визначено, операція йде прямо в target. Усього 13 traps — по одному на кожен внутрішній метод об'єкта.
>
> - `get` / `set` — читання і запис властивостей;
> - `has` — оператор `in`;
> - `deleteProperty` — `delete`;
> - `ownKeys` — `Object.keys`, `for..in`, `Reflect.ownKeys`;
> - `apply` / `construct` — виклик функції та `new` (target має бути функцією).
>
> Типовий приклад — валідація:
>
> ```js
> const user = new Proxy({}, {
>   set(target, key, value, receiver) {
>     if (key === 'age' && (!Number.isInteger(value) || value < 0)) {
>       throw new TypeError(`Invalid age: ${value}`);
>     }
>     return Reflect.set(target, key, value, receiver);
>   },
> });
>
> user.age = 30; // ок
> user.age = -1; // TypeError: Invalid age: -1
> ```
>
> `Proxy.revocable(target, handler)` повертає `{ proxy, revoke }`; після `revoke()` будь-яка операція з proxy кидає `TypeError`. Так видають сторонньому коду тимчасовий доступ до об'єкта.
>
> **На співбесіді:** `set` має повертати `true`; `false` у strict mode (модулі, класи) перетворюється на `TypeError`. І пам'ятай: `proxy !== target`.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect|Розділ: Symbol, Proxy і Reflect]] · [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) · [javascript.info: Proxy and Reflect](https://javascript.info/proxy)

> [!question]- Що таке `Reflect` і чому його використовують разом із `Proxy`?
> *часто · теорія* · `js-09-013`
>
> `Reflect` — об'єкт зі статичними методами, що один до одного відповідають 13 traps: `Reflect.get`, `Reflect.set`, `Reflect.has`, `Reflect.ownKeys` тощо. Вони виконують стандартну поведінку операції, тому в trap найпростіше зробити «свою логіку + дефолт».
>
> Переваги перед ручним `target[key]`:
> - **receiver**: `Reflect.get(target, key, receiver)` викликає getter із правильним `this` — proxy або спадкоємцем, а не голим target;
> - методи повертають `boolean` замість винятку (`Reflect.defineProperty` vs `Object.defineProperty`), що збігається з контрактом traps;
> - сигнатури симетричні traps: аргументи можна прокинути як є.
>
> ```js
> const target = {
>   _name: 'raw',
>   get name() { return this._name; },
> };
>
> const handler = (useReflect) => ({
>   get(t, key, receiver) {
>     if (key === '_name') return 'proxied';
>     return useReflect ? Reflect.get(t, key, receiver) : t[key];
>   },
> });
>
> new Proxy(target, handler(false)).name; // 'raw' — this = target, trap обійдено
> new Proxy(target, handler(true)).name;  // 'proxied' — this = proxy
> ```
>
> **На співбесіді:** без receiver ламаються getters, успадкування від proxy (`Object.create(proxy)`) і reactivity-системи, яким треба відстежити доступ усередині getter.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect|Розділ: Symbol, Proxy і Reflect]] · [MDN: Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) · [javascript.info: Proxy and Reflect](https://javascript.info/proxy)

## 🔴 Senior

> [!question]- Як працюють async generators і `for await..of`, і де вони доречні?
> *часто · код* · `js-09-014`
>
> `async function*` поєднує генератор і async-функцію: всередині можна `await`, а `next()` повертає `Promise<{ value, done }>`. Об'єкт реалізує `Symbol.asyncIterator`, тож його споживають через `for await..of`, який чекає кожен крок послідовно.
>
> Модель **pull-based**: наступна порція не завантажується, поки споживач її не попросив. Це природний backpressure — на відміну від event emitter, що «штовхає» дані незалежно від швидкості обробки.
>
> ```js
> async function* fetchPages(url) {
>   let next = url;
>   while (next) {
>     const res = await fetch(next);
>     if (!res.ok) throw new Error(`HTTP ${res.status}`, { cause: next });
>     const body = await res.json();
>     yield* body.items;
>     next = body.nextPage;
>   }
> }
>
> for await (const order of fetchPages('/api/orders?page=1')) {
>   if (order.total > 1000) break; // return(): решта сторінок не вантажиться
>   handleOrder(order);
> }
> ```
>
> Де доречно: пагінація API, Node streams (вони async iterable: `for await (const chunk of readable)`), обгортки над SSE/WebSocket, черги задач.
>
> Нюанси:
> - кроки строго послідовні — для паралелізму потрібен окремий механізм (наприклад, prefetch сторінки N+1, поки обробляється N);
> - `yield*` в async generator делегує і sync, і async iterable;
> - `for await` над масивом промісів працює, але якщо пізніший проміс відхилиться, поки чекаємо на ранній, його rejection стане unhandled (у Node — падіння процесу).
>
> **На співбесіді:** `break` у `for await` викликає `return()` і запускає `finally` генератора — там закривають з'єднання або викликають `abort()` на `AbortController`.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Async-ітератори та async-генератори|Розділ: async-генератори]] · [MDN: AsyncGenerator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator) · [javascript.info: Async iteration and generators](https://javascript.info/async-iterators-generators)

> [!question]- Що таке Iterator helpers (ES2025) і чим вони відрізняються від методів масиву?
> *іноді · порівняння* · `js-09-015`
>
> ES2025 додав методи на `Iterator.prototype`: `map`, `filter`, `take`, `drop`, `flatMap`, `reduce`, `toArray`, `forEach`, `some`, `every`, `find`, а також статичний `Iterator.from`. Підтримка: Chrome 122+, Node 22+, Firefox 131+, Safari 18.4+.
>
> Ключові відмінності від `Array.prototype`:
> - **лінивість**: `map`/`filter`/`take` повертають новий iterator і нічого не обчислюють до запиту; проміжних масивів немає;
> - **одноразовість**: пройшов раз — вичерпано;
> - працюють із нескінченними послідовностями; `take(n)` після n-го елемента закриває джерело через `return()`;
> - `reduce`, `toArray`, `some`, `find` — термінальні, вони споживають ітератор.
>
> ```js
> function* naturals() {
>   let n = 1;
>   while (true) yield n++;
> }
>
> naturals()
>   .filter((n) => n % 3 === 0)
>   .map((n) => n * n)
>   .take(3)
>   .toArray(); // [9, 36, 81]
>
> const m = new Map([['a', 1], ['b', 2]]);
> m.values().reduce((s, v) => s + v, 0); // 3
>
> const custom = { i: 0, next() { return { value: this.i++, done: this.i > 3 }; } };
> Iterator.from(custom).toArray(); // [0, 1, 2]
> ```
>
> Методи є лише в об'єктів, що наслідують `Iterator.prototype`: генераторів, `arr.values()`, `map.entries()`. У масиву є власні жадібні `map`/`filter`; ліниву версію отримують через `arr.values().map(...)`. Саморобний `{ next() {} }` треба обгорнути в `Iterator.from`.
>
> **На співбесіді:** async-версій (для async iterator) у стандарті ще немає — це окрема пропозиція; для потоків досі потрібні власні утиліти або бібліотеки.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Ліниві й нескінченні послідовності|Розділ: iterator helpers]] · [MDN: Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator) · [V8: Iterator helpers](https://v8.dev/features/iterator-helpers)

> [!question]- Що таке інваріанти Proxy і чому деякі об'єкти не вдається коректно обгорнути?
> *рідко · теорія* · `js-09-016`
>
> **Інваріанти** — правила, які рушій перевіряє після виконання trap, щоб proxy не міг «збрехати» про незмінні властивості target. Порушення — `TypeError`. Приклади:
>
> - `get`: для non-configurable і non-writable властивості trap має повернути саме те значення, що в target;
> - `has` / `ownKeys`: не можна приховати non-configurable властивість; для non-extensible target `ownKeys` має повернути точно його ключі;
> - `deleteProperty`: не можна повідомити про видалення non-configurable властивості;
> - `getPrototypeOf`: для non-extensible target — лише справжній прототип.
>
> ```js
> const frozen = Object.freeze({ role: 'user' });
> const p = new Proxy(frozen, { get: () => 'admin' });
> p.role; // TypeError: 'get' on proxy: property 'role' is a read-only and non-configurable...
> ```
>
> Друга проблема — **internal slots** і приватні поля. Методи `Map`, `Set`, `Date`, `Promise` перевіряють внутрішні слоти в `this`, а в proxy їх немає. Так само `#private` перевіряє brand саме цього об'єкта:
>
> ```js
> const map = new Proxy(new Map(), {});
> map.get('a'); // TypeError: Method Map.prototype.get called on incompatible receiver
>
> class Account {
>   #balance = 0;
>   get balance() { return this.#balance; }
> }
> new Proxy(new Account(), {}).balance; // TypeError: Cannot read private member #balance...
> ```
>
> Рішення: у `get` trap віддавати методи, прив'язані до target (`value.bind(target)`), або спеціальні обгортки, як робить Vue для колекцій; для класів із приватними полями — проксувати не екземпляр, а фасад.
>
> **На співбесіді:** саме тому reactivity-бібліотеки не обгортають frozen і non-extensible об'єкти: повернути proxy вкладеного об'єкта замість оригінального значення frozen-властивості — порушення інваріанта `get`.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect|Розділ: Symbol, Proxy і Reflect]] · [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) · [Spec: Invariants of the Essential Internal Methods](https://tc39.es/ecma262/#sec-invariants-of-the-essential-internal-methods)

> [!question]- Як побудувати reactivity на Proxy у стилі Vue 3?
> *часто · код* · `js-09-017`
>
> Ідея: `get` реєструє залежність «поточний effect читає `target.key`» (**track**), а `set` знаходить усі effects, що читали цей ключ, і перезапускає їх (**trigger**). Залежності зберігаються у `WeakMap<target, Map<key, Set<effect>>>`, щоб не утримувати об'єкти в пам'яті. Залежності збираються динамічно: effect підписується лише на ті ключі, які реально прочитав під час останнього запуску.
>
> ```js
> const targetMap = new WeakMap();
> const proxyCache = new WeakMap();
> let activeEffect = null;
>
> function track(target, key) {
>   if (!activeEffect) return;
>   let deps = targetMap.get(target);
>   if (!deps) targetMap.set(target, (deps = new Map()));
>   let dep = deps.get(key);
>   if (!dep) deps.set(key, (dep = new Set()));
>   dep.add(activeEffect);
> }
>
> function trigger(target, key) {
>   const dep = targetMap.get(target)?.get(key);
>   if (dep) [...dep].forEach((run) => run());
> }
>
> function reactive(obj) {
>   if (proxyCache.has(obj)) return proxyCache.get(obj);
>   const proxy = new Proxy(obj, {
>     get(t, key, receiver) {
>       track(t, key);
>       const v = Reflect.get(t, key, receiver);
>       return v !== null && typeof v === 'object' ? reactive(v) : v;
>     },
>     set(t, key, value, receiver) {
>       const old = t[key];
>       const ok = Reflect.set(t, key, value, receiver);
>       if (ok && !Object.is(old, value)) trigger(t, key);
>       return ok;
>     },
>   });
>   proxyCache.set(obj, proxy);
>   return proxy;
> }
>
> function effect(fn) {
>   const run = () => {
>     const prev = activeEffect;
>     activeEffect = run;
>     try { fn(); } finally { activeEffect = prev; }
>   };
>   run();
> }
>
> const state = reactive({ user: { name: 'Ann' } });
> effect(() => console.log(state.user.name)); // 'Ann'
> state.user.name = 'Bob';                    // 'Bob'
> ```
>
> Що додає справжній Vue: очищення старих залежностей перед повторним запуском effect, батчинг через scheduler (мікротаска), `ref` для примітивів (Proxy працює лише з об'єктами), `toRaw`, окремі handlers для `Map`/`Set` і масивів (`includes`, `push` без нескінченних циклів). Lazy deep wrapping і кеш proxy для стабільної ідентичності — як тут.
>
> **На співбесіді:** порівняй із Vue 2 (`Object.defineProperty`): він не бачив додавання нових ключів і запису за індексом масиву. Пастка Proxy-reactivity — деструктуризація `const { name } = state.user` втрачає реактивність, бо копіює примітив.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect|Розділ: Symbol, Proxy і Reflect]] · [Vue: Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html) · [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

> [!question]- Яка ціна Proxy для продуктивності і коли його не варто використовувати?
> *іноді · практика* · `js-09-018`
>
> Proxy повільніший за звичайний доступ до властивостей: кожна операція — виклик trap-функції плюс перевірка інваріантів, а рушій не може застосувати звичні оптимізації на кшталт inline caches за hidden class. На мікробенчмарках доступ через `get` trap повільніший у рази, інколи на порядок; точна цифра залежить від рушія і версії, тому міряй на своєму коді.
>
> Де це болить:
> - hot paths: цикли по великих масивах через proxy — кожен індекс і `length` проходять через `get`;
> - глибокі reactive-структури з тисячами вузлів — пам'ять на proxy-об'єкти і таблиці залежностей;
> - `structuredClone` і `postMessage` не клонують proxy (`DataCloneError`) — потрібна розпаковка в raw;
> - identity: `proxy !== target`, тож `Set`, `WeakMap` і `===` дають сюрпризи, якщо змішувати сирі й обгорнуті об'єкти.
>
> ```js
> const raw = Array.from({ length: 1e6 }, (_, i) => i);
> const wrapped = new Proxy(raw, { get: (t, k, r) => Reflect.get(t, k, r) });
>
> console.time('raw');
> raw.reduce((s, x) => s + x, 0);
> console.timeEnd('raw');
>
> console.time('proxy');
> wrapped.reduce((s, x) => s + x, 0); // ~1e6 викликів get trap
> console.timeEnd('proxy');
> ```
>
> Практика: великі незмінні дані (списки з API, точки графіків) позначати як raw (`markRaw`, `shallowRef` у Vue), обробляти сирий масив, а в reactive-стан класти результат. Proxy доречний там, де частота доступу помірна: конфіги, dev-режим валідації, ORM-обгортки, тестові моки.
>
> **На співбесіді:** «Proxy повільний» — не аргумент сам по собі; аргумент — профайл, у якому traps видно у flame chart.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect|Розділ: Symbol, Proxy і Reflect]] · [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) · [V8: Optimizing ES2015 proxies](https://v8.dev/blog/optimizing-proxies)

> [!question]- Як працюють tagged templates і чому вони зручні для DSL?
> *іноді · код* · `js-09-019`
>
> Tagged template ``tag`...` `` викликає функцію `tag(strings, ...values)`: `strings` — frozen-масив статичних частин із полем `raw` (рядки без обробки escape-послідовностей), `values` — підставлені вирази. Функція сама вирішує, як їх поєднати, і може повернути що завгодно, не обов'язково рядок.
>
> Тому tagged templates — інструмент для DSL, де статична частина — це код, а значення — дані:
>
> ```js
> function sql(strings, ...values) {
>   return {
>     text: strings.reduce((q, s, i) => q + '$' + i + s),
>     values,
>   };
> }
>
> const id = '1; DROP TABLE users';
> sql`SELECT * FROM users WHERE id = ${id} AND active = ${true}`;
> // {
> //   text: 'SELECT * FROM users WHERE id = $1 AND active = $2',
> //   values: ['1; DROP TABLE users', true]
> // }
> ```
>
> Ще одна властивість: для одного й того самого місця в коді рушій передає **той самий** об'єкт `strings`. Бібліотеки (lit-html) використовують його як ключ `WeakMap`, щоб парсити шаблон лише раз.
>
> Приклади в екосистемі: `sql` у postgres.js і Drizzle (параметризовані запити), `html` у lit, `css`/`styled` у styled-components, `gql` у GraphQL-клієнтах, `String.raw` для regex і Windows-шляхів.
>
> **На співбесіді:** головна цінність — безпека за побудовою: значення ніколи не склеюються з кодом у рядок, тож SQL- чи HTML-ін'єкція через підстановку неможлива, якщо тег коректно параметризує або екранує.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази|Розділ: рядки, Unicode і регулярні вирази]] · [MDN: Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) · [MDN: String.raw()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw)

> [!question]- Як реалізувати ліниві властивості через getters і які в цього підводні камені?
> *іноді · код* · `js-09-020`
>
> Ліниву властивість роблять getter-ом, який при першому зверненні обчислює значення і **перекриває себе** власною data-властивістю екземпляра. Наступні читання — звичайний доступ без виклику getter.
>
> ```js
> class Report {
>   constructor(rows) {
>     this.rows = rows;
>   }
>
>   get summary() {
>     const value = computeSummary(this.rows); // дорого
>     Object.defineProperty(this, 'summary', {
>       value,
>       writable: false,
>       configurable: true,
>       enumerable: false,
>     });
>     return value;
>   }
> }
> ```
>
> Getter живе на прототипі, тому `defineProperty` на `this` створює own-властивість, що його затіняє. Альтернатива без зміни форми об'єкта — кеш у приватному полі:
>
> ```js
> class Report2 {
>   #summary;
>   #computed = false;
>   constructor(rows) { this.rows = rows; }
>   get summary() {
>     if (!this.#computed) {
>       this.#summary = computeSummary(this.rows);
>       this.#computed = true;
>     }
>     return this.#summary;
>   }
> }
> ```
>
> Підводні камені:
> - **застарілий кеш**: якщо `rows` змінять, summary не перерахується — потрібна інвалідація або незмінні дані;
> - зміна shape: own-властивість, додана після створення, змінює hidden class; у масових об'єктах це може зробити inline caches поліморфними;
> - `this.#x ??= compute()` перераховує щоразу, якщо результат `null`/`undefined` — звідси окремий прапорець;
> - getters із side effects заважають дебагу: DevTools показує `(...)` і викликає getter при кліку, а spread і `JSON.stringify` getters прототипу не бачать.
>
> **На співбесіді:** класичне застосування — лінива ініціалізація дорогих речей (великі regex, `Intl.*Format`, парсери) у бібліотеках, щоб не платити за них під час імпорту.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко|Розділ: обʼєкти глибоко]] · [MDN: get](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) · [MDN: Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

## 🟣 Tech Lead

> [!question]- Коли метапрограмування (Proxy, well-known symbols, monkey-patching) шкодить підтримуваності?
> *іноді · практика* · `js-09-021`
>
> Метапрограмування шкодить, коли ховає поведінку, яку читач не може знайти звичайними засобами: переходом до визначення, пошуком по коду, типами. Рядок `user.name = 'x'` із proxy може робити мережевий запит, валідацію і тригер рендеру — і жодна з цих речей не видна в місці виклику.
>
> Сигнали, що «магія» коштує дорожче, ніж дає:
> - поведінку неможливо зрозуміти без читання handler-а; IDE і TypeScript не допомагають (динамічні ключі в `get` дають `any`);
> - stack traces проходять крізь traps і обгортки, баг відтворюється лише за певного порядку доступів;
> - змінюється семантика базових операцій: `instanceof` через `Symbol.hasInstance`, `==` через `toPrimitive`, патчинг `Array.prototype`;
> - магія заощаджує кілька рядків явного коду, а не складність.
>
> Коли виправдане: в інфраструктурному шарі з чіткою межею і документацією — reactivity фреймворку, ORM, моки в тестах, dev-only діагностика, — де команда користується абстракцією, а не пише її щодня.
>
> Правила, які я ставлю в команді:
> - механізм живе в одному модулі з тестами на контракт, а не розмазаний по фічах;
> - зовнішній API — явний і типізований;
> - є escape hatch (`toRaw`, прямий виклик) і перевірка профайлом на hot paths;
> - нове метапрограмування в прикладному коді — лише після обговорення або ADR.
>
> **На співбесіді:** питання не «чи вміє команда в Proxy», а «чи знайде новий розробник за годину, чому змінилось це значення».
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect|Розділ: Symbol, Proxy і Reflect]] · [MDN: Meta programming](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Meta_programming) · [Google: Engineering Practices — Code Review](https://google.github.io/eng-practices/review/)

> [!question]- Як ти рев'юїш PR із «магічним» кодом: Proxy, динамічні getters, патчинг глобальних об'єктів?
> *рідко · практика* · `js-09-022`
>
> Я оцінюю не елегантність, а вартість володіння: хто це підтримуватиме, як це дебажити і що зламається при оновленні рушія чи бібліотеки.
>
> Чекліст рев'ю:
> 1. **Навіщо**: яку проблему вирішує магія і чому явний варіант (функція, клас, codegen) гірший? Прошу показати обидва.
> 2. **Межі**: чи обмежено вплив одним модулем? Патчинг глобалів (`Array.prototype`, `window.fetch`) у прикладному коді — майже завжди блокер.
> 3. **Коректність**: `Reflect.*` з receiver у traps, `true` з `set`, інваріанти для frozen-об'єктів, поведінка з `Map`/`Date`/`#private`, symbol-ключі в `ownKeys`.
> 4. **Типи**: чи виражений контракт у TypeScript, чи не з'явився `any`?
> 5. **Дебаг**: чи видно реальний стан у DevTools, чи є `toRaw`/`inspect`, чи читається stack trace?
> 6. **Продуктивність**: чи не потрапляє proxy або getter у hot path, чи є профайл?
> 7. **Тести**: контракт і edge cases — повторна ітерація, `break`, видалення ключа, порівняння ідентичності.
>
> Якщо PR проходить пункт 1, але падає на 5–7, пропоную звузити: залишити механізм, але сховати його за явним API. Якщо не проходить пункт 1 — прошу переписати явно, навіть ціною кількох зайвих рядків.
>
> **На співбесіді:** покажи, що рев'ю — про розподіл знань: вимагай пояснення механізму в модулі, ADR для інфраструктурних рішень і щоб автор не був єдиною людиною, яка розуміє, як це працює.
>
> 📚 [[JavaScript - 20. Symbol, Proxy і Reflect|Розділ: Symbol, Proxy і Reflect]] · [Google: Engineering Practices — Code Review](https://google.github.io/eng-practices/review/) · [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

## Тести

> [!quiz] Що поверне `it.next()` для вже вичерпаного iterator масиву?
> level: junior · id: js-09-quiz-01
> - [ ] `null`
> - [x] `{ value: undefined, done: true }`
> - [ ] `{ value: <останній елемент>, done: true }`
> - [ ] Кине `TypeError`
>
> **Пояснення:** вичерпаний iterator не кидає помилку, а щоразу повертає `{ value: undefined, done: true }`. Саме за `done: true` споживачі на кшталт `for..of` розуміють, що час зупинитись.

> [!quiz] Який trap Proxy перехоплює оператор `in`?
> level: middle · id: js-09-quiz-02
> - [ ] `get`
> - [x] `has`
> - [ ] `ownKeys`
> - [ ] `getOwnPropertyDescriptor`
>
> **Пояснення:** `'key' in proxy` викликає внутрішній метод `[[HasProperty]]`, якому відповідає trap `has`. `ownKeys` перехоплює перелік ключів (`Object.keys`, `Reflect.ownKeys`), а `get` — читання значення.

> [!quiz] Оберіть усі правильні: які значення можна розгорнути через spread `[...x]`?
> level: middle · type: multi · id: js-09-quiz-03
> - [x] `'abc'`
> - [x] `new Map([[1, 'a']])`
> - [ ] `{ 0: 'a', length: 1 }`
> - [ ] `new WeakSet()`
>
> **Пояснення:** spread вимагає iterable. Рядок і `Map` мають `Symbol.iterator`; array-like об'єкт — ні (для нього потрібен `Array.from`), а `WeakSet` взагалі не можна перебирати, бо його вміст залежить від GC.

> [!quiz] Що виведе код?
> level: junior · type: output · id: js-09-quiz-04
>
> ```js
> function* g() {
>   yield 1;
>   yield 2;
>   return 3;
> }
> console.log([...g()]);
> ```
>
> - [ ] `[1, 2, 3]`
> - [x] `[1, 2]`
> - [ ] `[1, 2, undefined]`
> - [ ] `[3]`
>
> **Пояснення:** spread бере значення лише з кроків, де `done: false`. `return 3` дає `{ value: 3, done: true }`, і це значення ігнорується — так само, як у `for..of`.

> [!quiz] Що виведе код?
> level: senior · type: output · id: js-09-quiz-05
>
> ```js
> const obj = {
>   [Symbol.toPrimitive](hint) {
>     return hint === 'number' ? 42 : hint;
>   },
> };
> console.log(+obj, `${obj}`, obj + '');
> ```
>
> - [x] `42 string default`
> - [ ] `42 string string`
> - [ ] `42 42 42`
> - [ ] `NaN string default`
>
> **Пояснення:** унарний `+` передає hint `'number'`, template literal — `'string'`. Бінарний `+` не знає, чи буде конкатенація, тому передає `'default'` — це і є найчастіша пастка.

## Задачі

> [!task] Реалізуй `take` і `zip` для будь-яких iterable
> level: middle · difficulty: medium · id: js-09-task-01 · tags: generators, iterators
>
> Напиши два генератори. `take(iterable, n)` віддає не більше `n` перших значень і не читає з джерела жодного зайвого елемента. `zip(...iterables)` віддає масиви `[a, b, ...]` з i-х елементів кожного джерела і зупиняється, щойно вичерпалось найкоротше. Обидві функції мають працювати з нескінченними послідовностями і коректно закривати (`return()`) джерела, які не дочитали. Приклад: `[...take(naturals(), 3)]` → `[1, 2, 3]`; `[...zip([1, 2, 3], 'ab')]` → `[[1, 'a'], [2, 'b']]`.
>
> > [!hint]- Підказка 1
> > `for..of` усередині генератора сам закриває джерело, якщо з циклу вийти через `return` або якщо зовнішній споживач зробить `break`.
>
> > [!hint]- Підказка 2
> > У `take` перевір лічильник одразу після `yield`, до наступного кроку циклу, — інакше буде прочитано зайвий елемент. Окремо обробь `n <= 0`.
>
> > [!hint]- Підказка 3
> > У `zip` цикл `for..of` не підходить — потрібні ручні iterator-и через `it[Symbol.iterator]()` і `try/finally`, де викликається `it.return?.()` для кожного.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function* take(iterable, n) {
> >   if (n <= 0) return;
> >   let count = 0;
> >   for (const item of iterable) {
> >     yield item;
> >     if (++count >= n) return;
> >   }
> > }
> >
> > function* zip(...iterables) {
> >   if (iterables.length === 0) return;
> >   const iterators = iterables.map((it) => it[Symbol.iterator]());
> >   try {
> >     while (true) {
> >       const tuple = [];
> >       for (const it of iterators) {
> >         const { value, done } = it.next();
> >         if (done) return;
> >         tuple.push(value);
> >       }
> >       yield tuple;
> >     }
> >   } finally {
> >     for (const it of iterators) it.return?.();
> >   }
> > }
> >
> > function* naturals() {
> >   let n = 1;
> >   while (true) yield n++;
> > }
> >
> > [...take(naturals(), 3)];                       // [1, 2, 3]
> > [...zip(naturals(), 'ab', new Set([true, false, null]))]; // [[1, 'a', true], [2, 'b', false]]
> > ```
> >
> > `return` усередині `for..of` у `take` викликає `return()` джерела, тож нескінченний генератор коректно завершується. У `zip` блок `finally` спрацьовує і при природному завершенні, і коли споживач робить `break` (тоді рушій викликає `return()` самого `zip`), тому жоден iterator не залишається «висіти». Виклик `return()` на вже вичерпаному генераторі безпечний. Складність — O(k) на кожен кортеж, де k — кількість джерел; пам'ять — O(k).

> [!task] Реалізуй `observable` — глибоке спостереження за змінами через Proxy
> level: senior · difficulty: hard · id: js-09-task-02 · tags: proxy, reflect, weakmap
>
> Напиши `observable(target, onChange)`, що повертає proxy, який викликає `onChange(path, value, oldValue)` при кожній реальній зміні на будь-якій глибині: присвоєння нового чи іншого значення та `delete` існуючого ключа. `path` — масив ключів від кореня. Присвоєння того самого значення (за `Object.is`) не має викликати `onChange`. Ідентичність має бути стабільною: `state.user === state.user`. Якщо присвоїти proxy-значення (`state.a = state.b`), у сирий об'єкт має потрапити сирий об'єкт, а не proxy. Приклад: `state.items.push(3)` → один виклик з `['items', '2']`.
>
> > [!hint]- Підказка 1
> > Вкладені об'єкти обгортай ліниво в `get`, а не рекурсивно при створенні. Для стабільної ідентичності кешуй proxy у `WeakMap` за парою «об'єкт + шлях».
>
> > [!hint]- Підказка 2
> > Тримай другий `WeakMap` proxy → raw, щоб у `set` розпаковувати значення перед записом. Використовуй `Reflect.set` з receiver і `Reflect.deleteProperty`, повертай їхній результат.
>
> > [!hint]- Підказка 3
> > Перед записом збережи `had = Object.hasOwn(t, key)` та `old = t[key]`: повідомляй, якщо ключа не було або `!Object.is(old, value)`. Для `push` після запису індексу `length` уже оновився, тому другого повідомлення не буде. Не обгортай значення frozen-об'єктів — це порушить інваріант `get`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function observable(target, onChange) {
> >   const toRaw = new WeakMap();
> >   const cache = new WeakMap();
> >   const isObject = (v) => v !== null && typeof v === 'object';
> >
> >   function wrap(obj, path) {
> >     const cacheKey = JSON.stringify(path);
> >     let byPath = cache.get(obj);
> >     if (!byPath) cache.set(obj, (byPath = new Map()));
> >     const cached = byPath.get(cacheKey);
> >     if (cached) return cached;
> >
> >     const proxy = new Proxy(obj, {
> >       get(t, key, receiver) {
> >         const value = Reflect.get(t, key, receiver);
> >         if (typeof key === 'symbol' || !isObject(value) || Object.isFrozen(t)) {
> >           return value;
> >         }
> >         return wrap(value, [...path, key]);
> >       },
> >       set(t, key, value, receiver) {
> >         const raw = toRaw.get(value) ?? value;
> >         const had = Object.hasOwn(t, key);
> >         const old = t[key];
> >         const ok = Reflect.set(t, key, raw, receiver);
> >         if (ok && (!had || !Object.is(old, raw))) {
> >           onChange([...path, key], raw, old);
> >         }
> >         return ok;
> >       },
> >       deleteProperty(t, key) {
> >         if (!Object.hasOwn(t, key)) return true;
> >         const old = t[key];
> >         const ok = Reflect.deleteProperty(t, key);
> >         if (ok) onChange([...path, key], undefined, old);
> >         return ok;
> >       },
> >     });
> >
> >     toRaw.set(proxy, obj);
> >     byPath.set(cacheKey, proxy);
> >     return proxy;
> >   }
> >
> >   return wrap(target, []);
> > }
> >
> > const state = observable(
> >   { user: { name: 'Ann' }, items: [1, 2] },
> >   (path, value, old) => console.log(path.join('.'), old, '→', value),
> > );
> > state.user.name = 'Bob'; // user.name Ann → Bob
> > state.user.name = 'Bob'; // нічого
> > state.items.push(3);     // items.2 undefined → 3
> > delete state.user.name;  // user.name Bob → undefined
> > state.user === state.user; // true
> > ```
> >
> > Кеш по парі «об'єкт + шлях» потрібен, бо той самий об'єкт може бути доступний різними шляхами, а `path` у повідомленнях має бути точним. `WeakMap`-и не утримують ні сирі об'єкти, ні proxy від GC. `Reflect.set` з receiver коректно викликає setters і не рекурсує, бо в handler немає `defineProperty` trap. Обмеження: `Map`/`Set` не відстежуються (їм потрібні окремі обгортки методів), а non-configurable властивості на незамороженому об'єкті варто перевіряти через `Reflect.getOwnPropertyDescriptor`.
