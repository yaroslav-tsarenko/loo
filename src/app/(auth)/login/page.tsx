import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { t } from '@/i18n'
import { safeRedirectPath } from '@/lib/redirect'
import { supabaseConfig } from '@/lib/supabase/config'
import { getUser } from '@/server/auth'
import { enabledProviders } from '@/server/auth/providers'
import { AuthShell, Field, FormError, OAuthButtons, param, SetupNotice } from '@/ui/auth/AuthShell'
import { Button } from '@/ui/design/Button'

export const metadata: Metadata = { title: 'Вхід', robots: { index: false, follow: false } }

// The form posts to /auth/sign-in (route handler): no server action is reachable without a session.
export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const next = safeRedirectPath(param(params, 'next'))
  if (await getUser()) redirect(next)
  const configured = supabaseConfig() !== null
  return (
    <AuthShell
      mood="wave"
      loo={t('auth.login.loo')}
      title={t('auth.login.title')}
      lead={t('auth.login.lead')}
      footer={
        <>
          {t('auth.login.noAccount')} <Link href={next === '/' ? '/signup' : `/signup?next=${encodeURIComponent(next)}`}>{t('auth.login.signupLink')}</Link>
        </>
      }
    >
      {configured ? (
        <>
          <OAuthButtons next={next} providers={await enabledProviders()} />
          <form action="/auth/sign-in" method="post" className="auth-form">
            <input type="hidden" name="next" value={next} />
            <Field label={t('auth.email')} name="email" type="email" autoComplete="email" required maxLength={254} autoFocus inputMode="email" />
            <Field label={t('auth.password')} name="password" type="password" autoComplete="current-password" required maxLength={128} />
            <FormError code={param(params, 'error')} />
            <Button type="submit" block size="lg">
              {t('auth.login.submit')}
            </Button>
            <Link className="auth-link" href="/forgot-password">
              {t('auth.login.forgot')}
            </Link>
          </form>
        </>
      ) : (
        <SetupNotice />
      )}
    </AuthShell>
  )
}
