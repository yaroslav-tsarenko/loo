import type { WordSpec } from '@/content/model'
import { AudioButton } from './AudioButton'
import { IpaChip } from './IpaChip'

// [!word] card faces (docs/LANGUAGE_COURSE.md). Plain components (no hooks): the server renders them as a FlashItem's
// question / answer, so «Слова», lessons, mistakes and the feed show the same card. Audio and IPA are client islands.

const POS_LABEL: Record<string, string> = {
  noun: 'іменник',
  verb: 'дієслово',
  adj: 'прикметник',
  adjective: 'прикметник',
  adv: 'прислівник',
  adverb: 'прислівник',
  prep: 'прийменник',
  pron: 'займенник',
  conj: 'сполучник',
  phrase: 'фраза',
  num: 'числівник',
  det: 'детермінатив',
  interj: 'вигук',
}

export const posLabel = (pos: string | null): string | null => (pos ? POS_LABEL[pos.toLowerCase()] ?? pos : null)

// Highlights the author's bold words inside an example.
function Example({ en, bold }: { en: string; bold: readonly string[] }) {
  if (bold.length === 0) return <>{en}</>
  const re = new RegExp(`(${bold.map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return (
    <>
      {en.split(re).map((part, i) =>
        bold.some((b) => b.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="lang-word-hl">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

export function WordFront({ word, lang }: { word: WordSpec; lang: string }) {
  const pos = posLabel(word.pos)
  return (
    <div className="lang-word-front">
      <span className="lang-word-text" lang={lang}>
        {word.word}
      </span>
      <span className="lang-word-meta">
        <IpaChip ipa={word.ipa} ipaUs={word.ipaUs} />
        {pos ? <span className="lang-word-pos">{pos}</span> : null}
      </span>
      <AudioButton text={word.word} lang={lang} size="lg" accentSwitch label={`Прослухати «${word.word}»`} />
    </div>
  )
}

export function WordBack({ word, lang }: { word: WordSpec; lang: string }) {
  return (
    <div className="lang-word-back">
      {word.translations.length > 0 ? <p className="lang-word-tr">{word.translations.join('; ')}</p> : null}
      {word.examples.length > 0 ? (
        <ul className="lang-word-examples">
          {word.examples.map((e, i) => (
            <li key={i}>
              <AudioButton text={e.en} lang={lang} size="sm" showSlow={false} label="Прослухати приклад" />
              <span>
                <span className="lang-word-en" lang={lang}>
                  <Example en={e.en} bold={e.bold} />
                </span>
                {e.tr ? <span className="lang-word-ex-tr"> — {e.tr}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {word.forms ? (
        <p className="lang-word-forms">
          <span className="unit-meta">Форми:</span> <span lang={lang}>{word.forms}</span>
        </p>
      ) : null}
      {word.note ? <p className="lang-word-note">{word.note}</p> : null}
    </div>
  )
}

// In an article: the front is always visible, the back opens like a flashcard.
export function WordInline({ id, word, lang, level }: { id: string; word: WordSpec; lang: string; level: string | null }) {
  return (
    <details className="lang-word unit-flash" id={`u-${id}`} data-level={level ?? undefined}>
      <summary>
        <span className="toggle-arrow" aria-hidden="true" />
        <WordFront word={word} lang={lang} />
      </summary>
      <WordBack word={word} lang={lang} />
    </details>
  )
}
