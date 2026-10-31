# Бандлінг пакетів у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 23. Ліниве завантаження]], [[Next.js - 40. Чекліст продакшену]]

Бандлінг — процес об'єднання коду та залежностей в оптимізовані файли для клієнта та сервера. Next.js автоматично оптимізує бандли (code splitting, tree-shaking), але іноді потрібна ручна оптимізація.

## Next.js Bundle Analyzer (Turbopack)

> Доступний з v16.1. Інтегрований з модульним графом Turbopack.

### Крок 1: Запуск

```bash
pnpm next experimental-analyze
```

### Крок 2: Фільтрація модулів

В інтерактивному UI можна фільтрувати за маршрутом, середовищем (client/server), типом (JS, CSS, JSON) або шукати за ім'ям файлу.

### Крок 3: Трасування імпортів

Treemap показує кожен модуль як прямокутник (розмір = площа). Клікніть модуль, щоб побачити повний ланцюг імпортів.

### Крок 4: Збереження результатів

```bash
pnpm next experimental-analyze --output
# Результат записується в .next/diagnostics/analyze
cp -r .next/diagnostics/analyze ./analyze-before-refactor
```

## @next/bundle-analyzer (Webpack)

### Встановлення

```bash
pnpm add @next/bundle-analyzer
```

```js
// next.config.js
const nextConfig = {}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

### Генерація звіту

```bash
ANALYZE=true pnpm build
```

Відкриється три вкладки у браузері з інтерактивними звітами.

## Оптимізація великих бандлів

### Пакети з багатьма експортами

Бібліотеки іконок та утиліт з сотнями модулів — `optimizePackageImports` завантажує лише використані:

```js
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: ['icon-library'],
  },
}

module.exports = nextConfig
```

> Next.js автоматично оптимізує деякі бібліотеки. Див. повний список у документації `optimizePackageImports`.

### Важкі клієнтські обчислення

Якщо робота не потребує браузерних API — перенесіть на сервер:

**Погано** — бібліотека підсвітки відправляється клієнту:

```tsx
'use client'
import Highlight from 'prism-react-renderer'

export default function Page() {
  const code = `export function hello() { console.log("hi") }`
  return <Highlight code={code} language="tsx" theme={theme}>
    {/* ... */}
  </Highlight>
}
```

**Добре** — рендеринг на сервері, клієнт отримує лише HTML:

```tsx
import { codeToHtml } from 'shiki'

export default async function Page() {
  const code = `export function hello() { console.log("hi") }`
  const highlightedHtml = await codeToHtml(code, {
    lang: 'tsx',
    theme: 'github-dark',
  })

  return (
    <article>
      <h1>Стаття</h1>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </article>
  )
}
```

### Виключення пакетів з бандлу

Пакети в Server Components бандляться автоматично. Виключити конкретний пакет:

```js
// next.config.js
const nextConfig = {
  serverExternalPackages: ['package-name'],
}

module.exports = nextConfig
```
