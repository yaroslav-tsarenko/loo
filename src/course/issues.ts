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
  | 'content'
  | 'task'

export interface CourseIssue {
  severity: 'error' | 'warning'
  code: CourseIssueCode
  message: string
  // section key, topic id or file path
  where?: string
}
