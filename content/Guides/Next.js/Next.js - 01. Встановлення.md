# Встановлення Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Далі: [[Next.js - 02. Структура проєкту]] | [[Next.js - 03. Layouts та сторінки]]
> Див. також: [[Next.js - 10. CSS та стилізація]], [[Next.js - 19. Змінні середовища]], [[Next.js - 18. Оновлення версії]]

## Швидкий старт

Створіть новий застосунок та запустіть його локально:

```bash
# pnpm
pnpm create next-app@latest my-app --yes
cd my-app
pnpm dev

# npm
npx create-next-app@latest my-app --yes
cd my-app
npm run dev

# yarn
yarn create next-app@latest my-app --yes
cd my-app
yarn dev

# bun
bun create next-app@latest my-app --yes
cd my-app
bun dev
```

Прапорець `--yes` пропускає підказки, використовуючи збережені налаштування або типові значення. За замовчуванням налаштовуються TypeScript, Tailwind CSS, ESLint, App Router та Turbopack з аліасом імпорту `@/*`.

Після запуску відвідайте `http://localhost:3000`.

## Системні вимоги

- Node.js версії 20.9 або вище
- macOS, Windows (включаючи WSL) та Linux

## Підтримувані браузери

- Chrome 111+
- Edge 111+
- Firefox 111+
- Safari 16.4+

## Створення через CLI

Запустіть `create-next-app` без прапорця `--yes`, щоб побачити інтерактивні підказки:

```
What is your project named? my-app
Would you like to use the recommended Next.js defaults?
    Yes, use recommended defaults
    No, reuse previous settings
    No, customize settings
```

При виборі `customize settings` з'являться додаткові підказки:

```
Would you like to use TypeScript? No / Yes
Which linter would you like to use? ESLint / Biome / None
Would you like to use React Compiler? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the import alias (@/* by default)? No / Yes
```

## Ручне встановлення

Встановіть необхідні пакети:

```bash
npm i next@latest react@latest react-dom@latest
```

Додайте скрипти до `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

Опис скриптів:
- `next dev` — запуск сервера розробки (Turbopack за замовчуванням)
- `next build` — збірка для продакшену
- `next start` — запуск продакшен-сервера
- `eslint` — запуск лінтера

> Turbopack тепер є бандлером за замовчуванням. Щоб використовувати Webpack, запустіть `next dev --webpack`.

### Створення директорії `app`

Next.js використовує маршрутизацію на основі файлової системи. Створіть папку `app`, а в ній файл `layout.tsx` (кореневий layout):

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
```

Створіть домашню сторінку `app/page.tsx`:

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Привіт, Next.js!</h1>
}
```

Обидва файли рендеряться при відвідуванні кореневого маршруту (`/`).

> Якщо ви забудете створити кореневий layout, Next.js створить його автоматично при запуску `next dev`.

### Створення папки `public` (опціонально)

Створіть папку `public` в корені проєкту для статичних ресурсів (зображення, шрифти тощо). Файли в `public` доступні від кореневого URL (`/`):

```tsx
import Image from 'next/image'

export default function Page() {
  return <Image src="/profile.png" alt="Профіль" width={100} height={100} />
}
```

## Налаштування TypeScript

Next.js має вбудовану підтримку TypeScript. Перейменуйте файл на `.ts` / `.tsx` та запустіть `next dev` — Next.js автоматично встановить залежності та створить `tsconfig.json`.

### Плагін для IDE

У VS Code увімкніть плагін TypeScript:
1. Відкрийте палітру команд (`Ctrl/⌘` + `Shift` + `P`)
2. Знайдіть "TypeScript: Select TypeScript Version"
3. Виберіть "Use Workspace Version"

## Налаштування лінтера

Next.js підтримує ESLint та Biome:

**ESLint:**
```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

**Biome (швидкий лінтер + форматер):**
```json
{
  "scripts": {
    "lint": "biome check",
    "format": "biome format --write"
  }
}
```

> Починаючи з Next.js 16, `next build` більше не запускає лінтер автоматично.

## Абсолютні імпорти та аліаси шляхів

Next.js підтримує опції `paths` та `baseUrl` з `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "src/",
    "paths": {
      "@/styles/*": ["styles/*"],
      "@/components/*": ["components/*"]
    }
  }
}
```

Це дозволяє писати:
```tsx
import { Button } from '@/components/button'
```

замість:
```tsx
import { Button } from '../../../components/button'
```
