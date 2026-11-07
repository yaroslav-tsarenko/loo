import '@/app/landing.css'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Logo } from '@/ui/design/brand/Logo'
import { ThemeSwitch } from '@/ui/marketing/ThemeSwitch'

// Public legal pages (/privacy, /terms): the auth-page canvas with a wide readable column.
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="auth-page">
      <header className="auth-top">
        <Link href="/" aria-label="Loo — на головну">
          <Logo size={34} />
        </Link>
        <ThemeSwitch />
      </header>
      <article className="legal-body lu-card" data-variant="raised" data-pad="lg">
        <h1 className="legal-title">{title}</h1>
        <p className="legal-updated">Редакція від {updated}</p>
        {children}
        <p className="legal-nav">
          <Link href="/privacy">Політика конфіденційності</Link> · <Link href="/terms">Умови використання</Link> · <a href="mailto:support@playloo.app">support@playloo.app</a>
        </p>
      </article>
    </main>
  )
}
