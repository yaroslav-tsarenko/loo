'use server'

import { z } from 'zod'
import type { AudioLine } from '@/content/model'
import { requireUser } from '../auth'
import { ids, parseInput } from '../auth-guard'
import { getContent } from '../content'
import { limitUser } from '../courses/limits'

// Speech for language courses, v1 = free browser speech (docs/SPEECH.md, owner's decision):
// * speechLines — what to say for a listening item / minimal pair. Browser TTS needs the text, so it reaches the client,
//   but only when the learner presses play: graded payloads (lessons, tests, placement) never carry it or the key.
// * a [!speak] attempt is checked by answerQuiz (src/server/actions/answers.ts → speakOutcome): recognition runs in the
//   browser (Web Speech API) and the client sends ONLY the transcript(s) — no audio is uploaded or stored.

const linesInput = z.object({ unitId: ids.unit })

export interface SpeechLines {
  lines: AudioLine[]
  slow: boolean
}

export async function speechLines(raw: { unitId: string }): Promise<SpeechLines> {
  const user = await requireUser()
  const input = parseInput(linesInput, raw)
  await limitUser(user.id, 'audio')
  const snapshot = await getContent()
  // placement bank items play through the same path (the test never ships their transcript)
  const unit = snapshot.units.get(input.unitId) ?? snapshot.placementUnits.get(input.unitId)
  if (unit?.kind === 'quiz' && unit.listen) return { lines: unit.listen.lines, slow: unit.listen.slow }
  if (unit?.kind === 'quiz' && unit.pair) return { lines: [{ speaker: null, text: unit.pair.say }], slow: false }
  throw new Error('No audio')
}
