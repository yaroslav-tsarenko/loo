# Оновлення версії Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 01. Встановлення]]

## Оновлення до останньої версії

Починаючи з Next.js 16.1.0, використовуйте команду `upgrade`:

```bash
# pnpm
pnpm next upgrade

# npm
npx next upgrade

# yarn
yarn next upgrade

# bun
bunx next upgrade
```

### Для версій до 16.1.0

```bash
npx @next/codemod@canary upgrade latest
```

### Ручне оновлення

```bash
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

## Canary-версія

Для доступу до нових фіч:

```bash
npm i next@canary
```

Спочатку переконайтеся, що ви на останній стабільній версії.

### Фічі в canary

**Автентифікація:**
- `forbidden` / `unauthorized` — функції
- `forbidden.js` / `unauthorized.js` — файлові конвенції
- `authInterrupts` — конфігурація

## Гайди з міграції версій

| Версія | Основні зміни |
|--------|--------------|
| **16** | Proxy замість Middleware, Cache Components, Turbopack за замовчуванням |
| **15** | Async `params`/`searchParams`, React 19, Turbopack stable |
| **14** | Server Actions stable, Partial Prerendering |

## Codemods

Next.js надає автоматичні codemods для міграції:

```bash
npx next upgrade
```

Ця команда автоматично визначає необхідні зміни та пропонує codemods для автоматичної міграції коду.

## Порядок оновлення

1. Прочитайте гайд міграції для цільової версії
2. Переконайтеся, що поточна версія стабільна
3. Запустіть `npx next upgrade`
4. Перевірте warnings та помилки
5. Оновіть сторонні залежності за потреби
6. Протестуйте застосунок
