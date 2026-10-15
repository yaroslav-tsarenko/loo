---
title: Як браузер рендерить сторінку
order: 26
level: senior
tags: [rendering, performance, critical-rendering-path, layout, web-vitals]
prerequisites:
  - "[[JavaScript - 08. Event Loop]]"
  - "[[JavaScript - 25. DOM і події]]"
estimatedMinutes: 50
id: jsd-ch-26
icon: "🖼️"
---

# Як браузер рендерить сторінку

> [!success] 🎯 Після цього розділу ти зможеш
> - пройти шлях від введення URL до пікселів: парсинг, DOM/CSSOM, style, layout, paint, composite;
> - пояснити, що блокує перший рендер, і правильно вибрати `async`, `defer` чи `type="module"`;
> - відрізнити reflow від repaint і назвати властивості, які анімуються лише на compositor;
> - знайти й виправити layout thrashing, розподіляючи читання й записи по кадру з `requestAnimationFrame`;
> - пояснити LCP, INP і CLS та як саме JavaScript їх погіршує.

## 🤔 Передбач

> [!quiz] Скільки разів браузер синхронно перерахує layout?
> level: middle · id: jsd-26-quiz-01
>
> ```js
> el.style.width = '100px';
> el.style.height = '50px';
> el.style.color = 'red';
> console.log(el.offsetHeight);
> el.style.width = '200px';
> // …кінець обробника
> ```
>
> - [ ] 0 — layout буває лише між кадрами
> - [x] 1 — на читанні `offsetHeight`
> - [ ] 3 — після кожної зміни розміру
> - [ ] 4 — після кожного рядка зі `style`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Записи в `style` браузер лише позначає як «брудні». Але `offsetHeight` має повернути **актуальне** число, тож браузер змушений порахувати layout просто зараз — це *forced synchronous layout*. Остання зміна ширини буде врахована вже у звичайному кроці рендеру.

## 🧒 Простими словами

Уяви друкарню. Спершу редактор читає рукопис (HTML) і складає зміст — це **DOM**. Паралельно дизайнер читає стильовий посібник (CSS) — це **CSSOM**. Потім верстальник вирішує, що й де стоїть на сторінці, з точністю до міліметра (**layout**). Далі художник фарбує (**paint**), а друкар складає готові прозорі плівки одна на одну (**composite**). Якщо після верстки хтось змінив ширину колонки — верстку доведеться переробляти (**reflow**), а якщо лише колір — досить перефарбувати (**repaint**). А от посунути цілу плівку чи зробити її напівпрозорою друкар може сам, не турбуючи ні верстальника, ні художника — тому `transform` і `opacity` такі дешеві. Головне правило: не смикай верстальника питанням «яка зараз висота?» після кожної правки — інакше він переверстуватиме сторінку сто разів.

## 🔬 Як це працює насправді

### 🧭 Від URL до першого кадру

```text
🌐 DNS → 🤝 TCP/TLS (або QUIC) → 📨 HTTP-запит → 📦 HTML потоком
                                                     │
            ┌───────────── парсер HTML ◀─────────────┘
            │      ├─ preload scanner: заздалегідь бачить <link>, <script>, <img> і качає їх
            ▼      └─ <script> без async/defer → ПАУЗА парсингу
          DOM ──┐
                ├─▶ Style ─▶ Layout ─▶ Paint ─▶ Composite ─▶ 🖼️ пікселі
       CSSOM ───┘
```

- **HTML парситься інкрементально**, у міру надходження байтів, тож браузер може почати рендерити ще до кінця завантаження.
- **CSS — render-blocking**: без CSSOM браузер не малює (інакше показав би «голу» сторінку і перемалював — FOUC). Крім того, звичайний `<script>` чекає завантаження таблиць стилів перед собою, бо може запитати `getComputedStyle`.
- **Preload scanner** — другий легкий парсер, що біжить уперед і завантажує ресурси, поки основний стоїть на скрипті. Тому ресурси, які видно лише з JS (`img.src = …` у бандлі, CSS `background-image`), відкриваються пізно.
- **`DOMContentLoaded`** — DOM побудовано й виконано `defer`-скрипти; **`load`** — завантажено ще й картинки, стилі, iframe.

> [!figure] browser-render
> scenario: pipeline
>
> Увесь шлях на одній сторінці: HTML стає DOM, CSS — CSSOM, разом вони дають render tree, далі layout, paint і composite.

> [!quiz] Перевір себе: що блокує рендер?
> level: middle · type: multi · id: jsd-26-quiz-02
>
> Що за замовчуванням затримує **перше** малювання сторінки?
>
> - [x] `<link rel="stylesheet" href="app.css">` у `<head>`
> - [x] `<script src="app.js"></script>` у `<head>` без атрибутів
> - [ ] `<script src="app.js" defer></script>`
> - [ ] `<img src="hero.jpg">`
>
> **Пояснення:** CSS блокує рендер, а синхронний скрипт — парсинг (і сам чекає CSS). `defer` не блокує парсер, а картинки догружаються вже після першого кадру.

### 📜 Завантаження скриптів — async, defer, module

```text
звичайний  HTML ██████▌░░░░░░░░▐██████          ← парсер стоїть, поки скрипт качається й виконується
                      ⬇️ fetch ▶️ exec
async      HTML ████████████▌░░░▐█████          ← качається паралельно, виконується ОДРАЗУ (перериває парсинг)
                  ⬇️ fetch ───▶️ exec
defer      HTML ████████████████████████ ▶️ exec ← качається паралельно, виконується ПІСЛЯ парсингу, по порядку
                  ⬇️ fetch ──────────────
```

| Атрибут | Блокує парсинг | Коли виконується | Порядок між собою |
|---|---|---|---|
| — | так | одразу, щойно завантажився | у порядку в HTML |
| `async` | лише на час виконання | щойно завантажився | **не гарантований** |
| `defer` | ні | після парсингу, перед `DOMContentLoaded` | у порядку в HTML |
| `type="module"` | ні | як `defer` (або як `async` з атрибутом) | у порядку в HTML |

Правило: застосунок — `defer` або `type="module"`; незалежні сторонні скрипти (аналітика) — `async`. Для критичних ресурсів є підказки: `<link rel="preload">`, `<link rel="modulepreload">`, `fetchpriority="high"`. Атрибут `defer` на **inline**-скриптах без `src` ігнорується (а inline `type="module"` — відкладається).

> [!quiz] Перевір себе: порядок виконання
> level: middle · type: multi · id: jsd-26-quiz-03
>
> ```html
> <script async src="a.js"></script>  <!-- качається 300 мс -->
> <script defer src="b.js"></script>  <!-- 100 мс -->
> <script defer src="c.js"></script>  <!-- 10 мс -->
> ```
>
> Що гарантовано?
>
> - [x] `b.js` виконається раніше за `c.js`
> - [ ] `a.js` виконається першим, бо стоїть першим
> - [x] `b.js` і `c.js` виконаються до `DOMContentLoaded`
> - [ ] `c.js` виконається першим, бо завантажиться найшвидше
>
> **Пояснення:** `defer`-скрипти чекають кінця парсингу й зберігають порядок документа. `async` виконується, щойно завантажився, — може бути до, між чи після них (і навіть після `DOMContentLoaded`).

### 🎨 Style, layout, paint, composite

Після DOM і CSSOM кожен кадр проходить конвеєр (спрощено; у Chromium кроків більше — RenderingNG):

> [!viz] render-pipeline
> scenario: frame

| Етап | Що відбувається | Що запускає |
|---|---|---|
| **Style** | обчислити підсумкові стилі для кожного елемента | зміна класів, `style`, DOM |
| **Layout** (reflow) | геометрія: розміри й позиції (layout tree) | `width`, `height`, `top`, `font-size`, вміст, `display` |
| **Paint** | записати команди малювання по шарах | `color`, `background`, `box-shadow`, `visibility` |
| **Composite** | скласти шари (на GPU, в окремому compositor-потоці) | `transform`, `opacity` (на власному шарі) |

Важливі наслідки:

- Елементи з `display: none` (і весь `<head>`) не потрапляють у layout tree; `visibility: hidden` — потрапляють і займають місце.
- Зміна геометрії тягне за собою paint і composite — найдорожче. Зміна кольору — paint + composite. Анімація `transform`/`opacity` на власному шарі — **лише composite**, і може йти плавно, навіть коли головний потік зайнятий JS.
- `will-change: transform` заздалегідь виносить елемент на окремий шар. Але кожен шар — це пам'ять GPU: «`will-change` на все» дає layer explosion.
- `contain: layout paint` і `content-visibility: auto` обмежують, яку частину сторінки треба перераховувати, — величезний виграш для довгих сторінок.

```css
/* ❌ кожен кадр: layout → paint → composite */
.panel.open { left: 0; transition: left 300ms; }

/* ✅ кожен кадр: лише composite */
.panel.open { transform: translateX(0); transition: transform 300ms; }
```

> [!quiz] Перевір себе: що найдешевше анімувати?
> level: middle · id: jsd-26-quiz-04
>
> - [ ] `width`
> - [ ] `margin-left`
> - [ ] `background-color`
> - [x] `transform: translateX()`
>
> **Пояснення:** `width` і `margin-left` змінюють геометрію (layout), `background-color` — перемальовування (paint). `transform` на окремому шарі обробляє compositor без layout і paint.

### 🔁 Reflow, repaint і layout thrashing

Браузер лінивий у хорошому сенсі: зміни стилю він лише позначає «брудними» й рахує все разом у кроці рендеру. Але **читання геометрії** (`offsetWidth/Height`, `clientWidth`, `scrollTop`, `getBoundingClientRect()`, `getComputedStyle()` для layout-властивостей, `innerText`, `focus()`) мусить повернути актуальні числа — тож якщо щось брудне, браузер рахує layout **синхронно, просто зараз**.

**Layout thrashing** — чергування «запис → читання» в циклі, де кожне читання форсує новий layout:

> [!viz] render-pipeline
> scenario: layout-thrashing

```js
// ❌ N форсованих layout-ів: читання після запису на кожній ітерації
for (const box of boxes) {
  box.style.width = box.offsetWidth + 10 + 'px';
}

// ✅ один layout: спершу всі читання, потім усі записи
const widths = boxes.map((box) => box.offsetWidth);
boxes.forEach((box, i) => {
  box.style.width = widths[i] + 10 + 'px';
});
```

У великому застосунку читання й записи розкидані по різних модулях. Тоді допомагає дисципліна «читай одразу, пиши в `requestAnimationFrame`» (так працює бібліотека fastdom) або `ResizeObserver`/`IntersectionObserver` замість ручних вимірів. У DevTools → Performance форсовані layout-и підсвічуються фіолетовим з попередженням *Forced reflow*.

> [!figure] devtools-performance
> scenario: layout-thrashing
>
> Так thrashing виглядає в профілі: одна довга задача з фіолетовими Layout після кожного читання. Після виправлення — один Layout і кадри по 16.7 мс.

> [!quiz] Перевір себе: де thrashing?
> level: senior · type: multi · id: jsd-26-quiz-05
>
> Які фрагменти форсують **кілька** синхронних layout-ів?
>
> - [x] `items.forEach((el) => { el.style.height = el.scrollHeight + 'px'; })`
> - [ ] `const h = items.map((el) => el.scrollHeight); items.forEach((el, i) => { el.style.height = h[i] + 'px'; })`
> - [x] `for (const el of items) { el.classList.add('wide'); total += el.getBoundingClientRect().width; }`
> - [ ] `items.forEach((el) => el.classList.add('wide'))`
>
> **Пояснення:** проблема — чергування запису і читання геометрії в одному циклі. Окремі цикли «спершу читання, потім запис» або лише записи дають один layout у кінці.

> [!quiz] Склади цикл без layout thrashing
> level: middle · type: order · id: jsd-26-quiz-08
>
> ```js order
> const widths = boxes.map((box) => box.offsetWidth)
> boxes.forEach((box, i) => {
>   box.style.width = widths[i] + 10 + 'px'
> })
>   box.style.width = box.offsetWidth + 10 + 'px' // ✗
> ```
>
> **Пояснення:** спершу всі читання геометрії (один layout), потім усі записи (layout у звичайному кроці рендеру). Читання `offsetWidth` одразу після запису в тому ж циклі форсує синхронний layout на кожній ітерації.

### ⏱️ Кадр, rAF і бюджет 16,6 мс

На екрані 60 Гц кадр триває 1000 / 60 ≈ **16,7 мс** (на 120 Гц — 8,3 мс). За цей час браузер має виконати твій JS, style, layout, paint і composite. На практиці на JS лишається ~10 мс. Задача, довша за **50 мс**, — *long task*: користувач бачить ривки, а клік чекає.

```text
|◀──────────────── 16,7 мс ────────────────▶|
| задачі/події JS | rAF | Style | Layout | Paint | Composite | (idle)
```

`requestAnimationFrame(cb)` викликає `cb` **перед style/layout наступного кадру** — найкраще місце для візуальних змін: вони гарантовано потраплять у найближчий кадр, а у фоновій вкладці rAF ставиться на паузу. Не плутати з `requestIdleCallback` — він для неважливої роботи в «хвостах» кадрів.

```js
function animate(el) {
  const start = performance.now();
  requestAnimationFrame(function frame(now) {
    const progress = Math.min((now - start) / 300, 1);
    el.style.transform = `translateX(${progress * 200}px)`; // лише composite
    if (progress < 1) requestAnimationFrame(frame);
  });
}
```

Довгу роботу розбивай на шматки й віддавай керування циклу між ними (`await scheduler.yield()` у Chromium і Firefox, або `setTimeout`) — див. [[JavaScript - 08. Event Loop]]. Справді важкі обчислення — у Worker ([[JavaScript - 29. Workers і паралельність]]).

> [!quiz] Перевір себе: бюджет кадру
> level: junior · id: jsd-26-quiz-06
>
> Обробник прокрутки виконується 40 мс. Що побачить користувач на екрані 60 Гц?
>
> - [ ] Нічого — 40 мс менше за поріг long task у 50 мс
> - [x] Пропущені кадри: за 40 мс мало б змінитись ~2 кадри, а браузер не намалював жодного
> - [ ] Браузер перерве обробник, щоб встигнути намалювати кадр
>
> **Пояснення:** JS не переривається, а кадр чекає порожнього стека. Будь-що довше за ~16 мс уже коштує кадру, навіть якщо формально це ще не long task.

> [!quiz] Заповни пропуски: анімація на 300 мс через rAF
> level: middle · type: fill · id: jsd-26-quiz-09 · bank: setTimeout, left, Date
>
> ```js fill
> function animate(el) {
>   const start = performance.now()
>   [[requestAnimationFrame]](function frame(now) {
>     const progress = Math.min((now - start) / 300, 1)
>     el.style.[[transform]] = `translateX(${progress * 200}px)`
>     if (progress [[<]] 1) requestAnimationFrame(frame)
>   })
> }
> ```
>
> **Пояснення:** rAF викликає колбек перед style/layout наступного кадру і передає час кадру `now`. `transform` змінюється лише на етапі composite — без layout і paint. Анімація продовжується, доки прогрес менший за 1.

### 📊 Core Web Vitals і вплив JavaScript

Google вимірює реальний досвід трьома метриками (поріг «добре» — для 75-го перцентиля відвідувань):

| Метрика | Що вимірює | 🟢 Добре | 🔴 Погано | Як JS шкодить |
|---|---|---|---|---|
| **LCP** — Largest Contentful Paint | коли намальовано найбільший елемент (hero, заголовок) | ≤ 2,5 с | > 4 с | render-blocking скрипти; рендер лише на клієнті; `loading="lazy"` на головному зображенні; картинка, що «відкривається» лише з JS |
| **INP** — Interaction to Next Paint | затримка від взаємодії до наступного кадру (найгірші взаємодії) | ≤ 200 мс | > 500 мс | long tasks на головному потоці; важкі обробники; величезні оновлення DOM; гідратація |
| **CLS** — Cumulative Layout Shift | неочікувані зсуви макета | ≤ 0,1 | > 0,25 | вставка контенту над наявним (банери, реклама); картинки без `width/height`; шрифти, що «стрибають» |

INP замінив FID у березні 2024: FID міряв лише затримку **першої** взаємодії до початку обробника, а INP — усю дорогу «клік → обробник → наступний кадр» для всіх взаємодій.

Як допомогти з JS-боку: `defer`/`module`, менше JS на старті (code splitting), `fetchpriority="high"` для LCP-зображення, розбиття довгих задач і `scheduler.yield()`, оновлення UI **до** важкої роботи (спершу показати стан «натиснуто», потім рахувати), резервування місця під динамічний контент. Вимірювати — `PerformanceObserver` або бібліотека `web-vitals`, у лабораторії — Lighthouse і DevTools.

> [!quiz] Перевір себе: яка метрика постраждає?
> level: middle · id: jsd-26-quiz-07
>
> Після кліку «Додати в кошик» обробник синхронно перераховує весь каталог на 600 мс, і лише потім кнопка змінює вигляд.
>
> - [ ] LCP
> - [x] INP
> - [ ] CLS
>
> **Пояснення:** взаємодія не отримує наступного кадру 600 мс — це «погано» за INP (> 500 мс). Фікс: спершу оновити кнопку й віддати кадр, а перерахунок розбити на шматки чи винести у Worker.

## ⚠️ Пастки

> [!pitfall] `loading="lazy"` на головній картинці
> Ліниве завантаження відкладає зображення, доки layout не покаже, що воно біля viewport. Для hero-картинки (часто LCP-елемент) це затримка на сотні мілісекунд. Lazy — лише для того, що нижче першого екрана.

> [!pitfall] Анімація через `top`/`left`/`width`
> Кожен кадр запускає layout і paint на головному потоці. При будь-якому long task анімація смикається. Анімуй `transform` і `opacity`.

> [!pitfall] Вимірювання в циклі, що змінює DOM
> `el.offsetHeight` після `el.style.x = …` — форсований layout. У циклі з сотень елементів — сотні layout-ів за кадр. Групуй читання до записів.

> [!pitfall] `async` для скриптів, що залежать один від одного
> `async` не зберігає порядок: `plugin.js` може виконатися раніше за `library.js`. Для залежних скриптів — `defer` або модулі з `import`.

## 🎤 На співбесіді

> [!interview] Що відбувається, коли ти вводиш URL і натискаєш Enter?
> level: middle · frequency: дуже часто · id: jsd-26-int-01
>
> ---
>
> DNS-резолв, з'єднання (TCP + TLS або QUIC для HTTP/3), HTTP-запит, відповідь (можливо з кешу чи через Service Worker). HTML парситься потоком у DOM; preload scanner заздалегідь качає знайдені ресурси. CSS паралельно перетворюється на CSSOM і блокує рендер; синхронні скрипти зупиняють парсер (і самі чекають CSS), `defer`/`module` виконуються після парсингу, `async` — щойно завантажились. Далі для кадру: style (обчислені стилі), layout (геометрія), paint (команди малювання), composite (складання шарів на GPU). Потім `DOMContentLoaded`, `load`, а будь-які зміни DOM/CSS знову проходять частину конвеєра.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку#🧭 Від URL до першого кадру|Розділ: від URL до кадру]] · [MDN: How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work) · [web.dev: Critical rendering path](https://web.dev/articles/critical-rendering-path)

> [!interview] Чим відрізняються reflow і repaint і що таке layout thrashing?
> level: middle · frequency: часто · id: jsd-26-int-02
>
> ---
>
> Reflow (layout) — перерахунок геометрії через зміну розмірів, позицій, шрифтів чи вмісту; за ним завжди йде repaint. Repaint — перемальовування без зміни геометрії (колір, тінь). Найдешевше — зміни лише на compositor (`transform`, `opacity` на окремому шарі). Layout thrashing — коли в циклі чергуються запис стилю й читання геометрії (`offsetHeight`, `getBoundingClientRect`): кожне читання змушує браузер синхронно рахувати layout. Лікування — спершу всі читання, потім усі записи; записи — у `requestAnimationFrame`; observer-и замість ручних вимірів.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку#🔁 Reflow, repaint і layout thrashing|Розділ: layout thrashing]] · [web.dev: Avoid layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing) · [Paul Irish: What forces layout](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

> [!interview] Що таке Core Web Vitals і як JavaScript на них впливає?
> level: senior · frequency: часто · id: jsd-26-int-03
>
> ---
>
> Три метрики реального досвіду на 75-му перцентилі: LCP (коли намальовано найбільший контент, добре ≤ 2,5 с), INP (затримка від взаємодії до наступного кадру, ≤ 200 мс; замінив FID у 2024), CLS (сумарні неочікувані зсуви, ≤ 0,1). JS погіршує LCP render-blocking скриптами й клієнтським рендерингом, INP — long tasks і важкими обробниками, CLS — вставкою контенту без зарезервованого місця. Лікую `defer`/code splitting, `fetchpriority` для LCP-ресурсу, розбиттям задач і `scheduler.yield()`, оновленням UI до важкої роботи, Workers, розмірами для медіа. Міряю польовими даними (`web-vitals`, CrUX), а не лише Lighthouse.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку#📊 Core Web Vitals і вплив JavaScript|Розділ: Web Vitals]] · [web.dev: Web Vitals](https://web.dev/articles/vitals) · [web.dev: INP](https://web.dev/articles/inp)

## 🔗 Зв'язки

- [[JavaScript - 08. Event Loop]] — рендер як крок циклу між задачами, rAF і чому microtasks можуть заморозити кадр.
- [[JavaScript - 25. DOM і події]] — кожна зміна DOM — потенційні style/layout/paint; `passive`-слухачі для плавного скролу.
- [[JavaScript - 14. Debounce, throttle та async-патерни]] — як не запускати важку роботу на кожен `scroll`/`resize`.
- [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] — кешування й пріоритети завантаження ресурсів для LCP.
- [[JavaScript - 29. Workers і паралельність]] — винести важкі обчислення з головного потоку заради INP.
- [[JavaScript - 31. Продуктивність і V8]] — профілювання JS, оптимізації рушія й вимірювання.

## ⚡ Фішки

> [!reel] 🧮 offsetHeight — найдорожче читання
> Одне читання геометрії після зміни стилю змушує браузер перерахувати layout просто зараз. У циклі — сотні разів за кадр.

> [!reel] 🎞️ transform анімується навіть при зайнятому JS
> Анімації `transform`/`opacity` на окремому шарі виконує compositor-потік. Головний потік може бути зайнятий — анімація все одно плавна.

> [!reel] 🔭 Браузер читає HTML наперед
> Preload scanner біжить попереду основного парсера й завантажує картинки й скрипти, поки парсер стоїть на `<script>`. Ресурс, який видно лише з JS, він не знайде.

> [!reel] ⏱️ 16,7 мс — це на все, не лише на JS
> На 60 Гц у кадрі є 16,7 мс, а на 120 Гц — 8,3 мс. Style, layout, paint теж з цього бюджету.

> [!reel] 🔄 INP замінив FID у 2024
> FID міряв лише затримку першого кліку до старту обробника. INP — повний шлях до наступного кадру для всіх взаємодій.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чим `async` відрізняється від `defer`?
> *дуже часто · порівняння* · `jsd-26-001`
>
> Обидва качають скрипт паралельно з парсингом. `async` виконується одразу після завантаження (порядок не гарантований, може перервати парсинг). `defer` — після завершення парсингу, перед `DOMContentLoaded`, у порядку документа. Модулі за замовчуванням поводяться як `defer`.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку#📜 Завантаження скриптів — async, defer, module|Розділ: скрипти]] · [MDN: script](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)

> [!question]- Чим `DOMContentLoaded` відрізняється від `load`?
> *часто · теорія* · `jsd-26-002`
>
> `DOMContentLoaded` — HTML розібрано, DOM побудовано, `defer`/модульні скрипти виконано; картинки ще можуть вантажитись. `load` — завантажено все: зображення, стилі, iframe.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку#🧭 Від URL до першого кадру|Розділ: завантаження]] · [MDN: DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)

> [!question]- Чому CSS блокує рендер?
> *часто · теорія* · `jsd-26-003`
>
> Без CSSOM браузер не знає, як виглядають елементи. Якби він малював без стилів, користувач побачив би «голу» сторінку, яка потім перестрибнула б (FOUC). Тому перший кадр чекає на CSS у `<head>`.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку#🧭 Від URL до першого кадру|Розділ: критичний шлях]] · [web.dev: Critical rendering path](https://web.dev/articles/critical-rendering-path)

### 🟡 Middle

> [!question]- Які етапи проходить кадр після зміни DOM?
> *часто · теорія* · `jsd-26-004`
>
> Style (перерахунок стилів) → Layout (геометрія) → Paint (команди малювання) → Composite (складання шарів). Зміна геометрії запускає все; кольору — paint і composite; `transform`/`opacity` на окремому шарі — лише composite.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку#🎨 Style, layout, paint, composite|Розділ: конвеєр]] · [web.dev: Rendering performance](https://web.dev/articles/rendering-performance)

> [!question]- Що таке forced synchronous layout?
> *часто · теорія* · `jsd-26-005`
>
> Коли після зміни стилю JS читає геометрію (`offsetHeight`, `getBoundingClientRect`, `getComputedStyle`), браузер мусить порахувати layout негайно, а не в кроці рендеру. Багато таких читань між записами — layout thrashing.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку#🔁 Reflow, repaint і layout thrashing|Розділ: forced layout]] · [Paul Irish: What forces layout](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

> [!question]- Навіщо `requestAnimationFrame`, якщо є `setTimeout(fn, 16)`?
> *часто · порівняння* · `jsd-26-006`
>
> rAF синхронізований з кадром: callback виконується прямо перед style/layout, тож зміни потрапляють у найближчий кадр без пропусків і подвоєнь; частота підлаштовується під екран (60/120 Гц); у фоновій вкладці — пауза. `setTimeout` не знає про кадри й «пливе».
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку#⏱️ Кадр, rAF і бюджет 16,6 мс|Розділ: rAF]] · [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)

### 🔴 Senior

> [!question]- Що таке LCP, INP, CLS і які в них пороги?
> *часто · теорія* · `jsd-26-007`
>
> LCP — час до відмальовування найбільшого контенту (добре ≤ 2,5 с, погано > 4 с). INP — затримка взаємодії до наступного кадру (≤ 200 мс / > 500 мс). CLS — сума неочікуваних зсувів макета (≤ 0,1 / > 0,25). Оцінюються на 75-му перцентилі реальних відвідувань.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку#📊 Core Web Vitals і вплив JavaScript|Розділ: Web Vitals]] · [web.dev: Defining the thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)

> [!question]- Як покращити INP, якщо обробник кліку важкий?
> *часто · практика* · `jsd-26-008`
>
> Спершу дати візуальний відгук (змінити стан кнопки), віддати кадр, потім робити роботу шматками з `await scheduler.yield()`; некритичне — відкласти (`requestIdleCallback`); обчислення — у Worker; зменшити обсяг оновлень DOM (віртуалізація, батчинг). Діагностика — Long Animation Frames API і Performance panel.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку#📊 Core Web Vitals і вплив JavaScript|Розділ: INP]] · [web.dev: Optimize INP](https://web.dev/articles/optimize-inp)

> [!question]- Коли `will-change` шкодить?
> *рідко · теорія* · `jsd-26-009`
>
> Кожен елемент з `will-change: transform` отримує власний compositor-шар з текстурою в GPU-пам'яті. Масове застосування («на всяк випадок») дає layer explosion: більше пам'яті, довший composite, гірше на слабких пристроях. Став точково й знімай після анімації.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку#🎨 Style, layout, paint, composite|Розділ: шари]] · [MDN: will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)

## 🛠️ Практика

> [!task] Поясни своїми словами: чому transform дешевший за left
> level: junior · difficulty: easy · id: jsd-26-task-01 · tags: feynman, rendering
>
> Поясни дизайнеру (без коду, до 5 речень), чому розробник просить анімувати рух панелі через `transform`, а не через `left`, і як це відчує користувач.
>
> > [!hint]- Підказка 1
> > Які етапи конвеєра проходить кожен кадр у двох випадках?
>
> > [!hint]- Підказка 2
> > Хто виконує composite і чи залежить він від зайнятого JS?
>
> > [!solution]- Еталонне пояснення
> > Коли змінюється `left`, браузер щокадру заново вираховує, де стоїть кожен сусідній елемент, і перемальовує їх — як переверстати сторінку журналу через зсув однієї картинки. `transform` змінює лише те, як уже готовий «шар» лежить поверх інших, — як посунути прозору плівку, нічого не перемальовуючи. Цю роботу робить окремий потік на відеокарті, тож навіть якщо сторінка зайнята іншим JavaScript, рух лишається плавним. Користувач бачить рівні 60 кадрів на секунду замість ривків, а батарея ноутбука сідає повільніше.

> [!task] Вирівняй висоти карток без thrashing
> level: middle · difficulty: medium · id: jsd-26-task-02 · tags: layout, performance, raf
>
> Є функція, що вирівнює висоту карток у рядку за найвищою. Знайди проблему й перепиши так, щоб було **не більше одного** форсованого layout-у, а записи йшли в кадрі через `requestAnimationFrame`.
>
> ```js
> function equalize(cards) {
>   for (const card of cards) {
>     card.style.height = 'auto';
>     const max = Math.max(...cards.map((c) => c.offsetHeight));
>     card.style.height = max + 'px';
>   }
> }
> ```
>
> 🧪 Тести працюють без браузера: картки — фейкові об'єкти зі `style.height` і `offsetHeight`, які рахують форсовані layout-и, а `requestAnimationFrame` підмінено чергою кадрів.
>
> ```js starter
> // Перепиши цю функцію: ≤ 1 форсований layout, записи — в requestAnimationFrame
> function equalize(cards) {
>   for (const card of cards) {
>     card.style.height = 'auto';
>     const max = Math.max(...cards.map((c) => c.offsetHeight));
>     card.style.height = max + 'px';
>   }
> }
> ```
>
> ```js tests
> // Фейкові картки: запис style.height «бруднить» layout, читання offsetHeight його форсує
> let layouts = 0
> let dirty = false
> function card(natural, height = 'auto') {
>   return {
>     natural,
>     style: {
>       get height() { return height },
>       set height(v) { height = v; dirty = true },
>     },
>     get offsetHeight() {
>       if (dirty) { layouts++; dirty = false }
>       return height === 'auto' ? this.natural : parseFloat(height)
>     },
>   }
> }
> let frames = []
> globalThis.requestAnimationFrame = (cb) => frames.push(cb)
> const runFrame = () => frames.splice(0).forEach((cb) => cb(performance.now()))
> const reset = () => { layouts = 0; dirty = false; frames = [] }
>
> test('вирівнює всі картки за найвищою', () => {
>   reset()
>   const cards = [card(30), card(80), card(50)]
>   equalize(cards)
>   runFrame()
>   expect(cards.map((c) => c.style.height)).toEqual(['80px', '80px', '80px'])
> })
>
> test('не більше одного форсованого layout-у', () => {
>   reset()
>   const cards = Array.from({ length: 20 }, (_, i) => card(10 + i))
>   equalize(cards)
>   runFrame()
>   expect(layouts).toBeLessThanOrEqual(1)
> })
>
> test('нічого не пише в DOM до кадру — лише в requestAnimationFrame', () => {
>   reset()
>   const cards = [card(30, '5px'), card(40, '5px')]
>   equalize(cards)
>   expect(cards.map((c) => c.style.height)).toEqual(['5px', '5px'])
>   expect(frames.length).toBe(1)
> })
>
> test('спершу скидає старі висоти, щоб картки могли зменшитись', () => {
>   reset()
>   const cards = [card(30, '100px'), card(50, '100px')]
>   equalize(cards)
>   runFrame()
>   expect(cards.map((c) => c.style.height)).toEqual(['50px', '50px'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Скільки разів тут читається `offsetHeight` після запису? Підрахуй для 50 карток.
>
> > [!hint]- Підказка 2
> > Розбий на три фази: скинути висоти (запис) → виміряти всі (одне читання/layout) → застосувати (запис).
>
> > [!solution]- Еталонне рішення
> > ```js
> > function equalize(cards) {
> >   requestAnimationFrame(() => {
> >     // 1) усі записи-скидання
> >     for (const card of cards) card.style.height = 'auto';
> >     // 2) усі читання — один форсований layout
> >     const max = Math.max(...cards.map((card) => card.offsetHeight));
> >     // 3) усі записи — layout буде в звичайному кроці рендеру
> >     for (const card of cards) card.style.height = `${max}px`;
> >   });
> > }
> > ```
> >
> > Оригінал для 50 карток робить 50 × 50 = 2500 читань, і кожна ітерація форсує layout після запису. Нова версія — один layout на вимірі й один у рендері. А ще краще — CSS Grid/Flexbox з `align-items: stretch`, де JS не потрібен узагалі.

> [!task] Обробник, дружній до INP
> level: senior · difficulty: hard · id: jsd-26-task-03 · tags: inp, scheduling, long-tasks
>
> Обробник кліку фільтрує 50 000 товарів і перемальовує список — це 400 мс одним шматком. Напиши `handleFilterClick(button, items, predicate, render)`, який:
> 1. одразу показує стан завантаження (`button.disabled = true`, `aria-busy`), і цей стан **встигає намалюватися**;
> 2. фільтрує шматками, не довше ~8 мс підряд, віддаючи керування між шматками;
> 3. якщо користувач клікнув знову, попередня обробка скасовується;
> 4. наприкінці викликає `render(result)` і знімає стан завантаження.
>
> 🧪 Тести працюють без браузера: `button` — фейковий об'єкт з `disabled` і `setAttribute`/`removeAttribute`/`getAttribute`, а таймери й `performance.now()` — штучний годинник.
>
> ```js starter
> const yieldToMain = () =>
>   globalThis.scheduler?.yield
>     ? scheduler.yield()
>     : new Promise((resolve) => setTimeout(resolve, 0))
>
> let current = null
>
> async function handleFilterClick(button, items, predicate, render) {
>   // твій код
> }
> ```
>
> ```js tests
> // Тести керують часом: setTimeout і performance.now — фейкові
> const useFakeYield = () => {
>   vi.useFakeTimers()
>   Object.defineProperty(globalThis, 'scheduler', { value: undefined, configurable: true, writable: true })
> }
> const makeButton = () => {
>   const attrs = new Map()
>   return {
>     disabled: false,
>     setAttribute: (k, v) => attrs.set(k, String(v)),
>     removeAttribute: (k) => attrs.delete(k),
>     getAttribute: (k) => attrs.get(k) ?? null,
>   }
> }
> const flush = async () => { for (let i = 0; i < 10; i++) await Promise.resolve() }
> let turn = 0
> async function drive(promise) {
>   let done = false
>   promise.then(() => { done = true })
>   for (let i = 0; i < 500 && !done; i++) {
>     turn++
>     vi.advanceTimersByTime(1)
>     await flush()
>   }
>   return promise
> }
>
> test('стан завантаження ставиться одразу, а важка робота — після yield', async () => {
>   useFakeYield()
>   const button = makeButton()
>   const predicate = vi.fn(() => true)
>   const p = handleFilterClick(button, [1, 2, 3], predicate, () => {})
>   expect(button.disabled).toBe(true)
>   expect(button.getAttribute('aria-busy')).toBe('true')
>   await flush()
>   expect(predicate).not.toHaveBeenCalled()
>   await drive(p)
> })
>
> test('наприкінці викликає render з результатом і знімає стан', async () => {
>   useFakeYield()
>   const button = makeButton()
>   const render = vi.fn()
>   await drive(handleFilterClick(button, [1, 2, 3, 4, 5, 6], (n) => n % 2 === 0, render))
>   expect(render).toHaveBeenCalledWith([2, 4, 6])
>   expect(button.disabled).toBe(false)
>   expect(button.getAttribute('aria-busy')).toBeNull()
> })
>
> test('фільтрує шматками ≤ ~8 мс, віддаючи керування між ними', async () => {
>   useFakeYield()
>   const chunks = new Map() // turn → скільки елементів оброблено за цей «хід»
>   const slowPredicate = () => {
>     vi.advanceTimersByTime(1) // кожен елемент «коштує» 1 мс
>     chunks.set(turn, (chunks.get(turn) ?? 0) + 1)
>     return true
>   }
>   const items = Array.from({ length: 40 }, (_, i) => i)
>   const render = vi.fn()
>   await drive(handleFilterClick(makeButton(), items, slowPredicate, render))
>   expect(chunks.size).toBeGreaterThanOrEqual(4)
>   expect(Math.max(...chunks.values())).toBeLessThanOrEqual(10)
>   expect(render.mock.calls[0][0]).toHaveLength(40)
> })
>
> test('новий клік скасовує попередню обробку', async () => {
>   useFakeYield()
>   const button = makeButton()
>   const first = vi.fn()
>   const second = vi.fn()
>   const p1 = handleFilterClick(button, [1, 2], () => true, first)
>   const p2 = handleFilterClick(button, [3], () => true, second)
>   await drive(Promise.all([p1, p2]))
>   expect(first).not.toHaveBeenCalled()
>   expect(second).toHaveBeenCalledWith([3])
>   expect(button.disabled).toBe(false)
> })
> ```
>
> > [!hint]- Підказка 1
> > «Віддати керування»: `scheduler.yield()`, якщо є, інакше `new Promise((r) => setTimeout(r, 0))`. Щоб стан кнопки намалювався, перший `yield` — до важкої роботи.
>
> > [!hint]- Підказка 2
> > Скасування — `AbortController` у змінній замикання; перевіряй `signal.aborted` після кожного `yield`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const yieldToMain = () =>
> >   globalThis.scheduler?.yield
> >     ? scheduler.yield()
> >     : new Promise((resolve) => setTimeout(resolve, 0));
> >
> > let current = null;
> >
> > async function handleFilterClick(button, items, predicate, render) {
> >   current?.abort();
> >   const controller = (current = new AbortController());
> >   const { signal } = controller;
> >
> >   button.disabled = true;
> >   button.setAttribute('aria-busy', 'true');
> >   await yieldToMain(); // дати кадру з «завантаженням» намалюватися
> >   if (signal.aborted) return;
> >
> >   const result = [];
> >   let start = performance.now();
> >   for (let i = 0; i < items.length; i++) {
> >     if (predicate(items[i])) result.push(items[i]);
> >     if (performance.now() - start > 8) {
> >       await yieldToMain();
> >       if (signal.aborted) return; // новий клік — ця робота більше не потрібна
> >       start = performance.now();
> >     }
> >   }
> >
> >   if (signal.aborted) return;
> >   render(result);
> >   button.disabled = false;
> >   button.removeAttribute('aria-busy');
> >   current = null;
> > }
> > ```
> >
> > `scheduler.yield()` кращий за `setTimeout`, бо продовження отримує пріоритет над іншими задачами, і робота не «відстає». Якщо фільтр — чисті обчислення, ще краще виконати його у Worker, а в головному потоці лишити тільки `render`.

## 📚 Джерела та що почитати

- 🟢 [MDN — How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work) — від навігації до пікселів простою мовою.
- 🟢 [web.dev — Understand the critical path](https://web.dev/articles/critical-rendering-path) — що блокує перший рендер і як це виправити.
- 🟡 [web.dev — Avoid large, complex layouts and layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing) — forced layout на прикладах.
- 🟡 [Chrome for Developers — Inside look at modern web browser (part 3)](https://developer.chrome.com/blog/inside-browser-part3) — як працюють main thread, compositor і шари.
- 🟡 [web.dev — Web Vitals](https://web.dev/articles/vitals) — LCP, INP, CLS, пороги й інструменти.
- 🟡 [web.dev — Optimize long tasks](https://web.dev/articles/optimize-long-tasks) — `scheduler.yield()` і розбиття роботи.
- 🛠️ [Paul Irish — What forces layout/reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) — повний список властивостей, що форсують layout.
- 🔴 [HTML Standard — Update the rendering](https://html.spec.whatwg.org/multipage/webappapis.html#update-the-rendering) — крок рендеру в event loop.
- 🔴 [HTML Standard — script async/defer](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async) — точні правила завантаження скриптів.
- 🎥 [Jake Archibald — In The Loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0) — event loop, rAF і рендер у одній доповіді.

> [!important] Підсумок
> - Конвеєр: HTML → DOM, CSS → CSSOM → style → layout → paint → composite. CSS блокує рендер, синхронний скрипт — парсинг.
> - `defer`/`module` — для застосунку (після парсингу, по порядку), `async` — для незалежних скриптів.
> - Геометрія → layout + paint; колір → paint; `transform`/`opacity` → лише composite, навіть при зайнятому JS.
> - Читання геометрії після запису форсує layout; групуй читання перед записами, візуальні зміни — в `requestAnimationFrame`.
> - Кадр — 16,7 мс на все; long tasks шкодять INP, render-blocking — LCP, вставки без місця — CLS.
