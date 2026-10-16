import Link from 'next/link'
import { levelBadge } from '@/game/evolution'
import { messages, t } from '@/i18n'
import { Logo } from '@/ui/design/brand/Logo'
import { Button } from '@/ui/design/Button'
import { Card } from '@/ui/design/Card'
import { Pill } from '@/ui/design/Badge'
import { Loo } from '@/ui/design/mascot/Loo'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { Icon } from '@/ui/icons'

// Signed-out home: what Levelup is, how it works, the courses, sign-up CTAs. Server component, no client JS.
export function Landing({ notice }: { notice?: 'deleted' }) {
  const m = messages().landing
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link href="/" aria-label="Levelup">
          <Logo size={36} />
        </Link>
        <nav className="landing-nav-links" aria-label="Акаунт">
          <Button href="/login" variant="ghost" size="sm">
            {t('landing.nav.login')}
          </Button>
          <Button href="/signup" size="sm">
            {t('landing.nav.signup')}
          </Button>
        </nav>
      </header>

      <main>
        {notice === 'deleted' ? (
          <p className="landing-notice" role="status">
            {t('account.deleted')}
          </p>
        ) : null}
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="landing-hero-text">
            <Pill tone="green" solid>
              {t('landing.hero.eyebrow')}
            </Pill>
            <h1 id="landing-title" className="landing-title">
              {t('landing.hero.title')}
            </h1>
            <p className="landing-lead">{t('landing.hero.lead')}</p>
            <div className="landing-cta">
              <Button href="/signup" size="lg">
                {t('landing.hero.cta')}
              </Button>
              <Button href="/login" variant="secondary" size="lg">
                {t('landing.hero.login')}
              </Button>
            </div>
          </div>
          <div className="landing-hero-art">
            <LooSays mood="cheer" size={180} side="top" text={t('landing.hero.loo')} />
          </div>
        </section>

        <ul className="landing-stats" aria-label="Коротко">
          {m.stats.map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>

        <section className="landing-section" aria-labelledby="landing-how">
          <h2 id="landing-how" className="landing-h2">
            {t('landing.how.title')}
          </h2>
          <ol className="landing-steps">
            {m.how.steps.map((step, i) => (
              <li key={step.title}>
                <Card variant="raised" padding="lg" className="landing-step" tone={(['green', 'blue', 'pink', 'yellow', 'orange'] as const)[i % 5]}>
                  <span className="landing-step-emoji" aria-hidden="true">
                    {step.emoji}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section className="landing-section" aria-labelledby="landing-courses">
          <h2 id="landing-courses" className="landing-h2">
            {t('landing.courses.title')}
          </h2>
          <p className="landing-sub">{t('landing.courses.lead')}</p>
          <Card variant="raised" padding="lg" tone="yellow" className="landing-featured">
            <span className="landing-featured-icon" aria-hidden="true">
              <Icon name="si:SiJavascript" size={56} />
            </span>
            <div>
              <Pill tone="green">{t('landing.courses.featured.badge')}</Pill>
              <h3>{t('landing.courses.featured.title')}</h3>
              <p>{t('landing.courses.featured.body')}</p>
              <ol className="landing-levels" aria-label="Рівні">
                {(['noob', 'junior', 'middle', 'senior', 'god'] as const).map((l) => (
                  <li key={l}>{levelBadge(l)}</li>
                ))}
              </ol>
            </div>
            <Button href="/signup" className="landing-featured-cta">
              {t('landing.hero.cta')}
            </Button>
          </Card>
          <ul className="landing-soon">
            {m.courses.items.map((c) => (
              <li key={c.title}>
                <Card padding="md" className="landing-soon-card">
                  <span aria-hidden="true">{c.emoji}</span>
                  <span>{c.title}</span>
                  <Pill tone="gray" size="sm">
                    {t('landing.courses.soon')}
                  </Pill>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section className="landing-final" aria-labelledby="landing-final">
          <Loo mood="fire" size={120} decorative />
          <h2 id="landing-final" className="landing-h2">
            {t('landing.final.title')}
          </h2>
          <p className="landing-sub">{t('landing.final.body')}</p>
          <Button href="/signup" size="lg">
            {t('landing.final.cta')}
          </Button>
        </section>
      </main>

      <footer className="landing-footer">{t('landing.footer')}</footer>
    </div>
  )
}
