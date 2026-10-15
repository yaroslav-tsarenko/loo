'use client'

import type { RunReport } from './runner'

interface Props {
  report: RunReport | null
  running: boolean
  stuckOn: string | null
}

function summary(report: RunReport, stuckOn: string | null): string {
  const passed = report.tests.filter((t) => t.ok).length
  switch (report.status) {
    case 'passed':
      return `🎉 Усі тести пройдено · ${passed}/${report.tests.length}`
    case 'failed':
      return `❌ Пройдено ${passed} з ${report.tests.length}`
    case 'timeout':
      return `${report.error ?? '⏱️ Таймаут'}${stuckOn ? ` Зависло на «${stuckOn}»` : ''}`
    default:
      return `💥 ${report.error ?? 'Помилка'}`
  }
}

export function TestReport({ report, running, stuckOn }: Props) {
  if (running && !report) {
    return (
      <div className="test-report" data-status="running" role="status">
        <p className="test-summary">⏳ Запускаю тести…</p>
      </div>
    )
  }
  if (!report) return null
  return (
    <div className="test-report" data-status={report.status} role="status" aria-live="polite">
      <p className="test-summary">
        {summary(report, stuckOn)}
        <span className="test-ms tabular">{Math.round(report.ms)} мс</span>
      </p>
      {report.tests.length > 0 ? (
        <ol className="test-list">
          {report.tests.map((t, i) => (
            <li key={i} className="test-row" data-ok={t.ok ? '' : undefined}>
              <span className="test-mark" aria-label={t.ok ? 'пройдено' : 'не пройдено'}>
                {t.ok ? '✅' : '❌'}
              </span>
              <div className="test-body">
                <span className="test-name">{t.name}</span>
                {!t.ok && t.error ? <span className="test-error">{t.error}</span> : null}
                {!t.ok && (t.expected !== undefined || t.received !== undefined) ? (
                  <dl className="test-diff">
                    {t.expected !== undefined ? (
                      <div>
                        <dt>Очікувалось</dt>
                        <dd>{t.expected}</dd>
                      </div>
                    ) : null}
                    {t.received !== undefined ? (
                      <div>
                        <dt>Отримано</dt>
                        <dd>{t.received}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      ) : null}
      {report.logs.length > 0 ? (
        <details className="test-console" open>
          <summary>Консоль · {report.logs.length}</summary>
          <pre>
            {report.logs.map((l, i) => (
              <span key={i} className="test-log" data-level={l.level}>
                {l.text}
                {'\n'}
              </span>
            ))}
          </pre>
        </details>
      ) : null}
    </div>
  )
}
