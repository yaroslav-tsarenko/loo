import type { NextRequest } from 'next/server'
import { isSameOrigin } from '@/lib/same-origin'
import { backTo, field, limited, nextPath, normalizeEmail, passwordProblem, readForm, siteOrigin } from '@/server/auth/http'
import { createSupabaseServerClient } from '@/server/supabase'

export const dynamic = 'force-dynamic'

const PER_IP = { limit: 5, windowMs: 60 * 60_000 }
const GLOBAL = { limit: 100, windowMs: 60 * 60_000 }

// Email + password sign-up. Supabase sends the confirmation email; the link lands on /auth/confirm (token_hash
// template) or /auth/callback (default template, PKCE code). The response is the same whether or not the address
// already has an account (no user enumeration).
export async function POST(request: NextRequest): Promise<Response> {
  if (!isSameOrigin(request.headers)) return new Response('Forbidden', { status: 403 })
  const form = await readForm(request)
  if (!form) return backTo('/signup', { error: 'invalid' })
  const email = normalizeEmail(field(form, 'email', 320))
  const password = field(form, 'password')
  const name = field(form, 'name', 80).trim()
  if (!email) return backTo('/signup', { error: 'email' })
  if (passwordProblem(password)) return backTo('/signup', { error: 'weak' })
  if (password !== field(form, 'confirm')) return backTo('/signup', { error: 'mismatch' })
  if (await limited(request, 'signup', PER_IP, [{ key: 'signup:global', rule: GLOBAL }])) return backTo('/signup', { error: 'rate' })

  const supabase = await createSupabaseServerClient()
  if (!supabase) return backTo('/signup', { error: 'setup' })
  const next = nextPath(field(form, 'next', 2048))
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteOrigin(request)}/auth/callback?next=${encodeURIComponent(next)}`,
      // user_metadata is user-editable: display only, never used for authorization.
      data: name ? { display_name: name } : undefined,
    },
  })
  if (error) {
    console.warn('[auth] sign-up failed', { code: error.code })
    if (error.code === 'weak_password') return backTo('/signup', { error: 'weak' })
    if (error.code === 'over_email_send_rate_limit' || error.status === 429) return backTo('/signup', { error: 'rate' })
    // Anything else (including "already registered", if the project discloses it) gets the neutral answer.
  }
  return backTo('/signup', { sent: '1' })
}
