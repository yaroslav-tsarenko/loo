---
title: Архітектура, патерни, безпека та продуктивність
order: 12
tags: [architecture, patterns, security, performance, leadership]
estimatedMinutes: 105
---

# JS Interview Q&A — 12. Архітектура, патерни, безпека та продуктивність

## 🟢 Junior

> [!question]- Що таке патерн Module і чому ES-модуль фактично є singleton?
> *часто · теорія* · `js-12-001`
>
> Module — спосіб сховати внутрішній стан і відкрити лише публічний API. До ES2015 його робили через IIFE і замикання, зараз цю роль виконують **ES-модулі**: усе, що не експортовано, приватне на рівні файлу.
>
> ```js
> // counter.js
> let count = 0;
> export function increment() {
>   return ++count;
> }
> ```
>
> Модуль виконується **один раз** для свого resolved URL чи шляху, і всі імпорти отримують той самий екземпляр. Тому стан на рівні модуля — природний singleton без класів і `getInstance()`.
>
> **На співбесіді:** «один раз» порушується, коли той самий код потрапляє в застосунок двома шляхами: дві версії пакета в `node_modules`, CJS- і ESM-збірки одного пакета (dual package hazard), різні query-рядки в URL. Тоді екземплярів стану стає два.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [patterns.dev: Module Pattern](https://www.patterns.dev/vanilla/module-pattern) · [patterns.dev: Singleton Pattern](https://www.patterns.dev/vanilla/singleton-pattern)

> [!question]- Чим Observer відрізняється від Pub/Sub?
> *часто · порівняння* · `js-12-002`
>
> В **Observer** суб'єкт сам тримає список спостерігачів і напряму їх викликає, а підписник знає, на кого підписується. Приклад — `element.addEventListener`. У **Pub/Sub** між сторонами стоїть посередник (event bus, брокер): видавець публікує в канал, не знаючи підписників, а ті не знають видавця.
>
> ```js
> const bus = new EventTarget();
> bus.addEventListener('order:paid', (e) => console.log('send receipt', e.detail.id));
> bus.dispatchEvent(new CustomEvent('order:paid', { detail: { id: 42 } }));
> ```
>
> Pub/Sub дає слабшу зв'язність, але потік даних важче відстежити: хто слухає подію, доводиться шукати глобальним пошуком по її назві.
>
> **На співбесіді:** обидва патерни мають повертати спосіб відписки. Забуті підписки — класичне джерело витоків пам'яті і подвійних обробників.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [patterns.dev: Observer Pattern](https://www.patterns.dev/vanilla/observer-pattern) · [MDN: CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)

> [!question]- Чому `innerHTML` з даними користувача небезпечний і як вивести такі дані безпечно?
> *дуже часто · практика* · `js-12-003`
>
> `innerHTML` парсить рядок як HTML, тож дані користувача стають розміткою. Це **XSS**. Тег `<script>`, вставлений через `innerHTML`, не виконується, але атрибути-обробники подій виконуються:
>
> ```js
> const output = document.querySelector('#greeting');
> const name = '<img src=x onerror="alert(document.cookie)">';
> output.innerHTML = `Привіт, ${name}`; // виконає onerror
> output.textContent = `Привіт, ${name}`; // безпечно: виведе текст як є
> ```
>
> Правила:
>
> - для тексту — `textContent`, для структури — `createElement` + `setAttribute`;
> - фреймворки екранують за замовчуванням, небезпечні лише «люки» на кшталт `dangerouslySetInnerHTML` у React чи `v-html` у Vue;
> - якщо HTML справді потрібен (rich text), його санітизують через DOMPurify;
> - URL із даних перевіряють на протокол: `href="javascript:..."` виконає код і без `innerHTML`.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript|Розділ: безпека в JavaScript]] · [MDN: Element.innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) · [OWASP: XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

> [!question]- Чому не можна зберігати секретні ключі в клієнтському JS, навіть у змінних оточення?
> *часто · теорія* · `js-12-004`
>
> Усе, що потрапило в браузер, **публічне**. Бандлер під час збірки підставляє `import.meta.env.VITE_*` чи `process.env.NEXT_PUBLIC_*` у код як рядкові літерали. Далі їх видно в DevTools, у source maps і в мережевих запитах. Мініфікація й обфускація — не захист.
>
> Як правильно:
>
> - на клієнті — лише ключі, **призначені** бути публічними (наприклад, publishable key Stripe `pk_...`), з обмеженнями за доменом і квотами;
> - секретні ключі (`sk_...`, ключі LLM API, доступи до БД) — лише на сервері: клієнт звертається до вашого бекенду чи BFF, а той уже до стороннього API;
> - ключ, який хоч раз потрапив у бандл або git, вважайте скомпрометованим і ротуйте, а не просто видаляйте з коду.
>
> **На співбесіді:** перевіряйте зібраний бандл (пошук по `dist/`), а не лише вихідний код.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript|Розділ: безпека в JavaScript]] · [Vite: Env Variables and Modes](https://vite.dev/guide/env-and-mode) · [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## 🟡 Middle

> [!question]- Як Factory і Strategy виглядають у сучасному JS без класових ієрархій?
> *часто · код* · `js-12-005`
>
> **Factory** — функція, що створює і повертає об'єкт. Вона не потребує `new`, може сховати стан у замиканні і вибрати реалізацію за параметрами. **Strategy** — взаємозамінні алгоритми з однаковою сигнатурою, які обирають у рантаймі. У JS це просто функції в `Map` замість розгалуженого `switch`.
>
> ```js
> const shippingStrategies = new Map([
>   ['standard', () => 500],
>   ['express', (order) => 1500 + order.weightKg * 200],
>   ['pickup', () => 0],
> ]);
>
> function createShippingCalculator(strategies = shippingStrategies) {
>   return {
>     cost(order) {
>       const strategy = strategies.get(order.method);
>       if (!strategy) throw new Error(`Unknown shipping method: ${order.method}`);
>       return strategy(order);
>     },
>   };
> }
>
> const calc = createShippingCalculator();
> console.log(calc.cost({ method: 'express', weightKg: 2 })); // 1900
> ```
>
> Нова стратегія додається без зміни `cost` (Open/Closed), а в тестах у фабрику легко передати фейкові стратегії. Фабрика також зручна, коли реалізацію обирають за конфігом, наприклад in-memory сховище в тестах і реальне в продакшені.
>
> **На співбесіді:** зі звичайним об'єктом `strategies[order.method]` ключ `'toString'` знайде метод з `Object.prototype`. Тому беріть `Map` або перевірку `Object.hasOwn`.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [patterns.dev: Factory Pattern](https://www.patterns.dev/vanilla/factory-pattern) · [Refactoring.Guru: Strategy](https://refactoring.guru/design-patterns/strategy)

> [!question]- Як реалізувати Decorator у JS і що із синтаксисом `@decorator`?
> *іноді · код* · `js-12-006`
>
> Decorator обгортає функцію чи об'єкт і додає поведінку (retry, логування, кеш, метрики), не змінюючи оригінал. У JS базова форма — **функція вищого порядку**, що повертає обгортку з тією самою сигнатурою.
>
> ```js
> function withRetry(fn, { retries = 2, baseDelayMs = 200 } = {}) {
>   return async function (...args) {
>     for (let attempt = 0; ; attempt++) {
>       try {
>         return await fn.apply(this, args);
>       } catch (err) {
>         if (attempt >= retries) throw err;
>         await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** attempt));
>       }
>     }
>   };
> }
>
> const loadUser = withRetry(async (id) => {
>   const res = await fetch(`/api/users/${id}`);
>   if (!res.ok) throw new Error(`HTTP ${res.status}`);
>   return res.json();
> });
> ```
>
> Синтаксис `@decorator` для класів і їхніх членів — пропозиція TC39 на Stage 3. Її підтримують TypeScript 5+ і Babel, а нативна підтримка в рушіях поки обмежена. Старі `experimentalDecorators` з TypeScript (Angular, NestJS) мають **іншу, несумісну** семантику.
>
> **На співбесіді:** обгортка має зберегти `this`, аргументи і тип результату. І ретраїти варто лише ідемпотентні операції.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [Refactoring.Guru: Decorator](https://refactoring.guru/design-patterns/decorator) · [TC39: Decorators proposal](https://github.com/tc39/proposal-decorators)

> [!question]- Як робити dependency injection без фреймворку і навіщо?
> *часто · код* · `js-12-007`
>
> DI означає, що модуль **отримує** залежності ззовні, а не імпортує конкретні реалізації всередині. У JS без контейнера достатньо передавати залежності параметрами фабрики чи конструктора. Збирається все в одному місці — **composition root** (`main.js`, bootstrap сервера).
>
> ```js
> function createOrderService({ orders, payments, clock = () => new Date() }) {
>   return {
>     async place(order) {
>       const charge = await payments.charge(order.totalCents);
>       return orders.insert({ ...order, chargeId: charge.id, createdAt: clock() });
>     },
>   };
> }
>
> const service = createOrderService({
>   orders: { insert: async (row) => row },
>   payments: { charge: async () => ({ id: 'ch_test' }) },
>   clock: () => new Date('2025-01-01T00:00:00Z'),
> });
> console.log(await service.place({ totalCents: 1000 }));
> ```
>
> Переваги: тести без `jest.mock` і патчингу модулів, заміна реалізації (один PSP на інший) без правок бізнес-логіки, явні залежності в сигнатурі.
>
> **На співбесіді:** DI-контейнер потрібен рідко, ручна композиція плюс TypeScript-інтерфейси покривають більшість проєктів. Фабрика з десятком залежностей — сигнал про порушення SRP, а не про потребу в контейнері.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [Martin Fowler: Inversion of Control Containers and the DI pattern](https://martinfowler.com/articles/injection.html)

> [!question]- Що таке CSRF і як від нього захищають cookie з `SameSite`?
> *дуже часто · теорія* · `js-12-008`
>
> CSRF — атака, коли сторінка зловмисника змушує браузер жертви надіслати запит на ваш сайт. Браузер **автоматично додає cookie** сесії, тож сервер бачить легітимного користувача. Класичний приклад — прихована форма з auto-submit на `POST /transfer`.
>
> `SameSite` обмежує надсилання cookie в крос-сайтових запитах:
>
> - `Strict` — лише для запитів зі свого сайту; навіть перехід за посиланням з іншого сайту прийде без cookie;
> - `Lax` — cookie йдуть лише під час top-level навігації безпечними методами (`GET`), а крос-сайтові `POST`, `fetch` та iframe їх не отримують. У Chromium це значення за замовчуванням для cookie без атрибута;
> - `None` — завжди, але лише разом із `Secure`.
>
> Самого `SameSite` недостатньо:
>
> - site — це eTLD+1, тож скомпрометований субдомен вважається same-site;
> - `GET`, що змінює стан, пробиває `Lax`;
> - не всі браузери використовують `Lax` за замовчуванням.
>
> Тому додають CSRF-токен (synchronizer або double-submit) і перевіряють на сервері заголовки `Origin` чи `Sec-Fetch-Site`.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript|Розділ: безпека в JavaScript]] · [MDN: Cross-site request forgery (CSRF)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF) · [web.dev: SameSite cookies explained](https://web.dev/articles/samesite-cookies-explained)

> [!question]- Коли мемоізація прискорює код, а коли шкодить?
> *часто · код* · `js-12-009`
>
> Мемоізація кешує результат **чистої** функції за аргументами. Вона виграє, коли обчислення дороге, аргументи повторюються і їх дешево порівняти.
>
> Шкодить, коли:
>
> - функція дешева: пошук у кеші і побудова ключа дорожчі за саме обчислення;
> - кеш необмежений: `Map` росте вічно, і це фактично витік пам'яті;
> - аргументи — нові об'єкти на кожен виклик: ключ за посиланням не збігається, а `JSON.stringify` як ключ дорогий і залежить від порядку полів;
> - функція нечиста (час, мережа, мутабельні дані): кеш віддає застарілий результат.
>
> ```js
> function memoizeByRef(fn) {
>   const cache = new WeakMap();
>   return (obj) => {
>     if (!cache.has(obj)) cache.set(obj, fn(obj));
>     return cache.get(obj);
>   };
> }
>
> const total = memoizeByRef((cart) => cart.items.reduce((s, i) => s + i.price * i.qty, 0));
> const cart = { items: [{ price: 100, qty: 3 }] };
> console.log(total(cart), total(cart)); // 300 300, обчислено один раз
> ```
>
> `WeakMap` не утримує ключі від GC, але вимагає незмінності об'єкта: мутація `cart` дасть застарілу суму.
>
> **На співбесіді:** для async-функцій кешують сам проміс (дедуплікація паралельних запитів) і видаляють його з кешу при reject.
>
> 📚 [[JavaScript - 31. Продуктивність і V8|Розділ: продуктивність і V8]] · [React: useMemo](https://react.dev/reference/react/useMemo) · [MDN: performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)

> [!question]- Як правильно виміряти час виконання коду в браузері й Node?
> *іноді · код* · `js-12-010`
>
> Для вимірювань беруть `performance.now()`, а не `Date.now()`. Він монотонний (не стрибає при зміні системного годинника) і має субмілісекундну точність відносно `performance.timeOrigin`. Для іменованих відрізків є `mark` і `measure`: вони потрапляють у timeline DevTools Performance і доступні через `PerformanceObserver`.
>
> ```js
> const items = Array.from({ length: 200_000 }, (_, i) => i);
>
> performance.mark('filter:start');
> const even = items.filter((n) => n % 2 === 0);
> performance.mark('filter:end');
>
> const { duration } = performance.measure('filter', 'filter:start', 'filter:end');
> console.log(`${even.length} items in ${duration.toFixed(2)} ms`);
> ```
>
> Нюанси:
>
> - точність таймерів навмисно знижена для захисту від Spectre, вища доступна лише в cross-origin isolated контексті;
> - один прогін нічого не доводить через JIT-прогрів, GC і варіативність. Потрібні повтори й медіана або бенчмарк-інструменти;
> - `PerformanceObserver` з типами `longtask` чи `long-animation-frame` (Chromium) показує блокування main thread у реальних користувачів.
>
> **На співбесіді:** `performance` — глобальний об'єкт і в Node (модуль `perf_hooks`), тож той самий код працює в обох середовищах.
>
> 📚 [[JavaScript - 31. Продуктивність і V8|Розділ: продуктивність і V8]] · [MDN: performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) · [Node.js: Performance measurement APIs](https://nodejs.org/api/perf_hooks.html)

> [!question]- Як працює віртуалізація довгих списків і які в неї компроміси?
> *часто · практика* · `js-12-011`
>
> Віртуалізація (windowing) рендерить лише рядки у видимій області плюс невеликий запас (**overscan**) замість 10 000 DOM-вузлів. Контейнер має повну висоту `count × rowHeight`, щоб скролбар поводився чесно, а видимі рядки зсуваються через `transform: translateY(...)`.
>
> ```js
> function getWindow({ scrollTop, viewportHeight, rowHeight, count, overscan = 5 }) {
>   const first = Math.floor(scrollTop / rowHeight);
>   const last = Math.ceil((scrollTop + viewportHeight) / rowHeight) - 1;
>   const start = Math.max(0, first - overscan);
>   const end = Math.min(count - 1, last + overscan);
>   return { start, end, offsetY: start * rowHeight, totalHeight: count * rowHeight };
> }
>
> console.log(getWindow({ scrollTop: 1000, viewportHeight: 400, rowHeight: 40, count: 10_000 }));
> // { start: 20, end: 39, offsetY: 800, totalHeight: 400000 }
> ```
>
> Компроміси:
>
> - змінна висота рядків потребує вимірювання (`ResizeObserver`), оцінки і префіксних сум з бінарним пошуком;
> - `Ctrl+F` не знаходить невідрендерене, а скрінрідери не бачать усього списку, тож потрібні `aria-rowcount`/`aria-rowindex` або `aria-setsize`/`aria-posinset`;
> - стан усередині рядків (фокус, введений текст) губиться, коли рядок виходить з вікна.
>
> **На співбесіді:** для помірних обсягів часто вистачає CSS `content-visibility: auto` з `contain-intrinsic-size`. Рядки лишаються в DOM, але браузер пропускає рендеринг невидимих.
>
> 📚 [[JavaScript - 31. Продуктивність і V8|Розділ: продуктивність і V8]] · [web.dev: Virtualize large lists](https://web.dev/articles/virtualize-long-lists-react-window) · [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## 🔴 Senior

> [!question]- Як принципи SOLID застосовуються в JS-коді, де мало класів?
> *часто · теорія* · `js-12-012`
>
> SOLID — про керування залежностями й причинами змін, а не про класи. У JS принципи працюють на рівні модулів, функцій і контрактів:
>
> - S (single responsibility): модуль має одну причину для змін. `checkout.js`, що рахує податки, ходить у платіжний API і малює DOM, змінюватиметься з трьох причин, тож його варто розділити.
> - O (open/closed): розширення через стратегії, плагіни, конфіг-мапи, а не дописуванням `if`/`switch` у ядро.
> - L (Liskov): будь-яка реалізація контракту взаємозамінна. Кеш-адаптер, який кидає помилку там, де інтерфейс обіцяє `undefined`, ламає клієнтів, хоча формою підходить.
> - I (interface segregation): передавайте мінімальний інтерфейс. Функції потрібен `{ charge }`, а не весь SDK, і фейк у тесті стає тривіальним.
> - D (dependency inversion): бізнес-логіка залежить від абстракції (переданого `payments`), а інфраструктура підключається в composition root.
>
> Інтерфейси в JS неявні (duck typing), тому контракт фіксують типами TypeScript або JSDoc і **контрактними тестами**, спільними для всіх реалізацій.
>
> ```js
> export function paymentContract(createImpl) {
>   return async () => {
>     const impl = createImpl();
>     const res = await impl.charge(100);
>     if (typeof res.id !== 'string') throw new Error('charge() must return { id: string }');
>   };
> }
> ```
>
> **На співбесіді:** механічний SOLID (інтерфейс на кожен клас, фабрики фабрик) — теж технічний борг. Застосовуйте його там, де справді є кілька реалізацій або часті зміни.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [Refactoring.Guru: Strategy](https://refactoring.guru/design-patterns/strategy) · [Martin Fowler: Inversion of Control Containers and the DI pattern](https://martinfowler.com/articles/injection.html)

> [!question]- Що таке functional core / imperative shell і як це спрощує тестування?
> *іноді · практика* · `js-12-013`
>
> Код ділиться на два шари. **Функціональне ядро** — чисті функції з рішеннями і розрахунками: без I/O, `Date.now()`, `Math.random()` і мутацій зовнішнього стану. **Імперативна оболонка** — тонкий шар, що збирає вхідні дані (БД, HTTP, час), викликає ядро і виконує описані ним ефекти.
>
> ```js
> function decideRenewal(subscription, now) {
>   if (subscription.status !== 'active') return { type: 'skip', reason: 'inactive' };
>   if (now < subscription.renewsAt) return { type: 'skip', reason: 'not-due' };
>   return { type: 'charge', customerId: subscription.customerId, amount: subscription.priceCents };
> }
>
> async function runRenewal(id, { db, payments, clock }) {
>   const subscription = await db.getSubscription(id);
>   const decision = decideRenewal(subscription, clock());
>   if (decision.type === 'charge') {
>     await payments.charge(decision.customerId, decision.amount);
>   }
>   return decision;
> }
> ```
>
> Наслідки:
>
> - уся логіка тестується таблицею «вхід → рішення» без моків і за мілісекунди;
> - оболонку покривають кілька інтеграційних тестів, бо розгалужень у ній майже немає;
> - ядро переноситься між клієнтом, сервером і воркером;
> - рішення як дані (`{ type: 'charge' }`) легко логувати й відтворювати.
>
> Ціна — дисципліна: не протягувати `fetch` чи логер у ядро «бо так швидше». У зрілій формі ядро часто стає редьюсером `(state, event) => ({ state, effects })`.
>
> **На співбесіді:** це та сама ідея, що й Redux-редьюсери чи hexagonal architecture, лише без церемоній.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [Gary Bernhardt: Functional Core, Imperative Shell](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell) · [Mostly Adequate Guide: Pure Happiness with Pure Functions](https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch03)

> [!question]- Як ви обираєте підхід до state management у фронтенд-застосунку?
> *часто · порівняння* · `js-12-014`
>
> Спершу класифікую стан, бо різні види потребують різних інструментів. Одна глобальна «скринька для всього» — **головна помилка**.
>
> - Server state (дані з API) — це кеш чужих даних: потрібні дедуплікація, інвалідація, повторні запити, stale-while-revalidate. Для нього TanStack Query, SWR чи RTK Query, а не ручне копіювання в Redux.
> - URL state (фільтри, сторінка, вкладка) живе в query string, щоб посиланням можна було поділитися, а «назад/вперед» працювали.
> - Локальний UI-стан (відкритий дропдаун, значення інпута) лишається в компоненті й піднімається лише за потреби.
> - Глобальний клієнтський стан (сесія, тема, кошик) — невеликий store (Zustand, Redux Toolkit, signals) або контекст для значень, що рідко змінюються.
> - Похідний стан не зберігають, а обчислюють (селектори, `computed`), інакше дві копії розсинхронізуються.
>
> Компроміси інструментів:
>
> - централізований store дає трасування, devtools і передбачувані переходи, але додає церемонії;
> - React Context перерендерює всіх споживачів при кожній зміні значення;
> - fine-grained реактивність (signals) точна й швидка, але неявні залежності важче налагоджувати.
>
> **На співбесіді:** на питання «Redux чи Zustand?» сильна відповідь — «спершу винесу server state у query-кеш, і глобального стану залишиться на один невеликий store».
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [React: Managing State](https://react.dev/learn/managing-state) · [Redux: Style Guide](https://redux.js.org/style-guide/)

> [!question]- Які бувають типи XSS і як будувати захист у кілька шарів, включно з CSP і Trusted Types?
> *часто · теорія* · `js-12-015`
>
> Типи XSS розрізняють за тим, звідки береться payload:
>
> - stored — зберігається на сервері (коментар, ім'я профілю) і віддається всім;
> - reflected — сервер повертає його з параметра запиту у відповіді;
> - DOM-based — повністю на клієнті: джерело (`location.hash`, `postMessage`, `localStorage`) потрапляє в sink (`innerHTML`, `eval`, `setTimeout` з рядком, `a.href = 'javascript:…'`).
>
> Шари захисту:
>
> 1. Контекстне кодування. HTML-текст, атрибут, URL, JS-рядок і CSS потребують різного екранування. Фреймворки роблять це за замовчуванням, тож аудит зводиться до «люків» на кшталт `dangerouslySetInnerHTML`.
> 2. Санітизація (DOMPurify), коли HTML справді потрібен.
> 3. **Strict CSP** на nonce або hash: `script-src 'nonce-…' 'strict-dynamic'; object-src 'none'; base-uri 'none'`. CSP зі списком доменів часто обходять через JSONP чи скрипти з дозволених CDN. Впроваджують через `Content-Security-Policy-Report-Only` зі збором звітів.
> 4. **Trusted Types** (`require-trusted-types-for 'script'`): DOM-sinks приймають лише типізовані значення, створені зареєстрованими політиками, тож небезпечні місця зводяться до кількох функцій під рев'ю. Підтримка довго була лише в Chromium, тому перевіряйте цільові браузери.
>
> ```js
> import DOMPurify from 'dompurify';
>
> const policy = window.trustedTypes?.createPolicy('app-html', {
>   createHTML: (input) => DOMPurify.sanitize(input),
> });
>
> export function renderPreview(el, userHtml) {
>   el.innerHTML = policy ? policy.createHTML(userHtml) : DOMPurify.sanitize(userHtml);
> }
> ```
>
> **На співбесіді:** `HttpOnly` не зупиняє XSS, а лише не дає прочитати cookie. Скрипт атакувальника все одно діє від імені користувача.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript|Розділ: безпека в JavaScript]] · [MDN: Cross-site scripting (XSS)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS) · [MDN: Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)

> [!question]- Що таке prototype pollution, як він виникає і як захиститися?
> *іноді · код* · `js-12-016`
>
> Prototype pollution — запис атакувальником властивостей у `Object.prototype` (або інший спільний прототип) через ключі `__proto__`, `constructor`, `prototype` у даних, які він контролює. Після цього **кожен** об'єкт успадковує, наприклад, `isAdmin: true`. Типові вразливі місця — рекурсивний merge чи clone, `set(obj, 'a.b.c', value)` за шляхом, парсери query string.
>
> ```js
> function merge(target, source) {
>   for (const key of Object.keys(source)) {
>     const value = source[key];
>     if (typeof value === 'object' && value !== null) {
>       target[key] ??= {};
>       merge(target[key], value);
>     } else {
>       target[key] = value;
>     }
>   }
>   return target;
> }
>
> merge({}, JSON.parse('{"__proto__": {"isAdmin": true}}'));
> console.log({}.isAdmin); // true
> ```
>
> `JSON.parse` створює **власну** властивість `__proto__`, а `target['__proto__']` через accessor повертає `Object.prototype`, і рекурсія пише прямо в нього.
>
> Наслідки залежать від «гаджетів»: обхід перевірок доступу, XSS через бібліотеку, що читає опції з об'єкта, а на сервері — аж до RCE через шаблонізатори чи опції `child_process`.
>
> Захист:
>
> - відкидати ключі `__proto__`, `constructor`, `prototype` у merge і set-by-path;
> - для словників використовувати `Map` або `Object.create(null)`;
> - валідувати вхід схемою (zod, ajv) із забороною зайвих ключів;
> - перевіряти наявність через `Object.hasOwn`, а не `obj[key]`;
> - hardening: `Object.freeze(Object.prototype)` (може зламати поліфіли) або в Node `--disable-proto=delete` (шлях через `constructor.prototype` лишається);
> - оновлювати залежності: такі CVE мали, наприклад, `lodash.merge` і `$.extend(true, …)`.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript|Розділ: безпека в JavaScript]] · [MDN: Prototype pollution](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution) · [OWASP: Prototype Pollution Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html)

> [!question]- Які ризики несе npm-ланцюжок постачання і які практики реально їх зменшують?
> *часто · практика* · `js-12-017`
>
> Типовий застосунок тягне сотні транзитивних пакетів, і кожен виконується з правами вашого процесу чи сторінки. Основні вектори:
>
> - **компрометація мейнтейнера**: фішинг або вкрадений токен, і в реєстр потрапляє шкідлива версія популярного пакета (event-stream у 2018, ua-parser-js у 2021, chalk і debug у 2025);
> - typosquatting і dependency confusion (публічний пакет з іменем вашого внутрішнього);
> - lifecycle-скрипти (`postinstall`), що виконуються на машинах розробників і в CI, де лежать токени;
> - покинуті пакети з відомими CVE.
>
> Практики:
>
> - lockfile у репозиторії, у CI — `npm ci` (строго за lockfile), diff lockfile рев'юють як код;
> - оновлення через Renovate чи Dependabot малими PR і з затримкою для свіжих релізів, щоб шкідливу версію встигли відкликати;
> - вимкнені lifecycle-скрипти (`--ignore-scripts`) або allowlist; pnpm 10 за замовчуванням не запускає їх для залежностей;
> - `npm audit` ловить лише **відомі** CVE і дає шум, для поведінкового аналізу (мережа, `eval`, install-скрипти) потрібні окремі сканери;
> - перевірка підписів і provenance (`npm audit signatures`), 2FA і trusted publishing для власних пакетів;
> - scope або проксі-реєстр для внутрішніх імен;
> - на фронтенді — SRI для скриптів із CDN і CSP з обмеженим `connect-src`, щоб код не міг відправляти дані куди завгодно.
>
> **На співбесіді:** найдешевший захист — менше залежностей. Питання «чи варті три рядки коду нового пакета?» має звучати на рев'ю.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript|Розділ: безпека в JavaScript]] · [OWASP: NPM Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html) · [npm Docs: npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit)

> [!question]- Які стратегії зменшення розміру JS-бандла ви застосовуєте і як не зробити гірше?
> *часто · практика* · `js-12-018`
>
> Спершу вимірюю: bundle analyzer або `source-map-explorer`, вкладка Coverage у DevTools (скільки коду не виконується при завантаженні), бюджет у CI. Далі застосовую те, що дає найбільший ефект:
>
> - code splitting за маршрутами і ліниве завантаження важких фіч (редактор, графіки, карта) через `import()` на взаємодію або при появі у viewport;
> - tree-shaking: ESM-залежності, `"sideEffects": false` у власних пакетах, обережність із barrel-файлами (`index.js`, що реекспортує все), які заважають tree-shaking для модулів з побічними ефектами і сповільнюють збірку;
> - заміна важких залежностей: `moment` → `Intl` чи date-fns, повний `lodash` → точкові імпорти або нативні методи, дедуплікація версій;
> - сучасні таргети в browserslist: менше поліфілів і транспіляції;
> - перенесення роботи на сервер (SSR, RSC, форматування даних на бекенді).
>
> ```js
> const button = document.querySelector('#open-editor');
> button.addEventListener('click', async () => {
>   const { openEditor } = await import('./editor.js');
>   openEditor();
> });
> ```
>
> Як зробити гірше: розбити код на десятки дрібних чанків і отримати **водоспад запитів**; ліниво вантажити те, що потрібно першому екрану (удар по LCP); оптимізувати кілобайти, ігноруючи час виконання. Вартість JS — не лише мережа, а й parse, compile і execute на слабкому телефоні.
>
> **На співбесіді:** для очікуваних лінивих чанків допомагають `<link rel="modulepreload">` або prefetch при hover чи в idle.
>
> 📚 [[JavaScript - 31. Продуктивність і V8|Розділ: продуктивність і V8]] · [web.dev: Reduce JavaScript payloads with code splitting](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting) · [web.dev: Remove unused code](https://web.dev/articles/remove-unused-code)

## 🟣 Tech Lead

> [!question]- Які стандарти code review ви встановлюєте для JS-команди і як використовуєте рев'ю для менторства джунів?
> *часто · практика* · `js-12-019`
>
> Принцип: **машина перевіряє все, що може**, а люди — те, чого машина не бачить.
>
> До рев'ю в CI проходять ESLint (зокрема `@typescript-eslint/no-floating-promises`), Prettier, `tsc --noEmit`, тести і бюджет бандла. Дискусії про стиль у коментарях — ознака, що бракує правила.
>
> Процес:
>
> - невеликі PR (орієнтир — до ~400 рядків змін) з описом «що, чому, як перевірено»;
> - SLA на першу відповідь, наприклад один робочий день;
> - маркування коментарів `blocking`, `suggestion`, `nit`, `question`, щоб автор одразу бачив, що обов'язкове.
>
> Чекліст для людини в JS-коді: необроблені проміси й помилки в async; гонки (відповідь приходить після unmount або після новішого запиту); витоки (слухачі, таймери, підписки без cleanup); мутація спільних об'єктів; XSS-sinks і валідація входу; зайві залежності.
>
> Менторство через рев'ю:
>
> - питання замість вердиктів: «що станеться, якщо цей `fetch` відповість після переходу на іншу сторінку?»;
> - посилання на першоджерело (MDN, специфікація), а не «так заведено»;
> - джуни рев'юють PR сеньйорів і вчаться читати чужий код та ставити питання;
> - повторювані зауваження збираю в каталог: частину перетворюю на lint-правила, частину — на короткі сесії з фундаменту (event loop, замикання, `this`).
>
> Здоров'я процесу вимірюю часом до першого рев'ю, кількістю ітерацій і часткою великих PR, а не кількістю коментарів на людину.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [Google: Engineering Practices — Code Review](https://google.github.io/eng-practices/review/)

> [!question]- Як ви керуєте технічним боргом так, щоб бізнес погоджувався на його погашення?
> *часто · практика* · `js-12-020`
>
> Технічний борг — це не «поганий код», а **відсоток**, який команда платить за кожну зміну в певній зоні. Керувати ним означає робити цей відсоток видимим і гасити найдорожчий.
>
> 1. Реєстр. Для кожного пункту: де, чим заважає, вартість (сповільнення фіч, інциденти, onboarding), оцінка виправлення. Свідомий борг («випустили MVP без кешу») відрізняю від випадкового.
> 2. Пріоритет за hotspots. Поєдную churn (як часто змінюється файл, з `git log`) зі складністю. Складний, але незмінний модуль — не пріоритет; складний і щотижня змінюваний — перший кандидат.
> 3. Мова бізнесу. Не «треба рефакторити checkout», а «кожна зміна в оплаті займає три дні замість одного і дала два інциденти за квартал; два спринти роботи це прибирають».
> 4. Бюджет ємності. Фіксована частка часу (часто 15–20%) плюс правило бойскаута: рефакторинг разом із фічею, що торкається зони.
> 5. Зупинка приросту. Ratchet-правила: нові файли лише на TS, кількість `any` і `eslint-disable` може тільки зменшуватися.
> 6. Без big-bang rewrite. Патерн strangler fig: новий модуль поруч, трафік переводиться поступово, старий видаляється.
>
> Прогрес вимірюю метриками, які відчуває команда: lead time змін у зоні, кількість інцидентів, flaky-тести, час збірки.
>
> **На співбесіді:** «ми виділили спринт на борг» без вимірюваної мети — червоний прапорець.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [Martin Fowler: Technical Debt Quadrant](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html)

> [!question]- Як мігрувати великий JS-кодбейс на TypeScript інкрементально, не зупиняючи розробку фіч?
> *часто · практика* · `js-12-021`
>
> Мета — щоб типи приносили користь з першого тижня, а міграція йшла **паралельно з фічами**.
>
> 1. Інфраструктура: `tsconfig` з `allowJs`, перевірка через `tsc --noEmit` у CI, а збірку лишаємо бандлеру (esbuild, swc, Vite просто стирають типи).
> 2. Типи без перейменування файлів: `// @ts-check` і JSDoc у критичних JS-модулях дають перевірку одразу.
> 3. Порядок: нові файли лише на TS (lint-правило), далі листові модулі (utils, API-клієнт), потім угору по графу залежностей. Найвища віддача — на межах: типи відповідей API, згенеровані з OpenAPI чи GraphQL-схеми.
> 4. Суворість поступово: `strict` вмикають пофлагово, спершу `noImplicitAny`, потім `strictNullChecks` — найцінніший і найболючіший. Для окремих директорій можна тримати суворіший конфіг через project references.
> 5. Ratchet-метрики: частка TS-файлів росте, кількість `any` і `@ts-expect-error` лише зменшується.
>
> ```js
> // @ts-check
>
> /**
>  * @param {{ id: string, totalCents: number }} order
>  * @returns {string}
>  */
> export function formatTotal(order) {
>   return (order.totalCents / 100).toFixed(2);
> }
> ```
>
> Пастки:
>
> - масове `any` заради «зеленого» білда, хоча краще `unknown` зі звуженням;
> - віра, що типи перевіряють дані в рантаймі: на межах потрібна валідація (zod, valibot);
> - великий PR «конвертуємо все» із сотнями конфліктів.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [TypeScript: Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)

> [!question]- Як ви проєктуєте API спільної JS-бібліотеки, якою користуються кілька команд?
> *іноді · практика* · `js-12-022`
>
> Публічний API — обіцянка, яку дорого змінювати, тому я **мінімізую поверхню** і роблю контракт явним.
>
> - Поле `exports` у `package.json` ховає внутрішні файли, тож ніхто не імпортує `lib/dist/internal/x.js`.
> - Об'єкт опцій замість позиційних аргументів і булевих прапорців: `createClient({ baseUrl, timeoutMs })` розширюється без breaking changes.
> - Передбачуваність: async-функції завжди повертають проміс, помилки — класи з полем `code`, на яке можна розгалужуватися.
> - Жодних побічних ефектів при імпорті (`"sideEffects": false`), ESM-first, типи в пакеті, фреймворки — у `peerDependencies`.
> - Інверсія залежностей: можна передати власний `fetch`, логер, годинник.
> - Semver-дисципліна: breaking change — це не лише видалення експорту, а й зміна типів, дефолтів, мінімальної версії Node чи діапазону peer-залежностей. Депрекейт спершу з попередженням і міграційним гайдом, краще з codemod.
> - Автоматичний контроль: Changesets для версій і changelog, `publint` і `arethetypeswrong` для перевірки пакета, api-extractor для diff публічного API в PR.
>
> ```js
> export class HttpError extends Error {
>   constructor(status, message, options) {
>     super(message, options);
>     this.name = 'HttpError';
>     this.code = 'HTTP_ERROR';
>     this.status = status;
>   }
> }
>
> export function createClient({ baseUrl, timeoutMs = 10_000, fetch = globalThis.fetch } = {}) {
>   return {
>     async get(path) {
>       const res = await fetch(new URL(path, baseUrl), { signal: AbortSignal.timeout(timeoutMs) });
>       if (!res.ok) throw new HttpError(res.status, `GET ${path} failed`);
>       return res.json();
>     },
>   };
> }
> ```
>
> 📚 [[JavaScript - 21. Модулі — ESM, CommonJS і бандлери|Розділ: модулі: ESM, CommonJS і бандлери]] · [Semantic Versioning](https://semver.org/) · [Node.js: Conditional exports](https://nodejs.org/api/packages.html#conditional-exports)

> [!question]- Як ви ухвалюєте й документуєте архітектурні рішення в команді (ADR)?
> *іноді · практика* · `js-12-023`
>
> Для рішень, які **дорого розвернути**, я використовую ADR (Architecture Decision Record) — короткий документ у репозиторії поруч із кодом, наприклад `docs/adr/0012-server-state-cache.md`. Приклади таких рішень: бібліотека стану, SSR-фреймворк, монорепо, спосіб зберігання токенів, стратегія обробки помилок.
>
> Структура ADR:
>
> - контекст: проблема, обмеження, сили, що діють;
> - розглянуті варіанти з плюсами й мінусами, включно з «нічого не робити»;
> - рішення і хто його ухвалив;
> - наслідки: що стає легше, що важче, який борг ми приймаємо;
> - статус: proposed → accepted → superseded by ADR-0019. Прийняті ADR не редагують, а замінюють новими, тож історія «чому» зберігається.
>
> Процес:
>
> - розрізняю «двосторонні двері» (легко відкотити, команда вирішує швидко) і «односторонні» (повний ADR);
> - для односторонніх — пропозиція з дедлайном на коментарі і, за потреби, spike з вимірюваними критеріями (розмір бандла, INP, час на типову задачу);
> - рішення не вимагає одностайності: відповідальний ухвалює його після обговорення, незгоду фіксують в ADR, далі діє «disagree and commit»;
> - в ADR записую тригери перегляду, наприклад «якщо мікрофронтендів стане більше п'яти — переглянути».
>
> ADR — не бюрократія на кожну дрібницю, а пам'ять команди. Новий розробник за годину розуміє, чому код саме такий, і суперечки не перезапускаються щопівроку.
>
> 📚 [[JavaScript - 32. Патерни проєктування|Розділ: патерни проєктування]] · [Michael Nygard: Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) · [ADR GitHub organization](https://adr.github.io/)

## Тести

> [!quiz] Який спосіб вивести ім'я користувача в DOM безпечний від XSS?
> level: junior · id: js-12-quiz-01
> - [ ] `el.innerHTML = name`
> - [ ] `el.insertAdjacentHTML('beforeend', name)`
> - [x] `el.textContent = name`
> - [ ] `el.outerHTML = name`
>
> **Пояснення:** `textContent` записує рядок як текстовий вузол і не парсить HTML. Решта варіантів інтерпретують рядок як розмітку, тож `<img onerror=…>` виконає код.

> [!quiz] Сесійна cookie має `SameSite=Lax`. У якому крос-сайтовому сценарії браузер її надішле?
> level: middle · id: js-12-quiz-02
> - [ ] Автоматичний submit прихованої `POST`-форми зі сторінки зловмисника
> - [ ] `fetch` з `credentials: 'include'` з іншого сайту
> - [x] Перехід користувача за звичайним посиланням з іншого сайту (top-level `GET`)
> - [ ] Завантаження вашої сторінки в `<iframe>` на іншому сайті
>
> **Пояснення:** `Lax` пропускає cookie лише для top-level навігацій безпечними методами. Крос-сайтові `POST`, фонові запити і вкладені контексти на кшталт iframe cookie не отримують.

> [!quiz] Оберіть усі правильні: що реально захищає функцію deep merge від prototype pollution?
> level: senior · type: multi · id: js-12-quiz-03
> - [x] Пропускати ключі `__proto__`, `constructor` і `prototype`
> - [x] Використовувати `Map` або `Object.create(null)` для словників з довільними ключами
> - [ ] Перевіряти `typeof value === 'object'` перед рекурсією
> - [x] Валідувати вхід схемою, що забороняє невідомі ключі
>
> **Пояснення:** перевірка типу не заважає рекурсії зайти в `target['__proto__']`, тобто в `Object.prototype`. Фільтрація небезпечних ключів, словники без прототипу і строга схема прибирають сам вектор атаки.

> [!quiz] Що виведе код?
> level: middle · type: output · id: js-12-quiz-04
>
> ```js
> function memo(fn) {
>   const cache = new Map();
>   return (arg) => {
>     if (cache.has(arg)) return cache.get(arg);
>     const result = fn(arg);
>     cache.set(arg, result);
>     return result;
>   };
> }
>
> let calls = 0;
> const area = memo((r) => {
>   calls++;
>   return r.w * r.h;
> });
>
> area({ w: 2, h: 3 });
> area({ w: 2, h: 3 });
> const rect = { w: 2, h: 3 };
> area(rect);
> area(rect);
> console.log(calls);
> ```
>
> - [ ] `1`
> - [ ] `2`
> - [x] `3`
> - [ ] `4`
>
> **Пояснення:** `Map` порівнює об'єкти-ключі за посиланням (SameValueZero). Два літерали `{ w: 2, h: 3 }` — різні об'єкти, тож обидва виклики промахуються, а `rect` кешується з першого разу.

> [!quiz] Що виведе код?
> level: senior · type: output · id: js-12-quiz-05
>
> ```js
> const handlers = [];
> const subscribe = (fn) => {
>   handlers.push(fn);
>   return () => handlers.splice(handlers.indexOf(fn), 1);
> };
> const emit = () => handlers.forEach((fn) => fn());
>
> const offA = subscribe(() => {
>   console.log('A');
>   offA();
> });
> subscribe(() => console.log('B'));
> subscribe(() => console.log('C'));
> emit();
> ```
>
> - [ ] `A`, `B`, `C`
> - [x] `A`, `C`
> - [ ] `A`, `B`
> - [ ] `A`, а потім `TypeError`
>
> **Пояснення:** `forEach` ітерує живий масив за індексами. Відписка `A` на індексі 0 зсуває `B` на його місце, і наступна ітерація (індекс 1) бере вже `C`. Тому `emit` має ітерувати по копії (`[...handlers]`).

## Задачі

> [!task] Реалізуй `escapeHtml` для безпечної вставки тексту в HTML
> level: junior · difficulty: easy · id: js-12-task-01 · tags: security, xss, strings
>
> Умова: напиши `escapeHtml(value)`, що приводить значення до рядка і замінює `&`, `<`, `>`, `"` та `'` на HTML-сутності, щоб результат можна було безпечно вставити в текст елемента або в атрибут у лапках. Кожен символ має екрануватися рівно один раз, без подвійного екранування `&`. Приклад: `escapeHtml('<a href="x">Tom & Jerry\'s</a>')` повертає `'&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;'`.
>
> > [!hint]- Підказка 1
> > Потрібна таблиця «символ → сутність» і одна заміна по всьому рядку.
>
> > [!hint]- Підказка 2
> > Послідовні `.replace()` небезпечні порядком: якщо замінити `&` після `<`, вийде `&amp;lt;`. Одна регулярка з класом символів розв'язує проблему.
>
> > [!hint]- Підказка 3
> > `str.replace(/[&<>"']/g, (ch) => map[ch])` — callback отримує знайдений символ.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const HTML_ESCAPES = {
> >   '&': '&amp;',
> >   '<': '&lt;',
> >   '>': '&gt;',
> >   '"': '&quot;',
> >   "'": '&#39;',
> > };
> >
> > function escapeHtml(value) {
> >   return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
> > }
> > ```
> >
> > Один прохід регуляркою працює за O(n), і кожен символ замінюється рівно раз, тож подвійного екранування немає. Функція захищає лише HTML-текст і атрибути в лапках. Для URL (`javascript:`), вмісту `<script>`, CSS і атрибутів без лапок потрібне інше кодування або валідація. У DOM-коді краще просто `textContent`, а `escapeHtml` доречна в рядкових шаблонах.

> [!task] Реалізуй `EventEmitter` з `on`, `off`, `once` і `emit`
> level: middle · difficulty: medium · id: js-12-task-02 · tags: patterns, observer, closures
>
> Умова: реалізуй клас `EventEmitter`. `on(event, fn)` підписує і повертає функцію відписки саме цієї підписки. `once(event, fn)` підписує на один виклик, `off(event, fn)` знімає підписку (зокрема створену через `once`). `emit(event, ...args)` синхронно викликає слухачів у порядку підписки і повертає `true`, якщо слухачі були, інакше `false`. Відписка чи підписка всередині слухача не повинна ламати поточний `emit`: викликаються ті, хто був підписаний на момент його початку. Приклад: `const e = new EventEmitter(); e.once('ready', (v) => console.log(v)); e.emit('ready', 1); e.emit('ready', 2);` виведе лише `1`, а другий `emit` поверне `false`.
>
> > [!hint]- Підказка 1
> > Зберігай для кожної події масив записів `{ fn, once }` у `Map`. Саме запис, а не голу функцію, щоб відписка знімала конкретну підписку.
>
> > [!hint]- Підказка 2
> > У `emit` ітеруй по копії масиву, а `once`-запис видаляй до виклику слухача, на випадок якщо слухач знову викличе `emit`.
>
> > [!hint]- Підказка 3
> > `off` шукає запис за `fn`, а функція, повернена з `on`, видаляє свій запис за посиланням через `indexOf`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class EventEmitter {
> >   #listeners = new Map();
> >
> >   on(event, fn) {
> >     return this.#add(event, fn, false);
> >   }
> >
> >   once(event, fn) {
> >     return this.#add(event, fn, true);
> >   }
> >
> >   off(event, fn) {
> >     const list = this.#listeners.get(event);
> >     if (!list) return;
> >     const index = list.findLastIndex((entry) => entry.fn === fn);
> >     if (index !== -1) this.#remove(event, list[index]);
> >   }
> >
> >   emit(event, ...args) {
> >     const list = this.#listeners.get(event);
> >     if (!list) return false;
> >     for (const entry of [...list]) {
> >       if (entry.once) this.#remove(event, entry);
> >       entry.fn.apply(this, args);
> >     }
> >     return true;
> >   }
> >
> >   #add(event, fn, once) {
> >     if (typeof fn !== 'function') throw new TypeError('Listener must be a function');
> >     const entry = { fn, once };
> >     const list = this.#listeners.get(event) ?? [];
> >     list.push(entry);
> >     this.#listeners.set(event, list);
> >     return () => this.#remove(event, entry);
> >   }
> >
> >   #remove(event, entry) {
> >     const list = this.#listeners.get(event);
> >     if (!list) return;
> >     const index = list.indexOf(entry);
> >     if (index !== -1) list.splice(index, 1);
> >     if (list.length === 0) this.#listeners.delete(event);
> >   }
> > }
> > ```
> >
> > Копія масиву в `emit` фіксує набір слухачів на момент виклику. Це та сама семантика, що в Node.js `EventEmitter`, і вона прибирає баг із пропущеним слухачем (див. тест про `forEach`). `once`-запис знімається до виклику, тому рекурсивний `emit` усередині слухача не запустить його вдруге, а `off` через `findLastIndex` знімає останню підписку з цією функцією, як у Node. `emit` працює за O(n), підписка — O(1), відписка — O(n). Виняток у слухачі перериває `emit` для решти, як і в Node; ізоляцію через `try/catch` з репортом додають, якщо цього вимагає контракт.
