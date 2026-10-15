'use client'

import Form from 'next/form'
import { useId, useRef, type ReactNode } from 'react'

export interface Option {
  value: string
  label: string
  count?: number
}

export interface FilterFormProps {
  action: string
  guides: Option[]
  chapters: Option[]
  levels: Option[]
  frequencies?: Option[]
  types?: { label: string; options: Option[] }
  modes?: Option[]
  sizes: number[]
  values: {
    guide: string | null
    chapter: string | null
    levels: string[]
    frequencies: string[]
    types: string[]
    mode: string
    size: number
  }
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  const id = useId()
  return (
    <div className="filter-row" role="group" aria-labelledby={id}>
      <span className="filter-label" id={id}>
        {label}
      </span>
      {children}
    </div>
  )
}

function Checks({ name, options, selected, legend }: { name: string; options: Option[]; selected: string[]; legend: string }) {
  if (options.length === 0) return null
  return (
    <Group label={legend}>
      <div className="filter-checks">
        {options.map((o) => (
          <label key={o.value} className="check">
            <input type="checkbox" name={name} value={o.value} defaultChecked={selected.includes(o.value)} />
            <span>{o.label}</span>
            {o.count !== undefined ? <span className="check-count tabular">{o.count}</span> : null}
          </label>
        ))}
      </div>
    </Group>
  )
}

export function FilterForm(props: FilterFormProps) {
  const form = useRef<HTMLFormElement>(null)
  const { values } = props
  const submit = () => form.current?.requestSubmit()
  return (
    <Form ref={form} action={props.action} className="filters" onChange={submit} scroll={false} replace>
      <div className="filter-row">
        <label className="filter-label" htmlFor="f-guide">
          Посібник
        </label>
        <select
          id="f-guide"
          name="guide"
          className="select"
          defaultValue={values.guide ?? ''}
          onChange={() => {
            const chapter = form.current?.elements.namedItem('chapter')
            if (chapter instanceof HTMLSelectElement) chapter.value = ''
          }}
        >
          <option value="">Усі посібники</option>
          {props.guides.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
              {g.count !== undefined ? ` · ${g.count}` : ''}
            </option>
          ))}
        </select>
      </div>
      {props.chapters.length > 0 ? (
        <div className="filter-row">
          <label className="filter-label" htmlFor="f-chapter">
            Розділ
          </label>
          <select id="f-chapter" name="chapter" className="select" defaultValue={values.chapter ?? ''}>
            <option value="">Усі розділи</option>
            {props.chapters.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
                {c.count !== undefined ? ` · ${c.count}` : ''}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <Checks name="level" legend="Рівень" options={props.levels} selected={values.levels} />
      {props.frequencies ? <Checks name="freq" legend="Частота" options={props.frequencies} selected={values.frequencies} /> : null}
      {props.types ? <Checks name="type" legend={props.types.label} options={props.types.options} selected={values.types} /> : null}
      {props.modes ? (
        <Group label="Черга">
          <div className="segmented">
            {props.modes.map((m) => (
              <label key={m.value}>
                <input type="radio" name="mode" value={m.value} defaultChecked={values.mode === m.value} />
                <span>{m.label}</span>
              </label>
            ))}
          </div>
        </Group>
      ) : null}
      <Group label="Розмір сесії">
        <div className="segmented">
          {props.sizes.map((s) => (
            <label key={s}>
              <input type="radio" name="size" value={s} defaultChecked={values.size === s} />
              <span className="tabular">{s}</span>
            </label>
          ))}
        </div>
      </Group>
      <noscript>
        <button type="submit" className="ui-button" data-variant="ghost">
          Застосувати
        </button>
      </noscript>
    </Form>
  )
}
