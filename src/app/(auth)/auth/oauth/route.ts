import type { Provider } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { backTo, limited, nextPath, seeOther, siteOrigin } from '@/server/auth/http'
import { enabledProviders } from '@/server/auth/providers'
import { createSupabaseServerClient } from '@/server/supabase'

export const dynamic = 'force-dynamic'

const PROVIDERS = new Set<Provider>(['google', 'github'])
const PER_IP = { limit: 20, windowMs: 15 * 60_000 }

// Starts OAuth (PKCE): stores the code verifier cookie and sends the browser to the provider via Supabase.
// A plain link (GET), not a form: CSP form-action would block the cross-origin redirect chain after a POST.
export async function GET(request: NextRequest): Promise<Response> {
  const params = request.nextUrl.searchParams
  const provider = params.get('provider') as Provider | null
  const next = nextPath(params.get('next'))
  if (!provider || !PROVIDERS.has(provider) || !(await enabledProviders()).includes(provider as 'google' | 'github')) return backTo('/login', { error: 'provider', next })
  if (await limited(request, 'oauth', PER_IP)) return backTo('/login', { error: 'rate', next })
  const supabase = await createSupabaseServerClient()
  if (!supabase) return backTo('/login', { error: 'setup' })
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${siteOrigin(request)}/auth/callback?next=${encodeURIComponent(next)}`, skipBrowserRedirect: true },
  })
  if (error || !data.url) {
    console.warn('[auth] oauth start failed', { provider, code: error?.code })
    return backTo('/login', { error: 'provider', next })
  }
  return seeOther(data.url)
}
