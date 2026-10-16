---
title: Змінні та значення
order: 2
level: junior
tags: [javascript, beginner, variables, types]
prerequisites:
  - "[[JavaScript Start - 01. Привіт, код!]]"
estimatedMinutes: 30
id: jss-ch-02
icon: "📦"
---

# Змінні та значення

> [!success] 🎯 Після цього розділу ти зможеш
> - створювати змінні через `let` і `const` і знати, коли яку обрати;
> - давати змінним зрозумілі імена за правилами мови;
> - розрізняти рядки, числа, булеві значення, `null` і `undefined`;
> - перевіряти тип значення через `typeof`;
> - збирати рядки з шаблонних рядків `` `Привіт, ${name}!` ``.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-02-quiz-01
>
> ```js
> let score = 10
> score = score + 5
> const name = 'Оля'
> console.log(name, score)
> ```
>
> **Відповідь:** `Оля 15`
>
> **Пояснення:** `score` спершу дорівнює `10`. Рядок `score = score + 5` читається справа наліво: «візьми поточне значення `score` (10), додай 5 і поклади результат назад у `score`». Тепер там `15`.

## 🧒 Простими словами

Змінна — це **коробка з наліпкою**. На наліпці — ім'я (`score`), усередині — значення (`10`). Коли тобі потрібне значення, ти не пам'ятаєш його напам'ять, а кажеш «дай те, що в коробці `score`».

Коробки бувають двох видів:

- `let` — звичайна коробка: вміст можна вийняти й покласти інший;
- `const` — коробка, яку **заклеїли скотчем** одразу після наповнення: що поклав — те й лишиться.

## 🔬 Як це працює

### 📦 let і const

Створити змінну — значить **оголосити** її (*declaration*) і, зазвичай, одразу **присвоїти** значення знаком `=`.

```js
let lives = 3        // оголосили і поклали 3
lives = 2            // поклали нове значення (без let!)
console.log(lives)   // → 2

const PI = 3.14
console.log(PI)      // → 3.14
```

> [!diagram] let можна перезаписати, const — ні
> ```yaml
> layout: compare
> columns: { let: "let — звичайна коробка", const: "const — заклеєна скотчем" }
> nodes:
>   - { id: letcode, col: let, label: "код", code: "let lives = 3\nlives = 2\nconsole.log(lives)" }
>   - { id: lives, col: let, label: "коробка lives", text: "3", tone: blue, icon: "px:box" }
>   - { id: constcode, col: const, label: "код", code: "const PI = 3.14\nPI = 3" }
>   - { id: pi, col: const, label: "коробка PI", text: "3.14", tone: violet, icon: "px:lock" }
>   - { id: err, col: const, label: "помилка", text: "TypeError: Assignment to constant variable.", tone: red, icon: "px:warning" }
> steps:
>   - { show: lives, line: "letcode:1", note: "let lives = 3 створює коробку з наліпкою lives і кладе в неї 3." }
>   - { set: { lives: "2" }, line: "letcode:2", note: "lives = 2 — без let, бо коробка вже є. Старе 3 викидаємо, кладемо 2: та сама коробка, новий вміст." }
>   - { line: "letcode:3", focus: lives, note: "console.log(lives) зазирає в коробку й друкує те, що там зараз, — 2." }
>   - { show: pi, line: "constcode:1", note: "const PI = 3.14 — коробку наповнили й одразу заклеїли скотчем." }
>   - { show: err, line: "constcode:2", note: "Спроба PI = 3 зупиняє програму помилкою TypeError. У PI так і лишається 3.14." }
>   - { focus: [lives, pi], note: "Звідси правило: пиши const за замовчуванням, а let — лише коли значення справді змінюватиметься." }
> ```

> [!important] Правило вибору
> Пиши `const` за замовчуванням. Перейди на `let`, лише коли значення **справді** буде змінюватися (лічильник, баланс, крок циклу). Так код легше читати: бачиш `const` — знаєш, що значення не зміниться.

Зверни увагу: знак `=` у програмуванні — це не «дорівнює», а **«поклади в»**. Тому `score = score + 5` — не математична нісенітниця, а цілком нормальна команда.

У старому коді ти побачиш ще й `var`. Не використовуй його: він має дивні правила видимості. Чому — в [[JavaScript - 04. Scope, hoisting і TDZ]], коли дійдеш до глибокого курсу.

> [!quiz] Перевір себе: що станеться з цим кодом?
> level: junior · id: jss-02-quiz-02
>
> ```js
> const coins = 5
> coins = 6
> ```
>
> - [ ] `coins` стане 6
> - [ ] `coins` залишиться 5 без жодних повідомлень
> - [x] Буде помилка `TypeError`: змінну `const` не можна перепризначити
> - [ ] Буде `SyntaxError`, бо 6 більше за 5
>
> **Пояснення:** `const` забороняє класти в коробку нове значення. Рушій кидає `TypeError: Assignment to constant variable.`

> [!quiz] Заповни пропуски: лічильник змінюється, ім'я — ні
> level: junior · type: fill · id: jss-02-quiz-03
>
> ```js fill
> [[let]] clicks = 0
> clicks = clicks + 1
> [[const|let]] userName = 'Оля'
> ```
>
> **Пояснення:** `clicks` змінюється — потрібен `let`. `userName` не змінюється — краще `const` (хоча `let` теж запрацює).

> [!quiz] Склади код: спершу зняли 30 гривень, потім поклали 50
> level: junior · type: order · id: jss-02-quiz-04
>
> ```js order
> let balance = 100
> balance = balance - 30
> balance = balance + 50
> console.log(balance)
> ```
>
> **Пояснення:** спершу змінну оголошують (`let`), потім змінюють — уже без `let`, — і лише наприкінці друкують. Результат: `120`.

### 🏷️ Як називати змінні

Правила мови (порушиш — буде `SyntaxError`):

- ім'я складається з літер, цифр, `$` і `_`;
- **не** починається з цифри: `2players` ❌, `players2` ✅;
- не може бути зарезервованим словом: `let`, `const`, `return`, `if`…;
- регістр має значення: `userName` і `username` — різні змінні.

Правила здорового глузду (порушиш — будуть страждати люди):

| Погано | Добре | Чому |
|---|---|---|
| `x`, `a1`, `data` | `price`, `userAge`, `todoList` | ім'я пояснює, **що** всередині |
| `username_first` | `firstName` | у JS прийнято *camelCase*: кожне нове слово з великої |
| `ціна` | `price` | кирилиця технічно працює, але в командах пишуть англійською |

Для «справжніх» констант, відомих ще до запуску програми, часто використовують ВЕЛИКІ_ЛІТЕРИ: `const MAX_LIVES = 3`.

> [!quiz] Перевір себе: які імена змінних дозволені? Обери все правильне
> level: junior · type: multi · id: jss-02-quiz-05
> - [x] `userName`
> - [ ] `2fast`
> - [x] `_count`
> - [ ] `let`
> - [x] `$price`
> - [ ] `first-name`
>
> **Пояснення:** не можна починати з цифри (`2fast`), використовувати зарезервовані слова (`let`) і дефіс (`first-name` рушій прочитає як «`first` мінус `name`»).

### 🧪 Типи значень

Кожне значення має **тип** — «що це за річ». Для старту потрібні п'ять:

| Тип | Приклади | Простими словами |
|---|---|---|
| `string` (рядок) | `'Привіт'`, `"42"`, `` `так` `` | текст, завжди в лапках |
| `number` (число) | `42`, `-7`, `3.14` | цілі й дробові числа — один тип на всіх |
| `boolean` (булеве) | `true`, `false` | так / ні, увімкнено / вимкнено |
| `undefined` | `undefined` | «значення ще не поклали» — порожня коробка |
| `null` | `null` | «тут навмисно нічого» — коробка з запискою «порожньо» |

```js
let answer
console.log(answer)  // → undefined — оголосили, але нічого не поклали

let winner = null    // переможця ще немає, і ми кажемо це явно
console.log(winner)  // → null
```

Різниця між `undefined` і `null` — у **намірі**. `undefined` зазвичай ставить сама мова («тут ще нічого не було»), а `null` ставиш ти («я знаю, що тут порожньо»).

Є ще `bigint`, `symbol` і `object` (обʼєкти й масиви — про них у розділах 7–8). Повна картина — у [[JavaScript - 02. Типи та приведення типів]].

> [!pitfall] `'42'` і `42` — різні речі
> У лапках — текст, без лапок — число. З текстом математика працює «по-текстовому»:
>
> ```js
> console.log('4' + 2) // → 42 — склеїли рядки
> console.log(4 + 2)   // → 6 — додали числа
> ```

> [!quiz] Перевір себе: яке значення найкраще описує «користувач ще не обрав місто — і ми це знаємо»?
> level: junior · id: jss-02-quiz-06
> - [ ] `'нічого'`
> - [ ] `0`
> - [x] `null`
> - [ ] `false`
>
> **Пояснення:** `null` — явне «тут навмисно порожньо». `0` — це число, `false` — відповідь «ні», `'нічого'` — текст із восьми літер.

### 🔍 typeof — дізнайся тип

Оператор `typeof` повертає назву типу у вигляді рядка:

```js
console.log(typeof 'Київ')     // → string
console.log(typeof 2024)       // → number
console.log(typeof true)       // → boolean
console.log(typeof undefined)  // → undefined
console.log(typeof null)       // → object — історичний баг, запам'ятай!
```

`typeof null === 'object'` — помилка першої версії мови 1995 року, яку вже не можна виправити, бо зламається пів інтернету. Перевіряй `null` напряму: `value === null`.

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-02-quiz-07
>
> ```js
> const age = '18'
> console.log(typeof age)
> ```
>
> **Відповідь:** `string`
>
> **Пояснення:** `'18'` у лапках — це рядок, хоч і схожий на число. `typeof` дивиться на тип значення, а не на те, як воно виглядає.

> [!quiz] Заповни пропуски: що поверне typeof?
> level: junior · type: fill · id: jss-02-quiz-08
>
> ```js fill
> typeof 3.14      // → '[[number]]'
> typeof 'так'     // → '[[string]]'
> typeof false     // → '[[boolean]]'
> ```

### 🧵 Шаблонні рядки

Склеювати текст і змінні можна плюсом, але це незручно — легко загубити пробіл:

```js
const name = 'Оля'
const age = 20
console.log('Мене звати ' + name + ', мені ' + age) // → Мене звати Оля, мені 20
```

**Шаблонний рядок** (*template literal*) — текст у зворотних лапках `` ` `` (клавіша під `Esc`), де `${...}` вставляє значення:

```js
const name = 'Оля'
const age = 20
console.log(`Мене звати ${name}, мені ${age}`) // → Мене звати Оля, мені 20
console.log(`Через рік мені буде ${age + 1}`)  // → Через рік мені буде 21
```

Усередині `${}` може бути будь-який **вираз**: змінна, `age + 1`, навіть виклик функції. А ще шаблонні рядки можуть займати кілька рядків.

> [!quiz] Склади код, який виведе «Привіт, Тарас!»
> level: junior · type: order · id: jss-02-quiz-09
>
> ```js order
> const firstName = 'Тарас'
> const greeting = `Привіт, ${firstName}!`
> const greeting = 'Привіт, ${firstName}!' // ✗
> console.log(greeting)
> ```
>
> **Пояснення:** `${...}` працює лише у зворотних лапках. У звичайних `'...'` це просто символи долара й дужок — надрукується буквально `Привіт, ${firstName}!`.

## ⚠️ Пастки

> [!pitfall] `let` двічі для однієї змінної
> `let` потрібен лише при **створенні**. Для зміни значення пиши просто ім'я.
>
> ```text
> let count = 1
> let count = 2   ❌ SyntaxError: Identifier 'count' has already been declared
> count = 2       ✅
> ```

> [!pitfall] Використання змінної до оголошення
> Змінна з `let`/`const` існує лише **після** свого рядка. Спроба прочитати її раніше — `ReferenceError`.
>
> ```text
> console.log(total)  ❌ ReferenceError: Cannot access 'total' before initialization
> let total = 100
> ```
>
> Для допитливих — як це виглядає зсередини (назва цієї зони — TDZ):

> [!viz] hoisting
> scenario: tdz
>
> Змінна вже «зареєстрована», але до свого рядка з неї не можна читати. Детально — у [[JavaScript - 04. Scope, hoisting і TDZ]].

## 🎤 На співбесіді

> [!interview] Чим відрізняються `let`, `const` і `var`?
> level: junior · frequency: дуже часто · id: jss-02-int-01
>
> ---
>
> `const` не можна перепризначити після оголошення, `let` — можна. Обидва мають блокову видимість (живуть усередині `{ }`) і недоступні до рядка оголошення. `var` — старий спосіб: видимість на рівні функції і «підняття» з `undefined`, що породжує баги. Практика: `const` за замовчуванням, `let` — коли значення змінюється, `var` — не використовувати.
>
> 📚 [[JavaScript Start - 02. Змінні та значення#📦 let і const|Розділ: let і const]] · [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) · [javascript.info: Variables](https://javascript.info/variables)

## 🔗 Зв'язки

- [[JavaScript Start - 01. Привіт, код!]] — `console.log` допомагає подивитися, що лежить у змінній.
- [[JavaScript Start - 03. Оператори та вирази]] — що можна робити зі значеннями: рахувати, порівнювати, поєднувати.
- [[JavaScript - 02. Типи та приведення типів]] — усі вісім типів і як JS перетворює один на інший.
- [[JavaScript - 04. Scope, hoisting і TDZ]] — чому `var` небезпечний і що таке TDZ.

## ⚡ Фішки

> [!reel] 📦 const — це «заклеєна коробка»
> Значення в `const` не можна замінити. Пиши `const` за замовчуванням — і кожен `let` у коді стане сигналом «увага, ця штука змінюється».

> [!reel] 🧩 typeof null — баг віком 30 років
> У першій реалізації JS тег типу обʼєкта був `000`, і `null` випадково отримав такий самий. Виправити вже не можна — зламається веб.
>
> ```js
> typeof null // → "object"
> ```

> [!reel] 🔢 У JS один тип на всі числа
> `42`, `-7` і `3.14` — усі мають тип `number`. Ніяких окремих int і float, як в інших мовах.

> [!reel] 🧵 Зворотні лапки — суперсила
> `` `2 + 2 = ${2 + 2}` `` → `2 + 2 = 4`. Усередині `${}` — будь-який вираз. Плюси для склеювання рядків більше не потрібні.

> [!reel] 🕳️ undefined vs null
> `undefined` — коробку створили, але нічого не поклали. `null` — ти свідомо поклав записку «порожньо». Різниця не в значенні, а в намірі.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке змінна?
> *дуже часто · теорія* · `jss-02-001`
>
> Іменоване «місце» для значення — коробка з наліпкою. Ім'я дозволяє отримати значення пізніше, а для `let` — ще й замінити його.
>
> 📚 [[JavaScript Start - 02. Змінні та значення#🧒 Простими словами|Розділ: змінні]] · [javascript.info: Variables](https://javascript.info/variables)

> [!question]- Коли використовувати `const`, а коли `let`?
> *дуже часто · практика* · `jss-02-002`
>
> `const` — за замовчуванням, коли значення не буде перепризначатися. `let` — коли воно змінюватиметься (лічильник, баланс, крок). Перепризначення `const` → `TypeError`.
>
> 📚 [[JavaScript Start - 02. Змінні та значення#📦 let і const|Розділ: let і const]] · [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)

> [!question]- Які правила для імен змінних?
> *часто · теорія* · `jss-02-003`
>
> Літери, цифри, `$`, `_`; не починати з цифри; не використовувати зарезервовані слова; регістр важливий. Плюс домовленість: *camelCase* і змістовні імена (`userAge`, а не `x`).
>
> 📚 [[JavaScript Start - 02. Змінні та значення#🏷️ Як називати змінні|Розділ: імена]] · [MDN: Storing the information you need — Variables](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Variables)

> [!question]- Назви п'ять базових типів значень для старту
> *часто · теорія* · `jss-02-004`
>
> `string` (текст), `number` (число), `boolean` (`true`/`false`), `undefined` (значення ще не задано), `null` (навмисно порожньо). Плюс `bigint`, `symbol` і `object`.
>
> 📚 [[JavaScript Start - 02. Змінні та значення#🧪 Типи значень|Розділ: типи]] · [javascript.info: Data types](https://javascript.info/types)

> [!question]- Чим `null` відрізняється від `undefined`?
> *дуже часто · порівняння* · `jss-02-005`
>
> `undefined` — значення ще не присвоєно (так каже сама мова). `null` — програміст явно сказав «тут нічого немає». Обидва означають «порожньо», але з різним наміром.
>
> 📚 [[JavaScript Start - 02. Змінні та значення#🧪 Типи значень|Розділ: типи]] · [javascript.info: Data types](https://javascript.info/types)

> [!question]- Що повертає `typeof null` і чому?
> *часто · код* · `jss-02-006`
>
> `'object'` — історичний баг першої версії JavaScript, який не виправляють заради сумісності. Для перевірки на `null` пиши `value === null`.
>
> 📚 [[JavaScript Start - 02. Змінні та значення#🔍 typeof — дізнайся тип|Розділ: typeof]] · [MDN: typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)

> [!question]- Як вставити змінну в рядок?
> *дуже часто · код* · `jss-02-007`
>
> Шаблонним рядком у зворотних лапках: `` `Привіт, ${name}!` ``. Усередині `${}` — будь-який вираз.
>
> 📚 [[JavaScript Start - 02. Змінні та значення#🧵 Шаблонні рядки|Розділ: шаблонні рядки]] · [MDN: Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

> [!question]- Що означає `x = x + 1`?
> *часто · код* · `jss-02-008`
>
> «Візьми поточне значення `x`, додай 1 і поклади результат назад у `x`». Знак `=` — це присвоєння («поклади в»), а не математична рівність.
>
> 📚 [[JavaScript Start - 02. Змінні та значення#📦 let і const|Розділ: let і const]] · [javascript.info: Variables](https://javascript.info/variables)

## 🛠️ Практика

> [!task] Створи свої перші змінні
> level: junior · difficulty: easy · id: jss-02-task-01 · tags: variables
>
> Оголоси три змінні:
> - `city` — рядок `'Київ'` (не змінюватиметься);
> - `age` — число `20` (з часом зміниться);
> - `isStudent` — булеве значення `true`.
>
> ```js starter
> // оголоси змінні тут
> ```
>
> ```js tests
> test('city — рядок Київ', () => { expect(city).toBe('Київ') })
> test('age — число 20', () => { expect(age).toBe(20) })
> test('isStudent — true', () => { expect(isStudent).toBe(true) })
> ```
>
> > [!hint]- Підказка 1
> > Формат: `ключове_слово імʼя = значення`. Наприклад, `const color = 'синій'`.
>
> > [!hint]- Підказка 2
> > `true` пишеться без лапок — інакше це буде рядок `'true'`.
>
> > [!solution]- Рішення
> > ```js
> > const city = 'Київ'
> > let age = 20
> > const isStudent = true
> > ```
> >
> > `city` не змінюється — `const`. `age` з часом зміниться — `let`. Числа і `true` пишемо без лапок.

> [!task] Виправ коробку
> level: junior · difficulty: easy · id: jss-02-task-02 · tags: variables, errors
>
> Гравець втратив одне життя, але код падає з `TypeError`. Виправ **одне слово**, щоб наприкінці `lives` дорівнювало `2`.
>
> ```js starter
> const lives = 3
> lives = lives - 1
> ```
>
> ```js tests
> test('лишилося 2 життя', () => { expect(lives).toBe(2) })
> ```
>
> > [!hint]- Підказка 1
> > Прочитай помилку: `Assignment to constant variable`. Яка змінна тут «константа»?
>
> > [!solution]- Рішення
> > ```js
> > let lives = 3
> > lives = lives - 1
> > ```
> >
> > Значення змінюється — отже, потрібен `let`.

> [!task] Представся шаблонним рядком
> level: junior · difficulty: easy · id: jss-02-task-03 · tags: strings, template-literals
>
> Створи змінну `intro` з текстом `'Мене звати Оля, мені 20 років'`, але **не пиши імʼя і вік вручну** — підстав їх зі змінних `name` і `age` через `${}`.
>
> ```js starter
> const name = 'Оля'
> const age = 20
> const intro = '' // збери рядок тут
> ```
>
> ```js tests
> test('текст правильний', () => { expect(intro).toBe('Мене звати Оля, мені 20 років') })
> test('містить імʼя', () => { expect(intro).toContain(name) })
> ```
>
> > [!hint]- Підказка 1
> > Заміни звичайні лапки `''` на зворотні `` ` ` ``.
>
> > [!hint]- Підказка 2
> > Каркас: `` `Мене звати ${...}, мені ${...} років` ``.
>
> > [!solution]- Рішення
> > ```js
> > const name = 'Оля'
> > const age = 20
> > const intro = `Мене звати ${name}, мені ${age} років`
> > ```

> [!task] Детектор типів
> level: junior · difficulty: easy · id: jss-02-task-04 · tags: typeof
>
> Функція `typeName(value)` отримує будь-яке значення в дужках і має повернути назву його типу (`'number'`, `'string'`…). `value` — це «коробка», в яку тест кладе значення.
>
> ```js starter
> function typeName(value) {
>   return '' // використай typeof
> }
> ```
>
> ```js tests
> test('число', () => { expect(typeName(42)).toBe('number') })
> test('рядок', () => { expect(typeName('42')).toBe('string') })
> test('булеве', () => { expect(typeName(false)).toBe('boolean') })
> test('undefined', () => { expect(typeName(undefined)).toBe('undefined') })
> ```
>
> > [!hint]- Підказка 1
> > `typeof щось` уже повертає рядок із назвою типу.
>
> > [!solution]- Рішення
> > ```js
> > function typeName(value) {
> >   return typeof value
> > }
> > ```

> [!task] Привітання для будь-кого
> level: junior · difficulty: medium · id: jss-02-task-05 · tags: strings, template-literals
>
> Функція `greet(name)` має повертати `'Привіт, <імʼя>!'` для будь-якого переданого імені. Наприклад, `greet('Оля')` → `'Привіт, Оля!'`.
>
> ```js starter
> function greet(name) {
>   return 'Привіт!'
> }
> ```
>
> ```js tests
> test('Оля', () => { expect(greet('Оля')).toBe('Привіт, Оля!') })
> test('Тарас', () => { expect(greet('Тарас')).toBe('Привіт, Тарас!') })
> test('будь-яке імʼя', () => { expect(greet('Ада')).toBe('Привіт, Ада!') })
> ```
>
> > [!hint]- Підказка 1
> > Імʼя щоразу різне — тож його не можна вписати в текст вручну. Воно лежить у `name`.
>
> > [!hint]- Підказка 2
> > `` return `Привіт, ${name}!` ``
>
> > [!solution]- Рішення
> > ```js
> > function greet(name) {
> >   return `Привіт, ${name}!`
> > }
> > ```
> >
> > Шаблонний рядок підставляє те, що зараз лежить у `name`, — тому функція працює для будь-якого імені.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Variables](https://javascript.info/variables) — `let`, `const`, правила імен і хороші звички.
- 🟢 [javascript.info — Data types](https://javascript.info/types) — усі типи з прикладами і `typeof`.
- 🟢 [MDN — Storing the information you need — Variables](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Variables) — курс MDN для початківців.
- 🟢 [MDN — Handling text — strings in JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Strings) — рядки, лапки й шаблонні рядки.
- 🟡 [MDN — Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) — довідник з усіма можливостями.
- 🟡 [MDN — typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) — таблиця результатів, включно з дивацтвами.
- 🟡 [MDN — Grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types) — оголошення, типи й літерали в одному місці.

> [!important] Підсумок
> - Змінна — коробка з наліпкою: ім'я + значення. `=` означає «поклади в».
> - `const` — за замовчуванням, `let` — коли значення змінюється, `var` — не використовуємо.
> - Імена: літери/цифри/`$`/`_`, не з цифри, *camelCase*, змістовні.
> - Базові типи: `string`, `number`, `boolean`, `undefined`, `null`; `typeof` повертає назву типу (і `'object'` для `null`).
> - Шаблонні рядки `` `...${вираз}...` `` вставляють значення в текст.
