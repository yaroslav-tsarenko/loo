import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { levelLabel } from '@/game/evolution'
import { messages, t } from '@/i18n'
import { Logo } from '@/ui/design/brand/Logo'
import { Button } from '@/ui/design/Button'
import { Card } from '@/ui/design/Card'
import { Pill } from '@/ui/design/Badge'
import { Loo } from '@/ui/design/mascot/Loo'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { PixelIcon, type PixelIconName } from '@/ui/design/PixelIcon'
import { Icon } from '@/ui/icons'
import { HowItWorks, type HowStep } from './HowItWorks'
import { ThemeSwitch } from './ThemeSwitch'

const STAT_ICONS: readonly PixelIconName[] = ['clock', 'star', 'cards']
const STEP_ICONS: readonly PixelIconName[] = ['map', 'target', 'phone', 'trophy', 'bulb']

/** A scene prop that drifts with scroll: `depth` px of travel per viewport (negative = against the scroll). */
function Layer({ depth, x, y, children, className }: { depth: number; x: string; y: string; children: ReactNode; className?: string }) {
  return (
    <span className={className ? `scene-layer ${className}` : 'scene-layer'} style={{ '--depth': depth, left: x, top: y } as CSSProperties}>
      {children}
    </span>
  )
}

function Chip({ icon, children }: { icon: PixelIconName; children: ReactNode }) {
  return (
    <span className="scene-chip">
      <PixelIcon name={icon} size={20} />
      {children}
    </span>
  )
}

// One scene per «how it works» step: Loo acts the step out, props float at different depths.
const SCENES: readonly ReactNode[] = [
  // Path: a zig-zag of lesson nodes, Loo next to the current one
  <div key="path" className="scene scene-path">
    {(['done', 'done', 'current', 'locked'] as const).map((s, i) => (
      <Layer key={i} depth={10 + i * 5} x={['14%', '30%', '18%', '36%'][i]!} y={['70%', '50%', '30%', '9%'][i]!}>
        <span className="scene-node" data-s={s}>
          <PixelIcon name={s === 'done' ? 'check' : s === 'current' ? 'star' : 'lock'} size={26} />
        </span>
      </Layer>
    ))}
    <Layer depth={-22} x="46%" y="22%">
      <Loo mood="happy" size={140} decorative />
    </Layer>
    <Layer depth={36} x="78%" y="12%">
      <PixelIcon name="map" size={48} />
    </Layer>
    <Layer depth={-30} x="82%" y="70%">
      <PixelIcon name="flag" size={40} />
    </Layer>
  </div>,
  // Lessons: a «what will it print» card, the right answer lights up
  <div key="lesson" className="scene scene-lesson">
    <Layer depth={10} x="7%" y="14%" className="scene-quiz">
      <span className="scene-quiz-q">Що виведе код?</span>
      <code className="scene-quiz-code">typeof null</code>
      <span className="scene-opt">&quot;null&quot;</span>
      <span className="scene-opt" data-ok="">
        &quot;object&quot; <PixelIcon name="check" size={18} />
      </span>
      <span className="scene-opt">&quot;undefined&quot;</span>
    </Layer>
    <Layer depth={-24} x="56%" y="44%">
      <Loo mood="thinking" size={132} decorative />
    </Layer>
    <Layer depth={34} x="82%" y="28%">
      <PixelIcon name="target" size={40} />
    </Layer>
    <Layer depth={-32} x="60%" y="6%">
      <Chip icon="bolt">+15 XP</Chip>
    </Layer>
  </div>,
  // Feed: a phone with cards scrolling by
  <div key="feed" className="scene scene-feed">
    <Layer depth={10} x="12%" y="7%" className="scene-phone">
      <span className="scene-phone-screen">
        <span className="scene-reels">
          {(['bulb', 'code', 'heart', 'cards', 'bulb', 'code'] as const).map((icon, i) => (
            <span key={i} className="scene-reel" data-n={i % 3}>
              <PixelIcon name={icon} size={24} />
              <i />
              <i />
            </span>
          ))}
        </span>
      </span>
    </Layer>
    <Layer depth={-24} x="52%" y="40%">
      <Loo mood="wink" size={136} decorative />
    </Layer>
    <Layer depth={36} x="80%" y="14%">
      <PixelIcon name="heart" size={40} />
    </Layer>
    <Layer depth={-30} x="54%" y="12%">
      <PixelIcon name="chat" size={44} />
    </Layer>
  </div>,
  // Leagues: Loo on the top of the podium
  <div key="league" className="scene scene-league">
    <Layer depth={8} x="50%" y="auto" className="scene-podium">
      <span data-place="2">2</span>
      <span data-place="1">
        <Loo mood="cheer" size={120} decorative />1
      </span>
      <span data-place="3">3</span>
    </Layer>
    <Layer depth={36} x="7%" y="12%">
      <PixelIcon name="trophy" size={48} />
    </Layer>
    <Layer depth={-30} x="70%" y="10%">
      <Chip icon="fire">7 днів</Chip>
    </Layer>
    <Layer depth={28} x="84%" y="46%">
      <PixelIcon name="medal" size={36} />
    </Layer>
  </div>,
  // Loo himself: the eureka bulb and a nudge for today
  <div key="loo" className="scene scene-loo">
    <Layer depth={-18} x="0%" y="10%" className="scene-loo-center">
      <LooSays mood="eureka" bulb="on" size={132} side="top" text="Один урок сьогодні — і серія жива!" />
    </Layer>
    <Layer depth={34} x="80%" y="70%">
      <PixelIcon name="bulb" size={44} />
    </Layer>
    <Layer depth={-28} x="10%" y="78%">
      <PixelIcon name="star" size={32} />
    </Layer>
    <Layer depth={24} x="84%" y="9%">
      <PixelIcon name="heart" size={28} />
    </Layer>
  </div>,
]

// Signed-out home: what Levelup is, how it works, the courses, sign-up CTAs. A neutral white / dark page with the violet
// accent (landing.css); the only client pieces are the theme switch and the scroll story.
export function Landing({ notice }: { notice?: 'deleted' }) {
  const m = messages().landing
  const steps: HowStep[] = m.how.steps.map((s, i) => ({
    title: s.title,
    body: s.body,
    icon: <PixelIcon name={STEP_ICONS[i % STEP_ICONS.length]!} size={32} />,
    scene: SCENES[i % SCENES.length],
  }))
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link href="/" aria-label="Levelup">
          <Logo size={36} />
        </Link>
        <nav className="landing-nav-links" aria-label="Акаунт">
          <ThemeSwitch />
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
            <span className="landing-eyebrow">{t('landing.hero.eyebrow')}</span>
            <h1 id="landing-title" className="landing-title">
              {t('landing.hero.title')}
            </h1>
            <p className="landing-lead">{t('landing.hero.lead')}</p>
            <div className="landing-cta">
              <Button href="/signup" size="lg">
                {t('landing.hero.cta')}
              </Button>
              <Button href="/login" variant="ghost" size="lg">
                {t('landing.hero.login')}
              </Button>
            </div>
          </div>
          <div className="landing-hero-art">
            <div className="landing-stage">
              <LooSays mood="cheer" size={200} side="top" text={t('landing.hero.loo')} />
              {/* decorative HUD around Loo: what a day in the app looks like */}
              <span className="landing-float" data-kind="streak" aria-hidden="true">
                <PixelIcon name="fire" size={22} /> 7
              </span>
              <span className="landing-float" data-kind="gems" aria-hidden="true">
                <PixelIcon name="gem" size={22} /> 120
              </span>
              <span className="landing-float" data-kind="xp" aria-hidden="true">
                <PixelIcon name="bolt" size={22} /> +15 XP
              </span>
            </div>
          </div>
        </section>

        <ul className="landing-stats" aria-label="Коротко">
          {m.stats.map((s, i) => (
            <li key={s.label}>
              <PixelIcon name={STAT_ICONS[i % STAT_ICONS.length]!} size={32} />
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>

        <HowItWorks title={m.how.title} lead={m.how.lead} steps={steps} />

        <section className="landing-section" aria-labelledby="landing-courses">
          <h2 id="landing-courses" className="landing-h2">
            {t('landing.courses.title')}
          </h2>
          <p className="landing-sub">{t('landing.courses.lead')}</p>
          <Card variant="raised" padding="lg" className="landing-featured">
            <span className="landing-featured-icon" aria-hidden="true">
              <Icon name="si:SiJavascript" size={56} />
            </span>
            <div>
              <Pill tone="violet">{t('landing.courses.featured.badge')}</Pill>
              <h3>{t('landing.courses.featured.title')}</h3>
              <p>{t('landing.courses.featured.body')}</p>
              <ol className="landing-levels" aria-label="Рівні">
                {(['noob', 'junior', 'middle', 'senior', 'god'] as const).map((l) => (
                  <li key={l}>{levelLabel(l)}</li>
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
                  <Icon name={c.icon} size={28} />
                  <span>{c.title}</span>
                  <Pill tone="gray" size="sm">
                    {t('landing.courses.soon')}
                  </Pill>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section className="landing-final lu-px" data-lip="" aria-labelledby="landing-final">
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

      <footer className="landing-footer">
        {t('landing.footer')} <PixelIcon name="flagUa" size={16} className="landing-footer-flag" />
      </footer>
    </div>
  )
}
