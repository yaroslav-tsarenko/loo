---
title: "Браузер: DOM, події, Web APIs, рендеринг"
order: 11
tags: [dom, events, browser, rendering, web-apis]
estimatedMinutes: 95
---

# JS Interview Q&A — 11. Браузер: DOM, події, Web APIs, рендеринг

## 🟢 Junior

> [!question]- Як влаштоване DOM-дерево і чим відрізняються `querySelectorAll`, `getElementsByClassName` та `children`?
> *часто · порівняння* · `js-11-001`
>
> **DOM** — це дерево вузлів (`Document`, `Element`, `Text`, `Comment`), яке браузер будує з HTML і яким JS керує через API. Методи пошуку відрізняються тим, що саме повертають:
>
> - `getElementById` / `querySelector` — один елемент або `null`.
> - `querySelectorAll` — **статичний** `NodeList`, тобто знімок на момент виклику.
> - `getElementsByClassName`, `getElementsByTagName`, `children` — **живі** `HTMLCollection`, що оновлюються разом з DOM.
> - `childNodes` — живий `NodeList`, включно з текстовими вузлами (пробіли між тегами).
>
> ```js
> const live = document.getElementsByClassName('item');
> const snapshot = document.querySelectorAll('.item');
> document.body.append(Object.assign(document.createElement('div'), { className: 'item' }));
> console.log(live.length - snapshot.length); // 1
> ```
>
> **На співбесіді:** якщо видаляти елементи в циклі по живій колекції, легко пропустити половину. Ітеруйте по статичній копії (`[...collection]` або `querySelectorAll`).
>
> 📚 [[JavaScript - 25. DOM і події|Розділ: DOM і події]] · [MDN: Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) · [MDN: HTMLCollection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection)

> [!question]- Які фази проходить DOM-подія і в якому порядку викликаються обробники?
> *дуже часто · теорія* · `js-11-002`
>
> Подія проходить три фази: **capture** (від `window` вниз до батька цілі), **target** (на самому елементі) і **bubble** (назад угору до `window`). За замовчуванням `addEventListener` реєструє обробник на фазі bubbling, а з `{ capture: true }` (або `true` третім аргументом) — на фазі capture.
>
> ```js
> const button = document.querySelector('button');
> document.body.addEventListener('click', () => console.log('body capture'), true);
> document.body.addEventListener('click', () => console.log('body bubble'));
> button.addEventListener('click', () => console.log('button'));
> // клік по button: body capture → button → body bubble
> ```
>
> Спливають не всі події: `focus`/`blur`, `mouseenter`/`mouseleave`, `load` на елементах. Для них є спливаючі аналоги (`focusin`/`focusout`, `mouseover`/`mouseout`) або capture. Поточну фазу показує `event.eventPhase` (1, 2, 3).
>
> **На співбесіді:** `event.target` — елемент, де подія виникла, а `event.currentTarget` — той, чий обробник виконується зараз.
>
> 📚 [[JavaScript - 25. DOM і події|Розділ: DOM і події]] · [MDN: Event bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling) · [javascript.info: Bubbling and capturing](https://javascript.info/bubbling-and-capturing)

> [!question]- Що таке делегування подій і коли воно не спрацює?
> *дуже часто · практика* · `js-11-003`
>
> Делегування — це **один обробник на спільному предку** замість обробника на кожному дочірньому елементі. Завдяки bubbling подія з будь-якого нащадка доходить до предка, а потрібний елемент знаходимо через `event.target.closest(selector)`.
>
> ```js
> const list = document.querySelector('#todo-list');
> list.addEventListener('click', (event) => {
>   const button = event.target.closest('button[data-action="delete"]');
>   if (!button || !list.contains(button)) return;
>   button.closest('li').remove();
> });
> ```
>
> Делегування працює для елементів, доданих пізніше, економить слухачі й пам'ять і спрощує прибирання. Обмеження:
>
> - події без bubbling (`focus`, `mouseenter`) — беріть `focusin`, `mouseover` або capture;
> - `stopPropagation()` у внутрішньому коді ламає делегування;
> - `closest` може знайти елемент поза контейнером, тому потрібна перевірка `contains`.
>
> 📚 [[JavaScript - 25. DOM і події|Розділ: DOM і події]] · [MDN: Event bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling) · [javascript.info: Event delegation](https://javascript.info/event-delegation)

> [!question]- Чим відрізняються `preventDefault`, `stopPropagation` і `stopImmediatePropagation`?
> *дуже часто · порівняння* · `js-11-004`
>
> Вони керують різними речами:
>
> - `preventDefault()` скасовує **дію браузера за замовчуванням** (перехід за посиланням, submit форми, скрол), але подія поширюється далі. Працює лише для `cancelable` подій, результат видно в `event.defaultPrevented`.
> - `stopPropagation()` зупиняє поширення до наступних елементів шляху. Інші обробники на **поточному** елементі все одно виконаються.
> - `stopImmediatePropagation()` робить те саме і додатково не викликає решту обробників на поточному елементі.
>
> ```js
> const link = document.querySelector('a');
> link.addEventListener('click', (e) => e.preventDefault()); // перехід скасовано, подія спливає далі
> link.addEventListener('click', (e) => e.stopImmediatePropagation());
> link.addEventListener('click', () => console.log('never')); // не виконається
> ```
>
> **На співбесіді:** `return false` в обробнику `addEventListener` нічого не робить. У властивості `onclick` воно скасовує дію за замовчуванням, а в jQuery робить і `preventDefault`, і `stopPropagation`.
>
> 📚 [[JavaScript - 25. DOM і події|Розділ: DOM і події]] · [MDN: Event.preventDefault()](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) · [MDN: Event.stopImmediatePropagation()](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopImmediatePropagation)

> [!question]- Чим `DOMContentLoaded` відрізняється від `load`?
> *часто · порівняння* · `js-11-005`
>
> `DOMContentLoaded` спрацьовує на `document`, коли HTML повністю розпарсено і виконано всі синхронні, `defer` і module-скрипти. Картинок, iframe і шрифтів він не чекає. `load` спрацьовує на `window`, коли завантажено **все**: зображення, стилі, iframe.
>
> `document.readyState` відображає ці етапи: `loading` → `interactive` (приблизно момент `DOMContentLoaded`) → `complete` (приблизно момент `load`).
>
> ```js
> function init() {
>   console.log('DOM готовий');
> }
> if (document.readyState === 'loading') {
>   document.addEventListener('DOMContentLoaded', init);
> } else {
>   init(); // подія вже минула, підписка не спрацювала б
> }
> ```
>
> **На співбесіді:** `async`-скрипт може виконатися і до, і після `DOMContentLoaded`. Стилі, що стоять перед синхронним скриптом, затримують і його виконання, і саму подію.
>
> 📚 [[JavaScript - 25. DOM і події|Розділ: DOM і події]] · [MDN: DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event) · [javascript.info: DOMContentLoaded, load](https://javascript.info/onload-ondomcontentloaded)

> [!question]- Чим відрізняються `localStorage`, `sessionStorage` і cookies?
> *дуже часто · порівняння* · `js-11-006`
>
> Усі три зберігають дані на клієнті, але мають різний час життя і поведінку:
>
> - `localStorage` живе до явного видалення, спільний для всіх вкладок одного origin, зазвичай ~5 МБ, зберігає лише рядки, API синхронний.
> - `sessionStorage` ізольований на рівні вкладки: переживає перезавантаження, але зникає разом із вкладкою.
> - **cookies** — ~4 КБ, мають `Expires`/`Max-Age`, `Domain`, `Path`, і браузер **автоматично надсилає їх** з кожним запитом на сервер. `HttpOnly` ховає cookie від JS, `Secure` дозволяє лише HTTPS, `SameSite` обмежує крос-сайтові запити.
>
> ```js
> localStorage.setItem('prefs', JSON.stringify({ theme: 'dark' }));
> const prefs = JSON.parse(localStorage.getItem('prefs') ?? '{}');
> window.addEventListener('storage', (e) => console.log(e.key, e.newValue)); // зміни з інших вкладок
> ```
>
> **На співбесіді:** усе, що лежить у Web Storage, доступне будь-якому скрипту на сторінці, тож під час XSS його легко вкрасти.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs|Розділ: сховища та Web APIs]] · [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) · [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)

> [!question]- Як `defer`, `async` і `type="module"` впливають на завантаження і виконання скриптів?
> *дуже часто · порівняння* · `js-11-007`
>
> Звичайний `<script src>` **блокує парсинг** HTML: браузер зупиняється, завантажує і виконує скрипт.
>
> - `async` — завантаження паралельно з парсингом, виконання одразу після завантаження. Порядок між скриптами не гарантований. Підходить для незалежних скриптів (аналітика).
> - `defer` — завантаження паралельно, виконання після завершення парсингу **у порядку в документі**, перед `DOMContentLoaded`.
> - `type="module"` за замовчуванням відкладений, як `defer`. `async` для модулів працює, а `defer` нічого не змінює. Модулі виконуються в strict mode, мають власну область видимості і завантажуються з CORS.
>
> ```html
> <script src="/analytics.js" async></script>
> <script src="/vendor.js" defer></script>
> <script src="/app.js" defer></script> <!-- гарантовано після vendor.js -->
> <script type="module" src="/main.js"></script>
> ```
>
> **На співбесіді:** `defer` і `async` ігноруються для inline-скриптів без `src`, але inline `type="module"` теж відкладається.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку|Розділ: як браузер рендерить сторінку]] · [MDN: script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script) · [javascript.info: Scripts: async, defer](https://javascript.info/script-async-defer)

## 🟡 Middle

> [!question]- Навіщо опції `passive`, `once` і `signal` в `addEventListener`?
> *часто · код* · `js-11-008`
>
> Третім аргументом `addEventListener` можна передати об'єкт опцій:
>
> - `passive: true` — обіцянка, що обробник не викличе `preventDefault()`. Браузер може скролити одразу, не чекаючи JS, що критично для `touchstart`/`touchmove`/`wheel`. Виклик `preventDefault()` у passive-обробнику ігнорується з попередженням у консолі. Браузери (зокрема Chromium) роблять ці події passive за замовчуванням, якщо слухач висить на `window`, `document` чи `body`.
> - `once: true` — обробник знімається автоматично після першого виклику.
> - `signal` — `AbortSignal`. `controller.abort()` знімає всі слухачі, зареєстровані з цим сигналом, і не треба зберігати посилання на функції для `removeEventListener`.
>
> ```js
> const onScroll = () => console.log(window.scrollY);
> const onResize = () => console.log(window.innerWidth);
> const dialog = document.querySelector('dialog');
>
> const controller = new AbortController();
> const { signal } = controller;
> window.addEventListener('scroll', onScroll, { passive: true, signal });
> window.addEventListener('resize', onResize, { signal });
> dialog.addEventListener('close', () => console.log('closed'), { once: true });
>
> controller.abort(); // знімає обидва слухачі, наприклад при unmount компонента
> ```
>
> **На співбесіді:** `removeEventListener` звіряє лише функцію і прапорець `capture`. Решта опцій на пошук слухача не впливає.
>
> 📚 [[JavaScript - 25. DOM і події|Розділ: DOM і події]] · [MDN: addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) · [MDN: AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

> [!question]- Як створити й відправити кастомну подію і які тут є пастки?
> *іноді · код* · `js-11-009`
>
> Через `new CustomEvent(type, { detail, bubbles, cancelable, composed })` і `element.dispatchEvent(event)`. Дані передаються в `detail`.
>
> ```js
> const card = document.querySelector('.product-card');
> document.addEventListener('cart:add', (e) => console.log('add', e.detail.sku));
>
> const event = new CustomEvent('cart:add', {
>   detail: { sku: 'SKU-42', qty: 1 },
>   bubbles: true,
>   cancelable: true,
> });
> const notCancelled = card.dispatchEvent(event);
> if (!notCancelled) console.log('хтось викликав preventDefault');
> ```
>
> Пастки:
>
> - `bubbles` за замовчуванням `false`, тож без нього слухач на `document` нічого не отримає.
> - `dispatchEvent` **синхронний**: усі обробники виконуються до повернення з виклику. Виняток в одному обробнику не перериває решту, він репортиться як uncaught error.
> - Щоб подія вийшла за межі Shadow DOM, потрібен `composed: true`.
> - `dispatchEvent` повертає `false`, якщо подія `cancelable` і хтось викликав `preventDefault()`.
>
> **На співбесіді:** для подій поза DOM можна успадкуватися від `EventTarget`: він доступний і в браузері, і в Node.
>
> 📚 [[JavaScript - 25. DOM і події|Розділ: DOM і події]] · [MDN: CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) · [javascript.info: Dispatching custom events](https://javascript.info/dispatch-events)

> [!question]- Що таке critical rendering path і як JS на нього впливає?
> *часто · теорія* · `js-11-010`
>
> Critical rendering path — послідовність кроків від байтів HTML до перших пікселів на екрані:
>
> 1. HTML перетворюється на DOM, CSS — на **CSSOM**. CSS render-blocking: без CSSOM браузер не малює.
> 2. DOM і CSSOM об'єднуються в render tree (лише видимі вузли, без `display: none`).
> 3. Layout обчислює геометрію.
> 4. Paint растеризує вміст у шари.
> 5. Composite складає шари на екрані.
>
> JS втручається двічі. Синхронний скрипт **блокує парсер**. До того ж він чекає на CSSOM стилів, що стоять перед ним, бо може читати обчислені стилі. Ланцюг «CSS → JS → решта HTML» — класична причина повільного першого рендеру.
>
> Оптимізації:
>
> - `defer` або `type="module"` для скриптів;
> - inline критичного CSS, решта завантажується асинхронно;
> - `<link rel="preload">` для критичних ресурсів (шрифт, LCP-зображення);
> - менше і коротші ланцюжки запитів, `font-display: swap` для шрифтів.
>
> **На співбесіді:** JS коштує не лише завантаження. Parse, compile і execute на слабкому мобільному — окрема і часто більша стаття витрат.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку|Розділ: як браузер рендерить сторінку]] · [MDN: Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path) · [web.dev: Critical rendering path](https://web.dev/articles/critical-rendering-path)

> [!question]- Чим відрізняються reflow (layout), repaint і composite і що з цього найдорожче?
> *дуже часто · порівняння* · `js-11-011`
>
> Це три етапи конвеєра, які браузер перезапускає після змін. З якого етапу він почне, залежить від зміненої властивості:
>
> - **Layout (reflow)** — перерахунок геометрії: `width`, `height`, `top`, `margin`, `font-size`, додавання і видалення вузлів. Найдорожчий етап, бо може зачепити предків, сусідів і нащадків. Після layout завжди йдуть paint і composite.
> - **Paint (repaint)** — перемальовування пікселів без зміни геометрії: `color`, `background`, `box-shadow`.
> - **Composite** — лише перекомпонування готових шарів на GPU: `transform`, `opacity` (для елемента на окремому шарі). Найдешевший етап, може виконуватися поза main thread.
>
> ```js
> const box = document.querySelector('.box');
> const x = 120;
> box.style.left = `${x}px`; // layout → paint → composite щокадру
> box.style.transform = `translateX(${x}px)`; // лише composite
> ```
>
> Тому анімують `transform` і `opacity`. `will-change: transform` заздалегідь виносить елемент на окремий шар, але кожен шар займає пам'ять GPU, тож вмикайте точково.
>
> **На співбесіді:** перевіряйте в DevTools (Performance, Rendering → Paint flashing), а не на око.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку|Розділ: як браузер рендерить сторінку]] · [web.dev: Rendering performance](https://web.dev/articles/rendering-performance) · [web.dev: Stick to compositor-only properties](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count)

> [!question]- Для чого `IntersectionObserver`, `ResizeObserver` і `MutationObserver` і чим вони кращі за ручні перевірки?
> *часто · практика* · `js-11-012`
>
> Усі три — **асинхронні спостерігачі**: браузер сам збирає зміни пачкою і викликає callback. Не треба щокадру читати геометрію в обробниках `scroll`/`resize` і провокувати зайвий layout.
>
> - `IntersectionObserver` відстежує перетин елемента з viewport або `root`. Використовується для lazy loading, infinite scroll, аналітики показів. Налаштовується через `threshold` і `rootMargin`.
> - `ResizeObserver` відстежує зміну розмірів конкретного елемента, а не вікна. Корисний для адаптивних компонентів і графіків.
> - `MutationObserver` відстежує зміни DOM: `childList`, `attributes`, `characterData`, `subtree`. Callback викликається як мікрозадача.
>
> ```js
> const io = new IntersectionObserver((entries) => {
>   for (const entry of entries) {
>     if (!entry.isIntersecting) continue;
>     entry.target.src = entry.target.dataset.src;
>     io.unobserve(entry.target);
>   }
> }, { rootMargin: '200px' });
> document.querySelectorAll('img[data-src]').forEach((img) => io.observe(img));
> ```
>
> **На співбесіді:** викликайте `disconnect()` при знятті компонента. Якщо в callback `ResizeObserver` змінювати розмір того ж елемента, можна отримати «ResizeObserver loop completed with undelivered notifications».
>
> 📚 [[JavaScript - 28. Сховища та Web APIs|Розділ: сховища та Web APIs]] · [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) · [MDN: ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

> [!question]- Які неочевидні деталі `fetch` треба знати: помилки, `credentials`, тіло відповіді, скасування?
> *дуже часто · код* · `js-11-013`
>
> Головна пастка: `fetch` **не відхиляє проміс на 4xx/5xx**. Він reject-иться лише при мережевій помилці, блокуванні CORS або abort, а статус треба перевіряти через `response.ok`.
>
> - `credentials`: `'same-origin'` (за замовчуванням) надсилає cookies лише на свій origin. `'include'` надсилає їх і крос-origin, але сервер мусить відповісти `Access-Control-Allow-Credentials: true` і конкретним (не `*`) `Access-Control-Allow-Origin`. `'omit'` не надсилає ніколи.
> - Тіло — це stream, його можна прочитати **один раз** (`bodyUsed`). Для повторного читання є `response.clone()`.
> - Таймауту за замовчуванням немає: використовуйте `AbortController` або `AbortSignal.timeout(ms)`.
> - Для JSON треба самостійно викликати `JSON.stringify` і виставити `Content-Type`.
>
> ```js
> async function postJson(url, data) {
>   const res = await fetch(url, {
>     method: 'POST',
>     headers: { 'Content-Type': 'application/json' },
>     body: JSON.stringify(data),
>     credentials: 'include',
>     signal: AbortSignal.timeout(5000),
>   });
>   if (!res.ok) throw new Error(`HTTP ${res.status}`);
>   return res.json();
> }
> ```
>
> **На співбесіді:** при спрацюванні `AbortSignal.timeout` проміс відхиляється з `TimeoutError`, а при ручному `abort()` — з `AbortError`. Їх варто розрізняти в UI.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP|Розділ: мережа: fetch, CORS і HTTP]] · [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) · [MDN: Request: credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)

> [!question]- Як працює CORS і коли браузер робить preflight-запит?
> *дуже часто · теорія* · `js-11-014`
>
> CORS — механізм, яким **сервер дозволяє** сторінці з іншого origin (схема + хост + порт) читати свої відповіді. Обмеження накладає браузер через same-origin policy, а сервер знімає його заголовками на кшталт `Access-Control-Allow-Origin`.
>
> Simple request іде одразу, без preflight, якщо виконано всі умови:
>
> - метод `GET`, `HEAD` або `POST`;
> - лише заголовки зі safelist (`Accept`, `Accept-Language`, `Content-Language`, `Content-Type`);
> - `Content-Type` — `text/plain`, `multipart/form-data` або `application/x-www-form-urlencoded`.
>
> Інакше (`PUT`/`DELETE`, `application/json`, `Authorization`, кастомні заголовки) браузер спершу надсилає **preflight** `OPTIONS` з `Access-Control-Request-Method` і `Access-Control-Request-Headers`. Сервер відповідає `Access-Control-Allow-Methods`/`-Headers`, а `Access-Control-Max-Age` дозволяє кешувати рішення.
>
> **На співбесіді:** CORS не захищає сервер. Simple request доходить до сервера і виконується, браузер лише не дає JS прочитати відповідь. Тому від CSRF рятують SameSite і токени, а не CORS. `mode: 'no-cors'` не обходить CORS, а повертає opaque-відповідь, яку не можна прочитати.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP|Розділ: мережа: fetch, CORS і HTTP]] · [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) · [Fetch Spec: CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol)

> [!question]- Коли для `scroll`/`resize` брати debounce, коли throttle, а коли жодне з них?
> *часто · порівняння* · `js-11-015`
>
> **Debounce** викликає функцію після паузи в подіях: «користувач закінчив змінювати розмір вікна — перерахуй layout». **Throttle** викликає її не частіше ніж раз на N мс, поки події йдуть: «оновлюй прогрес читання під час скролу».
>
> Для візуальних оновлень краще синхронізуватися з кадром через `requestAnimationFrame`, а не з довільними мілісекундами. Тоді робота виконується максимум раз на кадр і прямо перед рендером.
>
> ```js
> function rafThrottle(fn) {
>   let scheduled = false;
>   let lastArgs;
>   return (...args) => {
>     lastArgs = args;
>     if (scheduled) return;
>     scheduled = true;
>     requestAnimationFrame(() => {
>       scheduled = false;
>       fn(...lastArgs);
>     });
>   };
> }
>
> const header = document.querySelector('header');
> const updateHeader = () => header.classList.toggle('compact', window.scrollY > 80);
> window.addEventListener('scroll', rafThrottle(updateHeader), { passive: true });
> ```
>
> Часто найкраще рішення — прибрати обробник взагалі: видимість відстежує `IntersectionObserver`, розміри — `ResizeObserver`, адаптивність — CSS media і container queries.
>
> **На співбесіді:** throttle без trailing-виклику губить фінальну позицію скролу.
>
> 📚 [[JavaScript - 14. Debounce, throttle та async-патерни#Debounce vs throttle: коли що|Розділ: debounce vs throttle]] · [MDN: Throttle](https://developer.mozilla.org/en-US/docs/Glossary/Throttle) · [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## 🔴 Senior

> [!question]- Що таке layout thrashing, як його знайти в продакшн-коді і виправити?
> *часто · код* · `js-11-016`
>
> Layout thrashing — це чергування **записів** у DOM чи стилі з **читаннями** геометрії в межах одного кадру. Після запису layout стає «брудним», і наступне читання (`offsetHeight`, `getBoundingClientRect()`, `scrollTop`, `getComputedStyle()`) змушує браузер синхронно перерахувати його. Це **forced synchronous layout**; у циклі на N елементів він дає N повних layout за кадр.
>
> ```js
> const items = [...document.querySelectorAll('.card')];
>
> // погано: read → write → read → write
> for (const el of items) {
>   el.style.height = `${el.offsetWidth * 0.75}px`;
> }
>
> // добре: спершу всі читання, потім усі записи
> const widths = items.map((el) => el.offsetWidth);
> items.forEach((el, i) => {
>   el.style.height = `${widths[i] * 0.75}px`;
> });
> ```
>
> Як знаходити:
>
> - DevTools → Performance: фіолетові блоки Layout з попередженням «Forced reflow» і стеком виклику;
> - у RUM — Long Animation Frames API (`PerformanceObserver` з типом `long-animation-frame`, Chromium), який показує скрипти, що з'їдають кадр;
> - часті винуватці — сторонні віджети, «вимірювальні» хуки в кожному компоненті, `scrollIntoView` у циклі.
>
> Як виправляти: групувати читання і записи (підхід fastdom), переносити записи в `requestAnimationFrame`, замінювати геометричні анімації на `transform`, а ручні вимірювання — на `ResizeObserver`, який віддає розміри без примусового layout. Якщо кадр ділять кілька незалежних модулів, домовтеся про одну фазу читання і одну фазу запису.
>
> 📚 [[JavaScript - 26. Як браузер рендерить сторінку|Розділ: як браузер рендерить сторінку]] · [web.dev: Avoid large, complex layouts and layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing) · [Paul Irish: What forces layout/reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

> [!question]- Де зберігати на клієнті токени сесії, великі дані й офлайн-кеш і які компроміси в кожного сховища?
> *часто · порівняння* · `js-11-017`
>
> Вибір залежить від трьох питань: чи потрібен доступ із JS, який обсяг і структура даних, чи потрібні вони у воркерах.
>
> - Сесія: найчастіше cookie з `HttpOnly; Secure; SameSite=Lax`. XSS не прочитає токен, хоча зможе робити запити від імені користувача, поки сторінка відкрита. Ціна — cookie надсилаються автоматично, тож потрібен захист від CSRF. Токен у `localStorage` зручний для SPA, але будь-який XSS чи скомпрометований npm-пакет його **ексфільтрує**.
> - `localStorage`: синхронний, блокує main thread, лише рядки, недоступний у Web і Service Workers. Годиться для дрібних налаштувань.
> - IndexedDB: асинхронний, транзакційний, зберігає structured clone (об'єкти, `Blob`, `ArrayBuffer`), має значно більші квоти і доступний у воркерах. Основа офлайн-режиму, але API незручний, тож зазвичай беруть обгортку (`idb`, Dexie).
> - Cache Storage: пари `Request`/`Response` для Service Worker.
>
> ```js
> const { usage, quota } = await navigator.storage.estimate();
> const persisted = await navigator.storage.persist(); // просить браузер не витісняти дані
> console.log(usage, quota, persisted);
> ```
>
> Не забувайте про витіснення. За замовчуванням сховище **best-effort**, і браузер може очистити його, коли бракує місця на диску. Safari з ITP видаляє script-writable storage сайту, з яким користувач не взаємодіяв 7 днів. Тому клієнтське сховище — це кеш, а не джерело істини.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs|Розділ: сховища та Web APIs]] · [OWASP: Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) · [MDN: Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

> [!question]- Як побудувати клієнтський роутинг на History API і що зазвичай забувають?
> *часто · практика* · `js-11-018`
>
> `history.pushState(state, '', url)` змінює URL і додає запис в історію **без перезавантаження та без події**, `replaceState` замінює поточний запис. `popstate` спрацьовує лише при навігації по історії (назад/вперед), а не на `pushState`. Отже, роутер перехоплює кліки по посиланнях, викликає `pushState` і рендер та слухає `popstate`.
>
> ```js
> const view = document.querySelector('#app');
> function render(path) {
>   view.textContent = `Page: ${path}`;
> }
>
> document.addEventListener('click', (e) => {
>   const a = e.target.closest('a[href]');
>   if (!a || a.target || a.hasAttribute('download')) return;
>   if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
>   const url = new URL(a.href);
>   if (url.origin !== location.origin) return;
>   e.preventDefault();
>   history.pushState(null, '', url);
>   render(url.pathname);
> });
> window.addEventListener('popstate', () => render(location.pathname));
> render(location.pathname);
> ```
>
> Що забувають:
>
> - **fallback на сервері**: deep link `/orders/42` має віддавати `index.html`, інакше після F5 буде 404;
> - скрол: `history.scrollRestoration = 'manual'` і власне відновлення позиції після асинхронного рендеру;
> - доступність: перенести фокус на заголовок нової сторінки й оновити `document.title`;
> - гонки: при швидких переходах скасовувати попередні завантаження даних через `AbortController`;
> - `state` у `pushState` копіюється через structured clone, тож туди кладуть лише невеликі серіалізовані дані (наприклад, позицію скролу), а не весь стан сторінки.
>
> Новіший Navigation API (`navigation.addEventListener('navigate', …)`) перехоплює всі навігації централізовано. Перед використанням перевіряйте його підтримку в цільових браузерах.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs|Розділ: сховища та Web APIs]] · [MDN: History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) · [MDN: Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API)

> [!question]- Що дають Web Components і Shadow DOM і де їхні реальні обмеження?
> *іноді · теорія* · `js-11-019`
>
> Web Components — набір стандартів: **Custom Elements** (власні теги з lifecycle), **Shadow DOM** (інкапсуляція розмітки і стилів), а також `<template>` і `<slot>`. Головна цінність — компонент, що працює в будь-якому фреймворку або без нього. Типові кейси — дизайн-система для кількох стеків або віджет, який вбудовується на чужі сайти.
>
> ```js
> class UserBadge extends HTMLElement {
>   static observedAttributes = ['name'];
>   constructor() {
>     super();
>     this.attachShadow({ mode: 'open' }).innerHTML = '<style>span{font-weight:600}</style><span></span>';
>   }
>   attributeChangedCallback(attr, oldValue, newValue) {
>     this.shadowRoot.querySelector('span').textContent = newValue;
>   }
> }
> customElements.define('user-badge', UserBadge);
> ```
>
> Обмеження і нюанси:
>
> - стилі ззовні проникають у shadow tree лише через успадковувані властивості, CSS custom properties і `::part`;
> - події, що перетинають shadow boundary, ретаргетуються (`event.target` стає хостом), а кастомним подіям потрібен `composed: true`;
> - ARIA-зв'язки через `id` (`aria-labelledby`) не працюють крізь межу shadow root;
> - участь у формах можлива лише через `ElementInternals` і `static formAssociated = true`;
> - SSR — через Declarative Shadow DOM (`<template shadowrootmode="open">`), який уже підтримують усі основні браузери;
> - атрибути — лише рядки, тож складні дані передають через властивості.
>
> 📚 [[JavaScript - 25. DOM і події|Розділ: DOM і події]] · [MDN: Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) · [MDN: Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)

> [!question]- Як працює lifecycle Service Worker і чому після деплою користувачі бачать стару версію?
> *часто · теорія* · `js-11-020`
>
> Service Worker — скрипт в окремому потоці між сторінкою і мережею: перехоплює `fetch` у своєму `scope`, працює з Cache Storage, отримує push. Вимагає HTTPS (крім `localhost`). Lifecycle:
>
> 1. `register()` → **install**: зазвичай precache статики.
> 2. **waiting**: новий SW чекає, доки не закриються всі вкладки, якими керує старий.
> 3. **activate**: чистка старих кешів; `clients.claim()` бере під контроль уже відкриті сторінки.
> 4. Далі обробляються події `fetch`.
>
> ```js
> const CACHE = 'static-v42';
> self.addEventListener('install', (e) => {
>   e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', '/app.js', '/app.css'])));
> });
> self.addEventListener('activate', (e) => {
>   e.waitUntil(caches.keys().then((keys) =>
>     Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
> });
> ```
>
> «Стара версія» — це фаза waiting у поєднанні з cache-first для HTML: користувач із постійно відкритою вкладкою не отримує новий код. Рішення:
>
> - HTML віддавати network-first, хешовану статику — cache-first, API — stale-while-revalidate або не кешувати зовсім;
> - показувати «Доступна нова версія» і за згодою викликати `skipWaiting()` з перезавантаженням. Сліпий `skipWaiting()` може змішати старий HTML з новими чанками;
> - мати kill switch — SW, що видаляє кеші і викликає `unregister()`.
>
> **На співбесіді:** сам файл SW браузер перевіряє на оновлення в обхід HTTP-кешу (за замовчуванням `updateViaCache: 'imports'`), але застарілий кеш на CDN усе одно може затримати деплой.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs|Розділ: сховища та Web APIs]] · [MDN: Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) · [web.dev: The service worker lifecycle](https://web.dev/articles/service-worker-lifecycle)

> [!question]- Як JavaScript впливає на Core Web Vitals (LCP, INP, CLS) і що з цим робити?
> *дуже часто · практика* · `js-11-021`
>
> Core Web Vitals — польові метрики на 75-му перцентилі реальних візитів. Пороги «good»: **LCP ≤ 2.5 с**, **INP ≤ 200 мс**, **CLS ≤ 0.1**. INP замінив FID у березні 2024.
>
> - LCP (рендер найбільшого елемента). JS шкодить, коли LCP-елемент з'являється лише після завантаження і виконання бандла (чистий CSR), коли в `<head>` стоять render-blocking скрипти або коли LCP-зображення має `loading="lazy"`. Лікування: SSR/SSG, `fetchpriority="high"` для hero-зображення, `defer`.
> - INP (затримка від взаємодії до наступного кадру). Головний ворог — long tasks на main thread: важкі обробники, гідратація, синхронний парсинг великого JSON. Рішення: спершу візуальний фідбек, потім важка робота, розбита на шматки з поступкою main thread.
> - CLS (неочікувані зсуви). Причини — контент, вставлений JS без зарезервованого місця (банери, рекламні слоти), зображення без `width`/`height`, пізні веб-шрифти. Анімації через `transform` на CLS не впливають.
>
> ```js
> function yieldToMain() {
>   if (globalThis.scheduler?.yield) return scheduler.yield();
>   return new Promise((resolve) => setTimeout(resolve, 0));
> }
>
> async function processInChunks(items, handle) {
>   for (let i = 0; i < items.length; i++) {
>     handle(items[i]);
>     if (i % 200 === 199) await yieldToMain();
>   }
> }
> ```
>
> **На співбесіді:** Lighthouse дає лише lab-дані. Рішення приймають на польових даних (CrUX, RUM через бібліотеку `web-vitals`), бо без реальних взаємодій INP у лабораторії майже не видно.
>
> 📚 [[JavaScript - 31. Продуктивність і V8|Розділ: продуктивність і V8]] · [web.dev: Web Vitals](https://web.dev/articles/vitals) · [web.dev: Interaction to Next Paint (INP)](https://web.dev/articles/inp)

## 🟣 Tech Lead

> [!question]- Як ви встановите performance budget і політику RUM-моніторингу для продукту?
> *іноді · практика* · `js-11-022`
>
> Бюджет має сенс, лише коли він **вимірюваний, автоматизований і має власника**. Я розділяю його на два рівні.
>
> **Lab-бюджети в CI** ловлять регресії до мержу:
>
> - розмір стисненого JS на критичному маршруті, кількість запитів, вага LCP-зображення. Перевірка через `size-limit` або статистику бандлера, PR падає при перевищенні;
> - Lighthouse CI для ключових сторінок з порогами на LCP, TBT і CLS в емуляції слабкого мобільного.
>
> **Польові цілі (RUM)** описують те, що бачать користувачі: p75 LCP/INP/CLS по маршрутах, сегментовані за типом пристрою, мережею, країною і версією релізу, щоб регресію можна було прив'язати до конкретного деплою.
>
> ```js
> import { onLCP, onINP, onCLS } from 'web-vitals';
>
> function send(metric) {
>   const body = JSON.stringify({
>     name: metric.name,
>     value: metric.value,
>     rating: metric.rating,
>     id: metric.id,
>     route: location.pathname,
>     release: document.documentElement.dataset.release,
>   });
>   navigator.sendBeacon('/rum', body);
> }
>
> onLCP(send);
> onINP(send);
> onCLS(send);
> ```
>
> Політика команди:
>
> - алерти на тренд p75, а не на поодинокі значення; семплінг при великому трафіку;
> - перевищення бюджету — або фікс, або явний виняток із записаним рішенням і терміном дії;
> - новий важкий пакет чи сторонній скрипт проходить рев'ю вартості (KB, час на main thread);
> - бюджети переглядаються щокварталу разом із продуктом: швидкість — це фіча з власною метрикою, а не «прибирання».
>
> 📚 [[JavaScript - 31. Продуктивність і V8|Розділ: продуктивність і V8]] · [web.dev: Performance budgets 101](https://web.dev/articles/performance-budgets-101) · [GoogleChrome/web-vitals](https://github.com/GoogleChrome/web-vitals)

> [!question]- Як ви вирішуєте, брати для продукту фреймворк чи писати на vanilla JS / Web Components?
> *іноді · порівняння* · `js-11-023`
>
> Рішення виходить із характеру продукту і команди, а не зі смаку. Фреймворк купує **узгодженість стану й UI**, конвенції, екосистему (роутинг, форми, SSR, тестування) і простіший найм. Платимо за це розміром рантайму, циклом оновлень і lock-in.
>
> Критерії, які я виписую явно:
>
> - Тип інтерфейсу. Контентному сайту з острівцями інтерактиву вистачає SSR/SSG і мінімального JS (islands, Astro, vanilla). Для застосунку зі складним станом (дашборд, редактор, багатокроковий checkout) фреймворк окупається.
> - Контекст вбудовування. Віджету на чужих сайтах чи спільній дизайн-системі для кількох стеків краще підходять vanilla або Web Components (Lit): без конфліктів версій і з мінімальною вагою.
> - Команда і термін життя. Хто підтримуватиме код через три роки, кого можна найняти, чи є експертиза.
> - Бюджет продуктивності. Цільові пристрої, вимоги до INP/LCP і SEO.
> - Екосистема. Чи потрібні готові рішення: доступні компоненти, i18n, форми.
>
> Головний ризик vanilla на великому продукті — **саморобний фреймворк**, що виріс поступово, без документації й тестів. Ризик фреймворку — тягнути SPA туди, де вистачило б HTML.
>
> Процес: короткий spike на реальному сценарії з вимірами (бандл, INP на бюджетному Android, швидкість розробки), а рішення фіксую в ADR з умовами перегляду.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [MDN: Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

## Тести

> [!quiz] Який метод не дасть виконатися іншим обробникам тієї самої події на тому самому елементі?
> level: junior · id: js-11-quiz-01
> - [ ] `event.preventDefault()`
> - [ ] `event.stopPropagation()`
> - [x] `event.stopImmediatePropagation()`
> - [ ] `return false` з обробника, доданого через `addEventListener`
>
> **Пояснення:** `stopPropagation` зупиняє перехід до інших елементів, але решта обробників на поточному елементі ще виконається, а `stopImmediatePropagation` зупиняє і їх. `preventDefault` лише скасовує дію браузера, а `return false` в `addEventListener` ігнорується.

> [!quiz] Що станеться, якщо в обробнику `touchmove`, зареєстрованому з `{ passive: true }`, викликати `event.preventDefault()`?
> level: middle · id: js-11-quiz-02
> - [ ] Буде кинуто `TypeError`
> - [ ] Скрол буде скасовано, але із затримкою
> - [x] Виклик буде проігноровано, браузер може вивести попередження в консоль
> - [ ] Обробник буде автоматично знято
>
> **Пояснення:** passive-обробник обіцяє не скасовувати дію за замовчуванням, тому браузер скролить, не чекаючи JS. `preventDefault()` у ньому нічого не робить, і `event.defaultPrevented` лишається `false`.

> [!quiz] Оберіть усі правильні: які крос-origin запити через `fetch` спричинять preflight `OPTIONS`?
> level: middle · type: multi · id: js-11-quiz-03
> - [x] `fetch(url, { method: 'PUT' })`
> - [x] `POST` із заголовком `Content-Type: application/json`
> - [ ] `GET` без додаткових заголовків
> - [x] `GET` із заголовком `Authorization: Bearer …`
>
> **Пояснення:** preflight потрібен для методів поза `GET`/`HEAD`/`POST`, для `Content-Type` поза трьома «простими» значеннями і для заголовків поза safelist. `Authorization` у safelist не входить, а звичайний `GET` — simple request.

> [!quiz] Що виведе код?
> level: junior · type: output · id: js-11-quiz-04
>
> ```js
> const outer = document.createElement('div');
> const inner = document.createElement('button');
> outer.append(inner);
> document.body.append(outer);
>
> outer.addEventListener('click', () => console.log('outer bubble'));
> outer.addEventListener('click', () => console.log('outer capture'), true);
> inner.addEventListener('click', () => console.log('inner'));
>
> inner.click();
> ```
>
> - [ ] `outer bubble`, `outer capture`, `inner`
> - [x] `outer capture`, `inner`, `outer bubble`
> - [ ] `inner`, `outer bubble`, `outer capture`
> - [ ] `inner`, `outer capture`, `outer bubble`
>
> **Пояснення:** порядок визначає фаза, а не порядок реєстрації: спершу capture на предках згори вниз, потім target, потім bubbling угору. `click()` генерує звичайну спливаючу подію `click`.

> [!quiz] Що виведе код?
> level: middle · type: output · id: js-11-quiz-05
>
> ```js
> const el = document.createElement('div');
> el.addEventListener('ping', () => console.log('handler'));
>
> Promise.resolve().then(() => console.log('micro'));
> console.log('before');
> el.dispatchEvent(new CustomEvent('ping'));
> console.log('after');
> ```
>
> - [ ] `before`, `after`, `micro`, `handler`
> - [ ] `before`, `after`, `handler`, `micro`
> - [x] `before`, `handler`, `after`, `micro`
> - [ ] `before`, `micro`, `handler`, `after`
>
> **Пояснення:** `dispatchEvent` викликає обробники синхронно, всередині поточного стеку викликів. Мікрозадача з `then` виконається лише після завершення всього синхронного коду.

## Задачі

> [!task] Реалізуй хелпер делегування подій `delegate`
> level: middle · difficulty: easy · id: js-11-task-01 · tags: events, delegation, dom
>
> Умова: напиши `delegate(root, type, selector, handler, options)`, який вішає один слухач на `root` і викликає `handler(event, matched)` лише тоді, коли подія виникла всередині елемента, що відповідає `selector` і лежить усередині `root`. `this` в обробнику має вказувати на знайдений елемент. Функція повертає `unsubscribe()`, що знімає слухача. Приклад: `const off = delegate(list, 'click', '[data-id]', (e, item) => select(item.dataset.id));` — клік по `<span>` усередині `<li data-id="7">` викличе `select('7')`, клік поза `li` нічого не зробить, а після `off()` кліки ігноруються.
>
> > [!hint]- Підказка 1
> > Подія спливає від `event.target` угору, тож потрібен найближчий предок, що відповідає селектору.
>
> > [!hint]- Підказка 2
> > `Element.prototype.closest` шукає, починаючи із самого елемента, але може вийти за межі `root`.
>
> > [!hint]- Підказка 3
> > Перевір `root.contains(match)` і збережи посилання на внутрішній listener, щоб потім передати його в `removeEventListener`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function delegate(root, type, selector, handler, options) {
> >   const listener = (event) => {
> >     const origin = event.target instanceof Element ? event.target : event.target?.parentElement;
> >     const match = origin?.closest(selector);
> >     if (!match || !root.contains(match)) return;
> >     handler.call(match, event, match);
> >   };
> >   root.addEventListener(type, listener, options);
> >   return () => root.removeEventListener(type, listener, options);
> > }
> > ```
> >
> > Працює завдяки bubbling: `closest` дає найближчого предка, що відповідає селектору, а `contains` відсікає збіги вище `root`. Кожна подія коштує O(глибина дерева). Для неспливаючих подій (`focus`, `mouseenter`) передавай спливаючі аналоги (`focusin`, `mouseover`) або `{ capture: true }`. Fallback на `parentElement` потрібен на випадок, якщо ціллю події є текстовий вузол.

> [!task] Реалізуй `throttle` з leading- і trailing-викликом
> level: senior · difficulty: medium · id: js-11-task-02 · tags: timers, events, performance
>
> Умова: напиши `throttle(fn, ms)`, що повертає функцію, яка викликає `fn` не частіше ніж раз на `ms` мілісекунд. Перший виклик виконується одразу (leading). Якщо протягом вікна надійшли ще виклики, після його закінчення відбувається рівно один trailing-виклик з останніми аргументами і `this`. Додай метод `cancel()`, що скасовує запланований trailing-виклик і скидає стан. Приклад: при скролі з подіями кожні 10 мс і `ms = 100` обробник спрацює на 0 мс, ~100 мс, ~200 мс… і гарантовано ще раз після зупинки скролу з фінальною позицією.
>
> > [!hint]- Підказка 1
> > Потрібно пам'ятати час останнього фактичного виклику і таймер для trailing-виклику.
>
> > [!hint]- Підказка 2
> > Обчисли `remaining = ms - (now - lastCall)`. Якщо `remaining <= 0`, виклич одразу, інакше заплануй таймер на `remaining`, якщо його ще немає.
>
> > [!hint]- Підказка 3
> > Кожен виклик лише оновлює «останні» `args` і `this`. Таймер, спрацювавши, використає саме їх і оновить `lastCall`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function throttle(fn, ms) {
> >   let lastCall = -Infinity;
> >   let timer = null;
> >   let lastArgs = null;
> >   let lastThis = null;
> >
> >   function invoke() {
> >     timer = null;
> >     lastCall = performance.now();
> >     const args = lastArgs;
> >     const context = lastThis;
> >     lastArgs = lastThis = null;
> >     fn.apply(context, args);
> >   }
> >
> >   function throttled(...args) {
> >     lastArgs = args;
> >     lastThis = this;
> >     const remaining = ms - (performance.now() - lastCall);
> >     if (remaining <= 0) {
> >       clearTimeout(timer);
> >       invoke();
> >     } else if (timer === null) {
> >       timer = setTimeout(invoke, remaining);
> >     }
> >   }
> >
> >   throttled.cancel = () => {
> >     clearTimeout(timer);
> >     timer = null;
> >     lastArgs = lastThis = null;
> >     lastCall = -Infinity;
> >   };
> >
> >   return throttled;
> > }
> > ```
> >
> > `lastCall = -Infinity` гарантує, що перший виклик завжди leading, навіть якщо сторінка відкрита менше ніж `ms` мілісекунд. `lastCall` оновлюється і при trailing-виклику, тому наступний виклик не станеться раніше ніж через `ms`. Таймер планується лише тоді, коли всередині вікна був виклик, тож «зайвого» trailing немає. Пам'ять O(1). `performance.now()` монотонний, на відміну від `Date.now()`, і не ламається при зміні системного годинника.
