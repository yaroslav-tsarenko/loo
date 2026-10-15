# Стрімінг в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 06. Отримання даних]], [[Next.js - 08. Кешування]], [[Next.js - 09. Обробка помилок]]

## Що таке стрімінг?

При традиційному серверному рендерингу сервер генерує повний HTML перед відправкою. Один повільний запит до бази даних блокує всю сторінку. Стрімінг змінює це — використовує [chunked transfer encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding), відправляючи частини відповіді в міру їх готовності. Браузер починає рендерити HTML, поки сервер ще генерує решту.

Це критично для сторінок, що поєднують швидкий статичний контент (шапка, навігація) з повільним динамічним (персоналізовані дані, рекомендації).

## Як App Router доставляє сторінку

Два потоки працюють разом під час початкового завантаження:

### HTML-потік

React серверний рендерер генерує прогресивні HTML-чанки. Статичні частини (layouts, навігація, Suspense fallbacks) рендеряться першими. Коли async Server Component завершує роботу, React стрімить його HTML разом з inline `<script>` тегами для заміни fallback DOM-вузлів.

### Component payload

Серіалізоване представлення дерева компонентів для гідратації. При початковому завантаженні — вбудований в HTML-потік. При клієнтській навігації — запитується окремо (заголовок `rsc: 1`), HTML не передається.

### Статична оболонка (Static shell)

Все, що рендериться до будь-якої async-роботи — layouts, навігація, fallback UI з `<Suspense>`. Відправляється негайно.

## Стрімінг на рівні сторінки з `loading.js`

Найпростіший спосіб — файл `loading.js` поруч із `page.js`. Next.js автоматично обгортає контент у `<Suspense>`:

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
      <div className="h-4 w-full bg-gray-200 rounded mb-2" />
      <div className="h-4 w-full bg-gray-200 rounded mb-2" />
      <div className="h-4 w-2/3 bg-gray-200 rounded" />
    </div>
  )
}
```

Це означає:
- Layout рендериться негайно як частина статичної оболонки
- Loading-скелетон показується миттєво як Suspense fallback
- Коли page компонент завершує завантаження, його HTML замінює скелетон

## Гранулярний стрімінг з `<Suspense>`

`<Suspense>` дозволяє точно контролювати, які частини сторінки стрімляться незалежно.

### Паралельний стрімінг із sibling boundaries

Кожний компонент обгорнутий окремим `<Suspense>`, і вони стрімляться незалежно:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { Revenue } from './revenue'
import { RecentOrders } from './recent-orders'
import { Recommendations } from './recommendations'

export default function Dashboard() {
  return (
    <div>
      <h1>Панель управління</h1>
      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<p>Завантаження доходів...</p>}>
          <Revenue />
        </Suspense>
        <Suspense fallback={<p>Завантаження замовлень...</p>}>
          <RecentOrders />
        </Suspense>
      </div>
      <Suspense fallback={<p>Завантаження рекомендацій...</p>}>
        <Recommendations />
      </Suspense>
    </div>
  )
}
```

Якщо `Revenue` завершується за 200мс, `RecentOrders` за 1с, `Recommendations` за 3с — користувач бачить кожну секцію щойно її дані готові.

### Вкладені boundaries для прогресивного розкриття

```tsx
// app/product/[id]/page.tsx
import { Suspense } from 'react'
import { ProductDetails } from './product-details'
import { Reviews } from './reviews'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div>
      <h1>Товар</h1>
      <Suspense fallback={<p>Завантаження деталей...</p>}>
        <ProductDetails id={id} />
        <Suspense fallback={<p>Завантаження відгуків...</p>}>
          <Reviews productId={id} />
        </Suspense>
      </Suspense>
    </div>
  )
}
```

### Відкладення динамічного доступу вниз

Ключ до максимізації миттєвого стрімінгу — відкладати доступ до динамічних даних до компонента, який їх потребує. Якщо ви зробите `await` на `params`, `cookies()`, `headers()` у верхній частині layout — все під цим стане динамічним.

Замість цього передайте promise вниз:

```tsx
// app/dashboard/layout.tsx
import { Suspense } from 'react'
import { Nav } from './nav'
import { UserMenu } from './user-menu'
import { cookies } from 'next/headers'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies() // Починаємо роботу, але НЕ await

  return (
    <div>
      <Nav>
        <Suspense fallback={<p>Завантаження користувача...</p>}>
          <UserMenu cookiePromise={cookieStore} />
        </Suspense>
      </Nav>
      {children}
    </div>
  )
}
```

### Порівняння `loading.js` та `<Suspense>`

|                 | `loading.js`                                | `<Suspense>`                       |
| --------------- | ------------------------------------------- | ---------------------------------- |
| **Область**     | Вся сторінка                                | Будь-який компонент                |
| **Налаштування**| Просто створити файл                        | Явно обгорнути компоненти          |
| **Навігація**   | Prefetch як миттєвий fallback               | Не prefetch за замовчуванням       |
| **Найкраще для**| Сторінки без даних для показу               | Гранулярний контроль               |

### Обробка помилок під час стрімінгу

Якщо компонент кидає помилку після початку стрімінгу, найближчий `error.js` boundary перехоплює її. Решта сторінки залишається цілою.

> HTTP статус-код (`200 OK`) вже відправлений з першим чанком — його не можна змінити на `4xx` або `5xx`.

## Передача даних клієнту через стрімінг

Почніть fetch у Server Component і передайте невирішений promise як проп у Client Component:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { StatsChart } from './stats-chart'

async function getStats() {
  const res = await fetch('https://api.example.com/stats')
  return res.json()
}

export default function Dashboard() {
  const statsPromise = getStats() // Не await!

  return (
    <Suspense fallback={<p>Завантаження графіка...</p>}>
      <StatsChart dataPromise={statsPromise} />
    </Suspense>
  )
}
```

```tsx
// app/dashboard/stats-chart.tsx
'use client'

import { use } from 'react'

type Stats = { revenue: number; orders: number }

export function StatsChart({ dataPromise }: { dataPromise: Promise<Stats> }) {
  const stats = use(dataPromise)
  return <div>{/* рендер графіка */}</div>
}
```

## Стрімінг у Route Handlers

Route Handlers можуть стрімити відповіді через Web Streams API:

```ts
// app/api/stream/route.ts
export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(encoder.encode(`Чанк ${i + 1}\n`))
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
```

Стрімінг файлів без повного завантаження в пам'ять:

```ts
// app/api/download/route.ts
import { open } from 'node:fs/promises'

export async function GET() {
  const file = await open('/path/to/large-file.csv')

  return new Response(file.readableWebStream(), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="data.csv"',
    },
  })
}
```

## Стрімінг та Web Vitals

### TTFB та FCP

Без стрімінгу TTFB дорівнює найповільнішому запиту. Зі стрімінгом — сервер відправляє статичну оболонку щойно вона готова. FCP відокремлюється від часу fetch.

### LCP (Largest Contentful Paint)

- Тримайте LCP-елементи **поза** або **над** Suspense boundaries
- Використовуйте `preload` проп у `next/image` для LCP-зображень

### CLS (Cumulative Layout Shift)

- Скелетони мають відповідати розмірам фінального контенту
- Використовуйте `min-height` для контейнерів Suspense boundaries

### INP (Interaction to Next Paint)

Стрімінг дозволяє **селективну гідратацію** — React гідратує компоненти незалежно. Кожен `<Suspense>` boundary — окрема одиниця гідратації.

## HTTP-контракт

Після початку стрімінгу заголовки відповіді (включаючи статус-код) вже відправлені.

- `notFound()` під час стрімінгу → вставляє `<meta name="robots" content="noindex">` замість 404
- `redirect()` під час стрімінгу → клієнтський редирект замість HTTP-редиректу

Щоб отримати реальний HTTP статус-код, розмістіть `notFound()` **перед** будь-яким `await` або `<Suspense>`:

```tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const exists = await checkSlugExists(slug)
  if (!exists) notFound() // Реальний 404, до будь-якого Suspense

  return (
    <Suspense fallback={<p>Завантаження...</p>}>
      <PostContent slug={slug} />
    </Suspense>
  )
}
```

## Що може впливати на стрімінг

- **Reverse proxies** (Nginx) — буферизують відповіді за замовчуванням. Вимкніть: `X-Accel-Buffering: no`
- **CDN** — можуть буферизувати повні відповіді
- **Serverless** — AWS Lambda потребує явного ввімкнення streaming mode
- **Стиснення** — Gzip/Brotli можуть буферизувати чанки
- **Safari/WebKit** — буферизує до 1024 байт

## Підтримка платформ

| Варіант деплою | Підтримка |
|----------------|-----------|
| Node.js сервер | Так |
| Docker контейнер | Так |
| Static export | Ні |
| Adapters | Залежить від платформи |
