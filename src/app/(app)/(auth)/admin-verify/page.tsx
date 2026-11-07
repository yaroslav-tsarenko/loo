import type { Metadata } from 'next'
import { AuthShell, Field, FormError, param } from '@/ui/auth/AuthShell'
import { Button } from '@/ui/design/Button'

export const metadata: Metadata = { title: 'Код входу', robots: { index: false, follow: false } }

// The admin login's second step: the code from the authenticator app (src/app/(app)/(auth)/auth/admin-verify).
export default async function AdminVerifyPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  return (
    <AuthShell mood="thinking" loo="Ще один крок" title="Код з застосунку" lead="Введи 6 цифр з застосунку-автентифікатора для входу в адмінку.">
      <form action="/auth/admin-verify" method="post" className="auth-form">
        <Field label="Код" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" maxLength={7} required autoFocus placeholder="123 456" />
        <FormError code={param(params, 'error')} />
        <Button type="submit" block size="lg">
          Увійти
        </Button>
      </form>
    </AuthShell>
  )
}
