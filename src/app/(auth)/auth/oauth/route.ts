import type { Provider } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { backTo, limited, nextPath, seeOther, siteOrigin } from '@/server/auth/http'
import { authorizeUrl, encodeFlow, GOOGLE_CALLBACK, GOOGLE_COOKIE, googleClient, newFlow } from '@/server/auth/google'
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
  const gate = await limited(request, 'oauth', PER_IP)
  if (gate !== 'ok') return backTo('/login', { error: gate, next })
  // Google on our own domain when the client secret is configured (src/server/auth/google.ts).
  const google = provider === 'google' ? googleClient() : null
  if (google) {
    const flow = newFlow(next)
    const response = seeOther(authorizeUrl(flow, google.id, siteOrigin(request)))
    response.cookies.set(GOOGLE_COOKIE, encodeFlow(flow), { httpOnly: true, secure: true, sameSite: 'lax', path: GOOGLE_CALLBACK, maxAge: 600 })
    return response
  }
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
