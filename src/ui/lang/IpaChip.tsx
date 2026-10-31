'use client'

import { useSpeechSettings } from './SpeechSettings'
import { ipaShown } from './speech/voices'

// Inline IPA transcription chip. With a separate American transcription, follows the accent setting; without one (German,
// most targets) it shows the single transcription with no UK / US tag.
export function IpaChip({ ipa, ipaUs, className }: { ipa: string | null; ipaUs?: string | null; className?: string }) {
  const { accent } = useSpeechSettings()
  const { text: shown, region } = ipaShown(ipa, ipaUs, accent)
  if (!shown) return null
  return (
    <span className={className ? `lang-ipa ${className}` : 'lang-ipa'} title="Транскрипція (IPA)">
      <span className="lang-ipa-text">{shown}</span>
      {region ? <span className="lang-ipa-region">{region}</span> : null}
    </span>
  )
}
