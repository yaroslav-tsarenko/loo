---
title: Масиви та функціональний стиль
order: 12
level: middle
tags: [arrays, functional, immutability, sort, currying]
prerequisites:
  - "[[JavaScript - 03. Значення та посилання]]"
  - "[[JavaScript - 05. Замикання]]"
estimatedMinutes: 45
id: jsd-ch-12
icon: "🧺"
---

# JavaScript - 12. Масиви та функціональний стиль

> [!success] 🎯 Після цього розділу ти зможеш
> - Обирати правильний метод для задачі: `map`, `filter`, `reduce`, `flatMap`, `find`/`findLast`, `some`/`every`.
> - Відрізняти мутуючі методи від іммутабельних і оновлювати масиви без мутацій (`toSorted`, `toReversed`, `toSpliced`, `with`).
> - Писати чисті функції та збирати їх у конвеєри через `pipe`/`compose` і каррінг.
> - Уникати пасток `sort` (лексикографічне порівняння, булевий компаратор) і розріджених масивів.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jsd-12-quiz-01
>
> ```js
> const nums = [10, 9, 1, 100];
> console.log(nums.sort());
> ```
>
> - [ ] `[1, 9, 10, 100]`
> - [x] `[1, 10, 100, 9]`
> - [ ] `[100, 10, 9, 1]`
> - [ ] `[10, 9, 1, 100]`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Без компаратора `sort` перетворює елементи на **рядки** і порівнює їх посимвольно: `"10" < "100" < "9"`, бо `"1" < "9"`. І ще: `sort` змінює сам `nums`.

## 🧒 Простими словами

Функціональний стиль — це **конвеєр на заводі**. Деталі (елементи масиву) їдуть стрічкою через станції: одна фарбує (`map`), друга відбраковує (`filter`), третя пакує все в коробку (`reduce`). Кожна станція робить одну річ і **не чіпає** вхідні деталі — вона кладе на стрічку нові. Тому станції можна переставляти, тестувати окремо й не боятися, що хтось за спиною перефарбував твою деталь.

## 🔬 Як це працює насправді

### `map`, `filter`, `reduce`: три кити

- `map(fn)` — новий масив **тієї самої довжини**, де кожен елемент — `fn(x, i, arr)`.
- `filter(fn)` — новий масив з елементами, для яких `fn` повернула truthy.
- `reduce(fn, initial)` — згортає масив в **одне** значення (число, об'єкт, масив, Map).

> [!viz] array-pipeline
> scenario: map-filter-reduce

```js
const users = [
  { name: 'Ann', age: 30 },
  { name: 'Bob', age: 17 },
  { name: 'Cid', age: 25 },
];

const totalNameLength = users
  .filter((u) => u.age >= 18)   // [Ann, Cid]
  .map((u) => u.name)           // ['Ann', 'Cid']
  .reduce((sum, name) => sum + name.length, 0);
console.log(totalNameLength);   // → 6
```

Два правила `reduce`: **завжди передавай `initial`** (без нього порожній масив дасть `TypeError`, а масив з одного елемента поверне його, не викликавши `fn` взагалі) і повертай акумулятор з кожного кроку.

Callback-и отримують **три** аргументи: `(element, index, array)`. Звідси класика:

```js
console.log(['1', '2', '3'].map(parseInt)); // → [1, NaN, NaN]
// parseInt('1', 0) → 1, parseInt('2', 1) → NaN, parseInt('3', 2) → NaN
console.log(['1', '2', '3'].map(Number));   // → [1, 2, 3]
```

> [!quiz] Перевір себе: parseInt у map
> level: middle · type: output · id: jsd-12-quiz-02
>
> ```js
> console.log(['10', '10', '10'].map(parseInt));
> ```
>
> **Відповідь:** `[10, NaN, 2]`
>
> **Пояснення:** другий аргумент — індекс, який `parseInt` сприймає як основу системи числення: `parseInt('10', 0)` → 10 (0 = «визнач сам»), `parseInt('10', 1)` → NaN (основа 1 недопустима), `parseInt('10', 2)` → 2.

> [!quiz] Перевір себе: склади конвеєр «сума оплачених замовлень»
> level: junior · type: order · id: jsd-12-quiz-10
>
> ```js order
> const total = orders
>   .filter((o) => o.paid)
>   .map((o) => o.amount)
>   .reduce((sum, x) => sum + x, 0)
>   .reduce((sum, x) => sum + x) // ✗
> ```
>
> **Пояснення:** спершу відсіяти (`filter`), потім перетворити (`map`), потім згорнути (`reduce`). `initial = 0` обов'язковий: без нього порожній список оплачених замовлень дасть `TypeError: Reduce of empty array with no initial value`.

### Пошук і перевірки

| Метод | Повертає | Зупиняється раніше? |
|---|---|---|
| `find` / `findLast` | елемент або `undefined` | так |
| `findIndex` / `findLastIndex` | індекс або `-1` | так |
| `some` | `true`, якщо хоч один | так, на першому `true` |
| `every` | `true`, якщо всі | так, на першому `false` |
| `includes` | `boolean`, порівняння SameValueZero | так |
| `indexOf` | індекс, порівняння `===` | так |

Краєві випадки, які люблять на співбесідах: `[].every(f)` → `true` (вакуумна істина — немає жодного контрприкладу), `[].some(f)` → `false`; `includes` бачить `NaN`, а `indexOf` — ні.

```js
console.log([].every(() => false));   // → true
console.log([NaN].includes(NaN));     // → true
console.log([NaN].indexOf(NaN));      // → -1
console.log([1, 2, 3, 4].findLast((x) => x % 2)); // → 3
```

> [!quiz] Перевір себе: краєві випадки
> level: middle · type: multi · id: jsd-12-quiz-03
>
> Які вирази дорівнюють `true`?
>
> - [x] `[].every((x) => x > 100)`
> - [ ] `[].some((x) => x > 100)`
> - [x] `[NaN].includes(NaN)`
> - [ ] `[NaN].indexOf(NaN) !== -1`
> - [x] `[0, '', null].some((x) => x === null)`
>
> **Пояснення:** `every` на порожньому масиві — `true`, `some` — `false`. `includes` використовує SameValueZero (де `NaN` дорівнює `NaN`), `indexOf` — суворе `===`.

### `flat` і `flatMap`

`flat(depth = 1)` вирівнює вкладені масиви на задану глибину (`Infinity` — повністю). `flatMap(fn)` = `map(fn).flat()` за один прохід — і заодно спосіб **одночасно фільтрувати й трансформувати**: поверни `[]`, щоб викинути елемент, або кілька елементів, щоб «розмножити».

```js
console.log([1, [2, [3, [4]]]].flat());          // → [1, 2, [3, [4]]]
console.log([1, [2, [3, [4]]]].flat(Infinity));  // → [1, 2, 3, 4]

const tags = posts.flatMap((p) => p.tags);       // усі теги всіх постів
```

> [!quiz] Перевір себе: flatMap
> level: middle · type: output · id: jsd-12-quiz-04
>
> ```js
> console.log([1, 2, 3].flatMap((x) => (x % 2 ? [x, x * 10] : [])));
> ```
>
> **Відповідь:** `[1, 10, 3, 30]`
>
> **Пояснення:** непарні числа «розмножуються» в пару, парне `2` повертає порожній масив і зникає. `flatMap` вирівнює лише на один рівень.

### Іммутабельність: мутуючі методи і їхні безпечні двійники

Масив — об'єкт, і передається **за посиланням** ([[JavaScript - 03. Значення та посилання]]). Мутуючий метод змінює масив для всіх, хто тримає це посилання, — у React чи Redux це означає «стан змінився, а рендер — ні».

| Мутує | Іммутабельна альтернатива |
|---|---|
| `arr.sort(cmp)` | `arr.toSorted(cmp)` (ES2023) |
| `arr.reverse()` | `arr.toReversed()` (ES2023) |
| `arr.splice(i, n, ...items)` | `arr.toSpliced(i, n, ...items)` (ES2023) |
| `arr[i] = v` | `arr.with(i, v)` (ES2023) |
| `arr.push(x)` | `[...arr, x]` |
| `arr.fill`, `arr.copyWithin`, `arr.pop`, `arr.shift`, `arr.unshift` | `slice`, spread, `filter` |

```js
const a = [3, 1, 2];
const b = a.toSorted();
console.log(a, b);           // → [3, 1, 2] [1, 2, 3]
console.log(a.with(0, 9));   // → [9, 1, 2]
console.log(a.toSpliced(1, 1)); // → [3, 2]
```

Важливо: усі ці копії — **поверхневі**. Об'єкти всередині спільні, і `Object.freeze` теж заморожує лише верхній рівень. Для глибоких копій — `structuredClone`.

> [!quiz] Перевір себе: хто мутує?
> level: junior · type: multi · id: jsd-12-quiz-05
>
> Які виклики змінюють вихідний масив `arr`?
>
> - [x] `arr.sort()`
> - [ ] `arr.toSorted()`
> - [x] `arr.reverse()`
> - [ ] `arr.slice(1)`
> - [x] `arr.splice(1, 1)`
> - [ ] `arr.concat([4])`
>
> **Пояснення:** `sort`, `reverse`, `splice` — мутуючі «старожили». `slice`, `concat` і нові `to*`-методи повертають нові масиви.

### Чисті функції та композиція

**Чиста функція**: (1) результат залежить лише від аргументів, (2) немає побічних ефектів — не змінює аргументи, глобальний стан, DOM, не робить I/O. Такі функції легко тестувати, кешувати (мемоізація) і безпечно комбінувати.

**Композиція** — збирання функції з менших. `pipe` застосовує зліва направо (читається як конвеєр), `compose` — справа наліво (як у математиці `f(g(x))`):

```js
const pipe = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x);
const compose = (...fns) => (x) => fns.reduceRight((acc, f) => f(acc), x);

const inc = (x) => x + 1;
const double = (x) => x * 2;
console.log(pipe(inc, double)(3));    // → 8  (3+1)*2
console.log(compose(inc, double)(3)); // → 7  3*2+1
```

> [!quiz] Перевір себе: чиста чи ні?
> level: junior · id: jsd-12-quiz-06
>
> Яка з функцій **чиста**?
>
> - [ ] `(arr) => arr.sort((a, b) => a - b)`
> - [ ] `(x) => x + Math.random()`
> - [x] `(arr) => arr.toSorted((a, b) => a - b)`
> - [ ] `(user) => { user.visited = true; return user; }`
>
> **Пояснення:** `sort` змінює аргумент, `Math.random` робить результат непередбачуваним, третій варіант мутує об'єкт. `toSorted` повертає новий масив і не має побічних ефектів.

### Каррінг і часткове застосування

**Каррінг** перетворює `f(a, b, c)` на `f(a)(b)(c)`. **Часткове застосування** — фіксація частини аргументів: `f.bind(null, a)` або власний helper. Практичний сенс — отримувати спеціалізовані функції з загальних і підставляти їх у `map`/`filter`/`pipe`, які передають один аргумент.

```js
function curry(fn) {
  return function curried(...args) {
    return args.length >= fn.length
      ? fn.apply(this, args)
      : (...more) => curried.apply(this, [...args, ...more]);
  };
}

const add3 = curry((a, b, c) => a + b + c);
console.log(add3(1)(2)(3), add3(1, 2)(3), add3(1)(2, 3)); // → 6 6 6

const hasRole = curry((role, user) => user.roles.includes(role));
const admins = users.filter(hasRole('admin'));
```

Обмеження: `curry` спирається на `fn.length`, а він не рахує rest-параметри (`...args`) і параметри зі значенням за замовчуванням.

> [!quiz] Перевір себе: fn.length
> level: middle · type: output · id: jsd-12-quiz-07
>
> ```js
> const f = (a, b = 2, c) => a + b + c;
> const g = (...args) => args.length;
> console.log(f.length, g.length);
> ```
>
> **Відповідь:** `1 0`
>
> **Пояснення:** `length` рахує параметри **до** першого зі значенням за замовчуванням, а rest-параметр не враховується. Для таких функцій `curry` треба передавати арність явно.

### `sort` і компаратор

1. Без компаратора елементи стають **рядками** й порівнюються за UTF-16 кодами: `[10, 9, 1].sort()` → `[1, 10, 9]`; `'C' < 'a'`; `undefined` завжди в кінці.
2. Компаратор повертає **число**: `< 0` — `a` перед `b`, `> 0` — після, `0` — порядок не змінювати. Для чисел — `(a, b) => a - b`.
3. Булевий компаратор `(a, b) => a > b` повертає лише `true/false` (1/0), ніколи негативне число — це **неконсистентний** компаратор, і результат за специфікацією implementation-defined.
4. З ES2019 `sort` **стабільний**: рівні елементи зберігають відносний порядок — можна сортувати за кількома ключами послідовно.
5. Для людського тексту — `localeCompare` або `Intl.Collator`.

```js
console.log([3, 1, 2].sort((a, b) => a > b)); // → [3, 1, 2] у V8 — нічого не відсортувалось!
console.log(['b', 'a', 'C', 'ä'].sort());     // → ['C', 'a', 'b', 'ä']
console.log(['b', 'a', 'C', 'ä'].sort((x, y) => x.localeCompare(y))); // → ['a', 'ä', 'b', 'C']
```

> [!quiz] Перевір себе: булевий компаратор
> level: middle · id: jsd-12-quiz-08
>
> Що гарантує специфікація для `[5, 1, 4].sort((a, b) => a > b)`?
>
> - [ ] Масив відсортується за зростанням, бо `true` — це 1
> - [ ] Буде `TypeError`, бо компаратор повертає не число
> - [x] Нічого конкретного: компаратор неконсистентний, порядок implementation-defined
>
> **Пояснення:** `true/false` перетворюються на `1/0`, і компаратор ніколи не каже «`a` менше». У V8 такий масив часто лишається невідсортованим, в інших рушіях може «випадково» спрацювати — саме тому баг живе роками. Див. [V8: Getting things sorted in V8](https://v8.dev/blog/array-sort).

> [!quiz] Перевір себе: заповни пропуски — коректне сортування без мутації
> level: middle · type: fill · id: jsd-12-quiz-11 · bank: sort, >, compare
>
> ```js fill
> const nums = [10, 1, 5]
> const asc = nums.[[toSorted]]((a, b) => a [[-]] b) // → [1, 5, 10], nums не змінився
> const names = ['b', 'a', 'C', 'ä']
> const human = names.toSorted((x, y) => x.[[localeCompare]](y)) // → ['a', 'ä', 'b', 'C']
> ```
>
> **Пояснення:** компаратор має повертати **число** зі знаком, тож для чисел — `a - b`, а не `a > b`. `toSorted` (ES2023) — іммутабельний двійник `sort`: повертає новий масив і не чіпає оригінал. Для людського тексту — `localeCompare`, а не порівняння UTF-16 кодів.

### Діри та розріджені масиви

Масив — об'єкт з індексами-ключами, і деяких ключів може **не бути**. Такі місця — *holes* (діри). Їх створюють `new Array(n)`, `[1, , 3]`, `delete arr[i]`, присвоєння `arr[100] = x` за межами довжини.

Різні API поводяться з дірами по-різному:

| Пропускають діри | Бачать `undefined` |
|---|---|
| `forEach`, `map` (діра лишається дірою), `filter`, `reduce`, `some`, `every`, `in`-перевірка | `for…of`, spread, `Array.from`, `find`, `includes`, `entries` |

```js
console.log(Array(3).map((_, i) => i));               // → [ <3 empty items> ]
console.log(Array.from({ length: 3 }, (_, i) => i));  // → [0, 1, 2]
console.log([...Array(3)].map((_, i) => i));          // → [0, 1, 2]

const sparse = [1, , 3];
console.log(1 in sparse); // → false
```

Окрім сюрпризів, діри шкодять швидкодії: V8 позначає такий масив як *holey* (кожне читання перевіряє діру і прототип), а дуже розріджений — переводить у повільний словниковий режим. Позначка holey — назавжди: навіть заповнений до кінця масив не стане знову packed.

> [!quiz] Перевір себе: діри
> level: middle · type: output · id: jsd-12-quiz-09
>
> ```js
> let count = 0;
> [1, , 3].forEach(() => count++);
> console.log(count, [1, , 3].length);
> ```
>
> **Відповідь:** `2 3`
>
> **Пояснення:** `forEach` пропускає діри, тож callback викликається двічі. Але `length` — це «найбільший індекс + 1», і він рахує діру.

## ⚠️ Пастки

> [!pitfall] `sort` мутує і порівнює рядки
> Дві помилки в одному рядку: вихідний масив змінено (а в React це стан!), і числа відсортовано як рядки.
>
> ```js
> const sorted = state.prices.sort();                 // ❌ мутація + лексикографія
> const sorted2 = state.prices.toSorted((a, b) => a - b); // ✅
> ```

> [!pitfall] `Array(n).fill(obj)` — одне посилання на всіх
> `fill` кладе в кожну клітинку **той самий** об'єкт.
>
> ```js
> const grid = Array(2).fill([]);
> grid[0].push('x');
> console.log(grid); // → [['x'], ['x']]
>
> const ok = Array.from({ length: 2 }, () => []); // ✅ новий масив на кожен елемент
> ```

> [!pitfall] `reduce` без початкового значення
> На порожньому масиві — `TypeError: Reduce of empty array with no initial value`. На масиві з одного елемента callback не викликається зовсім — і перетворення типу (наприклад, з об'єкта в число) не відбудеться.
>
> ```js
> [{ price: 5 }].reduce((sum, item) => sum + item.price); // → { price: 5 }, а не 5
> [{ price: 5 }].reduce((sum, item) => sum + item.price, 0); // → 5
> ```

> [!pitfall] `map` заради побічних ефектів
> `map` створює новий масив. Якщо результат не використовується, це сигнал для рев'юера: потрібен `forEach` або `for…of`. І навпаки — `forEach` нічого не повертає, тож `const x = arr.forEach(...)` завжди `undefined`.

## 🎤 На співбесіді

> [!interview] Чим `map` відрізняється від `forEach`?
> level: junior · frequency: дуже часто · id: jsd-12-int-01
>
> ---
>
> `map` повертає **новий масив** тієї ж довжини з результатами callback-а — для трансформацій, його можна чейнити. `forEach` повертає `undefined` і потрібен для побічних ефектів (лог, DOM, запис у зовнішню структуру). Обидва не зупиняються раніше (для цього `for…of` з `break`, `some`/`find`) і обидва ігнорують повернені проміси — з async-callback-ами потрібен `Promise.all(arr.map(...))`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#map, filter, reduce: три кити|Розділ: map, filter, reduce]] · [MDN: Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) · [MDN: Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

> [!interview] Як оновити масив у стані React без мутацій?
> level: middle · frequency: часто · id: jsd-12-int-02
>
> ---
>
> Створити новий масив, щоб змінилося посилання: додати — `[...items, item]`; видалити — `items.filter((x) => x.id !== id)`; оновити — `items.map((x) => (x.id === id ? { ...x, done: true } : x))` або `items.with(i, value)`; відсортувати — `items.toSorted(cmp)`; вставити — `items.toSpliced(i, 0, item)`. Пам'ятаю, що копії поверхневі: змінений вкладений об'єкт теж треба скопіювати (`{ ...x, ... }`).
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Іммутабельність: мутуючі методи і їхні безпечні двійники|Розділ: іммутабельність]] · [React: Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state) · [MDN: Array.prototype.toSorted()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)

> [!interview] Що таке чисті функції, каррінг і композиція і навіщо вони?
> level: middle · frequency: часто · id: jsd-12-int-03
>
> ---
>
> Чиста функція: результат залежить лише від аргументів і немає побічних ефектів — легко тестувати, кешувати, паралелити. Каррінг: `f(a, b)` → `f(a)(b)`, щоб частково застосовувати аргументи й отримувати спеціалізовані унарні функції (`hasRole('admin')`). Композиція: `pipe(f, g, h)(x)` = `h(g(f(x)))` — збирання логіки з дрібних перевірюваних кроків. Разом це дає декларативний код, де кожен крок робить одну річ.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Чисті функції та композиція|Розділ: чисті функції та композиція]] · [Mostly Adequate Guide: Pure Happiness with Pure Functions](https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch03) · [javascript.info: Currying](https://javascript.info/currying-partials)

## 🔗 Зв'язки

- [[JavaScript - 03. Значення та посилання]] — масиви передаються за посиланням, тому мутуючі методи «протікають» до всіх власників.
- [[JavaScript - 05. Замикання]] — `curry`, `pipe` і часткове застосування тримаються на замиканнях над аргументами.
- [[JavaScript - 11. Ітератори та генератори]] — iterator helpers роблять той самий `map/filter`, але ліниво й без проміжних масивів.
- [[JavaScript - 10. async і await]] — `forEach`/`filter` з async-callback-ами не чекають промісів.

## ⚡ Фішки

> [!reel] 🔢 [10, 9, 1].sort() — це [1, 10, 9]
> Без компаратора `sort` порівнює числа як **рядки**: `"10" < "9"`, бо `"1" < "9"`. Компаратор `(a, b) => a - b` — обов'язковий для чисел.

> [!reel] 🤡 ['1','2','3'].map(parseInt) → [1, NaN, NaN]
> `map` передає `(element, index)`, а `parseInt` вважає другий аргумент основою системи числення. `parseInt('2', 1)` — NaN, бо основи 1 не існує.

> [!reel] 🧘 [].every(...) завжди true
> Вакуумна істина: «усі елементи порожнього масиву — дракони» — правда, бо немає жодного контрприкладу. Перевіряй `arr.length` перед `every`, якщо порожнеча означає «ні».

> [!reel] 🪞 toSorted, toReversed, with — без мутацій
> ES2023 дав іммутабельні двійники: `toSorted`, `toReversed`, `toSpliced`, `with(i, v)`. Більше не треба `[...arr].sort()` — і менше багів зі станом у React.

> [!reel] 🕳️ Array(3).map(...) не робить нічого
> `Array(3)` — це три **діри**, а не три `undefined`. `map` пропускає діри, тож повертає ту саму порожнечу. Рецепт: `Array.from({ length: 3 }, (_, i) => i)`.

> [!reel] 🧱 sort стабільний лише з ES2019
> До 2019 V8 використовував нестабільний quicksort для масивів > 10 елементів — рівні елементи могли міняти порядок. Тепер стабільність гарантує специфікація (TimSort у V8).

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що повертають `map`, `filter` і `reduce`?
> *дуже часто · теорія* · `jsd-12-001`
>
> `map` — новий масив тієї ж довжини з перетвореними елементами; `filter` — новий масив з елементами, що пройшли перевірку; `reduce` — одне значення будь-якого типу, накопичене з усіх елементів. Жоден не змінює вихідний масив.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#map, filter, reduce: три кити|Розділ: map, filter, reduce]] · [MDN: Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) · [MDN: Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

> [!question]- Чому `[10, 9, 1].sort()` дає `[1, 10, 9]`?
> *дуже часто · код* · `jsd-12-002`
>
> Без компаратора елементи перетворюються на рядки й порівнюються за UTF-16 кодами: `"1" < "10" < "9"`. Для чисел потрібен `(a, b) => a - b`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#sort і компаратор|Розділ: sort і компаратор]] · [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) · [Spec: Array.prototype.sort](https://tc39.es/ecma262/#sec-array.prototype.sort)

> [!question]- Які методи масиву мутують його?
> *часто · теорія* · `jsd-12-003`
>
> `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`. Іммутабельні двійники: spread, `slice`, `filter`, `toSpliced`, `toSorted`, `toReversed`, `with`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Іммутабельність: мутуючі методи і їхні безпечні двійники|Розділ: мутуючі методи]] · [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) · [React: Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)

> [!question]- Чим `find` відрізняється від `filter`?
> *часто · порівняння* · `jsd-12-004`
>
> `find` повертає **перший** елемент (або `undefined`) і зупиняється. `filter` проходить увесь масив і повертає масив усіх збігів (можливо, порожній).
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Пошук і перевірки|Розділ: пошук і перевірки]] · [MDN: Array.prototype.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) · [MDN: Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

### 🟡 Middle

> [!question]- Чому `['1','2','3'].map(parseInt)` дає `[1, NaN, NaN]`?
> *часто · код* · `jsd-12-005`
>
> `map` передає `(element, index, array)`. `parseInt` бере індекс як radix: `parseInt('2', 1)` — NaN (недопустима основа), `parseInt('3', 2)` — NaN (цифри 3 у двійковій немає). Рішення: `.map(Number)` або `.map((s) => parseInt(s, 10))`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#map, filter, reduce: три кити|Розділ: map і parseInt]] · [MDN: parseInt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) · [MDN: Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

> [!question]- Чому `[].every(fn)` повертає `true`?
> *іноді · теорія* · `jsd-12-006`
>
> Вакуумна істина: `every` шукає контрприклад і повертає `false` на першому. У порожньому масиві контрприкладу немає. Симетрично `[].some(fn)` — `false`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Пошук і перевірки|Розділ: пошук і перевірки]] · [MDN: Array.prototype.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) · [Spec: Array.prototype.every](https://tc39.es/ecma262/#sec-array.prototype.every)

> [!question]- Що не так з компаратором `(a, b) => a > b`?
> *часто · код* · `jsd-12-007`
>
> Він повертає `true/false` (1/0) і ніколи — від'ємне число, тож компаратор неконсистентний, і результат implementation-defined (у V8 масив часто лишається невідсортованим). Правильно: `(a, b) => a - b`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#sort і компаратор|Розділ: sort і компаратор]] · [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) · [V8: Getting things sorted in V8](https://v8.dev/blog/array-sort)

> [!question]- Що таке діри в масиві і як різні методи їх обробляють?
> *іноді · теорія* · `jsd-12-008`
>
> Індекси, яких немає як властивостей (`Array(3)`, `[1, , 3]`, `delete arr[i]`). `forEach`, `map`, `filter`, `reduce`, `some`, `every` їх пропускають; `for…of`, spread, `Array.from`, `includes`, `find` бачать там `undefined`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Діри та розріджені масиви|Розділ: діри в масивах]] · [MDN: Indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections) · [V8: Elements kinds](https://v8.dev/blog/elements-kinds)

### 🔴 Senior

> [!question]- Як реалізувати `pipe` і чим він відрізняється від `compose`?
> *іноді · практика* · `jsd-12-009`
>
> `pipe = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x)` — зліва направо. `compose` — те саме через `reduceRight`, справа наліво (`compose(f, g)(x) = f(g(x))`). `pipe` читається як конвеєр даних, `compose` — як математична композиція.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Чисті функції та композиція|Розділ: композиція]] · [MDN: Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) · [Mostly Adequate Guide: Coding by Composing](https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch05)

> [!question]- Чому `curry` на основі `fn.length` ламається на деяких функціях?
> *рідко · код* · `jsd-12-010`
>
> `fn.length` рахує лише параметри до першого default-значення і не враховує rest-параметр: `((a, b = 1) => {}).length === 1`, `((...xs) => {}).length === 0`. Для таких функцій арність треба передавати явно: `curry(fn, 3)`.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль#Каррінг і часткове застосування|Розділ: каррінг]] · [MDN: Function: length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length) · [javascript.info: Currying](https://javascript.info/currying-partials)

## 🛠️ Практика

> [!task] Поясни своїми словами: чому іммутабельність
> level: junior · difficulty: easy · id: jsd-12-task-01 · tags: feynman, immutability
>
> Поясни, чому `state.items.push(x); setState(state)` у React може не оновити екран, а `setState({ ...state, items: [...state.items, x] })` — оновить. Згадай посилання і чисті функції. До 5 речень.
>
> > [!hint]- Підказка 1
> > Як React (чи `useMemo`, `memo`) дізнається, що дані змінилися? Що він порівнює?
>
> > [!hint]- Підказка 2
> > Що відбувається з посиланням на масив після `push`?
>
> > [!solution]- Еталонне пояснення
> > React і мемоізація порівнюють стан **за посиланням** (`Object.is`) — це дешево, на відміну від глибокого порівняння. `push` змінює той самий масив: посилання не змінилося, тож для React «нічого не сталося», і рендер може не відбутися (або відбудеться з уже зіпсованими «попередніми» даними). Spread створює новий масив і новий об'єкт стану — посилання інше, і зміна помітна одразу. Це та сама ідея, що й чисті функції: не змінюй вхід, а повертай новий результат — тоді «було» і «стало» можна порівняти, відкотити й протестувати.

> [!task] `groupBy` і `countBy` через `reduce`
> level: middle · difficulty: medium · id: jsd-12-task-02 · tags: arrays, reduce
>
> Реалізуй `groupBy(arr, keyFn)` → об'єкт `{ ключ: [елементи] }` і `countBy(arr, keyFn)` → `{ ключ: кількість }` без мутації вхідного масиву.
>
> ```js
> const words = ['apple', 'avocado', 'banana', 'cherry', 'blueberry'];
> groupBy(words, (w) => w[0]); // → { a: ['apple', 'avocado'], b: ['banana', 'blueberry'], c: ['cherry'] }
> countBy(words, (w) => w.length > 5 ? 'long' : 'short'); // → { short: 1, long: 4 }
> ```
>
> ```js starter
> function groupBy(arr, keyFn) {
>   // твій код
> }
>
> function countBy(arr, keyFn) {
>   // твій код
> }
> ```
>
> ```js tests
> const words = ['apple', 'avocado', 'banana', 'cherry', 'blueberry']
>
> test('groupBy збирає елементи за ключем у порядку появи', () => {
>   expect(groupBy(words, (w) => w[0])).toEqual({
>     a: ['apple', 'avocado'],
>     b: ['banana', 'blueberry'],
>     c: ['cherry'],
>   })
> })
>
> test('countBy рахує кількість на ключ', () => {
>   expect(countBy(words, (w) => (w.length > 5 ? 'long' : 'short'))).toEqual({ short: 1, long: 4 })
> })
>
> test('порожній масив → порожній обʼєкт', () => {
>   expect(groupBy([], (x) => x)).toEqual({})
>   expect(countBy([], (x) => x)).toEqual({})
> })
>
> test('keyFn отримує індекс другим аргументом', () => {
>   expect(groupBy(['a', 'b', 'c', 'd'], (_, i) => (i % 2 ? 'odd' : 'even'))).toEqual({ even: ['a', 'c'], odd: ['b', 'd'] })
> })
>
> test('не мутує вхідний масив', () => {
>   const input = [3, 1, 2]
>   groupBy(input, (n) => n % 2)
>   countBy(input, (n) => n % 2)
>   expect(input).toEqual([3, 1, 2])
> })
> ```
>
> > [!hint]- Підказка 1
> > Початкове значення `reduce` — порожній об'єкт. Що буде, якщо ключа ще немає?
>
> > [!hint]- Підказка 2
> > `(acc[key] ??= []).push(item)` — мутація **акумулятора** всередині `reduce` нормальна: його створив сам `reduce`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function groupBy(arr, keyFn) {
> >   return arr.reduce((acc, item, i) => {
> >     const key = keyFn(item, i);
> >     (acc[key] ??= []).push(item);
> >     return acc;
> >   }, {});
> > }
> >
> > function countBy(arr, keyFn) {
> >   return arr.reduce((acc, item, i) => {
> >     const key = keyFn(item, i);
> >     acc[key] = (acc[key] ?? 0) + 1;
> >     return acc;
> >   }, {});
> > }
> > ```
> >
> > У ES2024 є вбудований `Object.groupBy(arr, keyFn)` (повертає об'єкт з `null`-прототипом) і `Map.groupBy` — якщо ключі не рядки. Створювати новий об'єкт на кожному кроці (`{ ...acc, [key]: … }`) — квадратична складність без жодної користі.

> [!task] `curry` з явною арністю + `pipe`
> level: senior · difficulty: hard · id: jsd-12-task-03 · tags: functional, closures
>
> 1. Напиши `curry(fn, arity = fn.length)`, що приймає аргументи будь-якими порціями й зберігає `this`.
> 2. Напиши `pipe(...fns)`.
> 3. Збери з них конвеєр: з масиву замовлень залиш оплачені, візьми суми, просумуй.
>
> ```js
> const filter = curry((pred, arr) => arr.filter(pred));
> const map = curry((fn, arr) => arr.map(fn));
> const sum = (arr) => arr.reduce((a, b) => a + b, 0);
> const paidTotal = pipe(filter((o) => o.paid), map((o) => o.amount), sum);
> console.log(paidTotal([{ paid: true, amount: 10 }, { paid: false, amount: 5 }, { paid: true, amount: 7 }])); // → 17
>
> const log = curry((...parts) => parts.join(' '), 3);
> console.log(log('a')('b', 'c')); // → a b c
> ```
>
> ```js starter
> function curry(fn, arity = fn.length) {
>   // твій код
> }
>
> const pipe = (...fns) => {
>   // твій код
> }
> ```
>
> ```js tests
> test('curry приймає аргументи будь-якими порціями', () => {
>   const add3 = curry((a, b, c) => a + b + c)
>   expect(add3(1)(2)(3)).toBe(6)
>   expect(add3(1, 2)(3)).toBe(6)
>   expect(add3(1)(2, 3)).toBe(6)
>   expect(add3(1, 2, 3)).toBe(6)
> })
>
> test('часткові застосування незалежні одне від одного', () => {
>   const add = curry((a, b) => a + b)
>   const add5 = add(5)
>   expect(add5(1)).toBe(6)
>   expect(add5(10)).toBe(15)
>   expect(add(1)(1)).toBe(2)
> })
>
> test('явна арність для rest-параметрів', () => {
>   const log = curry((...parts) => parts.join(' '), 3)
>   expect(log('a')('b', 'c')).toBe('a b c')
> })
>
> test('curry зберігає this', () => {
>   const obj = { base: 10, add: curry(function (a, b) { return this.base + a + b }) }
>   expect(obj.add(1, 2)).toBe(13)
> })
>
> test('pipe застосовує функції зліва направо', () => {
>   expect(pipe((x) => x + 1, (x) => x * 2)(3)).toBe(8)
>   expect(pipe()(7)).toBe(7)
> })
>
> test('конвеєр: сума оплачених замовлень', () => {
>   const filter = curry((pred, arr) => arr.filter(pred))
>   const map = curry((fn, arr) => arr.map(fn))
>   const sum = (arr) => arr.reduce((a, b) => a + b, 0)
>   const paidTotal = pipe(filter((o) => o.paid), map((o) => o.amount), sum)
>   expect(paidTotal([{ paid: true, amount: 10 }, { paid: false, amount: 5 }, { paid: true, amount: 7 }])).toBe(17)
> })
> ```
>
> > [!hint]- Підказка 1
> > Накопичуй аргументи в замиканні й порівнюй їхню кількість з `arity`.
>
> > [!hint]- Підказка 2
> > Кожен частковий виклик має повертати **нову** функцію з власною копією аргументів — інакше два різні часткові застосування зіпсують одне одного.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function curry(fn, arity = fn.length) {
> >   return function curried(...args) {
> >     if (args.length >= arity) return fn.apply(this, args);
> >     return function (...more) {
> >       return curried.apply(this, [...args, ...more]);
> >     };
> >   };
> > }
> >
> > const pipe = (...fns) => (input) => fns.reduce((acc, fn) => fn(acc), input);
> > ```
> >
> > Кожен виклик `curried` створює новий масив `[...args, ...more]`, тож `const addTo5 = add(5)` можна безпечно перевикористовувати. Порядок аргументів «спершу конфігурація, потім дані» (`filter(pred)(arr)`) — головний трюк data-last бібліотек на кшталт Ramda: функції стають придатними для `pipe`.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Array methods](https://javascript.info/array-methods) — огляд методів масивів з вправами.
- 🟢 [javascript.info — Currying](https://javascript.info/currying-partials) — каррінг і часткове застосування.
- 🟡 [MDN — Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) — усі методи масиву, з поміткою, які мутують.
- 🟡 [MDN — Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) — компаратор, стабільність і порядок за замовчуванням.
- 🟡 [MDN — Indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections) — розріджені масиви і як із ними поводяться методи.
- 🟡 [React — Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state) — іммутабельні оновлення масивів у стані.
- 🟡 [Mostly Adequate Guide — Pure Happiness with Pure Functions](https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch03) — чисті функції простими словами.
- 🔴 [ECMAScript — Array.prototype.sort](https://tc39.es/ecma262/#sec-array.prototype.sort) — алгоритм `sort` і вимоги до компаратора.
- 🔴 [V8 — Elements kinds](https://v8.dev/blog/elements-kinds) — як V8 оптимізує масиви і чому діри шкодять.

> [!important] Підсумок
> - `map` — трансформувати, `filter` — відібрати, `reduce` — згорнути (завжди з `initial`), `flatMap` — трансформувати з фільтрацією; `find/some/every` зупиняються раніше.
> - `sort`, `reverse`, `splice` мутують — у стані використовуй `toSorted`, `toReversed`, `toSpliced`, `with`; усі копії поверхневі.
> - Чисті функції + `pipe`/`compose` + каррінг = маленькі перевірювані кроки, зібрані в конвеєр.
> - `sort` без компаратора порівнює рядки; компаратор повертає число, а не boolean; з ES2019 сортування стабільне.
> - Діри (`Array(n)`) пропускаються `map/forEach`, але видні `for…of`/spread — створюй масиви через `Array.from({ length })`.
