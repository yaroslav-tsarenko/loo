import { Ban, ChevronDown, CircleDot, Filter, MonitorSmartphone, MousePointer2, RotateCw, Settings } from 'lucide-react'
import type { ReactNode } from 'react'
import { HighlightLine } from '@/ui/viz/engine/CodeView'

export function Caret() {
  return <span aria-hidden="true" className="th-caret" />
}

export function Code({ text }: { text: string }) {
  return (
    <code className="sc-code">
      <HighlightLine text={text} />
    </code>
  )
}

const TABS = ['Elements', 'Console', 'Sources', 'Network', 'Performance', 'Memory'] as const
export type DevToolsTab = (typeof TABS)[number]

// Chrome DevTools chrome: tab strip + optional toolbar; the panel body is the child.
export function DevTools({ tab, toolbar, children, errors = 0 }: { tab: DevToolsTab; toolbar?: ReactNode; children: ReactNode; errors?: number }) {
  return (
    <div className="dt">
      <div className="dt-tabs">
        <span className="dt-icon" aria-hidden="true">
          <MousePointer2 size={14} />
        </span>
        <span className="dt-icon" aria-hidden="true">
          <MonitorSmartphone size={14} />
        </span>
        <span className="dt-sep" />
        {TABS.map((t) => (
          <span key={t} className="dt-tab" data-on={t === tab ? '' : undefined}>
            {t}
          </span>
        ))}
        <span className="dt-grow" />
        {errors > 0 ? (
          <span className="dt-errcount">
            <span className="dt-errdot" />
            {errors}
          </span>
        ) : null}
        <span className="dt-icon" aria-hidden="true">
          <Settings size={14} />
        </span>
      </div>
      {toolbar ? <div className="dt-toolbar">{toolbar}</div> : null}
      <div className="dt-body">{children}</div>
    </div>
  )
}

export function ToolIcon({ kind, demo, on }: { kind: 'record' | 'clear' | 'reload' | 'filter' | 'down'; demo?: string; on?: boolean }) {
  const icon =
    kind === 'record' ? <CircleDot size={15} /> : kind === 'clear' ? <Ban size={14} /> : kind === 'reload' ? <RotateCw size={14} /> : kind === 'filter' ? <Filter size={13} /> : <ChevronDown size={13} />
  return (
    <span className="dt-tool" data-kind={kind} data-on={on ? '' : undefined} data-demo={demo}>
      {icon}
    </span>
  )
}

// A slim strip of the inspected page above docked DevTools.
export function PageStrip({ children }: { children: ReactNode }) {
  return <div className="sc-page">{children}</div>
}
