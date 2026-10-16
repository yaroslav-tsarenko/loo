'use client'

import { VizGlyph } from '../engine/Panel'
import type { HttpMsg } from './http'

function headersWord(n: number): string {
  const d = n % 10
  const dd = n % 100
  if (d === 1 && dd !== 11) return 'заголовок'
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return 'заголовки'
  return 'заголовків'
}

// Request / response card: start line, headers (new / ok / bad highlighted), body.
export function HttpMessage({ msg, active, compact }: { msg: HttpMsg; active?: boolean; compact?: boolean }) {
  return (
    <div className="viz-http" data-dir={msg.dir} data-active={active ? '' : undefined}>
      <div className="viz-http-line">
        <span className="viz-http-dir" aria-hidden="true">
          <VizGlyph icon={msg.dir === 'req' ? 'pi:PiUploadSimpleBold' : 'pi:PiDownloadSimpleBold'} size={14} />
        </span>
        <code>{msg.line}</code>
        {msg.tag ? <span className="viz-badge" data-tone="accent">{msg.tag}</span> : null}
        {compact && msg.headers.length > 0 ? <span className="viz-http-more">+{msg.headers.length} {headersWord(msg.headers.length)}</span> : null}
      </div>
      {compact ? null : (
        <>
          <ul className="viz-http-hdrs">
            {msg.headers.map((h) => (
              <li key={h.name} data-tone={h.tone}>
                <code>
                  <span className="viz-http-name">{h.name}:</span> {h.value}
                </code>
              </li>
            ))}
            {msg.missing?.map((name) => (
              <li key={name} data-tone="missing">
                <code>
                  <span className="viz-http-name">{name}</span>
                </code>{' '}
                — відсутній
              </li>
            ))}
          </ul>
          {msg.body ? <code className="viz-http-body">{msg.body}</code> : null}
        </>
      )}
    </div>
  )
}
