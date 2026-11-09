import type { NextConfig } from 'next'

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
  typedRoutes: false,
  poweredByHeader: false,
  serverExternalPackages: ['chokidar'],
  // What ships with every server function (docs/fullstack/stage1/01-storage.md §6): the Markdown of the guides
  // (articles are parsed from it on demand), the compiled course bundles and their catalog, and the build's content
  // files in `.snapshot/` (a dot directory, so each is named): the manifest, the index, the per-guide packs and the
  // unit rows — plus the monolithic guides.v8.br, the rollback of CONTENT_SHARDS=0. The prebuilt search index (4 MB,
  // ~130 MB once loaded) goes only to /api/search; the course packages' sources and the other content never ship.
  outputFileTracingIncludes: {
    '/**': [
      './content/Guides/**/*',
      './content/glossary/**/*',
      './content/courses/*.json',
      './content/.snapshot/manifest.json',
      './content/.snapshot/index.v8.br',
      './content/.snapshot/units-sync.json.br',
      './content/.snapshot/guides/*.pack',
      './content/.snapshot/guides.v8.br',
      './blog/**/*.md',
    ],
    '/api/search': ['./content/.snapshot/search.json.br'],
  },
  outputFileTracingExcludes: {
    // the search index is found by tracing the `.snapshot/` directory: keep it out of every function; /api/search's
    // include above still wins
    '/**': ['./content/courses/*/**', './content/.snapshot/search.json.br'],
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
