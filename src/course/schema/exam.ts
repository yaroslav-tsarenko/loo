import { z } from 'zod'
import { CEFR_LEVELS } from './level'

// course.yaml `exam:` — the external exam a language course maps its CEFR levels onto (docs/LANGUAGE_COURSE.md
// «Нова мова: що задати»). Course data, not code: English → IELTS, German → Goethe-Zertifikat (+ TestDaF / DSH).
// The placement result, the per-skill card and the test summary show «<name> ~<band>»; a course without `exam`
// shows no exam line at all.
//
//   exam:
//     id: ielts
//     name: IELTS
//     below: 'нижче 4.0'
//     bands: { B1: '4.0–5.0', B2: '5.5–6.5', C1: '7.0–8.0', C2: '8.5–9.0' }

const CefrLevelSchema = z.enum(CEFR_LEVELS)
const label = z.string().min(1).max(80)

export const CourseExamSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'exam.id: [a-z0-9-]'),
  // shown before the band: «IELTS ~5.5–6.5», «Goethe-Zertifikat ~B1»
  name: z.string().min(1).max(40),
  // CEFR level → band text («5.5–6.5», «A1 (Start Deutsch 1)»); a level may be missing
  bands: z.partialRecord(CefrLevelSchema, label),
  // the text for a level without a band («нижче 4.0»); absent → no exam line for that level
  below: label.optional(),
  // extra labels per level, appended as « · …» (TestDaF TDN 4 · DSH-2)
  also: z.partialRecord(CefrLevelSchema, label).optional(),
  // under the placement result (what the estimate does not cover); absent → the generic text (i18n placement.examNote)
  note: z.string().min(1).max(400).optional(),
})
export type CourseExam = z.infer<typeof CourseExamSchema>
