# Stage 0 review — «Full-Stack Engineer: Zero → Pro»

Reviewer: independent (not an author of any stage-0 file). Date: 2026-11-08. Scope: `docs/FULLSTACK_TRACK.md` plus
`docs/fullstack/{platform-audit,outline-*}.md` and `docs/fullstack/research/*.md`, checked against
`docs/prompts/fullstack-course.md` §0–§10. Method: I read the blueprint, the spec and every outline in full, re-added
the summary tables, grepped the outlines for 90+ §4/§4a terms, sampled the field bank, checked code claims in the repo,
and opened 12 source URLs from the research files.

**Verdict.** The research is strong and mostly accurate. Coverage of §4 and §4a is close to complete, and almost every
§5.1 minimum is met on paper. But two contracts that stage 1 builds on are not ready: (1) one skill graph with one id
scheme, and (2) a variant-pool budget that makes strict 100% mastery workable. Several totals are also double-counted
or attributed to the wrong place. **Counts: 2 blockers, 10 major, 15 minor.**

---

## Blockers

### B1. No single skill graph, and course, skill and exercise ids disagree across files
- §10 asks for "the skill graph with levels". §7 says the lead owns it and the id registry. The blueprint has neither:
  §6 says only "вузли = навички з outline-файлів".
- The four outline files use four skill schemes:
  - I–III: flat ids (`cs-basics`, `react-state`);
  - IV–VII: namespaced ids (`fs-node.event-loop`);
  - VIII–XI: flat ids (`llm-basics`);
  - X: `en-*` ids.
- Prerequisites point at course ids that do not exist in the blueprint:
  - IV–VII (`outline-parts-4-7.md:3`): `fs-computer`, `fs-tools`, `fs-ramp`, `fs-ts`, `fs-state`, `fs-webperf`;
  - VIII–XI (`outline-parts-8-9-11.md:62-65`): `fs-security`, `fs-architecture`, `fs-system-design`,
    `fs-observability`, `fs-algorithms`, `fs-js-livecoding`, `fs-english-it`.
- Exercise ids come in four forms, and none matches the spec's `fs-<course>-<topic>-<n>`:
  - blueprint §8: `fs-<course>-<NN>-<type>-<nn>`;
  - I–III: short codes, e.g. `fs-cin-…`, `fs-ramp-m03-task-07`;
  - IV–VII: `fs-<short>-<slug>-<nnn>`;
  - X: `fs-enl-03-w041`.

  §8 makes ids permanent, so this must be settled before the first model unit is written.
- No table maps the §4 items to skills, levels and question types (the spec asks for one: "map every item below to
  skills, levels … and question types").
- **Fix:** add a §3.2 "Реєстр id і граф навичок" to the blueprint:
  1. a canonical table of course id, short code, part, role and bundle;
  2. one skill-id scheme (recommend `fs-<course>.<section>`, as IV–VII already use), with level ranges;
  3. the cross-part prerequisite edges at section level (data for the Atlas);
  4. one exercise-id scheme, with a decision on whether `<topic>` is a number or a slug;
  5. a table mapping each §4/§4a bullet to skill ids.

  Then rewrite the placeholders in `outline-parts-4-7.md` and `outline-parts-8-9-11.md`. Haiku can do the
  mechanical rename.

### B2. The variant-pool budget does not support strict 100% mastery (§6a), and the outlines contradict it
1. **The pool is too small for a retake.** I–III plan a quiz pool of 12 per topic, which is about 4 concepts × 3
   variants. Each topic test draws 10 of the 12 (`outline-parts-1-3.md:61`). So one retake shows almost the same items,
   and after two attempts the learner has seen the whole pool. That is exactly the "memorized variant set" gaming §6a
   forbids.
2. **The pool runs out after one failure.** Clearing a mistake needs correct answers on two different days on unseen
   variants (§6a.3). With 3 variants per concept, one is used by the failed attempt, which leaves exactly 2. Any second
   failure exhausts the pool. The blueprint's "≥ 3, ≥ 5 for key concepts" (§6) has the same problem, and nothing says
   what happens when a pool runs out (the learner is locked, or sees repeats).
3. **IV–VII have no quiz pools at all.** These 19 courses have no QZ column: their mix is Q&A, cards, tasks and drills
   (`outline-parts-4-7.md:11-36`). So their topic and section gates have nothing to draw variants from, unless layered
   Q&A counts as a gate item, and that is not stated.
4. **The ramp gate is not 100%.** It is "8 з 12 на L4" (`outline-parts-1-3.md:183`), which contradicts §6a ("100% before
   moving on").
5. **Coding re-solves have no variants.** For L4 re-solves of the same task, "variants — different data" does not stop
   a learner from replaying a memorized solution. The design never says that the "mastered" check uses a sibling
   problem or re-seeded tests.

**Fix:**
- Define one budget per concept in the blueprint, used by every outline: ≥ 6 variants per concept (≥ 8 for core
  concepts), or parametric generators wherever the item allows.
- A topic test draws one variant per concept, never most of the pool.
- Add a pool-exhausted rule: generate a new item, or fall back to a remediation task and a re-check after N days.
- Add quiz pools to IV–VII, or declare `[!interview]` layered Q&A as gate items with self-check variants.
- Change the ramp gate to 100% on fresh variants.
- Make the "mastered" check for coding use a re-seeded hidden test suite plus a sibling problem of the same pattern.

---

## Major

### M1. TypeScript tasks are duplicated across two courses and counted twice (254)
- `fs-typescript` C01–C05 (`outline-parts-1-3.md:397-401`) and `fs-livecoding.ts` (`outline-parts-4-7.md:266`) list
  the same challenges: DeepReadonly, Pick/Omit/Exclude from scratch, UnionToIntersection, path types, typed event
  emitter, typed API client, branded IDs.
- The two outlines say opposite things. I–III says "VI only enables timed mode, no new tasks" (`:47`, `:407`). IV–VII
  §10.2 says `fs-ts` must avoid exactly those tasks.
- Blueprint §3.1 then adds both counts: "254 = 178 + VI 76". 76 is the IV–VII total (VI alone has 60).
- **Fix:** make `fs-typescript` the owner of type challenges. Cut `fs-livecoding.ts` to timed sets drawn from the
  `fs-typescript` pool, plus "type a real API" tasks not in C01–C05 (overloads vs generics, Zod-derived types,
  builder). Restate the total honestly: 178 plus the TS tasks in IV and V (about 200, not 254).

### M2. The course count is wrong
- The tables list 12 new courses in I–III, 19 in IV–VII, 11 in VIII/IX/XI and 4 in X, so **46 new courses plus 3
  modules = 49**.
- The blueprint says "47 курсів (41 новий + 3 модулі + 3 фінальні)" (§1.1), "41 новий курс + 3 модулі" (§3) and
  "+ ≈ 41 бандл" (§10). None of these add up.
- **Fix:** recount and correct §1, §3 and §10, including the bundle count in the storage table.

### M3. The word budget is not like-for-like, and the spec's own contradiction is not raised
- **The counting bases differ.** I–III count theory and editorials. IV–VII count theory only and put exercise text
  aside: 711k–996k extra words for IV–VII alone (`outline-parts-4-7.md:665`). So "≈ 3.5 млн нових" understates the
  real total.
- **The real total is about 5M or more.** Adding about 0.8M of reused JS and Next.js text and the exercise text of every
  part gives roughly 5M+, against the spec's 2.5–3M *including* reuse. Decision 9.4 presents 3.5M as the full picture.
- **The spec contradicts itself.** "Every core part is at least as deep as the JS course" (~457k words) × 11 parts is
  about 5M, which cannot fit 2.5–3M. Only I–III note this (open question 1); the blueprint does not raise it.
- **The depth is uneven.** Backend Part IV (330k words for 6 courses; `fs-sql` 75k) is thinner than `fs-typescript`
  alone (190k) or `fs-react` alone (280k). For a full-stack track, that balance looks wrong.
- **Fix:** restate 9.4 with one counting rule (theory + editorial text, new versus reused) and the real total. Offer
  options: (a) raise the target; (b) cap per-topic words, e.g. 3.5k for J-level topics; (c) move words from II and III
  to IV. Ask the owner to settle the per-part depth rule.

### M4. Stage-1 plan leaves out about a dozen platform pieces the outlines need, and has no total effort
- Blueprint §5.3 has 8 steps. The outlines also need:
  - `[!review]` line-select code-review block (190 debug tasks + 86 security reviews);
  - branching-dialog block (54 negotiations, 45 English role-plays);
  - `[!talk]` stress timeline;
  - story bank store;
  - AI-round block with mutation grading;
  - loop runner and mock-hub manifests;
  - calculators;
  - Redis and document-store emulators;
  - Git simulator;
  - config linters (Dockerfile, CI, K8s, Terraform, IAM);
  - mock LLM provider with pgvector in PGlite;
  - the L0 trace `[!viz]`;
  - the HTTP lab simulator.
- None of these has a stage or batch assignment or an estimate.
- With the audit's effort scale, the 8 listed steps already add up to roughly 4–7 months for one implementer. The
  blueprint gives no total.
- **Fix:** add a table to §5: piece | needed by batch N | effort | stage 1 or "before batch N".
- Split stage 1 into:
  - **1a:** storage, server verdict, task v2 with L0–L4, track manifest, strict mode, model units. This is enough for
    batch 1, which also needs `[!talk]`.
  - **1b:** runners, readiness, arena.
- Give a calendar estimate.

### M5. Runner risks the audit measured are missing from the blueprint
- **Server-side PGlite:** the audit measured **1.58 GB RSS after init** in Node (`platform-audit.md:318`) and a 35 MB
  package. Blueprint §5.2 shows only the 4.2 MB client download, yet the server is the source of truth for XP.
- **HTML/CSS verdict:** the audit proposes "a client-reported layout result" for HTML/CSS. That contradicts §5.3
  ("server-side grading remains the source of truth").
- **React server verdict:** needs jsdom or happy-dom (not installed) or Vercel Sandbox (paid). It is not designed.
- **pgvector in PGlite:** size not measured.
- **Function size:** `content/**/*` is traced into every function today. Adding about 27 MB of shards, 46 bundles,
  PGlite and `typescript` as a runtime dependency risks the function-size limit.
- **Fix:** add these rows to §5.2 and §10. Decide which runners give XP from a server verdict and which give practice
  only. Add "measure server PGlite RSS with a cap and decide per-instance pooling" as a stage-1 acceptance item.

### M6. The field bank has no coverage plan, skewed sources, an unreliable frequency tag and a copyright exposure
- **Coverage is 0%.** The spec wants the stage-0 report to show a coverage percentage. The outlines already exist, so
  a *planned* mapping (question → planned topic) is possible now. The blueprint defers everything to stage 1.
- **The sources are skewed.** 1,127 of 1,329 rows come from four DOU *interviewer* lists dated 2020–2023. Those are not
  candidate reports. Lead-level questions: 3 rows. Reddit: none.
- **The frequency tag is inflated by the `cluster ≥ 5` rule.** Testing shows 35 very common of 38 rows; AI shows 18 of
  20. For example, fq-1184 (one aggregated report about a Google EM round) is tagged "very common".
- **Topic and skill tagging is noisy.** Sample: fq-0854 «Як реалізувати патерн "Модуль"?» is tagged "System design /
  Node modules".
- **Copyright exposure.** The bank reproduces DOU's compiled question lists word for word in the repository.
- **Fix:**
  - Add a planned-coverage column now and report the percentage.
  - Change the frequency rule to count only the question's own sources, with clusters as a separate column.
  - Have Haiku re-tag topic and skill, with Opus spot checks.
  - Keep the verbatim rows out of any public artefact: paraphrase them or keep a link and an id only.
  - Plan the Reddit, lead-level and SQL gaps. The owner supplies exports, since creating accounts is not allowed.

### M7. The agent plan is per role, not per stage, and leaves out a role
- §10 asks for "the agent and model plan per stage". Blueprint §8 is a role → model table plus rules.
- It omits the spec's **Test-suite hardener (Sonnet)**, which proves that wrong and slow solutions fail.
- There is no per-batch breakdown: which pairs, how many in parallel, review gate, expected throughput.
- There is no token or time budget for authoring about 33k exercises and 3.5M+ words.
- **Fix:** add a table: stage or batch | agents (model) | owned files | parallel pairs | review gate | rough token and
  time budget.

### M8. No estimate of how long a learner needs, and the English week plan does not fit
- In the English outline, Part I takes weeks 1–6 with 30 minutes of spine study a day, which is about 21 hours. Reading
  Part I's 220k words alone takes more than that, before 1,601 exercises and strict 100% gates.
- A rough whole-track figure is 1,500–2,500 learner hours. At 75 minutes a day, that is 3–5 years.
- The first learner, the owner, is an experienced developer who wants interview confidence. The blueprint never
  states the time needed or a fast lane for him.
- **Fix:** add learner hours per part, using the same basis as COURSE_FORMAT `unitMinutes`. Add a "досвідчений" path
  (test-out per section plus the interview layer only) with its own time estimate. Re-derive the English week mapping
  from the real hours.

### M9. Outline VIII/IX/XI predates the research and was never reconciled
- The file says research "was empty when this was written" (`outline-parts-8-9-11.md:6`). It disagrees with `loops.md`
  in several places:
  - **Simulator variants differ.** Toptal T1–T3 by FE, BE and senior, versus algorithmic, React-feature and
    data-processing in `loops.md` §C. The Arc and Lemon.io variants differ too.
  - **Lemon.io stages differ.** It has "theory MCQ 20 Q / 20 min", versus the 15-minute quiz and the AI-assistant
    pre-screen found in research.
  - **Toptal live round.** It has "1–2 problems, 25 min each", versus reported 15–20 minutes.
  - **Take-homes.** "The rest of the take-homes from Part VI", but Part VI has none. Blueprint 9.8 patches this.
  - **PAUSE.** It is still treated as a method in the readiness signals. Research says it is not a published method,
    so it should be labelled as Loo's own mnemonic.
- **Fix:** have the outline author update §3.3, §3.4, §4 weights and the PAUSE wording from `loops.md` and
  `tricky-and-psychology.md`, and drop the "seed claims" caveat where research confirmed them.

### M10. No rule for which course owns a concept, so security, SQL and async content repeats
- **Security.** XSS, CSRF and CSP appear in `fs-browser` 18–22, `fs-auth.owasp-backend` and the `fs-cybersec`
  sections. JWT and OAuth attacks and account recovery appear in `fs-auth` 2–4 and `fs-cybersec.identity-crypto`.
  Leaked credentials appear in `fs-auth` 7 and `fs-cybersec`.
- **SQL.** Windows, running totals and recursive CTEs appear in both `fs-sql` §4–5 and `fs-sql-ps` §5 and §7.
- **Async UI.** Debounce, cancel and race appear in `fs-react` M03, `fs-fe-state` 14, `fs-livecoding.async` and Katas.
- Without a concept owner, the 4,929 Q&A will hold near-duplicates, and the FSRS load grows for nothing.
- **Fix:** each concept id has one owner course where the theory and Q&A live. Other courses link to it and add only
  their own angle: builder view versus attacker view, concept drills versus timed problems. Add a Haiku dedupe scan of
  Q&A wording per concept id to the review gate.

---

## Minor

1. **Q&A totals disagree inside I–III.** The §0.2 table gives 1,687 Q&A; §0.3 gives 1,709 (`outline-parts-1-3.md:37`
   vs `:53`). The blueprint uses 1,709. Explain the +22 (bosses?) or use one number.
2. **JS interview Q&A are double-counted.** `fs-js-interview` QA 354 includes about 245 "layers" on existing JSIQA
   questions (`:322-344`). Those questions are already counted as 270 reuse. Report about 110 new questions plus layers.
3. **Memory projections disagree.** Blueprint §5.1 says "≈ 2.5× обсягу, ≈ 350 МБ"; the audit (`:422`) says about 2×,
   250–300 MB. Units grow from 17.8k to about 51k (≈ 2.9×). Reconcile and state the basis.
4. **English cards before and after dedupe.** 3,975 cards drop to about 3,378 after dedupe against English A1→C2
   (`outline-english-for-it.md:21`). The blueprint should report the post-dedupe figure, which still meets ≥ 3,000.
5. **Type counts are inflated.** CSS "which colour wins" items count as predict-the-output. About 46 small
   `fs-fe-state` `js` items (slice, selector) count as interview-style JS practical. Both minimums still hold without
   them; tag them as domain items.
6. **The ladder table is incomplete.** Blueprint §4 lists L0–L4 only and drops L5 (variants and speed, §5.2b). The claim
   that "`quiz order` covers Parsons" does not say whether `order` supports distractor lines. Verify it, or plan the
   extension.
7. **Capstones differ between files:**
   - II: blueprint "доступний адаптивний сайт" vs outline "vanilla TS SPA";
   - I: "CLI-утиліта" vs "консольна програма + репозиторій";
   - VII: "+ 3 дизайни" is not in the outline.
8. **React runner is inconsistent.** Decision 9.2 recommends building it in stage 1, but blueprint §5.3 does not list
   it. The spec also requires a stop for approval *before* building, so make 9.2 an explicit approval with the
   effort (L) and size (≈ 200–250 KB gzip).
9. **Research nuance (Arc).** Blueprint §2 says "Arc, senior — $75–150 глобально і $40–85 для Східної Європи". On the
   Arc page, the Eastern Europe band covers *all levels* and is not a senior figure (verified).
10. **Research nuance (Google).** Per BI/ByteHerald, a Google spokesperson says the formats "remain pilot-phase". The
    blueprint's «ширше розгортання з 10.2026» should keep that caveat.
11. **Research nuance (ITJobsWatch).** The £883/day figure comes from **one quoted rate** across 2 ads (verified).
    Mark it n = 1 or drop it.
12. **UK and Germany contracting are not planned.** IR35 and Scheinselbständigkeit are researched in `market-2026.md` §4
    but appear nowhere in `fs-career`. Decision 9.9 picks UA, PL and US. The UK is a common remote-contract market, so
    add IR35 at least as a callout.
13. **Prep plans per company type are missing.** The spec asks for "a map and a prep plan for each". `loops.md` gives
    prep emphasis only for outsourcing. Add one line per company type: courses, arena drills, readiness weights.
14. **No refresh policy for dated facts.** AI-round policies, platform stages, OWASP versions and rates have no
    `reviewed-at` and expiry metadata and no owner check per batch. Add a "дані на дату" expiry (e.g. 6 months) to the
    reported boxes, as `fs-career` already does for rates.
15. **Two contracts are under-specified:**
    - **7-step visuals:** §5.0 asks to finalize them in stage 0. Names are done; `px:` icons and the visual are not.
    - **Atlas data model:** unclear whether a node is a skill, a section or a topic (1,150 topics), and what the
      glossary size target is.

    Neither blocks stage 1, but both belong in the contract.

Also worth stating in the report: the "≈ 99% pass" bar is calibrated only on synthetic profiles, which is circular.
Log the owner's real loop outcomes, with consent, as the first external calibration, and keep the UI wording
"design target".

---

## Check 2 — consistency of the totals (re-added)

| Item | Outline sums | Blueprint §3.1 | Result |
|---|---|---|---|
| Q&A | 1,709 (I–III §0.3; table says 1,687) + 2,540 + 680 = 4,929 | 4,929 + 438 reuse | adds up; inner I–III mismatch (minor 1); JSIQA layers double-counted (minor 2) |
| Flashcards | 2,956 + 4,165 + 2,030 = 9,151 | 9,151 | ✓ |
| Predict | 471 + 115 = 586 | 586 | ✓ (VII has 10, so "I–VI" should read "I–VII") |
| Recognition | 320 + 936 = 1,256 | 1,256 | ✓; `fs-algo` alone 620 ≥ 600 ✓ |
| TS | 178 + 76 (IV 12, V 4, VI 60) | "178 + VI 76 = 254" | wrong attribution, and a duplicate (M1) |
| JS practical | 64 + 120 = 184 (+54 Katas) | 184 | ✓ arithmetic; see minor 5 |
| Debug / SQL / Node / Transfer / Integrations | 85 + 105 = 190 / 264 / 98 / 3 + 76 = 79 / 48 | same | ✓ |
| Algorithms | 124 / 279 / 99 = 502, 31 patterns | same | ✓ |
| Security | 86 / 24 / 44 / 320 | same | ✓ |
| VIII–XI | tricky 280, stress 66, negotiation 54, behavioral 250, AI round 32, loops 40, sims 18 | same | ✓ |
| English | W 3,975 · DLG 328 · TALK 299 · WRITE 161 · LST 224 · RP 45 · 354k words | same | ✓ (minor 4) |
| Topics | 305 + 120 + 25 + 110 + 130 + 74 + 165 + 129 + 88 = 1,146 | ≈ 1,150 | ✓ |
| Words | sum of the per-part rows = 3,502k | ≈ 3.5M | ✓ arithmetic; basis differs (M3) |
| Courses | 46 new + 3 modules | 41 + 3 (+3) | ✗ (M2) |

Course ids agree between the blueprint and the course headings in each outline, but not in the cross-references
(B1). Duplication found: TS challenges (M1); security, SQL and async UI (M10). React machine coding is owned only by
`fs-react`; the arena reuses it, which is fine.

## Check 3 — coverage spot-check (§4, §4a, §5.0)

**Found** (sample of 30):

| Item | Where |
|---|---|
| prototype pollution, ReDoS | `fs-cybersec.server-attacks` |
| BRIN, partial and covering indexes | `fs-sql.indexes` |
| outbox | `fs-queues.reliable` |
| PACELC, Raft and leader election | `fs-dist` |
| consistent hashing | `fs-sysdesign.blocks` |
| React Compiler | `fs-react` 33 |
| container queries | `fs-css` 19 |
| PKCE | `fs-auth.oauth-oidc` |
| DORA | `fs-lead` 32 |
| "O of n log n" | `fs-en-core` 13 |
| Indian English | `fs-en-core` 28, `fs-en-live` 18 |
| PTAL | `fs-en-live` |
| request smuggling, cache poisoning | `fs-cybersec` |
| mass assignment | `fs-auth` 6 |
| gaps-and-islands | `fs-sql-ps` 6 |
| JWT alg pitfalls | `fs-auth` 2 |
| contract tests / Pact | `fs-testing` 4, `fs-fe-testing` 10 |
| declaration merging, variance | `fs-typescript` 19, 24 |
| micro-frontends | `fs-fe-state` 21 |
| graceful shutdown | `fs-node` |
| STRIDE | `fs-cybersec` |
| HIPAA, SOC 2 | `fs-cybersec.privacy` |
| maps and geocoding | `fs-integrations` 9 |
| bikeshedding, yak shaving, footgun | `fs-en-live` |
| BATNA | `fs-psych` |

**Missing:** IR35 and German contracting in `fs-career` (minor 12). Everything else in the sample is present.

**«Метод Loo».** The 7 steps are faithful to §5.0, including the constraints-as-hints and the B/U/D order.

**Pattern map.** It covers all 21 spec nodes, split into 31 patterns. It keeps the prerequisite order of §5.0:
hashing before window, recursion before backtracking and DP, trees before graphs, heaps before Dijkstra. Each pattern
has a card, recognition and waste drills, a transfer task, a pattern boss and unannounced mixed sets; there are also
60 constraint drills. The only part not finalized is the visuals (minor 15).

## Check 4 — decisions in §9 and the stage-1 order

- **Sound:** 9.1 storage and server verdict first; 9.3 Node via mocked I/O; 9.6 TL = `god`; 9.8 take-homes;
  9.11–9.13 local capstone, local intro recording, two-timeline simulator.
- **Needs rework:**
  - 9.4: present the real word total and options (M3).
  - 9.2: an explicit approval with effort and size (minor 8).
  - 9.5: the owner's uncommitted `[!talk]`/`[!write]` work is on the critical path for batch 1. Say so, and set a date.
- **Missing decisions:**
  - concept-ownership rule (M10);
  - variant budget (B2);
  - the server verdict for HTML/CSS and React (M5);
  - TTS accent voices for listening (English outline open question 3, not in the blueprint);
  - how the field bank gets Reddit and Glassdoor data without creating accounts;
  - the R2 shard cost (later, paid).
- **Stage-1 order:** dependency-correct for what it lists, but incomplete and unestimated (M4). The model units (step 8)
  should come before strict mode is switched on, because the audit warns that strictness without pools blocks
  learners. Pilot the 5 algorithm problems with the full variant budget from B2.

## Check 5 — research accuracy (12 sources opened 2026-11-08)

| Claim | Source | Holds? |
|---|---|---|
| Karat: 62% of organisations prohibit AI; US 38% allow; 400 leaders in US, India, China; Jan 2026 | karat.com | ✓ |
| Canva: AI-assisted coding replaces the CS Fundamentals screen; 2025-06-11 | canva.dev | ✓ (still assesses fundamentals inside) |
| Arc: senior $75–150; E. Europe $40–85; full-stack $60–130; AI/ML $110–190; 5,302 surveyed; 2026-05-26 | arc.dev | ✓ — E. Europe band is all levels (minor 9) |
| Lemon.io: 3+ years full-stack, 5+ for senior, Upper-Intermediate; median $35/h, $47 strong senior; $50–75 AI/edge | lemon.io | ✓ |
| Toptal: 26.4 → 7.4 → 3.6 → 3.2 → 3%; 3–8 weeks; test project 1–3 weeks | toptal.com | ✓ |
| OWASP Top 10:2025 list; SSRF merged into A01; A10 new | top10.owasp.org | ✓ |
| ASVS 5.0.0, 2025-05-30 | asvs.owasp.org | ✓ |
| DOU summer 2026: $3,500 / senior $4,500 / middle $2,500; n = 4,541; product $4,800, outstaff $4,650, startup $4,600; 2026-07-13 | dou.ua | ✓ (DOU labels it "outsourcing (outstaffing)") |
| DOU: ZONE3000 test tasks for ~80% of vacancies (from ~40%); Ciklum 60 min; Universe and Uklon; 2026-11-06 | dou.ua | ✓ |
| ITJobsWatch: Senior Full-Stack contract median £883/day; UK IT median £525 | itjobswatch | ✓, but n = 1 quoted rate (minor 11) |
| Google: Gemini code-comprehension pilot May 2026; wider rollout reported Oct 2026; grades AI fluency, prompts, validation, debugging | byteherald.com | ✓ — spokesperson: "remain pilot-phase" (minor 10) |
| UK IR35 private-sector reform from 2021-04-06; medium and large clients issue an SDS | ir35update.co.uk | ✓ |

No claim was false. Three need wording fixes (minor 9–11).

## Check 1 — completeness against the §10 stage-0 list

| Required item | Status |
|---|---|
| Branch and course status | ✓ (`platform-audit.md` §1) |
| Research §2 with a dated source log; tricky questions; stress practices; security formats and OWASP versions | ✓ |
| Field question bank with coverage plan | partial: bank ✓, coverage plan and % ✗ (M6) |
| Track and course list | ✓ with a wrong count (M2) |
| Skill graph with levels | ✗ — fragmented (B1) |
| Per-company and per-platform loop maps | ✓ maps; prep plans partial (minor 13) |
| Every course outline with exercise mix and counts | ✓; IV–VII without quiz pools (B2) |
| Problem catalog plan per pattern and type | ✓ per pattern; per type mostly by section lists |
| Runner plan with sizes and risks | partial (M5) |
| Readiness model | ✓ |
| Retention system and Knowledge Atlas | ✓; Atlas data model thin (minor 15) |
| English for IT outline | ✓ |
| Agent and model plan per stage | partial (M7) |
| Storage impact | ✓ with inconsistent projections (minor 3) |
| Mastery design with anti-gaming | ✓ designed; pool math broken (B2) |
