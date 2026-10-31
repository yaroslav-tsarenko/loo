# Stage 3 — lead's integration notes (to apply after the wave)

## Wave A (data 14–20)
- core-15: with the default in-memory handler, stale-while-revalidate works only for prerendered routes. A runtime
  `'use cache'` entry (inside a Suspense hole) counts as a miss once `revalidate` passes, so the request blocks. This
  is intentional per `next/dist/server/lib/cache-handlers/default.js`. `next dev` keeps stale entries until `expire`.
  → add to research/data.md §15; forwarded to the core-16 writer.
- core-15: an explicit outer `cacheLife` masks the inner ones in the build table (`/nested-explicit 1d` while the
  inner is `1m`). → one-line refinement in core-12 («найкоротший cacheLife у shell»).
- core-15: a `URL` argument to `'use cache'` doesn't throw, it is silently turned into a string (the docs list it as
  unsupported).
- core-18: entries filled during `next build` are not reused by `next start`; prerendered `.meta` aggregates
  `x-next-cache-tags` + `_N_T_` soft tags (not sent to the browser).
- core-19: under Cache Components ANY extra method export in `route.ts` (POST, even empty OPTIONS) makes the whole
  route `ƒ`; `use cache` data inside stays cached. Docs imply GET stays cached. → SYLLABUS §13 row 19, research/data.md.
- core-19: `'use cache'` directly in a GET body → misleading "Only plain objects… can be passed to Client Components".
- core-19: `updateTag` in a Route Handler → 500 "updateTag can only be called from within a Server Action".
- Glossary keepLatin: preflight, Backend-for-Frontend (BFF), webhook.
- core-17: ISR for URLs not in generateStaticParams needs `partialPrefetching: true` (16.3) under CC — otherwise
  always shell + postponed, never cached (docs say "saved after first request"). → SYLLABUS row 17.
- core-17: soft 404 (`notFound()` inside Suspense) is cached as 200 + HIT; above Suspense → 404 HIT.
- core-17 REVIEWER: `revalidateTag(tag,{expire:0})` without partialPrefetching left page postponed with build-time
  data — reproduce. Build-table Revalidate/Expire columns appeared inconsistently between apps — reproduce.
- Glossary keepLatin: ISR, CDN, stale-while-revalidate, soft 404.
- core-14: fetch memo key ignores caching options (`cache`, `next.revalidate`); method/headers/signal split it.
  `next dev` logging.fetches prints memoized calls too. → research/data.md §14.
- BRIEF-writer: EX marker text must not contain `[[…]]` (parser reads wiki-links inside HTML comments). APPLY.
- core-14 links to 29/44 as text — fine. STYLE §4 data-note wording in 14 points to 15–16/11–12 — accepted.
- core-18: `cacheMaxMemorySize: 0` also disables the built-in `use cache` handler (with a custom `cacheHandler`);
  `use cache: remote` inside `private` works on 16.3.8 (docs: error); `use cache: private` re-runs every request even
  for the same user, handler never called. → SYLLABUS §13 row 18.
- Glossary keepLatin: cache handler, soft tags, hit rate.
- core-20: local SQLite via ORM (libsql `file:`, Prisma 7 better-sqlite3 adapter) under CC without Suspense/io() →
  silent ○ with build-time data (docs mention only sync drivers like node:sqlite). Networked `pg` → normal build
  error. → SYLLABUS §13 row 20; check core-14 quiz ~131 wording (forwarded to the 14/15 reviewer).
- core-20: npm `latest` for `prisma` is 8.0.0-rc (Prisma Next) — pin `@7` in examples. → SYLLABUS row 20.
- research/data.md: replace «Fluid Compute зменшує проблему (не звірено)» with verified `attachDatabasePool` facts.
- core-20: SWR `fallback` is treated as stale → immediate revalidation request after hydration; TanStack hydration
  with staleTime doesn't refetch.
- Glossary keepLatin: connection pool, pooler, driver adapter, transaction mode, HTTP driver.
- core-16: tag-based SWR (`revalidateTag(tag,'max')`) works for runtime `use cache` entries too; only time-based
  expiry of runtime entries blocks (core-15). Wording in 15/16/18 must keep this distinction.
- core-16: `revalidateTag(tag,{expire:0})` in an action also returns a re-render to the author (docs mention only the
  SWR exception). → research/data.md item 6.
- core-16 CONTRADICTS core-17 note: without partialPrefetching `{expire:0}` came back fresh (blocking) — reviewer 17 settles.
- core-16: Chrome HTTP disk cache serves the re-prefetch after an action revalidation (swr header) → Link shows stale.
  Possible upstream bug; candidate note in 04/17.
- core-16: `revalidatePath('/blog/[slug]')` without `type` = no-op + warning; `redirect` before `updateTag` = stale.

### Review 14+15 (opus) — ready after fixes
- CONFIRMED: fetch memo key = URL+method+headers+mode/credentials/redirect/referrer/integrity; `cache`/revalidate
  excluded; GET+HEAD deduped; `keepalive` opts out; `force-cache` answered from persistent cache BEFORE memo.
- CONFIRMED: no time-based SWR for runtime `use cache`; URL arg → string; build entries not reused at start.
- Brief error: nested `days` under default is `15m 1w` (not `15m 1y`) — topic is right.
- Fix routing: prose → writers 14/15 (now), exercises → authors after (quiz-02 «мережева БД», card-04, task-03 HEAD,
  task-01 order-agnostic test; 15: `>>` → `> >` callouts, double blank lines, trim duplicate reels).

### Review 17+19 (opus) — ready after fixes
- SETTLED: PP needed for ISR of unknown URLs only with a non-empty App Shell (params read in Suspense); empty shell
  without PP = old blocking ISR (MISS→HIT, real 404 first request). `expire:0` without PP: gSP child of a non-empty-shell
  route stays postponed with build-time data; static/empty-shell pages fresh after one blocking MISS (16 is right too).
- Build table Revalidate/Expire columns print only if a TOP-LEVEL route entry has revalidate/expire (printTreeView).
- Chrome applies `stale-while-revalidate` from Next's Cache-Control to its HTTP cache (plain fetch too).
- `REVALIDATED` x-nextjs-cache after `expire` passes on 16.3.8.
- Route Handlers: `○` → any non-GET/HEAD incl. OPTIONS = 405 + two Allow lines; HEAD = cache HIT (GET not run).
  `ƒ` → missing method 405 without Allow, empty body; auto OPTIONS 204. `●` gSP paths answer ANY method 200 HIT with
  the cached GET body.
- Exercise fixes queued after prose: 17 quiz-02 columns, card-04/quiz-07 browser cache, task-03 lowercase header test;
  19 quiz-01 (static OPTIONS→405), quiz-02 (ƒ 405 no Allow), task-03 note, trim cards 06/07 + reel ⏱️.

### Review 16+18+20 (opus) — ready after fixes
- Cross-topic SWR / expire:0 / per-instance / updateTag consistent. `{expire:0}` w/o PP: static AND empty-shell gSP
  routes → blocking MISS fresh; non-empty-shell gSP (17's /products) → stays postponed (17 reviewer). With PP → shell +
  fresh stream. Each topic states its config.
- NEW TRAP (→ SYLLABUS §13 rows 19/20): a GET Route Handler reading local SQLite is `○` with frozen data; `await io()`
  makes it ƒ.
- `cacheMaxMemorySize: 0` alone disables the runtime in-memory cache (documented).
- Default profile hands handlers `expire: 4294967294` → TTL=expire never cleans old-deploy keys.
- Lead applied: core-15 warning title «…за часом».
