# Навігація та посилання в Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 03. Layouts та сторінки]], [[Next.js - 05. Серверні та клієнтські компоненти]], [[Next.js - 16. Proxy (Middleware)]]

У Next.js маршрути за замовчуванням рендеряться на сервері. Для швидкої та плавної навігації використовуються вбудовані механізми: **prefetching**, **streaming** та **клієнтські переходи**.

## Як працює навігація

### Серверний рендеринг

Layouts та Pages — це React Server Components за замовчуванням. При навігації RSC Payload (React Server Component Payload) генерується на сервері та відправляється клієнту.

Два типи серверного рендерингу:
- **Prerendering** — відбувається під час збірки або ревалідації, результат кешується
- **Dynamic Rendering** — відбувається в момент запиту від клієнта

### Prefetching (попереднє завантаження)

Prefetching завантажує маршрут у фоні до того, як користувач перейде на нього. Next.js автоматично виконує prefetch для маршрутів, пов'язаних через `<Link>`, коли вони потрапляють у viewport.

```tsx
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <nav>
      {/* Prefetch відбувається при наведенні або появі у viewport */}
      <Link href="/blog">Блог</Link>
      {/* Без prefetch */}
      <a href="/contact">Контакти</a>
    </nav>
  )
}
```

Обсяг prefetch залежить від типу маршруту:
- **Статичний маршрут** — повністю завантажується
- **Динамічний маршрут** — пропускається або частково завантажується (якщо є `loading.tsx`)

### Streaming

Streaming дозволяє серверу відправляти частини динамічного маршруту клієнту в міру готовності, замість очікування повного рендерингу.

Для streaming створіть `loading.tsx` у папці маршруту:

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <LoadingSkeleton />
}
```

Next.js автоматично обгортає `page.tsx` в `<Suspense>`. Переваги:
- Миттєва навігація та візуальний зворотний зв'язок
- Спільні layouts залишаються інтерактивними
- Навігація може бути перервана
- Покращені Core Web Vitals (TTFB, FCP, TTI)

### Клієнтські переходи (Client-side transitions)

Замість повного перезавантаження сторінки, `<Link>` оновлює контент динамічно:
- Зберігає спільні layouts та UI
- Замінює поточну сторінку prefetched loading state або новою сторінкою

## Що може уповільнити переходи

### Динамічні маршрути без `loading.tsx`

Клієнт чекає відповіді сервера. Рекомендується додати `loading.tsx`:

```tsx
// app/blog/[slug]/loading.tsx
export default function Loading() {
  return <LoadingSkeleton />
}
```

### Динамічні сегменти без `generateStaticParams`

Без `generateStaticParams` маршрут рендериться динамічно. Додайте цю функцію для статичної генерації:

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

### Повільні мережі

На повільних мережах prefetch може не встигнути. Використовуйте хук `useLinkStatus` для миттєвого зворотного зв'язку:

```tsx
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span
      aria-hidden
      className={`link-hint ${pending ? 'is-pending' : ''}`}
    />
  )
}
```

Порада: додайте CSS-затримку анімації (наприклад, 100ms), щоб індикатор з'являвся лише при тривалій навігації.

### Вимкнення prefetch

Для великих списків посилань можна вимкнути prefetch:

```tsx
<Link prefetch={false} href="/blog">Блог</Link>
```

Або prefetch тільки при наведенні:

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

function HoverPrefetchLink({ href, children }) {
  const [active, setActive] = useState(false)
  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```

## Native History API

Next.js підтримує нативні методи `window.history.pushState` та `window.history.replaceState`.

### `pushState` — додавання запису в історію

```tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>За зростанням</button>
      <button onClick={() => updateSorting('desc')}>За спаданням</button>
    </>
  )
}
```

### `replaceState` — заміна поточного запису

```tsx
'use client'

import { usePathname } from 'next/navigation'

export function LocaleSwitcher() {
  const pathname = usePathname()

  function switchLocale(locale: string) {
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('uk')}>Українська</button>
      <button onClick={() => switchLocale('en')}>English</button>
    </>
  )
}
```

Обидва методи інтегруються з Next.js Router та синхронізуються з `usePathname` і `useSearchParams`.
