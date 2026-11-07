import { randomBytes, scrypt } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { base32Encode, otpauthUri } from '../src/lib/totp'

// The owner's admin login for /admin (docs/ANALYTICS.md «Адмінка»).
// Usage: pnpm admin:credentials [--email admin@playloo.app] [--totp] [--vercel]
//   --totp also creates ADMIN_TOTP_SECRET: the admin login then asks for a 6-digit code from an authenticator app
//   after the password; the otpauth:// link to add to the app is printed once (it contains the secret).
//   Generates a strong password, its scrypt hash and a session secret and writes them to .env.local
//   (ADMIN_LOGIN_EMAIL, ADMIN_LOGIN_PASSWORD — for you to read, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET).
//   --vercel also stores ADMIN_LOGIN_EMAIL, ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET in the Vercel project's
//   Production environment (the plain password never leaves this machine). Secrets are never printed.

const args = process.argv.slice(2)
const flag = (name: string) => args.includes(`--${name}`)
const opt = (name: string, fallback: string) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1]! : fallback
}

const email = opt('email', 'admin@playloo.app').trim().toLowerCase()
const password = randomBytes(18).toString('base64url')
const salt = randomBytes(16)
const N = 16384
const r = 8
const p = 1
const hash = await new Promise<Buffer>((resolve, reject) => scrypt(password, salt, 32, { N, r, p }, (err, key) => (err ? reject(err) : resolve(key))))
const values: Record<string, string> = {
  ADMIN_LOGIN_EMAIL: email,
  ADMIN_LOGIN_PASSWORD: password,
  ADMIN_PASSWORD_HASH: `scrypt:${N}:${r}:${p}:${salt.toString('base64')}:${hash.toString('base64')}`,
  ADMIN_SESSION_SECRET: randomBytes(32).toString('base64url'),
  ...(flag('totp') ? { ADMIN_TOTP_SECRET: base32Encode(randomBytes(20)) } : {}),
}

const file = '.env.local'
const lines = existsSync(file) ? readFileSync(file, 'utf8').split('\n') : []
const kept = lines.filter((l) => !Object.keys(values).some((k) => l.startsWith(`${k}=`)) && !l.startsWith('# Admin login for /admin'))
while (kept.length > 0 && kept.at(-1) === '') kept.pop()
kept.push('', '# Admin login for /admin (pnpm admin:credentials): sign in on /login with this email and password', ...Object.entries(values).map(([k, v]) => `${k}=${v}`), '')
writeFileSync(file, kept.join('\n'), { mode: 0o600 })
console.log(`✅ ${file}: ADMIN_LOGIN_EMAIL=${email}; пароль — ADMIN_LOGIN_PASSWORD у ${file} (не виводиться)`)
if (values.ADMIN_TOTP_SECRET) {
  console.log('🔐 Другий фактор: додай у застосунок-автентифікатор (1Password, Google Authenticator…) це посилання —')
  console.log(`   ${otpauthUri(values.ADMIN_TOTP_SECRET, email)}`)
  console.log('   воно містить секрет: не зберігай і не пересилай його.')
}

if (flag('vercel')) {
  for (const key of ['ADMIN_LOGIN_EMAIL', 'ADMIN_PASSWORD_HASH', 'ADMIN_SESSION_SECRET', ...(values.ADMIN_TOTP_SECRET ? ['ADMIN_TOTP_SECRET'] : [])]) {
    spawnSync('vercel', ['env', 'rm', key, 'production', '--yes'], { stdio: 'ignore' })
    const res = spawnSync('vercel', ['env', 'add', key, 'production'], { input: values[key], stdio: ['pipe', 'ignore', 'pipe'] })
    if (res.status !== 0) {
      console.error(`⛔ Vercel: ${key} не збережено — ${res.stderr?.toString().trim().split('\n').at(-1) ?? 'помилка'}`)
      process.exit(1)
    }
    console.log(`✅ Vercel Production: ${key}`)
  }
  console.log('ℹ️  Нові змінні діють після наступного деплою.')
}
