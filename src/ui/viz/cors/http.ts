// HTTP message shape shared by the network vizs + a pure CORS model (Fetch spec, simplified:
// no header value length limits, no Access-Control-Expose-Headers).

export interface HttpHeader {
  name: string
  value: string
  // new = just added, ok / bad = decides the check, muted = not important here
  tone?: 'new' | 'ok' | 'bad' | 'muted'
}

export interface HttpMsg {
  id: string
  dir: 'req' | 'res'
  // request line or status line
  line: string
  headers: HttpHeader[]
  tag?: string
  body?: string
  // headers the reader should notice are absent
  missing?: string[]
}

export const SAFELISTED_METHODS = ['GET', 'HEAD', 'POST'] as const
const SAFE_CONTENT_TYPES = ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain']

// CORS-safelisted request header (name + value)
export function isSafelistedHeader(name: string, value: string): boolean {
  switch (name.toLowerCase()) {
    case 'accept':
    case 'accept-language':
    case 'content-language':
      return true
    case 'content-type':
      return SAFE_CONTENT_TYPES.includes(value.split(';')[0]!.trim().toLowerCase())
    case 'range':
      return /^bytes=\d+-\d*$/.test(value.trim())
    default:
      return false
  }
}

export interface CorsRequest {
  method: string
  headers: Record<string, string>
  credentials?: boolean
}

// "simple" request = no preflight
export function needsPreflight(req: CorsRequest): boolean {
  if (!(SAFELISTED_METHODS as readonly string[]).includes(req.method.toUpperCase())) return true
  return Object.entries(req.headers).some(([n, v]) => !isSafelistedHeader(n, v))
}

// headers listed in Access-Control-Request-Headers (lowercase, sorted)
export function unsafeHeaderNames(req: CorsRequest): string[] {
  return Object.entries(req.headers)
    .filter(([n, v]) => !isSafelistedHeader(n, v))
    .map(([n]) => n.toLowerCase())
    .sort()
}

const get = (headers: Record<string, string>, name: string): string | undefined => Object.entries(headers).find(([n]) => n.toLowerCase() === name.toLowerCase())?.[1]
const list = (value: string | undefined) => (value ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)

// CORS check on a response (also applied to the preflight response)
export function corsCheck(res: Record<string, string>, origin: string, credentials = false): { ok: boolean; reason: string } {
  const allow = get(res, 'Access-Control-Allow-Origin')
  if (allow === undefined) return { ok: false, reason: 'немає Access-Control-Allow-Origin' }
  if (allow === '*') return credentials ? { ok: false, reason: '* заборонено разом з credentials' } : { ok: true, reason: '* дозволяє будь-який origin' }
  if (allow !== origin) return { ok: false, reason: 'Allow-Origin не збігається з Origin' }
  if (credentials && get(res, 'Access-Control-Allow-Credentials') !== 'true') return { ok: false, reason: 'немає Access-Control-Allow-Credentials: true' }
  return { ok: true, reason: 'Allow-Origin збігається з Origin' }
}

// preflight response permits the method and every non-safelisted header
export function preflightAllows(res: Record<string, string>, req: CorsRequest, origin: string): boolean {
  if (!corsCheck(res, origin, req.credentials).ok) return false
  // methods are case-sensitive, header names are not
  const methods = (get(res, 'Access-Control-Allow-Methods') ?? '').split(',').map((s) => s.trim())
  const headers = list(get(res, 'Access-Control-Allow-Headers'))
  const wild = !req.credentials
  const methodOk = (SAFELISTED_METHODS as readonly string[]).includes(req.method.toUpperCase()) || methods.includes(req.method) || (wild && methods.includes('*'))
  const headersOk = unsafeHeaderNames(req).every((h) => headers.includes(h) || (wild && headers.includes('*') && h !== 'authorization'))
  return methodOk && headersOk
}

// HttpMsg headers → plain record
export function headerRecord(msg: HttpMsg): Record<string, string> {
  return Object.fromEntries(msg.headers.map((h) => [h.name, h.value]))
}
