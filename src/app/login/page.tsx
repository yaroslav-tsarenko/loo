import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { authMode } from '@/lib/auth'
import { safeRedirectPath } from '@/lib/redirect'

export const metadata: Metadata = { title: 'Вхід', robots: { index: false, follow: false } }

const ERRORS: Record<string, string> = {
  '1': 'Невірний пароль',
  rate: 'Забагато спроб. Спробуй трохи пізніше',
}

// The form posts to /auth/login (route handler): no server action is reachable without a session.
export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const mode = authMode()
  if (mode === 'open') redirect('/')
  const error = typeof params.error === 'string' ? ERRORS[params.error] : undefined
  return (
    <main className="login">
      <form action="/auth/login" method="post" className="login-card">
        <div className="login-emoji" aria-hidden="true">
          🧠
        </div>
        <h1 className="login-title">Interview Prep</h1>
        <p className="login-lead">Тренажер для мегамозку. Увійди, щоб продовжити серію.</p>
        {mode === 'locked' ? (
          <p className="login-error" role="alert">
            Вхід не налаштовано: додай змінні APP_PASSWORD і AUTH_SECRET (≥ 32 символи) у Vercel.
          </p>
        ) : (
          <>
            <input type="hidden" name="next" value={safeRedirectPath(params.next)} />
            <label className="login-label" htmlFor="password">
              Пароль
            </label>
            <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={1024} autoFocus className="login-input" />
            {error ? (
              <p className="login-error" role="alert">
                {error}
              </p>
            ) : null}
            <button type="submit" className="login-button">
              Увійти →
            </button>
          </>
        )}
      </form>
    </main>
  )
}
