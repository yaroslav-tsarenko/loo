'use client'

import { FileText, Braces, Layers, ListChecks, Search, CornerDownLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { OPEN_PALETTE } from '@/ui/shell/constants'
import { ALL_PRACTICE_NAV } from '@/ui/shell/course-nav'
import { usePractice } from '@/ui/shell/NavLinks'

interface Hit {
  id: string
  type: 'chapter' | 'flashcard' | 'quiz' | 'task' | 'command'
  title: string
  context: string
  href: string
}

const TYPE_LABEL: Record<Hit['type'], string> = {
  command: 'Дія',
  chapter: 'Розділ',
  flashcard: 'Картка',
  quiz: 'Тест',
  task: 'Задача',
}

const COMMANDS: Hit[] = [
  { id: 'cmd:review', type: 'command', title: 'Почати повторення карток', context: 'Картки на сьогодні', href: '/review' },
  { id: 'cmd:quiz', type: 'command', title: 'Новий тест', context: 'Сесія на 10 питань', href: '/quiz' },
  { id: 'cmd:mistakes', type: 'command', title: 'Мої помилки', context: 'Пройти помилки окремою сесією', href: '/mistakes' },
  { id: 'cmd:tasks', type: 'command', title: 'Задачі', context: 'За складністю', href: '/tasks' },
  { id: 'cmd:roadmap', type: 'command', title: 'Роадмапа', context: 'Що далі', href: '/roadmap' },
  { id: 'cmd:profile', type: 'command', title: 'Профіль і статистика', context: 'XP, точність, активність', href: '/profile' },
  { id: 'cmd:settings', type: 'command', title: 'Налаштування', context: 'Vault, тема, звук, мета', href: '/settings' },
]

const PRACTICE_HREFS = new Set(ALL_PRACTICE_NAV.map((p) => p.href))

let warmed = false

export function CommandPalette() {
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<Hit[]>(COMMANDS)
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(false)
  const listId = useId()

  const open = useCallback(() => {
    const d = dialog.current
    if (!d || d.open) return
    // the server builds the search index on demand: start it while the learner types
    if (!warmed) {
      warmed = true
      void fetch('/api/search?warm=1').catch(() => {})
    }
    d.showModal()
    requestAnimationFrame(() => input.current?.select())
  }, [])

  const close = useCallback(() => dialog.current?.close(), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (dialog.current?.open) close()
        else open()
      } else if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_PALETTE, open)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_PALETTE, open)
    }
  }, [open, close])

  useEffect(() => {
    const q = query.trim()
    if (!q) return
    const controller = new AbortController()
    const t = window.setTimeout(() => {
      setLoading(true)
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((r) => r.json() as Promise<{ hits: Hit[] }>)
        .then((d) => {
          const lower = q.toLowerCase()
          const commands = COMMANDS.filter((c) => c.title.toLowerCase().includes(lower))
          setHits([...commands, ...d.hits])
          setActive(0)
          setLoading(false)
        })
        .catch(() => {})
    }, 90)
    return () => {
      controller.abort()
      window.clearTimeout(t)
    }
  }, [query])

  // Practice commands only for sections the active course has (no «Задачі» in a language course).
  const own = new Set(usePractice().map((p) => p.href))
  const offered = (h: Hit) => h.type !== 'command' || !PRACTICE_HREFS.has(h.href) || own.has(h.href)
  const shown = (query.trim() ? hits : COMMANDS).filter(offered)

  const go = (hit: Hit | undefined) => {
    if (!hit) return
    close()
    router.push(hit.href)
  }

  return (
    <>
      <dialog
        ref={dialog}
        className="palette"
        aria-label="Пошук"
        onClick={(e) => {
          if (e.target === dialog.current) close()
        }}
        onClose={() => setQuery('')}
      >
        <div className="palette-box">
          <div className="palette-search">
            <Search size={18} strokeWidth={1.8} aria-hidden="true" />
            <input
            ref={input}
            className="palette-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            placeholder="Тема, питання або дія…"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={shown[active] ? `${listId}-${active}` : undefined}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((a) => Math.min(shown.length - 1, a + 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((a) => Math.max(0, a - 1))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                go(shown[active])
              }
            }}
          />
          </div>
          <ul className="palette-list" id={listId} role="listbox">
            {shown.map((hit, i) => (
              <li
                key={hit.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className="palette-item"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(hit)}
              >
                <TypeIcon type={hit.type} />
                <span className="palette-text">
                  <span className="palette-title">{hit.title}</span>
                  <span className="palette-context">
                    {TYPE_LABEL[hit.type]}
                    {hit.context ? ` · ${hit.context}` : ''}
                  </span>
                </span>
                {i === active ? <CornerDownLeft className="palette-enter" size={14} strokeWidth={1.8} aria-hidden="true" /> : null}
              </li>
            ))}
            {shown.length === 0 && !loading ? <li className="palette-empty">Нічого не знайдено. Спробуйте коротше слово.</li> : null}
          </ul>
          <div className="palette-foot">
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> вибір
            </span>
            <span>
              <kbd>Enter</kbd> відкрити
            </span>
            <span>
              <kbd>Esc</kbd> закрити
            </span>
          </div>
        </div>
      </dialog>
    </>
  )
}

function TypeIcon({ type }: { type: Hit['type'] }) {
  const Icon = type === 'flashcard' ? Layers : type === 'quiz' ? ListChecks : type === 'task' ? Braces : type === 'command' ? CornerDownLeft : FileText
  return <Icon className="palette-icon" size={18} strokeWidth={1.6} aria-hidden="true" />
}
