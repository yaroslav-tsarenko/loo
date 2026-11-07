import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { t } from '@/i18n'
import { getUser } from '@/server/auth'
import { PASSWORD_MIN } from '@/server/auth/http'
import { AuthShell, Field, FormError, param } from '@/ui/auth/AuthShell'
import { Button } from '@/ui/design/Button'

export const metadata: Metadata = { title: 'Новий пароль', robots: { index: false, follow: false } }

// Reached from the recovery email (the link signs the user in first); also usable to change the password later.
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const user = await getUser()
  if (!user) redirect('/forgot-password?error=expired')
  return (
    <AuthShell mood="thinking" loo={t('auth.reset.loo')} title={t('auth.reset.title')} lead={t('auth.reset.lead', { email: user.email ?? '' })}>
      <form action="/auth/reset-password" method="post" className="auth-form">
        <Field label={t('auth.passwordNew')} name="password" type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} maxLength={128} autoFocus placeholder={t('auth.placeholders.passwordNew')} hint={t('auth.passwordHint', { min: PASSWORD_MIN })} />
        <Field label={t('auth.passwordConfirm')} name="confirm" type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} maxLength={128} placeholder={t('auth.placeholders.passwordConfirm')} />
        <FormError code={param(params, 'error')} />
        <Button type="submit" block size="lg">
          {t('auth.reset.submit')}
        </Button>
      </form>
    </AuthShell>
  )
}
