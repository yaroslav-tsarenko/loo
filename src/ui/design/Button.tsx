import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'super' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface Common {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Leading icon (any node: <Icon/>, <GameIcon/>, emoji). */
  icon?: ReactNode
  iconEnd?: ReactNode
  loading?: boolean
  /** Stretch to the container width. */
  block?: boolean
  className?: string
  children?: ReactNode
}

type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common> & { href?: undefined }
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common> & { href: string; prefetch?: boolean }
export type ButtonProps = AsButton | AsLink

function Inner({ icon, iconEnd, loading, children }: Pick<Common, 'icon' | 'iconEnd' | 'loading' | 'children'>) {
  return (
    <>
      <span className="lu-btn-content">
        {icon ? <span className="lu-btn-icon">{icon}</span> : null}
        {children != null ? <span className="lu-btn-label">{children}</span> : null}
        {iconEnd ? <span className="lu-btn-icon">{iconEnd}</span> : null}
      </span>
      {loading ? <span className="lu-spin" aria-hidden="true" /> : null}
    </>
  )
}

// Chunky 3D button: solid lip underneath, drops onto it when pressed.
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', icon, iconEnd, loading, block, className, children, ...rest } = props
  const cls = cx('lu-btn', className)
  const data = { 'data-variant': variant, 'data-size': size, 'data-block': block ? '' : undefined, 'data-loading': loading ? '' : undefined }
  if (typeof rest.href === 'string') {
    const { href, prefetch, ...anchor } = rest as AsLink
    return (
      <Link href={href} prefetch={prefetch} className={cls} {...data} {...anchor} aria-busy={loading || undefined}>
        <Inner icon={icon} iconEnd={iconEnd} loading={loading}>
          {children}
        </Inner>
      </Link>
    )
  }
  const { type = 'button', disabled, ...button } = rest as AsButton
  return (
    <button type={type} className={cls} {...data} {...button} disabled={disabled || loading} aria-busy={loading || undefined}>
      <Inner icon={icon} iconEnd={iconEnd} loading={loading}>
        {children}
      </Inner>
    </button>
  )
}

export type IconButtonVariant = ButtonVariant | 'plain'

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** Required accessible name; also shown as the native tooltip. */
  label: string
  icon: ReactNode
  variant?: IconButtonVariant
  size?: ButtonSize
  round?: boolean
}

export function IconButton({ label, icon, variant = 'plain', size = 'md', round, className, type = 'button', title, ...rest }: IconButtonProps) {
  return (
    <button type={type} className={cx('lu-ibtn', className)} data-variant={variant} data-size={size} data-round={round ? '' : undefined} aria-label={label} title={title ?? label} {...rest}>
      {icon}
    </button>
  )
}
