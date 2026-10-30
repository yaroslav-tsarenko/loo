# Brief: exercise author (stage 3+, model `sonnet`)

You add the exercises to **one** topic whose prose a writer (`opus`) has already finished. Repo root
`/Users/yaroslav/Projects/loo-nextjs` (worktree, branch `feature/nextjs-course`). Always `VAULT_PATH=content`; never run
`content:sync`; never commit; never touch other files; propose shared-doc edits in your report.

## Read first (only these)
1. Your topic file, end to end — the prose is your source. Don't rewrite it; you may fix an obvious typo and say so.
2. The writer's report your prompt quotes — especially **🧪 verified facts** (observed on Next.js 16.3.8): build `output`
   quizzes on them, not on memory.
3. `docs/nextjs/STYLE.md` §3–§4, `docs/NEXTJS_SYLLABUS.md` §3.2, §5.2 and **§13**.
4. Exercise sections of the model topic `content/Guides/Next.js/Next.js - 07. Server і Client Components.md`
   (`## 🤔 Передбач`, inline quizzes in 🔬, `## ⚡ Фішки`, `## 🧠 Закріплення`, `## 🛠️ Практика`) — copy the format
   exactly. Block syntax: `CONTENT_SPEC.md` §2–§4, §8, §14.

## What you write
Replace every `<!-- EX:… -->` marker with real blocks; **no marker may remain**.
- `EX:pretest` → the 🤔 quiz (first quiz of the topic).
- `EX:quiz mode=…` → a `[!quiz]` in that mode, on that point. Total ≥ 9 incl. pre-test: ≥ 2 `output`, ≥ 1 `order`,
  ≥ 1 `fill`, rest single/multi. Every wrong option is a real developer mistake; `**Пояснення:**` says why it is wrong.
  `output` = predict the result (where code runs, build symbol ○/◐/ƒ, what is cached, revalidation timing, status
  code, headers, streaming order) — one defensible answer.
- `EX:reels` → ≥ 5 `[!reel]` (short surprising facts from the prose; titles are ids — keep them final).
- `EX:cards` → ≥ 12 `[!question]-` cards under `### 🟢 Junior`, `### 🟡 Middle`, `### 🔴 Senior`; each ends with a `📚` line.
- `EX:task …` → `[!task]` with ` ```ts starter `/` ```ts tests ` (or `js`) and a `[!solution]`; 3–6 tests named in
  Ukrainian by behaviour. The runner has no network, `import`, `Request`, JSX — pure logic only.
- Ids: `<topic id>-<quiz|card|task>-<nn>`, two digits, from 01, in file order, unique. Don't touch `-int-` ids.
- Level fit: exercise meta `level` within the topic level ± 1 (`junior…god`); Ukrainian per the glossary
  `content/glossary/uk-en.yaml`.

## Verify
- Each task: reference passes and starter fails via `scripts/lib/task-check.ts` `selfTest` (tsx script in your scratch
  dir, file names prefixed with your topic id); one plausible wrong solution must fail at least one test.
- `VAULT_PATH=content npx pnpm@10 content:check "Next.js"` — no errors in **your** file (ignore siblings in progress).

## Report (short; no pasted content)
File; counts: quizzes by mode, cards by level, reels, tasks (lang); selfTest results per task (+ the wrong solution and
which test caught it); any prose issue you noticed (line, problem) — for the writer, not fixed by you; open questions.
