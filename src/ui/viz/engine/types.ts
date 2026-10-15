// A step-through scenario is pure data: source code + frames. Each frame is a full
// snapshot (not a diff), so back/scrub is trivial and frames are easy to test.

export interface Frame {
  // 1-based line in `code` that is executing (null = between lines / engine work)
  line: number | null
  // 1–2 sentences in Ukrainian: what just happened and why
  note: string
}

export interface StepScenario<F extends Frame = Frame> {
  code: string
  frames: readonly F[]
}

// Something that moves between panels (stack frame, queued callback…). `id` keeps
// identity across frames so motion can slide it from one panel to another.
export interface Token {
  id: string
  label: string
  hint?: string
}

export const tok = (id: string, label: string, hint?: string): Token => (hint ? { id, label, hint } : { id, label })

export function codeLines(code: string): string[] {
  return code.replace(/\n+$/, '').split('\n')
}

export interface VizProps {
  scenario: string
}
