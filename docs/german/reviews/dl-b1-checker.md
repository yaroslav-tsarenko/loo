# Deutschland B1: mechanical check (haiku)

Scope: `content/Guides/Deutschland/Deutschland - B1 - 01 … 14.md` (§9.0, §9.3). Working-tree copies (B1-10, B1-11, B1-14 are modified and uncommitted). Read-only; nothing edited.

Targets used: W / L / S / Q / reels from §9.3 (±20 %); pitfalls 3–4; reels 5 (0 in B1-10, B1-11); diagrams ≥ 1; quizzes 12–14, each with `**Пояснення:**`; quiz fill/order ≥ 4; Landeskunde-Text ≈ 120–160 words.

| Chapter | W (syl.) | L (syl.) | S (syl.) | Quizzes | Quiz fill/order | Pitfalls | Reels | Diagrams | Landeskunde words | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 20 (20) | 4 (4) | 3 (3) | 13 | 4 | 4 | 5 | 1 | 124 | frontmatter fail |
| 02 | 20 (20) | 4 (4) | 3 (3) | 13 | 4 | 4 | 5 | 1 | 134 | ok |
| 03 | 20 (20) | 5 (5) | 3 (3) | 13 | 4 | 4 | 5 | 1 | 130 | ok |
| 04 | 15 (15) | 4 (4) | 3 (3) | 13 | 4 | 4 | 5 | 1 | 134 | ok |
| 05 | 20 (20) | 4 (4) | 3 (3) | 13 | 4 | 4 | 5 | 2 | 129 | ok |
| 06 | 20 (20) | 4 (4) | 3 (3) | 14 | 4 | 4 | 5 | 2 | 123 | ok |
| 07 | 19 (20) | 4 (4) | 3 (3) | 14 | 4 | 4 | 5 | 2 | 136 | ok |
| 08 | 20 (20) | 4 (4) | 3 (3) | 14 | 4 | 4 | 5 | 2 | 120 | apostrophes fail |
| 09 | 18 (20) | 4 (4) | 3 (3) | 14 | 4 | 4 | 5 | 2 | 129 | apostrophes fail |
| 10 | 22 (25) | 4 (4) | 3 (3) | 14 | 4 | 4 | 0 | 1 | 140 | ok (0 reels correct) |
| 11 | 20 (20) | 4 (4) | 3 (3) | 14 (syl. 10) | 4 | 4 | 0 | 1 | 124 | ok (0 reels correct); quiz count note |
| 12 | 24 (25) | 5 (5) | 3 (3) | 14 | 4 | 4 | 5 | 2 | 121 | apostrophes fail |
| 13 | 23 (20) | 5 (5) | 3 (3) | 14 | **3** | 4 | 5 | 2 | **166** | fill/order fail; Landeskunde over |
| 14 | 20 (20) | 5 (5) | 3 (3) | 13 | 4 | 4 | 5 | 1 | 132 | ok |

Checks that passed in all 14 files: quizzes all carry `**Пояснення:**`; ids match `dl-b1-NN-<w|l|s|p|q|c>NN` with no duplicates inside a file; no duplicate `[!word]` heading across `content/Guides/Deutsch*` (125 files) involving these files; every noun card has `der/die/das` and `forms:`; titles match §9.3; file names have no forbidden characters; IPA `ɔɪ̯` absent; no ASCII apostrophe in B1-01 to B1-07, B1-10, B1-11, B1-13, B1-14.

## Problems

- Deutschland - B1 - 01 — frontmatter has no `prerequisites` field.
- Deutschland - B1 - 08 — 28 ASCII apostrophes in Ukrainian words (e.g. `перемир'я`, `об'єднання`); must be `ʼ`.
- Deutschland - B1 - 09 — 14 ASCII apostrophes in Ukrainian words (e.g. `в'язку`, `з'явився`); must be `ʼ`.
- Deutschland - B1 - 12 — 21 ASCII apostrophes in Ukrainian words (e.g. `перемир'я`, `об'єднання`); must be `ʼ`.
- Deutschland - B1 - 13 — 3 quiz fill/order (q05 order, q08 fill, q13 order); needs ≥ 4. The `[!listen]` fill block `l05` is not counted as a quiz.
- Deutschland - B1 - 13 — Landeskunde-Text is 166 words; target ≈ 120–160.

## Notes (not failures)

- B1-11 has 14 quizzes; §9.3 says 10 (±20 % would cap at 12). It is inside the 12–14 target in the brief.
- §9.3 gives 4 reels for B1-04, 08, 14; the brief target is 5. All three have 5, so no problem either way.
- B1-10 and B1-11 have 0 reels, as intended.
- Four `[!word]` headings repeat across other Deutsch* files (none involving B1 Deutschland), so none is listed here.
- `content:check Deutschland` summary: 14 chapters parsed, "Проблем немає". It also printed "20 навчальних одиниць без явного id — використано детермінований хеш"; none of those units are blocks in these B1 files (all blocks carry explicit ids).
- `diagram:check`: 713 schemas, 0 problems. 15 ASCII-diagram warnings exist in other guides (Next.js, Next.js Start); none in Deutschland B1.
