'use client'

import { PiCheckBold, PiHourglassFill, PiWarningFill, PiXBold } from 'react-icons/pi'
import { Pill } from '@/ui/design/Badge'
import type { Translate } from '@/i18n'
import { useT } from '@/i18n/react'
import type { RunReport } from './runner'

interface Props {
  report: RunReport | null
  running: boolean
  stuckOn: string | null
}

function summary(report: RunReport, stuckOn: string | null, t: Translate): string {
  const passed = report.tests.filter((r) => r.ok).length
  switch (report.status) {
    case 'passed':
      return `${t('task.report.passed')} 🎉`
    case 'failed':
      return t('task.report.failed', { passed, total: report.tests.length })
    case 'timeout':
      return `${report.error ?? t('task.report.timeout')}${stuckOn ? ` ${t('task.report.stuck', { name: stuckOn })}` : ''}`
    default:
      return report.error ?? t('task.report.error')
  }
}

// Checklist of tests: a green/red chip per row, plus a score pill.
export function TestReport({ report, running, stuckOn }: Props) {
  const t = useT()
  if (running && !report) {
    return (
      <div className="test-report" data-status="running" role="status">
        <p className="test-summary">
          <span className="test-chip" data-ok="wait" aria-hidden="true">
            <PiHourglassFill />
          </span>
          {t('task.report.running')}
        </p>
      </div>
    )
  }
  if (!report) return null
  const passed = report.tests.filter((r) => r.ok).length
  return (
    <div className="test-report" data-status={report.status} role="status" aria-live="polite">
      <p className="test-summary">
        {report.status === 'error' || report.status === 'timeout' ? (
          <span className="test-chip" data-ok="no" aria-hidden="true">
            <PiWarningFill />
          </span>
        ) : null}
        <span className="test-summary-text">{summary(report, stuckOn, t)}</span>
        {report.tests.length > 0 ? (
          <Pill size="sm" tone={report.status === 'passed' ? 'green' : 'red'} solid className="tabular">
            {passed}/{report.tests.length}
          </Pill>
        ) : null}
        <span className="test-ms tabular">{t('task.report.ms', { ms: Math.round(report.ms) })}</span>
      </p>
      {report.tests.length > 0 ? (
        <ol className="test-list">
          {report.tests.map((r, i) => (
            <li key={i} className="test-row" data-ok={r.ok ? '' : undefined}>
              <span className="test-chip" data-ok={r.ok ? 'yes' : 'no'} role="img" aria-label={r.ok ? t('task.report.ok') : t('task.report.notOk')}>
                {r.ok ? <PiCheckBold /> : <PiXBold />}
              </span>
              <div className="test-body">
                <span className="test-name">{r.name}</span>
                {!r.ok && r.error ? <span className="test-error">{r.error}</span> : null}
                {!r.ok && (r.expected !== undefined || r.received !== undefined) ? (
                  <dl className="test-diff">
                    {r.expected !== undefined ? (
                      <div>
                        <dt>{t('task.report.expected')}</dt>
                        <dd>{r.expected}</dd>
                      </div>
                    ) : null}
                    {r.received !== undefined ? (
                      <div>
                        <dt>{t('task.report.received')}</dt>
                        <dd>{r.received}</dd>
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
          <summary>{t('task.report.console', { n: report.logs.length })}</summary>
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
