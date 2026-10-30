# Змінні середовища в Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 01. Встановлення]], [[Next.js - 05. Серверні та клієнтські компоненти]], [[Next.js - 17. Деплоймент]]

## Завантаження змінних

Next.js автоматично завантажує змінні з `.env*` файлів у `process.env`:

```env
# .env
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

> `.env` файли завантажуються з **кореня проєкту**, не з `/src`.

Використання в [[Next.js - 15. Route Handlers|Route Handlers]]:

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

### Підтримка багаторядкових значень

```env
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----"
```

### Посилання на інші змінні

```env
TWITTER_USER=nextjs
TWITTER_URL=https://x.com/$TWITTER_USER
```

Для літерального `$` використовуйте `\$`.

## Змінні для браузера (`NEXT_PUBLIC_`)

Змінні **без** префіксу `NEXT_PUBLIC_` доступні **тільки на сервері**.

Для доступу в браузері додайте префікс `NEXT_PUBLIC_`:

```env
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

Next.js замінює `process.env.NEXT_PUBLIC_ANALYTICS_ID` на жорстко закодоване значення **під час збірки**:

```ts
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID)
// => setupAnalyticsService('abcdefghijk')
```

> **Важливо:** після збірки змінні `NEXT_PUBLIC_` заморожуються. Для runtime значень створіть API-ендпоінт.

### Динамічні звернення НЕ працюють

```ts
// НЕ буде інлайнено:
const varName = 'NEXT_PUBLIC_ANALYTICS_ID'
process.env[varName] // undefined на клієнті
```

## Runtime змінні середовища

На сервері можна безпечно читати змінні під час динамічного рендерингу:

```tsx
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  const value = process.env.MY_VALUE
  // ...
}
```

Це дозволяє використовувати один Docker-образ для різних оточень (див. [[Next.js - 17. Деплоймент#Docker|Docker деплоймент]]).

## Порядок завантаження

Змінні шукаються зверху вниз, зупиняючись при першому знаходженні:

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local` (не перевіряється при `NODE_ENV=test`)
4. `.env.$(NODE_ENV)`
5. `.env`

## Тестове середовище

Файл `.env.test` для тестів:

```env
# .env.test
DATABASE_URL=postgres://localhost/test_db
```

- `.env.local` **не завантажується** при `NODE_ENV=test` — тести повинні бути однаковими для всіх
- `.env.test` — включайте в репозиторій
- `.env.test.local` — додайте в `.gitignore`

### Завантаження в тестовому рантаймі

```ts
// jest.setup.ts
import { loadEnvConfig } from '@next/env'

export default async () => {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
}
```

## Безпека

- Ніколи не комітьте `.env.local` та `.env*.local`
- `create-next-app` автоматично додає `.env*` файли в `.gitignore`
- Без `NEXT_PUBLIC_` префіксу змінні замінюються на порожній рядок на клієнті (див. [[Next.js - 05. Серверні та клієнтські компоненти#Запобігання витоку серверного коду|запобігання витоку]])
