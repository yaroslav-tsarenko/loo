# Чекліст продакшену Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 17. Деплоймент]], [[Next.js - 27. Self-Hosting]], [[Next.js - 36. Аналітика]]

## Автоматичні оптимізації

Увімкнені за замовчуванням:

- **Server Components** — без JavaScript на клієнті для серверних компонентів
- **Code-splitting** — автоматичне розбиття за маршрутами
- **Prefetching** — `<Link>` prefetch маршрутів у viewport
- **Prerendering** — SSG на рівні збірки
- **Caching** — кешування даних, рендерингу, статичних ресурсів

## Під час розробки

### Маршрутизація та рендеринг

- [ ] Використовуйте Layouts для спільного UI
- [ ] `<Link>` замість `<a>` для навігації
- [ ] Кастомні сторінки помилок (`error.tsx`, `not-found.tsx`)
- [ ] Дотримуйтесь паттернів Server/Client Components
- [ ] Розміщуйте `'use client'` boundaries правильно
- [ ] Обгортайте Request-time API (`cookies`, `searchParams`) у `<Suspense>`

### Дані та кешування

- [ ] Fetch даних у Server Components
- [ ] Route Handlers для доступу з Client Components (не з Server Components!)
- [ ] Streaming з `loading.tsx` та `<Suspense>`
- [ ] Паралельне отримання даних (`Promise.all`)
- [ ] Перевірте кешування запитів
- [ ] Статичні ресурси в `public/`

### UI та доступність

- [ ] Server Actions для форм з валідацією
- [ ] `app/global-error.tsx` для обробки непередбачених помилок
- [ ] `next/font` для оптимізації шрифтів
- [ ] `next/image` для оптимізації зображень
- [ ] `next/script` для сторонніх скриптів
- [ ] ESLint з `eslint-plugin-jsx-a11y` для доступності

### Безпека

- [ ] Tainting для захисту чутливих даних
- [ ] Автентифікація та авторизація в кожному Server Action
- [ ] `.env.*` у `.gitignore`, публічні змінні з `NEXT_PUBLIC_`
- [ ] Content Security Policy

### Метадані та SEO

- [ ] Metadata API для `<title>`, `<description>`
- [ ] Open Graph зображення
- [ ] `sitemap.xml` та `robots.txt`

### Type Safety

- [ ] TypeScript
- [ ] TS Plugin для Next.js

## Перед продакшеном

1. `next build` — збірка та перевірка помилок
2. `next start` — тест продуктивності локально
3. **Lighthouse** в incognito
4. **`useReportWebVitals`** — збір Core Web Vitals

### Аналіз бандлу

- `@next/bundle-analyzer` — аналіз розміру JS
- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost) — VS Code розширення
- [Bundle Phobia](https://bundlephobia.com/) — перевірка розміру залежностей
