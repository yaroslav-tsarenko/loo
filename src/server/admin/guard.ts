import 'server-only'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ADMIN_COOKIE, adminSecret, verifyAdminToken } from '@/lib/admin-token'
import { isAdmin } from '../auth'

// Who may open /admin: the owner's admin login (signed cookie) or a learner account with the admin role
// (ADMIN_EMAILS). Anyone else gets a 404 — the area's existence isn't advertised.
export async function adminVia(): Promise<'login' | 'role' | null> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  if (await verifyAdminToken(adminSecret(), token, Date.now())) return 'login'
  return (await isAdmin()) ? 'role' : null
}

export async function requireAdminArea(): Promise<'login' | 'role'> {
  const via = await adminVia()
  if (!via) notFound()
  return via
}
