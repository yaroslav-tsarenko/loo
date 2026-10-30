# Research: `rendering` — Рендеринг і RSC (теми 07–13)

> Шляхи — відносно `node_modules/next/dist/docs/01-app/` (Next.js **16.3.8**). URL = шлях без числових префіксів на
> `https://nextjs.org/docs/app/...`. `(не звірено з docs 16.3.8)` — не знайдено в бандлі.
> App Router 16 використовує вбудований React canary (19.2-фічі: View Transitions, `useEffectEvent`, Activity); у
> проєкті встановлено `react@19.3.0`.

## 1. Карта понять за темами

### 07 — Server і Client Components: ментальна модель (модельний розділ)
1. За замовчуванням усе в `app/` — Server Components: виконуються на сервері (build або request), не потрапляють у клієнтський JS, можуть бути `async`.
2. Client Components (`'use client'`) теж **пререндеряться в HTML на сервері** (SSR), а потім гідратуються. «Client» = «має JS у браузері», не «рендериться тільки в браузері».
3. Директива — межа в **графі модулів**: усе, що імпортує client-модуль, теж стає клієнтським (`02-guides/server-and-client-boundary.md#crossing-the-boundary`).
4. Два канали через межу: **код** — через імпорти; **дані** — через props (мають бути серіалізовані).
5. Коли Client: стан, ефекти, обробники подій, браузерні API, хуки на кшталт `useState`, контекст-провайдери.
6. Коли Server: доступ до БД/секретів, важкі бібліотеки (markdown, підсвітка) без впливу на бандл, даних ближче до джерела.
7. Сітка рішень «де виконається цей рядок» — основа вправ «передбач результат».

### 08 — Межа `'use client'`
1. Проводити межу якомога нижче (листки дерева): кнопка, а не вся сторінка.
2. Серіалізовані props: примітиви, plain objects, масиви, Date, Map, Set, typed arrays, Promise, React elements, Server Functions (як посилання). **Функції-обробники не перетинають межу — помилка.**
3. TS-плагін дозволяє function-prop у Client Component лише якщо ім'я `action` або закінчується на `Action` (`server-and-client-boundary.md`).
4. Композиція через `children`/slots: Server Component, переданий як `children` у Client Component, не тягне свій код у бандл.
5. `import 'server-only'` / `'client-only'` — помилка збірки при неправильному імпорті.
6. Контекст: провайдер — Client Component; обгортати якомога глибше, щоб не робити клієнтським зайве. Патерн: Server Component створює Promise і передає в провайдер, споживачі — `use(promise)`.
7. Сторонні бібліотеки без `'use client'` → обгортка-реекспорт.

### 09 — Як рендериться маршрут
1. Сервер рендерить Server Components у **RSC Payload** (Flight): дерево з результатами Server Components, плейсхолдерами Client Components (посилання на JS-чанки) і їх props.
2. З payload + Client Components будується HTML (SSR) для першого заходу.
3. Браузер: HTML показується одразу → payload узгоджує дерево → гідратація Client Components.
4. Клієнтська навігація: запит лише RSC payload (не HTML) змінених сегментів; partial rendering — спільні layouts не перерендерюються.
5. Payload вбудовано в HTML (`self.__next_f.push` скрипти) `(не звірено з docs 16.3.8 — деталь реалізації)`.
6. Hydration mismatch: дата/час, `Math.random`, `typeof window`, розширення браузера, невалідний HTML-вкладень (`<p><div>`).
7. Інструменти: `suppressHydrationWarning` (один рівень, лише атрибути/текст), inline-скрипт у `<head>` до гідратації (`02-guides/preventing-flash-before-hydration.md`).

### 10 — Статичне й динамічне
1. Static/dynamic — **спектр** (`02-guides/rendering-philosophy.md`): build-time prerender, межі на рівні маршруту, межі на рівні компонента.
2. **Без Cache Components (старий модель):** маршрут динамічний, якщо читає Request-time APIs (`cookies`, `headers`, `searchParams`, `draftMode`), `connection()`, `fetch` з `no-store`, або `dynamic = 'force-dynamic'`.
3. **З Cache Components:** усе динамічне за замовчуванням, але Next.js пререндерить **static shell** з усього, що не залежить від запиту й не робить незакешованого I/O; незакешований I/O чи runtime-дані поза `<Suspense>` = **помилка збірки/dev**.
4. `connection()` (`next/server`) — «чекати на реальний запит»; блокує й prefetch.
5. **`io()` (`next/cache`, 16.3)** — маркер «далі I/O» для синхронних джерел (`new Date()`, `Math.random()`, `crypto.randomUUID()`, `node:sqlite`): під час prerender призупиняється, у запиті/кеш-скоупі/браузері — резолвиться одразу. На відміну від `connection()`, не блокує prefetch і код після нього можна загорнути в `use cache`. Docs: «Prefer `io()` over `connection()`».
6. У Client Component: `use(io())` перед `Date.now()`.
7. Альтернатива для синхронних значень — захопити в shell через `'use cache'`.

### 11 — Streaming і Suspense
1. `loading.js` = `<Suspense>` навколо `page` сегмента (+ миттєвий стан для навігації і prefetch).
2. Гранулярні межі: sibling boundaries стрімляться паралельно; вкладені — поступова деталізація.
3. «Push dynamic access down»: не `await` на верху layout/page — переносити в дочірній компонент під Suspense.
4. Передача Promise з Server у Client і `use()`; спільний Promise через контекст.
5. HTTP-контракт: після початку стріму статус і заголовки вже відправлені — `200`. `notFound()` посеред стріму → не 404, а `<meta name="robots" content="noindex">`. Справжній 404 — `notFound()` **до** будь-якого `await`/Suspense (`02-guides/streaming.md#the-http-contract`).
6. Боти: `htmlLimitedBots` — список UA, яким віддається блокуюча metadata замість streaming metadata.
7. Що ламає стрімінг: буферизуючі reverse proxy (nginx → `X-Accel-Buffering: no`), CDN, компресія, serverless-платформи.
8. Web Vitals і стрімінг: TTFB/FCP кращі, LCP залежить від того, у shell чи в «дірці» LCP-елемент; CLS від fallback-ів без розміру.

### 12 — Partial Prerendering і Cache Components
1. `cacheComponents: true` вмикає PPR як поведінку за замовчуванням: static shell + стрімінг «динамічних дірок» в одному HTTP-відповіді.
2. Три види вмісту: static (без I/O), cached (`use cache`), streaming (у `<Suspense>`).
3. Помилки валідації: «Uncached data was accessed outside of `<Suspense>`», «URL data in Client Component outside Suspense» (`useSearchParams`), runtime data у `generateMetadata`.
4. Виправлення: `use cache` + `cacheLife` або `<Suspense>`; перенести `await params` у дочірній компонент; dynamic marker для metadata.
5. App Shell (для prefetch) ≠ static shell (для першого HTML), хоча обидва — пререндери.
6. Instant navigation: валідація кожної спільної межі layout; Navigation Inspector; `instant = false` для поступового впровадження; codemod `cache-components-instant-false` (16.3).
7. Activity: сторінки ховаються, а не розмонтовуються.
8. Обмеження: тільки Node.js runtime (edge deprecated), CSP з nonce несумісний з PPR.

### 13 — Помилки
1. `error.js` — Client Component, props `error` (`message`, `digest`), **`retry()`** (стабільний з 16.3; перезапит + ререндер у Transition) і `reset()` (тільки скидання стану, без перезапиту; не відновлює Server Component помилки).
2. У production повідомлення помилок Server Components замінені загальним текстом + `digest` для зіставлення з логами.
3. `global-error.js` — замінює root layout, має власні `<html><body>`.
4. `not-found.js` + `notFound()`; `global-not-found.js` (experimental).
5. `forbidden()`/`unauthorized()` + `forbidden.js`/`unauthorized.js` — **experimental**, потрібен `experimental.authInterrupts`.
6. **`catchError` (`next/error`, стабільний з 16.3)** — програмний error boundary будь-де в дереві; fallback `(props, { error, retry, reset })`; пропускає `redirect()`/`notFound()`; скидається на клієнтській навігації; fallback має бути Client Component.
7. Очікувані помилки — значення (повертати з дії, рендерити стан), неочікувані — виняток і boundary.
8. `unstable_rethrow` — повторно кинути внутрішні помилки Next.js у `try/catch`.
9. Помилки hydration — окремий клас (див. 09).

## 2. Поточні API-факти (16.3.8)

| Факт | Доказ |
|---|---|
| `io(): Promise<void>` з `next/cache`, додано 16.3.0 | `03-api-reference/04-functions/io.md` |
| `connection()` з `next/server`; заміна deprecated `unstable_noStore` (15.0) | `04-functions/connection.md`, `unstable_noStore.md` |
| `catchError(fallback)` з `next/error`, тип `ErrorInfo`; `unstable_catchError` (16.2) → stable (16.3) | `04-functions/catchError.md` |
| `error.js` prop `retry` (16.2 `unstable_retry` → 16.3 stable), `reset` лишився | `03-file-conventions/error.md` |
| `cacheComponents: true` (top-level) вмикає `use cache`, `cacheLife`, `cacheTag`, PPR, Activity-навігацію | `05-config/01-next-config-js/cacheComponents.md` |
| `experimental.ppr`, `experimental_ppr`, `experimental.dynamicIO`, `experimental.useCache` **видалені** в 16 | `02-guides/upgrading/version-16.md` |
| З Cache Components route segment config `dynamic`, `dynamicParams`, `revalidate`, `fetchCache` видалені/несумісні | `02-route-segment-config/index.md` |
| `runtime = 'edge'` **deprecated**; Cache Components потребує Node.js | `02-route-segment-config/runtime.md`, `cacheComponents.md` |
| Request-time APIs: `cookies()`, `headers()`, `searchParams`, `draftMode()` | `04-glossary.md#request-time-apis` |
| Async-only `cookies/headers/draftMode/params/searchParams` з 16.0 | `version-16.md#async-request-apis-breaking-change` |
| `forbidden()`/`unauthorized()` experimental, `experimental.authInterrupts`; кидають `NEXT_HTTP_ERROR_FALLBACK;403/401`, додають `noindex` | `04-functions/forbidden.md`, `05-config/.../authInterrupts.md` |
| Стрімінг: статус фіксується до стріму; `notFound()` mid-stream → `noindex` meta | `02-guides/streaming.md` |
| `htmlLimitedBots` — блокуюча metadata для заданих UA | `05-config/01-next-config-js/htmlLimitedBots.md` |
| `useSearchParams` завжди потребує `<Suspense>` під Cache Components; `usePathname`/`useParams` суспендять при невідомих params | `02-guides/migrating-to-cache-components.md` |
| `experimental.hideLogsAfterAbort` — ховати логи після bail-out з prerender | там само, «Route Handlers (GET)» |
| Codemod `cache-components-instant-false` (16.3) | `02-guides/upgrading/codemods.md#163` |
| `next build --debug-prerender` — налагодження помилок пререндеру | `03-api-reference/06-cli/next.md` |

## 3. Було → стало
| До | 16.x |
|---|---|
| 13–14: агресивне статичне кешування за замовчуванням (`fetch` force-cache) | 15: `fetch` не кешується; 16 + Cache Components: усе динамічне, кеш явний (`use cache`) |
| PPR: `experimental.ppr` + `experimental_ppr` (15 canary) | `cacheComponents: true`; PPR 16 працює інакше, ніж у 15 canary |
| `unstable_noStore()` | `connection()` (15) → а для синхронних значень `io()` (16.3) |
| `export const dynamic = 'force-dynamic'` | не потрібен — усе динамічне |
| `error.js` з `reset()` | `retry()` (16.3), `reset()` для особливих випадків |
| Власний класовий ErrorBoundary | `catchError` (16.3) |
| Edge runtime як «швидкий» варіант | deprecated; Node.js скрізь, edge-поведінка — через Proxy/CDN |

## 4. Пастки і продакшн-проблеми
- **`'use client'` на верхньому layout** — увесь застосунок стає клієнтським, бандл росте, секрети ризикують потрапити в імпортований модуль.
- **Передача функції в Client Component** — runtime-помилка; передача **цілого об'єкта користувача** з БД — витік полів (див. auth-security).
- **Hydration mismatch** від `new Date()`/`toLocaleString()`/`Math.random()`/`window`-перевірок у рендері; від локалі сервера vs браузера; від розширень (Grammarly додає атрибути до `<body>`).
- **`suppressHydrationWarning` як латка** — ховає симптом, діє лише на один рівень.
- **`await` на верху layout** (session, cookies) — блокує весь сегмент разом з `children`, вбиває стрімінг і shell.
- **`notFound()` після Suspense** → SEO отримує 200 + noindex замість 404.
- **Буферизація nginx/CDN** — стрімінг «не працює» в проді, хоча локально працює.
- **Cache Components як «перейменування флагу»** — увімкнення ламає збірку на кожному незакешованому доступі поза Suspense; міграція поступова (`instant = false`).
- **`try/catch` навколо `redirect()`/`notFound()`** ковтає control-flow винятки → `unstable_rethrow` або виносити з try.
- **`reset()` замість `retry()`** — помилка Server Component не відновлюється.
- **CSP з nonce + PPR** — несумісні (static shell не знає nonce).
- **Edge runtime + Cache Components** — не підтримується.

## 5. Interview angles
1. **Чи рендериться Client Component на сервері?** Так, SSR у HTML, потім гідратація; «client» означає JS у браузері.
2. **Що таке RSC Payload і що в ньому?** Результат Server Components, посилання на клієнтські чанки, props; використовується для HTML, гідратації та клієнтської навігації.
3. **Як вставити Server Component усередину Client Component?** Через `children`/props як елемент; не імпортом.
4. **Що робить маршрут динамічним (старий модель) і що змінилось з Cache Components?** Request-time APIs vs «усе динамічне, shell пререндериться, незакешоване — тільки в Suspense».
5. **`connection()` vs `io()`.** Обидва виключають з shell; `connection` чекає реального запиту й блокує prefetch, `io` — лише маркер I/O, сумісний з `use cache` і prefetch.
6. **PPR простими словами.** Один запит: static shell з fallback-ами одразу, дірки стрімляться; переваги для TTFB/LCP; вимоги до платформи.
7. **Як знайти й виправити hydration mismatch?** Повідомлення в dev overlay, детермінований рендер, ефект/inline script, `suppressHydrationWarning` лише для очікуваних різниць.
8. **Чому статус 200 при `notFound()`?** HTTP-контракт стрімінгу.
9. **`error.js` vs `catchError` vs `global-error`.** Рівень сегмента, будь-яке місце, заміна root layout; `retry` vs `reset`; `digest`.
10. **Як `forbidden()` працює й чому experimental?** Throw спец-помилки, `forbidden.js`, `authInterrupts`.

## 6. Що може перевірити раннер
1. **«Де виконається?»** — функція-класифікатор: дерево модулів з позначками `'use client'` → множина модулів у клієнтському бандлі (транзитивні імпорти).
2. **Валідатор серіалізації props**: `isSerializableProp(value)` (функції ✗, Date ✓, Map ✓, class instance ✗, Promise ✓).
3. **Порядок стрімінгу**: симуляція Suspense-меж з fake timers — у якому порядку прийдуть фрагменти; sibling vs nested.
4. **Статус-код**: функція `statusFor(events)` — `notFound` до/після першого flush → 404 або 200+noindex.
5. **Класифікатор компонентів під Cache Components**: за описом (`reads cookies`, `has use cache`, `inside Suspense`) → `static | cached | streaming | BUILD_ERROR`.
6. **Hydration-баг**: функція рендеру, що повертає різне на «сервері» і «клієнті» — виправити на детерміновану (передати час як аргумент).
7. **Модель error boundary**: дерево `layout/template/error/loading/not-found/page` — яка межа зловить помилку з певного вузла.
8. **`retry` vs `reset`**: модель стану boundary (refetch vs re-render) — тест, що `reset` не відновлює серверну помилку.

## 7. Джерела
- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://nextjs.org/docs/app/guides/server-and-client-boundary
- https://nextjs.org/docs/app/guides/rendering-philosophy
- https://nextjs.org/docs/app/guides/streaming
- https://nextjs.org/docs/app/getting-started/caching (розділ Prerendering)
- https://nextjs.org/docs/app/guides/migrating-to-cache-components
- https://nextjs.org/docs/app/guides/instant-navigation
- https://nextjs.org/docs/app/guides/preventing-flash-before-hydration
- https://nextjs.org/docs/app/getting-started/error-handling
- https://nextjs.org/docs/app/api-reference/functions/io · …/connection · …/catchError · …/forbidden · …/unauthorized · …/not-found · …/unstable_rethrow
- https://nextjs.org/docs/app/api-reference/file-conventions/error · …/loading · …/not-found
- https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents · …/htmlLimitedBots · …/authInterrupts
- https://react.dev/reference/rsc/server-components · https://react.dev/reference/rsc/use-client · https://react.dev/reference/react/Suspense · https://react.dev/reference/react/use · https://react.dev/reference/react-dom/client/hydrateRoot (hydration mismatch)
- https://overreacted.io (Dan Abramov про RSC) `(ідеї, не звірено з docs 16.3.8)`
- https://web.dev/articles/ttfb · https://web.dev/articles/lcp

## 8. Виправлення до SYLLABUS
1. **Тема 13:** `forbidden`/`unauthorized` — **experimental** (`experimental.authInterrupts`), не стабільні; писати з цією позначкою.
2. **Тема 13:** `catchError` імпортується з `next/error` і стабільний з 16.3 — ок; додати `unstable_rethrow` і різницю `retry`/`reset`.
3. **Тема 10:** додати, що `io()` імпортується з `next/cache` (не з `next/server`, як `connection()`), і явну рекомендацію docs «prefer `io()` over `connection()`».
4. **Тема 12:** «Instant navigation» — включно з `instant` segment config, Navigation Inspector і `@next/playwright instant()`; узгодити з темою 04 (prefetch) і 41 (e2e).
5. **Тема 12/§1:** згадати несумісності Cache Components: edge runtime (deprecated), CSP nonce, `dynamicParams`, порожній `generateStaticParams`.
6. **Тема 11:** додати HTTP-контракт стрімінгу (статус-коди, `htmlLimitedBots`, буферизація проксі) — це часта продакшн-проблема.
7. **Тема 09:** «прочитати RSC payload» — формат Flight не документовано в Next docs; позначати як деталь реалізації.
