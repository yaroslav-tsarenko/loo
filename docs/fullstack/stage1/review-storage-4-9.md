# Review: stage 1a storage, steps 4–9 (`fs/storage`, `326f956..e63f7d0`)

Reviewer: independent. Scope: ed10b32 (0–3 review fixes), 899b314 (m3 fingerprint), 49e6971 (shards writer, loader,
search), 360bc5e (document cache budget), d942654 (course catalog, lazy bundles), 249e939 (tracing), 0c13f7e
(measure), e63f7d0 (docs). Checked against [01-storage.md](01-storage.md) §3–§8 (steps 4–9) and
[review-storage-0-3.md](review-storage-0-3.md).
Date: 2026-11-09.

## What was run

| Check | Result |
|---|---|
| `npx pnpm@10 test` | 60 files, 1348 tests, all pass |
| `npx pnpm@10 typecheck` | clean |
| `VAULT_PATH=content npx pnpm@10 content:snapshot` | 17 guides, 23 455 units, 22 files, 33.2 MB, 29.7 s |
| `VAULT_PATH=content npx pnpm@10 content:measure --assert --verify` | verify: no differences. All budgets ok: index 15.1 MB / 75 ms; resident (3 guides + 2 bundles) 57.6 MB, section LRU 23.9 of 24 MB, 283 evictions; cold get + chapter 82 ms; search load 130.9 MB / 864 ms; documents 15.2 MB |
| `npx pnpm@10 build` | passes. `search.json.br` is traced only into `app/api/search/route`. Every page/route trace has the manifest, `index.v8.br`, all 17 packs, `units-sync.json.br`, `catalog.json` and the monolith. `content:functions`: median app route 104.2 MB (content 67.6 MB), max 106.2 MB |
| Traced files vs the build's vault listing (a script that compares `listVault('content').notes` with each `.nft.json`) | **4 files missing in every function: `courses/*/course.yaml`** (see B1) |
| Runtime store on a copy of `content/` without `courses/*/` (that is what a function sees) | **shards rejected, monolith rejected, full parse: 14.5 s** (see B1) |
| The same on the full `content/` | shards taken, 65 ms |
| `CONTENT_SHARDS=0` (store with `shards=false`) on a full copy | monolith taken, 643 ms, bodies resolve, same units-sync fingerprint |
| Pack truncated by 10 bytes | size check rejects the shards and falls back to the monolith |
| Pack the same size, first 10 bytes overwritten | shards accepted; reading that chapter throws `ERR__ERROR_FORMAT_PADDING_1` on every request. The failure is not cached (see m1) |
| Dev reload race (fixture vault: `reload([path])` while `unit(id)` runs) | **`TypeError: Cannot read properties of null (reading 'unit')`** (see M1) |
| `course:build` drift | With `VAULT_PATH=content` (in a copy of the tree) all 4 bundles and the catalog come out **byte-identical** to what is committed. With `.env.local` (`~/Documents/Obsidian Vault`), `english-a1-c2.json` is 331 bytes smaller, because **the Obsidian vault's English `course.yaml` has no `exam:` (IELTS) block**. The committed bundle is not stale. Rebuilding from the default vault would remove the IELTS mapping (see m9) |

Code read line by line: `src/content/lru.ts`, `src/content/shards/{format,write,read,source,verify}.ts`, the
`store.ts` diff, `src/server/courses/{catalog,registry,lessons,target}.ts`, `content-i18n.ts`, the two actions,
`api/search/route.ts`, `next.config.ts`, `scripts/{content-snapshot,course-build,function-sizes}.ts`, the new tests.

What holds up:
- **LRU accounting is right.**
  - `set` removes the old cost first, refuses an entry over budget, and evicts from the oldest end until the total
    fits.
  - `get` refreshes recency.
  - `clear` resets the byte count.
- **In-flight de-dup is right.**
  - The key is removed on settle, through both branches.
  - A rejected read is never written to the cache.
  - A failed `open()` is dropped from `handles`.
  - The 10-reader test and my 50-parallel run decode a section once.
  - Eviction while a promise is in flight is harmless: the promise resolves, and only then is the entry inserted.
- **No maps grow without bound.** `handles` is one per guide. `inflight` drains. `reelById` is built once. The
  course `inflight` drains too.
- **Search parity.** Same options (`INDEX_OPTIONS` shared by build and `loadJSON`), same `searchIn`. `--verify`
  compares hits and order exactly over 10 queries.
- **Legacy lesson map and guide targets are equivalent.**
  - `legacyLessonMap(bundle)` is `legacyIndex(bundle).toNew`, the same map that `lessonIdFromLegacy` reads.
  - It is filtered by `listed`, with the first course winning. That matches the old `listCourses()` loop.
  - `target.ts` and `content-i18n.ts` match the old per-bundle logic.
- **m3 fingerprint change is idempotent.**
  - Both sides use `rowOfMeta`, with stable key order.
  - On prod the fingerprint differs once, which triggers an upsert of the same values (`firstSeen` kept,
    `missingSince` null).
  - `fresh` and `missing` are computed against the table, not the fingerprint, so nothing is aliased or deleted.
- **Fixes from review 0–3, all confirmed:** m1 (`MemorySource.forEachGuideText` covers index chapters), m2 (bodies
  before the transaction), m3, m4 (`units-sync.test.ts`), m6 (`--assert`), m8 (bank or exercises).

**1 blocker, 2 majors, 9 minors, 5 nits.**

---

## Blocker

### B1. On Vercel no function can use the shards *or* the monolith: every cold start parses the whole vault
`next.config.ts:39-43` (`outputFileTracingExcludes: '/**': ['./content/courses/*/**', …]`),
`src/content/sources/vault-fs.ts:89-98`, `src/content/store.ts:403-410`

`listingFingerprint` hashes `listing.notes`. `notes` holds **every file under the vault** that is not a dot file,
course sources included. At build time `content:snapshot` sees `courses/<id>/course.yaml` (4 files), so the
manifest, `index.v8.br` and `guides.v8.br` all carry a fingerprint that includes them. Then step 7 excludes
`./content/courses/*/**` from every function. Before this branch, `./content/**/*` shipped them.

At runtime `listVault` therefore returns 4 fewer notes, and the fingerprint differs. What follows:
- `loadShards` returns null;
- `loadPrebuilt` returns null;
- `loadSnapshot` parses the vault. Measured: **14.5 s and ≈ 170 MB on every cold instance**;
- the `CONTENT_SHARDS=0` rollback hits the same mismatch, so it is broken too.

`--verify`, the tests and `content:measure` all run on the full `content/`, so none of them can see it. The
`.nft.json` comparison above shows the 4 files missing in every route (`/api/search`, `/tasks`, `/`, `/learn/[lesson]`,
…).

**Fix:**
1. The quick fix: remove `'./content/courses/*/**'` from `outputFileTracingExcludes`. The 4 `course.yaml` files are
   44 KB.
2. Alternatively, make the listing ignore `courses/`. `walk` would skip it for both the fingerprint and `notes`.
   `LinkIndex` gets `notes`, but course YAML is not a link target.
3. Add a guard to `scripts/function-sizes.ts` (or a `--check` flag): for every `app/**` trace, assert that every
   `listVault(content).notes` path and every `listing.files` path is traced. Exit 1 otherwise. Run it after
   `next build` in CI. Without this guard any future include or exclude tweak brings the bug back silently.
4. Log the reason a build artefact is rejected (M2), so this shows up in Vercel logs.

---

## Major

### M1. Dev hot reload: a body read during a reload throws
`src/content/store.ts:677-680` (`reload` → `releaseSource()` first), `:566-569` (`bodies()` → `this.source!`)

`reload(paths)` sets `this.source = null` and then awaits `loadSnapshot` (file reads, so async). `this.snapshot`
still holds the old index during that time. Any `unit()`, `units()`, `chapterUnits()` … in that window gets the old
snapshot from `get()` and then `null.unit(...)`.

Reproduced on the fixture vault: `TypeError: Cannot read properties of null (reading 'unit')`. Before this branch,
`this.full` was replaced only after the parse, so readers kept the old bodies.

- **Where it hits:** dev (chokidar reload) and `setConfig`. `setConfig` also closes the `ShardReader` handles
  while reads may be in flight, which gives `EBADF` in those requests.
- **Prod:** not affected (no reload on deployments).

**Fix:** build the new source first and swap it together with the snapshot, then release the old one:

```ts
const previous = this.source
const snapshot = (await this.fromBuild(paths)) ?? this.fromParse(...)   // fromBuild/fromParse return {snapshot, source}
this.source = next; this.snapshot = snapshot
if (previous !== next && previous instanceof ShardSource) void previous.reader.close()  // or close after a grace tick
```

In `setConfig` keep `snapshot = null` (callers wait on `loading`), but do not null `source` before the new one
exists. Add the race above as a unit test.

### M2. Rejected shards and monolith fall back silently
`src/content/shards/read.ts:141,144,147`, `src/content/store.ts:434`, `:680`

Every rejection returns `null` with no log:
- format;
- V8 version;
- listing fingerprint;
- pack size.

Only an exception is logged. The final `loadSnapshot` fallback logs nothing either. B1 would have been one log line
in Vercel. Instead it shows up as a 15 s cold start with nothing to explain it. Spec §3.4 says "the store logs it
and falls back".

The monolith is also deserialized in full (14 MB, ≈ 650 ms) before its fingerprint is compared, only to be
rejected for the same reason the shards were.

**Fix:**
- Return a reason (`'fingerprint' | 'v8' | 'format' | 'pack-size:<guide>'`) and `console.warn('[content] shards
  not used: …')`.
- Do the same for the monolith, and warn once when the store ends up parsing with `this.prebuilt` set.
- When the shard manifest's fingerprint already mismatches the listing, skip `loadPrebuilt`: it was built in the
  same run with the same fingerprint.

---

## Minor

### m1. A pack with the right size but wrong bytes fails every request for its chapters
`src/content/shards/read.ts:145-148`, `:66-74`

Only sizes are compared at load (documented). A same-size mismatch decodes garbage. Brotli throws, or worse, it
decodes valid JSON for the wrong chapter after a partial copy. The error is not cached, which is correct, so every
request for those chapters fails with a 500.

Deployments are immutable, so the risk is low. **Fix:** check the manifest `sha1` lazily, once per pack, the first
time `handle(guideId)` opens it. That costs ≈ 10 ms for the 4.4 MB packs. On a mismatch, mark the guide bad and
log it, then either throw a clear error or fall back for that guide.

### m2. Loading the search index blocks the event loop for ≈ 0.9 s
`src/content/shards/source.ts:150-155`

`brotliDecompressSync` and `MiniSearch.loadJSON` (sync) run in one tick. On a Fluid instance every concurrent
request on `/api/search` (and `?warm=1`) stalls. The old path yielded in 200-document chunks.

**Fix:** use `await promisify(brotliDecompress)(raw)`, which runs off the main thread. Consider
`MiniSearch.loadJSONAsync` if the installed minisearch version has it. At least document the stall.

### m3. The LRU budgets count cached entries only, not entries still in use
`src/content/lru.ts`, `src/server/courses/catalog.ts:156`

An evicted section or bundle stays on the heap as long as a request holds it. Under Fluid concurrency the real
content heap can therefore exceed `CONTENT_CACHE_MB` + `COURSE_CACHE_MB`. This is inherent in the design, but
§4.2 calls the budget "a cap". **Fix:** say "a cap on cached bytes" in PERFORMANCE §5. The `[content]` heap log
line from §8 would show the gap.

### m4. The catalog's staleness check uses size only, and the file name is derived from the id
`src/server/courses/catalog.ts:49-50`, `:110`

- **Size only.** The catalog stores `sha1` but never checks it. A bundle rebuilt to the same byte length (an edited
  label of the same length) keeps a stale catalog:
  - listing counts and titles;
  - legacy map;
  - guides and languages.
- **File name from the id.** `file` is `${bundle.course.id}.json`, not the real file name. A bundle whose file name
  differs from its id gets `bytes: 0`. The catalog is then "stale" forever, and the store falls back to loading
  every bundle.

**Fix:**
- Carry the real `name` through `buildCatalog`. `parseBundles` knows it.
- In `CourseStore.load`, compare the sha1 of the text it just read with `course.sha1`. It is read anyway, so this
  costs nothing extra. On a mismatch, log it and rebuild the catalog via `fallback()`.

### m5. A bundle that fails validation is re-read on every request
`src/server/courses/catalog.ts:150-158`

`load` returns `null` without caching it. Each later `entry(id)` reads and zod-validates up to 5 MB again
(≈ 50 ms). Concurrent calls are de-duplicated, sequential ones are not. **Fix:** cache the negative result: a
`Set<string>` of failed ids, or `lru.set(id, null, 1)`. Keep `catalog()`'s reset-on-throw for I/O errors only.

### m6. Old and new deployments sharing one DB resync on every cold start
`src/content/units-rows.ts:38-42` (m3 change)

The old fingerprint format and the new one never match. While both are live against one database, each cold start
of either version sees "the other" fingerprint and runs the full 23k-row upsert transaction. Cases where both are
live:
- a preview of this branch next to production;
- an instant rollback;
- skew during a rolling deploy.

**Fix:**
- Store the fingerprint under a versioned key (`units.fingerprint.v2`). The new code then ignores the old value.
  Old instances keep theirs, and each format resyncs once.
- Or say in the release notes: "don't point previews at the prod DB during this release".

### m7. The oversize warning logs on every read
`src/content/shards/read.ts:90-93`

With `CONTENT_CACHE_MB=0` (a plausible emergency knob) or one section over budget, every read logs a warning.
**Fix:** warn once per key (keep a `Set`), and count the rest in `oversize`.

### m8. Test and CI gaps against spec §7 and step 9
`tests/unit/content-shards.test.ts`, `.github/workflows/`

Missing:
- a test that a failed section read is not cached (reject once, then succeed);
- a test of the `getContentStore()` / `CONTENT_SHARDS=0` wiring: a store built from env takes the monolith;
- the sha1-mismatch case (only size is tested);
- the M1 race;
- `tests/unit/content-pages.test.ts` (§7.3, every page type against `ShardSource` with `CONTENT_CACHE_MB=0.05`)
  does not exist;
- the `CONTENT_SNAPSHOT=1` e2e smoke does not exist;
- `content:measure --assert --verify` is not a CI job. The only workflow is `reminders.yml`, while step 9 says
  "budget test in CI as a required check".

**Fix:** add the tests and a CI job: `content:snapshot` → `content:measure --assert --verify` → `next build` →
the B1 trace check.

### m9. `pnpm course:build` compiles from a stale vault by default
`package.json` (`course:build` uses `--env-file-if-exists=.env.local`), `scripts/lib/course-source.ts:12,22`

The committed bundles are not stale. `VAULT_PATH=content` reproduces them byte for byte, and `--catalog-only` hides
nothing in the code.

The default `pnpm course:build`, though, reads `.env.local` → `~/Documents/Obsidian Vault/Courses/…`. That vault's
`english-a1-c2/course.yaml` lacks the `exam:` IELTS block (from c96a0c4), so the rebuild **would remove the IELTS
mapping**. That is the drift seen.

`COURSES_DIR = 'Courses'` also finds `content/courses` only on a case-insensitive FS (macOS). On Linux,
`VAULT_PATH=content pnpm course:build` finds no courses, and `vercel-build --if-sources` keeps the committed bundles.
That happens to be the right result, but by accident.

**Fix:**
- Sync the Obsidian vault's English `course.yaml`, or document that the repo's `content/courses/*/course.yaml` is
  the source of truth.
- Resolve the course directory case-sensitively, or by an explicit `content/courses`, so behaviour does not depend
  on the OS.

---

## Nits

- **n1.** `writeSnapshotDir` (`src/content/shards/write.ts:137-138`) runs `rm(target)` and then `rename`. There is a
  window with no `.snapshot/`, so the comment "a reader never sees half a build" is not strictly true. Rename the
  old directory aside first (`.snapshot.old`), then rename tmp into place, then remove the old one.
- **n2.** Spec §6 expects ≈ 51 MB per function. Measured: median 104 MB, of which content is 67.6 MB (Markdown 28,
  packs 13, monolith 14, bundles 10, index and catalog). The rest is node_modules and code. Update §6/§10 with the
  `content:functions` numbers. Note that dropping the monolith saves 14 MB per function.
- **n3.** `tests/unit/content-shards.test.ts:113-123` removes `zz-shard-note.md` only when the assertions pass. Use
  `try/finally`. The pack-corruption test (`:126-131`) writes into the shared snapshot dir. Make sure later tests in
  the file don't depend on it, or restore the pack.
- **n4.** `boot()` calls `setConfig` whenever a vault path is saved in settings. `setConfig` then runs
  `reload(['*'])`, which skips `fromBuild`. Locally, `CONTENT_SNAPSHOT=1` therefore silently parses whenever a vault
  path is saved, even an identical one, because `this.snapshot` is still null at boot. This predates the branch,
  but §3.4 sells `CONTENT_SNAPSHOT=1` as the way to profile. Mention it in the docs, or compare the configs before
  the snapshot exists.
- **n5.** `VERIFY_QUERIES` has 10 queries. Add a few that stress prefix and fuzzy search (`promis`, `closur`,
  `перфект`) and an OR fallback (a query with no AND hits). Then tie-break order is exercised too.
