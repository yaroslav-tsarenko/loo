import type { Metadata } from 'next'
import { defaultVaultConfig } from '@/content/config'
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
  const settings = await readSettings()
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
          Прогрес зберігається локально в <code>.data/study.db</code>. Vault лише читається: апка ніколи в нього не пише.
        </p>
      </header>
      <SettingsForm initial={settings} vaultPath={snapshot.config.vaultPath} envVault={defaultVaultConfig().vaultPath} />
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
