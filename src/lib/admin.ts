// ADMIN_EMAILS=a@x.com,b@y.com — accounts that get role 'admin' (and claim legacy progress) on first verified sign-in.

export function adminEmails(raw: string | undefined = process.env.ADMIN_EMAILS): Set<string> {
  return new Set(
    (raw ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes('@')),
  )
}

export function isAdminEmail(email: string | null | undefined, raw?: string): boolean {
  if (!email) return false
  return adminEmails(raw).has(email.trim().toLowerCase())
}
