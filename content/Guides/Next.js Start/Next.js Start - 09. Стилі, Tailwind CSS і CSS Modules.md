---
title: Стилі, Tailwind CSS і CSS Modules
id: nextjs-start-09
slug: 09-styles
order: 9
level: noob
skill: ui
icon: px:wand
tags: [nextjs, css, tailwind, css-modules, styling, beginner]
prerequisites:
  - "[[Next.js Start - 07. Сторінки й layouts]]"
estimatedMinutes: 35
nextVersion: 16.3.8
---

# Стилі, Tailwind CSS і CSS Modules

> [!success] 🎯 Після цього розділу ти зможеш
> - підключити глобальний CSS у root layout і пояснити, чому він діє на кожній сторінці;
> - стилізувати компонент через CSS Module і пояснити, чому однакові назви класів у різних файлах не конфліктують;
> - налаштувати Tailwind CSS v4 у Next.js 16 (три файли) і додати власний колір через `@theme`;
> - зробити адаптивну розмітку «спершу мобільна» і темну тему через `dark:`;
> - збирати класи умовно без динамічних рядків, які Tailwind не побачить;
> - обрати між Tailwind, CSS Modules і глобальним CSS для конкретної задачі.

## 🤔 Передбач

> [!quiz] Якого кольору буде заголовок картки?
> level: junior · type: output · id: nextjs-start-09-quiz-01
>
> У двох різних файлах є клас з однаковою назвою `.title`:
>
> ```css
> /* app/blog/blog.module.css */
> .title { color: crimson; }
> ```
>
> ```css
> /* app/ui/post-card.module.css */
> .title { color: teal; }
> ```
>
> ```tsx
> // app/ui/post-card.tsx
> import styles from './post-card.module.css'
>
> export function PostCard({ title }: { title: string }) {
>   return <h2 className={styles.title}>{title}</h2>
> }
> ```
>
> Сторінка `app/blog/page.tsx` імпортує `blog.module.css` для свого `<h1>` і рендерить `<PostCard />`. Якого кольору буде `<h2>` у картці?
>
> - [x] Бірюзовий (teal): кожен файл отримує свої унікальні імена класів, і стилі не перетинаються
> - [ ] Малиновий (crimson): стилі сторінки перекривають стилі компонента
> - [ ] Залежить від порядку імпорту: виграє той `.title`, що підключився пізніше
> - [ ] Збірка впаде: два класи `.title` в одному застосунку — конфлікт
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Файл `*.module.css` — це CSS Module: під час збірки Next.js перейменовує кожен клас на унікальний (на 16.3.8 — щось на кшталт `post-card-module__o59jpq__title`). Тож два `.title` стають двома різними класами, і «перемагати» нікому не треба.

## 🧒 Простими словами

Уяви школу. **Глобальний CSS** — це шкільний дрескод: одне правило на всіх, від першого класу до випускного («усі в темних штанях»). Зручно для загальних речей, але якщо хтось допише в дрескод «червоні краватки», їх надягне вся школа. **CSS Module** — іменна бирка, пришита до твого піджака: напис «Оля, 5-Б» ніхто не сплутає з чужим, навіть якщо в паралелі ще три Олі. **Tailwind CSS** — шафа з готовими речами одного розміру: не шиєш піджак з нуля, а береш «синій», «з кишенею», «на виріст» і вдягаєш одразу. Next.js дозволяє користуватися всіма трьома, і в справжньому проєкті зазвичай так і буває.

## 🔬 Як це працює насправді

### 🎨 Три способи стилізації

У Next.js CSS підключають **імпортом з JavaScript-файлу**: `import './globals.css'`. Звичайний браузер так не вміє — це робить збирач (у Next.js 16 за замовчуванням Turbopack). Під час `next build` він збирає всі імпортовані CSS-файли, мінімізує їх і кладе в окремі `.css`-файли, які сторінка підключає тегом `<link>`. CSS працює навіть із вимкненим JavaScript у браузері.

Основних способів три:

| Спосіб | Файл | Діє на | Для чого |
|---|---|---|---|
| Глобальний CSS | `app/globals.css` | увесь застосунок | базові стилі `body`, змінні кольорів, підключення Tailwind |
| CSS Modules | `*.module.css` поруч із компонентом | лише компонент, що імпортував | власні стилі компонента, складні анімації, сторонній CSS-код |
| Tailwind CSS | класи прямо в `className` | елемент, на якому клас | більшість повсякденної верстки |

Є й інші варіанти — Sass, CSS-in-JS-бібліотеки (наприклад, styled-components), — але для старту вони не потрібні. Документація Next.js радить саме таку комбінацію: глобальний CSS для справді глобального, Tailwind для більшості стилів, CSS Modules там, де утиліт не вистачає.

Одна річ з React, яку варто памʼятати: атрибут класу в JSX пишуть як **`className`**, а не `class`. Причина історична: `class` — зарезервоване слово в JavaScript.

### 🌍 Глобальний CSS у root layout

**Глобальний CSS** — звичайний CSS-файл без `.module` у назві. Його класи й селектори діють на всю сторінку. Імпортують його в **root layout** — `app/layout.tsx`, який обгортає кожну сторінку (див. [[Next.js Start - 07. Сторінки й layouts]]):

```css
/* app/globals.css */
body {
  font-family: system-ui, sans-serif;
  margin: 0;
}
```

```tsx
// app/layout.tsx
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
```

Імпорт без імені (`import './globals.css'`) означає «підключи цей файл до сторінки». Оскільки root layout є на кожному маршруті, стилі діють усюди.

Технічно глобальний CSS можна імпортувати в будь-який layout, сторінку чи компонент усередині `app/`. Але документація попереджає: під час переходів між сторінками Next.js **не прибирає** вже підключені глобальні стилі. Тобто якщо `app/blog/page.tsx` підключив `blog-global.css` з правилом `h1 { color: red }`, після переходу з блогу на головну заголовки там теж можуть почервоніти. Тому правило просте: глобальні стилі — лише справді глобальні, і лише в root layout.

Стилі з npm-пакетів імпортують так само: `import 'some-library/dist/styles.css'` у layout або компоненті, де бібліотека використовується.

**Порядок має значення.** У продакшн-збірці CSS іде в тому порядку, в якому стоять імпорти в коді. Якщо два правила однакової «сили» задають різний колір одному елементу, виграє те, що підключилося пізніше. У `next dev` порядок може відрізнятися, тож фінальний вигляд перевіряй після `next build`.

> [!quiz] Перевір себе: що доречно класти в globals.css?
> level: junior · id: nextjs-start-09-quiz-02
>
> Обери все, що варто тримати в `app/globals.css`, імпортованому в root layout.
>
> - [x] `@import 'tailwindcss';`
> - [x] базові стилі `body` (шрифт, колір тексту, фон)
> - [x] CSS-змінні кольорів у `:root`
> - [ ] `.cart-button { … }` — стилі кнопки кошика, яка є лише на сторінці товару
> - [ ] `h1 { color: crimson; }` «лише для блогу»
>
> **Пояснення:** глобальний файл діє на кожну сторінку, тож туди йде лише справді спільне: підключення Tailwind, база для `body`, змінні. Стилі однієї кнопки — у CSS Module поруч із компонентом або утиліти Tailwind. А `h1 { … }` «лише для блогу» в глобальному файлі пофарбує заголовки всього сайту.

### 🧩 CSS Modules: класи, які не конфліктують

**CSS Module** — CSS-файл з розширенням `.module.css`. Його імпортують з іменем, і це імʼя — обʼєкт, де ключі — твої назви класів, а значення — справжні, унікальні:

```css
/* app/blog/blog.module.css */
.title {
  font-size: 2rem;
  color: crimson;
}

.card {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
```

```tsx
// app/blog/page.tsx
import styles from './blog.module.css'

export default function BlogPage() {
  return (
    <main>
      <h1 className={styles.title}>Блог</h1>
      <div className={styles.card}>Перший пост</div>
    </main>
  )
}
```

На 16.3.8 у HTML потрапляє `class="blog-module__3rPSzG__title"`: імʼя файлу, хеш і твоя назва. Хеш залежить від файлу, тому `.title` з `post-card.module.css` отримає інший хеш — звідси відповідь на 🤔 Передбач. Ти пишеш короткі, зрозумілі назви, а про унікальність дбає збирач. Це і є **scoping** — обмеження області дії стилів одним файлом.

Кілька речей, які варто знати одразу:

- **Неіснуючий клас — `undefined`, без помилки.** Помилився в назві (`styles.tilte`) — елемент просто лишиться без класу. TypeScript теж мовчить: тип модуля — «будь-який рядковий ключ».
- **Назви з дефісом** читають через дужки: `styles['post-title']`. Тому в модулях частіше пишуть `camelCase`: `.postTitle` → `styles.postTitle`.
- **Кілька класів** на одному елементі — це один рядок через пробіл: ``className={`${styles.card} ${styles.active}`}``. Зручніше це робити функцією `cx()` (нижче).
- **Селектор має містити клас.** Правило `h1 { … }` у модулі зупиняє збірку: модуль не знає, чий це `h1`.

```text
Selector "h1" is not pure. Pure selectors must contain at least one local class or id.
```

Так звучить помилка на 16.3.8. «Pure» тут — «чистий»: селектор має містити хоча б один локальний клас чи id. `.card h1` — можна, `h1` — ні.

**Композиція класів.** Модуль уміє «успадкувати» інший клас через `composes`:

```css
/* app/blog/blog.module.css */
.featured {
  composes: card;
  border-color: gold;
}

.card :global(a) {
  color: inherit;
}
```

`styles.featured` тепер містить **два** імені — `blog-module__…__featured blog-module__…__card`, — тож елемент отримує і рамку картки, і золотий колір. `:global(a)` — вихід із локальності: тег `a` всередині картки не перейменовується. Так стилізують розмітку, яку не контролюєш (наприклад, HTML зі статті).

> [!quiz] Перевір себе: що буде в атрибуті class?
> level: junior · type: output · id: nextjs-start-09-quiz-03
>
> ```css
> /* app/ui/note.module.css */
> .note { padding: 8px; }
> ```
>
> ```tsx
> // app/ui/note.tsx
> import styles from './note.module.css'
>
> export function Note() {
>   return <p className={styles.notе}>Привіт</p>
> }
> ```
>
> Уважно подивись на `styles.notе`: остання літера — кирилична «е». Що отримає `<p>` після збірки?
>
> - [x] Жодного атрибута `class`: `styles.notе` — `undefined`, і React його не виводить
> - [ ] `class="note"` — Next.js знайде найближчу назву
> - [ ] Збірка впаде з помилкою «unknown class»
> - [ ] `class="undefined"` — рядок з назвою значення
>
> **Пояснення:** обʼєкт `styles` має лише ключ `note` (латиницею). Читання неіснуючого ключа дає `undefined`, а `className={undefined}` React просто пропускає. Помилки немає ні від збирача, ні від TypeScript, тому опечатки в назвах класів шукають очима або в DevTools.

### 🌬️ Tailwind CSS v4: стилі класами

**Tailwind CSS** — це CSS-фреймворк «utility-first»: замість власних класів на кшталт `.card` ти пишеш на елементі набір дрібних готових класів — **утиліт**, кожна з яких робить одну річ. `p-4` — внутрішній відступ, `text-xl` — розмір шрифту, `bg-white` — фон, `rounded-lg` — заокруглення.

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold">Мій блог</h1>
      <p className="mt-2 text-zinc-600">Нотатки про Next.js</p>
    </main>
  )
}
```

Переваги: не треба вигадувати назви класів, стилі видно прямо в розмітці, у фінальному CSS лише ті утиліти, які ти справді використав. Мінус — довгі `className`, до яких треба звикнути.

**Встановлення.** Якщо ти створював проєкт командою `npx create-next-app@latest` з відповідями за замовчуванням (див. [[Next.js Start - 06. Перший проєкт, create-next-app і структура]]), Tailwind уже налаштований — просто переконайся, що три кроки нижче на місці. Для проєкту без нього:

```bash
npm install -D tailwindcss @tailwindcss/postcss
```

```js
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

```css
/* app/globals.css */
@import 'tailwindcss';
```

Третій крок — імпорт `globals.css` у root layout, який у тебе вже є. **PostCSS** — інструмент, що перетворює CSS під час збірки; Next.js підхоплює `postcss.config.mjs` сам, а плагін `@tailwindcss/postcss` замінює рядок `@import 'tailwindcss'` на справжній CSS: базові стилі, змінні теми й усі утиліти, знайдені в коді. Ці кроки ми перевірили на Next.js 16.3.8 з Tailwind 4.3.3: `npm run build` проходить, а в `.next/static/chunks/*.css` зʼявляються саме ті класи, що є в `className`.

> [!quiz] Заповни пропуски: Tailwind v4 у Next.js
> level: junior · type: fill · id: nextjs-start-09-quiz-04
>
> ```js fill
> // postcss.config.mjs
> const config = {
>   plugins: {
>     '[[@tailwindcss/postcss]]': {},
>   },
> }
>
> export default config
> ```
>
> ```css fill
> /* app/globals.css */
> @[[import]] '[[tailwindcss]]';
> ```
>
> **Пояснення:** плагін PostCSS для v4 живе в окремому пакеті `@tailwindcss/postcss`, а в CSS достатньо одного рядка `@import 'tailwindcss'` — він підтягує базові стилі, тему й утиліти. Старі директиви v3 (`@tailwind base` тощо) у v4 не потрібні.

> [!quiz] Склади кроки підключення Tailwind до проєкту без нього
> level: junior · type: order · id: nextjs-start-09-quiz-05
>
> ```text order
> npm install -D tailwindcss @tailwindcss/postcss
> створити postcss.config.mjs з плагіном '@tailwindcss/postcss'
> додати @import 'tailwindcss' у app/globals.css
> імпортувати './globals.css' у app/layout.tsx
> писати утиліти в className і перевірити в next build
> створити tailwind.config.js з полем content ✗
> ```
>
> **Пояснення:** спершу пакети, потім PostCSS-плагін, який обробляє CSS, потім рядок імпорту в CSS і підключення цього CSS до всіх сторінок через root layout. `tailwind.config.js` з `content` — крок з v3: у v4 файли для сканування Tailwind знаходить сам.

> [!diagram] Як утиліта з className стає CSS
> ```yaml
> layout: flow
> nodes:
>   - { id: tsx, label: "app/page.tsx", code: "className=\"p-4 text-2xl\"", tone: blue, icon: "px:file" }
>   - { id: scan, label: "Tailwind", text: "сканує файли проєкту", note: "шукає слова, схожі на класи", tone: violet, icon: "px:magnifier" }
>   - { id: css, label: "app/globals.css", code: "@import 'tailwindcss'", note: "сюди підставляються утиліти", tone: mint }
>   - { id: out, label: ".next/static/chunks/*.css", code: ".p-4{padding:calc(var(--spacing)*4)}", tone: green }
>   - { id: page, label: "браузер", text: "<link rel=stylesheet>", note: "лише використані класи", tone: gray, icon: "px:monitor" }
> edges:
>   - { from: tsx, to: scan, label: "текст файлу" }
>   - { from: scan, to: css, label: "p-4, text-2xl" }
>   - { from: css, to: out, label: "next build" }
>   - { from: out, to: page, label: "CSS-файл" }
> steps:
>   - { focus: tsx, note: "Ти пишеш утиліти в className. Tailwind не виконує цей код — для нього це просто текст." }
>   - { move: { from: tsx, to: scan, value: "\"p-4 text-2xl\"" }, note: "Tailwind переглядає всі файли проєкту, крім node_modules і того, що в .gitignore, і виписує слова, схожі на класи." }
>   - { move: { from: scan, to: css, value: "p-4, text-2xl" }, note: "Плагін @tailwindcss/postcss підставляє CSS цих утиліт на місце @import 'tailwindcss'." }
>   - { move: { from: css, to: out, value: ".p-4{…}" }, note: "next build мінімізує результат у файл у .next/static/chunks. Класи, яких немає в коді, сюди не потрапляють." }
>   - { move: { from: out, to: page, value: "*.css" }, note: "Сторінка підключає готовий CSS-файл. Жодного JavaScript для стилів у браузері не потрібно." }
> ```
> Головне: Tailwind бачить лише ті класи, що записані в коді **повністю**. Це пояснює пастку з динамічними класами нижче.

**Чим v4 відрізняється від v3.** Якщо читатимеш старі статті, побачиш файл `tailwind.config.js` з полем `content`. У v4 його немає: налаштування живуть **у CSS** (такий підхід називають CSS-first), а файли для сканування Tailwind знаходить сам. Для дуже старих браузерів у Next.js є окремий гайд з v3, але для нового проєкту бери v4.

**Свої кольори — через `@theme`.** Тема Tailwind — набір змінних (кольори, шрифти, відступи), з яких генеруються утиліти. Додаєш змінну в блок `@theme` — отримуєш утиліти:

```css
/* app/globals.css */
@import 'tailwindcss';

@theme {
  --color-brand-500: oklch(0.62 0.19 260);
  --color-brand-600: oklch(0.55 0.2 260);
}
```

```tsx
// app/page.tsx (фрагмент)
<button className="rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-600">
  Підписатися
</button>
```

Тепер працюють `bg-brand-500`, `text-brand-500`, `border-brand-600` і так далі — префікс `--color-` означає «це колір». Змінні з `@theme` доступні й у звичайному CSS як `var(--color-brand-500)`. А для змінних, з яких **не треба** утиліт, лишається звичайний `:root { … }`. Шаблон `create-next-app` використовує обидва: кольори фону в `:root`, а `@theme inline` повʼязує їх з утилітами `bg-background` і `text-foreground`.

> [!quiz] Перевір себе: що дасть змінна в @theme?
> level: junior · id: nextjs-start-09-quiz-06
>
> У `globals.css` після `@import 'tailwindcss'` додали `@theme { --color-mint-500: oklch(0.72 0.11 178); }`. Що зміниться?
>
> - [x] Зʼявляться утиліти `bg-mint-500`, `text-mint-500`, `border-mint-500` тощо, і змінна `var(--color-mint-500)` у CSS
> - [ ] Нічого, доки колір не додати в `tailwind.config.js`
> - [ ] Зʼявиться лише CSS-змінна, утиліти доведеться писати вручну
> - [ ] Колір замінить усі стандартні кольори Tailwind
>
> **Пояснення:** у v4 тема описується в CSS. Префікс `--color-` каже Tailwind, що це колір, і він генерує всі колірні утиліти з назвою `mint-500`. Стандартні кольори лишаються. Якщо утиліти не потрібні, змінну кладуть у звичайний `:root`.

### 📐 Основи утиліт

Не треба вчити сотні класів напамʼять: вони складаються з передбачуваних частин, а в редакторі допоможе розширення Tailwind CSS IntelliSense. Найчастіші групи:

| Що | Приклади | Як читати |
|---|---|---|
| Відступи | `p-4`, `px-2`, `mt-6`, `gap-4` | `p` — padding, `m` — margin, `x`/`y` — по осі, `t` — top; число × 0,25rem |
| Розміри | `w-full`, `max-w-3xl`, `h-10` | ширина, максимальна ширина, висота |
| Текст | `text-sm`, `text-2xl`, `font-bold`, `text-center` | розмір, жирність, вирівнювання |
| Кольори | `bg-white`, `text-zinc-600`, `border-red-500` | властивість-колір-відтінок (50…950) |
| Розкладка | `flex`, `items-center`, `justify-between`, `grid`, `grid-cols-3` | flexbox і grid |
| Рамки, тіні | `border`, `rounded-lg`, `shadow-md` | |
| Стани | `hover:bg-zinc-100`, `focus:ring-2`, `disabled:opacity-50` | префікс-«варіант» + утиліта |

Числа у відступах — кроки шкали: у v4 `p-4` компілюється в `padding: calc(var(--spacing) * 4)`, а `--spacing` дорівнює `0.25rem`, тобто 4 × 4px = 16px. Коли потрібне точне значення поза шкалою, є **довільні значення** у квадратних дужках: `w-[100px]`, `text-[0.9em]`, `bg-[#1e293b]`. Користуйся ними зрідка: якщо `[...]` повторюється, це кандидат у `@theme`.

**Варіант** — префікс перед двокрапкою, який каже, *коли* діє утиліта: `hover:` — під курсором, `focus:` — у фокусі, `md:` — від певної ширини екрана, `dark:` — у темній темі. Варіанти можна поєднувати: `md:hover:underline`. На 16.3.8 з Tailwind 4.3.3 ми бачили, що `hover:bg-…` компілюється всередині `@media (hover: hover)`: на телефоні, де курсора немає, «залиплий» hover після дотику не зʼявляється.

### 📱 Адаптивність: спершу мобільна

**Адаптивна верстка** — сторінка, яка добре виглядає на будь-якій ширині екрана. Tailwind робить це варіантами-брейкпоінтами:

| Префікс | Від ширини |
|---|---|
| `sm:` | 40rem (640px) |
| `md:` | 48rem (768px) |
| `lg:` | 64rem (1024px) |
| `xl:` | 80rem (1280px) |
| `2xl:` | 96rem (1536px) |

Головне правило — **mobile-first**: утиліта без префікса діє на всіх екранах, а з префіксом — **від цієї ширини і більше**. Тож `sm:` означає не «на маленьких екранах», а «від 640px».

```tsx
// app/page.tsx (фрагмент)
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <article className="rounded-lg border p-4">Перший пост</article>
  {/* … */}
</div>
```

Читаємо зліва направо: на телефоні одна колонка, від 640px — дві, від 1024px — три. Спершу пиши мобільну версію, потім додавай префікси для ширших екранів. Для «лише до певної ширини» є `max-*`-варіанти: `max-md:hidden` ховає елемент на екранах, вужчих за 768px.

> [!quiz] Перевір себе: на якому екрані текст по центру?
> level: junior · id: nextjs-start-09-quiz-07
>
> Потрібно: на телефоні заголовок по центру, на планшеті й комп'ютері — зліва. Який варіант правильний?
>
> - [x] `text-center sm:text-left`
> - [ ] `sm:text-center text-left`
> - [ ] `sm:text-center md:text-left`
> - [ ] `mobile:text-center desktop:text-left`
>
> **Пояснення:** утиліта без префікса — для всіх ширин, тож базою стає `text-center`, а `sm:text-left` перекриває її від 640px. Варіант `sm:text-center text-left` робить навпаки: зліва на телефоні, по центру від 640px. Префіксів `mobile:` і `desktop:` у Tailwind немає за замовчуванням.

### 🌙 Темна тема

Варіант `dark:` за замовчуванням спирається на CSS-медіазапит `prefers-color-scheme: dark` — налаштування теми в операційній системі користувача. Нічого вмикати не треба:

```tsx
// app/layout.tsx
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        {children}
      </body>
    </html>
  )
}
```

У зібраному CSS це `@media (prefers-color-scheme: dark) { .dark\:bg-zinc-950 { … } }`. Перемкни тему в системі — сторінка зміниться без перезавантаження.

Якщо потрібна **кнопка-перемикач**, `dark:` перевизначають рядком у CSS, щоб він реагував на клас `dark` на `<html>`:

```css
/* app/globals.css */
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));
```

Тепер `dark:`-утиліти діють, коли в елемента або його предка є клас `dark` (є і варіант з атрибутом `data-theme`). Сам клас ставить кнопка, тобто Client Component з обробником кліку (тема курсу 07, [[Next.js - 07. Server і Client Components]]), а вибір зберігають у `localStorage` чи cookie. Щоб сторінка не «блимала» світлою темою до запуску JavaScript, потрібні додаткові кроки — це вже за межами старту.

### 🎛️ Класи за умовою і пастка з динамічними рядками

Часто клас залежить від даних: активний пункт меню, колір бейджа, вимкнена кнопка. Згадай, як Tailwind знаходить класи: він читає код **як текст**. Тож клас, складений з частин під час виконання, у тексті не існує:

```tsx
// app/ui/bad-badge.tsx
export function BadBadge({ color }: { color: string }) {
  return <span className={`bg-${color}-300`}>❌ клас не згенерується</span>
}
```

У HTML буде `class="bg-purple-300"`, але в зібраному CSS такого правила немає — ми перевірили `.next/static/chunks/*.css` на 16.3.8: слово `purple` там не зустрічається жодного разу. Помилки теж немає, просто фону немає.

Правильно — тримати **повні** назви класів у коді й вибирати між ними:

```ts
// lib/cx.ts
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}
```

```tsx
// app/ui/badge.tsx
import { cx } from '@/lib/cx'

const tones = {
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
} as const

export function Badge({ tone, active, children }: {
  tone: keyof typeof tones
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <span className={cx('rounded px-2 py-1 text-sm', tones[tone], active && 'ring-2 ring-brand-500')}>
      {children}
    </span>
  )
}
```

`tones` — обʼєкт-«словник» з повними рядками, тож Tailwind їх бачить. `cx()` — маленька функція, яка склеює класи й викидає «порожнє»: `active && 'ring-2'` дає `false`, коли `active` не задано, і `cx` його пропускає. У продакшні замість саморобної беруть пакет `clsx` (у shadcn/ui — разом з `tailwind-merge`), але принцип той самий. `cx()` так само працює з CSS Modules: `cx(styles.card, isActive && styles.active)`. У 🛠️ Практиці ти напишеш розширену версію.

> [!quiz] Перевір себе: які варіанти дадуть червоний фон?
> level: junior · id: nextjs-start-09-quiz-08
>
> Компонент отримує `status: 'ok' | 'error'`. Які рядки гарантовано дадуть червоний фон для `'error'` (Tailwind v4, налаштування за замовчуванням)?
>
> - [x] `` className={status === 'error' ? 'bg-red-500' : 'bg-green-500'} ``
> - [x] `` className={{ ok: 'bg-green-500', error: 'bg-red-500' }[status]} ``
> - [ ] `` className={`bg-${status === 'error' ? 'red' : 'green'}-500`} ``
> - [ ] `` className={'bg-' + 'red-500'} ``
>
> **Пояснення:** у перших двох варіантах рядки `bg-red-500` і `bg-green-500` записані в коді повністю, і Tailwind їх знаходить. У третьому й четвертому повного слова `bg-red-500` у тексті файлу немає: є лише шматки `bg-`, `red`, `-500`, і правило не згенерується. Що рядок «збереться» під час виконання, Tailwind не знає — він код не запускає.

### 🧮 Як обрати

| Ситуація | Бери |
|---|---|
| Верстка сторінок і компонентів: відступи, сітка, кольори, стани | Tailwind |
| Базові стилі `body`, CSS-змінні, підключення Tailwind | глобальний CSS у root layout |
| Складна анімація з `@keyframes`, багато вкладених селекторів, стилі для чужого HTML | CSS Module |
| Компонент, який має виглядати однаково, хоч куди його вставиш | CSS Module або Tailwind — головне, не глобальний клас |
| Готовий CSS бібліотеки (календар, слайдер) | імпорт її `.css` у layout чи компоненті |
| Колір чи шрифт, що повторюється | змінна в `@theme` |

Змішувати нормально: компонент може мати `className={cx(styles.chart, 'mt-4')}`. Ненормально — дублювати одне й те саме трьома способами або тримати стилі компонента в глобальному файлі «бо так швидше».

### 🏭 Як це роблять у продакшні

- **Tailwind як основа, `@theme` як дизайн-система.** Кольори бренду, шрифти й брейкпоінти — змінні в `globals.css`, а не «магічні» `bg-[#3b82f6]` по всьому коду.
- **Повторюється — винось у компонент, а не в клас.** Замість копіювання довгого `className` у десять кнопок роблять компонент `<Button variant="primary">` зі словником варіантів, як `tones` вище.
- **`clsx` + `tailwind-merge`** (часто під іменем `cn()`), щоб класи з props перекривали базові без конфліктів (`p-2` проти `p-4`).
- **CSS Modules для «важкого» CSS**: анімації, сторонні віджети, HTML з CMS через `:global(...)` всередині локального класу.
- **Один `globals.css`, імпортований лише в root layout.** Решта глобальних імпортів — підозріла на code review.
- **Перевірка в `next build`.** Порядок CSS у dev і prod може відрізнятися, тож вигляд перевіряють на продакшн-збірці.

## ⚠️ Пастки

> [!pitfall] Немає postcss.config.mjs
> Збірка проходить, але утиліт немає. На 16.3.8 лише попередження в консолі:
>
> ```text
> Warning: Parsing CSS source code failed
> Unknown at rule: @theme
> ```
>
> Перевір, що файл є в корені проєкту і в ньому плагін `@tailwindcss/postcss`.

> [!pitfall] Клас, складений з шматків
> Tailwind читає код як текст і не бачить рядків, яких у ньому немає.
>
> ```tsx
> <span className={`text-${color}-600`} /> // ❌ правило не згенерується
> <span className={colors[color]} />       // ✅ colors = { red: 'text-red-600', … }
> ```

> [!pitfall] Глобальний CSS у сторінці
> Глобальні стилі не прибираються після переходу на іншу сторінку: правило `h1 { color: red }` з `app/blog/` може «переїхати» на головну.
>
> ```tsx
> // ❌ app/blog/page.tsx
> import './blog-global.css'
> // ✅ app/blog/page.tsx
> import styles from './blog.module.css'
> ```

> [!pitfall] Тег без класу в CSS Module
> Модуль вимагає локальний клас у кожному селекторі, інакше `Selector "h1" is not pure`.
>
> ```css
> h1 { color: red; }       /* ❌ */
> .article h1 { color: red; } /* ✅ */
> ```

> [!pitfall] sm: означає «від 640px», а не «на телефоні»
> Мобільну версію пиши без префікса, а ширші екрани — з префіксом.
>
> ```tsx
> <nav className="sm:hidden" />  {/* ❌ ховає на всьому від 640px */}
> <nav className="hidden sm:flex" /> {/* ✅ сховано на телефоні, видно від 640px */}
> ```

## 🔗 Звʼязки

- [[Next.js Start - 07. Сторінки й layouts]] — root layout, у який імпортуємо `globals.css`.
- [[Next.js Start - 06. Перший проєкт, create-next-app і структура]] — де `create-next-app` уже налаштував Tailwind.
- [[Next.js Start - 02. React-мінімум, компоненти, JSX і props]] — `className` і props, з яких будуємо варіанти компонентів.
- [[Next.js - 07. Server і Client Components]] — чому перемикач теми — Client Component, а сторінки зі стилями лишаються серверними.
- Далі в курсі: тема 31 — стилізація глибше (Sass, CSS-in-JS і RSC, shadcn/ui, налаштування CSS-чанків), тема 32 — `next/font` і шрифти в `@theme`.

## ⚡ Фішки

> [!reel] 🏷️ CSS Module перейменовує класи сам
> `.title` у `blog.module.css` стає `blog-module__3rPSzG__title`. Тож у кожному файлі можна мати свій `.title`, і вони ніколи не зіткнуться.

> [!reel] 🔍 Tailwind не запускає твій код
> Він читає файли як текст і шукає слова, схожі на класи. `bg-${color}-500` для нього не існує — правила не буде, а помилки теж.

> [!reel] 📱 sm: — це «від 640px і ширше»
> У Tailwind утиліта без префікса діє на всіх екранах. Тому спершу верстають телефон, а `sm:`, `md:`, `lg:` додають для ширших.
>
> ```tsx
> <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
> ```

> [!reel] 🗂️ У Tailwind v4 немає tailwind.config.js
> Налаштування живуть у CSS: `@import 'tailwindcss'` і блок `@theme` зі змінними. `--color-brand-500` одразу дає `bg-brand-500`, `text-brand-500` і решту.

> [!reel] 🌙 dark: працює без жодного JavaScript
> За замовчуванням `dark:` — це медіазапит `prefers-color-scheme`. Перемкни тему в системі, і сторінка зміниться сама.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Куди імпортувати глобальний CSS у App Router і чому саме туди?
> *дуже часто · практика* · `nextjs-start-09-card-01`
>
> У root layout — `app/layout.tsx`: `import './globals.css'`. Root layout обгортає кожну сторінку, тож стилі діють усюди. Імпортувати глобальний CSS у сторінки не варто: після переходу між маршрутами він не прибирається.
>
> 📚 [[Next.js Start - 09. Стилі, Tailwind CSS і CSS Modules#🌍 Глобальний CSS у root layout|Розділ: глобальний CSS]] · [Next.js: CSS](https://nextjs.org/docs/app/getting-started/css#global-css)

> [!question]- Що таке CSS Module і як він розв'язує конфлікти назв?
> *дуже часто · теорія* · `nextjs-start-09-card-02`
>
> Файл `*.module.css`, який імпортують з іменем: `import styles from './x.module.css'`. Збирач перейменовує кожен клас на унікальний (імʼя файлу + хеш + назва), тож однаковий `.title` у двох файлах — два різні класи.
>
> 📚 [[Next.js Start - 09. Стилі, Tailwind CSS і CSS Modules#🧩 CSS Modules: класи, які не конфліктують|Розділ: CSS Modules]] · [Next.js: CSS Modules](https://nextjs.org/docs/app/getting-started/css#css-modules)

> [!question]- Які три кроки підключають Tailwind CSS v4 у Next.js?
> *часто · практика* · `nextjs-start-09-card-03`
>
> Встановити `tailwindcss` і `@tailwindcss/postcss`; у `postcss.config.mjs` додати плагін `'@tailwindcss/postcss'`; у `app/globals.css` написати `@import 'tailwindcss'` (і цей файл імпортувати в root layout). `create-next-app` з налаштуваннями за замовчуванням робить це сам.
>
> ```css
> /* app/globals.css */
> @import 'tailwindcss';
> ```
>
> 📚 [[Next.js Start - 09. Стилі, Tailwind CSS і CSS Modules#🌬️ Tailwind CSS v4: стилі класами|Розділ: Tailwind v4]] · [Tailwind CSS: Install with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)

> [!question]- Що означає префікс md: у класі md:text-4xl?
> *часто · теорія* · `nextjs-start-09-card-04`
>
> «Від ширини 48rem (768px) і більше». Tailwind — mobile-first: утиліта без префікса діє на всіх екранах, з префіксом — від брейкпоінта і ширше. `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.
>
> 📚 [[Next.js Start - 09. Стилі, Tailwind CSS і CSS Modules#📱 Адаптивність: спершу мобільна|Розділ: адаптивність]] · [Tailwind CSS: Responsive design](https://tailwindcss.com/docs/responsive-design)

> [!question]- Як Tailwind вирішує, що вмикати dark:-утиліти?
> *часто · теорія* · `nextjs-start-09-card-05`
>
> За замовчуванням — за медіазапитом `prefers-color-scheme: dark`, тобто за темою ОС. Для ручного перемикача варіант перевизначають у CSS: `@custom-variant dark (&:where(.dark, .dark *));` — і тоді все вирішує клас `dark` на `<html>`.
>
> 📚 [[Next.js Start - 09. Стилі, Tailwind CSS і CSS Modules#🌙 Темна тема|Розділ: темна тема]] · [Tailwind CSS: Dark mode](https://tailwindcss.com/docs/dark-mode)

> [!question]- Чому className={`bg-${color}-500`} не дає фону?
> *дуже часто · код* · `nextjs-start-09-card-06`
>
> Tailwind генерує CSS лише для класів, які бачить у тексті файлів, а код не виконує. Повного слова `bg-red-500` у тексті немає, тому й правила немає. Тримай повні назви в словнику: `{ red: 'bg-red-500', green: 'bg-green-500' }[color]`.
>
> 📚 [[Next.js Start - 09. Стилі, Tailwind CSS і CSS Modules#🎛️ Класи за умовою і пастка з динамічними рядками|Розділ: динамічні класи]] · [Tailwind CSS: Detecting classes](https://tailwindcss.com/docs/detecting-classes-in-source-files)

### 🟡 Middle

> [!question]- Як додати власний колір бренду в Tailwind v4 і чим @theme відрізняється від :root?
> *часто · практика* · `nextjs-start-09-card-07`
>
> Оголосити змінну в `@theme` у `globals.css`: `--color-brand-500: …` — і зʼявляться `bg-brand-500`, `text-brand-500` тощо. `@theme` — змінні, з яких Tailwind генерує утиліти; `:root` — звичайні CSS-змінні без утиліт.
>
> 📚 [[Next.js Start - 09. Стилі, Tailwind CSS і CSS Modules#🌬️ Tailwind CSS v4: стилі класами|Розділ: @theme]] · [Tailwind CSS: Theme variables](https://tailwindcss.com/docs/theme)

> [!question]- Що роблять composes і :global у CSS Module?
> *іноді · код* · `nextjs-start-09-card-08`
>
> `composes: card` додає до класу ще й клас `card`: `styles.featured` містить обидва імені. `:global(a)` вимикає перейменування для частини селектора — так стилізують чужий HTML усередині локального класу: `.card :global(a) { … }`.
>
> 📚 [[Next.js Start - 09. Стилі, Tailwind CSS і CSS Modules#🧩 CSS Modules: класи, які не конфліктують|Розділ: CSS Modules]] · [CSS Modules (GitHub)](https://github.com/css-modules/css-modules)

> [!question]- Від чого залежить порядок CSS у продакшн-збірці і чому перевіряти його треба в next build?
> *іноді · теорія* · `nextjs-start-09-card-09`
>
> Від порядку імпортів у коді: що імпортовано раніше, те раніше в CSS, і при однаковій специфічності виграє пізніше. У `next dev` порядок може відрізнятися від продакшну, тому фінальний вигляд перевіряють після `next build`.
>
> 📚 [[Next.js Start - 09. Стилі, Tailwind CSS і CSS Modules#🌍 Глобальний CSS у root layout|Розділ: порядок CSS]] · [Next.js: Ordering and Merging](https://nextjs.org/docs/app/getting-started/css#ordering-and-merging)

## 🛠️ Практика

> [!task] Напиши cx() для збирання класів
> level: junior · difficulty: easy · id: nextjs-start-09-task-01 · tags: css, tailwind, classnames
>
> Напиши `cx(...parts)` — функцію, яка склеює класи для `className`. Кожен аргумент може бути:
>
> - рядком — додати як є (порожній рядок пропустити);
> - `false`, `null`, `undefined` — пропустити (так працює `isActive && 'font-bold'`);
> - обʼєктом `{ клас: умова }` — додати ключі, у яких значення правдиве (truthy);
> - масивом з будь-чого з переліченого — обробити так само, вглиб.
>
> Результат — класи через **один** пробіл, без пробілів на краях, у порядку появи. Задача на TypeScript: типи знімаються перед запуском і не перевіряються, тести дивляться на значення.
>
> ```ts
> cx('btn', isActive && 'btn-active', { 'opacity-50': disabled }) // → 'btn btn-active opacity-50'
> ```
>
> ```ts starter
> type ClassValue = string | false | null | undefined | Record<string, unknown> | ClassValue[]
>
> function cx(...parts: ClassValue[]): string {
>   // ❌ працює лише для рядків і дає зайві пробіли
>   return parts.join(' ')
> }
> ```
>
> ```ts tests
> test('склеює рядки через пробіл', () => {
>   expect(cx('p-4', 'text-xl', 'font-bold')).toBe('p-4 text-xl font-bold')
> })
>
> test('пропускає false, null, undefined і порожні рядки', () => {
>   const isActive = false
>   expect(cx('btn', isActive && 'btn-active', null, undefined, '', 'rounded')).toBe('btn rounded')
> })
>
> test('бере ключі обʼєкта з правдивими значеннями', () => {
>   expect(cx('btn', { 'opacity-50': true, hidden: false, 'ring-2': 1 })).toBe('btn opacity-50 ring-2')
> })
>
> test('розгортає вкладені масиви', () => {
>   expect(cx(['a', ['b', false, { c: true }]], 'd')).toBe('a b c d')
> })
>
> test('без аргументів або з самими «порожніми» — порожній рядок', () => {
>   expect(cx()).toBe('')
>   expect(cx(false, null, { x: false }, [])).toBe('')
> })
> ```
>
> > [!hint]- Підказка 1
> > Збирай класи в масив `out`, а наприкінці зроби `out.join(' ')`. Так зайвих пробілів не буде: порожнє в масив просто не потрапляє.
>
> > [!hint]- Підказка 2
> > Для масиву викликай ту саму логіку рекурсивно (`cx(...part)`), а для обʼєкта пройди `Object.entries(part)` і бери ключі з правдивим значенням. Перевіряй `Array.isArray` раніше, ніж `typeof part === 'object'`: масив — теж обʼєкт.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type ClassValue = string | false | null | undefined | Record<string, unknown> | ClassValue[]
> >
> > function cx(...parts: ClassValue[]): string {
> >   const out: string[] = []
> >   for (const part of parts) {
> >     if (!part) continue
> >     if (typeof part === 'string') {
> >       out.push(part)
> >     } else if (Array.isArray(part)) {
> >       const inner = cx(...part)
> >       if (inner) out.push(inner)
> >     } else {
> >       for (const [name, on] of Object.entries(part)) {
> >         if (on) out.push(name)
> >       }
> >     }
> >   }
> >   return out.join(' ')
> > }
> > ```
> >
> > Так влаштований і популярний пакет `clsx`. Зверни увагу: `cx` лише вибирає між **повними** назвами класів, які вже є в коді, тому Tailwind їх бачить. Збирати назву з шматків (`'bg-' + color`) `cx` не допоможе.

> [!task] Класи кнопки за варіантом і розміром
> level: junior · difficulty: medium · id: nextjs-start-09-task-02 · tags: tailwind, variants, components
>
> Компонент `<Button>` має props `variant`, `size` і `disabled`. Напиши `buttonClasses({ variant, size, disabled })`, яка повертає рядок для `className`:
>
> - завжди спершу базові класи: `inline-flex items-center rounded-md font-medium`;
> - `variant`: `'primary'` → `bg-brand-500 text-white hover:bg-brand-600`, `'ghost'` → `bg-transparent text-zinc-900 hover:bg-zinc-100`; не задано — `'primary'`;
> - `size`: `'sm'` → `px-2 py-1 text-sm`, `'md'` → `px-4 py-2 text-base`; не задано — `'md'`;
> - `disabled: true` → у кінець `opacity-50 pointer-events-none`;
> - невідомий `variant` чи `size` — кинути `Error` з текстом `Unknown variant: <значення>` або `Unknown size: <значення>`.
>
> Порядок у рядку: база, варіант, розмір, `disabled`. Усі назви класів мають бути записані в коді **повністю** — інакше Tailwind їх не згенерує.
>
> ```js starter
> function buttonClasses({ variant, size, disabled } = {}) {
>   // ❌ Tailwind не побачить жодного з цих класів
>   return `inline-flex items-center rounded-md font-medium bg-${variant}-500 text-${size}`
> }
> ```
>
> ```js tests
> test('за замовчуванням — primary і md', () => {
>   expect(buttonClasses()).toBe(
>     'inline-flex items-center rounded-md font-medium bg-brand-500 text-white hover:bg-brand-600 px-4 py-2 text-base',
>   )
> })
>
> test('ghost і sm', () => {
>   expect(buttonClasses({ variant: 'ghost', size: 'sm' })).toBe(
>     'inline-flex items-center rounded-md font-medium bg-transparent text-zinc-900 hover:bg-zinc-100 px-2 py-1 text-sm',
>   )
> })
>
> test('disabled додає класи в кінець', () => {
>   const cls = buttonClasses({ disabled: true })
>   expect(cls.endsWith('opacity-50 pointer-events-none')).toBe(true)
>   expect(buttonClasses({ disabled: false })).not.toContain('opacity-50')
> })
>
> test('невідомий варіант — помилка', () => {
>   expect(() => buttonClasses({ variant: 'danger' })).toThrow('Unknown variant: danger')
> })
>
> test('невідомий розмір — помилка', () => {
>   expect(() => buttonClasses({ size: 'xl' })).toThrow('Unknown size: xl')
> })
> ```
>
> > [!hint]- Підказка 1
> > Заведи два обʼєкти-словники: `VARIANTS = { primary: '…', ghost: '…' }` і `SIZES = { sm: '…', md: '…' }`. Значення за замовчуванням дай прямо в деструктуризації: `{ variant = 'primary', size = 'md' }`.
>
> > [!hint]- Підказка 2
> > Перевіряй наявність ключа через `Object.hasOwn(VARIANTS, variant)` — так `'toString'` не пройде як «варіант». Збери частини в масив і `join(' ')`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const VARIANTS = {
> >   primary: 'bg-brand-500 text-white hover:bg-brand-600',
> >   ghost: 'bg-transparent text-zinc-900 hover:bg-zinc-100',
> > }
> >
> > const SIZES = {
> >   sm: 'px-2 py-1 text-sm',
> >   md: 'px-4 py-2 text-base',
> > }
> >
> > function buttonClasses({ variant = 'primary', size = 'md', disabled = false } = {}) {
> >   if (!Object.hasOwn(VARIANTS, variant)) throw new Error(`Unknown variant: ${variant}`)
> >   if (!Object.hasOwn(SIZES, size)) throw new Error(`Unknown size: ${size}`)
> >   const parts = ['inline-flex items-center rounded-md font-medium', VARIANTS[variant], SIZES[size]]
> >   if (disabled) parts.push('opacity-50 pointer-events-none')
> >   return parts.join(' ')
> > }
> > ```
> >
> > Словник варіантів — стандартний спосіб робити компоненти на Tailwind: усі класи записані повністю, тож потрапляють у CSS, а нові варіанти додаються одним рядком. Бібліотеки на кшталт `cva` (class-variance-authority) роблять те саме з типами.

## 📚 Джерела та що почитати

- 🟢 [Next.js — CSS](https://nextjs.org/docs/app/getting-started/css) — Tailwind, CSS Modules, глобальний CSS, порядок стилів.
- 🟢 [Tailwind CSS — Install with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs) — офіційне встановлення v4.
- 🟢 [Tailwind CSS — Styling with utility classes](https://tailwindcss.com/docs/styling-with-utility-classes) — як мислити утилітами, варіанти, довільні значення.
- 🟢 [Tailwind CSS — Responsive design](https://tailwindcss.com/docs/responsive-design) — брейкпоінти й mobile-first.
- 🟡 [Tailwind CSS — Dark mode](https://tailwindcss.com/docs/dark-mode) — `dark:` і ручний перемикач.
- 🟡 [Tailwind CSS — Theme variables](https://tailwindcss.com/docs/theme) — `@theme` і свої кольори.
- 🟡 [Tailwind CSS — Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files) — чому динамічні класи не працюють.
- 🟡 [CSS Modules](https://github.com/css-modules/css-modules) — специфікація: `composes`, `:global`.
- 🛠️ [Next.js — Tailwind CSS v3](https://nextjs.org/docs/app/guides/tailwind-v3-css) — якщо потрапиш на старий проєкт.

> [!important] Підсумок
> - CSS у Next.js підключають імпортом; `next build` збирає його в мінімізовані `.css`-файли. У JSX — `className`.
> - Глобальний CSS (`app/globals.css`) імпортують лише в root layout: він діє всюди й не прибирається при переходах.
> - CSS Module (`*.module.css`) перейменовує класи на унікальні: однакові назви в різних файлах не конфліктують; селектор мусить містити клас.
> - Tailwind v4 — три кроки: пакети, `postcss.config.mjs` з `@tailwindcss/postcss`, `@import 'tailwindcss'`. Свої токени — у `@theme`.
> - Утиліти mobile-first (`sm:` = від 640px), `dark:` — за темою ОС. Класи пишуть повністю й вибирають між ними словником або `cx()`.
