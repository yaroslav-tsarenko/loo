import Link from 'next/link'
import { STAGES, TRACKS, type Track, type TrackStage } from '@/content/tracks'
import { RANKS, type LevelInfo } from '@/progress/levels'
import { Pill } from '@/ui/design/Badge'
import { GameIcon } from '@/ui/design/GameIcon'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { Icon } from '@/ui/icons/Icon'
import { trackIcon } from '@/ui/icons/tracks'

export interface TrackCard {
  track: Track
  available: boolean
  lessonsDone: number
  lessonsTotal: number
  crowns: number
  maxCrowns: number
  ratio: number
  currentTitle: string | null
}

const RANK_EMOJI: Record<string, string> = { trainee: '🐣', junior: '🌱', middle: '🔧', senior: '🧠', staff: '🦉', principal: '👑' }

export function EngineerMap({ cards, level }: { cards: TrackCard[]; level: LevelInfo }) {
  const stages = Object.keys(STAGES) as TrackStage[]
  return (
    <section className="emap" aria-label="Мапа інженера">
      <ol className="emap-ranks" aria-label="Ранги">
        {RANKS.map((rank) => {
          const reached = level.level >= rank.fromLevel
          const current = level.rank.id === rank.id
          return (
            <li key={rank.id} className="emap-rank" data-reached={reached ? '' : undefined} data-current={current ? '' : undefined}>
              <span className="emap-rank-emoji" aria-hidden="true">
                {RANK_EMOJI[rank.id] ?? '⭐'}
              </span>
              <span className="emap-rank-title">{rank.title}</span>
              <span className="emap-rank-sub tabular">рів. {rank.fromLevel}+</span>
            </li>
          )
        })}
      </ol>
      <p className="emap-level">
        Ти зараз <strong>{level.rank.title}</strong> · рівень <strong className="tabular">{level.level}</strong> ·{' '}
        <span className="tabular">{Math.round(level.progress * 100)}%</span> до наступного
        {level.nextRank ? (
          <>
            {' '}
            · до {level.nextRank.title}: рівень {level.nextRank.fromLevel}
          </>
        ) : null}
      </p>

      {stages.map((stage) => {
        const list = cards.filter((c) => c.track.stage === stage)
        if (list.length === 0) return null
        return (
          <div key={stage} className="emap-stage">
            <h2 className="emap-stage-title">
              {STAGES[stage].emoji} {STAGES[stage].title}
            </h2>
            <div className="emap-tracks">
              {list.map((c) => {
                const body = (
                  <>
                    <span className="emap-track-icon" aria-hidden="true">
                      <Icon name={trackIcon(c.track.id, c.track.emoji)} size={30} />
                    </span>
                    <span className="emap-track-text">
                      <span className="emap-track-title">
                        {c.track.title}
                        {!c.available ? (
                          <Pill size="sm" className="emap-soon">
                            скоро
                          </Pill>
                        ) : null}
                      </span>
                      <span className="emap-track-tagline">{c.track.tagline}</span>
                      {c.available ? (
                        <>
                          <ProgressBar value={c.lessonsTotal ? c.lessonsDone / c.lessonsTotal : 0} size="sm" label={`${c.track.title}: пройдено уроків`} className="emap-bar" />
                          <span className="emap-track-meta tabular">
                            {c.lessonsDone}/{c.lessonsTotal} уроків · <GameIcon name="crown" size={14} /> {c.crowns}/{c.maxCrowns}
                            {c.currentTitle ? ` · зараз: ${c.currentTitle}` : ''}
                          </span>
                        </>
                      ) : (
                        <span className="emap-track-meta">{c.track.after.length ? `після: ${c.track.after.map((id) => TRACKS.find((t) => t.id === id)?.title ?? id).join(', ')}` : 'курс готується'}</span>
                      )}
                    </span>
                  </>
                )
                return c.available ? (
                  <Link key={c.track.id} href={`/path?track=${c.track.id}`} className="emap-track lu-card" data-variant="interactive" data-pad="md" data-tone={c.lessonsDone > 0 ? 'green' : undefined} data-started={c.lessonsDone > 0 ? '' : undefined}>
                    {body}
                  </Link>
                ) : (
                  <div key={c.track.id} className="emap-track lu-card" data-pad="md" data-soon="">
                    {body}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </section>
  )
}
