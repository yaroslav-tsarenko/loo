# Скрипти в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 10. CSS та стилізація]], [[Next.js - 03. Layouts та сторінки]]

Компонент `next/script` оптимізує завантаження сторонніх скриптів.

## Скрипти в Layout

Для кількох маршрутів — додайте скрипт у layout:

```tsx
// app/dashboard/layout.tsx
import Script from 'next/script'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

Скрипт завантажиться **лише один раз**, навіть при навігації між маршрутами layout.

## Глобальні скрипти

Для всіх маршрутів — додайте в кореневий layout:

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

> Включайте скрипти тільки там, де вони потрібні, щоб мінімізувати вплив на продуктивність.

## Стратегії завантаження

| Стратегія | Опис |
|-----------|------|
| `beforeInteractive` | До будь-якого коду Next.js та гідратації |
| `afterInteractive` | **(за замовчуванням)** Рано, але після початкової гідратації |
| `lazyOnload` | Пізніше, під час idle браузера |
| `worker` | (експериментальна) У web worker |

## Web Worker (експериментально)

Скрипти виконуються у web worker через [Partytown](https://partytown.qwik.dev/):

```js
// next.config.js
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

```tsx
import Script from 'next/script'

export default function Home() {
  return <Script src="https://example.com/script.js" strategy="worker" />
}
```

## Inline-скрипти

```jsx
<Script id="show-banner">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>
```

Або через `dangerouslySetInnerHTML`:

```jsx
<Script
  id="show-banner"
  dangerouslySetInnerHTML={{
    __html: `document.getElementById('banner').classList.remove('hidden')`,
  }}
/>
```

> Для inline-скриптів обов'язковий атрибут `id`.

## Обробники подій

Працюють тільки в Client Components (`'use client'`):

```tsx
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <Script
      src="https://example.com/script.js"
      onLoad={() => console.log('Скрипт завантажений')}
    />
  )
}
```

- `onLoad` — після завершення завантаження
- `onReady` — після завантаження та при кожному монтуванні
- `onError` — якщо скрипт не вдалося завантажити

## Додаткові атрибути

DOM-атрибути автоматично передаються у фінальний `<script>`:

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <Script
      src="https://example.com/script.js"
      id="example-script"
      nonce="XUENAJFW"
      data-test="script"
    />
  )
}
```
