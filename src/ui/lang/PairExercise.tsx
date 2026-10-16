import { AudioButton } from './AudioButton'
import { IpaChip } from './IpaChip'

// [!pair] minimal pairs: the learner hears one of two words (fetched on play) and picks it. The options are the two
// words with their IPA; which one sounds is known only to the server.

export function PairAudio({ unitId, lang }: { unitId: string; lang: string }) {
  return (
    <div className="lang-listen lang-pair">
      <AudioButton unitId={unitId} lang={lang} size="lg" accentSwitch label="Прослухати слово" />
      <p className="lang-listen-hint">Слухай уважно: слова відрізняються одним звуком.</p>
    </div>
  )
}

export function PairOption({ word, ipa, lang }: { word: string; ipa: string | null; lang: string }) {
  return (
    <span className="lang-pair-option">
      <span lang={lang}>{word}</span>
      <IpaChip ipa={ipa} />
    </span>
  )
}
