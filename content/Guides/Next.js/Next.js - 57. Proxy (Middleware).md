# Proxy (Middleware) у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 21. Автентифікація]], [[Next.js - 31. Редиректи]]

> **Увага:** З Next.js 16 `middleware.ts` перейменовано на `proxy.ts`. Міграція: `npx @next/codemod@canary middleware-to-proxy .`

Proxy виконується на сервері **перед** рендерингом маршрутів. Дозволяє: перенаправляти, переписувати URL, модифікувати заголовки, встановлювати cookies.

## Базовий приклад

```ts
// proxy.ts (корінь проєкту)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

## Matcher

Визначає, на яких шляхах працює proxy:

```js
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
}
```

Regex для виключення шляхів:

```js
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
```

Розширений формат з умовами:

```js
export const config = {
  matcher: [
    {
      source: '/api/:path*',
      has: [{ type: 'header', key: 'Authorization', value: 'Bearer Token' }],
      missing: [{ type: 'cookie', key: 'session', value: 'active' }],
    },
  ],
}
```

## Порядок виконання

1. `headers` з `next.config.js`
2. `redirects` з `next.config.js`
3. **Proxy** (rewrites, redirects тощо)
4. `beforeFiles` rewrites
5. Файлові маршрути (`public/`, `_next/static/`, `app/` тощо)
6. `afterFiles` rewrites
7. Динамічні маршрути (`/blog/[slug]`)
8. `fallback` rewrites

## Робота з cookies

```ts
export function proxy(request: NextRequest) {
  let cookie = request.cookies.get('nextjs')
  const allCookies = request.cookies.getAll()
  request.cookies.has('nextjs') // true
  request.cookies.delete('nextjs')

  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  return response
}
```

## Встановлення заголовків

```ts
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-custom', 'value')

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.headers.set('x-response-custom', 'value')
  return response
}
```

## CORS

```ts
const allowedOrigins = ['https://acme.com', 'https://my-app.org']

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  if (request.method === 'OPTIONS') {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  const response = NextResponse.next()
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  return response
}

export const config = { matcher: '/api/:path*' }
```

## Пряма відповідь

```ts
export function proxy(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

## waitUntil для фонових задач

```ts
export function proxy(req: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    fetch('https://analytics.com', {
      method: 'POST',
      body: JSON.stringify({ pathname: req.nextUrl.pathname }),
    })
  )
  return NextResponse.next()
}
```

## Юніт-тестування

```ts
import { unstable_doesProxyMatch } from 'next/experimental/testing/server'

expect(
  unstable_doesProxyMatch({ config, nextConfig, url: '/test' })
).toEqual(false)
```

## Міграція middleware → proxy

```bash
npx @next/codemod@canary middleware-to-proxy .
```

```diff
- export function middleware() {
+ export function proxy() {
```
