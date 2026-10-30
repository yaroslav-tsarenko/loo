---
title: React-мінімум, компоненти, JSX і props
id: nextjs-start-02
slug: 02-react-components-jsx-props
order: 2
level: noob
skill: foundations
icon: px:blocks
tags: [react, components, jsx, props, lists, key]
prerequisites:
  - "[[Next.js Start - 01. Як працює веб]]"
estimatedMinutes: 35
nextVersion: 16.3.8
---

# React-мінімум, компоненти, JSX і props

> [!success] 🎯 Після цього розділу ти зможеш
> - написати компонент як функцію, що повертає JSX, і вкласти його в інший;
> - пояснити правила JSX і вставити в розмітку будь-який JavaScript-вираз через `{}`;
> - передати дані через props і `children`, задати значення за замовчуванням;
> - вивести список з правильним `key` і показати частину інтерфейсу за умовою, не потрапивши в пастку з `0`;
> - зібрати сторінку з маленьких компонентів — так само, як це робить кожна сторінка Next.js.

## 🤔 Передбач

> [!quiz] Що зʼявиться на сторінці?
> level: noob · type: output · id: nextjs-start-02-quiz-01
>
> ```tsx
> export default function Inbox() {
>   const count = 0
>   return <main>{count && <p>Нових повідомлень: {count}</p>}</main>
> }
> ```
>
> - [x] `<main>0</main>` — на сторінці зʼявиться цифра `0`
> - [ ] `<main></main>` — порожньо, бо умова хибна
> - [ ] `<main><p>Нових повідомлень: 0</p></main>`
> - [ ] Помилка: у JSX не можна писати `&&`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. `0 && …` у JavaScript дає `0`, а не `false`. React не малює `false`, `null` і `undefined`, але число `0` — малює. Перевірено в Next.js 16.3.8: сервер віддав саме `<main>0</main>`.

## 🧒 Простими словами

Уяви конструктор LEGO. Ти не ліпиш замок з одного шматка пластику — збираєш його з цеглинок: вежа, стіна, ворота. Кожна цеглинка має форму (як виглядає) і може мати «налаштування»: колір, розмір. **Компонент** — така цеглинка інтерфейсу: кнопка, картка товару, шапка сайту. **Props** — налаштування, які ти передаєш цеглинці ззовні: «ця кнопка червона, з написом „Купити“». **JSX** — інструкція до набору, написана мовою, схожою на HTML: що з чим скласти. А React за цією інструкцією будує сторінку — і сам перебудовує потрібні шматки, коли щось змінюється.

## 🔬 Як це працює насправді

### 🧱 Компонент — це функція

**React** — бібліотека для побудови інтерфейсів з компонентів. **Компонент** — звичайна JavaScript-функція, що повертає розмітку:

```tsx
// app/ui/greeting.tsx
export function Greeting() {
  return <h1>Привіт, Next.js!</h1>
}
```

Три правила:

1. **Назва з великої літери.** `<Greeting />` — твій компонент, `<greeting />` — React вважатиме HTML-тегом. На 16.3.8 TypeScript зупиняє збірку: `Property 'greeting' does not exist on type 'JSX.IntrinsicElements'`, а `next dev`, який типів не перевіряє, віддає в HTML незнайомий тег `<greeting></greeting>`.
2. **Повертає розмітку** (або `null`, якщо показувати нічого).
3. **Експортується**, щоб інші файли могли його імпортувати: `export function` (іменований експорт) або `export default` (один головний на файл; так у Next.js пишуть сторінки).

Компонент використовують як тег — і вкладають один в інший:

```tsx
// app/page.tsx
import { Greeting } from './ui/greeting'

export default function Page() {
  return (
    <main>
      <Greeting />
      <Greeting />
    </main>
  )
}
```

`Page` — теж компонент. У Next.js кожен файл `page.tsx` експортує за замовчуванням компонент сторінки, і фреймворк сам викликає його, коли користувач відкриває адресу (тема 07). Сторінку можна збирати з десятків компонентів: тепер `Greeting` можна перевикористати будь-де. Одне застереження: **оголошуй компоненти на верхньому рівні файлу**, а не всередині інших компонентів — інакше React щоразу вважатиме вкладений компонент новим і скидатиме його стан (про стан — у темі 03).

### 📝 JSX: розмітка в JavaScript

**JSX** — синтаксис, що дозволяє писати схожу на HTML розмітку прямо в JavaScript. Браузер JSX не розуміє: компілятор (у Next.js це робить сам фреймворк) перетворює кожен тег на виклик функції. Ось що TypeScript робить з одним рядком:

```tsx
// було
const el = <h1 className="title">Привіт, {name}!</h1>

// стало (react-jsx)
const el = _jsxs('h1', { className: 'title', children: ['Привіт, ', name, '!'] })
```

Результат виклику — **React-елемент**: звичайний обʼєкт з `type: 'h1'` і `props: { className, children }`. Це лише **опис** того, що треба показати. Далі React перетворює ці описи на HTML (на сервері) або на вузли DOM (у браузері).

Звідси правила JSX — вони не примхи, а наслідки того, що це JavaScript:

- **Один кореневий елемент.** Функція повертає одне значення, тож кілька тегів обгортають у `<div>` або у **фрагмент** `<>…</>`, який не додає зайвого тегу в HTML.
- **Усі теги закриті:** `<img />`, `<br />`, `<input />`.
- **Атрибути — camelCase**, бо стають ключами обʼєкта: `onClick`, `tabIndex`. Слова `class` і `for` у JavaScript зайняті, тож пишуть `className` і `htmlFor`. На `class` TypeScript відповідає: `Property 'class' does not exist on type … Did you mean 'className'?`

```tsx
// app/ui/profile.tsx
const user = {
  name: 'Оля',
  avatarUrl: 'https://i.pravatar.cc/96?u=olya',
  tasks: 3,
}

export function Profile() {
  const greeting = `Привіт, ${user.name}!`
  return (
    <>
      <h2>{greeting}</h2>
      <img
        className="avatar"
        src={user.avatarUrl}
        alt={'Аватар: ' + user.name}
        style={{ width: 48, borderRadius: '50%' }}
      />
      <p>Задач на сьогодні: {user.tasks * 2 - 3}</p>
      <label htmlFor="note">Нотатка</label>
      <input id="note" />
    </>
  )
}
```

Сервер Next.js віддав для цього компонента такий HTML: `<h2>Привіт, Оля!</h2><img class="avatar" … style="width:48px;border-radius:50%"/><p>Задач на сьогодні: <!-- -->3</p><label for="note">…`. `className` став `class`, `htmlFor` — `for`, а число `48` у `style` — `48px`. Коментар `<!-- -->` React ставить між текстом і виразом, щоб у браузері знайти межу між ними.

### 🧮 Фігурні дужки: JavaScript усередині JSX

`{}` відкриває «вікно» в JavaScript. Усередині — **будь-який вираз**: змінна, `user.tasks * 2 - 3`, виклик функції, шаблонний рядок, тернарний оператор. Писати `{}` можна у двох місцях: як текст між тегами (`<h2>{greeting}</h2>`) і як значення атрибута замість лапок (`src={user.avatarUrl}`).

**Інструкції** — `if`, `for`, `const` — у `{}` не працюють: вони не повертають значення. Їх пишуть у тілі функції до `return`.

Подвійні дужки в `style={{ width: 48 }}` — не окремий синтаксис: зовнішні `{}` — вікно в JavaScript, внутрішні — обʼєкт зі стилями. Ключі стилів — теж camelCase: `borderRadius`, а не `border-radius`.

> [!quiz] Перевір себе: заповни пропуски в картці користувача
> level: noob · type: fill · bank: class, for, font-size · id: nextjs-start-02-quiz-02
>
> ```tsx fill
> export function UserCard() {
>   const name = 'Тарас'
>   return (
>     <>
>       <img [[className]]="avatar" src="/taras.png" alt={name} />
>       <label [[htmlFor]]="bio">Про {[[name]]}</label>
>       <textarea id="bio" style={{ [[fontSize]]: 14 }} />
>     </>
>   )
> }
> ```
>
> **Пояснення:** `class` і `for` — зарезервовані слова JavaScript, тому в JSX `className` і `htmlFor`. Змінна потрапляє в текст через `{name}`, а стилі — обʼєкт усередині `{}` з ключами в camelCase: `fontSize`, не `font-size`.

> [!quiz] Перевір себе: обери правдиві твердження про JSX
> level: noob · type: multi · id: nextjs-start-02-quiz-03
> - [x] JSX компілюється у виклики функцій, що створюють звичайні обʼєкти-описи
> - [x] Компонент має повертати один кореневий елемент; фрагмент `<>…</>` не додає тегу в HTML
> - [ ] Усередині `{}` можна написати `if (isAdmin) { … }`
> - [ ] `<card />` з малої літери — твій компонент `Card`
> - [x] `style` приймає обʼєкт, а не CSS-рядок
>
> **Пояснення:** у `{}` — лише вирази; `if` пишуть до `return` або замінюють тернарним оператором. Тег з малої літери React вважає HTML-елементом. А `style="color: red"` TypeScript не пропустить: потрібен `style={{ color: 'red' }}`.

### 📦 Props: дані ззовні

**Props** (properties) — аргументи компонента. Батьківський компонент передає їх як атрибути, а дочірній отримує **один обʼєкт** з усіма props — і зазвичай одразу деструктурує його:

```tsx
// app/ui/avatar.tsx
type AvatarProps = {
  name: string
  imageUrl: string
  size?: number
}

export function Avatar({ name, imageUrl, size = 48 }: AvatarProps) {
  return <img src={imageUrl} alt={name} width={size} height={size} />
}
```

```tsx
<Avatar name="Оля" imageUrl="https://i.pravatar.cc/96?u=olya" />
<Avatar name="Тарас" imageUrl="https://i.pravatar.cc/96?u=taras" size={32} />
```

- Рядок можна передати в лапках, усе інше — у `{}`: `size={32}`, `isAdmin={true}`. Просто `isAdmin` без значення означає `true`.
- **Значення за замовчуванням** задають у деструктуризації: `size = 48` спрацює, коли prop не передали (`undefined`), але не для `null` чи `0`.
- Тип `AvatarProps` описує, які props компонент приймає; TypeScript підкаже, якщо ти забув `name` (детально — тема 04).

Головне правило: **props лише для читання.** Компонент не змінює те, що отримав, — він лише будує з цього розмітку. У dev-режимі React заморожує обʼєкт props, і спроба змінити його падає: `TypeError: Cannot assign to read only property 'label' of object '#<Object>'` (перевірено на 16.3.8). Потрібне інше значення — обчисли нову змінну: `const label = props.label.toUpperCase()`.

Це частина ширшого правила: **компонент має бути чистим** — для тих самих props повертати ту саму розмітку і нічого не змінювати поза собою під час рендеру. Для Next.js це критично: той самий компонент може рендеритися на сервері, під час збірки і ще раз у браузері, і всі результати мусять збігатися.

> [!quiz] Перевір себе: що буде, якщо змінити prop?
> level: noob · id: nextjs-start-02-quiz-04
>
> ```tsx
> function Badge(props: { label: string }) {
>   props.label = props.label.toUpperCase()
>   return <span>{props.label}</span>
> }
> ```
>
> Що станеться в `next dev`, коли сторінка рендерить `<Badge label="new" />`?
>
> - [x] Помилка `Cannot assign to read only property 'label'`: props заморожені
> - [ ] Покаже `NEW` — рядок можна змінювати, якщо це твій компонент
> - [ ] Покаже `new`: React мовчки ігнорує зміну
> - [ ] Батьківський компонент теж отримає `NEW`
>
> **Пояснення:** props — read-only. У dev-режимі React заморожує обʼєкт, і присвоєння кидає `TypeError` — так помилку видно одразу. Правильно — нова змінна: `const label = props.label.toUpperCase()`.

### 🎁 children: вміст між тегами

Усе, що ти пишеш **між** відкривальним і закривальним тегом компонента, приходить у спеціальний prop `children`:

```tsx
// app/ui/card.tsx
type CardProps = {
  title: string
  children: React.ReactNode
}

export function Card({ title, children }: CardProps) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {children}
    </section>
  )
}
```

```tsx
<Card title="Команда">
  <Avatar name="Оля" imageUrl="https://i.pravatar.cc/96?u=olya" />
  <Avatar name="Тарас" imageUrl="https://i.pravatar.cc/96?u=taras" size={32} />
</Card>
```

`React.ReactNode` — тип «усе, що React уміє показати»: елементи, рядки, числа, масиви, `null`. `Card` не знає, що всередині, — вона лише дає рамку й заголовок. Це **композиція**: великі шматки інтерфейсу збирають, вкладаючи компоненти один в одного, а не роздуваючи один компонент десятком props. Так само влаштовані layouts у Next.js: `layout.tsx` отримує сторінку як `children` і загортає її в спільну шапку й меню (тема 07). А в основному курсі `children` стане ключем до поєднання серверних і клієнтських компонентів ([[Next.js - 07. Server і Client Components]]).

> [!diagram] Як props течуть деревом компонентів
> ```yaml
> layout: tree
> nodes:
>   - { id: page, label: "Page", text: "app/page.tsx", tone: blue, icon: "px:file" }
>   - { id: card1, label: "Card", code: "title=\"Команда\"", parent: page, tone: violet }
>   - { id: av1, label: "Avatar", code: "name=\"Оля\"", note: "size = 48 за замовчуванням", parent: card1, tone: mint }
>   - { id: av2, label: "Avatar", code: "name=\"Тарас\" size={32}", parent: card1, tone: mint }
>   - { id: card2, label: "Card", code: "title=\"Сьогодні\"", parent: page, tone: violet }
>   - { id: list, label: "TodoList", text: "ul → li × 2", parent: card2, tone: yellow }
> steps:
>   - { focus: page, note: "Page — корінь дерева. Вона вирішує, які компоненти показати і з якими props." }
>   - { show: [card1, card2], note: "Дві картки — той самий компонент Card з різними props title. Компонент один, екземплярів два." }
>   - { show: [av1, av2], note: "Аватари — children першої картки. Card їх не знає: вона рендерить {children} у своє місце." }
>   - { focus: av1, note: "Оля не отримала size — спрацювало значення за замовчуванням 48." }
>   - { show: list, note: "Друга картка містить TodoList. Дані течуть згори вниз: дочірній компонент не може змінити props батька." }
> ```
> Кожен вузол — виклик функції-компонента. Дані йдуть лише згори вниз, через props.

### 🔁 Списки і key

Список у React — масив елементів, найчастіше отриманий через `map`:

```tsx
// app/ui/todo-list.tsx
type Todo = { id: string; title: string; done: boolean }

const todos: Todo[] = [
  { id: 't1', title: 'Прочитати тему 02', done: true },
  { id: 't2', title: 'Зробити задачі', done: false },
  { id: 't3', title: 'Повторити картки', done: false },
]

export function TodoList() {
  const open = todos.filter((todo) => !todo.done)
  return (
    <ul>
      {open.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

`filter` спершу прибирає виконані задачі, `map` перетворює кожну решту на `<li>`. Обчислювати те, що показуєш, прямо в тілі компонента — нормально й правильно: окремий стан для «відфільтрованого списку» не потрібен.

**`key`** — підпис кожного елемента списку, за яким React упізнає його між рендерами. Коли список змінюється (додали, видалили, пересортували), React порівнює ключі й розуміє, який елемент куди переїхав, замість того щоб переробляти все підряд. Без `key` у `next dev` зʼявляється попередження: `Each child in a list should have a unique "key" prop.`

Звідки брати ключ:

- **З даних:** `id` з бази, артикул, slug — стабільний і унікальний серед сусідів.
- **Не індекс масиву**, якщо список може змінювати порядок чи довжину: після видалення першого елемента всі індекси зсунуться, і React приписуватиме стан (введений текст, відкрите меню) не тим рядкам. Індекс годиться лише для статичного списку, що ніколи не змінюється.
- **Не `Math.random()`** чи `crypto.randomUUID()` під час рендеру: новий ключ щоразу змусить React перестворювати кожен елемент.

Ще дві деталі. `key` — не prop: компонент `Item` не отримає його в `props` (перевірено на 16.3.8: `props.key` — `undefined`). Якщо id потрібен усередині, передай його окремо: `<Item key={p.id} id={p.id} />`. А коли на кожен елемент треба кілька тегів без обгортки, коротке `<>` ключа не приймає — пиши `<Fragment key={…}>` з імпортом з `react`:

```tsx
// app/ui/glossary.tsx
import { Fragment } from 'react'

const terms = [
  { id: 'url', term: 'URL', meaning: 'адреса ресурсу' },
  { id: 'jsx', term: 'JSX', meaning: 'розмітка всередині JavaScript' },
]

export function Glossary() {
  return (
    <dl>
      {terms.map((t) => (
        <Fragment key={t.id}>
          <dt>{t.term}</dt>
          <dd>{t.meaning}</dd>
        </Fragment>
      ))}
    </dl>
  )
}
```

> [!quiz] Перевір себе: який key найкращий?
> level: noob · id: nextjs-start-02-quiz-05
>
> Список товарів з бази можна сортувати за ціною і видаляти з нього позиції. Що передати в `key`?
>
> - [x] `product.id` з бази
> - [ ] Індекс з `map((product, index) => …)`
> - [ ] `Math.random()` — точно унікальний
> - [ ] `product.name` — назви ж різні
>
> **Пояснення:** id стабільний і унікальний. Індекс зсувається після сортування й видалення, тож React плутатиме елементи. Випадкове число змінюється на кожному рендері — React щоразу перестворюватиме весь список. Назви можуть повторитися (два «Чайники» від різних виробників).

> [!quiz] Що покаже data-key?
> level: noob · type: output · id: nextjs-start-02-quiz-06
>
> ```tsx
> function Item({ title, ...rest }: { title: string; key?: string }) {
>   return <li data-key={String((rest as { key?: string }).key)}>{title}</li>
> }
>
> export default function Page() {
>   return <ul>{['a', 'b'].map((t) => <Item key={t} title={t} />)}</ul>
> }
> ```
>
> Що буде в атрибуті `data-key` першого `<li>`?
>
> **Відповідь:** `undefined`
>
> **Пояснення:** `key` React забирає собі й не передає компоненту. Перевірено в Next.js 16.3.8: сервер віддав `<li data-key="undefined">a</li>`. Потрібен id у компоненті — передай його ще одним prop.

> [!quiz] Перевір себе: склади компонент списку
> level: noob · type: order · id: nextjs-start-02-quiz-07
>
> Компонент показує лише невиконані задачі.
>
> ```tsx order
> export function TodoList({ todos }: { todos: Todo[] }) {
>   const open = todos.filter((todo) => !todo.done)
>   return (
>     <ul>
>       {open.map((todo) => (
>         <li key={todo.id}>{todo.title}</li>
>       ))}
>     </ul>
>   )
> }
>         <li>{todo.title}</li> // ✗
> ```
>
> **Пояснення:** спершу обчислюємо, що показати (`filter`), потім перетворюємо дані на елементи (`map`). Кожен `<li>` у списку потребує `key` з даних, інакше `next dev` попередить про відсутній `key`.

### 🔀 Умовний рендеринг

Показати частину інтерфейсу за умовою можна трьома способами — і всі вони звичайний JavaScript:

```tsx
// app/ui/status.tsx
type StatusProps = { unread: number; isAdmin: boolean; error?: string }

export function Status({ unread, isAdmin, error }: StatusProps) {
  if (error) {
    return <p role="alert">Помилка: {error}</p>
  }
  return (
    <div>
      <p>{unread > 0 ? `Непрочитаних: ${unread}` : 'Усе прочитано'}</p>
      {isAdmin && <a href="/admin">Адмінка</a>}
    </div>
  )
}
```

1. **`if` з раннім `return`** — коли залежить увесь результат (помилка, порожній стан). Повернути `null` — означає не показати нічого.
2. **Тернарний оператор `умова ? A : B`** — вибір з двох варіантів прямо в JSX.
3. **`умова && A`** — «показати або нічого». Працює, бо React не малює `false`, `null`, `undefined` і `true`.

Пастка з 🤔 Передбач: ліворуч від `&&` має стояти **булеве значення**. `count && …` при `count = 0` повертає `0`, а число React малює. Виправлення: `count > 0 && …` або тернарний оператор `count > 0 ? … : null`.

> [!quiz] Що відрендерить сервер?
> level: noob · type: output · id: nextjs-start-02-quiz-08
>
> Сторінка рендерить `<Status unread={5} isAdmin />` з компонента вище. Який HTML прийде в браузер?
>
> - [x] `<div><p>Непрочитаних: 5</p><a href="/admin">Адмінка</a></div>`
> - [ ] `<div><p>Непрочитаних: 5</p>true</div>`
> - [ ] `<div><p>Усе прочитано</p><a href="/admin">Адмінка</a></div>`
> - [ ] `<p role="alert">Помилка: undefined</p>`
>
> **Пояснення:** `isAdmin` без значення — це `true`, тож `&&` повертає посилання. `5 > 0` — перша гілка тернарного оператора. `error` не передали, він `undefined`, і ранній `return` не спрацював. Перевірено в Next.js 16.3.8.

### 🏭 Як це роблять у продакшні

- **Один компонент — один файл** з іменованим експортом; файли поруч з місцем використання або в `app/ui/` чи `components/`. `export default` — там, де його вимагає фреймворк (`page.tsx`, `layout.tsx`).
- **Типи props** — у кожного компонента. Помилку в назві чи типі prop TypeScript ловить до запуску.
- **Ключі з даних**, а не з індексів; якщо в даних немає id — додай його на рівні даних, а не в рендері.
- **Дизайн-система з `className`**: кнопки й картки з варіантами (`primary`, `danger`, `sm`, `lg`), а класи збирає маленька функція на кшталт `clsx` (саме таку ти напишеш у 🛠️ Практика).

## ⚠️ Пастки

> [!pitfall] 0 ліворуч від &&
> Число `0` — не `false`: React його малює.
>
> ```tsx
> {items.length && <List items={items} />} // ❌ порожній масив → «0»
> {items.length > 0 && <List items={items} />} // ✅
> ```

> [!pitfall] Індекс замість key
> Після видалення чи сортування індекси зсуваються, і стан рядків «переїжджає» не туди.
>
> ```tsx
> {todos.map((todo, i) => <TodoRow key={i} todo={todo} />)} // ❌
> {todos.map((todo) => <TodoRow key={todo.id} todo={todo} />)} // ✅
> ```

> [!pitfall] Компонент усередині компонента
> Вкладене оголошення — нова функція на кожному рендері, і React вважає її новим компонентом, скидаючи стан.
>
> ```tsx
> function Page() {
>   function Row() { return <li /> } // ❌ оголоси Row на верхньому рівні файлу
>   return <ul><Row /></ul>
> }
> ```

> [!pitfall] Умова в шаблонному рядку className
> `false` у шаблонному рядку стає текстом `"false"`.
>
> ```tsx
> <button className={`btn ${disabled && 'btn-disabled'}`} /> // ❌ "btn false"
> <button className={`btn ${disabled ? 'btn-disabled' : ''}`} /> // ✅
> ```

## 🎤 На співбесіді

> [!interview] Навіщо React потрібен key у списках і чому індекс — погана ідея?
> level: junior · frequency: дуже часто · id: nextjs-start-02-int-01
>
> ---
>
> `key` ідентифікує елемент серед сусідів між рендерами: за ним React зіставляє старий і новий список і переносить DOM та стан на правильні елементи. Ключ має бути стабільним і унікальним серед сусідів — зазвичай id з даних. Індекс ламається, коли список сортують, фільтрують чи видаляють з нього: індекси зсуваються, і стан (введений текст, фокус) прилипає до чужих рядків. `Math.random()` у рендері гірший: React перестворює всі елементи. `key` не передається в props.
>
> 📚 [[Next.js Start - 02. React-мінімум, компоненти, JSX і props#🔁 Списки і key|Розділ: списки й key]] · [React: Rendering Lists](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)

## 🔗 Звʼязки

- [[JavaScript Start - 06. Функції]], [[JavaScript Start - 07. Масиви]] і [[JavaScript Start - 08. Обʼєкти]] — функції, `map`/`filter`, деструктуризація, на яких стоїть React.
- Довідник React (переклад react.dev): [[Your First Component]], [[Writing Markup with JSX]], [[JavaScript in JSX with Curly Braces]], [[Passing Props to a Component]], [[Conditional Rendering]], [[Rendering Lists]], [[Keeping Components Pure]], [[Your UI as a Tree]].
- Далі: [[Next.js Start - 03. React-мінімум, state, події й ефекти]] — як компонент реагує на дії користувача; [[Next.js Start - 04. TypeScript-мінімум для Next.js]] — типи props детально.

## ⚡ Фішки

> [!reel] 0️⃣ React малює нуль, але не false
> `false`, `null`, `undefined` і `true` React пропускає, а число `0` показує. Тому `{count && <Badge />}` при нулі виводить самотню цифру.

> [!reel] 🔑 key — не prop
> React забирає `key` собі: всередині компонента `props.key` — `undefined`. Потрібен id — передай ще раз окремим prop.
>
> ```tsx
> <Item key={p.id} id={p.id} />
> ```

> [!reel] 🔡 Маленька літера — і компонент став HTML-тегом
> `<greeting />` React вважає HTML-тегом і віддає в сторінку `<greeting></greeting>`. Компоненти — завжди з великої: `<Greeting />`.

> [!reel] 🧊 Props заморожені
> У dev-режимі React заморожує обʼєкт props: `props.label = 'x'` кидає `TypeError: Cannot assign to read only property`. Компонент лише читає props.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке компонент у React і які в нього правила?
> *дуже часто · теорія* · `nextjs-start-02-card-01`
>
> Функція, що повертає JSX (або `null`). Назва — з великої літери, інакше React вважатиме тег HTML-елементом. Оголошується на верхньому рівні файлу й експортується, щоб її імпортували інші.
>
> 📚 [[Next.js Start - 02. React-мінімум, компоненти, JSX і props#🧱 Компонент — це функція|Розділ: компонент]] · [React: Your First Component](https://react.dev/learn/your-first-component)

> [!question]- На що перетворюється JSX?
> *часто · теорія* · `nextjs-start-02-card-02`
>
> Компілятор перетворює кожен тег на виклик `jsx()`/`jsxs()` з `react/jsx-runtime`, який повертає React-елемент — обʼєкт з `type` і `props`. Це опис, з якого React потім робить HTML на сервері чи DOM у браузері.
>
> ```tsx
> <h1 className="title">Привіт</h1>
> // → _jsx('h1', { className: 'title', children: 'Привіт' })
> ```
>
> 📚 [[Next.js Start - 02. React-мінімум, компоненти, JSX і props#📝 JSX: розмітка в JavaScript|Розділ: JSX]] · [React: Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)

> [!question]- Назви правила JSX, які відрізняють його від HTML.
> *часто · код* · `nextjs-start-02-card-03`
>
> Один кореневий елемент (або фрагмент `<>…</>`), усі теги закриті, атрибути camelCase, `className` замість `class`, `htmlFor` замість `for`, `style` — обʼєкт з camelCase-ключами.
>
> 📚 [[Next.js Start - 02. React-мінімум, компоненти, JSX і props#📝 JSX: розмітка в JavaScript|Розділ: правила JSX]] · [React: Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx#the-rules-of-jsx)

> [!question]- Що можна писати у фігурних дужках JSX, а що ні?
> *часто · код* · `nextjs-start-02-card-04`
>
> Будь-який вираз: змінну, арифметику, виклик функції, тернарний оператор, `map`. Інструкції (`if`, `for`, оголошення) — ні: їх пишуть у тілі функції до `return`. Дужки ставлять як текст між тегами або як значення атрибута.
>
> 📚 [[Next.js Start - 02. React-мінімум, компоненти, JSX і props#🧮 Фігурні дужки: JavaScript усередині JSX|Розділ: фігурні дужки]] · [React: JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)

> [!question]- Як передати й прочитати props, як задати значення за замовчуванням?
> *дуже часто · код* · `nextjs-start-02-card-05`
>
> Батько передає атрибути (`<Avatar name="Оля" size={32} />`), дочірній отримує один обʼєкт і деструктурує його. За замовчуванням — у деструктуризації: `{ size = 48 }`, спрацьовує лише для `undefined`. Props лише для читання.
>
> 📚 [[Next.js Start - 02. React-мінімум, компоненти, JSX і props#📦 Props: дані ззовні|Розділ: props]] · [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)

> [!question]- Що таке children і навіщо він потрібен?
> *часто · теорія* · `nextjs-start-02-card-06`
>
> Prop з усім, що написано між тегами компонента. Дає змогу робити «рамки» (`Card`, `Modal`, `Layout`), які не знають свого вмісту, і збирати інтерфейс композицією. Так `layout.tsx` у Next.js отримує сторінку.
>
> 📚 [[Next.js Start - 02. React-мінімум, компоненти, JSX і props#🎁 children: вміст між тегами|Розділ: children]] · [React: Passing JSX as children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)

> [!question]- Навіщо key у списку і що в нього передавати?
> *дуже часто · теорія* · `nextjs-start-02-card-07`
>
> За `key` React упізнає елемент між рендерами. Ключ — стабільний і унікальний серед сусідів, з даних (`id`). Не індекс, якщо список змінюється, і не випадкове число. У компонент `key` не передається.
>
> 📚 [[Next.js Start - 02. React-мінімум, компоненти, JSX і props#🔁 Списки і key|Розділ: списки й key]] · [React: Rendering Lists](https://react.dev/learn/rendering-lists)

> [!question]- Які є способи умовного рендерингу і яка пастка з &&?
> *часто · код* · `nextjs-start-02-card-08`
>
> `if` з раннім `return` (зокрема `return null`), тернарний оператор, `умова && <A />`. Ліворуч від `&&` — лише булеве значення: `0 && …` повертає `0`, і React його малює.
>
> 📚 [[Next.js Start - 02. React-мінімум, компоненти, JSX і props#🔀 Умовний рендеринг|Розділ: умовний рендеринг]] · [React: Conditional Rendering](https://react.dev/learn/conditional-rendering)

> [!question]- Що означає «компонент має бути чистим» і чому це важливо для Next.js?
> *часто · теорія* · `nextjs-start-02-card-09`
>
> Для тих самих props він повертає ту саму розмітку і під час рендеру нічого не змінює поза собою (props, глобальні змінні). Next.js рендерить компонент на сервері, під час збірки і в браузері — результати мусять збігатися.
>
> 📚 [[Next.js Start - 02. React-мінімум, компоненти, JSX і props#📦 Props: дані ззовні|Розділ: чисті компоненти]] · [React: Keeping Components Pure](https://react.dev/learn/keeping-components-pure)

## 🛠️ Практика

> [!task] Збери className кнопки з props
> level: noob · difficulty: easy · id: nextjs-start-02-task-01 · tags: props, classname
>
> Кнопка дизайн-системи приймає props і має перетворити їх на рядок для `className`. Напиши `buttonClassName(props)`:
>
> - завжди `btn`;
> - варіант `btn-<variant>`: `primary` (за замовчуванням), `secondary` або `danger`;
> - розмір `btn-<size>`: `sm`, `md` (за замовчуванням) або `lg`;
> - `btn-disabled`, якщо `disabled: true`; `w-full`, якщо `fullWidth: true`;
> - у кінці — власний `className` від батька, якщо він не порожній (пробіли з країв прибери).
>
> Класи йдуть саме в цьому порядку, через один пробіл, без `false`, `undefined` і подвійних пробілів. Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type ButtonProps = {
>   variant?: 'primary' | 'secondary' | 'danger'
>   size?: 'sm' | 'md' | 'lg'
>   disabled?: boolean
>   fullWidth?: boolean
>   className?: string
> }
>
> function buttonClassName({ variant, size, disabled, fullWidth, className }: ButtonProps): string {
>   // ❌ виглядає коротко, але false і undefined потраплять у рядок
>   return `btn btn-${variant} btn-${size} ${disabled && 'btn-disabled'} ${fullWidth && 'w-full'} ${className}`
> }
> ```
>
> ```ts tests
> test('без props — варіант і розмір за замовчуванням', () => {
>   expect(buttonClassName({})).toBe('btn btn-primary btn-md')
> })
>
> test('бере variant і size з props', () => {
>   expect(buttonClassName({ variant: 'danger', size: 'lg' })).toBe('btn btn-danger btn-lg')
> })
>
> test('додає прапорці лише коли вони true', () => {
>   expect(buttonClassName({ disabled: true, fullWidth: true })).toBe('btn btn-primary btn-md btn-disabled w-full')
>   expect(buttonClassName({ disabled: false, fullWidth: false })).toBe('btn btn-primary btn-md')
> })
>
> test('додає власний className у кінці, без зайвих пробілів', () => {
>   expect(buttonClassName({ size: 'sm', className: '  mt-4 ' })).toBe('btn btn-primary btn-sm mt-4')
>   expect(buttonClassName({ className: '' })).toBe('btn btn-primary btn-md')
> })
>
> test('ніколи не містить false, undefined чи подвійних пробілів', () => {
>   const result = buttonClassName({ variant: 'secondary', disabled: false })
>   expect(result).not.toMatch(/false|undefined|  /)
> })
> ```
>
> > [!hint]- Підказка 1
> > Значення за замовчуванням задай у деструктуризації: `{ variant = 'primary', size = 'md', … }`.
>
> > [!hint]- Підказка 2
> > Збери класи в масив, умовні додавай через `if` (або `cond && 'клас'`), потім `filter(Boolean).join(' ')`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type ButtonProps = {
> >   variant?: 'primary' | 'secondary' | 'danger'
> >   size?: 'sm' | 'md' | 'lg'
> >   disabled?: boolean
> >   fullWidth?: boolean
> >   className?: string
> > }
> >
> > function buttonClassName({
> >   variant = 'primary',
> >   size = 'md',
> >   disabled = false,
> >   fullWidth = false,
> >   className = '',
> > }: ButtonProps): string {
> >   const classes = ['btn', `btn-${variant}`, `btn-${size}`]
> >   if (disabled) classes.push('btn-disabled')
> >   if (fullWidth) classes.push('w-full')
> >   if (className.trim()) classes.push(className.trim())
> >   return classes.join(' ')
> > }
> > ```
> >
> > Масив плюс `join` не дає подвійних пробілів і випадкових `"false"`. Бібліотеки `clsx` і `classnames` роблять те саме для будь-яких умов — з ними й працюють у продакшні.

> [!task] Підготуй товари до рендеру списку
> level: noob · difficulty: medium · id: nextjs-start-02-task-02 · tags: lists, key, filter
>
> Компонент каталогу рендерить `items.map((item) => <li key={item.key}>{item.label}</li>)`. Напиши чисту функцію `toListItems(products, filters)`, яка готує для нього дані:
>
> - `products` — масив `{ id, name, price, stock }` (`id` — число з бази);
> - `filters.query` — рядок пошуку: лишай товари, у назві яких він є, **без урахування регістру** і пробілів з країв; порожній чи відсутній запит — показати все;
> - `filters.inStockOnly` — якщо `true`, лишай лише товари зі `stock > 0`;
> - результат — масив `{ key, label }`, де `key` — `id` **рядком**, а `label` — `"Назва — 120 ₴"`;
> - порядок — як у вхідному масиві; вхідний масив не змінюй.
>
> ```js starter
> function toListItems(products, filters = {}) {
>   // ❌ ключ з індексу: після фільтра ключі вже не відповідають товарам
>   return products.map((p, index) => ({ key: String(index), label: p.name + ' — ' + p.price + ' ₴' }))
> }
> ```
>
> ```js tests
> const products = [
>   { id: 7, name: 'Чайник', price: 900, stock: 3 },
>   { id: 12, name: 'Чашка біла', price: 120, stock: 0 },
>   { id: 15, name: 'Чашка синя', price: 130, stock: 8 },
> ]
>
> test('без фільтрів — усі товари з ключами з id', () => {
>   expect(toListItems(products)).toEqual([
>     { key: '7', label: 'Чайник — 900 ₴' },
>     { key: '12', label: 'Чашка біла — 120 ₴' },
>     { key: '15', label: 'Чашка синя — 130 ₴' },
>   ])
> })
>
> test('шукає без урахування регістру й пробілів з країв', () => {
>   expect(toListItems(products, { query: '  ЧАШКА ' }).map((i) => i.key)).toEqual(['12', '15'])
> })
>
> test('ключі після фільтра лишаються ключами товарів, а не індексами', () => {
>   expect(toListItems(products, { query: 'синя' })).toEqual([{ key: '15', label: 'Чашка синя — 130 ₴' }])
> })
>
> test('inStockOnly прибирає товари без залишку', () => {
>   expect(toListItems(products, { inStockOnly: true }).map((i) => i.key)).toEqual(['7', '15'])
> })
>
> test('фільтри поєднуються', () => {
>   expect(toListItems(products, { query: 'чашка', inStockOnly: true }).map((i) => i.key)).toEqual(['15'])
> })
>
> test('не змінює вхідний масив', () => {
>   const copy = structuredClone(products)
>   toListItems(products, { query: 'чай', inStockOnly: true })
>   expect(products).toEqual(copy)
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу `filter`, потім `map` — як у компоненті `TodoList`. `filter` і `map` повертають нові масиви, тож вхідний лишається цілим.
>
> > [!hint]- Підказка 2
> > Нормалізуй запит один раз: `const q = (filters.query ?? '').trim().toLowerCase()`. Порожній `q` пропускає все, бо `'Чайник'.includes('')` — `true`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function toListItems(products, filters = {}) {
> >   const q = (filters.query ?? '').trim().toLowerCase()
> >   return products
> >     .filter((p) => p.name.toLowerCase().includes(q))
> >     .filter((p) => !filters.inStockOnly || p.stock > 0)
> >     .map((p) => ({ key: String(p.id), label: `${p.name} — ${p.price} ₴` }))
> > }
> > ```
> >
> > Ключ іде з даних, тож після будь-якого фільтра чи сортування React упізнає кожен рядок. Таку функцію зручно тестувати окремо від JSX, а компонент лишається простим: він лише викликає її й рендерить `map`.

## 📚 Джерела та що почитати

- 🟢 [React — Describing the UI](https://react.dev/learn/describing-the-ui) — огляд розділу, на якому стоїть ця тема.
- 🟢 [React — Your First Component](https://react.dev/learn/your-first-component) — компоненти як функції, експорт і вкладення.
- 🟢 [React — Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx) — правила JSX і чому вони такі.
- 🟢 [React — JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces) — вирази й подвійні дужки.
- 🟡 [React — Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component) — props, значення за замовчуванням, `children`.
- 🟡 [React — Conditional Rendering](https://react.dev/learn/conditional-rendering) — `if`, `?:`, `&&` і пастка з `0`.
- 🟡 [React — Rendering Lists](https://react.dev/learn/rendering-lists) — `map`, `filter` і правила `key`.
- 🟡 [React — Keeping Components Pure](https://react.dev/learn/keeping-components-pure) — чому рендер не має побічних ефектів.
- 🔴 [React — Fragment](https://react.dev/reference/react/Fragment) — довідник: `<>` проти `<Fragment key>`.

> [!important] Підсумок
> - Компонент — функція з великої літери, що повертає JSX; сторінки Next.js — теж компоненти (`export default`).
> - JSX компілюється у виклики, що створюють обʼєкти-описи: звідси один корінь, `className`, `htmlFor`, camelCase і `style` як обʼєкт. У `{}` — лише вирази.
> - Props — аргументи компонента лише для читання; `children` — вміст між тегами, основа композиції й layouts.
> - Список — `map` з `key` з даних (не індекс, не випадковість); `key` не потрапляє в props.
> - Умова — `if` з `return`, `?:` або `&&` з булевим значенням ліворуч: `0 && …` малює `0`.
