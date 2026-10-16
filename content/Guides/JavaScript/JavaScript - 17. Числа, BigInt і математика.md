---
title: Числа, BigInt і математика
order: 17
level: middle
tags: [numbers, ieee754, floating-point, bigint, math, bitwise, money]
prerequisites:
  - "[[JavaScript - 02. Типи та приведення типів]]"
estimatedMinutes: 45
id: jsd-ch-17
icon: "🔢"
---

# Числа, BigInt і математика

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити, як `number` зберігається за стандартом IEEE 754, і чому `0.1 + 0.2 !== 0.3`;
> - правильно порівнювати дробові числа, перевіряти безпечні цілі й розпізнавати `NaN`, `-0` та `Infinity`;
> - обрати між `Number()`, `parseInt`, `parseFloat` і уникнути пасток `toFixed`;
> - рахувати гроші без помилок округлення і форматувати їх через `Intl.NumberFormat`;
> - пояснити, що бітові оператори роблять з числом, і коли потрібен `BigInt`.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-17-quiz-01
>
> ```js
> console.log(0.1 + 0.2 === 0.3, (1.005).toFixed(2), 2 ** 53 === 2 ** 53 + 1, [NaN].includes(NaN));
> ```
>
> **Відповідь:** `false 1.00 true true`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. `0.1`, `0.2` і `1.005` не мають точного двійкового представлення: сума дорівнює `0.30000000000000004`, а `1.005` насправді трохи **менше** за 1.005, тож округлюється вниз. Після `2^53` числа з плаваючою комою вже не можуть представити кожне ціле. А `includes` використовує SameValueZero, для якого `NaN` дорівнює `NaN`.

## 🧒 Простими словами

Уяви лінійку, на якій нанесені поділки, і ти можеш записати лише ту відстань, що збігається з поділкою. Біля нуля поділки дуже часті, а що далі від нуля — то рідші. Число `0.1` потрапляє **між** поділками, тож JS записує найближчу — трохи неточну. Зазвичай цього не видно, але коли складаєш дві «майже точні» відстані, похибки додаються. А після позначки `2^53` поділки стають такими рідкими, що навіть сусідні цілі числа злипаються в одне.

## 🔬 Як це працює насправді

### 🧮 IEEE 754 — як число лежить у пам'яті

Тип `number` — це 64-бітне число з плаваючою комою подвійної точності (double) за стандартом IEEE 754. Окремого типу «ціле» немає: `1` і `1.0` — одне й те саме значення.

> [!diagram] Як -6.5 лежить у 64 бітах
> ```yaml
> layout: flow
> nodes:
>   - { id: sign, label: "знак · 1 біт", text: "?", note: "0 = плюс, 1 = мінус", tone: pink }
>   - { id: exp, label: "експонента · 11 біт", text: "?", note: "степінь двійки, зсув 1023", tone: yellow }
>   - { id: mant, label: "мантиса · 52 біти", text: "?", note: "цифри після прихованої 1.", tone: blue }
>   - { id: out, label: "значення", text: "(−1)^знак × 1.мантиса₂ × 2^(експонента − 1023)", tone: green }
> edges:
>   - { from: mant, to: out, label: "збираємо" }
> steps:
>   - { focus: out, note: "Будь-яке number — це три поля в 64 бітах. Розберемо -6.5 = -110.1₂ = -1.101₂ × 2²." }
>   - { set: { sign: "1" }, note: "Перший біт — знак. 1 означає мінус. Окремий біт знаку — причина існування -0." }
>   - { set: { exp: "10000000001₂ = 1025" }, note: "Експонента зберігається зі зсувом: 2 + 1023 = 1025. Діапазон — від 2^-1022 до 2^1023." }
>   - { set: { mant: "1010000…0₂" }, note: "Мантиса — цифри після «1.»: для 1.101₂ це 101 і нулі. Разом із прихованою 1 — 53 значущі біти." }
>   - { move: { from: mant, to: out, value: "-1 × 1.625 × 2²" }, set: { out: "-6.5 — точно" }, note: "(−1)¹ × 1.625 × 4 = -6.5. Двійковий дріб скінченний — число зберігається без похибки." }
>   - { set: { mant: "1001100110011…₂ (обрізано)", out: "0.1 ≈ 0.1000000000000000055…" }, note: "А 0.1 у двійковій — нескінченний дріб: 52 біти його обрізають. Звідси 0.1 + 0.2 !== 0.3." }
> ```

Звідси всі «дивацтва» розділу:

- точність — **53 двійкові цифри**, тобто ~15–17 десяткових;
- дроби з двійковим знаменником (`0.5`, `0.25`, `0.375`) — точні, а `0.1 = 1/10` у двійковій системі — нескінченний дріб `0.000110011001100…₂`, який обрізається;
- найбільше число — `Number.MAX_VALUE ≈ 1.8e308`, найменше додатне — `Number.MIN_VALUE = 5e-324` (денормалізоване);
- окремий біт знаку дає `+0` і `-0`, а спеціальні значення експоненти — `Infinity` і `NaN`.

```js
console.log((0.5).toString(2));              // → '0.1' — точно
console.log((0.1).toString(2).slice(0, 22)); // → '0.00011001100110011001' — і так далі
```

> [!viz] float-precision
> scenario: ieee754

> [!quiz] Перевір себе: яке з чисел представлене в double ТОЧНО?
> level: middle · type: multi · id: jsd-17-quiz-02
> - [x] `0.75`
> - [ ] `0.1`
> - [x] `2 ** 52`
> - [ ] `0.3`
> - [x] `-0.125`
>
> **Пояснення:** точно представляються числа виду «ціле × степінь двійки» в межах 53 біт точності: `0.75 = 3/4`, `-0.125 = -1/8`. Знаменник `10` містить множник 5, тож `0.1` і `0.3` — завжди наближення.

### 🎯 Чому 0.1 + 0.2 ≠ 0.3 і як порівнювати

Кожен з доданків уже округлений до найближчого double, а сума округлюється ще раз — похибки накопичуються:

```js
console.log(0.1 + 0.2);         // → 0.30000000000000004
console.log(0.3 - 0.1);         // → 0.19999999999999998
console.log(1.1 * 3);           // → 3.3000000000000003
console.log(0.1 + 0.2 > 0.3);   // → true
```

`console.log` показує **найкоротший** десятковий рядок, який однозначно відновлює той самий double. Для `0.1` це `'0.1'`, хоча в пам'яті лежить `0.1000000000000000055511…`.

**Порівняння з допуском.** `Number.EPSILON = 2^-52 ≈ 2.2e-16` — відстань між `1` і наступним double. Порівнювати з ним абсолютну різницю коректно лише для чисел порядку одиниці: для великих чисел крок між сусідніми double більший. Надійніше — **відносний** допуск:

```js
const nearlyEqual = (a, b, eps = Number.EPSILON) =>
  Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b));

console.log(nearlyEqual(0.1 + 0.2, 0.3));                         // → true
console.log(Math.abs(1000.1 + 1000.2 - 2000.3) < Number.EPSILON); // → false — абсолютний допуск підвів
console.log(nearlyEqual(1000.1 + 1000.2, 2000.3));                // → true
```

На практиці допуск обирають з предметної області: для пікселів — `0.5`, для координат GPS — `1e-9`, для грошей — узагалі не використовують дроби (див. нижче).

> [!quiz] Перевір себе: що виведе код?
> level: junior · type: output · id: jsd-17-quiz-03
>
> ```js
> let sum = 0;
> for (let i = 0; i < 10; i++) sum += 0.1;
> console.log(sum === 1, sum.toFixed(10) === '1.0000000000');
> ```
>
> **Відповідь:** `false true`
>
> **Пояснення:** десять разів додавши наближене `0.1`, отримуємо `0.9999999999999999`. Округлення до 10 знаків ховає похибку, але порівнювати рядки з `toFixed` — милиця; краще порівнювати з допуском або рахувати в цілих.

### 🔐 Безпечні цілі, NaN, -0 і Infinity

**Безпечні цілі** — ті, що представлені точно і мають точних сусідів: від `-(2^53 − 1)` до `2^53 − 1` (`Number.MAX_SAFE_INTEGER = 9007199254740991`). Далі мантиса закінчується, і крок між сусідніми числами стає 2, 4, 8…

```js
console.log(Number.MAX_SAFE_INTEGER);             // → 9007199254740991
console.log(9007199254740993);                     // → 9007199254740992 — злиплось із сусідом
console.log(Number.isSafeInteger(2 ** 53));        // → false
console.log(JSON.parse('{"id":12345678901234567890}').id); // → 12345678901234567000 — id з БД зіпсовано
```

Тому великі id (Twitter snowflake, `bigint` з Postgres) у JSON передають **рядками**.

**`NaN`** — «not a number», результат невдалої числової операції (`0 / 0`, `Number('abc')`, `Math.sqrt(-1)`). Це значення типу `number`, і воно **не дорівнює навіть собі**.

| Перевірка | `NaN` | `'abc'` | `undefined` | Примітка |
|---|---|---|---|---|
| `x !== x` | `true` | `false` | `false` | працює лише для `NaN` |
| `isNaN(x)` | `true` | `true` ⚠️ | `true` ⚠️ | спершу приводить до числа |
| `Number.isNaN(x)` | `true` | `false` | `false` | без приведення — правильний вибір |
| `Object.is(x, NaN)` | `true` | `false` | `false` | SameValue |
| `[x].includes(NaN)` | `true` | `false` | `false` | SameValueZero; `indexOf` — не знайде |

**`-0`** існує через біт знаку. Він `=== 0`, але поводиться інакше в діленні й `Object.is`; `String(-0)` і `JSON.stringify(-0)` дають `'0'`, тож його легко «загубити».

```js
console.log(-0 === 0, Object.is(-0, 0)); // → true false
console.log(1 / -0, Math.round(-0.4));   // → -Infinity -0
console.log(String(-0), `${-0}`);        // → '0' '0'
```

**`Infinity`** виникає при переповненні (`Number.MAX_VALUE * 2`) і діленні на нуль (`1 / 0`). `Infinity - Infinity` і `Infinity * 0` дають `NaN`. Для перевірки «нормального» числа — `Number.isFinite` (без приведення), а не глобальний `isFinite('5')`, який поверне `true`.

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-17-quiz-04
>
> ```js
> console.log(isNaN('hello'), Number.isNaN('hello'), [NaN].indexOf(NaN), Object.is(-0, 0));
> ```
>
> **Відповідь:** `true false -1 false`
>
> **Пояснення:** глобальний `isNaN` спершу робить `Number('hello')` → `NaN`. `Number.isNaN` перевіряє без приведення. `indexOf` використовує `===`, тож `NaN` не знаходить. `Object.is` розрізняє `-0` і `+0`.

### 🔤 Парсинг і форматування

Три способи перетворити рядок на число — і в них різна філософія:

| Вхід | `Number(x)` / `+x` | `parseInt(x, 10)` | `parseFloat(x)` |
|---|---|---|---|
| `'42'` | `42` | `42` | `42` |
| `'42px'` | `NaN` — суворо | `42` — читає префікс | `42` |
| `'3.14'` | `3.14` | `3` | `3.14` |
| `''` / `'  '` | `0` ⚠️ | `NaN` | `NaN` |
| `'1e3'` | `1000` | `1` ⚠️ | `1000` |
| `'0x1f'` | `31` | `0` (з radix 10) | `0` |
| `null` | `0` ⚠️ | `NaN` | `NaN` |

`parseInt` спершу перетворює аргумент на **рядок**. Тому `parseInt(0.0000005)` — це `parseInt('5e-7')` → `5`. Завжди передавай radix і не використовуй `parseInt` для округлення — для цього є `Math.trunc`.

**`toFixed(n)`** повертає **рядок** і округлює **двійкове** значення, а не те, що ти бачиш:

```js
console.log((1.005).toFixed(2)); // → '1.00' — бо 1.005 ≈ 1.00499999999999989…
console.log((1.45).toFixed(1));  // → '1.4'
console.log((1.55).toFixed(1));  // → '1.6'
console.log(typeof (2).toFixed(2)); // → 'string' — далі + склеїть рядки!
```

Для показу користувачу — `Intl.NumberFormat` (локаль, валюта, розряди, режими округлення). Детальніше про `Intl` — у [[JavaScript - 24. Дати, час та Intl]].

```js
const uah = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });
console.log(uah.format(1234.5)); // → '1 234,50 ₴'
console.log((255).toString(16), (255).toString(2), parseInt('ff', 16)); // → 'ff' '11111111' 255
```

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-17-quiz-05
>
> ```js
> console.log(Number(''), parseInt(''), parseInt('1e3'), Number('1e3'), parseInt(0.0000005));
> ```
>
> **Відповідь:** `0 NaN 1 1000 5`
>
> **Пояснення:** `Number` для порожнього рядка дає `0`, а `parseInt` — `NaN`. `parseInt` зупиняється на першому «нецифровому» символі (`e`). Останнє — `0.0000005` перетворюється на рядок `'5e-7'`, з якого `parseInt` читає `5`.

> [!quiz] Перевір себе: заповни пропуски з парсингу й форматування
> level: middle · type: fill · id: jsd-17-quiz-09 · bank: parseFloat, 16, isNaN
>
> ```js fill
> Number('42px')              // → [[NaN]] — суворо
> parseInt('42px', [[10]])    // → 42 — читає префікс; radix завжди явно
> (0.1 + 0.2).[[toFixed]](2)  // → '0.30' — увага, рядок!
> Number.[[isFinite]](42)     // → true; для NaN та ±Infinity — false
> ```
>
> **Пояснення:** `Number` вимагає, щоб увесь рядок був числом, а `parseInt` читає числовий префікс — і без явного radix може здивувати. `toFixed` повертає **рядок** і округлює двійкове значення. `Number.isFinite` не приводить типи і відсіює і `NaN`, і нескінченності — ідеальна перевірка «це нормальне число».

### 💰 Гроші й округлення

Золоте правило: **гроші не зберігають у дробах**. Рахуй у найменших одиницях — копійках чи центах — цілими числами (до `2^53` копійок — це ~90 трлн гривень) або в `BigInt`, а ділиш лише на етапі показу.

```js
const items = [1999, 1, 500];                     // копійки: 19.99 + 0.01 + 5.00
const total = items.reduce((a, b) => a + b, 0);   // 2500 — ціле, точне
console.log(total / 100);                          // → 25 — ділимо лише для показу
console.log(19.99 + 0.01 + 5.0);                   // → 25 тут пощастило, але гарантії немає
```

**Округлення.** `Math.round` округлює половину **вгору до +∞**: `Math.round(2.5)` → `3`, але `Math.round(-2.5)` → `-2`. Бухгалтерія часто вимагає *banker's rounding* (half-even) — його дає `Intl.NumberFormat` з `roundingMode: 'halfEven'`.

```text
  Math.round:      -2.5 → -2    -1.5 → -1    1.5 → 2    2.5 → 3     (half → +∞)
  half-even:       -2.5 → -2    -1.5 → -2    1.5 → 2    2.5 → 2     (half → до парного)
  Math.trunc:      -2.5 → -2    -1.5 → -1    1.5 → 1    2.5 → 2     (до нуля)
  Math.floor:      -2.5 → -3    -1.5 → -2    1.5 → 1    2.5 → 2     (до −∞)
```

**Розподіл суми** (наприклад, 100 грн на трьох) без втрати копійки — розкидати залишок:

```js
function allocate(totalCents, parts) {
  const base = Math.floor(totalCents / parts);
  const remainder = totalCents - base * parts;
  return Array.from({ length: parts }, (_, i) => base + (i < remainder ? 1 : 0));
}
console.log(allocate(10000, 3)); // → [3334, 3333, 3333] — сума рівно 10000
```

> [!quiz] Перевір себе: оберіть правильні підходи до грошей
> level: middle · type: multi · id: jsd-17-quiz-06
> - [x] Зберігати суми в копійках цілими числами
> - [ ] Округлювати через `parseFloat(x.toFixed(2))` після кожної операції
> - [x] Форматувати для показу через `Intl.NumberFormat` з `style: 'currency'`
> - [x] Для дуже великих сум або точної арифметики використати `BigInt` чи decimal-бібліотеку
> - [ ] Порівнювати суми через `Number.EPSILON`
>
> **Пояснення:** `toFixed` округлює двійкове значення і повертає рядок — похибки лише маскуються. Цілі копійки точні, а `Intl` відповідає лише за відображення.

> [!quiz] Перевір себе: склади розподіл суми без втрати копійки
> level: middle · type: order · id: jsd-17-quiz-10
>
> ```js order
> function allocate(totalCents, parts) {
>   const base = Math.floor(totalCents / parts)
>   const remainder = totalCents - base * parts
>   return Array.from({ length: parts }, (_, i) => base + (i < remainder ? 1 : 0))
> }
>   const base = Math.round(totalCents / parts) // ✗
> ```
>
> **Пояснення:** `Math.floor` дає базову частку, а залишок (менший за `parts`) розкидається по одній копійці на перші частини — сума завжди рівно `totalCents`. З `Math.round` для `allocate(200, 3)` база була б 67, а `67 · 3 = 201` — зайва копійка й від'ємний залишок.

### ➗ Math і бітові оператори

`Math` — статичний об'єкт з функціями. Найуживаніші й найпідступніші:

```js
console.log(Math.trunc(-4.7), Math.floor(-4.7), Math.ceil(-4.2)); // → -4 -5 -4
console.log(Math.max(), Math.min(), Math.max(NaN, 1));           // → -Infinity Infinity NaN
console.log(-7 % 3, ((-7 % 3) + 3) % 3);                         // → -1 2 — % це залишок, не модуль
console.log(Math.hypot(3, 4), Math.sign(-3), Math.cbrt(-8));     // → 5 -1 -2
```

`Math.random()` — **не** криптографічно стійкий. Для токенів, паролів і id використовуй `crypto.getRandomValues()` або `crypto.randomUUID()`.

**Бітові оператори** (`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`) спершу перетворюють операнди на **32-бітне ціле зі знаком** (ToInt32: відкинути дробову частину, взяти молодші 32 біти), а `>>>` — на беззнакове (ToUint32).

> [!diagram] ToInt32 / ToUint32: що бітовий оператор робить з числом
> ```yaml
> layout: flow
> nodes:
>   - { id: inp, label: "число", text: "-5.7", tone: blue }
>   - { id: conv, label: "перетворення", text: "ToInt32", note: "відкинути дріб, лишити молодші 32 біти", tone: violet }
>   - { id: out, label: "результат", text: "?", tone: green }
> edges:
>   - { from: inp, to: conv, label: "5.9 | 0, ~~x, x & y…" }
>   - { from: conv, to: out }
> steps:
>   - { move: { from: inp, to: conv, value: "-5.7" }, note: "Будь-який бітовий оператор спершу перетворює операнд на 32-бітне ціле зі знаком." }
>   - { move: { from: conv, to: out, value: "-5" }, set: { out: "-5" }, note: "Дробова частина відкидається — обрізання до нуля, як Math.trunc: -5.7 → -5." }
>   - { set: { inp: "3000000000 (> 2^31)", out: "?" }, move: { from: inp, to: conv, value: "3000000000" }, note: "Тепер число, більше за 2^31 − 1: у 32 біти зі знаком воно не влазить." }
>   - { move: { from: conv, to: out, value: "-1294967296" }, set: { out: "-1294967296 ⚠️ переповнення" }, note: "Старший біт стає знаковим: 3000000000 − 2^32 = -1294967296. Тому x | 0 ламається за межами ±2^31." }
>   - { set: { inp: "-5 >>> 0", conv: "ToUint32", out: "?" }, move: { from: inp, to: conv, value: "-5" }, note: "Оператор >>> — єдиний, що перетворює на беззнакове 32-бітне ціле." }
>   - { move: { from: conv, to: out, value: "4294967291" }, set: { out: "4294967291" }, note: "Ті самі біти, прочитані без знаку: 2^32 − 5 = 4294967291." }
> ```

```js
console.log(5.9 | 0, ~~-5.7, 3000000000 | 0); // → 5 -5 -1294967296
console.log(7 & 1, 6 & 1, 1 << 3, -5 >>> 0);  // → 1 0 8 4294967291
const READ = 1, WRITE = 2, EXEC = 4;           // бітові прапорці
const perms = READ | WRITE;
console.log((perms & WRITE) !== 0, (perms & EXEC) !== 0); // → true false
```

Трюк `x | 0` як «швидкий `Math.trunc`» ламається для чисел поза ±2^31 — у сучасних рушіях `Math.trunc` не повільніший, тож пиши зрозуміло.

> [!quiz] Перевір себе: що виведе код?
> level: senior · type: output · id: jsd-17-quiz-07
>
> ```js
> console.log(2 ** 32 + 5 | 0, ~5, -16 >> 2, -16 >>> 28);
> ```
>
> **Відповідь:** `5 -6 -4 15`
>
> **Пояснення:** `ToInt32` відкидає все вище 32 біт, тож `2^32 + 5` → `5`. `~x === -x - 1`. `>>` зберігає знак (`-16 / 4`), а `>>>` заповнює нулями: `-16` як uint32 — це `0xFFFFFFF0`, зсув на 28 дає `0xF` = 15.

### 🐘 BigInt

`BigInt` (ES2020) — окремий примітив для цілих довільної довжини. Літерал — суфікс `n`, `typeof 1n === 'bigint'`.

```js
console.log(2n ** 64n);                          // → 18446744073709551616n
console.log(BigInt(Number.MAX_SAFE_INTEGER) + 2n); // → 9007199254740993n — точно
console.log(7n / 2n, -7n / 2n);                  // → 3n -3n — ділення обрізає до нуля
```

Правила, які питають на співбесідах:

- 🚫 **Змішувати з `number` в арифметиці не можна:** `1n + 1` → `TypeError: Cannot mix BigInt and other types`. Перетворюй явно: `BigInt(x)` або `Number(big)` (з ризиком втрати точності).
- ✅ **Порівнювати можна:** `1n == 1` → `true`, `1n === 1` → `false` (різні типи), `2n > 1.5` → `true`.
- 🚫 Унарний плюс (`+1n`) і функції `Math` кидають `TypeError`; `JSON.stringify({ a: 1n })` — теж `TypeError` (потрібен `toJSON` або replacer).
- 🚫 `BigInt(1.5)` → `RangeError`: створити можна лише з цілого.
- ✅ `0n` — falsy, решта — truthy. `BigInt.asIntN(bits, x)` / `asUintN` емулюють переповнення фіксованої розрядності (наприклад, `int64`).
- 🐢 BigInt повільніший за `number` і не потрапляє в оптимізовані шляхи JIT, тож не заміняй ним усі числа.

```js
const price = 1999n;              // копійки
const qty = 3;
const total = price * BigInt(qty); // явне перетворення
console.log(total, `${total / 100n}.${total % 100n}`); // → 5997n '59.97'
```

> [!quiz] Перевір себе: що з цього кине `TypeError`?
> level: middle · type: multi · id: jsd-17-quiz-08
> - [x] `10n + 5`
> - [ ] `10n > 5`
> - [x] `Math.max(1n, 2n)`
> - [x] `JSON.stringify({ id: 1n })`
> - [ ] `10n == 10`
>
> **Пояснення:** арифметика й `Math` вимагають однакових типів і не приймають BigInt, а `JSON.stringify` не знає, як серіалізувати BigInt. Порівняння (`>`, `==`) між BigInt і number визначене специфікацією й працює коректно.

## ⚠️ Пастки

> [!pitfall] `toFixed` повертає рядок
> Після `toFixed` легко отримати конкатенацію замість додавання.
>
> ```js
> const subtotal = (9.99).toFixed(2);
> console.log(subtotal + 1);   // → '9.991'
> console.log(+subtotal + 1);  // → 10.99
> ```

> [!pitfall] Глобальний `isNaN` приводить типи
> `isNaN('hello')`, `isNaN(undefined)` і `isNaN({})` — усі `true`. Для перевірки саме значення `NaN` використовуй `Number.isNaN`, для «чи це коректне число з форми» — `Number.isFinite(Number(input))` разом з перевіркою на порожній рядок.

> [!pitfall] Великі id з JSON
> `JSON.parse` перетворює числа на `number`, і id більше `2^53` мовчки псуються. Проси бекенд віддавати id рядками; у сучасних рушіях можна витягти точне значення через третій аргумент reviver-а (`context.source`).
>
> ```js
> const data = JSON.parse('{"id":12345678901234567890}', (k, v, ctx) => (k === 'id' ? BigInt(ctx.source) : v));
> console.log(data.id); // → 12345678901234567890n
> ```

> [!pitfall] `sort()` без компаратора для чисел
> `[10, 9, 1].sort()` дає `[1, 10, 9]` — елементи порівнюються як рядки. Для чисел — `sort((a, b) => a - b)`; для BigInt — `(a, b) => (a < b ? -1 : a > b ? 1 : 0)`, бо `a - b` повертає BigInt, а компаратор має повертати number.

## 🎤 На співбесіді

> [!interview] Чому `0.1 + 0.2 !== 0.3` і як з цим жити?
> level: junior · frequency: дуже часто · id: jsd-17-int-01
>
> ---
>
> Числа в JS — 64-бітні double за IEEE 754: 52 біти мантиси, двійкова система. `0.1` і `0.2` — нескінченні двійкові дроби, тож зберігаються наближено; сума округлюється ще раз і дає `0.30000000000000004`. Це властивість формату, а не баг JS — так само в Python, Java, C. Рішення залежить від задачі: порівнювати з відносним допуском (`Math.abs(a - b) <= Number.EPSILON * Math.max(1, |a|, |b|)`), для грошей рахувати в цілих копійках або `BigInt`/decimal-бібліотеці, для показу — `Intl.NumberFormat` чи `toFixed`.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика#🎯 Чому 0.1 + 0.2 ≠ 0.3 і як порівнювати|Розділ: 0.1 + 0.2]] · [0.30000000000000004.com](https://0.30000000000000004.com/) · [Floating-Point Guide](https://floating-point-gui.de/)

> [!interview] Що таке `Number.MAX_SAFE_INTEGER` і коли потрібен `BigInt`?
> level: middle · frequency: часто · id: jsd-17-int-02
>
> ---
>
> `2^53 − 1` — найбільше ціле, для якого і воно, і сусіди представлені точно; вище мантиса закінчується, і `2^53 + 1 === 2^53`. `BigInt` потрібен для цілих довільної довжини: 64-бітні id, криптографія, точні фінансові розрахунки в найменших одиницях, `int64` з бінарних протоколів. Обмеження: не змішується з `number` в арифметиці (`TypeError`), не працює з `Math` і `JSON.stringify`, ділення обрізає дробову частину, і він повільніший.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика#🐘 BigInt|Розділ: BigInt]] · [MDN: BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) · [V8: BigInt](https://v8.dev/features/bigint)

> [!interview] Як перевірити, що значення — `NaN`, і чому `NaN !== NaN`?
> level: middle · frequency: часто · id: jsd-17-int-03
>
> ---
>
> IEEE 754 визначає, що `NaN` не дорівнює нічому, включно з собою: результат невизначеної операції не можна вважати рівним іншому невизначеному. Перевірки: `Number.isNaN(x)` (без приведення — правильний вибір), `Object.is(x, NaN)`, `x !== x`. Глобальний `isNaN` спершу приводить до числа, тож `isNaN('abc') === true`. Для колекцій: `includes`, `Map`, `Set` використовують SameValueZero і знаходять `NaN`, а `indexOf` (`===`) — ні.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика#🔐 Безпечні цілі, NaN, -0 і Infinity|Розділ: NaN і -0]] · [MDN: Number.isNaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN) · [Spec: Number.isNaN](https://tc39.es/ecma262/#sec-number.isnan)

## 🔗 Зв'язки

- [[JavaScript - 02. Типи та приведення типів]] — `ToNumber`: чому `Number('')` дає `0`, а `+[]` — теж `0`.
- [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] — `Float64Array`, `Int32Array` і `BigInt64Array` дають ту саму арифметику, але з фіксованою розрядністю.
- [[JavaScript - 23. JSON, structuredClone і серіалізація]] — BigInt і великі id під час серіалізації.
- [[JavaScript - 24. Дати, час та Intl]] — `Intl.NumberFormat` і локалізоване форматування.
- [[JavaScript - 31. Продуктивність і V8]] — Smi (малі цілі) і HeapNumber: як V8 оптимізує числа.

## ⚡ Фішки

> [!reel] 🧮 0.30000000000000004 — це не баг JavaScript
> Той самий результат дадуть Python, Java і C: усі використовують IEEE 754. `0.1` у двійковій — нескінченний дріб, як `1/3` у десятковій.

> [!reel] 👯 Після 2^53 цілі числа злипаються
> Мантиса double має 53 біти. Далі сусідні числа відстоять на 2, 4, 8…
>
> ```js
> 9007199254740993; // → 9007199254740992
> 2 ** 53 + 1 === 2 ** 53; // → true
> ```

> [!reel] ➖ У JavaScript є мінус нуль
> `-0 === 0`, але `1 / -0 === -Infinity`, а `Object.is(-0, 0) === false`. Його дає, наприклад, `Math.round(-0.4)`. `String(-0)` ховає мінус — тому його рідко помічають.

> [!reel] 🎲 Math.random не для паролів
> Генератор `Math.random` передбачуваний, якщо знати стан. Для токенів і id бери `crypto.randomUUID()` або `crypto.getRandomValues()`.

> [!reel] 🪙 Math.round(-2.5) — це -2
> `Math.round` округлює половину до +∞, а не «від нуля». Тому `2.5 → 3`, але `-2.5 → -2`. Банківське округлення (half-even) є в `Intl.NumberFormat`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Як число зберігається в JavaScript?
> *часто · теорія* · `jsd-17-001`
>
> Як 64-бітний double за IEEE 754: 1 біт знаку, 11 біт експоненти, 52 біти мантиси. Окремого цілого типу немає (крім `BigInt`), тож `1 === 1.0`.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика#🧮 IEEE 754 — як число лежить у пам'яті|Розділ: IEEE 754]] · [Spec: The Number Type](https://tc39.es/ecma262/#sec-ecmascript-language-types-number-type)

> [!question]- Чим `Number('42px')` відрізняється від `parseInt('42px', 10)`?
> *часто · порівняння* · `jsd-17-002`
>
> `Number` суворий: увесь рядок має бути числом, інакше `NaN`. `parseInt` читає числовий префікс і зупиняється на першому зайвому символі — `42`. Нюанси: `Number('') === 0`, `parseInt('') → NaN`, `parseInt('1e3') → 1`.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика#🔤 Парсинг і форматування|Розділ: парсинг]] · [MDN: parseInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)

> [!question]- Чому гроші не можна зберігати як `19.99`?
> *часто · практика* · `jsd-17-003`
>
> Дробові суми зберігаються наближено, і похибки накопичуються при додаванні й множенні. Зберігай найменші одиниці (копійки) цілими числами або `BigInt`, а ділення на 100 і форматування роби лише при показі.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика#💰 Гроші й округлення|Розділ: гроші]] · [Floating-Point Guide](https://floating-point-gui.de/)

### 🟡 Middle

> [!question]- Чому `(1.005).toFixed(2)` дає `'1.00'`?
> *часто · код* · `jsd-17-004`
>
> Літерал `1.005` зберігається як найближчий double — `1.00499999999999989…`, тобто трохи менше. `toFixed` округлює саме двійкове значення, тому вниз. До того ж повертає рядок.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика#🔤 Парсинг і форматування|Розділ: toFixed]] · [MDN: toFixed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)

> [!question]- Що таке `Number.EPSILON` і чому порівнювати з ним абсолютну різницю — неточно?
> *іноді · теорія* · `jsd-17-005`
>
> `2^-52` — відстань від `1` до наступного double. Для чисел, далеких від 1, крок між сусідніми double інший, тож абсолютний допуск `EPSILON` або занадто суворий (великі числа), або занадто м'який (дуже малі). Правильно — відносний допуск, масштабований за величиною чисел.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика#🎯 Чому 0.1 + 0.2 ≠ 0.3 і як порівнювати|Розділ: EPSILON]] · [MDN: Number.EPSILON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON)

> [!question]- Що робить `x | 0` і коли це небезпечно?
> *іноді · код* · `jsd-17-006`
>
> Перетворює `x` на 32-бітне ціле зі знаком (ToInt32): відкидає дробову частину й старші біти. Для чисел поза `±2^31` дає переповнення (`3000000000 | 0 → -1294967296`). Для обрізання використовуй `Math.trunc`.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика#➗ Math і бітові оператори|Розділ: бітові оператори]] · [Spec: ToInt32](https://tc39.es/ecma262/#sec-toint32)

> [!question]- Як відрізнити `-0` від `0` і де він з'являється?
> *рідко · теорія* · `jsd-17-007`
>
> `Object.is(x, -0)` або `1 / x === -Infinity`. З'являється при округленні малих від'ємних (`Math.round(-0.4)`), множенні `0 * -1`, діленні `-1 / Infinity`. `===`, `String`, `JSON.stringify` його не помічають.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика#🔐 Безпечні цілі, NaN, -0 і Infinity|Розділ: -0]] · [javascript.info: Numbers](https://javascript.info/number)

### 🔴 Senior

> [!question]- Які правила змішування `BigInt` і `number`?
> *часто · теорія* · `jsd-17-008`
>
> Арифметика (`+ - * / % **`) і бітові операції між ними — `TypeError`. Порівняння `<`, `>`, `==` — дозволені й точні, `===` завжди `false` для різних типів. `Math.*`, унарний `+` і `JSON.stringify` з BigInt — `TypeError`. Перетворення явні: `BigInt(int)` (дробове → `RangeError`) і `Number(big)` (можлива втрата точності).
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика#🐘 BigInt|Розділ: BigInt]] · [javascript.info: BigInt](https://javascript.info/bigint) · [Spec: The BigInt Type](https://tc39.es/ecma262/#sec-ecmascript-language-types-bigint-type)

> [!question]- Як розділити суму між N учасниками без втрати копійки?
> *іноді · практика* · `jsd-17-009`
>
> Працювати в цілих копійках: `base = Math.floor(total / n)`, залишок `total − base·n` (менше за `n`) роздати по одній копійці першим учасникам. Сума частин завжди дорівнює загальній, на відміну від `total / n` з округленням кожної частини.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика#💰 Гроші й округлення|Розділ: розподіл суми]] · [MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

## 🛠️ Практика

> [!task] Безпечний парсер числа з форми
> level: junior · difficulty: easy · id: jsd-17-task-01 · tags: numbers, parsing
>
> Напиши `parseAmount(input)`: приймає рядок з інпуту, дозволяє пробіли по краях і кому як десятковий розділювач, повертає число або `null`, якщо введено не число. Порожній рядок, `'12px'`, `'Infinity'` — `null`.
>
> ```js
> parseAmount(' 12,5 '); // → 12.5
> parseAmount('');       // → null
> parseAmount('12px');   // → null
> parseAmount('1e3');    // → 1000
> ```
>
> ```js starter
> function parseAmount(input) {
>   // твій код
> }
> ```
>
> ```js tests
> test('приймає пробіли по краях і кому як розділювач', () => {
>   expect(parseAmount(' 12,5 ')).toBe(12.5)
>   expect(parseAmount('7')).toBe(7)
>   expect(parseAmount('0,01')).toBe(0.01)
> })
>
> test('порожній рядок і самі пробіли — null, а не 0', () => {
>   expect(parseAmount('')).toBeNull()
>   expect(parseAmount('   ')).toBeNull()
> })
>
> test('сміття після числа — null (на відміну від parseFloat)', () => {
>   expect(parseAmount('12px')).toBeNull()
>   expect(parseAmount('abc')).toBeNull()
> })
>
> test('Infinity — null, експоненційний запис — число', () => {
>   expect(parseAmount('Infinity')).toBeNull()
>   expect(parseAmount('1e3')).toBe(1000)
> })
> ```
>
> > [!hint]- Підказка 1
> > `Number` суворіший за `parseFloat` — це те, що треба. Але подумай, що він робить з порожнім рядком.
>
> > [!hint]- Підказка 2
> > `Number.isFinite` відсіює і `NaN`, і `Infinity`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function parseAmount(input) {
> >   const normalized = String(input).trim().replace(',', '.');
> >   if (normalized === '') return null;
> >   const n = Number(normalized);
> >   return Number.isFinite(n) ? n : null;
> > }
> > ```
> >
> > Перевірка на порожній рядок обов'язкова, бо `Number('') === 0`. `Number.isFinite` не приводить типи і відкидає `NaN` та `±Infinity`.

> [!task] Поясни своїми словами: чому `0.1 + 0.2 !== 0.3`
> level: middle · difficulty: medium · id: jsd-17-task-02 · tags: feynman, numbers, ieee754
>
> Поясни менеджеру продукту, чому в кошику з'явилось `0.30000000000000004 ₴` і що команда змінить. Без слів «мантиса» та «експонента». До 6 речень.
>
> > [!hint]- Підказка 1
> > Чому `1/3` неможливо точно записати десятковим дробом? Те саме для `1/10` у двійковій системі.
>
> > [!hint]- Підказка 2
> > Як касир уникає дробів? Він рахує в копійках.
>
> > [!solution]- Еталонне пояснення
> > Комп'ютер зберігає числа у двійковій системі, а в ній `0.1` — нескінченний дріб, як `1/3 = 0.3333…` у десятковій. Тому він записує не саме `0.1`, а дуже близьке значення, обрізане до певної кількості цифр. Коли складаємо два таких «майже точні» числа, крихітні похибки додаються й стають помітними: `0.30000000000000004`. Це властивість усіх мов програмування, а не помилка конкретного коду. Ми почнемо рахувати всі суми в копійках цілими числами — їх комп'ютер зберігає точно, — а гривні з копійками показуватимемо лише на екрані. Так у кошику завжди буде рівно стільки, скільки покупець очікує.

> [!task] Точна сума грошей з ПДВ і рівним розподілом
> level: senior · difficulty: hard · id: jsd-17-task-03 · tags: numbers, money, bigint, rounding
>
> Напиши `addVat(cents, ratePercent)` — повертає суму з ПДВ у копійках з округленням half-even (банківським) для дробової копійки, і `formatUAH(cents)` для показу. Працюй з `BigInt`, щоб не залежати від `2^53`.
>
> ```js
> addVat(1000n, 20); // → 1200n
> addVat(1n, 50);    // → 2n   (1.5 → 2, парне)
> addVat(3n, 50);    // → 4n   (4.5 → 4, парне)
> formatUAH(123456n); // → '1 234,56 ₴'
> ```
>
> ```js starter
> function addVat(cents, ratePercent) {
>   // твій код
> }
>
> function formatUAH(cents) {
>   // твій код
> }
> ```
>
> ```js tests
> test('addVat рахує ПДВ у копійках і повертає BigInt', () => {
>   expect(addVat(1000n, 20)).toBe(1200n)
>   expect(addVat(0n, 20)).toBe(0n)
> })
>
> test('дробова копійка округлюється half-even', () => {
>   expect(addVat(1n, 50)).toBe(2n)  // 1.5 → 2
>   expect(addVat(3n, 50)).toBe(4n)  // 4.5 → 4
>   expect(addVat(5n, 50)).toBe(8n)  // 7.5 → 8
> })
>
> test('не-половини округлюються до найближчого', () => {
>   expect(addVat(7n, 20)).toBe(8n)  // 8.4 → 8
>   expect(addVat(8n, 20)).toBe(10n) // 9.6 → 10
> })
>
> test('працює за межами 2^53', () => {
>   expect(addVat(10n ** 20n, 20)).toBe(12n * 10n ** 19n)
> })
>
> test('formatUAH: розряди, кома і дві цифри копійок', () => {
>   const normalize = (s) => s.replace(/\s/g, ' ')
>   expect(normalize(formatUAH(123456n))).toBe('1 234,56 ₴')
>   expect(normalize(formatUAH(5n))).toBe('0,05 ₴')
>   expect(normalize(formatUAH(100n))).toBe('1,00 ₴')
> })
> ```
>
> > [!hint]- Підказка 1
> > Помнож на `(100 + rate)` і поділи на `100` — ділення BigInt обрізає, але залишок `%` скаже, яка дробова частина.
>
> > [!hint]- Підказка 2
> > Half-even: якщо залишок × 2 більше за дільник — округлити вгору; якщо рівно половина — вгору лише тоді, коли частка непарна.
>
> > [!hint]- Підказка 3
> > `Intl.NumberFormat.prototype.format` приймає BigInt, але гривні з копійками простіше зібрати з рядка: ціла частина і `padStart(2, '0')` для копійок.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function divRoundHalfEven(n, d) {
> >   const q = n / d;          // обрізання до нуля (для невід'ємних — floor)
> >   const r = n % d;
> >   if (r * 2n > d) return q + 1n;
> >   if (r * 2n === d) return q % 2n === 0n ? q : q + 1n;
> >   return q;
> > }
> > const addVat = (cents, ratePercent) =>
> >   divRoundHalfEven(cents * BigInt(100 + ratePercent), 100n);
> >
> > function formatUAH(cents) {
> >   const hryvnias = cents / 100n;
> >   const kop = String(cents % 100n).padStart(2, '0');
> >   const whole = new Intl.NumberFormat('uk-UA').format(hryvnias); // format приймає BigInt
> >   return `${whole},${kop} ₴`;
> > }
> > ```
> >
> > Уся арифметика — у цілих, тож похибок double немає взагалі. Рішення розраховане на невід'ємні суми; для від'ємних (повернення) треба окремо обробити знак, бо `/` у BigInt обрізає до нуля. Пробіл-розділювач тисяч у `uk-UA` — нерозривний, що для відображення якраз правильно.

## 📚 Джерела та що почитати

- 🟢 [0.30000000000000004.com](https://0.30000000000000004.com/) — та сама сума в десятках мов: доказ, що це не «баг JS».
- 🟢 [javascript.info — Numbers](https://javascript.info/number) — округлення, `toFixed`, `isNaN`, `parseInt` з вправами.
- 🟢 [The Floating-Point Guide](https://floating-point-gui.de/) — коротко й без формул: чому дроби неточні й як порівнювати.
- 🟡 [MDN — Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) — константи, методи і таблиця перетворень.
- 🟡 [MDN — BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) — правила змішування, `asIntN`, серіалізація.
- 🟡 [V8 — BigInt: arbitrary-precision integers](https://v8.dev/features/bigint) — навіщо додали BigInt і як він працює в рушії.
- 🔴 [David Goldberg — What Every Computer Scientist Should Know About Floating-Point Arithmetic](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html) — класична стаття про природу похибок.
- 🔴 [ECMAScript — The Number Type](https://tc39.es/ecma262/#sec-ecmascript-language-types-number-type) — першоджерело: NaN, ±0, ±Infinity і округлення.
- 🛠️ [float.exposed](https://float.exposed/) — інтерактивно показує біти будь-якого double.

> [!important] Підсумок
> - `number` — 64-бітний double IEEE 754: 53 біти точності, тому дроби на кшталт `0.1` наближені, а цілі точні лише до `2^53 − 1`.
> - Порівнюй дроби з відносним допуском, а гроші рахуй у цілих копійках чи `BigInt`; `toFixed` округлює двійкове значення і повертає рядок.
> - `NaN` не дорівнює собі — перевіряй `Number.isNaN`; `-0` ловить лише `Object.is`; `Number.isFinite` відсіює `NaN` і `±Infinity`.
> - `Number` суворий, `parseInt/parseFloat` читають префікс; завжди передавай radix.
> - Бітові оператори працюють з 32-бітними цілими (переповнення!), `BigInt` — з довільними, але не змішується з `number` в арифметиці.
