import type { NextRequest } from 'next/server'
import { isSameOrigin } from '@/lib/same-origin'
import { readForm, field } from '@/server/auth/http'
import { createSupabaseServerClient } from '@/server/supabase'

export const dynamic = 'force-dynamic'

// Sign out of this device (scope=local) or of every device (scope=global: revokes all refresh tokens).
export async function POST(request: NextRequest): Promise<Response> {
  if (!isSameOrigin(request.headers)) return new Response('Forbidden', { status: 403 })
  const form = await readForm(request)
  const scope = form && field(form, 'scope') === 'global' ? 'global' : 'local'
  const supabase = await createSupabaseServerClient()
  if (supabase) {
    const { error } = await supabase.auth.signOut({ scope })
    if (error) console.warn('[auth] sign-out failed', { code: error.code })
  }
  // relogin=1: "sign in again" before a sensitive action (account deletion) — back to the account page afterwards.
  const location = form && field(form, 'relogin') === '1' ? '/login?next=%2Faccount' : '/'
  return new Response(null, { status: 303, headers: { Location: location, 'Cache-Control': 'no-store', 'Clear-Site-Data': '"cache"' } })
}
