import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell, param } from '@/ui/auth/AuthShell'
import { Button } from '@/ui/design/Button'
import { PixelIcon } from '@/ui/design/PixelIcon'

export const metadata: Metadata = { title: 'Відписка від нагадувань', robots: { index: false, follow: false } }

// Landing page of the unsubscribe link in reminder emails (docs/EMAIL.md). Public: works without signing in.
// The page only asks; the POST to /api/email/unsubscribe does it (link scanners never trigger it).
export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const token = param(params, 't')
  const footer = <Link href="/settings">Налаштування сповіщень</Link>
  if (param(params, 'done') === '1') {
    return (
      <AuthShell mood="sad" loo="Добре, більше не нагадуватиму. Але я чекаю!" title="Нагадувань більше не буде" icon={<PixelIcon name="envelope" size={30} />} lead="Нагадування на пошту вимкнено. Листи про акаунт (підтвердження, пароль) приходитимуть як і раніше. Увімкнути знову можна в налаштуваннях." footer={footer}>
        {null}
      </AuthShell>
    )
  }
  if (param(params, 'error') === '1' || !token) {
    return (
      <AuthShell mood="thinking" loo="Хм, це посилання мені незнайоме." title="Посилання не спрацювало" lead="Можливо, воно пошкоджене. Вимкнути нагадування можна в налаштуваннях акаунта." footer={footer}>
        {null}
      </AuthShell>
    )
  }
  return (
    <AuthShell mood="sad" loo="Точно? Я ж тільки нагадую про серію…" title="Відписатися від нагадувань?" lead="Більше не надсилатимемо листів про серію, місію дня та повернення. Листи про акаунт залишаться." footer={footer}>
      <form action="/api/email/unsubscribe" method="post" className="auth-form">
        <input type="hidden" name="t" value={token} />
        <Button type="submit" block size="lg">
          Так, відписатися
        </Button>
      </form>
    </AuthShell>
  )
}
