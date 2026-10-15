#!/usr/bin/env bash
# Asks for the Supabase DB password (hidden input) and writes it into .env.local. Sign-in is Supabase Auth now:
# paste NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY / ADMIN_EMAILS into .env.local yourself.
set -euo pipefail
cd "$(dirname "$0")/.."
setval() {
  python3 - "$1" "$2" <<'PY'
import sys
key, value = sys.argv[1], sys.argv[2]
lines = open('.env.local', encoding='utf-8').read().splitlines()
found = False
for i, l in enumerate(lines):
    if l.startswith(key + '='):
        lines[i] = f'{key}={value}'
        found = True
if not found:
    lines.append(f'{key}={value}')
open('.env.local', 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
PY
}
echo "🔐 Пароль БАЗИ Supabase (Project Settings → Database). Вставляй як є — кодувати не треба."
read -rsp "   PROD_DB_PASSWORD: " DB; echo
[[ -n "$DB" ]] || { echo "❌ Порожньо"; exit 1; }
setval PROD_DB_PASSWORD "$DB"
echo "✓ Записано в .env.local. Перевіряю…"
echo
pnpm -s env:check
