# Ліниве завантаження в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 22. Стрімінг]], [[Next.js - 05. Серверні та клієнтські компоненти]]

Ліниве завантаження покращує початкову продуктивність, зменшуючи обсяг JavaScript для рендерингу маршруту. Дозволяє відкласти завантаження **Client Components** та бібліотек до моменту їх потреби.

Два способи реалізації:

1. **Dynamic Imports** з `next/dynamic`
2. **`React.lazy()`** із `Suspense`

> Server Components автоматично розбиваються на частини (code split). Ліниве завантаження стосується Client Components.

## `next/dynamic`

Композит `React.lazy()` та `Suspense`. Працює однаково в `app` та `pages` директоріях.

## Приклади

### Імпорт Client Components

```jsx
// app/page.js
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Client Components:
const ComponentA = dynamic(() => import('../components/A'))
const ComponentB = dynamic(() => import('../components/B'))
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })

export default function ClientComponentExample() {
  const [showMore, setShowMore] = useState(false)

  return (
    <div>
      {/* Завантажується одразу, але в окремому бандлі */}
      <ComponentA />

      {/* Завантажується за потребою */}
      {showMore && <ComponentB />}
      <button onClick={() => setShowMore(!showMore)}>Перемкнути</button>

      {/* Завантажується тільки на клієнті */}
      <ComponentC />
    </div>
  )
}
```

### Пропуск SSR

Вимкніть попередній рендеринг для Client Component за допомогою опції `ssr: false`:

```jsx
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })
```

> `ssr: false` працює тільки для Client Components. Не підтримується в Server Components.

### Імпорт Server Components

При динамічному імпорті Server Component лише дочірні Client Components будуть ліниво завантажені:

```jsx
// app/page.js
import dynamic from 'next/dynamic'

const ServerComponent = dynamic(() => import('../components/ServerComponent'))

export default function ServerComponentExample() {
  return (
    <div>
      <ServerComponent />
    </div>
  )
}
```

### Завантаження зовнішніх бібліотек

Бібліотеки можна завантажувати за потребою через `import()`:

```jsx
// app/page.js
'use client'

import { useState } from 'react'

const names = ['Tim', 'Joe', 'Bel', 'Lee']

export default function Page() {
  const [results, setResults] = useState()

  return (
    <div>
      <input
        type="text"
        placeholder="Пошук"
        onChange={async (e) => {
          const { value } = e.currentTarget
          // Динамічне завантаження fuse.js
          const Fuse = (await import('fuse.js')).default
          const fuse = new Fuse(names)
          setResults(fuse.search(value))
        }}
      />
      <pre>Результати: {JSON.stringify(results, null, 2)}</pre>
    </div>
  )
}
```

### Кастомний loading-компонент

```jsx
// app/page.js
'use client'

import dynamic from 'next/dynamic'

const WithCustomLoading = dynamic(
  () => import('../components/WithCustomLoading'),
  {
    loading: () => <p>Завантаження...</p>,
  }
)

export default function Page() {
  return (
    <div>
      <WithCustomLoading />
    </div>
  )
}
```

### Імпорт іменованих експортів

```jsx
// components/hello.js
'use client'

export function Hello() {
  return <p>Привіт!</p>
}
```

```jsx
// app/page.js
import dynamic from 'next/dynamic'

const ClientComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)
```

## Magic Comments

Next.js підтримує спеціальні коментарі для контролю динамічних імпортів бандлером.

### `webpackIgnore` / `turbopackIgnore`

Пропуск бандлингу — імпорт відбудеться під час виконання:

```js
const runtime = await import(/* webpackIgnore: true */ 'runtime-module')
const plugin = await import(/* turbopackIgnore: true */ pluginPath)
```

### `turbopackOptional` (тільки Turbopack)

Придушення помилок збірки для модулів, що можуть не існувати:

```js
const feature = await import(/* turbopackOptional: true */ './optional-feature')
```

Корисно для:
- Умовних функцій, які можуть бути не встановлені
- Систем плагінів з опціональними модулями
- Поступової міграції
