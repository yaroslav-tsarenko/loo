// Reminder emails that bring learners back to the game (scripts/reminders.ts runs this hourly from GitHub Actions, .github/workflows/reminders.yml).
// Pure: who gets what and when, plus the email content. No I/O, so it is unit-tested (tests/unit/reminders.test.ts).
//
// Rules (docs/EMAIL.md):
// - at most one reminder per learner per day, only confirmed emails, never when `emailReminders` is off;
// - 12:00 Kyiv «mission»   — no streak yet (building the habit), was here yesterday, not today;
// - 18:00 Kyiv «comeback»  — last activity exactly 2, 6 or 29 days ago;
// - 19:00 Kyiv «streak»    — a streak of ≥ 1 day and today's goal not met yet.
// A missed cron run skips that slot for the day (better silent than late).
import { shiftDay } from '@/progress/day'
import { computeStreak } from '@/progress/streak'
import { escapeHtml, renderEmail } from './layout'

export type ReminderKind = 'mission' | 'comeback' | 'streak'

export const REMINDER_HOURS: Record<ReminderKind, number> = { mission: 12, comeback: 18, streak: 19 }
export const COMEBACK_GAPS = [2, 6, 29] as const

export interface LearnerFacts {
  /** Days with the daily goal met (dayKey format). */
  goalDays: readonly string[]
  /** Days covered by a streak freeze. */
  frozenDays: readonly string[]
  /** Last day with any activity, or null. */
  lastActiveDay: string | null
  /** user_settings.emailReminders (undefined → on). */
  remindersOn: boolean
}

export interface Reminder {
  kind: ReminderKind
  /** Idempotency ref: one email per (user, kind, ref). */
  ref: string
  streak: number
  daysAway: number
}

const DAY_MS = 86_400_000
function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS)
}

/** Kyiv wall-clock hour (0–23), DST-aware. */
export function kyivHour(now: number): number {
  return Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', hour: '2-digit', hourCycle: 'h23' }).format(now))
}

/** The reminder due for this learner in this hour slot, or null. */
export function pickReminder(f: LearnerFacts, today: string, hour: number): Reminder | null {
  if (!f.remindersOn) return null
  const streak = computeStreak(f.goalDays, today, f.frozenDays)
  const activeToday = f.lastActiveDay === today
  if (hour === REMINDER_HOURS.streak && streak.current >= 1 && !streak.todayCounted) {
    return { kind: 'streak', ref: today, streak: streak.current, daysAway: 0 }
  }
  if (hour === REMINDER_HOURS.mission && streak.current === 0 && !activeToday && f.lastActiveDay === shiftDay(today, -1)) {
    return { kind: 'mission', ref: today, streak: 0, daysAway: 1 }
  }
  if (hour === REMINDER_HOURS.comeback && f.lastActiveDay && !activeToday) {
    const gap = daysBetween(f.lastActiveDay, today)
    if ((COMEBACK_GAPS as readonly number[]).includes(gap)) return { kind: 'comeback', ref: `${f.lastActiveDay}+${gap}`, streak: streak.current, daysAway: gap }
  }
  return null
}

function dni(n: number): string {
  const m10 = n % 10, m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'день'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'дні'
  return 'днів'
}

export interface ReminderEmail {
  subject: string
  html: string
  text: string
}

/** Email content for a reminder. `name` may be empty. */
export function reminderEmail(r: Reminder, opts: { name: string; siteUrl: string; unsubscribeUrl: string }): ReminderEmail {
  const hi = opts.name.trim() ? `${escapeHtml(opts.name.trim().split(/\s+/)[0]!)}, ` : ''
  const hiText = opts.name.trim() ? `${opts.name.trim().split(/\s+/)[0]}, ` : ''
  const href = `${opts.siteUrl}/`
  const note = 'Ти отримуєш цей лист, бо вчишся в Loo. Нагадування приходять не частіше одного разу на день.'
  if (r.kind === 'streak') {
    const n = r.streak
    const subject = `Серія ${n} ${dni(n)} під загрозою!`
    const text = `${hi}у тебе ${n} ${dni(n)} поспіль. До кінця дня ще є час — один короткий урок, і серія житиме далі. Loo вже тримає лампочку напоготові.`
    return {
      subject,
      html: renderEmail({
        preheader: 'Один короткий урок — і серія живе далі.',
        pose: { eyes: 'squint', bulb: true },
        title: 'Не дай серії згаснути',
        text,
        quest: { title: `Збережи серію: ${n} ${dni(n)}`, step: 4, total: 5, reward: 'Один урок' },
        href,
        cta: 'Продовжити серію',
        note,
        siteUrl: opts.siteUrl,
        unsubscribeUrl: opts.unsubscribeUrl,
      }),
      text: `${subject}\n\n${hiText}у тебе ${n} ${dni(n)} поспіль. Один короткий урок — і серія житиме далі.\n\nПродовжити: ${href}\n\nВідписатися: ${opts.unsubscribeUrl}`,
    }
  }
  if (r.kind === 'mission') {
    const subject = 'Місія дня чекає · Loo'
    return {
      subject,
      html: renderEmail({
        preheader: 'Кілька хвилин — і перший день серії твій.',
        pose: { eyes: 'happy', bulb: true },
        title: 'Місія дня вже готова',
        text: `${hi}вчорашній урок зараховано! Сьогоднішня місія чекає: кілька хвилин — і почнеться твоя перша серія. Loo вже розминається.`,
        quest: { title: 'Почни серію', step: 1, total: 5, reward: 'День 1' },
        href,
        cta: 'До місії',
        note,
        siteUrl: opts.siteUrl,
        unsubscribeUrl: opts.unsubscribeUrl,
      }),
      text: `${subject}\n\n${hiText}сьогоднішня місія чекає: кілька хвилин — і почнеться твоя перша серія.\n\nДо місії: ${href}\n\nВідписатися: ${opts.unsubscribeUrl}`,
    }
  }
  const d = r.daysAway
  const copy =
    d <= 2
      ? { subject: 'Loo скучив за тобою', title: 'Loo скучив!', text: `${hi}тебе не було вже ${d} ${dni(d)}. Повертайся — короткий урок займе кілька хвилин, а Loo тим часом начистив меч.` }
      : d <= 6
        ? { subject: 'Тиждень без пригод? Loo чекає', title: 'Пригода на паузі', text: `${hi}минуло ${d} ${dni(d)} без пригод. Твій прогрес, спорядження й ранг на місці — бос чекає на реванш.` }
        : { subject: 'Твій прогрес у Loo збережено', title: 'Повертайся в гру', text: `${hi}минув місяць. Усе, чого ти навчився, на місці — почни з короткого повторення, і Loo допоможе пригадати.` }
  return {
    subject: copy.subject,
    html: renderEmail({
      preheader: 'Твій прогрес на місці — повертайся в гру.',
      pose: { eyes: 'sad', bulb: false },
      title: copy.title,
      text: copy.text,
      quest: null,
      href,
      cta: 'Повернутися в Loo',
      note,
      siteUrl: opts.siteUrl,
      unsubscribeUrl: opts.unsubscribeUrl,
    }),
    text: `${copy.subject}\n\n${copy.text.replace(/<[^>]+>/g, '')}\n\nПовернутися: ${href}\n\nВідписатися: ${opts.unsubscribeUrl}`,
  }
}
