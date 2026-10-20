// Reminder emails that bring learners back to the game (scripts/reminders.ts runs this hourly from GitHub Actions, .github/workflows/reminders.yml).
// Pure: who gets what and when, plus the email content. No I/O, so it is unit-tested (tests/unit/reminders.test.ts).
//
// Rules (docs/EMAIL.md):
// - at most one reminder per learner per day, only confirmed emails, never when `emailReminders` is off;
// - each kind has a Kyiv-time window (start hour + WINDOW_HOURS), so a late or skipped cron run catches up
//   within the window, and the claim in email_log keeps it to exactly one email;
// - by priority (first match wins):
//   10:00 «streak_lost» — a streak of ≥ 2 days broke yesterday (no goal, no freeze) and nothing today yet;
//   12:00 «mission»     — no streak yet (building the habit), was here yesterday, not today;
//   17:00 «welcome»     — confirmed 1 or 3 days ago and never started a lesson;
//   18:00 «comeback»    — no live streak, last activity exactly 2, 5, 10, 21 or 45 days ago (then we stop);
//   19:00 «streak»      — a streak of ≥ 1 day and today's goal not met yet.
import { shiftDay } from '@/progress/day'
import { computeStreak } from '@/progress/streak'
import { escapeHtml, renderEmail } from './layout'

export type ReminderKind = 'streak_lost' | 'mission' | 'welcome' | 'comeback' | 'streak'

export const REMINDER_HOURS: Record<ReminderKind, number> = { streak_lost: 10, mission: 12, welcome: 17, comeback: 18, streak: 19 }
/** A slot stays open this many hours after its start (late GitHub Actions runs still deliver). */
export const WINDOW_HOURS = 3
export const COMEBACK_GAPS = [2, 5, 10, 21, 45] as const
export const WELCOME_GAPS = [1, 3] as const

export interface LearnerFacts {
  /** Days with the daily goal met (dayKey format). */
  goalDays: readonly string[]
  /** Days covered by a streak freeze. */
  frozenDays: readonly string[]
  /** Last day with any activity, or null. */
  lastActiveDay: string | null
  /** Day the account was created (dayKey), or null when unknown. */
  signupDay?: string | null
  /** user_settings.emailReminders (undefined → on). */
  remindersOn: boolean
}

export interface Reminder {
  kind: ReminderKind
  /** Idempotency ref: one email per (user, kind, ref). */
  ref: string
  streak: number
  daysAway: number
  /** streak_lost: the best streak ever, for the «beat your record» line. */
  best?: number
}

const DAY_MS = 86_400_000
function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS)
}

/** Kyiv wall-clock hour (0–23), DST-aware. */
export function kyivHour(now: number): number {
  return Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', hour: '2-digit', hourCycle: 'h23' }).format(now))
}

function open(kind: ReminderKind, hour: number): boolean {
  const start = REMINDER_HOURS[kind]
  return hour >= start && hour < start + WINDOW_HOURS
}

/** The reminder due for this learner at this Kyiv hour, or null. */
export function pickReminder(f: LearnerFacts, today: string, hour: number): Reminder | null {
  if (!f.remindersOn) return null
  const streak = computeStreak(f.goalDays, today, f.frozenDays)
  const activeToday = f.lastActiveDay === today
  const yesterday = shiftDay(today, -1)
  const covered = new Set([...f.goalDays, ...f.frozenDays])

  if (open('streak_lost', hour) && !activeToday && !covered.has(yesterday) && covered.has(shiftDay(today, -2))) {
    const lost = computeStreak(f.goalDays, shiftDay(today, -2), f.frozenDays)
    if (lost.current >= 2) return { kind: 'streak_lost', ref: shiftDay(today, -2), streak: lost.current, daysAway: 1, best: lost.best }
  }
  if (open('mission', hour) && streak.current === 0 && !activeToday && f.lastActiveDay === yesterday) {
    return { kind: 'mission', ref: today, streak: 0, daysAway: 1 }
  }
  if (open('welcome', hour) && f.lastActiveDay === null && f.signupDay) {
    const gap = daysBetween(f.signupDay, today)
    if ((WELCOME_GAPS as readonly number[]).includes(gap)) return { kind: 'welcome', ref: `${f.signupDay}+${gap}`, streak: 0, daysAway: gap }
  }
  if (open('comeback', hour) && f.lastActiveDay && !activeToday && streak.current === 0) {
    const gap = daysBetween(f.lastActiveDay, today)
    if ((COMEBACK_GAPS as readonly number[]).includes(gap)) return { kind: 'comeback', ref: `${f.lastActiveDay}+${gap}`, streak: streak.current, daysAway: gap }
  }
  if (open('streak', hour) && streak.current >= 1 && !streak.todayCounted) {
    return { kind: 'streak', ref: today, streak: streak.current, daysAway: 0 }
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
  if (r.kind === 'streak_lost') {
    const n = r.streak
    const best = r.best ?? n
    const subject = `Серія ${n} ${dni(n)} згасла — запали нову`
    const record = best > n ? ` Твій рекорд — ${best} ${dni(best)}, і він нікуди не дівся.` : ' Це був твій рекорд — тепер є що побити.'
    const text = `${hi}учора серія ${n} ${dni(n)} обірвалась.${record} Один урок сьогодні — і перший день нової серії вже твій.`
    return {
      subject,
      html: renderEmail({
        preheader: 'Один урок сьогодні — і нова серія стартує.',
        pose: { eyes: 'sad', bulb: true },
        title: 'Серія згасла. Запалимо нову?',
        text,
        quest: { title: 'Нова серія: день 1', step: 0, total: 5, reward: `Рекорд ${best}` },
        href,
        cta: 'Почати нову серію',
        note: `${note} Порада: заморозка серії в крамниці врятує її наступного разу.`,
        siteUrl: opts.siteUrl,
        unsubscribeUrl: opts.unsubscribeUrl,
      }),
      text: `${subject}\n\n${text.replace(/<[^>]+>/g, '')}\n\nПочати: ${href}\n\nВідписатися: ${opts.unsubscribeUrl}`,
    }
  }
  if (r.kind === 'welcome') {
    const subject = r.daysAway <= 1 ? 'Твій перший урок чекає · Loo' : 'Loo досі тримає для тебе місце'
    const text =
      r.daysAway <= 1
        ? `${hi}акаунт готовий, а перший урок — ще ні. Займе 3 хвилини: кілька карток, коротка вправа — і Loo отримає перший досвід.`
        : `${hi}ти зареєструвався, але ще не почав. Обери курс — англійську чи JavaScript — і пройди перший урок: це коротко й без стресу.`
    return {
      subject,
      html: renderEmail({
        preheader: 'Перший урок — 3 хвилини.',
        pose: { eyes: 'happy', bulb: true },
        title: r.daysAway <= 1 ? 'Перший рівень чекає' : 'Пригода ще не почалась',
        text,
        quest: { title: 'Пройди перший урок', step: 0, total: 5, reward: '+XP' },
        href,
        cta: 'Почати перший урок',
        note,
        siteUrl: opts.siteUrl,
        unsubscribeUrl: opts.unsubscribeUrl,
      }),
      text: `${subject}\n\n${text.replace(/<[^>]+>/g, '')}\n\nПочати: ${href}\n\nВідписатися: ${opts.unsubscribeUrl}`,
    }
  }
  const d = r.daysAway
  const copy =
    d <= 2
      ? { subject: 'Loo скучив за тобою', title: 'Loo скучив!', text: `${hi}тебе не було вже ${d} ${dni(d)}. Повертайся — короткий урок займе кілька хвилин, а Loo тим часом начистив меч.` }
      : d <= 6
        ? { subject: 'Пригода на паузі — Loo чекає', title: 'Пригода на паузі', text: `${hi}минуло ${d} ${dni(d)} без пригод. Твій прогрес, спорядження й ранг на місці — бос чекає на реванш.` }
        : d <= 14
          ? { subject: 'Не дай знанням вивітритись', title: 'Час на повторення', text: `${hi}минуло ${d} ${dni(d)}. Пам'ять без повторень тьмяніє — кілька карток сьогодні, і все повернеться на місце.` }
          : d <= 30
            ? { subject: 'Твій прогрес у Loo збережено', title: 'Повертайся в гру', text: `${hi}минуло ${d} ${dni(d)}. Усе, чого ти навчився, на місці — почни з короткого повторення, і Loo допоможе пригадати.` }
            : { subject: 'Останній лист від Loo (поки що)', title: 'Двері відчинені', text: `${hi}ти давно не заходив, тож більше не будемо набридати нагадуваннями про повернення. Прогрес збережено — повертайся, коли буде час.` }
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
