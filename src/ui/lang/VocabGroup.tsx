'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import type { VocabWord } from '@/app/api/vocab/route'
import { AudioButton } from './AudioButton'
import { IpaChip } from './IpaChip'

// A topic of the «Словник курсу»: the words load the first time the group is opened (/api/vocab).
export function VocabGroup({ chapterId, href, lang, summary }: { chapterId: string; href: string; lang: string; summary: ReactNode }) {
  const [words, setWords] = useState<VocabWord[] | null>(null)
  const [failed, setFailed] = useState(false)
  const load = () => {
    if (words || failed) return
    fetch(`/api/vocab?chapter=${encodeURIComponent(chapterId)}`)
      .then((r) => (r.ok ? (r.json() as Promise<{ words: VocabWord[] }>) : Promise.reject(new Error(String(r.status)))))
      .then((d) => setWords(d.words))
      .catch(() => setFailed(true))
  }
  return (
    <details className="issue-group" onToggle={(e) => (e.currentTarget.open ? load() : undefined)}>
      <summary>{summary}</summary>
      {words ? (
        <ul className="lang-vocab">
          {words.map((w) => (
            <li key={w.id}>
              <AudioButton text={w.word} lang={w.lang ?? lang} size="sm" showSlow={false} label={`Прослухати «${w.word}»`} />
              <Link href={`${href}#u-${w.id}`} className="lang-vocab-word" lang={w.lang ?? lang}>
                {w.word}
              </Link>
              <IpaChip ipa={w.ipa} ipaUs={w.ipaUs} />
              <span className="lang-vocab-tr">{w.tr}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="unit-meta" role="status">
          {failed ? 'Не вдалося завантажити слова — спробуй ще раз пізніше.' : 'Завантажую слова…'}
        </p>
      )}
    </details>
  )
}
