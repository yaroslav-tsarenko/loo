# CSS та стилізація в Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 01. Встановлення]], [[Next.js - 13. Оптимізація шрифтів]], [[Next.js - 03. Layouts та сторінки]]

Next.js підтримує кілька способів стилізації:
- [[#Tailwind CSS]]
- [[#CSS Modules]]
- [[#Глобальний CSS]]
- [[#Зовнішні таблиці стилів]]
- Sass
- CSS-in-JS

## Tailwind CSS

Утилітарний CSS-фреймворк для побудови кастомних дизайнів.

### Встановлення

```bash
npm install -D tailwindcss @tailwindcss/postcss
```

### Налаштування PostCSS

```js
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### Імпорт у глобальний CSS

```css
/* app/globals.css */
@import 'tailwindcss';
```

### Підключення у кореневому layout

```tsx
// app/layout.tsx
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
```

### Використання

```tsx
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Ласкаво просимо!</h1>
    </main>
  )
}
```

## CSS Modules

CSS Modules локально обмежують CSS, генеруючи унікальні імена класів. Це дозволяє використовувати однакові класи в різних файлах без конфліктів.

### Створення та використання

```css
/* app/blog/blog.module.css */
.blog {
  padding: 24px;
}
```

```tsx
// app/blog/page.tsx
import styles from './blog.module.css'

export default function Page() {
  return <main className={styles.blog}></main>
}
```

## Глобальний CSS

Глобальний CSS застосовується до всього застосунку.

```css
/* app/global.css */
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

```tsx
// app/layout.tsx
import './global.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
```

> Глобальні стилі можна імпортувати в будь-який layout, сторінку або компонент у директорії `app`. Однак Next.js не видаляє таблиці стилів при навігації між маршрутами, що може призвести до конфліктів. Рекомендується використовувати глобальні стилі для **справді глобального** CSS (базові стилі Tailwind), Tailwind для компонентного стилювання та CSS Modules для кастомного скопованого CSS.

## Зовнішні таблиці стилів

Стилі з зовнішніх пакетів можна імпортувати будь-де в `app`:

```tsx
// app/layout.tsx
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body className="container">{children}</body>
    </html>
  )
}
```

> У React 19 можна також використовувати `<link rel="stylesheet" href="..." />`.

## Порядок та об'єднання CSS

Next.js оптимізує CSS під час продакшен-збірки, автоматично об'єднуючи таблиці стилів. **Порядок CSS** залежить від **порядку імпортів** у коді.

```tsx
// page.tsx
import { BaseButton } from './base-button'  // імпортується першим
import styles from './page.module.css'       // імпортується другим
```

`base-button.module.css` буде **перед** `page.module.css`.

### Рекомендації для передбачуваного порядку CSS

1. Тримайте CSS-імпорти в одному JS/TS файлі-точці входу
2. Імпортуйте глобальні стилі та Tailwind у корені застосунку
3. **Використовуйте Tailwind CSS** для більшості потреб стилізації
4. Використовуйте CSS Modules для специфічних стилів компонентів
5. Дотримуйтесь єдиної конвенції найменування: `<name>.module.css`
6. Виносьте спільні стилі у спільні компоненти
7. Вимкніть лінтери/форматери, що автоматично сортують імпорти

## Розробка vs Продакшен

| Аспект | Розробка (`next dev`) | Продакшен (`next build`) |
|--------|----------------------|--------------------------|
| Оновлення CSS | Миттєво (Fast Refresh) | Мініфікація та code-splitting |
| JavaScript | Обов'язковий для Fast Refresh | CSS працює без JS |
| Порядок CSS | Може відрізнятися | Перевіряйте після збірки |
