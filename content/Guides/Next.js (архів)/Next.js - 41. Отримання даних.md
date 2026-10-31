# Отримання даних у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 22. Стрімінг]], [[Next.js - 24. ISR (Інкрементальна статична регенерація)]], [[Next.js - 45. Безпека даних]]

## Server Components

### Fetch API

Зробіть компонент асинхронним і використовуйте `await fetch`:

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

> **Важливо:**
> - Ідентичні `fetch` запити в дереві React мемоїзуються автоматично
> - `fetch` не кешується за замовчуванням і блокує рендеринг до завершення
> - Використовуйте `use cache` для кешування або `<Suspense>` для стрімінгу

### ORM або база даних

Server Components рендеряться на сервері — облікові дані та логіка запитів не потрапляють у клієнтський бандл:

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

## Стрімінг

Якщо є повільні запити, вся сторінка блокується. Стрімінг дозволяє відправляти частини UI поступово.

### loading.js

Стрімить **всю сторінку** поки дані завантажуються:

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <div>Завантаження...</div>
}
```

За лаштунками `loading.js` автоматично обгортає `page.js` у `<Suspense>`.

### `<Suspense>`

Більш гранулярний контроль — стрімить окремі частини:

```tsx
// app/blog/page.tsx
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'

export default function BlogPage() {
  return (
    <div>
      <header>
        <h1>Блог</h1>
        <p>Останні публікації</p>
      </header>
      <main>
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

## Client Components

### React `use` API

Передайте проміс з Server Component у Client Component:

```tsx
// app/blog/page.tsx (Server)
import Posts from '@/app/ui/posts'
import { Suspense } from 'react'

export default function Page() {
  const posts = getPosts() // НЕ await
  return (
    <Suspense fallback={<div>Завантаження...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

```tsx
// app/ui/posts.tsx (Client)
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

### SWR / React Query

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

## Паралельне отримання даних

Послідовні `await` блокують один одного. Використовуйте `Promise.all`:

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  // Ініціюємо запити одночасно
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

> Якщо один запит впаде з `Promise.all`, впаде все. Використовуйте `Promise.allSettled` для часткових результатів.

## Послідовне отримання даних

Коли один запит залежить від результату іншого — обгортайте залежний компонент у `<Suspense>`:

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

## Шаринг даних через Context та React.cache

Мемоїзована функція:

```ts
// app/lib/user.ts
import { cache } from 'react'

export const getUser = cache(async () => {
  const res = await fetch('https://api.example.com/user')
  return res.json()
})
```

Context-провайдер зберігає проміс:

```tsx
// app/user-provider.tsx
'use client'
import { createContext } from 'react'

type User = { id: string; name: string }

export const UserContext = createContext<Promise<User> | null>(null)

export default function UserProvider({
  children,
  userPromise,
}: {
  children: React.ReactNode
  userPromise: Promise<User>
}) {
  return <UserContext value={userPromise}>{children}</UserContext>
}
```

Layout передає проміс без `await`:

```tsx
// app/layout.tsx
import UserProvider from './user-provider'
import { getUser } from './lib/user'

export default function RootLayout({ children }) {
  const userPromise = getUser()
  return (
    <html>
      <body>
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  )
}
```

Client Component читає через `use()`:

```tsx
'use client'
import { use, useContext } from 'react'
import { UserContext } from '../user-provider'

export function Profile() {
  const userPromise = useContext(UserContext)
  if (!userPromise) throw new Error('Потрібен UserProvider')
  const user = use(userPromise)
  return <p>Вітаємо, {user.name}</p>
}
```

> `React.cache` мемоїзує в межах одного запиту. Кожен новий запит отримує свій scope.
