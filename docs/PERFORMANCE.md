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

- **Content snapshot** (`pnpm content:snapshot`, run by `vercel-build` before `next build`): the parsed vault, v8-serialized
  and brotli-compressed into `content/.snapshot/guides.v8.br` (3.5 MB, traced into every function). A cold server loads it
  in ~0.19 s instead of parsing for 3.5 s. Used only when the vault listing (paths + sizes) and the V8 version match;
  locally opt in with `CONTENT_SNAPSHOT=1`. Chapter documents not in the snapshot are parsed on first view and kept (LRU).
- **Search index**: built 1.5 s after the first request in 200-document chunks (`warmSearchIndex`), so it no longer blocks
  the instance for ~0.7 s.
- Course bundles: parsed and validated once per process (~50 ms). Shiki: one highlighter, languages loaded on demand,
  highlighted blocks memoized (4000 entries).

## 6. Client

- `loading.tsx` skeletons (Loo thinking + soft blocks, no spinners) for every route (`src/app/loading.tsx`) and shaped
  ones for the path, the players, the reader and the practice hubs: a link responds the instant it's pressed, and
  links prefetch down to the skeleton.
- Answering: the pressed option stays pressed (lip down, soft pulse) with a short tick (also unlocks audio inside the
  gesture so the verdict's sound plays on time) and the haptic tap; the verdict lands ~10 ms of database later. Practice
  quizzes with a shipped key grade instantly. The shop plays its sound on press.
- `[!diagram]`, `[!viz]` and `[!figure]` blocks load their code only on pages that show one (`src/ui/markdown/lazy-blocks.tsx`).
- Pixel icons: one `<path>` per colour instead of a `<rect>` per run (~1 KB instead of ~4 KB each).
- `/words` groups use `content-visibility: auto`.

## 7. Platform settings (owner)

- Keep `"regions": ["dub1"]` (Supabase is in `eu-west-1`). Check in the deployment's function details that it took.
- `DATABASE_POOL_MAX` (default on Vercel is now 3): 1 serializes all of an instance's concurrent requests (Fluid compute shares instances). 3–5 lets
  them overlap; the Supavisor client-connection limit of the plan is the ceiling (instances × max).
- Supabase's **dedicated pooler** (PgBouncer) or the **session pooler** (5432) would allow `DATABASE_PIPELINE=pipeline`.
- `PERF_TRACE=1` on a preview deployment to see real numbers per route.
