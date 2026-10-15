import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { t } from '@/i18n'
import { supabaseConfig } from '@/lib/supabase/config'
import { getUser } from '@/server/auth'
import { AuthShell, Field, FormError, param, SetupNotice } from '@/ui/auth/AuthShell'
import { Button } from '@/ui/design/Button'

export const metadata: Metadata = { title: 'Відновлення пароля', robots: { index: false, follow: false } }

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  if (await getUser()) redirect('/account')
  const sent = param(params, 'sent') === '1'
  const footer = <Link href="/login">{t('auth.forgot.backToLogin')}</Link>
  if (sent) {
    return <AuthShell mood="happy" loo={t('auth.forgot.loo')} title={t('auth.forgot.sentTitle')} lead={t('auth.forgot.sentBody')} footer={footer}>{null}</AuthShell>
  }
  return (
    <AuthShell mood="thinking" loo={t('auth.forgot.loo')} title={t('auth.forgot.title')} lead={t('auth.forgot.lead')} footer={footer}>
      {supabaseConfig() ? (
        <form action="/auth/forgot-password" method="post" className="auth-form">
          <Field label={t('auth.email')} name="email" type="email" autoComplete="email" required maxLength={254} autoFocus inputMode="email" />
          <FormError code={param(params, 'error')} />
          <Button type="submit" block size="lg">
            {t('auth.forgot.submit')}
          </Button>
        </form>
      ) : (
        <SetupNotice />
      )}
    </AuthShell>
  )
}
