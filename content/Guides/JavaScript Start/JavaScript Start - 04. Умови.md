---
title: Умови
order: 4
level: junior
tags: [javascript, beginner, conditions, control-flow]
prerequisites:
  - "[[JavaScript Start - 03. Оператори та вирази]]"
estimatedMinutes: 30
id: jss-ch-04
icon: "🚦"
---

# Умови

> [!success] 🎯 Після цього розділу ти зможеш
> - змусити програму обирати шлях через `if` / `else`;
> - будувати «драбину» перевірок з `else if` і розуміти, чому важливий порядок;
> - використати `switch` для вибору з багатьох варіантів і не забути `break`;
> - коротко обирати значення тернарним оператором `умова ? так : ні`;
> - пояснити, які значення JavaScript вважає «хибними» (falsy).

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-04-quiz-01
>
> ```js
> const hour = 14
> if (hour < 12) {
>   console.log('Доброго ранку')
> } else if (hour < 18) {
>   console.log('Добрий день')
> } else {
>   console.log('Добрий вечір')
> }
> ```
>
> **Відповідь:** `Добрий день`
>
> **Пояснення:** `14 < 12` — неправда, тож перша гілка пропускається. `14 < 18` — правда: друкуємо «Добрий день», і на цьому вся конструкція закінчується. До `else` справа не доходить.

## 🧒 Простими словами

До цього моменту програма йшла **прямою дорогою**: рядок за рядком. Умова — це **розвилка**. Як світлофор: зелений — їдь, червоний — стій. Програма дивиться на умову (`true` чи `false`) і обирає, яким шляхом іти далі. Другий шлях вона просто **пропускає**, ніби його й не було.

> [!diagram] Розвилка: умова обирає одну дорогу
> ```yaml
> layout: flow
> nodes:
>   - { id: age, label: "const age", text: "20", tone: blue, icon: "px:person" }
>   - { id: code, label: "розвилка if / else", code: "if (age >= 18) {\n  console.log('Можна голосувати')\n} else {\n  console.log('Ще зарано')\n}", tone: violet, icon: "px:traffic" }
>   - { id: out, label: "консоль", text: "—", tone: green, icon: "px:monitor" }
> edges:
>   - { from: age, to: code, label: "умова" }
>   - { from: code, to: out, label: "одна з гілок" }
> steps:
>   - { move: { from: age, to: code, value: "20 >= 18" }, line: "code:1", note: "Програма доходить до if і спершу обчислює умову: 20 >= 18 → true." }
>   - { line: "code:2", move: { from: code, to: out, value: "'Можна голосувати'" }, set: { out: "Можна голосувати" }, note: "Умова true — виконуємо блок if. Блок else повністю пропускаємо, ніби його й нема." }
>   - { line: "code:5", note: "Після закривної } обидві дороги сходяться: далі виконується спільний код, що стоїть нижче." }
>   - { set: { age: "15", out: "—" }, move: { from: age, to: code, value: "15 >= 18" }, line: "code:1", note: "А тепер age = 15. Ті самі рядки, але умова 15 >= 18 → false." }
>   - { line: ["code:3", "code:4"], move: { from: code, to: out, value: "'Ще зарано'" }, set: { out: "Ще зарано" }, note: "false — блок if перестрибуємо й заходимо в else." }
>   - { focus: code, note: "Виконується рівно одна гілка: або if, або else — ніколи обидві. Потім програма йде далі спільним шляхом." }
> ```

## 🔬 Як це працює

### 🚦 if і else

```js
const age = 20

if (age >= 18) {
  console.log('Можна голосувати')
} else {
  console.log('Ще зарано')
}
// → Можна голосувати
```

Анатомія:

- `if` — «якщо»;
- `( ... )` — **умова**, будь-який вираз; JavaScript перетворить його на `true` або `false`;
- `{ ... }` — **блок**: інструкції, які виконаються, якщо умова правдива;
- `else { ... }` — необов'язковий: що робити в іншому разі.

Відступи (2 пробіли) рушію не потрібні, але без них людина не побачить, що всередині блоку. Редактори роблять їх автоматично.

> [!quiz] Перевір себе: що надрукує код, якщо `balance = 50`, а `price = 80`?
> level: junior · id: jss-04-quiz-02
>
> ```js
> if (balance >= price) {
>   console.log('Купуємо!')
> } else {
>   console.log('Не вистачає грошей')
> }
> ```
>
> - [ ] `Купуємо!`
> - [x] `Не вистачає грошей`
> - [ ] Обидва рядки
> - [ ] Нічого
>
> **Пояснення:** `50 >= 80` — `false`, тож виконується лише гілка `else`. З `if`/`else` завжди виконується **рівно одна** гілка.

> [!quiz] Заповни пропуски
> level: junior · type: fill · id: jss-04-quiz-03
>
> ```js fill
> const isRaining = true
> [[if]] (isRaining) {
>   console.log('Візьми парасольку')
> } [[else]] {
>   console.log('Гарної прогулянки')
> }
> ```

### 🪜 else if — драбина перевірок

Коли варіантів більше за два, додаємо `else if`. Рушій перевіряє умови **згори донизу** і виконує **першу** правдиву гілку — решту пропускає.

```js
const score = 82

if (score >= 90) {
  console.log('Відмінно')
} else if (score >= 75) {
  console.log('Добре')
} else if (score >= 60) {
  console.log('Задовільно')
} else {
  console.log('Спробуй ще')
}
// → Добре
```

> [!warning] Порядок має значення
> Якщо поставити `score >= 60` першим, то й `82`, і `95` потраплять у «Задовільно»: умова вже правдива, і далі рушій не дивиться. Перевіряй від найсуворішої умови до найм'якшої.

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-04-quiz-04
>
> ```js
> const score = 95
> if (score >= 60) {
>   console.log('C')
> } else if (score >= 90) {
>   console.log('A')
> } else {
>   console.log('F')
> }
> ```
>
> **Відповідь:** `C`
>
> **Пояснення:** `95 >= 60` — правда, тож виконується перша гілка. До `score >= 90` рушій навіть не доходить. Порядок умов неправильний — це класичний баг.

> [!quiz] Склади драбину: спершу найсуворіша умова
> level: junior · type: order · id: jss-04-quiz-05
>
> ```js order
> const speed = 100
> if (speed > 120) {
>   console.log('Штраф!')
> } else if (speed > 90) {
>   console.log('Повільніше')
> } else {
>   console.log('Все добре')
> }
> ```
>
> **Пояснення:** `if` → `else if` → `else`. Умова `> 120` стоїть першою: інакше швидкість 150 потрапила б у «Повільніше».

### 🎛️ switch — вибір з меню

Коли порівнюєш **одне значення** з багатьма варіантами, `switch` читається легше за довгу драбину `else if`:

```js
const day = 'сб'

switch (day) {
  case 'сб':
  case 'нд':
    console.log('Вихідний')
    break
  case 'пт':
    console.log('Майже вихідний')
    break
  default:
    console.log('Робочий день')
}
// → Вихідний
```

- `switch (day)` — що перевіряємо;
- `case 'сб':` — варіант; порівняння **строге**, як `===`;
- `break` — «вийди зі switch». Без нього виконання **провалиться** в наступний `case`;
- кілька `case` підряд без коду — «будь-який з них»;
- `default:` — коли жоден варіант не підійшов (як `else`).

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-04-quiz-06
>
> ```js
> const light = 'жовтий'
> switch (light) {
>   case 'червоний':
>     console.log('Стій')
>   case 'жовтий':
>     console.log('Чекай')
>   case 'зелений':
>     console.log('Йди')
> }
> ```
>
> **Відповідь:** `Чекай Йди`
>
> **Пояснення:** збіг на `'жовтий'`, друкуємо «Чекай». Але `break` немає — і виконання «провалюється» далі, у `'зелений'`. Це називають *fall-through*, і майже завжди це баг.

> [!quiz] Заповни пропуски у switch
> level: junior · type: fill · id: jss-04-quiz-07
>
> ```js fill
> const size = 'M'
> switch (size) {
>   [[case]] 'S':
>     console.log('Маленький')
>     [[break]]
>   case 'M':
>     console.log('Середній')
>     break
>   [[default]]:
>     console.log('Невідомий розмір')
> }
> ```

### ❓ Тернарний оператор

Коли треба **обрати одне з двох значень**, є коротка форма:

```text
  умова  ?  значення_якщо_true  :  значення_якщо_false
```

```js
const age = 10
const ticket = age < 12 ? 'дитячий' : 'дорослий'
console.log(ticket) // → дитячий
```

Те саме через `if` зайняло б п'ять рядків. Але не зловживай: тернарний оператор — для **вибору значення**, а не для запуску дій. Вкладені тернарні (`a ? b : c ? d : e`) читати важко — краще `if`.

> [!quiz] Перевір себе: чому дорівнює `label`, якщо `count = 1`?
> level: junior · id: jss-04-quiz-08
>
> ```js
> const label = count === 1 ? 'товар' : 'товари'
> ```
>
> - [x] `'товар'`
> - [ ] `'товари'`
> - [ ] `true`
> - [ ] `1`
>
> **Пояснення:** умова `count === 1` — правда, тож обирається значення **перед** двокрапкою.

### 🌗 Truthy і falsy — «правда» на пальцях

В `if (...)` можна писати не лише порівняння, а будь-яке значення. JavaScript перетворить його на `true` чи `false`. Запам'ятай короткий список **хибних** (*falsy*) значень — їх лише шість основних:

```text
 falsy:  false   0   ''   null   undefined   NaN
 truthy: УСЕ ІНШЕ — '0', ' ', 'false', -5, [], {} …
```

```js
const name = ''
if (name) {
  console.log(`Привіт, ${name}`)
} else {
  console.log('Введи імʼя') // → Введи імʼя — порожній рядок falsy
}
```

Це зручно: `if (name)` читається як «якщо ім'я є». Але обережно з числом `0`: кількість `0` — це цілком реальне значення, а `if (count)` його відкине.

> [!quiz] Перевір себе: які значення falsy? Обери все правильне
> level: junior · type: multi · id: jss-04-quiz-09
> - [x] `0`
> - [x] `''`
> - [ ] `'0'`
> - [x] `null`
> - [ ] `'false'`
> - [x] `undefined`
>
> **Пояснення:** `'0'` і `'false'` — непорожні рядки, а будь-який непорожній рядок — truthy. Falsy лише `false`, `0`, `''`, `null`, `undefined`, `NaN` (плюс рідкісні `-0` і `0n`).

> [!quiz] Склади код: якщо імʼя порожнє — показати «Гість»
> level: junior · type: order · id: jss-04-quiz-10
>
> ```js order
> const input = ''
> const shownName = input ? input : 'Гість'
> console.log(shownName)
> ```
>
> **Пояснення:** порожній рядок — falsy, тож тернарний оператор обере `'Гість'`.

## ⚠️ Пастки

> [!pitfall] Один знак `=` в умові
> `if (x = 5)` не порівнює, а **присвоює** 5 і перевіряє, чи truthy результат (так, 5 — truthy). Умова завжди правдива! Порівнюй через `===`.

> [!pitfall] Крапка з комою після `if (...)`
> `;` одразу після дужок завершує `if` порожньою інструкцією, а блок `{ }` виконується завжди.
>
> ```text
> if (isAdmin);  ❌ ← тут if і закінчився
> {
>   deleteEverything()  // виконається для всіх!
> }
> ```

> [!pitfall] Забутий `break`
> Без `break` у `switch` виконання провалюється в наступні `case`. Пиши `break` після кожного варіанта, якщо не хочеш навмисного провалювання.

> [!pitfall] `if (count)` відкидає нуль
> `0` — falsy. Якщо `0` — нормальне значення (нуль товарів, нуль балів), перевіряй явно: `if (count !== undefined)` або `if (count >= 0)`.

## 🎤 На співбесіді

> [!interview] Які значення в JavaScript falsy?
> level: junior · frequency: часто · id: jss-04-int-01
>
> ---
>
> `false`, `0` (і `-0`), `0n`, `''` (порожній рядок), `null`, `undefined`, `NaN`. Усе інше truthy — включно з `'0'`, `'false'`, `' '`, порожнім масивом `[]` і порожнім обʼєктом `{}`. Falsy-значення в `if`, `&&`, `||`, `!` і тернарному операторі поводяться як `false`.
>
> 📚 [[JavaScript Start - 04. Умови#🌗 Truthy і falsy — «правда» на пальцях|Розділ: truthy і falsy]] · [MDN: Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) · [MDN: Truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)

## 🔗 Зв'язки

- [[JavaScript Start - 03. Оператори та вирази]] — порівняння і `&&`/`||` — «паливо» для умов.
- [[JavaScript Start - 05. Цикли]] — цикл — це умова, яку перевіряють знову і знову.
- [[JavaScript - 02. Типи та приведення типів]] — як саме значення перетворюються на `true`/`false`.

## ⚡ Фішки

> [!reel] 🚦 Виконується лише перша правдива гілка
> У драбині `if / else if / else` рушій зупиняється на першій `true`. Тому перевіряй від найсуворішої умови до найм'якшої.

> [!reel] 🕳️ Falsy — лише шість основних
> `false`, `0`, `''`, `null`, `undefined`, `NaN`. Усе інше — truthy. Навіть `'0'`, `'false'` і порожній масив `[]`.

> [!reel] 🎛️ switch порівнює через ===
> `switch ('1')` не потрапить у `case 1:` — рядок не дорівнює числу. Типи мають збігатися.

> [!reel] ❓ Тернарний — для значень, не для дій
> `const fee = isMember ? 0 : 50` — чудово. `isOk ? save() : alert()` — краще переписати через `if`. Код читають частіше, ніж пишуть.

> [!reel] 🌊 Fall-through буває корисним
> Кілька `case` підряд без `break` — законний спосіб сказати «будь-який з цих варіантів»: `case 'сб': case 'нд': ...`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Як працює `if / else`?
> *дуже часто · теорія* · `jss-04-001`
>
> Рушій обчислює умову в дужках. Якщо вона truthy — виконується блок `if`, інакше — блок `else` (якщо він є). Завжди виконується рівно одна з двох гілок.
>
> 📚 [[JavaScript Start - 04. Умови#🚦 if і else|Розділ: if і else]] · [javascript.info: Conditional branching](https://javascript.info/ifelse)

> [!question]- Чому важливий порядок умов в `else if`?
> *часто · практика* · `jss-04-002`
>
> Виконується **перша** правдива гілка, решта пропускаються. Якщо м'якша умова (`>= 60`) стоїть перед суворішою (`>= 90`), сувора ніколи не спрацює.
>
> 📚 [[JavaScript Start - 04. Умови#🪜 else if — драбина перевірок|Розділ: else if]] · [MDN: if...else](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)

> [!question]- Навіщо `break` у `switch`?
> *часто · код* · `jss-04-003`
>
> Щоб вийти зі `switch` після виконання варіанта. Без `break` виконання «провалюється» в наступні `case` (*fall-through*).
>
> 📚 [[JavaScript Start - 04. Умови#🎛️ switch — вибір з меню|Розділ: switch]] · [MDN: switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)

> [!question]- Що робить `default` у `switch`?
> *іноді · код* · `jss-04-004`
>
> Виконується, коли жоден `case` не збігся, — аналог `else`. Зазвичай пишеться останнім.
>
> 📚 [[JavaScript Start - 04. Умови#🎛️ switch — вибір з меню|Розділ: switch]] · [javascript.info: The "switch" statement](https://javascript.info/switch)

> [!question]- Як записати тернарний оператор?
> *часто · код* · `jss-04-005`
>
> `умова ? значенняЯкщоТак : значенняЯкщоНі`. Наприклад: `const ticket = age < 12 ? 'дитячий' : 'дорослий'`. Використовуй для вибору значення, не для дій.
>
> 📚 [[JavaScript Start - 04. Умови#❓ Тернарний оператор|Розділ: тернарний оператор]] · [MDN: Conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator)

> [!question]- Назви falsy-значення
> *дуже часто · теорія* · `jss-04-006`
>
> `false`, `0`, `''`, `null`, `undefined`, `NaN` (плюс `-0` і `0n`). Усе інше — truthy.
>
> 📚 [[JavaScript Start - 04. Умови#🌗 Truthy і falsy — «правда» на пальцях|Розділ: truthy і falsy]] · [MDN: Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)

> [!question]- Чи truthy рядок `'0'`? А порожній масив `[]`?
> *часто · код* · `jss-04-007`
>
> Так, обидва truthy. `'0'` — непорожній рядок, а масиви й обʼєкти завжди truthy, навіть порожні.
>
> 📚 [[JavaScript Start - 04. Умови#🌗 Truthy і falsy — «правда» на пальцях|Розділ: truthy і falsy]] · [MDN: Truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)

> [!question]- Що не так з `if (x = 10)`?
> *часто · практика* · `jss-04-008`
>
> Це присвоєння, а не порівняння: `x` отримує 10, а умова завжди правдива (10 — truthy). Треба `if (x === 10)`.
>
> 📚 [[JavaScript Start - 04. Умови#⚠️ Пастки|Розділ: пастки]] · [javascript.info: Conditional branching](https://javascript.info/ifelse)

## 🛠️ Практика

> [!task] Знак числа
> level: junior · difficulty: easy · id: jss-04-task-01 · tags: if-else
>
> `sign(n)` повертає `'додатне'`, `'відʼємне'` або `'нуль'`.
>
> ```js starter
> function sign(n) {
>   // if / else if / else
> }
> ```
>
> ```js tests
> test('5 — додатне', () => { expect(sign(5)).toBe('додатне') })
> test('-3 — відʼємне', () => { expect(sign(-3)).toBe('відʼємне') })
> test('0 — нуль', () => { expect(sign(0)).toBe('нуль') })
> ```
>
> > [!hint]- Підказка 1
> > Три варіанти — три гілки: `if (n > 0)`, `else if (n < 0)`, `else`.
>
> > [!hint]- Підказка 2
> > У кожній гілці — `return 'текст'`. Після `return` функція одразу завершується.
>
> > [!solution]- Рішення
> > ```js
> > function sign(n) {
> >   if (n > 0) {
> >     return 'додатне'
> >   } else if (n < 0) {
> >     return 'відʼємне'
> >   } else {
> >     return 'нуль'
> >   }
> > }
> > ```

> [!task] Оцінка за бали
> level: junior · difficulty: easy · id: jss-04-task-02 · tags: else-if
>
> `grade(score)`: 90 і більше → `'A'`, 75–89 → `'B'`, 60–74 → `'C'`, менше 60 → `'F'`.
>
> ```js starter
> function grade(score) {
>   return 'F'
> }
> ```
>
> ```js tests
> test('95 → A', () => { expect(grade(95)).toBe('A') })
> test('межа 90 → A', () => { expect(grade(90)).toBe('A') })
> test('80 → B', () => { expect(grade(80)).toBe('B') })
> test('60 → C', () => { expect(grade(60)).toBe('C') })
> test('59 → F', () => { expect(grade(59)).toBe('F') })
> ```
>
> > [!hint]- Підказка 1
> > Почни з найсуворішої умови: `score >= 90`.
>
> > [!hint]- Підказка 2
> > Завдяки порядку в другій гілці достатньо `score >= 75` — випадки від 90 сюди вже не дійдуть.
>
> > [!solution]- Рішення
> > ```js
> > function grade(score) {
> >   if (score >= 90) return 'A'
> >   if (score >= 75) return 'B'
> >   if (score >= 60) return 'C'
> >   return 'F'
> > }
> > ```
> >
> > Кожен `return` завершує функцію, тож `else` тут не потрібен — це поширений прийом «ранніх повернень».

> [!task] Тип дня через switch
> level: junior · difficulty: easy · id: jss-04-task-03 · tags: switch
>
> `dayType(day)` приймає скорочення дня (`'пн'`…`'нд'`) і повертає `'вихідний'` для `'сб'` і `'нд'`, `'робочий'` для `'пн'`–`'пт'`, і `'невідомо'` для будь-чого іншого. Використай `switch`.
>
> ```js starter
> function dayType(day) {
>   switch (day) {
>     // твої case тут
>   }
> }
> ```
>
> ```js tests
> test('сб — вихідний', () => { expect(dayType('сб')).toBe('вихідний') })
> test('нд — вихідний', () => { expect(dayType('нд')).toBe('вихідний') })
> test('ср — робочий', () => { expect(dayType('ср')).toBe('робочий') })
> test('пт — робочий', () => { expect(dayType('пт')).toBe('робочий') })
> test('інше — невідомо', () => { expect(dayType('свято')).toBe('невідомо') })
> ```
>
> > [!hint]- Підказка 1
> > Кілька `case` підряд без коду між ними означають «будь-який з цих».
>
> > [!hint]- Підказка 2
> > `return` усередині `case` теж виходить зі `switch` (і з функції), тож `break` після нього не потрібен.
>
> > [!solution]- Рішення
> > ```js
> > function dayType(day) {
> >   switch (day) {
> >     case 'сб':
> >     case 'нд':
> >       return 'вихідний'
> >     case 'пн':
> >     case 'вт':
> >     case 'ср':
> >     case 'чт':
> >     case 'пт':
> >       return 'робочий'
> >     default:
> >       return 'невідомо'
> >   }
> > }
> > ```

> [!task] Ціна квитка тернарним оператором
> level: junior · difficulty: easy · id: jss-04-task-04 · tags: ternary
>
> `ticketPrice(age)` повертає `50` для дітей до 12 років і `100` для всіх інших. Напиши в **один рядок** з тернарним оператором.
>
> ```js starter
> function ticketPrice(age) {
>   return 100
> }
> ```
>
> ```js tests
> test('5 років — 50', () => { expect(ticketPrice(5)).toBe(50) })
> test('12 років — вже 100', () => { expect(ticketPrice(12)).toBe(100) })
> test('30 років — 100', () => { expect(ticketPrice(30)).toBe(100) })
> ```
>
> > [!hint]- Підказка 1
> > `return умова ? 50 : 100`
>
> > [!solution]- Рішення
> > ```js
> > function ticketPrice(age) {
> >   return age < 12 ? 50 : 100
> > }
> > ```

> [!task] Імʼя або «Гість»
> level: junior · difficulty: medium · id: jss-04-task-05 · tags: truthy-falsy
>
> `displayName(name)` повертає імʼя, якщо воно є, і `'Гість'`, якщо імʼя порожнє, `null` чи `undefined`.
>
> ```js starter
> function displayName(name) {
>   return name
> }
> ```
>
> ```js tests
> test('звичайне імʼя', () => { expect(displayName('Оля')).toBe('Оля') })
> test('порожній рядок', () => { expect(displayName('')).toBe('Гість') })
> test('null', () => { expect(displayName(null)).toBe('Гість') })
> test('undefined', () => { expect(displayName(undefined)).toBe('Гість') })
> ```
>
> > [!hint]- Підказка 1
> > `''`, `null` і `undefined` — усі falsy. Одна перевірка `if (name)` або тернарний оператор покриє всі три.
>
> > [!solution]- Рішення
> > ```js
> > function displayName(name) {
> >   return name ? name : 'Гість'
> > }
> > ```
> >
> > Коротша форма, яку ти побачиш у реальному коді: `return name || 'Гість'` — `||` повертає першу truthy-частину.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Conditional branching: if, '?'](https://javascript.info/ifelse) — `if`, `else`, тернарний оператор із вправами.
- 🟢 [javascript.info — The "switch" statement](https://javascript.info/switch) — `switch`, `break` і групування `case`.
- 🟢 [MDN — Making decisions in your code — conditionals](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Conditionals) — курс MDN з інтерактивними прикладами.
- 🟡 [MDN — if...else](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) — довідник.
- 🟡 [MDN — switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) — довідник, зокрема про fall-through.
- 🟡 [MDN — Conditional (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator) — тернарний оператор.
- 🟡 [MDN — Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) — повний список falsy-значень.

> [!important] Підсумок
> - `if (умова) { … } else { … }` — розвилка: виконується рівно одна гілка.
> - У драбині `else if` спрацьовує **перша** правдива умова — порядок від найсуворішої.
> - `switch` порівнює одне значення з варіантами через `===`; не забувай `break` і `default`.
> - `умова ? a : b` — коротко обрати одне з двох значень.
> - Falsy: `false`, `0`, `''`, `null`, `undefined`, `NaN`; усе інше — truthy (навіть `'0'` і `[]`).
