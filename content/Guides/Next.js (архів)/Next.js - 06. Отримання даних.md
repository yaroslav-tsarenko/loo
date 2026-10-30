# Отримання даних у Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 05. Серверні та клієнтські компоненти]], [[Next.js - 08. Кешування]], [[Next.js - 07. Мутація даних]]

## Server Components

### З використанням `fetch` API

Зробіть компонент асинхронним та await-іть `fetch`:

```tsx
// app/blog/page.tsx
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

Важливі моменти:
- Ідентичні `fetch`-запити в дереві React **мемоїзуються** — можна fetch-ити в компоненті, який потребує даних, замість прокидання пропсів
- `fetch`-запити **не кешуються** за замовчуванням і блокують рендеринг сторінки до завершення
- Для кешування використовуйте директиву `use cache`, для streaming — обгорніть компонент в `<Suspense>`

### З використанням ORM або бази даних

Server Components рендеряться на сервері — облікові дані не потраплять у клієнтський бандл:

```tsx
// app/blog/page.tsx
import { db, posts } from '@/lib/db'

export default async function Page() {
  const allPosts = await db.select().from(posts)
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## Streaming

Streaming розбиває сторінку на менші шматки та прогресивно відправляє їх від сервера до клієнта.

### З `loading.js`

Створіть `loading.js` у тій самій папці, що й сторінка, для streaming **всієї сторінки**:

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <div>Завантаження...</div>
}
```

При навігації користувач одразу бачить layout та стан завантаження. Новий контент автоматично підміняється після завершення рендерингу.

За лаштунками `loading.js` вкладається в `layout.js` та автоматично обгортає `page.js` в `<Suspense>`.

> Layout, що звертається до некешованих або runtime даних (наприклад, `cookies()`, `headers()`), не потрапляє під `loading.js` того ж сегменту — він блокує навігацію. Обгорніть некешований доступ в окремий `<Suspense>`.

### З `<Suspense>`

`<Suspense>` дозволяє більш гранулярно контролювати, які частини сторінки стримити:

```tsx
// app/blog/page.tsx
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'

export default function BlogPage() {
  return (
    <div>
      {/* Цей контент відправляється клієнту одразу */}
      <header>
        <h1>Ласкаво просимо до блогу</h1>
        <p>Читайте останні пости нижче.</p>
      </header>
      <main>
        {/* Динамічний контент стримиться */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

### Створення значущих станів завантаження

Проєктуйте стани завантаження, що допомагають користувачу зрозуміти, що застосунок реагує: скелетони, спінери, або невеликі, але значущі частини майбутнього екрану.

## Client Components

### Streaming з `use` API

Отримайте дані в Server Component і передайте Promise як пропс у Client Component:

```tsx
// app/blog/page.tsx — Server Component
import Posts from '@/app/ui/posts'
import { Suspense } from 'react'

export default function Page() {
  const posts = getPosts() // НЕ await-імо!
  return (
    <Suspense fallback={<div>Завантаження...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

```tsx
// app/ui/posts.tsx — Client Component
'use client'
import { use } from 'react'

export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>
}) {
  const allPosts = use(posts)
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### Бібліотеки (SWR, React Query)

```tsx
'use client'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function BlogPage() {
  const { data, error, isLoading } = useSWR(
    'https://api.vercel.app/blog',
    fetcher
  )

  if (isLoading) return <div>Завантаження...</div>
  if (error) return <div>Помилка: {error.message}</div>

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## Патерни отримання даних

### Послідовне отримання

Один запит залежить від результату іншого:

```tsx
export default async function Page({ params }) {
  const { username } = await params
  const artist = await getArtist(username)

  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<div>Завантаження...</div>}>
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  )
}

async function Playlists({ artistID }: { artistID: string }) {
  const playlists = await getArtistPlaylists(artistID)
  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  )
}
```

### Паралельне отримання

Запити не залежать один від одного — використовуйте `Promise.all`:

```tsx
export default async function Page({ params }) {
  const { username } = await params

  // Ініціюємо обидва запити одночасно
  const artistData = getArtist(username)
  const albumsData = getAlbums(username)

  // Чекаємо на обидва
  const [artist, albums] = await Promise.all([artistData, albumsData])

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  )
}
```

> Якщо один запит зазнає невдачі при `Promise.all`, вся операція провалиться. Використовуйте `Promise.allSettled` для обробки часткових невдач.

### Спільне використання даних з `React.cache`

Створіть кешовану функцію, що отримує дані:

```ts
// app/lib/user.ts
import { cache } from 'react'

export const getUser = cache(async () => {
  const res = await fetch('https://api.example.com/user')
  return res.json()
})
```

`React.cache` обмежений поточним запитом — кожен запит має свою область мемоїзації без спільного використання між запитами.
