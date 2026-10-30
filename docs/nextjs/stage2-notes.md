# Stage 2 — lead's integration notes (to apply after the batch)

- Start 07: `prerequisites` → `[[Next.js Start - 06. Перший проєкт, create-next-app і структура]]` once 06 exists.
- Start 07: «тема про SEO основного посібника» → «тема 33 основного посібника».
- research/routing.md: add (a) `next build` passes without root layout / `<html>`/`<body>` on 16.3.8, only `next dev`
  reports it; (b) with Cache Components a `usePathname` menu in the root layout makes any dynamic route without
  `generateStaticParams` a build error (common beginner trap).
- STYLE §4: fixed wording of the "data in memory" note for Start topics (no «тема 10» reference from inside Start 10).
- Glossary keepLatin: utility-first, mobile-first, CSS Modules, error boundary, skeleton, fallback, scoping.
- research/ui.md: Tailwind v4 verified on 4.3.3 (setup, `@theme` vs `:root`, `@custom-variant dark`, breakpoints,
  `hover:` inside `@media (hover:hover)`); Next docs install without `postcss` package — builds fine.
- Start topics use exercise `level: junior` in meta (section `level: noob` forces noob anyway) — check compiled levels.
- BRIEF: define word-count method (whitespace tokens, code fences and inline code excluded); note course:check won't
  test Start starters until basics/start are active in course.yaml (lead activates after wave 1).
- Glossary keepLatin: DOM, CSSOM, render tree, ETag, origin.
- Scratchpad is shared between agents — tell them to name scratch files with their topic id.
- STYLE §3: Start exercises use `level: junior` in meta (content `toLevel` drops `noob`); section `level: noob` forces
  noob on compile — verify in bundle.
- STYLE §4: after deleting a page opened in `next dev`, `next build` fails (`.next/dev/types/validator.ts`) — rm .next.
- Glossary keepLatin: FormData, progressive enhancement, preview deployment, build logs, runtime logs, Instant Rollback.
- Vercel docs disagree where `vercel env pull` writes (.env vs .env.local) — Start 12 stays neutral.
- Glossary terms: стан→state, хук→hook, ефект→Effect, підняття стану→lifting state up, похідний стан→derived state,
  функція-оновлювач→updater function, звуження типу→narrowing, розрізнюваний union→discriminated union,
  перевірка повноти→exhaustive check. keepLatin: Strict Mode, batching, reducer, generic, satisfies, as const.
- New research/foundations.md: sync `{ params: { slug } }` passes `next build` on 16.3.8 (validator `& any`), renders
  empty — `PageProps<'/route/[slug]'>` catches it (TS2339); `next dev` doesn't type-check, `next build` does;
  create-next-app 16.3.8 types root layout as `LayoutProps<"/">`.
- Decision needed: optional «🏭 Як це роблять у продакшні» in Start topics — keep (useful), not required.
- research/routing.md: different slug names at different depths ([id] vs [slug]/edit) pass `next build`, then every
  URL 500s at runtime (side-by-side → "Ambiguous app routes"); `src/app` silently ignored when root `app/` exists;
  helper named `template.tsx` replaces page content; build error texts (page/route, duplicate group — truncated in
  16.3.8, optional catch-all, error.tsx client); `notFound()` under loading → 200 + noindex.
- ~~Start 07 warning reword~~ WRONG: with no layout file `next dev` shows the browser overlay «Missing <html> and <body> tags…» (status 200, terminal silent); dev does NOT create app/layout.tsx (bundled installation.md:216 says it does). Start 07 warning stays.
- SYLLABUS §13 row 01: slug-name conflicts are a CI check, not caught by build.
- Glossary keepLatin: route group, catch-all, colocation, root layout, leaf segment.
- research/routing.md + SYLLABUS §13 row 03: params NOT decoded on 16.3.8 (Cyrillic slug → silent 404; searchParams
  are decoded); empty generateStaticParams fails per call (child returning [] for one parent); sync params.slug
  silently undefined; priority is per segment left→right (/en/about → en/[page]); soft 404 (200+noindex) under
  Suspense; `◐` partial-param shell rows in build output.
- Glossary keepLatin: optional catch-all, slug, query string, soft 404, App Shell.
- BRIEF: content:check takes the guide slug/title, not a file path.
- research/routing.md §02 + SYLLABUS §13 (04/12/41 row): with Cache Components Activity restores template AND layout
  state for routes it keeps — template guarantees fresh state only for routes not kept; `app/page.tsx` next to
  `app/(marketing)/page.tsx` builds and app/page.tsx silently wins at `/`; title rules (string title in a middle
  layout cuts the template; a layout's template doesn't apply to its own folder's page); hidden children still leak
  into RSC payload.
- Topic 33 writer: reuse title rules from core-02 task-03.
- **CORRECT research/routing.md + SYLLABUS §13 row 05**: missing `default.js` does NOT fail the build on 16.3.8
  (built-in default → notFound(); refresh 404s) — CI/review check. Also: `@modal/[...catchAll]` doesn't match `/` →
  need `@modal/page.tsx`; interception only from within the intercepting segment (Next-Url); conditional slot output
  is in RSC payload; closed modal kept hidden by Activity (e2e: check visibility, not presence).
- Verify icon `px:layers` (core-05) exists — course:check will flag on activation.
- Glossary: keepLatin parallel routes, intercepting routes, soft/hard navigation, deep link; слот→slot,
  перехоплювальний маршрут→intercepting route.
- research/routing.md (04): Activity "up to 3" includes the visible route; bfcacheId changes on every Link/push even
  into preserved routes; `staleTimes.static < 30` breaks build for `'use cache'` pages (lowers default cacheLife
  stale); `staleTimes.dynamic` has no 30s minimum; Next-Router-Prefetch 1/2/3 observed (undocumented); blocking route
  needs `instant = false`; wrong `_rsc` → 307.
- Glossary keepLatin: App Shell, Partial Prefetching, Client Cache, Activity, per-link prefetch, Navigation Inspector,
  bfcacheId.
- Core-04 is ~7.5k words with practice — reviewer to judge trimming.
- research: `npm run dev -p 4000` without `--` → `next dev 4000` (npm 11); create-next-app 16.3.8 writes exact
  `react: 19.2.8`; any flag skips the defaults menu; writes AGENTS.md + CLAUDE.md (`@AGENTS.md`); `--help` lists
  `--rspack` not `--turbopack/--webpack`; Turbopack is default for `build` too (glossary in bundled docs outdated);
  GET Route Handler: ƒ without Cache Components, ○ with.
- Glossary keepLatin: Fast Refresh, HMR, import alias, CSR, SSR, SSG, bundler, code splitting, static export.
- Decision: Start 06 is the place for the course baseline (cacheComponents: true) — keep.
- Word count: prose excludes exercises? Writers differ — reviewer judges by STYLE ranges incl. exercises.
- research/rendering.md §09: inline `self.__next_f.push` confirmed; row types I/H/E/X/C, prefixes $L/$@/$D/$n/$Q/$W/$h/$$,
  "b" = BUILD_ID; `RSC: 1` → 307 to `?_rsc`; payload is TEXT rows (bundled glossary says "binary" — wrong on 16.3.8);
  Cache Components: `Math.random()`/`new Date()` in a Client Component outside Suspense fails prerender ("unstable
  value … in a Client Component"); Suspense fixes the build; mismatch then shows in `next dev` only — in prod the boundary isn't SSR'd (HTML has the fallback), no #418, content missing from HTML (reviewer, corrects core-09).
- Glossary keepLatin: Flight, selective hydration, inline script.
- APPLIED: unstable_doesProxyMatch → unstable_doesMiddlewareMatch in SYLLABUS + research (routing, testing).
- research/routing.md (06): matcher from a variable = build error (not "ignored"); `/about` matches only `/about`
  (docs say also /about/team); `(?!api)` also skips /apiary; config headers not applied to 308 redirects; redirect()
  under Suspense after shell → 200 + meta refresh; edge not supported in proxy (stay on middleware.ts); CVE-2025-29927
  facts from GHSA-f82v-jwr5-mffw (< 15.2.3; patched 12.3.5/13.5.9/14.2.25/15.2.3; Vercel unaffected).
- Glossary keepLatin: matcher, rewrite, redirect, negative lookahead, open redirect, Bloom filter.
- research/rendering.md §08: server-side exports of 'use client' files are client references (typeof function,
  arithmetic NaN); separate server/SSR module instances; `react-server` export condition undocumented in Next docs
  (verified); side-effect barrels pull code into client chunks, side-effect-free barrels tree-shake; Import trace hides
  re-exporting barrels; taint bypassed by `{...rest}` copy (leaks other fields), taintUniqueValue catches token in a
  new object; `next experimental-analyze --output` → `.next/diagnostics/analyze`.
- Glossary keepLatin: client reference, export condition, barrel, render prop, Import trace.
- research/rendering.md (13): error.tsx gets both `retry` (new server render via router.refresh + reset) and `reset`
  (same payload); prod SC error → #441 + numeric digest (stable, matches server log/onRequestError); client render
  error in prod keeps message, digest undefined; digests `NEXT_REDIRECT;push;/path;307;`, `NEXT_HTTP_ERROR_FALLBACK;404|403`;
  forbidden/unauthorized static 403/401, under Suspense 200+noindex; `catchError` ErrorInfo.error is `unknown` (docs
  say Error; docs example fails TS18046); static page that throws fails `next build` (error.tsx doesn't save it).
- research/routing.md: notFound() in a layout skips its own segment's not-found; not-found renders in the deepest
  surviving layout.
- core-13 prose without exercises ≈3.9k (< 4k main-guide minimum) — reviewer to judge.
- Glossary keepLatin: digest, backoff.
- research/rendering.md §10: docs disagree io() vs connection() (error hints, Caching, Migrating pages still say
  connection()); prefetch-blocking claim NOT measured — reviewer to measure with headless browser; build vs dev error
  texts differ (build: "uncached or runtime data", blocking-prerender-dynamic; dev: "runtime data", exact line,
  blocking-prerender-runtime, page still 200); sync new Date() inside Suspense still fails build; Client Component
  Date.now() inside Suspense builds ○; draftMode() outside Suspense → ○; instant=false makes cookies-at-top route ƒ
  but doesn't clear sync errors; removed segment configs fail with "not compatible with nextConfig.cacheComponents";
  ◐ responses: `private, no-store` + `x-nextjs-postponed: 1`.
- BRIEF: symlinking node_modules into -cases app breaks Turbopack — use `cp -cR` (APFS clone, ~4s).
- Glossary keepLatin: static shell, prerendering, request-time, Request-time APIs, Draft Mode; дірка → hole.
- research/rendering.md §11: bots with Cache Components wait only for generateMetadata, boundaries still stream
  (docs say one burst); Googlebot = DOM bot (normal stream); React 19.2 reveal throttle ~300ms between boundaries;
  nested boundary ready first swaps inside parent's hidden segment (fallback never shown); notFound() after
  request-time await → 200+noindex, real 404 needs check before any request-time await; redirect() in boundary → 200 +
  meta refresh; mid-stream error → $RX + digest + `<!--$!-->`; htmlLimitedBots regex in
  next/dist/shared/lib/router/utils/html-bots.js; next start sends X-Accel-Buffering: no.
- BRIEF: playwright-core lives at node_modules/.pnpm/playwright-core@1.56.0/node_modules/playwright-core; tsx scripts
  with top-level await need .mts.
- FIX at integration: core-05 icon `px:layers` doesn't exist → pick an existing px icon.
- research/rendering.md + SYLLABUS §13 (03/12/30): ANY `runtime` export fails the build under Cache Components (also
  'nodejs'); CSP nonce: build passes, route ◐, shell `<script src>` get no nonce → browser blocks, page never hydrates
  (silent) — workaround `instant = false` + `await connection()` in a layout (route ƒ); App Shell upgrade for unknown
  slugs after first visit needs `partialPrefetching: true`; instant=false turns non-prerenderable route into ƒ.
- research/testing.md (41): `@next/playwright@16.3.8` `instant()` works in dev and prod
  (`exposeTestingApiInProductionBuild`); filter by visibility (Activity keeps hidden copies); keep layout vs loading
  fallback texts distinct.
- STYLE §4 data-note: in Suspense topics use «Звідки в прикладах «повільна база»» (setTimeout counts as uncached I/O).
- Glossary keepLatin: postponedState, resume, dev overlay.
- PROCESS: an agent killed another's server by PID — BRIEF must say: before killing a PID check its cwd is yours.
- CORRECTION (routing note b): a dynamic route without generateStaticParams fails the build on `params` alone under
  Cache Components; the root-layout usePathname menu only adds a second error. Third fix offered by the error output:
  `export const instant = false`.
- core-08: `next build` renders a static page twice in the same instance (counters 2) — don't claim «рендериться один раз».
- core-09: click on a Link to a prefetched page sends no request; prefetch = segment requests (`/_tree`, `/<route>/__PAGE__` from `.segments/`); byte-identical `.rsc` only for plain `RSC: 1` curl. `.rsc` starts with `#` (complete) / `~` (partial) marker byte. Bundled migrating-to-cache-components.md:103 suggests moving Math.random() into a Client Component — on 16.3.8 that fails the prerender.
