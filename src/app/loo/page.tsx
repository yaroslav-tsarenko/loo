import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { t } from '@/i18n'
import { ATTRIBUTE_EMOJI, RANKS, type Attribute } from '@/game'
import { requireUser } from '@/server/auth'
import { myCharacter } from '@/server/game/character'
import { Button } from '@/ui/design/Button'
import { Card } from '@/ui/design/Card'
import { GameIcon } from '@/ui/design/GameIcon'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { AttributeRadar } from '@/ui/game/AttributeRadar'
import { LooCharacter } from '@/ui/game/LooCharacter'
import { Icon } from '@/ui/icons/Icon'

export const metadata: Metadata = { title: 'Мій Loo' }
export const dynamic = 'force-dynamic'

const attrName = (a: Attribute) => t(`game.character.attributes.${a.id}.name`)

function AttributeBar({ a }: { a: Attribute }) {
  return (
    <li className="attr-row" title={t(`game.character.attributes.${a.id}.hint`)}>
      <span className="attr-emoji" aria-hidden="true">
        {ATTRIBUTE_EMOJI[a.id]}
      </span>
      <span className="attr-name">{attrName(a)}</span>
      <ProgressBar value={a.value / 100} size="md" tone={a.level >= 60 ? 'green' : a.level >= 30 ? 'blue' : 'yellow'} label={`${attrName(a)}: ${a.level}`} className="attr-bar" />
      <span className="attr-level tabular">{a.level}</span>
      <span className="attr-hint">{t(`game.character.attributes.${a.id}.hint`)}</span>
    </li>
  )
}

// 🧙 /loo — «Мій Loo»: the evolving character across all courses (form, attributes, skills, evolution timeline).
export default async function LooPage() {
  await requireUser()
  const c = await myCharacter()
  const { rank } = c
  const weak = {
    text: t(`game.character.tips.${c.weakest.id}.text`),
    cta: t(`game.character.tips.${c.weakest.id}.cta`),
    href: t(`game.character.tips.${c.weakest.id}.href`),
  }
  return (
    <div className="page loo-page" data-width="wide">
      <header className="loo-hero lu-card" data-pad="lg">
        <div className="loo-hero-art">
          <LooCharacter step={rank.rank.index} mood="happy" size={200} label={rank.rank.title} />
        </div>
        <div className="loo-hero-text">
          <p className="loo-eyebrow">{t('game.character.title')}</p>
          <h1 className="loo-title">
            <span aria-hidden="true">{rank.rank.emoji}</span> {rank.rank.title}
          </h1>
          <p className="loo-lead">{t('game.character.lead')}</p>
          <p className="loo-meta">
            <span className="loo-step tabular">{t('game.character.step', { n: rank.rank.index + 1, total: RANKS.length })}</span>
            <span className="loo-power tabular" title={t('game.character.powerHint')}>
              ⚔️ {t('game.character.power')}: <strong>{c.snapshot.power}</strong>
            </span>
          </p>
          {rank.next ? (
            <div className="loo-next">
              <ProgressBar value={rank.progress} tone="purple" size="lg" label={t('game.character.nextStep', { rank: rank.next.title })} />
              <p className="loo-gaps">
                {t('game.character.nextStep', { rank: `${rank.next.emoji} ${rank.next.title}` })}:{' '}
                {rank.gaps.map((g, i) => (
                  <span key={g.key} className="loo-gap" data-met={g.have >= g.need ? '' : undefined}>
                    {i > 0 ? ' · ' : ''}
                    {Math.min(g.have, g.need).toLocaleString('uk-UA')}/{g.need.toLocaleString('uk-UA')} {t(`game.ranks.reqs.${g.key}`)}
                  </span>
                ))}
                {rank.next.gems > 0 ? <span className="loo-gap-gems"> · +{rank.next.gems} 💎</span> : null}
              </p>
            </div>
          ) : (
            <p className="loo-gaps">{t('game.character.top')}</p>
          )}
        </div>
      </header>

      <h2 className="gsection-title">{t('game.character.attributesTitle')}</h2>
      <p className="ghead-lead">{t('game.character.attributesLead')}</p>
      <div className="loo-attrs">
        <ul className="attr-list">
          {c.attributes.map((a) => (
            <AttributeBar key={a.id} a={a} />
          ))}
        </ul>
        <Card variant="raised" className="attr-radar-card">
          <AttributeRadar attributes={c.attributes} label={t('game.character.radar')} />
        </Card>
      </div>

      <div className="loo-sw">
        <Card variant="raised" tone="green" className="loo-sw-card">
          <h3 className="loo-sw-title">💪 {t('game.character.strengthsTitle')}</h3>
          <ol className="loo-sw-list">
            {c.strengths.map((a) => (
              <li key={a.id}>
                <span aria-hidden="true">{ATTRIBUTE_EMOJI[a.id]}</span> {attrName(a)} <span className="tabular">{a.level}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card variant="raised" tone="orange" className="loo-sw-card">
          <h3 className="loo-sw-title">🎯 {t('game.character.weakTitle')}</h3>
          <p className="loo-sw-weak">
            <span aria-hidden="true">{ATTRIBUTE_EMOJI[c.weakest.id]}</span> {attrName(c.weakest)} <span className="tabular">{c.weakest.level}</span>
          </p>
          <p className="loo-sw-tip">{weak.text}</p>
          <Button href={weak.href} size="sm">
            {weak.cta}
          </Button>
        </Card>
      </div>

      <h2 className="gsection-title">
        {t('game.character.skillsTitle')} <span className="gsection-count tabular">{c.skills.length}</span>
      </h2>
      <p className="ghead-lead">
        {t('game.character.skillsLead')} {t('game.character.topics', { n: c.topics.mastered, total: c.topics.total })}
      </p>
      {c.skills.length === 0 ? (
        <p className="empty-note">{t('game.character.skillsEmpty')}</p>
      ) : (
        <ul className="skill-deck">
          {c.skills.map((s) => (
            <li key={s.id} className="skill-card" data-kind={s.kind} style={{ '--power': `${s.power}%` } as CSSProperties}>
              <span className="skill-icon" aria-hidden="true">
                <Icon name={s.icon} size={34} />
              </span>
              <strong className="skill-name">{s.name}</strong>
              <span className="skill-source">
                {s.kind === 'section' ? `👑 ${t('game.character.skillSection')} · ` : ''}
                {s.source}
              </span>
              <span className="skill-power tabular">
                <GameIcon name="bolt" size={16} /> {t('game.character.skillPower', { n: s.power })}
              </span>
              <span className="skill-course">{s.courseTitle}</span>
            </li>
          ))}
        </ul>
      )}

      <h2 className="gsection-title">{t('game.character.timelineTitle')}</h2>
      <p className="ghead-lead">{t('game.character.timelineLead')}</p>
      <ol className="evo-timeline">
        {RANKS.map((step) => {
          const state = step.index < rank.rank.index ? 'reached' : step.index === rank.rank.index ? 'current' : 'locked'
          // the next form is teased by name; later ones stay dark silhouettes
          const teased = state === 'locked' && step.form === rank.next?.form
          return (
            <li key={step.id} className="evo-step" data-state={state} data-tier={step.tier} title={state === 'locked' && !teased ? t('game.character.locked') : step.title}>
              <LooCharacter step={step.index} size={state === 'current' ? 72 : 52} animated={state === 'current'} silhouette={state === 'locked'} />
              <span className="evo-step-title">{state === 'locked' && !teased ? '???' : step.title}</span>
              <span className="evo-step-sub">{state === 'current' ? t('game.character.current') : state === 'reached' ? t('game.character.reached') : `${step.needs.xp.toLocaleString('uk-UA')} XP`}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
