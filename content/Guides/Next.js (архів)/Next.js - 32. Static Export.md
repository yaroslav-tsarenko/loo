# Static Export в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 28. SPA (Single Page Application)]], [[Next.js - 17. Деплоймент]]

Next.js генерує HTML-файл для кожного маршруту, зменшуючи розмір бандлу та прискорюючи завантаження.

## Конфігурація

```js
// next.config.js
const nextConfig = {
  output: 'export',
  // Опціонально:
  // trailingSlash: true,     // /me → /me/ та /me.html → /me/index.html
  // distDir: 'dist',         // Змінити вихідну папку (за замовчуванням 'out')
}

module.exports = nextConfig
```

Після `next build` створюється папка `out` з HTML/CSS/JS.

## Підтримувані функції

### Server Components

Виконуються під час збірки (як традиційний SSG):

```tsx
// app/page.tsx
export default async function Page() {
  const res = await fetch('https://api.example.com/...')
  const data = await res.json()
  return <main>...</main>
}
```

### Client Components

Клієнтське отримання даних через SWR:

```tsx
// app/other/page.tsx
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Page() {
  const { data, error } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/1',
    fetcher
  )
  if (error) return 'Помилка завантаження'
  if (!data) return 'Завантаження...'
  return <h1>{data.title}</h1>
}
```

### Оптимізація зображень

З кастомним loader (наприклад, Cloudinary):

```js
// next.config.js
const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './my-loader.ts',
  },
}
```

```ts
// my-loader.ts
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
  return `https://res.cloudinary.com/demo/image/upload/${params.join(',')}${src}`
}
```

### Route Handlers

Тільки `GET` — рендеряться у статичні файли:

```ts
// app/data.json/route.ts
export async function GET() {
  return Response.json({ name: 'Lee' })
}
```

### Браузерні API

Доступ до `window`, `localStorage` тільки в `useEffect`:

```jsx
'use client'

import { useEffect } from 'react'

export default function ClientComponent() {
  useEffect(() => {
    console.log(window.innerHeight)
  }, [])

  return <div>...</div>
}
```

## Не підтримується

- Dynamic Routes без `generateStaticParams()`
- Route Handlers, що залежать від Request
- Cookies, Headers
- Rewrites, Redirects у `next.config.js`
- Proxy (Middleware)
- ISR
- Image Optimization з дефолтним loader
- Draft Mode
- Server Actions
- Intercepting Routes

## Деплоймент

Можна розгорнути на будь-якому веб-сервері:

```
/out/index.html
/out/404.html
/out/blog/post-1.html
/out/blog/post-2.html
```

Конфігурація nginx:

```nginx
server {
  listen 80;
  server_name acme.com;
  root /var/www/out;

  location / {
    try_files $uri $uri.html $uri/ =404;
  }

  location /blog/ {
    rewrite ^/blog/(.*)$ /blog/$1.html break;
  }

  error_page 404 /404.html;
  location = /404.html {
    internal;
  }
}
```
