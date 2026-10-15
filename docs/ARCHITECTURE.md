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
Marketplace ─┬─ Course (JavaScript from Noob to God · uk · subject: programming)
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
| **Level** | `noob · junior · middle · senior · god` (мапиться з `junior/middle/senior/techlead` + `beginner`) | frontmatter / meta-рядок |

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
title: JavaScript from Noob to God
subject: programming
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

## 5. Дані (Postgres / Supabase)

- `auth.users` — Supabase Auth. `profiles(id = auth.uid())` — ім'я, аватар, локаль, налаштування, інтереси.
- `courses`, `course_versions(bundle jsonb)`, `enrollments(user_id, course_id, level, placement, active)`.
- Прогрес (усі з `user_id`, PK `(user_id, …)`): `attempts`, `srs_cards`, `mistakes`, `lesson_progress`, `topic_results`, `exam_results`, `chapter_progress`, `task_state`, `daily_activity`, `daily_missions`, `reel_state`.
- Гра: `xp_ledger`, `gem_ledger`, `user_state(hearts, hearts_at, streak_freezes, double_xp_until)`, `inventory`, `achievements`, `league_weeks(user_id, week, tier, xp)`.
- Спільне: `news_items`, `articles`, `generated_items` (AI-контент стрічки з `topic`, `level`, `lang`).
- **RLS:** політики `user_id = auth.uid()` на всіх user-таблицях. Сервер виконує запити в транзакції з `set local role authenticated` + `request.jwt.claims`, тож навіть баг у коді не відкриє чужі дані.

## 6. Ігровий шар

| Механіка | Правило |
|---|---|
| XP | За вправи (рівень × тип), бонуси за урок/ідеальний урок/тест/екзамен, ×2 з бустером |
| ❤️ Сердечка | 5; помилка в уроці −1; +1 кожні 4 год; «Робота над помилками» відновлює; 0 → урок лише в режимі практики |
| 💎 Кристали | За уроки, серії, ачівки, ліги; магазин: 🧊 заморозка серії, ⚡ подвійний XP 15 хв, ❤️ відновлення, скіни Loo |
| 🔥 Серія | День зараховано за денну мету; заморозка рятує пропуск |
| 🏆 Ліги | Тижневі групи по 30: Бронза → Срібло → Золото → Сапфір → Рубін → Смарагд → Аметист → Перли → Обсидіан → Діамант; топ-7 вгору, низ-5 вниз |
| 👑 Корони | Майстерність теми 0–5 (вже є) |
| 🎖️ Ранги | Noob → Trainee → Junior → Middle → Senior → Staff → Principal → God (за XP і екзаменами) |
| 🦊 Loo | Маскот реагує на відповіді, серії, повернення, підказує «що зробити сьогодні на 1% краще» |

## 7. Що далі

Фази реалізації, критерії готовності та статус — у [ROADMAP.md](./ROADMAP.md).
