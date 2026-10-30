---
title: Перша форма і Server Action
id: nextjs-start-11
slug: 11-first-form
order: 11
level: noob
skill: mutations
icon: px:clipboard
tags: [nextjs, forms, server-actions, formdata, validation, use-server, useformstatus]
prerequisites:
  - "[[Next.js Start - 10. Дані на сервері]]"
estimatedMinutes: 35
nextVersion: 16.3.8
---

# Перша форма і Server Action

> [!success] 🎯 Після цього розділу ти зможеш
> - зробити форму, що надсилає дані прямо в серверну функцію: `<form action={fn}>` і `'use server'`;
> - дістати поля з `FormData` і знати, що кожне з них приходить рядком (або `null`);
> - перевірити введене на сервері й показати помилки біля полів через `useActionState`;
> - оновити сторінку після зміни даних (`revalidatePath`) або перейти на іншу (`redirect`);
> - показати «Надсилаю…» на кнопці через `useFormStatus`;
> - пояснити, чому сервер перевіряє все наново, навіть якщо в браузері стоїть `required`.

## 🤔 Передбач

> [!quiz] Де зʼявиться повідомлення з console.log?
> level: junior · type: output · id: nextjs-start-11-quiz-01
>
> Користувач заповнює форму й натискає «Надіслати». Де він або ти побачите рядок `Отримали: Оля`?
>
> ```tsx
> // app/guestbook/page.tsx
> export default function Page() {
>   async function createEntry(formData: FormData) {
>     'use server'
>     console.log('Отримали:', formData.get('name'))
>   }
>
>   return (
>     <form action={createEntry}>
>       <input name="name" />
>       <button type="submit">Надіслати</button>
>     </form>
>   )
> }
> ```
>
> - [x] У терміналі, де запущено `next dev` чи `next start`: функція виконується на сервері
> - [ ] У консолі браузера: форму ж надсилає браузер
> - [ ] І там, і там: Next.js копіює логи
> - [ ] Ніде: функцію всередині компонента не можна викликати з форми
>
> **Пояснення:** якщо помилився — не страшно, саме про це розділ. `'use server'` робить з функції **Server Action**: браузер лише надсилає дані запитом, а код функції виконується на сервері. Тому лог — у терміналі сервера. У браузер цей код навіть не потрапляє.

## 🧒 Простими словами

Уяви поштову скриньку біля ресторану. Ти пишеш на бланку побажання, кидаєш його в скриньку й ідеш. Бланк — це **форма**, а скринька веде просто на кухню, до кухаря, який знає, що з бланком робити. Це **Server Action** — функція, що живе на сервері й чекає твої бланки. Кухар не довіряє бланку наосліп: перевіряє, що поля заповнені, і викидає папірці з дурницями. Бо будь-хто може вкинути в скриньку що завгодно, не лише гарно заповнений бланк з кафе.

## 🔬 Як це працює насправді

### 📮 Форма в HTML: як було завжди

Форма — найстаріший спосіб надіслати дані з браузера на сервер. У звичайному HTML вона виглядає так:

```html
<form action="/subscribe" method="POST">
  <input name="email" />
  <button type="submit">Підписатися</button>
</form>
```

Натискаєш кнопку, браузер збирає всі поля з атрибутом `name`, відправляє їх **POST-запитом** на адресу з `action` і показує сторінку, яку поверне сервер. Ти памʼятаєш з [[Next.js Start - 01. Як працює веб|теми Start 01]]: POST — метод для запитів, які щось **змінюють** (створюють запис, видаляють, оновлюють), на відміну від GET, що лише читає.

Раніше на React для цього треба було три кроки: написати окремий API-маршрут на сервері, у компоненті перехопити `onSubmit`, викликати `fetch` і самому оновити сторінку. Next.js з React скорочує це до одного кроку: в `action` форми передаєш **функцію**, а не адресу.

### ⚡ Перша Server Action

**Server Function** — асинхронна функція з директивою `'use server'`: вона виконується на сервері, а браузер може її викликати через мережевий запит. Коли таку функцію викликає форма (або кнопка), її називають **Server Action** — це назва, яку почуєш на співбесіді. Директива `'use server'` ставиться першим рядком тіла `async`-функції або першим рядком файлу. Оголосити таку функцію прямо в компоненті можна лише в Server Component — а це будь-який компонент без `'use client'` ([[Next.js Start - 05. Що таке Next.js і навіщо фреймворк|тема Start 05]]).

Зробимо гостьову книгу: список записів і форма для нового.

```ts
// lib/guestbook.ts — «база даних» у памʼяті сервера (для навчання)
export type Entry = { id: number; name: string; message: string }

const entries: Entry[] = [{ id: 1, name: 'Оля', message: 'Перший запис!' }]

export function getEntries(): Entry[] {
  return entries
}

export function addEntry(name: string, message: string): Entry {
  const entry = { id: entries.length + 1, name, message }
  entries.push(entry)
  return entry
}
```

```tsx
// app/guestbook/page.tsx — Server Component зі сторінкою і формою
import { revalidatePath } from 'next/cache'
import { addEntry, getEntries } from '@/lib/guestbook'

export default function GuestbookPage() {
  // Server Action: функція, яку браузер викличе через форму
  async function createEntry(formData: FormData) {
    'use server'
    const name = String(formData.get('name') ?? '')
    const message = String(formData.get('message') ?? '')
    console.log('Server Action отримала:', name, message)
    addEntry(name, message)
    revalidatePath('/guestbook') // перемалювати сторінку зі свіжим списком
  }

  const entries = getEntries()

  return (
    <main>
      <h1>Гостьова книга</h1>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <b>{entry.name}:</b> {entry.message}
          </li>
        ))}
      </ul>

      <form action={createEntry}>
        <input name="name" placeholder="Імʼя" />
        <textarea name="message" placeholder="Повідомлення" />
        <button type="submit">Надіслати</button>
      </form>
    </main>
  )
}
```

Запусти `npm run build && npm start`, відкрий `/guestbook`, напиши щось і натисни «Надіслати». У терміналі зʼявиться `Server Action отримала: …`, а новий запис — у списку. Ні API-маршруту, ні `fetch`, ні `useState`.

> [!note] Чому в прикладах дані в памʼяті
> Приклади курсу зібрані з `cacheComponents: true`. Справжній запит до БД у `getEntries()` зупинив би `next build` з `Next.js encountered uncached or runtime data during prerendering`: такі дані кешують (`'use cache'`, тема 15 основного посібника) або обгортають у `<Suspense>` (теми 11–12 основного посібника). Тут ми це опускаємо. Масив у памʼяті скидається при кожному перезапуску сервера — для навчання цього досить.

Що відбувається під капотом. Під час збірки Next.js дає функції **ідентифікатор** і вставляє його у форму прихованим полем. Подивись вихідний код сторінки (`curl localhost:3000/guestbook`) — і побачиш щось таке:

```html
<form action="" encType="multipart/form-data" method="POST">
  <input type="hidden" name="$ACTION_ID_4036e9896911f506aea761e03b83d7245b7dec3f67" />
  <input placeholder="Імʼя" name="name" />
  ...
</form>
```

Це звичайна HTML-форма, яка робить POST на ту саму сторінку. Сервер за `$ACTION_ID_…` знаходить потрібну функцію і викликає її з даними форми. Код функції в браузер не потрапляє — лише ідентифікатор.

Звідси приємний наслідок: форма з Server Action у Server Component **працює навіть без JavaScript**. Це називають **progressive enhancement** — «спершу працює базове, потім додаємо зручності». Без JS браузер просто надішле форму й перезавантажить сторінку. З JS React перехопить відправку, викличе дію без перезавантаження і оновить лише те, що змінилося. Спробуй сам: надішли форму через `curl -F` з прихованим полем `$ACTION_ID_…` і полями `name`, `message` — запис додасться так само, як після кнопки в браузері.

> [!quiz] Перевір себе: обери правдиві твердження про Server Action
> level: junior · type: multi · id: nextjs-start-11-quiz-02
>
> - [x] Код Server Action виконується на сервері, у браузер потрапляє лише її ідентифікатор
> - [x] Форма з Server Action у Server Component відправиться, навіть якщо JavaScript вимкнено
> - [ ] `'use server'` можна поставити першим рядком будь-якої функції, навіть звичайної, не `async`
> - [ ] Server Action — це новий вид API-маршруту, і його треба реєструвати в `app/api`
> - [x] Браузер викликає дію POST-запитом на адресу поточної сторінки
>
> **Пояснення:** дія — функція, яку сервер знаходить за ідентифікатором з прихованого поля, а браузер надсилає POST на ту саму сторінку. Окремий маршрут не потрібен. А `async` обовʼязковий: виклик іде через мережу, тож результат завжди проміс.

### 📦 FormData: що приходить на сервер

Коли форму викликає дія, вона отримує першим аргументом обʼєкт **`FormData`** — стандартний вебовий «пакет» з полями форми. Головний метод — `formData.get('імʼя_поля')`: він повертає значення поля з атрибутом `name="імʼя_поля"`.

Дві речі, на яких спотикаються новачки:

- **Усе — рядки.** `<input type="number" name="age">` прийде як `"25"`, а не `25`. Чекбокс — як `"on"` (якщо позначений). Число доведеться перетворити самому: `Number(formData.get('age'))`. Виняток — `<input type="file">`: там приходить обʼєкт `File`.
- **Немає поля — `null`.** Якщо поля з таким `name` у формі немає (або чекбокс не позначений), `get` поверне `null`. Тому в прикладі `String(formData.get('name') ?? '')`: замінюємо `null` на порожній рядок і отримуємо гарантовано рядок.

Для форми з багатьма полями зручно `Object.fromEntries(formData)` — це перетворює всі поля на звичайний обʼєкт. Тільки памʼятай: там можуть бути й службові ключі Next.js на `$ACTION_`, наприклад `{"$ACTION_ID_4094…":""}`. Тож бери з обʼєкта лише ті поля, які очікуєш.

> [!quiz] Що виведе дія?
> level: junior · type: output · id: nextjs-start-11-quiz-03
>
> У формі є `<input type="number" name="age" />` (користувач ввів `25`) і **немає** поля `city`.
>
> ```ts
> async function save(formData: FormData) {
>   'use server'
>   console.log(typeof formData.get('age'), formData.get('city'))
> }
> ```
>
> - [x] `string null`
> - [ ] `number null`
> - [ ] `number undefined`
> - [ ] `string ""`
>
> **Пояснення:** HTML-форма передає текст, тож `type="number"` впливає лише на поле в браузері — на сервер приходить рядок `"25"`. Відсутнє поле `FormData.get` повертає як `null`, а не `undefined` і не порожній рядок.

### 🗂️ Окремий файл actions.ts

Функція всередині сторінки — найкоротший старт. Але щойно дій стає кілька або форма живе в Client Component, їх виносять в окремий файл з `'use server'` **першим рядком**. Тоді кожна функція, яку файл експортує, стає Server Action:

```ts
// app/guestbook/actions.ts — усі експорти файлу стають Server Actions
'use server'

export async function createEntry(formData: FormData) {
  // ...
}

export async function deleteEntry(formData: FormData) {
  // ...
}
```

Такий файл можна імпортувати і в Server, і в Client Component. Навпаки не вийде: **оголосити** Server Action усередині файлу з `'use client'` не можна — лише імпортувати готову. Чому так, розберемо в «🧯 Типові помилки».

Не плутай дві директиви. `'use client'` ([[Next.js Start - 05. Що таке Next.js і навіщо фреймворк|тема Start 05]]) позначає компоненти, чий код їде в браузер. `'use server'` позначає **функції**, які браузер може викликати, а виконуються вони на сервері. Це не «серверний компонент»: Server Components і так серверні за замовчуванням, директива їм не потрібна.

### 🔄 Як оновити сторінку: revalidatePath і redirect

Дія додала запис у «базу». Але звідки сторінка знає, що треба показати новий список? Сторінка `/guestbook` **статична**: Next.js відрендерив її під час `next build` і віддає готовий HTML усім (статичне й динамічне — тема 10 основного посібника). Без підказки сервер і далі віддаватиме старий HTML.

Підказка — `revalidatePath('/guestbook')` з `next/cache`: «дані для цієї сторінки застаріли». У Server Action вона ще й одразу оновлює екран, якщо користувач на цій сторінці. Next.js відрендерить сторінку заново і поверне новий UI **в тій самій відповіді**, що й результат дії. Один запит — і дані збережено, і список оновлено.

> [!diagram] Від кнопки до оновленого списку
> ```yaml
> layout: flow
> nodes:
>   - { id: form, label: "браузер", text: "<form action={createEntry}>", note: "клік «Надіслати»", tone: gray, icon: "px:monitor" }
>   - { id: action, label: "сервер · Server Action", code: "const name = formData.get('name')\naddEntry(name, message)\nrevalidatePath('/guestbook')", tone: blue }
>   - { id: db, label: "сервер · дані", text: "entries", note: "новий запис", tone: violet, icon: "px:database" }
>   - { id: page, label: "сервер · рендер", text: "GuestbookPage", note: "свіжий список", tone: green }
>   - { id: screen, label: "браузер", text: "оновлений список", tone: yellow }
> edges:
>   - { from: form, to: action, label: "POST + FormData" }
>   - { from: action, to: db, label: "addEntry" }
>   - { from: db, to: page, label: "revalidatePath" }
>   - { from: page, to: screen, label: "новий UI" }
> steps:
>   - { focus: form, note: "Користувач натискає «Надіслати». Браузер збирає поля з name у FormData." }
>   - { move: { from: form, to: action, value: "name=Оля" }, line: "action:1", note: "POST-запит на /guestbook з ідентифікатором дії. Сервер знаходить createEntry і викликає її." }
>   - { move: { from: action, to: db, value: "{ name: 'Оля' }" }, line: "action:2", note: "Дія змінює дані. Поки що сторінка про це не знає." }
>   - { line: "action:3", focus: page, note: "revalidatePath каже: HTML сторінки /guestbook застарів. Next.js рендерить її заново." }
>   - { move: { from: page, to: screen, value: "новий UI" }, note: "Новий UI їде назад у тій самій відповіді. Сторінка оновлюється без перезавантаження." }
> ```
> Дивись на крок 4: без `revalidatePath` дані змінилися б, а екран — ні.

> [!quiz] Перевір себе: що побачить користувач?
> level: junior · type: output · id: nextjs-start-11-quiz-04
>
> Сторінка статична, дія записує в «базу», але `revalidatePath` автор забув. Застосунок запущено через `next build && next start`. Користувач надсилає форму, потім оновлює сторінку (F5).
>
> ```ts
> async function create(formData: FormData) {
>   'use server'
>   addEntry(String(formData.get('name')), 'привіт')
> }
> ```
>
> - [x] Старий список: запис збережено на сервері, але сторінка віддає HTML зі збірки
> - [ ] Новий список: після F5 сервер завжди рендерить сторінку наново
> - [ ] Помилку: дія без `revalidatePath` не компілюється
> - [ ] Порожній список: дія скинула дані
>
> **Пояснення:** на 16.3.8 після такої дії і після F5 `/guestbook` показує старий список, хоча запис у масиві є. А в `next dev` після F5 новий запис видно, бо там сторінка рендериться на кожен запит. Класичне «у мене локально працює». Тому після мутації завжди кажи Next.js, що оновити.

Друга типова дія після мутації — **перейти на іншу сторінку**. Наприклад, форма живе на `/guestbook/new`, а після успіху треба показати список. Для цього `redirect('/guestbook')` з `next/navigation`:

```ts
revalidatePath('/guestbook') // спершу оновити список…
redirect('/guestbook') // …потім перейти: код після redirect не виконується
```

Порядок важливий. `redirect` усередині **кидає** спеціальний виняток, яким Next.js керує переходом. Усе, що після нього, не виконається. Тому `revalidatePath` — завжди **до** `redirect`. З тієї ж причини `redirect` не ставлять у блок `try` — `catch` перехопить цей виняток і перехід не відбудеться.

З JavaScript `redirect` у дії робить навігацію на клієнті, без перезавантаження. Без JS сервер відповідає HTTP-кодом `303` з адресою переходу, і браузер сам іде туди GET-запитом. Спробуй: `curl -i` з даними форми поверне `303` і заголовок `location: /guestbook`.

Побачиш у документації ще `refresh()` і `updateTag()` з `next/cache`. Вони теж оновлюють екран після мутації, але працюють **лише в Server Actions** і повʼязані з кешем — їх розберемо в темі 16 основного посібника. Для першої форми досить `revalidatePath` і `redirect`.

> [!quiz] Перевір себе: склади дію, що створює запис і веде на список
> level: junior · type: order · id: nextjs-start-11-quiz-05
>
> ```ts order
> export async function createEntry(formData: FormData) {
>   const name = String(formData.get('name') ?? '')
>   addEntry(name, 'привіт')
>   revalidatePath('/guestbook')
>   redirect('/guestbook')
> }
>   try { redirect('/guestbook') } catch {} // ✗
> ```
>
> **Пояснення:** спершу дістати дані з `FormData`, потім змінити «базу», потім сказати Next.js, що сторінка застаріла, і лише в кінці — перейти. `redirect` кидає виняток, тож усе після нього не виконається, а `catch` зʼїв би цей виняток, і переходу не було б.

### ✅ Перевірка на сервері

Поки що дія приймає будь-що: порожнє імʼя, повідомлення на мегабайт. Додамо **валідацію** — перевірку, що дані мають сенс. Спершу — проста функція без бібліотек (потужніші інструменти на кшталт Zod — у темі 23 основного посібника):

```ts
// lib/validate-entry.ts — проста перевірка без бібліотек
export type EntryErrors = { name?: string; message?: string }

export function validateEntry(name: string, message: string): EntryErrors {
  const errors: EntryErrors = {}
  if (name.trim().length < 2) errors.name = 'Імʼя — щонайменше 2 символи'
  if (message.trim().length === 0) errors.message = 'Напиши повідомлення'
  else if (message.length > 500) errors.message = 'Не більше 500 символів'
  return errors
}
```

Функція повертає обʼєкт помилок за полями; порожній обʼєкт — «усе добре». Вона чиста (нічого не читає й не змінює), тож її легко тестувати — так і зробимо в 🛠️ Практиці.

Тепер помилки треба **показати** біля полів. Для цього потрібен стан, тож форма переїжджає в Client Component, і там зʼявляється хук **`useActionState`** з React. Він приймає дію і початковий стан, а повертає поточний стан і обгорнуту дію для форми. Після кожної відправки стан — це те, що дія повернула. Сигнатура дії при цьому змінюється: першим аргументом приходить попередній стан, другим — `FormData`.

```ts
// app/guestbook/actions.ts — усі експорти файлу стають Server Actions
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { addEntry } from '@/lib/guestbook'
import { validateEntry, type EntryErrors } from '@/lib/validate-entry'

export type FormState = { errors: EntryErrors; values: { name: string; message: string } }

export async function createEntry(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get('name') ?? '')
  const message = String(formData.get('message') ?? '')

  const errors = validateEntry(name, message)
  if (Object.keys(errors).length > 0) {
    // очікувана помилка: повертаємо її, а не кидаємо
    return { errors, values: { name, message } }
  }

  addEntry(name.trim(), message.trim())
  revalidatePath('/guestbook') // спершу оновити список…
  redirect('/guestbook') // …потім перейти: код після redirect не виконується
}
```

```tsx
// app/guestbook/new/entry-form.tsx
'use client'

import { useActionState } from 'react'
import { createEntry, type FormState } from '../actions'
import { SubmitButton } from './submit-button'

const initialState: FormState = { errors: {}, values: { name: '', message: '' } }

export function EntryForm() {
  const [state, formAction] = useActionState(createEntry, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="name">Імʼя</label>
      <input id="name" name="name" defaultValue={state.values.name} required minLength={2} />
      {state.errors.name && <p role="alert">{state.errors.name}</p>}

      <label htmlFor="message">Повідомлення</label>
      <textarea id="message" name="message" defaultValue={state.values.message} required maxLength={500} />
      {state.errors.message && <p role="alert">{state.errors.message}</p>}

      <SubmitButton />
    </form>
  )
}
```

```tsx
// app/guestbook/new/page.tsx
import { EntryForm } from './entry-form'

export default function NewEntryPage() {
  return (
    <main>
      <h1>Новий запис</h1>
      <EntryForm />
    </main>
  )
}
```

Зверни увагу на три деталі:

- **Помилки повертаються, а не кидаються.** Неправильно заповнене поле — очікувана ситуація, а не аварія. Дія повертає `{ errors, values }`, React кладе це в `state`, і компонент показує текст. `throw` відправив би користувача на сторінку помилки (`error.tsx`, [[Next.js Start - 10. Дані на сервері|тема Start 10]]) — для «закоротке імʼя» це занадто.
- **`values` повертаємо, щоб не стерти введене.** Після кожної дії React **скидає** поля форми, у яких немає `value` (так поводиться React 19). Без `defaultValue={state.values…}` після помилки поле очищається, і користувач набирає все заново. З `defaultValue` введене лишається.
- **`required`, `minLength`, `maxLength` — для зручності.** Браузер не дасть надіслати порожню форму й підкаже, що не так, ще до запиту. Але це не захист — про це нижче.

### ⏳ Кнопка «Надсилаю…»: useFormStatus

Запит до сервера займає час. Якщо кнопка виглядає так само, користувач клацає вдруге — і отримуєш два однакові записи. Хук **`useFormStatus`** з `react-dom` каже, чи надсилається зараз форма:

```tsx
// app/guestbook/new/submit-button.tsx
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus() // стан найближчої батьківської <form>
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Надсилаю…' : 'Надіслати'}
    </button>
  )
}
```

Головне правило: `useFormStatus` читає стан **батьківської** `<form>`. Тому кнопку виносять в окремий компонент і кладуть **усередину** форми. Якщо викликати хук у тому ж компоненті, що рендерить `<form>`, `pending` завжди буде `false`, і кнопка не зміниться. Винесений `SubmitButton` одразу після кліку показує «Надсилаю…» і стає `disabled`.

Є й інший шлях: `useActionState` повертає третій елемент — `pending`: `const [state, formAction, pending] = useActionState(...)`. Він зручний, коли форма вже в Client Component з `useActionState`. `useFormStatus` зручний, щоб зробити одну кнопку для багатьох форм.

> [!quiz] Перевір себе: заповни пропуски в кнопці відправки
> level: junior · type: fill · bank: useState, 'use server' · id: nextjs-start-11-quiz-06
>
> ```tsx fill
> // app/ui/submit-button.tsx
> [['use client'|"use client"]]
>
> import { [[useFormStatus]] } from 'react-dom'
>
> export function SubmitButton() {
>   const { [[pending]] } = useFormStatus()
>   return <button type="submit" [[disabled]]={pending}>Зберегти</button>
> }
> ```
>
> **Пояснення:** хук працює лише в Client Component, тож директива першим рядком. `pending` — `true`, поки форма надсилається, і `disabled` не дає клацнути вдруге. `'use server'` тут не до місця: вона позначає серверні функції, а не компоненти.

> [!quiz] Перевір себе: чому кнопка не показує «Надсилаю…»?
> level: junior · id: nextjs-start-11-quiz-07
>
> ```tsx
> 'use client'
> import { useFormStatus } from 'react-dom'
> import { save } from './actions'
>
> export function Form() {
>   const { pending } = useFormStatus()
>   return (
>     <form action={save}>
>       <button disabled={pending}>{pending ? 'Надсилаю…' : 'Зберегти'}</button>
>     </form>
>   )
> }
> ```
>
> - [x] `useFormStatus` викликано в компоненті, що рендерить форму, а не всередині неї — `pending` завжди `false`
> - [ ] Бракує `'use server'` у компоненті
> - [ ] `useFormStatus` працює лише з `useActionState`
> - [ ] Дія `save` надто швидка, тому стан не встигає змінитися
>
> **Пояснення:** хук шукає найближчу **батьківську** `<form>`. Тут форма — дочірній елемент того самого компонента, тож батьківської форми немає. Винеси кнопку в `SubmitButton` і поклади її всередину `<form>`.

### 🔐 Чому сервер перевіряє все знову

`required` і `maxLength` живуть у браузері, а браузер — у руках користувача. Відкрити DevTools і прибрати `required` — справа пʼяти секунд. А можна взагалі обійтися без браузера: Server Action — це звичайний POST-запит, і **будь-хто** може надіслати його `curl`-ом з будь-якими даними. Спробуй: надішли `curl`-ом на `/guestbook/new` форму з `name=x` і порожнім повідомленням — атрибути браузера тут не діють, але сервер поверне «Імʼя — щонайменше 2 символи» і «Напиши повідомлення», бо `validateEntry` стоїть у самій дії. Документація Next.js попереджає про це прямо: дія доступна прямим POST-запитом, не лише через твій UI. Тому всередині **кожної** дії перевіряй, хто її викликає і чи має він на це право (вхід і права — тема 27 основного посібника), і що дані коректні. Перевірка в браузері — щоб людині було зручно. Перевірка на сервері — щоб застосунок був у безпеці.

> [!quiz] Перевір себе: що захищає від порожнього імені?
> level: junior · id: nextjs-start-11-quiz-08
>
> Користувач прибрав `required` в DevTools і надіслав форму з порожнім імʼям. Що не дасть зберегти такий запис?
>
> - [x] Перевірка `validateEntry` всередині Server Action
> - [ ] Атрибут `required` — браузер однаково його памʼятає
> - [ ] `useFormStatus`: поки `pending`, дані не йдуть на сервер
> - [ ] Next.js сам відхиляє порожні поля у `FormData`
>
> **Пояснення:** усе, що в браузері, користувач контролює сам. `FormData` спокійно несе порожні рядки, а `useFormStatus` лише показує стан. Надійна лише перевірка на сервері, у коді дії.

### 🧯 Типові помилки і як їх читати

**Дія для простої `<form action>` щось повертає.** Без `useActionState` форма чекає функцію, що нічого не повертає:

```tsx
// app/feedback/page.tsx
export default function Page() {
  async function save(formData: FormData) {
    'use server'
    return { ok: false, error: 'Порожньо' }
  }

  return (
    <form action={save}>
      <button type="submit">Надіслати</button>
    </form>
  )
}
```

Редактор підкреслить це червоним, `next dev` промовчить, а `next build` зупиниться на перевірці типів:

```text
app/feedback/page.tsx(9,11): error TS2322: Type '(formData: FormData) => Promise<{ ok: boolean; error: string; }>' is not assignable to type 'string | ((formData: FormData) => void | Promise<void>) | undefined'.
  ...
        Type '{ ok: boolean; error: string; }' is not assignable to type 'void'.
Failed to type check.
```

Читай останній рядок: обʼєкт не можна віддати туди, де чекають `void`, тобто «нічого не повертай». Хочеш показати результат — бери `useActionState`.

**`'use server'` усередині Client Component.** Документація каже прямо: оголосити Server Function в Client Component не можна, лише імпортувати з файлу з `'use server'`:

```tsx
// app/feedback/feedback-form.tsx
'use client'

export function FeedbackForm() {
  async function save(formData: FormData) {
    'use server' // ❌ inline-дія в клієнтському файлі
    console.log(formData.get('text'))
  }

  return (
    <form action={save}>
      <input name="text" />
      <button type="submit">Надіслати</button>
    </form>
  )
}
```

А от повідомлення на 16.3.8 збиває з пантелику:

```text
⨯ ./app/feedback/feedback-form.tsx:2:1
Error: The "use client" directive must be placed before other expressions. Move it to the top of the file to resolve this issue.
  1 | // app/feedback/feedback-form.tsx
> 2 | 'use client'
    | ^^^^^^^^^^^^
...
Import trace:
  Server Component:
    ./app/feedback/feedback-form.tsx
    ./app/feedback/page.tsx
```

> [!warning] Розбіжність з документацією
> На 16.3.8 (`next dev`, Turbopack) inline-функція з `'use server'` у файлі з `'use client'` дає помилку про **розташування `'use client'`**, хоча директива стоїть першим рядком. Справжня причина — `'use server'` усередині клієнтського файлу ([Mutating Data — Client Components](https://nextjs.org/docs/app/getting-started/mutating-data#client-components)). Бачиш таку помилку, а `'use client'` на місці — шукай `'use server'` у тілі функцій і винось дію в окремий `actions.ts`.

**«У мене локально працює, а після деплою список не оновлюється».** Перевір, чи є `revalidatePath` (або `redirect` на сторінку, яку ти оновив). У `next dev` сторінка рендериться на кожен запит, тож забутий `revalidatePath` видно лише після `next build`.

### 🏭 Як це роблять у продакшні

- **Дії — в окремих файлах `actions.ts`** поруч із маршрутом або в `app/lib/actions/`. Inline-дії в сторінці — для прототипів.
- **Валідація — схемою.** Замість ручних `if` беруть Zod або Valibot (тема 23 основного посібника), а логіку перевірки тримають окремо від дії — так її легко тестувати.
- **Кожна дія починається з перевірки доступу**: хто викликає і чи можна йому. Навіть якщо форму видно лише після входу (тема 27 основного посібника).
- **Очікувані помилки — значенням, неочікувані — винятком.** «Закоротке імʼя» повертають у стані форми; «впала база» кидають, і її ловить `error.tsx`.
- **Кнопка блокується під час відправки** (`useFormStatus` або `pending` з `useActionState`) — щоб уникнути подвійних записів.
- **Після мутації — явне оновлення**: `revalidatePath` для сторінок, на яких змінилися дані, потім `redirect`, якщо треба перейти.

## ⚠️ Пастки

> [!pitfall] Перевірка лише в браузері
> `required` і `maxLength` прибираються в DevTools, а дію можна викликати `curl`-ом. Без перевірки в дії в «базу» потрапить що завгодно.
>
> ```tsx
> <input name="name" required /> {/* ❌ єдиний захист */}
> // ✅ у дії: const errors = validateEntry(name, message)
> ```

> [!pitfall] Забутий revalidatePath
> Дані змінилися, а статична сторінка — ні. У `next dev` не видно, після `next build` список «застигає».
>
> ```ts
> addEntry(name, message)
> revalidatePath('/guestbook') // ✅ без цього рядка — старий HTML
> ```

> [!pitfall] revalidatePath після redirect
> `redirect` кидає виняток, тож рядок після нього не виконається.
>
> ```ts
> redirect('/guestbook')
> revalidatePath('/guestbook') // ❌ сюди код не дійде
> ```

> [!pitfall] Число з форми як число
> `formData.get('age')` — рядок `"25"`. `"25" + 1` дає `"251"`, а не `26`.
>
> ```ts
> const age = Number(formData.get('age')) // ✅ і перевір, що не NaN
> ```

> [!pitfall] useFormStatus поруч із form
> У компоненті, що рендерить `<form>`, `pending` завжди `false`. Кнопку з хуком — окремим компонентом усередину форми.

> [!pitfall] Поля очищаються після помилки
> React скидає поля без `value` після кожної дії. Повертай введене в стані й став `defaultValue`.
>
> ```tsx
> <input name="name" defaultValue={state.values.name} />
> ```

## 🔗 Звʼязки

- [[Next.js Start - 10. Дані на сервері]] — як сторінка читає дані; тут ми їх змінюємо.
- [[Next.js Start - 03. React-мінімум, state, події й ефекти]] — `useState` і події: `useActionState` і `useFormStatus` — ті самі хуки, лише для форм.
- [[Next.js Start - 01. Як працює веб]] — GET і POST, коди `303` і `307`: тут вони працюють на тебе.
- [[Next.js Start - 12. Перший деплой на Vercel]] — далі: що змінюється, коли ця форма живе не на `localhost`.
- [[Next.js - 07. Server і Client Components]] — чому дію можна передати в Client Component: через межу вона йде як посилання.
- Далі в основному посібнику: тема 21 — Server Actions під капотом, 22 — форми, 23 — валідація з Zod і помилки, 24 — optimistic UI, 16 — ревалідація (`updateTag`, `refresh`).

## ⚡ Фішки

> [!reel] 📮 Форма з Server Action працює без JavaScript
> У HTML це звичайна POST-форма з прихованим полем `$ACTION_ID_…`. Вимкни JS — запис однаково збережеться, просто сторінка перезавантажиться.

> [!reel] 🔢 З форми не приходять числа
> `FormData` несе лише рядки (і файли). `<input type="number">` дає `"25"`, позначений чекбокс — `"on"`, відсутнє поле — `null`.
>
> ```ts
> typeof formData.get('age') // → "string"
> ```

> [!reel] 🧨 redirect — це виняток
> `redirect()` кидає спеціальну помилку, і Next.js перехоплює її для переходу. Тому `revalidatePath` — до нього, а сам `redirect` — поза `try/catch`.

> [!reel] 🚪 Server Action — відчинені двері
> Дію можна викликати `curl`-ом в обхід твоєї форми. `required` у браузері — для зручності, перевірка в дії — для безпеки.

> [!reel] 🧽 React 19 очищає форму після дії
> Поля без `value` скидаються після кожної відправки, навіть з помилкою. Повертай введене зі стану в `defaultValue`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке Server Action?
> *дуже часто · теорія* · `nextjs-start-11-card-01`
>
> Асинхронна функція з `'use server'`, яку викликає форма (`<form action={fn}>`) чи кнопка. Код виконується на сервері, браузер надсилає лише POST-запит з ідентифікатором дії і даними. Ширший термін — Server Function.
>
> 📚 [[Next.js Start - 11. Перша форма і Server Action#⚡ Перша Server Action|Розділ: перша Server Action]] · [Next.js: Mutating Data](https://nextjs.org/docs/app/getting-started/mutating-data)

> [!question]- Де можна поставити директиву 'use server'?
> *часто · теорія* · `nextjs-start-11-card-02`
>
> Першим рядком тіла `async`-функції (inline-дія, лише в Server Component) або першим рядком файлу — тоді всі його експорти стають діями. У файлі з `'use client'` оголошувати дії не можна, лише імпортувати.
>
> 📚 [[Next.js Start - 11. Перша форма і Server Action#🗂️ Окремий файл actions.ts|Розділ: actions.ts]] · [React: 'use server'](https://react.dev/reference/rsc/use-server)

> [!question]- Що повертає formData.get('age'), якщо в полі type="number" ввели 25?
> *часто · практика* · `nextjs-start-11-card-03`
>
> Рядок `"25"`. Форма передає текст (або `File` для `type="file"`); число треба отримати самому: `Number(...)`. Якщо поля немає — `null`.
>
> 📚 [[Next.js Start - 11. Перша форма і Server Action#📦 FormData: що приходить на сервер|Розділ: FormData]] · [MDN: FormData.get()](https://developer.mozilla.org/en-US/docs/Web/API/FormData/get)

> [!question]- Навіщо revalidatePath після мутації?
> *дуже часто · теорія* · `nextjs-start-11-card-04`
>
> Сторінка могла бути відрендерена заздалегідь (статична). `revalidatePath('/шлях')` позначає її застарілою; у Server Action Next.js одразу рендерить її знову і повертає новий UI в тій самій відповіді. Без цього після `next build` користувач бачить старі дані.
>
> 📚 [[Next.js Start - 11. Перша форма і Server Action#🔄 Як оновити сторінку: revalidatePath і redirect|Розділ: оновлення сторінки]] · [Next.js: revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)

> [!question]- Як показати «Надсилаю…» на кнопці?
> *часто · практика* · `nextjs-start-11-card-05`
>
> `const { pending } = useFormStatus()` з `react-dom` в окремому Client Component, який лежить **усередині** `<form>`. Або третій елемент `useActionState`. Плюс `disabled={pending}`, щоб не було подвійних відправок.
>
> 📚 [[Next.js Start - 11. Перша форма і Server Action#⏳ Кнопка «Надсилаю…»: useFormStatus|Розділ: useFormStatus]] · [React: useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus)

> [!question]- Чим відрізняються 'use client' і 'use server'?
> *часто · теорія* · `nextjs-start-11-card-06`
>
> `'use client'` позначає **компоненти**, чий код їде в браузер. `'use server'` позначає **функції**, які браузер викликає запитом, а виконуються вони на сервері. Server Component директиви не потребує — він серверний за замовчуванням.
>
> 📚 [[Next.js Start - 11. Перша форма і Server Action#🗂️ Окремий файл actions.ts|Розділ: actions.ts]] · [Next.js: use server](https://nextjs.org/docs/app/api-reference/directives/use-server)

### 🟡 Middle

> [!question]- Чому сервер має перевіряти дані, якщо в браузері вже стоїть required?
> *дуже часто · безпека* · `nextjs-start-11-card-07`
>
> Server Action — публічний POST-запит: його можна надіслати `curl`-ом, а атрибути прибрати в DevTools. Браузерна перевірка — для зручності. У кожній дії перевіряй, хто викликає, чи має він право, і чи коректні дані.
>
> 📚 [[Next.js Start - 11. Перша форма і Server Action#🔐 Чому сервер перевіряє все знову|Розділ: перевірка на сервері]] · [Next.js: Data Security](https://nextjs.org/docs/app/guides/data-security)

> [!question]- Чому revalidatePath ставлять до redirect, а redirect — поза try?
> *часто · пастка* · `nextjs-start-11-card-08`
>
> `redirect` кидає службовий виняток, яким Next.js керує переходом. Код після нього не виконується, а `catch` перехопить виняток, і переходу не буде.
>
> 📚 [[Next.js Start - 11. Перша форма і Server Action#🔄 Як оновити сторінку: revalidatePath і redirect|Розділ: redirect]] · [Next.js: redirect](https://nextjs.org/docs/app/api-reference/functions/redirect)

> [!question]- Як показати помилки валідації біля полів?
> *часто · практика* · `nextjs-start-11-card-09`
>
> Форма — Client Component з `useActionState(action, initialState)`. Дія отримує `(prevState, formData)` і **повертає** `{ errors, values }`, а не кидає виняток. Компонент показує `state.errors.name`, а `defaultValue={state.values.name}` зберігає введене, бо React 19 скидає поля після дії.
>
> 📚 [[Next.js Start - 11. Перша форма і Server Action#✅ Перевірка на сервері|Розділ: перевірка на сервері]] · [Next.js: Forms — Validation errors](https://nextjs.org/docs/app/guides/forms#validation-errors)

> [!question]- Що таке progressive enhancement для форм?
> *іноді · теорія* · `nextjs-start-11-card-10`
>
> Базова функція працює без JavaScript, а JS лише додає зручності. Форма з Server Action у Server Component — звичайна HTML-форма з POST, тож відправиться і без JS. З JS — без перезавантаження, з `pending` і помилками.
>
> 📚 [[Next.js Start - 11. Перша форма і Server Action#⚡ Перша Server Action|Розділ: перша Server Action]] · [Next.js: Mutating Data — Server Components](https://nextjs.org/docs/app/getting-started/mutating-data#server-components)

## 🛠️ Практика

> [!task] Перевір форму реєстрації
> level: junior · difficulty: easy · id: nextjs-start-11-task-01 · tags: forms, validation
>
> Напиши `validateSignup(form)` — чисту функцію, яку викличе Server Action реєстрації. `form` — звичайний обʼєкт, зібраний з `FormData`: значення — рядки або `null` (поля немає). Поверни обʼєкт **лише з тими полями, де є помилка**; усе добре — порожній обʼєкт `{}`.
>
> - `name`: після `trim()` щонайменше 2 символи, інакше `'Імʼя — щонайменше 2 символи'`;
> - `email`: містить `@`, і після `@` є крапка з символами до й після неї, інакше `'Невірний email'`;
> - `password`: щонайменше 8 символів, інакше `'Пароль — щонайменше 8 символів'`;
> - `confirm`: збігається з `password`, інакше `'Паролі не збігаються'`.
>
> `null` у будь-якому полі вважай порожнім рядком. Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type SignupForm = {
>   name: string | null
>   email: string | null
>   password: string | null
>   confirm: string | null
> }
>
> type SignupErrors = Partial<Record<keyof SignupForm, string>>
>
> function validateSignup(form: SignupForm): SignupErrors {
>   // твій код
>   return {}
> }
> ```
>
> ```ts tests
> const ok = { name: 'Оля', email: 'olya@example.com', password: 'secret123', confirm: 'secret123' }
>
> test('правильна форма — без помилок', () => {
>   expect(validateSignup(ok)).toEqual({})
> })
>
> test('імʼя з пробілів не рахується', () => {
>   expect(validateSignup({ ...ok, name: '   О  ' })).toEqual({ name: 'Імʼя — щонайменше 2 символи' })
> })
>
> test('email без крапки після @ — помилка', () => {
>   expect(validateSignup({ ...ok, email: 'olya@example' }).email).toBe('Невірний email')
>   expect(validateSignup({ ...ok, email: 'olya.example.com' }).email).toBe('Невірний email')
>   expect(validateSignup({ ...ok, email: 'olya@example.' }).email).toBe('Невірний email')
> })
>
> test('короткий пароль і розбіжність паролів', () => {
>   expect(validateSignup({ ...ok, password: 'short', confirm: 'short' })).toEqual({ password: 'Пароль — щонайменше 8 символів' })
>   expect(validateSignup({ ...ok, confirm: 'secret124' })).toEqual({ confirm: 'Паролі не збігаються' })
> })
>
> test('відсутні поля (null) — помилки, а не виняток', () => {
>   const errors = validateSignup({ name: null, email: null, password: null, confirm: null })
>   expect(Object.keys(errors).sort()).toEqual(['email', 'name', 'password'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу перетвори кожне поле: `const name = (form.name ?? '').trim()`. Тоді `null` не зламає `.length`.
>
> > [!hint]- Підказка 2
> > Для email знайди позицію `@` (`indexOf`) і перевір, що після неї є `.`, а крапка не остання й не одразу після `@`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function validateSignup(form: SignupForm): SignupErrors {
> >   const errors: SignupErrors = {}
> >   const name = (form.name ?? '').trim()
> >   const email = (form.email ?? '').trim()
> >   const password = form.password ?? ''
> >   const confirm = form.confirm ?? ''
> >
> >   if (name.length < 2) errors.name = 'Імʼя — щонайменше 2 символи'
> >
> >   const at = email.indexOf('@')
> >   const dot = email.lastIndexOf('.')
> >   if (at < 1 || dot < at + 2 || dot === email.length - 1) errors.email = 'Невірний email'
> >
> >   if (password.length < 8) errors.password = 'Пароль — щонайменше 8 символів'
> >   if (confirm !== password) errors.confirm = 'Паролі не збігаються'
> >
> >   return errors
> > }
> > ```
> >
> > Функція нічого не читає й не змінює, тож її легко тестувати окремо від Server Action. У дії вона стоїть першим кроком: є помилки — повертаємо їх у стан форми, немає — зберігаємо. Справжню перевірку email краще лишити бібліотеці (Zod, тема курсу 23) і листу з підтвердженням.

> [!task] Залатай дірку в дії «Додати коментар»
> level: junior · difficulty: medium · id: nextjs-start-11-task-02 · tags: security, server-actions
>
> `createComment(input, session, db)` — серце Server Action. `input` — обʼєкт з `FormData` (`{ text, authorId }`), `session` — хто увійшов (`{ userId }` або `null`), `db.add(comment)` — зберегти. Автор довіряє всьому, що прийшло з форми. Виправ:
>
> - гість (`session === null`) → поверни `{ ok: false, error: 'Увійди, щоб коментувати' }` і нічого не зберігай;
> - текст: після `trim()` від 1 до 280 символів, інакше `{ ok: false, error: 'Коментар — від 1 до 280 символів' }`;
> - автор береться **лише з сесії**, `input.authorId` ігнорується — будь-хто може підмінити його в запиті;
> - успіх → `db.add({ authorId, text })` з обрізаним текстом і `{ ok: true }`.
>
> ```js starter
> function createComment(input, session, db) {
>   // ❌ довіряє формі: автор і текст — як прийшли
>   db.add({ authorId: input.authorId, text: input.text })
>   return { ok: true }
> }
> ```
>
> ```js tests
> function fakeDb() {
>   const rows = []
>   return { rows, add: (row) => rows.push(row) }
> }
>
> test('гість не може коментувати', () => {
>   const db = fakeDb()
>   expect(createComment({ text: 'привіт', authorId: 'u1' }, null, db)).toEqual({ ok: false, error: 'Увійди, щоб коментувати' })
>   expect(db.rows).toHaveLength(0)
> })
>
> test('автор — із сесії, а не з форми', () => {
>   const db = fakeDb()
>   createComment({ text: 'привіт', authorId: 'admin' }, { userId: 'u2' }, db)
>   expect(db.rows).toEqual([{ authorId: 'u2', text: 'привіт' }])
> })
>
> test('порожній або задовгий текст — помилка без збереження', () => {
>   const db = fakeDb()
>   const err = { ok: false, error: 'Коментар — від 1 до 280 символів' }
>   expect(createComment({ text: '   ' }, { userId: 'u2' }, db)).toEqual(err)
>   expect(createComment({ text: 'а'.repeat(281) }, { userId: 'u2' }, db)).toEqual(err)
>   expect(createComment({}, { userId: 'u2' }, db)).toEqual(err)
>   expect(db.rows).toHaveLength(0)
> })
>
> test('текст зберігається обрізаним', () => {
>   const db = fakeDb()
>   expect(createComment({ text: '  ок  ' }, { userId: 'u2' }, db)).toEqual({ ok: true })
>   expect(db.rows[0].text).toBe('ок')
> })
> ```
>
> > [!hint]- Підказка 1
> > Порядок перевірок: спершу «хто», потім «що», і лише потім зберігати. Кожна невдача — `return`, щоб `db.add` не виконався.
>
> > [!hint]- Підказка 2
> > `input.text` може бути `undefined` (поля не було). `String(input.text ?? '').trim()` дасть рядок у будь-якому разі.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createComment(input, session, db) {
> >   if (!session) return { ok: false, error: 'Увійди, щоб коментувати' }
> >
> >   const text = String(input.text ?? '').trim()
> >   if (text.length < 1 || text.length > 280) {
> >     return { ok: false, error: 'Коментар — від 1 до 280 символів' }
> >   }
> >
> >   db.add({ authorId: session.userId, text })
> >   return { ok: true }
> > }
> > ```
> >
> > Усе, що прийшло з форми, — пропозиція користувача, а не факт. Хто він — знає лише сервер (з сесії). Тому з форми беремо тільки те, що людина справді вводить (текст), і перевіряємо його. Ідентифікатори, ролі, ціни — з довіреного джерела на сервері.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Mutating Data](https://nextjs.org/docs/app/getting-started/mutating-data) — офіційний старт: Server Functions, форми, `revalidatePath`, `redirect`.
- 🟢 [Next.js — Forms](https://nextjs.org/docs/app/guides/forms) — `FormData`, валідація, `useActionState`, `useFormStatus`.
- 🟡 [Next.js — revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) — що саме оновлюється і де функцію можна викликати.
- 🟡 [Next.js — redirect](https://nextjs.org/docs/app/api-reference/functions/redirect) — чому виняток, коди `303` і `307`.
- 🟡 [Next.js — Data Security](https://nextjs.org/docs/app/guides/data-security) — чому кожна дія — публічний вхід і що в ній перевіряти.
- 🟡 [React — useActionState](https://react.dev/reference/react/useActionState) — стан форми з результатом дії.
- 🟡 [React — useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus) — `pending` і правило «всередині форми».
- 🔴 [React — 'use server'](https://react.dev/reference/rsc/use-server) — першоджерело директиви й обмеження аргументів.
- 🟢 [MDN — FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) — методи `get`, `getAll`, `has`.

> [!important] Підсумок
> - Server Action — `async`-функція з `'use server'`, яку викликає `<form action={fn}>`. Код виконується на сервері, браузер надсилає POST з ідентифікатором дії і `FormData`.
> - Форма з дією в Server Component працює і без JavaScript (progressive enhancement); з JS — без перезавантаження.
> - `FormData.get` повертає рядок, `File` або `null` — числа й булеві перетворюй сам.
> - Після мутації — `revalidatePath`, щоб сторінка показала свіжі дані, і за потреби `redirect` (завжди останнім і поза `try`).
> - Помилки валідації повертай у стан `useActionState`; `useFormStatus` дає `pending` кнопці всередині форми.
> - Сервер перевіряє все сам: дію можна викликати в обхід форми, тож `required` у браузері — не захист.
