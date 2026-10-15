'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CROWN_LABEL } from '@/progress/mastery'

export interface PathLessonView {
  id: string
  kind: string
  emoji: string
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
  emoji: string
  title: string
  ratio: number
  nodes: PathNodeView[]
}

// Horizontal offsets that make the path wind like a river.
const WAVE = [0, 56, 84, 56, 0, -56, -84, -56]

function NodeRing({ ratio }: { ratio: number }) {
  const r = 44
  const c = 2 * Math.PI * r
  return (
    <svg className="path-node-ring" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r={r} className="path-node-ring-track" />
      <circle cx="50" cy="50" r={r} className="path-node-ring-fill" strokeDasharray={c} strokeDashoffset={c * (1 - ratio)} />
    </svg>
  )
}

function Sheet({ node, onClose }: { node: PathNodeView; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const el = ref.current
    if (el && !el.open) el.showModal()
  }, [])
  const q = `chapter=${encodeURIComponent(node.id)}`
  return (
    <dialog ref={ref} className="path-sheet" onClose={onClose} onClick={(e) => e.target === ref.current && ref.current?.close()}>
      <div className="path-sheet-body">
        <div className="path-sheet-head">
          <span className="path-sheet-icon" aria-hidden="true">
            {node.icon}
          </span>
          <div>
            <span className="eyebrow">
              Розділ {node.number} · ~{node.minutes} хв
            </span>
            <h2 className="path-sheet-title">{node.title}</h2>
          </div>
        </div>
        <div className="path-crowns" aria-label={`${node.crowns} з 5 корон`}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} data-on={i < node.crowns ? '' : undefined} aria-hidden="true">
              👑
            </span>
          ))}
          <span className="path-crowns-label">{CROWN_LABEL[node.crowns]}</span>
        </div>
        {node.next ? <p className="path-sheet-next">🎯 Наступна корона: {node.next}</p> : <p className="path-sheet-next">🏆 Розділ повністю опановано</p>}
        <div className="path-sheet-actions">
          <Link href={node.href} className="mission-cta">
            📖 {node.crowns >= 2 ? 'Перечитати' : 'Читати'}
          </Link>
          <div className="path-sheet-grid">
            <Link href={`/quiz?${q}`} className="path-sheet-action">
              🎲 Тести <small>{node.counts.quizzes}</small>
            </Link>
            <Link href={`/review?${q}&mode=all`} className="path-sheet-action">
              🧠 Картки <small>{node.counts.cards}</small>
            </Link>
            <Link href={`/tasks?${q}`} className="path-sheet-action">
              🛠️ Задачі <small>{node.counts.tasks}</small>
            </Link>
          </div>
        </div>
        <button type="button" className="path-sheet-close" onClick={() => ref.current?.close()}>
          Закрити
        </button>
      </div>
    </dialog>
  )
}

function LessonBubble({ lesson, offset, onOpen, open, bubbleRef }: { lesson: PathLessonView; offset: number; onOpen: () => void; open: boolean; bubbleRef?: React.Ref<HTMLButtonElement> }) {
  const state = lesson.current ? 'current' : lesson.done ? 'done' : 'upcoming'
  return (
    <li className="lesson-node" style={{ '--x': `${offset}px` } as React.CSSProperties} data-state={state} data-kind={lesson.kind}>
      {lesson.current && !open ? <span className="path-node-tip">Старт</span> : null}
      <button type="button" ref={bubbleRef} className="lesson-bubble" onClick={onOpen} aria-expanded={open} aria-label={`${lesson.title}${lesson.done ? ' — пройдено' : ''}`}>
        <span aria-hidden="true">{lesson.done ? (lesson.perfect ? '⭐' : '✔️') : lesson.emoji}</span>
      </button>
      {open ? (
        <div className="lesson-pop" role="dialog" aria-label={lesson.title}>
          <strong className="lesson-pop-title">
            {lesson.emoji} {lesson.title}
          </strong>
          <span className="lesson-pop-meta">
            {lesson.kind === 'theory' ? `Стаття · ~${lesson.minutes} хв` : `${lesson.size} вправ · ~${lesson.minutes} хв`}
            {lesson.done ? ' · пройдено' : ''}
          </span>
          <Link href={lesson.href} className="lesson-primary">
            {lesson.kind === 'theory' ? '📖 Читати' : lesson.done ? 'Повторити +XP' : 'Почати +XP'}
          </Link>
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
      {stages.map((stage) => (
        <section key={stage.title} className="path-stage">
          <header className="path-banner">
            <span className="path-banner-emoji" aria-hidden="true">
              {stage.emoji}
            </span>
            <div className="path-banner-text">
              <h2 className="path-banner-title">{stage.title}</h2>
              <span className="path-banner-bar" aria-hidden="true">
                <span style={{ transform: `scaleX(${stage.ratio})` }} />
              </span>
            </div>
            <span className="path-banner-pct tabular">{Math.round(stage.ratio * 100)}%</span>
          </header>
          {stage.nodes.map((node) => (
            <div key={node.id} className="skill" data-state={node.state}>
              <button type="button" className="skill-head" onClick={() => setSheet(node)}>
                <span className="skill-ring">
                  <NodeRing ratio={node.ratio} />
                  <span className="skill-icon" aria-hidden="true">
                    {node.crowns >= 5 ? '🏆' : node.icon}
                  </span>
                </span>
                <span className="skill-text">
                  <span className="skill-title">
                    <span className="tabular">{node.number}.</span> {node.title}
                  </span>
                  <span className="skill-meta">
                    {node.crowns > 0 ? `👑 ${node.crowns}/5 · ${CROWN_LABEL[node.crowns]}` : CROWN_LABEL[0]} · {node.lessons.filter((l) => l.done).length}/{node.lessons.length} уроків
                  </span>
                </span>
                <span className="skill-chevron" aria-hidden="true">
                  ›
                </span>
              </button>
              <ol className="path-nodes">
                {node.lessons.map((lesson) => (
                  <LessonBubble
                    key={lesson.id}
                    lesson={lesson}
                    offset={WAVE[wave++ % WAVE.length]!}
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
      {sheet ? <Sheet node={sheet} onClose={() => setSheet(null)} /> : null}
    </div>
  )
}
