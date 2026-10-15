# Cache Components (use cache) у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 58. Кешування]], [[Next.js - 22. Стрімінг]]

Нова модель кешування з `cacheComponents` та директивою `'use cache'`.

## Увімкнення

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

## Рівні кешування

### Data-level — кешування функції

```ts
import { cacheLife } from 'next/cache'

export async function getUsers() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM users')
}
```

### UI-level — кешування компонента/сторінки

```tsx
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')

  const users = await db.query('SELECT * FROM users')
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

> Аргументи та замикання автоматично стають частиною cache key.

## Стрімінг некешованих даних

Компоненти без `'use cache'` обгортаються в `<Suspense>`:

```tsx
import { Suspense } from 'react'

async function LatestPosts() {
  const data = await fetch('https://api.example.com/posts')
  const posts = await data.json()
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}

export default function Page() {
  return (
    <>
      <h1>Блог</h1>
      <Suspense fallback={<p>Завантаження...</p>}>
        <LatestPosts />
      </Suspense>
    </>
  )
}
```

## Runtime API (cookies, headers, searchParams)

Компоненти з runtime API обгортаються в `<Suspense>`:

```tsx
import { cookies } from 'next/headers'
import { Suspense } from 'react'

async function UserGreeting() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value || 'light'
  return <p>Ваша тема: {theme}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>Завантаження...</p>}>
      <UserGreeting />
    </Suspense>
  )
}
```

### Передача runtime значень у кешовані функції

```tsx
async function ProfileContent() {
  const session = (await cookies()).get('session')?.value
  return <CachedContent sessionId={session} />
}

async function CachedContent({ sessionId }: { sessionId: string }) {
  'use cache'
  const data = await fetchUserData(sessionId)
  return <div>{data}</div>
}
```

## Недетерміновані операції

`Math.random()`, `Date.now()`, `crypto.randomUUID()`:

**Унікальне значення на запит** — `connection()` + `<Suspense>`:

```tsx
import { connection } from 'next/server'

async function UniqueContent() {
  await connection()
  const uuid = crypto.randomUUID()
  return <p>Request ID: {uuid}</p>
}
```

**Кешоване значення** — `'use cache'`:

```tsx
export default async function Page() {
  'use cache'
  const buildId = crypto.randomUUID()
  return <p>Build ID: {buildId}</p>
}
```

## Partial Prerendering (PPR)

З Cache Components PPR увімкнений за замовчуванням:

- `'use cache'` → результат кешується, входить у статичний shell
- `<Suspense>` → fallback у shell, контент стрімиться при запиті
- Детерміновані операції → автоматично у shell

## Повний приклад

```tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag, updateTag } from 'next/cache'

export default function BlogPage() {
  return (
    <>
      {/* Статичний контент */}
      <header><h1>Блог</h1></header>

      {/* Кешований динамічний контент */}
      <BlogPosts />

      {/* Runtime динамічний контент */}
      <Suspense fallback={<p>Завантаження...</p>}>
        <UserPreferences />
      </Suspense>
    </>
  )
}

async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  cacheTag('posts')

  const res = await fetch('https://api.vercel.app/blog')
  const posts = await res.json()
  return (
    <ul>
      {posts.slice(0, 5).map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value || 'light'
  return <p>Тема: {theme}</p>
}
```

## Ревалідація

- `cacheTag('tag')` — позначає кеш тегом
- `updateTag('tag')` — інвалідує кеш за тегом
- `cacheLife('hours')` — часова ревалідація

Див. [[Next.js - 24. ISR (Інкрементальна статична регенерація)]].
