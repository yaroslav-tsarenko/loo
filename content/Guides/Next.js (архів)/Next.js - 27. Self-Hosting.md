# Self-Hosting Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 17. Деплоймент]], [[Next.js - 24. ISR (Інкрементальна статична регенерація)]], [[Next.js - 22. Стрімінг]]

## Reverse Proxy

Рекомендується використовувати reverse proxy (наприклад, nginx) перед Next.js сервером. Він обробляє шкідливі запити, повільні з'єднання, обмеження розміру payload, rate limiting тощо.

## Оптимізація зображень

`next/image` працює при self-hosting з `next start` без додаткової конфігурації. Для окремого сервісу оптимізації — налаштуйте image loader.

> На Linux-системах з glibc може знадобитися додаткова конфігурація sharp для запобігання надмірному використанню пам'яті.

## Proxy (Middleware)

Працює без конфігурації з `next start`. Використовує Edge Runtime. Не підтримується зі static export.

## Змінні середовища

Змінні доступні тільки на сервері. Для клієнта — префікс `NEXT_PUBLIC_` (вбудовується в JS-бандл при `next build`).

Безпечне читання змінних під час dynamic rendering:

```tsx
// app/page.tsx
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  const value = process.env.MY_VALUE
  // ...
}
```

## Кешування та ISR

Кеш зберігається на локальній файловій системі за замовчуванням. Для одного інстансу `next start` це працює автоматично.

### Автоматичне кешування

- **Immutable assets** — `Cache-Control: public, max-age=31536000, immutable` (SHA-хеш у назві файлу)
- **ISR** — `s-maxage: <revalidate>, stale-while-revalidate`
- **Dynamic** — `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`

### Налаштування кешу

Для ephemeral compute (serverless) або кількох інстансів:

```js
// next.config.js
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // вимкнути in-memory кешування
}
```

```js
// cache-handler.js
const cache = new Map()

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options
  }

  async get(key) {
    return cache.get(key)
  }

  async set(key, data, ctx) {
    cache.set(key, {
      value: data,
      lastModified: Date.now(),
      tags: ctx.tags,
    })
  }

  async revalidateTag(tags) {
    tags = [tags].flat()
    for (let [key, value] of cache) {
      if (value.tags.some((tag) => tags.includes(tag))) {
        cache.delete(key)
      }
    }
  }

  resetRequestCache() {}
}
```

Для продакшену використовуйте Redis або AWS S3 як сховище кешу.

## Статичні ресурси

Для хостингу на окремому домені або CDN:

```js
// next.config.js
module.exports = {
  assetPrefix: 'https://cdn.example.com',
}
```

## Build Cache

Для консистентного build ID між контейнерами:

```js
// next.config.js
module.exports = {
  generateBuildId: async () => {
    return process.env.GIT_HASH
  },
}
```

## Multi-Server Deployments

### Ключ шифрування Server Functions

Всі інстанси повинні використовувати однаковий ключ шифрування:

```bash
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=your-generated-key next build
```

### Deployment ID

Для захисту від version skew:

```js
// next.config.js
module.exports = {
  deploymentId: process.env.DEPLOYMENT_VERSION,
}
```

### Координація кешу між інстансами

За замовчуванням `revalidateTag()` інвалідує кеш тільки на поточному інстансі. Реалізуйте `refreshTags()` у кастомному cache handler для синхронізації через Redis.

## Version Skew

При rolling deployments може виникнути:
- **Відсутні assets** — клієнт запитує файли, яких вже немає
- **Server Function mismatches** — клієнт викликає функцію з попереднього білду
- **Navigation failures** — prefetched дані несумісні з новим сервером

`deploymentId` виявляє ці ситуації і запускає hard navigation замість client-side.

## Стрімінг та Suspense

Для nginx — вимкніть буферизацію:

```js
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no',
          },
        ],
      },
    ]
  },
}
```

Переконайтеся, що вся інфраструктура підтримує стрімінг:
- Load balancers — chunked transfer encoding або HTTP/2
- Reverse proxies — pass through chunked responses
- Для PPR стрімінг обов'язковий

## `after`

Повністю підтримується з `next start`. При зупинці сервера відправте `SIGINT` або `SIGTERM` і зачекайте завершення `after()` callbacks (рекомендовано 10-30 секунд drain period).
