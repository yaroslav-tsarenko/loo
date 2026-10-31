# Research: `data` — Дані й кеш (теми 14–20)

> Шляхи — відносно `node_modules/next/dist/docs/01-app/` (Next.js **16.3.8**). URL = `https://nextjs.org/docs/app/` +
> шлях без числових префіксів. `(не звірено з docs 16.3.8)` — не знайдено в бандлі.

**Головна методична думка:** у 16.x співіснують **дві моделі кешування** — Cache Components (`cacheComponents: true`,
рекомендована) і «Previous Model» (`02-guides/caching-without-cache-components.md`). Курс вчить нову, стару — лише як
«було → стало» (тема 17, 48). Кожен факт треба маркувати, до якої моделі він належить.

## 1. Карта понять за темами

### 14 — Дані на сервері
1. `async` Server Component + `await fetch()`/ORM прямо в компоненті; без `useEffect`.
2. **Водоспад** (sequential): `await a(); await b()` коли `b` не залежить від `a`; також «водоспад компонентів» — дочірній починає фетч лише після рендеру батька.
3. Паралельність: запустити проміси до `await`, `Promise.all` / `Promise.allSettled`; sibling Suspense boundaries.
4. **Preload-патерн**: викликати функцію без `await` до блокуючої роботи; функція мусить дедуплікуватися (`fetch` memoization, `React.cache`, або `'use cache'` / `'use cache: private'` з CC) — `01-getting-started/06-fetching-data.md#preloading-data`.
5. Дедуплікація: `fetch` GET з тим самим URL+options мемоізується **в межах рендер-проходу** (не в Route Handlers); `React.cache` — для ORM, scope = один запит.
6. `React.cache` **ізольований** усередині `use cache` (значення ззовні не видно).
7. Ланцюжок даних: DAL → DTO → компонент (див. auth-security).

### 15 — Cache Components: `use cache`
1. Увімкнення `cacheComponents: true`; `'use cache'` на рівні файлу, компонента або функції; функція мусить бути `async`.
2. **Ключ кешу**: build ID (або `deploymentId`) + function ID (хеш місця й сигнатури) + серіалізовані аргументи/props + захоплені змінні замикання + (dev) HMR hash. Root params — лише ті, що прочитані.
3. Серіалізація: аргументи — правила RSC (Server Function args) — суворіші; результати — правила Client props (можна JSX). Непідтримувані: class instances, функції (крім pass-through), Symbol, WeakMap, URL.
4. **Pass-through**: `children`/Server Action можна прийняти, якщо не інтроспектувати.
5. Заборонено всередині: `cookies()`, `headers()`, `searchParams` (помилка `next-request-in-use-cache`, по всьому стеку викликів), `connection()`. `draftMode().isEnabled` — можна читати.
6. `cacheLife(profile | {stale, revalidate, expire})` — пресети `default/seconds/minutes/hours/days/weeks/max`; кастомні профілі в `next.config` `cacheLife`.
7. `cacheTag(...tags)` — до 128 тегів на виклик, ≤256 символів.
8. Правила prerender: `revalidate: 0` або `expire < 5 хв` → «динамічна дірка»; `stale < 30 с` → поза prerender; `30 с ≤ stale < 5 хв` → у prerender, але поза App Shell.
9. Вкладений короткоживучий кеш усередині кешу без явного `cacheLife` → помилка збірки.
10. Рівні: файл (усі експорти), компонент (UI-кеш), функція (дані).
11. Зберігання: in-memory LRU per instance (serverless — ефемерно), розмір — `cacheMaxMemorySize`.

### 16 — Ревалідація
1. Time-based (SWR за `cacheLife`) і on-demand (теги/шляхи).
2. `revalidateTag(tag, profile)` — **обов'язковий другий аргумент** з 16; `'max'` рекомендовано; `{ expire: 0 }` — негайне протермінування (для вебхуків, де `updateTag` недоступний). Однаргументна форма deprecated (= `{ expire: 0 }`).
3. `updateTag(tag)` — **тільки Server Actions**; read-your-own-writes: наступне читання чекає свіжих даних.
4. `revalidatePath(path, type?)` — `type: 'page' | 'layout'` обов'язковий для патернів з `[slug]`; при rewrites — шлях **destination**; `revalidatePath('/', 'layout')` — усе.
5. `refresh()` (`next/cache`) — лише Server Actions; перезапит RSC payload поточного маршруту без інвалідації кешу.
6. Які API включають ререндер у відповідь дії: `updateTag`, `revalidatePath`, `refresh`, зміна cookies, `redirect`. `revalidateTag` зі SWR-профілем — **ні**.
7. Ревалідація запускається **запитом**, а не викликом (сторінки оновлюються, коли їх відвідують).
8. Механіка: explicit tags і **soft tags** `_N_T_/…/layout` для `revalidatePath`; кеш-хендлер `updateTags()/refreshTags()/getExpiration()` для мульти-інстансу.
9. Клієнтський кеш інвалідується `revalidateTag/Path`, `updateTag`, `router.refresh`, `cookies.set/delete`.

### 17 — ISR і CDN
1. З CC: `generateStaticParams` пререндерить перелічені шляхи; інші URL отримують App Shell одразу, потім «апгрейд» у фоні і кешування (`02-guides/incremental-static-regeneration-cache-components.md`).
2. Без CC (Previous Model): `export const revalidate = N`, `fetch(..., { next: { revalidate, tags } })`, `dynamic = 'force-static'`, порожній `generateStaticParams` + ISR.
3. Заголовки: `Cache-Control: s-maxage, stale-while-revalidate`; `expireTime` у config — SWR-час для CDN.
4. HTML і RSC payload ревалідуються разом і мають кешуватися разом (`Vary` на RSC-заголовках) — `02-guides/how-revalidation-works.md`, `02-guides/cdn-caching.md`.
5. Static prefetches для PPR-маршрутів кешуються на CDN; pathname-based cache keying — напрям розвитку.
6. Bots і стрімінг.

### 18 — `use cache: private` / `remote`, `cacheHandlers`
1. `'use cache: remote'` — durable спільний кеш через хендлер `remote`; має сенс для дірок, що виконуються при кожному запиті (за cookies/searchParams), rate-limited API, повільних бекендів. Ціна — мережа і гроші.
2. Коли **не** брати remote: швидкі (<50 мс) операції, унікальні ключі на запит, дані, що змінюються щосекунди.
3. Проєктування ключа: кешувати по виміру з малою кардинальністю (категорія, мова), фільтрувати решту в пам'яті.
4. `'use cache: private'` — можна `cookies()/headers()/searchParams` (не `connection()`); **не зберігається на сервері між запитами**, тільки дедуплікація в межах запиту + клієнтський кеш на `stale`. Кастомний хендлер неможливий.
5. Правила вкладення: remote у remote ✓, remote у `use cache` ✓, remote у private ✗, private у remote ✗.
6. `cacheHandlers: { default, remote, <custom> }` — інтерфейс `get(cacheKey, softTags)`, `set(cacheKey, pendingEntry)`, `refreshTags()`, `getExpiration(tags)`, `updateTags(tags, durations)`; кастомні імена → `'use cache: <name>'`.
7. **`cacheHandler` (однина) ≠ `cacheHandlers` (множина)**: однина — ISR, route handler responses, оптимізовані зображення (з 16.2), Pages Router; множина — `use cache`.
8. Жоден кеш `use cache*` **не переживає деплой** (ключ містить build/deployment ID). `fetch` Data Cache і `unstable_cache` — переживають.
9. Ключі й теги зберігаються **plain text** — не класти секрети/PII.

### 19 — Route Handlers і BFF
1. `app/**/route.ts`, методи `GET POST PUT PATCH DELETE HEAD OPTIONS`; `OPTIONS` автоматичний, якщо не визначений.
2. Не можна мати `route.ts` і `page.ts` в одному сегменті.
3. `RouteContext<'/api/[id]'>` helper; `context.params` — Promise.
4. Кешування: 15 — `GET` не кешується за замовчуванням; з CC — `GET` пререндериться, якщо не читає runtime/uncached дані; кеш через `use cache`.
5. Стрімінг (`ReadableStream`), CORS, вебхуки (перевірка підпису, сирий body), non-UI відповіді (RSS, sitemap).
6. Route Handler vs Server Action: публічний HTTP-контракт/вебхук/сторонні клієнти/GET-кешування → Route Handler; мутація з UI застосунку → Server Action.
7. Memoization `fetch` у Route Handlers **не діє**.

### 20 — Бази даних і клієнтський fetching
1. Пули з'єднань у serverless: глобальний singleton клієнта (`globalThis` у dev через HMR), serverless-драйвери (HTTP), PgBouncer/пулер провайдера; Fluid Compute зменшує проблему `(не звірено з docs 16.3.8)`.
2. Транзакції — в одній Server Action/DAL-функції.
3. Drizzle/Prisma: мінімальний набір полів (select), DTO.
4. Клієнтський fetching: SWR, TanStack Query (є гайди `02-guides/client-side-data-fetching/{swr,tanstack-query}.md`); коли: часте оновлення, поллінг, нескінченний скрол, дані, залежні від клієнтського стану.
5. `use()` + Promise з сервера як міст: почати фетч на сервері, розгорнути на клієнті.
6. Синхронні драйвери (`node:sqlite`) під CC — потрібен `await io()`.

## 2. Поточні API-факти (16.3.8)

| Факт | Доказ |
|---|---|
| `'use cache'` потребує `cacheComponents`; файл/компонент/функція, async | `03-api-reference/01-directives/use-cache.md` |
| Склад ключа кешу (build ID/deploymentId, function ID, args, closures, HMR) | `use-cache.md#cache-keys` |
| Клієнтський мінімум `stale` 30 с; заголовок `x-nextjs-stale-time` | `use-cache.md#use-cache-at-runtime` |
| `default` профіль: stale 5 хв, revalidate 15 хв, expire never; таблиця пресетів | `04-functions/cacheLife.md#preset-cache-profiles` |
| Правила включення в prerender/App Shell за `stale/revalidate/expire` | `cacheLife.md#prerendering-behavior` |
| `cacheTag`: ≤128 тегів/виклик, ≤256 символів | `04-functions/cacheTag.md` |
| `revalidateTag(tag: string, profile: string \| { expire?: number }): void` | `04-functions/revalidateTag.md` |
| `revalidateTag` не можна в Client Components і Proxy | там само |
| `updateTag(tag: string): void` — тільки Server Actions | `04-functions/updateTag.md` |
| `revalidatePath(path: string, type?: 'page' \| 'layout'): void`; ≤1024 символи | `04-functions/revalidatePath.md` |
| `refresh(): void` з `next/cache`, лише Server Actions | `04-functions/refresh.md` |
| `cacheLife`/`cacheTag` стабільні (без `unstable_`) з 16 | `02-guides/upgrading/version-16.md#cachelife-and-cachetag` |
| `'use cache: private'` — cookies/headers/searchParams ✓, connection ✗; без серверного зберігання; не кастомізується | `01-directives/use-cache-private.md` |
| `'use cache: remote'` — хендлер `remote`; таблиця порівняння трьох директив; правила вкладення | `01-directives/use-cache-remote.md` |
| `cacheHandlers` (16.0): `default`, `remote`, кастомні; методи `get/set/refreshTags/getExpiration/updateTags` | `05-config/01-next-config-js/cacheHandlers.md` |
| `cacheHandler` (однина) — ISR/route handlers/images; не для `use cache` | `05-config/01-next-config-js/incrementalCacheHandlerPath.md` |
| `cacheMaxMemorySize` — розмір in-memory кешу | `05-config/01-next-config-js/cacheMaxMemorySize.md` |
| Soft tags `_N_T_`; `revalidateTag` локальний для інстансу без координації | `02-guides/how-revalidation-works.md` |
| `generateStaticParams` з CC ≥ 1 параметр; `dynamicParams` несумісний | `04-functions/generate-static-params.md`, `02-guides/migrating-to-cache-components.md` |
| `fetch` GET мемоізується в рендер-проході; не в Route Handlers | `04-functions/fetch.md#memoization` |
| `fetch(url, { cache: 'force-cache' \| 'no-store', next: { revalidate, tags } })` — Previous Model | `04-functions/fetch.md`, `02-guides/caching-without-cache-components.md` |
| `unstable_cache` — «replaced by `use cache` in Next.js 16», але docs `use-cache` радять його ж для **кешу між деплоями** | `04-functions/unstable_cache.md`, `use-cache.md` (NOTE) |
| `io()` для синхронних джерел даних | `04-functions/io.md` |
| Draft Mode: усі cached-функції виконуються щоразу і не зберігаються | `use-cache.md#draft-mode` |
| `RouteContext` helper, `OPTIONS` автоматичний | `03-file-conventions/route.md` |

## 3. Було → стало
| До | Зараз |
|---|---|
| 14: `fetch` кешується за замовчуванням (Data Cache), `GET` handlers статичні | 15: обидва не кешуються за замовчуванням |
| `fetch(..., { next: { revalidate: 60, tags } })` | `'use cache'` + `cacheLife(...)` + `cacheTag(...)` |
| `unstable_cache(fn, keyParts, { revalidate, tags })` | `'use cache'` (ключ — автоматично з аргументів) |
| `export const revalidate = 60` | `cacheLife` (найближчий пресет або кастомний профіль) |
| `export const dynamic = 'force-static'` / `fetchCache` | видалити; `use cache` |
| `revalidateTag('posts')` | `revalidateTag('posts', 'max')` або `updateTag('posts')` у дії |
| `router.refresh()` на клієнті після дії | `refresh()` у Server Action (одним roundtrip) |
| `unstable_cacheLife`, `unstable_cacheTag` | `cacheLife`, `cacheTag` |
| `experimental.dynamicIO` / `useCache` | `cacheComponents: true` |
| `generateStaticParams` → `[]` для «все на runtime» | ≥ 1 параметр; невідомі отримують shell і апгрейд |

## 4. Пастки і продакшн-проблеми
- **Кешування даних користувача в спільний кеш**: `use cache` з `userId` як аргументом — ОК (ключ), але експортована функція, що приймає `userId` від будь-кого, = IDOR. Тримати cached-функцію неекспортованою, а експортований геттер — з перевіркою сесії (`02-guides/authentication-with-cache-components.md`).
- **Секрети/PII у ключах і тегах** — зберігаються plain text у хендлері (Redis).
- **«Кеш не працює в проді на Vercel/serverless»** — in-memory `use cache` ефемерний між інстансами; потрібен `remote` або платформний хендлер.
- **`revalidateTag` на одному інстансі** при self-hosting — інші віддають старе (потрібні `updateTags/refreshTags` у спільному сховищі).
- **Очікування, що `use cache` переживе деплой** — ні; для довговічних даних — `fetch`-кеш/`unstable_cache` або зовнішній KV.
- **Висока кардинальність ключа** (фільтри ціни, пошук) — нульовий hit-rate і роздутий remote-кеш.
- **Водоспади** в layout→page→компонент; `await` у циклі; ORM N+1.
- **`React.cache` для передачі даних у `use cache`** — не працює (ізоляція).
- **`revalidatePath` замість тегу** — оновлює одну сторінку, інші з тим самим тегом лишаються старими.
- **`revalidateTag` з SWR у дії і очікування, що користувач побачить зміну** — ні, потрібен `updateTag`.
- **Пули з'єднань**: новий клієнт Prisma на кожен HMR/запит → «too many connections».
- **Великі кешовані payload** (весь каталог) — пам'ять процесу, `cacheMaxMemorySize`.
- **Вкладені кеші** з коротшим `cacheLife` всередині довшого без явного профілю → build error.

## 5. Interview angles
1. **Скільки шарів кешу в Next.js 16 і де вони живуть?** Prerendered HTML (диск/CDN), server store (in-memory / remote handler), браузерний Client Cache; request memoization (`fetch`, `React.cache`). Усе — в межах одного деплою.
2. **`updateTag` vs `revalidateTag` vs `revalidatePath` vs `refresh`.** Семантика (RYOW vs SWR vs шлях vs лише payload), де можна викликати, чи ререндерить відповідь дії.
3. **З чого складається ключ `use cache`?** І чому замикання — частина ключа; чому `cookies()` не можна.
4. **Коли `use cache: remote`?** Дірки на кожен запит, захист бекенду, rate limits; коли не варто; кардинальність.
5. **`use cache: private` — це кеш на сервері?** Ні: дедуплікація в запиті + браузер.
6. **Як прибрати водоспад?** Паралельні проміси, preload, Suspense siblings, перенесення фетчу ближче до кореня або нижче за Suspense.
7. **Route Handler чи Server Action?** Публічний контракт vs внутрішня мутація; CSRF-захист дій; кешування GET.
8. **Self-hosting на 3 інстансах: що зламається в кеші?** Локальна ревалідація, `cacheHandlers` + `cacheHandler`, `deploymentId`, ключ шифрування дій.
9. **Як ISR працює з Cache Components?** `generateStaticParams` ≥ 1, shell для невідомих, фоновий апгрейд.
10. **Чому `stale` ≥ 30 с важливий?** Інакше prefetch протермінується до кліку; поза prerender.

## 6. Що може перевірити раннер
1. **Детектор водоспаду**: дано async-функції з затримками (fake timers) — переписати на паралельні; тест рахує загальний час / максимальну конкурентність.
2. **Модель ключа `use cache`**: `cacheKey({ buildId, fnId, args, closure })` + тест на стабільність серіалізації і відмову для class instance/функції.
3. **Симулятор `cacheLife`**: з fake timers — fresh/stale/expired за `{stale, revalidate, expire}`; що повертає get у кожній фазі (SWR).
4. **`revalidateTag` vs `updateTag`**: модель кешу з тегами — після `revalidateTag(t,'max')` наступний get повертає старе + запускає фон; після `updateTag(t)` — чекає свіжого.
5. **Класифікатор prerender**: за профілем → `dynamic-hole | prerender-not-shell | app-shell` (правила 0 / 5 хв / 30 с).
6. **Soft tags**: `softTagsFor('/blog/hello')` → `['_N_T_/layout','_N_T_/blog/layout','_N_T_/blog/hello/layout','_N_T_/blog/hello']`; `revalidatePath` інвалідує відповідні записи.
7. **Знайди баг**: cached-функція з `userId` експортована без перевірки сесії; або тег з email.
8. **In-memory LRU cache handler** з `get/set(pendingEntry)` і перевіркою протермінування.
9. **Route Handler як чиста функція**: `handle({ method, headers, body })` → `{ status, headers }` з CORS preflight.
10. **Вебхук**: перевірка HMAC-підпису (через вбудований у раннер хеш або мок) + ідемпотентність за `eventId`.

## 7. Джерела
- https://nextjs.org/docs/app/getting-started/fetching-data · …/caching · …/revalidating · …/route-handlers
- https://nextjs.org/docs/app/api-reference/directives/use-cache · …/use-cache-private · …/use-cache-remote
- https://nextjs.org/docs/app/api-reference/functions/cacheLife · …/cacheTag · …/revalidateTag · …/updateTag · …/revalidatePath · …/refresh · …/fetch · …/unstable_cache · …/generate-static-params · …/io
- https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents · …/cacheHandlers · …/incrementalCacheHandlerPath · …/cacheLife · …/cacheMaxMemorySize · …/expireTime
- https://nextjs.org/docs/app/guides/how-revalidation-works · …/caching-without-cache-components · …/migrating-to-cache-components · …/incremental-static-regeneration-cache-components · …/incremental-static-regeneration · …/cdn-caching · …/backend-for-frontend · …/client-side-data-fetching
- https://react.dev/reference/react/cache · https://react.dev/reference/react/use
- https://developer.mozilla.org/docs/Web/HTTP/Caching · https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control
- https://vercel.com/docs/runtime-cache · https://vercel.com/docs/incremental-static-regeneration `(не звірено з docs 16.3.8)`
- https://orm.drizzle.team/docs · https://www.prisma.io/docs · https://swr.vercel.app · https://tanstack.com/query

## 8. Виправлення до SYLLABUS
1. **Тема 16:** `refresh()` — з `next/cache` і **тільки Server Actions**; не плутати з `router.refresh()`. `updateTag` — також тільки Server Actions (у Route Handler — `revalidateTag(tag, { expire: 0 })`).
2. **Тема 16:** додати `{ expire: 0 }` для вебхуків і факт «однаргументний `revalidateTag` deprecated = expire 0».
3. **Тема 17:** назва «кешування без Cache Components» — ок, але ISR з Cache Components має **окремий гайд** (`incremental-static-regeneration-cache-components.md`) — включити як основний матеріал, а старий ISR — як «було».
4. **Тема 18:** додати розрізнення `cacheHandler` (однина: ISR, route handlers, images) vs `cacheHandlers` (множина: `use cache`) і факт «жоден `use cache*` не переживає деплой» + plain-text ключі/теги.
5. **Тема 18:** нюанс: docs водночас називають `unstable_cache` «заміненим» і рекомендують його для кешу між деплоями — подавати чесно як компроміс.
6. **Тема 14:** preload-патерн з `'use cache: private'` (дедуплікація в запиті) — новий у 16.
7. **Тема 20:** `io()` для синхронних драйверів (`node:sqlite`) під CC.
8. **§1 `data`:** додати `io()` і soft tags/`how-revalidation-works` (для senior/god).
