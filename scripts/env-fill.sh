#!/usr/bin/env bash
# Asks for the DB password and the app password (hidden input) and writes them into .env.local.
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
echo "📱 Пароль для входу в застосунок з телефона (мінімум 8 символів)."
read -rsp "   APP_PASSWORD: " APP; echo
read -rsp "   ще раз:       " APP2; echo
[[ -n "$APP" && "$APP" == "$APP2" ]] || { echo "❌ Паролі порожні або не збігаються"; exit 1; }
setval PROD_DB_PASSWORD "$DB"
setval APP_PASSWORD "$APP"
echo "✓ Записано в .env.local. Перевіряю…"
echo
pnpm -s env:check
