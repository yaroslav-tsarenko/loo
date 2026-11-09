# Review: stage 1a storage, steps 0–3 (`fs/storage`, 4 commits on `feature/fullstack-zero-to-pro`)

Reviewer: independent. Scope: `c5f0bb8..326f956` against [01-storage.md](01-storage.md) §8 steps 0–3.
Date: 2026-11-09.

## What was verified

| Check | Result |
|---|---|
| `npx pnpm@10 typecheck` | clean |
| `npx pnpm@10 test` | 57 files, 1324 tests, all pass |
| `npx next build` | passes; `.next/server/app/tasks/page.js.nft.json` traces `guides.v8.br`, `manifest.json`, `units-sync.json.br` |
| `VAULT_PATH=content npx pnpm@10 content:measure` | monolith 175.2 MB / 680 ms, search +130.4 MB / 3.45 s, bundles 22.8 MB / 132 ms |
| Real-content script against the prebuilt snapshot (23 455 units) | old runtime fingerprint == new manifest fingerprint (`591a0ad8…`); rows file == rows from memory (JSON-equal); 0 units with `level` null or undefined; 0 tasks with `titleText` > 240 chars; 0 `unitsByChapter` entries missing from `units`; per-chapter order of `units` == `unitsByChapter` (vocab order kept); 0 flashcards with `word === null` |
| `as LearningUnit` / `as TaskUnit` / `as unknown as` casts hiding a body read | none new. The only body-typed casts are in `content/i18n/localize.ts`, and they predate this branch |

Call sites I checked for behaviour against the old code: the study session (`renderStudyItems`, including the
placement fallback), the reader (`g/[guide]` and `UnitBlock`), tasks (list, pager, `?unit=`), mistakes, practice
(`hasWord`), feed (reel bodies loaded in parallel with the units), lessons (`renderLessonItems`, localized reels),
placement replay, tests (`submitTest` and `recordTestSkills`), the vocab API, speech, answers, search, the reels cron,
counts and units sync. I found no behaviour change on any of them.

- **Placement replay grades the same as before.** `replayPlacement` calls `unitOf` only for ids in `input.answers`,
  so loading bodies for the answered ids only is enough. `getPlacementUnit` reads the same global `placementUnits`
  map as before. `exerciseUnits` keeps the `bundle.exercises[id]` filter that `exerciseUnit` had.
- **The fingerprint change triggers no resync on today's data.** The two fingerprints are identical because no unit
  has a null level. If one ever did, the change (`null` → `''`) would cause one resync. That resync is idempotent:
  every row is upserted with the same values, `firstSeen` is kept, and only `lastSeen` changes. `fresh` and
  `missing` are both empty, so nothing gets aliased or deleted.
- **`cache()` is used correctly.** It is request-scoped, with a string key for `getUnits`. `renderStudyItems` copies
  the cached `Map` before it adds placement units, so the cached value is not mutated. Nothing is shared across
  requests.

**No blockers. No majors.** 8 minor issues and 8 nits follow.

---

## Minor

### m1. `forEachGuideText` drops the text of guide index chapters
`src/content/store.ts:588-591`

It iterates `guide.chapterIds`, which leaves out each guide's index/overview chapter. On real content
`plainText` has 843 chapters, but `forEachGuideText` yields 827. The 16 missing ones include `english/_guide`,
`deutsch/_guide`, `js-interview/_guide`, `android/Зміст` and `nodejs/Node.js - Зміст`.

- **Impact today:** none. The reels cron only reads `readableChapters`, which excludes `kind === 'index'` anyway.
  Search still reads `searchSource()`, the full snapshot.
- **Why it matters:** the API comment promises "the plain text of every chapter", and §3.1 plans the per-guide
  `text` section on this contract. Step 6 or a later search move would silently lose the index pages, which
  `search.ts` indexes today. `tests/unit/unit-meta.test.ts` ("hands the chapter texts out guide by guide") only
  asserts over `guide.chapterIds`, so it locks the gap in.
- **Fix:** iterate the chapters by `chapter.guideId`, for example
  `[...chapters.values()].filter((c) => c.guideId === guide.id)`, or add the guide's index chapter. Make the test
  compare `seen` with the whole of `full.plainText`.

### m2. Bodies are loaded inside the DB transaction in `submitTest`
`src/server/actions/tests.ts:99`

`await exerciseUnits(test.bundle, built.questions)` runs inside the `userScope(async (tx, …))` callback. Today that
is a memory lookup. After step 5 it becomes pack reads (brotli + `JSON.parse`, several chapters) while a Postgres
transaction is open and its pooled connection is held.

- **Fix:** move `drawTest` and `exerciseUnits` in front of `userScope`. `attemptSeed(user.id, input.attempt)` only
  needs `user.id`. Keep the `record.lastSeed !== seed` check inside the transaction.

### m3. The units-sync fingerprint still ignores `kind`, `qtype`, `frequency`, `guideId` and `idSource`
`src/content/units-rows.ts:36-39`

The fingerprint hashes `id|chapterId|level|label` only. A content edit that changes only a quiz `mode`, a task
`difficulty` or a card `frequency` leaves the fingerprint unchanged. The `units` table then keeps a stale
`qtype`/`frequency`. This bug predates the branch and the hash format was kept byte-for-byte on purpose (good, no
resync).

- **Fix:** now that the rows are built at build time, hash the whole row (`JSON.stringify(row)`). Do it in its own
  PR and say in the commit that it causes one idempotent resync per environment.

### m4. Step 2 lacks the `syncUnits` behaviour test the spec asks for
`tests/unit/units-sync-source.test.ts`

The spec (§8, step 2) asks for a "units-sync behaviour test (same rows, aliases)". The new test covers the source
(fingerprint and rows from the manifest, fallbacks), but `syncUnits` itself has no test with the new `UnitRow` shape.
The alias path (`unit.label` vs `row.label`, `row.kind`/`chapterId` matching) changed types and has no test.

- **Fix:** add a DB-less test with the `getDb`/`readSystem` mocks used elsewhere, or a pglite one. Feed it a renamed
  hash-id unit and assert the alias, the progress moves and the fingerprint write.

### m5. Two resident copies of the unit table during the transition
`src/content/store.ts:64-87`

`toIndex` builds `UnitMeta` objects (with labels) for every unit and placement unit, on every cold start and on every
dev reload. The store keeps both `full` and `snapshot`. Measured: monolith heap 175.2 MB, against 170.7 MB in §1
(+4.5 MB), and about +30 ms cold time.

This is expected until step 5, and the label work used to happen in the runtime fingerprint anyway. Still:

- **Fix:** record the new baseline in the stage report, so step 5's gain is measured against 175 MB and not 170.7 MB.

### m6. `content:measure` covers only part of the step-0 contract in §1
`scripts/measure-content.ts`

- There is no `--assert` flag, although §1 and §7 document `pnpm content:measure [--assert]`.
- The 2-largest-bundles scenario measures all 4 bundles instead.
- There is no number for the document/localized LRU, which R8 asks for.
- There is no per-guide size table.
- It is not wired into CI, while step 0 says "runs in CI, report only".
- `prebuilt: snapshot.scanMs < 5000` is a heuristic and can lie on a slow machine.

**Fix:**
- Either trim §1 to what step 0 ships, or add `--assert` as a no-op stub that exits 0 until the budgets exist.
- Report `prebuilt` from the store. For example, expose whether `fromPrebuilt` hit (`store.source` / a getter)
  instead of guessing from the time.

### m7. The 240-char `label` replaces `titleText` on the tasks page
`src/app/tasks/page.tsx:82,92,172`

The old code rendered the full `titleText`; the new code renders `label = titleText.slice(0, 240)`.

- **Today:** no visible regression. No task title on real content is longer than 240 chars.
- **Lessons:** `src/content/lessons.ts:86` truncates to 48 right after, so the output there is identical.
- **Latent:** a long title would be cut without an ellipsis.

**Fix:** either keep it and add a line to the `UnitMeta.label` comment ("≤ 240 chars; used as the task title"), or
add `…` when `label.length === 240`.

### m8. The placement replay loads exercise bodies in bank mode
`src/server/actions/courses.ts:197-199`

`exerciseUnits(bundle, answered)` runs even when `bundle.placement.bank` is set. In that mode `placementUnitOf`
never calls `courseUnit`, so these are wasted body reads, which become real pack reads after step 5.
`bankIds` is likewise empty in course mode.

- **Fix:** branch on `bundle.placement.bank` and load either the bank units or the exercises, not both.

---

## Nits

### n1. Unused API
`src/server/content.ts:81-89`, `src/content/store.ts:578`

`getChapterReels`, `getPlacementUnits` and `ContentStore.placementUnits(guideId)` have no callers. Either drop them
or note that step 5 needs them. `placementUnits(guideId)` also scans the whole placement map on each call.

### n2. Stale comment on `RenderEnv.units`
`src/ui/markdown/render.tsx:26`

The comment still says "a translated page: its units". The reader now always sets `units` to the chapter's bodies,
translated or not.

### n3. Redundant `Map` copy
`src/server/services/lessons.ts:75`

`getReels` is not `cache()`d and already returns a fresh `Map`, so `new Map(await getReels(...))` is a needless
copy. Keep the copy only if `getReels` becomes cached.

### n4. Source object built before the marker check
`src/server/content.ts:35`

`await getContentStore().unitsSync()` builds the source object on every `getContent()`, before `syncUnits` checks its
in-process marker. It is cheap, but you could pass the store (or a thunk) and resolve the source only after a marker
miss.

### n5. Type predicate that narrows nothing
`src/server/services/filter-options.ts:28`

`.filter((u): u is UnitMeta => u.kind === kind)` narrows `UnitMeta` to `UnitMeta`. A plain `.filter((u) => u.kind === kind)` does the same.

### n6. Formatting
- `src/server/content.ts:55-56`: a double blank line.
- `scripts/content-snapshot.ts:9`: a comment line of about 190 chars, while the rest of the file wraps at about
  120. Rewrap it.

### n7. Test reaches into a private field
`tests/unit/units-sync-source.test.ts:39`

The test reads `prebuiltUnits` through `as unknown as`. The next assertion (fingerprint equality) already proves
the manifest path was taken only if you also assert `source.fingerprint() === manifest.unitsFingerprint`. Do that
and drop the private access.

### n8. Spec deviation in the placement API
`src/server/actions/courses.ts:199`

§2 row 14 says "placement loads `store.placementUnits(guideId)`". The code instead fetches one `getPlacementUnit` per
answered id. That is fine, and better for laziness, but update the spec row, or n1 stays dead code.
