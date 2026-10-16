# Next.js App Router — Повний гайд (UA)

> На основі офіційної документації Next.js 16.2.6
> 61 розділ українською мовою

## Основи

1. [[Next.js - 01. Встановлення]] — CLI, ручне встановлення, TypeScript, ESLint
2. [[Next.js - 02. Структура проєкту]] — папки, файли, конвенції маршрутизації
3. [[Next.js - 03. Layouts та сторінки]] — сторінки, layouts, динамічні сегменти, Link

## Навігація та рендеринг

4. [[Next.js - 04. Навігація та посилання]] — prefetching, streaming, клієнтські переходи
5. [[Next.js - 05. Серверні та клієнтські компоненти]] — `use client`, RSC, гідратація
6. [[Next.js - 59. Prefetching]] — автоматичний, ручний, hover-triggered, оптимізації
7. [[Next.js - 55. Паралельні маршрути]] — слоти, @folder, умовні маршрути, модалки
8. [[Next.js - 56. Перехоплення маршрутів]] — (..) конвенція, модалки з deep linking

## Робота з даними

9. [[Next.js - 06. Отримання даних]] — fetch, ORM, streaming, Suspense
10. [[Next.js - 41. Отримання даних]] — поглиблено: паралельне, послідовне, контекст
11. [[Next.js - 07. Мутація даних]] — Server Actions, форми, revalidation
12. [[Next.js - 54. Форми та Server Actions]] — валідація, useActionState, оптимістичні оновлення
13. [[Next.js - 08. Кешування]] — `use cache`, Cache Components, PPR
14. [[Next.js - 58. Кешування]] — fetch cache, unstable_cache, route segment config
15. [[Next.js - 61. Cache Components (use cache)]] — нова модель кешування, PPR
16. [[Next.js - 11. Ревалідація]] — cacheLife, cacheTag, updateTag, revalidatePath

## UI та стилізація

17. [[Next.js - 09. Обробка помилок]] — error.tsx, not-found, Error Boundaries
18. [[Next.js - 10. CSS та стилізація]] — Tailwind, CSS Modules, глобальний CSS
19. [[Next.js - 43. CSS-in-JS]] — styled-components, styled-jsx, registry
20. [[Next.js - 44. Sass]] — .scss/.sass, змінні, конфігурація
21. [[Next.js - 12. Оптимізація зображень]] — next/image, lazy loading, remote images
22. [[Next.js - 13. Оптимізація шрифтів]] — next/font, Google Fonts, локальні шрифти
23. [[Next.js - 14. Метадані та OG-зображення]] — SEO, metadata API, ImageResponse
24. [[Next.js - 48. JSON-LD]] — структуровані дані, schema.org, schema-dts
25. [[Next.js - 38. View Transitions]] — ViewTransition, морфінг, crossfade

## API та інфраструктура

26. [[Next.js - 15. Route Handlers]] — REST API, route.ts, кешування
27. [[Next.js - 16. Proxy (Middleware)]] — proxy.ts, редиректи, rewrite
28. [[Next.js - 57. Proxy (Middleware)]] — поглиблено: matcher, CORS, cookies, тестування
29. [[Next.js - 20. Форми та валідація]] — useActionState, Zod, optimistic updates

## Безпека

30. [[Next.js - 21. Автентифікація]] — сесії, DAL, DTO, авторизація
31. [[Next.js - 45. Безпека даних]] — Data Access Layer, tainting, server-only, CSRF
32. [[Next.js - 35. Content Security Policy]] — nonces, SRI, proxy CSP

## Оптимізація

33. [[Next.js - 22. Стрімінг]] — Suspense, loading.js, Web Vitals
34. [[Next.js - 23. Ліниве завантаження]] — next/dynamic, React.lazy, code splitting
35. [[Next.js - 42. Бандлінг пакетів]] — Bundle Analyzer, optimizePackageImports
36. [[Next.js - 52. Оптимізація пам'яті]] — heap profiling, webpack workers
37. [[Next.js - 51. Локальна розробка]] — Turbopack, антивірус, імпорти, Docker

## Функціональність

38. [[Next.js - 24. ISR (Інкрементальна статична регенерація)]] — часова та on-demand
39. [[Next.js - 25. Інтернаціоналізація]] — i18n routing, словники, локалізація
40. [[Next.js - 28. SPA (Single Page Application)]] — SPA паттерни, SWR
41. [[Next.js - 29. PWA (Progressive Web App)]] — manifest, push notifications
42. [[Next.js - 30. Скрипти]] — next/script, стратегії завантаження
43. [[Next.js - 49. Сторонні бібліотеки]] — @next/third-parties, GTM, GA, YouTube
44. [[Next.js - 31. Редиректи]] — redirect, permanentRedirect, useRouter
45. [[Next.js - 33. MDX]] — @next/mdx, remark/rehype плагіни
46. [[Next.js - 37. Draft Mode]] — draftMode, headless CMS preview

## Конфігурація

47. [[Next.js - 53. Змінні середовища]] — .env, NEXT_PUBLIC_, порядок завантаження
48. [[Next.js - 47. Інструментація]] — instrumentation.ts, register, NEXT_RUNTIME
49. [[Next.js - 39. OpenTelemetry]] — @vercel/otel, кастомні spans, трейсинг

## Тестування та налагодження

50. [[Next.js - 26. Тестування]] — Vitest, Jest, Playwright, Cypress
51. [[Next.js - 34. Налагодження (Debugging)]] — VS Code, WebStorm, DevTools

## Деплоймент та хостинг

52. [[Next.js - 17. Деплоймент]] — Node.js, Docker, static export, Vercel
53. [[Next.js - 27. Self-Hosting]] — reverse proxy, кешування, multi-server
54. [[Next.js - 32. Static Export]] — output: 'export', обмеження
55. [[Next.js - 50. Кастомний сервер]] — програмний запуск, опції next()
56. [[Next.js - 46. Multi-Zones]] — мікрофронтенди, assetPrefix, rewrites
57. [[Next.js - 18. Оновлення версії]] — upgrade, codemods, міграція

## Міграція

58. [[Next.js - 60. Міграція з Pages Router]] — покрокова міграція, заміни паттернів

## Аналітика та моніторинг

59. [[Next.js - 36. Аналітика]] — useReportWebVitals, Web Vitals, GA
60. [[Next.js - 40. Чекліст продакшену]] — повний чекліст перед деплоєм

---

## Граф зв'язків

> [!diagram] Карта курсу: що на чому тримається
> ```yaml
> layout: timeline
> nodes:
>   - { id: base, at: "1", label: основа, text: "Встановлення → Структура → Layouts і сторінки", note: "поруч: Метадані/OG → JSON-LD", tone: blue, icon: "si:SiNextdotjs" }
>   - { id: nav, at: "2", label: навігація, text: "Навігація → Proxy → Prefetching", tone: blue }
>   - { id: rsc, at: "3", label: компоненти, text: "Server і Client Components", note: "серце App Router — на них тримається все далі", tone: violet }
>   - { id: data, at: "4", label: дані, text: "Отримання даних → Мутація → Форми", note: "поруч: Паралельні маршрути → Перехоплення маршрутів", tone: mint }
>   - { id: cache, at: "5", label: кеш, text: "Кешування → Ревалідація → Cache Components", note: "і Route Handlers", tone: mint }
>   - { id: sec, at: "6", label: безпека, text: "Безпека даних → Автентифікація → CSP", tone: red, icon: "px:lock" }
>   - { id: ui, at: "7", label: "UI і швидкість", text: "CSS → Sass → CSS-in-JS → Шрифти → Зображення", note: "Стрімінг → Lazy Loading → Бандлінг → Пам'ять", tone: yellow }
>   - { id: modes, at: "8", label: режими, text: "ISR → i18n → SPA → PWA → MDX", tone: orange }
>   - { id: prod, at: "9", label: продакшн, text: "Змінні середовища → Інструментація → OpenTelemetry", note: "Деплоймент → Self-Hosting → Multi-Zones → Кастомний сервер", tone: green, icon: "px:rocket" }
>   - { id: qa, at: "10", label: якість, text: "Тестування → Налагодження → Аналітика → Чекліст", tone: green, icon: "px:check" }
> steps:
>   - { show: base, note: "Починаємо з фундаменту: встановити проєкт, зрозуміти структуру папок, layouts і сторінки. Метадані й JSON-LD — одразу поруч." }
>   - { show: [nav, rsc], note: "Далі — як користувач ходить між сторінками (і що перехоплює запит у Proxy), та головне: Server і Client Components." }
>   - { show: [data, cache], note: "Компоненти отримують і змінюють дані, а кеш і ревалідація вирішують, коли дані оновлювати." }
>   - { show: [sec, ui, modes], note: "Окремі гілки, які можна читати в будь-якому порядку: безпека, стилі й продуктивність, режими застосунку." }
>   - { show: [prod, qa], note: "Наостанок — продакшн: змінні середовища, моніторинг, деплой, тестування і чекліст перед релізом." }
> ```
