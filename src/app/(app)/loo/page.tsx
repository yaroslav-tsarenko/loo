import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { PiSwordFill } from 'react-icons/pi'
import { t } from '@/i18n'
import { ATTRIBUTE_ICON, courseRankIcon, courseRankLabel, GEAR_SLOTS, IT_RANKS, RANK_TIERS, RANKS, rarityOf, shopItem, STAT_ICON, STATS, WARRIOR_ICON, WARRIOR_LABEL, WARRIOR_RANKS, type Attribute } from '@/game'
import { requireUser } from '@/server/auth'
import { myCharacter } from '@/server/game/character'
import { Button } from '@/ui/design/Button'
import { Card } from '@/ui/design/Card'
import { GameIcon } from '@/ui/design/GameIcon'
import { PixelIcon } from '@/ui/design/PixelIcon'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { AttributeRadar } from '@/ui/game/AttributeRadar'
import { LooCharacter } from '@/ui/game/LooCharacter'
import { Icon } from '@/ui/icons/Icon'

export const metadata: Metadata = { title: 'Мій Loo' }
export const dynamic = 'force-dynamic'

const SLOT_ICON = { head: 'px:helmet', body: 'px:armor', weapon: 'px:sword', amulet: 'px:amulet', aura: 'px:spark' } as const

const attrName = (a: Attribute) => t(`game.character.attributes.${a.id}.name`)

function AttributeBar({ a }: { a: Attribute }) {
  return (
    <li className="attr-row" title={t(`game.character.attributes.${a.id}.hint`)}>
      <Icon name={ATTRIBUTE_ICON[a.id]} size={28} className="attr-icon" />
      <span className="attr-name">{attrName(a)}</span>
      <ProgressBar value={a.value / 100} size="md" tone={a.level >= 60 ? 'green' : a.level >= 30 ? 'blue' : 'yellow'} label={`${attrName(a)}: ${a.level}`} className="attr-bar" />
      <span className="attr-level tabular">{a.level}</span>
      <span className="attr-hint">{t(`game.character.attributes.${a.id}.hint`)}</span>
    </li>
  )
}

// /loo — «Мій Loo»: the character across all courses (warrior rank, gear and battle stats, attributes, skills, ladder).
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
            <PixelIcon name={WARRIOR_ICON[rank.rank.rank]} size={36} /> {rank.rank.title}
          </h1>
          <p className="loo-lead">{t('game.character.lead')}</p>
          <p className="loo-meta">
            <span className="loo-step tabular">{t('game.character.step', { n: rank.rank.index + 1, total: RANKS.length })}</span>
            <span className="loo-power tabular" title={t('game.character.powerHint')}>
              <PiSwordFill aria-hidden="true" /> {t('game.character.power')}: <strong>{c.snapshot.power}</strong>
            </span>
          </p>
          {rank.next ? (
            <div className="loo-next">
              <ProgressBar value={rank.progress} tone="purple" size="lg" label={t('game.character.nextStep', { rank: rank.next.title })} />
              <p className="loo-gaps">
                {t('game.character.nextStep', { rank: rank.next.title })}:{' '}
                {rank.gaps.map((g, i) => (
                  <span key={g.key} className="loo-gap" data-met={g.have >= g.need ? '' : undefined}>
                    {i > 0 ? ' · ' : ''}
                    {Math.min(g.have, g.need).toLocaleString('uk-UA')}/{g.need.toLocaleString('uk-UA')} {t(`game.ranks.reqs.${g.key}`)}
                  </span>
                ))}
                {rank.next.gems > 0 ? (
                  <>
                    {' · '}
                    <span className="loo-gap-gems">
                      +{rank.next.gems} <GameIcon name="gem" size={16} />
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          ) : (
            <p className="loo-gaps">{t('game.character.top')}</p>
          )}
        </div>
      </header>

      <h2 className="gsection-title">{t('game.character.gearTitle')}</h2>
      <p className="ghead-lead">{t('game.character.gearLead')}</p>
      <div className="loo-gear">
        <ul className="loo-gear-slots">
          {GEAR_SLOTS.map((slot) => {
            const id = c.gear.equipped[slot]
            const item = id ? shopItem(id) : null
            const rarity = item ? rarityOf(item) : null
            return (
              <li key={slot} className="loo-gear-slot" data-rarity={rarity ?? undefined} data-empty={item ? undefined : ''}>
                <Icon name={item && 'icon' in item ? item.icon : SLOT_ICON[slot]} size={32} />
                <span className="loo-gear-text">
                  <span className="loo-gear-label">{t(`game.shop.gearSlots.${slot}`)}</span>
                  <strong className="loo-gear-name">{item ? t(`game.shop.items.${item.id as 'helm-leather'}.name`) : t('game.character.gearEmpty')}</strong>
                  {rarity ? <span className="loo-gear-rarity">{t(`game.shop.rarity.${rarity}`)}</span> : null}
                </span>
              </li>
            )
          })}
        </ul>
        <Card variant="raised" className="loo-stats-card">
          <h3 className="loo-sw-title">{t('game.character.statsTotal')}</h3>
          <ul className="loo-stats">
            {STATS.map((st) => (
              <li key={st} className="loo-stat" title={t(`game.stats.${st}.hint`)}>
                <Icon name={STAT_ICON[st]} size={22} />
                <span className="loo-stat-name">{t(`game.stats.${st}.name`)}</span>
                <span className="loo-stat-value tabular">{c.gear.stats[st]}</span>
              </li>
            ))}
          </ul>
          <Button href="/shop" size="sm" variant="secondary">
            {t('game.character.gearShop')}
          </Button>
        </Card>
      </div>

      <h2 className="gsection-title">{t('game.character.coursesTitle')}</h2>
      <p className="ghead-lead">{t('game.character.coursesLead')}</p>
      {c.courses.length === 0 ? (
        <p className="empty-note">{t('game.character.coursesEmpty')}</p>
      ) : (
        <ul className="loo-courses">
          {c.courses.map((course) => (
            <li key={course.courseId} className="loo-course">
              <Icon name={course.icon ?? 'px:book'} size={28} />
              <span className="loo-course-title">{course.title}</span>
              <span className="loo-course-rank">
                <Icon name={courseRankIcon(course.rank, course.ladder)} size={20} /> {courseRankLabel(course.rank, course.ladder)}
              </span>
              <span className="loo-course-steps" aria-hidden="true">
                {IT_RANKS.map((r, i) => (
                  <span key={r} data-on={i <= IT_RANKS.indexOf(course.rank) ? '' : undefined} />
                ))}
              </span>
            </li>
          ))}
        </ul>
      )}

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
          <h3 className="loo-sw-title">
            <PixelIcon name="dumbbell" size={24} /> {t('game.character.strengthsTitle')}
          </h3>
          <ol className="loo-sw-list">
            {c.strengths.map((a) => (
              <li key={a.id}>
                <Icon name={ATTRIBUTE_ICON[a.id]} size={20} /> {attrName(a)} <span className="tabular">{a.level}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card variant="raised" tone="orange" className="loo-sw-card">
          <h3 className="loo-sw-title">
            <PixelIcon name="target" size={24} /> {t('game.character.weakTitle')}
          </h3>
          <p className="loo-sw-weak">
            <Icon name={ATTRIBUTE_ICON[c.weakest.id]} size={24} /> {attrName(c.weakest)} <span className="tabular">{c.weakest.level}</span>
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
                {s.kind === 'section' ? (
                  <>
                    <PixelIcon name="crown" size={14} /> {t('game.character.skillSection')} ·{' '}
                  </>
                ) : null}
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
      <ol className="rank-ladder">
        {WARRIOR_RANKS.map((r) => {
          const steps = RANKS.filter((step) => step.rank === r)
          const first = steps[0]!
          const current = rank.rank.rank === r
          const state = current ? 'current' : first.index < rank.rank.index ? 'reached' : 'locked'
          return (
            <li key={r} className="rank-rung" data-state={state}>
              <PixelIcon name={WARRIOR_ICON[r]} size={state === 'current' ? 40 : 32} />
              <span className="rank-rung-text">
                <strong className="rank-rung-title">{WARRIOR_LABEL[r]}</strong>
                <span className="rank-rung-sub tabular">
                  {state === 'current' ? t('game.character.current') : state === 'reached' ? t('game.character.reached') : `${first.needs.xp.toLocaleString('uk-UA')} XP`}
                </span>
              </span>
              {steps.length === RANK_TIERS ? (
                <span className="rank-rung-pips" aria-hidden="true">
                  {steps.map((step) => (
                    <span key={step.id} data-on={step.index <= rank.rank.index ? '' : undefined} />
                  ))}
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
