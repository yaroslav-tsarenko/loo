import 'server-only'
import type { Root } from 'mdast'
import { Fragment } from 'react'
import { gradedQuiz } from '@/content/blocks/quiz/view'
import { speechLangFor } from '@/server/courses/target'
import { optionIds } from '@/server/quiz-ids'
import { ListenExercise } from '@/ui/lang/ListenExercise'
import { PairAudio, PairOption } from '@/ui/lang/PairExercise'
import { WordInline } from '@/ui/lang/WordCard'
import { DIFFICULTY_LABEL, LEVEL_LABEL, type FlashcardUnit, type QuizUnit, type TaskUnit } from '@/content/model'
import { contentMeta } from '@/i18n'
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
          {unit.frequency ? <Tag>{contentMeta(unit.frequency, env.locale)}</Tag> : null}
          {unit.qtype ? <Tag color="default">{contentMeta(unit.qtype, env.locale)}</Tag> : null}
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
    // only [!speak] shows its explanation up front; every other quiz gets it with the server's verdict
    unit.speak && unit.explanation ? renderMdast(unit.explanation, env) : Promise.resolve(null),
    ...unit.options.map((o) => renderPhrasing(o.content, env)),
  ])
  // Article quizzes are the same units as lesson / test / exam / placement questions, so they ship exactly what graded
  // contexts ship: shuffled options with opaque ids (src/server/quiz-ids.ts), no key. answerQuiz grades the answer
  // (it did anyway, for XP) and returns the key and the explanation.
  const payload = gradedQuiz(unit, Math.random, optionIds.idOf(unit))
  const shape = payload
  // Language blocks: the spoken text and the key stay on the server (audio is fetched on play, answers are checked by
  // answerQuiz) — even in articles, the transcript of a listening item IS its answer.
  if (unit.mode === 'listen' || unit.mode === 'pair' || unit.mode === 'speak') {
    const lang = await speechLangFor(unit)
    const pair = unit.pair
    const audio = unit.listen ? (
      <ListenExercise unitId={unit.id} lang={lang} slow={unit.listen.slow} dialogue={new Set(unit.listen.lines.map((l) => l.speaker).filter(Boolean)).size > 1} />
    ) : pair ? (
      <PairAudio unitId={unit.id} lang={lang} />
    ) : null
    return (
      <QuizInline
        unitId={unit.id}
        mode={unit.mode}
        multi={shape.multi}
        free={shape.free}
        level={unit.level ?? null}
        prompt={prompt}
        body={
          <>
            {audio}
            {body}
          </>
        }
        // listen / pair: the explanation may quote the transcript — it comes with the server's verdict instead
        explanation={explanation}
        options={payload.options.map(({ id, index: i }) => ({ id, content: pair ? <PairOption word={pair.words[i]!.word} ipa={pair.words[i]!.ipa} lang={lang} /> : options[i] }))}
        // [!listen] type: fill — the form without its answers (they come with the verdict)
        exercise={payload.exercise}
        variant="inline"
        lang={lang}
        speak={unit.speak ? { text: unit.speak.text, ipa: unit.speak.ipa, ipaUs: unit.speak.ipaUs, translation: unit.speak.translation, slow: unit.speak.slow } : null}
      />
    )
  }
  return (
    <QuizInline
      unitId={unit.id}
      mode={unit.mode}
      multi={shape.multi}
      free={shape.free}
      level={unit.level ?? null}
      prompt={prompt}
      body={body}
      options={payload.options.map(({ id, index: i }) => ({ id, content: options[i] }))}
      exercise={payload.exercise}
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
      level={unit.level ?? null}
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
  const unit = env.units?.get(unitId) ?? env.snapshot.units.get(unitId)
  if (!unit) return null
  if (unit.kind === 'flashcard' && unit.word) return <WordInline id={unit.id} word={unit.word} lang={await speechLangFor(unit)} level={unit.level ?? null} />
  if (unit.kind === 'flashcard') return <FlashcardInline unit={unit} env={env} />
  if (unit.kind === 'quiz') return <QuizBlock unit={unit} env={env} />
  return <TaskBlock unit={unit} env={env} />
}
