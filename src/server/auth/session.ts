import 'server-only'
import { cache } from 'react'
import { userFromClaims, type AuthUser } from '@/lib/supabase/claims'
import { devAuthBypass, LEGACY_USER_ID } from '@/lib/supabase/config'
import { createSupabaseServerClient } from '../supabase'

export { userFromAuthUser, userFromClaims, type AuthUser } from '@/lib/supabase/claims'

const DEV_USER: AuthUser = { id: LEGACY_USER_ID, email: 'dev@localhost', name: 'Dev', avatarUrl: null, aal: 'aal1', authTime: Date.now(), dev: true }

// The signed-in user for this request, or null. Verified via getClaims() (JWT signature check against the project's
// JWKS, or the Auth server for symmetric keys) — never via getSession(). Deduplicated per request.
export const getUser = cache(async (): Promise<AuthUser | null> => {
  if (devAuthBypass()) return DEV_USER
  const supabase = await createSupabaseServerClient()
  if (!supabase) return null
  try {
    const { data, error } = await supabase.auth.getClaims()
    if (error || !data?.claims) return null
    return userFromClaims(data.claims)
  } catch (error) {
    console.error('[auth] getClaims failed', error)
    return null
  }
})
