// Haptic feedback for phones.
// Android & co: the Vibration API with short patterns.
// iOS Safari has no Vibration API, but since iOS 18 toggling an `<input type="checkbox" switch>`
// fires the system haptic — we keep one hidden switch and click its label. Works inside user gestures.

export type HapticName = 'tap' | 'select' | 'success' | 'error' | 'flip' | 'xp' | 'combo' | 'complete' | 'warning'

const PATTERNS: Record<HapticName, number | number[]> = {
  tap: 8,
  select: 12,
  flip: 10,
  xp: 6,
  success: [14, 50, 24],
  error: [40, 70, 40],
  warning: 30,
  combo: [10, 40, 10, 40, 30],
  complete: [20, 60, 20, 60, 80],
}

// How many system "ticks" to fire on iOS for each pattern (one tick per switch toggle).
const IOS_TICKS: Record<HapticName, number> = { tap: 1, select: 1, flip: 1, xp: 1, success: 2, error: 3, warning: 1, combo: 3, complete: 4 }

let label: HTMLLabelElement | null = null

function iosSwitch(): HTMLLabelElement | null {
  if (label?.isConnected) return label
  if (typeof document === 'undefined') return null
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.setAttribute('switch', '')
  input.id = 'haptic-switch'
  input.tabIndex = -1
  input.setAttribute('aria-hidden', 'true')
  label = document.createElement('label')
  label.htmlFor = input.id
  label.setAttribute('aria-hidden', 'true')
  label.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none'
  label.append(input)
  document.body.append(label)
  return label
}

const isIOS = () => typeof navigator !== 'undefined' && /iP(hone|ad|od)/.test(navigator.userAgent) && !('vibrate' in navigator)

export function haptic(name: HapticName): void {
  if (typeof window === 'undefined') return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches && name !== 'error') return
  if (typeof navigator.vibrate === 'function') {
    navigator.vibrate(PATTERNS[name])
    return
  }
  if (!isIOS()) return
  const el = iosSwitch()
  if (!el) return
  const ticks = IOS_TICKS[name]
  for (let i = 0; i < ticks; i++) {
    if (i === 0) el.click()
    else window.setTimeout(() => el.click(), i * 70)
  }
}
