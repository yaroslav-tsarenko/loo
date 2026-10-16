import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { PiChartBarFill, PiFlaskFill, PiMapTrifoldFill } from 'react-icons/pi'
import { LEVEL_LABEL } from '@/course'
import { TRACKS, type Track } from '@/content/tracks'
import type { ContentSnapshot } from '@/content/store'
import { levelInfo } from '@/progress/levels'
import { getContent } from '@/server/content'
import { activeCourse } from '@/server/courses/enrollment'
import { courseChips } from '@/server/courses/library'
import { coursePath } from '@/server/courses/path'
import { pathSections } from '@/server/courses/path-view'
import { listCourses, getCourse } from '@/server/courses/registry'
import { trackPath } from '@/server/services/path'
import { shellData } from '@/server/shell'
import { Button } from '@/ui/design/Button'
import { Card } from '@/ui/design/Card'
import { GameIcon } from '@/ui/design/GameIcon'
import { CourseChips } from '@/ui/courses/CourseChips'
import { CoursePath } from '@/ui/courses/CoursePath'
import { Icon } from '@/ui/icons/Icon'
import { PathView, type PathStageView } from '@/ui/path/PathView'

export const metadata: Metadata = { title: 'Карта' }

// Guides that some course covers: their tracks are shown as the course path.
async function courseGuides(): Promise<Set<string>> {
  const out = new Set<string>()
  for (const c of await listCourses()) {
    const bundle = await getCourse(c.id)
    for (const s of bundle?.sections ?? []) out.add(s.guideId)
  }
  return out
}

export default async function PathPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams
  const snapshot = await getContent()
  // Tracks of guides that no course covers yet keep their guide-based path (engineer map links).
  if (params.track || params.guide) {
    const covered = await courseGuides()
    const available = TRACKS.filter((t) => t.guides.some((g) => snapshot.guideById.has(g)))
    const track = available.find((t) => t.id === params.track) ?? (params.guide ? available.find((t) => t.guides.includes(params.guide!)) : undefined)
    if (track && !track.guides.some((g) => covered.has(g))) return <LegacyTrackPath snapshot={snapshot} track={track} />
  }
  const active = await activeCourse()
  if (!active) redirect('/courses')
  // xp, library and game state come with the shell (read once per request with the layout: src/server/shell.ts)
  const [path, shell] = await Promise.all([coursePath(snapshot, active), shellData()])
  if (!shell) redirect('/login')
  const { xp, library, game } = shell
  const { bundle, enrollment } = active
  const level = levelInfo(xp)
  const crowns = [...path.mastery.values()].reduce((s, m) => s + m.crowns, 0)
  const sections = pathSections(path)
  return (
    <div className="page path-page" data-width="wide">
      <header className="ghead">
        <span className="ghead-badge path-track-badge" aria-hidden="true">
          <Icon name={bundle.course.icon ?? 'px:book'} size={40} />
        </span>
        <div className="ghead-text">
          <h1 className="ghead-title">{bundle.course.title}</h1>
          <p className="ghead-lead">{bundle.course.subtitle}</p>
        </div>
      </header>
      <div className="path-summary">
        <Card variant="raised" tone="blue" padding="sm" className="path-summary-item">
          <span className="path-summary-value tabular">
            <GameIcon name="bolt" size={22} />
            {level.level}
          </span>
          <span className="path-summary-label">
            рівень · {game.rank.title}
          </span>
        </Card>
        <Card variant="raised" tone="yellow" padding="sm" className="path-summary-item">
          <span className="path-summary-value tabular">
            <GameIcon name="crown" size={22} />
            {crowns}
            <small>/{path.mastery.size * 5}</small>
          </span>
          <span className="path-summary-label">корон майстерності</span>
        </Card>
        <Card variant="raised" tone="green" padding="sm" className="path-summary-item">
          <span className="path-summary-value tabular">
            {path.view.lessonsTotal - path.view.lessonsLeft}
            <small>/{path.view.lessonsTotal}</small>
          </span>
          <span className="path-summary-label">уроків · {Math.round(path.view.ratio * 100)}%</span>
        </Card>
      </div>
      <CourseChips courses={courseChips(library)} />
      <div className="cp-level-row">
        <Link href={`/courses/${bundle.course.id}#level`} className="cp-level-chip">
          <PiChartBarFill aria-hidden="true" /> Рівень курсу: <strong>{LEVEL_LABEL[enrollment.level]}</strong> · змінити
        </Link>
        <Link href="/roadmap" className="cp-level-chip">
          <PiMapTrifoldFill aria-hidden="true" /> Мапа інженера
        </Link>
      </div>
      {!enrollment.placement && bundle.placement.enabled ? (
        <Card variant="raised" tone="purple" padding="md" className="cp-placement-card">
          <span className="cp-placement-icon" aria-hidden="true">
            <PiFlaskFill />
          </span>
          <span className="cp-placement-text">
            <strong>Вступний тест · {bundle.placement.bank ? `${Math.round(bundle.placement.maxQuestions / 3)}–${Math.round(bundle.placement.maxQuestions / 2)} хв` : '5–7 хв'}</strong>
            <span>Loo підбере рівень і перший розділ — те, що вже знаєш, буде зараховано.</span>
          </span>
          <Button href={`/placement?course=${bundle.course.id}`} variant="secondary">
            Пройти
          </Button>
        </Card>
      ) : null}
      <CoursePath sections={sections} />
    </div>
  )
}

async function LegacyTrackPath({ snapshot, track }: { snapshot: ContentSnapshot; track: Track }) {
  const available = TRACKS.filter((t) => t.guides.some((g) => snapshot.guideById.has(g)))
  if (!available.includes(track)) notFound()
  const [path, shell] = await Promise.all([trackPath(snapshot, track), shellData()])
  const xp = shell?.xp ?? 0
  const level = levelInfo(xp)
  const stages: PathStageView[] = path.stages.map((s) => ({
    icon: s.icon,
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
          <Icon name={track.icon} size={40} />
        </span>
        <div className="ghead-text">
          <h1 className="ghead-title">{track.title}: карта</h1>
          <p className="ghead-lead">{track.tagline} · за статтями (курс ще готується)</p>
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
        <Link href="/path" className="gchip">
          ← Мій курс
        </Link>
        <Link href="/roadmap" className="gchip">
          <PiMapTrifoldFill aria-hidden="true" /> Уся мапа
        </Link>
      </nav>
      <PathView stages={stages} />
    </div>
  )
}
