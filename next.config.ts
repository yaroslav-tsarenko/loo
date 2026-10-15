import type { NextConfig } from 'next'

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
  },
  devIndicators: false,
  agentRules: false,
}

export default config
