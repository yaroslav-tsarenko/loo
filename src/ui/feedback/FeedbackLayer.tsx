'use client'

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import { TIER_MOOD } from '@/progress/achievements/dsl'
import { GameIcon } from '@/ui/design/GameIcon'
import { Loo } from '@/ui/design/mascot/Loo'
import { PixelIcon } from '@/ui/design/PixelIcon'
import { Icon } from '@/ui/icons/Icon'
import type { Toast } from './FeedbackProvider'

const LIFETIME: Record<string, number> = {
  xp: 1600,
  gems: 2200,
  bucks: 2200,
  freeze: 4200,
  league: 5200,
  evolution: 6200,
  'mistake-resolved': 2600,
  'daily-goal': 3600,
  streak: 3600,
  achievement: 5200,
  'level-up': 4200,
  'rank-up': 5200,
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const reduce = useReducedMotion()
  const { effect } = toast
  useEffect(() => {
    const t = window.setTimeout(() => onDismiss(toast.id), LIFETIME[effect.type] ?? 3000)
    return () => window.clearTimeout(t)
  }, [toast.id, effect.type, onDismiss])

  const motionProps = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 14, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
        transition: { type: 'spring' as const, stiffness: 420, damping: 32 },
      }

  if (effect.type === 'xp') {
    return (
      <m.div layout className="toast toast-xp" {...motionProps}>
        +{effect.amount} XP
      </m.div>
    )
  }
  if (effect.type === 'gems') {
    return (
      <m.div layout className="toast toast-xp toast-gems" {...motionProps}>
        +{effect.amount} <GameIcon name="gem" size={18} className="toast-inline-icon" />
      </m.div>
    )
  }
  if (effect.type === 'bucks') {
    return (
      <m.div layout className="toast toast-xp toast-bucks" {...motionProps}>
        +{effect.amount} <PixelIcon name="buck" size={18} className="toast-inline-icon" />
      </m.div>
    )
  }
  let eyebrow = ''
  // small icon before the eyebrow (pixel / game icons, never emoji)
  let mark: ReactNode = null
  let title = ''
  let body: ReactNode = null
  let tone = 'neutral'
  switch (effect.type) {
    case 'level-up':
      eyebrow = 'Новий рівень'
      title = `Рівень ${effect.level}`
      body = effect.rank
      tone = 'accent'
      break
    case 'rank-up':
      eyebrow = 'Новий ранг'
      title = effect.rank
      body = 'Так тримати'
      tone = 'accent'
      break
    case 'achievement':
      eyebrow = 'Ачівка'
      title = effect.title
      body = effect.description
      tone = 'gold'
      break
    case 'mistake-resolved':
      eyebrow = 'Мої помилки'
      title = 'Помилку закрито'
      body = 'Дві правильні відповіді з перервою'
      tone = 'success'
      break
    case 'daily-goal':
      eyebrow = 'Денна мета'
      title = `${effect.goal} з ${effect.goal}`
      body = 'Сьогоднішню мету виконано'
      tone = 'success'
      break
    case 'streak':
      eyebrow = 'Серія'
      title = `${effect.days} ${plural(effect.days, 'день', 'дні', 'днів')} поспіль`
      tone = 'success'
      break
    case 'mission':
      eyebrow = 'Місію дня виконано'
      mark = <Icon name="px:trophy" size={16} />
      title = `+${effect.bonusXp} XP бонусу`
      body = (
        <>
          {effect.budget} хв чистого прогресу. Серія <GameIcon name="fire" size={14} className="toast-inline-icon" /> збережена
        </>
      )
      tone = 'gold'
      break
    case 'freeze':
      eyebrow = 'Заморозка серії'
      mark = <Icon name="pi:PiSnowflakeFill" size={14} color="var(--lu-blue)" />
      title = effect.days === 1 ? 'Пропущений день заморожено' : `Заморожено днів: ${effect.days}`
      body = 'Серію врятовано — продовжуй!'
      tone = 'accent'
      break
    case 'evolution':
      eyebrow = 'Новий ранг'
      mark = <Icon name="pi:PiSparkleFill" size={14} color="var(--lu-yellow)" />
      title = effect.title
      body =
        effect.gems > 0 ? (
          <>
            +{effect.gems} <GameIcon name="gem" size={14} className="toast-inline-icon" /> · відкрий «Мій Loo»
          </>
        ) : (
          'Відкрий «Мій Loo»'
        )
      tone = 'gold'
      break
    case 'league':
      eyebrow = 'Ліга'
      mark = <Icon name="px:trophy" size={16} />
      title = effect.result === 'promoted' ? 'Підвищення!' : effect.result === 'demoted' ? 'Ліга нижче' : 'Ліга збережена'
      body = `Місце ${effect.rank} минулого тижня`
      tone = effect.result === 'promoted' ? 'gold' : 'neutral'
      break
    default:
      return null
  }
  // Achievements: Loo celebrates by tier (bronze happy · silver cheer · gold fire).
  const loo = effect.type === 'achievement' ? <Loo mood={TIER_MOOD[effect.tier ?? 'bronze']} size={44} decorative className="toast-loo" /> : null
  return (
    <m.div layout className="toast" data-tone={tone} data-loo={loo ? '' : undefined} role="status" {...motionProps}>
      {loo}
      <button type="button" className="toast-close" aria-label="Закрити" onClick={() => onDismiss(toast.id)}>
        ×
      </button>
      <span className="eyebrow">
        {mark} {eyebrow}
      </span>
      <strong className="toast-title">{title}</strong>
      {body ? <span className="toast-body">{body}</span> : null}
    </m.div>
  )
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export function FeedbackLayer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="toast-stack" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
          ))}
        </AnimatePresence>
      </div>
    </LazyMotion>
  )
}
