'use client'

import { useEffect, useState } from 'react'
import { PiShareFatFill } from 'react-icons/pi'
import { t } from '@/i18n'
import { Button } from '@/ui/design/Button'
import { Confetti } from '@/ui/design/Confetti'
import { formatLeft, useClock } from '@/ui/shell/clock'

// Time left in the league week (Kyiv Monday 00:00).
export function WeekCountdown({ end }: { end: number }) {
  const now = useClock(60_000)
  return <span className="league-ends tabular">{now > 0 ? t('game.leagues.endsIn', { left: formatLeft(end - now) }) : ' '}</span>
}

// Confetti once per finished week when last week ended in a promotion.
export function PromotionConfetti({ week }: { week: string }) {
  const [fire, setFire] = useState(0)
  useEffect(() => {
    const key = `league-celebrated:${week}`
    try {
      if (localStorage.getItem(key)) return
      localStorage.setItem(key, '1')
    } catch {
      return
    }
    const id = window.setTimeout(() => setFire(1), 300)
    return () => window.clearTimeout(id)
  }, [week])
  return <Confetti trigger={fire} count={160} />
}

// «Запросити друзів»: the system share sheet, or the link copied to the clipboard.
export function InviteButton() {
  const [copied, setCopied] = useState(false)
  const invite = async () => {
    const url = `${window.location.origin}/`
    const text = 'Вчимося разом у Levelup — змагаймось у тижневій лізі!'
    try {
      if (navigator.share) await navigator.share({ title: 'Levelup', text, url })
      else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        setCopied(true)
      }
    } catch {
      // dismissed share sheet
    }
  }
  return (
    <Button variant="secondary" size="lg" onClick={() => void invite()} icon={<PiShareFatFill size={20} />}>
      {copied ? t('game.leagues.inviteCopied') : t('game.leagues.invite')}
    </Button>
  )
}
