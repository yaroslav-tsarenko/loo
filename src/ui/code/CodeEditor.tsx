'use client'

import { useRef, type KeyboardEvent } from 'react'
import { highlightCode } from './tokens'

interface Props {
  id?: string
  value: string
  onChange: (value: string) => void
  onRun?: () => void
  label: string
  minLines?: number
  readOnly?: boolean
}

const INDENT = '  '
const PAIRS: Record<string, string> = { '{': '}', '[': ']', '(': ')' }

// Insert via execCommand so the native undo stack survives; fall back to setRangeText.
function insert(el: HTMLTextAreaElement, text: string, from = el.selectionStart, to = el.selectionEnd) {
  el.setSelectionRange(from, to)
  if (!document.execCommand('insertText', false, text)) {
    el.setRangeText(text, from, to, 'end')
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

function lineStart(value: string, pos: number): number {
  return value.lastIndexOf('\n', pos - 1) + 1
}

// Textarea editor: 2-space tabs, auto-indent, line numbers, cheap highlight overlay. No dependencies.
export function CodeEditor({ id, value, onChange, onRun, label, minLines = 6, readOnly = false }: Props) {
  const area = useRef<HTMLTextAreaElement>(null)
  const overlay = useRef<HTMLPreElement>(null)
  // Esc releases Tab so keyboard users can leave the editor
  const tabTrap = useRef(true)
  const lines = value.split('\n').length
  const rows = Math.max(minLines, lines)

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget
    const { selectionStart: start, selectionEnd: end, value: text } = el
    if (e.key === 'Escape') {
      tabTrap.current = false
      return
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onRun?.()
      return
    }
    if (e.key === 'Tab' && tabTrap.current && !e.altKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault()
      const from = lineStart(text, start)
      const multiline = text.slice(start, end).includes('\n')
      if (!e.shiftKey && !multiline) return insert(el, INDENT)
      // (Shift+)Tab over a selection indents / outdents whole lines
      const to = end
      const block = text.slice(from, to)
      const next = e.shiftKey ? block.replace(/^ {1,2}/gm, '') : block.replace(/^/gm, INDENT)
      insert(el, next, from, to)
      el.setSelectionRange(from, from + next.length)
      return
    }
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey && start === end) {
      e.preventDefault()
      const from = lineStart(text, start)
      const indent = /^[ \t]*/.exec(text.slice(from, start))![0]
      const before = text[start - 1] ?? ''
      const after = text[start] ?? ''
      if (PAIRS[before]) {
        // {|} → {\n  |\n}
        if (PAIRS[before] === after) {
          insert(el, `\n${indent}${INDENT}\n${indent}`)
          const caret = start + 1 + indent.length + INDENT.length
          el.setSelectionRange(caret, caret)
        } else insert(el, `\n${indent}${INDENT}`)
        return
      }
      insert(el, `\n${indent}`)
      return
    }
    if (e.key === '}' && start === end) {
      // typing } on a whitespace-only line dedents it
      const from = lineStart(text, start)
      const head = text.slice(from, start)
      if (head.length >= 2 && /^ +$/.test(head)) {
        e.preventDefault()
        insert(el, `${head.slice(2)}}`, from, start)
      }
    }
    tabTrap.current = true
  }

  return (
    <div className="code-editor" data-readonly={readOnly ? '' : undefined}>
      <div className="code-editor-gutter" aria-hidden="true">
        {Array.from({ length: rows }, (_, i) => (
          <span key={i} data-empty={i >= lines ? '' : undefined}>
            {i + 1}
          </span>
        ))}
      </div>
      <div className="code-editor-surface">
        <pre className="code-editor-overlay" ref={overlay} aria-hidden="true">
          {highlightCode(value)}
          {'\n'}
        </pre>
        <textarea
          id={id}
          ref={area}
          className="code-editor-input"
          aria-label={label}
          value={value}
          rows={rows}
          readOnly={readOnly}
          wrap="off"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          data-gramm="false"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onScroll={(e) => {
            if (overlay.current) overlay.current.scrollLeft = e.currentTarget.scrollLeft
          }}
        />
      </div>
    </div>
  )
}
