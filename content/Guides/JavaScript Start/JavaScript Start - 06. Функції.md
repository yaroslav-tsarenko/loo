---
title: Функції
order: 6
level: junior
tags: [javascript, beginner, functions]
prerequisites:
  - "[[JavaScript Start - 05. Цикли]]"
estimatedMinutes: 35
id: jss-ch-06
icon: "🍳"
---

# Функції

> [!success] 🎯 Після цього розділу ти зможеш
> - оголосити функцію і викликати її скільки завгодно разів;
> - передавати дані через параметри й задавати значення за замовчуванням;
> - повертати результат через `return` і розуміти, чим він відрізняється від `console.log`;
> - записувати короткі функції стрілками `(a, b) => a + b`;
> - пояснити, чому змінні всередині функції не видно ззовні.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-06-quiz-01
>
> ```js
> function double(x) {
>   return x * 2
> }
> console.log(double(5))
> console.log(double(double(2)))
> ```
>
> **Відповідь:** `10 8`
>
> **Пояснення:** `double(5)` повертає `10`. У другому рядку спершу обчислюється внутрішній виклик `double(2)` → `4`, потім зовнішній `double(4)` → `8`. Результат однієї функції можна одразу передати в іншу.

## 🧒 Простими словами

Функція — це **рецепт**. У нього є:

- **назва** — «Млинці»;
- **інгредієнти** — параметри: борошно, молоко, яйця;
- **кроки** — тіло функції;
- **страва** — те, що рецепт повертає (`return`).

Записати рецепт у зошит (оголосити функцію) ≠ приготувати страву. Готуєш, коли **викликаєш** рецепт: «зроби млинці з цього молока». І один рецепт можна використати сто разів з різними продуктами — замість переписувати кроки щоразу.

> [!diagram] Функція: аргумент → обробка → результат
> ```yaml
> layout: flow
> nodes:
>   - { id: arg, label: аргумент, text: "5", tone: blue, icon: "px:box" }
>   - { id: fn, label: функція, code: "function double(x) {\n  return x * 2\n}" }
>   - { id: out, label: результат, text: "?", tone: green }
> edges:
>   - { from: arg, to: fn, label: "double(5)" }
>   - { from: fn, to: out, label: return }
> steps:
>   - { focus: arg, note: "Викликаємо double(5): число 5 — це аргумент, «продукт» для рецепта." }
>   - { move: { from: arg, to: fn, value: "x = 5" }, line: "fn:1", note: "5 потрапляє всередину функції й стає параметром x." }
>   - { line: "fn:2", note: "Виконуються кроки рецепта: x * 2 → 5 * 2 = 10." }
>   - { move: { from: fn, to: out, value: "10" }, set: { out: "10" }, line: "fn:2", note: "return віддає 10 назовні — це і є результат виклику." }
>   - { focus: [arg, fn, out], note: "Один рецепт — будь-які продукти: double(7) поверне 14, double(100) — 200." }
> ```

## 🔬 Як це працює

### 🍳 Оголошення і виклик

```js
function sayHi() {              // оголошення: записали рецепт
  console.log('Привіт!')
}

sayHi()                         // виклик: приготували → Привіт!
sayHi()                         // і ще раз → Привіт!
```

- `function` — ключове слово «зараз буде функція»;
- `sayHi` — ім'я (дієслово: `calculate`, `getUser`, `isValid`);
- `()` — місце для параметрів (тут порожньо);
- `{ … }` — тіло: що робити.

**Виклик** — ім'я плюс круглі дужки: `sayHi()`. Без дужок функція не виконується — ти просто згадуєш її ім'я.

> [!quiz] Перевір себе: що надрукує цей код?
> level: junior · id: jss-06-quiz-02
>
> ```js
> function cheer() {
>   console.log('Ура!')
> }
> ```
>
> - [ ] `Ура!`
> - [x] Нічого
> - [ ] `undefined`
> - [ ] Помилку
>
> **Пояснення:** функцію лише **оголосили**, але не викликали. Рецепт записано, а готувати ніхто не почав. Щоб побачити «Ура!», потрібно `cheer()`.

### 🥕 Параметри й аргументи

**Параметри** — імена-«заглушки» в оголошенні. **Аргументи** — конкретні значення під час виклику.

```js
function greet(name, emoji) {        // name, emoji — параметри
  console.log(`${emoji} Привіт, ${name}!`)
}
greet('Оля', '👋')   // 'Оля', '👋' — аргументи → 👋 Привіт, Оля!
greet('Тарас', '🎉') // → 🎉 Привіт, Тарас!
```

Аргументи потрапляють у параметри **за порядком**: перший — у перший, другий — у другий. Не передав аргумент — параметр стане `undefined`. Щоб цього уникнути, задай **значення за замовчуванням**:

```js
function greet(name = 'друже') {
  return `Привіт, ${name}!`
}
console.log(greet('Ада')) // → Привіт, Ада!
console.log(greet())      // → Привіт, друже!
```

> [!quiz] Заповни пропуски: функція з параметром за замовчуванням
> level: junior · type: fill · id: jss-06-quiz-03
>
> ```js fill
> [[function]] power(base, exp [[=]] 2) {
>   return base ** exp
> }
> console.log(power(3))
> ```
>
> **Пояснення:** `exp = 2` — значення за замовчуванням: `power(3)` поверне `3 ** 2 = 9`.

### 🎁 return — що функція віддає

`return` робить дві речі: **повертає значення** туди, звідки функцію викликали, і **одразу завершує** функцію.

```js
function add(a, b) {
  return a + b
  console.log('цей рядок не виконається ніколи')
}
const sum = add(2, 3)  // add(2, 3) «перетворюється» на 5
console.log(sum * 10)  // → 50
```

Функція без `return` повертає `undefined`.

> [!warning] `console.log` — це не `return`
> `console.log` лише **показує** значення людині в консолі. `return` **віддає** значення програмі, щоб з ним можна було працювати далі: зберегти в змінну, додати, передати в іншу функцію. Тести в задачах перевіряють саме те, що функція **повертає**.

```js
function showDouble(x) {
  console.log(x * 2) // показали, але не повернули
}
const result = showDouble(5) // надрукує 10
console.log(result)          // → undefined
```

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-06-quiz-04
>
> ```js
> function check(n) {
>   if (n > 0) {
>     return 'плюс'
>   }
>   return 'не плюс'
> }
> console.log(check(3))
> console.log(check(-1))
> ```
>
> **Відповідь:** `плюс` `не плюс`
>
> **Пояснення:** для `3` спрацьовує перший `return`, і функція одразу завершується — до другого справа не доходить. Для `-1` умова хибна, тож виконується другий `return`.

> [!quiz] Склади функцію, яка повертає більше з двох чисел
> level: junior · type: order · id: jss-06-quiz-05
>
> ```js order
> function bigger(a, b) {
>
>   if (a > b) {
>     return a
>   }
>
>   return b
> }
>
> console.log(bigger(3, 7))
> ```
>
> **Пояснення:** спершу перевіряємо, чи `a` більше, і якщо так — повертаємо його. Інакше функція доходить до `return b`. Виклик — після оголошення. Виведе `7`.

### ➡️ Стрілкові функції

Сучасний короткий запис — **стрілкова функція** (*arrow function*). Її кладуть у змінну:

```js
const add = (a, b) => a + b        // короткий запис: return «вбудований»
const square = (x) => x * x
const sayHi = () => console.log('Привіт!')

console.log(add(2, 3))  // → 5
console.log(square(4))  // → 16
```

Якщо тіло в `{ }`, `return` потрібно писати явно:

```js
const sign = (n) => {
  if (n >= 0) return 'плюс'
  return 'мінус'
}
console.log(sign(-5)) // → мінус
```

Звичайна чи стрілкова? Для старту — що подобається. Є тонкі відмінності (наприклад, `this`), про них — у [[JavaScript - 06. this]] глибокого курсу.

> [!quiz] Заповни пропуски: стрілкова функція, що обчислює периметр квадрата
> level: junior · type: fill · id: jss-06-quiz-06
>
> ```js fill
> const perimeter = (side) [[=>]] side * 4
> console.log(perimeter(5))
> ```

> [!quiz] Перевір себе: що поверне `f(2)`?
> level: junior · id: jss-06-quiz-07
>
> ```js
> const f = (x) => { x * 10 }
> ```
>
> - [ ] `20`
> - [x] `undefined`
> - [ ] `'x * 10'`
> - [ ] Помилку
>
> **Пояснення:** фігурні дужки роблять тіло «повним», а в ньому немає `return`. Вираз обчислюється і викидається. Треба або `(x) => x * 10`, або `(x) => { return x * 10 }`.

### 📚 Функція викликає функцію

Функції можна складати, як Лего: одна викликає іншу. Рушій пам'ятає, хто кого викликав, у **стеку викликів** (*call stack*) — стопці тарілок: новий виклик кладеться зверху, а коли функція повертає результат, її тарілку знімають.

```js
const square = (x) => x * x
const sumOfSquares = (a, b) => square(a) + square(b)
console.log(sumOfSquares(3, 4)) // → 25
```

> [!viz] call-stack
> scenario: nested-calls
>
> Натискай ▶ і дивись, як виклики кладуться на стек і знімаються з нього.

> [!quiz] Склади код: кожна функція оголошена до того, як її використали
> level: junior · type: order · id: jss-06-quiz-09
>
> ```js order
> const square = (x) => x * x
> const sumOfSquares = (a, b) => square(a) + square(b)
> const result = sumOfSquares(1, 2)
> console.log(result)
> ```
>
> **Пояснення:** стрілкові функції в `const` можна викликати лише після рядка, де їх створено. Тому спершу `square`, потім `sumOfSquares`, потім виклик і друк: `1 + 4 = 5`.

### 🔭 Що бачить функція

Змінні, оголошені **всередині** функції, живуть лише там. Ззовні їх не видно — як інгредієнти, що лишилися на кухні.

```js
function makeTea() {
  const water = 'окріп'
  return `чай на ${water}`
}
console.log(makeTea()) // → чай на окріп
// console.log(water)  ❌ ReferenceError: water is not defined
```

А от функція бачить змінні **зовні** себе. Якщо всередині є змінна з тим самим ім'ям, вона «затуляє» зовнішню (*shadowing*):

```js
const name = 'Глобальна'
function show() {
  const name = 'Локальна'
  return name
}
console.log(show()) // → Локальна
console.log(name)   // → Глобальна
```

> [!viz] scope-chain
> scenario: shadowing
>
> Пошук імені йде зсередини назовні й зупиняється на першому збігу.

> [!quiz] Перевір себе: оберіть правдиві твердження. Обери все правильне
> level: junior · type: multi · id: jss-06-quiz-08
> - [x] Змінна, створена всередині функції, не видна ззовні
> - [x] Функція може читати змінні, оголошені поза нею
> - [ ] Параметри функції видно в усій програмі
> - [x] Внутрішня змінна з тим самим ім'ям затуляє зовнішню
>
> **Пояснення:** параметри — теж внутрішні змінні функції, тож ззовні їх не видно. Детально про області видимості — у [[JavaScript - 04. Scope, hoisting і TDZ]].

## ⚠️ Пастки

> [!pitfall] Забуті дужки при виклику
> `console.log(sayHi)` надрукує саму функцію (у Node.js — `[Function: sayHi]`, у браузері — її код), а не виконає її. Виклик — це завжди `sayHi()`.

> [!pitfall] `console.log` замість `return`
> Функція «працює» — у консолі видно правильне число, — а тест падає з `undefined`. Перевір: ти **повертаєш** значення чи лише **друкуєш**?

> [!pitfall] Стрілка з `{ }` без `return`
> `(x) => { x * 2 }` повертає `undefined`. Або прибери фігурні дужки, або додай `return`.

> [!pitfall] Код після `return`
> Рядки після `return` у тому ж блоці ніколи не виконаються. Якщо щось «не працює», перевір, чи не вийшла функція раніше.

## 🎤 На співбесіді

> [!interview] Що таке функція і навіщо вона потрібна?
> level: junior · frequency: часто · id: jss-06-int-01
>
> ---
>
> Функція — іменований блок коду, який приймає вхідні дані (параметри), виконує дії й повертає результат через `return`. Вона дозволяє не повторювати код (DRY), дати ім'я шматку логіки, тестувати його окремо й складати складні програми з простих частин. У JS функції — звичайні значення: їх можна класти в змінні, передавати аргументами й повертати з інших функцій. Є оголошення (`function f() {}`), функціональні вирази й стрілкові функції (`const f = () => {}`).
>
> 📚 [[JavaScript Start - 06. Функції#🔬 Як це працює|Розділ: функції]] · [MDN: Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) · [javascript.info: Functions](https://javascript.info/function-basics)

## 🔗 Зв'язки

- [[JavaScript Start - 05. Цикли]] — функція + цикл = обробка будь-якої кількості даних.
- [[JavaScript Start - 07. Масиви]] — `map` і `filter` приймають функції як аргументи.
- [[JavaScript - 01. Як JS виконує код]] — стек викликів зсередини.
- [[JavaScript - 15. Функції глибоко]] — усе про функції: від `arguments` до каррінгу.

## ⚡ Фішки

> [!reel] 🍳 Оголосити ≠ викликати
> `function bake() {}` — записав рецепт. `bake()` — приготував. Без круглих дужок функція не виконається ніколи.

> [!reel] 🎁 return віддає, console.log показує
> `console.log` — для людини. `return` — для програми. Хочеш використати результат далі — повертай його.

> [!reel] ➡️ Стрілка з неявним return
> `const add = (a, b) => a + b` — жодного слова `return`, але повертає суму. Працює лише без фігурних дужок.

> [!reel] 🏷️ Ім'я функції — це дієслово
> `getPrice`, `isValid`, `sendEmail`, `formatDate`. Читаєш виклик — і одразу розумієш, що відбувається.

> [!reel] 🧱 DRY — Don't Repeat Yourself
> Скопіював той самий код утретє? Час зробити з нього функцію. Виправиш баг в одному місці — і він зникне всюди.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чим оголошення функції відрізняється від виклику?
> *дуже часто · теорія* · `jss-06-001`
>
> Оголошення (`function f() { … }`) лише записує «рецепт». Виклик (`f()`) виконує тіло функції. Одну функцію можна викликати скільки завгодно разів.
>
> 📚 [[JavaScript Start - 06. Функції#🍳 Оголошення і виклик|Розділ: оголошення і виклик]] · [javascript.info: Functions](https://javascript.info/function-basics)

> [!question]- Що таке параметр і що таке аргумент?
> *часто · теорія* · `jss-06-002`
>
> Параметр — ім'я в оголошенні функції (`function f(x)`). Аргумент — конкретне значення під час виклику (`f(5)`). Аргументи потрапляють у параметри за порядком.
>
> 📚 [[JavaScript Start - 06. Функції#🥕 Параметри й аргументи|Розділ: параметри]] · [MDN: Functions — reusable blocks of code](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Functions)

> [!question]- Що буде з параметром, якщо не передати аргумент?
> *часто · код* · `jss-06-003`
>
> Він стане `undefined`. Щоб цього уникнути, задають значення за замовчуванням: `function greet(name = 'друже')`.
>
> 📚 [[JavaScript Start - 06. Функції#🥕 Параметри й аргументи|Розділ: параметри]] · [javascript.info: Functions](https://javascript.info/function-basics)

> [!question]- Що робить `return`?
> *дуже часто · теорія* · `jss-06-004`
>
> Повертає значення в місце виклику і одразу завершує функцію. Без `return` функція повертає `undefined`.
>
> 📚 [[JavaScript Start - 06. Функції#🎁 return — що функція віддає|Розділ: return]] · [MDN: return](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return)

> [!question]- Чим `return` відрізняється від `console.log`?
> *дуже часто · порівняння* · `jss-06-005`
>
> `console.log` друкує значення в консоль для людини і нічого не повертає. `return` віддає значення програмі — його можна зберегти, передати далі, перевірити тестом.
>
> 📚 [[JavaScript Start - 06. Функції#🎁 return — що функція віддає|Розділ: return]] · [MDN: Function return values](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Return_values)

> [!question]- Як записати стрілкову функцію, що додає два числа?
> *часто · код* · `jss-06-006`
>
> `const add = (a, b) => a + b`. Без фігурних дужок результат виразу повертається автоматично; з дужками потрібен явний `return`.
>
> 📚 [[JavaScript Start - 06. Функції#➡️ Стрілкові функції|Розділ: стрілкові функції]] · [javascript.info: Arrow functions, the basics](https://javascript.info/arrow-functions-basics)

> [!question]- Чи видно змінну, оголошену всередині функції, ззовні?
> *часто · теорія* · `jss-06-007`
>
> Ні: вона існує лише всередині функції (локальна область видимості). Спроба прочитати її ззовні дасть `ReferenceError`. А от функція бачить зовнішні змінні.
>
> 📚 [[JavaScript Start - 06. Функції#🔭 Що бачить функція|Розділ: видимість]] · [MDN: Functions — scope](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

> [!question]- Що таке стек викликів?
> *іноді · теорія* · `jss-06-008`
>
> Структура, у якій рушій пам'ятає, яка функція зараз виконується і куди повернутися. Виклик кладе функцію на верх стеку, `return` знімає її.
>
> 📚 [[JavaScript Start - 06. Функції#📚 Функція викликає функцію|Розділ: функція викликає функцію]] · [[JavaScript - 01. Як JS виконує код|Глибокий розділ: як JS виконує код]] · [javascript.info: Debugging in the browser](https://javascript.info/debugging-chrome)

## 🛠️ Практика

> [!task] Квадрат числа
> level: junior · difficulty: easy · id: jss-06-task-01 · tags: functions, return
>
> Напиши функцію `square(n)`, яка **повертає** квадрат числа.
>
> ```js starter
> function square(n) {
>   console.log(n * n)
> }
> ```
>
> ```js tests
> test('square(3) = 9', () => { expect(square(3)).toBe(9) })
> test('square(-4) = 16', () => { expect(square(-4)).toBe(16) })
> test('square(0) = 0', () => { expect(square(0)).toBe(0) })
> ```
>
> > [!hint]- Підказка 1
> > Заготовка друкує правильне число, але тест бачить `undefined`. Чому?
>
> > [!solution]- Рішення
> > ```js
> > function square(n) {
> >   return n * n
> > }
> > ```
> >
> > Тест перевіряє значення, яке функція **повертає**, а не те, що вона друкує.

> [!task] Привітання з запасним імʼям
> level: junior · difficulty: easy · id: jss-06-task-02 · tags: functions, default-params
>
> `greet(name)` повертає `'Привіт, <імʼя>!'`, а якщо імʼя не передали — `'Привіт, друже!'`.
>
> ```js starter
> function greet(name) {
>   return `Привіт, ${name}!`
> }
> ```
>
> ```js tests
> test('з імʼям', () => { expect(greet('Ада')).toBe('Привіт, Ада!') })
> test('без імʼя', () => { expect(greet()).toBe('Привіт, друже!') })
> ```
>
> > [!hint]- Підказка 1
> > Значення за замовчуванням пишеться прямо в дужках параметрів: `(name = …)`.
>
> > [!solution]- Рішення
> > ```js
> > function greet(name = 'друже') {
> >   return `Привіт, ${name}!`
> > }
> > ```

> [!task] Більше з двох
> level: junior · difficulty: easy · id: jss-06-task-03 · tags: functions, conditions
>
> `max(a, b)` повертає більше з двох чисел. Не використовуй готовий `Math.max` — напиши самостійно.
>
> ```js starter
> function max(a, b) {
>   return a
> }
> ```
>
> ```js tests
> test('max(3, 7) = 7', () => { expect(max(3, 7)).toBe(7) })
> test('max(10, 2) = 10', () => { expect(max(10, 2)).toBe(10) })
> test('однакові', () => { expect(max(5, 5)).toBe(5) })
> test('відʼємні', () => { expect(max(-1, -8)).toBe(-1) })
> ```
>
> > [!hint]- Підказка 1
> > Одна умова: якщо `a > b` — повертай `a`, інакше `b`. Можна тернарним оператором.
>
> > [!solution]- Рішення
> > ```js
> > function max(a, b) {
> >   return a > b ? a : b
> > }
> > ```

> [!task] Середнє трьох — стрілкою
> level: junior · difficulty: easy · id: jss-06-task-04 · tags: arrow-functions
>
> Запиши `average` як **стрілкову** функцію, що повертає середнє арифметичне трьох чисел.
>
> ```js starter
> const average = (a, b, c) => {
>   a + b + c / 3
> }
> ```
>
> ```js tests
> test('2, 4, 6 → 4', () => { expect(average(2, 4, 6)).toBe(4) })
> test('1, 2, 3 → 2', () => { expect(average(1, 2, 3)).toBe(2) })
> test('дробовий результат', () => { expect(average(1, 1, 2)).toBeCloseTo(1.33) })
> ```
>
> > [!hint]- Підказка 1
> > У заготовці **дві** помилки: немає `return` і неправильний пріоритет операторів.
>
> > [!hint]- Підказка 2
> > Ділити треба всю суму: `(a + b + c) / 3`.
>
> > [!solution]- Рішення
> > ```js
> > const average = (a, b, c) => (a + b + c) / 3
> > ```
> >
> > Без фігурних дужок `return` неявний, а дужки навколо суми змушують спершу додати, потім ділити.

> [!task] Чек у магазині
> level: junior · difficulty: medium · id: jss-06-task-05 · tags: functions, composition
>
> Склади дві функції:
> - `formatPrice(amount)` повертає рядок `'<amount> грн'`: `formatPrice(150)` → `'150 грн'`;
> - `receipt(price, qty)` рахує суму і повертає її **через** `formatPrice`: `receipt(50, 3)` → `'150 грн'`.
>
> ```js starter
> function formatPrice(amount) {
>   // ...
> }
>
> function receipt(price, qty) {
>   // використай formatPrice
> }
> ```
>
> ```js tests
> test('formatPrice', () => { expect(formatPrice(99)).toBe('99 грн') })
> test('receipt(50, 3)', () => { expect(receipt(50, 3)).toBe('150 грн') })
> test('receipt(10, 0)', () => { expect(receipt(10, 0)).toBe('0 грн') })
> ```
>
> > [!hint]- Підказка 1
> > Почни з `formatPrice` — шаблонний рядок `` `${amount} грн` ``.
>
> > [!hint]- Підказка 2
> > У `receipt` поверни `formatPrice(price * qty)` — результат множення одразу стає аргументом.
>
> > [!solution]- Рішення
> > ```js
> > function formatPrice(amount) {
> >   return `${amount} грн`
> > }
> >
> > function receipt(price, qty) {
> >   return formatPrice(price * qty)
> > }
> > ```
> >
> > Кожна функція робить одну річ. Захочеш змінити формат на `'150.00 ₴'` — виправиш лише `formatPrice`.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Functions](https://javascript.info/function-basics) — оголошення, параметри, `return`, імена.
- 🟢 [javascript.info — Arrow functions, the basics](https://javascript.info/arrow-functions-basics) — стрілки без зайвої теорії.
- 🟢 [MDN — Functions — reusable blocks of code](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Functions) — курс MDN для початківців.
- 🟢 [MDN — Function return values](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Return_values) — `return` на прикладах.
- 🟡 [MDN — Functions (Guide)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) — усі способи оголосити функцію, області видимості.
- 🟡 [MDN — Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) — довідник і відмінності від звичайних функцій.
- 🟡 [javascript.info — Function expressions](https://javascript.info/function-expressions) — функції як значення.

> [!important] Підсумок
> - Функція — рецепт: оголошення записує, виклик `f()` виконує.
> - Параметри — імена в оголошенні, аргументи — значення під час виклику; бракує — `undefined` або значення за замовчуванням.
> - `return` віддає результат і завершує функцію; `console.log` лише показує.
> - Стрілки: `(a, b) => a + b` — неявний `return`; з `{ }` — пиши `return` явно.
> - Змінні всередині функції не видно ззовні; функція бачить зовнішні змінні.
