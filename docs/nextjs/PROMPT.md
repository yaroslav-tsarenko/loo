# Task: build the course "Next.js Zero → Pro" for Loo — from zero to professional

You work in the **Loo** repository (GitHub: `yaroslav-tsarenko/loo`; the local checkout may still live in a folder
named `interview-preparation-2-0` — use the repo root you are in). Loo (playloo.app) is a gamified learning platform:
short lessons, exercises with instant checks, streaks, leagues, boss exams, levels and ranks. It already ships two
official courses: **JavaScript Zero → Pro** and **English A1 → C2**.

Build the third official course: **Next.js Zero → Pro**. A graduate must be able to **professionally** build,
optimize, test, secure and deploy production applications with Next.js (App Router), pass a Middle/Senior interview
and make architectural decisions.

The course must **detect the learner's skills automatically** and pick lessons for their level: a beginner starts
from zero; an experienced developer skips what they know and gets their weak spots first.

**Learner-facing content is written in Ukrainian** (like the rest of Loo). This prompt is in English for you and your
sub-agents. The content architecture must make later translation to other languages easy (section 7).

Work in **stages**. After each stage: checks → report → **STOP** and wait for the owner's decision. Never start
the next stage on your own.

---

## 1. Scale: at least as detailed as the JavaScript course

The course must be **as deep as the JS course**: full long-form article chapters with explanations, examples,
diagrams and pitfalls — not short notes. Reference (measured 2026-10-30):

| JS course | Volume |
|---|---|
| Guides | `JavaScript Start` (11 articles, ≈ 38k words), `JavaScript` (35 chapters, ≈ 195k words — ≈ 5.5k words per chapter), `JavaScript Katas` (10, ≈ 53k), `JavaScript Projects` (9, ≈ 98k), `JS Interview Q&A` (14, ≈ 73k) |
| Total theory | ≈ 457k words in 79 articles |
| Exercises | 1,759: 787 flashcards, 295 coding tasks with autotests, 521 quizzes (output 147, single 113, multi 110, fill 79, order 72), 156 interview questions |

The existing `content/Guides/Next.js` is only ≈ 32k words — 14× thinner. **Target for Next.js: no less than the JS
course** — ≈ 400–500k words of theory, chapters of 4–8k words, ≥ 1,700 exercises in similar proportions, and the same
guide structure:
- `Next.js Start`;
- `Next.js` (main guide, chapters grouped by skill);
- `Next.js Katas`;
- `Next.js Projects`;
- `Next.js Interview Q&A`.

Reach the volume through depth: how things work under the hood, real cases, trade-offs, debugging. Never pad.

---

## 2. Study the project thoroughly first (mandatory, before any code or content)

Read and understand how everything works. This decides whether the course feels native to Loo.

**Documentation (`docs/`):**
- `ARCHITECTURE.md` — app structure, layers, data.
- `COURSE_FORMAT.md` — the course format: `course.yaml`, sections, topics, exercises, levels, exams, placement,
  validation, author checklist. **The key document for this task.**
- `LEARNING_PLAYBOOK.md` — our teaching method: lesson structure, micro-steps, spaced review.
- `LANGUAGE_COURSE.md` — how adaptivity works in the English course, so you can carry the ideas over:
  - per-skill levels;
  - placement test;
  - exercise difficulty;
  - selection by weak spots (`src/course/select/*`);
  - skip ahead / review.
- `ROADMAP.md`, `DESIGN.md` (pixel style, no Apple emoji, Onest text), `SECURITY.md`, `PERFORMANCE.md`,
  `ECONOMY.md` (XP, currency, bosses), `BATTLES.md`, `ANALYTICS.md`, `BLOG.md`.

**Code you must understand:**
- Course and bundle schema:
  - `src/course/schema/bundle.ts` — `ExerciseKindSchema`, `LEARNER_SKILLS`, `PLACEMENT_SKILLS`, levels;
  - the compiler `scripts/course-build.ts`, `scripts/course-check.ts`;
  - everything under `src/course/**`.
- Content:
  - markdown and block parsers — `src/content/parse/*`, `src/content/blocks/*`: `[!quiz]`, `[!flashcard]`, `[!task]`
    (code with autotests), `[!interview]`, `[!diagram]`, `[!viz]`, callouts;
  - rendering — `src/content/render/*`, `src/ui/markdown/*`.
- Selection and progress:
  - `src/course/select/*` — adaptive selection, skills, levels;
  - `src/progress/*` — FSRS, streaks, XP;
  - the mistakes notebook.
- Coding tasks: how `[!task]` runs — the in-browser runner (`src/app/runner/*`, worker) and test checks. Find out
  exactly what it can and cannot execute.
- **The reference programming course** — JavaScript:
  - the manifest `content/courses/javascript-noob-to-god/course.yaml`: levels `noob → god`, sections with `from:`
    guides, `exams`, `placement`, `practice`, `theory`;
  - the guides `content/Guides/JavaScript Start`, `JavaScript`, `JavaScript Katas`, `JavaScript Projects`,
    `JS Interview Q&A`.

  Read several topics end to end: how theory is written, which exercises, how many, how Katas and Projects are built.
- Existing Next.js material: `content/Guides/Next.js/` — **61 theory chapters with almost no exercises**, several
  duplicated:
  - 06/41 data fetching;
  - 08/58 caching;
  - 16/57 Proxy (Middleware);
  - 19/53 environment variables;
  - 07/20/54 mutations, forms, Server Actions.

  `content/Guides/React/` also exists. Treat all of it as raw material: check freshness, merge duplicates, expand. Do
  not copy blindly.

**Where content lives and how it is built:**
- Source of truth: the Obsidian vault `/Users/yaroslav/Documents/Obsidian Vault/`:
  - `Guides/<Guide>/` — theory and exercises;
  - `Courses/<id>/course.yaml` — the manifest.
- Sync and build:
  - `pnpm content:sync` copies into `content/`;
  - `pnpm course:build` compiles to `content/courses/<id>.json`;
  - `pnpm content:snapshot` writes the snapshot.
- Checks: `pnpm content:check`, `pnpm course:check`, `pnpm diagram:check`.
- Verify the vault is still the source of truth and exactly how sync works. Do not break the other courses.

**Next.js version.** The project itself runs **Next.js 16** (App Router, Turbopack, React Compiler, `proxy.ts`). The
course teaches **current** Next.js 16+ and React 19+:
- Cache Components, `use cache`, `cacheLife` / `cacheTag` / `updateTag`, PPR;
- Server Actions, `useActionState`, `useOptimistic`, `use`;
- `proxy.ts` instead of middleware;
- async `params` / `searchParams` / `cookies()` / `headers()`.

Verify against the official docs and the docs bundled with the package in `node_modules/next` (check whether they
exist). **Do not rely on memory:** Next.js APIs changed a lot between 13, 14, 15 and 16. Teach outdated approaches
(Pages Router, `getServerSideProps`, old middleware, `unstable_cache`) only in the migration chapter, as
"before → now".

---

## 3. Sources — analyze as many as possible and recast them into our own course

Cover as many sources as you can, build a map of what a professional knows, and miss nothing important. **Write the
texts yourself** in Ukrainian (never copy or translate verbatim). End every topic with a «Джерела» block linking the
primary sources.

**Official (source of truth):**
- Next.js Docs — the whole App Router:
  - Getting Started, Guides, API Reference (components, file conventions, functions, config, CLI);
  - Architecture;
  - upgrade guides 13 → 14 → 15 → 16;
  - release blog posts (Next.js 13–16, Conf).
- Next.js Learn (the official course); the `vercel/next.js` repo (examples, RFCs and discussions on caching and PPR).
- React Docs (react.dev):
  - Server Components, Server Functions/Actions, directives;
  - hooks (`use`, `useActionState`, `useOptimistic`, `useTransition`, `useFormStatus`);
  - Suspense, React Compiler, rules of hooks.
- Vercel Docs: Functions and Fluid Compute, caching and CDN, ISR, Edge, Runtime Cache, environment variables,
  Observability, Speed Insights / Web Analytics, Cron, Blob, Firewall / BotID, Rolling Releases.
- TypeScript Handbook (typing props, generics, `satisfies`); Node.js docs (runtime, streams, env).

**Web platform and quality:**
- web.dev: Core Web Vitals (LCP, INP, CLS), rendering, images, fonts.
- MDN: HTTP caching, cookies, CORS, CSP, Fetch, Streams, History API.
- OWASP Top 10 and OWASP Cheat Sheets: XSS, CSRF, SSRF, authn/authz, secrets.
- WCAG 2.2 (accessibility); Google Search Central (SEO, structured data, sitemaps).

**Ecosystem (what professionals use every day):**
- Styling: Tailwind CSS v4, shadcn/ui, CSS Modules.
- Data and validation: Drizzle ORM, Prisma, Zod, TanStack Query (where still relevant), SWR.
- Auth: Auth.js, Better Auth, Supabase SSR, Clerk (ideas).
- Payments: Stripe (webhooks).
- Testing: Vitest, Testing Library, Playwright, MSW.
- Monitoring: Sentry, OpenTelemetry.
- Infrastructure: Docker and self-hosting, Turborepo and monorepos, feature flags.
- AI: Vercel AI SDK (streaming, AI features inside an app).

**Practitioners (for depth and pitfalls — ideas, not texts):**
- posts and talks from the Next.js / Vercel team (Lee Robinson, Delba de Oliveira and others), Next.js Conf;
- patterns.dev; Josh W. Comeau (React, CSS); Kent C. Dodds (testing, React patterns);
- Dan Abramov / overreacted (the RSC mental model);
- write-ups of real production problems: caching, waterfalls, hydration, bundle size, memory leaks.

Record the source list in `docs/NEXTJS_SYLLABUS.md`: what was taken from which source and which chapters it covers.

---

## 4. What a graduate can do (skill map)

Split the course into **skills** — the automatic level detection is built on them. Proposal (refine after research):

| Skill | Covers |
|---|---|
| `routing` | file-based routing, layouts, templates, route groups, dynamic/catch-all, parallel and intercepting routes, navigation, `Link`, prefetching, redirects, `proxy.ts` |
| `rendering` | Server/Client Components and the boundary, RSC payload, static/dynamic rendering, Streaming and Suspense, PPR, hydration and its errors, `loading` / `error` / `not-found` |
| `data` | server-side data fetching, waterfalls and parallelism, Cache Components (`use cache`, `cacheLife`, `cacheTag`), revalidation (`revalidateTag` / `updateTag` / `revalidatePath`), ISR, Route Handlers, databases/ORMs |
| `mutations` | Server Actions and forms, `useActionState`, `useOptimistic`, validation (Zod), progressive enhancement, error handling, file uploads |
| `auth-security` | sessions and cookies, authentication and authorization, securing Server Actions and Route Handlers, CSP, `server-only`, taint, secrets, OWASP |
| `ui` | styling (Tailwind / CSS Modules), `next/image`, `next/font`, metadata and OG, SEO, JSON-LD, i18n, accessibility, View Transitions |
| `performance` | Core Web Vitals, bundle analysis, lazy loading, `next/dynamic`, shrinking client JS, React Compiler, profiling, memory |
| `testing` | unit/component tests, testing Server Actions and Route Handlers, Playwright e2e, MSW, CI |
| `deploy-ops` | Vercel (Functions, Fluid, CDN, env, cron, preview), self-hosting and Docker, `output: standalone`, instrumentation, OpenTelemetry, logging, error monitoring |
| `architecture` | structuring large projects, monorepos, multi-zones, module boundaries, data patterns, feature flags, migrations (Pages → App Router, version upgrades), trade-offs |

Levels — as in the JS course: `noob → junior → middle → senior → god` (or justify different ones).

---

## 5. Automatic skill detection and level-based lesson selection

Today, per-skill levels exist only in the language course (`LEARNER_SKILLS`, `src/course/select/skills.ts`,
`ielts.ts`). Programming courses have only a general placement test (`placement: { maxQuestions: 20, perLevel: 3 }`).

**Make skills course data, not a constant:**
- `course.yaml` → `skills: [{ id, title, description }]`;
- every topic and exercise carries a skill tag;
- **the language course must behave exactly as before** (move the constants into data without changing behavior;
  add tests that prove it).

Then:

1. **Per-skill placement:**
   - a bank of ≥ 6 questions per (skill × level) pair;
   - adaptive: start in the middle, move up/down by answers;
   - result: a level per skill plus an overall level;
   - the test can be skipped ("I'm a beginner") and retaken;
   - mixed question types: concepts, "what renders where", "find the bug", "what happens to the cache",
     reading code.
2. **Lesson selection:**
   - topics below the skill level are marked "known" (open them, or take the topic test to confirm);
   - the path starts at the first uncovered topic;
   - weak skills get priority in "recommended";
   - exercises are picked at level ± 1 and by weak spots (as in English).
3. **The level updates** from topic tests, section exams and mistakes; skip-ahead / review on the map.
4. **A skill profile in the UI:** radar or bars per skill, "next step" — as in the language course (`SkillLevels`).
5. Unit tests for the algorithm, and tests proving the English course did not change behavior.

---

## 6. Course structure (a proposal — refine after source research)

Sections modeled on the JS course (`sections` with `from:` guides). Roughly:

1. **Before you start:**
   - the React and TypeScript minimum for Next.js (components, props, state, effects, types);
   - how the web works (HTTP, HTML/CSS, the browser). Test-out for those who know it.
2. **Start from zero:** `create-next-app`, structure, pages and layouts, navigation, styles, first deploy.
3. **Routing:** dynamic, groups, parallel, intercepting, Route Handlers, `proxy.ts`, redirects.
4. **Rendering and RSC:** server/client components, the `'use client'` boundary, serialization, Suspense,
   streaming, static/dynamic, PPR, hydration.
5. **Data and caching:** fetch and databases on the server, parallel requests, Cache Components, revalidation, ISR,
   cache models (client router cache, CDN, data cache), common traps.
6. **Mutations and forms:** Server Actions, validation, optimistic UI, files, errors, progressive enhancement.
7. **Auth and security:** sessions, roles, data protection, CSP, Server Action security, secrets.
8. **UI, SEO and accessibility:** images, fonts, metadata, OG, sitemap/robots, JSON-LD, i18n, a11y, View Transitions.
9. **Performance:** Core Web Vitals, bundle, lazy loading, prefetching, React Compiler, profiling, memory.
10. **Testing:** Vitest, Testing Library, Playwright, MSW, CI.
11. **Deploy and operations:** Vercel, self-hosting/Docker, environment variables, instrumentation, OpenTelemetry,
    logging, monitoring, rolling releases.
12. **Architecture and scale:** structuring large apps, monorepos, multi-zones, module boundaries, feature flags,
    migrating from the Pages Router, version upgrades.
13. **Livecoding (Katas):** tasks with autotests.
14. **Projects** (step by step, every step is a task):
    - a blog with MDX;
    - an online store (cart, Stripe payments in test mode, webhooks);
    - a SaaS dashboard (auth, roles, multi-tenancy, billing);
    - a realtime chat;
    - an AI app with streaming;
    - a documentation site with search.

    Every project ends with a production checklist.
15. **Interview:** a question bank Junior → Lead (`kind: practice`, like `JS Interview Q&A`).

**Minimum volumes (JS-course level; more is better if it stays good):**
- ≈ 400–500k words of theory;
- the main `Next.js` guide — ≥ 40 chapters of 4–8k words;
- `Next.js Start` — ≥ 10 beginner articles;
- ≥ 1,700 exercises:
  - ≥ 750 flashcards;
  - ≥ 300 coding tasks with autotests (Katas + in-topic tasks + project steps);
  - ≥ 500 quizzes of all modes (output, single, multi, fill, order);
  - ≥ 350 interview questions;
- 6 projects;
- a test for every topic and an exam for every section;
- a per-skill placement bank.

**Coding tasks when full Next.js cannot run in the browser.** First find out what the `[!task]` runner can do, then
design task types honestly:
- **pure functions and utilities with tests:**
  - `generateMetadata`, `generateStaticParams`;
  - a route matcher, `searchParams` parsing;
  - Zod schemas and Server Action validation as functions;
  - cache keys and `cacheLife` profiles as data;
  - `next.config.ts` configs as objects under test;
  - `proxy.ts` logic on mock requests;
- **"predict the result":** what runs on the server vs the client, what gets cached, when it revalidates, the
  streaming order;
- **"find and fix the bug":** server code leaking into the client, a waterfall, a hydration error, an unprotected
  Server Action, a cache entry holding user data;
- **"order the steps"**, diagrams (`[!diagram]`) and visualizations (`[!viz]`): the request lifecycle, the RSC flow,
  the cache layers;
- **projects:** step-by-step tasks with tests on utilities, plus checklists.

If real Next.js tasks need new infrastructure (e.g. a mocked Next environment in a worker, or a server-side runner),
**describe the options and their cost, then stop — do not build it without the owner's approval.**

---

## 7. Content internationalization (i18n) — design it into the architecture now

The course is written in Ukrainian, but **the architecture must let us translate any course easily** (English and
other languages) without restructuring and without losing learner progress. First study how UI language works today
(`src/i18n/*`, `language: uk` in `course.yaml`) and any language fields in content. Then design content i18n, document
it in `docs/COURSE_FORMAT.md` (a new section), and implement the foundation in stage 1.

**Requirements:**
1. **Identity is language-independent:**
   - course, section, topic and exercise ids are Latin and identical in every language;
   - progress, SRS, mistakes and skills hang on ids, so a learner who switches language loses nothing;
   - titles and URL slugs are localized fields, not identifiers.
2. **Source and translations:**
   - `course.yaml`: `sourceLanguage: uk`, `languages: [uk]`, localized `title` / `subtitle` / `description` (a map
     language → text, or a separate translation file for the manifest);
   - an article translation is a parallel file (e.g. `Guides/Next.js/_i18n/en/<same file>.md`, or justify a better
     layout);
   - the translation contains the same blocks with the same `id`s.
3. **Segment-level translation with staleness detection.** Every translated block/paragraph stores the hash of the
   source segment it was translated from. A `pnpm i18n:check` script reports:
   - untranslated segments;
   - stale segments (the source changed);
   - structure mismatches (different set of blocks or ids).
4. **What gets translated and what doesn't:**
   - translated: prose, hints, explanations, answer options, code comments;
   - not translated: identifiers in code, APIs, commands, autotests;
   - test messages and error texts become translatable strings;
   - no text baked into images: diagrams are `[!diagram]` with text labels; SVGs use translatable labels.
5. **A term glossary** per language pair (`content/glossary/uk-en.yaml` or similar) so terms are translated
   consistently, plus a "keep in Latin" list.
6. **Build and display:**
   - the compiler builds one bundle per language (or one bundle with localized fields — choose and justify);
   - the app shows a course in the user's UI language;
   - a missing translation falls back to the source language for that block, with a marker;
   - course and article SEO pages are ready for `hreflang` and localized URLs.
7. **Proof that it works.** In stage 1, translate one Next.js topic into English (manually, as a test), build it, show
   it in the app with an English UI. Verify progress is shared and that `i18n:check` catches a stale segment after
   the source changes. Add tests.
8. Existing courses (JS, English) move to the new scheme **with no behavior change** and no id changes.

---

## 8. Agent orchestration — split the work well

This is a large job. Run it as a **lead agent (you) plus specialized sub-agents**. Your job as lead: plan, write
precise briefs, own shared decisions and files, integrate, review, run the checks and report. Sub-agents do focused
work in parallel.

**Roles (spawn as needed per stage; reuse an agent for follow-ups instead of starting fresh):**

| Role | Model | Owns | Typical stage |
|---|---|---|---|
| **Researcher** (one per 2–3 skills) | `opus` | source analysis for its skills → a knowledge map: concepts, current APIs (verified against Next.js 16 docs), pitfalls, interview angles, source links. Writes `research/<skill>.md` notes, no course content | 0 |
| **Platform engineer** | `opus` | per-skill levels as course data, per-skill placement, lesson selection, skill profile UI, content i18n foundation, tests. Works in an **isolated git worktree** | 1 |
| **Chapter writer** (one per topic) | `opus` | the **prose** of its topic: 🎯…🔬 (incl. 🏭), ⚠️, 🎤 `[!interview]`, 🔗, `[!diagram]`, 📚, Підсумок; runs every code example in a scratch Next.js 16 app; leaves the exercise sections as marked stubs | 2…N |
| **Exercise author** (one per topic, runs **after** its writer) | `sonnet` | in the writer's file, only inside the stub sections: 🤔 pre-test, ⚡ `[!reel]`, 🧠 quizzes, cards, 🛠️ `[!task]` with tests; skill tags and difficulty; selfTest for every task + one wrong solution | 2…N |
| **Kata / project author** | `sonnet` (`opus` for project design / system-design steps) | `[!task]` coding tasks with autotests, Katas, project steps; proves every test passes and fails on a wrong solution | 2…N, late |
| **Placement-bank author** | `sonnet` | ≥ 6 questions per (skill × level) for the batch's skills in `_placement/<level>.md` | each batch |
| **Reviewer / fact-checker** (fresh agent, never the author) | `opus` | technical accuracy against current docs, reproduces the 2–3 most surprising claims, code runs, Ukrainian quality and terminology, format compliance, duplicates across sections. Returns a list of issues, does not rewrite | after each batch |
| **Fixer** | prose issues → the **original writer** (`SendMessage`, same `opus` agent, keeps context); exercise issues → the original exercise author (`sonnet`) | applies the reviewer's list in its own file only | after review |
| **Mechanical checker** | `haiku` | word counts, exercise counts by type/mode, id scheme and uniqueness, frontmatter fields, wiki-link targets, `content:check` / `course:check` / `diagram:check` runs → a table, no edits | after writers, after fixes |
| **QA** | `sonnet` | runs the full checks, opens the course in the browser (placement, several topics, a coding task), reports breakages | end of each stage |

**Model rules.**
- `opus` — anything where a mistake is expensive and hard to notice: research, theory, fact-checking, design decisions.
- `sonnet` — structured authoring against a finished text and a clear spec: exercises, tasks with tests, placement
  questions, fixes from a list, browser QA.
- `haiku` — mechanical, verifiable work with a fixed output format: counting, format and id checks, running scripts
  and tabulating results. Never writes learner-facing text.
- The lead stays on the strongest model and does integration, shared files and the spot-read.
- Always pass `model:` explicitly when spawning; don't rely on inheritance.

**Per-topic pipeline (each topic is one lane; lanes run in parallel, 5–7 at a time):**
`writer (opus) → exercise author (sonnet) → mechanical check (haiku) → reviewer (opus, fresh, may cover 2–3 topics) →
fixes (writer / author via SendMessage) → mechanical re-check (haiku) → lead spot-read + integration`.
A section's exam and placement questions are written once all its topics passed review.

**Rules that keep agents from colliding and wasting tokens:**
- **One owner per file.** Assign each chapter file, guide folder and code module to exactly one agent per stage.
  Shared files (`course.yaml`, `docs/NEXTJS_SYLLABUS.md`, the glossary, the style guide, the id registry) are owned by
  the lead. Sub-agents propose changes to them in their report; only the lead edits them.
- **Code changes in isolated worktrees** (platform work, runner changes); the lead merges after review and tests.
  Content agents write only inside their own guide files.
- **Shared contract first, then fan out.** Before any writing stage, the lead publishes:
  - the style guide (tone, chapter template, exercise mix per chapter, minimum lengths);
  - one fully finished **model chapter** with its exercises as the reference;
  - the glossary;
  - the id scheme (`nextjs-<section>-<topic>-<n>`);
  - the skill tags;
  - the source list.

  Every brief links to these files instead of repeating them.
- **Briefs are self-contained and short.** Each brief states:
  - the goal;
  - the exact files the agent owns;
  - inputs to read (by path; only what it needs);
  - target volumes;
  - the definition of done (format checks pass, examples executed, report format);
  - what not to touch.

  Sub-agents do not re-read the whole repo.
- **Reports, not dumps.** Sub-agents return a short structured report:
  - files changed;
  - counts (words, exercises by type, tasks);
  - examples verified;
  - open questions;
  - proposed edits to shared files.

  No pasted file contents.
- **Parallelism with limits.** Run independent sections in parallel (e.g. 3–5 writer+author pairs at once).
  Dependencies go in order:
  - research before writing;
  - the platform before placement banks;
  - writers before reviewers.
- **Review gate.** No batch is "done" until a separate reviewer agent has checked it and the author has fixed the
  issues. The lead spot-reads at least one chapter per batch in full.
- **Stable ids.** Agents never change an existing id. The lead keeps an id registry and a map for merged duplicates.
- **Token economy:**
  - prefer data + code-generated exercises where quality allows (flashcards and API-reference drills from structured
    term lists);
  - reuse the existing Next.js guide as raw material;
  - avoid re-reading large files; summarize research once and share the notes;
  - choose the cheapest capable model for mechanical work (format conversion, counting, checks) and the strongest
    for research, writing and review.

---

## 9. Quality rules

- **Theory** in Ukrainian, short and to the point:
  - the "why" comes first;
  - then a minimal example, a realistic example, pitfalls, and "how it's done in production";
  - diagrams for flows (request, render, cache).
- **Code** is modern, working TypeScript with Ukrainian comments. **Every example is verified** on the Next.js
  version used in this repo, in a scratch app (`create-next-app` under `/tmp`) or by tests. No unverified code in the
  course.
- **Exercises** test understanding, not memorized names:
  - "what happens if…";
  - "which caching option is right here and why";
  - an explanation on every wrong answer.
- **Terminology** follows the JS course (check its texts): established English terms stay in Latin, explained on
  first use.
- **Stable exercise ids** (`nextjs-<section>-<topic>-<n>`): progress and SRS depend on them. Never change existing ids
  in `content/Guides/Next.js`; when merging duplicates, record an old → new id map.
- **Design** (`docs/DESIGN.md`): pixel icons (`px:`), no Apple emoji, Onest. Course icon `si:SiNextdotjs`.
- **Security** (`docs/SECURITY.md`): no secrets in content; auth examples are secure by default.
- **Money:** nothing paid (AI generation through APIs, external services) without the owner's explicit "yes" and a
  cost estimate. Never use API keys from other projects.
- **Accounts:** never create accounts or keys; ask the owner.

---

## 10. Stages (STOP and report after each)

**Stage 0 — Analysis and plan (no course content yet):**
- read everything in section 2; researchers analyze the sources in section 3;
- audit the existing `content/Guides/Next.js` and `React`: what is current, what is outdated, duplicates, gaps;
- write `docs/NEXTJS_SYLLABUS.md`:
  - the skill and level map;
  - the full course structure (sections → topics → each topic's goals → exercise types and counts);
  - the source list with coverage;
  - the coding-task plan (what the runner can really check);
  - the migration map for existing chapters;
- the technical plan for per-skill detection in programming courses (files, data migrations, tests);
- the technical plan for content i18n (section 7): file layout, segment hashes, glossary, build, display, migrating
  existing courses;
- the agent plan for the next stages: roles, file ownership, parallel batches, review gates;
- **STOP.**

**Stage 1 — Platform:**
- skills as course data;
- per-skill placement for programming courses;
- level-based lesson selection;
- the skill profile in the UI;
- the content i18n foundation (section 7) with the English proof topic and `pnpm i18n:check`;
- the `nextjs-zero-to-pro` manifest (`course.yaml`) with stub sections;
- the style guide, the model chapter, the glossary and the id registry;
- tests; the English and JS courses behave exactly as before;
- **STOP.**

**Stages 2…N — Content, section by section:**
- batches of 2–3 sections: theory, exercises, flashcards, topic tests, the section exam, placement questions for
  their skills;
- after each batch: review gate, checks, browser pass, **STOP**.

**Second-to-last stage — Livecoding, projects, interview.** **STOP.**

**Final stage — Polish:**
- calibrate placement (runs on synthetic profiles: beginner, junior, senior);
- check every link and example;
- the course cover and description for the catalog;
- **STOP.**

**After every stage, run:**
- `pnpm typecheck`;
- `pnpm lint` (changed files);
- `pnpm test`;
- `pnpm content:check`;
- `pnpm course:check`;
- `pnpm course:build`;
- `pnpm diagram:check` (if diagrams changed);
- `pnpm i18n:check` (once it exists);
- a manual browser pass: dev server, placement, several topics, a coding task.

Then commit **locally, no push** (push to `main` only after the owner accepts the stage).

**Report to the owner in Ukrainian:**
- what was done, with numbers (words, topics, exercises by type, flashcards, tasks, placement questions per skill);
- what was deliberately deferred;
- risks;
- what you need from the owner.

---

---

## 11. Where we are (resume point — updated 2026-10-30)

Work lives on branch `feature/nextjs-course` (worktree `../loo-nextjs` next to the main checkout; `main` has
unrelated uncommitted work — don't touch it). **Content source of truth for this course is `content/` in the repo**:
run scripts with `VAULT_PATH=content`, never `content:sync` for Next.js (the local Obsidian vault holds only the old
guide and would overwrite the new one). Scratch app: `/tmp/nextjs-scratch-base` (16.3.8, react 19.3.0,
`cacheComponents: true`); each agent clones it with `cp -cR` to `/tmp/nextjs-scratch-<topic id>`.

Done: stage 0 (syllabus, research), stage 1 (skills as data, per-skill placement, i18n foundation + English topic 07,
contract docs), **stage 2**: Start S01–S12, routing 01–06, rendering 07–13 — reviewed and active; placement bank 104
questions for foundations / routing / rendering.

Stage 3 wave A (`data` 14–20) is done, reviewed, active and pushed (2026-10-31): 7 topics, 87 lessons, 229 exercises incl.
25 tasks, +35 placement questions for `data`. Findings in `docs/nextjs/stage3-notes.md`.

Next: **stage 3 wave B** — `mutations` 21–25 + `auth-security` 26–30. Each wave:
pipeline from §8 → section exam + placement questions for the wave's skills → checks → browser pass → local commit →
**STOP** and report.

## Start with the next unfinished step from §11.
