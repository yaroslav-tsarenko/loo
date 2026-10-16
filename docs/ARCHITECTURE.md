# Levelup — архітектура платформи курсів

> Levelup перетворює навчання на гру. Будь-який предмет (JavaScript, англійська, німецька, безпека…) — це **курс**,
> який проходиться як шлях у Duolingo: від Noob до God, з уроками, тестами, екзаменами, задачами, стрічкою і лігами.

Документ описує цільову архітектуру. Поточний код (одна людина, посібники з Obsidian) мігрує до неї фазами — див. [ROADMAP.md](./ROADMAP.md).

## 1. Принципи

1. **Курс — це дані, не код.** Новий курс додається пакетом файлів (markdown + YAML), без змін у застосунку.
2. **Один рушій для всіх предметів.** Уроки, тести, екзамени, повторення FSRS, стрічка, ліги не знають, що вивчається — JS чи німецька.
3. **Компіляція заздалегідь.** Пакет курсу компілюється в `CourseBundle` (JSON): на build для офіційних курсів, при завантаженні — для курсів користувачів. Сторінки читають готовий bundle, не парсять markdown на кожен запит.
4. **Користувач у центрі.** Кожен рядок прогресу має `user_id`; ізоляція — і в коді, і на рівні Postgres RLS (defense in depth).
5. **Безпека за замовчуванням.** Див. [SECURITY.md](./SECURITY.md): будь-який контент курсу — недовірений, код учня і код тестів — тільки в пісочниці.
6. **Українською зараз, i18n-ready завжди.** Тексти UI — у словниках `src/i18n/<locale>.ts`; курс має власну мову викладання.

## 2. Доменна модель

```text
Marketplace ─┬─ Course (JavaScript Zero → Pro · uk · subject: programming · kind: programming)
             │    ├─ Section «🧱 Ядро мови»            ── Section Exam (екзамен розділу, «перескочити розділ»)
             │    │    ├─ Topic «Замикання»            ── Topic Test (підсумковий тест теми)
             │    │    │    ├─ Lesson 📖 Теорія        (стаття — Notion-стиль, лишається)
             │    │    │    ├─ Lesson 🤔 Старт          ┐
             │    │    │    ├─ Lesson 🔬 Розбір 1..n    │ Exercise[]: reel · flashcard · quiz(single|multi|output|order|fill)
             │    │    │    ├─ Lesson 🛠️ Задача         │            · task(starter+tests) · viz · figure
             │    │    │    └─ Lesson 🎤 Співбесіда     ┘
             │    │    └─ …
             │    └─ Section «🎤 Співбесіда» (банк питань) …
             └─ Course (English A1→C2) …
User ── Enrollment(course, level, placement) ── Progress (attempts, SRS, mistakes, lessons, exams)
     ── Game state (XP, hearts, gems, streak, league, achievements, inventory)
     ── Profile & preferences (interests, level, daily goal, haptics, locale)
```

| Сутність | Що це | Звідки |
|---|---|---|
| **Course** | Продукт у маркетплейсі: назва, предмет, мова, іконка, обкладинка, рівні, автор, версія, видимість | `course.yaml` |
| **Section** | Великий етап шляху (як «Unit» у Duolingo), закінчується **екзаменом** | `course.yaml → sections[]` |
| **Topic** | Тема = один розділ статті (chapter), закінчується **тестом теми** | markdown-файл |
| **Lesson** | 3–7 хв, 4–10 вправ; генерується з контенту теми детерміновано | компілятор |
| **Exercise** | Атомарна вправа з `id`, рівнем, тегами | callout у markdown |
| **Level** | шкала курсу: `noob · junior · middle · senior · god` (мапиться з `junior/middle/senior/techlead` + `beginner`) або CEFR `A1 … C2` для мовних курсів | frontmatter / meta-рядок |

### Складність і персоналізація

- Кожна вправа має рівень. `Enrollment.level` визначає, що показувати: вправи «нижче рівня» йдуть у швидкий режим (1 вправа на урок замість 6), «вище рівня» — позначаються 🔥 «челендж».
- **Вступний тест** (placement, 5–7 хв, адаптивний бінарний пошук по рівнях) відкриває відповідний розділ; **екзамен розділу** дозволяє перескочити розділ (test-out) у будь-який момент.
- **Інтереси** користувача (теги) зважують вибір вправ у стрічці, місії і повтореннях.

## 3. Формат пакета курсу (Course Package)

Сумісний з Obsidian: автор пише в Obsidian, пакет — це папка vault. Повна специфікація — [COURSE_FORMAT.md](./COURSE_FORMAT.md).

```text
javascript-noob-to-god/
  course.yaml                 # маніфест
  cover.png
  JavaScript Start/…          # секції посилаються на папки-посібники або діапазони розділів
  JavaScript/…
  JavaScript Katas/…
```

```yaml
id: javascript-noob-to-god
title: JavaScript Zero → Pro
subject: programming
kind: programming              # programming | language | general → розділи практики й теорія в сайдбарі
practice: [path, cards, tests, tasks, mistakes, roadmap]
theory: [JavaScript Start, JavaScript, JavaScript Katas, JavaScript Projects, JS Interview Q&A]
language: uk
icon: si:SiJavascript          # бібліотечна іконка (react-icons) або емодзі
color: '#F7DF1E'
levels: [noob, junior, middle, senior, god]
sections:
  - { title: Старт з нуля, icon: '🌱', from: JavaScript Start }
  - { title: Ядро мови, icon: '🧱', from: JavaScript, chapters: 1-7 }
  - { title: Співбесіда, icon: '🎤', from: JS Interview Q&A, kind: practice }
exams: { topic: { questions: 10, pass: 0.8 }, section: { questions: 25, pass: 0.8, testOut: true } }
```

Пайплайн: `package → validate (схеми, id, посилання, пісочниця для тестів задач) → compile → CourseBundle (JSON) + assets`.
- Офіційні курси: у репозиторії, компілюються на build (`pnpm course:build`).
- Курси користувачів: ZIP → Supabase Storage → серверна валідація в ізольованому воркері → `course_versions.bundle (jsonb)` → модерація → публікація.

## 4. Шари коду

```text
src/
  course/        ← НОВЕ. Доменне ядро платформи (чисте, без I/O)
    schema/        zod-схеми course.yaml, CourseBundle, Exercise
    compile/       markdown(Obsidian) → CourseBundle; генерація уроків, тестів тем, екзаменів
    select/        відбір вправ під рівень/інтереси, placement-тест, test-out
  content/       парсер Obsidian markdown (callouts, wiki-links, блоки) — переюзується компілятором
  game/          ← НОВЕ. XP, рівні, ранги, серії, сердечка, кристали, магазин, ліги, ачівки (чисті функції)
  progress/      FSRS, помилки, місії, майстерність (вже є, стає per-user)
  db/            схема Drizzle; кожна таблиця прогресу має user_id; RLS
  server/
    auth/          Supabase Auth (SSR-клієнт, сесія, requireUser())
    repos/         доступ до даних, завжди з userId (ніяких «глобальних» запитів)
    actions/       server actions: валідація zod + requireUser() + rate limit
    services/      оркестрація (місії, шлях, стрічка, ліги)
  ai/            генерація стрічки (reels, Q&A, історії, міні-тести) з перевіркою
  i18n/          словники UI
  ui/
    design/        ← НОВЕ. Дизайн-система Levelup (кнопки 3D, картки, прогреси, бейджі, Loo)
    icons/         реєстр іконок: emoji | react-icons (si/pi/tb…) за рядком `set:Name`
    …feature folders (lesson, path, feed, map, profile, shop, leagues)
  app/
    (marketing)/   лендінг
    (auth)/        вхід, реєстрація, callback, скидання пароля
    (app)/         застосунок за авторизацією
```

Правило залежностей: `course`, `game`, `progress` — чисті (жодного React/DB). `server` знає про DB і домен. `ui` знає лише про view-моделі.

**Фаза 2 (зроблено):** вхід — `src/server/auth/` (`getUser`/`requireUser`/`userScope`/`getProfile`/`isAdmin`), сесія оновлюється в
`src/proxy.ts`; кожен запит користувача — у `withUser()` (`src/server/db/`: на Supabase транзакція з роллю `authenticated` і claims → RLS).
Маршрути: `/` — лендінг для гостей (`src/ui/marketing/Landing.tsx`) і «Сьогодні» для користувачів (серверне розгалуження в
`src/app/page.tsx`, без переносу сторінок у `(app)/`); `(auth)/` — `/login`, `/signup`, `/forgot-password`, `/reset-password`,
`/onboarding` і обробники `/auth/*`; `/account` — профіль. Оболонку (сайдбар, нижня навігація) вимикає `AppFrame` для auth-сторінок.
Налаштування Supabase — [AUTH.md](./AUTH.md), статус безпеки — [SECURITY.md §5](./SECURITY.md).

**Фаза 3 (зроблено):** реєстр курсів `src/server/courses/` (bundle з `content/courses/*.json`, один раз на процес, схема `CourseBundleSchema`);
записи учня `enrollments` (рівень, результат вступного тесту, один активний курс), `topic_results`, `exam_results`. Шлях —
чиста функція `buildCoursePath` (`src/course/select/path.ts`) над bundle + прогресом. Маршрути: `/courses`, `/courses/[id]`, `/path`
(активний курс), `/learn/<lesson id>` (старі id → редірект), `/test/<test|exam id>`, `/placement`. Тести, екзамени й вступний тест
оцінюються на сервері (`src/server/courses/tests-core.ts`, `placement-core.ts`, спільна перевірка `src/content/blocks/quiz/grade.ts`).
Старий `lesson_progress` переноситься на id курсу ліниво й ідемпотентно (`src/server/courses/legacy.ts`).

**Фаза 4 (зроблено):** ігрові правила — чисті функції `src/game/**` (сердечка, бакси й кристали, крамниця й спорядження, ⚡, 🧊, ліги, шлях воїна, тижні за
Києвом; ESLint-межа як у `src/course`), сервіси — `src/server/game/**` (`grantXp`/`awardBucks`/`awardGems` — єдиний шлях XP, баксів і кристалів; `settleGame`
наприкінці кожної транзакції прогресу: заморозки, винагороди за серії, ранги). Відповіді перевіряє сервер (`answerQuiz`,
`src/server/actions/answers.ts`): клієнт графлених вправ отримує лише «вигляд» (`src/content/blocks/quiz/view.ts`) без ключа.
Ліги — системний код поза транзакцією користувача (`src/server/game/leagues.ts`): ліниве приєднання, фіналізація при першому
візиті нового тижня й cron `/api/cron/leagues`. Маршрути `/shop`, `/leagues`, `/loo`; скіни й спорядження Loo — `LooSkinProvider` у root layout. RPG-шар (ранги, валюти, речі) — [ECONOMY.md](./ECONOMY.md).

**Оболонка під активний курс (зроблено):** курс сам оголошує, яким є (`kind: programming | language | general`), які розділи
практики пропонує і в якому порядку (`practice:`) і які посібники — його теорія (`theory:`); див. [COURSE_FORMAT.md §2.1](./COURSE_FORMAT.md).
Реєстр id розділів, типові набори й резолв — чисті `src/course/practice.ts` (zod-схеми — `src/course/schema/practice.ts`);
компілятор кладе `course.kind`, `course.practice`, `theory` у bundle (старі bundle резолвляться з `subject` через `courseKind` /
`coursePractice` / `courseTheory`). UI-реєстр `src/ui/shell/course-nav.ts` дає кожному id підпис, іконку, маршрут, джерело
лічильника і `ready` (розділ без сторінки не показується) — новий тип курсу чи розділ = дані, не нові гілки в оболонці.
Root layout бере активний курс (`activeCourse`) і рендерить: глобальні пункти (`src/ui/shell/nav.ts`), блок «Практика» з
розділами курсу (`PracticeProvider` — спільно для сайдбару, нижньої навігації і заголовка сторінки), «Курси» (перемикач,
`switchCourse` ревалідує layout), «Теорія» — дерево лише посібників курсу: посібник → частина (`parts` з `_guide.md` або
папки) → розділ, зі статусом прочитання (`src/server/courses/theory-core.ts`, `/api/theory`, `src/ui/shell/TheoryTree.tsx`,
WAI-ARIA tree, стан розгортання в localStorage). Лічильники (`/api/counts`: картки до повторення, відкриті помилки, задачі в роботі)
рахуються лише по вправах активного курсу (`src/server/services/counts-core.ts`). «Картки», «Тести», «Задачі», «Помилки»
обмежені активним курсом (`studyScope`), перемикач «Усі курси» — `?scope=all`. Усі посібники — `/g`. Скрол сайдбару —
`IslandScroll` (`src/ui/shell/IslandScroll.tsx`): нативний скрол, власний «острівець»-повзунок; переюзується для будь-якої панелі.

**Мовні курси (зроблено):** шкала CEFR на курс (`src/course/schema/level.ts`: `LADDERS`, `courseLadder`, `toLadder`),
`target` (мова, яку вивчають) окремо від `language`, розділи `status: planned` («скоро»), нумерація `English - A1 - NN.`,
блоки `[!word]` `[!listen]` `[!speak]` `[!pair]` (`src/content/blocks/*`, перевірка — `src/content/blocks/lang/grade.ts`,
на сервері), шар озвучки / розпізнавання `SpeechProvider` (браузер, безкоштовно; `src/ui/lang/speech/*`), UI
`src/ui/lang/**`, розділи практики `/words`, `/listening`, `/pronunciation`, `/grammar`. Див. [LANGUAGE_COURSE.md](./LANGUAGE_COURSE.md),
[SPEECH.md](./SPEECH.md).

## 5. Дані (Postgres / Supabase)

- `auth.users` — Supabase Auth. `profiles(id = auth.uid())` — ім'я, аватар, локаль, налаштування, інтереси.
- `courses`, `course_versions(bundle jsonb)`, `enrollments(user_id, course_id, level, placement, active)`.
- Прогрес (усі з `user_id`, PK `(user_id, …)`): `attempts`, `srs_cards`, `mistakes`, `lesson_progress`, `topic_results`, `exam_results`, `chapter_progress`, `task_state`, `daily_activity`, `daily_missions`, `reel_state`.
- Гра (`drizzle/0007_game.sql`, `0008_evolution.sql`, `0009_rpg.sql`): `xp_ledger`, `gem_ledger` і `buck_ledger` (append-only, унікальний `(user_id, reason, ref_id)`), `user_state(hearts, hearts_at, streak_freezes, double_xp_until, skin, gear, evo_step, evo_seen)` (`evo_step` — крок шляху воїна 0–55), `inventory` (скіни й спорядження), `frozen_days` (дні, врятовані 🧊), `achievements`, `league_members(user_id, week, tier, cohort_id, final_rank, final_xp, result)` + спільна `league_cohorts(id, week, tier, size)` (без грантів для `authenticated`); тижневий XP ліги рахується з `xp_ledger` у вікні тижня, окремо не зберігається.
- Спільне: `news_items`, `articles`, `generated_items` (AI-контент стрічки з `topic`, `level`, `lang`).
- **RLS:** політики `user_id = auth.uid()` на всіх user-таблицях. Сервер виконує запити в транзакції з `set local role authenticated` + `request.jwt.claims`, тож навіть баг у коді не відкриє чужі дані.

## 6. Ігровий шар

Числа — у `src/game/**` (єдине джерело), тут — для огляду.

| Механіка | Правило |
|---|---|
| XP | За вправи (рівень × тип; лише з вердикту сервера), бонуси: урок +10 / ідеальний +5, тест теми +20, екзамен +50 (+30 test-out), ідеальний +10, місія, ачівка +25; ⚡ ×2 під час бустера; денний ліміт на джерело (картки 300, тести 900, задачі 800, уроки 300, тести тем 400, екзамени 600, місія 300, ачівки 1000) |
| ❤️ Сердечка | 5 макс.; неправильна відповідь у **уроці** −1 (у тій самій транзакції, що й спроба); +1 кожні 4 год (ліниво від `hearts_at`); 0 → новий урок не стартує: «Робота над помилками» (сесія `/mistakes` або `/quiz` з ≥ 5 відповідей → +1 ❤️ і +15 баксів) або відновлення за 120 баксів. Тести й екзамени сердечок не забирають, але для старту потрібне ≥ 1 ❤️. Самооцінка карток і задачі сердечок не забирають |
| Бакси | Часто й потроху, з денним лімітом на джерело: урок +10 (без помилок +20, ≤ 200/день), тест теми +30 (перше складання), місія дня +40, «Робота над помилками» +15 |
| 💎 Кристали | Лише звершення: екзамен розділу +40 (перше складання), серія 7/30/100/365 днів +50/+150/+500/+1500, ачівки +10/+25/+50 (бронза/срібло/золото), ліга: підвищення +15, 3-тє +25, 2-ге +40, 1-ше +60 (1-ше без підвищення +20), кожен новий крок шляху воїна. Обміну між валютами немає |
| 🛒 Крамниця | Розхідники за бакси: 🧊 заморозка 200 (≤ 2, витрачається сама на пропущені дні), ❤️ повні сердечка 120, ⚡ подвійний XP 15 хв 150 (≤ 1 год наперед). Спорядження (шолом, броня, зброя, амулет-лампа, аура; стати для боїв): звичайне/рідкісне — бакси, епічне — кристали від Лицаря, легендарне — кристали від Чемпіона. Скіни (шапки, окуляри, худі, шарфи) — переважно бакси, рідкісні — кристали. Купив — одразу вдягнено, Loo в речах усюди |
| 🔥 Серія | День зараховано за денну мету; пропущені дні покриваються заморозками (якщо вистачає на всі — інакше заморозки не згорають) |
| 🏆 Ліги | Тиждень з понеділка 00:00 (Europe/Kyiv); Бронза → Срібло → Золото → Сапфір → Рубін → Смарагд → Аметист → Перли → Обсидіан → Діамант; групи ≤ 30 однієї ліги, приєднання з першим XP тижня; рейтинг — XP з серверно-оцінених джерел (вправи, уроки, тести, екзамени, місія, ачівки); топ-7 ↑ (з XP > 0), низ-5 ↓, топ-7 у малих групах завжди безпечні; без ботів |
| 👑 Корони | Майстерність теми 0–5 (вже є) |
| ⚔️ Шлях воїна (ранг) | Один ранг на всі курси: Новобранець → Рекрут → Боєць → Воїн → Вартовий → Ветеран → Лицар → Паладин → Чемпіон → Полководець → Герой (кожен I–V) → Легенда = 56 кроків. Крок = XP (`44·i² + 20·i`, Легенда 134 200) **і** курсові віхи по всіх курсах (уроки, тести тем, екзамени, курси повністю), без пропусків. Новий крок → 💎 (`10 + 3·i`, ×2 за новий ранг, Легенда 1000), тост і повноекранна сцена один раз (`evo_seen`). Loo за рангом лише росте (яйце → малий → звичайний); сила на вигляді — спорядження. Таблиця — [ECONOMY.md](./ECONOMY.md) |
| 🧙 Персонаж `/loo` | Атрибути 1–100 з реальних даних (src/progress/stats): 🧠 Інтелект (точність + корони), ⚡ Швидкість (медіана часу на питання), 💾 Памʼять (картки FSRS у довгій памʼяті), 🔧 Майстерність (задачі × складність, з першої спроби), 🛡️ Стійкість (серія, 30-денний ритм, дні без 🧊), 🔥 Витривалість (години, обсяг за тиждень); формули не залежать від предмета. Навички — опановані теми (👑 ≥ 3) і складені екзамени будь-якого курсу. Спорядження й сумарні бойові стати (Атака, Захист, Енергія, Фокус, Швидкість — без стелі; баланс через матчмейкінг за силою), ранг у кожному курсі (Trainee → Principal). Знімок для дуелей — [BATTLES.md](./BATTLES.md) |
| 📶 Складність | Рівні вправ і курсів лишаються `noob…god` усередині; користувачу — IT-кар'єра: noob → Trainee, junior → Junior, middle → Middle, senior → Senior, techlead → Staff, god → Principal («для Senior») |
| 🦊 Loo | Реагує на відповіді (сумний/запаморочений при 0–1 ❤️), святкує ачівки за рівнем (😊/🎉/🔥), носить скіни й спорядження з крамниці й росте з рангом; підказує «що зробити сьогодні на 1% краще» |

## 7. Що далі

Фази реалізації, критерії готовності та статус — у [ROADMAP.md](./ROADMAP.md).
