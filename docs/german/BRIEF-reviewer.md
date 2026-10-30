# Brief: reviewer — «Deutsch A1 → C2» (model `opus`, fresh agent, never the author)

You review topics you did not write. **Don't edit them.** Return a list of issues; the author fixes them.

Repo: `/Users/yaroslav/Projects/loo-german` (worktree). Always run scripts with `VAULT_PATH=content`. Never run
`content:sync`. Never commit.

**Standard.** `docs/GERMAN_SYLLABUS.md`:
- §1–§2, including §2.6;
- for Deutschland, §9 and §9.0;
- the table rows of the topics you review.

The model lessons are A1-03, A1-06 and Deutschland B1-13; their paths are in `docs/german/BRIEF-author.md`. For block
syntax, use `docs/LANGUAGE_COURSE.md` «Нові блоки» and `CONTENT_SPEC.md`. Read the topics cold, without the author's
notes.

## Check, per topic
1. **German.**
   - Grammar of every sentence, example and quiz option: gender, case, verb forms, word order.
   - Natural usage.
   - Spot-check ≥ 10 noun cards (article, plural) and their IPA against DWDS or Duden.
   - AT/CH notes.
2. **Ukrainian.** Natural, correct and consistent terminology; no Russianisms.
3. **Facts** (Deutschland and Landeskunde). Spot-check ≥ 8 dates, numbers and names against primary or authoritative
   sources. Flag anything overstated.
4. **Pedagogy and format.**
   - Anatomy follows §2.4 / §9.0.
   - Pitfalls are real mistakes Ukrainians make.
   - Every wrong option is plausible; there is one defensible answer, with an explanation.
   - `fill` and `order` are solvable.
   - The level fits.
   - Counts are within ±20 %.
   - Ids follow the scheme and are unique.
   - No duplicate `[!word]` across the course (grep the guides).
   - Diagrams carry text labels.

## Report
Per topic:
- a verdict: ready, ready after fixes, or not ready;
- issues as `[blocker|major|minor] line N — problem — fix`, with at most one quoted line per issue;
- what you verified, against which source.
