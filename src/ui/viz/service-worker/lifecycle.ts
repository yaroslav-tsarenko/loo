// Service worker lifecycle (ServiceWorker.state) as a pure state machine.

export type SwState = 'parsed' | 'installing' | 'installed' | 'activating' | 'activated' | 'redundant'

export const SW_STATES: ReadonlyArray<{ id: SwState; label: string }> = [
  { id: 'parsed', label: 'parsed' },
  { id: 'installing', label: 'installing' },
  { id: 'installed', label: 'installed' },
  { id: 'activating', label: 'activating' },
  { id: 'activated', label: 'activated' },
  { id: 'redundant', label: 'redundant' },
]

export interface SwContext {
  // the install handler's waitUntil promise fulfilled
  installOk: boolean
  // registration already has an active worker
  hasActive: boolean
  // clients still controlled by that active worker
  controlledClients: number
  skipWaiting: boolean
}

export function nextState(state: SwState, ctx: SwContext): SwState {
  switch (state) {
    case 'parsed':
      return 'installing'
    case 'installing':
      return ctx.installOk ? 'installed' : 'redundant'
    case 'installed':
      // waits while the old worker still controls pages
      return !ctx.hasActive || ctx.controlledClients === 0 || ctx.skipWaiting ? 'activating' : 'installed'
    case 'activating':
      return 'activated'
    default:
      return state
  }
}

export const stateIndex = (s: SwState) => SW_STATES.findIndex((x) => x.id === s)
