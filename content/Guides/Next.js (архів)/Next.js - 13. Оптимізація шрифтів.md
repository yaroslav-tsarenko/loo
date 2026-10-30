# Оптимізація шрифтів у Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 10. CSS та стилізація]], [[Next.js - 01. Встановлення]]

Модуль `next/font` автоматично оптимізує шрифти та видаляє зовнішні мережеві запити для покращення приватності та продуктивності.

Включає **вбудований self-hosting** для будь-якого файлу шрифту — оптимальне завантаження без Layout Shift.

## Google Fonts

Автоматичний self-hosting Google Fonts — шрифти подаються з вашого домену, жодних запитів до Google:

```tsx
// app/layout.tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

Рекомендується використовувати **варіативні шрифти** для кращої продуктивності. Якщо варіативний шрифт недоступний — вкажіть weight:

```tsx
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

## Локальні шрифти

Імпортуйте `localFont` з `next/font/local`:

```tsx
// app/layout.tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

Шлях вирішується відносно файлу, де викликається `localFont`. Шрифти можна зберігати в `app/fonts/` або `public/`.

### Кілька файлів для одного сімейства

```ts
const roboto = localFont({
  src: [
    { path: './Roboto-Regular.woff2', weight: '400', style: 'normal' },
    { path: './Roboto-Italic.woff2', weight: '400', style: 'italic' },
    { path: './Roboto-Bold.woff2', weight: '700', style: 'normal' },
    { path: './Roboto-BoldItalic.woff2', weight: '700', style: 'italic' },
  ],
})
```

## Область дії шрифту

Шрифти обмежені компонентом, де вони використовуються. Щоб застосувати шрифт до всього застосунку, додайте його в [[Next.js - 03. Layouts та сторінки#Створення Layout|кореневий Layout]].

## Інтеграція з Tailwind CSS

Шрифт можна використовувати як CSS-змінну з [[Next.js - 10. CSS та стилізація#Tailwind CSS|Tailwind CSS]]:

```tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export default function Layout({ children }) {
  return (
    <html className={geist.variable}>
      <body>{children}</body>
    </html>
  )
}
```

Потім у `tailwind.config.js` або CSS:

```css
@import 'tailwindcss';

@theme {
  --font-sans: var(--font-geist);
}
```
