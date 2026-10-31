---
title: Помилки й межі помилок
id: nextjs-core-13
slug: 13-errors
order: 13
level: middle
skill: rendering
icon: px:bandage
tags: [nextjs, errors, error-boundary, error-js, global-error, not-found, catch-error, forbidden, unstable-rethrow, hydration]
prerequisites: ["[[Next.js - 01. App Router, сегменти і спеціальні файли]]", "[[Next.js - 11. Streaming і Suspense]]"]
estimatedMinutes: 50
nextVersion: 16.3.8
---

# Помилки й межі помилок

> [!success] 🎯 Після цього розділу ти зможеш
> - розрізнити **очікувані** помилки (повертаються як значення) і **неочікувані** (кидаються й ловляться межею);
> - написати `error.tsx` з `retry()` і пояснити, чому `reset()` не відновлює помилку Server Component;
> - пояснити, що бачить користувач у продакшні (`Minified React error #441` + `digest`) і як знайти справжню помилку в логах;
> - для будь-якого місця в дереві сегментів сказати, яка межа зловить помилку чи `notFound()` і що лишиться на екрані;
> - поставити межу навколо окремого віджета через `catchError`, не зламавши `redirect()` і `notFound()`;
> - передбачити статус-код `notFound()` / `forbidden()` / `unauthorized()` до і після початку стріму;
> - не проковтнути службові винятки Next.js у `try/catch` (`unstable_rethrow`).

## 🤔 Передбач

> [!quiz] Що побачить користувач у продакшні?
> level: middle · type: output · id: nextjs-core-13-quiz-01
>
> `next build && next start`. Server Component на сторінці `/orders` кидає помилку, поруч лежить `app/orders/error.tsx`, який показує `error.message`:
>
> ```tsx
> // app/orders/page.tsx (фрагмент)
> async function Orders(): Promise<React.ReactNode> {
>   await connection()
>   throw new Error('DB connection failed: postgres://admin:hunter2@db')
> }
> ```
>
> ```tsx
> // app/orders/error.tsx (фрагмент)
> <p>{error.message}</p>
> ```
>
> - [ ] `DB connection failed: postgres://admin:hunter2@db`
> - [x] `Minified React error #441; visit https://react.dev/errors/441 …`, а поруч — числовий `error.digest`
> - [ ] Порожній рядок: у продакшні `error` дорівнює `undefined`
> - [ ] Вбудовану сторінку 500 замість `error.tsx`: у продакшні межі вимкнено
>
> **Пояснення:** не переймайся, якщо помилився, — розберемо нижче. Помилки Server Components у продакшні не передаються в браузер: замість тексту приходить лише `digest`, а React на клієнті підставляє мініфіковане повідомлення #441. Справжній текст (разом із паролем із рядка підключення) лишається в логах сервера під тим самим `digest`. У `next dev` ти побачив би оригінал.

## 🧒 Простими словами

Уяви ресторан, де щось пішло не так. Буває **очікувана** халепа: «борщ закінчився». Офіціант спокійно каже це гостю й пропонує інше — це звичайна відповідь, а не аварія. А буває **неочікувана**: на кухні спалахнула плита. Тут працює протипожежна система: заслінка зачиняє лише ту кухню, де горить (межа помилок), а зал і інші кухні працюють далі. Гостю не розповідають, яка саме проводка згоріла і де ключ від щитової, — йому дають номер інциденту (`digest`), а подробиці під цим номером пише в журнал черговий інженер (логи сервера). Кнопка «Спробувати ще» — це прохання до кухні приготувати страву **заново** (`retry`), а не просто ще раз принести ту саму обгорілу тарілку (`reset`).

## 🔬 Як це працює насправді

### 🧭 Два класи помилок

Документація Next.js ділить помилки на дві категорії, і від цього поділу залежить усе інше:

- **Очікувані** — частина нормальної роботи: невалідна форма, «такий email уже є», товар закінчився, зовнішній API відповів `404`. Їх **не кидають**, а моделюють як значення: Server Action повертає `{ ok: false, fieldErrors }`, Server Component рендерить повідомлення, а для відсутнього ресурсу викликає `notFound()`.
- **Неочікувані** (uncaught exceptions) — баги й аварії: впала БД, `undefined` замість масиву, таймаут сервісу. Їх **кидають** (або вони кидаються самі), а ловить найближча **error boundary** — межа помилок, React-компонент, що замість зламаного піддерева показує fallback.

Навіщо цей поділ. Якщо кидати очікувані помилки, кожна помилка валідації піде в монітор як аварія, а користувач замість підказки біля поля побачить «Щось пішло не так». Якщо ж ловити неочікувані й повертати як значення, ти сховаєш баг: сторінка «працює», але з порожніми даними, і ніхто не дізнається про проблему.

```ts
// app/signup/actions.ts — очікувані помилки як значення
'use server'

import { redirect } from 'next/navigation'

type SignupState = { ok: false; fieldErrors: Record<string, string[]> } | null

export async function signup(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const email = String(formData.get('email') ?? '')
  if (!email.includes('@')) {
    return { ok: false, fieldErrors: { email: ['Невалідний email'] } }
  }
  await createUser(email) // якщо впаде БД — це неочікувана помилка: хай летить до межі
  redirect('/signup/done')
}
```

```tsx
// app/signup/form.tsx
'use client'

import { useActionState } from 'react'
import { signup } from './actions'

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, null)
  return (
    <form action={action}>
      <input name="email" />
      {state && !state.ok && <p aria-live="polite">{state.fieldErrors.email?.join(', ')}</p>}
      <button disabled={pending}>Зареєструватися</button>
    </form>
  )
}
```

`useActionState` повертає результат останнього виклику дії як `state` — так помилка валідації доходить до форми без жодного винятку. Форми й Server Actions детально — у темах 21–22 основного посібника; тут важливо лише, що очікувана помилка — це **дані**.

> [!note] Чому в прикладах дані в памʼяті
> Приклади курсу зібрані з `cacheComponents: true`. Справжній запит до БД у сторінці зупинив би `next build` з `Next.js encountered uncached or runtime data during prerendering`: такі дані кешують (`'use cache'`) або обгортають у `<Suspense>` — про це в темах 11–12, 14–16. Тут `createUser` — заглушка в памʼяті, а «помилкові» компоненти викликають `await connection()` усередині `<Suspense>`, щоб падати під час запиту, а не під час збірки.

> [!quiz] Перевір себе: кинути чи повернути?
> level: middle · type: single · id: nextjs-core-13-quiz-02
>
> Server Action «Створити пост» перевіряє, що заголовок не порожній, і записує в БД. Як обробити порожній заголовок?
>
> - [x] Повернути `{ ok: false, fieldErrors: { title: ['Обовʼязкове поле'] } }` і показати біля поля через `useActionState`
> - [ ] `throw new Error('Title required')` — `error.tsx` покаже повідомлення користувачу
> - [ ] `notFound()` — Next.js сам поверне правильний статус
> - [ ] `try/catch` навколо всієї дії, а в `catch` — `return { ok: false }` для будь-якої помилки
>
> **Пояснення:** порожнє поле — нормальна ситуація, тож це значення. Виняток замінить форму на fallback межі, а в продакшні ще й без тексту (#441). `notFound()` — про відсутній ресурс, а не про валідацію. Загальний `catch` зробить очікуваною й падіння БД, і навіть `redirect()` — він теж працює через виняток (про це в [[#🪤 try/catch і службові винятки]]).

### 🧱 error.tsx: межа на рівні сегмента

`error.tsx` у папці сегмента обгортає його вміст у React error boundary. Нагадування з [[Next.js - 01. App Router, сегменти і спеціальні файли|теми 01]]: межа лежить **під** `layout` і `template` свого сегмента і **над** `loading`, `not-found` і `page`. Межі помилок у React бувають лише клієнтськими, тож файл мусить мати `'use client'` (інакше `next build` зупиняється з `app/error.tsx must be a Client Component`).

```tsx
// app/orders/error.tsx
'use client' // error boundary — завжди Client Component

import { useEffect } from 'react'

export default function OrdersError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    // тут — відправка в Sentry/LogRocket; на сервері помилку вже записано
    console.error(error)
  }, [error])

  return (
    <div role="alert">
      <h2>Не вдалося завантажити замовлення</h2>
      {error.digest && <p>Код помилки: {error.digest}</p>}
      <button onClick={() => retry()}>Спробувати ще</button>
    </div>
  )
}
```

Props на 16.3.8:

| Prop | Що це |
|---|---|
| `error` | екземпляр `Error`; `message` — оригінал для помилок Client Components, загальний текст для помилок Server Components у продакшні |
| `error.digest` | хеш помилки, яку кинули на сервері; за ним шукають запис у логах |
| `retry()` | **стабільний з 16.3**: перезапитує дані сегмента з сервера й перерендерює дочірнє дерево |
| `reset()` | лишився: просто скидає стан межі й перерендерює **без** перезапиту |

У 16.2 `retry` звався `unstable_retry`; старі туторіали показують лише `reset` — у 16.3 він другорядний. На 16.3.8 приходять обидва props — це видно з межі з двома кнопками нижче.

Межа ловить помилки **рендеру** в усьому, що під нею: Server Components (помилка приходить з сервера в RSC payload), Client Components (і під час серверного рендеру HTML, і в браузері) і вкладені layouts дочірніх сегментів. Решта сторінки — layouts вище межі з навігацією — лишається на екрані й працює. Тому `error.tsx` ставлять там, де є сенс у частковому відновленні: на рівні розділу (`dashboard/`, `orders/`), а не біля кожної сторінки.

Ще один прийом з документації: якщо межа вирішила, що це «не її» помилка, вона може просто кинути її далі — `throw error` у тілі компонента межі. Тоді помилку ловить **наступна межа вище**. На 16.3.8 так і є: `error.tsx`, що робить `throw error`, віддає помилку в `app/error.tsx`, і той рендериться всередині root layout.

### 🔁 retry проти reset

Різниця видно на «нестабільному» компоненті. Модульний лічильник змушує його падати на непарних спробах:

```tsx
// app/flaky/page.tsx
import { Suspense } from 'react'
import { connection } from 'next/server'

const g = globalThis as { __flaky?: number }

async function Rates(): Promise<React.ReactNode> {
  await connection()
  g.__flaky = (g.__flaky ?? 0) + 1
  if (g.__flaky % 2 === 1) throw new Error(`Rates API timeout (attempt ${g.__flaky})`)
  return <p>USD 41.2 (attempt {g.__flaky})</p>
}

export default function Page() {
  return (
    <main>
      <h1>Курси</h1>
      <Suspense fallback={<p>Завантаження…</p>}>
        <Rates />
      </Suspense>
    </main>
  )
}
```

```tsx
// app/flaky/error.tsx
'use client'

export default function FlakyError({
  error,
  retry,
  reset,
}: {
  error: Error & { digest?: string }
  retry: () => void
  reset: () => void
}) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={() => retry()}>retry</button>
      <button onClick={() => reset()}>reset</button>
    </div>
  )
}
```

Що відбувається на 16.3.8 (і в `next dev`, і в `next start`):

1. Перший захід — спроба 1, межа з помилкою.
2. Клік **reset** — та сама помилка, а лог сервера мовчить: запиту на сервер не було.
3. Клік **retry** — на сервері «спроба 2», на екрані `USD 41.2 (attempt 2)`, межа зникла.

Чому так. Помилка Server Component — це частина RSC payload, який браузер уже отримав. `reset()` лише очищає стан межі, і React рендерить **той самий** payload — з тією самою помилкою всередині. `retry()` у вихідному коді Next.js — це `startTransition(() => { router.refresh(); reset() })`: спершу новий запит за payload сегмента, потім скидання стану, усе в Transition, тож стан Client Components **поза** межею зберігається. `reset()` має сенс хіба для чисто клієнтських помилок, які можуть зникнути від повторного рендеру (наприклад, після зміни стану вище).

> [!quiz] Перевір себе: retry і reset
> level: middle · type: multi · id: nextjs-core-13-quiz-03
> - [x] `retry()` робить новий запит на сервер і перерендерює дерево під межею
> - [ ] `reset()` теж перезапитує сегмент, але без Transition
> - [x] Помилка Server Component не зникне після `reset()`: React рендерить той самий payload
> - [x] Стан Client Components поза межею після `retry()` зберігається
> - [ ] `retry` — експериментальний prop, у продакшні треба `reset`
> - [ ] Після `retry()` сторінка повністю перезавантажується, як `location.reload()`
>
> **Пояснення:** `retry` стабільний з 16.3 і всередині — `router.refresh()` у Transition: перезапит лише RSC payload без перезавантаження документа. `reset` лише скидає стан межі; серверна помилка сидить у вже отриманому payload, тож рендер повторить її.

> [!quiz] Перевір себе: склади, що відбувається після кліку «Спробувати ще»
> level: middle · type: order · id: nextjs-core-13-quiz-04
>
> ```order
> Користувач клікає кнопку, яка викликає retry()
> Next.js запускає Transition і робить router.refresh()
> Сервер заново рендерить Server Components і віддає новий RSC payload
> Межа скидає стан помилки й рендерить дочірнє дерево з нового payload
> Якщо помилки немає — fallback зникає; якщо знову є — межа показує її знову
> Браузер перезавантажує документ і заново робить hydration ✗
> ```
>
> **Пояснення:** `retry` = `router.refresh()` + скидання стану межі в одній Transition. Документ не перезавантажується, hydration не повторюється, а Client Components вище межі зберігають стан. Нова помилка просто знову потрапить у ту саму межу.

### 🔒 Що бачить користувач: dev, prod і digest

Помилка, кинута на сервері, може містити що завгодно: SQL, рядок підключення з паролем, внутрішні id. Тому Next.js у продакшні **не передає текст помилок Server Components у браузер**. Сторінка з 🤔 Передбач на 16.3.8:

| | `next dev` | `next build && next start` |
|---|---|---|
| `error.message` у `error.tsx` | `DB connection failed: postgres://admin:hunter2@db` | `Minified React error #441; visit https://react.dev/errors/441 for the full message or use the non-minified dev environment for full errors and additional helpful warnings.` |
| `error.digest` | є | є (наприклад, `2033829626`; значення залежить від збірки) |
| RSC payload у HTML | повідомлення і стек | лише `E{"digest":"2033829626"}` — пароля немає |
| Лог сервера | помилка зі стеком | `⨯ Error: DB connection failed: postgres://admin:hunter2@db` + `digest: '2033829626'` |

> [!warning] Документація обіцяє «generic message»
> [Довідник `error.js`](https://nextjs.org/docs/app/api-reference/file-conventions/error#errormessage) пише, що помилки Server Components показують «a generic message with an identifier». На 16.3.8 цей «загальний текст» — мініфікована помилка React `#441`, а ідентифікатор живе окремо в `error.digest`. Не показуй `error.message` користувачу як є — пиши власний текст і, за бажанням, `digest`.

`digest` — хеш, який сервер обчислює для кинутої помилки. Для однієї й тієї самої помилки він стабільний: на 16.3.8 три запити на `/orders` дали однаковий digest і в `error.tsx`, і в лозі, і в `onRequestError` (`2033829626` у таблиці — лише приклад, у кожній збірці своє значення). Тому на сторінці помилки корисно показати «Код помилки: …» — підтримка знайде запис у логах за секунди. У dev значення digest інше, ніж у prod, — порівнюй у межах одного середовища.

**Помилки Client Components** поводяться інакше. Client Component, що кидає під час рендеру, на сервері дає запис у лозі (з digest і `renderSource: 'server-rendering'`), але потім React у браузері рендерить його ще раз, помилка повторюється вже **на клієнті**, і межа отримує її напряму: в продакшні `error.message` — оригінальний `Client render failed: items is undefined`, а `error.digest` — `undefined`. Це логічно: код Client Component і так лежить у браузері, ховати нічого. Але й не показуй цей текст користувачу — він для розробника.

Ще одна пастка: **статична сторінка, що кидає, ламає збірку.** Межа помилок не допоможе — сторінку рендерить `next build`. Якщо прибрати з `/boom` `<Suspense>` і `connection()`, щоб компонент кидав одразу, збірка зупиняється:

```text
Error occurred prerendering page "/boom". Read more: https://nextjs.org/docs/messages/prerender-error
Error: DB connection failed: postgres://admin:hunter2@db
    at b (app/boom/page.tsx:4:9)
Export encountered an error on /boom/page: /boom, exiting the build.
```

Це на краще: зламана статична сторінка не потрапить у продакшн.

> [!diagram] Шлях серверної помилки в продакшні
> ```yaml
> layout: flow
> nodes:
>   - { id: rsc, label: "сервер · RSC", text: "Orders кидає Error", note: "текст з паролем", tone: red, icon: "px:bomb" }
>   - { id: log, label: "сервер · логи", text: "⨯ Error … + digest", note: "і onRequestError", tone: gray, icon: "px:scroll" }
>   - { id: wire, label: "RSC payload", code: "E{\"digest\":\"2033829626\"}", note: "тільки digest", tone: violet }
>   - { id: eb, label: "браузер · error.tsx", text: "#441 + digest", note: "fallback у межах сегмента", tone: orange, icon: "px:shield" }
>   - { id: retry, label: "браузер · retry()", text: "router.refresh()", note: "новий payload", tone: green, icon: "px:repeat" }
> edges:
>   - { from: rsc, to: log, label: "повний текст" }
>   - { from: rsc, to: wire, label: "серіалізація" }
>   - { from: wire, to: eb, label: "стрім" }
>   - { from: eb, to: retry, label: "клік" }
>   - { from: retry, to: rsc, label: "новий запит" }
> steps:
>   - { focus: rsc, note: "Server Component кидає помилку під час рендеру. У тексті — секрет, який не можна віддати в браузер." }
>   - { move: { from: rsc, to: log, value: "Error + digest" }, note: "Next.js пише повну помилку в лог сервера і викликає onRequestError з тим самим digest." }
>   - { move: { from: rsc, to: wire, value: "digest" }, note: "У RSC payload потрапляє лише digest — ні тексту, ні стеку." }
>   - { move: { from: wire, to: eb, value: "#441" }, note: "React у браузері створює помилку з мініфікованим текстом #441 і передає її найближчій межі разом із digest." }
>   - { move: { from: eb, to: retry, value: "retry()" }, note: "Кнопка викликає retry(): router.refresh() у Transition." }
>   - { move: { from: retry, to: rsc, value: "GET payload" }, note: "Сервер рендерить сегмент заново. Немає помилки — fallback зникає." }
> ```
> Повний текст помилки йде лише ліворуч — у логи. Праворуч, у браузер, — тільки digest.

### 🗺️ Де стоять межі: яка зловить помилку

Правило пошуку просте: **спрацьовує найближча межа вище за місцем, де кинуто помилку**, і межа сегмента не охоплює layout і template свого ж сегмента. Тема 01 вивела це з порядку обгортання; ось повна таблиця, перевірена на 16.3.8:

| Де кинуто | Хто ловить | Що лишається на екрані |
|---|---|---|
| `page`, `loading`, `not-found` сегмента S | `error.tsx` сегмента S, якщо є, інакше вище | усі layouts до S включно |
| `layout` або `template` сегмента S | `error.tsx` **батька** S | layouts вище S |
| сам `error.tsx` (або `throw error` у ньому) | межа батька | layouts вище |
| root layout (`app/layout.tsx`) | `app/global-error.tsx` | нічого: global-error замінює весь документ |

На 16.3.8 помилка в `crash/layout.tsx` показала `app/error.tsx` **всередині** root layout (навігація з root layout лишилася на екрані), хоча поруч лежав `crash/error.tsx`. Межа сегмента — всередині його layout, тож падіння layout — це падіння «над» межею.

> [!diagram] Яка межа зловить помилку
> ```yaml
> layout: tree
> nodes:
>   - { id: root, label: "app/layout.tsx", text: "root layout", note: "його падіння → global-error", tone: blue, icon: "px:house" }
>   - { id: rerr, label: "app/error.tsx", text: "межа кореня", parent: root, tone: orange, icon: "px:shield" }
>   - { id: dl, label: "dashboard/layout.tsx", text: "layout сегмента", note: "падіння → app/error.tsx", parent: rerr, tone: blue }
>   - { id: derr, label: "dashboard/error.tsx", text: "межа dashboard", parent: dl, tone: orange, icon: "px:shield" }
>   - { id: dp, label: "dashboard/page.tsx", text: "сторінка", note: "падіння → dashboard/error.tsx", parent: derr, tone: blue }
>   - { id: sp, label: "dashboard/settings/page.tsx", text: "без власної межі", note: "падіння → dashboard/error.tsx", parent: derr, tone: blue }
> steps:
>   - { show: [root, rerr], note: "Root layout — найвищий вузол. Над ним немає error.tsx, тому для нього існує окремий global-error.tsx." }
>   - { show: dl, note: "dashboard/layout.tsx лежить усередині app/error.tsx, але ВИЩЕ dashboard/error.tsx." }
>   - { show: derr, note: "Межа dashboard обгортає все, що під його layout: сторінки й вкладені сегменти." }
>   - { show: [dp, sp], note: "Помилка будь-якої сторінки dashboard піднімається до dashboard/error.tsx; layout dashboard з меню лишається на екрані." }
>   - { focus: dl, note: "А падіння самого dashboard/layout.tsx проскакує межу dashboard: його ловить app/error.tsx, і меню dashboard зникає." }
> ```
> Помилка піднімається вгору до першої помаранчевої межі. Layout сегмента завжди над межею того самого сегмента.

### 🌍 global-error.tsx

`app/global-error.tsx` — межа для помилок root layout (і root template). Коли вона спрацьовує, root layout **не рендериться взагалі**, тож файл мусить сам рендерити `<html>` і `<body>`, підключати потрібні стилі й шрифти (глобальні стилі застосунку сюди не доходять, як і клас колірної теми на `<html>`). Як і будь-яка межа, це Client Component, тож `metadata` експортувати не можна — для заголовка вкладки використовують React-компонент `<title>`.

```tsx
// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <html lang="uk">
      <body>
        <title>Помилка сервісу</title>
        <h1>Сервіс тимчасово недоступний</h1>
        {error.digest && <p>Код помилки: {error.digest}</p>}
        <button onClick={() => retry()}>Спробувати ще</button>
      </body>
    </html>
  )
}
```

Приклад: root layout читає cookie в `<Suspense>` і кидає на «зламаній» темі. У продакшні 16.3.8 на екрані лише вміст `global-error.tsx` — шапки root layout немає, `error.message` — той самий `#441`, є `digest`. Статус — `200`, бо відповідь уже стрімилась. З 15.2 `global-error` показується й у `next dev` (раніше там був лише оверлей).

Чесно: `global-error` — остання лінія оборони, він спрацьовує рідко. Root layout зазвичай тонкий; якщо в ньому є щось ризиковане (читання cookie з темою, сесія для шапки), краще винести це в окремий компонент з власною межею (`catchError`, нижче), ніж втрачати всю сторінку.

> [!quiz] Перевір себе: заповни global-error
> level: middle · type: fill · bank: 'use server', metadata · id: nextjs-core-13-quiz-05
>
> ```tsx fill
> // app/global-error.tsx
> [['use client'|"use client"]]
>
> export default function GlobalError({ retry }: { retry: () => void }) {
>   return (
>     <[[html]] lang="uk">
>       <[[body]]>
>         <h1>Сервіс тимчасово недоступний</h1>
>         <button onClick={() => [[retry]]()}>Спробувати ще</button>
>       </body>
>     </html>
>   )
> }
> ```
>
> **Пояснення:** межа помилок — Client Component, тож директива першим рядком. `global-error` замінює root layout, тому сам рендерить `<html>` і `<body>`. `retry` перезапитує дерево з сервера; `metadata` тут експортувати не можна, а `'use server'` позначає Server Functions, а не серверні компоненти.

### 🚫 notFound() і not-found.tsx

`notFound()` з `next/navigation` кидає спеціальний виняток з `digest: 'NEXT_HTTP_ERROR_FALLBACK;404'`. Next.js зупиняє рендер сегмента й показує найближчий `not-found.tsx`, додаючи `<meta name="robots" content="noindex">`. Кидати можна в Server Components, Server Functions і Route Handlers; TypeScript знає, що `notFound()` повертає `never`, тож `return` не потрібен.

Де шукається `not-found.tsx`. Межа `not-found` лежить **найглибше** — під `error` і `loading`, просто над `page`. Звідси два наслідки, перевірені на 16.3.8:

- `notFound()` у сторінці сегмента без власного `not-found.tsx` піднімається до найближчого вище й рендериться **всередині** layout сегмента: `/catalog/x` показав `app/not-found.tsx` разом із меню каталогу.
- `notFound()` у **layout** сегмента проскакує `not-found.tsx` того самого сегмента: `shop/layout.tsx` з `notFound()` показав `app/not-found.tsx`, хоча поруч лежав `shop/not-found.tsx`. Правило те саме, що й для помилок.

Кореневий `app/not-found.tsx` обслуговує ще й **URL без збігу** (`/nope` → 404). За замовчуванням `not-found.tsx` — Server Component і може бути `async`; props він не отримує.

**Статус-код залежить від стріму.** HTTP-статус іде в заголовках, а заголовки відправляються з першим байтом відповіді. Streaming і Suspense — [[Next.js - 11. Streaming і Suspense|тема 11]]; тут важливий підсумок для `next start` 16.3.8:

| Ситуація | Статус | `noindex` |
|---|---|---|
| `notFound()` у статичній сторінці, без `Suspense` над викликом | `404` | так |
| `notFound()` у компоненті під `<Suspense>` (або під `loading.tsx`) | **`200`** | так |
| URL без збігу | `404` | так |

Під Cache Components будь-яка сторінка з даними часу запиту стрімить static shell, тож «пізній» `notFound()` дає `200` + `noindex` — «soft 404». Пошуковик сторінку не проіндексує, але аналітика й моніторинг побачать `200`. Якщо потрібен справжній `404` (вимоги SEO-команди, API-подібні сторінки), документація радить перевіряти існування ресурсу **до** стріму — у `proxy` ([[Next.js - 06. proxy.ts, redirects і rewrites|тема 06]]), або робити сторінку статичною через `generateStaticParams` для відомих slug.

### 🎯 Справжній 404 під Cache Components

Ключ — порядок: статус фіксується з першим байтом, а перший байт іде, щойно рендер доходить до першої «дірки» (`<Suspense>`, `loading.tsx`) або до даних часу запиту. Отже, перевірку існування треба зробити **до** цього моменту й так, щоб вона сама не була даними часу запиту. Під Cache Components є два способи.

**1. Закешована перевірка над межею Suspense.** `params` динамічного сегмента з `generateStaticParams` можна чекати на верхньому рівні сторінки; функція з `'use cache'` теж не робить сторінку «динамічною». А все, що читає cookie, `connection()` чи повільні незакешовані дані, — нижче, під `<Suspense>`:

```ts
// lib/posts.ts
import { cacheLife, cacheTag } from 'next/cache'

const posts: Record<string, { title: string; body: string }> = {
  hello: { title: 'Привіт', body: 'Перший пост' },
}

// дешева закешована перевірка існування — без даних часу запиту
export async function postExists(slug: string): Promise<boolean> {
  'use cache'
  cacheLife('hours')
  cacheTag('posts')
  return slug in posts
}

export async function getPost(slug: string) {
  return posts[slug] ?? null
}
```

```tsx
// app/blog/[slug]/page.tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { getPost, postExists } from '@/lib/posts'

export async function generateStaticParams() {
  return [{ slug: 'hello' }]
}

async function Comments() {
  await connection() // дані часу запиту — лише всередині Suspense
  return <p>Коментарі…</p>
}

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  if (!(await postExists(slug))) notFound() // до першого Suspense → справжній 404

  const post = await getPost(slug)
  return (
    <article>
      <h1>{post!.title}</h1>
      <Suspense fallback={<p>Завантаження коментарів…</p>}>
        <Comments />
      </Suspense>
    </article>
  )
}
```

На `next start` 16.3.8: `/blog/hello` — `200`, заголовок у static shell і коментарі в потоці; `/blog/ghost` — **`404`** з `noindex` і `app/not-found.tsx`. Збірка показує `◐ /blog/[slug]`: невідомий slug рендериться під час запиту, але `notFound()` спрацьовує раніше, ніж Next.js відправив заголовки. Головне — над межею немає жодного `loading.tsx` (він сам по собі вже межа Suspense для сторінки) і жодного `cookies()`/`connection()`. Коли пост створюють чи видаляють, кеш перевірки інвалідовують за тегом `posts` (теми 15–16 основного посібника).

**2. Перевірка в `proxy`.** Якщо доступ залежить від cookie (403 для чужого ресурсу) або сторінка мусить стрімити все з першого байта, перевіряй у `proxy.ts`: він виконується до рендеру, тож може переписати запит на сторінку 404 чи віддати власну відповідь зі статусом ([[Next.js - 06. proxy.ts, redirects і rewrites|тема 06]]). Документація радить тримати таку перевірку швидкою — легкий запит «чи існує» або підпис у cookie, а не завантаження всього контенту.

Що обрати. Для каталогу й блогу з публічним вмістом — перший спосіб: SEO отримує справжній `404`, і все лишається в сторінці. Для `403`/`401` під Cache Components реальний статус дає лише `proxy`, бо сесія — завжди дані часу запиту. А де статус не важливий (особистий кабінет за логіном), «пізній» `notFound()`/`forbidden()` з `noindex` — нормальний компроміс.

### 🌐 global-not-found.tsx (experimental)

Іноді скласти 404 з `layout` + `not-found` неможливо: кілька root layouts у route groups або root layout під динамічним сегментом (`app/[country]/layout.tsx`). Для цього є **експериментальний** `app/global-not-found.tsx` з прапорцем `experimental.globalNotFound`. Він спрацьовує лише для **URL без збігу**, обходить рендер застосунку і мусить сам рендерити `<html>` і `<body>`; на відміну від межі помилок, може експортувати `metadata`.

```tsx
// app/global-not-found.tsx — потребує experimental.globalNotFound: true
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404 — сторінки немає' }

export default function GlobalNotFound() {
  return (
    <html lang="uk">
      <body>
        <h1>404 · такої сторінки немає</h1>
      </body>
    </html>
  )
}
```

На 16.3.8: `/nope` → `404`, лише вміст `global-not-found.tsx` з його `<title>`, без root layout. А `notFound()` усередині сторінки все одно рендерить звичайний `not-found.tsx` у layout — `global-not-found` його не замінює.

### 🔐 forbidden() і unauthorized() (experimental)

`forbidden()` (403) і `unauthorized()` (401) — брати `notFound()` для доступу. Обидва **експериментальні**: працюють лише з `experimental.authInterrupts` у `next.config.ts` (з ним `next build` друкує ✓ `authInterrupts` у списку «Experiments (use with caution)»). Кидають `NEXT_HTTP_ERROR_FALLBACK;403` і `NEXT_HTTP_ERROR_FALLBACK;401`, рендерять найближчий `forbidden.tsx` / `unauthorized.tsx` і додають `noindex`.

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
```

```tsx
// app/admin/page.tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { forbidden } from 'next/navigation'

async function AdminPanel() {
  // демо: справжню перевірку ролі роблять у шарі доступу до даних (тема 27 основного посібника)
  const role = (await cookies()).get('role')?.value
  if (role !== 'admin') forbidden()
  return <p>Панель адміна</p>
}

export default function Page() {
  return (
    <main>
      <h1>Адмінка</h1>
      <Suspense fallback={<p>Перевіряємо доступ…</p>}>
        <AdminPanel />
      </Suspense>
    </main>
  )
}
```

```tsx
// app/forbidden.tsx
export default function Forbidden() {
  return (
    <main>
      <h1>403 · доступ заборонено</h1>
      <p>У тебе немає прав на цю сторінку.</p>
    </main>
  )
}
```

Статуси на 16.3.8 — та сама логіка стріму: `forbidden()` у статичній сторінці дав `403`, `unauthorized()` — `401`, а `forbidden()` у `AdminPanel` під `<Suspense>` — **`200`** з `noindex` і вмістом `forbidden.tsx` замість панелі. Документація прямо радить: для справжнього `403` під Cache Components перевіряй доступ у `proxy`. І пам'ятай: `forbidden()` — це UI для заборони, а **не** сама перевірка безпеки; перевірка доступу має стояти біля даних (тема 27 основного посібника), а `forbidden()` — лише красиво завершує рендер. Не можна викликати його в root layout.

> [!quiz] Перевір себе: notFound() у layout
> level: middle · type: output · id: nextjs-core-13-quiz-06
>
> ```text
> app/
> ├── layout.tsx
> ├── not-found.tsx        «Не знайдено · app»
> └── shop/
>     ├── layout.tsx       викликає notFound()
>     ├── not-found.tsx    «Не знайдено · shop»
>     └── item/page.tsx
> ```
>
> Що покаже `/shop/item` у продакшні?
>
> - [x] `404` і «Не знайдено · app» усередині root layout
> - [ ] `404` і «Не знайдено · shop» — not-found лежить у тій самій папці
> - [ ] `200` і «Не знайдено · shop» з `noindex`
> - [ ] `500`: `notFound()` не можна викликати в layout
>
> **Пояснення:** межа `not-found` сегмента, як і `error`, лежить під його layout, тож виклик у `shop/layout.tsx` проскакує `shop/not-found.tsx` і доходить до кореневого. Стріму перед викликом не було (layout синхронний), тому статус — справжній `404`.

> [!quiz] Що поверне сервер?
> level: middle · type: output · id: nextjs-core-13-quiz-07
>
> `experimental.authInterrupts` увімкнено, є `app/forbidden.tsx`. Сторінка `/admin` з прикладу вище: заголовок «Адмінка», а `AdminPanel` під `<Suspense>` читає cookie й викликає `forbidden()`. Продакшн-збірка, `curl -i /admin` без cookie. Що у відповіді?
>
> - [ ] `403`, лише вміст `forbidden.tsx`
> - [x] `200`, «Адмінка», «Перевіряємо доступ…», а далі в потоці — вміст `forbidden.tsx` і `noindex`
> - [ ] `401`: користувач не має cookie, отже не автентифікований
> - [ ] `500`: `forbidden()` після початку стріму — помилка
>
> **Пояснення:** заголовки зі статусом 200 пішли разом зі static shell, до того як `AdminPanel` вирішив, що доступу немає. Next.js не може змінити статус, тож додає `noindex` і рендерить `forbidden.tsx` на місці «дірки». `401` — це `unauthorized()`, Next.js сам не вгадує причину. Справжній `403` — перевіркою в `proxy` до стріму.

### 🧩 catchError: межа будь-де в дереві

`error.tsx` привʼязаний до сегментів маршруту. А якщо на дашборді шість віджетів і падіння одного (погода, курси валют) не має гасити решту? Раніше писали класовий ErrorBoundary. З 16.3 є **стабільний** `catchError` з `next/error`: він створює компонент-межу з fallback-функції.

```tsx
// app/ui/widget-boundary.tsx
'use client'

import { catchError, type ErrorInfo } from 'next/error'

function WidgetFallback(props: { title: string }, { error, retry }: ErrorInfo) {
  return (
    <section role="alert">
      <h3>{props.title}: не вдалося завантажити</h3>
      <p>{error instanceof Error ? error.message : String(error)}</p>
      <button onClick={() => retry()}>Спробувати ще</button>
    </section>
  )
}

export default catchError(WidgetFallback)
```

```tsx
// app/widgets/page.tsx
import { Suspense } from 'react'
import { connection } from 'next/server'
import WidgetBoundary from '../ui/widget-boundary'

async function Weather(): Promise<React.ReactNode> {
  await connection()
  throw new Error('Weather API 503')
}

export default function Page() {
  return (
    <main>
      <h1>Дашборд</h1>
      <WidgetBoundary title="Погода">
        <Suspense fallback={<p>…</p>}>
          <Weather />
        </Suspense>
      </WidgetBoundary>
      <p>Інші віджети працюють</p>
    </main>
  )
}
```

Fallback отримує два аргументи: props обгортки (без `children`) і `ErrorInfo` — `{ error, retry, reset }` з тією ж семантикою, що й у `error.tsx`. Обгортка — Client Component, але `children` у неї з серверної сторінки, тож `Weather` лишається Server Component (композиція через `children` — [[Next.js - 07. Server і Client Components|тема 07]]). На 16.3.8: заголовок і «Інші віджети працюють» на місці, замість погоди — fallback; у продакшні текст знову `#441`.

> [!warning] ErrorInfo.error має тип unknown
> [Документація `catchError`](https://nextjs.org/docs/app/api-reference/functions/catchError) у таблиці пише тип `Error` і в прикладі рендерить `{error.message}`. На 16.3.8 у `ErrorInfo` поле оголошено як `error: unknown`, і `next build` з таким прикладом падає на перевірці типів: `error TS18046: 'error' is of type 'unknown'.` Звужуй тип (`error instanceof Error`), як у прикладі вище.

Чим `catchError` кращий за саморобний класовий ErrorBoundary:

- **`retry()` з коробки** — `router.refresh()` у Transition, як у `error.tsx`. Саморобна межа вміє лише скинути стан, тобто `reset`, — а це не відновлює помилку Server Component.
- **Пропускає службові винятки.** У вихідному коді `getDerivedStateFromError` перекидає далі все, що `isNextRouterError` (redirect і `NEXT_HTTP_ERROR_FALLBACK`). На 16.3.8 `notFound()` усередині `WidgetBoundary` показав `app/not-found.tsx`, а не fallback віджета. Класова межа з `react-error-boundary` такий виняток проковтнула б і показала б «не вдалося завантажити» замість 404.
- **Скидається при клієнтській навігації** на інший маршрут, як і `error.tsx`.

Для `error.tsx` обгортати компонент у `catchError` не треба — файлова конвенція вже стоїть у вбудованій межі.

> [!quiz] Перевір себе: notFound() усередині catchError
> level: middle · type: single · id: nextjs-core-13-quiz-08
>
> Сторінка товару: `<WidgetBoundary title="Товар">` з `catchError` обгортає `<Item />`, а `Item` для невідомого id викликає `notFound()`. У корені є `app/not-found.tsx`. Що побачить користувач?
>
> - [x] Вміст `app/not-found.tsx` — `catchError` перекидає службовий виняток далі
> - [ ] Fallback «Товар: не вдалося завантажити» — це найближча межа
> - [ ] Вбудовану сторінку 404 без root layout
> - [ ] Порожнє місце замість товару: `notFound()` у межі ігнорується
>
> **Пояснення:** `catchError` — «framework-aware»: винятки `redirect()` і `notFound()` він не ловить, а пропускає до межі `not-found` (або до обробки редиректу). Саме цим він відрізняється від класового ErrorBoundary, що ловить усе підряд.

### 🪤 try/catch і службові винятки

`redirect()`, `permanentRedirect()`, `notFound()`, `forbidden()` і `unauthorized()` працюють **через виняток**: вони кидають помилку з особливим `digest`, і Next.js розпізнає її вище за стеком. Звичайний `try/catch` про це не знає:

```tsx
// app/rethrow/swallow/page.tsx — ❌ catch ковтає notFound()
import { notFound } from 'next/navigation'

function getPost(slug: string) {
  if (slug !== 'hello') notFound()
  return { title: 'Hello' }
}

export default function Page() {
  let title = 'Без назви'
  try {
    title = getPost('ghost').title
  } catch (err) {
    console.error('getPost failed', err)
  }
  return <h1>{title}</h1>
}
```

Результат на 16.3.8: `/rethrow/swallow` віддає `200` і «Без назви», а `next build` друкує в лог `getPost failed Error: NEXT_HTTP_ERROR_FALLBACK;404` з `digest: 'NEXT_HTTP_ERROR_FALLBACK;404'` — «помилка», якої насправді не було. Виправлення — `unstable_rethrow(err)` **першим рядком** у `catch`:

```tsx
// app/rethrow/fixed/page.tsx — ✅
import { notFound, unstable_rethrow } from 'next/navigation'

function getPost(slug: string) {
  if (slug !== 'hello') notFound()
  return { title: 'Hello' }
}

export default function Page() {
  let title = 'Без назви'
  try {
    title = getPost('ghost').title
  } catch (err) {
    unstable_rethrow(err) // службові винятки Next.js летять далі
    console.error('getPost failed', err)
  }
  return <h1>{title}</h1>
}
```

Тепер `404` і `app/not-found.tsx`. `unstable_rethrow` (позначка `unstable_` — так у документації) перекидає не лише redirect/HTTP-fallback, а й внутрішні сигнали рендеру: звернення до `cookies()`/`headers()` під час пререндеру, postpone для PPR. Ще він рекурсивно дивиться в `error.cause`, тож обгорнутий `new Error('…', { cause })` теж пройде. Прибирання ресурсів — до виклику або у `finally`.

Найкраще — не потребувати цього взагалі: винеси виклик, що може кинути `notFound()`/`redirect()`, **за межі** `try`, а в `try` лиши тільки те, що справді треба перехопити.

Digest-и на 16.3.8 (перший, четвертий і п'ятий рядки видно в `catch` Server Action і в RSC payload, решта — з вихідного коду `redirect.js`):

| Виклик | `err.digest` |
|---|---|
| `redirect('/signup/done')` у Server Action | `NEXT_REDIRECT;push;/signup/done;307;` |
| `redirect()` у рендері | `NEXT_REDIRECT;replace;<url>;307;` |
| `permanentRedirect()` | `NEXT_REDIRECT;replace;<url>;308;` |
| `notFound()` | `NEXT_HTTP_ERROR_FALLBACK;404` |
| `forbidden()` / `unauthorized()` | `NEXT_HTTP_ERROR_FALLBACK;403` / `…;401` |

Формат — внутрішня деталь, не публічне API: у коді застосунку покладайся на `unstable_rethrow`, а не на розбір рядків. Таблиця потрібна, щоб упізнати ці рядки в логах і моніторингу (`Error: NEXT_REDIRECT` у Sentry — не баг, а проковтнутий редирект).

> [!quiz] Перевір себе: що поверне сторінка з try/catch?
> level: middle · type: output · id: nextjs-core-13-quiz-09
>
> Поруч зі сторінкою лежить `app/posts/[slug]/loading.tsx`, `generateStaticParams` немає.
>
> ```tsx
> // app/posts/[slug]/page.tsx
> export default async function Page({ params }: PageProps<'/posts/[slug]'>) {
>   const { slug } = await params
>   try {
>     const post = await getPost(slug) // для невідомого slug викликає notFound()
>     return <h1>{post.title}</h1>
>   } catch (err) {
>     console.error(err)
>     return <p>Не вдалося завантажити пост</p>
>   }
> }
> ```
>
> Що отримає користувач на `/posts/ghost`?
>
> - [x] `200` і «Не вдалося завантажити пост», а в лозі — `Error: NEXT_HTTP_ERROR_FALLBACK;404`
> - [ ] `not-found.tsx`: Next.js перехоплює `notFound()` раніше за `try/catch`
> - [ ] Помилку збірки: `notFound()` не можна викликати в `try`
> - [ ] `error.tsx` з повідомленням `NEXT_HTTP_ERROR_FALLBACK;404`
>
> **Пояснення:** `notFound()` — звичайний `throw`, і найближчий `catch` у твоєму коді отримує його першим. Next.js не бачить винятку, тож рендерить те, що повернув `catch`. Виправлення — `unstable_rethrow(err)` першим рядком у `catch` або виклик `getPost` поза `try`.

### ✉️ Помилки в Server Actions

У Server Action ті самі два класи помилок. Очікувані — значення в `state` (`useActionState`). Службові — `redirect()`, `notFound()`, `forbidden()` — працюють і з дії: `redirect()` переводить на нову сторінку, `notFound()` показує `not-found.tsx`. Неочікувана помилка йде так: POST дії відповідає **`500`**, клієнт кидає помилку в дереві, і її ловить найближча межа над формою. У продакшні там знову `#441` і `digest`, а лог сервера й `onRequestError` (з `routeType: 'action'`) мають оригінальний текст.

Звідси популярний обгортковий патерн: одна функція, що перетворює очікувані помилки шару даних на `{ ok: false, fieldErrors }`, а все інше пропускає:

```ts
// lib/action-result.ts
import { unstable_rethrow } from 'next/navigation'

export class ValidationError extends Error {
  constructor(public fieldErrors: Record<string, string[]>) {
    super('Validation failed')
  }
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; fieldErrors: Record<string, string[]> }

export async function toActionResult<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() }
  } catch (err) {
    unstable_rethrow(err) // redirect(), notFound(), forbidden() — летять далі
    if (err instanceof ValidationError) return { ok: false, fieldErrors: err.fieldErrors }
    throw err // неочікувана — до error boundary і в логи
  }
}
```

На 16.3.8 дія на основі `toActionResult` поводиться як слід у всіх чотирьох випадках: невалідний email → `fieldErrors` під полем; успіх → `redirect` на `/signup/done`; `notFound()` → `app/not-found.tsx`; падіння SMTP → `signup/error.tsx` з `#441`. Як побудувати таку обгортку без `next/navigation` — задача в 🛠️ Практиці.

> [!quiz] Що побачить користувач?
> level: middle · type: output · id: nextjs-core-13-quiz-10
>
> Продакшн. Форма з `useActionState` викликає дію, яка кидає `new Error('SMTP down: secret-token-123')`. Над формою — `app/signup/error.tsx`, що показує `error.message`. Що станеться після сабміту?
>
> - [ ] `state` отримає `{ error: 'SMTP down: …' }`, форма лишиться на місці
> - [x] Відповідь дії — `500`, форму замінює `signup/error.tsx` з текстом `#441` і digest
> - [ ] `signup/error.tsx` з текстом `SMTP down: secret-token-123`
> - [ ] Нічого: помилки Server Actions видно лише в консолі сервера
>
> **Пояснення:** `useActionState` не перетворює винятки на `state` — це робиш ти, повертаючи значення. Кинута помилка дійде до найближчої межі, а оскільки її кинув серверний код, текст замінено на #441. Оригінал з токеном лишився в лозі сервера.

### 🖱️ Що межі не ловлять

Error boundary — механізм **рендеру**: React ловить винятки, коли викликає твої компоненти. Помилки, що стаються пізніше й поза рендером, межа не бачить:

- **обробники подій** (`onClick`, `onSubmit`);
- **асинхронний код**: `setTimeout`, `.then()` без `await` у рендері, проміс, який ніхто не чекає;
- помилки в самій межі (їх ловить межа вище) і в коді поза React.

На 16.3.8 клік по кнопці з `throw new Error('click handler failed')` дав лише `pageerror` у консолі: межі на екрані немає, UI живий. Для таких помилок — `try/catch` і стан:

```tsx
// app/events/buttons.tsx
'use client'

import { useState, useTransition } from 'react'

export default function Buttons() {
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  return (
    <div>
      <button
        onClick={() => {
          try {
            riskyWork()
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Невідома помилка') // ✅ показуємо в UI
          }
        }}
      >
        Зберегти
      </button>
      <button onClick={() => startTransition(() => riskyWork())}>
        Зберегти в Transition {/* ✅ необроблена помилка дійде до межі */}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  )
}
```

Виняток, кинутий **усередині `startTransition`**, React передає найближчій межі: на 16.3.8 друга кнопка показує fallback `error.tsx`. Так само поводиться Server Action, кинута з форми (вище): React виконує її в Transition.

Окремо — `forbidden()`/`notFound()` у **не-await-нутому** промісі: документація попереджає, що такий виклик кидає «в порожнечу», і в `next dev` сервер пише `⨯ unhandledRejection: NEXT_HTTP_ERROR_FALLBACK;403`. Функцію, що може їх викликати, завжди `await`.

> [!quiz] Перевір себе: що зловить error.tsx?
> level: middle · type: multi · id: nextjs-core-13-quiz-11
> - [x] Server Component під межею кидає під час рендеру
> - [x] Client Component під межею кидає під час рендеру в браузері
> - [x] Необроблений виняток усередині `startTransition`
> - [ ] `throw` в обробнику `onClick`
> - [ ] `throw` у `setTimeout`, запущеному з обробника
> - [ ] Помилка в `layout.tsx` того самого сегмента
>
> **Пояснення:** межа ловить помилки рендеру й Transition. Обробники та таймери виконуються після рендеру — React не стоїть у їхньому стеку, тож обробляй їх `try/catch` і станом. Layout свого сегмента лежить над межею — його ловить батьківська.

### 💧 Помилки hydration

Hydration error — окремий клас. Це не виняток у твоєму коді, а **розбіжність**: HTML з сервера не збігся з першим рендером Client Component у браузері. Класика — гілка `typeof window`:

```tsx
// app/hydration/clock.tsx — ❌ різний результат на сервері й у браузері
'use client'

export default function Clock() {
  const where = typeof window === 'undefined' ? 'сервер' : 'браузер'
  return <p>Відрендерено: {where}</p>
}
```

`next dev` 16.3.8 пише: `Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client.` — і далі список типових причин (гілка `typeof window`, `Date.now()`/`Math.random()`, локаль дат, некоректна вкладеність HTML, розширення браузера). У продакшні — `Minified React error #418`. Межа помилок тут **не спрацьовує**: React викидає серверний HTML для цього дерева й рендерить його на клієнті — на екрані «браузер». Користувач бачить «стрибок» контенту, ти втрачаєш вигоду серверного HTML.

Корисне з Cache Components: частину таких багів ловить уже `next build`. `{Math.random()}` у Client Component зупинив збірку: `Route "/hydration": Next.js encountered the unstable value \`Math.random()\` in a Client Component.` з порадами `[stream]` (обгорнути в `<Suspense>`) і `[defer]` (перенести в `useEffect` або обробник). Як читати RSC payload і чому взагалі стається hydration — [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration|тема 09]]; виправлення — детерміновані значення (дата приходить з сервера як prop), `useEffect` для браузерних даних, `suppressHydrationWarning` лише для одного елемента з часом.

### 📡 Логи й моніторинг: onRequestError

Серверний лог з `⨯ Error … digest` — це вже щось, але в продакшні потрібна система моніторингу. Для цього `instrumentation.ts` у корені проєкту може експортувати `onRequestError` — Next.js викликає його для кожної серверної помилки: рендер, Route Handler, Server Action, proxy.

```ts
// instrumentation.ts
import type { Instrumentation } from 'next'

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  const digest =
    typeof err === 'object' && err !== null && 'digest' in err ? String(err.digest) : undefined

  // у продакшні — відправка в Sentry/Datadog; тут лише лог
  console.log('[onRequestError]', {
    message: err instanceof Error ? err.message : String(err),
    digest,
    path: request.path,
    routeType: context.routeType,
    renderSource: context.renderSource,
  })
}
```

Що отримує `onRequestError` на 16.3.8: для `/orders` — оригінальний текст із паролем, `digest: '2033829626'` (той самий, що в `error.tsx`), `routeType: 'render'`, `renderSource: 'react-server-components'`; для падіння дії — `routeType: 'action'`, `renderSource: 'react-server-components-payload'`. А `redirect()`, `notFound()` і `forbidden()` сюди **не потрапили** — це не помилки. `err` має тип `unknown`, тож звужуй його; асинхронну роботу всередині — `await`. Налаштування Sentry, OpenTelemetry і алертів — тема 44 основного посібника.

### 🧮 Що де використовувати

| Ситуація | Інструмент |
|---|---|
| Невалідна форма, конфлікт, бізнес-відмова | повернути значення з Server Action, показати через `useActionState` |
| Ресурсу немає | `notFound()` + `not-found.tsx`; справжній 404 — перевірка до стріму |
| Немає прав / не залогінений | `forbidden()` / `unauthorized()` (experimental) або `redirect('/login')`; перевірка доступу — біля даних |
| Падіння в розділі сайту | `error.tsx` на рівні розділу з `retry()` |
| Падіння окремого віджета | `catchError` навколо віджета |
| Падіння root layout | `global-error.tsx` з власними `<html>`/`<body>` |
| URL без збігу при кількох root layouts | `global-not-found.tsx` (experimental) |
| Помилка в обробнику події | `try/catch` + стан, або `startTransition`, щоб віддати межі |
| `try/catch` навколо коду з `redirect()`/`notFound()` | `unstable_rethrow(err)` першим рядком |
| Моніторинг | `onRequestError` + `digest` на екрані помилки |

### 🧯 Типові помилки і як їх читати

Тексти — з `next dev` / `next build` / `next start` 16.3.8.

| Повідомлення | Що сталося | Що зробити |
|---|---|---|
| `Minified React error #441` у `error.message` | помилка Server Component у продакшні | шукати оригінал у логах за `error.digest` |
| `Minified React error #418` | hydration mismatch у продакшні | відтворити в `next dev`; детально — [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration]] |
| `app/error.tsx must be a Client Component` | `error.tsx` без директиви | `'use client'` першим рядком |
| `Error occurred prerendering page "/boom"` | статична сторінка кидає на збірці | виправити або зробити дані часу запиту під `<Suspense>` |
| `Error: NEXT_HTTP_ERROR_FALLBACK;404` у лозі | `notFound()` проковтнув `catch` | `unstable_rethrow` |
| `Error: NEXT_REDIRECT` у лозі чи Sentry | `redirect()` проковтнув `catch` | `unstable_rethrow` або `redirect` поза `try` |
| `⨯ unhandledRejection: NEXT_HTTP_ERROR_FALLBACK;403` | `forbidden()` у промісі без `await` | `await` функції, що його викликає |
| `error TS18046: 'error' is of type 'unknown'` | `error.message` у fallback `catchError` | `error instanceof Error ? … : …` |
| `Switched to client rendering because the server rendering errored` (dev) | помилка під час SSR; React пробує рендер у браузері | дивитися першу помилку в консолі |

### 🏭 Як це роблять у продакшні

- **Межі за розділами.** `app/error.tsx` як загальна сітка, `error.tsx` у кожному великому розділі (`dashboard/`, `account/`), `catchError` навколо незалежних віджетів зі сторонніми API. `global-error.tsx` — простий, без залежностей, з інлайн-стилями.
- **Жодного `error.message` на екрані.** Користувачу — людський текст і `digest` («Код помилки: 2033829626, повідом підтримці»). Повідомлення Client Components у продакшні не мініфіковані, тож показ `message` протікає подробиці реалізації.
- **Очікувані помилки — типом.** Дії повертають розрізнюваний union (`{ ok: true } | { ok: false; fieldErrors }`), шар даних кидає власні класи (`ValidationError`, `ConflictError`), а одна обгортка (`toActionResult`) перетворює їх на значення й пропускає службові винятки.
- **`digest` як ключ кореляції.** `onRequestError` шле помилку з `digest` у моніторинг; той самий `digest` клієнтська межа відправляє з `useEffect` разом з URL і версією збірки — і два записи склеюються.
- **Retry з розумом.** Кнопка «Спробувати ще» блокується, поки йде повтор, повтори з паузою, що зростає, і лімітом; після ліміту — «Напиши в підтримку». Автоматичний retry без кліку — лише для ідемпотентних читань.
- **SEO-404 до стріму.** Для сторінок, де статус важливий (каталог, блог), — перевірка slug у `proxy` або статичні параметри, а не «пізній» `notFound()` у `<Suspense>`.
- **Lint на `try/catch`.** Code review (або власне правило ESLint) шукає `catch` без `unstable_rethrow` у файлах, що імпортують `redirect`/`notFound`.

## ⚠️ Пастки

> [!pitfall] error.message на екрані
> У продакшні для серверних помилок це `#441` — незрозуміло користувачу. Для клієнтських — оригінал, що протікає подробиці. Показуй власний текст і `digest`.
>
> ```tsx
> <p>{error.message}</p> // ❌
> <p>Не вдалося завантажити. Код: {error.digest}</p> // ✅
> ```

> [!pitfall] reset() замість retry()
> Після `reset()` помилка Server Component повертається миттєво — кнопка «не працює». Старі туторіали показують саме `reset`.
>
> ```tsx
> <button onClick={() => reset()}>Спробувати ще</button> // ❌ той самий payload
> <button onClick={() => retry()}>Спробувати ще</button> // ✅ новий запит
> ```

> [!pitfall] Очікувати, що error.tsx зловить свій layout
> Межа сегмента лежить під його layout. Помилку `dashboard/layout.tsx` ловить `app/error.tsx`, і меню dashboard зникає. Ризикові частини layout — у компонент із власною межею (`catchError`).

> [!pitfall] try/catch ковтає redirect() і notFound()
> Сторінка «працює» з `200`, а в Sentry — `Error: NEXT_REDIRECT`.
>
> ```ts
> try {
>   await saveAndRedirect()
> } catch (err) {
>   unstable_rethrow(err) // ✅ першим рядком
>   return { ok: false }
> }
> ```

> [!pitfall] Чекати 404 від notFound() під Suspense
> Після початку стріму статус уже `200`. Next.js додає `noindex`, але моніторинг і аналітика бачать успіх. Справжній 404 — перевірка до стріму.

> [!pitfall] Класовий ErrorBoundary навколо серверних children
> Він ловить і службові винятки (`notFound()` перетворюється на «не вдалося завантажити»), і не вміє перезапитати дані. У App Router — `catchError`.

> [!pitfall] global-error без стилів
> Глобальні стилі й клас теми з root layout сюди не доходять. Імпортуй потрібне в сам файл або пиши інлайн-стилі, і перевір у темній темі.

## 🎤 На співбесіді

> [!interview] Як у Next.js обробляти помилки? Чим очікувані відрізняються від неочікуваних?
> level: middle · frequency: дуже часто · id: nextjs-core-13-int-01
>
> ---
>
> Очікувані — частина нормальної роботи (валідація, «немає товару», відмова зовнішнього API): їх моделюють як значення — Server Action повертає `{ ok: false, fieldErrors }`, форма показує через `useActionState`; для відсутнього ресурсу — `notFound()`. Неочікувані — баги й аварії: їх кидають, ловить найближча межа — `error.tsx` сегмента, `catchError` навколо компонента або `global-error.tsx` для root layout. Межа показує fallback з `retry()`, решта сторінки працює. Плюс моніторинг через `onRequestError`. Головне — не змішувати: кидати валідацію — шум у моніторингу й погана UX, ловити все підряд — сховані баги й проковтнуті `redirect()`.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🧭 Два класи помилок|Розділ: два класи помилок]] · [Next.js: Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)

> [!interview] error.tsx, catchError і global-error — у чому різниця? retry чи reset?
> level: middle · frequency: часто · id: nextjs-core-13-int-02
>
> ---
>
> `error.tsx` — файлова конвенція: межа для сегмента маршруту, лежить під його layout, тож помилки свого layout не ловить. `catchError` з `next/error` (стабільний з 16.3) — та сама межа, але як компонент будь-де в дереві: навколо віджета, частини layout; на відміну від класового ErrorBoundary, пропускає `redirect()`/`notFound()` і має `retry`. `global-error.tsx` — межа root layout: замінює весь документ, тому рендерить власні `<html>`/`<body>`. Усі три — Client Components. `retry()` — `router.refresh()` у Transition: перезапит з сервера, стан поза межею зберігається. `reset()` лише скидає стан і рендерить той самий payload — серверну помилку не відновлює.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🔁 retry проти reset|Розділ: retry проти reset]] · [Next.js: error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error) · [Next.js: catchError](https://nextjs.org/docs/app/api-reference/functions/catchError)

> [!interview] Користувач скаржиться: «На сторінці пише Minified React error #441». Що це і як знайти причину?
> level: middle · frequency: часто · id: nextjs-core-13-int-03
>
> ---
>
> Це помилка Server Component у продакшні, яку `error.tsx` показує як `error.message`. Next.js навмисно не передає текст серверних помилок у браузер, щоб не протекли секрети: у RSC payload іде лише `digest`, а React на клієнті створює мініфіковане повідомлення #441. Оригінал — у логах сервера з тим самим `digest` і в `onRequestError`. Тож прошу `digest` (або показую його на сторінці помилки), шукаю в логах/Sentry і відтворюю в `next dev`, де видно повний текст і стек. Окремо виправляю UI: межа має показувати людський текст, а не `message`.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🔒 Що бачить користувач: dev, prod і digest|Розділ: dev, prod і digest]] · [React: error #441](https://react.dev/errors/441) · [Next.js: instrumentation onRequestError](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation#onrequesterror-optional)

> [!interview] Чому notFound() повернув 200, а не 404? Як отримати справжній 404 чи 403?
> level: senior · frequency: часто · id: nextjs-core-13-int-04
>
> ---
>
> Статус іде в заголовках, а заголовки відправлено з першим байтом стріму. Якщо `notFound()` (або `forbidden()`) викликано під `<Suspense>` чи `loading.tsx`, shell уже пішов з `200`, тож Next.js лише рендерить `not-found.tsx` у «дірці» й додає `<meta name="robots" content="noindex">` — soft 404, який не індексується. Під Cache Components це типово: динамічна сторінка завжди стрімить static shell. Справжній статус — перевірка до стріму: у `proxy` (rewrite на not-found або власна відповідь), або статична сторінка з `generateStaticParams`, де `notFound()` спрацьовує на збірці. `forbidden`/`unauthorized` при цьому ще й experimental (`authInterrupts`).
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🚫 notFound() і not-found.tsx|Розділ: notFound і статус]] · [Next.js: loading.js — Status Codes](https://nextjs.org/docs/app/api-reference/file-conventions/loading#status-codes)

> [!interview] Навіщо unstable_rethrow і коли без нього можна обійтися?
> level: senior · frequency: іноді · id: nextjs-core-13-int-05
>
> ---
>
> `redirect()`, `notFound()`, `forbidden()` працюють через `throw` спеціальної помилки з `digest` (`NEXT_REDIRECT;…`, `NEXT_HTTP_ERROR_FALLBACK;404`). Твій `try/catch` отримує її першим і ковтає: сторінка рендерить fallback з `200`, у моніторингу — фальшива помилка. `unstable_rethrow(err)` першим рядком у `catch` перекидає службові винятки (і внутрішні сигнали рендеру на кшталт звернення до `cookies()` під час пререндеру), включно з тими, що в `error.cause`. Без нього можна, якщо виклик, що кидає службовий виняток, стоїть поза `try`, а в `try` — лише операція, яку справді треба перехопити.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🪤 try/catch і службові винятки|Розділ: try/catch]] · [Next.js: unstable_rethrow](https://nextjs.org/docs/app/api-reference/functions/unstable_rethrow)

## 🔗 Звʼязки

- [[Next.js - 01. App Router, сегменти і спеціальні файли]] — порядок обгортання `layout → template → error → loading → not-found → page`, звідки випливає вся таблиця «хто ловить».
- [[Next.js - 11. Streaming і Suspense]] — HTTP-контракт стріму: чому `notFound()` після shell дає `200` + `noindex`.
- [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration]] — звідки береться hydration mismatch і як його читати.
- [[Next.js - 07. Server і Client Components]] — чому межа — Client Component, а `children` у ній лишаються серверними.
- [[Next.js - 06. proxy.ts, redirects і rewrites]] — перевірка до стріму для справжніх 404/403.
- Далі в курсі: теми 21–22 основного посібника — Server Actions і форми, тема 27 — перевірка доступу біля даних, тема 44 — моніторинг і `instrumentation.ts`.

## ⚡ Фішки

> [!reel] 🔒 У продакшні помилка сервера — це лише digest
> Текст помилки Server Component не їде в браузер: у RSC payload лише `E{"digest":"…"}`, а `error.message` — `Minified React error #441`. Оригінал — у логах під тим самим digest.

> [!reel] 🔁 retry — це router.refresh() у Transition
> `reset()` рендерить той самий payload з тією самою помилкою. `retry()` спершу перезапитує сегмент із сервера, і стан поза межею зберігається.

> [!reel] 🪜 error.tsx не ловить свій layout
> Межа сегмента лежить під його layout: падіння `dashboard/layout.tsx` ловить `app/error.tsx`. З `notFound()` у layout — те саме.

> [!reel] 🪤 redirect() — це throw
> `try/catch` навколо `redirect()` чи `notFound()` ковтає їх, а в Sentry зʼявляється `Error: NEXT_REDIRECT`. Перший рядок `catch` — `unstable_rethrow(err)`.

> [!reel] 🧩 catchError пропускає notFound()
> Межа з `next/error` перекидає службові винятки далі, тож `notFound()` у віджеті покаже `not-found.tsx`, а не «віджет зламався». Класовий ErrorBoundary так не вміє.

> [!reel] 🖱️ onClick межа не бачить
> Межі ловлять помилки рендеру. Виняток в обробнику — лише запис у консолі, UI живий. Але `throw` усередині `startTransition` межа зловить.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чому error.tsx мусить мати 'use client'?
> *часто · теорія* · `nextjs-core-13-card-01`
>
> Error boundary в React — клієнтський механізм (класовий компонент зі станом, кнопка з обробником). Без директиви `next build` зупиняється з `app/error.tsx must be a Client Component`. Те саме з `global-error.tsx` і fallback для `catchError`.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🧱 error.tsx: межа на рівні сегмента|Розділ: error.tsx]] · [Next.js: error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error)

> [!question]- Які props отримує error.tsx у Next.js 16.3?
> *дуже часто · код* · `nextjs-core-13-card-02`
>
> `error` (екземпляр `Error` з необовʼязковим `digest`), `retry()` (стабільний з 16.3, перезапит і ререндер) і `reset()` (скидання стану без перезапиту).
>
> ```tsx
> export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void })
> ```
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🧱 error.tsx: межа на рівні сегмента|Розділ: error.tsx]] · [Next.js: error.js — Props](https://nextjs.org/docs/app/api-reference/file-conventions/error#props)

> [!question]- Як показати помилку валідації з Server Action?
> *дуже часто · практика* · `nextjs-core-13-card-03`
>
> Повернути значення (`{ ok: false, fieldErrors }`) і прочитати його з `state` у `useActionState`. Не кидати: виняток замінить форму на fallback межі, а в продакшні ще й без тексту.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🧭 Два класи помилок|Розділ: два класи]] · [React: useActionState](https://react.dev/reference/react/useActionState)

> [!question]- Чим global-error.tsx відрізняється від app/error.tsx?
> *часто · теорія* · `nextjs-core-13-card-04`
>
> `app/error.tsx` лежить усередині root layout і не ловить його помилок. `global-error.tsx` ловить саме їх і **замінює** root layout, тому рендерить власні `<html>` і `<body>`, свої стилі, без `metadata`.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🌍 global-error.tsx|Розділ: global-error]] · [Next.js: Global Error](https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error)

### 🟡 Middle

> [!question]- Чому reset() не відновлює помилку Server Component?
> *часто · теорія* · `nextjs-core-13-card-05`
>
> Помилка серверного компонента — частина вже отриманого RSC payload. `reset()` лише скидає стан межі, і React рендерить той самий payload. `retry()` робить `router.refresh()` у Transition — новий запит на сервер.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🔁 retry проти reset|Розділ: retry проти reset]] · [Next.js: catchError — Recovering from errors](https://nextjs.org/docs/app/api-reference/functions/catchError#recovering-from-errors)

> [!question]- Що таке error.digest і навіщо він?
> *часто · теорія* · `nextjs-core-13-card-06`
>
> Хеш помилки, кинутої на сервері. У продакшні браузер отримує лише його (текст замінено на #441), а сервер пише повну помилку в лог і `onRequestError` з тим самим digest. Його показують на сторінці помилки й шукають за ним у логах.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🔒 Що бачить користувач: dev, prod і digest|Розділ: digest]] · [Next.js: error.digest](https://nextjs.org/docs/app/api-reference/file-conventions/error#errordigest)

> [!question]- Яка межа зловить помилку в dashboard/layout.tsx, якщо є dashboard/error.tsx і app/error.tsx?
> *дуже часто · теорія* · `nextjs-core-13-card-07`
>
> `app/error.tsx`. Межа сегмента лежить під його layout, тож падіння layout — «над» `dashboard/error.tsx`. На екрані — fallback усередині root layout, меню dashboard зникає.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🗺️ Де стоять межі: яка зловить помилку|Розділ: де стоять межі]] · [Next.js: Nested error boundaries](https://nextjs.org/docs/app/getting-started/error-handling#nested-error-boundaries)

> [!question]- Чому catchError, а не react-error-boundary?
> *часто · практика* · `nextjs-core-13-card-08`
>
> `catchError` пропускає службові винятки (`redirect()`, `notFound()`, `forbidden()`), має `retry()` з перезапитом з сервера і скидається при клієнтській навігації. Звичайна класова межа ловить усе підряд і вміє лише `reset`.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🧩 catchError: межа будь-де в дереві|Розділ: catchError]] · [Next.js: catchError](https://nextjs.org/docs/app/api-reference/functions/catchError)

> [!question]- Чому межі не ловлять помилки в onClick і як їх обробити?
> *часто · код* · `nextjs-core-13-card-09`
>
> Межі ловлять помилки під час рендеру, а обробник виконується після нього. Обгорни роботу в `try/catch` і поклади помилку в стан, або запусти в `startTransition` — тоді необроблений виняток дійде до межі.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🖱️ Що межі не ловлять|Розділ: що межі не ловлять]] · [Next.js: Error Handling](https://nextjs.org/docs/app/getting-started/error-handling#handling-uncaught-exceptions)

### 🔴 Senior

> [!question]- Як forbidden() і unauthorized() вмикаються і який статус вони дають?
> *іноді · теорія* · `nextjs-core-13-card-10`
>
> Обидва experimental: потрібен `experimental.authInterrupts`. Кидають `NEXT_HTTP_ERROR_FALLBACK;403`/`;401`, рендерять `forbidden.tsx`/`unauthorized.tsx` з `noindex`. До стріму — `403`/`401`, під `<Suspense>` — `200`. Справжній статус під Cache Components — перевірка в `proxy`.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🔐 forbidden() і unauthorized() (experimental)|Розділ: forbidden]] · [Next.js: forbidden](https://nextjs.org/docs/app/api-reference/functions/forbidden)

> [!question]- Що робить unstable_rethrow і що він перевіряє?
> *іноді · код* · `nextjs-core-13-card-11`
>
> Перекидає службові винятки Next.js у `catch`: redirect і HTTP-fallback (`isNextRouterError`), сигнали динамічного рендеру й postpone для PPR. Рекурсивно перевіряє `error.cause`. Викликати першим рядком `catch`; прибирання — до нього або у `finally`.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🪤 try/catch і службові винятки|Розділ: try/catch]] · [Next.js: unstable_rethrow](https://nextjs.org/docs/app/api-reference/functions/unstable_rethrow)

> [!question]- Як склеїти помилку з браузера з записом у логах сервера?
> *іноді · практика* · `nextjs-core-13-card-12`
>
> Через `digest`: `onRequestError` в `instrumentation.ts` отримує помилку з digest і шле в моніторинг; клієнтська межа в `useEffect` відправляє той самий `error.digest` з URL і версією збірки. Digest однаковий для тієї самої помилки між запитами в одному середовищі.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#📡 Логи й моніторинг: onRequestError|Розділ: onRequestError]] · [Next.js: instrumentation.js](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation)

> [!question]- Коли потрібен global-not-found.tsx і чим він відрізняється від not-found.tsx?
> *рідко · теорія* · `nextjs-core-13-card-13`
>
> Коли 404 не скласти з layout + not-found: кілька root layouts або root layout під динамічним сегментом. Experimental (`experimental.globalNotFound`), лише для URL без збігу, обходить рендер застосунку, рендерить свої `<html>`/`<body>` і може експортувати `metadata`. `notFound()` у сторінці все одно рендерить `not-found.tsx`.
>
> 📚 [[Next.js - 13. Помилки й межі помилок#🌐 global-not-found.tsx (experimental)|Розділ: global-not-found]] · [Next.js: not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

## 🛠️ Практика

> [!task] Яка межа зловить помилку
> level: middle · difficulty: medium · id: nextjs-core-13-task-01 · tags: error-boundary, not-found, segments
>
> Напиши `whoCatches(segments, event)`. `segments` — шлях від кореня до листка: `[{ dir: 'app', files: [...] }, { dir: 'app/dashboard', files: [...] }, …]`, де `files` — спеціальні файли сегмента (`'layout'`, `'error'`, `'not-found'`, `'page'`…). `event` — `{ at, file, kind }`: індекс сегмента, файл, у якому кинули, і `kind` — `'error'` або `'notFound'`.
>
> Поверни `{ boundary, inside }`:
>
> 1. **Звідки шукати.** Кинуто в `layout`, `template` або `error` сегмента `i` — пошук починається з батька (`i - 1`); в інших файлах — із самого `i`.
> 2. **`kind: 'error'`** — перший сегмент `j` (від старту вгору) з `'error'`: `boundary` = `` `${dir}/error.tsx` ``. Немає жодного — `'app/global-error.tsx'` і `inside: null` (він замінює root layout).
> 3. **`kind: 'notFound'`** — так само шукаємо `'not-found'`; немає жодного — `boundary: 'default-404'` (вбудована сторінка), а `inside` рахуємо як для кореня (`j = 0`).
> 4. **`inside`** — layout, у якому видно результат: найближчий сегмент `k`, що має `'layout'`, → `` `${dir}/layout.tsx` ``. Для `'error'` пошук `k` іде від `j` вниз до 0 (межа гасить усе під собою). Для `'notFound'` — від старту пошуку (п. 1): на 16.3.8 і кореневий `not-found.tsx`, і вбудована 404 рендеряться в найглибшому вцілілому layout — `/catalog/x` показав кореневий `not-found.tsx` разом із меню каталогу.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type Segment = { dir: string; files: string[] }
> type ThrowEvent = { at: number; file: string; kind: 'error' | 'notFound' }
> type Caught = { boundary: string; inside: string | null }
>
> function whoCatches(segments: Segment[], event: ThrowEvent): Caught {
>   // ❌ найближча межа — у тому ж сегменті, де кинуто
>   const name = event.kind === 'error' ? 'error' : 'not-found'
>   for (let j = event.at; j >= 0; j--) {
>     if (segments[j].files.includes(name)) {
>       return { boundary: `${segments[j].dir}/${name}.tsx`, inside: `${segments[j].dir}/layout.tsx` }
>     }
>   }
>   return { boundary: 'app/global-error.tsx', inside: null }
> }
> ```
>
> ```ts tests
> const tree: Segment[] = [
>   { dir: 'app', files: ['layout', 'error', 'not-found', 'page'] },
>   { dir: 'app/dashboard', files: ['layout', 'error', 'loading'] },
>   { dir: 'app/dashboard/settings', files: ['page'] },
> ]
>
> test('помилку сторінки без власної межі ловить межа батька всередині його layout', () => {
>   expect(whoCatches(tree, { at: 2, file: 'page', kind: 'error' }))
>     .toEqual({ boundary: 'app/dashboard/error.tsx', inside: 'app/dashboard/layout.tsx' })
> })
>
> test('помилку layout сегмента ловить межа батька, а не власна', () => {
>   expect(whoCatches(tree, { at: 1, file: 'layout', kind: 'error' }))
>     .toEqual({ boundary: 'app/error.tsx', inside: 'app/layout.tsx' })
> })
>
> test('помилку root layout ловить global-error без layout навколо', () => {
>   expect(whoCatches(tree, { at: 0, file: 'layout', kind: 'error' }))
>     .toEqual({ boundary: 'app/global-error.tsx', inside: null })
> })
>
> test('throw у самому error.tsx іде до межі вище', () => {
>   expect(whoCatches(tree, { at: 1, file: 'error', kind: 'error' }).boundary).toBe('app/error.tsx')
> })
>
> test('notFound() у сторінці dashboard — кореневий not-found усередині layout dashboard', () => {
>   expect(whoCatches(tree, { at: 2, file: 'page', kind: 'notFound' }))
>     .toEqual({ boundary: 'app/not-found.tsx', inside: 'app/dashboard/layout.tsx' })
> })
>
> test('без жодного not-found — вбудована 404 у найближчому layout над сторінкою', () => {
>   const bare: Segment[] = [
>     { dir: 'app', files: ['layout'] },
>     { dir: 'app/shop', files: ['page'] },
>   ]
>   expect(whoCatches(bare, { at: 1, file: 'page', kind: 'notFound' }))
>     .toEqual({ boundary: 'default-404', inside: 'app/layout.tsx' })
> })
> ```
>
> > [!hint]- Підказка 1
> > Межа сегмента — всередині його layout. Тож для `layout`, `template` і самого `error` старт пошуку — `event.at - 1`. Окремий хелпер «найближчий layout від індексу вниз» знадобиться двічі.
>
> > [!hint]- Підказка 2
> > Для помилки `inside` рахуй від `j`, для `notFound` — від `start`. Сегмент без layout (`settings`) рендериться в layout предка.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Segment = { dir: string; files: string[] }
> > type ThrowEvent = { at: number; file: string; kind: 'error' | 'notFound' }
> > type Caught = { boundary: string; inside: string | null }
> >
> > function whoCatches(segments: Segment[], event: ThrowEvent): Caught {
> >   const aboveBoundary = ['layout', 'template', 'error'].includes(event.file)
> >   const start = aboveBoundary ? event.at - 1 : event.at
> >   const name = event.kind === 'error' ? 'error' : 'not-found'
> >
> >   const layoutFor = (j: number): string | null => {
> >     for (let k = j; k >= 0; k--) {
> >       if (segments[k].files.includes('layout')) return `${segments[k].dir}/layout.tsx`
> >     }
> >     return null
> >   }
> >
> >   for (let j = start; j >= 0; j--) {
> >     if (segments[j].files.includes(name)) {
> >       const inside = event.kind === 'error' ? layoutFor(j) : layoutFor(start)
> >       return { boundary: `${segments[j].dir}/${name}.tsx`, inside }
> >     }
> >   }
> >
> >   if (event.kind === 'error') return { boundary: 'app/global-error.tsx', inside: null }
> >   return { boundary: 'default-404', inside: layoutFor(start) }
> > }
> > ```
> >
> > Ключ — `start`: межа сегмента обгортає `page`, `loading` і `not-found`, але не layout, template і саму себе. Друга тонкість — `inside`: error boundary замінює все під собою разом із вкладеними layouts, а not-found рендериться на місці сторінки в найглибшому вцілілому layout. Модель збігається з поведінкою 16.3.8: `crash/layout.tsx` → `app/error.tsx` у root layout, `notFound()` у `shop/layout.tsx` → `app/not-found.tsx`, `notFound()` у `catalog/x` → кореневий not-found у layout каталогу. Template, parallel routes і `global-not-found` модель свідомо опускає.

> [!task] Обгортка toActionResult
> level: middle · difficulty: medium · id: nextjs-core-13-task-02 · tags: server-actions, errors, digest
>
> Напиши `toActionResult(fn, report)` для Server Actions — без `next/navigation`, тож службові винятки розпізнавай сам за `digest`:
>
> - успіх → `{ ok: true, data }`;
> - `ValidationError` (є в заготовці) → `{ ok: false, fieldErrors }`, без `report`;
> - **службові винятки Next.js** — перекинути **той самий обʼєкт**, без `report`. Службовий — це значення з рядковим `digest`, що або починається з `NEXT_REDIRECT;` (redirect, `permanentRedirect`), або дорівнює `NEXT_HTTP_ERROR_FALLBACK;404`, `;403` чи `;401`. Як і `unstable_rethrow`, перевір також ланцюжок `cause` і перекинь знайдений службовий виняток;
> - усе інше — неочікуване: викликати `report(err)` і перекинути.
>
> Формати digest — як на 16.3.8: `NEXT_REDIRECT;push;/signup/done;307;`, `NEXT_HTTP_ERROR_FALLBACK;404`.
>
> ```ts starter
> class ValidationError extends Error {
>   constructor(public fieldErrors: Record<string, string[]>) {
>     super('Validation failed')
>   }
> }
>
> type ActionResult<T> =
>   | { ok: true; data: T }
>   | { ok: false; fieldErrors: Record<string, string[]> }
>
> async function toActionResult<T>(
>   fn: () => Promise<T>,
>   report: (err: unknown) => void,
> ): Promise<ActionResult<T>> {
>   try {
>     return { ok: true, data: await fn() }
>   } catch (err) {
>     // ❌ «надійність»: будь-яка помилка — це просто невдала дія
>     report(err)
>     return { ok: false, fieldErrors: {} }
>   }
> }
> ```
>
> ```ts tests
> const redirectErr = () => Object.assign(new Error('NEXT_REDIRECT'), { digest: 'NEXT_REDIRECT;push;/signup/done;307;' })
> const notFoundErr = () => Object.assign(new Error('NEXT_HTTP_ERROR_FALLBACK;404'), { digest: 'NEXT_HTTP_ERROR_FALLBACK;404' })
>
> test('успіх загортає дані в ok: true', async () => {
>   const report = vi.fn()
>   await expect(toActionResult(async () => 42, report)).resolves.toEqual({ ok: true, data: 42 })
>   expect(report).not.toHaveBeenCalled()
> })
>
> test('ValidationError стає fieldErrors без report', async () => {
>   const report = vi.fn()
>   const res = await toActionResult(async () => { throw new ValidationError({ email: ['Невалідний email'] }) }, report)
>   expect(res).toEqual({ ok: false, fieldErrors: { email: ['Невалідний email'] } })
>   expect(report).not.toHaveBeenCalled()
> })
>
> test('redirect і notFound перекидаються тим самим обʼєктом без report', async () => {
>   const report = vi.fn()
>   for (const make of [redirectErr, notFoundErr]) {
>     const err = make()
>     let caught: unknown
>     try { await toActionResult(async () => { throw err }, report) } catch (e) { caught = e }
>     expect(caught).toBe(err)
>   }
>   expect(report).not.toHaveBeenCalled()
> })
>
> test('службовий виняток у cause теж летить далі', async () => {
>   const report = vi.fn()
>   const inner = notFoundErr()
>   let caught: unknown
>   try { await toActionResult(async () => { throw new Error('getPost failed', { cause: inner }) }, report) } catch (e) { caught = e }
>   expect(caught).toBe(inner)
>   expect(report).not.toHaveBeenCalled()
> })
>
> test('неочікувана помилка: report і перекидання', async () => {
>   const report = vi.fn()
>   const err = new Error('SMTP down')
>   await expect(toActionResult(async () => { throw err }, report)).rejects.toThrow('SMTP down')
>   expect(report).toHaveBeenCalledWith(err)
> })
>
> test('схожі, але не службові значення — неочікувані', async () => {
>   const report = vi.fn()
>   const fakes = [new Error('NEXT_REDIRECT'), Object.assign(new Error('x'), { digest: 'NEXT_HTTP_ERROR_FALLBACK;500' }), Object.assign(new Error('y'), { digest: 2033829626 })]
>   for (const f of fakes) {
>     await expect(toActionResult(async () => { throw f }, report)).rejects.toBeDefined()
>   }
>   expect(report).toHaveBeenCalledTimes(3)
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу — службові винятки, потім `ValidationError`, і лише потім `report`. Інакше `redirect()` у моніторингу виглядатиме як аварія.
>
> > [!hint]- Підказка 2
> > Текст повідомлення не рахується: `new Error('NEXT_REDIRECT')` без `digest` — не редирект. Перевіряй `typeof err.digest === 'string'`, а для `cause` — цикл або рекурсію.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > class ValidationError extends Error {
> >   constructor(public fieldErrors: Record<string, string[]>) {
> >     super('Validation failed')
> >   }
> > }
> >
> > type ActionResult<T> =
> >   | { ok: true; data: T }
> >   | { ok: false; fieldErrors: Record<string, string[]> }
> >
> > const HTTP_FALLBACKS = new Set(['404', '403', '401'])
> >
> > function isFrameworkError(err: unknown): boolean {
> >   if (typeof err !== 'object' || err === null || !('digest' in err)) return false
> >   const digest = (err as { digest: unknown }).digest
> >   if (typeof digest !== 'string') return false
> >   if (digest.startsWith('NEXT_REDIRECT;')) return true
> >   const [code, status] = digest.split(';')
> >   return code === 'NEXT_HTTP_ERROR_FALLBACK' && HTTP_FALLBACKS.has(status)
> > }
> >
> > function findFrameworkError(err: unknown): unknown {
> >   let current: unknown = err
> >   while (current != null) {
> >     if (isFrameworkError(current)) return current
> >     current = current instanceof Error ? current.cause : undefined
> >   }
> >   return undefined
> > }
> >
> > async function toActionResult<T>(
> >   fn: () => Promise<T>,
> >   report: (err: unknown) => void,
> > ): Promise<ActionResult<T>> {
> >   try {
> >     return { ok: true, data: await fn() }
> >   } catch (err) {
> >     const framework = findFrameworkError(err)
> >     if (framework !== undefined) throw framework
> >     if (err instanceof ValidationError) return { ok: false, fieldErrors: err.fieldErrors }
> >     report(err)
> >     throw err
> >   }
> > }
> > ```
> >
> > Це спрощена копія того, що робить `unstable_rethrow` (у справжній ще й сигнали пререндеру й PPR). У застосунку імпортуй `unstable_rethrow` з `next/navigation`, а `report` залиш `onRequestError`: неочікувана помилка, перекинута з дії, дійде туди сама.

> [!task] Retry з паузою для кнопки «Спробувати ще»
> level: middle · difficulty: medium · id: nextjs-core-13-task-03 · tags: retry, backoff, timers
>
> Кнопка в `error.tsx` не має смикати сервер на кожен клік. Напиши `createRetryPolicy(retry, opts)` — обʼєкт з методами:
>
> - `request()` — користувач клікнув. Планує виклик `retry()` через паузу і повертає `'scheduled'`. Пауза: `baseMs` для першого повтору, далі множиться на `factor` (`500 → 1000 → 2000…`), але не більше `maxMs`.
> - Поки повтор заплановано і ще не відбувся — `request()` нічого не планує й повертає `'pending'`.
> - Після `maxAttempts` запланованих повторів — `'exhausted'` (час кнопці «Напиши в підтримку»).
> - `nextDelay()` — пауза, яку отримає наступний повтор, або `null`, якщо ліміт вичерпано.
> - `reset()` — помилка зникла або користувач пішов зі сторінки: скасувати запланований таймер і почати рахунок спочатку.
>
> Значення за замовчуванням: `{ baseMs: 500, factor: 2, maxMs: 4000, maxAttempts: 4 }`; передані поля їх перекривають.
>
> ```ts starter
> type RetryOptions = { baseMs: number; factor: number; maxMs: number; maxAttempts: number }
>
> function createRetryPolicy(retry: () => void, opts: Partial<RetryOptions> = {}) {
>   const o = { baseMs: 500, factor: 2, maxMs: 4000, maxAttempts: 4, ...opts }
>   return {
>     // ❌ кожен клік — одразу на сервер
>     request(): 'scheduled' | 'pending' | 'exhausted' {
>       retry()
>       return 'scheduled'
>     },
>     nextDelay(): number | null {
>       return o.baseMs
>     },
>     reset(): void {},
>   }
> }
> ```
>
> ```ts tests
> test('перший повтор — через baseMs, не раніше', () => {
>   vi.useFakeTimers()
>   const retry = vi.fn()
>   const p = createRetryPolicy(retry)
>   expect(p.request()).toBe('scheduled')
>   vi.advanceTimersByTime(499)
>   expect(retry).not.toHaveBeenCalled()
>   vi.advanceTimersByTime(1)
>   expect(retry).toHaveBeenCalledTimes(1)
> })
>
> test('подвійний клік не планує другий повтор', () => {
>   vi.useFakeTimers()
>   const retry = vi.fn()
>   const p = createRetryPolicy(retry)
>   p.request()
>   expect(p.request()).toBe('pending')
>   vi.advanceTimersByTime(10_000)
>   expect(retry).toHaveBeenCalledTimes(1)
> })
>
> test('паузи ростуть і впираються в maxMs', () => {
>   vi.useFakeTimers()
>   const p = createRetryPolicy(vi.fn(), { maxAttempts: 6, maxMs: 3000 })
>   const delays: Array<number | null> = []
>   for (let i = 0; i < 6; i++) {
>     delays.push(p.nextDelay())
>     p.request()
>     vi.runAllTimers()
>   }
>   expect(delays).toEqual([500, 1000, 2000, 3000, 3000, 3000])
> })
>
> test('після maxAttempts — exhausted і жодних таймерів', () => {
>   vi.useFakeTimers()
>   const retry = vi.fn()
>   const p = createRetryPolicy(retry, { maxAttempts: 2 })
>   p.request(); vi.runAllTimers()
>   p.request(); vi.runAllTimers()
>   expect(p.request()).toBe('exhausted')
>   expect(p.nextDelay()).toBeNull()
>   expect(vi.getTimerCount()).toBe(0)
>   expect(retry).toHaveBeenCalledTimes(2)
> })
>
> test('reset скасовує запланований повтор і починає з baseMs', () => {
>   vi.useFakeTimers()
>   const retry = vi.fn()
>   const p = createRetryPolicy(retry)
>   p.request(); vi.runAllTimers()
>   p.request()
>   p.reset()
>   expect(vi.getTimerCount()).toBe(0)
>   vi.advanceTimersByTime(10_000)
>   expect(retry).toHaveBeenCalledTimes(1)
>   expect(p.nextDelay()).toBe(500)
> })
> ```
>
> > [!hint]- Підказка 1
> > Тримай у замиканні два значення: скільки повторів уже заплановано (`attempts`) і id таймера (`null`, коли нічого не чекає).
>
> > [!hint]- Підказка 2
> > Пауза для повтору номер `n` (з нуля) — `Math.min(baseMs * factor ** n, maxMs)`. У колбеку таймера спершу обнули id, потім виклич `retry()`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type RetryOptions = { baseMs: number; factor: number; maxMs: number; maxAttempts: number }
> >
> > function createRetryPolicy(retry: () => void, opts: Partial<RetryOptions> = {}) {
> >   const o = { baseMs: 500, factor: 2, maxMs: 4000, maxAttempts: 4, ...opts }
> >   let attempts = 0
> >   let timer: ReturnType<typeof setTimeout> | null = null
> >
> >   const nextDelay = (): number | null =>
> >     attempts >= o.maxAttempts ? null : Math.min(o.baseMs * o.factor ** attempts, o.maxMs)
> >
> >   return {
> >     request(): 'scheduled' | 'pending' | 'exhausted' {
> >       if (timer !== null) return 'pending'
> >       const delay = nextDelay()
> >       if (delay === null) return 'exhausted'
> >       attempts++
> >       timer = setTimeout(() => {
> >         timer = null
> >         retry()
> >       }, delay)
> >       return 'scheduled'
> >     },
> >     nextDelay,
> >     reset(): void {
> >       if (timer !== null) clearTimeout(timer)
> >       timer = null
> >       attempts = 0
> >     },
> >   }
> > }
> > ```
> >
> > В `error.tsx` політику створюють один раз (`useRef` або `useState(() => createRetryPolicy(retry))`), кнопку блокують на `'pending'`, а на `'exhausted'` показують контакт підтримки. `reset()` викликають в ефекті-прибиранні — коли межа зникла після успішного `retry()` або користувач пішов зі сторінки.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Error Handling](https://nextjs.org/docs/app/getting-started/error-handling) — офіційний старт: очікувані й неочікувані помилки, межі, `catchError`, обробники подій.
- 🟡 [Next.js — error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error) — props `error`, `digest`, `retry`, `reset`, `global-error`.
- 🟡 [Next.js — catchError](https://nextjs.org/docs/app/api-reference/functions/catchError) — межа на рівні компонента (стабільна з 16.3).
- 🟡 [Next.js — not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) — `not-found` і експериментальний `global-not-found`.
- 🟡 [Next.js — loading.js: Status Codes](https://nextjs.org/docs/app/api-reference/file-conventions/loading#status-codes) — чому стрім дає `200` і `noindex`.
- 🔴 [Next.js — forbidden](https://nextjs.org/docs/app/api-reference/functions/forbidden) — `forbidden()` після початку стріму, `authInterrupts`.
- 🔴 [Next.js — unstable_rethrow](https://nextjs.org/docs/app/api-reference/functions/unstable_rethrow) — які API кидають службові винятки.
- 🔴 [Next.js — instrumentation.js](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation) — `onRequestError` і його контекст.
- 🟡 [React — Catching rendering errors with an Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) — як працюють межі в самому React.
- 🟢 [React — useActionState](https://react.dev/reference/react/useActionState) — стан форми з результатом дії.

> [!important] Підсумок
> - Очікувані помилки — значення (`{ ok: false, fieldErrors }`, `notFound()`), неочікувані — виняток і межа. Не змішуй: кидати валідацію — шум, ловити все — сховані баги.
> - `error.tsx` — Client Component під layout свого сегмента: помилку layout ловить батьківська межа, root layout — `global-error.tsx` з власними `<html>`/`<body>`.
> - У 16.3 — `retry()`: `router.refresh()` у Transition. `reset()` рендерить той самий payload і серверну помилку не відновлює.
> - У продакшні текст серверної помилки не йде в браузер: `error.message` — `#441`, а `digest` повʼязує екран з логом і `onRequestError`.
> - `catchError` — межа будь-де, що пропускає `redirect()`/`notFound()`. У власному `try/catch` — `unstable_rethrow(err)` першим рядком.
> - `notFound()` / `forbidden()` / `unauthorized()` дають справжній статус лише до стріму; під `<Suspense>` — `200` + `noindex`. `forbidden`/`unauthorized` і `global-not-found` — experimental.
> - Межі не ловлять обробники подій і асинхронний код; hydration mismatch — окремий клас ([[Next.js - 09. Як рендериться маршрут, RSC payload і hydration|тема 09]]).
