# Редиректи в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 16. Proxy (Middleware)]], [[Next.js - 15. Route Handlers]]

## Огляд методів

| API | Призначення | Де використовується | Статус-код |
|-----|------------|---------------------|------------|
| `redirect` | Після мутації/події | Server Components, Server Functions, Route Handlers | 307 (або 303 для Server Action) |
| `permanentRedirect` | Після мутації/події | Server Components, Server Functions, Route Handlers | 308 |
| `useRouter` | Клієнтська навігація | Event handlers у Client Components | N/A |
| `redirects` в `next.config.js` | За шляхом запиту | Конфігурація | 307 або 308 |
| `NextResponse.redirect` | За умовою | Proxy | Будь-який |

## `redirect`

Перенаправлення після мутації:

```ts
// app/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(id: string) {
  try {
    // Виклик бази даних
  } catch (error) {
    // Обробка помилок
  }

  revalidatePath('/posts')
  redirect(`/post/${id}`)
}
```

> - За замовчуванням повертає **307** (Temporary Redirect). У Server Action — **303** (See Other)
> - `redirect` кидає помилку — викликайте **поза** блоком `try/catch`
> - Приймає абсолютні URL для зовнішніх посилань

## `permanentRedirect`

**Постійне** перенаправлення (308) — наприклад, при зміні username:

```ts
// app/actions.ts
'use server'

import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function updateUsername(username: string, formData: FormData) {
  try {
    // Оновлення в БД
  } catch (error) {
    // Обробка помилок
  }

  revalidateTag('username')
  permanentRedirect(`/profile/${username}`)
}
```

## `useRouter`

Для редиректу в event handler Client Component:

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

> Якщо не потрібна програмна навігація — використовуйте `<Link>`.

## `redirects` в `next.config.js`

Статичні редиректи, відомі заздалегідь:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
```

> Виконуються **перед** Proxy. Ліміт на платформах (наприклад, 1024 на Vercel).

## `NextResponse.redirect` в Proxy

Умовний редирект на основі запиту:

```ts
// proxy.ts
import { NextResponse, NextRequest } from 'next/server'
import { authenticate } from 'auth-provider'

export function proxy(request: NextRequest) {
  const isAuthenticated = authenticate(request)

  if (isAuthenticated) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

## Масштабне управління (1000+ редиректів)

### Bloom filter для оптимізації

1. Зберігайте map редиректів у базі даних або JSON
2. Використовуйте Bloom filter для швидкої перевірки існування
3. При збігу — запитуйте Route Handler для точного редиректу

```ts
// proxy.ts
import { NextResponse, NextRequest } from 'next/server'
import { ScalableBloomFilter } from 'bloom-filters'
import GeneratedBloomFilter from './redirects/bloom-filter.json'

const bloomFilter = ScalableBloomFilter.fromJSON(GeneratedBloomFilter as any)

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (bloomFilter.has(pathname)) {
    const api = new URL(
      `/api/redirects?pathname=${encodeURIComponent(pathname)}`,
      request.nextUrl.origin
    )

    try {
      const redirectData = await fetch(api)
      if (redirectData.ok) {
        const redirectEntry = await redirectData.json()
        if (redirectEntry) {
          const statusCode = redirectEntry.permanent ? 308 : 307
          return NextResponse.redirect(redirectEntry.destination, statusCode)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return NextResponse.next()
}
```

### Route Handler для перевірки

```ts
// app/api/redirects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import redirects from '@/app/redirects/redirects.json'

type RedirectEntry = { destination: string; permanent: boolean }

export function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) return new Response('Bad Request', { status: 400 })

  const redirect = (redirects as Record<string, RedirectEntry>)[pathname]
  if (!redirect) return new Response('No redirect', { status: 400 })

  return NextResponse.json(redirect)
}
```
