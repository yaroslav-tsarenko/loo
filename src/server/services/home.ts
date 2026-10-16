import 'server-only'
import type { ContentSnapshot } from '@/content/store'
import { userScope } from '../auth'
import type { ActiveCourse } from '../courses/enrollment'
import type { AppSettings } from '../settings'
import { getCoachIn, type CoachView } from '../stats/coach'
import { todaySummaryIn, type TodaySummary } from './library'
import { getMissionIn, type MissionView } from './mission'

export interface HomeData {
  today: TodaySummary
  mission: MissionView
  coach: CoachView
}

// Everything the home page («Сьогодні») shows below the shell, in ONE transaction: today's summary, the mission and
// the «+1%» coach run side by side (their reads pipelined on the connection), the coach picking up the mission's
// cursor when it needs it. Was six transactions.
export async function homeData(snapshot: ContentSnapshot, ctx: { settings: AppSettings; active: ActiveCourse | null; reels: number; streak: number }, now = Date.now()): Promise<HomeData> {
  return userScope(
    async (db, userId) => {
      const mission = getMissionIn(db, userId, snapshot, ctx.reels, ctx.active, ctx.settings.dailyMinutes, now)
      const [today, missionView, coach] = await Promise.all([
        todaySummaryIn(db, userId, snapshot, ctx.settings, ctx.streak, now),
        mission,
        getCoachIn(db, userId, snapshot, mission.then((m) => ({ href: m.cursor.href })), { settings: ctx.settings, active: ctx.active }, now),
      ])
      return { today, mission: missionView, coach }
    },
    { tx: true },
  )
}
