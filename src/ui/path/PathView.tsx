'use client'

import { useEffect, useRef, useState, type CSSProperties, type Ref } from 'react'
import { PiBookOpenTextFill, PiCaretRightBold, PiCardsThreeFill, PiCheckBold, PiCodeBlockFill, PiExamFill, PiPlayFill, PiStarFill, PiTargetFill } from 'react-icons/pi'
import { CROWN_LABEL } from '@/progress/mastery'
import { Button } from '@/ui/design/Button'
import { Card } from '@/ui/design/Card'
import type { Tone } from '@/ui/design/cx'
import { GameIcon } from '@/ui/design/GameIcon'
import { Loo } from '@/ui/design/mascot/Loo'
import { Ring } from '@/ui/design/Ring'
import { Sheet } from '@/ui/design/Sheet'
import { Icon } from '@/ui/icons/Icon'

export interface PathLessonView {
  id: string
  kind: string
  // icon refs for <Icon name> (src/content/icons.ts)
  icon: string
  title: string
  minutes: number
  size: number
  href: string
  done: boolean
  perfect: boolean
  current: boolean
}

export interface PathNodeView {
  lessons: PathLessonView[]
  id: string
  number: number
  title: string
  icon: string
  href: string
  crowns: number
  ratio: number
  next: string | null
  state: 'done' | 'current' | 'upcoming'
  minutes: number
  counts: { quizzes: string; cards: string; tasks: string }
}

export interface PathStageView {
  icon: string
  title: string
  ratio: number
  nodes: PathNodeView[]
}

// Horizontal offsets that make the path wind like a river.
const WAVE = [0, 56, 84, 56, 0, -56, -84, -56]
// Section banners cycle through the tones, starting with Loo's violet.
const STAGE_TONES: readonly Tone[] = ['violet', 'mint', 'blue', 'pink', 'orange']

function SkillSheet({ node, onClose }: { node: PathNodeView; onClose: () => void }) {
  const q = `chapter=${encodeURIComponent(node.id)}`
  return (
    <Sheet
      open
      onClose={onClose}
      title={
        <span className="path-sheet-title">
          <span className="path-sheet-icon" aria-hidden="true">
            <Icon name={node.icon} size={32} />
          </span>
          {node.title}
        </span>
      }
      description={`Розділ ${node.number} · ~${node.minutes} хв`}
      footer={
        <Button href={node.href} size="lg" block icon={<PiBookOpenTextFill size={20} />}>
          {node.crowns >= 2 ? 'Перечитати' : 'Читати'}
        </Button>
      }
    >
      <div className="path-crowns" role="img" aria-label={`${node.crowns} з 5 корон`}>
        {Array.from({ length: 5 }, (_, i) => (
          <GameIcon key={i} name="crown" size={34} muted={i >= node.crowns} />
        ))}
        <span className="path-crowns-label">{CROWN_LABEL[node.crowns]}</span>
      </div>
      <p className="path-sheet-next">
        {node.next ? (
          <>
            <PiTargetFill aria-hidden="true" /> Наступна корона: {node.next}
          </>
        ) : (
          <>
            <GameIcon name="crown" size={18} /> Розділ повністю опановано
          </>
        )}
      </p>
      <div className="path-sheet-grid">
        <Card href={`/quiz?${q}`} padding="sm" className="path-sheet-action">
          <span className="path-sheet-action-icon" data-tone="blue" aria-hidden="true">
            <PiExamFill />
          </span>
          Тести <small className="tabular">{node.counts.quizzes}</small>
        </Card>
        <Card href={`/review?${q}&mode=all`} padding="sm" className="path-sheet-action">
          <span className="path-sheet-action-icon" data-tone="purple" aria-hidden="true">
            <PiCardsThreeFill />
          </span>
          Картки <small className="tabular">{node.counts.cards}</small>
        </Card>
        <Card href={`/tasks?${q}`} padding="sm" className="path-sheet-action">
          <span className="path-sheet-action-icon" data-tone="orange" aria-hidden="true">
            <PiCodeBlockFill />
          </span>
          Задачі <small className="tabular">{node.counts.tasks}</small>
        </Card>
      </div>
    </Sheet>
  )
}

function LessonBubble({ lesson, offset, ratio, onOpen, open, bubbleRef }: { lesson: PathLessonView; offset: number; ratio: number; onOpen: () => void; open: boolean; bubbleRef?: Ref<HTMLButtonElement> }) {
  const state = lesson.current ? 'current' : lesson.done ? 'done' : 'upcoming'
  const glyph = lesson.done ? lesson.perfect ? <PiStarFill /> : <PiCheckBold /> : lesson.current ? <PiPlayFill /> : <Icon name={lesson.icon} size={32} />
  const bubble = (
    <button type="button" ref={bubbleRef} className="lesson-bubble" onClick={onOpen} aria-expanded={open} aria-label={`${lesson.title}${lesson.done ? ' — пройдено' : lesson.current ? ' — наступний урок' : ''}`}>
      <span className="lesson-bubble-glyph" aria-hidden="true">
        {glyph}
      </span>
    </button>
  )
  return (
    <li className="lesson-node" style={{ '--x': `${offset}px` } as CSSProperties} data-state={state} data-kind={lesson.kind} data-perfect={lesson.done && lesson.perfect ? '' : undefined} data-side={offset > 0 ? 'right' : 'left'}>
      {lesson.current && !open ? <span className="path-node-tip">Старт</span> : null}
      {lesson.current ? (
        <Ring value={ratio} size={96} stroke={8} label="Прогрес розділу" className="lesson-bubble-ring">
          {bubble}
        </Ring>
      ) : (
        bubble
      )}
      {lesson.current ? (
        <span className="path-loo" aria-hidden="true">
          <Loo mood="wave" size={96} />
        </span>
      ) : null}
      {open ? (
        <div className="lesson-pop lu-card" data-variant="raised" data-tone={lesson.done ? (lesson.perfect ? 'yellow' : 'green') : lesson.current ? 'violet' : undefined} data-pad="md" role="dialog" aria-label={lesson.title}>
          <strong className="lesson-pop-title">
            <Icon name={lesson.icon} size={20} /> {lesson.title}
          </strong>
          <span className="lesson-pop-meta">
            {lesson.kind === 'theory' ? `Стаття · ~${lesson.minutes} хв` : `${lesson.size} вправ · ~${lesson.minutes} хв`}
            {lesson.done ? ' · пройдено' : ''}
          </span>
          <Button href={lesson.href} block variant={lesson.done ? 'ghost' : 'primary'} icon={lesson.kind === 'theory' ? <PiBookOpenTextFill size={18} /> : lesson.done ? <PiStarFill size={18} /> : <PiPlayFill size={18} />}>
            {lesson.kind === 'theory' ? 'Читати' : lesson.done ? 'Повторити +XP' : 'Почати +XP'}
          </Button>
        </div>
      ) : null}
    </li>
  )
}

export function PathView({ stages }: { stages: PathStageView[] }) {
  const [sheet, setSheet] = useState<PathNodeView | null>(null)
  const [openLesson, setOpenLesson] = useState<string | null>(null)
  const currentRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [])
  useEffect(() => {
    if (!openLesson) return
    const close = (e: MouseEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest('.lesson-node')) setOpenLesson(null)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [openLesson])
  let wave = 0
  return (
    <div className="path">
      {stages.map((stage, si) => (
        <section key={stage.title} className="path-stage" data-tone={STAGE_TONES[si % STAGE_TONES.length]}>
          <header className="path-banner">
            <span className="path-banner-emoji" aria-hidden="true">
              <Icon name={stage.icon} size={28} />
            </span>
            <div className="path-banner-text">
              <span className="path-banner-eyebrow">Секція {si + 1}</span>
              <h2 className="path-banner-title">{stage.title}</h2>
              <span className="path-banner-bar" aria-hidden="true">
                <span style={{ width: `${Math.max(4, stage.ratio * 100)}%` }} />
              </span>
            </div>
            <span className="path-banner-pct tabular">{Math.round(stage.ratio * 100)}%</span>
          </header>
          {stage.nodes.map((node) => (
            <div key={node.id} className="skill" data-state={node.state}>
              <button type="button" className="lu-card skill-head" data-variant="interactive" data-pad="sm" data-tone={node.state === 'current' ? 'violet' : undefined} onClick={() => setSheet(node)}>
                <Ring value={node.ratio} size={56} stroke={6} tone={node.crowns >= 5 ? 'yellow' : 'violet'} label={`Опановано ${Math.round(node.ratio * 100)}%`} className="skill-ring">
                  <span className="skill-icon" aria-hidden="true">
                    {node.crowns >= 5 ? <GameIcon name="crown" size={26} /> : <Icon name={node.icon} size={22} />}
                  </span>
                </Ring>
                <span className="skill-text">
                  <span className="skill-title">
                    <span className="tabular">{node.number}.</span> {node.title}
                  </span>
                  <span className="skill-meta">
                    {node.crowns > 0 ? (
                      <span className="skill-crowns">
                        <GameIcon name="crown" size={16} /> {node.crowns}/5 · {CROWN_LABEL[node.crowns]}
                      </span>
                    ) : (
                      CROWN_LABEL[0]
                    )}{' '}
                    · {node.lessons.filter((l) => l.done).length}/{node.lessons.length} уроків
                  </span>
                </span>
                <PiCaretRightBold className="skill-chevron" aria-hidden="true" />
              </button>
              <ol className="path-nodes">
                {node.lessons.map((lesson) => (
                  <LessonBubble
                    key={lesson.id}
                    lesson={lesson}
                    offset={WAVE[wave++ % WAVE.length]!}
                    ratio={node.ratio}
                    open={openLesson === lesson.id}
                    onOpen={() => setOpenLesson(openLesson === lesson.id ? null : lesson.id)}
                    bubbleRef={lesson.current ? currentRef : undefined}
                  />
                ))}
              </ol>
            </div>
          ))}
        </section>
      ))}
      {sheet ? <SkillSheet node={sheet} onClose={() => setSheet(null)} /> : null}
    </div>
  )
}
