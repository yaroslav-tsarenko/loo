# Draft Mode в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 24. ISR (Інкрементальна статична регенерація)]], [[Next.js - 15. Route Handlers]]

Draft Mode дозволяє переглядати чернетки з headless CMS. Статичні сторінки перемикаються на динамічний рендеринг без повної перезбірки.

## Крок 1: Створення Route Handler

```ts
// app/api/draft/route.ts
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.enable()
  return new Response('Draft mode увімкнено')
}
```

Це встановлює cookie `__prerender_bypass`.

## Крок 2: Безпечний доступ з CMS

1. Створіть секретний токен
2. Налаштуйте URL чернетки в CMS: `https://<site>/api/draft?secret=<token>&slug=<path>`
3. Перевіряйте секрет у Route Handler:

```ts
// app/api/draft/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== 'MY_SECRET_TOKEN' || !slug) {
    return new Response('Невірний токен', { status: 401 })
  }

  const post = await getPostBySlug(slug)
  if (!post) {
    return new Response('Невірний slug', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()
  redirect(post.slug)
}
```

## Крок 3: Перегляд чернеток

```tsx
// app/page.tsx
import { draftMode } from 'next/headers'

async function getData() {
  const { isEnabled } = await draftMode()

  const url = isEnabled
    ? 'https://draft.example.com'
    : 'https://production.example.com'

  const res = await fetch(url)
  return res.json()
}

export default async function Page() {
  const { title, desc } = await getData()

  return (
    <main>
      <h1>{title}</h1>
      <p>{desc}</p>
    </main>
  )
}
```

Коли `isEnabled` — `true`, дані запитуються під час запиту (а не при збірці).
