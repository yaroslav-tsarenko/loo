'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useTransition, type FormEvent } from 'react'
import { PiCalendarBlankBold } from 'react-icons/pi'
import { Button } from '@/ui/design/Button'

// Period controls for the admin analytics pages: presets, a custom from–to range, granularity and «compare». Every
// change rewrites the URL (the pages render from query params); while the server renders, the page keeps its frame
// at reduced opacity (data-pending on #ana-root) instead of flashing a skeleton.

export interface PeriodPickerProps {
  presets: Array<{ id: string; label: string }>
  range: string
  // the current period's first and last day (YYYY-MM-DD), for the date inputs
  fromDay: string
  toDay: string
  today: string
  gran?: { value: 'hour' | 'day'; auto: boolean; hourly: boolean }
  compare?: boolean
}

export function PeriodPicker({ presets, range, fromDay, toDay, today, gran, compare }: PeriodPickerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const [custom, setCustom] = useState(range === 'custom')
  const [from, setFrom] = useState(fromDay)
  const [to, setTo] = useState(toDay)

  useEffect(() => {
    document.getElementById('ana-root')?.toggleAttribute('data-pending', pending)
  }, [pending])

  const go = (patch: Record<string, string | null>) => {
    // the live URL (the chart's metric tabs rewrite ?metric= without a navigation)
    const next = new URLSearchParams(window.location.search)
    next.delete('before')
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) next.delete(k)
      else next.set(k, v)
    }
    const qs = next.toString()
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }))
  }

  const pickPreset = (id: string) => {
    setCustom(false)
    go({ range: id, from: null, to: null, gran: null })
  }

  const apply = (e: FormEvent) => {
    e.preventDefault()
    if (!from || !to) return
    go({ range: 'custom', from: from <= to ? from : to, to: from <= to ? to : from, gran: null })
  }

  return (
    <div className="ana-picker" data-pending={pending ? 'true' : undefined}>
      <div className="ana-seg ana-presets" role="group" aria-label="Період">
        {presets.map((p) => (
          <button key={p.id} type="button" className="ana-seg-btn" aria-pressed={!custom && range === p.id} onClick={() => pickPreset(p.id)}>
            {p.label}
          </button>
        ))}
        <button type="button" className="ana-seg-btn" data-on={custom || range === 'custom' ? 'true' : undefined} aria-expanded={custom} aria-controls="ana-custom" onClick={() => setCustom((v) => !v)}>
          <PiCalendarBlankBold aria-hidden="true" />
          Свій
        </button>
      </div>

      {custom ? (
        <form id="ana-custom" className="ana-custom" onSubmit={apply}>
          <label>
            <span>Від</span>
            <input type="date" value={from} max={today} required onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label>
            <span>До</span>
            <input type="date" value={to} max={today} required onChange={(e) => setTo(e.target.value)} />
          </label>
          <Button type="submit" variant="secondary" size="sm">
            Показати
          </Button>
        </form>
      ) : null}

      {gran || compare !== undefined ? (
        <div className="ana-picker-row">
          {gran ? (
            <div className="ana-seg" role="group" aria-label="Крок графіка">
              <button type="button" className="ana-seg-btn" aria-pressed={gran.auto} onClick={() => go({ gran: null })}>
                Авто
              </button>
              <button type="button" className="ana-seg-btn" aria-pressed={!gran.auto && gran.value === 'hour'} disabled={!gran.hourly} onClick={() => go({ gran: 'hour' })}>
                Години
              </button>
              <button type="button" className="ana-seg-btn" aria-pressed={!gran.auto && gran.value === 'day'} onClick={() => go({ gran: 'day' })}>
                Дні
              </button>
            </div>
          ) : null}
          {compare !== undefined ? (
            <label className="ana-toggle">
              <input type="checkbox" checked={compare} onChange={(e) => go({ cmp: e.target.checked ? null : '0' })} />
              <span>Порівняти з попереднім періодом</span>
            </label>
          ) : null}
          {pending ? (
            <span className="ana-pending" role="status">
              Оновлюю…
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
