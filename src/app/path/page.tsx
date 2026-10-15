import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getContent } from '@/server/content'
import { userXp } from '@/server/services/progress'
import { trackPath } from '@/server/services/path'
import { TRACKS } from '@/content/tracks'
import { levelInfo } from '@/progress/levels'
import { PiMapTrifoldFill } from 'react-icons/pi'
import { Card } from '@/ui/design/Card'
import { GameIcon } from '@/ui/design/GameIcon'
import { Icon } from '@/ui/icons/Icon'
import { trackIcon } from '@/ui/icons/tracks'
import { PathView, type PathStageView } from '@/ui/path/PathView'

export const metadata: Metadata = { title: 'Шлях' }

export default async function PathPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams
  const snapshot = await getContent()
  const available = TRACKS.filter((t) => t.guides.some((g) => snapshot.guideById.has(g)))
  const fromGuide = params.guide ? available.find((t) => t.guides.includes(params.guide!)) : undefined
  const track = available.find((t) => t.id === params.track) ?? fromGuide ?? available[0]
  if (!track) notFound()
  const [path, xp] = await Promise.all([trackPath(snapshot, track), userXp()])
  const level = levelInfo(xp)
  const stages: PathStageView[] = path.stages.map((s) => ({
    emoji: s.emoji,
    title: s.title,
    ratio: s.ratio,
    nodes: s.nodes.map((n) => ({
      lessons: n.lessons,
      id: n.chapter.id,
      number: n.number,
      title: n.chapter.title,
      icon: n.icon,
      href: n.href,
      crowns: n.mastery.crowns,
      ratio: n.mastery.ratio,
      next: n.mastery.next,
      state: n.state,
      minutes: n.chapter.estimatedMinutes,
      counts: {
        quizzes: `${n.signals.quizzes.answered}/${n.signals.quizzes.total}`,
        cards: `${n.signals.cards.reviewing}/${n.signals.cards.total}`,
        tasks: `${n.signals.tasks.solved}/${n.signals.tasks.total}`,
      },
    })),
  }))
  return (
    <div className="page path-page" data-width="wide">
      <header className="ghead">
        <span className="ghead-badge path-track-badge" aria-hidden="true">
          <Icon name={trackIcon(track.id, track.emoji)} size={40} />
        </span>
        <div className="ghead-text">
          <h1 className="ghead-title">{track.title}: шлях</h1>
          <p className="ghead-lead">{track.tagline}</p>
        </div>
      </header>
      <div className="path-summary">
        <Card variant="raised" tone="blue" padding="sm" className="path-summary-item">
          <span className="path-summary-value tabular">
            <GameIcon name="bolt" size={22} />
            {level.level}
          </span>
          <span className="path-summary-label">рівень · {level.rank.title}</span>
        </Card>
        <Card variant="raised" tone="yellow" padding="sm" className="path-summary-item">
          <span className="path-summary-value tabular">
            <GameIcon name="crown" size={22} />
            {path.crowns}
            <small>/{path.maxCrowns}</small>
          </span>
          <span className="path-summary-label">корон майстерності</span>
        </Card>
        <Card variant="raised" tone="green" padding="sm" className="path-summary-item">
          <span className="path-summary-value tabular">
            {path.lessonsDone}
            <small>/{path.lessonsTotal}</small>
          </span>
          <span className="path-summary-label">уроків · {Math.round(path.ratio * 100)}%</span>
        </Card>
      </div>
      <nav className="gchips path-guides" aria-label="Трек">
        {available.map((t) => (
          <Link key={t.id} href={`/path?track=${t.id}`} className="gchip" aria-current={t.id === track.id ? 'page' : undefined}>
            <Icon name={trackIcon(t.id, t.emoji)} size={18} /> {t.title}
          </Link>
        ))}
        <Link href="/roadmap" className="gchip">
          <PiMapTrifoldFill aria-hidden="true" /> Уся мапа
        </Link>
      </nav>
      <PathView stages={stages} />
    </div>
  )
}
