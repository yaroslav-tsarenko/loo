---
title: Layouts, templates і route groups
id: nextjs-core-02
slug: 02-layouts-templates-groups
order: 2
level: junior
skill: routing
icon: px:matryoshka
tags: [nextjs, routing, layout, template, route-groups, root-layout, metadata]
prerequisites: ["[[Next.js Start - 07. Сторінки й layouts]]", "[[Next.js - 01. App Router, сегменти і спеціальні файли]]"]
estimatedMinutes: 50
nextVersion: 16.3.8
---

# Layouts, templates і route groups

> [!success] 🎯 Після цього розділу ти зможеш
> - для навігації з маршруту A на маршрут B сказати, які layouts лишаться, які templates змонтуються заново і коли буде повне перезавантаження сторінки;
> - пояснити, чому layout не отримує `searchParams` і не знає pathname, і показати активне посилання без цього;
> - обрати між `layout.tsx` і `template.tsx` і знати, що змінює в цьому виборі Activity з `cacheComponents`;
> - організувати маршрути групами `(group)` без впливу на URL, зробити кілька root layouts і не спіткнутися об конфлікт адрес;
> - передбачити `<title>` сторінки з `title.template` кількох вкладених layouts;
> - не тримати в layout дані, які мають оновлюватися, і не «захищати» сторінки перевіркою в layout.

## 🤔 Передбач

> [!quiz] Що покажуть лічильники після переходу?
> level: junior · type: output · id: nextjs-core-02-quiz-01
>
> У `app/(app)/dashboard/` є `layout.tsx` з `<Counter label="layout" />` і `template.tsx` з `<Counter label="template" />` (кожен `Counter` — Client Component з `useState`). Користувач на `/dashboard` натискає «layout» тричі, «template» двічі, а потім клікає `<Link href="/dashboard/settings">`. Що покажуть кнопки на новій сторінці?
>
> - [ ] `layout: 3`, `template: 2` — обидва файли спільні для цих сторінок, тож обидва лишаються
> - [x] `layout: 3`, `template: 0`
> - [ ] `layout: 0`, `template: 0` — при навігації стан завжди скидається
> - [ ] `layout: 0`, `template: 2` — layout рендериться заново, а template зберігає стан
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Layout переживає навігацію між своїми дочірніми сторінками: React не чіпає його екземпляр. Template отримує новий `key` для кожної дочірньої сторінки, тож React створює його заново, і `useState` стартує з нуля. Так це поводиться на 16.3.8 у `next start`.

## 🧒 Простими словами

Уяви торговий центр. Будівля зі стінами, дахом і входом — це **root layout**: без нього немає де стояти магазинам. Поверх із власним ескалатором і табличками — **вкладений layout**: ти переходиш між магазинами поверху, а поверх лишається тим самим, і кавʼярня на ньому не зачиняється. Сам магазин — **сторінка**. **Template** — примірочна: щоразу, коли ти заходиш в інший магазин, тобі дають чисту кабінку, хоч на вигляд вони однакові. **Route group** — внутрішнє крило «Для дітей» на плані: воно допомагає орієнтуватися, але на адресі магазину його не пишуть. А **кілька root layouts** — це два окремі будинки поруч. Між поверхами одного будинку ходиш усередині, а щоб потрапити в сусідній, доведеться вийти на вулицю й зайти знову: це **повне перезавантаження сторінки**.

## 🔬 Як це працює насправді

### 🪆 Вкладені layouts: що живе між переходами

Основи — у [[Next.js Start - 07. Сторінки й layouts|темі Start 07]]: `layout.tsx` обгортає сторінки свого сегмента й усіх вкладених через `children`, root layout містить `<html>` і `<body>`, а layout зберігає стан. Тут розберемо, **що саме** переживає навігацію і чому.

Візьмемо кабінет SaaS-сервісу. Оболонка з бічною панеллю спільна для `/dashboard` і `/dashboard/settings`:

```tsx
// app/(app)/dashboard/layout.tsx — спільна оболонка кабінету
import { Suspense } from 'react'
import { NavLink } from './nav-link'
import { Counter } from './counter'
import { UserMenu } from './user-menu'

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return (
    <div className="shell">
      <aside>
        <NavLink href="/dashboard">Огляд</NavLink>
        <NavLink href="/dashboard/settings">Налаштування</NavLink>
        <Counter label="layout" />
        <Suspense fallback={<p>…</p>}>
          <UserMenu />
        </Suspense>
      </aside>
      <main>{children}</main>
    </div>
  )
}
```

`LayoutProps<'/dashboard'>` — глобальний тип-хелпер: Next.js генерує його під час `next dev`, `next build` або `next typegen` зі структури папок, тож імпортувати його не треба. Він типізує `children`, `params` і слоти паралельних маршрутів (тема 05). `Counter` — маленький Client Component, щоб бачити, що відбувається зі станом і ефектами:

```tsx
// app/(app)/dashboard/counter.tsx — стан + ефект, щоб бачити mount/unmount
'use client'

import { useEffect, useState } from 'react'

export function Counter({ label }: { label: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    console.log(`[${label}] mount`)
    return () => console.log(`[${label}] cleanup`)
  }, [label])
  return (
    <button data-testid={`counter-${label}`} onClick={() => setCount((c) => c + 1)}>
      {label}: {count}
    </button>
  )
}
```

Як це поводиться на 16.3.8 (продакшн-збірка, перехід через `<Link>`):

| Що перевіряли | `/dashboard` → `/dashboard/settings` |
|---|---|
| Стан `Counter` у layout | лишився (`layout: 3`) |
| `useEffect` у layout | не перезапустився: у консолі один `[layout] mount` за всю сесію |
| Server Component layout | не рендерився знову: `console.log` у його тілі на сервері не зʼявився |
| DOM поза `{children}` | той самий: фокус, прокрутка панелі, відкриті `<details>` лишаються |

Механізм називається **partial rendering**. Next.js порівнює дерево сегментів старого й нового маршруту: спільні сегменти (тут `(app)` і `dashboard`) лишаються, а з сервера приходить RSC payload лише для того, що змінилося, — сторінки `settings`. React бачить на тому ж місці той самий тип компонента з тим самим ключем і не створює його заново. Звідси головне правило: **layout — для того, що має жити довше за сторінку**: навігація, плеєр, кошик, чат-віджет, розкрита бічна панель.

Межа «спільного» — сегмент. Якщо в новому маршруті сегмента `dashboard` немає (скажімо, `/reports` у тій самій групі `(app)`), його layout зникає з екрана. Без Cache Components React його розмонтовує разом зі станом. З `cacheComponents: true` Next.js ховає весь попередній маршрут через React `<Activity>` (до 3 маршрутів разом із видимим), і на 16.3.8 шлях `/dashboard` → `/reports` → `/dashboard` повертає `layout: 3`. Тож гарантовано стан layout зникає лише після перезавантаження сторінки, переходу в інший root layout (нижче) або коли маршрут витіснили з цих трьох. Механіку Activity розбираємо в [[Next.js - 04. Навігація під капотом|темі 04]].

> [!note] Чому сторінкам з даними потрібен `loading.tsx` / `<Suspense>`
> `UserMenu` і сторінка кабінету читають `cookies()` (сесію) — це дані часу запиту, яких немає на етапі збірки. З `cacheComponents: true` такий доступ має бути всередині `<Suspense>` (для сторінки це робить `loading.tsx`, у layout — явний `<Suspense>`), інакше `next build` зупиняється з помилкою. Детально — у темах 11–12, 14–16.

> [!quiz] Перевір себе: що буде зі станом layout?
> level: junior · id: nextjs-core-02-quiz-02
>
> `cacheComponents: true`. `app/shop/layout.tsx` рендерить клієнтський `<CartBadge />` зі станом «відкрито/закрито». Маршрути `/shop/shoes`, `/shop/bags` і `/about` мають спільний `app/layout.tsx`. Користувач відкрив бейдж на `/shop/shoes`. Коли стан **гарантовано** зникне?
>
> - [ ] При переході на `/shop/bags`: нова сторінка — новий рендер layout
> - [ ] При переході на `/about` і назад через `<Link>`: `shop/layout.tsx` на `/about` немає, тож він розмонтувався
> - [x] Після оновлення сторінки (F5)
> - [ ] При будь-якому переході, якщо `CartBadge` не обгорнути в `memo`
>
> **Пояснення:** між `/shop/shoes` і `/shop/bags` сегмент `shop` спільний, тож layout і стан лишаються. На `/about` layout зникає з екрана, але з Cache Components Next.js ховає попередній маршрут через `<Activity>`, і на 16.3.8 повернення відновлює бейдж. Без Cache Components другий варіант був би правильним. Перезавантаження стирає весь клієнтський стан. `memo` впливає на повторний рендер, а не на те, чи живе екземпляр.

### 🙈 Чому layout не бачить searchParams і pathname

Layout отримує лише `children` і `params`, а також слоти паралельних маршрутів, якщо вони є. На 16.3.8 `console.log(Object.keys(props))` у `DashboardLayout` виводить `[ 'children', 'params' ]`. `searchParams` є тільки в `page.tsx`, а pathname сервер у layout не передає взагалі.

Причина випливає з попереднього розділу: **layout не рендериться заново при навігації**. Якби він прочитав `?tab=team` чи поточний шлях, то при переході на `?tab=billing` показав би старе значення: оновлюється лише сторінка. Тож Next.js просто не дає в layout того, що там неминуче застаріє. Ще один бонус: без доступу до сирого запиту layout можна кешувати й перевикористовувати між сторінками.

Що робити, коли в оболонці потрібне активне посилання чи фільтр з URL:

- **Pathname** — у Client Component через `usePathname()`. Client Components рендеряться при кожній навігації, тож значення завжди свіже.
- **Query-параметри** — `searchParams` у `page.tsx` або `useSearchParams()` у Client Component.
- **Динамічні сегменти** (`[team]`) — layout отримує їх як `params` (Promise, тема 03): вони не застаріють, бо зміна `params` означає інший сегмент і новий екземпляр layout.

```tsx
// app/(app)/dashboard/nav-link.tsx — активне посилання: pathname читає Client Component
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link href={href} aria-current={active ? 'page' : undefined} style={{ fontWeight: active ? 700 : 400 }}>
      {children}
    </Link>
  )
}
```

Layout лишається серверним, а «знає» адресу лише крихітний клієнтський листок — та сама ідея «межа якомога нижче» з [[Next.js - 07. Server і Client Components|теми 07]]. `aria-current="page"` — не прикраса: скрінрідер оголосить активний пункт.

> [!quiz] Перевір себе: як підсвітити активний пункт меню в layout?
> level: junior · id: nextjs-core-02-quiz-03
>
> У `app/docs/layout.tsx` (Server Component) треба виділити посилання на поточну сторінку. Що зробити?
>
> - [ ] Прочитати `props.pathname` у layout
> - [ ] Прочитати `searchParams` у layout і зібрати з них шлях
> - [x] Винести посилання в Client Component з `usePathname()` і рендерити його в layout
> - [ ] Додати `'use client'` на весь layout і читати `window.location`
>
> **Пояснення:** pathname у layout не передається, `searchParams` теж, і вони однаково застаріли б, бо layout не рендериться при навігації. Client Component рендериться щоразу й отримує свіжий шлях з `usePathname()`. `'use client'` на весь layout робить клієнтським усе, що він імпортує, а `window.location` не існує під час серверного рендеру.

### 🔁 template.tsx: новий екземпляр на кожну навігацію

`template.tsx` схожий на layout: default-експорт, що приймає `children` і обгортає сторінки сегмента. Різниця одна, але принципова: Next.js дає template **унікальний `key`** для кожного дочірнього сегмента. Коли дочірній сегмент змінюється, змінюється й `key`, а React для нового ключа створює новий екземпляр: стан Client Components усередині скидається, ефекти запускаються знову, DOM створюється з нуля.

```tsx
// app/(app)/dashboard/template.tsx — монтується заново на кожну навігацію між дітьми
import { Counter } from './counter'

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Counter label="template" />
      {children}
    </div>
  )
}
```

За замовчуванням template — Server Component, як і layout; стан скидається в Client Components усередині нього. У дереві сегмента він стоїть одразу під layout: `layout → template → error → loading → not-found → page` (ієрархію розбирали в [[Next.js - 01. App Router, сегменти і спеціальні файли|темі 01]]). Спрощено React бачить таке:

```tsx
<DashboardLayout>
  <DashboardTemplate key="settings">{/* ключ змінюється разом з дочірнім сегментом */}
    <SettingsPage />
  </DashboardTemplate>
</DashboardLayout>
```

Правила ключа (на 16.3.8 — так, як у документації):

1. Template **свого рівня** ремаунтиться, коли змінюється сегмент безпосередньо під ним (включно з іншим значенням динамічного параметра: `/blog/a` → `/blog/b`).
2. Template **вище** не ремаунтиться, якщо зміна відбулася глибше: для `app/template.tsx` перехід `/blog/a` → `/blog/b` нічого не змінює, бо перший сегмент (`blog`) той самий.
3. **Query-параметри не рахуються.** Перехід `/dashboard` → `/dashboard?tab=team` на 16.3.8 лишає `template: 2`.

Коли template справді потрібен:

- **Анімація входу** кожної сторінки (CSS-анімація на обгортці спрацьовує, бо DOM новий).
- **Ефект на кожну сторінку**: лог перегляду, фокус на заголовок, скидання прокрутки внутрішнього контейнера.
- **Скинути стан дочірнього Client Component**: поле пошуку, яке не має «перетікати» з однієї сторінки на іншу.
- **Fallback `<Suspense>` на кожну навігацію.** У layout `<Suspense>` показує fallback лише при першому завантаженні (далі вміст уже є), а в template — щоразу, бо межа створюється наново.

| | `layout.tsx` | `template.tsx` |
|---|---|---|
| Екземпляр при навігації між дітьми | той самий | новий (`key` = дочірній сегмент) |
| Стан і DOM усередині | зберігаються | скидаються |
| `useEffect` | не перезапускається | перезапускається |
| Обовʼязковий | root layout — так | ні, рідкісний інструмент |
| Типове використання | оболонка, навігація, провайдери | анімація входу, ефект на сторінку, скидання полів |

Template — інструмент рідкісний. Якщо хочеш скинути один компонент, частіше вистачає `key` на ньому самому: `<SearchBox key={slug} />`.

> [!warning] Activity відновлює стан і всередині template
> [Документація template.js](https://nextjs.org/docs/app/api-reference/file-conventions/template) каже, що Client Components усередині template «reset their state on navigation». На 16.3.8 з `cacheComponents: true` це правда для **нового** маршруту, але не для нещодавно відвіданого. Шлях `/dashboard` (`template: 2`) → `/dashboard/settings` (`template: 0`) → знову `/dashboard` через `<Link>` показує `template: 2`. Next.js не розмонтовує сторінки, а ховає їх через React `<Activity>` (до 3 маршрутів разом із видимим, [Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state)). Повернувшись на маршрут, ти отримуєш той самий прихований екземпляр template разом зі станом. Ефекти при цьому відпрацьовують так, як обіцяє документація: при приховуванні — cleanup, при показі — знову `mount`.

Отже, з Cache Components «template для скидання стану» гарантує свіжий екземпляр лише для маршруту, якого немає серед збережених. Для надійного скидання документація пропонує інші прийоми: `useLayoutEffect` з cleanup, стан з URL, `key={useRouter().bfcacheId}`. Їх розбираємо в [[Next.js - 04. Навігація під капотом|темі 04]].

> [!quiz] Перевір себе: що покаже template після повернення?
> level: middle · type: output · id: nextjs-core-02-quiz-04
>
> `cacheComponents: true`, продакшн-збірка. На `/dashboard` користувач натиснув «template» двічі (`template: 2`), перейшов `<Link>` на `/dashboard/settings`, а звідти таким самим `<Link>` назад на `/dashboard`. Що покаже кнопка?
>
> - [x] `template: 2` — Activity повернула прихований екземпляр разом зі станом
> - [ ] `template: 0` — template ремаунтиться на кожну навігацію без винятків
> - [ ] `template: 1` — React відновлює стан, але скидає останню зміну
> - [ ] Помилку hydration: два екземпляри template з однаковим `key`
>
> **Пояснення:** з Cache Components Next.js зберігає до 3 маршрутів разом із видимим через `<Activity>`, а не знищує їх. Повернення на `/dashboard` показує той самий екземпляр template, тож стан лишився. Новий екземпляр зʼявився б для маршруту, якого серед збережених немає, або після перезавантаження сторінки.

### 🗂️ Route groups: організація без впливу на URL

Папка в дужках, `(marketing)`, — **route group**: вона є в дереві файлів, але **не в URL**. `app/(marketing)/pricing/page.tsx` відкривається за адресою `/pricing`, а не `/marketing/pricing`. Навіщо це:

1. **Організувати код** за командами, фічами чи зонами: `(marketing)`, `(shop)`, `(admin)`, і при цьому не міняти адрес.
2. **Дати layout лише частині маршрутів.** Сторінки в `(app)` отримують оболонку кабінету, а `/pricing` у `(marketing)` — ні, хоча обидві адреси на верхньому рівні сайту.
3. **Зробити кілька root layouts** — наступний розділ.

```text
app/
├── (marketing)/
│   ├── layout.tsx         ← root layout публічного сайту
│   ├── page.tsx           → /
│   └── pricing/page.tsx   → /pricing
└── (app)/
    ├── layout.tsx         ← root layout застосунку
    └── dashboard/
        ├── layout.tsx     ← оболонка кабінету
        ├── template.tsx
        ├── loading.tsx
        ├── page.tsx       → /dashboard
        └── settings/page.tsx → /dashboard/settings
```

> [!diagram] Дерево маршрутів із двома root layouts
> ```yaml
> layout: tree
> nodes:
>   - { id: app, label: "app/", text: "без layout.tsx", note: "у URL нічого", tone: gray, icon: "px:folder" }
>   - { id: mk, label: "(marketing)/layout.tsx", text: "root layout №1", note: "свої <html> і <body>", parent: app, tone: blue }
>   - { id: home, label: "(marketing)/page.tsx", text: "/", parent: mk, tone: blue }
>   - { id: pricing, label: "pricing/page.tsx", text: "/pricing", parent: mk, tone: blue }
>   - { id: ap, label: "(app)/layout.tsx", text: "root layout №2", note: "свої <html> і <body>", parent: app, tone: violet }
>   - { id: dl, label: "dashboard/layout.tsx", text: "оболонка кабінету", parent: ap, tone: violet }
>   - { id: dt, label: "dashboard/template.tsx", text: "новий key на кожну дитину", parent: dl, tone: orange }
>   - { id: dp, label: "dashboard/page.tsx", text: "/dashboard", parent: dt, tone: violet }
>   - { id: ds, label: "settings/page.tsx", text: "/dashboard/settings", parent: dt, tone: violet }
> steps:
>   - { show: app, note: "У корені app/ немає layout.tsx. Це дозволено, якщо кожна сторінка має root layout нижче." }
>   - { show: [mk, home, pricing], note: "Група (marketing) не потрапляє в URL: її сторінки — це / і /pricing. Її layout — перший layout на шляху, тобто root layout, і він містить <html> і <body>." }
>   - { show: [ap, dl], note: "Друга група — (app). Її layout теж root layout зі своїми <html> і <body>, а dashboard/layout.tsx — звичайний вкладений layout." }
>   - { show: [dt, dp, ds], note: "Template стоїть між layout і сторінками кабінету. Його key — дочірній сегмент, тож перехід між /dashboard і /dashboard/settings створює новий екземпляр." }
>   - { focus: [mk, ap], note: "Два root layouts — два окремі «документи». Перехід між ними — повне перезавантаження сторінки." }
> ```
> Дужки — для людей і для layouts; URL складається лише з папок без дужок.

Групу можна вкласти в групу: `app/(app)/(admin)/users/page.tsx` — це `/users`. А для intercepting routes (тема 05) групи не рахуються як сегменти: `(..)` відлічує сегменти URL, а не папки.

**Конфлікт адрес.** Дві сторінки в різних групах не можуть давати той самий URL. Додамо `app/(shop)/pricing/page.tsx` поруч із `app/(marketing)/pricing/page.tsx`, і `next build` (так само `next dev` при запиті) зупиняється:

```text
Error: Turbopack build failed with 1 error:
./app/(shop)
Error: You cannot have two parallel pages that resolve to the same path. Please check /(marketing)/pricing and /(shop).
```

Повідомлення трохи плутає: називає другу групу без `/pricing` і каже «parallel pages», хоча паралельних маршрутів тут немає. Читай його як «дві сторінки на одну адресу». Та сама помилка буде для `app/pricing/page.tsx` проти `app/(marketing)/pricing/page.tsx` і для вкладених груп.

> [!warning] Конфлікт на `/` збірка не ловить
> [Route Groups → Caveats](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups#caveats) каже, що сторінки з різних груп на одній адресі «cause an error». На 16.3.8 для головної це не так: `app/page.tsx` поруч із `app/(marketing)/page.tsx` проходить `next build` без помилки, і на `/` відкривається `app/page.tsx`. Якщо над нею немає layout, `next dev` лише скаржиться на `Missing <html> and <body> tags in the root layout`. Сторінка з групи тихо зникає з сайту — перевіряй дерево сам (задача 3 нижче).

> [!quiz] Перевір себе: обери правдиві твердження про route groups
> level: junior · type: multi · id: nextjs-core-02-quiz-05
> - [x] `app/(shop)/cart/page.tsx` відкривається за адресою `/cart`
> - [x] Група дозволяє дати layout лише частині маршрутів верхнього рівня
> - [ ] `(admin)` у назві папки обмежує доступ до сторінок для неадмінів
> - [x] `app/(a)/about/page.tsx` і `app/(b)/about/page.tsx` зупиняють збірку
> - [ ] Перехід між двома сторінками з різних груп завжди перезавантажує сторінку
> - [ ] Групи рахуються як сегменти для `(..)` в intercepting routes
>
> **Пояснення:** група — лише організація файлів, тож URL і доступ вона не змінює: `(admin)` не захищає нічого, перевірка доступу — біля даних. Повне перезавантаження буває тільки між **різними root layouts**, а не між будь-якими групами: якщо обидві групи під спільним `app/layout.tsx`, навігація звичайна. `(..)` відлічує сегменти URL.

### 🏘️ Кілька root layouts

**Root layout** — найвищий layout на шляху сторінки, і саме він рендерить `<html>` і `<body>`. Зазвичай це `app/layout.tsx`. Прибери його, і root layout стане перший layout нижче — так у кожній групі може бути власний:

```tsx
// app/(marketing)/layout.tsx — root layout №1: публічний сайт
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { template: '%s | Acme', default: 'Acme' },
  description: 'Acme — сервіс для команд',
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <header>
          <Link href="/">Acme</Link> · <Link href="/pricing">Ціни</Link> · <Link href="/dashboard">Кабінет</Link>
        </header>
        {children}
      </body>
    </html>
  )
}
```

```tsx
// app/(app)/layout.tsx — root layout №2: застосунок для залогінених
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { template: '%s · Кабінет Acme', default: 'Кабінет Acme' },
  robots: { index: false },
}

export default function AppRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="app">{children}</body>
    </html>
  )
}
```

Тепер у публічного сайту й кабінету різні шрифти, стилі, провайдери, `robots` і шаблон заголовка, і жодне не тягне зайвого в іншу половину. Ціна одна, і її треба знати: **перехід між різними root layouts — повне завантаження сторінки**, а не клієнтська навігація. `<Link href="/dashboard">` з `/pricing` виглядає як звичайне посилання, але браузер робить новий запит документа. На 16.3.8 це легко побачити: постав `window.__marker` у консолі й клікни посилання в кабінет — після переходу маркера немає (`performance.getEntriesByType('navigation')[0].type` — `navigate`). Перехід `/pricing` → `/` у межах `(marketing)` маркер зберігає.

Що втрачається на такому переході:

- **весь клієнтський стан**: контексти, сторі, незбережені форми, Activity-кеш маршрутів;
- **«безшовність»**: браузер знову завантажує HTML і JS, екран блимає, а провайдери ініціалізуються наново.

Тому кілька root layouts ставлять на межі, яку користувач перетинає рідко: лендинг ↔ застосунок, сайт ↔ адмінка, мовні версії з різною розміткою. Між екранами одного продукту — ніколи.

> [!diagram] Навігація всередині root layout і між root layouts
> ```yaml
> layout: compare
> columns: { same: "/dashboard → /dashboard/settings", cross: "/dashboard → /pricing" }
> nodes:
>   - { id: s1, col: same, label: "(app)/layout.tsx", text: "лишається", note: "той самий <html>, той самий документ", tone: green, icon: "px:check" }
>   - { id: s2, col: same, label: "dashboard/layout.tsx", text: "лишається", note: "стан, ефекти, DOM — без змін", tone: green }
>   - { id: s3, col: same, label: "dashboard/template.tsx", text: "новий екземпляр", note: "key змінився: settings", tone: orange, icon: "px:repeat" }
>   - { id: s4, col: same, label: "settings/page.tsx", text: "RSC payload з сервера", note: "лише змінений сегмент", tone: blue }
>   - { id: c1, col: cross, label: "root layout", text: "(app) → (marketing)", note: "різні <html>", tone: red, icon: "px:warning" }
>   - { id: c2, col: cross, label: "браузер", text: "новий запит документа", note: "як після введення URL", tone: red }
>   - { id: c3, col: cross, label: "клієнтський стан", text: "втрачено", note: "контексти, форми, Activity", tone: red }
>   - { id: c4, col: cross, label: "(marketing)/layout.tsx", text: "монтується з нуля", note: "HTML + hydration", tone: blue }
> steps:
>   - { show: [s1, c1], note: "Спершу Next.js порівнює root layouts. Ліворуч він спільний, праворуч — різний." }
>   - { show: [s2, c2], note: "Ліворуч спільні сегменти лишаються як є. Праворуч клієнтська навігація неможлива: браузер завантажує документ наново." }
>   - { show: [s3, c3], note: "Ліворуч template отримав новий key і змонтувався заново. Праворуч зник увесь клієнтський стан." }
>   - { show: [s4, c4], note: "Ліворуч з сервера прийшов лише сегмент settings. Праворуч — повний HTML нового root layout і hydration з нуля." }
> ```
> Повне перезавантаження — властивість пари root layouts, а не route groups як таких.

Ще кілька наслідків кількох root layouts:

- **Головна має бути в якійсь групі** (`app/(marketing)/page.tsx`), бо без `app/layout.tsx` сторінка в корені `app/` лишиться без `<html>` (і див. попереднє застереження про тихий конфлікт на `/`).
- **Глобальна 404.** Неіснуючий URL не належить жодній групі, тож `app/not-found.tsx` нема в що загорнути. На 16.3.8 без нього Next.js віддає вбудовану сторінку `404: This page could not be found.` Для власної є `app/global-not-found.tsx`, він потребує `experimental.globalNotFound` і повністю рендерить власні `<html>` і `<body>` (тема 13).
- **Root layout під динамічним сегментом** — `app/[lang]/layout.tsx` для мовних версій. Сегменти над root layout називаються root params і читаються через `next/root-params` (тема 34).

> [!quiz] Перевір себе: склади дерево, яке React рендерить для /dashboard/settings
> level: junior · type: order · id: nextjs-core-02-quiz-06
>
> Дерево з діаграми вище: `(app)/layout.tsx`, у `dashboard/` — `layout.tsx`, `template.tsx` і `loading.tsx`, сторінка — `dashboard/settings/page.tsx`. Склади, як Next.js вкладає ці файли один в одного (спрощено, без error boundary). Один рядок зайвий.
>
> ```tsx order
> <AppRootLayout>
>   <DashboardLayout>
>     <DashboardTemplate key="settings">
>       <Suspense fallback={<Loading />}>
>         <SettingsPage />
>       </Suspense>
>     </DashboardTemplate>
>   </DashboardLayout>
> </AppRootLayout>
> <MarketingLayout> // ✗
> ```
>
> **Пояснення:** порядок у сегменті — `layout → template → error → loading → page`, тож template стоїть одразу під layout, а `<Suspense>` з `loading.tsx` — під template і накриває лише дочірній сегмент. `key` template — дочірній сегмент `settings`. `MarketingLayout` — root layout іншої групи, у цьому маршруті його немає взагалі.

### ⏳ layout і loading: хто кого обгортає

`loading.tsx` — це `<Suspense>` навколо сторінки, і в ієрархії він стоїть **під** layout свого сегмента. Наслідок: `loading.tsx` закриває очікування сторінки й вкладених сегментів, але **не** даних, які чекає сам layout. На 16.3.8 з `cacheComponents: true` це видно ще на збірці. Ось layout, що читає сесію прямо в тілі:

```tsx
// app/(app)/dashboard/layout.tsx — ❌ cookies() прямо в layout, без <Suspense>
import { getCurrentUser } from '@/lib/user'

export default async function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  const user = await getCurrentUser()
  return (
    <div className="shell">
      <aside>{user ? `Привіт, ${user.name}` : 'Гість'}</aside>
      <main>{children}</main>
    </div>
  )
}
```

`loading.tsx` у тій самій папці не допомагає, і `next build` зупиняється:

```text
Error: Route "/dashboard/settings": Next.js encountered uncached or runtime data during prerendering.
`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.
```

Без Cache Components помилки не було б, зате навігація в кабінет **блокувалась** би, поки layout не дорендериться, і `loading.tsx` не показався б. Виправлень два, і обидва вже є у прикладі вище:

1. **Загорнути в `<Suspense>` лише шматок layout, що чекає даних**, як `<UserMenu />` у `DashboardLayout`. Оболонка пререндериться в static shell і зʼявляється миттєво, а імʼя користувача підтягується стрімінгом.
2. **Перенести повільні дані з layout у `page.tsx`**, де їх накриє `loading.tsx`.

У продакшн-збірці, поки сторінка кабінету чекала `getCurrentUser()`, у `<main>` стояв текст з `loading.tsx` («Завантажуємо…»), а бічна панель layout і кнопка template вже були на екрані: fallback замінює лише те, що під ним. Детально про межі `<Suspense>` і static shell — у [[Next.js - 11. Streaming і Suspense|темі 11]] і [[Next.js - 12. Partial Prerendering і Cache Components|темі 12]].

> [!quiz] Перевір себе: чому не допоміг loading.tsx?
> level: junior · id: nextjs-core-02-quiz-07
>
> `app/(app)/dashboard/layout.tsx` робить `await cookies()` у тілі. Поруч лежить `loading.tsx`. Збірка з `cacheComponents: true` падає з «encountered uncached or runtime data during prerendering». Чому?
>
> - [ ] `loading.tsx` працює лише в `next dev`
> - [x] `loading.tsx` обгортає сторінку під layout, а не сам layout, тож доступ до `cookies()` лишився поза `<Suspense>`
> - [ ] `cookies()` заборонено в layouts, лише в сторінках
> - [ ] `loading.tsx` має бути Client Component
>
> **Пояснення:** ієрархія сегмента — `layout → template → error → loading → page`. Межа `loading` нижча за layout, тож не може показати fallback замість нього. `cookies()` у layout дозволено, але під Cache Components — всередині власного `<Suspense>`, або дані переносять у сторінку.

### 🏷️ Metadata з кількох layouts

Кожен layout і сторінка можуть експортувати `metadata`. Next.js обходить сегменти від root layout до сторінки й **поверхнево** зливає обʼєкти: глибше значення ключа перекриває попереднє цілком. Це видно на вкладених полях: `openGraph` сторінки замінить `openGraph` layout повністю, а не доповнить. Для `title` є шаблони:

- `title: { template: '%s | Acme', default: 'Acme' }` — `template` діє на **дочірні** сегменти, `default` — заголовок для тих, хто свого не задав. Сам `{ template }` без `default` (чи `absolute`) TypeScript не пропустить: `Type '{ template: string; }' is not assignable to type 'string | TemplateString | null | undefined'`.
- `title: { absolute: 'Умови використання' }` — ігнорує шаблон батьків.
- `title: 'Ціни'` — звичайний рядок, до нього застосовується шаблон найближчого батька.

Що дає 16.3.8 (`<title>` у відповіді `curl`, кореневий шаблон — `'%s | Acme'` у `(marketing)/layout.tsx`):

| Сторінка | Що задано нижче root layout | `<title>` |
|---|---|---|
| `/pricing` | сторінка: `'Ціни'` | `Ціни \| Acme` |
| `/` | сторінка `(marketing)/page.tsx`: `'Головна'` | `Головна` |
| `/legal` | сторінка: `{ absolute: 'Умови використання' }` | `Умови використання` |
| `/docs` | `docs/layout`: `{ template: '%s — Docs', default: 'Документація' }`, сторінка — нічого | `Документація \| Acme` |
| `/docs/intro` | те саме + сторінка: `'Вступ'` | `Вступ — Docs` |
| `/guides/a` | `guides/layout`: лише `description`; сторінка: `'A'` | `A \| Acme` |
| `/blog/post` | `blog/layout`: `'Блог'` (рядок); сторінка: `'Пост'` | `Пост` |
| `/dashboard` | шаблон `(app)/layout`: `'%s · Кабінет Acme'`; сторінка: `'Огляд'` | `Огляд · Кабінет Acme` |

Три неочевидні рядки:

1. **`/` — без шаблону.** Шаблон layout не діє на сторінку **тієї самої папки**: `(marketing)/page.tsx` — дитина того ж сегмента, що й layout. Хочеш `Головна | Acme` — пиши повністю або дай сторінці `absolute`.
2. **Шаблони не накопичуються.** `/docs/intro` — це `Вступ — Docs`, а не `Вступ — Docs | Acme`: шаблон найближчого батька замінює попередній. Зате `default` самого `docs/layout` загорнувся в кореневий шаблон: `Документація | Acme`.
3. **Рядковий `title` у проміжному layout «вимикає» шаблон для нащадків.** `blog/layout` зі звичайним `'Блог'` дав `/blog` — `Блог | Acme`, але `/blog/post` — просто `Пост`. Layout без `title` (як `guides/layout`) шаблон пропускає далі. У документації це сказано між рядків: шаблон береться від найближчого батька, а рядковий `title` не має шаблону.

> [!diagram] Як збирається title для /docs/intro
> ```yaml
> layout: flow
> nodes:
>   - { id: root, label: "(marketing)/layout.tsx", code: "template: '%s | Acme'\ndefault: 'Acme'", tone: blue }
>   - { id: docs, label: "docs/layout.tsx", code: "template: '%s — Docs'\ndefault: 'Документація'", tone: violet }
>   - { id: page, label: "docs/intro/page.tsx", code: "title: 'Вступ'", tone: green }
>   - { id: out, label: "<title>", text: "?", tone: yellow, icon: "px:tag" }
> edges:
>   - { from: root, to: docs, label: "шаблон '%s | Acme'" }
>   - { from: docs, to: page, label: "шаблон '%s — Docs'" }
>   - { from: page, to: out, label: "результат" }
> steps:
>   - { focus: root, note: "Обхід починається з root layout. Його title — 'Acme', і він передає дітям шаблон '%s | Acme'." }
>   - { move: { from: root, to: docs, value: "'%s | Acme'" }, note: "docs/layout має власний default 'Документація' — шаблон батька загортає його: 'Документація | Acme'. Але далі він передає вже свій шаблон." }
>   - { move: { from: docs, to: page, value: "'%s — Docs'" }, note: "Шаблон '%s | Acme' зник: діти бачать лише шаблон найближчого батька." }
>   - { move: { from: page, to: out, value: "Вступ — Docs" }, set: { out: "Вступ — Docs" }, note: "Сторінка підставляє 'Вступ' у '%s — Docs'. Шаблони не накопичуються." }
> ```
> Кожен рівень бачить лише шаблон рівня над собою.

`generateMetadata`, `openGraph`, `metadataBase`, OG-картинки й те, як metadata стрімиться, — у темі 33. Тут досить правила злиття, бо воно найчастіше ламається саме через структуру layouts.

> [!quiz] Перевір себе: заповни metadata так, щоб вийшло «Ціни | Acme» і «Умови»
> level: junior · type: fill · bank: string, page · id: nextjs-core-02-quiz-08
>
> ```tsx fill
> // app/(marketing)/layout.tsx
> export const metadata: Metadata = {
>   title: { [[template]]: '%s | Acme', [[default]]: 'Acme' },
> }
>
> // app/(marketing)/pricing/page.tsx → <title>Ціни | Acme</title>
> export const metadata: Metadata = { title: 'Ціни' }
>
> // app/(marketing)/legal/page.tsx → <title>Умови</title>
> export const metadata: Metadata = { title: { [[absolute]]: 'Умови' } }
> ```
>
> **Пояснення:** `template` задає формат для дочірніх сегментів, а `default` обовʼязковий поруч із ним — це заголовок для сегментів без власного. `absolute` ігнорує шаблони батьків. `/pricing` лежить у дочірній папці, тому шаблон до нього застосовується.

> [!quiz] Який title отримає сторінка?
> level: middle · type: output · id: nextjs-core-02-quiz-09
>
> ```tsx
> // app/layout.tsx
> export const metadata = { title: { template: '%s | Shop', default: 'Shop' } }
>
> // app/catalog/layout.tsx
> export const metadata = { title: 'Каталог' }
>
> // app/catalog/shoes/page.tsx
> export const metadata = { title: 'Взуття' }
> ```
>
> Що буде в `<title>` на `/catalog/shoes`?
>
> - [ ] `Взуття | Shop`
> - [ ] `Взуття | Каталог | Shop`
> - [x] `Взуття`
> - [ ] `Каталог | Shop`
>
> **Пояснення:** шаблон береться лише від найближчого батька, а `catalog/layout` задав звичайний рядок без шаблону: його власний заголовок став `Каталог | Shop`, але дітям він шаблону не передав. Щоб отримати `Взуття | Shop`, прибери `title` з `catalog/layout` або дай йому `{ template: '%s | Shop', default: 'Каталог' }`.

### 📦 Дані в layout: застарілі значення і передача в page

**Layout не може передати дані сторінці через props.** `children` — уже відрендерена сторінка, а не компонент, якому можна додати `user={user}`. Тож коли і layout, і сторінці потрібен поточний користувач, обидва **запитують його самі**, а дедуплікацію бере на себе `React.cache`:

```ts
// lib/user.ts — поточний користувач; React.cache дедуплікує виклики в межах одного запиту
import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'

let calls = 0

export const getCurrentUser = cache(async () => {
  calls += 1
  console.log(`getCurrentUser() — справжній виклик #${calls}`)
  const session = (await cookies()).get('session')?.value
  // замість запиту до БД — дані в памʼяті
  return session ? { id: session, name: 'Оля' } : null
})
```

```tsx
// app/(app)/dashboard/user-menu.tsx
import { getCurrentUser } from '@/lib/user'

export async function UserMenu() {
  const user = await getCurrentUser()
  return <p>{user ? `Привіт, ${user.name}` : 'Гість'}</p>
}
```

```tsx
// app/(app)/dashboard/page.tsx → URL /dashboard
import type { Metadata } from 'next'
import { getCurrentUser } from '@/lib/user'

export const metadata: Metadata = { title: 'Огляд' }

export default async function DashboardPage() {
  const user = await getCurrentUser() // той самий виклик, що й в UserMenu, — без другого запиту
  return <h1>Огляд для {user?.name ?? 'гостя'}</h1>
}
```

На запит `/dashboard` з cookie `session` сервер написав рівно **один** рядок `getCurrentUser() — справжній виклик`, хоча функцію викликали і `UserMenu` у layout, і сторінка. `React.cache` памʼятає результат у межах **одного серверного запиту**. Між запитами кешу немає, тож дані одного користувача не потраплять іншому. `fetch` з однаковими URL і параметрами Next.js дедуплікує так само автоматично. Детально про дедуплікацію, водоспади й preload — у темі 14. Контекст тут не допоможе: Server Components його не читають.

**Застарілі дані.** Те, що layout не рендериться при навігації, стосується і його даних. Додай у `DashboardLayout` і в обидві сторінки маленький компонент, що після `await connection()` друкує час рендеру:

```tsx
// app/(app)/dashboard/rendered-at.tsx — коли сервер востаннє рендерив цей шматок
import { connection } from 'next/server'

export async function RenderedAt({ label }: { label: string }) {
  await connection() // дані часу запиту: рендер лише під час запиту
  const time = new Date().toISOString().slice(11, 23)
  console.log(`RenderedAt ${label} ${time}`)
  return <small data-testid={`at-${label}`}>{label}: {time}</small>
}
```

Перехід `/dashboard` → `/dashboard/settings` → `/dashboard`: у сторінок щоразу новий час, у layout — той самий (скажімо, `14:52:28.284`), що й при першому завантаженні. Тож лічильник непрочитаних повідомлень, баланс чи «онлайн-статус» у серверній частині layout **застигнуть** до перезавантаження сторінки, `router.refresh()` чи ревалідації (тема 16). Що з цим робити:

- дані, які мають бути свіжими на кожному екрані, клади в сторінку або в Client Component, що оновлює себе сам (опитування, підписка);
- у layout лишай те, що змінюється рідко: імʼя, аватар, план підписки;
- після мутації в Server Action оновлюй дані явно (`refresh()`, `updateTag()` — тема 16), а не чекай, що layout «перемалюється сам».

**Перевірка доступу в layout — не захист.** Найнебезпечніший наслідок partial rendering. Ось «гейт» у layout:

```tsx
// app/(app)/reports/layout.tsx — ❌ «захист» у layout
import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/user'

async function Gate({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) return <p>Увійди, щоб побачити звіти</p>
  return children
}

export default function ReportsLayout({ children }: LayoutProps<'/reports'>) {
  return (
    <Suspense fallback={<p>Перевіряємо доступ…</p>}>
      <Gate>{children}</Gate>
    </Suspense>
  )
}
```

```tsx
// app/(app)/reports/page.tsx — сторінка сама нічого не перевіряє
export default function ReportsPage() {
  return <h1>Виручка за квартал: 42 000 000 ₴</h1>
}
```

Гість на `/reports` бачить «Увійди, щоб побачити звіти». А тепер `curl localhost:3000/reports` без cookie: у вбудованому в HTML RSC payload лежить `"Виручка за квартал: 42 000 000 ₴"`. Сегменти рендерить **роутер**, а не layout: layout лише вирішує, куди вставити `children`, і не може скасувати рендер сторінки. До того ж при клієнтській навігації layout не перевіряється знову, тож перевірка в ньому не спрацює на кожен перехід. Документація ([Authentication → Layouts and auth checks](https://nextjs.org/docs/app/guides/authentication#layouts-and-auth-checks)) радить перевіряти доступ **біля даних**: у Data Access Layer, який викликають сторінка й кожен компонент, що читає захищені дані. Layout може показати аватар, але вирішувати, що віддати, має шар даних. Детально — у розділі «Auth і безпека».

> [!quiz] Перевір себе: як передати користувача з layout у сторінку?
> level: junior · id: nextjs-core-02-quiz-10
>
> `app/(app)/layout.tsx` уже отримав `user` з БД для шапки. Сторінці `/settings` теж потрібен `user`. Як зробити правильно?
>
> - [ ] Передати `<>{cloneElement(children, { user })}</>` у layout
> - [ ] Покласти `user` у React Context у layout і читати `useContext` у серверній сторінці
> - [x] Викликати в сторінці ту саму `getCurrentUser()`, обгорнуту в `React.cache`, — запит до БД буде один
> - [ ] Зберегти `user` у змінній модуля в layout і прочитати її в сторінці
>
> **Пояснення:** `children` — уже готовий результат, тож props йому не додаси. Server Components контекст не читають. Змінна модуля спільна для **всіх** запитів сервера, тож це шлях до витоку даних між користувачами. `React.cache` дедуплікує виклик у межах одного запиту.

> [!quiz] Що отримає гість?
> level: middle · type: output · id: nextjs-core-02-quiz-11
>
> `app/(app)/reports/layout.tsx` повертає `<p>Увійди</p>`, якщо користувача немає, інакше — `children`. `app/(app)/reports/page.tsx` статично рендерить `<h1>Виручка: 42 млн</h1>` і нічого не перевіряє. Гість робить `curl /reports`. Що буде у відповіді?
>
> - [ ] Лише «Увійди»: layout не відрендерив `children`, тож сторінки у відповіді немає
> - [x] На екрані — «Увійди», але «Виручка: 42 млн» лежить в RSC payload усередині HTML
> - [ ] Редирект 307 на сторінку входу
> - [ ] 403: Next.js бачить, що layout не рендерить `children`
>
> **Пояснення:** роутер рендерить сегмент сторінки незалежно від того, що layout зробить із `children`, і серіалізує результат у payload. Layout лише не вставив його в DOM. На 16.3.8 цей текст є у відповіді `curl`. Перевірка доступу має бути в шарі даних, який викликає сама сторінка.

### 🏭 Як це роблять у продакшні

- **`(marketing)` і `(app)` з різними root layouts.** Лендинг з легким JS, аналітикою й `robots: index`, застосунок — з провайдерами (колірна тема, клієнт запитів, тости), `robots: { index: false }` і своїм шаблоном заголовка. Межу перетинають раз за сесію, тож повне перезавантаження там не заважає.
- **Без зайвих root layouts.** Якщо дві зони мають однакову розмітку `<html>`, лиши спільний `app/layout.tsx`, а групам дай звичайні вкладені layouts: навігація між ними лишиться клієнтською.
- **Захищена група.** `(app)` — лише місце для оболонки. Доступ перевіряють у DAL (`verifySession()` у кожній функції даних), а `proxy.ts` (тема 06) робить швидкий оптимістичний редирект гостей на `/login`. Layout показує аватар, але нічого не охороняє.
- **Тонкі layouts.** Оболонка — статична й швидка, кожен шматок з даними запиту в окремому `<Suspense>`. Повільні дані — у сторінку під `loading.tsx`.
- **Активні посилання — клієнтський листок** з `usePathname()` і `aria-current`; layout лишається серверним.
- **Спільні дані — через `React.cache`-функції** в `lib/` з `import 'server-only'`, а не через props чи контекст.
- **Template — за потреби.** Анімація входу чи лог перегляду сторінки, і памʼятай про Activity. Для аналітики переглядів частіше беруть Client Component з `usePathname()` в root layout.
- **Шаблон заголовка в кожному root layout** і `absolute` для сторінок, де бренд не потрібен. Рядкові `title` у проміжних layouts — під підозрою на code review.
- **Лінт дерева маршрутів у CI.** Скрипт, що шукає конфлікти адрес між групами й зайві `app/page.tsx`, ловить те, що пропускає збірка (задача 3).

## ⚠️ Пастки

> [!pitfall] Свіжі дані в серверній частині layout
> Layout не рендериться при навігації, тож лічильник з БД показує значення з першого завантаження.
>
> ```tsx
> // ❌ app/(app)/layout.tsx
> const unread = await getUnreadCount() // застигне до перезавантаження
>
> // ✅ у сторінці або в клієнтському листку, що оновлює себе сам
> ```

> [!pitfall] Перевірка доступу в layout
> Сторінку рендерить роутер, а не layout: її вміст потрапить у RSC payload навіть тоді, коли layout показав «Увійди».
>
> ```tsx
> // ❌ layout: if (!user) return <Login />
> // ✅ сторінка й компоненти читають дані через DAL, що сам перевіряє сесію
> const report = await getQuarterReport() // усередині — verifySession()
> ```

> [!pitfall] Посилання між root layouts як звичайна навігація
> `<Link href="/dashboard">` з лендингу виглядає безневинно, але повністю перезавантажує сторінку: зникає стан, контексти, незбережені форми. Не розносити тісно повʼязані екрани по різних root layouts.

> [!pitfall] Сторінка в корені app/ поруч із групами
> Залишений після переїзду `app/page.tsx` тихо перекриває `app/(marketing)/page.tsx`: на 16.3.8 збірка не повідомляє про конфлікт, і на `/` зʼявляється стара сторінка без root layout.

> [!pitfall] Рядковий title у проміжному layout
> `title: 'Каталог'` у `catalog/layout.tsx` обриває шаблон `'%s | Shop'` для всіх сторінок каталогу.
>
> ```tsx
> // ❌ app/catalog/layout.tsx
> export const metadata = { title: 'Каталог' } // діти отримають просто 'Взуття'
> // ✅ передати шаблон далі
> export const metadata = { title: { template: '%s | Shop', default: 'Каталог' } }
> ```

> [!pitfall] Template замість key
> Template створює новий екземпляр усього піддерева сегмента, тобто й важких Client Components, а з Activity ще й не скидає стан нещодавно відвіданого маршруту. Щоб скинути одне поле, досить `key`.
>
> ```tsx
> <SearchBox key={slug} /> // новий екземпляр лише для цього компонента
> ```

## 🎤 На співбесіді

> [!interview] Чим layout відрізняється від template і коли потрібен template?
> level: junior · frequency: часто · id: nextjs-core-02-int-01
>
> ---
>
> Обидва обгортають сторінки сегмента через `children`. Layout зберігається між навігаціями дочірніх сторінок: стан, ефекти й DOM лишаються, а сам він не рендериться знову (partial rendering). Template отримує `key` дочірнього сегмента, тож при його зміні створюється новий екземпляр: стан скидається, ефекти перезапускаються, `<Suspense>` знову показує fallback. Template потрібен для анімацій входу, ефекту на кожну сторінку, скидання полів. Нюанс 16: з `cacheComponents` Activity зберігає до 3 маршрутів разом із видимим, тож при поверненні на відвіданий маршрут стан template відновлюється. Для надійного скидання беруть `key`, `useLayoutEffect` cleanup або `bfcacheId`.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🔁 template.tsx: новий екземпляр на кожну навігацію|Розділ: template]] · [Next.js: template.js](https://nextjs.org/docs/app/api-reference/file-conventions/template) · [Next.js: Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state)

> [!interview] Чому layout не отримує searchParams? Як тоді зробити активне меню чи фільтр в оболонці?
> level: junior · frequency: часто · id: nextjs-core-02-int-02
>
> ---
>
> Бо layout не рендериться при навігації: при зміні `?tab=` чи шляху оновлюється лише сторінка, і значення в layout застаріло б. Тому Next.js дає layout тільки `children`, `params` (зміна динамічного сегмента — це новий екземпляр, тож вони не застаріють) і слоти. Активне меню — Client Component з `usePathname()`, фільтр — `useSearchParams()` у клієнтському компоненті або `searchParams` у сторінці. Layout лишається серверним, клієнтським стає лише листок.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🙈 Чому layout не бачить searchParams і pathname|Розділ: searchParams і pathname]] · [Next.js: layout.js → Query params](https://nextjs.org/docs/app/api-reference/file-conventions/layout#query-params)

> [!interview] Навіщо route groups і кілька root layouts? Які в них підводні камені?
> level: middle · frequency: часто · id: nextjs-core-02-int-03
>
> ---
>
> Група `(name)` не входить в URL: нею організовують код за зонами й дають layout лише частині маршрутів. Якщо прибрати `app/layout.tsx`, layout кожної групи стає root layout зі своїми `<html>` і `<body>`: так розділяють лендинг і застосунок зі своїми стилями, провайдерами й metadata. Підводні камені: перехід між різними root layouts — повне перезавантаження сторінки; головна має жити в групі; дві групи на одну адресу ламають збірку, а залишений `app/page.tsx` на 16.3.8 тихо перекриває головну з групи; для глобальної 404 потрібен `global-not-found` (experimental).
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🏘️ Кілька root layouts|Розділ: кілька root layouts]] · [Next.js: Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) · [Next.js: layout.js → Root Layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout)

> [!interview] Чому перевірка сесії в layout — погана ідея? Де її робити?
> level: middle · frequency: часто · id: nextjs-core-02-int-04
>
> ---
>
> Дві причини. Перша — partial rendering: layout не рендериться при клієнтській навігації, тож сесію не перевірять на кожен перехід. Друга важливіша: сегменти рендерить роутер, і layout, який замість `children` показує «Увійди», не скасовує рендер сторінки — її вміст потрапляє в RSC payload. Перевіряти треба біля даних: Data Access Layer з `verifySession()`, який викликають сторінки й компоненти, плюс оптимістичний редирект у `proxy.ts`. Layout може отримати користувача для аватара, але не вирішує, що віддати.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#📦 Дані в layout: застарілі значення і передача в page|Розділ: дані в layout]] · [Next.js: Layouts and auth checks](https://nextjs.org/docs/app/guides/authentication#layouts-and-auth-checks)

> [!interview] Користувач просить показувати в шапці кабінету кількість непрочитаних повідомлень. Де і як ти це зробиш?
> level: senior · frequency: іноді · id: nextjs-core-02-int-05
>
> ---
>
> Не в серверному тілі layout: він не рендериться при навігації, і число застигне з першого завантаження. До того ж без `<Suspense>` під Cache Components це помилка збірки. Варіанти: Client Component у layout, що бере число з Route Handler і оновлює його опитуванням чи підпискою (SSE, WebSocket); або серверний компонент у `<Suspense>` для першого значення плюс клієнтське оновлення. Після дії «прочитати» — `refresh()` / `updateTag()` у Server Action. Дані беруться з DAL з перевіркою сесії, а не з props layout.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#📦 Дані в layout: застарілі значення і передача в page|Розділ: застарілі дані]] · [Next.js: layout.js → Interaction with loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout#interaction-with-loadingjs)

## 🔗 Звʼязки

- [[Next.js Start - 07. Сторінки й layouts]] — основи: `page`, root layout, вкладений layout, `metadata`.
- [[Next.js - 01. App Router, сегменти і спеціальні файли]] — сегменти й ієрархія `layout → template → error → loading → not-found → page`.
- [[Next.js - 04. Навігація під капотом]] — prefetch, client router cache, Activity і `bfcacheId`: що ще зберігається між переходами.
- [[Next.js - 05. Parallel і intercepting routes]] — слоти `@name` у props layout, чому групи не рахуються для `(..)`.
- [[Next.js - 07. Server і Client Components]] — чому `usePathname` — у клієнтському листку, а layout лишається серверним.
- [[Next.js - 11. Streaming і Suspense]] і [[Next.js - 12. Partial Prerendering і Cache Components]] — `<Suspense>` у layout і static shell.
- [[Next.js - 13. Помилки й межі помилок]] — `error.tsx` не ловить помилки layout свого сегмента; `global-not-found`.
- Далі в курсі: тема 14 — `React.cache` і дедуплікація, тема 33 — metadata і OG детально, розділ «Auth і безпека» — DAL.

## ⚡ Фішки

> [!reel] 🪆 Layout не рендериться при навігації
> Перехід між сторінками під одним layout міняє лише `children`: стан, ефекти й DOM layout лишаються, а його серверний код навіть не виконується знову.

> [!reel] 🔁 Template — це layout із key
> Next.js дає template `key` дочірнього сегмента. Змінився сегмент — новий екземпляр: стан з нуля, ефекти знову. Query-параметри ключ не змінюють.

> [!reel] 🏘️ Два root layouts — два документи
> Перехід між сторінками з різними root layouts — повне перезавантаження сторінки, навіть через `<Link>`. Клієнтський стан зникає повністю.

> [!reel] 🔐 Layout не охороняє сторінку
> Layout, що замість `children` показує «Увійди», не зупиняє рендер сторінки: її вміст однаково лежить в RSC payload. Доступ перевіряють біля даних.

> [!reel] 🏷️ Рядковий title обриває шаблон
> `title: 'Каталог'` у проміжному layout — і сторінки каталогу втрачають `'%s | Shop'`. Шаблон береться лише від найближчого батька.
>
> ```tsx
> export const metadata = { title: { template: '%s | Shop', default: 'Каталог' } }
> ```

> [!reel] 🙈 app/page.tsx тихо перекриває головну з групи
> На Next.js 16.3.8 `app/page.tsx` поруч із `app/(marketing)/page.tsx` не дає помилки збірки — на `/` просто відкривається перша.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що зберігає layout при навігації між його дочірніми сторінками?
> *дуже часто · теорія* · `nextjs-core-02-card-01`
>
> Усе: стан Client Components, DOM (фокус, прокрутка, відкриті `<details>`), а ефекти не перезапускаються. Сам серверний layout не рендериться знову — з сервера приходить лише змінений сегмент (partial rendering).
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🪆 Вкладені layouts: що живе між переходами|Розділ: вкладені layouts]] · [Next.js: Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

> [!question]- Що таке route group і як вона впливає на URL?
> *дуже часто · теорія* · `nextjs-core-02-card-02`
>
> Папка в дужках, `(marketing)`, для організації маршрутів і окремих layouts. В URL вона не потрапляє: `app/(marketing)/pricing/page.tsx` — це `/pricing`.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🗂️ Route groups: організація без впливу на URL|Розділ: route groups]] · [Next.js: Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)

> [!question]- Які props отримує layout?
> *часто · код* · `nextjs-core-02-card-03`
>
> `children`, `params` (Promise з динамічними сегментами від кореня до цього layout) і слоти паралельних маршрутів. `searchParams` і pathname — ні. Типізація — глобальний `LayoutProps<'/route'>`.
>
> ```tsx
> export default async function Layout({ children, params }: LayoutProps<'/dashboard/[team]'>) {
>   const { team } = await params
>   return <section data-team={team}>{children}</section>
> }
> ```
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🙈 Чому layout не бачить searchParams і pathname|Розділ: props layout]] · [Next.js: layout.js → Props](https://nextjs.org/docs/app/api-reference/file-conventions/layout#props)

> [!question]- Що станеться при переході між сторінками з різними root layouts?
> *часто · теорія* · `nextjs-core-02-card-04`
>
> Повне завантаження сторінки замість клієнтської навігації: браузер запитує документ наново, увесь клієнтський стан зникає. Стосується лише різних root layouts, а не будь-яких груп.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🏘️ Кілька root layouts|Розділ: кілька root layouts]] · [Next.js: Route Groups → Caveats](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups#caveats)

> [!question]- Як працюють title.template і title.default?
> *часто · код* · `nextjs-core-02-card-05`
>
> `template` (`'%s | Acme'`) діє на дочірні сегменти, `default` — заголовок для сегментів без власного і обовʼязковий поруч із шаблоном. Сторінка тієї самої папки шаблон не отримує. `absolute` ігнорує шаблони батьків.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🏷️ Metadata з кількох layouts|Розділ: metadata]] · [Next.js: generateMetadata → title](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title)

### 🟡 Middle

> [!question]- Коли template ремаунтиться, а коли ні?
> *часто · теорія* · `nextjs-core-02-card-06`
>
> Template ремаунтиться, коли змінюється сегмент безпосередньо під ним (включно з іншим значенням динамічного параметра). Не ремаунтиться, коли зміна глибше або змінилися лише query-параметри. З Cache Components повернення на маршрут, збережений Activity, відновлює і стан template.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🔁 template.tsx: новий екземпляр на кожну навігацію|Розділ: template]] · [Next.js: template.js → Behavior](https://nextjs.org/docs/app/api-reference/file-conventions/template#behavior)

> [!question]- Чому loading.tsx не показує fallback, поки layout того самого сегмента чекає дані?
> *часто · теорія* · `nextjs-core-02-card-07`
>
> `loading.tsx` — `<Suspense>` під layout, він обгортає сторінку, а не layout. З `cacheComponents` `cookies()` у тілі layout без власного `<Suspense>` — помилка збірки; без Cache Components навігація блокується. Рішення: `<Suspense>` навколо шматка layout або дані — у сторінку.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#⏳ layout і loading: хто кого обгортає|Розділ: layout і loading]] · [Next.js: layout.js → Interaction with loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout#interaction-with-loadingjs)

> [!question]- Як і layout, і сторінці отримати поточного користувача без двох запитів до БД?
> *дуже часто · практика* · `nextjs-core-02-card-08`
>
> Обидва викликають ту саму функцію, обгорнуту в `React.cache` (або `fetch` з однаковими параметрами — він дедуплікується сам). Кеш живе в межах одного серверного запиту. Props з layout у сторінку не передаються: `children` — готовий результат.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#📦 Дані в layout: застарілі значення і передача в page|Розділ: дані в layout]] · [Next.js: layout.js → Fetching Data](https://nextjs.org/docs/app/api-reference/file-conventions/layout#fetching-data) · [React: cache](https://react.dev/reference/react/cache)

> [!question]- Що буде, якщо дві групи мають сторінку на ту саму адресу?
> *часто · код* · `nextjs-core-02-card-09`
>
> Збірка падає з `You cannot have two parallel pages that resolve to the same path. Please check /(marketing)/pricing and /(shop).` Виняток на 16.3.8: `app/page.tsx` проти `app/(group)/page.tsx` помилки не дає, і перша тихо перекриває другу.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🗂️ Route groups: організація без впливу на URL|Розділ: конфлікт адрес]] · [Next.js: Route Groups → Caveats](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups#caveats)

> [!question]- Як metadata з кількох layouts зливається в одну?
> *іноді · теорія* · `nextjs-core-02-card-10`
>
> Від root layout до сторінки, поверхнево: глибше значення ключа замінює попереднє цілком (`openGraph` сторінки замінить `openGraph` layout, не доповнить). Для `title` шаблон береться лише від найближчого батька; рядковий `title` у проміжному layout обриває шаблон для нащадків.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🏷️ Metadata з кількох layouts|Розділ: metadata]] · [Next.js: generateMetadata → Merging](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#merging)

### 🔴 Senior

> [!question]- Чому перевірка доступу в layout не захищає вміст сторінки?
> *часто · безпека* · `nextjs-core-02-card-11`
>
> Сегменти рендерить роутер. Layout, що повертає «Увійди» замість `children`, не скасовує рендер сторінки — її результат однаково серіалізується в RSC payload (на 16.3.8 видно у `curl`). Крім того, layout не перевіряється знову при клієнтській навігації. Перевірка — у DAL біля даних.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#📦 Дані в layout: застарілі значення і передача в page|Розділ: перевірка доступу]] · [Next.js: Layouts and auth checks](https://nextjs.org/docs/app/guides/authentication#layouts-and-auth-checks)

> [!question]- Що змінює Activity з cacheComponents у моделі «layout зберігає, template скидає»?
> *іноді · теорія* · `nextjs-core-02-card-12`
>
> Next.js зберігає до 3 маршрутів разом із видимим (приховані — `display: none`) замість розмонтування. Повернення на такий маршрут відновлює стан сторінки й template, а ефекти проходять cleanup при приховуванні й запускаються знову при показі. Template гарантує свіжий стан лише для маршруту, якого серед збережених немає.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🔁 template.tsx: новий екземпляр на кожну навігацію|Розділ: template і Activity]] · [Next.js: Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state)

> [!question]- Коли варто розділити застосунок на кілька root layouts, а коли ні?
> *іноді · архітектура* · `nextjs-core-02-card-13`
>
> Коли зони мають різну розмітку `<html>`, стилі, провайдери чи `robots` і користувач рідко ходить між ними: лендинг ↔ застосунок, сайт ↔ адмінка. Не варто між тісно повʼязаними екранами: кожен перехід — повне перезавантаження і втрата клієнтського стану. Для просто різних оболонок досить груп зі звичайними вкладеними layouts під спільним root.
>
> 📚 [[Next.js - 02. Layouts, templates і route groups#🏭 Як це роблять у продакшні|Розділ: продакшн]] · [Next.js: layout.js → Root Layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout)

## 🛠️ Практика

> [!task] Знайди конфлікти адрес між route groups
> level: junior · difficulty: easy · id: nextjs-core-02-task-01 · tags: route-groups, routing, lint
>
> Напиши `findUrlCollisions(files)` для лінтера дерева маршрутів. `files` — шляхи від кореня проєкту (`'app/(shop)/cart/page.tsx'`). Поверни масив `{ url, files }` для кожної адреси, на яку претендують **дві й більше** сторінки, відсортований за `url`; `files` — у порядку вхідного масиву.
>
> Правила:
>
> - сторінка — файл `page.tsx`, `page.ts`, `page.jsx` або `page.js`; решта файлів (`layout`, `template`, `loading`…) адрес не створює;
> - префікс `app/` і групи `(назва)` в URL не входять, групи можуть бути вкладені;
> - папка, що починається з `_` (private folder), не створює маршрутів: сторінки в ній ігноруй;
> - корінь — `'/'`; слотів `@name` і динамічних сегментів у цій задачі немає.
>
> Лінтер має ловити й конфлікт на `/`, який на 16.3.8 пропускає збірка.
>
> ```js
> findUrlCollisions(['app/(a)/about/page.tsx', 'app/(b)/about/page.tsx'])
> // → [{ url: '/about', files: ['app/(a)/about/page.tsx', 'app/(b)/about/page.tsx'] }]
> ```
>
> ```js starter
> function findUrlCollisions(files) {
>   // твій код
> }
> ```
>
> ```js tests
> test('без конфліктів повертає порожній масив', () => {
>   expect(findUrlCollisions([
>     'app/(marketing)/layout.tsx',
>     'app/(marketing)/page.tsx',
>     'app/(marketing)/pricing/page.tsx',
>     'app/(app)/layout.tsx',
>     'app/(app)/dashboard/page.tsx',
>   ])).toEqual([])
> })
>
> test('дві групи на одну адресу', () => {
>   expect(findUrlCollisions([
>     'app/(marketing)/pricing/page.tsx',
>     'app/(shop)/pricing/page.tsx',
>   ])).toEqual([{ url: '/pricing', files: ['app/(marketing)/pricing/page.tsx', 'app/(shop)/pricing/page.tsx'] }])
> })
>
> test('ловить конфлікт на корені, який пропускає збірка', () => {
>   expect(findUrlCollisions(['app/page.tsx', 'app/(marketing)/page.tsx'])).toEqual([
>     { url: '/', files: ['app/page.tsx', 'app/(marketing)/page.tsx'] },
>   ])
> })
>
> test('прибирає вкладені групи й рахує різні розширення', () => {
>   expect(findUrlCollisions([
>     'app/(app)/(admin)/users/page.js',
>     'app/(app)/users/page.tsx',
>     'app/(app)/users/layout.tsx',
>   ])).toEqual([{ url: '/users', files: ['app/(app)/(admin)/users/page.js', 'app/(app)/users/page.tsx'] }])
> })
>
> test('ігнорує не-сторінки й private folders', () => {
>   expect(findUrlCollisions([
>     'app/(a)/layout.tsx',
>     'app/(b)/layout.tsx',
>     'app/_drafts/page.tsx',
>     'app/page.tsx',
>     'app/(a)/docs/page-header.tsx',
>   ])).toEqual([])
> })
>
> test('сторінки всередині private folder не створюють адрес, навіть з групами', () => {
>   expect(findUrlCollisions(['app/_a/x/page.tsx', 'app/_a/(g)/x/page.tsx'])).toEqual([])
> })
>
> test('сортує результат за url', () => {
>   const result = findUrlCollisions([
>     'app/(x)/z/page.tsx', 'app/(y)/z/page.tsx',
>     'app/(x)/a/page.tsx', 'app/(y)/a/page.tsx',
>   ])
>   expect(result.map((r) => r.url)).toEqual(['/a', '/z'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Розбий шлях на сегменти: `split('/')`. Останній сегмент — імʼя файлу, перший — `app`. Перевір імʼя файлу регулярним виразом на кшталт `/^page\.(tsx|ts|jsx|js)$/`.
>
> > [!hint]- Підказка 2
> > З папок між `app` і файлом викинь ті, що в дужках, і пропусти файл, якщо якась папка починається з `_`. Збирай `Map<url, files[]>`, а наприкінці залиш записи з `files.length > 1`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function findUrlCollisions(files) {
> >   const byUrl = new Map()
> >   for (const file of files) {
> >     const parts = file.split('/')
> >     const name = parts.pop()
> >     if (!/^page\.(tsx|ts|jsx|js)$/.test(name)) continue
> >     const folders = parts.slice(1) // без 'app'
> >     if (folders.some((f) => f.startsWith('_'))) continue
> >     const urlParts = folders.filter((f) => !(f.startsWith('(') && f.endsWith(')')))
> >     const url = '/' + urlParts.join('/')
> >     if (!byUrl.has(url)) byUrl.set(url, [])
> >     byUrl.get(url).push(file)
> >   }
> >   return [...byUrl]
> >     .filter(([, list]) => list.length > 1)
> >     .map(([url, list]) => ({ url, files: list }))
> >     .sort((a, b) => (a.url < b.url ? -1 : a.url > b.url ? 1 : 0))
> > }
> > ```
> >
> > Справжній роутер ще враховує слоти `@name`, intercepting-папки й динамічні сегменти (`[id]` і `[slug]` на одному рівні — теж конфлікт). Такий скрипт у CI ловить і випадок `app/page.tsx` проти групи, який на 16.3.8 збірка не помічає.

> [!task] Що лишиться, а що змонтується заново
> level: middle · difficulty: medium · id: nextjs-core-02-task-02 · tags: layout, template, navigation
>
> Напиши `navigate(files, from, to)` — модель того, що React зробить з layouts і templates при клієнтському переході з URL `from` на URL `to`. `files` — шляхи файлів, як у задачі вище (лише `.tsx`, без динамічних сегментів). Поверни `{ fullReload, kept, fresh }`:
>
> - `kept` — файли `layout.tsx` і `template.tsx` маршруту `to`, чиї екземпляри **лишаються**; `fresh` — ті, що монтуються заново. Обидва масиви — від кореня до листка, у кожній папці спершу layout, потім template;
> - маршрут — ланцюжок папок від `app` до папки з `page.tsx`, чия адреса (без `app` і груп) дорівнює URL;
> - **root layout** — перший `layout.tsx` на ланцюжку. Якщо в `from` і `to` вони різні — `fullReload: true`, `kept` порожній, усе у `fresh`;
> - layout лишається, якщо його папка є в обох ланцюжках;
> - template лишається, якщо його папка є в обох ланцюжках **і** наступна папка після неї однакова (або обидва маршрути на ній закінчуються). Інакше він новий.
>
> Activity (повернення на нещодавно відвіданий маршрут) не моделюємо. Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts
> navigate(['app/layout.tsx', 'app/a/page.tsx', 'app/b/template.tsx', 'app/b/page.tsx'], '/a', '/b')
> // → { fullReload: false, kept: ['app/layout.tsx'], fresh: ['app/b/template.tsx'] }
> ```
>
> ```ts starter
> type NavResult = { fullReload: boolean; kept: string[]; fresh: string[] }
>
> function navigate(files: string[], from: string, to: string): NavResult {
>   // твій код
> }
> ```
>
> ```ts tests
> const shop = [
>   'app/(shop)/layout.tsx',
>   'app/(shop)/page.tsx',
>   'app/(shop)/cart/page.tsx',
>   'app/(shop)/account/layout.tsx',
>   'app/(shop)/account/template.tsx',
>   'app/(shop)/account/page.tsx',
>   'app/(shop)/account/orders/page.tsx',
>   'app/(shop)/account/settings/page.tsx',
>   'app/(marketing)/layout.tsx',
>   'app/(marketing)/blog/page.tsx',
> ]
>
> test('між сусідніми сторінками layouts лишаються, template — новий', () => {
>   expect(navigate(shop, '/account/orders', '/account/settings')).toEqual({
>     fullReload: false,
>     kept: ['app/(shop)/layout.tsx', 'app/(shop)/account/layout.tsx'],
>     fresh: ['app/(shop)/account/template.tsx'],
>   })
> })
>
> test('новий розділ: його layout і template монтуються вперше', () => {
>   expect(navigate(shop, '/cart', '/account/orders')).toEqual({
>     fullReload: false,
>     kept: ['app/(shop)/layout.tsx'],
>     fresh: ['app/(shop)/account/layout.tsx', 'app/(shop)/account/template.tsx'],
>   })
> })
>
> test('перехід зі сторінки сегмента вглиб теж ремаунтить template', () => {
>   expect(navigate(shop, '/account', '/account/orders')).toEqual({
>     fullReload: false,
>     kept: ['app/(shop)/layout.tsx', 'app/(shop)/account/layout.tsx'],
>     fresh: ['app/(shop)/account/template.tsx'],
>   })
> })
>
> test('різні root layouts — повне перезавантаження', () => {
>   expect(navigate(shop, '/cart', '/blog')).toEqual({
>     fullReload: true,
>     kept: [],
>     fresh: ['app/(marketing)/layout.tsx'],
>   })
> })
>
> test('template вище не ремаунтиться, якщо зміна глибше', () => {
>   const files = [...shop, 'app/(shop)/template.tsx']
>   expect(navigate(files, '/account/orders', '/account/settings')).toEqual({
>     fullReload: false,
>     kept: ['app/(shop)/layout.tsx', 'app/(shop)/template.tsx', 'app/(shop)/account/layout.tsx'],
>     fresh: ['app/(shop)/account/template.tsx'],
>   })
> })
>
> test('template групи ремаунтиться, коли змінюється перший сегмент', () => {
>   const files = [...shop, 'app/(shop)/template.tsx']
>   expect(navigate(files, '/', '/cart')).toEqual({
>     fullReload: false,
>     kept: ['app/(shop)/layout.tsx'],
>     fresh: ['app/(shop)/template.tsx'],
>   })
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу знайди папку сторінки: для кожного `…/page.tsx` прибери `app` і групи й порівняй з URL. Потім збери ланцюжок префіксів: `'app'`, `'app/(shop)'`, `'app/(shop)/cart'`.
>
> > [!hint]- Підказка 2
> > Для template у папці `f` порівняй «наступну папку» в обох ланцюжках: `chain[chain.indexOf(f) + 1]`. `undefined === undefined` — обидва маршрути закінчуються тут.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type NavResult = { fullReload: boolean; kept: string[]; fresh: string[] }
> >
> > function navigate(files: string[], from: string, to: string): NavResult {
> >   const has = (path: string) => files.includes(path)
> >   const toUrl = (folder: string) =>
> >     '/' + folder.split('/').slice(1).filter((s) => !/^\(.*\)$/.test(s)).join('/')
> >
> >   function chainFor(url: string): string[] {
> >     const page = files.find((f) => f.endsWith('/page.tsx') && toUrl(f.slice(0, -'/page.tsx'.length)) === url)
> >     if (!page) throw new Error(`Немає сторінки для ${url}`)
> >     const parts = page.split('/').slice(0, -1)
> >     return parts.map((_, i) => parts.slice(0, i + 1).join('/'))
> >   }
> >
> >   const a = chainFor(from)
> >   const b = chainFor(to)
> >   const rootLayout = (chain: string[]) => chain.find((f) => has(`${f}/layout.tsx`))
> >   const fullReload = rootLayout(a) !== rootLayout(b)
> >
> >   const kept: string[] = []
> >   const fresh: string[] = []
> >   b.forEach((folder, i) => {
> >     const inBoth = !fullReload && a.includes(folder)
> >     if (has(`${folder}/layout.tsx`)) {
> >       (inBoth ? kept : fresh).push(`${folder}/layout.tsx`)
> >     }
> >     if (has(`${folder}/template.tsx`)) {
> >       const sameChild = a[a.indexOf(folder) + 1] === b[i + 1]
> >       ;(inBoth && sameChild ? kept : fresh).push(`${folder}/template.tsx`)
> >     }
> >   })
> >   return { fullReload, kept, fresh }
> > }
> > ```
> >
> > Модель повторює два механізми: partial rendering (спільні сегменти лишаються) і `key` template (дочірній сегмент його рівня). У справжньому Next.js 16 з Cache Components є третій: Activity повертає приховані екземпляри для нещодавно відвіданих маршрутів, тож «новий» template при поверненні може виявитися старим.

> [!task] Збери title з вкладених layouts
> level: middle · difficulty: medium · id: nextjs-core-02-task-03 · tags: metadata, title, layout
>
> Напиши `resolveTitle(layouts, page)` за правилами Next.js 16.3.8. `layouts` — значення `metadata.title` layouts від root до папки сторінки, **останній елемент — layout тієї самої папки, що й сторінка** (`undefined`, якщо layout немає або він не задає `title`). `page` — `title` сторінки або `undefined`. Поверни підсумковий `<title>` (`''`, якщо заголовка немає ніде).
>
> `title` буває трьох видів: рядок, `{ default, template }` і `{ absolute, template? }`. Правила (так поводиться 16.3.8):
>
> - шаблон `%s` замінюється на заголовок (усі входження);
> - рядок і `default` загортаються в шаблон **батька**; `absolute` — ні;
> - нащадки бачать шаблон лише найближчого layout, що задав `title`: рядок шаблону не передає, `{ absolute }` без `template` — теж;
> - шаблон layout **не** діє на сторінку тієї самої папки (тобто на сторінку діє шаблон layouts до передостаннього включно);
> - якщо сторінка не задала `title`, вона отримує підсумковий заголовок найближчого layout.
>
> ```ts
> resolveTitle([{ template: '%s | Acme', default: 'Acme' }, undefined], 'Ціни') // → 'Ціни | Acme'
> ```
>
> ```ts starter
> type Title = string | { default: string; template: string } | { absolute: string; template?: string }
>
> function resolveTitle(layouts: (Title | undefined)[], page?: Title): string {
>   // твій код
> }
> ```
>
> ```ts tests
> const root: Title = { template: '%s | Acme', default: 'Acme' }
>
> test('шаблон root layout загортає title сторінки з дочірньої папки', () => {
>   expect(resolveTitle([root, undefined], 'Ціни')).toBe('Ціни | Acme')
> })
>
> test('шаблон не діє на сторінку тієї самої папки', () => {
>   expect(resolveTitle([root], 'Головна')).toBe('Головна')
> })
>
> test('absolute ігнорує шаблон', () => {
>   expect(resolveTitle([root, undefined], { absolute: 'Умови використання' })).toBe('Умови використання')
> })
>
> test('шаблони не накопичуються, а default вкладеного layout загортається в шаблон батька', () => {
>   const docs: Title = { template: '%s — Docs', default: 'Документація' }
>   expect(resolveTitle([root, docs, undefined], 'Вступ')).toBe('Вступ — Docs')
>   expect(resolveTitle([root, docs], undefined)).toBe('Документація | Acme')
> })
>
> test('layout без title пропускає шаблон, а рядковий title його обриває', () => {
>   expect(resolveTitle([root, undefined, undefined], 'A')).toBe('A | Acme')
>   expect(resolveTitle([root, 'Блог', undefined], 'Пост')).toBe('Пост')
>   expect(resolveTitle([root, 'Блог'], undefined)).toBe('Блог | Acme')
> })
>
> test('absolute з template у layout і порожній результат', () => {
>   const shop: Title = { absolute: 'Магазин', template: '%s — Магазин' }
>   expect(resolveTitle([root, shop, undefined], 'X')).toBe('X — Магазин')
>   expect(resolveTitle([undefined], undefined)).toBe('')
> })
> ```
>
> > [!hint]- Підказка 1
> > Пройди всі елементи `[...layouts, page]` по черзі, тримаючи два значення: поточний заголовок і «шаблон для наступних». `undefined` нічого не змінює.
>
> > [!hint]- Підказка 2
> > Шаблон для наступних оновлюй після кожного елемента, **крім** двох останніх (layout папки сторінки й сама сторінка): вони обидва бачать шаблон рівня вище.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Title = string | { default: string; template: string } | { absolute: string; template?: string }
> >
> > function resolveTitle(layouts: (Title | undefined)[], page?: Title): string {
> >   const apply = (template: string | null, s: string) => (template ? template.replace(/%s/g, s) : s)
> >   let value = ''
> >   let template: string | null = null // шаблон поточного елемента
> >   let parentTemplate: string | null = null // що бачать наступні
> >
> >   const items = [...layouts, page]
> >   items.forEach((title, i) => {
> >     if (title !== undefined) {
> >       if (typeof title === 'string') {
> >         value = apply(parentTemplate, title)
> >         template = null
> >       } else if ('absolute' in title) {
> >         value = title.absolute
> >         template = title.template ?? null
> >       } else {
> >         value = apply(parentTemplate, title.default)
> >         template = title.template
> >       }
> >     }
> >     if (i < items.length - 2) parentTemplate = template
> >   })
> >   return value
> > }
> > ```
> >
> > Так влаштований цикл `accumulateMetadata` у Next.js: після кожного сегмента він запамʼятовує шаблон, крім layout і сторінки останнього рівня. Звідси дві пастки: шаблон не діє на сторінку тієї самої папки, а рядковий `title` у проміжному layout обриває шаблон для нащадків.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) — офіційний старт: вкладені layouts, root layout.
- 🟡 [Next.js — layout.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout) — props, root layout, чому немає `searchParams` і pathname, взаємодія з `loading.js`, дані.
- 🟡 [Next.js — template.js](https://nextjs.org/docs/app/api-reference/file-conventions/template) — ключ template і покрокові приклади ремаунтів.
- 🟡 [Next.js — Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) — групи, кілька root layouts, конфлікти адрес.
- 🟡 [Next.js — Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state) — Activity з Cache Components: що зберігається і як скидати.
- 🟡 [Next.js — generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title) — `title.template`, `default`, `absolute`, порядок і злиття.
- 🔴 [Next.js — Authentication: Layouts and auth checks](https://nextjs.org/docs/app/guides/authentication#layouts-and-auth-checks) — чому перевірки в layout недостатньо.
- 🔴 [React — cache](https://react.dev/reference/react/cache) — дедуплікація серверних викликів у межах запиту.
- 🔴 [React — Activity](https://react.dev/reference/react/Activity) — як React ховає піддерево, зберігаючи стан.
- 🛠️ [Next.js — Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) — ієрархія спеціальних файлів і організація проєкту.

> [!important] Підсумок
> - Layout зберігається між навігаціями дочірніх сторінок: стан, ефекти й DOM лишаються, а сам він не рендериться знову. Тому він не отримує `searchParams` і pathname — їх читають сторінка або Client Component.
> - Template отримує `key` дочірнього сегмента й монтується заново при його зміні. З `cacheComponents` Activity відновлює і його стан на нещодавно відвіданому маршруті.
> - Route group `(name)` не входить в URL. Без `app/layout.tsx` кожна група може мати свій root layout, але перехід між різними root layouts — повне перезавантаження сторінки.
> - Metadata зливається від root до сторінки поверхнево. Шаблон `title` береться від найближчого батька й не діє на сторінку тієї самої папки.
> - Дані в серверній частині layout застигають до перезавантаження. Props у сторінку не передаються, тож використовують `React.cache`. Перевірка доступу в layout сторінку не захищає — перевіряють біля даних.
