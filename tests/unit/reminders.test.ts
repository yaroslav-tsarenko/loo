import { describe, expect, it } from 'vitest'
import { kyivHour, pickReminder, reminderEmail, REMINDER_HOURS, type LearnerFacts } from '@/email/reminders'

const today = '2026-10-21'
const days = (...d: string[]) => d
const base: LearnerFacts = { goalDays: [], frozenDays: [], lastActiveDay: null, remindersOn: true }

describe('pickReminder', () => {
  it('streak at risk at 19:00: streak ≥ 1 and today not counted', () => {
    const f = { ...base, goalDays: days('2026-10-18', '2026-10-19', '2026-10-20'), lastActiveDay: '2026-10-20' }
    expect(pickReminder(f, today, REMINDER_HOURS.streak)).toMatchObject({ kind: 'streak', ref: today, streak: 3 })
  })

  it('no streak reminder once today is done, or at another hour', () => {
    const done = { ...base, goalDays: days('2026-10-20', today), lastActiveDay: today }
    expect(pickReminder(done, today, REMINDER_HOURS.streak)).toBeNull()
    const f = { ...base, goalDays: days('2026-10-20'), lastActiveDay: '2026-10-20' }
    expect(pickReminder(f, today, 15)).toBeNull()
  })

  it('a streak bridged by a freeze still counts as at risk', () => {
    const f = { ...base, goalDays: days('2026-10-18', '2026-10-19'), frozenDays: days('2026-10-20'), lastActiveDay: '2026-10-19' }
    expect(pickReminder(f, today, REMINDER_HOURS.streak)).toMatchObject({ kind: 'streak', streak: 2 })
  })

  it('mission at 12:00 for a learner without a streak who was here yesterday', () => {
    const f = { ...base, lastActiveDay: '2026-10-20' }
    expect(pickReminder(f, today, REMINDER_HOURS.mission)).toMatchObject({ kind: 'mission' })
    expect(pickReminder({ ...f, lastActiveDay: today }, today, REMINDER_HOURS.mission)).toBeNull()
    expect(pickReminder({ ...f, lastActiveDay: '2026-10-19' }, today, REMINDER_HOURS.mission)).toBeNull()
  })

  it('comeback at 18:00 after exactly 2, 6 or 29 days away', () => {
    for (const [last, gap] of [['2026-10-19', 2], ['2026-10-15', 6], ['2026-09-22', 29]] as const) {
      expect(pickReminder({ ...base, lastActiveDay: last }, today, REMINDER_HOURS.comeback)).toMatchObject({ kind: 'comeback', daysAway: gap, ref: `${last}+${gap}` })
    }
    expect(pickReminder({ ...base, lastActiveDay: '2026-10-18' }, today, REMINDER_HOURS.comeback)).toBeNull()
    expect(pickReminder({ ...base, lastActiveDay: null }, today, REMINDER_HOURS.comeback)).toBeNull()
  })

  it('never when reminders are off', () => {
    const f = { ...base, goalDays: days('2026-10-20'), lastActiveDay: '2026-10-20', remindersOn: false }
    expect(pickReminder(f, today, REMINDER_HOURS.streak)).toBeNull()
  })
})

describe('kyivHour', () => {
  it('follows Kyiv time including DST', () => {
    expect(kyivHour(Date.parse('2026-07-01T16:00:00Z'))).toBe(19) // EEST, UTC+3
    expect(kyivHour(Date.parse('2026-12-01T17:00:00Z'))).toBe(19) // EET, UTC+2
  })
})

describe('reminderEmail', () => {
  const opts = { name: 'Ярослав Царенко', siteUrl: 'https://playloo.app', unsubscribeUrl: 'https://playloo.app/api/email/unsubscribe?t=abc' }

  it('streak subject uses the right Ukrainian plural', () => {
    expect(reminderEmail({ kind: 'streak', ref: today, streak: 1, daysAway: 0 }, opts).subject).toBe('Серія 1 день під загрозою!')
    expect(reminderEmail({ kind: 'streak', ref: today, streak: 3, daysAway: 0 }, opts).subject).toBe('Серія 3 дні під загрозою!')
    expect(reminderEmail({ kind: 'streak', ref: today, streak: 12, daysAway: 0 }, opts).subject).toBe('Серія 12 днів під загрозою!')
  })

  it('greets by first name, escapes it, and always carries the unsubscribe link', () => {
    const mail = reminderEmail({ kind: 'comeback', ref: 'x', streak: 0, daysAway: 6 }, { ...opts, name: '<b>Hack</b> er' })
    expect(mail.html).toContain('&lt;b&gt;Hack&lt;/b&gt;,')
    expect(mail.html).not.toContain('<b>Hack</b>')
    expect(mail.html).toContain(opts.unsubscribeUrl)
    expect(mail.text).toContain(opts.unsubscribeUrl)
  })
})
