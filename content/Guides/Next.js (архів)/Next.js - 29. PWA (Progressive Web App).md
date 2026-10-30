# PWA (Progressive Web App) в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 17. Деплоймент]], [[Next.js - 14. Метадані та OG-зображення]]

PWA дозволяють створити застосунок з нативним досвідом без App Store:

- Миттєві оновлення без модерації
- Один кодовий базис для всіх платформ
- Установка на домашній екран та push-сповіщення

## 1. Web App Manifest

Створіть `app/manifest.ts`:

```ts
// app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Next.js PWA',
    short_name: 'MyPWA',
    description: 'Progressive Web App на Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

Розмістіть іконки в папці `public/`.

## 2. Push-сповіщення

Підтримуються в:
- iOS 16.4+ (додані на домашній екран)
- Safari 16+ (macOS 13+)
- Chromium-браузери
- Firefox

### Клієнтський компонент

```tsx
// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from './actions'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    await subscribeUser(JSON.parse(JSON.stringify(sub)))
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message)
      setMessage('')
    }
  }

  if (!isSupported) {
    return <p>Push-сповіщення не підтримуються цим браузером.</p>
  }

  return (
    <div>
      <h3>Push-сповіщення</h3>
      {subscription ? (
        <>
          <p>Ви підписані на push-сповіщення.</p>
          <button onClick={unsubscribeFromPush}>Відписатися</button>
          <input
            type="text"
            placeholder="Текст сповіщення"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>Надіслати тест</button>
        </>
      ) : (
        <>
          <p>Ви не підписані на push-сповіщення.</p>
          <button onClick={subscribeToPush}>Підписатися</button>
        </>
      )}
    </div>
  )
}
```

### Server Actions

```ts
// app/actions.ts
'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
  '<mailto:your-email@example.com>',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: PushSubscription | null = null

export async function subscribeUser(sub: PushSubscription) {
  subscription = sub
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) throw new Error('Немає підписки')

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title: 'Сповіщення', body: message, icon: '/icon.png' })
    )
    return { success: true }
  } catch (error) {
    console.error('Помилка відправки:', error)
    return { success: false, error: 'Не вдалося відправити' }
  }
}
```

## 3. VAPID ключі

```bash
pnpm add -g web-push
web-push generate-vapid-keys
```

Додайте в `.env`:

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

## 4. Service Worker

```js
// public/sw.js
self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: { dateOfArrival: Date.now(), primaryKey: '2' },
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})
```

## 5. Безпека

```js
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ]
  },
}
```

## 6. Тестування локально

- Використовуйте `next dev --experimental-https`
- Увімкніть сповіщення в браузері
- Прийміть дозволи при запиті

## Розширення PWA

- **Offline support** — використовуйте [Serwist](https://github.com/serwist/serwist) з Next.js
- **Static exports** — `output: 'export'` для повністю статичного PWA
- **Background sync** — Web API для фонової синхронізації
