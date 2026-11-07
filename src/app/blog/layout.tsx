import '@/app/landing.css'
import '@/app/blog.css'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Logo } from '@/ui/design/brand/Logo'
import { Button } from '@/ui/design/Button'
import { PixelIcon } from '@/ui/design/PixelIcon'
import { PublicThemeBoot } from '@/ui/marketing/PublicThemeBoot'
import { ThemeSwitch } from '@/ui/marketing/ThemeSwitch'
import { ClientEnhancer } from '@/ui/shell/ClientEnhancer'

// Public blog chrome: the landing's neutral canvas and nav (landing.css), no app shell. Outside the (app) group, so
// the blog is prerendered (static HTML, CDN-cached) — no session or headers() anywhere in its tree.
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="landing blog">
      <PublicThemeBoot />
      <header className="landing-nav">
        <div className="blog-brand">
          <Link href="/" aria-label="Loo — на головну">
            <Logo size={36} />
          </Link>
          <Link href="/blog" className="blog-brand-link">
            Блог
          </Link>
        </div>
        <nav className="landing-nav-links" aria-label="Акаунт">
          <ThemeSwitch />
          <Button href="/signup" size="sm">
            Почати безкоштовно
          </Button>
        </nav>
      </header>
      {children}
      <footer className="landing-footer">
        Loo — навчання як гра <PixelIcon name="flagUa" size={16} className="landing-footer-flag" />
        <br />
        <Link href="/">Головна</Link> · <Link href="/blog">Блог</Link> · <Link href="/privacy">Конфіденційність</Link> · <Link href="/terms">Умови</Link> ·{' '}
        <a href="mailto:hello@playloo.app">hello@playloo.app</a>
      </footer>
      <ClientEnhancer />
    </div>
  )
}
