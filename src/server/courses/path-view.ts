import 'server-only'
import { EXAM_ICON, TEST_ICON, TOPIC_FALLBACK_ICONS } from '@/content/icons'
import { LEVEL_LABEL, type PathLessonNode, type PathTestNode, type PathExamNode } from '@/course'
import type { CPNode, CPSection } from '@/ui/courses/types'
import { lessonHref, testHref, type CoursePath } from './path'

function node(n: PathLessonNode | PathTestNode | PathExamNode, theoryHref: string | null): CPNode {
  if (n.type === 'lesson') {
    return {
      id: n.id,
      type: 'lesson',
      kind: n.kind,
      icon: n.lesson.icon,
      title: n.lesson.title,
      href: n.kind === 'theory' && theoryHref ? theoryHref : lessonHref(n.id),
      minutes: n.minutes,
      size: n.size,
      done: n.done,
      skipped: n.skipped,
      current: n.current,
      optional: n.optional,
      challenge: n.challenge,
      perfect: n.perfect,
      bestScore: null,
    }
  }
  return {
    id: n.id,
    type: n.type,
    kind: n.type,
    icon: n.type === 'test' ? TEST_ICON : EXAM_ICON,
    title: n.type === 'test' ? 'Тест теми' : 'Екзамен розділу',
    href: testHref(n.id),
    minutes: Math.max(1, Math.round(n.questions * 0.6)),
    size: n.questions,
    done: n.done,
    skipped: n.skipped,
    current: n.current,
    optional: false,
    challenge: false,
    perfect: (n.bestScore ?? 0) >= 1,
    bestScore: n.bestScore,
  }
}

// CoursePath → what the client path component renders.
// Page weight: a locked, finished or credited section shows only its topic list, so its lessons stay on the server until the
// learner opens a topic or expands the section (/api/path-section). The English course's map went from 2.1 MB of
// HTML to a fraction of it.
export function lightSections(sections: CPSection[]): CPSection[] {
  return sections.map((s) => (s.state === 'locked' || s.state === 'done' || s.known !== null ? { ...s, lazy: true, topics: s.topics.map((t) => ({ ...t, nodes: [] })) } : s))
}

export function pathSections(path: CoursePath): CPSection[] {
  let topicNo = 0
  return path.view.sections.map((s) => {
    const levelLabel = s.section.minLevel === s.section.level ? LEVEL_LABEL[s.section.level] : `${LEVEL_LABEL[s.section.minLevel]} → ${LEVEL_LABEL[s.section.level]}`
    return {
      id: s.section.id,
      index: s.section.index,
      title: s.section.title,
      icon: s.section.icon,
      description: s.section.description,
      kind: s.section.kind,
      planned: s.planned,
      levelLabel,
      state: s.state,
      known: s.known,
      ratio: s.ratio,
      done: s.done,
      total: s.total,
      testOut: Boolean(s.exam && !s.exam.done && s.exam.testOut.eligible && s.state !== 'done'),
      exam: s.exam ? node(s.exam, null) : null,
      topics: s.topics.map((t, i) => {
        topicNo++
        const m = path.mastery.get(t.topic.id)
        const theory = path.theoryHref.get(t.topic.chapterId) ?? null
        return {
          id: t.topic.id,
          chapterId: t.topic.chapterId,
          number: t.topic.number ?? topicNo,
          title: t.topic.title,
          icon: t.topic.icon ?? TOPIC_FALLBACK_ICONS[i % TOPIC_FALLBACK_ICONS.length]!,
          theoryHref: theory,
          crowns: m?.crowns ?? 0,
          ratio: m?.ratio ?? 0,
          next: m?.next ?? null,
          state: t.state,
          done: t.done,
          total: t.total,
          minutes: t.topic.minutes,
          counts: m
            ? {
                quizzes: `${m.signals.quizzes.answered}/${m.signals.quizzes.total}`,
                cards: `${m.signals.cards.reviewing}/${m.signals.cards.total}`,
                tasks: `${m.signals.tasks.solved}/${m.signals.tasks.total}`,
              }
            : { quizzes: '0/0', cards: '0/0', tasks: '0/0' },
          nodes: t.nodes.map((n) => node(n, theory)),
        }
      }),
    }
  })
}
