# Оптимізація зображень у Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 01. Встановлення]], [[Next.js - 02. Структура проєкту]]

Компонент `<Image>` з `next/image` розширює HTML `<img>` та надає:

- **Оптимізацію розміру** — автоматична подача правильного розміру для кожного пристрою, WebP формат
- **Візуальну стабільність** — запобігання Layout Shift при завантаженні
- **Швидше завантаження** — ліниве завантаження через нативний lazy loading, blur-up placeholder
- **Гнучкість** — зміна розміру на льоту, навіть для зображень з віддалених серверів

## Базове використання

```tsx
import Image from 'next/image'

export default function Page() {
  return <Image src="/profile.png" alt="Профіль" width={500} height={500} />
}
```

## Локальні зображення

Зберігайте у папці `public` (див. [[Next.js - 02. Структура проєкту#Папки верхнього рівня|структуру проєкту]]):

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/profile.png"
      alt="Фото автора"
      width={500}
      height={500}
    />
  )
}
```

### Статичний імпорт

При статичному імпорті `width`, `height` та `blurDataURL` визначаються автоматично:

```tsx
import Image from 'next/image'
import ProfileImage from './profile.png'

export default function Page() {
  return (
    <Image
      src={ProfileImage}
      alt="Фото автора"
      // width та height — автоматично
      // blurDataURL — автоматично
      placeholder="blur" // blur-up при завантаженні
    />
  )
}
```

### Динамічний імпорт (без статичного)

У [[Next.js - 05. Серверні та клієнтські компоненти|серверних компонентах]] можна використовувати `import()`:

```tsx
import Image from 'next/image'

async function PostImage({ imageFilename, alt }) {
  const { default: image } = await import(
    `../content/blog/images/${imageFilename}`
  )
  return <Image src={image} alt={alt} />
}
```

## Віддалені зображення

Для віддалених зображень вкажіть URL та розміри:

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="Фото автора"
      width={500}
      height={500}
    />
  )
}
```

### Налаштування дозволених хостів

Для безпеки визначте дозволені URL-патерни в `next.config.ts`:

```ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
}

export default config
```

### Пропс `fill`

Замість `width`/`height` можна використовувати `fill`, щоб зображення заповнювало батьківський контейнер:

```tsx
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image
    src="https://example.com/photo.jpg"
    alt="Фото"
    fill
    style={{ objectFit: 'cover' }}
  />
</div>
```

## Пріоритетне завантаження

Для зображень, що є частиною LCP (Largest Contentful Paint), додайте `priority`:

```tsx
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />
```

Це вимикає lazy loading та завантажує зображення з найвищим пріоритетом.
