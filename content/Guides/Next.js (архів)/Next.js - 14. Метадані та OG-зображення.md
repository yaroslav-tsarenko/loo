# Метадані та OG-зображення в Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 02. Структура проєкту]], [[Next.js - 06. Отримання даних]]

Metadata API покращує SEO та шерінг у соцмережах. Три способи:
1. Статичний об'єкт `metadata`
2. Динамічна функція `generateMetadata`
3. Файлові конвенції (favicon, OG-зображення)

Next.js автоматично генерує відповідні `<head>` теги.

## Поля за замовчуванням

Завжди додаються автоматично:

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## Статичні метадані

Експортуйте об'єкт `metadata` з `layout.js` або `page.js`:

```tsx
// app/blog/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Мій блог',
  description: 'Блог про веб-розробку',
}

export default function Layout({ children }) {
  return <>{children}</>
}
```

## Динамічні метадані

Використовуйте `generateMetadata` для метаданих, що залежать від даних:

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json()
  )

  return {
    title: post.title,
    description: post.description,
  }
}

export default function Page({ params }: Props) {
  // ...
}
```

### Streaming метаданих

Для динамічних сторінок Next.js стрімить метадані окремо — UI рендериться, не чекаючи на `generateMetadata`. Для ботів та кроулерів streaming вимкнений (вони очікують метадані в `<head>`).

### Мемоїзація запитів даних

Якщо ті ж дані потрібні для метаданих і сторінки — використовуйте `React.cache` (див. [[Next.js - 06. Отримання даних#Спільне використання даних з `React.cache`|мемоїзація даних]]):

```ts
import { cache } from 'react'

export const getPost = cache(async (slug: string) => {
  const res = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
  return res
})
```

## Файлові метадані

### Favicon

Створіть `favicon.ico` в корені папки `app` (див. [[Next.js - 02. Структура проєкту#Метадані файлів|структуру проєкту]]).

### Статичні OG-зображення

Створіть файл `opengraph-image.jpg` у папці `app` або в конкретному маршруті:

> [!diagram] Яке OG-зображення отримає сторінка
> ```yaml
> layout: tree
> nodes:
>   - { id: app, text: "app/", tone: violet, icon: "si:SiNextdotjs" }
>   - { id: og1, text: "opengraph-image.jpg", note: "глобальне", parent: app, tone: blue, icon: "px:image" }
>   - { id: blog, text: "blog/", note: "сегмент /blog", parent: app, tone: gray, icon: "pi:PiFoldersFill" }
>   - { id: og2, text: "opengraph-image.jpg", note: "для /blog", parent: blog, tone: green, icon: "px:image" }
> steps:
>   - { show: [app, og1], note: "Кладемо opengraph-image.jpg прямо в app/ — це глобальне прев'ю для всіх сторінок." }
>   - { move: { from: app, to: og1, value: "/" }, note: "Головна / свого зображення не має, тож бере глобальне." }
>   - { show: [blog, og2], note: "У папці blog/ лежить своє opengraph-image.jpg." }
>   - { move: { from: blog, to: og2, value: "/blog" }, note: "Для /blog знайшлись обидва, але виграє специфічніше — зображення з blog/. Next.js сам додасть потрібні og:image теги." }
> ```

Більш специфічне зображення має пріоритет.

Підтримувані формати: `.jpg`, `.jpeg`, `.png`, `.gif`.

### Генерація OG-зображень кодом

Використовуйте `ImageResponse` з `next/og` для динамічних OG-зображень:

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getPost } from '@/app/lib/data'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    )
  )
}
```

`ImageResponse` підтримує flexbox, абсолютне позиціонування, кастомні шрифти, перенесення тексту, вкладені зображення.

## Інші файлові конвенції

| Файл | Призначення |
|------|------------|
| `sitemap.xml` / `sitemap.ts` | Карта сайту |
| `robots.txt` / `robots.ts` | Правила для ботів |
| `favicon.ico` | Іконка сайту |
| `icon.png` / `icon.tsx` | Іконка застосунку |
| `apple-icon.png` | Іконка для Apple |
