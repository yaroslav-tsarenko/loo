import type { Metadata } from 'next'
import { ADMIN_TTL_S } from '@/lib/admin-token'
import { purgeAnalytics } from '@/server/admin/actions'
import { requireAdminArea } from '@/server/admin/guard'
import { tableSizes } from '@/server/admin/users'
import { fmt } from '@/ui/admin/text'

export const metadata: Metadata = { title: 'Налаштування' }

// Admin settings (docs/ADMIN.md): how the admin signs in and rotates the password, analytics retention, the database
// size. Secrets are never shown — only whether they are set.

const set = (v: string | undefined) => Boolean(v && v.trim())

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const via = await requireAdminArea()
  const sp = await searchParams
  const tables = await tableSizes()
  const env = process.env
  const checks: Array<[string, boolean]> = [
    ['ADMIN_LOGIN_EMAIL', set(env.ADMIN_LOGIN_EMAIL)],
    ['ADMIN_PASSWORD_HASH', set(env.ADMIN_PASSWORD_HASH)],
    ['ADMIN_SESSION_SECRET', set(env.ADMIN_SESSION_SECRET)],
    ['ADMIN_EMAILS (акаунти з роллю admin)', set(env.ADMIN_EMAILS)],
  ]
  return (
    <main className="adm">
      <header className="adm-top">
        <div>
          <h1 className="adm-title">Налаштування</h1>
          <p className="adm-lead">Доступ, зберігання даних, база</p>
        </div>
      </header>

      {sp.ok === 'purge' ? (
        <p className="adm-ok" role="status">
          Аналітику почищено: видалено {fmt.format(Number(sp.removed ?? 0))} подій.
        </p>
      ) : null}

      <div className="adm-grid">
        <section className="adm-card">
          <h2 className="adm-h2">Вхід в адмінку</h2>
          <p>
            Зараз: <b>{via === 'login' ? 'адмін-логін' : 'акаунт з роллю admin'}</b>. Адмін-сесія живе {ADMIN_TTL_S / 3600} год.
          </p>
          <p>
            Логін: <span className="adm-mono">{env.ADMIN_LOGIN_EMAIL || '—'}</span>
          </p>
          <ul className="adm-items">
            {checks.map(([name, ok]) => (
              <li key={name}>
                <span className="adm-mono">{name}</span>
                <span className={ok ? 'adm-pos' : 'adm-neg'}>{ok ? 'задано' : 'немає'}</span>
              </li>
            ))}
          </ul>
          <p className="adm-hint">Новий пароль (старий і всі адмін-сесії стануть недійсні), потім задеплоїти:</p>
          <pre className="adm-code">pnpm admin:credentials --vercel</pre>
        </section>

        <section className="adm-card">
          <h2 className="adm-h2">Зберігання аналітики</h2>
          <p className="adm-hint">IP і місто — персональні дані. Рекомендовано тримати не більше 90 днів. Видалення незворотне.</p>
          <form action={purgeAnalytics} className="adm-form">
            <label className="adm-label">
              Видалити події, старші за (днів)
              <input name="days" type="number" min={7} max={3650} defaultValue={90} className="adm-input adm-narrow" />
            </label>
            <button type="submit" className="adm-btn adm-btn-bad">
              Почистити
            </button>
          </form>
        </section>
      </div>

      <section className="adm-card">
        <h2 className="adm-h2">Таблиці бази (приблизна кількість рядків)</h2>
        <table className="adm-table">
          <tbody>
            {tables.map((t) => (
              <tr key={t.table}>
                <td className="adm-mono">{t.table}</td>
                <td className="num">{fmt.format(t.rows)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
