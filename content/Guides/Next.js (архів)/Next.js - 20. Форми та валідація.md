# Форми та валідація в Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 07. Мутація даних]], [[Next.js - 05. Серверні та клієнтські компоненти]], [[Next.js - 09. Обробка помилок]]

Форми в Next.js обробляються через [[Next.js - 07. Мутація даних#Що таке Server Functions|Server Actions]].

## Як це працює

React розширює HTML `<form>`, дозволяючи Server Actions бути викликаними через атрибут `action`:

```tsx
// app/invoices/page.tsx
import { auth } from '@/lib/auth'

export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server'

    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }
    // мутація даних, ревалідація кешу
  }

  return <form action={createInvoice}>...</form>
}
```

> Для багатьох полів використовуйте `Object.fromEntries(formData)`.

## Передача додаткових аргументів

Використовуйте `bind` для передачі додаткових параметрів:

```tsx
'use client'

import { updateUser } from './actions'

export function UserProfile({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">Оновити ім'я</button>
    </form>
  )
}
```

```ts
// app/actions.ts
'use server'

export async function updateUser(userId: string, formData: FormData) {
  // userId доступний як перший аргумент
}
```

> `bind` працює в Server та Client Components та підтримує progressive enhancement.

## Валідація

### Клієнтська валідація

HTML-атрибути: `required`, `type="email"`, `minLength`, `pattern`.

### Серверна валідація (Zod)

```ts
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string({ invalid_type_error: 'Невалідний email' }),
})

export async function createUser(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  // Мутація даних
}
```

## Відображення помилок валідації

Використовуйте `useActionState` для показу помилок:

```tsx
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = { message: '' }

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      <p aria-live="polite">{state?.message}</p>
      <button disabled={pending}>Зареєструватися</button>
    </form>
  )
}
```

## Стан завантаження (Pending)

### З `useActionState`

```tsx
const [state, formAction, pending] = useActionState(createUser, initialState)

return (
  <form action={formAction}>
    <button disabled={pending}>
      {pending ? 'Завантаження...' : 'Зареєструватися'}
    </button>
  </form>
)
```

### З `useFormStatus`

Для окремого компонента кнопки:

```tsx
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} type="submit">
      {pending ? 'Відправка...' : 'Відправити'}
    </button>
  )
}
```

## Оптимістичні оновлення

Використовуйте `useOptimistic` для миттєвого оновлення UI до завершення серверної дії:

```tsx
'use client'

import { useOptimistic } from 'react'
import { send } from './actions'

export function Thread({ messages }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { message: newMessage }]
  )

  const formAction = async (formData: FormData) => {
    const message = formData.get('message') as string
    addOptimisticMessage(message)
    await send(message)
  }

  return (
    <div>
      {optimisticMessages.map((m, i) => (
        <div key={i}>{m.message}</div>
      ))}
      <form action={formAction}>
        <input type="text" name="message" />
        <button type="submit">Надіслати</button>
      </form>
    </div>
  )
}
```

## Вкладені елементи форми

Використовуйте `formAction` для кількох Server Actions в одній формі:

```tsx
<form>
  <button formAction={saveDraft}>Зберегти чернетку</button>
  <button formAction={publish}>Опублікувати</button>
</form>
```

## Програматична відправка

Використовуйте `requestSubmit()` для відправки клавіатурним шорткатом:

```tsx
'use client'

export function Entry() {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
}
```
