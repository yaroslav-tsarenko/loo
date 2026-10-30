# Brief: chapter writer + exercise author (stage 2+)

Shared brief for every writer agent of the course "Next.js Zero → Pro". Your own prompt names **the exact file(s) you
own**; everything else here applies to all writers. Repo root: `/Users/mac/dev/projects/interviewer` (branch
`feature/nextjs-course`). Never commit, never touch files you don't own, never edit shared docs (propose changes in
your report).

## Read first
1. `docs/nextjs/STYLE.md` — binding style guide.
2. `docs/NEXTJS_SYLLABUS.md` — §1 skills, your topic's row in §2.1/§2.2 (goals), §3 (exercise mix), §5.2 (what tasks
   can test), **§13 (corrections — they override the tables)**.
3. `docs/nextjs/research/<skill>.md` for your topic's skill — verified facts with doc paths. Trust it, but re-verify
   anything you build on against the bundled docs.
4. `docs/nextjs/ids.md` — your topic's `id`, file name and `slug` (use them exactly); the other titles of the batch
   (you may wiki-link to any file listed there or already existing; nothing else).
5. The model topic end to end: `content/Guides/Next.js/Next.js - 07. Server і Client Components.md` — match its
   format, depth, tone and exercise style. Don't duplicate its content; link to it.
6. Block syntax: `CONTENT_SPEC.md` §2–§4, §8, §14; anatomy: `docs/LEARNING_PLAYBOOK.md` §2–§7.
7. Source of truth for facts: `node_modules/next/dist/docs/` (Next.js 16.3.8); react.dev and other primary sources
   for non-Next topics. Raw material only (check freshness, never copy): `content/Guides/Next.js (архів)/` and
   `content/Guides/React/`.

## Volume and mix
- Main guide topic: 5–6.5k words of prose (code excluded); ≥ 9 quizzes (≥ 2 `output`, ≥ 1 `order`, ≥ 1 `fill`; the
  first is the 🤔 pre-test), ≥ 12 cards (Junior/Middle/Senior headings), ≥ 4 `[!interview]`, ≥ 5 `[!reel]`,
  ≥ 3 `[!task]` with tests (at least one in `ts`), ≥ 2 `[!diagram]`.
- `Next.js Start` topic (beginners, level `noob`): 2.5–4k words; ≥ 8 quizzes (≥ 1 `output`, ≥ 1 `order` or `fill`),
  ≥ 8 cards, ≥ 3 reels, ≥ 2 tasks with tests, ≥ 1 diagram; `[!interview]` optional. Explain every term on first use;
  assume no prior React/Next knowledge except the earlier Start topics.
- Ids: `<topic id>-<quiz|card|task|int>-<nn>` (two digits, from 01). Every quiz/card/interview/task has an explicit
  id. Each card and interview ends with a `📚` line; topic ends with «📚 Джерела та що почитати» and «Підсумок».

## Verification (mandatory)
- Every TS/TSX example is built in your own scratch app: `cp -R /tmp/nextjs-scratch-07 /tmp/nextjs-scratch-<your id>`
  (Next.js 16.3.8, react 19.3.0, `cacheComponents: true` — already installed; if it's missing, create it per
  STYLE §4), drop your examples in, `npm run build` (and `npm start` / `next dev` + the browser pane or `curl` when the
  claim is about runtime behaviour). Examples that teach an error: confirm the real error text. If the behaviour
  differs from the docs, write what 16.3.8 does and add a `> [!warning]` with the doc link (STYLE §4).
- `VAULT_PATH=content npx pnpm@10 content:check "<your guide>"` — no errors **in your file** (other writers are
  editing sibling files at the same time; ignore their in-progress problems and say so).
  `VAULT_PATH=content npx pnpm@10 course:check nextjs-zero-to-pro` — confirms your starters fail (it may show other
  writers' issues; report only yours). Try one plausible wrong solution per task against your tests.
- `VAULT_PATH=content npx pnpm@10 diagram:check` for your diagrams. `curl` every source URL (200).

## Working alongside other agents
- Several writers run at once. **Browser:** the shared browser pane is unreliable under parallel agents (others can
  navigate your tab). For runtime/network checks use an **isolated headless browser**: a script with the repo's
  `playwright-core` (`chromium.launch({ channel: 'chrome' })`) kept in your scratchpad, recording requests/console.
  If you use the pane at all, open your own tab (`tabs_create`), pass its `tabId`, and re-check its URL before acting. **Servers:** pick a free port (`next start -p 34NN`, NN = your topic number
  + an offset), stop only the processes you started (by PID or your port), never `pkill` broadly.
- **Scratchpad** is shared: prefix every file name with your topic id.
- A dev-server compile error in one route breaks every route of that app — reproduce intentional errors in a
  separate `-cases` copy of your scratch app.
- Word count: whitespace tokens with code fences and inline code excluded.
- Start topics: write exercise meta `level: junior` (content parsing drops `noob`; the section forces noob).
  `course:check` doesn't test Start starters until the lead activates those sections — run your starters and one wrong
  solution through `scripts/lib/task-check.ts` `selfTest` yourself.

## Report (short, structured; no pasted content)
File(s); prose word count (excluding code); exercise counts by type and quiz mode; examples verified (how) and any not
verified; behaviours that differ from the docs; check results for your file; open questions; proposed edits to
STYLE / glossary / syllabus.
