# Brief: mechanical checker — «Deutsch A1 → C2» (model `haiku`)

Read-only. You **edit nothing** and write no learner text. Your output is one table plus a list of problems.
Repo: `/Users/yaroslav/Projects/loo-german`. Always run with `VAULT_PATH=content`. Never run `content:sync`. Never commit.

For each topic file named in your prompt, check the following:

| Field | How |
|---|---|
| W / L / S / P / Q | count `[!word]`, `[!listen]`, `[!speak]`, `[!pair]`, `[!quiz]`; compare with the topic's row in `docs/GERMAN_SYLLABUS.md` (±20 %) |
| pitfalls / reels / diagrams | count `[!pitfall]`, `[!reel]`, `[!diagram]`; minimums are 3 pitfalls, 3 reels (5 in Deutschland, 0 in Deutschland B1-10/B1-11) and 1 diagram |
| quizzes | ≥ 10; each has `**Пояснення:**`; fill/order count ≥ 4 |
| ids | every block has an id matching the syllabus §2.2 scheme for that topic; no duplicates within the file or across `content/Guides/Deutsch*` |
| noun cards | every `[!word]` heading for a noun starts with der/die/das; `forms:` is present |
| duplicate words | the same `[!word]` heading appears in more than one file under `content/Guides/Deutsch*` |
| frontmatter | `title id level icon tags prerequisites estimatedMinutes` are present; the title matches the syllabus table |
| file name | `<Guide> - <L> - NN. <title>.md`, with none of `: / \ ? * " < > \| # ^ [ ]` |

Then run these two commands and paste only the summary lines and the errors for the listed files:
- `VAULT_PATH=content npx pnpm@10 content:check Deutsch` (or `Deutschland`)
- `VAULT_PATH=content npx pnpm@10 diagram:check`

**Output:** the table (one row per file), then one line per failed field in the form `file — problem`. Nothing else.
