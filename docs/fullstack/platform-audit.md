# Full-Stack Zero → Pro: platform audit (stage 0)

Author: platform engineer (design). Date: 2026-11-08. Worktree `../loo-fullstack`, branch `feature/fullstack-zero-to-pro`
at `d9e017e` (= `origin/main`). Scope: the prompt `docs/prompts/fullstack-course.md` §1, §3, §3a, §5.2a, §5.2b,
§5.3, §5.4, §6, §6a, §8, §9.

This file states facts first. Every fact was checked by reading code or running a script. Measurement scripts live
outside the repo (`/tmp/loo-audit/*.mts`). Nothing in `src/` or `content/` was changed. Effort scale: **S** ≤ 2 days,
**M** 3–7 days, **L** 1.5–3 weeks of one implementer, including tests and docs.

---

## 0. Summary

**Blockers (must be solved before content goes in at scale):**
1. **Content storage is not per-course.** One snapshot of every guide is loaded into every server instance. Measured:
   **134 MB of retained V8 heap** on cold load (4 courses, 17 guides, 17,822 units). This is already 2.7× the
   "≈ 50 MB at 2 courses" figure in the prompt. The track adds ~2× the current volume. §9 makes this a blocker.
2. **Task grading is client-trusted.** `finishTask({ solved })` takes the browser's verdict as given
   (`src/server/actions/study.ts:50-66`; documented as I4 in `docs/SECURITY.md:213`). All tests and the reference
   solution are sent to the client. "Hidden tests never ship to the client" (§5.3, §8) does not hold yet.
3. **Mastery model is per-item and lenient.** Gates are advisory, pass marks are 80%, mistakes are cleared by
   answering the *same* item twice, and only flashcards are spaced. §6a (100% gates, concept variant pools, spaced
   re-check, misconception-tagged mistakes) needs new data and logic, not new settings.

**Key numbers:**

| What | Value |
|---|---|
| Server heap, prebuilt snapshot after cold load | **133.7 MB** retained, loads in 480 ms (v8 deserialize + brotli) |
| Snapshot on disk | 10.9 MB brotli / 79.7 MB v8-serialized (docs/PERFORMANCE.md:201 still says 3.5 MB) |
| Full vault parse (no snapshot) | 13.3 s, 17 guides, 746 chapters, 17,822 units (quiz 9,101 · flashcard 8,336 · task 385) |
| Largest snapshot shares | English 29.8 MB · Deutsch 14.4 · Next.js 6.5 · JavaScript 5.7 · JS Q&A 4.4 (serialized) |
| Course bundles `content/courses/*.json` | 7.7 MB total: English 4.08 MB · Deutsch 2.26 · JS 0.88 · Next.js 0.50 (all loaded at boot) |
| Runner | JS and TS (types stripped by sucrase, **never checked**), 3 s per run, 1.5 s per async test, a fresh worker each run |
| TypeScript checker (lazy) | `typescript.js` 9.1 MB raw → 3.6 MB minified → **1.02 MB gzip / 0.80 MB brotli**; ES lib `.d.ts` ≈ 52 KB gzip |
| PGlite 0.5.10 (devDependency) | wasm 10.5 MB (2.89 MB br) + data 6.2 MB (1.06 MB br) + JS 1.9 MB (0.28 MB gz) ≈ **4.2 MB compressed download**; Node init 1.16 s, seed 1,000 rows + window query + `EXPLAIN (FORMAT JSON)` in 12 ms |

---

## 1. What is on `main` and what is still on branches

**Current state (`git fetch` on 2026-11-08):**

| Branch | vs `origin/main` | Status |
|---|---|---|
| `feature/nextjs-course` (`6de2e63`, worktree `../loo-nextjs`) | 0 ahead, 25 behind | **Fully merged.** The platform work is on main: skills as course data, per-skill placement, content i18n. Its content is partly active (stage 3 wave A: data 14–20). |
| `feature/german-course` (`61976d8`, worktree `../loo-german`) | **2 ahead**, 8 behind | Mostly merged (PR #2, `5b62682`). Not on main: 2 commits, *B2 active (29 topics)* and *Deutschland B1 active (14 chapters)*. These are 54 files, +21,270 lines, content and review notes only. No platform code. |
| `dev-illia` | — | Not relevant here. |

Next.js platform pieces on main, used by this track:
- `SkillDefSchema`, `courseSkills`, `skillModelOf`: `src/course/schema/skills.ts:21-96`.
- Per-skill placement: `placement.perSkill` / `placement.skills` in `src/course/schema/bundle.ts:173-176`, algorithm
  in `src/course/select/placement.ts` (740 lines). COURSE_FORMAT §5.7 reports simulated accuracy: per skill ±1
  level 97–99%.
- "Known" topics by skill level: `src/course/select/path.ts`.
- Content i18n: `_i18n/<lang>/` files, segment hashes and `.lock.json`, strict or lenient code-fence comparison,
  glossary. Code in `src/content/i18n/*`, docs in `docs/COURSE_FORMAT.md` §10. Bundle-level texts in
  `src/course/schema/i18n.ts`.
- Agent pipeline docs: `docs/nextjs/{PROMPT,STYLE,BRIEF-*,ids}.md`.

**The `docs/prompts/nextjs-course.md` file:** not tracked on main or on any branch (`git log --all` finds nothing). It
exists only as an *untracked* file in the owner's checkout `~/Projects/interview-preparation-2-0/docs/prompts/` (488
lines). The tracked version is `docs/nextjs/PROMPT.md` (526 lines). The two differ: the tracked one has the role
table and model rules. `docs/prompts/fullstack-course.md` is untracked in this worktree as well.

**Uncommitted work in the owner's checkout. NOT on main and on no branch** (`~/Projects/interview-preparation-2-0`,
read-only inspection):

| File | State |
|---|---|
| `src/content/blocks/talk/definition.ts` (102 lines, new) | Parser for `[!talk]` |
| `src/content/blocks/write/definition.ts` (100 lines, new) | Parser for `[!write]` |
| `src/content/blocks/lang/production.ts` (520 lines, new) | Pure, AI-free checker: `checkWriting`, `checkTalk`, `PASS_SCORE = 60` |
| `src/content/model.ts` (+55 lines) | `WriteSpec`, `TalkSpec`, `WRITE_TYPES`, `TALK_MODES`; `QuizMode` gains `'write' \| 'talk'` |
| `src/content/blocks/registry.ts` (+4) | Registers both blocks |
| `src/server/services/filter-options.ts` (+2) | Labels «Письмо», «Говоріння» |

What the blocks look like:
- **`[!write]`** (a quiz unit, `mode: 'write'`):
  - meta line: `level · type (message|postcard|email|story|review|opinion|essay|article|report|letter-gt|ielts-task1|ielts-task2) · words: 100-150 · time: 20 · id`;
  - `must:` lists required structures; alternatives are separated by `|`, and word forms are matched (go → went);
  - `check:` lines form the self-assessment checklist;
  - the body is the task, and a ```` ```model ```` fence holds the model answer;
  - the server-side checker scores length, paragraphs, `must` items, linking words by level, repeats, sentence
    length and mechanics, each 0–100.
- **`[!talk]`** (`mode: 'talk'`):
  - modes: `part1 | cue | part3 | role`;
  - fields: `q:` (spoken by TTS), `topic:` + `point:` (IELTS cue card), `situation:` (Ukrainian), `prep`, `time`,
    `useful:` phrases, `min-words`, a ```` ```model ```` answer;
  - the browser recognises speech (or the learner types); `checkTalk` scores length, pace, useful phrases, fillers
    and lexical variety;
  - IELTS-style self-assessment follows.

**How complete:** the parsers, types and pure checker are done. Missing:
- the server action: the code comment cites `src/server/actions/production.ts`, which does not exist;
- the UI: no `.tsx` references `TalkSpec`/`WriteSpec`;
- unit tests;
- docs: `docs/LANGUAGE_COURSE.md` has no «Письмо й говоріння» section;
- compiler handling. On main, `isTestable` is `kind === 'quiz' && mode !== 'speak'` (`src/course/compile/compile.ts:67`),
  so these units would **leak into topic tests, exams and placement** unless the rule excludes `write`/`talk` too.
  `exerciseKind` (`compile.ts:59-63`) would also classify them as `quiz`.

**Gaps vs prompt:**
- Interview-English (`[!talk]` for "explain your architecture in English", explain-it-back) depends on this
  unmerged work.
- The German B2 content is not on main. That is irrelevant to this track.

**Proposal:**
1. Ask the owner to land `[!talk]`/`[!write]` on main first (finish the action, UI and the `isTestable` fix), then
   reuse them.
2. Add one new talk mode later, for an interview answer: a question, a rubric checklist and a model answer.

Effort: owner-side M; our extension S. Risk: building on uncommitted code, and merge conflicts in `model.ts`/`registry.ts`.

---

## 2. Course package and compiler

**Current state:**
- Package: `<vault>/Courses/<id>/course.yaml` (here `content/courses/<id>/course.yaml`, `VAULT_PATH=content`). Its
  `sections[].from:` points into the shared `Guides/`, so one guide can serve many courses without copies
  (`docs/COURSE_FORMAT.md` §1). This is how the track can reuse JS and Next.js.
- Pipeline:
  1. `scripts/course-build.ts`: `listOfficialCourses` → `loadCourseSource` (parses the vault) → `checkCourse`
     (compile + validate) → `CourseBundleSchema.safeParse` → `content/courses/<id>.json`.
  2. `scripts/course-check.ts`: the same, plus a summary and a self-test of every auto-tested task (the reference
     must pass, the starter should fail) via `scripts/lib/task-check.ts` (a Node `worker_threads`, the same
     `runSuite`, 3 s timeout).
- Bundle (`src/course/schema/bundle.ts`):
  - `ExerciseKindSchema = quiz | flashcard | interview | task | word | listen | speak | pair` (line 16);
  - levels: the `it` ladder `noob…god` or `cefr` `A1…C2` (`src/course/schema/level.ts:9-18`); legacy
    `techlead → god`;
  - `ExerciseRef` carries `level, difficulty (easy|medium|hard), skill?, autoTested, minutes, tags` (lines 27-47);
  - the bundle holds *structure and references only*; exercise bodies stay in the content store (line 10).
- Skills: optional per course, a flat list (`SkillDefSchema`: id, title, description, icon). Topics carry `skill:`
  and exercises inherit it. JS course: **no skills** (`skills: 0` in its bundle). Next.js: 11 skills, a placement
  bank of 139 items, `perSkill: true`.
- Prerequisites: the chapter model has `prerequisites` (`src/content/model.ts:91`), but **`TopicSchema` does not
  carry them** (`bundle.ts:103-126`). There is no prerequisite graph in the bundle.
- i18n: course texts in `bundle.i18n`; topic translations as `_i18n` files with locks (see §1).
- **A "track" concept exists only as a static roadmap list.** `src/content/tracks.ts` (45 lines) holds a hard-coded
  `TRACKS` array: id, guides, `after` list, and a `stage` of foundations/frontend/backend/…. It names *guides*, not
  courses. It has no manifest, progress, skill graph or readiness. The name collides with the planned concept.

**Gaps vs prompt (§3, §3a, §6):**
- no track manifest of parts → courses with roles;
- no shared skill graph across courses;
- no prerequisite or "used in" edges in compiled data (needed for the atlas and for "що ти вже знаєш");
- no tags on exercises for concept or misconception;
- no level tag `tech lead` separate from `god` (fine: `god` is labelled Principal; map `techlead → god` and document
  it).

**Proposed design:**
1. **Manifest** `content/tracks/fullstack-zero-to-pro/track.yaml`:
   - `parts[]` (id, title, order, `boss`, `capstone`), each with `courses[]: { id, role: core|module|prerequisite|elective, sections?: [...] }`;
   - `streams[]` for the parallel tracks (algorithms, English, soft skills);
   - `skills:` the shared graph, with nodes `{ id, title, part, requires: [...] }` and `courseSkills:` mapping
     `<course>:<skill>` onto track skills.
2. **Compilation:** `pnpm track:build` → `content/tracks/<id>.json` (`TrackBundleSchema` in
   `src/course/schema/track.ts`). The schema references course bundles by id@version. It never inlines them.
3. **Naming:** rename the existing roadmap type to `RoadmapTrack`, or name the new one `Program`, to avoid two
   "track" meanings in code.
4. **Bundle additions (backwards compatible, all optional):**
   - `TopicSchema.prerequisites: string[]` (topic ids) and `usedIn` (computed);
   - `ExerciseRef.concept?: string` (variant pools, §6a);
   - `ExerciseRef.variantOf?` and `ExerciseRef.ladder?` for derived task levels (§4).
5. **JS course retrofit:** add `skills:` to `javascript-noob-to-god` (topics get `skill:`; ids stay stable), so the
   track can place per skill. This is non-breaking: the field is optional and the JS course works without it today.
6. **New track courses:** declare `sourceLanguage: uk, languages: [uk]` and use the existing i18n machinery
   (language-independent ids, segment hashes). Nothing new is needed.

Effort: manifest + schema + build L (the shared skill graph and readiness come later, §5); JS skills retrofit S–M.
Risks:
- one skill graph across courses with different ladders (English uses CEFR): readiness must convert via
  `toLadder` (`level.ts:70`) or keep English separate;
- version pinning of reused courses.

---

## 3. Blocks (`src/content/blocks/*`)

**Unit blocks** (become exercises), registry `src/content/blocks/registry.ts:24-34`:

| Block | Unit kind / exercise kind | Capabilities |
|---|---|---|
| `[!question]` (aliases `flashcard`, `card`, `faq`) | flashcard / flashcard | Q + answer, FSRS, `frequency`, `level`, `type` |
| `[!interview]` | flashcard (`qtype: 'співбесіда'`) / interview | Question `---` layered answer; self-rated; no rubric |
| `[!quiz]` | quiz / quiz | Modes: single, multi, output, **order** (pieces + distractors; this *is* a Parsons problem), **fill** (blanks, word bank or free); explanation; server-graded in lessons, tests, exams, placement and the feed; **article quizzes ship the key up front** (`quiz/view.ts:8`) |
| `[!task]` (aliases `exercise`, `задача`) | task / task | Statement, ```` ```js/ts starter ````, **one** ```` ```js/ts tests ```` fence, N `[!hint]`, one `[!solution]`, `difficulty`, `level`, `id`, `tags` (`task/definition.ts:25-73`). Runnable only for js/ts (`task/code.ts:5-10`) |
| `[!word]`, `[!listen]`, `[!speak]`, `[!pair]` | flashcard / quiz modes | Language blocks (`docs/LANGUAGE_COURSE.md`) |
| `[!talk]`, `[!write]` | quiz modes | **Not on main** (see §1) |

**Render blocks:**
- `[!viz]`: 28 ids, 49 scenarios, all browser and JS internals (call-stack, event-loop, cors, http-cache, xss…).
  Catalog in `viz/catalog.ts`; each viz is a bespoke React component.
- `[!figure]`: 7 ids (devtools panels, browser-render, event bubbling).
- `[!diagram]`: a YAML spec with layouts `flow | stack | tree | nest | compare | timeline`, 9 tones, edges, and an
  optional step walkthrough with moves (`src/content/diagram/spec.ts:7-66`). Already used 699 times in Guides; this
  is the tool for system design.

**Callout styles:** tip, warning, important, example, interview, pitfall, note, success/failure, solution, reel.

**Multi-step "every step is a task" (JavaScript Projects):** this is a *content convention*, not a mechanism.
- Each step is an independent `[!task]` with its own id (`jsp-02-task-02` …).
- Its `starter` contains the **full code of the previous steps, copied in**. Example:
  `content/Guides/JavaScript Projects/JavaScript Projects - 02. Калькулятор виразів.md:229-300`. There, step 2's
  starter repeats `CalcError` + `tokenize` from step 1.
- Nothing links the steps. There are no locked regions (the learner can edit or delete earlier code), no step-scoped
  tests over a shared program, and no "reveal step" tracking separate from hints.

**Gaps vs prompt (§5.2a, §5.2b, §5.4, §6a):**
- no guided steps with locked code;
- no hidden tests;
- no misconception tags on tests;
- no variants with complexity;
- no derived ladder levels L0–L4;
- no worked-example trace data;
- no multi-file mini-project (§5.4 AI-assisted round);
- `[!interview]` has no per-level answers or rubric (§6a open answers);
- no quiz variant pools per concept.

**Proposed design (author once, derive the levels, §5.2b-H):** extend `[!task]` and keep it one unit.

````md
> [!task] Two Sum
> level: junior · difficulty: easy · id: fs-algo-hash-001 · pattern: hash-map · concept: complement-lookup
>
> statement…
>
> ```js solution steps
> // @step 1 signature: edge cases first — порожній масив → []
> function twoSum(nums, target) {
>   if (nums.length < 2) return []
> // @step 2 why: Map — O(1) пошук доповнення; масив дав би O(n²)
>   const seen = new Map()
> // @step 3 …
> ```
> ```js outline
> // 1. remember seen numbers   // 2. for each x look for target − x
> ```
> ```js distractors
> for (let i = 0; i <= nums.length; i++) {
> ```
> ```js tests                       ← visible
> ```js tests hidden                ← server-only; test.mis('off-by-one', 'name', fn)
> > [!solution] variant: brute · O(n²) · O(1)
> > [!solution] variant: sort-two-pointers · O(n log n) · O(n)
````

- **The compiler derives levels.** L0 is the worked example: the step list plus "why" text. Trace data comes from
  running the reference with an instrumented loop, or from authored `trace:` YAML for the first version. L1 is an
  `order` exercise with the distractors; the existing quiz `order` grader does it. L2 is gapped steps: locked code
  before and after, one step editable, tests scoped to the step through `@step` tags on tests. L3 is the signature
  plus the outline. L4 is the blank editor. Derived items get ids `<task-id>~L1`, `~L2.s3`, `~v:brute`. These ids
  stay stable as long as step markers stay stable.
- **Locked code** needs an editor feature: read-only ranges in `src/ui/code/CodeEditor.tsx` (135 lines, a plain
  textarea + tokens). Either add range guards, or render the locked parts as separate highlighted blocks around a
  small editable textarea. The second is simpler and mobile-friendly, which §5.2b-G wants.
- **§5.4 AI-assisted round:** a new `[!review]` block (or `[!task] mode: ai-review`) with `files:` fences, a
  `suggestion` list (id, diff, verdict `correct|bug`, bug type, explanation) and tests. The grader checks the
  accept/reject choices server-side; the learner's tests must fail on the bad suggestion's code (runner).
- **`[!interview]` v2:** add `### Junior / ### Senior / ### Tech Lead` answer sections, `rubric:` items and
  `followup:` lines. The self-assessment UI ticks rubric items, and "perfect" means all ticked (§6a).

Effort: task v2 parse + compile derivation + UI for L0–L4 is **L** (the largest single item). The AI-review block
is M. Interview v2 is S–M. Risk: the derived levels must read naturally. Pilot on 5 problems before authors scale.

---

## 4. Runner (`src/app/runner/*`, `src/ui/code/*`)

**Current state:**
- `GET /runner/worker.js` (`src/app/runner/worker.js/route.ts`) serves a script built by `workerSource()`
  (`src/ui/code/worker-source.ts:60-62`): the bootstrap + `runSuite.toString()` + a pre-bundled sucrase TS
  stripper (187 KB source, "~48 KB gzip"). The route sets its **own CSP** `default-src 'none'; script-src
  'unsafe-eval'` (`src/lib/csp.ts:42`).
- Client (`src/ui/code/runner.ts`):
  - a **fresh `Worker` per run**, `terminate()` on a timeout of `RUN_TIMEOUT_MS = 3000` (line 6);
  - a per-run token on messages;
  - globals stripped as defence in depth: fetch, XHR, WebSocket, importScripts, indexedDB, navigator…
    (`worker-source.ts:24-36`).
- Harness (`src/ui/code/harness.ts`, 495 lines, self-contained):
  - `test/it/describe/expect/vi/sleep`;
  - matchers: toBe, toEqual, toStrictEqual, toThrow, toHaveBeenCalled*, toBeCloseTo, toContain, toMatch,
    toHaveLength, toBeInstanceOf…;
  - `.resolves/.rejects`;
  - fake timers (`vi.useFakeTimers/advanceTimersByTime`);
  - 1.5 s per async test;
  - console capture, ≤ 200 logs.
  - Learner code and tests are compiled with `AsyncFunction`. Tests run in an inner function that sees the
    learner's declarations (lines 434-455). The report gives test name, ok, error, expected, received and ms.
- **What executes:** JavaScript, plus TypeScript with types **stripped, never checked** (`task/code.ts:3`,
  `ts-strip.ts:3`). There is no DOM, no modules/imports, no Node APIs, no SQL.
- **Grading:**
  - The browser runs the tests, then calls `finishTask({ unitId, solved, hintsUsed, durationMs })`
    (`src/server/actions/study.ts:50-66`).
  - The server checks only that the unit is a task, then records `solved` as reported.
  - Task XP: `TASK_XP` easy 30 / medium 50 / hard 80, × max(0.4, 1 − 0.2·hints) (`src/progress/xp.ts:8,39-40`).
  - League XP excludes tasks for this reason (`docs/SECURITY.md:476`).
- **Leaks:** the tests are rendered on the page («Тести» `<details>`, `src/ui/study/TaskInline.tsx:189-193`). The
  solution and hints are rendered server-side and sent with the page (`render-items.tsx:155-170`). The first is a
  feature today; for hidden tests, the solution and the answer keys, it is a leak.
- Server-side sandbox precedent: `src/ai/reels/code-check.ts` runs untrusted JS in a `node:vm` realm inside a
  throwaway `worker_threads` worker with an empty env and a timeout. It is documented as not a security boundary
  on its own.

**Gaps vs prompt (§5.3, §8):** hidden tests; server-side verdict; TS type check; SQL; HTML/CSS; React; Node; tests
scoped per step; misconception tags; complexity/timeout feedback ("your solution is O(n²)").

**Proposed design, by runner:**

| Runner | Design | Size / cost | Effort |
|---|---|---|---|
| **Server verdict for JS/TS (foundation)** | The client runs the *visible* tests for instant feedback. On submit, the server runs visible + hidden tests through the same `runSuite`, in a `worker_threads` worker with `resourceLimits` (heap ~64 MB), a hard timeout, `node:vm` with a null-prototype context (reuse the `code-check.ts` hardening) and an empty env. The verdict, the misconception tags of failing hidden tests (name + expected/received of *one* failing case, never the test source) and XP come from the server. Hidden tests and solutions live in the bundle-side server store and are never rendered into RSC payloads. Rate-limit per user. | No new dependency. CPU ≈ tens of ms per submit. | M |
| **Performance tests** | `test.perf('O(n)', fn, { n: 1e5, budgetMs })` in hidden tests. A timeout maps to the misconception `too-slow`. Calibrate budgets on the server (the source of truth), not on the client. | — | S (inside the above) |
| **TS type-check** (type challenges, TS tasks) | A second worker `/runner/tsc.js`, loaded only when a TS-check task opens. It holds minified `typescript.js` + the needed `lib.*.d.ts`, uses `ts.createProgram` over an in-memory `CompilerHost`, and gets assertions with `Expect<Equal<A,B>>` helpers + `// @ts-expect-error`. Keep the worker CSP; serve it as a single script (no `importScripts`). It needs `script-src 'self' 'unsafe-eval'` only if the bundle is split. Cache immutable with a hashed URL. The server verdict can use the real `typescript` package in Node (already a devDependency; would move to a dependency). | **~1.02 MB gzip / 0.80 MB brotli** + lib ≈ 52 KB gzip (measured). Cold start ~1–2 s (estimate, to measure). | M |
| **SQL (PGlite)** | A worker `/runner/sql.js` loads PGlite. Per problem: `CREATE` + seed from the problem's fences, run the learner query in a transaction, `ROLLBACK`; compare the result set (ordered when the task says `order: strict`, multiset otherwise, with column names and types); `EXPLAIN (FORMAT JSON)` tasks assert on plan nodes (verified to work in Node). Worker CSP needs `'wasm-unsafe-eval'` and `connect-src 'self'` for the wasm/data assets (or the page fetches them and transfers a `WebAssembly.Module`). Server verdict: a warm PGlite per instance in Node, a schema per run in a rolled-back transaction, a statement timeout. Expected results are computed at build time from the reference query (and checked by `course:check`). | Download ≈ **4.2 MB compressed** (2.89 MB br wasm + 1.06 MB br data + 0.28 MB gz JS), once, cacheable. Node init **1.16 s**; seed 1,000 rows + window function query 12 ms. Node RSS after init read 1.58 GB in one run (WASM memory reservation; must be measured and capped before the server path ships). Package on disk 35 MB (function size). | M–L |
| **HTML/CSS** | A sandboxed iframe on an opaque origin: `<iframe sandbox="allow-scripts">` pointing at `/runner/frame` with its own CSP. A `srcdoc` iframe would inherit the page's nonce CSP. The learner's HTML/CSS goes in by `postMessage`. Tests run *inside* the frame: DOM queries, `getComputedStyle`, `getBoundingClientRect` for layout checks, a small in-house a11y rule set (alt, labels, landmarks, heading order, contrast, roles). axe-core would add an estimated ~150 KB gzip (not installed, not measured). The page CSP needs `frame-src 'self'`; it is `'none'` today (`src/lib/csp.ts:30`). Server verdict: static checks (HTML parse + CSS rules) on the server plus a client-reported layout result. Real computed layout server-side would need a headless browser (Playwright is only a devDependency). Decide which checks count for XP. | Frame + harness ≈ 30–60 KB (estimate) | M |
| **React UI** (approval needed) | The same frame plus a pre-bundled `react` + `react-dom` (react-dom client 112 KB gzip, measured) + `@testing-library/dom` + `user-event` (not installed), built with esbuild like `scripts/build-ts-strip.ts`. JSX/TS through sucrase (already in the worker). Hidden tests server-side need jsdom or happy-dom in Node (not installed) or Vercel Sandbox. | ≈ 200–250 KB gzip lazy (estimate) | L |
| **Node tasks** (approval needed) | Options: **(A)** pure-logic modules with mocked I/O (fake `fs`, `EventEmitter`, `http` request/response objects, streams) in the existing worker. Free, safe, covers most interview Node questions. **(B)** Node `worker_threads` + `vm` on the server. Free, real Node semantics, but `vm` is not a security boundary, so it must stay a pure-logic subset without `require`. **(C)** Vercel Sandbox (Firecracker microVM): real Node, npm, network control. Paid per use, so it needs a cost estimate and the owner's yes. **(D)** WebContainers: a commercial licence is needed for production. Recommend A now, C later for a "real server" capstone. | A: 0 · C: paid | A: M · C: M + cost |

**Risks:**
- The server verdict changes the trust model, so it needs a SECURITY.md update. Also weigh the CPU cost of hostile
  submissions against rate limits.
- PGlite memory on serverless.
- An iframe CSP mistake could expose the page origin. Never use `allow-same-origin`.
- The ~1 MB tsc download on mobile: lazy-load it and show progress.

---

## 5. Progress and selection (`src/progress/*`, `src/course/select/*`)

**Current state:**
- **FSRS** (`src/progress/srs.ts:17`): `ts-fsrs`, retention 0.9, max interval 365 d. It is applied **only to
  flashcards** (`src/progress/engine.ts:31`). Quizzes and tasks are not scheduled.
- **XP** (`xp.ts`): base by level; quiz factors (output/speak ×1.2, order/fill ×1.3); tasks by difficulty and
  hints; repeat ×0.4; no XP twice on the same day; +5 for a resolved mistake.
- **Streaks/day/missions:** `streak.ts`, `day.ts`, `mission.ts`.
- **Mistakes** (`mistakes.ts`, table `mistakes`, `src/db/schema.ts:163-177`):
  - keyed by **unitId**, with `wrongCount`, `correctStreak` and timestamps;
  - cleared after **2 correct answers on the same unit** at least 20 h apart (`MISTAKE_EXIT_STREAK = 2`,
    `MISTAKE_MIN_GAP = 20 h`, lines 5-6);
  - no concept, misconception type or "what was wrong" field.
- **Hint tracking:** `attempts.hints_used`, `task_state.hints_revealed` (`schema.ts:127, 194-205`). The draft is
  saved. There is no separate "solution revealed" or "step revealed" flag; `giveUp` exists in the UI.
- **Mastery:** chapter crowns 0–5 with thresholds of 60–90% (`mastery.ts`).
- **Tests and gates:**
  - topic test of 10 questions at pass 0.8, section exam of 25 at 0.8 (`course.yaml` `exams`);
  - `needed = ceil(count·pass)` (`select/tests.ts:18`);
  - pools are shuffled by a learner+attempt seed (`tests.ts:24-27`), so retakes draw a different subset of the same
    pool, but there are no concept-level variants;
  - **locking is advisory** (`select/path.ts:12`).
- **Adaptive practice** (`select/adaptive.ts`): the level band, mistake/recency weights and a variety rule, for
  language courses. **Skills** (`select/skills.ts`): a θ belief per skill, updated after tests.
- **Timed mode, readiness, mock hub, plan, atlas:** none. A grep for timed/countdown/time limit finds only the
  league clock and boost timers.

**Gaps vs §6 / §6a / §5.2b:**
- strict mastery (100%, real locks);
- concept ids + variant pools (≥ 3 per concept) + spaced re-check that reopens a concept;
- mistakes by concept + misconception, remediation, clearance on *unseen variants* on 2 days;
- a "section gate requires all open mistakes cleared" rule;
- the scaffolding ladder state per task (L0–L5, up and down moves, "mastered = L4 on a later day");
- FSRS for re-solves and Q&A, patterns and slang;
- the hint ladder at an XP cost;
- timed interview mode;
- the readiness score per domain and per target loop;
- the plan (target + weekly mix) and the mock hub.

**Proposed design:**
1. **Tables:** `concept_state(user, concept, status, passedAt, recheckDue)`, `task_ladder(user, task, level,
   lastSuccessAt, variantsDone[], independentSolveAt)`, and new `mistakes` columns `concept`, `misconception`,
   `detail`, `seenVariants`. This needs an additive migration (`drizzle`). Clearance moves to the concept: 2 correct
   answers on different days on variants not seen before.
2. **Strict mode as a course or track flag:** `exams.*.pass: 1`, `mastery: strict` → path locks become *enforced* on
   the server (lesson and test actions refuse locked units). Explanations show only after the attempt: graded
   context everywhere, never article-mode keys.
3. **Anti-gaming:**
   - variant pools per concept;
   - shuffled options (already in the view);
   - parameterised items (numbers or data generated from a seed at render, graded server-side);
   - a retake cooldown with a different pool draw;
   - a pass in one sitting only provisionally opens the gate until the spaced re-check.
4. **FSRS for all kinds:** a schedule row per task (re-solve), per concept and per pattern card, plus a "due" queue
   that opens the daily mix with «Робота над помилками» first.
5. **Readiness** = f(independent L4 solves within time, Q&A recall from FSRS retrievability, mock rubric scores) per
   track skill. Pure functions in `src/course/select/readiness.ts`, the same style as `skills.ts`.

Effort: strict mastery + concept mistakes L; ladder state M; FSRS for tasks/concepts M; timed mode S; readiness +
plan M; mock hub M; atlas (graph view over prerequisites/usedIn + glossary search; `content/glossary/uk-en.yaml`
exists) M. Risk: strictness without enough variants blocks learners, so the content needs ≥ 3 variants per concept
before strict mode turns on.

---

## 6. Content storage (`src/content/store.ts`)

**Current state:**
- `ContentSnapshot` (`store.ts:22-46`) holds every guide in maps: chapters, `plainText`, `units` (with full mdast
  bodies), `unitsByChapter`, reels, placement units, translations, links.
- The prebuilt snapshot (`store.ts:305-357`): `pnpm content:snapshot` writes `content/.snapshot/guides.v8.br`
  (v8-serialized + brotli). `vercel-build` runs it; it is traced into **every** function
  (`next.config.ts:25-27` includes `./content/**/*` too, 30 MB).
- One `ContentStore` per process on `globalThis` (`store.ts:531-543`). Chapter documents are an LRU of 80, parsed on
  demand from the vault files.
- Course bundles: every `content/courses/*.json` is read and parsed at registry init
  (`src/server/courses/registry.ts:33-40`).

**Measured now (4 courses, 17 guides; `/tmp/loo-audit/mem*.mts`):**

| Metric | Value |
|---|---|
| Retained heap after cold prebuilt load | **133.7 MB** (480 ms) |
| Heap after a full parse (dev path) | 157 MB delta, 13.3 s |
| Snapshot file | 10.9 MB br (docs say 3.5 MB, outdated) |
| Serialized share: `units` | 51.3 MB · `unitsByChapter` 50.6 MB (the same objects, counted twice in this measurement) · `plainText` 22.0 MB · placement 2.6 · reels 2.1 · chapters 1.5 |
| Per guide (units + chapters + plainText, serialized) | English 29.8 MB · Deutsch 14.4 · Next.js 6.5 · JavaScript 5.7 · JS Q&A 4.4 · Deutschland 3.7 · JS Projects 2.0 · Next.js Start 2.0 · JS Katas 1.8 · React 1.4 · JS Start 1.0 |
| Course bundles in memory | 7.7 MB JSON (English 4.1 MB) |

**Per-course lazy storage: not done.** No code or doc mentions it besides the prompt. **This is a blocker (§9).**
Projection: at ~2.5–3 M words, the track roughly doubles the guide volume, and the heap goes to ~250–300 MB per
instance, with a slower cold start.

**Proposed design:**
1. **Shard by guide, not by course.** Guides are what courses share; the track reuses the JS and Next.js guides.
   - The build writes `content/.snapshot/index.v8.br` (guides, chapter metadata, unit id → guide map, links,
     backlinks, reels metadata, translations metadata; small).
   - It also writes `content/.snapshot/guide-<id>.v8.br` (units with bodies, plainText, placement units) per guide.
2. **`ContentStore` API:**
   - `get()` returns the index;
   - `units(guideId)` and `unit(id)` load a shard on first use;
   - an LRU of shards bounded by bytes (e.g. 64 MB), with eviction;
   - change callers that iterate `snapshot.units` globally (search, feed, practice, admin stats) to ask per guide or
     per course.
3. **Search:** build a MiniSearch index per guide at build time (`minisearch` is already a dependency) instead of
   keeping 22 MB of `plainText` live.
4. **Course bundles:** load lazily per course id, not all at boot.
5. **Later (§9):** per-topic chunks with prerendered HTML in R2; answer keys server-side only. R2 costs money, so
   it needs the owner's approval and an estimate.
6. **Guard:** a test that loads the index + one course and asserts a heap budget. Report heap per course in every
   stage report.

Effort: **L** (the store API is used widely; the refactor touches search, feed, practice, the tests pipeline and
admin). Risk: regressions in the existing courses. Mitigate with the existing unit tests + an e2e pass on JS,
English and Next.js before merging.

---

## 7. Existing courses to reuse

| Course | Bundle | Content | Reuse in the track |
|---|---|---|---|
| `javascript-noob-to-god` v1.0.0 | 9 sections, 73 topics, 779 lessons, **1,759 exercises** (521 quiz, 787 cards, 156 interview, **295 tasks**, 232 auto-tested), 134 h, **no skills**, no placement bank (lesson-quiz placement) | ≈ **457k words**: JavaScript Start 38k (11 files), JavaScript 195k (35), JavaScript Katas 53k (9 files, 70 tasks, incl. code review), JavaScript Projects 98k (8 projects, steps = tasks), JS Interview Q&A 73k (12 files + `questions.json`, 354 units) | Part II «JavaScript» module (core). JavaScript Start feeds the Part I ramp («Код і задачі з нуля» fills the gaps: tracing, reading problems, micro-katas). Katas feed Part VI JS live coding. Q&A feeds the arena. Add `skills:` before the track uses per-skill placement. |
| `nextjs-zero-to-pro` v0.1.0 | 15 sections (**10 planned**), 32 topics, 872 exercises (90 tasks, all auto-tested), 11 skills, placement bank of 139 items, `perSkill: true`, `languages: [uk, en]` | Next.js Start 76k words (12 topics; chapters 1–4 are web, React and TS minimums), Next.js 244k (27 files so far) | Part III module. Its React and TS minimums must not be duplicated: the track's React and TS courses go deeper and link to them. Track id pinning: the course is still in progress, so reference it by section. |
| `english-a1-c2` v0.1.0 | 6 sections, 166 topics, **9,375 exercises**, 240 h, CEFR ladder, placement bank 252, 5 skills | English guide ≈ 989k words, 173 files (the largest content: 29.8 MB of the snapshot) | Part X foundation (general English), as a prerequisite module. IT English, slang and interviews are new courses on top. `[!talk]`/`[!write]` come once landed. |
| `deutsch-a1-c2` | 10 sections (6 planned), 5,223 exercises | — | Not used by the track. |
| Other guides | React (177 files, 136k words, **0 exercises**; follows the react.dev "Learn" structure, so originality must be checked before reuse), Node.js (27 files, 4.4k words, stubs), PostgreSQL (27 files, 5.3k words, stubs), Kotlin and Android (stubs) | — | Not reusable as course content. The track's React, Node.js and PostgreSQL courses are new. The existing guide dirs should be archived or replaced, not extended, to avoid id clashes. |

The guide format the track should copy: topic files with the LEARNING_PLAYBOOK anatomy, `[!task]` with tests,
Katas with code-review tasks, Projects with steps as tasks, and Q&A as `questions.json` or `[!interview]`.

---

## 8. Recommended stage-1 build order

Ordered by dependency. Each step ships with tests and a docs update, and is merged after review.

1. **Per-guide lazy content storage + heap budget test** (L). Blocker. Nothing big lands before it.
2. **Server-side task verdict + hidden tests + misconception tags** (M). This is the trust foundation every runner
   reuses. It also stops sending solutions and keys to the client in graded contexts.
3. **Task v2 format + compiler derivation L0–L4 + variants + locked-step editor** (L). Pilot it with 5 algorithm
   problems written by the lead (the model unit, §7).
4. **Track manifest + `TrackBundle` + topic prerequisites in bundles + JS course `skills:`** (L / S–M).
5. **Strict mastery:** concept ids and variant pools, concept-level mistakes with remediation, enforced gates at
   100%, spaced re-check, FSRS for tasks and concepts, ladder state (L).
6. **TS type-check worker** (M) → **PGlite SQL runner** (M–L) → **HTML/CSS iframe runner** (M).
7. **Hint ladder with XP cost, timed mode, readiness score, plan, mock hub, atlas** (M each).
8. **Needs approval before building:** the React iframe runner (L) and the Node sandbox option (A now / C paid).
   Live AI grading stays off.
9. **Needs the owner:** land `[!talk]`/`[!write]` on main (with the `isTestable` fix) before interview-English
   authoring.

**Top risks across the plan:**
- step 1 touches every page;
- the server verdict needs CPU limits;
- PGlite memory on serverless;
- strict mode needs ≥ 3 variants per concept before it can be on;
- the uncommitted English work could conflict with the `model.ts`/`registry.ts` edits from step 3.
