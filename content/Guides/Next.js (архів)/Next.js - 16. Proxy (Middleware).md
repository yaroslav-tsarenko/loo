# Proxy (Middleware) у Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Починаючи з Next.js 16, Middleware перейменовано на **Proxy**
> Пов'язано: [[Next.js - 04. Навігація та посилання]], [[Next.js - 02. Структура проєкту]]

Proxy дозволяє виконувати код **перед завершенням запиту**. На основі вхідного запиту можна: переписувати, перенаправляти, модифікувати заголовки або відповідати напряму.

## Випадки використання

- Модифікація заголовків для всіх або частини сторінок
- Переписування на різні сторінки для A/B тестів
- Програматичні редиректи на основі властивостей запиту

> Для простих редиректів використовуйте `redirects` в `next.config.ts`. Proxy — коли потрібен доступ до даних запиту або складна логіка.

> Proxy **не призначений** для повільного отримання даних. Не використовуйте як повноцінне рішення для управління сесіями.

## Конвенція

Створіть `proxy.ts` (або `.js`) в корені проєкту або в `src/`:

> [!diagram] Де живе proxy.ts
> ```yaml
> layout: tree
> nodes:
>   - { id: proj, text: "project/", tone: gray, icon: "pi:PiFoldersFill" }
>   - { id: proxy, text: "proxy.ts", note: "або src/proxy.ts — один на проєкт", parent: proj, tone: violet, icon: "si:SiTypescript" }
>   - { id: app, text: "app/", note: "маршрути", parent: proj, tone: blue, icon: "si:SiNextdotjs" }
>   - { id: pkg, text: "package.json", parent: proj, tone: gray, icon: "px:file" }
> steps:
>   - { show: [proj, app, pkg], note: "Звичайний проєкт: папка app/ з маршрутами і package.json у корені." }
>   - { show: proxy, note: "proxy.ts кладемо в корінь — на одному рівні з app/, а не всередину неї. Якщо код у src/, то src/proxy.ts. Такий файл лише один." }
>   - { move: { from: proxy, to: app, value: "GET /about/team" }, note: "Запит, що підпадає під matcher ('/about/:path*'), спершу проходить через proxy() — і лише потім доходить до маршруту в app/ (або перенаправляється)." }
> ```

Підтримується тільки **один** файл `proxy.ts` на проєкт. Розбивайте логіку на модулі та імпортуйте в головний файл.

## Приклад

```ts
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

Або через default export:

```ts
export default function proxy(request: NextRequest) {
  // ...
}
```

## Matcher

`matcher` фільтрує маршрути, на яких працює Proxy:

```ts
export const config = {
  matcher: '/about/:path*',
}
```

Можна вказати кілька патернів:

```ts
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
}
```

## Типові патерни

### Редирект за умовою

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get('session')

  if (!isLoggedIn && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
```

### Додавання заголовків

```ts
export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('x-custom-header', 'my-value')
  return response
}
```

### Переписування URL (rewrite)

```ts
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/old-page') {
    return NextResponse.rewrite(new URL('/new-page', request.url))
  }
  return NextResponse.next()
}
```

## Обмеження

- `fetch` з `cache`/`revalidate`/`tags` не працює в Proxy
- Proxy виконується на Edge (не Node.js) — обмежений набір API
- Не використовуйте для повноцінної авторизації — тільки для оптимістичних перевірок
