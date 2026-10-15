import 'server-only'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { supabaseConfig } from '@/lib/supabase/config'

// Supabase client bound to this request's cookies (server components, server actions, route handlers).
// Only used for Auth: data goes through Postgres directly (src/db), never through the Data API.
export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  const config = supabaseConfig()
  if (!config) return null
  const store = await cookies()
  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(toSet) {
        try {
          for (const { name, value, options } of toSet) store.set(name, value, options)
        } catch {
          // Server components can't set cookies; src/proxy.ts refreshes the session before rendering.
        }
      },
    },
  })
}
