import 'server-only'
import { cache } from 'react'
import { messages } from '@/i18n'
import type { Level } from '@/course'
import { getProfile } from './auth'
import { listCourses, getCourse } from './courses/registry'
import { myLibrary } from './courses/library'
import { readSettings } from './settings'
import { INTERESTS, LEVELS, type SelfLevel } from './services/preferences'

// One place to read what the learner wants (profile preferences + app settings + per-course levels). Feed, mission,
// path and the profile read it from here instead of poking at profiles.preferences / user_settings directly.
export interface Preferences {
  interests: string[]
  // self-assessed level (onboarding / account); each course keeps its own level in `courses`
  level: SelfLevel
  dailyMinutes: number
  dailyGoal: number
  courses: Array<{ id: string; title: string; icon: string | null; level: Level; active: boolean }>
  activeCourseId: string | null
}

function selfLevel(value: unknown): SelfLevel {
  return (LEVELS as readonly unknown[]).includes(value) ? (value as SelfLevel) : 'noob'
}

export const getPreferences = cache(async (): Promise<Preferences> => {
  const [profile, settings, library] = await Promise.all([getProfile(), readSettings(), myLibrary()])
  const courses = library.map((c) => ({ id: c.id, title: c.title, icon: c.icon, level: c.enrollment.level, active: c.enrollment.active }))
  return {
    interests: [...new Set(profile?.preferences.interests ?? [])],
    level: selfLevel(profile?.preferences.level),
    dailyMinutes: settings.dailyMinutes,
    dailyGoal: settings.dailyGoal,
    courses,
    activeCourseId: courses.find((c) => c.active)?.id ?? null,
  }
})

export interface InterestOption {
  tag: string
  label: string
}

const TAG = /^[a-z0-9][a-z0-9-]{0,39}$/
// topic tags used by at least this many topics of a course become interest chips
const TOPIC_TAG_MIN = 3
const MAX_TOPIC_TAGS = 14

// Interest chips: the onboarding interests, every catalog course's tags and the most common topic tags of the
// courses in the learner's library (so «async» or «closures» can steer the feed, mission and reviews).
export const interestOptions = cache(async (): Promise<InterestOption[]> => {
  const m = messages()
  const tags = new Set<string>(INTERESTS)
  const catalog = await listCourses()
  const library = new Set((await myLibrary()).map((c) => c.id))
  const topicTags = new Map<string, number>()
  for (const entry of catalog) {
    const bundle = await getCourse(entry.id)
    if (!bundle) continue
    for (const tag of bundle.course.tags) tags.add(tag)
    if (!library.has(entry.id)) continue
    for (const section of bundle.sections) for (const topic of section.topics) for (const tag of topic.tags) topicTags.set(tag, (topicTags.get(tag) ?? 0) + 1)
  }
  ;[...topicTags.entries()]
    .filter(([, n]) => n >= TOPIC_TAG_MIN)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_TOPIC_TAGS)
    .forEach(([tag]) => tags.add(tag))
  const labels = m.interests as Record<string, string>
  return [...tags].filter((t) => TAG.test(t)).map((tag) => ({ tag, label: labels[tag] ?? `#${tag}` }))
})
