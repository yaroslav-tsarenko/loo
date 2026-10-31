# SPA (Single Page Application) в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 05. Серверні та клієнтські компоненти]], [[Next.js - 06. Отримання даних]], [[Next.js - 23. Ліниве завантаження]]

Next.js повністю підтримує створення SPA — швидкі переходи з prefetching, клієнтське отримання даних, браузерні API, інтеграція з клієнтськими бібліотеками.

## Що таке SPA?

**Strict SPA:**
- **Client-side rendering (CSR)** — один HTML-файл (`index.html`), все через JavaScript
- **Без повних перезавантажень** — JavaScript маніпулює DOM та отримує дані

Проблеми strict SPA: великий обсяг JS для завантаження, клієнтські waterfalls даних.

## Переваги Next.js для SPA

- Автоматичний code splitting — менший розмір бандлу
- `next/link` автоматично prefetch маршрутів — миттєві переходи
- Можливість поступового додавання серверних фіч (RSC, Server Actions)

## Паттерни

### Fetch через Context Provider з `use`

Почніть fetch на сервері, передайте Promise через контекст:

```tsx
// app/layout.tsx
import { UserProvider } from './user-provider'
import { getUser } from './user'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let userPromise = getUser() // НЕ await

  return (
    <html lang="uk">
      <body>
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  )
}
```

```ts
// app/user-provider.ts
'use client'

import { createContext, useContext, ReactNode } from 'react'

type User = any
type UserContextType = { userPromise: Promise<User | null> }

const UserContext = createContext<UserContextType | null>(null)

export function useUser(): UserContextType {
  let context = useContext(UserContext)
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export function UserProvider({
  children,
  userPromise,
}: {
  children: ReactNode
  userPromise: Promise<User | null>
}) {
  return (
    <UserContext.Provider value={{ userPromise }}>
      {children}
    </UserContext.Provider>
  )
}
```

```tsx
// app/profile.tsx
'use client'

import { use } from 'react'
import { useUser } from './user-provider'

export function Profile() {
  const { userPromise } = useUser()
  const user = use(userPromise)
  return <div>{user?.name}</div>
}
```

### SPA з SWR

З SWR 2.3.0+ (React 19+) можна поступово переходити від клієнтського fetch до серверного:

```tsx
// app/layout.tsx
import { SWRConfig } from 'swr'
import { getUser } from './user'

export default function RootLayout({ children }) {
  return (
    <SWRConfig
      value={{
        fallback: {
          '/api/user': getUser(), // НЕ await
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
```

```tsx
// app/profile.tsx
'use client'

import useSWR from 'swr'

export function Profile() {
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data, error } = useSWR('/api/user', fetcher)
  return <div>{data?.name}</div>
}
```

| | SWR | RSC | RSC + SWR |
|---|---|---|---|
| SSR data | Ні | Так | Так |
| Streaming | Ні | Так | Так |
| Дедуплікація | Так | Так | Так |
| Клієнтські фічі | Так | Ні | Так |

### Рендеринг тільки в браузері

Для компонентів, що залежать від `window` або `document`:

```jsx
import dynamic from 'next/dynamic'

const ClientOnlyComponent = dynamic(() => import('./component'), {
  ssr: false,
})
```

### Shallow routing

Оновлення URL без перезавантаження через нативні API:

```tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>За зростанням</button>
      <button onClick={() => updateSorting('desc')}>За спаданням</button>
    </>
  )
}
```

### Server Actions у Client Components

Не потрібно створювати API endpoint вручну:

```ts
// app/actions.ts
'use server'

export async function create() {}
```

```tsx
// app/button.tsx
'use client'

import { create } from './actions'

export function Button() {
  return <button onClick={() => create()}>Створити</button>
}
```

## Static Export

Для повністю статичного сайту:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
}

export default nextConfig
```

Переваги:
- Автоматичний code splitting (HTML-файл для кожного маршруту)
- Повністю відрендерені сторінки замість мінімального скелетону
- Миттєві клієнтські переходи

> Серверні функції Next.js не підтримуються зі static export.

## Міграція

- [[Next.js - 18. Оновлення версії]] — загальна міграція
- Міграція з Create React App — поступовий перехід
- Міграція з Vite — інкрементальна адаптація
