#!/usr/bin/env bash
# One-time production setup: Vercel env vars → Supabase migrations → copy local progress → deploy.
# Values come from .env.local (or are asked for) and go straight to Vercel; nothing is printed or committed.
# Supabase Auth dashboard settings (URL configuration, email templates, Google/GitHub) are manual: docs/AUTH.md.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "🚀 Levelup: налаштування продакшну"

# Values already filled in .env.local are used as is; missing ones are asked for below.
envval() { grep -E "^$1=" .env.local 2>/dev/null | tail -1 | cut -d= -f2- | sed -E "s/^[\"']//; s/[\"']$//"; }
DATABASE_URL="$(envval PROD_DATABASE_URL)"
DIRECT_URL="$(envval PROD_DIRECT_URL)"
SUPABASE_URL="$(envval NEXT_PUBLIC_SUPABASE_URL)"
SUPABASE_KEY="$(envval NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)"
ADMIN_EMAILS="$(envval ADMIN_EMAILS)"
SITE_URL="$(envval SITE_URL)"
CRON_SECRET="$(envval CRON_SECRET)"
DB_PASSWORD="$(envval PROD_DB_PASSWORD)"
if [[ -n "$DB_PASSWORD" ]]; then
  ENC="$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' "$DB_PASSWORD")"
  DATABASE_URL="${DATABASE_URL//\[YOUR-PASSWORD\]/$ENC}"
  DIRECT_URL="${DIRECT_URL//\[YOUR-PASSWORD\]/$ENC}"
fi
if [[ "$DATABASE_URL$DIRECT_URL" == *"[YOUR-PASSWORD]"* ]]; then echo "❌ Впиши PROD_DB_PASSWORD у .env.local"; exit 1; fi
echo
echo "1/5 Supabase → Connect (https://supabase.com/dashboard/project/acowzhsfvcdlswjuptxu?showConnect=true)"
echo "    Підстав пароль БД замість [YOUR-PASSWORD]. Спецсимволи в паролі мають бути URL-закодовані (@ → %40 тощо)."
[[ -n "$DATABASE_URL" ]] && echo "    DATABASE_URL — з .env.local" || read -rp "    DATABASE_URL (Transaction pooler, порт 6543): " DATABASE_URL
[[ -n "$DIRECT_URL" ]] && echo "    DIRECT_URL   — з .env.local" || read -rp "    DIRECT_URL   (Session pooler, порт 5432):     " DIRECT_URL
[[ "$DATABASE_URL" == postgres* && "$DIRECT_URL" == postgres* ]] || { echo "❌ Рядки мають починатися з postgres:// або postgresql://"; exit 1; }
echo
echo "2/5 Supabase Auth (Project Settings → API / API Keys)"
[[ -n "$SUPABASE_URL" ]] && echo "    NEXT_PUBLIC_SUPABASE_URL — з .env.local" || read -rp "    NEXT_PUBLIC_SUPABASE_URL (https://<ref>.supabase.co): " SUPABASE_URL
[[ -n "$SUPABASE_KEY" ]] && echo "    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — з .env.local" || read -rp "    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (sb_publishable_…): " SUPABASE_KEY
[[ "$SUPABASE_KEY" != sb_secret_* ]] || { echo "❌ Це секретний ключ — потрібен publishable"; exit 1; }
[[ -n "$ADMIN_EMAILS" ]] && echo "    ADMIN_EMAILS — з .env.local" || read -rp "    ADMIN_EMAILS (email адміністратора): " ADMIN_EMAILS
[[ -n "$SITE_URL" ]] && echo "    SITE_URL — з .env.local" || read -rp "    SITE_URL (https://<домен на Vercel>, Enter — пропустити): " SITE_URL
[[ -n "$CRON_SECRET" ]] || CRON_SECRET="$(openssl rand -hex 24)"

echo
echo "3/5 Записую змінні у Vercel (production)…"
add() {
  vercel env rm "$1" production --yes >/dev/null 2>&1 || true
  printf '%s' "$2" | vercel env add "$1" production --sensitive >/dev/null
  echo "    ✓ $1"
}
add DATABASE_URL "$DATABASE_URL"
add DIRECT_URL "$DIRECT_URL"
add CRON_SECRET "$CRON_SECRET"
# Public by design (the browser may see them); not --sensitive so they show in the dashboard.
addpublic() {
  vercel env rm "$1" production --yes >/dev/null 2>&1 || true
  printf '%s' "$2" | vercel env add "$1" production >/dev/null
  echo "    ✓ $1"
}
addpublic NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL"
addpublic NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY "$SUPABASE_KEY"
addpublic ADMIN_EMAILS "$ADMIN_EMAILS"
[[ -n "$SITE_URL" ]] && addpublic SITE_URL "$SITE_URL"
# The single-user password login is gone.
for old in APP_PASSWORD AUTH_SECRET; do vercel env rm "$old" production --yes >/dev/null 2>&1 && echo "    ✗ $old видалено" || true; done

echo
echo "4/5 Міграції Supabase і перенесення прогресу…"
DIRECT_URL="$DIRECT_URL" pnpm exec tsx scripts/migrate.ts
if lsof -iTCP:54329 -sTCP:LISTEN >/dev/null 2>&1; then
  SOURCE_URL="postgres://postgres@127.0.0.1:54329/postgres" DIRECT_URL="$DIRECT_URL" pnpm exec tsx scripts/copy-db.ts || echo "    ⚠️  Прогрес не скопійовано (див. повідомлення вище)"
else
  echo "    ⚠️  Локальна база (pnpm db:local) не запущена — прогрес не переношу. Запусти її і повтори: pnpm db:copy"
fi

read -rp "    Перемкнути й локальну розробку на Supabase (спільний прогрес Mac + телефон)? [Y/n] " LOCAL
if [[ "${LOCAL:-Y}" =~ ^[Yy]?$ ]]; then
  grep -vE '^(DATABASE_URL|DIRECT_URL|DATABASE_POOL_MAX)=' .env.local | grep -v 'Офлайн-база' > .env.local.tmp || true
  printf 'DATABASE_URL=%s\nDIRECT_URL=%s\n' "$DATABASE_URL" "$DIRECT_URL" >> .env.local.tmp
  mv .env.local.tmp .env.local
  echo "    ✓ .env.local оновлено (перезапусти pnpm dev)"
fi

echo
echo "5/5 Деплой"
echo "    Змінні й база готові. Деплой іде з GitHub: кожен push у main → продакшн на Vercel."
read -rp "    Задеплоїти поточну папку прямо зараз через Vercel CLI (включно з незакоміченими змінами)? [y/N] " DEPLOY
if [[ "${DEPLOY:-N}" =~ ^[Yy]$ ]]; then
  pnpm content:sync >/dev/null
  pnpm course:build >/dev/null
  vercel --prod
else
  echo "    Пропущено. Для деплою: git push (або vercel --prod)."
fi
echo
echo "✅ Готово. Далі: Supabase → Authentication → URL Configuration / Email Templates / Providers (docs/AUTH.md),"
echo "   потім увійди адмін-email'ом — твій старий прогрес перейде на акаунт автоматично."
