# Кешування в Next.js

> Документація на основі Next.js 16.2.4 (App Router) з Cache Components
> Пов'язано: [[Next.js - 11. Ревалідація]], [[Next.js - 06. Отримання даних]], [[Next.js - 15. Route Handlers]]

Кешування — це техніка збереження результатів отримання даних та обчислень для швидшого обслуговування майбутніх запитів.

## Увімкнення Cache Components

Додайте опцію `cacheComponents` до конфігурації:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

## Використання `use cache`

Директива `use cache` кешує повернене значення асинхронних функцій та компонентів. Застосовується на двох рівнях:

### Кешування на рівні даних

```tsx
import { cacheLife } from 'next/cache'

export async function getUsers() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM users')
}
```

Корисно, коли ті ж дані використовуються в кількох компонентах або коли потрібно кешувати дані незалежно від UI.

### Кешування на рівні UI

```tsx
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')

  const users = await db.query('SELECT * FROM users')
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

> Якщо додати `"use cache"` на початку файлу — всі експортовані функції файлу будуть кешуватися.

Аргументи та замкнені значення з батьківських областей автоматично стають частиною **ключа кешу** — різні вхідні дані створюють окремі записи кешу.

## Streaming некешованих даних

Для компонентів, що потребують свіжих даних при кожному запиті — **не** використовуйте `"use cache"`. Замість цього обгорніть компонент в `<Suspense>`:

```tsx
import { Suspense } from 'react'

async function LatestPosts() {
  const data = await fetch('https://api.example.com/posts')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

export default function Page() {
  return (
    <>
      <h1>Мій блог</h1>
      <Suspense fallback={<p>Завантаження постів...</p>}>
        <LatestPosts />
      </Suspense>
    </>
  )
}
```

Fallback включається в статичну оболонку, а контент компонента стримиться під час запиту.

## Робота з runtime API

API, що потребують інформації з запиту (`cookies`, `headers`, `searchParams`, `params`), повинні бути обгорнуті в `<Suspense>`:

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
    <>
      <h1>Дашборд</h1>
      <Suspense fallback={<p>Завантаження...</p>}>
        <UserGreeting />
      </Suspense>
    </>
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
  // sessionId стає частиною ключа кешу
  const data = await fetchUserData(sessionId)
  return <div>{data}</div>
}
```

## Недетерміновані операції

`Math.random()`, `Date.now()`, `crypto.randomUUID()` — Cache Components вимагає явної обробки.

**Унікальне значення на кожен запит** — використовуйте `connection()`:

```tsx
import { connection } from 'next/server'
import { Suspense } from 'react'

async function UniqueContent() {
  await connection()
  const uuid = crypto.randomUUID()
  return <p>ID запиту: {uuid}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>Завантаження...</p>}>
      <UniqueContent />
    </Suspense>
  )
}
```

**Однакове значення для всіх** — кешуйте результат:

```tsx
export default async function Page() {
  'use cache'
  const buildId = crypto.randomUUID()
  return <p>Build ID: {buildId}</p>
}
```

## Як працює рендеринг (Partial Prerendering)

Під час збірки Next.js рендерить дерево компонентів:

- `use cache` — результат кешується та включається в статичну оболонку
- `<Suspense>` — fallback UI включається в статичну оболонку, контент стримиться під час запиту
- Детерміновані операції — автоматично включаються в статичну оболонку

Це генерує **статичну оболонку** з HTML для початкових завантажень та серіалізований RSC Payload для клієнтської навігації.

Цей підхід називається **Partial Prerendering (PPR)** і є поведінкою за замовчуванням з Cache Components.

> Next.js вимагає явно обробляти компоненти, що не можуть завершитися під час prerendering. Без `<Suspense>` або `use cache` ви побачите помилку `Uncached data was accessed outside of <Suspense>`.

## Повний приклад

```tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag, updateTag } from 'next/cache'

export default function BlogPage() {
  return (
    <>
      {/* Статичний контент — prerendered */}
      <header>
        <h1>Наш блог</h1>
      </header>

      {/* Кешований динамічний контент */}
      <BlogPosts />

      {/* Runtime динамічний контент — стримиться */}
      <Suspense fallback={<p>Завантаження вподобань...</p>}>
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
      {posts.slice(0, 5).map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value || 'light'
  return <p>Ваша тема: {theme}</p>
}
```
