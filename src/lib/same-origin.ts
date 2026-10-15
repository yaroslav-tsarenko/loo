// CSRF guard for plain route handlers (server actions get Next's built-in Origin check).
// Same rule as Next: the Origin host must equal the host the request was sent to.
export function isSameOrigin(headers: Headers): boolean {
  const host = headers.get('x-forwarded-host') ?? headers.get('host')
  if (!host) return false
  const origin = headers.get('origin')
  if (origin) {
    if (origin === 'null') return false
    try {
      return new URL(origin).host === host
    } catch {
      return false
    }
  }
  // No Origin (old browsers): fall back to Fetch Metadata.
  const site = headers.get('sec-fetch-site')
  return site === 'same-origin'
}

// Behind Vercel / a TLS-terminating proxy the scheme comes from x-forwarded-proto.
export function isHttps(url: URL, headers: Headers): boolean {
  return url.protocol === 'https:' || headers.get('x-forwarded-proto') === 'https'
}
