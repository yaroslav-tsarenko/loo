---
title: Перший проєкт, create-next-app і структура
id: nextjs-start-06
slug: 06-first-project
order: 6
level: noob
skill: routing
icon: px:toolbox
tags: [nextjs, create-next-app, project-structure, cli, next-dev, next-build, turbopack, beginner]
prerequisites:
  - "[[Next.js Start - 05. Що таке Next.js і навіщо фреймворк]]"
estimatedMinutes: 35
nextVersion: 16.3.8
---

# Перший проєкт, create-next-app і структура

> [!success] 🎯 Після цього розділу ти зможеш
> - створити проєкт командою `npx create-next-app@16.3.8` і розуміти кожне її питання;
> - увімкнути налаштування курсу (`cacheComponents: true`) у `next.config.ts`;
> - пояснити, навіщо кожен файл і папка в новому проєкті: `app/`, `public/`, `next.config.ts`, `package.json`, `tsconfig.json`, `AGENTS.md`;
> - розрізнити `next dev`, `next build` і `next start` і знати, коли яку запускати;
> - прочитати таблицю маршрутів після збірки: що означають `○`, `◐` і `ƒ`;
> - сказати, що потрапляє в Git, а що ні, і де жити змінним середовища.

## 🤔 Передбач

> [!quiz] Що станеться після npm start?
> level: junior · type: output · id: nextjs-start-06-quiz-01
>
> Ти щойно створив проєкт і в його папці одразу запускаєш:
>
> ```bash
> npm start
> ```
>
> У `package.json` записано `"start": "next start"`. Команд `npm run dev` чи `npm run build` ти ще не запускав.
>
> - [x] Помилка: Next.js не знаходить продакшн-збірку в `.next` і радить спершу запустити `next build`
> - [ ] Відкриється сайт на `http://localhost:3000`, як після `npm run dev`
> - [ ] Next.js сам збере проєкт і запустить сервер
> - [ ] Відкриється порожня сторінка без стилів
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. `next start` лише **запускає** вже зібраний застосунок. Без `next build` збирати нічого — і Next.js 16.3.8 пише `Could not find a production build in the '.next' directory. Try building your app with 'next build' before starting the production server.`

## 🧒 Простими словами

Уяви ресторан. Спершу є **тестова кухня**: кухар пробує страву, досипає солі, пробує знову — і все за секунди. Це `next dev`: ти міняєш код, і браузер одразу показує результат. Перед відкриттям кухня готує все **заздалегідь**: нарізає, запікає, розкладає по контейнерах, щоб у годину пік лише віддавати. Це `next build`. А коли двері відчиняються й заходять гості — це `next start`: ресторан працює з тим, що приготували. Якщо відчинити двері, нічого не приготувавши, гостям нема чого подати — саме це й сталося в 🤔 Передбач.

## 🔬 Як це працює насправді

### 🧾 Що потрібно до старту

- **Node.js 20.9 або новіший.** Node.js — це JavaScript поза браузером: на ньому працюють і сервер Next.js, і всі інструменти. Перевір версію в терміналі: `node -v`. Якщо команда не знайдена або версія старша — встанови LTS-версію з nodejs.org.
- **npm** приходить разом з Node.js. Це менеджер пакетів: він завантажує бібліотеки (пакети) в папку `node_modules/` і записує їх у `package.json`.
- **Термінал** (на macOS — Terminal, на Windows — PowerShell або WSL) і **редактор коду**, наприклад VS Code.

Ще одна команда, яку ти зараз побачиш, — `npx`. Вона приходить разом з npm і **запускає пакет, не встановлюючи його назавжди**: завантажила, виконала, і все.

### 🚀 Крок 1. Створюємо проєкт

Відкрий термінал у папці, де зберігаєш проєкти, і запусти:

```bash
npx create-next-app@16.3.8
```

`create-next-app` — офіційний генератор проєктів Next.js. Частина `@16.3.8` фіксує версію: курс написано й перевірено саме на ній. У документації ти побачиш `@latest` — це «найновіша на сьогодні», і через пів року вона може відрізнятися від того, що в курсі. Тому поки вчишся — копіюй команду з версією. (Наприкінці CLI може написати, що вийшла нова версія `create-next-app`, — для курсу це нормально, ігноруй.)

Генератор поставить кілька запитань. Ось що показує 16.3.8:

```text
? What is your project named? › my-app
? Would you like to use the recommended Next.js defaults? › - Use arrow-keys. Return to submit.
❯   Yes, use recommended defaults
    TypeScript, ESLint, No React Compiler, Tailwind CSS, No src/ directory, App Router, AGENTS.md
    No, reuse previous settings
    No, customize settings
```

Перше питання — **назва проєкту**: так називатиметься папка. Пиши малими латинськими літерами з дефісами: `my-app`, `coffee-shop`. Друге — чи взяти **рекомендовані налаштування**. Стрілками обирається варіант, `Enter` підтверджує. Бери перший: `Yes, use recommended defaults`. Під ним видно, що саме ти отримаєш:

- **TypeScript** — мова курсу (тема 04);
- **ESLint** — лінтер: програма, що шукає типові помилки в коді й підказує, як писати краще;
- **Tailwind CSS** — CSS-фреймворк, з яким ми стилізуємо сторінки (тема 09);
- **App Router** — папка `app/`, той маршрутизатор, який ми вчимо (тема 05);
- **AGENTS.md** — інструкція для AI-помічників (про неї нижче);
- **без `src/`** і **без React Compiler** — їх можна ввімкнути, але курсу вони не потрібні.

Варіант `No, reuse previous settings` бере відповіді з минулого разу. `No, customize settings` задасть питання по одному. Варто знати, як вони звучать, — їх часто показують у туторіалах:

```text
Would you like to use TypeScript? › No / Yes
Which linter would you like to use? › ESLint / Biome / None
Would you like to use React Compiler? › No / Yes
Would you like to use Tailwind CSS? › No / Yes
Would you like your code inside a `src/` directory? › No / Yes
Would you like to use App Router? (recommended) › No / Yes
Would you like to customize the import alias (`@/*` by default)? › No / Yes
Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? › No / Yes
```

**Import alias** — короткий шлях для імпортів: замість `'../../../components/button'` пишеш `'@/components/button'`, де `@/` означає корінь проєкту.

Далі генератор сам усе робить і звітує в терміналі (уривок):

```text
Creating a new Next.js app in /Users/olya/projects/my-app.

Using npm.

Initializing project with template: app-tw

Installing dependencies:
- next
- react
- react-dom
...
Generating route types...
✓ Types generated successfully

Initialized a git repository.

Success! Created my-app at /Users/olya/projects/my-app
```

Він створив папку, поклав туди шаблон, встановив пакети через npm, згенерував типи маршрутів (у `.next/types/`) і навіть ініціалізував Git-репозиторій. Якщо не хочеш відповідати на питання, є прапорець `--yes`: `npx create-next-app@16.3.8 my-app --yes` бере збережені відповіді з минулого запуску, а якщо їх немає — налаштування за замовчуванням. Інші прапорці (`--ts`, `--skip-install` тощо) теж прибирають питання: тоді CLI пише `Using defaults for unprovided options` і показує, що обрав сам.

> [!quiz] Перевір себе: що дають рекомендовані налаштування?
> level: junior · type: multi · id: nextjs-start-06-quiz-02
> - [x] TypeScript
> - [x] Tailwind CSS
> - [x] App Router (папка `app/`)
> - [x] Файл `AGENTS.md` для AI-помічників
> - [ ] Папку `src/` для коду
> - [ ] Pages Router (папка `pages/`)
> - [ ] Увімкнений React Compiler
>
> **Пояснення:** рекомендований набір — TypeScript, ESLint, Tailwind CSS, App Router і `AGENTS.md`. Папка `src/` і React Compiler вимкнені: це питання смаку й оптимізації, а не старту. Pages Router у рекомендованих налаштуваннях не пропонують узагалі.

### ⚙️ Крок 2. Налаштування курсу

Перейди в папку проєкту: `cd my-app`. Тепер одна правка, яку ми робимо в усіх прикладах курсу. Відкрий `next.config.ts` — **конфіг Next.js**, обʼєкт з налаштуваннями фреймворку. Генератор залишив його порожнім. Додай рядок:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

`cacheComponents: true` вмикає **Cache Components** — модель Next.js 16, де сторінка складається зі статичної оболонки й динамічних шматків (тема 05). Документація радить її для нових проєктів, і всі приклади курсу зібрані саме з нею. Перевірити, що налаштування підхопилося, легко: `next dev` і `next build` пишуть у терміналі `- Cache Components enabled`.

> [!note] Версія React
> `create-next-app@16.3.8` записує в `package.json` React 19.2.x. Курс перевірено з React 19.3.0. Щоб усе збігалося з прикладами, можеш виконати `npm i react@19.3.0 react-dom@19.3.0`. Для тем Start різниці не буде: App Router працює на вбудованій у Next.js версії React.

### 🗂️ Що всередині проєкту

Ось що створив генератор (без `node_modules/` і `.git/`, які завжди великі):

```text
my-app/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

| Файл чи папка | Навіщо | Чи редагувати |
|---|---|---|
| `app/` | **App Router**: сторінки, layouts і все, що з ними поруч | постійно |
| `app/layout.tsx` | **root layout** — рамка всіх сторінок з `<html>` і `<body>` (тема 07) | так |
| `app/page.tsx` | головна сторінка, адреса `/` | так |
| `app/globals.css` | глобальні стилі й підключення Tailwind (тема 09) | так |
| `app/favicon.ico` | іконка вкладки браузера | можна замінити |
| `public/` | статичні файли (картинки, шрифти), що віддаються як є | кладеш файли |
| `next.config.ts` | налаштування Next.js | зрідка |
| `package.json` | назва, **скрипти** й залежності проєкту | зрідка |
| `package-lock.json` | точні версії всіх встановлених пакетів | ні, його веде npm |
| `tsconfig.json` | налаштування TypeScript | зрідка |
| `next-env.d.ts` | типи Next.js для TypeScript, генерується сам | ні |
| `eslint.config.mjs` | правила лінтера | зрідка |
| `postcss.config.mjs` | підключає Tailwind до збірки CSS | ні |
| `AGENTS.md`, `CLAUDE.md` | інструкції для AI-помічників | можна доповнювати |
| `.gitignore` | що Git не повинен зберігати | зрідка |
| `README.md` | опис проєкту для людей | так |

Кілька слів про `tsconfig.json`. Генератор уже ввімкнув `"strict": true` (найсуворіші перевірки TypeScript), додав плагін `next` (підказки в редакторі для файлів Next.js) і псевдонім `"@/*": ["./*"]` — той самий import alias. Тож `import { products } from '@/lib/products'` знайде файл `lib/products.ts` у корені проєкту, звідки б ти не імпортував.

Ще дві папки в дереві вище не показано, хоча вони вже є. `node_modules/` створив npm: там лежать пакети, і її ніколи не редагують руками. `.next/` створює Next.js: генератор уже поклав туди типи маршрутів (`.next/types/`), а `next dev` і `next build` додадуть результати збірки й кеш. Обидві можна видалити будь-коли — вони відтворяться (`npm install` і `npm run dev` чи `build`).

> [!diagram] Що в проєкті твоє, а що — службове
> ```yaml
> layout: tree
> nodes:
>   - { id: root, label: "my-app/", text: "корінь проєкту", tone: gray, icon: "px:folder" }
>   - { id: app, label: "app/", text: "сторінки й layouts", note: "page.tsx → адреса", parent: root, tone: blue, icon: "px:house" }
>   - { id: pub, label: "public/", text: "next.svg → /next.svg", note: "файли як є", parent: root, tone: green, icon: "px:image" }
>   - { id: cfg, label: "конфіги", text: "next.config.ts · tsconfig.json", note: "package.json зі скриптами", parent: root, tone: violet, icon: "px:gear" }
>   - { id: agents, label: "AGENTS.md", text: "для AI-помічників", parent: root, tone: yellow }
>   - { id: gen, label: "node_modules/ · .next/", text: "генерується", note: "не редагуй, не коміть", parent: root, tone: red, icon: "px:warning" }
> steps:
>   - { show: root, note: "Корінь проєкту — папка, яку створив create-next-app. Усі команди запускаєш звідси." }
>   - { show: app, note: "app/ — твоє робоче місце. Кожна папка з page.tsx стає адресою сайту." }
>   - { show: pub, note: "public/ віддається як є: public/next.svg відкривається за адресою /next.svg." }
>   - { show: [cfg, agents], note: "Конфіги кажуть Next.js, TypeScript і npm, як працювати. AGENTS.md підказує AI-помічникам, де шукати актуальну документацію." }
>   - { show: gen, note: "node_modules/ і .next/ створюють інструменти. Їх не редагують і не зберігають у Git — вони відтворюються командами." }
> ```
> Синє й зелене — те, з чим ти працюєш щодня. Червоне — службове.

### 🛣️ Як файли стають адресами

Правило App Router, коротко: **папка всередині `app/` — шматок адреси, а файл `page.tsx` робить його сторінкою.** Усі інші файли в `app/` адресами не стають — їх можна тримати поруч зі сторінкою. Детально, з layouts і вкладеними маршрутами, — у [[Next.js Start - 07. Сторінки й layouts]].

З `public/` інакше: кожен файл віддається **з кореня сайту**, без слова `public` в адресі. Картинку `public/next.svg` браузер отримає за `/next.svg`, а за `/public/next.svg` буде 404.

> [!quiz] Перевір себе: які адреси відкриються?
> level: junior · type: output · id: nextjs-start-06-quiz-03
>
> ```text
> app/page.tsx
> app/blog/page.tsx
> app/components/button.tsx
> public/next.svg
> ```
>
> Ти запускаєш застосунок і по черзі відкриваєш `/`, `/blog`, `/components/button`, `/next.svg`, `/public/next.svg`. Які з них повернуть сторінку чи файл (а не 404)?
>
> - [x] `/`, `/blog`, `/next.svg`
> - [ ] `/`, `/blog`, `/components/button`, `/next.svg`
> - [ ] `/`, `/blog`, `/public/next.svg`
> - [ ] Усі пʼять
>
> **Пояснення:** `page.tsx` у корені `app/` дає `/`, у папці `blog/` — `/blog`. `button.tsx` — звичайний модуль: без `page.tsx` адреси немає. Файли з `public/` доступні з кореня, тому `/next.svg` працює, а `/public/next.svg` — ні.

### 📜 package.json і скрипти

`package.json` — паспорт проєкту. Ось що в ньому одразу після генератора:

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.3.8",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.8",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

**`dependencies`** — пакети, потрібні застосунку під час роботи: сам Next.js і React. **`devDependencies`** — інструменти розробки: TypeScript, лінтер, Tailwind і типи. Значок `^` означає «ця версія або новіша в межах тієї самої головної»: `^5` дозволяє `5.9`, але не `6.0`.

**`scripts`** — короткі імена для команд. `npm run dev` виконує те, що записано в `"dev"`, тобто `next dev`. Для `start` і `test` npm має скорочення без `run`: `npm start`. Скриптів чотири:

- `dev` → `next dev` — сервер для розробки;
- `build` → `next build` — продакшн-збірка;
- `start` → `next start` — продакшн-сервер з готової збірки;
- `lint` → `eslint` — перевірка коду лінтером.

Щоб передати команді **прапорець**, став `--` між скриптом і прапорцями: `npm run dev -- -p 4000` запускає `next dev -p 4000` (порт 4000 замість 3000). Без `--` npm забирає прапорець собі, і до Next.js доходить не те, що ти чекав (див. ⚠️ Пастки).

> [!quiz] Перевір себе: заповни скрипти
> level: junior · type: fill · bank: next export, next serve · id: nextjs-start-06-quiz-04
>
> ```json fill
> {
>   "scripts": {
>     "dev": "next [[dev]]",
>     "build": "[[next build]]",
>     "start": "next [[start]]",
>     "lint": "eslint"
>   }
> }
> ```
>
> **Пояснення:** три команди Next.js — `dev`, `build` і `start`. `next export` прибрали ще в Next.js 14: статичний експорт тепер вмикається налаштуванням `output: 'export'`. Команди `next serve` не існує.

### 🔥 next dev — сервер для розробки

Запусти `npm run dev`. Термінал покаже:

```text
▲ Next.js 16.3.8 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.0.222:3000
✓ Ready in 1546ms
✓ Running next.config.ts took 79ms
- Cache Components enabled

○ Compiling / ...
 GET / 200 in 6.3s (next.js: 6.2s, application-code: 96ms)
```

`Local` — адреса для тебе, `Network` — для інших пристроїв у твоїй мережі (наприклад, телефона на тому ж Wi-Fi). `(Turbopack)` — бандлер, про який ти читав у темі 05. Останні рядки зʼявилися, коли ти відкрив `http://localhost:3000`: dev-сервер скомпілював сторінку й записав запит (рядок `Compiling` буває не завжди).

Тепер зміни текст в `app/page.tsx` і збережи файл. Браузер оновить сторінку сам, за частку секунди, і навіть зберігає стан компонентів, де може. Ця функція називається **Fast Refresh** (або HMR, hot module replacement — «гаряча заміна модулів»). Саме тому `next dev` — режим, у якому ти проводиш 95 % часу.

Рядок `GET / 200 in 6.3s …` — метод, адреса, статус (тема 01) і час. Перший запит до сторінки повільніший — Turbopack компілює її **на вимогу**, лише коли ти її відкрив; якщо компіляція затягується, може зʼявитися рядок `○ Compiling / ...`. Наступні запити набагато швидші. Результати dev-збірки лежать у `.next/dev`, тож `next dev` і `next build` не заважають одне одному.

Важливо: `next dev` **не перевіряє типи** TypeScript. Сторінка з помилкою типу відкриється без проблем — і впаде лише на збірці. Помилки типів підсвічує редактор, а остаточно ловить `next build`. Зупинити сервер — `Ctrl + C` у терміналі.

### 🏗️ next build — продакшн-збірка

`npm run build` готує застосунок до реальних користувачів: бандлить і мінімізує код, перевіряє типи, **пререндерить** усе, що можна, і записує результат у `.next/`. Вивід свіжого проєкту з `cacheComponents: true`:

```text
▲ Next.js 16.3.8 (Turbopack)
✓ Running next.config.ts took 213ms
- Cache Components enabled

  Creating an optimized production build ...
✓ Compiled successfully in 10.1s
  Running TypeScript ...
  Finished TypeScript in 2.3s ...
  Collecting page data using 5 workers ...
  Generating static pages using 5 workers (0/4) ...
✓ Generating static pages using 5 workers (4/4) in 292ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
└ ○ /_not-found


○  (Static)  prerendered as static content
```

Якщо в коді помилка типу, збірка зупиниться на кроці `Running TypeScript` з точним місцем:

```text
app/about/page.tsx(3,9): error TS2322: Type 'string' is not assignable to type 'number'.
Failed to type check.
```

`(3,9)` — рядок 3, символ 9. Лінтер `next build` у 16 **не запускає** — для нього є окремий `npm run lint`.

### 📊 Читаємо таблицю маршрутів

Таблиця `Route (app)` наприкінці збірки показує, **як буде віддаватися кожна адреса**. Значок зліва — головне:

| Значок | Назва | Що означає |
|---|---|---|
| `○` | Static | сторінку повністю відрендерено під час збірки, сервер на запит нічого не рендерить |
| `◐` | Partial Prerender | статичну оболонку зібрано заздалегідь, динамічні шматки стрімляться на запит |
| `ƒ` | Dynamic | рендериться на сервері на кожен запит |

`/_not-found` — службова сторінка 404, вона є завжди. Ось таблиця проєкту з кількома видами маршрутів, теж з `cacheComponents: true`:

```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ○ /api/hello
├ ƒ /api/me
├ ○ /blog
├   /blog/[slug]
│ ├ ◐ /blog/[slug]
│ ├ ○ /blog/hello
│ └ ○ /blog/world
└ ◐ /dashboard


ƒ Proxy (Middleware)

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand
```

Що тут видно, без деталей, які чекають у наступних темах:

- `/`, `/about`, `/blog` — звичайні сторінки без даних запиту: `○`.
- `/dashboard` читає cookie всередині `<Suspense>` (як у темі 05): оболонка готова, привітання стрімиться — `◐`.
- `/blog/[slug]` — **динамічний маршрут** (одна сторінка на багато адрес, тема 08). Дві статті, `hello` і `world`, зібрані заздалегідь (`○`), а `◐ /blog/[slug]` — заготовка для решти адрес.
- `/api/hello` і `/api/me` — Route Handlers, «адреси-API», що повертають JSON. `/api/me` читає заголовки запиту, тож рендериться щоразу: `ƒ`.
- `ƒ Proxy (Middleware)` — у проєкті є `proxy.ts`, він працює на кожен запит.

Без `cacheComponents` таблиця виглядає трохи інакше: замість `◐` сторінки, що читають дані запиту, стають цілком `ƒ`; навіть простий `GET` у `/api/hello` стає `ƒ`; статті з `generateStaticParams` позначаються `●` (SSG), а рядка-заготовки `◐ /blog/[slug]` немає зовсім. Якщо в чужому проєкті бачиш `●` — це ознака, що Cache Components там вимкнені.

> [!quiz] Перевір себе: як віддається кожна адреса?
> level: junior · type: output · id: nextjs-start-06-quiz-05
>
> ```text
> Route (app)
> ┌ ○ /
> ├ ○ /_not-found
> ├ ◐ /account
> ├ ƒ /api/me
> └ ○ /pricing
> ```
>
> Яка адреса рендериться на сервері **повністю** на кожен запит?
>
> - [x] `/api/me`
> - [ ] `/account`
> - [ ] `/pricing`
> - [ ] Жодна: усе зібрано під час `next build`
>
> **Пояснення:** `ƒ` (Dynamic) — рендер на кожен запит. `/account` з `◐` має готову оболонку, а на запит стрімить лише динамічні шматки. `/pricing` і `/` з `○` повністю статичні, як і службова `/_not-found`.

### ▶️ next start — продакшн-сервер

`npm start` запускає `next start`: сервер, що віддає **готову** збірку з `.next/`. Нічого не компілює, Fast Refresh не має, код не стежить за змінами. Це режим для реальних користувачів — і для тебе, коли хочеш перевірити, як сайт поводиться «по-справжньому».

```text
▲ Next.js 16.3.8
- Local:         http://localhost:3000
- Network:       http://192.168.0.222:3000
✓ Ready in 80ms
✓ Running next.config.ts took 19ms
```

Без попереднього `next build` він не стартує — ти бачив це в 🤔 Передбач. А змінив код — збирай знову: `next start` показує ту збірку, яку зробили останньою.

> [!quiz] Перевір себе: склади шлях від нуля до продакшн-сервера
> level: junior · type: order · id: nextjs-start-06-quiz-06
>
> ```order
> npx create-next-app@16.3.8 my-app
> cd my-app
> Додати cacheComponents: true у next.config.ts
> npm run dev — писати код і дивитися в браузер
> npm run build — зібрати й перевірити типи
> npm start — запустити готову збірку
> npm start перед npm run build, щоб прискорити збірку ✗
> ```
>
> **Пояснення:** проєкт створюють один раз, потім заходять у його папку й налаштовують конфіг. Далі цикл: розробка в `dev`, збірка в `build`, запуск збірки в `start`. `start` без `build` не працює взагалі — йому нема що запускати.

### 🙈 .gitignore і змінні середовища

**Git** — система контролю версій, що зберігає історію твого коду (у темі 12 ти завантажиш проєкт на GitHub). Файл `.gitignore` каже Git, що **не** зберігати. У шаблоні Next.js там, серед іншого:

```text
# dependencies
/node_modules

# next.js
/.next/
/out/

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

Логіка проста: не зберігай те, що можна відтворити (`node_modules/` — командою `npm install`, `.next/` — збіркою, `next-env.d.ts` Next.js генерує сам), і не зберігай **секрети**.

Секрети й налаштування, що відрізняються між твоїм компʼютером і сервером, живуть у **змінних середовища** (environment variables) — парах `НАЗВА=значення` у файлах `.env*` у корені проєкту. Next.js сам читає `.env`, `.env.local`, `.env.development` (для `next dev`) і `.env.production` (для `next build` і `next start`). Особисті значення клади в `.env.local`. Що Next.js його побачив, видно в терміналі: `- Environments: .env.local`. У коді на сервері значення доступне як `process.env.НАЗВА`. Змінні з префіксом `NEXT_PUBLIC_` Next.js під час збірки вшиває в код для браузера, тож **жодних секретів з цим префіксом**. Шаблон ігнорує всі `.env*`, тому випадково закомітити ключ складно. Детальніше — у [[Next.js Start - 12. Перший деплой на Vercel]].

> [!quiz] Перевір себе: що з цього Git не збереже в шаблоні Next.js?
> level: junior · type: multi · id: nextjs-start-06-quiz-07
> - [x] `node_modules/`
> - [x] `.next/`
> - [x] `.env.local`
> - [x] `next-env.d.ts`
> - [ ] `package-lock.json`
> - [ ] `next.config.ts`
> - [ ] `public/next.svg`
>
> **Пояснення:** ігноруються пакети, результати збірки, згенеровані типи й усі `.env*`-файли. А `package-lock.json` якраз треба зберігати: він фіксує точні версії пакетів, щоб у колеги й на сервері встановилося те саме. Конфіг і файли з `public/` — частина твого застосунку.

### 🤖 AGENTS.md і документація всередині проєкту

`AGENTS.md` — інструкція для AI-помічників (Claude Code, Cursor, Copilot та інших), які пишуть код у твоєму проєкті. Головна думка всередині — заголовок `This is NOT the Next.js you know`: «у цій версії є зміни, яких немає в твоїх тренувальних даних». Далі файл просить агента читати документацію з `node_modules/next/dist/docs/`. Так, **документація Next.js лежить прямо в проєкті** — для тієї версії, яку ти встановив. `CLAUDE.md` містить один рядок `@AGENTS.md` — посилання на той самий файл для Claude Code.

Блок між `<!-- BEGIN:nextjs-agent-rules -->` і `<!-- END:nextjs-agent-rules -->` веде `next dev` і додає його назад, якщо видалити. Свої правила для агента пиши нижче цього блоку. А документацію в `node_modules/next/dist/docs/` корисно відкривати й самому: там ті самі сторінки, що на nextjs.org, але точно твоєї версії.

> [!quiz] Перевір себе: навіщо AGENTS.md у новому проєкті?
> level: junior · id: nextjs-start-06-quiz-08
> - [x] Підказує AI-помічникам читати документацію встановленої версії з `node_modules/next/dist/docs/`
> - [ ] Налаштовує Next.js замість `next.config.ts`
> - [ ] Вмикає автоматичне виправлення коду під час `next build`
> - [ ] Його читає ESLint, щоб знати правила проєкту
>
> **Пояснення:** `AGENTS.md` — звичайний текст для AI-агентів. Next.js 16 швидко змінюється, і модель, навчена на старих статтях, напише `middleware.ts` чи `getServerSideProps`. Посилання на локальну документацію тримає агента на твоїй версії. На збірку й лінтер файл не впливає.

### 🏭 Як це роблять у продакшні

- **Версія зафіксована.** `next` у `package.json` без `^` (генератор так і робить), `package-lock.json` закомічений, а встановлення в CI — `npm ci`: рівно ті версії, що в lock-файлі.
- **`npm run build` перед кожним пушем** або в CI на кожен pull request: збірка ловить помилки типів і пререндеру, яких `next dev` не показує.
- **Таблицю маршрутів читають на code review:** сторінка, що несподівано стала `ƒ` замість `○` чи `◐`, — сигнал, що хтось прочитав дані запиту не там.
- **`.env.example`** без справжніх значень лежить у репозиторії як список потрібних змінних; справжні значення — у `.env.local` і в налаштуваннях хостингу.

## ⚠️ Пастки

> [!pitfall] npm start без npm run build
> `next start` лише запускає готову збірку. Немає `.next/` з продакшн-збіркою — є помилка `Could not find a production build in the '.next' directory`. Змінив код — збери знову.

> [!pitfall] Прапорець без --
> npm забирає прапорці собі, якщо не поставити `--`. На npm 11 `npm run dev -p 4000` запускає `next dev 4000` — і Next.js шукає **папку** `4000`:
>
> ```text
> > next dev 4000
>
> Invalid project directory provided, no such directory: /Users/olya/projects/my-app/4000
> ```
>
> Правильно: `npm run dev -- -p 4000`.

> [!pitfall] У next dev працює, у next build — ні
> `next dev` не перевіряє типи, тож сторінка з помилкою TypeScript відкривається. `next build` зупиняється з `Failed to type check.` Запускай збірку регулярно, а не лише перед деплоєм.

> [!pitfall] Видалив сторінку — збірка падає з дивною помилкою
> Якщо видалити сторінку, яку ти відкривав у `next dev`, наступний `next build` на 16.3.8 може впасти на згенерованих типах:
>
> ```text
> .next/dev/types/validator.ts(42,39): error TS2307: Cannot find module '../../../app/about/page.js' or its corresponding type declarations.
> ```
>
> Шлях `.next/dev/…` підказує: проблема не в твоєму коді, а в застарілих файлах dev-сервера. Зупини `next dev`, видали папку `.next` (`rm -rf .next`) і збери знову.

> [!pitfall] @latest замість версії курсу
> `npx create-next-app@latest` поставить найновіший Next.js, і приклади курсу можуть поводитися інакше. Поки вчишся за курсом — `npx create-next-app@16.3.8`.

## 🔗 Звʼязки

- [[Next.js Start - 05. Що таке Next.js і навіщо фреймворк]] — Turbopack, Cache Components і що означають «статичне» й «динамічне».
- [[Next.js Start - 04. TypeScript-мінімум для Next.js]] — як читати помилки TS, що зупиняють `next build`.
- [[Next.js Start - 07. Сторінки й layouts]] — наступний крок: перші сторінки, root layout і вкладені маршрути.
- [[Next.js Start - 09. Стилі, Tailwind CSS і CSS Modules]] — що генератор уже налаштував для Tailwind.
- [[Next.js Start - 12. Перший деплой на Vercel]] — Git, змінні середовища і збірка на сервері.

## ⚡ Фішки

> [!reel] 🍳 dev, build, start — тестова кухня, заготовка, відчинений зал
> `next dev` — швидкі зміни з Fast Refresh. `next build` — готує все заздалегідь і перевіряє типи. `next start` — віддає готове. Без `build` нема що віддавати.

> [!reel] 📊 ○ ◐ ƒ — читай таблицю маршрутів
> `○` — зібрано повністю під час збірки, `◐` — оболонка готова, решта стрімиться, `ƒ` — рендер на кожен запит. Неочікуваний `ƒ` — привід перевірити код.

> [!reel] ➖➖ Два дефіси для прапорців
> `npm run dev -- -p 4000`. Без `--` npm забере прапорець собі, і Next.js отримає щось зовсім інше.

> [!reel] 📚 Документація лежить у node_modules
> `node_modules/next/dist/docs/` — офіційна документація рівно твоєї версії. `AGENTS.md` відсилає туди AI-помічників, і тобі туди варто зазирати.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Як створити новий проєкт Next.js для курсу?
> *дуже часто · практика* · `nextjs-start-06-card-01`
>
> `npx create-next-app@16.3.8`, назва проєкту, `Yes, use recommended defaults`. Потім `cd my-app` і `cacheComponents: true` у `next.config.ts`. Для швидкого старту без питань — прапорець `--yes`.
>
> 📚 [[Next.js Start - 06. Перший проєкт, create-next-app і структура#🚀 Крок 1. Створюємо проєкт|Розділ: створюємо проєкт]] · [Next.js: Installation](https://nextjs.org/docs/app/getting-started/installation)

> [!question]- Чим відрізняються next dev, next build і next start?
> *дуже часто · порівняння* · `nextjs-start-06-card-02`
>
> `next dev` — сервер для розробки з Fast Refresh, компілює сторінки на вимогу, не перевіряє типи. `next build` — продакшн-збірка: бандлинг, перевірка типів, пререндер, результат у `.next/`. `next start` — продакшн-сервер, що віддає готову збірку; без `build` не стартує.
>
> 📚 [[Next.js Start - 06. Перший проєкт, create-next-app і структура#📜 package.json і скрипти|Розділ: скрипти]] · [Next.js: next CLI](https://nextjs.org/docs/app/api-reference/cli/next)

> [!question]- Що лежить у папках app/ і public/?
> *часто · теорія* · `nextjs-start-06-card-03`
>
> `app/` — App Router: сторінки (`page.tsx`), layouts і файли поруч з ними; адресу дає лише `page.tsx`. `public/` — статичні файли, що віддаються з кореня сайту: `public/next.svg` → `/next.svg`.
>
> 📚 [[Next.js Start - 06. Перший проєкт, create-next-app і структура#🗂️ Що всередині проєкту|Розділ: що всередині]] · [Next.js: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)

> [!question]- Як передати прапорець команді через npm run?
> *часто · практика* · `nextjs-start-06-card-04`
>
> Через `--`: `npm run dev -- -p 4000` → `next dev -p 4000`. Без `--` npm забирає прапорець собі, і до Next.js доходить лише значення (`next dev 4000` — шукає папку `4000`).
>
> 📚 [[Next.js Start - 06. Перший проєкт, create-next-app і структура#📜 package.json і скрипти|Розділ: скрипти]] · [Next.js: next CLI](https://nextjs.org/docs/app/api-reference/cli/next)

> [!question]- Що означають ○, ◐ і ƒ у виводі next build?
> *дуже часто · теорія* · `nextjs-start-06-card-05`
>
> `○` Static — сторінку повністю зібрано під час збірки. `◐` Partial Prerender — статична оболонка готова, динамічні шматки стрімляться на запит. `ƒ` Dynamic — рендер на сервері на кожен запит. Без Cache Components ще трапляється `●` (SSG).
>
> 📚 [[Next.js Start - 06. Перший проєкт, create-next-app і структура#📊 Читаємо таблицю маршрутів|Розділ: таблиця маршрутів]] · [Next.js: Building your application](https://nextjs.org/docs/app/guides/building)

> [!question]- Що не потрапляє в Git у проєкті Next.js і чому?
> *часто · практика* · `nextjs-start-06-card-06`
>
> `node_modules/`, `.next/`, `next-env.d.ts` — їх відтворюють команди (`npm install`, збірка). Усі `.env*` — там секрети. А `package-lock.json` зберігають: він фіксує точні версії пакетів.
>
> 📚 [[Next.js Start - 06. Перший проєкт, create-next-app і структура#🙈 .gitignore і змінні середовища|Розділ: .gitignore]] · [Next.js: Environment Variables](https://nextjs.org/docs/app/guides/environment-variables)

### 🟡 Middle

> [!question]- Чому сторінка з помилкою типу працює в next dev, але ламає next build?
> *часто · налагодження* · `nextjs-start-06-card-07`
>
> `next dev` компілює TypeScript без перевірки типів, щоб бути швидким. `next build` запускає перевірку (`Running TypeScript`) і зупиняється з `Failed to type check.` Тому збірку запускають регулярно або в CI на кожен pull request.
>
> 📚 [[Next.js Start - 06. Перший проєкт, create-next-app і структура#🏗️ next build — продакшн-збірка|Розділ: next build]] · [Next.js: TypeScript](https://nextjs.org/docs/app/api-reference/config/typescript)

> [!question]- Навіщо в проєкті AGENTS.md і що робить next dev з його блоком?
> *іноді · теорія* · `nextjs-start-06-card-08`
>
> `AGENTS.md` каже AI-агентам читати документацію встановленої версії з `node_modules/next/dist/docs/`, а не покладатися на тренувальні дані. Блок `nextjs-agent-rules` веде `next dev` і відновлює, якщо його видалити; свої правила додають поза ним. `CLAUDE.md` посилається на нього рядком `@AGENTS.md`.
>
> 📚 [[Next.js Start - 06. Перший проєкт, create-next-app і структура#🤖 AGENTS.md і документація всередині проєкту|Розділ: AGENTS.md]] · [Next.js: AI Coding Agents](https://nextjs.org/docs/app/guides/ai-agents)

> [!question]- Як Next.js вирішує, які .env-файли читати?
> *іноді · теорія* · `nextjs-start-06-card-09`
>
> `.env` — завжди, `.env.local` — особисті значення, `.env.development` — для `next dev`, `.env.production` — для `next build` і `next start`. Прочитані файли видно в терміналі (`- Environments: .env.local`). У браузер потрапляють лише змінні з `NEXT_PUBLIC_`, вшиті під час збірки.
>
> 📚 [[Next.js Start - 06. Перший проєкт, create-next-app і структура#🙈 .gitignore і змінні середовища|Розділ: змінні середовища]] · [Next.js: Environment Variables](https://nextjs.org/docs/app/guides/environment-variables)

## 🛠️ Практика

> [!task] Розклади маршрути з виводу next build
> level: junior · difficulty: easy · id: nextjs-start-06-task-01 · tags: build, routes, static, dynamic
>
> Напиши `classifyRoutes(output)`: функція отримує текст таблиці маршрутів і повертає обʼєкт з чотирма масивами адрес у порядку появи — `static` (`○`), `partial` (`◐`), `ssg` (`●`) і `dynamic` (`ƒ`).
>
> - Рядок маршруту: спершу символи дерева (`┌ ├ └ │` і пробіли), потім значок, пробіл і адреса, що починається з `/`.
> - Рядки без значка (`├   /blog/[slug]` — заголовок групи) пропускай.
> - Легенду (`○  (Static) …`) і `ƒ Proxy (Middleware)` теж пропускай: у них немає адреси.
>
> ```ts starter
> type Routes = { static: string[]; partial: string[]; ssg: string[]; dynamic: string[] }
>
> function classifyRoutes(output: string): Routes {
>   const result: Routes = { static: [], partial: [], ssg: [], dynamic: [] }
>   for (const line of output.split('\n')) {
>     // ❌ дивиться лише на перший символ рядка
>     if (line.startsWith('○')) result.static.push(line)
>   }
>   return result
> }
> ```
>
> ```ts tests
> const output = [
>   'Route (app)',
>   '┌ ○ /',
>   '├ ○ /_not-found',
>   '├ ƒ /api/me',
>   '├   /blog/[slug]',
>   '│ ├ ◐ /blog/[slug]',
>   '│ ├ ○ /blog/hello',
>   '│ └ ○ /blog/world',
>   '└ ◐ /dashboard',
>   '',
>   '',
>   'ƒ Proxy (Middleware)',
>   '',
>   '○  (Static)             prerendered as static content',
>   '◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content',
>   'ƒ  (Dynamic)            server-rendered on demand',
> ].join('\n')
>
> test('статичні адреси в порядку появи', () => {
>   expect(classifyRoutes(output).static).toEqual(['/', '/_not-found', '/blog/hello', '/blog/world'])
> })
>
> test('частковий пререндер, зокрема вкладений у групу', () => {
>   expect(classifyRoutes(output).partial).toEqual(['/blog/[slug]', '/dashboard'])
> })
>
> test('динамічні адреси без Proxy і легенди', () => {
>   expect(classifyRoutes(output).dynamic).toEqual(['/api/me'])
> })
>
> test('збірка без Cache Components: ● потрапляє в ssg', () => {
>   const old = ['Route (app)', '┌ ○ /', '├   /blog/[slug]', '│ ├ ● /blog/hello', '│ └ ● /blog/world', '└ ƒ /dashboard'].join('\n')
>   expect(classifyRoutes(old)).toEqual({
>     static: ['/'],
>     partial: [],
>     ssg: ['/blog/hello', '/blog/world'],
>     dynamic: ['/dashboard'],
>   })
> })
>
> test('порожній вивід — порожні масиви', () => {
>   expect(classifyRoutes('')).toEqual({ static: [], partial: [], ssg: [], dynamic: [] })
> })
> ```
>
> > [!hint]- Підказка 1
> > Один регулярний вираз на рядок: `/^[┌├└│\s]*([○◐●ƒ]) (\/\S*)/`. Перша група — значок, друга — адреса.
>
> > [!hint]- Підказка 2
> > Зроби словник «значок → ключ»: `{ '○': 'static', '◐': 'partial', '●': 'ssg', 'ƒ': 'dynamic' }`. Рядки, що не збіглися з виразом, просто пропускай.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function classifyRoutes(output: string): Routes {
> >   const result: Routes = { static: [], partial: [], ssg: [], dynamic: [] }
> >   const kinds: Record<string, keyof Routes> = { '○': 'static', '◐': 'partial', '●': 'ssg', 'ƒ': 'dynamic' }
> >   for (const line of output.split('\n')) {
> >     const match = /^[┌├└│\s]*([○◐●ƒ]) (\/\S*)/.exec(line)
> >     if (match) result[kinds[match[1]]].push(match[2])
> >   }
> >   return result
> > }
> > ```
> >
> > Адреса завжди починається з `/` — це й відсікає легенду (`○  (Static)`) і `ƒ Proxy (Middleware)`. Заголовок групи `├   /blog/[slug]` не має значка, тож теж не проходить. Такий скрипт можна запускати в CI після `next build`, щоб помітити сторінку, яка несподівано стала `ƒ`.

> [!task] Що насправді запустить npm run
> level: junior · difficulty: medium · id: nextjs-start-06-task-02 · tags: npm, scripts, cli
>
> Напиши `npmRun(scripts, args)` — спрощену модель того, як npm 11 перетворює команду на рядок для запуску. `scripts` — обʼєкт зі `scripts` у `package.json`, `args` — слова після `npm`. Поверни команду, яку npm виконає:
>
> - `['run', назва, ...решта]` — скрипт `назва`; `['start', ...решта]` і `['test', ...решта]` — скорочення для `run start` і `run test`;
> - у `решті` до першого `--` слова, що починаються з `-`, npm забирає собі (відкидає), а інші передає скрипту; усе після `--` передається як є, без самого `--`;
> - передані слова додаються до команди скрипту через пробіл;
> - немає такого скрипту — кинь `Error` з текстом `Missing script: "назва"` (так пише npm).
>
> ```ts starter
> type Scripts = Record<string, string>
>
> function npmRun(scripts: Scripts, args: string[]): string {
>   // ❌ просто склеює все, що після назви скрипту
>   const [, name, ...rest] = args
>   return [scripts[name], ...rest].join(' ')
> }
> ```
>
> ```ts tests
> const scripts = { dev: 'next dev', build: 'next build', start: 'next start', lint: 'eslint' }
>
> test('npm run dev — команда зі scripts', () => {
>   expect(npmRun(scripts, ['run', 'dev'])).toBe('next dev')
> })
>
> test('npm start — скорочення без run', () => {
>   expect(npmRun(scripts, ['start'])).toBe('next start')
> })
>
> test('прапорець після -- доходить до Next.js', () => {
>   expect(npmRun(scripts, ['run', 'dev', '--', '-p', '4000'])).toBe('next dev -p 4000')
>   expect(npmRun(scripts, ['start', '--', '--port', '4000'])).toBe('next start --port 4000')
> })
>
> test('прапорець без -- npm забирає собі', () => {
>   expect(npmRun(scripts, ['run', 'dev', '-p', '4000'])).toBe('next dev 4000')
>   expect(npmRun(scripts, ['run', 'dev', '--turbopack'])).toBe('next dev')
> })
>
> test('немає скрипту — помилка як у npm', () => {
>   expect(() => npmRun(scripts, ['run', 'deploy'])).toThrow('Missing script: "deploy"')
>   expect(() => npmRun({ dev: 'next dev' }, ['test'])).toThrow('Missing script: "test"')
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу визнач назву й решту: якщо `args[0] === 'run'`, назва — `args[1]`, решта — з `args[2]`; інакше назва — `args[0]`, решта — з `args[1]`.
>
> > [!hint]- Підказка 2
> > Знайди `rest.indexOf('--')`. Слова до нього відфільтруй (`!w.startsWith('-')`), а після нього візьми всі.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function npmRun(scripts: Scripts, args: string[]): string {
> >   const isRun = args[0] === 'run'
> >   const name = isRun ? args[1] : args[0]
> >   const rest = args.slice(isRun ? 2 : 1)
> >
> >   const command = scripts[name]
> >   if (command === undefined) throw new Error(`Missing script: "${name}"`)
> >
> >   const sep = rest.indexOf('--')
> >   const before = sep === -1 ? rest : rest.slice(0, sep)
> >   const after = sep === -1 ? [] : rest.slice(sep + 1)
> >   const passed = [...before.filter((w) => !w.startsWith('-')), ...after]
> >
> >   return [command, ...passed].join(' ')
> > }
> > ```
> >
> > Тест `-p 4000` → `next dev 4000` — не вигадка: саме так поводиться npm 11, і Next.js тоді шукає папку проєкту `4000`. Модель спрощена: справжній npm знає, які свої прапорці чекають значення, але для типових помилок цього правила досить. У pnpm, yarn і bun `--` не потрібен — вони передають прапорці скрипту самі.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Installation](https://nextjs.org/docs/app/getting-started/installation) — `create-next-app`, вимоги до Node.js, скрипти й TypeScript.
- 🟢 [Next.js — Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) — усі файли й папки верхнього рівня та файли маршрутів.
- 🟢 [Next.js — create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) — питання й прапорці генератора.
- 🟡 [Next.js — next CLI](https://nextjs.org/docs/app/api-reference/cli/next) — `dev`, `build`, `start` і їхні опції.
- 🟡 [Next.js — Building your application](https://nextjs.org/docs/app/guides/building) — що робить `next build` і як читати таблицю маршрутів.
- 🟡 [Next.js — Environment Variables](https://nextjs.org/docs/app/guides/environment-variables) — `.env*`-файли, порядок завантаження й `NEXT_PUBLIC_`.
- 🟡 [Next.js — Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) — бандлер за замовчуванням і коли потрібен `--webpack`.
- 🛠️ [Next.js — AI Coding Agents](https://nextjs.org/docs/app/guides/ai-agents) — `AGENTS.md` і документація в `node_modules`.
- 🛠️ [npm Docs — npm run](https://docs.npmjs.com/cli/v11/commands/npm-run) — скрипти й передача аргументів через `--`.

> [!important] Підсумок
> - Проєкт створює `npx create-next-app@16.3.8` з рекомендованими налаштуваннями: TypeScript, ESLint, Tailwind CSS, App Router, `AGENTS.md`. Для курсу додай `cacheComponents: true` у `next.config.ts`.
> - `app/` — сторінки (адресу дає `page.tsx`), `public/` — файли з кореня сайту, `package.json` — скрипти й залежності, `tsconfig.json` — TypeScript з псевдонімом `@/*`.
> - `next dev` — розробка з Fast Refresh, без перевірки типів; `next build` — збірка з перевіркою типів і пререндером; `next start` — запуск готової збірки.
> - Таблиця маршрутів: `○` статично, `◐` оболонка + стрімінг, `ƒ` на кожен запит. Прапорці через npm — після `--`.
> - Git не зберігає `node_modules/`, `.next/` і `.env*`; секрети — у `.env.local`, у браузер потрапляють лише `NEXT_PUBLIC_*`.
