# Обробка помилок у Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 07. Мутація даних]], [[Next.js - 20. Форми та валідація]], [[Next.js - 02. Структура проєкту]]

Помилки поділяються на дві категорії: **очікувані помилки** та **неперехоплені винятки**.

## Обробка очікуваних помилок

Очікувані помилки — ті, що виникають при нормальній роботі: валідація форм, невдалі запити тощо. Їх потрібно явно обробляти та повертати клієнту.

### Server Functions

Використовуйте `useActionState` для обробки. Замість `try/catch` — моделюйте помилки як повернені значення:

```ts
// app/actions.ts
'use server'

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')

  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: { title, content },
  })

  if (!res.ok) {
    return { message: 'Не вдалося створити пост' }
  }
}
```

```tsx
// app/ui/form.tsx
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions'

const initialState = { message: '' }

export function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="title">Заголовок</label>
      <input type="text" id="title" name="title" required />
      <label htmlFor="content">Зміст</label>
      <textarea id="content" name="content" required />
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button disabled={pending}>Створити пост</button>
    </form>
  )
}
```

### Server Components

Перевіряйте відповідь та умовно рендеріть помилку:

```tsx
export default async function Page() {
  const res = await fetch('https://...')
  const data = await res.json()

  if (!res.ok) {
    return 'Сталася помилка.'
  }

  return '...'
}
```

### Not Found (404)

Використовуйте функцію `notFound()` та файл `not-found.js`:

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <div>{post.title}</div>
}
```

```tsx
// app/blog/[slug]/not-found.tsx
export default function NotFound() {
  return <div>404 - Сторінку не знайдено</div>
}
```

## Обробка неперехоплених винятків

Неперехоплені винятки — це несподівані помилки (баги). Вони обробляються через **Error Boundaries**.

### Вкладені Error Boundaries

Створіть `error.js` в сегменті маршруту:

```tsx
// app/dashboard/error.tsx
'use client' // Error boundaries МАЮТЬ бути Client Components

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Щось пішло не так!</h2>
      <button onClick={() => unstable_retry()}>
        Спробувати знову
      </button>
    </div>
  )
}
```

Помилки спливають до найближчого батьківського error boundary. Розміщуйте `error.tsx` на різних рівнях ієрархії маршрутів для гранулярної обробки.

### Компонентний Error Boundary з `catchError`

```tsx
// app/custom-error-boundary.tsx
'use client'

import { unstable_catchError as catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(
  props: { title: string },
  { error, unstable_retry }: ErrorInfo
) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{error.message}</p>
      <button onClick={() => unstable_retry()}>Спробувати знову</button>
    </div>
  )
}

export default catchError(ErrorFallback)
```

Використання:

```tsx
import ErrorBoundary from './custom-error-boundary'

export default function Component({ children }) {
  return <ErrorBoundary title="Помилка дашборду">{children}</ErrorBoundary>
}
```

### Помилки в обробниках подій

Error boundaries не ловлять помилки в обробниках подій. Обробляйте їх вручну:

```tsx
'use client'

import { useState } from 'react'

export function Button() {
  const [error, setError] = useState(null)

  const handleClick = () => {
    try {
      throw new Error('Виняток')
    } catch (reason) {
      setError(reason)
    }
  }

  if (error) {
    return <div>Сталася помилка</div>
  }

  return <button onClick={handleClick}>Натисни</button>
}
```

> Помилки всередині `startTransition` з `useTransition` **спливають** до найближчого error boundary.

### Глобальні помилки

Для обробки помилок у кореневому layout використовуйте `global-error.js`:

```tsx
// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <html>
      <body>
        <h2>Щось пішло не так!</h2>
        <button onClick={() => unstable_retry()}>Спробувати знову</button>
      </body>
    </html>
  )
}
```

> `global-error` повинен визначати власні теги `<html>` та `<body>`, оскільки він замінює кореневий layout.
