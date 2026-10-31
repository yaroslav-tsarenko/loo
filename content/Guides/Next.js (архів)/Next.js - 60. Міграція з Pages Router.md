# Міграція з Pages Router на App Router

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 01. Встановлення]], [[Next.js - 03. Сторінки та макети]]

## Покрокова міграція

`app/` та `pages/` працюють одночасно — мігруйте посторінково.

### Крок 1: Створення app директорії

```bash
mkdir app
```

### Крок 2: Root Layout

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
```

Замінює `_app.tsx` та `_document.tsx`. Метадані через Metadata API:

```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Головна',
  description: 'Ласкаво просимо',
}
```

### Крок 3: Міграція next/head → Metadata

```tsx
// Було (pages)
import Head from 'next/head'
<Head><title>Моя сторінка</title></Head>

// Стало (app)
export const metadata: Metadata = { title: 'Моя сторінка' }
```

### Крок 4: Міграція сторінок

| `pages/` | `app/` | Маршрут |
|----------|--------|---------|
| `index.js` | `page.js` | `/` |
| `about.js` | `about/page.js` | `/about` |
| `blog/[slug].js` | `blog/[slug]/page.js` | `/blog/post-1` |

Рекомендований підхід:
1. Створіть Client Component з існуючим кодом сторінки
2. Імпортуйте його в новий `app/.../page.tsx` (Server Component)

### Крок 5: Міграція хуків маршрутизації

| `pages` (next/router) | `app` (next/navigation) |
|----------------------|------------------------|
| `useRouter().pathname` | `usePathname()` |
| `useRouter().query` | `useSearchParams()` + `useParams()` |
| `useRouter().push()` | `useRouter().push()` |
| `useRouter().events` | `usePathname()` + `useSearchParams()` |

### Крок 6: Міграція отримання даних

| `pages` | `app` |
|---------|-------|
| `getServerSideProps` | `fetch('...', { cache: 'no-store' })` |
| `getStaticProps` | `fetch('...', { cache: 'force-cache' })` |
| `getStaticProps + revalidate` | `fetch('...', { next: { revalidate: 60 } })` |
| `getStaticPaths` | `generateStaticParams()` |

```tsx
// app/page.tsx — замість getServerSideProps
async function getProjects() {
  const res = await fetch('https://...', { cache: 'no-store' })
  return res.json()
}

export default async function Dashboard() {
  const projects = await getProjects()
  return <ul>{projects.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}
```

### Крок 7: Стилі

- Глобальні стилі в будь-якому layout (не лише `_app.js`)
- Додайте `app/` у `tailwind.config.js`:

```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
```

## Заміни основних паттернів

| `pages` | `app` |
|---------|-------|
| `_app.js` | `app/layout.tsx` |
| `_document.js` | `app/layout.tsx` |
| `_error.js` | `error.tsx` |
| `404.js` | `not-found.tsx` |
| `pages/api/*` | `app/api/*/route.ts` |
| `getLayout()` | Вкладені `layout.tsx` |

## Codemods

```bash
npx @next/codemod@latest <transform> .
```

Доступні трансформації: `new-link`, `next-image-to-legacy-image`, `middleware-to-proxy` та інші.
