#!/usr/bin/env bash
# One-time production setup: Vercel env vars → Supabase migrations → copy local progress → deploy.
# Secrets are typed here (password input is hidden) and go straight to Vercel; nothing is printed or committed.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "🚀 Interviewer: налаштування продакшну"
echo
echo "1/5 Supabase → Connect (https://supabase.com/dashboard/project/acowzhsfvcdlswjuptxu?showConnect=true)"
echo "    Підстав пароль БД замість [YOUR-PASSWORD]. Спецсимволи в паролі мають бути URL-закодовані (@ → %40 тощо)."
read -rp "    DATABASE_URL (Transaction pooler, порт 6543): " DATABASE_URL
read -rp "    DIRECT_URL   (Session pooler, порт 5432):     " DIRECT_URL
[[ "$DATABASE_URL" == postgres* && "$DIRECT_URL" == postgres* ]] || { echo "❌ Рядки мають починатися з postgres:// або postgresql://"; exit 1; }
echo
echo "2/5 Пароль для входу в застосунок (запамʼятай — він знадобиться на телефоні)"
read -rsp "    APP_PASSWORD: " APP_PASSWORD; echo
read -rsp "    ще раз:       " APP_PASSWORD2; echo
[[ -n "$APP_PASSWORD" && "$APP_PASSWORD" == "$APP_PASSWORD2" ]] || { echo "❌ Паролі порожні або не збігаються"; exit 1; }
AUTH_SECRET="$(openssl rand -base64 32)"
CRON_SECRET="$(openssl rand -hex 24)"

echo
echo "3/5 Записую змінні у Vercel (production)…"
add() {
  vercel env rm "$1" production --yes >/dev/null 2>&1 || true
  printf '%s' "$2" | vercel env add "$1" production --sensitive >/dev/null
  echo "    ✓ $1"
}
add DATABASE_URL "$DATABASE_URL"
add DIRECT_URL "$DIRECT_URL"
add APP_PASSWORD "$APP_PASSWORD"
add AUTH_SECRET "$AUTH_SECRET"
add CRON_SECRET "$CRON_SECRET"

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
  grep -vE '^(DATABASE_URL|DIRECT_URL|DATABASE_POOL_MAX)=' .env.local > .env.local.tmp || true
  printf 'DATABASE_URL=%s\nDIRECT_URL=%s\n' "$DATABASE_URL" "$DIRECT_URL" >> .env.local.tmp
  mv .env.local.tmp .env.local
  echo "    ✓ .env.local оновлено (перезапусти pnpm dev)"
fi

echo
echo "5/5 Деплой у продакшн…"
pnpm content:sync >/dev/null
vercel --prod
echo
echo "✅ Готово. Відкрий URL вище на iPhone → Поділитися → «На початковий екран»."
