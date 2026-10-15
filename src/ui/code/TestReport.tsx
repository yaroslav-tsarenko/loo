'use client'

import { PiCheckBold, PiHourglassFill, PiWarningFill, PiXBold } from 'react-icons/pi'
import { Pill } from '@/ui/design/Badge'
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
      return `Усі тести пройдено 🎉`
    case 'failed':
      return `Пройдено ${passed} з ${report.tests.length}`
    case 'timeout':
      return `${report.error ?? 'Таймаут'}${stuckOn ? ` Зависло на «${stuckOn}»` : ''}`
    default:
      return report.error ?? 'Помилка'
  }
}

// Checklist of tests: a green/red chip per row, plus a score pill.
export function TestReport({ report, running, stuckOn }: Props) {
  if (running && !report) {
    return (
      <div className="test-report" data-status="running" role="status">
        <p className="test-summary">
          <span className="test-chip" data-ok="wait" aria-hidden="true">
            <PiHourglassFill />
          </span>
          Запускаю тести…
        </p>
      </div>
    )
  }
  if (!report) return null
  const passed = report.tests.filter((t) => t.ok).length
  return (
    <div className="test-report" data-status={report.status} role="status" aria-live="polite">
      <p className="test-summary">
        {report.status === 'error' || report.status === 'timeout' ? (
          <span className="test-chip" data-ok="no" aria-hidden="true">
            <PiWarningFill />
          </span>
        ) : null}
        <span className="test-summary-text">{summary(report, stuckOn)}</span>
        {report.tests.length > 0 ? (
          <Pill size="sm" tone={report.status === 'passed' ? 'green' : 'red'} solid className="tabular">
            {passed}/{report.tests.length}
          </Pill>
        ) : null}
        <span className="test-ms tabular">{Math.round(report.ms)} мс</span>
      </p>
      {report.tests.length > 0 ? (
        <ol className="test-list">
          {report.tests.map((t, i) => (
            <li key={i} className="test-row" data-ok={t.ok ? '' : undefined}>
              <span className="test-chip" data-ok={t.ok ? 'yes' : 'no'} role="img" aria-label={t.ok ? 'пройдено' : 'не пройдено'}>
                {t.ok ? <PiCheckBold /> : <PiXBold />}
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
