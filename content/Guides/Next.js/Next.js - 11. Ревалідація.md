# Ревалідація даних у Next.js

> Документація на основі Next.js 16.2.4 (App Router) з Cache Components
> Пов'язано: [[Next.js - 08. Кешування]], [[Next.js - 07. Мутація даних]]

Ревалідація — це процес оновлення кешованих даних. Дві стратегії:

- **Часова ревалідація** — автоматичне оновлення через `cacheLife`
- **Ревалідація на вимогу** — ручне скидання через `revalidateTag`, `updateTag` або `revalidatePath`

## `cacheLife` — часова ревалідація

Контролює тривалість життя кешу. Використовується всередині `use cache`:

```tsx
import { cacheLife } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM products')
}
```

### Вбудовані профілі

| Профіль | `stale` | `revalidate` | `expire` |
|---------|---------|-------------|----------|
| `seconds` | 0 | 1с | 60с |
| `minutes` | 5хв | 1хв | 1год |
| `hours` | 5хв | 1год | 1д |
| `days` | 5хв | 1д | 1тиж |
| `weeks` | 5хв | 1тиж | 30д |
| `max` | 5хв | 30д | ~нескінченно |

### Кастомна конфігурація

```tsx
'use cache'
cacheLife({
  stale: 3600,     // 1 година до "несвіжого"
  revalidate: 7200, // 2 години до ревалідації
  expire: 86400,    // 1 день до видалення
})
```

> Кеш з профілем `seconds`, `revalidate: 0`, або `expire` менше 5 хвилин вважається "короткоживучим" і автоматично виключається з prerenders.

## `cacheTag` — теги кешу

Тегуйте кешовані дані для ревалідації на вимогу:

```tsx
import { cacheTag } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheTag('products')
  return db.query('SELECT * FROM products')
}
```

Після тегування скидайте кеш через `revalidateTag` або `updateTag`.

## `revalidateTag` — фонова ревалідація

Стратегія **stale-while-revalidate** — несвіжий контент відразу, свіжий у фоні:

```ts
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string) {
  // Мутація даних
  revalidateTag('user', 'max') // stale-while-revalidate
}
```

Підходить для контенту, де невелика затримка оновлення прийнятна (блоги, каталоги).

Можна викликати в [[Next.js - 07. Мутація даних|Server Actions]] та [[Next.js - 15. Route Handlers|Route Handlers]].

## `updateTag` — миттєва ревалідація

Негайно видаляє кеш для сценарію **read-your-own-writes** — користувач одразу бачить свої зміни. Доступний **тільки в Server Actions**:

```ts
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content'),
    },
  })

  updateTag('posts')
  redirect(`/posts/${post.id}`)
}
```

### Порівняння `updateTag` vs `revalidateTag`

| | `updateTag` | `revalidateTag` |
|---|---|---|
| **Де** | Тільки Server Actions | Server Actions та Route Handlers |
| **Поведінка** | Негайне видалення кешу | Stale-while-revalidate |
| **Коли** | Користувач повинен бачити свої зміни | Фонове оновлення |

## `revalidatePath` — ревалідація за шляхом

Скидає кеш для конкретного маршруту:

```ts
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  // Мутація даних
  revalidatePath('/profile')
}
```

> Надавайте перевагу тег-базованій ревалідації — вона точніша та уникає зайвого скидання.

## Що кешувати?

Кешуйте дані, що не залежать від [[Next.js - 08. Кешування#Робота з runtime API|runtime даних]] і які можна подавати з кешу протягом певного часу. Для CMS з механізмами оновлення використовуйте теги з довшими термінами кешу та `revalidateTag` при зміні контенту.
