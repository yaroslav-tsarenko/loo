---
title: TypeScript-мінімум для Next.js
id: nextjs-start-04
slug: 04-typescript-minimum
order: 4
level: noob
skill: foundations
icon: px:tag
tags: [nextjs, typescript, types, generics, satisfies, beginner]
prerequisites:
  - "[[Next.js Start - 03. React-мінімум, state, події й ефекти]]"
estimatedMinutes: 40
nextVersion: 16.3.8
---

# TypeScript-мінімум для Next.js

> [!success] 🎯 Після цього розділу ти зможеш
> - описати форму даних через `type` або `interface` і знати, чим вони відрізняються;
> - типізувати props компонента, `children` (`React.ReactNode`), необовʼязкові props і state;
> - використати union-типи і **звуження** (narrowing), щоб TypeScript сам знав, яке поле доступне;
> - прочитати generic-тип (`Promise<Post>`, `useState<User | null>`, `first<T>`) і написати простий;
> - обрати між анотацією, `satisfies` і `as const`;
> - типізувати async-функції й не забувати `await`;
> - читати помилки TypeScript у `next build` і знати, як Next.js типізує `params` сторінки.

## 🤔 Передбач

> [!quiz] Що скаже TypeScript про цей код?
> level: junior · type: output · id: nextjs-start-04-quiz-01
>
> ```ts
> // lib/posts.ts
> export type Post = { slug: string; title: string }
>
> const posts: Post[] = [{ slug: 'hello', title: 'Привіт, Next.js' }]
>
> export async function getPost(slug: string): Promise<Post | undefined> {
>   return posts.find((p) => p.slug === slug)
> }
>
> // деінде
> const post = getPost('hello')
> console.log(post.title)
> ```
>
> - [x] Помилка: `Property 'title' does not exist on type 'Promise<Post | undefined>'.`
> - [ ] Помилка: `'post' is possibly 'undefined'.`
> - [ ] Нічого: код виведе назву поста
> - [ ] Нічого: TypeScript перевіряє лише `.tsx`-файли
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Без `await` у `post` лежить не пост, а **обіцянка** поста (`Promise`), і поля `title` в неї немає. Друга помилка зʼявиться, коли додаси `await`: пост може не знайтися.

## 🧒 Простими словами

Уяви переїзд. Ти пакуєш коробки й підписуєш кожну: «Посуд, крихке», «Книжки, важко». Вантажники не відкривають коробок, але за підписами знають, що не можна ставити книжки на посуд. **TypeScript** — це підписи на коробках твого коду. Він не виконує програму, а читає підписи й ще до запуску каже: «Ти кладеш книжку туди, де має бути чашка». Коли коробки доїхали (код запустився), підписи вже не потрібні — їх знімають. Так і з типами: у браузер і на сервер їде звичайний JavaScript.

## 🔬 Як це працює насправді

### 🧭 Навіщо TypeScript у Next.js

**TypeScript** (TS) — це JavaScript плюс **типи**: опис того, які значення може мати змінна, параметр чи prop. Типи перевіряє компілятор `tsc` і редактор, поки ти пишеш код. Під час збірки їх просто **знімають**, тож на виконання вони не впливають: `const n: number = 'a'` не зупинить програму, якщо помилку ігнорувати.

`create-next-app` створює проєкт на TypeScript: файли `.ts` (звичайний код) і `.tsx` (код з JSX), `tsconfig.json` з `"strict": true` і файл `next-env.d.ts`, який Next.js генерує сам (його не редагують).

Тип пишуть після двокрапки — це **анотація**:

```ts
let title: string = 'Привіт'
function add(a: number, b: number): number {
  return a + b
}
```

Але більшість типів TS **виводить сам** (inference): `let title = 'Привіт'` уже `string`, а результат `add` — `number`. Анотації потрібні там, де вивести нема з чого: параметри функцій, props компонентів, початкове `null` у state. Решту не пиши — менше шуму.

Де ти побачиш помилки? У редакторі — одразу, червоною хвилькою. І в `next build`: Next.js запускає перевірку типів і зупиняє збірку при помилці. А от `next dev` перевірки не робить: сторінка з `const count: number = 'пʼять'` відкриється в `next dev` і покаже «пʼять». Тому довіряй редактору і `next build`, а не тому, що сторінка відкрилась.

### 🧱 Типи обʼєктів: type чи interface

Форму обʼєкта описують двома способами:

```ts
// lib/models.ts
type User = {
  id: string
  name: string
  email?: string // необовʼязкове поле: string | undefined
}

interface Product {
  id: string
  title: string
  price: number
}

interface DigitalProduct extends Product {
  downloadUrl: string
}

type Admin = User & { role: 'admin' } // перетин: усі поля User + role

type Status = 'idle' | 'loading' | 'success' | 'error' // union з літералів
```

`?` після назви поля робить його **необовʼязковим**: значення може бути відсутнім (`undefined`).

Для опису обʼєктів `type` і `interface` майже рівноцінні. Відмінності, які трапляються на практиці:

| | `type` | `interface` |
|---|---|---|
| обʼєкт | так | так |
| union (`'a' \| 'b'`), примітиви, кортежі | так | ні |
| розширення | `&` (перетин) | `extends` |
| два оголошення з однією назвою | помилка `Duplicate identifier` | **зливаються** в одне |

Злиття інтерфейсів (declaration merging) — корисне для бібліотек і пастка для тебе: два `interface Theme` в одному файлі тихо стануть одним типом з полями обох. Для `type` TS одразу скаже `Duplicate identifier 'Point'`.

Практичне правило: обери одне для обʼєктів і будь послідовним, а для unions бери `type`. У цьому курсі props описуємо через `type`.

### 🧩 Типізуємо props і children

Props компонента — це один обʼєкт, тож і тип у нього один:

```tsx
// app/ui/card.tsx
type CardProps = {
  title: string
  size?: 'sm' | 'md' | 'lg' // необовʼязковий prop
  children: React.ReactNode // будь-що, що React уміє показати
}

export function Card({ title, size = 'md', children }: CardProps) {
  return (
    <section className={`card card-${size}`}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
```

Три речі в цьому прикладі:

- **`children: React.ReactNode`** — усе, що можна вкласти між тегами: текст, число, JSX, масив, `null`. Це стандартний тип для `children` у твоїх компонентах. Імпортувати `React` для типу не треба. (`layout.tsx` у `create-next-app` 16.3.8 замість цього пише помічник Next.js `LayoutProps<"/">` — він родич `PageProps`, про який нижче.)
- **Необовʼязковий prop зі значенням за замовчуванням**: `size?:` у типі і `size = 'md'` у деструктуризації. Усередині `size` вже не `undefined`.
- **Union з літералів** замість `string`: TS не дасть передати `size="xl"`.

Помилки, які ти побачиш (вивід `tsc` для `<Card size="xl">` і `<Card>` без `title`):

```text
error TS2322: Type '"xl"' is not assignable to type '"sm" | "md" | "lg" | undefined'.
error TS2741: Property 'title' is missing in type '{ children: string; size: "sm"; }' but required in type 'CardProps'.
```

Коли компонент — обгортка над HTML-елементом, не перелічуй вручну всі атрибути кнопки. Візьми їх з React і додай свої:

```tsx
// app/ui/button.tsx
type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return <button className={`btn-${variant}`} {...rest} />
}
```

Тепер `<Button type="submit" disabled>` працює, а `onClick` має правильний тип.

**State й події.** `useState('')` виводить `string` сам. Але з `useState(null)` TS виведе тип `null` назавжди, і спроба покласти туди користувача дасть заплутане `Object literal may only specify known properties, and 'id' does not exist in type '(prevState: null) => null'`. Тож тип вказують явно:

```tsx
// app/search/search-box.tsx (фрагмент)
const [query, setQuery] = useState('') // тип string виведено з ''
const [selected, setSelected] = useState<User | null>(null) // з null не вивести — пишемо явно

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setQuery(e.target.value)
}
```

Якщо обробник написаний прямо в JSX (`onChange={(e) => …}`), тип `e` виводиться сам. Тип події пишуть лише для окремої функції.

> [!quiz] Перевір себе: який тип для children?
> level: junior · id: nextjs-start-04-quiz-02
>
> Компонент `Card` має приймати будь-який вміст: текст, JSX, кілька елементів, а іноді нічого. Який тип дати `children`?
>
> - [x] `React.ReactNode`
> - [ ] `JSX.Element`
> - [ ] `string`
> - [ ] `object`
>
> **Пояснення:** `React.ReactNode` охоплює рядки, числа, JSX, масиви, `null` і `undefined` — усе, що React уміє відрендерити. `JSX.Element` — лише один JSX-елемент: текст чи два елементи поруч не пройдуть. `string` відкине JSX, а `object` пропустить будь-що, навіть те, що React показати не може.

### 🔀 Union і звуження

**Union** (обʼєднання) — тип «одне з»: `string | number`, `'sm' | 'md' | 'lg'`, `User | null`. Поки TS не знає, який саме варіант, він дозволяє лише те, що є в **усіх** варіантах. Перевірка в коді **звужує** тип (narrowing): у гілці `if` TS знає більше.

```ts
// lib/narrowing.ts (фрагмент)
export function formatPrice(price: number | string): string {
  if (typeof price === 'number') {
    return price.toFixed(2) // тут price: number
  }
  return price.trim() // а тут price: string
}
```

Звужують так: `typeof x === 'string'`, `x === null`, `if (x)` (відкидає `null`, `undefined`, `''`, `0`), `'field' in obj`, `x instanceof Error`, `Array.isArray(x)`.

Найкорисніший для UI варіант — **розрізнюваний union** (discriminated union): кожен варіант має спільне поле-мітку з літеральним значенням, а решта полів залежить від мітки. Стан завантаження — класичний приклад:

```ts
// lib/narrowing.ts (фрагмент)
export type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: string[] }

export function describe(state: LoadState): string {
  switch (state.status) {
    case 'loading':
      return 'Завантаження…'
    case 'error':
      return `Помилка: ${state.message}` // тут є message
    case 'success':
      return `${state.data.length} записів` // а тут є data
    default: {
      const unreachable: never = state // новий варіант без case → помилка тут
      return unreachable
    }
  }
}
```

Без перевірки `status` поле `data` недоступне:

```text
error TS2339: Property 'data' does not exist on type 'LoadState'.
  Property 'data' does not exist on type '{ status: "loading"; }'.
```

Другий рядок з відступом — уточнення: TS показує, у якому саме варіанті поля немає. Це краще за три окремі `useState` (`isLoading`, `error`, `data`): з union неможливо одночасно мати і `error`, і `data`.

Гілка `default` з `never` — **перевірка повноти** (exhaustive check). `never` — тип, у якого немає значень. Якщо всі варіанти оброблено, у `default` нічого не лишається, і присвоєння проходить. Додав `{ status: 'empty' }` і забув `case` — TS зупинить: `Type '{ status: "empty"; }' is not assignable to type 'never'.`

Ще один тип звідси — **`unknown`**: «щось, про що нічого не відомо». У `catch (e)` помилка має тип `unknown` (з `strict`), і `e.message` дає `'e' is of type 'unknown'.` Спершу звузь: `if (e instanceof Error) return e.message`. Протилежність — `any`: він вимикає перевірку зовсім, і ним краще не користуватися.

> [!diagram] Як switch звужує LoadState
> ```yaml
> layout: flow
> nodes:
>   - { id: input, label: "параметр", code: "state: LoadState", note: "3 варіанти", tone: gray }
>   - { id: check, label: "перевірка", code: "case 'error':", tone: blue }
>   - { id: narrow, label: "у гілці", code: "{ status: 'error'; message: string }", note: "доступне message", tone: green }
>   - { id: rest, label: "далі", text: "loading | success", note: "error уже відкинуто", tone: yellow }
>   - { id: never, label: "default", code: "never", note: "нічого не лишилось", tone: violet }
> edges:
>   - { from: input, to: check, label: "switch (state.status)" }
>   - { from: check, to: narrow, label: "так" }
>   - { from: narrow, to: rest, label: "інші case" }
>   - { from: rest, to: never, label: "усе оброблено" }
> steps:
>   - { focus: input, note: "На вході TS знає лише, що state — один із трьох варіантів. Спільне в них — тільки поле status." }
>   - { move: { from: input, to: check, value: "status" }, note: "switch читає мітку status. Вона літеральна: 'loading', 'error' або 'success'." }
>   - { move: { from: check, to: narrow, value: "'error'" }, note: "У case 'error' лишається один варіант — і TS дозволяє state.message." }
>   - { move: { from: narrow, to: rest, value: "loading | success" }, note: "Кожен наступний case відкидає ще один варіант." }
>   - { move: { from: rest, to: never, value: "never" }, note: "Коли всі варіанти оброблено, у default тип never. Новий варіант без case — і тут зʼявиться помилка." }
> ```
> Перевірка в коді — це підказка компілятору, який варіант зараз у руках.

> [!quiz] Перевір себе: заповни звуження
> level: junior · type: fill · bank: any, string · id: nextjs-start-04-quiz-03
>
> ```ts fill
> type LoadState =
>   | { status: 'loading' }
>   | { status: 'error'; message: string }
>
> function errorText(state: LoadState): string {
>   if (state.[[status]] === [['error'|"error"]]) {
>     return state.message
>   }
>   return ''
> }
>
> function toMessage(e: [[unknown]]): string {
>   if (e [[instanceof]] Error) return e.message
>   return String(e)
> }
> ```
>
> **Пояснення:** порівняння мітки `status` з літералом `'error'` залишає в гілці варіант з `message`. Для значення з `catch` правильний тип — `unknown`: TS змусить перевірити його через `instanceof Error`, перш ніж читати `message`. `any` пропустив би `e.message` без перевірки — і впав би на `throw 'рядок'`.

> [!quiz] Перевір себе: що звузить `string | null`?
> level: junior · type: multi · id: nextjs-start-04-quiz-04
>
> Після якої перевірки всередині `if` змінна `name: string | null` має тип `string`?
>
> - [x] `if (name !== null)`
> - [x] `if (typeof name === 'string')`
> - [x] `if (name)`
> - [ ] `if (name.length > 0)`
> - [ ] `if (name !== undefined)`
>
> **Пояснення:** перші три відкидають `null`. `if (name)` відкидає ще й порожній рядок — інколи це саме те, що треба, інколи ні. `name.length` не можна навіть прочитати, поки не відкинуто `null`: TS скаже `'name' is possibly 'null'`. `!== undefined` нічого не звужує: `undefined` у цьому типі і так немає.

### 🧰 Generics з першого погляду

**Generic** (узагальнений тип) — тип з параметром, як функція, що приймає тип. Ти вже бачив їх: `Promise<Post>` — «обіцянка поста», `Array<string>` (те саме, що `string[]`), `Record<string, number>` — обʼєкт із рядковими ключами й числовими значеннями, `useState<User | null>(null)`.

Написати свій просто: параметр типу в кутових дужках, найчастіше `T`:

```ts
// lib/generics.ts
export function first<T>(items: T[]): T | undefined {
  return items[0]
}

const n = first([1, 2, 3]) // n: number | undefined
const s = first(['a', 'b']) // s: string | undefined
```

`T` — заповнювач: TS сам підставляє тип з аргументу. Без generic довелося б писати `first` для чисел, для рядків, для користувачів — або повертати `any` і втратити перевірку.

Компоненти теж бувають generic. Список, який не знає, що в ньому лежить:

```tsx
// app/ui/list.tsx
type ListProps<T> = {
  items: T[]
  getKey: (item: T) => string
  renderItem: (item: T) => React.ReactNode
}

export function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

У `<List items={users} getKey={(u) => u.id} renderItem={(u) => <b>{u.name}</b>} />` TS виводить `T` з `users`, і `u` всередині колбеків уже має тип користувача. Для старту досить уміти **читати** generics; писати складні — справа бібліотек.

> [!quiz] Перевір себе: який тип у змінної?
> level: junior · type: output · id: nextjs-start-04-quiz-05
>
> ```ts
> function first<T>(items: T[]): T | undefined {
>   return items[0]
> }
>
> const s = first(['a', 'b'])
> ```
>
> - [x] `string | undefined`
> - [ ] `string`
> - [ ] `T`
> - [ ] `any`
>
> **Пояснення:** TS підставляє `T = string` з аргументу, а тип результату — `T | undefined`, бо масив може бути порожнім. Тому `const x: number = first(['a'])` дасть `Type 'string | undefined' is not assignable to type 'number'.`

### ✅ satisfies і as const

Є два способи перевірити обʼєкт типом, і вони поводяться по-різному.

**Анотація** (`const x: Тип = …`) каже: «змінна має саме цей тип». Усе, що TS знав про конкретне значення, губиться. **`satisfies`** каже: «перевір, що значення підходить під тип, але запамʼятай його точну форму».

```ts
// lib/nav.ts
type NavItem = { href: string; label: string }

export const nav = {
  home: { href: '/', label: 'Головна' },
  blog: { href: '/blog', label: 'Блог' },
} satisfies Record<string, NavItem>

nav.blog.href // ✅ TS знає, що ключ blog існує
```

Що буде з помилками (вивід `tsc`):

- з анотацією `const nav: Record<string, NavItem>` вираз `nav.shop.href` **проходить**: тип каже «будь-який рядковий ключ», а в рантаймі — `TypeError`;
- із `satisfies` — `Property 'shop' does not exist on type '{ home: { href: string; label: string; }; }'.`;
- одрук `{ hraf: '/' }` ловлять обидва: `Object literal may only specify known properties, and 'hraf' does not exist in type 'NavItem'.`

**`as const`** робить значення «замороженим» для типів: рядки стають літералами, масиви — незмінними кортежами. Звідти зручно отримати union:

```ts
// lib/nav.ts (фрагмент)
export const sizes = ['sm', 'md', 'lg'] as const
export type Size = (typeof sizes)[number] // 'sm' | 'md' | 'lg'
```

Без `as const` масив мав би тип `string[]`, `Size` був би просто `string`, і `const s: Size = 'xl'` пройшов би. З `as const` — `Type '"xl"' is not assignable to type '"sm" | "md" | "lg"'.` Одне джерело — і масив для рендеру кнопок, і тип для props.

У Next.js `satisfies` трапляється в конфігах і метаданих. Документація пише `const nextConfig: NextConfig = { … }` — для конфігу, який ніхто не читає за ключами, анотація підходить. `satisfies` вибирай, коли далі в коді потрібні конкретні ключі.

> [!quiz] Перевір себе: анотація чи satisfies?
> level: junior · id: nextjs-start-04-quiz-06
>
> Обʼєкт `routes` з ключами `home`, `blog` перевіряють типом `Record<string, string>`. Ти хочеш, щоб `routes.shop` був помилкою TypeScript. Що обрати?
>
> - [x] `const routes = { … } satisfies Record<string, string>`
> - [ ] `const routes: Record<string, string> = { … }`
> - [ ] `const routes = { … } as Record<string, string>`
> - [ ] `const routes = { … } as any`
>
> **Пояснення:** `satisfies` перевіряє значення, але залишає точний тип з ключами `home` і `blog`, тож `shop` — помилка. Анотація і `as` розширюють тип до «будь-який рядковий ключ», і `routes.shop` проходить. `as` до того ж — твердження «повір мені», а не перевірка: зайві поля він пропускає, а помилку дає лише за грубої розбіжності типів. `any` вимикає все.

### ⏳ Async-функції й Promise

**Promise** — обʼєкт-«квитанція» на значення, яке буде пізніше (відповідь бази, мережі). `async`-функція **завжди** повертає `Promise`, тож її тип результату — `Promise<Щось>`:

```ts
// lib/posts.ts
export type Post = { slug: string; title: string }

const posts: Post[] = [{ slug: 'hello', title: 'Привіт, Next.js' }]

export async function getPost(slug: string): Promise<Post | undefined> {
  return posts.find((p) => p.slug === slug)
}
```

Тип результату можна не писати — TS виведе його з `return`. Але для функцій, які імпортують з інших файлів (шар даних), явний тип — це контракт: зміниш реалізацію, і TS перевірить, що обіцянка не порушена.

Дві помилки з 🤔 Передбач — і як їх читати:

```text
error TS2339: Property 'title' does not exist on type 'Promise<Post | undefined>'.
error TS18048: 'post' is possibly 'undefined'.
```

Перша — забутий `await`: у руках квитанція, а не пост. Друга — `await` є, але `find` міг нічого не знайти. В Next.js друге звужують так:

```tsx
const post = await getPost(slug)
if (!post) notFound() // після цього TS знає: post не undefined
return <h1>{post.title}</h1>
```

`notFound()` з `next/navigation` має тип результату `never` — вона ніколи не повертається, а перериває рендер і показує сторінку 404. Тому після неї TS вважає, що `post` точно є.

### 🧯 Як читати помилки TS у Next.js

Рядок помилки `tsc` завжди має однакову форму:

```text
app/old/[slug]/page.tsx(7,28): error TS2339: Property 'slug' does not exist on type 'Promise<{ slug: string; }>'.
```

Файл, у дужках рядок і стовпчик, код помилки, повідомлення. Якщо під ним є рядки з відступом — це уточнення, читай їх теж: найконкретніша причина зазвичай в останньому. Кілька кодів трапляються найчастіше:

| Код | Що означає | Типова причина |
|---|---|---|
| TS2322 | `Type 'A' is not assignable to type 'B'` | не той тип prop, змінної, результату |
| TS2339 | `Property 'x' does not exist on type 'T'` | одрук, union без звуження, забутий `await` |
| TS2741 | `Property 'x' is missing in type …` | не передали обовʼязковий prop |
| TS2353 | `Object literal may only specify known properties` | зайве або з одруком поле в обʼєкті |
| TS18048 | `'x' is possibly 'undefined'` | значення може бути відсутнім — звузь |
| TS18046 | `'e' is of type 'unknown'` | `catch` чи дані без типу — звузь |

У `next build` перевірка типів іде **після** компіляції. Справжній вивід на 16.3.8:

```text
  Creating an optimized production build ...
✓ Compiled successfully in 117ms
  Running TypeScript ...
app/old/[slug]/page.tsx(7,28): error TS2339: Property 'slug' does not exist on type 'Promise<{ slug: string; }>'.
Failed to type check.
```

«Compiled successfully» не означає «без помилок»: компіляція лише знімає типи. Збірку зупиняє наступний крок. За документацією 16.3 Next.js запускає локальний `tsc` проєкту і друкує його рідні повідомлення без власних підказок — тож таблиця вище працює і тут.

> [!quiz] Перевір себе: склади вивід next build з помилкою типів
> level: junior · type: order · id: nextjs-start-04-quiz-07
>
> ```order
> Creating an optimized production build ...
> ✓ Compiled successfully
> Running TypeScript ...
> app/old/[slug]/page.tsx(7,28): error TS2339: Property 'slug' does not exist on type 'Promise<{ slug: string; }>'.
> Failed to type check.
> ✓ Generating static pages ✗
> ```
>
> **Пояснення:** спершу код компілюється — типи просто знімаються, тому «Compiled successfully» зʼявляється навіть з помилкою типів. Потім окремий крок «Running TypeScript» друкує помилки `tsc` і зупиняє збірку. До генерації сторінок справа не доходить.

### 🔮 Попередній огляд: params сторінки

Детально динамічні маршрути — у темах [[Next.js Start - 08. Навігація]] і [[Next.js - 03. Динамічні маршрути]]. Тут лише типи, бо це перше місце, де TS у Next.js тебе здивує.

Сторінка `app/blog/[slug]/page.tsx` обслуговує `/blog/hello`, `/blog/news` тощо, а значення `[slug]` приходить у prop `params`. У Next.js 16 `params` — це **Promise**, тож його треба `await`. Next.js генерує глобальний помічник **`PageProps`** (під час `next dev`, `next build` або `next typegen`), який знає параметри кожного маршруту:

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/posts'

export async function generateStaticParams() {
  return [{ slug: 'hello' }]
}

export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params // params — Promise, тож await
  const post = await getPost(slug)
  if (!post) notFound() // після цього TS знає: post не undefined
  return <h1>{post.title}</h1>
}
```

`PageProps` не треба імпортувати. Рядок `'/blog/[slug]'` — шлях маршруту, і з нього TS знає, що в `params` є `slug: string`. Забудеш `await` — отримаєш помилку з попереднього розділу: `Property 'slug' does not exist on type 'Promise<{ slug: string; }>'`. `generateStaticParams` тут каже, які сторінки зібрати наперед, — про це в темі 03 основного курсу.

> [!warning] Стара типізація params не дає помилки
> У старих туторіалах (Next.js 14 і раніше) пишуть `{ params }: { params: { slug: string } }` і читають `params.slug` без `await`. На 16.3.8 `next build` проходить **без помилок типів** (згенерована перевірка сторінок у `.next/types/validator.ts` приймає props як `any`), а сторінка рендерить порожній `<h1></h1>`, бо `params.slug` у Promise — `undefined`. Документація описує `params` як Promise, але не попереджає, що неправильний тип пройде. Користуйся `PageProps<'…'>`: з ним TS ловить помилку. Див. [Next.js: page.js — params](https://nextjs.org/docs/app/api-reference/file-conventions/page#params-optional).

> [!quiz] Що покаже стара сторінка?
> level: junior · type: output · id: nextjs-start-04-quiz-08
>
> Next.js 16.3.8. Сторінку типізували за старим туторіалом. Що станеться на `next build` і що побачить користувач на `/old/hello`?
>
> ```tsx
> // app/old/[slug]/page.tsx
> export async function generateStaticParams() {
>   return [{ slug: 'hello' }]
> }
>
> export default function Page({ params }: { params: { slug: string } }) {
>   return <h1>{params.slug}</h1>
> }
> ```
>
> - [x] Збірка проходить; на сторінці порожній `<h1></h1>`
> - [ ] `next build` падає з помилкою типів про `params`
> - [ ] Збірка проходить; на сторінці «hello»
> - [ ] Збірка проходить; на сторінці `[object Promise]`
>
> **Пояснення:** у 16 `params` — Promise, а в Promise немає поля `slug`, тож `params.slug` — `undefined`, і React рендерить порожній заголовок. TypeScript не допоміг, бо тип написано вручну неправильно, а перевірка сторінок Next.js тут його не ловить. З `PageProps<'/old/[slug]'>` була б помилка TS2339.

### 🏭 Як це роблять у продакшні

- **`strict: true` не вимикають.** Так налаштовує `create-next-app`, і саме він дає `possibly 'undefined'` та `unknown` у `catch`.
- **`any` — під забороною, `as` — рідко.** Для невідомих даних — `unknown` і звуження. Дані з мережі чи форми перевіряють у рантаймі (схемою-валідатором), бо типи в рантаймі не існують.
- **Типи біля даних.** Моделі й функції доступу до даних живуть у `lib/` з явними `Promise<…>`; компоненти імпортують типи через `import type`.
- **Стан — розрізнюваним union**, а не набором булевих прапорців.
- **Помічники Next.js**: `PageProps`, `LayoutProps`, `NextConfig`, `Metadata` замість саморобних типів (`create-next-app` уже пише `LayoutProps<"/">` у кореневому layout).
- **CI запускає `next build`** (або `tsc --noEmit`): помилки типів не потрапляють у `main`.

## ⚠️ Пастки

> [!pitfall] any вимикає перевірку
> `any` можна присвоїти куди завгодно і читати з нього що завгодно. Помилка переїжджає з редактора в рантайм.
>
> ```ts
> const data: any = await res.json()
> data.user.nmae // ❌ TS мовчить
> ```

> [!pitfall] as — не перевірка, а обіцянка
> `as User` каже компілятору «повір мені». Якщо значення інше, TS не попередить.
>
> ```ts
> const user = JSON.parse(text) as User // ❌ форму ніхто не перевірив
> ```

> [!pitfall] Забутий await
> Без `await` у змінній Promise, а не дані. TS ловить це, лише якщо тип відомий.
>
> ```ts
> const post = getPost(slug)
> post.title // TS2339: … on type 'Promise<Post | undefined>'
> ```

> [!pitfall] useState(null) без типу
> TS виведе тип `null` назавжди, і покласти обʼєкт не вийде. Пиши `useState<User | null>(null)`.

> [!pitfall] Стара типізація params
> `{ params: { slug: string } }` проходить `next build` на 16.3.8, а сторінка рендерить `undefined`. Бери `PageProps<'/blog/[slug]'>` і `await props.params`.

## 🔗 Звʼязки

- [[Next.js Start - 03. React-мінімум, state, події й ефекти]] — state, обробники й reducer, які тут типізуємо.
- [[Next.js Start - 07. Сторінки й layouts]] — `page.tsx`, `layout.tsx` і їхні props.
- [[Next.js Start - 08. Навігація]] — динамічні сторінки `/blog/[slug]` і `params`.
- [[Next.js - 03. Динамічні маршрути]] — `params`, `generateStaticParams`, `PageProps` детально.
- [[Next.js - 07. Server і Client Components]] — що можна передати з Server Component у Client Component (не лише типи, а й серіалізація).
- [[JavaScript - 09. Promise]] і [[JavaScript - 10. async і await]] — що таке Promise і як працює `await`.

## ⚡ Фішки

> [!reel] 🏷️ Типи зникають до запуску
> TypeScript перевіряє код і знімає типи під час збірки. У браузер і на сервер їде звичайний JavaScript, тож у рантаймі `User` не існує.

> [!reel] 🧪 next dev не перевіряє типи
> Сторінка з `const count: number = 'пʼять'` відкриється в `next dev`. Зупинить її лише редактор або `next build`.

> [!reel] 🎯 satisfies перевіряє, але не стирає ключі
> Анотація `Record<string, NavItem>` дозволяє `nav.shop`. `satisfies` — ні: TS памʼятає, що ключі лише `home` і `blog`.

> [!reel] 🧊 as const перетворює масив на union
> Один масив — і для кнопок, і для типу props.
>
> ```ts
> const sizes = ['sm', 'md', 'lg'] as const
> type Size = (typeof sizes)[number] // 'sm' | 'md' | 'lg'
> ```

> [!reel] 🚫 never ловить забутий case
> `const x: never = state` у `default` — і новий варіант union без обробки стає помилкою компіляції, а не багом у продакшні.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що робить TypeScript і що з типами відбувається під час збірки?
> *часто · теорія* · `nextjs-start-04-card-01`
>
> Перевіряє, що значення відповідають описаним типам, — у редакторі й під час `next build`. Під час збірки типи знімаються, тож у рантаймі їх немає і на поведінку вони не впливають. `next dev` типи не перевіряє.
>
> 📚 [[Next.js Start - 04. TypeScript-мінімум для Next.js#🧭 Навіщо TypeScript у Next.js|Розділ: навіщо TypeScript]] · [TypeScript: The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)

> [!question]- Чим відрізняються type та interface?
> *дуже часто · порівняння* · `nextjs-start-04-card-02`
>
> Для обʼєктів майже нічим. `type` вміє unions, примітиви й кортежі, розширюється через `&`. `interface` розширюється через `extends` і зливається з однойменним оголошенням (declaration merging), а повторний `type` — помилка `Duplicate identifier`.
>
> 📚 [[Next.js Start - 04. TypeScript-мінімум для Next.js#🧱 Типи обʼєктів: type чи interface|Розділ: type чи interface]] · [TypeScript: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

> [!question]- Як типізувати props і children компонента?
> *дуже часто · код* · `nextjs-start-04-card-03`
>
> Один тип на весь обʼєкт props: `function Card({ title, children }: CardProps)`. Для `children` — `React.ReactNode`. Необовʼязковий prop — `size?:` у типі й значення за замовчуванням у деструктуризації.
>
> 📚 [[Next.js Start - 04. TypeScript-мінімум для Next.js#🧩 Типізуємо props і children|Розділ: props і children]] · [React: Using TypeScript](https://react.dev/learn/typescript)

> [!question]- Коли тип useState треба писати явно?
> *часто · код* · `nextjs-start-04-card-04`
>
> Коли з початкового значення тип не вивести: `useState<User | null>(null)`, `useState<string[]>([])`. Для `useState('')` чи `useState(0)` TS виводить тип сам.
>
> 📚 [[Next.js Start - 04. TypeScript-мінімум для Next.js#🧩 Типізуємо props і children|Розділ: state й події]] · [React: Using TypeScript — useState](https://react.dev/learn/typescript#typing-usestate)

> [!question]- Що таке звуження типу?
> *дуже часто · теорія* · `nextjs-start-04-card-05`
>
> Перевірка в коді (`typeof`, `=== null`, `in`, `instanceof`, порівняння мітки), після якої TS у цій гілці знає точніший тип union. Без звуження доступне лише спільне для всіх варіантів.
>
> 📚 [[Next.js Start - 04. TypeScript-мінімум для Next.js#🔀 Union і звуження|Розділ: union і звуження]] · [TypeScript: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

> [!question]- Чим unknown відрізняється від any?
> *часто · порівняння* · `nextjs-start-04-card-06`
>
> Обидва приймають будь-яке значення. `any` вимикає перевірку: з ним можна робити що завгодно. `unknown` нічого не дозволяє, поки не звузиш тип (`instanceof Error`, `typeof`). Для `catch` і невідомих даних — `unknown`.
>
> 📚 [[Next.js Start - 04. TypeScript-мінімум для Next.js#🔀 Union і звуження|Розділ: unknown]] · [TypeScript: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

> [!question]- Що повертає async-функція і як це типізувати?
> *часто · код* · `nextjs-start-04-card-07`
>
> Завжди `Promise<T>`, де `T` — те, що в `return`: `async function getPost(): Promise<Post | undefined>`. Значення отримують через `await`; без нього в змінній Promise, і TS скаже `Property 'title' does not exist on type 'Promise<…>'`.
>
> 📚 [[Next.js Start - 04. TypeScript-мінімум для Next.js#⏳ Async-функції й Promise|Розділ: async і Promise]] · [TypeScript: More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### 🟡 Middle

> [!question]- Що таке розрізнюваний union і навіщо never у default?
> *часто · код* · `nextjs-start-04-card-08`
>
> Union обʼєктів зі спільним полем-міткою (`status: 'loading' | 'error' | 'success'`), від якого залежать решта полів. `switch` по мітці звужує тип. `const x: never = state` у `default` перетворює забутий `case` на помилку компіляції.
>
> 📚 [[Next.js Start - 04. TypeScript-мінімум для Next.js#🔀 Union і звуження|Розділ: розрізнюваний union]] · [TypeScript: Discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)

> [!question]- Чим satisfies відрізняється від анотації типу?
> *часто · порівняння* · `nextjs-start-04-card-09`
>
> Анотація задає змінній тип і забуває деталі значення: з `Record<string, X>` будь-який ключ «існує». `satisfies` перевіряє значення типом, але лишає точний тип: відомі ключі, літерали. Обидва ловлять одруки в полях; `as` пропускає зайві поля і свариться лише на грубу розбіжність.
>
> 📚 [[Next.js Start - 04. TypeScript-мінімум для Next.js#✅ satisfies і as const|Розділ: satisfies]] · [TypeScript 4.9: satisfies](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html)

> [!question]- Як Next.js 16 типізує params сторінки?
> *часто · практика* · `nextjs-start-04-card-10`
>
> `params` — Promise, тож `const { slug } = await props.params`. Тип дає глобальний `PageProps<'/blog/[slug]'>`, який Next.js генерує під час `next dev`, `next build` або `next typegen`. Саморобний `{ params: { slug: string } }` на 16.3.8 проходить збірку, але `slug` — `undefined`.
>
> 📚 [[Next.js Start - 04. TypeScript-мінімум для Next.js#🔮 Попередній огляд: params сторінки|Розділ: params]] · [Next.js: page.js — Page Props Helper](https://nextjs.org/docs/app/api-reference/file-conventions/page#page-props-helper)

## 🛠️ Практика

> [!task] Опиши стан завантаження текстом
> level: junior · difficulty: easy · id: nextjs-start-04-task-01 · tags: typescript, union, narrowing
>
> Напиши `describeState(state)` для розрізнюваного union `LoadState`:
>
> - `idle` → `'Натисни «Завантажити»'`;
> - `loading` → `'Завантаження…'`;
> - `success` з порожнім `data` → `'Нічого не знайдено'`, інакше `'Знайдено: N'`;
> - `error` → `'Помилка: <message>'`, а якщо `retryable` — `'Помилка: <message>. Спробуй ще раз'`.
>
> Додай перевірку повноти з `never`. Задача на TypeScript: типи знімаються перед запуском і не перевіряються, тести дивляться на значення.
>
> ```ts starter
> type LoadState =
>   | { status: 'idle' }
>   | { status: 'loading'; startedAt: number }
>   | { status: 'success'; data: string[] }
>   | { status: 'error'; message: string; retryable: boolean }
>
> function describeState(state: LoadState): string {
>   // твій код
>   return ''
> }
> ```
>
> ```ts tests
> test('idle і loading', () => {
>   expect(describeState({ status: 'idle' })).toBe('Натисни «Завантажити»')
>   expect(describeState({ status: 'loading', startedAt: 0 })).toBe('Завантаження…')
> })
>
> test('success рахує записи', () => {
>   expect(describeState({ status: 'success', data: ['a', 'b', 'c'] })).toBe('Знайдено: 3')
> })
>
> test('success з порожнім списком', () => {
>   expect(describeState({ status: 'success', data: [] })).toBe('Нічого не знайдено')
> })
>
> test('error без повтору', () => {
>   expect(describeState({ status: 'error', message: 'Немає доступу', retryable: false })).toBe('Помилка: Немає доступу')
> })
>
> test('error з повтором', () => {
>   expect(describeState({ status: 'error', message: 'Таймаут', retryable: true })).toBe('Помилка: Таймаут. Спробуй ще раз')
> })
> ```
>
> > [!hint]- Підказка 1
> > `switch (state.status)` — і в кожному `case` TS знає, які поля є: `data` лише в `success`, `message` лише в `error`.
>
> > [!hint]- Підказка 2
> > У `default`: `const unreachable: never = state; return unreachable`. Якщо всі варіанти оброблено, рядок компілюється.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function describeState(state: LoadState): string {
> >   switch (state.status) {
> >     case 'idle':
> >       return 'Натисни «Завантажити»'
> >     case 'loading':
> >       return 'Завантаження…'
> >     case 'success':
> >       return state.data.length === 0 ? 'Нічого не знайдено' : `Знайдено: ${state.data.length}`
> >     case 'error':
> >       return state.retryable ? `Помилка: ${state.message}. Спробуй ще раз` : `Помилка: ${state.message}`
> >     default: {
> >       const unreachable: never = state
> >       return unreachable
> >     }
> >   }
> > }
> > ```
> >
> > Додай у `LoadState` варіант `{ status: 'empty' }` — і редактор підсвітить рядок з `never`. Так union захищає UI від забутого стану.

> [!task] Прочитай номер сторінки з searchParams
> level: junior · difficulty: easy · id: nextjs-start-04-task-02 · tags: typescript, narrowing, searchParams
>
> У Next.js значення з рядка запиту (`?page=2`) має тип `string | string[] | undefined`: параметра може не бути, а `?page=1&page=2` дає масив. Напиши `getPage(value, maxPage)`:
>
> - масив — бери перший елемент;
> - немає значення або це не ціле додатне число з цифр (`'abc'`, `'2.5'`, `'-1'`, `''`) — `1`;
> - `0` — `1`;
> - більше за `maxPage` — `maxPage`.
>
> ```ts starter
> type SearchParamValue = string | string[] | undefined
>
> function getPage(value: SearchParamValue, maxPage: number): number {
>   // твій код
>   return Number(value)
> }
> ```
>
> ```ts tests
> test('звичайне число', () => {
>   expect(getPage('3', 10)).toBe(3)
> })
>
> test('немає параметра — перша сторінка', () => {
>   expect(getPage(undefined, 10)).toBe(1)
> })
>
> test('масив — береться перше значення', () => {
>   expect(getPage(['4', '7'], 10)).toBe(4)
> })
>
> test('сміття, дроби, мінус, нуль і порожній рядок — 1', () => {
>   for (const bad of ['abc', '2.5', '-1', '0', '', '3px']) {
>     expect(getPage(bad, 10)).toBe(1)
>   }
> })
>
> test('не більше за maxPage', () => {
>   expect(getPage('999', 12)).toBe(12)
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу звузь масив: `const raw = Array.isArray(value) ? value[0] : value`. Тепер `raw` — `string | undefined`.
>
> > [!hint]- Підказка 2
> > `Number('')` — це `0`, а `parseInt('3px')` — `3`. Надійніше перевірити рядок регулярним виразом `/^\d+$/` і лише потім перетворити.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function getPage(value: SearchParamValue, maxPage: number): number {
> >   const raw = Array.isArray(value) ? value[0] : value
> >   if (raw === undefined || !/^\d+$/.test(raw)) return 1
> >   const page = Number(raw)
> >   if (page < 1) return 1
> >   return Math.min(page, maxPage)
> > }
> > ```
> >
> > Тип `string | string[] | undefined` змушує обробити всі три випадки — без звуження `raw.match` чи `Number(value)` з масивом не пройдуть перевірку. Типи кажуть, **що** може прийти, а перевіряти вміст рядка доводиться в рантаймі.

> [!task] Напиши generic groupBy
> level: junior · difficulty: medium · id: nextjs-start-04-task-03 · tags: typescript, generics
>
> Напиши `groupBy(items, getKey)`: групує елементи за ключем, який повертає `getKey`. Результат — обʼєкт «ключ → масив елементів» у порядку появи. Функція generic: працює з будь-якими елементами, а TS знає тип ключів.
>
> ```ts
> groupBy([{ title: 'Чай', cat: 'drinks' }, { title: 'Торт', cat: 'food' }], (p) => p.cat)
> // → { drinks: [{ title: 'Чай', … }], food: [{ title: 'Торт', … }] }
> ```
>
> Вимоги: порожній масив — `{}`; `getKey` викликається рівно один раз на елемент; вхідний масив не змінюється; у групах — ті самі обʼєкти, не копії.
>
> ```ts starter
> function groupBy<T, K extends string>(items: T[], getKey: (item: T) => K): Partial<Record<K, T[]>> {
>   // твій код
>   return {}
> }
> ```
>
> ```ts tests
> const products = [
>   { title: 'Чай', cat: 'drinks' },
>   { title: 'Торт', cat: 'food' },
>   { title: 'Кава', cat: 'drinks' },
> ]
>
> test('групує за ключем у порядку появи', () => {
>   expect(groupBy(products, (p) => p.cat)).toEqual({
>     drinks: [products[0], products[2]],
>     food: [products[1]],
>   })
> })
>
> test('порожній масив — порожній обʼєкт', () => {
>   expect(groupBy([], (x) => String(x))).toEqual({})
> })
>
> test('getKey викликається один раз на елемент', () => {
>   const getKey = vi.fn((p: { cat: string }) => p.cat)
>   groupBy(products, getKey)
>   expect(getKey).toHaveBeenCalledTimes(3)
> })
>
> test('у групах ті самі обʼєкти, вхід не змінено', () => {
>   const input = [...products]
>   const groups = groupBy(input, (p) => p.cat)
>   expect(groups.food?.[0]).toBe(products[1])
>   expect(input).toEqual(products)
> })
>
> test('ключ може бути обчисленим', () => {
>   const words = ['кіт', 'кава', 'дім']
>   expect(groupBy(words, (w) => w[0])).toEqual({ к: ['кіт', 'кава'], д: ['дім'] })
> })
> ```
>
> > [!hint]- Підказка 1
> > Створи `const groups: Partial<Record<K, T[]>> = {}` і пройди `items` циклом `for…of`.
>
> > [!hint]- Підказка 2
> > Порахуй `const key = getKey(item)` один раз і збережи в змінну. Якщо групи ще немає — створи `[item]`, інакше `push`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function groupBy<T, K extends string>(items: T[], getKey: (item: T) => K): Partial<Record<K, T[]>> {
> >   const groups: Partial<Record<K, T[]>> = {}
> >   for (const item of items) {
> >     const key = getKey(item)
> >     const group = groups[key]
> >     if (group) group.push(item)
> >     else groups[key] = [item]
> >   }
> >   return groups
> > }
> > ```
> >
> > `T` — тип елемента, `K` — тип ключа, обмежений рядками (`extends string`). Якщо `getKey` повертає `'drinks' | 'food'`, результат знає саме ці ключі. `Partial` чесно каже, що група може бути відсутньою, тож TS вимагатиме `groups.food?.[0]`. Тут `push` можна: масив груп створений у функції, а не прийшов зі state.

## 📚 Джерела та що почитати

- 🟢 [Next.js — TypeScript](https://nextjs.org/docs/app/api-reference/config/typescript) — налаштування, перевірка у `next build`, `PageProps`, `next-env.d.ts`.
- 🟢 [React — Using TypeScript](https://react.dev/learn/typescript) — props, `children`, хуки, події.
- 🟢 [TypeScript — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) — анотації, unions, `type` і `interface`.
- 🟢 [TypeScript — Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) — звуження, розрізнювані unions, `never`.
- 🟡 [TypeScript — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) — параметри типів і обмеження.
- 🟡 [TypeScript 4.9 — satisfies](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html) — навіщо оператор і чим він кращий за анотацію.
- 🟡 [Next.js — page.js](https://nextjs.org/docs/app/api-reference/file-conventions/page) — `params`, `searchParams` і `PageProps`.
- 🛠️ [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) — готові рецепти типів для React.

> [!important] Підсумок
> - TypeScript перевіряє типи в редакторі й під час `next build`; у рантаймі типів немає, а `next dev` їх не перевіряє.
> - Обʼєкти описують `type` або `interface`; для unions — лише `type`. Props — один тип, `children: React.ReactNode`, необовʼязкові — `?` і значення за замовчуванням.
> - Union звужують перевірками; стан UI — розрізнюваним union з `never` у `default`. Для невідомого — `unknown`, не `any`.
> - Generics — типи з параметром: `Promise<T>`, `useState<T>`, `first<T>`. `satisfies` перевіряє, не стираючи ключі; `as const` робить літерали.
> - Async-функція повертає `Promise<T>`; без `await` у руках квитанція, а не дані.
> - У Next.js 16 `params` — Promise: `PageProps<'/route/[param]'>` і `await props.params`.
