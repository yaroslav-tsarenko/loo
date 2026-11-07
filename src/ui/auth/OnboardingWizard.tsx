'use client'

import { Suspense, useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { coursesIn, DIRECTIONS, directionOf, isDirectionOpen, MAX_WISHES, SOON_OPTIONS, soonOptionsFor, WISH_IDS, type DirectionId } from '@/course/catalog-soon'
import { messages, t } from '@/i18n'
import { completeOnboarding } from '@/server/actions/account'
import { MINUTES, purposesFor, ROLES, START_MODES, type Purpose, type Role, type StartMode } from '@/progress/preferences'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'
import type { LooMood } from '@/ui/design/mascot/Loo'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { Icon } from '@/ui/icons/Icon'

// First sign-in wizard: one question per screen (direction → course → purpose → role → minutes → start → plan), Loo
// reacting to every tap, a single submit to completeOnboarding at the end. The in-progress answers live in
// sessionStorage (a refresh keeps them); the server re-validates everything.

export interface WizardCourse {
  id: string
  title: string
  subtitle: string | null
  icon: string
  subject: string
  target: string | null
  /** the course's exam (course.yaml `exam.name`: IELTS, Goethe-Zertifikat…), null without one */
  exam: string | null
  /** «A1 → C2», «Noob → God» */
  range: string
}

type Dir = DirectionId | 'other'
type StepId = 'direction' | 'course' | 'purpose' | 'role' | 'minutes' | 'start' | 'plan'

const FULL_STEPS: readonly StepId[] = ['direction', 'course', 'purpose', 'role', 'minutes', 'start', 'plan']
// No courses at all (empty registry): the questions that still make sense.
const BARE_STEPS: readonly StepId[] = ['purpose', 'role', 'minutes', 'plan']

interface WizardState {
  step: StepId
  direction: Dir | null
  course: string | null
  purpose: Purpose | null
  role: Role | null
  minutes: number
  start: StartMode
  wishes: string[]
}

const PURPOSE_ICON: Record<Purpose, string> = {
  relocate: 'px:house',
  work: 'px:toolbox',
  travel: 'px:map',
  exam: 'px:scroll',
  school: 'px:gradCap',
  self: 'px:heart',
  'first-job': 'px:rocket',
  promotion: 'px:medal',
  interview: 'px:chat',
  study: 'px:books',
}
const ROLE_ICON: Record<Role, string> = { pupil: 'px:backpack', student: 'px:gradCap', working: 'px:monitor', 'job-seeking': 'px:magnifier', parent: 'px:baby', other: 'px:person' }
const MINUTE_ICON: Record<number, string> = { 5: 'px:sprout', 10: 'px:clock', 15: 'px:bolt', 20: 'px:fire', 30: 'px:trophy' }
const START_ICON: Record<StartMode, string> = { placement: 'px:testTube', zero: 'px:sprout' }
const STEP_MOOD: Record<StepId, LooMood> = { direction: 'wave', course: 'thinking', purpose: 'happy', role: 'wink', minutes: 'thinking', start: 'eureka', plan: 'cheer' }

// ── Session store ───────────────────────────────────────────────────────────────────────────────────────────────────
// sessionStorage is the source of truth (useSyncExternalStore: the server and the first client render see the
// defaults, then the saved answers); an in-memory copy covers browsers that block storage.
const KEY = 'lu-onboarding-wizard'
const EVENT = 'lu-onboarding-wizard'
let memory: string | null = null

function readRaw(): string | null {
  try {
    return window.sessionStorage.getItem(KEY) ?? memory
  } catch {
    return memory
  }
}

function writeRaw(value: string | null) {
  memory = value
  try {
    if (value === null) window.sessionStorage.removeItem(KEY)
    else window.sessionStorage.setItem(KEY, value)
  } catch {}
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  return () => window.removeEventListener(EVENT, cb)
}

const serverSnapshot = () => null

interface Ctx {
  courses: readonly WizardCourse[]
  steps: readonly StepId[]
  defaultMinutes: number
}

const isOneOf = <T extends string | number>(list: readonly T[], v: unknown): v is T => (list as readonly unknown[]).includes(v)

function courseById(ctx: Ctx, id: string | null): WizardCourse | null {
  return (id && ctx.courses.find((c) => c.id === id)) || null
}

// Can the learner leave this step?
function stepDone(step: StepId, s: WizardState, ctx: Ctx): boolean {
  switch (step) {
    case 'direction':
      return s.direction !== null && coursesIn(s.direction, ctx.courses).length > 0
    case 'course':
      return courseById(ctx, s.course) !== null
    case 'purpose':
      return s.purpose !== null && purposesFor(courseById(ctx, s.course)?.subject).includes(s.purpose)
    case 'role':
      return s.role !== null
    default:
      return true
  }
}

// Saved answers → a consistent state for the current catalog (a course may have gone, the purpose list may differ).
function restore(raw: string | null, ctx: Ctx): WizardState {
  const base: WizardState = { step: ctx.steps[0]!, direction: null, course: null, purpose: null, role: null, minutes: ctx.defaultMinutes, start: 'placement', wishes: [] }
  if (!raw) return base
  let v: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return base
    v = parsed as Record<string, unknown>
  } catch {
    return base
  }
  const direction = typeof v.direction === 'string' && coursesIn(v.direction as Dir, ctx.courses).length > 0 ? (v.direction as Dir) : null
  const course = direction && typeof v.course === 'string' ? (courseById(ctx, v.course) ?? null) : null
  const s: WizardState = {
    step: base.step,
    direction,
    course: course && directionOf(course) === direction ? course.id : null,
    purpose: isOneOf(purposesFor(course?.subject), v.purpose) ? v.purpose : null,
    role: isOneOf(ROLES, v.role) ? v.role : null,
    minutes: isOneOf(MINUTES, v.minutes) ? v.minutes : base.minutes,
    start: isOneOf(START_MODES, v.start) ? v.start : base.start,
    wishes: Array.isArray(v.wishes) ? [...new Set(v.wishes.filter((w): w is string => isOneOf(WISH_IDS, w)))].slice(0, MAX_WISHES) : [],
  }
  // resume at the saved step, but never past an unanswered one
  const want = isOneOf(ctx.steps, v.step) ? ctx.steps.indexOf(v.step) : 0
  const blocked = ctx.steps.findIndex((st) => !stepDone(st, s, ctx))
  s.step = ctx.steps[blocked === -1 ? want : Math.min(want, blocked)]!
  return s
}

// ── Pieces ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Library icons (si: brand marks, pi:) are lazy chunks: each one waits in its own box instead of suspending the step.
function Glyph({ name, size }: { name: string; size: number }) {
  return (
    <Suspense fallback={<span className="obw-glyph-wait" style={{ width: size, height: size }} />}>
      <Icon name={name} size={size} />
    </Suspense>
  )
}

function RadioTile({ name, value, checked, onPick, icon, title, sub, badge, kind }: { name: string; value: string; checked: boolean; onPick: () => void; icon?: ReactNode; title: ReactNode; sub?: ReactNode; badge?: ReactNode; kind?: 'big' }) {
  return (
    <label className="choice obw-tile" data-kind={kind}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onPick} />
      {icon ? (
        <span className="obw-tile-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="obw-tile-text">
        <span className="choice-title">
          {title}
          {badge}
        </span>
        {sub ? <span className="choice-sub">{sub}</span> : null}
      </span>
      <span className="obw-mark" aria-hidden="true" />
    </label>
  )
}

function SoonTile({ icon, label, on, onToggle }: { icon: string; label: string; on: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="choice obw-tile obw-soon-tile" aria-pressed={on} aria-label={`${t('onboarding.wish')}: ${label}`} onClick={onToggle}>
      <span className="obw-tile-icon" aria-hidden="true">
        <Glyph name={icon} size={28} />
      </span>
      <span className="obw-tile-text">
        <span className="choice-title">{label}</span>
        <span className="obw-soon-tag">
          {on ? <Icon name="px:check" size={12} /> : null}
          {on ? t('onboarding.wish') : t('onboarding.soon')}
        </span>
      </span>
    </button>
  )
}

function SoonGroup({ title, hint, children, noted }: { title: string; hint: string; children: ReactNode; noted: boolean }) {
  const id = useId()
  return (
    <div className="obw-soon" role="group" aria-labelledby={id}>
      <h2 id={id} className="obw-soon-title">
        {title}
      </h2>
      <p className="obw-soon-hint">{hint}</p>
      <div className="obw-grid" data-kind="soon">
        {children}
      </div>
      <p className="obw-soon-note" data-on={noted ? '' : undefined} aria-hidden={!noted}>
        <Icon name="px:check" size={14} /> {t('onboarding.wished')}
      </p>
    </div>
  )
}

function PlanRow({ icon, label, value, step, onEdit }: { icon: string; label: string; value: ReactNode; step?: StepId; onEdit?: (step: StepId) => void }) {
  return (
    <div className="obw-plan-row">
      <dt className="obw-plan-label">
        <span className="obw-plan-icon" aria-hidden="true">
          <Icon name={icon} size={24} />
        </span>
        {label}
      </dt>
      <dd className="obw-plan-value">
        {value}
        {step && onEdit ? (
          <button type="button" className="obw-plan-edit" aria-label={`${t('onboarding.plan.edit')}: ${label}`} onClick={() => onEdit(step)}>
            {t('onboarding.plan.edit')}
          </button>
        ) : null}
      </dd>
    </div>
  )
}

function NextButton({ last, disabled }: { last: boolean; disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" block disabled={disabled} loading={pending} iconEnd={<Glyph name={last ? 'px:rocket' : 'pi:PiArrowRightBold'} size={last ? 22 : 18} />}>
      {last ? t('onboarding.begin') : t('onboarding.next')}
    </Button>
  )
}

// ── Wizard ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export function OnboardingWizard({ courses, next, defaultMinutes }: { courses: WizardCourse[]; next: string; defaultMinutes: number }) {
  const m = messages().onboarding
  const ctx: Ctx = { courses, steps: courses.length > 0 ? FULL_STEPS : BARE_STEPS, defaultMinutes }
  const raw = useSyncExternalStore(subscribe, readRaw, serverSnapshot)
  const s = restore(raw, ctx)
  const [motion, setMotion] = useState<'fwd' | 'back'>('fwd')
  const [reaction, setReaction] = useState<{ mood: LooMood; text: string } | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const focusHeading = useRef(false)
  const submitted = useRef(false)

  const index = ctx.steps.indexOf(s.step)
  const last = s.step === 'plan'
  const done = stepDone(s.step, s, ctx)
  const course = courseById(ctx, s.course)
  const purposes = purposesFor(course?.subject)
  // «Іспит (IELTS)» names the course's own exam; a course without one says just «Іспит»
  const exam = course?.exam ?? null
  const purposeTitle = (p: Purpose): string => (p !== 'exam' ? m.purposes[p] : exam ? m.purposes.exam.replace('{exam}', exam) : m.examAny.purpose)
  const purposeReact = (p: Purpose): string => (p !== 'exam' ? m.react.purposes[p] : exam ? m.react.purposes.exam.replace('{exam}', exam) : m.examAny.react)

  const save = (patch: Partial<WizardState>) => writeRaw(JSON.stringify({ ...restore(readRaw(), ctx), ...patch }))
  const react = (mood: LooMood, text: string) => setReaction({ mood, text })

  function go(to: StepId, dir: 'fwd' | 'back') {
    setMotion(dir)
    setReaction(null)
    focusHeading.current = true
    save({ step: to })
  }
  function advance() {
    if (!done) return
    if (last) formRef.current?.requestSubmit()
    else go(ctx.steps[index + 1]!, 'fwd')
  }
  const back = () => index > 0 && go(ctx.steps[index - 1]!, 'back')
  // «Змінити» on the plan: back to that question
  const revisit = (step: StepId) => go(step, 'back')

  // the new question takes focus (screen readers read it; the page starts from the top)
  useEffect(() => {
    if (!focusHeading.current) return
    focusHeading.current = false
    window.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [s.step])

  // the «скоро» programming options use brand marks: fetch their chunk early, so step 2 rarely has to wait
  useEffect(() => {
    void import('@/ui/icons/sets/si')
  }, [])

  // after the submit navigates away, forget the answers
  useEffect(
    () => () => {
      if (submitted.current) writeRaw(null)
    },
    [],
  )

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    if (last && done) {
      submitted.current = true
      return
    }
    e.preventDefault()
    advance()
  }

  // Enter = «Далі» anywhere except on buttons and links (they act themselves)
  function onKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return
    const el = e.target as HTMLElement
    if (el.closest('button, a')) return
    e.preventDefault()
    advance()
  }

  function toggleWish(id: string) {
    const on = !s.wishes.includes(id)
    save({ wishes: on ? [...s.wishes, id].slice(0, MAX_WISHES) : s.wishes.filter((w) => w !== id) })
    if (!on) react('idle', m.react.unwished)
    else react('love', done ? m.react.wished : m.react.wishedPick)
  }

  // ── step content ──
  const openDirections: Array<{ id: Dir; label: string; icon: string }> = [
    ...DIRECTIONS.filter((d) => isDirectionOpen(d.id, courses)),
    ...(isDirectionOpen('other', courses) ? [{ id: 'other' as const, label: m.other, icon: 'px:books' }] : []),
  ]
  const soonDirections = DIRECTIONS.filter((d) => !isDirectionOpen(d.id, courses))

  function pickDirection(d: Dir, label: string) {
    const keep = course && directionOf(course) === d
    save({ direction: d, course: keep ? s.course : null, purpose: keep ? s.purpose : null })
    react(d === 'programming' ? 'fire' : 'happy', d === 'languages' || d === 'programming' ? m.react.direction[d] : t('onboarding.react.direction.other', { label }))
  }

  function pickCourse(c: WizardCourse) {
    save({ course: c.id, purpose: isOneOf(purposesFor(c.subject), s.purpose) ? s.purpose : null })
    react('cheer', t('onboarding.react.course', { title: c.title }))
  }

  const title = s.step === 'course' ? m.course.title[s.direction === 'languages' || s.direction === 'programming' ? s.direction : 'other'] : m[s.step].title
  const lead = m[s.step].lead
  let body: ReactNode = null

  switch (s.step) {
    case 'direction': {
      const anyWish = soonDirections.some((d) => s.wishes.includes(d.id))
      body = (
        <>
          <div className="obw-grid" data-kind="big" role="radiogroup" aria-labelledby="obw-title">
            {openDirections.map((d) => (
              <RadioTile key={d.id} kind="big" name="w-direction" value={d.id} checked={s.direction === d.id} onPick={() => pickDirection(d.id, d.label)} icon={<Icon name={d.icon} size={44} />} title={d.label} />
            ))}
          </div>
          {soonDirections.length > 0 ? (
            <SoonGroup title={m.direction.soon} hint={m.direction.soonHint} noted={anyWish}>
              {soonDirections.map((d) => (
                <SoonTile key={d.id} icon={d.icon} label={d.label} on={s.wishes.includes(d.id)} onToggle={() => toggleWish(d.id)} />
              ))}
            </SoonGroup>
          ) : null}
        </>
      )
      break
    }
    case 'course': {
      const ownCourses = s.direction ? coursesIn(s.direction, courses) : []
      const soon = s.direction ? soonOptionsFor(s.direction, courses) : []
      body = (
        <>
          <div className="obw-grid" data-kind="wide" role="radiogroup" aria-labelledby="obw-title">
            {ownCourses.map((c) => (
              <RadioTile
                key={c.id}
                name="w-course"
                value={c.id}
                checked={s.course === c.id}
                onPick={() => pickCourse(c)}
                icon={<Glyph name={c.icon} size={36} />}
                title={c.title}
                sub={
                  <>
                    {c.subtitle ? <span className="obw-course-sub">{c.subtitle}</span> : null}
                    {c.title.includes(c.range) ? null : <span className="obw-course-range">{c.range}</span>}
                  </>
                }
              />
            ))}
          </div>
          {soon.length > 0 ? (
            <SoonGroup title={m.course.soon} hint={m.direction.soonHint} noted={soon.some((o) => s.wishes.includes(o.id))}>
              {soon.map((o) => (
                <SoonTile key={o.id} icon={o.icon} label={o.label} on={s.wishes.includes(o.id)} onToggle={() => toggleWish(o.id)} />
              ))}
            </SoonGroup>
          ) : null}
        </>
      )
      break
    }
    case 'purpose':
      body = (
        <div className="obw-grid" data-kind="list" role="radiogroup" aria-labelledby="obw-title">
          {purposes.map((p) => (
            <RadioTile
              key={p}
              name="w-purpose"
              value={p}
              checked={s.purpose === p}
              onPick={() => {
                save({ purpose: p })
                react('happy', purposeReact(p))
              }}
              icon={<Icon name={PURPOSE_ICON[p]} size={30} />}
              title={purposeTitle(p)}
            />
          ))}
        </div>
      )
      break
    case 'role':
      body = (
        <div className="obw-grid" data-kind="list" role="radiogroup" aria-labelledby="obw-title">
          {ROLES.map((r) => (
            <RadioTile
              key={r}
              name="w-role"
              value={r}
              checked={s.role === r}
              onPick={() => {
                save({ role: r })
                react('wink', m.react.roles[r])
              }}
              icon={<Icon name={ROLE_ICON[r]} size={30} />}
              title={m.roles[r]}
            />
          ))}
        </div>
      )
      break
    case 'minutes':
      body = (
        <div className="obw-grid" data-kind="list" role="radiogroup" aria-labelledby="obw-title">
          {MINUTES.map((n) => (
            <RadioTile
              key={n}
              name="w-minutes"
              value={String(n)}
              checked={s.minutes === n}
              onPick={() => {
                save({ minutes: n })
                react(n >= 20 ? 'fire' : 'happy', m.react.minutes[n])
              }}
              icon={<Icon name={MINUTE_ICON[n] ?? 'px:clock'} size={30} />}
              title={t('onboarding.minutes.option', { n })}
              sub={m.minutes.labels[n]}
            />
          ))}
        </div>
      )
      break
    case 'start':
      body = (
        <div className="obw-grid" data-kind="list" role="radiogroup" aria-labelledby="obw-title">
          {START_MODES.map((mode) => (
            <RadioTile
              key={mode}
              name="w-start"
              value={mode}
              checked={s.start === mode}
              onPick={() => {
                save({ start: mode })
                react(mode === 'placement' ? 'eureka' : 'happy', m.react.start[mode])
              }}
              icon={<Icon name={START_ICON[mode]} size={30} />}
              title={mode === 'placement' ? m.start.placement : m.start.zero}
              sub={mode === 'placement' ? m.start.placementSub : m.start.zeroSub}
              badge={
                mode === 'placement' ? (
                  <Pill tone="mint" size="sm" className="obw-badge">
                    {m.start.recommended}
                  </Pill>
                ) : undefined
              }
            />
          ))}
        </div>
      )
      break
    case 'plan': {
      const wishLabels = s.wishes.map((w) => [...DIRECTIONS, ...SOON_OPTIONS].find((o) => o.id === w)?.label).filter(Boolean)
      body = (
        <div className="obw-plan">
          {course ? (
            <div className="obw-plan-hero">
              <Glyph name={course.icon} size={44} />
              <div>
                <p className="obw-plan-kicker">{m.plan.course}</p>
                <p className="obw-plan-course">{course.title}</p>
                {course.title.includes(course.range) ? null : <p className="obw-course-range">{course.range}</p>}
              </div>
            </div>
          ) : null}
          <dl className="obw-plan-list">
            {s.purpose ? <PlanRow icon={PURPOSE_ICON[s.purpose]} label={m.plan.goal} value={purposeTitle(s.purpose)} step="purpose" onEdit={revisit} /> : null}
            <PlanRow icon="px:clock" label={m.plan.daily} value={`${t('onboarding.minutes.option', { n: s.minutes })} · ${m.minutes.labels[s.minutes as (typeof MINUTES)[number]]}`} step="minutes" onEdit={revisit} />
            {course ? <PlanRow icon={START_ICON[s.start]} label={m.plan.start} value={s.start === 'placement' ? m.start.placement : m.start.zero} step="start" onEdit={revisit} /> : null}
            {s.role ? <PlanRow icon={ROLE_ICON[s.role]} label={m.plan.role} value={m.roles[s.role]} step="role" onEdit={revisit} /> : null}
            {wishLabels.length > 0 ? <PlanRow icon="px:star" label={m.plan.wishes} value={wishLabels.join(', ')} /> : null}
          </dl>
        </div>
      )
      break
    }
  }

  const loo = reaction ?? { mood: STEP_MOOD[s.step], text: m[s.step].loo }

  return (
    <form ref={formRef} action={completeOnboarding} onSubmit={onSubmit} onKeyDown={onKeyDown} className="obw">
      <input type="hidden" name="next" value={next} />
      {course ? <input type="hidden" name="course" value={course.id} /> : null}
      {course ? <input type="hidden" name="start" value={s.start} /> : null}
      <input type="hidden" name="minutes" value={s.minutes} />
      {s.purpose ? <input type="hidden" name="purpose" value={s.purpose} /> : null}
      {s.role ? <input type="hidden" name="role" value={s.role} /> : null}
      {s.wishes.map((w) => (
        <input key={w} type="hidden" name="wishes" value={w} />
      ))}

      <header className="obw-top">
        <button type="button" className="obw-back" onClick={back} disabled={index === 0} data-hidden={index === 0 ? '' : undefined}>
          <Glyph name="pi:PiArrowLeftBold" size={18} />
          <span>{m.back}</span>
        </button>
        <ProgressBar className="obw-progress" value={(index + 1) / ctx.steps.length} size="sm" label={t('onboarding.step', { n: index + 1, total: ctx.steps.length })} />
        <span className="obw-count" aria-hidden="true">
          {index + 1}/{ctx.steps.length}
        </span>
      </header>

      <div className="obw-body">
        <LooSays className="obw-loo" mood={loo.mood} size={64} text={loo.text} live />
        <section key={s.step} className="obw-step" data-dir={motion} aria-labelledby="obw-title">
          <h1 id="obw-title" ref={headingRef} tabIndex={-1} className="obw-title">
            {title}
          </h1>
          {lead ? <p className="obw-lead">{lead}</p> : null}
          {/* brand icons (si:) load as their own chunk: wait here, not in the app-wide loading screen */}
          <Suspense fallback={<div className="obw-wait" aria-hidden="true" />}>{body}</Suspense>
        </section>
      </div>

      <footer className="obw-foot">
        <div className="obw-foot-inner">
          <NextButton last={last} disabled={!done} />
        </div>
      </footer>
    </form>
  )
}
