# Sass у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 43. CSS-in-JS]]

Next.js має вбудовану підтримку Sass з розширеннями `.scss` та `.sass`, включаючи CSS Modules (`.module.scss`, `.module.sass`).

## Встановлення

```bash
pnpm add -D sass
```

> `.scss` — SCSS синтаксис (надмножина CSS). `.sass` — відступний синтаксис. Якщо не впевнені — обирайте `.scss`.

## Налаштування опцій

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `$var: red;`,
  },
}

export default nextConfig
```

### Вибір імплементації

За замовчуванням — пакет `sass`. Можна змінити на `sass-embedded`:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    implementation: 'sass-embedded',
  },
}

export default nextConfig
```

## Sass змінні в JavaScript

Експортуйте змінні з CSS Module файлів:

```scss
// app/variables.module.scss
$primary-color: #64ff00;

:export {
  primaryColor: $primary-color;
}
```

```tsx
// app/page.tsx
import variables from './variables.module.scss'

export default function Page() {
  return <h1 style={{ color: variables.primaryColor }}>Привіт, Next.js!</h1>
}
```
