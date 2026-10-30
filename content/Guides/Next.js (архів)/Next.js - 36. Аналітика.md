# Аналітика в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 17. Деплоймент]], [[Next.js - 22. Стрімінг]]

## Web Vitals

Ключові метрики користувацького досвіду:

- **TTFB** — Time to First Byte
- **FCP** — First Contentful Paint
- **LCP** — Largest Contentful Paint
- **FID** — First Input Delay
- **CLS** — Cumulative Layout Shift
- **INP** — Interaction to Next Paint

## Клієнтська інструментація

Файл `instrumentation-client.js` виконується перед стартом фронтенд-коду:

```js
// instrumentation-client.js
console.log('Аналітика ініціалізована')

window.addEventListener('error', (event) => {
  reportError(event.error)
})
```

## useReportWebVitals

```tsx
// app/_components/web-vitals.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'FCP': {
        // обробка FCP
        break
      }
      case 'LCP': {
        // обробка LCP
        break
      }
      // ...
    }
  })
}
```

```tsx
// app/layout.tsx
import { WebVitals } from './_components/web-vitals'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

## Відправка до зовнішніх систем

```js
useReportWebVitals((metric) => {
  const body = JSON.stringify(metric)
  const url = 'https://example.com/analytics'

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
})
```

### Google Analytics

```js
useReportWebVitals((metric) => {
  window.gtag('event', metric.name, {
    value: Math.round(
      metric.name === 'CLS' ? metric.value * 1000 : metric.value
    ),
    event_label: metric.id,
    non_interaction: true,
  })
})
```

## Vercel Analytics

Vercel надає керований сервіс для автоматичного збору та візуалізації метрик.
