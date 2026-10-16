'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties, type Ref } from 'react'
import { PiBookOpenTextFill, PiCaretRightBold, PiCardsThreeFill, PiCheckBold, PiCodeBlockFill, PiExamFill, PiFlagCheckeredFill, PiLockSimpleFill, PiPlayFill, PiStarFill, PiTargetFill } from 'react-icons/pi'
import { SECTION_FALLBACK_ICON } from '@/content/icons'
import { CROWN_LABEL } from '@/progress/mastery'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'
import { Card } from '@/ui/design/Card'
import type { Tone } from '@/ui/design/cx'
import { GameIcon } from '@/ui/design/GameIcon'
import { Loo } from '@/ui/design/mascot/Loo'
import { Ring } from '@/ui/design/Ring'
import { Sheet } from '@/ui/design/Sheet'
import { Icon } from '@/ui/icons/Icon'
import { topicAnchor } from '@/ui/routes'
import type { CPNode, CPSection, CPTopic } from './types'

// The active course as a Duolingo path: section banner → topic card → lesson bubbles → topic test, and a
// section exam at the end. Future sections are locked (advisory) and offer «Перескочити розділ» (test-out).

const WAVE = [0, 56, 84, 56, 0, -56, -84, -56]
// Section banners cycle through the tones, starting with Loo's violet.
const SECTION_TONES: readonly Tone[] = ['violet', 'mint', 'blue', 'pink', 'orange']

function nodeMeta(node: CPNode): string {
  if (node.type !== 'lesson') {
    const best = node.bestScore === null ? '' : ` · найкраще ${Math.round(node.bestScore * 100)}%`
    return `${node.size} питань · ~${node.minutes} хв${best}`
  }
  if (node.kind === 'theory') return `Стаття · ~${node.minutes} хв`
  return `${node.size} вправ · ~${node.minutes} хв${node.optional ? ' · необовʼязково' : ''}`
}

function nodeAction(node: CPNode, locked: boolean): string {
  if (node.type === 'test') return node.done && !node.skipped ? 'Пройти ще раз' : 'Скласти тест'
  if (node.type === 'exam') return node.done && !node.skipped ? 'Пройти ще раз' : 'Почати екзамен'
  if (node.kind === 'theory') return 'Читати'
  if (node.done && !node.skipped) return 'Повторити +XP'
  return locked ? 'Все одно почати' : 'Почати +XP'
}

function Bubble({ node, offset, ratio, open, onOpen, locked, bubbleRef }: { node: CPNode; offset: number; ratio: number; open: boolean; onOpen: () => void; locked: boolean; bubbleRef?: Ref<HTMLButtonElement> }) {
  const state = node.current ? 'current' : node.done ? 'done' : 'upcoming'
  const glyph =
    node.type === 'exam' ? (
      <GameIcon name="crown" size={34} muted={!node.done && !node.current} />
    ) : node.type === 'test' ? (
      node.done ? <PiFlagCheckeredFill /> : <Icon name={node.icon} size={32} />
    ) : node.done ? (
      node.perfect ? <PiStarFill /> : <PiCheckBold />
    ) : node.current ? (
      <PiPlayFill />
    ) : locked ? (
      <PiLockSimpleFill />
    ) : (
      <Icon name={node.icon} size={32} />
    )
  const label = `${node.title}${node.done ? (node.skipped ? ' — зараховано' : ' — пройдено') : node.current ? ' — наступний крок' : locked ? ' — розділ закритий' : ''}`
  const bubble = (
    <button type="button" ref={bubbleRef} className="lesson-bubble" onClick={onOpen} aria-expanded={open} aria-label={label}>
      <span className="lesson-bubble-glyph" aria-hidden="true">
        {glyph}
      </span>
    </button>
  )
  return (
    <li
      className="lesson-node"
      style={{ '--x': `${offset}px` } as CSSProperties}
      data-state={state}
      data-kind={node.kind}
      data-type={node.type}
      data-perfect={node.done && node.perfect ? '' : undefined}
      data-optional={node.optional ? '' : undefined}
      data-locked={locked ? '' : undefined}
      data-side={offset > 0 ? 'right' : 'left'}
    >
      {node.current && !open ? <span className="path-node-tip">{node.type === 'lesson' ? 'Старт' : node.type === 'test' ? 'Тест' : 'Екзамен'}</span> : null}
      {node.current ? (
        <Ring value={ratio} size={96} stroke={8} label="Прогрес теми" className="lesson-bubble-ring">
          {bubble}
        </Ring>
      ) : (
        bubble
      )}
      {node.current ? (
        <span className="path-loo" aria-hidden="true">
          <Loo mood={node.type === 'lesson' ? 'wave' : 'thinking'} size={96} />
        </span>
      ) : null}
      {node.type !== 'lesson' ? <span className="cp-node-label">{node.type === 'test' ? 'Тест теми' : 'Екзамен розділу'}</span> : null}
      {open ? (
        <div className="lesson-pop lu-card" data-variant="raised" data-tone={node.done ? (node.perfect && node.type === 'lesson' ? 'yellow' : 'green') : node.current ? 'violet' : undefined} data-pad="md" role="dialog" aria-label={node.title}>
          <strong className="lesson-pop-title">
            <Icon name={node.icon} size={20} /> {node.title}
          </strong>
          <span className="lesson-pop-meta">
            {nodeMeta(node)}
            {node.challenge ? (
              <>
                {' · '}
                <GameIcon name="fire" size={14} /> челендж
              </>
            ) : null}
            {node.done ? (node.skipped ? ' · зараховано' : ' · пройдено') : ''}
          </span>
          {locked && !node.done ? (
            <span className="lesson-pop-meta cp-locked-note">
              <PiLockSimpleFill aria-hidden="true" /> Розділ ще закритий: заверши попередній або перескоч його екзаменом.
            </span>
          ) : null}
          <Button
            href={node.href}
            block
            variant={node.done || locked ? 'ghost' : node.type === 'exam' ? 'super' : 'primary'}
            icon={node.kind === 'theory' ? <PiBookOpenTextFill size={18} /> : node.type !== 'lesson' ? <PiFlagCheckeredFill size={18} /> : node.done ? <PiStarFill size={18} /> : <PiPlayFill size={18} />}
          >
            {nodeAction(node, locked)}
          </Button>
        </div>
      ) : null}
    </li>
  )
}

function TopicSheet({ topic, onClose }: { topic: CPTopic; onClose: () => void }) {
  const q = `chapter=${encodeURIComponent(topic.chapterId)}`
  return (
    <Sheet
      open
      onClose={onClose}
      title={
        <span className="path-sheet-title">
          <span className="path-sheet-icon" aria-hidden="true">
            <Icon name={topic.icon} size={32} />
          </span>
          {topic.title}
        </span>
      }
      description={`Тема ${topic.number} · ${topic.done}/${topic.total} кроків · ~${topic.minutes} хв`}
      footer={
        topic.theoryHref ? (
          <Button href={topic.theoryHref} size="lg" block icon={<PiBookOpenTextFill size={20} />}>
            {topic.crowns >= 2 ? 'Перечитати теорію' : 'Теорія'}
          </Button>
        ) : null
      }
    >
      <div className="path-crowns" role="img" aria-label={`${topic.crowns} з 5 корон`}>
        {Array.from({ length: 5 }, (_, i) => (
          <GameIcon key={i} name="crown" size={34} muted={i >= topic.crowns} />
        ))}
        <span className="path-crowns-label">{CROWN_LABEL[topic.crowns]}</span>
      </div>
      <p className="path-sheet-next">
        {topic.next ? (
          <>
            <PiTargetFill aria-hidden="true" /> Наступна корона: {topic.next}
          </>
        ) : (
          <>
            <GameIcon name="crown" size={18} /> Тему повністю опановано
          </>
        )}
      </p>
      <div className="path-sheet-grid">
        <Card href={`/quiz?${q}`} padding="sm" className="path-sheet-action">
          <span className="path-sheet-action-icon" data-tone="blue" aria-hidden="true">
            <PiExamFill />
          </span>
          Тести <small className="tabular">{topic.counts.quizzes}</small>
        </Card>
        <Card href={`/review?${q}&mode=all`} padding="sm" className="path-sheet-action">
          <span className="path-sheet-action-icon" data-tone="purple" aria-hidden="true">
            <PiCardsThreeFill />
          </span>
          Картки <small className="tabular">{topic.counts.cards}</small>
        </Card>
        <Card href={`/tasks?${q}`} padding="sm" className="path-sheet-action">
          <span className="path-sheet-action-icon" data-tone="orange" aria-hidden="true">
            <PiCodeBlockFill />
          </span>
          Задачі <small className="tabular">{topic.counts.tasks}</small>
        </Card>
      </div>
      <ol className="cp-sheet-lessons">
        {topic.nodes.map((n) => (
          <li key={n.id} data-done={n.done ? '' : undefined}>
            <Link href={n.href} className="cp-sheet-lesson">
              <span className="cp-sheet-lesson-icon" aria-hidden="true">{n.done ? <Icon name="px:check" size={20} /> : <Icon name={n.icon} size={20} />}</span>
              <span className="cp-sheet-lesson-title">{n.title}</span>
              <span className="cp-sheet-lesson-meta">{n.type === 'lesson' && n.kind === 'theory' ? `~${n.minutes} хв` : `${n.size}`}</span>
            </Link>
          </li>
        ))}
      </ol>
    </Sheet>
  )
}

function SectionBanner({ section, number }: { section: CPSection; number: number }) {
  return (
    <header className="path-banner">
      <span className="path-banner-emoji" aria-hidden="true">
        {section.state === 'locked' ? <PiLockSimpleFill /> : <Icon name={section.icon ?? SECTION_FALLBACK_ICON} size={28} />}
      </span>
      <div className="path-banner-text">
        <span className="path-banner-eyebrow">
          {section.kind === 'practice' ? 'Практика' : `Розділ ${number}`} · {section.levelLabel}
        </span>
        <h2 className="path-banner-title">{section.title}</h2>
        <span className="path-banner-bar" aria-hidden="true">
          <span style={{ width: `${Math.max(4, section.ratio * 100)}%` }} />
        </span>
      </div>
      <span className="path-banner-pct tabular">{section.known ? <PiCheckBold aria-label="Зараховано" /> : `${Math.round(section.ratio * 100)}%`}</span>
    </header>
  )
}

function TestOutCard({ section }: { section: CPSection }) {
  if (!section.exam) return null
  return (
    <div className="cp-testout lu-card" data-pad="md" data-tone="purple">
      <span className="cp-testout-crown" aria-hidden="true">
        <GameIcon name="crown" size={40} />
      </span>
      <div className="cp-testout-text">
        <strong>Вже знаєш це?</strong>
        <span>Склади екзамен розділу ({section.exam.size} питань) — і розділ зараховано, наступний відкрито.</span>
      </div>
      <Button href={section.exam.href} variant="super" icon={<PiFlagCheckeredFill size={18} />}>
        Перескочити розділ
      </Button>
    </div>
  )
}

export function CoursePath({ sections }: { sections: CPSection[] }) {
  const [sheet, setSheet] = useState<CPTopic | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set())
  const currentRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [])
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest('.lesson-node')) setOpen(null)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open])
  let wave = 0
  let pathNo = 0
  return (
    <div className="path cp">
      {sections.map((section, si) => {
        if (section.kind === 'path') pathNo++
        const locked = section.state === 'locked'
        // sections skipped by placement / test-out collapse to a topic list (lessons stay one tap away)
        const compact = section.known !== null && !expanded.has(section.id)
        const number = pathNo
        return (
          <section key={section.id} className="path-stage cp-section" data-tone={SECTION_TONES[si % SECTION_TONES.length]} data-state={section.state} data-known={section.known ?? undefined}>
            <SectionBanner section={section} number={number} />
            {section.known ? (
              <p className="cp-known">
                <PiCheckBold aria-hidden="true" /> {section.known === 'exam' ? 'Розділ зараховано екзаменом — уроки лишаються для повторення.' : 'Зараховано за вступним тестом — повертайся сюди будь-коли.'}
              </p>
            ) : null}
            {section.description && !section.known ? <p className="cp-section-lead">{section.description}</p> : null}
            {section.testOut && (locked || section.state === 'open') ? <TestOutCard section={section} /> : null}
            {locked || compact ? (
              <ul className="cp-locked-topics" data-known={compact ? '' : undefined}>
                {section.topics.map((t) => (
                  <li key={t.id}>
                    <button type="button" className="cp-locked-topic" onClick={() => setSheet(t)}>
                      <span className="cp-locked-icon" aria-hidden="true">
                        <Icon name={t.icon} size={22} />
                      </span>
                      <span className="cp-locked-title">{t.title}</span>
                      <span className="cp-locked-meta tabular">
                        {t.done}/{t.total}
                      </span>
                      {compact ? <PiCheckBold className="cp-locked-lock" aria-hidden="true" /> : <PiLockSimpleFill className="cp-locked-lock" aria-hidden="true" />}
                    </button>
                  </li>
                ))}
                {compact ? (
                  <li>
                    <button type="button" className="cp-expand" onClick={() => setExpanded((e) => new Set([...e, section.id]))}>
                      Показати всі уроки розділу
                    </button>
                  </li>
                ) : null}
              </ul>
            ) : (
              <>
                {section.known ? (
                  <button type="button" className="cp-expand" onClick={() => setExpanded((e) => new Set([...e].filter((id) => id !== section.id)))}>
                    Згорнути розділ
                  </button>
                ) : null}
                {section.topics.map((topic) => (
                  <div key={topic.id} id={topicAnchor(topic.id)} className="skill" data-state={topic.state === 'current' ? 'current' : topic.state === 'done' ? 'done' : 'upcoming'}>
                    <button type="button" className="lu-card skill-head" data-variant="interactive" data-pad="sm" data-tone={topic.state === 'current' ? 'violet' : undefined} onClick={() => setSheet(topic)}>
                      <Ring value={topic.ratio} size={56} stroke={6} tone={topic.crowns >= 5 ? 'yellow' : 'violet'} label={`Опановано ${Math.round(topic.ratio * 100)}%`} className="skill-ring">
                        <span className="skill-icon" aria-hidden="true">
                          {topic.crowns >= 5 ? <GameIcon name="crown" size={26} /> : <Icon name={topic.icon} size={22} />}
                        </span>
                      </Ring>
                      <span className="skill-text">
                        <span className="skill-title">
                          <span className="tabular">{topic.number}.</span> {topic.title}
                        </span>
                        <span className="skill-meta">
                          {topic.crowns > 0 ? (
                            <span className="skill-crowns">
                              <GameIcon name="crown" size={16} /> {topic.crowns}/5 · {CROWN_LABEL[topic.crowns]}
                            </span>
                          ) : (
                            CROWN_LABEL[0]
                          )}{' '}
                          · {topic.done}/{topic.total} кроків
                        </span>
                      </span>
                      <PiCaretRightBold className="skill-chevron" aria-hidden="true" />
                    </button>
                    <ol className="path-nodes">
                      {topic.nodes.map((node) => (
                        <Bubble
                          key={node.id}
                          node={node}
                          offset={WAVE[wave++ % WAVE.length]!}
                          ratio={topic.total ? topic.done / topic.total : 0}
                          locked={false}
                          open={open === node.id}
                          onOpen={() => setOpen(open === node.id ? null : node.id)}
                          bubbleRef={node.current ? currentRef : undefined}
                        />
                      ))}
                    </ol>
                  </div>
                ))}
                {section.exam ? (
                  <ol className="path-nodes cp-exam">
                    <Bubble
                      node={section.exam}
                      offset={0}
                      ratio={section.ratio}
                      locked={false}
                      open={open === section.exam.id}
                      onOpen={() => setOpen(open === section.exam!.id ? null : section.exam!.id)}
                      bubbleRef={section.exam.current ? currentRef : undefined}
                    />
                  </ol>
                ) : null}
              </>
            )}
            {section.state === 'done' && section.exam?.done && !section.known ? (
              <p className="cp-known">
                <Pill tone="yellow" size="sm" icon={<GameIcon name="crown" size={14} />}>
                  Екзамен складено
                </Pill>
              </p>
            ) : null}
          </section>
        )
      })}
      {sheet ? <TopicSheet topic={sheet} onClose={() => setSheet(null)} /> : null}
    </div>
  )
}
