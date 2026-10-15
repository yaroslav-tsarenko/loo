import type { CourseBundle, Lesson, Section, Topic } from '../schema'

export interface CourseLookup {
  sections: Map<string, Section>
  topics: Map<string, Topic>
  lessons: Map<string, Lesson>
}

const cache = new WeakMap<CourseBundle, CourseLookup>()

// Accepts full ids (`course:section`) and bare keys (`section`) for sections and topics.
export function lookup(bundle: CourseBundle): CourseLookup {
  let index = cache.get(bundle)
  if (index) return index
  index = { sections: new Map(), topics: new Map(), lessons: new Map() }
  for (const s of bundle.sections) {
    index.sections.set(s.id, s)
    index.sections.set(s.key, s)
    for (const t of s.topics) {
      index.topics.set(t.id, t)
      if (!index.topics.has(t.key)) index.topics.set(t.key, t)
      for (const l of t.lessons) index.lessons.set(l.id, l)
    }
  }
  cache.set(bundle, index)
  return index
}
