'use client'

import { useState } from 'react'
import { t } from '@/i18n'
import { rankAt, stepsBetween } from '@/game'
import { evolutionSeen } from '@/server/actions/character'
import { Button } from '@/ui/design/Button'
import { GameIcon } from '@/ui/design/GameIcon'
import { LooEvolve } from '@/ui/design/mascot/LooEvolve'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'

// Full-screen rank-up moment, once per new step of «шлях воїна» (the layout renders it while evo_step > evo_seen).
// The mascot's <LooEvolve> plays the cutscene (Loo grows on the early steps); then the new title, the gems, the way out.
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
  const newRank = prev.rank !== next.rank
  const gems = stepsBetween(from, to).reduce((sum, step) => sum + step.gems, 0)
  return (
    <div className="evo-moment lu-scheme-dark" data-phase={done ? 'reveal' : 'charge'} role="dialog" aria-modal="true" aria-labelledby="evo-title">
      <div className="evo-stage">
        <div className="evo-rays" aria-hidden="true" />
        <LooEvolve
          from={prev.stage}
          to={next.stage}
          label={t('game.evolution.label', { from: prev.title, to: next.title })}
          size={220}
          onDone={() => {
            setDone(true)
            feedback.play('level')
          }}
        />
      </div>
      <p className="evo-eyebrow">{!done ? t('game.evolution.charging') : prev.stage !== next.stage ? t('game.evolution.grew') : newRank ? t('game.evolution.newRank') : t('game.evolution.newTier')}</p>
      <h2 className="evo-title" id="evo-title">
        {done ? next.title : prev.title}
      </h2>
      {done ? (
        <>
          {gems > 0 ? (
            <p className="evo-gems">
              <GameIcon name="gem" size={28} /> {t('game.evolution.gems', { n: gems })}
            </p>
          ) : null}
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
