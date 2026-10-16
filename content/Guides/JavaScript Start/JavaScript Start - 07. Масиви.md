---
title: Масиви
order: 7
level: junior
tags: [javascript, beginner, arrays]
prerequisites:
  - "[[JavaScript Start - 06. Функції]]"
estimatedMinutes: 35
id: jss-ch-07
icon: "🧺"
---

# Масиви

> [!success] 🎯 Після цього розділу ти зможеш
> - створити масив і дістати будь-який елемент за індексом;
> - дізнатися довжину масиву і взяти останній елемент;
> - додавати й прибирати елементи через `push` і `pop`;
> - перебрати масив циклом і порахувати суму, кількість, максимум;
> - перетворити масив через `map` і відібрати потрібне через `filter`.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-07-quiz-01
>
> ```js
> const fruits = ['🍎', '🍌', '🍇']
> fruits.push('🍋')
> console.log(fruits.length)
> console.log(fruits[0])
> ```
>
> **Відповідь:** `4 🍎`
>
> **Пояснення:** `push` додав лимон у кінець — тепер елементів чотири. А `fruits[0]` — це **перший** елемент: нумерація в масивах починається з нуля.

## 🧒 Простими словами

Масив — це **поїзд із пронумерованими вагонами**. У кожному вагоні — одне значення. Вагони нумерують з **нуля**: перший вагон — `0`, другий — `1` і так далі. Хочеш дістати пасажира — називаєш номер вагона.

Навіщо? Уяви список покупок на 50 пунктів. Створювати 50 змінних `item1`, `item2`… — божевілля. Масив тримає їх усі під одним іменем — і цикл легко пройде по кожному.

> [!diagram] Масив — поїзд із пронумерованими вагонами
> ```yaml
> layout: flow
> nodes:
>   - { id: w0, label: "індекс 0", text: "🍎", tone: blue }
>   - { id: w1, label: "індекс 1", text: "🍌", tone: blue }
>   - { id: w2, label: "індекс 2", text: "🍇", tone: blue }
>   - { id: w3, label: "індекс 3", text: "🍋", tone: yellow }
>   - { id: len, label: "fruits.length", text: "3", tone: violet }
> edges:
>   - { from: w0, to: w1 }
>   - { from: w1, to: w2 }
>   - { from: w2, to: w3 }
> steps:
>   - { show: [w0, w1, w2], note: "const fruits = ['🍎', '🍌', '🍇'] — поїзд із трьох вагонів. Номери вагонів (індекси) починаються з 0." }
>   - { show: w3, set: { len: "4" }, note: "fruits.push('🍋') чіпляє новий вагон у кінець. Він отримує наступний номер — 3, а length стає 4." }
>   - { focus: w0, note: "fruits[0] — це перший вагон, 🍎. Називаєш номер — отримуєш пасажира." }
>   - { focus: [w3, len], note: "Останній індекс завжди на 1 менший за length: 4 вагони — індекси від 0 до 3." }
> ```

## 🔬 Як це працює

### 🧺 Створення та індекси

Масив пишуть у квадратних дужках, елементи — через кому. Усередині може бути що завгодно: числа, рядки, навіть інші масиви.

```js
const scores = [90, 75, 82]
const empty = []
const mixed = ['текст', 42, true]

console.log(scores[1])  // → 75 — другий елемент
console.log(scores[5])  // → undefined — такого вагона немає

scores[0] = 100         // замінити елемент
console.log(scores)     // → [100, 75, 82]
```

**Індекс** — номер елемента. Перший — `0`, останній — `length - 1`.

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-07-quiz-02
>
> ```js
> const days = ['пн', 'вт', 'ср', 'чт', 'пт']
> console.log(days[2])
> console.log(days[days.length - 1])
> ```
>
> **Відповідь:** `ср пт`
>
> **Пояснення:** індекс `2` — третій елемент, `'ср'`. `days.length` — `5`, отже останній має індекс `4`: `'пт'`.

> [!quiz] Заповни пропуски: дістань перший і останній елементи
> level: junior · type: fill · id: jss-07-quiz-03
>
> ```js fill
> const colors = ['червоний', 'зелений', 'синій']
> const first = colors[ [[0]] ]
> const last = colors[colors.[[length]] - 1]
> ```
>
> **Пояснення:** перший елемент завжди має індекс `0`, останній — `length - 1`.

### 📏 length — скільки елементів

`length` — кількість елементів. Він оновлюється автоматично, коли масив змінюється.

```js
const list = ['хліб', 'молоко']
console.log(list.length) // → 2
list.push('сир')
console.log(list.length) // → 3
```

### ➕ push і pop — додати й забрати з кінця

Масив можна уявити як **стопку тарілок**: `push` кладе нову тарілку зверху (в кінець), `pop` знімає верхню і **повертає** її.

```js
const stack = ['🍽️1', '🍽️2']
stack.push('🍽️3')            // додали в кінець
console.log(stack)            // → ['🍽️1', '🍽️2', '🍽️3']
const top = stack.pop()       // забрали з кінця
console.log(top)              // → 🍽️3
console.log(stack.length)     // → 2
```

Для початку масиву є пара `unshift` (додати на початок) і `shift` (забрати перший). Вони працюють так само, тільки з іншого кінця.

| Метод | Що робить | Що повертає |
|---|---|---|
| `push(x)` | додає в кінець | нову довжину |
| `pop()` | забирає останній | забраний елемент |
| `unshift(x)` | додає на початок | нову довжину |
| `shift()` | забирає перший | забраний елемент |

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-07-quiz-04
>
> ```js
> const queue = ['Аня', 'Богдан']
> queue.push('Віра')
> queue.pop()
> queue.push('Галя')
> console.log(queue.length, queue[2])
> ```
>
> **Відповідь:** `3 Галя`
>
> **Пояснення:** `['Аня', 'Богдан', 'Віра']` → `pop` забирає Віру → `push('Галя')` → `['Аня', 'Богдан', 'Галя']`.

> [!quiz] Склади код: створи порожній список, додай два пункти, надрукуй кількість
> level: junior · type: order · id: jss-07-quiz-05
>
> ```js order
> const todos = []
> todos.push('Купити хліб')
> todos.push('Вивчити масиви')
> console.log(todos.length)
> ```
>
> **Пояснення:** масив створюємо до того, як щось у нього класти. `const` тут не заважає: ми не замінюємо масив, а лише додаємо в нього елементи.

### 🔁 Перебір масиву

Два способи пройти по всіх елементах:

```js
const prices = [100, 250, 50]

// 1. for з індексом — коли потрібен номер
for (let i = 0; i < prices.length; i++) {
  console.log(`${i + 1}. ${prices[i]} грн`)
}

// 2. for...of — коли потрібні лише значення
let total = 0
for (const price of prices) {
  total += price
}
console.log(total) // → 400
```

`for...of` — простіший і безпечніший: немає індексу — немає помилки на одиницю.

> [!quiz] Заповни пропуски: знайди найбільше число
> level: junior · type: fill · id: jss-07-quiz-06
>
> ```js fill
> const nums = [3, 17, 8]
> let max = nums[0]
> for (const n [[of]] nums) {
>   if (n [[>]] max) {
>     max = n
>   }
> }
> console.log(max)
> ```
>
> **Пояснення:** беремо перший елемент як «поки що найбільший» і порівнюємо з кожним наступним. Результат: `17`.

### 🔎 Пошук: includes і indexOf

```js
const pets = ['кіт', 'пес', 'папуга']
console.log(pets.includes('пес'))  // → true
console.log(pets.indexOf('папуга')) // → 2
console.log(pets.indexOf('рибка'))  // → -1 — не знайдено
```

`includes` відповідає «чи є?», `indexOf` — «на якому місці?» (або `-1`, якщо немає).

> [!quiz] Перевір себе: що поверне `['a', 'b'].indexOf('c')`?
> level: junior · id: jss-07-quiz-07
> - [ ] `0`
> - [ ] `undefined`
> - [x] `-1`
> - [ ] `false`
>
> **Пояснення:** `indexOf` повертає `-1`, коли елемента немає: `0` — це законний індекс першого елемента, тож його використати не можна.

### 🪄 map і filter — перший погляд

Більшість роботи з масивами — це «перетвори кожен елемент» або «залиш лише потрібні». Для цього є методи, які приймають **функцію** і самі роблять цикл:

- `map(fn)` — новий масив, де кожен елемент **перетворено** функцією;
- `filter(fn)` — новий масив лише з елементів, для яких функція повернула `true`.

```js
const prices = [100, 250, 50]

const withTax = prices.map((p) => p * 1.2)
console.log(withTax)  // → [120, 300, 60]

const cheap = prices.filter((p) => p < 200)
console.log(cheap)    // → [100, 50]

console.log(prices)   // → [100, 250, 50] — оригінал не змінився
```

> [!diagram] map перетворює кожен, filter залишає потрібні
> ```yaml
> layout: compare
> columns: { map: "map — перетворити кожен", filter: "filter — залишити потрібні" }
> nodes:
>   - { id: mapin, col: map, label: "prices", text: "[100, 250, 50]", tone: blue }
>   - { id: mapfn, col: map, label: "функція", code: "(p) => p * 1.2", tone: violet }
>   - { id: mapout, col: map, label: "withTax", text: "[ ]", tone: green }
>   - { id: filin, col: filter, label: "prices", text: "[100, 250, 50]", tone: blue }
>   - { id: filfn, col: filter, label: "функція", code: "(p) => p < 200", tone: violet }
>   - { id: filout, col: filter, label: "cheap", text: "[ ]", tone: green }
> steps:
>   - { focus: [mapin, filin], note: "Обидва методи отримують той самий масив prices і функцію. Цикл вони роблять самі — по одному елементу." }
>   - { set: { mapout: "[120]", filout: "[100]" }, line: ["mapfn:1", "filfn:1"], note: "Елемент 100: map кладе 100 * 1.2 = 120. filter питає 100 < 200? — true, тож 100 лишається." }
>   - { set: { mapout: "[120, 300]" }, line: ["mapfn:1", "filfn:1"], focus: [mapout, filout], note: "Елемент 250: map кладе 300. А 250 < 200 — false, тому filter його пропускає: cheap не змінився." }
>   - { set: { mapout: "[120, 300, 60]", filout: "[100, 50]" }, line: ["mapfn:1", "filfn:1"], note: "Елемент 50: map → 60, filter → 50 < 200 true, лишаємо." }
>   - { focus: [mapout, filout, mapin], note: "map дає масив того самого розміру (3 → 3), filter — можливо менший (3 → 2). Оригінал prices не змінився." }
> ```

Подивись, як фрукти проходять крізь такий конвеєр (третій етап, `reduce`, ти вивчиш пізніше):

> [!viz] array-pipeline
> scenario: map-filter-reduce

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-07-quiz-08
>
> ```js
> const nums = [1, 2, 3, 4]
> const result = nums.filter((n) => n % 2 === 0).map((n) => n * 10)
> console.log(result.join(' '))
> ```
>
> **Відповідь:** `20 40`
>
> **Пояснення:** `filter` залишає парні `[2, 4]`, потім `map` множить кожне на 10: `[20, 40]`. `join(' ')` склеює елементи в рядок через пробіл.

> [!quiz] Перевір себе: що правда про `map` і `filter`? Обери все правильне
> level: junior · type: multi · id: jss-07-quiz-10
> - [x] Обидва повертають новий масив
> - [ ] `filter` змінює оригінальний масив
> - [x] `map` повертає масив тієї ж довжини
> - [x] `filter` може повернути порожній масив
>
> **Пояснення:** обидва методи не чіпають оригінал. `map` перетворює кожен елемент (довжина та сама), `filter` відбирає — тож може не лишити жодного.

> [!quiz] Склади ланцюжок: залиш дорослих, потім візьми їхні імена
> level: junior · type: order · id: jss-07-quiz-09
>
> ```js order
> const ages = [12, 25, 17, 40]
> const adults = ages.filter((age) => age >= 18)
> const labels = adults.map((age) => `${age} років`)
> console.log(labels)
> ```
>
> **Пояснення:** спершу відбираємо (`filter`), потім перетворюємо (`map`) уже відібране. Результат: `['25 років', '40 років']`.

## ⚠️ Пастки

> [!pitfall] Перший елемент — `[0]`, а не `[1]`
> `arr[1]` — це **другий** елемент. А `arr[arr.length]` — завжди `undefined`: останній індекс на одиницю менший за довжину.

> [!pitfall] `const` не заморожує масив
> `const` забороняє **замінити** масив іншим (`list = []` → `TypeError`), але дозволяє змінювати його вміст: `push`, `pop`, `list[0] = …`. Коробка заклеєна, але це коробка з дверцятами.

> [!pitfall] Два однакові масиви — не рівні
> `[1, 2] === [1, 2]` → `false`. Масиви порівнюються за «адресою», а не за вмістом. Чому — у [[JavaScript Start - 08. Обʼєкти]].

> [!pitfall] `map` із фігурними дужками без `return`
> `nums.map((n) => { n * 2 })` дасть масив з `undefined`. Або `(n) => n * 2`, або `{ return n * 2 }`.

## 🎤 На співбесіді

> [!interview] Чим `map` відрізняється від `filter`?
> level: junior · frequency: дуже часто · id: jss-07-int-01
>
> ---
>
> Обидва створюють **новий** масив і не змінюють оригінал. `map` викликає функцію для кожного елемента і кладе в результат те, що вона повернула, — довжина та сама. `filter` кладе в результат лише ті елементи, для яких функція повернула truthy-значення, — довжина та сама або менша. Їх часто поєднують у ланцюжок: `users.filter(isActive).map(getName)`.
>
> 📚 [[JavaScript Start - 07. Масиви#🪄 map і filter — перший погляд|Розділ: map і filter]] · [MDN: Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) · [javascript.info: Array methods](https://javascript.info/array-methods)

## 🔗 Зв'язки

- [[JavaScript Start - 05. Цикли]] — `for` і `for...of` — основа перебору масивів.
- [[JavaScript Start - 06. Функції]] — `map` і `filter` приймають функції.
- [[JavaScript Start - 08. Обʼєкти]] — масиви обʼєктів — найпоширеніша структура даних у вебі.
- [[JavaScript - 12. Масиви та функціональний стиль]] — `reduce`, сортування, імутабельність і продуктивність.

## ⚡ Фішки

> [!reel] 0️⃣ Чому індекси з нуля
> Індекс — це «на скільки кроків від початку». Перший елемент — нуль кроків. Так заведено в C, Java, Python і JavaScript.

> [!reel] 🍽️ push/pop — стопка тарілок
> `push` кладе зверху, `pop` знімає верхню і повертає її. Останнім прийшов — першим пішов. Програмісти називають це «стек».

> [!reel] 🪄 map не змінює оригінал
> `map` і `filter` завжди повертають **новий** масив. Старий лишається як був — і це рятує від купи багів.
>
> ```js
> const a = [1, 2]
> const b = a.map((x) => x * 2)
> // a → [1, 2], b → [2, 4]
> ```

> [!reel] 🔍 -1 означає «не знайдено»
> `indexOf` повертає `-1`, бо `0` — це законний індекс. Хочеш просто «так/ні» — бери `includes`.

> [!reel] 🎯 Останній елемент — arr.at(-1)
> Замість `arr[arr.length - 1]` сучасний JavaScript дозволяє `arr.at(-1)`. Від'ємний індекс рахує з кінця.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке масив?
> *дуже часто · теорія* · `jss-07-001`
>
> Упорядкований список значень під одним іменем. Кожен елемент має номер — індекс, що починається з `0`.
>
> 📚 [[JavaScript Start - 07. Масиви#🧒 Простими словами|Розділ: масиви]] · [javascript.info: Arrays](https://javascript.info/array)

> [!question]- Як дістати перший і останній елементи масиву?
> *дуже часто · код* · `jss-07-002`
>
> Перший — `arr[0]`, останній — `arr[arr.length - 1]` (або `arr.at(-1)`).
>
> 📚 [[JavaScript Start - 07. Масиви#🧺 Створення та індекси|Розділ: індекси]] · [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

> [!question]- Що повертає `arr[100]`, якщо в масиві 3 елементи?
> *часто · код* · `jss-07-003`
>
> `undefined` — помилки немає, просто такого елемента не існує.
>
> 📚 [[JavaScript Start - 07. Масиви#🧺 Створення та індекси|Розділ: індекси]] · [javascript.info: Arrays](https://javascript.info/array)

> [!question]- Що роблять `push` і `pop`?
> *дуже часто · код* · `jss-07-004`
>
> `push(x)` додає елемент у кінець (повертає нову довжину). `pop()` видаляє останній елемент і повертає його.
>
> 📚 [[JavaScript Start - 07. Масиви#➕ push і pop — додати й забрати з кінця|Розділ: push і pop]] · [MDN: Array.prototype.push()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) · [MDN: Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)

> [!question]- Як перебрати всі елементи масиву?
> *дуже часто · код* · `jss-07-005`
>
> `for (const item of arr) { … }` — коли потрібні значення. `for (let i = 0; i < arr.length; i++)` — коли потрібен ще й індекс.
>
> 📚 [[JavaScript Start - 07. Масиви#🔁 Перебір масиву|Розділ: перебір]] · [MDN: Arrays (Learn)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Arrays)

> [!question]- Як перевірити, чи є елемент у масиві?
> *часто · код* · `jss-07-006`
>
> `arr.includes(x)` → `true`/`false`. Якщо потрібна позиція — `arr.indexOf(x)` (або `-1`, якщо немає).
>
> 📚 [[JavaScript Start - 07. Масиви#🔎 Пошук: includes і indexOf|Розділ: пошук]] · [MDN: Array.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)

> [!question]- Що робить `map`?
> *дуже часто · код* · `jss-07-007`
>
> Створює новий масив тієї ж довжини, де кожен елемент — результат функції: `[1, 2].map((x) => x * 2)` → `[2, 4]`. Оригінал не змінюється.
>
> 📚 [[JavaScript Start - 07. Масиви#🪄 map і filter — перший погляд|Розділ: map і filter]] · [MDN: Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

> [!question]- Що робить `filter`?
> *дуже часто · код* · `jss-07-008`
>
> Створює новий масив лише з тих елементів, для яких функція повернула `true`: `[1, 2, 3].filter((x) => x > 1)` → `[2, 3]`.
>
> 📚 [[JavaScript Start - 07. Масиви#🪄 map і filter — перший погляд|Розділ: map і filter]] · [MDN: Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

> [!question]- Чому можна робити `push` у масив, оголошений через `const`?
> *часто · теорія* · `jss-07-009`
>
> `const` забороняє лише **перепризначити** змінну іншим значенням. Сам масив лишається тим самим, а його вміст змінювати можна.
>
> 📚 [[JavaScript Start - 07. Масиви#⚠️ Пастки|Розділ: пастки]] · [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)

## 🛠️ Практика

> [!task] Останній елемент
> level: junior · difficulty: easy · id: jss-07-task-01 · tags: arrays, index
>
> `last(arr)` повертає останній елемент масиву, а для порожнього масиву — `undefined`.
>
> ```js starter
> function last(arr) {
>   return arr[arr.length]
> }
> ```
>
> ```js tests
> test('[1, 2, 3] → 3', () => { expect(last([1, 2, 3])).toBe(3) })
> test('один елемент', () => { expect(last(['🍎'])).toBe('🍎') })
> test('порожній → undefined', () => { expect(last([])).toBe(undefined) })
> ```
>
> > [!hint]- Підказка 1
> > Якщо в масиві 3 елементи, які в них індекси?
>
> > [!solution]- Рішення
> > ```js
> > function last(arr) {
> >   return arr[arr.length - 1]
> > }
> > ```
> >
> > Для порожнього масиву `arr[-1]` — це `undefined`, як і треба.

> [!task] Сума масиву
> level: junior · difficulty: easy · id: jss-07-task-02 · tags: arrays, loops, accumulator
>
> `sum(numbers)` повертає суму всіх чисел масиву. Для порожнього масиву — `0`.
>
> ```js starter
> function sum(numbers) {
>   return 0
> }
> ```
>
> ```js tests
> test('[1, 2, 3] → 6', () => { expect(sum([1, 2, 3])).toBe(6) })
> test('порожній → 0', () => { expect(sum([])).toBe(0) })
> test('з відʼємними', () => { expect(sum([10, -4, 4])).toBe(10) })
> ```
>
> > [!hint]- Підказка 1
> > Накопичувач `total = 0` і `for (const n of numbers)`.
>
> > [!solution]- Рішення
> > ```js
> > function sum(numbers) {
> >   let total = 0
> >   for (const n of numbers) {
> >     total += n
> >   }
> >   return total
> > }
> > ```

> [!task] Скільки додатних
> level: junior · difficulty: easy · id: jss-07-task-03 · tags: arrays, loops
>
> `countPositive(numbers)` повертає кількість чисел, більших за нуль.
>
> ```js starter
> function countPositive(numbers) {
>   let count = 0
>   // ...
>   return count
> }
> ```
>
> ```js tests
> test('змішані', () => { expect(countPositive([1, -2, 3, 0, 5])).toBe(3) })
> test('усі відʼємні', () => { expect(countPositive([-1, -2])).toBe(0) })
> test('порожній', () => { expect(countPositive([])).toBe(0) })
> ```
>
> > [!hint]- Підказка 1
> > `0` — не додатне. Умова: `n > 0`.
>
> > [!solution]- Рішення
> > ```js
> > function countPositive(numbers) {
> >   let count = 0
> >   for (const n of numbers) {
> >     if (n > 0) count++
> >   }
> >   return count
> > }
> > ```
> >
> > Те саме одним рядком (коли освоїш `filter`): `return numbers.filter((n) => n > 0).length`.

> [!task] Подвоїти все через map
> level: junior · difficulty: easy · id: jss-07-task-04 · tags: arrays, map
>
> `doubleAll(numbers)` повертає **новий** масив, де кожне число подвоєне. Оригінал змінювати не можна. Використай `map`.
>
> ```js starter
> function doubleAll(numbers) {
>   return numbers
> }
> ```
>
> ```js tests
> test('[1, 2, 3] → [2, 4, 6]', () => { expect(doubleAll([1, 2, 3])).toEqual([2, 4, 6]) })
> test('порожній → порожній', () => { expect(doubleAll([])).toEqual([]) })
> test('оригінал не змінюється', () => {
>   const input = [5, 10]
>   doubleAll(input)
>   expect(input).toEqual([5, 10])
> })
> test('повертає новий масив', () => {
>   const input = [1]
>   expect(doubleAll(input) === input).toBe(false)
> })
> ```
>
> > [!hint]- Підказка 1
> > `numbers.map((n) => …)` — що має повернути функція для кожного `n`?
>
> > [!solution]- Рішення
> > ```js
> > function doubleAll(numbers) {
> >   return numbers.map((n) => n * 2)
> > }
> > ```
> >
> > `toEqual` у тестах порівнює масиви за вмістом — `toBe` для масивів перевіряв би, чи це той самий масив.

> [!task] Довгі слова через filter
> level: junior · difficulty: medium · id: jss-07-task-05 · tags: arrays, filter
>
> `longWords(words, minLength)` повертає лише слова, у яких **щонайменше** `minLength` літер. Довжина рядка — теж `.length`.
>
> ```js starter
> function longWords(words, minLength) {
>   return []
> }
> ```
>
> ```js tests
> test('мінімум 4 літери', () => { expect(longWords(['кіт', 'собака', 'їжак', 'я'], 4)).toEqual(['собака', 'їжак']) })
> test('жодне не підходить', () => { expect(longWords(['а', 'б'], 2)).toEqual([]) })
> test('межа включно', () => { expect(longWords(['дім'], 3)).toEqual(['дім']) })
> ```
>
> > [!hint]- Підказка 1
> > `words.filter((word) => …)` — функція має повертати `true` для слів, які лишаємо.
>
> > [!hint]- Підказка 2
> > «Щонайменше» — це `>=`.
>
> > [!solution]- Рішення
> > ```js
> > function longWords(words, minLength) {
> >   return words.filter((word) => word.length >= minLength)
> > }
> > ```

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Arrays](https://javascript.info/array) — створення, індекси, `push`/`pop`, перебір.
- 🟢 [MDN — Arrays (Learn)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Arrays) — курс MDN для початківців з вправами.
- 🟡 [javascript.info — Array methods](https://javascript.info/array-methods) — `map`, `filter`, `includes` і ще десятки методів.
- 🟡 [MDN — Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) — повний довідник методів.
- 🟡 [MDN — Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) — довідник `map`.
- 🟡 [MDN — Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) — довідник `filter`.
- 🛠️ [MDN — Test your skills: Arrays](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Test_your_skills/Arrays) — вправи для самоперевірки.

> [!important] Підсумок
> - Масив — упорядкований список: `['a', 'b']`; індекси з `0`, останній — `length - 1`.
> - Неіснуючий індекс дає `undefined`, а не помилку.
> - `push`/`pop` — додати/забрати з кінця; `unshift`/`shift` — з початку.
> - Перебір: `for...of` для значень, класичний `for` — коли потрібен індекс.
> - `map` перетворює кожен елемент, `filter` відбирає потрібні — обидва повертають **новий** масив.
