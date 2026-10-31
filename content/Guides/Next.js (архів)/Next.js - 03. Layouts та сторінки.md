# Layouts та сторінки в Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 02. Структура проєкту]], [[Next.js - 04. Навігація та посилання]], [[Next.js - 05. Серверні та клієнтські компоненти]]

Next.js використовує **маршрутизацію на основі файлової системи** — папки та файли визначають маршрути.

## Створення сторінки

Сторінка — це UI, що рендериться на конкретному маршруті. Додайте файл `page` в директорію `app` і експортуйте React-компонент:

```tsx
// app/page.tsx — сторінка для маршруту "/"
export default function Page() {
  return <h1>Привіт, Next.js!</h1>
}
```

## Створення Layout

Layout — це UI, що **спільний** для кількох сторінок. При навігації layouts зберігають стан, залишаються інтерактивними і **не перерендерюються**.

```tsx
// app/layout.tsx — кореневий layout (обов'язковий)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

Кореневий layout визначається в корені директорії `app`. Він **обов'язковий** і повинен містити теги `<html>` та `<body>`.

## Вкладені маршрути

Вкладений маршрут складається з кількох сегментів URL. Наприклад, `/blog/[slug]`:

- `/` — кореневий сегмент
- `blog` — сегмент
- `[slug]` — листовий сегмент

Правила:
- **Папки** визначають сегменти маршруту
- **Файли** (`page`, `layout`) створюють UI для сегмента

Приклад — маршрут `/blog`:

```tsx
// app/blog/page.tsx
import { getPosts } from '@/lib/posts'
import { Post } from '@/ui/post'

export default async function Page() {
  const posts = await getPosts()
  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  )
}
```

Для вкладеного маршруту `/blog/[slug]` створіть папку `[slug]` всередині `blog`:

```tsx
// app/blog/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

## Вкладені Layouts

Layouts в ієрархії папок автоматично вкладаються один в одного через пропс `children`:

```tsx
// app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

Кореневий layout (`app/layout.tsx`) обгортає layout блогу (`app/blog/layout.tsx`), який обгортає сторінки блогу.

## Динамічні сегменти

Квадратні дужки `[segmentName]` створюють динамічний сегмент маршруту:

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

> `params` — це Promise, який потрібно await-ити.

## Рендеринг з search params

У серверному компоненті сторінки використовуйте пропс `searchParams`:

```tsx
// app/page.tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
}
```

Використання `searchParams` робить сторінку **динамічно рендереною**.

У клієнтських компонентах використовуйте хук `useSearchParams`.

**Коли що використовувати:**
- `searchParams` (пропс) — коли параметри потрібні для **завантаження даних**
- `useSearchParams` (хук) — коли параметри використовуються **лише на клієнті**
- `new URLSearchParams(window.location.search)` — в **обробниках подій** (без повторного рендерингу)

## Навігація між сторінками

Використовуйте компонент `<Link>` для навігації:

```tsx
import Link from 'next/link'

export default async function Post({ post }) {
  const posts = await getPosts()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

`<Link>` — основний спосіб навігації в Next.js. Він забезпечує prefetching та клієнтську навігацію. Для складнішої навігації використовуйте хук `useRouter`.

## Хелпери типів для маршрутів

Next.js надає утилітні типи для пропсів компонентів маршрутів:

```tsx
// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  return <h1>Пост блогу: {slug}</h1>
}
```

```tsx
// app/dashboard/layout.tsx
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return <section>{props.children}</section>
}
```

`PageProps` та `LayoutProps` — глобальні хелпери, імпорт не потрібний. Типи генеруються при `next dev`, `next build` або `next typegen`.
