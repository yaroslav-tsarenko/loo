import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getContent } from '@/server/content'
import { totalXp } from '@/server/services/progress'
import { trackPath } from '@/server/services/path'
import { TRACKS } from '@/content/tracks'
import { getDb } from '@/db/client'
import { levelInfo } from '@/progress/levels'
import { PathView, type PathStageView } from '@/ui/path/PathView'

export const metadata: Metadata = { title: 'Шлях' }

export default async function PathPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams
  const snapshot = await getContent()
  const available = TRACKS.filter((t) => t.guides.some((g) => snapshot.guideById.has(g)))
  const fromGuide = params.guide ? available.find((t) => t.guides.includes(params.guide!)) : undefined
  const track = available.find((t) => t.id === params.track) ?? fromGuide ?? available[0]
  if (!track) notFound()
  const [path, xp] = await Promise.all([trackPath(snapshot, track), totalXp(getDb())])
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
    <div className="page" data-width="wide">
      <h1 className="page-title">
        {track.emoji} {track.title}: шлях
      </h1>
      <p className="page-lead">{track.tagline}</p>
      <div className="path-summary">
        <div className="path-summary-item">
          <span className="path-summary-value tabular">{level.level}</span>
          <span className="path-summary-label">рівень · {level.rank.title}</span>
        </div>
        <div className="path-summary-item">
          <span className="path-summary-value tabular">
            👑 {path.crowns}
            <small>/{path.maxCrowns}</small>
          </span>
          <span className="path-summary-label">корон майстерності</span>
        </div>
        <div className="path-summary-item">
          <span className="path-summary-value tabular">
            {path.lessonsDone}
            <small>/{path.lessonsTotal}</small>
          </span>
          <span className="path-summary-label">уроків · {Math.round(path.ratio * 100)}% опановано</span>
        </div>
      </div>
      <nav className="path-guides" aria-label="Трек">
        {available.map((t) => (
          <Link key={t.id} href={`/path?track=${t.id}`} className="path-guide-chip" aria-current={t.id === track.id ? 'page' : undefined}>
            {t.emoji} {t.title}
          </Link>
        ))}
        <Link href="/roadmap" className="path-guide-chip">
          🗺️ Уся мапа
        </Link>
      </nav>
      <PathView stages={stages} />
    </div>
  )
}
