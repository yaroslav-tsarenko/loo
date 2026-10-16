'use client'

import { useState } from 'react'
import { PiArrowRightBold, PiFireFill, PiInfoFill, PiLightningFill } from 'react-icons/pi'
import { Button, IconButton } from '@/ui/design/Button'
import { Card } from '@/ui/design/Card'
import { burst } from '@/ui/design/Confetti'
import { CountUp } from '@/ui/design/CountUp'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { Ring } from '@/ui/design/Ring'
import { Sheet } from '@/ui/design/Sheet'
import { StatChip } from '@/ui/design/StatChip'
import { Tabs } from '@/ui/design/Tabs'
import { Toggle } from '@/ui/design/Toggle'
import { Popover, Tooltip } from '@/ui/design/Tooltip'
import { LooEvolve } from '@/ui/design/mascot/LooEvolve'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { LOO_FORM_LABEL, LOO_FORMS, type LooForm } from '@/ui/design/mascot/pixels'

export function ProgressDemo() {
  const [v, setV] = useState(0.35)
  return (
    <div className="ds-stack">
      <ProgressBar value={v} label="Демо-прогрес" valueText={`${Math.round(v * 100)}%`} size="lg" />
      <div className="ds-row">
        <Ring value={v} label="Демо-кільце" size={72}>
          <CountUp value={Math.round(v * 100)} />
        </Ring>
        <Ring value={v} label="Демо-кільце" tone="orange" size={56} stroke={6}>
          <PiFireFill size={22} color="var(--lu-orange)" />
        </Ring>
        <Button size="sm" variant="ghost" onClick={() => setV((x) => Math.max(0, x - 0.15))}>
          −15%
        </Button>
        <Button size="sm" onClick={() => setV((x) => Math.min(1, x + 0.15))}>
          +15%
        </Button>
      </div>
    </div>
  )
}

export function StatsDemo() {
  const [n, setN] = useState({ streak: 6, gems: 120, hearts: 4, xp: 1280 })
  return (
    <div className="ds-stack">
      <div className="ds-row">
        <StatChip kind="streak" value={n.streak} />
        <StatChip kind="streak" value={n.streak} active={false} />
        <StatChip kind="gems" value={n.gems} />
        <StatChip kind="hearts" value={n.hearts} />
        <StatChip kind="xp" value={n.xp} />
      </div>
      <div className="ds-row">
        <Button size="sm" variant="secondary" onClick={() => setN((s) => ({ streak: s.streak + 1, gems: s.gems + 25, hearts: Math.max(0, s.hearts - 1), xp: s.xp + 45 }))}>
          Пройти урок
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setN({ streak: 6, gems: 120, hearts: 4, xp: 1280 })}>
          Скинути
        </Button>
      </div>
    </div>
  )
}

export function OverlayDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="ds-row">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Відкрити sheet
      </Button>
      <Tooltip content="Серія: зроби урок сьогодні, щоб не втратити вогник">
        <IconButton label="Що таке серія?" icon={<PiInfoFill size={22} />} variant="ghost" />
      </Tooltip>
      <Popover trigger={<StatChip kind="gems" value={120} />} triggerLabel="Кристали: 120">
        <div className="ds-stack">
          <strong>💎 Кристали</strong>
          <span className="ds-muted">Заробляй за уроки й серії. Витрачай у магазині на заморозку серії та скіни Loo.</span>
          <Button size="sm" block>
            У магазин
          </Button>
        </div>
      </Popover>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Урок завершено!"
        description="+15 XP · ідеальний урок"
        footer={
          <>
            <Button block onClick={() => setOpen(false)}>
              Продовжити
            </Button>
            <Button block variant="ghost" onClick={() => setOpen(false)}>
              Переглянути помилки
            </Button>
          </>
        }
      >
        <LooSays mood="cheer" text="Неймовірно! Ще один крок до рівня Middle 🚀" />
      </Sheet>
    </div>
  )
}

export function TabsToggleDemo() {
  const [sound, setSound] = useState(true)
  return (
    <div className="ds-stack">
      <Tabs
        label="Ліга"
        items={[
          { id: 'week', label: 'Тиждень', icon: <PiLightningFill size={18} />, panel: <p className="ds-muted">Тижнева ліга: топ-7 піднімаються вище.</p> },
          { id: 'friends', label: 'Друзі', panel: <p className="ds-muted">Тут з’являться друзі.</p> },
          { id: 'all', label: 'Усі', panel: <p className="ds-muted">Глобальний рейтинг.</p> },
        ]}
      />
      <Card>
        <Toggle label="Звукові ефекти" description="Клацання, успіх, помилка" checked={sound} onCheckedChange={setSound} />
        <Toggle label="Вібрація" defaultChecked />
        <Toggle label="Режим без сердечок" description="Скоро" disabled />
      </Card>
    </div>
  )
}

export function ConfettiDemo() {
  return (
    <div className="ds-row">
      <Button variant="super" icon={<span aria-hidden="true">🎉</span>} onClick={(e) => burst({ from: e.currentTarget })}>
        Конфетті
      </Button>
      <Button variant="primary" iconEnd={<PiArrowRightBold size={18} />} onClick={() => burst({ count: 160, spread: 1 })}>
        Велике свято
      </Button>
    </div>
  )
}

export function LoadingDemo() {
  const [busy, setBusy] = useState(false)
  return (
    <Button
      loading={busy}
      onClick={() => {
        setBusy(true)
        window.setTimeout(() => setBusy(false), 1500)
      }}
    >
      Перевірити
    </Button>
  )
}

// Pick two forms and replay the evolution cutscene (remounts LooEvolve via key).
export function LooEvolveDemo() {
  const [from, setFrom] = useState<LooForm>('block')
  const [to, setTo] = useState<LooForm>('lamp')
  const [run, setRun] = useState(0)
  const [done, setDone] = useState(0)
  const pick = (value: LooForm, set: (f: LooForm) => void, label: string) => (
    <label className="ds-row ds-tight">
      <span className="ds-muted">{label}</span>
      <select className="ds-select" value={value} onChange={(e) => set(e.target.value as LooForm)}>
        {LOO_FORMS.map((f) => (
          <option key={f} value={f}>
            {LOO_FORM_LABEL[f]}
          </option>
        ))}
      </select>
    </label>
  )
  return (
    <div className="ds-row ds-loo-evolve-demo">
      <LooEvolve key={run} from={from} to={to} size={140} confetti={run > 0} onDone={() => setDone((n) => n + 1)} />
      <div className="ds-stack">
        {pick(from, setFrom, 'з')}
        {pick(to, setTo, 'у')}
        <Button size="sm" onClick={() => setRun((n) => n + 1)}>
          Еволюція!
        </Button>
        <span className="ds-muted" aria-live="polite">
          onDone × {done}
        </span>
      </div>
    </div>
  )
}
