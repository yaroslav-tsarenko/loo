---
title: Оператори та вирази
order: 3
level: junior
tags: [javascript, beginner, operators, expressions]
prerequisites:
  - "[[JavaScript Start - 02. Змінні та значення]]"
estimatedMinutes: 30
id: jss-ch-03
icon: "➕"
---

# Оператори та вирази

> [!success] 🎯 Після цього розділу ти зможеш
> - рахувати в JavaScript: `+ - * / % **` і короткі форми `+=`, `++`;
> - порівнювати значення і розуміти, що результат — це `true` або `false`;
> - пояснити, чому пишемо `===`, а не `==`;
> - поєднувати умови через `&&`, `||` і `!`;
> - передбачати порядок обчислення і керувати ним дужками.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-03-quiz-01
>
> ```js
> console.log(2 + 3 * 4)
> console.log('5' + 1)
> console.log(10 % 3)
> ```
>
> **Відповідь:** `14 51 1`
>
> **Пояснення:** множення виконується раніше за додавання: `3 * 4 = 12`, потім `2 + 12 = 14`. `'5' + 1` — рядок плюс число: JavaScript **склеює** їх у `'51'`. `%` — остача від ділення: `10 = 3 * 3 + 1`, остача `1`. Нічого страшного, якщо щось здивувало, — зараз розберемо.

## 🧒 Простими словами

**Вираз** — це будь-який шматок коду, який дає значення: `5`, `price * 2`, `age >= 18`. **Оператор** — «дія» між значеннями: `+`, `*`, `>`, `&&`.

Уяви три інструменти на столі:

- 🧮 **калькулятор** — арифметичні оператори рахують числа;
- ⚖️ **терези** — оператори порівняння кажуть «так» чи «ні»;
- 🔌 **вимикачі** — логічні оператори поєднують кілька «так/ні» в одне.

## 🔬 Як це працює

### 🧮 Арифметика

| Оператор | Що робить | Приклад | Результат |
|---|---|---|---|
| `+` | додає | `7 + 2` | `9` |
| `-` | віднімає | `7 - 2` | `5` |
| `*` | множить | `7 * 2` | `14` |
| `/` | ділить | `7 / 2` | `3.5` |
| `%` | остача від ділення | `7 % 2` | `1` |
| `**` | степінь | `2 ** 3` | `8` |

`%` здається дивним, але він дуже корисний: `n % 2 === 0` — число парне; `n % 10` — остання цифра числа.

Короткі форми для зміни змінної:

```js
let score = 10
score += 5     // те саме, що score = score + 5
console.log(score) // → 15
score -= 3     // score = score - 3
console.log(score) // → 12
score *= 2     // score = score * 2
console.log(score) // → 24
score++        // додати 1
console.log(score) // → 25
```

Два «особливих» числа, які ти точно зустрінеш:

```js
console.log(5 / 0)        // → Infinity — нескінченність
console.log('кіт' * 2)    // → NaN — Not a Number, «не вийшло порахувати»
```

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-03-quiz-02
>
> ```js
> let coins = 7
> coins += 3
> console.log(coins % 4)
> ```
>
> **Відповідь:** `2`
>
> **Пояснення:** `coins` стає `10`. `10 % 4` — остача від ділення 10 на 4: `10 = 4 * 2 + 2`, тож `2`.

> [!quiz] Заповни пропуски: додай 10 очок і перевір парність
> level: junior · type: fill · id: jss-03-quiz-03
>
> ```js fill
> let points = 4
> points [[+=]] 10
> const isEven = points [[%]] 2 === 0
> ```
>
> **Пояснення:** `+=` додає до поточного значення. Число парне, якщо остача від ділення на 2 дорівнює нулю.

### ⚖️ Порівняння

Оператори порівняння завжди повертають **булеве значення**: `true` або `false`.

| Оператор | Значення | Приклад | Результат |
|---|---|---|---|
| `>` / `<` | більше / менше | `5 > 3` | `true` |
| `>=` / `<=` | більше-або-дорівнює / менше-або-дорівнює | `18 >= 18` | `true` |
| `===` | строго дорівнює | `2 === 2` | `true` |
| `!==` | строго не дорівнює | `2 !== '2'` | `true` |

Результат порівняння можна покласти в змінну — і дати йому зрозуміле ім'я:

```js
const age = 17
const isAdult = age >= 18
console.log(isAdult) // → false
```

Рядки теж порівнюються — за алфавітом, посимвольно: `'apple' < 'banana'` → `true`. Але з великими літерами й кирилицею бувають сюрпризи, тож для сортування людських слів пізніше знадобиться `localeCompare`.

> [!quiz] Перевір себе: чому дорівнює `isCold`?
> level: junior · id: jss-03-quiz-04
>
> ```js
> const temperature = 10
> const isCold = temperature < 15
> ```
>
> - [x] `true`
> - [ ] `false`
> - [ ] `10`
> - [ ] `'temperature < 15'`
>
> **Пояснення:** `10 < 15` — правда, тож `isCold` отримує `true`. Порівняння завжди дає булеве значення.

### 🎯 Чому === а не ==

У JavaScript є два «дорівнює»:

- `===` (**строга** рівність) — порівнює і значення, і тип. `'5' === 5` → `false`.
- `==` (**нестрога**) — спершу намагається **перетворити** типи, а потім порівнює. Правила перетворення заплутані:

```js
console.log('5' == 5)   // → true — рядок перетворився на число
console.log(0 == '')    // → true — порожній рядок став нулем
console.log(0 == false) // → true — false став нулем
console.log('5' === 5)  // → false
```

Пограйся: обери два значення і подивись, які кроки робить `==`:

> [!viz] coercion
> scenario: loose-equality
>
> Кожна стрілка — окреме приховане перетворення. Саме тому `===` надійніший.

> [!important] Правило
> Завжди пиши `===` і `!==`. Тоді не треба пам'ятати таблицю перетворень. Детально, звідки беруться ці дива, — у [[JavaScript - 02. Типи та приведення типів]].

> [!quiz] Перевір себе: які вирази дають `true`? Обери все правильне
> level: junior · type: multi · id: jss-03-quiz-05
> - [x] `'5' == 5`
> - [ ] `'5' === 5`
> - [x] `5 === 5`
> - [x] `'5' !== 5`
> - [ ] `1 === '1'`
>
> **Пояснення:** `==` перетворює рядок на число, тож `'5' == 5` — `true`. `===` типи не змінює: рядок не дорівнює числу. А `!==` — строге «не дорівнює»: рядок `'5'` справді не те саме, що число `5`.

### 🔌 Логічні оператори

Коли умов кілька, їх поєднують:

| Оператор | Читається | Дає `true`, коли… |
|---|---|---|
| `&&` | «і» | **обидві** частини `true` |
| `\|\|` | «або» | **хоча б одна** частина `true` |
| `!` | «не» | перевертає: `!true` → `false` |

```js
const age = 20
const hasTicket = true
console.log(age >= 18 && hasTicket)   // → true — дорослий І з квитком

const day = 'нд'
console.log(day === 'сб' || day === 'нд') // → true — вихідний

console.log(!hasTicket) // → false
```

Таблиця істинності для `&&` і `||` — коротко:

```text
  A      B     │  A && B   A || B
 ──────────────┼──────────────────
 true   true   │  true     true
 true   false  │  false    true
 false  true   │  false    true
 false  false  │  false    false
```

> [!quiz] Заповни пропуски: можна кермувати, якщо є 18 **і** є права; вихідний — субота **або** неділя
> level: junior · type: fill · id: jss-03-quiz-06
>
> ```js fill
> const age = 20
> const hasLicense = true
> const day = 'нд'
> const canDrive = age >= 18 [[&&]] hasLicense
> const isWeekend = day === 'сб' [[\|\|]] day === 'нд'
> ```

> [!quiz] Склади код: ціна, знижка 50, потім — подвоїти й надрукувати
> level: junior · type: order · id: jss-03-quiz-07
>
> ```js order
> const price = 200
> const withDiscount = price - 50
> const total = withDiscount * 2
> console.log(total)
> ```
>
> **Пояснення:** кожен рядок використовує лише те, що вже оголошено вище. Результат: `(200 - 50) * 2 = 300`.

### 🧮 Пріоритет: хто рахується першим

Як у шкільній математиці: `*`, `/`, `%` виконуються раніше за `+` і `-`. Порівняння — ще пізніше, а `&&` і `||` — майже в самому кінці. **Дужки** переважують усе.

```js
console.log(2 + 3 * 4)    // → 14
console.log((2 + 3) * 4)  // → 20
console.log(1 + 2 > 2 && 5 > 10) // → false
```

Останній рядок рушій рахує так: `1 + 2` → `3`; `3 > 2` → `true`; `5 > 10` → `false`; `true && false` → `false`.

> [!tip] Сумніваєшся — став дужки
> Ніхто не пам'ятає всю таблицю пріоритетів. Дужки `(…)` роблять порядок очевидним і для рушія, і для людини, яка читатиме код.

> [!quiz] Склади кроки, як рушій обчислює `2 + 3 * (4 - 1)`
> level: junior · type: order · id: jss-03-quiz-08
>
> ```text order
> 4 - 1 = 3  (спершу дужки)
> 3 * 3 = 9  (потім множення)
> 2 + 9 = 11 (і лише тоді додавання)
> ```

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-03-quiz-09
>
> ```js
> console.log(10 - 4 / 2)
> console.log((10 - 4) / 2)
> ```
>
> **Відповідь:** `8 3`
>
> **Пояснення:** без дужок ділення першим: `4 / 2 = 2`, `10 - 2 = 8`. З дужками: `6 / 2 = 3`.

## ⚠️ Пастки

> [!pitfall] Числа з `prompt` чи з поля вводу — це рядки
> Усе, що вводить користувач, приходить **текстом**. `+` склеїть рядки замість додавання. Перетвори на число через `Number(...)`.
>
> ```js
> const a = '5'
> const b = '3'
> console.log(a + b)                 // → 53
> console.log(Number(a) + Number(b)) // → 8
> ```

> [!pitfall] `=` замість `===`
> Один знак `=` — це **присвоєння**, а не порівняння. `if (x = 5)` не перевіряє, а **кладе** 5 у `x`. Для порівняння завжди три знаки: `x === 5`.

> [!pitfall] `0.1 + 0.2` не дорівнює `0.3`
> Дробові числа зберігаються у двійковому вигляді з крихітною похибкою — так у більшості мов програмування.
>
> ```js
> console.log(0.1 + 0.2)         // → 0.30000000000000004
> console.log(0.1 + 0.2 === 0.3) // → false
> ```
>
> Для грошей рахуй у копійках (цілими числами). Чому так — у [[JavaScript - 17. Числа, BigInt і математика]].

> [!pitfall] `NaN` не дорівнює навіть собі
> `NaN === NaN` → `false`. Щоб перевірити, чи вийшло «не число», використовуй `Number.isNaN(value)`.

## 🎤 На співбесіді

> [!interview] Чим відрізняються `==` і `===`?
> level: junior · frequency: дуже часто · id: jss-03-int-01
>
> ---
>
> `===` — строга рівність: порівнює без перетворення типів, тож значення різних типів завжди нерівні. `==` — нестрога: якщо типи різні, спершу приводить їх за алгоритмом специфікації (рядок → число, `true` → `1` тощо), тому `'5' == 5` і `0 == ''` дають `true`. На практиці використовують `===`; `==` хіба що для перевірки `x == null` (ловить і `null`, і `undefined`).
>
> 📚 [[JavaScript Start - 03. Оператори та вирази#🎯 Чому === а не ==|Розділ: === чи ==]] · [MDN: Strict equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) · [javascript.info: Comparisons](https://javascript.info/comparison)

## 🔗 Зв'язки

- [[JavaScript Start - 02. Змінні та значення]] — оператори працюють зі значеннями й змінними.
- [[JavaScript Start - 04. Умови]] — результати порівнянь і логічних операторів керують `if`.
- [[JavaScript - 02. Типи та приведення типів]] — що саме робить `==` і `+` з різними типами.

## ⚡ Фішки

> [!reel] 🧮 % — найнедооціненіший оператор
> Парність: `n % 2 === 0`. Остання цифра: `n % 10`. Кожен п'ятий: `i % 5 === 0`. Остача від ділення з'являється в задачах набагато частіше, ніж здається.

> [!reel] 🍕 '5' + 1 = '51'
> Якщо хоч одна сторона `+` — рядок, JavaScript склеює текст. А от `-` завжди рахує числа: `'5' - 1` → `4`.

> [!reel] 🎯 Три знаки рівності — твої друзі
> `===` не перетворює типи і не дає сюрпризів. `==` вважає, що `0`, `''` і `false` — «майже однакові». Пиши `===` завжди.

> [!reel] 🤯 0.1 + 0.2 = 0.30000000000000004
> Це не баг JavaScript, а особливість двійкових дробів (стандарт IEEE 754). Так само рахують Python, Java і C.

> [!reel] 🪞 NaN не дорівнює сам собі
> `NaN === NaN` → `false`. Це єдине таке значення в мові. Перевіряй через `Number.isNaN(x)`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке вираз?
> *часто · теорія* · `jss-03-001`
>
> Шматок коду, який обчислюється в значення: `5`, `price * 2`, `age >= 18`, `name`. Вирази можна класти в змінні, передавати в `console.log` і всередину `${}`.
>
> 📚 [[JavaScript Start - 03. Оператори та вирази#🧒 Простими словами|Розділ: вирази]] · [MDN: Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators)

> [!question]- Що робить оператор `%`?
> *часто · код* · `jss-03-002`
>
> Повертає остачу від ділення: `10 % 3` → `1`. Класичне застосування — перевірка парності: `n % 2 === 0`.
>
> 📚 [[JavaScript Start - 03. Оператори та вирази#🧮 Арифметика|Розділ: арифметика]] · [MDN: Remainder (%)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder)

> [!question]- Що означає `score += 5`?
> *часто · код* · `jss-03-003`
>
> Скорочення від `score = score + 5`: додати 5 до поточного значення. Аналогічно `-=`, `*=`, `/=`; `score++` додає 1.
>
> 📚 [[JavaScript Start - 03. Оператори та вирази#🧮 Арифметика|Розділ: арифметика]] · [javascript.info: Basic operators, maths](https://javascript.info/operators)

> [!question]- Що повертають оператори порівняння?
> *часто · теорія* · `jss-03-004`
>
> Завжди булеве значення — `true` або `false`. Його можна зберегти в змінну з іменем на кшталт `isAdult` чи `hasAccess`.
>
> 📚 [[JavaScript Start - 03. Оператори та вирази#⚖️ Порівняння|Розділ: порівняння]] · [javascript.info: Comparisons](https://javascript.info/comparison)

> [!question]- Чому варто писати `===` замість `==`?
> *дуже часто · порівняння* · `jss-03-005`
>
> `===` не перетворює типи: `'5' === 5` → `false`. `==` перетворює їх за заплутаними правилами (`0 == ''` → `true`), що породжує баги.
>
> 📚 [[JavaScript Start - 03. Оператори та вирази#🎯 Чому === а не ==|Розділ: === чи ==]] · [MDN: Strict equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)

> [!question]- Коли `a && b` дає `true`, а коли `a || b`?
> *дуже часто · теорія* · `jss-03-006`
>
> `a && b` — коли **обидва** `true`. `a || b` — коли **хоча б один** `true`. `!a` перевертає значення.
>
> 📚 [[JavaScript Start - 03. Оператори та вирази#🔌 Логічні оператори|Розділ: логічні оператори]] · [javascript.info: Logical operators](https://javascript.info/logical-operators)

> [!question]- Чому `2 + 3 * 4` дорівнює 14, а не 20?
> *часто · код* · `jss-03-007`
>
> Множення має вищий пріоритет за додавання: спершу `3 * 4 = 12`, потім `2 + 12`. Щоб отримати 20, потрібні дужки: `(2 + 3) * 4`.
>
> 📚 [[JavaScript Start - 03. Оператори та вирази#🧮 Пріоритет: хто рахується першим|Розділ: пріоритет]] · [MDN: Operator precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence)

> [!question]- Як скласти два числа, які прийшли рядками (`'5'` і `'3'`)?
> *часто · практика* · `jss-03-008`
>
> Перетворити рядки на числа: `Number('5') + Number('3')` → `8`. Без цього `+` склеїть рядки в `'53'`.
>
> 📚 [[JavaScript Start - 03. Оператори та вирази#⚠️ Пастки|Розділ: пастки]] · [javascript.info: Type Conversions](https://javascript.info/type-conversions)

### 🟡 Middle

> [!question]- Чому `0.1 + 0.2 !== 0.3`?
> *часто · теорія* · `jss-03-009`
>
> Числа зберігаються у двійковому форматі IEEE 754, а `0.1` і `0.2` у двійковій системі — нескінченні дроби. Округлення дає `0.30000000000000004`. Для грошей рахують у цілих копійках, для порівняння дробів — з допуском.
>
> 📚 [[JavaScript Start - 03. Оператори та вирази#⚠️ Пастки|Розділ: пастки]] · [MDN: Basic math in JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Math)

## 🛠️ Практика

> [!task] Парне чи ні?
> level: junior · difficulty: easy · id: jss-03-task-01 · tags: operators, remainder
>
> Функція `isEven(n)` повертає `true`, якщо `n` парне, і `false` — якщо ні.
>
> ```js starter
> function isEven(n) {
>   // поверни результат порівняння
> }
> ```
>
> ```js tests
> test('4 — парне', () => { expect(isEven(4)).toBe(true) })
> test('7 — непарне', () => { expect(isEven(7)).toBe(false) })
> test('0 — парне', () => { expect(isEven(0)).toBe(true) })
> ```
>
> > [!hint]- Підказка 1
> > Парне число ділиться на 2 без остачі. Який оператор дає остачу?
>
> > [!hint]- Підказка 2
> > Порівняння саме по собі вже є `true` або `false` — його можна одразу повернути: `return ... === 0`.
>
> > [!solution]- Рішення
> > ```js
> > function isEven(n) {
> >   return n % 2 === 0
> > }
> > ```

> [!task] Цельсій → Фаренгейт
> level: junior · difficulty: easy · id: jss-03-task-02 · tags: operators, math
>
> Переведи температуру: `F = C × 9 / 5 + 32`. Функція `toFahrenheit(c)` повертає градуси Фаренгейта.
>
> ```js starter
> function toFahrenheit(c) {
>   return 0
> }
> ```
>
> ```js tests
> test('0°C = 32°F', () => { expect(toFahrenheit(0)).toBe(32) })
> test('100°C = 212°F', () => { expect(toFahrenheit(100)).toBe(212) })
> test('36.6°C ≈ 97.88°F', () => { expect(toFahrenheit(36.6)).toBeCloseTo(97.88) })
> ```
>
> > [!hint]- Підказка 1
> > Множення й ділення виконаються раніше за додавання — дужки тут не обов'язкові.
>
> > [!solution]- Рішення
> > ```js
> > function toFahrenheit(c) {
> >   return c * 9 / 5 + 32
> > }
> > ```
> >
> > `toBeCloseTo` у тесті потрібен через похибку дробових чисел: `36.6 * 9 / 5 + 32` дає не рівно `97.88`.

> [!task] Чи можна голосувати?
> level: junior · difficulty: easy · id: jss-03-task-03 · tags: comparison
>
> `canVote(age)` повертає `true` з 18 років (включно), інакше — `false`.
>
> ```js starter
> function canVote(age) {
>   return false
> }
> ```
>
> ```js tests
> test('17 — ще ні', () => { expect(canVote(17)).toBe(false) })
> test('18 — вже так', () => { expect(canVote(18)).toBe(true) })
> test('40 — так', () => { expect(canVote(40)).toBe(true) })
> ```
>
> > [!hint]- Підказка 1
> > «З 18 включно» — це `>=`, а не `>`.
>
> > [!solution]- Рішення
> > ```js
> > function canVote(age) {
> >   return age >= 18
> > }
> > ```

> [!task] Вхід на концерт
> level: junior · difficulty: medium · id: jss-03-task-04 · tags: logical-operators
>
> `canEnter(age, hasTicket)` пускає на концерт, якщо людині **щонайменше 16** і в неї **є квиток**. Або якщо вона в списку гостей — третій параметр `isGuest` (тоді вік і квиток не важливі).
>
> ```js starter
> function canEnter(age, hasTicket, isGuest) {
>   return false
> }
> ```
>
> ```js tests
> test('дорослий з квитком', () => { expect(canEnter(20, true, false)).toBe(true) })
> test('дорослий без квитка', () => { expect(canEnter(20, false, false)).toBe(false) })
> test('15 років з квитком', () => { expect(canEnter(15, true, false)).toBe(false) })
> test('гість — завжди так', () => { expect(canEnter(12, false, true)).toBe(true) })
> ```
>
> > [!hint]- Підказка 1
> > Спершу запиши першу умову: вік і квиток — обидва потрібні (`&&`).
>
> > [!hint]- Підказка 2
> > Потім «або гість»: `(...) || isGuest`. Дужки роблять задум очевидним.
>
> > [!solution]- Рішення
> > ```js
> > function canEnter(age, hasTicket, isGuest) {
> >   return (age >= 16 && hasTicket) || isGuest
> > }
> > ```
> >
> > `&&` має вищий пріоритет за `||`, тож код працював би і без дужок, але з ними задум читається з першого погляду.

> [!task] Додай числа з рядків
> level: junior · difficulty: medium · id: jss-03-task-05 · tags: types, operators
>
> З форми прийшли два числа, але **рядками**. `sumStrings(a, b)` має повернути їхню суму **числом**: `sumStrings('5', '3')` → `8`.
>
> ```js starter
> function sumStrings(a, b) {
>   return a + b
> }
> ```
>
> ```js tests
> test('5 + 3 = 8', () => { expect(sumStrings('5', '3')).toBe(8) })
> test('10 + 0.5 = 10.5', () => { expect(sumStrings('10', '0.5')).toBe(10.5) })
> test('результат — число', () => { expect(typeof sumStrings('1', '1')).toBe('number') })
> ```
>
> > [!hint]- Підказка 1
> > Запусти заготовку: `'5' + '3'` дає `'53'`. Що треба зробити з кожним рядком перед додаванням?
>
> > [!solution]- Рішення
> > ```js
> > function sumStrings(a, b) {
> >   return Number(a) + Number(b)
> > }
> > ```
> >
> > `Number('5')` перетворює текст на число `5`. Якщо в рядку не число (`'кіт'`), вийде `NaN`.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Basic operators, maths](https://javascript.info/operators) — арифметика, `+=`, `++` і пріоритет.
- 🟢 [javascript.info — Comparisons](https://javascript.info/comparison) — порівняння рядків, `==` проти `===`.
- 🟢 [javascript.info — Logical operators](https://javascript.info/logical-operators) — `&&`, `||`, `!` з прикладами.
- 🟢 [MDN — Basic math in JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Math) — курс MDN для початківців.
- 🟡 [MDN — Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators) — повний огляд операторів.
- 🟡 [MDN — Operator precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence) — таблиця пріоритетів.
- 🟡 [MDN — Strict equality (===)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) — як саме працює `===`.

> [!important] Підсумок
> - Арифметика: `+ - * / % **`; короткі форми `+=`, `-=`, `++`. `%` — остача, ідеальна для парності.
> - Порівняння (`> < >= <= === !==`) завжди дає `true` або `false`.
> - Пиши `===`/`!==`: `==` таємно перетворює типи (`'5' == 5` → `true`).
> - `&&` — обидва, `||` — хоча б один, `!` — навпаки.
> - `*` і `/` раніше за `+` і `-`; сумніваєшся — став дужки. Рядок + число = склеєний рядок.
