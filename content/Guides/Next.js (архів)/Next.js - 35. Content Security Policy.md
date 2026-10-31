# Content Security Policy (CSP) в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 16. Proxy (Middleware)]], [[Next.js - 30. Скрипти]]

CSP захищає від XSS, clickjacking та інших атак ін'єкції коду, визначаючи дозволені джерела контенту.

## Nonces

Nonce — унікальний рядок для одноразового використання, що дозволяє вибірково виконувати певні inline-скрипти.

### Генерація nonce через Proxy

```ts
// proxy.ts
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

### Як nonces працюють у Next.js

1. **Proxy генерує nonce** та додає до CSP-заголовка і `x-nonce` заголовка
2. **Next.js витягує nonce** з CSP-заголовка
3. **Nonce автоматично додається** до: фреймворк-скриптів, JavaScript-бандлів, inline-стилів

### Примусовий динамічний рендеринг

Nonces вимагають динамічного рендерингу:

```tsx
// app/page.tsx
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  // Контент сторінки
}
```

### Читання nonce

```tsx
// app/page.tsx
import { headers } from 'next/headers'
import Script from 'next/script'

export default async function Page() {
  const nonce = (await headers()).get('x-nonce')

  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js"
      strategy="afterInteractive"
      nonce={nonce}
    />
  )
}
```

## Без Nonces

Для застосунків, що не потребують nonces:

```js
// next.config.js
const isDev = process.env.NODE_ENV === 'development'

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}
```

## Subresource Integrity (SRI) — експериментально

Альтернатива nonces — хеш-підхід для статичної генерації:

```js
// next.config.js
module.exports = {
  experimental: {
    sri: {
      algorithm: 'sha256', // або 'sha384', 'sha512'
    },
  },
}
```

Переваги SRI:
- Статична генерація зберігається
- Сумісність з CDN-кешуванням
- Краща продуктивність
- Безпека на рівні збірки

## Nonces vs SRI

| | Nonces | SRI |
|---|---|---|
| Рендеринг | Динамічний | Статичний |
| CDN кешування | Ні | Так |
| Продуктивність | Нижча (SSR на кожен запит) | Вища |
| Підтримка | Стабільна | Експериментальна |

## Сторонні скрипти

```tsx
// app/layout.tsx
import { GoogleTagManager } from '@next/third-parties/google'
import { headers } from 'next/headers'

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get('x-nonce')

  return (
    <html lang="uk">
      <body>
        {children}
        <GoogleTagManager gtmId="GTM-XYZ" nonce={nonce} />
      </body>
    </html>
  )
}
```

Оновіть CSP для сторонніх доменів:

```
script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com;
connect-src 'self' https://www.google-analytics.com;
```

## Типові порушення CSP

1. **Inline-стилі** — використовуйте CSS-in-JS з підтримкою nonces
2. **Динамічні імпорти** — дозвольте в script-src
3. **WebAssembly** — додайте `'wasm-unsafe-eval'`
4. **Service workers** — додайте відповідні політики
