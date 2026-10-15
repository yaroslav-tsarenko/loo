# Кешування в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 24. ISR (Інкрементальна статична регенерація)]], [[Next.js - 41. Отримання даних]]

> Ця сторінка описує модель кешування **без Cache Components** (до v16 або без `cacheComponents` flag).

## Кешування fetch запитів

За замовчуванням `fetch` **не кешується**. Примусове кешування:

```tsx
const data = await fetch('https://...', { cache: 'force-cache' })
```

## unstable_cache для не-fetch функцій

```ts
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'

export const getCachedUser = unstable_cache(
  async (id: string) => {
    return db.select().from(users).where(eq(users.id, id)).then((res) => res[0])
  },
  ['user'],
  { tags: ['user'], revalidate: 3600 }
)
```

## Route Segment Config

### dynamic

```ts
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

| Значення | Поведінка |
|----------|-----------|
| `'auto'` | За замовчуванням — кешує де можливо |
| `'force-dynamic'` | Динамічний рендеринг кожного запиту |
| `'error'` | Примусовий prerendering, помилка при dynamic API |
| `'force-static'` | Prerendering, `cookies`/`headers` повертають порожні значення |

### revalidate

```ts
export const revalidate = false
// false | 0 | number (секунди)
```

- `false` — кешувати нескінченно (за замовчуванням)
- `0` — завжди динамічний
- `number` — ревалідація кожні N секунд

> Найменший `revalidate` у ланцюгу layout/page визначає частоту ревалідації всього маршруту.

## Часова ревалідація

```tsx
const data = await fetch('https://...', { next: { revalidate: 3600 } })
```

## On-demand ревалідація

### Теги

```ts
// Позначення
const data = await fetch('https://...', { next: { tags: ['user'] } })

// Інвалідація
import { revalidateTag } from 'next/cache'
export async function updateUser(id: string) {
  revalidateTag('user')
}
```

### Шлях

```ts
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  revalidatePath('/profile')
}
```

## Дедуплікація запитів

`fetch` мемоїзується автоматично. Для ORM/бази даних — `React.cache`:

```ts
import { cache } from 'react'
import { db, posts, eq } from '@/lib/db'

export const getPost = cache(async (id: string) => {
  return db.query.posts.findFirst({ where: eq(posts.id, parseInt(id)) })
})
```

## Preload паттерн

```ts
import { cache } from 'react'
import 'server-only'

export const getItem = cache(async (id: string) => { /* ... */ })
export const preload = (id: string) => { void getItem(id) }
```

```tsx
// app/item/[id]/page.tsx
import { getItem, preload, checkIsAvailable } from '@/lib/data'

export default async function Page({ params }) {
  const { id } = await params
  preload(id) // починає завантаження одразу
  const isAvailable = await checkIsAvailable()
  return isAvailable ? <Item id={id} /> : null
}
```
