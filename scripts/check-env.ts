import { readFileSync } from 'node:fs'
import postgres from 'postgres'

// Validates the production section of .env.local and test-connects to Supabase. Never prints secret values.
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]
    }),
)
let failed = false
const ok = (m: string) => console.log(`✅ ${m}`)
const bad = (m: string) => ((failed = true), console.log(`❌ ${m}`))

const password = env.PROD_DB_PASSWORD ?? ''
const withPassword = (url: string) => (password ? url.replaceAll('[YOUR-PASSWORD]', encodeURIComponent(password)) : url)

async function checkUrl(name: string, port: number) {
  const url = withPassword(env[name] ?? '')
  if (!url) return bad(`${name}: порожньо`)
  if (url.includes('[YOUR-PASSWORD]')) return bad(`${name}: впиши PROD_DB_PASSWORD`)
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return bad(`${name}: не схоже на URL`)
  }
  if (!/^postgres(ql)?:$/.test(u.protocol)) return bad(`${name}: має бути postgresql://…, а не ${u.protocol}//…`)
  if (u.port !== String(port)) return bad(`${name}: порт ${u.port || '—'}, очікую ${port}`)
  const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 10, onnotice: () => {} })
  try {
    const [row] = await sql`select current_user as u`
    ok(`${name}: підключення працює (користувач ${row!.u}, порт ${port})`)
  } catch (e) {
    const err = e as { code?: string; message: string }
    bad(`${name}: ${err.code === '28P01' || /password/i.test(err.message) ? 'невірний пароль БД' : `${err.code ?? ''} ${err.message}`}`)
  } finally {
    await sql.end({ timeout: 2 })
  }
}

await checkUrl('PROD_DATABASE_URL', 6543)
await checkUrl('PROD_DIRECT_URL', 5432)
// Supabase Auth (public values: the publishable key is safe in the browser; RLS + server checks protect data).
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL ?? ''
if (!supabaseUrl) bad('NEXT_PUBLIC_SUPABASE_URL: порожньо (Supabase → Project Settings → API)')
else if (!/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/.test(supabaseUrl)) console.log(`⚠️  NEXT_PUBLIC_SUPABASE_URL: очікую https://<ref>.supabase.co`)
else ok('NEXT_PUBLIC_SUPABASE_URL: є')
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
if (!key) bad('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: порожньо (Supabase → Project Settings → API Keys → Publishable key)')
else if (key.startsWith('sb_secret_')) bad('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: це СЕКРЕТНИЙ ключ! Потрібен publishable (sb_publishable_…)')
else ok(`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: є (${key.startsWith('sb_publishable_') ? 'publishable' : 'legacy anon'})`)
const admins = (env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter((e) => e.includes('@'))
if (admins.length === 0) bad('ADMIN_EMAILS: порожньо (email адміністратора, через кому)')
else ok(`ADMIN_EMAILS: ${admins.length}`)
if ((env.CRON_SECRET?.length ?? 0) >= 24) ok('CRON_SECRET: є')
else bad('CRON_SECRET: коротший за 24 символи — запусти pnpm env:secrets')
if (env.SITE_URL && !/^https:\/\//.test(env.SITE_URL)) console.log('⚠️  SITE_URL: має бути https://… (адреса продакшну для листів і OAuth)')
for (const legacy of ['APP_PASSWORD', 'AUTH_SECRET']) {
  if (env[legacy]) console.log(`ℹ️  ${legacy}: більше не потрібен (вхід тепер через Supabase Auth) — можна видалити з .env.local`)
}
console.log(failed ? '\nЩе не все — виправ ❌ і запусти pnpm env:check знову' : '\n🚀 Усе готово — запускай pnpm setup:prod')
process.exit(failed ? 1 : 0)
