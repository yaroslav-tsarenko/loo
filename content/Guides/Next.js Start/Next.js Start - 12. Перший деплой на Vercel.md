---
title: Перший деплой на Vercel
id: nextjs-start-12
slug: 12-first-deploy
order: 12
level: noob
skill: deploy-ops
icon: px:rocket
tags: [nextjs, vercel, deploy, preview, env, next-public, logs, domain]
prerequisites:
  - "[[Next.js Start - 11. Перша форма і Server Action]]"
estimatedMinutes: 35
nextVersion: 16.3.8
---

# Перший деплой на Vercel

> [!success] 🎯 Після цього розділу ти зможеш
> - відтворити продакшн у себе: `next build && next start`, і зрозуміти, чим він відрізняється від `next dev`;
> - підключити Git-репозиторій до Vercel і пояснити, звідки беруться preview- і production-деплої;
> - додати змінні середовища в дашборді й передбачити, що побачить браузер, а що лишиться на сервері (`NEXT_PUBLIC_`);
> - знайти помилку в логах збірки (build logs) або в логах виконання (runtime logs);
> - підключити свій домен і пройти чекліст перед тим, як ділитися посиланням.

## 🤔 Передбач

> [!quiz] Що покаже сайт після зміни змінної?
> level: junior · type: output · id: nextjs-start-12-quiz-01
>
> Сайт задеплоєно на Vercel. У дашборді є `NEXT_PUBLIC_API_URL=https://old.example.com`, і Client Component показує це значення. Ти міняєш його на `https://new.example.com`, зберігаєш і **нічого не передеплоюєш**. Що побачить користувач?
>
> ```tsx
> 'use client'
> export function ApiInfo() {
>   return <p>API: {process.env.NEXT_PUBLIC_API_URL}</p>
> }
> ```
>
> - [x] `API: https://old.example.com` — нове значення потрапить лише в наступний деплой
> - [ ] `API: https://new.example.com` — Vercel оновлює змінні миттєво
> - [ ] `API: undefined` — змінна зникла, доки не буде нового деплою
> - [ ] Помилку: сайт не працює, поки змінні не збігаються зі збіркою
>
> **Пояснення:** не переймайся, якщо помилився, — розберемо нижче. Значення `NEXT_PUBLIC_*` Next.js **вшиває в JavaScript під час `next build`**. А Vercel застосовує змінені змінні лише до нових деплоїв. Старий деплой — це вже готова збірка зі старим значенням усередині.

## 🧒 Простими словами

Деплой схожий на видання книжки. Поки пишеш (`next dev`), текст змінюється щохвилини. Віддав у друк (`next build`) — маєш **тираж**, і в ньому вже нічого не виправиш, лише надрукуєш новий. **Сигнальний примірник** для редактора — це preview-деплой, тираж у магазинах — production. Змінна з `NEXT_PUBLIC_` — як текст, надрукований у книжці: його бачить кожен читач. Звичайна змінна лежить у шухляді видавництва.

## 🔬 Як це працює насправді

### 🧪 Спершу — продакшн у себе: next build && next start

**Деплой** — це коли твій застосунок запускається на сервері в інтернеті, і будь-хто може відкрити його за адресою. Перш ніж віддавати код кудись, перевір, що він збирається і працює в **продакшн-режимі** у тебе на компʼютері. У `package.json` для цього вже є скрипти ([[Next.js Start - 06. Перший проєкт, create-next-app і структура|тема Start 06]]):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

`next dev` — режим розробки: сторінки збираються на льоту, на кожен запит, з підказками про помилки. `next build` — **збірка**: Next.js перевіряє типи TypeScript, стискає код і заздалегідь рендерить усе, що можна відрендерити наперед. `next start` — запускає готову збірку так, як її запустить сервер. Тож продакшн у себе — це дві команди:

```bash
npm run build && npm start
```

Збірка закінчується таблицею маршрутів. Навчися її читати — у Vercel ти побачиш ту саму таблицю в логах:

```text
▲ Next.js 16.3.8 (Turbopack)
- Cache Components enabled

  Creating an optimized production build ...
✓ Compiled successfully in 133ms
  Running TypeScript ...
  Finished TypeScript in 787ms ...
✓ Generating static pages using 5 workers (4/4) in 331ms

Route (app)
┌ ○ /
├ ○ /_not-found
└ ◐ /env-demo

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

`○` — сторінка повністю готова після збірки (статична), `◐` — готова «оболонка» плюс частина, яку сервер дорендерить на запит (тема 12 основного посібника). Для першого деплою досить знати: збірка пройшла, усі маршрути на місці.

Навіщо це локально, якщо Vercel і так збере? Бо **`next dev` пробачає те, що `next build` не пробачить**. Приклад: сторінка з одруківкою `post.titel` замість `post.title` у `next dev` відкривається з кодом 200, а `next build` зупиняється:

```text
  Running TypeScript ...
app/typo/page.tsx(6,20): error TS2551: Property 'titel' does not exist on type 'Post'. Did you mean 'title'?
Failed to type check.
```

Ту саму помилку ти отримаєш на Vercel, лише пізніше і з червоним статусом деплою. Так само з забутим `revalidatePath` з розділу 11: у `next dev` список оновлювався, після `next build` — ні.

Ще дві помилки, які трапляються на першому запуску:

```text
Error: Could not find a production build in the '.next' directory. Try building your app with 'next build' before starting the production server.
```

Це `next start` без `next build`: запускати нічого. А якщо видалив сторінку, яку відкривав у `next dev`, локальна збірка може впасти з `Cannot find module '../../../app/typo/page.js'` у `.next/dev/types/validator.ts` — це залишки режиму розробки. Видали папку `.next` і збери знову. На Vercel такого не буває: збірка починається з чистого клону.

> [!quiz] Перевір себе: заповни скрипти й команду для продакшну у себе
> level: junior · type: fill · bank: next dev, next export · id: nextjs-start-12-quiz-02
>
> ```json fill
> {
>   "scripts": {
>     "dev": "next dev",
>     "build": "[[next build]]",
>     "start": "[[next start]]"
>   }
> }
> ```
>
> **Пояснення:** `build` збирає застосунок (і перевіряє типи), `start` запускає вже готову збірку. Локально — `npm run build && npm start`. `next dev` — режим розробки, він не показує всіх продакшн-проблем.

### 🐙 Git → Vercel: імпорт проєкту

**Vercel** — хостинг від компанії, що розробляє Next.js. Він уміє сам збирати й запускати Next.js-застосунки, тож для першого деплою нічого не треба налаштовувати руками. Це не єдиний варіант: документація Next.js перелічує Node.js-сервер, Docker, статичний експорт і адаптери для інших платформ (тема 43 основного посібника). Але для старту Vercel найпростіший.

Найзручніший шлях — через **Git** (систему контролю версій, де живе історія твого коду). Vercel підтримує GitHub, GitLab, Bitbucket, Azure DevOps і власну Origin. Кроки за документацією Vercel:

1. Запуш проєкт у репозиторій, наприклад на GitHub. Перевір, що `.env*`-файлів там немає: шаблон `create-next-app` уже додає їх у `.gitignore`.
2. У дашборді Vercel натисни **New Project** і вибери репозиторій зі списку (спершу Vercel попросить доступ до твого Git-акаунта).
3. На сторінці налаштувань перевір: назву проєкту, **Framework Preset** (Vercel сам розпізнає Next.js), кореневу папку (якщо застосунок не в корені репозиторію), команди збірки. Тут же можна одразу додати **Environment Variables**.
4. Натисни **Deploy**. Vercel клонує репозиторій, виконає `next build` і покаже логи збірки наживо.

Готово: застосунок отримав адресу на кшталт `my-app.vercel.app`. Відтепер **кожен push** у репозиторій створює новий деплой сам, без жодних команд.

> [!note] Звідки ці факти
> Деталі платформи Vercel (назви кнопок, формати адрес, ліміти) не входять у документацію Next.js. Джерело — [vercel.com/docs](https://vercel.com/docs/git). Дашборд змінюється частіше, ніж Next.js: якщо кнопка називається інакше, шукай за змістом.

> [!quiz] Перевір себе: склади шлях від коду до сайту
> level: junior · type: order · id: nextjs-start-12-quiz-03
>
> ```order
> Локально: npm run build && npm start — збірка проходить
> Push у репозиторій на GitHub
> New Project у Vercel, вибрати репозиторій
> Перевірити Framework Preset і додати змінні середовища
> Deploy: Vercel виконує next build і показує build logs
> Відкрити згенеровану адресу й перевірити сайт
> Скопіювати папку .next на сервер Vercel вручну ✗
> ```
>
> **Пояснення:** Vercel збирає застосунок сам із коду в Git, тож нічого копіювати не треба: і `.next`, і `node_modules` у репозиторій не потрапляють. Локальна збірка — перший крок, щоб не чекати на помилку від Vercel.

### 🌿 Preview і production

У Vercel є два головні середовища (environments): **Production** — сайт, який бачать користувачі, і **Preview** — «чернетки» для перевірки. Яке з них отримає деплой, вирішує гілка Git:

- **Production branch** — одна гілка, з якої йде продакшн. Під час створення проєкту Vercel бере `main`, якщо її немає — `master`, інакше — основну гілку репозиторію. Push або merge у неї → **production-деплой**, і домени продакшну переключаються на нього, щойно він успішно зібрався.
- **Будь-яка інша гілка або pull request** → **preview-деплой**. Його не бачать на основному домені, але в нього є власна адреса.

Один нюанс: **перший деплой нового проєкту — завжди production**, навіть якщо ти імпортував не `main`. Так Vercel одразу дає проєкту продакшн-адресу. Далі все за правилами вище.

Кожен деплой — окрема незмінна збірка зі своєю адресою. Для preview з Git їх дві:

- **адреса коміту** — `<project-name>-<unique-hash>-<scope-slug>.vercel.app`: завжди показує саме цей коміт;
- **адреса гілки** — `<project-name>-git-<branch-name>-<scope-slug>.vercel.app`: завжди показує останній коміт гілки.

Адресу гілки зручно кидати колегам: вона не змінюється після нових комітів. Vercel і сам додає ці посилання коментарем у PR.

Оскільки старі деплої нікуди не зникають, продакшн можна швидко повернути назад. **Instant Rollback** переключає домени на попередній production-деплой без нової збірки (на Hobby — лише на попередній, на Pro — на будь-який, що вже був у продакшні). Змінні середовища при цьому лишаються тими, з якими збирали той деплой.

Ще одне: preview-адреси можна закрити від сторонніх. **Deployment Protection** зі **Standard Protection** захищає всі адреси, крім доменів продакшну; найпростіший метод — **Vercel Authentication** (відкрити може лише той, хто увійшов у Vercel і має доступ). Захист нового проєкту залежить від типових налаштувань команди (**Team Settings → Deployment Protection**, [Vercel: How team default settings apply](https://vercel.com/docs/deployment-protection#how-team-default-settings-apply-to-new-projects)) — перевір **Settings → Deployment Protection** проєкту, перш ніж ділитися preview.

> [!diagram] Push → збірка → preview чи production
> ```yaml
> layout: flow
> nodes:
>   - { id: push, label: "Git", text: "git push", note: "гілка feature/form", tone: gray, icon: "px:monitor" }
>   - { id: build, label: "Vercel · збірка", code: "npm install\nnext build", note: "build logs", tone: blue }
>   - { id: deploy, label: "Vercel · деплой", text: "незмінна збірка", note: "своя адреса", tone: violet }
>   - { id: preview, label: "Preview", text: "my-app-git-feature-form-….vercel.app", tone: yellow }
>   - { id: prod, label: "Production", text: "my-app.vercel.app", note: "лише з main", tone: green }
> edges:
>   - { from: push, to: build, label: "новий коміт" }
>   - { from: build, to: deploy, label: "успіх" }
>   - { from: deploy, to: preview, label: "не main" }
>   - { from: deploy, to: prod, label: "main", dashed: true }
> steps:
>   - { focus: push, note: "Ти пушиш коміт у гілку feature/form. Vercel отримує сигнал від GitHub." }
>   - { move: { from: push, to: build, value: "коміт a1b2c3" }, line: "build:2", note: "Vercel клонує код і виконує next build — так само, як ти локально. Усе, що він пише, — у build logs." }
>   - { move: { from: build, to: deploy, value: ".next" }, note: "Збірка вдалася: зʼявився новий деплой. Він уже ніколи не зміниться — лише буде новий." }
>   - { move: { from: deploy, to: preview, value: "URL гілки" }, note: "Гілка не production, тож це preview: власна адреса, основний домен не змінився." }
>   - { focus: prod, note: "Після merge у main те саме станеться ще раз, але деплой стане production, і домен перейде на нього." }
> ```
> Дивись на крок 3: деплой не оновлюється на місці — кожен коміт дає нову збірку.

> [!quiz] Перевір себе: що станеться після push?
> level: junior · id: nextjs-start-12-quiz-04
>
> Проєкт уже має production-деплой з `main`. Ти пушиш коміт у гілку `feature/login`.
>
> - [x] Vercel створить preview-деплой з власною адресою, а production не зміниться
> - [ ] Vercel оновить production, бо це останній коміт у репозиторії
> - [ ] Нічого: деплої створюються лише з `main`
> - [ ] Vercel створить preview, але лише після ручного натискання Deploy
>
> **Пояснення:** production іде лише з production branch (тут `main`). Будь-яка інша гілка й кожен pull request дають preview — автоматично, з адресою гілки й адресою коміту.

> [!quiz] Перевір себе: обери правдиві твердження про деплої
> level: junior · type: multi · id: nextjs-start-12-quiz-05
>
> - [x] Перший деплой нового проєкту — production, навіть з іншої гілки
> - [x] Адреса гілки показує останній коміт гілки, адреса коміту — саме той коміт
> - [ ] Новий push оновлює файли поточного деплою на місці
> - [x] Instant Rollback повертає попередній production-деплой без нової збірки
> - [ ] Preview-деплой завжди використовує ті самі змінні, що й production
>
> **Пояснення:** кожен деплой незмінний, тому відкат — це просто переключення домену на стару збірку. Змінні середовища для Preview і Production задаються окремо: preview може (і має) ходити в тестову базу, а не в бойову.

### 🔑 Змінні середовища в дашборді

**Змінна середовища** (environment variable) — пара «назва = значення», яка живе поза кодом: адреса бази, ключ API, режим роботи. Локально ти тримаєш їх у `.env.local` (Next.js сам читає `.env*`-файли в `process.env`), а в репозиторій ці файли не потрапляють. Тоді звідки їх візьме Vercel? З дашборду: **Settings → Environment Variables**.

Що варто знати про змінні у Vercel:

- **Для кожної змінної обираєш середовища**: Production, Preview, Development (можна кілька).
- **Тип: Config або Secret.** Secret після збереження вже не прочитати, лише замінити — це для ключів і паролів.
- **Зміни діють лише на нові деплої.** Змінив — зроби redeploy (або новий push). Саме це ловив 🤔 Передбач.
- **Перший деплой збирається з Production-змінними.** Якщо збірці потрібна змінна, а ти додав її лише в Preview, перший деплой її не побачить.
- **Development** — для локальної роботи: `vercel env pull` (команда Vercel CLI) завантажить їх у локальний файл.

Тепер головне правило Next.js. **Звичайні змінні доступні лише на сервері.** Щоб значення потрапило в браузер, назва має починатися з **`NEXT_PUBLIC_`**. Тоді під час `next build` Next.js **замінює** кожне `process.env.NEXT_PUBLIC_…` у коді на саме значення — буквально вписує рядок у JavaScript, який завантажить браузер. Звідси два наслідки:

1. `NEXT_PUBLIC_` — це **публічно**. Будь-хто побачить значення у вихідному коді сторінки. Ключ від бази чи платіжного API з таким префіксом — уже витік.
2. Значення **застигає під час збірки**. Поміняти його на сервері вже не вийде, лише перезібрати.

Перевір це локально. Ось сторінка, що показує одну змінну трьома способами:

```tsx
// app/env-demo/public-banner.tsx
'use client'

export function PublicBanner() {
  // NEXT_PUBLIC_ — значення вшивається в JS під час next build
  return <p id="public">Режим: {process.env.NEXT_PUBLIC_APP_MODE}</p>
}
```

```tsx
// app/env-demo/page.tsx — Server Component
import { Suspense } from 'react'
import { connection } from 'next/server'
import { PublicBanner } from './public-banner'

async function RuntimeValue() {
  await connection() // читати під час запиту, а не під час збірки
  return <p id="runtime">Під час запиту: {process.env.APP_MODE}</p>
}

export default function Page() {
  return (
    <main>
      <PublicBanner />
      <p id="build">Під час збірки: {process.env.APP_MODE}</p>
      <Suspense fallback={<p>…</p>}>
        <RuntimeValue />
      </Suspense>
    </main>
  )
}
```

Збираємо з одними значеннями, а запускаємо з іншими — так само, як буває, коли змінили змінну у Vercel і не перезібрали:

```bash
NEXT_PUBLIC_APP_MODE=build-public APP_MODE=build-server npm run build
NEXT_PUBLIC_APP_MODE=runtime-public APP_MODE=runtime-server npm start
```

`await connection()` — функція з `next/server`, що каже: «цю частину рендери на запит, а не під час збірки». Без неї Server Component на статичній сторінці читає змінну один раз — під час `next build`. `<Suspense>` дає Next.js показати решту сторінки, поки ця частина рендериться (тема 11 основного посібника). Ще один спосіб тримати вміст поза статичною оболонкою — `await io()` з `next/cache` (тема 10 основного посібника); сторінка документації про змінні середовища показує саме `connection()`.

> [!quiz] Що покаже сторінка після npm start?
> level: junior · type: output · id: nextjs-start-12-quiz-06
>
> Застосунок з `app/env-demo` вище зібрали й запустили двома командами з блоку вище. Що буде в трьох рядках сторінки?
>
> - [x] `Режим: build-public` · `Під час збірки: build-server` · `Під час запиту: runtime-server`
> - [ ] `Режим: runtime-public` · `Під час збірки: runtime-server` · `Під час запиту: runtime-server`
> - [ ] `Режим: build-public` · `Під час збірки: runtime-server` · `Під час запиту: runtime-server`
> - [ ] `Режим: undefined` · `Під час збірки: build-server` · `Під час запиту: runtime-server`
>
> **Пояснення:** `NEXT_PUBLIC_APP_MODE` вписано в JS-чанк під час збірки — пошук `build-public` у `.next/static` знайде його. Статична частина сторінки теж відрендерена під час збірки, тож бачить `build-server`. Лише частина після `connection()` рендериться на запит і читає `runtime-server`.

Vercel додає й **системні** змінні, наприклад `VERCEL_ENV` (`production`, `preview` або `development`), — щоб код знав, де працює. Для цього в налаштуваннях має стояти **Enable access to System Environment Variables**.

> [!quiz] Перевір себе: які значення побачить браузер?
> level: junior · type: multi · id: nextjs-start-12-quiz-07
>
> Ці змінні задано в дашборді для Production. Значення яких **може прочитати будь-хто** у вихідному коді сайту, якщо код їх використовує?
>
> - [x] `NEXT_PUBLIC_SITE_NAME`, прочитана в Client Component
> - [x] `NEXT_PUBLIC_STRIPE_SECRET`, прочитана в Client Component
> - [ ] `DATABASE_URL`, прочитана лише в Server Action
> - [ ] `STRIPE_SECRET`, прочитана лише в Server Component, який виводить готовий результат без ключа
>
> **Пояснення:** вирішує префікс, а не назва: `NEXT_PUBLIC_STRIPE_SECRET` усе одно вшиється в JS, і «секрет» у назві його не врятує. Змінні без префікса живуть на сервері, доки ти сам не виведеш їх у HTML. І памʼятай з теми 07 основного посібника: Client Component теж рендериться на сервері, тож непублічна змінна в ньому потрапить у HTML.

### 📜 Логи: збірки й виконання

У Vercel два види логів, і плутати їх — найчастіша помилка новачка.

**Build logs** — логи збірки: вивід `npm install` і `next build` з додатками від Vercel, попередження жовтим, помилки червоним. Відкриваються кнопкою **Build Logs** на картці деплою і зберігаються безстроково. Сюди дивишся, якщо деплой **не зібрався**: помилка TypeScript, відсутній модуль. Якщо production-збірка впала, домен продакшну лишається на попередньому успішному деплої — користувачі нічого не помітять.

**Runtime logs** — логи виконання: усе, що пишуть серверні функції **під час запитів** (`console.log` і `console.error` з Server Components, Server Actions, Route Handlers). Вони в розділі **Logs** у бічній панелі проєкту. Фільтруй за маршрутом, статусом, рівнем (`4xx` — Warning, `5xx` — Error) або вмикай режим Live. Зберігаються недовго: на Hobby — **1 годину**, на Pro — **1 день**.

`console.log` з дії з розділу 11 після `npm start` зʼявлявся в терміналі сервера. На Vercel той самий рядок буде в runtime logs, у записі POST-запиту, а не в консолі браузера.

> [!quiz] Перевір себе: де шукати лог з Server Action?
> level: junior · id: nextjs-start-12-quiz-08
>
> Після деплою форма гостьової книги «нічого не робить». У дії є `console.log('createEntry', name)`. Де подивитися, чи дія взагалі викликається?
>
> - [x] У runtime logs (розділ Logs) — запис POST-запиту на сторінку з цим рядком
> - [ ] У build logs деплою — там видно всі `console.log`
> - [ ] У консолі браузера — дія ж викликається з форми
> - [ ] Ніде: на Vercel `console.log` вимкнено
>
> **Пояснення:** build logs закінчуються разом зі збіркою, а дія виконується пізніше — на запит. Тому її вивід — у runtime logs. Памʼятай про короткий строк зберігання на Hobby: відтвори проблему й одразу дивись логи.

### 🌐 Свій домен

Купи домен у будь-якого реєстратора (або у Vercel), відкрий у проєкті **Settings → Domains → Add Domain** і впиши його — Vercel покаже, які DNS-записи додати. Для **кореневого домену** (`example.com`) це запис **A**, для **піддомену** (`app.example.com`) — запис **CNAME** з унікальним для проєкту значенням. Інший варіант — передати Vercel керування всім DNS через його nameservers. До `example.com` Vercel запропонує додати й `www.example.com` з переадресацією. HTTPS-сертифікат Vercel видає сам (через Let's Encrypt), щойно DNS-записи поширяться мережею, а на це іноді йдуть години. Значення записів копіюй із дашборду: для кожного проєкту вони свої.

> [!quiz] Перевір себе: який DNS-запис для піддомену?
> level: junior · id: nextjs-start-12-quiz-09
>
> Ти хочеш відкрити застосунок на `shop.example.com`. Який запис зазвичай додають у DNS реєстратора?
>
> - [x] CNAME для `shop` зі значенням, яке показав Vercel для цього проєкту
> - [ ] A-запис з IP твого компʼютера, де ти запускав `npm start`
> - [ ] TXT-запис зі змінною `NEXT_PUBLIC_DOMAIN`
> - [ ] Нічого: Vercel сам знайде домен після додавання в дашборд
>
> **Пояснення:** для піддоменів Vercel радить CNAME (для кореневого домену — A-запис). TXT потрібен лише тоді, коли треба підтвердити право на домен, який уже використовує інший акаунт Vercel. Без записів у DNS домен на Vercel не вказує, хоч би що було в дашборді.

### ✅ Перед тим як ділитися посиланням

Сайт зібрався — ще не означає, що він працює. Пʼять хвилин перевірки:

- **Збірка зелена, а build logs — без попереджень, які ти не розумієш.** Жовте теж варто прочитати.
- **Усі змінні є в потрібному середовищі.** Production-змінні — у Production, тестові — у Preview. Після змін — redeploy.
- **Жодного секрету з `NEXT_PUBLIC_`.** Відкрий сайт, подивись вихідний код (Ctrl+U): ключів API там бути не повинно.
- **`.env`-файлів немає в репозиторії** (`git ls-files | grep .env`). Якщо закомітив — видали з репозиторію й **заміни** ключі: стара версія лишилась в історії Git.
- **Пройди головний сценарій руками** на адресі деплою: відкрий сторінки, надішли форму, онови сторінку.
- **Глянь runtime logs** після цього: червоних записів (`5xx`, `console.error`) бути не повинно.
- **Preview проти production.** Ділишся preview — переконайся, що людина зможе його відкрити (Deployment Protection) і що він не пише в бойову базу.

### 🏭 Як це роблять у продакшні

- **Кожен pull request — свій preview.** Код-ревʼю і перевірка дизайну йдуть на адресі гілки, а не на «у мене локально працює».
- **Секрети — лише в дашборді, тип Secret.** У репозиторії лежить `.env.example` з назвами змінних без значень, щоб новий розробник знав, що налаштувати.
- **Локальна збірка або CI перед merge.** `next build` у CI ловить помилки типів раніше, ніж вони зламають production-деплой.
- **Відкат замість гарячого фіксу.** Зламався продакшн — спершу Instant Rollback, потім спокійно розбирайся.
- **Логи — у зовнішній сервіс** (Log Drains, тема 44 основного посібника): вбудований строк зберігання короткий.

## ⚠️ Пастки

> [!pitfall] Секрет з NEXT_PUBLIC_
> Префікс вшиває значення в JS для браузера. Назва «SECRET» нічого не захищає.
>
> ```text
> NEXT_PUBLIC_STRIPE_SECRET=sk_live_… ❌ у вихідному коді сайту
> STRIPE_SECRET=sk_live_…             ✅ лише на сервері
> ```

> [!pitfall] Змінив змінну — і чекаєш
> Vercel застосовує зміни лише до нових деплоїв, а `NEXT_PUBLIC_*` ще й вшиті в збірку. Після зміни змінних — redeploy.

> [!pitfall] Перевірив лише в next dev
> `next dev` не зупиняється на помилках типів і рендерить сторінки на кожен запит. Перед push — `npm run build && npm start`.

> [!pitfall] .env.local у репозиторії
> Видалити файл замало: значення лишаються в історії Git. Видали його з репозиторію, додай у `.gitignore` і заміни всі ключі з нього.

> [!pitfall] Шукаєш помилку запиту в build logs
> Build logs — про збірку. `console.log` з Server Actions і серверних компонентів — у runtime logs, і на Hobby вони живуть лише годину.

> [!pitfall] Preview у бойову базу
> Якщо змінні Production скопійовані в Preview, тестовий деплой з гілки пише в справжні дані. Розводь значення за середовищами.

## 🔗 Звʼязки

- [[Next.js Start - 06. Перший проєкт, create-next-app і структура]] — скрипти `dev`, `build`, `start` і `.gitignore` з шаблону.
- [[Next.js Start - 11. Перша форма і Server Action]] — форма, яку тепер можна задеплоїти: її логи — у runtime logs.
- [[Next.js Start - 05. Що таке Next.js і навіщо фреймворк]] — що рендериться під час збірки, а що на запит.
- [[Next.js - 07. Server і Client Components]] — чому непублічна змінна в Client Component потрапляє в HTML.
- Далі в основному посібнику: тема 42 — Vercel докладно (Functions, CDN, кеш), 43 — self-hosting і Docker, 44 — логи, моніторинг і OpenTelemetry, 29 — секрети й `server-only`.

## ⚡ Фішки

> [!reel] 🖨️ NEXT_PUBLIC_ — надруковано в тиражі
> Під час `next build` Next.js вписує значення `NEXT_PUBLIC_*` прямо в JavaScript. Змінив змінну у Vercel — без нового деплою сайт її не побачить.

> [!reel] 🌿 Кожна гілка — свій сайт
> Push у будь-яку гілку, крім production, дає preview-деплой з адресою `…-git-<гілка>-….vercel.app`. Кидай її в pull request замість скріншотів.

> [!reel] ⏪ Відкат без збірки
> Деплої незмінні, тож Instant Rollback просто переключає домен на стару збірку. Секунди замість хвилин нової збірки.

> [!reel] 🥇 Перший деплой — завжди production
> Навіть якщо імпортуєш проєкт з гілки `dev`, перший деплой нового проєкту Vercel робить production. І збирає його з Production-змінними.

> [!reel] ⌛ Runtime logs на Hobby — одна година
> Відтворив баг — одразу йди в Logs. За годину записів на безкоштовному плані вже не буде.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чим next dev відрізняється від next build && next start?
> *дуже часто · теорія* · `nextjs-start-12-card-01`
>
> `next dev` збирає сторінки на льоту для розробки й не зупиняється на помилках типів. `next build` робить продакшн-збірку (перевірка типів, попередній рендер), `next start` запускає готову збірку, як це зробить сервер. Перед деплоєм перевіряй саме другий варіант.
>
> 📚 [[Next.js Start - 12. Перший деплой на Vercel#🧪 Спершу — продакшн у себе: next build && next start|Розділ: продакшн у себе]] · [Next.js: Deploying](https://nextjs.org/docs/app/getting-started/deploying)

> [!question]- Коли Vercel створює preview-деплой, а коли production?
> *дуже часто · теорія* · `nextjs-start-12-card-02`
>
> Production — push або merge у production branch (за замовчуванням `main`), а також перший деплой нового проєкту. Preview — push у будь-яку іншу гілку і кожен pull request.
>
> 📚 [[Next.js Start - 12. Перший деплой на Vercel#🌿 Preview і production|Розділ: preview і production]] · [Vercel: Environments](https://vercel.com/docs/deployments/environments)

> [!question]- Що робить префікс NEXT_PUBLIC_?
> *дуже часто · безпека* · `nextjs-start-12-card-03`
>
> Під час `next build` Next.js замінює `process.env.NEXT_PUBLIC_…` на значення і вписує його в JS для браузера. Значення стає публічним і застигає до наступної збірки. Без префікса змінна доступна лише на сервері.
>
> 📚 [[Next.js Start - 12. Перший деплой на Vercel#🔑 Змінні середовища в дашборді|Розділ: змінні середовища]] · [Next.js: Environment Variables](https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser)

> [!question]- Ти змінив змінну в дашборді Vercel. Коли вона запрацює?
> *часто · практика* · `nextjs-start-12-card-04`
>
> Лише в новому деплої: Vercel не застосовує зміни до вже зібраних деплоїв. Зроби redeploy або новий push. Для `NEXT_PUBLIC_*` це тим більше обовʼязково — значення вшите в збірку.
>
> 📚 [[Next.js Start - 12. Перший деплой на Vercel#🔑 Змінні середовища в дашборді|Розділ: змінні середовища]] · [Vercel: Environment variables](https://vercel.com/docs/environment-variables)

> [!question]- Чим build logs відрізняються від runtime logs?
> *часто · практика* · `nextjs-start-12-card-05`
>
> Build logs — вивід збірки (`npm install`, `next build`), відкриваються з деплою, зберігаються безстроково; туди дивишся, коли деплой не зібрався. Runtime logs (розділ Logs) — `console.log`/`console.error` серверного коду під час запитів; на Hobby зберігаються годину.
>
> 📚 [[Next.js Start - 12. Перший деплой на Vercel#📜 Логи: збірки й виконання|Розділ: логи]] · [Vercel: Runtime Logs](https://vercel.com/docs/logs/runtime)

> [!question]- Який DNS-запис потрібен для example.com, а який — для app.example.com?
> *іноді · практика* · `nextjs-start-12-card-06`
>
> Для кореневого домену — A-запис, для піддомену — CNAME зі значенням, яке Vercel показує для проєкту. Або Vercel nameservers для всього домену. HTTPS-сертифікат Vercel видає сам після поширення DNS.
>
> 📚 [[Next.js Start - 12. Перший деплой на Vercel#🌐 Свій домен|Розділ: свій домен]] · [Vercel: Adding a Custom Domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain)

### 🟡 Middle

> [!question]- Чому серверна змінна на статичній сторінці показує значення зі збірки?
> *часто · пастка* · `nextjs-start-12-card-07`
>
> Статичну сторінку Next.js рендерить під час `next build`, тож і `process.env` читається тоді. Щоб читати значення на запит, частину сторінки роблять динамічною: `await connection()` (у `<Suspense>`). Без цього сторінка покаже значення зі збірки (`build-server`), з ним — значення під час запиту (`runtime-server`).
>
> 📚 [[Next.js Start - 12. Перший деплой на Vercel#🔑 Змінні середовища в дашборді|Розділ: змінні середовища]] · [Next.js: Runtime Environment Variables](https://nextjs.org/docs/app/guides/environment-variables#runtime-environment-variables)

> [!question]- Що робить Instant Rollback і чого він не робить?
> *іноді · теорія* · `nextjs-start-12-card-08`
>
> Переключає production-домени на попередній production-деплой без нової збірки — за секунди. Не змінює змінних середовища (лишаються ті, з якими збирали старий деплой) і вимикає автопереключення домену на нові push, доки ти не скасуєш відкат.
>
> 📚 [[Next.js Start - 12. Перший деплой на Vercel#🌿 Preview і production|Розділ: preview і production]] · [Vercel: Instant Rollback](https://vercel.com/docs/instant-rollback)

> [!question]- Ти випадково закомітив .env.local з ключами. Що робити?
> *часто · безпека* · `nextjs-start-12-card-09`
>
> Видалити файл з репозиторію і додати в `.gitignore` — замало: значення лишаються в історії Git. Головне — **замінити всі ключі** з файлу в сервісах, звідки вони, і оновити змінні у Vercel (з redeploy).
>
> 📚 [[Next.js Start - 12. Перший деплой на Vercel#✅ Перед тим як ділитися посиланням|Розділ: чекліст]] · [Vercel: Rotating environment variables](https://vercel.com/docs/environment-variables/rotating-secrets)

## 🛠️ Практика

> [!task] Розсортуй змінні: браузер чи сервер
> level: junior · difficulty: easy · id: nextjs-start-12-task-01 · tags: env, security
>
> Напиши `classifyEnv(names)` для перевірки перед деплоєм. На вхід — масив назв змінних. Поверни `{ client, server, suspicious }`:
>
> - `client` — назви, що **починаються** з `NEXT_PUBLIC_` (регістр важливий, як у Next.js);
> - `server` — усі інші;
> - `suspicious` — назви з `client`, у яких після префікса є `SECRET`, `TOKEN`, `PASSWORD` або `PRIVATE`: схоже на секрет, що піде в браузер.
>
> Зберігай порядок назв зі входу. Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type EnvReport = { client: string[]; server: string[]; suspicious: string[] }
>
> function classifyEnv(names: string[]): EnvReport {
>   // твій код
>   return { client: [], server: [], suspicious: [] }
> }
> ```
>
> ```ts tests
> test('розділяє за префіксом NEXT_PUBLIC_', () => {
>   const report = classifyEnv(['DATABASE_URL', 'NEXT_PUBLIC_SITE_NAME', 'API_KEY'])
>   expect(report.client).toEqual(['NEXT_PUBLIC_SITE_NAME'])
>   expect(report.server).toEqual(['DATABASE_URL', 'API_KEY'])
> })
>
> test('префікс лише на початку назви', () => {
>   expect(classifyEnv(['MY_NEXT_PUBLIC_X']).server).toEqual(['MY_NEXT_PUBLIC_X'])
> })
>
> test('регістр важливий', () => {
>   expect(classifyEnv(['next_public_x', 'Next_Public_Y']).client).toEqual([])
> })
>
> test('підозрілі публічні змінні', () => {
>   const report = classifyEnv(['NEXT_PUBLIC_STRIPE_SECRET', 'NEXT_PUBLIC_GITHUB_TOKEN', 'NEXT_PUBLIC_ANALYTICS_ID', 'STRIPE_SECRET'])
>   expect(report.suspicious).toEqual(['NEXT_PUBLIC_STRIPE_SECRET', 'NEXT_PUBLIC_GITHUB_TOKEN'])
> })
>
> test('серверний секрет — не підозрілий', () => {
>   expect(classifyEnv(['DB_PASSWORD', 'JWT_PRIVATE_KEY']).suspicious).toEqual([])
> })
>
> test('порожній список', () => {
>   expect(classifyEnv([])).toEqual({ client: [], server: [], suspicious: [] })
> })
> ```
>
> > [!hint]- Підказка 1
> > `includes('NEXT_PUBLIC_')` знайде префікс і в середині назви. Потрібен `startsWith`.
>
> > [!hint]- Підказка 2
> > Для `suspicious` відріж префікс (`name.slice('NEXT_PUBLIC_'.length)`) і перевір слова через `some`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > const PREFIX = 'NEXT_PUBLIC_'
> > const SECRET_WORDS = ['SECRET', 'TOKEN', 'PASSWORD', 'PRIVATE']
> >
> > function classifyEnv(names: string[]): EnvReport {
> >   const report: EnvReport = { client: [], server: [], suspicious: [] }
> >   for (const name of names) {
> >     if (!name.startsWith(PREFIX)) {
> >       report.server.push(name)
> >       continue
> >     }
> >     report.client.push(name)
> >     const rest = name.slice(PREFIX.length)
> >     if (SECRET_WORDS.some((word) => rest.includes(word))) report.suspicious.push(name)
> >   }
> >   return report
> > }
> > ```
> >
> > Next.js вирішує долю змінної лише за префіксом на початку назви, тож і перевірка має бути саме такою. Список слів — евристика: вона не впіймає `NEXT_PUBLIC_DB_URL`, але підсвітить найтиповіші помилки. Добре місце для такої перевірки — скрипт у CI перед деплоєм.

> [!task] Чекліст перед тим, як ділитися посиланням
> level: junior · difficulty: medium · id: nextjs-start-12-task-02 · tags: deploy, checklist
>
> Напиши `checkBeforeShare(deploy)`, що повертає масив проблем (рядків) у такому порядку; немає проблем — `[]`.
>
> - Збірка впала (`deploy.build.ok === false`) → поверни лише `['build-failed']`: далі перевіряти нічого.
> - Для кожної назви з `deploy.required`, якої немає в `deploy.env[deploy.target]` → `'missing-env:<NAME>'` (у порядку `required`).
> - Для кожного файлу з `deploy.committedFiles`, чия **назва** (остання частина шляху) починається з `.env`, крім `.env.example` → `'env-file-committed:<шлях>'`.
> - Якщо в `deploy.runtimeLogs` є хоч один запис з `level: 'error'` → один рядок `'runtime-errors'`.
>
> `deploy.target` — `'preview'` або `'production'`, `deploy.env` — `{ preview: string[], production: string[] }`.
>
> ```js starter
> function checkBeforeShare(deploy) {
>   // твій код
>   return []
> }
> ```
>
> ```js tests
> const good = {
>   build: { ok: true },
>   target: 'production',
>   env: { production: ['DATABASE_URL', 'NEXT_PUBLIC_SITE_NAME'], preview: ['DATABASE_URL'] },
>   required: ['DATABASE_URL', 'NEXT_PUBLIC_SITE_NAME'],
>   committedFiles: ['app/page.tsx', '.env.example', 'package.json'],
>   runtimeLogs: [{ level: 'info', message: 'ok' }],
> }
>
> test('усе гаразд — порожній список', () => {
>   expect(checkBeforeShare(good)).toEqual([])
> })
>
> test('впала збірка — лише build-failed', () => {
>   expect(checkBeforeShare({ ...good, build: { ok: false }, required: ['X'] })).toEqual(['build-failed'])
> })
>
> test('змінні перевіряються в цільовому середовищі', () => {
>   expect(checkBeforeShare({ ...good, target: 'preview' })).toEqual(['missing-env:NEXT_PUBLIC_SITE_NAME'])
> })
>
> test('закомічені .env-файли, але не .env.example', () => {
>   const deploy = { ...good, committedFiles: ['.env.local', 'config/.env', '.env.example', 'docs/env.md'] }
>   expect(checkBeforeShare(deploy)).toEqual(['env-file-committed:.env.local', 'env-file-committed:config/.env'])
> })
>
> test('помилки в runtime logs — один рядок, у кінці', () => {
>   const deploy = {
>     ...good,
>     required: ['DATABASE_URL', 'SMTP_PASSWORD'],
>     runtimeLogs: [{ level: 'error', message: 'a' }, { level: 'error', message: 'b' }],
>   }
>   expect(checkBeforeShare(deploy)).toEqual(['missing-env:SMTP_PASSWORD', 'runtime-errors'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Почни з `if (!deploy.build.ok) return ['build-failed']`. Потім заводь `const problems = []` і додавай у потрібному порядку.
>
> > [!hint]- Підказка 2
> > Назва файлу — `path.split('/').pop()`. `docs/env.md` не підходить: його назва починається з `env`, а не з `.env`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function checkBeforeShare(deploy) {
> >   if (!deploy.build.ok) return ['build-failed']
> >   const problems = []
> >
> >   const available = deploy.env[deploy.target] ?? []
> >   for (const name of deploy.required) {
> >     if (!available.includes(name)) problems.push(`missing-env:${name}`)
> >   }
> >
> >   for (const path of deploy.committedFiles) {
> >     const file = path.split('/').pop()
> >     if (file.startsWith('.env') && file !== '.env.example') problems.push(`env-file-committed:${path}`)
> >   }
> >
> >   if (deploy.runtimeLogs.some((log) => log.level === 'error')) problems.push('runtime-errors')
> >
> >   return problems
> > }
> > ```
> >
> > Порядок перевірок повторює порядок дій: без збірки нема чого перевіряти, без змінних сайт зламається на першому запиті, закомічений `.env` — привід міняти ключі, а помилки в логах кажуть, що щось уже пішло не так. Змінні перевіряються саме в цільовому середовищі: preview і production мають власні набори.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Deploying](https://nextjs.org/docs/app/getting-started/deploying) — способи деплою: Node.js-сервер, Docker, статичний експорт, адаптери.
- 🟢 [Next.js — Environment Variables](https://nextjs.org/docs/app/guides/environment-variables) — `.env`-файли, `NEXT_PUBLIC_` і вшивання під час збірки, порядок завантаження.
- 🟢 [Vercel — Deploying Git Repositories](https://vercel.com/docs/git) — імпорт репозиторію, production branch, preview-гілки.
- 🟡 [Vercel — Environments](https://vercel.com/docs/deployments/environments) — Preview і Production, перший деплой, staging.
- 🟡 [Vercel — Environment variables](https://vercel.com/docs/environment-variables) — середовища, Config і Secret, `vercel env pull`.
- 🟡 [Vercel — Generated URLs](https://vercel.com/docs/deployments/generated-urls) — формати адрес коміту й гілки.
- 🟡 [Vercel — Runtime Logs](https://vercel.com/docs/logs/runtime) — фільтри, рівні, строки зберігання.
- 🟡 [Vercel — Adding a Custom Domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain) — A, CNAME, nameservers.
- 🟡 [Vercel — Deployment Protection](https://vercel.com/docs/deployment-protection) — хто може відкрити preview.
- 🔴 [Next.js — Production Checklist](https://nextjs.org/docs/app/guides/production-checklist) — повний список перевірок перед продакшном.

> [!important] Підсумок
> - Перед деплоєм — `npm run build && npm start`: `next dev` не показує помилок типів і проблем зі статичними сторінками.
> - Vercel збирає застосунок із Git сам: push у production branch (`main`) → production, будь-яка інша гілка чи PR → preview зі своєю адресою. Перший деплой — завжди production.
> - Деплої незмінні: Instant Rollback повертає попередній за секунди, а зміни змінних діють лише на нові деплої.
> - `NEXT_PUBLIC_` вшиває значення в JS під час збірки — це публічно і «застигає». Секрети — без префікса, у дашборді з типом Secret.
> - Build logs — коли не зібралось; runtime logs — коли щось ламається на запит (на Hobby живуть годину).
> - Свій домен: A для кореня, CNAME для піддомену, HTTPS Vercel видає сам. Перед тим як ділитися — пройди чекліст.
