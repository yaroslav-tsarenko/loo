# Brief: reviewer / fact-checker (stage 2+, model `opus`)

You review topics you did **not** write. You **do not edit** topic files — you return a list of issues; the author
fixes them. Repo root `/Users/yaroslav/Projects/loo-nextjs` (worktree, branch `feature/nextjs-course`; `VAULT_PATH=content`). Never commit. Keep scratch
files outside the repo; prefix scratchpad files with `review-<topic id>-`. Other agents run in parallel: use an
isolated headless browser (repo `playwright-core`, `channel: 'chrome'`) or `curl` for runtime checks, your own ports,
stop only your own processes.

## Standards
`docs/nextjs/STYLE.md`, `docs/nextjs/BRIEF-writer.md` (volumes, mix, verification rules), `docs/NEXTJS_SYLLABUS.md`
§1, §2 (the topic's goals), §3, §5.2, **§13**, `docs/nextjs/stage2-notes.md` (verified 16.3.8 findings from other
writers — use them to catch contradictions between topics), `docs/LEARNING_PLAYBOOK.md` §2–§7, `CONTENT_SPEC.md`. The
model topic: `content/Guides/Next.js/Next.js - 07. Server і Client Components.md`. Facts: `node_modules/next/dist/docs/`
(Next.js 16.3.8), react.dev, primary sources.

## Check, per topic
1. **Accuracy.** Every claim vs the bundled docs. Wrong / outdated / overstated / unverifiable statements with line
   numbers and the contradicting doc path. **Independently reproduce the topic's 2–3 most surprising claims** (anything
   flagged as differing from the docs, any `[!warning]`) in your own scratch app (`cp -cR /tmp/nextjs-scratch-base
   /tmp/nextjs-review-<topic id>`; Next 16.3.8, react 19.3.0, `cacheComponents: true`) and report what you observe.
2. **Consistency across topics.** Contradictions with other written topics and with `stage2-notes.md`.
3. **Exercises.** Right answers marked; distractors are real mistakes; explanations correct; `output` quizzes have
   one defensible answer; order/fill solvable; ids unique and per scheme; 📚 line on every card/interview; mix and
   minimums per BRIEF-writer. Tasks: run reference solution and starter through `scripts/lib/task-check.ts`
   `selfTest` (solution passes, starter fails) and try **one plausible wrong solution** — does a test catch it?
4. **Pedagogy & format.** Anatomy (🎯, 🤔 pre-test before theory, 🧒, 🔬, 🏭, ⚠️, 🎤, 🔗, ⚡, 🧠, 🛠️, 📚, Підсумок),
   level fit (Start = true beginners), no padding or author-process wording («ми перевірили», «скретч»), length within
   STYLE ranges, terminology per `content/glossary/uk-en.yaml`, Ukrainian quality, wiki-links only to existing or
   ids.md-listed files, `[!diagram]` text labels.
5. **Sources.** Spot-check 5 URLs with curl.

## Report (structured, short; at most one quoted line per issue)
Per topic: verdict (ready / ready after fixes / not ready); reproduced claims with observations; issues as
`[blocker|major|minor] [prose|exercise] line N — problem — fix` (the tag routes the fix: prose → the writer, exercise →
the exercise author); what you verified vs. could not.
