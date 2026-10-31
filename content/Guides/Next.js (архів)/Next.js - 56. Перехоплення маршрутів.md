# Перехоплення маршрутів у Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 55. Паралельні маршрути]]

Перехоплення маршрутів (Intercepting Routes) дозволяє завантажити маршрут з іншої частини застосунку всередині поточного layout, не змінюючи контекст.

## Приклад

Клік на фото у стрічці → модалка з фото поверх стрічки. Пряме посилання або оновлення → повна сторінка фото.

## Конвенція

Визначається через `(..)`, аналогічно відносним шляхам `../`:

| Конвенція | Зіставлення |
|-----------|------------|
| `(.)` | **Той самий рівень** |
| `(..)` | **На один рівень вище** |
| `(..)(..)` | **На два рівні вище** |
| `(...)` | **Від кореня `app`** |

Наприклад, перехоплення `photo` з `feed`:

> [!diagram] (..)photo усередині feed перехоплює /photo/[id]
> ```yaml
> layout: tree
> nodes:
>   - { id: app, text: "app/", tone: violet, icon: "si:SiNextdotjs" }
>   - { id: feed, text: "feed/", note: "стрічка /feed", parent: app, tone: blue, icon: "pi:PiFoldersFill" }
>   - { id: ip, text: "(..)photo/", note: "перехоплення на рівень вище", parent: feed, tone: orange, icon: "pi:PiFoldersFill" }
>   - { id: iid, text: "[id]/", parent: ip, tone: orange, icon: "pi:PiFoldersFill" }
>   - { id: ipage, text: "page.tsx", note: "фото поверх стрічки", parent: iid, tone: orange, icon: "px:file" }
>   - { id: photo, text: "photo/", parent: app, tone: green, icon: "pi:PiFoldersFill" }
>   - { id: pid, text: "[id]/", parent: photo, tone: green, icon: "pi:PiFoldersFill" }
>   - { id: ppage, text: "page.tsx", note: "повна сторінка фото", parent: pid, tone: green, icon: "px:file" }
> steps:
>   - { show: [app, photo, pid, ppage], note: "Звичайний маршрут /photo/[id] — повна сторінка фото." }
>   - { show: feed, note: "Поруч — стрічка /feed, з якої користувач клікає на фото." }
>   - { show: [ip, iid, ipage], note: "У feed/ лежить (..)photo — як «../photo» у шляхах: перехоплює сегмент photo на рівень вище." }
>   - { move: { from: feed, to: ipage, value: "клік → /photo/123" }, note: "Клік у стрічці: URL стає /photo/123, але рендериться перехоплена сторінка — фото поверх стрічки, контекст зберігається." }
>   - { move: { from: app, to: ppage, value: "оновлення /photo/123" }, note: "Пряме посилання або оновлення сторінки — перехоплення не спрацьовує, і відкривається повна сторінка фото." }
> ```

> `(..)` базується на **сегментах маршруту**, а не на файловій системі. Слоти `@slot` не враховуються.

## Модалки з паралельними маршрутами

Основний паттерн — комбінація Intercepting Routes + Parallel Routes:

- Контент модалки **доступний через URL**
- **Контекст зберігається** при оновленні сторінки
- **Назад** — закриває модалку (а не переходить на попередню сторінку)
- **Вперед** — відкриває модалку

> [!diagram] Модалка: перехоплення + слот @modal
> ```yaml
> layout: tree
> nodes:
>   - { id: app, text: "app/", tone: violet, icon: "si:SiNextdotjs" }
>   - { id: modal, text: "@modal/", note: "слот, не сегмент", parent: app, tone: orange, icon: "pi:PiFoldersFill" }
>   - { id: ip, text: "(..)photo/", parent: modal, tone: orange, icon: "pi:PiFoldersFill" }
>   - { id: iid, text: "[id]/", parent: ip, tone: orange, icon: "pi:PiFoldersFill" }
>   - { id: mpage, text: "page.tsx", note: "модалка", parent: iid, tone: orange, icon: "px:file" }
>   - { id: def, code: "return null", label: "default.tsx", parent: modal, tone: gray }
>   - { id: photo, text: "photo/", parent: app, tone: green, icon: "pi:PiFoldersFill" }
>   - { id: pid, text: "[id]/", parent: photo, tone: green, icon: "pi:PiFoldersFill" }
>   - { id: ppage, text: "page.tsx", note: "повна сторінка", parent: pid, tone: green, icon: "px:file" }
>   - { id: layout, text: "layout.tsx", note: "рендерить children і modal", parent: app, tone: violet, icon: "px:file" }
>   - { id: page, text: "page.tsx", note: "стрічка", parent: app, tone: blue, icon: "px:file" }
> steps:
>   - { show: [app, layout, page, photo, pid, ppage], note: "Основа: layout, стрічка page.tsx і повна сторінка фото photo/[id]." }
>   - { show: [modal, def], line: "def:1", note: "Слот @modal. Поки нічого не перехоплено, default.tsx повертає null — модалки немає." }
>   - { show: [ip, iid, mpage], note: "Усередині слоту — (..)photo. Лише одна пара дужок, бо @modal — слот, а не сегмент: photo для нього на рівень вище." }
>   - { move: { from: page, to: mpage, value: "клік → /photo/123" }, note: "Клік на фото: URL змінюється, а в слоті @modal з'являється модалка поверх стрічки. «Назад» просто закриє її." }
>   - { move: { from: app, to: ppage, value: "оновлення /photo/123" }, note: "Оновлення або пряме посилання — відкривається повна сторінка фото. Контент модалки завжди доступний за URL." }
> ```

Оскільки `@modal` — слот (не сегмент), `photo` знаходиться на один рівень вище (навіть якщо на два рівні у файловій системі).
