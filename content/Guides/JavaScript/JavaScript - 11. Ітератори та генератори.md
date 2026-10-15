---
title: Ітератори та генератори
order: 11
level: middle
tags: [iterators, generators, symbol, async-iteration, lazy]
prerequisites:
  - "[[JavaScript - 07. Прототипи та класи]]"
  - "[[JavaScript - 10. async і await]]"
estimatedMinutes: 45
id: jsd-ch-11
icon: "🔂"
---

# JavaScript - 11. Ітератори та генератори

> [!success] 🎯 Після цього розділу ти зможеш
> - Пояснити різницю між *iterable* та *iterator* і зробити власний об'єкт ітерованим через `Symbol.iterator`.
> - Назвати, що в мові «споживає» ітерабли (`for…of`, spread, деструктуризація, `Array.from`, `Promise.all`…), і коли викликається `return()`.
> - Передбачити виконання генератора з `next(value)`, `return()` і `throw()`.
> - Будувати ліниві (зокрема нескінченні) послідовності й обробляти їх iterator helpers.
> - Читати пагіновані API й стріми через async-генератори та `for await`.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-11-quiz-01
>
> ```js
> function* gen() {
>   console.log('start');
>   const x = yield 1;
>   console.log('got', x);
>   yield x * 2;
> }
> const it = gen();
> console.log('created');
> console.log(it.next('ignored').value);
> console.log(it.next(5).value);
> ```
>
> **Відповідь:** `created start 1 got 5 10`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Виклик `gen()` **не виконує** тіло — лише створює об'єкт-генератор. Перший `next` запускає код до першого `yield` (аргумент `'ignored'` нікуди не потрапляє). Другий `next(5)` відновлює виконання — і `5` стає результатом виразу `yield 1`.

## 🧒 Простими словами

**Iterable** — це книжка, **iterator** — закладка в ній. З однієї книжки можна зробити скільки завгодно закладок, і кожна знає лише одне: «яка наступна сторінка і чи книжка скінчилась». А **генератор** — це оповідач, який розповідає казку частинами: каже речення й замовкає, доки ти не попросиш «далі». І ти можеш, просячи «далі», ще й підказати йому щось («а нехай дракон буде зеленим») — він вплете це в наступне речення.

## 🔬 Як це працює насправді

### Протоколи ітерації

Два протоколи, жодного спеціального класу:

- **Iterator** — об'єкт з методом `next()`, що повертає `{ value, done }`. Опційно — `return()` (дострокове завершення) і `throw()`.
- **Iterable** — об'єкт з методом `[Symbol.iterator]()`, що повертає **новий iterator**.

```js
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next: () =>
        current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true },
    };
  },
};

console.log([...range]);                      // → [1, 2, 3]
console.log(Math.max(...range));              // → 3
console.log(Array.from(range, (x) => x * 10)); // → [10, 20, 30]
```

Вбудовано ітерабельні: `Array`, `String` (по code points, тож емодзі не розірве), `Map`, `Set`, `TypedArray`, `arguments`, `NodeList`. Звичайний об'єкт `{}` — **ні**: для нього є `Object.keys/values/entries`.

> [!quiz] Перевір себе: що ітерабельне?
> level: junior · type: multi · id: jsd-11-quiz-02
>
> По чому можна пройтися `for…of` без додаткових перетворень?
>
> - [x] `'привіт'`
> - [x] `new Map([['a', 1]])`
> - [ ] `{ a: 1, b: 2 }`
> - [x] `document.querySelectorAll('li')`
> - [ ] `42`
>
> **Пояснення:** рядки, `Map` і `NodeList` мають `Symbol.iterator`. Звичайний об'єкт і число — ні: `for…of` кине `TypeError: … is not iterable`.

> [!quiz] Перевір себе: заповни пропуски — зроби об'єкт ітерабельним вручну
> level: middle · type: fill · id: jsd-11-quiz-08 · bank: asyncIterator, yield, value
>
> ```js fill
> const countdown = {
>   from: 3,
>   [Symbol.[[iterator]]]() {
>     let current = this.from
>     return {
>       [[next]]() {
>         return current > 0
>           ? { value: current--, [[done]]: false }
>           : { value: undefined, done: [[true]] }
>       },
>     }
>   },
> }
> [...countdown] // → [3, 2, 1]
> ```
>
> **Пояснення:** iterable — це об'єкт з методом `[Symbol.iterator]()`, який щоразу повертає **новий** iterator. Iterator — об'єкт з `next()`, що віддає `{ value, done }`. Саме тому `countdown` можна розгорнути двічі: кожен spread отримує свіжий `current`.

### Хто споживає ітерабли і коли викликається `return()`

Протокол ітерації — це «спільна мова» синтаксису та API:

| Споживач | Приклад |
|---|---|
| `for…of` | `for (const x of set)` |
| spread | `[...map.keys()]`, `fn(...args)` |
| деструктуризація масиву | `const [first, second] = iterable` |
| конструктори й статичні методи | `new Map(entries)`, `new Set(it)`, `Array.from(it)`, `Object.fromEntries(it)` |
| комбінатори | `Promise.all(it)`, `Promise.race(it)` |
| делегування | `yield* it` |

Якщо споживач зупиняється **раніше** (`break`, `return`, виняток у тілі циклу, деструктуризація лише частини), він викликає `iterator.return()` — шанс закрити файл, з'єднання чи курсор.

```js
const counter = {
  i: 0,
  [Symbol.iterator]() { return this; },
  next() { this.i++; console.log('next', this.i); return { value: this.i, done: false }; },
  return() { console.log('return'); return { done: true }; },
};
const [a, b] = counter;
// → next 1
// → next 2
// → return
```

> [!quiz] Перевір себе: дострокове завершення
> level: middle · type: multi · id: jsd-11-quiz-03
>
> У яких випадках `for…of` викличе `iterator.return()`?
>
> - [x] `break` усередині циклу
> - [x] `throw` усередині тіла циклу
> - [ ] Ітератор сам повернув `{ done: true }`
> - [x] `return` з функції всередині циклу
>
> **Пояснення:** `return()` — сигнал «я пішов раніше, прибери за собою». Якщо ітератор сам дійшов до кінця, прибирати вже нема чого.

### Генератори: функції, що вміють ставати на паузу

`function*` створює **генераторну функцію**. Її виклик не виконує тіло, а повертає об'єкт-генератор — він одночасно iterator і iterable (`gen[Symbol.iterator]() === gen`). Кожен `next()` проганяє код до наступного `yield` і заморожує функцію разом з усіма локальними змінними.

> [!viz] generators
> scenario: yield-pingpong

```js
function* idGenerator() {
  let id = 1;
  while (true) yield id++;
}
const ids = idGenerator();
ids.next().value; // → 1
ids.next().value; // → 2
```

`return x` у генераторі дає `{ value: x, done: true }` — і `for…of`/spread **ігнорують** це значення, бо бачать `done: true`. А `yield*` делегує іншому ітерабельному і повертає `return`-значення делегата:

```js
function* inner() { yield 'a'; yield 'b'; return 'R'; }
function* outer() {
  const r = yield* inner();
  yield r;
  yield* [1, 2];
}
console.log([...outer()]); // → ['a', 'b', 'R', 1, 2]
```

> [!quiz] Перевір себе: куди дівся return?
> level: middle · type: output · id: jsd-11-quiz-04
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
> **Відповідь:** `[1, 2]`
>
> **Пояснення:** spread зупиняється на першому `done: true`, а значення `3` приходить саме в ньому. Його бачить лише ручний `next()` або `yield*`. Див. [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).

### Двосторонній зв'язок: `next(value)`, `return()`, `throw()`

Генератор — не лише джерело значень, а й **корутина**: зовнішній код може передавати дані всередину.

- `next(v)` — `v` стає результатом виразу `yield`, на якому генератор стоїть. Аргумент **першого** `next()` губиться: ще немає `yield`, який би його отримав.
- `return(v)` — завершує генератор так, ніби в точці `yield` стояв `return v`; блоки `finally` виконуються.
- `throw(err)` — кидає `err` у точці `yield`. Якщо генератор його зловить, він продовжить до наступного `yield`.

```js
function* g() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log('cleanup');
  }
}
const it = g();
console.log(it.next().value);  // → 1
console.log(it.return(42));    // → cleanup, потім { value: 42, done: true }
console.log(it.next());        // → { value: undefined, done: true }
```

Саме ця механіка — «призупинитися на значенні, а потім отримати результат ззовні» — лежить в основі `async/await` (і раніше бібліотек `co` та redux-saga): рушій отримує проміс з `yield`, чекає його і повертає результат через `next(result)` або помилку через `throw(err)`.

> [!quiz] Перевір себе: throw всередину
> level: senior · id: jsd-11-quiz-05
>
> ```js
> function* g() {
>   while (true) {
>     try {
>       yield 'ok';
>     } catch (e) {
>       console.log('caught', e.message);
>     }
>   }
> }
> const it = g();
> it.next();
> console.log(it.throw(new Error('boom')));
> ```
>
> - [ ] Виняток вилетить назовні, генератор завершиться
> - [x] `caught boom`, потім `{ value: 'ok', done: false }`
> - [ ] `{ value: undefined, done: true }`
>
> **Пояснення:** `throw()` кидає помилку там, де генератор стоїть (на `yield`). Його `catch` її обробляє, цикл іде на наступну ітерацію до нового `yield 'ok'` — це і є результат виклику `throw()`.

### Ліниві й нескінченні послідовності

Генератор обчислює значення **на вимогу**. Тому нескінченна послідовність — це нормально, якщо споживач бере скінченну кількість. З ES2025 ітератори мають **iterator helpers** — `map`, `filter`, `take`, `drop`, `flatMap`, `reduce`, `toArray`, `some`, `every`, `find`, `forEach`, — які теж ліниві.

```js
function* naturals() {
  for (let i = 1; ; i++) {
    console.log('gen', i);
    yield i;
  }
}

const firstEvens = naturals()
  .filter((n) => n % 2 === 0)
  .take(2)
  .toArray();
// → gen 1, gen 2, gen 3, gen 4
console.log(firstEvens); // → [2, 4]
```

На відміну від масивів, тут **немає проміжних масивів**: кожен елемент проходить увесь конвеєр, перш ніж згенерується наступний. `Iterator.from(obj)` перетворює будь-який ітерабельний/ітератор на об'єкт з цими методами.

> [!quiz] Перевір себе: скільки обчислень?
> level: middle · id: jsd-11-quiz-06
>
> ```js
> function* squares() {
>   for (let i = 1; ; i++) yield i * i;
> }
> const r = squares().map((x) => x + 1).find((x) => x > 10);
> ```
>
> Скільки значень згенерує `squares` і чому дорівнює `r`?
>
> - [x] 4 значення, `r === 17`
> - [ ] Нескінченно багато — програма зависне
> - [ ] 10 значень, `r === 11`
>
> **Пояснення:** конвеєр лінивий: 1→2, 4→5, 9→10, 16→17 > 10 — `find` зупиняється й викликає `return()` у джерела.

> [!quiz] Перевір себе: склади лінивий `take`, що бере перші n елементів будь-якого ітерабла
> level: middle · type: order · id: jsd-11-quiz-09
>
> ```js order
> function* take(iterable, n) {
>   if (n <= 0) return
>   for (const x of iterable) {
>     yield x
>     if (--n === 0) return
>   }
> }
>     return x // ✗
> ```
>
> **Пояснення:** `yield` віддає елемент і ставить генератор на паузу до наступного `next()`, тож з нескінченного `naturals()` береться рівно `n` значень. `return` усередині `for…of` закриває і генератор, і джерело (викликається його `return()`). Перевірка `n <= 0` на початку — щоб `take(xs, 0)` не з'їв жодного елемента.

### Async-ітератори та async-генератори

Коли наступне значення приходить асинхронно (мережа, стрім, черга), використовують **async iteration**:

- `Symbol.asyncIterator` замість `Symbol.iterator`;
- `next()` повертає **проміс** `{ value, done }`;
- споживач — `for await…of`; найзручніший спосіб створити — `async function*`.

```js
async function* fetchPages(url) {
  let next = url;
  while (next) {
    const res = await fetch(next);
    const { items, nextUrl } = await res.json();
    yield items;
    next = nextUrl;
  }
}

for await (const items of fetchPages('/api/orders?page=1')) {
  render(items);
  if (items.length === 0) break; // return() — подальші сторінки не завантажаться
}
```

Сторінки вантажаться ліниво: поки споживач не попросив наступну, запит не йде. Node-стріми (`fs.createReadStream`, `readline`) і веб `ReadableStream` (у сучасних рушіях) — теж async iterables.

> [!quiz] Перевір себе: лінивість async-генератора
> level: middle · type: output · id: jsd-11-quiz-07
>
> ```js
> async function* pages() {
>   for (let p = 1; p <= 3; p++) {
>     console.log('fetched', p);
>     yield p;
>   }
> }
> for await (const p of pages()) {
>   console.log('page', p);
>   if (p === 2) break;
> }
> ```
>
> **Відповідь:** `fetched 1 page 1 fetched 2 page 2`
>
> **Пояснення:** генератор біжить лише до наступного `yield`, коли цикл попросить значення. Після `break` третя сторінка не запитується взагалі.

## ⚠️ Пастки

> [!pitfall] Генератор — одноразовий
> Об'єкт-генератор — це iterator, а `[Symbol.iterator]()` повертає його самого. Другий прохід не почнеться спочатку.
>
> ```js
> function* g() { yield 1; yield 2; }
> const it = g();
> console.log([...it], [...it]); // → [1, 2] []
> ```
>
> Якщо треба ітерувати повторно — зберігай **функцію** (або iterable-об'єкт з `*[Symbol.iterator]()`), а не результат її виклику.

> [!pitfall] Аргумент першого `next()` губиться
> На момент першого `next()` генератор ще не дійшов до жодного `yield`, тож значенню нікуди потрапити. Початкові дані передавай аргументами генераторної функції.
>
> ```js
> function* echo() { while (true) console.log(yield); }
> const e = echo();
> e.next('A'); // нічого
> e.next('B'); // → B
> ```

> [!pitfall] Spread нескінченної послідовності
> `[...naturals()]` або `Array.from(naturals())` — вічний цикл і зрештою out of memory. Обмежуй через `.take(n)`, деструктуризацію (`const [a, b] = naturals()`) або `break`.

> [!pitfall] Ручний ітератор без `return()` тече ресурсами
> Якщо ітератор відкриває ресурс (файл, курсор БД), а споживач зробив `break` — без `return()` ресурс лишиться відкритим. У генераторах це вирішує `try/finally`.
>
> ```js
> function* lines(file) {
>   const handle = open(file);
>   try {
>     while (!handle.eof) yield handle.readLine();
>   } finally {
>     handle.close(); // виконається і при break у споживача
>   }
> }
> ```

## 🎤 На співбесіді

> [!interview] Чим iterable відрізняється від iterator?
> level: middle · frequency: часто · id: jsd-11-int-01
>
> ---
>
> Iterable — об'єкт з методом `[Symbol.iterator]()`, який повертає **новий** iterator; це «колекція, яку можна обійти» (`Array`, `Map`, `String`). Iterator — об'єкт стану обходу з `next()` → `{ value, done }`, опційно `return()`/`throw()`. З одного iterable можна отримати багато незалежних iterator-ів. Генератор — і те, і те одразу, тому одноразовий. На цьому протоколі працюють `for…of`, spread, деструктуризація, `Array.from`, `Promise.all`, `new Map`.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Протоколи ітерації|Розділ: протоколи ітерації]] · [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) · [javascript.info: Iterables](https://javascript.info/iterable)

> [!interview] Що таке генератори і де їх застосовують на практиці?
> level: middle · frequency: часто · id: jsd-11-int-02
>
> ---
>
> Функції, які можна призупиняти на `yield` і відновлювати зі збереженим станом; виклик повертає ітератор. Застосування: ліниві й нескінченні послідовності (пагінація, генерація id, обхід дерев через `yield*`), кастомні ітерабли без ручного `next`, корутини з двостороннім обміном (`next(value)`), керування асинхронністю (redux-saga, історично `co` — прообраз `async/await`), async-генератори для стрімів і пагінованих API.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Генератори: функції, що вміють ставати на паузу|Розділ: генератори]] · [MDN: Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) · [javascript.info: Generators](https://javascript.info/generators)

> [!interview] Як працює `for await…of` і коли він потрібен?
> level: senior · frequency: іноді · id: jsd-11-int-03
>
> ---
>
> Бере `[Symbol.asyncIterator]()` і на кожному кроці робить `await iterator.next()`. Якщо async-ітератора немає — бере звичайний і чекає кожне його значення (тому працює з масивом промісів). Потрібен, коли елементи надходять асинхронно: стріми, пагінація, черги повідомлень, WebSocket-обгортки. Обробка послідовна — наступний елемент не запитується, доки не оброблено поточний (природний backpressure). `break` викликає `return()`, що дозволяє закрити з'єднання.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Async-ітератори та async-генератори|Розділ: async-ітератори]] · [MDN: for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) · [javascript.info: Async iteration and generators](https://javascript.info/async-iterators-generators)

## 🔗 Зв'язки

- [[JavaScript - 10. async і await]] — `await` — це `yield` + рушій на промісах; задача з цього розділу реалізує такий рушій.
- [[JavaScript - 07. Прототипи та класи]] — `Symbol.iterator` можна оголосити як метод класу `*[Symbol.iterator]()`, і всі екземпляри стануть ітерабельними.
- [[JavaScript - 12. Масиви та функціональний стиль]] — `map/filter` масивів жадібні й створюють проміжні масиви; iterator helpers роблять те саме ліниво.
- [[JavaScript - 13. Пам'ять і збирач сміття]] — ліниві послідовності дозволяють обробляти дані, які не вмістилися б у пам'ять цілком.

## ⚡ Фішки

> [!reel] 😴 Виклик генератора не виконує жодного рядка
> `gen()` лише створює об'єкт-генератор. Навіть `console.log` у першому рядку тіла мовчатиме, доки хтось не викличе `next()`.

> [!reel] 📭 Перший next(value) — лист у нікуди
> Значення з `next(v)` стає результатом `yield`, на якому генератор стоїть. На першому `next()` він ще ні на чому не стоїть — тож аргумент просто зникає.

> [!reel] ♾️ Нескінченний цикл, який не зависає
> `while (true) yield i++` — цілком безпечний: генератор рахує, лише коли його просять. Небезпечний не він, а `[...gen()]`.
>
> ```js
> const [a, b, c] = naturals(); // 1, 2, 3 — і зупинка
> ```

> [!reel] 🧰 Ітератори отримали map, filter і take
> ES2025 додав iterator helpers: `naturals().filter(isPrime).take(10).toArray()` — ліниво, без проміжних масивів. Працює з будь-яким ітератором через `Iterator.from`.

> [!reel] 🧹 break викликає return() — і finally генератора
> Вийшов з `for…of` раніше? Мова сама покличе `iterator.return()`, а в генераторі виконається `finally`. Ідеальне місце, щоб закрити файл чи курсор БД.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що потрібно, щоб об'єкт став ітерабельним?
> *часто · теорія* · `jsd-11-001`
>
> Метод `[Symbol.iterator]()`, що повертає iterator — об'єкт з `next()`, який віддає `{ value, done }`. Найпростіше — оголосити його генератором:
>
> ```js
> const bag = { items: [1, 2], *[Symbol.iterator]() { yield* this.items; } };
> [...bag]; // [1, 2]
> ```
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Протоколи ітерації|Розділ: протоколи ітерації]] · [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) · [MDN: Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)

> [!question]- Чому `for…of` по звичайному об'єкту кидає помилку?
> *часто · теорія* · `jsd-11-002`
>
> У `Object.prototype` немає `Symbol.iterator` — об'єкт не визначає, що саме обходити (ключі? значення? пари?). Використовуй `Object.keys/values/entries(obj)` — вони повертають масиви.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Протоколи ітерації|Розділ: протоколи ітерації]] · [MDN: for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) · [javascript.info: Iterables](https://javascript.info/iterable)

> [!question]- Що повертає виклик генераторної функції?
> *часто · код* · `jsd-11-003`
>
> Об'єкт-генератор (iterator + iterable), не виконуючи тіла. Тіло біжить шматками — від `next()` до наступного `yield`.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Генератори: функції, що вміють ставати на паузу|Розділ: генератори]] · [MDN: function\*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) · [Spec: Generator Objects](https://tc39.es/ecma262/#sec-generator-objects)

### 🟡 Middle

> [!question]- Що робить `next(value)` і чому аргумент першого виклику губиться?
> *часто · код* · `jsd-11-004`
>
> `value` стає результатом виразу `yield`, на якому генератор призупинений. При першому `next()` генератор ще не дійшов до жодного `yield`, тому значенню нікуди потрапити.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Двосторонній зв'язок: next(value), return(), throw()|Розділ: next(value)]] · [MDN: Generator.prototype.next()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/next) · [javascript.info: Generators](https://javascript.info/generators)

> [!question]- Коли викликається `iterator.return()`?
> *іноді · теорія* · `jsd-11-005`
>
> Коли споживач зупиняється раніше: `break`, `return`, виняток у тілі `for…of`, часткова деструктуризація. Не викликається, якщо ітератор сам повернув `done: true`. У генераторі `return()` запускає блоки `finally`.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Хто споживає ітерабли і коли викликається return()|Розділ: споживачі ітераблів]] · [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) · [Spec: IteratorClose](https://tc39.es/ecma262/#sec-iteratorclose)

> [!question]- Чому `[...gen]` не містить значення з `return` генератора?
> *іноді · код* · `jsd-11-006`
>
> `return x` дає `{ value: x, done: true }`, а spread і `for…of` зупиняються на `done: true`, не беручи `value`. Отримати його можна ручним `next()` або як результат `yield*`.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Генератори: функції, що вміють ставати на паузу|Розділ: генератори]] · [MDN: Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) · [javascript.info: Generators](https://javascript.info/generators)

> [!question]- Чим iterator helpers відрізняються від методів масиву?
> *іноді · порівняння* · `jsd-11-007`
>
> Вони ліниві: елемент проходить увесь конвеєр, перш ніж буде запитано наступний; проміжних масивів немає, нескінченні джерела дозволені. Методи масиву жадібні: кожен крок обробляє весь масив і створює новий.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Ліниві й нескінченні послідовності|Розділ: ліниві послідовності]] · [MDN: Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator) · [V8: Iterator helpers](https://v8.dev/features/iterator-helpers)

### 🔴 Senior

> [!question]- Як із генератора і промісів зробити `async/await`?
> *іноді · практика* · `jsd-11-008`
>
> Рушій викликає `gen.next()`, отримує з `yield` проміс, чекає його і повертає результат назад через `gen.next(result)` (або помилку через `gen.throw(err)`), доки `done !== true`. Результат усієї функції — проміс зі значенням `return`. Так працювали `co` і транспіляція `async` у ES5.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Двосторонній зв'язок: next(value), return(), throw()|Розділ: двосторонній зв'язок]] · [javascript.info: Generators](https://javascript.info/generators) · [Spec: Await](https://tc39.es/ecma262/#await)

> [!question]- Що таке backpressure в контексті `for await`?
> *рідко · теорія* · `jsd-11-009`
>
> Споживач тягне дані (pull): наступний `next()` викликається лише після обробки поточного елемента. Тому швидке джерело не завалить повільного споживача — на відміну від push-моделі подій, де дані сиплються незалежно від готовності.
>
> 📚 [[JavaScript - 11. Ітератори та генератори#Async-ітератори та async-генератори|Розділ: async-ітератори]] · [MDN: Streams API concepts](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Concepts) · [Node.js: Backpressuring in Streams](https://nodejs.org/learn/modules/backpressuring-in-streams)

## 🛠️ Практика

> [!task] Поясни своїми словами: iterable vs iterator
> level: junior · difficulty: easy · id: jsd-11-task-01 · tags: feynman, iterators
>
> Поясни, чому `Array` можна обійти двічі, а генератор — лише раз. Використай поняття iterable, iterator і `Symbol.iterator`. До 5 речень, з однією аналогією.
>
> > [!hint]- Підказка 1
> > Що повертає `arr[Symbol.iterator]()` при кожному виклику? А `gen[Symbol.iterator]()`?
>
> > [!hint]- Підказка 2
> > Згадай книжку і закладку.
>
> > [!solution]- Еталонне пояснення
> > Iterable — це «колекція», яка вміє видавати ітератори через `[Symbol.iterator]()`, а iterator — це «закладка» зі станом обходу та методом `next()`. Масив при кожному виклику `[Symbol.iterator]()` створює **нову** закладку на першій сторінці, тож кожен `for…of` починає спочатку. Генератор — це вже закладка: його `[Symbol.iterator]()` повертає самого себе. Після першого проходу вона лежить на останній сторінці, і другий прохід одразу бачить `done: true`. Щоб обходити повторно, треба знову викликати генераторну функцію — взяти нову закладку.

> [!task] Ітерабельний `Range`
> level: middle · difficulty: medium · id: jsd-11-task-02 · tags: iterators, classes
>
> Напиши клас `Range(start, end, step = 1)`, екземпляри якого можна обходити багато разів, з підтримкою від'ємного кроку. Додай метод `reverse()`, що повертає новий `Range`.
>
> ```js
> console.log([...new Range(1, 5, 2)]);    // → [1, 3, 5]
> console.log([...new Range(3, 1, -1)]);   // → [3, 2, 1]
> const r = new Range(1, 3);
> console.log([...r], [...r]);             // → [1, 2, 3] [1, 2, 3]
> console.log([...r.reverse()]);           // → [3, 2, 1]
> ```
>
> ```js starter
> class Range {
>   constructor(start, end, step = 1) {
>     // твій код
>   }
> }
> ```
>
> ```js tests
> test('обходить з кроком, включно з end', () => {
>   expect([...new Range(1, 5, 2)]).toEqual([1, 3, 5])
>   expect([...new Range(1, 3)]).toEqual([1, 2, 3])
> })
>
> test('підтримує відʼємний крок', () => {
>   expect([...new Range(3, 1, -1)]).toEqual([3, 2, 1])
> })
>
> test('можна обходити багато разів', () => {
>   const r = new Range(1, 3)
>   expect([...r]).toEqual([1, 2, 3])
>   expect([...r]).toEqual([1, 2, 3])
>   expect(Array.from(r)).toEqual([1, 2, 3])
> })
>
> test('reverse повертає новий Range у зворотному напрямку', () => {
>   const r = new Range(1, 3)
>   const back = r.reverse()
>   expect(back).toBeInstanceOf(Range)
>   expect([...back]).toEqual([3, 2, 1])
>   expect([...r]).toEqual([1, 2, 3])
> })
>
> test('порожній діапазон і нульовий крок', () => {
>   expect([...new Range(5, 1)]).toEqual([])
>   expect(() => new Range(1, 5, 0)).toThrow(RangeError)
> })
> ```
>
> > [!hint]- Підказка 1
> > Метод класу можна оголосити як генератор: `*[Symbol.iterator]() { … }`.
>
> > [!hint]- Підказка 2
> > Умова продовження залежить від знаку кроку: `step > 0 ? i <= end : i >= end`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class Range {
> >   constructor(start, end, step = 1) {
> >     if (step === 0) throw new RangeError('step must not be 0');
> >     Object.assign(this, { start, end, step });
> >   }
> >
> >   *[Symbol.iterator]() {
> >     const { start, end, step } = this;
> >     for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
> >       yield i;
> >     }
> >   }
> >
> >   reverse() {
> >     return new Range(this.end, this.start, -this.step);
> >   }
> > }
> > ```
> >
> > Повторний обхід працює, бо кожен `for…of` викликає `[Symbol.iterator]()` і отримує **новий** генератор. Нюанс: `reverse()` для `Range(1, 6, 2)` дасть `6, 4, 2` — якщо потрібні ті самі елементи, почни з останнього реально досяжного значення.

> [!task] Власний `async/await` на генераторах
> level: senior · difficulty: hard · id: jsd-11-task-03 · tags: generators, promise, async
>
> Напиши `run(genFn, ...args)`, що виконує генератор, який `yield`-ить проміси, як `async`-функцію: повертає проміс з результатом `return`; rejection промісу кидається всередину генератора (його можна зловити `try/catch`); не-проміси теж підтримуються.
>
> ```js
> const sleep = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
> run(function* (x) {
>   const a = yield sleep(10, x);
>   try {
>     yield Promise.reject(new Error('oops'));
>   } catch (e) {
>     console.log('caught', e.message);
>   }
>   const b = yield 5;
>   return a + b;
> }, 1).then(console.log);
> // → caught oops
> // → 6
> ```
>
> ```js starter
> function run(genFn, ...args) {
>   // твій код
> }
> ```
>
> ```js tests
> const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms))
>
> test('повертає проміс з результатом return і передає аргументи', async () => {
>   const p = run(function* (x, y) {
>     const a = yield wait(5, x)
>     const b = yield wait(5, y)
>     return a + b
>   }, 1, 2)
>   expect(p).toBeInstanceOf(Promise)
>   await expect(p).resolves.toBe(3)
> })
>
> test('не-проміси повертаються в генератор як є', async () => {
>   await expect(run(function* () {
>     const a = yield 5
>     const b = yield 'x'
>     return a + b
>   })).resolves.toBe('5x')
> })
>
> test('rejection кидається всередину генератора і ловиться try/catch', async () => {
>   const caught = []
>   const result = await run(function* () {
>     try {
>       yield Promise.reject(new Error('oops'))
>     } catch (e) {
>       caught.push(e.message)
>     }
>     return 'ok'
>   })
>   expect(caught).toEqual(['oops'])
>   expect(result).toBe('ok')
> })
>
> test('незловлена помилка відхиляє зовнішній проміс', async () => {
>   await expect(run(function* () {
>     yield Promise.reject(new Error('boom'))
>   })).rejects.toThrow('boom')
>   await expect(run(function* () {
>     throw new Error('sync')
>   })).rejects.toThrow('sync')
> })
> ```
>
> > [!hint]- Підказка 1
> > Тобі потрібна рекурсивна функція `step(method, arg)`, де `method` — `'next'` або `'throw'`.
>
> > [!hint]- Підказка 2
> > Загорни `gen[method](arg)` у `try/catch`: якщо генератор кинув і не зловив — відхили зовнішній проміс.
>
> > [!hint]- Підказка 3
> > `Promise.resolve(value).then((v) => step('next', v), (e) => step('throw', e))`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function run(genFn, ...args) {
> >   return new Promise((resolve, reject) => {
> >     const gen = genFn(...args);
> >
> >     function step(method, arg) {
> >       let result;
> >       try {
> >         result = gen[method](arg);
> >       } catch (err) {
> >         return reject(err); // генератор не зловив помилку
> >       }
> >       if (result.done) return resolve(result.value);
> >       Promise.resolve(result.value).then(
> >         (value) => step('next', value),
> >         (error) => step('throw', error),
> >       );
> >     }
> >
> >     step('next', undefined);
> >   });
> > }
> > ```
> >
> > Це майже дослівно те, що робили `co` і Babel-хелпер `asyncToGenerator`. Різниця з нативним `await`: тут кожен крок коштує додаткові тіки через `Promise.resolve(...).then`, а рушій не бачить «справжньої» async-функції, тож stack traces гірші.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Iterables](https://javascript.info/iterable) — `Symbol.iterator` і власні ітерабли.
- 🟢 [javascript.info — Generators](https://javascript.info/generators) — генератори, `yield*` і двосторонній обмін через `next`.
- 🟡 [MDN — Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) — точний опис протоколів iterable та iterator.
- 🟡 [MDN — Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators) — гайд по ітераторах і генераторах з прикладами.
- 🟡 [MDN — Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator) — iterator helpers: `map`, `filter`, `take`, `drop`.
- 🟡 [javascript.info — Async iteration and generators](https://javascript.info/async-iterators-generators) — async-ітератори, `for await` і пагінація.
- 🟡 [Node.js — Backpressuring in Streams](https://nodejs.org/learn/modules/backpressuring-in-streams) — backpressure у потоках Node.js.
- 🔴 [ECMAScript — Iteration](https://tc39.es/ecma262/#sec-iteration) — першоджерело: інтерфейси і `IteratorClose`.
- 🔴 [ECMAScript — Generator Objects](https://tc39.es/ecma262/#sec-generator-objects) — стани генератора і методи `next`/`return`/`throw`.

> [!important] Підсумок
> - Iterable має `[Symbol.iterator]()`, що видає **новий** iterator; iterator має `next()` → `{ value, done }` і опційно `return()`/`throw()`.
> - `for…of`, spread, деструктуризація, `Array.from`, `Promise.all`, `new Map/Set` — усі говорять мовою протоколу; дострокове завершення кличе `return()`.
> - Генератор — функція з паузами: виклик нічого не виконує, `next(v)` передає дані всередину, `return()`/`throw()` керують ззовні, `finally` прибирає.
> - Генератори й iterator helpers ліниві — нескінченні послідовності безпечні, доки не робиш spread.
> - `async function*` + `for await` — природний інструмент для пагінації та стрімів з pull-моделлю.
