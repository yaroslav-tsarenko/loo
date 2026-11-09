# Performance

How Levelup stays fast on Vercel + Supabase, how to measure it, and the numbers behind the October 2026 pass.

## 1. Where the time went

Production felt slow because of five things stacking up:

| Cause | Effect |
| --- | --- |
| Functions in `iad1` (Washington), database in `eu-west-1` (Ireland) | ~80 ms per database round trip. Fixed in `vercel.json` (`"regions": ["dub1"]`), ~1–2 ms after the next deploy. |
| One pooled connection (`DATABASE_POOL_MAX=1`) and a transaction per service call | The root layout alone ran 8 transactions **one after another** (Promise.all can't overlap them on one connection); every transaction costs `BEGIN` + RLS `set_config` + `COMMIT` on top of its queries. |
| postgres-js with `prepare: false` | Every parameterized query took **two** round trips (Parse/Describe, wait, Bind/Execute). |
| Chatty services | Recording one answer ran ~70 statements one by one (stats for achievements alone: ~25). |
| Cold start parsed the whole vault | 3.5–5 s before the first byte on every new instance. |

Plus on the client: study pages shipped ~560 KB of gzipped JS (zod, yaml, every visualisation engine), and `/path` sent 2.6 MB of HTML (pixel icons as hundreds of `<rect>`s).

## 2. Results

Measured with the lab below (`next start`, real Postgres 16 with Supabase-style RLS, single pooled connection like
Vercel). **RT** = sequential database round trips per request, counted at the latency proxy (so it is exact, not an
estimate). Time is the full request at a 20 ms database RTT. The last two columns project the database share to the
real RTTs: **dub1** (functions next to the database, ~1.5 ms) and **iad1** (the old setup, ~80 ms).

| Request | RT before | RT after | time @20 ms before → after | DB @dub1 after | DB @iad1 before → after |
| --- | ---: | ---: | --- | ---: | --- |
| `/` (home) | 214 | 18 | 5.37 s → 0.46 s | 27 ms | 17.1 s → 1.4 s |
| `/path` | 174 | 13 | 4.46 s → 0.41 s | 20 ms | 13.9 s → 1.0 s |
| `/learn/<lesson>` | 116 | 11 | 2.90 s → 0.26 s | 17 ms | 9.3 s → 0.9 s |
| `/review` | 114 | 13 | 2.86 s → 0.34 s | 20 ms | 9.1 s → 1.0 s |
| `/quiz` | 104 | 12 | 2.61 s → 0.30 s | 18 ms | 8.3 s → 1.0 s |
| `/words` | 114 | 13 | 2.80 s → 0.41 s | 20 ms | 9.1 s → 1.0 s |
| `/g/<guide>/<chapter>` | 104 | 8 | 2.65 s → 0.25 s | 12 ms | 8.3 s → 0.6 s |
| `/shop` | 132 | 13 | 3.25 s → 0.37 s | 20 ms | 10.6 s → 1.0 s |
| `/loo` | 180 | 14 | 4.42 s → 0.38 s | 21 ms | 14.4 s → 1.1 s |
| `/profile` | 268 | 19 | 6.55 s → 0.50 s | 29 ms | 21.4 s → 1.5 s |
| `/leagues` | 108 | 12 | 2.81 s → 0.30 s | 18 ms | 8.6 s → 1.0 s |
| `/mistakes` | 116 | 12 | 2.83 s → 0.29 s | 18 ms | 9.3 s → 1.0 s |
| `/courses` (layout only) | 104 | 8 | 2.68 s → 0.20 s | 12 ms | 8.3 s → 0.6 s |
| `GET /api/counts` | 44 | 8 | 1.05 s → 0.20 s | 12 ms | 3.5 s → 0.6 s |
| **answer a quiz** (`answerQuiz`) | 134 | **7** | 3.20 s → 0.18 s | 11 ms | 10.7 s → 0.6 s |
| answer in a lesson (hearts) | 146 | 7 | 3.48 s → 0.18 s | 11 ms | 11.7 s → 0.6 s |
| `startLesson` | 16 | 9 | 0.39 s → 0.21 s | 14 ms | 1.3 s → 0.7 s |
| `equipItem` | 14 | 7 | 0.34 s → 0.17 s | 11 ms | 1.1 s → 0.6 s |

Statements per request went from 43–119 (pages) and 66–71 (answers) to 2–10 and 4.

Other numbers:

| | before | after |
| --- | --- | --- |
| Cold start, first request on a new instance | 3.9–4.9 s (vault parse 3.5 s) | ~0.5 s (snapshot load ~0.19 s) |
| JS on `/quiz`, `/learn` (gzip) | 560 KB | 402 KB |
| HTML of `/path` (English course) | 2.6 MB (137 KB gzip) | 1.3 MB (73 KB gzip) |
| JWKS fetches (Supabase Auth, ES256) | — | once per instance and 10 min (proxy and app each); 2 fetches for 20 requests in the lab |

### October 2026, second pass — page weight and request count

Server time was already small (40–130 ms per page at a 2 ms database RTT in the lab); what users felt on phones was
the weight of the pages, extra requests and one regression:

| | before | after |
| --- | --- | --- |
| content store | re-read the whole content whenever a page and a route handler alternated (separate bundles → separate class copies; an `instanceof` check replaced the store) | one store per process |
| `/words` HTML (English course) | 9.6 MB (700 KB gzip): all 4 287 words inside closed groups | 285 KB (48 KB gzip); a group loads its words when opened (`/api/vocab`, built once per snapshot, browser cache 1 h) |
| `/path` HTML | 2.1 MB | 1.35 MB for a learner at A1; less after a placement — locked / credited sections ship topic titles only, lessons via `/api/path-section` on demand |
| `/api/counts` | on every page change | on progress events, after 60 s, or when the tab comes back |
| repeat navigation | always a server render | client router cache: `staleTimes` 30 s (dynamic) / 5 min (static) |
| placement «Далі» | a server round trip after the tap | the step is requested when an option is picked (stateless replay, no writes) |

What is cached where: course bundles and the parsed content snapshot live in memory per instance (shared by all
users); `/api/vocab` responses are built once per snapshot; browsers cache vocab groups for an hour and the router cache
keeps visited pages for 30 s. Per-learner data (progress, counts, hearts) is never shared — it stays a few batched
statements per request (2–10). Pages stay dynamic on purpose: the CSP carries a per-request nonce.

### Capacity (load test, October 2026)

`scripts/load-test.ts` against the lab (production build, Postgres 16 with the real RLS, 2 ms database RTT), virtual
learners looping home → map → lesson (start + 5 answers) → words → counts → profile with ~0.3 s think time:

| Setup | Throughput of one instance | Latency | Bottleneck |
| --- | --- | --- | --- |
| pool 1 connection (old prod) | ~10 req/s | pages p50 1–1.5 s at 10 learners | queueing for the connection |
| pool 3 (prod default) | ~25 req/s | pages p50 0.4–0.65 s at 20 learners; answers p50 21 ms | one CPU core at 100 % |

CPU of a busy instance (profile): React/Next render ~33 %, network & encoding ~22 %, the search index ~10 % (built on
every cold start in every bundle — now only on demand), drizzle SQL building ~8 %. Database: ~10 round trips per
request (2–3 transactions × BEGIN / RLS `set_config` / query / COMMIT).

For 1 000–10 000 learners a day (peaks of ~20–100 req/s) Vercel scales instances (Fluid compute), so the limits are
cost and the database: Active CPU on the Vercel plan and Supabase's connections / compute.

Next steps, in order of value:
1. Shared cache of rendered content (Next.js 16 `use cache` / Vercel Runtime Cache, keyed by the content version):
   articles and lesson items are the same for everyone — render once per deploy, not per request. Needs a spike: Cache
   Components with the nonce CSP and dynamic pages.
2. Lesson player prefetches the next lesson's content as immutable JSON (CDN, `?v=<build>`), so a session is one page
   load + answers.
3. Database: one transaction per page instead of 2–3 (`userBase` + `shellData` reads in one statement); drizzle
   prepared queries for the hot reads.
4. PWA: the course content cached on the device (later, owner's decision).
5. A stress test on a preview deployment with its own Supabase project (preview has no `DATABASE_URL` today).

## 3. Measuring

### Per-request log: `PERF_TRACE=1`

Set `PERF_TRACE=1` (any environment; off by default, and then nothing is installed). Every request logs one line:

```
[perf] GET /path 381ms · db 4 stmt / 3 tx (387ms in tx)
[perf] POST /quiz (action) 172ms · db 4 stmt / 1 tx (146ms in tx)
```

`stmt` counts statements sent through drizzle (the RLS `set_config` and `BEGIN`/`COMMIT` aren't included), `tx` the
`withUser` transactions and their summed wall time. The proxy adds a `Server-Timing: proxy;dur=…` response header.
Wrap a block to time it: `await perfSpan('home.mission', () => …)` (src/server/perf.ts).

On Vercel: add `PERF_TRACE=1` to a preview deployment's environment and read the lines in the runtime logs.

### The lab: signed-in pages with a real round trip

`scripts/perf-lab.ts` runs everything a production request needs on this machine:

- Postgres with Supabase's `auth` schema, `authenticated` role and `auth.uid()` emulated, so the migrations create the
  real RLS policies and `withUser()` takes its production path. Data is copied (read-only) from `pnpm db:local`.
- A TCP proxy in front of it that delays every packet by RTT/2 and counts request→response turns.
- A fake Supabase Auth origin with an ES256 JWKS, and a signed session cookie for the chosen learner.

```bash
# 1. a throwaway Postgres (PGlite can't take one-message statements, see §4.1) — any local Postgres works
initdb -D /tmp/pg -U postgres -A trust --locale=C && pg_ctl -D /tmp/pg -o "-p 55432" start
# 2. the lab (keeps running; prints the ports)
pnpm tsx scripts/perf-lab.ts --pg postgres://postgres@127.0.0.1:55432/postgres [--user <uuid>]
# 3. a production build wired to it, on a spare port
source tmp/perf-lab/env.sh && (unset VERCEL PERF_TRACE; pnpm build) && pnpm next start -p 3310 > tmp/perf-server.log
# 4. the bench: median of N runs at each RTT, round trips, the server's [perf] line
pnpm tsx scripts/perf-bench.ts --rtt 0,20 --n 5 [--only /path,answerQuiz]
# change the RTT live
curl 'http://127.0.0.1:54342/rtt?ms=80'
```

Without `--pg` the lab uses in-memory PGlite and writes `DATABASE_PIPELINE=0` into `env.sh`.

## 4. How the database layer stays fast

### 4.1 One message per statement (`src/db/pipeline.ts`)

drizzle gets a wrapped postgres-js client: parameterized statements go out as one Parse/Describe/Bind/Execute/Sync
message (the parameterless path, what node-postgres does), so 1 round trip instead of 2. Values are still bound
parameters with type 0, which the server infers exactly as it does for the describe step. Only plain values (string,
number, boolean, null) take that path.

**No pipelining.** Supavisor's transaction mode (port 6543) does not support pipelined queries: replies get dropped or
mismatched ([Supabase: Postgres.js](https://supabase.com/docs/guides/database/postgres-js),
[supavisor#1061](https://github.com/supabase/supavisor/issues/1061)). So every handle (the pool, each transaction) sends a
statement only after the previous one settled. Promise.all over one connection is sequential on the wire; what saves
round trips is fewer statements (§4.2).

`DATABASE_PIPELINE`: unset → stock postgres-js everywhere (the one-message path is **opt-in** until verified against Supavisor on a preview deployment: set `serial` there and watch `PERF_TRACE=1`) (PGlite's socket server answers an SQL error
inside a one-message statement with an extra reply and the connection loses step) · `serial` · `pipeline` (only on a
direct connection or the session pooler, port 5432, or once Supavisor supports it: concurrent reads then share round
trips) · `0` (stock).

### 4.2 Fewer statements (`src/server/db/batch.ts`)

`readAll(conn, [read(q1, map1), read(q2, map2), …])` sends several drizzle selects as **one** statement
(`select (select json_agg(t) from (<q1>) t(c0…)) as r0, …`) and maps each result back to its own fields. Each query runs
as written (same WHERE, same RLS). Values arrive JSON-decoded — counts and sums as numbers (callers `Number()` them).

Services expose batchable reads next to their functions (`xpRead`, `stateRead`, `gameRead`, `goalRead`, `rankRead`,
`settingsRead`, `missionRead`, `activityRead`, `practiceRead`, `progressRead`, `enrollmentsRead`, …), so a caller can
put everything it needs into one statement. Writes that don't depend on each other go into one statement with
data-modifying CTEs (`recordAttemptIn`).

The common paths:

- **Every page**: `userBase()` (src/server/base.ts — profile, settings, active enrollment, per-skill level estimates of
  language courses; one statement) and
  `shellData()` (src/server/shell.ts — XP, badges, game state, library, chapter progress; one statement). Both are React
  `cache()`d: pages read `shellData().xp / .library / .game / .progress` instead of querying again.
- **Answering** (`answerQuiz`): rate limit (1) + one transaction: the session, the locked hearts row and every read the
  recording needs (1), all writes (1), the settlement — mission, streak/rank, achievements — (1). 7 round trips.
- `settleProgress()` replaces `settleMission → settleGame → evaluateAchievements`: one statement of reads; a step that
  actually writes (rare) re-reads what depends on it.

### 4.3 Rules

- Never `await` a React-cached loader (`userBase`, `shellData`, `getProfile`, `readSettings`, `activeCourse`) **inside** a
  `userScope` transaction: with one pooled connection a promise started elsewhere would wait for the connection that
  transaction holds. Read them first, pass the values in.
- New per-user reads: write them as `xxxRead(conn, userId)` and batch them; avoid N sequential `await`s in a transaction.
- Large id lists (a whole course): don't ship thousands of parameters — read the learner's rows and filter in JS
  (`lastOutcomesRead`, `srsMapIn`).
- Indexes for the hot counts: drizzle/0010_perf_indexes.sql.

## 5. Static and expensive data

- **Content snapshot** (`pnpm content:snapshot`, run by `vercel-build` before `next build`) writes `content/.snapshot/`
  (design and numbers: [fullstack/stage1/01-storage.md](./fullstack/stage1/01-storage.md)):
  `index.v8.br` (guides, chapters, links, translations, one `UnitMeta` per unit — 0.8 MB, 15 MB on the heap),
  `guides/<guide>.pack` (one pack per guide: separately brotli'd JSON sections per chapter, the placement bank and the
  chapter texts), `search.json.br`, `units-sync.json.br`, `manifest.json` — and the old monolithic `guides.v8.br`.
  A cold server reads the manifest and the index (≈ 75 ms, 15 MB) and loads **a chapter's units and reels when a page
  asks for them** (one positioned read + brotli + `JSON.parse`, 1–3 ms), through a section LRU of `CONTENT_CACHE_MB`
  (default 24) with one promise per section in flight. The monolith held 175 MB per instance; index + the 3 largest
  guides + the 2 largest course bundles now hold 58 MB. Shards are used when the vault listing, the Node/V8 version
  and every pack size match what was built; otherwise the store falls back to the monolith, then to parsing.
  Locally opt in with `CONTENT_SNAPSHOT=1`. **Rollback: `CONTENT_SHARDS=0`** serves from the monolith (still built
  and traced; remove it one release after the shards are in production).
- Parsed articles (mdast with positions, for the reader) and their translated merges are cached under
  `DOCUMENT_CACHE_MB` (default 24, shared 2:1), the cost estimated from the source size.
- **Search index**: built at deploy (`search.json.br`, 4 MB) and loaded only by `/api/search` (≈ 0.9 s, +131 MB heap —
  the same index and options as before, so the same hits); the route has its own `maxDuration`, so Vercel deploys it as
  its own function and page instances never hold it. With the monolith (`CONTENT_SHARDS=0`) it is still built on the
  first search, in 200-document chunks (`warmSearchIndex`).
- **Course bundles**: `course:build` writes `content/courses/catalog.json` (listings, guides, languages, legacy lesson
  ids; 0.5 MB, 1.3 MB heap). A bundle is read and schema-validated when its course is opened and kept under
  `COURSE_CACHE_MB` (default 24; cost 2.3× the file). All four at once were 24 MB.
- Measure it all: `pnpm content:measure [--assert] [--verify] [--guides] [--json]` (budgets in the script header) and
  `pnpm build && pnpm content:functions` (traced size per function). Shiki: one highlighter, languages loaded on demand,
  highlighted blocks memoized (4000 entries).

## 6. Client

- `loading.tsx` skeletons (Loo thinking + soft blocks, no spinners) for every route (`src/app/loading.tsx`) and shaped
  ones for the path, the players, the reader and the practice hubs: a link responds the instant it's pressed, and
  links prefetch down to the skeleton.
- Answering: the pressed option stays pressed (lip down, soft pulse) with a short tick (also unlocks audio inside the
  gesture so the verdict's sound plays on time) and the haptic tap; the verdict lands ~10 ms of database later. Practice
  quizzes with a shipped key grade instantly. The shop plays its sound on press.
- `[!diagram]`, `[!viz]` and `[!figure]` blocks load their code only on pages that show one (`src/ui/markdown/lazy-blocks.tsx`).
- The code-runner worker (`/runner/worker.js`) carries the TypeScript stripper (sucrase, ~180 KB minified / ~41 KB gzip): the script grew from ~23 KB (~6.5 KB gzip) to ~207 KB (~48 KB gzip). It is fetched only when a task runs and then revalidated by `ETag` (304 on later runs), never part of a page bundle.
- Pixel icons: one `<path>` per colour instead of a `<rect>` per run (~1 KB instead of ~4 KB each).
- `/words` groups use `content-visibility: auto`.

## 7. Platform settings (owner)

- Keep `"regions": ["dub1"]` (Supabase is in `eu-west-1`). Check in the deployment's function details that it took.
- `DATABASE_POOL_MAX` (default on Vercel is now 3): 1 serializes all of an instance's concurrent requests (Fluid compute shares instances). 3–5 lets
  them overlap; the Supavisor client-connection limit of the plan is the ceiling (instances × max).
- Supabase's **dedicated pooler** (PgBouncer) or the **session pooler** (5432) would allow `DATABASE_PIPELINE=pipeline`.
- `PERF_TRACE=1` on a preview deployment to see real numbers per route.
