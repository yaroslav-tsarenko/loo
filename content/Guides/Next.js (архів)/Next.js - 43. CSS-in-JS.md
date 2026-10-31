# CSS-in-JS у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 44. Sass]], [[Next.js - 05. Серверні та клієнтські компоненти]]

> **Увага:** CSS-in-JS бібліотеки потребують підтримки React concurrent rendering для роботи з Server Components та Streaming.

## Підтримувані бібліотеки

- `ant-design`
- `chakra-ui`
- `@fluentui/react-components`
- `kuma-ui`
- `@mui/material`, `@mui/joy`
- `pandacss`
- `styled-jsx`
- `styled-components`
- `stylex`
- `tamagui`
- `tss-react`
- `vanilla-extract`

В процесі підтримки: `emotion`.

## Налаштування — 3 кроки

1. **Style registry** — збирає CSS правила під час рендерингу
2. **`useServerInsertedHTML`** — інжектить правила перед контентом
3. **Client Component** — обгортає застосунок registry під час SSR

## styled-jsx

Створіть registry:

```tsx
// app/registry.tsx
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const [jsxStyleRegistry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles()
    jsxStyleRegistry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
}
```

Обгорніть root layout:

```tsx
// app/layout.tsx
import StyledJsxRegistry from './registry'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  )
}
```

## styled-components

Увімкніть компілятор:

```js
// next.config.js
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

Створіть registry:

```tsx
// lib/registry.tsx
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

Обгорніть root layout:

```tsx
// app/layout.tsx
import StyledComponentsRegistry from './lib/registry'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

> **Примітки:**
> - Під час SSR стилі екстрактуються в глобальний registry та вставляються в `<head>`
> - Під час стрімінгу стилі з кожного чанку збираються та додаються до існуючих
> - Client Component на верхньому рівні — найефективніший спосіб екстрагувати CSS
