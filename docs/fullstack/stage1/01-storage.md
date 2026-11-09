# Stage 1a · step 1: lazy content storage with a heap budget (design)

Status: **implemented on `fs/storage` (steps 0–9, see §10)**. Blocker 1 in
[FULLSTACK_TRACK.md §5.1](../../FULLSTACK_TRACK.md) and §10, [platform-audit.md §6](../platform-audit.md).
Date: 2026-11-09, branch `feature/fullstack-zero-to-pro` (merged with `origin/main`, German course included).

**Goal:** stop loading the parsed content of every guide into every server instance. Content loads on demand under a
hard heap budget, and no existing page changes its behaviour.

---

## 1. Baseline (measured today)

Measured on this worktree: Node 25.7.0, 17 guides, 843 chapters, **23 455 units** (17 822 at the audit),
643 placement units, 1 627 reels. The throwaway scripts are in `/tmp/loo-measure/*`. Each was run in a fresh process
with `--expose-gc`, and heap is `heapUsed` after a forced GC, minus the baseline before loading.

| What | Value | Note |
|---|---|---|
| `buildPrebuilt` (full parse + serialize) | 16.7 s | build time |
| Monolithic snapshot `guides.v8.br` | **14.0 MB** brotli | was 10.9 MB at the audit, 3.5 MB in PERFORMANCE.md |
| **Heap after a cold `ContentStore.get()` from the prebuilt** | **170.7 MB** in 650 ms (RSS 0.69 GB with search) | the audit had 133.7 MB; German C1/C2 and the exams added 37 MB |
| Search index, built on the first search | **+130.4 MB**, 3.46 s CPU | an instance that served one search holds ≈ 300 MB |
| Serialized share of the snapshot | `units` 64.7 MB · `unitsByChapter` 63.9 (same objects) · `plainText` 28.6 · reels 2.7 · placement 2.6 · chapters 1.8 · links 0.5 · backlinks 0.1 | |
| Course bundles, all 4, `JSON.parse` + zod | **22.8 MB** heap, 192 ms | files: deutsch 4.9 MB, english 4.1, js 0.9, next 0.5 |
| Bundle heap, one course | english 9.3 MB · javascript 2.7 MB | bundle `exercises` maps: 11 429 / 9 375 / 1 759 / 872 entries |
| Traced files per function (old build in the main repo, 2026-10-31) | 69 MB, of which 31 MB `content/**` and 7 MB snapshot | today: 28 MB `Guides` + 9.9 MB `courses` + 14 MB snapshot |

Per guide, with the shard prototype (units + plainText + reels + placement):

| Guide | Chapters | Units | Raw v8 | Brotli | Heap when loaded alone |
|---|---:|---:|---:|---:|---:|
| english | 166 | 9 375 | 30.9 MB | 4.36 MB | **52.7 MB** (35.3 MB without mdast `position`s and plainText) |
| deutsch | 166 | 9 221 | 32.3 MB | 4.35 MB | **55.9 MB** (37.5 MB lean) |
| deutschland | 33 | 1 390 | 5.2 | 0.70 | — |
| deutsch-pruefungen | 12 | 818 | 3.1 | 0.41 | — |
| nextjs | 20 | 631 | 7.3 | 0.96 | 11.5 MB |
| javascript | 34 | 853 | 5.9 | 0.79 | 9.5 MB |
| js-interview / js-katas / js-projects / js-start / nextjs-start | 12 / 9 / 8 / 10 / 12 | 354 / 187 / 133 / 232 / 241 | 4.4 / 1.9 / 2.1 / 1.0 / 2.0 | 0.52 / 0.23 / 0.21 / 0.14 / 0.28 | 3 JS guides: 22 MB |
| react, nextjs-archive, android, kotlin, nodejs, postgresql | 177, 62, 28, 26, 26, 26 | 0–10 | ≤ 1.3 | ≤ 0.21 | — |

Combined loads:
- index + english + deutsch + deutschland: **124 MB**;
- index + english + nextjs + javascript: 81 MB.

Smaller structures:
- one chapter chunk: ≈ 0.3 MB of heap;
- largest chunk: 33 KB brotli;
- 10 English chapters: 1.7 MB;
- prototype index (guides, chapters, links, backlinks, translations, issues, unit→guide map): 0.23 MB brotli, 7.7 MB heap, 18 ms;
- unit metadata, 23 455 rows: 10.2 MB heap as objects, **2.5 MB** columnar (8.4 MB at ×3 units).

Encoding a chunk, English units:
- JSON+brotli: 2.18 MB, decodes in 130 ms;
- v8+brotli: 2.48 MB, decodes in 148 ms.

**Conclusion that shapes the design:** sharding per guide is not enough. On Fluid compute one instance serves all
learners at once. English and German together already need 110 MB. At track scale (≈ 51k units) any guide-sized
residency breaks the ≤ 60 MB target. So the **guide** is the unit of build, manifest and ownership, and the
**chapter** is the unit of loading.

### Reusable measurement: `scripts/measure-content.ts` (to add in step 0)

`pnpm content:measure [--vault content] [--json] [--assert]` runs with `node --expose-gc`. Every number above comes
from a fresh child process per scenario:

- heap and time for the monolith (as long as it exists);
- heap and time for the index plus resident metadata;
- heap for the index plus every chapter of the 3 largest guides, read through the LRU;
- heap for the 2 largest bundles;
- heap for the search index;
- shard and bundle sizes per guide and course.

`--json` writes `tmp/measure-content.json` for stage reports (FULLSTACK_TRACK §10 asks for this every stage).
`--assert` exits non-zero when it exceeds the budgets in §7.

---

## 2. Call-site inventory

Today there is **one entry point**: `getContent()` in `src/server/content.ts`. It returns `ContentSnapshot` with sync
maps, and the layout calls it through `shellData()` on every page. It has 21 importers. `ContentSnapshot` is a typed
parameter in 35 files, and code reads unit-level fields (`units`, `unitsByChapter`, `plainText`, `reels`,
`placementUnits`) on 54 lines. Most callers need only **unit metadata** (`id`, `kind`, `guideId`, `chapterId`,
`level`, `mode` / `difficulty` / `frequency` / `qtype`, `idSource`, `lang`, whether a `word` exists, and the
`unitLabel` text). Only a few need bodies (mdast, options, answers, tests).

Legend:
- **M**: metadata is enough, and the call site keeps working on a resident `UnitMeta` (a type change only);
- **B**: needs bodies, moves to the async API;
- **X**: cross-guide.

| # | Call site | Needs | Kind | After sharding |
|---|---|---|---|---|
| 1 | `server/shell.ts` → `navCountsFrom` / `counts-core` (`practiceCounts`, `languageCounts` needs `u.word`) on every page; `api/counts` | existence, kind, mode, has-word | M X | `UnitMeta.hasWord` |
| 2 | `services/mission.ts:88,105` (home) | scan of all units in scope: kind, mode, difficulty | M X | meta scan |
| 3 | `services/library.ts:97,168-171` (home, library) | per-guide counts, flashcards | M X | meta scan (or the manifest's precomputed counts per guide and kind) |
| 4 | `services/queue.ts` (`unitOrder`, `matchUnits`, `openRowsFrom`, `recentlyResolved`): quiz, review, words, mistakes | filters on meta; returns units | M X | return `UnitMeta[]`; players render bodies through #11 |
| 5 | `services/filter-options.ts:28,40`, `app/tasks/page.tsx:102` | meta tallies | M X | meta |
| 6 | `services/path.ts:62,89`, `services/lessons.ts:26` (`guideLessons`), `actions/lessons.ts:41,46`, `courses/skills.ts:116`, `services/stats.ts:49`, `stats/topics.ts` | kind, qtype, chapterId | M | `index.unitsByChapter` holds meta |
| 7 | `ui/lang/PracticePage.tsx:114,236` (pools, vocabulary groups) | kind, mode, word, chapterId | M X | meta |
| 8 | `app/mistakes/page.tsx` (`unitLabel(r.unit)`, level) | label | M | `UnitMeta.label` is precomputed at build with the same `unitLabel` |
| 9 | `app/g/[guide]/[[...slug]]` guide overview `:268` and chapter counts `:87` | counts | M | meta |
| 10 | `app/settings/page.tsx` (issues, totals) | index | M | index and manifest totals |
| 11 | `ui/study/render-items.tsx:71`: every player (learn, quiz, review, words, tasks, test, feed, mistakes, placement) | **bodies by id**, incl. placement | B | `await store.units(ids)`; groups ids by chapter and loads chunks in parallel |
| 12 | `ui/markdown/UnitBlock.tsx:134` (reader, embeds); `EmbedBlock.tsx` | body by id | B | the page preloads `env.units = await store.chapterUnits(id)`; fallback `await store.unit(id)` (already an async RSC) |
| 13 | `actions/answers.ts:80`, `actions/study.ts:19` (`unitOrThrow`), `actions/speech.ts:29` | one body (grading) | B | `await store.unit(id)`; speech: `unit ?? placementUnit` |
| 14 | `courses/registry.ts:95` `exerciseUnit` → `actions/tests.ts:98`, `actions/courses.ts:196` (placement replay), `skills.ts` | bodies of drawn ids; placement bank | B | `exerciseUnit` becomes async (`exerciseUnits(bundle, ids)`); placement loads the bank items it grades by id (`store.placementUnit(id)`, or `exerciseUnits` without a bank) |
| 15 | `app/api/vocab/route.ts:28` | word fields of one chapter | B | `await store.chapterUnits(chapter)` (already scoped to a chapter) |
| 16 | `services/feed.ts:57,79-80` (feed, `availableReelCount`) | reels in focus guides, falling back to **all**; units for quiz and cards | B X | sample from resident `ReelMeta[]` and `UnitMeta`; load bodies of the ≤ 24 picked items (`store.reels(ids)`, `store.units(ids)`) |
| 17 | `services/lessons.ts:74` `renderLessonItems` (reels by id) | reel bodies | B | `store.reels(ids)` |
| 18 | `ContentStore.localizedDocument` (units and reels of one chapter) | bodies of one chapter | B | `chapterUnits` and `chapterReels` inside the store |
| 19 | `content/search.ts` + `api/search` (plainText of every chapter, `searchText` of every unit) | **full text of everything** | B X | prebuilt index file (§3.3); no plainText at runtime |
| 20 | `server/services/units-sync.ts` (fingerprint and upsert of **all** units, on the first `getContent()` per instance) | label of every unit | B X | fingerprint in the manifest; rows prebuilt (`units-sync.json.br`), read only when the DB fingerprint differs (once per deploy) |
| 21 | `ai/reels/ingest.ts:78-106` (cron `/api/cron/reels`) | plainText and reel titles of every chapter | B X | per-guide `text` section of the pack, guide by guide, never cached in the LRU |
| 22 | scripts (`check-guide`, `ids-suggest`, `course-check`, `content-snapshot`, `lib/course-source`, `lib/i18n`), `course/compile/source.ts` | full parse | build | unchanged: they call `loadSnapshot` (the full parse), never the runtime store |

**Count:** ≈ **20 body call sites in 17 files** to migrate (rows 11–21). About **50 metadata-only references in about
30 files** keep their code, because `snapshot.units` and `snapshot.unitsByChapter` keep their names with a `UnitMeta`
type. Scripts stay as they are.

The cross-guide reads after sharding:

| Read | How it works |
|---|---|
| "all units" scans (#1–7) | the resident `UnitMeta` table, which is cheap |
| id → guide/chapter | the same table (`meta.get(id).chapterId`) |
| search | one prebuilt index, loaded only by `/api/search` |
| feed | samples on meta, then loads ≤ 24 bodies |
| units sync | prebuilt rows |
| reels ingest | streams guide by guide |

---

## 3. Shard format and build

### 3.1 Files (`content/.snapshot/`, format 4)

```
manifest.json              human-readable: format, v8, node, fingerprint (listing, as today), unitsFingerprint,
                           builtAt, totals, and per guide {id, dir, pack, packBytes, sha1, chapters, units,
                           placement, reels}
index.v8.br                v8+brotli: guides, chapters (with unitIds), chapterByPath source, placementChapters,
                           translations (metadata, as today), backlinks, LinkIndex, issues,
                           UnitMeta (columnar), ReelMeta (id, guideId, chapterId, sectionSlug, title)
guides/<guideId>.pack      one shard per guide: concatenated, separately brotli'd JSON sections:
                             chapter:<chapterId> → { units: LearningUnit[], reels: Reel[] }
                             placement           → LearningUnit[]   (the guide's _placement bank)
                             text                → [chapterId, plainText][]   (cron and build only)
                           the offset table {section → [offset, length]} lives in index.v8.br
search.json.br             MiniSearch.toJSON() of today's index (same documents, options and normalizeTerm)
units-sync.json.br         the rows syncUnits upserts (unitValues + label), plus unitsFingerprint
```

Why these choices:

- **A pack per guide with chapter sections.** It is one traced file per guide (17 now, ≈ 50 later) instead of
  843 → ≈ 2 500 chunk files. A chapter read is one `fileHandle.read(buf, 0, length, offset)` plus brotli plus
  `JSON.parse` (≈ 1–3 ms for ≤ 33 KB). The pack's `sha1` in the manifest catches a pack that no longer matches its
  index.
- **JSON, not v8, for the sections.** They are plain data (units and reels have no Maps or prototypes). JSON is 12 %
  smaller and 12 % faster to decode (measured above), and it removes the V8-version coupling for 95 % of the bytes.
  The index stays v8, because it holds Maps and `LinkIndex`, like today. The equivalence test (§7) guards
  `undefined` against missing fields: JSON drops `undefined` keys, so the test compares with
  `JSON.stringify`-normalised objects and checks that no code tests `'key' in unit`.
- **mdast `position`s are kept** in step 1, so behaviour is identical (`content/i18n/segments.ts` and `check.ts`
  read positions, and units take part in `localizeDocument`). Stripping them saves 20–35 % of unit bytes. That is a
  later, separate step behind the equivalence test.
- **`UnitMeta` is columnar:** ids, a `Uint16` chapter index into the chapter table, `Uint8` kind, level and sub
  (mode, difficulty or qtype) and flags, plus label and frequency arrays. The store exposes it as
  `ReadonlyMap<string, UnitMeta>` (`get`, `has`, `values()` yield small frozen objects, cached per id after the
  first access). That is 2.5 MB now (8.4 MB at ×3) instead of 10.2 MB (≈ 30 MB) as plain objects. Labels add
  ≈ 2–4 MB. If profiling shows `values()` scans allocate too much, materialise the objects once per process (still
  ≤ 15 MB at track scale).

### 3.2 Build

- `src/content/shards/write.ts` (new): `buildShards(config)` = `loadSnapshot` (the full parse, unchanged) → index,
  packs, search, units-sync, manifest. It writes to `.snapshot.tmp/` and renames atomically.
- `scripts/content-snapshot.ts` calls it. During the transition it also writes the old `guides.v8.br`
  (`--legacy`) so the old path stays as a rollback.
- `vercel-build` is unchanged (it already runs `content-snapshot.ts` after `course-build.ts`). Expected build time:
  today's 16.7 s plus ≈ 4 s for the search index and `toJSON`.
- `scripts/course-build.ts` writes `content/courses/catalog.json` next to the bundles (§5).

### 3.3 Search

Today there is one global MiniSearch, built at runtime: 130 MB heap and 3.5 s CPU. BM25 scores depend on global
document statistics, so **separate per-guide indexes would rank results differently.** To keep behaviour, step 1
prebuilds **the same single index** at build time. `/api/search` calls `MiniSearch.loadJSON` (≈ 0.7 s, no 3.5 s
CPU burst), and only that route ever loads it. The route is pinned to its own function (`export const maxDuration`
differs from the default, which makes Vercel split it, see risk R3). Then page instances never hold the 130 MB.
Per-guide or per-course scoped indexes, or Postgres FTS, are a behaviour change and an owner decision (§9 Q2). At
×2.9 the single index will be ≈ 350–400 MB.

### 3.4 Dev mode (`VAULT_PATH`, `CONTENT_WATCH`)

- **Unchanged parse path.** Dev keeps the full in-memory parse, chokidar and incremental re-parse. The store wraps
  that `FullSnapshot` in a `LiveSource` that serves the same API: index and meta derived in-process, and
  `units` / `chapterUnits` resolved from the in-memory maps. Hot reload works as today: the version bumps, the
  `ChangeEvent` goes out and `/api/events` streams it. Dev has no heap budget.
- **`CONTENT_SNAPSHOT=1`** locally uses the shards (`ShardSource`), like Vercel does. This is how to profile
  locally.
- **Fallback.** If the manifest fingerprint (listing paths and sizes, unchanged logic) or the format/V8 check fails,
  the store logs it and falls back to the full parse, as it does today.

---

## 4. Runtime

### 4.1 API (`src/content/store.ts`; the source implementations live in `src/content/shards/*`)

```ts
interface ContentIndex {           // resident; what `getContent()` returns (old name ContentSnapshot kept as an alias)
  version; config; guides; guideById; chapters; chapterByPath; placementChapters; translations; backlinks; links;
  issues; scanMs; error
  units: ReadonlyMap<string, UnitMeta>              // was Map<string, LearningUnit>
  unitsByChapter: ReadonlyMap<string, readonly UnitMeta[]>
  placementUnits: ReadonlyMap<string, UnitMeta>
  reels: readonly ReelMeta[]
  // removed: plainText (search, cron and build read it from the pack)
}
class ContentStore {
  get(): Promise<ContentIndex>
  unit(id): Promise<LearningUnit | null>                 // via meta → chapter section
  units(ids): Promise<Map<string, LearningUnit>>         // groups by chapter, Promise.all over sections
  chapterUnits(chapterId): Promise<LearningUnit[]>
  reels(ids) / chapterReels(chapterId): Promise<Reel[]>
  placementUnits(guideId): Promise<Map<string, LearningUnit>>
  placementUnit(id): Promise<LearningUnit | null>
  forEachGuideText(fn): Promise<void>                    // cron only; bypasses the LRU
  searchIndex(): Promise<MiniSearch<SearchDoc>>          // /api/search only
  document() / localizedDocument()                       // as today
}
```

`src/server/content.ts` adds React-`cache()`d wrappers: `getUnit`, `getUnits(ids)`, `getChapterUnits`. Several
components in one render that ask for the same chapter share one promise. Across requests the store's in-flight map
dedupes as well.

### 4.2 Caches and budget

- **Always resident:**
  - manifest;
  - `ContentIndex` with `UnitMeta` and `ReelMeta`: ≈ 10 MB now, ≈ 25 MB at track scale (the budget test enforces
    it);
  - pack file handles (opened lazily, one per guide).
- **Section LRU** (`Map` in insertion order, like today's document LRU):
  - key `guideId|section`, cost = the decoded JSON length × 2, calibrated by `measure-content` (measured
    heap ≈ 1.7–2 × raw);
  - budget `CONTENT_CACHE_MB`, default **24**;
  - eviction drops the least recently used sections until the total is under budget;
  - a single section larger than the budget is returned without caching (and logged).
- **In-flight dedupe:** `Map<key, Promise>`, removed on settle. A failed read is not cached.
- **Unchanged:** the document LRU of 80 entries (parsed article mdast) and the localized LRU of 40. Their size
  should be counted in `measure-content` as well. They are not part of this step's budget, but they get reported.
- **Dev invalidation:** `LiveSource` has nothing to evict. With `ShardSource` the content never changes inside a
  process (deployments are immutable). `setConfig` (a local vault switch) drops the source, the LRU and the
  in-flight map.

### 4.3 How RSC, route handlers and actions call it

- **Pages:** `const c = await getContent()` (index, cheap). Meta logic stays sync. Before rendering they
  `await getUnits(ids)` or `getChapterUnits(id)` and pass the map down (`RenderEnv.units` already exists for
  translations). `renderStudyItems` is already async and does the loading itself.
- **Actions:** `await getUnit(id)` and grade.
- **Route handlers:** the same functions. No `server-only` change.
- **Caching:** nothing is cached across users except the content itself. No `use cache`, because pages stay
  dynamic for the CSP nonce.

---

## 5. Course bundles

- **Build:** `course-build.ts` writes `catalog.json`:
  - `CourseListing[]` (exactly `courseListing(bundle)`), the `listed` flag and source;
  - guide → courses (languages, `target`) for `guideLanguages` and `guideTargets`;
  - the legacy lesson-id → lesson-id map for `courseLessonForLegacy`;
  - per bundle `{file, bytes, sha1}`.
- **Runtime** (`src/server/courses/registry.ts`):
  - `listCourses()` (7 callers) and `defaultCourse()` (2) read the catalog;
  - `getCourse(id)`, `getCourseEntry(id)` (15 + 7 callers; already async, so the API is unchanged) load one bundle:
    `readFile` → `JSON.parse` → `CourseBundleSchema.safeParse` (kept, so behaviour is identical) → a bundle LRU with
    budget `COURSE_CACHE_MB` = 24. Cost = file bytes × 2.3, measured 9.3 MB heap for the 4.1 MB English file;
  - `courseRegistry()` (1 caller, `content-i18n.ts`) is replaced by a catalog-based `guideLanguages`.
  - `courseLessonForLegacy` and `guideTargets` stop looping over all bundles.
- **Dev:** the catalog and bundle mtimes go into the signature (same logic as `bundlesSignature`). A missing catalog
  (old checkout) triggers the old load-all path with a warning.

---

## 6. Vercel function size and tracing

Today `outputFileTracingIncludes: { '/**': ['./content/**/*', './content/.snapshot/*', './blog/**/*.md'] }` ships
everything to every function:

- 28 MB of Markdown (needed: `document()` parses chapter files on demand);
- 9.9 MB of bundles plus the `course.yaml` sources;
- the 14 MB snapshot.

Target:

```ts
outputFileTracingIncludes: {
  '/**': [
    './content/Guides/**/*', './content/glossary/**/*', './content/courses/*.json',
    './content/.snapshot/manifest.json', './content/.snapshot/index.v8.br', './content/.snapshot/guides/*.pack',
    './blog/**/*.md',
  ],
  '/api/search': ['./content/.snapshot/search.json.br'],
  '/api/admin/**': ['./content/.snapshot/units-sync.json.br'],   // or wherever syncUnits runs (see step 2)
},
outputFileTracingExcludes: {
  '/**': ['./content/.snapshot/guides.v8.br', './content/courses/*/**'],   // legacy monolith and course sources
},
```

`syncUnits` today runs inside `getContent()` on any route. Step 2 moves it to a lazy `ensureUnitsSynced()`. It still
runs on the first request of an instance after a deploy, but it only reads `manifest.unitsFingerprint` and compares
it with the DB. It needs the rows file only on a mismatch. So the rows file must be traced wherever that can happen:
either `'/**'` (≈ 1 MB brotli, acceptable), or a cron/route that the deploy hook calls. **Decision for step 2: trace
it in `'/**'`.** Simplest, and it keeps behaviour.

Expected per function: Markdown (28) + packs (≈ 13) + index (0.2) + bundles (9.9) ≈ 51 MB. Today it is
≈ 52 MB + `course.yaml` sources, so the size is flat; the gain is heap and cold start, not bytes. At track scale the
packs are ≈ 30–40 MB and the bundles ≈ 40 MB, so ≈ 110 MB, well under the 250 MB unzipped limit.

**Measurement (step 7):**
- `vercel build` locally, then for every `.vercel/output/functions/**/*.func` report total size and content size
  (same script as §1, `--functions`);
- check that `/api/search` is a separate `.func` and is the only one with `search.json.br`;
- check that no function contains `guides.v8.br` after step 9;
- add the numbers to the stage report.

---

## 7. Tests

1. **Heap budget** (`scripts/measure-content.ts --assert`, a CI job after `content:snapshot` on the real `content/`).
   Each scenario runs in a fresh child process with `--expose-gc`:

   | Scenario | Budget (now) | Track-scale budget (re-check at every content batch) |
   |---|---|---|
   | (a) index + meta resident | ≤ 15 MB | ≤ 30 MB |
   | (b) (a) + every chapter of the 3 largest guides read through the store (eviction must happen) + the 2 largest bundles (active course and placement) | **≤ 60 MB**, and the section LRU ≤ `CONTENT_CACHE_MB` | ≤ 60 MB |
   | (c) cold `get()` + one `chapterUnits` | ≤ 150 ms | ≤ 250 ms |
   | (d) `/api/search` index load (separate function) | ≤ 160 MB, ≤ 1 s | owner decision (§9 Q2) |

   Also a vitest on the fixture vault (`tests/unit/content-shards.test.ts`) checks:
   - LRU eviction order;
   - budget accounting;
   - in-flight dedupe: 10 parallel `unit()` calls on one chapter decode once;
   - fallback when a pack's sha1 or the manifest fingerprint mismatches;
   - a section larger than the budget.

2. **Equivalence** (`tests/unit/content-shards.test.ts` on fixtures, plus `measure-content --verify` on real
   content in CI). It replaces and extends `content-snapshot.test.ts`:
   - `ShardSource` against the full parse: for every chapter, `chapterUnits(id)` deep-equals
     `unitsByChapter.get(id)`;
   - for every unit id, `unit(id)` equals the source, and `UnitMeta` equals the fields derived from the unit
     (including `label === unitLabel(unit)`);
   - reels by id, placement units per guide, guides, chapters, links and translations are identical;
   - `searchIndex().search(q)` returns the same hits as today's `build()` for a fixed query list.

3. **Every page type still resolves its units.** `tests/unit/content-pages.test.ts` drives the server functions
   behind each page type against `ShardSource` on the fixture vault, with an LRU budget small enough to force
   eviction (`CONTENT_CACHE_MB=0.05`):
   - `renderStudyItems` for every kind, placement included;
   - `courseLessons` + `renderLessonItems`;
   - `matchUnits` / `flashcardQueue`;
   - `buildFeed` sampling (pure part);
   - `exerciseUnits`;
   - the vocab `chapterWords`;
   - the reader env (`chapterUnits` → `UnitBlock` lookup);
   - `localizedDocument`.

   The e2e smoke (`tests/e2e`) visits one page of each type on a `CONTENT_SNAPSHOT=1 next start` build:
   `/g/<guide>/<chapter>`, `/learn/<lesson>`, `/quiz`, `/review`, `/words`, `/tasks?unit=`, `/test/<id>`, `/feed`,
   `/placement`, `/mistakes`, `/path`, `/api/search?q=`, `/api/vocab?chapter=`. It asserts no 404 or 500 and that
   unit blocks are rendered.

---

## 8. Migration steps

Each step is a separate PR: green tests, no behaviour change, and rollback by revert.

| # | Step | Files | Effort | Test | Rollback |
|---|---|---|---|---|---|
| 0 | `scripts/measure-content.ts` + `pnpm content:measure`; baseline into the stage report | new script, package.json | S (0.5 d) | runs in CI, report only | delete |
| 1 | **Async body API on the current monolith.** Add `unit/units/chapterUnits/reels/placementUnits` to `ContentStore`, backed by today's maps, plus the `cache()` wrappers. Migrate the ≈ 20 body sites (§2 rows 11–18) to it; `exerciseUnit` becomes async. Nothing loads lazily yet. | store.ts, server/content.ts, render-items.tsx, UnitBlock.tsx, g page, answers.ts, study.ts, speech.ts, tests.ts, courses.ts (actions), registry.ts, skills.ts, vocab route, feed.ts, lessons.ts | M (2 d) | existing unit tests + e2e | revert |
| 2 | **Units sync from the manifest.** Compute `unitsFingerprint` and rows at build; `syncUnits` reads them; it no longer hashes all units at runtime | units-sync.ts, content-snapshot.ts | S (0.5 d) | units-sync behaviour test (same rows, aliases) | revert |
| 3 | **Meta type flip.** `units`, `unitsByChapter`, `placementUnits` become `UnitMeta`; `reels` becomes `ReelMeta`; `plainText` is removed from `ContentIndex`. `tsc` lists what is left; fix the meta sites (`hasWord`, `label`). Search and reels ingest read text through the store. | model.ts (`UnitMeta`), store.ts, counts-core.ts, queue.ts, mission.ts, library.ts, filter-options.ts, PracticePage.tsx, mistakes page, search.ts, ingest.ts, tests | M (1.5 d) | `tsc`, unit tests | revert |
| 4 | **Shard writer.** `buildShards` writes manifest, index, packs, search, units-sync; still `--legacy` too | src/content/shards/write.ts, content-snapshot.ts | M (1 d) | equivalence test (fixtures + `--verify` on real content) | flag off |
| 5 | **`ShardSource` + LRU + dedupe**, selected when `VERCEL` or `CONTENT_SNAPSHOT=1` and `CONTENT_SHARDS !== '0'`; `LiveSource` for dev | src/content/shards/{source,lru,pack}.ts, store.ts | M (1.5 d) | shard unit tests, budget test (b)(c), e2e on `CONTENT_SNAPSHOT=1` | env `CONTENT_SHARDS=0` → legacy monolith (still built) |
| 6 | **Search**: prebuilt `search.json.br`, `loadJSON`, route in its own function | search.ts, api/search/route.ts | S (0.5 d) | same-hits test; check the function split | revert |
| 7 | **Tracing**: includes/excludes from §6 + function-size report | next.config.ts, measure script `--functions` | S (0.5 d) | `vercel build` report on a preview | revert config |
| 8 | **Course catalog + lazy bundles + bundle LRU** | course-build.ts, registry.ts, bundles.ts, content-i18n.ts, target.ts, lessons.ts (courses) | M (1 d) | registry tests (listing identical to today), budget (b) | revert (load-all fallback stays) |
| 9 | **Clean-up**: one release after step 5 is in production, stop writing `guides.v8.br`, drop the legacy path and flag; update PERFORMANCE.md §5, ARCHITECTURE.md and platform-audit §6 | store.ts, content-snapshot.ts, docs | S (0.5 d) | budget test in CI as a required check | revert |

Total ≈ **9–10 days** (L, as the audit estimated).

Order and dependencies:
- 1 → 3 is the risky refactor. It is done while everything is still in memory, so each PR changes only call
  shapes.
- 4 → 5 switches storage behind a flag.
- 6, 7 and 8 are independent after 5 (8 can go any time after 1).

The preview deployment gets `PERF_TRACE=1` plus a one-off `[content] heap` log line (index, LRU bytes, bundle bytes)
after steps 5 and 8.

---

## 9. Risks and open questions

**Risks**

- **R1. Hidden body reads.** Some code may read a body field through a `UnitMeta`-typed path: `as` casts,
  `LearningUnit` passed in from elsewhere, tests with fixtures. The type flip (step 3) is the guard. Any
  `as LearningUnit` in a grep blocks the PR. The e2e smoke runs with a tiny LRU, so eviction bugs surface.
- **R2. Request latency on cold sections.**
  - Each first touch of a chapter costs 1–3 ms (read + brotli + parse).
  - A study session draws from up to ~10 chapters, which means ~10–30 ms on a cold instance (parallel reads).
  - The feed samples across guides, so it can touch up to 24 chapters.
  - Accepted; it is measured in (c) and with `PERF_TRACE`.
  - Mitigation if needed: group feed samples by chapter.
- **R3. Search isolation depends on Vercel splitting the route into its own function.** If it does not, nothing
  regresses: the index is still loaded only on demand, like today, but a page instance that serves a search holds
  it. Verify in step 7. The real fix at track scale is §9 Q2.
- **R4. Fluid compute concurrency.** Many learners on one instance touch many chapters, so the LRU churns. The
  budget is a cap, not a target. Watch the eviction rate in the `[content]` log. Raising `CONTENT_CACHE_MB` is a
  config change.
- **R5. JSON vs v8 differences** (`undefined` vs missing keys, `-0`, `NaN`). The equivalence test catches them. If
  one matters, that section type stays v8.
- **R6. Two shard formats during the transition.** The build gets bigger (≈ 14 MB legacy + 13 MB packs) until
  step 9. Fine under 250 MB.
- **R7. Uncommitted English work** on `main` (`model.ts`, `registry.ts`) can conflict with steps 1 and 3. Land or
  rebase it first, as the audit notes.
- **R8. The document and localized LRUs** (parsed article mdast, 80 + 40 entries) are not budgeted yet. One English
  article can be several MB of mdast. Measure them in step 0 and give them a byte budget too if they dominate.

**Open questions (owner)**

- **Q1.** Is the 60 MB per-instance target content-only (as assumed here: index + sections + bundles), or does it
  include document LRUs and search?
- **Q2. Search at track scale** (≈ 350–400 MB single index). Options:
  - (a) Postgres FTS (`tsvector` in Supabase, synced like `units`): no heap, but different ranking, fuzzy and prefix
    behaviour;
  - (b) per-course indexes with the palette scoped to the active course, and "everything" as a slower second query;
  - (c) a slimmer index (titles, headings and unit prompts only).
  All three change behaviour, so this needs a decision before content batch 2.
- **Q3.** Is it acceptable to strip mdast `position` from units (−20–35 % unit bytes) once i18n is confirmed not to
  need unit positions?
- **Q4.** Is it acceptable that `/api/cron/reels` (reels ingest) streams all guide texts (≈ 30 MB transient, never
  cached)? Or should it be limited to guides of listed courses?

---

## 10. Implementation notes (`fs/storage`)

What shipped, and where it differs from the design above.

| Step | Shipped |
|---|---|
| 0 | `pnpm content:measure` (+ `--assert --verify --guides --json`), `pnpm content:functions` |
| 1–3 | async body API, `UnitMeta` / `ReelMeta`, `ContentIndex` (alias `ContentSnapshot`) vs `FullSnapshot` (the parse), review fixes |
| 4 | `src/content/shards/{format,write,read,source,verify}.ts`; `content:snapshot` writes `.snapshot/` atomically (tmp dir + rename) |
| 5 | `ShardSource` + `ByteLru` (`src/content/lru.ts`), `CONTENT_CACHE_MB` (24), in-flight de-dup, `CONTENT_SHARDS=0` rollback |
| 6 | `search.json.br` loaded by `store.searchIndex()` (`/api/search` only), route has its own `maxDuration` |
| 7 | `next.config.ts` includes/excludes; search index only in `/api/search` |
| 8 | `catalog.json`, `CourseStore` (`src/server/courses/catalog.ts`), `COURSE_CACHE_MB` (24) |
| 9 | docs; the monolith is **kept** as the `CONTENT_SHARDS=0` rollback (a rollback without it would mean parsing 16 s and 170 MB per instance); drop it one release after the shards are in production |

Deviations, all behaviour-preserving:

- **`UnitMeta` is not columnar.** Plain objects with shared strings (`intern` in `read.ts`): the index is 15.1 MB, not the
  2.5 MB columnar + 7.7 MB the design assumed. The budget (a) is 16 MB; at track scale (×2.2 units) expect ≈ 28 MB, and
  columnar encoding is the lever if that is too much.
- **Pack integrity**: sizes are compared with the manifest at load; the sha1 is checked by `--verify` and the tests, not
  on every cold start.
- **Search ranking**: the prebuilt index returns the same hits in the same order; scores differ in the 16th digit (the
  sums run in another order after the JSON round trip). `verifyShards` compares ids and order exactly, scores to 1e-9.
- **Document caches** (R8): byte-budgeted (`DOCUMENT_CACHE_MB`, 24, shared 2:1; cost = source chars × 16, calibrated).
- Placement replay loads only the answered items (`getPlacementUnit` / `exerciseUnits`), not `placementUnits(guideId)`.
- The units fingerprint hashes the whole row (one idempotent resync per environment on the first deploy).
- mdast `position`s are kept (lead decision); the 60 MB budget is content-only (index + sections + bundles).

Measured on this repo (Node 25.7, 23 455 units): see [PERFORMANCE.md §5](../../PERFORMANCE.md) and `pnpm content:measure`.
