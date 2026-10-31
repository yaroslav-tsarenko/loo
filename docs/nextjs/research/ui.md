# Research: `ui` — UI, SEO і доступність (теми 31–35)

> Шляхи — відносно `node_modules/next/dist/docs/01-app/` (Next.js **16.3.8**). URL = `https://nextjs.org/docs/app/` +
> шлях без числових префіксів. `(не звірено з docs 16.3.8)` — не знайдено в бандлі.

## 1. Карта понять за темами

### 31 — Стилізація
1. Глобальні стилі — імпорт у root layout; CSS Modules (`*.module.css`) — локальні класи; порядок CSS визначається порядком імпортів.
2. **Tailwind CSS v4** — у дефолтах `create-next-app` (`--yes`: TypeScript, Tailwind, ESLint, App Router, Turbopack, alias `@/*`, `AGENTS.md`) — `03-api-reference/06-cli/create-next-app.md`, `01-getting-started/01-installation.md`. Конфіг v4 — CSS-first (`@import "tailwindcss"`, `@theme`) через `@tailwindcss/postcss` `(деталі v4 — tailwindcss.com, не звірено з docs 16.3.8)`. Для v3 є окремий гайд `02-guides/tailwind-v3-css.md`.
3. Sass: `sass` пакет, `sassOptions`; з 16 `sass-loader` v16 (modern API); Turbopack не підтримує `~` у `@import` з `node_modules`.
4. CSS-in-JS з RSC (`02-guides/css-in-js.md`): працюють лише бібліотеки з підтримкою streaming/RSC; стилі — тільки в Client Components; потрібен style registry з `useServerInsertedHTML`.
5. shadcn/ui: копіювання компонентів у проєкт, Radix/Base UI примітиви, Client Components з `'use client'` `(не звірено з docs 16.3.8)`.
6. Performance-флаги: `experimental.inlineCss` (style замість link), `experimental.cssChunking`, `experimental.useLightningcss`.
7. Під Activity: глобальні стилі прихованої сторінки продовжують діяти — вимикати через `media` (`02-guides/preserving-ui-state.md`).

### 32 — `next/image` і `next/font`
1. `<Image>`: обов'язкові `src`, `alt`, розміри (`width/height` або `fill`); автоматичні `srcset`, lazy за замовчуванням, формати (WebP/AVIF через `images.formats`).
2. `sizes` — критичний для `fill`/адаптивних: без нього браузер візьме ширину viewport → зайві байти.
3. **16.0:** `priority` **deprecated** → `preload` (вставляє `<link rel="preload">` у `<head>`); docs: «у більшості випадків — `loading="eager"` або `fetchPriority="high"` замість `preload`».
4. Breaking defaults 16.0: `images.qualities = [75]` (інше значення `quality` приводиться до найближчого), `minimumCacheTTL` 60 с → 4 год (14400), з `imageSizes` прибрано 16, `maximumRedirects = 3`, блок локальних IP (`dangerouslyAllowLocalIP`), локальні src з query потребують `localPatterns.search`.
5. `images.domains` deprecated → `remotePatterns` (з 15.3 можна масив `URL`). `next/legacy/image` deprecated.
6. Нові опції кешу оптимізатора: `maximumResponseBody` (16.1.2), `maximumDiskCacheSize` (16.1.7); `cacheHandler` для image cache (16.2).
7. `next/font/google` і `next/font/local`: self-hosting шрифтів на build (жодних запитів до Google з браузера), `size-adjust` fallback → нуль CLS; `subsets`, `variable` (CSS-змінна для Tailwind), `display`, `preload`, `weight`/`style`; variable fonts рекомендовані.
8. Self-hosting: оптимізація зображень потребує `sharp` (на glibc — налаштування аллокатора пам'яті) — `02-guides/self-hosting.md`.

### 33 — Metadata і SEO
1. `export const metadata` або `export async function generateMetadata({ params, searchParams }, parent)` — **тільки Server Components**.
2. `fetch` у `generateMetadata` мемоізується з page/layout; для ORM — `React.cache`.
3. **Streaming metadata** (з 15.2): UI віддається, не чекаючи `generateMetadata`; для ботів з обмеженим HTML — блокуюча (`htmlLimitedBots`).
4. З Cache Components: runtime-дані в `generateMetadata` → помилка; рішення — `use cache` або «dynamic marker» компонент у Suspense.
5. `metadataBase` — відносні URL для OG/canonical; `alternates.canonical`, `alternates.languages` → `hreflang`.
6. `generateViewport` / `viewport` окремо від metadata (`themeColor`, `colorScheme`).
7. Файлові конвенції: `favicon.ico`, `icon`, `apple-icon`, `opengraph-image`, `twitter-image` (статичні або згенеровані `.tsx`), `sitemap.ts`, `robots.ts`, `manifest.ts`.
8. OG-зображення: `ImageResponse` з `next/og` (Satori + Resvg → PNG; flexbox, абсолютне позиціонування, кастомні шрифти; не весь CSS). З 16 — `params` і `id` у функції зображення — **Promise**.
9. `generateSitemaps` для >50k URL; з 16 `id` у `sitemap({ id })` — Promise<string>.
10. `robots.ts`: з 16.3 поле `other` для нестандартних директив (передається дослівно).
11. JSON-LD: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />` — екранування `<` проти XSS (`02-guides/json-ld.md`).

### 34 — Інтернаціоналізація маршрутів
1. Визначення локалі: `Accept-Language` + `@formatjs/intl-localematcher` + `negotiator` → redirect у Proxy на `/{lang}/...`; або домени.
2. Усі спецфайли під `app/[lang]/`; root layout може бути `app/[lang]/layout.tsx` (`<html lang={lang}>`).
3. Словники — server-only модулі з динамічним `import()` за локаллю; переклади не потрапляють у клієнтський бандл.
4. **`next/root-params`** (16.3): `import { lang } from 'next/root-params'` у будь-якій серверній утиліті (`getDictionary()` без аргументів); ключ `use cache` включає лише прочитані root params; не працює в Client Components, Server Actions, Route Handlers.
5. Статика: `generateStaticParams` у root layout → `[{ lang: 'en' }, { lang: 'uk' }]` (з CC обов'язково ≥1).
6. Валідація локалі → `notFound()` для невідомих.
7. `hreflang` через `alternates.languages`; `x-default`.
8. Бібліотеки: next-intl, next-international, next-i18n-router, paraglide-next (зі списку docs).
9. Пастка: читати `lang` з cookie в root layout робить усе дерево динамічним; сегмент `[lang]` + root params — статичний.

### 35 — Доступність, View Transitions, `next/script`, MDX
1. Вбудоване a11y: route announcer для клієнтських навігацій, `eslint-plugin-jsx-a11y` у `eslint-config-next` (`03-architecture/accessibility.md`).
2. WCAG 2.2 AA: фокус після навігації, видимий фокус, контраст, `alt`, ARIA лише коли потрібно, мінімальний розмір цілей (2.5.8) `(не звірено з docs 16.3.8)`.
3. **View Transitions**: `import { ViewTransition } from 'react'` — працює в App Router **без конфігурації** (React canary вбудований); патерни: shared element morph (`name`), Suspense reveal, напрямок навігації через `<Link transitionTypes={['nav-forward']}>` (16.2) і `router.push(url, { transitionTypes })`, crossfade в межах маршруту; `prefers-reduced-motion`.
4. `next/script` `strategy`: `beforeInteractive` (у початковому HTML, до гідратації; лише в root layout), `afterInteractive` (default), `lazyOnload` (idle), `worker` (experimental, Partytown). `onLoad`/`onReady`/`onError` лише в Client Components.
5. Сторонні: `@next/third-parties` (Google Tag Manager, Analytics, Maps, YouTube) — `02-guides/third-party-libraries.md`.
6. MDX: `@next/mdx` + **обов'язковий** `mdx-components.tsx` у корені; `pageExtensions`; remark/rehype плагіни; `experimental.mdxRs` (Rust-компілятор); віддалений MDX — `next-mdx-remote` (security: виконання коду).
7. `preventing-flash-before-hydration` — тема/дата через inline-скрипт у `<head>` до paint.

## 2. Поточні API-факти (16.3.8)

| Факт | Доказ |
|---|---|
| `create-next-app` дефолт: TS, Tailwind, ESLint, App Router, Turbopack, `@/*`, AGENTS.md | `01-getting-started/01-installation.md` |
| `<Image preload>` (16.0), `priority` deprecated | `03-api-reference/02-components/image.md#preload`, `#priority` |
| `qualities` default `[75]`, `minimumCacheTTL` 14400, `imageSizes` без 16, `maximumRedirects` 3, `dangerouslyAllowLocalIP`, `localPatterns.search` | `02-guides/upgrading/version-16.md#nextimage-changes` |
| `maximumResponseBody` (16.1.2), `maximumDiskCacheSize` (16.1.7) | `image.md#version-history` |
| `cacheHandler` використовується для optimized images (16.2) | `05-config/01-next-config-js/incrementalCacheHandlerPath.md` |
| `next/font` `display`: `'auto' \| 'block' \| 'swap' \| 'fallback' \| 'optional'` (default — `'swap'` `(не звірено з docs 16.3.8)`) | `02-components/font.md#display` |
| `metadata`/`generateMetadata` лише Server Components; memoized fetch | `04-functions/generate-metadata.md` |
| Streaming metadata + `htmlLimitedBots` | `generate-metadata.md#streaming-metadata`, `05-config/.../htmlLimitedBots.md` |
| `generateMetadata` з CC: dynamic marker у Suspense | `generate-metadata.md` (with Cache Components) |
| OG/icon `params` і `id` — Promise (16.0); `generateImageMetadata` params — синхронні | `version-16.md#async-parameters-for-icon-and-open-graph-image-breaking-change` |
| `sitemap({ id })` — `id: Promise<string>` (16.0) | `version-16.md#async-id-parameter-for-sitemap-breaking-change` |
| `robots` поле `other` (16.3) | `03-file-conventions/01-metadata/robots.md` |
| `ImageResponse` (`next/og`) = @vercel/og + Satori + Resvg | `04-functions/image-response.md` |
| JSON-LD екранування `<` → `<` | `02-guides/json-ld.md` |
| i18n з `next/root-params` | `02-guides/internationalization.md#sharing-the-locale-across-your-app` |
| `ViewTransition` з `react`, без конфігу; `Link transitionTypes` (16.2) | `02-guides/view-transitions.md`, `02-components/link.md` |
| `Script` strategies: `beforeInteractive`, `afterInteractive` (default), `lazyOnload`, `worker` (experimental) | `02-components/script.md` |
| `mdx-components.tsx` обов'язковий для `@next/mdx` в App Router | `02-guides/mdx.md` |
| `experimental.inlineCss`, `cssChunking`, `useLightningcss` — experimental | відповідні файли в `05-config/01-next-config-js/` |
| `sass-loader` v16, Turbopack без `~` | `version-16.md#modern-sass-api`, `#sass-node_modules-imports` |

## 3. Було → стало
| До | Зараз |
|---|---|
| `next/head` (Pages) | `metadata` / `generateMetadata` |
| `<Image priority>` | `<Image preload>` або `loading="eager"`/`fetchPriority="high"` |
| `images.domains` | `images.remotePatterns` |
| `next/legacy/image` | deprecated |
| `ImageResponse` з `next/server` | `next/og` (14) |
| `@next/font` | `next/font` (14) |
| `quality` будь-який | лише з `images.qualities` (default `[75]`) |
| Блокуюча metadata | streaming metadata (15.2), блокуюча для ботів |
| OG `params` об'єкт | Promise (16) |
| Locale через `params` prop drilling | `next/root-params` (16.3) |
| View Transitions — бібліотеки/експерименти | React `<ViewTransition>` (canary у App Router) + `transitionTypes` |
| Tailwind v3 `tailwind.config.js` | v4 CSS-first (окремий гайд для v3) |

## 4. Пастки і продакшн-проблеми
- **LCP-зображення з lazy** — пізнє завантаження; треба `preload`/`fetchPriority="high"`, але не на кількох кандидатах.
- **`fill` без `sizes`** — завантажується зображення шириною viewport на мобільному.
- **`quality={90}` після апгрейду на 16** — тихо стає 75; оптимізатор кешує 4 год — «зображення не оновлюється».
- **Зображення з внутрішнього хосту (VPC)** → 400 після 16 (блок локальних IP).
- **Витрати на оптимізацію** на Vercel/self-host: багато розмірів × форматів; кеш `minimumCacheTTL`.
- **CLS від шрифтів** без `next/font`; від fallback-ів Suspense без розмірів.
- **CSS-in-JS у Server Component** — не працює; runtime CSS-in-JS збільшує JS.
- **`generateMetadata` з повільним API** блокує ботів (htmlLimitedBots); під CC — build error без кешу.
- **JSON-LD без екранування** — XSS через дані CMS.
- **Canonical/hreflang без `metadataBase`** — відносні URL або localhost у проді.
- **Локаль з cookie в root layout** — усе дерево динамічне.
- **`beforeInteractive` поза root layout** — не працює як очікується; сторонні скрипти — головне джерело INP-проблем.
- **MDX з недовіреного джерела** — виконання довільного коду.
- **View Transitions без reduced-motion** — a11y-порушення; анімація «замерзлого» header — давати `viewTransitionName` і вимикати анімацію.

## 5. Interview angles
1. **Як `next/image` зменшує байти й CLS?** srcset/sizes, формати, lazy, розміри/aspect-ratio; що змінилось у 16 (`preload`, `qualities`, TTL).
2. **Чому `next/font` дає нуль CLS і кращу приватність?** Self-hosting на build, `size-adjust` fallback, без запитів до Google.
3. **`metadata` vs `generateMetadata` і streaming metadata.** Server-only, memoization, боти.
4. **Як зробити динамічне OG-зображення?** `opengraph-image.tsx` + `ImageResponse`; обмеження Satori; async params у 16.
5. **Багатомовний сайт без зайвого динамічного рендеру.** `[lang]` + `generateStaticParams` + root params, Proxy-redirect за `Accept-Language`, hreflang.
6. **CSS-in-JS і RSC — у чому проблема?** Runtime-інжекція стилів, потреба в клієнтському контексті, registry.
7. **Як Next.js допомагає з a11y?** Route announcer, lint-правила; що лишається на розробнику (фокус, контраст, семантика).
8. **`next/script` стратегії й вплив на INP/LCP.**
9. **View Transitions у Next 16.** React `ViewTransition`, `transitionTypes`, reduced motion.
10. **Sitemap для 1M URL.** `generateSitemaps`, async `id` у 16, ліміт 50k на файл.

## 6. Що може перевірити раннер
1. **`generateMetadata` як чиста функція**: з даних посту → об'єкт metadata (title template, OG, canonical через `metadataBase`, `alternates.languages`).
2. **Sitemap-генератор**: масив сторінок → `MetadataRoute.Sitemap` (url, lastModified, changeFrequency, priority, `alternates.languages`); розбиття на чанки по 50 000 (`generateSitemaps`).
3. **`robots()`**: правила для різних `userAgent`, `disallow` приватних шляхів, `sitemap`.
4. **JSON-LD серіалізатор**: `toJsonLdScript(obj)` з екрануванням `<` — тест на `</script>` у даних.
5. **`sizes`-калькулятор**: з брейкпоінтів і ширин колонок → рядок `sizes`; тест для grid.
6. **Модель `qualities`**: `coerceQuality(q, qualities)` → найближче значення (80 → 75 при `[50,75,100]`).
7. **Locale matcher**: `pickLocale(acceptLanguage, locales, default)` (q-ваги, `en-US` → `en`).
8. **Proxy i18n**: шлях без префікса → redirect на `/{locale}{path}`; з префіксом → `next`.
9. **`remotePatterns` матчер** (`*`, `**` у hostname/pathname).
10. **Контраст WCAG**: обчислити contrast ratio двох кольорів і перевірити AA (4.5:1 / 3:1).

## 7. Джерела
- https://nextjs.org/docs/app/getting-started/css · …/images · …/fonts · …/metadata-and-og-images
- https://nextjs.org/docs/app/api-reference/components/image · …/font · …/script · …/link
- https://nextjs.org/docs/app/api-reference/config/next-config-js/images · …/htmlLimitedBots · …/inlineCss · …/cssChunking
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata · …/generate-viewport · …/image-response · …/generate-sitemaps · …/generate-image-metadata · …/next-root-params
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image · …/sitemap · …/robots · …/app-icons · …/manifest · https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components
- https://nextjs.org/docs/app/guides/internationalization · …/json-ld · …/view-transitions · …/mdx · …/css-in-js · …/sass · …/tailwind-v3-css · …/scripts · …/third-party-libraries · …/preventing-flash-before-hydration
- https://nextjs.org/docs/architecture/accessibility
- https://react.dev/reference/react/ViewTransition · https://developer.mozilla.org/docs/Web/API/View_Transition_API
- https://tailwindcss.com/docs/installation/framework-guides/nextjs · https://ui.shadcn.com/docs `(не звірено з docs 16.3.8)`
- https://web.dev/articles/optimize-lcp · https://web.dev/articles/cls · https://web.dev/articles/font-best-practices
- https://www.w3.org/TR/WCAG22/ · https://developers.google.com/search/docs/appearance/structured-data · https://developers.google.com/search/docs/specialty/international/localized-versions

## 8. Виправлення до SYLLABUS
1. **Тема 32:** замінити «пріоритет» на `preload` (16: `priority` deprecated) і додати breaking defaults 16 (`qualities`, `minimumCacheTTL`, `imageSizes`, локальні IP, редиректи).
2. **Тема 33:** додати async `params`/`id` в OG/icon/sitemap (16), streaming metadata + `htmlLimitedBots`, поведінку `generateMetadata` під CC, `robots.other` (16.3).
3. **Тема 34:** root params — ок; додати, що вони **не** працюють у Server Actions і Route Handlers, і що це рекомендований офіційним гайдом спосіб i18n.
4. **Тема 35:** View Transitions не потребують флагу в 16.3.8; додати `transitionTypes` (Link/router). `next/script` `worker` — experimental. MDX — `mdx-components.tsx` обов'язковий.
5. **Тема 31:** Tailwind v4 — дефолт `create-next-app`; є окремий гайд для v3 (міграційна примітка). Додати Activity-пастку з глобальними стилями.
