# JSON-LD у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 16. Метадані та SEO]]

JSON-LD — формат структурованих даних для пошукових систем та AI. Описує сутності: товари, рецепти, події, організації тощо.

## Реалізація

Рендеріть як `<script>` тег у `layout.js` або `page.js`:

```tsx
// app/products/[id]/page.tsx
export default async function Page({ params }) {
  const { id } = await params
  const product = await getProduct(id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
  }

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* ... */}
    </section>
  )
}
```

> `.replace(/</g, '\\u003c')` — захист від XSS ін'єкцій через HTML теги в JSON-LD.

## Type Safety з schema-dts

```tsx
import { Product, WithContext } from 'schema-dts'

const jsonLd: WithContext<Product> = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Next.js Sticker',
  image: 'https://nextjs.org/imgs/sticker.png',
  description: 'Dynamic at the speed of static.',
}
```

## Валідація

- [Rich Results Test](https://search.google.com/test/rich-results) — для Google
- [Schema Markup Validator](https://validator.schema.org/) — загальний валідатор

> Використовуйте нативний `<script>`, а не `next/script` — JSON-LD це структуровані дані, не виконуваний код.
