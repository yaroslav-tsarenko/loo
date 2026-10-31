# Multi-Zones у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 17. Деплоймент]], [[Next.js - 27. Self-Hosting]]

Multi-Zones — підхід до мікрофронтендів, де великий застосунок розділяється на кілька Next.js застосунків, кожен з яких обслуговує свій набір шляхів на одному домені.

## Приклад розподілу

- `/blog/*` — застосунок для блогу
- `/dashboard/*` — застосунок для дашборду
- `/*` — основний сайт

Кожен застосунок розробляється та деплоїться незалежно.

## Навігація

- **Soft navigation** (без перезавантаження) — між сторінками *однієї* зони
- **Hard navigation** (перезавантаження ресурсів) — між сторінками *різних* зон

Сторінки, які часто відвідуються разом, повинні бути в одній зоні.

## Визначення зони

Налаштуйте `assetPrefix` для уникнення конфліктів:

```js
// next.config.js (зона блогу)
const nextConfig = {
  assetPrefix: '/blog-static',
}
```

Основний застосунок (обробляє всі інші шляхи) не потребує `assetPrefix`.

## Маршрутизація запитів

### Через rewrites

```js
// next.config.js (головний застосунок)
async rewrites() {
  return [
    {
      source: '/blog',
      destination: `${process.env.BLOG_DOMAIN}/blog`,
    },
    {
      source: '/blog/:path+',
      destination: `${process.env.BLOG_DOMAIN}/blog/:path+`,
    },
    {
      source: '/blog-static/:path+',
      destination: `${process.env.BLOG_DOMAIN}/blog-static/:path+`,
    },
  ]
}
```

### Через proxy

Для динамічних рішень (наприклад, feature flags):

```js
// proxy.js
export async function proxy(request) {
  const { pathname, search } = request.nextUrl
  if (pathname === '/your-path' && myFeatureFlag.isEnabled()) {
    return NextResponse.rewrite(`${rewriteDomain}${pathname}${search}`)
  }
}
```

## Посилання між зонами

Використовуйте `<a>` замість `<Link>` — Next.js намагатиметься prefetch і soft navigate з `<Link>`, що не працює між зонами.

## Шаринг коду

- **Монорепозиторій** — найзручніший варіант
- **NPM пакети** — для окремих репозиторіїв
- **Feature flags** — для синхронізації фіч між зонами

## Server Actions

Явно дозвольте origin:

```js
// next.config.js
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['your-production-domain.com'],
    },
  },
}
```
