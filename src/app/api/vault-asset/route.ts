import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { resolveInside } from '@/lib/path-guard'
import { getContent } from '@/server/content'

const TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
}
const MAX_BYTES = 15 * 1024 * 1024

const notFound = () => new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })

export async function GET(request: Request): Promise<Response> {
  const snapshot = await getContent()
  const wanted = new URL(request.url).searchParams.get('path') ?? ''
  if (!wanted || wanted.length > 1024) return notFound()
  const resolved = snapshot.links.resolve(wanted, `${snapshot.config.guidesDir}/x.md`)
  const rel = resolved.kind === 'missing' ? wanted : resolved.path
  // Images only, and only from inside the vault (symlinks resolved).
  const type = TYPES[path.extname(rel).toLowerCase()]
  if (!type) return notFound()
  const absolute = await resolveInside(snapshot.config.vaultPath, rel)
  if (!absolute || TYPES[path.extname(absolute).toLowerCase()] !== type) return notFound()
  try {
    const info = await stat(absolute)
    if (!info.isFile() || info.size > MAX_BYTES) return notFound()
    const data = await readFile(absolute)
    return new Response(new Uint8Array(data), {
      headers: {
        'Content-Type': type,
        'Cache-Control': 'private, max-age=300',
        // SVG is active content: no scripts, no external loads, no same-origin privileges.
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox",
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': 'inline',
      },
    })
  } catch {
    return notFound()
  }
}
