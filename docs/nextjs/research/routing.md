# Research: `routing` — Маршрутизація (теми 01–06)

> Джерело істини — бандл docs Next.js **16.3.8** (`node_modules/next/dist/docs/`). Усі шляхи нижче — відносно
> `node_modules/next/dist/docs/01-app/`. URL на nextjs.org = той самий шлях без числових префіксів:
> `03-api-reference/04-functions/use-router.md` → `https://nextjs.org/docs/app/api-reference/functions/use-router`.
> Позначка `(не звірено з docs 16.3.8)` — факт із пам'яті чи зовнішнього джерела, не знайдений у бандлі.

## 1. Карта понять за темами

### 01 — App Router: сегменти, спеціальні файли, ієрархія рендеру
1. Папка = сегмент URL; маршрут стає публічним лише коли є `page.js` або `route.js` (colocation безпечна).
2. Спеціальні файли: `layout`, `template`, `page`, `loading`, `error`, `global-error`, `not-found`, `global-not-found` (experimental), `forbidden`/`unauthorized` (experimental), `default`, `route`.
3. Ієрархія обгортання (точно за docs): `layout` → `template` → `error` (error boundary) → `loading` (Suspense) → `not-found` (boundary) → `page` або вкладений `layout`. Джерело: `01-getting-started/02-project-structure.md#component-hierarchy`.
4. Наслідок: `error.js` сегмента **не** ловить помилки `layout.js` того самого сегмента — їх ловить `error.js` батька.
5. Приватні папки `_folder`, route groups `(group)`, `src/`, metadata-файли (`icon`, `opengraph-image`, `sitemap`, `robots`).
6. Root layout обов'язковий, містить `<html>` і `<body>`.

### 02 — Layouts, templates, route groups, кілька root layouts
1. Layout зберігає стан і не перерендерюється при навігації між дочірніми сторінками (partial rendering).
2. `template.js` монтується заново при кожній навігації (новий key) — для анімацій входу, скидання стану, логування переглядів.
3. Route groups `(marketing)`, `(shop)` — організація без впливу на URL; кілька root layouts → перехід між ними = повне перезавантаження сторінки.
4. Кілька root layouts ускладнюють глобальну 404 → `global-not-found.js` (потрібен `experimental.globalNotFound`).
5. **Нове з Cache Components:** сторінки не розмонтовуються, а ховаються через `<Activity>` — «template для скидання стану» вже не єдиний інструмент; є `useRouter().bfcacheId` як key (див. тему 04).
6. Типи-хелпери `LayoutProps<'/route'>`, `PageProps<'/route'>` (генеруються `next dev`/`build`/`typegen`).

### 03 — Динамічні маршрути
1. `[slug]`, `[...slug]` (catch-all), `[[...slug]]` (optional catch-all).
2. `params` — **Promise** (з 15 — async з sync-сумісністю; з 16 — тільки async). `searchParams` — Promise лише в `page`.
3. `generateStaticParams`: повертає масив об'єктів params; вкладені сегменти отримують `params` батька.
4. `dynamicParams` (default `true`): `false` → 404 для непрегенерованих. **Несумісний з `cacheComponents`** — build падає.
5. З Cache Components: `generateStaticParams` має повернути **≥1** параметр (порожній масив = build error); `await params` всередині `<Suspense>`, щоб shell пререндерився для невідомих params.
6. `next/root-params` (16.3): параметри сегментів **до root layout** як async-геттери (`import { lang } from 'next/root-params'`).

### 04 — Навігація під капотом
1. `<Link>` = `<a>` + client-side navigation + prefetch у viewport (лише production).
2. Значення `prefetch`: `"auto"`/`null` (default), `true`, `false`. Без Partial Prefetching: static → повний маршрут, dynamic → до найближчого `loading.js`.
3. Client Cache (router cache): RSC payload у пам'яті браузера; layouts і loading states перевикористовуються; pages за замовчуванням не кешуються (крім back/forward).
4. `staleTimes` (experimental): `dynamic` default 0 с, `static` default 5 хв; рекомендовано натомість `stale` у `cacheLife`. Клієнт примусово тримає мінімум 30 с.
5. **16.0:** перебудова роутера — layout deduplication при prefetch, incremental prefetching (лише відсутні частини). Більше запитів, менше байтів.
6. **16.2–16.3:** prefetch inlining (дрібні сегменти бандляться в один відповідь; `experimental.prefetchInlining`, default увімкнено з 16.3).
7. **16.3:** Partial Prefetching (`partialPrefetching: true` + `cacheComponents`): один App Shell на маршрут замість prefetch на кожне посилання; `prefetch={true}` → per-link prefetch з URL data.
8. Segment config `export const prefetch = 'partial' | 'force-disabled'` (лише з Cache Components).
9. Instant navigation: `export const instant = true | false | { level: 'warning' }` — dev-валідація, що навігація дає миттєвий UI; Navigation Inspector у DevTools; `instant()` з `@next/playwright`.
10. Activity: до 3 збережених маршрутів, DOM ховається `display: none`; стан форм, scroll, `<details>` зберігаються; ефекти очищуються й перезапускаються.
11. `useLinkStatus()` → `{ pending }` для індикатора на посиланні; `onNavigate` на `Link`; `transitionTypes` (16.2) для View Transitions.
12. `useRouter()`: `push`, `replace`, `refresh`, `prefetch`, `back`, `forward`, `bfcacheId`.
13. Безпека: не передавати неперевірені URL у `router.push` (`javascript:` → XSS).

### 05 — Parallel і intercepting routes
1. Слоти `@name` — передаються в layout як props; не впливають на URL.
2. `default.js` — фолбек слота при hard navigation (reload). **Документація 16 каже «обов'язковий, інакше build падає», але на 16.3.8 `next build` проходить:** вбудований default викликає `notFound()`, тож після F5 — 404. Перевіряти в CI/рев’ю (див. тему 05).
3. Soft navigation зберігає активний стан слота; hard navigation → `default.js`.
4. Intercepting: `(.)`, `(..)`, `(..)(..)`, `(...)` — відносно **сегментів маршруту**, не файлової системи (route groups і слоти не рахуються).
5. Патерн «модалка з URL»: `@modal/(.)photo/[id]/page.tsx` + повна сторінка `photo/[id]/page.tsx`; закриття — `router.back()`; `default.js` слота повертає `null`.

### 06 — `proxy.ts`, redirects, rewrites, headers
1. `proxy.ts` (раніше `middleware.ts`) у корені або `src/`; експорт `proxy` (named або default) + `config.matcher`.
2. Порядок обробки запиту: `headers` (config) → `redirects` (config) → Proxy → `beforeFiles` rewrites → файлові маршрути → `afterFiles` → динамічні маршрути → `fallback`.
3. Matcher: рядок/масив, `source`, `has`, `missing`, `locale`; значення мають бути константами (статичний аналіз).
4. `NextResponse.next({ request: { headers } })` (передати заголовки вгору) vs `NextResponse.next({ headers })` (віддати клієнту).
5. Де робити redirect: `next.config` `redirects()` (статичні, до Proxy), Proxy (за cookie/geo/AB), `redirect()`/`permanentRedirect()` у Server Component/Action (за даними).
6. Обмеження: Proxy — **лише оптимістичні** перевірки; Server Functions — POST на маршрут сторінки, тож matcher, що виключає шлях, виключає й дії.

## 2. Поточні API-факти (16.3.8)

| Факт | Доказ |
|---|---|
| Ієрархія `layout → template → error → loading → not-found → page` | `01-getting-started/02-project-structure.md` |
| `middleware` deprecated, перейменовано на `proxy`; функціональність та сама | `03-api-reference/03-file-conventions/middleware.md`, `proxy.md` |
| Proxy завжди Node.js runtime; `runtime` у proxy-файлі кидає помилку; Edge у proxy **не** підтримується (лишайся на `middleware`, якщо треба edge) | `proxy.md#runtime`, `02-guides/upgrading/version-16.md#middleware-to-proxy` |
| Codemod `npx @next/codemod@canary middleware-to-proxy .` | `proxy.md#migration-to-proxy` |
| `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize` (16.0) | `05-config/01-next-config-js/skipProxyUrlNormalize.md` |
| `experimental.proxyClientMaxBodySize`, default 10MB (буферизація тіла для повторного читання) | `05-config/01-next-config-js/proxyClientMaxBodySize.md` |
| Proxy викликається й для `_next/data` навіть якщо виключено в negative matcher (захисна поведінка) | `proxy.md#negative-matching` |
| Тестування: `unstable_doesMiddlewareMatch` (на 16.3.8 саме так; у чистому Node потребує `globalThis.AsyncLocalStorage`), `isRewrite`, `getRewrittenUrl`, `getRedirectUrl` з `next/experimental/testing/server` (з 15.1) | `proxy.md#unit-testing-experimental` |
| `unstable_getResponseFromNextConfig` — юніт-тест `redirects/rewrites/headers` конфігу | `05-config/01-next-config-js/index.md#unit-testing-experimental` |
| `Link` props: `href`, `replace`, `scroll`, `prefetch` (`"auto"`/`null`/`true`/`false`), `onNavigate` (15.3), `transitionTypes` (16.2) | `03-api-reference/02-components/link.md` |
| `partialPrefetching: boolean` (default `false`), **потребує** `cacheComponents`, інакше помилка валідації конфігу; з'явився в 16.3.0; top-level (не experimental) | `05-config/01-next-config-js/partialPrefetching.md` |
| `experimental.prefetchInlining`: `true` (default з 16.3) / `false` / `{ maxSize: 2048, maxBundleSize: 10240 }` (байти gzip) | `05-config/01-next-config-js/prefetchInlining.md` |
| Segment config `prefetch: 'auto' \| 'partial' \| 'force-disabled'` (лише Cache Components; не в Client Component) | `03-file-conventions/02-route-segment-config/prefetch.md` |
| Segment config `instant: true \| false \| { level?: 'warning' }`; глобально `experimental.instantInsights.validationLevel: 'warning' \| 'manual-warning'` | `02-route-segment-config/instant.md` |
| `@next/playwright` → `instant(page, fn, { baseURL? })` | `02-guides/instant-navigation.md` |
| App Shell: per-route пререндер без URL data; cached content з `stale ≥ 5 хв`; з `cookies()/headers()` — кешується per-session на клієнті | `04-glossary.md#app-shell` |
| URL data = `params`, `searchParams`, `usePathname`, `useSearchParams` | `04-glossary.md#url-data` |
| Activity: до 3 маршрутів; `useRouter().bfcacheId` як key для скидання на push/replace | `02-guides/preserving-ui-state.md`, `04-functions/use-router.md#bfcacheid` |
| `experimental.staleTimes` `{ dynamic: 0, static: 300 }` за замовчуванням; клієнтський мінімум 30 с | `05-config/01-next-config-js/staleTimes.md`, `01-directives/use-cache.md` |
| Parallel slots потребують `default.js` за документацією 16.0 («build fails»); на 16.3.8 build проходить, вбудований default → notFound() | `02-guides/upgrading/version-16.md#parallel-routes-defaultjs-requirement` |
| `next/root-params` (16.3.0): лише Server Components; не Client, не Server Actions, не Route Handlers; kebab-case імена не підтримуються | `04-functions/next-root-params.md` |
| `unstable_rootParams` видалено → `next/root-params` | `version-16.md` |
| `typedRoutes` стабільний (top-level, не `experimental`) | `05-config/01-next-config-js/typedRoutes.md` |
| `experimental.globalNotFound` + `app/global-not-found.js` | `03-file-conventions/not-found.md` |
| `useLinkStatus` (15.3) | `04-functions/use-link-status.md` |
| `data-scroll-behavior="smooth"` на `<html>`, щоб повернути старе перевизначення scroll-behavior | `version-16.md#scroll-behavior-override` |
| Experimental `useOffline` (`next/offline`) + `experimental.useOffline` — авто-ретрай навігацій/prefetch/дій офлайн | `04-functions/use-offline.md`, `05-config/.../useOffline.md` |

## 3. Було → стало

| До | 16.x |
|---|---|
| 13–14: client router cache тримав dynamic pages 30 с | 15: `staleTimes.dynamic` = 0; 16: керування через `cacheLife.stale` |
| `params` — об'єкт | 15: Promise із sync-сумісністю; 16: лише Promise (`next-async-request-api` codemod) |
| `middleware.ts`, Edge за замовчуванням | 15.5: Node runtime стабільний; 16: `proxy.ts`, тільки Node |
| prefetch повного маршруту на кожне посилання | 16.0: dedup layouts + incremental; 16.3: Partial Prefetching (App Shell на маршрут) |
| Слот без `default.js` — тихий 404 | 16.3.8: build проходить, після F5 — 404 (документація каже «помилка збірки») |
| Скидання стану — розмонтування сторінки | 16 + Cache Components: Activity зберігає стан; скидання явно |
| `unstable_rootParams` | `next/root-params` (16.3) |
| `scroll-behavior: smooth` перевизначалося автоматично | 16: не перевизначається без `data-scroll-behavior` |

## 4. Пастки і продакшн-проблеми
- **Auth лише в Proxy.** Server Action на маршруті, виключеному matcher-ом, — без захисту. Перевірка — біля даних (DAL).
- **Matcher з динамічними значеннями** ігнорується (статичний аналіз) — proxy тихо не спрацьовує.
- **`NextResponse.next({ headers })`** — секретний заголовок іде клієнту замість upstream.
- **Великі заголовки з Proxy** → 431.
- **`revalidatePath` при rewrites** — передавати destination, не source.
- **Відсутній `default.js`** — на 16.3.8 build проходить (усупереч документації); при reload — 404.
- **Intercepting `(..)`** рахується за сегментами маршруту — групи `(group)` не рахуються; часта плутанина.
- **Activity зберігає стан**: відкриті дропдауни, старі повідомлення «успіх», дані попереднього користувача після logout через `router.push` (рекомендовано `window.location.href` для logout або key на `userId`).
- **Глобальні стилі прихованої сторінки** продовжують діяти (Activity) — вимикати через `media`.
- **Prefetch у dev не працює** — «повільна навігація в dev» ≠ продакшн.
- **Збільшена кількість prefetch-запитів** у 16 може тригерити rate limit/WAF.
- **`prefetch={true}` на динамічних маршрутах** = серверний рендер на кожне посилання у viewport — CPU і рахунок.
- **`router.push(userInput)`** — XSS через `javascript:`.
- **Root layout з `cookies()` для `lang`/`theme`** робить усе дерево request-bound; для `lang` — root params.

## 5. Interview angles
1. **Чому `error.js` не ловить помилку з `layout.js` того ж сегмента?** Ієрархія: error boundary всередині layout; ловить батьківський `error.js`/`global-error`.
2. **Layout vs template.** Layout зберігає стан, template ремаунтиться; у 16 + Activity стан зберігається навіть для pages, і для скидання є `bfcacheId`.
3. **Що відбувається при наведенні/появі Link у viewport?** Prefetch у prod; що саме — залежить від static/dynamic, `loading.js`, Partial Prefetching (App Shell vs per-link). Client Cache, `stale` ≥ 30 с.
4. **Middleware → Proxy: що змінилось і чому?** Назва (мережевий кордон, не Express-middleware), лише Node runtime, «останній засіб»; codemod; конфіг-флаги перейменовані.
5. **Де робити редирект?** Config (статичні, найраніше), Proxy (за запитом), `redirect()` (за даними); 307/308 vs `permanentRedirect`; `redirect` кидає виняток.
6. **Модалка з URL.** Parallel + intercepting, `default.js`, поведінка при reload і «назад».
7. **Чому Proxy не є межею безпеки?** Матчер, Server Functions як POST на маршрут, CVE-2025-29927 (обхід через `x-middleware-subrequest`) `(не звірено з docs 16.3.8)`.
8. **Async `params`: навіщо?** Дозволяє пререндерити shell до того, як параметри відомі; стрімінг; з Cache Components — `await` всередині Suspense.
9. **Root params vs `params`.** Геттери, ключ кешу лише з прочитаних root params, без prop drilling.
10. **Partial Prefetching vs per-link prefetch.** Один shell на маршрут, URL data після навігації; `prefetch={true}` — дорожче, але повний вміст.

## 6. Що може перевірити раннер (чистий JS)
1. **Матчер маршрутів**: функція `match(pattern, pathname)` для `[id]`, `[...slug]`, `[[...slug]]` → params або `null`.
2. **Логіка proxy**: `proxy({ url, cookies, headers })` → `{ type: 'redirect'|'rewrite'|'next', to? }` (auth-redirect, i18n-префікс, A/B за cookie).
3. **Порядок обробки**: симулятор пайплайна `headers → redirects → proxy → beforeFiles → fs → afterFiles → dynamic → fallback`; задача «який крок поверне відповідь».
4. **Matcher із негативним lookahead**: реалізувати/перевірити regex, що виключає `_next/static`, `_next/image`, `favicon.ico`.
5. **`generateStaticParams`** для вкладених сегментів (категорія × товар), включно з правилом «≥1 з Cache Components».
6. **Розв'язання intercepting**: за поточним маршрутом і `(..)` визначити цільовий сегмент.
7. **Модель Client Cache** з fake timers: `stale`, мінімум 30 с, інвалідація `router.refresh()`/`cookies.set`.
8. **Activity LRU**: модель «до 3 маршрутів, найстаріший витісняється»; `bfcacheId` змінюється на push/replace, не на back/forward.
9. **Конфіг як об'єкт**: `redirects()` з `has/missing`, перевірка `permanent` → 308/307.
10. **Парсинг `searchParams`** (рядок | масив | undefined) у типізований фільтр.

## 7. Джерела
- https://nextjs.org/docs/app/getting-started/project-structure
- https://nextjs.org/docs/app/getting-started/layouts-and-pages
- https://nextjs.org/docs/app/getting-started/linking-and-navigating
- https://nextjs.org/docs/app/getting-started/proxy
- https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes · …/intercepting-routes · …/default · …/dynamic-routes · …/template · …/route-groups
- https://nextjs.org/docs/app/api-reference/components/link
- https://nextjs.org/docs/app/api-reference/functions/use-router · …/use-link-status · …/next-root-params · …/generate-static-params
- https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching · …/prefetchInlining · …/staleTimes · …/redirects · …/rewrites · …/headers
- https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/prefetch · …/instant
- https://nextjs.org/docs/app/guides/prefetching · …/optimizing-prefetching · …/adopting-partial-prefetching · …/instant-navigation · …/preserving-ui-state · …/redirecting
- https://nextjs.org/docs/app/guides/upgrading/version-16
- https://react.dev/reference/react/Activity
- https://developer.mozilla.org/docs/Web/HTTP/Redirections
- https://nextjs.org/blog/cve-2025-29927 `(не звірено з docs 16.3.8)`

## 8. Виправлення до SYLLABUS
1. **Тема 01:** порядок у SYLLABUS правильний; додати `global-not-found` (experimental) і `forbidden`/`unauthorized` як файли (experimental, `authInterrupts`).
2. **Тема 03:** додати `next/root-params` (16.3) — зараз згаданий лише в темі 34. І правило Cache Components: `dynamicParams` несумісний, `generateStaticParams` ≥ 1.
3. **Тема 04:** `staleTimes` — **experimental**, рекомендована заміна — `cacheLife.stale`; додати `prefetchInlining`, segment config `prefetch`, `instant` (Instant navigation зараз у темі 12 — краще розділити: механіка prefetch тут, валідація `instant` у 12), `useLinkStatus`, `bfcacheId`, `transitionTypes`.
4. **Тема 04:** «Activity і збереження стану» працює **лише з `cacheComponents: true`** — явно позначити залежність від теми 12/15.
5. **Тема 05:** документація каже «`default.js` обов'язковий, інакше build fail», але на 16.3.8 build проходить — `[!warning]` у темі 05.
6. **Тема 06:** явно — Proxy тільки Node.js runtime (edge не підтримується), `experimental.proxyClientMaxBodySize`, unit-тест утиліти `next/experimental/testing/server` (ідеальні для раннер-задач).
7. **§1 `routing`:** додати `next/root-params`, `instant`, `useOffline` (experimental, можна як «огляд»).
