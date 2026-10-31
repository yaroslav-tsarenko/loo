# MDX в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 03. Layouts та сторінки]], [[Next.js - 10. CSS та стилізація]]

MDX — розширення Markdown, що дозволяє писати JSX прямо в markdown-файлах. Next.js підтримує локальний та віддалений MDX-контент.

## Встановлення

```bash
pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

## Конфігурація

```js
// next.config.mjs
import createMDX from '@next/mdx'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  // Додайте markdown плагіни тут
})

export default withMDX(nextConfig)
```

Для обробки `.md` файлів:

```js
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
})
```

## Файл `mdx-components.tsx`

Обов'язковий файл у корені проєкту:

```tsx
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

## Рендеринг MDX

### Файлова маршрутизація

Створіть `app/mdx-page/page.mdx`:

```mdx
import { MyComponent } from 'my-component'

# Ласкаво просимо!

Це **жирний** та _курсивний_ текст.

<MyComponent />
```

### Через імпорт

```tsx
// app/mdx-page/page.tsx
import Welcome from '@/markdown/welcome.mdx'

export default function Page() {
  return <Welcome />
}
```

### Динамічний імпорт

```tsx
// app/blog/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { default: Post } = await import(`@/content/${slug}.mdx`)
  return <Post />
}

export function generateStaticParams() {
  return [{ slug: 'welcome' }, { slug: 'about' }]
}

export const dynamicParams = false
```

## Кастомні стилі та компоненти

### Глобальні

```tsx
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'

const components = {
  h1: ({ children }) => (
    <h1 style={{ color: 'red', fontSize: '48px' }}>{children}</h1>
  ),
  img: (props) => (
    <Image
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
      {...(props as ImageProps)}
    />
  ),
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
```

### Локальні

```tsx
// app/mdx-page/page.tsx
import Welcome from '@/markdown/welcome.mdx'

function CustomH1({ children }) {
  return <h1 style={{ color: 'blue', fontSize: '100px' }}>{children}</h1>
}

export default function Page() {
  return <Welcome components={{ h1: CustomH1 }} />
}
```

### Tailwind Typography

```tsx
// app/mdx-page/layout.tsx
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-h1:text-5xl dark:prose-headings:text-white">
      {children}
    </div>
  )
}
```

## Frontmatter

`@next/mdx` не підтримує frontmatter за замовчуванням. Використовуйте exports:

```mdx
export const metadata = {
  author: 'John Doe',
}

# Стаття блогу
```

```tsx
// app/blog/page.tsx
import BlogPost, { metadata } from '@/content/blog-post.mdx'

export default function Page() {
  console.log(metadata) // { author: 'John Doe' }
  return <BlogPost />
}
```

Для YAML frontmatter: `remark-frontmatter`, `remark-mdx-frontmatter`, `gray-matter`.

## Плагіни remark та rehype

```js
// next.config.mjs
import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
```

### З Turbopack

Плагіни вказуються як рядки:

```js
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm', ['remark-toc', { heading: 'Зміст' }]],
    rehypePlugins: ['rehype-slug'],
  },
})
```

## Rust-компілятор MDX (експериментально)

```js
module.exports = withMDX({
  experimental: {
    mdxRs: true,
  },
})
```
