import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { PiBrainFill, PiChatCircleTextFill, PiCheckBold, PiCodeBlockFill, PiExamFill, PiGearSixFill, PiLightningFill, PiPlusBold, PiTargetFill, PiTimerFill, PiTrendDownBold, PiTrendUpBold } from 'react-icons/pi'
import { LEVEL_EMOJI, LEVEL_LABEL as COURSE_LEVEL_LABEL } from '@/course'
import { LEVEL_LABEL, LEVELS } from '@/content/model'
import { messages, t } from '@/i18n'
import { levelInfo } from '@/progress/levels'
import type { Tier } from '@/progress/stats'
import { setDailyMinutes, toggleInterest } from '@/server/actions/preferences'
import { getProfile, requireUser } from '@/server/auth'
import { getContent } from '@/server/content'
import { interestOptions, getPreferences } from '@/server/preferences'
import { MINUTES } from '@/server/services/preferences'
import { missionCursor } from '@/server/services/mission'
import { getCoach } from '@/server/stats/coach'
import { profileView, type ProfileTopic, type ProfileView } from '@/server/stats/profile'
import { count, duration, percent, relative } from '@/ui/format'
import { Avatar } from '@/ui/design/Avatar'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'
import { Card } from '@/ui/design/Card'
import type { Tone } from '@/ui/design/cx'
import { EmptyState } from '@/ui/design/EmptyState'
import { GameIcon } from '@/ui/design/GameIcon'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { LooCharacter } from '@/ui/game/LooCharacter'
import { Icon } from '@/ui/icons/Icon'
import { Heatmap } from '@/ui/profile/Heatmap'
import { topicAnchor } from '@/ui/routes'
import { BarList, ChartCard, DayColumns, SpeedLine } from '@/ui/stats/Charts'
import { CoachCard } from '@/ui/stats/CoachCard'
import { longDay, seconds, signedPercent } from '@/ui/stats/format'

export const metadata: Metadata = { title: 'Профіль' }

// honest zero for new users («<1 хв» only when there is some time)
const time = (ms: number) => (ms > 0 ? duration(ms) : '0 хв')

function StatTile({ icon, tone, value, label, sub, hint }: { icon: ReactNode; tone: Tone; value: ReactNode; label: string; sub?: ReactNode; hint?: string }) {
  return (
    <Card variant="raised" tone={tone} padding="sm" className="st-tile" title={hint}>
      <span className="st-tile-icon" data-tone={tone} aria-hidden="true">
        {icon}
      </span>
      <span className="st-tile-value">{value}</span>
      <span className="st-tile-label">{label}</span>
      {sub ? <span className="st-tile-sub">{sub}</span> : null}
    </Card>
  )
}

function tierText(tier: Tier): { emoji: string; title: string; label: string; unit: string; next: string | null } {
  const set = messages().stats.tiers[tier.dimension] as unknown as Record<string, { emoji: string; title: string } | string>
  const pick = (id: string) => set[id] as { emoji: string; title: string }
  const me = pick(tier.id)
  const unit = set.unit as string
  let next: string | null = null
  if (tier.value === null) next = t('stats.tierNoData')
  else if (tier.next) {
    const left = tier.dimension === 'speed' ? `${(Math.round((tier.value - tier.next.at) * 10) / 10).toFixed(1)}${unit}` : `${Math.max(0, tier.next.at - tier.value)}${unit}`
    next = t('stats.tierNext', { title: pick(tier.next.id).title, left })
  } else next = t('stats.tierMax')
  return { emoji: me.emoji, title: me.title, label: set.label as string, unit, next }
}

function TopicList({ topics, kind }: { topics: ProfileTopic[]; kind: 'strong' | 'weak' }) {
  if (topics.length === 0) return <p className="st-empty-note">{t(kind === 'strong' ? 'stats.topics.strongEmpty' : 'stats.topics.weakEmpty')}</p>
  return (
    <ul className="st-topics" data-kind={kind}>
      {topics.map((tp) => (
        <li key={tp.chapterId}>
          <span className="st-topic-icon" aria-hidden="true">
            <Icon name={tp.icon ?? (kind === 'strong' ? '💪' : '🎯')} size={22} />
          </span>
          <span className="st-topic-text">
            <span className="st-topic-title">{tp.title}</span>
            <span className="st-topic-meta">
              {t('stats.topics.meta', { acc: percent(tp.accuracy), n: count(tp.total, 'відповідь', 'відповіді', 'відповідей') })}
              {tp.open > 0 ? ` · ${t('stats.topics.open', { n: tp.open })}` : ''}
            </span>
          </span>
          <span className="st-topic-links">
            {tp.topicId ? (
              <Link className="st-link" href={`/path#${topicAnchor(tp.topicId)}`}>
                {t('stats.topics.path')}
              </Link>
            ) : null}
            {kind === 'weak' ? (
              <Button href={`/quiz?chapter=${encodeURIComponent(tp.chapterId)}&start=1`} size="sm" variant="secondary">
                {t('stats.topics.practice')}
              </Button>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  )
}

// closest locked achievements shown up front; the rest fold away
const LOCKED_SHOWN = 6

function AchievementCard({ a }: { a: ProfileView['achievements'][number] }) {
  const done = a.unlockedAt !== null
  return (
    <li className="lu-card" data-pad="sm" data-tier={a.def.tier} data-state={done ? 'unlocked' : 'locked'}>
      <span className="st-ach-medal" aria-hidden="true">
        {done ? <PiCheckBold /> : '🔒'}
      </span>
      <span className="st-ach-title">{a.def.title}</span>
      <span className="st-ach-desc">{a.def.description}</span>
      {done ? (
        <span className="st-ach-sub">{t('stats.achievementAt', { when: relative(a.unlockedAt) })}</span>
      ) : (
        <ProgressBar value={a.progress} size="sm" tone="blue" label={`Прогрес ${Math.round(a.progress * 100)}%`} />
      )}
    </li>
  )
}

export default async function ProfilePage() {
  const user = await requireUser()
  const snapshot = await getContent()
  const [view, profile, prefs, options, { cursor }] = await Promise.all([profileView(snapshot), getProfile(), getPreferences(), interestOptions(), missionCursor(snapshot)])
  const coach = await getCoach(snapshot, { href: cursor.href })
  const m = messages()
  const { stats, tiers, rank } = view
  const info = levelInfo(stats.xp)
  const name = profile?.displayName || user.name || user.email || 'Я'
  const chosen = new Set(prefs.interests)
  const startHref = cursor.href ?? '/courses'
  const q = stats.speed.question
  const unlocked = view.achievements.filter((a) => a.unlockedAt !== null)
  const locked = view.achievements.filter((a) => a.unlockedAt === null).sort((a, b) => b.progress - a.progress)
  const xp30 = stats.series.xp30.reduce((s, d) => s + d.xp, 0)
  const bestXp30 = Math.max(0, ...stats.series.xp30.map((d) => d.xp))
  const chartTopics = view.topics.filter((tp) => tp.total >= 3).slice(0, 12)
  const levelRows = LEVELS.map((level) => stats.byLevel.find((l) => l.level === level) ?? { level, solved: 0, total: 0, correct: 0, rate: null })
  const maxSolved = Math.max(1, ...levelRows.map((l) => l.solved))

  return (
    <div className="page profile st-page" data-width="wide">
      <header className="lu-card st-hero" data-pad="lg">
        <Avatar name={name} src={profile?.avatarUrl ?? undefined} size={84} ring="green" className="st-hero-avatar" />
        <Link href="/loo" className="st-hero-loo" title={`${t('game.character.title')}: ${rank.rank.title}`} aria-label={`${t('game.character.title')}: ${rank.rank.title}`}>
          <LooCharacter step={rank.rank.index} mood="happy" size={72} />
        </Link>
        <div className="st-hero-text">
          <h1 className="st-hero-name">{name}</h1>
          <p className="st-hero-pills">
            <Link href="/loo" className="st-hero-evo">
              <Pill tone="purple" solid icon={<span aria-hidden="true">{rank.rank.emoji}</span>}>
                {rank.rank.title}
              </Pill>
            </Link>
            <Pill tone="yellow" icon={<GameIcon name="bolt" size={16} />}>
              {t('stats.level', { level: info.level })}
            </Pill>
            <Pill tone={coach.streak > 0 ? 'green' : 'gray'}>📈 {t('coach.multiplier', { x: coach.multiplier.toFixed(2) })}</Pill>
          </p>
          {rank.next ? (
            <>
              <ProgressBar value={rank.progress} tone="purple" size="sm" label={t('stats.rankNext', { rank: rank.next.title })} className="st-hero-xp" />
              <p className="st-hero-meta">
                {t('stats.rankNext', { rank: `${rank.next.emoji} ${rank.next.title}` })}:{' '}
                {rank.gaps.map((g, i) => (
                  <span key={g.key} className="st-gap" data-met={g.have >= g.need ? '' : undefined}>
                    {i > 0 ? ' · ' : ''}
                    {Math.min(g.have, g.need)}/{g.need} {t(`stats.gaps.${g.key}`)}
                  </span>
                ))}
              </p>
            </>
          ) : (
            <p className="st-hero-meta">{t('stats.topRank')}</p>
          )}
          <p className="st-hero-meta">
            {t('stats.xpTotal', { xp: stats.xp })} · {t('stats.xpToNext', { xp: info.ceiling - stats.xp, level: info.level + 1 })}
            {profile ? ` · ${t('stats.since', { date: new Date(profile.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }) })}` : ''}
          </p>
        </div>
        <Link href="/account" className="st-hero-settings" aria-label={t('stats.account')} title={t('stats.account')}>
          <PiGearSixFill aria-hidden="true" />
        </Link>
      </header>

      {stats.empty ? (
        <Card variant="raised" padding="lg" className="st-zero">
          <EmptyState
            mood="wave"
            title={t('stats.zero.title')}
            action={
              <span className="st-zero-actions">
                <Button href={startHref} size="lg">
                  {t('stats.zero.cta')}
                </Button>
                <Button href="/courses" variant="secondary" size="lg">
                  {t('stats.zero.courses')}
                </Button>
              </span>
            }
          >
            {t('stats.zero.body')}
          </EmptyState>
        </Card>
      ) : null}

      <CoachCard coach={coach} />

      <section className="st-tiles" aria-label="Ключові показники">
        <StatTile
          icon={<PiTimerFill />}
          tone="purple"
          value={time(stats.hours.totalMs)}
          label={t('stats.tiles.hours')}
          sub={t('stats.tiles.hoursSub', { week: time(stats.hours.weekMs) })}
          hint={t('stats.tiles.hoursHint')}
        />
        <StatTile
          icon={<PiCodeBlockFill />}
          tone="orange"
          value={stats.tasks.solved}
          label={t('stats.tiles.tasks')}
          sub={stats.tasks.attempted > 0 ? t('stats.tiles.tasksSub', { rate: percent(stats.tasks.firstTryRate) }) : t('stats.tiles.tasksSubEmpty')}
        />
        <StatTile
          icon={<PiChatCircleTextFill />}
          tone="blue"
          value={stats.questions.total}
          label={t('stats.tiles.questions')}
          sub={t('stats.tiles.questionsSub', { rate: percent(stats.questions.rate) })}
        />
        <StatTile icon={<PiTargetFill />} tone="green" value={percent(stats.answers.rate)} label={t('stats.tiles.accuracy')} sub={t('stats.tiles.accuracySub', { n: count(stats.answers.total, 'відповідь', 'відповіді', 'відповідей') })} />
        <StatTile
          icon={<PiLightningFill />}
          tone="yellow"
          value={q?.recentMs ? seconds(q.recentMs) : '—'}
          label={t('stats.tiles.speed')}
          sub={
            q?.trend !== null && q?.trend !== undefined ? (
              <span className="st-trend" data-good={q.trend <= 0 ? '' : undefined}>
                {q.trend <= 0 ? <PiTrendDownBold aria-hidden="true" /> : <PiTrendUpBold aria-hidden="true" />}
                {t(q.trend <= 0 ? 'stats.tiles.speedFaster' : 'stats.tiles.speedSlower', { pct: signedPercent(q.trend) })}
              </span>
            ) : stats.speed.itemsPerMinute !== null ? (
              t('stats.tiles.perMinute', { n: stats.speed.itemsPerMinute.toFixed(1) })
            ) : (
              t('stats.tiles.speedEmpty')
            )
          }
        />
        <StatTile
          icon={<GameIcon name="fire" size={26} />}
          tone="red"
          value={stats.consistency.streak.current}
          label={t('stats.tiles.streak')}
          sub={t('stats.tiles.streakSub', { best: stats.consistency.streak.best, active: stats.consistency.active30 })}
        />
        <StatTile icon={<PiBrainFill />} tone="pink" value={stats.memory.longTerm} label={t('stats.tiles.memory')} sub={t('stats.tiles.memorySub', { cards: stats.memory.cards, due: stats.memory.dueToday })} />
        <StatTile
          icon={<PiExamFill />}
          tone="blue"
          value={stats.results.examsPassed}
          label={t('stats.tiles.exams')}
          sub={t('stats.tiles.examsSub', { tests: stats.results.testsPassed, lessons: stats.results.lessonsDone })}
        />
      </section>

      <section aria-labelledby="st-tiers" className="st-block">
        <h2 id="st-tiers" className="st-h2">
          {t('stats.tiersTitle')} <span className="st-h2-sub">{t('stats.tiersHint')}</span>
        </h2>
        <ul className="st-tiers">
          {tiers.map((tier) => {
            const text = tierText(tier)
            return (
              <li key={tier.dimension} className="lu-card st-tier" data-pad="sm" data-index={tier.index} data-empty={tier.value === null ? '' : undefined}>
                <span className="st-tier-emoji" aria-hidden="true">
                  {text.emoji}
                </span>
                <span className="st-tier-text">
                  <span className="st-tier-label">{text.label}</span>
                  <span className="st-tier-title">{text.title}</span>
                  <span className="st-tier-next">{text.next}</span>
                </span>
                <span className="st-tier-steps" aria-hidden="true">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} data-on={i <= tier.index && tier.value !== null ? '' : undefined} />
                  ))}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="st-activity" className="lu-card st-block st-activity" data-pad="md">
        <h2 id="st-activity" className="st-h2">
          {t('stats.activity')}
          <span className="st-h2-sub">{t('stats.activitySub', { active: stats.series.heat.filter((d) => d.total > 0).length, goal: prefs.dailyGoal })}</span>
        </h2>
        <Heatmap days={stats.series.heat} goal={prefs.dailyGoal} />
      </section>

      {stats.empty ? null : (
        <div className="st-charts">
          <ChartCard title={t('stats.charts.xp')} sub={t('stats.charts.xpSub', { total: xp30, best: bestXp30 })}>
            <DayColumns days={stats.series.xp30.map((d) => ({ day: d.day, value: d.xp }))} unit="XP" label={t('stats.charts.xp')} />
          </ChartCard>
          <ChartCard title={t('stats.charts.speed')} sub={t('stats.charts.speedSub')}>
            <SpeedLine days={stats.series.speed30} />
          </ChartCard>
          <ChartCard title={t('stats.charts.topics')} sub={t('stats.charts.topicsSub')}>
            {chartTopics.length === 0 ? (
              <p className="st-empty-note">{t('stats.charts.topicsEmpty')}</p>
            ) : (
              <BarList
                label={t('stats.charts.topics')}
                items={chartTopics.map((tp) => ({
                  key: tp.chapterId,
                  label: tp.title,
                  value: tp.accuracy ?? 0,
                  display: percent(tp.accuracy),
                  tip: percent(tp.accuracy),
                  tipLabel: `${tp.title} · ${tp.correct}/${tp.total}`,
                  href: tp.topicId ? `/path#${topicAnchor(tp.topicId)}` : undefined,
                  flag:
                    tp.accuracy !== null && tp.accuracy < 0.7 && tp.total >= 5 ? (
                      <span className="st-flag" title={t('stats.topics.weak')}>
                        ⚠︎ <span className="sr-only">{t('stats.topics.weak')}</span>
                      </span>
                    ) : null,
                }))}
              />
            )}
          </ChartCard>
          <ChartCard title={t('stats.charts.levels')} sub={t('stats.charts.levelsSub')}>
            <BarList
              label={t('stats.charts.levels')}
              items={levelRows.map((l) => ({
                key: l.level,
                label: LEVEL_LABEL[l.level as keyof typeof LEVEL_LABEL] ?? l.level,
                value: l.solved / maxSolved,
                display: String(l.solved),
                tip: `${l.solved}`,
                tipLabel: `${LEVEL_LABEL[l.level as keyof typeof LEVEL_LABEL] ?? l.level} · точність ${percent(l.rate)}`,
              }))}
            />
          </ChartCard>
        </div>
      )}

      {stats.empty ? null : (
        <section aria-labelledby="st-records" className="st-block">
          <h2 id="st-records" className="st-h2">
            🏆 {t('stats.records.title')}
          </h2>
          <ul className="st-records">
            <li className="lu-card" data-pad="sm">
              <span className="st-record-label">{t('stats.records.bestXp')}</span>
              <span className="st-record-value">{stats.records.bestDayXp ? `${stats.records.bestDayXp.value} XP` : t('stats.records.none')}</span>
              {stats.records.bestDayXp ? <span className="st-record-sub">{longDay(stats.records.bestDayXp.day)}</span> : null}
            </li>
            <li className="lu-card" data-pad="sm">
              <span className="st-record-label">{t('stats.records.bestAnswers')}</span>
              <span className="st-record-value">{stats.records.bestDayAnswers ? stats.records.bestDayAnswers.value : t('stats.records.none')}</span>
              {stats.records.bestDayAnswers ? <span className="st-record-sub">{longDay(stats.records.bestDayAnswers.day)}</span> : null}
            </li>
            <li className="lu-card" data-pad="sm">
              <span className="st-record-label">{t('stats.records.combo')}</span>
              <span className="st-record-value">{stats.records.longestCombo}</span>
              <span className="st-record-sub">{t('stats.records.comboUnit')}</span>
            </li>
            <li className="lu-card" data-pad="sm">
              <span className="st-record-label">{t('stats.records.streak')}</span>
              <span className="st-record-value">{count(stats.records.longestStreak, 'день', 'дні', 'днів')}</span>
            </li>
            <li className="lu-card" data-pad="sm">
              <span className="st-record-label">{t('stats.records.fastest')}</span>
              <span className="st-record-value">{stats.records.fastestPerfectLessonMs !== null ? duration(stats.records.fastestPerfectLessonMs) : t('stats.records.none')}</span>
            </li>
          </ul>
        </section>
      )}

      {stats.empty ? null : (
        <div className="st-topic-cols">
          <section aria-labelledby="st-strong" className="lu-card st-block" data-pad="md">
            <h2 id="st-strong" className="st-h2">
              💪 {t('stats.topics.strong')}
            </h2>
            <TopicList topics={view.strong} kind="strong" />
          </section>
          <section aria-labelledby="st-weak" className="lu-card st-block" data-pad="md">
            <h2 id="st-weak" className="st-h2">
              🎯 {t('stats.topics.weak')}
            </h2>
            <TopicList topics={view.weak} kind="weak" />
          </section>
        </div>
      )}

      <section aria-labelledby="st-prefs" className="lu-card st-block st-prefs" data-pad="md">
        <h2 id="st-prefs" className="st-h2">
          ✨ {t('stats.prefs.title')}
        </h2>
        <p className="st-prefs-lead">{t('stats.prefs.lead')}</p>
        <h3 className="st-h3">{t('stats.prefs.interests')}</h3>
        <form action={toggleInterest} className="st-chips">
          {options.map((o) => {
            const on = chosen.has(o.tag)
            return (
              <button key={o.tag} type="submit" name="tag" value={o.tag} className="st-chip" aria-pressed={on}>
                {on ? <PiCheckBold aria-hidden="true" /> : <PiPlusBold aria-hidden="true" />}
                {o.label}
              </button>
            )
          })}
        </form>
        <h3 className="st-h3">{t('stats.prefs.minutes')}</h3>
        <form action={setDailyMinutes} className="st-chips">
          {MINUTES.map((n) => (
            <button key={n} type="submit" name="minutes" value={n} className="st-chip" aria-pressed={prefs.dailyMinutes === n}>
              {t('stats.prefs.minutesValue', { n })}
            </button>
          ))}
        </form>
        <h3 className="st-h3">{t('stats.prefs.level')}</h3>
        <ul className="st-pref-courses">
          {prefs.courses.map((c) => (
            <li key={c.id}>
              <Icon name={c.icon ?? '📘'} size={22} />
              <span className="st-pref-course-title">{c.title}</span>
              <Pill tone="purple" size="sm">
                {LEVEL_EMOJI[c.level]} {COURSE_LEVEL_LABEL[c.level]}
              </Pill>
              <Link className="st-link" href={`/courses/${c.id}#level`}>
                {t('stats.prefs.change')}
              </Link>
            </li>
          ))}
          <li className="st-pref-self">
            {t('stats.prefs.levelSelf', { level: m.levels[prefs.level].title })} ·{' '}
            <Link className="st-link" href="/account">
              {t('stats.prefs.more')}
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="st-ach" className="st-block">
        <h2 id="st-ach" className="st-h2">
          🎖️ {t('stats.achievements', { n: unlocked.length, total: view.achievements.length })}
        </h2>
        <ul className="st-ach">
          {unlocked.map((a) => (
            <AchievementCard key={a.def.id} a={a} />
          ))}
          {locked.slice(0, LOCKED_SHOWN).map((a) => (
            <AchievementCard key={a.def.id} a={a} />
          ))}
        </ul>
        {locked.length > LOCKED_SHOWN ? (
          <details className="st-ach-more">
            <summary>{t('stats.achievementsMore', { n: locked.length - LOCKED_SHOWN })}</summary>
            <ul className="st-ach">
              {locked.slice(LOCKED_SHOWN).map((a) => (
                <AchievementCard key={a.def.id} a={a} />
              ))}
            </ul>
          </details>
        ) : null}
      </section>
    </div>
  )
}
