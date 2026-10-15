import type { Metadata } from 'next'
import Link from 'next/link'
import { defaultVaultConfig } from '@/content/config'
import { isAdmin } from '@/server/auth'
import { getContent } from '@/server/content'
import { readSettings } from '@/server/settings'
import { SettingsForm } from '@/ui/settings/SettingsForm'

export const metadata: Metadata = { title: 'Налаштування' }

const CODE_LABEL: Record<string, string> = {
  'missing-id': 'Без явного id',
  'duplicate-id': 'Дублікати id',
  'broken-link': 'Биті посилання',
  'quiz-no-correct': 'Тест без правильної відповіді',
  'task-no-solution': 'Задача без рішення',
  'exercise-invalid': 'Некоректні вправи з кодом',
  'prerequisite-cycle': 'Цикл у prerequisites',
  'parse-error': 'Помилки розбору',
  'unknown-block': 'Невідомі візуалізації',
}

export default async function SettingsPage() {
  const snapshot = await getContent()
  const [settings, admin] = await Promise.all([readSettings(), isAdmin()])
  const groups = new Map<string, typeof snapshot.issues>()
  for (const issue of snapshot.issues) {
    const list = groups.get(issue.code) ?? []
    list.push(issue)
    groups.set(issue.code, list)
  }
  return (
    <div className="page settings-page">
      <header className="study-head">
        <h1 className="page-title">Налаштування</h1>
        <p className="page-lead">
          Налаштування твого акаунта: тема, звук, щоденна ціль. Прогрес зберігається в хмарі й доступний на будь-якому пристрої.
        </p>
      </header>
      <SettingsForm initial={settings} vaultPath={snapshot.config.vaultPath} envVault={defaultVaultConfig().vaultPath} admin={admin} />
      <section aria-labelledby="s-session">
        <h2 id="s-session" className="section-title rule-title">
          Акаунт
        </h2>
        <p className="unit-meta">
          Ім&apos;я, аватар, інтереси, експорт і видалення даних — у <Link className="ui-link" href="/account">профілі й акаунті</Link>.
        </p>
        {/* Plain POST to a route handler (same-origin checked); ends the Supabase session. */}
        <form action="/auth/sign-out" method="post">
          <button type="submit" className="ui-button" data-variant="ghost">
            Вийти
          </button>
        </form>
      </section>
      <section aria-labelledby="s-issues">
        <h2 id="s-issues" className="section-title rule-title">
          Проблеми контенту
        </h2>
        <p className="unit-meta">
          Скан vault: {snapshot.scanMs} мс · посібників {snapshot.guides.length} · розділів {snapshot.chapters.size} · навчальних одиниць {snapshot.units.size}
        </p>
        {groups.size === 0 ? (
          <p className="empty-note">Проблем не знайдено.</p>
        ) : (
          [...groups.entries()].map(([code, list]) => (
            <details key={code} className="issue-group">
              <summary>
                <span>{CODE_LABEL[code] ?? code}</span>
                <span className="tabular unit-meta">{list.length}</span>
              </summary>
              <ul>
                {list.slice(0, 200).map((issue, i) => (
                  <li key={i}>
                    <span>{issue.message}</span>
                    <span className="cell-sub">{issue.path}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))
        )}
        <p className="unit-meta">
          Готові id для питань без id друкує <code>pnpm ids:suggest &lt;guide&gt;</code>.
        </p>
      </section>
    </div>
  )
}
