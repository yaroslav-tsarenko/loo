import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import Link from 'next/link'
import { headers } from 'next/headers'
import type { ReactNode } from 'react'
import { getProfile, getUser } from '@/server/auth'
import { getContent } from '@/server/content'
import { myLibrary } from '@/server/courses/library'
import { navCounts } from '@/server/services/counts'
import { userXp } from '@/server/services/progress'
import { readSettings } from '@/server/settings'
import { FeedbackProvider } from '@/ui/feedback/FeedbackProvider'
import { CommandPalette } from '@/ui/search/CommandPalette'
import { AppFrame } from '@/ui/shell/AppFrame'
import { ClientEnhancer } from '@/ui/shell/ClientEnhancer'
import { SIDEBAR_BOOT } from '@/ui/shell/constants'
import { BottomNav, CountsProvider } from '@/ui/shell/NavLinks'
import { Sidebar } from '@/ui/shell/Sidebar'
import { guideHref } from '@/ui/routes'
import './globals.css'

// Rounded display face for game chrome (buttons, nav, stats). The reader keeps its system stack.
const nunito = Nunito({ subsets: ['latin', 'cyrillic'], variable: '--font-nunito', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'Levelup', template: '%s · Levelup' },
  description: 'Levelup — навчання як гра: короткі уроки, тести, задачі, серії й ліги від Noob до God',
  applicationName: 'Levelup',
  appleWebApp: { capable: true, title: 'Levelup', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#191919' },
  ],
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Signed-out visitors (landing, sign-in pages) get no app shell and no per-user queries.
  const user = await getUser()
  if (!user) {
    return (
      <html lang="uk" data-theme="system" className={nunito.variable}>
        <body>{children}</body>
      </html>
    )
  }
  const snapshot = await getContent()
  const [settings, xp, counts, profile, nonce, library] = await Promise.all([
    readSettings(),
    userXp(),
    navCounts(snapshot),
    getProfile(),
    headers().then((h) => h.get('x-nonce') ?? undefined),
    myLibrary(),
  ])
  const courses = library.map((c) => ({ id: c.id, title: c.title, icon: c.icon, active: c.enrollment.active }))
  const guides = snapshot.guides.map((g) => ({ id: g.id, title: g.title, href: guideHref(g.id) }))
  const account = { name: profile?.displayName || user.name || user.email || 'Я', avatarUrl: profile?.avatarUrl ?? user.avatarUrl }
  return (
    <html lang="uk" data-theme={settings.theme} className={nunito.variable} suppressHydrationWarning>
      <head>
        {/* Static string (no user input); allowed by the per-request CSP nonce from proxy.ts. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: SIDEBAR_BOOT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          До вмісту
        </a>
        <FeedbackProvider initialXp={xp} sound={settings.sound} volume={settings.volume} haptics={settings.haptics}>
          <CountsProvider initial={counts}>
            <AppFrame
              sidebar={<Sidebar guides={guides} courses={courses} theme={settings.theme} account={account} />}
              banner={
                snapshot.error ? (
                  <div className="vault-error" role="alert">
                    <strong>Vault не знайдено.</strong> {snapshot.error}.{' '}
                    <Link className="ui-link" href="/settings">
                      Вказати шлях
                    </Link>
                  </div>
                ) : null
              }
              after={
                <>
                  <BottomNav />
                  <CommandPalette />
                </>
              }
            >
              {children}
            </AppFrame>
          </CountsProvider>
        </FeedbackProvider>
        <ClientEnhancer />
      </body>
    </html>
  )
}
