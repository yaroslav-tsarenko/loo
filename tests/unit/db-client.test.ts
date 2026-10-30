import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// postgres-js with `max_pipeline: 0` never calls a transaction's onexecute: every sql.begin() (withUser, drizzle
// transactions — every signed-in page) throws «Cannot set properties of undefined (setting 'onclose')». It shipped
// once (2026-10-28) to stop Supavisor dropping pipelined admin queries; that is solved by running them one at a time.
describe('db client', () => {
  it('never disables pipelining with max_pipeline: 0 (breaks transactions)', () => {
    const src = readFileSync('src/db/client.ts', 'utf8').replace(/\/\/.*$/gm, '')
    expect(src).not.toMatch(/max_pipeline\s*:\s*0/)
  })
})
