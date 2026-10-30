# NEXTJS_SYLLABUS — курс «Next.js Zero → Pro» (етап 0: аналіз і план)

Третій офіційний курс Loo. Випускник професійно будує, оптимізує, тестує, захищає й деплоїть продакшн-застосунки на
Next.js 16+ (App Router) і React 19+, проходить співбесіду Middle/Senior і ухвалює архітектурні рішення.

Документ — спільний контракт для всіх наступних етапів (і для субагентів). Ним володіє лідер; субагенти пропонують
правки у звіті. Етап 0 не створює контенту курсу.

---

## 0. Що з'ясовано під час аналізу

| Факт | Наслідок для курсу |
|---|---|
| Проєкт на **Next.js 16.3.8**, React 19.3.0. У `node_modules/next/dist/docs/` лежить офіційна документація цієї версії: **456 файлів, ≈ 381k слів** (App Router, Pages, Architecture, Community) | Це **першоджерело №1** для кожного API. Автори звіряють кожен приклад саме з нею, а не з пам'яттю моделі |
| У 16.3 є API, яких немає в старому посібнику і, ймовірно, в пам'яті моделей: `catchError` (`next/error`), `io()` (`next/cache`), `'use cache: private'` / `'use cache: remote'`, `cacheHandlers`, **Partial Prefetching** (`partialPrefetching`, `prefetchInlining`), Instant navigation, Activity (збереження стану UI між навігаціями), `next/root-params`, Adapters (`adapterPath`), `useOffline` (experimental), `forbidden` / `unauthorized`, `refresh()`, `updateTag` | Окремі розділи або підрозділи; позначка `experimental` там, де вона є в документації |
| Старий посібник `content/Guides/Next.js`: **61 розділ + «Зміст», ≈ 32,5k слів**, переважно 200–800 слів. **Немає frontmatter (`id`, `level`), немає жодної вправи** | Жодних id вправ, які треба зберігати, немає, тож злиття дублікатів **не потребує** мапи `unit_aliases`. Тексти — сировина (переказ доків 16.2.4), не готові розділи |
| Дублікати: 06/41 (дані), 08/58/61 (кеш), 16/57 (Proxy), 19/53 (env), 07/20/54 (мутації й форми) | Мапа злиття — §6 |
| `content/Guides/React`: 177 файлів, ≈ 136k слів, переклад react.dev без вправ | Сировина для «Next.js Start» (React-мінімум) і RSC-розділів. У курс не входить |
| **Раннер `[!task]`**: worker без мережі, `import` і `Request`, лише **чистий JavaScript** (`RUNNABLE_LANGS = js/mjs/cjs`). Немає TS, JSX і React. API — `test/it/describe/expect/vi/sleep`, fake timers, моки, `resolves/rejects`. Таймаут 3 с на запуск, 1,5 с на тест | План задач — §5. Розширення раннера — рішення власника (§5.3) |
| Рівні за навичками зараз лише в мовних курсах: `LEARNER_SKILLS` / `PLACEMENT_SKILLS` — константи в `src/course/schema/bundle.ts`. Шар `src/server/courses/skills.ts` вмикає оцінку через `isLanguageCourse()` (шкала CEFR) | Технічний план — §7 |
| Прогрес, SRS і помилки привʼязані до `unit_id` (`attempts`, `reviews`, …). Є таблиця `unit_aliases` для перейменувань | i18n не потребує міграцій прогресу, якщо id однакові в усіх мовах (§8) |
| UI-i18n: `src/i18n` має одну локаль `uk`, типізовані ключі, `t()`. `profile.locale` ще немає | Основа для показу курсу мовою інтерфейсу (§8) |
| **Vault**: `.env.local` вказує на `/Users/yaroslav/Documents/Obsidian Vault`, а такого шляху на цій машині немає. `~/Documents/Obsidian Vault` тут без `Guides/` і `Courses/`. Скрипти працюють з `VAULT_PATH=content` | **Питання до власника** (§11): куди писати контент на цій машині |
| Базові перевірки на `main` (30.10.2026): `typecheck` OK; `test` 47 файлів / 1205 тестів OK; `course:check javascript-noob-to-god --no-tasks` 0 помилок / 37 попереджень; `course:check english-a1-c2 --no-tasks` 0 / 0 | Точка відліку для «нічого не зламали» |
| Еталон JS (bundle): 73 теми, 1759 вправ: 787 карток, 521 тест, 295 задач (232 з автотестами), 156 співбесід, 271 фішка, 61 тест теми, 8 екзаменів. Розділ, як «05. Замикання»: ≈ 5,1k слів, ≈ 8 тестів, 9 карток, 3 співбесіди, 5 фішок, 3 задачі, діаграма й 2 viz | Шаблон розділу й мікс вправ (§3.3) |

---

## 1. Мапа навичок

Навички — дані курсу (`course.yaml → skills`), а не константа (§7). Кожна тема має одну основну навичку, вправа її
успадковує (або має власний `skill:` у мета-рядку).

| id | Назва (uk) | Що покриває |
|---|---|---|
| `foundations` | Фундамент | HTTP і браузер, React-мінімум (компоненти, props, state, ефекти), TypeScript-мінімум. **Додано до пропозиції:** без цього вступний тест не відрізнить «зовсім новачка» від «знає React, не знає Next.js» |
| `routing` | Маршрутизація | файлова маршрутизація, layouts, templates, route groups, dynamic і catch-all, parallel та intercepting routes, `Link`, prefetching (зокрема Partial Prefetching), client router cache, redirects/rewrites, `proxy.ts` |
| `rendering` | Рендеринг і RSC | Server/Client Components і межа між ними, RSC payload, static/dynamic, Request-time APIs, `connection()`/`io()`, Streaming і Suspense, PPR, hydration, `loading`/`error`/`not-found`, `catchError` |
| `data` | Дані й кеш | отримання даних на сервері, водоспади й паралельність, Cache Components (`use cache` і варіанти `private`/`remote`, `cacheLife`, `cacheTag`), ревалідація (`revalidateTag`/`updateTag`/`revalidatePath`/`refresh`), ISR, Route Handlers, БД і ORM, клієнтський fetching |
| `mutations` | Мутації й форми | Server Functions/Actions, `useActionState`, `useFormStatus`, `useOptimistic`, валідація з Zod, progressive enhancement, помилки, файли, `after()` |
| `auth-security` | Auth і безпека | сесії й cookies, автентифікація й авторизація, DAL, захист Server Actions і Route Handlers, `server-only`, taint, секрети, env, CSP, OWASP (XSS, CSRF, SSRF) |
| `ui` | UI, SEO, a11y | Tailwind v4, CSS Modules, shadcn/ui, `next/image`, `next/font`, metadata й OG, sitemap/robots, JSON-LD, i18n маршрутів, доступність, View Transitions, MDX |
| `performance` | Продуктивність | Core Web Vitals, аналіз бандла, `next/dynamic`, lazy loading, зменшення клієнтського JS, React Compiler, профілювання, пам'ять, Turbopack |
| `testing` | Тестування | Vitest, Testing Library, тести Server Actions і Route Handlers, MSW, Playwright e2e, CI |
| `deploy-ops` | Деплой і експлуатація | Vercel (Functions, Fluid Compute, CDN, env, preview, cron, Rolling Releases), self-hosting, Docker, `output: 'standalone'`, adapters, instrumentation, OpenTelemetry, логи, моніторинг |
| `architecture` | Архітектура | структура великих проєктів, межі модулів, монорепо (Turborepo), multi-zones, multi-tenant, feature flags, міграції (Pages → App, 14 → 15 → 16), AI-фічі (AI SDK), компроміси |

**Рівні** — як у JS-курсі: `noob → junior → middle → senior → god` (учню — Trainee … Principal). Зміна шкали нічого не
дає, а одна шкала для programming-курсів зберігає логіку `src/course/select/*`.

| Рівень | Що вміє на цьому рівні (орієнтир для авторів і банку вступного тесту) |
|---|---|
| noob | знає веб і React на рівні «зібрав сторінку», робить перший застосунок на App Router за інструкцією |
| junior | впевнено працює з маршрутами, layouts, Server/Client Components, простими даними й формами; деплоїть на Vercel |
| middle | розуміє кеш і ревалідацію, стрімінг, Server Actions з валідацією, auth, SEO, тести; знаходить водоспад чи помилку hydration |
| senior | проєктує кешування й межі компонентів, безпеку, продуктивність (CWV, бандл), observability, self-hosting; розбирає продакшн-інциденти |
| god | архітектура великих систем: монорепо, multi-zones і multi-tenant, міграції, платформні нюанси PPR і CDN, компроміси, навчає команду |

---

## 2. Структура курсу

Маніфест: `Courses/nextjs-zero-to-pro/course.yaml` (§2.4). П'ять посібників, як у JS:

| Посібник | Тем | Слів (ціль) | Роль |
|---|---|---|---|
| `Next.js Start` | 12 | ≈ 42k (3,5k/тема) | вхід з нуля і «Перед стартом» |
| `Next.js` | 49 | ≈ 270k (5,5k/тема, межі 4–8k) | основний посібник, розділи за навичками |
| `Next.js Katas` | 12 | ≈ 54k | лайвкодинг: задачі з автотестами |
| `Next.js Projects` | 6 | ≈ 84k (≈ 14k/проєкт) | проєкти крок за кроком, кожен крок — задача |
| `Next.js Interview Q&A` | 14 | ≈ 70k | банк питань Junior → Lead, `kind: practice` |
| **Разом** | **93** | **≈ 520k** | |

Обсяг дає глибина: як влаштовано під капотом, реальні кейси, компроміси, налагодження. Не вода.

### 2.1. Посібник «Next.js Start» (розділи курсу `basics` і `start`)

| № | Тема | Навичка | Рівень | Цілі (🎯) |
|---|---|---|---|---|
| S01 | Як працює веб: URL, HTTP, браузер, HTML/CSS/JS | foundations | noob | пояснити шлях запиту, коди статусів, заголовки, що браузер робить з HTML |
| S02 | React-мінімум I: компоненти, JSX, props, списки | foundations | noob | написати компонент, передати props, вивести список з `key` |
| S03 | React-мінімум II: state, події, ефекти, коли ефект не потрібен | foundations | noob | керувати станом, обробляти події, відрізнити «ефект» від «обчислення під час рендеру» |
| S04 | TypeScript-мінімум для Next.js: типи props, union, generics, `satisfies` | foundations | noob | типізувати компонент і функцію, читати помилки TS |
| S05 | Що таке Next.js і навіщо фреймворк: CSR, SSR, SSG — карта світу | rendering | noob | пояснити, що дає сервер, де рендериться сторінка |
| S06 | `create-next-app`, структура проєкту, скрипти, `next dev` / `build` / `start` | routing | noob | створити проєкт, зорієнтуватися в `app/`, `public/`, конфігах |
| S07 | Сторінки й layouts: перший багатосторінковий сайт | routing | noob | зробити `page`, `layout`, вкладені маршрути |
| S08 | Навігація: `Link`, `usePathname`, `useRouter` | routing | noob | зробити меню з активним пунктом, програмну навігацію |
| S09 | Стилі: Tailwind CSS v4 і CSS Modules | ui | noob | стилізувати сторінку двома способами, глобальні стилі |
| S10 | Дані на сервері: перший `async`-компонент, `loading`, `error` | data | noob | завантажити дані без `useEffect`, показати стан завантаження й помилку |
| S11 | Перша форма: Server Action без бібліотек | mutations | noob | надіслати форму на сервер і оновити сторінку |
| S12 | Перший деплой на Vercel: Git, preview, env, домен | deploy-ops | noob | задеплоїти, налаштувати змінну середовища, прочитати логи |

Розділ курсу `basics` = S01–S04 (`level: noob`, test-out екзаменом), `start` = S05–S12.

### 2.2. Основний посібник «Next.js» (розділи курсу за навичками)

Номер — стабільний номер теми (`NN` у назві файлу і в id). Рівень — рівень теми; вправи всередині теми мають рівні від
junior до god за заголовками `## 🟢 Junior`…

**Розділ `routing` — Маршрутизація (01–06)**

| № | Тема | Рівень | Ключові цілі |
|---|---|---|---|
| 01 | App Router: сегменти, спеціальні файли, ієрархія рендеру | junior | пояснити дерево сегментів і порядок обгортання `layout → template → error → loading → not-found → page` |
| 02 | Layouts, templates, route groups, кілька root layouts | junior | обрати layout чи template, організувати маршрути групами без впливу на URL |
| 03 | Динамічні маршрути: `[slug]`, catch-all, optional catch-all, async `params`, `generateStaticParams` | junior | типізувати async `params`/`searchParams`, згенерувати статичні шляхи, `dynamicParams` |
| 04 | Навігація під капотом: `Link`, prefetching, Partial Prefetching, client router cache, `staleTimes`, Activity і збереження стану UI | middle | передбачити, що завантажиться при наведенні чи навігації, що збережеться, що скинеться |
| 05 | Parallel і intercepting routes: слоти, `default.js`, модалки з URL | middle | зробити модалку з власним URL і правильним поведінкою при reload і «назад» |
| 06 | `proxy.ts`, redirects, rewrites, headers у `next.config` | middle | обрати, де робити редирект (config, proxy, `redirect()`), написати matcher, знати обмеження proxy |

**Розділ `rendering` — Рендеринг і RSC (07–13)**

| № | Тема | Рівень | Ключові цілі |
|---|---|---|---|
| 07 | Server і Client Components: ментальна модель RSC (**модельний розділ**, §3.4) | junior | визначити, де виконується компонент і чому, що потрапляє в клієнтський бандл |
| 08 | Межа `'use client'`: серіалізація props, композиція через `children`, `server-only` / `client-only`, контекст | middle | провести межу якомога нижче, передати серверний компонент у клієнтський |
| 09 | Як рендериться маршрут: RSC payload, HTML, hydration, навігація на клієнті | senior | прочитати RSC payload, пояснити, що відбувається при першому заході й при навігації |
| 10 | Статичне й динамічне: Request-time APIs (`cookies`, `headers`, `searchParams`), `connection()`, `io()`, rendering philosophy | middle | передбачити, що робить маршрут динамічним, і локалізувати це |
| 11 | Streaming і Suspense: `loading.js`, межі Suspense, порядок стрімінгу, `use()` | middle | спроєктувати межі Suspense, щоб повільні частини не блокували сторінку |
| 12 | Partial Prerendering і Cache Components: static shell, динамічні «дірки», Instant navigation | senior | пояснити shell + стрімінг, виправити помилки збірки «uncached data outside Suspense» |
| 13 | Помилки: `error.js`, `global-error`, `not-found`, `forbidden` / `unauthorized`, `catchError`, `retry()`, помилки hydration | middle | розставити межі помилок, знайти й виправити hydration mismatch |

**Розділ `data` — Дані й кеш (14–20)**

| № | Тема | Рівень | Ключові цілі |
|---|---|---|---|
| 14 | Дані на сервері: `fetch`, ORM, водоспади й паралельність, `Promise.all`, preload, дедуплікація (`React.cache`) | middle | знайти й прибрати водоспад, пояснити дедуплікацію |
| 15 | Cache Components: `use cache`, `cacheLife`, `cacheTag`, ключі кешу, серіалізація аргументів | senior | обрати рівень кешування (файл, компонент, функція) і профіль часу життя |
| 16 | Ревалідація: `revalidateTag` (stale-while-revalidate), `updateTag` (read-your-writes), `revalidatePath`, `refresh()`, як працює ревалідація | senior | обрати правильний API для сценарію, передбачити, що побачить користувач |
| 17 | ISR і CDN: `generateStaticParams`, on-demand, кешування на CDN; «кешування без Cache Components» як «було → стало» | senior | налаштувати ISR, пояснити кеш на CDN і заголовки |
| 18 | `'use cache: private'`, `'use cache: remote'`, `cacheHandlers`, кеш у self-hosting | god | вирішити, де живе кеш, і не закешувати дані користувача в спільний кеш |
| 19 | Route Handlers і Backend-for-Frontend: `route.ts`, методи, стрімінг, кешування, CORS, вебхуки | middle | написати API-маршрут, обрати між Route Handler і Server Action |
| 20 | Бази даних і клієнтський fetching: Drizzle/Prisma, пули з'єднань у serverless, транзакції, SWR / TanStack Query, `use()` | middle | підключити БД безпечно, знати, коли дані тягнути з клієнта |

**Розділ `mutations` — Мутації й форми (21–25)**

| № | Тема | Рівень | Ключові цілі |
|---|---|---|---|
| 21 | Server Functions/Actions під капотом: POST, id дії, замикання й шифрування, `'use server'` | senior | пояснити, як виклик функції стає запитом і що з цього випливає для безпеки |
| 22 | Форми: `<form action>`, `useActionState`, `useFormStatus`, progressive enhancement, `next/form` | middle | зробити форму, що працює без JS і з JS |
| 23 | Валідація й помилки: Zod на сервері, повернення стану полів, очікувані й неочікувані помилки | middle | валідувати вхід на сервері, показати помилки полів |
| 24 | Optimistic UI: `useOptimistic`, `useTransition`, відкат при помилці | senior | зробити миттєвий UI з правильним відкатом |
| 25 | Файли й фонові задачі: ліміти тіла запиту, пряме завантаження в Blob, `after()` | senior | завантажити великий файл повз функцію, виконати роботу після відповіді |

**Розділ `auth-security` — Auth і безпека (26–30)**

| № | Тема | Рівень | Ключові цілі |
|---|---|---|---|
| 26 | Сесії й cookies: stateless і stateful сесії, атрибути cookie, ротація | middle | обрати тип сесії, налаштувати безпечні cookies |
| 27 | Автентифікація: Auth.js, Better Auth, Supabase SSR, ідеї Clerk; proxy-перевірка проти DAL | middle | підключити auth і зрозуміти, чому proxy — лише оптимістична перевірка |
| 28 | Авторизація: ролі, ресурси, multi-tenant, auth разом із Cache Components | senior | перевіряти доступ біля даних, не кешувати чужі дані |
| 29 | Безпека даних: DAL, DTO, `server-only`, taint API, секрети й змінні середовища (`NEXT_PUBLIC_`) | senior | не злити секрет чи поле БД у клієнт |
| 30 | Веб-безпека: CSP з nonce, XSS, CSRF (і як захищені Server Actions), SSRF, rate limiting, OWASP Top 10 | senior | налаштувати CSP, захистити дію і Route Handler |

**Розділ `ui` — UI, SEO і доступність (31–35)**

| № | Тема | Рівень | Ключові цілі |
|---|---|---|---|
| 31 | Стилізація: Tailwind v4, CSS Modules, Sass, CSS-in-JS з RSC, shadcn/ui | junior | обрати підхід і знати, що з ним не так у Server Components |
| 32 | `next/image` і `next/font`: розміри, `sizes`, пріоритет, віддалені зображення, шрифти без CLS | middle | прибрати CLS і зайві байти зображень |
| 33 | Metadata і SEO: `generateMetadata`, OG-зображення, sitemap, robots, JSON-LD, canonical | middle | зробити SEO сторінки й динамічні OG-зображення |
| 34 | Інтернаціоналізація маршрутів: `[lang]`, root params, словники, `hreflang` | senior | побудувати багатомовний сайт без зайвого динамічного рендеру |
| 35 | Доступність, View Transitions, `next/script`, MDX | middle | перевірити a11y за WCAG 2.2, додати переходи, підключити MDX |

**Розділ `performance` — Продуктивність (36–39)**

| № | Тема | Рівень | Ключові цілі |
|---|---|---|---|
| 36 | Core Web Vitals у Next.js: LCP, INP, CLS, `useReportWebVitals`, Speed Insights | senior | діагностувати й покращити кожну метрику |
| 37 | Бандл: аналіз, `optimizePackageImports`, `next/dynamic`, lazy loading, сторонні скрипти | senior | зменшити клієнтський JS і знайти, звідки він узявся |
| 38 | React Compiler і продуктивність рендеру: коли мемоізація не потрібна, профілювання | senior | увімкнути компілятор, прочитати профайлер |
| 39 | Пам'ять, білд і Turbopack: витоки, memory usage, кеш збірки в CI | god | знайти витік у серверному процесі, пришвидшити збірку |

**Розділ `testing` — Тестування (40–41)**

| № | Тема | Рівень | Ключові цілі |
|---|---|---|---|
| 40 | Unit і компонентні тести: Vitest, Testing Library, тести Server Actions і Route Handlers, MSW | middle | протестувати логіку і компонент, замокати мережу |
| 41 | E2E з Playwright і CI: стратегія піраміди, стабільні тести, preview-деплої | senior | написати e2e на критичний шлях і запустити в CI |

**Розділ `deploy-ops` — Деплой і експлуатація (42–44)**

| № | Тема | Рівень | Ключові цілі |
|---|---|---|---|
| 42 | Vercel: Functions і Fluid Compute, CDN, env, preview, cron, Rolling Releases, Firewall і BotID | middle | задеплоїти правильно і знати, що за що платиш |
| 43 | Self-hosting: `output: 'standalone'`, Docker, adapters, кастомний сервер, static export, кеш між інстансами | senior | запустити застосунок без Vercel і не зламати кеш та ISR |
| 44 | Observability: `instrumentation.ts`, `instrumentation-client`, OpenTelemetry, логи, Sentry, аналітика | senior | побачити повільний запит і помилку в продакшні |

**Розділ `architecture` — Архітектура і масштаб (45–49)**

| № | Тема | Рівень | Ключові цілі |
|---|---|---|---|
| 45 | Структура великого застосунку: feature folders, межі модулів, DAL, шари | senior | спроєктувати структуру, що не розвалиться на 50 розробниках |
| 46 | Монорепо і масштаб: Turborepo, multi-zones, multi-tenant | god | обрати між монорепо, zones і окремими застосунками |
| 47 | Feature flags, Draft Mode, A/B-тести | senior | вмикати фічі без релізу і не ламати кеш |
| 48 | Міграції: Pages → App Router, 14 → 15 → 16, codemods (тут — `getServerSideProps`, старий middleware, `unstable_cache`, лише як «було → стало») | senior | спланувати поступову міграцію |
| 49 | AI у застосунку: AI SDK, стрімінг відповідей, tool calling, обмеження й вартість | senior | додати AI-фічу зі стрімінгом і захистом від зловживань |

### 2.3. Katas, Projects, Interview

**`Next.js Katas` (12 тем × ≈ 8 задач)** — лайвкодинг на чистому JS (§5): K01 парсер і матчер маршрутів · K02
`searchParams` і пагінація · K03 `generateMetadata` / `generateStaticParams` · K04 matcher і логіка `proxy.ts` на
мок-запитах · K05 кеш з тегами і TTL (модель `cacheTag`/`cacheLife`) · K06 stale-while-revalidate vs read-your-writes ·
K07 валідація Server Action (схеми, помилки полів) · K08 optimistic-редʼюсер з відкатом · K09 сесії: підпис і
перевірка токена, ролі · K10 CSP і заголовки безпеки як дані · K11 i18n: переговори мови, словники, `hreflang` · K12
планувальник паралельних запитів і усунення водоспадів.

**`Next.js Projects` (6 проєктів × ≈ 10 кроків; кожен крок — задача з тестами на утиліти + чекліст продакшену)**:
P1 Блог на MDX · P2 Інтернет-магазин (кошик, Stripe test mode, вебхуки) · P3 SaaS-дашборд (auth, ролі, multi-tenant,
білінг) · P4 Realtime-чат · P5 AI-застосунок зі стрімінгом · P6 Сайт документації з пошуком.

**`Next.js Interview Q&A` (14 тем, `kind: practice`)**: за навичками і рівнями Junior → Lead, включно з system design
(«спроєктуй кешування для…»), розборами продакшн-інцидентів і «знайди баг у коді».

### 2.4. Розділи курсу (`course.yaml`)

| id | Назва | Посібник | Теми | Навички |
|---|---|---|---|---|
| `basics` | Перед стартом | Next.js Start | S01–S04 | foundations |
| `start` | Старт з нуля | Next.js Start | S05–S12 | змішано, noob |
| `routing` | Маршрутизація | Next.js | 01–06 | routing |
| `rendering` | Рендеринг і RSC | Next.js | 07–13 | rendering |
| `data` | Дані й кеш | Next.js | 14–20 | data |
| `mutations` | Мутації й форми | Next.js | 21–25 | mutations |
| `auth-security` | Auth і безпека | Next.js | 26–30 | auth-security |
| `ui` | UI, SEO і доступність | Next.js | 31–35 | ui |
| `performance` | Продуктивність | Next.js | 36–39 | performance |
| `testing` | Тестування | Next.js | 40–41 | testing |
| `deploy-ops` | Деплой і експлуатація | Next.js | 42–44 | deploy-ops |
| `architecture` | Архітектура і масштаб | Next.js | 45–49 | architecture |
| `livecoding` | Лайвкодинг | Next.js Katas | K01–K12 | за темою |
| `projects` | Проєкти | Next.js Projects | P1–P6 | за темою |
| `interview` | Співбесіда | Next.js Interview Q&A | I01–I14 | за темою (`kind: practice`) |

Іконка курсу `si:SiNextdotjs`, іконки розділів — `px:`. `exams: topic 10 / 0.8, section 25 / 0.8 testOut`. Кожна тема
має тест, кожен розділ шляху — екзамен (13 екзаменів).

---

## 3. Вправи: обсяги й мікс

### 3.1. Мікс на тему

| Посібник | Тем | Картки | Тести | Задачі | Співбесіда | Фішки |
|---|---|---|---|---|---|---|
| Start | 12 | 8 → 96 | 8 → 96 | 2 → 24 | — | 3 → 36 |
| Next.js | 49 | 12 → 588 | 9 → 441 | 3 → 147 | 4 → 196 | 5 → 245 |
| Katas | 12 | 2 → 24 | 2 → 24 | 8 → 96 | — | 2 → 24 |
| Projects | 6 | 4 → 24 | 3 → 18 | 10 → 60 | — | — |
| Interview Q&A | 14 | 4 → 56 | — | — | 12 → 168 | — |
| **Разом** | **93** | **788** | **579** | **327** | **364** | **305** |

**Усього вправ ≈ 2 058** (план: ≥ 1 700; картки ≥ 750 ✓, задачі ≥ 300 ✓, тести ≥ 500 ✓, співбесіда ≥ 350 ✓).
Окремо — банк вступного тесту ≥ 330 питань (§4.1).

Режими тестів (з 579): output / «що відрендериться, де виконається» ≈ 160 · single ≈ 120 · multi ≈ 110 · fill ≈ 95 ·
order ≈ 95. `output` для Next.js означає «передбач результат»: де виконується код, що закешується, коли ревалідація,
порядок стрімінгу, статус-код, заголовки.

### 3.2. Що перевіряють вправи

Розуміння, а не назви: «що станеться, якщо…», «який варіант кешування тут правильний і чому», «знайди баг». Кожен
неправильний варіант — типова помилка розробника, з поясненням у `**Пояснення:**`. Кожна картка і співбесіда
закінчується рядком `📚` (внутрішній wiki-link + 1–2 зовнішні джерела, PLAYBOOK §7).

### 3.3. Шаблон теми

Анатомія — LEARNING_PLAYBOOK §2 (🎯 → 🤔 Передбач → 🧒 Простими словами → 🔬 Як це працює (з `[!diagram]` для
потоків запиту, рендеру й кешу) → ⚠️ Пастки → 🎤 На співбесіді → 🔗 Зв'язки → ⚡ Фішки → 🧠 Закріплення → 🛠️ Практика →
📚 Джерела → Підсумок). Для Next.js додаємо в «🔬» обовʼязковий підрозділ **«🏭 Як це роблять у продакшні»**.
Мінімум 2 ілюстрації на тему; нові `[!viz]`-сценарії (життєвий цикл запиту, RSC-потік, шари кешу) — у плані на етап 1,
спершу `[!diagram]` (текстові підписи, тож перекладаються).

Frontmatter теми: `id`, `level`, **`skill`** (нове поле, §7), `icon`, `tags`, `prerequisites`, `estimatedMinutes`.

### 3.4. Модельний розділ

`Next.js - 07. Server і Client Components` пишемо на етапі 1 повністю, з вправами. Це еталон для всіх авторів:
стиль, глибина, мікс вправ, оформлення джерел, перевірені приклади.

### 3.5. Ідентифікатори

| Що | Формат | Приклад |
|---|---|---|
| Тема | `nextjs-<гайд>-<NN>` | `nextjs-core-07`, `nextjs-start-05`, `nextjs-kata-04` |
| Вправа | `nextjs-<гайд>-<NN>-<тип>-<nn>` | `nextjs-core-15-quiz-03`, `nextjs-core-15-card-07`, `nextjs-core-15-task-02`, `nextjs-core-15-int-01` |
| Банк вступного тесту | `nextjs-pl-<skill>-<level>-<nn>` | `nextjs-pl-data-senior-04` |

`<гайд>` = `start · core · kata · proj · int`. **Відхилення від плану свідомо** (план: `nextjs-<section>-<topic>-<n>`):
розділ курсу в id робить id нестабільним. Перенесли тему з одного розділу в інший, і прогрес та SRS губляться. Номер
теми в посібнику стабільний, розділ — ні. Потрібне підтвердження власника (§11). Реєстр id — `docs/nextjs/ids.md`
(веде лідер). Злиття дублікатів старого посібника мапи `old → new` не потребує: у старих файлах немає id вправ.

---

## 4. Автовизначення рівня і підбір уроків (продуктова частина)

### 4.1. Вступний тест за навичками

- **Банк** `Guides/Next.js/_placement/<level>.md`, ≥ 6 питань на кожну пару (навичка × рівень): 11 × 5 × 6 = **≥ 330**.
  Рівень питання береться з **назви файлу** (`noob.md` … `god.md`): рівні `noob`/`god` у мета-рядку парсер контенту не
  розпізнає. Тема рівня `god` (верх шкали) ніколи не стає «знаю».
  Мета-рядок як в англійському банку: `level: middle · skill: data · diff: 2 · id: nextjs-pl-data-middle-03`.
- **Типи питань**: концепція · «що де рендериться» · «знайди баг» · «що станеться з кешем» · читання коду. Чотири
  варіанти, одна правильна відповідь (як у мовному банку: захист від вгадування працює на 1/варіанти).
- **Алгоритм** (двофазний, у межах `maxQuestions: 40`; фаза 1 обмежена `maxQuestions − 2·навичок` = 18, тож на кожну з 11
  навичок лишається ≥ 2 питання):
  1. *Загальний рівень*: наявний бінарний пошук банку (`placement.ts`, режим «банк») по змішаних навичках, старт з
     середини (`middle`), ≈ 12–15 питань.
  2. *Уточнення за навичками*: для кожної навички 2–3 питання на рівні загального результату; правильно → наступне
     на рівень вище, помилка → на рівень нижче (міні-сходи). Оцінка навички — та сама апостеріорна модель θ, що й в
     англійському (`P = c + (1 − c)·σ(2,77·(θ − b))`, апріорне `N(загальний, 0,75)`).
  3. Результат: рівень кожної навички, загальний рівень, впевненість.
- **«Я новачок»**: кнопка без тесту (рівень `noob`, старт з `basics`). Тест можна пройти знову зі сторінки курсу.

### 4.2. Підбір уроків

- Тема, чий рівень нижчий за рівень її навички, — **«знаю»**: показано на мапі, уроки необовʼязкові, тест теми
  можна скласти для підтвердження.
- **Шлях починається з першої непокритої теми** (у порядку курсу), а не з першого розділу після рівня.
- «Рекомендоване» спершу пропонує теми слабких навичок.
- Вправи — рівень навички ± 1 і слабкі місця (ваги з `adaptive.ts`, як в англійському).

### 4.3. Оновлення рівня і профіль

- Рівень навички оновлюється з тестів тем, екзаменів і помилок (як `updateSkills` у мовному курсі).
- «Перескочити / повторити» (`levelSuggestion`) — на мапі курсу.
- Профіль навичок у UI: смуги на кожну навичку (radar — опційно) і «наступний крок». Узагальнений `SkillLevels`.

---

## 5. Задачі з кодом: що реально можна перевірити

### 5.1. Що вміє раннер сьогодні

Чистий JS у worker'і: без TS, JSX, `import`, мережі й `Request`/`fetch`. Є `test/describe/expect/vi`, фейкові
таймери, моки, проміси. Повного Next.js у браузері немає і не буде без нової інфраструктури.

### 5.2. Типи задач без змін раннера

| Тип | Приклади | Як перевіряється |
|---|---|---|
| Чисті функції й утиліти | `generateMetadata`, `generateStaticParams`, матчер маршрутів, парсинг `searchParams`, sitemap | `expect(...).toEqual` на даних |
| Валідація як функція | схема (міні-валідатор або написана вручну), повернення стану полів з дії | тести на вхід/вихід |
| Кеш як модель | ключі кешу, профілі `cacheLife` як дані, симуляція SWR і `updateTag` з fake timers | `vi.useFakeTimers()` |
| Конфіг як обʼєкт | `next.config` (redirects, headers, images.remotePatterns) як обʼєкт під тестом | перевірка структури |
| Логіка `proxy.ts` | функція над мок-запитом `{ url, headers, cookies }` → `{ redirect | rewrite | next }` | тести без `Request` |
| Знайди й виправ баг | водоспад (тест рахує паралельність через fake timers), витік серверного поля в DTO, незахищена дія, кеш з даними користувача | тести падають на багу, проходять після фіксу |
| «Передбач результат» і «склади кроки» | де виконується код, порядок стрімінгу, життєвий цикл запиту | `[!quiz]` output / order (не `[!task]`) |
| Проєктні кроки | утиліти кожного кроку з тестами + чекліст продакшену | тести + самоперевірка |

Код задач — сучасний JS з JSDoc-типами, щоб читалося як TS. Приклади TS/TSX у теорії перевіряються окремо, у
скретч-застосунку Next.js 16 під `/tmp` (§9).

### 5.3. Варіанти розширення раннера (**потрібне рішення власника, не будую без «так»**)

| Варіант | Що дає | Вартість | Ризики |
|---|---|---|---|
| **A.** Нічого не міняти | 0 | 0 | задачі на JS, не на TS/TSX |
| **B.** Стрипінг типів TS у worker'і і в `course:check` (`ts starter` / `ts tests`) | задачі на TypeScript, як у справжньому Next.js | ≈ 1–2 дні; +≈ 100–300 КБ у worker (sucrase чи аналог, лише на сторінці задачі) | нова залежність у пісочниці, треба оновити CSP-тести |
| **C.** Шими Next у worker'і (`next/navigation`, `next/headers`, `NextResponse`, мок `Request`) | задачі «напиши справжній `proxy.ts` / Route Handler» | ≈ 2–3 дні поверх B | шими розходяться з реальним Next — треба тести на відповідність |
| **D.** JSX + `react-dom/server` у worker'і | «відрендери компонент і перевір HTML» | ≈ 3–5 днів | розмір worker'а, React у пісочниці |
| **E.** Серверний раннер (Vercel Sandbox / контейнер) зі справжнім Next | повні задачі «збери застосунок» | тижні + **гроші** за обчислення | вартість, безпека, черги |

**Рекомендація:** A на старті контенту, **B** — на етапі 1 (дешево, велика користь для професійного курсу), C — разом
із Katas (передостанній етап), D і E — не робити зараз.

---

## 6. Мапа міграції старого посібника

Старі файли не мають id, тож їх можна переписати на місці. Новий посібник `Next.js` замінює старий (ті самі назви
папки, нові назви файлів і нумерація). Старий текст — сировина, кожен факт звіряється з документацією 16.3.8.

| Старі розділи | → Нова тема | Примітка |
|---|---|---|
| 01 Встановлення, 02 Структура, 51 Локальна розробка | S06 | |
| 03 Layouts та сторінки | S07, 01, 02 | |
| 04 Навігація, 59 Prefetching | S08, 04 | + Partial Prefetching, Activity (нове в 16.3) |
| 05 Серверні та клієнтські | 07, 08 | |
| **06 + 41** Отримання даних | S10, 14 | дублікат: злити |
| **07 + 20 + 54** Мутації, форми, Server Actions | S11, 21, 22, 23 | дублікат: злити |
| **08 + 58 + 61** Кешування, Cache Components | 15, 18 | дублікат: злити |
| 09 Обробка помилок | 13 | + `catchError`, `forbidden`/`unauthorized` |
| 10 CSS, 43 CSS-in-JS, 44 Sass | S09, 31 | |
| 11 Ревалідація | 16 | + `updateTag`, `refresh()` |
| 12 Зображення, 13 Шрифти | 32 | |
| 14 Метадані, 48 JSON-LD | 33 | |
| 15 Route Handlers | 19 | |
| **16 + 57** Proxy, 31 Редиректи | 06 | дублікат: злити |
| 17 Деплоймент | S12, 42 | |
| 18 Оновлення версії, 60 Міграція з Pages | 48 | |
| **19 + 53** Змінні середовища, 45 Безпека даних | 29 | дублікат: злити |
| 21 Автентифікація | 26, 27, 28 | |
| 22 Стрімінг | 11, 12 | |
| 23 Ліниве завантаження, 42 Бандлінг, 49 Сторонні бібліотеки | 37 | |
| 24 ISR | 17 | |
| 25 Інтернаціоналізація | 34 | |
| 26 Тестування | 40, 41 | |
| 27 Self-Hosting, 32 Static Export, 50 Кастомний сервер | 43 | + adapters |
| 28 SPA, 29 PWA | 43, 35 | PWA і `useOffline` — підрозділ, experimental |
| 30 Скрипти, 33 MDX, 38 View Transitions | 35 | |
| 34 Налагодження | 13, 44 | |
| 35 CSP | 30 | |
| 36 Аналітика, 39 OpenTelemetry, 47 Інструментація | 44 | |
| 37 Draft Mode | 47 | |
| 40 Чекліст продакшену | 44 + чеклісти Projects | |
| 46 Multi-Zones | 46 | |
| 52 Оптимізація пам'яті | 39 | |
| 55 Паралельні, 56 Перехоплення | 05 | |
| Зміст | `_guide.md` | новий індекс |

Чого в старому посібнику **немає зовсім**: RSC payload і hydration (09), static vs dynamic як модель (10), PPR (12),
`use cache: private/remote` (18), БД і пули (20), optimistic UI (24), файли й `after()` (25), авторизація й
multi-tenant (28), веб-безпека OWASP (30), CWV (36), React Compiler (38), Vercel-платформа (42), архітектура (45–46),
AI (49), а також весь Start, Katas, Projects, Interview.

---

## 7. Технічний план: навички як дані курсу

Принцип: мовний курс поводиться **байт-у-байт як раніше** (той самий bundle, ті самі рішення вступного тесту й підбору).

| Крок | Файли | Що робимо |
|---|---|---|
| 1. Схема маніфесту | `src/course/schema/manifest.ts` | `skills?: [{ id, title, description?, icon? }]`, `placement.skills?` (які навички міряє банк). Без поля — типові навички за `kind` |
| 2. Типові навички | новий `src/course/schema/skills.ts` | `DEFAULT_SKILLS.language` = нинішні `LEARNER_SKILLS` (5) і `PLACEMENT_SKILLS` (4) як **дані**; programming за замовчуванням — порожньо (JS-курс без моделі навичок, як зараз) |
| 3. Bundle | `src/course/schema/bundle.ts` | `course.skills` (масив), `ExerciseRef.skill: string` (перевірка проти `course.skills` у компіляторі), `Topic.skill?`. `LEARNER_SKILLS` лишається реекспортом для сумісності |
| 4. Компілятор | `src/course/compile/{compile,difficulty}.ts` | мовний курс — нинішній `exerciseSkill`; programming — `skill:` з мета-рядка → `skill` теми (frontmatter) → `skill` розділу. `course:check`: тема без навички, невідома навичка, тонкий банк (`thin-placement` на пару навичка × рівень) |
| 5. Оцінка навичок | `src/course/select/skills.ts`, `src/server/courses/skills.ts` | функції приймають список навичок з bundle замість константи; `isLanguageCourse()` → `hasSkillModel(bundle)` (= є навички). IELTS — лише для CEFR |
| 6. Вступний тест | `src/course/select/placement.ts`, `src/server/courses/placement-core.ts` | фаза 2 «уточнення за навичками» (§4.1) вмикається полем `placement.perSkill` (за замовчуванням вимкнено → англійський не змінюється) |
| 7. Шлях | `src/course/select/path.ts`, `src/server/courses/path-view.ts` | `knownTopics` (тема нижче рівня навички), старт з першої непокритої теми, «рекомендоване» за слабкими навичками |
| 8. Підбір вправ | `src/course/select/adaptive.ts` | без змін алгоритму, лише навички з bundle |
| 9. UI | `src/ui/courses/SkillLevels.tsx`, сторінка курсу, `/account`, `PlacementPlayer` | N навичок, смуги, «наступний крок», «Я новачок» |
| 10. Зберігання | `enrollments.placement` (jsonb), `user_settings` `skills:<courseId>` | **без міграцій БД** |

**Тести:** (1) **golden-тест** — `english-a1-c2.json` і `javascript-noob-to-god.json` до і після рефакторингу однакові,
крім нових полів (`course.skills`); (2) повтор вступного тесту на синтетичних відповідях англійського — ті самі
питання й результат; (3) юніт-тести двофазного тесту і `knownTopics`; (4) симуляція профілів «новачок / junior /
senior» на банку Next.js (точність ± 1 рівень, середня кількість питань).

---

## 8. Технічний план: i18n контенту

### 8.1. Рішення

| Питання | Рішення | Чому |
|---|---|---|
| Ідентичність | id курсу, розділів, тем, вправ — латиницею, однакові в усіх мовах | прогрес, SRS, помилки, навички — на id; зміна мови нічого не губить |
| Bundle | **один** bundle структури на курс + **тексти за мовами** у snapshot (`content/.snapshot/<lang>/…`) | bundle вже тримає лише структуру й посилання; дублювати структуру за мовами — ризик розходження |
| Маніфест | `sourceLanguage: uk`, `languages: [uk]`, локалізовані поля як мапа: `title: { uk: …, en: … }` (рядок = мова джерела) | сумісно з нинішнім `title: string` |
| Переклад статті | паралельний файл `Guides/<Guide>/_i18n/<lang>/<та сама назва>.md` | тека `_i18n` не стає розділом (як `_placement`); видно в Obsidian поруч з оригіналом |
| Звʼязок переклад ↔ джерело | за **id теми** з frontmatter, не за назвою файлу | назву можна локалізувати |
| Сегменти | вправа = її `id`; проза = `<slug заголовка>#p<n>` (абзац / список / таблиця / callout) | стабільно при правках інших секцій |
| Хеші | `_i18n/<lang>/<файл>.lock.json`: `segmentId → sha1(нормалізований текст джерела)`. Записує `pnpm i18n:stamp` після перекладу | markdown лишається чистим для перекладача |
| Перевірка | `pnpm i18n:check`: неперекладені, застарілі (хеш змінився), розбіжність структури (інший набір блоків / id), відмінність коду поза коментарями і назвами тестів | §7 плану, вимога 3 |
| Що перекладається | проза, підказки, пояснення, варіанти, коментарі в коді, назви `test('…')`, повідомлення помилок (нові ключі в `src/i18n`, повідомлення харнесу) | |
| Що ні | ідентифікатори, API, команди, код тестів | `i18n:check` порівнює код без коментарів і рядків-назв тестів |
| Картинки | без тексту в зображеннях; діаграми — `[!diagram]` з текстовими підписами, SVG — з перекладними підписами | |
| Глосарій | `content/glossary/uk-en.yaml`: термін → переклад + список «лишати латиницею» | `i18n:check` попереджає про непослідовний переклад |
| Показ | мова курсу = мова інтерфейсу, якщо вона є в `languages`, інакше мова джерела; відсутній блок → блок мовою джерела з позначкою «ще не перекладено» | |
| UI-мова | `Locale = 'uk' \| 'en'`, `profile.locale` (нова колонка — **одна міграція БД**, потрібне підтвердження), словник `en` з fallback на `uk` | |
| SEO | локалізовані `slug` (мапа мова → slug), дані для `hreflang`. URL-и `/en/…` — пізніше | |
| Наявні курси | `sourceLanguage` = `language`, `languages: [language]` за замовчуванням; id і поведінка не змінюються | вимога 8 |

### 8.2. Доказ на етапі 1

Перекласти одну тему (`Next.js - 07`) англійською вручну → `i18n:stamp` → збірка → показ з англійським UI →
перевірити, що прогрес спільний (та сама відповідь зараховується в обох мовах) → змінити абзац у джерелі →
`i18n:check` ловить застарілий сегмент. Юніт-тести на сегментацію, хеші, fallback, перевірку коду.

---

## 9. Перевірка прикладів коду

- Кожен приклад TS/TSX з теорії запускається в скретч-застосунку `create-next-app` на **Next.js 16.3.8** під `/tmp`
  (той самий мажор і мінор, що й у репозиторії) з `cacheComponents: true`. Приклад, що не зібрався або поводиться не
  так, як написано, у курс не йде.
- `[!task]`: `pnpm content:check` проганяє еталон (`[!solution]`) через тести і перевіряє, що заготовка тести не
  проходить. Автор задачі доводить і те, і те.
- URL у «📚 Джерела» перевіряються `curl` (PLAYBOOK §7).

---

## 10. Джерела і покриття

| Джерело | Що беремо | Теми |
|---|---|---|
| **Next.js Docs 16.3.8** (`node_modules/next/dist/docs` = nextjs.org/docs) — Getting Started, Guides, API Reference, Architecture, Glossary | факти й API — **першоджерело** | усі |
| Next.js upgrade guides 14 / 15 / 16, codemods | «було → стало» | 48 |
| Next.js blog (релізи 13–16), Next.js Conf | мотивація змін, PPR, Cache Components | 10, 12, 15–18 |
| Next.js Learn, `vercel/next.js` (examples, RFC і discussions про кеш і PPR) | сценарії, проєкти | Start, Projects, 15–18 |
| react.dev — Server Components, Server Functions, directives, `use`, `useActionState`, `useOptimistic`, `useTransition`, `useFormStatus`, Suspense, Activity, React Compiler, Rules of Hooks | модель React | S02–S03, 07–09, 11, 21–24, 38 |
| Dan Abramov / overreacted | ментальна модель RSC | 07–09 |
| Vercel Docs — Functions, Fluid Compute, CDN і кеш, ISR, Runtime Cache, env, Observability, Speed Insights, Web Analytics, Cron, Blob, Firewall, BotID, Rolling Releases | платформа | 17, 25, 36, 42, 44 |
| TypeScript Handbook | типи props, generics, `satisfies` | S04 і код усіх тем |
| Node.js docs | рантайм, streams, env | 19, 39, 43 |
| web.dev — LCP, INP, CLS, рендеринг, зображення, шрифти | продуктивність | 32, 36–38 |
| MDN — HTTP caching, cookies, CORS, CSP, Fetch, Streams, History API | веб-платформа | S01, 04, 17, 19, 26, 30 |
| OWASP Top 10, Cheat Sheets (XSS, CSRF, SSRF, Authn/Authz, Secrets) | безпека | 26–30 |
| WCAG 2.2 | доступність | 35 |
| Google Search Central (SEO, structured data, sitemaps) | SEO | 33, 34 |
| Tailwind CSS v4, shadcn/ui, CSS Modules | стилі | S09, 31 |
| Drizzle, Prisma, Zod, TanStack Query, SWR | дані й валідація | 20, 23 |
| Auth.js, Better Auth, Supabase SSR, Clerk (ідеї) | auth | 26–28 |
| Stripe (вебхуки, test mode) | платежі | P2, P3 |
| Vitest, Testing Library, Playwright, MSW | тести | 40, 41 |
| Sentry, OpenTelemetry | моніторинг | 44 |
| Docker, Turborepo, Flags SDK | інфраструктура | 43, 46, 47 |
| Vercel AI SDK | AI | 49, P5 |
| Lee Robinson, Delba de Oliveira, patterns.dev, Josh W. Comeau, Kent C. Dodds, розбори продакшн-інцидентів | глибина й пастки (ідеї, не тексти) | пастки й «у продакшні» всіх тем |

Тексти пишемо самі українською, без копіювання й дослівного перекладу. Детальні нотатки дослідників —
`docs/nextjs/research/<skill>.md` (етап 1, перед написанням).

---

## 11. План агентів

Лідер (ця сесія): план, брифи, спільні файли (`course.yaml`, цей документ, глосарій, стайлгайд, реєстр id), інтеграція,
рецензія, перевірки, звіт. Субагенти отримують короткі самодостатні брифи з посиланнями на файли-контракти.

| Етап | Пакет | Ролі (паралельно) | Хто чим володіє |
|---|---|---|---|
| 1 | Платформа | **Platform-A** (worktree): навички як дані, вступний тест, шлях, UI (§7). Потім **Platform-B** (worktree): i18n-основа (§8). Послідовно, бо обидва чіпають `compile.ts` і `bundle.ts` | код — у своїх worktree; лідер зливає після рецензії й тестів |
| 1 | Контракт | лідер: стайлгайд, модельна тема 07 з вправами, глосарій, реєстр id, `course.yaml` із заглушками. **Researcher ×4** (по 2–3 навички) → `docs/nextjs/research/*.md` | нотатки — лише в `research/` |
| 1 | Гейт | **Reviewer** (свіжий агент): платформа + модельна тема. **QA**: усі перевірки + браузер | |
| 2 | Start + routing + rendering | 3 пари **Writer + Exercise author** + Kata-автор для задач тем | одна пара = свої файли посібника |
| 3 | data + mutations + auth-security | 3 пари | |
| 4 | ui + performance + testing + deploy-ops + architecture | 4 пари | |
| 5 | Katas + Projects + Interview | 3 автори задач / проєктів + 1 автор співбесід | |
| 6 | Полірування | QA (калібрування вступного тесту на синтетичних профілях), Reviewer (посилання, приклади), лідер (обкладинка, опис) | |

Правила: один власник на файл; нові id не змінюються після публікації; жоден пакет не «готовий» без окремого
рецензента і виправлень автора; лідер повністю читає щонайменше одну тему з пакета; звіти — структуровані (файли,
кількості, перевірені приклади, питання, пропозиції до спільних файлів), без вставок вмісту файлів. Найсильніша модель
— дослідження, написання, рецензія; дешевша — механіка (підрахунки, формат, перевірки).

---

## 12. Ризики

- **Обсяг.** ≈ 520k слів і ≈ 2 000 вправ — це щонайменше 4 контентні етапи. Найбільший ризик — якість і фактична
  точність, а не швидкість. Тому рецензент на кожен пакет і обовʼязковий запуск прикладів.
- **Швидкі зміни API.** Частина API позначена `experimental` або зʼявилась у 16.x. Фіксуємо версію курсу (16.3.8)
  у frontmatter і плануємо огляд на кожен мінор Next.js.
- **Задачі без TS/TSX** знижують «професійність» практики, поки раннер не розширено (§5.3).
- **Vault.** Якщо джерело правди — vault, а пишемо в `content/`, наступний `content:sync` затре роботу. Потрібне
  рішення до етапу 2.
- **Модель навичок для programming-курсу** не відкалібрована на реальних учнях — пороги перевіримо синтетикою, потім
  на даних.

---

## 13. Виправлення за дослідженням (етап 1)

Нотатки дослідження — `docs/nextjs/research/<skill>.md` (кожен факт з посиланням на файл документації 16.3.8). Вони
**мають пріоритет** над таблицями §1–§2 там, де розходяться. Головне:

| Тема | Виправлення |
|---|---|
| 13, 28 | `forbidden()` / `unauthorized()` і їхні файли — **experimental** (`experimental.authInterrupts`) |
| 04, 29, 37 | `staleTimes`, `taint`, `optimizePackageImports` — experimental; також `globalNotFound`, `sri`, `useOffline`, `prefetchInlining` |
| 04, 12, 41 | Activity зберігає стан лише з `cacheComponents: true` (до 3 маршрутів, скидання — `useRouter().bfcacheId`). Instant navigation: segment config `instant`, Navigation Inspector, `@next/playwright` `instant()` — пояснюємо в 12, тестуємо в 41 |
| 16 | `updateTag()` і `refresh()` (з `next/cache`) — **лише в Server Actions**; вебхуки — `revalidateTag(tag, { expire: 0 })`; одноаргументний `revalidateTag` — deprecated |
| 10 | `io()` (`next/cache`, 16.3) — документація радить його замість `connection()`: не блокує prefetch |
| 03, 12, 30 | Несумісне з Cache Components: edge runtime (deprecated), `dynamicParams`, порожній `generateStaticParams` (помилка збірки); CSP з nonce вимикає PPR/ISR |
| 18 | Два ключі: `cacheHandler` (ISR, route handlers, зображення) і `cacheHandlers` (`use cache`). `use cache: private` нічого не зберігає на сервері — лише дедуплікація в запиті й кеш у браузері |
| 21 | Дії одного клієнта виконуються **послідовно** (`Promise.all` не паралелить); одна відповідь = результат + новий UI; id дій живуть ≤ 14 днів; кілька інстансів — `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` |
| 32 | `priority` deprecated → `preload` / `loading="eager"` / `fetchPriority="high"`; у 16: `qualities` = `[75]`, `minimumCacheTTL` 4 год, без 16 в `imageSizes`, локальні IP заблоковано, ≤ 3 редиректи |
| 40 | Async Server Components не тестуються у Vitest/Jest (так у документації) — e2e; є `next/experimental/testing/server` (`unstable_doesMiddlewareMatch` (на 16.3.8 саме так; у чистому Node потребує `globalThis.AsyncLocalStorage`), `unstable_getResponseFromNextConfig`) — добре для задач. `next lint` прибрано в 16 |
| 43 | `adapterPath` стабільний з 16.2 (перевірені адаптери Vercel, Bun); `deploymentId`, `supportsImmutableAssets` (16.3) |
| 48 | codemod `upgrade` не запускає `next-async-request-api` — окремий крок; `unstable_cache` документація досі радить для кешу між деплоями — подаємо чесно, не лише як «старе» |
| 49 | Приклад AI в документації застарів (`StreamingTextResponse`) — беремо ai-sdk.dev; + підтема «AI-агенти для розробки»: `AGENTS.md`, `next-devtools-mcp` |
| 07 | Спостереження автора на 16.3.8 (перевіряє рецензент): непублічна env-змінна, прочитана в Client Component, потрапляє в серверний HTML; повний обʼєкт з БД у props потрапляє в RSC payload з усіма полями |

Не звірено з бандлом (звіряти з першоджерелами під час написання): деталі Vercel-платформи (Fluid, Rolling Releases,
Firewall, BotID, Cron, Blob, ліміти), Tailwind v4, shadcn, Turborepo, Flags SDK, AI SDK, MSW, Sentry, Playwright,
OWASP, пороги CWV (вчимо INP, не FID), типовий `display` у `next/font`.
