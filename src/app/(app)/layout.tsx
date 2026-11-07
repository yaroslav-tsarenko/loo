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
import { en } from '@/i18n/register'
import { LooSkinProvider } from '@/ui/design/mascot/LooSkin'
import { EvolutionMoment } from '@/ui/game/EvolutionMoment'
import { FeedbackProvider } from '@/ui/feedback/FeedbackProvider'
import { SpeechSettingsProvider } from '@/ui/lang/SpeechSettings'
import { CommandPalette } from '@/ui/search/CommandPalette'
import { AppFrame } from '@/ui/shell/AppFrame'
import { ClientEnhancer } from '@/ui/shell/ClientEnhancer'
import { htmlAttrsBoot, PUBLIC_THEME_BOOT, SIDEBAR_BOOT } from '@/ui/shell/constants'
import { HtmlAttrs } from '@/ui/shell/HtmlAttrs'
import { FALLBACK_PRACTICE } from '@/ui/shell/course-nav'
import { BottomNav, CountsProvider, PracticeProvider } from '@/ui/shell/NavLinks'
import { Sidebar } from '@/ui/shell/Sidebar'

// The signed-in app (and the dynamic pages that check for a session). The root layout (src/app/layout.tsx) is static —
// it serves the prerendered public pages too (/blog, /welcome) — so this layout owns everything per-request: the
// session, the shell's two transactions, the CSP nonce, and the <html> attributes (theme, language), set by a boot
// script before first paint and kept in sync on client navigations by <HtmlAttrs>.
export default async function AppLayout({ children }: { children: ReactNode }) {
  // Signed-out visitors (landing, sign-in pages) get no app shell and no per-user queries.
  const user = await getUser()
  if (!user) {
    const nonce = (await headers()).get('x-nonce') ?? undefined
    return (
      <>
        {/* Static string (no user input); allowed by the per-request CSP nonce from proxy.ts. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: PUBLIC_THEME_BOOT }} />
        {children}
      </>
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
    <>
      {/* Static strings (no user input; theme and locale are enums); allowed by the per-request CSP nonce from proxy.ts. */}
      <script nonce={nonce} dangerouslySetInnerHTML={{ __html: htmlAttrsBoot(settings.theme, locale) + SIDEBAR_BOOT }} />
      <HtmlAttrs theme={settings.theme} lang={locale} />
        <a href="#main" className="skip-link">
          {t('shell.skipToContent', undefined, locale)}
        </a>
        <LocaleProvider locale={locale} dict={locale === 'en' ? en : undefined}>
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
    </>
  )
}
