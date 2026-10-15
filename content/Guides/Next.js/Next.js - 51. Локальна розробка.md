# Локальна розробка в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 34. Налагодження (Debugging)]], [[Next.js - 52. Оптимізація пам'яті]]

`next dev` компілює маршрути на вимогу (при відкритті), а не всі одразу. Це швидше і використовує менше пам'яті.

## Покращення продуктивності

### 1. Перевірте антивірус

Антивірус може сповільнювати доступ до файлів.

**Windows:** Додайте папку проєкту до виключень Microsoft Defender.

**macOS:** Вимкніть Gatekeeper для терміналу:
```bash
sudo spctl developer-mode enable-terminal
```
Потім увімкніть термінал у System Settings → Privacy & Security → Developer Tools.

### 2. Оновіть Next.js та використовуйте Turbopack

Turbopack — бандлер за замовчуванням для `next dev`:

```bash
pnpm add next@latest
pnpm dev  # Turbopack використовується автоматично
```

Для webpack замість Turbopack:
```bash
pnpm dev --webpack
```

### 3. Перевірте імпорти

**Бібліотеки іконок** — імпортуйте конкретні іконки:

```tsx
// ❌ Імпортує тисячі іконок
import { TriangleIcon } from '@phosphor-icons/react'

// ✅ Імпортує одну іконку
import { TriangleIcon } from '@phosphor-icons/react/dist/csr/Triangle'
```

**Barrel файли** — експортують багато з одного файлу, сповільнюючи збірку. Імпортуйте напряму.

**optimizePackageImports:**

```js
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['package-name'],
  },
}
```

> Turbopack автоматично аналізує та оптимізує імпорти без цієї конфігурації.

### 4. Налаштуйте Tailwind CSS

Вкажіть конкретні шляхи для сканування:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // ✅ Конкретний шлях
    // '../../packages/**/*.{js,ts,jsx,tsx}', // ❌ Занадто широко
  ],
}
```

### 5. Перевірте кастомні webpack налаштування

Кастомні webpack плагіни можуть сповільнювати компіляцію. Розгляньте Turbopack з конфігурацією loaders.

### 6. Оптимізуйте використання пам'яті

Див. [[Next.js - 52. Оптимізація пам'яті]].

### 7. HMR кеш для Server Components

```js
// next.config.js — кешує fetch відповіді між HMR оновленнями
module.exports = {
  experimental: {
    serverComponentsHmrCache: true,
  },
}
```

### 8. Уникайте Docker для розробки на Mac/Windows

Docker на Mac/Windows значно сповільнює HMR через файлову систему. Використовуйте Docker для продакшену, а локальну розробку — без нього.

## Інструменти діагностики

### Логування fetch

```js
// next.config.js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

### Turbopack Tracing

```bash
NEXT_TURBOPACK_TRACING=1 pnpm dev
```

Після зупинки сервера — файл `trace-turbopack` у `.next/dev/`:

```bash
npx next internal trace .next/dev/trace-turbopack
```

Переглядайте трейси на https://trace.nextjs.org/.
