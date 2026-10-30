# Research: `testing` — Тестування (теми 40–41)

> Шляхи — відносно `node_modules/next/dist/docs/01-app/` (Next.js **16.3.8**). URL = `https://nextjs.org/docs/app/` +
> шлях без числових префіксів. `(не звірено з docs 16.3.8)` — не знайдено в бандлі (деталі Vitest/MSW/Playwright API —
> з офіційних сайтів цих інструментів).

**Методична примітка:** ця навичка найкраще лягає на раннер (у ньому вже є `test/describe/expect/vi`, фейкові таймери,
моки). Тема 40 може бути майже повністю «практичною»: учень пише тести, а не лише код.

## 1. Карта понять за темами

### 40 — Unit і компонентні тести
1. Типи тестів (`02-guides/testing/index.md`): unit, component, integration, end-to-end, snapshot.
2. **Офіційне обмеження:** `async` Server Components **не підтримуються** Vitest і Jest — docs рекомендують E2E для async-компонентів; синхронні Server і Client Components можна юніт-тестувати (`testing/vitest.md`, `testing/jest.md`).
3. Звідси архітектурний висновок: виносити логіку з компонентів у чисті функції/DAL (тестуються unit-тестами), компоненти робити тонкими.
4. **Vitest-сетап з docs:** `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths`; `vitest.config.mts` з `environment: 'jsdom'`; тести в `__tests__` або поруч у `app/` (colocation безпечна — файл не стає маршрутом).
5. **Jest-сетап:** `next/jest` (`createJestConfig` завантажує `next.config` і `.env`), `jest-environment-jsdom`, `@testing-library/jest-dom`; у Pages Router тести не класти в `pages/`.
6. Testing Library: запити за роллю (`getByRole`), `user-event`, «тестувати поведінку, не реалізацію» `(не звірено з docs 16.3.8)`.
7. Тестування Server Actions: це async-функції — викликати напряму з `FormData`, мокати `next/headers` (`cookies`), `next/cache` (`updateTag`, `revalidatePath`), `next/navigation` (`redirect` кидає) і DAL; перевіряти authz/валідацію/повернення DTO `(патерн — не з docs 16.3.8)`.
8. Тестування Route Handlers: експортовані `GET/POST(request: Request)` — створювати `new Request(...)` / `NextRequest`, перевіряти `Response` (статус, заголовки, JSON).
9. **Офіційні утиліти** `next/experimental/testing/server` (15.1+): `unstable_doesProxyMatch({ config, nextConfig, url })`, `isRewrite`, `getRewrittenUrl`, `getRedirectUrl`, `unstable_getResponseFromNextConfig({ url, nextConfig })` (лише `headers/redirects/rewrites`, без proxy і файлових маршрутів) — `03-file-conventions/proxy.md#unit-testing-experimental`, `05-config/01-next-config-js/index.md#unit-testing-experimental`.
10. MSW: перехоплення мережі в Node (`setupServer`) і браузері; handlers для REST/GraphQL; корисно для тестів DAL/fetch-обгорток і e2e-стабільності `(не звірено з docs 16.3.8)`.
11. Env у тестах: `.env.test` — `.env.local` **не** завантажується в `test` (`02-guides/environment-variables.md#test-environment-variables`); `@next/env` `loadEnvConfig` для ручного завантаження.

### 41 — E2E з Playwright і CI
1. Піраміда/трофей: багато unit на чисту логіку, менше компонентних, кілька e2e на критичні шляхи (логін, оплата, створення сутності).
2. Playwright з docs: `npm init playwright`, тести проти **production-збірки** (`next build && next start`) — ближче до реальної поведінки (prefetch, кеш); `webServer` у `playwright.config.ts`, `baseURL`.
3. Prefetch не працює в dev → e2e на навігацію/миттєвість лише проти `next start`.
4. **`@next/playwright` → `instant(page, fn, { baseURL? })`** (16.x): тримає динамічний вміст, поки виконується колбек — перевірка, що static/prefetched UI (shell) коректний; два сценарії: initial load (`page.goto`) і client navigation (клік по `Link`) — `02-guides/instant-navigation.md#prevent-regressions-with-e2e-tests`.
5. Відома проблема: cookie `next-instant-navigation-testing` спільна для проєктів на `localhost` (різні порти) — `03-file-conventions/02-route-segment-config/instant.md`.
6. Стабільність: web-first assertions (`toBeVisible`, авто-очікування), не `waitForTimeout`; ізоляція даних (seed/фікстури, окремий користувач на тест); `storageState` для логіну; ретраї й trace на CI `(не звірено з docs 16.3.8)`.
7. Cypress — альтернатива (`testing/cypress.md`): e2e і component testing; component testing не підтримує async Server Components.
8. CI: кеш `.next/cache` (`02-guides/ci-build-caching.md`), паралельні шарди, артефакти trace/відео; e2e проти **Vercel preview** URL (deployment protection — bypass токен) `(не звірено з docs 16.3.8)`.
9. Перевірка build-помилок Cache Components як «тест»: `next build` падає на незакешованих даних поза Suspense — CI ловить регресії shell.
10. AI-агенти: `next-dev-loop` skill і `next-devtools-mcp` для runtime-верифікації (`02-guides/ai-agents.md`, `02-guides/mcp.md`) — огляд.

### Що тестувати на якому рівні (рекомендована матриця для курсу)
| Що | Рівень | Інструмент | Чому |
|---|---|---|---|
| Валідація, DTO, authz-матриця, утиліти кешу/тегів, парсинг `searchParams` | unit | Vitest | чиста логіка, швидко, без Next |
| Server Actions і DAL | unit/integration з моками `next/headers`, `next/cache`, БД (або test-БД) | Vitest + `vi.mock` | перевірити authz/валідацію/виклик `updateTag` |
| Route Handlers | unit (виклик `GET(new Request(...))`) | Vitest | контракт HTTP: статус, заголовки, тіло |
| `proxy.ts`, `next.config` маршрутизація | unit | `next/experimental/testing/server` | офіційні утиліти, без запуску сервера |
| Синхронні Server/Client Components | component | Testing Library + jsdom | поведінка UI |
| Async Server Components, стрімінг, кеш, навігація, prefetch | e2e | Playwright проти `next start` | офіційна рекомендація docs |
| Static shell / instant UI | e2e + build | `@next/playwright instant()`, `next build` | регресії Cache Components |

Додаткові практики, які варто дати в темі 41: тегування тестів (`@smoke` на preview, повний набір — nightly), мережеві
моки в e2e через `page.route` для нестабільних сторонніх API, окрема тест-БД з міграціями на старті CI-джоба,
`trace: 'on-first-retry'` для розбору падінь `(Playwright-деталі — не звірено з docs 16.3.8)`. Для Server Actions у
e2e — перевіряти і UI-результат, і стан сервера (наступне завантаження сторінки показує зміну — це й є перевірка
`updateTag`/`revalidatePath`).

## 2. Поточні API-факти (16.3.8)

| Факт | Доказ |
|---|---|
| Async Server Components не підтримуються Vitest/Jest → E2E | `02-guides/testing/index.md#async-server-components`, `testing/vitest.md`, `testing/jest.md` |
| Пакети Vitest-сетапу | `testing/vitest.md` |
| `next/jest` + пакети Jest | `testing/jest.md` |
| Playwright: 3 браузери, сервер має бути запущений, рекомендовано проти production build, `webServer`, `baseURL` | `testing/playwright.md` |
| `@next/playwright` `instant()` | `02-guides/instant-navigation.md`, `02-route-segment-config/instant.md` |
| `next/experimental/testing/server`: `unstable_doesProxyMatch`, `isRewrite`, `getRewrittenUrl`, `getRedirectUrl` | `03-file-conventions/proxy.md` |
| `unstable_getResponseFromNextConfig` (лише config-маршрутизація) | `05-config/01-next-config-js/index.md` |
| Тестові env: `.env.test`, `.env.local` ігнорується | `02-guides/environment-variables.md#test-environment-variables` |
| Navigation Inspector (DevTools, Pause on navigations) | `02-route-segment-config/instant.md#inspecting-loading-states` |
| `next build --debug-prerender`, `--debug-build-paths` | `03-api-reference/06-cli/next.md` |
| `next-devtools-mcp` (`.mcp.json`) | `02-guides/mcp.md` |

## 3. Було → стало
| До | Зараз |
|---|---|
| Jest + `next/jest` як основний | Vitest — перший у списку гайдів, Jest лишається |
| Тест `middleware` вручну | `next/experimental/testing/server` (15.1+), функції перейменовані під `proxy` (`unstable_doesProxyMatch`) |
| Тест `getServerSideProps` як функції | тест DAL/Server Actions як функцій; async Server Components — e2e |
| E2E «сторінка завантажилась» | `instant()` перевіряє shell/prefetched UI (16.x) |
| `next lint` у `next build` | видалено (16): ESLint/Biome окремим кроком CI |

## 4. Пастки і продакшн-проблеми
- **Спроба юніт-тестувати async Server Component** — падіння/хаки; правильно — винести логіку або e2e.
- **E2E проти `next dev`** — немає prefetch, інша поведінка кешу, повільно; flaky.
- **Моки `next/navigation`**: `redirect`/`notFound` кидають — тест, що чекає return, хибно проходить/падає.
- **Тести, що залежать від порядку** і спільної БД — flaky у паралельному CI.
- **`waitForTimeout`** замість auto-wait assertions.
- **Снапшоти RSC/HTML** — ламкі при кожному апгрейді Next.
- **Тестування лише happy path Server Action** — без перевірки «чужий користувач»/«невалідний вхід» (найважливіші security-тести).
- **Секрети в CI-логах** через `console.log(process.env)` у тестах.
- **`unstable_getResponseFromNextConfig` не враховує proxy** — хибна впевненість щодо редиректів.
- **Cookie `next-instant-navigation-testing`** між локальними проєктами.
- **Lint більше не в `next build`** — без окремого кроку CI правила тихо перестають перевірятися.

## 5. Interview angles
1. **Як тестувати async Server Component?** E2E; або винести логіку в функції; чому Vitest/Jest не підтримують.
2. **Як протестувати Server Action?** Виклик як функції, моки `cookies`/`next/cache`/DAL, перевірка authz і валідації; integration через e2e.
3. **Піраміда тестів для Next-застосунку.** Що на якому рівні; вартість і стабільність.
4. **Як зробити e2e стабільними?** Production build, ізоляція даних, auth state, web-first assertions, trace.
5. **Як протестувати proxy і редиректи?** `next/experimental/testing/server`; або винести логіку в чисту функцію.
6. **Що таке MSW і коли він кращий за мок `fetch`?** Мережевий рівень, перевикористання в тестах і dev.
7. **Як перевірити, що навігація миттєва?** `instant()` з `@next/playwright`, Navigation Inspector, `instant` segment config.
8. **CI для Next 16.** Кеш `.next/cache`, окремий lint, `next build` як тест shell, e2e проти preview.
9. **Що тестувати в DAL?** Authz-матриця, DTO-фільтр, обробка помилок.
10. **Snapshot-тести — так чи ні?** Малі, стабільні, не цілі сторінки.

## 6. Що може перевірити раннер
(Тут раннер сильний: учень пише **і код, і тести**; можна інвертувати — дати код і вимагати тест, що ловить баг.)
1. **«Напиши тест, що впаде»**: дано функцію-валідатор з багом (приймає порожній email) — учень пише `expect`, перевіряється, що тест падає на баговій і проходить на виправленій версії (дві реалізації в задачі).
2. **Тест Server Action як функції**: дія `createPost({ session, formData, db, updateTag })` з DI — тести на неавторизований виклик, невалідні поля, успіх (`updateTag` викликано з правильним тегом через `vi.fn()`).
3. **Мок `redirect`**: реалізувати `redirect`, що кидає `RedirectError`, і тест, що код після нього не виконується.
4. **Route Handler як чиста функція**: `handler({ method, url, headers })` → `{ status, headers, body }`; тести на 405, CORS preflight, валідацію.
5. **Тест proxy-логіки**: таблиця кейсів (`it.each`) для `decide(request)`.
6. **Fake timers**: тест кешу зі SWR (`vi.advanceTimersByTime`) — fresh/stale/expired.
7. **Міні-MSW**: реалізувати `createFetchMock(handlers)` з матчингом методу+шляху і тестами; використати в тесті DAL.
8. **Flaky-тест**: дано тест з `setTimeout`-гонкою — переписати через fake timers/`await` на подію.
9. **Тест DTO**: property-like перевірка, що жоден результат `toDTO` не містить заборонених ключів.
10. **Тест authz-матриці**: `it.each` по ролях × діях.

## 7. Джерела
- https://nextjs.org/docs/app/guides/testing · …/testing/vitest · …/testing/jest · …/testing/playwright · …/testing/cypress
- https://nextjs.org/docs/app/guides/instant-navigation · https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
- https://nextjs.org/docs/app/api-reference/file-conventions/proxy (Unit testing) · https://nextjs.org/docs/app/api-reference/config/next-config-js (Unit Testing)
- https://nextjs.org/docs/app/guides/environment-variables · …/ci-build-caching · …/ai-agents · …/mcp
- https://www.npmjs.com/package/@next/playwright
- https://vitest.dev/guide/ · https://vitest.dev/guide/mocking · https://testing-library.com/docs/react-testing-library/intro/ · https://testing-library.com/docs/queries/about#priority
- https://mswjs.io/docs/ · https://playwright.dev/docs/best-practices · https://playwright.dev/docs/test-webserver · https://playwright.dev/docs/auth
- https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation `(не звірено з docs 16.3.8)`
- https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications (ідеї)

## 8. Виправлення до SYLLABUS
1. **Тема 40:** додати офіційне обмеження «async Server Components не тестуються Vitest/Jest» як центральну тезу і архітектурний висновок (тонкі компоненти, логіка в функціях).
2. **Тема 40:** додати `next/experimental/testing/server` (proxy і config) — це офіційний API, ідеальний для раннер-задач; у SYLLABUS немає.
3. **Тема 41:** додати `@next/playwright` `instant()` і Navigation Inspector — нове в 16.x; e2e лише проти `next build && next start`.
4. **Тема 41:** `next lint` видалено в 16 — окремий крок lint у CI; `next build` як перевірка shell під Cache Components.
5. **§1 `testing`:** додати env у тестах (`.env.test`), MCP/`next-dev-loop` як огляд; MSW не має сторінки в Next docs — джерело mswjs.io.
6. **§5.2:** для testing-навички варто додати тип задач «напиши тест, що ловить баг» (раннер це вже вміє, якщо задача містить дві реалізації).
