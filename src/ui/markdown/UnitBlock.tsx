import type { Root } from 'mdast'
import { Fragment } from 'react'
import { exerciseView, quizKey, quizShape } from '@/content/blocks/quiz/view'
import { DIFFICULTY_LABEL, LEVEL_LABEL, type FlashcardUnit, type QuizUnit, type TaskUnit } from '@/content/model'
import { QuizInline } from '@/ui/study/QuizInline'
import { TaskInline } from '@/ui/study/TaskInline'
import { Tag } from '@/ui/Tag'
import { renderMdast, type RenderEnv } from './render'

function phrasingRoot(children: FlashcardUnit['question']): Root {
  return { type: 'root', children }
}

export async function renderPhrasing(children: FlashcardUnit['question'], env: RenderEnv) {
  const root = phrasingRoot(children)
  const node = await renderMdast(root, env)
  return node
}

async function FlashcardInline({ unit, env }: { unit: FlashcardUnit; env: RenderEnv }) {
  const [question, answer] = await Promise.all([renderPhrasing(unit.question, env), renderMdast(unit.answer, env)])
  return (
    <details className="unit-flash" id={`u-${unit.id}`} data-level={unit.level ?? undefined}>
      <summary>
        <span className="toggle-arrow" aria-hidden="true" />
        <span className="unit-flash-q">{question}</span>
        <span className="unit-flash-tags">
          {unit.frequency ? <Tag>{unit.frequency}</Tag> : null}
          {unit.qtype ? <Tag color="default">{unit.qtype}</Tag> : null}
        </span>
      </summary>
      <div className="unit-flash-a prose-flow">{answer}</div>
      <div className="unit-foot">
        {unit.level ? <Tag>{LEVEL_LABEL[unit.level]}</Tag> : null}
        <code>{unit.id}</code>
      </div>
    </details>
  )
}

async function QuizBlock({ unit, env }: { unit: QuizUnit; env: RenderEnv }) {
  const [prompt, body, explanation, ...options] = await Promise.all([
    renderPhrasing(unit.prompt, env),
    unit.body.children.length > 0 ? renderMdast(unit.body, env) : Promise.resolve(null),
    unit.explanation ? renderMdast(unit.explanation, env) : Promise.resolve(null),
    ...unit.options.map((o) => renderPhrasing(o.content, env)),
  ])
  const shape = quizShape(unit)
  // Article quizzes are practice: the key ships for an instant verdict; XP is granted only by the server's own check.
  return (
    <QuizInline
      unitId={unit.id}
      mode={unit.mode}
      multi={shape.multi}
      free={shape.free}
      level={unit.level ? LEVEL_LABEL[unit.level] : null}
      prompt={prompt}
      body={body}
      explanation={explanation}
      answerKey={quizKey(unit)}
      options={unit.options.map((o, i) => ({ id: o.id, content: options[i] }))}
      exercise={exerciseView(unit.exercise)}
      variant="inline"
    />
  )
}

async function TaskBlock({ unit, env }: { unit: TaskUnit; env: RenderEnv }) {
  const [title, statement, solution, ...hints] = await Promise.all([
    renderPhrasing(unit.title, env),
    renderMdast(unit.statement, env),
    unit.solution ? renderMdast(unit.solution, env) : Promise.resolve(null),
    ...unit.hints.map((h) => renderMdast(h, env)),
  ])
  return (
    <TaskInline
      unitId={unit.id}
      title={title}
      difficulty={DIFFICULTY_LABEL[unit.difficulty]}
      difficultyKey={unit.difficulty}
      level={unit.level ? LEVEL_LABEL[unit.level] : null}
      statement={statement}
      hints={hints.map((h, i) => (
        <Fragment key={i}>{h}</Fragment>
      ))}
      solution={solution}
      code={unit.code}
      variant="inline"
    />
  )
}

export async function UnitBlock({ unitId, env }: { unitId: string; env: RenderEnv }) {
  const unit = env.snapshot.units.get(unitId)
  if (!unit) return null
  if (unit.kind === 'flashcard') return <FlashcardInline unit={unit} env={env} />
  if (unit.kind === 'quiz') return <QuizBlock unit={unit} env={env} />
  return <TaskBlock unit={unit} env={env} />
}
