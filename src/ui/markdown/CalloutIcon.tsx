import { CircleCheck, CircleX, FlaskConical, Info, KeyRound, Lightbulb, MessagesSquare, OctagonAlert, Quote, Star, TriangleAlert, Zap, type LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  alert: TriangleAlert,
  star: Star,
  flask: FlaskConical,
  messages: MessagesSquare,
  octagon: OctagonAlert,
  info: Info,
  check: CircleCheck,
  x: CircleX,
  key: KeyRound,
  quote: Quote,
  zap: Zap,
}

export function CalloutIcon({ name }: { name: string }) {
  const Icon = ICONS[name] ?? Info
  return (
    <span className="callout-icon" aria-hidden="true">
      <Icon size={17} strokeWidth={2.2} />
    </span>
  )
}
