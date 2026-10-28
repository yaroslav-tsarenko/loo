import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { isBarePath } from '@/lib/auth-paths'
import { actorLabel, describe as describeAction } from '@/ui/admin/text'

// The admin area (docs/ADMIN.md): every page and action is gated, bans can't be lifted by the learner, the audit log
// reads well.

const read = (path: string) => readFileSync(path, 'utf8')
const pages = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return pages(path)
    return name === 'page.tsx' ? [path] : []
  })

describe('admin access', () => {
  it('every admin page checks access itself', () => {
    const list = pages('src/app/admin')
    expect(list.length).toBeGreaterThanOrEqual(5)
    for (const page of list) expect(read(page), page).toMatch(/await requireAdminArea\(\)/)
  })

  it('every admin action goes through the gate before writing', () => {
    const src = read('src/server/admin/actions.ts')
    const actions = [...src.matchAll(/export async function (\w+)\(form: FormData\)[^{]*\{([\s\S]*?)\n\}/g)]
    expect(actions.length).toBeGreaterThanOrEqual(9)
    for (const [, name, body] of actions) expect(body, name).toMatch(/await apply\(|await actor\(\)/)
    expect(src).toMatch(/async function actor\(\)[^{]*\{\s*const via = await requireAdminArea\(\)/)
  })

  it('a learner cannot unban themselves (ban columns are not in their grants)', () => {
    const grant = read('drizzle/0005_multi_user.sql').match(/GRANT UPDATE \(([^)]*)\) ON public\.profiles TO authenticated/)?.[1] ?? ''
    expect(grant).toContain('display_name')
    expect(grant).not.toMatch(/banned_at|ban_reason|role/)
    expect(read('drizzle/0013_admin.sql')).not.toMatch(/\bGRANT\b/)
  })

  it('the ban page and the admin area render without the app shell', () => {
    expect(isBarePath('/banned')).toBe(true)
    expect(isBarePath('/admin/users/x')).toBe(true)
  })
})

describe('audit log labels', () => {
  it('describes changes', () => {
    expect(describeAction('balance:bucks', { amount: 500 })).toBe('+500')
    expect(describeAction('balance:gems', { amount: -20, asked: -100, note: 'тест' })).toBe('-20 (просили -100) · тест')
    expect(describeAction('hearts', { hearts: 2 })).toBe('= 2')
    expect(describeAction('boost', { hours: 24 })).toBe('+24 год')
    expect(describeAction('ban', { reason: 'спам' })).toBe('спам')
  })

  it('names who did it', () => {
    expect(actorLabel('login')).toBe('адмін-логін')
    expect(actorLabel('role:e54be492-844a')).toBe('акаунт e54be492')
  })
})
