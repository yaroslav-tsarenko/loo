# Змінні середовища в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 45. Безпека даних]], [[Next.js - 17. Деплоймент]]

## Завантаження змінних

Next.js автоматично завантажує змінні з `.env*` файлів у `process.env`:

```txt
# .env
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

Підтримуються багаторядкові значення та посилання на інші змінні:

```txt
TWITTER_USER=nextjs
TWITTER_URL=https://x.com/$TWITTER_USER
```

> `.env` файли повинні бути в корені проєкту (не в `/src`).

## Використання в Route Handlers

```ts
// app/api/route.ts
export async function GET() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

## @next/env для зовнішніх інструментів

Для ORM конфігурацій, тестових раннерів тощо:

```ts
// envConfig.ts
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)
```

```ts
// orm.config.ts
import './envConfig.ts'

export default defineConfig({
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
})
```

## Публічні змінні для браузера

Префікс `NEXT_PUBLIC_` робить змінну доступною в клієнтському коді:

```txt
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

```tsx
// Інлайниться при збірці
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID)
```

> **Важливо:**
> - Значення вбудовується при `next build` і не змінюється після цього
> - Динамічні звертання (`process.env[varName]`) НЕ інлайняться
> - Без `NEXT_PUBLIC_` змінні доступні лише на сервері

## Runtime змінні

Читайте серверні змінні під час динамічного рендерингу:

```tsx
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  const value = process.env.MY_VALUE
  // ...
}
```

## Порядок завантаження

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local` (не перевіряється коли `NODE_ENV=test`)
4. `.env.$(NODE_ENV)`
5. `.env`

Змінна з вищого пріоритету перекриває нижчий.

## Тестове середовище

`.env.test` — для `NODE_ENV=test` (Jest, Cypress):

```txt
# .env.test
API_URL=http://localhost:3001
```

> `.env.local` не завантажується в тестовому середовищі — тести мають бути однаковими для всіх.

Завантаження в Jest:

```js
// jest.setup.js
import { loadEnvConfig } from '@next/env'

export default async () => {
  loadEnvConfig(process.cwd())
}
```

## Рекомендації

- `.env*.local` додайте в `.gitignore`
- `.env` та `.env.test` можна комітити (без секретів)
- `NEXT_PUBLIC_` змінні — лише для публічної інформації
- `NODE_ENV` автоматично: `development` для `next dev`, `production` для решти
