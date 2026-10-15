'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition, type ReactNode } from 'react'
import { resetProgress, updateSetting, updateVaultPath } from '@/server/actions/settings'
import type { AppSettings } from '@/server/settings'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { applyTheme } from '@/ui/shell/theme'

function Row({ label, hint, htmlFor, children }: { label: string; hint?: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="setting-row">
      <div>
        <label className="setting-label" htmlFor={htmlFor}>
          {label}
        </label>
        {hint ? <p className="cell-sub">{hint}</p> : null}
      </div>
      <div className="setting-control">{children}</div>
    </div>
  )
}

export function SettingsForm({ initial, vaultPath, envVault }: { initial: AppSettings; vaultPath: string; envVault: string }) {
  const router = useRouter()
  const feedback = useFeedback()
  const [values, setValues] = useState(initial)
  const [vault, setVault] = useState(initial.vaultPath ?? '')
  const [vaultMsg, setVaultMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [confirm, setConfirm] = useState('')
  const [resetMsg, setResetMsg] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const save = <K extends Exclude<keyof AppSettings, 'vaultPath'>>(key: K, value: AppSettings[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (key === 'theme') applyTheme(String(value))
    start(async () => {
      await updateSetting(key, value)
      if (key === 'sound' && value !== feedback.sound) feedback.toggleSound()
      router.refresh()
    })
  }

  return (
    <div className="settings">
      <section aria-labelledby="s-vault">
        <h2 id="s-vault" className="section-title rule-title">
          Vault
        </h2>
        <Row label="Шлях до Obsidian vault" htmlFor="vault" hint={`Зараз: ${vaultPath}. Порожнє поле — значення з .env.local (${envVault}).`}>
          <form
            className="inline-form"
            onSubmit={(e) => {
              e.preventDefault()
              start(async () => {
                const r = await updateVaultPath(vault)
                setVaultMsg({ ok: r.ok, text: r.message })
                if (r.ok) router.refresh()
              })
            }}
          >
            <input id="vault" className="text-input" value={vault} onChange={(e) => setVault(e.target.value)} placeholder="~/Documents/Obsidian Vault" spellCheck={false} />
            <button type="submit" className="ui-button" disabled={pending}>
              Зберегти
            </button>
          </form>
          {vaultMsg ? (
            <p className="setting-msg" data-ok={vaultMsg.ok ? '' : undefined} role="status">
              {vaultMsg.text}
            </p>
          ) : null}
        </Row>
      </section>

      <section aria-labelledby="s-look">
        <h2 id="s-look" className="section-title rule-title">
          Вигляд і звук
        </h2>
        <Row label="Тема">
          <div className="segmented" role="radiogroup" aria-label="Тема">
            {(
              [
                ['system', 'Як у системі'],
                ['light', 'Світла'],
                ['dark', 'Темна'],
              ] as const
            ).map(([v, l]) => (
              <label key={v}>
                <input type="radio" name="theme" checked={values.theme === v} onChange={() => save('theme', v)} />
                <span>{l}</span>
              </label>
            ))}
          </div>
        </Row>
        <Row label="Звуки" hint="Правильна відповідь, помилка, переворот картки, новий рівень, ачівка">
          <label className="check">
            <input type="checkbox" checked={values.sound} onChange={(e) => save('sound', e.target.checked)} />
            <span>{values.sound ? 'Увімкнено' : 'Вимкнено'}</span>
          </label>
        </Row>
        <Row label="Вібрація" hint="Тактильний відгук на телефоні: відповіді, XP, комбо, кнопки (на iPhone — iOS 18+)">
          <label className="check">
            <input type="checkbox" checked={values.haptics} onChange={(e) => save('haptics', e.target.checked)} />
            <span>{values.haptics ? 'Увімкнено' : 'Вимкнено'}</span>
          </label>
        </Row>
        <Row label="Гучність" htmlFor="volume">
          <div className="range-row">
            <input
              id="volume"
              type="range"
              min={0}
              max={100}
              step={5}
              value={Math.round(values.volume * 100)}
              onChange={(e) => setValues((v) => ({ ...v, volume: Number(e.target.value) / 100 }))}
              onPointerUp={() => save('volume', values.volume)}
              onKeyUp={() => save('volume', values.volume)}
            />
            <span className="tabular">{Math.round(values.volume * 100)}%</span>
            <button type="button" className="ui-link as-button" onClick={() => feedback.play('correct')}>
              Прослухати
            </button>
          </div>
        </Row>
      </section>

      <section aria-labelledby="s-study">
        <h2 id="s-study" className="section-title rule-title">
          Навчання
        </h2>
        <Row label="Денна мета" hint="Скільки відповідей (картки + тести + задачі) зараховує день у серію" htmlFor="goal">
          <NumberField id="goal" value={values.dailyGoal} min={1} max={300} onCommit={(n) => save('dailyGoal', n)} />
        </Row>
        <Row label="Нових карток на день" htmlFor="newcards">
          <NumberField id="newcards" value={values.newCardsPerDay} min={1} max={300} onCommit={(n) => save('newCardsPerDay', n)} />
        </Row>
        <Row label="Розмір сесії карток за замовчуванням" htmlFor="session">
          <NumberField id="session" value={values.sessionSize} min={5} max={200} onCommit={(n) => save('sessionSize', n)} />
        </Row>
      </section>

      <section aria-labelledby="s-data">
        <h2 id="s-data" className="section-title rule-title">
          Дані
        </h2>
        <Row label="Експорт прогресу" hint="Усі відповіді, розклад карток, помилки, XP і ачівки в одному JSON">
          <a className="ui-button" data-variant="ghost" href="/api/export" download>
            Завантажити JSON
          </a>
        </Row>
        <Row label="Скинути прогрес" hint="Видаляє всю історію навчання. Vault не змінюється. Дію не можна скасувати." htmlFor="reset">
          <form
            className="inline-form"
            onSubmit={(e) => {
              e.preventDefault()
              start(async () => {
                const r = await resetProgress(confirm)
                setResetMsg(r.ok ? 'Прогрес скинуто.' : 'Щоб підтвердити, введіть слово СКИНУТИ.')
                if (r.ok) {
                  setConfirm('')
                  router.refresh()
                }
              })
            }}
          >
            <input id="reset" className="text-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Введіть СКИНУТИ" autoComplete="off" />
            <button type="submit" className="ui-button danger-button" disabled={confirm !== 'СКИНУТИ' || pending}>
              Скинути
            </button>
          </form>
          {resetMsg ? (
            <p className="setting-msg" role="status">
              {resetMsg}
            </p>
          ) : null}
        </Row>
      </section>
    </div>
  )
}

function NumberField({ id, value, min, max, onCommit }: { id: string; value: number; min: number; max: number; onCommit: (n: number) => void }) {
  const [text, setText] = useState(String(value))
  const commit = () => {
    const n = Math.round(Number(text))
    if (Number.isFinite(n) && n >= min && n <= max) onCommit(n)
    else setText(String(value))
  }
  return (
    <input
      id={id}
      className="text-input number-input tabular"
      inputMode="numeric"
      value={text}
      onChange={(e) => setText(e.target.value.replace(/[^\d]/g, ''))}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit()
      }}
    />
  )
}
