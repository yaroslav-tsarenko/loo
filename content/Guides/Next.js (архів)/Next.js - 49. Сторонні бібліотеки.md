# Сторонні бібліотеки в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 30. Скрипти]], [[Next.js - 36. Аналітика]]

`@next/third-parties` — бібліотека оптимізованих компонентів для популярних сторонніх сервісів.

## Встановлення

```bash
pnpm add @next/third-parties@latest next@latest
```

## Google Tag Manager

```tsx
// app/layout.tsx
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <GoogleTagManager gtmId="GTM-XYZ" />
      <body>{children}</body>
    </html>
  )
}
```

### Відправка подій

```tsx
'use client'
import { sendGTMEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <button
      onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'xyz' })}
    >
      Надіслати подію
    </button>
  )
}
```

### Опції GTM

| Параметр | Тип | Опис |
|----------|-----|------|
| `gtmId` | Обов'язковий* | ID контейнера GTM (починається з `GTM-`) |
| `gtmScriptUrl` | Опціональний* | URL скрипту GTM |
| `dataLayer` | Опціональний | Об'єкт data layer для ініціалізації |
| `dataLayerName` | Опціональний | Назва data layer. За замовчуванням `dataLayer` |
| `auth` | Опціональний | Параметр автентифікації (`gtm_auth`) |
| `preview` | Опціональний | Параметр preview (`gtm_preview`) |

## Google Analytics

```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

### Відправка подій GA

```tsx
'use client'
import { sendGAEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <button
      onClick={() => sendGAEvent('event', 'buttonClicked', { value: 'xyz' })}
    >
      Надіслати подію
    </button>
  )
}
```

> GA автоматично відстежує pageviews при зміні history state. Клієнтські навігації Next.js працюють без додаткової конфігурації.

## Google Maps Embed

```tsx
import { GoogleMapsEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleMapsEmbed
      apiKey="XYZ"
      height={200}
      width="100%"
      mode="place"
      q="Brooklyn+Bridge,New+York,NY"
    />
  )
}
```

## YouTube Embed

Використовує `lite-youtube-embed` для швидшого завантаження:

```tsx
import { YouTubeEmbed } from '@next/third-parties/google'

export default function Page() {
  return <YouTubeEmbed videoid="ogfYd705cRs" height={400} params="controls=0" />
}
```

| Параметр | Тип | Опис |
|----------|-----|------|
| `videoid` | Обов'язковий | ID відео YouTube |
| `width` | Опціональний | Ширина контейнера. За замовчуванням `auto` |
| `height` | Опціональний | Висота контейнера. За замовчуванням `auto` |
| `playlabel` | Опціональний | Прихована мітка кнопки play для доступності |
| `params` | Опціональний | Параметри плеєра (query string) |
| `style` | Опціональний | CSS стилі контейнера |
