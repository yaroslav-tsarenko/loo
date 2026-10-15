import type { ReactNode } from 'react'
import { PiPlayFill } from 'react-icons/pi'
import { Button } from '@/ui/design/Button'
import type { Tone } from '@/ui/design/cx'

export interface QueueRow {
  label: string
  value: ReactNode
  tone: Tone
}

interface Props {
  eyebrow: string
  count: number
  rows: QueueRow[]
  start: { href: string; label: string } | null
  empty: ReactNode
  note?: ReactNode
  art?: ReactNode
}

// Right-hand "ready to play" card of the quiz / review hubs.
export function QueueCard({ eyebrow, count, rows, start, empty, note, art }: Props) {
  return (
    <aside className="queue">
      <div className="queue-top">
        <div>
          <span className="queue-eyebrow">{eyebrow}</span>
          <p className="queue-num tabular">{count}</p>
        </div>
        {art ? <span className="queue-art">{art}</span> : null}
      </div>
      <dl className="queue-split">
        {rows.map((r) => (
          <div key={r.label} data-tone={r.tone}>
            <dt>
              <span className="queue-dot" aria-hidden="true" />
              {r.label}
            </dt>
            <dd className="tabular">{r.value}</dd>
          </div>
        ))}
      </dl>
      {start ? (
        <Button href={start.href} size="lg" block icon={<PiPlayFill size={20} />} className="queue-start">
          {start.label}
        </Button>
      ) : (
        <p className="queue-empty">{empty}</p>
      )}
      {note ? <p className="queue-note">{note}</p> : null}
    </aside>
  )
}
