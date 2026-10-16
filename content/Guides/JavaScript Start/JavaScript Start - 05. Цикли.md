---
title: Цикли
order: 5
level: junior
tags: [javascript, beginner, loops, control-flow]
prerequisites:
  - "[[JavaScript Start - 04. Умови]]"
estimatedMinutes: 30
id: jss-ch-05
icon: "🔁"
---

# Цикли

> [!success] 🎯 Після цього розділу ти зможеш
> - повторити дію потрібну кількість разів циклом `for`;
> - повторювати дію, «поки умова правдива», циклом `while`;
> - перебрати всі символи рядка (а згодом — елементи масиву) через `for...of`;
> - достроково вийти з циклу `break` або пропустити крок `continue`;
> - знайти й виправити нескінченний цикл і помилку «на одиницю» (*off-by-one*).

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-05-quiz-01
>
> ```js
> for (let i = 1; i <= 3; i++) {
>   console.log(i * 10)
> }
> ```
>
> **Відповідь:** `10 20 30`
>
> **Пояснення:** `i` починається з `1`; поки `i <= 3`, друкуємо `i * 10` і збільшуємо `i` на 1. Після `i = 3` змінна стає `4`, умова хибна — цикл закінчено.

## 🧒 Простими словами

Уяви біговий стадіон. Тренер каже: «Біжи коло, **поки** я не свисну» або «Пробіжи **рівно 5 кіл**». Ти не записуєш «біжи коло» п'ять разів — ти отримуєш одну інструкцію і **лічильник**.

Цикл — це саме така інструкція: «повторюй цей блок, поки умова правдива». Без циклів, щоб надрукувати числа від 1 до 1000, довелося б написати 1000 рядків `console.log`.

## 🔬 Як це працює

### 🔁 Цикл for

`for` — коли ти знаєш, скільки разів повторювати. У дужках три частини через `;`:

> [!diagram] Три частини в дужках for
> ```yaml
> layout: flow
> nodes:
>   - { id: init, label: "1. старт", code: "let i = 0", tone: blue }
>   - { id: cond, label: "2. умова", code: "i < 3", tone: violet }
>   - { id: body, label: "тіло", code: "{ тіло }", tone: green }
>   - { id: step, label: "3. крок", code: "i++", tone: yellow }
> edges:
>   - { from: init, to: cond, label: "один раз" }
>   - { from: cond, to: body, label: "true" }
>   - { from: body, to: step, label: "після проходу" }
>   - { from: step, to: cond, label: "знову перевірка", dashed: true }
> steps:
>   - { show: init, note: "Старт виконується лише один раз — на самому початку: створюємо лічильник i = 0." }
>   - { show: cond, note: "Умова перевіряється ПЕРЕД кожним проходом. Якщо вона true — заходимо в тіло." }
>   - { show: body, note: "Тіло — інструкції в { }, які повторюються. Один прохід тіла називають ітерацією." }
>   - { show: step, note: "Крок виконується ПІСЛЯ кожного проходу: i++ збільшує лічильник на 1." }
>   - { focus: [step, cond], note: "Після кроку — знову умова. Коло крутиться, доки умова не стане false; тоді цикл закінчується." }
> ```

Як рушій це виконує:

> [!diagram] Як рушій виконує for: прохід за проходом
> ```yaml
> layout: flow
> nodes:
>   - { id: i, label: "лічильник i", text: "—", tone: yellow, icon: "px:abacus" }
>   - { id: code, label: "цикл", code: "for (let i = 0; i < 3; i++) {\n  console.log(`Коло ${i + 1}`)\n}", tone: violet, icon: "px:repeat" }
>   - { id: out, label: "консоль", text: "—", tone: green, icon: "px:monitor" }
> edges:
>   - { from: i, to: code, label: "i < 3?" }
>   - { from: code, to: out, label: "тіло друкує" }
> steps:
>   - { set: { i: "0" }, line: "code:1", note: "Старт let i = 0 виконується один раз. Перевірка перед проходом: 0 < 3? так." }
>   - { line: "code:2", move: { from: code, to: out, value: "Коло 1" }, set: { out: "Коло 1" }, note: "Перша ітерація: тіло друкує Коло ${0 + 1}, тобто Коло 1." }
>   - { set: { i: "1", out: "Коло 1\nКоло 2" }, line: ["code:1", "code:2"], move: { from: code, to: out, value: "Коло 2" }, note: "i++ → i = 1. Знову умова: 1 < 3? так — тіло друкує Коло 2." }
>   - { set: { i: "2", out: "Коло 1\nКоло 2\nКоло 3" }, line: ["code:1", "code:2"], move: { from: code, to: out, value: "Коло 3" }, note: "i++ → i = 2. 2 < 3? так — третя ітерація, Коло 3." }
>   - { set: { i: "3" }, line: "code:1", focus: i, note: "i++ → i = 3. Умова 3 < 3? НІ — тіло більше не виконується." }
>   - { line: "code:3", focus: [i, out], note: "Вихід із циклу: програма йде далі після }. Тіло спрацювало 3 рази — для i = 0, 1, 2." }
> ```

Один прохід тіла циклу називають **ітерацією**. За традицією лічильник звуть `i` (від *index*), а рахують з нуля — так зручно з масивами.

```js
for (let i = 0; i < 3; i++) {
  console.log(`Коло ${i + 1}`)
}
// → Коло 1, Коло 2, Коло 3 (кожне з нового рядка)
```

> [!quiz] Перевір себе: скільки разів виконається тіло циклу?
> level: junior · id: jss-05-quiz-02
>
> ```js
> for (let i = 0; i < 5; i++) {
>   console.log('🏃')
> }
> ```
>
> - [ ] 4
> - [x] 5
> - [ ] 6
> - [ ] Нескінченно
>
> **Пояснення:** `i` набуває значень `0, 1, 2, 3, 4` — це п'ять значень. На `i = 5` умова `5 < 5` хибна.

### 🧮 Накопичувач — найчастіший прийом

Більшість задач з циклами — це «пройди по всіх і щось **накопич**»: суму, кількість, рядок. Змінну-накопичувач створюють **до** циклу, а змінюють **усередині**:

```js
let total = 0                  // 1. порожній накопичувач
for (let i = 1; i <= 4; i++) {
  total += i                   // 2. додаємо на кожному кроці
}
console.log(total)             // → 10 — 3. результат після циклу
```

> [!diagram] Накопичувач: total росте на кожному проході
> ```yaml
> layout: flow
> nodes:
>   - { id: i, label: "i", text: "—", tone: yellow }
>   - { id: code, label: "цикл", code: "let total = 0\nfor (let i = 1; i <= 4; i++) {\n  total += i\n}\nconsole.log(total)", tone: violet, icon: "px:repeat" }
>   - { id: total, label: "total", text: "0", tone: green, icon: "px:box" }
> edges:
>   - { from: i, to: code }
>   - { from: code, to: total, label: "total += i" }
> steps:
>   - { line: "code:1", focus: total, note: "До циклу створюємо порожній накопичувач: total = 0." }
>   - { set: { i: "1", total: "1" }, line: "code:3", move: { from: code, to: total, value: "+1" }, note: "i = 1: total = 0 + 1 = 1." }
>   - { set: { i: "2", total: "3" }, line: "code:3", move: { from: code, to: total, value: "+2" }, note: "i = 2: total = 1 + 2 = 3. Накопичувач пам'ятає попередню суму." }
>   - { set: { i: "3", total: "6" }, line: "code:3", move: { from: code, to: total, value: "+3" }, note: "i = 3: total = 3 + 3 = 6." }
>   - { set: { i: "4", total: "10" }, line: "code:3", move: { from: code, to: total, value: "+4" }, note: "i = 4: total = 6 + 4 = 10. Далі i стає 5, умова 5 <= 4 хибна — цикл закінчено." }
>   - { line: "code:5", focus: total, note: "Результат читаємо вже після циклу: console.log(total) → 10." }
> ```

> [!quiz] Склади код, який порахує суму чисел від 1 до 5
> level: junior · type: order · id: jss-05-quiz-03
>
> ```js order
> let sum = 0
> for (let i = 1; i <= 5; i++) {
>   sum += i
> }
> console.log(sum)
> ```
>
> **Пояснення:** накопичувач — до циклу, додавання — всередині, друк — після. Результат: `15`.

> [!quiz] Заповни пропуски: порахуй, скільки чисел від 1 до 10 діляться на 3
> level: junior · type: fill · id: jss-05-quiz-04
>
> ```js fill
> let count = [[0]]
> for (let i = 1; i <= 10; [[i++]]) {
>   if (i % 3 === 0) {
>     count[[++]]
>   }
> }
> console.log(count)
> ```
>
> **Пояснення:** лічильник стартує з нуля, `i++` рухає цикл, а `count++` додає одиницю щоразу, коли знайшли кратне 3. Відповідь: `3` (числа 3, 6, 9).

### ⏳ Цикл while

`while` — коли **не знаєш наперед**, скільки буде повторів, але знаєш умову зупинки.

```js
let coins = 1
let days = 0
while (coins < 100) {
  coins *= 2   // щодня монет удвічі більше
  days++
}
console.log(days)  // → 7
console.log(coins) // → 128
```

Читається як «**поки** монет менше 100 — подвоюй». Скільки днів знадобиться, ми не знали, — цикл сам з'ясував.

> [!important] Головне правило while
> Щось усередині циклу **має змінювати умову**. Якщо `coins` не росте — умова `coins < 100` правдива вічно, і цикл ніколи не закінчиться.

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-05-quiz-05
>
> ```js
> let n = 10
> while (n > 0) {
>   n -= 4
> }
> console.log(n)
> ```
>
> **Відповідь:** `-2`
>
> **Пояснення:** `10 → 6 → 2 → -2`. На `-2` умова `n > 0` хибна — вихід. Зверни увагу: цикл не зупиняється «рівно на нулі», він просто перевіряє умову перед кожним кроком.

> [!quiz] Перевір себе: які цикли ніколи не закінчаться? Обери все правильне
> level: junior · type: multi · id: jss-05-quiz-09
> - [x] `let i = 0; while (i < 3) { console.log(i) }`
> - [ ] `let i = 0; while (i < 3) { i++ }`
> - [x] `for (let i = 0; i < 3; i--) {}`
> - [ ] `for (let i = 10; i > 0; i--) {}`
>
> **Пояснення:** у першому `i` взагалі не змінюється. У третьому `i` зменшується (`0, -1, -2…`) і завжди лишається менше 3. Решта рухають лічильник у бік виходу.

### 📜 for...of — перебрати все по черзі

Коли треба пройти по **кожному елементу** — символу рядка чи елементу масиву, — лічильник не потрібен:

```js
for (const letter of 'кіт') {
  console.log(letter)
}
// → к, і, т (кожна з нового рядка)
```

Тут `const` доречний: на кожній ітерації створюється **нова** змінна `letter`. У розділі [[JavaScript Start - 07. Масиви]] `for...of` стане твоїм головним інструментом.

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-05-quiz-06
>
> ```js
> let result = ''
> for (const ch of 'abc') {
>   result = ch + result
> }
> console.log(result)
> ```
>
> **Відповідь:** `cba`
>
> **Пояснення:** кожен новий символ ставимо **перед** накопиченим: `'a'` → `'ba'` → `'cba'`. Так рядок розвертається.

### 🛑 break і continue

- `break` — «вийди з циклу **зараз**», навіть якщо умова ще правдива.
- `continue` — «пропусти **решту цієї ітерації** і переходь до наступної».

```js
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) continue // парні пропускаємо
  if (i > 7) break          // після 7 — досить
  console.log(i)
}
// → 1, 3, 5, 7
```

Типове застосування `break` — **пошук**: знайшли перше, що шукали, — далі перебирати немає сенсу.

> [!quiz] Заповни пропуски: знайди перше число від 1, кратне 7, і зупинись
> level: junior · type: fill · id: jss-05-quiz-07
>
> ```js fill
> let found = 0
> for (let i = 1; i <= 100; i++) {
>   if (i % 7 [[===]] 0) {
>     found = i
>     [[break]]
>   }
> }
> console.log(found)
> ```

> [!quiz] Склади цикл, який друкує лише непарні числа від 1 до 5
> level: junior · type: order · id: jss-05-quiz-08
>
> ```js order
> for (let i = 1; i <= 5; i++) {
>   if (i % 2 === 0) continue
>   if (i % 2 === 0) break // ✗
>   console.log(i)
> }
> ```
>
> **Пояснення:** `continue` пропускає парні й іде далі. `break` зупинив би цикл на першому ж парному — і ми б побачили лише `1`.

## ⚠️ Пастки

> [!pitfall] Нескінченний цикл
> Забув `i++` або умова ніколи не стає хибною — вкладка браузера «зависає».
>
> ```text
> let i = 0
> while (i < 5) {
>   console.log(i)   ❌ i ніколи не змінюється — цикл вічний
> }
> ```
>
> Що робити: закрий вкладку (або `Ctrl+C` у терміналі для Node.js), виправ код. Перевір: що в тілі циклу наближає умову до `false`?

> [!pitfall] Помилка на одиницю (off-by-one)
> `<` чи `<=`? З 0 чи з 1? Найчастіша помилка в циклах — зайва або пропущена ітерація.
>
> ```js
> for (let i = 1; i < 5; i++) {}  // 1, 2, 3, 4 — п'ятірки немає!
> for (let i = 1; i <= 5; i++) {} // 1, 2, 3, 4, 5 ✅
> ```
>
> Перевіряй межі на папері: яке перше значення, яке останнє, скільки всього.

> [!pitfall] `const` у класичному `for`
> `for (const i = 0; i < 3; i++)` впаде з `TypeError` на `i++`: константу не можна збільшити. У класичному `for` — `let`, у `for...of` — `const`.

## 🎤 На співбесіді

> [!interview] Коли використовувати `for`, `while` і `for...of`?
> level: junior · frequency: часто · id: jss-05-int-01
>
> ---
>
> `for` — коли відома кількість повторів або потрібен індекс (від 0 до n). `while` — коли кількість невідома наперед і цикл триває, поки виконується умова (читання до кінця, подвоєння до порогу). `for...of` — щоб перебрати всі елементи рядка, масиву чи іншого ітерованого обʼєкта без ручного лічильника. У будь-якому циклі `break` виходить достроково, а `continue` пропускає поточну ітерацію.
>
> 📚 [[JavaScript Start - 05. Цикли#🔬 Як це працює|Розділ: цикли]] · [MDN: Loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration) · [javascript.info: Loops: while and for](https://javascript.info/while-for)

## 🔗 Зв'язки

- [[JavaScript Start - 04. Умови]] — цикл — це умова, яку перевіряють перед кожним кроком.
- [[JavaScript Start - 07. Масиви]] — цикли найчастіше перебирають масиви.
- [[JavaScript - 11. Ітератори та генератори]] — як `for...of` працює під капотом.

## ⚡ Фішки

> [!reel] 🔁 for = старт; умова; крок
> Старт виконується раз, умова — перед кожним колом, крок — після кожного кола. Запам'ятай цей порядок — і цикли перестануть бути магією.

> [!reel] 🧮 Накопичувач: до, всередині, після
> Створи змінну **до** циклу, змінюй **всередині**, використовуй **після**. Так рахують суми, кількості й будують рядки.

> [!reel] ♾️ Як зупинити нескінченний цикл
> Браузер: закрий вкладку або натисни паузу в DevTools → Sources. Node.js: `Ctrl+C`. А потім знайди, чому умова ніколи не стає `false`.

> [!reel] 🔢 Чому рахують з нуля
> Елементи масиву нумеруються з `0`, тому `for (let i = 0; i < arr.length; i++)` — канонічна форма. Ти побачиш її тисячі разів.

> [!reel] 🛑 break — для пошуку
> Знайшов те, що шукав? `break` — і не перебирай решту мільйона елементів. Найпростіша оптимізація у світі.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- З яких трьох частин складається заголовок `for`?
> *дуже часто · теорія* · `jss-05-001`
>
> Старт (виконується раз), умова (перед кожною ітерацією), крок (після кожної ітерації): `for (let i = 0; i < n; i++)`.
>
> 📚 [[JavaScript Start - 05. Цикли#🔁 Цикл for|Розділ: цикл for]] · [MDN: for](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for)

> [!question]- Чим `while` відрізняється від `for`?
> *часто · порівняння* · `jss-05-002`
>
> `while` має лише умову — підходить, коли кількість повторів невідома. `for` збирає старт, умову й крок в одному місці — зручно, коли рахуєш.
>
> 📚 [[JavaScript Start - 05. Цикли#⏳ Цикл while|Розділ: while]] · [javascript.info: Loops: while and for](https://javascript.info/while-for)

> [!question]- Що таке ітерація?
> *часто · теорія* · `jss-05-003`
>
> Один прохід тіла циклу. Цикл від `i = 0` до `i < 5` робить п'ять ітерацій.
>
> 📚 [[JavaScript Start - 05. Цикли#🔁 Цикл for|Розділ: цикл for]] · [MDN: Loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)

> [!question]- Що роблять `break` і `continue`?
> *дуже часто · код* · `jss-05-004`
>
> `break` повністю виходить із циклу. `continue` пропускає решту поточної ітерації й переходить до наступної.
>
> 📚 [[JavaScript Start - 05. Цикли#🛑 break і continue|Розділ: break і continue]] · [MDN: break](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/break) · [MDN: continue](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/continue)

> [!question]- Як перебрати всі символи рядка?
> *часто · код* · `jss-05-005`
>
> `for (const ch of text) { … }` — на кожній ітерації `ch` містить наступний символ.
>
> 📚 [[JavaScript Start - 05. Цикли#📜 for...of — перебрати все по черзі|Розділ: for...of]] · [MDN: for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)

> [!question]- Що таке патерн «накопичувач»?
> *часто · практика* · `jss-05-006`
>
> Змінна, створена до циклу (`let total = 0`), яку оновлюють на кожній ітерації (`total += x`) і використовують після циклу. Так рахують суми, кількості, будують рядки.
>
> 📚 [[JavaScript Start - 05. Цикли#🧮 Накопичувач — найчастіший прийом|Розділ: накопичувач]] · [MDN: Looping code](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Loops)

> [!question]- Чому цикл може стати нескінченним?
> *часто · практика* · `jss-05-007`
>
> Умова ніколи не стає `false`: забули змінити лічильник (`i++`), змінюють не ту змінну або умова в принципі недосяжна. Перевір, що тіло циклу наближає умову до хибної.
>
> 📚 [[JavaScript Start - 05. Цикли#⚠️ Пастки|Розділ: пастки]] · [javascript.info: Loops: while and for](https://javascript.info/while-for)

> [!question]- Що таке помилка off-by-one?
> *часто · теорія* · `jss-05-008`
>
> Цикл робить на одну ітерацію більше або менше, ніж треба: `<` замість `<=`, старт з 1 замість 0. Лікується перевіркою першого й останнього значення лічильника.
>
> 📚 [[JavaScript Start - 05. Цикли#⚠️ Пастки|Розділ: пастки]] · [MDN: Loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)

## 🛠️ Практика

> [!task] Сума від 1 до n
> level: junior · difficulty: easy · id: jss-05-task-01 · tags: for, accumulator
>
> `sumTo(n)` повертає суму всіх чисел від 1 до `n` включно. `sumTo(4)` → `1 + 2 + 3 + 4 = 10`.
>
> ```js starter
> function sumTo(n) {
>   let total = 0
>   // цикл тут
>   return total
> }
> ```
>
> ```js tests
> test('sumTo(4) = 10', () => { expect(sumTo(4)).toBe(10) })
> test('sumTo(1) = 1', () => { expect(sumTo(1)).toBe(1) })
> test('sumTo(100) = 5050', () => { expect(sumTo(100)).toBe(5050) })
> ```
>
> > [!hint]- Підказка 1
> > Лічильник від `1` до `n` **включно** — умова `i <= n`.
>
> > [!solution]- Рішення
> > ```js
> > function sumTo(n) {
> >   let total = 0
> >   for (let i = 1; i <= n; i++) {
> >     total += i
> >   }
> >   return total
> > }
> > ```
> >
> > Юний Гаусс, кажуть, порахував `sumTo(100)` без циклу: `n * (n + 1) / 2`. Але цикл — універсальний спосіб для будь-яких сум.

> [!task] Зворотний відлік
> level: junior · difficulty: easy · id: jss-05-task-02 · tags: for, strings
>
> `countdown(n)` повертає рядок відліку від `n` до 1 і слово «Старт!»: `countdown(3)` → `'3 2 1 Старт!'`.
>
> ```js starter
> function countdown(n) {
>   let result = ''
>   // цикл від n вниз до 1
>   return result + 'Старт!'
> }
> ```
>
> ```js tests
> test('з 3', () => { expect(countdown(3)).toBe('3 2 1 Старт!') })
> test('з 1', () => { expect(countdown(1)).toBe('1 Старт!') })
> test('з 5', () => { expect(countdown(5)).toBe('5 4 3 2 1 Старт!') })
> ```
>
> > [!hint]- Підказка 1
> > Цикл може йти і вниз: `for (let i = n; i >= 1; i--)`.
>
> > [!hint]- Підказка 2
> > Додавай до `result` число і пробіл: `` result += `${i} ` ``.
>
> > [!solution]- Рішення
> > ```js
> > function countdown(n) {
> >   let result = ''
> >   for (let i = n; i >= 1; i--) {
> >     result += `${i} `
> >   }
> >   return result + 'Старт!'
> > }
> > ```

> [!task] Скільки разів трапляється літера
> level: junior · difficulty: easy · id: jss-05-task-03 · tags: for-of, strings
>
> `countLetter(text, letter)` рахує, скільки разів `letter` трапляється в `text`. `countLetter('банан', 'а')` → `2`.
>
> ```js starter
> function countLetter(text, letter) {
>   return 0
> }
> ```
>
> ```js tests
> test('банан, а → 2', () => { expect(countLetter('банан', 'а')).toBe(2) })
> test('немає збігів', () => { expect(countLetter('кіт', 'о')).toBe(0) })
> test('порожній текст', () => { expect(countLetter('', 'а')).toBe(0) })
> test('усі збіги', () => { expect(countLetter('ааа', 'а')).toBe(3) })
> ```
>
> > [!hint]- Підказка 1
> > Перебери текст через `for (const ch of text)` і порівнюй кожен символ з `letter`.
>
> > [!hint]- Підказка 2
> > Накопичувач `count` — до циклу, `count++` — коли збіг.
>
> > [!solution]- Рішення
> > ```js
> > function countLetter(text, letter) {
> >   let count = 0
> >   for (const ch of text) {
> >     if (ch === letter) count++
> >   }
> >   return count
> > }
> > ```

> [!task] Перше кратне
> level: junior · difficulty: medium · id: jss-05-task-04 · tags: while
>
> `firstDivisible(from, by)` повертає перше число, **не менше** за `from`, яке ділиться на `by` без остачі. `firstDivisible(10, 7)` → `14`.
>
> ```js starter
> function firstDivisible(from, by) {
>   let x = from
>   // while: поки x не ділиться на by — збільшуй x
>   return x
> }
> ```
>
> ```js tests
> test('від 10 на 7 → 14', () => { expect(firstDivisible(10, 7)).toBe(14) })
> test('саме from підходить', () => { expect(firstDivisible(12, 4)).toBe(12) })
> test('від 1 на 5 → 5', () => { expect(firstDivisible(1, 5)).toBe(5) })
> ```
>
> > [!hint]- Підказка 1
> > Скільки разів збільшувати — невідомо наперед. Це робота для `while`.
>
> > [!hint]- Підказка 2
> > Умова продовження: `x % by !== 0`.
>
> > [!solution]- Рішення
> > ```js
> > function firstDivisible(from, by) {
> >   let x = from
> >   while (x % by !== 0) {
> >     x++
> >   }
> >   return x
> > }
> > ```
> >
> > Цикл завжди закінчиться: серед будь-яких `by` чисел поспіль одне обовʼязково ділиться на `by`.

> [!task] FizzBuzz
> level: junior · difficulty: medium · id: jss-05-task-05 · tags: for, conditions, classic
>
> Класика співбесід. `fizzBuzz(n)` повертає рядок з чисел від 1 до `n` через пробіл, де кратні 3 замінено на `Fizz`, кратні 5 — на `Buzz`, а кратні і 3, і 5 — на `FizzBuzz`.
>
> `fizzBuzz(5)` → `'1 2 Fizz 4 Buzz'`
>
> ```js starter
> function fizzBuzz(n) {
>   let result = ''
>   for (let i = 1; i <= n; i++) {
>     // визнач слово для i і додай до result
>   }
>   return result.trim()
> }
> ```
>
> ```js tests
> test('до 5', () => { expect(fizzBuzz(5)).toBe('1 2 Fizz 4 Buzz') })
> test('15 — FizzBuzz', () => { expect(fizzBuzz(15).endsWith('14 FizzBuzz')).toBe(true) })
> test('до 1', () => { expect(fizzBuzz(1)).toBe('1') })
> ```
>
> > [!hint]- Підказка 1
> > `.trim()` у заготовці прибирає зайвий пробіл у кінці — можеш додавати `слово + ' '` на кожній ітерації.
>
> > [!hint]- Підказка 2
> > Перевіряй спершу «кратне і 3, і 5» (`i % 15 === 0`), інакше `if` для 3 спрацює першим.
>
> > [!solution]- Рішення
> > ```js
> > function fizzBuzz(n) {
> >   let result = ''
> >   for (let i = 1; i <= n; i++) {
> >     if (i % 15 === 0) result += 'FizzBuzz '
> >     else if (i % 3 === 0) result += 'Fizz '
> >     else if (i % 5 === 0) result += 'Buzz '
> >     else result += `${i} `
> >   }
> >   return result.trim()
> > }
> > ```
> >
> > Знову порядок умов: найсуворіша (`% 15`) — першою.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Loops: while and for](https://javascript.info/while-for) — усі види циклів, `break`, `continue` і вправи.
- 🟢 [MDN — Looping code](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Loops) — курс MDN для початківців.
- 🟡 [MDN — Loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration) — огляд усіх циклів мови.
- 🟡 [MDN — for](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) — довідник.
- 🟡 [MDN — while](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while) — довідник.
- 🟡 [MDN — for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) — що можна перебирати.

> [!important] Підсумок
> - `for (старт; умова; крок)` — коли знаєш кількість повторів; умова перевіряється перед кожною ітерацією.
> - `while (умова)` — коли кількість невідома; тіло має наближати умову до `false`.
> - `for (const x of рядокЧиМасив)` — перебрати кожен елемент без лічильника.
> - `break` — вийти з циклу, `continue` — пропустити поточну ітерацію.
> - Накопичувач: до циклу → всередині → після. Перевіряй межі, щоб не помилитися на одиницю.
