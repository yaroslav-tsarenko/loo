import Link from 'next/link'
import type { ReactNode } from 'react'
import { t, type MessageKey } from '@/i18n'
import { Logo } from '@/ui/design/brand/Logo'
import { LooSays } from '@/ui/design/mascot/LooSays'
import type { LooMood } from '@/ui/design/mascot/Loo'

// Full-screen card used by /login, /signup, /forgot-password, /reset-password.
export function AuthShell({ mood = 'wave', loo, title, lead, children, footer }: { mood?: LooMood; loo: string; title: string; lead?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <main className="auth-page">
      <header className="auth-top">
        <Link href="/" aria-label="Levelup — на головну">
          <Logo size={34} />
        </Link>
      </header>
      <div className="auth-body">
        <LooSays mood={mood} size={88} text={loo} className="auth-loo" />
        <section className="auth-card lu-card" data-variant="raised" data-pad="lg" aria-labelledby="auth-title">
          <h1 id="auth-title" className="auth-title">
            {title}
          </h1>
          {lead ? <p className="auth-lead">{lead}</p> : null}
          {children}
        </section>
        {footer ? <p className="auth-foot">{footer}</p> : null}
      </div>
    </main>
  )
}

const ERROR_KEYS = new Set(['invalid', 'unconfirmed', 'rate', 'setup', 'callback', 'expired', 'weak', 'mismatch', 'email', 'provider', 'same'])

export function FormError({ code }: { code: string | undefined }) {
  if (!code || !ERROR_KEYS.has(code)) return null
  return (
    <p className="auth-error" role="alert">
      {t(`auth.errors.${code}` as MessageKey)}
    </p>
  )
}

export function SetupNotice() {
  return (
    <div className="auth-setup" role="alert">
      <strong>{t('auth.setupTitle')}</strong>
      <p>{t('auth.setupBody')}</p>
    </div>
  )
}

export function Field({ label, hint, ...input }: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = input.id ?? input.name
  return (
    <label className="auth-field" htmlFor={id}>
      <span className="auth-label">{label}</span>
      <input className="auth-input" id={id} {...input} />
      {hint ? <span className="auth-hint">{hint}</span> : null}
    </label>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  )
}

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
      <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  )
}

// OAuth buttons are links (GET /auth/oauth): see the route for why they aren't form posts.
export function OAuthButtons({ next, providers }: { next?: string; providers: readonly string[] }) {
  if (providers.length === 0) return null
  const href = (provider: string) => `/auth/oauth?provider=${provider}${next && next !== '/' ? `&next=${encodeURIComponent(next)}` : ''}`
  const button = (provider: string, label: string, mark: ReactNode) => (
    <a key={provider} className="lu-btn auth-oauth-btn" data-variant="secondary" data-size="md" data-block="" href={href(provider)}>
      <span className="lu-btn-content">
        <span className="lu-btn-icon">{mark}</span>
        <span className="lu-btn-label">{label}</span>
      </span>
    </a>
  )
  return (
    <div className="auth-oauth">
      {providers.includes('google') ? button('google', t('auth.google'), <GoogleMark />) : null}
      {providers.includes('github') ? button('github', t('auth.github'), <GithubMark />) : null}
      <div className="auth-or" role="separator">
        <span>{t('common.or')}</span>
      </div>
    </div>
  )
}

export function param(params: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const v = params[key]
  return typeof v === 'string' ? v : undefined
}
