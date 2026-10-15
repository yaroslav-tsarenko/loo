---
title: Map, Set, WeakMap, WeakSet і типізовані масиви
order: 19
level: middle
tags: [map, set, weakmap, weakset, typed-arrays, arraybuffer, dataview, binary]
prerequisites:
  - "[[JavaScript - 16. Обʼєкти глибоко]]"
  - "[[JavaScript - 13. Пам'ять і збирач сміття]]"
estimatedMinutes: 45
id: jsd-ch-19
icon: "🗃️"
---

# Map, Set, WeakMap, WeakSet і типізовані масиви

> [!success] 🎯 Після цього розділу ти зможеш
> - обґрунтовано обрати між об'єктом і `Map`, масивом і `Set`;
> - користуватися новими методами множин (`union`, `intersection`, `difference`…) і передбачати порядок ітерації, зокрема при зміні колекції під час обходу;
> - пояснити, чому `WeakMap` не має `size` і не ітерується, і застосувати його для приватних даних і кешів;
> - працювати з байтами через `ArrayBuffer`, типізовані масиви й `DataView` та пояснити endianness.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-19-quiz-01
>
> ```js
> const obj = {};
> const map = new Map();
> const a = { id: 1 };
> const b = { id: 2 };
> obj[a] = 'A'; obj[b] = 'B';
> map.set(a, 'A').set(b, 'B');
> console.log(Object.keys(obj).length, map.size, obj[a], map.get({ id: 1 }));
> ```
>
> **Відповідь:** `1 2 B undefined`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Ключ об'єкта — лише рядок, тож обидва об'єкти перетворились на `'[object Object]'` і другий перезаписав перший. `Map` зберігає самі об'єкти як ключі й порівнює їх **за посиланням** — тому новий `{ id: 1 }` не знаходиться.

## 🧒 Простими словами

Звичайний об'єкт — це **анкета** з наперед відомими полями: ім'я, вік, місто. `Map` — це **картотека**, куди можна покласти картку з будь-якою міткою, навіть з фотографією замість напису. `Set` — **список гостей**: кожен може бути лише один раз. `WeakMap` — **записки, приклеєні до речей**: викинули річ — записка зникає разом з нею, і ніхто не може переглянути «всі записки». А типізовані масиви — це **сира стрічка байтів** з лінійкою: ти сам вирішуєш, читати її по 1, 2 чи 4 байти.

## 🔬 Як це працює насправді

### 🗺️ Map проти об'єкта

| Критерій | Об'єкт `{}` | `Map` |
|---|---|---|
| Типи ключів | рядки й символи | будь-які: об'єкти, функції, `NaN` |
| Порівняння ключів | приведення до рядка | SameValueZero (`NaN` = `NaN`, `-0` = `+0`) |
| Порядок | індекси за зростанням, потім вставка | завжди порядок вставки |
| Розмір | `Object.keys(o).length` — O(n) | `map.size` — O(1) |
| Ітерація | через `Object.entries` | напряму: `for (const [k, v] of map)` |
| Конфлікт з прототипом | `'constructor'`, `'__proto__'` | немає |
| Часті додавання/видалення | повільніше (рушій «здається» в dictionary mode) | оптимізовано під це |
| JSON | ✅ напряму | ❌ `{}` — треба `Object.fromEntries` або `[...map]` |

```js
const visits = new Map();
const user = { name: 'Ann' };
visits.set(user, 1);
visits.set(user, visits.get(user) + 1);
console.log(visits.get(user), visits.size); // → 2 1

const counts = new Map();
for (const w of 'to be or not to be'.split(' ')) counts.set(w, (counts.get(w) ?? 0) + 1);
console.log([...counts]); // → [['to', 2], ['be', 2], ['or', 1], ['not', 1]]
```

Правило: **запис з фіксованими полями** (користувач, конфіг, DTO) → об'єкт. **Словник з динамічними ключами**, особливо не-рядковими, з частими змінами чи важливим порядком → `Map`. Переходи між ними: `new Map(Object.entries(obj))` і `Object.fromEntries(map)`.

> [!quiz] Перевір себе: коли `Map` кращий за об'єкт?
> level: middle · type: multi · id: jsd-19-quiz-02
> - [x] Ключі — DOM-вузли або інші об'єкти
> - [x] Ключі приходять від користувача і можуть бути `'__proto__'` чи `'constructor'`
> - [ ] Потрібно відправити дані як JSON без перетворень
> - [x] Елементи часто додаються й видаляються, а важливий порядок вставки
> - [ ] Структура з п'ятьма відомими наперед полями
>
> **Пояснення:** `Map` — для словників з довільними ключами. Для записів з фіксованою формою і для JSON природніший звичайний об'єкт.

> [!quiz] Склади підрахунок частоти слів через `Map`
> level: junior · type: order · id: jsd-19-quiz-08
>
> ```js order
> function countWords(words) {
>   const counts = new Map()
>   for (const word of words) {
>     counts.set(word, (counts.get(word) ?? 0) + 1)
>   }
>   return counts
> }
>     counts[word]++ // ✗
> ```
>
> **Пояснення:** `get` повертає `undefined` для нового ключа — `?? 0` дає старт з нуля. Доступ через `counts[word]` не працює з `Map`: він створює звичайну властивість об'єкта, а не запис у колекції.

### 🧺 Set і нові методи множин

`Set` зберігає **унікальні** значення (за SameValueZero) у порядку вставки. Класичне застосування — дедуплікація і швидке `has` (O(1) замість O(n) у `array.includes`).

```js
console.log([...new Set([3, 1, 3, 2, 1])]);       // → [3, 1, 2]
console.log([...new Set('hello')].join(''));        // → 'helo'
console.log(new Set([NaN, NaN, 0, -0]).size);        // → 2
console.log(new Set([{}, {}]).size);                 // → 2 — різні об'єкти
```

ES2025 додав нарешті математичні операції над множинами:

```text
     A = {1, 2, 3}        B = {2, 3, 4}

  A.union(B)                → {1, 2, 3, 4}      A ∪ B
  A.intersection(B)         → {2, 3}            A ∩ B
  A.difference(B)           → {1}               A \ B
  A.symmetricDifference(B)  → {1, 4}            A △ B
  A.isSubsetOf(B)           → false             A ⊆ B
  A.isSupersetOf(B)         → false             A ⊇ B
  A.isDisjointFrom(B)       → false             A ∩ B = ∅
```

```js
const frontend = new Set(['js', 'css', 'react']);
const backend = new Set(['js', 'sql', 'node']);
console.log(frontend.intersection(backend));  // → Set(1) { 'js' }
console.log(frontend.difference(backend));    // → Set(2) { 'css', 'react' }
```

Методи повертають **нову** множину й приймають не лише `Set`, а будь-який **set-like** об'єкт — з `size`, `has()` і `keys()`. `Map` підходить, а масив — ні (`TypeError: The .size property is NaN`): масив треба обгорнути в `new Set(arr)`.

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-19-quiz-03
>
> ```js
> const a = new Set([1, 2, 3]);
> const b = new Set([3, 4]);
> console.log([...a.symmetricDifference(b)].join(','), a.isDisjointFrom(new Set([9])), a.size);
> ```
>
> **Відповідь:** `1,2,4 true 3`
>
> **Пояснення:** симетрична різниця — елементи, що є рівно в одній з множин. Множини без спільних елементів — disjoint. Методи не змінюють `a` — повертають нову множину.

### 🔁 Порядок ітерації і зміна під час обходу

`Map` і `Set` ітеруються **в порядку вставки**. Оновлення значення наявного ключа порядок **не змінює**; видалення й повторна вставка — переносить у кінець.

```js
const m = new Map([['a', 1], ['b', 2], ['c', 3]]);
m.set('b', 20);            // оновлення — місце те саме
m.delete('a');
m.set('a', 1);             // нова вставка — у кінець
console.log([...m.keys()]); // → ['b', 'c', 'a']
```

На відміну від багатьох мов, змінювати колекцію під час `for…of` **дозволено** і поведінка визначена специфікацією: ітератор «живий». Додані елементи **будуть відвідані**, видалені до відвідування — **пропущені**.

```js
const s = new Set([1, 2]);
for (const x of s) {
  if (x < 5) s.add(x + 2); // додаємо під час обходу
}
console.log([...s]); // → [1, 2, 3, 4, 5, 6] — нові елементи теж обійдено
```

Це зручно для черг (BFS по графу через `Set` відвіданих), але легко отримати нескінченний цикл, якщо умова не обмежує додавання.

> [!quiz] Перевір себе: що виведе код?
> level: senior · type: output · id: jsd-19-quiz-04
>
> ```js
> const m = new Map([['a', 1], ['b', 2], ['c', 3]]);
> const seen = [];
> for (const [k] of m) {
>   seen.push(k);
>   if (k === 'a') { m.delete('b'); m.set('d', 4); }
> }
> console.log(seen.join(''));
> ```
>
> **Відповідь:** `acd`
>
> **Пояснення:** `b` видалено до того, як ітератор до нього дійшов, — пропущено. `d` додано в кінець під час обходу — відвідано.

### 👻 WeakMap і WeakSet

`WeakMap` — словник, у якому **ключ не утримує об'єкт від збирання сміття**. Ключі — лише об'єкти (або незареєстровані символи). Коли на об'єкт-ключ більше немає інших посилань, GC прибирає і його, і відповідне значення (так звана *ephemeron*-семантика: значення живе, поки живий ключ).

```text
   Map                                   WeakMap
   map ──strong──► key ──► value         wm ┄┄weak┄┄► key ──► value
   (key живе, поки живе map)             (key живе, лише поки на нього є ІНШІ посилання)
```

> [!viz] gc
> scenario: reachability

Ціна слабкості — **жодних операцій над усім вмістом**: немає `size`, `keys()`, `forEach`, ітерації, `clear()`. Інакше результат залежав би від того, чи встиг пройти GC, — недетермінованість. Доступні лише `get`, `set`, `has`, `delete`. `WeakSet` — те саме для множини: `add`, `has`, `delete`.

**Сценарії:**

- 🔐 **Приватні дані** для об'єктів, яких ти не створюєш (до `#private` полів це був стандартний спосіб).
- 🗃️ **Кеш обчислень за об'єктом**: результат живе, поки живий об'єкт; ніяких витоків.
- 🏷️ **Метадані DOM-вузлів**: видалили вузол — метадані зникли.
- ✅ **WeakSet як «позначка»**: «цей об'єкт уже оброблено» / «створено нашою фабрикою», захист від циклів при обході графа.

```js
const sizeCache = new WeakMap();
function expensiveSize(node) {
  if (!sizeCache.has(node)) sizeCache.set(node, JSON.stringify(node).length); // уяви щось важке
  return sizeCache.get(node);
}
let data = { items: [1, 2, 3] };
console.log(expensiveSize(data), expensiveSize(data)); // → 17 17 — друге з кешу
data = null; // запис у кеші стане сміттям разом з об'єктом
```

Примітиви ключами бути не можуть (`wm.set('k', 1)` → `TypeError`): рядок `'k'` неможливо «зібрати», він завжди відтворюваний. Для слабких посилань на окремі значення є `WeakRef` і `FinalizationRegistry` — розібрані в [[JavaScript - 13. Пам'ять і збирач сміття]].

> [!quiz] Перевір себе: оберіть правдиві твердження про WeakMap
> level: middle · type: multi · id: jsd-19-quiz-05
> - [x] Ключем може бути лише об'єкт або незареєстрований символ
> - [ ] `weakMap.size` показує кількість живих записів
> - [x] Запис зникає, коли ключ стає недосяжним з інших місць
> - [ ] WeakMap утримує значення, навіть якщо ключ зібрано
> - [x] WeakMap не можна обійти `for…of`
>
> **Пояснення:** слабкість стосується ключа; значення живе рівно стільки, скільки ключ. Через це вміст не можна перелічити — інакше програма бачила б роботу GC.

### 🧱 ArrayBuffer і типізовані масиви

Для бінарних даних (файли, мережа, WebGL, аудіо, пікселі canvas, WebAssembly) JS має окремий світ:

- **`ArrayBuffer`** — шматок сирої пам'яті фіксованої довжини в байтах. Сам по собі нічого не вміє — ні читати, ні писати.
- **Типізований масив** (`Uint8Array`, `Int16Array`, `Float64Array`…) — **view**: лінза, що трактує байти буфера як масив чисел певного типу.

```text
  ArrayBuffer(8):   [ 00 ][ 01 ][ 02 ][ 03 ][ 04 ][ 05 ][ 06 ][ 07 ]   ← 8 байтів
  Uint8Array:        [0]   [1]   [2]   [3]   [4]   [5]   [6]   [7]    ← 8 елементів по 1 байту
  Uint16Array:       [    0    ][    1    ][    2    ][    3    ]      ← 4 елементи по 2 байти
  Float64Array:      [                   0                       ]      ← 1 елемент на 8 байтів
```

| Тип | Байтів | Діапазон / особливість |
|---|---|---|
| `Int8` / `Uint8` | 1 | −128…127 / 0…255, переповнення «загортається» |
| `Uint8Clamped` | 1 | 0…255, але **насичується** (300 → 255) — для пікселів |
| `Int16` / `Uint16` | 2 | 16-бітні цілі |
| `Int32` / `Uint32` | 4 | 32-бітні цілі |
| `Float16` / `Float32` / `Float64` | 2 / 4 / 8 | числа з плаваючою комою (Float16 — ES2025) |
| `BigInt64` / `BigUint64` | 8 | 64-бітні цілі як `BigInt` |

```js
const buf = new ArrayBuffer(4);
const bytes = new Uint8Array(buf);
const words = new Uint16Array(buf); // той самий буфер!
words[0] = 0x0102;
console.log(bytes[0], bytes[1]);    // → 2 1 — байти в пам'яті у зворотному порядку (little-endian)

const u8 = new Uint8Array([250]);
u8[0] += 10;
console.log(u8[0]);                                    // → 4 — (260 mod 256)
console.log(new Uint8ClampedArray([300])[0]);          // → 255
console.log(new Float32Array([0.1])[0]);               // → 0.10000000149011612 — точність float32
```

Типізований масив — **не масив**: `Array.isArray` дає `false`, довжина фіксована (немає `push`/`splice`), а `map` повертає масив **того самого типу** — з усіма переповненнями. `subarray` створює новий view на **ті самі** байти, а `slice` — копію.

> [!quiz] Перевір себе: що виведе код?
> level: senior · type: output · id: jsd-19-quiz-06
>
> ```js
> const ta = new Uint8Array([1, 2, 3]);
> const view = ta.subarray(1);
> view[0] = 99;
> console.log(ta.join(','), ta.map((x) => x * 100).join(','));
> ```
>
> **Відповідь:** `1,99,3 100,172,44`
>
> **Пояснення:** `subarray` ділить буфер з оригіналом, тож запис через `view` змінює `ta`. `map` на типізованому масиві повертає новий `Uint8Array`, і кожен результат загортається по модулю 256: `9900 mod 256 = 172`, `300 mod 256 = 44`.

### 🔬 DataView і endianness

**Endianness** — порядок байтів багатобайтового числа в пам'яті. *Big-endian*: старший байт першим (як ми пишемо числа, так прийнято в мережевих протоколах). *Little-endian*: молодший першим (x86, ARM у звичайному режимі — тобто майже всі сучасні пристрої).

```text
  0xDEADBEEF у пам'яті:
  big-endian:     [ DE ][ AD ][ BE ][ EF ]
  little-endian:  [ EF ][ BE ][ AD ][ DE ]
```

Типізовані масиви використовують **порядок платформи** (на практиці — little-endian). Для бінарних форматів з фіксованим порядком (PNG, мережеві протоколи, заголовки WAV) потрібен **`DataView`**: він читає й пише будь-який тип з будь-якого зсуву з **явним** порядком байтів. За замовчуванням `DataView` — big-endian.

```js
const buffer = new ArrayBuffer(8);
new Uint32Array(buffer)[0] = 0xdeadbeef;           // запис у порядку платформи
const dv = new DataView(buffer);
console.log(dv.getUint32(0).toString(16));        // → 'efbeadde' — читаємо як big-endian
console.log(dv.getUint32(0, true).toString(16));  // → 'deadbeef' — явно little-endian
dv.setUint16(4, 513);                              // big-endian: [02][01]
console.log(new Uint8Array(buffer, 4, 2));         // → Uint8Array(2) [2, 1]
```

Корисні сусіди: `TextEncoder`/`TextDecoder` перетворюють рядки на UTF-8 байти й назад; `ArrayBuffer` можна зробити змінного розміру (`new ArrayBuffer(n, { maxByteLength })` + `resize`) або передати іншому власнику через `transfer()` — тоді старий буфер стає *detached* (довжина 0). Передача буферів між потоками і `SharedArrayBuffer` — у [[JavaScript - 29. Workers і паралельність]].

> [!quiz] Перевір себе: що виведе код?
> level: senior · type: output · id: jsd-19-quiz-07
>
> ```js
> const dv = new DataView(new ArrayBuffer(2));
> dv.setUint16(0, 0x0102);
> console.log(dv.getUint8(0), dv.getUint16(0, true));
> ```
>
> **Відповідь:** `1 513`
>
> **Пояснення:** `setUint16` за замовчуванням пише big-endian: байт `01`, потім `02`. Читаючи ці байти як little-endian, отримуємо `0x0201 = 513`.

> [!quiz] Заповни пропуски: прочитай little-endian заголовок
> level: senior · type: fill · id: jsd-19-quiz-09 · bank: Uint32Array, false, getInt32
>
> ```js fill
> const dv = new [[DataView]](buffer)
> const magic = dv.getUint16(0, [[true]])
> const length = dv.[[getUint32]](2, true)
> const flags = dv.[[getUint8]](6)
> ```
>
> **Пояснення:** `DataView` читає з будь-якого зсуву без вирівнювання, а другий аргумент `true` вмикає little-endian (за замовчуванням — big-endian). Для одного байта порядок не має значення, тож `getUint8` не приймає прапорця.

## ⚠️ Пастки

> [!pitfall] Квадратні дужки замість `get`/`set`
> `map['key'] = 1` створює звичайну властивість об'єкта `Map`, а не запис у колекції. `map.get('key')` поверне `undefined`, `size` не зміниться.
>
> ```js
> const m = new Map();
> m['key'] = 1;
> console.log(m.get('key'), m.size); // → undefined 0
> ```

> [!pitfall] `JSON.stringify(map)` дає `{}`
> `Map` і `Set` не мають enumerable-властивостей, тож серіалізуються в `{}` — дані тихо губляться. Перетворюй явно: `Object.fromEntries(map)` (для рядкових ключів) або `[...map]`; `structuredClone` їх підтримує (див. [[JavaScript - 23. JSON, structuredClone і серіалізація]]).

> [!pitfall] `map` на типізованому масиві переповнюється
> `new Uint8Array([100, 200]).map((x) => x * 2)` дає `[200, 144]` — результат того самого типу. Якщо потрібні «нормальні» числа, спершу `Array.from(typed, fn)`.

> [!pitfall] Порівняння ключів-об'єктів за вмістом
> `map.get({ id: 1 })` ніколи не знайде запис, створений з іншим об'єктом `{ id: 1 }`. Для складених ключів використовуй рядок (`` `${x}:${y}` ``) або вкладені `Map`.

## 🎤 На співбесіді

> [!interview] Чим `Map` відрізняється від об'єкта? Коли що використовувати?
> level: middle · frequency: дуже часто · id: jsd-19-int-01
>
> ---
>
> Ключі об'єкта — лише рядки й символи (решта приводиться до рядка), ключі `Map` — будь-які значення, порівняння за SameValueZero. `Map` зберігає порядок вставки для всіх ключів, має `size` за O(1), ітерується напряму, не конфліктує з прототипом і оптимізований під часті додавання й видалення. Об'єкт кращий для записів з фіксованою формою, JSON і деструктуризації; рушій оптимізує такі об'єкти через hidden classes. Правило: «сутність» — об'єкт, «словник/кеш/лічильник» — `Map`.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви#🗺️ Map проти об'єкта|Розділ: Map проти об'єкта]] · [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) · [Spec: Map Objects](https://tc39.es/ecma262/#sec-map-objects)

> [!interview] Що таке WeakMap, навіщо він і чому його не можна ітерувати?
> level: senior · frequency: часто · id: jsd-19-int-02
>
> ---
>
> `WeakMap` тримає ключі слабко: якщо на об'єкт-ключ немає інших посилань, GC прибирає і його, і значення. Ключі — лише об'єкти чи незареєстровані символи, бо примітиви не мають ідентичності для збирання. Застосування: приватні дані й метадані для чужих об'єктів (DOM-вузлів), кеш обчислень за об'єктом без витоків, `WeakSet` для позначок «оброблено». Ітерації, `size` і `clear` немає, бо вміст залежав би від моменту збирання сміття — програма стала б недетермінованою.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви#👻 WeakMap і WeakSet|Розділ: WeakMap і WeakSet]] · [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) · [javascript.info: WeakMap and WeakSet](https://javascript.info/weakmap-weakset)

> [!interview] Що таке ArrayBuffer, типізовані масиви і DataView?
> level: senior · frequency: іноді · id: jsd-19-int-03
>
> ---
>
> `ArrayBuffer` — сирий блок байтів фіксованої довжини без способу читання. Типізовані масиви (`Uint8Array`, `Float32Array`…) — views, що трактують буфер як масив чисел одного типу в порядку байтів платформи (майже завжди little-endian); кілька views можуть ділити один буфер. `DataView` читає й пише будь-які типи з довільних зсувів з явним endianness — для бінарних форматів і протоколів. Нюанси: переповнення загортається (крім `Uint8ClampedArray`), `subarray` ділить пам'ять, `slice` копіює, довжина фіксована. Застосування: файли, WebSocket, WebGL, Web Audio, canvas, WebAssembly, криптографія.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви#🧱 ArrayBuffer і типізовані масиви|Розділ: бінарні дані]] · [MDN: JavaScript typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays) · [javascript.info: ArrayBuffer, binary arrays](https://javascript.info/arraybuffer-binary-arrays)

## 🔗 Зв'язки

- [[JavaScript - 16. Обʼєкти глибоко]] — чому ключі-об'єкти злипаються в об'єкті і як влаштований порядок ключів.
- [[JavaScript - 13. Пам'ять і збирач сміття]] — досяжність, `WeakRef` і `FinalizationRegistry`: що саме означає «слабке» посилання.
- [[JavaScript - 11. Ітератори та генератори]] — `Map` і `Set` — ітерабли, а `keys()`/`values()`/`entries()` повертають ітератори.
- [[JavaScript - 17. Числа, BigInt і математика]] — переповнення, float32 і `BigInt64Array`.
- [[JavaScript - 29. Workers і паралельність]] — transferable `ArrayBuffer` і `SharedArrayBuffer` з `Atomics`.

## ⚡ Фішки

> [!reel] 🗺️ Map пам'ятає порядок для будь-яких ключів
> Об'єкт переставляє числові ключі за зростанням, а `Map` завжди віддає записи в порядку вставки — хоч рядки, хоч числа, хоч об'єкти.

> [!reel] 🧺 У Set нарешті є union і intersection
> ES2025: `a.union(b)`, `a.intersection(b)`, `a.difference(b)`, `a.isSubsetOf(b)`. Більше ніяких `[...a].filter((x) => b.has(x))`.
>
> ```js
> new Set([1, 2]).union(new Set([2, 3])); // → Set {1, 2, 3}
> ```

> [!reel] 👻 WeakMap не знає свого розміру
> У `WeakMap` немає `size` і ітерації — і це не лінощі авторів. Якби вміст можна було перелічити, програма бачила б, коли спрацював GC, і поводилась би по-різному на різних запусках.

> [!reel] 🎨 Пікселі canvas — Uint8ClampedArray
> `ctx.getImageData()` повертає байти RGBA саме в `Uint8ClampedArray`: яскравість 300 стає 255, а не 44 — фільтри зображень не «перевертаються».

> [!reel] 🔁 Додав у Set під час for…of — його теж обійдуть
> Ітератори `Map`/`Set` живі: нові елементи будуть відвідані, видалені до відвідування — пропущені. Зручно для черги BFS, небезпечно для нескінченних циклів.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Як прибрати дублікати з масиву?
> *дуже часто · код* · `jsd-19-001`
>
> `[...new Set(arr)]` або `Array.from(new Set(arr))`. Порядок першої появи зберігається, порівняння — SameValueZero (`NaN` теж дедуплікується). Об'єкти порівнюються за посиланням.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви#🧺 Set і нові методи множин|Розділ: Set]] · [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

> [!question]- Як перетворити об'єкт на Map і назад?
> *часто · код* · `jsd-19-002`
>
> `new Map(Object.entries(obj))` і `Object.fromEntries(map)`. Зворотне перетворення має сенс лише для рядкових (або символьних) ключів — об'єкти-ключі стануть `'[object Object]'`.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви#🗺️ Map проти об'єкта|Розділ: Map проти об'єкта]] · [javascript.info: Map and Set](https://javascript.info/map-set)

> [!question]- Як `Map` порівнює ключі?
> *часто · теорія* · `jsd-19-003`
>
> За SameValueZero: як `===`, але `NaN` дорівнює `NaN`, а `-0` і `+0` вважаються однаковими. Об'єкти — за посиланням, тож два різні `{ id: 1 }` — різні ключі.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви#🗺️ Map проти об'єкта|Розділ: ключі Map]] · [Spec: Map Objects](https://tc39.es/ecma262/#sec-map-objects)

### 🟡 Middle

> [!question]- Що станеться, якщо змінювати `Map` під час `for…of`?
> *іноді · код* · `jsd-19-004`
>
> Поведінка визначена: ітератор живий. Додані під час обходу записи будуть відвідані, видалені до відвідування — пропущені, оновлення значення не змінює позицію. Ризик — нескінченний цикл, якщо безконтрольно додавати.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви#🔁 Порядок ітерації і зміна під час обходу|Розділ: порядок ітерації]] · [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

> [!question]- Які аргументи приймають `union`, `intersection` та інші методи Set?
> *рідко · теорія* · `jsd-19-005`
>
> Будь-який set-like об'єкт: числова `size`, методи `has()` і `keys()`. Підходять `Set` і `Map` (ключі), а масив — ні, бо немає `size` і `has` (`TypeError`). Повертають нову множину, вихідну не змінюють.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви#🧺 Set і нові методи множин|Розділ: методи множин]] · [MDN: Set.prototype.union](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/union)

> [!question]- Для чого `WeakSet`?
> *іноді · практика* · `jsd-19-006`
>
> Позначати об'єкти без утримання їх у пам'яті: «вже оброблено», «створено нашою фабрикою» (brand check), «відвідано» при обході графа з циклами. Методи — лише `add`, `has`, `delete`.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви#👻 WeakMap і WeakSet|Розділ: WeakSet]] · [MDN: WeakSet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)

### 🔴 Senior

> [!question]- Що таке endianness і коли потрібен DataView?
> *іноді · теорія* · `jsd-19-007`
>
> Порядок байтів багатобайтового числа: big-endian — старший першим (мережеві протоколи), little-endian — молодший першим (x86, ARM). Типізовані масиви використовують порядок платформи, а `DataView` дозволяє явно вказати порядок і читати різні типи з довільних зсувів — потрібен для бінарних форматів файлів і протоколів.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви#🔬 DataView і endianness|Розділ: DataView]] · [MDN: Endianness](https://developer.mozilla.org/en-US/docs/Glossary/Endianness) · [MDN: DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

> [!question]- Чим `subarray` відрізняється від `slice` у типізованих масивах?
> *рідко · порівняння* · `jsd-19-008`
>
> `subarray` створює новий view на **той самий** `ArrayBuffer` — зміни видно в обох. `slice` копіює байти в новий буфер. Для «нарізання» великих бінарних даних без копіювання — `subarray`.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви#🧱 ArrayBuffer і типізовані масиви|Розділ: типізовані масиви]] · [MDN: TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

> [!question]- Чому значення у `WeakMap` не утримує свій ключ від GC, навіть якщо посилається на нього?
> *рідко · теорія* · `jsd-19-009`
>
> Записи `WeakMap` — ephemerons: значення досяжне лише тоді, коли ключ досяжний **ззовні**. Посилання значення на власний ключ не рахується, тож цикл «ключ ↔ значення» не утримує ні того, ні іншого. З `Map` такий цикл жив би вічно.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви#👻 WeakMap і WeakSet|Розділ: WeakMap]] · [V8: Weak references and finalizers](https://v8.dev/features/weak-references)

## 🛠️ Практика

> [!task] Групування анаграм через `Map`
> level: junior · difficulty: easy · id: jsd-19-task-01 · tags: map, strings
>
> Напиши `groupAnagrams(words)`, що повертає масив груп слів-анаграм у порядку першої появи групи.
>
> ```js
> groupAnagrams(['кіт', 'тік', 'рак', 'кір', 'арк']);
> // → [['кіт', 'тік'], ['рак', 'арк'], ['кір']]
> ```
>
> ```js starter
> function groupAnagrams(words) {
>   // твій код
> }
> ```
>
> ```js tests
> test('групує анаграми в порядку першої появи', () => {
>   expect(groupAnagrams(['кіт', 'тік', 'рак', 'кір', 'арк']))
>     .toEqual([['кіт', 'тік'], ['рак', 'арк'], ['кір']])
> })
>
> test('порожній масив — порожній результат', () => {
>   expect(groupAnagrams([])).toEqual([])
> })
>
> test('слова без анаграм — кожне у своїй групі', () => {
>   expect(groupAnagrams(['a', 'b', 'c'])).toEqual([['a'], ['b'], ['c']])
> })
>
> test('дублікати потрапляють в одну групу', () => {
>   expect(groupAnagrams(['ab', 'ba', 'ab'])).toEqual([['ab', 'ba', 'ab']])
> })
>
> test('не мутує вхідний масив', () => {
>   const words = ['кіт', 'тік']
>   groupAnagrams(words)
>   expect(words).toEqual(['кіт', 'тік'])
> })
> ```
>
> > [!hint]- Підказка 1
> > У всіх анаграм однаковий «підпис» — відсортовані літери.
>
> > [!hint]- Підказка 2
> > `Map` зберігає порядок вставки — групи йтимуть у порядку першої появи.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function groupAnagrams(words) {
> >   const groups = new Map();
> >   for (const word of words) {
> >     const key = [...word].sort().join('');
> >     if (!groups.has(key)) groups.set(key, []);
> >     groups.get(key).push(word);
> >   }
> >   return [...groups.values()];
> > }
> > ```
> >
> > `[...word]` розбиває на code points, тож працює й з емодзі. Те саме одним рядком: `[...Map.groupBy(words, (w) => [...w].sort().join('')).values()]`.

> [!task] Поясни своїми словами: чому WeakMap не має `size`
> level: middle · difficulty: medium · id: jsd-19-task-02 · tags: feynman, weakmap, gc
>
> Поясни колезі, чому розробники мови свідомо не дали `WeakMap` ні `size`, ні ітерації, і для яких задач він тоді взагалі корисний. Наведи один приклад з фронтенду. До 6 речень.
>
> > [!hint]- Підказка 1
> > Коли саме GC прибирає недосяжний об'єкт? Чи може програма це передбачити?
>
> > [!hint]- Підказка 2
> > Що б показав `size` до і після збирання сміття — і що це означало б для тестів?
>
> > [!solution]- Еталонне пояснення
> > `WeakMap` не утримує ключі: коли на об'єкт-ключ більше ніхто не посилається, збирач сміття прибирає і його, і запис. Але **коли** саме він це зробить — невідомо: за мілісекунду, за хвилину чи ніколи, якщо пам'яті вистачає. Якби був `size` чи ітерація, програма бачила б різні результати залежно від того, чи встиг пройти GC, — і поводилась би непередбачувано між запусками й браузерами. Тому з `WeakMap` можна лише питати про конкретний ключ, який ти вже тримаєш у руках. Цього достатньо для «приклеювання» даних до чужих об'єктів: наприклад, зберігати стан тултіпа для кожного DOM-елемента — видалили елемент зі сторінки, і стан зникне сам, без ручного прибирання й витоків.

> [!task] Парсер заголовка BMP-файлу
> level: senior · difficulty: hard · id: jsd-19-task-03 · tags: arraybuffer, dataview, binary
>
> Напиши `readBmpHeader(buffer)`, що читає з `ArrayBuffer` заголовок BMP: сигнатура — 2 ASCII-байти `'BM'` на зсуві 0; розмір файлу — `uint32` на зсуві 2; ширина — `int32` на зсуві 18; висота — `int32` на зсуві 22; біт на піксель — `uint16` на зсуві 28. Формат little-endian. Якщо сигнатура не `BM` — кинь помилку.
>
> ```js
> const buf = new ArrayBuffer(54);
> const dv = new DataView(buf);
> dv.setUint8(0, 0x42); dv.setUint8(1, 0x4d);
> dv.setUint32(2, 54 + 4 * 2 * 2, true);
> dv.setInt32(18, 2, true); dv.setInt32(22, -2, true); dv.setUint16(28, 32, true);
> readBmpHeader(buf); // → { size: 70, width: 2, height: -2, bitsPerPixel: 32 }
> ```
>
> ```js starter
> function readBmpHeader(buffer) {
>   const dv = new DataView(buffer)
>   // твій код
> }
> ```
>
> ```js tests
> function makeBmp({ sig = [0x42, 0x4d], size = 70, width = 2, height = -2, bpp = 32 } = {}) {
>   const buf = new ArrayBuffer(54)
>   const dv = new DataView(buf)
>   dv.setUint8(0, sig[0]); dv.setUint8(1, sig[1])
>   dv.setUint32(2, size, true)
>   dv.setInt32(18, width, true); dv.setInt32(22, height, true)
>   dv.setUint16(28, bpp, true)
>   return buf
> }
>
> test('читає заголовок з прикладу', () => {
>   expect(readBmpHeader(makeBmp())).toEqual({ size: 70, width: 2, height: -2, bitsPerPixel: 32 })
> })
>
> test('читає little-endian, а не big-endian', () => {
>   const h = readBmpHeader(makeBmp({ size: 0x01020304, width: 640, height: 480, bpp: 24 }))
>   expect(h.size).toBe(0x01020304)
>   expect(h.width).toBe(640)
>   expect(h.height).toBe(480)
>   expect(h.bitsPerPixel).toBe(24)
> })
>
> test('висота знакова: від\'ємна лишається від\'ємною', () => {
>   expect(readBmpHeader(makeBmp({ height: -100 })).height).toBe(-100)
> })
>
> test('кидає помилку, якщо сигнатура не BM', () => {
>   expect(() => readBmpHeader(makeBmp({ sig: [0x50, 0x4b] }))).toThrow()
> })
> ```
>
> > [!hint]- Підказка 1
> > `Uint32Array` тут не підходить: зсуви 2 і 18 не кратні 4, а типізовані масиви вимагають вирівнювання.
>
> > [!hint]- Підказка 2
> > У `DataView` другий аргумент `getUint32(offset, true)` — little-endian. Без нього прочитаєш «перевернуте» число.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function readBmpHeader(buffer) {
> >   const dv = new DataView(buffer);
> >   const signature = String.fromCharCode(dv.getUint8(0), dv.getUint8(1));
> >   if (signature !== 'BM') throw new Error(`Not a BMP: ${signature}`);
> >   const LE = true;
> >   return {
> >     size: dv.getUint32(2, LE),
> >     width: dv.getInt32(18, LE),
> >     height: dv.getInt32(22, LE), // від'ємна висота — рядки зверху вниз
> >     bitsPerPixel: dv.getUint16(28, LE),
> >   };
> > }
> > ```
> >
> > `DataView` не вимагає вирівнювання і явно задає порядок байтів, тому однаково працює на будь-якій платформі. `new Uint32Array(buffer, 2)` кинув би `RangeError` — зсув має бути кратним 4. У реальному коді буфер отримують через `await file.arrayBuffer()` чи `fetch(...).then((r) => r.arrayBuffer())`.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Map and Set](https://javascript.info/map-set) — основи `Map`/`Set` з вправами.
- 🟢 [javascript.info — WeakMap and WeakSet](https://javascript.info/weakmap-weakset) — сценарії кешу й додаткових даних.
- 🟡 [MDN — Keyed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections) — порівняння `Map`, `Set`, `WeakMap`, `WeakSet` і об'єктів.
- 🟡 [MDN — Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) — нові методи множин і set-like об'єкти.
- 🟡 [MDN — JavaScript typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays) — буфери, views, endianness і `DataView`.
- 🟡 [javascript.info — ArrayBuffer, binary arrays](https://javascript.info/arraybuffer-binary-arrays) — бінарні дані з картинками та прикладами.
- 🔴 [V8 — Weak references and finalizers](https://v8.dev/features/weak-references) — як рушій реалізує слабкі посилання й чому з ними обережно.
- 🔴 [ECMAScript — WeakMap Objects](https://tc39.es/ecma262/#sec-weakmap-objects) — першоджерело: які операції дозволені й чому.
- 🔴 [ECMAScript — TypedArray Objects](https://tc39.es/ecma262/#sec-typedarray-objects) — правила перетворення значень і вирівнювання.

> [!important] Підсумок
> - Об'єкт — для записів з фіксованими полями; `Map` — для словників з будь-якими ключами, порядком вставки, `size` за O(1) і частими змінами.
> - `Set` — унікальність і швидке `has`; ES2025 додав `union`, `intersection`, `difference`, `isSubsetOf` та інші, що приймають set-like об'єкти.
> - Ітератори `Map`/`Set` живі: додане під час обходу буде відвідане, видалене — пропущене.
> - `WeakMap`/`WeakSet` не утримують ключі від GC, тому не мають `size` і ітерації — для приватних даних, кешів за об'єктом і позначок.
> - `ArrayBuffer` — сирі байти, типізовані масиви — views у порядку платформи (з переповненням), `DataView` — довільні типи й зсуви з явним endianness.
