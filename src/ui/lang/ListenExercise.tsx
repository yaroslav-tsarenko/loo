'use client'

import { AudioButton } from './AudioButton'

// The audio part of a [!listen] item: a big play button (the lines are fetched from the server on play — the client
// never holds the transcript before that), a slow button and a hint. Options / dictation input come from QuizInline.
export function ListenExercise({ unitId, lang, slow, dialogue }: { unitId: string; lang: string; slow: boolean; dialogue: boolean }) {
  return (
    <div className="lang-listen">
      <AudioButton unitId={unitId} lang={lang} slow={slow} size="lg" accentSwitch label="Прослухати" />
      <p className="lang-listen-hint">{dialogue ? 'Діалог — слухай обидва голоси. ' : ''}Можна слухати кілька разів; черепаха — повільніше.</p>
    </div>
  )
}
