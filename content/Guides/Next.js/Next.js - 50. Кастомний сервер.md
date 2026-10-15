# Кастомний сервер у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 27. Self-Hosting]]

Кастомний сервер дозволяє програмно запустити Next.js. У більшості випадків це не потрібно — використовуйте `next start`.

> **Увага:** Кастомний сервер вимикає важливі оптимізації, як-от Automatic Static Optimization. Використовуйте лише коли вбудований роутер не задовольняє вимоги.

## Приклад

```ts
// server.ts
import { createServer } from 'http'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
```

> `server.js` не проходить через Next.js Compiler — переконайтесь у сумісності з вашою версією Node.js.

## Налаштування scripts

```json
{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}
```

## Опції next()

| Опція | Тип | Опис |
|-------|-----|------|
| `conf` | `Object` | Об'єкт конфігурації (як `next.config.js`) |
| `dev` | `Boolean` | Dev mode. За замовчуванням `false` |
| `dir` | `String` | Шлях до проєкту. За замовчуванням `'.'` |
| `quiet` | `Boolean` | Приховати повідомлення з інформацією сервера |
| `hostname` | `String` | Hostname сервера |
| `port` | `Number` | Порт сервера |
| `httpServer` | `node:http#Server` | HTTP Server для Next.js |
| `turbopack` | `Boolean` | Увімкнути Turbopack (увімкнений за замовчуванням) |
| `webpack` | `Boolean` | Увімкнути webpack |

> При використанні `output: 'standalone'` кастомний сервер не трасується — ці режими не сумісні.
