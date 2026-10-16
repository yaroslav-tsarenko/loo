---
title: DOM і події
order: 25
level: middle
tags: [dom, events, browser, delegation, mutation-observer]
prerequisites:
  - "[[JavaScript - 06. this]]"
  - "[[JavaScript - 08. Event Loop]]"
estimatedMinutes: 50
id: jsd-ch-25
icon: "🖱️"
---

# DOM і події

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити, що таке DOM-дерево, які бувають вузли і чим live-колекція відрізняється від static;
> - ефективно й безпечно змінювати DOM: `DocumentFragment`, `insertAdjacentHTML`, `textContent` проти `innerHTML`;
> - відрізнити атрибут від властивості (`value`, `checked`, `href`, `dataset`);
> - передбачити порядок обробників у фазах capture → target → bubble і різницю між `preventDefault` і `stopPropagation`;
> - використати опції `once`, `passive`, `capture`, `signal`, делегування, власні події та `MutationObserver`.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-25-quiz-01
>
> ```js
> // <div id="outer"><button id="btn">OK</button></div>
> outer.addEventListener('click', () => console.log('outer bubble'));
> outer.addEventListener('click', () => console.log('outer capture'), true);
> btn.addEventListener('click', () => console.log('btn'));
> btn.click();
> ```
>
> **Відповідь:** `outer capture btn outer bubble`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Подія спершу «спускається» від `window` до цілі (capture), потім спрацьовує на самій цілі, а потім «спливає» назад (bubble). Порядок реєстрації обробників на різних елементах не важливий — важлива фаза.

## 🧒 Простими словами

DOM — це родинне дерево сторінки: `<html>` — прабабуся, `<body>` — бабуся, кнопка — онука. JavaScript може знайти будь-кого в цьому дереві, переселити, перейменувати чи народити нового. Подія — це новина. Коли онуку клікнули, новина спершу йде **згори вниз** по родині («увага, зараз щось станеться з онукою» — capture), потім доходить до самої онуки (target) і **піднімається назад** до прабабусі (bubble). Будь-хто по дорозі може відреагувати, зупинити плітку далі (`stopPropagation`) або скасувати «звичну реакцію» — наприклад, щоб посилання не відкрилось (`preventDefault`). Делегування — це коли замість того, щоб наймати охоронця кожній онуці, ти ставиш одного біля дверей бабусі.

## 🔬 Як це працює насправді

### 🌳 Дерево, вузли й пошук

DOM (Document Object Model, WHATWG DOM Standard) — дерево **вузлів** (`Node`), яке браузер будує з HTML. Не всі вузли — елементи:

> [!diagram] DOM: не всі вузли — елементи
> ```yaml
> layout: tree
> nodes:
>   - { id: doc, label: "DOCUMENT_NODE = 9", text: document, tone: gray, icon: "px:file" }
>   - { id: ul, label: "ELEMENT_NODE = 1", code: "<ul id=\"list\">", parent: doc, tone: violet }
>   - { id: t1, label: "TEXT_NODE = 3", code: "\"\\n  \"", note: "пробіли й переноси", parent: ul, tone: yellow }
>   - { id: li1, label: ELEMENT_NODE, code: "<li>a</li>", parent: ul, tone: blue }
>   - { id: t2, label: TEXT_NODE, code: "\"\\n  \"", parent: ul, tone: yellow }
>   - { id: cm, label: "COMMENT_NODE = 8", code: "<!-- note -->", parent: ul, tone: gray }
>   - { id: li2, label: ELEMENT_NODE, code: "<li>b</li>", parent: ul, tone: blue }
> steps:
>   - { show: [doc, ul], note: "Браузер будує з HTML дерево вузлів. Корінь — document, у ньому елемент <ul id=\"list\">." }
>   - { show: [li1, li2], note: "Очікувано: два елементи <li>. Саме їх і поверне list.children — довжина 2." }
>   - { show: [t1, t2], note: "Але переноси рядків і відступи між тегами — теж вузли, текстові (TEXT_NODE = 3)." }
>   - { show: cm, note: "І коментар — окремий вузол COMMENT_NODE = 8." }
>   - { focus: [t1, li1, t2, cm, li2], note: "Тому list.childNodes довший за list.children, а firstChild — текстовий вузол. Для елементів є firstElementChild." }
> ```

Тому `list.childNodes` (усі вузли) і `list.children` (лише елементи) мають різну довжину, а `firstChild` часто — текстовий вузол. Для елементів є окремі `firstElementChild`, `nextElementSibling` тощо.

**Пошук:** `querySelector`/`querySelectorAll` (CSS-селектори), `getElementById`, `closest(sel)` (найближчий предок, включно з собою), `matches(sel)`.

**Live vs static.** `querySelectorAll` повертає **статичний** `NodeList` — знімок на момент виклику. `getElementsByClassName`/`getElementsByTagName`/`children` — **живі** `HTMLCollection`, що автоматично оновлюються при зміні DOM. `childNodes` — живий `NodeList`.

```js
// <li class="item">×3
const live = document.getElementsByClassName('item');
for (let i = 0; i < live.length; i++) live[i].classList.remove('item');
document.querySelectorAll('.item').length; // → 1 😬
```

Знімаючи клас, ми видаляємо елемент із живої колекції — індекси зсуваються, і кожен другий пропускається. Ліки: `for (const el of [...live])` або static `querySelectorAll`.

> [!quiz] Перевір себе: live чи static?
> level: middle · type: multi · id: jsd-25-quiz-02
>
> Які колекції **оновлюються автоматично** після зміни DOM?
>
> - [x] `document.getElementsByTagName('li')`
> - [ ] `document.querySelectorAll('li')`
> - [x] `ul.children`
> - [x] `ul.childNodes`
>
> **Пояснення:** `querySelectorAll` — єдиний тут статичний знімок. `getElementsBy*` і `children` — живі `HTMLCollection`, `childNodes` — живий `NodeList`.

### 🏗️ Створення й оновлення DOM

Сучасний набір методів: `append`/`prepend` (кілька вузлів і рядків), `before`/`after`, `replaceWith`, `replaceChildren`, `remove()`. Кожна вставка в «живий» документ може змусити браузер перерахувати стилі й layout, тож **групуй зміни**:

```js
const frag = document.createDocumentFragment();
for (const name of ['Київ', 'Львів', 'Одеса']) {
  const li = document.createElement('li');
  li.textContent = name;
  frag.append(li);
}
list.append(frag); // одна вставка; fragment після неї порожній
```

`DocumentFragment` — легкий контейнер поза документом: при вставці переносяться його **діти**, а не він сам. `<template>` дає те саме з розмітки: `template.content.cloneNode(true)`.

`insertAdjacentHTML(position, html)` парсить рядок і вставляє **без** перезапису сусідів (на відміну від `innerHTML +=`, який перестворює все й губить обробники):

```text
<!-- beforebegin -->
<ul>
  <!-- afterbegin -->
  …
  <!-- beforeend -->
</ul>
<!-- afterend -->
```

| Властивість | Читає | Записує | Безпека |
|---|---|---|---|
| `textContent` | увесь текст, включно з прихованим | текст як є | ✅ безпечно |
| `innerText` | лише **видимий** текст (потребує layout!) | текст | ✅, але повільніше |
| `innerHTML` | HTML-рядок | **парсить HTML** | ❌ XSS з ненадійними даними |

```js
const box = document.createElement('div');
box.innerHTML = `<img src=x onerror="alert('XSS')">`; // спрацює, навіть не вставлений у сторінку!
box.textContent = '<b>hi</b>'; // покаже текст «<b>hi</b>», жодних тегів
```

`<script>`, вставлений через `innerHTML`, не виконується, але атрибути-обробники (`onerror`, `onload`) — так. Для користувацьких даних — **лише `textContent`** або екранування/санітизація (див. [[JavaScript - 30. Безпека в JavaScript]]).

> [!quiz] Перевір себе: що безпечно?
> level: junior · id: jsd-25-quiz-03
>
> Треба вивести ім'я користувача з бекенда в `<span>`. Що обрати?
>
> - [ ] `span.innerHTML = user.name`
> - [x] `span.textContent = user.name`
> - [ ] `span.insertAdjacentHTML('beforeend', user.name)`
> - [ ] `span.outerHTML = '<span>' + user.name + '</span>'`
>
> **Пояснення:** усі варіанти, крім `textContent`, парсять рядок як HTML — ім'я `<img src=x onerror=…>` виконає код. `textContent` вставляє текстовий вузол.

### 🏷️ Атрибути проти властивостей

**Атрибут** — те, що написано в HTML (`getAttribute`, завжди рядок). **Властивість** — поле JS-об'єкта елемента (будь-який тип). Для багатьох вони синхронізовані (`id`, `className` ↔ `class`), але є важливі винятки:

| Що | Атрибут | Властивість |
|---|---|---|
| `<input value>` | **початкове** значення | **поточне** значення; початкове — `defaultValue` |
| `<input checked>` | початковий стан | `checked` — поточний; `defaultChecked` — атрибут |
| `<a href="/x">` | `"/x"` як написано | абсолютний URL `"https://site/x"` |
| `data-user-id` | рядок | `el.dataset.userId` (camelCase) |
| `class` | `"a b"` | `className` / зручний `classList` |
| булеві (`hidden`, `disabled`) | присутність = `true`, навіть `hidden="false"` | `el.hidden` — `boolean` |

```js
// <input id="inp" value="початкове">
inp.value = 'нове'; // або користувач надрукував
console.log(inp.getAttribute('value'), inp.value, inp.defaultValue);
// → початкове нове початкове
```

> [!quiz] Перевір себе: булевий атрибут
> level: middle · id: jsd-25-quiz-04
>
> Що поверне `el.hidden` після `el.setAttribute('hidden', 'false')`?
>
> - [ ] `false`
> - [x] `true`
> - [ ] `'false'`
>
> **Пояснення:** для булевих атрибутів важлива лише **присутність**. Щоб показати елемент — `el.hidden = false` або `removeAttribute('hidden')`.

### 🌊 Потік подій — capture, target, bubble

Коли подія відбувається на елементі, DOM будує **шлях** від `window` до цілі й проходить його тричі:

> [!viz] event-propagation
> scenario: capture-bubble

> [!diagram] Потік події: capture → target → bubble
> ```yaml
> layout: stack
> nodes:
>   - { id: win, text: window, tone: gray }
>   - { id: doc, text: document, tone: gray }
>   - { id: body, code: "<body>", tone: gray }
>   - { id: outer, label: "<div#outer>", code: "// capture: true\nconsole.log('outer capture')\n// звичайний (bubble)\nconsole.log('outer bubble')", tone: violet }
>   - { id: btn, label: "<button#btn> — ціль", code: "console.log('btn')", tone: blue, icon: "px:cursor" }
>   - { id: log, label: консоль, text: "—", tone: green }
> edges:
>   - { from: win, to: doc }
>   - { from: doc, to: body }
>   - { from: body, to: outer }
>   - { from: outer, to: btn }
> steps:
>   - { focus: btn, note: "btn.click(): подія сталася на кнопці. Але спершу DOM будує шлях від window до цілі." }
>   - { move: [{ from: win, to: doc, value: "click ↓" }, { from: doc, to: body, value: "click ↓" }], note: "Фаза 1 — CAPTURE: подія спускається згори вниз через window, document, body." }
>   - { move: { from: body, to: outer, value: "capture" }, line: "outer:2", set: { log: "outer capture" }, note: "На div#outer є обробник з capture: true — він спрацьовує першим, ще на шляху вниз." }
>   - { move: { from: outer, to: btn, value: "click ↓" }, line: "btn:1", set: { log: "outer capture · btn" }, note: "Фаза 2 — AT_TARGET: подія на самій кнопці, event.target === btn." }
>   - { move: { from: btn, to: outer, value: "bubble ↑" }, line: "outer:4", set: { log: "outer capture · btn · outer bubble" }, note: "Фаза 3 — BUBBLE: подія спливає назад, і спрацьовує звичайний обробник outer." }
>   - { move: [{ from: outer, to: body, value: "↑" }, { from: body, to: doc, value: "↑" }, { from: doc, to: win, value: "↑" }], note: "Далі — вгору до window. Будь-хто на шляху може зупинити рух через stopPropagation()." }
> ```

- `event.target` — де подія сталася (кнопка), `event.currentTarget` — чий обробник зараз виконується; `event.eventPhase` — 1, 2 або 3.
- Не всі події спливають: `focus`/`blur`, `mouseenter`/`mouseleave`, `load` на ресурсах — ні (їхні пари `focusin`/`focusout`, `mouseover`/`mouseout` — так). Перевірка: `event.bubbles`.

Три різні «стоп-крани»:

| Метод | Що зупиняє |
|---|---|
| `stopPropagation()` | рух до **інших елементів**; решта обробників на поточному елементі виконаються |
| `stopImmediatePropagation()` | і рух, і **решту обробників** на цьому ж елементі |
| `preventDefault()` | **дію браузера за замовчуванням** (перехід за посиланням, submit, прокрутку), а не поширення; лише якщо `cancelable` |

Повернення `false` працює як `preventDefault()` лише для обробників-властивостей (`a.onclick = () => false`); в `addEventListener` воно ігнорується.

> [!quiz] Перевір себе: stopPropagation
> level: middle · type: output · id: jsd-25-quiz-05
>
> ```js
> // <div id="x"><span id="y"></span></div>
> y.addEventListener('ping', (e) => { console.log('y1'); e.stopPropagation(); });
> y.addEventListener('ping', () => console.log('y2'));
> x.addEventListener('ping', () => console.log('x'));
> y.dispatchEvent(new Event('ping', { bubbles: true }));
> ```
>
> **Відповідь:** `y1 y2`
>
> **Пояснення:** `stopPropagation` не дає події піти до `x`, але інші обробники на `y` ще виконаються. З `stopImmediatePropagation` був би лише `y1`.

### ⚙️ addEventListener і його опції

`target.addEventListener(type, listener, options)`, де `options` — `boolean` (`capture`) або об'єкт:

| Опція | Що робить |
|---|---|
| `capture: true` | слухати у фазі capture |
| `once: true` | автоматично зняти після першого виклику |
| `passive: true` | обіцянка «не викличу `preventDefault()`» — браузер може скролити, не чекаючи JS |
| `signal` | `AbortSignal`: `controller.abort()` знімає **всі** слухачі з цим сигналом |

```js
const controller = new AbortController();
window.addEventListener('resize', onResize, { signal: controller.signal });
window.addEventListener('scroll', onScroll, { signal: controller.signal, passive: true });
document.addEventListener('keydown', onKey, { signal: controller.signal });
// при знищенні компонента — одним рядком:
controller.abort();
```

Деталі: той самий `listener` з тією самою `capture` двічі не додається; `removeEventListener` потребує **ту саму функцію** й те саме значення `capture` (анонімну стрілку зняти неможливо — звідси популярність `signal`). У `passive`-обробнику `preventDefault()` ігнорується (Chrome попередить у консолі); для `touchstart`/`touchmove`/`wheel` на `window`, `document` і `body` браузери вмикають `passive` за замовчуванням.

> [!quiz] Перевір себе: чому слухач не знімається?
> level: middle · id: jsd-25-quiz-06
>
> ```js
> btn.addEventListener('click', () => save(), { capture: true });
> btn.removeEventListener('click', () => save(), { capture: true });
> ```
>
> - [ ] Бо `capture` у `removeEventListener` треба передавати як `true`, а не об'єктом
> - [x] Бо це дві різні функції — посилання не збігаються
> - [ ] Слухач знімається, все гаразд
>
> **Пояснення:** кожна стрілка — новий об'єкт-функція. Збережи функцію в змінну або використовуй `{ signal }`.

> [!quiz] Заповни пропуски: слухачі, які знімаються одним рядком
> level: middle · type: fill · id: jsd-25-quiz-10 · bank: capture, removeEventListener, stop
>
> ```js fill
> const controller = new [[AbortController]]()
> window.addEventListener('scroll', onScroll, { signal: controller.[[signal]], [[passive]]: true })
> button.addEventListener('click', onFirstClick, { [[once]]: true })
> // при знищенні компонента:
> controller.[[abort]]()
> ```
>
> **Пояснення:** `signal` знімає всі слухачі з цим сигналом після `abort()`, `passive: true` обіцяє не викликати `preventDefault()` — браузер скролить без очікування JS, а `once` знімає слухача після першого виклику.

### 🎯 Делегування подій

Замість обробника на кожному з 1000 рядків — **один** на спільному предку. Спливання донесе подію, а `closest` знайде, хто саме цікавий:

> [!viz] event-propagation
> scenario: delegation

```js
list.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button || !list.contains(button)) return; // клік повз кнопки або поза списком
  const row = button.closest('li');
  if (button.dataset.action === 'delete') row.remove();
});
```

Переваги: менше пам'яті й підписок; працює для елементів, доданих **пізніше**; один `signal` для зняття. Обмеження: подія мусить спливати (для фокусу — `focusin`/`focusout`); `stopPropagation` усередині дочірнього компонента «зламає» делегування; `event.target` може бути вкладеним `<span>` або `<svg>` — тому `closest`, а не порівняння `target` напряму.

> [!figure] event-bubbling
> scenario: delegation
>
> Клік по ✕ спускається від `window` до кнопки (capture), а потім спливає назад — і спрацьовує єдиний слухач на `<ul>`. Новий пункт обробляється без нового слухача.

> [!quiz] Перевір себе: навіщо closest?
> level: junior · id: jsd-25-quiz-07
>
> Кнопка `<button data-action="delete"><svg>…</svg> Видалити</button>`. Чому в делегованому обробнику не можна просто перевіряти `event.target.dataset.action`?
>
> - [ ] `dataset` не працює в делегуванні
> - [x] Клік по іконці дає `target` = `<svg>`/`<path>`, а не кнопку
> - [ ] `event.target` у делегуванні завжди дорівнює `currentTarget`
>
> **Пояснення:** `target` — найглибший елемент під курсором. `closest('[data-action]')` піднімається до потрібного предка.

> [!quiz] Склади делегований обробник видалення рядків
> level: middle · type: order · id: jsd-25-quiz-11
>
> ```js order
> list.addEventListener('click', (event) => {
>   const button = event.target.closest('button[data-action]')
>   if (!button || !list.contains(button)) return
>   if (button.dataset.action === 'delete') {
>     button.closest('li').remove()
>   }
> })
>   if (event.target.dataset.action === 'delete') { // ✗
> ```
>
> **Пояснення:** один слухач на контейнері ловить кліки по всіх рядках, навіть доданих пізніше. `closest` піднімається від найглибшого елемента (іконки, `<span>`) до кнопки, а `contains` відсікає збіги поза списком. Перевірка `event.target.dataset` ламається, щойно клікнули по іконці.

### 📣 Власні події, фокус і клавіатура

**Власні події** — спосіб компонентам спілкуватися без жорстких залежностей:

```js
item.addEventListener('cart:add', (e) => console.log('got', e.detail.id));
console.log('before');
item.dispatchEvent(new CustomEvent('cart:add', {
  detail: { id: 7 },
  bubbles: true,     // за замовчуванням false!
  cancelable: true,  // щоб слухач міг preventDefault()
}));
console.log('after');
// → before, got 7, after
```

Важливо: `dispatchEvent` **синхронний** — усі слухачі виконуються до наступного рядка (це не задача в event loop). Повертає `false`, якщо хтось викликав `preventDefault()`. `composed: true` дозволяє події вийти за межі Shadow DOM.

**Фокус:** `focus`/`blur` не спливають, `focusin`/`focusout` — спливають (для делегування на формі). `document.activeElement` — поточний фокус; `:focus-visible` — показувати рамку лише при навігації з клавіатури.

**Клавіатура:** слухай `keydown` (`keypress` застарів). `event.key` — **символ** з урахуванням розкладки (`'ф'`, `'Enter'`), `event.code` — **фізична клавіша** (`'KeyA'`) — для ігор і хоткеїв, що не залежать від мови. Під час введення через IME `event.isComposing === true` — не обробляй Enter як «надіслати». Для змін тексту надійніше `input`/`beforeinput`, ніж клавіатурні події.

> [!quiz] Перевір себе: синхронний dispatch
> level: middle · type: output · id: jsd-25-quiz-08
>
> ```js
> el.addEventListener('hello', () => console.log('B'));
> console.log('A');
> el.dispatchEvent(new Event('hello'));
> Promise.resolve().then(() => console.log('D'));
> console.log('C');
> ```
>
> **Відповідь:** `A B C D`
>
> **Пояснення:** `dispatchEvent` викликає слухачів одразу, як звичайну функцію. `D` — microtask, що виконається після синхронного коду.

### 👀 MutationObserver

`MutationObserver` асинхронно повідомляє про зміни DOM — пачкою, як **microtask** (див. [[JavaScript - 08. Event Loop]]):

```js
const mo = new MutationObserver((records) => {
  console.log('MO', records.map((r) => r.type).join(','));
});
mo.observe(list, { childList: true, attributes: true, subtree: true });

list.append(document.createElement('li'));
list.setAttribute('data-x', '1');
list.firstElementChild.remove();
console.log('sync done');
// → sync done
// → MO childList,attributes,childList   ← три зміни, ОДИН виклик
```

Опції: `childList`, `attributes` (+ `attributeFilter`, `attributeOldValue`), `characterData`, `subtree`. `disconnect()` зупиняє спостереження, `takeRecords()` забирає ще не доставлені записи. Застосування: реагувати на DOM, який змінює сторонній код (віджети, розширення), автоініціалізація компонентів, undo-історія в редакторах. Для розміру й видимості є спеціалізовані `ResizeObserver` та `IntersectionObserver` ([[JavaScript - 28. Сховища та Web APIs]]).

> [!quiz] Перевір себе: коли спрацює MutationObserver?
> level: senior · id: jsd-25-quiz-09
>
> - [ ] Синхронно, одразу після кожної зміни DOM
> - [x] Один раз після поточного синхронного коду, як microtask, з усіма змінами
> - [ ] У наступному кадрі, разом із `requestAnimationFrame`
> - [ ] Як окрема задача, після `setTimeout(0)`
>
> **Пояснення:** записи накопичуються, а callback ставиться в чергу microtasks. Старі Mutation Events (`DOMNodeInserted`) були синхронними і гальмували сторінку — їх прибрали з браузерів.

## ⚠️ Пастки

> [!pitfall] `innerHTML +=` у циклі
> ```js
> for (const item of items) list.innerHTML += `<li>${item}</li>`;
> ```
>
> Кожна ітерація серіалізує й перепарсює **весь** список, знищує старі вузли (з їхніми обробниками й станом фокусу) — O(n²) і XSS-ризик. Будуй `DocumentFragment` або один рядок і вставляй раз.

> [!pitfall] `this` в обробнику-стрілці
> У `function`-обробнику `this === event.currentTarget`, у стрілці — `this` із зовнішнього scope. Не покладайся на `this`, використовуй `event.currentTarget` — див. [[JavaScript - 06. this]].

> [!pitfall] `el.click()` ≠ реальний клік
> Програмний `click()` і `dispatchEvent` мають `isTrusted === false`; деякі дії (відкриття попапа, повноекранний режим, доступ до буфера обміну) вимагають справжньої взаємодії користувача. А ще microtasks між слухачами виконуються інакше — див. [[JavaScript - 08. Event Loop]].

> [!pitfall] Забуті слухачі = витік пам'яті
> Слухач на `window` чи `document`, доданий компонентом, тримає замикання з усім його станом після «знищення» компонента. Знімай через `AbortController` у cleanup.

## 🎤 На співбесіді

> [!interview] Опиши фази поширення подій і різницю між stopPropagation і preventDefault
> level: middle · frequency: дуже часто · id: jsd-25-int-01
>
> ---
>
> Подія проходить шлях від `window` до цілі й назад: capture (згори вниз, слухачі з `capture: true`), target (на самому елементі), bubble (знизу вгору; не всі події спливають — `focus`, `mouseenter`, `load` ні). `target` — де сталася подія, `currentTarget` — де висить поточний слухач. `stopPropagation()` зупиняє рух до інших елементів, `stopImmediatePropagation()` — ще й решту слухачів на цьому елементі. `preventDefault()` взагалі не про поширення: він скасовує дію браузера за замовчуванням (перехід, submit, скрол), якщо подія `cancelable`, і не працює в `passive`-слухачах.
>
> 📚 [[JavaScript - 25. DOM і події#🌊 Потік подій — capture, target, bubble|Розділ: потік подій]] · [MDN: Event bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling) · [DOM Standard: dispatching events](https://dom.spec.whatwg.org/#concept-event-dispatch)

> [!interview] Що таке делегування подій і коли воно не працює?
> level: middle · frequency: дуже часто · id: jsd-25-int-02
>
> ---
>
> Один слухач на спільному предку замість слухачів на кожному дочірньому елементі: подія спливає до предка, а `event.target.closest(selector)` визначає, який елемент цікавий. Плюси — менше пам'яті, працює для динамічно доданих елементів, легко зняти. Не працює для подій, що не спливають (`focus`/`blur` — замінюють на `focusin`/`focusout`, `mouseenter` — на `mouseover`), і ламається, якщо дочірній код викликає `stopPropagation`. Треба перевіряти, що знайдений елемент усередині контейнера (`contains`), бо `closest` може вийти за його межі.
>
> 📚 [[JavaScript - 25. DOM і події#🎯 Делегування подій|Розділ: делегування]] · [javascript.info: Event delegation](https://javascript.info/event-delegation)

> [!interview] Як ефективно вставити 1000 елементів у DOM?
> level: middle · frequency: часто · id: jsd-25-int-03
>
> ---
>
> Зібрати їх поза документом — у `DocumentFragment` (або клонувати `<template>`), або побудувати один HTML-рядок з екранованими даними — і вставити **однією** операцією (`append`, `replaceChildren`, `insertAdjacentHTML`). Не робити `innerHTML +=` у циклі (перепарсинг усього, втрата обробників) і не читати геометрію (`offsetHeight`) між записами, щоб не спричинити layout thrashing. Обробники — делегуванням на контейнері. Для дуже великих списків — віртуалізація: рендерити лише видиму частину.
>
> 📚 [[JavaScript - 25. DOM і події#🏗️ Створення й оновлення DOM|Розділ: оновлення DOM]] · [MDN: DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) · [[JavaScript - 26. Як браузер рендерить сторінку|Розділ: рендеринг]]

## 🔗 Зв'язки

- [[JavaScript - 06. this]] — `this` в обробниках подій і чому стрілка його не має.
- [[JavaScript - 08. Event Loop]] — події вводу як задачі, `MutationObserver` як microtask, різниця реального й програмного кліку.
- [[JavaScript - 13. Пам'ять і збирач сміття]] — незняті слухачі як класичне джерело витоків.
- [[JavaScript - 14. Debounce, throttle та async-патерни]] — як приборкати `scroll`, `resize`, `input`.
- [[JavaScript - 26. Як браузер рендерить сторінку]] — що коштує кожна зміна DOM: style, layout, paint.
- [[JavaScript - 30. Безпека в JavaScript]] — XSS через `innerHTML` і санітизація.

## ⚡ Фішки

> [!reel] 🕳️ Пробіл у HTML — теж вузол
> Перенос рядка між `<li>` стає текстовим вузлом. Тому `ul.firstChild` часто — `#text`, а не `<li>`. Бери `firstElementChild`.

> [!reel] 🖼️ innerHTML виконає onerror навіть без вставки
> `div.innerHTML = '<img src=x onerror=…>'` на елементі, якого ще немає на сторінці, все одно завантажить картинку і запустить обробник.

> [!reel] 🧹 Один abort() знімає всі слухачі
> Передай `{ signal }` у кожен `addEventListener` — і `controller.abort()` прибере їх разом. Ідеально для cleanup компонентів.

> [!reel] ⚡ dispatchEvent — синхронний
> Слухачі власної події виконуються прямо всередині `dispatchEvent`, до наступного рядка. Ніякої черги — це просто виклик функцій.

> [!reel] 🎹 event.key vs event.code
> `key` — що надрукується (`'ф'` в українській розкладці), `code` — фізична клавіша (`'KeyA'`). Хоткеї для ігор — через `code`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чим `children` відрізняється від `childNodes`?
> *часто · порівняння* · `jsd-25-001`
>
> `children` — живий `HTMLCollection` лише з елементів. `childNodes` — живий `NodeList` з усіх вузлів: текстових (включно з пробілами між тегами), коментарів, елементів.
>
> 📚 [[JavaScript - 25. DOM і події#🌳 Дерево, вузли й пошук|Розділ: вузли]] · [MDN: NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)

> [!question]- Чому `textContent` безпечніший за `innerHTML`?
> *дуже часто · теорія* · `jsd-25-002`
>
> `textContent` вставляє текст як є — теги стають символами. `innerHTML` парсить рядок як HTML, і атрибути на кшталт `onerror` виконають код (XSS). Для даних користувача — лише `textContent`.
>
> 📚 [[JavaScript - 25. DOM і події#🏗️ Створення й оновлення DOM|Розділ: textContent і innerHTML]] · [MDN: textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

> [!question]- Що таке `event.target` і `event.currentTarget`?
> *дуже часто · теорія* · `jsd-25-003`
>
> `target` — елемент, де подія виникла (найглибший). `currentTarget` — елемент, чий слухач виконується зараз. При делегуванні вони різні: `currentTarget` — контейнер, `target` — клікнута кнопка чи її іконка.
>
> 📚 [[JavaScript - 25. DOM і події#🌊 Потік подій — capture, target, bubble|Розділ: потік подій]] · [javascript.info: Bubbling and capturing](https://javascript.info/bubbling-and-capturing)

### 🟡 Middle

> [!question]- Чим атрибут `value` відрізняється від властивості `value` в `<input>`?
> *часто · порівняння* · `jsd-25-004`
>
> Атрибут — початкове значення з HTML (він же `defaultValue`). Властивість — поточне значення, що змінюється, коли користувач друкує. Після вводу `getAttribute('value')` повертає старе.
>
> 📚 [[JavaScript - 25. DOM і події#🏷️ Атрибути проти властивостей|Розділ: атрибути й властивості]] · [javascript.info: Attributes and properties](https://javascript.info/dom-attributes-and-properties)

> [!question]- Що роблять опції `once`, `passive` і `signal`?
> *часто · теорія* · `jsd-25-005`
>
> `once` — зняти слухача після першого виклику. `passive` — обіцянка не викликати `preventDefault()`, що дозволяє браузеру скролити без очікування JS. `signal` — `AbortSignal`, при `abort()` знімаються всі пов'язані слухачі.
>
> 📚 [[JavaScript - 25. DOM і події#⚙️ addEventListener і його опції|Розділ: опції]] · [MDN: addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

> [!question]- Чому `getElementsByClassName` небезпечно перебирати з видаленням?
> *іноді · код* · `jsd-25-006`
>
> Це жива колекція: прибрав клас або вузол — елемент зник з колекції, індекси зсунулися, і цикл пропускає кожен наступний. Перебирай копію (`[...coll]`) або статичний `querySelectorAll`.
>
> 📚 [[JavaScript - 25. DOM і події#🌳 Дерево, вузли й пошук|Розділ: live vs static]] · [MDN: HTMLCollection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection)

> [!question]- Як створити й відправити власну подію, що спливає?
> *часто · код* · `jsd-25-007`
>
> ```js
> el.dispatchEvent(new CustomEvent('cart:add', {
>   detail: { id: 7 }, bubbles: true, cancelable: true,
> }));
> ```
>
> `bubbles` за замовчуванням `false`. `dispatchEvent` синхронний і повертає `false`, якщо слухач викликав `preventDefault()`.
>
> 📚 [[JavaScript - 25. DOM і події#📣 Власні події, фокус і клавіатура|Розділ: власні події]] · [MDN: CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)

### 🔴 Senior

> [!question]- Як `MutationObserver` вписується в event loop?
> *іноді · теорія* · `jsd-25-008`
>
> Записи про зміни накопичуються, а callback ставиться як microtask: виконається один раз після поточного синхронного коду з масивом усіх змін — до рендеру і до наступної задачі. Він замінив синхронні Mutation Events, які гальмували кожну зміну DOM.
>
> 📚 [[JavaScript - 25. DOM і події#👀 MutationObserver|Розділ: MutationObserver]] · [MDN: MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

> [!question]- Навіщо `passive: true` і чому браузер вмикає його сам?
> *іноді · теорія* · `jsd-25-009`
>
> Слухач `touchstart`/`wheel` теоретично може викликати `preventDefault()` і скасувати скрол, тож браузер мусить чекати його завершення перед прокруткою — це «підвисання» скролу. `passive` гарантує, що скасування не буде, і скрол іде одразу на compositor-потоці. Тому для `touchstart`/`touchmove`/`wheel` на `window`/`document`/`body` браузери роблять `passive` за замовчуванням.
>
> 📚 [[JavaScript - 25. DOM і події#⚙️ addEventListener і його опції|Розділ: passive]] · [DOM Standard: passive](https://dom.spec.whatwg.org/#dom-addeventlisteneroptions-passive)

> [!question]- Чим `event.key` відрізняється від `event.code` і що таке `isComposing`?
> *рідко · порівняння* · `jsd-25-010`
>
> `key` — логічне значення з урахуванням розкладки й модифікаторів (`'ф'`, `'A'`, `'Enter'`). `code` — фізична клавіша незалежно від розкладки (`'KeyA'`). `isComposing` — `true`, поки IME складає символ (китайська, японська…): Enter у цей момент підтверджує вибір, а не надсилає форму.
>
> 📚 [[JavaScript - 25. DOM і події#📣 Власні події, фокус і клавіатура|Розділ: клавіатура]] · [MDN: KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)

## 🛠️ Практика

> [!task] Поясни своїми словами: capture і bubble
> level: junior · difficulty: easy · id: jsd-25-task-01 · tags: feynman, events
>
> Поясни другові, який вперше бачить DOM, чому клік по кнопці всередині картки спрацьовує й на картці, і навіщо взагалі існує фаза capture. До 5 речень, з аналогією.
>
> > [!hint]- Підказка 1
> > Подумай про шлях, який подія проходить від `window` до кнопки і назад.
>
> > [!hint]- Підказка 2
> > Capture корисний, коли батьку треба відреагувати **раніше** за дітей (наприклад, закрити меню при кліку будь-де).
>
> > [!solution]- Еталонне пояснення
> > Кнопка лежить усередині картки, тож клік по кнопці — це водночас клік по картці, по `body` і по всій сторінці. Браузер передає подію як естафету: спершу згори вниз від `window` до кнопки (capture), потім на самій кнопці, і назад угору (bubble). Більшість слухачів чекають на зворотному шляху — тому спрацьовує і кнопка, і картка. Capture потрібен, коли предок має дізнатися першим — як охоронець на вході, що перевіряє кожного ще до того, як той дійде до кабінету: наприклад, щоб закрити випадне меню чи заблокувати кліки під час завантаження.

> [!task] Делегований список задач
> level: middle · difficulty: medium · id: jsd-25-task-02 · tags: dom, delegation, abort-controller
>
> Напиши `mountTodo(root)`, де `root` — `<ul>`. Кожен рядок: `<li data-id="…"><span>текст</span> <button data-action="toggle">✓</button> <button data-action="delete">✕</button></li>`. Вимоги: **один** слухач `click` на `root`; `toggle` перемикає клас `done` на `<li>`; `delete` видаляє `<li>`; функція повертає `unmount()`, що знімає слухача. Рядки можуть додаватися після монтування.
>
> 🧪 У тестовому середовищі немає справжнього DOM, тому тести будують мінімальний фейковий: `closest`, `matches` (селектори виду `tag[data-x]`), `contains`, `dataset`, `classList`, `remove`, `addEventListener` з `signal`. Пиши звичайний DOM-код — він працюватиме і в браузері.
>
> ```js starter
> function mountTodo(root) {
>   const controller = new AbortController()
>   // твій код: один слухач click на root
>   return () => controller.abort()
> }
> ```
>
> ```js tests
> // Тести працюють без браузера: мінімальний фейковий DOM
> class El {
>   constructor(tag, data = {}) {
>     this.tagName = tag.toUpperCase()
>     this.parentNode = null
>     this.children = []
>     this.dataset = { ...data }
>     this.listeners = []
>     this._text = ''
>     this.textWrites = 0
>     const cls = new Set()
>     this.classList = {
>       contains: (c) => cls.has(c),
>       add: (c) => cls.add(c),
>       remove: (c) => cls.delete(c),
>       toggle: (c, force = !cls.has(c)) => (force ? cls.add(c) : cls.delete(c), force),
>     }
>   }
>   append(...kids) { for (const k of kids) this.insertBefore(k, null); return this }
>   insertBefore(node, ref) {
>     node.remove()
>     node.parentNode = this
>     const i = ref ? this.children.indexOf(ref) : -1
>     if (i < 0) this.children.push(node); else this.children.splice(i, 0, node)
>     return node
>   }
>   remove() {
>     if (!this.parentNode) return
>     const siblings = this.parentNode.children
>     siblings.splice(siblings.indexOf(this), 1)
>     this.parentNode = null
>   }
>   get firstElementChild() { return this.children[0] ?? null }
>   get nextElementSibling() {
>     const s = this.parentNode?.children ?? []
>     return s[s.indexOf(this) + 1] ?? null
>   }
>   get textContent() { return this._text || this.children.map((c) => c.textContent).join('') }
>   set textContent(v) { this.textWrites++; this._text = String(v); this.children = [] }
>   matches(sel) {
>     const m = /^(\w*)((?:\[[\w-]+(?:="[^"]*")?\])*)$/.exec(sel.trim())
>     if (!m) throw new Error(`фейковий DOM не знає селектор «${sel}»`)
>     if (m[1] && m[1].toUpperCase() !== this.tagName) return false
>     for (const [, name, val] of m[2].matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)) {
>       const key = name.replace(/^data-/, '')
>       if (!name.startsWith('data-') || !(key in this.dataset)) return false
>       if (val !== undefined && this.dataset[key] !== val) return false
>     }
>     return true
>   }
>   closest(sel) {
>     let el = this
>     while (el && !el.matches(sel)) el = el.parentNode
>     return el ?? null
>   }
>   contains(node) {
>     for (; node; node = node.parentNode) if (node === this) return true
>     return false
>   }
>   addEventListener(type, fn, opts = {}) {
>     this.listeners.push({ type, fn })
>     opts.signal?.addEventListener('abort', () => this.removeEventListener(type, fn))
>   }
>   removeEventListener(type, fn) {
>     this.listeners = this.listeners.filter((l) => !(l.type === type && l.fn === fn))
>   }
> }
> const h = (tag, data, ...kids) => new El(tag, data).append(...kids)
>
> function click(target) { // спливання від target до кореня
>   const event = { type: 'click', target, currentTarget: null }
>   for (let el = target; el; el = el.parentNode) {
>     event.currentTarget = el
>     for (const l of [...el.listeners]) if (l.type === 'click') l.fn.call(el, event)
>   }
> }
> const row = (id) => h('li', { id }, h('span', {}), h('button', { action: 'toggle' }, h('svg', {})), h('button', { action: 'delete' }))
> const btn = (li, action) => li.children.find((b) => b.dataset.action === action)
>
> test('вішає рівно один слухач на root', () => {
>   const root = h('ul', {}, row('1'), row('2'))
>   mountTodo(root)
>   expect(root.listeners.length).toBe(1)
>   expect(root.children[0].listeners.length).toBe(0)
> })
>
> test('toggle перемикає клас done, навіть якщо клік по іконці всередині кнопки', () => {
>   const li = row('1')
>   const root = h('ul', {}, li)
>   mountTodo(root)
>   click(btn(li, 'toggle').children[0]) // target = <svg>
>   expect(li.classList.contains('done')).toBe(true)
>   click(btn(li, 'toggle'))
>   expect(li.classList.contains('done')).toBe(false)
> })
>
> test('delete видаляє рядок', () => {
>   const a = row('a')
>   const root = h('ul', {}, a, row('b'))
>   mountTodo(root)
>   click(btn(a, 'delete'))
>   expect(root.children.map((li) => li.dataset.id)).toEqual(['b'])
> })
>
> test('працює для рядків, доданих після монтування', () => {
>   const root = h('ul', {})
>   mountTodo(root)
>   const late = row('late')
>   root.append(late)
>   click(btn(late, 'toggle'))
>   expect(late.classList.contains('done')).toBe(true)
> })
>
> test('клік повз кнопки нічого не ламає, unmount знімає слухача', () => {
>   const li = row('1')
>   const root = h('ul', {}, li)
>   const unmount = mountTodo(root)
>   expect(() => click(li.children[0])).not.toThrow()
>   unmount()
>   expect(root.listeners.length).toBe(0)
>   click(btn(li, 'delete'))
>   expect(root.children.length).toBe(1)
> })
> ```
>
> > [!hint]- Підказка 1
> > `event.target.closest('button[data-action]')` + перевірка `root.contains(...)`.
>
> > [!hint]- Підказка 2
> > `AbortController` робить `unmount` однорядковим.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function mountTodo(root) {
> >   const controller = new AbortController();
> >   const actions = {
> >     toggle: (li) => li.classList.toggle('done'),
> >     delete: (li) => li.remove(),
> >   };
> >
> >   root.addEventListener('click', (event) => {
> >     const button = event.target.closest('button[data-action]');
> >     if (!button || !root.contains(button)) return;
> >     const li = button.closest('li[data-id]');
> >     actions[button.dataset.action]?.(li);
> >   }, { signal: controller.signal });
> >
> >   return () => controller.abort();
> > }
> > ```
> >
> > Рядки, додані пізніше, працюють автоматично, бо слухач на контейнері. `actions[...]?.()` ігнорує невідомі дії замість падіння.

> [!task] Міні-рендерер списку без зайвих перебудов
> level: senior · difficulty: hard · id: jsd-25-task-03 · tags: dom, performance, keyed-diff
>
> Напиши `renderList(ul, items)`, де `items = [{ id, text }]`. Функцію викликають багато разів з новими масивами. Вимоги: вузли `<li>` з тим самим `id` **перевикористовуються** (не перестворюються — щоб зберегти фокус і стан); нові створюються; зниклі видаляються; порядок у DOM відповідає масиву; текст оновлюється лише якщо змінився; без `innerHTML`.
>
> 🧪 У тестовому середовищі немає справжнього DOM, тому тести підставляють мінімальний фейковий `document.createElement` і вузли з `firstElementChild`, `nextElementSibling`, `insertBefore`, `remove`, `textContent`, `dataset`. Пиши звичайний DOM-код — він працюватиме і в браузері.
>
> ```js starter
> const registry = new WeakMap() // ul → Map<id, li>
>
> function renderList(ul, items) {
>   // твій код
> }
> ```
>
> ```js tests
> // Тести працюють без браузера: мінімальний фейковий DOM
> class El {
>   constructor(tag, data = {}) {
>     this.tagName = tag.toUpperCase()
>     this.parentNode = null
>     this.children = []
>     this.dataset = { ...data }
>     this.listeners = []
>     this._text = ''
>     this.textWrites = 0
>     const cls = new Set()
>     this.classList = {
>       contains: (c) => cls.has(c),
>       add: (c) => cls.add(c),
>       remove: (c) => cls.delete(c),
>       toggle: (c, force = !cls.has(c)) => (force ? cls.add(c) : cls.delete(c), force),
>     }
>   }
>   append(...kids) { for (const k of kids) this.insertBefore(k, null); return this }
>   insertBefore(node, ref) {
>     node.remove()
>     node.parentNode = this
>     const i = ref ? this.children.indexOf(ref) : -1
>     if (i < 0) this.children.push(node); else this.children.splice(i, 0, node)
>     return node
>   }
>   remove() {
>     if (!this.parentNode) return
>     const siblings = this.parentNode.children
>     siblings.splice(siblings.indexOf(this), 1)
>     this.parentNode = null
>   }
>   get firstElementChild() { return this.children[0] ?? null }
>   get nextElementSibling() {
>     const s = this.parentNode?.children ?? []
>     return s[s.indexOf(this) + 1] ?? null
>   }
>   get textContent() { return this._text || this.children.map((c) => c.textContent).join('') }
>   set textContent(v) { this.textWrites++; this._text = String(v); this.children = [] }
>   matches(sel) {
>     const m = /^(\w*)((?:\[[\w-]+(?:="[^"]*")?\])*)$/.exec(sel.trim())
>     if (!m) throw new Error(`фейковий DOM не знає селектор «${sel}»`)
>     if (m[1] && m[1].toUpperCase() !== this.tagName) return false
>     for (const [, name, val] of m[2].matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)) {
>       const key = name.replace(/^data-/, '')
>       if (!name.startsWith('data-') || !(key in this.dataset)) return false
>       if (val !== undefined && this.dataset[key] !== val) return false
>     }
>     return true
>   }
>   closest(sel) {
>     let el = this
>     while (el && !el.matches(sel)) el = el.parentNode
>     return el ?? null
>   }
>   contains(node) {
>     for (; node; node = node.parentNode) if (node === this) return true
>     return false
>   }
>   addEventListener(type, fn, opts = {}) {
>     this.listeners.push({ type, fn })
>     opts.signal?.addEventListener('abort', () => this.removeEventListener(type, fn))
>   }
>   removeEventListener(type, fn) {
>     this.listeners = this.listeners.filter((l) => !(l.type === type && l.fn === fn))
>   }
> }
> const h = (tag, data, ...kids) => new El(tag, data).append(...kids)
>
> let created = 0
> globalThis.document = { createElement: (tag) => { created++; return new El(tag) } }
> const texts = (ul) => ul.children.map((li) => li.textContent)
>
> test('перший рендер створює вузли в порядку масиву', () => {
>   const ul = h('ul', {})
>   renderList(ul, [{ id: 1, text: 'a' }, { id: 2, text: 'b' }])
>   expect(texts(ul)).toEqual(['a', 'b'])
> })
>
> test('вузли з тим самим id перевикористовуються', () => {
>   const ul = h('ul', {})
>   renderList(ul, [{ id: 1, text: 'a' }, { id: 2, text: 'b' }])
>   const [first, second] = ul.children
>   created = 0
>   renderList(ul, [{ id: 2, text: 'b' }, { id: 1, text: 'a' }])
>   expect(created).toBe(0)
>   expect(ul.children).toEqual([second, first])
>   expect(ul.children[0]).toBe(second)
> })
>
> test('нові створюються, зниклі видаляються', () => {
>   const ul = h('ul', {})
>   renderList(ul, [{ id: 1, text: 'a' }, { id: 2, text: 'b' }])
>   const keep = ul.children[1]
>   renderList(ul, [{ id: 2, text: 'b' }, { id: 3, text: 'c' }])
>   expect(texts(ul)).toEqual(['b', 'c'])
>   expect(ul.children[0]).toBe(keep)
> })
>
> test('текст записується лише якщо змінився', () => {
>   const ul = h('ul', {})
>   renderList(ul, [{ id: 1, text: 'a' }, { id: 2, text: 'b' }])
>   const [a, b] = ul.children
>   const before = [a.textWrites, b.textWrites]
>   renderList(ul, [{ id: 1, text: 'a' }, { id: 2, text: 'B' }])
>   expect(a.textWrites).toBe(before[0])
>   expect(b.textWrites).toBe(before[1] + 1)
>   expect(texts(ul)).toEqual(['a', 'B'])
> })
>
> test('порожній масив очищує список, різні ul не змішуються', () => {
>   const ul1 = h('ul', {})
>   const ul2 = h('ul', {})
>   renderList(ul1, [{ id: 1, text: 'a' }])
>   renderList(ul2, [{ id: 1, text: 'x' }])
>   renderList(ul1, [])
>   expect(ul1.children.length).toBe(0)
>   expect(texts(ul2)).toEqual(['x'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Тримай `Map<id, li>` поточних вузлів (можна в `WeakMap<ul, Map>`).
>
> > [!hint]- Підказка 2
> > Йди по масиву з «курсором» на очікуваний вузол: якщо вузол не на місці — `ul.insertBefore(node, cursor)`; `insertBefore` **переміщує** наявний вузол.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const registry = new WeakMap(); // ul → Map<id, li>
> >
> > function renderList(ul, items) {
> >   const prev = registry.get(ul) ?? new Map();
> >   const next = new Map();
> >   let cursor = ul.firstElementChild;
> >
> >   for (const { id, text } of items) {
> >     let li = prev.get(id);
> >     if (!li) {
> >       li = document.createElement('li');
> >       li.dataset.id = id;
> >     }
> >     if (li.textContent !== text) li.textContent = text; // мінімальний запис
> >     if (li !== cursor) ul.insertBefore(li, cursor);      // перемістити/вставити
> >     else cursor = cursor.nextElementSibling;
> >     next.set(id, li);
> >   }
> >
> >   for (const [id, li] of prev) if (!next.has(id)) li.remove();
> >   registry.set(ul, next);
> > }
> > ```
> >
> > Це спрощена версія keyed reconciliation з React/Vue: ключ (`id`) дозволяє зрозуміти, що вузол «той самий». Оптимальні фреймворки ще мінімізують кількість переміщень (найдовша зростаюча підпослідовність), але ідея та сама.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Bubbling and capturing](https://javascript.info/bubbling-and-capturing) — фази подій з інтерактивними прикладами.
- 🟢 [javascript.info — Event delegation](https://javascript.info/event-delegation) — патерн делегування й поведінка через `data-*`.
- 🟡 [MDN — EventTarget.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) — усі опції, `passive`, `signal`, сумісність.
- 🟡 [MDN — Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) — вузли, інтерфейси, базові операції.
- 🟡 [javascript.info — Attributes and properties](https://javascript.info/dom-attributes-and-properties) — синхронізація атрибутів і властивостей.
- 🟡 [MDN — MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) — опції спостереження й записи.
- 🔴 [DOM Standard — Dispatching events](https://dom.spec.whatwg.org/#concept-event-dispatch) — точний алгоритм побудови шляху й фаз.
- 🔴 [DOM Standard — Interface MutationObserver](https://dom.spec.whatwg.org/#interface-mutationobserver) — коли саме ставиться microtask спостерігача.

> [!important] Підсумок
> - DOM — дерево вузлів, не лише елементів; `querySelectorAll` — статичний знімок, `getElementsBy*`/`children`/`childNodes` — живі.
> - Групуй зміни (`DocumentFragment`, одна вставка); дані користувача — лише через `textContent`.
> - Атрибут — початковий стан з HTML, властивість — поточний (`value`, `checked`, `href`); булеві атрибути — за присутністю.
> - Подія: capture → target → bubble; `stopPropagation` ≠ `preventDefault`; `once`, `passive`, `signal` — сучасний мінімум.
> - Делегування через `closest` масштабується; `dispatchEvent` синхронний; `MutationObserver` — пачка змін як microtask.
