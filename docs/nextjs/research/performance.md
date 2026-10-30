# Research: `performance` — Продуктивність (теми 36–39)

> Шляхи — відносно `node_modules/next/dist/docs/01-app/` (Next.js **16.3.8**). URL = `https://nextjs.org/docs/app/` +
> шлях без числових префіксів. `(не звірено з docs 16.3.8)` — не знайдено в бандлі (пороги CWV, Vercel-продукти).

## 1. Карта понять за темами

### 36 — Core Web Vitals
1. Метрики: **LCP** (≤2.5 с good), **INP** (≤200 мс), **CLS** (≤0.1); допоміжні TTFB, FCP; оцінка по 75-му перцентилю польових даних `(пороги — web.dev, не звірено з docs 16.3.8)`.
2. Лабораторні (Lighthouse) vs польові (CrUX, RUM: Vercel Speed Insights, `useReportWebVitals`).
3. `useReportWebVitals` з `next/web-vitals` — Client Component; метрика `{ id, name, delta, entries, navigationType, rating, value }`; відправка `navigator.sendBeacon`.
4. `experimental.webVitalsAttribution: ['CLS', 'LCP']` — attribution (який елемент), вимкнено за замовчуванням.
5. Альтернатива: `instrumentation-client.ts` для ранньої ініціалізації аналітики (до гідратації).
6. **LCP у Next:** LCP-елемент у static shell (PPR) замість динамічної дірки; `next/image` `preload`/`fetchPriority`; `next/font`; TTFB через кешування й CDN; стрімінг дає ранній FCP.
7. **INP:** менше клієнтського JS і гідратації; `useTransition` для важких оновлень; сторонні скрипти (`lazyOnload`/`worker`); великі списки — віртуалізація.
8. **CLS:** розміри зображень, `next/font` fallback, Suspense fallback з тими самими розмірами, без вставки банерів над контентом.
9. Стрімінг і Web Vitals: розділ `02-guides/streaming.md#streaming-and-web-vitals` (TTFB/FCP, LCP, CLS, INP, early resource discovery).
10. **З 16.0 `next build` більше не показує `size` і `First Load JS`** — docs радять Lighthouse/Vercel Analytics.

### 37 — Бандл
1. Звідки клієнтський JS: модулі з `'use client'` і **все, що вони імпортують**; провайдери на верху дерева; великі бібліотеки (дати, графіки, редактори, іконки).
2. **Turbopack Bundle Analyzer** (experimental): `next experimental-analyze` (16.1) — інтерактивно (порт 4000) або `-o` у `.next/diagnostics/analyze`; фільтри, import chains. Для Webpack — `@next/bundle-analyzer`.
3. `experimental.optimizePackageImports: ['lib']` — завантажувати лише використані модулі з barrel-файлів; частина бібліотек оптимізується автоматично (список у `optimizePackageImports.md`).
4. `next/dynamic(() => import(...), { ssr: false, loading })` — lazy Client Components; `ssr: false` **лише в Client Components**; при динамічному імпорті Client Component із Server Component автоматичний code splitting **не** підтримується.
5. Server Components автоматично code-split; React.lazy + Suspense.
6. У App Router пакети, імпортовані в Server Components і Route Handlers, **автоматично бандляться**; `serverExternalPackages` — винятки (нативні модулі, Node-специфічні пакети); `transpilePackages` — монорепо-пакети без пребілду (`02-guides/package-bundling.md#opting-specific-packages-out-of-bundling`). Твердження «за замовчуванням не бандляться» стосується лише Pages Router.
7. Magic comments: `webpackIgnore`/`turbopackIgnore`, `turbopackOptional`.
8. Сторонні скрипти — `next/script` стратегії, `@next/third-parties`.
9. Перенесення важких залежностей у Server Components (markdown, підсвітка синтаксису, форматування дат) — головний важіль зменшення JS.

### 38 — React Compiler і рендер
1. `reactCompiler: true` — **стабільний** (top-level) з 16.0, **не увімкнений за замовчуванням**; потрібен `babel-plugin-react-compiler`; збільшує час компіляції (Babel).
2. `compilationMode: 'annotation'` + директива `'use memo'` для opt-in; `'use no memo'` — opt-out.
3. **16.3:** `experimental.turbopackRustReactCompiler` — нативна Rust-версія компілятора в Turbopack (швидше).
4. Компілятор автоматично мемоізує компоненти й хуки → `useMemo`/`useCallback`/`memo` у більшості випадків зайві; але вимагає дотримання Rules of React (чисті рендери, незмінні props/state).
5. Профілювання: React DevTools Profiler; `next build --profile` — production-профілювання React; `--experimental-cpu-prof` для `dev`/`build`/`start` (профілі в `.next-profiles/`).
6. Activity (з CC): приховані сторінки тримають DOM і стан — пам'ять браузера vs швидкість повернення (до 3 маршрутів).
7. `useEffectEvent` (React 19.2) — для нереактивної логіки ефектів.

### 39 — Пам'ять, білд і Turbopack
1. Turbopack — **дефолтний бандлер** для `next dev` і `next build` з 16.0; `--webpack` для відмови; кастомний `webpack` конфіг + `next build` без прапорця → **build fails**.
2. `turbopack` конфіг top-level (не `experimental.turbopack`): `rules` (loaders), `resolveAlias` (замість `resolve.fallback`), `debugIds` тощо.
3. **FileSystem cache**: `experimental.turbopackFileSystemCacheForDev` (default true з 16.1) і `…ForBuild` (default true з 16.3); `.next/dev/cache/turbopack`.
4. `experimental.turbopackMemoryEviction` (16.3): `false` / `'auto'` (default) / `'full'` (вивантажувати все після кожного запису на диск) — вивантаження з пам'яті після снапшоту на диск.
5. `next dev` пише в `.next/dev` — dev і build можуть працювати одночасно; lockfile проти кількох інстансів.
6. Трасування: `next internal trace .next-profiles/trace-turbopack.bin`.
7. Пам'ять збірки (`02-guides/memory-usage.md`): менше залежностей, `experimental.webpackMemoryOptimizations`, `next build --experimental-debug-memory-usage`, heap profile (`--heap-prof`), heap snapshot, вимкнути source maps/static analysis.
8. Пам'ять сервера: in-memory кеш `use cache`/ISR (`cacheMaxMemorySize`), глобальні змінні модулів, витоки через замикання/таймери/слухачі, `sharp` на glibc.
9. CI build cache: кешувати `.next/cache` (інструкції для GitHub Actions, GitLab, CircleCI… у `02-guides/ci-build-caching.md`).
10. `next build --debug-build-paths=<patterns>` — збирати тільки вибрані маршрути; `--experimental-build-mode compile|generate`.

## 2. Поточні API-факти (16.3.8)

| Факт | Доказ |
|---|---|
| `useReportWebVitals` з `next/web-vitals`; поля метрики | `03-api-reference/04-functions/use-report-web-vitals.md` |
| `experimental.webVitalsAttribution` (вимкнено за замовчуванням) | `05-config/01-next-config-js/webVitalsAttribution.md` |
| `next build` без `size`/`First Load JS` з 16.0 | `02-guides/upgrading/version-16.md#performance-improvements`, `06-cli/next.md` |
| `next experimental-analyze` (16.1), `-o` → `.next/diagnostics/analyze`, порт 4000 | `03-api-reference/06-cli/next.md`, `02-guides/package-bundling.md` |
| `experimental.optimizePackageImports` (doc `version: experimental`) | `05-config/01-next-config-js/optimizePackageImports.md` |
| `next/dynamic` `ssr: false` лише в Client Components | `02-guides/lazy-loading.md` |
| `reactCompiler` stable у 16, не за замовчуванням; `compilationMode: 'annotation'`, `'use memo'`, `'use no memo'` | `05-config/01-next-config-js/reactCompiler.md`, `version-16.md#react-compiler-support` |
| `experimental.turbopackRustReactCompiler` (16.3) | `05-config/01-next-config-js/turbopackRustReactCompiler.md` |
| Turbopack за замовчуванням; `--webpack`; build fails з кастомним webpack | `version-16.md#turbopack-by-default`, `08-turbopack.md` |
| `turbopackFileSystemCacheForDev` (16.1 default) / `ForBuild` (16.3 default) | `05-config/01-next-config-js/turbopackFileSystemCache.md` |
| `experimental.turbopackMemoryEviction`: `false \| 'auto' (default) \| 'full'` | `05-config/01-next-config-js/turbopackMemoryEviction.md` |
| `turbopack.ignoreIssue` (16.2) | `05-config/01-next-config-js/turbopackIgnoreIssue.md` |
| `experimental.turbopackLocalPostcssConfig` (16.3) — пошук `postcss.config.js` від директорії CSS-файлу | `05-config/01-next-config-js/turbopackLocalPostcssConfig.md` |
| CLI: `--experimental-cpu-prof`, `--profile`, `--debug-prerender`, `--debug-build-paths` | `06-cli/next.md` |
| `next dev` → `.next/dev`; concurrent dev/build | `version-16.md#concurrent-dev-and-build` |
| Memory guide: `webpackMemoryOptimizations`, `--experimental-debug-memory-usage` | `02-guides/memory-usage.md` |
| Streaming і Web Vitals | `02-guides/streaming.md#streaming-and-web-vitals` |
| `experimental.inlineCss`, `cssChunking` | `05-config/01-next-config-js/inlineCss.md`, `cssChunking.md` |

## 3. Було → стало
| До | Зараз |
|---|---|
| Webpack за замовчуванням, `--turbo` | Turbopack за замовчуванням (16), `--webpack` |
| `experimental.turbopack` | top-level `turbopack` |
| `experimental.reactCompiler` | `reactCompiler` (stable, opt-in) |
| `First Load JS` у виводі build як метрика | прибрано (16); міряти Lighthouse/RUM/analyzer |
| `@next/bundle-analyzer` | `next experimental-analyze` для Turbopack (Webpack — як було) |
| FID | INP (Google замінив FID на INP у березні 2024) `(не звірено з docs 16.3.8 — docs ще перелічують FID)` |
| `priority` на LCP-зображенні | `preload` / `fetchPriority="high"` |
| Ручний `useMemo`/`useCallback` | React Compiler (коли увімкнено) |

## 4. Пастки і продакшн-проблеми
- **Barrel-імпорти іконок/утиліт** — тисячі модулів у dev і бандлі (рішення: `optimizePackageImports`, прямі імпорти).
- **`'use client'` на провайдері в root layout**, який імпортує важку бібліотеку — у бандлі кожної сторінки.
- **`dynamic(..., { ssr: false })` у Server Component** — помилка/не працює.
- **LCP-елемент у динамічній дірці** PPR або за клієнтським фетчем.
- **Сторонні скрипти (чат, аналітика, A/B) з `afterInteractive`** — головна причина поганого INP.
- **Гідратація величезного дерева** (таблиці на тисячі рядків як Client Components).
- **Довіра до lab-метрик** без польових даних (RUM).
- **React Compiler + код, що порушує Rules of React** (мутація props, читання ref у рендері) — тонкі баги; вмикати поступово (`annotation`).
- **Кастомний `webpack` у плагіні** (напр. старі Sentry/MDX плагіни) — build fails після апгрейду на 16.
- **OOM при `next build` у CI** — великі графи, source maps; кеш `.next/cache` не збережено між запусками.
- **Витік пам'яті сервера** — необмежений in-memory кеш, глобальні Map без eviction, підписки в модулях.
- **Activity** тримає 3 сторінки з важкими DOM (відео, карти) — пам'ять мобільного браузера.

## 5. Interview angles
1. **Як діагностувати поганий LCP на Next-сторінці?** Знайти LCP-елемент (attribution), TTFB vs resource load vs render delay; shell, `preload`, `next/font`, CDN.
2. **INP — що це й що в Next його погіршує?** Гідратація, довгі задачі, сторонні скрипти; `useTransition`, менше JS, Server Components.
3. **Звідки взявся цей мегабайт JS?** Analyzer, межа `'use client'`, транзитивні імпорти, barrel-файли.
4. **`next/dynamic` vs `React.lazy` vs Server Components.**
5. **Чи потрібні `useMemo`/`useCallback` з React Compiler?** Здебільшого ні; коли все ж потрібні; annotation mode.
6. **Чому `First Load JS` прибрали з білду?** Неточність у RSC-архітектурі.
7. **Turbopack: що змінилось у 16 і що ламається при міграції?** Дефолт, webpack-конфіг, `resolveAlias`, `~` у Sass, FS cache.
8. **Як шукати витік пам'яті в Node-процесі Next?** Heap snapshots, `--inspect`, порівняння знімків, типові джерела.
9. **Як пришвидшити CI-збірку?** `.next/cache`, Turbopack FS cache, `--debug-build-paths` для локальної діагностики, remote caching Turborepo.
10. **Стрімінг і CWV.** TTFB/FCP вигравають, CLS ризикує, LCP залежить від shell.

## 6. Що може перевірити раннер
1. **Рейтинг метрики**: `rate(name, value)` → `good | needs-improvement | poor` за порогами web.dev (LCP 2500/4000, INP 200/500, CLS 0.1/0.25).
2. **p75 агрегатор**: з масиву вимірів (RUM) обчислити 75-й перцентиль і рейтинг сторінки.
3. **Debounce/throttle** для обробника введення (INP) з fake timers.
4. **Чанкінг довгої задачі**: розбити обробку 10k елементів на шматки з `setTimeout(0)`/yield; тест на кількість «кадрів».
5. **Аналіз графу імпортів**: за картою модулів (з позначками `'use client'` і розмірами) порахувати клієнтський бандл і знайти «найдорожчий» імпорт.
6. **Barrel-оптимізатор**: перетворити `import { a, b } from 'lib'` у прямі шляхи за мапою експортів.
7. **Мемоізація**: реалізувати `memoizeOne`/LRU з тестом на кількість викликів (модель того, що робить компілятор/`React.cache`).
8. **Виявлення витоку**: модель кешу без eviction — тест падає, коли розмір росте понад ліміт; додати LRU з `maxSize`.
9. **`sizes`/srcset вибір**: яку ширину з `deviceSizes` вибере браузер для заданого viewport і DPR.
10. **Модель Activity LRU** (до 3 маршрутів) — оцінка пам'яті.

## 7. Джерела
- https://nextjs.org/docs/app/guides/production-checklist · …/analytics · …/package-bundling · …/lazy-loading · …/memory-usage · …/ci-build-caching · …/local-development · …/streaming
- https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals
- https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler · …/turbopackRustReactCompiler · …/optimizePackageImports · …/webVitalsAttribution · …/turbopack · …/turbopackFileSystemCache · …/turbopackMemoryEviction · …/serverExternalPackages · …/transpilePackages
- https://nextjs.org/docs/app/api-reference/turbopack · https://nextjs.org/docs/app/api-reference/cli/next
- https://react.dev/learn/react-compiler · https://react.dev/reference/react/Profiler · https://react.dev/reference/rules
- https://web.dev/articles/vitals · https://web.dev/articles/lcp · https://web.dev/articles/inp · https://web.dev/articles/cls · https://web.dev/blog/inp-cwv-march-12
- https://vercel.com/docs/speed-insights `(не звірено з docs 16.3.8)`
- https://nodejs.org/en/learn/diagnostics/memory

## 8. Виправлення до SYLLABUS
1. **Тема 37:** `optimizePackageImports` — **experimental** (`experimental.optimizePackageImports`); додати `next experimental-analyze` (Turbopack analyzer) як основний інструмент; `@next/bundle-analyzer` — лише для Webpack.
2. **Тема 36/37:** зафіксувати, що з 16.0 `next build` не показує `First Load JS` — вправи «прочитай вивід білду» неактуальні.
3. **Тема 38:** `reactCompiler` stable, але **не за замовчуванням**; додати `turbopackRustReactCompiler` (16.3, experimental) і annotation mode.
4. **Тема 39:** додати Turbopack-за-замовчуванням як breaking change (webpack-конфіг ламає build), FS cache для build (16.3 default), `turbopackMemoryEviction`, `.next/dev`.
5. **Тема 36:** docs ще згадують FID у переліку — у курсі вчити INP як актуальну метрику.
6. **§1 `performance`:** додати Activity як компроміс пам'яті й `--experimental-cpu-prof`/`--profile`.
