import 'server-only'
import { getDb } from '@/db/client'
import { perfEnabled, perfTx } from '../perf'
import { createScope, RLS_PROBE } from './scope-core'

export type { ScopeOptions, ScopeUser } from './scope-core'

const probeKey = Symbol.for('levelup.rls-probe')
type GlobalWithProbe = typeof globalThis & { [probeKey]?: Promise<boolean> }

// Detected once per process: Supabase has the auth schema and the `authenticated` role, PGlite doesn't.
export function rlsActive(): Promise<boolean> {
  const g = globalThis as GlobalWithProbe
  if (!g[probeKey]) {
    g[probeKey] = getDb()
      .execute(RLS_PROBE)
      .then((rows) => Boolean((rows as unknown as Array<{ on: boolean }>)[0]?.on))
      .catch((error: unknown) => {
        g[probeKey] = undefined
        throw error
      })
  }
  return g[probeKey]
}

export const { withUser, currentUserId } = createScope({ db: getDb, rls: rlsActive, ...(perfEnabled ? { onTx: perfTx } : {}) })
