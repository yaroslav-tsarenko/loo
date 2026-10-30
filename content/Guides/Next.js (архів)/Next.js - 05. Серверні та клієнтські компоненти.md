# Серверні та клієнтські компоненти

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 06. Отримання даних]], [[Next.js - 07. Мутація даних]], [[Next.js - 19. Змінні середовища]]

За замовчуванням layouts та pages — це **Server Components**. Вони дозволяють отримувати дані та рендерити UI на сервері. Коли потрібна інтерактивність або браузерні API — використовуйте **Client Components**.

## Коли що використовувати

**Client Components** — коли потрібні:
- Стан (`useState`) та обробники подій (`onClick`, `onChange`)
- Lifecycle-логіка (`useEffect`)
- Браузерні API (`localStorage`, `window`, `geolocation`)
- Кастомні хуки

**Server Components** — коли потрібно:
- Отримувати дані з бази даних або API
- Використовувати API-ключі та секрети (не потрапляють на клієнт)
- Зменшити обсяг JavaScript для браузера
- Покращити First Contentful Paint (FCP)

## Приклад: серверний + клієнтський компоненти

```tsx
// app/[id]/page.tsx — Server Component
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```

```tsx
// app/ui/like-button.tsx — Client Component
'use client'

import { useState } from 'react'

export default function LikeButton({ likes }: { likes: number }) {
  const [count, setCount] = useState(likes)
  return (
    <button onClick={() => setCount(count + 1)}>
      {count} вподобань
    </button>
  )
}
```

## Як це працює

### На сервері

- **Server Components** рендеряться у RSC Payload (компактне бінарне представлення)
- **Client Components** + RSC Payload використовуються для попереднього рендерингу HTML

### На клієнті (перше завантаження)

1. **HTML** — миттєвий неінтерактивний попередній перегляд
2. **RSC Payload** — узгодження дерев Client та Server Components
3. **JavaScript** — гідратація Client Components (UI стає інтерактивним)

### Наступні навігації

- **RSC Payload** — prefetch та кешування для миттєвої навігації
- **Client Components** рендеряться повністю на клієнті

## Створення Client Component

Додайте директиву `'use client'` на початку файлу:

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>{count} кліків</p>
      <button onClick={() => setCount(count + 1)}>Натисни</button>
    </div>
  )
}
```

`'use client'` оголошує **межу** між серверним та клієнтським модульними графами. Всі імпорти та дочірні компоненти цього файлу автоматично стають частиною клієнтського бандлу.

## Зменшення розміру JS-бандлу

Додавайте `'use client'` тільки до конкретних інтерактивних компонентів:

```tsx
// app/layout.tsx — Server Component
import Search from './search'   // Client Component
import Logo from './logo'       // Server Component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

## Передача даних від серверних до клієнтських компонентів

Використовуйте пропси. Пропси повинні бути серіалізовуваними React:

```tsx
// Server Component
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({ params }) {
  const { id } = await params
  const post = await getPost(id)
  return <LikeButton likes={post.likes} />
}
```

## Переплітання Server та Client Components

Передайте Server Component як пропс `children` в Client Component:

```tsx
// app/ui/modal.tsx — Client Component
'use client'

export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

```tsx
// app/page.tsx — Server Component
import Modal from './ui/modal'
import Cart from './ui/cart'    // Server Component

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

`<Cart>` рендериться на сервері, а потім передається як дочірній елемент клієнтському `<Modal>`.

## Context Providers

React Context не підтримується в Server Components. Створіть Client Component-обгортку:

```tsx
// app/theme-provider.tsx
'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

```tsx
// app/layout.tsx
import ThemeProvider from './theme-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

> Рендеріть providers якомога глибше в дереві — обгортайте тільки `{children}`, а не весь `<html>`.

## Сторонні компоненти

Якщо сторонній компонент використовує клієнтські фічі без `'use client'`, обгорніть його:

```tsx
// app/carousel.tsx
'use client'

import { Carousel } from 'acme-carousel'
export default Carousel
```

Тепер `<Carousel />` можна використовувати в Server Component.

## Запобігання витоку серверного коду

Змінні середовища без префіксу `NEXT_PUBLIC_` замінюються порожнім рядком на клієнті. Для додаткового захисту використовуйте пакет `server-only`:

```ts
// lib/data.ts
import 'server-only'

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: { authorization: process.env.API_KEY },
  })
  return res.json()
}
```

Спроба імпортувати цей модуль у Client Component викличе помилку збірки.

Аналогічно, `client-only` позначає модулі, що використовують лише клієнтську логіку (наприклад, доступ до `window`).
