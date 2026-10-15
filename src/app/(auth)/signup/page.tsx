import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { t } from '@/i18n'
import { safeRedirectPath } from '@/lib/redirect'
import { supabaseConfig } from '@/lib/supabase/config'
import { getUser } from '@/server/auth'
import { enabledProviders } from '@/server/auth/providers'
import { PASSWORD_MIN } from '@/server/auth/http'
import { AuthShell, Field, FormError, OAuthButtons, param, SetupNotice } from '@/ui/auth/AuthShell'
import { Button } from '@/ui/design/Button'

export const metadata: Metadata = { title: 'Реєстрація', robots: { index: false, follow: false } }

export default async function SignupPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const next = safeRedirectPath(param(params, 'next'))
  if (await getUser()) redirect(next)
  const configured = supabaseConfig() !== null
  const sent = param(params, 'sent') === '1'
  const footer = (
    <>
      {t('auth.signup.haveAccount')} <Link href="/login">{t('auth.signup.loginLink')}</Link>
    </>
  )
  if (sent) {
    return (
      <AuthShell mood="cheer" loo={t('auth.signup.loo')} title={t('auth.signup.sentTitle')} lead={t('auth.signup.sentBody')} footer={footer}>
        <Button href="/login" variant="secondary" block>
          {t('auth.signup.loginLink')}
        </Button>
      </AuthShell>
    )
  }
  return (
    <AuthShell mood="happy" loo={t('auth.signup.loo')} title={t('auth.signup.title')} lead={t('auth.signup.lead')} footer={footer}>
      {configured ? (
        <>
          <OAuthButtons next={next} providers={await enabledProviders()} />
          <form action="/auth/sign-up" method="post" className="auth-form">
            <input type="hidden" name="next" value={next} />
            <Field label={t('auth.name')} name="name" type="text" autoComplete="nickname" maxLength={80} />
            <Field label={t('auth.email')} name="email" type="email" autoComplete="email" required maxLength={254} inputMode="email" />
            <Field label={t('auth.password')} name="password" type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} maxLength={128} hint={t('auth.passwordHint', { min: PASSWORD_MIN })} />
            <Field label={t('auth.passwordConfirm')} name="confirm" type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} maxLength={128} />
            <FormError code={param(params, 'error')} />
            <Button type="submit" block size="lg">
              {t('auth.signup.submit')}
            </Button>
            <p className="auth-hint">{t('auth.signup.terms')}</p>
          </form>
        </>
      ) : (
        <SetupNotice />
      )}
    </AuthShell>
  )
}
