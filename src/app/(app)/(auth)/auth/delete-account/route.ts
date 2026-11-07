import type { NextRequest } from 'next/server'
import { isSameOrigin } from '@/lib/same-origin'
import { getUser } from '@/server/auth'
import { backTo, field, readForm } from '@/server/auth/http'
import { deleteUserData } from '@/server/services/account'
import { createSupabaseServerClient } from '@/server/supabase'

export const dynamic = 'force-dynamic'

const REAUTH_MS = 15 * 60_000
const CONFIRM_WORD = 'ВИДАЛИТИ'

// "Delete my account" (GDPR): deletes the profile and every per-user row, signs out everywhere. A plain form post so
// the browser does a full navigation into the signed-out app. Requires a recent sign-in (docs/SECURITY.md §4.1).
export async function POST(request: NextRequest): Promise<Response> {
  if (!isSameOrigin(request.headers)) return new Response('Forbidden', { status: 403 })
  const user = await getUser()
  if (!user) return backTo('/login', {})
  const form = await readForm(request)
  if (!form || field(form, 'confirm', 40).trim() !== CONFIRM_WORD) return backTo('/account', { delete: 'confirm' })
  if (!user.dev && Date.now() - user.authTime > REAUTH_MS) return backTo('/account', { delete: 'reauth' })
  await deleteUserData(user.id)
  console.info('[account] deletion requested; app data removed', { userId: user.id })
  const supabase = await createSupabaseServerClient()
  if (supabase) await supabase.auth.signOut({ scope: 'global' })
  return new Response(null, { status: 303, headers: { Location: '/?deleted=1', 'Cache-Control': 'no-store', 'Clear-Site-Data': '"cache", "storage"' } })
}
