# Stage 0 outline — Parts VIII (AI та LLM), IX (Професіонал і лідер), XI (Арена співбесід)

> Syllabus designer's outline for the lead. Revision 2 (2026-11-09), reconciled with the research
> (`research/loops.md`, `research/tricky-and-psychology.md`, `research/market-2026.md`, all researched 2026-11-08), the
> review `review-stage0.md` (B1, B2, M8, M9, minors 12–15) and the canonical `registry.md`. Spec:
> `docs/prompts/fullstack-course.md`. Learner-facing titles are Ukrainian; author notes are English.
> Company and platform facts are **reported** (candidate or third-party accounts) unless the company published them
> («official»), always with the date from the research; each sits in a «дані на дату» box (§0.4).

## 0. Totals

Abbreviations:
- **Gate pool** — auto-checked `q` items **including variants** (`v<n>`). These are the gate items: 3 gate concepts per
  topic (1 core × 8 variants + 2 × 6 variants = 20 per topic), or a generator (§5.3).
- **Q&A** — layered `[!interview]` cards (`qa`). They count towards the §5.1 «Theory Q&A ≥ 3,500». They are FSRS
  items, not gate items.
- **Cards** — `[!question]` flashcards (`c`).
- **Talk** — `t` monologues and `rp` role-plays in normal mode.
- **Stress** — `rp` role-plays in stress mode.
- **Neg** — `neg`, a branching negotiation simulation.
- **Write** — `wr`.
- **Tricky** — recruiter and interviewer tricky questions. Each one is a `qa` card + an `rp` role-play, with UA + EN
  samples.
- **Beh** — behavioral, soft and TL questions with story templates, plus leadership cases.
- **AI-R** — AI-assisted round tasks (`air`, §5.4).
- **Labs** — coded `task` items.
- **Rub** — authored rubrics.
- **TH** — take-homes.
- **Hours** — learner hours, first full pass incl. retakes and the mistakes loop (basis in §8).

### 0.1 Per course

| Course id | Part | Role | Topics | Words | Gate pool | Q&A | Cards | Reels | Talk | Stress | Neg | Write | Tricky | Beh | AI-R | Labs | Rub | TH | Hours | Other |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `fs-ai` | VIII | core | 45 | 125k | 900 | 260 | 520 | 135 | 30 | – | – | 12 | – | – | – | 70 | 20 | – | 106 | 6 AI designs × 3 prompt variants = 18 `sd` |
| `fs-aidev` | VIII | core | 29 | 65k | 440 | 80 | 200 | 87 | 42 | – | – | 10 | – | – | **32** | – | 8 | – | 90 | 120 suggestion-review drills (`rev`); Part VIII boss + capstone |
| `fs-soft` | IX | core, parallel stream | 28 | 45k | 560 | – | 180 | 84 | 40 | – | – | 25 | – | 30 | – | – | 10 | – | 32 | |
| `fs-beh` | IX | core, parallel stream | 30 | 55k | 600 | – | 190 | 90 | 160 | 6 | – | 15 | – | 130 | – | – | 17 | – | 46 | 20 calibration samples; story bank |
| `fs-psych` | IX | core, parallel stream | 41 | 95k | 820 | – | 250 | 123 | 280 | 48 | 36 | 20 | **280** | – | – | – | 30 | – | 94 | 20 calibration samples |
| `fs-lead` | IX | core for S/TL targets, elective below | 36 | 70k | 720 | 140 | 220 | 108 | 60 | 4 | 6 | 30 | – | 90 (40 Qs + 50 cases) | – | – | 15 | – | 52 | 10 calibration samples |
| `fs-career` | IX | core | 30 | 50k | 560 | 60 | 180 | 90 | 25 | – | 12 | 40 | – | – | – | – | 12 | – | 44 | 4 calculators; Part IX boss + capstone |
| `fs-playbook` | XI | core, open from day one (no gate) | 30 | 55k | 180 (not gating) | 60 | 180 | 90 | 10 | – | – | 6 | – | – | – | – | 2 | – | 25 | loop, platform and prep-plan maps as data |
| `fs-arena` | XI | core: practice bank + mock hub | 44 | 75k | – | – | – | – | 40 | 6 | (reuses) | – | – | – | (reuses 32) | – | 19 | **8** | 60 typical / 340 full | **40 loops, 18 sim variants**, 56 round drills, 60 calibration samples, 58 generated scorecards; Part XI capstone |
| `fs-boss` | XI | final exam «Великий бос» | 4 | 12k | (draws from all) | – | – | – | – | – | – | – | – | – | – | – | 2 | – | 15 | 6 exam variants from one blueprint |
| `fs-capstone` | XI | final capstone (production SaaS) + defense | 18 | 30k | 110 (not gating) | 80 | 110 | 54 | 30 | 2 | – | 8 | – | – | – | 11 milestones | 14 | – | 150 | 3 product briefs |

### 0.2 Per part and vs §5.1 minimums

| | Topics | Words | Gate pool | Q&A | Cards | Talk | Stress | Neg | Write | Tricky | Beh | AI-R | TH | Loops | Sims | Hours |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **VIII** (`fs-ai`, `fs-aidev`) | 74 | 190k | 1,340 | 340 | 720 | 72 | 0 | 0 | 22 | – | – | 32 | – | – | – | 196 |
| **IX** (`fs-soft`, `fs-beh`, `fs-psych`, `fs-lead`, `fs-career`) | 165 | 315k | 3,260 | 200 | 1,020 | 565 | 58 | 54 | 130 | 280 | 250 | – | – | – | – | 268 |
| **XI** (`fs-playbook`, `fs-arena`, `fs-boss`, `fs-capstone`) | 96 | 172k | 290 | 140 | 290 | 80 | 8 | (reuse) | 14 | – | – | (reuse) | 8 | 40 | 18 | 250 (typical arena) |
| **Total** | **335** | **≈ 677k** | **4,890** | 680 | 2,030 | 717 | 66 | 54 | 166 | 280 | 250 | 32 | 8 | 40 | 18 | **≈ 714** (fast lane ≈ 210, §8.2) |
| **§5.1 minimum** | | | | 3,500 (track) | 6,000 (track) | | **≥ 40** | **≥ 30** | | **≥ 250** | **≥ 150** | **≥ 25** | **≥ 8** | **≥ 30** | **≥ 4 × 3** | |
| **Status** | | | B2 budget met (§5.3) | 19% of track | 34% of track | | 165% | 180% | | 112% | 167% | 128% | **100% (all 8 here)** | 133% | 150% | |

Other §5.1 lines:
- **Capstones:** 3 of the 11 part capstones (VIII, IX, XI) + the final production SaaS.
- **System design:** 6 AI designs on top of Part VII.
- **Field question bank:** every recruiter, behavioral, platform and AI-round question maps to a topic here (§10.1).
- **Boss exams:** Part VIII is `fs-aidev-27`, Part IX is `fs-career-29`, Part XI is `fs-boss`.

**Gate pool authoring.** About 250 of the 4,890 gate slots are **generators** (parametric items with unlimited
variants), e.g. token-cost and latency budgets, recall@k/MRR, chunk counts, contractor net, hourly ↔ monthly, offer
comparison, DORA metrics and Fermi estimates. The other ≈ 4,640 are authored. Situational-judgement items change the
scenario per variant, so they are not reworded copies. Exercise text is **not** in the word column, which counts theory
only. At about 50 words per gate item, the pools add ≈ 230k words of authoring.

**Word budget.** ≈ 677k is ≈ 23–27% of the 2.5–3M track. Part IX is text-heavy because every tricky question has model
answers per level and situation, in UA **and** EN. If the lead needs to cut:
- cut the `fs-psych` samples to two levels (≈ −20k);
- cut the `fs-lead` narrative (≈ −10k);
- keep the exercises.

### 0.3 Conventions (per `registry.md`)

- **Course ids:** `fs-ai`, `fs-aidev`, `fs-soft`, `fs-beh`, `fs-psych`, `fs-lead`, `fs-career`, `fs-playbook`,
  `fs-arena`, `fs-boss`, `fs-capstone`. Other parts are referenced by registry id: `fs-ts`, `fs-react`, `fs-state`,
  `fs-node`, `fs-api`, `fs-auth`, `fs-sql`, `fs-queues`, `fs-integr`, `fs-algo`, `fs-live`, `fs-arch`, `fs-testing`,
  `fs-git`, `fs-devops`, `fs-obs`, `fs-dist`, `fs-sec`, `fs-sd`, `fs-en-work`, `fs-en-int`, `nextjs-zero-to-pro`,
  `javascript-noob-to-god`.
- **Topics:** `<course>-<NN>` (frontmatter `id:`), e.g. `fs-psych-04`.
- **Exercises:** `<course>-<NN>-<type><nn>`, with codes from registry §2, e.g. `fs-psych-04-rp03`, `fs-ai-23-task02`,
  `fs-aidev-25-air04`, `fs-aidev-10-rev07`, `fs-ai-44-sd02`, `fs-arena-24-ex03`.
  - Stress scenarios are `rp` with `mode: stress`.
  - Loops, simulators and boss exams are `ex`.
  - Take-homes are `task`.
  - Calibration samples are `q` ("grade this answer").
  - Variants: `…q03v2`.
- **Skills:** skill = course section. The section slug is the skill id; the global key is `<course>/<skill>`, e.g.
  `fs-ai/rag`. Each course below has a «навичка → передумови» table with `requires` edges.
  - Slugs of other parts come from their outlines, renamed to registry course ids (e.g. `fs-cybersec.injection` →
    `fs-sec/injection`).
  - Slugs marked **(TBC)** are not fixed yet in `outline-english-for-it.md` or the Part V outline.
- **Levels:** J / M / S / TL = `junior` / `middle` / `senior` / `god` («Tech Lead»). `noob` is used only where marked.
- **Every topic has:**
  - «що ти вже знаєш → що нового → де це використовується»;
  - recall questions;
  - «як відповісти на співбесіді» for each applicable level (30 s / 2 min / senior nuance / follow-ups / red flags);
  - a one-page Atlas summary.
- **Every open exercise** has a rubric with ≥ 3 prompt variants (§5.3).

### 0.4 «Дані на дату» — dated facts and expiry (minor 14)

Every reported fact sits in a `> [!note] Дані на дату` box with `source`, `reported: YYYY-MM-DD` and
`reviewed: YYYY-MM-DD`. It also gets `expires: reviewed + 6 months` (3 months for AI-round policies and model
landscape, because they move fastest). This applies to:
- platform stages and pass rates;
- company loops and AI-round policies;
- rates and salaries;
- tax and legal notes;
- OWASP LLM Top 10 version;
- model and provider landscape;
- Karat and other survey figures.

Structured data (`fs-career/data/rates-*.yaml`, `fs-playbook/data/loops/*.yaml`, `data/platforms/*.yaml`) carries the
same fields.

Platform:
- `course:check` warns on expired boxes;
- the UI shows «можливо застаріло» after expiry;
- the lead's batch checklist includes an **owner check per batch**: the owner re-reads or re-confirms the boxes that
  expire within the next batch.

---

## 1. Part VIII — AI та LLM

Spiral links:
- HTTP and streaming (`fs-node/streams`) → SSE in `fs-ai` S4.
- Caching (`fs-queues/cache-strategies`) → prompt caching and semantic caching (`fs-ai-36`).
- OWASP Top 10:2025 (`fs-sec`) → OWASP LLM Top 10 (`fs-ai-40`) → security review of AI code (`fs-aidev-06`).
- Testing strategy → evals (`fs-ai` S6) → tests that expose bad AI suggestions (`fs-aidev-12`).
- `fs-sd/method` → AI designs (`fs-ai-44`).

**Free-by-design rule.** No lab in this part calls a paid model. Labs run against:
- a **deterministic mock provider** in the worker, with AI SDK call shapes (text, stream, structured object, tool
  calls) served from fixtures;
- **pre-computed embeddings** for the lab corpora;
- **PGlite + pgvector**.

Learners may use their own key in their own capstone repo, outside Loo. Model names and prices go only into dated
boxes (3-month expiry). The content teaches how to look them up.

### 1.1 `fs-ai` — «AI-інженерія для фулстеку»

Role: core. Levels: J 10% · M 40% · S 40% · TL 10%. Recommended before S8: `fs-sec` S «injection» (S8 recaps the
minimum).

| Навичка (розділ) | `requires` |
|---|---|
| `fs-ai/llm-basics` | `fs-ts/ts-basics`, `fs-api/rest` |
| `fs-ai/prompting` | `fs-ai/llm-basics`, `fs-ts/ts-generics` |
| `fs-ai/tools-agents` | `fs-ai/prompting`, `fs-queues/jobs` |
| `fs-ai/ai-ui` | `fs-ai/llm-basics`, `fs-node/streams`, `fs-react/react-effects`, `nextjs-zero-to-pro/data`, `nextjs-zero-to-pro/mutations` |
| `fs-ai/rag` | `fs-ai/prompting`, `fs-sql/indexes`, `fs-auth/authz` |
| `fs-ai/evals` | `fs-ai/rag`, `fs-testing/strategy`, `fs-obs/otel` |
| `fs-ai/cost-reliability` | `fs-ai/ai-ui`, `fs-queues/cache-strategies`, `fs-dist/resilience` |
| `fs-ai/ai-security` | `fs-ai/tools-agents`, `fs-ai/rag`, `fs-sec/injection`, `fs-sec/threat-modeling` |
| `fs-ai/ai-product` | all of the above, `fs-sd/method` |

`usedIn` edges: `fs-aidev/*`, `fs-capstone/milestones`, `fs-sd/be-product`.

| Id | Тема | Рів. | Ціль (після теми вміє…) |
|---|---|---|---|
| **S1** | **`llm-basics` — Основи LLM** | | |
| fs-ai-01 | Як працює LLM: токени, контекстне вікно, семплінг | J | пояснити генерацію токен за токеном, temperature/top-p, недетермінізм |
| fs-ai-02 | Ландшафт моделей: провайдери, open-weight, як обирати й де дивитися актуальне | J | порівняти моделі за якістю, ціною, латентністю, контекстом (дані на дату) |
| fs-ai-03 | LLM API: повідомлення, ролі, system prompt, параметри, ліміти | J | зробити виклик, розібрати usage і finish reason |
| fs-ai-04 | Провайдер-агностичний доступ: AI SDK, gateway, fallback | M | перемкнути провайдера без зміни коду |
| fs-ai-05 | Помилки й ліміти API: rate limits, retries з backoff, таймаути | M | обробити 429/5xx, ретраї з jitter, AbortController |
| **S2** | **`prompting` — Промпти й структуровані виходи** | | |
| fs-ai-06 | Промпт-інжиніринг як інженерія: інструкції, приклади, формат, версії | J | написати промпт з обмеженнями й форматом, версіонувати в коді |
| fs-ai-07 | Few-shot, chain-of-thought і reasoning-моделі | M | обрати техніку; пояснити ціну reasoning у латентності |
| fs-ai-08 | Структуровані виходи: JSON-схеми, zod, валідація і ремонт | M | отримати типізований об'єкт, обробити невалідну відповідь |
| fs-ai-09 | Класифікація, екстракція, підсумки: продуктові задачі | M | класифікатор і екстрактор зі схемою та тестами |
| fs-ai-10 | Промпти в коді: тестованість, шаблони, prompt caching | M | винести промпти в модулі, кешувати статичну частину |
| **S3** | **`tools-agents` — Tool use і агенти** | | |
| fs-ai-11 | Tool calling: схема інструментів, цикл виклику, помилки | M | цикл model → tool → model з обробкою помилки інструмента |
| fs-ai-12 | Агентний цикл: кроки, умова зупинки, бюджет | S | агент з лімітом кроків і токенів, журнал кроків |
| fs-ai-13 | MCP: сервери, клієнти, безпека інтеграцій | S | підключити інструменти, оцінити довіру до сервера |
| fs-ai-14 | Human-in-the-loop: підтвердження, незворотні дії, аудит | S | крок підтвердження і журнал аудиту для небезпечних інструментів |
| fs-ai-15 | Мультиагентні патерни і коли вони не потрібні | S/TL | обґрунтувати простіший варіант |
| fs-ai-16 | Довгі задачі: durable workflows, черги, відновлення | S | агент у фоновій задачі з відновленням після збою |
| **S4** | **`ai-ui` — Стрімінг і AI-UI в Next.js** | | |
| fs-ai-17 | Стрімінг: SSE, ReadableStream, backpressure, скасування | M | стрімити відповідь у UI і коректно скасувати |
| fs-ai-18 | AI-фічі в Next.js: route handlers, server actions, чат-хуки | M | чат з AI SDK у Next.js (API звіряти з актуальною документацією) |
| fs-ai-19 | UX AI-фіч: стани, часткові відповіді, помилки, regenerate, оцінка відповіді | M | спроєктувати всі стани, зокрема повільну модель |
| fs-ai-20 | Рендер tool-результатів і generative UI | M/S | типобезпечний компонент для результату інструмента |
| fs-ai-21 | Стан чату: історія, обрізання контексту, збереження, тенанти | S | обрізати контекст за бюджетом, ізолювати тенанти |
| **S5** | **`rag` — Embeddings, векторні БД, RAG** | | |
| fs-ai-22 | Embeddings: косинусна близькість, розмірність, нормалізація | M | порахувати близькість і пояснити її |
| fs-ai-23 | Векторний пошук: pgvector, HNSW і IVFFlat | S | створити індекс, виміряти recall і латентність |
| fs-ai-24 | RAG-пайплайн: ingestion, chunking, метадані, перевиндексація | M | пайплайн від документа до чанків з метаданими |
| fs-ai-25 | Гібридний пошук і reranking | S | поєднати full-text і вектори, додати reranker |
| fs-ai-26 | Генерація з контекстом: цитування, grounding, «не знаю» | M | відповіді лише з контексту, з посиланнями |
| fs-ai-27 | Просунутий RAG: query rewriting, multi-hop, агентний RAG, long context | S | обрати стратегію; пояснити, коли RAG зайвий |
| fs-ai-28 | Права доступу в RAG: ACL на чанках, тенанти, витоки | S | фільтрувати retrieval за правами до генерації |
| **S6** | **`evals` — Evals і якість** | | |
| fs-ai-29 | Навіщо evals: недетермінізм, регресії, golden datasets | M | golden set і eval-скрипт |
| fs-ai-30 | Типи оцінювання: exact/regex, схема, LLM-as-judge, людина, pairwise | S | обрати метод, знати упередження judge-моделей |
| fs-ai-31 | Evals для RAG: recall@k, MRR, faithfulness, relevance | S | окремо виміряти retrieval і генерацію |
| fs-ai-32 | Evals у CI і в проді: пороги, версії промптів і моделей, A/B | S | заблокувати реліз промпта з гіршим eval |
| fs-ai-33 | Observability для LLM: трейси, токени, латентність, фідбек | S | дашборд вартості й якості |
| **S7** | **`cost-reliability` — Вартість, латентність, надійність** | | |
| fs-ai-34 | Економіка токенів: вартість фічі, бюджети, ліміти на користувача | M | вартість на запит, користувача, місяць |
| fs-ai-35 | Латентність: TTFT, стрімінг, менші моделі, паралелізм | S | скоротити TTFT, пояснити компроміси якості |
| fs-ai-36 | Кешування: prompt caching, семантичний кеш, ризики | S | оцінити ризик хибного влучання |
| fs-ai-37 | Надійність: fallback-моделі, деградація, circuit breaker | S | поведінка при недоступності провайдера |
| **S8** | **`ai-security` — Безпека AI-фіч** | | |
| fs-ai-38 | Prompt injection: пряма й непряма; чому промпт її не «лікує» | S | атака через документ у RAG і через результат інструмента |
| fs-ai-39 | Захист: найменші привілеї, ізоляція, підтвердження, фільтри виходу | S | багатошаровий захист і залишковий ризик |
| fs-ai-40 | OWASP Top 10 for LLM Applications (версія в боксі «дані на дату»), витоки, PII | S | пройти категорії на своєму застосунку |
| fs-ai-41 | Модерація, зловживання, ліміти, право (GDPR, EU AI Act на рівні інженера) | S/TL | що закон вимагає від коду (дані на дату) |
| **S9** | **`ai-product` — AI у продукті і на співбесіді** | | |
| fs-ai-42 | Чи потрібна AI-фіча: product sense, метрики, ризики | TL | цінність, вартість, ризик, метрика успіху |
| fs-ai-43 | Prompting vs RAG vs fine-tuning: дерево рішень | S/TL | обрати підхід з аргументами і цифрами |
| fs-ai-44 | AI system design: 6 дизайнів | S/TL | дизайн за 7 кроками «Методу Loo» з оцінками й компромісами |
| fs-ai-45 | Співбесіда з AI engineering: банк питань і follow-ups | M–TL | layered answers, що витримують follow-ups |

**The 6 AI designs (`fs-ai-44-sd01…06`).** Each design has 3 prompt variants (scale, tenancy, budget), estimates, a
`[!diagram]`, trade-offs, a rubric and a `t` walkthrough. The designs:
1. support assistant with RAG over a tenant's docs;
2. LLM gateway (routing, fallback, budgets, cache, observability);
3. semantic search for a marketplace;
4. AI code-review bot;
5. document-ingestion pipeline at scale;
6. an agent that takes real actions with approvals and audit.

**Exercise mix:**
- gate pool 900;
- Q&A 260;
- cards 520;
- reels 135;
- **labs 70** against the mock provider, following §5.2a. Examples:
  - schema parse and repair;
  - retry wrapper;
  - tool loop with budget;
  - stream parser;
  - context trimmer;
  - chunkers (fixed → structural → semantic, as variants);
  - cosine top-k;
  - RRF merge;
  - eval harness;
  - recall@k and MRR;
  - cost calculator;
  - semantic cache;
  - injection filter + why it is insufficient;
  - ACL-filtered retrieval in PGlite + pgvector;
- talk 30;
- write 12 (design doc, eval report, ADR "RAG vs fine-tuning", model-outage note);
- rubrics 20.

### 1.2 `fs-aidev` — «Розробка з ШІ та AI-раунд»

Role: core. Levels: J 10% · M 35% · S 45% · TL 10%.

| Навичка | `requires` |
|---|---|
| `fs-aidev/ai-workflow` | `fs-ai/prompting`, `fs-git/team-git` |
| `fs-aidev/ai-code-review` | `fs-aidev/ai-workflow`, `fs-arch/review-quality`, `fs-sec/sdlc` |
| `fs-aidev/verification` | `fs-testing/unit-doubles`, `fs-testing/strategy` |
| `fs-aidev/comprehension` | `fs-arch/app-architecture` |
| `fs-aidev/ai-round` | `fs-aidev/ai-code-review`, `fs-aidev/verification` |
| `fs-aidev/air-trainer` | `fs-aidev/ai-round`, `fs-live/utils`, `fs-react/react-machine-coding`, `fs-node/http`, `fs-sql/transactions` |
| `fs-aidev/part8-final` | all `fs-ai/*`, all `fs-aidev/*` (boss/capstone section; evidence for every Part VIII domain) |

| Id | Тема | Рів. | Ціль |
|---|---|---|---|
| **S1** | **`ai-workflow` — Робочий процес з AI-інструментами** | | |
| fs-aidev-01 | Карта інструментів: автодоповнення, чат, агенти в IDE і терміналі (дані на дату, без прив'язки до вендора) | J | обрати інструмент під задачу |
| fs-aidev-02 | Контекст — головне: файли, правила проєкту, обмеження | M | дати моделі рівно потрібний контекст |
| fs-aidev-03 | Цикл «план → маленький крок → перевірка» | M | агентна розробка малими перевірюваними кроками |
| fs-aidev-04 | Коли AI шкодить: навчання, інваріанти, безпека, ліцензії; політика команди | S/TL | командні правила використання AI |
| **S2** | **`ai-code-review` — Критичне рев'ю AI-коду** | | |
| fs-aidev-05 | Таксономія помилок AI-коду: вигадані API, застарілі версії, пропущені краї, тихі зміни поведінки | M | класифікувати ваду підказки |
| fs-aidev-06 | Безпекові дірки: injection, секрети, перевірки доступу, небезпечні дефолти | S | знайти дірку і пояснити атаку |
| fs-aidev-07 | Конкурентність і стан: гонки, stale closures, неідемпотентні ретраї | S | довести гонку тестом |
| fs-aidev-08 | Тести, що нічого не перевіряють: over-mocking, тавтології, snapshot-зловживання | M | відрізнити тест, що ловить баг |
| fs-aidev-09 | Продуктивність і масштаб: N+1, O(n²), витоки пам'яті | S | помітити проблему складності чи пам'яті |
| fs-aidev-10 | Рев'ю великого AI-диффу: стратегія, чекліст, коментарі | M/S | рев'ю 300+ рядків з пріоритетами |
| **S3** | **`verification` — Верифікація** | | |
| fs-aidev-11 | Читай перш ніж запускати: dry-run, інваріанти, типи | M | перевірити підказку руками |
| fs-aidev-12 | Тести, що ловлять погану підказку: від прикладу до property-based і mutation thinking | S | тест падає на хибній підказці й проходить на правильному коді |
| fs-aidev-13 | Перевірка API й залежностей: доки, типи, lockfile, typosquatting | S | спростувати вигаданий API і підозрілий пакет |
| fs-aidev-14 | Дебаг разом з AI: гіпотези, мінімальне відтворення | M | керувати дебагом, не «вгадувати фікс» |
| **S4** | **`comprehension` — Code comprehension з AI** | | |
| fs-aidev-15 | Як читати незнайому кодову базу | M | за 15 хв скласти карту мультифайлового проєкту |
| fs-aidev-16 | AI-пояснення коду: як перевірити, що воно правдиве | S | знайти хибні твердження через код і тести |
| fs-aidev-17 | Розширити фічу в чужому мультифайловому проєкті | S | зміна без поломки суміжних модулів |
| **S5** | **`ai-round` — AI-раунд на співбесіді** | | |
| fs-aidev-18 | Формати 2026 (дані на дату, 3 міс.) | M | знати формат, тривалість, критерії й статус кожного відомого типу |
| fs-aidev-19 | Рубрика AI-раунду: розв'язання, якість коду, верифікація, комунікація | S | оцінити свій прогін |
| fs-aidev-20 | Промпти під час інтерв'ю: коротко, з контекстом і критеріями перевірки | M | промпт, який інтерв'юер оцінить як зрілий |
| fs-aidev-21 | Говорити вголос: пояснити прийняття і відхилення підказок | M | коментувати рішення щодо кожної підказки |
| fs-aidev-22 | No-AI раунди і чесність: політики, disclosure, «поясни своє рішення без AI» | J | дотримуватись правил раунду |
| **S6** | **`air-trainer` — Тренажер AI-раунду** (§1.3) | | |
| fs-aidev-23 | Трек A: JS/TS-модулі (8) | M/S | |
| fs-aidev-24 | Трек B: React/Next.js (8) | M/S | |
| fs-aidev-25 | Трек C: Node API, дані, SQL (10) | S | |
| fs-aidev-26 | Трек D: code comprehension і великі зміни (6) | S/TL | |
| **S7** | **`part8-final` — Фінал частини VIII** | | |
| fs-aidev-27 | Бос частини VIII: змішаний тест + 2 AI-раунди + 1 AI-дизайн | M–S | 100% gate (§5) |
| fs-aidev-28 | Capstone частини VIII: AI-асистент для SaaS (RAG + tools + evals + ліміти вартості), зібраний з AI-інструментами | S | усі пункти рубрики |
| fs-aidev-29 | Захист capstone (UA + EN) | S | `t` + рубрика |

**Content of `fs-aidev-18` (dated, «reported» unless official; research 2026-11-08):**
- **Meta** (reported): an AI-enabled round piloted since Oct 2025. It is 60 min in a multi-file CoderPad with an AI chat
  and runnable tests, and it replaces one of two onsite coding rounds. The other coding round stays no-AI, 45 min.
  "Rolling out through 2026" is a prep-site claim, not confirmed as universal.
- **Google** (reported): a "code comprehension with Gemini" pilot since May 2026 (Business Insider). BI reported a
  wider rollout on 2026-10-20. A Google spokesperson says the formats **remain pilot-phase**. Graded on AI fluency,
  prompting, output validation and debugging. The classic coding round still bans AI.
- **Canva** (official, June 2025): AI-assisted coding replaces the CS-fundamentals screen.
- **DoorDash** (official, Mar 2026): a 60-min AI working session on your own machine.
- **Amazon** (reported 2026): bans the candidate's own AI, but embeds its own assistant in the online assessment, and a
  GenAI behavioral question appears in loops.
- **Goldman Sachs, Anthropic:** prohibit outside AI (Fortune, 2025).
- **LinkedIn:** candidate reports only.
- **Karat** (Jan 2026, 400 leaders in the US, India and China): 62% of all organisations prohibit AI; in the US, 38%
  allow it. The two numbers have different bases, and the content says so.
- **Ukraine** (DOU, 2026-11-06): some companies keep test tasks with AI allowed and probe "explain your solution"; others
  replaced them with live interviews.

**Exercise mix:**
- gate pool 440 (22 gated topics × 20);
- Q&A 80;
- cards 200;
- reels 87;
- **AI-round 32**;
- **120 suggestion-review drills** (`rev`): one diff → accept / reject / modify + flaw type. This is this domain's
  recognition drill.
- talk 42;
- write 10;
- rubrics 8.

### 1.3 The AI-assisted round trainer (free simulation, §5.4)

**Task anatomy** (authored once):
- brief (45–60 min);
- a multi-file project (5–15 files, virtual FS in the worker);
- visible and hidden tests;
- the **scripted assistant**: turns keyed by intent (implement / write tests / explain / fix failure / refactor), each
  with 1–3 diff suggestions labelled server-side (`correct` | `flawed:<type>`), plus the reference fix;
- a prompt-quality checklist;
- the explanation rubric.

**Flow:**
1. Read the brief and the codebase.
2. Write a free prompt and pick its intent. No model runs: the scripted suggestions appear, and the content says
   openly that the suggestions are pre-written. The prompt is checked against the checklist: partly automatically
   (files or functions named, an acceptance criterion present), partly by self-assessment.
3. For each suggestion: accept, reject or edit, and name the flaw type if you reject it.
4. Write tests. **Mutation grading** on the server: your tests must pass on the reference solution and fail on every
   flawed suggestion.
5. Fix and extend until the hidden tests pass.
6. Explain your decisions (`t`, EN after the first pass).

**Scoring:** problem solving, code quality, **verification** (decision accuracy, mutation result, hallucinated API
caught) and communication — the dimensions the reported Meta and Google formats grade. Readiness counts only runs
without reveals.

**Catalog** (`fs-aidev-23-air01…08` = A1–A8, `24-air01…08` = B, `25-air01…10` = C, `26-air01…06` = D):

| Id | Task | Planted flaws (examples) |
|---|---|---|
| A1 | Token-bucket rate limiter | hallucinated API; refill off-by-one |
| A2 | Retry with backoff + cancellation | ignores abort during sleep; retries non-idempotent errors |
| A3 | Promise pool | counter race; result order lost |
| A4 | Deep-merge config | prototype pollution |
| A5 | CSV parser | quoted commas and newlines; BOM (the correct suggestion handles it) |
| A6 | Date-range utilities | local time instead of UTC; DST |
| A7 | LRU cache with TTL | expired entry returned; eviction order |
| A8 | Typed event emitter (TS) | `any` hides a payload type error |
| B1 | Autocomplete with debounce | stale responses win; no abort |
| B2 | Form + server action | validation only on the client |
| B3 | Infinite list | effect loop; observer leak |
| B4 | Update via server action | missing authorization (IDOR) |
| B5 | Accessible modal | no focus trap, wrong ARIA (one correct suggestion) |
| B6 | Data table | mutates props; wrong memo deps |
| B7 | Next.js caching of user data | per-user data cached globally; outdated caching API |
| B8 | Markdown preview | XSS via raw HTML |
| C1 | Payment webhook handler | no signature check; not idempotent |
| C2 | Paginated endpoint | offset bug; SQL injection via the sort parameter |
| C3 | File upload | path traversal; no size limit |
| C4 | Job worker | infinite retry, no dead letter; duplicated side effects |
| C5 | JWT middleware | algorithm not pinned; expiry not checked |
| C6 | Resolver with N+1 | correct batching suggestion vs a cache keyed wrongly |
| C7 | SQL revenue report (PGlite) | join fan-out doubles sums |
| C8 | Balance transfer (PGlite) | double-spend race; missing row lock |
| C9 | Rate limit by client IP | trusts a spoofable forwarded header |
| C10 | Large CSV stream | whole file in memory; ignores backpressure |
| D1 | Explain an order service | 2 false claims in the AI explanation |
| D2 | Feature flag across modules | unrelated module silently changed |
| D3 | Callbacks → async/await | an error path dropped |
| D4 | Refactor money logic | rounding semantics changed |
| D5 | Upgrade a fictional library to v2 (docs given) | v1 API used (stale knowledge) |
| D6 | Debug a failing test in 10 files | two wrong AI hypotheses |

Track C uses blueprint decision 9.3, «Node via mocked I/O»:
- C1–C5, C9 and C10 run as modules with fake request and response objects;
- C7 and C8 run in PGlite.

---

## 2. Part IX — Професіонал і лідер

All five courses are **parallel streams** with their own gates and pace, in the daily mix from week one. The exception is
`fs-lead`, which unlocks after `fs-beh/story-method` and one Part VII course.

**Batch 1** (spec §10) contains:
- `fs-playbook`, the whole course;
- `fs-psych` S2;
- `fs-soft` S1–S2;
- `fs-beh` S1–S2.

**Spirals:**
- Feedback (`fs-soft-09`) → code-review culture (`fs-lead-21`).
- Estimation (`fs-soft-21`) → team planning (`fs-lead-13`).
- Negotiation psychology (`fs-psych` S8) → practical negotiation (`fs-career` S6) → offer loop in the arena.
- Story bank (`fs-beh-06`) → every behavioral round, the TL cases and the capstone defense.

**Shared formats:**
- **Tricky question unit.** A `qa` card with these parts:
  - «що насправді перевіряють»;
  - «каркас відповіді»;
  - «сильні відповіді» by level and situation, in UA + EN;
  - «чого ніколи не казати»;
  - «типові follow-ups».

  Plus an `rp` role-play with a TTS recruiter, a rubric, and `frequency:` / `source:` from the field bank.
- **Behavioral unit.** A question + competency + level + **story template**. The template slots are: context, your
  role, the tension, actions with "I", numbers, result, and what you'd change. Each unit also has a weak and a strong
  model answer and 3–5 scripted follow-ups.
- **Stress scenario** (`rp`, `mode: stress`).
  - A timeline of scripted events drawn randomly from a pool, so a retake differs. The event types come from the
    researched practitioner sources: silence after an answer (up to 30–60 s), visible disinterest, rapid-fire, direct
    challenges ("That doesn't sound very impressive"), repeated questions, interruptions.
  - The rubric measures composure behaviours:
    - a deliberate pause;
    - acknowledge, then evidence once, then stop;
    - no repeated apology;
    - no capitulation when right, and a plain correction when wrong;
    - naming the structure;
    - not filling the silence with retractions.
  - Course content notes the reported legal risk: stress tactics applied to one protected group can be disparate
    treatment.
- **«PAUSE» — мнемонік Loo**, not a published method. Research found no published interview framework with this
  expansion. The two similar published acronyms (an implicit-bias P.A.U.S.E. and a coaching "PAUSE model") are
  different things. Loo states that it is its own mnemonic, built from the practices above:
  - **П**ауза 2–3 с;
  - **A**cknowledge — визнай питання чи заперечення;
  - **U**nderstand — уточни, якщо треба;
  - **S**tructure — назви структуру відповіді;
  - **E**xecute — відповідай і зупинись.
- **Negotiation simulation** (`neg`):
  - a branching dialog with hidden state (offer value, relationship, deadline pressure);
  - several endings with a debrief;
  - replays draw a different persona and budget.

  The norms taught come from the research (dated sources):
  - don't give a number first;
  - negotiate after the offer;
  - get everything in writing;
  - have a BATNA;
  - treat an exploding offer as a non-offer unless the window widens;
  - level matters more than title.

### 2.1 `fs-soft` — «Soft skills»

Role: core, parallel stream. Levels: J 40% · M 40% · S 20%.

| Навичка | `requires` |
|---|---|
| `fs-soft/communication` | — |
| `fs-soft/listening` | — |
| `fs-soft/feedback` | `fs-soft/communication` |
| `fs-soft/conflict` | `fs-soft/feedback` |
| `fs-soft/ownership` | `fs-soft/communication` |
| `fs-soft/product` | `fs-soft/ownership` |
| `fs-soft/remote-client` | `fs-soft/communication`, `fs-en-work/*` (TBC) |
| `fs-soft/influence` | `fs-soft/conflict`, `fs-arch/decisions` |

| Id | Тема | Рів. | Ціль |
|---|---|---|---|
| **S1** | **`communication` — Ясна комунікація** | | |
| fs-soft-01 | Навіщо інженеру soft skills: вплив на найм і грейд | J | що з soft skills оцінюють на кожному рівні |
| fs-soft-02 | BLUF і структура думки: пірамідний принцип | J | почати з висновку, тримати 3 аргументи |
| fs-soft-03 | Статус-апдейти й асинхронна комунікація | J | апдейт «зроблено / далі / блокери / ризики» |
| fs-soft-04 | Пояснити технічне нетехнічним людям | M | компроміс без жаргону, аналогія і її межа |
| fs-soft-05 | Говорити на мітингах: стендап, демо, рев'ю дизайну | M | 60-с стендап і 3-хв демо |
| **S2** | **`listening` — Слухати й питати** | | |
| fs-soft-06 | Активне слухання і перефраз | J | перефразувати вимогу й перевірити розуміння |
| fs-soft-07 | Уточнювальні питання: вимоги, неоднозначність, приховані обмеження | J/M | 5 питань, що змінюють рішення (крок «Зрозумій») |
| fs-soft-08 | Просити про допомогу і допомагати | J | запит з контекстом і спробами |
| **S3** | **`feedback` — Фідбек** | | |
| fs-soft-09 | Давати фідбек: SBI, конкретика, приватно vs публічно | M | фідбек за SBI |
| fs-soft-10 | Приймати фідбек і критику коду | J | відповісти на жорсткий коментар без захисту |
| fs-soft-11 | Code review як комунікація: тон, nit, блокер vs побажання | M | коментарі трьох рівнів |
| **S4** | **`conflict` — Незгода й конфлікт** | | |
| fs-soft-12 | Незгода по суті: дані, disagree and commit | M | заперечити з даними й прийняти фінальне |
| fs-soft-13 | Конфлікт з колегою: кроки й ескалація | M | знати, коли ескалювати |
| fs-soft-14 | Сказати «ні» і домовитися про обсяг | M/S | альтернатива замість голого «ні» |
| fs-soft-15 | Складні люди й токсичні ситуації: межі, документування | S | захистити межі |
| **S5** | **`ownership` — Ownership і пріоритети** | | |
| fs-soft-16 | Ownership: від тікета до результату | J/M | довести задачу до метрики |
| fs-soft-17 | Пріоритизація: impact/effort, cost of delay | M | впорядкувати беклог і пояснити |
| fs-soft-18 | Неоднозначність: рухатися без повних вимог | S | припущення і план перевірки |
| fs-soft-19 | Помилки й провали | M | розповісти про провал без самоприниження |
| **S6** | **`product` — Продукт і бізнес** | | |
| fs-soft-20 | Product thinking: користувач, метрика, гіпотеза | M | гіпотеза й метрика фічі |
| fs-soft-21 | Оцінки й дедлайни: діапазони, ризики, затримки | M | оцінка діапазоном, раннє попередження |
| fs-soft-22 | Робота з дизайнерами, QA, PM | J | hand-off без втрат |
| **S7** | **`remote-client` — Ремоут і клієнти** | | |
| fs-soft-23 | Ремоут-етикет: тайм-зони, overlap, документування рішень | J | робота з різницею 7–10 год |
| fs-soft-24 | Клієнтська комунікація в аутсорсі: дискавері, звіти, погані новини | M | погана новина з планом |
| fs-soft-25 | Довіра на відстані: видимість роботи, проактивність | M | видимість без «показухи» |
| **S8** | **`influence` — Ріст і вплив** | | |
| fs-soft-26 | Менторство і навчання інших | S | сесія менторства за структурою |
| fs-soft-27 | Вплив без повноважень: cross-team, RFC | S | просунути рішення в іншій команді |
| fs-soft-28 | Публічність: доповіді, статті, open source | S | спланувати публічний артефакт |

**Exercise mix:**
- gate pool 560 (situational-judgement items: a scenario → rank 4 responses);
- 30 soft-skill questions with story templates (in **Beh**);
- cards 180;
- reels 84;
- talk 40;
- write 25;
- rubrics 10.

### 2.2 `fs-beh` — «Behavioral-співбесіди»

Role: core, parallel stream. Levels: J 25% · M 35% · S 30% · TL 10%.

| Навичка | `requires` |
|---|---|
| `fs-beh/beh-basics` | `fs-playbook/hiring` |
| `fs-beh/story-method` | `fs-soft/communication` |
| `fs-beh/competencies` | `fs-beh/story-method` |
| `fs-beh/frameworks` | `fs-beh/competencies` |
| `fs-beh/self-presentation` | `fs-beh/story-method`, `fs-arch/decisions` |
| `fs-beh/closing` | `fs-beh/beh-basics` |
| `fs-beh/beh-english` | `fs-beh/competencies`, `fs-en-int/*` (TBC) |

| Id | Тема | Рів. | Ціль |
|---|---|---|---|
| **S1** | **`beh-basics` — Як працює behavioral-раунд** | | |
| fs-beh-01 | Що насправді оцінюють: сигнали, scorecard, bar raiser | J | що записує інтерв'юер |
| fs-beh-02 | Очікування за рівнями: scope, неоднозначність, вплив | M | підняти масштаб історії до рівня |
| fs-beh-03 | Формати: класичний, LP-стиль, culture fit / add, клієнтське інтерв'ю | M | розпізнати формат |
| fs-beh-04 | Типові помилки: «ми», без цифр, без конфлікту, ідеальний герой | J | знайти помилки у слабкій відповіді |
| **S2** | **`story-method` — Метод історії** | | |
| fs-beh-05 | STAR, CARL, STAR+L: структура і таймінг 2 хв | J | історія за 2 хв |
| fs-beh-06 | Банк історій: 12–15 історій, матриця покриття | J | заповнити story bank |
| fs-beh-07 | Цифри й вплив без вигадок | M | чесна метрика до кожної історії |
| fs-beh-08 | Глибина: 5 рівнів follow-ups | S | витримати «чому?», «що б змінив?» |
| fs-beh-09 | Одна історія під різні питання | M | переналаштувати фокус |
| **S3** | **`competencies` — Компетенції** (8–12 питань на тему) | | |
| fs-beh-10 | Ownership і відповідальність | J–S | |
| fs-beh-11 | Вплив і результат | M–S | |
| fs-beh-12 | Конфлікт і незгода | M–S | |
| fs-beh-13 | Провал і помилки | J–S | |
| fs-beh-14 | Неоднозначність і рішення без даних | S | |
| fs-beh-15 | Пріоритизація і дедлайни | M | |
| fs-beh-16 | Вплив без повноважень і cross-team | S/TL | |
| fs-beh-17 | Менторство і ріст інших | S/TL | |
| fs-beh-18 | Клієнт і користувач | M | |
| fs-beh-19 | Навчання й адаптація | J/M | |
| fs-beh-20 | Тиск, інциденти, стрес | M/S | |
| fs-beh-21 | Якість і стандарти | M/S | |
| **S4** | **`frameworks` — Фреймворки компаній** (дані на дату) | | |
| fs-beh-22 | Leadership Principles у стилі Amazon: петля з ~5 годинних інтерв'ю, принципи на кожне, bar raiser (reported; офіційно для Security Engineer — 5 × 60 хв) + GenAI-питання (reported 2026) | M/S | зіставити історії з кожним принципом |
| fs-beh-23 | Інші фреймворки: великі продуктові компанії, стартапи (ownership) | S | адаптувати акценти |
| fs-beh-24 | Клієнтське інтерв'ю в аутсорсі/аутстафі (для аутстафу — майже завжди, reported) | M | говорити з замовником про цінність |
| **S5** | **`self-presentation` — Про себе і проєкти** | | |
| fs-beh-25 | «Tell me about yourself»: 60 с, 2 хв, під роль | J | три версії |
| fs-beh-26 | Project deep dive: архітектура, роль, компроміси, цифри | S | 10-хв deep dive з діаграмою |
| fs-beh-27 | «Найскладніший баг», «найкраще рішення», «що б переробив» | M | технічні behavioral-історії |
| **S6** | **`closing` — Питання до інтерв'юера і закриття** | | |
| fs-beh-28 | Питання до інтерв'юера за раундом і рівнем | J | 3 питання на тип раунду |
| fs-beh-29 | Закриття раунду | J | закрити впевнено |
| **S7** | **`beh-english` — Англійською** | | |
| fs-beh-30 | Behavioral англійською: часи, hedging, фрази (Part X) | M | 3 історії без читання |

**Exercise mix:**
- gate pool 600;
- **130 behavioral questions** with story templates;
- talk 160 (130 + 30 follow-up chains);
- stress 6;
- cards 190;
- reels 90;
- write 15;
- rubrics 17 (STAR, 12 competencies, 4 level overlays);
- 20 calibration samples.

**Story bank** (platform):
- a private, structured store per learner;
- a coverage matrix;
- prompts can suggest which stories to use;
- the TL cases and the capstone defense pull from it.

### 2.3 `fs-psych` — «Психологія співбесід і каверзні питання»

Role: core, parallel stream; S2 is in batch 1. Levels: J 30% · M 40% · S 25% · TL 5%.

| Навичка | `requires` |
|---|---|
| `fs-psych/decision-psych` | — |
| `fs-psych/recruiter-screen` | `fs-psych/decision-psych`, `fs-playbook/hiring` |
| `fs-psych/tech-pressure` | `fs-psych/decision-psych`, `fs-algo/*` (method section, TBC) |
| `fs-psych/stress` | `fs-psych/tech-pressure`, `fs-psych/self-regulation` |
| `fs-psych/self-regulation` | — |
| `fs-psych/presence` | — |
| `fs-psych/candidate-judgment` | `fs-playbook/company-loops` |
| `fs-psych/negotiation-psych` | `fs-psych/recruiter-screen`, `fs-career/rates-research` |
| `fs-psych/after-interview` | `fs-psych/recruiter-screen` |
| `fs-psych/culture` | `fs-en-work/*` (TBC) |

| Id | Тема | Рів. | Ціль |
|---|---|---|---|
| **S1** | **`decision-psych` — Як вирішують інтерв'юери** | | |
| fs-psych-01 | Психологія рішення: перше враження, halo, confirmation bias, scorecard | J | як ухвалюється рішення і як чесно ним керувати |
| fs-psych-02 | Що бачить рекрутер: скринінг, red flags, ATS | M | пройти скринінг без «самостопів» |
| fs-psych-03 | Регіональні норми найму: US, UK, EU, Україна (дані на дату) | M | що доречно в кожному регіоні |
| **S2** | **`recruiter-screen` — Усі каверзні питання рекрутера** | | |
| fs-psych-04 | Очікування по зарплаті: спершу вилка й рівень, діапазон, base vs total | M | відповісти без втрати позиції |
| fs-psych-05 | Поточна зарплата чи ставка | M | відвести питання і перевести на ринкову вилку (див. правовий бокс нижче) |
| fs-psych-06 | «Чому йдеш?», скорочення, звільнення | J | про майбутнє, без критики роботодавця |
| fs-psych-07 | Прогалини, короткі терміни, часті зміни | J | чесно, коротко, назад до цінності |
| fs-psych-08 | Інші співбесіди й офери, notice period, counter-offers | M | конкуренція без блефу |
| fs-psych-09 | «Чому ми?», «Чому саме ви?» | J | факти про компанію + свій доказ |
| fs-psych-10 | Слабкість, «через 5 років», «оцініть себе 1–10» | J | чесна слабкість із планом |
| fs-psych-11 | «Ви overqualified» / «звучите junior для рівня» | S | зняти сумнів доказами |
| fs-psych-12 | Фриланс vs фултайм, релокація, тайм-зони | M | мотивація без суперечностей |
| fs-psych-13 | «Як ви використовуєте AI в роботі?» (зокрема GenAI-питання в лупах, reported 2026) | M | де, як перевіряю, де не використовую |
| fs-psych-14 | Особисті й незаконні питання: вік, сім'я, здоров'я, національність | M | граційно відвести; знати, де незаконно |
| fs-psych-15 | Записане інтро, AI-асистент і бот-рекрутери: акцент, темп, 60 с | M | інтро, що проходить (Part X, вимова) |
| **S3** | **`tech-pressure` — Тиск технічного інтерв'юера** | | |
| fs-psych-16 | «Ви впевнені?» — коли ти правий і коли ні | M | тримати позицію з доказом або виправитися |
| fs-psych-17 | «Не знаю», сказане добре | J | міркування на межі знань |
| fs-psych-18 | Brain teasers і оцінки Фермі | M | структурувати оцінку вголос |
| fs-psych-19 | Розмиті вимоги і зміна вимог посеред задачі | M | уточнити, зафіксувати, перепланувати |
| fs-psych-20 | Тиша, перебивання, швидкий темп, інтерв'юер без підказок | M | не заповнювати тишу панікою |
| fs-psych-21 | «Ви звучите junior» на технічному раунді | S | відновити сигнал рівня |
| **S4** | **`stress` — Стрес-інтерв'ю** | | |
| fs-psych-22 | Що таке стрес-інтерв'ю, коли це red flag, правові ризики для компанії | M | розпізнати і вирішити, чи це твоя компанія |
| fs-psych-23 | Мнемонік Loo «PAUSE» і свідома пауза | S | застосувати 5 кроків |
| fs-psych-24 | Pushback спокійно: доказ один раз, зупинка, без вибачень | S | відповісти на тиск і зупинитися |
| fs-psych-25 | Rapid-fire і повторні питання | S | короткі відповіді без зміни версії |
| **S5** | **`self-regulation` — Саморегуляція** | | |
| fs-psych-26 | Тривога й синдром самозванця | J | особистий протокол перед раундом |
| fs-psych-27 | Енергія в день лупу | J | план дня з 4–5 раундами |
| fs-psych-28 | Відновитися після поганої відповіді | M | закрити помилку і не тягнути далі |
| **S6** | **`presence` — Присутність** | | |
| fs-psych-29 | Відео-присутність: камера, світло, звук, погляд, темп | J | чекліст сетапу |
| fs-psych-30 | Мова тіла і сигнали інтерв'юера | M | коригувати темп і глибину |
| **S7** | **`candidate-judgment` — Судження кандидата** | | |
| fs-psych-31 | Red і green flags компанії | M | сигнали в процесі найму |
| fs-psych-32 | Питання, що розкривають реальність команди | S | on-call, техборг, текучка |
| **S8** | **`negotiation-psych` — Психологія переговорів** | | |
| fs-psych-33 | Якір, BATNA, тиша; не називати число першим | M | BATNA і якір |
| fs-psych-34 | Exploding offers, «бюджет фіксований», тиск дедлайну | S | отримати час |
| fs-psych-35 | Левелінг vs тайтл, пакет vs base | S | торгуватися за рівень і компоненти |
| fs-psych-36 | Counter-offer від поточного роботодавця | S | рішення за критеріями |
| fs-psych-37 | Усе письмово і граційна відмова | M | лист-підтвердження, відмова без спалених мостів |
| **S9** | **`after-interview` — Після співбесіди** | | |
| fs-psych-38 | Follow-up, подяка, запит фідбеку | J | follow-up |
| fs-psych-39 | Відмова: журнал фідбеку, наступний луп (зокрема заборона повторної подачі, reported для Lemon.io — 12 міс.) | J | відмова → план |
| **S10** | **`culture` — Культура і платформи** | | |
| fs-psych-40 | US vs EU vs UK: прямота, small talk, гумор, self-promotion | M | стиль без фальші |
| fs-psych-41 | Soft-skill раунди платформ (§3.3, дані на дату) | M | фінальний soft-раунд платформи |

**Legal box for `fs-psych-05` and `-14`** («дані на дату», 2026-11-08, not legal advice; always name the jurisdiction):
- **US:** salary-history bans in about 18–20 states + DC (Virginia from 2026-07-01). ADA bars health questions before an
  offer.
- **EU:** Pay Transparency Directive 2023/970, Art. 5 — the employer may not ask about previous pay, and the applicant
  has the right to know the range. Fully transposed in only 5 countries so far.
- **UK:** no ban yet (2026 consultation; EHRC recommends one).
- **Ukraine:** КЗпП ст. 2-1, 22, 25.

**Exercise mix:**
- gate pool 820;
- **280 tricky questions** in ≈ 70 families (≥ 3 per family), each = `qa` + `rp`;
- **48 stress scenarios**;
- **36 negotiations**: salary before and after the offer, exploding offer, fixed budget, level-down offer, counter-offer,
  freelance rate, platform-rate renegotiation, the post-loop lowball reported on DOU;
- cards 250;
- reels 123;
- write 20;
- rubrics 30;
- 20 calibration samples.

### 2.4 `fs-lead` — «Tech Lead»

Role: core for S/TL targets, elective below. Levels: S 40% · TL 60%.

| Навичка | `requires` |
|---|---|
| `fs-lead/role` | `fs-beh/story-method` |
| `fs-lead/people` | `fs-soft/feedback`, `fs-soft/conflict` |
| `fs-lead/vision` | `fs-sd/method`, `fs-arch/styles` |
| `fs-lead/planning` | `fs-soft/product` |
| `fs-lead/decisions` | `fs-arch/decisions` |
| `fs-lead/quality` | `fs-testing/team`, `fs-arch/review-quality`, `fs-git/team-git` |
| `fs-lead/hiring` | `fs-beh/competencies` |
| `fs-lead/incidents` | `fs-obs/incidents`, `fs-obs/slo` |
| `fs-lead/stakeholders` | `fs-soft/remote-client`, `fs-lead/planning` |
| `fs-lead/metrics` | `fs-devops/cicd`, `fs-obs/slo` |
| `fs-lead/lead-interview` | all `fs-lead/*`, `fs-beh/story-method` |

| Id | Тема | Рів. | Ціль |
|---|---|---|---|
| **S1** | **`role` — Роль** | | |
| fs-lead-01 | Tech Lead vs Engineering Manager vs Staff | S | межі відповідальності |
| fs-lead-02 | З senior у lead: що перестає працювати | S | 5 звичок, які змінити |
| fs-lead-03 | Перші 90 днів техліда | TL | план 30/60/90 |
| **S2** | **`people` — Люди** | | |
| fs-lead-04 | Делегування і його рівні | S | делегувати з правильною свободою |
| fs-lead-05 | Менторинг і коучинг | S | план росту для junior і middle |
| fs-lead-06 | 1:1 і сигнали вигорання | TL | провести 1:1, помітити ризик |
| fs-lead-07 | Фідбек і performance на рівні техліда | TL | складний фідбек і очікування письмово |
| fs-lead-08 | Мотивація і психологічна безпека | TL | команда, де помилки обговорюють |
| fs-lead-09 | Онбординг і bus factor | S | зняти «єдину точку знань» |
| **S3** | **`vision` — Технічне бачення** | | |
| fs-lead-10 | Бачення і стратегія: від бізнес-цілей до архітектури | TL | one-pager бачення |
| fs-lead-11 | Технічний roadmap | TL | roadmap на 2 квартали |
| fs-lead-12 | Build vs buy, вибір технологій, tech radar | TL | вибір з вартістю володіння |
| **S4** | **`planning` — Планування** | | |
| fs-lead-13 | Оцінювання на рівні команди | S | епік діапазоном з ризиками |
| fs-lead-14 | Планування ітерацій і кварталу, capacity | S | з урахуванням on-call і техборгу |
| fs-lead-15 | Пріоритизація: RICE, cost of delay, переговори з продуктом | TL | пріоритет мовою бізнесу |
| fs-lead-16 | Техборг: облік, обґрунтування, бюджет | TL | «продати» техборг через ризик |
| **S5** | **`decisions` — Архітектурні рішення** | | |
| fs-lead-17 | ADR | S | написати ADR |
| fs-lead-18 | RFC і design review | TL | провести design review |
| fs-lead-19 | Еволюція і міграції: strangler, feature flags | TL | міграція без зупинки |
| **S6** | **`quality` — Якість** | | |
| fs-lead-20 | Стандарти якості й Definition of Done | S | DoD команди |
| fs-lead-21 | Культура code review | S | процес рев'ю |
| fs-lead-22 | Тестова й релізна культура | S | стратегія релізів |
| **S7** | **`hiring` — Найм** | | |
| fs-lead-23 | Процес найму: scorecard, раунди, калібрування | TL | луп під роль |
| fs-lead-24 | Провести технічне інтерв'ю | S | раунд і scorecard |
| fs-lead-25 | Рішення про найм і фідбек кандидату | TL | аргументувати hire / no hire |
| **S8** | **`incidents` — Інциденти** | | |
| fs-lead-26 | Incident command | S | вести інцидент як IC |
| fs-lead-27 | Blameless postmortem | S | postmortem |
| fs-lead-28 | On-call і надійність як процес | TL | ротація і SLO-політика |
| **S9** | **`stakeholders` — Стейкхолдери і ризики** | | |
| fs-lead-29 | Продукт і бізнес: компроміси scope / time / quality | TL | переговори про компроміс |
| fs-lead-30 | Очікування і погані новини | TL | зрив з планом відновлення |
| fs-lead-31 | Ризик-менеджмент: реєстр, pre-mortem | TL | pre-mortem |
| **S10** | **`metrics` — Метрики** | | |
| fs-lead-32 | DORA без закону Гудгарта | TL | метрики, що не стають ціллю |
| fs-lead-33 | SPACE, DevEx, опитування | TL | виміряти DevEx і діяти |
| **S11** | **`lead-interview` — Співбесіда на техліда** | | |
| fs-lead-34 | Питання техліда: layered answers | TL | |
| fs-lead-35 | Лідерські кейси: 50 ситуацій з рубрикою | TL | контекст → опції → рішення → ризики → як виміряю |
| fs-lead-36 | «Як би ви…» у новій команді | TL | |

**Exercise mix:**
- gate pool 720;
- Q&A 140;
- **40 TL questions + 50 cases**;
- talk 60;
- stress 4;
- negotiation 6;
- write 30;
- cards 220;
- reels 108;
- rubrics 15;
- 10 calibration samples.

### 2.5 `fs-career` — «Карʼєра й пошук роботи»

Role: core. Levels: J 20% · M 40% · S 30% · TL 10%.

**Data rule.** Rates live as structured, dated data: `fs-career/data/rates-2026-11.yaml`. It is seeded from
`research/market-2026.md` §3: DOU summer 2026, Levels.fyi 2025, Stepstone 2026, ITJobsWatch, Bulldogjob, Arc 2026,
Lemon.io and Glassdoor. Each row has source, date, n, and gross / net / base / total / hourly. Each row is also labelled
«market data, not a guarantee».

Research nuances to keep in the data:
- Arc's Eastern Europe band covers **all levels**.
- The ITJobsWatch £883/day figure is **n = 1 quoted rate** — show it with that label or drop it.
- Lemon.io and Toptal rates are what the developer receives, not what the client pays.

| Навичка | `requires` |
|---|---|
| `fs-career/market` | `fs-playbook/company-loops` |
| `fs-career/rates-research` | `fs-career/market` |
| `fs-career/positioning` | `fs-career/market` |
| `fs-career/evidence` | `fs-beh/story-method` |
| `fs-career/job-search` | `fs-career/evidence`, `fs-playbook/platforms` |
| `fs-career/offers` | `fs-psych/negotiation-psych`, `fs-career/rates-research` |
| `fs-career/contracting` | `fs-career/offers` |
| `fs-career/growth` | `fs-lead/role` |
| `fs-career/part9-final` | all Part IX skills |

| Id | Тема | Рів. | Ціль |
|---|---|---|---|
| **S1** | **`market` — Ринок** | | |
| fs-career-01 | Де платять $5k+/міс (дані на дату) | M | канали з такими бюджетами і вимоги |
| fs-career-02 | Як читати вакансію: рівень, стек, сигнали бюджету | S | оцінити вакансію за 2 хв |
| fs-career-03 | Тренди попиту: TypeScript, React/Next + Node, AI-інтеграції (дані на дату; премію за Next.js чи observability окремо не підтверджено) | M | зіставити свій стек з попитом |
| **S2** | **`rates-research` — Дослідження ставок** | | |
| fs-career-04 | Методика: джерела, дати, вибірка, упередження | M | чесна вибірка |
| fs-career-05 | Ставки за країною, типом компанії, платформою | M | своя таблиця ставок |
| fs-career-06 | Від даних до діапазону: floor, target, stretch | S | три числа з обґрунтуванням |
| **S3** | **`positioning` — Позиціювання** | | |
| fs-career-07 | Ніша і стек: T-shape, домен, вертикаль | M | позиціювання одним реченням |
| fs-career-08 | Особистий бренд: що працює | S | 1–2 канали доказів |
| fs-career-09 | Історія кар'єри як прогрес | M | шлях без «стрибків» |
| **S4** | **`evidence` — Докази** | | |
| fs-career-10 | CV для $5k+: impact-bullets, ATS | J | CV за рубрикою |
| fs-career-11 | LinkedIn | J | профіль за чеклістом |
| fs-career-12 | GitHub і портфоліо | M | 2–3 доказові репозиторії |
| fs-career-13 | Кейс-стаді проєктів | M | 2 кейси з цифрами |
| fs-career-14 | Профілі на платформах і job boards (вимоги на дату: напр. Lemon.io — 3+ роки комерційного full-stack, 5+ для «senior», Upper-Intermediate, reported 2026-11-08) | M | профіль під платформу |
| **S5** | **`job-search` — Пошук** | | |
| fs-career-15 | Канали: job boards, рефералки, аутріч, платформи, рекрутери | J | мікс каналів |
| fs-career-16 | Воронка і трекер пошуку | J | бачити, де воронка «тече» |
| fs-career-17 | Аутріч і cover letters | M | аутріч на 120 слів |
| fs-career-18 | Фриланс-пропозиції | M | пропозиція під бриф |
| **S6** | **`offers` — Переговори і офери** | | |
| fs-career-19 | Переговори про зарплату: сценарії і скрипти | M | переговори за скриптом |
| fs-career-20 | Ставка з клієнтом або платформою | S | обґрунтувати й підняти ставку |
| fs-career-21 | Порівняння оферів: base, бонус, equity (основи), benefits | S | порівняти офери в калькуляторі |
| fs-career-22 | Офер і контракт: що перевірити | M | чекліст оферу |
| **S7** | **`contracting` — Контрактор vs працівник** | | |
| fs-career-23 | Моделі зайнятості: штат, B2B, EOR, платформа | M | порівняти за ризиком і доходом |
| fs-career-24 | Економіка контрактора: ставка → net, неоплачувані дні, bench, резерв | M | еквівалент зарплати в калькуляторі |
| fs-career-25 | Податки і статус на високому рівні за юрисдикціями (дані на дату, не порада) | S | які питання поставити бухгалтеру |
| fs-career-26 | Контракт: IP, NDA, non-compete, оплата, розірвання, інвойси | S | ризикові пункти |
| **S8** | **`growth` — Зростання** | | |
| fs-career-27 | Кар'єрні сходи: senior → lead → staff → EM | S | наступний крок |
| fs-career-28 | План на 12 місяців і перегляд ставки | TL | план і точка перегляду |
| **S9** | **`part9-final` — Фінал частини IX** | | |
| fs-career-29 | Бос частини IX | M–S | 100% gate |
| fs-career-30 | Capstone: «Кар'єрний пакет і лідерський кейс» | S | усі пункти рубрики |

**Callouts in `fs-career-23` and `-25`** (minor 12; «дані на дату» from `market-2026.md` §4, researched 2026-11-08, not
tax or legal advice):
- **UK — IR35 (off-payroll working).** Since 6 April 2021, medium and large private-sector clients decide the
  contractor's status and issue a Status Determination Statement; small clients leave it to the contractor. For a
  UK-client contract this decides whether you are "inside" or "outside" IR35, and your net rate depends on it.
- **Germany — Scheinselbständigkeit.** The DRV Clearingstelle status procedure (§7a SGB IV) decides the status.
  Reclassification can bring up to 4 years of back contributions. Red flags: fixed hours, a company e-mail, the
  client's equipment, a single client. A 2026 BMAS draft on "Neue Selbstständigkeit" was not yet law in mid-2026.
- **Ukraine:**
  - ФОП 3 група: 5% single tax + 1% military levy, plus ЄСВ 1,902.34 UAH/month in 2026, paid even with no income;
    income limit 10,091,049 UAH.
  - Дія Сіті: 5% ПДФО + 5% military levy + ЄСВ.
- **Poland:** B2B (JDG) is common. From 8 July 2026 the labour inspectorate (PIP) can reclassify B2B as employment;
  sources disagree on the details.
- **US clients:** the IRS control tests decide W-2 vs 1099. A 1099 contractor pays 15.3% self-employment tax on 92.35%
  of net earnings; verify on irs.gov. Non-US contractors file a W-8BEN.

**Capstone deliverables (Part IX, all rubric items):**
- a story bank of 12+ stories covering every competency;
- a CV + LinkedIn that pass the rubric, and a CV tailored to one of 6 job-ad variants;
- a 60-s intro in UA + EN, recorded locally;
- a dated rates sheet with floor / target / stretch;
- a negotiation plan with a BATNA;
- one TL case defended aloud;
- one behavioral and one recruiter arena loop at «hire».

**Exercise mix:**
- gate pool 560 (≈ 120 from generators);
- Q&A 60;
- cards 180;
- reels 90;
- write 40;
- talk 25;
- negotiation 12;
- 4 calculators;
- rubrics 12.

---

## 3. Part XI — Арена співбесід

### 3.1 `fs-playbook` — «Interview Playbook»

Role: core, **open from day one**, no gate, `kind: general`. The plan builder reads its data:
- `fs-playbook/data/loops/*.yaml`: company type × level → rounds, durations, grading, weights, pass rules, sources and
  dates, expiry;
- `data/platforms/*.yaml`;
- `data/prep-plans/*.yaml`.

| Навичка | `requires` |
|---|---|
| `fs-playbook/hiring` | — |
| `fs-playbook/company-loops` | `fs-playbook/hiring` |
| `fs-playbook/platforms` | `fs-playbook/hiring` |
| `fs-playbook/round-types` | `fs-playbook/hiring` |
| `fs-playbook/markets` | — |
| `fs-playbook/prep` | `fs-playbook/company-loops` |

| Id | Тема | Рів. |
|---|---|---|
| **S1** | **`hiring` — Як працює найм** | |
| fs-playbook-01 | Воронка: від заявки до оферу, хто вирішує | noob |
| fs-playbook-02 | Ролі: рекрутер, hiring manager, інтерв'юери, bar raiser, комітет | J |
| fs-playbook-03 | Як оцінюють: scorecard, сигнали, hire / no hire, калібрування | M |
| fs-playbook-04 | Рівні і левелінг: рівень визначає вилку більше, ніж тайтл | M |
| **S2** | **`company-loops` — Карта лупів** (дані на дату) | |
| fs-playbook-05 | Аутсорс: рекрутер (20–40 хв, часто укр.) → технічне 1–3 год → англійська → тестове (інколи, з AI) → клієнт → офер; від кількох днів до 1–1,5 міс. | J |
| fs-playbook-06 | Аутстаф і клієнтські інтерв'ю | J |
| fs-playbook-07 | Продуктові: live coding замість тестових, Bug Bash та Integration-раунди (reported, Stripe), Fullstack Craft (reported, Atlassian) | M |
| fs-playbook-08 | Стартапи: 2–3 розмови, pairing або реальний тікет, take-home із захистом, відео-відповіді | M |
| fs-playbook-09 | FAANG-style: OA, phone screen, onsite, комітет, левелінг | S |
| fs-playbook-10 | AI-enabled раунди і де AI заборонено (див. `fs-aidev-18`) | M |
| **S3** | **`platforms` — Платформи** (§3.3) | |
| fs-playbook-11 | Toptal | M |
| fs-playbook-12 | Lemon.io | M |
| fs-playbook-13 | Arc.dev | M |
| fs-playbook-14 | Gun.io | M |
| fs-playbook-15 | Turing, Proxify, Andela, Upwork | M |
| **S4** | **`round-types` — Типи раундів** | |
| fs-playbook-16 … 25 | рекрутерський скринінг · OA (Codility, HackerRank, CodeSignal, Qualified) · алгоритмічний live · JS/TS practical і React machine coding · backend/API і SQL · debugging, code review, Bug Bash · AI-assisted · system design · behavioral · take-home і тестовий проєкт | J–S |
| **S5** | **`markets` — Ринки** | |
| fs-playbook-26 | Український ринок: DOU, Djinni, тестові у 2026 (дані на дату) | J |
| fs-playbook-27 | Ремоут на US / EU / UK | M |
| **S6** | **`prep` — Підготовка** | |
| fs-playbook-28 | План підготовки: ціль → прогалини → тижневий план | J |
| fs-playbook-29 | Логістика: інструменти, сетап, чекліст дня | J |
| fs-playbook-30 | Тайм-менеджмент у раунді і чесність щодо AI-політик | J |

**Prep plan per company type** (minor 13; the data in `data/prep-plans/*.yaml` feeds the weekly plan):

| Company type | Courses to emphasise | Arena drills / loops | Readiness weights (domain mix of the target loop) |
|---|---|---|---|
| Outsourcing | `fs-jsi`, `fs-node`, `fs-sql` theory Q&A by level; `fs-beh-24`; `fs-en-int` | recruiter (UA), theory deep-dive, client interview (EN), TH4 | theory Q&A 40 · practical 25 · English/client 25 · recruiter 10 |
| Outstaffing | as outsourcing + `fs-soft/remote-client` | as above + 2 client loops | theory 30 · practical 25 · client/English 35 · recruiter 10 |
| Product | `fs-algo`, `fs-live`, `fs-sd`, `fs-beh` S3 | live coding, system design, behavioral, Bug Bash (TH7), Integration round | coding 35 · SD 25 · behavioral 20 · debugging/integration 20 |
| Startup | `fs-react`, `fs-node`, `fs-integr`, `fs-soft/ownership` | pairing, take-homes TH2/TH5/TH6 + defense, product talk | practical 40 · take-home 30 · ownership/behavioral 20 · SD-lite 10 |
| FAANG-style | `fs-algo` (all patterns), `fs-sd`, `fs-beh` S4, `fs-aidev` | OA, algorithmic, AI-enabled round, SD, LP behavioral | algorithms 40 · SD 25 · behavioral 20 · AI-assisted 15 |
| Vetted platform | `fs-algo` timed, `fs-live`, `fs-psych-15`, `fs-en-int` (pronunciation) | the platform simulator (§3.3), timed test, explain-own-solution, code review of given code, recorded intro | platform weights in §4 |
| Tech Lead | `fs-lead`, `fs-sd`, `fs-beh` S3–S5 | SD, leadership cases, stakeholder role-play, hiring debrief | leadership 35 · SD 30 · behavioral 20 · coding 15 |

**Exercise mix:** gate pool 180 (not gating), Q&A 60, cards 180, reels 90, talk 10, write 6, rubrics 2.

### 3.2 `fs-arena` — «Арена: моки й симулятори»

Role: core; practice bank + mock hub. The arena never blocks: gates apply to courses, and the arena tests them.

| Навичка | `requires` |
|---|---|
| `fs-arena/arena-basics` | — |
| `fs-arena/round-drills` | each drill's source skills (e.g. `fs-sd/method`, `fs-aidev/ai-round`) |
| `fs-arena/platform-sims` | `fs-playbook/platforms` + the round sources |
| `fs-arena/mock-loops` | `fs-playbook/company-loops` + the round sources |
| `fs-arena/special-modes` | `fs-psych/stress`, `fs-psych/negotiation-psych` |
| `fs-arena/calibration` | — |
| `fs-arena/take-homes` | `fs-testing/strategy`, `fs-api/rest`, `fs-react/react-machine-coding`, `fs-devops/cicd` |
| `fs-arena/marathon` | `fs-arena/mock-loops` |

| Id | Розділ / тема | Що всередині |
|---|---|---|
| **S1** | **`arena-basics`** | |
| fs-arena-01 | Режими, таймери, рубрики, самооцінка | how a loop runs; what is auto-graded vs rubric-graded |
| fs-arena-02 | Готовність: як читати score і blockers | the readiness card, decay, the "design target" wording |
| **S2** | **`round-drills`** (14 types × 4 variants = 56) | |
| fs-arena-03 … 16 | рекрутер · 60-с інтро · таймований тест · алгоритмічний live · JS/TS practical · React machine coding · Node/API · SQL · debugging і code review · AI-assisted · SD backend · SD frontend · behavioral · клієнтське інтерв'ю | one timed round with its rubric and interviewer script |
| **S3** | **`platform-sims`** (18 variants, §3.3) | |
| fs-arena-17 … 20 | Toptal ×3 · Lemon.io ×3 · Arc ×3 · Gun.io ×3 | `ex01…03` each |
| fs-arena-21 … 23 | Turing ×2 · Proxify ×2 · Andela ×2 | lower-confidence sources |
| **S4** | **`mock-loops`** (40, §3.4) | |
| fs-arena-24 … 30 | аутсорс · аутстаф + клієнт · продукт · стартап · FAANG-style · FAANG-style AI-enabled · tech lead (+ UA-ринок у 24/26) | `ex01…` per loop |
| **S5** | **`special-modes`** | |
| fs-arena-31 | Стрес-луп | 6 stress scripts inside normal loops |
| fs-arena-32 | Луп після оферу | chains `neg` sims to the loop's synthetic offer |
| fs-arena-33 | Марафон | 2–3 loops in a week |
| **S6** | **`calibration`** | |
| fs-arena-34 | Калібрування самооцінки | 60 pre-graded samples (§5.4) |
| fs-arena-35 | Ретро лупу і журнал фідбеку | retro → mistakes → plan |
| **S7** | **`take-homes`** (all 8 of §5.1; Part VI has none) | |
| fs-arena-36 … 43 | TH1–TH8, one topic each (`task01`) | brief, rubric, reference solution, review checklist, defense call |
| **S8** | **`marathon`** — Capstone частини XI | |
| fs-arena-44 | «Інтерв'ю-марафон» | 3 target loops at «готовий» on 3 different days within 21 days, one in English end to end |

**The 8 take-homes.** Each has:
- a brief with a time box and the reported context;
- a rubric of 8–12 items covering tests, README, deploy/run instructions, code quality, security and the stated
  trade-offs;
- a reference solution that passes its own tests;
- a reviewer checklist;
- a 20-min scripted **defense call**: "walk me through it", "why X", "what would you change", and for AI-allowed
  briefs "which parts did AI write and how did you verify them".

| Id | Take-home | Time box | Stack | Reference-solution scope | Review-checklist focus | Used by loops / sims |
|---|---|---|---|---|---|---|
| TH1 (`fs-arena-36`) | AI feature: Q&A over a document set with citations, eval set, cost limit | 6 h | Next.js + mock provider + PGlite/pgvector | RAG pipeline, 20-item eval, refusal on out-of-scope questions | evals present and meaningful, injection defense, cost guard | AI-startup, AI-enabled FAANG-style |
| TH2 (`fs-arena-37`) | Startup full-stack mini-app: bookings with auth and conflicts | 8 h | Next.js + Postgres | CRUD, overlap check in SQL, auth, e2e of the happy path | data model, race on double booking, README | startup loops |
| TH3 (`fs-arena-38`) | Platform-style mini test project (scoped version of the reported 1–3-week project) + demo | 10 h | full-stack of the learner's choice | feature-complete small product, tests, deploy notes | completeness, tests, professionalism | Toptal-style sims |
| TH4 (`fs-arena-39`) | Outsourcing test task, AI allowed (as reported for ZONE3000, DOU 2026-11-06): inventory API + admin UI | 4 h | Node + React | REST API with validation and pagination, admin table | can the learner defend AI-generated parts; validation and errors | outsourcing and outstaffing loops |
| TH5 (`fs-arena-40`) | Frontend product take-home: accessible analytics dashboard with filters in the URL and a virtualised table | 5 h | React + TS | URL state, a11y, virtualisation, tests | a11y, render performance, state design | product FE loops, FAANG-style FE |
| TH6 (`fs-arena-41`) | Backend integration take-home: webhook ingestion with signature check, idempotency, retries, dead letter | 5 h | Node + Postgres | handler, outbox/queue, replay protection, tests | idempotency proof, failure handling (in the spirit of the reported Stripe Integration round) | product BE loops, Gun.io G2 |
| TH7 (`fs-arena-42`) | Bug Bash: unfamiliar 15-file repo with 5 planted bugs → fix + written report | 60 min (timed) | TS service + UI | the 5 fixes + regression tests + report | bugs found, root-cause explanations, report clarity | product loops (reported Stripe format), Lemon.io code-review stage |
| TH8 (`fs-arena-43`) | 3-hour timed assessment (reported Proxify format): fix a broken React app, build tabs, lazy-load images, then a defense of the submitted code | 3 h (timed) | React | the three fixes and features with tests | correctness under time, code you can explain | Proxify sims, frontend loops |

New authored content in the arena:
- 40 loop scripts;
- 18 simulator scripts;
- 56 drill wrappers;
- 8 take-homes;
- 40 intro / transition `t` items;
- 6 stress loop scripts;
- 19 rubrics (14 round rubrics + 5 new take-home rubrics; TH1–TH3 rubrics are counted in the 14);
- 60 calibration samples.

Problems, questions and designs are drawn from the other courses' pools; they are not duplicated.

### 3.3 Platform simulators — end to end (reconciled with `research/loops.md` §B–C)

**Common mechanics:**
- **Stage gating**: failing a stage ends the loop with the reported real-world consequence. "Continue for practice"
  doesn't count for readiness.
- TTS interviewer scripts on two timelines: the stage timer, and interviewer events (silence, probes).
- Your own code from an earlier stage is shown back when a stage asks you to explain it.
- Scorecards per stage and a platform verdict.

**Pass rates** (shown in a «дані на дату» box, self-reported by the platforms unless marked; none independently
audited):
- **Toptal** (official, fetched 2026-11-08): 26.4% → 7.4% → 3.6% → 3.2% → 3%; 3–8 weeks.
- **Lemon.io:** 1.2% accepted, ≈ 5 business days; a 12-month reapply ban is reported.
- **Arc** (official): 14% after the communication step, 2% after the technical step, 2.3% overall. About 55% pass the
  profile screen (third party).
- **Gun.io:** no official figure. Third parties say ≈ 10% or ≈ 3.5% (weak source).

**Toptal-style** (`fs-arena-17-ex01…03`; reported unless official):
1. English and personality call, 20 min: 60-s intro, experience questions, explain a project. The order of stages
   reportedly changes for some members.
2. Timed Codility-style test: **3 problems in 90 min**, easy / medium / hard, hidden tests. A 2025 account reports
   100 min with ≥ 210/300 to pass, so the simulator threshold is 70% of points.
3. Live screening with a silent observer and screen share: explain your **own** stage-2 solutions, then
   **2 × 15–20-min problems**. One FE report says 15 min. Reported example: count cyclic primes ≤ N with a sieve.
4. Test project: officially 1–3 weeks; reported ≈ 20–40 h of effort. Simulated as TH3 (10 h) + a demo call.

Variants:
- **T1** algorithmic JS;
- **T2** React-feature: stage 2 is 3 features in 60 min;
- **T3** data-processing: parse and interpret JSON.

**Lemon.io-style** (`fs-arena-18-ex01…03`):
1. Profile and experience review against the reported bar: 3+ years of commercial full-stack, 5+ for the «senior»
   label, Upper-Intermediate English.
2. Soft skills and English:
   - an **AI-assistant audio pre-screen of up to 20 min**, simulated by a scripted TTS assistant. Answers are recorded
     locally; the real step is reportedly opt-out.
   - a 60-s recorded intro. Older reports and a 2026 report mention rejections for accent.
   - a **20-min live recruiter call**: role-play with pressure, ambiguity and client expectations.
3. **15-min stack quiz**: multiple-choice + open questions.
4. Technical interview with a community senior, ≈ 60 min:
   - small talk;
   - experience dive (legacy, performance, teamwork);
   - "non-Googleable" theory (e.g. behaviour under 100× load);
   - **code review of the interviewer's smelly code** (can reuse TH7 material);
   - a small system design or live coding;
   - an AI-tools fluency question.

Variants:
- **L1** Node/backend;
- **L2** React/Next;
- **L3** full-stack boundaries (auth, data fetching).

**Arc-style** (`fs-arena-19-ex01…03`):
1. Profile screening.
2. Communication assessment: a video self-introduction or a live call. Small talk, explain a technical concept simply,
   remote readiness. Simulated with local record mode; this step is the big filter (14% pass).
3. One-hour technical interview or pair programming.
4. Final review.

Variants:
- **A1** breadth-first: rapid-fire "from language internals to how the Internet works" (DNS, how an array is
  implemented, closures, hoisting) + a small coding task;
- **A2** pair programming on a practical task, thinking aloud;
- **A3** domain deep dive (Node or React).

**Gun.io-style** (`fs-arena-20-ex01…03`):
1. Group profile pitch. Reported as presenting your profile to about 10 developers and 2 staff; simulated as a 3-min
   pitch with TTS audience questions. Then profile completion.
2. Codility-style task with hidden edge cases. The reported 2018 task type (whole-word fragments of ≤ K characters) is
   rewritten as an original problem.
3. Technical interview(s) with a senior or tech lead: DDD, CQRS, design patterns, system design, PostgreSQL
   optimisation, caching, "where do you store private keys?".
4. Character and fit round with an executive.

Variants:
- **G1** string / greedy task;
- **G2** PostgreSQL + caching (+ TH6 material);
- **G3** architecture (DDD/CQRS).

**Extras** (2 variants each, lower confidence):
- **Turing:** MCQ stack tests → 2 problems in about 30 min, or 90 min mixing DSA with an **LLM-response evaluation**
  task. 2026 per-project vetting is reported to start with a ≈ 25-min AI interview and to keep timers running on
  disconnect.
- **Proxify:** AI-powered screening → English and technical assessments → a 3-h Codility-style test (TH8) → a technical
  interview revisiting the submitted code → a soft-skills interview.
- **Andela:** a coding assessment with "explain your reasoning" → an English audio check → a live React task (filter
  table) without an IDE or debugger.

Platform verdict = all stages passed at the thresholds in `data/platforms/*.yaml`.

### 3.4 The 40 mock loops (`fs-arena-24…30`, `ex` per loop)

Each loop declares:
- rounds that reference pools;
- durations;
- the interviewer persona;
- a decision rule. Per round, «strong hire / hire / lean no / no» comes from the rubric and auto scores. Two examples:
  - FAANG-style: no round below hire, ≥ 1 strong hire;
  - outsourcing: tech and client both hire.
- a debrief → mistakes → plan.

| Group | Loops (level) | Rounds (reported formats, dated in `data/loops`) |
|---|---|---|
| Outsourcing (6) | J, M, S, TL, M frontend-heavy, S backend-heavy | recruiter 20–40 min (UA) → technical 1–3 h (theory deep-dive + practical) → English check (the examiner plays the client) → client interview (EN) |
| Outstaffing + client (5) | J, M, S, TL, S client-only (US startup client) | recruiter → tech → 1–2 client interviews (reportedly near-universal for outstaff) |
| Product (8) | J, M, S, TL, S frontend, S backend with Bug Bash + Integration round, M data-heavy (SQL), S SaaS with a take-home defense | screen 30 min → live coding 45–60 min → system design 45–60 → values/behavioral 45 |
| Startup (6) | J, M, S, TL founding engineer, S take-home-first, M AI startup | 2–3 conversations; pairing or "real ticket"; take-home + defense; product sense; recorded video answers |
| FAANG-style (8) | Meta-style mid (45-min no-AI coding + 60-min AI-enabled + design + behavioral); Google-style mid (screens + onsite + code-comprehension-with-AI pilot round + committee); Amazon-style senior (OA with the platform's AI assistant + 5 × 60-min LP loop incl. bar raiser); entry; senior; staff/TL; senior frontend; phone-screen-only | then committee simulation, level decision, optional negotiation |
| Tech Lead (4) | TL product, TL delivery (outsourcing), TL startup, TL with a hiring-manager round | system design + strategy + leadership cases + behavioral + stakeholder role-play |
| Ukrainian market (3) | large outsourcing (generic, no company names), UA product company (live coding instead of a test task), startup via a job board | UA/EN mix, theory-heavy, test task with AI allowed + follow-ups |

Total: 40. There is ≥ 1 loop per company type at every level J/M/S/TL. 12 loops are fully in English; 28 are mixed per
the reported norms.

### 3.5 `fs-boss` — «Великий бос»

Prereqs: all part gates passed; ≥ 3 arena loops attempted. Skills (sections): `fs-boss/rules`, `fs-boss/written`,
`fs-boss/live`, `fs-boss/recheck`; together they require every part's final section.

| Id | Тема | Що |
|---|---|---|
| fs-boss-01 | Правила і blueprint | what is drawn, timing, retake rules, what «100%» means per block |
| fs-boss-02 | День 1 — письмовий (≈ 4 h, timed) | one variant per concept from every part's gate pools; 3 algorithm problems in 90 min at L4 on re-seeded hidden tests; 1 AI-assisted round |
| fs-boss-03 | День 2 — live (≈ 4 h) | system design (target-dependent), React or Node practical, code review, behavioral + 2 stress events, recruiter salary question, all in English |
| fs-boss-04 | Повторна перевірка (7–14 днів потому) | a fresh slice on unseen variants; the track is complete only after it |

6 exam variants come from one blueprint (`fs-boss-02-ex01…06`, `03-ex01…06`).

Gate rules:
- auto blocks: 100%;
- open blocks: every rubric item met (§5);
- the re-check day confirms both.

### 3.6 `fs-capstone` — «Фінальний SaaS і захист»

Prereqs: Parts I–VIII gates. The learner builds in their own repository and accounts (Stripe test mode only). Levels:
S 70% · TL 30%.

| Навичка | `requires` |
|---|---|
| `fs-capstone/brief` | `fs-sd/method` |
| `fs-capstone/milestones` | `fs-auth/authz`, `fs-integr/*` (payments, TBC), `fs-queues/jobs`, `fs-ai/rag`, `fs-ai/evals`, `fs-devops/cicd`, `fs-obs/otel`, `fs-sec/sdlc` |
| `fs-capstone/defense` | `fs-sd/sd-interview`, `fs-beh/self-presentation`, `fs-en-int/*` (TBC) |
| `fs-capstone/portfolio` | `fs-career/evidence` |

| Id | Тема | Що |
|---|---|---|
| fs-capstone-01 | Три брифи на вибір | B2B booking SaaS · document workspace with AI · team tracker with realtime |
| fs-capstone-02 | Вимоги, NFR, оцінки, план | the 7 steps at system scale |
| fs-capstone-03 … 13 | Milestones: архітектура і ADR · auth, ролі, multi-tenancy · платежі · файли · пошук · realtime · фонові задачі · AI-фіча з evals · тести · CI/CD і деплой · observability і security review | each with a rubric and text evidence |
| fs-capstone-14 | Architecture walkthrough | 10 min with a diagram |
| fs-capstone-15 | Trade-offs і «що зміниш при 100× навантаження» | |
| fs-capstone-16 | Перехресний допит: безпека і AI-фіча | + 2 stress events |
| fs-capstone-17 | Повний захист англійською | |
| fs-capstone-18 | Портфоліо-кейс | CV case study + LinkedIn post |

**Exercise mix:**
- 80 defense questions; each defense draws 15–20 unseen ones;
- talk 30;
- stress 2;
- write 8;
- quiz 110 (not gating);
- cards 110;
- reels 54;
- 14 rubrics.

Loo does not fetch learner URLs (SSRF and cost).

---

## 4. Readiness score model

**Evidence.** Every graded event becomes `e = {skill (global key), domain, type, score ∈ [0,1], at, independent}`.
- Types: independent solve (L4, no reveals, in time), recall (FSRS retrievability + topic-test score), round result
  (auto and/or rubric %), loop result, method signal.
- Only independent solves count for coding.
- Weight decays: `w = 0.5^(age / 21 days)`.

**Per domain.** Domains are skill-graph groups: algorithms, JS/TS, frontend, backend, data/SQL, systems/design,
security, AI, AI-assisted, behavioral, recruiter/psych, leadership, English speaking, English listening.
- Base formula: `R_d = 100 × (0.35·Solve + 0.20·Recall + 0.30·Rounds + 0.15·Method) − MistakePenalty`.
- Coverage cap: `R_d ≤ 60 + 40 × coverage_d`, where coverage = the share of the target level's required skills with
  evidence in the last 60 days.
- Non-coding domains use `0.25·Recall + 0.55·Rounds + 0.20·Method`.
- MistakePenalty:
  - 3 per open mistake;
  - 5 per critical one (accepted a flawed AI suggestion with a security hole, gave a salary number first);
  - max 15.
- A confidence band of `± 25/√n` is always shown.

**Method adherence («Метод Loo» and its non-coding equivalents):**
- **Coding:**
  - pattern recognition accuracy;
  - B/U/D waste named correctly;
  - edge cases listed before coding;
  - complexity stated correctly;
  - brute force said first;
  - dry-run done;
  - clarifying questions asked in mocks.
- **AI-assisted:**
  - decision accuracy;
  - flaws exposed by your own tests;
  - verification said aloud.
- **System design:** the 7 steps followed at scale.
- **Behavioral:**
  - STAR complete;
  - impact quantified;
  - "I" statements;
  - within time.
- **Recruiter:**
  - asked for the band first;
  - gave a range, not a point;
  - said base vs total.
- **Stress** (the **«PAUSE» steps — Loo's own mnemonic**):
  - a deliberate pause;
  - acknowledged;
  - evidence once, then stopped;
  - no repeated apology;
  - named the structure.
- **Negotiation:**
  - BATNA prepared;
  - did not anchor low;
  - confirmed in writing.

**Per target loop** (from `data/loops` and `data/platforms`):
- `RR_r = 0.5 × Σ m_{r,d} R_d + 0.5 × mean(last 3 arena results for that round type)`.
- `Loop = min(Σ weight_r · RR_r, min_r RR_r + 10)`: one weak round caps the loop.

Platform weights, from the reported stages and filter strength:
- **Toptal-style:** English call 10 · timed test 35 · live explain + new problems 30 · test project 25.
- **Lemon.io-style:** profile 5 · AI pre-screen + recruiter 20 · 15-min quiz 10 · technical interview 65 (theory 25 ·
  code review 25 · design/live 15).
- **Arc-style:** profile 5 · communication 25 · technical hour 70.
- **Gun.io-style:** pitch/profile 10 · coding test 30 · technical/architecture 40 · fit 20.

Company-type weights are in the §3.1 prep-plan table.

**«Готовий» for a loop** requires all of:
- Loop ≥ 85;
- every RR_r ≥ 80;
- ≥ 2 full runs of the loop or simulator passed by its decision rule, on different days within 30 days, the last within
  14;
- no open critical mistakes in the loop's skills;
- English ≥ the loop's level (B2 for platforms and FAANG-style).

Other bands: «Майже» is 70–85; «Ще ні» is < 70. The card lists the top 3 blockers with links, and they feed the weekly
plan.

**Calibration.** The «≈ 99% pass» bar is a **design target** of these thresholds, never a promise in the UI.
- Batch 11 tunes the thresholds on synthetic profiles (junior / middle / senior / TL, strong vs weak per domain). That
  check is internal and partly circular: the profiles are built from the same model.
- The **first external calibration** is the owner's real interview loops. With his consent, each real outcome is
  logged anonymously next to his readiness at that date: company type, level, rounds, result, feedback. The thresholds
  are then re-tuned on that data.
- Later learners' real outcomes are an opt-in channel. They need consent and a privacy note.

---

## 5. Mastery gates, variant budget and the mistakes loop (§6a, review B2)

### 5.1 Rubric format

Every open exercise has 4–10 **binary, observable items** with an anchor. This covers `t`, `rp`, `wr`, stress, `neg`
debrief, behavioral, design, AI-round explanation, take-home, capstone milestone and defense. Items are tagged by level.
- The gate uses all items of the learner's target level.
- Next-level items are "stretch": they feed readiness, not the gate.

### 5.2 Assessment flow (free, no AI)

1. Answer (speech → browser transcript, or text).
2. Server **auto-checks** where a signal exists:
   - duration and word band;
   - numbers present;
   - "I" vs "we" ratio;
   - filler and apology counts;
   - `must:` phrases;
   - a salary number in the first N words;
   - for negotiations, the path taken;
   - for AI rounds, decision accuracy and the mutation result.
3. The model answer is shown **after** the attempt.
4. Item-by-item self-assessment. For each item marked "met", the learner highlights an evidence span in their own
   answer.
5. An auto-check that contradicts a self-mark makes the item «не підтверджено» = unmet.
6. 100% only if every gate item is met.

### 5.3 Variant budget (lead decision, review B2)

- **Auto-checked gate items:**
  - each topic has 3 gate concepts;
  - each concept has **≥ 6 variants, ≥ 8 for the topic's core concept**, or a **generator** (about 250 generator slots
    in these parts, §0.2);
  - a topic test draws **one variant per concept**, never most of the pool;
  - options are shuffled, and numbers or data are re-parameterised where possible;
  - pools are 20 per gated topic. The totals are in the «Gate pool» column.
- **Coding inside these parts** (`fs-ai` labs, AI-round tasks):
  - the «mastered» check uses re-seeded hidden tests + a sibling task of the same pattern;
  - for AI rounds, the sibling is another task of the same track (≥ 6 per track).
- **Open-answer gates:**
  - 100% of rubric items;
  - **≥ 3 prompt variants per rubric**, so a retake always gets a fresh prompt;
  - prompts are parametric where possible (situation slots: level, region, company type, numbers, persona), which
    multiplies real variety. The counts per course are in the table below.

| Course | Rubrics | Prompt variants available per rubric (min) |
|---|---|---|
| `fs-ai` | 20 | designs: 3 each (18 `sd`); talk/write: ≥ 3 |
| `fs-aidev` | 8 | AI round: 6–10 tasks per track rubric; capstone: project-specific (exception below) |
| `fs-soft` | 10 | ≥ 6 (65 open items) |
| `fs-beh` | 17 | ≥ 8 per competency rubric (130 Qs + 30 chains) |
| `fs-psych` | 30 | ≥ 3 per family (≈ 70 families, 280 Qs); stress: 48 scenarios × random timelines; negotiation: 36 × personas |
| `fs-lead` | 15 | cases 50, TL Qs 40, writes 30 → ≥ 3 |
| `fs-career` | 12 | CV rubric: 6 job-ad variants; writes 40; negotiation 12 |
| `fs-capstone`, take-homes | 14 + 8 | exception: the project itself is the artefact; the re-check is a defense draw of unseen questions from the 80-question pool (or the take-home's defense pool) |

**Pool exhausted:**
- generator items generate a new variant;
- otherwise the learner gets a remediation task, and after ≥ 14 days the least-recently-seen variant with reshuffled
  options. To clear a mistake from a reused variant, the learner also gives a 30-s «поясни Loo» `t` explanation, so a
  memorised position is not enough.
- open prompts with parametric slots draw a new slot combination.

**Re-check:** a gate passed in one sitting is confirmed by spaced review on another day with a new variant; failure
reopens the concept.

### 5.4 Anti-gaming

- **Evidence spans:** no evidence → no credit. Too-fast marking makes the attempt provisional.
- **Self-assessment calibration:** in 1 of 5 sessions the learner grades a pre-graded sample (110 in total: arena 60,
  behavioral 20, psych 20, lead 10). If they are off by more than one item, that domain becomes "low trust": its gates
  need the other-day re-check on two variants until calibration recovers.
- **Situation-specific items** ("addressed the 2-week notice in this scenario") defeat memorised scripts.

### 5.5 Mistakes loop

Every unmet item → «Мої помилки» with:
- concept (global skill key);
- misconception type;
- source unit;
- what was wrong.

≈ 60 open-answer misconception types are authored once each, with a targeted explanation and a weak-vs-strong worked
example:

| Area | Misconception types |
|---|---|
| Behavioral | `no-impact-number`, `we-not-i`, `no-real-conflict`, `over-time`, `blames-others`, `no-lesson`, `scope-below-level` |
| Recruiter | `number-first`, `employer-bashing`, `oversharing`, `point-not-range`, `base-total-unclear` |
| Stress | `repeated-apology`, `capitulated-when-right`, `defended-when-wrong`, `rambles-after-answer`, `no-pause`, `filled-silence-with-retraction` |
| Negotiation | `anchored-low`, `accepted-first-offer`, `no-batna`, `ultimatum`, `verbal-only` |
| AI round | `accepted-flawed`, `rejected-correct-no-reason`, `tests-dont-expose`, `missed-hallucinated-api`, `no-verification-said` |
| Tech lead | `no-stakeholders`, `no-tradeoff`, `decided-alone`, `no-metric`, `no-follow-up` |

Remediation = explanation → worked example → a **new variant**. A mistake clears when the item is met on **two
different days** on unseen variants. All open mistakes of a section must clear before its gate. «Робота над помилками»
comes first in the daily mix. Recurring types feed the plan and the MistakePenalty.

---

## 6. Platform work vs pure content

| Piece | Platform work | Content only |
|---|---|---|
| `[!talk]` / `[!write]` | They exist only as uncommitted work in the owner's main checkout; they must land on `main` before batch 1 (blueprint 9.5, needs a date). Add: `rubric:` items with level tags, evidence highlighting, local record-and-replay | prompts, models, rubrics |
| Stress mode | timeline events for `rp`; random draw from an event pool; TTS persona; the two-timeline runner (blueprint 9.13) | 66 scenarios |
| Negotiation | branching-dialog block with hidden state, endings, debrief | 54 sims |
| Rubric engine | rubric attempts, server auto-checks, calibration, trust level, provisional attempts, a mistake per unmet item, prompt-variant draw | rubrics, ≈ 60 remediations |
| Variant pools and generators | one-variant-per-concept draw, pool-exhausted rule, parametric generators | 4,890 gate items, ≈ 250 generator definitions |
| Story bank | private per-user store, coverage matrix | templates |
| AI-round block | multi-file virtual project, scripted assistant by intent, labelled diffs, accept/reject UI, mutation grading, timed mode | 32 tasks, 120 drills |
| Mock LLM for `fs-ai` labs | deterministic AI-SDK-shaped provider, precomputed embeddings, pgvector in PGlite (measure size, lazy load) | 70 labs |
| Loop runner + hub | loop and platform manifests as data, stage gating, timers, scripts, scorecards, decision rules, history | 40 loops, 18 sims, 56 drills, 8 take-homes |
| Readiness engine | evidence store, decay, formulas, blockers, plan hookup, synthetic calibration harness, **consented real-outcome log** | weights in data |
| «Дані на дату» | box fields, `course:check` expiry warning, UI badge, batch owner-check list | the boxes |
| Gating exceptions | Playbook ungated; parallel-stream gates; arena never blocks | – |
| Calculators | small interactive block (4) | formulas, dated inputs |
| Capstone tracker | milestones with text evidence + rubric; no URL fetching | briefs |
| Everything else | – | articles, Q&A, cards, quizzes, reels, designs, questions, templates |

## 7. Paid AI (later, only after the owner approves a cost estimate)

These extend `docs/AI_CHECKS.md`:
- AI grading of open answers against our rubrics, with item evidence;
- a live AI interviewer with adaptive follow-ups;
- a real assistant inside the AI-round trainer, with caps;
- an AI recruiter for the Lemon.io-style pre-screen;
- CV, proposal and repo review;
- intro pronunciation scoring.

Everything in this outline works without them.

---

## 8. Learner hours and the «досвідчений» fast lane (review M8)

### 8.1 Basis

**PACE constants** from `src/course/compile/lessons.ts` (used by `unitMinutes`):
- quiz 0.6 min;
- flashcard 0.4 min;
- reel 0.3 min;
- task 10 min.

**Added for blocks PACE lacks:**
- reading 150 words/min (technical Ukrainian with comprehension);
- a card incl. its FSRS reviews over the course's life: 1.6 min;
- `qa`: 2.5 min;
- lab (guided + blank + one variant): 25 min;
- `t`/`rp`: 6 min (prep + answer + self-assessment);
- stress: 12 min;
- `neg`: 15 min;
- `wr`: 20 min;
- AI-round task: 70 min;
- review drill: 4 min;
- design: 50 min.

**Gate items:** about 10 seen per topic in lessons and the topic test; the rest of the pool is used only on retakes.

**Overhead:** ×1.25 for retakes, re-checks and the mistakes loop.

**Arena:**
- loop ≈ 3.5 h;
- sim ≈ 5 h (+ its take-home);
- drill ≈ 1 h;
- take-home 3–10 h;
- typical path: 6 loops + 2 sims + 14 drills + 2 take-homes ≈ 60 h;
- full catalog ≈ 340 h.

**Capstone:** 120–160 h build + ≈ 15 h defense.

| Course | Hours (full) | Fast lane: must do | Fast lane: can test out (section exam at 100% + other-day re-check) | Fast-lane hours |
|---|---|---|---|---|
| `fs-ai` | 106 | S5 RAG and S6 evals labs from a blank editor (L4), S8 security, 3 of the 6 designs, `fs-ai-45` interview layer | S1–S4, S7 | 30 |
| `fs-aidev` | 90 | 40 review drills, S5, 12 AI-round tasks (3 per track), Part VIII boss; the Part VIII capstone can be met by the final SaaS's AI milestone (proposal) | S1, S3, S4 | 27 |
| `fs-soft` | 32 | 4 `rp` (bad news, saying no, feedback, disagreement) | all sections via SJT exams | 4 |
| `fs-beh` | 46 | story bank (S2), one prompt per competency + 10 follow-up chains (S3), S4 for FAANG targets, S5 | S1, S6, S7 (English covered by `fs-en-int`) | 16 |
| `fs-psych` | 94 | one `rp` per tricky family (≈ 70), 20 stress scenarios, 12 negotiations, `fs-psych-41` for platform targets | S1, S5, S6, S7, S9 | 20 |
| `fs-lead` | 52 (S/TL target only) | S11: 25 of the 50 cases, all items; 6 writes (ADR, RFC, postmortem, roadmap, scorecard, growth plan) | S1–S10 | 18 |
| `fs-career` | 44 | S2 rates sheet, S4 CV/LinkedIn/GitHub, S6 negotiations, S7 calculators for own case, Part IX boss + capstone | S1, S3, S5, S8 | 17 |
| `fs-playbook` | 25 | read the sections for the target company types and platforms | – (no gate) | 8 |
| `fs-arena` | 60 typical / 340 full | target loops + simulators + 1–2 take-homes; no test-out (the arena is the proof) | – | 40 |
| `fs-boss` | 15 | everything | – | 15 |
| `fs-capstone` | 150 | **own-project option** (proposal): defend an existing production system you built against the defense rubric. Each milestone rubric is answered with evidence from the real system, and any missing milestone (e.g. no AI feature) must be built | milestones the real system already proves | 15 (+ missing milestones) |
| **Total (VIII, IX, XI)** | **≈ 714** | | | **≈ 210** |

At 90 minutes a day, the full path through these parts is ≈ 16 months alongside the spine, and the fast lane is
≈ 4.5 months. For the owner (an experienced full-stack developer), Batch 1 alone (`fs-playbook`, `fs-psych` S2,
`fs-beh` S1–S2) is ≈ 25 h of fast-lane work and already gives him a story bank and recruiter-question practice.

## 9. Batching (spec §10)

| Batch | Content |
|---|---|
| 1 | `fs-playbook`; `fs-psych` S2; `fs-soft` S1–S2; `fs-beh` S1–S2. Recruiter and behavioral arena drills switch on here |
| 8 | `fs-ai`, `fs-aidev` |
| 9 | the rest of Part IX |
| 11 | `fs-arena`, `fs-boss`, `fs-capstone`, readiness calibration (synthetic + the owner's real loops) |

Each batch's review includes the «дані на дату» owner check (§0.4).

## 10. Notes for the lead

### 10.1 Field-bank coverage

| Question group | Lessons here |
|---|---|
| Recruiter and pressure | `fs-psych` S2–S4 |
| Behavioral | `fs-beh` S3–S5 |
| Platform-specific: intros, "explain your Codility solution", Lemon.io smelly-code review, Arc breadth questions, Gun.io DDD/CQRS and private keys, Turing LLM-output evaluation | `fs-arena` S3 + their source courses |
| AI-round reports | `fs-aidev` S5–S6 |
| Amazon GenAI behavioral | `fs-beh-22`, `fs-psych-13` |
| TL | `fs-lead` S11 |

Each bank entry needs `source:` and `frequency:` on its `qa` card.

### 10.2 Proposed registry changes (lead-owned)

1. Add the skill slugs of these 11 courses (the tables above) to the track manifest.
2. Use `rp` + `mode: stress` for stress scenarios and `ex` for loops and simulators; no new codes.
3. Take-homes are `task` in `fs-arena` 36–43. The §5.1 take-home line moves wholly to Part XI.
4. Final and boss sections (`fs-aidev/part8-final`, `fs-career/part9-final`, `fs-boss/*`) need a rule in registry §3:
   they produce evidence for every skill they draw from and carry no level of their own.
5. Slugs still TBC from other outlines: `fs-en-int/*`, `fs-en-work/*`, `fs-integr/*`, the `fs-algo` method section.

### 10.3 Open questions

- (a) Is `fs-lead` elective for middle targets? (Proposed: yes.)
- (b) The word budget of ≈ 677k for these parts (≈ 25% of the track), and ≈ 230k words of gate-pool authoring on top.
- (c) Two fast-lane proposals: the own-project capstone option, and Part VIII capstone credit from the final SaaS AI
  milestone.
- (d) Consent wording and storage for the real-outcome calibration log.
- (e) The landing date of `[!talk]` / `[!write]` on `main`, which batch 1 depends on.
- (f) Tax coverage now spans UA, PL, US, UK (IR35) and DE (Scheinselbständigkeit) as callouts. Is that enough, or does
  any of them need a full topic?
