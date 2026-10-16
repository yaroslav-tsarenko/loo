import { randomBytes } from 'node:crypto'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LEVEL_LABEL, placementCandidates, placementTest } from '@/course'
import { t } from '@/i18n'
import { safeRedirectPath } from '@/lib/redirect'
import { requireUser } from '@/server/auth'
import { startFromZero } from '@/server/actions/courses'
import { getContent } from '@/server/content'
import { placementSeed } from '@/server/courses/placement-core'
import { defaultCourse, getCourse } from '@/server/courses/registry'
import { renderLessonItems } from '@/server/services/lessons'
import { param } from '@/ui/auth/AuthShell'
import { Button } from '@/ui/design/Button'
import { EmptyState } from '@/ui/design/EmptyState'
import { PlacementPlayer } from '@/ui/placement/PlacementPlayer'

export const metadata: Metadata = { title: 'Вступний тест' }

// Stateless adaptive placement (src/course/select/placement.ts). The page pre-renders every question this run can
// ask (≤ perLevel per level); the client sends its answers to placementStep, which grades them on the server.
export default async function PlacementPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser()
  const params = await searchParams
  const courseParam = param(params, 'course')
  const bundle = courseParam ? await getCourse(courseParam) : await defaultCourse()
  if (!bundle) notFound()
  const id = bundle.course.id
  if (!bundle.placement.enabled) {
    return (
      <div className="page">
        <EmptyState title={t('placement.disabled')} mood="thinking" action={<Button href={`/courses/${id}`}>{bundle.course.title}</Button>} />
      </div>
    )
  }
  const nonce = randomBytes(8).toString('hex')
  const seed = placementSeed(user.id, nonce)
  const snapshot = await getContent()
  const candidates = placementCandidates(bundle, seed)
  const items = await renderLessonItems(
    snapshot,
    candidates.map((q) => ({ kind: 'unit' as const, id: q })),
  )
  const first = placementTest(bundle, [], seed)
  const next = safeRedirectPath(param(params, 'next'), '/path')
  return (
    <PlacementPlayer
      key={nonce}
      course={{ id, title: bundle.course.title, icon: bundle.course.icon }}
      nonce={nonce}
      first={first.next}
      maxQuestions={bundle.placement.maxQuestions}
      items={items}
      sections={bundle.sections.map((s) => ({ id: s.id, index: s.index, title: s.title, icon: s.icon }))}
      levels={Object.fromEntries(bundle.course.levels.map((l) => [l, LEVEL_LABEL[l]]))}
      next={next}
      zero={
        <form action={startFromZero}>
          <input type="hidden" name="course" value={id} />
          <input type="hidden" name="next" value="/path" />
          <Button type="submit" variant="ghost" size="lg" block>
            {t('placement.zero')}
          </Button>
        </form>
      }
    />
  )
}
