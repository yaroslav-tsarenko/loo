# Research: `deploy-ops` — Деплой і експлуатація (теми 42–44)

> Шляхи — відносно `node_modules/next/dist/docs/01-app/` (Next.js **16.3.8**). URL = `https://nextjs.org/docs/app/` +
> шлях без числових префіксів. **Увага:** майже весь матеріал теми 42 (Vercel: Fluid Compute, Rolling Releases, Firewall,
> BotID, cron, ліміти) **відсутній у бандлі Next docs** — джерело vercel.com/docs; такі факти позначено
> `(не звірено з docs 16.3.8)`, перед публікацією звіряти з vercel.com/docs.

## 1. Карта понять за темами

### 42 — Vercel
1. Модель деплою: Git push → build → **immutable deployment** з унікальним URL; preview для кожної гілки/PR, production — промоут; instant rollback `(не звірено з docs 16.3.8)`.
2. Vercel — **verified adapter** на Adapter API (`01-getting-started/17-deploying.md#verified-adapters`).
3. Що стає чим: static assets і prerender → CDN; Server Components/Route Handlers/Server Actions → Vercel Functions; Proxy → Routing Middleware `(відповідність — не звірено з docs 16.3.8)`.
4. **Fluid Compute**: кілька паралельних запитів на один інстанс, оплата за активний CPU, менше cold starts; актуальний дефолт для нових проєктів `(не звірено з docs 16.3.8)`.
5. Env: Development/Preview/Production, `vercel env pull`; `NEXT_PUBLIC_*` інлайниться на build (зміна вимагає rebuild); OIDC-токени `(не звірено з docs 16.3.8)`.
6. `maxDuration` (segment config) — ліміт тривалості функції, також для `after()`; `preferredRegion` (segment config, `string[]` позначено deprecated у таблиці) — `03-file-conventions/02-route-segment-config/index.md`.
7. Cron Jobs (`vercel.json` `crons` → GET на Route Handler, захист `CRON_SECRET`) `(не звірено з docs 16.3.8)`.
8. Rolling Releases (поступовий відсоток трафіку на новий деплой), Skew Protection (`deploymentId` + маршрутизація старих клієнтів на старий деплой) `(не звірено з docs 16.3.8)`.
9. Безпека платформи: Firewall/WAF (правила, rate limiting, Attack Mode), BotID (детекція ботів для критичних дій), Deployment Protection для preview `(не звірено з docs 16.3.8)`.
10. Кеш: CDN cache (`Cache-Control`, `s-maxage`, `stale-while-revalidate`), ISR/Data Cache, Runtime Cache (KV для `use cache: remote`) `(не звірено з docs 16.3.8)`.
11. «Що за що платиш»: виклики й CPU функцій, трафік, оптимізація зображень, ISR writes/reads — привʼязати до рішень курсу (prefetch per-link = функція на посилання; `use cache: remote` = мережа і сховище).

### 43 — Self-hosting
1. Чотири шляхи (`01-getting-started/17-deploying.md`): **Node.js server** (`next start`), **Docker**, **static export** (`output: 'export'`), **adapters**.
2. `output: 'standalone'` → `.next/standalone` з мінімальним `server.js` і трасованими `node_modules`; `public/` і `.next/static` **не копіюються** (`cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/`) або віддавати з CDN.
3. Reverse proxy перед Next (nginx): буферизація ламає стрімінг → `X-Accel-Buffering: no`; таймаути; компресія.
4. Image Optimization: `sharp`; на glibc — алокатор пам'яті; або зовнішній loader.
5. **Кеш і ISR між інстансами**: за замовчуванням — локальний (FS + пам'ять); `cacheHandler` (однина — ISR, route handlers, images; `cacheMaxMemorySize: 0` щоб вимкнути пам'ять) і `cacheHandlers` (множина — `use cache`); `revalidateTag` на одному інстансі не бачать інші без `updateTags/refreshTags` у спільному сховищі.
6. **Multi-server**: однаковий `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`; `deploymentId` (або `NEXT_DEPLOYMENT_ID`) — skew protection і cache busting; з `deploymentId` build ID константний і `generateBuildId` не діє; без нього — консистентний `generateBuildId` між контейнерами.
7. Version skew: старі клієнти після деплою → відсутні ассети, «Failed to find Server Action»; з 16.2 Pages Router визначає skew з заголовка відповіді.
8. `supportsImmutableAssets` (16.3) — для авторів адаптерів (deployment-specific query на ассетах).
9. **Adapters** (стабільний `adapterPath` з 16.2; alpha у 16.0 як `experimental.adapterPath`; env `NEXT_ADAPTER_PATH`): інтерфейс `NextAdapter { name, modifyConfig?, onBuildComplete? }` з `outputs` (`pages`, `appPages`, `appRoutes`, `pagesApi`, `prerenders`, `staticFiles`, `middleware`) і `routing`; verified: Vercel, Bun; Cloudflare і Netlify працюють над verified адаптерами (поки власні інтеграції).
10. PPR для платформ (`02-guides/ppr-platform-guide.md`): зберігання shell + resume protocol; CDN shell + origin compute.
11. Static export: не підтримує cookies, rewrites/redirects/headers, Proxy, ISR, Server Actions, Draft Mode, intercepting routes, default image loader, Route Handlers з Request, dynamic routes без `generateStaticParams`.
12. Graceful shutdown: `SIGINT`/`SIGTERM` — сервер завершує in-flight запити й `after()`; `NEXT_MANUAL_SIG_HANDLE=true` для власних обробників.
13. Custom server (`02-guides/custom-server.md`) — втрачає частину оптимізацій; `output: 'standalone'` не трасує файли custom server і має власний `server.js` — разом не використовуються.
14. Edge runtime **deprecated**; Proxy — тільки Node.

### 44 — Observability
1. `instrumentation.ts` (корінь або `src/`): `register()` — один раз при старті сервера; `onRequestError(error, request, context)` — серверні помилки з `context: { routerKind, routePath, routeType: 'render'|'route'|'action'|'proxy', renderSource, revalidateReason }`; async-задачі в ньому треба `await`.
2. Розгалуження за `process.env.NEXT_RUNTIME` (`'nodejs'`/`'edge'`) для імпорту Node-only SDK.
3. `instrumentation-client.ts`: виконується до гідратації (polyfills, error tracking, аналітика); `onRouterTransitionStart(url, navigationType)` — відстеження навігацій; 16.3: experimental третій аргумент `event` (router transition start event).
4. `instrumentationClientInject` (16.3) — модулі для плагінів (`withSentry`), що інжектуються перед `instrumentation-client`.
5. OpenTelemetry: `@vercel/otel` → `registerOTel({ serviceName })` у `register()`; або ручний NodeSDK; дефолтні спани (`[http.method] [next.route]`, `render route (app)`, `fetch`, `executing api route (app)`, `generateMetadata`, `resolve page components`, `start response`); `NEXT_OTEL_VERBOSE=1` для більшого; custom spans через `@opentelemetry/api`.
6. `logging` config: `fetches` (`fullUrl`, `hmrRefreshes`), Server Functions, `incomingRequests`, **`browserToTerminal`** (16.2; логи браузера в термінал), `logging: false`.
7. Sentry (`@sentry/nextjs`): `withSentryConfig`, `onRequestError` → `captureRequestError`, source maps, tunnel `(не звірено з docs 16.3.8)`.
8. Web analytics: `useReportWebVitals`, Vercel Speed Insights / Web Analytics `(не звірено з docs 16.3.8)`.
9. `error.digest` — зв'язок UI-помилки з серверним логом.
10. Логи структуровані (JSON), кореляція trace-id; не логувати PII/секрети.

## 2. Поточні API-факти (16.3.8)

| Факт | Доказ |
|---|---|
| 4 способи деплою; verified adapters: Vercel, Bun; список «Other Platforms» | `01-getting-started/17-deploying.md` |
| `adapterPath` (stable з 16.2), `NEXT_ADAPTER_PATH`; `NextAdapter` інтерфейс | `03-api-reference/07-adapters/01-configuration.md`, `02-creating-an-adapter.md`, `version-16.md#build-adapters-api-alpha` |
| Feature support matrix (Streaming/Shared Cache/Edge Stitching для SC, ISR, PPR, CC, Proxy, Server Actions, `after`) | `02-guides/deploying-to-platforms.md` |
| `output: 'standalone'`, копіювання `public`/`.next/static` | `05-config/01-next-config-js/output.md` |
| Self-hosting: nginx `X-Accel-Buffering`, `cacheHandler`, `cacheMaxMemorySize: 0`, `generateBuildId`, `deploymentId`, локальний `revalidateTag`, graceful shutdown, `NEXT_MANUAL_SIG_HANDLE` | `02-guides/self-hosting.md` |
| `deploymentId` / `NEXT_DEPLOYMENT_ID`; з 16.2 build ID константний при `deploymentId` | `05-config/01-next-config-js/deploymentId.md` |
| `supportsImmutableAssets` (16.3) | `05-config/01-next-config-js/supportsImmutableAssets.md` |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | `02-guides/data-security.md`, `self-hosting.md#server-functions-encryption-key` |
| Static export — список непідтримуваного | `02-guides/static-exports.md` |
| `instrumentation.ts`: `register`, `onRequestError` (15.0 stable), context-поля | `03-file-conventions/instrumentation.md` |
| `instrumentation-client.ts`: `onRouterTransitionStart`; 16.3 experimental event | `03-file-conventions/instrumentation-client.md` |
| `instrumentationClientInject` (16.3) | `05-config/01-next-config-js/instrumentationClientInject.md` |
| `@vercel/otel` `registerOTel`, `NEXT_OTEL_VERBOSE=1`, дефолтні спани | `02-guides/open-telemetry.md` |
| `logging.browserToTerminal` (16.2) | `05-config/01-next-config-js/logging.md` |
| `runtime = 'edge'` deprecated; Proxy лише Node | `02-route-segment-config/runtime.md`, `03-file-conventions/proxy.md` |
| Node.js ≥ 20.9, TS ≥ 5.1, браузери Chrome/Edge/Firefox 111+, Safari 16.4+ | `02-guides/upgrading/version-16.md` |
| `next dev` → `.next/dev`; `next upgrade` (16.1) | `version-16.md`, `06-cli/next.md` |
| Production checklist | `02-guides/production-checklist.md` |

## 3. Було → стало
| До | Зараз |
|---|---|
| `next export` | `output: 'export'` (14) |
| `serverRuntimeConfig`/`publicRuntimeConfig` | видалено (16) → env + `connection()` |
| Edge runtime як опція для SSR | deprecated; Node скрізь |
| `middleware` на Edge | `proxy` на Node (16) |
| Платформи — приватні інтеграції (OpenNext тощо) | Adapter API (alpha 16.0 → stable `adapterPath` 16.2), verified adapters |
| `experimental.instrumentationHook` | `instrumentation.ts` стабільний (15.0) |
| `experimental.browserDebugInfoInTerminal` | `logging.browserToTerminal` (16.2) |
| Node 18 | Node ≥ 20.9 (16) |
| `generateBuildId` для консистентності | `deploymentId` (перекриває build ID) |

## 4. Пастки і продакшн-проблеми
- **Standalone без `public`/`static`** — 404 на ассети.
- **Кілька контейнерів без спільного кешу** — різний контент на різних інстансах; `revalidateTag` діє лише локально.
- **Різні ключі шифрування дій** на інстансах; **різні build ID** — skew.
- **nginx буферизує** — стрімінг/Suspense «не працює».
- **`NEXT_PUBLIC_*` у Docker-образі** — запікається на build; один образ для staging/prod не працює без runtime-підходу.
- **Image optimization на self-host** — CPU/пам'ять (`sharp`, glibc), кеш на диску, `maximumDiskCacheSize`.
- **Kubernetes без graceful shutdown** — обірвані запити й втрачені `after()`.
- **Serverless + in-memory `use cache`** — низький hit-rate; потрібен remote handler.
- **Довгі задачі у функції** — таймаути (`maxDuration`); черги замість.
- **Prefetch-шторм** на dynamic routes з `prefetch={true}` — рахунок за функції.
- **`onRequestError` без `await`** — помилка не доходить до провайдера.
- **Логування PII/токенів** у spans і логах.
- **Preview-деплої з production-секретами/БД**.
- **Custom webpack-конфіг Sentry-плагіна** після 16 (Turbopack за замовчуванням) — build fails, оновити плагін.
- **Edge-специфічний код** (`runtime='edge'`) після міграції на Cache Components.

## 5. Interview angles
1. **Що відбувається з Next-застосунком при деплої на Vercel і чим це відрізняється від `next start`?** CDN/функції/middleware vs один Node-процес; що треба відтворити самому.
2. **Як запустити Next на 5 інстансах за load balancer і не зламати кеш?** `cacheHandler(s)`, спільний tag-стор, `deploymentId`, encryption key, sticky — не потрібні.
3. **Version skew — що це і як захиститися?**
4. **`output: 'standalone'` vs static export vs adapter.**
5. **Як працюють adapters у 16?** `adapterPath`, `modifyConfig`, `onBuildComplete`, outputs/routing, verified.
6. **Чому стрімінг не працює за nginx?** Буферизація, `X-Accel-Buffering`, компресія.
7. **Observability-стек для Next.** `instrumentation.ts`, OTel, `onRequestError`, `instrumentation-client`, `digest`.
8. **Як побачити повільний запит у проді?** Spans (`render route`, `fetch`), `NEXT_OTEL_VERBOSE`, fetch logging.
9. **Fluid Compute vs класичний serverless** `(Vercel-специфіка — звірити)`.
10. **Graceful shutdown і `after()`.**

## 6. Що може перевірити раннер
1. **Генератор `Cache-Control`**: з `{ revalidate, expire }` → `s-maxage=…, stale-while-revalidate=…`; тести для ISR/static/dynamic.
2. **Version skew детектор**: клієнт з `deploymentId` A, відповідь з B → hard navigation; модель як функція.
3. **Мульти-інстанс тег-стор**: модель `updateTags`/`refreshTags` у спільному сховищі; тест — інвалідація з інстансу A видна в B після `refreshTags`.
4. **`onRequestError`-фільтр**: функція, що з `context` будує подію для логера, маскує PII (email, токени) і групує за `routeType`.
5. **Парсер env**: `.env`-рядки → об'єкт з порядком пріоритетів (`process.env` > `.env.$(NODE_ENV).local` > `.env.local` (не в test) > `.env.$(NODE_ENV)` > `.env`).
6. **Перевірка готовності static export**: за маніфестом фіч застосунку (cookies, rewrites, server actions…) повернути список блокерів.
7. **Graceful shutdown модель**: черга in-flight запитів і `after`-колбеків; після SIGTERM нові відхиляються, старі дочікуються (fake timers).
8. **Cron-авторизація**: Route Handler перевіряє `Authorization: Bearer ${CRON_SECRET}` — чиста функція.
9. **Структурований логер** з кореляцією `traceId` і рівнями.
10. **Health/readiness** endpoint-логіка (стан БД, кешу) як чиста функція.

## 7. Джерела
- https://nextjs.org/docs/app/getting-started/deploying
- https://nextjs.org/docs/app/guides/self-hosting · …/deploying-to-platforms · …/ppr-platform-guide · …/cdn-caching · …/static-exports · …/custom-server · …/production-checklist · …/open-telemetry · …/instrumentation · …/environment-variables
- https://nextjs.org/docs/app/api-reference/adapters (configuration, creating-an-adapter, api-reference, testing-adapters, output-types, routing-information, use-cases)
- https://nextjs.org/docs/app/api-reference/config/next-config-js/output · …/deploymentId · …/adapterPath · …/supportsImmutableAssets · …/logging · …/instrumentationClientInject · …/generateBuildId
- https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation · …/instrumentation-client · …/route-segment-config/maxDuration
- https://vercel.com/docs/functions · https://vercel.com/docs/fluid-compute · https://vercel.com/docs/rolling-releases · https://vercel.com/docs/skew-protection · https://vercel.com/docs/cron-jobs · https://vercel.com/docs/vercel-firewall · https://vercel.com/docs/botid · https://vercel.com/docs/environment-variables · https://vercel.com/docs/deployments/preview-deployments `(не звірено з docs 16.3.8)`
- https://opentelemetry.io/docs/languages/js/ · https://docs.sentry.io/platforms/javascript/guides/nextjs/
- https://docs.docker.com/build/building/multi-stage/ · https://github.com/vercel/next.js/tree/canary/examples/with-docker
- https://nodejs.org/api/process.html#signal-events

## 8. Виправлення до SYLLABUS
1. **Тема 42:** практично весь вміст — Vercel-специфіка, якої немає в Next docs; позначити як «платформна тема» з окремим джерелом (vercel.com/docs) і регулярною перевіркою (продукти змінюються швидко).
2. **Тема 43:** adapters: `adapterPath` **стабільний з 16.2** (у 16.0 — `experimental.adapterPath` alpha); verified — Vercel і Bun; додати `deploymentId` (16.2-зміна з build ID), `supportsImmutableAssets` (16.3), PPR platform guide, feature support matrix.
3. **Тема 43:** додати edge runtime deprecated і Node ≥ 20.9.
4. **Тема 44:** додати `instrumentationClientInject` (16.3), experimental router transition event (16.3), `logging.browserToTerminal` (16.2), `NEXT_OTEL_VERBOSE`.
5. **§1 `deploy-ops`:** «Rolling Releases», «Firewall і BotID» — Vercel-продукти, `(не звірено з docs 16.3.8)`; замінити/доповнити платформо-нейтральними поняттями (canary deploy, WAF, bot protection), щоб курс не застарів.
