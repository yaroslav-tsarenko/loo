---
title: Значення та посилання
order: 3
level: junior
tags: [references, mutation, copying, immutability]
prerequisites:
  - "[[JavaScript - 02. Типи та приведення типів]]"
estimatedMinutes: 30
id: jsd-ch-03
icon: "📦"
---

# Значення та посилання

> [!success] 🎯 Після цього розділу ти зможеш
> - намалювати, що лежить у змінних і в heap після серії присвоєнь примітивів та об'єктів;
> - пояснити, що таке «call by sharing» і передбачити, які зміни аргументу видно ззовні функції;
> - відрізнити мутацію від перепризначення і пояснити, чому `const`-об'єкт можна змінювати;
> - обрати правильний спосіб копіювання (spread, `structuredClone`, власний клон) і назвати обмеження кожного;
> - пояснити, чому `{} === {}` — це `false`, і порівняти об'єкти за вмістом.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jsd-03-quiz-01
>
> ```js
> let x = 1;
> let y = x;
> y++;
>
> const a = { n: 1 };
> function update(obj) {
>   obj.n = 2;
>   obj = { n: 3 };
> }
> update(a);
>
> console.log(x, a.n);
> ```
>
> **Відповідь:** `1 2`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. `y` отримав **копію** числа, тож `x` не змінився. Функція отримала **копію посилання** на об'єкт: `obj.n = 2` змінює той самий об'єкт, що й `a`. А `obj = { n: 3 }` лише перенаправляє локальну змінну `obj` на новий об'єкт — `a` про це не дізнається.

## 🧒 Простими словами

Примітив — це **записка з числом**: коли ти даєш другові копію записки, він може її розірвати чи виправити — твоя записка лишиться як була. Об'єкт — це **квартира**, а змінна — **ключ** від неї. Коли ти робиш `const b = a`, ти не будуєш нову квартиру, а робиш дублікат ключа. Друг зайде з дублікатом і переставить меблі — ти побачиш перестановку. Але якщо друг викине свій ключ і отримає ключ від іншої квартири — у твоїй нічого не зміниться.

## 🔬 Як це працює насправді

### 🏷️ Змінна — це ярлик, а не коробка

Модель, яка працює завжди: **змінна зберігає значення**. Для примітивів значення — це саме число, рядок тощо. Для об'єктів значення — це **посилання** (reference) на об'єкт, який живе в **heap** (купі пам'яті).

```text
let x = 1;            змінні              heap
let y = x;            x ──► 1
const a = { n: 1 };   y ──► 1  (окрема копія)
const b = a;          a ──┐
                          ├──► { n: 1 }    ← один об'єкт
                      b ──┘
```

Присвоєння `=` **завжди копіює значення**. Просто для об'єкта копіюється посилання, а не сам об'єкт.

```js
let y = 1;
let z = y;
z = 2;
console.log(y); // → 1

const a = { n: 1 };
const b = a;
b.n = 2;
console.log(a.n);    // → 2 — це той самий об'єкт
console.log(a === b); // → true — однакові посилання
```

Примітиви ще й **незмінні**: жодна операція не змінює рядок чи число «на місці», вона створює нове значення.

```js
const s = 'hello';
s.toUpperCase();   // → 'HELLO' — новий рядок
console.log(s);    // → 'hello'
```

> [!viz] memory-refs
> scenario: copy-primitive-vs-object

> [!quiz] Перевір себе: що виведе код?
> level: junior · type: output · id: jsd-03-quiz-02
>
> ```js
> const list = [1, 2];
> const alias = list;
> alias.push(3);
> let name = 'Ann';
> let other = name;
> other += '!';
> console.log(list.length, name);
> ```
>
> **Відповідь:** `3 Ann`
>
> **Пояснення:** `alias` і `list` — два ярлики одного масиву, тому `push` видно через обидва. `other += '!'` створює **новий** рядок і записує його лише в `other`.

### 📨 Передача у функцію: call by sharing

JS **завжди передає аргументи за значенням**. Але для об'єктів це значення — посилання. Цю модель називають **call by sharing**: функція отримує копію посилання і *ділить* об'єкт з викликачем.

Звідси дві різні дії всередині функції:

| Дія | Приклад | Видно ззовні? |
|---|---|---|
| **Мутація** — зміна вмісту об'єкта | `obj.n = 2`, `arr.push(1)` | ✅ так, об'єкт спільний |
| **Перепризначення** параметра | `obj = {}`, `arr = []` | ❌ ні, змінюється лише локальна копія посилання |

```js
function rename(user) {
  user.name = 'Bob';      // мутація спільного об'єкта
}
function replace(user) {
  user = { name: 'Eve' }; // локальний ярлик тепер вказує деінде
}
const u = { name: 'Ann' };
rename(u);
replace(u);
console.log(u.name); // → 'Bob'
```

Доказ, що це **не** справжній pass-by-reference (як `ref` у C# чи `&` у C++): у JS неможливо написати функцію `swap(a, b)`, яка поміняє місцями значення змінних викликача.

```js
function swap(a, b) {
  const t = a; a = b; b = t;
}
let p = { v: 1 }, q = { v: 2 };
swap(p, q);
console.log(p.v, q.v); // → 1 2 — нічого не помінялось
```

> [!quiz] Перевір себе: оберіть дії, які змінять масив `nums` викликача
> level: junior · type: multi · id: jsd-03-quiz-03
>
> ```js
> const nums = [3, 1, 2];
> function f(arr) { /* ... */ }
> f(nums);
> ```
>
> - [x] `arr.sort()`
> - [ ] `arr = []`
> - [x] `arr.length = 0`
> - [ ] `arr = arr.concat(4)`
> - [x] `arr[0] = 99`
> - [ ] `const copy = arr.toSorted()`
>
> **Пояснення:** `sort`, зміна `length` і запис за індексом — мутації спільного масиву. `arr = ...` перепризначає локальну змінну, а `concat` і `toSorted` повертають **новий** масив, не чіпаючи старий.

### 🔒 Мутація, перепризначення і `const`

`const` забороняє **перепризначення змінної**, а не зміну об'єкта, на який вона вказує. Ярлик приклеєний намертво — але квартиру за ним можна переобладнати.

```js
const config = { debug: false };
config.debug = true;  // ✅ мутація — дозволено
config = {};          // ❌ TypeError: Assignment to constant variable.
```

Щоб заборонити мутацію, є `Object.freeze` — але він **поверхневий** (shallow): вкладені об'єкти лишаються змінними.

```js
'use strict';
const settings = Object.freeze({ theme: 'dark', tags: ['a'] });
settings.tags.push('b');   // ✅ працює — вкладений масив не заморожений
settings.theme = 'light';  // ❌ TypeError у strict mode (у sloppy — тихо ігнорується)
```

| Інструмент | Що забороняє |
|---|---|
| `const` | перепризначення **змінної** |
| `Object.preventExtensions` | додавання нових властивостей |
| `Object.seal` | додавання й видалення властивостей |
| `Object.freeze` | усе вище + зміну значень (лише верхній рівень) |

> [!quiz] Перевір себе: що з цього кине помилку?
> level: junior · id: jsd-03-quiz-04
>
> ```js
> const team = { members: ['Ann'] };
> ```
>
> - [ ] `team.members.push('Bob')`
> - [ ] `team.lead = 'Ann'`
> - [x] `team = { members: [] }`
> - [ ] `delete team.members`
>
> **Пояснення:** усі варіанти, крім третього, — мутації об'єкта, і `const` їм не заважає. Помилку дає лише спроба перепризначити саму змінну `team`.

### 📋 Копіювання: shallow vs deep

**Shallow copy** (поверхнева) створює новий об'єкт верхнього рівня, але вкладені об'єкти **копіює посиланням**. Способи: spread `{ ...obj }`, `[...arr]`, `Object.assign({}, obj)`, `arr.slice()`, `Array.from(arr)`.

```js
const user = { name: 'Ann', address: { city: 'Kyiv' } };
const copy = { ...user };

copy.name = 'Bob';            // верхній рівень — незалежний
copy.address.city = 'Lviv';   // вкладений об'єкт — спільний!

console.log(user.name);         // → 'Ann'
console.log(user.address.city); // → 'Lviv'
```

> [!viz] memory-refs
> scenario: shallow-vs-deep

**Deep copy** (глибока) рекурсивно копіює все дерево. Сучасний стандартний спосіб — **`structuredClone`** (браузери й Node 17+):

```js
const deep = structuredClone(user);
deep.address.city = 'Odesa';
console.log(user.address.city); // → 'Lviv' — оригінал не зачеплено
```

Порівняння способів глибокого копіювання:

| | `structuredClone` | `JSON.parse(JSON.stringify(x))` |
|---|---|---|
| `Date` | ✅ лишається `Date` | ❌ стає рядком |
| `Map`, `Set` | ✅ | ❌ стають `{}` |
| `undefined` у властивостях | ✅ | ❌ властивість зникає |
| `NaN`, `Infinity` | ✅ | ❌ стають `null` |
| Циклічні посилання | ✅ | ❌ `TypeError` |
| Функції | ❌ `DataCloneError` | ❌ мовчки зникають |
| Прототип класу | ❌ виходить звичайний об'єкт | ❌ теж |

```js
class Point { constructor() { this.x = 1; } }
const clone = structuredClone(new Point());
console.log(clone, clone instanceof Point); // → { x: 1 } false
```

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-03-quiz-05
>
> ```js
> const original = { tags: ['js'], meta: { views: 1 } };
> const a = { ...original };
> const b = structuredClone(original);
> a.tags.push('ts');
> b.meta.views = 100;
> console.log(original.tags.length, original.meta.views);
> ```
>
> **Відповідь:** `2 1`
>
> **Пояснення:** spread зробив shallow copy — `a.tags` і `original.tags` один масив, тож `push` видно в оригіналі. `structuredClone` скопіював `meta` повністю, тож зміна `b.meta` оригіналу не стосується.

> [!quiz] Перевір себе: склади іммутабельне оновлення вкладеного поля
> level: junior · type: order · id: jsd-03-quiz-07
>
> Функція має повернути **новий** `user` з іншим `address.city`, не змінюючи оригінал.
>
> ```js order
> function setCity(user, city) {
>   return {
>     ...user,
>     address: {
>       ...user.address,
>       city,
>     },
>   }
> }
>   user.address.city = city // ✗
> ```
>
> **Пояснення:** spread робить лише shallow copy, тому копіювати треба **кожен рівень на шляху** до зміненого поля: новий `user`, новий `address`. Решта вкладених об'єктів лишаються спільними — і це нормально, бо їх ніхто не мутує. Присвоєння `user.address.city = …` змінило б оригінал через спільне посилання.

### 🟰 Порівняння об'єктів

`===` (і `==` для двох об'єктів) порівнює **посилання**, а не вміст. Два об'єкти рівні, лише якщо це буквально той самий об'єкт.

```js
console.log({} === {});         // → false — два різні об'єкти
console.log([1, 2] === [1, 2]); // → false
const o = {};
console.log(o === o);           // → true
```

Порівняння за вмістом («deep equal») треба писати самому або брати з бібліотеки (`util.isDeepStrictEqual` у Node, `lodash.isEqual`). `JSON.stringify(a) === JSON.stringify(b)` працює лише для простих даних і залежить від **порядку ключів**.

Чому це важливо на практиці: React, мемоізація, `Set`, `Map`, `includes` — усі вони порівнюють об'єкти посиланням. Новий об'єкт `{ ...state }` — це сигнал «щось змінилось»; мутація старого — ні.

> [!quiz] Перевір себе: що поверне вираз?
> level: junior · id: jsd-03-quiz-06
>
> ```js
> new Set([{ id: 1 }, { id: 1 }]).size
> ```
>
> - [ ] `1` — об'єкти однакові
> - [x] `2` — це два різні об'єкти
> - [ ] `0`
> - [ ] `TypeError`
>
> **Пояснення:** `Set` перевіряє унікальність через SameValueZero, а для об'єктів це порівняння посилань. Два літерали `{ id: 1 }` — два різні об'єкти в heap.

> [!quiz] Перевір себе: заповни пропуски в `shallowEqual` — порівнянні «на один рівень»
> level: middle · type: fill · id: jsd-03-quiz-08 · bank: some, values, ===
>
> ```js fill
> function shallowEqual(a, b) {
>   const keysA = Object.[[keys]](a)
>   const keysB = Object.keys(b)
>   if (keysA.length !== keysB.[[length]]) return false
>   return keysA.[[every]]((k) => Object.[[is]](a[k], b[k]))
> }
> shallowEqual({ x: 1 }, { x: 1 })     // → true
> shallowEqual({ o: {} }, { o: {} })   // → false — вкладені порівнюються посиланням
> ```
>
> **Пояснення:** так порівнює пропси `React.memo` і `PureComponent`: однакова кількість ключів і кожне значення — той самий примітив або **той самий** об'єкт (`Object.is`). Вкладені об'єкти порівнюються посиланням, тому новий `{}` на кожному рендері ламає мемоізацію.

## ⚠️ Пастки

> [!pitfall] `Array(n).fill({})` — один об'єкт на всіх
> `fill` кладе **те саме посилання** в кожну комірку.
>
> ```js
> const rows = Array(3).fill({});
> rows[0].hit = true;
> console.log(rows); // → [{ hit: true }, { hit: true }, { hit: true }]
>
> const ok = Array.from({ length: 3 }, () => ({})); // новий об'єкт на кожну комірку
> ```

> [!pitfall] Мутуючі методи масивів
> `sort`, `reverse`, `splice`, `fill`, `push`, `pop`, `shift`, `unshift`, `copyWithin` змінюють масив **на місці** — і масив викликача теж. ES2023 додав немутуючі аналоги: `toSorted`, `toReversed`, `toSpliced`, `with`.
>
> ```js
> function top(scores) {
>   return scores.sort((a, b) => b - a)[0]; // зіпсує порядок у викликача
> }
> function topSafe(scores) {
>   return scores.toSorted((a, b) => b - a)[0];
> }
> ```

> [!pitfall] Shallow copy у стані React/Redux
> Spread копіює лише верхній рівень. Мутація вкладеного об'єкта після spread — це мутація оригінального стану, і компонент може не перерендеритися.
>
> ```js
> const next = { ...state };
> next.user.name = 'Bob'; // ❌ змінено state.user
>
> const fixed = { ...state, user: { ...state.user, name: 'Bob' } }; // ✅
> ```

## 🎤 На співбесіді

> [!interview] У JS аргументи передаються за значенням чи за посиланням?
> level: junior · frequency: дуже часто · id: jsd-03-int-01
>
> ---
>
> Завжди за значенням. Але значенням змінної-об'єкта є **посилання**, тому функція отримує копію посилання — це називають *call by sharing*. Наслідок: мутація об'єкта всередині функції (`obj.x = 1`, `arr.push`) видна ззовні, а перепризначення параметра (`obj = {}`) — ні. Справжнього pass-by-reference немає: не можна написати `swap(a, b)`, що поміняє змінні викликача.
>
> 📚 [[JavaScript - 03. Значення та посилання#📨 Передача у функцію: call by sharing|Розділ: call by sharing]] · [MDN: Functions (guide)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) · [javascript.info: Object references and copying](https://javascript.info/object-copy)

> [!interview] Як скопіювати об'єкт? Чим shallow copy відрізняється від deep copy?
> level: junior · frequency: дуже часто · id: jsd-03-int-02
>
> ---
>
> Shallow copy (`{ ...obj }`, `Object.assign`, `slice`) створює новий об'єкт верхнього рівня, а вкладені об'єкти лишаються спільними. Deep copy копіює все дерево: стандартно — `structuredClone`, який підтримує `Date`, `Map`, `Set`, циклічні посилання, але не функції, DOM-вузли й прототипи класів. `JSON.parse(JSON.stringify())` — застарілий спосіб: губить `undefined`, функції, `Date` стає рядком, `Map` — `{}`, на циклах кидає помилку.
>
> 📚 [[JavaScript - 03. Значення та посилання#📋 Копіювання: shallow vs deep|Розділ: shallow vs deep]] · [MDN: structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) · [MDN: Deep copy](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy)

> [!interview] Чим `const` відрізняється від `Object.freeze`?
> level: junior · frequency: часто · id: jsd-03-int-03
>
> ---
>
> `const` стосується **змінної**: її не можна перепризначити, але об'єкт, на який вона вказує, змінювати можна. `Object.freeze` стосується **об'єкта**: забороняє додавати, видаляти й змінювати властивості, але лише на верхньому рівні — вкладені об'єкти треба заморожувати рекурсивно (deep freeze). У strict mode запис у заморожений об'єкт кидає `TypeError`, у sloppy — мовчки ігнорується.
>
> 📚 [[JavaScript - 03. Значення та посилання#🔒 Мутація, перепризначення і const|Розділ: мутація і const]] · [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) · [MDN: Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

## 🔗 Зв'язки

- [[JavaScript - 02. Типи та приведення типів]] — поділ на примітиви й об'єкти — саме той поділ, що визначає «копія значення» чи «копія посилання».
- [[JavaScript - 05. Замикання]] — замикання тримає посилання на змінні, а через них — на об'єкти; мутація таких об'єктів видна всім, хто їх «замкнув».
- [[JavaScript - 12. Масиви та функціональний стиль]] — функціональний стиль будується на немутуючих операціях: `map`, `filter`, `toSorted` замість мутацій.
- [[JavaScript - 13. Пам'ять і збирач сміття]] — об'єкт живе в heap, поки на нього є хоч одне досяжне посилання.

## ⚡ Фішки

> [!reel] 🪤 Array(3).fill({}) — три ключі від однієї квартири
> `fill` не клонує об'єкт, а кладе одне й те саме посилання в усі комірки. Зміниш перший — «зміняться» всі.
>
> ```js
> const a = Array(3).fill({});
> a[0].x = 1;
> a[2].x // → 1
> ```

> [!reel] 🐍 Дефолтний [] у JS не пастка (на відміну від Python)
> У Python дефолтний список створюється один раз і накопичує дані між викликами. У JS дефолтні параметри обчислюються **при кожному виклику**.
>
> ```js
> const add = (list = []) => (list.push(1), list);
> add(); add(); // → [1] обидва рази
> ```

> [!reel] 🔁 structuredClone не боїться циклів
> Об'єкт, що посилається сам на себе, вбиває `JSON.stringify`, але `structuredClone` акуратно відтворює цикл.
>
> ```js
> const o = {}; o.self = o;
> const c = structuredClone(o);
> c.self === c // → true
> ```

> [!reel] 🧊 Object.freeze — це лише перший поверх
> Заморожений об'єкт не дає змінити свої властивості, але вкладені масиви й об'єкти живуть своїм життям. Для повної незмінності — рекурсивний deep freeze.

> [!reel] 🧵 Рядки в JS незмінні
> `s[0] = 'H'` нічого не робить (а в strict mode — `TypeError`). Будь-який метод рядка повертає новий рядок. Тому рядки безпечно передавати куди завгодно.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чим відрізняється копіювання примітива від копіювання об'єкта?
> *дуже часто · теорія* · `jsd-03-001`
>
> `=` завжди копіює значення змінної. Для примітива це саме значення — копії незалежні. Для об'єкта значення — посилання, тому обидві змінні вказують на **той самий** об'єкт у heap.
>
> 📚 [[JavaScript - 03. Значення та посилання#🏷️ Змінна — це ярлик, а не коробка|Розділ: змінна як ярлик]] · [javascript.info: Object references and copying](https://javascript.info/object-copy) · [MDN: JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures)

> [!question]- Чому можна змінити властивість `const`-об'єкта?
> *часто · теорія* · `jsd-03-002`
>
> `const` забороняє перепризначити змінну, а не змінювати об'єкт. Мутація (`obj.x = 1`) не змінює посилання в змінній, тому дозволена.
>
> 📚 [[JavaScript - 03. Значення та посилання#🔒 Мутація, перепризначення і const|Розділ: мутація і const]] · [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) · [javascript.info: Object references and copying](https://javascript.info/object-copy)

> [!question]- Чому `{} === {}` — `false`?
> *часто · код* · `jsd-03-003`
>
> `===` для об'єктів порівнює посилання. Кожен літерал `{}` створює новий об'єкт у heap, тож посилання різні. Рівні лише змінні, що вказують на один і той самий об'єкт.
>
> 📚 [[JavaScript - 03. Значення та посилання#🟰 Порівняння об'єктів|Розділ: порівняння об'єктів]] · [MDN: Strict equality (===)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) · [MDN: Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)

> [!question]- Чим мутація відрізняється від перепризначення?
> *часто · порівняння* · `jsd-03-004`
>
> Мутація змінює вміст об'єкта (`obj.n = 2`, `arr.push(x)`) — це видно всім, хто має посилання. Перепризначення змінює саму змінну (`obj = {}`) — інші посилання на старий об'єкт не зачеплені.
>
> 📚 [[JavaScript - 03. Значення та посилання#🔒 Мутація, перепризначення і const|Розділ: мутація і перепризначення]] · [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) · [React: Updating Objects in State](https://react.dev/learn/updating-objects-in-state)

### 🟡 Middle

> [!question]- Що таке call by sharing і чому це не pass-by-reference?
> *часто · теорія* · `jsd-03-005`
>
> Функція отримує копію посилання на об'єкт: може мутувати спільний об'єкт, але перепризначення параметра не впливає на змінну викликача. При справжньому pass-by-reference параметр був би псевдонімом змінної, і `swap(a, b)` спрацював би — у JS це неможливо.
>
> 📚 [[JavaScript - 03. Значення та посилання#📨 Передача у функцію: call by sharing|Розділ: call by sharing]] · [MDN: Functions (guide)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) · [javascript.info: Object references and copying](https://javascript.info/object-copy)

> [!question]- Які обмеження має `structuredClone`?
> *іноді · теорія* · `jsd-03-006`
>
> Не клонує функції й DOM-вузли (кидає `DataCloneError`), губить прототип (екземпляр класу стає звичайним об'єктом), ігнорує getter-и як getter-и (копіює їхнє значення) і символьні ключі. Зате підтримує `Date`, `Map`, `Set`, `RegExp`, typed arrays і цикли.
>
> 📚 [[JavaScript - 03. Значення та посилання#📋 Копіювання: shallow vs deep|Розділ: structuredClone]] · [MDN: The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) · [HTML Spec: structuredClone](https://html.spec.whatwg.org/multipage/structured-data.html#dom-structuredclone)

> [!question]- Чому `JSON.parse(JSON.stringify(x))` — поганий deep clone?
> *часто · порівняння* · `jsd-03-007`
>
> Губить `undefined` і функції, `Date` перетворює на рядок, `Map`/`Set` — на `{}`, `NaN`/`Infinity` — на `null`, кидає `TypeError` на циклічних посиланнях. Підходить лише для «чистих» JSON-даних.
>
> 📚 [[JavaScript - 03. Значення та посилання#📋 Копіювання: shallow vs deep|Розділ: shallow vs deep]] · [MDN: JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) · [MDN: Deep copy](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy)

> [!question]- Чому в React не можна мутувати стан навіть через spread-копію?
> *часто · практика* · `jsd-03-008`
>
> Spread — shallow copy: вкладені об'єкти спільні з попереднім станом. React порівнює значення через `Object.is` (за посиланням), тож мутація вкладеного об'єкта не створює нового посилання там, де React його перевіряє, і зміни можуть «загубитися». Треба копіювати кожен рівень шляху до зміни.
>
> 📚 [[JavaScript - 03. Значення та посилання#📋 Копіювання: shallow vs deep|Розділ: shallow vs deep]] · [React: Updating Objects in State](https://react.dev/learn/updating-objects-in-state) · [MDN: Shallow copy](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy)

### 🔴 Senior

> [!question]- Як реалізувати deep freeze і чому `Object.freeze` недостатньо?
> *іноді · код* · `jsd-03-009`
>
> `freeze` заморожує лише власні властивості верхнього рівня. Deep freeze рекурсивно обходить значення-об'єкти:
>
> ```js
> function deepFreeze(obj) {
>   Object.freeze(obj); // спершу себе — так цикл A → B → A зупиниться на isFrozen
>   for (const value of Object.values(obj)) {
>     if (typeof value === 'object' && value !== null && !Object.isFrozen(value)) {
>       deepFreeze(value);
>     }
>   }
>   return obj;
> }
> ```
>
> Порядок важливий: якщо заморожувати об'єкт **після** обходу дітей, циклічне посилання поверне нас до ще не замороженого батька — і рекурсія стане нескінченною. Нюанс: об'єкт, який хтось раніше заморозив поверхнево, буде пропущений разом із дітьми.
>
> 📚 [[JavaScript - 03. Значення та посилання#🔒 Мутація, перепризначення і const|Розділ: freeze і const]] · [MDN: Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) · [javascript.info: Property flags and descriptors](https://javascript.info/property-descriptors)

> [!question]- Чому immutable-оновлення роблять перевірку змін дешевою?
> *іноді · теорія* · `jsd-03-010`
>
> Якщо дані ніколи не мутуються, будь-яка зміна створює новий об'єкт на шляху від кореня до зміненого вузла, а незмінені гілки використовуються повторно (*structural sharing*). Тоді «чи змінилось?» = `prev !== next` — порівняння посилань за O(1) замість глибокого обходу. На цьому тримаються `React.memo`, селектори Redux і Immer.
>
> 📚 [[JavaScript - 03. Значення та посилання#🟰 Порівняння об'єктів|Розділ: порівняння об'єктів]] · [React: Updating Objects in State](https://react.dev/learn/updating-objects-in-state) · [MDN: Object.is()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

## 🛠️ Практика

> [!task] Намалюй пам'ять
> level: junior · difficulty: easy · id: jsd-03-task-01 · tags: references
>
> Що виведе код? Намалюй стрілки «змінна → значення/об'єкт» після кожного рядка.
>
> ```js
> const a = { list: [1] };
> const b = { ...a };
> const c = b;
> c.list.push(2);
> c.flag = true;
> console.log(a.list.length, a.flag, b.flag);
> ```
>
> Запиши відповідь в об'єкт `answer`.
>
> ```js starter
> const answer = {
>   printed: [], // три значення, які надрукує console.log
>   topLevelObjects: 0, // скільки об'єктів верхнього рівня існує в кінці
>   arrays: 0, // скільки масивів існує в кінці
>   // твій код
> }
> ```
>
> ```js tests
> test('push через c видно через a — масив спільний', () => {
>   expect(answer.printed).toHaveLength(3)
>   expect(answer.printed[0]).toBe(2)
> })
>
> test('flag додано лише в копію', () => {
>   expect(answer.printed[1]).toBeUndefined()
>   expect(answer.printed[2]).toBe(true)
> })
>
> test('spread створив новий обʼєкт, а c = b — лише ярлик', () => {
>   expect(answer.topLevelObjects).toBe(2)
> })
>
> test('shallow copy не копіює вкладений масив', () => {
>   expect(answer.arrays).toBe(1)
> })
> ```
>
> > [!hint]- Підказка 1
> > Скільки об'єктів верхнього рівня існує? А скільки масивів?
>
> > [!hint]- Підказка 2
> > `c = b` не створює об'єкт — лише ще один ярлик.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const answer = {
> >   printed: [2, undefined, true],
> >   topLevelObjects: 2, // a і копія, на яку дивляться b і c
> >   arrays: 1,          // list — один на двох
> > }
> > ```
> >
> > Виведе `2 undefined true`.
> >
> > ```text
> > a ──► { list: ─┐ }
> > b ──┐          ├──► [1, 2]   ← один масив на двох (shallow copy)
> > c ──┴► { list: ┘, flag: true }
> > ```
> >
> > Об'єктів верхнього рівня два (`a` і копія, на яку вказують `b` і `c`), масив — один. Тому `push` видно через `a`, а `flag` додано лише в копію.

> [!task] Поясни своїми словами call by sharing
> level: junior · difficulty: medium · id: jsd-03-task-02 · tags: feynman, references
>
> Поясни новачкові, який прийшов з C++, чому цей код **змінює** `cart`, але **не очищає** його. Не використовуй слово «вказівник».
>
> ```js
> function process(items) {
>   items.push('bonus');
>   items = [];
> }
> const cart = ['apple'];
> process(cart);
> console.log(cart); // → ['apple', 'bonus']
> ```
>
> > [!hint]- Підказка 1
> > Що саме отримує параметр `items` — масив чи щось, що веде до масиву?
>
> > [!hint]- Підказка 2
> > Використай аналогію з ключами від квартири.
>
> > [!solution]- Еталонне пояснення
> > Змінна `cart` тримає не сам масив, а «ключ» до нього. Коли ми викликаємо `process(cart)`, функція отримує **дублікат ключа** у свою змінну `items`. Тепер двоє мають доступ до однієї квартири.
> >
> > `items.push('bonus')` — функція зайшла в квартиру своїм ключем і поставила туди нову річ. Квартира спільна, тому `cart` теж «бачить» `'bonus'`.
> >
> > `items = []` — функція викинула свій дублікат і взяла ключ від нової порожньої квартири. Наша квартира й наш ключ при цьому не змінились, тому `cart` досі `['apple', 'bonus']`. У C++ це була б передача вказівника за значенням, а не посилання `&`: змінити саму змінну викликача функція не може.

> [!task] Власний deepClone з підтримкою циклів
> level: middle · difficulty: hard · id: jsd-03-task-03 · tags: recursion, copying
>
> Реалізуй `deepClone(value)` без `structuredClone` і JSON. Має підтримувати: примітиви, масиви, звичайні об'єкти, `Date`, `Map`, `Set` і **циклічні посилання**. Прототип звичайного об'єкта зберігати не обов'язково.
>
> ```js
> const src = { d: new Date(0), m: new Map([['k', { v: 1 }]]), list: [1, { n: 2 }] };
> src.self = src;
> const copy = deepClone(src);
> copy.self === copy;              // → true
> copy.m.get('k') !== src.m.get('k'); // → true
> copy.d instanceof Date;          // → true
> ```
>
> ```js starter
> function deepClone(value, seen = new WeakMap()) {
>   // твій код
> }
> ```
>
> ```js tests
> test('примітиви повертаються як є', () => {
>   expect(deepClone(42)).toBe(42)
>   expect(deepClone('js')).toBe('js')
>   expect(deepClone(null)).toBeNull()
> })
>
> test('вкладені обʼєкти й масиви — нові, але з тим самим вмістом', () => {
>   const src = { list: [1, { n: 2 }], meta: { tags: ['a'] } }
>   const copy = deepClone(src)
>   expect(copy).toEqual(src)
>   expect(copy).not.toBe(src)
>   expect(copy.list[1]).not.toBe(src.list[1])
>   expect(Array.isArray(copy.list)).toBe(true)
> })
>
> test('Date, Map і Set копіюються глибоко зі своїм типом', () => {
>   const src = { d: new Date(0), m: new Map([['k', { v: 1 }]]), s: new Set([{ id: 1 }]) }
>   const copy = deepClone(src)
>   expect(copy.d).toBeInstanceOf(Date)
>   expect(copy.d.getTime()).toBe(0)
>   expect(copy.d).not.toBe(src.d)
>   expect(copy.m.get('k')).toEqual({ v: 1 })
>   expect(copy.m.get('k')).not.toBe(src.m.get('k'))
>   expect([...copy.s][0]).not.toBe([...src.s][0])
> })
>
> test('підтримує циклічні посилання', () => {
>   const src = { name: 'root' }
>   src.self = src
>   const copy = deepClone(src)
>   expect(copy.self).toBe(copy)
>   expect(copy.self).not.toBe(src)
> })
>
> test('зміна копії не зачіпає оригінал', () => {
>   const src = { a: { b: [1] } }
>   const copy = deepClone(src)
>   copy.a.b.push(2)
>   expect(src.a.b).toEqual([1])
> })
> ```
>
> > [!hint]- Підказка 1
> > Рекурсія: примітиви повертай як є, для кожного типу контейнера — створи новий і заповни клонами вмісту.
>
> > [!hint]- Підказка 2
> > Для циклів потрібна пам'ять «оригінал → вже створена копія». Яка колекція дозволяє ключі-об'єкти й не заважає GC?
>
> > [!hint]- Підказка 3
> > Запиши копію в `WeakMap` **до** рекурсивного заповнення — інакше цикл знову дійде до незавершеного об'єкта.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function deepClone(value, seen = new WeakMap()) {
> >   if (typeof value !== 'object' || value === null) return value;
> >   if (seen.has(value)) return seen.get(value);
> >
> >   if (value instanceof Date) return new Date(value.getTime());
> >
> >   if (value instanceof Map) {
> >     const out = new Map();
> >     seen.set(value, out);
> >     value.forEach((v, k) => out.set(deepClone(k, seen), deepClone(v, seen)));
> >     return out;
> >   }
> >   if (value instanceof Set) {
> >     const out = new Set();
> >     seen.set(value, out);
> >     value.forEach((v) => out.add(deepClone(v, seen)));
> >     return out;
> >   }
> >
> >   const out = Array.isArray(value) ? [] : {};
> >   seen.set(value, out);
> >   for (const key of Object.keys(value)) {
> >     out[key] = deepClone(value[key], seen);
> >   }
> >   return out;
> > }
> > ```
> >
> > Ключ до циклів — `seen.set` **перед** рекурсією: коли обхід дійде до `src.self`, у `seen` вже лежить створена копія, і ми повертаємо її. `WeakMap` не тримає оригінали в пам'яті після завершення клонування. Функції повертаються як є (вони `typeof 'function'`) — це свідомий вибір, як у більшості бібліотек.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Object references and copying](https://javascript.info/object-copy) — посилання, копіювання і порівняння об'єктів на простих прикладах.
- 🟡 [MDN — Shallow copy](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy) — що саме копіює shallow copy і де вона «протікає».
- 🟡 [MDN — Deep copy](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy) — визначення deep copy і способи її зробити.
- 🟡 [MDN — The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) — які типи клонуються, а які кидають `DataCloneError`.
- 🟡 [MDN — Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) — поверхнева заморозка, strict mode і приклад deep freeze.
- 🟡 [React — Updating Objects in State](https://react.dev/learn/updating-objects-in-state) — чому стан не мутують і як оновлювати вкладені об'єкти.
- 🔴 [HTML Standard — structuredClone](https://html.spec.whatwg.org/multipage/structured-data.html#dom-structuredclone) — специфікація `structuredClone` і serialization/deserialization.
- 🛠️ [Immer](https://immerjs.github.io/immer/) — бібліотека для «мутабельного» синтаксису з іммутабельним результатом.

> [!important] Підсумок
> - `=` завжди копіює значення; для об'єкта значення — посилання, тож дві змінні можуть вказувати на один об'єкт.
> - Аргументи передаються «call by sharing»: мутацію об'єкта видно ззовні, перепризначення параметра — ні.
> - `const` забороняє перепризначення змінної; `Object.freeze` — мутацію, але лише поверхнево.
> - Spread/`Object.assign` — shallow copy; `structuredClone` — deep copy (без функцій і прототипів); JSON-клон губить типи.
> - `===`, `Set`, `Map`, React порівнюють об'єкти за посиланням: новий об'єкт ≠ старий, навіть з однаковим вмістом.
