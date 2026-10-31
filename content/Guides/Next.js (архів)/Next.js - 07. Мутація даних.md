# Мутація даних у Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 06. Отримання даних]], [[Next.js - 08. Кешування]], [[Next.js - 11. Ревалідація]], [[Next.js - 20. Форми та валідація]]

Мутація даних виконується через **Server Functions** (React Server Functions). Server Action — це Server Function, що використовується для обробки форм та мутацій.

## Що таке Server Functions

Server Function — це асинхронна функція, що виконується на сервері. Клієнт викликає її через мережевий запит (POST).

Server Action — це Server Function, що автоматично обгортається в `startTransition`, коли:
- Передається у `<form>` через пропс `action`
- Передається у `<button>` через пропс `formAction`

> **Безпека:** Server Functions доступні через прямі POST-запити. Завжди перевіряйте автентифікацію та авторизацію всередині кожної Server Function.

## Створення Server Functions

Використовуйте директиву `'use server'`:

```ts
// app/lib/actions.ts
import { auth } from '@/lib/auth'

export async function createPost(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title')
  const content = formData.get('content')

  // Мутація даних
  // Ревалідація кешу
}

export async function deletePost(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')
  // Перевірка, що ресурс належить користувачу
  // Мутація даних
}
```

### В Server Components

Server Functions можна створювати inline:

```tsx
export default function Page() {
  async function createPost(formData: FormData) {
    'use server'
    // ...
  }
  return <></>
}
```

> Server Components підтримують progressive enhancement — форми працюють навіть без JavaScript.

### В Client Components

Не можна **визначати** Server Functions в Client Components, але можна **імпортувати** їх:

```ts
// app/actions.ts
'use server'
export async function createPost() {}
```

```tsx
// app/ui/button.tsx
'use client'
import { createPost } from '@/app/actions'

export function Button() {
  return <button formAction={createPost}>Створити</button>
}
```

## Виклик Server Functions

### Через форми

```tsx
import { createPost } from '@/app/actions'

export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Створити</button>
    </form>
  )
}
```

Функція автоматично отримує об'єкт `FormData`.

### Через обробники подій

```tsx
'use client'

import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <>
      <p>Всього вподобань: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Вподобати
      </button>
    </>
  )
}
```

## Приклади

### Показ стану завантаження

Використовуйте `useActionState` для відображення індикатора:

```tsx
'use client'

import { useActionState, startTransition } from 'react'
import { createPost } from '@/app/actions'

export function Button() {
  const [state, action, pending] = useActionState(createPost, false)

  return (
    <button onClick={() => startTransition(action)}>
      {pending ? 'Завантаження...' : 'Створити пост'}
    </button>
  )
}
```

### Оновлення даних після мутації

Викличте `refresh` з `next/cache`:

```ts
'use server'

import { auth } from '@/lib/auth'
import { refresh } from 'next/cache'

export async function updatePost(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  // Мутація даних...
  refresh()
}
```

`refresh()` оновлює клієнтський роутер. Для ревалідації тегованих даних використовуйте `updateTag` або `revalidateTag`.

### Ревалідація даних

```ts
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  // Мутація даних...
  revalidatePath('/posts')
}
```

### Редирект після мутації

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  // Мутація даних...
  revalidatePath('/posts')
  redirect('/posts')
}
```

> `redirect` кидає виняток — код після нього не виконується. Викликайте `revalidatePath` або `revalidateTag` **до** `redirect`.

### Робота з cookies

```ts
'use server'

import { cookies } from 'next/headers'

export async function exampleAction() {
  const cookieStore = await cookies()

  // Отримати
  cookieStore.get('name')?.value

  // Встановити
  cookieStore.set('name', 'Yaroslav')

  // Видалити
  cookieStore.delete('name')
}
```

При зміні cookies Next.js повторно рендерить поточну сторінку та layouts на сервері.

### Виклик через useEffect

```tsx
'use client'

import { incrementViews } from './actions'
import { useState, useEffect, useTransition } from 'react'

export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const updatedViews = await incrementViews()
      setViews(updatedViews)
    })
  }, [])

  return <p>Переглядів: {views}</p>
}
```
