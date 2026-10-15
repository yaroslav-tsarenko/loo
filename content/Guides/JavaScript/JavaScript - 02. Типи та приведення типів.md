---
title: Типи та приведення типів
order: 2
level: junior
tags: [types, coercion, equality, typeof]
prerequisites:
  - "[[JavaScript - 01. Як JS виконує код]]"
estimatedMinutes: 40
id: jsd-ch-02
icon: "🧬"
---

# Типи та приведення типів

> [!success] 🎯 Після цього розділу ти зможеш
> - назвати всі 8 типів JS і пояснити кожне дивацтво `typeof`;
> - передбачити результат `ToNumber`, `ToString`, `ToBoolean` для будь-якого значення і напам'ять перелічити falsy-значення;
> - розібрати крок за кроком, як обчислюється `a == b`, і пояснити, чому `[] == ![]` — це `true`;
> - передбачити результат `+` для будь-якої пари операндів (рядок чи число?);
> - обрати між `===`, `==` і `Object.is` усвідомлено, а не «бо так сказав лінтер».

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jsd-02-quiz-01
>
> ```js
> console.log(1 + '2' - 1);
> console.log([] == false);
> console.log(null >= 0 && null != 0);
> ```
>
> **Відповідь:** `11 true true`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. `1 + '2'` — це конкатенація (`'12'`), а `-` вміє лише числа: `'12' - 1 === 11`. `[] == false` зводить обидва боки до чисел: `0 == 0`. А `null` поводиться в `>=` і `==` за **різними** правилами: `>=` перетворює `null` на `0`, а `==` — ні.

## 🧒 Простими словами

Уяви обмінник валют у аеропорту. Ти приносиш долари й кажеш «дайте мені гривні» — це **явне** приведення (`Number('42')`). А тепер уяви касу в магазині, яка мовчки приймає будь-яку валюту й сама її конвертує за своїм курсом — це **неявне** приведення (`'5' * 2`). Зручно, але якщо не знаєш курсу, отримуєш несподівану решту. Цей розділ — таблиця курсів: коли касир вирішить, що ти дав «рядок», а коли — «число».

## 🔬 Як це працює насправді

### 🧱 Сім примітивів і об'єкт

У JS **8 типів**. Сім із них — **примітиви** (незмінні значення без власних методів):

| Тип | Приклад | Нюанс |
|---|---|---|
| `undefined` | `undefined` | «значення ще не присвоєно» |
| `null` | `null` | «навмисно порожньо» |
| `boolean` | `true`, `false` | |
| `number` | `42`, `3.14`, `NaN`, `Infinity`, `-0` | 64-бітний IEEE 754 double — **один** тип для цілих і дробових |
| `bigint` | `10n` | цілі довільної довжини; не змішується з `number` |
| `string` | `'hi'` | незмінний: `s[0] = 'H'` нічого не змінить |
| `symbol` | `Symbol('id')` | унікальний ідентифікатор, часто — ключ властивості |

Восьмий тип — **`object`**: усе інше. Масиви, функції, дати, регулярні вирази, `Map` — це об'єкти.

Як тоді працює `'abc'.toUpperCase()`, якщо в примітивів немає методів? Через **autoboxing**: рушій на мить загортає рядок у тимчасовий об'єкт `String`, викликає метод з `String.prototype` і викидає обгортку.

```js
const s = 'abc';
s.custom = 1;          // записали у тимчасову обгортку, яку одразу викинули
console.log(s.custom); // → undefined
console.log(0.1 + 0.2 === 0.3); // → false — number це double, звідси похибка
```

### 🏷️ typeof і його дивацтва

`typeof` повертає рядок із назвою типу. Майже завжди — очікувано. Але є чотири місця, які треба знати напам'ять:

```js
typeof undefined      // → "undefined"
typeof 42             // → "number"
typeof 10n            // → "bigint"
typeof Symbol()       // → "symbol"

typeof null           // → "object"    ← історичний баг першої версії JS
typeof function () {} // → "function"  ← хоча функція — це об'єкт
typeof class {}       // → "function"  ← клас — теж функція
typeof NaN            // → "number"    ← «Not a Number» має тип number
typeof []             // → "object"    ← масив — об'єкт; перевіряй Array.isArray
typeof notDeclared    // → "undefined" ← неоголошена змінна не кидає помилку
```

Як надійно перевірити:

```js
value === null;              // саме null
Array.isArray(value);        // масив
Number.isNaN(value);         // саме NaN (без приведення!)
typeof value === 'object' && value !== null; // «справжній» об'єкт
```

Виняток з «typeof ніколи не кидає»: змінна `let`/`const` у TDZ — `typeof x` до її оголошення дає `ReferenceError` (див. [[JavaScript - 04. Scope, hoisting і TDZ]]).

> [!figure] devtools-console
> scenario: typeof-quirks
>
> Ті самі дивацтва в справжній консолі Chrome: `typeof null` — `'object'`, масив — теж object, а звернення до властивості `null` дає червону TypeError.

> [!quiz] Перевір себе: оберіть рядки, де typeof поверне "object"
> level: junior · type: multi · id: jsd-02-quiz-02
> - [x] `typeof null`
> - [x] `typeof []`
> - [ ] `typeof function () {}`
> - [x] `typeof new Date()`
> - [ ] `typeof NaN`
> - [ ] `typeof Symbol('x')`
>
> **Пояснення:** функції мають власний результат `"function"`, `NaN` — `"number"`, символ — `"symbol"`. `null` — `"object"` через старий баг, а масив і дата — справжні об'єкти.

> [!quiz] Перевір себе: заповни пропуски, щоб `typeOf` чесно розрізняв null і масиви
> level: junior · type: fill · id: jsd-02-quiz-07 · bank: undefined, instanceof, ==
>
> ```js fill
> function typeOf(value) {
>   if (value [[===]] [[null]]) return 'null'
>   if (Array.[[isArray]](value)) return 'array'
>   return [[typeof]] value
> }
> typeOf(null)   // → 'null'
> typeOf([])     // → 'array'
> typeOf(() => 1) // → 'function'
> ```
>
> **Пояснення:** `typeof` помиляється рівно у двох місцях, які часто треба розрізняти: `null` (дає `"object"`) і масиви (теж `"object"`). Тому їх перевіряємо **до** `typeof`: `null` — строгим порівнянням, масив — `Array.isArray` (надійніший за `instanceof Array`, бо працює між iframe).

### ⚙️ Абстрактні операції: як JS «перекладає» значення

Специфікація описує приведення через кілька **абстрактних операцій**. Їх не можна викликати напряму, але саме вони працюють усередині `+`, `==`, `if`, шаблонних рядків тощо.

**ToPrimitive(value, hint)** — як об'єкт стає примітивом. Hint — підказка, що потрібне: `"number"`, `"string"` або `"default"`.

1. Якщо в об'єкта є `[Symbol.toPrimitive]` — викликати його з hint.
2. Інакше для hint `"string"`: спершу `toString()`, потім `valueOf()`.
3. Для `"number"` і `"default"`: спершу `valueOf()`, потім `toString()`.
4. Перший результат-примітив і є відповіддю; якщо обидва повернули об'єкти — `TypeError`.

Для звичайних об'єктів і масивів `valueOf()` повертає сам об'єкт (не примітив), тож у результаті спрацьовує `toString()`. Виняток — `Date`: hint `"default"` для неї поводиться як `"string"`.

```js
const price = {
  valueOf() { return 42; },
  toString() { return 'price'; },
};
price * 2;   // → 84       (hint "number": valueOf)
`${price}`;  // → "price"  (hint "string": toString)
price + '';  // → "42"     (hint "default": valueOf!)
```

**ToNumber** — перетворення на число:

| Значення | Результат |
|---|---|
| `undefined` | `NaN` |
| `null` | `0` |
| `true` / `false` | `1` / `0` |
| `''`, `'  '`, `'\n'` | `0` (порожній рядок після trim) |
| `' 12 '`, `'1e3'`, `'0x10'` | `12`, `1000`, `16` |
| `'12px'` | `NaN` (на відміну від `parseInt('12px') === 12`) |
| `[]`, `[5]`, `[1, 2]` | `0`, `5`, `NaN` (через ToPrimitive → `''`, `'5'`, `'1,2'`) |
| `{}` | `NaN` (`'[object Object]'`) |
| `Symbol()` | `TypeError` |

**ToString** — перетворення на рядок: `null → 'null'`, `undefined → 'undefined'`, `-0 → '0'`, `[1, [2, 3]] → '1,2,3'`, `[] → ''`, `[null] → ''`, `{} → '[object Object]'`. Неявне приведення символу до рядка кидає `TypeError` (а явне `String(sym)` — працює).

**ToBoolean** — найпростіше: існує **фіксований список falsy-значень**, усе інше — truthy.

```js
// Повний список falsy:
false, 0, -0, 0n, '', null, undefined, NaN
// (+ історичний document.all у браузерах)

// Усе інше — truthy, включно з цими пастками:
Boolean('0');                 // → true
Boolean('false');             // → true
Boolean([]);                  // → true
Boolean({});                  // → true
Boolean(new Boolean(false));  // → true — це об'єкт!
```

> [!quiz] Перевір себе: оберіть усі falsy-значення
> level: junior · type: multi · id: jsd-02-quiz-03
> - [x] `0n`
> - [ ] `'0'`
> - [x] `NaN`
> - [ ] `[]`
> - [x] `''`
> - [ ] `' '`
> - [x] `-0`
>
> **Пояснення:** рядок з пробілом і рядок `'0'` — непорожні рядки, отже truthy. Порожній масив — об'єкт, а всі об'єкти truthy. ToBoolean не викликає ToPrimitive — саме тому `[]` truthy, хоча `[] == false`.

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-02-quiz-04
>
> ```js
> const box = {
>   valueOf() { return 7; },
>   toString() { return 'box'; },
> };
> console.log(box + 1, `${box}`, String(box));
> ```
>
> **Відповідь:** `8 box box`
>
> **Пояснення:** `+` викликає ToPrimitive з hint `"default"` — спершу `valueOf()` → `7`, тож `7 + 1 = 8`. Шаблонний рядок і `String()` просять hint `"string"` — спершу `toString()`.

### ⚖️ == проти ===

**`===` (strict equality)** не приводить типи: різні типи → одразу `false`. Два винятки, які треба пам'ятати: `NaN === NaN` — `false`, а `0 === -0` — `true`.

**`==` (loose equality)** спершу приводить операнди до спільного типу. Алгоритм *IsLooselyEqual* (спрощено, але порядок кроків точний):

1. Однакові типи → порівняти як `===`.
2. `null == undefined` → `true`. З **будь-чим іншим** `null` і `undefined` не рівні (`null == 0` — `false`).
3. Число і рядок → рядок перетворити на число.
4. Є `boolean` → **спершу** перетворити boolean на число (`true → 1`, `false → 0`) і почати знову.
5. Об'єкт і примітив → об'єкт через ToPrimitive (hint `"default"`) і почати знову.
6. BigInt і число/рядок → порівняти математичні значення.

> [!viz] coercion
> scenario: loose-equality

Розберемо легенду `[] == ![]`:

```js
[] == ![]
// 1. ![]: [] truthy → ![] === false
[] == false
// 2. boolean → число: false → 0
[] == 0
// 3. об'єкт → примітив: [] → ''
'' == 0
// 4. рядок → число: '' → 0
0 == 0 // → true
```

Корисні наслідки:

```js
'0' == false;    // → true  ('0' → 0, false → 0)
'' == 0;         // → true
null == 0;       // → false (крок 2: null дорівнює лише undefined)
null >= 0;       // → true  (оператори порівняння використовують ToNumber: 0 >= 0)
true == 'true';  // → false (true → 1, 'true' → NaN)
```

**`Object.is(a, b)`** — алгоритм *SameValue*: як `===`, але чесний у двох крайніх випадках.

```js
Object.is(NaN, NaN); // → true   (а NaN === NaN → false)
Object.is(0, -0);    // → false  (а 0 === -0 → true)
```

Саме SameValue (точніше SameValueZero, де `0` і `-0` рівні) використовують `Array.prototype.includes`, `Map` і `Set` — тому `[NaN].includes(NaN)` дає `true`, а `[NaN].indexOf(NaN)` (використовує `===`) — `-1`. А React порівнює стан через `Object.is`.

**Практичне правило:** за замовчуванням — `===`. Єдиний поширений ідіоматичний `==` — це `value == null`, що коротко означає «`null` або `undefined`».

> [!quiz] Перевір себе: що поверне вираз `true == 'true'`?
> level: junior · id: jsd-02-quiz-05
> - [ ] `true` — обидва «правдиві»
> - [x] `false` — boolean спершу стає числом `1`, а `'true'` — `NaN`
> - [ ] `TypeError`
> - [ ] `true`, бо рядок приводиться до boolean
>
> **Пояснення:** `==` ніколи не перетворює операнд на boolean. Навпаки — boolean перетворюється на число. Тому `if (x == true)` — майже завжди помилка: пиши `if (x)`. Див. [Spec: IsLooselyEqual](https://tc39.es/ecma262/#sec-islooselyequal).

> [!quiz] Перевір себе: склади кроки, якими `==` обчислює `[1] == true`
> level: middle · type: order · id: jsd-02-quiz-08
>
> ```js order
> [1] == true
> [1] == 1
> '1' == 1
> 1 == 1
> true == true // ✗
> ```
>
> **Пояснення:** спершу boolean → число (`true → 1`), потім об'єкт → примітив (`[1] → '1'`), потім рядок → число. До boolean `==` не приводить ніколи — тому рядка `true == true` в алгоритмі немає.

### ➕ Оператор + — найхитріший

`+` — єдиний арифметичний оператор, який уміє і додавати, і склеювати рядки. Алгоритм:

1. Обидва операнди → **ToPrimitive** з hint `"default"`.
2. Якщо **хоча б один** результат — рядок → обидва ToString і конкатенація.
3. Інакше обидва → ToNumber (або обидва BigInt) і додавання.

Решта арифметики (`-`, `*`, `/`, `%`, унарний `+`) рядків не знає — завжди ToNumber.

> [!viz] coercion
> scenario: plus-operator

```js
1 + '2';        // → '12'
'3' - 1;        // → 2
1 + 2 + '3';    // → '33'  (зліва направо: 3 + '3')
'1' + 2 + 3;    // → '123' ('12' + 3)
[1, 2] + [3];   // → '1,23' ('1,2' + '3')
[] + {};        // → '[object Object]'
null + 1;       // → 1     (null → 0)
undefined + 1;  // → NaN
true + 1;       // → 2
+'42';          // → 42    (унарний + — короткий Number())
10n + 1;        // → TypeError: Cannot mix BigInt and other types
```

Відомий фокус `{} + []` у консолі дає `0` — але не тому, що `+` дивний. На початку рядка `{}` парситься як **порожній блок коду**, і лишається `+[]` — унарний плюс, тобто `Number([]) === 0`. У виразі `({} + [])` результат — `'[object Object]'`.

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-02-quiz-06
>
> ```js
> console.log('5' * '2', '5' + 2 - 2, [] + null + 1);
> ```
>
> **Відповідь:** `10 50 null1`
>
> **Пояснення:** `*` завжди числовий: `10`. `'5' + 2` → `'52'`, потім `'52' - 2` → `50`. `[] + null`: `[]` → `''`, рядок є, отже `'' + 'null'` → `'null'`, далі `'null' + 1` → `'null1'`.

## ⚠️ Пастки

> [!pitfall] Значення з input — завжди рядок
> Поля форм, `URLSearchParams`, `localStorage`, змінні оточення повертають рядки. `+` їх склеїть.
>
> ```js
> const qty = '2';  // з <input>
> qty + 1;          // → '21'
> Number(qty) + 1;  // → 3
> ```

> [!pitfall] `isNaN` приводить типи, `Number.isNaN` — ні
> Глобальний `isNaN` спершу робить ToNumber, тому «не-числові» рядки теж вважаються NaN.
>
> ```js
> isNaN('hello');        // → true  (бо Number('hello') — NaN)
> Number.isNaN('hello'); // → false (це рядок, а не NaN)
> ```

> [!pitfall] Перевірка `if (count)` відкидає нуль
> `0` і `''` — falsy, тож валідне значення може загубитися. Для «є значення» використовуй `??` або порівняння з `null`.
>
> ```js
> const count = 0;
> const shown = count || 10; // → 10 — нуль загубився!
> const right = count ?? 10; // → 0  — ?? реагує лише на null/undefined
> ```

> [!pitfall] Сортування чисел без компаратора
> `sort()` за замовчуванням перетворює елементи на рядки і порівнює їх лексикографічно.
>
> ```js
> [10, 1, 2].sort();                // → [1, 10, 2]
> [10, 1, 2].sort((a, b) => a - b); // → [1, 2, 10]
> ```

## 🎤 На співбесіді

> [!interview] Чим `==` відрізняється від `===`? Коли можна використовувати `==`?
> level: junior · frequency: дуже часто · id: jsd-02-int-01
>
> ---
>
> `===` порівнює без приведення типів: різні типи — одразу `false`. `==` спершу приводить операнди за алгоритмом IsLooselyEqual: `null` дорівнює лише `undefined`; boolean стає числом; рядок порівнюється з числом як число; об'єкт перетворюється на примітив через ToPrimitive. Звідси `'0' == false` і `[] == ![]` — `true`. На практиці — `===` скрізь, а `x == null` — прийнятна ідіома «`null` або `undefined`». Бонус: `Object.is` відрізняється від `===` лише для `NaN` і `±0`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚖️ == проти ===|Розділ: == проти ===]] · [MDN: Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness) · [Spec: IsLooselyEqual](https://tc39.es/ecma262/#sec-islooselyequal)

> [!interview] Які значення в JS є falsy? Чому `[]` truthy, хоча `[] == false`?
> level: junior · frequency: часто · id: jsd-02-int-02
>
> ---
>
> Falsy рівно вісім: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN` (плюс `document.all` як історичний виняток). Усі об'єкти truthy. Суперечності немає, бо це **різні** операції: `if ([])` використовує ToBoolean (об'єкт → `true`), а `[] == false` — алгоритм `==`, де `false → 0`, а `[]` через ToPrimitive → `''` → `0`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚙️ Абстрактні операції: як JS «перекладає» значення|Розділ: ToBoolean і falsy]] · [MDN: Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) · [Spec: ToBoolean](https://tc39.es/ecma262/#sec-toboolean)

> [!interview] Як об'єкт перетворюється на примітив?
> level: middle · frequency: іноді · id: jsd-02-int-03
>
> ---
>
> Через ToPrimitive з hint `"string"`, `"number"` або `"default"`. Спершу шукається метод `[Symbol.toPrimitive](hint)`. Якщо його немає — для `"string"` викликається `toString()`, потім `valueOf()`; для `"number"` і `"default"` — навпаки. Береться перший примітивний результат, інакше `TypeError`. `Date` трактує `"default"` як `"string"`, тому `date + 1` — рядок, а `date - 1` — число.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚙️ Абстрактні операції: як JS «перекладає» значення|Розділ: ToPrimitive]] · [MDN: Symbol.toPrimitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive) · [javascript.info: Object to primitive conversion](https://javascript.info/object-toprimitive)

## 🔗 Зв'язки

- [[JavaScript - 03. Значення та посилання]] — примітиви незмінні й копіюються за значенням, а об'єкти — ні; тому порівняння `{} === {}` дає `false`.
- [[JavaScript - 04. Scope, hoisting і TDZ]] — чому `typeof` для змінної в TDZ кидає помилку, а для неоголошеної — ні.
- [[JavaScript - 07. Прототипи та класи]] — `toString` і `valueOf`, які викликає ToPrimitive, живуть у `Object.prototype` і можуть бути перевизначені.
- [[JavaScript - 12. Масиви та функціональний стиль]] — `includes` vs `indexOf` і компаратори в `sort` — прямі наслідки правил порівняння.

## ⚡ Фішки

> [!reel] 🧩 typeof null — баг віком 30 років
> У першій реалізації значення зберігались із тегом типу, і тег об'єкта був `000`. `null` — нульовий вказівник — теж складався з нулів. Виправлення пропонували в ES2015, але воно зламало б півінтернету.
>
> ```js
> typeof null // → "object"
> ```

> [!reel] 🥴 [] == ![] — це true, і це логічно
> `![]` — це `false` (масив truthy). Далі `[] == false` → `[] == 0` → `'' == 0` → `0 == 0`. Чотири чесні кроки алгоритму — жодної магії.

> [!reel] 🍌 'b' + 'a' + +'a' + 'a'
> Унарний `+'a'` — це `NaN`, а далі все склеюється в рядок.
>
> ```js
> ('b' + 'a' + +'a' + 'a').toLowerCase()
> // → "banana"
> ```

> [!reel] 🤯 Math.max() менший за Math.min()
> Без аргументів `Math.max()` повертає `-Infinity` (нейтральний елемент для максимуму), а `Math.min()` — `Infinity`. Математично бездоганно.
>
> ```js
> Math.max() < Math.min() // → true
> ```

> [!reel] 🔬 parseInt(0.0000005) === 5
> `parseInt` спершу перетворює аргумент на рядок. А `0.0000005` у рядку — це `'5e-7'`. Парсинг зупиняється на `e`.
>
> ```js
> parseInt(0.0000005) // → 5
> ```

> [!reel] 🪞 NaN — єдине значення, не рівне собі
> `NaN !== NaN` за IEEE 754. Тому до появи `Number.isNaN` перевіряли так: `x !== x`. `Object.is(NaN, NaN)` і `[NaN].includes(NaN)` — `true`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Які типи даних є в JavaScript?
> *дуже часто · теорія* · `jsd-02-001`
>
> Вісім: сім примітивів — `undefined`, `null`, `boolean`, `number`, `bigint`, `string`, `symbol` — і `object`. Функції, масиви, дати — підвиди об'єкта.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#🧱 Сім примітивів і об'єкт|Розділ: типи даних]] · [MDN: JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures) · [Spec: ECMAScript Language Types](https://tc39.es/ecma262/#sec-ecmascript-language-types)

> [!question]- Які значення falsy?
> *дуже часто · теорія* · `jsd-02-002`
>
> `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`. Усе інше truthy, включно з `'0'`, `'false'`, `[]`, `{}`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚙️ Абстрактні операції: як JS «перекладає» значення|Розділ: ToBoolean і falsy]] · [MDN: Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) · [javascript.info: Type Conversions](https://javascript.info/type-conversions)

> [!question]- Чому `typeof null === 'object'`?
> *часто · теорія* · `jsd-02-003`
>
> Історичний баг першої реалізації: тег типу об'єкта був `0`, а `null` представлявся нульовим вказівником. Виправлення зламало б зворотну сумісність, тому його не роблять. Перевіряй `value === null`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#🏷️ typeof і його дивацтва|Розділ: typeof]] · [MDN: typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) · [Spec: The typeof Operator](https://tc39.es/ecma262/#sec-typeof-operator)

> [!question]- Чим `null` відрізняється від `undefined`?
> *часто · порівняння* · `jsd-02-004`
>
> `undefined` — «значення ще немає» (неініціалізована змінна, відсутня властивість, функція без `return`). `null` — «навмисно порожньо», його присвоює програміст. `null == undefined` — `true`, `===` — `false`; `Number(null) === 0`, `Number(undefined)` — `NaN`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#🧱 Сім примітивів і об'єкт|Розділ: null і undefined]] · [MDN: null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null) · [MDN: undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)

### 🟡 Middle

> [!question]- Як обчислюється `[] == ![]` і чому результат `true`?
> *часто · код* · `jsd-02-005`
>
> `![]` → `false` (об'єкт truthy). `[] == false` → boolean стає числом: `[] == 0`. Об'єкт → ToPrimitive: `'' == 0`. Рядок → число: `0 == 0` → `true`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚖️ == проти ===|Розділ: алгоритм ==]] · [MDN: Equality (==)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) · [Spec: IsLooselyEqual](https://tc39.es/ecma262/#sec-islooselyequal)

> [!question]- Чому `null == 0` — `false`, а `null >= 0` — `true`?
> *іноді · код* · `jsd-02-006`
>
> Різні алгоритми. `==` має окреме правило: `null` дорівнює лише `undefined`, ToNumber не викликається. Реляційні оператори (`<`, `>=`) завжди роблять ToNumber: `null → 0`, і `0 >= 0` — `true`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚖️ == проти ===|Розділ: порівняння з null]] · [javascript.info: Comparisons](https://javascript.info/comparison) · [Spec: IsLessThan](https://tc39.es/ecma262/#sec-islessthan)

> [!question]- За яким правилом `+` вирішує: складати чи склеювати?
> *дуже часто · теорія* · `jsd-02-007`
>
> Обидва операнди → ToPrimitive (hint `"default"`). Якщо хоча б один став рядком — конкатенація. Інакше — числове додавання. Операція іде зліва направо: `1 + 2 + '3' === '33'`, а `'1' + 2 + 3 === '123'`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#➕ Оператор + — найхитріший|Розділ: оператор +]] · [MDN: Addition (+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition) · [Spec: ApplyStringOrNumericBinaryOperator](https://tc39.es/ecma262/#sec-applystringornumericbinaryoperator)

> [!question]- Чим `Object.is` відрізняється від `===` і де він використовується?
> *іноді · порівняння* · `jsd-02-008`
>
> Лише двома випадками: `Object.is(NaN, NaN)` — `true`, `Object.is(0, -0)` — `false`. Використовується в React для порівняння стану й залежностей хуків. `Map`, `Set` і `includes` використовують близький SameValueZero (`NaN` рівний собі, `±0` рівні).
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚖️ == проти ===|Розділ: Object.is і SameValue]] · [MDN: Object.is()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) · [Spec: SameValue](https://tc39.es/ecma262/#sec-samevalue)

### 🔴 Senior

> [!question]- Чому `{} + []` у консолі дає `0`, а `({} + [])` — `'[object Object]'`?
> *рідко · код* · `jsd-02-009`
>
> На початку інструкції `{` парситься як блок коду, а не літерал об'єкта. Залишається `+[]` — унарний плюс: `Number([])` → `Number('')` → `0`. У дужках `{}` — уже вираз-об'єкт, і спрацьовує бінарний `+`: `'[object Object]' + ''`.
>
> 📚 [[JavaScript - 02. Типи та приведення типів#➕ Оператор + — найхитріший|Розділ: оператор +]] · [MDN: Addition (+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition) · [MDN: Block statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block)

> [!question]- Як керувати приведенням власного об'єкта до примітива?
> *іноді · практика* · `jsd-02-010`
>
> Визначити `[Symbol.toPrimitive](hint)` — він має пріоритет над `valueOf`/`toString` і отримує hint `"number"`, `"string"` чи `"default"`.
>
> ```js
> const money = {
>   amount: 5,
>   [Symbol.toPrimitive](hint) {
>     return hint === 'string' ? `${this.amount} грн` : this.amount;
>   },
> };
> money * 2;   // → 10
> `${money}`;  // → '5 грн'
> ```
>
> 📚 [[JavaScript - 02. Типи та приведення типів#⚙️ Абстрактні операції: як JS «перекладає» значення|Розділ: ToPrimitive]] · [MDN: Symbol.toPrimitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive) · [Spec: OrdinaryToPrimitive](https://tc39.es/ecma262/#sec-ordinarytoprimitive)

## 🛠️ Практика

> [!task] Таблиця приведень
> level: junior · difficulty: easy · id: jsd-02-task-01 · tags: coercion
>
> Не запускаючи код, запиши результат кожного виразу. Потім перевір у консолі.
>
> ```js
> Number('  7  ');
> Number('7a');
> Boolean('0');
> String([1, [2, 3]]);
> '10' / '2';
> '10' + 2;
> null + undefined;
> ```
>
> Запиши результати в масив `answers` у тому ж порядку — **літералами**, не копіюючи вирази (рядки в лапках, `NaN` як `NaN`).
>
> ```js starter
> const answers = [
>   // твій код: 7 значень по порядку
> ]
> ```
>
> ```js tests
> test('Number обрізає пробіли, але не прощає зайвих символів', () => {
>   expect(answers[0]).toBe(7)
>   expect(answers[1]).toBeNaN()
> })
>
> test('непорожній рядок "0" — truthy', () => {
>   expect(answers[2]).toBe(true)
> })
>
> test('масив стає рядком через join з комами, вкладені теж', () => {
>   expect(answers[3]).toBe('1,2,3')
> })
>
> test('/ завжди числовий, а + з рядком — конкатенація', () => {
>   expect(answers[4]).toBe(5)
>   expect(answers[5]).toBe('102')
> })
>
> test('null + undefined → 0 + NaN', () => {
>   expect(answers[6]).toBeNaN()
>   expect(answers).toHaveLength(7)
> })
> ```
>
> > [!hint]- Підказка 1
> > ToNumber обрізає пробіли по краях, але не прощає зайвих символів.
>
> > [!hint]- Підказка 2
> > `null + undefined`: рядків немає, отже ToNumber для обох — `0` і `NaN`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const answers = [
> >   7,       // Number('  7  ')
> >   NaN,     // Number('7a')
> >   true,    // Boolean('0')
> >   '1,2,3', // String([1, [2, 3]])
> >   5,       // '10' / '2'
> >   '102',   // '10' + 2
> >   NaN,     // null + undefined
> > ]
> > ```

> [!task] Поясни своїми словами: `[] == false`, але `if ([])` виконується
> level: junior · difficulty: medium · id: jsd-02-task-02 · tags: feynman, coercion
>
> Колега стверджує: «JS суперечить сам собі — `[] == false` дає `true`, а `if ([]) {...}` усе одно заходить у блок». Поясни своїми словами, чому суперечності немає. Використай слова «приведення до boolean» і «порівняння ==».
>
> > [!hint]- Підказка 1
> > Це дві різні операції з різними правилами. Яку з них використовує `if`?
>
> > [!hint]- Підказка 2
> > Чи викликає `==` перетворення на boolean хоч на якомусь кроці?
>
> > [!solution]- Еталонне пояснення
> > `if` питає одне: «це значення truthy?». Для цього є фіксований список з восьми falsy-значень, і об'єктів у ньому немає — тому будь-який масив, навіть порожній, у `if` поводиться як `true`. Ніяких перетворень вмісту масиву не відбувається.
> >
> > `==` працює інакше: він **ніколи** не перетворює операнди на boolean. Навпаки — побачивши `false`, він робить з нього число `0`. Потім бачить масив поруч із числом і перетворює масив на примітив: порожній масив стає порожнім рядком, а порожній рядок — числом `0`. Виходить `0 == 0`.
> >
> > Тобто «дорівнює false» і «є falsy» — різні питання. Саме тому писати `if (x == false)` замість `if (!x)` — погана ідея.

> [!task] Напиши `looseEqual` за специфікацією
> level: middle · difficulty: hard · id: jsd-02-task-03 · tags: coercion, equality
>
> Реалізуй `looseEqual(a, b)`, яка повторює поведінку `a == b` **без використання `==`** (можна `===`, `Number`, `String`, `typeof`). BigInt і `document.all` можна ігнорувати. Для приведення об'єкта до примітива досить спершу `valueOf()`, а якщо він повернув об'єкт — `toString()`.
>
> ```js
> looseEqual([], false);       // → true
> looseEqual(null, 0);         // → false
> looseEqual(null, undefined); // → true
> looseEqual('1', 1);          // → true
> looseEqual({}, '[object Object]'); // → true
> ```
>
> ```js starter
> function looseEqual(a, b) {
>   // твій код
> }
> ```
>
> ```js tests
> test('приклади з умови', () => {
>   expect(looseEqual([], false)).toBe(true)
>   expect(looseEqual(null, 0)).toBe(false)
>   expect(looseEqual(null, undefined)).toBe(true)
>   expect(looseEqual('1', 1)).toBe(true)
>   expect(looseEqual({}, '[object Object]')).toBe(true)
> })
>
> test('однакові типи: NaN не дорівнює собі, обʼєкти — за посиланням', () => {
>   const o = {}
>   expect(looseEqual(NaN, NaN)).toBe(false)
>   expect(looseEqual(o, o)).toBe(true)
>   expect(looseEqual({}, {})).toBe(false)
> })
>
> test('boolean спершу стає числом', () => {
>   expect(looseEqual('0', false)).toBe(true)
>   expect(looseEqual(true, 'true')).toBe(false)
>   expect(looseEqual([0], false)).toBe(true)
> })
>
> test('null і undefined не рівні нічому, крім одне одного', () => {
>   expect(looseEqual(undefined, 0)).toBe(false)
>   expect(looseEqual(null, false)).toBe(false)
>   expect(looseEqual('', null)).toBe(false)
> })
>
> test('обʼєкт приводиться через valueOf, потім toString', () => {
>   expect(looseEqual({ valueOf: () => 42 }, 42)).toBe(true)
>   expect(looseEqual([1, 2], '1,2')).toBe(true)
>   expect(looseEqual('', 0)).toBe(true)
> })
>
> test('реалізація не використовує ==', () => {
>   expect(looseEqual.toString()).not.toMatch(/[^=!]==[^=]/)
> })
> ```
>
> > [!hint]- Підказка 1
> > Пиши функцію рекурсивно: кожне правило приводить один операнд і викликає `looseEqual` знову.
>
> > [!hint]- Підказка 2
> > Порядок перевірок важливий: однаковий тип → `null`/`undefined` → boolean → число/рядок → об'єкт/примітив.
>
> > [!hint]- Підказка 3
> > Функції — теж об'єкти: «є об'єктом» = `(typeof x === 'object' && x !== null) || typeof x === 'function'`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const isObject = (x) =>
> >   (typeof x === 'object' && x !== null) || typeof x === 'function';
> >
> > function toPrimitive(obj) {
> >   const v = obj.valueOf();
> >   if (!isObject(v)) return v;
> >   const s = obj.toString();
> >   if (!isObject(s)) return s;
> >   throw new TypeError('Cannot convert object to primitive value');
> > }
> >
> > function looseEqual(a, b) {
> >   const ta = a === null ? 'null' : typeof a;
> >   const tb = b === null ? 'null' : typeof b;
> >   if (ta === tb || (isObject(a) && isObject(b))) return a === b;
> >   const nullish = (x) => x === null || x === undefined;
> >   if (nullish(a) || nullish(b)) return nullish(a) && nullish(b);
> >   if (typeof a === 'boolean') return looseEqual(Number(a), b);
> >   if (typeof b === 'boolean') return looseEqual(a, Number(b));
> >   if (typeof a === 'number' && typeof b === 'string') return a === Number(b);
> >   if (typeof a === 'string' && typeof b === 'number') return Number(a) === b;
> >   if (isObject(a)) return looseEqual(toPrimitive(a), b);
> >   if (isObject(b)) return looseEqual(a, toPrimitive(b));
> >   return false; // напр. symbol проти числа
> > }
> > ```
> >
> > Кожен рядок відповідає кроку IsLooselyEqual. Зверни увагу: `===` для однакових типів автоматично дає `NaN !== NaN`, а для двох об'єктів — порівняння посилань.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Type Conversions](https://javascript.info/type-conversions) — базові правила перетворення в рядок, число і boolean.
- 🟢 [javascript.info — Comparisons](https://javascript.info/comparison) — порівняння різних типів, `null` і `undefined` з прикладами.
- 🟡 [MDN — JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures) — усі типи мови, їхні особливості та обгортки примітивів.
- 🟡 [MDN — Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness) — `==`, `===`, `Object.is` і SameValueZero в одній таблиці.
- 🟡 [javascript.info — Object to primitive conversion](https://javascript.info/object-toprimitive) — `Symbol.toPrimitive`, `valueOf`, `toString` і підказки hint.
- 🔴 [ECMAScript — IsLooselyEqual](https://tc39.es/ecma262/#sec-islooselyequal) — точний алгоритм `==` — розв'язує будь-яку «дивну» задачу.
- 🔴 [ECMAScript — ToPrimitive](https://tc39.es/ecma262/#sec-toprimitive) — алгоритм перетворення об'єкта на примітив.
- 🔴 [ECMAScript — ApplyStringOrNumericBinaryOperator](https://tc39.es/ecma262/#sec-applystringornumericbinaryoperator) — як `+` вирішує, складати чи склеювати.
- 🛠️ [ESLint — eqeqeq](https://eslint.org/docs/latest/rules/eqeqeq) — правило, що забороняє `==` (з опцією для `== null`).

> [!important] Підсумок
> - 8 типів: 7 примітивів (`undefined`, `null`, `boolean`, `number`, `bigint`, `string`, `symbol`) + `object`. Дивацтва `typeof`: `null → "object"`, функція → `"function"`, `NaN → "number"`.
> - Falsy рівно вісім: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`. Усі об'єкти truthy.
> - Об'єкт → примітив через ToPrimitive: `Symbol.toPrimitive`, потім `valueOf`/`toString` залежно від hint.
> - `==` приводить типи (boolean → число, рядок → число, об'єкт → примітив, `null` дорівнює лише `undefined`); `===` — ні; `Object.is` чесний для `NaN` і `±0`.
> - `+` склеює, якщо після ToPrimitive є хоч один рядок; решта арифметики завжди числова.
