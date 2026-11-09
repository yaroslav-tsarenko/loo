# Task: build «Full-Stack Engineer: Zero → Pro» — from absolute zero to a top-paid full-stack engineer and Tech Lead

> Prompt for Claude Code. Repository: **Loo** (GitHub `yaroslav-tsarenko/loo`; local checkout may be the folder
> `~/Projects/interview-preparation-2-0` — use the repo root). Learner-facing content is **Ukrainian**; this prompt is
> English for you and your sub-agents. Market research behind this prompt: November 2026 (see §2).

## 0. Mission

Build **«Full-Stack Engineer: Zero → Pro»**, Loo's flagship and biggest learning track. It takes a person
from **absolute zero** — how a computer and the internet work, the first line of HTML — to a **real full-stack
engineer who thinks like an engineer**. It covers HTML/CSS, JavaScript, TypeScript, React/Next.js, Node.js,
databases, integrations, testing, architecture, DevOps and cloud, system design, AI/LLM engineering, soft skills,
Tech Lead skills, and English for IT. A–Z, nothing missing. Track id: `fullstack-zero-to-pro`; Ukrainian subtitle
(propose the final wording): «Від нуля до фулстек-інженера рівня Senior».

**Scale.** This is by far the largest program in Loo: hundreds of long articles and many thousands of exercises —
roughly **2.5–3 million words** of theory across the track (the reused JS, Next.js and English courses count). Every
core part is at least as deep as the JS course. Plan the volume per part in stage 0.

**Target career outcome.** Graduates aim at roles paying **$5,000+/month**: senior-level remote positions for US/EU
companies, top outsourcing/outstaffing clients, vetted freelance networks, strong product companies. That level
requires three things together — senior-grade engineering depth, interview performance, and fluent English with
confident product and architecture talk. The program must deliver all three. The career part covers positioning for
that level:
- researching market rates by country, company type and platform;
- choosing a niche and stack positioning;
- portfolio and evidence of impact;
- applying where such salaries are paid;
- rate and salary negotiation;
- contractor vs employee economics and taxes at a high level.

Present pay figures as dated market data with sources, never as guarantees.

**The outcome.** The graduate is a professional who:
- understands the field deeply and finds their way in any material, framework or codebase;
- builds, tests, secures, deploys and operates production systems;
- passes **any** full-stack interview from **Junior to Tech Lead**:
  - outsourcing and outstaffing companies;
  - product companies and startups;
  - FAANG/MAANG-style loops;
  - vetted freelance networks (Lemon.io, Toptal, Arc.dev, Gun.io, Turing, Proxify, Andela…).

**The bar: for a typical full-stack vacancy, ~99% confidence of passing.** The graduate:
- solves every type of live-coding problem (algorithms, JS/TS practical, React machine coding, Node/API, SQL,
  debugging and code review, AI-assisted rounds, take-homes), thinking aloud, in time;
- answers any theory question at the level asked (junior / middle / senior / tech lead) with a strong, structured
  answer and survives follow-ups;
- runs backend and frontend system-design interviews end to end, with numbers and trade-offs;
- handles behavioral, soft-skill and leadership rounds;
- does all of it — and talks about products, projects and architecture — in fluent, natural **English**, including
  IT slang, workplace jargon and everyday colloquial speech.

**Who it is for:**
- a complete beginner, who starts at Part I and climbs the scaffolding ladder (§5.2b);
- an experienced developer, who is placed by per-skill tests and skips what they know;
- the first learner is the owner himself, a working full-stack developer. He wants to **structure everything he
  knows, close every gap, and walk into interviews with total confidence.**

**The heart of the program is one way of thinking — «Метод Loo»** (§5.0): a 7-step problem-solving method, a
pattern map and pattern recognition, taught from easy to hard. With it the learner can attack problems they have
never seen. Knowledge must **stick** — the retention system in §3a is as important as the content.

Design for real learning, not for reading:
- every problem teaches a way of thinking;
- every topic ends in retrieval practice;
- everything is sequenced, spaced, interleaved, tracked and adaptive.

Work in **stages**. After each stage: checks → report → **STOP** and wait for the owner. Never start the next stage on
your own.

---

## 1. Read the project first (mandatory)

Before writing anything, understand how Loo works. Courses must feel native.

**Documentation (`docs/`):**
- `ARCHITECTURE.md`, `COURSE_FORMAT.md` (the course package format — **key**), `LEARNING_PLAYBOOK.md`;
- `LANGUAGE_COURSE.md` (per-skill levels, placement, adaptive selection, `[!talk]` / `[!write]` if already built);
- `ROADMAP.md`, `DESIGN.md` (pixel style, no Apple emoji, Onest), `SECURITY.md`, `PERFORMANCE.md`, `ECONOMY.md`,
  `BATTLES.md`, `ANALYTICS.md`.

**Code:**
- Bundle schema: `src/course/schema/bundle.ts` (exercise kinds, skills, levels).
- Compiler: `scripts/course-build.ts`, `scripts/course-check.ts`.
- Blocks: `src/content/blocks/*` (`[!quiz]`, `[!flashcard]`, `[!task]`, `[!interview]`, `[!diagram]`, `[!viz]`…).
- Selection and progress: `src/course/select/*`, `src/progress/*` (FSRS, XP, streaks).
- The task runner: `src/app/runner/*` and its worker. Learn exactly what it can execute and how tests are written and
  graded server-side.
- Content storage: `src/content/store.ts` — currently one snapshot of all guides is loaded into memory (≈ 50 MB at
  2 courses). A per-course storage refactor is planned; check its status before adding a large volume of content, and
  never make the problem worse (§9).

**Existing courses and precedents — reuse, never duplicate:**
- **JavaScript Zero → Pro** (`content/courses/javascript-noob-to-god`): ≈ 457k words, 1,759 exercises, Katas,
  Projects, `JS Interview Q&A`. This is the reference for depth and for the coding-task format.
- **Next.js Zero → Pro** — in progress on branch `feature/nextjs-course` (worktree `../loo-nextjs`). Read its prompt
  (`docs/prompts/nextjs-course.md`), its syllabus, and its platform work: skills as course data, per-skill placement,
  content i18n, and the opus/sonnet/haiku agent pipeline.
- **English A1→C2** (writing/speaking stage in progress) and **German A1→C2** (branch `feature/german-course`). Reuse
  their speaking and writing blocks for interview English.
- Find out what is merged to `main` and what still lives on branches. Build on top of it; don't re-implement.

Work in a **new worktree** `../loo-fullstack` on branch `feature/fullstack-zero-to-pro`, as the other course
branches do.

---

## 2. The 2026 hiring reality the program must reflect

Verify and extend this with your own research in stage 0. It came from public sources; mark claims about specific
companies as "reported" and date them.

**AI changed interviews, but not everywhere:**
- Meta runs an "AI-enabled coding" round (since Oct 2025, standard through 2026): 60 min, a multi-file project in
  CoderPad with an AI chat. Graded on problem solving, code quality, verification of AI output, and communication.
- Google began rolling out AI-assisted "code comprehension" rounds with Gemini (reported Oct 2026). It grades AI
  fluency, prompt quality, output validation and debugging.
- Canva, DoorDash and LinkedIn run AI-assisted rounds. Amazon, Goldman Sachs, Anthropic and many others prohibit AI.
- A Karat survey (Jan 2026): ~38% of US companies allow AI in interviews, ~62% prohibit it.
- **Consequence:** train both modes:
  - classic no-AI problem solving (still the majority);
  - the AI-assisted round: reading, verifying, testing and steering AI-written code in a multi-file codebase.

**Vetted freelance networks** (Lemon.io, Toptal, Arc.dev, Gun.io, Turing…) typically run:
1. profile/CV/portfolio review;
2. English and soft-skills check (often a recorded intro or call);
3. an online technical test (quiz and/or algorithmic);
4. a live coding or pair-programming session with a senior engineer — usually practical, real-world problems rather
   than puzzles;
5. sometimes a test project;
6. a final soft-skills / client-style interview.

Reported acceptance is ~1–3% (Lemon.io ~1.2%, Toptal "top 3%", Gun.io ~3.5–10%). Lemon.io reportedly wants 5+ years
in the stack.

**Stack demand.** TypeScript is the default for full-stack roles; React/Next.js + TypeScript + Node is the most common
combination. A large share of postings asks for AI-integration experience. The best-paid skills are LLM work,
observability, system design and Next.js. Employers test whether candidates can critically review AI-written code.

**Loops by company type** (build a map and a prep plan for each):
- **Outsourcing/outstaffing:** recruiter call → tech interview (theory deep-dive + practical) → often a client
  interview → offer. Heavy on theory Q&A, projects, English.
- **Product companies:** screen → live coding (practical or algorithmic) → system design → behavioral/culture →
  sometimes a take-home.
- **FAANG-style:** recruiter → online assessment / phone screen (algorithms) → onsite: 2 coding (one may be
  AI-assisted), system design (backend or frontend), behavioral (e.g. Amazon Leadership Principles) → hiring committee
  / bar raiser → levels and negotiation.
- **Startups:** fast; practical pairing, a take-home, product sense, ownership stories.

---

## 2a. What candidates report from the field — and a question bank built from it

The owner wants **every question that can be asked**. In stage 0 the researcher agent mines first-hand accounts and
builds a **field question bank**:
- forums and communities: Reddit (r/cscareerquestions, r/ExperiencedDevs, r/webdev, r/freelance), Hacker News,
  Blind, dev.to;
- review sites: Glassdoor;
- the Ukrainian market: DOU.ua interview reviews, Djinni;
- public interview write-ups and recordings, company engineering blogs, prep repos.

For each question in the bank:
- the wording;
- where it was reported (link, date, company/platform, role, level);
- how often it appears (frequency tag);
- the topic and skill it maps to.

Deduplicate, merge variants, and make sure the course teaches the answer. **Coverage check:** every field question is
linked to at least one lesson and one exercise. The stage-0 report shows the coverage percentage, and it must reach
100% before the final stage.

**Seed findings** (Nov 2026, from public candidate reports — verify, date and extend; processes change and some
accounts are old):
- **Toptal:**
  - English and communication interview → a timed Codility test (reportedly 3 problems in ~90 minutes, around
    LeetCode-medium) → a live screening with screen sharing → a test project. The whole process takes 3–8 weeks.
  - In the live round, screeners reportedly ask you to explain your Codility solutions, then give 1–2 more algorithm
    problems. One reported example: count the cyclic primes up to N (a sieve).
  - Reported pass rates per stage: ~26% → ~7% → ~3.6% → ~3.2% → ~3% overall.
- **Lemon.io:**
  - CV review → a recruiter (sometimes a bot) conversation about experience, with a small stack question → theoretical
    multiple-choice questions in the HR stage → a technical interview with an external senior engineer.
  - The technical interview has two phases: (1) depth of theory — concepts, tools and components of your stack;
    (2) live coding — propose practical solutions, **find issues in existing code**, write your own solution.
  - Their interviewers stress architectural reasoning over LeetCode.
  - A recorded 1-minute intro is used; at least one candidate reports a rejection for their accent → train
    pronunciation and the intro.
- **Arc.dev:**
  - profile screening (~55% pass) → English and remote-readiness check by video (~14%) → a one-hour technical
    session with a senior developer: pair programming, broad questions, a domain deep dive (~2%).
  - Reported questions range "from language internals to how the Internet works" (e.g. "what is DNS?", "how is a
    list/array implemented in language X?") plus a small coding task (e.g. Fibonacci).
- **Gun.io:**
  - a group onboarding call → profile completion → a coding test (Codility) → technical interview rounds →
    character/fit review.
  - A reported Codility task: split a message into fragments of at most K characters, whole words only, no fragment
    ending with a space.
  - Reported design topics: DDD, CQRS, design patterns. Candidates also report a strong focus on how you present
    yourself.

**Platform simulators** go into the mock-interview arena (Part XI): Toptal-style, Lemon.io-style, Arc-style and
Gun.io-style loops reproduce each format end to end — English intro → timed test → live round that asks you to
explain your own solutions → test project or architecture talk.

---

## 3. Product shape: one track, eleven parts, many courses

The program is too big for one course bundle (memory, build time, learner focus). Build it as a **track** — `fullstack-zero-to-pro`,
«Full-Stack Engineer: Zero → Pro»:
- one sequential spine;
- one readiness profile, one plan, one knowledge atlas (§3a), one mock-interview arena;
- made of **courses** that each compile to their own bundle;
- reuses the existing courses (JS Zero → Pro, Next.js Zero → Pro, English A1→C2) as modules instead of duplicating
  them.

If Loo has no "track" concept yet, design it in stage 1:
- a track manifest of parts → course ids with roles (core/module/prerequisite/elective);
- a shared skill graph and the readiness score;
- track progress, the atlas, the plan view.

**The spine — 11 parts, in learning order** (refine in stage 0; every part ends with a cumulative "boss" exam and a
capstone project):

| Part | Courses (proposed) | What it covers |
|---|---|---|
| **I. Фундамент** | «Як працюють комп'ютер і інтернет»; «Інструменти розробника»; «Код і задачі з нуля» (ramp) | how a computer, OS, files, the terminal and the internet work (DNS, HTTP at a glance); editor, Git basics, the command line; first programming concepts through tiny tasks; tracing and debugging |
| **II. Веб** | HTML; CSS (layout, responsive, modern CSS, design systems basics); JavaScript (module: JS Zero → Pro); TypeScript; Browser & Web Platform | semantic HTML and accessibility; layout with flex/grid; the full JS language; the TS type system; how the browser renders, storage, workers, security model |
| **III. Frontend-інженерія** | React; Next.js (module); State & Data; Frontend Testing; Web Performance | React from hooks to internals and RSC; Next.js; state and data fetching; testing; Core Web Vitals |
| **IV. Backend-інженерія** | Node.js; API Design; Auth & Security; SQL & PostgreSQL; NoSQL & Redis; Queues & Caching | runtime internals; REST/GraphQL/gRPC/realtime; OAuth/OIDC, sessions, OWASP; SQL to internals; data modeling; async processing |
| **V. Інтеграції** | Real-World Integrations | everything a product actually plugs in (§4 «Integrations») |
| **VI. Інженерна майстерність** | Algorithms & DS («Метод Loo»); JS & TS Live Coding; SQL Problem Solving; Architecture & Code Quality; Testing Strategy; Git Advanced | problem solving, every live-coding type, patterns, SOLID, DDD, clean architecture, refactoring, code review |
| **VII. Системи** | Networking & OS; DevOps & Cloud; Observability & Reliability; Distributed Systems; **Cybersecurity for Engineers**; System Design (backend + frontend) | TCP/TLS/DNS/HTTP2-3; processes and concurrency; Docker, CI/CD, Kubernetes basics, AWS core; logs/metrics/traces, SLOs, incidents; consistency, replication, sharding; ~55 designs |
| **VIII. AI та LLM** | AI Engineering for Full-Stack; AI-Assisted Development | LLM APIs, structured outputs, tools, streaming UIs, RAG, embeddings, vector DBs, evals, cost, safety, agents; working with AI coding tools; the AI-assisted interview round |
| **IX. Професіонал і лідер** | Soft Skills; Behavioral Interviews; **Interview Psychology & Tricky Questions**; Tech Lead; Career & Job Search | communication, feedback, conflict, ownership; STAR stories; leading a team, planning, architecture decisions, hiring, incidents; CV, platforms, negotiation, contracting |
| **X. English for IT** | a full program, as big as any other part (§4a) | IT vocabulary, IT and everyday slang in dialogues, talking about products and architecture, interviews in English, meetings, clients, writing, listening, accents |
| **XI. Арена співбесід** | Interview Playbook; Mock Interviews & Readiness; Final Exam («Великий бос») | how hiring works by company type, platform and level; full timed loops from Junior to Tech Lead; the readiness score; the final exam |

**Parallel streams.** Parts IX (soft skills), X (English) and the algorithms course in VI run **alongside** the spine
from early on, as part of the daily mix. They don't wait for the spine to finish. The Interview Playbook (XI) is
available from day one, so the learner can plan.

**Coverage by level.** Every topic, question and task is tagged junior / middle / senior / tech lead. Every theory
topic has an «як відповісти на співбесіді» block per level that applies.

---

## 3a. Knowledge that sticks — retention and orientation system

The owner's requirement: knowledge must be **structured and retained very strongly**, and the learner must **find
their way in any material**. Build this as a system, not as advice.

1. **Strict sequence with a prerequisite graph.**
   - Every lesson starts with «що ти вже знаєш → що нового → де це використовується».
   - Nothing appears before its prerequisites; links point back to them.
2. **Spiral curriculum.** Key ideas return at growing depth, and the returns are explicitly linked. Example — caching:
   HTTP cache → browser cache → React Query → Next.js cache → Redis → CDN → cache design in system design. Same for
   state, concurrency, consistency, security, performance.
3. **Retrieval practice everywhere:**
   - every lesson ends with recall questions, not re-reading;
   - every module ends with a cumulative review;
   - every part ends with a mixed «бос» exam over everything so far, including earlier parts.
4. **Spacing and interleaving.** FSRS schedules all cards, Q&A, patterns and problems. Reviews mix topics and parts,
   so the learner must recognize *what* applies.
5. **Elaboration.**
   - Self-explanation prompts and «поясни Loo» (teach-back in one's own words).
   - «Чому так, а не інакше?» questions.
   - Analogies that are then corrected ("where does the analogy break?").
6. **Concept maps and the Knowledge Atlas («Атлас знань»):**
   - a navigable map of all concepts across the track, linked by prerequisites and by "used in";
   - "you are here", search, and a glossary (uk ↔ en);
   - a one-page summary and a cheat sheet per module;
   - a "how it all fits together" overview per part, e.g. the full request path: browser → DNS → CDN → load balancer
     → Next.js → API → cache → DB, and back.

   The atlas is how the learner orients in any material.
7. **Integration through projects:**
   - every part ends with a capstone that uses everything in it;
   - the final capstone is a production SaaS: auth, roles, payments, an AI feature, realtime, file uploads, search,
     background jobs, tests, CI/CD, observability, deployed. The learner then **defends** it as in an interview:
     architecture walkthrough, trade-offs, "what would you change at 100× load" — in Ukrainian and in English.
8. **Mastery gates.** A part is complete only when its boss exam, the capstone and the spaced reviews show retention
   on later days.
9. **Interview lens on everything.** For each concept: how a junior, a senior and a tech lead would answer, with
   typical follow-ups.

---

## 4. Coverage — A to Z, Junior → Tech Lead (nothing an interview can ask may be missing)

Build a **skill graph** (skills as course data — reuse the Next.js work) and map every item below to skills, levels
(junior → middle → senior → staff) and question types. Each theory topic has **layered answers**:
- a 30-second answer;
- a 2-minute deep answer;
- senior nuance and trade-offs;
- typical follow-ups;
- red flags (what weak candidates say);
- a code or diagram when helpful.

**Web and language core:**
- **JavaScript:** execution model, scope/closures, `this`, prototypes, event loop (micro/macro tasks, rendering),
  promises/async, iterators/generators, memory and GC, modules, equality/coercion, Proxy/Reflect, errors, modern
  ECMAScript. Link to the JS course; the interview course adds Q&A drills and predict-the-output.
- **TypeScript:** structural typing, narrowing, generics and constraints, conditional/mapped/template-literal types,
  `infer`, variance, utility types, declaration merging, module resolution, `satisfies`, strictness flags, typing React
  and APIs, type-level challenges.
- **Browser and web platform:** critical rendering path, reflow/repaint, compositing, storage, workers, service
  workers/PWA, CORS, cookies and SameSite, CSP, web security, Web APIs, accessibility (WCAG, ARIA), SEO basics.
- **HTML/CSS:** semantics, layout (flex/grid), cascade and specificity, modern CSS (container queries, `:has`, layers),
  responsive images, design systems.

**Frontend engineering:**
- **React:** rendering and reconciliation, fiber, keys, hooks rules and internals, state and effects pitfalls,
  context, memoization and the React Compiler, Suspense, transitions, concurrent features, RSC and Server
  Actions, error boundaries, forms, portals, refs, performance profiling, testing (Testing Library, MSW, Playwright).
- **Next.js:** App Router, rendering modes, caching and revalidation, Server Actions, auth, deployment (link to the
  Next.js course).
- **State management** (Redux Toolkit, Zustand, TanStack Query, signals — when and why), data fetching patterns,
  micro-frontends, monorepos, bundlers (Vite, Turbopack, webpack basics), web performance (Core Web Vitals,
  code splitting, images, fonts).

**Backend engineering:**
- **Node.js:** event loop phases, libuv, streams and backpressure, buffers, worker threads, cluster, child processes,
  memory leaks and profiling, error handling, graceful shutdown.
- **Frameworks:** Express, Fastify, NestJS (concepts: DI, modules, guards, interceptors).
- **API design:** REST maturity, resource modeling, pagination (offset/cursor), filtering, versioning, idempotency
  keys, rate limiting, webhooks, error formats, OpenAPI; GraphQL (schema, resolvers, N+1, DataLoader, federation basics);
  gRPC/tRPC; WebSockets and SSE.
- **Auth and security:** sessions vs JWT, refresh tokens, OAuth 2.0 / OIDC flows, PKCE, RBAC/ABAC, password storage,
  MFA, OWASP Top 10, SSRF, injection, XSS/CSRF, secrets management, supply-chain security.
- **Async processing:** queues and messaging (RabbitMQ, Kafka, SQS concepts), job schedulers, retries, dead letters,
  outbox pattern, exactly-once myths.
- **Caching:** cache-aside, write-through, TTLs, invalidation, stampede protection, CDN, HTTP caching.

**Data:**
- **SQL:** joins, aggregation, window functions, CTEs and recursion, subqueries, set ops, NULL semantics,
  gaps-and-islands, top-N per group, pivots, dedupe.
- **PostgreSQL internals:** MVCC, indexes (B-tree, GIN, GiST, BRIN, partial, covering), `EXPLAIN ANALYZE`, vacuum,
  locks, isolation levels and anomalies, partitioning, replication, connection pooling.
- **Data modeling:** normalization vs denormalization, migrations without downtime, ORMs (Prisma/Drizzle/TypeORM)
  pitfalls.
- **NoSQL:** document (MongoDB), key-value (Redis data structures and use cases), wide-column, search (Elasticsearch
  basics), time-series; choosing a store.

**Systems:**
- **System design method:** requirements, estimations (QPS, storage, bandwidth), API, data model, high-level design,
  deep dives, bottlenecks, trade-offs, evolution.
- **Building blocks:** load balancers, reverse proxies, CDNs, caches, queues, object storage, databases and
  replication, sharding, consistent hashing, rate limiters, ID generation, search, notifications, observability.
- **Distributed systems:** CAP/PACELC, consistency models, consensus (Raft concepts), leader election, distributed
  transactions and sagas, idempotency, clocks, backpressure, failure modes, resilience patterns (timeouts, retries
  with jitter, circuit breakers, bulkheads).
- **Networking:** TCP/UDP, TLS handshake, DNS, HTTP/1.1 vs 2 vs 3, keep-alive, proxies, what happens when you type a
  URL (deep version).
- **OS basics:** processes vs threads, concurrency vs parallelism, memory, file descriptors, I/O models.
- **DevOps and cloud:** Linux and shell, Docker (images, layers, multi-stage), Kubernetes core objects,
  CI/CD pipelines, IaC (Terraform concepts), AWS core (EC2, S3, RDS, Lambda, SQS/SNS, CloudFront, IAM), Vercel,
  environments and secrets, blue-green/canary, feature flags, observability (logs, metrics, traces, SLO/SLI/SLA,
  OpenTelemetry), incident response and postmortems.

**Engineering craft:**
- **Architecture:** SOLID, GoF patterns that matter in JS/TS, functional patterns, DDD (bounded contexts, aggregates),
  clean/hexagonal, monolith vs modular monolith vs microservices, event-driven, CQRS/event sourcing (when not to).
- **Code quality:** refactoring, code smells, naming, code review etiquette, technical debt, documentation, ADRs.
- **Testing strategy:** pyramid/trophy, unit/integration/e2e/contract tests, mocks vs fakes, TDD, flaky tests,
  testing async code.
- **Git:** rebase vs merge, interactive rebase, bisect, reflog, conflict resolution, branching strategies, monorepo
  workflows.
- **Process:** Agile/Scrum/Kanban, estimates, working with product, ownership.

**Integrations (Part V) — what real products plug in:**
- **payments:** Stripe — checkout, subscriptions, proration, invoices, refunds, disputes, SCA/3DS, webhooks,
  idempotency, test mode;
- **identity:** OAuth/OIDC providers, SSO/SAML basics, magic links, account linking;
- **email:** transactional email (Resend/SES/SendGrid), templates, deliverability (SPF/DKIM/DMARC), bounces;
- **files:** uploads, presigned URLs, object storage (S3/R2), image/video processing, virus scanning;
- **search:** Postgres full-text, Meilisearch/Typesense/Elasticsearch, autocomplete;
- **realtime:** WebSockets, SSE, pub/sub, presence, collaborative editing basics;
- **notifications:** web push, mobile push concepts, in-app notification systems;
- **maps:** geolocation, geocoding;
- **analytics:** event tracking and privacy/consent (GDPR);
- **third-party API integration patterns:** auth, retries with backoff, rate limits, pagination, circuit breakers,
  webhooks in and out, signature verification, replay protection;
- **product infrastructure:** CMS (headless), feature flags, A/B tests, i18n/l10n, background jobs and schedulers;
- **data in and out:** PDF/CSV/Excel exports and imports;
- **SaaS platform features:** multi-tenancy, billing, audit logs, rate plans and quotas;
- **AI APIs** (with Part VIII).

**Tech Lead (Part IX):**
- leading a team, delegation, mentoring and growing people;
- technical vision and roadmaps, estimation and planning, prioritization, managing tech debt;
- architecture decisions (ADRs, RFCs, reviews), quality standards, code-review culture;
- hiring and interviewing others;
- incident command and postmortems, working with product and business, stakeholder management, risk;
- metrics (DORA, delivery, quality);
- the typical tech-lead interview questions and cases.

**Cybersecurity for engineers** (its own course in Part VII; security also runs through every part):
- **The current standards:** OWASP Top 10:2025, the OWASP API Security Top 10, ASVS 5.0, the cheat sheets.
  - Broken Access Control is #1.
  - Insecure Design is its own category.
  - "Mishandling of Exceptional Conditions" (fail-open) is new.

  Always say which version a source uses.
- **Web and API attacks and defenses:**
  - injection (SQL/NoSQL/command), XSS, CSRF, SSRF;
  - IDOR / object-level authorization, mass assignment;
  - path traversal, open redirects, deserialization;
  - prototype pollution and ReDoS in JS;
  - clickjacking, CORS misconfigurations, cache poisoning, request smuggling (concept);
  - business-logic flaws, race conditions (double-spend), file-upload attacks.
- **Identity:**
  - password storage (argon2/bcrypt), MFA/passkeys;
  - session security, JWT pitfalls (alg none, no expiry, storing in localStorage);
  - OAuth/OIDC attacks, account takeover and recovery flows.
- **Cryptography for engineers:** hashing vs encryption vs encoding, symmetric/asymmetric, signatures, TLS, key
  management, randomness, "don't roll your own".
- **Threat modeling:** STRIDE, data-flow diagrams, ranking and accepting risks. Strong answers start with questions
  to the product owner; a filled STRIDE grid with no questions is a red flag.
- **Secure SDLC:**
  - secure code review — find planted bugs in a 200-line Node/TS snippet;
  - SAST/DAST/SCA, dependency and supply-chain security (lockfiles, typosquatting, provenance);
  - secrets management, and what to do when credentials are leaked in a repo;
  - **security review of AI-generated code**.
- **Cloud and infrastructure:**
  - IAM least privilege, misconfigured buckets;
  - network security basics (firewalls, VPC, zero trust);
  - container security, IaC misconfigurations (Terraform);
  - logging, detection and alerting, incident response.
- **Privacy and compliance at the engineer level:** GDPR, SOC 2, PCI DSS (payments), HIPAA basics — what they mean
  for code and architecture.
- **Offensive basics, legally:**
  - how attackers think, pentest phases, Burp-style request tampering, reconnaissance;
  - practised **only in sandboxed lab apps that we ship**, never against real systems — state the legal and
    ethical rules.
- **Security interview formats:** secure code review, threat modeling on a diagram, "leaked credentials — your first
  steps", IAM policy review, security questions inside system design.

**Interview psychology and tricky questions** (its own course in Part IX; research it in stage 0 from current,
dated public sources, by region and company type):
- **Recruiter screen — every tricky question.** For each: what they really check → an answer framework → strong
  sample answers (by level and situation, in Ukrainian and English) → what never to say → typical follow-ups.
  - Salary expectations. Strategies: ask for the band and level first; give a researched range; say whether it is
    base or total compensation; know where salary-history questions are banned; don't push hard before an offer.
  - Current salary / rate, "why are you leaving?" (lead with what you want next, never bash the employer),
    employment gaps, short tenures, layoffs.
  - "Are you interviewing elsewhere?", "do you have other offers?", notice period, counter-offers.
  - "Why us?", "why should we hire you?", "what's your weakness?", "where in 5 years?", "you seem overqualified".
  - Freelance vs full-time, relocation and time zones, "how do you use AI at work?", "rate yourself 1–10".
  - Questions about personal life, age, family, health or nationality: how to deflect them gracefully, and where
    they are illegal.
- **Technical interviewer pressure:**
  - pushback on your solution ("are you sure?" when you are right — and when you are wrong);
  - "I don't know" answered well; brain teasers and estimation questions;
  - deliberately vague requirements; the interviewer going silent; interruptions;
  - "you seem junior for this level"; changing requirements mid-task.
- **Stress interviews:** rapid-fire questions, hostility, long silences, repeated questions. Tools:
  - pause on purpose and reframe it as a test of composure;
  - the PAUSE method (Pause, Acknowledge, Understand, Structure, Execute);
  - answering pushback calmly with evidence, then stopping;
  - no repeated apologies.
- **Self-regulation:** anxiety and impostor syndrome; breathing and reframing; energy management on loop days;
  recovering after a bad answer mid-interview.
- **Presence:** video-call presence (camera, light, sound, eye contact, pace); body language; reading the
  interviewer's cues.
- **Candidate-side judgment:** red and green flags about the company; questions that reveal the team's reality.
- **Negotiation psychology:**
  - anchoring, BATNA, silence, exploding offers, "the budget is fixed";
  - leveling vs title; counter-offers;
  - getting it in writing; declining gracefully.
- **After the interview:** follow-ups, handling rejection, asking for feedback, keeping a feedback log, and
  improving the next loop.
- **Culture:** US vs EU vs UK norms, directness, small talk, humor; platform-specific soft-skill rounds (Lemon.io,
  Toptal, Arc, Gun.io).
- **Practice formats:**
  - every question has a `[!talk]` role-play;
  - **stress-mode role-plays** with scripted interruptions, pushback and silences;
  - negotiation simulations with branching responses.

**AI engineering for full-stack (2026 must-have):**
- LLM APIs, prompting, structured outputs, tool use;
- streaming UIs, RAG (chunking, embeddings, vector DBs, reranking);
- evals, cost/latency trade-offs, safety and prompt injection, agents;
- AI features in Next.js (AI SDK);
- AI-assisted development workflow and **reviewing AI code critically**.

**Career and soft skills:**
- behavioral stories (STAR, story bank), seniority signals (ownership, influence, mentoring, cross-team work),
  conflict, failure, ambiguity, prioritization, Amazon LPs;
- questions to ask the interviewer;
- CV, LinkedIn and GitHub as evidence;
- salary research, negotiation, comparing offers;
- contracting specifics (rates, contracts, time zones).

**English for IT** — a full part of the track; see §4a.

---

## 4a. English for IT — a full program (Part X), as big as any other part

English is not an appendix. It is a full part with many sections, each as rich as a technical course. The learner
must be able to work, interview, talk about products and architecture, and chat naturally — including **IT slang and
everyday colloquial English in dialogues**.

Reuse the English A1→C2 course for general grammar and levels. Reuse its blocks: `[!talk]` speaking, `[!write]`
writing, `[!listen]`, `[!word]`, and audio (Kokoro) if available. This part focuses on **B1 → C1 for IT**.

**Sections:**
1. **Grammar that matters in tech talk:**
   - tenses for status updates ("I've deployed…", "I'll have finished by…");
   - conditionals for trade-offs;
   - modals for suggestions and risk;
   - passive voice for docs;
   - hedging and softening.
2. **Core IT vocabulary by domain:** frontend, backend, databases, DevOps, cloud, security, AI/ML, testing,
   product, business, finance and billing. **How to pronounce tech words:** SQL, cache, GUI, char, Nginx,
   Kubernetes, Azure, GIF, sudo, regex, JSON, OAuth, Linux, etc., with stress and common Ukrainian mistakes.
3. **IT slang and jargon (big):**
   - developer and startup slang: ship it, LGTM, nit, bikeshedding, yak shaving, footgun, rubber-ducking,
     dogfooding, bus factor, happy path, spaghetti code, tech debt, "it works on my machine", hotfix, rollback,
     on-call, "prod is down";
   - corporate speak: circle back, sync, align, bandwidth, low-hanging fruit, deep dive, action items, take it
     offline, heads-up;
   - abbreviations: LGTM, WIP, PTAL, TL;DR, IIRC, AFAIK, EOD, EOW, OOO, PTO, ETA, ASAP, FYI, IMO, IMHO, YMMV;
   - Slack/Discord etiquette and emoji-reaction culture (described in words — no Apple emoji in the UI).
4. **Everyday colloquial English and slang in dialogues:**
   - small talk, idioms, phrasal verbs, informal speech, humor and sarcasm cues;
   - US/UK/Australian/Indian English differences;
   - natural conversations at the office, after work, at conferences, on calls.
5. **Talking about a product:**
   - the elevator pitch; describing features and the value they give;
   - user problems and personas;
   - metrics (DAU/MAU, retention, churn, conversion, ARR/MRR, NPS);
   - demos and launch announcements; roadmap and competitors;
   - storytelling; describing **your own projects** (impact, numbers, your role).
6. **Explaining technical things:**
   - architecture walkthroughs, trade-offs, design decisions;
   - explaining to non-technical people; whiteboarding vocabulary;
   - saying numbers, formulas, estimates and code aloud (brackets, operators, complexity — "O of n log n").
7. **Interviews in English — every round:**
   - recruiter screen; "tell me about yourself"; why you're leaving; salary expectations and rates;
   - behavioral (STAR);
   - technical explanations; live-coding think-aloud; system-design talk;
   - questions to ask; handling "I don't know"; asking to repeat or clarify; closing.
8. **Meetings and agile:**
   - stand-ups, planning, refinement, retros, demos, 1:1s;
   - giving and receiving feedback; disagreeing politely; escalating; saying no.
9. **Client communication (outsourcing and freelance):**
   - discovery calls, requirements, estimates;
   - scope changes, delivering bad news, invoices and payments;
   - negotiation, difficult clients, Upwork/Lemon.io/Toptal-style client interviews.
10. **Writing:**
    - Slack messages, emails;
    - PR descriptions, code-review comments (tone), commit messages;
    - READMEs and docs, RFCs and ADRs, incident reports and postmortems, status updates;
    - cover letters, LinkedIn/Upwork profiles and proposals.
11. **Presentations, demos, conferences, networking.**
12. **Listening:** different accents, fast speech, noisy calls, meetings with several speakers; talk/podcast-style
    material.
13. **Pronunciation and fluency:** stress in tech words, linking, intonation for questions and lists; fluency drills.
14. **Workplace culture:** remote etiquette, time zones, politeness strategies, US vs UK vs EU norms, cultural
    pitfalls for Ukrainians.

**Every section** has:
- dialogues (with the register marked formal / neutral / slang);
- phrase banks;
- `[!talk]` role-plays and monologues;
- `[!write]` tasks;
- listening;
- flashcards;
- quizzes.

**Minimum volumes:**
- ≥ 3,000 vocabulary/phrase/slang cards;
- ≥ 300 dialogues;
- ≥ 200 speaking tasks;
- ≥ 120 writing tasks;
- ≥ 150 listening items;
- ≥ 40 full role-play scenarios (recruiter call, client discovery, salary talk, incident call, product demo, stand-up,
  architecture review, conflict).

All English is natural and current; slang is labeled by register and region, with usage notes ("don't say this to a
client").

---

## 5. Live coding — every type, taught to make the learner think

### 5.0 The core of the program: one way of thinking — «Метод Loo»

The course must not be a pile of problems. It must install **one universal way of thinking** that the learner applies
to *any* problem: an interview problem, a work task, a real-life puzzle. Be honest in the content: no single pattern
solves everything. What reliably works is **one method** plus **a pattern map** plus the skill of **recognizing which
pattern fits**. Teach exactly that, explicitly, from the first micro-kata to the last system design.

**The method — 7 steps** (finalize the Ukrainian names and visuals in stage 0; keep the substance):

1. **Зрозумій (Understand).**
   - Restate the task in your own words.
   - Name the inputs, outputs and constraints.
   - Ask clarifying questions.
   - **Read the constraints as hints:** n ≤ 20 → exponential/backtracking is fine; n ≤ 10⁴ → O(n²) may pass;
     n ≤ 10⁵–10⁶ → O(n log n) or O(n); "sorted" → binary search / two pointers; "all subsets / all paths" →
     backtracking / BFS.
2. **Розв'яжи руками (Solve by hand).** Take a tiny example and solve it on paper, noticing **what you actually do**.
   That is the algorithm. Write it down as plain steps.
3. **Наївне рішення (Brute force).** Turn the hand steps into the simplest correct code. State its complexity. A
   correct slow solution beats a fast wrong one, and it is the baseline for optimizing.
4. **Знайди зайву роботу (Find the waste).** Ask, in this order:
   - **B**ottleneck: which part dominates the time?
   - **U**nnecessary work: what do I compute but never need?
   - **D**uplicated work: what do I compute again and again?

   Most optimizations are "remember it instead of recomputing it" or "sort/precompute once".
5. **Обери інструмент (Pick the tool).** Choose the data structure or pattern that removes that waste, using the
   **pattern map**:
   - recognition signals → pattern → why it removes the waste;
   - or **reduce the problem to one you know**: same shape, different story.

   Core questions:
   - "What do I need to know at each step?" — this defines the **state**.
   - "What stays true after each step?" — this is the **invariant**.
6. **Напиши й перевір (Build and verify).**
   - Write the code in small steps (the guided build of §5.2a mirrors this).
   - Keep the invariant in a comment.
   - **Dry-run by hand** on the example.
   - Then test the edge cases: empty, one element, duplicates, negatives, extremes, huge input.
7. **Оціни й поясни (Evaluate and explain).**
   - Time and space complexity.
   - The alternatives and their trade-offs (the variants of §5.2a phase 3).
   - Explain the solution aloud in 60 seconds.
   - Ask: "what if the input were a stream, didn't fit in memory, had to be parallel?"

**The pattern map** — one visual map plus a pattern card for each node (triggers, skeleton code, complexity, classic
bugs, 3 canonical problems):
- hashing / counting;
- two pointers;
- sliding window;
- prefix sums;
- binary search (on the index and on the answer);
- sorting + sweep;
- stack / monotonic stack;
- queue / BFS;
- DFS / recursion;
- backtracking;
- trees;
- heaps / top-K;
- graphs (topological sort, union-find, shortest paths);
- intervals;
- greedy;
- dynamic programming (as "brute-force recursion + memory of repeated states");
- tries;
- bit tricks;
- math;
- design-a-data-structure;
- simulation / parsing.

The map also covers how the **same thinking** appears outside algorithms:
- **SQL:** set thinking — joins, grouping and windows replace loops;
- **JS practical tasks:** state machines, queues, closures for memory;
- **system design:** requirements → estimates → naive design → bottlenecks → building blocks → trade-offs — the
  same 7 steps at another scale.

**How the method is taught:**
- **Explicitly and everywhere.** Every task's tutorial is structured by the 7 steps, so the learner sees the method
  work hundreds of times. The guided build (§5.2a) and the scaffolding ladder (§5.2b) follow these steps.
- **Recognition drills.** Quick, code-free exercises: read a statement → pick the pattern and say why, or name the
  waste in a brute force. Hundreds of them, spaced and interleaved, because recognizing the pattern is the real skill
  in interviews.
- **Spiral from easy to hard:**
  - every pattern goes in its own order: micro-kata → easy → medium → hard → combined patterns
    (e.g. binary search + greedy check, BFS + bitmask state);
  - the prerequisite graph decides order (hashing before sliding window, recursion before backtracking and DP,
    trees before graphs);
  - every few patterns, a mixed set where the pattern is not announced.
- **Transfer tasks** — the same thinking on real-life and work problems: dedupe and group records, parse and
  aggregate logs, merge schedules, rate limiting, autocomplete, diffing two lists, finding the cheapest route, undo
  history. They show that the method is for life, not only for interviews.
- **Meta-skills:** what to do when stuck (go back to step 2 with a smaller example; solve a simpler version; work
  backwards; change the representation; ask "what if it were sorted?"), managing time in an interview, and
  communicating while thinking.
- **Assessment of the method itself.** The readiness score tracks not only solved problems but how well the learner
  follows the method:
  - recognition accuracy;
  - "found the waste" answers;
  - edge cases listed before coding;
  - complexity stated correctly.

### 5.1 Problem types and minimum volumes

| Type | What | Minimum |
|---|---|---|
| **Algorithms & DS** | patterns-first; arrays/strings, hashing, two pointers, sliding window, prefix sums, binary search (incl. on the answer), stacks and monotonic stack, queues/deque, linked lists, trees (DFS/BFS, BST), heaps, graphs (BFS/DFS, topological sort, union-find, Dijkstra, MST), intervals, greedy, backtracking, DP (1D, 2D, knapsack, LIS, string DP, interval DP, bitmask DP), tries, bit manipulation, math, design (LRU, LFU, iterators), complexity analysis | ≥ 450 problems (≈ 120 easy / 250 medium / 80 hard) across ≥ 22 patterns |
| **JS practical** | debounce/throttle, `Promise.all/allSettled/any/race`, promise pool / concurrency limiter, retry with backoff, cancellation with `AbortController`, EventEmitter, deep clone/equal, curry/compose/pipe, memoize with eviction, flatten, polyfills (`map/filter/reduce/bind/call/apply/new/instanceof/Object.create`), `JSON.stringify`, LRU cache, observable, mini Redux, DI container, router, template engine, virtual-DOM diff, scheduler, async queue, rate limiter | ≥ 150 |
| **TypeScript** | type challenges (DeepReadonly, Pick/Omit/Exclude from scratch, UnionToIntersection, path types, template literal parsing, typed event emitter, typed API client, branded types) and "type this function correctly" | ≥ 100 |
| **React / UI machine coding** (30–90 min) | autocomplete with debounce and cache, infinite scroll, accessible modal, tabs/accordion, data table (sort/filter/paginate), form with validation, todo with undo/redo, kanban drag-and-drop, star rating, file upload with progress, nested comments, carousel, tic-tac-toe / game of life, timer, multi-step wizard, virtualized list; custom hooks (`useDebounce`, `useFetch`, `usePrevious`, `useLocalStorage`, `useIntersectionObserver`) | ≥ 60 |
| **Node / backend** | CRUD API with validation and pagination, auth middleware, rate limiter, file streaming, job worker with retries, cache layer, idempotent webhook handler, URL shortener, WebSocket chat, CSV/JSON stream processing | ≥ 60 |
| **SQL** | joins, aggregates, window functions, recursive CTEs, gaps-and-islands, top-N per group, running totals, dedupe, pivots, schema design, query optimization with `EXPLAIN`, isolation-anomaly demos | ≥ 250 |
| **Debugging and code review** | find and fix bugs in given code (async races, closures in loops, stale state, memory leaks, N+1, SQL injection, off-by-one); review a PR and write comments; refactor legacy code | ≥ 80 |
| **Recognition drills** (no code) | read a statement → pick the pattern and say why; name the waste (B/U/D) in a brute force; read constraints → target complexity | ≥ 600 |
| **Transfer tasks** | the same method on real-life and work problems (records, logs, schedules, rate limits, diffs, routes, undo) | ≥ 60 |
| **Predict the output** | event loop ordering, `this`, hoisting, coercion, closures, React render order, Node streams | ≥ 200 |
| **AI-assisted round** | multi-file mini-projects with AI suggestions to verify, fix, test and extend; graded on verification and communication (see §5.4) | ≥ 25 |
| **Take-home projects** | full-stack apps with a brief, a rubric, a reference solution and a review checklist (tests, README, deploy) | ≥ 8 |
| **System design** | backend: URL shortener, rate limiter, news feed, chat, notifications, video streaming, ride-hailing, file sync, web crawler, typeahead, distributed cache, ticketing, payments, leaderboard, metrics, collaborative editing, e-commerce checkout, booking, job scheduler, API gateway, multi-tenant SaaS…; frontend: news feed, autocomplete, design system, offline-first app, chat UI, image editor, canvas/whiteboard, analytics SDK, video player | ≥ 40 backend + ≥ 15 frontend designs |
| **Theory Q&A** | layered answers (§4) across all domains, junior → tech lead | ≥ 3,500 questions |
| **Cybersecurity** | secure code reviews with planted vulnerabilities, threat models on diagrams, sandboxed vulnerable-lab exercises, security Q&A | ≥ 80 reviews + ≥ 20 threat models + ≥ 40 labs + ≥ 300 Q&A |
| **Field question bank** | every question found in public candidate reports (§2a), deduplicated, sourced, frequency-tagged, each linked to a lesson and an exercise | 100% coverage of the bank |
| **Platform simulators** | Toptal-, Lemon.io-, Arc- and Gun.io-style end-to-end loops | ≥ 4 formats × ≥ 3 variants |
| **Tricky questions and interview psychology** | recruiter and interviewer questions with frameworks and sample answers (UA + EN), stress-interview scenarios, negotiation simulations | ≥ 250 questions + ≥ 40 stress scenarios + ≥ 30 negotiations |
| **Behavioral, soft skills and Tech Lead** | questions with story templates, model answers and leadership cases | ≥ 150 |
| **Flashcards** | concepts, APIs, complexities, numbers to know (English cards counted separately in §4a) | ≥ 6,000 |
| **HTML/CSS hands-on** | build and fix markup and layouts checked by DOM/a11y tests (beginner → advanced) | ≥ 150 |
| **Integrations** | Stripe webhooks with idempotency, OAuth flows, presigned uploads, search, realtime, third-party API clients with retries — as guided tasks with tests | ≥ 40 |
| **Capstone projects** | one per part + the final production SaaS with an interview-style defense (§3a) | 11 + 1 |
| **Mock interviews** | full timed loops per company type and per platform (Lemon.io-style, Toptal-style, FAANG-style, outsourcing, startup) | ≥ 30 |

All problem statements, stories and texts are **original** — never copy LeetCode / platform statements verbatim.
Classic problems are rewritten with our own framing, data and tests.

### 5.2 How every coding problem teaches (the "thinking ladder")

Each problem is a guided path, not just a prompt and a test:
1. **Understand:** restate the problem; clarifying questions the candidate should ask (with the interviewer's answers
   revealed on demand).
2. **Examples and edge cases:** the learner lists them first, then compares with ours.
3. **Brute force:** describe it and its complexity.
4. **Optimize:** a hint ladder — hint 1 (direction) → hint 2 (pattern) → hint 3 (key insight). Every hint used is
   recorded and lowers the XP and the "solved independently" signal.
5. **Code:** step by step (guided build), then alone from a blank editor, then in several variants — see §5.2a.
   The runner checks visible examples plus hidden edge/performance tests.
6. **Test and complexity:** the learner states time/space; a quiz checks it.
7. **Explain aloud:** a `[!talk]`/text step — explain the solution in English as in an interview, with useful
   phrases.
8. **Editorial:** a clean solution, why it works, alternatives, a common wrong approach and why it fails.
9. **Follow-ups and variants:** "what if the input streams?", "what if memory is limited?" — linked practice problems.

### 5.2a Learn to write the code step by step, then alone, then in every variant

Every coding task (algorithms, JS/TS practical, SQL, Node, React) is learned in **three phases**. Knowing the idea
is not enough — the learner must be able to *produce* the code.

**Phase 1 — Guided build (tutorial mode).** The solution is built in small, explained steps. Each step:
- says **what to write next and why**, for example:
  - "now finish the function `isValid(left, right)`";
  - "here we use a hash map (`Map`) because we need an O(1) lookup of the complement we've already seen; an array
    scan would make it O(n²)";
  - "add the base case first: an empty input returns `[]`";
- shows the code written so far (locked) with a gap or stub for this step;
- the learner writes **only this step**: a line, an expression, a function body;
- step-level tests check it immediately (the runner runs the partial program against tests scoped to the step);
- the step's solution can be revealed after an attempt; revealing is recorded.

Order the steps the way a strong engineer thinks:
1. function signature and input validation / edge cases;
2. choice of data structure, **with the reason**;
3. main loop or recursion;
4. state updates and invariants (explained in a comment);
5. the return value;
6. running the tests and complexity.

Each step is 1–10 lines; a task usually has 4–8 steps. Reuse the multi-step mechanism from `JavaScript Projects`
("every step is a task"); extend it if per-step tests or locked code are missing.

**Phase 2 — Solve it alone.** Right after the tutorial (and again later via spaced repetition), the learner rewrites
the **same task from a blank editor**. No tutorial text, the same tests (visible + hidden), the hint ladder
available at an XP cost, timed mode optional. Only a solve without revealed steps counts as "can write it".

**Phase 3 — Every reasonable solution, from the longest to the shortest.** The learner implements several variants,
each with its own tests and a complexity question. Order:
- **brute force / most explicit** — long, obvious, easy to verify;
- **intermediate** — e.g. sort + two pointers;
- **optimal** — e.g. one-pass hash map;
- **shortest / idiomatic** — concise modern JS/TS (built-ins, destructuring, `reduce`, `Map`, etc.) while still
  readable.

Example — Two Sum:
1. nested loops, O(n²);
2. sort indices + two pointers, O(n log n);
3. two-pass hash map, O(n);
4. one-pass hash map, O(n);
5. the shortest readable version.

After the variants, a short quiz compares them: time/space, readability, when to show which in an interview ("say
the brute force first, then optimize"), and which one an interviewer may push back on.

Apply the same idea per domain:
- **SQL:** subquery → JOIN → window function → shortest correct query; plus the `EXPLAIN` difference.
- **JS practical:** naive → robust (edge cases, cancellation, errors) → concise version.
- **React:** a working component → extracted hooks → accessible and optimized version.
- **TypeScript types:** a verbose type → a utility-based type → the minimal elegant one.

Where only one sensible solution exists, require at least one alternative **style** (iterative vs recursive,
imperative vs functional).

**Later:** spaced re-solves alternate the required variant ("today: the O(n) version from a blank editor").

**Tracking:** the learner profile stores per task:
- the guided-build result;
- solved alone or not (with or without hints);
- which variants were written;
- the time.

The readiness score counts only independent solves.

**Volumes:**
- every algorithm, JS/TS practical and SQL task gets phase 1 + phase 2;
- ≥ 70% of them get ≥ 3 variants in phase 3 (the rest ≥ 2).

Authors write:
- the step plan with "why" explanations;
- step tests;
- full tests;
- all variant solutions, each verified against the full tests.

Reviewers check that every step explanation is correct and that each variant really has the claimed complexity.

### 5.2b Learning design for someone who has almost never coded or solved problems

Design every task so that a near-beginner can succeed **and actually learn**: write step by step with guidance, learn
the "why" in parallel, then repeat the solution until they can produce it alone. Ground the design in learning
science:
- worked examples before problem solving;
- completion problems and **faded scaffolding**;
- Parsons problems;
- self-explanation;
- retrieval practice, spacing and interleaving;
- mastery gates;
- immediate, misconception-specific feedback.

You decide the exact mechanics within these rules and justify them in the stage-0 blueprint.

**A. The scaffolding ladder (per task).** One task, many levels of support. The learner climbs it; support fades as
competence grows.

| Level | What the learner does | Support |
|---|---|---|
| **L0 Watch** | studies a **worked example**: the solution appears line by line with the "why" of each line and a **visual trace** (a table of variables per iteration, pointers or the window moving over the array, the stack/queue drawn); then answers 2–3 check questions ("why a `Map` and not an array?", "what is `left` after step 3?") | maximum |
| **L1 Arrange** | builds the solution from **shuffled lines** (a Parsons problem) with 1–3 distractor lines (a typical bug: `<=` vs `<`, a wrong update order) | high |
| **L2 Fill** | the guided build from §5.2a: locked code, writes one step at a time, step tests, "why" explanations | medium |
| **L3 Skeleton** | gets only the signature and a **pseudo-code outline in comments** (`// 1. remember seen numbers`, `// 2. for each x look for target − x`) and writes the body | low |
| **L4 Blank** | a blank editor, the same full tests | none (hint ladder at an XP cost) |
| **L5 Variants & speed** | the other solutions from §5.2a phase 3, then timed interview mode with "explain aloud" | none |

**B. Adaptive placement on the ladder:**
- a true beginner starts every new task at L0;
- an experienced learner (per-skill placement) starts at L3 or L4;
- success (all tests, no reveals) moves the learner **up** a level on the next encounter;
- failure or heavy hint use moves them **down** one level, never to the bottom at once;
- a task counts as **mastered** only after an L4 solve on a later day.

**C. Repetition that builds real recall.** After the first success, schedule re-solves (FSRS, roughly 1 → 3 → 7 →
21 days, adjusted by performance). Each re-solve:
- starts **one level higher** than the last success;
- often asks for a different variant;
- comes **interleaved** with other patterns, so the learner must recognize *which* pattern applies (not just apply the
  one the lesson is about).

Failed re-solves drop a level and come back sooner.

**D. Learn the "why" in parallel, not after.**
- Every step carries a short explanation and a **self-explanation prompt** — a one-tap quiz or a one-sentence answer
  ("why does the window shrink here?").
- Every pattern has a **pattern card** for spaced review:
  - recognition triggers ("sorted array + a target pair → two pointers");
  - a code skeleton;
  - the complexity;
  - typical bugs.
- After solving, a 30-second **explain-it-back** — first in Ukrainian, later in English as for an interview.

**E. Feedback that teaches.** Hidden tests are tagged with the **misconception** they catch, so a failure explains
itself:
- off-by-one;
- an empty input;
- duplicates;
- negative numbers;
- integer overflow / big inputs (timeouts → "your solution is O(n²), the limit expects O(n)");
- mutation of the input;
- a forgotten return.

Show the failing case, the expected value, the actual value and a nudge, never the full answer. Log the misconception
to the mistakes notebook and target it in later practice.

**F. Absolute beginners get a ramp before patterns.** Add a short entry course «Код і задачі з нуля» (or reuse
`JavaScript Start` and fill the gaps):
- how to read a problem; inputs and outputs;
- variables, conditions, loops, arrays, objects/maps, functions — each through tiny tasks;
- **tracing code by hand**;
- reading error messages and debugging with `console.log` and the debugger;
- what complexity means, intuitively.

Then **micro-katas** (5–10 lines) before real problems. Patterns start only when the ramp's mastery gate is passed (or
the placement says it isn't needed).

**G. Motivation and load.**
- Small steps, so a near-beginner wins in the first minute.
- One new idea per step.
- Sessions of 10–25 minutes.
- Loo's game layer: XP, streaks; a boss per pattern = a timed mixed set at L4.
- Never show a wall of text: explanation, code and trace sit side by side, and each step fits on a phone screen.

**H. Author once, derive the levels (token economy).** For each task the author writes **one source**:
- the final solution with step markers;
- a "why" comment per step;
- the pseudo-code outline;
- 1–3 distractor lines;
- the misconception-tagged tests;
- the variant solutions.

The compiler **derives** L0 (worked example and trace data), L1 (shuffled lines + distractors), L2 (gapped steps),
L3 (outline-only skeleton) and L4 automatically. Authors never hand-write five versions of the same task. A reviewer
checks that the derived levels read naturally.

Then apply the pedagogy:
- **patterns first:** a pattern lesson → 5–8 graded problems → mixed review across patterns;
- **interleaving** after a pattern is learned;
- **spaced re-solving:** FSRS schedules re-attempts of failed or hinted problems;
- **timed mode** (interview clock) and **untimed learning mode**;
- every failure goes to the mistakes notebook with the reason (bug type, missed edge case, wrong pattern).

### 5.3 Runners (what must execute in the browser)

Audit the existing runner first, then plan:
- **HTML/CSS:** a sandboxed iframe preview with DOM and accessibility tests (structure, semantics, computed layout
  checks); plan it in stage 0.
- **JS/TS:** extend the existing worker. Type challenges are checked with the TypeScript compiler in a worker,
  loaded lazily; measure its size.
- **SQL:** run real PostgreSQL in the browser with **PGlite (WASM)** — already a dev dependency of this repo. Seed each
  problem's schema and data; compare result sets (order-aware where required); `EXPLAIN` tasks read the plan.
- **React UI tasks:** a sandboxed iframe with React and Testing Library and hidden tests. Design it and estimate the
  effort; **stop for approval before building.**
- **Node tasks:** pure-logic modules with mocked I/O in the worker, or a server-side sandbox. Present the options, the
  security implications and the costs; **stop for approval.**
- Server-side grading remains the source of truth for XP. Hidden tests never ship to the client in a readable form.

### 5.4 The AI-assisted round without paying for AI

Simulate it for free. Each task ships with a multi-file mini-project and **pre-written "AI assistant" suggestions**:
some correct, some subtly wrong (security hole, race condition, missing edge case, hallucinated API). The learner
must:
- accept or reject each suggestion;
- write tests that expose the bad ones;
- fix them;
- explain the decisions.

Live AI help (a real model) is a later, paid option — only after the owner approves a cost estimate.

---

## 6. Adaptivity and readiness

- **Placement** per skill (reuse the per-skill placement built for Next.js): the learner gets a profile across the
  skill graph.
- **A plan.** The learner sets a target (company type, level, date); the track builds a weekly plan:
  - gaps first;
  - daily mix: problems + Q&A review + English + one system-design block per few days.
- **Readiness score per domain and per target loop.** Based on:
  - recent performance (solved without hints, within time);
  - Q&A recall;
  - mock-interview scores.

  Show what is blocking "ready" and where the weakest signals are.
- **Mock interview hub:**
  - timed loops that mix rounds;
  - self-scoring against rubrics (later, optionally, AI grading — paid, approval needed);
  - history and trend.
- **Spaced repetition everywhere:** Q&A cards, patterns, problems, slang.

---

## 6a. Perfect mastery: 100 out of 100 before moving on, and the mistakes loop

The owner's rule: **the learner does not move to the next subsection, section or part until every answer is
perfect.** Build this as the default for this track (strict mastery mode).

**Gates at every level:**
- A subsection is complete only when its check is passed at **100%**.
- A section is complete only when **every** subsection is complete **and** the section exam is passed at 100%.
- A part is complete only when every section is complete, the part's boss exam is passed at 100%, **and** its
  capstone meets every rubric item.
- The next unit stays locked until the gate is passed. Parallel streams (English, algorithms, soft skills) have their
  own gates and their own pace.

**100% must mean real mastery, not memorized positions:**
- Every concept has a **pool of variants** (≥ 3 questions or tasks per concept, more for core ones). A retake draws
  different variants, options are shuffled, numbers and data change.
- **Explanations show only after the attempt.**
- A gate passed in one sitting is re-checked later: the spaced review must confirm the concept on another day,
  otherwise the concept reopens.
- **Coding tasks count only when solved independently (L4) without hints.**
- **Open answers** (`[!talk]`, `[!write]`, system design, behavioral) count as perfect only when **every rubric item**
  is met:
  - self-assessment against an explicit checklist;
  - the learner compares with the model answer item by item.

  AI grading is a later, paid option, available only after the owner approves the cost.

**The mistakes loop (as in the existing courses, made stricter):**
1. Every wrong answer, failed test, revealed hint or unmet rubric item goes to «Мої помилки» with:
   - the concept;
   - the misconception type;
   - the source unit;
   - what exactly was wrong.
2. A mistake triggers **remediation**, not just a retry:
   - a short targeted explanation of that misconception;
   - one worked example;
   - then **new variants** of the same concept, not the same item.
3. A mistake is **cleared** only after correct answers on **two different days** (spaced), on variants the learner
   hasn't seen.
4. **All open mistakes of a section must be cleared before its gate can be passed.**
5. A daily «Робота над помилками» session comes first in the daily mix.
6. Mistake analytics: which misconceptions recur, and which topics they point to. They feed the plan and the
   readiness score.

**Keep strictness motivating, not crushing:**
- small units, so a gate is reachable in one session;
- clear progress ("2 of 14 concepts left to perfect");
- unlimited retakes with fresh variants;
- the remediation path always offered;
- XP and Loo's game layer reward fixing mistakes, not just first-try answers.

Show this design in the stage-0 report, with how you prevent gaming (memorizing answer positions or variant sets).

---

## 7. Sub-agents and model assignment

Run as a **lead agent (you)** plus specialized sub-agents. Pass the `model` explicitly when you spawn an agent:
`opus` = Claude Opus 5.5, `sonnet` = Claude Sonnet 5.5, `haiku` = Claude Haiku 5.5.

| Role | Model | Owns |
|---|---|---|
| **Lead / architect** (you) | Opus | plan, skill graph, track design, shared contracts, briefs, integration, final review, reports |
| **Market and interview researcher** | Opus | company and platform processes, question patterns, 2026 trends, the "reported" source log |
| **Syllabus designer per course** | Opus | the course outline: sections → topics → goals → exercise mix and counts; skill mapping |
| **Platform engineer** | Opus for design; Sonnet for implementation | track concept, readiness, runners (TS checker, PGlite SQL), hint ladder, timed and mock modes; isolated worktree |
| **Algorithm problem author** | Opus for hard problems and editorials with proofs; Sonnet for easy and medium | statements, the thinking ladder, the guided-build step plan with "why" explanations and step tests (§5.2a), full tests (visible + hidden), all variant solutions (longest → shortest), editorials |
| **Test-suite hardener** | Sonnet | adversarial hidden tests, performance cases; proves a wrong or slow solution fails |
| **JS/TS / React / Node / SQL task author** | Sonnet | practical tasks with tests and editorials |
| **Theory and Q&A writer** | Sonnet (Opus for staff-level, distributed-systems and architecture topics) | chapters and layered answers |
| **System design author** | Opus | designs with estimates, diagrams (`[!diagram]`), trade-offs, rubrics |
| **English and slang author** | Sonnet | phrase banks, dialogues, slang cards, speaking tasks |
| **Behavioral and career author** | Sonnet | questions, story templates, negotiation scripts |
| **Reviewer / fact-checker** (never the author) | Opus | technical accuracy, solution correctness, test quality, senior-level depth, Ukrainian quality |
| **Mechanical worker** | Haiku | format conversion, id registry, counts, dedupe scans, link checks, flashcards generated from structured data, lint of content files |
| **QA** | Sonnet | full checks, browser pass through runners and modes, regression on existing courses |

**Orchestration rules:**
- **Contract first, then fan out.** Before writing at scale, the lead publishes:
  - the style guide;
  - **one finished model unit per content type** (a pattern lesson with 5 problems, a JS practical task, a SQL
    problem, a system design, a Q&A topic, a slang lesson);
  - the glossary;
  - the id scheme (`fs-<course>-<topic>-<n>`) and the skill tags.

  Briefs link to these; they never restate them.
- **One owner per file.** Shared files (track and course manifests, syllabus, glossary, id registry, skill graph)
  belong to the lead. Sub-agents propose edits in their reports.
- **Code in isolated worktrees**; merged by the lead after review and tests.
- **Self-contained short briefs:** goal, owned files, the inputs to read (paths only), volumes, definition of done,
  what not to touch.
- **Reports, not dumps:** files changed, counts, what was verified, open questions.
- **Parallelism:** 3–5 author pairs at once on independent courses or patterns. Order of dependencies:
  research → platform → authoring → review → QA.
- **Review gate:** nothing is done until a different agent has reviewed it and the author has fixed the issues.
  Every algorithm solution is executed against its tests; every SQL answer runs in PGlite; every code example runs.
- **Token economy:**
  - Haiku for mechanical work;
  - structured data plus code-generated exercises where quality allows (flashcards, complexity drills, slang cards);
  - reuse the JS / Next.js / English courses instead of rewriting;
  - summarize research once and share the notes.

---

## 8. Quality rules

- **Correctness above all:**
  - every solution passes its tests — including every variant in phase 3 and every guided step's tests;
  - every hidden test suite rejects at least one plausible wrong solution and one too-slow solution (prove it);
  - complexity claims are checked;
  - facts about companies are sourced and dated.
- **Depth:** Q&A answers must hold up under follow-ups from a senior interviewer. Every topic includes trade-offs
  and "how it works under the hood".
- **Originality:** our own statements, stories, data and texts; list sources for the theory.
- **Language:**
  - explanations in Ukrainian, natural and concise;
  - established English terms stay in Latin;
  - interview phrases and slang in English with Ukrainian meanings and usage notes;
  - the English course's rules for natural English apply.
- **Format:** Loo blocks only, stable ids (never change existing ones), skill tags on everything.
- **Design:** pixel icons (`px:`), no Apple emoji, Onest.
- **Security:** hidden tests and answer keys are server-side only; runners are sandboxed.
- **i18n:** follow the content-i18n architecture from the Next.js work (language-independent ids, segment hashes,
  glossary) so the track can later be translated to English and other languages.
- **Money:** nothing paid (model APIs inside the product, external services) without the owner's explicit "yes" and
  a cost estimate. Never use API keys from other projects. Never create accounts — ask the owner.

---

## 9. Storage and performance

The track adds a lot of content. Before stage 2, check the per-course storage plan: one snapshot per course, loaded
lazily; later, per-topic chunks with prerendered HTML in object storage (Cloudflare R2), and answer keys kept
server-side.
- If it is not done yet, **raise it in the stage-0 report as a blocker** and propose doing it first.
- Every course of the track must compile to its own bundle and load only when used.
- Measure the build time, bundle sizes and server memory per course in every report.

---

## 10. Stages (STOP and report after each)

**Stage 0 — Research and blueprint (no course content):**
- read §1 completely; check the status of the branches and courses;
- market and process research (§2), with the dated "reported" source log, including:
  - current tricky recruiter and interviewer questions, and what they test (by region and company type);
  - stress-interview practices;
  - security interview formats and the current OWASP versions;
  - the field question bank (§2a) with sources, dates and frequency, plus the coverage plan;
- write `docs/FULLSTACK_TRACK.md`:
  - track and course list;
  - the skill graph with levels;
  - the per-company / per-platform loop maps;
  - every course outline (sections → topics → goals → exercise mix and counts);
  - the problem catalog plan per pattern and type;
  - the runner plan (§5.3) with sizes and risks;
  - the readiness model;
- the retention system and the Knowledge Atlas design (§3a);
- the English for IT program outline (§4a);
  - the agent and model plan per stage;
  - the storage impact;
- **STOP.**

**Stage 1 — Platform:**
- the track concept; readiness score; hint ladder; timed mode; mock-interview mode;
- guided multi-step tasks (§5.2a): locked code with gaps, per-step tests, reveal tracking, the blank-editor re-solve,
  and multiple variant solutions per task with their own tests;
- the scaffolding ladder (§5.2b):
  - one task source compiled into L0 worked example with a visual trace, L1 Parsons, L2 gapped steps, L3 skeleton,
    L4 blank;
  - adaptive level per learner and task, mastery gates, re-solves one level higher;
  - misconception-tagged tests with teaching feedback;
  - pattern cards;
- the TS type-check runner; the PGlite SQL runner;
- the "explain aloud" step (reuse `[!talk]` if present);
- strict mastery mode (§6a): 100% gates per subsection/section/part, variant pools, re-check on another day,
  remediation flows, the stricter mistakes loop, the daily «Робота над помилками»;
- «Метод Loo» (§5.0): the 7-step method as a reusable tutorial structure, the visual pattern map and pattern cards,
  recognition-drill exercises, method-adherence signals in the readiness score;
- model units for every content type; style guide; glossary; id registry;
- tests; existing courses unchanged;
- **STOP.**

**Stages 2…N — Content, part by part along the spine (§3)** (each a batch with a review gate; **STOP after each**):
1. Part I (Фундамент, incl. the ramp) + the Interview Playbook from Part XI + the first modules of the parallel
   streams: English for IT §4a sections 1–3, soft skills basics, the first algorithm patterns.
2. Part II (Веб: HTML, CSS, TypeScript, Browser; JS via the existing module + its interview layer).
3. Part III (Frontend: React, Next.js module integration, state, testing, performance) — the UI runner needs
   approval first.
4. Part IV (Backend: Node, APIs, auth and security, SQL/PostgreSQL, NoSQL/Redis, queues and caching).
5. Part V (Integrations).
6. Part VI (Algorithms in several batches, live coding, architecture, testing, Git).
7. Part VII (Networking/OS, DevOps and cloud, observability, distributed systems, cybersecurity, system design).
8. Part VIII (AI and LLM + the AI-assisted round).
9. Part IX (Soft skills, behavioral, interview psychology and tricky questions, Tech Lead, career). The tricky
   recruiter questions also go into batch 1 together with the Interview Playbook, so they can be practised early.
10. Part X (the rest of English for IT).
11. Part XI (mock arena, readiness calibration on synthetic profiles junior/middle/senior/tech lead, the final exam
    «Великий бос», the final capstone defense), then polish.

The parallel streams (algorithms, English, soft skills) get new modules in every batch, so the daily mix always has
them.

**After every stage, run:**
- `pnpm typecheck`;
- `pnpm lint` (changed files);
- `pnpm test`;
- `pnpm content:check`;
- `pnpm course:check`;
- `pnpm course:build`;
- `pnpm diagram:check` / `pnpm i18n:check` where they exist;
- every task's tests against its reference solution **and** against known-wrong solutions;
- a browser pass through the new runners and modes.

Then commit **locally on `feature/fullstack-zero-to-pro`, no push** (push only after the owner accepts the stage).

**Report to the owner in Ukrainian:**
- what was done, with numbers (problems by type and difficulty, Q&A by domain, flashcards, designs, mock loops);
- bundle sizes and memory;
- what was deferred, risks;
- what you need from the owner.

---

## Start with stage 0.
