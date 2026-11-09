# Interview loop maps — by company type and by vetted platform

> **Коротко українською.** Карти співбесід для симуляторів (Part XI). Аутсорс/аутстаф (зокрема Україна): рекрутер →
> технічна співбесіда (глибока теорія + практика, інколи 3 години) → перевірка англійської → інтерв'ю з клієнтом (для
> аутстафу майже завжди) → офер; від кількох днів до 1–1,5 місяця. Продукт: скринінг → практичне кодування → system
> design → behavioral/цінності, тестові дедалі частіше замінюють живою співбесідою через ШІ. FAANG: OA/скринінг → 4–5
> раундів онсайту (у Meta один раунд з ШІ, у Google пілот з Gemini) → комітет/бар-рейзер → рівень. Платформи: Toptal
> (англ. → Codility 3 задачі/90 хв → лайв 2 задачі + пояснити свої рішення → тест-проєкт 1–3 тижні; 26,4%→7,4%→3,6%→3,2%→3%),
> Lemon.io (профіль → ШІ-асистент і рекрутер 20 хв → 15-хв квіз → техінтерв'ю: досвід, теорія, практика з код-рев'ю; 1,2%),
> Arc (профіль ~55% → відео/комунікація 14% → 1 год техінтерв'ю 2%), Gun.io, Turing, Proxify, Andela — нижче. Відсотки —
> самозвітність платформ або оцінки третіх сторін.

Researched 2026-11-08. Every process changes over time; each row is dated. "Reported" = from candidates or third parties.

---

## A. By company type

### A1. Outsourcing / outstaffing (incl. the Ukrainian market)

| Stage | Format and timing | What it grades | Evidence |
|---|---|---|---|
| 1. Recruiter call | 20–40 min, often in Ukrainian; salary, notice period, English self-check, motivation ("Why are you leaving?", "What must we offer for you to accept?") | fit, expectations, red flags | [DOU — interview in English (2022-10-21)](https://dou.ua/lenta/articles/it-interview-in-english/) |
| 2. Technical interview | 1–3 h with a senior/lead; theory deep-dive across the stack (the DOU 255/300+/400+ lists are built from such interviews) + practical questions or small live tasks; one GlobalLogic review reports a 3-hour technical interview | depth of theory, projects, reasoning, red flags such as gaps in JS fundamentals | [DOU Node 255 (2023-07-31)](https://dou.ua/lenta/articles/interview-node-js/); [DOU GlobalLogic reviews (2025)](https://jobs.dou.ua/companies/globallogic/reviews/); [DOU Senior Node (2024-09-26)](https://dou.ua/lenta/articles/senior-node-js-developer-skills-2024/) |
| 3. English check | separate step or inside the tech interview; examiners role-play the client, check comprehension, clarification, tenses (Intellias example) | spoken English with a client | [DOU — English tips](https://dou.ua/lenta/articles/english-dou-live/) |
| 4. Test task (sometimes) | Ciklum: 60-min technical test; ZONE3000: test tasks for ~80% of vacancies (2026), AI allowed; others dropped take-homes | delivery, code quality, ability to defend AI-assisted work | [DOU (2026-11-06)](https://dou.ua/lenta/articles/developer-test-tasks-ai/) |
| 5. Client interview | for outstaff "100%" per forum consensus; in English, often with a short technical part | communication, domain fit, client's own tech bar | [DOU forum](https://dou.ua/forums/topic/21725/); [DOU — client interview](https://dou.ua/lenta/articles/successful-interview-with-client/) |
| 6. Offer | typical end-to-end: a few days to 1–1.5 months; FRACTAL average 40 days | — | [DOU — hiring 2026 (2026-01-13)](https://dou.ua/lenta/articles/everything-about-hiring-2026/) |

Prep emphasis: wide theory Q&A by level (the field bank's DOU rows), a project story in English, client small talk.

### A2. Product companies (incl. Ukrainian product companies)

| Stage | Format | What it grades | Evidence |
|---|---|---|---|
| Recruiter screen | 30 min | motivation, level, comp band | general |
| Live coding | practical or algorithmic, 45–60 min; increasingly **instead of** take-homes (Universe, Uklon) | problem solving, communication | [DOU (2026-11-06)](https://dou.ua/lenta/articles/developer-test-tasks-ai/) |
| Specialised rounds (examples) | **Stripe**: coding, Bug Bash (unfamiliar codebase, 3–5 planted bugs, 45–60 min), Integration (real API work: retries, rate limits, idempotency), system design, behavioral — 4–5 rounds; AI reportedly not allowed in Bug Bash/Integration. **Atlassian** full-stack: coding in own IDE (any FE framework), "Fullstack Craft" conversation (breadth/depth, walk through a project), system design (rate limiter; design Confluence/Trello), values, management. **Canva**: AI-assisted coding replaces CS fundamentals. **DoorDash**: 60-min AI working session on own machine | debugging unfamiliar code, integration hygiene, breadth, AI fluency | [techinterview.org — Stripe (2026)](https://www.techinterview.org/post/3233460268/stripe-interview-guide-2026-process-bug-bash-round-and-payment-systems/); [Blind — Atlassian (2022-08-31)](https://www.teamblind.com/post/atlassian-full-stack-onsite-interview-bcywt38r); [Canva blog](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/); [DoorDash via daily.dev](https://daily.dev/posts/why-doordash-is-rebuilding-its-engineering-interviews-around-ai-7molfavfy) |
| System design | backend and/or frontend, 45–60 min | requirements, numbers, trade-offs | aggregated lists, see field bank |
| Behavioral / values | 45 min, company values | ownership, conflict, impact | general |
| Take-home (sometimes) | shrinking because of AI; where kept, followed by a defence call | defend decisions | DOU above |

### A3. FAANG-style

| Company | Loop (reported unless official) | Notes | Evidence |
|---|---|---|---|
| Meta | recruiter → phone screen → onsite: one 45-min classic coding round (no AI, run disabled), one **60-min AI-enabled** round (CoderPad, multi-file, tests runnable, staged levels), 45-min system/product design, 45-min behavioral | AI round: fix failing tests, extend (maze solver with portals/keys, card game, in-memory DB with TTL); practice sandbox link available from recruiter | [aicodinginterview — Meta](https://aicodinginterview.com/interviews/meta/); [interviewing.io](https://interviewing.io/blog/how-to-use-ai-in-meta-s-ai-assisted-coding-interview-with-real-prompts-and-examples) |
| Google | recruiter → 1–2 technical screens → 4–5 onsite interviews (coding, FE-specific for FE roles, system design, Googleyness) → hiring committee; pilot since May 2026, wider rollout reported Oct 2026 but **still pilot-phase per Google**: **code comprehension with Gemini** (60 min, unfamiliar codebase, fix/extend/optimise) | graded: prompting, output validation, debugging; the classic coding round still bans AI | [ByteHerald (2026-10)](https://www.byteherald.com/2026/10/google-changed-coding-interview-ai-is.html); [spacecomplexity — Google FE](https://spacecomplexity.ai/blog/google-frontend-engineer-interview) |
| Amazon | OA (2026 reports: embedded AI assistant, repo bug-fix) → phone screen → loop of ~5 one-hour interviews, each with assigned Leadership Principles, incl. a bar raiser → decision (official for Security Engineer: 1–2 × 60-min screens, five 60-min loop interviews, outcome within 5 business days) | GenAI behavioral question appeared 16× in Aug–Oct 2026 reports; "how do you verify AI-written code" follow-up | [amazon.jobs — security engineer prep](https://amazon.jobs/content/en/how-we-hire/security-engineer-interview-prep); [1point3acres (2026 Q4)](https://www.1point3acres.com/interview/guides/amazon-interview-trend-2026q4) |
| Common tail | hiring committee / bar raiser → leveling → offer and negotiation | level decides band more than title | — |

### A4. Startups

Thinner public evidence. Reported patterns: fast loops (often 2–3 conversations), practical pairing or a paid/real ticket
(HN: "a paid-for ticket to solve from their real codebase", [2017](https://news.ycombinator.com/item?id=13707185)),
take-homes with a defence, product sense and ownership talk, and broad scope ("be the engineer, PM, designer and mini-CEO
of your area", plus recorded 2–4 minute video answers in applications —
[dev.to, 2026-08-28](https://dev.to/ale3oula/what-two-months-of-interviewing-taught-me-about-the-2026-tech-job-market-3d8n)).
In Ukraine, DOU shows startups paying senior TS/Node the most (n = 59) and senior medians falling −$400 in H1 2026.

---

## B. By vetted platform

Acceptance rates are **self-reported by the platforms** unless marked; none are independently audited.

### Toptal

| Stage | Format / timing | Pass rate (official, share of all applicants) | What it grades |
|---|---|---|---|
| 1. Language & personality | English + communication interview, personality traits (passion, engagement); some members report the order changed | **26.4%** | English, communication, attitude |
| 2. In-depth skill review | timed **Codility**: reported 3 problems / 90 min (since 2015; a 2025 account says 100 min with ≥210/300 to pass), roughly LeetCode-medium; one report: 3 exercises / 180 min | **7.4%** | correctness, edge cases, performance |
| 3. Live screening | screen-share with a domain screener; reported: explain your Codility solutions, then 1–2 more problems (~15–20 min each; one FE report: 15 min); example: count cyclic primes ≤ N (sieve) | **3.6%** | problem solving under observation, explaining own code |
| 4. Test project | 1–3 weeks (official); reported ~2 weeks, 20–25 h or ~40 h of effort; reviewed with a demo call | **3.2%** | completeness, tests, professionalism |
| 5. Continued excellence | performance on client work | **3%** | — |

Total 3–8 weeks (official). Glassdoor: 25% positive, difficulty 2.71/5. Sources:
[toptal.com/top-3-percent](https://www.toptal.com/top-3-percent) (fetched 2026-11-08);
[calibrd](https://www.calibrd.com/interview-prep/toptal-interview);
[HN 2016-01-08](https://news.ycombinator.com/item?id=10864657); [HN 2020-07-16](https://news.ycombinator.com/item?id=23857508);
[Glassdoor Toptal](https://www.glassdoor.com.au/Interview/Toptal-Interview-Questions-E882070.htm).

### Lemon.io

| Stage | Format / timing | Pass rate | What it grades |
|---|---|---|---|
| 1. Profile & experience review | CV, LinkedIn, portfolio, identity check; "only senior developers with proven commercial experience advance"; full-stack page: 3+ years commercial full-stack, 5+ for "senior", Upper-Intermediate English | — | seniority evidence |
| 2. Soft skills & English | AI assistant ("Mark") audio pre-screen ≤ 20 min (opt-out possible) → live 20-min recruiter call; role-play, pressure, ambiguity, client expectations; older reports: 1-minute recorded intro video, rejections for accent (2023, 2026 reports) | ~10.6% (third party) | English, communication, client handling |
| 3. Technical pre-screening | 15-min role-specific quiz, multiple-choice + open questions; recruiters can override | — | stack basics |
| 4. Technical interview | senior engineer/CTO from the community: small talk → experience dive (legacy, performance, teamwork) → theory ("non-Googleable", e.g. behaviour under 100× load) → practice: system design, live coding, **code review of the interviewer's code**, smelly-code debugging, AI-tools fluency; peer cross-reviewed; written feedback | "~17%" shown on Lemon's page; 3.1% of applicants (third party) | architectural reasoning, practical skill |
| Outcome | **1.2%** of applicants accepted; ~5 business days; reported 12-month reapply ban | | |

Seed check: "5+ years" — partly confirmed (5+ is Lemon's "senior" label; minimum is 3+ commercial full-stack years on the
current page). "Recruiter (sometimes a bot)" — confirmed (AI assistant). Sources:
[docs.lemon.io](https://docs.lemon.io/vetting-developers); [Lemon.io full-stack page](https://lemon.io/for-developers/full-stack-developer-jobs/);
[Glassdoor Lemon.io](https://www.glassdoor.com/Interview/Lemon-io-Interview-Questions-E4522943.htm); [Toolradar](https://toolradar.com/tools/lemon-io).

### Arc.dev

| Stage | Format | Pass rate | What it grades |
|---|---|---|---|
| 1. Profile screening | skills, training, experience | ~55% (third party) | relevance |
| 2. Communication assessment | live interview or **video self-introduction**; small talk, explaining technical concepts simply, remote readiness | **14%** (official) | English, clarity, remote habits |
| 3. Technical interview | 1-hour expert interview or pair programming; broad ("from language internals to Internet implementation", "What is DNS?") + a small coding task (Fibonacci reported repeatedly) + JS core (closures, hoisting) | **2%** (official) | breadth, depth in the domain |
| 4. Final review | then ongoing monitoring | 2.3% overall (official) | — |

Sources: [arc.dev/how-arc-works](https://arc.dev/how-arc-works); [secondtalent](https://www.secondtalent.com/alternatives/arc-dev-vs-toptal/);
[Glassdoor Arc (review 2023-08)](https://www.glassdoor.com/Interview/Arc-Interview-Questions-E3622767.htm).

### Gun.io

| Stage | Format | Evidence |
|---|---|---|
| Group / profile call | one call presenting your profile to up to ~10 other developers and two Gun.io employees (reported); profile completion | [Glassdoor Gun.io](https://www.glassdoor.com/Interview/Gun-io-Interview-Questions-E1998976.htm) |
| Coding test | **Codility** (2018 report: split message into ≤K-char whole-word fragments; hidden tests fail edge cases) | Glassdoor (2018-11) |
| Technical interview(s) | senior engineer / technical lead; topics reported: DDD, CQRS, design patterns, system design, PostgreSQL optimisation, caching, "Where do you store private keys?" | Glassdoor |
| Character / fit review | executive or CEO/COO round on culture fit and past experience | Glassdoor; [Flexiple](https://flexiple.com/reviews/gunio) |

Acceptance: **no official figure**; third parties say ~10% (most) or ~3.5% (weak source). The seed's "~3.5–10%" is
therefore an unverified range. Hiring ~13 days on average (third party).

### Turing

| Stage | Format | Evidence |
|---|---|---|
| Classic (official blog) | resume/profile → work-experience survey (MCQ) → tech-stack MCQ tests → live coding challenge; 3–6 h of tests in total | [Turing blog](https://www.turing.com/blog/turing-developer-test-preparation-tips) |
| 2026 per-project vetting (reported) | ~25-min AI interview → resume review → take-home due in 24/48 h, timed analytical/writing/language tests → two ~75-min technical rounds for coding roles; timers keep running if you disconnect | [aitraining.jobs (read 2026-10-10)](https://aitraining.jobs/platforms/turing/how-to-apply) |
| Live round (reported) | 2 medium problems in ~30 min, or 90 min mixing DSA and an **LLM response evaluation** task | [Glassdoor Turing](https://www.glassdoor.com/Interview/Turing-com-Interview-Questions-E2462330.htm) |

Claimed acceptance < 2% (third-party restatement). Glassdoor: 49.5% positive, 3.05/5.

### Proxify

| Stage | Format | Evidence |
|---|---|---|
| Official | five stages: AI-powered screening, English and technical assessments, soft-skills interview, live technical interview with senior engineers (pair programming, walkthroughs, code quality) | [proxify.io](https://proxify.io/hire-developers) |
| Reported | MCQ React test → 3-hour Codility test (fix a broken app, build tabs, lazy-load images) → technical interview revisiting submitted code; some interviews run by a third party (Karat); 11 days average (215 interviews) | [Glassdoor Proxify](https://www.glassdoor.com/Interview/Proxify-Interview-Questions-E4090194.htm) |

Acceptance: "around 1%" on most pages, "1–2%" in the knowledge base, "2–3%" on an older page — all self-reported.

### Andela

| Stage | Format | Evidence |
|---|---|---|
| Official (page updated Jul 2026) | the Andela assessment (several coding challenges on Qualified, explain your reasoning) → live technical interview; human review of every application | [Tecla](https://www.tecla.io/blog/andela-review); [Andela newsroom](https://www.andela.com/newsroom/unlocking-top-tech-talent-with-advanced-assessment-technology-and-humans) |
| Reported | English test (audio recording), coding test on camera, live interview (React core, RTL); first challenge often on HackerRank; live coding without IDE/debugger; ≥4 years experience for one FE role | [Glassdoor Andela](https://www.glassdoor.com/Interview/Andela-Software-Developer-Interview-Questions-EI_IE882830.0,6_KO7,25.htm) |

Acceptance: ~0.5% (independent estimate quoted by Tecla).

---

## C. What this means for the simulators (≥ 4 formats × ≥ 3 variants)

| Simulator | Stages to reproduce | Variants (minimum 3) |
|---|---|---|
| Toptal-style | English/personality call → 90-min, 3-problem timed test (easy/medium/hard, hidden tests) → live: explain your own test solutions + 2 × 20-min problems with a silent observer → mini test project with demo | (1) algorithmic JS; (2) React-feature variant (3 features in 60 min); (3) data-processing variant (parse/interpret JSON) |
| Lemon.io-style | 1-min recorded intro + AI-recruiter questions → 15-min stack quiz → tech interview: experience dive → theory "non-Googleable" → review the interviewer's smelly code → small system design | (1) Node/backend; (2) React/Next; (3) full-stack boundaries (auth, data fetching) |
| Arc-style | video self-intro graded on clarity → 1-h interview: breadth questions (DNS, internals, how the Internet works) + small coding task + domain deep dive | (1) breadth-first; (2) pair-programming; (3) domain deep-dive (Node or React) |
| Gun.io-style | group profile pitch → Codility task with hidden edge cases → technical talk on DDD/CQRS/patterns + DB tuning → fit round | (1) string/greedy task; (2) PostgreSQL + caching; (3) architecture (DDD/CQRS) |
| Extra (optional) | Turing (MCQ + 2 problems + LLM-output evaluation), Proxify (3-h test + defence), Andela (filter-table React task, no IDE), outsourcing (theory marathon + client interview in English), Meta/Google AI rounds | — |

Grading dimensions to reuse across simulators: correctness, edge cases, time, explanation of own code, verification of AI
output (when allowed), English clarity, composure under silence/pushback.
