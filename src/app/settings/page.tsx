import type { Metadata } from 'next'
import Link from 'next/link'
import { defaultVaultConfig } from '@/content/config'
import { courseKind } from '@/course'
import { isAdmin } from '@/server/auth'
import { grantTestBucks } from '@/server/actions/admin'
import { Button } from '@/ui/design/Button'
import { getContent } from '@/server/content'
import { myEnrollments } from '@/server/courses/enrollment'
import { listCourses } from '@/server/courses/registry'
import { readSettings } from '@/server/settings'
import { showsAccentSetting } from '@/ui/lang/speech/voices'
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
  'block-warning': 'Зауваги до мовних блоків',
}

export default async function SettingsPage() {
  const snapshot = await getContent()
  const [settings, admin, enrolled, courses] = await Promise.all([readSettings(), isAdmin(), myEnrollments(), listCourses()])
  // «Акцент англійської» only matters for English: hidden when every enrolled language course has another target
  const mine = new Set(enrolled.map((e) => e.courseId))
  const targets = courses.filter((c) => mine.has(c.id) && courseKind(c.meta) === 'language').map((c) => c.meta.target ?? c.meta.language)
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
      <SettingsForm initial={settings} vaultPath={snapshot.config.vaultPath} envVault={defaultVaultConfig().vaultPath} admin={admin} accent={showsAccentSetting(targets)} />
      {admin ? (
        <section aria-labelledby="s-admin-bucks">
          <h2 id="s-admin-bucks" className="section-title rule-title">
            Адмін · тестові бакси
          </h2>
          <p className="unit-meta">Нараховує бакси лише на твій акаунт — щоб перевірити магазин і спорядження.</p>
          <form action={grantTestBucks} className="admin-grant">
            <input className="text-input number-input tabular" type="number" name="amount" min={1} max={10000} defaultValue={10000} aria-label="Скільки баксів" />
            <Button type="submit">Нарахувати</Button>
          </form>
        </section>
      ) : null}
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
