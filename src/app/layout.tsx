import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Noto_Color_Emoji, Onest, Pixelify_Sans } from 'next/font/google'
import Link from 'next/link'
import { headers } from 'next/headers'
import type { ReactNode } from 'react'
import { getProfile, getUser } from '@/server/auth'
import { coursePractice } from '@/course/practice'
import { readSettings } from '@/server/settings'
import { shellData } from '@/server/shell'
import { uiLocale } from '@/server/locale'
import { LocaleProvider } from '@/i18n/react'
import { t } from '@/i18n'
import { LooSkinProvider } from '@/ui/design/mascot/LooSkin'
import { EvolutionMoment } from '@/ui/game/EvolutionMoment'
import { FeedbackProvider } from '@/ui/feedback/FeedbackProvider'
import { SpeechSettingsProvider } from '@/ui/lang/SpeechSettings'
import { Tracker } from '@/ui/analytics/Tracker'
import { CommandPalette } from '@/ui/search/CommandPalette'
import { AppFrame } from '@/ui/shell/AppFrame'
import { ClientEnhancer } from '@/ui/shell/ClientEnhancer'
import { PUBLIC_THEME_BOOT, SIDEBAR_BOOT } from '@/ui/shell/constants'
import { FALLBACK_PRACTICE } from '@/ui/shell/course-nav'
import { BottomNav, CountsProvider, PracticeProvider } from '@/ui/shell/NavLinks'
import { Sidebar } from '@/ui/shell/Sidebar'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

// docs/DESIGN.md: Onest for all text, JetBrains Mono for code, Pixelify Sans only for the wordmark.
const onest = Onest({ subsets: ['latin', 'cyrillic'], variable: '--font-onest', display: 'swap' })
const pixel = Pixelify_Sans({ subsets: ['latin', 'cyrillic'], weight: '700', variable: '--font-pixel', display: 'swap', preload: false })
const mono = JetBrains_Mono({ subsets: ['latin', 'cyrillic'], variable: '--font-jbmono', display: 'swap', preload: false })
// Any emoji left in content renders in Google's Noto set, never the platform's (Apple) glyphs. Split by unicode-range,
// so a page only downloads the chunks it uses.
const emoji = Noto_Color_Emoji({ weight: '400', subsets: ['emoji'], variable: '--font-emoji', display: 'swap', preload: false })
const fonts = `${onest.variable} ${pixel.variable} ${mono.variable} ${emoji.variable}`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Loo — навчання як гра: англійська, JavaScript і не тільки', template: '%s · Loo' },
  description: 'Loo — навчання як гра: короткі уроки, тести, задачі, серії й ліги — шлях воїна від Новобранця до Легенди',
  applicationName: 'Loo',
  keywords: ['вивчення англійської', 'англійська онлайн', 'JavaScript з нуля', 'курси програмування', 'навчання як гра', 'Loo'],
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'uk_UA' },
  twitter: { card: 'summary_large_image' },
  appleWebApp: { capable: true, title: 'Loo', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f3ff' },
    { media: '(prefers-color-scheme: dark)', color: '#16112b' },
  ],
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Signed-out visitors (landing, sign-in pages) get no app shell and no per-user queries.
  const user = await getUser()
  if (!user) {
    const nonce = (await headers()).get('x-nonce') ?? undefined
    return (
      <html lang="uk" data-theme="system" className={fonts} suppressHydrationWarning>
        <head>
          {/* Static string (no user input); allowed by the per-request CSP nonce from proxy.ts. */}
          <script nonce={nonce} dangerouslySetInnerHTML={{ __html: PUBLIC_THEME_BOOT }} />
        </head>
        <body>
          {children}
          <Tracker />
        </body>
      </html>
    )
  }
  // Two transactions in all: the learner's base rows (profile, settings, active course) and the shell's reads
  // (src/server/base.ts, src/server/shell.ts) — both cached for the page rendered inside.
  const [settings, profile, shell, nonce, locale] = await Promise.all([readSettings(), getProfile(), shellData(), headers().then((h) => h.get('x-nonce') ?? undefined), uiLocale()])
  if (!shell) throw new Error('shell: signed-in user without shell data')
  const { snapshot, xp, counts, library, game, active, theory } = shell
  const courses = library.map((c) => ({ id: c.id, title: c.title, icon: c.icon, active: c.enrollment.active }))
  // The shell adapts to the active course: its practice sections (course.yaml `practice:`) and its theory only.
  const meta = active?.bundle.course
  const course = meta ? { id: meta.id, title: meta.title, icon: meta.icon } : null
  const practice = meta ? coursePractice(meta) : FALLBACK_PRACTICE
  const account = { name: profile?.displayName || user.name || user.email || 'Я', avatarUrl: profile?.avatarUrl ?? user.avatarUrl }
  return (
    <html lang={locale} data-theme={settings.theme} className={fonts} suppressHydrationWarning>
      <head>
        {/* Static string (no user input); allowed by the per-request CSP nonce from proxy.ts. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: SIDEBAR_BOOT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {t('shell.skipToContent', undefined, locale)}
        </a>
        <LocaleProvider locale={locale}>
        <FeedbackProvider initialXp={xp} sound={settings.sound} volume={settings.volume} haptics={settings.haptics}>
          <SpeechSettingsProvider accent={settings.accent}>
          <LooSkinProvider skin={game.look}>
          <CountsProvider initial={counts}>
          <PracticeProvider sections={practice}>
            <AppFrame
              sidebar={<Sidebar course={course} theory={theory} courses={courses} theme={settings.theme} account={account} rank={game.rank} />}
              banner={
                snapshot.error ? (
                  <div className="vault-error" role="alert">
                    <strong>{t('shell.vaultMissing', undefined, locale)}</strong> {snapshot.error}.{' '}
                    <Link className="ui-link" href="/settings">
                      {t('shell.vaultPath', undefined, locale)}
                    </Link>
                  </div>
                ) : null
              }
              after={
                <>
                  <BottomNav />
                  <CommandPalette />
                  {game.evolution ? <EvolutionMoment key={game.evolution.to} from={game.evolution.from} to={game.evolution.to} /> : null}
                </>
              }
            >
              {children}
            </AppFrame>
          </PracticeProvider>
          </CountsProvider>
          </LooSkinProvider>
          </SpeechSettingsProvider>
        </FeedbackProvider>
        </LocaleProvider>
        <ClientEnhancer />
        <Tracker />
      </body>
    </html>
  )
}
