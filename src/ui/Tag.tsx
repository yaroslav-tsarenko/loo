import type { ReactNode } from 'react'

export type TagColor = 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red'

const BY_VALUE: Record<string, TagColor> = {
  Junior: 'green',
  Middle: 'yellow',
  Senior: 'orange',
  'Tech Lead': 'purple',
  junior: 'green',
  middle: 'yellow',
  senior: 'orange',
  techlead: 'purple',
  'дуже часто': 'red',
  часто: 'orange',
  іноді: 'blue',
  рідко: 'gray',
  Легка: 'green',
  Середня: 'yellow',
  Складна: 'red',
  easy: 'green',
  medium: 'yellow',
  hard: 'red',
  вивчено: 'green',
  читаю: 'blue',
}

export function tagColor(value: string): TagColor {
  return BY_VALUE[value] ?? 'default'
}

export function Tag({ children, color }: { children: ReactNode; color?: TagColor }) {
  const c = color ?? (typeof children === 'string' ? tagColor(children) : 'default')
  return (
    <span className="tag-pill" data-color={c}>
      {children}
    </span>
  )
}
