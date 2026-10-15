// Pure simulation of debounce (trailing) and throttle (leading + trailing, like
// lodash defaults) over a list of event timestamps, evaluated at `now`.

export interface DebounceResult {
  fired: number[]
  // when the pending trailing call will fire (null if nothing pending)
  pendingAt: number | null
}

export function simulateDebounce(events: readonly number[], wait: number, now: number): DebounceResult {
  const sorted = [...events].filter((t) => t <= now).sort((a, b) => a - b)
  const fired: number[] = []
  for (let i = 0; i < sorted.length; i++) {
    const deadline = sorted[i]! + wait
    const next = sorted[i + 1]
    if (next !== undefined ? next >= deadline : deadline <= now) fired.push(deadline)
  }
  const last = sorted.at(-1)
  const pendingAt = last !== undefined && last + wait > now ? last + wait : null
  return { fired, pendingAt }
}

export interface ThrottleResult {
  fired: number[]
  // cool-down windows [start, end) during which calls are deferred
  windows: Array<[number, number]>
  pendingAt: number | null
}

export function simulateThrottle(events: readonly number[], wait: number, now: number): ThrottleResult {
  const sorted = [...events].filter((t) => t <= now).sort((a, b) => a - b)
  const fired: number[] = []
  const windows: Array<[number, number]> = []
  let timerEnd: number | null = null
  let trailing = false
  const expire = (until: number) => {
    while (timerEnd !== null && timerEnd <= until) {
      if (trailing) {
        fired.push(timerEnd)
        windows.push([timerEnd, timerEnd + wait])
        trailing = false
        timerEnd += wait
      } else timerEnd = null
    }
  }
  for (const t of sorted) {
    expire(t)
    if (timerEnd === null) {
      fired.push(t)
      windows.push([t, t + wait])
      timerEnd = t + wait
    } else trailing = true
  }
  expire(now)
  return { fired, windows, pendingAt: trailing ? timerEnd : null }
}
