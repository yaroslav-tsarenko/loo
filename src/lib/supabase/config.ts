// Supabase project settings from env. Pure (no Next imports): used by proxy.ts, server code, scripts and tests.

export interface SupabaseConfig {
  url: string
  publishableKey: string
}

type Env = Record<string, string | undefined>

// Placeholder owner of the single-user era's progress (drizzle/0005_multi_user.sql). Claimed by the first admin sign-in.
export const LEGACY_USER_ID = '00000000-0000-0000-0000-000000000000'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID.test(value)
}

function validUrl(raw: string | undefined): string | null {
  if (!raw) return null
  try {
    const url = new URL(raw.trim())
    // https only, except a local Supabase stack (supabase start) on loopback.
    const local = url.protocol === 'http:' && (url.hostname === '127.0.0.1' || url.hostname === 'localhost')
    if (url.protocol !== 'https:' && !local) return null
    return url.origin
  } catch {
    return null
  }
}

// null → Supabase Auth isn't configured: the app shows a setup message instead of sign-in.
export function supabaseConfig(env: Env = process.env): SupabaseConfig | null {
  const url = validUrl(env.NEXT_PUBLIC_SUPABASE_URL)
  const publishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
  if (!url || !publishableKey) return null
  return { url, publishableKey }
}

// Local-only escape hatch for UI work without a Supabase project: `next dev` + DEV_AUTH_BYPASS=1 + no Supabase keys
// signs every request in as the legacy owner. Never active in builds (NODE_ENV=production) or on Vercel.
export function devAuthBypass(env: Env = process.env): boolean {
  return env.NODE_ENV === 'development' && !env.VERCEL && env.DEV_AUTH_BYPASS === '1' && supabaseConfig(env) === null
}
