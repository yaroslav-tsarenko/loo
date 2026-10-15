import { readFile } from 'node:fs/promises'
import path from 'node:path'
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

export async function GET(request: Request): Promise<Response> {
  const snapshot = await getContent()
  const url = new URL(request.url)
  const wanted = url.searchParams.get('path') ?? ''
  const resolved = snapshot.links.resolve(wanted, `${snapshot.config.guidesDir}/x.md`)
  const rel = resolved.kind === 'missing' ? wanted : resolved.path
  const vault = path.resolve(snapshot.config.vaultPath)
  const absolute = path.resolve(vault, rel)
  const type = TYPES[path.extname(absolute).toLowerCase()]
  if (!type || !absolute.startsWith(vault + path.sep)) return new Response('Not found', { status: 404 })
  try {
    const data = await readFile(absolute)
    return new Response(new Uint8Array(data), { headers: { 'Content-Type': type, 'Cache-Control': 'private, max-age=300', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:" } })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
