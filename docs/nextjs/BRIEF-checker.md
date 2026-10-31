# Brief: mechanical checker (model `haiku`)

Read-only. You **edit nothing**; you produce one table. Repo root `/Users/yaroslav/Projects/loo-nextjs`; always
`VAULT_PATH=content`; never run `content:sync`, never commit.

For each topic file your prompt lists, report:

| Field | How |
|---|---|
| words | whitespace tokens of the whole file excluding fenced code blocks and inline code |
| quizzes by mode | count `[!quiz]` blocks; mode from the block header (`output/single/multi/fill/order`) |
| cards by level | `[!question]` under `### 🟢 Junior` / `### 🟡 Middle` / `### 🔴 Senior` |
| interview / reels / tasks / diagrams | count `[!interview]`, `[!reel]`, `[!task]`, `[!diagram]` |
| leftover markers | any `<!-- EX:` line (must be 0 after the exercise author) |
| ids | every quiz/card/task/int has an explicit id matching `^<topic id>-(quiz|card|task|int)-\d\d$`; duplicates; gaps |
| 📚 lines | every card and interview ends with a `📚` line |
| frontmatter | `title id slug order level skill icon tags prerequisites estimatedMinutes nextVersion` present; `id`/`slug` match `docs/nextjs/ids.md` |
| wiki-links | every `[[…]]` target exists under `content/Guides/` or is listed in `docs/nextjs/ids.md` |
| minimums | compare with `docs/nextjs/BRIEF-writer.md` «Volume and mix» → `ok` / list what is short |

Then run and paste only the summary lines (errors for the listed files):
`VAULT_PATH=content npx pnpm@10 content:check "Next.js"`, `VAULT_PATH=content npx pnpm@10 diagram:check`.

Output: the table (one row per file) + a list `file — problem` for every failed field. Nothing else.
