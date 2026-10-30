# Route Handlers у Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 02. Структура проєкту]], [[Next.js - 07. Мутація даних]], [[Next.js - 08. Кешування]]

Route Handlers дозволяють створювати кастомні обробники запитів за допомогою Web API `Request` та `Response`.

## Конвенція

Визначаються у файлі `route.js` або `route.ts` всередині директорії `app`:

```ts
// app/api/route.ts
export async function GET(request: Request) {
  return Response.json({ message: 'Hello!' })
}
```

Route Handlers можуть бути вкладені будь-де в `app`, але **не можуть** існувати на тому ж рівні, що й `page.js`:

| Page | Route | Результат |
|------|-------|-----------|
| `app/page.js` | `app/route.js` | Конфлікт |
| `app/page.js` | `app/api/route.js` | OK |

## Підтримувані HTTP-методи

`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`

Непідтримуваний метод повертає `405 Method Not Allowed`.

## Розширені API

Next.js надає `NextRequest` та `NextResponse` з додатковими хелперами поверх нативних `Request`/`Response`.

## Кешування

Route Handlers **не кешуються** за замовчуванням.

### Без Cache Components

Для кешування `GET`-методу використовуйте `force-static`:

```ts
// app/items/route.ts
export const dynamic = 'force-static'

export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()
  return Response.json({ data })
}
```

### З Cache Components

Коли ввімкнено [[Next.js - 08. Кешування#Увімкнення Cache Components|Cache Components]], `GET` Route Handlers слідують тій же моделі, що й UI-маршрути:

**Статичний** — без runtime даних, prerender при збірці:
```ts
export async function GET() {
  return Response.json({ projectName: 'Next.js' })
}
```

**Динамічний** — доступ до runtime API:
```ts
import { headers } from 'next/headers'

export async function GET() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  return Response.json({ userAgent })
}
```

**Кешований** — `use cache` в допоміжній функції:
```ts
import { cacheLife } from 'next/cache'

export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}

async function getProducts() {
  'use cache'
  cacheLife('hours')
  return await db.query('SELECT * FROM products')
}
```

> `use cache` не можна використовувати безпосередньо в тілі Route Handler — виносьте в окрему функцію.

## Контекст маршруту

Для типізації параметрів використовуйте хелпер `RouteContext`:

```ts
import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/users/[id]'>) {
  const { id } = await ctx.params
  return Response.json({ id })
}
```

## Спеціальні Route Handlers

`sitemap.ts`, `opengraph-image.tsx`, `icon.tsx` та інші [[Next.js - 14. Метадані та OG-зображення|метадані файли]] залишаються статичними за замовчуванням.

## Route Handler vs Server Actions

| | Route Handler | [[Next.js - 07. Мутація даних|Server Actions]] |
|---|---|---|
| **Коли** | Зовнішні API, webhook, REST endpoints | Форми, мутації, UI-дії |
| **Методи** | GET, POST, PUT, DELETE... | Тільки POST |
| **UI** | Без React-рендерингу | Інтегровані з UI |
