# Вхід і акаунти — що налаштувати власнику

Levelup використовує **Supabase Auth** (`@supabase/ssr`): email + пароль з підтвердженням пошти, скидання пароля,
Google і GitHub. Дані застосунку йдуть напряму в Postgres (Drizzle), Supabase Data API застосунку не потрібен.
Проєкт: `acowzhsfvcdlswjuptxu` → https://supabase.com/dashboard/project/acowzhsfvcdlswjuptxu

Нижче `<APP>` — продакшн-домен на Vercel (наприклад `levelup.vercel.app`).

## 1. Ключі → `.env.local` і Vercel

1. **Project Settings → API Keys** → скопіюй **Publishable key** (`sb_publishable_…`). Секретний ключ (`sb_secret_…`) **не потрібен і не має
   потрапляти** в `.env.local`/Vercel — застосунок навмисно працює без нього.
2. **Project Settings → Data API** → Project URL (`https://acowzhsfvcdlswjuptxu.supabase.co`).
3. У `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://acowzhsfvcdlswjuptxu.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…
   ADMIN_EMAILS=yaroslavtsarenkodev@gmail.com
   SITE_URL=https://<APP>          # лише для продакшну (Vercel), локально не задавай
   ```
4. `pnpm env:check` → `pnpm setup:prod` (запише змінні у Vercel, прибере старі `APP_PASSWORD`/`AUTH_SECRET`, застосує міграції, задеплоїть).

## 2. JWT signing keys (рекомендовано)

**Project Settings → JWT Keys** → якщо проєкт ще на «Legacy JWT secret», натисни **Migrate to JWT signing keys** (ECC P-256) і
**Rotate**. Тоді `getClaims()` перевіряє токен локально за JWKS, без мережевого запиту до Auth на кожен рендер.

## 3. Authentication → URL Configuration

- **Site URL:** `https://<APP>`
- **Redirect URLs** (кожен рядок окремо):
  ```
  https://<APP>/**
  http://localhost:3000/**
  http://127.0.0.1:3000/**
  ```
  За потреби прев'ю-деплоїв: `https://*-<vercel-team>.vercel.app/**`.
  Застосунок передає `redirectTo` = `<origin>/auth/callback?next=…`; Supabase приймає лише адреси з цього списку.

## 4. Authentication → Sign In / Providers → Email

- **Enable Email provider:** on · **Confirm email:** on · **Secure email change:** on
- **Minimum password length:** 10 (застосунок теж вимагає 10–128)
- **Leaked password protection:** on (якщо доступно на плані)
- **Anonymous sign-ins:** off
- Продакшн: **Authentication → Emails → SMTP Settings** — підключи свій SMTP (Resend, Postmark…). Вбудована пошта Supabase лише для тестів і
  має жорсткий ліміт листів на годину.

## 5. Authentication → Emails → Templates (рекомендовано)

Стандартні шаблони працюють (посилання → Supabase → `/auth/callback?code=…`), але лише в тому ж браузері, де почали реєстрацію (PKCE).
Щоб посилання з листа відкривалося будь-де (телефон, інший браузер), заміни посилання в шаблонах на `token_hash`:

- **Confirm signup:**
  ```html
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Підтвердити пошту</a>
  ```
- **Reset password:**
  ```html
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">Встановити новий пароль</a>
  ```
- **Change email address:** `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email_change`

`{{ .SiteURL }}` веде на продакшн; для локальної перевірки листів тимчасово залиш стандартні шаблони.

## 6. Google

1. https://console.cloud.google.com → створи/вибери проєкт.
2. **APIs & Services → OAuth consent screen:** External, назва «Levelup», support email, scopes `openid`, `email`, `profile`. Опублікуй
   (Publishing status → In production), інакше вхід доступний лише тестовим користувачам.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID → Web application:**
   - Authorized JavaScript origins: `https://<APP>`, `http://localhost:3000`
   - Authorized redirect URIs: `https://acowzhsfvcdlswjuptxu.supabase.co/auth/v1/callback`
4. Supabase → **Authentication → Sign In / Providers → Google:** Enable, встав **Client ID** і **Client Secret**, Save.

## 7. GitHub

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App:**
   - Application name: Levelup · Homepage URL: `https://<APP>`
   - Authorization callback URL: `https://acowzhsfvcdlswjuptxu.supabase.co/auth/v1/callback`
2. **Generate a new client secret.**
3. Supabase → **Authentication → Sign In / Providers → GitHub:** Enable, встав Client ID і Client Secret, Save.

Кнопки Google/GitHub на `/login` і `/signup` з'являються самі, щойно провайдер увімкнено (застосунок читає `/auth/v1/settings`, кеш 5 хв).

## 8. Data API — вимкнути (рекомендовано)

Застосунок не користується PostgREST. **Project Settings → Data API:** вимкни Data API (або прибери `public` з *Exposed schemas*).
Таблиці прогресу мають гранти для ролі `authenticated` (на неї застосунок перемикається в кожній транзакції, щоб працював RLS), тож з
увімкненим Data API користувач зі своїм JWT міг би напряму читати/писати **свої** рядки (RLS не пустить до чужих) — наприклад, накрутити XP.

## 9. Перевірка

1. `pnpm db:migrate` (або деплой — `vercel-build` запускає міграції). На Supabase міграція `0005` створює RLS-політики й тригер на
   `auth.users`. Перевірка в SQL Editor:
   ```sql
   select tablename, policyname from pg_policies where schemaname = 'public' order by 1;  -- own_rows на 14 таблицях прогресу
   select tgname from pg_trigger where tgname = 'on_auth_user_deleted';
   ```
2. Зареєструйся/увійди адмін-email'ом (`ADMIN_EMAILS`, пошта має бути підтверджена). Перший вхід: роль `admin` і весь старий прогрес
   (до акаунтів) переходить на цей акаунт. На `/account` з'явиться бейдж «Адміністратор».
3. Зареєструй другий акаунт — у нього нульовий XP і серія, онбординг.

## 10. Видалення акаунтів (GDPR)

«Видалити акаунт» на `/account` (потрібен вхід не пізніше 15 хв тому) видаляє профіль і **весь** прогрес та виходить з усіх пристроїв.
Сам запис у `auth.users` без секретного ключа видалити не можна — це робить власник:

```sql
select key, value from system_state where key like 'deletion:%';   -- запити на видалення
```

→ **Authentication → Users →** користувач → **Delete user** (тригер `on_auth_user_deleted` прибере залишки, якщо вони є). Тримай у
політиці конфіденційності строк: «протягом 30 днів».

## 11. Локальна розробка

- `pnpm dev` (127.0.0.1:3000) з ключами з п.1 працює з тим самим Supabase-проєктом: локальні реєстрації — **реальні користувачі
  продакшн-проєкту**. Для експериментів краще окремий проєкт або Supabase Branch.
- Без ключів `/login` показує інструкцію. Для UI-роботи без Supabase: `DEV_AUTH_BYPASS=1 pnpm dev` — вхід як «legacy»-власник (лише
  `next dev`, лише без ключів; у білдах і на Vercel вимкнено).
- PGlite (`pnpm db:local`) не має схеми `auth`: RLS-частина міграції пропускається, ізоляцію забезпечує код (`where user_id = …`,
  статична перевірка в `tests/unit/user-scope.test.ts`).
