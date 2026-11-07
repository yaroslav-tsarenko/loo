import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdminArea } from '@/server/admin/guard'
import { auditLog } from '@/server/admin/users'
import { ACTION_LABEL, actorLabel, describe, full } from '@/ui/admin/text'

export const metadata: Metadata = { title: 'Журнал дій' }

// Every admin change (docs/ADMIN.md): when, who, what, to whom. Append-only; the newest 200.
export default async function AuditPage() {
  await requireAdminArea()
  const rows = await auditLog(200)
  return (
    <main className="adm">
      <header className="adm-top">
        <div>
          <h1 className="adm-title">Журнал дій</h1>
          <p className="adm-lead">Усі зміни, зроблені з адмінки · останні {rows.length}</p>
        </div>
      </header>
      <section className="adm-card">
        {rows.length === 0 ? (
          <p className="adm-empty">Ще жодної дії</p>
        ) : (
          <div className="adm-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Час</th>
                  <th>Дія</th>
                  <th>Деталі</th>
                  <th>Кому</th>
                  <th>Хто</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`${r.at}-${i}`}>
                    <td className="tabular">{full.format(r.at)}</td>
                    <td>{ACTION_LABEL[r.action] ?? r.action}</td>
                    <td>{describe(r.action, r.payload)}</td>
                    <td>
                      {r.targetId ? (
                        <Link href={`/admin/users/${r.targetId}`} className="adm-user-link">
                          {r.targetName || r.targetId.slice(0, 8)}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="adm-muted">{actorLabel(r.actor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
