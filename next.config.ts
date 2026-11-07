import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { NextConfig } from 'next'

// Version of the pixel icon sprite (/pixel-icons.svg): a hash of the grids and the palette, so the URL changes exactly
// when the art does and browsers can cache it as immutable (src/ui/design/PixelIcon.tsx).
const PIXEL_DIR = path.join(process.cwd(), 'src/ui/design/pixel-icons')
const pixelSprite = createHash('sha256')
  .update(['../pixel-sprite.ts', ...readdirSync(PIXEL_DIR).sort()].map((f) => readFileSync(path.join(PIXEL_DIR, f))).join('\0'))
  .digest('hex')
  .slice(0, 12)

// Static security headers for every response (CSP is per-request, with a nonce, in src/proxy.ts).
const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  // microphone=(self): [!speak] pronunciation practice records in the browser (docs/SPEECH.md §4); nothing else may
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(self), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), hid=(), midi=(), browsing-topics=(), display-capture=()',
  },
]

const config: NextConfig = {
  reactCompiler: true,
  env: { NEXT_PUBLIC_PIXEL_SPRITE: pixelSprite },
  typedRoutes: false,
  poweredByHeader: false,
  serverExternalPackages: ['chokidar'],
  // Guides synced from the Obsidian vault (pnpm content:sync) ship with every server function, with the parsed
  // snapshot vercel-build writes (pnpm content:snapshot; a dot directory, so it is named explicitly).
  outputFileTracingIncludes: {
    '/**': ['./content/**/*', './content/.snapshot/*', './blog/**/*.md'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Client router cache: a page visited (or fully prefetched — the bottom bar) in the last 30 s / 5 min opens
    // instantly instead of waiting for a server render. Server actions revalidate what they change, which clears it.
    staleTimes: { dynamic: 30, static: 300 },
    serverActions: {
      // Largest legit payload is a task draft (≤ 20k chars); default is 1 MB.
      bodySizeLimit: '256kb',
    },
  },
  devIndicators: false,
  agentRules: false,
  async headers() {
    return [
      { source: '/:path*', headers: SECURITY_HEADERS },
      // App icons and the manifest are prerendered and change only with a deploy (the HTML links them with a content
      // hash): browsers and the CDN may keep them for a day and revalidate in the background.
      ...['/icon', '/apple-icon', '/favicon.ico', '/manifest.webmanifest'].map((source) => ({
        source,
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      })),
    ]
  },
}

export default config
