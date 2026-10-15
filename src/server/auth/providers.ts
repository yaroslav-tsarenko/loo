import 'server-only'
import { supabaseConfig } from '@/lib/supabase/config'

export type OAuthProvider = 'google' | 'github'
const ALL: readonly OAuthProvider[] = ['google', 'github']
const TTL_MS = 5 * 60_000

let cache: { at: number; providers: OAuthProvider[] } | null = null

// OAuth providers switched on in the Supabase dashboard (public /auth/v1/settings), cached for 5 minutes.
// Unknown (network error) → offer both; the callback reports a provider error if one isn't enabled.
export async function enabledProviders(): Promise<OAuthProvider[]> {
  const config = supabaseConfig()
  if (!config) return []
  if (cache && Date.now() - cache.at < TTL_MS) return cache.providers
  try {
    const res = await fetch(`${config.url}/auth/v1/settings`, { headers: { apikey: config.publishableKey }, signal: AbortSignal.timeout(2500), cache: 'no-store' })
    if (!res.ok) return [...ALL]
    const body = (await res.json()) as { external?: Record<string, boolean> }
    const providers = ALL.filter((p) => body.external?.[p] === true)
    cache = { at: Date.now(), providers }
    return providers
  } catch {
    return [...ALL]
  }
}
