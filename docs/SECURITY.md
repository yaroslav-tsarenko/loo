# SECURITY — audit, fixes, and the multi-user plan

Scope: Next.js 16 App Router app on Vercel; Postgres (Supabase in prod, PGlite locally) via drizzle/postgres-js; single-user auth
(`APP_PASSWORD` → HMAC-signed cookie) at audit time — **replaced by Supabase Auth in Phase 2, see §5**. Audit date: 2026-10-16. File:line references point at the code **before** the fixes
(commit `677d9ee`) unless marked otherwise.

- Part 1: threat model and findings
- Part 2: what was fixed, and how it was verified
- Part 3: design for multi-user auth and user-uploaded courses

---

## 1. Threat model

| Asset | Why it matters |
|---|---|
| `DATABASE_URL` (connects as `postgres`, bypasses RLS), `AUTH_SECRET`, `APP_PASSWORD`, `CRON_SECRET`, AI Gateway key / `VERCEL_OIDC_TOKEN` | Any one of these means full compromise or a cost incident |
| Learning progress (attempts, SRS, mistakes, drafts, settings) | Integrity and availability. It's personal data once the app is multi-user |
| AI Gateway budget | `generateReelsNow` / cron make paid model calls |
| Users' browsers | XSS, clickjacking, malicious course code (future) |

| Attacker | Capabilities |
|---|---|
| Anonymous internet user | Reaches every route, downloads all public JS chunks (and the server action IDs in them), and sends arbitrary headers and bodies |
| Feed author | Controls titles and summaries on Reddit, HN, dev.to and GitHub releases. That text reaches the DB, the UI **and the LLM prompt** |
| LLM output | Not trusted. It can be steered by a prompt injection from news text |
| Course author (future) | Controls markdown, YAML, images and test code that run in other users' browsers |
| Authenticated user (future multi-user) | Calls any action with any arguments and targets other users' rows |

Trust boundaries: browser ↔ `src/proxy.ts` ↔ route handlers and server actions ↔ Postgres; server ↔ external feeds, the AI Gateway and model-suggested URLs; the main thread ↔ the code-runner worker; the Node host ↔ the `node:vm` snippet sandbox.

---

## 2. Findings

Status: **Fixed** means fixed in this change. **Planned** is deferred to the auth refactor (Part 3). **Accepted** is a residual risk we've documented and kept.

| ID | Sev | Finding | Status |
|---|---|---|---|
| C1 | Critical | Auth bypass: every server action callable without a session through `*.png`/`*.svg`/… paths | Fixed |
| C2 | Critical | Host-realm escape in the AI-reels code sandbox → RCE with all prod secrets (reachable through prompt injection from news feeds) | Fixed |
| H1 | High | No login rate limit (parallel brute force of a single shared password) | Fixed |
| H2 | High | HMAC key falls back to `APP_PASSWORD` → offline password cracking from one stolen cookie | Fixed |
| H3 | High | Next.js 16.3.6 known advisories (Image Optimization SSRF, cache poisoning, metadata info leak) | Fixed (16.3.8) |
| M1 | Medium | No CSP / anti-framing / security headers | Fixed |
| M2 | Medium | Open redirect after login (`next=/\evil.com`) | Fixed |
| M3 | Medium | Markdown links and images rendered with any URL scheme or host | Fixed |
| M4 | Medium | Mass assignment in `updateSetting` (writes `internal.*` cooldown keys, so the AI/news cost limits can be bypassed) | Fixed |
| M5 | Medium | Server actions without input validation (arbitrary rows, unbounded JSON, NaN numbers) | Fixed |
| M6 | Medium | Code-runner worker isolated only by deleting globals; `import()`/FontFace network and same-origin cookies still reachable | Fixed (CSP-locked worker); stronger isolation Planned |
| M7 | Medium | `urlResponds` follows redirects from allow-listed hosts to anywhere (SSRF) | Fixed |
| M8 | Medium | `vault-asset`: symlink escape, no size cap, SVG not sandboxed | Fixed |
| M9 | Medium | `updateVaultPath` lets a client repoint the server's content root on Vercel | Fixed |
| L1 | Low | Cron bearer compared with `===`; route handlers relied on the proxy matcher only | Fixed |
| L2 | Low | Provider/internal error messages returned to clients | Fixed |
| L3 | Low | 365-day sessions, no logout, no rotation | Fixed (30-day sliding, logout); server-side revocation Planned |
| L4 | Low | Unbounded feed bodies; unbounded feed text into DB and prompt | Fixed |
| L5 | Low | News text placed in the LLM prompt without an "untrusted data" frame | Fixed (defense in depth; residual risk Accepted) |
| L6 | Low | Supabase auto-grants `anon`/`authenticated` on future tables until the lockdown migration is re-run | Fixed (default privileges) |
| L7 | Low | App connects as `postgres` (owner, `BYPASSRLS`) | Planned |
| L8 | Low | `/api/tree/[guide]` 500 on malformed `%` sequences | Fixed |
| I1 | Info | Dev-only advisories: `braces` (eslint), `esbuild` (drizzle-kit) | Accepted |
| I2 | Info | `.mcp.json` Supabase MCP has database/development features against the prod project | Recommendation |
| I3 | Info | `.env.local` holds the prod DB password, and local dev can point at prod | Recommendation |
| I4 | Info | Client-side grading (`solved` / `correct` are trusted) | Planned (matters once leagues exist) |

### C1 — Critical: unauthenticated server actions via extension-suffixed paths

- **Where:** `src/proxy.ts:25` — `matcher: ['/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|woff2?)$).*)']`. Also `src/proxy.ts:4,8`: the public list matched by prefix (`/login.*`, `/icon/*`, …).
- **Exploit (reproduced on a dev server in password mode):** action IDs are in the public client chunks under `/_next/static`. Example: `40ffbd…` = `trackReading`. The request below ran the action with no cookie (`ƒ trackReading(...)` in the server log). The proxy never ran because the path ends in `.png`. Next still routes the path to `/g/[guide]/[[...slug]]` and serves that page's actions: `updateSetting`, `saveTaskDraft`, `finishTask`, `recordQuizAnswer`, `trackReading`, `markChapter`. The same applies to `/learn/<x>.png`.
  ```
  POST /g/javascript/x.png
  Next-Action: 40ffbd6d8abe7202ae58c87fac126a9a8f492ca75e
  ["…args…"]
  ```
- **Fix:**
  - The matcher now excludes only `/_next/static/`.
  - Public paths are an exact-match allow-list keyed by method.
  - Any request carrying `Next-Action` without a valid session gets 401, whatever the path.
  - Login moved from an inline server action to `POST /auth/login`, so **no** server action is reachable before auth.
  - Every action calls `requireSession()` (`src/server/auth-guard.ts`) as defense in depth.

### C2 — Critical (impact) / prompt-injection-dependent: `node:vm` escape in the reels code check

- **Where:** `src/ai/reels/code-check.ts:55` — `vm.createContext({ console: { log, … } })` places **host-realm** functions in the context.
- **Exploit:**
  - **Payload (verified).** `console.log.constructor('return process')()` returns the worker's real `process`, which exposes the full `process.env`, a copy of every prod secret, and `process.getBuiltinModule('child_process')`. `this.constructor.constructor` also works, because the sandbox object is a host object.
  - **Delivery.** Model output is executed *before* the fact-check model sees it (`generate.ts:210`). The model's input includes news titles and summaries that anyone can post on Reddit, HN or dev.to (`newsBlock`). An injected "include this code in the reel" instruction therefore leads to RCE in the cron function, which has `DATABASE_URL` (superuser), `AUTH_SECRET`, `CRON_SECRET` and the OIDC token.
- **Fix:**
  - Context created with `vm.constants.DONT_CONTEXTIFY` (falling back to a null-prototype sandbox), so no host `Object`/`Function` is reachable.
  - `console` is a context-realm function that closes over the host logger, and it swallows every throw so a host-realm `Error` can never leak in.
  - The worker source is strict mode, so `.caller` and `CallSite#getFunction` are censored.
  - `util.inspect` runs with `customInspect:false, showProxy:false, getters:false`.
  - The worker runs with `env: {}` (no secrets even after an escape) and a `stackSizeMb` limit.
  - News text in the prompt is fenced and labelled untrusted.
  - Regression tests cover the escape probes (`tests/unit/security.test.ts`).
- **Residual:** `node:vm` is still not a hard boundary against V8 0-days. Part 3 moves untrusted code execution to Vercel Sandbox.

### H1 — High: no login rate limiting

- **Where:** `src/app/login/page.tsx:18` — only an 800 ms `setTimeout` per request; parallel requests were unbounded.
- **Fix:**
  - `src/app/auth/login/route.ts` uses a Postgres fixed-window limiter (`rate_limits`, migration `0004`): 10 attempts / 15 min per IP and 100 / hour globally. It fails closed if the limiter is down and adds a 600 ms delay on failure.
  - Failed attempts are logged with the IP.
- **Residual (Accepted):**
  - The global ceiling lets an attacker block *new* logins for up to an hour; existing sessions are unaffected.
  - Outside Vercel, `x-forwarded-for` is client-controlled, so only the global rule holds there.

### H2 — High: password-derived HMAC key

- **Where:** `src/lib/auth.ts:16` — `AUTH_SECRET || \`${APP_PASSWORD}::interview-prep\``. With `AUTH_SECRET` unset, any captured cookie (`expires.HMAC(expires)`) lets an attacker test password guesses offline at GPU speed.
- **Fix:**
  - On Vercel, `authMode()` returns `locked` unless `AUTH_SECRET` is at least 32 characters.
  - `pnpm env:check` enforces the same rule.
  - Tokens are domain-separated (`session:` prefix).

### H3 — High: vulnerable Next.js

- `pnpm audit` reported Next 16.3.6 → <16.3.8: an Image Optimization SSRF (high), SSG/ISR cache poisoning, a metadata-image info leak, and a dev MCP info leak.
- Upgraded `next` and `eslint-config-next` to 16.3.8. Added a `source-map-js` ≥ 1.2.2 override (DoS, build-time).

### M1 — Medium: no CSP or security headers

- **Fix:**
  - **Per-request nonce CSP** in `src/proxy.ts`, built by `src/lib/csp.ts`:
    ```
    default-src 'self'; script-src 'self' 'nonce-…' 'strict-dynamic'; style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self' data: blob:;
    worker-src 'self'; manifest-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none';
    form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests (https only)
    ```
    - Dev adds `'unsafe-eval'` (React dev tooling) and `ws:` (HMR).
    - The inline `SIDEBAR_BOOT` script carries the nonce (`src/app/layout.tsx`).
  - **Static headers** in `next.config.ts`: HSTS (2y, includeSubDomains), `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy: same-origin`, COOP and CORP `same-origin`, and a restrictive `Permissions-Policy`.
- **Accepted:** `style-src 'unsafe-inline'`. The UI uses React `style` props and motion; style injection without script execution is low impact.

### M2 — Medium: open redirect after login

- **Where:** `src/app/login/page.tsx:10` — `startsWith('/') && !startsWith('//')` accepts `/\evil.com` and `/\t/evil.com`, which browsers normalize to `//evil.com`.
- **Fix:** `safeRedirectPath()` (`src/lib/redirect.ts`) rejects backslashes and control characters and requires a same-origin parse. The login handler also uses **relative** `Location` headers.

### M3 — Medium: URL schemes in rendered content

- **Where:** `src/ui/markdown/render.tsx:70` — `href` passed through unchanged; no `img` handling. React 19 neutralizes `javascript:`, but not `data:`, other schemes, or external tracking images. This is the same pipeline that renders AI reels (`services/feed.ts:170`) and future user courses.
- **Fix:**
  - `safeLinkHref` (http/https/mailto/obsidian or same-origin relative) and `safeImageSrc` (same-origin or `data:image/<raster>`) in `src/lib/url.ts`.
  - `safeExternalUrl` (http/https only) is applied to news items at ingest and render (`NewsRow`), and to AI reel sources (`services/feed.ts`, `/feed/generated`).
  - Raw HTML stays disabled (`allowDangerousHtml: false`).

### M4 — Medium: mass assignment in `updateSetting`

- **Where:** `src/server/actions/settings.ts:12`. The generic `K` is compile-time only. At runtime any key was accepted, and unknown keys were coerced as integers 1–500. A caller could therefore write `internal.reelsGeneratedAt = 1`, resetting the 30-minute AI cooldown and allowing unlimited paid generations, or `vaultPath`.
- **Fix:** a zod enum of the user-facing keys and a typed value schema. `writeSetting` still coerces per key.

### M5 — Medium: server action input validation

- **Where:**
  - `study.ts:48` `saveTaskDraft`: any `unitId` creates rows.
  - `study.ts:103` `startSession`: `filters` is unbounded JSON (≤ 1 MB per call → DB bloat).
  - `completeLesson`: `correct`/`total` unchecked (NaN accuracy).
  - `toggleReel`: field and value unchecked.
  - Ids never type-checked.
- **Fix:**
  - zod schemas on every action: lengths, enums, int ranges, `uuid` session ids, at most 20 filter keys, at most 500 unit ids.
  - Units must exist (and be tasks where relevant).
  - Generic `Invalid input` / `Unknown unit` errors with no echo.
  - `serverActions.bodySizeLimit` lowered to 256 KB.

### M6 — Medium: code-runner isolation

- **Where:** `src/ui/code/runner.ts:59`. The worker came from a same-origin `blob:`, and isolation was a delete-list of globals. Dynamic `import()` (including JSON modules with cookies) and `FontFace` were still available, which is enough for a malicious course test (future) to read `/api/export` and exfiltrate it.
- **Fix:**
  - The worker is served from `GET /runner/worker.js` with its **own** CSP: `default-src 'none'; script-src 'unsafe-eval'`. Learner code can `eval`, but the browser blocks all fetches, imports, fonts and sockets.
  - The page CSP uses `worker-src 'self'` (no `blob:`).
  - The delete-list now also covers `fetchLater`, `FontFace`, `fonts` and `cookieStore`.
- **Verified in Chromium:** `import('/api/counts')` and `import('https://example.com/x.js')` were refused by the worker policy, and `fetch`, `XMLHttpRequest`, `indexedDB` and `importScripts` are `undefined`.
- **Planned:** opaque-origin isolation for untrusted courses (Part 3 §4).

### M7 — Medium: redirect-following on model-suggested URLs

- **Where:** `src/ai/reels/generate.ts:82` — `redirect: 'follow'` after only the *first* host was checked.
- **Fix:** manual redirects (at most 3 hops), and every hop must pass the HTTPS host allow-list (`refSource`). Unit-tested with a redirect to `169.254.169.254`.

### M8 — Medium: `vault-asset` path handling

- **Where:** `src/app/api/vault-asset/route.ts:24` — a string-prefix check on `path.resolve` (no symlink resolution), no size cap, and an SVG CSP without `sandbox`.
- **Fix:**
  - `resolveInside()` (`src/lib/path-guard.ts`) rejects absolute paths, `..` and NUL, then compares `realpath`s.
  - Regular files only, capped at 15 MB.
  - Responses get `sandbox`, `nosniff` and `Content-Disposition: inline`.

### M9 — Medium: `updateVaultPath` on Vercel

- **Where:** `settings.ts:18` called `store.setConfig` directly. The boot path ignores the setting on Vercel, but the action didn't.
- **Fix:** refused when `VERCEL` is set; input capped at 1 KB.

### Low and info

- **L1** — `cronAuthorized()`: constant-time compare over SHA-256 digests. It fails closed when `CRON_SECRET` is missing or under 16 characters, and is checked in both the proxy and each cron handler.
- **L2** — Cron handlers return `{ ok:false, error:'failed' }`. `generateReelsNow` only shows provider errors in dev. Details stay in server logs.
- **L3** — Sessions:
  - 30-day TTL with sliding renewal (re-issued when under 15 days remain).
  - Tokens dated more than one TTL ahead are rejected.
  - `POST /auth/logout` (same-origin check, `Clear-Site-Data: "cache"`), with a button in Settings.
  - "Log out everywhere" = rotate `AUTH_SECRET`.
- **L4** — Feed bodies are capped at 3 MB while streaming. Title, summary and author are capped at 300/600/120 characters before DB and prompt.
- **L5** — The system prompt now states that news text is untrusted data and that code from it must never be copied. News text is fenced in `<<< >>>`. C2 is the real control; this only lowers the odds.
- **L6** — Migration `0004` re-runs the RLS lockdown and `ALTER DEFAULT PRIVILEGES … REVOKE ALL ON TABLES/SEQUENCES/FUNCTIONS FROM anon, authenticated`.
- **L7** — See Part 3 §2: a dedicated non-owner app role.
- **I2** — Set the Supabase MCP to `read_only=true`, or point it at a branch/dev project. A prompt-injected agent with `database` access to prod is a real path to data loss.
- **I3** — Keep prod credentials out of the dev `.env.local`. Use `vercel env pull` into a separate file only when needed.
- **I4** — `finishTask({ solved: true })` is trusted. That's fine single-user; see Part 3 §4.

### Verified OK (no change needed)

- **Rendering and output encoding:** no `dangerouslySetInnerHTML` apart from the static sidebar boot script and JSON-LD data blocks (`src/ui/seo/JsonLd.tsx`, `<` escaped). Markdown → hast runs with `allowDangerousHtml: false`, and `toJsxRuntime` never renders raw nodes. Search results and news text are rendered as React text.
- **News ingest:** `canonicalUrl` already dropped non-http(s) items.
- **AI reels:** `refUrl` is limited to an HTTPS allow-list. `sourceUrl` comes from our own data, never from the model.
- **SQL injection:** none. Drizzle builders and `sql` templates are parameterized. The only `unsafe()` is `scripts/copy-db.ts` with a hard-coded table list.
- **RLS:** enabled and `anon`/`authenticated` revoked on **all** 18 public tables.
- **Secrets:** none in git history (`.env*`, `.vercel`, `.data` ignored). No secret `NEXT_PUBLIC_*`. `vercel env add --sensitive` is used by the setup scripts.
- **CSRF:** server actions are protected by Next's Origin/Host check (no `allowedOrigins` needed on Vercel, which forwards `x-forwarded-host`). The cookie is `SameSite=Lax`, and plain route handlers check `Origin`/`Sec-Fetch-Site` (`src/lib/same-origin.ts`).
- **Platform config:** `poweredByHeader: false`. pnpm `onlyBuiltDependencies` allow-list in place; lockfile committed.

---

## 3. What changed (Part 2)

| Area | Files |
|---|---|
| Proxy, CSP | `src/proxy.ts`, `src/lib/csp.ts`, `src/app/layout.tsx` (nonce), `next.config.ts` (headers, body limit) |
| Auth | `src/lib/auth.ts`, `src/app/auth/login/route.ts`, `src/app/auth/logout/route.ts`, `src/app/login/page.tsx`, `src/app/settings/page.tsx` (logout), `src/lib/redirect.ts`, `src/lib/same-origin.ts` |
| Rate limiting | `src/lib/rate-limit.ts`, `src/server/rate-limit-store.ts`, `src/db/schema.ts` (`rate_limits`), `drizzle/0004_rate_limits.sql` (+ RLS and default-privilege lockdown) |
| Actions | `src/server/auth-guard.ts`, every file in `src/server/actions/*` |
| API routes | `api/vault-asset`, `api/tree/[guide]`, `api/cron/news`, `api/cron/reels`; new `runner/worker.js` |
| Content rendering | `src/lib/url.ts`, `src/lib/path-guard.ts`, `src/ui/markdown/render.tsx`, `src/ui/news/NewsRow.tsx`, `src/app/news/page.tsx`, `src/server/services/feed.ts`, `src/app/feed/generated/page.tsx` |
| Code execution | `src/ai/reels/code-check.ts`, `src/ai/reels/generate.ts`, `src/ui/code/runner.ts`, `src/ui/code/worker-source.ts` |
| Feeds | `src/news/http.ts`, `src/news/collect.ts` |
| Ops | `package.json` / lockfile (Next 16.3.8, override), `scripts/check-env.ts`, `scripts/copy-db.ts` (pre-existing typecheck error) |
| Tests | `tests/unit/security.test.ts`: URL, redirect and path guards; rate limiter; tokens; cron; CSP; same-origin; worker source; vm escapes; redirect SSRF |

**Deploy notes:**
1. `AUTH_SECRET` must be at least 32 characters in Vercel, or the app locks. `pnpm env:secrets` generates 44.
2. Existing sessions are invalidated once (token format and TTL changed), so log in again.
3. Migration `0004` runs in `vercel-build`. Locally run `pnpm db:migrate`, which has already been done on the local PGlite.

**How CSP was verified:**
1. **Dev server** (`next dev --port 3300`, password mode) in Chromium: logged in through the new form. Visited home, a guide chapter (20 Shiki code blocks, 20 wiki links, viz blocks), the viz gallery, tasks (ran the test suite in the worker), feed, news, settings, profile, path and roadmap. A `securitypolicyviolation` listener and the console showed no violations and no hydration warnings.
2. **Production build** (`next build && next start`): no `'unsafe-eval'`. Every Next `<script>` carries the per-request nonce. The inline sidebar boot script ran (sidebar state applied). The code runner worked. Again no violations.
3. **Worker policy:** the worker's own CSP blocked `import()` of same-origin and remote modules (console: "violates … `script-src 'unsafe-eval'`").
4. **Headers** checked with curl. Auth probes:
   - `POST /g/javascript/x.png` with `Next-Action` → 401, and any action without a session → 401.
   - `/g/x/y.png` GET → login redirect.
   - Cross-origin `/auth/login` → 403; the 11th attempt per IP → `error=rate`; `next=/\evil.com` → `/`.

---

## 4. Multi-user plan (Part 3)

This aligns with `docs/ARCHITECTURE.md`: Supabase Auth, `requireUser()`, repositories always scoped by `userId`, and RLS as the second line of defense.
What is implemented and what deviates from this plan: **§5**.

### 4.1 Authentication and sessions

- **Supabase Auth via `@supabase/ssr`.**
  - The session lives in HttpOnly, `Secure`, `SameSite=Lax` cookies, with a short-lived access JWT (≤ 1 h) and refresh-token rotation with reuse detection. Both are on by default in Supabase; keep them on.
  - On the server, authenticate with `supabase.auth.getUser()` or by verifying the JWT against the project JWKS. **Never** trust `getSession()` or a client-supplied user id.
  - `src/proxy.ts` refreshes the session and keeps doing what it does today: an exact public allow-list, 401 for any `Next-Action` without a user, and CSP.
- **Data access layer:** `src/server/auth/requireUser()` returns `{ userId, role, aal }`. Every action and route calls it first, replacing `requireSession()`, and passes `userId` explicitly to repositories. No repository function exists without a `userId` parameter, except clearly named `system*` functions used by cron.
- **Sensitive operations re-authenticate:** password, email or MFA change, account deletion, data export. Each requires a fresh login (`last_sign_in_at` < 10 min) or `aal2`.
- **Sign-out:** both "sign out" and "sign out everywhere" (`signOut({ scope: 'global' })`). A password change revokes all other sessions. A sessions list in the profile.

### 4.2 Per-user data isolation (app layer + Postgres RLS)

1. **Schema.**
   - Every progress table gets `user_id uuid not null references auth.users(id) on delete cascade`, and the PK becomes `(user_id, …)`: attempts, srs_cards, mistakes, chapter_progress, lesson_progress, task_state, xp_ledger, achievements, daily_activity, daily_missions, reel_state, sessions.
   - Today's single-user columns on shared tables must move to user tables:
     - `news_items.read_at` / `saved` → `news_reads(user_id, news_id, read_at, saved)`
     - `generated_reels.status='hidden'` → `reel_hidden(user_id, reel_id)`
     - `settings` → `user_settings(user_id, key, value)`. The `internal.*` cooldown keys move to `system_state`, which no user can write.
2. **Roles.**
   - Migrations keep using `postgres` (via `DIRECT_URL`).
   - The app connects as a dedicated login role `app_server` that is not the table owner and has no `BYPASSRLS`. It has `USAGE` on schema `public`, DML only on app tables, and `GRANT authenticated TO app_server`.
   - Cron and admin jobs use a separate `app_system` role (or the service role) with an audited connection that is never used by request handlers.
3. **Per-request RLS context.** Every user-scoped query runs inside a transaction that switches role and sets the claims. `set local` works on the 6543 transaction pooler because it is transaction-scoped:
   ```ts
   export async function withUser<T>(user: { id: string; role: string }, fn: (tx: Tx) => Promise<T>): Promise<T> {
     return getDb().transaction(async (tx) => {
       await tx.execute(sql`select set_config('request.jwt.claims', ${JSON.stringify({ sub: user.id, role: 'authenticated', app_role: user.role })}, true)`)
       await tx.execute(sql`set local role authenticated`)
       return fn(tx)
     })
   }
   ```
4. **Policies**, on every user table, with `alter table … force row level security` and an index on `user_id`:
   ```sql
   create policy own_rows on attempts for all to authenticated
     using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
   ```
   - Shared read-only tables (`news_items`, published `courses` / `course_versions`) get a `for select to authenticated using (true)` (or `status = 'published'`) policy, and writes only via `app_system`.
   - Add a CI check that fails if any public table lacks RLS or a policy, by querying `pg_tables` / `pg_policies`.
5. **App layer:** repositories always include `where user_id = $userId`, even though RLS also enforces it, so a mis-scoped query fails twice. Integration tests create two users and assert that user B can't read or write A's rows through every action.

### 4.3 Account-takeover protection

- **Email verification:** required before uploading or publishing courses and before appearing in leagues.
- **Passwords:** minimum 10–12 characters, maximum 128, no composition rules. Check against breached passwords: Supabase "leaked password protection", or the HIBP k-anonymity range API.
- **Brute-force limits:**
  - Per IP and per account on sign-in, sign-up, password reset, OTP and magic link. Supabase's built-in auth rate limits plus our `rate_limits` / Vercel WAF rules.
  - Exponential back-off per account.
  - A CAPTCHA (Turnstile / hCaptcha, supported natively by Supabase) after a few failures and on sign-up.
- **No user enumeration:** identical responses and timing for unknown versus known emails, on sign-in, reset and sign-up.
- **Notifications:** email on new-device login, password or email change, and MFA change. An email change requires confirming both the old and the new address.
- **MFA:** TOTP first, then passkeys/WebAuthn. Mandatory (`aal2`) for admins and course publishers with many learners.
- **OAuth:** Google / GitHub with PKCE. Account linking only for verified emails.

### 4.4 Roles and admin

- The role lives in `auth.users.app_metadata.role` (`admin` | `moderator`), which only the service role can set. **Never** use `user_metadata`, because users can edit it.
- `requireAdmin()` checks role **and** `aal2`. RLS policies for admin-only tables use `(auth.jwt()->'app_metadata'->>'role') = 'admin'`.
- Admin UI under `/admin`: stricter rate limits, every action written to the audit log, and no silent impersonation (if it's ever added, it's time-boxed, visible to the user and audited).

### 4.5 User-uploaded courses (`docs/COURSE_FORMAT.md` §8)

- **Upload:**
  - A signed upload URL to a **private** Supabase Storage bucket with a size limit (25 MB) and MIME allow-list.
  - Per-user quotas: for example 10 uploads a day and 500 MB stored.
  - Email-verified accounts only.
- **Unpacking** runs in an isolated worker (Vercel Sandbox / a function **without** DB or AI secrets) that streams the ZIP (yauzl-style, no full extraction to disk):
  - At most 2,000 entries, 100 MB uncompressed in total, 5 MB per file, and a 100:1 compression-ratio cap. This defeats zip bombs; nested archives are rejected.
  - Path checks on every entry: reject absolute paths, `..`, backslashes, NUL, drive letters, symlinks and other non-regular entries, duplicate names after Unicode NFC + case folding, and names longer than 255 bytes.
  - Extension allow-list (`.md .yaml .yml .json .png .jpg .jpeg .webp .gif .svg`) plus magic-byte sniffing for images.
- **Parsing:**
  - `yaml` with the default (core) schema, no custom tags, and size and depth limits. Validate `course.yaml` with zod.
  - Ids match `^[a-z0-9-]{1,64}$` and are unique per course.
  - Wiki-links may resolve only inside the package.
- **Markdown:** the existing pipeline (`allowDangerousHtml: false`, `safeLinkHref` / `safeImageSrc`, no raw HTML, no iframes) plus a per-course link policy. External links get `rel="noopener noreferrer nofollow ugc"`.
- **Assets:**
  - SVGs are sanitized (DOMPurify SVG profile) or rasterized at ingest.
  - All user assets are served from a **separate cookieless origin** (`usercontent.<domain>` or the Storage CDN) with `Content-Security-Policy: sandbox; default-src 'none'`, `nosniff` and `Content-Disposition`. Never from the app origin.
- **Test code from courses is never run on the app origin:**
  - **Server-side validation** ("reference passes, starter fails") runs in **Vercel Sandbox** (Firecracker microVM, no network, CPU, memory and time limits), never in `node:vm`.
  - **In the browser**, learner and test code run in a sandboxed iframe on an opaque origin (`<iframe sandbox="allow-scripts">` with `srcdoc`, or a separate `runner.<domain>` origin). It hosts the CSP-locked worker from M6 and talks to the page only via `postMessage`. The parent validates `event.source === iframe.contentWindow` plus a per-run token, and the iframe is removed to kill a run. The worker's CSP stays `default-src 'none'; script-src 'unsafe-eval'`.
- **Moderation:**
  - `draft → review → published`. Automated checks: validation, link reputation, image scanning, size and ratio limits.
  - Manual review for public listing; a report button; takedown and unpublish.
  - Published versions are immutable and content-hashed. A new version never runs code that skipped review.
- **Grading integrity (I4):** client-reported results are fine for personal progress. For leagues and leaderboards, cap XP per day, detect anomalies (impossible durations), and for ranked tasks re-verify server-side in Vercel Sandbox.

### 4.6 Rate limits (initial values)

| Surface | Limit |
|---|---|
| Sign-in | 10 / 15 min per IP; 5 / 15 min per account (+ back-off) |
| Sign-up | 5 / hour per IP, plus CAPTCHA |
| Password reset / OTP | 3 / hour per account; 10 / hour per IP |
| Server actions (writes) | 120 / min per user |
| AI generation (`generateReelsNow` etc.) | per user per day, plus the global budget kill-switch |
| Course upload | 10 / day per user |
| Data export | 3 / day per user |

The Postgres `rate_limits` table (already in place) is enough to start. Move hot paths to Vercel WAF rate-limit rules or Upstash Redis if write volume grows.

### 4.7 Audit log

- **Table:** `audit_log(id bigserial, at timestamptz default now(), actor_user_id uuid, actor_ip_hash text, action text, target_type text, target_id text, metadata jsonb)`.
- **Append-only:** inserts go through a `security definer` function, and `update`/`delete` are revoked from every app role.
- **Events:**
  - Auth: sign-in success and failure, password, email and MFA changes, role changes.
  - Course: upload, publish, unpublish, takedown.
  - Admin actions, data export, account deletion.
- **Retention:** 12 months. IPs are stored as salted hashes.

### 4.8 GDPR basics

- **Export:** `/api/export` becomes per-user (all user tables plus profile, scoped by `userId`). It requires re-auth and is rate-limited, and the export itself is audit-logged.
- **Delete account:**
  - Delete the `auth.users` row. `on delete cascade` removes all progress.
  - Authored courses are unpublished or transferred, with the author anonymized.
  - Storage objects are deleted. Logs keep only hashed identifiers.
  - Document backup retention (PITR window) in the privacy policy.
- **Minimization:**
  - IPs live only in rate-limit keys (short windows) and hashed in the audit log.
  - No personal data in LLM prompts (today: chapter text and titles only).
  - EU region (Supabase `eu-west-1`).
- **Disclosure:** a privacy policy and DPAs for the processors (Supabase, Vercel, AI Gateway / model provider). Only strictly necessary cookies, so no consent banner is needed.

### 4.9 Operational hygiene

- Separate Supabase projects or branches for preview and production. Vercel Deployment Protection on previews. Never use prod credentials in `.env.local`.
- Rotate `AUTH_SECRET`, `CRON_SECRET` and DB passwords on any suspicion, and document the rotation.
- **CI:** `pnpm audit --prod` (fail on high), the RLS-coverage check, the `tests/unit/security.test.ts` suite, and the cross-user isolation tests.
- **CSP:** add `report-to` with a lightweight collector once there are real users. Consider Trusted Types once Next supports it end-to-end.

---

## 5. Phase 2 implementation status (2026-10-16)

Legend: ✅ done · ⚠️ done differently (reason) · ⏳ not yet.

### Authentication (§4.1)

| Item | Status | Where |
|---|---|---|
| Supabase Auth via `@supabase/ssr`, HttpOnly cookies, PKCE | ✅ | `src/server/supabase.ts`, `src/proxy.ts` |
| Server identity from `getClaims()` (JWKS / Auth server), never `getSession()` or client ids | ✅ | `src/server/auth/session.ts`, `src/lib/supabase/claims.ts` |
| Proxy refreshes the session; exact public allow-list; 401 for any `Next-Action` / API call without a user; CSP kept | ✅ | `src/proxy.ts`, `src/lib/auth-paths.ts` (unit-tested) |
| `requireUser()` in every action/page/service; `apiUser()` for JSON routes | ✅ | `src/server/auth/index.ts`; `requireSession()` and `APP_PASSWORD` / `AUTH_SECRET` removed |
| Auth forms are plain POSTs to route handlers (no server action reachable without a session), Origin-checked, rate-limited | ✅ | `src/app/(auth)/auth/*` — sign-in 10/15 min per IP + 5/15 min per account (hashed email) + global; sign-up 5/h per IP; reset 3/h per account; OAuth start 20/15 min per IP; password change 5/h per user |
| No user enumeration (sign-up / reset answer the same; failed sign-in delay) | ✅ | `src/server/auth/http.ts` |
| Passwords 10–128, no composition rules | ✅ | app + Supabase setting (docs/AUTH.md §4) |
| Re-auth for account deletion (last authentication < 15 min, from JWT `amr`) | ✅ | `src/app/(auth)/auth/delete-account/route.ts` |
| Re-auth for data export | ⚠️ | rate-limited (3/day per user) instead; re-auth adds friction for a read of your own data — revisit with MFA |
| Sign out / sign out everywhere (`scope: 'global'`) | ✅ | `/auth/sign-out`, `/account` |
| OAuth Google / GitHub (PKCE), buttons only for providers enabled in Supabase | ✅ | `/auth/oauth` (GET link: CSP `form-action` would block a POST's cross-origin redirect chain), `/auth/callback` |
| Email confirmation via `token_hash` (`/auth/confirm`) and code exchange (`/auth/callback`) | ✅ | docs/AUTH.md §5 for templates |
| Sessions list, MFA, new-device emails, CAPTCHA | ⏳ | |
| Per-user rate limit on server-action writes (120/min, §4.6) | ⏳ | auth endpoints, export and AI generation are limited; generic action writes aren't yet |

### Data isolation (§4.2)

| Item | Status | Where |
|---|---|---|
| `user_id uuid not null` + composite PK `(user_id, …)` on all 14 per-user tables; indexes lead with `user_id` | ✅ | `src/db/schema.ts`, `drizzle/0005_multi_user.sql` |
| FK target | ⚠️ | `user_id → profiles(id) ON DELETE CASCADE` (not `auth.users` directly: PGlite has no `auth` schema, and the legacy placeholder owner isn't an auth user). On Supabase a trigger `on_auth_user_deleted` deletes the profile → cascade. |
| `news_items.read_at/saved` → `news_reads`; `settings` → `user_settings` + `system_state` | ✅ | migration 0005 moves existing values |
| Per-user AI-reel hiding | ⚠️ | `reel_state.hidden` instead of a separate `reel_hidden` table (same key, one table fewer). An admin's hide also sets `generated_reels.status = 'hidden'` (global takedown). |
| `withUser()`: transaction + `set_config('role','authenticated')` + `request.jwt.claims` on Supabase; plain run on PGlite (auto-detected) | ✅ | `src/server/db/scope-core.ts` (re-entrant, unit-tested with a fake DB), `src/server/db/with-user.ts` |
| RLS policies `user_id = (select auth.uid())` on every per-user table; profiles: own row read/update with **column grants** (role is not updatable); shared tables read-only | ✅ | migration 0005 (guarded: skipped without the `auth` schema). Verified on PGlite with a Supabase-like `auth` schema + roles: cross-user read/insert/update/delete denied, role escalation denied, anon denied |
| `force row level security` | ⚠️ | not forced: system jobs (cron, units sync, profile creation, admin claim) run as the table owner on purpose |
| App layer always filters by `user_id` | ✅ | every service/action; static check `tests/unit/user-scope.test.ts` fails on any per-user query without `userId` (or an explicit `// cross-user:` justification) |
| Dedicated non-owner `app_server` / `app_system` roles | ⏳ | the app still connects as `postgres`; RLS applies because each user transaction switches role |
| CI check that every public table has RLS + a policy | ⏳ | (lockdown loop in 0005 enables RLS everywhere) |
| Cross-user integration tests through every action | ⏳ | covered by the static check + RLS simulation; a DB-backed suite is next |
| Supabase Data API | ⚠️ | not used; recommended to disable it (docs/AUTH.md §8) because `authenticated` now has DML grants on own rows |

### Roles, admin, GDPR (§4.4, §4.8)

| Item | Status | Where |
|---|---|---|
| Admins from `ADMIN_EMAILS`, only on a **verified** email; legacy single-user progress claimed on first admin sign-in | ✅ | `src/server/auth/profile.ts`, `src/server/auth/claim.ts` |
| Role storage | ⚠️ | `profiles.role` (server-written only; column grants keep it read-only for users) instead of `app_metadata.role` — no service-role key in the app. `requireAdmin()` guards `/feed/generated`, `generateReelsNow`, `updateVaultPath`. `aal2` for admins ⏳ |
| Per-user export | ✅ | `/api/export` (profile + all per-user tables, 3/day) |
| Delete account | ⚠️ | app data deleted + global sign-out + request recorded in `system_state` (`deletion:<id>`); deleting the `auth.users` row needs the secret key → owner does it in the dashboard (docs/AUTH.md §10) |
| Audit log (§4.7) | ⏳ | sign-ins, exports and deletions are logged to server logs only |

### Dev-only bypass

`DEV_AUTH_BYPASS=1` signs every request in as the legacy owner **only** when `NODE_ENV=development` (never in `next build`/`start`),
not on Vercel, and with no Supabase keys configured (`src/lib/supabase/config.ts`, unit-tested).


### Course platform (Phase 3)

| Item | Status | Where |
|---|---|---|
| `enrollments`, `topic_results`, `exam_results`: `user_id` FK → profiles, RLS `own_rows` (guarded like 0005), one active enrollment per user (partial unique index) | ✅ | `drizzle/0006_courses.sql`; verified on PGlite with a Supabase-like `auth` schema: cross-user read/update/insert denied |
| Topic tests / section exams / placement graded on the server from raw answers (never the client's right/wrong flag); attempt must be the started one, graded once, answers must cover the server's own draw in order | ✅ | `src/server/actions/tests.ts`, `src/server/courses/tests-core.ts`, `placement-core.ts` |
| zod on every course action; per-user rate limits (library 30/min, tests 30/min, placement 120/min) | ✅ | `src/server/actions/courses.ts`, `src/server/courses/limits.ts` |
| Answer key not sent to the client during a test | ✅ (Phase 4) | quiz items carry no `correct` flags / free answers / piece order / blank answers; each answer goes to `answerQuiz`, which grades it and stores the **first** answer per question on the result row (`answers` jsonb); `submitTest` grades quizzes from those stored answers only |
| Bundles from disk are schema-validated; a broken file is skipped, never trusted | ✅ | `src/server/courses/bundles.ts` |

### Game layer (Phase 4) — anti-cheat

Leagues turn XP into something other people see, so every number that feeds them must come from the server.

| Item | Status | Where |
|---|---|---|
| Server-side answer checking: graded contexts (lessons, topic tests, exams, placement, feed, `/quiz`, `/mistakes`) get a redacted view — no `correct` flags, no free answer, order pieces shuffled per render with positional ids (answers are the pieces' **code**, authoring ids `p0…` are rejected), fill blanks without answers (width rounded), shuffled word bank, no explanation; the key + explanation come back from `answerQuiz` only after the answer | ✅ | `src/content/blocks/quiz/view.ts`, `src/ui/study/render-items.tsx`, `src/server/actions/answers.ts`; tests `tests/unit/answer-check.test.ts` (payload has no key, parity of the practice grader, static check that no action accepts a client `correct` flag) |
| `recordQuizAnswer({ correct })` (client-trusted verdict) removed; attempts, XP, SRS, mistakes and hearts are recorded from the server's verdict in one transaction | ✅ | `answerQuiz` → `recordAttempt` |
| Article quizzes keep the key (practice, instant feedback) but XP is still granted only by the server's own re-check of the raw answer | ✅ ⚠️ | `src/ui/markdown/UnitBlock.tsx`. Consequence: an answer can be *learned* from an article — that is studying, not cheating; it can't be replayed into XP faster than the per-source daily caps |
| Lessons: `completeLesson` ignores client counts; accuracy = first recorded answer per exercise of the session, the session must cover every exercise stored at `startLesson`, can complete once; bonus XP and 💎 only then | ✅ | `src/server/actions/lessons.ts` |
| ❤️ charged server-side in the answer's transaction; `startLesson` / `answerQuiz` refuse graded lesson play at 0 hearts; `startTest` needs ≥ 1 heart | ✅ | `src/server/actions/{answers,lessons,tests}.ts`, `src/game/hearts.ts` |
| XP pipeline: every grant goes through `grantXp` (⚡ multiplier, per-source **daily cap**) — the ledger never holds more than the cap per source and day | ✅ | `src/server/game/ledger.ts`, `src/game/xp.ts` |
| League score = weekly XP from server-graded sources only (`quiz`, `lesson`, `topic-test`, `section-exam`, `mission`, `achievement`); self-rated flashcards and client-reported tasks don't count | ✅ ⚠️ | `LEAGUE_XP_REASONS`. Tasks still trust the browser's test run (sandboxed runner) — they earn personal XP but not league XP until tests run server-side |
| 💎 ledger append-only: `authenticated` has SELECT/INSERT only (no UPDATE/DELETE); `(user_id, reason, ref_id)` unique → each award (first exam pass, streak milestone, achievement, league week, rank step) lands once | ✅ | `drizzle/0007_game.sql` |
| Bucks ledger (`buck_ledger`) — same rules as gems (RLS `own_rows`, SELECT/INSERT only, unique ref per award: lesson session, first topic-test pass, mission day, practice session) plus a per-source daily cap applied on the server | ✅ | `drizzle/0009_rpg.sql`, `src/server/game/ledger.ts` |
| Purchases: one transaction under a `SELECT … FOR UPDATE` lock on `user_state`, balance from the ledger of the item's currency (bucks / gems), rank gate for epic / legendary gear from `user_state.evo_step`, price/limits from `src/game/shop.ts` only, zod + 30/min per user; equipping re-checks ownership, slot and rank | ✅ | `src/server/actions/shop.ts` |
| Leaderboards / cohorts run as the server outside any user transaction; only display name, avatar and weekly XP leave it (no email, no user id); `league_cohorts` has no grants for `authenticated` | ✅ | `src/server/game/leagues.ts`; verified on PGlite with a Supabase-like `auth` schema: cross-user read/insert/update denied on the new tables, ledger UPDATE/DELETE denied, cohorts denied |
| Rate limit on `answerQuiz` 120/min per user | ✅ | `src/server/courses/limits.ts` |
| Cron `/api/cron/leagues` behind `CRON_SECRET` (proxy + route) | ✅ | `src/app/api/cron/leagues/route.ts`, `vercel.json` |
| Users with direct DML grants (Data API) could still insert their own positive `gem_ledger` / `xp_ledger` rows | ⏳ | same as Phase 2: keep the Supabase Data API disabled (docs/AUTH.md §8); next step — SECURITY DEFINER functions for ledger writes and dropping INSERT grants |
| Loo's character / battle snapshot: `characterSnapshot(userId)` reads that learner's rows in their own `withUser` scope, server-side only (no action exposes another user's sheet); the snapshot holds form, attribute levels, skill names/power — no raw answers, no ids beyond course/topic ids | ✅ | `src/server/game/character.ts`, docs/BATTLES.md |

### Language courses (docs/LANGUAGE_COURSE.md, docs/SPEECH.md)

| Control | Status | Where |
|---|---|---|
| `[!listen]` / `[!pair]` / dictation graded on the server only; graded payloads (and even article items) carry no right option, no dictation text and no transcript; the explanation comes with the verdict | ✅ | `src/content/blocks/lang/grade.ts`, `src/content/blocks/quiz/{grade,view}.ts`, `src/ui/markdown/UnitBlock.tsx`; `tests/unit/language.test.ts` («ships no answer key…») |
| Spoken text for browser TTS delivered only on ▶ via `speechLines({unitId})` (requireUser, zod, 240/min) — never in HTML / RSC payload. Residual: whoever presses ▶ can read it in devtools (inherent to client-side TTS; `gateway` audio in v2) | ✅ / ⏳ | `src/server/actions/speech.ts` |
| `[!speak]`: no audio uploaded or stored; the client sends ≤ 5 transcripts ≤ 500 chars (zod + slicing), compared with the content's own `text`; XP only on a server pass; misses cost nothing; rate limits `speak` 20/min + `speakDay` 400/day on top of `answer` 120/min; never part of tests / exams / placement. Residual: a transcript can be forged (XP bounded by the per-source daily cap) | ✅ / ⏳ | `src/server/actions/answers.ts → speakOutcome`, `src/server/courses/limits.ts` |
| `Permissions-Policy: microphone=(self)` (was `()`); camera etc. still denied | ✅ | `next.config.ts` |
| Enrollment level validated against the course's own ladder (noob…god or A1…C2); `startAtLevel` re-derives the start section on the server | ✅ | `src/server/actions/courses.ts` |
