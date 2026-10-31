# Оптимізація пам'яті в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 51. Локальна розробка]], [[Next.js - 42. Бандлінг пакетів]]

## Зменшіть кількість залежностей

Bundle Analyzer допоможе знайти великі залежності, які можна видалити.

## webpackMemoryOptimizations

```js
// next.config.js
module.exports = {
  experimental: {
    webpackMemoryOptimizations: true,
  },
}
```

Зменшує пікове використання пам'яті за рахунок незначного збільшення часу компіляції.

## Дебаг пам'яті під час збірки

```bash
next build --experimental-debug-memory-usage
```

Виводить інформацію про heap та garbage collection. Автоматично робить heap snapshots при наближенні до ліміту.

## Heap Profile

```bash
node --heap-prof node_modules/next/dist/bin/next build
```

Створює `.heapprofile` файл — відкрийте в Chrome DevTools → Memory → Load Profile.

## Heap Snapshot

```bash
NODE_OPTIONS=--inspect next build
```

Або відправте сигнал `SIGUSR2` процесу з `--experimental-debug-memory-usage` для snapshot.

## Webpack Build Worker

Запускає webpack компіляцію в окремому Node.js worker. Увімкнений за замовчуванням з v14.1.0 (без кастомної webpack конфігурації).

Для старіших версій:
```js
module.exports = {
  experimental: {
    webpackBuildWorker: true,
  },
}
```

## Вимкнення webpack кешу

```js
// next.config.mjs
const nextConfig = {
  webpack: (config, { dev }) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({ type: 'memory' })
    }
    return config
  },
}

export default nextConfig
```

## Вимкнення перевірки типів

Якщо збірка падає з OOM на етапі TypeScript (перевіряйте типи в CI окремо):

```js
module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
}
```

> **Увага:** це небезпечно. Впевніться, що перевірка типів відбувається деінде (CI).

## Вимкнення source maps

```js
module.exports = {
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
  },
}
```

## Preloading Entries

Next.js завантажує JS модулі сторінок при старті сервера. Для зменшення початкового footprint:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  experimental: {
    preloadEntriesOnStart: false,
  },
}

export default config
```
