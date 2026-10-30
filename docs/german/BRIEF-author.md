# Brief: topic author — «Deutsch A1 → C2» (model `sonnet` for A1–B2 and Deutschland, `opus` for C1–C2)

You write **complete topics** (all blocks) for the Loo German course. Learners are Ukrainian speakers, so explanations
are in Ukrainian and examples are in German with a Ukrainian translation. Your prompt names **the exact files you own**.

**Repo:** `/Users/yaroslav/Projects/loo-german` (git worktree, branch `feature/german-course`).
- Always use `VAULT_PATH=content`.
- Never run `content:sync`.
- Never commit.
- Never touch files you don't own: other authors write sibling files at the same time.
- Never edit shared docs (the syllabus, this brief, `course.yaml`, `_guide.md`). Propose changes in your report.

## Read (only these)
1. `docs/GERMAN_SYLLABUS.md`:
   - §1 (principles, mistakes of Ukrainians);
   - §2 including **§2.6** (binding decisions);
   - your level's table rows: title, id, kind, goals, W/L/S/P/Q;
   - for Deutschland chapters: §9 and **§9.0**.
2. Your model lesson, end to end. Match its format, depth and block density:
   - grammar / pronunciation / listening / review: `content/Guides/Deutsch/Deutsch - A1 - 03. Особові займенники й дієслово sein.md`;
   - vocabulary / skills / topics heavy in word cards: `content/Guides/Deutsch/Deutsch - A1 - 06. Артикль і рід — der, die, das, ein, eine.md`;
   - Deutschland: `content/Guides/Deutschland/Deutschland - B1 - 13. 1989–1990 — мирна революція й обʼєднання.md`.
3. Block syntax: `docs/LANGUAGE_COURSE.md` «Нові блоки» and `CONTENT_SPEC.md` (quiz single/multi/fill/order, reel, diagram).

Don't read anything else in the repo.

## Rules
- **File name:** `content/Guides/<Guide>/<Guide> - <L> - NN. <Назва з таблиці>.md`, with the title exactly as in the syllabus table.
- **Ids:** follow syllabus §2.2, unique; never change an id after you publish it.
- **Counts:** W/L/S/P/Q within ±20 % of your row. Every topic needs ≥ 10 `[!quiz]`, 3–4 `[!pitfall]`, 3 `[!reel]` (Deutschland: 5) and ≥ 1 `[!diagram]`.
- **German must be correct:**
  - every noun card has its article and plural;
  - IPA in Duden notation;
  - AT/CH variants go in `note:`.
  - When unsure, check DWDS or Duden (WebFetch).
- **One word = one card across the course:** before writing a `[!word]`, grep the guides for it (§2.6 п. 10). If it is already carded, only use it in examples.
- **Quizzes:**
  - every wrong option is a real learner mistake;
  - every quiz has `**Пояснення:**`;
  - A1–A2 `fill` usually takes a `bank`.
- **Deutschland facts:**
  - every date, number and name has a source (bpb.de, bundesregierung.de, hdg.de/lemo, dhm.de, britannica);
  - contested facts are stated as contested;
  - B1-10 and B1-11 have no reels, no emoji, no jokes.
- **Sources:** real ones only, `curl` → 200 (goethe.de is the exception per §2.6).
- **No process wording** in learner text («ми перевірили», «за моїм пошуком»).

## Verify
- Run `VAULT_PATH=content npx pnpm@10 content:check Deutsch` (or `Deutschland`).
- It must show no errors **in your files**. Broken-link warnings to topics that don't exist yet are fine.

## Report (short, no pasted content)
- Files written.
- Counts per file: W / L / S / P / Q / pitfalls / reels / diagrams.
- Words you checked in DWDS or Duden (how many).
- Anything uncertain.
- Words you skipped because they were already carded.
- Proposed syllabus edits.
