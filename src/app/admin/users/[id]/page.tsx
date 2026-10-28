import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MAX_HEARTS } from '@/game/hearts'
import { SHOP_ITEMS } from '@/game/shop'
import { addFreezes, adjustBalance, banUser, giveBoost, giveItem, setHearts, takeItem, unbanUser } from '@/server/admin/actions'
import { requireAdminArea } from '@/server/admin/guard'
import { userCard } from '@/server/admin/users'
import { ACTION_LABEL, actorLabel, date, describe, fmt, full, signed, when } from '@/ui/admin/text'

export const metadata: Metadata = { title: 'Користувач' }

// One learner (docs/ADMIN.md): profile, balances, game state, courses, items, ledgers, visits and the admin's tools —
// balances ±, hearts, streak freezes, double XP, items, ban. Every change lands in the audit log.

const KIND: Record<string, string> = { xp: 'XP', bucks: 'Бакси', gems: 'Кристали' }
const TYPE: Record<string, string> = { pageview: 'перегляд', click: 'клік', leave: 'вихід' }
const OK: Record<string, string> = { ...ACTION_LABEL }
const PERMANENT = SHOP_ITEMS.filter((i) => i.kind === 'skin' || i.kind === 'gear')

export default async function UserPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdminArea()
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const u = await userCard(id)
  if (!u) notFound()
  const ok = typeof sp.ok === 'string' ? OK[sp.ok] : undefined
  const owned = new Set(u.items.map((i) => i.id))
  const hidden = <input type="hidden" name="userId" value={u.id} />
  return (
    <main className="adm">
      <header className="adm-top">
        <div>
          <p className="adm-crumbs">
            <Link href="/admin/users">← Користувачі</Link>
          </p>
          <h1 className="adm-title">
            {u.name}
            {u.role === 'admin' ? <span className="adm-tag">admin</span> : null}
            {u.bannedAt ? <span className="adm-tag adm-tag-bad">бан</span> : null}
          </h1>
          <p className="adm-lead">
            {u.email || 'email невідомий'} · <span className="adm-mono">{u.id}</span>
          </p>
          <p className="adm-lead">
            Реєстрація {date.format(u.joined)} · останній візит {u.lastSeen ? when.format(u.lastSeen) : '—'} · ранг {u.rank.title}
          </p>
        </div>
      </header>

      {ok ? (
        <p className="adm-ok" role="status">
          Готово: {ok}
        </p>
      ) : null}
      {u.bannedAt ? (
        <p className="adm-issues" role="alert">
          Заблокований з {full.format(u.bannedAt)}: {u.banReason || 'без причини'}
        </p>
      ) : null}

      <section className="adm-kpis">
        {(
          [
            ['XP', fmt.format(u.balances.xp)],
            ['Бакси', fmt.format(u.balances.bucks)],
            ['Кристали', fmt.format(u.balances.gems)],
            ['Сердечка', `${u.state.hearts} / ${MAX_HEARTS}`],
            ['Заморозки', fmt.format(u.state.freezes)],
            ['Подвійний XP', u.state.boostActive && u.state.boostUntil ? `до ${when.format(u.state.boostUntil)}` : 'ні'],
            ['Перегляди / сесії', `${fmt.format(u.stats.views)} / ${fmt.format(u.stats.sessions)}`],
            ['Уроки / відповіді', `${fmt.format(u.stats.lessons)} / ${fmt.format(u.stats.attempts)}`],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="adm-kpi">
            <span className="adm-kpi-value tabular">{value}</span>
            <span className="adm-kpi-label">{label}</span>
          </div>
        ))}
      </section>

      <div className="adm-grid adm-tools">
        <section className="adm-card">
          <h2 className="adm-h2">Баланс</h2>
          <p className="adm-hint">Додай або забери (мінус). Нижче нуля не опуститься; у історії учня — рядок «admin».</p>
          <form action={adjustBalance} className="adm-form">
            {hidden}
            <select name="kind" className="adm-input" aria-label="Валюта" defaultValue="bucks">
              <option value="bucks">Бакси</option>
              <option value="gems">Кристали</option>
              <option value="xp">XP</option>
            </select>
            <input name="amount" type="number" required step={1} min={-1_000_000} max={1_000_000} placeholder="+500 або -100" className="adm-input adm-amount" aria-label="Кількість" />
            <input name="note" type="text" maxLength={200} placeholder="Нотатка (необовʼязково)" className="adm-input adm-wide" aria-label="Нотатка" />
            <button type="submit" className="adm-btn">
              Застосувати
            </button>
          </form>
          <div className="adm-quick">
            {[
              ['bucks', 500],
              ['bucks', 2000],
              ['gems', 50],
              ['gems', 200],
              ['xp', 100],
              ['xp', 1000],
            ].map(([kind, amount]) => (
              <form key={`${kind}${amount}`} action={adjustBalance}>
                {hidden}
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="amount" value={amount} />
                <button type="submit" className="adm-chip">
                  +{fmt.format(Number(amount))} {KIND[kind as string]}
                </button>
              </form>
            ))}
          </div>
        </section>

        <section className="adm-card">
          <h2 className="adm-h2">Бафи</h2>
          <form action={setHearts} className="adm-form">
            {hidden}
            <label className="adm-label">
              Сердечка
              <input name="hearts" type="number" min={0} max={MAX_HEARTS} defaultValue={MAX_HEARTS} className="adm-input adm-narrow" />
            </label>
            <button type="submit" className="adm-btn">
              Встановити
            </button>
          </form>
          <form action={addFreezes} className="adm-form">
            {hidden}
            <label className="adm-label">
              Заморозки серії
              <input name="count" type="number" min={-20} max={20} defaultValue={1} className="adm-input adm-narrow" />
            </label>
            <button type="submit" className="adm-btn">
              Додати
            </button>
          </form>
          <form action={giveBoost} className="adm-form">
            {hidden}
            <label className="adm-label">
              Подвійний XP, годин
              <input name="hours" type="number" min={0} max={720} defaultValue={24} className="adm-input adm-narrow" />
            </label>
            <button type="submit" className="adm-btn">
              Дати
            </button>
          </form>
          <p className="adm-hint">0 годин — зняти подвійний XP. Новий буст додається до того, що ще діє.</p>
        </section>

        <section className="adm-card">
          <h2 className="adm-h2">Предмети</h2>
          <form action={giveItem} className="adm-form">
            {hidden}
            <select name="itemId" className="adm-input adm-wide" aria-label="Предмет" required>
              {PERMANENT.filter((i) => !owned.has(i.id)).map((i) => (
                <option key={i.id} value={i.id}>
                  {i.id} · {i.kind === 'gear' ? 'спорядження' : 'скін'}
                </option>
              ))}
            </select>
            <button type="submit" className="adm-btn">
              Видати
            </button>
          </form>
          {u.items.length === 0 ? (
            <p className="adm-empty">Предметів немає</p>
          ) : (
            <ul className="adm-items">
              {u.items.map((i) => (
                <li key={i.id}>
                  <span className="adm-mono">{i.id}</span>
                  <small className="adm-muted">{date.format(i.at)}</small>
                  <form action={takeItem}>
                    {hidden}
                    <input type="hidden" name="itemId" value={i.id} />
                    <button type="submit" className="adm-link-btn">
                      забрати
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <h2 className="adm-h2">Доступ</h2>
          {u.bannedAt ? (
            <form action={unbanUser} className="adm-form">
              {hidden}
              <button type="submit" className="adm-btn">
                Розблокувати
              </button>
            </form>
          ) : u.role === 'admin' ? (
            <p className="adm-hint">Адмін-акаунт заблокувати не можна.</p>
          ) : (
            <form action={banUser} className="adm-form">
              {hidden}
              <input name="reason" type="text" required maxLength={300} placeholder="Причина (побачить учень)" className="adm-input adm-wide" aria-label="Причина бану" />
              <button type="submit" className="adm-btn adm-btn-bad">
                Заблокувати
              </button>
            </form>
          )}
          <p className="adm-hint">Заблокований бачить сторінку з причиною замість застосунку; дані не видаляються.</p>
          <h3 className="adm-h3">Курси</h3>
          {u.enrollments.length === 0 ? (
            <p className="adm-empty">Не записаний на курси</p>
          ) : (
            <ul className="adm-items">
              {u.enrollments.map((e) => (
                <li key={e.course}>
                  <span>{e.course}</span>
                  <small className="adm-muted">
                    {e.level}
                    {e.active ? ' · активний' : ''} · з {date.format(e.enrolledAt)}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="adm-grid">
        <section className="adm-card">
          <h2 className="adm-h2">Нарахування</h2>
          {u.ledger.length === 0 ? (
            <p className="adm-empty">Поки порожньо</p>
          ) : (
            <table className="adm-table">
              <tbody>
                {u.ledger.map((l, i) => (
                  <tr key={`${l.at}-${i}`}>
                    <td className="tabular">{when.format(l.at)}</td>
                    <td>{KIND[l.kind]}</td>
                    <td className="adm-mono">{l.reason}</td>
                    <td className={`num ${l.amount < 0 ? 'adm-neg' : 'adm-pos'}`}>{signed(l.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="adm-card">
          <h2 className="adm-h2">Дії адміна</h2>
          {u.audit.length === 0 ? (
            <p className="adm-empty">Ще нічого не змінювали</p>
          ) : (
            <table className="adm-table">
              <tbody>
                {u.audit.map((a, i) => (
                  <tr key={`${a.at}-${i}`}>
                    <td className="tabular">{when.format(a.at)}</td>
                    <td>{ACTION_LABEL[a.action] ?? a.action}</td>
                    <td>{describe(a.action, a.payload)}</td>
                    <td className="adm-muted">{actorLabel(a.actor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <section className="adm-card">
        <h2 className="adm-h2">Останні події на сайті</h2>
        {u.events.length === 0 ? (
          <p className="adm-empty">Подій ще немає</p>
        ) : (
          <div className="adm-scroll">
            <table className="adm-table adm-recent">
              <thead>
                <tr>
                  <th>Час</th>
                  <th>Подія</th>
                  <th>Сторінка / елемент</th>
                  <th>Де</th>
                  <th>IP</th>
                  <th>Пристрій</th>
                </tr>
              </thead>
              <tbody>
                {u.events.map((e, i) => (
                  <tr key={`${e.at}-${i}`}>
                    <td className="tabular">{when.format(e.at)}</td>
                    <td>{TYPE[e.type] ?? e.type}</td>
                    <td className="adm-mono">
                      {e.path}
                      {e.label ? <small> → {e.label}</small> : null}
                    </td>
                    <td>{e.place || '—'}</td>
                    <td className="adm-mono">{e.ip || '—'}</td>
                    <td>{e.device}</td>
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
