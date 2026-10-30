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
- Start 07 warning: with no layout file neither dev nor build complains — reword.
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
