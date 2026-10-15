'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useState, useTransition } from 'react'
import { markNewsRead, toggleNewsSaved } from '@/server/actions/news'
import { count } from '@/ui/format'

export interface NewsRowProps {
  id: string
  url: string
  title: string
  emoji: string
  tagLabel: string
  summary: string | null
  source: string
  when: string
  score: number
  read: boolean
  saved: boolean
}

export function NewsRow(props: NewsRowProps) {
  const [read, setRead] = useState(props.read)
  const [saved, setSaved] = useState(props.saved)
  const [, start] = useTransition()

  // Opening the link (also via middle click) marks the item as read without blocking navigation.
  const open = () => {
    if (read) return
    setRead(true)
    start(() => markNewsRead(props.id))
  }

  const toggleSave = () => {
    setSaved(!saved)
    start(async () => {
      const res = await toggleNewsSaved(props.id)
      setSaved(res.saved)
    })
  }

  return (
    <li className="news-row" data-read={read ? '' : undefined}>
      <span className="news-emoji" role="img" aria-label={props.tagLabel} title={props.tagLabel}>
        {props.emoji}
      </span>
      <div className="news-body">
        <a className="news-title" href={props.url} target="_blank" rel="noopener noreferrer" onClick={open} onAuxClick={open}>
          {props.title}
        </a>
        {props.summary ? <p className="news-summary">{props.summary}</p> : null}
        <p className="news-meta">
          <span>{props.source}</span>
          <span aria-hidden="true">·</span>
          <span>{props.when}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular" title="Корисність, 0–100">
            {count(props.score, 'бал', 'бали', 'балів')}
          </span>
        </p>
      </div>
      <button type="button" className="news-save" aria-pressed={saved} aria-label={saved ? 'Прибрати зі збереженого' : 'Зберегти'} title={saved ? 'Прибрати зі збереженого' : 'Зберегти'} onClick={toggleSave}>
        {saved ? <BookmarkCheck size={17} strokeWidth={1.8} aria-hidden="true" /> : <Bookmark size={17} strokeWidth={1.6} aria-hidden="true" />}
      </button>
    </li>
  )
}
