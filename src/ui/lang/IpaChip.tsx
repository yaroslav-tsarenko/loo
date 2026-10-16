'use client'

import { useSpeechSettings } from './SpeechSettings'

// Inline IPA transcription chip. With a separate American transcription, follows the accent setting.
export function IpaChip({ ipa, ipaUs, className }: { ipa: string | null; ipaUs?: string | null; className?: string }) {
  const { accent } = useSpeechSettings()
  const shown = accent === 'en-US' && ipaUs ? ipaUs : ipa ?? ipaUs
  if (!shown) return null
  const region = accent === 'en-US' && ipaUs ? 'US' : ipaUs ? 'UK' : null
  return (
    <span className={className ? `lang-ipa ${className}` : 'lang-ipa'} title="Транскрипція (IPA)">
      <span className="lang-ipa-text">{shown}</span>
      {region ? <span className="lang-ipa-region">{region}</span> : null}
    </span>
  )
}
