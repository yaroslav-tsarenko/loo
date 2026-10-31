# Безпека даних у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 21. Автентифікація]], [[Next.js - 35. Content Security Policy]]

React Server Components змінюють модель безпеки — дані тепер доступні безпосередньо на сервері.

## Підходи до отримання даних

### 1. Зовнішні HTTP API

Для існуючих проєктів з REST/GraphQL — модель **Zero Trust**:

```tsx
// app/page.tsx
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = cookies()
  const token = cookieStore.get('AUTH_TOKEN')?.value

  const res = await fetch('https://api.example.com/profile', {
    headers: { Cookie: `AUTH_TOKEN=${token}` },
  })
  // ...
}
```

### 2. Data Access Layer (DAL)

Для нових проєктів — централізований рівень доступу до даних:

```ts
// data/auth.ts
import { cache } from 'react'
import { cookies } from 'next/headers'

export const getCurrentUser = cache(async () => {
  const token = cookies().get('AUTH_TOKEN')
  const decodedToken = await decryptAndValidate(token)
  return new User(decodedToken.id)
})
```

```ts
// data/user-dto.ts
import 'server-only'
import { getCurrentUser } from './auth'

export async function getProfileDTO(slug: string) {
  const [rows] = await sql`SELECT * FROM user WHERE slug = ${slug}`
  const userData = rows[0]
  const currentUser = await getCurrentUser()

  return {
    username: canSeeUsername(currentUser) ? userData.username : null,
    phonenumber: canSeePhoneNumber(currentUser, userData.team)
      ? userData.phonenumber
      : null,
  }
}
```

DAL повинен:
- Виконуватись лише на сервері
- Перевіряти авторизацію
- Повертати мінімальні DTO (Data Transfer Objects)

### 3. Доступ на рівні компонента

Для прототипів — запити прямо в Server Components. Але фільтруйте дані перед передачею в Client Components:

```tsx
// ❌ Погано — всі поля передаються клієнту
return <Profile user={userData} />

// ✅ Добре — тільки публічні поля
const publicProfile = await getUser(slug) // фільтрує поля
return <Profile user={publicProfile} />
```

## Tainting — захист від витоку

React Taint API запобігає випадковій передачі приватних даних клієнту:

```js
// next.config.js
module.exports = {
  experimental: {
    taint: true,
  },
}
```

- `experimental_taintObjectReference` — для об'єктів
- `experimental_taintUniqueValue` — для конкретних значень

## server-only

Пакет `server-only` гарантує, що модуль не потрапить у клієнтський бандл:

```ts
// lib/data.ts
import 'server-only'
// Цей модуль викликає помилку збірки при імпорті в Client Component
```

## Безпека Server Actions

### Вбудований захист

- **Зашифровані ID** — неможливо вгадати ендпоінт
- **Dead code elimination** — невикористані Server Actions видаляються
- **POST-only** — інвокація тільки через POST
- **CSRF захист** — перевірка Origin vs Host заголовків

### Обов'язково в кожному Server Action

**Автентифікація + авторизація:**

```tsx
'use server'

export async function deletePost(postId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const post = await db.post.findUnique({ where: { id: postId } })
  if (post.authorId !== session.user.id) throw new Error('Forbidden')

  await db.post.delete({ where: { id: postId } })
}
```

> Перевірка на сторінці НЕ поширюється на Server Actions. Кожен action — окремий ендпоінт.

### Валідація вхідних даних

```tsx
// ❌ Погано — довіряє searchParams
const isAdmin = searchParams.get('isAdmin')

// ✅ Добре — перевіряє кожен раз
const token = cookies().get('AUTH_TOKEN')
const isAdmin = await verifyAdmin(token)
```

### Повертайте мінімум

```tsx
// ❌ Повертає весь запис з БД
return db.user.update({ where: { id }, data })

// ✅ Повертає тільки потрібне
await db.user.update({ where: { id }, data })
return { success: true }
```

## Замикання та шифрування

Server Actions в компонентах створюють замикання. Захоплені змінні шифруються Next.js перед відправкою клієнту.

Для self-hosting з кількома серверами — встановіть єдиний ключ:

```bash
# Генерація ключа
openssl rand -base64 32

# Встановлення
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=<ключ>
```

## Дозволені origins

Для reverse proxy або multi-layer архітектур:

```js
// next.config.js
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
```

## Чекліст аудиту

- [ ] Чи є ізольований Data Access Layer?
- [ ] `"use client"` файли — чи не передаються приватні дані через props?
- [ ] `"use server"` файли — чи валідуються аргументи? Чи перевіряється авторизація?
- [ ] `[param]` папки — чи валідуються параметри?
- [ ] `proxy.ts` та `route.ts` — регулярне пентестування
