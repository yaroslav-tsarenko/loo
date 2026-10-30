export type CourseIssueCode =
  | 'schema'
  | 'missing-guide'
  | 'missing-chapter'
  | 'empty-range'
  | 'duplicate-topic'
  | 'duplicate-id'
  | 'unknown-icon'
  | 'minimum'
  | 'no-level'
  | 'thin-exam'
  | 'thin-placement'
  | 'placement-bank'
  // course.yaml `skills`: a topic / exercise / bank item names a skill the course doesn't declare (error), a topic
  // without a skill (warning)
  | 'unknown-skill'
  | 'topic-skill'
  | 'empty-practice'
  | 'content'
  | 'task'

export interface CourseIssue {
  severity: 'error' | 'warning'
  code: CourseIssueCode
  message: string
  // section key, topic id or file path
  where?: string
}
