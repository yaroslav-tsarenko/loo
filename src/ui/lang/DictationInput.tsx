'use client'

import { compareWords } from '@/content/blocks/lang/grade'

// Dictation answer ([!listen] type: dictation). After the server's verdict, the expected text is shown word by word:
// what the learner missed or misspelled is marked (same normalisation as the server: case, punctuation, I'm = I am).
export function DictationInput({ id, value, onChange, disabled, state, expected, onSubmit }: { id: string; value: string; onChange: (v: string) => void; disabled: boolean; state?: 'right' | 'wrong'; expected: string | null; onSubmit: () => void }) {
  const diff = expected && state === 'wrong' ? compareWords(expected, value, { typos: true }) : null
  return (
    <div className="lang-dictation">
      <label className="sr-only" htmlFor={id}>
        Що ти почув?
      </label>
      <textarea
        id={id}
        className="quiz-input lang-dictation-input"
        data-state={state}
        value={value}
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (value.trim()) onSubmit()
          }
        }}
        disabled={disabled}
        placeholder="Надрукуй, що почув — англійською"
        autoComplete="off"
        autoCapitalize="sentences"
        spellCheck={false}
        lang="en"
        enterKeyHint="done"
      />
      {diff ? (
        <p className="lang-diff" aria-label="Правильний текст">
          {diff.words.map((w, i) => (
            <span key={i} className="lang-diff-word" data-ok={w.ok ? '' : undefined} title={w.ok ? undefined : w.heard ? `у тебе: ${w.heard}` : 'пропущено'}>
              {w.text}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  )
}
