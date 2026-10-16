import { EXAM_ICON, TEST_ICON } from '@/content/icons'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { requireUser, userScope } from '@/server/auth'
import { learnerLevel, nextStepAfter, stepHref } from '@/server/courses/lessons'
import { nextLabel } from '@/server/courses/player'
import { courseFor } from '@/server/courses/registry'
import { readTestRecord, sectionUnfinished } from '@/server/courses/tests'
import { attemptSeed, drawTest, resolveTest } from '@/server/courses/tests-core'
import { renderLessonItems } from '@/server/services/lessons'
import { learnerLevelFrom, playerGameFrom, shellData } from '@/server/shell'
import { EmptyState } from '@/ui/design/EmptyState'
import { Button } from '@/ui/design/Button'
import { LessonPlayer } from '@/ui/lesson/LessonPlayer'

export const metadata: Metadata = { title: 'Тест' }

function decode(raw: string): string {
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

// /test/<course>:<section>:<topic>:test (topic test) and /test/<course>:<section>:exam (section exam). Attempt n = started attempts + 1,
// drawn with the seed `${userId}:${n}`; the attempt is recorded when the learner presses «Почати».
export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const id = decode((await params).id)
  const bundle = await courseFor(id)
  const test = bundle ? resolveTest(bundle, id) : null
  if (!bundle || !test) notFound()
  // hearts, bucks and the course level come with the shell (src/server/shell.ts)
  const shell = await shellData()
  if (!shell) redirect('/login')
  const { snapshot } = shell
  const [record, level, unfinished] = await Promise.all([userScope((db, userId) => readTestRecord(db, userId, test)), learnerLevelFrom(shell, bundle.course.id, () => learnerLevel(bundle.course.id)), sectionUnfinished(test)])
  const attempt = (record?.attempts ?? 0) + 1
  const built = drawTest(test, attemptSeed(user.id, attempt))
  const items = built ? await renderLessonItems(snapshot, built.questions.map((q) => ({ kind: 'unit' as const, id: q }))) : []
  if (!built || items.length !== built.questions.length) {
    return (
      <div className="page">
        <EmptyState title="Тест тимчасово недоступний" mood="sad" action={<Button href="/path">До шляху</Button>}>
          Частина питань цього тесту зараз не знайдена у вмісті курсу. Спробуй пізніше.
        </EmptyState>
      </div>
    )
  }
  const exam = test.kind === 'section-exam'
  const next = nextStepAfter(bundle, level, test.id)
  const game = playerGameFrom(shell)
  const title = exam ? test.section.title : test.topic!.title
  return (
    <LessonPlayer
      key={`${test.id}#${attempt}`}
      lessonId={test.id}
      title={title}
      icon={exam ? EXAM_ICON : TEST_ICON}
      chapterTitle={exam ? `${bundle.course.title} · екзамен розділу` : `${test.section.title} · тест теми`}
      chapterHref="/path"
      items={items}
      nextHref={next ? stepHref(next) : null}
      nextLabel={nextLabel(next)}
      test={{
        id: test.id,
        kind: test.kind,
        attempt,
        needed: built.needed,
        total: built.questions.length,
        pass: built.pass,
        testOut: exam && unfinished && !record?.passed,
        bestScore: record?.graded ? record.bestScore : null,
        passedBefore: Boolean(record?.passed),
        backHref: '/path',
      }}
      {...game}
    />
  )
}
