#!/usr/bin/env bash
# Fills empty AUTH_SECRET / CRON_SECRET in .env.local with fresh random values (existing ones are kept).
set -euo pipefail
cd "$(dirname "$0")/.."
fill() {
  if grep -qE "^$1=.+" .env.local; then echo "  • $1 вже задано — не чіпаю"; return; fi
  local value; value="$2"
  if grep -qE "^$1=" .env.local; then
    python3 - "$1" "$value" <<'PY'
import sys
key, value = sys.argv[1], sys.argv[2]
lines = open('.env.local', encoding='utf-8').read().splitlines()
open('.env.local', 'w', encoding='utf-8').write('\n'.join(f'{key}={value}' if l == f'{key}=' else l for l in lines) + '\n')
PY
  else
    printf '%s=%s\n' "$1" "$value" >> .env.local
  fi
  echo "  ✓ $1 згенеровано"
}
fill AUTH_SECRET "$(openssl rand -base64 32 | tr -d '\n')"
fill CRON_SECRET "$(openssl rand -hex 24)"
