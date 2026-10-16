import { levelTag } from '@/game/evolution'
import { Pill } from '@/ui/design/Badge'
import type { Tone } from '@/ui/design/cx'

/** Exercise difficulty tag (plain text from levelTag). `level` is the raw level id. */
export function LevelPill({ level, tone, className }: { level: string; tone?: Tone; className?: string }) {
  return (
    <Pill size="sm" tone={tone} className={className}>
      {levelTag(level)}
    </Pill>
  )
}
