import { realpath } from 'node:fs/promises'
import path from 'node:path'

// Resolves `relative` inside `root` and returns the real path only if it stays inside root —
// after following symlinks, so a link in the vault can't point at /etc or ~/.ssh.
export async function resolveInside(root: string, relative: string): Promise<string | null> {
  if (typeof relative !== 'string' || relative.length === 0 || relative.length > 1024 || relative.includes('\0')) return null
  if (path.isAbsolute(relative)) return null
  const base = path.resolve(root)
  const candidate = path.resolve(base, relative)
  if (!isWithin(base, candidate)) return null
  try {
    const [realBase, realCandidate] = await Promise.all([realpath(base), realpath(candidate)])
    return isWithin(realBase, realCandidate) ? realCandidate : null
  } catch {
    return null
  }
}

export function isWithin(base: string, candidate: string): boolean {
  const rel = path.relative(base, candidate)
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel)
}
