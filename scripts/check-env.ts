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
const app = env.APP_PASSWORD ?? ''
if (!app) bad('APP_PASSWORD: порожньо')
else if (app.length < 8) console.log(`⚠️  APP_PASSWORD: ${app.length} символів — краще ≥ 8`)
else ok(`APP_PASSWORD: ${app.length} символів`)
for (const k of ['AUTH_SECRET', 'CRON_SECRET']) (env[k]?.length ?? 0) >= 24 ? ok(`${k}: є`) : bad(`${k}: запусти pnpm env:secrets`)
console.log(failed ? '\nЩе не все — виправ ❌ і запусти pnpm env:check знову' : '\n🚀 Усе готово — запускай pnpm setup:prod')
process.exit(failed ? 1 : 0)
