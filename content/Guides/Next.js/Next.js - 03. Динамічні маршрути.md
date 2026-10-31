---
title: Динамічні маршрути
id: nextjs-core-03
slug: 03-dynamic-routes
order: 3
level: junior
skill: routing
icon: px:link
tags: [nextjs, routing, dynamic-routes, params, searchParams, generateStaticParams]
prerequisites: ["[[Next.js Start - 08. Навігація]]", "[[Next.js - 01. App Router, сегменти і спеціальні файли]]"]
estimatedMinutes: 45
nextVersion: 16.3.8
---

# Динамічні маршрути

> [!success] 🎯 Після цього розділу ти зможеш
> - обрати між `[slug]`, `[...slug]` і `[[...slug]]` і передбачити, який файл обслужить адресу, коли підходять кілька;
> - прочитати й типізувати async `params` і `searchParams` (`PageProps<'/blog/[slug]'>`) і пояснити, чому це Promise;
> - написати `generateStaticParams` для одного й кількох вкладених сегментів, повернути лише підмножину шляхів;
> - пояснити, що змінюють Cache Components: «≥ 1 результат», заборона `dynamicParams`, `<Suspense>` навколо `params`;
> - прочитати таблицю маршрутів `next build` (`○`, `◐`, `●`, `ƒ`) і чесно віддати 404 для невідомого `slug`;
> - розібрати `searchParams` (рядок, масив, `undefined`) у типізований фільтр і читати URL на клієнті без помилок збірки.

## 🤔 Передбач

> [!quiz] Який файл обслужить кожну адресу?
> level: junior · type: output · id: nextjs-core-03-quiz-01
>
> У проєкті три сторінки:
>
> ```text
> app/blog/new/page.tsx
> app/blog/[slug]/page.tsx
> app/blog/[...rest]/page.tsx
> ```
>
> Користувач відкриває `/blog/new`, `/blog/hello` і `/blog/2026/10`. Хто їх обслужить?
>
> - [x] `new/page.tsx`, `[slug]/page.tsx`, `[...rest]/page.tsx`
> - [ ] `[slug]/page.tsx` для перших двох (`slug` = `new` і `hello`), `[...rest]/page.tsx` для третьої
> - [ ] `[...rest]/page.tsx` для всіх трьох: catch-all ловить будь-яку кількість сегментів
> - [ ] Жодну: `next build` зупиниться, бо `[slug]` і `[...rest]` на одному рівні конфліктують
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Статичний сегмент перемагає динамічний, а динамічний — catch-all. `[slug]` бере рівно один сегмент, тож `/blog/2026/10` дістається `[...rest]`. Сусідство `[slug]` і `[...rest]` дозволене: збірка падає, наприклад, для двох **різних імен** одного виду на одному рівні (`[slug]` і `[id]`).

## 🧒 Простими словами

Уяви сортувальний центр пошти. На деяких полицях підписано точну адресу: «вул. Хрещатик, 1» — це статичний сегмент. Є полиця «будь-який будинок на Хрещатику»: листоноша бере номер з конверта й записує його в бланк — це `[slug]`, а бланк — `params`. Є полиця «усе, що йде в район, хоч би яка довга адреса» — catch-all `[...slug]`: у бланк потрапляє весь хвіст адреси списком. І полиця «район, включно з листами на саме районне відділення» — optional catch-all `[[...slug]]`. Сортувальник завжди спершу шукає точну полицю, потім «будь-який будинок», і лише потім «увесь район». А `generateStaticParams` — це список адрес, для яких конверти підписали заздалегідь, ще до відкриття відділення.

## 🔬 Як це працює насправді

### 🧩 Три види динамічних сегментів

Папка з назвою в квадратних дужках — **динамічний сегмент** (dynamic segment): вона збігається з будь-яким значенням у цьому місці адреси, а значення приходить у сторінку як `params`. Ключ у `params` — назва папки без дужок. Базовий `[slug]` ти вже бачив у [[Next.js Start - 08. Навігація]]; тут — усі три види і що саме лежить у `params`.

| Папка | Збігається з | Не збігається з | `params` |
|---|---|---|---|
| `app/blog/[slug]` | `/blog/a` | `/blog`, `/blog/a/b` | `{ slug: 'a' }` |
| `app/docs/[...slug]` | `/docs/a`, `/docs/a/b/c` | `/docs` | `{ slug: ['a', 'b', 'c'] }` |
| `app/shop/[[...slug]]` | `/shop`, `/shop/a/b` | — | `{ slug: undefined }`, `{ slug: ['a', 'b'] }` |

**Catch-all** `[...slug]` (дослівно «лови все») забирає **один або більше** сегментів і завжди дає масив. **Optional catch-all** `[[...slug]]` — те саме, плюс адреса без жодного сегмента: для `/shop` ключ `slug` має значення `undefined`. Сегментів може бути кілька: `app/[category]/[item]` дасть `{ category, item }`.

```tsx
// app/docs/[...slug]/page.tsx
export function generateStaticParams() {
  return [{ slug: ['getting-started'] }, { slug: ['routing', 'dynamic'] }]
}

export default async function DocsPage({ params }: PageProps<'/docs/[...slug]'>) {
  const { slug } = await params // string[]
  return <h1>Документація: {slug.join(' / ')}</h1>
}
```

```tsx
// app/shop/[[...slug]]/page.tsx
export function generateStaticParams() {
  return [{ slug: [] }, { slug: ['shoes'] }, { slug: ['shoes', 'sneakers'] }]
}

export default async function ShopPage({ params }: PageProps<'/shop/[[...slug]]'>) {
  const { slug = [] } = await params // string[] | undefined
  return <h1>{slug.length === 0 ? 'Усі товари' : `Категорія: ${slug.join(' › ')}`}</h1>
}
```

`generateStaticParams` поки пропусти — до нього дійдемо. Зверни увагу лише на `{ slug: [] }`: так optional catch-all пререндерить саму `/shop`. Типова деструктуризація `slug = []` прибирає `undefined`, і далі код працює з масивом.

Коли що обирати:

- **`[slug]`** — одна сутність за ідентифікатором: стаття, товар, профіль, замовлення. Найчастіший випадок.
- **`[...slug]`** — ієрархія довільної глибини, де корінь не потрібен: документація (`/docs/routing/dynamic`), файловий браузер, сторінки з CMS, що мають вкладені шляхи.
- **`[[...slug]]`** — та сама ієрархія, але корінь — теж ця сторінка: каталог з необовʼязковими фільтрами в шляху (`/shop`, `/shop/shoes`, `/shop/shoes/sneakers`).

> [!note] Чому в прикладах дані в памʼяті
> Приклади курсу зібрані з `cacheComponents: true`. Справжній запит до БД у `getPost()` зупинив би `next build` з `Next.js encountered uncached or runtime data during prerendering`: такі дані кешують (`'use cache'`, тема курсу 15) або обгортають у `<Suspense>` (теми 11–12). Тут ми це опускаємо.

### 🥇 Хто виграє, коли підходять кілька маршрутів

Динамічні папки можуть стояти поруч зі статичними і одна з одною. Next.js порівнює маршрути **посегментно, зліва направо**, і на кожному рівні діє одне правило: **статичний сегмент > `[x]` > `[...x]` > `[[...x]]`**:

| Папки поруч | Адреса | Хто обслужить |
|---|---|---|
| `blog/new`, `blog/[slug]` | `/blog/new` | `blog/new` |
| `blog/new`, `blog/[slug]` | `/blog/news` | `blog/[slug]`, `slug = 'news'` |
| `files/[name]`, `files/[...path]` | `/files/x` | `files/[name]` |
| `files/[name]`, `files/[...path]` | `/files/x/y` | `files/[...path]`, `path = ['x', 'y']` |
| `[lang]/about`, `en/[page]` | `/en/about` | `en/[page]`, `page = 'about'` |

Останній рядок неочевидний: у `[lang]/about` статичний **останній** сегмент, але першим порівнюють **перший**, а там `en` (статичний) перемагає `[lang]`. Тому «найбільше статичних сегментів» — не правило; правило — «хто сильніший на першому рівні, де маршрути розходяться».

> [!diagram] Як Next.js обирає маршрут для /blog/new
> ```yaml
> layout: stack
> nodes:
>   - { id: url, label: "запит", text: "/blog/new", tone: gray, icon: "px:monitor" }
>   - { id: st, label: "1 · статичний", code: "app/blog/new/page.tsx", note: "точний збіг сегмента", tone: green, icon: "px:check" }
>   - { id: dyn, label: "2 · динамічний", code: "app/blog/[slug]/page.tsx", note: "рівно один сегмент", tone: blue }
>   - { id: all, label: "3 · catch-all", code: "app/blog/[...rest]/page.tsx", note: "один і більше сегментів", tone: violet }
>   - { id: opt, label: "4 · optional catch-all", code: "app/[[...path]]/page.tsx", note: "нуль і більше", tone: orange }
> steps:
>   - { focus: url, note: "Next.js ділить адресу на сегменти: blog, new. Перший сегмент blog — статичний у всіх кандидатів, тож порівнюємо другий." }
>   - { focus: st, note: "Є папка з точною назвою new — вона завжди сильніша за будь-який динамічний сегмент на цьому рівні." }
>   - { focus: dyn, note: "Для /blog/news точної папки немає, і виграє [slug] з params { slug: 'news' }." }
>   - { focus: all, note: "Для /blog/2026/10 [slug] не підходить (два сегменти), тож дістається [...rest] з rest = ['2026', '10']." }
>   - { focus: opt, note: "Optional catch-all — найслабший: його беруть, лише коли не підійшло нічого конкретнішого." }
> ```
> Пріоритет перевіряється на кожному рівні окремо, зліва направо.

Дві речі Next.js не дозволяє і зупиняє збірку:

```text
Error: Ambiguous app routes detected:
Ambiguous route pattern "/blog/[*]" matches multiple routes:
  - /blog/[id]
  - /blog/[slug]
```

Дві динамічні папки **одного виду** з різними іменами на одному рівні: Next.js не знає, як назвати ключ. Друга — `app/shop/page.tsx` поруч з `app/shop/[[...slug]]`: `You cannot define a route with the same specificity as an optional catch-all route ("/shop" and "/shop/[[...slug]]").` Optional catch-all уже обслуговує `/shop`, тож окрема сторінка там зайва: або прибери її, або заміни `[[...slug]]` на `[...slug]`.

> [!quiz] Перевір себе: хто обслужить /en/about?
> level: middle · type: output · id: nextjs-core-03-quiz-02
>
> ```text
> app/[lang]/about/page.tsx
> app/en/[page]/page.tsx
> ```
>
> - [x] `app/en/[page]/page.tsx` з `params = { page: 'about' }`
> - [ ] `app/[lang]/about/page.tsx` з `params = { lang: 'en' }` — у нього статичний останній сегмент
> - [ ] Перший у списку файлів, тобто `[lang]/about`
> - [ ] Збірка падає з `Ambiguous app routes detected`
>
> **Пояснення:** маршрути порівнюють посегментно зліва направо. На першому рівні `en` (статичний) сильніший за `[lang]`, і далі `[lang]/about` уже не розглядається. Порядок файлів ролі не грає, а `Ambiguous` буває лише для двох динамічних сегментів одного виду з різними іменами.

### ⏳ params — це Promise

Сторінка, layout, Route Handler і `generateMetadata` отримують `params` — **Promise** з об'єктом параметрів від кореня до цього сегмента. Layout бачить параметри до свого рівня, не нижче: `app/products/[category]/layout.tsx` знає `category`, але не `product`.

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPost, getPosts } from '@/lib/posts'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  )
}
```

**Навіщо Promise.** До Next.js 15 `params` був звичайним об'єктом, і рендер не міг початися, доки параметри не відомі. Promise дозволяє рендерити все, що від параметрів **не залежить** (layout, заголовок, скелет), ще до того, як вони відомі — під час `next build` або до приходу запиту, — і чекати `params` лише там, де вони справді потрібні. З Cache Components саме це робить можливим static shell для невідомих `slug` (нижче).

**Було → стало.** Next.js 15 зробив `params` і `searchParams` асинхронними, але тимчасово дозволяв синхронний доступ. **У 16 синхронного доступу немає**. TypeScript зупиняє `params.slug` помилкою, а якщо обійти типи, на 16.3.8 значення тихо буде `undefined` — сторінка зібралася з `id=undefined` без жодного попередження. Для міграції є codemod `next-async-request-api` (тема 48).

**Типізація.** `PageProps<'/blog/[slug]'>` і `LayoutProps<'/products/[category]'>` — глобальні типи-хелпери, імпортувати їх не треба. Next.js генерує їх у `.next/types/routes.d.ts` під час `next dev`, `next build` або `next typegen` з реальної структури `app/`:

```ts
// .next/types/routes.d.ts (фрагмент, згенеровано 16.3.8)
interface ParamMap {
  "/blog/[slug]": { "slug": string; }
  "/docs/[...slug]": { "slug": string[]; }
  "/shop/[[...slug]]": { "slug"?: string[]; }
  "/products/[category]/[product]": { "category": string; "product": string; }
}
```

Хелпер ловить одруківки: `PageProps<'/blog/[slg]'>` не пройде `tsc` (`Type '"/blog/[slg]"' does not satisfy the constraint 'AppRoutes'`). Для Route Handler є `RouteContext<'/api/posts/[id]'>`. Ручний тип `{ params: Promise<{ slug: string }> }` теж працює, але не перевіряє, що такий маршрут існує.

**Значення — це рядки з URL.** Тип `{ slug: string }` не означає «існуючий slug»: користувач може ввести в адресний рядок що завгодно. Документація радить перевіряти параметр і звужувати тип: якщо `locale` не з дозволеного списку — `notFound()`, і далі код працює з типом `Locale`. Те саме з числовими id: `Number(id)` від `'abc'` — `NaN`, тож перевір до запиту в БД.

**Client Component як сторінка** теж отримує `params`-Promise і розгортає його хуком `use(params)`. Але частіше клієнтському коду параметри потрібні глибоко в дереві — тоді є `useParams()` (розділ [[#🖱️ URL на клієнті: useParams, useSearchParams, usePathname]]).

**Значення не декодовані.** На 16.3.8 `params` приходять у тому вигляді, в якому вони стоять в URL: `/blog/привіт` дає `slug = '%D0%BF%D1%80%D0%B8%D0%B2%D1%96%D1%82'`, `/blog/hello%20world` — `'hello%20world'`. Так і в `next dev`, і в `next build`, і в `useParams()` на клієнті. Латинські slug цього не помічають, кириличні — ламаються тихо (деталі й виправлення — у [[#⚠️ Пастки]]).

> [!quiz] Перевір себе: чому стаття не знаходиться?
> level: middle · type: output · id: nextjs-core-03-quiz-03
>
> У БД є пост зі `slug: 'привіт'`, і `generateStaticParams` його повертає; `next build` показує `○ /blog/привіт`. Сторінка робить `const { slug } = await params`, потім `getPost(slug)` і `notFound()`, якщо поста немає. Що побачить користувач на `/blog/привіт`?
>
> - [ ] Статтю: сторінка пререндерена, таблиця маршрутів це підтверджує
> - [x] 404: `slug` прийшов як `'%D0%BF…'`, і `getPost` нічого не знайшов
> - [ ] Помилку збірки: не-ASCII значення в `generateStaticParams` заборонені
> - [ ] Статтю, але лише в `next dev`: у продакшні Next.js декодує `params`
>
> **Пояснення:** збірка проходить, бо `notFound()` — легальний результат пререндеру. Але `params` на 16.3.8 не декодовані ні в dev, ні в продакшні, тож пошук за сирим значенням промахується. Виправлення — `getPost(decodeURIComponent(slug))` або латинські slug.

> [!quiz] Перевір себе: заповни пропуски на сторінці статті
> level: junior · type: fill · bank: use, dynamicParams, id · id: nextjs-core-03-quiz-04
>
> ```tsx fill
> // app/blog/[slug]/page.tsx
> import { [[notFound]] } from 'next/navigation'
> import { getPost, getPosts } from '@/lib/posts'
>
> export async function [[generateStaticParams]]() {
>   const posts = await getPosts()
>   return posts.map((post) => ({ [[slug]]: post.slug }))
> }
>
> export default async function PostPage({ params }: [[PageProps]]<'/blog/[slug]'>) {
>   const { slug } = [[await]] params
>   const post = await getPost(slug)
>   if (!post) notFound()
>   return <h1>{post.title}</h1>
> }
> ```
>
> **Пояснення:** ключ в обʼєктах `generateStaticParams` — назва папки `[slug]`, а не поле з БД (`id`). У Server Component `params` розгортають через `await`; `use` — для Client Component. `dynamicParams` з Cache Components узагалі не можна (нижче), а `notFound()` імпортують з `next/navigation`.

### 🏗️ generateStaticParams: шляхи на етапі збірки

`generateStaticParams` — функція, яку експортують з `page`, `layout` або `route` динамічного сегмента. Вона повертає **масив об'єктів params**, і `next build` пререндерить сторінку для кожного з них. Для `[slug]` — `{ slug: string }[]`, для catch-all — `{ slug: string[] }[]`, для двох сегментів — `{ category: string, product: string }[]`. Під час `next dev` функція викликається при переході на маршрут, під час `next build` — до генерації сторінок. `fetch` усередині автоматично дедуплікується з тими самими запитами в layout і page.

Значення мають бути **рядками** (або масивами рядків для catch-all). Id з БД часто числа, а збірка на це не мовчить:

```text
Error: A required parameter (id) was not provided as a string received number in generateStaticParams for /sync/[id]
```

Тому — `posts.map((p) => ({ id: String(p.id) }))`.

**Підмножина.** Не обовʼязково пререндерити все: можна повернути 100 найпопулярніших товарів із мільйона. Решта адрес не стає 404 — Next.js відрендерить таку сторінку під час першого запиту й збереже результат: перший запит до `/products/phones/old-phone`, якої не було в списку, дає 200, а наступні приходять з `x-nextjs-cache: HIT`.

**Кілька вкладених сегментів.** Для `app/products/[category]/[product]` є два підходи.

*Знизу вгору*: сторінка `[product]` повертає обидва ключі одразу — `{ category, product }`. Просто, коли все є в одному запиті.

*Згори вниз*: layout `[category]` генерує категорії, а `generateStaticParams` сторінки викликається **окремо для кожної категорії** й отримує `params` батька — синхронний об'єкт, не Promise:

```tsx
// app/products/[category]/layout.tsx
import { Suspense } from 'react'
import { categories, getCategory } from '@/lib/catalog'

// згори вниз: спершу всі категорії
export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }))
}

export default function CategoryLayout({ children, params }: LayoutProps<'/products/[category]'>) {
  return (
    <section>
      <Suspense fallback={<h1>Категорія…</h1>}>
        <CategoryTitle params={params} />
      </Suspense>
      {children}
    </section>
  )
}

async function CategoryTitle({ params }: Pick<LayoutProps<'/products/[category]'>, 'params'>) {
  const { category } = await params
  const data = await getCategory(category)
  return <h1>{data?.name ?? 'Категорія'}</h1>
}
```

```tsx
// app/products/[category]/[product]/page.tsx
import { notFound } from 'next/navigation'
import { getPopularProducts, getProduct } from '@/lib/catalog'

// викликається для кожної категорії, яку повернув батьківський layout
export async function generateStaticParams({
  params,
}: {
  params: Awaited<LayoutProps<'/products/[category]'>['params']>
}) {
  const popular = await getPopularProducts(params.category) // лише підмножина
  return popular.map((p) => ({ product: p.slug }))
}

export default async function ProductPage({ params }: PageProps<'/products/[category]/[product]'>) {
  const { category, product } = await params
  const item = await getProduct(category, product)
  if (!item) notFound()
  return <h2>{item.name}</h2>
}
```

Layout не чекає `params` на верхньому рівні, а передає Promise у `CategoryTitle` всередині `<Suspense>`. Так документація радить робити в layouts: інакше layout не потрапить у static shell для категорій поза списком. Генерувати можна параметри сегментів **вище або на своєму рівні, але не нижче**: layout `[category]` не може згенерувати `product`.

> [!diagram] next build: вкладені generateStaticParams
> ```yaml
> layout: tree
> nodes:
>   - { id: lay, label: "layout [category]", code: "generateStaticParams()", note: "→ phones, laptops", tone: blue, icon: "px:file" }
>   - { id: ph, label: "page [product]", code: "generateStaticParams({ params: { category: 'phones' } })", parent: lay, tone: violet }
>   - { id: lp, label: "page [product]", code: "generateStaticParams({ params: { category: 'laptops' } })", parent: lay, tone: violet }
>   - { id: p1, label: "○ /products/phones/pixel-10", text: "пререндерено", parent: ph, tone: green, icon: "px:check" }
>   - { id: p2, label: "○ /products/laptops/air-15", text: "пререндерено", parent: lp, tone: green, icon: "px:check" }
>   - { id: sh, label: "◐ /products/phones/[product]", text: "shell для інших товарів", note: "old-phone — під час запиту", parent: ph, tone: yellow }
> steps:
>   - { show: lay, note: "next build спершу викликає generateStaticParams батьківського layout: дві категорії." }
>   - { show: [ph, lp], note: "Для кожної категорії окремо викликається generateStaticParams сторінки. params батька — звичайний обʼєкт, без await." }
>   - { show: [p1, p2], note: "Кожна пара category + product — окрема пререндерена сторінка. Дані в памʼяті, тож це повністю статичний ○." }
>   - { show: sh, note: "Для phones Next.js також збирає shell під невідомий product. Товар поза списком рендериться при першому запиті й зберігається." }
> ```
> Дочірня функція виконується стільки разів, скільки результатів повернув батько.

> [!quiz] Перевір себе: склади, що відбувається з товарами від збірки до запиту
> level: middle · type: order · id: nextjs-core-03-quiz-05
>
> ```order
> next build викликає generateStaticParams layout [category]
> Для кожної категорії викликається generateStaticParams сторінки [product] з params батька
> Next.js пререндерить сторінку для кожної пари category + product
> Таблиця маршрутів показує ○ /products/phones/pixel-10
> Перший запит до /products/phones/old-phone рендериться на сервері й зберігається
> Наступні запити до /products/phones/old-phone отримують збережений результат
> Запит до /products/phones/old-phone повертає 404, бо товару не було в generateStaticParams ✗
> ```
>
> **Пояснення:** спершу батько, потім дитина для кожного його результату, потім пререндер. Адреса поза списком не стає 404: за замовчуванням Next.js рендерить її при першому запиті й кладе в кеш. 404 буде лише тоді, коли сторінка сама викличе `notFound()`, бо товару немає в БД.

### 🧱 З Cache Components: що змінилось

Курс збирає приклади з `cacheComponents: true` (рекомендовано для нових проєктів Next.js 16). Тоді Next.js пререндерить кожен маршрут якомога повніше і **на етапі збірки перевіряє**, що runtime data (`params`, `searchParams`, `cookies()`, `headers()`) і некешовані дані читаються лише всередині `<Suspense>`. Для динамічних маршрутів звідси три правила.

**1. Без `generateStaticParams` `params` — runtime data.** Значення невідомі на етапі збірки, тож `await params` поза `<Suspense>` зупиняє збірку:

```tsx
// app/users/[id]/page.tsx — ❌ без generateStaticParams і без Suspense
export default async function UserPage({ params }: PageProps<'/users/[id]'>) {
  const { id } = await params
  return <h1>Користувач {id}</h1>
}
```

```text
Error: Route "/users/[id]": Next.js encountered uncached or runtime data during prerendering.

`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>`
prevents the route from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route
```

Виправлення `[stream]`: сторінка лишається синхронною, а `await params` переїжджає в дочірній компонент усередині `<Suspense>`. Next.js пререндерить заголовок і fallback як static shell, а решту дорендерить під час запиту:

```tsx
// app/users/[id]/page.tsx — без generateStaticParams: params відомі лише під час запиту
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getUser } from '@/lib/users'

export default function UserPage({ params }: PageProps<'/users/[id]'>) {
  return (
    <main>
      <h1>Профіль</h1>
      <Suspense fallback={<p>Завантаження…</p>}>
        <UserCard params={params} />
      </Suspense>
    </main>
  )
}

async function UserCard({ params }: Pick<PageProps<'/users/[id]'>, 'params'>) {
  const { id } = await params // await — усередині Suspense
  const user = await getUser(id)
  if (!user) notFound()
  return <p>Імʼя: {user.name}</p>
}
```

Можна й простіше — `loading.tsx` поруч зі сторінкою: це `<Suspense>` навколо всього сегмента, і `await params` у сторінці стає легальним. Варіант `[block]` (`instant = false`) дозволяє блокуючий рендер — він для тих, хто свідомо відмовляється від shell (тема 12).

**2. `generateStaticParams` має повернути хоча б один результат.** З `generateStaticParams` збірка знає приклади параметрів, рендерить маршрут з ними й так перевіряє, що runtime data читаються правильно. Порожній масив цю перевірку вимикає, тому це помилка:

```text
Error: When using Cache Components, all `generateStaticParams` functions must return at least one result.
This is to ensure that we can perform build-time validation that there is no other dynamic accesses that would
cause a runtime error.
```

Правило діє **для кожного виклику**, а не для суми: на 16.3.8 збірка впала, коли дочірній `generateStaticParams` повернув товари для `phones`, але `[]` для `laptops`, хоча загалом шлях був. Без Cache Components `return []` означав «нічого не пререндерювати, усе на першому запиті» — у старих туторіалах це поширений прийом. Якщо реальних значень на етапі збірки немає, документація пропонує плейсхолдер `[{ slug: '__placeholder__' }]` + `notFound()` для нього, але чесно попереджає: перевірка тоді майже нічого не перевіряє. Краще — шлях без `generateStaticParams` і `<Suspense>` навколо `params`.

**3. `dynamicParams` недоступний.** Без Cache Components `export const dynamicParams = false` віддавав 404 для всього, чого немає в `generateStaticParams`. Тепер:

```text
Error: Route segment config "dynamicParams" is not compatible with `nextConfig.cacheComponents`. Please remove it.
```

Замінник — перевірка в самій сторінці: знайшли запис — рендеримо, ні — `notFound()`. Це й надійніше: список шляхів з моменту збірки застаріває, а БД — ні.

> [!quiz] Перевір себе: як віддати 404 для slug поза списком?
> level: junior · id: nextjs-core-03-quiz-06
>
> Проєкт з `cacheComponents: true`. Статті з `generateStaticParams` мають відкриватися, а для будь-якого іншого `slug` має бути сторінка 404. Що зробити?
>
> - [ ] `export const dynamicParams = false` у `app/blog/[slug]/page.tsx`
> - [ ] Повернути з `generateStaticParams` порожній масив, щоб нічого зайвого не пререндерилось
> - [x] Після `await params` шукати статтю й викликати `notFound()`, якщо її немає
> - [ ] Обгорнути сторінку в `<Suspense>`: невідомий `slug` покаже fallback замість сторінки
>
> **Пояснення:** `dynamicParams` і порожній `generateStaticParams` з Cache Components — помилки збірки. `<Suspense>` керує очікуванням, а не існуванням: fallback зміниться на вміст. Перевірка в сторінці працює і для статей, доданих після збірки.

> [!diagram] Відомий і невідомий параметр з Cache Components
> ```yaml
> layout: compare
> columns: { known: "slug зі списку generateStaticParams", unknown: "slug поза списком або без generateStaticParams" }
> nodes:
>   - { id: k1, col: known, label: "next build", text: "рендер з реальним slug", note: "HTML готовий до запиту", tone: blue, icon: "px:file" }
>   - { id: k2, col: known, label: "запит", text: "віддати готову сторінку", note: "○ у таблиці маршрутів", tone: green, icon: "px:check" }
>   - { id: u1, col: unknown, label: "next build", text: "static shell", note: "усе поза Suspense і fallback", tone: yellow, icon: "px:hourglass" }
>   - { id: u2, col: unknown, label: "запит", text: "shell одразу + дорендер з params", note: "◐ у таблиці маршрутів", tone: orange, icon: "px:bolt" }
> steps:
>   - { show: [k1, u1], note: "На етапі збірки ліворуч slug відомий, і сторінку рендерять повністю. Праворуч slug невідомий: рендерять лише те, що від нього не залежить." }
>   - { show: [k2, u2], note: "Під час запиту ліворуч є готовий HTML. Праворуч користувач одразу бачить shell, а частина всередині Suspense дорендерюється з params." }
> ```
> Тому `await params` і мусить бути в `<Suspense>`: межа показує, де закінчується shell.

### 📋 Таблиця маршрутів після next build

Після збірки Next.js друкує таблицю маршрутів. Ось вона для прикладів цієї теми (16.3.8, `cacheComponents: true`, дані в памʼяті; скорочено — без `/_not-found` і `/docs`):

```text
Route (app)
┌ ○ /
├   /blog/[slug]
│ ├ ◐ /blog/[slug]
│ ├ ○ /blog/hello-next
│ └ ○ /blog/dynamic-routes
├ ◐ /catalog
├   /products/[category]/[product]
│ ├ ◐ /products/[category]/[product]
│ ├ ◐ /products/phones/[product]
│ ├ ○ /products/phones/pixel-10
│ └ ◐ [+2 more paths]
├   /shop/[[...slug]]
│ ├ ◐ /shop/[[...slug]]
│ ├ ○ /shop
│ ├ ○ /shop/shoes
│ └ ○ /shop/shoes/sneakers
└   /users/[id]
  └ ◐ /users/[id]

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

| Символ | Назва | Що означає |
|---|---|---|
| `○` | Static | повністю пререндерено під час збірки |
| `◐` | Partial Prerender | static shell готовий, решта стрімиться під час запиту |
| `●` | SSG | пререндерено з `generateStaticParams` — лише **без** Cache Components |
| `ƒ` | Dynamic | рендер на кожен запит; з Cache Components — лише там, де нічого пререндерити (наприклад, Route Handler, що читає `request`) |

Як читати: рядки під маршрутом — конкретні шляхи з `generateStaticParams` (`○`, бо дані в памʼяті). Рядок з самим шаблоном (`◐ /blog/[slug]`) — shell для значень поза списком. `◐ /products/phones/[product]` — shell для «відома категорія, невідомий товар». `/users/[id]` без `generateStaticParams` має лише shell. А `/catalog` — `◐`, бо читає `searchParams`.

Документація уточнює: зі справжніми некешованими запитами до БД рядки з параметрами теж будуть `◐` — параметри відомі, а дані ні. Ту саму збірку з `cacheComponents: false` Next.js 16.3.8 показує по-старому: `● /blog/hello-next` (SSG), `ƒ /users/[id]` (Dynamic). Детально про static і dynamic — тема 10.

> [!quiz] Що покаже таблиця маршрутів?
> level: middle · type: output · id: nextjs-core-03-quiz-07
>
> `cacheComponents: true`. Сторінка `app/users/[id]/page.tsx` без `generateStaticParams` читає `params` у дочірньому компоненті всередині `<Suspense>`. Що буде в таблиці маршрутів для неї?
>
> - [x] `◐ /users/[id]` — лише shell, конкретних шляхів немає
> - [ ] `ƒ /users/[id]` — без `generateStaticParams` сторінка динамічна
> - [ ] `○ /users/[id]` — `params` у `<Suspense>`, тож сторінка статична
> - [ ] `● /users/[id]` — SSG з порожнім списком параметрів
>
> **Пояснення:** з Cache Components маршрут з чим-небудь для пререндеру стає `◐`: заголовок і fallback — у shell, решта стрімиться під час запиту. `ƒ` і `●` так виглядала б та сама сторінка без Cache Components. `○` неможливий: значення `id` невідоме до запиту.

### 🚫 notFound() для невідомого slug

`notFound()` з `next/navigation` кидає спеціальний виняток: Next.js зупиняє рендер сегмента й показує найближчий `not-found.tsx` (або стандартну 404). TypeScript знає, що після `notFound()` код не виконується, тож після `if (!post) notFound()` змінна `post` уже не `null`.

Але є нюанс зі **статус-кодом**, який легко пропустити. Заголовки відповіді йдуть першими. Якщо до виклику `notFound()` Next.js уже почав стрімити shell, статус 200 уже відправлено, і змінити його неможливо:

| Сторінка | Де `notFound()` | Адреса | Статус |
|---|---|---|---|
| `blog/[slug]` з `generateStaticParams`, `await params` у тілі сторінки | поза `<Suspense>` | `/blog/nope` | **404** |
| `products/[category]/[product]`, те саме | поза `<Suspense>` | `/products/phones/nope` | **404** |
| `users/[id]` без `generateStaticParams` | у `UserCard` усередині `<Suspense>` | `/users/999` | **200** + `noindex` |

Друге — так званий **soft 404**: користувач бачить сторінку «не знайдено», а пошуковик і моніторинг — 200. Next.js додає `<meta name="robots" content="noindex">`, тож у пошук сторінка не потрапить, але аналітика, яка рахує 404 за статусом, її не побачить. Документація прямо каже: якщо потрібен справжній 404, перевір існування ресурсу **до** початку стріму. Є два способи. Перший — викликати `notFound()` поза `<Suspense>`, як у `blog/[slug]` з `generateStaticParams` вище: сервер дочекається перевірки й поверне 404, але для невідомих параметрів не буде миттєвого shell. Другий — перевірити в `proxy` (тема 06), ще до рендеру; для маршруту без `generateStaticParams` з Cache Components це єдиний варіант, бо `await params` поза `<Suspense>` там — помилка збірки. Для більшості сайтів soft 404 з `noindex` — прийнятний компроміс; для API і SEO-критичних каталогів — ні.

> [!quiz] Який статус поверне сервер?
> level: middle · type: output · id: nextjs-core-03-quiz-08
>
> `next build && next start`, `cacheComponents: true`. Сторінка `app/users/[id]/page.tsx` рендерить `<h1>` і `<Suspense>`, а всередині `UserCard` робить `await params`, шукає користувача й викликає `notFound()`, якщо його немає. Що поверне `curl -I /users/999`?
>
> - [ ] 404 — `notFound()` завжди дає 404
> - [x] 200, а в HTML `<meta name="robots" content="noindex">` і сторінка «не знайдено»
> - [ ] 500 — `notFound()` усередині `<Suspense>` ламає стрім
> - [ ] 307 — Next.js перенаправляє на `/404`
>
> **Пояснення:** shell (`<h1>` і fallback) пішов раніше, ніж `UserCard` викликав `notFound()`, а разом з ним — статус 200. Next.js показує UI «не знайдено» в потоці й додає `noindex`. Для справжнього 404 перевірку треба зробити до стріму: поза `<Suspense>` (як у `blog/[slug]` з `generateStaticParams`) або в `proxy`.

### 🔎 searchParams: рядок запиту

Рядок запиту (query string, `?page=2&sort=price`) сторінка отримує як `searchParams` — теж **Promise**, і **лише в `page`**: layout його не отримує, бо layout не перерендерюється при зміні запиту. Під капотом це звичайний об'єкт, не `URLSearchParams`, з типом `{ [key: string]: string | string[] | undefined }`. Для `?tag=a&tag=b&page=2&q=квіти+і&empty=` сторінка отримає:

```text
{ tag: ['a', 'b'], page: '2', q: 'квіти і', empty: '' }
```

Повторений ключ стає масивом, відсутній — `undefined`, порожній — `''`, а значення вже декодовані (на відміну від `params`, про це в пастках). Типу на кшталт `{ page: number }` тут не буває: усе, що прийшло, — рядки, і будь-хто може надіслати `?page=-5&page=abc`. Тому сирі `searchParams` ніколи не йдуть одразу в запит до БД — спершу їх розбирають в типізований фільтр з типовими значеннями й білим списком:

```ts
// lib/search-params.ts — сирі searchParams → типізований фільтр
type Raw = { [key: string]: string | string[] | undefined }

const SORTS = ['new', 'price-asc', 'price-desc'] as const
export type Sort = (typeof SORTS)[number]

// ?page=2&page=3 → беремо перше значення
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export function parseCatalogParams(raw: Raw) {
  const page = Number.parseInt(first(raw.page) ?? '', 10)
  const sort = first(raw.sort)
  const tags = raw.tag === undefined ? [] : ([] as string[]).concat(raw.tag)
  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    sort: SORTS.includes(sort as Sort) ? (sort as Sort) : 'new',
    tags,
  }
}
```

```tsx
// app/catalog/page.tsx
import { Suspense } from 'react'
import { parseCatalogParams } from '@/lib/search-params'
import { SortSelect } from './sort-select'

export default function CatalogPage({ searchParams }: PageProps<'/catalog'>) {
  return (
    <main>
      <h1>Каталог</h1>
      <Suspense fallback={<p>Завантаження фільтрів…</p>}>
        <SortSelect />
      </Suspense>
      <Suspense fallback={<p>Завантаження товарів…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function Results({ searchParams }: Pick<PageProps<'/catalog'>, 'searchParams'>) {
  const { page, sort, tags } = parseCatalogParams(await searchParams)
  return (
    <p>
      Сторінка {page}, сортування {sort}, теги: {tags.join(', ') || 'усі'}
    </p>
  )
}
```

`searchParams` — Request-time API: значення відомі лише під час запиту, тож **читання робить цю частину сторінки динамічною**. З Cache Components `await searchParams` поза `<Suspense>` дає ту саму помилку `encountered uncached or runtime data during prerendering`, що й `params`. Тому читай їх якомога глибше: заголовок і фільтри потрапляють у static shell (`◐ /catalog`), а результати стрімляться. Як саме це впливає на рендер і кеш — тема 10.

Ще одна причина парсити централізовано: **канонічні URL**. `?page=1`, `?page=01` і відсутній `page` — та сама сторінка. Якщо посилання будуються з розібраного фільтра, а не з сирого рядка, кеш CDN, аналітика й пошуковики бачать одну адресу замість трьох.

> [!quiz] Перевір себе: що прийде в searchParams?
> level: junior · type: output · id: nextjs-core-03-quiz-09
>
> Користувач відкриває `/catalog?tag=sale&tag=new&page=`. Що поверне `await searchParams` у `app/catalog/page.tsx`?
>
> - [x] `{ tag: ['sale', 'new'], page: '' }`
> - [ ] `{ tag: 'new', page: undefined }` — останнє значення перемагає, порожнє відкидається
> - [ ] `{ tag: 'sale', page: '' }` — як `URLSearchParams.get`, лише перше значення
> - [ ] Обʼєкт `URLSearchParams`, з якого треба читати через `getAll('tag')`
>
> **Пояснення:** `searchParams` — простий обʼєкт: повторений ключ стає масивом, порожнє значення — порожнім рядком, а відсутнього ключа немає взагалі (`undefined`). «Перше значення» — це поведінка `get()` у `useSearchParams` на клієнті, а не пропа сторінки.

### 🖱️ URL на клієнті: useParams, useSearchParams, usePathname

Client Components не отримують `params` і `searchParams` пропсами (якщо це не сама сторінка). Для них є хуки з `next/navigation`:

- **`useParams()`** — об'єкт параметрів поточного маршруту, як у таблиці вище; `{}` для статичного маршруту.
- **`useSearchParams()`** — **read-only** `URLSearchParams`: `get('sort')` (перше значення або `null`), `getAll('tag')`, `has()`. Змінювати URL — через `router.push`/`replace` або `<Link>`.
- **`usePathname()`** — шлях без рядка запиту (`/catalog`). Знайомий з [[Next.js Start - 08. Навігація]] за активним пунктом меню.

```tsx
// app/catalog/sort-select.tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function SortSelect() {
  const searchParams = useSearchParams() // ReadonlyURLSearchParams
  const pathname = usePathname()
  const router = useRouter()

  function onChange(sort: string) {
    const next = new URLSearchParams(searchParams) // копія: оригінал лише для читання
    next.set('sort', sort)
    next.delete('page') // нове сортування — з першої сторінки
    router.replace(`${pathname}?${next}`)
  }

  return (
    <select value={searchParams.get('sort') ?? 'new'} onChange={(e) => onChange(e.target.value)}>
      <option value="new">Новинки</option>
      <option value="price-asc">Дешевші</option>
      <option value="price-desc">Дорожчі</option>
    </select>
  )
}
```

З `/catalog?page=3&tag=a` вибір «Дорожчі» дає `/catalog?tag=a&sort=price-desc`, і серверний `Results` перерендерюється з новими `searchParams` — сторінка 1. `replace` замість `push` не засмічує історію: кнопка «Назад» не проходитиме кожну зміну сортування.

**З Cache Components ці хуки — теж URL data**, і правило те саме, що для `params`: якщо значення невідоме на етапі збірки, компонент мусить бути всередині `<Suspense>`, інакше збірка падає:

```text
Error: Route "/users/[id]": Next.js encountered URL data `useParams()` in a Client Component outside of `<Suspense>`.
This blocks prerendering because the value is only available at runtime.
```

| Хук | Без `<Suspense>` збірка проходить, якщо… |
|---|---|
| `useParams()`, `usePathname()` | маршрут статичний або всі параметри є в `generateStaticParams` |
| `useSearchParams()` | ніколи на пререндереній сторінці: рядок запиту невідомий на етапі збірки |

Найпідступніший випадок — меню з `usePathname()` у **root layout**. Сам layout статичний, але він обгортає всі сторінки. Варто додати перший маршрут без `generateStaticParams` (`/users/[id]`) — і збірка падає з `encountered URL data usePathname() in a Client Component outside of <Suspense>`, вказуючи на файл меню, якого ти щойно не чіпав. Виправлення — `<Suspense>` навколо меню з fallback такого ж розміру:

```tsx
// app/layout.tsx
import { Suspense } from 'react'
import { Nav } from './nav'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <Suspense fallback={<nav aria-busy="true" />}>
          <Nav />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
```

На статичних маршрутах (`/`, `/blog/hello-next`) шлях відомий під час збірки, і меню все одно потрапляє в HTML повністю; на `/users/[id]` у shell іде fallback, а меню дорендерюється з реальним шляхом. У `next dev` маршрути рендеряться на запит, тож усе «працює» і без `<Suspense>` — помилку побачиш лише на `next build`.

> [!quiz] Перевір себе: де потрібен Suspense?
> level: middle · type: multi · id: nextjs-core-03-quiz-10
>
> `cacheComponents: true`. Які компоненти зупинять `next build`, якщо їх **не** обгорнути в `<Suspense>`?
>
> - [x] Client Component з `useSearchParams()` на статичній сторінці `/catalog`
> - [x] Меню з `usePathname()` у root layout, коли в застосунку є `app/users/[id]` без `generateStaticParams`
> - [ ] Client Component з `useParams()` у `app/blog/[slug]`, де всі `slug` повертає `generateStaticParams`
> - [x] Server Component, що робить `await params` в `app/users/[id]` без `generateStaticParams`
> - [ ] Меню з `usePathname()` у root layout застосунку, де всі маршрути статичні
>
> **Пояснення:** збірка падає, коли значення невідоме під час пререндеру: рядок запиту невідомий завжди, а шлях і `params` — лише для маршрутів без `generateStaticParams`. Для статичних маршрутів і шляхів зі списку хуки відпрацьовують під час збірки.

### 🏭 Як це роблять у продакшні

- **Один парсер на сторінку з фільтрами.** `searchParams` розбирають однією функцією (вручну або схемою на кшталт Zod) з типовими значеннями й білим списком; той самий модуль будує посилання. У продакшні часто беруть бібліотеку `nuqs` — типізований стан у рядку запиту для сервера й клієнта.
- **Перевірка параметрів біля даних.** `slug` і `id` перевіряють і нормалізують (`decodeURIComponent`, нижній регістр, формат id) до запиту в БД; невідоме — `notFound()`, а не порожній шаблон з `undefined`.
- **`generateStaticParams` — для гарячого, не для всього.** Пререндерять топ-N товарів чи свіжі статті, решту віддають на перший запит. Повний каталог на мільйон сторінок перетворює `next build` на годину.
- **Shell без параметрів.** У layouts `params` передають Promise-ом у дочірні компоненти під `<Suspense>`, а не чекають на верхньому рівні: так навігація на новий `slug` показує каркас миттєво (теми 04 і 12).
- **Справжній 404 там, де він важливий.** SEO-критичні каталоги й API перевіряють існування ресурсу до стріму — у `proxy` або сторінкою без `<Suspense>` над `notFound()`; решта задовольняється soft 404 з `noindex`.
- **Root params для мови.** Сегмент над root layout (`app/[lang]/layout.tsx`) — root parameter: з 16.3 його читають з будь-якого Server Component через `next/root-params`, без prop drilling (тема 34).

## ⚠️ Пастки

> [!pitfall] Кирилиця в slug: params не декодовані
> На 16.3.8 і в `next dev`, і в `next build` `params` приходять **percent-encoded** — так, як вони в URL. `generateStaticParams` повертає `'привіт'`, сторінка збирається (`○ /blog/привіт`), а для `/blog/привіт` отримує `slug = '%D0%BF%D1%80…'`, пошук не знаходить пост, і сервер віддає 404. `useParams()` на клієнті так само. `searchParams` при цьому вже декодовані.
>
> ```tsx
> const { slug } = await params
> const post = await getPost(slug) // ❌ шукає '%D0%BF%D1%80%D0%B8%D0%B2%D1%96%D1%82'
> const post = await getPost(decodeURIComponent(slug)) // ✅ 'привіт'
> ```

> [!warning] Документація не описує кодування params
> [Dynamic Route Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) показує `params` лише для латиниці й нічого не каже про кодування. На Next.js 16.3.8 значення з не-ASCII символами, пробілами (`hello%20world`) чи `%2F` приходять у `params` без декодування. Найпростіше — латинські slug (`03-dynamic-routes`), як у цьому курсі.

> [!pitfall] return [] у generateStaticParams зі старого туторіалу
> Без Cache Components це означало «усе на першому запиті». З `cacheComponents: true` — помилка збірки, і це правило діє **для кожного виклику**: дочірній `generateStaticParams`, що повернув `[]` для однієї категорії, зупиняє збірку, навіть коли інші категорії мають товари.
>
> ```tsx
> export function generateStaticParams() {
>   return [] // ❌ must return at least one result
> }
> // ✅ прибери generateStaticParams і обгорни await params у <Suspense>
> ```

> [!pitfall] dynamicParams = false для 404
> Звичний спосіб «лише шляхи зі списку» несумісний з Cache Components: `Route segment config "dynamicParams" is not compatible`. Перевіряй існування в сторінці.
>
> ```tsx
> export const dynamicParams = false // ❌ помилка збірки
> if (!post) notFound() // ✅ після пошуку в БД
> ```

> [!pitfall] Числа в generateStaticParams
> Id з БД — число, а params — завжди рядки: `A required parameter (id) was not provided as a string received number`.
>
> ```tsx
> return products.map((p) => ({ id: p.id })) // ❌ number
> return products.map((p) => ({ id: String(p.id) })) // ✅
> ```

> [!pitfall] Меню з usePathname ламає збірку після нового маршруту
> Меню в root layout роками працює, поки хтось не додасть `app/users/[id]` без `generateStaticParams`. Збірка падає з посиланням на `nav.tsx`, хоча зламав її новий маршрут. Обгорни меню в `<Suspense>` одразу.
>
> ```tsx
> <Suspense fallback={<nav aria-busy="true" />}>
>   <Nav />
> </Suspense>
> ```

> [!pitfall] notFound() усередині Suspense — не 404
> Після початку стріму статус 200 уже відправлено. Сторінка показує «не знайдено» з `noindex`, але моніторинг 404 і клієнти API бачать 200.
>
> ```tsx
> <Suspense fallback={<p>…</p>}>
>   <UserCard params={params} /> {/* notFound() тут → 200 */}
> </Suspense>
> ```

> [!pitfall] params.slug без await
> TypeScript не пропустить, але `as any` або JS-файл пропустять, і на 16.3.8 значення буде тихо `undefined`: сторінка збирається з `id=undefined`.
>
> ```tsx
> const slug = (params as any).slug // ❌ undefined
> const { slug } = await params // ✅
> ```

## 🎤 На співбесіді

> [!interview] Чим відрізняються динамічний сегмент, catch-all і optional catch-all і як Next.js обирає маршрут, коли підходять кілька?
> level: junior · frequency: дуже часто · id: nextjs-core-03-int-01
>
> ---
>
> `[slug]` — рівно один сегмент, `params.slug` — рядок. `[...slug]` — один і більше, масив; `/docs` без хвоста не підходить. `[[...slug]]` — нуль і більше: `/shop` теж підходить, і `slug` тоді `undefined`. Маршрути порівнюють посегментно зліва направо, на кожному рівні статичний сегмент сильніший за `[x]`, той — за `[...x]`, той — за `[[...x]]`. Тому `/blog/new` обслуговує `blog/new`, а `/en/about` — `en/[page]`, а не `[lang]/about`. Дві динамічні папки одного виду з різними іменами на одному рівні — помилка збірки `Ambiguous app routes`.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🥇 Хто виграє, коли підходять кілька маршрутів|Розділ: пріоритет маршрутів]] · [Next.js: Dynamic Route Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

> [!interview] Чому params і searchParams у Next.js 16 — Promise? Що це дає?
> level: middle · frequency: дуже часто · id: nextjs-core-03-int-02
>
> ---
>
> Щоб рендер не чекав на значення, які стануть відомі лише під час запиту. Усе, що від параметрів не залежить, Next.js може пререндерити заздалегідь (static shell), а `await params` робиться глибше, всередині `<Suspense>`, — там, де значення справді потрібне. У 15 це було з тимчасовою синхронною сумісністю, у 16 — лише async; для міграції є codemod `next-async-request-api` і типи `PageProps`/`LayoutProps` з `next typegen`. З Cache Components правило жорстке: без `generateStaticParams` `await params` поза `<Suspense>` — помилка збірки.
>
> 📚 [[Next.js - 03. Динамічні маршрути#⏳ params — це Promise|Розділ: params — Promise]] · [Next.js: Upgrading to 16 — Async Request APIs](https://nextjs.org/docs/app/guides/upgrading/version-16#async-request-apis-breaking-change)

> [!interview] Каталог на 2 млн товарів. Як налаштуєш generateStaticParams і що буде з товарами поза списком?
> level: middle · frequency: часто · id: nextjs-core-03-int-03
>
> ---
>
> Пререндерю лише гаряче: топ-N за продажами або категорії + популярні товари через вкладені `generateStaticParams` (layout `[category]` → сторінка `[product]` з `params` батька). Решта не 404: перший запит рендерить сторінку й зберігає результат, наступні беруть її з кешу. З Cache Components кожен виклик має повернути ≥ 1 результат, `dynamicParams` недоступний, тож неіснуючі товари відсікаю `notFound()` після пошуку в БД. Layout не чекає `params` на верхньому рівні, щоб shell для невідомих товарів був повним. Значення — лише рядки (`String(id)`).
>
> 📚 [[Next.js - 03. Динамічні маршрути#🏗️ generateStaticParams: шляхи на етапі збірки|Розділ: generateStaticParams]] · [Next.js: ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components)

> [!interview] Сторінка викликає notFound() для неіснуючого користувача, але моніторинг показує 200. Чому і що робити?
> level: senior · frequency: іноді · id: nextjs-core-03-int-04
>
> ---
>
> `notFound()` виконався всередині `<Suspense>`, коли shell з заголовками і статусом 200 уже пішов клієнту. Змінити статус після початку стріму неможливо, тому Next.js показує UI «не знайдено» в потоці й додає `noindex` — це soft 404. Якщо справжній 404 важливий (API, SEO, аналітика), існування ресурсу перевіряють до стріму: у сторінці поза `<Suspense>` (тоді немає shell для невідомих параметрів) або в `proxy`. Інакше — свідомо прийняти soft 404 і рахувати 404 за подією, а не за статусом.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🚫 notFound() для невідомого slug|Розділ: notFound і статус]] · [Next.js: loading.js — Status Codes](https://nextjs.org/docs/app/api-reference/file-conventions/loading#status-codes)

> [!interview] Як зробиш фільтри й пагінацію в URL, щоб це працювало із сервером, клієнтом і кешем?
> level: middle · frequency: часто · id: nextjs-core-03-int-05
>
> ---
>
> Стан фільтрів — у рядку запиту: посилання можна скопіювати, «Назад» працює. Сторінка читає `searchParams` (Promise, лише в `page`) глибоко, у компоненті під `<Suspense>`, щоб заголовок і фільтри лишились у shell. Сирі значення (`string | string[] | undefined`) розбирає одна функція з типовими значеннями й білим списком, і вона ж будує канонічні посилання. На клієнті — `useSearchParams` (read-only, теж під `<Suspense>`) і `router.replace` з копією `URLSearchParams`; при зміні фільтра скидаю `page`.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🔎 searchParams: рядок запиту|Розділ: searchParams]] · [Next.js: useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)

## 🔗 Звʼязки

- [[Next.js Start - 08. Навігація]] — перший `[slug]`, `Link`, `usePathname` для активного меню.
- [[Next.js - 01. App Router, сегменти і спеціальні файли]] — папки як сегменти, `page`, `layout`, `not-found`.
- [[Next.js - 07. Server і Client Components]] — чому хуки `useParams`/`useSearchParams` живуть лише в Client Components.
- Далі в курсі: [[Next.js - 04. Навігація під капотом]] — prefetch і shell при переході на новий `slug`; [[Next.js - 06. proxy.ts, redirects і rewrites]] — перевірка до стріму; [[Next.js - 10. Статичний і динамічний рендеринг]] — чому `searchParams` робить маршрут динамічним; [[Next.js - 11. Streaming і Suspense]] і [[Next.js - 12. Partial Prerendering і Cache Components]] — shell, стрім і `instant`.

## ⚡ Фішки

> [!reel] 🥇 Статичне перемагає динамічне — посегментно
> `/en/about` обслужить `app/en/[page]`, а не `app/[lang]/about`. Маршрути порівнюють зліва направо, і перший статичний сегмент вирішує все.

> [!reel] 🔤 Кирилиця приходить у params закодованою
> `generateStaticParams` повертає `'привіт'`, а сторінка отримує `'%D0%BF%D1%80…'`. Без `decodeURIComponent` пост не знайдеться, і буде 404.

> [!reel] 🧱 return [] тепер помилка збірки
> З Cache Components кожен виклик `generateStaticParams` має повернути хоча б один результат — це приклади, на яких збірка перевіряє маршрут. Порожній масив = нічого перевіряти.

> [!reel] 📡 notFound() після стріму — це 200
> Shell уже пішов зі статусом 200. `notFound()` усередині `<Suspense>` показує «не знайдено» й `noindex`, але статус не змінить.

> [!reel] 🧭 Меню з usePathname падає через чужий маршрут
> Root layout з активним меню ламає `next build`, щойно хтось додає `[id]` без `generateStaticParams`. Ліки — `<Suspense>` навколо меню.
>
> ```tsx
> <Suspense fallback={<nav aria-busy="true" />}>
>   <Nav />
> </Suspense>
> ```

> [!reel] 🧺 ?tag=a&tag=b — уже масив
> `searchParams.tag` буває `string`, `string[]` або `undefined`. Код, що чекає рядок, впаде на `tag.split` при першому повторному ключі.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Як зробити сторінку, що обслуговує /blog/будь-що, і прочитати значення?
> *дуже часто · код* · `nextjs-core-03-card-01`
>
> Папка `app/blog/[slug]/page.tsx`; значення — у пропі `params`, який у Next.js 16 є Promise: `const { slug } = await params`. Тип — `PageProps<'/blog/[slug]'>`.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🧩 Три види динамічних сегментів|Розділ: види сегментів]] · [Next.js: Dynamic Route Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

> [!question]- Що лежить у params для catch-all і optional catch-all сегментів?
> *часто · теорія* · `nextjs-core-03-card-02`
>
> Масив сегментів: `/docs/a/b` → `{ slug: ['a', 'b'] }`. `[...slug]` не підходить для `/docs`; `[[...slug]]` підходить і для `/shop`, тоді `slug` — `undefined` (`{ slug?: string[] }`).
>
> 📚 [[Next.js - 03. Динамічні маршрути#🧩 Три види динамічних сегментів|Розділ: види сегментів]] · [Next.js: Catch-all Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#catch-all-segments)

> [!question]- Є app/blog/new і app/blog/[slug]. Хто обслужить /blog/new?
> *часто · теорія* · `nextjs-core-03-card-03`
>
> `app/blog/new` — статичний сегмент завжди сильніший за динамічний на тому самому рівні. `/blog/news` дістанеться `[slug]`.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🥇 Хто виграє, коли підходять кілька маршрутів|Розділ: пріоритет]] · [Next.js: Dynamic Route Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

> [!question]- Що повертає generateStaticParams?
> *дуже часто · код* · `nextjs-core-03-card-04`
>
> Масив об'єктів params, по одному на сторінку: `[{ slug: 'a' }, { slug: 'b' }]`; ключ — назва папки, значення — рядок (масив рядків для catch-all). `next build` пререндерить сторінку для кожного.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🏗️ generateStaticParams: шляхи на етапі збірки|Розділ: generateStaticParams]] · [Next.js: generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

> [!question]- Як показати 404 для неіснуючої статті?
> *дуже часто · код* · `nextjs-core-03-card-05`
>
> Після пошуку: `if (!post) notFound()` з `next/navigation`. Next.js покаже найближчий `not-found.tsx`; після виклику TypeScript вважає `post` не `null`.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🚫 notFound() для невідомого slug|Розділ: notFound]] · [Next.js: notFound](https://nextjs.org/docs/app/api-reference/functions/not-found)

### 🟡 Middle

> [!question]- Що означають ○, ◐, ● і ƒ у таблиці маршрутів?
> *часто · теорія* · `nextjs-core-03-card-06`
>
> `○` — повністю пререндерено; `◐` — static shell + стрім під час запиту; `●` — SSG з `generateStaticParams` (лише без Cache Components); `ƒ` — рендер на кожен запит (з Cache Components — лише там, де нічого пререндерити). Рядок-шаблон `◐ /blog/[slug]` — shell для значень поза списком.
>
> 📚 [[Next.js - 03. Динамічні маршрути#📋 Таблиця маршрутів після next build|Розділ: таблиця маршрутів]] · [Next.js: Building your application](https://nextjs.org/docs/app/guides/building)

> [!question]- Що станеться з адресою, якої немає в generateStaticParams?
> *часто · теорія* · `nextjs-core-03-card-07`
>
> За замовчуванням — не 404: Next.js відрендерить її під час першого запиту й збереже, наступні запити отримають готову сторінку. 404 буде, лише якщо сторінка сама викличе `notFound()`.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🏗️ generateStaticParams: шляхи на етапі збірки|Розділ: підмножина шляхів]] · [Next.js: generateStaticParams — Subset of paths](https://nextjs.org/docs/app/api-reference/functions/generate-static-params#subset-of-paths-at-build-time)

> [!question]- Як працюють вкладені generateStaticParams (згори вниз)?
> *іноді · код* · `nextjs-core-03-card-08`
>
> Layout `[category]` повертає категорії, а `generateStaticParams` сторінки `[product]` викликається окремо для кожної й отримує `{ params: { category } }` — синхронний об'єкт. Генерувати можна сегменти свого рівня і вище, не нижче.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🏗️ generateStaticParams: шляхи на етапі збірки|Розділ: вкладені сегменти]] · [Next.js: Multiple Dynamic Segments](https://nextjs.org/docs/app/api-reference/functions/generate-static-params#multiple-dynamic-segments-in-a-route)

> [!question]- Який тип у searchParams.tag і чому його не можна одразу передати в БД?
> *часто · безпека* · `nextjs-core-03-card-09`
>
> `string | string[] | undefined`: повторений ключ — масив, відсутній — `undefined`. Це сирий ввід користувача, тож його розбирають функцією з типовими значеннями й білим списком (сортування, межі сторінок) до запиту.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🔎 searchParams: рядок запиту|Розділ: searchParams]] · [Next.js: page.js — searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional)

### 🔴 Senior

> [!question]- Які правила для динамічних маршрутів додає cacheComponents?
> *часто · теорія* · `nextjs-core-03-card-10`
>
> Без `generateStaticParams` `params` — runtime data, `await` лише в `<Suspense>` (або `loading.tsx`); `generateStaticParams` має повернути ≥ 1 результат на кожен виклик; `dynamicParams` — помилка збірки. `useParams`/`usePathname` для невідомих параметрів і `useSearchParams` завжди — теж під `<Suspense>`.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🧱 З Cache Components: що змінилось|Розділ: Cache Components]] · [Next.js: Dynamic Routes with Cache Components](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#with-cache-components)

> [!question]- Чому notFound() може повернути статус 200?
> *іноді · теорія* · `nextjs-core-03-card-11`
>
> Якщо він виконався всередині `<Suspense>` після того, як shell зі статусом 200 уже пішов. Статус після початку стріму не змінити; Next.js додає `noindex` (soft 404). Для справжнього 404 перевіряють до стріму — поза `<Suspense>` або в `proxy`.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🚫 notFound() для невідомого slug|Розділ: статус-коди]] · [Next.js: notFound](https://nextjs.org/docs/app/api-reference/functions/not-found)

> [!question]- Чому layout не повинен робити await params на верхньому рівні?
> *іноді · продуктивність* · `nextjs-core-03-card-12`
>
> Тоді весь layout залежить від параметра і не потрапляє в static shell для значень поза списком (а без `generateStaticParams` збірка взагалі впаде). Передай Promise у дочірній компонент під `<Suspense>` і чекай там — layout лишається спільним каркасом.
>
> 📚 [[Next.js - 03. Динамічні маршрути#🏗️ generateStaticParams: шляхи на етапі збірки|Розділ: layout і params]] · [Next.js: ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components)

> [!question]- Чому сторінка /blog/привіт дає 404, хоча slug є в generateStaticParams?
> *рідко · код* · `nextjs-core-03-card-13`
>
> На 16.3.8 `params` приходять percent-encoded (`%D0%BF…`), і пошук за сирим значенням не знаходить пост. Декодуй `decodeURIComponent(slug)` перед пошуком або тримай slug латиницею.
>
> 📚 [[Next.js - 03. Динамічні маршрути#⚠️ Пастки|Розділ: пастки]] · [MDN: decodeURIComponent](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)

## 🛠️ Практика

> [!task] Збери матчер маршрутів з пріоритетами
> level: middle · difficulty: medium · id: nextjs-core-03-task-01 · tags: routing, dynamic-routes, matcher
>
> Напиши `matchRoute(routes, pathname)`: `routes` — масив шаблонів (`'/blog/new'`, `'/blog/[slug]'`, `'/docs/[...slug]'`, `'/shop/[[...slug]]'`), `pathname` — адреса без рядка запиту. Поверни `{ route, params }` для найкращого збігу або `null`.
>
> - `[x]` — рівно один сегмент, рядок; `[...x]` — один і більше, масив; `[[...x]]` — нуль і більше, масив, а для нуля сегментів ключа в `params` немає;
> - кінцевий `/` і порожні сегменти ігноруй (`/blog/a/` = `/blog/a`, `/` — нуль сегментів);
> - пріоритет — посегментно зліва направо: статичний > `[x]` > `[...x]` > `[[...x]]`; на першому сегменті, де кандидати різняться, сильніший вид перемагає;
> - порядок у масиві `routes` ролі не грає. Значення не декодуй.
>
> ```js
> matchRoute(['/blog/[slug]', '/blog/new'], '/blog/new') // → { route: '/blog/new', params: {} }
> ```
>
> ```js starter
> function matchRoute(routes, pathname) {
>   // твій код
> }
> ```
>
> ```js tests
> const routes = ['/blog/[slug]', '/docs/[...slug]', '/shop/[[...slug]]', '/blog/new', '/']
>
> test('статичний сегмент перемагає динамічний незалежно від порядку', () => {
>   expect(matchRoute(routes, '/blog/new')).toEqual({ route: '/blog/new', params: {} })
>   expect(matchRoute(routes, '/blog/hello')).toEqual({ route: '/blog/[slug]', params: { slug: 'hello' } })
> })
>
> test('catch-all збирає хвіст у масив і не підходить без сегментів', () => {
>   expect(matchRoute(routes, '/docs/routing/dynamic')).toEqual({ route: '/docs/[...slug]', params: { slug: ['routing', 'dynamic'] } })
>   expect(matchRoute(routes, '/docs')).toBeNull()
> })
>
> test('optional catch-all підходить і для кореня', () => {
>   expect(matchRoute(routes, '/shop')).toEqual({ route: '/shop/[[...slug]]', params: {} })
>   expect(matchRoute(routes, '/shop/shoes/sneakers/')).toEqual({ route: '/shop/[[...slug]]', params: { slug: ['shoes', 'sneakers'] } })
> })
>
> test('динамічний сильніший за catch-all, але бере лише один сегмент', () => {
>   const files = ['/files/[...path]', '/files/[name]']
>   expect(matchRoute(files, '/files/x')).toEqual({ route: '/files/[name]', params: { name: 'x' } })
>   expect(matchRoute(files, '/files/x/y')).toEqual({ route: '/files/[...path]', params: { path: ['x', 'y'] } })
> })
>
> test('пріоритет вирішує перший сегмент, де маршрути різняться', () => {
>   const i18n = ['/[lang]/about', '/en/[page]', '/[[...rest]]']
>   expect(matchRoute(i18n, '/en/about')).toEqual({ route: '/en/[page]', params: { page: 'about' } })
>   expect(matchRoute(i18n, '/uk/about')).toEqual({ route: '/[lang]/about', params: { lang: 'uk' } })
>   expect(matchRoute(i18n, '/a/b/c')).toEqual({ route: '/[[...rest]]', params: { rest: ['a', 'b', 'c'] } })
> })
>
> test('кілька параметрів і відсутній збіг', () => {
>   expect(matchRoute(['/[category]/[item]'], '/phones/pixel')).toEqual({ route: '/[category]/[item]', params: { category: 'phones', item: 'pixel' } })
>   expect(matchRoute(routes, '/')).toEqual({ route: '/', params: {} })
>   expect(matchRoute(routes, '/about')).toBeNull()
> })
> ```
>
> > [!hint]- Підказка 1
> > Розбий шаблон і адресу на сегменти (`split('/').filter(Boolean)`). Напиши `match(pattern, parts)`, що повертає `params` або `null`, і окремо — «вагу» кожного сегмента шаблону: статичний 0, `[x]` 1, `[...x]` 2, `[[...x]]` 3.
>
> > [!hint]- Підказка 2
> > Серед усіх збігів обери той, чий масив ваг менший лексикографічно: порівнюй ваги по черзі, перша різниця вирішує. Catch-all може стояти лише останнім, тож хвіст адреси дістається йому цілком.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function matchRoute(routes, pathname) {
> >   const split = (s) => s.split('/').filter(Boolean)
> >   const kind = (seg) =>
> >     seg.startsWith('[[...') ? 3 : seg.startsWith('[...') ? 2 : seg.startsWith('[') ? 1 : 0
> >   const name = (seg) => seg.replace(/^\[+(\.\.\.)?/, '').replace(/\]+$/, '')
> >
> >   function match(pattern, parts) {
> >     const segs = split(pattern)
> >     const params = {}
> >     for (let i = 0; i < segs.length; i++) {
> >       const seg = segs[i]
> >       const k = kind(seg)
> >       if (k >= 2) {
> >         const rest = parts.slice(i)
> >         if (k === 2 && rest.length === 0) return null
> >         if (rest.length > 0) params[name(seg)] = rest
> >         return params
> >       }
> >       if (i >= parts.length) return null
> >       if (k === 0 && seg !== parts[i]) return null
> >       if (k === 1) params[name(seg)] = parts[i]
> >     }
> >     return segs.length === parts.length ? params : null
> >   }
> >
> >   function compare(a, b) {
> >     const wa = split(a).map(kind)
> >     const wb = split(b).map(kind)
> >     for (let i = 0; i < Math.max(wa.length, wb.length); i++) {
> >       const x = wa[i] ?? -1
> >       const y = wb[i] ?? -1
> >       if (x !== y) return x - y
> >     }
> >     return 0
> >   }
> >
> >   const parts = split(pathname)
> >   let best = null
> >   for (const route of routes) {
> >     const params = match(route, parts)
> >     if (params && (!best || compare(route, best.route) < 0)) best = { route, params }
> >   }
> >   return best
> > }
> > ```
> >
> > Наївне «перший збіг у масиві» провалює вже перший тест: `/blog/[slug]` стоїть раніше за `/blog/new`. Справжній Next.js сортує маршрути на етапі збірки за тим самим правилом і ще валідує конфлікти (`Ambiguous app routes`, сторінка поруч з `[[...x]]`); а `params` він, як і тут, не декодує.

> [!task] Збери шляхи з вкладених generateStaticParams
> level: middle · difficulty: medium · id: nextjs-core-03-task-02 · tags: generateStaticParams, cache-components, build
>
> Змоделюй, як `next build` поєднує `generateStaticParams` вкладених сегментів. Напиши `async collectPaths(route, levels)`:
>
> - `route` — шаблон на кшталт `'/products/[category]/[product]'` або `'/docs/[...slug]'`;
> - `levels` — функції `generateStaticParams` згори вниз (layout → page). Перша отримує `{ params: {} }`, кожна наступна викликається **окремо для кожного** результату попередньої з `{ params: <обʼєднані params батька> }`. Функція може повернути масив або Promise масиву;
> - результат кожного виклику зливається з params батька;
> - поверни масив URL у порядку обходу: `[x]` — значення, `[...x]` — частини через `/`, `[[...x]]` — так само, а для `[]`/відсутнього ключа сегмент зникає (`/shop`);
> - помилки (правила Cache Components і `next build`): виклик повернув порожній масив або не масив — `throw new Error('empty')`; значення не рядок (для catch-all — не масив рядків) — `throw new Error('not a string: <ключ>')`; у підсумку бракує ключа з шаблону — `throw new Error('missing: <ключ>')`.
>
> ```js
> await collectPaths('/blog/[slug]', [() => [{ slug: 'a' }, { slug: 'b' }]]) // → ['/blog/a', '/blog/b']
> ```
>
> ```js starter
> async function collectPaths(route, levels) {
>   // твій код
> }
> ```
>
> ```js tests
> test('один сегмент', async () => {
>   expect(await collectPaths('/blog/[slug]', [() => [{ slug: 'a' }, { slug: 'b' }]])).toEqual(['/blog/a', '/blog/b'])
> })
>
> test('згори вниз: дочірня функція отримує params батька', async () => {
>   const seen = []
>   const categories = async () => [{ category: 'phones' }, { category: 'laptops' }]
>   const products = async ({ params }) => {
>     seen.push(params.category)
>     return params.category === 'phones' ? [{ product: 'pixel' }, { product: 'iphone' }] : [{ product: 'air' }]
>   }
>   const paths = await collectPaths('/products/[category]/[product]', [categories, products])
>   expect(paths).toEqual(['/products/phones/pixel', '/products/phones/iphone', '/products/laptops/air'])
>   expect(seen).toEqual(['phones', 'laptops'])
> })
>
> test('знизу вгору: одна функція повертає обидва ключі', async () => {
>   const all = () => [{ category: 'phones', product: 'pixel' }]
>   expect(await collectPaths('/products/[category]/[product]', [all])).toEqual(['/products/phones/pixel'])
> })
>
> test('catch-all і optional catch-all', async () => {
>   expect(await collectPaths('/docs/[...slug]', [() => [{ slug: ['routing', 'dynamic'] }]])).toEqual(['/docs/routing/dynamic'])
>   expect(await collectPaths('/shop/[[...slug]]', [() => [{ slug: [] }, { slug: ['shoes'] }]])).toEqual(['/shop', '/shop/shoes'])
> })
>
> test('порожній результат будь-якого виклику — помилка', async () => {
>   const categories = () => [{ category: 'phones' }, { category: 'laptops' }]
>   const products = ({ params }) => (params.category === 'phones' ? [{ product: 'pixel' }] : [])
>   await expect(collectPaths('/products/[category]/[product]', [categories, products])).rejects.toThrow('empty')
> })
>
> test('число замість рядка і відсутній ключ — помилки', async () => {
>   await expect(collectPaths('/users/[id]', [() => [{ id: 1 }]])).rejects.toThrow('not a string: id')
>   await expect(collectPaths('/products/[category]/[product]', [() => [{ category: 'phones' }]])).rejects.toThrow('missing: product')
> })
> ```
>
> > [!hint]- Підказка 1
> > Тримай масив «поточних» params, почни з `[{}]`. Для кожного рівня збери новий масив: для кожного батька `await level({ params: parent })`, перевір результат і злий кожен елемент з батьком (`{ ...parent, ...child }`).
>
> > [!hint]- Підказка 2
> > URL будуй окремою функцією за сегментами шаблону: статичний — як є, `[x]` — `params[x]`, catch-all — `params[x].join('/')` або нічого. Перевірку типів роби там само, бо вид сегмента відомий лише із шаблону.
>
> > [!solution]- Еталонне рішення
> > ```js
> > async function collectPaths(route, levels) {
> >   let current = [{}]
> >   for (const level of levels) {
> >     const next = []
> >     for (const parent of current) {
> >       const result = await level({ params: parent })
> >       if (!Array.isArray(result) || result.length === 0) throw new Error('empty')
> >       for (const child of result) next.push({ ...parent, ...child })
> >     }
> >     current = next
> >   }
> >
> >   const segs = route.split('/').filter(Boolean)
> >   return current.map((params) => {
> >     const out = []
> >     for (const seg of segs) {
> >       if (!seg.startsWith('[')) {
> >         out.push(seg)
> >         continue
> >       }
> >       const optional = seg.startsWith('[[...')
> >       const catchAll = optional || seg.startsWith('[...')
> >       const key = seg.replace(/^\[+(\.\.\.)?/, '').replace(/\]+$/, '')
> >       const value = params[key]
> >       if (value === undefined && !optional) throw new Error(`missing: ${key}`)
> >       if (catchAll) {
> >         const parts = value ?? []
> >         if (!Array.isArray(parts) || parts.some((p) => typeof p !== 'string')) throw new Error(`not a string: ${key}`)
> >         if (!optional && parts.length === 0) throw new Error(`missing: ${key}`)
> >         out.push(...parts)
> >       } else {
> >         if (typeof value !== 'string') throw new Error(`not a string: ${key}`)
> >         out.push(value)
> >       }
> >     }
> >     return '/' + out.join('/')
> >   })
> > }
> > ```
> >
> > Перевірка «порожньо» стоїть на кожному виклику, а не на підсумку: саме так 16.3.8 падає, коли одна категорія не має популярних товарів. Справжній Next.js ще й кидає `A required parameter (id) was not provided as a string received number`, а мільйон шляхів тут — мільйон пререндерів, тому в продакшні список обрізають до гарячого.

> [!task] Розбери searchParams каталогу
> level: junior · difficulty: medium · id: nextjs-core-03-task-03 · tags: searchParams, validation, pagination
>
> Напиши `parseListParams(raw)` для сторінки каталогу. `raw` — те, що дає `await searchParams`: `{ [key]: string | string[] | undefined }`. Поверни об'єкт рівно з полями `page`, `perPage`, `sort`, `order`, `tags`, `q`:
>
> - `page` — ціле > 0, інакше `1` (`'abc'`, `'0'`, `'-2'`, `'1.5'`, `''` → 1);
> - `perPage` — одне з `12`, `24`, `48` (число), інакше `24`;
> - `sort` — `'new'`, `'price'` або `'rating'`, інакше `'new'`; `order` — `'asc'` або `'desc'`, інакше `'desc'`;
> - для одиничних полів масив (`?page=2&page=5`) — бери **перше** значення;
> - `tags` — завжди масив: повтори ключа й значення через кому (`?tag=a,b&tag=c`) розгорни, обріж пробіли, прибери порожні й дублікати, порядок появи збережи;
> - `q` — рядок без пробілів по краях, не довший за 100 символів (обріж); порожній або відсутній — `null`.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються, тести дивляться на значення.
>
> ```ts starter
> type Raw = { [key: string]: string | string[] | undefined }
>
> type ListParams = {
>   page: number
>   perPage: 12 | 24 | 48
>   sort: 'new' | 'price' | 'rating'
>   order: 'asc' | 'desc'
>   tags: string[]
>   q: string | null
> }
>
> function parseListParams(raw: Raw): ListParams {
>   // ❌ «працює» лише для ідеального URL
>   return {
>     page: Number(raw.page),
>     perPage: Number(raw.perPage) as ListParams['perPage'],
>     sort: raw.sort as ListParams['sort'],
>     order: raw.order as ListParams['order'],
>     tags: (raw.tag as string).split(','),
>     q: raw.q as string,
>   }
> }
> ```
>
> ```ts tests
> const defaults = { page: 1, perPage: 24, sort: 'new', order: 'desc', tags: [], q: null }
>
> test('порожній запит дає типові значення', () => {
>   expect(parseListParams({})).toEqual(defaults)
> })
>
> test('коректні значення розбираються в числа й літерали', () => {
>   expect(parseListParams({ page: '3', perPage: '48', sort: 'price', order: 'asc', q: 'ноутбук' }))
>     .toEqual({ page: 3, perPage: 48, sort: 'price', order: 'asc', tags: [], q: 'ноутбук' })
> })
>
> test('некоректна сторінка — 1', () => {
>   for (const page of ['abc', '0', '-2', '1.5', '', '2abc']) {
>     expect(parseListParams({ page }).page).toBe(1)
>   }
> })
>
> test('значення поза білим списком замінюються типовими', () => {
>   const p = parseListParams({ perPage: '1000', sort: 'DROP TABLE', order: 'up' })
>   expect([p.perPage, p.sort, p.order]).toEqual([24, 'new', 'desc'])
> })
>
> test('для повторених одиничних полів береться перше значення', () => {
>   const p = parseListParams({ page: ['2', '5'], sort: ['rating', 'price'] })
>   expect([p.page, p.sort]).toEqual([2, 'rating'])
> })
>
> test('теги: повтори, коми, пробіли, порожні й дублікати', () => {
>   expect(parseListParams({ tag: ['sale, new', 'new', ' ', 'top'] }).tags).toEqual(['sale', 'new', 'top'])
>   expect(parseListParams({ tag: 'sale' }).tags).toEqual(['sale'])
> })
>
> test('q обрізається і порожній стає null', () => {
>   expect(parseListParams({ q: '   ' }).q).toBeNull()
>   expect(parseListParams({ q: '  кава ' }).q).toBe('кава')
>   expect(parseListParams({ q: 'я'.repeat(150) }).q).toHaveLength(100)
> })
> ```
>
> > [!hint]- Підказка 1
> > Почни з помічника `first(v)` (масив → перший елемент) і `oneOf(value, allowed, fallback)`. Для `page` перевір рядок регулярним виразом `/^\d+$/`, а вже потім `Number` — так `'1.5'` і `'2abc'` не пройдуть.
>
> > [!hint]- Підказка 2
> > `[].concat(raw.tag ?? [])` перетворює рядок або масив на масив. Далі `flatMap((t) => t.split(','))`, `map(trim)`, `filter(Boolean)` і `new Set` для дублікатів.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function parseListParams(raw: Raw): ListParams {
> >   const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
> >   const oneOf = <T extends string>(v: string | undefined, allowed: readonly T[], fallback: T): T =>
> >     allowed.includes(v as T) ? (v as T) : fallback
> >
> >   const rawPage = first(raw.page) ?? ''
> >   const page = /^\d+$/.test(rawPage) && Number(rawPage) > 0 ? Number(rawPage) : 1
> >
> >   const perPageNum = Number(first(raw.perPage))
> >   const perPage = ([12, 24, 48] as const).find((n) => n === perPageNum) ?? 24
> >
> >   const tags = [
> >     ...new Set(
> >       ([] as string[])
> >         .concat(raw.tag ?? [])
> >         .flatMap((t) => t.split(','))
> >         .map((t) => t.trim())
> >         .filter(Boolean),
> >     ),
> >   ]
> >
> >   const q = (first(raw.q) ?? '').trim().slice(0, 100)
> >
> >   return {
> >     page,
> >     perPage,
> >     sort: oneOf(first(raw.sort), ['new', 'price', 'rating'] as const, 'new'),
> >     order: oneOf(first(raw.order), ['asc', 'desc'] as const, 'desc'),
> >     tags,
> >     q: q === '' ? null : q,
> >   }
> > }
> > ```
> >
> > `Number('')` дає `0`, `Number('1.5')` — `1.5`, а `parseInt('2abc')` — `2`, тому сторінку перевіряють регулярним виразом. Білий список для `sort` важливий не лише для UI: значення часто потрапляє в `ORDER BY`, і довільний рядок там — привід для SQL-інʼєкції. У реальній сторінці цю функцію викликають усередині компонента під `<Suspense>` після `await searchParams`.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Dynamic Route Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) — `[slug]`, catch-all, типізація і поведінка з Cache Components.
- 🟢 [Next.js — generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — підмножина шляхів, вкладені сегменти, правило «≥ 1 результат».
- 🟡 [Next.js — page.js: params і searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page) — Promise-пропси і хелпер `PageProps`.
- 🟡 [Next.js — Building your application](https://nextjs.org/docs/app/guides/building) — таблиця маршрутів `○ ◐ ● ƒ` і помилки пререндеру.
- 🟡 [Next.js — ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components) — підмножина шляхів, App Shell і `params` у layouts.
- 🟡 [Next.js — useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params) · [useParams](https://nextjs.org/docs/app/api-reference/functions/use-params) · [usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname) — клієнтські хуки і вимога `<Suspense>`.
- 🔴 [Next.js — notFound](https://nextjs.org/docs/app/api-reference/functions/not-found) — soft 404 і статус після початку стріму.
- 🔴 [Next.js — Upgrading to version 16](https://nextjs.org/docs/app/guides/upgrading/version-16) — кінець синхронних `params`, codemod і `next typegen`.
- 🛠️ [nuqs](https://nuqs.dev) — типізований стан у рядку запиту для App Router.

> [!important] Підсумок
> - `[slug]` — один сегмент (рядок), `[...slug]` — один і більше (масив), `[[...slug]]` — нуль і більше (`undefined` для кореня). Пріоритет — посегментно зліва направо: статичний > `[x]` > `[...x]` > `[[...x]]`.
> - `params` і `searchParams` — Promise; у 16 лише async. Типізуй через `PageProps<'/route'>`, перевіряй значення (це ввід користувача), декодуй не-ASCII slug.
> - `generateStaticParams` повертає масив рядкових params; вкладені функції викликаються для кожного результату батька; адреси поза списком рендеряться на першому запиті й кешуються.
> - З Cache Components: без `generateStaticParams` — `await params` лише в `<Suspense>`; `[]` і `dynamicParams` — помилки збірки; `useParams`/`usePathname`/`useSearchParams` теж можуть вимагати `<Suspense>`, зокрема меню в root layout.
> - Невідомий ресурс — `notFound()`; усередині `<Suspense>` це 200 + `noindex`, справжній 404 — до стріму.
