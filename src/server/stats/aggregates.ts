import 'server-only'
import { cache } from 'react'
import type { StatsAggregates } from '@/progress/stats'
import { userScope } from '../auth'
import { loadAggregates } from './queries'

// The signed-in user's aggregates, once per request (the profile page and the coach card share them).
export const statsAggregates = cache(async (): Promise<StatsAggregates> => userScope((db, userId) => loadAggregates(db, userId, Date.now())))
