export type LinkResolution =
  | { kind: 'guide-file'; path: string }
  | { kind: 'vault-file'; path: string }
  | { kind: 'missing' }

function stripExt(p: string): string {
  return p.replace(/\.md$/i, '')
}

function basename(p: string): string {
  const i = p.lastIndexOf('/')
  return i >= 0 ? p.slice(i + 1) : p
}

function dirname(p: string): string {
  const i = p.lastIndexOf('/')
  return i >= 0 ? p.slice(0, i) : ''
}

function sharedPrefix(a: string, b: string): number {
  const pa = a.split('/')
  const pb = b.split('/')
  let n = 0
  while (n < pa.length && n < pb.length && pa[n] === pb[n]) n++
  return n
}

function normalizeKey(p: string): string {
  return p.normalize('NFC').toLowerCase()
}

export class LinkIndex {
  private readonly byName = new Map<string, string[]>()
  private readonly byPath = new Map<string, string>()
  private readonly guideFiles: Set<string>

  constructor(vaultNotes: readonly string[], guideFiles: readonly string[]) {
    this.guideFiles = new Set(guideFiles)
    for (const note of vaultNotes) {
      const isMd = note.toLowerCase().endsWith('.md')
      const keyPath = normalizeKey(isMd ? stripExt(note) : note)
      this.byPath.set(keyPath, note)
      const name = normalizeKey(basename(isMd ? stripExt(note) : note))
      const list = this.byName.get(name)
      if (list) list.push(note)
      else this.byName.set(name, [note])
    }
  }

  resolve(target: string, fromPath: string): LinkResolution {
    const clean = target.trim().replace(/^\.\//, '')
    if (!clean) return { kind: 'guide-file', path: fromPath }
    const key = normalizeKey(stripExt(clean))
    let found: string | undefined
    if (clean.includes('/')) {
      found = this.byPath.get(key)
      if (!found) {
        const relative = normalizeKey(stripExt(`${dirname(fromPath)}/${clean}`))
        found = this.byPath.get(relative)
      }
      if (!found) {
        for (const [p, note] of this.byPath) {
          if (p.endsWith(`/${key}`)) {
            found = note
            break
          }
        }
      }
    } else {
      const candidates = this.byName.get(key)
      if (candidates && candidates.length > 0) {
        found = candidates.length === 1 ? candidates[0] : this.closest(candidates, fromPath)
      }
    }
    if (!found) return { kind: 'missing' }
    return this.guideFiles.has(found) ? { kind: 'guide-file', path: found } : { kind: 'vault-file', path: found }
  }

  private closest(candidates: readonly string[], fromPath: string): string {
    const fromDir = dirname(fromPath)
    let best = candidates[0]!
    let bestScore = -Infinity
    for (const candidate of candidates) {
      const score = sharedPrefix(dirname(candidate), fromDir) * 1000 - candidate.split('/').length
      if (score > bestScore) {
        bestScore = score
        best = candidate
      }
    }
    return best
  }
}
