import 'server-only'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ADMIN_COOKIE, adminSecret, adminTokenEpoch } from '@/lib/admin-token'
import { isAdmin } from '../auth'
import { adminEpoch } from './session'

// Who may open /admin: the owner's admin login (signed cookie) or a learner account with the admin role
// (ADMIN_EMAILS). Anyone else gets a 404 — the area's existence isn't advertised.
export async function adminVia(): Promise<'login' | 'role' | null> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  const epoch = await adminTokenEpoch(adminSecret(), token, Date.now())
  // signed in the current admin-session generation (a sign-out bumps it — src/server/admin/session.ts)
  if (epoch !== null && epoch === (await adminEpoch())) return 'login'
  return (await isAdmin()) ? 'role' : null
}

export async function requireAdminArea(): Promise<'login' | 'role'> {
  const started = Date.now()
  const via = await adminVia()
  console.log(`[admin] access ${via ?? 'denied'} ${Date.now() - started}ms`)
  if (!via) notFound()
  return via
}
