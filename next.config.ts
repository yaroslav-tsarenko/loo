import type { NextConfig } from 'next'

// Static security headers for every response (CSP is per-request, with a nonce, in src/proxy.ts).
const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), hid=(), midi=(), browsing-topics=(), display-capture=()',
  },
]

const config: NextConfig = {
  reactCompiler: true,
  typedRoutes: false,
  poweredByHeader: false,
  serverExternalPackages: ['chokidar'],
  // Guides synced from the Obsidian vault (pnpm content:sync) ship with every server function.
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverActions: {
      // Largest legit payload is a task draft (≤ 20k chars); default is 1 MB.
      bodySizeLimit: '256kb',
    },
  },
  devIndicators: false,
  agentRules: false,
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }]
  },
}

export default config
