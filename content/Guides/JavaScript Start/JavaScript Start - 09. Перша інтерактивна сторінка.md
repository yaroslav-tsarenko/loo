---
title: Перша інтерактивна сторінка
order: 9
level: junior
tags: [javascript, beginner, dom, events, project]
prerequisites:
  - "[[JavaScript Start - 08. Обʼєкти]]"
estimatedMinutes: 45
id: jss-ch-09
icon: "🖱️"
---

# Перша інтерактивна сторінка

> [!success] 🎯 Після цього розділу ти зможеш
> - підключити JavaScript до HTML-сторінки тегом `<script>`;
> - знайти елемент на сторінці через `document.querySelector`;
> - змінити текст елемента і його CSS-класи;
> - реагувати на кліки через `addEventListener('click', …)`;
> - зібрати з нуля два міні-проєкти: «Лічильник кліків» і «Список справ».

## 🤔 Передбач

> [!quiz] Що побачить користувач на сторінці?
> level: junior · id: jss-09-quiz-01
>
> ```html
> <p id="msg">Привіт</p>
> <script>
>   const p = document.querySelector('#msg')
>   p.textContent = 'Бувай'
> </script>
> ```
>
> - [ ] `Привіт`
> - [x] `Бувай`
> - [ ] `Привіт` і `Бувай`
> - [ ] Помилку
>
> **Пояснення:** браузер спершу малює абзац «Привіт», потім виконує скрипт: той знаходить абзац і замінює текст. Усе відбувається так швидко, що користувач одразу бачить «Бувай».

## 🧒 Простими словами

Сторінка — це **кімната**:

- 🧱 **HTML** — стіни й меблі: що є на сторінці (заголовки, кнопки, поля);
- 🎨 **CSS** — ремонт і декор: кольори, шрифти, розташування;
- ⚡ **JavaScript** — електрика: вимикачі, які **щось роблять**, коли їх натискаєш.

Щоб «провести електрику», JavaScript має спершу **знайти** потрібну річ у кімнаті (кнопку), а потім **підписатися** на подію: «коли натиснуть — зроби ось це». Браузер надає для цього обʼєкт `document` — модель усієї сторінки, яку називають **DOM** (*Document Object Model*).

> [!diagram] Як HTML стає деревом DOM
> ```yaml
> layout: tree
> nodes:
>   - { id: doc, label: "document", text: "уся сторінка", tone: violet, icon: "px:file" }
>   - { id: body, parent: doc, label: "body", code: "<body>", tone: gray }
>   - { id: h1, parent: body, label: "h1 · textContent", text: "'0'", tone: blue }
>   - { id: btn, parent: body, label: "button · textContent", text: "'+1'", tone: blue }
> steps:
>   - { show: doc, note: "Браузер читає HTML і будує з нього дерево обʼєктів — DOM. На вершині — document, модель усієї сторінки." }
>   - { show: body, note: "Тег <body> стає обʼєктом-гілкою. Усе, що всередині нього в HTML, стане його дітьми." }
>   - { show: h1, note: "<h1>0</h1> → обʼєкт h1. Його текст доступний як властивість textContent = '0'." }
>   - { show: btn, note: "<button>+1</button> → обʼєкт button із textContent = '+1'. Порядок дітей — як у HTML." }
>   - { set: { h1: "'1'" }, note: "JavaScript знаходить h1 через document.querySelector і пише h1.textContent = '1' — браузер одразу перемальовує екран." }
> ```

## 🔬 Як це працює

### 🧩 HTML + script

Створи на комп'ютері файл `index.html`, відкрий його в редакторі коду і встав:

```html
<!doctype html>
<html lang="uk">
  <head>
    <meta charset="utf-8">
    <title>Моя перша сторінка</title>
  </head>
  <body>
    <h1 id="title">Привіт!</h1>

    <script>
      console.log('Скрипт працює!')
    </script>
  </body>
</html>
```

Відкрий файл у браузері подвійним кліком, а потім консоль (`F12`) — там буде «Скрипт працює!».

Чому `<script>` — **у самому кінці** `<body>`? Браузер читає HTML згори донизу і виконує скрипт одразу, щойно до нього дійде. Якщо скрипт стоїть вище за кнопку, кнопки ще не існує — і знайти її неможливо. Для великих проєктів код виносять в окремий файл: `<script src="app.js" defer></script>` (`defer` = «виконай після того, як уся сторінка прочитана»).

> [!quiz] Перевір себе: чому скрипт зазвичай ставлять у кінець `<body>`?
> level: junior · id: jss-09-quiz-02
> - [ ] Так він завантажується швидше з інтернету
> - [x] Щоб на момент виконання всі елементи сторінки вже існували
> - [ ] Інакше браузер не покаже консоль
> - [ ] Так вимагає стандарт HTML
>
> **Пояснення:** браузер виконує скрипт, щойно до нього дочитав. Скрипт угорі не знайде елементів, які описані нижче, — `querySelector` поверне `null`.

### 🎯 Знайти елемент: querySelector

`document.querySelector(селектор)` повертає **перший** елемент, що відповідає CSS-селектору:

| Селектор | Знаходить | Приклад HTML |
|---|---|---|
| `'#title'` | елемент з `id="title"` | `<h1 id="title">` |
| `'.card'` | перший елемент з класом `card` | `<div class="card">` |
| `'button'` | перший тег `<button>` | `<button>` |

```js
const title = document.querySelector('#title')
const firstCard = document.querySelector('.card')
const allCards = document.querySelectorAll('.card') // усі — список, який можна перебрати for...of
```

Якщо нічого не знайдено, `querySelector` повертає `null`. Подальше `null.textContent` — це `TypeError: Cannot read properties of null`. Побачив таку помилку — перевір селектор і місце скрипта.

> [!quiz] Заповни пропуски: знайди елемент з id «price» і всі елементи з класом «item»
> level: junior · type: fill · id: jss-09-quiz-03
>
> ```js fill
> const price = document.[[querySelector]]('[[#]]price')
> const items = document.querySelectorAll('[[.]]item')
> ```
>
> **Пояснення:** `#` — це id, `.` — клас. Ті самі селектори, що й у CSS.

### ✏️ Змінити текст і класи

Знайдений елемент — це **обʼєкт** з властивостями, як у минулому розділі.

```js
const title = document.querySelector('#title')

title.textContent = 'Новий заголовок'   // замінити текст
title.classList.add('highlight')        // додати CSS-клас
title.classList.remove('hidden')        // прибрати клас
title.classList.toggle('dark')          // є — прибрати, немає — додати
```

Чому класи, а не `title.style.color = 'red'`? Вигляд краще тримати в CSS, а JavaScript лише перемикає «режими»: `.done`, `.active`, `.error`. Так дизайн і логіка не змішуються.

> [!warning] `textContent`, а не `innerHTML`
> `innerHTML` сприймає рядок як HTML-код. Якщо туди потрапить текст від користувача, він зможе «вставити» на сторінку власний скрипт (атака XSS). Для тексту завжди використовуй `textContent`.

> [!quiz] Перевір себе: що зробить `el.classList.toggle('done')`? Обери все правильне
> level: junior · type: multi · id: jss-09-quiz-04
> - [x] Додасть клас `done`, якщо його не було
> - [x] Прибере клас `done`, якщо він був
> - [ ] Видалить елемент зі сторінки
> - [ ] Змінить текст елемента на `'done'`
>
> **Пояснення:** `toggle` — перемикач: кожен виклик змінює наявність класу на протилежну. Ідеально для «виконано / не виконано».

### 🖱️ Події: addEventListener

Щоб сторінка реагувала на дії людини, «підпишися» на подію:

```js
const button = document.querySelector('#hello')

button.addEventListener('click', () => {
  console.log('Клік!')
})
```

Читається так: «кнопко, коли станеться `click`, виклич цю функцію». Ти **передаєш** функцію, а браузер викличе її сам — щоразу, коли натиснуть кнопку. Популярні події: `'click'`, `'input'` (змінився текст у полі), `'submit'` (відправили форму), `'keydown'` (натиснули клавішу).

Подія не зникає на кнопці: вона «спливає» вгору по дереву — до батька, дідуся і аж до `document`. Завдяки цьому один слухач на списку може ловити кліки по всіх його пунктах (це називають делегуванням). Подивись, як це виглядає:

> [!figure] event-bubbling
> scenario: delegation
>
> Клік по кнопці «спливає» від неї до списку. Детально — у [[JavaScript - 25. DOM і події]].

> [!quiz] Склади код: знайди кнопку і зміни заголовок по кліку
> level: junior · type: order · id: jss-09-quiz-05
>
> ```js order
> const title = document.querySelector('#title')
> const button = document.querySelector('#rename')
> button.addEventListener('click', () => {
>   title.textContent = 'Кнопку натиснуто!'
> })
> button.addEventListener('click', title.textContent = 'Кнопку натиснуто!') // ✗
> ```
>
> **Пояснення:** спершу знаходимо елементи, потім підписуємося. Другим аргументом `addEventListener` має бути **функція** — інакше код виконається одразу, а не по кліку.

### 🔢 Міні-проєкт 1: Лічильник кліків

Зберемо крок за кроком. Ціль — число на екрані, кнопки «+1» і «Скинути», а з 10 кліків число стає великим і зеленим.

**Крок 1. Розмітка і стилі.**

```html
<h1 id="count">0</h1>
<button id="plus">+1</button>
<button id="reset">Скинути</button>

<style>
  .big { font-size: 64px; color: green; }
</style>
```

**Крок 2. Знайти елементи** і створити **стан** — змінну, що зберігає дані програми:

```js
const countEl = document.querySelector('#count')
const plusBtn = document.querySelector('#plus')
const resetBtn = document.querySelector('#reset')
let count = 0
```

**Крок 3. Функція `render`** — «намалюй стан на екрані». Одна функція, яка оновлює все, що залежить від `count`:

```js
function render() {
  countEl.textContent = count
  countEl.classList.toggle('big', count >= 10) // другий аргумент: true — додати, false — прибрати
}
```

**Крок 4. Обробники кліків:** змінюємо стан → викликаємо `render`.

```js
plusBtn.addEventListener('click', () => {
  count++
  render()
})

resetBtn.addEventListener('click', () => {
  count = 0
  render()
})
```

**Крок 5.** Склади все в `index.html`: розмітка зверху, `<script>` з кодом кроків 2–4 — у кінці `<body>`. Відкрий у браузері й поклацай.

> [!diagram] Коло інтерфейсу: клік → стан → render → екран
> ```yaml
> layout: flow
> nodes:
>   - { id: click, label: "клік", text: "+1", tone: blue, icon: "px:cursor" }
>   - { id: handler, label: "обробник", code: "plusBtn.addEventListener('click', () => {\n  count++\n  render()\n})" }
>   - { id: state, label: "стан count", text: "0", tone: yellow, icon: "px:box" }
>   - { id: render, label: "render()", code: "countEl.textContent = count\ncountEl.classList.toggle('big', count >= 10)", tone: violet }
>   - { id: screen, label: "екран", text: "0", tone: green, icon: "px:monitor" }
> edges:
>   - { from: click, to: handler, label: "click" }
>   - { from: handler, to: state, label: "count++" }
>   - { from: state, to: render }
>   - { from: render, to: screen }
>   - { from: screen, to: click, label: "наступний клік", dashed: true }
> steps:
>   - { move: { from: click, to: handler, value: "click" }, line: "handler:1", note: "Користувач натискає «+1». Браузер помічає подію click і викликає нашу функцію-обробник." }
>   - { move: { from: handler, to: state, value: "count++" }, set: { state: "1" }, line: "handler:2", note: "Обробник не чіпає екран — він лише змінює стан: count було 0, стало 1." }
>   - { move: { from: state, to: render, value: "1" }, line: ["handler:3", "render:1"], note: "Потім обробник викликає render(): функція читає свіжий count." }
>   - { move: { from: render, to: screen, value: "1" }, set: { screen: "1" }, line: "render:1", note: "render записує count у textContent — на екрані тепер 1." }
>   - { set: { state: "10", screen: "10" }, line: "render:2", note: "Ще 9 кліків — те саме коло 9 разів. Коли count = 10, умова count >= 10 true, і render додає клас big." }
>   - { focus: [state, render, screen], note: "Головна ідея: стан → render → екран. Дані живуть у змінних, а екран лише показує їх." }
> ```

> [!important] Головна ідея інтерфейсів
> **Стан → render → екран.** Дані живуть у змінних, а екран лише показує їх. Так працюють і React, і Vue, і будь-який сучасний фреймворк — ти щойно написав його мініатюрну версію.

> [!quiz] Склади обробник кнопки «+1» у правильному порядку
> level: junior · type: order · id: jss-09-quiz-06
>
> ```text order
> Знайти кнопку через querySelector
> Підписатися на 'click' через addEventListener
> У функції-обробнику збільшити count
> Викликати render(), щоб оновити екран
> ```

### ✅ Міні-проєкт 2: Список справ

Поле вводу, кнопка «Додати» і список. Клік по справі — закреслити її.

**Крок 1. Розмітка:**

```html
<input id="todo-input" placeholder="Що зробити?">
<button id="add">Додати</button>
<ul id="list"></ul>

<style>
  .done { text-decoration: line-through; opacity: 0.5; }
</style>
```

**Крок 2. Знайти елементи:**

```js
const input = document.querySelector('#todo-input')
const addBtn = document.querySelector('#add')
const list = document.querySelector('#list')
```

**Крок 3. Додавання справи.** Новий елемент створюють через `document.createElement`, наповнюють і додають у список через `append`:

```js
addBtn.addEventListener('click', () => {
  const text = input.value.trim()    // value — текст у полі; trim прибирає пробіли з країв
  if (text === '') return            // порожнє не додаємо

  const li = document.createElement('li')
  li.textContent = text
  li.addEventListener('click', () => {
    li.classList.toggle('done')      // клік по справі — закреслити / повернути
  })

  list.append(li)
  input.value = ''                   // очистити поле
  input.focus()                      // і повернути в нього курсор
})
```

**Крок 4. Покращення для допитливих:** додай кнопку «🗑️» в кожен `li` (`li.remove()` видаляє елемент), лічильник «Залишилось: N» або додавання по `Enter` (подія `'keydown'` і перевірка `event.key === 'Enter'`).

> [!quiz] Заповни пропуски: створи пункт списку і додай його на сторінку
> level: junior · type: fill · id: jss-09-quiz-07
>
> ```js fill
> const li = document.[[createElement]]('li')
> li.[[textContent]] = 'Купити хліб'
> list.[[append]](li)
> ```
>
> **Пояснення:** елемент спершу створюють «у повітрі», наповнюють, а потім вставляють у сторінку — лише після `append` його видно.

## ⚠️ Пастки

> [!pitfall] Скрипт вище за елементи
> `<script>` у `<head>` без `defer` → `querySelector` повертає `null` → `TypeError: Cannot read properties of null`. Перенеси скрипт у кінець `<body>` або додай `defer`.

> [!pitfall] Виклик замість передачі функції
> `button.addEventListener('click', sayHi())` викликає `sayHi` **одразу** і передає її результат (`undefined`). Треба передати саму функцію: `addEventListener('click', sayHi)` або стрілку `() => sayHi()`.

> [!pitfall] Значення з поля — завжди рядок
> `input.value` — це текст, навіть якщо ввели `5`. Для обчислень: `Number(input.value)`.

> [!pitfall] Одруківка в селекторі
> `querySelector('count')` шукає **тег** `<count>`, а не id. Для id потрібна решітка: `'#count'`.

## 🎤 На співбесіді

> [!interview] Що таке DOM і як JavaScript змінює сторінку?
> level: junior · frequency: дуже часто · id: jss-09-int-01
>
> ---
>
> DOM (Document Object Model) — представлення HTML-сторінки у вигляді дерева обʼєктів, яке браузер створює під час розбору HTML. JavaScript працює з ним через обʼєкт `document`: знаходить вузли (`querySelector`, `querySelectorAll`), змінює їх (`textContent`, `classList`, атрибути), створює й вставляє нові (`createElement`, `append`) і реагує на дії користувача (`addEventListener`). Після змін браузер сам перемальовує сторінку.
>
> 📚 [[JavaScript Start - 09. Перша інтерактивна сторінка#🔬 Як це працює|Розділ: DOM]] · [MDN: Manipulating documents](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting) · [[JavaScript - 25. DOM і події|Глибокий розділ: DOM і події]]

## 🔗 Зв'язки

- [[JavaScript Start - 06. Функції]] — обробник події — це звичайна функція, яку викликає браузер.
- [[JavaScript Start - 08. Обʼєкти]] — елементи DOM — обʼєкти з властивостями.
- [[JavaScript Start - 10. Як думати як програміст]] — як дебажити, коли кнопка «нічого не робить».
- [[JavaScript - 25. DOM і події]] — спливання, делегування, `MutationObserver` і більше.

## ⚡ Фішки

> [!reel] ⚡ HTML — стіни, CSS — ремонт, JS — електрика
> HTML каже, що є на сторінці. CSS — як воно виглядає. JavaScript — що відбувається, коли натискаєш.

> [!reel] 🎯 querySelector розуміє CSS
> `'#id'`, `'.class'`, `'ul li:first-child'` — будь-який CSS-селектор. Знаєш CSS — вже вмієш шукати елементи.

> [!reel] 🔁 Стан → render → екран
> Тримай дані у змінних, а екран оновлюй однією функцією `render()`. Це серце React, Vue і Svelte у мініатюрі.

> [!reel] 🛡️ textContent безпечніший за innerHTML
> `innerHTML` виконує розмітку з рядка — і зловмисний текст користувача може стати скриптом. `textContent` вставляє лише текст.

> [!reel] 🫧 Подія спливає
> Клік по кнопці всередині списку «бачать» і кнопка, і список, і `document`. Один слухач на батькові може обслужити сотні дітей.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке DOM?
> *дуже часто · теорія* · `jss-09-001`
>
> Дерево обʼєктів, яке браузер будує з HTML. Через обʼєкт `document` JavaScript читає і змінює сторінку.
>
> 📚 [[JavaScript Start - 09. Перша інтерактивна сторінка#🧒 Простими словами|Розділ: DOM]] · [MDN: Manipulating documents](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting)

> [!question]- Як знайти елемент з `id="price"`?
> *дуже часто · код* · `jss-09-002`
>
> `document.querySelector('#price')`. Для класу — `'.назва'`, для всіх збігів — `querySelectorAll`.
>
> 📚 [[JavaScript Start - 09. Перша інтерактивна сторінка#🎯 Знайти елемент: querySelector|Розділ: querySelector]] · [MDN: querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

> [!question]- Що поверне `querySelector`, якщо нічого не знайдено?
> *часто · код* · `jss-09-003`
>
> `null`. Спроба взяти в нього властивість дасть `TypeError: Cannot read properties of null`.
>
> 📚 [[JavaScript Start - 09. Перша інтерактивна сторінка#🎯 Знайти елемент: querySelector|Розділ: querySelector]] · [javascript.info: Searching: getElement*, querySelector*](https://javascript.info/searching-elements-dom)

> [!question]- Як змінити текст елемента?
> *дуже часто · код* · `jss-09-004`
>
> `el.textContent = 'новий текст'`. Для тексту від користувача — лише `textContent`, не `innerHTML`.
>
> 📚 [[JavaScript Start - 09. Перша інтерактивна сторінка#✏️ Змінити текст і класи|Розділ: текст і класи]] · [MDN: textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

> [!question]- Як додати, прибрати й перемкнути CSS-клас?
> *часто · код* · `jss-09-005`
>
> `el.classList.add('x')`, `el.classList.remove('x')`, `el.classList.toggle('x')`.
>
> 📚 [[JavaScript Start - 09. Перша інтерактивна сторінка#✏️ Змінити текст і класи|Розділ: текст і класи]] · [MDN: classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

> [!question]- Як відреагувати на клік по кнопці?
> *дуже часто · код* · `jss-09-006`
>
> `button.addEventListener('click', () => { … })` — передаємо функцію, яку браузер викличе при кожному кліку.
>
> 📚 [[JavaScript Start - 09. Перша інтерактивна сторінка#🖱️ Події: addEventListener|Розділ: події]] · [MDN: addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) · [javascript.info: Introduction to browser events](https://javascript.info/introduction-browser-events)

> [!question]- Як створити новий елемент і додати його на сторінку?
> *часто · код* · `jss-09-007`
>
> `const li = document.createElement('li')`, наповнити (`li.textContent = …`), вставити: `list.append(li)`.
>
> 📚 [[JavaScript Start - 09. Перша інтерактивна сторінка#✅ Міні-проєкт 2: Список справ|Розділ: список справ]] · [MDN: createElement()](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)

> [!question]- Чому скрипт у `<head>` може не знайти кнопку?
> *часто · практика* · `jss-09-008`
>
> Браузер виконує скрипт, щойно до нього дочитав, і кнопки нижче ще немає в DOM. Рішення: скрипт у кінці `<body>` або атрибут `defer`.
>
> 📚 [[JavaScript Start - 09. Перша інтерактивна сторінка#🧩 HTML + script|Розділ: HTML + script]] · [MDN: script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)

> [!question]- Що таке підхід «стан → render»?
> *іноді · теорія* · `jss-09-009`
>
> Дані інтерфейсу зберігаються у змінних (стан), а одна функція `render` оновлює екран за станом. Обробник подій лише змінює стан і викликає `render`. Так побудовані React, Vue та інші фреймворки.
>
> 📚 [[JavaScript Start - 09. Перша інтерактивна сторінка#🔢 Міні-проєкт 1: Лічильник кліків|Розділ: лічильник]] · [MDN: Introduction to events](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events)

## 🛠️ Практика

> [!note] Чому в задачах немає `document`
> Тести запускаються в ізольованій пісочниці без сторінки. Тому тут ти пишеш **логіку** проєктів — чисті функції, що працюють з даними. Це не обхідний маневр, а хороша практика: логіку легко тестувати, а DOM-код лише показує її результат. Для `toggle`, `addTodo` і `toggleTodo` повертай **новий** масив і не змінюй вхідний.

> [!task] Підпис лічильника
> level: junior · difficulty: easy · id: jss-09-task-01 · tags: dom-logic, strings
>
> Для лічильника кліків: `formatCount(n)` повертає `'Кліків: <n>'`.
>
> ```js starter
> function formatCount(n) {
>   return n
> }
> ```
>
> ```js tests
> test('0', () => { expect(formatCount(0)).toBe('Кліків: 0') })
> test('42', () => { expect(formatCount(42)).toBe('Кліків: 42') })
> ```
>
> > [!hint]- Підказка 1
> > Шаблонний рядок з розділу 2.
>
> > [!solution]- Рішення
> > ```js
> > function formatCount(n) {
> >   return `Кліків: ${n}`
> > }
> > ```
> >
> > На сторінці: `countEl.textContent = formatCount(count)`.

> [!task] Свій classList.toggle
> level: junior · difficulty: easy · id: jss-09-task-02 · tags: dom-logic, arrays
>
> Класи елемента — це масив рядків. `toggle(classes, name)` повертає **новий** масив: якщо `name` був — без нього, якщо не було — з ним у кінці.
>
> ```js starter
> function toggle(classes, name) {
>   return classes
> }
> ```
>
> ```js tests
> test('додає відсутній', () => { expect(toggle(['card'], 'done')).toEqual(['card', 'done']) })
> test('прибирає наявний', () => { expect(toggle(['card', 'done'], 'done')).toEqual(['card']) })
> test('не змінює оригінал', () => {
>   const input = ['a']
>   toggle(input, 'b')
>   expect(input).toEqual(['a'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Перевір наявність через `classes.includes(name)`.
>
> > [!hint]- Підказка 2
> > Прибрати — `classes.filter((c) => c !== name)`. Додати, не змінюючи оригінал, — `[...classes, name]` (spread копіює елементи в новий масив).
>
> > [!solution]- Рішення
> > ```js
> > function toggle(classes, name) {
> >   if (classes.includes(name)) {
> >     return classes.filter((c) => c !== name)
> >   }
> >   return [...classes, name]
> > }
> > ```

> [!task] Додати справу
> level: junior · difficulty: easy · id: jss-09-task-03 · tags: dom-logic, objects, arrays
>
> Список справ — масив обʼєктів `{ text, done }`. `addTodo(todos, text)` повертає новий масив із новою справою `{ text, done: false }` у кінці. Пробіли з країв прибери (`text.trim()`), а порожній текст не додавай — поверни список без змін.
>
> ```js starter
> function addTodo(todos, text) {
>   todos.push(text)
>   return todos
> }
> ```
>
> ```js tests
> test('додає справу', () => { expect(addTodo([], 'Купити хліб')).toEqual([{ text: 'Купити хліб', done: false }]) })
> test('обрізає пробіли', () => { expect(addTodo([], '  Біг  ')).toEqual([{ text: 'Біг', done: false }]) })
> test('порожнє не додає', () => { expect(addTodo([], '   ')).toEqual([]) })
> test('не змінює оригінал', () => {
>   const todos = []
>   addTodo(todos, 'X')
>   expect(todos).toEqual([])
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу `const clean = text.trim()` і `if (clean === '') return todos`.
>
> > [!hint]- Підказка 2
> > Новий масив з новим елементом: `[...todos, { text: clean, done: false }]`.
>
> > [!solution]- Рішення
> > ```js
> > function addTodo(todos, text) {
> >   const clean = text.trim()
> >   if (clean === '') return todos
> >   return [...todos, { text: clean, done: false }]
> > }
> > ```

> [!task] Позначити справу виконаною
> level: junior · difficulty: medium · id: jss-09-task-04 · tags: dom-logic, map
>
> `toggleTodo(todos, index)` повертає новий масив, де в справи з номером `index` значення `done` змінено на протилежне. Решта — без змін.
>
> ```js starter
> function toggleTodo(todos, index) {
>   return todos
> }
> ```
>
> ```js tests
> test('перемикає потрібну', () => {
>   const todos = [{ text: 'A', done: false }, { text: 'B', done: false }]
>   expect(toggleTodo(todos, 1)).toEqual([{ text: 'A', done: false }, { text: 'B', done: true }])
> })
> test('знімає позначку', () => { expect(toggleTodo([{ text: 'A', done: true }], 0)).toEqual([{ text: 'A', done: false }]) })
> test('не змінює оригінал', () => {
>   const todos = [{ text: 'A', done: false }]
>   toggleTodo(todos, 0)
>   expect(todos[0].done).toBe(false)
> })
> ```
>
> > [!hint]- Підказка 1
> > `map` передає у функцію другим аргументом індекс: `todos.map((todo, i) => …)`.
>
> > [!hint]- Підказка 2
> > Для потрібного індексу поверни **новий** обʼєкт: `{ text: todo.text, done: !todo.done }`. Для інших — `todo` як є.
>
> > [!solution]- Рішення
> > ```js
> > function toggleTodo(todos, index) {
> >   return todos.map((todo, i) => {
> >     if (i !== index) return todo
> >     return { text: todo.text, done: !todo.done }
> >   })
> > }
> > ```
> >
> > Змінювати `todo.done = …` напряму не можна: обʼєкт спільний з оригінальним масивом (згадай посилання з розділу 8).

> [!task] Скільки залишилось
> level: junior · difficulty: medium · id: jss-09-task-05 · tags: dom-logic, filter
>
> `remainingLabel(todos)` повертає `'Залишилось: N'`, де N — кількість невиконаних справ, а якщо все виконано (або список порожній) — `'Все зроблено! 🎉'`.
>
> ```js starter
> function remainingLabel(todos) {
>   return ''
> }
> ```
>
> ```js tests
> test('дві невиконані', () => {
>   const todos = [{ text: 'A', done: false }, { text: 'B', done: true }, { text: 'C', done: false }]
>   expect(remainingLabel(todos)).toBe('Залишилось: 2')
> })
> test('усе виконано', () => { expect(remainingLabel([{ text: 'A', done: true }])).toBe('Все зроблено! 🎉') })
> test('порожній список', () => { expect(remainingLabel([])).toBe('Все зроблено! 🎉') })
> ```
>
> > [!hint]- Підказка 1
> > Невиконані: `todos.filter((t) => !t.done)`, а їхня кількість — `.length`.
>
> > [!solution]- Рішення
> > ```js
> > function remainingLabel(todos) {
> >   const left = todos.filter((t) => !t.done).length
> >   return left === 0 ? 'Все зроблено! 🎉' : `Залишилось: ${left}`
> > }
> > ```

## 📚 Джерела та що почитати

- 🟢 [MDN — Manipulating documents](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting) — DOM для початківців з міні-проєктом списку покупок.
- 🟢 [MDN — Introduction to events](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events) — події, обробники, обʼєкт події.
- 🟢 [javascript.info — Searching: getElement*, querySelector*](https://javascript.info/searching-elements-dom) — усі способи знайти елементи.
- 🟢 [javascript.info — Introduction to browser events](https://javascript.info/introduction-browser-events) — `addEventListener` і обробники.
- 🟡 [javascript.info — Node properties: type, tag and contents](https://javascript.info/basic-dom-node-properties) — `textContent`, `innerHTML` і різниця між ними.
- 🟡 [MDN — addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) — довідник з опціями.
- 🟡 [MDN — Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) — `add`, `remove`, `toggle`, `contains`.
- 🟡 [MDN — The Script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script) — `defer`, `src` та інші атрибути.

> [!important] Підсумок
> - `<script>` у кінці `<body>` (або з `defer`), щоб елементи вже існували.
> - `document.querySelector('#id' | '.class' | 'tag')` знаходить елемент або повертає `null`.
> - `textContent` змінює текст, `classList.add/remove/toggle` — класи; вигляд — у CSS.
> - `el.addEventListener('click', функція)` — передаємо функцію, а не викликаємо її.
> - Стан у змінних → `render()` → екран: так побудовані і лічильник, і список справ, і великі фреймворки.
