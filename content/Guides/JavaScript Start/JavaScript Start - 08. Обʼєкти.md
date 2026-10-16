---
title: Обʼєкти
order: 8
level: junior
tags: [javascript, beginner, objects]
prerequisites:
  - "[[JavaScript Start - 07. Масиви]]"
estimatedMinutes: 35
id: jss-ch-08
icon: "🗂️"
---

# Обʼєкти

> [!success] 🎯 Після цього розділу ти зможеш
> - описати річ із реального світу обʼєктом: `{ name: 'Мурчик', age: 3 }`;
> - читати, додавати й змінювати властивості через крапку і квадратні дужки;
> - працювати з вкладеними обʼєктами і масивами обʼєктів;
> - перебрати всі ключі через `Object.keys`;
> - пояснити, чому `const b = a` для обʼєкта не створює копію.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-08-quiz-01
>
> ```js
> const cat = { name: 'Мурчик', age: 3 }
> cat.age = 4
> console.log(cat.name, cat.age)
> console.log(cat.color)
> ```
>
> **Відповідь:** `Мурчик 4 undefined`
>
> **Пояснення:** `cat.age = 4` змінює властивість (і `const` цьому не заважає). Властивості `color` в обʼєкті немає — читання дає `undefined`, а не помилку.

## 🧒 Простими словами

Масив — це поїзд із **пронумерованими** вагонами. А обʼєкт — це **анкета**: у кожного поля є **назва**. «Ім'я: Мурчик», «Вік: 3», «Порода: британець». Тобі не треба пам'ятати, що вік — у третьому полі: просто питаєш «який вік?».

> [!diagram] Обʼєкт — анкета з названими полями
> ```yaml
> layout: tree
> nodes:
>   - { id: cat, label: "const cat", text: "{ … }", tone: violet, icon: "px:clipboard" }
>   - { id: name, parent: cat, label: "ключ: name", text: "'Мурчик'", tone: blue }
>   - { id: age, parent: cat, label: "ключ: age", text: "3", tone: blue }
>   - { id: hungry, parent: cat, label: "ключ: isHungry", text: "true", tone: blue }
> steps:
>   - { show: name, note: "Перша властивість — пара «ключ: значення»: name → 'Мурчик'. Ключ — це назва поля в анкеті." }
>   - { show: age, note: "Друга властивість: age → 3. Порядок полів не важливий — ми шукаємо за назвою, а не за номером." }
>   - { show: hungry, note: "Третя: isHungry → true. Значенням може бути що завгодно: рядок, число, булеве, масив, інший обʼєкт." }
>   - { focus: age, note: "cat.age — «яке значення в полі age?» → 3. Не треба пам'ятати, що вік — друге поле." }
>   - { set: { age: "4" }, note: "cat.age = 4 переписує значення в тому самому полі. const цьому не заважає: заклеєна змінна cat, а не вміст анкети." }
> ```

Пара «ключ: значення» називається **властивістю** (*property*).

## 🔬 Як це працює

### 🗂️ Створення обʼєкта

Обʼєкт пишуть у фігурних дужках: ключ, двокрапка, значення, кома між властивостями.

```js
const user = {
  name: 'Оля',
  age: 25,
  isAdmin: false,
  hobbies: ['музика', 'біг'], // значенням може бути масив
}
console.log(user.hobbies[0]) // → музика
```

- ключі — зазвичай прості слова без лапок (`name`, `age`);
- значення — будь-що: рядки, числа, масиви, інші обʼєкти, навіть функції;
- кома після останньої властивості дозволена — так зручніше додавати нові.

> [!quiz] Перевір себе: який запис — правильний обʼєкт?
> level: junior · id: jss-08-quiz-02
> - [ ] `{ name = 'Оля', age = 25 }`
> - [x] `{ name: 'Оля', age: 25 }`
> - [ ] `[ name: 'Оля', age: 25 ]`
> - [ ] `{ 'Оля', 25 }`
>
> **Пояснення:** у обʼєкті — фігурні дужки і пари `ключ: значення` через кому. `=` тут не використовується, а квадратні дужки — для масивів.

### 🔑 Крапка чи квадратні дужки

Два способи дістати властивість:

```js
const book = { title: 'Кобзар', year: 1840, 'page count': 114 }

console.log(book.title)          // → Кобзар — через крапку
console.log(book['year'])        // → 1840 — через дужки, ключ як рядок
console.log(book['page count'])  // → 114 — ключ з пробілом: лише дужки

const field = 'title'
console.log(book[field])         // → Кобзар — ключ лежить у змінній
console.log(book.field)          // → undefined — шукає ключ 'field'!
```

| Крапка `obj.key` | Дужки `obj[expr]` |
|---|---|
| коротко й читабельно | ключ можна обчислити або взяти зі змінної |
| ключ — просте слово | ключ — будь-який рядок, навіть з пробілом |

Правило: **крапка за замовчуванням, дужки — коли ключ у змінній** або «незручний».

Додати, змінити, видалити:

```js
const car = { brand: 'Tesla' }
car.color = 'червоний'   // додали нову властивість
car.brand = 'Škoda'      // змінили наявну
delete car.color         // видалили
console.log(car)         // → { brand: 'Škoda' }
```

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-08-quiz-03
>
> ```js
> const scores = { math: 90, art: 75 }
> const subject = 'art'
> console.log(scores[subject])
> console.log(scores.subject)
> ```
>
> **Відповідь:** `75 undefined`
>
> **Пояснення:** `scores[subject]` бере **значення змінної** `subject` (`'art'`) як ключ. `scores.subject` шукає ключ з буквальною назвою `'subject'` — його немає.

> [!quiz] Заповни пропуски: додай властивість і прочитай її за ключем зі змінної
> level: junior · type: fill · id: jss-08-quiz-04
>
> ```js fill
> const phone = { model: 'Pixel' }
> phone[[.]]price = 20000
> const key = 'model'
> console.log(phone[ [[key]] ])
> ```
>
> **Пояснення:** нову властивість додаємо простим присвоєнням через крапку. Ключ у змінній — лише через квадратні дужки: `phone[key]`.

### 🪆 Вкладені обʼєкти

Значенням властивості може бути інший обʼєкт. Тоді крапки йдуть ланцюжком:

```js
const user = {
  name: 'Тарас',
  address: {
    city: 'Львів',
    street: 'Городоцька',
  },
}
console.log(user.address.city) // → Львів
```

Якщо проміжного обʼєкта немає, ланцюжок впаде з `TypeError`. Сучасний захист — **опціональний ланцюжок** `?.`: «якщо зліва `null` чи `undefined` — зупинись і поверни `undefined`».

```js
const guest = { name: 'Гість' }
console.log(guest.address?.city) // → undefined — без помилки
// guest.address.city            ❌ TypeError: Cannot read properties of undefined
```

> [!quiz] Склади обʼєкт користувача з вкладеною адресою
> level: junior · type: order · id: jss-08-quiz-05
>
> ```js order
> const user = {
>   name: 'Ірина',
>   address: {
>     city: 'Одеса',
>   },
> }
> console.log(user.address.city)
> ```
>
> **Пояснення:** вкладений обʼєкт відкривається своєю `{` і закривається `},` — усередині зовнішнього. Друкуємо після того, як обʼєкт повністю оголошено.

### 📋 Масив обʼєктів

Найпоширеніша структура даних у вебі: список товарів, користувачів, повідомлень. Кожен елемент масиву — обʼєкт з однаковими ключами.

```js
const products = [
  { name: 'Кава', price: 80 },
  { name: 'Чай', price: 50 },
  { name: 'Торт', price: 300 },
]

for (const p of products) {
  console.log(`${p.name}: ${p.price} грн`)
}

const cheap = products.filter((p) => p.price < 100)
const names = cheap.map((p) => p.name)
console.log(names) // → ['Кава', 'Чай']
```

`filter` і `map` з попереднього розділу тут розкриваються повністю: відібрати за властивістю, перетворити в потрібний вигляд.

> [!quiz] Склади код: порахуй загальну вартість кошика
> level: junior · type: order · id: jss-08-quiz-06
>
> ```js order
> const cart = [{ price: 100 }, { price: 40 }]
> let total = 0
> for (const item of cart) {
>   total += item.price
> }
> console.log(total)
> ```
>
> **Пояснення:** масив і накопичувач — до циклу; додаємо **властивість** `price` кожного елемента; друкуємо `140` після циклу.

### 🔍 Перебір ключів: Object.keys

Щоб пройти по всіх властивостях обʼєкта, отримай масив ключів:

```js
const stock = { яблука: 12, груші: 0, сливи: 7 }

console.log(Object.keys(stock))   // → ['яблука', 'груші', 'сливи']
console.log(Object.values(stock)) // → [12, 0, 7]

for (const key of Object.keys(stock)) {
  console.log(`${key}: ${stock[key]}`) // ключ у змінній → дужки!
}
```

`Object.entries(obj)` повертає пари `[ключ, значення]` — зручно, коли потрібні обидва.

> [!quiz] Що виведе код?
> level: junior · type: output · id: jss-08-quiz-07
>
> ```js
> const team = { lead: 'Аня', dev: 'Богдан', qa: 'Віра' }
> console.log(Object.keys(team).length)
> ```
>
> **Відповідь:** `3`
>
> **Пояснення:** `Object.keys` повертає масив із трьох ключів, а в масиву є `length`. Так рахують кількість властивостей обʼєкта.

> [!quiz] Заповни пропуски: надрукуй кожен ключ і його значення
> level: junior · type: fill · id: jss-08-quiz-09
>
> ```js fill
> const prices = { кава: 80, чай: 50 }
> for (const key of Object.[[keys]](prices)) {
>   console.log(key, prices[ [[key]] ])
> }
> ```
>
> **Пояснення:** `Object.keys` дає масив ключів. Ключ лежить у змінній — тому квадратні дужки `prices[key]`, а не `prices.key`.

### 🔗 Копія чи посилання?

Ось де обʼєкти поводяться не так, як числа:

```js
let a = 5
let b = a      // b отримала КОПІЮ числа
b = 10
console.log(a) // → 5

const cat = { name: 'Мурчик' }
const alias = cat       // alias — це ТОЙ САМИЙ обʼєкт, а не копія
alias.name = 'Барсик'
console.log(cat.name)   // → Барсик
```

Змінна з обʼєктом зберігає не сам обʼєкт, а **адресу** («посилання»), де він лежить. `const alias = cat` копіює адресу — тепер дві наліпки на одній коробці. Пройди покроково:

> [!viz] memory-refs
> scenario: copy-primitive-vs-object
>
> Числа копіюються, обʼєкти — ні: копіюється лише посилання.

Тому ж два однакові на вигляд обʼєкти не рівні: `{ a: 1 } === { a: 1 }` → `false` — це дві різні коробки. Справжня копія верхнього рівня: `const copy = { ...cat }`. Детально — у [[JavaScript - 03. Значення та посилання]].

> [!quiz] Перевір себе: що правда? Обери все правильне
> level: junior · type: multi · id: jss-08-quiz-08
> - [x] `const b = a` для обʼєкта копіює посилання, а не обʼєкт
> - [ ] `{ x: 1 } === { x: 1 }` дає `true`
> - [x] Зміна властивості через одну змінну видна через іншу, якщо обидві вказують на той самий обʼєкт
> - [x] `const` не забороняє змінювати властивості обʼєкта
>
> **Пояснення:** обʼєкти порівнюються за посиланням: два літерали — дві різні коробки. `const` фіксує лише наліпку (яку коробку змінна позначає), а не вміст.

## ⚠️ Пастки

> [!pitfall] `obj.key`, коли ключ у змінній
> `book.field` шукає ключ з назвою `'field'`. Якщо назва ключа лежить у змінній — тільки `book[field]`.

> [!pitfall] Читання властивості з `undefined`
> `user.address.city`, коли `address` немає, — `TypeError: Cannot read properties of undefined`. Перевір проміжні обʼєкти або використай `user.address?.city`.

> [!pitfall] «Копія», яка не копія
> `const copy = original` — не копія. Змінив `copy.x` — змінився й `original.x`. Для копії верхнього рівня: `{ ...original }`.

## 🎤 На співбесіді

> [!interview] Коли використовувати `obj.key`, а коли `obj[key]`?
> level: junior · frequency: часто · id: jss-08-int-01
>
> ---
>
> Крапка — коли ім'я властивості відоме заздалегідь і є коректним ідентифікатором (`user.name`). Квадратні дужки — коли ключ обчислюється чи лежить у змінній (`user[field]`), містить пробіли, дефіси або починається з цифри (`obj['first-name']`). Типова помилка — `obj.key` замість `obj[key]` при переборі ключів: крапка шукає властивість з буквальною назвою `key`.
>
> 📚 [[JavaScript Start - 08. Обʼєкти#🔑 Крапка чи квадратні дужки|Розділ: крапка чи дужки]] · [MDN: Property accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) · [javascript.info: Objects](https://javascript.info/object)

## 🔗 Зв'язки

- [[JavaScript Start - 07. Масиви]] — масив обʼєктів + `map`/`filter` — щоденна робота фронтендера.
- [[JavaScript Start - 09. Перша інтерактивна сторінка]] — елементи сторінки теж обʼєкти з властивостями (`textContent`, `classList`).
- [[JavaScript - 03. Значення та посилання]] — копіювання, порівняння й мутації глибоко.
- [[JavaScript - 16. Обʼєкти глибоко]] — дескриптори, геттери, `Object.freeze` і більше.

## ⚡ Фішки

> [!reel] 🗂️ Обʼєкт — це анкета
> Масив — пронумеровані вагони, обʼєкт — поля з назвами. Порядок не важливий: питаєш `user.age`, а не «третє поле».

> [!reel] 🔑 Дужки вміють обчислювати
> `obj['user' + id]`, `obj[key]`, `obj['first name']` — у квадратних дужках будь-який вираз. Крапка так не вміє.

> [!reel] 🔗 Дві наліпки на одній коробці
> `const b = a` для обʼєкта не створює копію. Тепер `a` і `b` — два імені того самого обʼєкта.
>
> ```js
> const a = { n: 1 }
> const b = a
> b.n = 2 // a.n → 2
> ```

> [!reel] ❓ ?. рятує від TypeError
> `user.address?.city` поверне `undefined`, якщо адреси немає, замість падіння всієї програми.

> [!reel] 🧮 Скільки властивостей?
> В обʼєкта немає `length`. Але є `Object.keys(obj).length` — кількість ключів одним рядком.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке обʼєкт у JavaScript?
> *дуже часто · теорія* · `jss-08-001`
>
> Набір властивостей «ключ: значення», записаний у фігурних дужках: `{ name: 'Оля', age: 25 }`. Описує одну річ з її характеристиками.
>
> 📚 [[JavaScript Start - 08. Обʼєкти#🗂️ Створення обʼєкта|Розділ: створення]] · [javascript.info: Objects](https://javascript.info/object)

> [!question]- Чим обʼєкт відрізняється від масиву?
> *часто · порівняння* · `jss-08-002`
>
> Масив — упорядкований список з доступом за номером (`arr[0]`). Обʼєкт — набір іменованих полів з доступом за ключем (`user.name`). Списки однотипних речей — масив, опис однієї речі — обʼєкт.
>
> 📚 [[JavaScript Start - 08. Обʼєкти#🧒 Простими словами|Розділ: обʼєкти]] · [MDN: JavaScript object basics](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Object_basics)

> [!question]- Що повертає звернення до неіснуючої властивості?
> *часто · код* · `jss-08-003`
>
> `undefined` — без помилки. Помилка (`TypeError`) буде, лише якщо читати властивість **з** `undefined`: `obj.missing.x`.
>
> 📚 [[JavaScript Start - 08. Обʼєкти#🪆 Вкладені обʼєкти|Розділ: вкладені обʼєкти]] · [javascript.info: Objects](https://javascript.info/object)

> [!question]- Коли потрібні квадратні дужки замість крапки?
> *дуже часто · код* · `jss-08-004`
>
> Коли ключ лежить у змінній (`obj[key]`), обчислюється або містить пробіли/дефіси (`obj['first-name']`).
>
> 📚 [[JavaScript Start - 08. Обʼєкти#🔑 Крапка чи квадратні дужки|Розділ: крапка чи дужки]] · [MDN: Property accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors)

> [!question]- Як додати, змінити і видалити властивість?
> *часто · код* · `jss-08-005`
>
> Додати чи змінити — присвоєнням: `obj.color = 'red'`. Видалити — `delete obj.color`.
>
> 📚 [[JavaScript Start - 08. Обʼєкти#🔑 Крапка чи квадратні дужки|Розділ: крапка чи дужки]] · [MDN: Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)

> [!question]- Як перебрати всі ключі обʼєкта?
> *часто · код* · `jss-08-006`
>
> `for (const key of Object.keys(obj)) { obj[key] }`. `Object.values` дає значення, `Object.entries` — пари `[ключ, значення]`.
>
> 📚 [[JavaScript Start - 08. Обʼєкти#🔍 Перебір ключів: Object.keys|Розділ: Object.keys]] · [MDN: Object.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)

> [!question]- Що робить оператор `?.`?
> *часто · код* · `jss-08-007`
>
> Опціональний ланцюжок: якщо значення зліва — `null` або `undefined`, повертає `undefined` замість помилки. `user.address?.city`.
>
> 📚 [[JavaScript Start - 08. Обʼєкти#🪆 Вкладені обʼєкти|Розділ: вкладені обʼєкти]] · [MDN: Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) · [javascript.info: Optional chaining](https://javascript.info/optional-chaining)

> [!question]- Чому `const copy = original` не копіює обʼєкт?
> *дуже часто · теорія* · `jss-08-008`
>
> Змінна зберігає посилання на обʼєкт. Присвоєння копіює посилання, тож обидві змінні вказують на один обʼєкт. Копія верхнього рівня — `{ ...original }`.
>
> 📚 [[JavaScript Start - 08. Обʼєкти#🔗 Копія чи посилання?|Розділ: копія чи посилання]] · [[JavaScript - 03. Значення та посилання|Глибокий розділ: значення та посилання]] · [javascript.info: Object references and copying](https://javascript.info/object-copy)

## 🛠️ Практика

> [!task] Фабрика користувачів
> level: junior · difficulty: easy · id: jss-08-task-01 · tags: objects
>
> `makeUser(name, age)` повертає обʼєкт з властивостями `name`, `age` і `isAdult` (`true`, якщо вік 18+).
>
> ```js starter
> function makeUser(name, age) {
>   return {}
> }
> ```
>
> ```js tests
> test('дорослий', () => { expect(makeUser('Оля', 25)).toEqual({ name: 'Оля', age: 25, isAdult: true }) })
> test('підліток', () => { expect(makeUser('Тим', 15)).toEqual({ name: 'Тим', age: 15, isAdult: false }) })
> ```
>
> > [!hint]- Підказка 1
> > Значенням властивості може бути вираз: `isAdult: age >= 18`.
>
> > [!solution]- Рішення
> > ```js
> > function makeUser(name, age) {
> >   return {
> >     name: name,
> >     age: age,
> >     isAdult: age >= 18,
> >   }
> > }
> > ```
> >
> > Коли ключ і змінна називаються однаково, можна скоротити: `{ name, age, isAdult: age >= 18 }`.

> [!task] Властивість за ключем
> level: junior · difficulty: easy · id: jss-08-task-02 · tags: objects, bracket-notation
>
> `getProp(obj, key)` повертає значення властивості з назвою `key`. Заготовка має класичну помилку — знайди її.
>
> ```js starter
> function getProp(obj, key) {
>   return obj.key
> }
> ```
>
> ```js tests
> test('рядок', () => { expect(getProp({ color: 'синій' }, 'color')).toBe('синій') })
> test('число', () => { expect(getProp({ a: 1, b: 2 }, 'b')).toBe(2) })
> test('немає ключа', () => { expect(getProp({}, 'x')).toBe(undefined) })
> ```
>
> > [!hint]- Підказка 1
> > `obj.key` шукає властивість з буквальною назвою `'key'`.
>
> > [!solution]- Рішення
> > ```js
> > function getProp(obj, key) {
> >   return obj[key]
> > }
> > ```

> [!task] Місто користувача
> level: junior · difficulty: easy · id: jss-08-task-03 · tags: objects, nested
>
> `cityOf(user)` повертає `user.address.city`, а якщо адреси чи міста немає — рядок `'невідомо'`.
>
> ```js starter
> function cityOf(user) {
>   return user.address.city
> }
> ```
>
> ```js tests
> test('є адреса', () => { expect(cityOf({ address: { city: 'Київ' } })).toBe('Київ') })
> test('немає адреси', () => { expect(cityOf({ name: 'Гість' })).toBe('невідомо') })
> test('адреса без міста', () => { expect(cityOf({ address: {} })).toBe('невідомо') })
> ```
>
> > [!hint]- Підказка 1
> > `user.address?.city` не впаде, а поверне `undefined`.
>
> > [!hint]- Підказка 2
> > `undefined` — falsy. Згадай, як із розділу про умови підставити запасне значення.
>
> > [!solution]- Рішення
> > ```js
> > function cityOf(user) {
> >   return user.address?.city || 'невідомо'
> > }
> > ```
> >
> > `?.` захищає від `TypeError`, а `||` підставляє `'невідомо'` замість `undefined`.

> [!task] Сума кошика
> level: junior · difficulty: medium · id: jss-08-task-04 · tags: objects, arrays, loops
>
> Кошик — масив обʼєктів `{ name, price, qty }`. `cartTotal(cart)` повертає загальну суму: `price * qty` для кожного товару.
>
> ```js starter
> function cartTotal(cart) {
>   return 0
> }
> ```
>
> ```js tests
> test('два товари', () => {
>   const cart = [{ name: 'Кава', price: 80, qty: 2 }, { name: 'Торт', price: 300, qty: 1 }]
>   expect(cartTotal(cart)).toBe(460)
> })
> test('порожній кошик', () => { expect(cartTotal([])).toBe(0) })
> ```
>
> > [!hint]- Підказка 1
> > Накопичувач + `for (const item of cart)`.
>
> > [!hint]- Підказка 2
> > На кожній ітерації додавай `item.price * item.qty`.
>
> > [!solution]- Рішення
> > ```js
> > function cartTotal(cart) {
> >   let total = 0
> >   for (const item of cart) {
> >     total += item.price * item.qty
> >   }
> >   return total
> > }
> > ```

> [!task] Імена дорослих
> level: junior · difficulty: medium · id: jss-08-task-05 · tags: objects, filter, map
>
> `adultNames(users)` приймає масив `{ name, age }` і повертає масив **імен** тих, кому 18 або більше, у тому ж порядку.
>
> ```js starter
> function adultNames(users) {
>   return users
> }
> ```
>
> ```js tests
> test('змішаний список', () => {
>   const users = [{ name: 'Аня', age: 17 }, { name: 'Богдан', age: 30 }, { name: 'Віра', age: 18 }]
>   expect(adultNames(users)).toEqual(['Богдан', 'Віра'])
> })
> test('ніхто не підходить', () => { expect(adultNames([{ name: 'Тим', age: 10 }])).toEqual([]) })
> ```
>
> > [!hint]- Підказка 1
> > Два кроки: спершу відібрати (`filter`), потім перетворити обʼєкти на імена (`map`).
>
> > [!solution]- Рішення
> > ```js
> > function adultNames(users) {
> >   return users.filter((u) => u.age >= 18).map((u) => u.name)
> > }
> > ```

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Objects](https://javascript.info/object) — властивості, крапка і дужки, перебір.
- 🟢 [MDN — JavaScript object basics](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Object_basics) — курс MDN для початківців.
- 🟡 [javascript.info — Object.keys, values, entries](https://javascript.info/keys-values-entries) — перебір обʼєктів.
- 🟡 [MDN — Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects) — посібник MDN.
- 🟡 [MDN — Property accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) — крапка і квадратні дужки.
- 🟡 [MDN — Object.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) — довідник.

> [!important] Підсумок
> - Обʼєкт — набір властивостей `{ ключ: значення }`; описує одну річ.
> - Крапка `obj.key` — за замовчуванням; дужки `obj[key]` — коли ключ у змінній або «незручний».
> - Неіснуюча властивість → `undefined`; властивість з `undefined` → `TypeError` (рятує `?.`).
> - Масив обʼєктів + `for...of`/`filter`/`map` — основна робоча структура даних; `Object.keys` перебирає ключі.
> - Змінна тримає посилання: `const b = a` не копіює обʼєкт; копія верхнього рівня — `{ ...a }`.
