'use client'

import { AnimatePresence, LayoutGroup, m } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { ConsolePanel, Panel, SPRING, TokenList, VizGlyph } from '../engine/Panel'
import type { Token, VizIcon } from '../engine/types'
import { STATE_ICON, type PromiseState } from './scenarios'

type Kind = 'then' | 'catch' | 'finally'

interface Job {
  id: number
  kind: Kind
  runs: boolean
}

interface State {
  status: PromiseState
  value: string | null
  handlers: Array<{ id: number; kind: Kind }>
  queue: Job[]
  log: string[]
  code: string[]
  notice: string | null
  shake: number
  seq: number
}

const VALUE = "'піца'"
const REASON = "Error('згоріла')"

const INITIAL: State = {
  status: 'pending',
  value: null,
  handlers: [],
  queue: [],
  log: [],
  code: ['const p = new Promise((resolve, reject) => {', '  // чекаємо на піцу…', '})'],
  notice: 'Проміс створено: стан pending. Додай обробники або одразу виконай resolve / reject.',
  shake: 0,
  seq: 0,
}

const HANDLER_CODE: Record<Kind, string> = {
  then: "p.then((v) => console.log('then:', v))",
  catch: "p.catch((e) => console.log('catch:', e.message))",
  finally: "p.finally(() => console.log('finally'))",
}

const runsOn = (kind: Kind, status: PromiseState) => kind === 'finally' || (kind === 'then' ? status === 'fulfilled' : status === 'rejected')

function settle(s: State, status: 'fulfilled' | 'rejected'): State {
  const call = status === 'fulfilled' ? `resolve(${VALUE})` : `reject(new ${REASON})`
  if (s.status !== 'pending') {
    return { ...s, code: [...s.code, `${call} // ігнорується`], notice: `Проміс уже ${s.status === 'fulfilled' ? 'fulfilled' : 'rejected'} — повторний ${status === 'fulfilled' ? 'resolve' : 'reject'} нічого не змінює. Стан змінюється лише один раз.`, shake: s.shake + 1 }
  }
  const jobs = s.handlers.map((h) => ({ id: h.id, kind: h.kind, runs: runsOn(h.kind, status) }))
  return {
    ...s,
    status,
    value: status === 'fulfilled' ? VALUE : REASON,
    handlers: [],
    queue: [...s.queue, ...jobs],
    code: [...s.code, call],
    notice: jobs.length > 0 ? `Проміс ${status}. Кожен обробник стає мікрозадачею — вони виконаються, щойно звільниться стек.` : `Проміс ${status}. Обробників поки немає — значення збережено і чекає на них.`,
  }
}

function addHandler(s: State, kind: Kind): State {
  const id = s.seq + 1
  const code = [...s.code, HANDLER_CODE[kind]]
  if (s.status === 'pending') {
    return { ...s, seq: id, handlers: [...s.handlers, { id, kind }], code, notice: `.${kind} підписався на проміс і чекає. Сам виклик .${kind} одразу повертає новий проміс.` }
  }
  return { ...s, seq: id, queue: [...s.queue, { id, kind, runs: runsOn(kind, s.status) }], code, notice: `Проміс уже ${s.status}, але колбек не виконується синхронно — він стає в чергу мікрозадач.` }
}

function runNext(s: State): State {
  const [job, ...rest] = s.queue
  if (!job) return s
  let line: string
  if (!job.runs) line = s.status === 'rejected' ? `· .${job.kind} пропущено: помилка йде далі ланцюжком` : `· .${job.kind} пропущено: значення йде далі ланцюжком`
  else if (job.kind === 'then') line = 'then: піца'
  else if (job.kind === 'catch') line = 'catch: згоріла'
  else line = 'finally'
  return { ...s, queue: rest, log: [...s.log, line] }
}

const LABEL: Record<Kind, string> = { then: 'then(v => …)', catch: 'catch(e => …)', finally: 'finally(() => …)' }
const JOB_ICON: VizIcon = 'pi:PiSparkleFill'
const STATE_VIEW: Record<PromiseState, { icon: VizIcon; title: string }> = {
  pending: { icon: STATE_ICON.pending, title: 'pending' },
  fulfilled: { icon: STATE_ICON.fulfilled, title: 'fulfilled' },
  rejected: { icon: STATE_ICON.rejected, title: 'rejected' },
}

export function Lifecycle() {
  const [s, setS] = useState<State>(INITIAL)
  const groupId = useId()

  useEffect(() => {
    if (s.queue.length === 0) return
    const t = window.setTimeout(() => setS(runNext), 900)
    return () => window.clearTimeout(t)
  }, [s.queue])

  const view = STATE_VIEW[s.status]
  const queue: Token[] = s.queue.map((j) => ({ id: `job-${j.id}`, label: LABEL[j.kind], icon: JOB_ICON, hint: j.runs ? undefined : 'пропуск' }))
  const waiting: Token[] = s.handlers.map((h) => ({ id: `job-${h.id}`, label: `.${h.kind}`, hint: 'чекає' }))

  return (
    <LayoutGroup id={groupId}>
      <div className="viz-lifecycle">
        <div className="viz-stage" data-split="">
          <div className="viz-side">
            <Panel title="Проміс p" icon="px:hourglass">
              <div className="viz-machine" aria-label={`Стан: ${s.status}`}>
                {(['fulfilled', 'pending', 'rejected'] as const).map((st) => (
                  <span key={st} className="viz-machine-node" data-state={st} data-on={s.status === st ? '' : undefined}>
                    <VizGlyph icon={STATE_VIEW[st].icon} size={14} /> {st}
                  </span>
                ))}
              </div>
              <m.div key={s.shake} className="viz-promise" data-state={s.status} animate={s.shake > 0 ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
                <AnimatePresence mode="wait" initial={false}>
                  <m.div key={s.status} className="viz-promise-state" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={SPRING}>
                    <span className="viz-promise-emoji" aria-hidden="true">
                      <VizGlyph icon={view.icon} size={28} />
                    </span>
                    <span>
                      <strong>{view.title}</strong>
                      {s.value ? (
                        <>
                          {' '}
                          · <code>{s.value}</code>
                        </>
                      ) : null}
                    </span>
                  </m.div>
                </AnimatePresence>
              </m.div>
              <div className="viz-subhead">Підписані обробники</div>
              <TokenList items={waiting} direction="row" empty="немає" />
            </Panel>
            <div className="viz-actions">
              <button type="button" className="viz-action" data-tone="success" onClick={() => setS((x) => settle(x, 'fulfilled'))}>
                <VizGlyph icon="px:pizza" /> resolve(&apos;піца&apos;)
              </button>
              <button type="button" className="viz-action" data-tone="danger" onClick={() => setS((x) => settle(x, 'rejected'))}>
                <VizGlyph icon="px:fire" /> reject(error)
              </button>
              <button type="button" className="viz-action" onClick={() => setS((x) => addHandler(x, 'then'))}>
                + .then
              </button>
              <button type="button" className="viz-action" onClick={() => setS((x) => addHandler(x, 'catch'))}>
                + .catch
              </button>
              <button type="button" className="viz-action" onClick={() => setS((x) => addHandler(x, 'finally'))}>
                + .finally
              </button>
              <button type="button" className="viz-action" onClick={() => setS(INITIAL)} aria-label="Скинути проміс">
                <RotateCcw size={16} strokeWidth={1.8} /> Скинути
              </button>
            </div>
          </div>
          <div className="viz-side">
            <Panel title="Код" icon="px:code">
              <pre className="viz-snippet viz-snippet-live">
                <AnimatePresence initial={false}>
                  {s.code.map((line, i) => (
                    <m.code key={`${i}:${line}`} data-last={i === s.code.length - 1 ? '' : undefined} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
                      {line}
                    </m.code>
                  ))}
                </AnimatePresence>
              </pre>
            </Panel>
            <Panel title="Мікрозадачі" icon="pi:PiSparkleFill" tone="micro">
              <TokenList items={queue} direction="row" tone="micro" />
            </Panel>
            <ConsolePanel lines={s.log} />
          </div>
        </div>
        <div className="viz-note">
          <span className="viz-note-step" aria-hidden="true">
            <VizGlyph icon="pi:PiChatCircleDotsFill" />
          </span>
          <p aria-live="polite">{s.notice}</p>
        </div>
      </div>
    </LayoutGroup>
  )
}
