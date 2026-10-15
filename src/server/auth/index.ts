import 'server-only'
import { notFound, redirect } from 'next/navigation'
import type { Conn } from '@/db/client'
import { withUser, type ScopeOptions } from '../db/with-user'
import { isAdmin } from './profile'
import { getUser, type AuthUser } from './session'

export { ensureProfile, getProfile, isAdmin, type Profile } from './profile'
export { getUser, type AuthUser } from './session'

// The signed-in user, or a redirect to sign-in. proxy.ts already answers 401 to unauthenticated API calls and server
// actions; this is the second check every page, action and service performs (defense in depth).
export async function requireUser(): Promise<AuthUser> {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

// For route handlers that answer JSON: the user or null (respond 401 yourself).
export async function apiUser(): Promise<AuthUser | null> {
  return getUser()
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireUser()
  if (!(await isAdmin())) notFound()
  return user
}

// Runs fn with the current user's id inside their database scope (RLS on Supabase). Services use this so pages
// and components never pass user ids around.
export async function userScope<T>(fn: (conn: Conn, userId: string) => Promise<T>, opts?: ScopeOptions): Promise<T> {
  const user = await requireUser()
  return withUser({ id: user.id }, (conn) => fn(conn, user.id), opts)
}
