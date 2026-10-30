# Структура проєкту Next.js

> Документація на основі Next.js 16.2.4 (App Router)
> Пов'язано: [[Next.js - 01. Встановлення]], [[Next.js - 03. Layouts та сторінки]], [[Next.js - 14. Метадані та OG-зображення]]

## Папки верхнього рівня

| Папка | Призначення |
|-------|------------|
| `app` | App Router |
| `pages` | Pages Router (застарілий) |
| `public` | Статичні ресурси |
| `src` | Опціональна папка для коду застосунку |

## Файли верхнього рівня

| Файл | Призначення |
|------|------------|
| `next.config.js` | Конфігурація Next.js |
| `package.json` | Залежності та скрипти |
| `instrumentation.ts` | OpenTelemetry та інструментування |
| `proxy.ts` | Next.js request proxy |
| `.env` | Змінні середовища |
| `.env.local` | Локальні змінні середовища |
| `.env.production` | Продакшен змінні середовища |
| `.env.development` | Змінні середовища розробки |
| `eslint.config.mjs` | Конфігурація ESLint |
| `tsconfig.json` | Конфігурація TypeScript |

## Файли маршрутизації

Додайте `page` для відкриття маршруту, `layout` для спільного UI, `loading` для скелетонів, `error` для обробки помилок, `route` для API.

| Файл | Розширення | Призначення |
|------|-----------|------------|
| `layout` | `.js` `.jsx` `.tsx` | Макет (Layout) |
| `page` | `.js` `.jsx` `.tsx` | Сторінка |
| `loading` | `.js` `.jsx` `.tsx` | UI завантаження |
| `not-found` | `.js` `.jsx` `.tsx` | UI "Не знайдено" |
| `error` | `.js` `.jsx` `.tsx` | UI помилки |
| `global-error` | `.js` `.jsx` `.tsx` | Глобальний UI помилки |
| `route` | `.js` `.ts` | API-ендпоінт |
| `template` | `.js` `.jsx` `.tsx` | Layout з повторним рендерингом |
| `default` | `.js` `.jsx` `.tsx` | Fallback для паралельних маршрутів |

## Вкладені маршрути

Папки визначають сегменти URL. Вкладення папок вкладає сегменти. Layouts на будь-якому рівні обгортають дочірні сегменти.

| Шлях | URL |
|------|-----|
| `app/layout.tsx` | — (кореневий layout) |
| `app/page.tsx` | `/` |
| `app/blog/page.tsx` | `/blog` |
| `app/blog/authors/page.tsx` | `/blog/authors` |

Маршрут стає публічним лише коли в папці є файл `page` або `route`.

## Динамічні маршрути

Параметризуйте сегменти за допомогою квадратних дужок:

| Шлях | URL-патерн |
|------|-----------|
| `app/blog/[slug]/page.tsx` | `/blog/my-first-post` |
| `app/shop/[...slug]/page.tsx` | `/shop/clothing`, `/shop/clothing/shirts` |
| `app/docs/[[...slug]]/page.tsx` | `/docs`, `/docs/layouts`, `/docs/api/router` |

- `[segment]` — один параметр
- `[...segment]` — catch-all (один або більше сегментів)
- `[[...segment]]` — опціональний catch-all (нуль або більше)

## Групи маршрутів та приватні папки

### Групи маршрутів `(group)`

Організовуйте код без зміни URL. Папки в дужках виключаються з URL:

| Шлях | URL |
|------|-----|
| `app/(marketing)/page.tsx` | `/` |
| `app/(shop)/cart/page.tsx` | `/cart` |

Корисно для:
- Організації маршрутів за секцією сайту, наміром або командою
- Створення різних layouts для різних груп маршрутів
- Створення кількох кореневих layouts

### Приватні папки `_folder`

Папки з префіксом `_` виключені з маршрутизації:

| Шлях | Маршрутизований? |
|------|-----------------|
| `app/blog/_components/Post.tsx` | Ні |
| `app/blog/_lib/data.ts` | Ні |

## Паралельні та перехоплені маршрути

| Патерн | Значення | Типовий випадок |
|--------|---------|----------------|
| `@folder` | Іменований слот | Сайдбар + основний контент |
| `(.)folder` | Перехоплення на тому ж рівні | Попередній перегляд у модальному вікні |
| `(..)folder` | Перехоплення батьківського | Оверлей дочірнього маршруту |
| `(...)folder` | Перехоплення від кореня | Показ довільного маршруту |

## Ієрархія компонентів

Компоненти в спеціальних файлах рендеряться у визначеному порядку:

> [!diagram] Як спеціальні файли вкладаються один в одного
> ```yaml
> layout: nest
> nodes:
>   - { id: layout, label: "layout.js", text: "спільний UI сегмента", tone: violet, icon: "si:SiReact" }
>   - { id: template, label: "template.js", text: "як layout, але новий при кожній навігації", parent: layout, tone: blue }
>   - { id: error, label: "error.js — React Error Boundary", text: "ловить помилки всередині", parent: template, tone: red }
>   - { id: loading, label: "loading.js — React Suspense Boundary", text: "скелетон, поки вантажиться", parent: error, tone: yellow }
>   - { id: notfound, label: "not-found.js", text: "UI для notFound()", parent: loading, tone: orange }
>   - { id: page, label: "page.js або вкладений layout.js", text: "вміст маршруту", parent: notfound, tone: green, icon: "px:file" }
> steps:
>   - { show: layout, note: "Зовнішній шар — layout.js: шапка, навігація, усе спільне для сегмента. Він зберігає стан між переходами." }
>   - { show: template, note: "Усередині — template.js. Те саме, що layout, але створюється заново при кожній навігації." }
>   - { show: error, note: "error.js загортає все, що глибше, у React Error Boundary: помилка в сторінці покаже error, а layout лишиться цілим." }
>   - { show: loading, note: "loading.js — це Suspense Boundary: поки сторінка чекає на дані, користувач бачить скелетон." }
>   - { show: [notfound, page], note: "Далі not-found.js і в самому центрі — page.js. У вкладеному маршруті тут опиниться layout дочірнього сегмента, і вся «матрьошка» повториться." }
> ```

У вкладених маршрутах компоненти сегмента вкладаються всередину компонентів батьківського сегмента.

## Колокація (Colocation)

Файли проєкту можна безпечно розміщувати поруч із файлами маршрутів у директорії `app`. Маршрут стає публічним лише при наявності `page.js` або `route.js`.

## Метадані файлів

### Іконки застосунку

| Файл | Розширення | Призначення |
|------|-----------|------------|
| `favicon` | `.ico` | Favicon |
| `icon` | `.ico` `.jpg` `.png` `.svg` | Іконка застосунку |
| `apple-icon` | `.jpg` `.png` | Іконка для Apple |

### Open Graph та Twitter

| Файл | Розширення |
|------|-----------|
| `opengraph-image` | `.jpg` `.jpeg` `.png` `.gif` |
| `twitter-image` | `.jpg` `.jpeg` `.png` `.gif` |

### SEO

| Файл | Розширення |
|------|-----------|
| `sitemap` | `.xml` або `.js` `.ts` |
| `robots` | `.txt` або `.js` `.ts` |

## Стратегії організації проєкту

### 1. Файли проєкту поза `app`

Весь код застосунку у спільних папках в корені проєкту, `app` тільки для маршрутизації:

> [!diagram] Стратегія 1: код поза app
> ```yaml
> layout: tree
> nodes:
>   - { id: proj, text: "project/", tone: gray, icon: "pi:PiFoldersFill" }
>   - { id: comp, text: "components/", note: "спільні компоненти", parent: proj, tone: blue, icon: "pi:PiFoldersFill" }
>   - { id: lib, text: "lib/", note: "утиліти, доступ до даних", parent: proj, tone: blue, icon: "pi:PiFoldersFill" }
>   - { id: app, text: "app/", note: "лише маршрутизація", parent: proj, tone: violet, icon: "si:SiNextdotjs" }
>   - { id: page, text: "page.tsx", note: "маршрут /", parent: app, tone: green, icon: "px:file" }
>   - { id: layout, text: "layout.tsx", note: "кореневий layout", parent: app, tone: green, icon: "px:file" }
> steps:
>   - { show: [proj, app, page, layout], note: "У app/ лежать тільки файли маршрутів: page.tsx відкриває маршрут /, layout.tsx його обгортає." }
>   - { show: [comp, lib], note: "Увесь інший код — components/ і lib/ — живе в корені проєкту, поза app/." }
>   - { focus: [app, comp, lib], note: "Так одразу видно межу: app/ відповідає за URL, а решта папок — за логіку й UI." }
> ```

### 2. Файли проєкту всередині `app`

Весь код у папках всередині `app`:

> [!diagram] Стратегія 2: усе всередині app
> ```yaml
> layout: tree
> nodes:
>   - { id: app, text: "app/", tone: violet, icon: "si:SiNextdotjs" }
>   - { id: comp, text: "components/", note: "немає page — не маршрут", parent: app, tone: blue, icon: "pi:PiFoldersFill" }
>   - { id: lib, text: "lib/", note: "немає page — не маршрут", parent: app, tone: blue, icon: "pi:PiFoldersFill" }
>   - { id: page, text: "page.tsx", note: "маршрут /", parent: app, tone: green, icon: "px:file" }
>   - { id: layout, text: "layout.tsx", note: "кореневий layout", parent: app, tone: green, icon: "px:file" }
> steps:
>   - { show: [app, page, layout], note: "Корінь app/ з page.tsx і layout.tsx — як завжди." }
>   - { show: [comp, lib], note: "components/ і lib/ лежать прямо в app/. Це безпечно: папка стає маршрутом лише тоді, коли в ній є page або route." }
>   - { focus: [comp, lib, page], note: "Службові папки тут сусідять із сегментами маршрутів. Щоб явно сховати папку від роутера, назви її з підкресленням: _components/." }
> ```

### 3. Розділення за фічами або маршрутами

Глобальний код в корені `app`, специфічний — у відповідних сегментах маршрутів:

> [!diagram] Стратегія 3: розділення за фічами
> ```yaml
> layout: tree
> nodes:
>   - { id: app, text: "app/", tone: violet, icon: "si:SiNextdotjs" }
>   - { id: comp, text: "components/", note: "спільні", parent: app, tone: blue, icon: "pi:PiFoldersFill" }
>   - { id: lib, text: "lib/", note: "спільні", parent: app, tone: blue, icon: "pi:PiFoldersFill" }
>   - { id: blog, text: "blog/", note: "сегмент /blog", parent: app, tone: violet, icon: "pi:PiFoldersFill" }
>   - { id: bcomp, text: "components/", note: "специфічні для блогу", parent: blog, tone: yellow, icon: "pi:PiFoldersFill" }
>   - { id: bpage, text: "page.tsx", note: "маршрут /blog", parent: blog, tone: green, icon: "px:file" }
> steps:
>   - { show: [app, comp, lib], note: "У корені app/ — те, що потрібно всім сторінкам: спільні components/ і lib/." }
>   - { show: [blog, bpage], note: "Фіча «блог» — окремий сегмент: blog/page.tsx відкриває маршрут /blog." }
>   - { show: bcomp, note: "Компоненти, потрібні лише блогу, лежать поруч із ним у blog/components/. Видалив фічу — видалив одну папку." }
> ```

### Папка `src`

Можна зберігати код застосунку (включаючи `app`) в опціональній папці `src`, відділяючи код від конфігураційних файлів.
