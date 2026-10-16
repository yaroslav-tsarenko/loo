import Link from 'next/link'
import type { HTMLAttributes, ReactNode } from 'react'
import { cx, type Tone } from './cx'

export type CardVariant = 'flat' | 'raised' | 'interactive'

interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant
  /** Colors border + lip; `selected` is a shortcut for the violet choice state. */
  tone?: Tone
  selected?: boolean
  /** Renders a Next link (implies interactive). */
  href?: string
  as?: 'div' | 'section' | 'article' | 'li'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children?: ReactNode
}

export function Card({ variant = 'flat', tone, selected, href, as: Tag = 'div', padding = 'md', className, children, ...rest }: CardProps) {
  const data = {
    'data-variant': href ? 'interactive' : variant,
    'data-tone': selected ? 'violet' : tone,
    'data-selected': selected ? '' : undefined,
    'data-pad': padding,
  }
  if (href) {
    return (
      <Link href={href} className={cx('lu-card', className)} {...data} {...(rest as HTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    )
  }
  return (
    <Tag className={cx('lu-card', className)} {...data} {...rest}>
      {children}
    </Tag>
  )
}
