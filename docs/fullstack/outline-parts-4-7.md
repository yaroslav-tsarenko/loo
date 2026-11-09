# Full-Stack Zero → Pro — outline, Parts IV–VII (stage 0, revision 2)

> Draft for the lead. Spec: `docs/prompts/fullstack-course.md`. Ids follow `docs/fullstack/registry.md` (course ids, `<course>-<NN>` topics, `<course>-<NN>-<type><nn>` exercises, skills = section slugs, global key `<course>/<skill>`). Revision 2 applies `review-stage0.md` B1, B2, M1, M3, M10 and minor 5. Every number below is computed from the per-section data by one generator, so all tables agree.

## 1. Totals

Columns: ALG algorithms · JS interview-style JS practical · JS-d domain JS (architecture patterns, distributed primitives — not counted toward the §5.1 JS minimum, minor 5) · TS «type a real API» tasks (type challenges are owned by `fs-ts`, M1) · Node · SQL · Dbg debugging/code review · Rec recognition drills · Trf transfer · Pred predict-the-output on JS/Node/TS runtime · Pred-d domain predict (SQL results, Git state, network timing) · Int integrations · SecRev secure code reviews · TM threat models · Lab security labs · SD-B/SD-F full designs · Oth other graded tasks (mutant-graded tests, Git simulator, config linters, estimation, telemetry) · **QZ gate quiz pool** (§6a, B2) · Q&A layered (not gate items) · Cards.

**Words** (M3), two columns on one basis: **A = theory + editorial** — topic articles, task editorials (≈ 250–300 words per graded task) and layered Q&A answers (≈ 280 each) — the same basis as the «Слова» column of `outline-parts-1-3.md`. **B = exercise/tutorial text** — statements, guided-build step texts and «why», hint ladders, quiz/card/drill text, design rubrics. Reused JS-course text is not included.

### 1.1 Per course and per part (new content)

| Part | Course | Topics | Words A | Words B | ALG | JS | JS-d | TS | Node | SQL | Dbg | Rec | Trf | Pred | Pred-d | Int | SecRev | TM | Lab | SD-B | SD-F | Oth | QZ | Q&A | Cards |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IV | `fs-node` Node.js: рантайм і сервер | 35 | 210k | 50k |  |  |  | 4 | 30 |  | 7 | 10 |  | 30 |  |  |  |  |  |  |  |  | 631 | 208 | 283 |
| IV | `fs-api` Проєктування API | 27 | 126k | 35k |  |  |  | 6 | 18 |  | 4 | 10 |  |  |  |  |  |  |  |  |  |  | 489 | 152 | 179 |
| IV | `fs-auth` Автентифікація й авторизація | 22 | 93k | 28k |  |  |  | 2 | 12 |  |  | 9 |  |  |  |  | 5 |  |  |  |  |  | 392 | 100 | 177 |
| IV | `fs-sql` SQL і PostgreSQL | 35 | 240k | 67k |  |  |  |  |  | 120 | 8 | 14 |  |  | 20 |  |  |  |  |  |  |  | 625 | 208 | 310 |
| IV | `fs-nosql` NoSQL і Redis | 19 | 90k | 23k |  |  |  |  | 14 |  | 2 | 12 |  |  |  |  |  |  |  |  |  |  | 311 | 110 | 160 |
| IV | `fs-queues` Черги, фонові задачі й кешування | 13 | 88k | 19k |  |  |  |  | 12 |  | 3 | 10 |  |  |  |  |  |  |  |  |  |  | 242 | 102 | 142 |
| **IV** | **IV. Backend-інженерія** | **151** | **848k** | **222k** |  |  |  | **12** | **86** | **120** | **24** | **65** |  | **30** | **20** |  | **5** |  |  |  |  |  | **2690** | **880** | **1251** |
| V | `fs-integr` Реальні інтеграції | 24 | 135k | 51k |  |  |  | 4 |  |  | 4 | 12 |  |  |  | 48 | 4 |  |  |  |  |  | 462 | 134 | 242 |
| **V** | **V. Інтеграції** | **24** | **135k** | **51k** |  |  |  | **4** |  |  | **4** | **12** |  |  |  | **48** | **4** |  |  |  |  |  | **462** | **134** | **242** |
| VI | `fs-algo` Алгоритми й «Метод Loo» | 48 | 326k | 276k | 503 |  |  |  |  |  |  | 620 | 62 |  |  |  |  |  |  |  |  |  | 386 | 60 | 400 |
| VI | `fs-live` JS і TS лайвкодинг | 26 | 94k | 84k |  | 100 |  | 16 | 10 |  | 30 | 28 | 8 | 38 |  |  |  |  |  |  |  |  | 404 | 36 | 125 |
| VI | `fs-sqlps` SQL: розвʼязання задач | 20 | 47k | 43k |  |  |  |  |  | 150 | 6 | 40 | 6 |  |  |  |  |  |  |  |  |  |  |  |  |
| VI | `fs-arch` Архітектура і якість коду | 21 | 103k | 33k |  |  | 8 |  |  |  | 20 | 30 |  |  |  |  |  |  |  |  |  |  | 402 | 180 | 250 |
| VI | `fs-testing` Стратегія тестування | 17 | 61k | 24k |  |  |  |  |  |  | 8 | 15 |  |  |  |  |  |  |  |  |  | 24 | 286 | 108 | 147 |
| VI | `fs-git` Git для професіоналів | 10 | 36k | 19k |  |  |  |  |  |  |  | 10 |  |  | 15 |  |  |  |  |  |  | 30 | 182 | 70 | 120 |
| **VI** | **VI. Інженерна майстерність** | **142** | **667k** | **480k** | **503** | **100** | **8** | **16** | **10** | **150** | **64** | **743** | **76** | **38** | **15** |  |  |  |  |  |  | **54** | **1660** | **454** | **1042** |
| VII | `fs-netos` Мережі й операційні системи | 18 | 94k | 25k |  |  |  |  | 4 |  |  | 15 |  |  | 10 |  |  |  |  |  |  | 10 | 342 | 156 | 247 |
| VII | `fs-devops` DevOps і хмара | 21 | 116k | 33k |  |  |  |  |  |  | 6 | 15 |  |  |  |  |  |  |  |  |  | 30 | 396 | 194 | 294 |
| VII | `fs-obs` Спостережуваність і надійність | 15 | 72k | 18k |  |  |  |  |  |  | 8 | 12 |  |  |  |  |  |  |  |  |  | 10 | 231 | 120 | 150 |
| VII | `fs-dist` Розподілені системи | 17 | 96k | 23k |  |  | 12 |  |  |  |  | 15 |  |  |  |  |  |  |  |  |  |  | 316 | 158 | 200 |
| VII | `fs-sec` Кібербезпека для інженерів | 26 | 154k | 85k |  |  |  |  |  |  |  | 20 |  |  |  |  | 73 | 24 | 44 |  |  |  | 487 | 206 | 277 |
| VII | `fs-sd` System Design: бекенд і фронтенд | 68 | 246k | 64k |  |  |  |  |  |  |  | 40 |  |  |  |  |  |  |  | 44 | 16 | 30 | 765 | 150 | 250 |
| **VII** | **VII. Системи** | **165** | **779k** | **248k** |  |  | **12** |  | **4** |  | **14** | **117** |  |  | **10** |  | **73** | **24** | **44** | **44** | **16** | **80** | **2537** | **984** | **1418** |
| **IV–VII** | **19 courses** | **482** | **2429k** | **1001k** | **503** | **100** | **20** | **32** | **100** | **270** | **106** | **937** | **76** | **68** | **45** | **48** | **82** | **24** | **44** | **44** | **16** | **134** | **7349** | **2452** | **3953** |

Words A splits into theory articles 1324k + task editorials 419k + layered Q&A answers 687k. Algorithms: **125 easy / 279 medium / 99 hard** = 503 (8 reused from Katas 07). Plus 4 part bosses, 4 capstones, 31 pattern bosses, 8 block bosses.

### 1.2 Against the §5.1 minimums

| Type | §5.1 minimum | New in IV–VII | Reused (JS course) | Status |
|---|---|---|---|---|
| Algorithms & DS | ≥ 450 (≈120/250/80), ≥ 22 patterns | 503 | — | met: 125/279/99, 31 patterns |
| JS practical (interview-style) | ≥ 150 | 100 | 54 | met with reuse: 100 + 54 Katas = 154; domain JS-d 20 not counted |
| TypeScript | ≥ 100 | 32 | — | owned by `fs-ts` (178 in I–III); track = 178 + 32 = 210 |
| Node / backend | ≥ 60 | 100 | — | met |
| SQL | ≥ 250 | 270 | — | met |
| Debugging & code review | ≥ 80 | 106 | 8 | met |
| Recognition drills | ≥ 600 | 937 | — | met |
| Transfer tasks | ≥ 60 | 76 | — | met |
| Predict the output | ≥ 200 | 68 | — | 68 runtime + 45 domain (Pred-d, not counted); rest from I–III |
| Integrations | ≥ 40 | 48 | — | met |
| Security reviews | ≥ 80 | 82 | — | met |
| Threat models | ≥ 20 | 24 | — | met |
| Security labs | ≥ 40 | 44 | — | met |
| System design — backend | ≥ 40 | 44 | — | met |
| System design — frontend | ≥ 15 | 16 | — | met |
| Theory Q&A (track-wide) | ≥ 3,500 | 2452 | — | track-wide; IV–VII = 70% |
| Flashcards (track-wide) | ≥ 6,000 | 3953 | — | track-wide; IV–VII = 65% |
| Security Q&A | ≥ 300 | 306 (fs-auth 100 + fs-sec 206) | — | met |
| Recognition in `fs-algo` / transfer in `fs-algo` | ≥ 600 / ≥ 60 | 620 / 62 | — | met |

## 2. Conventions

- **Ids (registry):** topic `<course>-<NN>` (two digits, stable, numbered in course order, e.g. `fs-node-07`); exercise `<course>-<NN>-<type><nn>` with registry types (`q` quiz, `qa`, `c` card, `po`, `rd`, `task`, `rev`, `sd`, `tm`, `lab`, `ex`), e.g. `fs-sql-17-task03`, `fs-sec-21-lab02`; variant suffix `v<n>` (`fs-sql-17-q03v2`). Skill = section slug (`[a-z0-9-]` ≤ 32); global key `<course>/<skill>`.
- **Levels:** J junior · M middle · S senior · L tech lead (`god` on the `it` scale, shown as «Tech Lead»).
- **Gate quiz pools (B2, blueprint §6):** each topic has concepts = 1 core + 1 per item in the topic (2–3 per topic). Pool per concept: core ≥ 8 variants, other ≥ 6; a concept marked *generated* uses a parametric generator (≥ 3 templates, unlimited variants). **Topic test = 1 variant per concept**, never most of the pool. Pool-exhausted rule (blueprint): generator or remediation task + re-check after N days. Layered Q&A are **not** gate items. Sections marked *no QZ* gate on graded tasks only (timed sets, transfer, `fs-sqlps`).
- **Coding «mastered» (B2):** L4 solve on a later day against **re-seeded hidden tests** + a **sibling problem** of the same pattern/section. The «Sibling» column shows where a type has only one task in a section and where the sibling comes from.
- **Concept owners (M10, registry §4):** theory, layered Q&A and gate pools live only in the owner skill; other courses link and add their angle. Owner rows proposed for the registry: §8.
- **Coding tasks** follow §5.2a/§5.2b (one source → L0–L4 + L5 variants, ≥ 70% with ≥ 3 variants, misconception-tagged tests, server-side grading).

## 3. Course outlines

### Part IV. Backend-інженерія

#### `fs-node` — Node.js: рантайм і сервер

- **Role:** core · **Topics:** 35 · **Words:** A ≈ 210k (theory 140k) · B ≈ 50k
- **Runners:** JS worker + node-lite shim (mock fs/http/stream, fake timers); Node sandbox — для ~12 задач реального рантайму (approval); TS checker
- **Reuse / owners:** Guides/Node.js (26 глав-заглушок ≈ 170 слів, без блоків) — лише скелет; event loop браузера — javascript-noob-to-god/async-memory + fs-jsi/js-async (власники), тут тільки фази libuv
- **Exercise mix:** TS 4 · Node 30 · Dbg 7 · Rec 10 · Pred 30 · QZ 631 · Q&A 208 · Cards 283
- **Generated concepts:** `event-loop`: порядок виводу для згенерованих комбінацій таймерів/промісів/nextTick; `buffers`: перетворення кодувань і довжини в байтах

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Рантайм зсередини** `runtime` | `01` що таке Node і де він доречний · V8 + libuv + bindings<br>`02` CommonJS vs ES Modules і резолюція модулів · npm, package.json, semver, lockfiles<br>`03` LTS і версії | Пояснює, з чого складається Node і як завантажується модуль | J–M | Node 1 · Rec 1 · Pred 2 · Q&A 18 · Cards 30 | 54 / 8 на розділ | Node: сусід з `event-loop` |
| **Event loop Node (фази libuv)** `event-loop` | `04` фази: timers, pending, poll, check, close · process.nextTick vs microtasks<br>`05` setImmediate vs setTimeout · threadpool libuv (fs, crypto, dns.lookup)<br>`06` блокування циклу і event loop lag | Прогнозує порядок виконання і знаходить блокування | M–S | Node 2 · Dbg 1 · Rec 2 · Pred 12 · Q&A 22 · Cards 25 | 45 / 8 на розділ (3 з генератором) | Dbg: сусід з `streams` |
| **Буфери і бінарні дані** `buffers` | `07` Buffer vs TypedArray · кодування utf8/base64/hex<br>`08` endianness і бінарні протоколи · TextEncoder/TextDecoder | Працює з байтами без псування Unicode | J–M | Node 2 · Pred 3 · Q&A 10 · Cards 20 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **Стріми і backpressure** `streams` | `09` Readable/Writable/Transform/Duplex · pipeline і помилки<br>`10` highWaterMark і backpressure · object mode<br>`11` async iteration · Node streams vs Web Streams | Обробляє дані будь-якого розміру з постійною памʼяттю | M–S | Node 5 · Dbg 1 · Rec 1 · Pred 6 · Q&A 20 · Cards 25 | 60 / 9 на розділ | Dbg: сусід з `event-loop` |
| **Файли, процеси, потоки** `processes` | `12` fs/promises, path, URL · process, env, exit codes, сигнали<br>`13` child_process · worker_threads<br>`14` cluster · що коли обирати | Обирає між worker/child/cluster і пояснює чому | M–S | Node 4 · Rec 3 · Pred 3 · Q&A 20 · Cards 25 | 60 / 9 на розділ | ✓ |
| **HTTP-сервер з нуля** `http` | `15` модуль http і життєвий цикл запиту · роутинг<br>`16` парсинг body · keep-alive і таймаути<br>`17` fetch/undici як клієнт | Пише сервер без фреймворку і розуміє, що робить фреймворк | J–M | Node 4 · Q&A 18 · Cards 25 | 54 / 8 на розділ | ✓ |
| **Фреймворки: Express, Fastify, NestJS** `frameworks` | `18` Express: middleware chain і помилки · Fastify: schemas, hooks, plugins, encapsulation<br>`19` NestJS: modules, DI, providers · NestJS: guards, interceptors, pipes<br>`20` як обрати фреймворк | Порівнює фреймворки за архітектурою | J–S | TS 2 · Node 4 · Rec 2 · Q&A 25 · Cards 30 | 54 / 8 на розділ | ✓ |
| **Помилки і надійність** `errors` | `21` operational vs programmer errors · async-помилки і unhandledRejection<br>`22` AsyncLocalStorage і контекст запиту · graceful shutdown<br>`23` health/readiness | Сервер не падає мовчки і зупиняється без втрати запитів | M–S | Node 3 · Dbg 2 · Pred 4 · Q&A 18 · Cards 20 | 54 / 8 на розділ | ✓ |
| **Конфігурація і TypeScript у Node** `config-ts` | `24` env і валідація конфігу (Zod) · TS у Node: type stripping, tsx, build<br>`25` пакети в монорепо · ESM/CJS interop | Налаштовує типобезпечний Node-проєкт | J–M | TS 2 · Node 1 · Q&A 10 · Cards 15 | 40 / 6 на розділ | Node: сусід з `runtime` |
| **Продуктивність і памʼять** `perf-memory` | `26` CPU-профілювання · heap snapshots<br>`27` витоки: closures, listeners, кеші, таймери · GC і прапори<br>`28` метрики event loop | Знаходить витік і гаряче місце за профілем | S–L | Node 2 · Dbg 3 · Rec 1 · Q&A 18 · Cards 25 | 54 / 8 на розділ | ✓ |
| **Безпечний рантайм Node** `safe-runtime` | `29` permission model · безпечний spawn/execFile замість shell<br>`30` ліміти тіла, таймаути, розмір заголовків · 1 вправа-посилання → fs-sec/server-attacks (prototype pollution, ReDoS, path traversal) | Налаштовує рантайм, що не підставляється | M–S | Node 1 · Q&A 6 · Cards 8 | 40 / 6 на розділ | Node: сусід з `runtime` |
| **Тестові інструменти Node** `node-testing` | `31` node:test і Vitest для сервера<br>`32` fake timers, fake fs<br>`33` HTTP-тести через inject (стратегія — fs-testing) | Тестує асинхронний серверний код детерміновано | J–M | Node 1 · Q&A 6 · Cards 10 | 42 / 6 на розділ | Node: сусід з `runtime` |
| **Продакшн і експлуатація** `production` | `34` process managers і контейнери · логи і request id<br>`35` graceful restart і ліміти памʼяті · checklist перед релізом | Готує сервіс до продакшну (місток у Part VII) | M–L | Q&A 17 · Cards 25 | 40 / 6 на розділ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-node/runtime` | J–M | `fs-tools/shell`, `javascript-noob-to-god/deeper` |
| `fs-node/event-loop` | M–S | `fs-node/runtime`, `javascript-noob-to-god/async-memory`, `fs-jsi/js-async` |
| `fs-node/buffers` | J–M | `fs-node/runtime`, `fs-cs/cs-basics` |
| `fs-node/streams` | M–S | `fs-node/buffers`, `fs-node/event-loop` |
| `fs-node/processes` | M–S | `fs-node/event-loop`, `fs-cs/os-basics` |
| `fs-node/http` | J–M | `fs-cs/net-basics`, `fs-node/streams` |
| `fs-node/frameworks` | J–S | `fs-node/http`, `fs-ts/ts-generics` |
| `fs-node/errors` | M–S | `fs-node/http`, `fs-node/processes` |
| `fs-node/config-ts` | J–M | `fs-ts/ts-modules-config`, `fs-node/runtime` |
| `fs-node/perf-memory` | S–L | `fs-node/event-loop`, `fs-node/errors`, `javascript-noob-to-god/engineering` |
| `fs-node/safe-runtime` | M–S | `fs-node/processes`, `fs-node/http` |
| `fs-node/node-testing` | J–M | `fs-node/frameworks`, `fs-fetest/unit-testing` |
| `fs-node/production` | M–L | `fs-node/errors`, `fs-node/perf-memory` |

#### `fs-api` — Проєктування API

- **Role:** core · **Topics:** 27 · **Words:** A ≈ 126k (theory 75k) · B ≈ 35k
- **Runners:** JS worker (handler-функції з mock req/res), TS checker (типи з OpenAPI, tRPC)
- **Reuse / owners:** —
- **Exercise mix:** TS 6 · Node 18 · Dbg 4 · Rec 10 · QZ 489 · Q&A 152 · Cards 179
- **Generated concepts:** `rest`: метод/статус-код для згенерованих сценаріїв

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **HTTP API і REST** `rest` | `01` обмеження REST і модель Richardson · ресурси і URI<br>`02` семантика методів (safe/idempotent) · статус-коди<br>`03` content negotiation | Проєктує передбачувані ендпоінти | J | Node 2 · Rec 2 · Q&A 22 · Cards 30 | 45 / 8 на розділ (3 з генератором) | ✓ |
| **Ресурси і контракти** `contracts` | `04` моделювання ресурсів і вкладені ресурси · DTO vs доменна модель<br>`05` OpenAPI 3.1 design-first · валідація схем (Zod/JSON Schema)<br>`06` типи й клієнти, згенеровані з OpenAPI | Пише контракт першим і генерує з нього типи | J–M | TS 3 · Node 3 · Q&A 18 · Cards 25 | 54 / 8 на розділ | ✓ |
| **Списки: пагінація, фільтри, сортування** `lists` | `07` offset vs cursor (keyset) · стабільний порядок<br>`08` фільтри і пошук · sparse fieldsets<br>`09` total counts і їхня ціна | Обирає пагінацію під дані й навантаження | M | Node 3 · Rec 2 · Q&A 14 · Cards 15 | 54 / 8 на розділ | ✓ |
| **Помилки, версії, еволюція** `errors-versioning` | `10` RFC 9457 problem details · коди помилок<br>`11` версіонування (URI/header/media type) · deprecation і Sunset<br>`12` backward compatibility | Еволюціонує API без поломки клієнтів | M–S | Node 1 · Q&A 16 · Cards 20 | 54 / 8 на розділ | Node: сусід з `rest` |
| **Надійність API (власник: ідемпотентність, rate limiting)** `reliability` | `13` idempotency keys · безпечні ретраї<br>`14` optimistic concurrency (ETag/If-Match) · rate limiting: алгоритми і заголовки<br>`15` таймаути · bulk і long-running operations (202 + status)<br>`16` вебхуки як контракт → fs-integr/webhooks | Робить API стійким до повторів і перевантаження | M–S | Node 5 · Dbg 2 · Rec 2 · Q&A 20 · Cards 24 | 74 / 11 на розділ | ✓ |
| **GraphQL** `graphql` | `17` schema і resolvers · N+1 і DataLoader<br>`18` connections-пагінація і помилки · авторизація на полях<br>`19` persisted queries і complexity limits · federation basics | Будує GraphQL без N+1 і DoS-запитів | M–S | TS 1 · Node 3 · Dbg 1 · Rec 2 · Q&A 24 · Cards 25 | 60 / 9 на розділ | TS: сусід з `contracts`; Dbg: сусід з `reliability` |
| **gRPC і tRPC** `rpc` | `20` protobuf і типи стрімінгу · deadlines<br>`21` tRPC і end-to-end типобезпека · коли RPC, коли REST | Обґрунтовує вибір стилю API | M–S | TS 2 · Rec 1 · Q&A 12 · Cards 15 | 40 / 6 на розділ | ✓ |
| **Realtime: WebSocket, SSE, long polling** `realtime` | `22` handshake і upgrade · heartbeats і reconnect<br>`23` масштабування через pub/sub · SSE<br>`24` вибір транспорту | Обирає realtime-транспорт і масштабує його | M–S | Node 1 · Dbg 1 · Rec 1 · Q&A 14 · Cards 15 | 54 / 8 на розділ | Node: сусід з `rest`; Dbg: сусід з `reliability` |
| **Документація і API в команді** `governance` | `25` docs і SDK · changelog<br>`26` чекліст API-рев'ю · API-first процес<br>`27` публічні vs внутрішні API | Веде API-рев'ю як tech lead | S–L | Q&A 12 · Cards 10 | 54 / 8 на розділ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-api/rest` | J | `fs-cs/net-basics`, `fs-node/http` |
| `fs-api/contracts` | J–M | `fs-api/rest`, `fs-ts/ts-practice` |
| `fs-api/lists` | M | `fs-api/contracts`, `fs-sql/basics` |
| `fs-api/errors-versioning` | M–S | `fs-api/contracts` |
| `fs-api/reliability` | M–S | `fs-api/lists`, `fs-node/errors` |
| `fs-api/graphql` | M–S | `fs-api/contracts`, `fs-sql/joins` |
| `fs-api/rpc` | M–S | `fs-api/contracts` |
| `fs-api/realtime` | M–S | `fs-node/http`, `fs-browser/browser-network` |
| `fs-api/governance` | S–L | `fs-api/errors-versioning`, `fs-api/reliability` |

#### `fs-auth` — Автентифікація й авторизація

- **Role:** core (власник: сесії, JWT, OAuth/OIDC, PKCE, CSRF, відновлення) · **Topics:** 22 · **Words:** A ≈ 93k (theory 60k) · B ≈ 28k
- **Runners:** JS worker (middleware/handlers, fake OAuth/OIDC server), TS checker
- **Reuse / owners:** nextjs-zero-to-pro/auth-security — Next-специфіка (DAL, proxy); тут фреймворк-незалежно. Атаки, лаби, threat models, secure review — у fs-sec (власник)
- **Exercise mix:** TS 2 · Node 12 · Rec 9 · SecRev 5 · QZ 392 · Q&A 100 · Cards 177
- **Generated concepts:** —

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Автентифікація: основи** `passwords` | `01` identification/authn/authz · зберігання паролів (argon2id, bcrypt, pepper)<br>`02` політики паролів (NIST SP 800-63B) · rate limit логіну і user enumeration | Будує безпечний логін з нуля | J–M | Node 2 · Rec 1 · SecRev 1 · Q&A 12 · Cards 25 | 40 / 6 на розділ | SecRev: сусід з `sessions-tokens` |
| **Сесії і токени** `sessions-tokens` | `03` cookie-сесії і session fixation · JWT: структура, підпис, alg-пастки<br>`04` access + refresh rotation, reuse detection · відкликання і де зберігати токени | Обирає сесії чи JWT і пояснює ризики | M–S | TS 1 · Node 3 · Rec 2 · SecRev 1 · Q&A 18 · Cards 30 | 40 / 6 на розділ | TS: сусід з `authz`; SecRev: сусід з `passwords` |
| **CSRF-захист** `csrf` | `05` synchronizer token і double submit<br>`06` SameSite як шар (теорія cookies — fs-browser/web-security)<br>`07` перевірка Origin/Fetch Metadata | Закриває CSRF для форм і API | M | Node 1 · Rec 1 · Q&A 8 · Cards 10 | 42 / 6 на розділ | Node: сусід з `passwords` |
| **OAuth 2.0 і OIDC** `oauth-oidc` | `08` ролі, authorization code + PKCE · client credentials і device flow<br>`09` ID token vs access token, scopes, consent · OAuth 2.1 / Security BCP<br>`10` BFF для SPA | Реалізує code + PKCE і пояснює кожен параметр | M–S | Node 2 · Rec 2 · SecRev 1 · Q&A 18 · Cards 30 | 54 / 8 на розділ | SecRev: сусід з `passwords` |
| **MFA, passkeys, відновлення** `mfa` | `11` TOTP · WebAuthn/passkeys<br>`12` flows відновлення акаунта · magic links | Проєктує відновлення без бекдорів | M–S | Node 1 · SecRev 1 · Q&A 10 · Cards 20 | 40 / 6 на розділ | Node: сусід з `passwords`; SecRev: сусід з `passwords` |
| **Авторизація** `authz` | `13` RBAC і ABAC · ReBAC (ідея Zanzibar) і policy engines<br>`14` object-level authz у коді · ізоляція тенантів<br>`15` RLS у Postgres | Ставить перевірку доступу на кожен обʼєкт | M–S | TS 1 · Node 2 · Rec 2 · SecRev 1 · Q&A 14 · Cards 25 | 54 / 8 на розділ | TS: сусід з `sessions-tokens`; SecRev: сусід з `passwords` |
| **Захист сервера: заголовки, CORS, вхід** `server-hardening` | `16` серверні security-заголовки (CSP/CORS як концепти — fs-browser/web-security) · налаштування CORS на сервері<br>`17` валідація входу і mass assignment у DTO · 1 вправа-посилання → fs-sec/mindset (OWASP Top 10:2025) | Конфігурує сервер безпечно за замовчуванням | M–S | Node 1 · Rec 1 · Q&A 8 · Cards 15 | 40 / 6 на розділ | Node: сусід з `passwords` |
| **Секрети в застосунку** `secrets` | `18` env vs vault/KMS<br>`19` ротація ключів і підпис токенів<br>`20` (витік креденшалів і supply chain — fs-sec/sdlc) | Зберігає й ротує секрети без простою | M–L | Q&A 6 · Cards 12 | 42 / 6 на розділ | ✓ |
| **Auth-архітектура системи** `auth-architecture` | `21` SSO/SAML basics · свій IdP чи готовий<br>`22` authn на gateway · service-to-service (mTLS, JWT) | Захищає дизайн auth на system design | S–L | Q&A 6 · Cards 10 | 40 / 6 на розділ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-auth/passwords` | J–M | `fs-node/http`, `fs-browser/web-security` |
| `fs-auth/sessions-tokens` | M–S | `fs-auth/passwords`, `fs-browser/browser-storage` |
| `fs-auth/csrf` | M | `fs-auth/sessions-tokens` |
| `fs-auth/oauth-oidc` | M–S | `fs-auth/sessions-tokens` |
| `fs-auth/mfa` | M–S | `fs-auth/sessions-tokens` |
| `fs-auth/authz` | M–S | `fs-auth/sessions-tokens`, `fs-sql/modeling` |
| `fs-auth/server-hardening` | M–S | `fs-auth/authz`, `fs-api/contracts` |
| `fs-auth/secrets` | M–L | `fs-auth/sessions-tokens` |
| `fs-auth/auth-architecture` | S–L | `fs-auth/oauth-oidc`, `fs-auth/authz` |

#### `fs-sql` — SQL і PostgreSQL

- **Role:** core (власник теорії: вікна, CTE, рекурсія, gaps-and-islands, top-N, pivot, дедуп) · **Topics:** 35 · **Words:** A ≈ 240k (theory 150k) · B ≈ 67k
- **Runners:** PGlite (WASM) — запити, EXPLAIN; isolation-демо через «два таймлайни» (PGlite single-connection, §10); JS worker — ORM-задачі
- **Reuse / owners:** Guides/PostgreSQL (26 глав-заглушок ≈ 200 слів, без блоків) — скелет; гл.25 Senior Q&A → «як відповісти»
- **Exercise mix:** SQL 120 · Dbg 8 · Rec 14 · Pred-d 20 · QZ 625 · Q&A 208 · Cards 310
- **Generated concepts:** `basics`: результат запиту на згенерованих таблицях (PGlite); `joins`: результат join на згенерованих таблицях; `aggregation`: результат агрегації; `window-functions`: значення вікна для згенерованих рядків і фреймів; `transactions`: двосесійні таймлайни: яка аномалія виникне

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Реляційна модель і перші запити** `basics` | `01` таблиці, ключі, рядки · SELECT/WHERE/ORDER BY/LIMIT<br>`02` типи даних · NULL і тризначна логіка | Пише прості запити і передбачає роль NULL | J | SQL 12 · Pred-d 5 · Q&A 18 · Cards 30 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **JOIN-и і множини** `joins` | `03` inner/left/right/full · self join<br>`04` semi/anti join (EXISTS/NOT EXISTS) · UNION/INTERSECT/EXCEPT і cross join | Мислить множинами замість циклів | J–M | SQL 14 · Rec 2 · Pred-d 4 · Q&A 14 · Cards 20 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **Агрегація і pivot** `aggregation` | `05` GROUP BY і HAVING · FILTER і умовна агрегація<br>`06` pivot/unpivot · COUNT DISTINCT<br>`07` GROUPING SETS/ROLLUP/CUBE | Рахує метрики одним запитом | J–M | SQL 14 · Rec 1 · Pred-d 3 · Q&A 12 · Cards 18 | 45 / 8 на розділ (3 з генератором) | ✓ |
| **Підзапити, CTE, рекурсія** `subqueries-cte` | `08` скалярні й корельовані підзапити · LATERAL<br>`09` CTE · рекурсивні CTE: дерева і графи | Розкладає складний запит на кроки | M | SQL 12 · Rec 2 · Pred-d 2 · Q&A 12 · Cards 15 | 40 / 6 на розділ | ✓ |
| **Віконні функції і прийоми** `window-functions` | `10` OVER і PARTITION BY · frames ROWS/RANGE<br>`11` ROW_NUMBER/RANK/DENSE_RANK · LAG/LEAD і running totals<br>`12` прийом top-N per group · прийом gaps-and-islands і сесіонізація | Обирає вікно замість self-join і впізнає острівні задачі | M | SQL 14 · Rec 3 · Pred-d 3 · Q&A 16 · Cards 24 | 51 / 9 на розділ (3 з генератором) | ✓ |
| **Зміна даних і очищення** `dml` | `13` INSERT/UPDATE/DELETE · UPSERT (ON CONFLICT) і RETURNING<br>`14` MERGE · COPY і bulk-вставки<br>`15` дедуплікація з пріоритетом і SCD | Змінює і чистить дані атомарно | J–M | SQL 10 · Q&A 10 · Cards 18 | 54 / 8 на розділ | ✓ |
| **Моделювання даних** `modeling` | `16` нормалізація 1NF–BCNF і денормалізація · constraints і типи звʼязків<br>`17` soft delete і аудит · JSONB vs колонки<br>`18` схеми multi-tenant | Проєктує схему під запити і цілісність | M–S | SQL 8 · Rec 2 · Q&A 16 · Cards 20 | 54 / 8 на розділ | ✓ |
| **Індекси** `indexes` | `19` B-tree і hash · GIN, GiST, BRIN<br>`20` partial і expression · covering (INCLUDE) і порядок колонок<br>`21` коли індекс шкодить | Підбирає індекс під конкретний запит | M–S | SQL 8 · Rec 2 · Q&A 18 · Cards 25 | 54 / 8 на розділ | ✓ |
| **EXPLAIN і оптимізація** `explain` | `22` читання плану, ANALYZE, BUFFERS · seq vs index vs bitmap scan<br>`23` nested loop/hash/merge join · статистика і оцінки рядків<br>`24` антипатерни і N+1 | Прискорює запит за планом, а не навмання | M–S | SQL 10 · Dbg 4 · Rec 2 · Q&A 16 · Cards 20 | 54 / 8 на розділ | ✓ |
| **Транзакції, MVCC, ізоляція** `transactions` | `25` ACID · MVCC: xmin/xmax, снапшоти<br>`26` рівні ізоляції й аномалії (dirty, non-repeatable, phantom, lost update, write skew) · SELECT FOR UPDATE / SKIP LOCKED і advisory locks<br>`27` deadlocks | Обирає рівень ізоляції під бізнес-інваріант | S | SQL 8 · Dbg 2 · Pred-d 3 · Q&A 22 · Cards 30 | 45 / 8 на розділ (3 з генератором) | ✓ |
| **Експлуатація PostgreSQL** `operations` | `28` VACUUM/autovacuum і bloat · partitioning<br>`29` streaming і logical replication · backup/PITR<br>`30` connection pooling (PgBouncer) · ролі і RLS | Говорить з DBA і SRE однією мовою | S–L | SQL 4 · Q&A 24 · Cards 40 | 60 / 9 на розділ | ✓ |
| **Міграції і ORM** `migrations-orm` | `31` zero-downtime міграції (expand/contract) · довгі блокування і CREATE INDEX CONCURRENTLY<br>`32` Prisma/Drizzle/TypeORM: пастки і N+1 · raw SQL і query builders | Мігрує продакшн-БД без даунтайму | M–S | Dbg 2 · Q&A 18 · Cards 25 | 40 / 6 на розділ | ✓ |
| **PostgreSQL як платформа** `platform` | `33` JSONB і масиви · ranges<br>`34` full-text search · views і materialized views<br>`35` функції і тригери · розширення (pgvector — місток у fs-ai) | Знає, коли Postgres замінює окремий сервіс | M–S | SQL 6 · Q&A 12 · Cards 25 | 60 / 9 на розділ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-sql/basics` | J | `fs-ramp/building-blocks` |
| `fs-sql/joins` | J–M | `fs-sql/basics` |
| `fs-sql/aggregation` | J–M | `fs-sql/joins` |
| `fs-sql/subqueries-cte` | M | `fs-sql/aggregation` |
| `fs-sql/window-functions` | M | `fs-sql/aggregation` |
| `fs-sql/dml` | J–M | `fs-sql/basics`, `fs-sql/window-functions` |
| `fs-sql/modeling` | M–S | `fs-sql/joins`, `fs-sql/dml` |
| `fs-sql/indexes` | M–S | `fs-sql/modeling` |
| `fs-sql/explain` | M–S | `fs-sql/indexes` |
| `fs-sql/transactions` | S | `fs-sql/dml`, `fs-sql/explain` |
| `fs-sql/operations` | S–L | `fs-sql/transactions` |
| `fs-sql/migrations-orm` | M–S | `fs-sql/operations`, `fs-node/config-ts` |
| `fs-sql/platform` | M–S | `fs-sql/indexes` |

#### `fs-nosql` — NoSQL і Redis

- **Role:** core (власник: структури Redis, документна модель) · **Topics:** 19 · **Words:** A ≈ 90k (theory 55k) · B ≈ 23k
- **Runners:** JS worker + Redis-емулятор (підмножина команд, fake clock для TTL); документне сховище — емулятор або PGlite JSONB
- **Reuse / owners:** —
- **Exercise mix:** Node 14 · Dbg 2 · Rec 12 · QZ 311 · Q&A 110 · Cards 160
- **Generated concepts:** `redis-structures`: результат послідовності команд (емулятор)

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Ландшафт сховищ** `landscape` | `01` document, key-value, wide-column, graph, search, time-series<br>`02` модель доступу → модель даних<br>`03` як обрати сховище | Обирає сховище з вимог | J–M | Rec 6 · Q&A 12 · Cards 20 | 42 / 6 на розділ | ✓ |
| **Redis: структури даних** `redis-structures` | `04` strings і hashes · lists і sets<br>`05` sorted sets і streams · bitmaps, HyperLogLog, geo<br>`06` TTL · лічильники, лідерборди, сесії | Обирає структуру Redis під задачу | J–M | Node 5 · Q&A 18 · Cards 30 | 51 / 9 на розділ (3 з генератором) | ✓ |
| **Redis глибше** `redis-internals` | `07` однопотокова модель і pipelining · MULTI/WATCH і Lua/functions<br>`08` RDB/AOF і eviction policies · реплікація, Sentinel, Cluster (hash slots)<br>`09` локи в Redis і застереження до Redlock (fencing — fs-dist/consensus) | Знає гарантії й межі Redis | M–S | Node 4 · Dbg 1 · Rec 2 · Q&A 20 · Cards 30 | 54 / 8 на розділ | Dbg: сусід з `wide-ts` |
| **MongoDB і документна модель** `mongo` | `10` документи · embedding vs referencing<br>`11` індекси і aggregation pipeline · транзакції<br>`12` патерни схем і shard key | Моделює документи під запити | M–S | Node 3 · Rec 1 · Q&A 20 · Cards 25 | 54 / 8 на розділ | ✓ |
| **Пошукові рушії** `search-engines` | `13` inverted index і analyzers · релевантність (BM25)<br>`14` Elasticsearch/OpenSearch basics · синхронізація з Postgres (CDC) | Пояснює, як працює пошук і як його годувати | M | Node 1 · Rec 1 · Q&A 12 · Cards 15 | 40 / 6 на розділ | Node: сусід з `redis-structures` |
| **Wide-column і time-series** `wide-ts` | `15` Cassandra/Dynamo-моделювання (partition key, query-first)<br>`16` DynamoDB single-table<br>`17` time-series (Timescale, downsampling) | Моделює дані «від запиту» | S | Dbg 1 · Rec 2 · Q&A 16 · Cards 25 | 42 / 6 на розділ | Dbg: сусід з `redis-internals` |
| **Вибір і поліглот** `polyglot` | `18` polyglot persistence і консистентність між сховищами<br>`19` кейси «Postgres чи Mongo», «чи потрібен Redis» | Захищає вибір сховища на інтервʼю | S–L | Node 1 · Q&A 12 · Cards 15 | 28 / 4 на розділ | Node: сусід з `redis-structures` |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-nosql/landscape` | J–M | `fs-sql/modeling` |
| `fs-nosql/redis-structures` | J–M | `fs-nosql/landscape` |
| `fs-nosql/redis-internals` | M–S | `fs-nosql/redis-structures` |
| `fs-nosql/mongo` | M–S | `fs-nosql/landscape` |
| `fs-nosql/search-engines` | M | `fs-nosql/landscape`, `fs-sql/platform` |
| `fs-nosql/wide-ts` | S | `fs-nosql/mongo` |
| `fs-nosql/polyglot` | S–L | `fs-nosql/redis-internals`, `fs-nosql/mongo` |

#### `fs-queues` — Черги, фонові задачі й кешування

- **Role:** core (власник: outbox, DLQ, стратегії кешу, stampede) · **Topics:** 13 · **Words:** A ≈ 88k (theory 55k) · B ≈ 19k
- **Runners:** JS worker (симульований брокер з fake clock; cache layer на Redis-емуляторі)
- **Reuse / owners:** Katas 05 «Retry з backoff» і «Пул промісів» — пререквізит; теорія ретраїв і circuit breaker — fs-dist/resilience (пропозиція власника)
- **Exercise mix:** Node 12 · Dbg 3 · Rec 10 · QZ 242 · Q&A 102 · Cards 142
- **Generated concepts:** `reliable`: таймлайн доставки: скільки разів виконається ефект; `cache-strategies`: TTL-таймлайн: hit/miss/stale

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Навіщо асинхронна обробка** `why-async` | `01` sync vs async · черга vs pub/sub vs log<br>`02` гарантії доставки (міф exactly-once) · ack/nack | Пояснює гарантії доставки без міфів | J–M | Rec 3 · Q&A 14 · Cards 20 | 40 / 6 на розділ | ✓ |
| **Брокери** `brokers` | `03` RabbitMQ: exchanges, routing, prefetch · Kafka: topics, partitions, consumer groups<br>`04` Kafka: offsets, retention, порядок · SQS/SNS: visibility timeout, FIFO<br>`05` Redis Streams/BullMQ | Обирає брокер під порядок, обсяг і гарантії | M–S | Node 2 · Rec 2 · Q&A 22 · Cards 30 | 54 / 8 на розділ | ✓ |
| **Надійна обробка** `reliable` | `06` ретраї консьюмера, poison messages і DLQ · ідемпотентні консьюмери і дедуп<br>`07` порядок і backpressure · outbox і inbox | Будує обробник, що витримує дублікати й збої | M–S | Node 4 · Dbg 2 · Rec 1 · Q&A 16 · Cards 20 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **Фонові задачі і планувальники** `jobs` | `08` job queues (BullMQ, pg-boss) · cron і відкладені задачі<br>`09` пріоритети і ліміти конкурентності · довгі задачі і прогрес | Виносить важку роботу з запиту | J–M | Node 3 · Q&A 12 · Cards 15 | 40 / 6 на розділ | ✓ |
| **Кешування: стратегії** `cache-strategies` | `10` cache-aside, read/write-through, write-behind · TTL та інвалідація<br>`11` дизайн ключів і negative caching · багаторівневий кеш (in-process + Redis) | Обирає стратегію кешу й інвалідацію | M | Node 2 · Rec 2 · Q&A 18 · Cards 25 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **Кешування: проблеми і масштаб** `cache-scale` | `12` stampede: локи, early refresh, jitter · hot keys<br>`13` консистентність кеш ↔ БД · HTTP-кеш з боку сервера і CDN: Cache-Control для API, surrogate keys, purge (основи — fs-browser) | Захищає БД від лавини і пояснює інвалідацію на SD | S | Node 1 · Dbg 1 · Rec 2 · Q&A 20 · Cards 32 | 40 / 6 на розділ | Node: сусід з `brokers`; Dbg: сусід з `reliable` |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-queues/why-async` | J–M | `fs-node/event-loop` |
| `fs-queues/brokers` | M–S | `fs-queues/why-async` |
| `fs-queues/reliable` | M–S | `fs-queues/brokers`, `fs-sql/transactions`, `fs-api/reliability` |
| `fs-queues/jobs` | J–M | `fs-queues/reliable` |
| `fs-queues/cache-strategies` | M | `fs-nosql/redis-structures`, `fs-browser/browser-network` |
| `fs-queues/cache-scale` | S | `fs-queues/cache-strategies` |

### Part V. Інтеграції

#### `fs-integr` — Реальні інтеграції

- **Role:** core (власник: вебхуки, платежі, файли, пошук у продукті) · **Topics:** 24 · **Words:** A ≈ 135k (theory 80k) · B ≈ 51k
- **Runners:** JS worker + fake-провайдери (Stripe events/signatures, OAuth/OIDC server, S3 presign, search) — офлайн, без ключів; TS checker
- **Reuse / owners:** JS Projects 08 «HTTP-клієнт» — пререквізит §1 (розширюємо, не переписуємо)
- **Exercise mix:** TS 4 · Dbg 4 · Rec 12 · Int 48 · SecRev 4 · QZ 462 · Q&A 134 · Cards 242
- **Generated concepts:** —

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Патерни інтеграцій з third-party API** `third-party` | `01` автентифікація (API keys, client credentials) · ліміти (429, Retry-After) і пагінація<br>`02` таймаути і circuit breaker на клієнті (теорія — fs-dist/resilience) · SDK чи raw HTTP | Пише клієнт, що переживає чужі збої | M | Dbg 1 · Rec 2 · Int 5 · Q&A 10 · Cards 16 | 40 / 6 на розділ | Dbg: сусід з `files` |
| **Вебхуки (власник)** `webhooks` | `03` вхідні і вихідні · перевірка підпису (HMAC, timing-safe)<br>`04` replay protection (timestamp, nonce) · ідемпотентність і порядок<br>`05` ретраї і relay | Обробляє вебхук рівно один раз за ефектом | M–S | TS 1 · Int 5 · SecRev 1 · Q&A 12 · Cards 20 | 54 / 8 на розділ | TS: сусід з `payments`; SecRev: сусід з `payments` |
| **Платежі: Stripe** `payments` | `06` Checkout vs Payment Intents, SCA/3DS · підписки і proration<br>`07` invoices, refunds, disputes · вебхуки і test mode<br>`08` звірка (reconciliation) · PCI DSS scope | Будує білінг, що не втрачає гроші | M–S | TS 1 · Rec 2 · Int 8 · SecRev 1 · Q&A 22 · Cards 35 | 60 / 9 на розділ | TS: сусід з `webhooks`; SecRev: сусід з `webhooks` |
| **Ідентичність через провайдерів** `identity` | `09` OAuth/OIDC-провайдери (Google, GitHub) · SSO/SAML у B2B<br>`10` magic links · account linking і пастки social login | Підключає логін через провайдера безпечно | M | Int 5 · SecRev 1 · Q&A 10 · Cards 16 | 40 / 6 на розділ | SecRev: сусід з `webhooks` |
| **Email** `email` | `11` транзакційні листи (Resend/SES/SendGrid) і шаблони · SPF/DKIM/DMARC<br>`12` bounces, complaints, suppression lists · надсилання через чергу | Листи доходять і не потрапляють у спам | J–M | Int 3 · Q&A 10 · Cards 20 | 40 / 6 на розділ | ✓ |
| **Файли і медіа** `files` | `13` uploads (multipart, resumable) · presigned URLs і S3/R2<br>`14` обробка зображень і транскодування (концепт) · антивірус і CDN | Завантажує файли напряму в сховище безпечно | M | Dbg 1 · Int 5 · SecRev 1 · Q&A 12 · Cards 20 | 40 / 6 на розділ | Dbg: сусід з `third-party`; SecRev: сусід з `webhooks` |
| **Пошук у продукті** `product-search` | `15` Postgres FTS · Meilisearch/Typesense<br>`16` автодоповнення і typo tolerance · пайплайн індексації | Додає пошук під обсяг і бюджет | M | Rec 2 · Int 4 · Q&A 10 · Cards 15 | 40 / 6 на розділ | ✓ |
| **Realtime і сповіщення** `realtime-notify` | `17` WebSocket/SSE у масштабі, pub/sub, presence · колаборативне редагування (OT/CRDT — вступ)<br>`18` web push і mobile push (концепт) · in-app сповіщення | Будує систему сповіщень з усіма каналами | M–S | Dbg 1 · Rec 2 · Int 5 · Q&A 14 · Cards 25 | 40 / 6 на розділ | Dbg: сусід з `third-party` |
| **Продуктова інфраструктура** `product-infra` | `19` headless CMS · feature flags і A/B-тести<br>`20` i18n/l10n · карти і геокодинг<br>`21` аналітика подій і consent (GDPR) | Підключає продуктові сервіси з урахуванням приватності | J–M | Rec 2 · Int 4 · Q&A 14 · Cards 30 | 54 / 8 на розділ | ✓ |
| **Дані і SaaS-платформа** `saas-platform` | `22` імпорт/експорт PDF/CSV/Excel через стріми · multi-tenancy<br>`23` тарифи, квоти, usage metering · audit logs<br>`24` AI API (місток у fs-ai) | Будує платформні фічі B2B SaaS | M–S | TS 2 · Dbg 1 · Rec 2 · Int 4 · Q&A 20 · Cards 45 | 54 / 8 на розділ | Dbg: сусід з `third-party` |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-integr/third-party` | M | `javascript-noob-to-god/projects`, `fs-api/reliability` |
| `fs-integr/webhooks` | M–S | `fs-integr/third-party`, `fs-queues/reliable` |
| `fs-integr/payments` | M–S | `fs-integr/webhooks` |
| `fs-integr/identity` | M | `fs-auth/oauth-oidc` |
| `fs-integr/email` | J–M | `fs-queues/jobs` |
| `fs-integr/files` | M | `fs-api/contracts`, `fs-auth/authz` |
| `fs-integr/product-search` | M | `fs-nosql/search-engines`, `fs-sql/platform` |
| `fs-integr/realtime-notify` | M–S | `fs-api/realtime` |
| `fs-integr/product-infra` | J–M | `fs-integr/third-party` |
| `fs-integr/saas-platform` | M–S | `fs-node/streams`, `fs-auth/authz` |

### Part VI. Інженерна майстерність

#### `fs-algo` — Алгоритми й «Метод Loo»

- **Role:** core · паралельний потік · **Topics:** 48 · **Words:** A ≈ 326k (theory 140k) · B ≈ 276k
- **Runners:** JS worker (TS-варіант через type stripping); recognition — quiz-блоки
- **Reuse / owners:** Katas 07 (8 задач) у пулах патернів з метаданими драбини, текст не переписуємо; Kata 06 Trie/LRU і Kata 01 анаграми — посилання
- **Exercise mix:** ALG 503 · Rec 620 · Trf 62 · QZ 386 · Q&A 60 · Cards 400
- **Generated concepts:** `method`: обмеження → складність; складність фрагмента коду; `b1`: складність рішення (генератор); тригер → патерн (пул); `b2`: складність рішення (генератор); тригер → патерн (пул); `b3`: складність рішення (генератор); тригер → патерн (пул); `b4`: складність рішення (генератор); тригер → патерн (пул); `b5`: складність рішення (генератор); тригер → патерн (пул); `b6`: складність рішення (генератор); тригер → патерн (пул); `b7`: складність рішення (генератор); тригер → патерн (пул); `b8`: складність рішення (генератор); тригер → патерн (пул)

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **«Метод Loo» і складність** `method` | `01` 7 кроків методу і B/U/D · Big-O, амортизація, дерево рекурсії<br>`02` обмеження як підказки (n ≤ 20 / 10⁴ / 10⁶) · що робити, коли застряг; думати вголос<br>`03` як влаштовані масив, Map, Set, рядок у V8 (reported Arc.dev) | Знає метод і читає обмеження → цільова складність до коду | J–M | Rec 60 · Q&A 20 · Cards 40 | 45 / 8 на розділ (3 з генератором) | ✓ |
| **Лінійні структури: хеш, вказівники, вікно** `b1` | `04` P01 Масиви й рядки: обхід і зміна на місці<br>`05` P02 Хешування і підрахунок<br>`06` P03 Два вказівники<br>`07` P04 Ковзне вікно<br>`08` Мікс-сет B1 (патерн не оголошено) | Урок патерну → задачі E→M→H → бос патерну (L4, таймер) → мікс-сет без назви патерну | J–S | ALG 78 · Rec 72 · Trf 4 · Cards 40 | 44 / 8 на розділ (4 з генератором) | ✓ |
| **Префікси, сортування, бінарний пошук** `b2` | `09` P05 Префіксні суми і difference array<br>`10` P06 Сортування і sweep line<br>`11` P07 Бінарний пошук за індексом<br>`12` P08 Бінарний пошук по відповіді<br>`13` Мікс-сет B2 (патерн не оголошено) | Урок патерну → задачі E→M→H → бос патерну (L4, таймер) → мікс-сет без назви патерну | J–S | ALG 66 · Rec 72 · Trf 4 · Cards 40 | 44 / 8 на розділ (4 з генератором) | ✓ |
| **Стек, черга, списки, симуляція** `b3` | `14` P09 Стек і монотонний стек<br>`15` P10 Черга, дек, монотонний дек<br>`16` P11 Звʼязані списки, fast/slow<br>`17` P12 Симуляція і парсинг<br>`18` Мікс-сет B3 (патерн не оголошено) | Урок патерну → задачі E→M→H → бос патерну (L4, таймер) → мікс-сет без назви патерну | J–S | ALG 66 · Rec 72 · Trf 4 · Cards 40 | 44 / 8 на розділ (4 з генератором) | ✓ |
| **Рекурсія, backtracking, дерева** `b4` | `19` P13 Рекурсія і divide & conquer<br>`20` P14 Backtracking<br>`21` P15 Дерева: DFS/BFS<br>`22` P16 BST і побудова дерев<br>`23` Мікс-сет B4 (патерн не оголошено) | Урок патерну → задачі E→M→H → бос патерну (L4, таймер) → мікс-сет без назви патерну | M–S | ALG 69 · Rec 72 · Trf 4 · Cards 40 | 44 / 8 на розділ (4 з генератором) | ✓ |
| **Купи, інтервали, жадібні** `b5` | `24` P17 Купи і top-K<br>`25` P18 Інтервали<br>`26` P19 Жадібні алгоритми<br>`27` Мікс-сет B5 (патерн не оголошено) | Урок патерну → задачі E→M→H → бос патерну (L4, таймер) → мікс-сет без назви патерну | M–S | ALG 51 · Rec 56 · Trf 3 · Cards 30 | 33 / 6 на розділ (3 з генератором) | ✓ |
| **Графи** `b6` | `28` P20 Графи: BFS/DFS, сітки<br>`29` P21 Топологічне сортування<br>`30` P22 Union-Find<br>`31` P23 Найкоротші шляхи і MST<br>`32` Мікс-сет B6 (патерн не оголошено) | Урок патерну → задачі E→M→H → бос патерну (L4, таймер) → мікс-сет без назви патерну | M–S | ALG 57 · Rec 72 · Trf 4 · Cards 40 | 44 / 8 на розділ (4 з генератором) | ✓ |
| **Динамічне програмування** `b7` | `33` P24 DP 1D: рекурсія + памʼять<br>`34` P25 DP 2D і рюкзак<br>`35` P26 DP на рядках і LIS<br>`36` P27 DP: інтервальне, bitmask, на деревах<br>`37` Мікс-сет B7 (патерн не оголошено) | Урок патерну → задачі E→M→H → бос патерну (L4, таймер) → мікс-сет без назви патерну | M–S | ALG 60 · Rec 72 · Trf 4 · Cards 40 | 44 / 8 на розділ (4 з генератором) | ✓ |
| **Trie, біти, математика, дизайн структур** `b8` | `38` P28 Префіксні дерева<br>`39` P29 Бітові трюки<br>`40` P30 Математика: прості, НСД, модулі<br>`41` P31 Спроєктуй структуру даних<br>`42` Мікс-сет B8 (патерн не оголошено) | Урок патерну → задачі E→M→H → бос патерну (L4, таймер) → мікс-сет без назви патерну | M–S | ALG 56 · Rec 72 · Trf 4 · Cards 40 | 44 / 8 на розділ (4 з генератором) | ✓ |
| **«Метод Loo» у житті й роботі** `transfer` | `43` записи і логи: дедуп, групування, агрегація · розклади і ресурси: злиття, чергування, бюджет<br>`44` маршрути і залежності: найдешевший шлях, міграції, цикли пакетів · тексти і версії: шаблони, semver, вирівнювання<br>`45` структури в продукті: кеш, undo, права в ієрархії | Переносить патерни на робочі задачі без підказки про патерн | M–S | Trf 31 | no QZ | ✓ |
| **Інтерв'ю-режим** `interview` | `46` Codility/HackerRank-формат (3 задачі ≈ 90 хв, reported Toptal)<br>`47` «поясни своє рішення» наживо, думати вголос англійською<br>`48` тайм-менеджмент і L4-репетиції за FSRS | Проходить таймовані сети на L4 і захищає рішення | M–L | Q&A 40 · Cards 50 | no QZ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-algo/method` | J–M | `fs-ramp/method-loo-1`, `fs-ramp/complexity-intuition`, `javascript-noob-to-god/core` |
| `fs-algo/b1` | J–S | `fs-algo/method` |
| `fs-algo/b2` | J–S | `fs-algo/b1` |
| `fs-algo/b3` | J–S | `fs-algo/b1` |
| `fs-algo/b4` | M–S | `fs-algo/b1`, `fs-algo/b3` |
| `fs-algo/b5` | M–S | `fs-algo/b2`, `fs-algo/b4` |
| `fs-algo/b6` | M–S | `fs-algo/b3`, `fs-algo/b4`, `fs-algo/b5` |
| `fs-algo/b7` | M–S | `fs-algo/b4` |
| `fs-algo/b8` | M–S | `fs-algo/b4`, `fs-algo/b5` |
| `fs-algo/transfer` | M–S | `fs-algo/b1`, `fs-algo/b2`, `fs-algo/b3`, `fs-algo/b4`, `fs-algo/b5`, `fs-algo/b6`, `fs-algo/b7`, `fs-algo/b8` |
| `fs-algo/interview` | M–L | `fs-algo/transfer`, `fs-en-int` |

Pattern table with siblings: §4.

#### `fs-live` — JS і TS лайвкодинг

- **Role:** core · **Topics:** 26 · **Words:** A ≈ 94k (theory 36k) · B ≈ 84k
- **Runners:** JS worker; TS checker; node-lite shim для Node-раунду
- **Reuse / owners:** JavaScript Katas 01–06, 08 (54) і 09 (8) — базовий пул без дублювання; type challenges — пул fs-ts/ts-type-level і fs-ts/ts-practice (власник), тут лише таймовані сети з нього + нові «типізуй реальний API»; debounce/скасування — теорія у fs-state
- **Exercise mix:** JS 100 · TS 16 · Node 10 · Dbg 30 · Rec 28 · Trf 8 · Pred 38 · QZ 404 · Q&A 36 · Cards 125
- **Generated concepts:** —

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Формат практичного раунду** `format` | `01` що питають vetted-мережі і продуктові компанії<br>`02` уточнювальні питання і думати вголос<br>`03` тайм-менеджмент і мапа Katas → цей курс | Знає формат і план на 45–60 хв | J–M | Rec 6 · Q&A 8 · Cards 10 | 42 / 6 на розділ | ✓ |
| **Утиліти і рядки (понад Katas)** `utils` | `04` memoize з LRU/TTL-витісненням · deepFreeze і groupBy/partition<br>`05` lazy pipelines на генераторах · поділ повідомлення на фрагменти ≤ K символів цілими словами (reported Gun.io-style, власне формулювання)<br>`06` вирівнювання тексту і diff рядків (LCS) | Пише утиліти з edge cases з першого разу | J–M | JS 18 · Dbg 4 · Trf 2 · Pred 12 · Q&A 4 · Cards 20 | 54 / 8 на розділ | ✓ |
| **Асинхронність і конкурентність на час** `async` | `07` fetch зі скасуванням і таймаутом — polyfill на час (теорія — fs-state/client-state) · пул з пріоритетами і mutex/semaphore<br>`08` retry-policy обʼєкт і дедуп in-flight запитів · batching (DataLoader-like) і polling з backoff<br>`09` async iterator по пагінованому API | Керує конкурентністю без гонок | M–S | JS 20 · Dbg 6 · Rec 4 · Trf 2 · Pred 16 · Q&A 6 · Cards 25 | 54 / 8 на розділ | ✓ |
| **Структури і патерни** `structures` | `10` DI-контейнер і plugin system · роутер з параметрами<br>`11` rate limiter: token bucket, sliding log · LFU і TTL-кеш<br>`12` undo/redo і state machine · typed event bus і middleware pipeline (compose) | Будує міні-інфраструктуру за 30–45 хв | M–S | JS 22 · Dbg 4 · Rec 6 · Trf 2 · Q&A 6 · Cards 25 | 60 / 9 на розділ | ✓ |
| **Парсинг і симуляція** `parsing` | `13` токенізатор і JSON-парсер (підмножина) · CSV з лапками і query string<br>`14` парсер cron-виразів · markdown-підмножина<br>`15` агрегатор логів | Пише парсер покроково з тестами | M–S | JS 16 · Dbg 4 · Rec 4 · Trf 2 · Pred 4 · Q&A 4 · Cards 20 | 54 / 8 на розділ | ✓ |
| **Debugging і код-рев'ю** `review` | `16` гонки, stale closures, витоки · off-by-one і помилки в async-обробці<br>`17` рев'ю PR-diff з коментарями за рубрикою · рефакторинг legacy-функції (продовження Katas 09) | Знаходить проблеми в чужому коді (reported Lemon.io) | M–S | Dbg 12 · Rec 4 · Q&A 4 · Cards 15 | 40 / 6 на розділ | ✓ |
| **TypeScript: типізуй реальний API** `ts-real-api` | `18` overloads vs generics на реальних сигнатурах · типи з Zod-схем для DTO<br>`19` builder з накопиченням типів · typed fetch-клієнт з route map<br>`20` типізація Fastify/Express-хендлерів і контексту middleware · результати репозиторію/ORM-запитів<br>`21` переходи state machine · plugin registry через module augmentation<br>`22` .d.ts для нетипізованої JS-бібліотеки · таймовані сети з пулу fs-ts (6 × 4, не нові задачі) | Типізує реальні API під тиском часу | M–S | TS 16 · Rec 4 · Pred 6 · Q&A 4 · Cards 10 | 100 / 15 на розділ | ✓ |
| **Node-раунд** `node-round` | `23` CLI-утиліта · transform-стрім (NDJSON-агрегатор)<br>`24` HTTP-хендлер з валідацією (mock) · обхід файлів з обмеженням конкурентності і rate-limited worker | Проходить практичний Node-раунд | M–S | Node 10 | no QZ | ✓ |
| **Таймовані сети** `timed` | `25` 6 сетів × 4 задачі у форматі vetted-мереж (Toptal/Lemon.io/Arc/Gun.io-style)<br>`26` «поясни своє рішення» | Вкладається в час на L4 | M–L | JS 24 | no QZ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-live/format` | J–M | `javascript-noob-to-god/livecoding`, `fs-algo/method` |
| `fs-live/utils` | J–M | `javascript-noob-to-god/livecoding`, `javascript-noob-to-god/deeper` |
| `fs-live/async` | M–S | `javascript-noob-to-god/async-memory`, `fs-jsi/js-async` |
| `fs-live/structures` | M–S | `javascript-noob-to-god/livecoding`, `fs-api/reliability` |
| `fs-live/parsing` | M–S | `fs-live/structures` |
| `fs-live/review` | M–S | `javascript-noob-to-god/livecoding` |
| `fs-live/ts-real-api` | M–S | `fs-ts/ts-type-level`, `fs-ts/ts-practice` |
| `fs-live/node-round` | M–S | `fs-node/streams`, `fs-node/http` |
| `fs-live/timed` | M–L | `fs-live/utils`, `fs-live/async`, `fs-live/structures`, `fs-live/parsing` |

#### `fs-sqlps` — SQL: розвʼязання задач

- **Role:** core (лише таймовані задачі, без нової теорії) · **Topics:** 20 · **Words:** A ≈ 47k (theory 6k) · B ≈ 43k
- **Runners:** PGlite (порівняння result set, order-aware де треба; EXPLAIN-задачі читають план)
- **Reuse / owners:** уся теорія — fs-sql (власник); тут брифінг ≤ 600 слів на розділ + редакторіали
- **Exercise mix:** SQL 150 · Dbg 6 · Rec 40 · Trf 6
- **Generated concepts:** —

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Підхід до SQL-задачі** `approach` | `01` чекліст: схема → множини → кроки CTE → NULL-пастки → перевірка (посилання на fs-sql) | Атакує незнайому задачу за чеклістом | J–M | SQL 10 · Rec 8 | no QZ | ✓ |
| **JOIN і anti-join задачі** `joins-ps` | `02` клієнти без замовлень<br>`03` відповідність двох таблиць<br>`04` self-join пари | Обирає правильний вид join на час | J–M | SQL 18 · Rec 4 | no QZ | ✓ |
| **Умовна агрегація і pivot** `agg-pivot` | `05` відсотки від цілого<br>`06` когорти<br>`07` pivot-звіти | Рахує бізнес-метрики одним запитом | M | SQL 18 · Rec 4 | no QZ | ✓ |
| **Top-N per group** `topn` | `08` ties і три способи top-N | Розвʼязує top-N трьома способами | M | SQL 16 · Rec 4 | no QZ | ✓ |
| **Running totals і зсуви** `running` | `09` кумулятивні суми і ковзні середні<br>`10` рік до року | Працює з фреймами вікон на час | M | SQL 16 · Rec 4 | no QZ | ✓ |
| **Gaps-and-islands і сесії** `gaps-islands` | `11` серії днів і streaks<br>`12` сесіонізація подій | Впізнає острівну задачу на час | M–S | SQL 16 · Rec 4 · Trf 2 | no QZ | ✓ |
| **Рекурсивні CTE** `recursive` | `13` оргструктури<br>`14` шляхи в графі<br>`15` генерація дат | Обходить дерева і графи в SQL | M–S | SQL 12 · Rec 2 | no QZ | ✓ |
| **Дедуп і очищення** `dedupe` | `16` дублікати з пріоритетом<br>`17` SCD-звіти | Чистить дані без втрат | M | SQL 12 · Dbg 2 · Rec 2 · Trf 2 | no QZ | ✓ |
| **Оптимізація задач** `optimize` | `18` перепиши швидше (різниця в EXPLAIN)<br>`19` підзапит → JOIN → вікно | Пояснює, чому варіант швидший | M–S | SQL 14 · Dbg 4 · Rec 4 | no QZ | ✓ |
| **Таймовані SQL-раунди** `timed-sql` | `20` аналітичні й продуктові сети на час з поясненням вголос | Вкладається в 30–45 хв на 3 запити | M–L | SQL 18 · Rec 4 · Trf 2 | no QZ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-sqlps/approach` | J–M | `fs-sql/joins`, `fs-algo/method` |
| `fs-sqlps/joins-ps` | J–M | `fs-sql/joins` |
| `fs-sqlps/agg-pivot` | M | `fs-sql/aggregation` |
| `fs-sqlps/topn` | M | `fs-sql/window-functions` |
| `fs-sqlps/running` | M | `fs-sql/window-functions` |
| `fs-sqlps/gaps-islands` | M–S | `fs-sql/window-functions` |
| `fs-sqlps/recursive` | M–S | `fs-sql/subqueries-cte` |
| `fs-sqlps/dedupe` | M | `fs-sql/dml` |
| `fs-sqlps/optimize` | M–S | `fs-sql/explain` |
| `fs-sqlps/timed-sql` | M–L | `fs-sqlps/topn`, `fs-sqlps/gaps-islands` |

#### `fs-arch` — Архітектура і якість коду

- **Role:** core (власник: SOLID, GoF, DDD, стилі архітектури, ADR) · **Topics:** 21 · **Words:** A ≈ 103k (theory 45k) · B ≈ 33k
- **Runners:** JS worker / TS checker (рефакторинг під тести); рев'ю — блок вибору рядків + рубрика
- **Reuse / owners:** javascript-noob-to-god/engineering і JS Q&A 12 — пререквізит; тут TS і бекенд-масштаб
- **Exercise mix:** JS-d 8 · Dbg 20 · Rec 30 · QZ 402 · Q&A 180 · Cards 250
- **Generated concepts:** —

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Принципи дизайну** `principles` | `01` coupling і cohesion · SOLID у TS<br>`02` DRY/KISS/YAGNI і composition over inheritance · Law of Demeter | Аргументує дизайн через принципи | J–M | Dbg 2 · Rec 4 · Q&A 20 · Cards 25 | 40 / 6 на розділ | ✓ |
| **Патерни GoF для JS/TS** `gof` | `03` factory, builder · adapter, decorator, facade, proxy<br>`04` strategy, observer, command · state, chain of responsibility, iterator<br>`05` зловживання singleton | Застосовує патерн там, де він знімає біль | M | JS-d 6 · Rec 6 · Q&A 24 · Cards 35 | 54 / 8 на розділ | ✓ |
| **Функціональні патерни** `functional` | `06` імутабельність · functional core / imperative shell<br>`07` Result/Either і конвеєри · ADT через discriminated unions | Відокремлює чисту логіку від ефектів | M | JS-d 2 · Dbg 1 · Rec 2 · Q&A 10 · Cards 15 | 40 / 6 на розділ | Dbg: сусід з `principles` |
| **Рефакторинг і code smells** `refactoring` | `08` каталог запахів · прийоми рефакторингу<br>`09` characterization tests · strangler fig і робота з legacy | Безпечно рефакторить чужий код | M–S | Dbg 9 · Rec 6 · Q&A 14 · Cards 25 | 40 / 6 на розділ | ✓ |
| **Code review і якість** `review-quality` | `10` етикет рев'ю і тон коментарів · що шукати і розмір PR<br>`11` лінтери і статичний аналіз · naming, коментарі, документація | Пише рев'ю, яке приймають | J–L | Dbg 6 · Rec 2 · Q&A 12 · Cards 15 | 40 / 6 на розділ | ✓ |
| **Архітектура застосунку** `app-architecture` | `12` layered · clean/hexagonal (ports & adapters)<br>`13` modular monolith і vertical slices · dependency rule<br>`14` repository і unit of work | Структурує бекенд, що росте без хаосу | M–S | Dbg 2 · Rec 4 · Q&A 26 · Cards 35 | 54 / 8 на розділ | ✓ |
| **DDD** `ddd` | `15` ubiquitous language · bounded contexts і context mapping<br>`16` aggregates, entities, value objects · domain events і event storming (reported Gun.io: DDD/CQRS) | Виділяє контексти й агрегати на кейсі | S–L | Rec 2 · Q&A 22 · Cards 30 | 40 / 6 на розділ | ✓ |
| **Моноліт, мікросервіси, події, CQRS/ES** `styles` | `17` коли ділити і власність даних · event-driven інтеграція<br>`18` CQRS · event sourcing (і коли ні)<br>`19` BFF і API gateway | Обирає архітектурний стиль з trade-offs | S–L | Rec 4 · Q&A 26 · Cards 30 | 54 / 8 на розділ | ✓ |
| **Технічний борг і рішення** `decisions` | `20` квадранти tech debt · ADR і RFC<br>`21` документація (C4) · fitness functions | Фіксує й захищає архітектурні рішення | S–L | Q&A 26 · Cards 40 | 40 / 6 на розділ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-arch/principles` | J–M | `javascript-noob-to-god/engineering`, `fs-ts/ts-practice` |
| `fs-arch/gof` | M | `fs-arch/principles` |
| `fs-arch/functional` | M | `fs-arch/gof` |
| `fs-arch/refactoring` | M–S | `fs-arch/principles`, `fs-testing/unit-doubles` |
| `fs-arch/review-quality` | J–L | `fs-arch/refactoring` |
| `fs-arch/app-architecture` | M–S | `fs-arch/gof`, `fs-arch/functional`, `fs-node/frameworks` |
| `fs-arch/ddd` | S–L | `fs-arch/app-architecture` |
| `fs-arch/styles` | S–L | `fs-arch/ddd`, `fs-queues/brokers` |
| `fs-arch/decisions` | S–L | `fs-arch/styles` |

#### `fs-testing` — Стратегія тестування

- **Role:** core (власник: стратегія, doubles, контракти, флейки) · **Topics:** 17 · **Words:** A ≈ 61k (theory 25k) · B ≈ 24k
- **Runners:** JS worker: тести учня проти еталону і мутантів (оцінка = вбиті мутанти); PGlite для інтеграційних
- **Reuse / owners:** fs-fetest (React-тестування) і JS Q&A 10 — пререквізит
- **Exercise mix:** Dbg 8 · Rec 15 · Oth 24 · QZ 286 · Q&A 108 · Cards 147
- **Generated concepts:** —

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Що і навіщо тестувати** `strategy` | `01` піраміда vs трофей vs honeycomb · типи тестів<br>`02` ціна і впевненість · що не тестувати | Будує стратегію під проєкт | J–M | Rec 4 · Q&A 16 · Cards 20 | 40 / 6 на розділ | ✓ |
| **Юніт-тести і test doubles** `unit-doubles` | `03` AAA і ізоляція · mocks vs stubs vs fakes vs spies<br>`04` property-based testing · mutation testing | Пише тести, що ловлять баги | J–M | Dbg 1 · Rec 4 · Oth 6 · Q&A 18 · Cards 25 | 40 / 6 на розділ | Dbg: сусід з `integration-contract` |
| **TDD** `tdd` | `05` red-green-refactor<br>`06` outside-in vs inside-out<br>`07` TDD-кати | Веде розробку від тесту | M | Oth 4 · Q&A 10 · Cards 10 | 42 / 6 на розділ | ✓ |
| **Інтеграційні і контрактні тести** `integration-contract` | `08` тести з БД (PGlite/testcontainers) · API-тести<br>`09` consumer-driven contracts (Pact) · MSW на бекенді | Тестує межі сервісів | M–S | Dbg 1 · Rec 3 · Oth 6 · Q&A 18 · Cards 25 | 40 / 6 на розділ | Dbg: сусід з `unit-doubles` |
| **E2E з бекендом** `e2e-backend` | `10` Playwright проти справжнього API<br>`11` тестові дані і fixtures<br>`12` visual regression (UI-деталі — fs-fetest/e2e) | Пише стабільні наскрізні тести | M | Oth 2 · Q&A 8 · Cards 12 | 42 / 6 на розділ | ✓ |
| **Асинхронний код і флейки** `async-flaky` | `13` fake timers і тестування промісів/стрімів<br>`14` причини флейків<br>`15` карантин і детермінізм | Лагодить флейкі тест за причиною | M–S | Dbg 6 · Rec 2 · Oth 4 · Q&A 14 · Cards 20 | 42 / 6 на розділ | ✓ |
| **Тести в команді** `team` | `16` міфи coverage і CI-стратегія · тестові дані<br>`17` навантажувальні тести (k6) · chaos basics і робота з QA | Задає стандарти тестування як lead | S–L | Rec 2 · Oth 2 · Q&A 24 · Cards 35 | 40 / 6 на розділ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-testing/strategy` | J–M | `fs-fetest/test-design`, `fs-node/node-testing` |
| `fs-testing/unit-doubles` | J–M | `fs-testing/strategy`, `fs-fetest/unit-testing` |
| `fs-testing/tdd` | M | `fs-testing/unit-doubles` |
| `fs-testing/integration-contract` | M–S | `fs-testing/unit-doubles`, `fs-sql/dml` |
| `fs-testing/e2e-backend` | M | `fs-testing/integration-contract`, `fs-fetest/e2e` |
| `fs-testing/async-flaky` | M–S | `fs-testing/unit-doubles` |
| `fs-testing/team` | S–L | `fs-testing/async-flaky` |

#### `fs-git` — Git для професіоналів

- **Role:** core · **Topics:** 10 · **Words:** A ≈ 36k (theory 12k) · B ≈ 19k
- **Runners:** Git-симулятор у worker (isomorphic-git на in-memory fs або власна DAG-модель)
- **Reuse / owners:** основи — fs-tools/git-basics
- **Exercise mix:** Rec 10 · Pred-d 15 · Oth 30 · QZ 182 · Q&A 70 · Cards 120
- **Generated concepts:** `internals`: стан репо після згенерованої послідовності команд; `history`: стан гілок після rebase/merge; `recovery`: що лишилось після reset/restore

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Модель Git зсередини** `internals` | `01` blob/tree/commit · refs і HEAD<br>`02` index · DAG | Пояснює команду через зміну обʼєктів | J–M | Pred-d 4 · Oth 4 · Q&A 12 · Cards 25 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **Історія** `history` | `03` merge vs rebase і fast-forward · interactive rebase (squash/fixup/reword)<br>`04` cherry-pick · розвʼязання конфліктів | Тримає історію чистою | M | Rec 3 · Pred-d 5 · Oth 8 · Q&A 14 · Cards 25 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **Порятунок** `recovery` | `05` reset soft/mixed/hard і revert · reflog і restore<br>`06` stash і втрачені коміти · видалення секрету з історії (filter-repo) + ротація | Відновлює будь-яку «втрачену» роботу | M–S | Rec 3 · Pred-d 4 · Oth 8 · Q&A 14 · Cards 25 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **Розслідування** `investigation` | `07` bisect · blame і log -S/-G<br>`08` worktrees · hooks | Знаходить коміт-винуватця за хвилини | M | Rec 2 · Pred-d 2 · Oth 6 · Q&A 10 · Cards 20 | 40 / 6 на розділ | ✓ |
| **Git у команді** `team-git` | `09` trunk-based, GitHub flow, GitFlow · PR-процес і conventional commits<br>`10` монорепо (sparse checkout, CODEOWNERS) · підписані коміти і теги релізів | Обирає стратегію гілок для команди | M–L | Rec 2 · Oth 4 · Q&A 20 · Cards 25 | 40 / 6 на розділ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-git/internals` | J–M | `fs-tools/git-basics` |
| `fs-git/history` | M | `fs-git/internals` |
| `fs-git/recovery` | M–S | `fs-git/history` |
| `fs-git/investigation` | M | `fs-git/history` |
| `fs-git/team-git` | M–L | `fs-git/recovery`, `fs-git/investigation` |

### Part VII. Системи

#### `fs-netos` — Мережі й операційні системи

- **Role:** core · **Topics:** 18 · **Words:** A ≈ 94k (theory 48k) · B ≈ 25k
- **Runners:** JS worker (сирі HTTP-парсери, симулятори таймінгів, CIDR-калькулятор); решта — quiz
- **Reuse / owners:** основи — fs-cs/net-basics, fs-cs/os-basics (версія 1 «що відбувається при відкритті сайту»); HTTP-кеш — fs-browser
- **Exercise mix:** Node 4 · Rec 15 · Pred-d 10 · Oth 10 · QZ 342 · Q&A 156 · Cards 247
- **Generated concepts:** `net-model`: CIDR і підмережі; `tcp-udp`: RTT і час передачі для згенерованих параметрів

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Модель мережі** `net-model` | `01` рівні OSI/TCP-IP · IP і маршрутизація<br>`02` NAT і порти · підмережі/CIDR | Пояснює шлях пакета | J–M | Rec 2 · Oth 2 · Q&A 16 · Cards 30 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **TCP і UDP** `tcp-udp` | `03` handshake і flow/congestion control · slow start і head-of-line blocking<br>`04` TIME_WAIT, keep-alive, Nagle · UDP і QUIC | Пояснює затримки через TCP | M–S | Rec 3 · Pred-d 3 · Oth 2 · Q&A 22 · Cards 35 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **DNS і CDN глибоко** `dns-cdn` | `05` ланцюг резолву і записи · TTL і кешування<br>`06` anycast і DNS-балансування · DoH («що таке DNS» — reported Arc.dev) | Діагностує DNS-проблему | J–M | Rec 2 · Pred-d 2 · Oth 2 · Q&A 16 · Cards 25 | 40 / 6 на розділ | ✓ |
| **TLS і HTTPS** `tls` | `07` TLS 1.3 handshake · сертифікати й ланцюги<br>`08` SNI, ALPN · mTLS і HSTS | Пояснює, що захищає TLS і що ні | M–S | Rec 2 · Pred-d 2 · Q&A 18 · Cards 25 | 40 / 6 на розділ | ✓ |
| **HTTP глибоко** `http-deep` | `09` HTTP/1.1 vs 2 vs 3 · мультиплексування і HPACK/QPACK<br>`10` forward/reverse proxy · L4/L7 балансувальники<br>`11` WebSocket upgrade · «що відбувається, коли вводиш URL» (глибока версія<br>`12` кеш — fs-browser) | Розповідає повний шлях запиту за 5 хв | M–S | Node 4 · Rec 2 · Pred-d 3 · Q&A 22 · Cards 32 | 74 / 11 на розділ | ✓ |
| **Процеси і потоки** `processes-os` | `13` process vs thread і планувальник · context switch<br>`14` concurrency vs parallelism · IPC і сигнали | Пояснює конкурентність на рівні ОС | J–M | Rec 2 · Oth 2 · Q&A 20 · Cards 30 | 40 / 6 на розділ | ✓ |
| **Памʼять і файли** `memory-files` | `15` віртуальна памʼять і paging · stack vs heap і mmap<br>`16` file descriptors · page cache і fsync | Розуміє, звідки береться I/O-латентність | M–S | Rec 1 · Oth 1 · Q&A 18 · Cards 30 | 40 / 6 на розділ | Oth: сусід з `net-model` |
| **Моделі I/O і синхронізація** `io-models` | `17` blocking/non-blocking · select/poll/epoll/kqueue/io_uring<br>`18` reactor vs proactor і чому Node масштабується · mutex, semaphore, deadlock, race condition | Повʼязує epoll з event loop Node | S | Rec 1 · Oth 1 · Q&A 24 · Cards 40 | 40 / 6 на розділ | Oth: сусід з `net-model` |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-netos/net-model` | J–M | `fs-cs/net-basics` |
| `fs-netos/tcp-udp` | M–S | `fs-netos/net-model` |
| `fs-netos/dns-cdn` | J–M | `fs-netos/net-model`, `fs-cs/net-basics` |
| `fs-netos/tls` | M–S | `fs-netos/tcp-udp` |
| `fs-netos/http-deep` | M–S | `fs-netos/tls`, `fs-netos/dns-cdn`, `fs-browser/browser-network` |
| `fs-netos/processes-os` | J–M | `fs-cs/os-basics`, `fs-node/processes` |
| `fs-netos/memory-files` | M–S | `fs-netos/processes-os` |
| `fs-netos/io-models` | S | `fs-netos/memory-files`, `fs-node/event-loop` |

#### `fs-devops` — DevOps і хмара

- **Role:** core · **Topics:** 21 · **Words:** A ≈ 116k (theory 56k) · B ≈ 33k
- **Runners:** JS worker: config-лінтери (Dockerfile, GitHub Actions YAML, K8s manifests, Terraform/HCL-підмножина, IAM JSON); shell — симульований shell з віртуальною fs (§10)
- **Reuse / owners:** основи shell — fs-tools/shell; nextjs-zero-to-pro/deploy-ops — Next-специфіка
- **Exercise mix:** Dbg 6 · Rec 15 · Oth 30 · QZ 396 · Q&A 194 · Cards 294
- **Generated concepts:** —

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Linux для сервера** `linux` | `01` права і користувачі глибше · процеси і systemd<br>`02` мережеві утиліти (curl, dig, ss) · bash-скрипти для ops і jq (основи — fs-tools/shell) | Почувається вдома в терміналі сервера | J–M | Rec 2 · Oth 6 · Q&A 18 · Cards 34 | 40 / 6 на розділ | ✓ |
| **Docker** `docker` | `03` images і layers · Dockerfile best practices і multi-stage<br>`04` кеш збірки і малі образи · non-root і безпека образу<br>`05` compose, мережі, volumes | Пише малий, безпечний, швидкий образ | J–M | Dbg 2 · Rec 2 · Oth 6 · Q&A 26 · Cards 35 | 54 / 8 на розділ | ✓ |
| **CI/CD** `cicd` | `06` пайплайни (GitHub Actions): кеш, matrix, артефакти · секрети в CI<br>`07` trunk-based + CD · blue-green, canary, rolling<br>`08` feature flags і rollback | Будує пайплайн від PR до продакшну | M–S | Dbg 2 · Rec 3 · Oth 5 · Q&A 26 · Cards 35 | 54 / 8 на розділ | ✓ |
| **Kubernetes основи** `k8s` | `09` pods, deployments, services · ingress, configmaps, secrets<br>`10` probes, requests/limits · HPA і rolling updates<br>`11` коли K8s не потрібен | Читає й лагодить маніфести | M–S | Dbg 1 · Rec 2 · Oth 5 · Q&A 28 · Cards 40 | 54 / 8 на розділ | Dbg: сусід з `docker` |
| **Infrastructure as Code** `iac` | `12` Terraform: state, plan/apply · modules і drift<br>`13` середовища · GitOps | Описує інфраструктуру кодом і рев'юїть plan | M–S | Rec 2 · Oth 4 · Q&A 16 · Cards 25 | 40 / 6 на розділ | ✓ |
| **AWS core** `aws` | `14` IAM · EC2 і VPC<br>`15` S3 і RDS · Lambda і serverless trade-offs<br>`16` SQS/SNS · CloudFront і Route 53<br>`17` вартість | Збирає типову архітектуру з сервісів AWS | M–S | Dbg 1 · Rec 2 · Oth 2 · Q&A 40 · Cards 60 | 74 / 11 на розділ | Dbg: сусід з `docker` |
| **Платформи і середовища** `platforms` | `18` Vercel, Cloudflare, Fly, Render · середовища і preview deploys<br>`19` секрети і конфіг · контроль витрат | Обирає платформу під продукт і бюджет | J–M | Rec 2 · Oth 2 · Q&A 20 · Cards 30 | 40 / 6 на розділ | ✓ |
| **Release engineering** `release` | `20` версіонування · міграції під час деплою і zero-downtime<br>`21` DR (RPO/RTO) · runbooks | Випускає без даунтайму і має план B | S–L | Q&A 20 · Cards 35 | 40 / 6 на розділ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-devops/linux` | J–M | `fs-tools/shell`, `fs-netos/processes-os` |
| `fs-devops/docker` | J–M | `fs-devops/linux` |
| `fs-devops/cicd` | M–S | `fs-devops/docker`, `fs-git/team-git` |
| `fs-devops/k8s` | M–S | `fs-devops/docker` |
| `fs-devops/iac` | M–S | `fs-devops/cicd` |
| `fs-devops/aws` | M–S | `fs-devops/iac`, `fs-netos/net-model` |
| `fs-devops/platforms` | J–M | `fs-devops/cicd`, `nextjs-zero-to-pro/deploy-ops` |
| `fs-devops/release` | S–L | `fs-devops/cicd`, `fs-sql/migrations-orm` |

#### `fs-obs` — Спостережуваність і надійність

- **Role:** core · **Topics:** 15 · **Words:** A ≈ 72k (theory 35k) · B ≈ 18k
- **Runners:** JS worker / PGlite над засіяною телеметрією (логи, метрики, спани як таблиці); SLO-калькулятор
- **Reuse / owners:** —
- **Exercise mix:** Dbg 8 · Rec 12 · Oth 10 · QZ 231 · Q&A 120 · Cards 150
- **Generated concepts:** `alerting`: перцентилі і burn rate на згенерованих рядах; `slo`: SLO і error budget

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Три сигнали** `signals` | `01` структуровані логи і кореляція<br>`02` метрики: типи і кардинальність<br>`03` трейси: spans і propagation | Інструментує сервіс трьома сигналами | J–M | Rec 3 · Oth 2 · Q&A 20 · Cards 30 | 42 / 6 на розділ | ✓ |
| **OpenTelemetry на практиці** `otel` | `04` SDK і auto-instrumentation у Node/Next.js<br>`05` collector і exporters<br>`06` sampling | Підключає OTel без вендор-локу | M | Dbg 1 · Oth 2 · Q&A 16 · Cards 20 | 42 / 6 на розділ | Dbg: сусід з `incidents` |
| **Метрики, дашборди, алерти** `alerting` | `07` RED/USE/golden signals · перцентилі<br>`08` алерти за симптомами і burn rate · alert fatigue | Будує алерти, що будять лише по ділу | M–S | Rec 3 · Oth 3 · Q&A 20 · Cards 25 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **SLI/SLO/SLA і error budgets** `slo` | `09` вибір SLI<br>`10` математика SLO<br>`11` політики error budget | Домовляється про надійність з бізнесом | S–L | Rec 2 · Oth 3 · Q&A 16 · Cards 20 | 33 / 6 на розділ (3 з генератором) | ✓ |
| **Інциденти** `incidents` | `12` on-call і incident command · комунікація<br>`13` дебаг продакшну за логами і трейсами · blameless postmortem і game days | Веде інцидент і пише постмортем | S–L | Dbg 7 · Rec 2 · Q&A 24 · Cards 25 | 40 / 6 на розділ | ✓ |
| **Продуктивність і ємність** `capacity` | `14` профілювання в проді · навантажувальні тести<br>`15` capacity planning · cost observability | Прогнозує, коли система впреться в стелю | S | Rec 2 · Q&A 24 · Cards 30 | 40 / 6 на розділ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-obs/signals` | J–M | `fs-node/errors`, `fs-node/production` |
| `fs-obs/otel` | M | `fs-obs/signals` |
| `fs-obs/alerting` | M–S | `fs-obs/otel` |
| `fs-obs/slo` | S–L | `fs-obs/alerting` |
| `fs-obs/incidents` | S–L | `fs-obs/slo` |
| `fs-obs/capacity` | S | `fs-obs/incidents`, `fs-node/perf-memory` |

#### `fs-dist` — Розподілені системи

- **Role:** core (власник: ретраї з jitter, circuit breaker, консенсус, fencing) · **Topics:** 17 · **Words:** A ≈ 96k (theory 48k) · B ≈ 23k
- **Runners:** JS worker (детерміновані симуляції з fake clock)
- **Reuse / owners:** —
- **Exercise mix:** JS-d 12 · Rec 15 · QZ 316 · Q&A 158 · Cards 200
- **Generated concepts:** `time-order`: vector clocks: «що сталося раніше»; `replication`: кворуми R + W > N; `partitioning`: куди потрапить ключ / що переїде при додаванні вузла

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Чому розподілене — це важко** `fundamentals` | `01` fallacies of distributed computing · часткові збої<br>`02` числа латентності · моделі збоїв | Мислить про збій як про норму | M | Rec 2 · Q&A 16 · Cards 25 | 40 / 6 на розділ | ✓ |
| **Час і порядок** `time-order` | `03` фізичні годинники і NTP-дрейф · Lamport<br>`04` vector clocks і HLC · гарантії порядку | Пояснює, чому не можна вірити таймстемпам | S | JS-d 2 · Rec 2 · Q&A 16 · Cards 20 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **Реплікація** `replication` | `05` leader-follower · multi-leader<br>`06` leaderless: кворуми, read repair, hinted handoff · аномалії replication lag | Передбачає аномалії реплікації | S | JS-d 1 · Rec 2 · Q&A 20 · Cards 25 | 34 / 6 на розділ (2 з генератором) | JS-d: сусід з `time-order` |
| **Консистентність, CAP, PACELC** `consistency` | `07` linearizability і sequential · causal, eventual, read-your-writes<br>`08` CAP і PACELC · CRDT — вступ | Обирає модель консистентності під фічу | S–L | Rec 2 · Q&A 22 · Cards 25 | 40 / 6 на розділ | ✓ |
| **Партиціонування** `partitioning` | `09` range vs hash · consistent hashing і rebalancing<br>`10` hot spots · вторинні індекси | Шардує без гарячих точок | S | JS-d 2 · Rec 2 · Q&A 14 · Cards 20 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **Консенсус** `consensus` | `11` Raft: вибори лідера, реплікація логу · ідея Paxos<br>`12` ZooKeeper/etcd · leases і fencing tokens | Пояснює Raft на дошці | S–L | JS-d 2 · Rec 1 · Q&A 18 · Cards 25 | 40 / 6 на розділ | ✓ |
| **Розподілені транзакції** `transactions-dist` | `13` 2PC і його проблеми · саги: оркестрація і хореографія (outbox — fs-queues/reliable)<br>`14` ідемпотентність між сервісами · exactly-once semantics | Проєктує сагу з компенсаціями | S–L | JS-d 1 · Rec 2 · Q&A 18 · Cards 25 | 40 / 6 на розділ | JS-d: сусід з `time-order` |
| **Стійкість (власник)** `resilience` | `15` таймаути і ретраї з jitter · circuit breakers і bulkheads<br>`16` load shedding і backpressure · розподілений rate limiting<br>`17` каскадні збої | Зупиняє каскадний збій | S | JS-d 4 · Rec 2 · Q&A 34 · Cards 35 | 54 / 8 на розділ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-dist/fundamentals` | M | `fs-netos/tcp-udp` |
| `fs-dist/time-order` | S | `fs-dist/fundamentals` |
| `fs-dist/replication` | S | `fs-dist/time-order`, `fs-sql/operations` |
| `fs-dist/consistency` | S–L | `fs-dist/replication` |
| `fs-dist/partitioning` | S | `fs-dist/replication` |
| `fs-dist/consensus` | S–L | `fs-dist/consistency`, `fs-nosql/redis-internals` |
| `fs-dist/transactions-dist` | S–L | `fs-dist/consensus`, `fs-queues/reliable` |
| `fs-dist/resilience` | S | `fs-dist/fundamentals`, `fs-api/reliability` |

#### `fs-sec` — Кібербезпека для інженерів

- **Role:** core (власник: OWASP Top 10:2025, API Top 10:2023, secure code review, threat modeling, лаби, криптографія, supply chain) · **Topics:** 26 · **Words:** A ≈ 154k (theory 58k) · B ≈ 85k
- **Runners:** iframe + mock-backend у worker/Service Worker (HTTP lab simulator, Burp-подібний редактор запитів); PGlite за mock-сервером для SQLi; рев'ю — вибір рядків + фікс під тести; threat models — [!diagram] + рубрика
- **Reuse / owners:** теорія XSS/CSP/CORS/cookies — fs-browser/web-security; сесії, JWT, OAuth, CSRF, відновлення — fs-auth; тут атакувальний ракурс, лаби, рев'ю, threat models
- **Exercise mix:** Rec 20 · SecRev 73 · TM 24 · Lab 44 · QZ 487 · Q&A 206 · Cards 277
- **Generated concepts:** `identity-crypto`: визнач: hash / encryption / encoding за зразком

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Мислення атакувальника і правила** `mindset` | `01` юридичні й етичні правила (лише наші лаби) · attack surface і kill chain<br>`02` фази пентесту і recon · мапа OWASP Top 10:2025, API Top 10:2023, ASVS 5.0, cheat sheets (версії завжди вказані) | Знає правила гри і стандарти | J–M | Rec 4 · Q&A 20 · Cards 30 | 40 / 6 на розділ | ✓ |
| **Ін'єкції** `injection` | `03` SQLi (зокрема blind, raw у ORM) · NoSQL injection<br>`04` command injection · template injection | Знаходить і закриває ін'єкцію | M–S | SecRev 8 · Lab 5 · Q&A 20 · Cards 25 | 40 / 6 на розділ | ✓ |
| **Клієнтські атаки: експлуатація** `client-attacks` | `05` XSS: reflected/stored/DOM і обхід CSP · CSRF-експлуатація (захист — fs-auth/csrf)<br>`06` clickjacking і postMessage · CORS-помилки і open redirect | Ламає й лагодить фронтенд-вектори в лабі | M–S | SecRev 8 · Lab 8 · Q&A 14 · Cards 15 | 40 / 6 на розділ | ✓ |
| **Контроль доступу і бізнес-логіка** `access-logic` | `07` BOLA/IDOR і BFLA · mass assignment<br>`08` гонки (double-spend) · бізнес-логічні діри<br>`09` fail-open (Mishandling of Exceptional Conditions) | Ламає й лагодить авторизацію в лабі | M–S | Rec 3 · SecRev 13 · TM 2 · Lab 8 · Q&A 24 · Cards 25 | 54 / 8 на розділ | ✓ |
| **Серверні атаки** `server-attacks` | `10` SSRF (метадані хмари) · path traversal і атаки через upload<br>`11` десеріалізація і XXE · request smuggling і cache poisoning (концепт)<br>`12` prototype pollution і ReDoS | Розпізнає серверні вектори в коді | S | SecRev 10 · Lab 7 · Q&A 24 · Cards 30 | 54 / 8 на розділ | ✓ |
| **Атаки на identity і криптографія** `identity-crypto` | `13` атаки на сесії й JWT (теорія — fs-auth) · атаки на OAuth/OIDC: redirect URI, state, mix-up<br>`14` account takeover і зловживання відновленням · hash vs encryption vs encoding<br>`15` симетрична/асиметрична, підписи, KDF, випадковість · key management і «не пиши свою криптографію» | Перевіряє auth і криптографію в рев'ю й лабі | M–S | Rec 3 · SecRev 16 · Lab 10 · Q&A 20 · Cards 32 | 51 / 9 на розділ (3 з генератором) | ✓ |
| **Моделювання загроз** `threat-modeling` | `16` STRIDE · DFD і trust boundaries<br>`17` ранжування ризиків (DREAD/CVSS) · спершу питання до product owner<br>`18` attack trees · identity-флоу: логін, OAuth, відновлення, service-to-service | Веде threat modeling на діаграмі | S–L | Rec 4 · TM 20 · Q&A 14 · Cards 20 | 60 / 9 на розділ | ✓ |
| **Secure SDLC і ланцюг постачання** `sdlc` | `19` метод secure code review (200-рядкові Node/TS-сніпети) · SAST/DAST/SCA і SBOM<br>`20` provenance (SLSA), lockfiles, typosquatting · витік креденшалів — перші кроки<br>`21` security review AI-згенерованого коду | Проводить secure review за 30 хв | M–L | Rec 3 · SecRev 12 · Lab 2 · Q&A 24 · Cards 30 | 54 / 8 на розділ | ✓ |
| **Хмара та інфраструктура** `cloud-sec` | `22` IAM least privilege і рев'ю політик · відкриті бакети<br>`23` VPC і zero trust · безпека контейнерів і IaC-помилки<br>`24` логування, детекція, incident response | Рев'юїть IAM-політику й IaC | S–L | Rec 3 · SecRev 6 · TM 2 · Lab 4 · Q&A 28 · Cards 40 | 54 / 8 на розділ | ✓ |
| **Приватність і compliance** `privacy` | `25` GDPR · SOC 2<br>`26` PCI DSS · HIPAA basics — що це означає для коду й архітектури | Перекладає compliance у технічні вимоги | S–L | Q&A 18 · Cards 30 | 40 / 6 на розділ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-sec/mindset` | J–M | `fs-auth/server-hardening`, `fs-browser/web-security` |
| `fs-sec/injection` | M–S | `fs-sec/mindset`, `fs-sql/basics` |
| `fs-sec/client-attacks` | M–S | `fs-sec/mindset`, `fs-browser/web-security`, `fs-auth/csrf` |
| `fs-sec/access-logic` | M–S | `fs-auth/authz` |
| `fs-sec/server-attacks` | S | `fs-sec/injection`, `fs-node/safe-runtime` |
| `fs-sec/identity-crypto` | M–S | `fs-auth/sessions-tokens`, `fs-auth/oauth-oidc`, `fs-auth/mfa` |
| `fs-sec/threat-modeling` | S–L | `fs-sec/access-logic`, `fs-sec/identity-crypto` |
| `fs-sec/sdlc` | M–L | `fs-sec/injection`, `fs-sec/server-attacks` |
| `fs-sec/cloud-sec` | S–L | `fs-devops/aws`, `fs-devops/iac` |
| `fs-sec/privacy` | S–L | `fs-sec/cloud-sec` |

#### `fs-sd` — System Design: бекенд і фронтенд

- **Role:** core · **Topics:** 68 · **Words:** A ≈ 246k (theory 200k) · B ≈ 64k
- **Runners:** без рантайму: [!diagram] + рубрика самооцінки по рівнях; estimation — числова відповідь з допуском
- **Reuse / owners:** —
- **Exercise mix:** Rec 40 · SD-B 44 · SD-F 16 · Oth 30 · QZ 765 · Q&A 150 · Cards 250
- **Generated concepts:** `method`: back-of-envelope оцінки; `be-classic`: оцінки навантаження для дизайну; `be-product`: оцінки навантаження для дизайну; `be-infra`: оцінки навантаження для дизайну; `frontend-sd`: бюджети продуктивності (KB, ms)

| Розділ = навичка | Теми (id · назва) | Мета | Рівні | Вправи | QZ-пул / тест теми | Sibling |
|---|---|---|---|---|---|---|
| **Метод system design** `method` | `01` 7 кроків «Методу Loo» у масштабі системи; вимоги функціональні й нефункціональні · оцінки: QPS, сховище, трафік; числа, які треба знати<br>`02` API і модель даних; HLD; deep dives · bottlenecks, trade-offs, еволюція; як оцінюють mid/senior/staff | Веде 45-хв дизайн за структурою | M–L | Rec 6 · Oth 30 · Q&A 20 · Cards 50 | 34 / 6 на розділ (2 з генератором) | ✓ |
| **Будівельні блоки** `building-blocks` | `03` load balancer і reverse proxy · CDN і кеші (теорія кешу — fs-queues, fs-browser)<br>`04` черги і object storage · БД, реплікація, шардинг, consistent hashing (теорія — fs-dist)<br>`05` rate limiter і генерація ID · пошук, сповіщення, observability | Підбирає блок під вузьке місце | M–S | Rec 20 · Q&A 40 · Cards 80 | 60 / 9 на розділ | ✓ |
| **Бекенд-дизайни I: класика** `be-classic` | `06` Скорочувач URL<br>`07` Розподілений rate limiter<br>`08` Розподілений кеш / key-value store<br>`09` Генератор унікальних ID<br>`10` Вебкраулер<br>`11` Typeahead / автодоповнення<br>`12` Система сповіщень (push/email/SMS)<br>`13` Стрічка новин (fan-out on write vs read)<br>`14` Чат 1:1 і групи<br>`15` Pastebin<br>`16` Лідерборд у реальному часі<br>`17` Система метрик і моніторингу<br>`18` Розподілений планувальник задач<br>`19` API gateway<br>`20` Повнотекстовий пошук по сайту | Розвʼязує SD-задачі з числами і trade-offs | M–S | Rec 2 · SD-B 15 · Q&A 15 · Cards 30 | 165 / 30 на розділ (15 з генератором) | ✓ |
| **Бекенд-дизайни II: продуктові системи** `be-product` | `21` Виклик таксі (ride-hailing)<br>`22` Диспетчеризація доставки їжі<br>`23` Бронювання готелів (без overbooking)<br>`24` Квитки на події (flash sale, блокування місць)<br>`25` Checkout e-commerce<br>`26` Платіжна система (ledger, double-entry, ідемпотентність)<br>`27` Цифровий гаманець / P2P-перекази<br>`28` Відеостримінг (VOD)<br>`29` Live-стримінг<br>`30` Синхронізація файлів (Dropbox-подібна)<br>`31` Фотосервіс (Instagram-подібний)<br>`32` Колаборативне редагування (Docs-подібне)<br>`33` Пошук поруч (proximity)<br>`34` Соціальний граф, «друзі друзів»<br>`35` Поштовий сервіс (inbox, пошук, вкладення) | Розвʼязує SD-задачі з числами і trade-offs | S–L | Rec 2 · SD-B 15 · Q&A 15 · Cards 30 | 165 / 30 на розділ (15 з генератором) | ✓ |
| **Бекенд-дизайни III: інфраструктура і дані** `be-infra` | `36` Multi-tenant SaaS-платформа<br>`37` Сервіс feature flags<br>`38` Платформа доставки вебхуків<br>`39` Розподілена черга повідомлень (Kafka-подібна)<br>`40` Object storage (S3-подібне)<br>`41` CDN<br>`42` Пайплайн логів і трейсів<br>`43` Агрегація кліків по рекламі (stream processing)<br>`44` Пайплайн рекомендацій для стрічки<br>`45` LLM-чат / RAG-бекенд (місток у fs-ai)<br>`46` Білінг і usage metering<br>`47` Сервіс ідентичності і SSO<br>`48` Біржа: матчинг ордерів<br>`49` Trending / top-K heavy hitters | Розвʼязує SD-задачі з числами і trade-offs | S–L | Rec 2 · SD-B 14 · Q&A 15 · Cards 30 | 154 / 28 на розділ (14 з генератором) | ✓ |
| **Фронтенд system design** `frontend-sd` | `50` метод: вимоги → компоненти → модель даних і стан → API/протокол → продуктивність, a11y, i18n, безпека, offline<br>`51` Стрічка новин (infinite scroll, віртуалізація)<br>`52` Віджет автодоповнення<br>`53` Дизайн-система / бібліотека компонентів<br>`54` Offline-first застосунок нотаток (PWA, синхронізація)<br>`55` Чат-інтерфейс (realtime, optimistic UI)<br>`56` Редактор зображень<br>`57` Колаборативна дошка (canvas/whiteboard)<br>`58` Analytics SDK<br>`59` Відеоплеєр (adaptive streaming, a11y)<br>`60` Таблиця даних на 100k рядків<br>`61` Rich text editor<br>`62` Сторінка товару + checkout (SEO, CWV)<br>`63` Дашборд з realtime-графіками<br>`64` Shell для micro-frontends<br>`65` Конструктор форм / рушій wizard-ів<br>`66` Spreadsheet (формули, залежності, віртуалізація) | Проводить фронтенд SD-інтервʼю | M–L | Rec 2 · SD-F 16 · Q&A 15 · Cards 30 | 187 / 34 на розділ (17 з генератором) | ✓ |
| **Інтерв'ю-режим** `sd-interview` | `67` таймовані 45/60 хв і рубрика за рівнем<br>`68` «що зміниш при 100× навантаженні»; англійська для дошки (fs-en-int) | Проходить SD-раунд на цільовому рівні | S–L | Rec 6 · Q&A 30 | no QZ | ✓ |

Навичка → передумови (глобальні ключі):

| Навичка | Рівні | Передумови |
|---|---|---|
| `fs-sd/method` | M–L | `fs-api/rest`, `fs-sql/modeling`, `fs-queues/cache-strategies`, `fs-algo/method` |
| `fs-sd/building-blocks` | M–S | `fs-sd/method`, `fs-dist/partitioning`, `fs-queues/cache-scale` |
| `fs-sd/be-classic` | M–S | `fs-sd/building-blocks` |
| `fs-sd/be-product` | S–L | `fs-sd/be-classic`, `fs-integr/payments` |
| `fs-sd/be-infra` | S–L | `fs-sd/be-product`, `fs-obs/signals` |
| `fs-sd/frontend-sd` | M–L | `fs-sd/building-blocks`, `fs-react/react-patterns`, `fs-state/server-state`, `fs-perf/perf-architecture` |
| `fs-sd/sd-interview` | S–L | `fs-sd/be-infra`, `fs-sd/frontend-sd`, `fs-en-int` |

Every design topic = requirements + numbers → API → data model → HLD `[!diagram]` → 2–3 deep dives → bottlenecks → trade-offs → «100×» → security and observability notes → rubric M/S/L → follow-ups → English for the board. Gate = rubric (open answer, §6a) + 2-concept quiz.

## 4. `fs-algo` — pattern map, problems and siblings

Order follows the §5.0 prerequisite graph. Each pattern is one topic: lesson (7 steps, visual trace) → pattern card → problems E→M→H (hard = combined) → 12 «pick the pattern» + 4 «name the waste» drills → 1 transfer task → pattern boss (timed L4, 3 pool problems re-seeded). Each block ends with a mixed set (2E/3M/1H, 8 drills) = block boss. Section `method` adds 60 «constraints → complexity» drills (generated). **Sibling** = another problem of the same pattern and difficulty for the «mastered» check: ✓ where the difficulty has ≥ 2 problems.

| Topic | Pattern | E | M | H | Σ | Rec | Trf | Sibling E/M/H | Canonical problems (own framing) | Hard = combined | Kata |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `fs-algo-04` | P01 Масиви й рядки: обхід і зміна на місці | 8 | 8 | 2 | 18 | 16 | 1 | ✓/✓/✓ | розверни на місці; злий два відсортовані масиви; стисни рядок (RLE) | поворот матриці на місці |  |
| `fs-algo-05` | P02 Хешування і підрахунок | 6 | 10 | 2 | 18 | 16 | 1 | ✓/✓/✓ | пара з сумою [Kata 07]; найдовша послідовність сусідніх чисел; ізоморфні рядки | хешування + сортування ключів | Two Sum |
| `fs-algo-06` | P03 Два вказівники | 5 | 10 | 3 | 18 | 16 | 1 | ✓/✓/✓ | паліндром з одним пропуском; трійки з нульовою сумою; контейнер з найбільшою водою | сортування + два вказівники для k-sum |  |
| `fs-algo-07` | P04 Ковзне вікно | 4 | 10 | 4 | 18 | 16 | 1 | ✓/✓/✓ | найдовший підрядок без повторів [Kata 07]; мінімальне вікно з усіма символами; максимум середнього у вікні k | вікно + частоти; at most k → exactly k | Longest substring |
| `fs-algo-08` | **Мікс-сет / бос блоку B1** | 2 | 3 | 1 | 6 | 8 | — | сусіди — задачі патернів блоку | нові, патерн не оголошено | 1 hard = 2 патерни | |
| `fs-algo-09` | P05 Префіксні суми і difference array | 4 | 9 | 3 | 16 | 16 | 1 | ✓/✓/✓ | кількість підмасивів із сумою k; сума прямокутника (2D prefix); бронювання місць (difference array) | prefix + hash map; prefix mod k |  |
| `fs-algo-10` | P06 Сортування і sweep line | 4 | 9 | 3 | 16 | 16 | 1 | ✓/✓/✓ | мінімум кімнат для зустрічей; найбільше число з цифр; контур будівель | sweep + heap |  |
| `fs-algo-11` | P07 Бінарний пошук за індексом | 4 | 8 | 2 | 14 | 16 | 1 | ✓/✓/✓ | перше входження [Kata 07]; пошук у повернутому масиві; мінімум у повернутому масиві | 2D-матриця, медіана двох масивів | Binary search first |
| `fs-algo-12` | P08 Бінарний пошук по відповіді | 2 | 8 | 4 | 14 | 16 | 1 | ✓/✓/✓ | мінімальна вантажність за D днів; швидкість читання за H годин; поділ на k частин з мінімальною макс-сумою | binary search + greedy check |  |
| `fs-algo-13` | **Мікс-сет / бос блоку B2** | 2 | 3 | 1 | 6 | 8 | — | сусіди — задачі патернів блоку | нові, патерн не оголошено | 1 hard = 2 патерни | |
| `fs-algo-14` | P09 Стек і монотонний стек | 4 | 10 | 4 | 18 | 16 | 1 | ✓/✓/✓ | правильні дужки [Kata 07]; наступна тепліша температура; найбільший прямокутник у гістограмі | монотонний стек + внесок елемента | Valid brackets |
| `fs-algo-15` | P10 Черга, дек, монотонний дек | 3 | 6 | 3 | 12 | 16 | 1 | ✓/✓/✓ | максимум у ковзному вікні; кругова черга; найкоротший підмасив із сумою ≥ K | prefix + monotonic deque |  |
| `fs-algo-16` | P11 Звʼязані списки, fast/slow | 5 | 9 | 2 | 16 | 16 | 1 | ✓/✓/✓ | розверни список; цикл у списку (Floyd); розверни групами по k | fast/slow + reverse |  |
| `fs-algo-17` | P12 Симуляція і парсинг | 3 | 8 | 3 | 14 | 16 | 1 | ✓/✓/✓ | спіральна матриця [Kata 07]; калькулятор з дужками (стековий, не JS Project 02); гра «Життя» на місці | state machine + stack | Spiral matrix |
| `fs-algo-18` | **Мікс-сет / бос блоку B3** | 2 | 3 | 1 | 6 | 8 | — | сусіди — задачі патернів блоку | нові, патерн не оголошено | 1 hard = 2 патерни | |
| `fs-algo-19` | P13 Рекурсія і divide & conquer | 5 | 7 | 2 | 14 | 16 | 1 | ✓/✓/✓ | швидке піднесення до степеня; merge sort + інверсії; quickselect | D&C + підрахунок при злитті |  |
| `fs-algo-20` | P14 Backtracking | 3 | 10 | 4 | 17 | 16 | 1 | ✓/✓/✓ | усі підмножини; перестановки з повторами; судоку / n ферзів | pruning + bitmask |  |
| `fs-algo-21` | P15 Дерева: DFS/BFS | 6 | 11 | 3 | 20 | 16 | 1 | ✓/✓/✓ | обхід по рівнях [Kata 07]; діаметр дерева; серіалізація і десеріалізація | DFS, що повертає кілька значень | Tree BFS/DFS |
| `fs-algo-22` | P16 BST і побудова дерев | 3 | 7 | 2 | 12 | 16 | 1 | ✓/✓/✓ | перевірка BST; k-й найменший у BST; LCA у BST | побудова дерева з обходів |  |
| `fs-algo-23` | **Мікс-сет / бос блоку B4** | 2 | 3 | 1 | 6 | 8 | — | сусіди — задачі патернів блоку | нові, патерн не оголошено | 1 hard = 2 патерни | |
| `fs-algo-24` | P17 Купи і top-K | 3 | 9 | 3 | 15 | 16 | 1 | ✓/✓/✓ | top-k найчастіших [Kata 07]; медіана потоку; злиття k відсортованих списків | heap + lazy deletion | Top-k frequent |
| `fs-algo-25` | P18 Інтервали | 3 | 8 | 2 | 13 | 16 | 1 | ✓/✓/✓ | злиття інтервалів [Kata 07]; вставка інтервалу; спільний вільний час команди | інтервали + heap | Merge intervals |
| `fs-algo-26` | P19 Жадібні алгоритми | 4 | 10 | 3 | 17 | 16 | 1 | ✓/✓/✓ | стрибки до кінця масиву; заправки по колу; розклад задач з охолодженням | greedy + heap; exchange argument |  |
| `fs-algo-27` | **Мікс-сет / бос блоку B5** | 2 | 3 | 1 | 6 | 8 | — | сусіди — задачі патернів блоку | нові, патерн не оголошено | 1 hard = 2 патерни | |
| `fs-algo-28` | P20 Графи: BFS/DFS, сітки | 4 | 11 | 3 | 18 | 16 | 1 | ✓/✓/✓ | кількість островів; поширення по сітці (multi-source BFS); шлях з ключами | BFS зі станом (позиція + bitmask) |  |
| `fs-algo-29` | P21 Топологічне сортування | 2 | 6 | 2 | 10 | 16 | 1 | ✓/✓/✓ | розклад курсів; порядок збірки пакетів; алфавіт невідомої мови | topo + DP на DAG |  |
| `fs-algo-30` | P22 Union-Find | 2 | 6 | 2 | 10 | 16 | 1 | ✓/✓/✓ | кількість компонент; зайве ребро; злиття акаунтів за email | UF + сортування ребер |  |
| `fs-algo-31` | P23 Найкоротші шляхи і MST | 2 | 7 | 4 | 13 | 16 | 1 | ✓/✓/✓ | час доставки сигналу (Dijkstra); найдешевший рейс з ≤ K пересадками; MST точок | Dijkstra зі станом; 0-1 BFS |  |
| `fs-algo-32` | **Мікс-сет / бос блоку B6** | 2 | 3 | 1 | 6 | 8 | — | сусіди — задачі патернів блоку | нові, патерн не оголошено | 1 hard = 2 патерни | |
| `fs-algo-33` | P24 DP 1D: рекурсія + памʼять | 4 | 9 | 2 | 15 | 16 | 1 | ✓/✓/✓ | сходи; грабіжник будинків; декодування рядка цифр | DP зі станом (індекс, прапорець) |  |
| `fs-algo-34` | P25 DP 2D і рюкзак | 2 | 9 | 3 | 14 | 16 | 1 | ✓/✓/✓ | унікальні шляхи; розмін монет; поділ на дві рівні суми | unbounded vs 0/1, стиснення памʼяті |  |
| `fs-algo-35` | P26 DP на рядках і LIS | 2 | 8 | 4 | 14 | 16 | 1 | ✓/✓/✓ | LCS; редакційна відстань; LIS за O(n log n) | DP + binary search (LIS) |  |
| `fs-algo-36` | P27 DP: інтервальне, bitmask, на деревах | 0 | 5 | 6 | 11 | 16 | 1 | —/✓/✓ | лопання кульок; комівояжер для малих n; грабіжник на дереві | bitmask DP + BFS, rerooting |  |
| `fs-algo-37` | **Мікс-сет / бос блоку B7** | 2 | 3 | 1 | 6 | 8 | — | сусіди — задачі патернів блоку | нові, патерн не оголошено | 1 hard = 2 патерни | |
| `fs-algo-38` | P28 Префіксні дерева | 2 | 6 | 3 | 11 | 16 | 1 | ✓/✓/✓ | пошук слів у сітці (Trie — Kata 06, посилання); автодоповнення з топ-3; максимальний XOR пари | trie + backtracking |  |
| `fs-algo-39` | P29 Бітові трюки | 4 | 6 | 2 | 12 | 16 | 1 | ✓/✓/✓ | єдине число без пари; кількість одиниць 0..n; підмножини через маски | маски як стан DP |  |
| `fs-algo-40` | P30 Математика: прості, НСД, модулі | 4 | 7 | 2 | 13 | 16 | 1 | ✓/✓/✓ | циклічні прості до N (reported Toptal-style, власне формулювання); НСД/НСК і дроби; комбінації за модулем p | решето + перевірка обертань |  |
| `fs-algo-41` | P31 Спроєктуй структуру даних | 2 | 8 | 4 | 14 | 16 | 1 | ✓/✓/✓ | LFU-кеш (LRU — Kata 06, посилання); множина з випадковим елементом за O(1); ітератор по вкладених списках | hash map + двозвʼязний список + buckets |  |
| `fs-algo-42` | **Мікс-сет / бос блоку B8** | 2 | 3 | 1 | 6 | 8 | — | сусіди — задачі патернів блоку | нові, патерн не оголошено | 1 hard = 2 патерни | |
| | **Разом** | **125** | **279** | **99** | **503** | **560** (+60 `method`) | **31** (+31 `transfer`) | | | | |

- P23 easy raised from 1 to 2 so every non-empty difficulty has a sibling; P27 has no easy level by design.
- Patterns are topics, not skill nodes (registry: skill = section = block). Pattern-level signals (recognition accuracy, «found the waste», edge cases before coding, complexity stated) are tracked per topic id — proposal for the registry/readiness model: allow topic-level signals for `fs-algo`.
- Reused Katas 07 (8): Two Sum (P02), найдовший підрядок без повторів (P04), перше входження (P07), правильні дужки (P09), спіральна матриця (P12), BFS/DFS дерева (P15), top-k (P17), злиття інтервалів (P18).

## 5. `fs-sd` — design catalog

**Backend 44** (≥ 40) · **Frontend 16** (≥ 15). Topic ids are in the `fs-sd` table above.

**I. Класика** (15): Скорочувач URL; Розподілений rate limiter; Розподілений кеш / key-value store; Генератор унікальних ID; Вебкраулер; Typeahead / автодоповнення; Система сповіщень (push/email/SMS); Стрічка новин (fan-out on write vs read); Чат 1:1 і групи; Pastebin; Лідерборд у реальному часі; Система метрик і моніторингу; Розподілений планувальник задач; API gateway; Повнотекстовий пошук по сайту.

**II. Продуктові системи** (15): Виклик таксі (ride-hailing); Диспетчеризація доставки їжі; Бронювання готелів (без overbooking); Квитки на події (flash sale, блокування місць); Checkout e-commerce; Платіжна система (ledger, double-entry, ідемпотентність); Цифровий гаманець / P2P-перекази; Відеостримінг (VOD); Live-стримінг; Синхронізація файлів (Dropbox-подібна); Фотосервіс (Instagram-подібний); Колаборативне редагування (Docs-подібне); Пошук поруч (proximity); Соціальний граф, «друзі друзів»; Поштовий сервіс (inbox, пошук, вкладення).

**III. Інфраструктура і дані** (14): Multi-tenant SaaS-платформа; Сервіс feature flags; Платформа доставки вебхуків; Розподілена черга повідомлень (Kafka-подібна); Object storage (S3-подібне); CDN; Пайплайн логів і трейсів; Агрегація кліків по рекламі (stream processing); Пайплайн рекомендацій для стрічки; LLM-чат / RAG-бекенд (місток у fs-ai); Білінг і usage metering; Сервіс ідентичності і SSO; Біржа: матчинг ордерів; Trending / top-K heavy hitters.

**Frontend** (16): Стрічка новин (infinite scroll, віртуалізація); Віджет автодоповнення; Дизайн-система / бібліотека компонентів; Offline-first застосунок нотаток (PWA, синхронізація); Чат-інтерфейс (realtime, optimistic UI); Редактор зображень; Колаборативна дошка (canvas/whiteboard); Analytics SDK; Відеоплеєр (adaptive streaming, a11y); Таблиця даних на 100k рядків; Rich text editor; Сторінка товару + checkout (SEO, CWV); Дашборд з realtime-графіками; Shell для micro-frontends; Конструктор форм / рушій wizard-ів; Spreadsheet (формули, залежності, віртуалізація).

## 6. Reuse map and dedupe (M10)

| Asset / concept | Owner (theory, Q&A, gate pool) | IV–VII angle only |
|---|---|---|
| JavaScript Katas 01–06, 08 (54) · Katas 09 (8) | `javascript-noob-to-god/livecoding` | `fs-live` base pool; new tasks cover only missing items |
| Katas 07 (8 algorithms) | `javascript-noob-to-god/livecoding` | in `fs-algo` pattern pools with ladder metadata |
| JS Projects 02 calculator · 08 HTTP client | `javascript-noob-to-god/projects` | `fs-algo` P12 / `fs-live/parsing` link; `fs-integr/third-party` extends |
| Type challenges (DeepReadonly, UnionToIntersection, typed emitter, branded types…) | `fs-ts` | `fs-live/ts-real-api`: timed sets from the `fs-ts` pool (24, not new) + 16 new «type a real API»; TS in IV/V is framework typing only (OpenAPI types, tRPC, typed resolvers, webhook unions, Fastify handlers) |
| XSS, CSP, CORS, cookies/SameSite | `fs-browser/web-security` | `fs-auth/server-hardening`: server headers and CORS config; `fs-sec/client-attacks`: exploitation and labs (Q&A cut 22 → 14) |
| Sessions, JWT, OAuth/OIDC, PKCE, CSRF, recovery | `fs-auth` | `fs-sec/identity-crypto`: attacks, labs, reviews; theory removed there (Q&A 26 → 20, now mostly crypto) |
| OWASP Top 10:2025, API Top 10:2023, secure code review, threat models, labs, supply chain, leaked credentials | `fs-sec` | `fs-auth`: 1 linked review per section (5), no labs/TMs (moved 15 reviews, 10 labs, 4 TMs to `fs-sec`); `fs-integr` 4 linked reviews; `fs-node/safe-runtime` keeps only runtime config (prototype pollution, ReDoS, path traversal → `fs-sec/server-attacks`) |
| Windows, CTE, recursion, gaps-and-islands, top-N, pivot, dedupe | `fs-sql` | `fs-sqlps`: timed problems only — 0 Q&A, 0 cards, 0 quiz; briefings ≤ 600 words per section |
| Debounce/throttle, cancellation, UI races | `fs-state` | `fs-live/async`: polyfills on time |
| Browser event loop | `javascript-noob-to-god` + `fs-jsi` | `fs-node/event-loop`: libuv phases only |
| HTTP caching | `fs-browser` | `fs-queues/cache-scale`: server/CDN side; `fs-netos/http-deep`: cache topic removed (link) |
| Shell basics · Git basics · DNS/TCP/TLS basics · processes basics | `fs-tools/shell` · `fs-tools/git-basics` · `fs-cs/net-basics` · `fs-cs/os-basics` | `fs-devops/linux` server angle · `fs-git` · `fs-netos` deep versions |
| Guides/Node.js, Guides/PostgreSQL (stubs ≈ 4.4k / 5.3k words) | — | chapter lists reused as skeletons for `fs-node`, `fs-sql` |

## 7. Spiral links, bosses, capstones

| Idea | Path (global keys) |
|---|---|
| Кешування | `fs-browser/browser-network` → `fs-state/server-state` → `nextjs-zero-to-pro/data` → `fs-api/reliability` (ETag) → `fs-nosql/redis-structures` → `fs-queues/cache-strategies` → `fs-queues/cache-scale` → `fs-algo/b8` (LRU/LFU) → `fs-dist/consistency` → `fs-sd/building-blocks` → `fs-sd/be-classic` (distributed cache), `fs-sd/be-infra` (CDN) |
| Конкурентність | `javascript-noob-to-god/async-memory` → `fs-node/event-loop` → `fs-node/processes` → `fs-sql/transactions` → `fs-queues/reliable` → `fs-live/async` → `fs-netos/io-models` → `fs-dist/time-order` → `fs-dist/consensus` → `fs-sec/access-logic` (double-spend) → `fs-sd/be-product` (ticketing, booking, wallet) |
| Консистентність | `fs-sql/transactions` → `fs-nosql/redis-internals` → `fs-queues/reliable` (outbox) → `fs-queues/cache-scale` → `fs-integr/webhooks` → `fs-integr/payments` (reconciliation) → `fs-dist/replication` → `fs-dist/consistency` → `fs-dist/transactions-dist` → `fs-sd/be-product` |
| Безпека | `fs-browser/web-security` → `nextjs-zero-to-pro/auth-security` → `fs-auth/*` → `fs-node/safe-runtime` → `fs-api/reliability` → `fs-integr/webhooks` → `fs-arch/review-quality` → `fs-devops/cicd` (secrets) → `fs-sec/*` → security notes in every `fs-sd` design |
| Продуктивність | `fs-browser/rendering` → `fs-perf/perf-metrics` → `fs-algo/method` → `fs-node/perf-memory` → `fs-sql/explain` → `fs-queues/cache-strategies` → `fs-netos/http-deep` → `fs-obs/capacity` → `fs-sd/method` |

| Part | Boss (100%, fresh variants, re-check another day) | Capstone (local, rubric + acceptance kit, free services) |
|---|---|---|
| IV | 40 mixed Q&A-style gate items drawn from QZ pools (25% from I–III) · 1 Node task · 2 SQL (window + EXPLAIN fix) · 1 auth-flow review · 1 cache/queue reliability task · mini API design (rubric) · 10 drills | «Loo Market API»: Fastify/Nest + TS, PostgreSQL + migrations, Redis cache with stampede protection, sessions/JWT with refresh rotation, RBAC + object-level checks, OpenAPI, cursor pagination, idempotency keys, rate limiting, jobs with DLQ, tests, graceful shutdown |
| V | 25 gate items (incl. IV) · Stripe webhook with idempotency + signature · OAuth code + PKCE step · presigned upload · resilient third-party client | «Підключи все»: Stripe test-mode subscriptions, OAuth login + linking, email, uploads to MinIO/R2, search, realtime notifications, CSV export via streams, audit log, tenant quotas |
| VI | 3 algorithms E/M/H unannounced, L4 · 1 JS practical · 1 «type a real API» · 2 SQL · 1 PR review · 1 refactor under tests · 20 drills · 30 gate items | «Спадщина»: refactor a 3k-line legacy Node/TS service to hexagonal/modular monolith under characterization tests, ADRs, clean Git history, mutation-score target + timed 6-problem «Метод Loo» marathon |
| VII | backend SD 45 min + frontend SD 30 min (rubrics) · incident from seeded telemetry · threat model · 200-line secure review · Dockerfile/CI/IAM fix · 40 gate items (incl. IV–VI) | «В продакшн»: ship and operate V — multi-stage Docker, CI/CD with preview + canary, Terraform plan (no paid apply), OpenTelemetry, SLOs + burn-rate alerts, game-day incident + postmortem, STRIDE model + security review, «100×» design doc defended in UA and EN |

## 8. Proposed registry changes (lead-owned; not edited)

Concept-owner rows to add to registry §4:

| Concept | Owner | Others add |
|---|---|---|
| Ідемпотентність, idempotency keys, rate limiting (контракт і алгоритми) | `fs-api/reliability` | `fs-live`: реалізація на час; `fs-dist/resilience`: розподілений ліміт; `fs-sd`: дизайн |
| Вебхуки (підпис, replay, порядок) | `fs-integr/webhooks` | `fs-api`: 1 тема-посилання; `fs-sec`: рев'ю |
| Ретраї з backoff/jitter, circuit breaker, bulkhead | `fs-dist/resilience` | Katas 05: реалізація; `fs-queues/reliable`: ретраї консьюмера; `fs-integr/third-party`: клієнт |
| Outbox/inbox, DLQ, гарантії доставки | `fs-queues/reliable` | `fs-dist/transactions-dist`: саги |
| Стратегії кешу, stampede, кеш ↔ БД | `fs-queues` | `fs-sd`: дизайн; HTTP-кеш лишається за `fs-browser` |
| Структури Redis, Redlock-застереження | `fs-nosql` | `fs-dist/consensus`: fencing tokens (власник fencing) |
| Криптографія для інженерів, supply chain, leaked credentials | `fs-sec` | `fs-auth/secrets`: зберігання і ротація |
| Prototype pollution, ReDoS, path traversal | `fs-sec/server-attacks` | `fs-node/safe-runtime`: конфіг рантайму |
| Linux/shell basics | `fs-tools/shell` | `fs-devops/linux`: серверний ракурс |

Other proposals: (1) skill-slug limit — registry §2 says ≤ 32, §3 says ≤ 40 (`SkillIdSchema`); all slugs here are ≤ 20. (2) Topic-level readiness signals for `fs-algo` patterns (§4). (3) Course titles here use the registry titles (`fs-auth` «Автентифікація й авторизація», `fs-algo` «Алгоритми й «Метод Loo»»).

## 9. Words — Part IV depth (M3)

| Part | Topics | Theory | Words A (theory + editorial + Q&A answers) | Words B (exercise text) | A per topic |
|---|---|---|---|---|---|
| IV. Backend-інженерія | 151 | 535k | 848k | 222k | 5.6k |
| V. Інтеграції | 24 | 80k | 135k | 51k | 5.6k |
| VI. Інженерна майстерність | 142 | 264k | 667k | 480k | 4.7k |
| VII. Системи | 165 | 445k | 779k | 248k | 4.7k |
| **IV–VII** | **482** | **1324k** | **2429k** | **1001k** | 5.0k |

Part IV deepened in this revision: theory 535k (was 330k theory-only) → words A 848k, on par with `fs-react` (280k) and `fs-ts` (190k) per course: `fs-node` 210k, `fs-api` 126k, `fs-auth` 93k, `fs-sql` 240k, `fs-nosql` 90k, `fs-queues` 88k.
- `fs-node` theory 75k → 140k and `fs-sql` 75k → 150k: JS-course depth (≈ 4–5k per topic, like JS core), with «under the hood» walkthroughs (libuv phases, stream internals, MVCC tuples, planner costs), more diagrams/traces and the per-level interview blocks. `fs-sql` also takes over the theory moved out of `fs-sqlps` (pivot, dedupe/SCD, top-N and gaps-and-islands as techniques).
- `fs-api` 55k → 75k, `fs-auth` 50k → 60k (after moving attack material to `fs-sec`), `fs-nosql` 40k → 55k, `fs-queues` 35k → 55k.
- Track view for the owner: IV–VII words A ≈ 2429k + B ≈ 1001k. With I–III (≈ 1.2M on basis A) and the other parts, the new-content total is well above the spec's 2.5–3M; the per-part depth rule and the target need an owner decision (blueprint 9.4).

## 10. Runner needs per task type

| Task type | Runner | Exists? | Count | Notes |
|---|---|---|---|---|
| Algorithms | JS worker | yes | 503 | per-step tests, locked code, perf tests, misconception tags, re-seeding (stage 1) |
| JS practical + JS-d | JS worker + fake clock | yes | 120 | fake timers for retry/circuit breaker/rate limiter |
| TS «type a real API» | TS checker (lazy) | no | 32 | shared with `fs-ts`; hidden type tests server-side |
| Node | JS worker + node-lite shim | partly | 100 | ≈ 12 tasks want the real runtime → Node sandbox (approval) or simulated |
| Redis / document store | emulators in JS worker | no | ≈ 20 (in Node) | TTL on fake clock, MULTI/WATCH; no Lua |
| SQL | PGlite | dev dep | 270 | re-seedable tables; isolation via two-timeline simulator |
| Debugging / review | by language + line-select review block | partly | 106 | `[!review]`-like block |
| Gate quizzes (QZ) incl. generators | quiz block + generator hook | partly | 7349 | generators: event-loop order, encodings, SQL results (PGlite), isolation timelines, Redis commands, TTL timelines, CIDR/RTT, Git state, SLO/burn rate, vector clocks, quorums, hashing, estimation |
| Recognition / predict / Q&A / cards | quiz, flashcard, interview blocks | yes | 937 / 113 / 2452 / 3953 | predict answers verified at build time |
| Integrations | JS worker + fake providers | no | 48 | offline, no keys |
| Security reviews / labs | review block / iframe + mock backend (HTTP lab simulator) | no | 82 / 44 | client-side labs depend on the Part III UI-runner approval |
| Threat models, designs | `[!diagram]` + rubric; numeric estimation | partly | 24 / 60 | AI grading later, paid, approval |
| Mutant-graded tests · Git · config linters · telemetry · estimation | JS worker variants | no | 134 | Git: isomorphic-git (~300 KB) or own DAG model |

## 11. Open questions

1. JS practical: interview-style 100 new + 54 Katas = 154 — meets ≥ 150 only with reuse; domain JS-d (20) no longer counted. Add ~30 new to `fs-live` for headroom?
2. Security Q&A after dedupe = 306: ≥ 300; it counts `fs-auth` + `fs-sec` only, the `fs-browser/web-security` Q&A should be added to the security tally.
3. Isolation demos: PGlite is single-connection → two-timeline simulator now, server Postgres later?
4. Node sandbox for ≈ 12 real-runtime tasks, or keep them as local/capstone work?
5. Guides/Node.js and Guides/PostgreSQL stubs: rewrite in place or new guide folders?
6. Shell tasks: simulated shell with virtual fs (recommended) or quiz only?
7. Capstones are local and self-assessed against the rubric until paid AI grading is approved — acceptable?
8. Word target: IV–VII alone are ≈ 2429k (A) + 1001k (B); owner decision on the 2.5–3M target and the per-part depth rule (blueprint 9.4).

