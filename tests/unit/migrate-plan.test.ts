import { describe, expect, it } from 'vitest'
import { migrationPlan } from '../../scripts/migrate-plan'

const PROD = 'postgres://u:p@db.abc.supabase.co:5432/postgres'
const LOCAL = 'postgres://postgres@127.0.0.1:54329/postgres'

describe('when migrations may run', () => {
  it('Vercel: production only, unless a preview opts in', () => {
    expect(migrationPlan({ VERCEL: '1', VERCEL_ENV: 'production', DATABASE_URL: PROD }, []).run).toBe(true)
    expect(migrationPlan({ VERCEL: '1', VERCEL_ENV: 'preview', DATABASE_URL: PROD }, ['--if-configured'])).toMatchObject({ run: false, fail: false })
    expect(migrationPlan({ VERCEL: '1', VERCEL_ENV: 'development', DATABASE_URL: PROD }, [])).toMatchObject({ run: false, fail: false })
    expect(migrationPlan({ VERCEL: '1', VERCEL_ENV: 'preview', DATABASE_URL: PROD, MIGRATE_ON_PREVIEW: '1' }, []).run).toBe(true)
  })

  it('no database configured: skip on --if-configured, fail otherwise', () => {
    expect(migrationPlan({ VERCEL: '1', VERCEL_ENV: 'production' }, ['--if-configured'])).toMatchObject({ run: false, fail: false })
    expect(migrationPlan({}, [])).toMatchObject({ run: false, fail: true })
  })

  it('outside Vercel: local always, remote only with --prod', () => {
    expect(migrationPlan({ DATABASE_URL: LOCAL }, []).run).toBe(true)
    expect(migrationPlan({ DATABASE_URL: PROD }, [])).toMatchObject({ run: false, fail: true })
    expect(migrationPlan({ DATABASE_URL: PROD }, ['--prod']).run).toBe(true)
    // DIRECT_URL wins over the pooled URL
    expect(migrationPlan({ DIRECT_URL: PROD, DATABASE_URL: LOCAL }, [])).toMatchObject({ run: false, fail: true })
  })
})
