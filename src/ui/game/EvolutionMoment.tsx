'use client'

import { useState } from 'react'
import { t } from '@/i18n'
import { rankAt, stepsBetween } from '@/game'
import { evolutionSeen } from '@/server/actions/character'
import { Button } from '@/ui/design/Button'
import { LooEvolve } from '@/ui/design/mascot/LooEvolve'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'

// ✨ Full-screen «Loo evolves» moment, once per new step (the layout renders it while evo_step > evo_seen).
// The mascot's <LooEvolve> plays the cutscene; then the new title, the 💎 reward and the way out.
export function EvolutionMoment({ from, to }: { from: number; to: number }) {
  const feedback = useFeedback()
  const [done, setDone] = useState(false)
  const [open, setOpen] = useState(true)
  const next = rankAt(to)
  const prev = rankAt(from)
  if (!open) return null
  const close = () => {
    setOpen(false)
    void evolutionSeen({ step: to }).catch(() => {})
  }
  const newForm = prev.form !== next.form
  const gems = stepsBetween(from, to).reduce((sum, step) => sum + step.gems, 0)
  return (
    <div className="evo-moment" data-phase={done ? 'reveal' : 'charge'} role="dialog" aria-modal="true" aria-labelledby="evo-title">
      <div className="evo-stage">
        <div className="evo-rays" aria-hidden="true" />
        <LooEvolve
          from={prev.form}
          to={next.form}
          fromTier={prev.form === 'legendary' ? undefined : prev.tier}
          toTier={next.form === 'legendary' ? undefined : next.tier}
          size={220}
          onDone={() => {
            setDone(true)
            feedback.play('level')
          }}
        />
      </div>
      <p className="evo-eyebrow">{!done ? t('game.evolution.charging') : newForm ? t('game.evolution.newForm') : t('game.evolution.newTier')}</p>
      <h2 className="evo-title" id="evo-title">
        {done ? (
          <>
            <span aria-hidden="true">{next.emoji}</span> {next.title}
          </>
        ) : (
          prev.title
        )}
      </h2>
      {done ? (
        <>
          {gems > 0 ? <p className="evo-gems">{t('game.evolution.gems', { n: gems })}</p> : null}
          <div className="evo-actions">
            <Button size="lg" href="/loo" onClick={close}>
              {t('game.evolution.open')}
            </Button>
            <Button size="lg" variant="ghost" onClick={close}>
              {t('game.evolution.continue')}
            </Button>
          </div>
        </>
      ) : null}
    </div>
  )
}
