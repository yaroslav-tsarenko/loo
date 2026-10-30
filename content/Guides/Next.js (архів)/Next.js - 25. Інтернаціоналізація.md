# Інтернаціоналізація (i18n) в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 16. Proxy (Middleware)]], [[Next.js - 03. Layouts та сторінки]]

Next.js дозволяє налаштувати маршрутизацію та рендеринг контенту для підтримки кількох мов.

## Термінологія

**Locale** — ідентифікатор набору мовних та форматних налаштувань:
- `en-US` — англійська (США)
- `uk-UA` — українська (Україна)
- `nl-NL` — нідерландська (Нідерланди)

## Маршрутизація

Рекомендується використовувати мовні вподобання браузера для вибору locale. Зміна мови змінює заголовок `Accept-Language`.

### Визначення locale

```js
// proxy.js
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let headers = { 'accept-language': 'uk-UA,uk;q=0.9,en;q=0.5' }
let languages = new Negotiator({ headers }).languages()
let locales = ['uk-UA', 'en-US', 'nl-NL']
let defaultLocale = 'uk-UA'

match(languages, locales, defaultLocale) // -> 'uk-UA'
```

### Редирект за locale через Proxy

```js
// proxy.js
import { NextResponse } from 'next/server'

let locales = ['uk-UA', 'en-US', 'nl-NL']

function getLocale(request) { /* ... */ }

export function proxy(request) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next).*)'],
}
```

### Динамічний сегмент `[lang]`

Всі файли в `app/` мають бути вкладені в `app/[lang]`:

```tsx
// app/[lang]/page.tsx
export default async function Page({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  return <h1>Мова: {lang}</h1>
}
```

> `PageProps` та `LayoutProps` — глобально доступні TypeScript-хелпери для типізації параметрів маршрутів.

## Локалізація

Створіть словники для кожної мови:

```json
// dictionaries/uk.json
{
  "products": {
    "cart": "Додати до кошика"
  }
}
```

```json
// dictionaries/en.json
{
  "products": {
    "cart": "Add to Cart"
  }
}
```

Функція завантаження перекладів:

```ts
// app/[lang]/dictionaries.ts
import 'server-only'

const dictionaries = {
  uk: () => import('./dictionaries/uk.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
```

Використання в сторінці:

```tsx
// app/[lang]/page.tsx
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from './dictionaries'

export default async function Page({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params

  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  return <button>{dict.products.cart}</button>
}
```

Оскільки layouts та pages за замовчуванням є Server Components, файли перекладів не впливають на розмір клієнтського JavaScript — код виконується тільки на сервері.

## Статичний рендеринг

Для генерації статичних маршрутів для певних locales використовуйте `generateStaticParams`:

```tsx
// app/[lang]/layout.tsx
export async function generateStaticParams() {
  return [{ lang: 'uk-UA' }, { lang: 'en-US' }]
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  return (
    <html lang={(await params).lang}>
      <body>{children}</body>
    </html>
  )
}
```

## Бібліотеки i18n

- **next-intl** — популярне рішення для App Router
- **next-international** — типобезпечна інтернаціоналізація
- **next-i18n-router** — маршрутизація i18n
- **paraglide-next** — компілятор-підхід до i18n
- **lingui** — потужний фреймворк локалізації
- **tolgee** — платформа управління перекладами
- **gt-next** — General Translation для Next.js
