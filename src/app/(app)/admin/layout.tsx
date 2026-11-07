import '@/app/admin.css'
import '@/app/admin-analytics.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { requireAdminArea } from '@/server/admin/guard'
import { AdminNav } from '@/ui/admin/AdminNav'

export const metadata: Metadata = { title: { default: 'Адмінка', template: '%s · Адмінка' }, robots: { index: false, follow: false } }

// The admin area's shell (docs/ADMIN.md): sidebar with the sections, the sign-in kind and sign-out. Every page and
// action still checks access on its own (a layout doesn't guard server actions or re-render on navigation).
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const via = await requireAdminArea()
  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <p className="adm-brand">
          Loo <span>admin</span>
        </p>
        <AdminNav />
        <div className="adm-side-foot">
          <small>{via === 'login' ? 'Вхід: адмін-логін' : 'Вхід: акаунт з роллю admin'}</small>
          {via === 'login' ? (
            <form action="/admin/sign-out" method="post">
              <button type="submit" className="adm-chip">
                Вийти
              </button>
            </form>
          ) : null}
        </div>
      </aside>
      <div className="adm-main">{children}</div>
    </div>
  )
}
