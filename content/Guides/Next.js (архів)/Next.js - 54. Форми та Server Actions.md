# Форми та Server Actions у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 45. Безпека даних]], [[Next.js - 21. Автентифікація]]

Server Actions — серверні функції, які можна викликати з `<form>` напряму.

## Базовий приклад

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

> Для багатьох полів: `Object.fromEntries(formData)`.

## Передача додаткових аргументів

Використовуйте `bind`:

```tsx
'use client'
import { updateUser } from './actions'

export function UserProfile({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">Оновити</button>
    </form>
  )
}
```

```ts
// app/actions.ts
'use server'
export async function updateUser(userId: string, formData: FormData) {}
```

## Валідація

### Клієнтська

HTML атрибути: `required`, `type="email"`, `minLength` тощо.

### Серверна (Zod)

```ts
'use server'
import { z } from 'zod'

const schema = z.object({
  email: z.string({ invalid_type_error: 'Невірний Email' }),
})

export default async function createUser(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }
  // Мутація
}
```

## Відображення помилок з useActionState

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
      <button disabled={pending}>Зареєструватись</button>
    </form>
  )
}
```

> Server Action з `useActionState` отримує `prevState` як перший аргумент.

## Стан завантаження

### useActionState — `pending`

```tsx
const [state, formAction, pending] = useActionState(createUser, initialState)
<button disabled={pending}>Надіслати</button>
```

### useFormStatus — окремий компонент

```tsx
'use client'
import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} type="submit">
      Зареєструватись
    </button>
  )
}
```

## Оптимістичні оновлення

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

## Кілька дій у формі

Використовуйте `formAction` на `<button>`:

```tsx
<form>
  <button formAction={saveDraft}>Зберегти чернетку</button>
  <button formAction={publish}>Опублікувати</button>
</form>
```

## Програмна відправка

```tsx
'use client'

export function Entry() {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.key === 'NumpadEnter')) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
}
```
