---
title: Ревалідація
id: nextjs-core-16
slug: 16-revalidation
order: 16
level: senior
skill: data
icon: px:database
tags: [nextjs, revalidation, revalidatetag, updatetag, revalidatepath, refresh, server-actions, webhooks, cache-components]
prerequisites: ["[[Next.js - 15. Cache Components і use cache]]", "[[Next.js - 04. Навігація під капотом]]"]
estimatedMinutes: 60
nextVersion: 16.3.8
---

# Ревалідація

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити різницю між `revalidateTag(tag, 'max')` (stale-while-revalidate) і `updateTag(tag)` (read-your-own-writes) і передбачити, хто й коли побачить зміну;
> - обрати між тегом і шляхом: `revalidatePath` для літерального шляху, патерну з `type: 'page'` чи `'layout'` і всього застосунку;
> - пояснити, що робить `refresh()` з `next/cache` і чому він не чіпає серверний кеш;
> - знати, які виклики в Server Action повертають новий UI в тій самій відповіді, а які ні, і що стається з Client Cache в браузері — твоєму й чужому;
> - написати вебхук для CMS на `revalidateTag(tag, { expire: 0 })` і пояснити, чому `updateTag` там недоступний;
> - скласти таблицю рішень: ревалідація за часом (`cacheLife`) чи на подію, тег чи шлях, `updateTag` чи `revalidateTag`.

## 🤔 Передбач

> [!quiz] Що побачать A і B після revalidateTag з 'max'?
> level: middle · type: output · id: nextjs-core-16-quiz-01
>
> Сторінка `/posts` показує `getPosts()` з `'use cache'` (`cacheTag('posts')`, `cacheLife('max')`). Користувач A додає пост кнопкою, яка викликає таку дію. Потім B, інший користувач, першим оновлює сторінку.
>
> ```ts
> // app/posts/actions.ts
> 'use server'
>
> export async function addPost(formData: FormData) {
>   await insertPost(String(formData.get('title')))
>   revalidateTag('posts', 'max')
> }
> ```
>
> - [x] A одразу після дії бачить старий список; B теж отримує старий, а новий з'явиться з наступного запиту
> - [ ] A одразу бачить новий список; B отримує старий
> - [ ] A бачить старий список; B отримує новий, бо його запит чекає на перерахунок
> - [ ] Обидва бачать новий список: revalidateTag одразу перерендерює всі сторінки з тегом
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. З профілем `'max'` записи лише позначаються застарілими (stale-while-revalidate). Відповідь дії не несе нового UI, тож A свого поста не бачить. Перший запит B отримує старе й запускає перерахунок у фоні, а свіже віддасть наступний. Ревалідацію запускає запит, а не виклик, і сторінки сам `revalidateTag` не рендерить.

## 🧒 Простими словами

Уяви кавʼярню з меню на дошці над касою. Переписувати дошку для кожного гостя довго, тож її пишуть раз і показують усім — це кеш. Власник змінив ціну. Можна повісити на дошку стікер «застаріло»: наступний гість ще побачить стару ціну, але бариста почне переписувати дошку, і вже наступний за ним побачить нову. Це `revalidateTag(tag, 'max')`. Можна зняти дошку одразу: наступний гість почекає хвилину, зате ніхто не побачить старої ціни, і власник теж. Це `updateTag`. Можна переписати дошку лише в одній залі (`revalidatePath`) — у сусідній висітиме стара. А ще кожен гість міг сфотографувати меню на телефон (Client Cache): ця фотографія сама не оновиться, хоч би що сталося з дошкою.

## 🔬 Як це працює насправді

### 🧭 Що таке ревалідація і де живуть копії

**Ревалідація** (revalidation) — оновлення закешованих даних. Кешувати вміємо з [[Next.js - 15. Cache Components і use cache|теми 15]]: `'use cache'` зберігає результат функції чи компонента, `cacheLife` задає йому час життя, `cacheTag` вішає мітки. Тепер питання зворотне: дані змінились — як прибрати старі копії і хто побачить нові.

Способів два:

- **За часом** (time-based) — запис старіє сам за профілем `cacheLife`. Нічого викликати не треба, але між зміною й оновленням минає до `revalidate` секунд.
- **На подію** (on-demand) — після мутації ти явно кажеш, що застаріло: `revalidateTag`, `updateTag`, `revalidatePath`. Плюс `refresh()`, який нічого не інвалідує, а лише перемальовує поточну сторінку.

Щоб передбачати поведінку, тримай у голові **три місця**, де лежить копія тих самих даних:

1. **Записи `'use cache'`** на сервері — результат `getPosts()` з ключем і тегами.
2. **Пререндерений маршрут** — HTML і RSC payload сторінки (static shell), зібрані на `next build` або пізніше. Він теж має теги: теги всіх кешів, що потрапили в shell, плюс «мʼякі» теги шляху `_N_T_/…`.
3. **Client Cache** у браузері кожного користувача — RSC payload відвіданих і prefetch-нутих сторінок ([[Next.js - 04. Навігація під капотом#🗃️ Client Cache і staleTimes|тема 04]]).

Ревалідація на сервері працює з першими двома: позначає записи з тегом застарілими (stale) або простроченими (expired). А **перерахунок запускає запит, а не виклик**: `revalidateTag` нічого не рендерить сам, сторінки оновлюються, коли їх відвідують. Тому тисяча сторінок з тегом `products` не перебудовуються разом після одного виклику. Client Cache — окрема історія, до неї повернемось у [[#👥 Хто що бачить: автор, інші користувачі й Client Cache]].

> [!quiz] Перевір себе: що правда про ревалідацію на подію
> level: middle · type: multi · id: nextjs-core-16-quiz-02
> - [x] Перерахунок запускає наступний запит, а не сам виклик ревалідації
> - [x] `revalidateTag` зачіпає і запис `'use cache'`, і пререндерену сторінку з цим тегом
> - [x] Client Cache інших користувачів сервер очистити не може
> - [ ] `revalidateTag` одразу перебудовує у фоні всі сторінки з тегом
> - [ ] Ревалідація в Server Action оновлює копію в браузері кожного відвідувача
> - [ ] Без `cacheTag` сторінку ревалідувати неможливо
>
> **Пояснення:** виклик лише позначає записи застарілими чи простроченими, тому тисяча сторінок з тегом не перебудовується разом: кожна оновлюється, коли її відвідують. Client Cache живе в чужому браузері, і сервер про нього не знає. Теги не єдиний шлях: `revalidatePath` працює через «м'які» теги шляху, які маршрут отримує автоматично.

### 🧪 Стенд: одна сторінка, шість способів

Усі спостереження в розділі — з одного застосунку під `next build && next start` (Next.js 16.3.8, `cacheComponents: true`) і двох незалежних браузерів: **A** — автор, що додає пост, **B** — інший користувач. «База» — JSON-файл, а читання з неї загорнуте в кеш з затримкою в 1 секунду, щоб було видно, хто чекає на перерахунок:

```ts
// lib/db.ts — «база даних» у файлі, щоб її бачили всі процеси й запити
import 'server-only'
import { readFile, writeFile } from 'node:fs/promises'

export type Post = { id: number; title: string }
const FILE = process.cwd() + '/data.json'

export async function readPosts(): Promise<Post[]> {
  try {
    return JSON.parse(await readFile(FILE, 'utf8'))
  } catch {
    return [{ id: 1, title: 'Перший пост' }]
  }
}

export async function insertPost(title: string) {
  const posts = await readPosts()
  posts.push({ id: posts.length + 1, title })
  await writeFile(FILE, JSON.stringify(posts))
}
```

```ts
// lib/posts.ts
import { cacheLife, cacheTag } from 'next/cache'
import { readPosts } from './db'

export async function getPosts() {
  'use cache'
  cacheTag('posts')
  cacheLife('max')
  await new Promise((r) => setTimeout(r, 1000)) // повільне джерело
  const posts = await readPosts()
  const at = new Date().toISOString().slice(11, 19)
  console.log(`[getPosts] обчислено о ${at}, постів: ${posts.length}`)
  return { posts, at }
}
```

> [!note] Чому «база» — файл
> Файл бачать і рендер сторінки, і Server Action, і Route Handler, тож зміна з будь-якого боку справжня, як у БД. Читання стоїть **усередині** `'use cache'`, тому `next build` не вимагає `<Suspense>`: результат іде в static shell. Зі справжньою БД патерн той самий.

Сторінка показує список з кешу, час обчислення кешу і динамічну «дірку» з часом рендера. Дірка потрібна як індикатор: якщо час у ній змінився, сервер перерендерив маршрут.

```tsx
// app/posts/now.tsx — динамічна «дірка»: показує, чи сервер ререндерив маршрут
import { connection } from 'next/server'

export async function Now() {
  await connection()
  return <p id="now">рендер о {new Date().toISOString().slice(11, 19)}</p>
}
```

```tsx
// app/posts/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { getPosts } from '@/lib/posts'
import { Now } from './now'
import * as actions from './actions'

export default async function PostsPage() {
  const { posts, at } = await getPosts() // кешовано: потрапляє в static shell
  return (
    <main>
      <p id="at">кеш від {at}</p>
      <ul id="list">
        {posts.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
      <Suspense fallback={<p id="now">…</p>}>
        <Now />
      </Suspense>
      <form>
        <input name="title" defaultValue="Новий пост" />
        <button id="b-rt" formAction={actions.addWithRevalidateTag}>revalidateTag</button>
        <button id="b-ut" formAction={actions.addWithUpdateTag}>updateTag</button>
        <button id="b-rp" formAction={actions.addWithRevalidatePath}>revalidatePath</button>
        <button id="b-rf" formAction={actions.addWithRefresh}>refresh</button>
        <button id="b-e0" formAction={actions.addWithExpire0}>expire: 0</button>
        <button id="b-no" formAction={actions.addWithNothing}>без ревалідації</button>
      </form>
      <Link id="to-other" href="/other">Інша сторінка</Link>
    </main>
  )
}
```

Друга сторінка, `/other`, рендерить кількість постів з того самого `getPosts()` і повністю статична. У таблиці `next build` вони виглядають так:

```text
├ ○ /other                     30d      1y
├ ◐ /posts                     30d      1y
```

`○` — статична сторінка, `◐` — Partial Prerender: shell з кешем плюс дірка `Now`. Колонки Revalidate/Expire взято з профілю `max`. На `next build` `getPosts` виконався **один раз** на обидві сторінки: ключ однаковий, запис один.

Дії — у файлі з `'use server'`. Тут вони мінімальні: записати пост і викликати один API. Як Server Action стає POST-запитом, валідація й безпека — тема 21 основного посібника.

```ts
// app/posts/actions.ts
'use server'

import { refresh, revalidatePath, revalidateTag, updateTag } from 'next/cache'
import { insertPost } from '@/lib/db'

function title(formData: FormData) {
  return String(formData.get('title') ?? 'без назви')
}

export async function addWithRevalidateTag(formData: FormData) {
  await insertPost(title(formData))
  revalidateTag('posts', 'max')
}

export async function addWithUpdateTag(formData: FormData) {
  await insertPost(title(formData))
  updateTag('posts')
}

export async function addWithRevalidatePath(formData: FormData) {
  await insertPost(title(formData))
  revalidatePath('/posts')
}

export async function addWithRefresh(formData: FormData) {
  await insertPost(title(formData))
  refresh()
}

export async function addWithExpire0(formData: FormData) {
  await insertPost(title(formData))
  revalidateTag('posts', { expire: 0 })
}

export async function addWithNothing(formData: FormData) {
  await insertPost(title(formData))
}
```

### 🏷️ revalidateTag: stale-while-revalidate на вимогу

```ts
revalidateTag(tag: string, profile: string | { expire?: number }): void
```

`revalidateTag` позначає всі записи з тегом **застарілими**. Наступний запит до таких даних отримує старе значення одразу й запускає перерахунок у фоні — це stale-while-revalidate (SWR), тільки «таймер» спрацював на твою команду. Другий аргумент обовʼязковий з Next.js 16 і каже, **як довго** ще можна віддавати старе:

- **`'max'`** — рекомендоване значення: вікно в рік, тож користувачі завжди отримують старе, поки йде перерахунок.
- **Інший профіль `cacheLife`** (`'hours'`, власний з `next.config`) — з нього читається лише `expire`. Для `'hours'` старе можна віддавати добу після виклику.
- **`{ expire: N }`** — те саме числом, у секундах. Після `revalidateTag('posts', { expire: 5 })` запит через секунду отримав `x-nextjs-cache: STALE`, а запит через 7 секунд без трафіку чекав 1,07 с і отримав `MISS` зі свіжими даними.
- **`{ expire: 0 }`** — старе не віддається ніколи: наступний запит до статичної сторінки чекає на перерахунок (`MISS`). Маршрут з динамічним параметром під `partialPrefetching: true` поводиться інакше: одразу віддає shell, а свіжі дані доїжджають стрімом (`private`, `x-nextjs-postponed: 1`), і лише потім іде `HIT` ([[Next.js - 17. ISR і CDN|тема 17]]). Це варіант для місць, де `updateTag` недоступний (вебхуки).

Профіль — це межа, за якою правильність даних важливіша за швидкість.

Викликати `revalidateTag` можна в Server Functions і Route Handlers. У Client Components і `proxy.ts` — ні: це серверна функція. Тег чутливий до регістру й не довший за 256 символів (довший ніколи не призначається запису, тож і ревалідувати нічого).

Що показав стенд після кнопки «revalidateTag» (`'max'`):

| Хто й що робить | Що бачить |
|---|---|
| A одразу після дії | **старий список**, час у дірці `Now` той самий: сторінку не перерендерено |
| B переходить на `/posts` через `Link` | старий список; цей запит запустив перерахунок (у лозі `[getPosts] обчислено`) |
| B оновлює `/posts` | новий список (коли фоновий перерахунок встиг) |
| B відкриває `/other` вперше після виклику | `x-nextjs-cache: STALE`, «постів: 1» за 2 мс |
| B оновлює `/other` ще раз | `HIT`, «постів: 2» (коли фоновий перерахунок встиг) |

Автор дії свого поста **не побачив**: відповідь на дію не містила нового UI, а перше оновлення сторінки віддало старе. Для блогу чи каталогу, де секунда затримки нікого не турбує, це правильна поведінка: ніхто не чекає. Для «я щойно зберіг, а воно не зберіглось» — ні, і для цього є `updateTag`.

> [!note] Однаргументна форма застаріла
> `revalidateTag('posts')` без профілю у TypeScript — помилка `Expected 2 arguments, but got 1.` Якщо її придушити, виклик працює як `{ expire: 0 }`, а сервер пише в лог: `"revalidateTag" without the second argument is now deprecated, add second argument of "max" or use "updateTag".` Документація попереджає, що цю поведінку можуть прибрати. У міграції з 15: у Server Actions — `updateTag(tag)`, в інших місцях — `revalidateTag(tag, 'max')` або `{ expire: 0 }`.

> [!diagram] revalidateTag('posts', 'max'): хто що отримує
> ```yaml
> layout: timeline
> nodes:
>   - { id: act, at: "0 с", label: "A · Server Action", code: "insertPost(...)\nrevalidateTag('posts', 'max')", note: "запис позначено stale", tone: violet }
>   - { id: a1, at: "0 с", label: "A · відповідь дії", text: "старий список", note: "нового UI у відповіді немає", tone: yellow, icon: "px:warning" }
>   - { id: b1, at: "+5 с", label: "B · перший запит", text: "старий список за 2 мс", note: "x-nextjs-cache: STALE, запущено перерахунок", tone: orange }
>   - { id: bg, at: "+5…6 с", label: "сервер · у фоні", code: "getPosts()", note: "1 с на перерахунок, ніхто не чекає", tone: blue, icon: "px:database" }
>   - { id: b2, at: "+7 с", label: "B · наступний запит", text: "новий список", note: "HIT, коли фоновий перерахунок встиг", tone: green, icon: "px:check" }
> steps:
>   - { show: act, line: "act:2", note: "A додає пост. revalidateTag лише позначає записи з тегом posts застарілими — нічого не рендерить." }
>   - { show: a1, note: "Відповідь на дію повертається без нового UI: SWR-профіль — єдиний виняток серед API ревалідації. A бачить свій старий екран." }
>   - { show: b1, note: "Перший запит після виклику отримує старе одразу — у цьому суть stale-while-revalidate." }
>   - { show: bg, note: "Цей самий запит запустив перерахунок getPosts() у фоні. Ревалідацію запускає запит, а не виклик." }
>   - { show: b2, note: "Наступний запит отримує свіжий запис. Тепер новий пост бачать усі, і A теж — після оновлення сторінки." }
> ```
> Час умовний. Старе одразу, нове з наступного запиту: швидко для всіх, але автор зміни свого результату не бачить.

> [!quiz] Скільки разів A має оновити сторінку, щоб побачити свій пост?
> level: middle · type: output · id: nextjs-core-16-quiz-03
>
> Дія з минулого прикладу (`insertPost`, потім `revalidateTag('posts', 'max')`) щойно виконалась у A. Він лишається на `/posts` і тричі дивиться на список: одразу після дії, після першого оновлення сторінки (F5) і після другого. `getPosts` обчислюється 1 секунду.
>
> - [x] Старий, старий, новий (коли фоновий перерахунок встиг): перше оновлення віддає STALE і запускає перерахунок
> - [ ] Старий, новий, новий: перше ж оновлення покаже пост
> - [ ] Новий, новий, новий: дія повертає свіже дерево
> - [ ] Старий, старий, старий: нове з'явиться лише після закінчення `cacheLife`
>
> **Пояснення:** з `'max'` ніхто не чекає, навіть автор. Перше оновлення A теж отримує старий запис і саме запускає перерахунок у фоні, а друге, коли фоновий перерахунок встиг, потрапляє в свіжий (HIT). Варіант «новий одразу» — це поведінка `updateTag`. Чекати закінчення `cacheLife` не треба: `revalidateTag` позначив запис застарілим, і час життя профілю вже нічого не вирішує.

> [!quiz] Заповни пропуски: вебхук CMS
> level: middle · type: fill · id: nextjs-core-16-quiz-04
>
> ```ts fill
> // app/api/revalidate/route.ts
> import { revalidateTag } from '[[next/cache]]'
>
> export async function POST(request: Request) {
>   const { tag, urgent } = (await request.json()) as { tag: string; urgent?: boolean }
>   // urgent: старе показувати вже не можна
>   if (urgent) revalidateTag(tag, { [[expire]]: [[0]] })
>   else revalidateTag(tag, [['max'|"max"]])
>   return Response.json({ ok: true })
> }
> ```
>
> **Пояснення:** `revalidateTag` живе в `next/cache`, а не в `next/navigation` (там `redirect` і `notFound`). Другий аргумент обов'язковий: `'max'` дає stale-while-revalidate, а `{ expire: 0 }` протермінує запис негайно, і наступний запит чекатиме свіжих даних. Однаргументна форма в TypeScript — помилка, а в рантаймі працює як `{ expire: 0 }` з попередженням у логу.

### ✍️ updateTag: read-your-own-writes

```ts
updateTag(tag: string): void
```

`updateTag` **протерміновує** записи з тегом одразу: наступне читання не отримає старого, а дочекається свіжих даних. Це read-your-own-writes — «прочитай власний запис»: користувач, що щойно щось змінив, бачить свою зміну, а не кеш.

Викликати його можна **лише в Server Actions**. З Route Handler — помилка під час запиту (відповідь 500):

```text
Error: updateTag can only be called from within a Server Action. To invalidate cache tags in Route Handlers or other contexts, use revalidateTag instead.
```

Після кнопки «updateTag» стенд показав зовсім іншу картину:

| Хто й що робить | Що бачить |
|---|---|
| A одразу після дії | **новий список** і новий час у `Now`: відповідь на дію принесла свіже дерево |
| B переходить на `/posts` через `Link` | новий список |
| B оновлює `/other` | новий («постів: 2»), без жодного `STALE` |
| Запит до `/other` з `curl` через 200 мс після дії | чекав ~0,9 с і отримав новий |

Ніхто не побачив старого — ціною того, що перший запит після інвалідації **чекає** на перерахунок. Для кнопки «Зберегти» це правильний обмін: автор зміни і так чекає відповіді.

Типовий патерн — створити запис, протермінувати теги й перекинути на сторінку результату:

```ts
// app/posts/new/actions.ts
'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { insertPost } from '@/lib/db'

export async function createPost(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  if (!title) return
  await insertPost(title)
  updateTag('posts') // ✅ до redirect: список уже свіжий
  redirect('/posts')
}

export async function createPostBuggy(formData: FormData) {
  await insertPost(String(formData.get('title') ?? ''))
  redirect('/posts')
  updateTag('posts') // ❌ не виконається: redirect кидає виняток
}
```

`redirect` кидає спеціальний виняток, і код після нього не виконується. На стенді `createPost` привів на `/posts` з новим постом, а `createPostBuggy` — зі старим списком, який не оновився і після перезавантаження. TypeScript тут не допоможе: недосяжний код після `redirect` лише підсвічується в редакторі, а не ламає збірку.

Якщо пост мають побачити кілька сторінок з різними тегами, протермінуй усі: `updateTag('posts')` для списків і `` updateTag(`post-${id}`) `` для сторінки самого поста. Теги ставлять ще в кешованих функціях (тема 15).

Чим тоді `updateTag` відрізняється від `revalidateTag(tag, { expire: 0 })`? На кеш вони діють однаково: записи протерміновано, наступний запит чекає на свіжі дані. Різниця в місці виклику: `updateTag` — лише в Server Action, і сама назва каже читачеві коду, що автор зміни має її побачити; `revalidateTag` з `{ expire: 0 }` працює і в Route Handler. На стенді кнопка «expire: 0» теж повернула автору свіже дерево у відповіді на дію, як `updateTag`.

> [!quiz] Склади дію «створити пост і показати його автору»
> level: middle · type: order · id: nextjs-core-16-quiz-05
>
> ```ts order
> 'use server'
> export async function createPost(formData: FormData) {
>   const title = String(formData.get('title') ?? '').trim()
>   if (!title) return
>   const id = await insertPost(title)
>   updateTag('posts')
>   redirect(`/posts/${id}`)
> }
>   revalidateTag('posts', 'max') // ✗
>   redirect('/posts') // ✗
> ```
>
> **Пояснення:** спершу вхідні дані, потім запис у базу, потім інвалідація, і лише наприкінці `redirect`: він кидає виняток, тож усе після нього не виконується. `revalidateTag` з `'max'` тут не годиться, бо автор хоче одразу побачити свій пост, а SWR віддасть йому старе.

> [!quiz] Порядок updateTag і redirect
> level: senior · type: output · id: nextjs-core-16-quiz-06
>
> Дві дії відрізняються лише порядком двох рядків. Обидві збираються без помилок. Після кожної автор потрапляє на `/posts`.
>
> ```ts
> export async function createPost(formData: FormData) {
>   await insertPost(String(formData.get('title')))
>   updateTag('posts')
>   redirect('/posts')
> }
>
> export async function createPostBuggy(formData: FormData) {
>   await insertPost(String(formData.get('title')))
>   redirect('/posts')
>   updateTag('posts')
> }
> ```
>
> - [x] `createPost` приведе до свіжого списку; `createPostBuggy` до старого, і після перезавантаження теж
> - [ ] Обидві приведуть до свіжого списку: порядок викликів не важливий
> - [ ] `createPost` приведе до свіжого списку; `createPostBuggy` не збереться: TypeScript відхилить недосяжний код
> - [ ] `createPostBuggy` покаже старий список лише до першого перезавантаження, далі свіжий
>
> **Пояснення:** `redirect` кидає спеціальний виняток, тому `updateTag` після нього не виконується, і кеш лишається старим. TypeScript недосяжний код не відхиляє, лише підсвічує в редакторі. Старий список не оновиться й після F5, бо ніхто нічого не інвалідував: його оновить хіба закінчення `cacheLife` чи інша ревалідація.

### 🛣️ revalidatePath: шлях замість тегу

```ts
revalidatePath(path: string, type?: 'page' | 'layout'): void
```

`revalidatePath` інвалідує все закешоване для шляху, коли ти не знаєш (чи не хочеш знати) тегів. Під капотом це ті самі теги, тільки мʼякі: маршрут `/blog/hello` автоматично має `_N_T_/layout`, `_N_T_/blog/layout`, `_N_T_/blog/hello/layout` і `_N_T_/blog/hello`, а `revalidatePath('/blog/hello')` інвалідує записи з цими тегами. Викликати можна в Server Functions і Route Handlers.

Форми виклику:

```ts
revalidatePath('/blog/a') // одна конкретна сторінка
revalidatePath('/blog/[slug]', 'page') // усі сторінки цього page-файлу
revalidatePath('/blog', 'layout') // layout /blog, вкладені layouts і всі сторінки під ними
revalidatePath('/', 'layout') // усе: кожен закешований маршрут і Client Cache викликача
```

Стенд для шляхів: `app/blog/layout.tsx` із закешованим меню і `app/blog/[slug]/page.tsx` зі сторінками `a` і `b` з `generateStaticParams`. Ось що оновилося після кожного виклику:

| Виклик у дії | `/blog/a` | `/blog/b` |
|---|---|---|
| `revalidatePath('/blog/a')` | оновилась | стара |
| `revalidatePath('/blog/[slug]', 'page')` | оновилась | оновилась |
| `revalidatePath('/blog/[slug]')` без `type` | стара | стара |
| `revalidatePath('/blog', 'layout')` | оновилась | оновилась |
| `revalidatePath('/', 'layout')` | оновилась | оновилась |

Третій рядок — тиха пастка: патерн з динамічним сегментом без `type` не робить **нічого**, лише пише в лог сервера:

```text
Warning: a dynamic page path "/blog/[slug]" was passed to "revalidatePath", but the "type" parameter is missing. This has no effect by default
```

Різниця між `'page'` і `'layout'` — глибина. `revalidatePath('/blog/[slug]', 'page')` зачіпає лише сторінки цього `page.tsx` і **не** зачіпає вкладене `/blog/[slug]/[author]`. З `'layout'` інвалідуються layout сегмента, усі вкладені layouts і сторінки під ними. Ще дві деталі з документації: шлях пишуть без `/page` чи `/layout` у кінці (для цього є `type`), а з rewrites передають **destination** — шлях до файлу маршруту, а не URL в адресному рядку.

Головна обмеженість `revalidatePath` — він інвалідує **маршрут**, а не дані. На стенді після кнопки «revalidatePath» (`revalidatePath('/posts')`):

| Хто й що робить | Що бачить |
|---|---|
| A одразу після дії | новий список: дія повернула свіже дерево |
| B на `/posts` | новий список |
| B оновлює `/other` (двічі, з паузою) | **старий** («постів: 1») |

`getPosts()` уже перерахувався — `/posts` показує новий пост. Але пререндерений `/other` — окремий маршрут зі своїм тегом шляху, його ніхто не інвалідував, і він віддає копію з `next build`. Документація прямо радить: де можна, бери теги — вони точніші й не інвалідують зайвого. `revalidatePath` доречний, коли зміна справді прив'язана до сторінки (профіль користувача на `/profile`) або тегів немає зовсім (наприклад, у Route Handler з `fetch` і `cache: 'force-cache'`).

> [!note] revalidatePath у Server Action поки що зачіпає більше
> Документація попереджає: виклик з Server Function оновлює поточну сторінку одразу, але **поки що** також змушує оновитися всі раніше відвідані сторінки при наступному переході на них. Це назване тимчасовою поведінкою, тож не будуй на ній логіку.

> [!quiz] Що зробить revalidatePath без type
> level: middle · id: nextjs-core-16-quiz-07
>
> У застосунку є сторінки `/blog/a` і `/blog/b`, пререндерені через `generateStaticParams`. Дія викликає:
>
> ```ts
> revalidatePath('/blog/[slug]')
> ```
>
> - [ ] Оновляться обидві сторінки: патерн охоплює всі slug
> - [ ] Оновиться лише перша пререндерена сторінка, `/blog/a`
> - [ ] `next build` впаде з помилкою про відсутній `type`
> - [x] Нічого не оновиться, а в логу сервера з'явиться попередження, що параметр `type` відсутній
>
> **Пояснення:** для патерна з динамічним сегментом `type` обов'язковий: без нього виклик не має ефекту, лише пише `Warning: a dynamic page path "/blog/[slug]" was passed to "revalidatePath", but the "type" parameter is missing`. Виправлення: `revalidatePath('/blog/[slug]', 'page')`. Це рантайм-попередження, на збірку воно не впливає.

> [!quiz] Що побачить B після revalidatePath('/posts')
> level: senior · type: output · id: nextjs-core-16-quiz-08
>
> Сторінки `/posts` і статична `/other` показують дані з одного й того ж `getPosts()` (тег `posts`). A додає пост дією з `insertPost` та `revalidatePath('/posts')`. Потім B оновлює `/posts`, а далі двічі, з паузою, оновлює `/other`.
>
> - [x] `/posts` свіжий; `/other` старий обидва рази
> - [ ] Обидві сторінки свіжі: `getPosts` уже перерахувався
> - [ ] `/posts` свіжий; `/other` старий першого разу й свіжий другого, як STALE
> - [ ] Обидві старі: `revalidatePath` не торкається кешу даних
>
> **Пояснення:** `revalidatePath` інвалідує маршрут, а не дані. `/posts` перерендерився, і заразом перерахувався `getPosts`, тому там свіжий список. Але пререндерений `/other` має власний тег шляху, його ніхто не інвалідував, і він віддає копію зі збірки. Для всіх сторінок з цими даними потрібен тег: `updateTag('posts')`.

### 🔄 refresh(): перемалювати, нічого не інвалідуючи

```ts
refresh(): void // з 'next/cache', лише в Server Action
```

`refresh()` просить сервер ще раз відрендерити **поточний маршрут** і повернути новий RSC payload у відповіді на дію. Серверний кеш він не чіпає: записи `'use cache'` і пререндерені сторінки лишаються як були.

На стенді після кнопки «refresh» час у дірці `Now` змінився (сервер перерендерив маршрут), але список і «кеш від …» лишилися старими у A, у B і після будь-якої кількості перезавантажень. Новий пост у файлі є, проте кешований `getPosts` про нього не знає і не дізнається, поки його не ревалідують.

Звідси правило: `refresh()` — для даних, які **не кешуються**. Динамічна дірка читає БД напряму (кошик, лічильник, статус замовлення) — після мутації інвалідувати нічого, треба лише перемалювати. Якщо дані в кеші, потрібен `updateTag` чи `revalidatePath`: вони теж повертають новий UI в тій самій відповіді.

У Route Handler `refresh()` кидає `Error: refresh can only be called from within a Server Action.` А якщо дані змінились «не через твою дію» (подія з WebSocket, кнопка «оновити»), потрібен клієнтський `router.refresh()`: порівняння двох refresh — у [[Next.js - 04. Навігація під капотом#🔄 Оновити маршрут: два refresh|темі 04]].

> [!quiz] Що оновить refresh()
> level: middle · id: nextjs-core-16-quiz-09
>
> Дія записує пост у файл і викликає `refresh()`. Сторінка `/posts` містить кешований `getPosts()` (`'use cache'`) і незакешовану дірку `Now` з часом рендера. Що станеться?
>
> - [ ] Оновиться вся сторінка, як після `updateTag`
> - [ ] Список оновиться лише в автора, у інших лишиться старий
> - [ ] Браузер зробить окремий GET-запит і візьме свіже з сервера
> - [x] Зміниться час у дірці `Now`, а кешований список залишиться старим для всіх
>
> **Пояснення:** `refresh()` просить сервер перерендерити поточний маршрут у відповіді на дію, але серверний кеш не чіпає. Незакешоване оновиться, а запис `getPosts` ні, і нового поста він не побачить, поки його не ревалідують. Окремого GET немає: свіже дерево їде у тій самій відповіді на POST.

### 📮 Що приносить відповідь на дію

Server Action — це POST на поточний маршрут. Документація описує корисну оптимізацію: якщо дія інвалідувала дані **негайно**, Next.js у тому самому запиті виконує дію, перерендерює поточний маршрут і повертає в одному Flight-стрімі і значення, яке повернула дія, і новий RSC payload. Клієнт застосовує його без додаткового запиту.

Новий UI у відповіді є, якщо дія:

| Що зробила дія | Новий UI у відповіді | Що бачив A на стенді |
|---|---|---|
| `updateTag(tag)` | так | новий список і новий `Now` |
| `revalidatePath(path)` | так | новий список і новий `Now` |
| `refresh()` | так, але з тим самим кешем | новий `Now`, старий список |
| `revalidateTag(tag, { expire: 0 })` | так | новий список і новий `Now` |
| змінила cookies (`cookies().set/delete`) | так | — |
| `redirect(url)` | так, payload нової сторінки | — |
| `revalidateTag(tag, 'max')` | **ні** | усе старе |
| нічого з цього | ні, лише значення дії | усе старе |

Рядок з `{ expire: 0 }` у документації окремо не згадано: там сказано, що виняток — `revalidateTag` зі **stale-while-revalidate**-профілем. `{ expire: 0 }` не SWR, тож поводиться як `updateTag`.

> [!diagram] Одна відповідь: дія, інвалідація, новий UI
> ```yaml
> layout: flow
> nodes:
>   - { id: btn, label: "браузер A", text: "клік «updateTag»", tone: gray, icon: "px:monitor" }
>   - { id: act, label: "сервер · дія", code: "await insertPost(title)\nupdateTag('posts')", tone: violet }
>   - { id: rnd, label: "сервер · рендер /posts", code: "await getPosts()", note: "запис протерміновано → перерахунок", tone: blue, icon: "px:database" }
>   - { id: res, label: "відповідь POST", text: "значення дії + RSC payload", note: "один Flight-стрім", tone: mint }
>   - { id: ui, label: "браузер A", text: "новий список", note: "Client Cache очищено", tone: green, icon: "px:check" }
> edges:
>   - { from: btn, to: act, label: "POST /posts" }
>   - { from: act, to: rnd, label: "та сама обробка" }
>   - { from: rnd, to: res, label: "свіже дерево" }
>   - { from: res, to: ui, label: "застосувати" }
> steps:
>   - { focus: btn, note: "A натискає кнопку форми. Браузер шле POST на поточний маршрут з ідентифікатором дії." }
>   - { move: { from: btn, to: act, value: "title = «Пост від A»" }, line: "act:1", note: "Дія записує пост у базу." }
>   - { line: "act:2", note: "updateTag протерміновує всі записи з тегом posts. Це негайна інвалідація, тож Next.js вирішує перерендерити поточний маршрут у цьому ж запиті." }
>   - { move: { from: act, to: rnd, value: "/posts" }, note: "Рендер /posts викликає getPosts(): запис протерміновано, тому функція виконується знову — 1 с." }
>   - { move: { from: rnd, to: res, value: "RSC payload" }, note: "У відповідь їдуть і результат дії, і нове дерево сторінки. Окремого GET не буде." }
>   - { move: { from: res, to: ui, value: "2 пости" }, note: "Браузер застосовує payload: A бачить свій пост. Заодно роутер очищає весь Client Cache цього браузера." }
> ```
> З `revalidateTag(tag, 'max')` ланцюжок обривається після дії: новий рендер не потрібен, бо старе ще можна віддавати.

> [!quiz] Перевір себе: які дії повернуть автору свіже дерево в тому ж POST
> level: senior · type: multi · id: nextjs-core-16-quiz-10
> - [x] `updateTag('posts')`
> - [x] `revalidatePath('/posts')`
> - [x] `revalidateTag('posts', { expire: 0 })`
> - [x] `refresh()`, хоча кеш лишиться тим самим
> - [ ] `revalidateTag('posts', 'max')`
> - [ ] Лише `insertPost(...)` без жодного виклику ревалідації
> - [ ] `router.refresh()` у клієнтському компоненті після завершення дії
>
> **Пояснення:** якщо дія інвалідувала дані негайно, Next.js у тому самому запиті перерендерює маршрут і повертає значення дії разом з новим RSC payload. Виняток це `revalidateTag` зі SWR-профілем: записи лише позначено застарілими, рендерити нічого, тож відповідь без нового UI. `router.refresh()` це окремий запит після дії, а не частина тієї ж відповіді.

### 👥 Хто що бачить: автор, інші користувачі й Client Cache

Серверна частина вирішує, що отримає **наступний запит**. Але браузер може взагалі не зробити запиту: при переході через `Link` роутер бере RSC payload з Client Cache, поки той «свіжий» за `stale` (для профілю `default` і `max` — 5 хвилин, сервер передає його заголовком `x-nextjs-stale-time: 300`).

Правило з документації: будь-яка функція ревалідації, викликана в Server Action (`revalidateTag`, `revalidatePath`, `updateTag`, `refresh`), **одразу очищає весь Client Cache** — але лише в браузері того, хто викликав дію. На стенді це видно у вкладці Network: одразу після POST браузер A заново prefetch-ить `/other`.

Чужий Client Cache сервер очистити не може — він про нього не знає. Сценарій: B відкрив `/posts`, і `Link` на `/other` prefetch-нувся. Потім A додав пост через `updateTag`. B клікає `Link` на `/other`:

- **жодного запиту на сервер**, на екрані «постів: 1» з prefetch-кешу;
- B оновлює сторінку — «постів: 2»: повний запит пішов на сервер, де запис уже свіжий.

Тобто інші користувачі під час клієнтської навігації можуть бачити старе до `stale` секунд, навіть після `updateTag`. Здебільшого це прийнятно. Якщо ні — зменшуй `stale` у профілі `cacheLife` (не нижче 30 с: клієнт тримає мінімум, щоб prefetch не протух до кліку) або оновлюй екрани інших користувачів явно (поллінг, WebSocket + `router.refresh()`). Сторінки з динамічною діркою при переході однаково ходять на сервер за діркою: на стенді `/posts` у B після `updateTag` показала новий список і через `Link`.

> [!warning] Браузерний HTTP-кеш і prefetch після дії
> На 16.3.8 під `next start` без CDN браузер A після `updateTag` перейшов через `Link` на статичний `/other` і побачив **старе** «постів: 1», хоча [cacheLife → Client cache behavior](https://nextjs.org/docs/app/api-reference/functions/cacheLife#client-cache-behavior) обіцяє очищення Client Cache. Client Cache справді очищено. Але повторний prefetch `/other` Chrome узяв зі **свого HTTP-кешу** (`fromDiskCache: true`): відповіді prefetch-сегментів статичної сторінки мають `Cache-Control: s-maxage=2592000, stale-while-revalidate=28944000`, і браузер застосовує до них stale-while-revalidate. З вимкненим кешем браузера той самий сценарій показує «постів: 2». На повних запитах (оновлення сторінки) проблеми немає. Як `Cache-Control` переписують CDN і платформи — [[Next.js - 17. ISR і CDN#📨 Заголовки відповіді: що з них читати|тема 17]].

Зведена таблиця стенду: A натиснув кнопку на `/posts`, B — інший браузер.

| API в дії | A одразу | B: перший повний запит | B: наступний запит |
|---|---|---|---|
| `revalidateTag('posts', 'max')` | старе | старе (`STALE`), перерахунок у фоні | нове (коли фоновий перерахунок встиг) |
| `revalidateTag('posts', { expire: 0 })` | нове | нове (чекає ~1 с, `MISS`; під `partialPrefetching` маршрут з динамічним параметром — shell + свіжий стрім) | нове (`HIT`) |
| `updateTag('posts')` | нове | нове (чекає ~1 с, `MISS`) | нове (`HIT`) |
| `revalidatePath('/posts')` | нове | `/posts` нове, `/other` старе | `/other` так і лишається старим |
| `refresh()` | новий `Now`, старий список | старе | старе |
| нічого | старе | старе | старе |

Ще дві межі, які таблиця не показує. Перша: на кількох інстансах за балансувальником ревалідація **локальна** — виклик на інстансі A інвалідує лише його кеш, інші віддають старе, доки не дізнаються. Координацію через `cacheHandlers` (`updateTags`/`refreshTags`) розбирає [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers|тема 18]]. Друга: CDN перед Next.js про твою ревалідацію не знає й віддає свою копію до кінця `s-maxage` — [[Next.js - 17. ISR і CDN|тема 17]].

> [!diagram] updateTag: автор, новий відвідувач і чужий Client Cache
> ```yaml
> layout: compare
> columns: { a: "Автор A", b: "Інший користувач B" }
> nodes:
>   - { id: a1, col: a, label: "до дії", text: "/posts, 1 пост", tone: gray }
>   - { id: a2, col: a, label: "відповідь дії", text: "2 пости", note: "свіже дерево в POST", tone: green, icon: "px:check" }
>   - { id: a3, col: a, label: "Client Cache A", text: "очищено", note: "prefetch заново", tone: mint }
>   - { id: b1, col: b, label: "до дії", text: "/posts, prefetch /other", note: "у Client Cache: «постів: 1»", tone: gray }
>   - { id: b2, col: b, label: "Link → /other", text: "постів: 1", note: "запиту на сервер немає", tone: orange, icon: "px:warning" }
>   - { id: b3, col: b, label: "оновлення сторінки", text: "постів: 2", note: "повний запит, запис свіжий", tone: green }
> steps:
>   - { show: [a1, b1], note: "Обидва користувачі на /posts. У B Link на /other уже prefetch-нувся: payload лежить у його Client Cache на 5 хвилин." }
>   - { show: a2, note: "A викликає дію з updateTag: відповідь приносить свіже дерево, A бачить свій пост одразу." }
>   - { show: a3, note: "Ревалідація в Server Action очищає Client Cache — але лише в браузері A." }
>   - { show: b2, note: "B клікає Link: роутер бере payload зі свого Client Cache без запиту. Старі дані, хоч на сервері вже нові." }
>   - { show: b3, note: "B оновлює сторінку: йде повний запит, сервер віддає свіжий запис." }
> ```
> Сервер керує тим, що отримає наступний запит. Що лежить у чужому браузері, вирішує `stale`.

> [!quiz] Що побачить B, клікнувши Link після чужого updateTag
> level: senior · type: output · id: nextjs-core-16-quiz-11
>
> B відкрив `/posts`, і `Link` на статичну `/other` prefetch-нувся («постів: 1»). Потім A додав пост дією з `updateTag('posts')`. B клікає `Link` на `/other`, а далі оновлює сторінку (F5).
>
> - [x] Після кліку «постів: 1» і жодного запиту на сервер; після F5 «постів: 2»
> - [ ] Після кліку «постів: 2»: `updateTag` очищає Client Cache усіх користувачів
> - [ ] Після кліку «постів: 1», але запит на сервер був і отримав STALE; після F5 «постів: 2»
> - [ ] Після кліку «постів: 2» з блокуючим MISS на 1 с, після F5 теж «постів: 2»
>
> **Пояснення:** ревалідація в Server Action очищає Client Cache лише в браузері автора. У B лежить prefetch-нутий payload, який вважається свіжим до `stale` (300 с у профілю `max`), тож клік не робить запитів. Повне оновлення сторінки йде на сервер, де запис уже свіжий.

### 🪝 Вебхуки: ревалідація ззовні

Контент часто змінюють не в застосунку: редактор публікує статтю в CMS, склад оновлює залишки, платіжна система підтверджує оплату. Сервіс викликає твій Route Handler, а той інвалідує тег. `updateTag` і `refresh()` тут недоступні (немає дії й користувача, якому показувати зміну), тож працює `revalidateTag`:

```ts
// app/api/revalidate/route.ts — вебхук від CMS
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  // секрет у заголовку: URL з query потрапляють у логи
  if (request.headers.get('x-webhook-secret') !== process.env.WEBHOOK_SECRET) {
    return Response.json({ ok: false }, { status: 401 })
  }
  const { tag, mode } = (await request.json()) as { tag?: string; mode?: 'max' | 'now' }
  if (!tag) return Response.json({ ok: false, error: 'tag is required' }, { status: 400 })

  // 'max' — stale-while-revalidate; { expire: 0 } — ніхто більше не побачить старе
  revalidateTag(tag, mode === 'max' ? 'max' : { expire: 0 })
  return Response.json({ ok: true, tag })
}
```

Що показали запити до статичного `/other` після виклику вебхука:

| Режим | 1-й запит | 2-й запит |
|---|---|---|
| `{ expire: 0 }` | `MISS`, 1,07 с, «постів: 2» | `HIT`, 3 мс, «постів: 2» |
| `'max'` | `STALE`, 2 мс, «постів: 1» | `HIT`, «постів: 2» (коли фоновий перерахунок встиг) |

На `/posts` з динамічною діркою заголовка `x-nextjs-cache` немає, але поведінка та сама: з `{ expire: 0 }` перший запит чекав ~1 с і показав новий список, з `'max'` — віддав старий за 12 мс, а новий зʼявився з наступного (коли фоновий перерахунок встиг).

Це поведінка статичної сторінки й сторінки з діркою без `partialPrefetching`. Маршрут з динамічним параметром під `partialPrefetching: true` після `{ expire: 0 }` не блокує: він віддає shell, свіжі дані йдуть стрімом (`private`, `x-nextjs-postponed: 1`), а наступний запит отримує `HIT`. Деталі — у [[Next.js - 17. ISR і CDN|темі 17]].

Який режим обрати? `'max'` — для більшості контенту: статті, описи, каталог; ніхто не чекає, а свіжість приходить за один запит. `{ expire: 0 }` — коли старе показувати не можна: зняли товар з продажу, виправили помилку в ціні, відкликали публікацію. Документація прямо називає `{ expire: 0 }` способом «протермінувати негайно» там, де `updateTag` недоступний.

Справжній вебхук робить більше: перевіряє підпис тіла (HMAC) замість простого секрету, обробляє повтори ідемпотентно, приймає лише свої теги. Це тема [[Next.js - 19. Route Handlers і Backend-for-Frontend#🪝 Вебхуки: сирий body, підпис, ідемпотентність|19]]. А як вебхук поводиться разом з CDN і ISR — [[Next.js - 17. ISR і CDN#🔔 On-demand: ревалідація на подію|тема 17]].

> [!quiz] updateTag у вебхуку
> level: middle · id: nextjs-core-16-quiz-12
>
> CMS після публікації викликає твій Route Handler. Розробник пише в ньому `updateTag('articles')`. Що буде?
>
> - [ ] Працюватиме як `revalidateTag`
> - [ ] `next build` впаде з помилкою
> - [ ] Працюватиме лише в `next dev`
> - [x] Запит поверне 500: `updateTag can only be called from within a Server Action`
>
> **Пояснення:** `updateTag` доступний лише в Server Actions, бо йому потрібен користувач, якому показати зміну. Помилка виникає під час запиту, а не на збірці. У Route Handler використовуй `revalidateTag('articles', 'max')`, а якщо старе показувати не можна, то `{ expire: 0 }`.

### ⏱️ За часом чи на подію

On-demand ревалідація не скасовує `cacheLife` — вони працюють разом. Профіль — **верхня межа** застарілості, якщо ніхто не скаже про зміну. Тег — спосіб сказати.

- **Дані змінюються за розкладом або без події** (курс валют, погода, рейтинг) — тільки `cacheLife` з потрібним `revalidate`. Подавати вебхук нікому.
- **Дані змінюються з подією, яку ти контролюєш** (CMS, адмінка, дія користувача) — довгий `cacheLife('max')` плюс `cacheTag`, а ревалідація на подію. Документація радить саме так для CMS: менше марних перерахунків, контент лишається в static shell.
- **Обидва** — довгий профіль на випадок загубленого вебхука плюс теги. Наприклад, `cacheLife('days')`: навіть якщо вебхук не дійшов, через добу дані оновляться самі.

Як саме старіє запис за часом, розібрано в [[Next.js - 15. Cache Components і use cache#⏳ cacheLife: stale, revalidate, expire|темі 15]]. Нагадаємо лише нюанс, який легко сплутати з ревалідацією на подію. Пререндерена сторінка після `revalidate` віддає старе (`STALE`) і оновлюється у фоні. А запис `'use cache'`, який наповнюється під час запиту в дірці під `<Suspense>`, у типовому in-memory обробнику після `revalidate` вважається відсутнім: запит **чекає**. На стенді з `cacheLife({ stale: 30, revalidate: 10, expire: 600 })` статична сторінка через 13 с відповіла за 44 мс зі старим значенням, а така сама функція в динамічній дірці через 14 с чекала 1,06 с. Деталі й причини — у застереженні [[Next.js - 15. Cache Components і use cache#⏳ cacheLife: stale, revalidate, expire|теми 15]].

Тег-ревалідація поводиться передбачуваніше: `revalidateTag(tag, 'max')` дає SWR і для runtime-записів. На сторінці, де `getPosts()` викликається в дірці після `await connection()`, перший запит після вебхука з `'max'` відповів за 8 мс зі старим «постів: 1» і запустив перерахунок, а з `{ expire: 0 }` — чекав 1 с і показав «постів: 2».

> [!quiz] Яку стратегію обрати для статей з CMS
> level: senior · id: nextjs-core-16-quiz-13
>
> Статті приходять з CMS, яка вміє слати вебхук при публікації. Що найкраще?
>
> - [ ] `cacheLife('seconds')`, щоб завжди було свіже: кожен запит піде в CMS
> - [ ] Лише `revalidatePath('/blog')` у вебхуку, без тегів: оновить один маршрут, а не всі сторінки з цими даними
> - [ ] `updateTag('articles')` у вебхуку: він працює скрізь, де є теги
> - [x] `cacheLife('max')` і `cacheTag('articles')` у кешованій функції, а у вебхуку `revalidateTag('articles', 'max')`
>
> **Пояснення:** довгий профіль тримає контент у static shell і не б'є в CMS марно, а тег дає точну інвалідацію на подію. `'max'` означає, що ніхто не чекає, а свіжа версія приходить за один запит. Короткий `cacheLife` дублює роботу, шлях зачіпає лише свій маршрут, а `updateTag` у Route Handler падає.

### 🧮 Як обрати: таблиця рішень

| Сценарій | API | Чому |
|---|---|---|
| Користувач зберіг форму й має одразу побачити зміну | `updateTag(tag)` у Server Action | read-your-own-writes: відповідь несе свіже дерево, старого не бачить ніхто |
| Мутація в дії, а невелика затримка для всіх ок (лайки, лічильники переглядів у каталозі) | `revalidateTag(tag, 'max')` | ніхто не чекає; свіже — з наступного запиту |
| Вебхук CMS, звичайний контент | `revalidateTag(tag, 'max')` у Route Handler | SWR, `updateTag` тут недоступний |
| Вебхук, старе показувати не можна (знято з продажу, юридична правка) | `revalidateTag(tag, { expire: 0 })` | негайне протермінування поза дією |
| Змінилась одна конкретна сторінка, тегів немає | `revalidatePath('/profile')` | інвалідує маршрут за мʼякими тегами |
| Змінився шаблон для всіх сторінок патерну | `revalidatePath('/blog/[slug]', 'page')` | `type` обовʼязковий для динамічного сегмента |
| Змінилось спільне для розділу (меню в layout) | `revalidatePath('/blog', 'layout')` | layout, вкладені layouts і сторінки |
| Дані не кешуються, але сторінку треба перемалювати після дії | `refresh()` у Server Action | новий payload без інвалідації кешу |
| Дані змінились поза твоєю дією (WebSocket, інша вкладка) | `router.refresh()` у Client Component | клієнт сам просить новий payload |
| Дані старіють без події (курс, погода) | `cacheLife` з `revalidate` | подавати сигнал нікому |
| Аварійно скинути все після міграції даних | `revalidatePath('/', 'layout')` | усі маршрути й Client Cache викликача |

### 🧯 Типові помилки і як їх читати

| Повідомлення | Що сталося | Що зробити |
|---|---|---|
| `Expected 2 arguments, but got 1.` (TypeScript) | однаргументний `revalidateTag(tag)` | `updateTag(tag)` у дії або `revalidateTag(tag, 'max')` |
| `"revalidateTag" without the second argument is now deprecated…` (лог сервера) | помилку TS придушено, виклик працює як `{ expire: 0 }` | те саме: додати профіль |
| `updateTag can only be called from within a Server Action. To invalidate cache tags in Route Handlers or other contexts, use revalidateTag instead.` | `updateTag` у Route Handler (відповідь 500) | `revalidateTag(tag, { expire: 0 })` або `'max'` |
| `refresh can only be called from within a Server Action.` | `refresh()` у Route Handler | у Route Handler він не потрібен: там немає поточної сторінки |
| `Route /x used "revalidateTag posts" during render which is unsupported. To ensure revalidation is performed consistently it must always happen outside of renders and cached functions.` | ревалідація в тілі Server Component (на `next build` — помилка prerender) | перенести в Server Action або Route Handler |
| `Warning: a dynamic page path "/blog/[slug]" was passed to "revalidatePath", but the "type" parameter is missing. This has no effect by default` | патерн без `type` | `revalidatePath('/blog/[slug]', 'page')` |

Окремий клас — помилки, яких немає в логах: ревалідація «не працює», бо стоїть після `redirect`, бо `revalidatePath` не зачепив сусідню сторінку з тими самими даними, бо інший інстанс не дізнався про інвалідацію, або бо CDN віддає свою копію. Тут допомагає `x-nextjs-cache` у відповіді (`HIT`, `STALE`, `MISS`) і лог перерахунків у кешованій функції.

### 🏭 Як це роблять у продакшні

- **Теги — частина моделі даних.** Кожна кешована функція має загальний тег сутності (`products`) і тег запису (`product-42`). Імена тегів генерує одна функція-хелпер (`tags.product(id)`), а не рядки по всьому коду.
- **Одна функція «після зміни X».** `afterProductChange(id)` викликає всі `updateTag`/`revalidateTag` для товару — і з дії адмінки, і з вебхука складу. Так нова сторінка з даними товару не забуде свою інвалідацію.
- **У діях — `updateTag`, у вебхуках — `revalidateTag`.** `'max'` за замовчуванням, `{ expire: 0 }` — лише там, де старе шкодить.
- **Ревалідація перед `redirect`**, завжди. На code review `redirect` посеред дії — привід перевірити порядок.
- **Довгий `cacheLife` як страховка.** Вебхуки губляться: профіль `days` чи `weeks` обмежує, наскільки старими можуть бути дані.
- **Кілька інстансів — спільне сховище тегів.** Self-hosting за балансувальником без `cacheHandlers` з `updateTags`/`refreshTags` означає, що ревалідація діє на одному сервері з трьох.
- **Спостережуваність.** Логи вебхуків з тегом і результатом, метрики `HIT/STALE/MISS`, алерт на 401/500 вебхука: «CMS оновила, а сайт ні» — один з найчастіших інцидентів кешу.

## ⚠️ Пастки

> [!pitfall] revalidateTag 'max' після збереження форми
> Автор не побачить свою зміну: відповідь дії не несе нового UI, перше оновлення віддасть старе.
>
> ```ts
> await savePost(data)
> revalidateTag('posts', 'max') // ❌ «я зберіг, а воно не зберіглось»
> updateTag('posts') // ✅ read-your-own-writes
> ```

> [!pitfall] Ревалідація після redirect
> `redirect` кидає виняток — рядки після нього не виконуються.
>
> ```ts
> redirect('/posts')
> updateTag('posts') // ❌ ніколи не виконається
> ```

> [!pitfall] Патерн без type
> `revalidatePath('/blog/[slug]')` нічого не інвалідує — лише попередження в лозі сервера.
>
> ```ts
> revalidatePath('/blog/[slug]') // ❌ no effect
> revalidatePath('/blog/[slug]', 'page') // ✅ усі сторінки цього page.tsx
> ```

> [!pitfall] revalidatePath замість тегу
> Шлях інвалідує маршрут, а не дані: інші сторінки з тими самими даними лишаються старими, навіть коли функція вже перерахувалась.
>
> ```ts
> revalidatePath('/posts') // ❌ /other з тим самим getPosts() — стара
> updateTag('posts') // ✅ усі сторінки з тегом
> ```

> [!pitfall] updateTag у вебхуку
> Route Handler — не Server Action: запит падає з 500.
>
> ```ts
> // app/api/revalidate/route.ts
> updateTag(tag) // ❌ updateTag can only be called from within a Server Action
> revalidateTag(tag, { expire: 0 }) // ✅
> ```

> [!pitfall] refresh() замість інвалідації
> `refresh()` перемальовує сторінку з тим самим кешем: кешований список лишається старим для всіх.
>
> ```ts
> await insertPost(title)
> refresh() // ❌ getPosts() у 'use cache' не оновиться
> ```

> [!pitfall] Очікування, що updateTag оновить екрани інших
> Сервер не може очистити чужий Client Cache: інший користувач при переході через `Link` до `stale` секунд бачить prefetch-нуту копію.

## 🎤 На співбесіді

> [!interview] Чим revalidateTag відрізняється від updateTag у Next.js 16? Коли який?
> level: middle · frequency: дуже часто · id: nextjs-core-16-int-01
>
> ---
>
> Обидва працюють з тегами `cacheTag`. `revalidateTag(tag, profile)` позначає записи застарілими: з профілем `'max'` наступний запит отримує старе одразу й запускає перерахунок у фоні (stale-while-revalidate). Відповідь дії при цьому не несе нового UI, тож автор зміни свого результату не бачить. `updateTag(tag)` протерміновує записи негайно: наступне читання чекає свіжих даних, а дія повертає автору оновлене дерево (read-your-own-writes). `updateTag` — лише в Server Actions, `revalidateTag` — ще й у Route Handlers. Форма: зберіг профіль — `updateTag`; вебхук CMS — `revalidateTag(tag, 'max')`, а якщо старе показувати не можна — `{ expire: 0 }`.
>
> 📚 [[Next.js - 16. Ревалідація#✍️ updateTag: read-your-own-writes|Розділ: updateTag]] · [Next.js: updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag) · [Next.js: revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

> [!interview] Користувач зберіг зміну, а інший користувач її не бачить, хоча ти викликав updateTag. Які можуть бути причини?
> level: senior · frequency: часто · id: nextjs-core-16-int-02
>
> ---
>
> По шарах. **Client Cache іншого користувача**: `updateTag` очищає Client Cache лише в браузері автора; інший при переході через `Link` бере prefetch-нуту копію до `stale` секунд (5 хв для `default`), оновлення сторінки покаже нове. **Кілька інстансів**: ревалідація локальна, без `cacheHandlers` з `updateTags`/`refreshTags` інші сервери віддають старе. **CDN** перед Next.js тримає свою копію до `s-maxage`. **Код**: `updateTag` після `redirect`, не той тег або сторінка читає дані з функції без тегу. Діагностика — `x-nextjs-cache` у відповіді, лог перерахунку кешованої функції, жорстке оновлення без CDN.
>
> 📚 [[Next.js - 16. Ревалідація#👥 Хто що бачить: автор, інші користувачі й Client Cache|Розділ: хто що бачить]] · [Next.js: How revalidation works](https://nextjs.org/docs/app/guides/how-revalidation-works) · [Next.js: cacheLife — Client cache behavior](https://nextjs.org/docs/app/api-reference/functions/cacheLife#client-cache-behavior)

> [!interview] Як працює revalidatePath під капотом і чому документація радить теги?
> level: senior · frequency: іноді · id: nextjs-core-16-int-03
>
> ---
>
> Кожен маршрут автоматично отримує мʼякі теги шляху з префіксом `_N_T_`: `/blog/hello` — `_N_T_/layout`, `_N_T_/blog/layout`, `_N_T_/blog/hello/layout`, `_N_T_/blog/hello`. `revalidatePath` інвалідує записи за цими тегами, тобто працює через ту саму систему, що й `revalidateTag`. Літеральний шлях — одна сторінка, патерн `[slug]` вимагає `type: 'page' | 'layout'` (без нього нічого не стається), `'/', 'layout'` — усе. Проблема в тому, що шлях інвалідує маршрут, а не дані: інша сторінка з тими самими даними лишається старою. Тег точний: інвалідує всі місця, де ці дані використано, і нічого зайвого.
>
> 📚 [[Next.js - 16. Ревалідація#🛣️ revalidatePath: шлях замість тегу|Розділ: revalidatePath]] · [Next.js: revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) · [Next.js: How revalidation works](https://nextjs.org/docs/app/guides/how-revalidation-works#soft-tags)

> [!interview] Що повертає Server Action після мутації і коли сторінка оновлюється без додаткового запиту?
> level: senior · frequency: часто · id: nextjs-core-16-int-04
>
> ---
>
> Якщо дія негайно інвалідує дані — `updateTag`, `revalidatePath`, `revalidateTag` з `{ expire: 0 }` — або викликає `refresh()`, змінює cookies чи робить `redirect`, Next.js у тому самому POST перерендерює поточний маршрут і повертає в одному Flight-стрімі і значення дії, і новий RSC payload. Окремого GET немає. Виняток — `revalidateTag` зі SWR-профілем (`'max'`): дані лише позначено застарілими, тож рендерити нічого, і в відповіді тільки значення дії. Також будь-яка ревалідація з дії очищає Client Cache браузера, що її викликав.
>
> 📚 [[Next.js - 16. Ревалідація#📮 Що приносить відповідь на дію|Розділ: відповідь на дію]] · [Next.js: Server Actions — a single response](https://nextjs.org/docs/app/guides/server-actions#a-single-response-carries-data-and-ui)

> [!interview] Спроєктуй ревалідацію для каталогу інтернет-магазину: товари з CMS, ціни зі складу, адмінка для менеджерів.
> level: senior · frequency: часто · id: nextjs-core-16-int-05
>
> ---
>
> Кешовані функції `getProduct(id)` і `getCategory(slug)` з `cacheLife('days')` як страховкою і тегами `products`, `product-<id>`, `category-<slug>`. Вебхук CMS (Route Handler з перевіркою підпису) робить `revalidateTag('product-<id>', 'max')`: опис може запізнитися на запит. Вебхук складу при знятті з продажу — `revalidateTag(tag, { expire: 0 })`: старе не показуємо нікому. Адмінка — Server Actions з `updateTag`, щоб менеджер одразу бачив свою правку; виклики зібрані в одній функції `afterProductChange`. На кількох інстансах — `cacheHandlers` зі спільним сховищем тегів, CDN — з інвалідацією або коротким `s-maxage`. Ціну в кошику не кешуємо зовсім: читаємо в динамічній дірці.
>
> 📚 [[Next.js - 16. Ревалідація#🧮 Як обрати: таблиця рішень|Розділ: таблиця рішень]] · [Next.js: Revalidating](https://nextjs.org/docs/app/getting-started/revalidating) · [Next.js: How revalidation works](https://nextjs.org/docs/app/guides/how-revalidation-works#multi-instance-considerations)

## 🔗 Звʼязки

- [[Next.js - 15. Cache Components і use cache]] — `'use cache'`, `cacheLife`, `cacheTag`: що саме ми тут ревалідуємо.
- [[Next.js - 04. Навігація під капотом]] — Client Cache, `stale`, `router.refresh()` проти `refresh()`.
- [[Next.js - 17. ISR і CDN]] — заголовки `Cache-Control`, `x-nextjs-cache`, CDN і on-demand ревалідація сторінок.
- [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers]] — ревалідація на кількох інстансах: `updateTags`, `refreshTags`.
- [[Next.js - 19. Route Handlers і Backend-for-Frontend]] — вебхуки: підпис, ідемпотентність.
- Server Actions зсередини, валідація форм і `useActionState` — теми 21–22 основного посібника; optimistic UI поверх `updateTag` — тема 24.

## ⚡ Фішки

> [!reel] 🏗️ Одна збірка, одна getPosts
> У таблиці `next build` `/other` має `○ 30d 1y`, а `/posts` з Suspense-діркою `◐ 30d 1y`. Функція `getPosts` виконалась один раз на обидві сторінки: ключ однаковий, запис один.

> [!reel] 🖋️ Автор не бачить свого поста
> Після `revalidateTag('posts', 'max')` відповідь дії не несе нового UI, а перше оновлення сторінки віддає старий список і запускає перерахунок. Новий пост з'являється з другого. Для «зберіг і одразу бачу» є `updateTag`.

> [!reel] 🛣️ revalidatePath без type не робить нічого
> `revalidatePath('/blog/[slug]')` нічого не інвалідує, лише пише в лог попередження про відсутній `type`. З `'page'` оновляться всі сторінки патерна.

> [!reel] 🔄 refresh() міняє час, а не дані
> Після `refresh()` змінюється час у незакешованій дірці, але список з `'use cache'` лишається старим для всіх. Серверного кешу він не чіпає.

> [!reel] ↪️ Після redirect нічого не виконується
> `redirect` кидає виняток, тож `updateTag` після нього не спрацює. Збірка пройде, а список на сторінці лишиться старим і після перезавантаження.

> [!reel] 📱 Чужий Client Cache сервер не чистить
> B prefetch-нув `/other`, потім A зробив `updateTag`. Клік B по `Link` не зробив жодного запиту й показав старе. Оновлення сторінки показало нове.

> [!reel] ⚠️ Однаргументний revalidateTag — застарілий
> `revalidateTag('posts')` у TypeScript дає `Expected 2 arguments, but got 1.` Якщо помилку придушити, виклик працює як `{ expire: 0 }` і пише в лог попередження про застарілість.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Які є два способи ревалідації кешу?
> *дуже часто · теорія* · `nextjs-core-16-card-01`
>
> За часом: запис старіє сам за профілем `cacheLife`, нічого викликати не треба. На подію: після мутації ти явно кажеш, що застаріло, через `revalidateTag`, `updateTag` чи `revalidatePath`. Вони працюють разом: профіль це верхня межа застарілості, а тег спосіб сказати про зміну раніше.
>
> 📚 [[Next.js - 16. Ревалідація#🧭 Що таке ревалідація і де живуть копії|Розділ: що таке ревалідація]] · [Next.js: Revalidating](https://nextjs.org/docs/app/getting-started/revalidating)

> [!question]- Що робить `revalidateTag(tag, 'max')`?
> *дуже часто · теорія* · `nextjs-core-16-card-02`
>
> Позначає всі записи з тегом застарілими. Наступний запит отримує старе значення одразу й запускає перерахунок у фоні (stale-while-revalidate), а свіже віддасть наступний за ним. Відповідь Server Action при цьому не несе нового UI.
>
> 📚 [[Next.js - 16. Ревалідація#🏷️ revalidateTag: stale-while-revalidate на вимогу|Розділ: revalidateTag]] · [Next.js: revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

> [!question]- Чим `updateTag` відрізняється від `revalidateTag` і де його можна викликати?
> *дуже часто · теорія* · `nextjs-core-16-card-03`
>
> `updateTag` протерміновує записи негайно: наступне читання чекає свіжих даних, а дія повертає автору оновлене дерево (read-your-own-writes). Викликати його можна лише в Server Actions. У Route Handler запит падає з 500 і текстом `updateTag can only be called from within a Server Action`.
>
> 📚 [[Next.js - 16. Ревалідація#✍️ updateTag: read-your-own-writes|Розділ: updateTag]] · [Next.js: updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag)

> [!question]- Що буде, якщо викликати `revalidateTag(tag)` без другого аргументу?
> *часто · код* · `nextjs-core-16-card-04`
>
> У TypeScript це помилка `Expected 2 arguments, but got 1.` Якщо її придушити, виклик працює як `{ expire: 0 }`, а сервер пише попередження про застарілу форму. У Server Actions заміна `updateTag(tag)`, в інших місцях `revalidateTag(tag, 'max')` або `{ expire: 0 }`.
>
> 📚 [[Next.js - 16. Ревалідація#🏷️ revalidateTag: stale-while-revalidate на вимогу|Розділ: revalidateTag]] · [Next.js: revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

### 🟡 Middle

> [!question]- Коли `revalidatePath` доречніший за тег і які в нього форми виклику?
> *часто · практика* · `nextjs-core-16-card-05`
>
> Коли зміна прив'язана до сторінки або тегів немає зовсім. Форми: літеральний шлях (`'/blog/a'`), патерн з `type` (`'/blog/[slug]', 'page'`), layout (`'/blog', 'layout'`) і весь застосунок (`'/', 'layout'`). Для патерна з динамічним сегментом `type` обов'язковий, інакше виклик не має ефекту. Документація радить, де можна, брати теги: вони точніші.
>
> 📚 [[Next.js - 16. Ревалідація#🛣️ revalidatePath: шлях замість тегу|Розділ: revalidatePath]] · [Next.js: revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)

> [!question]- Що робить `refresh()` з `next/cache` і чим він відрізняється від `router.refresh()`?
> *часто · теорія* · `nextjs-core-16-card-06`
>
> `refresh()` викликають у Server Action: сервер перерендерює поточний маршрут і повертає новий RSC payload у відповіді на дію. Серверний кеш він не чіпає, тож підходить для даних, які не кешуються. `router.refresh()` це клієнтська функція, яка окремим запитом просить новий payload, наприклад коли дані змінились поза твоєю дією.
>
> 📚 [[Next.js - 16. Ревалідація#🔄 refresh(): перемалювати, нічого не інвалідуючи|Розділ: refresh]] · [Next.js: refresh](https://nextjs.org/docs/app/api-reference/functions/refresh)

> [!question]- Які виклики в Server Action повертають новий UI в тій самій відповіді?
> *часто · теорія* · `nextjs-core-16-card-07`
>
> `updateTag`, `revalidatePath`, `revalidateTag` з `{ expire: 0 }`, `refresh()` (з тим самим кешем), зміна cookies і `redirect`. Не повертає `revalidateTag` зі SWR-профілем (`'max'`) та дія без жодного з цих викликів: там у відповіді лише значення дії.
>
> 📚 [[Next.js - 16. Ревалідація#📮 Що приносить відповідь на дію|Розділ: відповідь на дію]] · [Next.js: Server Actions](https://nextjs.org/docs/app/guides/server-actions#a-single-response-carries-data-and-ui)

> [!question]- Чому `updateTag` після `redirect` не працює?
> *часто · код* · `nextjs-core-16-card-08`
>
> `redirect` кидає спеціальний виняток, і код після нього не виконується. Збірка проходить, а сторінка лишається зі старим списком і після перезавантаження. Тому ревалідацію завжди ставлять перед `redirect`.
>
> 📚 [[Next.js - 16. Ревалідація#✍️ updateTag: read-your-own-writes|Розділ: updateTag]] · [Next.js: updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag)

> [!question]- Як написати вебхук для CMS і який режим ревалідації обрати?
> *часто · практика* · `nextjs-core-16-card-09`
>
> Route Handler, який перевіряє секрет чи підпис і викликає `revalidateTag(tag, mode)`. `updateTag` там недоступний. `'max'` для більшості контенту: ніхто не чекає, свіжість приходить за один запит. `{ expire: 0 }`, коли старе показувати не можна (знято з продажу, виправлена ціна): тоді перший запит чекає на перерахунок.
>
> 📚 [[Next.js - 16. Ревалідація#🪝 Вебхуки: ревалідація ззовні|Розділ: вебхуки]] · [Next.js: Revalidating](https://nextjs.org/docs/app/getting-started/revalidating)

### 🔴 Senior

> [!question]- Користувач зберіг зміну, а інший її не бачить, хоча ти викликав `updateTag`. Чому?
> *часто · практика* · `nextjs-core-16-card-10`
>
> Найчастіше Client Cache: ревалідація в дії очищає його лише в браузері автора, а інший при переході через `Link` бере prefetch-нуту копію до `stale` секунд (300 для `default`). Далі кілька інстансів без спільного сховища тегів, CDN зі своїм `s-maxage`, а в коді `updateTag` після `redirect`, не той тег чи функція без тегу. Діагностика: `x-nextjs-cache`, лог перерахунку, жорстке оновлення.
>
> 📚 [[Next.js - 16. Ревалідація#👥 Хто що бачить: автор, інші користувачі й Client Cache|Розділ: хто що бачить]] · [Next.js: How revalidation works](https://nextjs.org/docs/app/guides/how-revalidation-works)

> [!question]- Хто запускає перерахунок після ревалідації і чому тисяча сторінок з тегом не перебудовується разом?
> *іноді · теорія* · `nextjs-core-16-card-11`
>
> Перерахунок запускає запит, а не виклик. API лише позначають записи застарілими (stale) чи простроченими (expired). Сторінка оновлюється, коли її відвідують, тож навантаження розподіляється в часі, а непопулярні сторінки не рахуються взагалі.
>
> 📚 [[Next.js - 16. Ревалідація#🧭 Що таке ревалідація і де живуть копії|Розділ: що таке ревалідація]] · [Next.js: How revalidation works](https://nextjs.org/docs/app/guides/how-revalidation-works)

> [!question]- Як ревалідація поводиться на кількох інстансах і за CDN?
> *іноді · теорія* · `nextjs-core-16-card-12`
>
> Ревалідація локальна: виклик на одному інстансі інвалідує лише його кеш, інші віддають старе, доки не дізнаються. Потрібне спільне сховище тегів через `cacheHandlers` (`updateTags`/`refreshTags`). CDN про ревалідацію не знає й віддає свою копію до кінця `s-maxage`, тож його кеш інвалідують окремо.
>
> 📚 [[Next.js - 16. Ревалідація#👥 Хто що бачить: автор, інші користувачі й Client Cache|Розділ: хто що бачить]] · [Next.js: How revalidation works](https://nextjs.org/docs/app/guides/how-revalidation-works#multi-instance-considerations)

> [!question]- Як поєднати `cacheLife` і ревалідацію на подію? Чи працює SWR для `'use cache'` у дірці?
> *іноді · практика* · `nextjs-core-16-card-13`
>
> Профіль це верхня межа застарілості, тег сигнал про зміну. Для CMS: довгий `cacheLife` плюс `cacheTag` і вебхук, а для страховки від загубленого вебхука профіль на кшталт `days`. Тег-ревалідація `'max'` дає SWR і для runtime-запису в дірці після `connection()`: перший запит відповідає старим одразу. А от закінчення `revalidate` за часом для таких записів SWR не дає, запит чекає (тема 15).
>
> 📚 [[Next.js - 16. Ревалідація#⏱️ За часом чи на подію|Розділ: за часом чи на подію]] · [Next.js: Revalidating](https://nextjs.org/docs/app/getting-started/revalidating)

## 🛠️ Практика

> [!task] Модель серверного кешу з тегами
> level: senior · difficulty: medium · id: nextjs-core-16-task-01 · tags: cache, revalidation, swr
>
> Напиши `createTagCache(now)`: модель серверного кешу з тегами. Час береться з функції `now()` (мілісекунди), тож тести рухають його вручну.
>
> - `set(key, value, tags)` зберігає свіжий запис; `get(key)` повертає `{ status, value }`, де `status` це `'HIT'`, `'STALE'` або `'MISS'` (для відсутнього запису `value` це `undefined`);
> - `revalidateTag(tag, profile)` позначає записи з цим тегом застарілими: `get` віддає старе зі статусом `STALE`, доки не мине `expire` від виклику, а потім `MISS`. Профіль `'max'` дає вікно в рік, `{ expire: N }` дає N секунд;
> - `updateTag(tag)` робить такі записи `MISS` негайно;
> - новий `set` по тому самому ключу повертає запис у `HIT`.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type Profile = 'max' | { expire: number }
> type Status = 'HIT' | 'STALE' | 'MISS'
>
> type TagCache = {
>   set(key: string, value: string, tags: string[]): void
>   get(key: string): { status: Status; value: string | undefined }
>   revalidateTag(tag: string, profile: Profile): void
>   updateTag(tag: string): void
> }
>
> function createTagCache(now: () => number): TagCache {
>   // твій код
>   throw new Error('не реалізовано')
> }
> ```
>
> ```ts tests
> let t = 0
> const now = () => t
>
> function setup() {
>   t = 0
>   const cache = createTagCache(now)
>   cache.set('list', 'v1', ['posts'])
>   cache.set('about', 'a', ['pages'])
>   return cache
> }
>
> test('до ревалідації запис віддається як HIT', () => {
>   const cache = setup()
>   expect(cache.get('list')).toEqual({ status: 'HIT', value: 'v1' })
>   expect(cache.get('нема')).toEqual({ status: 'MISS', value: undefined })
> })
>
> test("revalidateTag з 'max' віддає старе зі статусом STALE навіть через добу", () => {
>   const cache = setup()
>   cache.revalidateTag('posts', 'max')
>   expect(cache.get('list')).toEqual({ status: 'STALE', value: 'v1' })
>   t += 24 * 3600 * 1000
>   expect(cache.get('list').status).toBe('STALE')
> })
>
> test('updateTag одразу дає MISS без значення', () => {
>   const cache = setup()
>   cache.updateTag('posts')
>   expect(cache.get('list')).toEqual({ status: 'MISS', value: undefined })
> })
>
> test('{ expire: 5 }: STALE через 1 с і MISS через 6 с', () => {
>   const cache = setup()
>   cache.revalidateTag('posts', { expire: 5 })
>   t += 1000
>   expect(cache.get('list').status).toBe('STALE')
>   t += 5000
>   expect(cache.get('list')).toEqual({ status: 'MISS', value: undefined })
> })
>
> test('запис з іншим тегом не зачіпається', () => {
>   const cache = setup()
>   cache.revalidateTag('posts', { expire: 0 })
>   cache.updateTag('posts')
>   expect(cache.get('about')).toEqual({ status: 'HIT', value: 'a' })
> })
>
> test('{ expire: 0 } дає MISS одразу, без кроку годинника', () => {
>   const cache = setup()
>   cache.revalidateTag('posts', { expire: 0 })
>   expect(cache.get('list')).toEqual({ status: 'MISS', value: undefined })
> })
>
> test('новий set після STALE знову дає HIT', () => {
>   const cache = setup()
>   cache.revalidateTag('posts', 'max')
>   cache.set('list', 'v2', ['posts'])
>   expect(cache.get('list')).toEqual({ status: 'HIT', value: 'v2' })
> })
> ```
>
> > [!hint]- Підказка 1
> > Для кожного запису тримай момент, коли він остаточно протухне (`expireAt`), або `null`, якщо його не ревалідували.
>
> > [!hint]- Підказка 2
> > `get` порівнює `now()` з `expireAt`: поки не дійшли, це `STALE`, після цього запис видаляють і віддають `MISS`. `updateTag` можна зробити простим видаленням.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function createTagCache(now: () => number): TagCache {
> >   const YEAR_MS = 365 * 24 * 3600 * 1000
> >   type Entry = { value: string; tags: string[]; expireAt: number | null }
> >   const entries = new Map<string, Entry>()
> >
> >   return {
> >     set(key, value, tags) {
> >       entries.set(key, { value, tags, expireAt: null }) // свіжий запис: ніяких міток
> >     },
> >     get(key) {
> >       const entry = entries.get(key)
> >       if (!entry) return { status: 'MISS', value: undefined }
> >       if (entry.expireAt === null) return { status: 'HIT', value: entry.value }
> >       if (now() >= entry.expireAt) {
> >         entries.delete(key)
> >         return { status: 'MISS', value: undefined }
> >       }
> >       return { status: 'STALE', value: entry.value }
> >     },
> >     revalidateTag(tag, profile) {
> >       const windowMs = profile === 'max' ? YEAR_MS : profile.expire * 1000
> >       for (const entry of entries.values()) {
> >         if (entry.tags.includes(tag)) entry.expireAt = now() + windowMs
> >       }
> >     },
> >     updateTag(tag) {
> >       for (const [key, entry] of entries) {
> >         if (entry.tags.includes(tag)) entries.delete(key)
> >       }
> >     },
> >   }
> > }
> > ```
> >
> > Модель повторює суть SWR: `STALE` це запис, чий час `expire` ще не минув, а `MISS` змушує чекати на перерахунок. `updateTag` і `{ expire: 0 }` зводяться до негайного `MISS`. Нове значення через `set` скидає мітку, як перерахунок кешованої функції.

> [!task] М'які теги шляху
> level: middle · difficulty: medium · id: nextjs-core-16-task-02 · tags: revalidatePath, soft-tags
>
> Next.js дає кожному маршруту «м'які» теги з префіксом `_N_T_`, а `revalidatePath` інвалідує записи за ними. Напиши дві функції.
>
> `softTagsFor(pathname)` повертає масив тегів: `_N_T_/layout`, потім `_N_T_<шлях до сегмента>/layout` для кожного сегмента зверху вниз, потім тег самої сторінки.
>
> ```js
> softTagsFor('/blog/hello')
> // → ['_N_T_/layout', '_N_T_/blog/layout', '_N_T_/blog/hello/layout', '_N_T_/blog/hello']
> softTagsFor('/') // → ['_N_T_/layout', '_N_T_/']
> ```
>
> `pathTag(path, type)` повертає тег, який інвалідує `revalidatePath(path, type)`: `pathTag('/blog/[slug]', 'page')` це `'_N_T_/blog/[slug]/page'`, `pathTag('/blog', 'layout')` це `'_N_T_/blog/layout'`, `pathTag('/blog/a')` це `'_N_T_/blog/a'`. Для кореня з `'layout'` результат `'_N_T_/layout'`. Патерн із `[` без `type` не має ефекту, тож поверни `null`. Хвостовий слеш ігнорується.
>
> ```js starter
> function softTagsFor(pathname) {
>   // твій код
> }
>
> function pathTag(path, type) {
>   // твій код
> }
> ```
>
> ```js tests
> test('вкладений шлях: layout кожного сегмента і сама сторінка', () => {
>   expect(softTagsFor('/blog/hello')).toEqual([
>     '_N_T_/layout',
>     '_N_T_/blog/layout',
>     '_N_T_/blog/hello/layout',
>     '_N_T_/blog/hello',
>   ])
> })
>
> test('корінь має кореневий layout і сторінку', () => {
>   expect(softTagsFor('/')).toEqual(['_N_T_/layout', '_N_T_/'])
> })
>
> test('хвостовий слеш ігнорується', () => {
>   expect(softTagsFor('/blog/hello/')).toEqual(softTagsFor('/blog/hello'))
>   expect(pathTag('/blog/a/')).toBe('_N_T_/blog/a')
> })
>
> test('pathTag для літерального шляху, page і layout', () => {
>   expect(pathTag('/blog/a')).toBe('_N_T_/blog/a')
>   expect(pathTag('/blog/[slug]', 'page')).toBe('_N_T_/blog/[slug]/page')
>   expect(pathTag('/blog', 'layout')).toBe('_N_T_/blog/layout')
>   expect(pathTag('/', 'layout')).toBe('_N_T_/layout')
> })
>
> test('патерн з динамічним сегментом без type не має тегу', () => {
>   expect(pathTag('/blog/[slug]')).toBeNull()
>   expect(pathTag('/shop/[...rest]')).toBeNull()
> })
> ```
>
> > [!hint]- Підказка 1
> > Розбий шлях на сегменти через `split('/').filter(Boolean)`: так хвостовий слеш і корінь не потребують окремих випадків.
>
> > [!hint]- Підказка 2
> > Для `pathTag` спершу перевір `type`: без нього патерн з `[` дає `null`, а решта це просто `_N_T_` плюс нормалізований шлях.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const segments = (p) => p.split('/').filter(Boolean)
> >
> > function softTagsFor(pathname) {
> >   const parts = segments(pathname)
> >   const tags = ['_N_T_/layout']
> >   let current = ''
> >   for (const part of parts) {
> >     current += '/' + part
> >     tags.push(`_N_T_${current}/layout`)
> >   }
> >   tags.push('_N_T_' + (current || '/'))
> >   return tags
> > }
> >
> > function pathTag(path, type) {
> >   if (!type) {
> >     if (path.includes('[')) return null // патерн без type: «no effect»
> >     const parts = segments(path)
> >     return '_N_T_' + (parts.length ? '/' + parts.join('/') : '/')
> >   }
> >   const parts = segments(path)
> >   const base = parts.length ? '/' + parts.join('/') : ''
> >   return `_N_T_${base}/${type}`
> > }
> > ```
> >
> > Тег layout кожного сегмента означає, що `revalidatePath('/blog', 'layout')` зачіпає і `/blog`, і все під ним. Тег `type: 'page'` вужчий: лише сторінки цього `page.tsx`. Патерн без `type` не відповідає жодному тегу, тому в Next.js це «no effect» і попередження в лозі.

> [!task] Обери API ревалідації
> level: middle · difficulty: easy · id: nextjs-core-16-task-03 · tags: decision-table, revalidation
>
> Напиши `chooseRevalidation(s)`, яка за описом ситуації повертає API з таблиці рішень. Вхід: `{ context: 'action' | 'route-handler', cached, hasTag, authorMustSee, staleIsHarmful }`. Правила за пріоритетом:
>
> 1. дані не кешуються і контекст `route-handler`: кинь помилку «нічого ревалідувати»;
> 2. дані не кешуються (дія): `'refresh'`;
> 3. кешовані без тегу: `'revalidatePath'`;
> 4. дія і `authorMustSee`: `'updateTag'`;
> 5. `staleIsHarmful`: `'revalidateTag:expire0'`;
> 6. інакше: `'revalidateTag:max'`.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type Input = {
>   context: 'action' | 'route-handler'
>   cached: boolean
>   hasTag: boolean
>   authorMustSee: boolean
>   staleIsHarmful: boolean
> }
>
> function chooseRevalidation(s: Input): string {
>   // твій код
>   return 'revalidateTag:max'
> }
> ```
>
> ```ts tests
> const base: Input = {
>   context: 'action',
>   cached: true,
>   hasTag: true,
>   authorMustSee: false,
>   staleIsHarmful: false,
> }
>
> test('дія з даними, що не кешуються, дає refresh', () => {
>   expect(chooseRevalidation({ ...base, cached: false })).toBe('refresh')
> })
>
> test('кешовані дані без тегу дають revalidatePath', () => {
>   expect(chooseRevalidation({ ...base, hasTag: false })).toBe('revalidatePath')
>   expect(chooseRevalidation({ ...base, context: 'route-handler', hasTag: false })).toBe('revalidatePath')
> })
>
> test('дія, де автор має побачити зміну, дає updateTag', () => {
>   expect(chooseRevalidation({ ...base, authorMustSee: true })).toBe('updateTag')
> })
>
> test('у дії authorMustSee важливіший за staleIsHarmful', () => {
>   expect(chooseRevalidation({ ...base, authorMustSee: true, staleIsHarmful: true })).toBe('updateTag')
> })
>
> test('шкідливе старе поза дією дає expire0', () => {
>   expect(chooseRevalidation({ ...base, context: 'route-handler', staleIsHarmful: true })).toBe('revalidateTag:expire0')
>   expect(chooseRevalidation({ ...base, staleIsHarmful: true })).toBe('revalidateTag:expire0')
> })
>
> test('решта випадків дає revalidateTag з max', () => {
>   expect(chooseRevalidation(base)).toBe('revalidateTag:max')
>   expect(chooseRevalidation({ ...base, context: 'route-handler' })).toBe('revalidateTag:max')
> })
>
> test('у Route Handler updateTag недоступний навіть за authorMustSee', () => {
>   expect(chooseRevalidation({ ...base, context: 'route-handler', authorMustSee: true })).toBe('revalidateTag:max')
>   expect(chooseRevalidation({ ...base, context: 'route-handler', authorMustSee: true, staleIsHarmful: true })).toBe('revalidateTag:expire0')
> })
>
> test('Route Handler без кешу кидає помилку', () => {
>   expect(() => chooseRevalidation({ ...base, context: 'route-handler', cached: false })).toThrow()
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу відсікай випадки без кешу: там тегів і шляхів немає взагалі.
>
> > [!hint]- Підказка 2
> > У дії `authorMustSee` перевіряй раніше за `staleIsHarmful`: `updateTag` теж протерміновує негайно.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function chooseRevalidation(s: Input): string {
> >   if (!s.cached) {
> >     if (s.context === 'route-handler') throw new Error('нічого ревалідувати')
> >     return 'refresh' // дані не кешуються: досить перемалювати сторінку
> >   }
> >   if (!s.hasTag) return 'revalidatePath'
> >   if (s.context === 'action' && s.authorMustSee) return 'updateTag'
> >   if (s.staleIsHarmful) return 'revalidateTag:expire0'
> >   return 'revalidateTag:max'
> > }
> > ```
> >
> > `updateTag` у дії вже дає негайне протермінування і свіже дерево автору, тому `{ expire: 0 }` там зайвий. У Route Handler `updateTag` недоступний, тож лишаються `revalidateTag` з `'max'` чи `{ expire: 0 }`.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Revalidating](https://nextjs.org/docs/app/getting-started/revalidating) — офіційний старт: `cacheLife`, `cacheTag`, `revalidateTag`, `updateTag`, `revalidatePath`.
- 🟡 [Next.js — revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) — профілі, `{ expire: 0 }`, застаріла однаргументна форма.
- 🟡 [Next.js — updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag) — read-your-own-writes і порівняння з `revalidateTag`.
- 🟡 [Next.js — revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) — `type`, rewrites, звʼязок з тегами.
- 🟡 [Next.js — refresh](https://nextjs.org/docs/app/api-reference/functions/refresh) — оновлення роутера з Server Action.
- 🔴 [Next.js — How revalidation works](https://nextjs.org/docs/app/guides/how-revalidation-works) — мʼякі теги, кілька інстансів, CDN, деградація.
- 🔴 [Next.js — Server Actions](https://nextjs.org/docs/app/guides/server-actions#a-single-response-carries-data-and-ui) — одна відповідь: дані й UI.
- 🟡 [Next.js — cacheLife: Client cache behavior](https://nextjs.org/docs/app/api-reference/functions/cacheLife#client-cache-behavior) — `stale`, 30-секундний мінімум, очищення Client Cache.
- 🟡 [MDN — Cache-Control: stale-while-revalidate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control#stale-while-revalidate) — звідки взялася сама ідея SWR.

> [!important] Підсумок
> - Ревалідацію запускає **запит**, а не виклик: API лише позначають записи застарілими чи простроченими.
> - `revalidateTag(tag, 'max')` — stale-while-revalidate: наступний запит отримує старе, перерахунок іде у фоні, а автор дії свого результату не бачить. `{ expire: 0 }` — негайно, і в Route Handler теж.
> - `updateTag(tag)` — лише в Server Actions: read-your-own-writes, відповідь дії несе свіже дерево. Ставити **до** `redirect`.
> - `revalidatePath` інвалідує маршрут за мʼякими тегами, а не дані; патерн з `[slug]` потребує `type`. `refresh()` перемальовує сторінку, не чіпаючи кеш.
> - Ревалідація в дії очищає Client Cache лише автора; інші користувачі при клієнтській навігації можуть бачити старе до `stale` секунд. На кількох інстансах і за CDN потрібна окрема координація.
