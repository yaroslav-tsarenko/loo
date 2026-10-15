# View Transitions в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 04. Навігація та посилання]], [[Next.js - 22. Стрімінг]]

React `<ViewTransition>` інтегрується з браузерним View Transitions API для декларативної анімації переходів між сторінками.

## Увімкнення

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
}

export default nextConfig
```

```tsx
import { ViewTransition } from 'react'
```

## Паттерн 1: Морфінг спільних елементів

Один елемент переходить між сторінками (thumbnail → hero):

```tsx
// components/photo-grid.tsx — мініатюра
<Link href={`/photo/${photo.id}`}>
  <ViewTransition name={`photo-${photo.id}`}>
    <Image src={photo.src} alt={photo.title} />
  </ViewTransition>
</Link>
```

```tsx
// app/photo/[id]/photo-content.tsx — повне зображення
<ViewTransition name={`photo-${photo.id}`}>
  <Image src={photo.src} alt={photo.title} fill />
</ViewTransition>
```

Однакове `name` — React анімує між розмірами та позиціями автоматично.

### Кастомізація анімації

```tsx
<ViewTransition name={`photo-${photo.id}`} share="morph">
  <Image src={photo.src} alt={photo.title} />
</ViewTransition>
```

```css
::view-transition-group(.morph) {
  animation-duration: 400ms;
}
::view-transition-image-pair(.morph) {
  animation-name: via-blur;
}
@keyframes via-blur {
  30% { filter: blur(3px); }
}
```

## Паттерн 2: Анімація Suspense reveals

Skeleton вниз → контент вгору:

```tsx
// app/photo/[id]/page.tsx
<Suspense
  fallback={
    <ViewTransition exit="slide-down">
      <PhotoContentSkeleton />
    </ViewTransition>
  }
>
  <ViewTransition enter="slide-up" default="none">
    <PhotoContent id={id} />
  </ViewTransition>
</Suspense>
```

```css
::view-transition-old(.slide-down) {
  animation: 150ms ease-out both fade reverse,
             150ms ease-out both slide-y reverse;
}
::view-transition-new(.slide-up) {
  animation: 210ms ease-in 150ms both fade,
             400ms ease-in both slide-y;
}
@keyframes fade {
  from { filter: blur(3px); opacity: 0; }
  to { filter: blur(0); opacity: 1; }
}
@keyframes slide-y {
  from { transform: translateY(10px); }
  to { transform: translateY(0); }
}
```

## Паттерн 3: Направлена навігація

```tsx
// Вперед
<Link href={`/photo/${photo.id}`} transitionTypes={['nav-forward']}>
  {/* thumbnail */}
</Link>

// Назад
<Link href="/" transitionTypes={['nav-back']}>
  ← Галерея
</Link>
```

```tsx
<ViewTransition
  enter={{
    'nav-forward': 'nav-forward',
    'nav-back': 'nav-back',
    default: 'none',
  }}
  exit={{
    'nav-forward': 'nav-forward',
    'nav-back': 'nav-back',
    default: 'none',
  }}
  default="none"
>
  {/* контент сторінки */}
</ViewTransition>
```

```css
::view-transition-old(.nav-forward) {
  --slide-offset: -60px;
  animation: 150ms ease-in both fade reverse,
             400ms ease-in-out both slide reverse;
}
::view-transition-new(.nav-forward) {
  --slide-offset: 60px;
  animation: 210ms ease-out 150ms both fade,
             400ms ease-in-out both slide;
}
@keyframes slide {
  from { translate: var(--slide-offset); }
  to { translate: 0; }
}
```

### Закріплення хедера

```tsx
<header style={{ viewTransitionName: 'site-header' }}>
  {/* навігація */}
</header>
```

```css
::view-transition-group(site-header) { animation: none; z-index: 100; }
::view-transition-old(site-header) { display: none; }
::view-transition-new(site-header) { animation: none; }
```

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*),
  ::view-transition-group(*) {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
}
```

## Паттерн 4: Crossfade в межах маршруту

Для табів на одній сторінці — `key` для тригера:

```tsx
<ViewTransition
  key={slug}
  name="collection-content"
  share="auto"
  enter="auto"
  default="none"
>
  <CollectionGrid slug={slug} />
</ViewTransition>
```

## Підсумок

| Паттерн | Що комунікує |
|---------|-------------|
| Спільний елемент (морф) | "Та сама річ, глибше" |
| Suspense reveal | "Дані завантажено" |
| Направлений слайд | "Вперед / назад" |
| Crossfade | "Те саме місце, інший контент" |
