# Деплоймент Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 01. Встановлення]], [[Next.js - 02. Структура проєкту]]

Next.js можна деплоїти як Node.js сервер, Docker контейнер, статичний експорт або через адаптери для різних платформ.

## Варіанти деплойменту

| Варіант | Підтримка фіч |
|---------|---------------|
| Node.js сервер | Всі |
| Docker контейнер | Всі |
| Статичний експорт | Обмежена |
| Адаптери | Залежить від платформи |

## Node.js сервер

Переконайтеся, що `package.json` має скрипти `build` та `start`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

```bash
npm run build
npm run start
```

Підтримує **всі** фічі Next.js.

## Docker

Для контейнеризації використовуйте `output: 'standalone'` в `next.config.ts`:

```ts
const nextConfig = {
  output: 'standalone',
}
```

Це генерує мінімальний production-ready Docker-образ лише з необхідними файлами.

### Шаблони Docker

- **Standalone Output** — мінімальний продакшен-образ
- **Export Output** — повністю статичний застосунок
- **Multi-Environment** — різні конфігурації для dev/staging/production

## Статичний експорт

Для SPA або статичного сайту:

```ts
const nextConfig = {
  output: 'export',
}
```

Можна деплоїти на будь-який веб-сервер (AWS S3, Nginx, Apache, GitHub Pages).

**Обмеження:** не підтримує серверні фічі (Server Components з runtime даними, [[Next.js - 15. Route Handlers|Route Handlers]], [[Next.js - 16. Proxy (Middleware)|Proxy]] тощо).

## Адаптери

Deployment Adapter API дозволяє платформам кастомізувати збірку та деплоймент.

### Верифіковані адаптери

Проходять повний тестовий набір Next.js:
- **Vercel** — нативна підтримка
- **Bun** — альтернативний рантайм

### Інші платформи

- Cloudflare
- Netlify
- AWS Amplify
- Google Cloud Run
- DigitalOcean
- Fly.io
- Firebase App Hosting
- Deno Deploy

> Не побудовані на публічному Adapter API, підтримка фіч може відрізнятися.

## Рекомендації

1. Для повної підтримки фіч — **Node.js сервер** або **Docker**
2. Для статичних сайтів — **статичний експорт**
3. Для найкращого DX — **Vercel** (нативна інтеграція)
4. Для self-hosting — Docker з `output: 'standalone'`
