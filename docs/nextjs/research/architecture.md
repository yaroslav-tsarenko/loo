# Research: `architecture` — Архітектура і масштаб (теми 45–49)

> Шляхи — відносно `node_modules/next/dist/docs/01-app/` (Next.js **16.3.8**). URL = `https://nextjs.org/docs/app/` +
> шлях без числових префіксів. `(не звірено з docs 16.3.8)` — не знайдено в бандлі. Для тем 46 (Turborepo), 47 (Flags
> SDK), 49 (AI SDK) Next docs майже не дають матеріалу — основні джерела зовнішні.

## 1. Карта понять за темами

### 45 — Структура великого застосунку
1. Офіційні стратегії (`01-getting-started/02-project-structure.md#organizing-your-project`): файли поза `app/` (`src/lib`, `src/components`), у top-level папках усередині `app/`, **split by feature or route** (colocation); приватні папки `_components`; route groups для організації без впливу на URL; `src/`.
2. Colocation безпечна: публічним стає лише `page`/`route`.
3. Шари: **routes** (тонкі `page`/`layout` — композиція) → **features** (компоненти, дії, хуки фічі) → **DAL/services** (`server-only`, authz, DTO) → **infra** (БД-клієнт, кеш, зовнішні API).
4. Межі модулів: публічний `index.ts` фічі, заборона глибоких імпортів (ESLint `no-restricted-imports`, `eslint-plugin-boundaries`, dependency-cruiser) `(не звірено з docs 16.3.8)`; `server-only`/`client-only` як «межі середовищ».
5. Межа `'use client'` як архітектурне рішення: острівці інтерактивності; провайдери — в окремому `providers.tsx`.
6. Server Actions: тонкі `'use server'`-файли, що делегують у DAL (`02-guides/data-security.md#using-a-data-access-layer-for-mutations`).
7. Кешування як шар: де стоять `use cache`/`cacheTag`, єдиний реєстр тегів (константи/фабрики), щоб `updateTag` не розходився з `cacheTag`.
8. Типізація маршрутів: `typedRoutes` (stable), `PageProps`/`LayoutProps`/`RouteContext` (`next typegen`).
9. `AGENTS.md` (генерується `create-next-app`/`next dev`) вказує агентам на бандл docs — частина «гігієни» великого репо в 2026.

### 46 — Монорепо і масштаб
1. **Turborepo**: workspaces (`apps/*`, `packages/*`), pipeline `turbo.json` (`dependsOn`, `outputs`, кеш), remote caching; спільні `packages/ui`, `packages/config` (ESLint/TS) `(не звірено з docs 16.3.8)`.
2. Next у монорепо: `transpilePackages` для неспребілджених внутрішніх пакетів; `turbopack.root` (абсолютний шлях кореня) і `outputFileTracingRoot` (трасування standalone за межами застосунку) — `05-config/01-next-config-js/turbopack.md`, `output.md`; `AGENTS.md` у монорепо — `next` може бути невидимий з кореня (`version-16.md`).
3. **Multi-zones** (`02-guides/multi-zones.md`): кілька Next-застосунків на одному домені, кожен обслуговує набір шляхів; зона = звичайний Next app з **`assetPrefix`** (крім дефолтної); маршрутизація — `rewrites` у головній зоні (рекомендовано) або Proxy; **переходи між зонами — hard navigation** (`<a>`, не `Link`); спільний код — пакети монорепо; **Server Actions** — `serverActions.allowedOrigins` з user-facing origin; feature flags для узгодження релізів.
4. Альтернатива для Vercel — Microfrontends (`@vercel/microfrontends`) `(не звірено з docs 16.3.8)`.
5. **Multi-tenant** (`02-guides/multi-tenant.md` містить лише посилання на Platforms Starter Kit): tenant з subdomain/custom domain → Proxy rewrite на `app/[tenant]/...`; tenant як root param (`next/root-params`) або сегмент; ізоляція даних у DAL; tenant у ключі кешу і тегах; кастомні домени й SSL — платформа.
6. Компроміси: один застосунок (просто, спільний деплой) vs монорепо з кількома apps (незалежні деплої, спільний код) vs zones (один домен, незалежні команди, hard navigation між зонами) vs окремі домени.

### 47 — Feature flags, Draft Mode, A/B
1. **Draft Mode** (`02-guides/draft-mode.md`): Route Handler з секретом → `(await draftMode()).enable()` → redirect на сторінку; cookie `__prerender_bypass`; з Cache Components усі cached-функції **виконуються щоразу й не зберігаються**; `isEnabled` можна читати в `use cache`, а `enable()/disable()` — лише в Route Handler/Server Action.
2. Feature flags: серверне обчислення прапорця (не клієнтський фліп → без flicker і без витоку недоступних фіч); прапорець як **аргумент** cached-функції → окремі записи кешу (кардинальність!).
3. **Flags SDK** (`flags` пакет, `flag()` з `decide()`, `identify`, адаптери, **precompute** — комбінації прапорців у URL через Proxy rewrite, щоб сторінки лишались статичними), Flags Explorer `(не звірено з docs 16.3.8)`.
4. A/B без втрати статики: Proxy призначає варіант (cookie) → rewrite на `/variant-b/...` (prerender кожного варіанту); vs динамічний рендер за cookie (дорожче).
5. Узгодження з prefetch: App Shell, що читає `cookies()`, кешується per-session на клієнті — прапорці з cookie роблять shell сесійним.
6. Відкат без релізу, kill switch, поступовий rollout; прибирати старі прапорці.

### 48 — Міграції
1. **Pages → App** (`02-guides/migrating/app-router-migration.md`): обидва роутери співіснують; кроки — `app/` + root layout → `next/head` → `metadata` → перенесення сторінок → хуки (`next/router` → `next/navigation`: `useRouter`, `usePathname`, `useSearchParams`) → data fetching (`getServerSideProps` → async Server Component з динамічними даними; `getStaticProps` → кешовані дані/`use cache`; `getStaticPaths` → `generateStaticParams`) → стилі.
2. **13 → 14**: Node 18.17, `next export` → `output: 'export'`, `ImageResponse` у `next/og`, `@next/font` видалено (`version-14.md`).
3. **14 → 15**: React 19 (`useFormState` → `useActionState`), async Request APIs (з тимчасовою sync-сумісністю), `fetch` і `GET` handlers не кешуються, Client Cache `staleTimes.dynamic` 0, `runtime: 'experimental-edge'` → `'edge'`, `serverExternalPackages` stable, `geo`/`ip` прибрано з `NextRequest` (`version-15.md`). Codemods: `next-async-request-api`, `next-request-geo-ip`, `app-dir-runtime-config-experimental-edge`.
4. **15 → 16** (`version-16.md`): Node ≥ 20.9; Turbopack за замовчуванням; `turbopack` top-level; FS cache; sync Request APIs видалено; async params в OG/icon/sitemap; React 19.2 (canary); React Compiler stable; `revalidateTag(tag, profile)`; `updateTag`, `refresh`; `cacheLife`/`cacheTag` без `unstable_`; PPR → `cacheComponents`; `middleware` → `proxy`; `next/image` breaking defaults; `default.js` обов'язковий; ESLint flat config; scroll-behavior; без `size/First Load JS`; Build Adapters; видалено AMP, `next lint`, runtime config, `devIndicators` опції, `experimental.dynamicIO/useCache`, `unstable_rootParams`.
5. Codemods 16: `upgrade latest`, `remove-experimental-ppr`, `remove-unstable-prefix`, `middleware-to-proxy`, `next-lint-to-eslint-cli`; **16.3**: `cache-components-instant-false`, `remove-partial-prefetch`.
6. Міграція на **Cache Components** (`02-guides/migrating-to-cache-components.md`) — мапа: `force-dynamic` → прибрати; `force-static`/`revalidate`/`fetchCache` → `use cache` + `cacheLife`; `fetch` options → `use cache`; `unstable_cache` → `use cache`; `unstable_noStore` → прибрати / `connection()`; `dynamicParams` → видалити, `notFound()`; `cookies/headers/searchParams` → Suspense; `runtime='edge'` → видалити; `experimental_ppr` → видалити; урахувати Activity.
7. Стратегія: поступова (маршрут за маршрутом), `instant = false` як тимчасовий opt-out, адопшн-skills (`next-cache-components-adoption`, `next-partial-prefetching-adoption`), `next upgrade` (16.1).

### 49 — AI у застосунку
1. Next docs **не мають гайду з AI SDK**; є лише приклад стрімінгу LLM у Route Handler (`03-file-conventions/route.md#streaming`), що використовує застарілий `StreamingTextResponse` з пакета `ai` — **не копіювати** (у AI SDK 5+ — `streamText(...).toUIMessageStreamResponse()` / `toTextStreamResponse()`) `(актуальні назви — не звірено з docs 16.3.8, звірити з ai-sdk.dev)`.
2. AI SDK (Vercel): `ai` core (`generateText`, `streamText`, `generateObject`/structured output, tools з Zod-схемами, multi-step `stopWhen`), `@ai-sdk/react` `useChat`, провайдери (`@ai-sdk/openai`, …), AI Gateway `(не звірено з docs 16.3.8)`.
3. Архітектура: Route Handler для стрімінгу (довгі відповіді, `maxDuration`), Server Action для коротких викликів; ключі провайдерів — тільки сервер.
4. Захист від зловживань: authn, rate limit (за користувачем/IP), бюджети токенів, `maxOutputTokens`, BotID/WAF, кешування детермінованих відповідей (`use cache`), модерація; prompt injection у tool calling — валідувати аргументи інструментів, мінімальні привілеї.
5. Вартість і latency: вибір моделі, стрімінг для TTFB, `after()` для логування використання, фонова обробка — черги/Workflow.
6. **Окремо від AI-фіч — AI для розробки на Next 16:** `AGENTS.md` з посиланням на `node_modules/next/dist/docs/`, `next-devtools-mcp` (`.mcp.json`), skills `next-dev-loop`, `next-cache-components-adoption`, `next-cache-components-optimizer`, `next-partial-prefetching-adoption`; `npx @next/codemod@canary agents-md` (`02-guides/ai-agents.md`, `02-guides/mcp.md`).

## 2. Поточні API-факти (16.3.8)

| Факт | Доказ |
|---|---|
| Стратегії організації проєкту, приватні папки, route groups, `src` | `01-getting-started/02-project-structure.md` |
| `typedRoutes` stable; `PageProps`/`LayoutProps`/`RouteContext` через `next typegen` (15.5) | `05-config/01-next-config-js/typedRoutes.md`, `version-16.md` |
| Multi-zones: `assetPrefix`, rewrites/Proxy, hard navigation між зонами, `allowedOrigins` для дій | `02-guides/multi-zones.md` |
| Multi-tenant guide — лише посилання на Platforms Starter Kit | `02-guides/multi-tenant.md` |
| Draft Mode + Cache Components (bypass, `isEnabled` у `use cache`, toggle лише в RH/SA) | `02-guides/draft-mode.md`, `01-directives/use-cache.md#draft-mode` |
| Pages → App кроки, співіснування | `02-guides/migrating/app-router-migration.md` |
| Зміни 14/15/16 | `02-guides/upgrading/version-14.md`, `version-15.md`, `version-16.md` |
| Codemods 16.0 і 16.3 | `02-guides/upgrading/codemods.md` |
| Мапа міграції на Cache Components | `02-guides/migrating-to-cache-components.md` |
| `next upgrade` (16.1) | `03-api-reference/06-cli/next.md` |
| AGENTS.md, skills, MCP | `02-guides/ai-agents.md`, `02-guides/mcp.md` |
| LLM-стрімінг приклад з `StreamingTextResponse` (застарілий API AI SDK) | `03-file-conventions/route.md#streaming` |
| `transpilePackages`, `serverExternalPackages` | `05-config/01-next-config-js/transpilePackages.md`, `serverExternalPackages.md` |

## 3. Було → стало
Головне «було → стало» курсу (тема 48), стисло:
| Область | 13/14 | 15 | 16 |
|---|---|---|---|
| Request APIs | sync | async + sync-compat | async only |
| Кеш `fetch` | за замовчуванням | ні | `use cache` (CC) |
| PPR | — | `experimental.ppr` (canary) | `cacheComponents` |
| Middleware | Edge | Node (15.5 stable) | `proxy.ts`, Node only |
| Бандлер | Webpack | Turbopack dev (опція) | Turbopack dev+build за замовчуванням |
| React | 18 | 19 | 19.2 canary (Activity, ViewTransition) |
| Ревалідація | `revalidateTag(tag)` | те саме | `revalidateTag(tag, profile)` + `updateTag` + `refresh` |
| Lint | `next lint` | `next lint` | ESLint CLI / Biome |
| Root params | — | `unstable_rootParams` | `next/root-params` (16.3) |
| Адаптери | приватні | RFC | `adapterPath` (stable 16.2) |

## 4. Пастки і продакшн-проблеми
- **«Shared» папка, яку імпортує все** — циклічні залежності, клієнтський бандл тягне серверний код.
- **Барел-файли фіч** з mixed server/client експортами — `'use client'` модуль тягне server-only або навпаки (помилка `server-only`).
- **Розсинхрон тегів** `cacheTag('post:'+id)` vs `updateTag('posts-'+id)` — тихо не інвалідується. Реєстр тегів.
- **Multi-zones з `<Link>` між зонами** — 404/дивна soft-навігація; дії без `allowedOrigins` падають CSRF-перевіркою.
- **Multi-tenant кеш без tenant у ключі** — дані одного клієнта в іншого (найгірший інцидент).
- **Feature flag на клієнті** — flicker і витік прихованих фіч у бандлі.
- **Прапорець як аргумент cached-функції з високою кардинальністю** (userId-based rollout) — вибух записів.
- **Draft Mode секрет у URL логах/реферері**; без перевірки секрету — превʼю для всіх.
- **Міграція «великим вибухом»** на Cache Components — сотні build errors; правильно — `instant = false` + маршрут за маршрутом.
- **Пропущений async Request API codemod** — `upgrade` codemod не запускає `next-async-request-api`.
- **Плагіни з webpack-конфігом** після 16.
- **AI-endpoint без rate limit і бюджету** — рахунок за ніч; prompt injection через tools; ключ провайдера в `NEXT_PUBLIC_`.
- **Копіювання застарілого AI-прикладу з docs** (`StreamingTextResponse`).

## 5. Interview angles
1. **Як структурувати Next-застосунок на 50 розробників?** Feature folders, шари, DAL, межі модулів, власники (CODEOWNERS), реєстр тегів кешу, lint-правила меж.
2. **Монорепо vs multi-zones vs окремі apps.** Компроміси деплою, навігації, спільного коду.
3. **Multi-tenant: як ізолювати дані й кеш?** Proxy rewrite, tenant у DAL і ключах, custom domains.
4. **Feature flags без шкоди для статики.** Серверна оцінка, precompute, кардинальність ключів, prefetch per-session.
5. **Draft Mode під Cache Components.** Bypass, `isEnabled`, toggle-обмеження.
6. **План міграції 14 → 16.** Codemods (включно з окремим async API codemod), Turbopack, `middleware` → `proxy`, ревалідація, images defaults, поступове CC.
7. **Pages → App: що найскладніше?** Data fetching модель, `next/router` → `next/navigation`, `_app/_document` → layout, співіснування і hard navigation між роутерами.
8. **AI-чат у Next: архітектура.** Route Handler зі стрімінгом, `useChat`, auth, rate limit, бюджет, логування в `after()`, tool security.
9. **Як ти використовуєш AI-агентів з Next 16?** AGENTS.md → bundled docs, MCP, skills; чому «This is NOT the Next.js you know».
10. **Які компроміси Cache Components для великої команди?** Явність кешу vs когнітивне навантаження; build-time валідація як захист.

## 6. Що може перевірити раннер
1. **Перевірка меж модулів**: за графом імпортів (обʼєкт `{ file: imports[] }`) і правилами шарів (`routes → features → dal → infra`) знайти порушення.
2. **Детектор циклів** у графі імпортів.
3. **Реєстр тегів**: `tags.post(id)`, `tags.posts()` — фабрика, тести на узгодженість між `cacheTag` і `updateTag` місцями (передаються як масиви викликів).
4. **Tenant-резолвер**: `resolveTenant(host, { rootDomain, customDomains })` → `tenant | null` + rewrite-шлях; тести для `acme.app.com`, `acme.com`, `www`, localhost.
5. **Feature flag evaluator**: детермінований rollout за хешем `userId` (відсоток), таргетинг за атрибутами; тест стабільності.
6. **A/B через rewrite**: `assignVariant(cookies, rng)` → `{ variant, setCookie, rewriteTo }`.
7. **Codemod-міні**: трансформація рядка коду `revalidateTag('x')` → `revalidateTag('x', 'max')`; `export function middleware` → `export function proxy` (regex/токенізація).
8. **Мапа міграції CC**: за набором route segment config (`dynamic`, `revalidate`, `fetchCache`) повернути список дій міграції.
9. **Rate limit + бюджет токенів** для AI-endpoint (fake timers): відхилити після N запитів або M токенів за вікно.
10. **Парсер SSE/стріму**: зібрати текст із чанків `data: ...` (модель клієнта для стрімінгу LLM).
11. **Zone router**: за шляхом і конфігом зон визначити, яка зона обслуговує і чи навігація hard/soft.

## 7. Джерела
- https://nextjs.org/docs/app/getting-started/project-structure
- https://nextjs.org/docs/app/guides/multi-zones · …/multi-tenant · …/draft-mode · …/migrating/app-router-migration · …/migrating-to-cache-components · …/upgrading/version-14 · …/version-15 · …/version-16 · …/upgrading/codemods · …/ai-agents · …/mcp · …/data-security
- https://nextjs.org/docs/app/api-reference/config/next-config-js/typedRoutes · …/transpilePackages · …/assetPrefix · https://nextjs.org/docs/app/api-reference/functions/draft-mode
- https://vercel.com/templates/next.js/platforms-starter-kit
- https://turborepo.com/docs · https://flags-sdk.dev · https://vercel.com/docs/microfrontends `(не звірено з docs 16.3.8)`
- https://ai-sdk.dev/docs · https://ai-sdk.dev/docs/ai-sdk-ui/chatbot `(не звірено з docs 16.3.8)`
- https://github.com/vercel/next-devtools-mcp · https://github.com/vercel/next.js/tree/canary/skills
- https://owasp.org/www-project-top-10-for-large-language-model-applications/ (prompt injection)
- https://nextjs.org/blog (релізи 15, 16, 16.1–16.3) `(мотивація змін)`

## 8. Виправлення до SYLLABUS
1. **Тема 48:** у дужках «`unstable_cache` лише як було → стало» — уточнити: docs 16.3.8 досі **рекомендують** `unstable_cache`/`fetch`-кеш для кешу між деплоями; тож це не повністю «було».
2. **Тема 48:** додати обов'язково: `upgrade` codemod **не** запускає `next-async-request-api` (окремий крок); codemods 16.3 (`cache-components-instant-false`, `remove-partial-prefetch`); міграція на Cache Components — окремий великий підрозділ з мапою конфігів.
3. **Тема 46:** multi-zones — додати `assetPrefix`, hard navigation, `allowedOrigins` для дій; multi-tenant guide в docs — лише посилання, матеріал з Platforms Starter Kit.
4. **Тема 47:** Flags SDK і precompute — не в Next docs (зовнішнє джерело); Draft Mode під Cache Components — є в docs, додати.
5. **Тема 49:** приклад AI у Next docs застарілий (`StreamingTextResponse`); джерело — ai-sdk.dev. Додати підтему «AI-агенти для розробки на Next 16» (AGENTS.md, MCP, skills) — це офіційний розділ docs 16, якого SYLLABUS не має.
6. **§1 `architecture`:** додати Cache Components як архітектурне рішення (реєстр тегів, межі кешу) і `typedRoutes`/typegen.
