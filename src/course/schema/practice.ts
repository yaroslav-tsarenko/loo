import { z } from 'zod'
import { COURSE_KINDS, PRACTICE_SECTIONS } from '../practice'

export * from '../practice'

export const CourseKindSchema = z.enum(COURSE_KINDS)
export const PracticeSectionIdSchema = z.enum(PRACTICE_SECTIONS)
