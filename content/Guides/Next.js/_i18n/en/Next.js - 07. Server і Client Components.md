---
title: Server and Client Components
id: nextjs-core-07
order: 7
level: junior
skill: rendering
icon: px:microscope
tags: [nextjs, rsc, server-components, client-components, use-client, bundle]
prerequisites: []
estimatedMinutes: 45
nextVersion: 16.3.8
lang: en
source: nextjs-core-07
---

# Server and Client Components

> [!success] 🎯 After this topic, you'll be able to
> - explain why React Server Components exist: a smaller bundle, data next to its source, secrets kept on the server;
> - say, for any component, where it runs on the initial load and during client-side navigation;
> - explain `'use client'` as a boundary in the **module graph** and predict which files end up in the client bundle;
> - tell apart props that can cross the boundary (serializable values, JSX, Server Functions) from props that break the build;
> - nest a Server Component inside a Client Component via `children`, wire up context, and use a third-party library that lacks the directive;
> - prevent secret leaks: `server-only`, environment variables, DTOs.

## 🤔 Predict

> [!quiz] Where does each component run?
> level: junior · type: output · id: nextjs-core-07-quiz-01
>
> A user opens the page for the first time (by entering the URL directly). Here are two files:
>
> ```tsx
> // app/page.tsx
> import Hello from './hello'
>
> export default function Page() {
>   console.log('Page rendered')
>   return <Hello />
> }
> ```
>
> ```tsx
> // app/hello.tsx
> 'use client'
>
> export default function Hello() {
>   console.log('Hello rendered')
>   return <p>Привіт!</p>
> }
> ```
>
> - [x] `Page` runs only on the server; `Hello` runs on both the server and in the browser
> - [ ] `Page` runs on the server; `Hello` runs only in the browser
> - [ ] Both run only on the server, and the browser receives finished HTML
> - [ ] Both run on the server and in the browser: it's just regular React
>
> **Explanation:** don't worry if you got it wrong — we'll take it apart below. `Page` is a Server Component, so its code never ships to the browser. `Hello` is a Client Component, but "client" doesn't mean "client only": to produce the initial HTML, Next.js renders it on the server, and then the browser runs the same code again during hydration.

## 🧒 In plain words

Picture a restaurant. The kitchen is the server: it has the fridge full of ingredients (the database), the safe with the recipes (secrets), and the heavy equipment (large libraries). The kitchen cooks most dishes itself and brings you a **finished plate** — that's a Server Component: you see the result, but you get neither the recipe nor the pots. Some dishes you finish yourself at the table, like fondue. For those, the kitchen brings out a **kit** — the ingredients and instructions. That's a Client Component: its code travels to you, because otherwise you couldn't do anything with it. The waiter who carries both plates and kits is the RSC payload. And the recipe safe never leaves the kitchen — unless, of course, someone puts a recipe on a plate.

## 🔬 How it actually works

### 🧭 Why React Server Components

Before RSC, every React component was what we now call a Client Component: even when rendered on the server, **the same code** shipped to the browser for hydration, and data arrived in a separate step (`getServerSideProps`, an API route, `fetch` in `useEffect`). A page showing a markdown article pulled a markdown parser into the bundle, even though the user never parsed anything.

React Server Components split the tree into two parts: **Server Components** run only on the server, and **Client Components** are the interactive parts whose code the browser downloads. What you get:

- **A smaller client bundle.** The code of a Server Component and everything it imports stays on the server.
- **Data next to its source.** A Server Component reads the database, files, or an internal service **during its own render**, with no API route.
- **Secrets that don't leak.** API keys and tokens live in server code (unless you pass them explicitly — more on that below).
- **Streaming.** The server sends the UI in chunks while slow data is still loading (course topic 11).

```tsx
// app/ui/cart.tsx — an async Server Component: reads data directly
import { getCart } from '@/lib/db'

export async function Cart() {
  const items = await getCart()
  const total = items.reduce((sum, item) => sum + item.price, 0)
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.title} — {item.price} ₴
        </li>
      ))}
      <li>Разом: {total} ₴</li>
    </ul>
  )
}
```

The component is `async` and simply awaits the data: no `useEffect`, no loading state. After `next build`, the client chunks contain neither `Cart` nor `getCart`.

> [!note] Why the examples keep data in memory
> The course examples are built with `cacheComponents: true`. A real database query in `getCart()` would stop `next build` with `Next.js encountered uncached or runtime data during prerendering`: such data is either cached (`'use cache'`, course topic 15) or wrapped in `<Suspense>` (topics 11–12). We skip that here.

### 🗺️ What runs where

The names suggest a clean split, but rendering happens in both places:

| | On the server | In the browser |
|---|---|---|
| **Server Component** | yes | no |
| **Client Component** | yes | yes |

"Client" means the component **also** runs in the browser. "Server-rendered" describes **how the HTML was produced**; "Server Component" describes **where the code lives**.

**Initial load** (you opened a URL or refreshed the page): the server renders Server Components into the **RSC payload** — a serialized description of the tree with the output of the Server Components, "slots" for Client Components (with references to their JS files), and the props for them. From the payload and the Client Component code, the server builds **HTML**, the browser shows it right away, then downloads the Client Component JS, and React performs **hydration** — it attaches event handlers to the existing DOM.

> [!diagram] Initial load: what the server and the browser do
> ```yaml
> layout: flow
> nodes:
>   - { id: req, label: "browser", text: "GET /shop", tone: gray, icon: "px:monitor" }
>   - { id: rsc, label: "server · RSC", text: "Server Components → RSC payload", note: "the Cart and Page code stays here", tone: blue, icon: "px:database" }
>   - { id: html, label: "server · HTML", text: "payload + Client Components → HTML", note: "Modal is rendered here too", tone: violet }
>   - { id: show, label: "browser", text: "HTML on screen", note: "visible, but not clickable yet", tone: yellow }
>   - { id: hyd, label: "browser · hydration", text: "Client Component JS", note: "onClick now works", tone: green, icon: "px:bolt" }
> edges:
>   - { from: req, to: rsc, label: "request" }
>   - { from: rsc, to: html, label: "RSC payload" }
>   - { from: html, to: show, label: "HTML + payload" }
>   - { from: show, to: hyd, label: "JS chunks" }
> steps:
>   - { focus: req, note: "The user opens /shop directly. The server has to return the full page." }
>   - { move: { from: req, to: rsc, value: "GET /shop" }, note: "Next.js renders the Server Component tree. Page and Cart run here and read data — only their output goes to the browser." }
>   - { move: { from: rsc, to: html, value: "RSC payload" }, note: "From the payload and the Client Component code (for example, Modal), the server builds HTML. The Client Component ran on the server too!" }
>   - { move: { from: html, to: show, value: "HTML" }, note: "The browser paints the HTML immediately. The buttons are visible, but there are no event handlers yet." }
>   - { move: { from: show, to: hyd, value: "modal.js" }, note: "The browser downloads JS only for Client Components, and React performs hydration. These chunks contain no Server Component code at all." }
> ```
> Notice which code ships to the browser: only Client Components. Server Components arrive as finished output inside the payload.

**Client-side navigation** (clicking a `<Link>`): the browser receives the RSC payload of the new page (or takes it from the prefetch cache), and Client Components render **only in the browser**, with no HTML. The new page's Server Components render on the server to produce the payload. Details are in course topic 09.

Two clarifications. "The server" also includes `next build`: Next.js renders a static page at build time, so the logs from 🤔 Predict show up in the build output (static vs. dynamic is course topic 10). And in `next dev`, React replays Server Component logs in the browser console with a gray badge (on 16.3.8 — `Prerender`) — that's a copy; the code didn't run in the browser.

> [!quiz] Check yourself: where does a component run during navigation?
> level: junior · type: output · id: nextjs-core-07-quiz-02
>
> A production build. On `/`, the user clicks `<Link href="/about">`. The page `app/about/page.tsx` (no directive) renders `<Hello />`, which has `'use client'`. Where does `Hello` run during this navigation?
>
> - [x] Only in the browser: the RSC payload arrives, and `Hello` renders on the client without server HTML
> - [ ] On both the server and in the browser — same as on the initial load
> - [ ] Only on the server: the browser receives the finished HTML of `/about`
> - [ ] Nowhere: `Hello` was already on `/`, so React reuses that output
>
> **Explanation:** React is already running in the browser, so no HTML is needed: the RSC payload for `/about` arrives (or comes from the prefetch cache), and `Hello rendered` appears in the browser console. The `Hello` on `/` is a different instance on a different page.

### 🏠 Everything is server by default

In the App Router, every file — `page.tsx`, `layout.tsx`, any component — is a **Server Component** until you explicitly say otherwise. It can be `async`, import server modules (`node:fs`, a database driver, an SDK with a secret), and render Client Components.

But it has no state and can't react to user actions: no `useState`, `useEffect`, `useContext`, `onClick`/`onChange`, or `window`/`localStorage`. A hook in a server file stops the compiler, and `onClick` stops the build-time render (the error messages are in [[#🧯 Типові помилки і як їх читати|Common errors and how to read them]]).

Not all interactivity needs JS: `<details>`, `<video controls>`, and `<form action={serverFunction}>` work in a Server Component with no client code (example in [[#🧳 Що можна передати через межу|What can cross the boundary]]).

### 🚪 The use client directive — a boundary in the module graph

You create a Client Component with the `'use client'` directive at the **very top of the file**, before the imports (comments above it are fine; single or double quotes, not backticks):

```tsx
// app/ui/search.tsx
'use client'

import { useState } from 'react'

export default function Search() {
  const [query, setQuery] = useState('')
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Пошук…"
    />
  )
}
```

The key point: `'use client'` doesn't mark "this component" — it marks **the boundary between the server and client module graphs** (files are nodes, imports are edges). When a server module imports a file with `'use client'`, **that file, everything it imports, and the components it renders directly end up in the client bundle** — even without their own directive. The consequences:

1. **You put the directive only at the entry** to a client subtree; in a file imported from the client, it changes nothing.
2. **A component without the directive is "agnostic":** the **import site** determines its environment. A single `format.ts` can live in both graphs — Next.js compiles it separately for each.
3. **The boundary doesn't extend to `children`:** a Server Component passed as a prop stays on the server, because the client file **doesn't import** it.

> [!diagram] Module graph: where the boundary runs
> ```yaml
> layout: tree
> nodes:
>   - { id: page, label: "app/shop/page.tsx", text: "Server", tone: blue, icon: "px:file" }
>   - { id: cart, label: "app/ui/cart.tsx", text: "Server", parent: page, tone: blue }
>   - { id: db, label: "lib/db.ts", text: "Server", note: "import 'server-only'", parent: cart, tone: blue, icon: "px:database" }
>   - { id: fmt1, label: "lib/format.ts", text: "Server", note: "the server copy", parent: page, tone: blue }
>   - { id: modal, label: "app/ui/modal.tsx", code: "'use client'", note: "boundary: the client starts here", parent: page, tone: orange, icon: "px:door" }
>   - { id: fmt2, label: "lib/format.ts", text: "Client", note: "because modal.tsx imports it", parent: modal, tone: orange }
>   - { id: btn, label: "app/ui/button.tsx", text: "Client", note: "no directive, but in the client graph", parent: modal, tone: orange }
> steps:
>   - { show: page, note: "The page is a Server Component by default. This is where Next.js starts walking the imports." }
>   - { show: [cart, db, fmt1], note: "Everything server code imports is also server: Cart, lib/db.ts, and lib/format.ts. Their code won't go to the browser." }
>   - { show: modal, line: "modal:1", note: "modal.tsx starts with 'use client'. Importing this file is the boundary: its code and everything below it ships to the browser." }
>   - { show: [fmt2, btn], note: "button.tsx and lib/format.ts have no directive, but they're imported from a client module — so they're in the client bundle." }
>   - { focus: [fmt1, fmt2], note: "The same lib/format.ts is in two graphs. The import site determines the environment, not the file itself." }
> ```
> The browser downloads everything orange. Everything blue stays on the server, no matter how much of it there is.

> [!quiz] Check yourself: what ends up in the client bundle?
> level: junior · type: output · id: nextjs-core-07-quiz-03
>
> ```text
> app/page.tsx       no directive    imports: ./ui/cart, ./ui/modal, @/lib/format
> app/ui/cart.tsx    no directive    imports: @/lib/db
> app/ui/modal.tsx   'use client'    imports: @/lib/format, ./button
> app/ui/button.tsx  no directive
> lib/format.ts      no directive
> lib/db.ts          import 'server-only'
> ```
>
> - [x] `modal.tsx`, `button.tsx`, `format.ts`
> - [ ] Only `modal.tsx` — it's the only one with the directive
> - [ ] `modal.tsx` and `button.tsx` — `format.ts` is server, because `page.tsx` imports it
> - [ ] Everything except `lib/db.ts`
>
> **Explanation:** the boundary is `modal.tsx`, so its imports (`button.tsx`, `format.ts`) are client. Importing `format.ts` from `page.tsx` doesn't cancel the client copy: the module lives in both graphs. `cart.tsx` and `db.ts` are reachable only from the server.

> [!quiz] Check yourself: pick the true statements about `'use client'`
> level: junior · type: multi · id: nextjs-core-07-quiz-04
> - [x] The directive goes before the imports; comments above it are allowed
> - [x] Modules imported by a file with `'use client'` also end up in the client bundle
> - [ ] Every file with client components must have its own `'use client'`
> - [ ] A component with `'use client'` renders only in the browser
> - [x] A Server Component passed to a client one as `children` stays on the server
> - [ ] `'use client'` turns off server HTML rendering for that file
>
> **Explanation:** the directive marks the entry into the client graph, not "browser only": a Client Component renders on the server too. The imports of a client module are client anyway, and it doesn't import its `children`.

### 📦 What goes into the client bundle

The client bundle is the JS the browser downloads; Next.js splits it into chunks along the module graph. It includes modules with `'use client'`, **everything they import transitively** (utilities, libraries, JSON), and the values of `NEXT_PUBLIC_*` variables, which Next.js inlines during `next build`. It doesn't include: Server Component code and everything imported **only** by Server Components, the values of non-public variables, and Server Function code (the client gets only a reference).

That's why you should **put `'use client'` as low as possible.** A layout with a logo and a search field doesn't need to become client as a whole — `Search` is enough:

```tsx
// app/shop/layout.tsx — a Server Component by default
import Logo from '../ui/logo' // Server Component
import Search from '../ui/search' // Client Component

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

With `'use client'` on the layout, `Logo` would become client too, and the layout would lose access to data (the pages in `children` would stay server).

> [!quiz] Check yourself: put in order what happens on the initial load and on navigation
> level: junior · type: order · id: nextjs-core-07-quiz-05
>
> ```order
> The server renders Server Components into the RSC payload
> The server builds HTML from the payload and the Client Component code
> The browser shows the HTML — still without event handlers
> The browser downloads the Client Component JS, and React performs hydration
> A Link click: the browser receives (or takes from the prefetch cache) the RSC payload of the new page
> The new page's Client Components render in the browser without HTML
> The browser downloads the Server Component code, and React hydrates it ✗
> ```
>
> **Explanation:** on the initial load, the server first renders the server tree, then builds HTML, and only then does the browser bring the client parts to life. On navigation, HTML is no longer needed — the payload is enough. Server Component code never reaches the browser, so there's no hydration for it.

### 🧳 What can cross the boundary

Code crosses the boundary through **imports**, and data through **props**, which React serializes into the RSC payload. Simplified (the full list is in the React docs):

| Allowed | Not allowed |
|---|---|
| `string`, `number`, `bigint`, `boolean`, `undefined`, `null` | regular functions (handlers, callbacks, formatters) |
| a `symbol` registered via `Symbol.for()` | `Symbol('local')` |
| arrays, `Map`, `Set`, `TypedArray`, `ArrayBuffer` | classes and their instances (except built-ins) |
| `Date`, plain objects with serializable fields | objects with a `null` prototype |
| JSX: elements of Server and Client Components | |
| `Promise` (read with `use`, course topic 11) | |
| Server Functions (`'use server'`) — as references | |

```tsx
// app/props/page.tsx — all of this is serializable
import { Inspect } from './inspect'

export default function PropsPage() {
  return (
    <Inspect
      count={42}
      big={BigInt(10)}
      createdAt={new Date('2026-01-01T00:00:00Z')}
      tags={new Set(['next', 'react'])}
      prices={new Map([['p1', 2400]])}
      nothing={undefined}
      header={<h2>JSX теж можна</h2>}
    />
  )
}
```

On the client, `createdAt` is a real `Date`. But a function or a class instance stops the build (the messages are in [[#🧯 Типові помилки і як їх читати|Common errors and how to read them]]):

```tsx
<PriceTag amount={2400} format={(n: number) => `${n} ₴`} /> // ❌ a regular function
<Price value={new Money(2400, 'UAH')} /> // ❌ a class instance
```

A function is code plus a closure over server variables, and there's no way to send that to the browser. The exception is a **Server Function**: with `'use server'`, it crosses the boundary as a **reference** — the client calls it, but it runs on the server:

```tsx
// app/like/page.tsx
import { LikeButton } from './like-button'

export default function LikePage() {
  async function like() {
    'use server'
    console.log('like() виконалась на сервері')
  }

  return (
    <>
      <LikeButton likeAction={like} />
      {/* a form with no client JS at all — action accepts a Server Function too */}
      <form action={like}>
        <button type="submit">Подобається (форма)</button>
      </form>
    </>
  )
}
```

```tsx
// app/like/like-button.tsx
'use client'

import { useTransition } from 'react'

export function LikeButton({ likeAction }: { likeAction: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button disabled={isPending} onClick={() => startTransition(() => likeAction())}>
      Подобається
    </button>
  )
}
```

By type alone, a Server Function is indistinguishable from a regular function, so the Next.js TS plugin in your editor allows a function prop on a client component only if it's named `action` or `…Action`. Server Functions in depth are course topic 21.

> [!quiz] Check yourself: which prop breaks the build?
> level: junior · id: nextjs-core-07-quiz-06
>
> A Server Component renders `<ProductCard … />`, which has `'use client'`. Which prop causes an error?
>
> - [ ] `createdAt={new Date()}`
> - [ ] `tags={new Set(['sale', 'new'])}`
> - [x] `onSelect={(id) => console.log(id)}`
> - [ ] `header={<h2>Кошик</h2>}`
>
> **Explanation:** `Date`, `Set`, and JSX are serializable. A function isn't: `next build` fails with `Event handlers cannot be passed to Client Component props`. Declare the handler **inside** the client component, and for a server-side action pass a Server Function.

### 🧩 Composition: server inside client

A typical task: a modal opens and closes (client state), and inside it there's a cart with data from the database (server). Your instinct says to import `Cart` straight into the modal:

```tsx
// app/ui/cart-modal.tsx — ❌ importing a server component into a client one
'use client'

import { useState } from 'react'
import { Cart } from '@/app/ui/cart'

export function CartModal() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(!open)}>Кошик</button>
      {open && <Cart />}
    </div>
  )
}
```

The import pulls `Cart` into the client graph, and `lib/db.ts` along with it. With `import 'server-only'` in `db.ts`, the build stops with an import chain; without it, your database access code would ship to the browser.

The right way is to **pass the server component as `children`** (or as another prop holding JSX): the modal leaves a "hole," and the server page fills it:

```tsx
// app/ui/modal.tsx
'use client'

import { useState, type ReactNode } from 'react'

export function Modal({ title, children }: { title: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(true)
  if (!open) return <button onClick={() => setOpen(true)}>Відкрити кошик</button>

  return (
    <div role="dialog">
      <header>
        {title}
        <button onClick={() => setOpen(false)}>Закрити</button>
      </header>
      {children}
    </div>
  )
}
```

```tsx
// app/shop/page.tsx — Page and Cart are server, Modal is client
import { Cart } from '../ui/cart'
import { Modal } from '../ui/modal'

export default function ShopPage() {
  return (
    <Modal title={<h2>Твій кошик</h2>}>
      <Cart />
    </Modal>
  )
}
```

React distinguishes two roles. The **owner** is the component whose code contains the child's JSX: `ShopPage` is the owner of both `Modal` and `Cart`. The **parent** is the component that contains the child in the tree: `Modal` is the parent of `Cart`. The owner of `Cart` is a server component, so `Cart` renders on the server, and `Modal` receives only the **finished output**. Of this pair, only `Modal` is in the bundle.

> [!diagram] Import vs. children
> ```yaml
> layout: compare
> columns: { bad: "❌ Import into a client file", good: "✅ Pass as children" }
> nodes:
>   - { id: b1, col: bad, label: "cart-modal.tsx", code: "'use client'\nimport { Cart } from './cart'", tone: orange }
>   - { id: b2, col: bad, label: "Cart", text: "became client", note: "its code ships to the browser", tone: orange }
>   - { id: b3, col: bad, label: "lib/db.ts", text: "in the client graph", note: "server-only → build error", tone: red, icon: "px:warning" }
>   - { id: g1, col: good, label: "page.tsx (Server)", code: "<Modal>\n  <Cart />\n</Modal>", tone: blue }
>   - { id: g2, col: good, label: "Cart", text: "renders on the server", note: "owner: page.tsx", tone: blue }
>   - { id: g3, col: good, label: "Modal (Client)", text: "receives finished output", note: "only Modal is in the bundle", tone: green, icon: "px:check" }
> steps:
>   - { show: [b1, g1], note: "The same idea — a modal with a cart — done two ways. The difference is who imports Cart." }
>   - { show: [b2, g2], note: "On the left, a client file imports Cart, so Cart becomes client. On the right, the server page imports and renders it." }
>   - { show: [b3, g3], note: "On the left, Cart drags lib/db.ts into the browser — server-only stops the build. On the right, Modal receives the already rendered Cart as data." }
> ```
> The import defines the boundary, not nesting in JSX.

This technique is called **interleaving** — alternating server and client layers at any depth. More on the boundary in course topic 08.

### 🎛️ Context and providers

React Context isn't supported in Server Components: they have no state and no "life" between renders, and `createContext` in a server file stops the compiler. The solution is a client provider that accepts `children`:

```tsx
// app/theme-provider.tsx
'use client'

import { createContext, useContext, useState } from 'react'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeValue | null>(null)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  // children is already-rendered server output; the provider only wraps it
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme() викликано поза <ThemeProvider>')
  return value
}
```

```tsx
// app/layout.tsx — a Server Component: renders the provider but stays server itself
import ThemeProvider from './theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

In React 19, the context itself is the provider (`<ThemeContext value={…}>`). Client Components below it call `useTheme()`, while the pages under the provider stay server — they arrive as `children`. Server Components can't read context: they get the value they need (a color theme from a cookie, the language) from its source. Render providers **as deep as possible** — around `{children}`, not the whole `<html>`: that makes it easier for Next.js to optimize the static parts.

> [!quiz] Check yourself: fill in the blanks in the cart provider
> level: junior · type: fill · bank: 'use server', props · id: nextjs-core-07-quiz-07
>
> ```tsx fill
> // app/cart-provider.tsx
> [['use client'|"use client"]]
>
> import { createContext, useState } from 'react'
>
> export const CartContext = [[createContext]]<string[]>([])
>
> export function CartProvider({ [[children]] }: { children: React.ReactNode }) {
>   const [items, setItems] = [[useState]]<string[]>([])
>   return <CartContext value={items}>{children}</CartContext>
> }
> ```
>
> **Explanation:** the provider holds state, so it's a Client Component — the directive goes on the first line. It accepts `children` so that the server pages under it stay server: the provider doesn't import them, it only wraps their finished output. `'use server'` is out of place here — it marks Server Functions, not server components.

### 📚 Third-party components without the directive

Many libraries were written before RSC: a component uses `useState`, but the package has no `'use client'`. It works inside your Client Component, but not from a Server Component: `next dev` reports `useState only works in Client Components`, and `next build` gives a minified, nearly unreadable `TypeError: d is not a function or its return value is not iterable`. That's why you should reproduce render errors in `next dev`.

The fix is a thin wrapper with the directive on **your** side:

```tsx
// app/gallery/carousel.tsx — a thin wrapper: the boundary is on our side
'use client'

export { Carousel } from 'acme-carousel'
```

```tsx
// app/gallery/page.tsx
import { Carousel } from './carousel'

export default function GalleryPage() {
  return (
    <section>
      <h1>Галерея</h1>
      <Carousel />
    </section>
  )
}
```

The page stays server. For library authors, the docs recommend putting `'use client'` in the client entry points and making sure the package bundler doesn't strip the directive.

> [!quiz] Check yourself: what's the right way to add the carousel?
> level: junior · id: nextjs-core-07-quiz-08
>
> `app/gallery/page.tsx` imports `Carousel` from the `acme-carousel` package and fails with `useState only works in Client Components`. What's the best fix?
>
> - [ ] Add `'use client'` to `app/gallery/page.tsx`
> - [x] Create `app/gallery/carousel.tsx` with `'use client'` that re-exports `Carousel`, and keep the page server
> - [ ] Add `'use client'` to the package file in `node_modules`
> - [ ] Wrap `<Carousel />` in `<Suspense>`
>
> **Explanation:** the directive on the page "works," but it makes the whole page client. An edit in `node_modules` disappears after `npm install`. `Suspense` controls waiting, not the boundary.

### 🔐 Secrets, env, and server-only

A module can be imported from both environments, so it's easy to accidentally pull server code into the browser — this is **environment poisoning**. There are three layers of protection.

**1. Environment variables.** `process.env.*` is available only on the server. Next.js **inlines the values** of `NEXT_PUBLIC_*` into the client JS during `next build` — after the build they're frozen (a single Docker image will have the build-time values everywhere), and `process.env[name]` isn't inlined. The tricky case is a Client Component reading a **non-public** variable:

```tsx
// app/env/env-probe.tsx — ❌ a secret in a Client Component
'use client'

export function EnvProbe() {
  return <p>[{String(process.env.API_KEY)}]</p>
}
```

The client chunk doesn't contain the value (`undefined` in the browser). But a Client Component **also renders on the server**, so the real key ends up in the **prerendered HTML** — in the page source, in `curl` output, and in front of search engine crawlers. After hydration, React replaces the text with `[undefined]` and reports a hydration mismatch (in production, `Minified React error #418`). Read secrets **only in server modules**.

> [!warning] Discrepancy with the docs
> [Server and Client Components → Preventing environment poisoning](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning) says that for non-public variables in client code Next.js "replaces … with an empty string". On Next.js 16.3.8 (Turbopack), there's no replacement: the chunk keeps `process.env.API_KEY`, the browser sees `undefined`, and the HTML contains the real value from the server render.

**2. `server-only` and `client-only`.** Mark a module with server code by importing `'server-only'` — then any import of it into the client graph stops the build:

```ts
// lib/db.ts — data access; 'server-only' prevents importing this into the client graph
import 'server-only'

export async function getUser(id: string) {
  // ... a database query with a secret connection string
}
```

Next.js handles these imports itself (you need the npm package only if your linter complains). `client-only` is the mirror image, for modules that use `window`.

**3. Props are public data.** Everything passed to a Client Component sits in the RSC payload — **even a field the component doesn't render**. Pass the whole user object to a `ProfileCard` that shows only the name, and `passwordHash` lands in the payload embedded in the HTML. TypeScript stays silent: `User` has all the fields of `Profile`.

```tsx
// app/profile/page.tsx
import { getUser } from '@/lib/db'
import { ProfileCard } from './profile-card'

export default async function ProfilePage() {
  const user = await getUser('u1')
  if (!user) return <p>Не знайдено</p>

  // ✅ DTO: only what the UI needs
  const profile = { name: user.name, avatarUrl: user.avatarUrl }
  return <ProfileCard profile={profile} />
}
```

A DTO is an object with exactly the fields the client needs, built from an **allowlist**. The experimental React Taint API (`experimental.taint`) is an extra layer, not a replacement. The Data Access Layer is covered in the "Auth and security" section.

> [!quiz] What ends up in the page source HTML?
> level: middle · type: output · id: nextjs-core-07-quiz-09
>
> `.env` contains `API_KEY=sk_live_123` (without `NEXT_PUBLIC_`). The page renders this component. What's inside the `<p>` in the HTML served by `next build && next start` (view-source, `curl`)?
>
> ```tsx
> // app/env/env-probe.tsx
> 'use client'
>
> export function EnvProbe() {
>   return <p>[{String(process.env.API_KEY)}]</p>
> }
> ```
>
> - [ ] `[]` — Next.js replaces non-public variables with an empty string
> - [ ] `[undefined]` — this variable exists nowhere but the server
> - [x] `[sk_live_123]` — the secret ended up in the HTML
> - [ ] A build error: a non-public variable can't be read in a Client Component
>
> **Explanation:** the HTML is built on the server, where the Client Component sees the full `process.env`. The first option quotes the docs, but on 16.3.8 there's no replacement. `[undefined]` appears only **after** hydration (React replaces the text and reports a hydration mismatch) — by then the key is already in the page source. Keep secrets only in modules with `import 'server-only'`.

### 🧮 How to choose: a decision table

Start with a Server Component and move to the client **only** when you need a client capability. Put the boundary at the smallest interactive leaf.

| What you need | Component | Why |
|---|---|---|
| Fetch data from a database, API, or file | Server | data next to its source, no API route |
| Use a secret, token, or private SDK | Server + `server-only` | the code and values don't ship to the browser |
| A heavy library used only for rendering (markdown, code highlighting) | Server | the library stays on the server |
| State, handlers, `useEffect`, custom hooks | Client | needs code that lives in the browser |
| `window`, `localStorage`, `navigator.geolocation` | Client (in `useEffect`) | browser APIs |
| Context | Client provider with `children` | context isn't supported on the server |
| Disclosure widget, video, simple form | Server (HTML) | `<details>`, `<video controls>`, `<form action>` work without JS |
| Modal, tabs, slider with server content | Client wrapper + Server in `children` | state on the client, data on the server |


### 🧯 Common errors and how to read them

Almost every boundary error is either a client capability in the server graph or server code in the client graph. The messages are from `next build` / `next dev` 16.3.8.

| Message | What happened | What to do |
|---|---|---|
| `You're importing a module that depends on useState into a React Server Component module` | a hook or `createContext` in a file without `'use client'` | move the interactive part into a client file |
| `useState only works in Client Components` (`next dev`) | a third-party component without the directive in a Server Component | a wrapper with `'use client'` |
| `Event handlers cannot be passed to Client Component props` | `onClick` in a Server Component or a handler in props | put the handler in a client component |
| `Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server"` | a regular function in props | move the function to the client, or use a Server Function |
| `Only plain objects, and a few built-ins, can be passed to Client Components` | a class instance, `Object.create(null)` | pass a plain object (a DTO) |
| `'server-only' cannot be imported from a Client Component module` | a server module ended up in the client graph | read the **Import traces** and break the chain |
| `The "use client" directive must be placed before other expressions` | the directive comes after an import | move it to the first line |
| `ReferenceError: window is not defined` | a browser API in the body of a Client Component | move it into `useEffect` or a handler |
| `<Posts> is an async Client Component. Only Server Components can be async at the moment` | `async` + `'use client'` (only in `next dev`; the build passes) | remove the directive, fetch the data on the server |
| `Element type is invalid … but got: undefined` | a client component's `Menu.Item` used in server code | named exports |

Importing `server-only` into the client graph produces **two** errors. The second one (`'server-only' cannot be imported from a Client Component module … It should only be used from a Server Component.`) is clear; the first one isn't:

> [!warning] A message about the Pages Router
> On 16.3.8, the first error is `You're importing a module that depends on "server-only". This API is only available in Server Components in the App Router, but you are using it in the Pages Router.`, even without a `pages/` folder. [The docs](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning) promise just a "build-time error". Ignore the part about the Pages Router — read the **Import traces**.

The `Client Component Browser` block of the trace (shortened: the `Server Component` and `Client Component SSR` blocks are omitted):

```text
Import traces:
  Client Component Browser:
    ./lib/db.ts [Client Component Browser]
    ./app/user-badge.tsx [Client Component Browser]
    ./app/user-badge.tsx [Server Component]
    ./app/page.tsx [Server Component]
```

Read it bottom-up: the server `page.tsx` imports the client `user-badge.tsx` (the boundary), and that one imports `lib/db.ts`. Break the `user-badge.tsx → lib/db.ts` link: fetch the data on the server and pass it via props.


### 🏭 How it's done in production

- **Server by default, client at the leaves.** Buttons, inputs, menus, modals, and charts get `'use client'`. `'use client'` in a `page.tsx` or `layout.tsx` during code review is a reason to ask "why?"
- **A data layer with `server-only`.** The database, secrets, and internal APIs live in `lib/server/*` (or `lib/dal.ts`), each file with `import 'server-only'`; often there's also an ESLint `no-restricted-imports` rule for the client folders.
- **DTOs at the boundary.** The data layer returns allowlisted DTOs, not raw rows: a new column won't leak into the browser on its own.
- **A single `app/providers.tsx`** with all the contexts (color theme, query client, toasts) inside the root layout's `<body>`.
- **Wrappers for third-party libraries** in one folder such as `components/client/`, so the boundary is visible and easy to remove.
- **No secrets in `NEXT_PUBLIC_*`**; for "one image, many environments," public settings are served from the server.
- **Bundle control** with `next experimental-analyze` (the experimental Turbopack analyzer, Next.js 16.1+): chunk sizes and import chains.

## ⚠️ Pitfalls

> [!pitfall] use client on a layout "just in case"
> The errors go away, but everything the layout imports becomes client, and there's no more data access.
>
> ```tsx
> // ❌ app/layout.tsx
> 'use client' // now Logo, Nav, Footer, and their imports are in the bundle
>
> // ✅ the layout is server; only app/ui/search.tsx is client
> ```

> [!pitfall] A secret in a Client Component
> The bundle doesn't contain the value, but the server render puts it into the HTML.
>
> ```tsx
> 'use client'
> export function EnvProbe() {
>   return <p>{process.env.API_KEY}</p> // ❌ the key is in the page source
> }
> ```

> [!pitfall] The whole database object in props
> Props are serialized in full, regardless of what the component renders.
>
> ```tsx
> return <ProfileCard profile={user} /> // ❌ passwordHash is in the payload
> return <ProfileCard profile={{ name: user.name, avatarUrl: user.avatarUrl }} /> // ✅ DTO
> ```

> [!pitfall] window in the body of a Client Component
> `'use client'` doesn't cancel the server render: `window` in the component body fails during the build. Put browser APIs in `useEffect` or in handlers.
>
> ```tsx
> 'use client'
>
> import { useEffect, useState } from 'react'
>
> export function WindowWidth() {
>   const [width, setWidth] = useState<number | null>(null)
>   useEffect(() => {
>     const update = () => setWidth(window.innerWidth)
>     update()
>     window.addEventListener('resize', update)
>     return () => window.removeEventListener('resize', update)
>   }, [])
>   return <p>Ширина: {width ?? '…'}px</p>
> }
> ```

> [!pitfall] An async Client Component passes the build
> `next build` stays silent, but this mode isn't supported: `next dev` reports `is an async Client Component`. Usually the directive was added to a file written for the server.
>
> ```tsx
> 'use client'
>
> export async function Posts() { // ❌ async + 'use client'
>   const posts = await getPosts()
>   return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
> }
> ```

> [!pitfall] Menu.Item across the boundary
> Server code receives the client `Menu` as a reference without static fields.
>
> ```tsx
> // menu.tsx: 'use client' … Menu.Item = Item
> <Menu.Item>Профіль</Menu.Item> // ❌ in a Server Component: Element type is invalid
> <MenuItem>Профіль</MenuItem> // ✅ export function MenuItem
> ```

## 🎤 In the interview

> [!interview] How does a Server Component differ from a Client Component? Does a Client Component render on the server?
> level: junior · frequency: дуже часто · id: nextjs-core-07-int-01
>
> ---
>
> A Server Component runs only on the server (on request or during `next build`), and its code doesn't end up in the bundle; it can be `async` and read the database, but it has no state or event handlers. A Client Component runs **both on the server** (HTML on the initial load) **and in the browser** (hydration); during navigation, only in the browser from the RSC payload. "Client" means "the code ships to the browser," not "it renders only there." Everything is server by default.
>
> 📚 [[Next.js - 07. Server і Client Components#🗺️ Що де виконується|Section: what runs where]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary) · [React: Server Components](https://react.dev/reference/rsc/server-components)

> [!interview] What exactly does 'use client' do, and why don't you need it in every file?
> level: junior · frequency: дуже часто · id: nextjs-core-07-int-02
>
> ---
>
> It's the boundary between the server and client module graphs. A file with the directive, imported by server code, is an entry into the client: it and everything it transitively imports go into the bundle. So the directive is needed only at the entry; a component without it is agnostic — the import site determines its environment. Server Components in `children` stay server, because the client file doesn't import them.
>
> 📚 [[Next.js - 07. Server і Client Components#🚪 Директива use client — межа в графі модулів|Section: use client]] · [Next.js: use client](https://nextjs.org/docs/app/api-reference/directives/use-client) · [React: 'use client'](https://react.dev/reference/rsc/use-client)

> [!interview] How do you show a server component inside a client one (a modal with data from the database)?
> level: middle · frequency: часто · id: nextjs-core-07-int-03
>
> ---
>
> Don't import it into the client file — the import pulls the component and its dependencies into the client graph. The modal accepts `children`, and the server page writes `<Modal><Cart /></Modal>`: the owner of `Cart` is a server component, so `Cart` renders on the server, and `Modal` receives the finished output as a serialized element. This is interleaving; context providers work the same way.
>
> 📚 [[Next.js - 07. Server і Client Components#🧩 Композиція: серверне всередині клієнтського|Section: composition]] · [Next.js: Interleaving Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components) · [Dan Abramov: Impossible Components](https://overreacted.io/impossible-components/)

> [!interview] A product page: a gallery with a carousel, a description, a price, an "Add to cart" button, reviews. Where do you draw the 'use client' boundary?
> level: middle · frequency: часто · id: nextjs-core-07-int-04
>
> ---
>
> The page is a Server Component: it reads the product and reviews from the database and passes DTOs down. The description, price, and reviews are server. The client leaves: the carousel (through a wrapper if the library lacks the directive) and the "Add to cart" button with a handler and a Server Function in `addToCartAction`. If the reviews sit behind tabs, the tabs are a client wrapper, and the reviews come into it as `children`. The bundle contains only the carousel, the button, and the tabs.
>
> 📚 [[Next.js - 07. Server і Client Components#🧮 Як обрати: таблиця рішень|Section: decision table]] · [Next.js: Reducing JS bundle size](https://nextjs.org/docs/app/getting-started/server-and-client-components#reducing-js-bundle-size) · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary)

> [!interview] The module lib/format.ts is imported by both server and client components. How many copies of it are there, and what follows from that?
> level: senior · frequency: іноді · id: nextjs-core-07-int-05
>
> ---
>
> The module belongs to both graphs, and Next.js compiles it separately for each environment; server and client components run in isolated module systems, even when a Client Component renders on the server. So a module-level variable or singleton (a cache, a store) is two different instances, and they don't share state: server data reaches the client only through props. And everything the module imports goes into the bundle, so heavy or secret code is moved into a separate module with `import 'server-only'`.
>
> 📚 [[Next.js - 07. Server і Client Components#🚪 Директива use client — межа в графі модулів|Section: module graph]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary) · [Next.js: Data Security](https://nextjs.org/docs/app/guides/data-security#passing-data-from-server-to-client)

## 🔗 Connections

- [[Server Components]] and [[use client]] — the React reference: definitions and serializable types.
- [[use server]] and [[Server Functions]] — what crosses the boundary as a reference (course topic 21).
- [[JavaScript - 05. Замикання|JavaScript - 05. Closures]] — why a function can't be serialized: it needs an environment that doesn't exist in the browser.
- Next in the course: topic 08 — the boundary in detail (serialization, `children`, `server-only`, context), 09 — RSC payload, HTML, and hydration, 10 — static and dynamic, 11 — streaming and `use()`.

## ⚡ Quick facts

> [!reel] 🍽️ No browser ever sees Server Component code
> A Server Component reaches the browser only as render output in the RSC payload. Its code and dependencies — even an entire markdown library — add not a single byte to the bundle.

> [!reel] 🔁 A Client Component renders on the server too
> `'use client'` means "the code ships to the browser," not "it renders only there": on the initial load, the component runs on the server for the HTML and again in the browser during hydration.

> [!reel] 🚪 use client goes at the entry, not everywhere
> The directive is a boundary in the module graph: everything a client file imports is client anyway.

> [!reel] 🧳 children is a hole in a client component
> `<Modal><Cart /></Modal>` in a server file: `Cart` renders on the server, and `Modal` receives the finished output. The import defines the boundary, not nesting in JSX.

> [!reel] 🔑 A non-public variable in a Client Component ends up in the HTML
> The bundle doesn't contain `process.env.API_KEY`. But a Client Component renders on the server, where the key exists — and the key ends up in the page source.
>
> ```tsx
> 'use client'
> export const Leak = () => <p>{process.env.API_KEY}</p>
> ```

> [!reel] 🧪 server-only — a package whose contents you don't need
> Next.js handles `import 'server-only'` itself and stops the build if the module ends up in the client graph. You don't even have to install the npm package.

## 🧠 Review

### 🟢 Junior

> [!question]- Which kind of component is the default in the App Router — server or client?
> *дуже часто · теорія* · `nextjs-core-07-card-01`
>
> Server. Every `page.tsx`, `layout.tsx`, and any other component is a Server Component until the file (or a module that imports it) is marked with `'use client'`.
>
> 📚 [[Next.js - 07. Server і Client Components#🏠 За замовчуванням усе серверне|Section: server by default]] · [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

> [!question]- What can't a Server Component do?
> *дуже часто · теорія* · `nextjs-core-07-card-02`
>
> Have state and effects, read context, handle events (`onClick`), or touch `window`/`localStorage`. Its code isn't in the browser; only a new render on the server updates it.
>
> 📚 [[Next.js - 07. Server і Client Components#🏠 За замовчуванням усе серверне|Section: server by default]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary#state-and-interactivity)

> [!question]- Where does a Client Component run on the initial page load?
> *часто · теорія* · `nextjs-core-07-card-03`
>
> In two places: on the server (to produce the HTML) and in the browser (hydration — React attaches handlers to the existing DOM). During navigation via `Link`, only in the browser, from the RSC payload.
>
> 📚 [[Next.js - 07. Server і Client Components#🗺️ Що де виконується|Section: what runs where]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary#rendering-environments)

> [!question]- Where must the 'use client' directive go?
> *часто · код* · `nextjs-core-07-card-04`
>
> As the first expression in the file, before any imports (comments above it are allowed), in single or double quotes. After an import, the build fails with `The "use client" directive must be placed before other expressions`.
>
> ```tsx
> 'use client'
>
> import { useState } from 'react'
> ```
>
> 📚 [[Next.js - 07. Server і Client Components#🚪 Директива use client — межа в графі модулів|Section: use client]] · [React: 'use client'](https://react.dev/reference/rsc/use-client)

> [!question]- How do you use a third-party component with useState that has no 'use client'?
> *часто · практика* · `nextjs-core-07-card-05`
>
> Create your own wrapper file with the directive and a re-export: `'use client'; export { Carousel } from 'acme-carousel'`. The server page imports the wrapper and stays server.
>
> 📚 [[Next.js - 07. Server і Client Components#📚 Сторонні компоненти без директиви|Section: third-party components]] · [Next.js: Third-party components](https://nextjs.org/docs/app/getting-started/server-and-client-components#third-party-components)

### 🟡 Middle

> [!question]- Why is 'use client' called a boundary in the module graph rather than a component marker?
> *часто · теорія* · `nextjs-core-07-card-06`
>
> Because it acts on **imports**: the file with the directive and everything it transitively imports go into the client bundle, and server code gets only a reference. A component without the directive becomes server or client depending on where it's imported.
>
> 📚 [[Next.js - 07. Server і Client Components#🚪 Директива use client — межа в графі модулів|Section: use client]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary#crossing-the-boundary)

> [!question]- Which props can you pass from a Server Component to a Client Component?
> *дуже часто · теорія* · `nextjs-core-07-card-07`
>
> Serializable ones: primitives (including `bigint` and `undefined`), `Symbol.for(...)`, arrays, plain objects, `Date`, `Map`, `Set`, typed arrays, `Promise`, JSX, Server Functions (as references). Not allowed: regular functions, classes and their instances, objects with a `null` prototype, local `Symbol()`s.
>
> 📚 [[Next.js - 07. Server і Client Components#🧳 Що можна передати через межу|Section: what can cross]] · [React: Serializable types](https://react.dev/reference/rsc/use-client#serializable-types)

> [!question]- How do a component's owner and parent differ, and why does it matter for RSC?
> *іноді · теорія* · `nextjs-core-07-card-08`
>
> The owner is the component whose code contains the child's JSX; the parent is the one that contains it in the tree. In `<Modal><Cart /></Modal>` in a server page, the owner of `Cart` is the page, so `Cart` renders on the server, and the parent `Modal` just places the finished output.
>
> 📚 [[Next.js - 07. Server і Client Components#🧩 Композиція: серверне всередині клієнтського|Section: composition]] · [Next.js: Interleaving](https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components)

> [!question]- How do you use React Context if the layout is a Server Component?
> *часто · практика* · `nextjs-core-07-card-09`
>
> A client provider (`'use client'`, `createContext`, state) accepts `children` and is rendered in the layout around `{children}`, as deep as possible. The pages under it stay server.
>
> 📚 [[Next.js - 07. Server і Client Components#🎛️ Контекст і провайдери|Section: context and providers]] · [Next.js: Context providers](https://nextjs.org/docs/app/getting-started/server-and-client-components#context-providers)

### 🔴 Senior

> [!question]- Why is a non-public environment variable in a Client Component dangerous if it doesn't end up in the bundle?
> *іноді · безпека* · `nextjs-core-07-card-10`
>
> A Client Component also renders on the server, where `process.env` is complete, so the key ends up in the page source. After hydration, React replaces the text with `undefined` and reports a hydration mismatch, but the secret has already been sent.
>
> 📚 [[Next.js - 07. Server і Client Components#🔐 Секрети, env і server-only|Section: secrets and env]] · [Next.js: Environment Variables](https://nextjs.org/docs/app/guides/environment-variables)

> [!question]- What is environment poisoning, and how do you protect against it?
> *іноді · безпека* · `nextjs-core-07-card-11`
>
> Server code (the database, secrets) accidentally getting into the client graph through shared modules. Protection: `import 'server-only'` (the build fails with an import trace), `client-only` as the mirror image, plus `no-restricted-imports`.
>
> 📚 [[Next.js - 07. Server і Client Components#🔐 Секрети, env і server-only|Section: server-only]] · [Next.js: Preventing environment poisoning](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning)

> [!question]- Why does a compound component like Menu.Item break when used from a Server Component?
> *рідко · код* · `nextjs-core-07-card-12`
>
> Server code receives the client `Menu` as a reference without static fields: `Menu.Item` is `undefined`, and React throws `Element type is invalid`. The fix is named exports (`MenuItem`).
>
> 📚 [[Next.js - 07. Server і Client Components#🧩 Композиція: серверне всередині клієнтського|Section: composition]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary)

> [!question]- Why is passing a whole database object to a Client Component a leak, even if the component shows only one field?
> *часто · безпека* · `nextjs-core-07-card-13`
>
> Props are serialized into the RSC payload in full — into the HTML on the initial load and into the Network tab during navigation. TypeScript won't help: a supertype fits. The fix is an allowlisted DTO.
>
> 📚 [[Next.js - 07. Server і Client Components#🔐 Секрети, env і server-only|Section: DTO]] · [Next.js: Data Security](https://nextjs.org/docs/app/guides/data-security#passing-data-from-server-to-client)

## 🛠️ Practice

> [!task] Find the leak in the profile DTO
> level: junior · difficulty: easy · id: nextjs-core-07-task-01 · tags: dto, security, rsc
>
> The page passes the result of `toProfileDTO(user, viewer)` to the client `ProfileCard`. The author "removed the password" and assumes the rest is safe. Rewrite the function using an **allowlist**:
>
> - always: `id`, `name`, `avatarUrl`, and `isOwner` (`true` if `viewer` is the same user);
> - `email` — only for the owner (`viewer?.id === user.id`); for everyone else, the `email` key must not exist at all;
> - no other fields, not even ones that get added to the model tomorrow.
>
> `viewer` may be `null` (a guest). This is a TypeScript task: types are stripped before running and aren't checked; the tests look at values.
>
> ```ts starter
> type User = {
>   id: string
>   name: string
>   email: string
>   avatarUrl: string
>   passwordHash: string
>   sessionToken: string
>   [extra: string]: unknown
> }
>
> type ProfileDTO = {
>   id: string
>   name: string
>   avatarUrl: string
>   isOwner: boolean
>   email?: string
> }
>
> function toProfileDTO(user: User, viewer: { id: string } | null): ProfileDTO {
>   // ❌ "removed the password" — and assume the rest is safe
>   const { passwordHash, ...rest } = user
>   return rest as unknown as ProfileDTO
> }
> ```
>
> ```ts tests
> const user: User = {
>   id: 'u1',
>   name: 'Оля',
>   email: 'olya@example.com',
>   avatarUrl: '/a/u1.png',
>   passwordHash: '$argon2id$secret',
>   sessionToken: 'sess_secret',
> }
>
> test('does not return passwordHash or sessionToken', () => {
>   const dto = toProfileDTO(user, { id: 'u2' }) as Record<string, unknown>
>   expect(dto.passwordHash).toBeUndefined()
>   expect(dto.sessionToken).toBeUndefined()
> })
>
> test('returns exactly id, name, avatarUrl, isOwner to another user', () => {
>   const dto = toProfileDTO(user, { id: 'u2' })
>   expect(Object.keys(dto).sort()).toEqual(['avatarUrl', 'id', 'isOwner', 'name'])
>   expect(dto.isOwner).toBe(false)
> })
>
> test('the owner sees their email', () => {
>   const dto = toProfileDTO(user, { id: 'u1' })
>   expect(dto).toEqual({ id: 'u1', name: 'Оля', avatarUrl: '/a/u1.png', email: 'olya@example.com', isOwner: true })
> })
>
> test('a new model field does not leak', () => {
>   const dto = toProfileDTO({ ...user, stripeCustomerId: 'cus_123' }, { id: 'u1' }) as Record<string, unknown>
>   expect(dto.stripeCustomerId).toBeUndefined()
>   expect(Object.keys(dto)).toHaveLength(5)
> })
>
> test('a guest (viewer = null) does not see the email', () => {
>   const dto = toProfileDTO(user, null)
>   expect('email' in dto).toBe(false)
>   expect(dto.isOwner).toBe(false)
> })
> ```
>
> > [!hint]- Hint 1
> > A denylist (`const { passwordHash, ...rest }`) lets through everything you didn't think of. Build a new object from the fields you need.
>
> > [!hint]- Hint 2
> > `email: undefined` is still a key. Add the field conditionally: `if (isOwner) dto.email = user.email`.
>
> > [!solution]- Reference solution
> > ```ts
> > function toProfileDTO(user: User, viewer: { id: string } | null): ProfileDTO {
> >   const isOwner = viewer != null && viewer.id === user.id
> >   const dto: ProfileDTO = {
> >     id: user.id,
> >     name: user.name,
> >     avatarUrl: user.avatarUrl,
> >     isOwner,
> >   }
> >   if (isOwner) dto.email = user.email
> >   return dto
> > }
> > ```
> >
> > An allowlist doesn't depend on the rest of the model: a new column won't leak into the RSC payload on its own. Even `email: undefined` would be serialized and hint that the field exists. In real code, a function like this lives in the data layer with `import 'server-only'`.

> [!task] Check whether props can cross the boundary
> level: middle · difficulty: medium · id: nextjs-core-07-task-02 · tags: serialization, rsc
>
> Write `findUnserializable(props)` — it returns an array of paths to values that **can't** be passed from a Server Component to a Client Component. The rules (a simplified model of React):
>
> - allowed: `string`, `number`, `bigint`, `boolean`, `undefined`, `null`; `Date`, `Map`, `Set`, `Promise`, `ArrayBuffer`, and typed arrays (`ArrayBuffer.isView`) — we don't check their contents;
> - a `symbol` — only if registered (`Symbol.keyFor(s) !== undefined`);
> - a function — only a Server Function: it has `fn.$$typeof === Symbol.for('react.server.reference')` (this is how React marks references to server functions);
> - arrays and plain objects (prototype `Object.prototype`) — check them deeply;
> - all other objects (class instances, `Object.create(null)`) — not allowed.
>
> Path format: `user.save`, `items[1].format`; the order is the traversal order; there are no cycles.
>
> ```js
> findUnserializable({ title: 'Кошик', onClose: () => {} }) // → ['onClose']
> ```
>
> ```js starter
> function findUnserializable(props) {
>   // your code
> }
> ```
>
> ```js tests
> test('primitives, Date, Map, Set, and plain objects pass', () => {
>   const props = {
>     a: 'x', b: 1, c: BigInt(2), d: true, e: undefined, f: null,
>     when: new Date(), tags: new Set(['a']), prices: new Map([['p1', 1]]),
>     nested: { list: [1, 'два', { ok: true }] }, bytes: new Uint8Array(2), buf: new ArrayBuffer(2), pending: Promise.resolve(1),
>   }
>   expect(findUnserializable(props)).toEqual([])
> })
>
> test('finds a regular function', () => {
>   expect(findUnserializable({ title: 'Кошик', onClose: () => {} })).toEqual(['onClose'])
> })
>
> test('lets a Server Function through', () => {
>   async function like() {}
>   like.$$typeof = Symbol.for('react.server.reference')
>   expect(findUnserializable({ likeAction: like })).toEqual([])
> })
>
> test('searches deep into objects and arrays', () => {
>   const props = {
>     user: { name: 'Оля', save() {} },
>     items: [{ id: 1 }, { id: 2, format: (n) => n }],
>   }
>   expect(findUnserializable(props)).toEqual(['user.save', 'items[1].format'])
> })
>
> test('rejects class instances and null prototypes', () => {
>   class Money { constructor(amount) { this.amount = amount } }
>   expect(findUnserializable({ price: new Money(1), dict: Object.create(null) })).toEqual(['price', 'dict'])
> })
>
> test('a symbol only if registered', () => {
>   expect(findUnserializable({ ok: Symbol.for('app.ok'), bad: Symbol('local') })).toEqual(['bad'])
> })
> ```
>
> > [!hint]- Hint 1
> > Write a recursive `walk(value, path)` and collect the paths into a single array. For a top-level key, the path is just the key name.
>
> > [!hint]- Hint 2
> > The order of checks for objects: `Array.isArray` → built-ins (`instanceof Date/Map/Set/Promise/ArrayBuffer`, `ArrayBuffer.isView`) → `Object.getPrototypeOf(value) === Object.prototype` → otherwise it's an error.
>
> > [!solution]- Reference solution
> > ```js
> > function findUnserializable(props) {
> >   const bad = []
> >   const SERVER_REF = Symbol.for('react.server.reference')
> >   const join = (path, key) => (path ? `${path}.${key}` : key)
> >
> >   function walk(value, path) {
> >     if (value === null || value === undefined) return
> >     const t = typeof value
> >     if (t === 'string' || t === 'number' || t === 'bigint' || t === 'boolean') return
> >     if (t === 'symbol') {
> >       if (Symbol.keyFor(value) === undefined) bad.push(path)
> >       return
> >     }
> >     if (t === 'function') {
> >       if (value.$$typeof !== SERVER_REF) bad.push(path)
> >       return
> >     }
> >     if (Array.isArray(value)) {
> >       value.forEach((item, i) => walk(item, `${path}[${i}]`))
> >       return
> >     }
> >     if (
> >       value instanceof Date || value instanceof Map || value instanceof Set ||
> >       value instanceof Promise || value instanceof ArrayBuffer || ArrayBuffer.isView(value)
> >     ) return
> >     if (Object.getPrototypeOf(value) === Object.prototype) {
> >       for (const key of Object.keys(value)) walk(value[key], join(path, key))
> >       return
> >     }
> >     bad.push(path)
> >   }
> >
> >   for (const key of Object.keys(props)) walk(props[key], key)
> >   return bad
> > }
> > ```
> >
> > Real React does the same thing during serialization and throws an error with the first bad value. Simplifications of the model: React also checks the contents of `Map`/`Set`, and it supports JSX and circular references.

> [!task] What ends up in the client bundle
> level: middle · difficulty: hard · id: nextjs-core-07-task-03 · tags: module-graph, bundle, server-only
>
> Write `clientBundle(graph, entries)`: `graph` is `{ [file]: { directive, imports } }` (`directive` is `'use client'`, `'use server'`, or `null`), and `entries` are the route files. Return a **sorted** array of the files in the client bundle.
>
> Rules:
>
> 1. The traversal starts in the server environment.
> 2. A `'use client'` file imported from the server is an entry into the client: it and its transitive imports are client. Inside the client, the directive changes nothing.
> 3. A `'use server'` file imported from the client does **not** go into the bundle (only a reference); don't traverse its imports.
> 4. Imports outside `graph` are npm packages — ignore them. Except `'server-only'` in a client module and `'client-only'` in a server module: `throw new Error(...)` with the module name.
> 5. A module can be in both environments; imports can be circular.
>
> ```js
> clientBundle({
>   'app/page.tsx': { directive: null, imports: ['app/modal.tsx', 'lib/format.ts'] },
>   'app/modal.tsx': { directive: 'use client', imports: ['lib/format.ts'] },
>   'lib/format.ts': { directive: null, imports: [] },
> }, ['app/page.tsx']) // → ['app/modal.tsx', 'lib/format.ts']
> ```
>
> ```js starter
> function clientBundle(graph, entries) {
>   // your code
> }
> ```
>
> ```js tests
> const shop = {
>   'app/shop/page.tsx': { directive: null, imports: ['app/ui/cart.tsx', 'app/ui/modal.tsx', 'lib/format.ts'] },
>   'app/ui/cart.tsx': { directive: null, imports: ['lib/db.ts'] },
>   'lib/db.ts': { directive: null, imports: ['server-only', 'pg'] },
>   'app/ui/modal.tsx': { directive: 'use client', imports: ['react', 'app/ui/button.tsx', 'lib/format.ts'] },
>   'app/ui/button.tsx': { directive: null, imports: [] },
>   'lib/format.ts': { directive: null, imports: [] },
> }
>
> test('returns only client graph modules, sorted', () => {
>   expect(clientBundle(shop, ['app/shop/page.tsx'])).toEqual(['app/ui/button.tsx', 'app/ui/modal.tsx', 'lib/format.ts'])
> })
>
> test('a page with no client entries gives an empty bundle', () => {
>   expect(clientBundle(shop, ['app/ui/cart.tsx'])).toEqual([])
> })
>
> test('use server imported from the client does not end up in the bundle', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['app/like.tsx'] },
>     'app/like.tsx': { directive: 'use client', imports: ['app/actions.ts'] },
>     'app/actions.ts': { directive: 'use server', imports: ['lib/db.ts'] },
>     'lib/db.ts': { directive: null, imports: ['server-only'] },
>   }
>   expect(clientBundle(graph, ['app/page.tsx'])).toEqual(['app/like.tsx'])
> })
>
> test('throws if a client module pulls in server-only', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['app/badge.tsx'] },
>     'app/badge.tsx': { directive: 'use client', imports: ['lib/db.ts'] },
>     'lib/db.ts': { directive: null, imports: ['server-only'] },
>   }
>   expect(() => clientBundle(graph, ['app/page.tsx'])).toThrow('lib/db.ts')
> })
>
> test('throws if a server module pulls in client-only', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['lib/storage.ts'] },
>     'lib/storage.ts': { directive: null, imports: ['client-only'] },
>   }
>   expect(() => clientBundle(graph, ['app/page.tsx'])).toThrow('lib/storage.ts')
> })
>
> test('a module visited by the server first still ends up in the bundle', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['lib/format.ts', 'app/modal.tsx'] },
>     'app/modal.tsx': { directive: 'use client', imports: ['lib/format.ts'] },
>     'lib/format.ts': { directive: null, imports: [] },
>   }
>   expect(clientBundle(graph, ['app/page.tsx'])).toEqual(['app/modal.tsx', 'lib/format.ts'])
> })
>
> test('does not loop forever on circular imports', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['app/a.tsx', 'app/b.tsx'] },
>     'app/a.tsx': { directive: 'use client', imports: ['app/b.tsx'] },
>     'app/b.tsx': { directive: null, imports: ['app/a.tsx', 'app/page.tsx'] },
>   }
>   expect(clientBundle(graph, ['app/page.tsx'])).toEqual(['app/a.tsx', 'app/b.tsx', 'app/page.tsx'])
> })
> ```
>
> > [!hint]- Hint 1
> > Traverse the graph depth-first with an "environment" parameter: `visit(file, env)`. Store the visited `file + env` pairs in a `Set` — then cycles are harmless, and a single file can be visited in two environments.
>
> > [!hint]- Hint 2
> > Before recursing, determine the module's environment: server + `'use client'` → client; client + `'use server'` → stop (only a reference). Check the special packages before skipping unknown imports.
>
> > [!solution]- Reference solution
> > ```js
> > function clientBundle(graph, entries) {
> >   const seen = new Set()
> >   const client = new Set()
> >
> >   function visit(file, env) {
> >     const mod = graph[file]
> >     if (!mod) return
> >     if (env === 'client' && mod.directive === 'use server') return
> >     if (env === 'server' && mod.directive === 'use client') env = 'client'
> >     const key = `${env}:${file}`
> >     if (seen.has(key)) return
> >     seen.add(key)
> >     if (env === 'client') client.add(file)
> >
> >     for (const dep of mod.imports) {
> >       if (dep === 'server-only' && env === 'client') {
> >         throw new Error(`"server-only" імпортовано з клієнтського модуля ${file}`)
> >       }
> >       if (dep === 'client-only' && env === 'server') {
> >         throw new Error(`"client-only" імпортовано з серверного модуля ${file}`)
> >       }
> >       visit(dep, env)
> >     }
> >   }
> >
> >   for (const entry of entries) visit(entry, 'server')
> >   return [...client].sort()
> > }
> > ```
> >
> > The visit key is an "environment + file" pair, because `lib/format.ts` legitimately lives in both graphs. The last test shows something non-obvious: the circular import `b.tsx → page.tsx` from the client graph pulls the page itself into the bundle — a sign that a client module imports more than it should.

## 📚 Sources and further reading

- 🟢 [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — the official starting point: choosing, composition, context, `server-only`.
- 🟡 [Next.js — The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary) — what runs where, owner and parent, what crosses the boundary.
- 🟡 [Next.js — use client](https://nextjs.org/docs/app/api-reference/directives/use-client) — the directive reference.
- 🟡 [Next.js — Data Security](https://nextjs.org/docs/app/guides/data-security) — DTOs, the Data Access Layer, the Taint API.
- 🟡 [Next.js — Environment Variables](https://nextjs.org/docs/app/guides/environment-variables) — `NEXT_PUBLIC_` and inlining at `next build`.
- 🔴 [React — 'use client'](https://react.dev/reference/rsc/use-client) — the primary source and the full list of serializable types.
- 🔴 [React — Server Components](https://react.dev/reference/rsc/server-components) — React's own model of RSC.
- 🟡 [Dan Abramov — What Does "use client" Do?](https://overreacted.io/what-does-use-client-do/) — directives as "doors" between two programs.
- 🟡 [Dan Abramov — Impossible Components](https://overreacted.io/impossible-components/) — what server-inside-client makes possible.
- 🛠️ [Next.js — Package Bundling](https://nextjs.org/docs/app/guides/package-bundling) — `next experimental-analyze`.

> [!important] Summary
> - In the App Router, everything is server by default. A Server Component runs only on the server (on request or during `next build`), and its code doesn't ship to the browser.
> - A Client Component runs **both on the server** (HTML) **and in the browser** (hydration); during navigation, only in the browser from the RSC payload.
> - `'use client'` is a boundary in the module graph: everything a client file imports becomes client. Put the boundary at the smallest interactive leaf.
> - Serializable props, JSX, and Server Functions (as references) can cross the boundary. Functions and classes can't. Server inside client goes through `children`.
> - Keep secrets only in modules with `import 'server-only'`. Props are public data, so pass DTOs; a non-public variable in a Client Component ends up in the page source HTML.
