# Паралельні маршрути в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 56. Перехоплення маршрутів]], [[Next.js - 03. Сторінки та макети]]

Паралельні маршрути дозволяють рендерити кілька сторінок одночасно в одному layout — корисно для дашбордів, стрічок, тощо.

## Конвенція — Слоти

Слоти визначаються конвенцією `@folder`:

> [!diagram] Слоти @folder: кілька сторінок в одному layout
> ```yaml
> layout: tree
> nodes:
>   - { id: app, text: "app/", tone: violet, icon: "si:SiNextdotjs" }
>   - { id: an, text: "@analytics/", note: "слот analytics", parent: app, tone: blue, icon: "pi:PiFoldersFill" }
>   - { id: anp, text: "page.tsx", parent: an, tone: blue, icon: "px:file" }
>   - { id: team, text: "@team/", note: "слот team", parent: app, tone: mint, icon: "pi:PiFoldersFill" }
>   - { id: teamp, text: "page.tsx", parent: team, tone: mint, icon: "px:file" }
>   - { id: layout, text: "layout.tsx", note: "отримує слоти як props", parent: app, tone: violet, icon: "px:file" }
>   - { id: page, text: "page.tsx", note: "неявний слот children", parent: app, tone: green, icon: "px:file" }
> steps:
>   - { show: [app, layout, page], note: "Звичайний корінь: layout.tsx і page.tsx. Сторінка потрапляє в layout як children — це теж слот, просто неявний." }
>   - { show: [team, teamp], note: "Папка з @ — це слот, а не сегмент URL: @team/page.tsx не створює адресу /@team." }
>   - { show: [an, anp], note: "Ще один слот — @analytics. Тепер на одному URL рендеряться три сторінки одночасно." }
>   - { move: [{ from: team, to: layout, value: "team" }, { from: an, to: layout, value: "analytics" }], note: "Layout отримує кожен слот як prop з тією ж назвою — children, team, analytics — і сам вирішує, де їх показати." }
> ```

Слоти передаються як props у layout:

```tsx
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

> Слоти **не** впливають на URL. `/@analytics/views` → URL `/views`.
> `children` — неявний слот (еквівалент `@children`).

## default.js

Fallback для незіставлених слотів при першому завантаженні або повному оновленні:

```tsx
// app/@analytics/default.tsx
export default function Default() {
  return null
}
```

Без `default.js` — рендериться 404.

## Поведінка навігації

| Тип | Поведінка |
|-----|-----------|
| **Soft navigation** (клієнтська) | Часткове оновлення — інші слоти зберігають стан |
| **Hard navigation** (оновлення) | Незіставлені слоти рендерять `default.js` або 404 |

## Приклади

### Умовні маршрути за роллю

```tsx
// app/dashboard/layout.tsx
import { checkUserRole } from '@/lib/auth'

export default function Layout({ user, admin }) {
  const role = checkUserRole()
  return role === 'admin' ? admin : user
}
```

### Таб-групи

Layout всередині слота для незалежної навігації:

```tsx
// app/@analytics/layout.tsx
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <>
      <nav>
        <Link href="/page-views">Перегляди</Link>
        <Link href="/visitors">Відвідувачі</Link>
      </nav>
      <div>{children}</div>
    </>
  )
}
```

### Модальні вікна

Паралельні маршрути + перехоплення маршрутів → модалки з deep linking:

1. Основна сторінка `/login`:
```tsx
// app/login/page.tsx
import { Login } from '@/app/ui/login'
export default function Page() {
  return <Login />
}
```

2. Слот `@auth` з default:
```tsx
// app/@auth/default.tsx
export default function Default() {
  return null
}
```

3. Перехоплений маршрут:
```tsx
// app/@auth/(.)login/page.tsx
import { Modal } from '@/app/ui/modal'
import { Login } from '@/app/ui/login'

export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  )
}
```

4. Layout рендерить слот:
```tsx
// app/layout.tsx
export default function Layout({ auth, children }) {
  return (
    <>
      <nav><Link href="/login">Увійти</Link></nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  )
}
```

Закриття модалки — `router.back()`.

### useSelectedLayoutSegment

Читає активний сегмент слота:

```tsx
'use client'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({ auth }) {
  const loginSegment = useSelectedLayoutSegment('auth')
  // 'login' коли на /login
}
```

### Незалежний loading/error

Кожен слот може мати власні `loading.tsx` та `error.tsx`.
