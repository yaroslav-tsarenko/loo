# Реєстр треку: id курсів, навичок, тем і вправ; власники концептів

> Власник — лідер. Канонічний для всіх outline-файлів, брифів і контенту. Id постійні: після публікації не змінюються
> (специфікація §8). Зміни — лише через лідера, з рядком у «Журналі змін» унизу.

## 1. Курси (46 нових + 3 наявні)

Id курсу = префікс усіх id його тем і вправ. Схема: `[a-z0-9-]`, без крапок; нові курси — `fs-<код>`.

| Част. | Id курсу | Назва (укр.) | Роль | Бандл | Попередні робочі назви (outline) |
|---|---|---|---|---|---|
| I | `fs-cs` | Як працюють компʼютер і інтернет | core | свій | `fs-computer-internet`, `fs-computer`, `fs-cin` |
| I | `fs-tools` | Інструменти розробника | core | свій | `fs-dev-tools` |
| I | `fs-ramp` | Код і задачі з нуля | core | свій | `fs-code-ramp` |
| II | `fs-html` | HTML і доступність | core | свій | — |
| II | `fs-css` | CSS: від каскаду до дизайн-систем | core | свій | — |
| II | `javascript-noob-to-god` | JavaScript Zero → Pro | **module** | наявний | — |
| II | `fs-jsi` | JavaScript на співбесіді | core | свій | `fs-js-interview` |
| II | `fs-ts` | TypeScript | core | свій | `fs-typescript` |
| II | `fs-browser` | Браузер і веб-платформа | core | свій | — |
| III | `fs-react` | React від хуків до RSC | core | свій | — |
| III | `nextjs-zero-to-pro` | Next.js Zero → Pro | **module** | наявний | — |
| III | `fs-state` | Стан і дані на фронтенді | core | свій | `fs-fe-state` |
| III | `fs-fetest` | Тестування фронтенду | core | свій | `fs-fe-testing` |
| III | `fs-perf` | Продуктивність вебу | core | свій | `fs-web-perf`, `fs-webperf` |
| IV | `fs-node` | Node.js: рантайм і сервер | core | свій | — |
| IV | `fs-api` | Проєктування API | core | свій | — |
| IV | `fs-auth` | Автентифікація й авторизація | core | свій | — |
| IV | `fs-sql` | SQL і PostgreSQL | core | свій | — |
| IV | `fs-nosql` | NoSQL і Redis | core | свій | — |
| IV | `fs-queues` | Черги, фонові задачі й кешування | core | свій | — |
| V | `fs-integr` | Реальні інтеграції | core | свій | `fs-integrations` |
| VI | `fs-algo` | Алгоритми й «Метод Loo» | core, паралельний потік | свій | `fs-algorithms` |
| VI | `fs-live` | JS і TS лайвкодинг | core | свій | `fs-livecoding`, `fs-js-livecoding` |
| VI | `fs-sqlps` | SQL: розвʼязання задач | core | свій | `fs-sql-ps` |
| VI | `fs-arch` | Архітектура і якість коду | core | свій | `fs-architecture` |
| VI | `fs-testing` | Стратегія тестування | core | свій | — |
| VI | `fs-git` | Git для професіоналів | core | свій | — |
| VII | `fs-netos` | Мережі й операційні системи | core | свій | — |
| VII | `fs-devops` | DevOps і хмара | core | свій | — |
| VII | `fs-obs` | Спостережуваність і надійність | core | свій | `fs-observability` |
| VII | `fs-dist` | Розподілені системи | core | свій | — |
| VII | `fs-sec` | Кібербезпека для інженерів | core | свій | `fs-cybersec`, `fs-security` |
| VII | `fs-sd` | System Design: бекенд і фронтенд | core | свій | `fs-sysdesign`, `fs-system-design` |
| VIII | `fs-ai` | AI-інженерія для фулстеку | core | свій | — |
| VIII | `fs-aidev` | Розробка з ШІ та AI-раунд | core | свій | `fs-ai-dev` |
| IX | `fs-soft` | Soft skills | core, паралельний потік | свій | — |
| IX | `fs-beh` | Behavioral-співбесіди | core, паралельний потік | свій | `fs-behavioral` |
| IX | `fs-psych` | Психологія співбесід і каверзні питання | core, паралельний потік | свій | — |
| IX | `fs-lead` | Tech Lead | core для senior/TL, elective нижче | свій | — |
| IX | `fs-career` | Карʼєра й пошук роботи | core | свій | — |
| X | `english-a1-c2` | English A1 → C2 | **prerequisite** | наявний | — |
| X | `fs-en-core` | English for IT: основа | core, паралельний потік | свій | — |
| X | `fs-en-live` | English for IT: сленг і жива мова | core, паралельний потік | свій | — |
| X | `fs-en-work` | English for IT: робота, продукт, клієнти | core, паралельний потік | свій | — |
| X | `fs-en-int` | English for IT: співбесіди | core, паралельний потік | свій | `fs-en-interview`, `fs-english-it` |
| XI | `fs-playbook` | Interview Playbook | core, відкритий з 1-го дня | свій | — |
| XI | `fs-arena` | Арена: моки й симулятори | core | свій | — |
| XI | `fs-boss` | «Великий бос» | core (фінальний іспит) | свій | — |
| XI | `fs-capstone` | Фінальний SaaS і захист | core | свій | — |

Разом: **46 нових курсів** + **3 наявні** (2 модулі, 1 prerequisite) = 49 курсів у треку; 46 нових бандлів.

## 2. Теми, блоки й вправи

- **Тема** (frontmatter `id:`): `<курс>-<NN>` — двозначний номер теми в курсі, стабільний; приклад `fs-react-07`.
  Розділ (section) курсу має slug `[a-z0-9-]` (≤ 40, рекомендовано ≤ 24), він же id навички розділу (§3).
- **Блок / вправа:** `<курс>-<NN>-<тип><nn>`; приклад `fs-react-07-q03`, `fs-algo-12-task04`, `fs-en-work-31-rp01`.

| Тип | Блок |
|---|---|
| `w` | картка слова (англ.) |
| `c` | флешкартка |
| `q` | квіз (single/multi/fill/order) |
| `qa` | шарова Q&A (`[!interview]`) |
| `po` | predict the output |
| `rd` | recognition drill |
| `task` | задача з раннером (будь-якої мови) |
| `rev` | code review / пошук бага |
| `sd` | system design |
| `tm` | threat model |
| `lab` | лабораторна (безпека, конфіг, Git, shell) |
| `l` | listen |
| `s` | speak |
| `t` | talk |
| `wr` | write |
| `d` | dialogue |
| `rp` | role-play |
| `neg` | переговори з гілками |
| `air` | AI-assisted round |
| `ex` | бос / екзамен |

- **Варіант** концепту (пул §4): суфікс `v<n>` до id вправи: `fs-sql-05-q03v2`.
- Нумерація `nn` — у порядку появи в темі; при видаленні блоку номери **не** зсуваються.

## 3. Навички й граф

- **Навичка курсу** = розділ курсу: id `[a-z0-9-]` ≤ 40 (обмеження `SkillIdSchema`), унікальний у межах курсу, напр. `hooks`,
  `event-loop`, `window-functions`. Рівні — шкала `it`: `noob · junior · middle · senior · god` (`god` показується як
  «Tech Lead»; аліас `techlead`). Мовні курси — CEFR.
- **Глобальний ключ навички** у треку: `<курс>/<навичка>`, напр. `fs-react/hooks`, `fs-sql/indexes`. Його використовують
  маніфест треку, атлас, готовність і реєстр польових питань.
- **Ребра графа** (дані атласу): `requires` (передумова, на рівні навички) і `usedIn` (де застосовується) між глобальними
  ключами; автори outline подають їх таблицями «навичка → передумови»; лідер зводить у маніфест треку в етапі 1.
- **Мапа §4/§4a → навички** будується в етапі 1 (крок «граф навичок») з колонок outline-файлів; кожен пункт §4 має ≥ 1
  ключ, рівень і типи питань.

## 4. Власник концепту (антидублювання)

Кожен концепт має **одну домашню навичку** — там теорія, шарова Q&A і пул варіантів. Інші курси **посилаються** на неї
й додають лише свій ракурс (тип вправ, а не повтор теорії).

| Концепт | Власник | Інші курси додають |
|---|---|---|
| XSS, CSP, CORS, cookies/SameSite | `fs-browser` | `fs-sec`: атакувальний ракурс, лаби; `fs-auth`: серверні заголовки |
| CSRF, сесії, JWT, OAuth/OIDC, PKCE, відновлення акаунта | `fs-auth` | `fs-sec`: атаки на identity, threat models |
| OWASP Top 10:2025, API Top 10:2023, secure code review, threat modeling | `fs-sec` | інші — по 1 вправі-посиланню |
| Віконні функції, CTE, рекурсія, gaps-and-islands | `fs-sql` (теорія) | `fs-sqlps`: задачі на час, без нової теорії |
| Debounce/throttle, скасування, гонки в UI | `fs-state` (теорія) | `fs-react`: machine coding; `fs-live`: polyfill на час |
| Event loop (браузер) | `javascript-noob-to-god` + `fs-jsi` (Q&A) | `fs-node`: фази libuv (своя навичка) |
| Кешування HTTP | `fs-browser` | спіраль: `fs-state`, `nextjs-zero-to-pro`, `fs-queues`, `fs-sd` — кожен свій виток |
| Типові челенджі TypeScript (DeepReadonly, UnionToIntersection, typed emitter…) | `fs-ts` | `fs-live`: лише таймовані набори з пулу `fs-ts` + «типізуй реальний API» |
| Ідемпотентність, rate limiting, пагінація | `fs-api` | `fs-integr`, `fs-sd`: застосування |
| Вебхуки (вхідні/вихідні, підписи, replay) | `fs-integr` | `fs-api`: посилання |
| Retries з jitter, timeouts, circuit breaker, bulkhead | `fs-dist` | `fs-integr`, `fs-live`: задачі |
| Outbox, DLQ, стратегії кешу (cache-aside, write-through, stampede) | `fs-queues` | `fs-sd`: дизайни |
| Структури даних Redis | `fs-nosql` | `fs-queues`: застосування |
| Криптографія для інженерів, supply chain | `fs-sec` | `fs-auth`: зберігання паролів (свій ракурс) |
| Основи shell | `fs-tools` | `fs-devops`: Linux у проді |
| Патерни алгоритмів | `fs-algo` (тема = патерн; сигнали готовності — на рівні теми) | `fs-live`, `fs-sqlps`: застосування |

Рецензійний гейт кожної партії: Haiku-скан дублікатів формулювань Q&A в межах концепту.

## 5. Журнал змін

- 2026-11-09 — створено (етап 0, після рецензії `review-stage0.md` B1/M10).
- 2026-11-09 — додано власників (api, integr, dist, queues, nosql, sec, tools, algo) за пропозицією outline IV–VII; slug ≤ 40.
