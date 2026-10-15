# Інструментація в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 39. OpenTelemetry]], [[Next.js - 36. Аналітика]]

Інструментація — інтеграція інструментів моніторингу, логування та трейсингу у застосунок.

## Конвенція

Створіть файл `instrumentation.ts` у **кореневій директорії** проєкту (або в `src/`). Експортуйте функцію `register` — вона викликається **один раз** при ініціалізації сервера і повинна завершитись до початку обробки запитів.

```ts
// instrumentation.ts
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}
```

> Файл повинен бути в корені проєкту, **не** в `app/` або `pages/`.

## Імпорт з побічними ефектами

```ts
// instrumentation.ts
export async function register() {
  await import('package-with-side-effect')
}
```

> Імпортуйте всередині `register`, а не на верхньому рівні файлу — це ізолює побічні ефекти.

## Код для конкретного середовища

Next.js викликає `register` у всіх середовищах. Умовно імпортуйте код:

```ts
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation-node')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./instrumentation-edge')
  }
}
```

Значення `NEXT_RUNTIME`:
- `'nodejs'` — Node.js серверне середовище
- `'edge'` — Edge Runtime
