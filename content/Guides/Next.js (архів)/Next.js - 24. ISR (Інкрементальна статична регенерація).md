# ISR (Інкрементальна статична регенерація)

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 08. Кешування]], [[Next.js - 11. Ревалідація]], [[Next.js - 17. Деплоймент]]

ISR дозволяє:

- Оновлювати статичний контент без повної перезбірки сайту
- Зменшити навантаження на сервер — більшість запитів обслуговуються статичними сторінками
- Автоматично додавати правильні `cache-control` заголовки
- Обробляти великі обсяги контенту без довгих `next build`

## Мінімальний приклад

```tsx
// app/blog/[id]/page.tsx
interface Post {
  id: string
  title: string
  content: string
}

// Next.js інвалідує кеш при запиті, максимум раз на 60 секунд
export const revalidate = 60

export async function generateStaticParams() {
  const posts: Post[] = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )
  return posts.map((post) => ({ id: String(post.id) }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post: Post = await fetch(`https://api.vercel.app/blog/${id}`).then(
    (res) => res.json()
  )
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
```

Як це працює:

1. Під час `next build` генеруються всі відомі пости
2. Запити до цих сторінок (наприклад, `/blog/1`) кешуються і миттєві
3. Після 60 секунд наступний запит повертає кешовану (застарілу) сторінку
4. Кеш інвалідується, нова версія генерується у фоні
5. Після успішної генерації наступний запит отримає оновлену сторінку
6. Якщо запитується `/blog/26` і він існує — сторінка генерується on-demand

## Ревалідація на основі часу

```tsx
// app/blog/page.tsx
export const revalidate = 3600 // інвалідація щогодини

export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <main>
      <h1>Блог</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  )
}
```

> Рекомендуємо встановлювати високий час ревалідації (наприклад, 1 годину). Для точнішого контролю використовуйте on-demand ревалідацію.

## On-demand ревалідація з `revalidatePath`

Інвалідація кешу за запитом через Server Action:

```ts
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  revalidatePath('/posts')
}
```

> `revalidatePath` інвалідує кеш, але регенерація відбувається при наступному запиті. Якщо потрібна негайна регенерація — використовуйте Pages Router `res.revalidate`.

## On-demand ревалідація з `revalidateTag`

Для гранулярного контролю — тегування окремих `fetch`:

```tsx
// app/blog/page.tsx
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog', {
    next: { tags: ['posts'] },
  })
  const posts = await data.json()
  // ...
}
```

З ORM або базою даних — через `unstable_cache`:

```tsx
import { unstable_cache } from 'next/cache'
import { db, posts } from '@/lib/db'

const getCachedPosts = unstable_cache(
  async () => {
    return await db.select().from(posts)
  },
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
)
```

Інвалідація тегу:

```ts
// app/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() {
  revalidateTag('posts')
}
```

## Обробка помилок

Якщо помилка виникає під час ревалідації — останні успішно згенеровані дані продовжують обслуговуватися з кешу. Next.js повторить спробу при наступному запиті.

## Налагодження

### Логування fetch-запитів

```js
// next.config.js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

### Перевірка продакшен-поведінки

```bash
# .env
NEXT_PRIVATE_DEBUG_CACHE=1
```

Виконайте `next build` та `next start` для тестування ISR локально.

## Застереження

- ISR підтримується тільки з Node.js runtime (за замовчуванням)
- Не підтримується зі Static Export
- При кількох `fetch` з різними `revalidate` — використовується найменший час
- Якщо будь-який `fetch` має `revalidate: 0` або `no-store` — маршрут буде динамічним
- Proxy не виконується для on-demand ISR запитів
- При кількох інстансах — файловий кеш є per-instance. Використовуйте спільний cache handler

## Підтримка платформ

| Варіант деплою | Підтримка |
|----------------|-----------|
| Node.js сервер | Так |
| Docker контейнер | Так |
| Static export | Ні |
| Adapters | Залежить від платформи |
