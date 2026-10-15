import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { authMode, createSessionToken, passwordMatches, SESSION_COOKIE, SESSION_TTL_MS } from '@/lib/auth'

export const metadata: Metadata = { title: 'Вхід' }

function safeNext(raw: unknown): string {
  const next = typeof raw === 'string' ? raw : '/'
  return next.startsWith('/') && !next.startsWith('//') ? next : '/'
}

async function signIn(formData: FormData) {
  'use server'
  const next = safeNext(formData.get('next'))
  if (!(await passwordMatches(String(formData.get('password') ?? '')))) {
    // Slow down guessing a little.
    await new Promise((r) => setTimeout(r, 800))
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`)
  }
  ;(await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
  redirect(next)
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams
  const mode = authMode()
  if (mode === 'open') redirect('/')
  return (
    <main className="login">
      <form action={signIn} className="login-card">
        <div className="login-emoji" aria-hidden="true">
          🧠
        </div>
        <h1 className="login-title">Interview Prep</h1>
        <p className="login-lead">Тренажер для мегамозку. Увійди, щоб продовжити серію.</p>
        {mode === 'locked' ? (
          <p className="login-error" role="alert">
            Пароль не налаштовано: додай змінну APP_PASSWORD у Vercel.
          </p>
        ) : (
          <>
            <input type="hidden" name="next" value={safeNext(params.next)} />
            <label className="login-label" htmlFor="password">
              Пароль
            </label>
            <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus className="login-input" />
            {params.error ? (
              <p className="login-error" role="alert">
                Невірний пароль
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
