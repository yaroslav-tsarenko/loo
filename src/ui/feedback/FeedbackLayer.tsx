'use client'

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import type { Toast } from './FeedbackProvider'

const LIFETIME: Record<string, number> = {
  xp: 1600,
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
  let eyebrow = ''
  let title = ''
  let body: string | null = null
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
      eyebrow = '🏆 Місію дня виконано'
      title = `+${effect.bonusXp} XP бонусу`
      body = `${effect.budget} хв чистого прогресу. Серія 🔥 збережена`
      tone = 'gold'
      break
    default:
      return null
  }
  return (
    <m.div layout className="toast" data-tone={tone} role="status" {...motionProps}>
      <button type="button" className="toast-close" aria-label="Закрити" onClick={() => onDismiss(toast.id)}>
        ×
      </button>
      <span className="eyebrow">{eyebrow}</span>
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
