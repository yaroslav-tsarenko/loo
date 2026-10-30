# Prefetching у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 04. Навігація та посилання]], [[Next.js - 58. Кешування]]

Prefetching — завантаження ресурсів маршруту заздалегідь, до навігації. Робить переходи миттєвими.

## Як це працює

Next.js розділяє застосунок на JS-чанки за маршрутами. При prefetching ресурси завантажуються у кеш браузера до кліку.

## Статичні vs динамічні маршрути

| | Статична сторінка | Динамічна сторінка |
|---|---|---|
| **Prefetch** | Так, повний маршрут | Ні, окрім `loading.js` |
| **Client Cache TTL** | 5 хв (за замовчуванням) | Вимкнено |
| **Roundtrip при кліку** | Ні | Так, стрімінг після shell |

## Автоматичний prefetch

```tsx
import Link from 'next/link'

export default function NavLink() {
  return <Link href="/about">Про нас</Link>
}
```

| Контекст | Що prefetch-ується | Client Cache TTL |
|---|---|---|
| Без `loading.js` | Вся сторінка | До перезавантаження |
| З `loading.js` | Layout до першого loading boundary | 30с (налаштовується) |

> Працює лише в production. Вимкнути: `prefetch={false}`.

## Ручний prefetch

```tsx
'use client'
import { useRouter } from 'next/navigation'

export function PricingCard() {
  const router = useRouter()

  return (
    <div onMouseEnter={() => router.prefetch('/pricing')}>
      <CustomLink href="/pricing">Тарифи</CustomLink>
    </div>
  )
}
```

## Prefetch при наведенні

```tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

export function HoverPrefetchLink({ href, children }) {
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

## Вимкнення prefetch

```tsx
<Link prefetch={false} href={`/blog/${post.id}`}>
  {post.title}
</Link>
```

Корисно для великих списків посилань (нескінченний скрол).

## Оптимізації

### Client cache

Prefetch-нуті RSC payload зберігаються в пам'яті по сегментах. Навігація між сусідніми маршрутами перевикористовує батьківський layout.

### Планувальник

Пріоритет prefetch:
1. Посилання у viewport
2. Посилання з наміром (hover/touch)
3. Новіші замінюють старіші
4. Посилання поза viewport відкидаються

## Помилки

### Побічні ефекти при prefetch

Побічні ефекти (аналітика) в layout/page спрацьовують при prefetch, а не при відвідуванні.

**Рішення:** перенесіть у `useEffect`:

```tsx
'use client'
import { useEffect } from 'react'

export function AnalyticsTracker() {
  useEffect(() => {
    trackPageView()
  }, [])
  return null
}
```
