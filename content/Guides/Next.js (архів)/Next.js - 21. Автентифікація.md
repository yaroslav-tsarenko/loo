# Автентифікація в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 16. Proxy (Middleware)]], [[Next.js - 20. Форми та валідація]], [[Next.js - 15. Route Handlers]]

Автентифікація — це ключовий елемент захисту даних застосунку. Процес складається з трьох частин:

1. **Автентифікація** — перевірка особи користувача (логін/пароль)
2. **Управління сесіями** — збереження стану авторизації між запитами
3. **Авторизація** — визначення, до яких маршрутів і даних має доступ користувач

## Реєстрація та вхід

Використовуйте елемент `<form>` разом із Server Actions та `useActionState` для захоплення облікових даних.

### 1. Захоплення облікових даних

```tsx
// app/ui/signup-form.tsx
import { signup } from '@/app/actions/auth'

export function SignupForm() {
  return (
    <form action={signup}>
      <div>
        <label htmlFor="name">Ім'я</label>
        <input id="name" name="name" placeholder="Ім'я" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" />
      </div>
      <div>
        <label htmlFor="password">Пароль</label>
        <input id="password" name="password" type="password" />
      </div>
      <button type="submit">Зареєструватися</button>
    </form>
  )
}
```

```ts
// app/actions/auth.ts
export async function signup(formData: FormData) {}
```

### 2. Валідація полів на сервері

Використовуйте бібліотеку валідації схем, наприклад Zod:

```ts
// app/lib/definitions.ts
import * as z from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Ім\'я має містити щонайменше 2 символи.' })
    .trim(),
  email: z.email({ error: 'Введіть дійсний email.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Мінімум 8 символів' })
    .regex(/[a-zA-Z]/, { error: 'Має містити хоча б одну літеру.' })
    .regex(/[0-9]/, { error: 'Має містити хоча б одну цифру.' })
    .regex(/[^a-zA-Z0-9]/, { error: 'Має містити хоча б один спецсимвол.' })
    .trim(),
})

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined
```

```ts
// app/actions/auth.ts
import { SignupFormSchema, FormState } from '@/app/lib/definitions'

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Виклик API провайдера або бази даних...
}
```

### 3. Відображення помилок валідації

Використовуйте `useActionState` для відображення помилок під час відправки форми:

```tsx
// app/ui/signup-form.tsx
'use client'

import { signup } from '@/app/actions/auth'
import { useActionState } from 'react'

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Ім'я</label>
        <input id="name" name="name" placeholder="Ім'я" />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <div>
        <label htmlFor="password">Пароль</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <p>Пароль повинен:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <button disabled={pending} type="submit">Зареєструватися</button>
    </form>
  )
}
```

### 4. Створення користувача

```tsx
// app/actions/auth.ts
export async function signup(state: FormState, formData: FormData) {
  // 1. Валідація полів
  // ...

  // 2. Підготовка даних
  const { name, email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Вставка в базу даних
  const data = await db
    .insert(users)
    .values({ name, email, password: hashedPassword })
    .returning({ id: users.id })

  const user = data[0]

  if (!user) {
    return { message: 'Помилка при створенні акаунту.' }
  }

  // 4. Створення сесії
  await createSession(user.id)
  // 5. Редирект
  redirect('/profile')
}
```

## Управління сесіями

Два типи сесій:

| Тип | Опис | Переваги | Недоліки |
|-----|------|----------|----------|
| **Stateless** | Дані зберігаються в cookies | Простіше | Менш безпечно |
| **Database** | Дані в БД, в cookies — зашифрований ID | Безпечніше | Складніше |

### Stateless-сесії

#### 1. Генерація секретного ключа

```bash
openssl rand -base64 32
```

```bash
# .env
SESSION_SECRET=your_secret_key
```

#### 2. Шифрування та дешифрування

Використовуйте бібліотеку Jose (сумісна з Edge Runtime):

```ts
// app/lib/session.ts
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { SessionPayload } from '@/app/lib/definitions'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Не вдалося верифікувати сесію')
  }
}
```

> Payload повинен містити мінімум даних: ID користувача, роль тощо. Не зберігайте персональні дані (email, телефон, пароль).

#### 3. Встановлення cookies

```ts
// app/lib/session.ts
import 'server-only'
import { cookies } from 'next/headers'

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

Рекомендовані опції cookies:

- **HttpOnly** — JavaScript на клієнті не має доступу
- **Secure** — передача тільки через HTTPS
- **SameSite** — контроль cross-site запитів
- **Max-Age / Expires** — автовидалення через певний час

#### Оновлення сесії

```ts
// app/lib/session.ts
import 'server-only'
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}
```

#### Видалення сесії

```ts
// app/lib/session.ts
import 'server-only'
import { cookies } from 'next/headers'

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
```

```ts
// app/actions/auth.ts
import { deleteSession } from '@/app/lib/session'

export async function logout() {
  await deleteSession()
  redirect('/login')
}
```

### Database-сесії

```ts
// app/lib/session.ts
import { cookies } from 'next/headers'
import { db } from '@/app/lib/db'
import { encrypt } from '@/app/lib/session'

export async function createSession(id: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // 1. Створення сесії в базі даних
  const data = await db
    .insert(sessions)
    .values({ userId: id, expiresAt })
    .returning({ id: sessions.id })

  const sessionId = data[0].id

  // 2. Шифрування session ID
  const session = await encrypt({ sessionId, expiresAt })

  // 3. Збереження в cookies
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

## Авторизація

Два типи перевірок:

1. **Оптимістичні** — перевірка даних із cookie (швидкі, для UI)
2. **Безпечні** — перевірка даних із бази даних (надійні, для операцій із даними)

### Оптимістичні перевірки з Proxy

```ts
// proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

> Proxy не повинен бути єдиним рівнем захисту. Основні перевірки — якомога ближче до джерела даних.

### Data Access Layer (DAL)

Централізуйте логіку авторизації:

```ts
// app/lib/dal.ts
import 'server-only'
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import { cache } from 'react'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId }
})
```

Використовуйте `verifySession()` у запитах даних, Server Actions, Route Handlers:

```ts
// app/lib/dal.ts
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      columns: { id: true, name: true, email: true },
    })
    return data[0]
  } catch (error) {
    console.log('Не вдалося отримати користувача')
    return null
  }
})
```

### Data Transfer Objects (DTO)

Повертайте тільки необхідні дані:

```ts
// app/lib/dto.ts
import 'server-only'
import { getUser } from '@/app/lib/dal'

function canSeeUsername(viewer: User) {
  return true
}

function canSeePhoneNumber(viewer: User, team: string) {
  return viewer.isAdmin || team === viewer.team
}

export async function getProfileDTO(slug: string) {
  const data = await db.query.users.findMany({
    where: eq(users.slug, slug),
  })
  const user = data[0]
  const currentUser = await getUser(user.id)

  return {
    username: canSeeUsername(currentUser) ? user.username : null,
    phonenumber: canSeePhoneNumber(currentUser, user.team)
      ? user.phonenumber
      : null,
  }
}
```

### Авторизація в Server Components

```tsx
// app/dashboard/page.tsx
import { verifySession } from '@/app/lib/dal'

export default async function Dashboard() {
  const session = await verifySession()
  const userRole = session?.user?.role

  if (userRole === 'admin') {
    return <AdminDashboard />
  } else if (userRole === 'user') {
    return <UserDashboard />
  } else {
    redirect('/login')
  }
}
```

### Авторизація в Server Actions

```ts
// app/lib/actions.ts
'use server'
import { verifySession } from '@/app/lib/dal'

export async function serverAction(formData: FormData) {
  const session = await verifySession()
  const userRole = session?.user?.role

  if (userRole !== 'admin') {
    return null
  }

  // Дія для авторизованих користувачів
}
```

### Авторизація в Route Handlers

```ts
// app/api/route.ts
import { verifySession } from '@/app/lib/dal'

export async function GET() {
  const session = await verifySession()

  if (!session) {
    return new Response(null, { status: 401 })
  }

  if (session.user.role !== 'admin') {
    return new Response(null, { status: 403 })
  }

  // Продовження для авторизованих
}
```

## Бібліотеки автентифікації

- **Auth0** — хмарний сервіс автентифікації
- **Better Auth** — гнучке рішення для Next.js
- **Clerk** — повноцінна платформа з UI-компонентами
- **NextAuth.js** — популярна open-source бібліотека
- **Supabase** — автентифікація + база даних
- **Stack Auth** — open-source альтернатива Clerk

## Бібліотеки управління сесіями

- **Iron Session** — шифровані stateless-сесії
- **Jose** — JWT для Edge Runtime
