import '@/app/admin.css'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getProfile, getUser } from '@/server/auth'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { Button } from '@/ui/design/Button'

export const metadata: Metadata = { title: 'Акаунт заблоковано', robots: { index: false, follow: false } }

// Where requireUser() sends a banned account (docs/ADMIN.md). Only the reason and a way out.
export default async function BannedPage() {
  const user = await getUser()
  if (!user) redirect('/login')
  const profile = await getProfile()
  if (!profile?.bannedAt) redirect('/')
  return (
    <main className="banned-page">
      <LooSays mood="sad" size={96}>
        <strong>Акаунт заблоковано.</strong> {profile.banReason ? `Причина: ${profile.banReason}` : 'Якщо це помилка — напиши нам.'}
      </LooSays>
      <form action="/auth/sign-out" method="post">
        <Button type="submit" variant="ghost">
          Вийти з акаунта
        </Button>
      </form>
    </main>
  )
}
