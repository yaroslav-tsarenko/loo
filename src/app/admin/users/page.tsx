import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdminArea } from '@/server/admin/guard'
import { listUsers, PAGE_SIZE, USER_SORTS, type UserSort } from '@/server/admin/users'
import { date, fmt, when } from '@/ui/admin/text'

export const metadata: Metadata = { title: 'Користувачі' }

// Learners (docs/ADMIN.md): search by name, email or id; sort by joining, last visit or balances; 50 per page.

type Params = Promise<Record<string, string | string[] | undefined>>
const one = (v: string | string[] | undefined): string => (Array.isArray(v) ? (v[0] ?? '') : (v ?? ''))

export default async function UsersPage({ searchParams }: { searchParams: Params }) {
  await requireAdminArea()
  const params = await searchParams
  const q = one(params.q).slice(0, 100)
  const sort = (one(params.sort) in USER_SORTS ? one(params.sort) : 'joined') as UserSort
  const page = Math.max(1, Math.floor(Number(one(params.page)) || 1))
  const { rows, total } = await listUsers({ q, sort, page })
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const href = (over: Record<string, string | number>) => {
    const sp = new URLSearchParams({ ...(q ? { q } : {}), sort, page: String(page), ...Object.fromEntries(Object.entries(over).map(([k, v]) => [k, String(v)])) })
    return `/admin/users?${sp}`
  }
  return (
    <main className="adm">
      <header className="adm-top">
        <div>
          <h1 className="adm-title">Користувачі</h1>
          <p className="adm-lead">
            {fmt.format(total)} {q ? `за запитом «${q}»` : 'акаунтів'} · сторінка {page} з {pages}
          </p>
        </div>
        <form className="adm-search" action="/admin/users" role="search">
          <input type="search" name="q" defaultValue={q} placeholder="Імʼя, email або id" aria-label="Пошук користувачів" className="adm-input" />
          <input type="hidden" name="sort" value={sort} />
          <button type="submit" className="adm-btn">
            Знайти
          </button>
        </form>
      </header>

      <nav className="adm-ranges" aria-label="Сортування">
        {(Object.keys(USER_SORTS) as UserSort[]).map((s) => (
          <Link key={s} href={href({ sort: s, page: 1 })} className="adm-chip" aria-current={s === sort ? 'page' : undefined}>
            {USER_SORTS[s]}
          </Link>
        ))}
      </nav>

      <section className="adm-card">
        {rows.length === 0 ? (
          <p className="adm-empty">Нікого не знайдено</p>
        ) : (
          <div className="adm-scroll">
            <table className="adm-table adm-users">
              <thead>
                <tr>
                  <th>Користувач</th>
                  <th>Реєстрація</th>
                  <th>Останній візит</th>
                  <th className="num">XP</th>
                  <th className="num">Бакси</th>
                  <th className="num">Кристали</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <Link href={`/admin/users/${u.id}`} className="adm-user-link">
                        {u.name}
                      </Link>
                      {u.role === 'admin' ? <span className="adm-tag">admin</span> : null}
                      {u.banned ? <span className="adm-tag adm-tag-bad">бан</span> : null}
                      <small className="adm-muted adm-block">{u.email || u.id.slice(0, 8)}</small>
                    </td>
                    <td className="tabular">{date.format(u.joined)}</td>
                    <td className="tabular">{u.lastSeen ? when.format(u.lastSeen) : '—'}</td>
                    <td className="num">{fmt.format(u.xp)}</td>
                    <td className="num">{fmt.format(u.bucks)}</td>
                    <td className="num">{fmt.format(u.gems)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pages > 1 ? (
        <nav className="adm-ranges" aria-label="Сторінки">
          {page > 1 ? (
            <Link href={href({ page: page - 1 })} className="adm-chip">
              ← Назад
            </Link>
          ) : null}
          <span className="adm-muted">
            {page} / {pages}
          </span>
          {page < pages ? (
            <Link href={href({ page: page + 1 })} className="adm-chip">
              Далі →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  )
}
