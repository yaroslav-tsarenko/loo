---
title: Обʼєкти глибоко
order: 16
level: middle
tags: [objects, property-descriptors, getters-setters, immutability, destructuring, optional-chaining]
prerequisites:
  - "[[JavaScript - 03. Значення та посилання]]"
  - "[[JavaScript - 07. Прототипи та класи]]"
estimatedMinutes: 50
id: jsd-ch-16
icon: "🗂️"
---

# Обʼєкти глибоко

> [!success] 🎯 Після цього розділу ти зможеш
> - передбачити порядок ключів у `Object.keys`, `for…in` і `JSON.stringify`;
> - прочитати й змінити дескриптор властивості (`writable`, `enumerable`, `configurable`) і пояснити, чим data-властивість відрізняється від accessor;
> - обрати між `Object.freeze`, `seal`, `preventExtensions` і `const` та пояснити, чому всі вони поверхневі;
> - впевнено користуватися `Object.entries/fromEntries/assign/groupBy`, деструктуризацією, `?.`, `??` і `??=`;
> - пояснити різницю між `in`, `Object.hasOwn` і `hasOwnProperty`.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-16-quiz-01
>
> ```js
> const obj = { b: 1, 2: 'two', a: 2, 1: 'one' };
> Object.defineProperty(obj, 'secret', { value: 42 });
> obj.secret = 0;
> console.log(Object.keys(obj).join(','), obj.secret);
> ```
>
> **Відповідь:** `1,2,b,a 42`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Ключі-індекси йдуть першими за зростанням, далі рядки в порядку створення. `defineProperty` без явних прапорців створює властивість, яка **не** перелічується і **не** записується — тому її немає в `keys`, а присвоєння `0` тихо ігнорується (у strict mode кинуло б `TypeError`).

## 🧒 Простими словами

Об'єкт — це шафа з шухлядками, на кожній — наліпка з назвою. Але в кожної шухлядки є ще й **налаштування**: чи можна в неї щось покласти (writable), чи видно її в інвентарному списку (enumerable), чи можна її вийняти або переробити (configurable). Деякі шухлядки взагалі «чарівні»: відкриваєш — і там щоразу щось обчислюється (getter). А `Object.freeze` — це замок на шафі, але лише на зовнішніх дверцятах: коробки всередині шухлядок він не замикає.

## 🔬 Як це працює насправді

### 🔑 Ключі властивостей і їхній порядок

Ключ властивості — це **лише рядок або символ**. Усе інше приводиться до рядка: `obj[1]` і `obj['1']` — та сама властивість, а об'єкт-ключ стає `'[object Object]'`.

```js
const bag = {};
bag[1] = 'num';
bag['1'] = 'str';           // перезаписує ту саму властивість
bag[{}] = 'obj';            // ключ '[object Object]'
console.log(Object.keys(bag)); // → ['1', '[object Object]']
```

Порядок власних ключів задає специфікація (*OrdinaryOwnPropertyKeys*), і всі сучасні API — `Object.keys`, `Object.entries`, `JSON.stringify`, `for…in`, `Reflect.ownKeys` — йому підкоряються:

```text
  1️⃣ integer-ключі (індекси масиву: '0', '1', '2', … ) — за ЗРОСТАННЯМ
  2️⃣ інші рядкові ключі                                   — у порядку СТВОРЕННЯ
  3️⃣ символи                                             — у порядку СТВОРЕННЯ (лише Reflect.ownKeys / getOwnPropertySymbols)
```

```js
const sym = Symbol('s');
const o = { b: 1, [sym]: 2, 10: 'a', 2: 'b', '-1': 3, '1.5': 4, '01': 5 };
console.log(Reflect.ownKeys(o)); // → ['2', '10', 'b', '-1', '1.5', '01', Symbol(s)]
```

`'-1'`, `'1.5'` і `'01'` — не індекси масиву, тож вони звичайні рядки й ідуть у порядку створення. Наслідок для практики: якщо ключі — числові id (`{ 300: …, 5: … }`), порядок вставки **не збережеться**. Потрібен порядок вставки для будь-яких ключів — бери `Map` (див. [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]]).

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-16-quiz-02
>
> ```js
> const prices = { 300: 'c', banana: 1, 5: 'a', apple: 2, 42: 'b' };
> console.log(Object.keys(prices).join(' '));
> ```
>
> **Відповідь:** `5 42 300 banana apple`
>
> **Пояснення:** числові ключі-індекси сортуються за зростанням і йдуть першими, решта рядків — у порядку додавання.

### 🧾 Дескриптори, getters і setters

Кожна властивість — це не просто «ключ → значення», а запис з **атрибутами**. Їх два види:

| Атрибут | Data-властивість | Accessor-властивість | Що означає |
|---|---|---|---|
| `value` | ✅ | — | саме значення |
| `writable` | ✅ | — | чи можна змінити `value` присвоєнням |
| `get` / `set` | — | ✅ | функції, що викликаються при читанні/записі |
| `enumerable` | ✅ | ✅ | чи видно в `keys`, `for…in`, spread, `JSON.stringify` |
| `configurable` | ✅ | ✅ | чи можна видалити й змінювати атрибути |

Головна пастка: **значення за замовчуванням різні**. Властивість, створена присвоєнням чи літералом, має всі прапорці `true`. Створена через `Object.defineProperty` — усі пропущені прапорці `false`.

```js
const user = { name: 'Ann' };
console.log(Object.getOwnPropertyDescriptor(user, 'name'));
// → { value: 'Ann', writable: true, enumerable: true, configurable: true }

Object.defineProperty(user, 'id', { value: 7 });
console.log(Object.getOwnPropertyDescriptor(user, 'id'));
// → { value: 7, writable: false, enumerable: false, configurable: false }
console.log(Object.keys(user), JSON.stringify(user)); // → ['name'] '{"name":"Ann"}'
```

Порушення `writable: false` у sloppy mode **тихо ігнорується**, а в strict mode (модулі, класи) кидає `TypeError: Cannot assign to read only property`. `configurable: false` — майже незворотний: не можна видалити властивість, змінити її тип (data ↔ accessor) чи повернути `writable` у `true`. Єдине дозволене — змінити `writable` з `true` на `false` і змінити `value`, поки `writable: true`. Так влаштовані `Math.PI` і `length` масиву.

**Accessor-властивість** (getter/setter) не зберігає значення — вона викликає функції:

```js
const temp = {
  celsius: 20,
  get fahrenheit() { return this.celsius * 1.8 + 32; },
  set fahrenheit(f) { this.celsius = (f - 32) / 1.8; },
};
console.log(temp.fahrenheit); // → 68
temp.fahrenheit = 212;
console.log(temp.celsius);    // → 100
```

Типові застосування: обчислювані поля, валідація в setter-і, **ліниві** значення (getter обчислює і «підміняє» себе data-властивістю):

```js
const report = {
  get data() {
    const value = [1, 2, 3].map((x) => x * 2); // уяви важкий розрахунок
    Object.defineProperty(this, 'data', { value, enumerable: true }); // кеш замість getter-а
    return value;
  },
};
console.log(report.data, report.data === report.data); // → [2, 4, 6] true
```

> [!quiz] Перевір себе: оберіть правдиві твердження
> level: middle · type: multi · id: jsd-16-quiz-03
> - [x] `Object.defineProperty(o, 'x', { value: 1 })` створює властивість, яку не видно в `Object.keys`
> - [ ] Присвоєння read-only властивості завжди кидає помилку
> - [x] Властивість з `configurable: false` не можна видалити через `delete`
> - [x] Accessor-властивість не має атрибутів `value` і `writable`
> - [ ] `JSON.stringify` серіалізує й non-enumerable властивості
>
> **Пояснення:** у sloppy mode запис у read-only властивість тихо ігнорується — помилка лише в strict mode. `JSON.stringify`, `Object.keys` і spread бачать тільки власні enumerable рядкові ключі.

> [!quiz] Перевір себе: заповни пропуски — обчислювана властивість, якої не видно в keys
> level: middle · type: fill · id: jsd-16-quiz-08 · bank: writable, set, value
>
> ```js fill
> const user = { first: 'Ann', last: 'Lee' }
> Object.[[defineProperty]](user, 'full', {
>   [[get]]() { return this.first + ' ' + this.last },
>   [[enumerable]]: false,
> })
> user.full          // → 'Ann Lee'
> Object.keys(user)  // → ['first', 'last']
> ```
>
> **Пояснення:** `get` робить `full` accessor-властивістю — значення обчислюється при кожному читанні. `enumerable: false` ховає її від `keys`, spread і `JSON.stringify` (для `defineProperty` це й так значення за замовчуванням). `writable` і `value` в accessor-дескрипторі заборонені — `TypeError`.

### 🧊 freeze, seal і preventExtensions

Три рівні «замикання» об'єкта, кожен — надмножина попереднього:

| Дія | звичайний | `preventExtensions` | `seal` | `freeze` |
|---|---|---|---|---|
| Додати властивість | ✅ | ❌ | ❌ | ❌ |
| Видалити властивість | ✅ | ✅ | ❌ | ❌ |
| Змінити значення | ✅ | ✅ | ✅ | ❌ |
| Змінити дескриптор | ✅ | ✅ | ❌ | ❌ |
| Перевірка | — | `Object.isExtensible` | `Object.isSealed` | `Object.isFrozen` |

`seal` = `preventExtensions` + усім властивостям `configurable: false`. `freeze` = `seal` + усім data-властивостям `writable: false`. Getter-и і setter-и замороженого об'єкта **продовжують працювати** — вони просто функції.

Найважливіше: усі три — **поверхневі** (shallow). Вкладені об'єкти лишаються змінними.

```js
const config = Object.freeze({ db: { host: 'localhost' }, retries: 3 });
config.retries = 10;       // тихо ігнорується (sloppy) або TypeError (strict)
config.db.host = 'prod';   // ✅ працює — db не заморожено
console.log(config.retries, config.db.host); // → 3 'prod'
```

> [!viz] memory-refs
> scenario: shallow-vs-deep

Глибоке заморожування — рекурсія по власних властивостях:

```js
function deepFreeze(obj) {
  for (const key of Reflect.ownKeys(obj)) {
    const value = obj[key];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) deepFreeze(value);
  }
  return Object.freeze(obj);
}
const cfg = deepFreeze({ db: { host: 'localhost' } });
console.log(Object.isFrozen(cfg.db)); // → true
```

`const` тут ні до чого: він забороняє **перепризначити змінну**, а не змінювати об'єкт (див. [[JavaScript - 03. Значення та посилання]]). І ще нюанс: методи масиву, які додають елементи, кидають `TypeError` на замороженому масиві **навіть у sloppy mode** — `push` всередині робить «суворий» запис.

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-16-quiz-04
>
> ```js
> const s = Object.seal({ a: 1, nested: { b: 1 } });
> s.a = 2;
> s.c = 3;
> delete s.a;
> s.nested.b = 2;
> console.log(s.a, s.c, s.nested.b);
> ```
>
> **Відповідь:** `2 undefined 2`
>
> **Пояснення:** `seal` дозволяє змінювати значення наявних властивостей, але забороняє додавати й видаляти. Вкладений об'єкт не запечатано — він змінюється вільно.

> [!quiz] Перевір себе: склади `deepFreeze`
> level: middle · type: order · id: jsd-16-quiz-09
>
> ```js order
> function deepFreeze(obj) {
>   for (const key of Reflect.ownKeys(obj)) {
>     const value = obj[key]
>     if (value && typeof value === 'object') deepFreeze(value)
>   }
>   return Object.freeze(obj)
> }
>   return Object.seal(obj) // ✗
> ```
>
> **Пояснення:** `freeze` поверхневий, тому спершу рекурсивно заморожуємо вкладені об'єкти, а потім сам об'єкт. `Reflect.ownKeys` бачить і символьні, і non-enumerable ключі. `seal` лишив би значення змінними.

### 🧰 Object.keys, entries, assign, groupBy і перевірка наявності

| Метод | Що повертає | Бачить успадковані? | Бачить non-enumerable? | Бачить символи? |
|---|---|---|---|---|
| `Object.keys/values/entries` | масив | ❌ | ❌ | ❌ |
| `for…in` | ітерує ключі | ✅ | ❌ | ❌ |
| `Object.getOwnPropertyNames` | масив | ❌ | ✅ | ❌ |
| `Reflect.ownKeys` | масив | ❌ | ✅ | ✅ |
| `{ ...obj }`, `Object.assign` | копія | ❌ | ❌ | ✅ |

**`entries` + `fromEntries`** — найзручніший спосіб «перетворити об'єкт як масив»:

```js
const prices = { apple: 10, pear: 20 };
const withVat = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 1.2]),
);
console.log(withVat); // → { apple: 12, pear: 24 }
console.log(Object.fromEntries(new URLSearchParams('a=1&b=2'))); // → { a: '1', b: '2' }
```

**`Object.assign` проти spread.** Обидва — поверхнева копія власних enumerable-властивостей, і обидва **викликають getter-и джерела** (копіюють значення, не дескриптор). Різниця: `assign` **присвоює** в ціль (спрацюють setter-и цілі), spread — **визначає** нові властивості в новому об'єкті. Щоб скопіювати разом з getter-ами, потрібні дескриптори: `Object.defineProperties({}, Object.getOwnPropertyDescriptors(src))`.

**`Object.groupBy`** (ES2024) групує елементи за ключем, який повертає callback. Результат — об'єкт **без прототипу**; для ключів-об'єктів є `Map.groupBy`.

```js
const people = [{ name: 'Ann', team: 'a' }, { name: 'Bob', team: 'b' }, { name: 'Eve', team: 'a' }];
const byTeam = Object.groupBy(people, (p) => p.team);
console.log(byTeam.a.map((p) => p.name)); // → ['Ann', 'Eve']
```

**Перевірка наявності властивості:**

```js
const proto = { inherited: 1 };
const child = Object.create(proto);
child.own = 2;
console.log('inherited' in child);              // → true — оператор in йде ланцюжком прототипів
console.log(Object.hasOwn(child, 'inherited')); // → false — лише власні
console.log(child.own !== undefined);           // ⚠️ хибить, якщо значення справді undefined
```

> [!viz] prototype-chain
> scenario: lookup

`Object.hasOwn(obj, key)` (ES2022) — сучасна заміна `obj.hasOwnProperty(key)`, яка ламається на об'єктах без прототипу (`Object.create(null)`, результат `groupBy`) і на об'єктах, де `hasOwnProperty` перевизначено.

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-16-quiz-05
>
> ```js
> const dict = Object.create(null);
> dict.key = 1;
> console.log('key' in dict, Object.hasOwn(dict, 'key'), typeof dict.hasOwnProperty);
> ```
>
> **Відповідь:** `true true undefined`
>
> **Пояснення:** у об'єкта без прототипу немає `hasOwnProperty`, тож `dict.hasOwnProperty('key')` кинув би `TypeError`. `in` і `Object.hasOwn` працюють з будь-яким об'єктом.

### 📤 Деструктуризація, shorthand і computed keys

Деструктуризація — це «патерн», що розбирає значення на змінні. Default спрацьовує лише для `undefined`, rest збирає решту **власних enumerable** властивостей.

```js
const { a = 10, b: renamed = 5, ...others } = { a: undefined, b: null, c: 3, d: 4 };
console.log(a, renamed, others); // → 10 null { c: 3, d: 4 }

const [first, , third = 'def', ...tail] = [1, 2, undefined, 4, 5];
console.log(first, third, tail); // → 1 'def' [4, 5]

let x = 1, y = 2;
[x, y] = [y, x];                 // обмін без тимчасової змінної
const { user: { address: { city } = {} } = {} } = {}; // вкладена + захист від undefined
console.log(x, y, city);         // → 2 1 undefined
```

```text
  const { b: renamed = 5 } = source
          │   │          │
          │   │          └─ default, якщо source.b === undefined
          │   └─ ІМ'Я НОВОЇ ЗМІННОЇ
          └─ ЯКУ властивість читаємо
```

**Shorthand і computed keys** у літералах:

```js
const name = 'Ann', field = 'age';
const person = {
  name,                         // shorthand: name: name
  [field]: 30,                  // computed key: ключ обчислюється з виразу
  [`is${field}Valid`]() { return this.age > 0; }, // computed метод
  greet() { return `Hi, ${this.name}`; },         // shorthand-метод
};
console.log(person.age, person.isageValid(), person.greet()); // → 30 true 'Hi, Ann'
```

Дублікати ключів у літералі дозволені: перемагає **останній** (`{ a: 1, a: 2 }` → `{ a: 2 }`). Особливий ключ `__proto__: value` у літералі не створює властивість, а **задає прототип**.

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-16-quiz-06
>
> ```js
> const settings = { theme: null, size: 0 };
> const { theme = 'dark', size = 12, lang = 'uk' } = settings;
> console.log(theme, size, lang);
> ```
>
> **Відповідь:** `null 0 uk`
>
> **Пояснення:** default у деструктуризації — як і в параметрах — лише для `undefined`. `null` і `0` — реальні значення.

### ❓ Optional chaining і nullish

**`?.`** зупиняє обчислення, якщо ліва частина — `null` або `undefined`, і повертає `undefined`. Важливо: замикається **весь ланцюжок праворуч** (short-circuit), а не лише одна ланка.

```js
const data = { user: { address: null, greet() { return 'hi'; } } };
console.log(data.user?.address?.city); // → undefined
console.log(data.nope?.x.y.z);         // → undefined — .x.y.z навіть не обчислюються
console.log(data.user.greet?.(), data.user.missing?.()); // → 'hi' undefined
console.log(data.list?.[0]);           // → undefined
```

Обмеження: `?.` не можна використати ліворуч від присвоєння (`a?.b = 1` — `SyntaxError`), і він не рятує від інших помилок: `data.user.missing()` без `?.` все одно кине `TypeError`.

**`??`** (nullish coalescing) повертає праву частину лише для `null`/`undefined`. **`||`** — для будь-якого falsy (`0`, `''`, `false`, `NaN`).

```js
console.log(0 || 5, 0 ?? 5);         // → 5 0
console.log('' || 'def', '' ?? 'def'); // → 'def' ''
// null ?? 1 || 2  → SyntaxError: змішувати ?? з || або && без дужок не можна
```

**Логічні присвоєння** `??=`, `||=`, `&&=` — короткозамкнені: присвоєння відбувається **лише** якщо потрібне. Тобто `obj.x ??= v` — це `obj.x ?? (obj.x = v)`, а не `obj.x = obj.x ?? v` (setter не викликається зайвий раз, заморожений об'єкт не кидає помилку).

```js
const cfg = { retries: 0, name: '' };
cfg.retries ??= 3;    // 0 — не nullish, лишається 0
cfg.timeout ??= 1000; // undefined → 1000
cfg.name ||= 'anon';  // '' — falsy → 'anon'
console.log(cfg);     // → { retries: 0, name: 'anon', timeout: 1000 }
```

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-16-quiz-07
>
> ```js
> const resp = { count: 0, items: null };
> console.log(resp.count || 10, resp.count ?? 10, resp.items?.length ?? 'none');
> ```
>
> **Відповідь:** `10 0 none`
>
> **Пояснення:** `||` замінює falsy `0`, а `??` — ні. `resp.items?.length` дає `undefined`, і `??` підставляє `'none'`.

## ⚠️ Пастки

> [!pitfall] `||` для значень за замовчуванням ламає `0` і `''`
> `const page = query.page || 1` перетворить легальний `0` на `1`, а порожній рядок — на default. Для «немає значення» використовуй `??`.
>
> ```js
> const volume = 0;
> console.log(volume || 50, volume ?? 50); // → 50 0
> ```

> [!pitfall] Setter, що викликає сам себе
> Присвоєння `this.name = v` всередині `set name(v)` знову викликає setter — нескінченна рекурсія і `RangeError`. Зберігай значення в іншому полі (`this._name`) або в `#private`.
>
> ```js
> const bad = { set name(v) { this.name = v; } };
> // bad.name = 'x'; → RangeError: Maximum call stack size exceeded
> ```

> [!pitfall] Деструктуризація без `let/const` на початку рядка
> Рядок, що починається з `{`, парсер сприймає як блок коду. Для присвоєння в уже оголошені змінні потрібні дужки.
>
> ```js
> let a;
> // { a } = { a: 1 };  → SyntaxError
> ({ a } = { a: 1 });   // ✅
> ```

> [!pitfall] `Object.freeze` не робить об'єкт «глибоко» незмінним
> Заморожений конфіг з вкладеним `db` — вкладений об'єкт усе ще змінний. А в sloppy mode невдалий запис узагалі мовчить, тож баг непомітний. Використовуй `deepFreeze`, strict mode або іммутабельні оновлення (`{ ...obj, db: { ...obj.db, host } }`).

## 🎤 На співбесіді

> [!interview] Як зробити об'єкт незмінним? Чим `const`, `freeze` і `seal` відрізняються?
> level: middle · frequency: дуже часто · id: jsd-16-int-01
>
> ---
>
> `const` захищає **змінну** від перепризначення, а не об'єкт від змін. `Object.preventExtensions` забороняє додавати властивості; `seal` — ще й видаляти та переналаштовувати (усі `configurable: false`); `freeze` — ще й змінювати значення (data-властивості `writable: false`). Усі три поверхневі — вкладені об'єкти лишаються змінними, тому для глибокої незмінності потрібен рекурсивний `deepFreeze` або іммутабельні оновлення через spread. Порушення в sloppy mode ігноруються мовчки, у strict — `TypeError`.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#🧊 freeze, seal і preventExtensions|Розділ: freeze, seal і preventExtensions]] · [MDN: Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) · [Spec: Object.freeze](https://tc39.es/ecma262/#sec-object.freeze)

> [!interview] Що таке дескриптори властивостей і де вони трапляються на практиці?
> level: senior · frequency: часто · id: jsd-16-int-02
>
> ---
>
> Кожна властивість має атрибути: data-властивість — `value`, `writable`, `enumerable`, `configurable`; accessor — `get`, `set`, `enumerable`, `configurable`. Читаються через `Object.getOwnPropertyDescriptor`, задаються через `Object.defineProperty`, де пропущені прапорці — `false`. На практиці: приховані (non-enumerable) службові поля, read-only константи (`Math.PI`), обчислювані й ліниві властивості, `length` масиву, методи класів (вони non-enumerable, тому не видно в `for…in`), реактивність Vue 2 (getter/setter на кожному полі). `freeze`/`seal` — це масова зміна дескрипторів.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#🧾 Дескриптори, getters і setters|Розділ: дескриптори]] · [MDN: Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) · [Spec: Property Attributes](https://tc39.es/ecma262/#sec-property-attributes)

> [!interview] Чим `??` відрізняється від `||`, а `?.` — від звичайної крапки?
> level: junior · frequency: дуже часто · id: jsd-16-int-03
>
> ---
>
> `||` повертає праву частину для будь-якого falsy значення (`0`, `''`, `false`, `NaN`, `null`, `undefined`), `??` — лише для `null` і `undefined`, тому `??` правильний для значень за замовчуванням, де `0` чи `''` легальні. `?.` повертає `undefined` замість `TypeError`, якщо ліва частина nullish, і замикає весь подальший ланцюжок; працює також для викликів `fn?.()` і індексів `arr?.[i]`. `??` не можна змішувати з `||`/`&&` без дужок, а `?.` не можна використовувати як ціль присвоєння.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#❓ Optional chaining і nullish|Розділ: ?. і ??]] · [MDN: Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) · [MDN: Nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

## 🔗 Зв'язки

- [[JavaScript - 03. Значення та посилання]] — об'єкти передаються за посиланням; поверхнева й глибока копія.
- [[JavaScript - 07. Прототипи та класи]] — `in` і `for…in` ходять ланцюжком прототипів; методи класу — non-enumerable.
- [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] — коли об'єкт як словник уже не підходить.
- [[JavaScript - 20. Symbol, Proxy і Reflect]] — символьні ключі та перехоплення будь-якої операції над об'єктом.
- [[JavaScript - 23. JSON, structuredClone і серіалізація]] — які властивості переживають серіалізацію і як зробити глибоку копію.

## ⚡ Фішки

> [!reel] 🔢 Об'єкт сортує числові ключі сам
> `{ 300: 'c', 5: 'a', 42: 'b' }` завжди перелічується як `5, 42, 300`. Індексоподібні ключі йдуть першими за зростанням — порядок вставки втрачається. Потрібен порядок — бери `Map`.

> [!reel] 🙈 defineProperty за замовчуванням усе забороняє
> Літерал дає властивості з усіма прапорцями `true`, а `Object.defineProperty` — з усіма `false`. Забув `enumerable: true` — і поле зникло з `JSON.stringify`.

> [!reel] 🧊 freeze — це замок лише на зовнішніх дверцятах
> `Object.freeze({ db: {} }).db.host = 'x'` — працює. Заморожування поверхневе, вкладені об'єкти треба морозити окремо.

> [!reel] ⚡ ??= не викликає setter зайвий раз
> `obj.x ??= v` — це `obj.x ?? (obj.x = v)`. Якщо значення вже є, присвоєння не відбувається взагалі — setter мовчить, заморожений об'єкт не кидає помилку.

> [!reel] 🔑 Ключ-об'єкт стає '[object Object]'
> Ключі об'єкта — лише рядки й символи. Два різні об'єкти-ключі злипаються в один.
>
> ```js
> const o = {};
> o[{ id: 1 }] = 'a';
> o[{ id: 2 }] = 'b';
> Object.keys(o); // → ['[object Object]']
> ```

## 🧠 Закріплення

### 🟢 Junior

> [!question]- У якому порядку `Object.keys` повертає ключі?
> *часто · теорія* · `jsd-16-001`
>
> Спершу integer-ключі (індекси масиву) за зростанням, потім решта рядкових ключів у порядку створення. Символи `Object.keys` не повертає. Той самий порядок у `entries`, `JSON.stringify`, `for…in`.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#🔑 Ключі властивостей і їхній порядок|Розділ: порядок ключів]] · [Spec: OrdinaryOwnPropertyKeys](https://tc39.es/ecma262/#sec-ordinaryownpropertykeys)

> [!question]- Чим `??` відрізняється від `||`?
> *дуже часто · порівняння* · `jsd-16-002`
>
> `||` підставляє праву частину для будь-якого falsy, `??` — лише для `null`/`undefined`. `0 || 5` → `5`, `0 ?? 5` → `0`.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#❓ Optional chaining і nullish|Розділ: nullish]] · [javascript.info: Nullish coalescing](https://javascript.info/nullish-coalescing-operator)

> [!question]- Як перейменувати змінну і задати default при деструктуризації?
> *часто · код* · `jsd-16-003`
>
> `const { prop: newName = defaultValue } = obj`. Ліворуч від двокрапки — що читаємо, праворуч — ім'я змінної, після `=` — default для `undefined`.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#📤 Деструктуризація, shorthand і computed keys|Розділ: деструктуризація]] · [javascript.info: Destructuring](https://javascript.info/destructuring-assignment)

### 🟡 Middle

> [!question]- Які атрибути має data-властивість і які значення вони отримують за замовчуванням?
> *часто · теорія* · `jsd-16-004`
>
> `value`, `writable`, `enumerable`, `configurable`. Через літерал або присвоєння — усі прапорці `true`; через `Object.defineProperty` — пропущені прапорці `false`.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#🧾 Дескриптори, getters і setters|Розділ: дескриптори]] · [javascript.info: Property flags](https://javascript.info/property-descriptors)

> [!question]- Чим `Object.hasOwn` кращий за `obj.hasOwnProperty`?
> *часто · порівняння* · `jsd-16-005`
>
> `hasOwnProperty` — метод з `Object.prototype`: його немає в об'єктів з `Object.create(null)` (і в результаті `Object.groupBy`), і його можна перевизначити. `Object.hasOwn(obj, key)` — статична функція, працює завжди.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#🧰 Object.keys, entries, assign, groupBy і перевірка наявності|Розділ: перевірка наявності]] · [MDN: Object.hasOwn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)

> [!question]- Чим `seal` відрізняється від `freeze`?
> *часто · порівняння* · `jsd-16-006`
>
> Обидва забороняють додавати й видаляти властивості та змінювати дескриптори. `seal` дозволяє змінювати значення наявних властивостей, `freeze` — ні. Обидва поверхневі.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#🧊 freeze, seal і preventExtensions|Розділ: freeze і seal]] · [MDN: Object.seal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)

> [!question]- Що копіює `Object.assign` і що він втрачає?
> *іноді · код* · `jsd-16-007`
>
> Поверхнево копіює власні enumerable-властивості (рядкові й символьні), **читаючи** їх — getter-и джерела виконуються, і в ціль потрапляє значення, а не accessor. У ціль він **присвоює**, тож спрацьовують її setter-и. Для копії з дескрипторами — `Object.defineProperties({}, Object.getOwnPropertyDescriptors(src))`.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#🧰 Object.keys, entries, assign, groupBy і перевірка наявності|Розділ: assign і spread]] · [MDN: Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

### 🔴 Senior

> [!question]- Чому `a?.b.c.d` не кидає помилку, коли `a` — `undefined`?
> *іноді · теорія* · `jsd-16-008`
>
> Optional chain замикає **весь** ланцюжок праворуч від `?.`: якщо `a` nullish, вираз одразу повертає `undefined`, і `.b.c.d` не обчислюються. Але якщо `a` існує, а `a.b` — `undefined`, то `.c` кине `TypeError` — `?.` треба ставити там, де значення справді може бути відсутнім.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#❓ Optional chaining і nullish|Розділ: optional chaining]] · [Spec: Optional Chains](https://tc39.es/ecma262/#sec-optional-chains)

> [!question]- Що можна змінити у властивості з `configurable: false`?
> *рідко · теорія* · `jsd-16-009`
>
> Майже нічого: не можна видалити, змінити `enumerable`, перетворити data ↔ accessor, повернути `writable: false → true`. Дозволено лише змінити `writable` з `true` на `false` і змінити `value`, поки властивість writable. Решта спроб через `defineProperty` кидає `TypeError: Cannot redefine property`.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#🧾 Дескриптори, getters і setters|Розділ: дескриптори]] · [Spec: ValidateAndApplyPropertyDescriptor](https://tc39.es/ecma262/#sec-validateandapplypropertydescriptor)

> [!question]- Як зробити ліниву властивість, що обчислюється один раз?
> *іноді · практика* · `jsd-16-010`
>
> Getter, який при першому читанні обчислює значення і через `Object.defineProperty(this, key, { value })` замінює себе data-властивістю. Наступні читання вже не викликають функцію. У класах getter живе на прототипі, тож `defineProperty` на `this` створить власну властивість, яка його затінить.
>
> 📚 [[JavaScript - 16. Обʼєкти глибоко#🧾 Дескриптори, getters і setters|Розділ: getters і setters]] · [javascript.info: Getters and setters](https://javascript.info/property-accessors)

## 🛠️ Практика

> [!task] `pick` і `omit`
> level: junior · difficulty: easy · id: jsd-16-task-01 · tags: objects, entries
>
> Напиши `pick(obj, keys)` — новий об'єкт лише з указаними ключами, і `omit(obj, keys)` — без них. Відсутні ключі в `pick` не мають з'являтися як `undefined`.
>
> ```js
> const user = { id: 1, name: 'Ann', password: 'x' };
> pick(user, ['id', 'name', 'age']); // → { id: 1, name: 'Ann' }
> omit(user, ['password']);          // → { id: 1, name: 'Ann' }
> ```
>
> ```js starter
> function pick(obj, keys) {
>   // твій код
> }
>
> function omit(obj, keys) {
>   // твій код
> }
> ```
>
> ```js tests
> const user = { id: 1, name: 'Ann', password: 'x' }
>
> test('pick залишає лише вказані ключі', () => {
>   expect(pick(user, ['id', 'name'])).toEqual({ id: 1, name: 'Ann' })
> })
>
> test('pick не додає відсутні ключі навіть як undefined', () => {
>   const result = pick(user, ['id', 'age'])
>   expect(Object.keys(result)).toEqual(['id'])
>   expect('age' in result).toBe(false)
> })
>
> test('omit прибирає вказані ключі', () => {
>   expect(omit(user, ['password'])).toEqual({ id: 1, name: 'Ann' })
>   expect(omit(user, [])).toEqual(user)
> })
>
> test('повертають новий обʼєкт і не мутують вхід', () => {
>   const picked = pick(user, ['id', 'name', 'password'])
>   expect(picked).not.toBe(user)
>   omit(user, ['password'])
>   expect(user).toEqual({ id: 1, name: 'Ann', password: 'x' })
> })
>
> test('не бере ключі з прототипу', () => {
>   const child = Object.create({ inherited: true })
>   child.own = 1
>   expect(pick(child, ['own', 'inherited'])).toEqual({ own: 1 })
> })
> ```
>
> > [!hint]- Підказка 1
> > `Object.entries` → `filter` → `Object.fromEntries`.
>
> > [!hint]- Підказка 2
> > Для швидкої перевірки «чи є ключ у списку» зроби з масиву `Set`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function pick(obj, keys) {
> >   const wanted = new Set(keys);
> >   return Object.fromEntries(Object.entries(obj).filter(([k]) => wanted.has(k)));
> > }
> > function omit(obj, keys) {
> >   const banned = new Set(keys);
> >   return Object.fromEntries(Object.entries(obj).filter(([k]) => !banned.has(k)));
> > }
> > ```
> >
> > `entries` бачить лише власні enumerable-ключі, тож `age` не з'явиться. Для деструктуризації є ще прийом `const { password, ...safe } = user`, але він працює лише з відомими наперед ключами.

> [!task] Поясни своїми словами: що насправді робить `Object.freeze`
> level: middle · difficulty: medium · id: jsd-16-task-02 · tags: feynman, objects, immutability
>
> Поясни колезі, чому після `const cfg = Object.freeze({ db: { host: 'a' } })` рядок `cfg.db.host = 'b'` працює, а `cfg.retries = 1` — ні. Використай слова «дескриптор», «поверхнево», «посилання». До 6 речень.
>
> > [!hint]- Підказка 1
> > Що зберігається у властивості `db` — сам об'єкт чи посилання на нього?
>
> > [!hint]- Підказка 2
> > Які прапорці змінює `freeze` і в чиїх властивостей?
>
> > [!solution]- Еталонне пояснення
> > `Object.freeze` проходить по **власних** властивостях об'єкта і змінює їхні дескриптори: `writable: false`, `configurable: false`, а сам об'єкт робить нерозширюваним. Тому `cfg.retries = 1` не спрацює — додати нову властивість не можна. У властивості `db` лежить не сам вкладений об'єкт, а **посилання** на нього, і заморожено саме посилання: `cfg.db = {}` не пройде. Але об'єкт, на який воно вказує, — окремий, і його дескриптори ніхто не чіпав, тож `cfg.db.host = 'b'` працює. Тому кажуть, що `freeze` **поверхневий**. Для повної незмінності треба рекурсивно заморозити кожен вкладений об'єкт.

> [!task] `deepGet` і `deepSet` за шляхом
> level: senior · difficulty: hard · id: jsd-16-task-03 · tags: objects, optional-chaining, immutability
>
> Напиши `deepGet(obj, path, fallback)` і **іммутабельний** `deepSet(obj, path, value)` для шляхів на кшталт `'user.address.city'`. `deepGet` повертає `fallback` лише для `undefined`/`null`; `deepSet` не змінює вхідний об'єкт і створює відсутні рівні.
>
> ```js
> const state = { user: { address: { city: 'Kyiv' }, tags: [] } };
> deepGet(state, 'user.address.city');          // → 'Kyiv'
> deepGet(state, 'user.phone.number', 'n/a');   // → 'n/a'
> const next = deepSet(state, 'user.address.zip', '01001');
> next.user.address.zip;                         // → '01001'
> state.user.address.zip;                        // → undefined
> next.user.tags === state.user.tags;            // → true — незмінені гілки спільні
> ```
>
> ```js starter
> function deepGet(obj, path, fallback) {
>   // твій код
> }
>
> function deepSet(obj, path, value) {
>   // твій код
> }
> ```
>
> ```js tests
> const makeState = () => ({ user: { address: { city: 'Kyiv' }, tags: [] }, flags: { on: false } })
>
> test('deepGet читає значення за шляхом', () => {
>   expect(deepGet(makeState(), 'user.address.city')).toBe('Kyiv')
>   expect(deepGet(makeState(), 'user.tags')).toEqual([])
> })
>
> test('deepGet повертає fallback лише для undefined і null', () => {
>   const state = makeState()
>   expect(deepGet(state, 'user.phone.number', 'n/a')).toBe('n/a')
>   expect(deepGet({ a: null }, 'a', 'x')).toBe('x')
>   expect(deepGet(state, 'flags.on', true)).toBe(false)
>   expect(deepGet({ n: 0 }, 'n', 5)).toBe(0)
> })
>
> test('deepSet не змінює вхідний обʼєкт', () => {
>   const state = makeState()
>   const next = deepSet(state, 'user.address.zip', '01001')
>   expect(next.user.address).toEqual({ city: 'Kyiv', zip: '01001' })
>   expect(state.user.address.zip).toBeUndefined()
>   expect(next).not.toBe(state)
>   expect(next.user.address).not.toBe(state.user.address)
> })
>
> test('deepSet ділить незмінені гілки (structural sharing)', () => {
>   const state = makeState()
>   const next = deepSet(state, 'user.address.city', 'Lviv')
>   expect(next.user.tags).toBe(state.user.tags)
>   expect(next.flags).toBe(state.flags)
> })
>
> test('deepSet створює відсутні рівні', () => {
>   expect(deepSet({}, 'a.b.c', 1)).toEqual({ a: { b: { c: 1 } } })
> })
> ```
>
> > [!hint]- Підказка 1
> > `deepGet` — це `reduce` по `path.split('.')` з `?.` на кожному кроці.
>
> > [!hint]- Підказка 2
> > `deepSet` рекурсивний: копіюй spread-ом **лише** вузли на шляху, решту гілок лишай за посиланням.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function deepGet(obj, path, fallback) {
> >   const value = path.split('.').reduce((node, key) => node?.[key], obj);
> >   return value ?? fallback;
> > }
> >
> > function deepSet(obj, path, value) {
> >   const [head, ...rest] = Array.isArray(path) ? path : path.split('.');
> >   const current = obj ?? {};
> >   return {
> >     ...current,
> >     [head]: rest.length === 0 ? value : deepSet(current[head], rest, value),
> >   };
> > }
> > ```
> >
> > Computed key `[head]` дозволяє будувати об'єкт з динамічним ключем, а spread копіює лише рівні на шляху — це **structural sharing**, як у Redux та Immer. Обмеження: масиви на шляху стануть об'єктами; у продакшн-версії перевіряй `Array.isArray(current)` і копіюй через `[...current]`.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Property flags and descriptors](https://javascript.info/property-descriptors) — `writable`, `enumerable`, `configurable` і `freeze` з прикладами.
- 🟢 [javascript.info — Optional chaining](https://javascript.info/optional-chaining) — `?.` для властивостей, викликів і індексів.
- 🟢 [javascript.info — Destructuring assignment](https://javascript.info/destructuring-assignment) — усі форми деструктуризації з вправами.
- 🟡 [MDN — Enumerability and ownership of properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Enumerability_and_ownership_of_properties) — таблиця: хто з API бачить які властивості.
- 🟡 [MDN — Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) — повний опис дескрипторів і правил їх зміни.
- 🟡 [MDN — Object.groupBy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy) — групування і чому результат без прототипу.
- 🔴 [V8 — Fast properties](https://v8.dev/blog/fast-properties) — як рушій зберігає властивості й елементи (shapes, dictionary mode).
- 🔴 [ECMAScript — OrdinaryOwnPropertyKeys](https://tc39.es/ecma262/#sec-ordinaryownpropertykeys) — першоджерело порядку ключів.
- 🔴 [ECMAScript — Property Attributes](https://tc39.es/ecma262/#sec-property-attributes) — офіційна таблиця атрибутів і значень за замовчуванням.

> [!important] Підсумок
> - Ключі — лише рядки й символи; порядок: індекси за зростанням → рядки в порядку створення → символи.
> - Кожна властивість має дескриптор; `defineProperty` за замовчуванням ставить усі прапорці в `false`, а accessor-властивості замість `value` мають `get`/`set`.
> - `preventExtensions` ⊂ `seal` ⊂ `freeze`, і всі вони поверхневі; `const` захищає змінну, а не об'єкт.
> - `in` бачить ланцюжок прототипів, `Object.hasOwn` — лише власні властивості; `entries/fromEntries` і `groupBy` — основні інструменти трансформації.
> - `??` і `??=` — для «немає значення» (`null`/`undefined`), `||` — для будь-якого falsy; `?.` замикає весь ланцюжок праворуч.
